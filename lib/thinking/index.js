/**
 * Thinking Orchestrator - Unified API
 * 
 * Provides a unified API for the thinking orchestrator system.
 * Exports all thinking functions for use in hooks, commands, and workflows.
 * 
 * v2.0 - Enhanced with Agent, Reference, and Template thinking integration
 */

// Core orchestrator
const {
  thinkBeforeTool,
  thinkAfterTool,
  runBMADCheck,
  clearCache,
  getMetrics: getOrchestratorMetrics,
  resetMetrics: resetOrchestratorMetrics
} = require('./orchestrator');

// Mode selector
const {
  selectThinkingMode,
  generatePrompt,
  getThinkingServer,
  getPromptTemplate,
  getTimeout,
  clearCache: clearSelectorCache,
  configure,
  resetConfiguration,
  getConfiguration,
  getAllCategories,
  getAllServers
} = require('./selector');

// Result parser
const {
  parseSequentialResult,
  parseTractatusResult,
  parseDebugResult,
  parseThinkingResult,
  extractKeyInsights,
  formatThinkingResult
} = require('./result-parser');

// 7-BMAD checker
const {
  runBMADCheck: runBMADCheckFull,
  getBMADCircles,
  getBMADCircle,
  formatBMADResult,
  passesBMADThreshold
} = require('./7bmad-checker');

// Thinking context
const {
  ThinkingContext
} = require('./context');

// Metrics
const {
  logThinking,
  logCacheAccess,
  logBMADCheck,
  logBeforeTool,
  logAfterTool,
  getMetrics: getMetricsOnly,
  resetMetrics: resetMetricsOnly,
  saveMetrics,
  loadMetrics,
  formatMetrics
} = require('./metrics');

// Agent Thinking Integration (Phase 20-04b)
const {
  AgentThinking,
  AGENT_PHASES,
  AGENT_THINKING_MODES,
  DEFAULT_AGENT_MODE
} = require('./agent-thinking');

// Reference Thinking Integration (Phase 20-04c)
const {
  ReferenceThinking,
  REFERENCE_MODES,
  SERVER_RECOMMENDATIONS
} = require('./reference-thinking');

// Template Thinking Integration (Phase 20-04d)
const {
  TemplateThinking,
  TEMPLATE_MODES,
  THINKING_PLACEHOLDERS
} = require('./template-thinking');

// Singleton instances for convenience
let agentThinking = null;
let referenceThinking = null;
let templateThinking = null;

/**
 * Get or create AgentThinking instance
 * @param {object} config - Configuration
 * @returns {AgentThinking} AgentThinking instance
 */
function getAgentThinking(config = {}) {
  if (!agentThinking) {
    agentThinking = new AgentThinking(config);
  }
  return agentThinking;
}

/**
 * Get or create ReferenceThinking instance
 * @param {object} config - Configuration
 * @returns {ReferenceThinking} ReferenceThinking instance
 */
function getReferenceThinking(config = {}) {
  if (!referenceThinking) {
    referenceThinking = new ReferenceThinking(config);
  }
  return referenceThinking;
}

/**
 * Get or create TemplateThinking instance
 * @param {object} config - Configuration
 * @returns {TemplateThinking} TemplateThinking instance
 */
function getTemplateThinking(config = {}) {
  if (!templateThinking) {
    templateThinking = new TemplateThinking(config);
  }
  return templateThinking;
}

/**
 * Wrap agent with thinking enhancement
 * @param {string} agentName - Agent name
 * @param {Function} agentFn - Agent function
 * @param {object} options - Wrapper options
 * @returns {Function} Wrapped agent
 */
function wrapAgentWithThinking(agentName, agentFn, options = {}) {
  return getAgentThinking().wrapAgent(agentName, agentFn, options);
}

/**
 * Analyze reference with thinking
 * @param {string} referenceType - Reference type
 * @param {string} content - Reference content
 * @param {object} options - Analysis options
 * @returns {Promise<object>} Analysis result
 */
async function analyzeReference(referenceType, content, options = {}) {
  return await getReferenceThinking().analyzeReference(referenceType, content, options);
}

/**
 * Process template with thinking
 * @param {string} templateType - Template type
 * @param {object} templateData - Template data
 * @param {object} options - Processing options
 * @returns {Promise<object>} Processed template
 */
async function processTemplate(templateType, templateData, options = {}) {
  return await getTemplateThinking().processTemplate(templateType, templateData, options);
}

/**
 * Get all metrics combined
 * @returns {object} Combined metrics
 */
function getMetrics() {
  // Get selector metrics directly for backward compatibility with tests
  const selectorMetrics = require('./selector').getMetrics();

  const metrics = {
    orchestrator: getOrchestratorMetrics(),
    metrics: getMetricsOnly(),
    // Include selector metrics at top level for backward compatibility
    ...selectorMetrics
  };

  // Add enhanced module metrics
  if (agentThinking) {
    metrics.agentThinking = agentThinking.getMetrics();
  }
  if (referenceThinking) {
    metrics.referenceThinking = referenceThinking.getMetrics();
  }
  if (templateThinking) {
    metrics.templateThinking = templateThinking.getMetrics();
  }

  return metrics;
}

/**
 * Reset all metrics
 */
function resetMetrics() {
  resetOrchestratorMetrics();
  resetMetricsOnly();
  
  if (agentThinking) {
    agentThinking.clearSessions();
  }
  if (referenceThinking) {
    referenceThinking.clearCache();
  }
  if (templateThinking) {
    templateThinking.clearCaches();
  }
}

/**
 * Clear all caches (unified clear for backward compatibility)
 */
function clearCacheUnified() {
  clearCache();        // Orchestrator cache
  clearSelectorCache(); // Selector cache

  if (referenceThinking) {
    referenceThinking.clearCache();
  }
  if (templateThinking) {
    templateThinking.clearCaches();
  }
}

/**
 * Clear all caches (alias)
 */
function clearAllCaches() {
  clearCacheUnified();
}

// Unified exports
module.exports = {
  // Core orchestrator functions
  thinkBeforeTool,
  thinkAfterTool,
  
  // 7-BMAD checking
  runBMADCheck,
  runBMADCheckFull,
  
  // Mode selection
  selectThinkingMode,
  generatePrompt,
  getThinkingServer,
  getPromptTemplate,
  getTimeout,
  
  // Result parsing
  parseThinkingResult,
  parseSequentialResult,
  parseTractatusResult,
  parseDebugResult,
  extractKeyInsights,
  formatThinkingResult,
  
  // 7-BMAD helpers
  getBMADCircles,
  getBMADCircle,
  formatBMADResult,
  passesBMADThreshold,
  
  // Thinking context
  ThinkingContext,
  
  // Agent thinking (Phase 20-04b)
  AgentThinking,
  AGENT_PHASES,
  AGENT_THINKING_MODES,
  DEFAULT_AGENT_MODE,
  getAgentThinking,
  wrapAgentWithThinking,
  
  // Reference thinking (Phase 20-04c)
  ReferenceThinking,
  REFERENCE_MODES,
  SERVER_RECOMMENDATIONS,
  getReferenceThinking,
  analyzeReference,
  
  // Template thinking (Phase 20-04d)
  TemplateThinking,
  TEMPLATE_MODES,
  THINKING_PLACEHOLDERS,
  getTemplateThinking,
  processTemplate,
  
  // Metrics and logging
  getMetrics,
  resetMetrics,
  clearCache: clearCacheUnified,
  clearAllCaches,
  logThinking,
  logCacheAccess,
  logBMADCheck,
  logBeforeTool,
  logAfterTool,
  saveMetrics,
  loadMetrics,
  formatMetrics,
  
  // Configuration
  configure,
  resetConfiguration,
  getConfiguration,
  
  // Info
  getAllCategories,
  getAllServers
};
