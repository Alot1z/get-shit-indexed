/**
 * GSI Enhancement Module
 * 
 * Cross-feature enhancement system that connects all GSI features
 * for mutual benefit.
 * 
 * Features:
 * - Feature registry for discovery
 * - Enhancement orchestrator for coordination
 * - MCP coordinator for tool selection
 * - Metrics for tracking enhancement effectiveness
 */

const {
  FeatureRegistry,
  FEATURES,
  getRegistry,
  getAllFeatures,
  getFeature,
  getFeaturesByCapability,
  getFeaturesByServer,
  checkAllHealth,
  getFeatureConnections,
  getEnhancementOpportunities
} = require('./feature-registry');

const {
  EnhancementOrchestrator,
  getOrchestrator,
  enhanceWithFeatures,
  getEnhancements,
  PRIORITY,
  PHASE
} = require('./orchestrator');

const {
  selectOptimalTool,
  getOptimalToolChain,
  getServerForTool,
  getAvailableServers,
  checkServerHealth,
  markServerAvailable,
  markServerUnavailable,
  getFallbackServer,
  getHealthReport
} = require('./mcp-coordinator');

const {
  recordThinkingPatternEnhancement,
  recordPatternThinkingEnhancement,
  recordMCPCoordination,
  recordServerHealth,
  recordCrossFeatureCall,
  recordEnhancementChain,
  getEnhancementMetrics,
  getMetricsSummary,
  resetMetrics
} = require('./metrics');

module.exports = {
  // Feature Registry
  FeatureRegistry,
  FEATURES,
  getRegistry,
  getAllFeatures,
  getFeature,
  getFeaturesByCapability,
  getFeaturesByServer,
  checkAllHealth,
  getFeatureConnections,
  getEnhancementOpportunities,
  
  // Orchestrator
  EnhancementOrchestrator,
  getOrchestrator,
  enhanceWithFeatures,
  getEnhancements,
  PRIORITY,
  PHASE,
  
  // MCP Coordinator
  selectOptimalTool,
  getOptimalToolChain,
  getServerForTool,
  getAvailableServers,
  checkServerHealth,
  markServerAvailable,
  markServerUnavailable,
  getFallbackServer,
  getHealthReport,
  
  // Metrics
  recordThinkingPatternEnhancement,
  recordPatternThinkingEnhancement,
  recordMCPCoordination,
  recordServerHealth,
  recordCrossFeatureCall,
  recordEnhancementChain,
  getEnhancementMetrics,
  getMetricsSummary,
  resetMetrics
};
