/**
 * Refusal Detector
 * 
 * Detects blocked, ambiguous, or problematic responses.
 * Provides alternative approaches when requests are refused or blocked.
 */

// Refusal patterns to detect
const REFUSAL_PATTERNS = {
  direct: [
    /i (?:cannot|can't|won't|will not|am unable to|cannot) (?:help|assist|do|perform|complete)/i,
    /i (?:am not able|cannot|can't) (?:to )?(?:provide|generate|create|write)/i,
    /(?:this|that) (?:is|would be) (?:not allowed|inappropriate|against)/i,
    /i (?:must|have to|need to) (?:decline|refuse|reject)/i
  ],
  
  ambiguous: [
    /i'm not sure (?:what|how|if)/i,
    /i am not sure (?:what|how|if)/i,
    /(?:could you|can you|please) (?:clarify|specify|explain)/i,
    /it (?:depends|might|may|could) (?:on|be)/i,
    /there are (?:multiple|several|many) (?:ways|approaches|options)/i,
    /i need more (?:information|context|details)/i
  ],
  
  blocked: [
    /(?:blocked|blocked by|prevented by)/i,
    /(?:error|failure|failed) (?:occurred|happened)/i,
    /(?:access|permission) (?:denied|restricted|prohibited)/i,
    /(?:timeout|timed out|took too long)/i,
    /(?:rate limit|quota exceeded|too many)/i
  ],
  
  partial: [
    /(?:partially|partly|incomplete) (?:completed|done|finished)/i,
    /i (?:could|can) only (?:do|handle|process)/i,
    /some (?:parts|aspects|components) (?:were|are)/i,
    /(?:limited|restricted) (?:results|output|response)/i,
    /only partially/i
  ]
};

// Alternative approach templates
const ALTERNATIVE_APPROACHES = {
  direct: [
    {
      name: 'decompose',
      prompt: 'Break down the request into smaller, more specific sub-tasks',
      description: 'Decompose complex request into manageable parts'
    },
    {
      name: 'rephrase',
      prompt: 'Rephrase the request using different terminology',
      description: 'Try alternative phrasing that may be clearer'
    },
    {
      name: 'context',
      prompt: 'Provide additional context or constraints',
      description: 'Add clarifying context to guide the response'
    }
  ],
  
  ambiguous: [
    {
      name: 'clarify',
      prompt: 'Ask clarifying questions to narrow scope',
      description: 'Request clarification on ambiguous aspects'
    },
    {
      name: 'assume',
      prompt: 'Make reasonable assumptions and state them clearly',
      description: 'Proceed with documented assumptions'
    },
    {
      name: 'enumerate',
      prompt: 'List multiple possible interpretations',
      description: 'Explore multiple interpretations of the request'
    }
  ],
  
  blocked: [
    {
      name: 'fallback',
      prompt: 'Try an alternative approach or tool',
      description: 'Use different method to achieve goal'
    },
    {
      name: 'simplify',
      prompt: 'Reduce scope or complexity',
      description: 'Simplify the request to avoid blocking'
    },
    {
      name: 'retry',
      prompt: 'Retry with modified parameters',
      description: 'Attempt again with adjusted settings'
    }
  ],
  
  partial: [
    {
      name: 'continue',
      prompt: 'Continue from where the partial result left off',
      description: 'Build upon partial results'
    },
    {
      name: 'supplement',
      prompt: 'Provide supplementary information for incomplete parts',
      description: 'Fill in missing pieces'
    },
    {
      name: 'validate',
      prompt: 'Validate the partial result before continuing',
      description: 'Verify partial results are correct'
    }
  ]
};

class RefusalDetector {
  constructor(config = {}) {
    this.config = {
      confidenceThreshold: config.confidenceThreshold || 0.6,
      provideAlternatives: config.provideAlternatives ?? true,
      logDetections: config.logDetections ?? true,
      ...config
    };
    
    this.detectionLog = [];
    this.metrics = {
      totalDetections: 0,
      byType: {
        direct: 0,
        ambiguous: 0,
        blocked: 0,
        partial: 0
      },
      alternativeSuccessRate: 0,
      alternativesAttempted: 0,
      alternativesSucceeded: 0
    };
  }
  
  /**
   * Detect if response contains refusal indicators
   * @param {object|string} response - Response to analyze
   * @returns {Promise<object>} Detection result
   */
  async detect(response) {
    const text = typeof response === 'string' 
      ? response 
      : JSON.stringify(response);
    
    const detections = {
      isRefusal: false,
      type: null,
      confidence: 0,
      matches: [],
      alternatives: [],
      recommendation: null
    };
    
    // Check each pattern type
    for (const [type, patterns] of Object.entries(REFUSAL_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          detections.matches.push({
            type,
            pattern: pattern.toString(),
            matched: text.match(pattern)?.[0]
          });
        }
      }
    }
    
    // Determine primary detection type
    if (detections.matches.length > 0) {
      // Count matches by type
      const typeCounts = {};
      for (const match of detections.matches) {
        typeCounts[match.type] = (typeCounts[match.type] || 0) + 1;
      }
      
      // Find most common type
      let maxType = null;
      let maxCount = 0;
      for (const [type, count] of Object.entries(typeCounts)) {
        if (count > maxCount) {
          maxCount = count;
          maxType = type;
        }
      }
      
      detections.type = maxType;
      detections.isRefusal = true;
      detections.confidence = Math.min(maxCount * 0.3 + 0.4, 1.0);
      
      // Generate alternatives
      if (this.config.provideAlternatives) {
        detections.alternatives = this._getAlternatives(maxType);
        detections.recommendation = this._recommendAlternative(detections);
      }
      
      // Update metrics
      this.metrics.totalDetections++;
      this.metrics.byType[maxType]++;
      
      // Log detection
      if (this.config.logDetections) {
        this._logDetection(detections, text);
      }
    }
    
    return detections;
  }
  
  /**
   * Get alternative approaches for a detection type
   * @private
   */
  _getAlternatives(type) {
    return ALTERNATIVE_APPROACHES[type] || ALTERNATIVE_APPROACHES.ambiguous;
  }
  
  /**
   * Recommend best alternative
   * @private
   */
  _recommendAlternative(detections) {
    const alternatives = detections.alternatives;
    if (!alternatives || alternatives.length === 0) {
      return null;
    }
    
    // Default to first alternative, but could be enhanced with ML
    const recommended = alternatives[0];
    
    return {
      approach: recommended.name,
      description: recommended.description,
      suggestedPrompt: recommended.prompt,
      allOptions: alternatives.map(a => ({
        name: a.name,
        description: a.description
      }))
    };
  }
  
  /**
   * Log a detection
   * @private
   */
  _logDetection(detections, text) {
    this.detectionLog.push({
      timestamp: Date.now(),
      type: detections.type,
      confidence: detections.confidence,
      matchCount: detections.matches.length,
      textSnippet: text.substring(0, 200),
      recommendation: detections.recommendation?.approach
    });
    
    // Keep log size manageable
    if (this.detectionLog.length > 1000) {
      this.detectionLog = this.detectionLog.slice(-500);
    }
  }
  
  /**
   * Record alternative attempt result
   * @param {string} alternativeName - Name of alternative used
   * @param {boolean} success - Whether alternative succeeded
   */
  recordAlternativeResult(alternativeName, success) {
    this.metrics.alternativesAttempted++;
    if (success) {
      this.metrics.alternativesSucceeded++;
    }
    
    this.metrics.alternativeSuccessRate = 
      this.metrics.alternativesSucceeded / this.metrics.alternativesAttempted;
  }
  
  /**
   * Check if text matches specific refusal type
   * @param {string} text - Text to check
   * @param {string} type - Refusal type to check for
   * @returns {boolean} True if matches
   */
  matchesType(text, type) {
    const patterns = REFUSAL_PATTERNS[type];
    if (!patterns) return false;
    
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Get detection statistics
   * @returns {object} Statistics
   */
  getStats() {
    return {
      ...this.metrics,
      recentDetections: this.detectionLog.slice(-10),
      logSize: this.detectionLog.length
    };
  }
  
  /**
   * Clear detection log
   */
  clearLog() {
    this.detectionLog = [];
  }
  
  /**
   * Get patterns for external use
   * @returns {object} Pattern definitions
   */
  getPatterns() {
    return { ...REFUSAL_PATTERNS };
  }
  
  /**
   * Get alternative templates
   * @returns {object} Alternative templates
   */
  getAlternatives() {
    return { ...ALTERNATIVE_APPROACHES };
  }
}

module.exports = { RefusalDetector, REFUSAL_PATTERNS, ALTERNATIVE_APPROACHES };
