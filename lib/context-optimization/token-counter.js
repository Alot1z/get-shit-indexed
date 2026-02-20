/**
 * Token Counter
 * 
 * Counts tokens in various content formats.
 * Supports text, JSON, code, and structured data.
 */

class TokenCounter {
  constructor(config = {}) {
    this.config = {
      // Claude uses ~4 chars per token on average
      charsPerToken: config.charsPerToken || 4,
      // Word-based estimation (English)
      wordsPerToken: config.wordsPerToken || 0.75,
      ...config
    };
    
    this.metrics = {
      totalCounts: 0,
      byType: {},
      averageTokens: 0
    };
  }
  
  /**
   * Count tokens in content
   * @param {string|object|Buffer} content - Content to count
   * @returns {number} Estimated token count
   */
  count(content) {
    this.metrics.totalCounts++;
    
    if (content === null || content === undefined) {
      return 0;
    }
    
    let tokens = 0;
    let type = 'unknown';
    
    if (typeof content === 'string') {
      type = 'string';
      tokens = this._countString(content);
    } else if (Buffer.isBuffer(content)) {
      type = 'buffer';
      tokens = this._countString(content.toString());
    } else if (typeof content === 'object') {
      type = Array.isArray(content) ? 'array' : 'object';
      tokens = this._countObject(content);
    } else if (typeof content === 'number') {
      type = 'number';
      tokens = Math.ceil(String(content).length / this.config.charsPerToken);
    } else if (typeof content === 'boolean') {
      type = 'boolean';
      tokens = 1;
    }
    
    // Update metrics
    this.metrics.byType[type] = (this.metrics.byType[type] || 0) + 1;
    const prevAvg = this.metrics.averageTokens;
    const prevCount = this.metrics.totalCounts - 1;
    this.metrics.averageTokens = (prevAvg * prevCount + tokens) / this.metrics.totalCounts;
    
    return tokens;
  }
  
  /**
   * Count tokens in string
   * @private
   */
  _countString(str) {
    if (!str) return 0;
    
    // Method 1: Character-based (fast, rough)
    const charEstimate = Math.ceil(str.length / this.config.charsPerToken);
    
    // Method 2: Word-based (better for natural language)
    const words = str.split(/\s+/).filter(w => w.length > 0);
    const wordEstimate = Math.ceil(words.length * this.config.wordsPerToken);
    
    // Method 3: Code-aware adjustments
    let codeAdjustment = 0;
    
    // Code has more tokens due to punctuation
    const punctuation = (str.match(/[{}()\[\];,.:=+\-*/<>!&|]/g) || []).length;
    codeAdjustment += Math.ceil(punctuation * 0.3);
    
    // Strings in code
    const stringLiterals = (str.match(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g) || []).length;
    codeAdjustment += stringLiterals;
    
    // Use the higher estimate (more conservative)
    const baseEstimate = Math.max(charEstimate, wordEstimate);
    
    return baseEstimate + codeAdjustment;
  }
  
  /**
   * Count tokens in object/array
   * @private
   */
  _countObject(obj, depth = 0) {
    if (depth > 10) return 100; // Prevent infinite recursion
    
    if (obj === null) return 1;
    
    // If object has a cached token count, use it
    if (obj._tokenCount) {
      return obj._tokenCount;
    }
    
    // Convert to JSON and count
    try {
      const json = JSON.stringify(obj);
      return this._countString(json);
    } catch (e) {
      // If JSON stringify fails, estimate based on keys/values
      let count = 2; // Brackets
      
      if (Array.isArray(obj)) {
        for (const item of obj) {
          count += this._countValue(item, depth) + 1; // +1 for comma
        }
      } else {
        for (const [key, value] of Object.entries(obj)) {
          count += this._countString(key) + 1 + this._countValue(value, depth) + 1;
        }
      }
      
      return count;
    }
  }
  
  /**
   * Count tokens in a value
   * @private
   */
  _countValue(value, depth) {
    if (value === null || value === undefined) {
      return 1;
    }
    
    if (typeof value === 'string') {
      return this._countString(value);
    }
    
    if (typeof value === 'number' || typeof value === 'boolean') {
      return 1;
    }
    
    if (typeof value === 'object') {
      return this._countObject(value, depth + 1);
    }
    
    return 1;
  }
  
  /**
   * Count tokens in message format (for Claude API)
   * @param {array} messages - Array of message objects
   * @returns {number} Total token count
   */
  countMessages(messages) {
    let total = 0;
    
    for (const message of messages) {
      // Role token
      total += 1;
      
      // Content
      if (typeof message.content === 'string') {
        total += this._countString(message.content);
      } else if (Array.isArray(message.content)) {
        for (const block of message.content) {
          if (block.type === 'text') {
            total += this._countString(block.text);
          } else if (block.type === 'tool_use') {
            total += this._countObject(block);
          } else if (block.type === 'tool_result') {
            total += this._countObject(block);
          }
        }
      }
      
      // Tool definitions add overhead
      if (message.tools) {
        total += this._countObject(message.tools);
      }
    }
    
    return total;
  }
  
  /**
   * Estimate remaining context window
   * @param {number} currentTokens - Current token usage
   * @param {number} maxTokens - Maximum context window
   * @returns {object} Remaining capacity info
   */
  estimateRemaining(currentTokens, maxTokens = 200000) {
    const remaining = maxTokens - currentTokens;
    const percentUsed = (currentTokens / maxTokens) * 100;
    
    return {
      used: currentTokens,
      remaining,
      max: maxTokens,
      percentUsed: Math.round(percentUsed),
      percentRemaining: Math.round(100 - percentUsed),
      status: percentUsed > 90 ? 'critical' : percentUsed > 70 ? 'warning' : 'ok'
    };
  }
  
  /**
   * Get token counting metrics
   * @returns {object} Metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      config: this.config
    };
  }
  
  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      totalCounts: 0,
      byType: {},
      averageTokens: 0
    };
  }
}

module.exports = { TokenCounter };
