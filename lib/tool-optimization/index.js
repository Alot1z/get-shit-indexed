/**
 * Tool Selection System
 * 
 * Provides situation-specific tool guidance for all GSI agents.
 * Optimizes token usage by recommending MCP tools over native tools.
 * 
 * @module lib/tool-optimization
 */

const { TOOL_REGISTRY, getToolRecommendation, getTokenSavings } = require('./tool-registry');
const { ToolSelector } = require('./tool-selector');
const { SituationAnalyzer } = require('./situation-analyzer');

module.exports = {
  TOOL_REGISTRY,
  getToolRecommendation,
  getTokenSavings,
  ToolSelector,
  SituationAnalyzer
};
