/**
 * Prompt Enhancer Module
 * Unified API for intelligent prompt enhancement
 * 
 * @module prompt-enhancer
 * @description Analyzes prompts for complexity and applies appropriate enhancement
 */

const { assessRisk, getRiskCategory, TRIGGER_WORDS, SKIP_PATTERNS: RISK_SKIP_PATTERNS } = require('./risk-engine');
const { selectMode, getModeConfig, getAvailableModes, requiresThinking, getRecommendedMode, MODES, THRESHOLDS } = require('./mode-selector');
const { rewrite, selectTemplate, enhance, applyMultiple, compare } = require('./prompt-rewriter');
const { TEMPLATES, TEMPLATE_TYPES, getTemplate, getTemplateTypes, getAllTemplates, isValidTemplateType } = require('./enhancement-templates');
const { 
  shouldSkip, 
  getSkipDecision, 
  detectCodeSnippet, 
  detectUrl, 
  detectFollowUp,
  configureSkipRules,
  getSkipConfig,
  addSkipWord,
  addSkipPattern,
  SINGLE_WORD_SKIPS,
  SKIP_PATTERNS,
  FOLLOW_UP_PATTERNS,
  DEFAULT_CONFIG
} = require('./skip-rules');

/**
 * Analyze and select enhancement mode for a prompt
 * @param {string} prompt - User prompt to analyze
 * @param {object} options - Override options
 * @param {string} options.forceMode - Force a specific mode
 * @param {boolean} options.disableThinking - Disable thinking enhancement
 * @returns {object} Analysis result with risk score and mode
 */
function analyzePrompt(prompt, options = {}) {
  const riskScore = assessRisk(prompt);
  const riskCategory = getRiskCategory(riskScore);
  const mode = selectMode(riskScore, options);
  const config = getModeConfig(mode);
  const template = selectTemplate(prompt, riskScore);

  return {
    prompt,
    riskScore,
    riskCategory,
    mode,
    config,
    template,
    skipped: shouldSkip(prompt),
    shouldEnhance: mode !== MODES.NONE,
    timestamp: new Date().toISOString()
  };
}

/**
 * Full enhancement pipeline
 * @param {string} prompt - Original prompt
 * @param {object} options - Enhancement options
 * @returns {object} Complete enhancement result
 */
function fullEnhance(prompt, options = {}) {
  // Step 1: Analyze
  const analysis = analyzePrompt(prompt, options);

  // Step 2: Check if should skip
  if (analysis.skipped || analysis.mode === MODES.NONE) {
    return {
      analysis,
      enhancement: {
        original: prompt,
        enhanced: prompt,
        changed: false,
        skipped: true
      },
      summary: {
        enhanced: false,
        reason: analysis.skipped ? 'Prompt matched skip pattern' : 'Risk score below threshold'
      }
    };
  }

  // Step 3: Apply enhancement
  const enhancement = rewrite(prompt, analysis.template);

  return {
    analysis,
    enhancement,
    summary: {
      enhanced: enhancement.changed,
      template: enhancement.templateName,
      riskScore: analysis.riskScore,
      mode: analysis.mode
    }
  };
}

/**
 * Quick enhancement for simple cases
 * @param {string} prompt - Prompt to enhance
 * @returns {string} Enhanced prompt or original if no enhancement needed
 */
function quickEnhance(prompt) {
  const result = fullEnhance(prompt, { disableThinking: true });
  return result.enhancement.enhanced;
}

// Export all components
module.exports = {
  // Main API
  analyzePrompt,
  fullEnhance,
  quickEnhance,

  // Risk Engine
  assessRisk,
  getRiskCategory,
  TRIGGER_WORDS,
  SKIP_PATTERNS: RISK_SKIP_PATTERNS,

  // Mode Selector
  selectMode,
  getModeConfig,
  getAvailableModes,
  requiresThinking,
  getRecommendedMode,
  MODES,
  THRESHOLDS,

  // Prompt Rewriter
  rewrite,
  selectTemplate,
  enhance,
  applyMultiple,
  compare,

  // Templates
  TEMPLATES,
  TEMPLATE_TYPES,
  getTemplate,
  getTemplateTypes,
  getAllTemplates,
  isValidTemplateType,

  // Skip Rules (24-04)
  shouldSkip,
  getSkipDecision,
  detectCodeSnippet,
  detectUrl,
  detectFollowUp,
  configureSkipRules,
  getSkipConfig,
  addSkipWord,
  addSkipPattern,
  SINGLE_WORD_SKIPS,
  SKIP_PATTERNS,
  FOLLOW_UP_PATTERNS,
  DEFAULT_CONFIG
};
