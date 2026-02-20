/**
 * @fileoverview Chain Validation Utilities
 * Part of Phase 50D: Workflow Engine Integration
 * 
 * Provides advanced validation for chains including:
 * - Circular dependency detection
 * - Missing variable detection
 * - Step reference validation
 * - Suggestion generation
 * 
 * @module workflow-engine/chain-validate
 * @version 1.0.0
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} type - Error type
 * @property {string} message - Error message
 * @property {string} [stepId] - Related step ID
 * @property {string} [variable] - Related variable
 * @property {string} [suggestion] - Fix suggestion
 */

/**
 * @typedef {Object} ValidationWarning
 * @property {string} type - Warning type
 * @property {string} message - Warning message
 * @property {string} [stepId] - Related step ID
 */

/**
 * @typedef {Object} DetailedValidationResult
 * @property {boolean} valid - Whether chain is valid
 * @property {ValidationError[]} errors - Validation errors
 * @property {ValidationWarning[]} warnings - Validation warnings
 * @property {object} suggestions - Fix suggestions
 * @property {object} analysis - Chain analysis
 */

/**
 * Validate chain with detailed output
 * @param {object} chain - Chain to validate
 * @returns {DetailedValidationResult}
 */
function validateChainDetailed(chain) {
  const errors = [];
  const warnings = [];
  const suggestions = { errors: [], warnings: [] };
  const analysis = analyzeChain(chain);

  // Check basic structure
  if (!chain) {
    errors.push({
      type: 'structure',
      message: 'Chain is null or undefined'
    });
    return { valid: false, errors, warnings, suggestions, analysis };
  }

  if (!chain.steps || !Array.isArray(chain.steps)) {
    errors.push({
      type: 'structure',
      message: 'Chain must have a steps array',
      suggestion: 'Add a steps array to your chain definition'
    });
    return { valid: false, errors, warnings, suggestions, analysis };
  }

  if (chain.steps.length === 0) {
    errors.push({
      type: 'structure',
      message: 'Chain must have at least one step',
      suggestion: 'Add at least one step to your chain'
    });
  }

  // Check step IDs
  const stepIds = new Set();
  const stepsWithoutPrompts = [];

  for (const step of chain.steps) {
    if (!step.id) {
      errors.push({
        type: 'missing-id',
        message: 'Step missing id',
        suggestion: 'Add a unique id to each step'
      });
    } else if (stepIds.has(step.id)) {
      errors.push({
        type: 'duplicate-id',
        message: `Duplicate step id: ${step.id}`,
        stepId: step.id,
        suggestion: 'Make each step id unique'
      });
    } else {
      stepIds.add(step.id);
    }

    if (!step.prompt) {
      stepsWithoutPrompts.push(step.id);
      warnings.push({
        type: 'missing-prompt',
        message: `Step ${step.id} has no prompt`,
        stepId: step.id
      });
    }
  }

  // Check for circular dependencies
  const cycleResult = detectCircularDependencies(chain.steps);
  if (cycleResult.hasCycle) {
    errors.push({
      type: 'circular-dependency',
      message: `Circular dependency detected: ${cycleResult.cyclePath.join(' -> ')}`,
      suggestion: 'Remove or restructure the circular dependency'
    });
  }

  // Check for missing dependencies
  for (const step of chain.steps) {
    if (step.dependsOn) {
      for (const dep of step.dependsOn) {
        if (!stepIds.has(dep)) {
          errors.push({
            type: 'missing-dependency',
            message: `Step ${step.id} depends on non-existent step: ${dep}`,
            stepId: step.id,
            variable: dep,
            suggestion: `Add step '${dep}' or remove it from dependencies`
          });
        }
      }
    }
  }

  // Check for missing variables
  const inputVars = chain.input ? Object.keys(chain.input) : [];
  for (const step of chain.steps) {
    const vars = extractVariables(step.prompt);
    for (const v of vars) {
      const baseVar = v.split('.')[0];
      const isInputVar = baseVar === 'input' || inputVars.includes(baseVar);
      const isStepVar = stepIds.has(baseVar);
      const isDependent = step.dependsOn?.includes(baseVar);

      if (!isInputVar && !isStepVar && !isDependent) {
        warnings.push({
          type: 'potentially-undefined-variable',
          message: `Step ${step.id} uses potentially undefined variable: {{${v}}}`,
          stepId: step.id,
          variable: v
        });
        suggestions.warnings.push({
          for: `step-${step.id}`,
          suggestion: `Ensure '${baseVar}' is provided as input or add it to dependsOn`
        });
      }
    }
  }

  // Check for unused steps (steps nothing depends on except last)
  const lastSteps = findLastSteps(chain.steps);
  if (lastSteps.length > 1) {
    warnings.push({
      type: 'multiple-final-steps',
      message: `Chain has ${lastSteps.length} final steps: ${lastSteps.join(', ')}`,
      suggestion: 'Consider if all final steps should contribute to output'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    suggestions,
    analysis
  };
}

/**
 * Analyze chain structure
 * @param {object} chain - Chain to analyze
 * @returns {object}
 */
function analyzeChain(chain) {
  if (!chain?.steps) {
    return { stepCount: 0, depth: 0, hasDependencies: false };
  }

  const steps = chain.steps;
  const hasDependencies = steps.some(s => s.dependsOn && s.dependsOn.length > 0);
  const depth = calculateDepth(steps);
  const parallelSteps = countParallelSteps(steps);

  return {
    stepCount: steps.length,
    depth,
    hasDependencies,
    parallelSteps,
    maxDependencies: Math.max(0, ...steps.map(s => s.dependsOn?.length || 0)),
    variableCount: countUniqueVariables(steps)
  };
}

/**
 * Calculate maximum dependency depth
 * @param {object[]} steps - Chain steps
 * @returns {number}
 */
function calculateDepth(steps) {
  const depths = new Map();
  const stepMap = new Map(steps.map(s => [s.id, s]));

  const getDepth = (stepId) => {
    if (depths.has(stepId)) return depths.get(stepId);
    
    const step = stepMap.get(stepId);
    if (!step?.dependsOn || step.dependsOn.length === 0) {
      depths.set(stepId, 1);
      return 1;
    }

    const maxDepDepth = Math.max(...step.dependsOn.map(getDepth));
    const depth = maxDepDepth + 1;
    depths.set(stepId, depth);
    return depth;
  };

  return Math.max(1, ...steps.map(s => getDepth(s.id)));
}

/**
 * Count parallel execution opportunities
 * @param {object[]} steps - Chain steps
 * @returns {number}
 */
function countParallelSteps(steps) {
  const stepMap = new Map(steps.map(s => [s.id, s]));
  const levels = new Map();

  const getLevel = (stepId) => {
    if (levels.has(stepId)) return levels.get(stepId);
    
    const step = stepMap.get(stepId);
    if (!step?.dependsOn || step.dependsOn.length === 0) {
      levels.set(stepId, 0);
      return 0;
    }

    const maxLevel = Math.max(...step.dependsOn.map(getLevel));
    const level = maxLevel + 1;
    levels.set(stepId, level);
    return level;
  };

  for (const step of steps) {
    getLevel(step.id);
  }

  // Count steps at each level
  const levelCounts = {};
  for (const level of levels.values()) {
    levelCounts[level] = (levelCounts[level] || 0) + 1;
  }

  // Return max parallelism at any level
  return Math.max(1, ...Object.values(levelCounts));
}

/**
 * Find steps that nothing depends on
 * @param {object[]} steps - Chain steps
 * @returns {string[]}
 */
function findLastSteps(steps) {
  const dependedOn = new Set();
  for (const step of steps) {
    if (step.dependsOn) {
      for (const dep of step.dependsOn) {
        dependedOn.add(dep);
      }
    }
  }
  
  return steps.filter(s => !dependedOn.has(s.id)).map(s => s.id);
}

/**
 * Count unique variables used in steps
 * @param {object[]} steps - Chain steps
 * @returns {number}
 */
function countUniqueVariables(steps) {
  const vars = new Set();
  for (const step of steps) {
    const stepVars = extractVariables(step.prompt);
    for (const v of stepVars) {
      vars.add(v.split('.')[0]);
    }
  }
  return vars.size;
}

/**
 * Extract variables from template
 * @param {string} template - Template string
 * @returns {string[]}
 */
function extractVariables(template) {
  if (!template) return [];
  const matches = template.match(/\{\{([^}]+)\}\}/g) || [];
  return matches.map(m => m.replace(/\{\{|\}\}/g, '').trim());
}

/**
 * Detect circular dependencies in steps
 * @param {object[]} steps - Chain steps
 * @returns {{ hasCycle: boolean, cyclePath?: string[] }}
 */
function detectCircularDependencies(steps) {
  const visited = new Set();
  const path = new Set();
  const pathArray = [];
  const stepMap = new Map(steps.map(s => [s.id, s]));

  const visit = (stepId) => {
    if (path.has(stepId)) {
      const cycleStart = pathArray.indexOf(stepId);
      return {
        hasCycle: true,
        cyclePath: [...pathArray.slice(cycleStart), stepId]
      };
    }
    
    if (visited.has(stepId)) {
      return { hasCycle: false };
    }

    visited.add(stepId);
    path.add(stepId);
    pathArray.push(stepId);

    const step = stepMap.get(stepId);
    if (step?.dependsOn) {
      for (const dep of step.dependsOn) {
        const result = visit(dep);
        if (result.hasCycle) return result;
      }
    }

    path.delete(stepId);
    pathArray.pop();
    return { hasCycle: false };
  };

  for (const step of steps) {
    const result = visit(step.id);
    if (result.hasCycle) return result;
  }

  return { hasCycle: false };
}

/**
 * Generate fix suggestions for validation errors
 * @param {ValidationError[]} errors - Validation errors
 * @returns {object[]}
 */
function generateFixSuggestions(errors) {
  return errors.map(error => ({
    error: error.message,
    type: error.type,
    suggestion: error.suggestion || getSuggestionForError(error)
  }));
}

/**
 * Get suggestion for specific error type
 * @param {ValidationError} error - Error to get suggestion for
 * @returns {string}
 */
function getSuggestionForError(error) {
  const suggestions = {
    'structure': 'Check your chain definition structure',
    'missing-id': 'Add a unique id to each step',
    'duplicate-id': 'Rename one of the duplicate step ids',
    'circular-dependency': 'Remove or restructure the circular dependency',
    'missing-dependency': 'Add the missing dependency step or remove the reference',
    'missing-prompt': 'Add a prompt to the step'
  };

  return suggestions[error.type] || 'Review the chain definition';
}

module.exports = {
  validateChainDetailed,
  analyzeChain,
  detectCircularDependencies,
  extractVariables,
  generateFixSuggestions,
  calculateDepth,
  countParallelSteps,
  findLastSteps
};
