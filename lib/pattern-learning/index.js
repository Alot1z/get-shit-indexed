/**
 * Pattern Learning Module
 * 
 * Provides continuous learning from GSI operations through pattern recognition,
 * prediction, and optimization suggestions.
 * 
 * @module lib/pattern-learning
 */

const { 
  recordOperation, 
  analyzeSession, 
  adaptFromFeedback, 
  getSessionStats, 
  clearSession, 
  getLearningSummary 
} = require('./loop');

const { 
  recordSession, 
  recordPrediction, 
  recordOptimization, 
  recordPattern, 
  recordEfficiencyImprovement, 
  getMetrics, 
  getMetricsSummary, 
  resetMetrics 
} = require('./metrics');

const { 
  predictNextOperation, 
  predictOptimalApproach, 
  predictRisks, 
  getPrediction 
} = require('./predictor');

const { 
  recognizeSequence, 
  recognizeConditions, 
  recognizeOptimizations, 
  recognizePatternsWithThinking, 
  exportPatterns 
} = require('./recognition');

const { 
  storePattern, 
  getPatterns, 
  getAllPatterns, 
  pruneOldPatterns, 
  getPatternStats, 
  getPatternsDir 
} = require('./storage');

const { 
  generatePatternReport, 
  generateMermaidDiagram, 
  generateVisualizationReport, 
  exportReport 
} = require('./visualization');

module.exports = {
  // Learning loop
  recordOperation,
  analyzeSession,
  adaptFromFeedback,
  getSessionStats,
  clearSession,
  getLearningSummary,
  
  // Metrics
  recordSession,
  recordPrediction,
  recordOptimization,
  recordPattern,
  recordEfficiencyImprovement,
  getMetrics,
  getMetricsSummary,
  resetMetrics,
  
  // Predictor
  predictNextOperation,
  predictOptimalApproach,
  predictRisks,
  getPrediction,
  
  // Recognition
  recognizeSequence,
  recognizeConditions,
  recognizeOptimizations,
  recognizePatternsWithThinking,
  exportPatterns,
  
  // Storage
  storePattern,
  getPatterns,
  getAllPatterns,
  pruneOldPatterns,
  getPatternStats,
  getPatternsDir,
  
  // Visualization
  generatePatternReport,
  generateMermaidDiagram,
  generateVisualizationReport,
  exportReport
};
