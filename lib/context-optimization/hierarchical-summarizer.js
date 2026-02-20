/**
 * Hierarchical Summarizer (Telescope Method)
 * 
 * Creates multi-level summaries of context, enabling drill-down navigation.
 * Preserves critical details at each level while enabling progressive detail.
 */

const { callSequential } = require('../thinking/mcp-connector');

// Summary levels
const SUMMARY_LEVELS = {
  MICRO: { name: 'micro', detail: 100, tokens: 50 },      // Full detail
  MINI: { name: 'mini', detail: 75, tokens: 100 },        // Key points only
  STANDARD: { name: 'standard', detail: 50, tokens: 200 }, // Standard summary
  MACRO: { name: 'macro', detail: 25, tokens: 400 },      // High-level overview
  ULTRA: { name: 'ultra', detail: 10, tokens: 800 }       // Ultra-condensed
};

class HierarchicalSummarizer {
  constructor(config = {}) {
    this.config = {
      useThinkingServer: config.useThinkingServer ?? true,
      timeout: config.timeout || 5000,
      cacheSummaries: config.cacheSummaries ?? true,
      preservePatterns: config.preservePatterns || [
        'error', 'warning', 'critical', 'important',
        'TODO', 'FIXME', 'NOTE'
      ],
      ...config
    };
    
    this.cache = new Map();
    this.stats = {
      summariesCreated: 0,
      byLevel: {},
      averageCompression: 0,
      cacheHits: 0
    };
  }
  
  /**
   * Summarize context hierarchically
   * @param {object} context - Context to summarize
   * @param {object} options - Summarization options
   * @returns {Promise<object>} Hierarchical summary
   */
  async summarize(context, options = {}) {
    const startTime = Date.now();
    const targetTokens = options.targetTokens || 5000;
    const levels = options.levels || ['ultra', 'macro', 'standard', 'mini', 'micro'];
    
    // Check cache
    const cacheKey = this._getCacheKey(context, options);
    if (this.config.cacheSummaries && this.cache.has(cacheKey)) {
      this.stats.cacheHits++;
      return this.cache.get(cacheKey);
    }
    
    // Create hierarchical summary
    const hierarchical = {
      original: context,
      levels: {},
      navigation: {},
      metadata: {
        createdAt: Date.now(),
        targetTokens,
        levelsCreated: 0
      }
    };
    
    // Count original tokens
    const originalTokens = this._estimateTokens(context);
    hierarchical.metadata.originalTokens = originalTokens;
    
    // Create each level
    let previousLevel = null;
    for (const levelName of levels) {
      const levelConfig = SUMMARY_LEVELS[levelName.toUpperCase()] || SUMMARY_LEVELS.STANDARD;
      
      const levelResult = await this._createLevel(
        previousLevel || context,
        levelConfig,
        {
          ...options,
          isFirstLevel: !previousLevel
        }
      );
      
      hierarchical.levels[levelName] = levelResult;
      
      // Create navigation mapping
      hierarchical.navigation[levelName] = {
        tokenCount: levelResult.tokens,
        canDrillDown: previousLevel !== null,
        nextLevel: previousLevel ? levels[levels.indexOf(levelName) - 1] : null
      };
      
      previousLevel = levelResult.summary;
      hierarchical.metadata.levelsCreated++;
      
      // Update stats
      this.stats.summariesCreated++;
      this.stats.byLevel[levelName] = (this.stats.byLevel[levelName] || 0) + 1;
      
      // Stop if target reached
      if (levelResult.tokens <= targetTokens) {
        break;
      }
    }
    
    // Calculate compression
    const finalTokens = Object.values(hierarchical.levels)
      .sort((a, b) => a.tokens - b.tokens)[0]?.tokens || originalTokens;
    
    hierarchical.metadata.finalTokens = finalTokens;
    hierarchical.metadata.compressionRatio = originalTokens / finalTokens;
    
    // Update average compression
    const prevAvg = this.stats.averageCompression;
    const prevCount = this.stats.summariesCreated - 1;
    this.stats.averageCompression = 
      (prevAvg * prevCount + hierarchical.metadata.compressionRatio) / 
      this.stats.summariesCreated;
    
    // Select best summary for target
    hierarchical.summarized = this._selectBestLevel(hierarchical, targetTokens);
    hierarchical.metadata.duration = Date.now() - startTime;
    
    // Cache result
    if (this.config.cacheSummaries) {
      this.cache.set(cacheKey, hierarchical);
    }
    
    return hierarchical;
  }
  
  /**
   * Create a single summary level
   * @private
   */
  async _createLevel(content, levelConfig, options = {}) {
    const startTime = Date.now();
    
    let summary;
    let method = 'local';
    
    if (this.config.useThinkingServer && this._shouldUseServer(content, levelConfig)) {
      try {
        summary = await this._serverSummarize(content, levelConfig, options);
        method = 'server';
      } catch (error) {
        summary = this._localSummarize(content, levelConfig, options);
        method = 'local-fallback';
      }
    } else {
      summary = this._localSummarize(content, levelConfig, options);
    }
    
    const tokens = this._estimateTokens(summary);
    
    return {
      summary,
      tokens,
      detail: levelConfig.detail,
      method,
      duration: Date.now() - startTime
    };
  }
  
  /**
   * Summarize using thinking server
   * @private
   */
  async _serverSummarize(content, levelConfig, options) {
    const contentStr = typeof content === 'string' 
      ? content 
      : JSON.stringify(content, null, 2);
    
    const prompt = `Summarize the following content at ${levelConfig.detail}% detail level.
    
Rules:
1. Preserve critical information (errors, warnings, important notes)
2. Maintain structural organization
3. Keep key values and identifiers
4. Target approximately ${levelConfig.tokens} tokens

Content to summarize:
${contentStr.substring(0, 10000)}`;

    const result = await callSequential(prompt, {
      timeout: this.config.timeout
    });
    
    if (result.success && result.result) {
      return typeof result.result === 'string' 
        ? result.result 
        : JSON.stringify(result.result);
    }
    
    throw new Error('Server summarization failed');
  }
  
  /**
   * Summarize locally
   * @private
   */
  _localSummarize(content, levelConfig, options) {
    const contentStr = typeof content === 'string' 
      ? content 
      : JSON.stringify(content, null, 2);
    
    // Extract important lines based on preserve patterns
    const importantLines = [];
    const regularLines = [];
    
    const lines = contentStr.split('\n');
    for (const line of lines) {
      let isImportant = false;
      
      for (const pattern of this.config.preservePatterns) {
        if (line.toLowerCase().includes(pattern.toLowerCase())) {
          isImportant = true;
          break;
        }
      }
      
      if (isImportant) {
        importantLines.push(line);
      } else {
        regularLines.push(line);
      }
    }
    
    // Calculate how much to include
    const targetLength = Math.floor(contentStr.length * (levelConfig.detail / 100));
    
    // Build summary
    let summary = '';
    
    // Always include important lines
    if (importantLines.length > 0) {
      summary += '=== Important ===\n';
      summary += importantLines.slice(0, 50).join('\n');
      summary += '\n\n';
    }
    
    // Add regular lines to fill remaining space
    const remainingLength = targetLength - summary.length;
    if (remainingLength > 0 && regularLines.length > 0) {
      const regularContent = regularLines.join('\n');
      summary += regularContent.substring(0, remainingLength);
    }
    
    return summary.trim();
  }
  
  /**
   * Check if should use server for summarization
   * @private
   */
  _shouldUseServer(content, levelConfig) {
    const tokens = this._estimateTokens(content);
    
    // Use server for large content or low detail levels
    return tokens > 1000 || levelConfig.detail < 50;
  }
  
  /**
   * Select best level for target tokens
   * @private
   */
  _selectBestLevel(hierarchical, targetTokens) {
    const levels = Object.entries(hierarchical.levels)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.tokens - a.tokens);
    
    // Find smallest level that fits target
    for (const level of levels) {
      if (level.tokens <= targetTokens) {
        return level.summary;
      }
    }
    
    // Return smallest level
    return levels[levels.length - 1]?.summary || hierarchical.original;
  }
  
  /**
   * Estimate tokens in content
   * @private
   */
  _estimateTokens(content) {
    const str = typeof content === 'string' 
      ? content 
      : JSON.stringify(content);
    return Math.ceil(str.length / 4);
  }
  
  /**
   * Get cache key
   * @private
   */
  _getCacheKey(context, options) {
    const contentStr = typeof context === 'string' 
      ? context 
      : JSON.stringify(context);
    const hash = this._hashString(contentStr + JSON.stringify(options));
    return `summary:${hash}`;
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
   * Drill down to more detailed level
   * @param {object} hierarchical - Hierarchical summary
   * @param {string} currentLevel - Current level name
   * @returns {object} More detailed level
   */
  drillDown(hierarchical, currentLevel) {
    const levels = Object.keys(hierarchical.levels);
    const currentIndex = levels.indexOf(currentLevel);
    
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1];
      return {
        level: nextLevel,
        ...hierarchical.levels[nextLevel]
      };
    }
    
    return null;
  }
  
  /**
   * Get summarizer statistics
   * @returns {object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size
    };
  }
  
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = { HierarchicalSummarizer, SUMMARY_LEVELS };
