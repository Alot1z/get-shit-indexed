/**
 * @fileoverview Skill composition module
 * Provides composable skill patterns and workflow chaining
 * Part of Phase 50C: Knowledge System Integration
 * 
 * Inspired by functional composition patterns
 * Implements skill chaining, parallel execution, and workflow management
 */

// Global skill registry
const globalRegistry = new Map();

/**
 * Analyze skill-compose architecture approach
 * @returns {Promise<object>} Architecture analysis
 */
async function analyzeSkillCompose() {
  return {
    approach: 'composable-skills',
    description: 'Functional composition of skills into workflows',
    features: [
      'skill-composition',
      'workflow-chaining',
      'primitive-skills',
      'parallel-execution',
      'dependency-resolution'
    ],
    compositionModes: ['sequential', 'parallel', 'conditional'],
    version: '1.0.0',
    analyzed: new Date().toISOString()
  };
}

/**
 * Create a skill composer instance
 * @param {object} options - Composer options
 * @returns {object} Composer instance
 */
function createSkillComposer(options = {}) {
  const registry = new Map();

  return {
    /**
     * Register a skill
     * @param {string} name - Skill name
     * @param {object} skill - Skill definition
     */
    register(name, skill) {
      if (typeof skill.execute !== 'function') {
        throw new Error('Skill must have an execute function');
      }
      registry.set(name, skill);
    },

    /**
     * Get a skill
     * @param {string} name - Skill name
     * @returns {object} Skill definition
     */
    getSkill(name) {
      return registry.get(name);
    },

    /**
     * Compose multiple skills
     * @param {string[]} skillNames - Skills to compose
     * @param {object} opts - Composition options
     * @returns {object} Composed skill
     */
    compose(skillNames, opts = {}) {
      return composeSkillsWithRegistry(skillNames, registry, opts);
    },

    /**
     * List all registered skills
     * @returns {string[]} Skill names
     */
    list() {
      return Array.from(registry.keys());
    }
  };
}

/**
 * Register a skill globally
 * @param {object} skill - Skill definition
 */
function registerSkill(skill) {
  if (!skill.name) {
    throw new Error('Skill must have a name');
  }
  if (typeof skill.execute !== 'function') {
    throw new Error('Skill must have an execute function');
  }

  globalRegistry.set(skill.name, {
    ...skill,
    registered: Date.now()
  });
}

/**
 * Get the global skill registry
 * @returns {Map} Global registry
 */
function getSkillRegistry() {
  return globalRegistry;
}

/**
 * Compose skills from global registry
 * @param {string[]} skillNames - Skills to compose
 * @param {object} options - Composition options
 * @returns {object} Composed skill
 */
function composeSkills(skillNames, options = {}) {
  return composeSkillsWithRegistry(skillNames, globalRegistry, options);
}

/**
 * Compose skills with custom registry
 * @param {string[]} skillNames - Skills to compose
 * @param {Map} registry - Skill registry
 * @param {object} options - Composition options
 * @returns {object} Composed skill
 */
function composeSkillsWithRegistry(skillNames, registry, options = {}) {
  const { mode = 'sequential' } = options;

  // Validate all skills exist
  for (const name of skillNames) {
    if (!registry.has(name)) {
      throw new Error(`Unknown skill: ${name}`);
    }
  }

  const skills = skillNames.map(name => registry.get(name));

  return {
    skills: skillNames,
    mode,

    /**
     * Execute composed skills
     * @param {*} input - Input to first skill
     * @returns {Promise<*>} Final output
     */
    async execute(input) {
      if (mode === 'parallel') {
        const results = await Promise.all(
          skills.map(skill => skill.execute(input))
        );
        return results;
      }

      // Sequential execution
      let result = input;
      for (const skill of skills) {
        result = await skill.execute(result);
      }
      return result;
    }
  };
}

/**
 * Create a workflow from steps
 * @param {Array} steps - Workflow steps
 * @returns {object} Workflow definition
 */
function createWorkflow(steps) {
  // Validate all steps
  for (const step of steps) {
    if (!step.skill) {
      throw new Error('Each step must specify a skill');
    }
    if (!globalRegistry.has(step.skill)) {
      throw new Error(`Unknown skill in workflow: ${step.skill}`);
    }
  }

  // Check dependencies
  const validation = validateWorkflow({ steps });
  if (!validation.valid) {
    throw new Error(`Invalid workflow: ${validation.errors.join(', ')}`);
  }

  return {
    steps,
    createdAt: Date.now(),

    /**
     * Run the workflow
     * @param {*} initialInput - Initial input
     * @returns {Promise<*>} Final output
     */
    async run(initialInput) {
      return executeWorkflow({ steps }, initialInput);
    }
  };
}

/**
 * Validate a workflow
 * @param {object} workflow - Workflow to validate
 * @returns {object} Validation result
 */
function validateWorkflow(workflow) {
  const errors = [];

  if (!workflow.steps || !Array.isArray(workflow.steps)) {
    errors.push('Workflow must have a steps array');
    return { valid: false, errors };
  }

  // Check for unknown skills
  for (const step of workflow.steps) {
    if (step.skill && !globalRegistry.has(step.skill)) {
      errors.push(`Unknown skill: ${step.skill}`);
    }
  }

  // Check for circular dependencies
  if (hasCircularDependencies(workflow.steps)) {
    errors.push('Workflow has circular dependencies');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check for circular dependencies in workflow steps
 * @param {Array} steps - Workflow steps
 * @returns {boolean} True if circular dependency found
 */
function hasCircularDependencies(steps) {
  const visited = new Set();
  const recursionStack = new Set();

  function visit(stepIndex) {
    if (recursionStack.has(stepIndex)) return true;
    if (visited.has(stepIndex)) return false;

    visited.add(stepIndex);
    recursionStack.add(stepIndex);

    const step = steps[stepIndex];
    if (step.dependsOn) {
      for (const dep of step.dependsOn) {
        const depIndex = steps.findIndex(s => s.skill === dep);
        if (depIndex !== -1 && visit(depIndex)) {
          return true;
        }
      }
    }

    recursionStack.delete(stepIndex);
    return false;
  }

  for (let i = 0; i < steps.length; i++) {
    if (visit(i)) return true;
  }

  return false;
}

/**
 * Execute a workflow
 * @param {object} workflow - Workflow to execute
 * @param {*} initialInput - Initial input
 * @returns {Promise<*>} Final output
 */
async function executeWorkflow(workflow, initialInput) {
  let output = initialInput;

  for (const step of workflow.steps) {
    const skill = globalRegistry.get(step.skill);
    if (!skill) {
      throw new Error(`Skill not found: ${step.skill}`);
    }

    // Use step input if provided, otherwise use output from previous step
    const input = step.input !== undefined ? step.input : output;
    output = await skill.execute(input);
  }

  return output;
}

/**
 * Decompose a skill into primitives
 * @param {string} skillName - Skill to decompose
 * @returns {object|null} Decomposition result
 */
function decomposeSkill(skillName) {
  const skill = globalRegistry.get(skillName);
  if (!skill) return null;

  return {
    name: skillName,
    primitives: skill.primitives || [skillName],
    description: skill.description
  };
}

/**
 * Merge outputs from multiple skills
 * @param {Array} outputs - Outputs to merge
 * @returns {object} Merged output
 */
function mergeSkillOutputs(outputs) {
  if (!outputs || outputs.length === 0) {
    return { data: null, sources: [] };
  }

  if (outputs.length === 1) {
    return {
      data: outputs[0].data,
      sources: [outputs[0].source]
    };
  }

  // Merge all data
  const mergedData = outputs.map(o => o.data).join('\n');
  const sources = outputs.map(o => o.source);

  return {
    data: mergedData,
    sources,
    merged: true
  };
}

module.exports = {
  analyzeSkillCompose,
  createSkillComposer,
  registerSkill,
  getSkillRegistry,
  composeSkills,
  createWorkflow,
  validateWorkflow,
  executeWorkflow,
  decomposeSkill,
  mergeSkillOutputs
};
