/**
 * Command Thinking Module
 * 
 * Unified export for command thinking functionality.
 * Provides wrapper, modes, context injection, and metrics.
 */

// Wrapper exports
const {
  withThinking,
  createWrappedCommand,
  isWrapped
} = require('./wrapper');

// Mode exports
const {
  MODES,
  getModeForCommand,
  getModeConfig,
  isValidMode,
  getAllModes,
  setCommandMode,
  resetCommandMode,
  getCommandMappings
} = require('./modes');

// Context injector exports
const {
  injectThinkingContext,
  extractThinkingContext,
  validateThinkingContext,
  mergeThinkingContexts,
  formatThinkingContext,
  extractInsights,
  extractWarnings
} = require('./context-injector');

// Metrics exports
const {
  recordCommandThinking,
  getCommandMetrics,
  getAllMetrics,
  getTopCommands,
  getThinkingEffectiveness,
  getSummary,
  resetCommandMetrics,
  resetAllMetrics,
  exportMetrics,
  importMetrics
} = require('./metrics');

// Thinking orchestrator re-exports
const {
  thinkBeforeTool,
  thinkAfterTool,
  runBMADCheck,
  clearCache,
  getMetrics: getOrchestratorMetrics,
  resetMetrics: resetOrchestratorMetrics
} = require('../thinking/orchestrator');

module.exports = {
  // Wrapper
  withThinking,
  createWrappedCommand,
  isWrapped,
  
  // Modes
  MODES,
  getModeForCommand,
  getModeConfig,
  isValidMode,
  getAllModes,
  setCommandMode,
  resetCommandMode,
  getCommandMappings,
  
  // Context
  injectThinkingContext,
  extractThinkingContext,
  validateThinkingContext,
  mergeThinkingContexts,
  formatThinkingContext,
  extractInsights,
  extractWarnings,
  
  // Metrics
  recordCommandThinking,
  getCommandMetrics,
  getAllMetrics,
  getTopCommands,
  getThinkingEffectiveness,
  getSummary,
  resetCommandMetrics,
  resetAllMetrics,
  exportMetrics,
  importMetrics,
  
  // Orchestrator (re-exported)
  thinkBeforeTool,
  thinkAfterTool,
  runBMADCheck,
  clearCache,
  getOrchestratorMetrics,
  resetOrchestratorMetrics
};
