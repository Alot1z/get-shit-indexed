/**
 * Reference Thinking Integration
 * 
 * Provides thinking phases for GSI reference files.
 * Includes pre-analysis with Tractatus and post-reflection with Debug.
 */

const { callTractatus, callDebug } = require('./mcp-connector');

// Reference thinking modes by type
const REFERENCE_MODES = {
  'TOOL-PRIORITY-RULES': {
    preAnalysis: 'comprehensive',
    focus: 'tool-selection-logic',
    postReflection: 'standard'
  },
  'TOOL-CHAIN-REFERENCE': {
    preAnalysis: 'comprehensive',
    focus: 'chain-patterns',
    postReflection: 'standard'
  },
  '7-BMAD': {
    preAnalysis: 'comprehensive',
    focus: 'circle-alignment',
    postReflection: 'standard'
  },
  'CHECKPOINTS': {
    preAnalysis: 'standard',
    focus: 'checkpoint-analysis',
    postReflection: 'debug'
  },
  'TDD': {
    preAnalysis: 'standard',
    focus: 'test-design',
    postReflection: 'standard'
  },
  'DEFAULT': {
    preAnalysis: 'standard',
    focus: 'general',
    postReflection: 'lightweight'
  }
};

// Thinking server recommendations by reference type
const SERVER_RECOMMENDATIONS = {
  'tool-selection': 'Tractatus - for understanding tool selection logic',
  'chain-patterns': 'Sequential - for following chain patterns step by step',
  'circle-alignment': 'Tractatus - for mapping to 7-BMAD circles',
  'checkpoint-analysis': 'Debug - for analyzing checkpoint patterns',
  'test-design': 'Sequential - for designing test sequences',
  'general': 'Tractatus - for structural understanding'
};

class ReferenceThinking {
  constructor(config = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      timeout: config.timeout || 3000,
      cacheAnalysis: config.cacheAnalysis ?? true,
      ...config
    };
    
    this.cache = new Map();
    this.metrics = {
      referencesAnalyzed: 0,
      byType: {},
      cacheHits: 0,
      averageDuration: 0
    };
  }
  
  /**
   * Analyze reference content with thinking
   * @param {string} referenceType - Type of reference
   * @param {string} content - Reference content
   * @param {object} options - Analysis options
   * @returns {Promise<object>} Analysis result
   */
  async analyzeReference(referenceType, content, options = {}) {
    if (!this.config.enabled) {
      return { analyzed: false, reason: 'Disabled' };
    }
    
    const startTime = Date.now();
    
    // Get mode for reference type
    const mode = REFERENCE_MODES[referenceType] || REFERENCE_MODES.DEFAULT;
    
    // Check cache
    const cacheKey = this._getCacheKey(referenceType, content);
    if (this.config.cacheAnalysis && this.cache.has(cacheKey)) {
      this.metrics.cacheHits++;
      return this.cache.get(cacheKey);
    }
    
    // Pre-analyze with Tractatus
    const preAnalysis = await this._preAnalyze(referenceType, content, mode);
    
    // Post-reflect with Debug
    const postReflection = await this._postReflect(referenceType, content, preAnalysis, mode);
    
    // Get server recommendation
    const serverRecommendation = this._getServerRecommendation(mode.focus);
    
    const result = {
      referenceType,
      mode,
      preAnalysis,
      postReflection,
      serverRecommendation,
      analyzedAt: Date.now(),
      duration: Date.now() - startTime
    };
    
    // Update metrics
    this.metrics.referencesAnalyzed++;
    this.metrics.byType[referenceType] = (this.metrics.byType[referenceType] || 0) + 1;
    
    const prevAvg = this.metrics.averageDuration;
    const prevCount = this.metrics.referencesAnalyzed - 1;
    this.metrics.averageDuration = (prevAvg * prevCount + result.duration) / this.metrics.referencesAnalyzed;
    
    // Cache result
    if (this.config.cacheAnalysis) {
      this.cache.set(cacheKey, result);
    }
    
    return result;
  }
  
  /**
   * Pre-analyze reference structure
   * @private
   */
  async _preAnalyze(referenceType, content, mode) {
    const contentPreview = content.substring(0, 2000);
    
    const prompt = `Analyze this ${referenceType} reference document:

${contentPreview}

Provide:
1. Document structure analysis
2. Key concepts identified
3. Recommended thinking approach
4. Integration points with GSI workflow`;

    const result = await callTractatus(prompt, {
      timeout: this.config.timeout
    });
    
    return {
      structure: this._extractStructure(result.result),
      concepts: this._extractConcepts(result.result),
      approach: this._extractApproach(result.result),
      integration: this._extractIntegration(result.result),
      raw: result.result,
      success: result.success
    };
  }
  
  /**
   * Post-reflect on reference content
   * @private
   */
  async _postReflect(referenceType, content, preAnalysis, mode) {
    const prompt = `Reflect on this ${referenceType} reference:

Pre-analysis summary: ${JSON.stringify(preAnalysis.structure || {})}

What patterns should be learned? How can this reference improve GSI operations?`;

    const result = await callDebug(prompt, {
      timeout: this.config.timeout,
      action: 'create'
    });
    
    return {
      patterns: this._extractPatterns(result.result),
      improvements: this._extractImprovements(result.result),
      raw: result.result,
      success: result.success
    };
  }
  
  /**
   * Extract structure from analysis
   * @private
   */
  _extractStructure(result) {
    if (!result) return {};
    
    const str = typeof result === 'string' ? result : JSON.stringify(result);
    
    // Look for structure indicators
    const sections = str.match(/^#+\s+.+$/gm) || [];
    const lists = str.match(/^[-*]\s+.+$/gm) || [];
    
    return {
      sections: sections.length,
      listItems: lists.length,
      hasStructure: sections.length > 0 || lists.length > 0
    };
  }
  
  /**
   * Extract concepts from analysis
   * @private
   */
  _extractConcepts(result) {
    if (!result) return [];
    
    const str = typeof result === 'string' ? result : JSON.stringify(result);
    
    // Extract capitalized terms and key phrases
    const concepts = [];
    
    const caps = str.match(/\b[A-Z][A-Z_]+\b/g) || [];
    const keyTerms = str.match(/\b(thinking|analysis|workflow|pattern|tool|server)\w*\b/gi) || [];
    
    concepts.push(...new Set([...caps, ...keyTerms.map(t => t.toLowerCase())]));
    
    return concepts.slice(0, 20);
  }
  
  /**
   * Extract recommended approach
   * @private
   */
  _extractApproach(result) {
    if (!result) return 'standard';
    
    const str = typeof result === 'string' ? result : JSON.stringify(result);
    const lower = str.toLowerCase();
    
    if (lower.includes('comprehensive')) return 'comprehensive';
    if (lower.includes('detailed')) return 'detailed';
    if (lower.includes('quick')) return 'quick';
    
    return 'standard';
  }
  
  /**
   * Extract integration points
   * @private
   */
  _extractIntegration(result) {
    if (!result) return [];
    
    const str = typeof result === 'string' ? result : JSON.stringify(result);
    
    // Look for integration mentions
    const integrations = [];
    
    if (str.includes('hook')) integrations.push('hooks');
    if (str.includes('command')) integrations.push('commands');
    if (str.includes('workflow')) integrations.push('workflows');
    if (str.includes('agent')) integrations.push('agents');
    
    return integrations;
  }
  
  /**
   * Extract patterns from reflection
   * @private
   */
  _extractPatterns(result) {
    if (!result) return [];
    
    const str = typeof result === 'string' ? result : JSON.stringify(result);
    
    // Look for pattern descriptions
    const patternMatch = str.match(/pattern[:\s]+([^.]+)/gi) || [];
    
    return patternMatch.slice(0, 5).map(p => p.trim());
  }
  
  /**
   * Extract improvements from reflection
   * @private
   */
  _extractImprovements(result) {
    if (!result) return [];
    
    const str = typeof result === 'string' ? result : JSON.stringify(result);
    
    // Look for improvement suggestions
    const improveMatch = str.match(/(?:improve|should|recommend|suggest)[^.]+/gi) || [];
    
    return improveMatch.slice(0, 5).map(i => i.trim());
  }
  
  /**
   * Get server recommendation for focus area
   * @private
   */
  _getServerRecommendation(focus) {
    return SERVER_RECOMMENDATIONS[focus] || SERVER_RECOMMENDATIONS['general'];
  }
  
  /**
   * Get cache key
   * @private
   */
  _getCacheKey(referenceType, content) {
    const hash = this._hashString(content.substring(0, 500));
    return `ref:${referenceType}:${hash}`;
  }
  
  /**
   * Simple string hash
   * @private
   */
  _hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }
  
  /**
   * Generate thinking guidance for reference
   * @param {string} referenceType - Type of reference
   * @returns {object} Thinking guidance
   */
  generateGuidance(referenceType) {
    const mode = REFERENCE_MODES[referenceType] || REFERENCE_MODES.DEFAULT;
    
    return {
      referenceType,
      mode,
      whenToUse: this._getWhenToUse(referenceType),
      thinkingServer: this._getServerRecommendation(mode.focus),
      examplePrompt: this._getExamplePrompt(referenceType),
      integrationPattern: this._getIntegrationPattern(referenceType)
    };
  }
  
  /**
   * Get when-to-use guidance
   * @private
   */
  _getWhenToUse(referenceType) {
    const guidance = {
      'TOOL-PRIORITY-RULES': 'When selecting tools for operations, especially optimizing for token efficiency',
      'TOOL-CHAIN-REFERENCE': 'When planning multi-step operations that require tool coordination',
      '7-BMAD': 'When validating work against quality circles or planning comprehensive analysis',
      'CHECKPOINTS': 'When analyzing workflow checkpoints or debugging phase transitions',
      'TDD': 'When designing tests or implementing test-driven development',
      'DEFAULT': 'When general reference guidance is needed'
    };
    
    return guidance[referenceType] || guidance['DEFAULT'];
  }
  
  /**
   * Get example prompt for reference
   * @private
   */
  _getExamplePrompt(referenceType) {
    const prompts = {
      'TOOL-PRIORITY-RULES': 'Analyze the tool selection for this operation using priority rules...',
      'TOOL-CHAIN-REFERENCE': 'Plan the tool chain for this multi-step operation...',
      '7-BMAD': 'Validate this implementation against the 7-BMAD circles...',
      'CHECKPOINTS': 'Review the checkpoint state and identify issues...',
      'TDD': 'Design tests for this functionality...',
      'DEFAULT': 'Apply reference guidance to this context...'
    };
    
    return prompts[referenceType] || prompts['DEFAULT'];
  }
  
  /**
   * Get integration pattern
   * @private
   */
  _getIntegrationPattern(referenceType) {
    return {
      preLoad: `Load ${referenceType} reference with Tractatus analysis`,
      duringUse: `Apply ${referenceType} patterns with appropriate thinking mode`,
      postUse: `Reflect on ${referenceType} application with Debug thinking`
    };
  }
  
  /**
   * Get metrics
   * @returns {object} Metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      cacheHitRate: this.metrics.referencesAnalyzed > 0
        ? this.metrics.cacheHits / this.metrics.referencesAnalyzed
        : 0
    };
  }
  
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = { 
  ReferenceThinking, 
  REFERENCE_MODES, 
  SERVER_RECOMMENDATIONS 
};
