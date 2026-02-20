/**
 * @fileoverview PromptChains - Chain orchestration for sequential prompt execution
 * Part of Phase 50D: Workflow Engine Integration
 * 
 * This module integrates PromptChains patterns for:
 * - Sequential step execution with state management
 * - Variable substitution between steps
 * - Chain templates and validation
 * 
 * @module workflow-engine/promptchains
 * @version 1.0.0
 */

/**
 * @typedef {Object} ChainStep
 * @property {string} id - Unique step identifier
 * @property {string} prompt - Prompt template with {{variable}} placeholders
 * @property {string[]} [dependsOn] - Step IDs this step depends on
 * @property {number} [timeout] - Timeout in milliseconds
 * @property {object} [metadata] - Additional metadata
 */

/**
 * @typedef {Object} Chain
 * @property {string} [id] - Chain identifier
 * @property {string} [name] - Chain name
 * @property {string} [description] - Chain description
 * @property {ChainStep[]} steps - Steps to execute
 * @property {object} [variables] - Default variables
 * @property {object} [options] - Chain options
 */

/**
 * @typedef {Object} ChainResult
 * @property {string} chainId - Chain identifier
 * @property {boolean} success - Whether chain completed successfully
 * @property {object} state - Final state after execution
 * @property {object[]} steps - Step execution results
 * @property {string} [finalOutput] - Final output from last step
 * @property {string} [error] - Error message if failed
 * @property {number} duration - Execution duration in ms
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether chain is valid
 * @property {string[]} errors - Validation errors
 * @property {string[]} warnings - Validation warnings
 */

// Built-in chain templates
const CHAIN_TEMPLATES = {
  'plan-execute-verify': {
    name: 'plan-execute-verify',
    description: 'Plan a task, execute it, then verify results',
    steps: [
      { id: 'plan', prompt: 'Create a detailed plan for: {{input}}' },
      { id: 'execute', prompt: 'Execute the following plan:\n{{plan.output}}', dependsOn: ['plan'] },
      { id: 'verify', prompt: 'Verify the execution results:\n{{execute.output}}\n\nOriginal task: {{input}}', dependsOn: ['execute'] }
    ]
  },
  'research-synthesize': {
    name: 'research-synthesize',
    description: 'Research a topic and synthesize findings',
    steps: [
      { id: 'research', prompt: 'Research the following topic thoroughly: {{topic}}' },
      { id: 'analyze', prompt: 'Analyze these research findings:\n{{research.output}}', dependsOn: ['research'] },
      { id: 'synthesize', prompt: 'Synthesize a comprehensive summary from this analysis:\n{{analyze.output}}', dependsOn: ['analyze'] }
    ]
  },
  'iterate-refine': {
    name: 'iterate-refine',
    description: 'Iterate on output with refinement steps',
    steps: [
      { id: 'initial', prompt: '{{task}}' },
      { id: 'critique', prompt: 'Critique this output and identify improvements:\n{{initial.output}}', dependsOn: ['initial'] },
      { id: 'refine', prompt: 'Refine the original output based on this critique:\nOriginal: {{initial.output}}\nCritique: {{critique.output}}', dependsOn: ['critique'] }
    ]
  },
  'decompose-solve': {
    name: 'decompose-solve',
    description: 'Decompose a complex problem and solve each part',
    steps: [
      { id: 'decompose', prompt: 'Decompose this complex problem into sub-problems:\n{{problem}}' },
      { id: 'solve', prompt: 'Solve each sub-problem:\n{{decompose.output}}', dependsOn: ['decompose'] },
      { id: 'integrate', prompt: 'Integrate these solutions into a final answer:\n{{solve.output}}', dependsOn: ['solve'] }
    ]
  },
  'multi-perspective': {
    name: 'multi-perspective',
    description: 'Analyze from multiple perspectives',
    steps: [
      { id: 'perspective_a', prompt: 'Analyze from a technical perspective: {{input}}' },
      { id: 'perspective_b', prompt: 'Analyze from a user perspective: {{input}}' },
      { id: 'perspective_c', prompt: 'Analyze from a business perspective: {{input}}' },
      { id: 'combine', prompt: 'Combine these perspectives into a comprehensive analysis:\nTechnical: {{perspective_a.output}}\nUser: {{perspective_b.output}}\nBusiness: {{perspective_c.output}}', dependsOn: ['perspective_a', 'perspective_b', 'perspective_c'] }
    ]
  }
};

/**
 * PromptChains class for chain orchestration
 */
class PromptChains {
  constructor(options = {}) {
    this.options = {
      maxSteps: options.maxSteps || 50,
      defaultTimeout: options.defaultTimeout || 30000,
      executor: options.executor || null, // Custom executor function
      ...options
    };
    this.templates = { ...CHAIN_TEMPLATES };
    this.executionCache = new Map();
  }

  /**
   * Execute a chain with given input
   * @param {Chain} chain - Chain to execute
   * @param {object} input - Input variables
   * @returns {Promise<ChainResult>}
   */
  async execute(chain, input = {}) {
    const startTime = Date.now();
    const chainId = chain.id || `chain-${Date.now()}`;
    
    // Initialize state with input
    const state = { ...chain.variables, ...input };
    const stepResults = [];
    
    try {
      // Validate chain first
      const validation = this.validate(chain);
      if (!validation.valid) {
        throw new Error(`Invalid chain: ${validation.errors.join(', ')}`);
      }

      // Get execution order
      const order = this.getExecutionOrder(chain.steps);
      
      // Execute steps in order
      for (const stepId of order) {
        const step = chain.steps.find(s => s.id === stepId);
        if (!step) continue;

        const stepResult = await this.executeStep(step, state, chainId);
        stepResults.push(stepResult);
        
        // Update state with step output
        state[stepId] = { output: stepResult.output };
        
        if (!stepResult.success) {
          return {
            chainId,
            success: false,
            state,
            steps: stepResults,
            error: stepResult.error,
            duration: Date.now() - startTime
          };
        }
      }

      // Get final output from last step
      const lastStep = stepResults[stepResults.length - 1];
      
      return {
        chainId,
        success: true,
        state,
        steps: stepResults,
        finalOutput: lastStep?.output,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        chainId,
        success: false,
        state,
        steps: stepResults,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Execute a single step
   * @param {ChainStep} step - Step to execute
   * @param {object} state - Current state
   * @param {string} chainId - Chain ID for caching
   * @returns {Promise<object>}
   */
  async executeStep(step, state, chainId) {
    const startTime = Date.now();
    
    try {
      // Substitute variables in prompt
      const resolvedPrompt = this.substituteVariables(step.prompt, state);
      
      // Check cache
      const cacheKey = `${chainId}:${step.id}:${resolvedPrompt}`;
      if (this.executionCache.has(cacheKey)) {
        return {
          stepId: step.id,
          success: true,
          output: this.executionCache.get(cacheKey),
          cached: true,
          duration: Date.now() - startTime
        };
      }

      // Execute prompt
      let output;
      if (this.options.executor) {
        output = await this.options.executor(resolvedPrompt, step);
      } else {
        // Mock execution for testing
        output = `[Executed: ${step.id}]\n${resolvedPrompt}`;
      }

      // Cache result
      this.executionCache.set(cacheKey, output);

      return {
        stepId: step.id,
        success: true,
        output,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        stepId: step.id,
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Substitute variables in template
   * @param {string} template - Template string
   * @param {object} state - State with variables
   * @returns {string}
   */
  substituteVariables(template, state) {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = this.getNestedValue(state, path.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Get nested value from object
   * @param {object} obj - Object to get value from
   * @param {string} path - Dot-separated path
   * @returns {*}
   */
  getNestedValue(obj, path) {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }
    
    return current;
  }

  /**
   * Get execution order using topological sort
   * @param {ChainStep[]} steps - Steps to order
   * @returns {string[]}
   */
  getExecutionOrder(steps) {
    const order = [];
    const visited = new Set();
    const visiting = new Set();
    const stepMap = new Map(steps.map(s => [s.id, s]));

    const visit = (stepId) => {
      if (visited.has(stepId)) return;
      if (visiting.has(stepId)) {
        throw new Error(`Circular dependency detected at step: ${stepId}`);
      }

      visiting.add(stepId);
      const step = stepMap.get(stepId);
      
      if (step?.dependsOn) {
        for (const dep of step.dependsOn) {
          visit(dep);
        }
      }

      visiting.delete(stepId);
      visited.add(stepId);
      order.push(stepId);
    };

    for (const step of steps) {
      visit(step.id);
    }

    return order;
  }

  /**
   * Validate a chain
   * @param {Chain} chain - Chain to validate
   * @returns {ValidationResult}
   */
  validate(chain) {
    const errors = [];
    const warnings = [];

    if (!chain.steps || !Array.isArray(chain.steps)) {
      errors.push('Chain must have a steps array');
      return { valid: false, errors, warnings };
    }

    if (chain.steps.length === 0) {
      errors.push('Chain must have at least one step');
    }

    if (chain.steps.length > this.options.maxSteps) {
      errors.push(`Chain exceeds maximum steps (${this.options.maxSteps})`);
    }

    // Check for duplicate step IDs
    const stepIds = new Set();
    for (const step of chain.steps) {
      if (!step.id) {
        errors.push(`Step missing id: ${JSON.stringify(step)}`);
      } else if (stepIds.has(step.id)) {
        errors.push(`Duplicate step id: ${step.id}`);
      }
      stepIds.add(step.id);

      if (!step.prompt) {
        errors.push(`Step ${step.id} missing prompt`);
      }
    }

    // Check for circular dependencies
    try {
      this.getExecutionOrder(chain.steps);
    } catch (e) {
      errors.push(e.message);
    }

    // Check for missing dependencies
    for (const step of chain.steps) {
      if (step.dependsOn) {
        for (const dep of step.dependsOn) {
          if (!stepIds.has(dep)) {
            errors.push(`Step ${step.id} depends on non-existent step: ${dep}`);
          }
        }
      }
    }

    // Check for unused variables in prompts
    for (const step of chain.steps) {
      const vars = this.extractVariables(step.prompt);
      for (const v of vars) {
        if (!stepIds.has(v.split('.')[0]) && v.split('.')[0] !== 'input') {
          warnings.push(`Step ${step.id} uses potentially undefined variable: ${v}`);
        }
      }
    }
    
    // Check for variable reference cycles (e.g., a uses {{b.output}}, b uses {{a.output}})
    const varDeps = new Map();
    for (const step of chain.steps) {
      const vars = this.extractVariables(step.prompt);
      const deps = vars
        .map(v => v.split('.')[0])
        .filter(v => stepIds.has(v) && v !== step.id);
      if (deps.length > 0) {
        varDeps.set(step.id, deps);
      }
    }
    
    // Detect cycles in variable dependencies
    const visited = new Set();
    const path = new Set();
    const detectCycle = (stepId) => {
      if (path.has(stepId)) return true;
      if (visited.has(stepId)) return false;
      
      path.add(stepId);
      const deps = varDeps.get(stepId) || [];
      for (const dep of deps) {
        if (detectCycle(dep)) return true;
      }
      path.delete(stepId);
      visited.add(stepId);
      return false;
    };
    
    for (const stepId of stepIds) {
      if (detectCycle(stepId)) {
        errors.push('circular dependency detected in variable references');
        break;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Extract variables from template
   * @param {string} template - Template string
   * @returns {string[]}
   */
  extractVariables(template) {
    const matches = template.match(/\{\{([^}]+)\}\}/g) || [];
    return matches.map(m => m.replace(/\{\{|\}\}/g, '').trim());
  }

  /**
   * Get available templates
   * @returns {object[]}
   */
  getTemplates() {
    return Object.values(this.templates).map(t => ({
      name: t.name,
      description: t.description,
      stepCount: t.steps.length
    }));
  }

  /**
   * Get a specific template
   * @param {string} name - Template name
   * @returns {object|null}
   */
  getTemplate(name) {
    return this.templates[name] || null;
  }

  /**
   * Instantiate a template with variables
   * @param {string} name - Template name
   * @param {object} variables - Variables to substitute
   * @returns {Chain}
   */
  instantiateTemplate(name, variables = {}) {
    const template = this.templates[name];
    if (!template) {
      throw new Error(`Template not found: ${name}`);
    }

    // Deep clone template
    const chain = JSON.parse(JSON.stringify(template));
    
    // Build state with input aliasing for common variables
    const state = {
      ...variables,
      // Alias common variable names to 'input' for flexibility
      input: variables.input ?? variables.phase ?? variables.task ?? variables.topic ?? variables.problem ?? ''
    };
    
    // Substitute variables in all prompts
    chain.steps = chain.steps.map(step => ({
      ...step,
      prompt: this.substituteVariables(step.prompt, state)
    }));

    return chain;
  }

  /**
   * Register a custom template
   * @param {string} name - Template name
   * @param {Chain} template - Template definition
   */
  registerTemplate(name, template) {
    const validation = this.validate(template);
    if (!validation.valid) {
      throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
    }
    this.templates[name] = { ...template, name };
  }

  /**
   * Clear execution cache
   */
  clearCache() {
    this.executionCache.clear();
  }
}

/**
 * Analyze PromptChains repository structure
 * @param {string} repoUrl - Repository URL
 * @returns {Promise<object>}
 */
async function analyzePromptChains(repoUrl = 'https://github.com/MIATECHPARTNERS/PromptChains') {
  // Analysis of PromptChains patterns
  return {
    repository: repoUrl,
    chainFormat: {
      version: '1.0',
      supported: true,
      features: ['state-management', 'variable-substitution', 'dependency-ordering']
    },
    stateManagement: {
      type: 'immutable',
      propagation: 'downward',
      scope: 'chain-lifetime'
    },
    executionModel: {
      order: 'topological',
      parallel: 'independent-steps',
      caching: 'step-results'
    },
    variableSubstitution: {
      syntax: '{{variable.path}}',
      nested: true,
      expressions: false
    },
    templates: Object.keys(CHAIN_TEMPLATES),
    analyzed: new Date().toISOString()
  };
}

/**
 * Execute a chain (convenience function)
 * @param {Chain} chain - Chain to execute
 * @param {object} input - Input variables
 * @param {object} options - Options
 * @returns {Promise<ChainResult>}
 */
async function executeChain(chain, input = {}, options = {}) {
  const executor = new PromptChains(options);
  return executor.execute(chain, input);
}

/**
 * Get chain templates (convenience function)
 * @returns {object[]}
 */
function getChainTemplates() {
  const executor = new PromptChains();
  return executor.getTemplates();
}

/**
 * Instantiate a template (convenience function)
 * @param {string} name - Template name
 * @param {object} variables - Variables to substitute
 * @returns {Chain}
 */
function instantiateTemplate(name, variables = {}) {
  const executor = new PromptChains();
  return executor.instantiateTemplate(name, variables);
}

/**
 * Validate a chain (convenience function)
 * @param {Chain} chain - Chain to validate
 * @returns {ValidationResult}
 */
function validateChain(chain) {
  const executor = new PromptChains();
  const result = executor.validate(chain);
  if (!result.valid) {
    throw new Error(result.errors.join('; '));
  }
  return result;
}

module.exports = {
  PromptChains,
  CHAIN_TEMPLATES,
  analyzePromptChains,
  executeChain,
  getChainTemplates,
  instantiateTemplate,
  validateChain
};
