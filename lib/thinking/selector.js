/**
 * Unified Thinking Mode Selector API
 * 
 * Provides a unified interface for thinking mode selection and prompt generation.
 * Integrates categories, server mapping, mode selection, and prompt templates.
 * Uses feature registry and MCP coordinator for context-aware selection.
 */

const { selectMode, determineModeVariation, configure, resetConfiguration, getConfiguration } = require('./mode-selector');
const { getToolCategory, getAllCategories } = require('./categories');
const { getServer, getAllServers } = require('./server-mapping');

// Feature registry integration (lazy load to avoid circular deps)
let featureRegistry = null;
let mcpCoordinator = null;

function loadFeatureRegistry() {
  if (!featureRegistry) {
    try {
      featureRegistry = require('../enhancement/feature-registry');
    } catch (e) {
      // Feature registry not available
    }
  }
  return featureRegistry;
}

function loadMCPCoordinator() {
  if (!mcpCoordinator) {
    try {
      mcpCoordinator = require('../enhancement/mcp-coordinator');
    } catch (e) {
      // MCP coordinator not available
    }
  }
  return mcpCoordinator;
}

// Prompt templates
const sequentialPrompts = require('./prompts/sequential');
const tractatusPrompts = require('./prompts/tractatus');
const debugPrompts = require('./prompts/debug');

// Cache for repeated operations
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

// Metrics logging
const metrics = {
  hits: 0,
  misses: 0,
  selects: 0,
  errors: 0
};

/**
 * Get cache key for operation
 * @param {string} toolName - Tool name
 * @param {object} context - Operation context
 * @returns {string} Cache key
 */
function getCacheKey(toolName, context) {
  const contextStr = JSON.stringify(context);
  return `${toolName}:${contextStr}`;
}

/**
 * Get from cache
 * @param {string} key - Cache key
 * @returns {object|null} Cached value or null
 */
function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) {
    metrics.misses++;
    return null;
  }
  
  // Check if expired
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    metrics.misses++;
    return null;
  }
  
  metrics.hits++;
  return entry.value;
}

/**
 * Set cache
 * @param {string} key - Cache key
 * @param {object} value - Value to cache
 */
function setCache(key, value) {
  cache.set(key, {
    value,
    timestamp: Date.now()
  });
}

/**
 * Clear cache
 */
function clearCache() {
  cache.clear();
}

/**
 * Select thinking mode for a tool operation
 * @param {string} toolName - Tool name
 * @param {object} context - Operation context
 * @param {boolean} useCache - Whether to use cache
 * @returns {object} Mode configuration with prompt
 */
function selectThinkingMode(toolName, context = {}, useCache = true) {
  metrics.selects++;
  
  // Enhance context with feature registry and MCP coordinator data
  const enhancedContext = enhanceContext(toolName, context);
  
  // Check cache
  if (useCache) {
    const cacheKey = getCacheKey(toolName, enhancedContext);
    const cached = getFromCache(cacheKey);
    if (cached) {
      return cached;
    }
  }
  
  try {
    // Select mode
    const modeConfig = selectMode(toolName, enhancedContext);
    
    if (!modeConfig.enabled) {
      return modeConfig;
    }
    
    // Generate prompt
    const prompt = generatePrompt(toolName, modeConfig, enhancedContext);
    
    // Combine mode config with prompt
    const result = {
      ...modeConfig,
      prompt,
      contextEnhanced: enhancedContext._enhanced || false
    };
    
    // Cache result
    if (useCache) {
      const cacheKey = getCacheKey(toolName, enhancedContext);
      setCache(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    metrics.errors++;
    return {
      enabled: false,
      reason: `Error selecting mode: ${error.message}`
    };
  }
}

/**
 * Enhance context with feature registry and MCP coordinator data
 * @param {string} toolName - Tool name
 * @param {object} context - Original context
 * @returns {object} Enhanced context
 */
function enhanceContext(toolName, context) {
  const enhanced = { ...context, _enhanced: false };
  
  // Get enhancement opportunities from feature registry
  const registry = loadFeatureRegistry();
  if (registry) {
    try {
      const opportunities = registry.getEnhancementOpportunities(toolName, context);
      if (opportunities && opportunities.length > 0) {
        enhanced.enhancementOpportunities = opportunities;
        enhanced._enhanced = true;
      }
    } catch (e) {
      // Registry query failed, continue without
    }
  }
  
  // Get MCP server health from coordinator
  const coordinator = loadMCPCoordinator();
  if (coordinator) {
    try {
      const availableServers = coordinator.getAvailableServers();
      enhanced.availableServers = availableServers;
      
      // Check if preferred server is available
      if (enhanced.preferredServer && !coordinator.checkServerHealth(enhanced.preferredServer)) {
        enhanced.serverFallback = coordinator.getFallbackServer(enhanced.preferredServer);
        enhanced._enhanced = true;
      }
    } catch (e) {
      // Coordinator query failed, continue without
    }
  }
  
  return enhanced;
}

/**
 * Generate prompt for a thinking mode
 * @param {string} toolName - Tool name
 * @param {object} modeConfig - Mode configuration
 * @param {object} context - Operation context
 * @returns {string} Generated prompt
 */
function generatePrompt(toolName, modeConfig, context) {
  const { server, category } = modeConfig;
  
  // Select prompt template based on server
  let templateFn;
  let templateType;
  
  // Determine template type based on category and context
  if (category === 'FILE_OPS') {
    templateType = context.operation || 'file';
  } else if (category === 'PROCESS_OPS') {
    templateType = 'process';
  } else if (category === 'CODE_OPS') {
    templateType = 'code';
  } else if (category === 'GRAPH_OPS') {
    templateType = 'graph';
  } else if (category === 'DEBUG_OPS') {
    templateType = context.isError ? 'error' : 'debug';
  } else if (category === 'COMPLEX_OPS') {
    templateType = 'complex';
  } else {
    templateType = 'generic';
  }
  
  // Select template function
  if (server === 'sequential') {
    templateFn = sequentialPrompts[`${templateType}Prompt`] || sequentialPrompts.genericPrompt;
  } else if (server === 'tractatus') {
    templateFn = tractatusPrompts[`${templateType}Prompt`] || tractatusPrompts.genericPrompt;
  } else if (server === 'debug') {
    templateFn = debugPrompts[`${templateType}Prompt`] || debugPrompts.genericPrompt;
  } else {
    // Combined or unknown - use generic tractatus
    templateFn = tractatusPrompts.genericPrompt;
  }
  
  // Generate prompt with context
  return templateFn({
    toolName,
    category,
    ...context
  });
}

/**
 * Get thinking server for a tool
 * @param {string} toolName - Tool name
 * @returns {object|null} Server object or null
 */
function getThinkingServer(toolName) {
  const category = getToolCategory(toolName);
  if (!category) {
    return null;
  }
  
  return getServer(category.name);
}

/**
 * Get prompt template for a tool
 * @param {string} toolName - Tool name
 * @param {object} context - Operation context
 * @returns {string|null} Prompt or null
 */
function getPromptTemplate(toolName, context = {}) {
  const modeConfig = selectMode(toolName, context);
  if (!modeConfig.enabled) {
    return null;
  }
  
  return generatePrompt(toolName, modeConfig, context);
}

/**
 * Get timeout for a tool
 * @param {string} toolName - Tool name
 * @param {object} context - Operation context
 * @returns {number} Timeout in milliseconds
 */
function getTimeout(toolName, context = {}) {
  const modeConfig = selectMode(toolName, context);
  if (!modeConfig.enabled) {
    return 5000; // Default timeout
  }
  
  return modeConfig.timeout;
}

/**
 * Get metrics
 * @returns {object} Metrics object
 */
function getMetrics() {
  return {
    ...metrics,
    cacheSize: cache.size,
    hitRate: metrics.hits / (metrics.hits + metrics.misses) || 0,
    errorRate: metrics.errors / metrics.selects || 0
  };
}

/**
 * Reset metrics
 */
function resetMetrics() {
  metrics.hits = 0;
  metrics.misses = 0;
  metrics.selects = 0;
  metrics.errors = 0;
}

module.exports = {
  // Core functions
  selectThinkingMode,
  generatePrompt,
  getThinkingServer,
  getPromptTemplate,
  getTimeout,
  
  // Cache management
  clearCache,
  
  // Metrics
  getMetrics,
  resetMetrics,
  
  // Configuration
  configure,
  resetConfiguration,
  getConfiguration,
  
  // Category info
  getAllCategories,
  getAllServers
};
