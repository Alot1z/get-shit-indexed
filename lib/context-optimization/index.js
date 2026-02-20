/**
 * Context Optimization Layer - Main Entry Point
 * 
 * Provides intelligent context window management including:
 * - Token counting and tracking
 * - Hierarchical summarization (telescope method)
 * - Context caching and compression
 * - Vector offloading for large contexts
 * 
 * @module context-optimization
 */

const { TokenCounter } = require('./token-counter');
const { ContextCache } = require('./context-cache');
const { HierarchicalSummarizer } = require('./hierarchical-summarizer');
const { ContextCompressor } = require('./context-compressor');
const { VectorOffloader } = require('./vector-offloader');
const { ContextPrioritizer } = require('./context-prioritizer');

// Singleton instances
let tokenCounter = null;
let contextCache = null;
let hierarchicalSummarizer = null;
let contextCompressor = null;
let vectorOffloader = null;
let contextPrioritizer = null;

/**
 * Initialize context optimization system
 * @param {object} config - Configuration options
 */
function initialize(config = {}) {
  tokenCounter = new TokenCounter(config.token);
  contextCache = new ContextCache(config.cache);
  hierarchicalSummarizer = new HierarchicalSummarizer(config.summarizer);
  contextCompressor = new ContextCompressor(config.compressor);
  vectorOffloader = new VectorOffloader(config.vector);
  contextPrioritizer = new ContextPrioritizer(config.prioritizer);
  
  return {
    tokenCounter,
    contextCache,
    hierarchicalSummarizer,
    contextCompressor,
    vectorOffloader,
    contextPrioritizer
  };
}

/**
 * Count tokens in content
 * @param {string|object} content - Content to count
 * @returns {number} Token count
 */
function countTokens(content) {
  if (!tokenCounter) initialize();
  return tokenCounter.count(content);
}

/**
 * Cache context for reuse
 * @param {string} key - Cache key
 * @param {*} value - Value to cache
 * @param {object} options - Cache options
 */
function cacheContext(key, value, options = {}) {
  if (!contextCache) initialize();
  return contextCache.set(key, value, options);
}

/**
 * Get cached context
 * @param {string} key - Cache key
 * @returns {*} Cached value or undefined
 */
function getCachedContext(key) {
  if (!contextCache) initialize();
  return contextCache.get(key);
}

/**
 * Summarize context hierarchically (telescope method)
 * @param {object} context - Context to summarize
 * @param {object} options - Summarization options
 * @returns {Promise<object>} Summarized context with levels
 */
async function summarizeHierarchically(context, options = {}) {
  if (!hierarchicalSummarizer) initialize();
  return await hierarchicalSummarizer.summarize(context, options);
}

/**
 * Compress context to reduce token usage
 * @param {object} context - Context to compress
 * @param {object} options - Compression options
 * @returns {Promise<object>} Compressed context
 */
async function compressContext(context, options = {}) {
  if (!contextCompressor) initialize();
  return await contextCompressor.compress(context, options);
}

/**
 * Offload context to vector storage
 * @param {object} context - Context to offload
 * @param {object} options - Offload options
 * @returns {Promise<object>} Offload result with retrieval info
 */
async function offloadToVector(context, options = {}) {
  if (!vectorOffloader) initialize();
  return await vectorOffloader.offload(context, options);
}

/**
 * Retrieve context from vector storage
 * @param {string} query - Query for retrieval
 * @param {object} options - Retrieval options
 * @returns {Promise<array>} Retrieved context chunks
 */
async function retrieveFromVector(query, options = {}) {
  if (!vectorOffloader) initialize();
  return await vectorOffloader.retrieve(query, options);
}

/**
 * Prioritize context items
 * @param {array} items - Context items to prioritize
 * @param {object} criteria - Prioritization criteria
 * @returns {array} Prioritized items
 */
function prioritizeContext(items, criteria = {}) {
  if (!contextPrioritizer) initialize();
  return contextPrioritizer.prioritize(items, criteria);
}

/**
 * Optimize context for a given token budget
 * @param {object} context - Full context
 * @param {number} tokenBudget - Maximum tokens allowed
 * @param {object} options - Optimization options
 * @returns {Promise<object>} Optimized context
 */
async function optimizeContext(context, tokenBudget, options = {}) {
  if (!tokenCounter) initialize();
  
  const startTime = Date.now();
  
  // Step 1: Count current tokens
  const currentTokens = countTokens(context);
  
  // If under budget, return as-is
  if (currentTokens <= tokenBudget) {
    return {
      optimized: context,
      originalTokens: currentTokens,
      optimizedTokens: currentTokens,
      savings: 0,
      strategies: []
    };
  }
  
  // Step 2: Check cache for pre-optimized version
  const cacheKey = `optimized:${hashContext(context)}:${tokenBudget}`;
  const cached = getCachedContext(cacheKey);
  if (cached) {
    return {
      ...cached,
      fromCache: true
    };
  }
  
  // Step 3: Apply optimization strategies
  let optimized = { ...context };
  let optimizedTokens = currentTokens;
  const strategies = [];
  
  // Strategy 1: Prioritize high-value items
  if (Array.isArray(optimized.items) || Array.isArray(optimized.files)) {
    const items = optimized.items || optimized.files;
    const prioritized = prioritizeContext(items, {
      ...options.prioritization,
      tokenBudget: tokenBudget * 0.7
    });
    
    if (optimized.items) optimized.items = prioritized;
    if (optimized.files) optimized.files = prioritized;
    
    optimizedTokens = countTokens(optimized);
    strategies.push('prioritization');
  }
  
  // Strategy 2: Hierarchical summarization if still over budget
  if (optimizedTokens > tokenBudget) {
    const summaryResult = await summarizeHierarchically(optimized, {
      targetTokens: tokenBudget * 0.8,
      preserveKey: options.preserveKey || []
    });
    
    optimized = summaryResult.summarized;
    optimizedTokens = countTokens(optimized);
    strategies.push('summarization');
  }
  
  // Strategy 3: Compression if still over budget
  if (optimizedTokens > tokenBudget) {
    const compressResult = await compressContext(optimized, {
      targetTokens,
      level: 'aggressive'
    });
    
    optimized = compressResult.compressed;
    optimizedTokens = countTokens(optimized);
    strategies.push('compression');
  }
  
  // Strategy 4: Vector offload for remaining overflow
  if (optimizedTokens > tokenBudget && options.enableVectorOffload) {
    const offloadResult = await offloadToVector(optimized, {
      targetTokens: tokenBudget,
      preserveKey: ['instructions', 'task']
    });
    
    optimized = offloadResult.retained;
    optimized._vectorRef = offloadResult.reference;
    optimizedTokens = countTokens(optimized);
    strategies.push('vector-offload');
  }
  
  // Step 4: Cache result
  const result = {
    optimized,
    originalTokens: currentTokens,
    optimizedTokens,
    savings: currentTokens - optimizedTokens,
    savingsPercent: Math.round((1 - optimizedTokens / currentTokens) * 100),
    strategies,
    duration: Date.now() - startTime
  };
  
  cacheContext(cacheKey, result, { ttl: 300000 }); // 5 min cache
  
  return result;
}

/**
 * Get context statistics
 * @param {object} context - Context to analyze
 * @returns {object} Statistics
 */
function getContextStats(context) {
  if (!tokenCounter) initialize();
  
  return {
    totalTokens: countTokens(context),
    cacheStats: contextCache ? contextCache.getStats() : {},
    compressionRatio: contextCompressor ? contextCompressor.getAverageRatio() : 0,
    summarizerStats: hierarchicalSummarizer ? hierarchicalSummarizer.getStats() : {},
    vectorStats: vectorOffloader ? vectorOffloader.getStats() : {}
  };
}

/**
 * Get optimization system metrics
 * @returns {object} System metrics
 */
function getMetrics() {
  return {
    tokenCounter: tokenCounter ? tokenCounter.getMetrics() : {},
    cache: contextCache ? contextCache.getStats() : {},
    summarizer: hierarchicalSummarizer ? hierarchicalSummarizer.getStats() : {},
    compressor: contextCompressor ? contextCompressor.getStats() : {},
    vector: vectorOffloader ? vectorOffloader.getStats() : {},
    prioritizer: contextPrioritizer ? contextPrioritizer.getStats() : {}
  };
}

/**
 * Clear all caches
 */
function clearAllCaches() {
  if (contextCache) contextCache.clear();
  if (hierarchicalSummarizer) hierarchicalSummarizer.clearCache();
  if (contextCompressor) contextCompressor.clearCache();
  if (vectorOffloader) vectorOffloader.clearIndex();
}

/**
 * Hash context for caching
 * @private
 */
function hashContext(context) {
  const str = JSON.stringify(context);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

module.exports = {
  initialize,
  countTokens,
  cacheContext,
  getCachedContext,
  summarizeHierarchically,
  compressContext,
  offloadToVector,
  retrieveFromVector,
  prioritizeContext,
  optimizeContext,
  getContextStats,
  getMetrics,
  clearAllCaches,
  
  // Classes for direct use
  TokenCounter,
  ContextCache,
  HierarchicalSummarizer,
  ContextCompressor,
  VectorOffloader,
  ContextPrioritizer
};
