/**
 * Prompt Rewriter
 * Applies enhancement templates to prompts with intelligent selection
 */

const { getTemplate, TEMPLATE_TYPES } = require('./enhancement-templates');

/**
 * Rewrite a prompt using the specified template
 * @param {string} prompt - Original prompt
 * @param {string} templateType - Template type to apply
 * @param {object} options - Additional options
 * @returns {object} Rewrite result with original, enhanced, and metadata
 */
function rewrite(prompt, templateType, options = {}) {
  const template = getTemplate(templateType);

  // Don't modify if no template or NONE
  if (templateType === TEMPLATE_TYPES.NONE || !template) {
    return {
      original: prompt,
      enhanced: prompt,
      template: TEMPLATE_TYPES.NONE,
      changed: false,
      timestamp: new Date().toISOString()
    };
  }

  // Apply transformation
  const enhanced = template.transform(prompt);

  return {
    original: prompt,
    enhanced,
    template: templateType,
    templateName: template.name,
    changed: enhanced !== prompt,
    timestamp: new Date().toISOString()
  };
}

/**
 * Select best template based on prompt analysis
 * @param {string} prompt - Prompt to analyze
 * @param {number} riskScore - Risk score from risk engine
 * @returns {string} Selected template type
 */
function selectTemplate(prompt, riskScore = 0) {
  const lowerPrompt = prompt.toLowerCase();

  // Security-related prompts
  if (/(security|auth|crypt|vulnerab|exploit|attack)/i.test(prompt)) {
    return TEMPLATE_TYPES.SECURITY;
  }

  // Complex multi-part prompts -> Decomposed (check BEFORE implement keyword)
  // This ensures complex prompts get decomposed even if they contain "implement"
  const hasMultipleParts = /\b(and|also)\b/i.test(prompt);
  const isComplex = prompt.length > 200;
  const hasMultipleConjunctions = (prompt.match(/\b(and|also|then|next|finally)\b/gi) || []).length >= 2;
  
  if (isComplex || (hasMultipleParts && hasMultipleConjunctions)) {
    return TEMPLATE_TYPES.DECOMPOSED;
  }

  // Technical implementation prompts -> Engineering
  if (/\b(implement|build|create|develop|construct)\b/i.test(prompt)) {
    return TEMPLATE_TYPES.ENGINEERING;
  }

  // Questions -> Clarity
  if (prompt.includes('?')) {
    return TEMPLATE_TYPES.CLARITY;
  }

  // High risk -> Academic (safest framing)
  if (riskScore > 70) {
    return TEMPLATE_TYPES.ACADEMIC;
  }

  // Medium risk -> Engineering (structured approach)
  if (riskScore > 40) {
    return TEMPLATE_TYPES.ENGINEERING;
  }

  // Default -> Clarity
  return TEMPLATE_TYPES.CLARITY;
}

/**
 * Enhance prompt with automatic template selection
 * @param {string} prompt - Original prompt
 * @param {object} analysis - Analysis result from analyzePrompt
 * @returns {object} Enhancement result
 */
function enhance(prompt, analysis = {}) {
  const templateType = selectTemplate(prompt, analysis.riskScore);
  return rewrite(prompt, templateType);
}

/**
 * Apply multiple templates and return all results
 * @param {string} prompt - Original prompt
 * @param {string[]} templateTypes - Array of template types
 * @returns {object[]} Array of rewrite results
 */
function applyMultiple(prompt, templateTypes) {
  return templateTypes.map(type => rewrite(prompt, type));
}

/**
 * Compare original and enhanced prompt
 * @param {object} result - Rewrite result
 * @returns {object} Comparison metadata
 */
function compare(result) {
  const { original, enhanced } = result;

  return {
    originalLength: original.length,
    enhancedLength: enhanced.length,
    lengthDelta: enhanced.length - original.length,
    wordCountDelta: (enhanced.split(/\s+/).length) - (original.split(/\s+/).length),
    hasStructure: enhanced.includes('\n'),
    hasNumbering: /\d\./.test(enhanced)
  };
}

module.exports = {
  rewrite,
  selectTemplate,
  enhance,
  applyMultiple,
  compare
};
