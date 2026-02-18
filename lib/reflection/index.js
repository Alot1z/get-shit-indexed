/**
 * Reflection Module
 * 
 * Provides post-tool-use reflection capture, pattern extraction, and insight
 * generation for continuous improvement of GSI operations.
 * 
 * @module lib/reflection
 */

const { 
  ReflectionTypes, 
  PatternTypes, 
  InsightTypes, 
  Reflection, 
  Pattern, 
  Insight 
} = require('./schema');

const ReflectionCapture = require('./capture');

const DebugThinkingIntegration = require('./debug-integration');

const InsightGenerator = require('./insights');

const PatternExtractor = require('./patterns');

module.exports = {
  // Schema
  ReflectionTypes,
  PatternTypes,
  InsightTypes,
  Reflection,
  Pattern,
  Insight,
  
  // Capture
  ReflectionCapture,
  
  // Debug integration
  DebugThinkingIntegration,
  
  // Insights
  InsightGenerator,
  
  // Patterns
  PatternExtractor
};
