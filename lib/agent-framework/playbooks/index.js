/**
 * @fileoverview Playbook Templates Module
 * Pre-defined playbooks for GSI workflows
 * Part of Phase 50B: Agent Framework Integration
 */

const { EventEmitter } = require('events');

/**
 * @typedef {Object} PlaybookStep
 * @property {string} name
 * @property {string} action
 * @property {number} order
 * @property {string} [phase]
 * @property {boolean} [parallel]
 * @property {number} [timeout]
 * @property {string} [condition]
 */

/**
 * @typedef {Object} PlaybookTemplate
 * @property {string} name
 * @property {string} description
 * @property {string} version
 * @property {PlaybookStep[]} steps
 * @property {number} [estimatedDuration]
 * @property {string[]} [validationCriteria]
 * @property {(options: CustomizationOptions) => PlaybookTemplate} customize
 */

/**
 * @typedef {Object} CustomizationOptions
 * @property {string[]} [skipSteps]
 * @property {PlaybookStep[]} [addSteps]
 * @property {Array<{ name: string; changes: Partial<PlaybookStep> }>} [modifySteps]
 */

// Template registry
/** @type {Map<string, () => PlaybookTemplate>} */
const templates = new Map();

/**
 * Base template class
 */
class BaseTemplate {
  /**
   * @param {string} name
   * @param {string} description
   * @param {PlaybookStep[]} steps
   * @param {{ estimatedDuration?: number; validationCriteria?: string[] }} [options]
   */
  constructor(name, description, steps, options) {
    this.name = name;
    this.description = description;
    this.version = '1.0.0';
    this.steps = [...steps];
    this.estimatedDuration = options?.estimatedDuration;
    this.validationCriteria = options?.validationCriteria;
  }

  /**
   * Customize the template
   * @param {CustomizationOptions} options
   * @returns {PlaybookTemplate}
   */
  customize(options) {
    // Create a copy of steps
    let newSteps = [...this.steps];

    // Skip steps (match by name OR action)
    if (options.skipSteps) {
      newSteps = newSteps.filter(s => 
        !options.skipSteps?.includes(s.name) && 
        !options.skipSteps?.includes(s.action)
      );
    }

    // Modify steps (match by name OR action)
    if (options.modifySteps) {
      for (const mod of options.modifySteps) {
        const idx = newSteps.findIndex(s => s.name === mod.name || s.action === mod.name);
        if (idx !== -1) {
          newSteps[idx] = { ...newSteps[idx], ...mod.changes };
        }
      }
    }

    // Add steps
    if (options.addSteps) {
      newSteps = [...newSteps, ...options.addSteps];
    }

    // Re-sort by order
    newSteps.sort((a, b) => a.order - b.order);

    // Return new template instance
    return new ConcreteTemplate(
      `${this.name}-customized`,
      this.description,
      newSteps,
      {
        estimatedDuration: this.estimatedDuration,
        validationCriteria: this.validationCriteria
      }
    );
  }
}

/**
 * Concrete template implementation
 */
class ConcreteTemplate extends BaseTemplate {
  /**
   * @param {string} name
   * @param {string} description
   * @param {PlaybookStep[]} steps
   * @param {{ estimatedDuration?: number; validationCriteria?: string[] }} [options]
   */
  constructor(name, description, steps, options) {
    super(name, description, steps, options);
  }
}

/**
 * Plan Template - For planning phases
 */
class PlanTemplate extends BaseTemplate {
  constructor() {
    super(
      'plan',
      'Planning workflow for GSI tasks',
      [
        { name: 'analyze-input', action: 'analyze', order: 1, phase: 'plan' },
        { name: 'gather-context', action: 'gather', order: 2, phase: 'plan' },
        { name: 'design-approach', action: 'design', order: 3, phase: 'plan' },
        { name: 'create-plan', action: 'plan', order: 4, phase: 'plan' },
        { name: 'review-plan', action: 'review', order: 5, phase: 'plan' },
        { name: 'document-plan', action: 'document', order: 6, phase: 'plan' }
      ],
      { estimatedDuration: 60000 }
    );
  }
}

/**
 * Execute Template - For execution phases
 */
class ExecuteTemplate extends BaseTemplate {
  constructor() {
    super(
      'execute',
      'Execution workflow for GSI tasks',
      [
        { name: 'prepare-environment', action: 'prepare', order: 1, phase: 'execute' },
        { name: 'implement-changes', action: 'implement', order: 2, phase: 'execute', parallel: true },
        { name: 'run-tasks', action: 'execute', order: 3, phase: 'execute', parallel: true },
        { name: 'verify-execution', action: 'verify', order: 4, phase: 'execute' }
      ],
      { estimatedDuration: 120000 }
    );
  }
}

/**
 * Verify Template - For verification phases
 */
class VerifyTemplate extends BaseTemplate {
  constructor() {
    super(
      'verify',
      'Verification workflow for GSI tasks',
      [
        { name: 'run-tests', action: 'test', order: 1, phase: 'verify' },
        { name: 'validate-output', action: 'validate', order: 2, phase: 'verify' },
        { name: 'check-quality', action: 'quality', order: 3, phase: 'verify' },
        { name: 'generate-report', action: 'report', order: 4, phase: 'verify' }
      ],
      {
        estimatedDuration: 90000,
        validationCriteria: [
          'All tests pass',
          'Code coverage > 80%',
          'No linting errors',
          'Documentation complete'
        ]
      }
    );
  }
}

/**
 * Full Cycle Template - Combines all phases
 */
class FullCycleTemplate extends BaseTemplate {
  constructor() {
    super(
      'full-cycle',
      'Complete workflow combining plan, execute, and verify phases',
      [
        // Plan phase
        { name: 'analyze', action: 'analyze', order: 1, phase: 'plan' },
        { name: 'design', action: 'design', order: 2, phase: 'plan' },
        { name: 'document-plan', action: 'document', order: 3, phase: 'plan' },
        // Execute phase
        { name: 'implement', action: 'implement', order: 4, phase: 'execute' },
        { name: 'execute-tasks', action: 'execute', order: 5, phase: 'execute' },
        // Verify phase
        { name: 'test', action: 'test', order: 6, phase: 'verify' },
        { name: 'validate', action: 'validate', order: 7, phase: 'verify' }
      ],
      { estimatedDuration: 300000 }
    );
  }
}

// Register built-in templates
templates.set('plan', () => new PlanTemplate());
templates.set('execute', () => new ExecuteTemplate());
templates.set('verify', () => new VerifyTemplate());
templates.set('full-cycle', () => new FullCycleTemplate());

/**
 * List available playbook templates
 * @returns {string[]}
 */
function listPlaybookTemplates() {
  return Array.from(templates.keys());
}

/**
 * Get a playbook template by name
 * @param {string} name
 * @returns {PlaybookTemplate}
 */
function getPlaybookTemplate(name) {
  const factory = templates.get(name);
  if (!factory) {
    throw new Error(`Template not found: ${name}`);
  }
  return factory();
}

/**
 * Register a custom template
 * @param {string} name
 * @param {() => PlaybookTemplate} factory
 */
function registerTemplate(name, factory) {
  templates.set(name, factory);
}

module.exports = {
  BaseTemplate,
  ConcreteTemplate,
  PlanTemplate,
  ExecuteTemplate,
  VerifyTemplate,
  FullCycleTemplate,
  listPlaybookTemplates,
  getPlaybookTemplate,
  registerTemplate
};
