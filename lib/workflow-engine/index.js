/**
 * @fileoverview Workflow Engine - Main Entry Point
 * Unified API for chain orchestration, markdown processing, and task management
 * Part of Phase 50D: Workflow Engine Integration
 * 
 * This module integrates:
 * - PromptChains: Chain orchestration with state management
 * - mdream: Markdown processing with knowledge extraction
 * - taskmaster: Task orchestration with dependency resolution
 * 
 * @module workflow-engine
 * @version 1.0.0
 */

// PromptChains - Chain orchestration
const promptchains = require('./promptchains');
const chainValidate = require('./chain-validate');

// mdream - Markdown processing
const mdream = require('./mdream');

// taskmaster - Task orchestration
const taskmaster = require('./taskmaster');
const taskParallel = require('./task-parallel');
const taskRetry = require('./task-retry');

// Version information
const version = '1.0.0';

/**
 * Initialize the workflow engine
 * @param {object} config - Configuration options
 * @returns {object} Initialized components
 */
function initialize(config = {}) {
  const {
    maxConcurrency = 10,
    defaultTimeout = 30000,
    defaultRetries = 3,
    cacheEnabled = true
  } = config;

  // Create chain executor
  const chainExecutor = new promptchains.PromptChains({
    maxSteps: config.maxChainSteps || 50,
    defaultTimeout,
    executor: config.chainExecutor
  });

  // Create markdown processor
  const markdownProcessor = new mdream.MdreamProcessor({
    extractKnowledge: config.extractKnowledge ?? true,
    maxDepth: config.maxSectionDepth || 10
  });

  // Create task orchestrator
  const taskOrchestrator = new taskmaster.Taskmaster({
    maxConcurrency,
    continueOnError: config.continueOnError ?? false,
    timeout: defaultTimeout
  });

  return {
    chains: chainExecutor,
    markdown: markdownProcessor,
    tasks: taskOrchestrator,
    config: {
      maxConcurrency,
      defaultTimeout,
      defaultRetries,
      cacheEnabled
    }
  };
}

/**
 * Execute a chain with input
 * @param {object} chain - Chain to execute
 * @param {object} input - Input variables
 * @param {object} options - Execution options
 * @returns {Promise<object>}
 */
async function executeChain(chain, input = {}, options = {}) {
  return promptchains.executeChain(chain, input, options);
}

/**
 * Process markdown content
 * @param {string} markdown - Markdown content
 * @param {object} options - Processing options
 * @returns {Promise<object>}
 */
async function processMarkdown(markdown, options = {}) {
  return mdream.processMarkdown(markdown, options);
}

/**
 * Extract knowledge from markdown
 * @param {string} markdown - Markdown content
 * @returns {Promise<object>}
 */
async function extractKnowledge(markdown) {
  return mdream.extractKnowledge(markdown);
}

/**
 * Orchestrate tasks with dependencies
 * @param {object[]} tasks - Tasks to execute
 * @param {object} options - Orchestration options
 * @returns {Promise<object>}
 */
async function orchestrateTasks(tasks, options = {}) {
  return taskmaster.orchestrateTasks(tasks, options);
}

/**
 * Execute tasks in parallel
 * @param {object[]} tasks - Tasks to execute
 * @param {object} options - Execution options
 * @returns {Promise<object[]>}
 */
async function executeParallel(tasks, options = {}) {
  return taskParallel.parallel(tasks.map(t => t.run), options);
}

/**
 * Execute with retry logic
 * @param {object} task - Task to execute
 * @param {object} options - Retry options
 * @returns {Promise<object>}
 */
async function executeWithRetry(task, options = {}) {
  return taskRetry.retry(task.run, options);
}

/**
 * Validate a chain
 * @param {object} chain - Chain to validate
 * @returns {object}
 */
function validateChain(chain) {
  return chainValidate.validateChainDetailed(chain);
}

/**
 * Get available chain templates
 * @returns {object[]}
 */
function getChainTemplates() {
  return promptchains.getChainTemplates();
}

/**
 * Instantiate a chain template
 * @param {string} name - Template name
 * @param {object} variables - Variables to substitute
 * @returns {object}
 */
function instantiateTemplate(name, variables = {}) {
  return promptchains.instantiateTemplate(name, variables);
}

/**
 * Analyze all workflow engine components
 * @returns {Promise<object>}
 */
async function analyzeAll() {
  const [promptchainsAnalysis, mdreamAnalysis, taskmasterAnalysis] = await Promise.all([
    promptchains.analyzePromptChains(),
    mdream.analyzeMdream(),
    taskmaster.analyzeTaskmaster()
  ]);

  return {
    promptchains: promptchainsAnalysis,
    mdream: mdreamAnalysis,
    taskmaster: taskmasterAnalysis,
    version,
    analyzed: new Date().toISOString()
  };
}

/**
 * Create tasks from markdown knowledge
 * @param {object} knowledge - Extracted knowledge
 * @returns {object[]}
 */
function createTasksFromKnowledge(knowledge) {
  const tasks = [];

  // Create tasks from todos
  if (knowledge.todos && knowledge.todos.length > 0) {
    for (const todo of knowledge.todos) {
      if (!todo.completed) {
        tasks.push({
          id: `todo-${tasks.length}`,
          type: 'todo',
          description: todo.task,
          run: async () => ({ completed: true, task: todo.task })
        });
      }
    }
  }

  // Create tasks from patterns
  if (knowledge.patterns && knowledge.patterns.length > 0) {
    for (const pattern of knowledge.patterns) {
      if (pattern.steps && pattern.steps.length > 0) {
        // Create sequential tasks for pattern steps
        let prevId = null;
        for (let i = 0; i < pattern.steps.length; i++) {
          const stepId = `pattern-${pattern.name}-${i}`;
          tasks.push({
            id: stepId,
            type: 'pattern-step',
            description: pattern.steps[i],
            dependsOn: prevId ? [prevId] : [],
            run: async () => ({ step: i + 1, completed: true })
          });
          prevId = stepId;
        }
      }
    }
  }

  return tasks;
}

/**
 * Get workflow engine metrics
 * @param {object} orchestrator - Task orchestrator instance
 * @returns {object}
 */
function getMetrics(orchestrator) {
  if (!orchestrator) return null;
  return orchestrator.metrics || {};
}

// Re-export all modules for direct access
const exports_ = {
  // Version
  version,

  // Main API
  initialize,
  analyzeAll,
  executeChain,
  processMarkdown,
  extractKnowledge,
  orchestrateTasks,
  executeParallel,
  executeWithRetry,
  validateChain,
  getChainTemplates,
  instantiateTemplate,
  createTasksFromKnowledge,
  getMetrics,

  // PromptChains - Chain orchestration
  PromptChains: promptchains.PromptChains,
  CHAIN_TEMPLATES: promptchains.CHAIN_TEMPLATES,
  analyzePromptChains: promptchains.analyzePromptChains,

  // Chain validation
  chainValidate: {
    validateDetailed: chainValidate.validateChainDetailed,
    analyze: chainValidate.analyzeChain,
    detectCircular: chainValidate.detectCircularDependencies,
    extractVariables: chainValidate.extractVariables,
    generateSuggestions: chainValidate.generateFixSuggestions
  },

  // mdream - Markdown processing
  MdreamProcessor: mdream.MdreamProcessor,
  KNOWLEDGE_PATTERNS: mdream.KNOWLEDGE_PATTERNS,
  analyzeMdream: mdream.analyzeMdream,
  markdownToCxml: mdream.markdownToCxml,

  // taskmaster - Task orchestration
  Taskmaster: taskmaster.Taskmaster,
  DEFAULT_RETRY_CONFIG: taskmaster.DEFAULT_RETRY_CONFIG,
  DEFAULT_EXECUTION_CONFIG: taskmaster.DEFAULT_EXECUTION_CONFIG,
  analyzeTaskmaster: taskmaster.analyzeTaskmaster,
  detectCircularDependencies: taskmaster.detectCircularDependencies,

  // Task parallel utilities
  parallel: taskParallel.parallel,
  batchExecute: taskParallel.batchExecute,
  parallelMap: taskParallel.parallelMap,
  parallelFilter: taskParallel.parallelFilter,
  raceExecute: taskParallel.raceExecute,
  anyExecute: taskParallel.anyExecute,
  waterfall: taskParallel.waterfall,
  dynamicParallel: taskParallel.dynamicParallel,

  // Task retry utilities
  retry: taskRetry.retry,
  withRetry: taskRetry.withRetry,
  CircuitBreaker: taskRetry.CircuitBreaker,
  withCircuitBreaker: taskRetry.withCircuitBreaker,
  withRetryAndBreaker: taskRetry.withRetryAndBreaker,
  retryUntil: taskRetry.retryUntil,
  calculateDelay: taskRetry.calculateDelay
};

// Support both CommonJS and ES modules
module.exports = exports_;
module.exports.default = exports_;
