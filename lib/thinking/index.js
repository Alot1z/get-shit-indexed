/**
 * Thinking Orchestrator - Unified API
 * 
 * Provides a unified API for the thinking orchestrator system.
 * Exports all thinking functions for use in hooks, commands, and workflows.
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

/**
 * Get all metrics combined
 * @returns {object} Combined metrics
 */
function getMetrics() {
  return {
    orchestrator: getOrchestratorMetrics(),
    metrics: getMetricsOnly()
  };
}

/**
 * Reset all metrics
 */
function resetMetrics() {
  resetOrchestratorMetrics();
  resetMetricsOnly();
}

/**
 * Clear all caches
 */
function clearAllCaches() {
  clearCache();
  clearSelectorCache();
}

// Unified exports
module.exports = {
  // Core orchestrator functions
  thinkBeforeTool,
  thinkAfterTool,
  
  // 7-BMAD checking (use orchestrator version for consistency)
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
  
  // Metrics and logging
  getMetrics,
  resetMetrics,
  clearCache,
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
