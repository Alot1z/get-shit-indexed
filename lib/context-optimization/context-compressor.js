/**
 * Context Compressor
 * 
 * Compresses context to reduce token usage while preserving meaning.
 * Supports multiple compression levels and strategies.
 */

const { callSequential } = require('../thinking/mcp-connector');

// Compression levels
const COMPRESSION_LEVELS = {
  LIGHT: {
    name: 'light',
    ratio: 0.8,          // Keep 80% of content
    strategies: ['whitespace', 'comments']
  },
  MODERATE: {
    name: 'moderate',
    ratio: 0.6,          // Keep 60% of content
    strategies: ['whitespace', 'comments', 'summarize-functions']
  },
  AGGRESSIVE: {
    name: 'aggressive',
    ratio: 0.4,          // Keep 40% of content
    strategies: ['whitespace', 'comments', 'summarize-functions', 'signatures-only']
  },
  MAXIMUM: {
    name: 'maximum',
    ratio: 0.2,          // Keep 20% of content
    strategies: ['whitespace', 'comments', 'signatures-only', 'key-terms']
  }
};

class ContextCompressor {
  constructor(config = {}) {
    this.config = {
      useThinkingServer: config.useThinkingServer ?? true,
      timeout: config.timeout || 5000,
      cacheResults: config.cacheResults ?? true,
      preserveKeywords: config.preserveKeywords || [
        'function', 'class', 'interface', 'type', 'const', 'let', 'var',
        'import', 'export', 'return', 'async', 'await'
      ],
      ...config
    };
    
    this.cache = new Map();
    this.stats = {
      compressions: 0,
      byLevel: {},
      averageRatio: 0,
      cacheHits: 0,
      bytesSaved: 0
    };
  }
  
  /**
   * Compress context
   * @param {object|string} context - Context to compress
   * @param {object} options - Compression options
   * @returns {Promise<object>} Compression result
   */
  async compress(context, options = {}) {
    const startTime = Date.now();
    const level = options.level || 'moderate';
    const targetTokens = options.targetTokens;
    
    const levelConfig = COMPRESSION_LEVELS[level.toUpperCase()] || COMPRESSION_LEVELS.MODERATE;
    
    // Check cache
    const cacheKey = this._getCacheKey(context, level, targetTokens);
    if (this.config.cacheResults && this.cache.has(cacheKey)) {
      this.stats.cacheHits++;
      return this.cache.get(cacheKey);
    }
    
    // Convert to string if needed
    const contentStr = typeof context === 'string' 
      ? context 
      : JSON.stringify(context, null, 2);
    
    const originalTokens = this._estimateTokens(contentStr);
    
    // Apply compression strategies
    let compressed = contentStr;
    
    for (const strategy of levelConfig.strategies) {
      compressed = await this._applyStrategy(compressed, strategy, levelConfig);
    }
    
    // If target tokens specified, adjust compression
    if (targetTokens) {
      while (this._estimateTokens(compressed) > targetTokens && levelConfig.ratio > 0.1) {
        // Apply more aggressive compression
        compressed = this._truncate(compressed, targetTokens);
      }
    }
    
    const compressedTokens = this._estimateTokens(compressed);
    const actualRatio = compressedTokens / originalTokens;
    
    // Update stats
    this.stats.compressions++;
    this.stats.byLevel[level] = (this.stats.byLevel[level] || 0) + 1;
    this.stats.bytesSaved += contentStr.length - compressed.length;
    
    const prevAvg = this.stats.averageRatio;
    const prevCount = this.stats.compressions - 1;
    this.stats.averageRatio = (prevAvg * prevCount + actualRatio) / this.stats.compressions;
    
    const result = {
      compressed,
      originalTokens,
      compressedTokens,
      ratio: actualRatio,
      savingsPercent: Math.round((1 - actualRatio) * 100),
      level,
      strategies: levelConfig.strategies,
      duration: Date.now() - startTime
    };
    
    // Cache result
    if (this.config.cacheResults) {
      this.cache.set(cacheKey, result);
    }
    
    return result;
  }
  
  /**
   * Apply compression strategy
   * @private
   */
  async _applyStrategy(content, strategy, levelConfig) {
    switch (strategy) {
      case 'whitespace':
        return this._removeWhitespace(content);
      
      case 'comments':
        return this._removeComments(content);
      
      case 'summarize-functions':
        return await this._summarizeFunctions(content, levelConfig);
      
      case 'signatures-only':
        return this._extractSignatures(content);
      
      case 'key-terms':
        return this._extractKeyTerms(content, levelConfig);
      
      default:
        return content;
    }
  }
  
  /**
   * Remove excess whitespace
   * @private
   */
  _removeWhitespace(content) {
    return content
      .replace(/[ \t]+/g, ' ')           // Multiple spaces to single
      .replace(/\n\s*\n\s*\n/g, '\n\n')  // Multiple blank lines to double
      .replace(/^\s+|\s+$/gm, '')        // Trim lines
      .trim();
  }
  
  /**
   * Remove comments
   * @private
   */
  _removeComments(content) {
    // Remove single-line comments
    let result = content.replace(/\/\/.*$/gm, '');
    
    // Remove multi-line comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove docstrings (Python style)
    result = result.replace(/"""[\s\S]*?"""/g, '');
    result = result.replace(/'''[\s\S]*?'''/g, '');
    
    // Remove # comments (Python, shell)
    result = result.replace(/#.*$/gm, '');
    
    // Remove HTML comments
    result = result.replace(/<!--[\s\S]*?-->/g, '');
    
    return result;
  }
  
  /**
   * Summarize function implementations
   * @private
   */
  async _summarizeFunctions(content, levelConfig) {
    // Pattern to find functions
    const functionPattern = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(|(\w+)\s*:\s*(?:async\s*)?\()/g;
    
    let result = content;
    const functions = [];
    
    // Find all functions
    let match;
    while ((match = functionPattern.exec(content)) !== null) {
      const name = match[1] || match[2] || match[3];
      const start = match.index;
      
      // Find end of function (simplified)
      let depth = 0;
      let end = start;
      let started = false;
      
      for (let i = start; i < content.length; i++) {
        if (content[i] === '{') {
          depth++;
          started = true;
        } else if (content[i] === '}') {
          depth--;
          if (started && depth === 0) {
            end = i + 1;
            break;
          }
        }
      }
      
      functions.push({ name, start, end, full: content.substring(start, end) });
    }
    
    // Summarize each function
    for (const fn of functions.reverse()) {
      const signature = this._extractFunctionSignature(fn.full);
      const summary = fn.full.length > 500 
        ? `${signature}\n  // ... implementation (${fn.full.split('\n').length} lines) ...`
        : fn.full;
      
      result = result.substring(0, fn.start) + summary + result.substring(fn.end);
    }
    
    return result;
  }
  
  /**
   * Extract function signature
   * @private
   */
  _extractFunctionSignature(fnCode) {
    const lines = fnCode.split('\n');
    const signatureLines = [];
    
    for (const line of lines) {
      signatureLines.push(line);
      if (line.includes('{') || line.includes('=>')) {
        break;
      }
    }
    
    return signatureLines.join('\n').replace(/\{$/, '').trim();
  }
  
  /**
   * Extract only signatures
   * @private
   */
  _extractSignatures(content) {
    const lines = content.split('\n');
    const signatures = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for function/class/interface definitions
      if (/^\s*(function|class|interface|type|const|let|var)\s+\w+/.test(line)) {
        signatures.push(line);
        
        // Include next line if it continues the signature
        if (i + 1 < lines.length && lines[i + 1].match(/^\s*[<{(\[]/)) {
          signatures.push(lines[i + 1]);
        }
      }
      
      // Include imports and exports
      if (/^\s*(import|export)\s+/.test(line)) {
        signatures.push(line);
      }
    }
    
    return signatures.join('\n');
  }
  
  /**
   * Extract key terms and patterns
   * @private
   */
  _extractKeyTerms(content, levelConfig) {
    const terms = new Set();
    
    // Extract preserved keywords
    for (const keyword of this.config.preserveKeywords) {
      const pattern = new RegExp(`\\b${keyword}\\b[^;\\n]+`, 'g');
      const matches = content.match(pattern) || [];
      matches.forEach(m => terms.add(m));
    }
    
    // Extract identifiers (capitalized words, camelCase)
    const identifiers = content.match(/[A-Z][a-zA-Z0-9]*|\b[a-z]+[A-Z][a-zA-Z0-9]*/g) || [];
    identifiers.slice(0, 50).forEach(i => terms.add(i));
    
    return Array.from(terms).join('\n');
  }
  
  /**
   * Truncate content to target tokens
   * @private
   */
  _truncate(content, targetTokens) {
    const targetChars = targetTokens * 4;
    
    if (content.length <= targetChars) {
      return content;
    }
    
    // Try to break at a reasonable point
    let breakPoint = targetChars;
    
    // Look for nearby newline
    const newlineSearch = content.substring(targetChars - 100, targetChars + 100);
    const newlineMatch = newlineSearch.lastIndexOf('\n');
    
    if (newlineMatch > 0) {
      breakPoint = targetChars - 100 + newlineMatch;
    }
    
    return content.substring(0, breakPoint) + '\n... [truncated]';
  }
  
  /**
   * Estimate tokens
   * @private
   */
  _estimateTokens(content) {
    return Math.ceil(content.length / 4);
  }
  
  /**
   * Get cache key
   * @private
   */
  _getCacheKey(context, level, targetTokens) {
    const str = typeof context === 'string' ? context : JSON.stringify(context);
    const hash = this._hashString(str + level + targetTokens);
    return `compress:${hash}`;
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
   * Get compression statistics
   * @returns {object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size,
      averageRatio: Math.round(this.stats.averageRatio * 100)
    };
  }
  
  /**
   * Get average compression ratio
   * @returns {number} Average ratio
   */
  getAverageRatio() {
    return this.stats.averageRatio;
  }
  
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = { ContextCompressor, COMPRESSION_LEVELS };
