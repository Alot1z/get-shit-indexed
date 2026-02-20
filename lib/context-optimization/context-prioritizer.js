/**
 * Context Prioritizer
 * 
 * Ranks and prioritizes context items by relevance.
 * Enables efficient context loading based on importance.
 */

// Priority factors and their weights
const PRIORITY_FACTORS = {
  recency: {
    weight: 0.2,
    calculate: (item) => {
      if (!item.timestamp) return 0.5;
      const age = Date.now() - item.timestamp;
      const hours = age / (1000 * 60 * 60);
      return Math.max(0, 1 - hours / 24); // Decay over 24 hours
    }
  },
  
  frequency: {
    weight: 0.15,
    calculate: (item) => {
      const count = item.accessCount || 1;
      return Math.min(1, count / 10);
    }
  },
  
  relevance: {
    weight: 0.3,
    calculate: (item, criteria) => {
      if (!criteria.keywords || criteria.keywords.length === 0) return 0.5;
      
      const content = (item.content || item.value || JSON.stringify(item)).toLowerCase();
      let matchCount = 0;
      
      for (const keyword of criteria.keywords) {
        if (content.includes(keyword.toLowerCase())) {
          matchCount++;
        }
      }
      
      return matchCount / criteria.keywords.length;
    }
  },
  
  importance: {
    weight: 0.2,
    calculate: (item) => {
      // Check for importance markers
      const content = (item.content || item.value || JSON.stringify(item)).toLowerCase();
      
      if (content.includes('critical') || content.includes('urgent')) return 1.0;
      if (content.includes('important') || content.includes('key')) return 0.8;
      if (content.includes('warning') || content.includes('error')) return 0.7;
      if (content.includes('note') || content.includes('todo')) return 0.5;
      
      return item.importance || 0.3;
    }
  },
  
  type: {
    weight: 0.15,
    calculate: (item, criteria) => {
      const typePriority = criteria.typePriority || {
        instruction: 1.0,
        task: 0.9,
        error: 0.85,
        context: 0.7,
        reference: 0.6,
        cache: 0.4,
        log: 0.2
      };
      
      const type = item.type || 'context';
      return typePriority[type] || 0.5;
    }
  }
};

class ContextPrioritizer {
  constructor(config = {}) {
    this.config = {
      defaultLimit: config.defaultLimit || 10,
      minScore: config.minScore || 0.1,
      factors: config.factors || PRIORITY_FACTORS,
      ...config
    };
    
    this.stats = {
      prioritizations: 0,
      itemsProcessed: 0,
      averageScore: 0,
      byType: {}
    };
  }
  
  /**
   * Prioritize context items
   * @param {array} items - Items to prioritize
   * @param {object} criteria - Prioritization criteria
   * @returns {array} Prioritized items
   */
  prioritize(items, criteria = {}) {
    this.stats.prioritizations++;
    this.stats.itemsProcessed += items.length;
    
    // Calculate scores for each item
    const scored = items.map(item => ({
      item,
      score: this._calculateScore(item, criteria),
      factors: this._getFactorScores(item, criteria)
    }));
    
    // Sort by score
    scored.sort((a, b) => b.score - a.score);
    
    // Filter by minimum score
    const filtered = scored.filter(s => s.score >= (criteria.minScore || this.config.minScore));
    
    // Apply limit
    const limit = criteria.limit || this.config.defaultLimit;
    const limited = filtered.slice(0, limit);
    
    // Update stats
    const avgScore = scored.reduce((sum, s) => sum + s.score, 0) / scored.length;
    const prevAvg = this.stats.averageScore;
    const prevCount = this.stats.prioritizations - 1;
    this.stats.averageScore = (prevAvg * prevCount + avgScore) / this.stats.prioritizations;
    
    // Track by type
    for (const scored_item of limited) {
      const type = scored_item.item.type || 'unknown';
      this.stats.byType[type] = (this.stats.byType[type] || 0) + 1;
    }
    
    // Apply token budget if specified
    if (criteria.tokenBudget) {
      return this._applyTokenBudget(limited, criteria.tokenBudget);
    }
    
    return limited.map(s => ({
      ...s.item,
      _priority: {
        score: s.score,
        rank: limited.indexOf(s) + 1,
        factors: s.factors
      }
    }));
  }
  
  /**
   * Calculate priority score for item
   * @private
   */
  _calculateScore(item, criteria) {
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const [factorName, factor] of Object.entries(this.config.factors)) {
      try {
        const factorScore = factor.calculate(item, criteria);
        totalScore += factorScore * factor.weight;
        totalWeight += factor.weight;
      } catch (error) {
        // Factor calculation failed, skip
      }
    }
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }
  
  /**
   * Get individual factor scores
   * @private
   */
  _getFactorScores(item, criteria) {
    const scores = {};
    
    for (const [factorName, factor] of Object.entries(this.config.factors)) {
      try {
        scores[factorName] = factor.calculate(item, criteria);
      } catch (error) {
        scores[factorName] = 0;
      }
    }
    
    return scores;
  }
  
  /**
   * Apply token budget to prioritized items
   * @private
   */
  _applyTokenBudget(scored, tokenBudget) {
    const result = [];
    let usedTokens = 0;
    
    for (const scored_item of scored) {
      const itemTokens = this._estimateTokens(scored_item.item);
      
      if (usedTokens + itemTokens <= tokenBudget) {
        result.push({
          ...scored_item.item,
          _priority: {
            score: scored_item.score,
            rank: result.length + 1,
            tokens: itemTokens,
            factors: scored_item.factors
          }
        });
        usedTokens += itemTokens;
      }
    }
    
    return result;
  }
  
  /**
   * Estimate tokens in item
   * @private
   */
  _estimateTokens(item) {
    if (item.tokens) return item.tokens;
    
    const content = item.content || item.value || JSON.stringify(item);
    return Math.ceil(content.length / 4);
  }
  
  /**
   * Get top N items without full prioritization
   * @param {array} items - Items to filter
   * @param {number} n - Number to return
   * @param {object} criteria - Filter criteria
   * @returns {array} Top N items
   */
  getTopN(items, n, criteria = {}) {
    // Quick prioritization without detailed scoring
    const quickScore = (item) => {
      let score = 0;
      
      // Check importance markers
      const content = (item.content || item.value || '').toLowerCase();
      if (content.includes('critical')) score += 10;
      if (content.includes('important')) score += 5;
      if (content.includes('error')) score += 4;
      
      // Check keywords
      if (criteria.keywords) {
        for (const kw of criteria.keywords) {
          if (content.includes(kw.toLowerCase())) score += 3;
        }
      }
      
      // Add access count bonus
      score += Math.min((item.accessCount || 0), 5);
      
      return score;
    };
    
    return items
      .map(item => ({ item, score: quickScore(item) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map(s => s.item);
  }
  
  /**
   * Categorize items by priority tier
   * @param {array} items - Items to categorize
   * @param {object} criteria - Categorization criteria
   * @returns {object} Items by tier
   */
  categorizeByTier(items, criteria = {}) {
    const scored = items.map(item => ({
      item,
      score: this._calculateScore(item, criteria)
    }));
    
    return {
      critical: scored.filter(s => s.score >= 0.8).map(s => s.item),
      high: scored.filter(s => s.score >= 0.6 && s.score < 0.8).map(s => s.item),
      medium: scored.filter(s => s.score >= 0.4 && s.score < 0.6).map(s => s.item),
      low: scored.filter(s => s.score < 0.4).map(s => s.item)
    };
  }
  
  /**
   * Get prioritizer statistics
   * @returns {object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      averageItemsPerCall: this.stats.prioritizations > 0
        ? this.stats.itemsProcessed / this.stats.prioritizations
        : 0
    };
  }
  
  /**
   * Add custom priority factor
   * @param {string} name - Factor name
   * @param {object} factor - Factor definition with weight and calculate function
   */
  addFactor(name, factor) {
    this.config.factors[name] = factor;
  }
  
  /**
   * Remove priority factor
   * @param {string} name - Factor name
   */
  removeFactor(name) {
    delete this.config.factors[name];
  }
  
  /**
   * Set factor weight
   * @param {string} name - Factor name
   * @param {number} weight - New weight
   */
  setFactorWeight(name, weight) {
    if (this.config.factors[name]) {
      this.config.factors[name].weight = weight;
    }
  }
}

module.exports = { ContextPrioritizer, PRIORITY_FACTORS };
