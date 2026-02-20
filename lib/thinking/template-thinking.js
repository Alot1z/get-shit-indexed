/**
 * Template Thinking Integration
 * 
 * Provides thinking phases for GSI templates.
 * Includes validation, learning capture, and pattern detection.
 */

const { callTractatus, callDebug, callSequential } = require('./mcp-connector');

// Template thinking modes
const TEMPLATE_MODES = {
  'plan': {
    preProcess: 'comprehensive',
    validate: 'standard',
    postProcess: 'standard',
    thinkingPhases: ['PRE_PLANNING', 'DURING_PLANNING', 'POST_PLANNING']
  },
  'summary': {
    preProcess: 'standard',
    validate: 'lightweight',
    postProcess: 'comprehensive',
    thinkingPhases: ['PRE_SUMMARY', 'DURING_SUMMARY', 'REFLECTION']
  },
  'verification': {
    preProcess: 'standard',
    validate: 'comprehensive',
    postProcess: 'standard',
    thinkingPhases: ['PRE_VERIFY', 'BMAD_CHECK', 'PATTERN_MATCH', 'LEARNING']
  },
  'context': {
    preProcess: 'standard',
    validate: 'lightweight',
    postProcess: 'lightweight',
    thinkingPhases: ['PRE_CONTEXT', 'GATHER', 'POST_CONTEXT']
  },
  'research': {
    preProcess: 'standard',
    validate: 'lightweight',
    postProcess: 'standard',
    thinkingPhases: ['PRE_RESEARCH', 'SEARCH', 'ANALYZE', 'POST_RESEARCH']
  },
  'checkpoint': {
    preProcess: 'standard',
    validate: 'standard',
    postProcess: 'comprehensive',
    thinkingPhases: ['PRE_CHECK', 'VALIDATE', 'CAPTURE', 'LEARN']
  },
  'DEFAULT': {
    preProcess: 'standard',
    validate: 'standard',
    postProcess: 'standard',
    thinkingPhases: ['PRE', 'PROCESS', 'POST']
  }
};

// Template thinking placeholders
const THINKING_PLACEHOLDERS = {
  phase: '{{THINKING_PHASE:type}}',
  server: '{{THINKING_SERVER:recommendation}}',
  checkpoint: '{{THINKING_CHECKPOINT:name}}',
  reflection: '{{THINKING_REFLECTION:capture}}'
};

class TemplateThinking {
  constructor(config = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      timeout: config.timeout || 3000,
      validateTemplates: config.validateTemplates ?? true,
      captureLearning: config.captureLearning ?? true,
      ...config
    };
    
    this.templateCache = new Map();
    this.learningStore = [];
    this.metrics = {
      templatesProcessed: 0,
      byType: {},
      validationsRun: 0,
      learningsCaptured: 0,
      averageDuration: 0
    };
  }
  
  /**
   * Process template with thinking
   * @param {string} templateType - Type of template
   * @param {object} templateData - Template data
   * @param {object} options - Processing options
   * @returns {Promise<object>} Processed template
   */
  async processTemplate(templateType, templateData, options = {}) {
    if (!this.config.enabled) {
      return { processed: templateData, thinking: { enabled: false } };
    }
    
    const startTime = Date.now();
    const mode = TEMPLATE_MODES[templateType] || TEMPLATE_MODES.DEFAULT;
    
    // Pre-process with thinking
    const preProcess = await this._preProcess(templateType, templateData, mode);
    
    // Validate template structure
    const validation = this.config.validateTemplates
      ? await this._validateTemplate(templateType, templateData, mode)
      : { validated: false, skipped: true };
    
    // Process template
    const processed = this._applyThinkingPlaceholders(templateData, mode, preProcess);
    
    // Post-process with learning capture
    const postProcess = await this._postProcess(templateType, processed, mode);
    
    // Update metrics
    this.metrics.templatesProcessed++;
    this.metrics.byType[templateType] = (this.metrics.byType[templateType] || 0) + 1;
    if (validation.validated) this.metrics.validationsRun++;
    
    const duration = Date.now() - startTime;
    const prevAvg = this.metrics.averageDuration;
    const prevCount = this.metrics.templatesProcessed - 1;
    this.metrics.averageDuration = (prevAvg * prevCount + duration) / this.metrics.templatesProcessed;
    
    return {
      processed,
      thinking: {
        enabled: true,
        mode,
        preProcess,
        validation,
        postProcess,
        duration
      }
    };
  }
  
  /**
   * Pre-process template with thinking
   * @private
   */
  async _preProcess(templateType, templateData, mode) {
    const prompt = `Analyze this ${templateType} template:

${JSON.stringify(templateData, null, 2).substring(0, 1000)}

What structure should be validated? What thinking phases are appropriate?`;

    const result = await callTractatus(prompt, {
      timeout: this.config.timeout
    });
    
    return {
      structure: this._analyzeStructure(templateData),
      thinkingRecommendation: this._extractThinkingRecommendation(result.result),
      raw: result.result,
      success: result.success
    };
  }
  
  /**
   * Validate template structure
   * @private
   */
  async _validateTemplate(templateType, templateData, mode) {
    const requiredSections = this._getRequiredSections(templateType);
    const foundSections = Object.keys(templateData);
    
    const missing = requiredSections.filter(s => !foundSections.includes(s));
    const isValid = missing.length === 0;
    
    if (!isValid && mode.validate === 'comprehensive') {
      // Use Sequential thinking to suggest fixes
      const prompt = `Template validation failed for ${templateType}.

Missing sections: ${missing.join(', ')}
Found sections: ${foundSections.join(', ')}

Suggest fixes for this template.`;

      const fixResult = await callSequential(prompt, {
        timeout: this.config.timeout
      });
      
      return {
        validated: false,
        missing,
        fixes: fixResult.result,
        raw: templateData
      };
    }
    
    return {
      validated: isValid,
      missing,
      found: foundSections
    };
  }
  
  /**
   * Post-process with learning capture
   * @private
   */
  async _postProcess(templateType, processedData, mode) {
    if (!this.config.captureLearning) {
      return { captured: false };
    }
    
    const prompt = `Reflect on this ${templateType} template processing:

What patterns were used? What should be learned for future templates?`;

    const result = await callDebug(prompt, {
      timeout: this.config.timeout,
      action: 'create'
    });
    
    const learning = {
      templateType,
      patterns: this._extractPatterns(result.result),
      timestamp: Date.now()
    };
    
    this.learningStore.push(learning);
    this.metrics.learningsCaptured++;
    
    // Keep learning store manageable
    if (this.learningStore.length > 100) {
      this.learningStore = this.learningStore.slice(-50);
    }
    
    return {
      captured: true,
      patterns: learning.patterns,
      raw: result.result
    };
  }
  
  /**
   * Apply thinking placeholders to template
   * @private
   */
  _applyThinkingPlaceholders(templateData, mode, preProcess) {
    const processed = { ...templateData };
    
    // Add thinking phase section
    processed._thinkingPhase = {
      mode,
      recommendation: preProcess.thinkingRecommendation,
      phases: mode.thinkingPhases.map(phase => ({
        name: phase,
        placeholder: `${THINKING_PLACEHOLDERS.phase.replace('type', phase.toLowerCase())}`
      }))
    };
    
    return processed;
  }
  
  /**
   * Analyze template structure
   * @private
   */
  _analyzeStructure(templateData) {
    return {
      keys: Object.keys(templateData),
      depth: this._getDepth(templateData),
      hasArrays: Object.values(templateData).some(v => Array.isArray(v)),
      hasObjects: Object.values(templateData).some(v => typeof v === 'object' && v !== null)
    };
  }
  
  /**
   * Get depth of object
   * @private
   */
  _getDepth(obj, current = 1) {
    if (typeof obj !== 'object' || obj === null) return current;
    
    let maxDepth = current;
    for (const value of Object.values(obj)) {
      if (typeof value === 'object' && value !== null) {
        const depth = this._getDepth(value, current + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }
    
    return maxDepth;
  }
  
  /**
   * Extract thinking recommendation from result
   * @private
   */
  _extractThinkingRecommendation(result) {
    if (!result) return 'standard';
    
    const str = typeof result === 'string' ? result : JSON.stringify(result);
    const lower = str.toLowerCase();
    
    if (lower.includes('comprehensive') || lower.includes('detailed')) {
      return 'comprehensive';
    }
    if (lower.includes('lightweight') || lower.includes('quick')) {
      return 'lightweight';
    }
    
    return 'standard';
  }
  
  /**
   * Get required sections for template type
   * @private
   */
  _getRequiredSections(templateType) {
    const requirements = {
      'plan': ['objective', 'tasks', 'verification'],
      'summary': ['summary', 'results'],
      'verification': ['checks', 'results'],
      'context': ['content'],
      'research': ['query', 'findings'],
      'checkpoint': ['state', 'status'],
      'DEFAULT': []
    };
    
    return requirements[templateType] || requirements['DEFAULT'];
  }
  
  /**
   * Extract patterns from result
   * @private
   */
  _extractPatterns(result) {
    if (!result) return [];
    
    const str = typeof result === 'string' ? result : JSON.stringify(result);
    
    // Look for pattern mentions
    const patterns = [];
    
    // Simple extraction - look for repeated terms
    const terms = str.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const termCounts = {};
    
    for (const term of terms) {
      termCounts[term] = (termCounts[term] || 0) + 1;
    }
    
    // Get terms that appear multiple times
    for (const [term, count] of Object.entries(termCounts)) {
      if (count > 1) {
        patterns.push(term);
      }
    }
    
    return patterns.slice(0, 10);
  }
  
  /**
   * Get template metadata with thinking requirements
   * @param {string} templateType - Type of template
   * @returns {object} Template metadata
   */
  getTemplateMetadata(templateType) {
    const mode = TEMPLATE_MODES[templateType] || TEMPLATE_MODES.DEFAULT;
    
    return {
      templateType,
      thinkingMode: mode,
      placeholders: THINKING_PLACEHOLDERS,
      phases: mode.thinkingPhases,
      validation: {
        required: this._getRequiredSections(templateType),
        level: mode.validate
      }
    };
  }
  
  /**
   * Get thinking guidance for template
   * @param {string} templateType - Type of template
   * @returns {object} Thinking guidance
   */
  getThinkingGuidance(templateType) {
    const mode = TEMPLATE_MODES[templateType] || TEMPLATE_MODES.DEFAULT;
    
    return {
      preProcess: `Before processing ${templateType}: Use ${mode.preProcess} thinking`,
      duringProcess: `During processing: Use ${mode.validate} validation`,
      postProcess: `After processing: Use ${mode.postProcess} thinking for reflection`,
      phases: mode.thinkingPhases.map(phase => ({
        phase,
        server: this._getServerForPhase(phase)
      }))
    };
  }
  
  /**
   * Get thinking server for phase
   * @private
   */
  _getServerForPhase(phase) {
    const lower = phase.toLowerCase();
    
    if (lower.includes('plan') || lower.includes('structure')) {
      return 'Tractatus';
    }
    if (lower.includes('verify') || lower.includes('check') || lower.includes('valid')) {
      return 'Sequential';
    }
    if (lower.includes('reflect') || lower.includes('learn')) {
      return 'Debug';
    }
    
    return 'Sequential';
  }
  
  /**
   * Get learned patterns
   * @returns {array} Learned patterns
   */
  getLearnedPatterns() {
    return this.learningStore.slice(-20);
  }
  
  /**
   * Get metrics
   * @returns {object} Metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      templateCacheSize: this.templateCache.size,
      learningStoreSize: this.learningStore.length
    };
  }
  
  /**
   * Clear caches
   */
  clearCaches() {
    this.templateCache.clear();
    this.learningStore = [];
  }
}

module.exports = { 
  TemplateThinking, 
  TEMPLATE_MODES, 
  THINKING_PLACEHOLDERS 
};
