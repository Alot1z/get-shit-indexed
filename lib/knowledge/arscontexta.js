/**
 * @fileoverview Arscontexta context management integration
 * Provides priority-based context window management
 * Part of Phase 50C: Knowledge System Integration
 * 
 * Inspired by context management patterns for AI systems
 * Implements token-aware context with priority eviction
 */

const { countTokens, compressContext: optimizeCompress } = require('../context-optimization');

/**
 * Analyze arscontexta architecture approach
 * @returns {Promise<object>} Architecture analysis
 */
async function analyzeArscontexta() {
  return {
    approach: 'priority-based-context',
    description: 'Priority-based context window management with token limits',
    features: [
      'context-lifecycle',
      'token-management',
      'priority-queue',
      'lru-eviction',
      'compression-support'
    ],
    version: '1.0.0',
    analyzed: new Date().toISOString()
  };
}

/**
 * Create a context manager
 * @param {object} options - Manager options
 * @returns {object} Context manager instance
 */
function createContextManager(options = {}) {
  const {
    maxTokens = 8000,
    compressionThreshold = 0.8,
    onEvict = null
  } = options;

  let context = new Map();
  let metadata = new Map();
  let currentTokens = 0;

  /**
   * Estimate token count for content
   * @param {*} content - Content to estimate
   * @returns {number} Estimated tokens
   */
  function estimateTokens(content) {
    if (typeof content === 'string') {
      return Math.ceil(content.length / 4);
    }
    return Math.ceil(JSON.stringify(content).length / 4);
  }

  /**
   * Add context item
   * @param {string} key - Context key
   * @param {*} value - Context value
   * @param {object} opts - Options (priority, etc.)
   */
  function addContext(key, value, opts = {}) {
    const { priority = 5, critical = false } = opts;
    const tokens = estimateTokens(value);

    // Check if adding would exceed limit
    if (currentTokens + tokens > maxTokens) {
      evictToFit(tokens);
    }

    // Remove old value if exists
    if (context.has(key)) {
      currentTokens -= estimateTokens(context.get(key));
    }

    context.set(key, value);
    metadata.set(key, {
      priority,
      critical,
      tokens,
      added: Date.now(),
      accessed: Date.now()
    });
    currentTokens += tokens;
  }

  /**
   * Evict low-priority items to fit new content
   * @param {number} neededTokens - Tokens needed
   */
  function evictToFit(neededTokens) {
    // Get items sorted by priority (lowest first), then by access time (oldest first)
    const items = Array.from(context.keys())
      .map(key => ({
        key,
        priority: metadata.get(key)?.priority || 5,
        critical: metadata.get(key)?.critical || false,
        accessed: metadata.get(key)?.accessed || 0
      }))
      .filter(item => !item.critical)
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.accessed - b.accessed;
      });

    let freed = 0;
    for (const item of items) {
      if (currentTokens - freed + neededTokens <= maxTokens) break;

      const tokens = metadata.get(item.key)?.tokens || 0;
      freed += tokens;
      
      if (onEvict) {
        onEvict(item.key, context.get(item.key));
      }
      
      context.delete(item.key);
      metadata.delete(item.key);
    }

    currentTokens -= freed;
  }

  /**
   * Get context value
   * @param {string} key - Context key
   * @returns {*} Context value
   */
  function getContext(key) {
    if (context.has(key)) {
      const meta = metadata.get(key);
      if (meta) {
        meta.accessed = Date.now();
      }
    }
    return context.get(key);
  }

  /**
   * Check if context has key
   * @param {string} key - Context key
   * @returns {boolean} True if exists
   */
  function hasContext(key) {
    return context.has(key);
  }

  /**
   * Clear all context
   */
  function clearContext() {
    context.clear();
    metadata.clear();
    currentTokens = 0;
  }

  /**
   * Get current token count
   * @returns {number} Token count
   */
  function getTokenCount() {
    return currentTokens;
  }

  /**
   * Get max tokens
   * @returns {number} Max tokens
   */
  function getMaxTokens() {
    return maxTokens;
  }

  /**
   * Get prioritized context list
   * @returns {Array} Prioritized items
   */
  function getPrioritizedContext() {
    return Array.from(context.keys())
      .map(key => ({
        key,
        value: context.get(key),
        ...metadata.get(key)
      }))
      .sort((a, b) => b.priority - a.priority);
  }

  return {
    addContext,
    getContext,
    hasContext,
    clearContext,
    getTokenCount,
    getMaxTokens,
    getPrioritizedContext
  };
}

/**
 * Create priority context from items
 * @param {Array} items - Context items
 * @param {object} options - Options
 * @returns {object} Priority context
 */
function createPriorityContext(items, options = {}) {
  const { maxTokens = 8000 } = options;

  // Sort by priority (highest first)
  const sorted = [...items].sort((a, b) => b.priority - a.priority);

  // Fit within token budget
  let totalTokens = 0;
  const fitted = [];

  for (const item of sorted) {
    const tokens = Math.ceil(JSON.stringify(item.content).length / 4);
    if (totalTokens + tokens <= maxTokens) {
      fitted.push({
        ...item,
        tokens
      });
      totalTokens += tokens;
    }
  }

  return {
    items: fitted,
    totalTokens,
    maxTokens,
    utilization: totalTokens / maxTokens
  };
}

/**
 * Manage context window to fit within limits
 * @param {object} context - Context object
 * @param {object} options - Options
 * @returns {object} Managed context
 */
function manageContextWindow(context, options = {}) {
  const { maxTokens = 1000, preserveCritical = true } = options;

  let totalTokens = 0;
  const items = [];

  for (const item of context.items || []) {
    const tokens = Math.ceil(JSON.stringify(item.content).length / 4);
    totalTokens += tokens;
    items.push({ ...item, tokens });
  }

  // If under budget, return as-is
  if (totalTokens <= maxTokens) {
    return { items, totalTokens, maxTokens };
  }

  // Sort by priority (highest first), critical items at top
  items.sort((a, b) => {
    if (a.critical && !b.critical) return -1;
    if (!a.critical && b.critical) return 1;
    return b.priority - a.priority;
  });

  // Fit within budget
  let fittedTokens = 0;
  const fitted = [];

  for (const item of items) {
    if (preserveCritical && item.critical) {
      fitted.push(item);
      fittedTokens += item.tokens;
    } else if (fittedTokens + item.tokens <= maxTokens) {
      fitted.push(item);
      fittedTokens += item.tokens;
    }
  }

  return {
    items: fitted,
    totalTokens: fittedTokens,
    maxTokens,
    evicted: items.length - fitted.length
  };
}

/**
 * Compress context using existing optimization
 * @param {object} context - Context to compress
 * @param {object} options - Options
 * @returns {Promise<object>} Compressed context
 */
async function compressContext(context, options = {}) {
  const { targetRatio = 0.5 } = options;

  const originalStr = JSON.stringify(context);
  const originalLength = originalStr.length;

  // Simple compression: summarize verbose content
  let compressed;
  if (context.items) {
    compressed = {
      items: context.items.map(item => ({
        ...item,
        content: summarizeText(item.content)
      }))
    };
  } else {
    compressed = {
      compressed: summarizeText(originalStr),
      originalStructure: Object.keys(context)
    };
  }

  const compressedStr = JSON.stringify(compressed);
  const compressedLength = compressedStr.length;

  return {
    compressed,
    originalLength,
    compressedLength,
    ratio: 1 - (compressedLength / originalLength)
  };
}

/**
 * Summarize text to reduce length
 * @param {string} text - Text to summarize
 * @returns {string} Summarized text
 */
function summarizeText(text) {
  if (!text || text.length < 100) return text;

  // Simple summarization: keep first and last parts
  const keepLength = Math.floor(text.length * 0.4);
  const start = text.substring(0, keepLength);
  const end = text.substring(text.length - keepLength);

  return `${start}...[compressed]...${end}`;
}

/**
 * Decompress context
 * @param {object} compressed - Compressed context
 * @returns {Promise<object>} Decompressed context
 */
async function decompressContext(compressed) {
  // Return as-is since we can't fully restore compressed content
  if (compressed.compressed) {
    return {
      items: [],
      _compressedNote: 'Content was compressed and cannot be fully restored'
    };
  }
  return compressed;
}

/**
 * Prioritize context items by multiple factors
 * @param {Array} items - Items to prioritize
 * @returns {Array} Prioritized items with scores
 */
function prioritizeContextItems(items) {
  if (!items || items.length === 0) return [];

  const now = Date.now();

  return items
    .map(item => {
      // Calculate composite score
      const priorityScore = (item.priority || 5) * 10;
      const recencyScore = Math.min(10, (item.recency || 0));
      const relevanceScore = (item.relevance || 0.5) * 10;

      const score = priorityScore * 0.5 + recencyScore * 0.3 + relevanceScore * 0.2;

      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Create LRU cache for context
 * @param {object} options - Cache options
 * @returns {object} Cache instance
 */
function createContextCache(options = {}) {
  const { maxSize = 100, ttl = null } = options;

  let cache = new Map();
  let hits = 0;
  let misses = 0;

  return {
    set(key, value) {
      // Evict oldest if full
      if (cache.size >= maxSize) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }

      cache.set(key, {
        value,
        added: Date.now(),
        expires: ttl ? Date.now() + ttl : null
      });
    },

    get(key) {
      if (!cache.has(key)) {
        misses++;
        return undefined;
      }

      const entry = cache.get(key);

      // Check expiration
      if (entry.expires && Date.now() > entry.expires) {
        cache.delete(key);
        misses++;
        return undefined;
      }

      // Move to end (most recently used)
      cache.delete(key);
      cache.set(key, entry);

      hits++;
      return entry.value;
    },

    has(key) {
      return cache.has(key);
    },

    delete(key) {
      return cache.delete(key);
    },

    clear() {
      cache.clear();
      hits = 0;
      misses = 0;
    },

    size() {
      return cache.size;
    },

    getStats() {
      const total = hits + misses;
      return {
        size: cache.size,
        maxSize,
        hits,
        misses,
        hitRate: total > 0 ? hits / total : 0
      };
    }
  };
}

/**
 * Validate context integrity
 * @param {object} context - Context to validate
 * @returns {object} Validation result
 */
function validateContextIntegrity(context) {
  const errors = [];

  if (!context || typeof context !== 'object') {
    errors.push('Context must be an object');
  }

  if (context.items && !Array.isArray(context.items)) {
    errors.push('items must be an array');
  }

  if (context.totalTokens && typeof context.totalTokens !== 'number') {
    errors.push('totalTokens must be a number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  analyzeArscontexta,
  createContextManager,
  createPriorityContext,
  manageContextWindow,
  compressContext,
  decompressContext,
  prioritizeContextItems,
  createContextCache,
  validateContextIntegrity
};
