/**
 * GSI Enhancement Metrics
 * 
 * Tracks how much features enhance each other.
 * Stores metrics in .planning/enhancement-metrics.json
 */

const fs = require('fs');
const path = require('path');

// Metrics file path
const METRICS_FILE = '.planning/enhancement-metrics.json';

// Default metrics structure
const DEFAULT_METRICS = {
  version: '1.0',
  createdAt: null,
  updatedAt: null,
  summary: {
    totalEnhancements: 0,
    totalTokenSavings: 0,
    averageEnhancementRate: 0
  },
  features: {
    thinking: {
      enhancedByPatterns: { count: 0, accuracy: 0, examples: [] },
      enhancedByComplexity: { count: 0, quality: 0, examples: [] },
      enhancedByReflection: { count: 0, insights: 0, examples: [] }
    },
    patterns: {
      enhancedByThinking: { count: 0, quality: 0, examples: [] },
      enhancedByReflection: { count: 0, accuracy: 0, examples: [] }
    },
    mcp: {
      coordinationEfficiency: { tokenSavings: 0, operations: 0, fallbacks: 0 },
      serverHealth: {},
      toolChainOptimizations: { count: 0, savings: 0 }
    },
    crossFeature: {
      callSuccessRate: { total: 0, successful: 0, rate: 0 },
      enhancementChains: { count: 0, averageLength: 0 }
    }
  },
  history: []
};

/**
 * Load metrics from file
 * @returns {Object} Metrics object
 */
function loadMetrics() {
  try {
    const filePath = path.join(process.cwd(), METRICS_FILE);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    // File read failed, use defaults
  }
  
  return { ...DEFAULT_METRICS, createdAt: new Date().toISOString() };
}

/**
 * Save metrics to file
 * @param {Object} metrics Metrics to save
 */
function saveMetrics(metrics) {
  try {
    const filePath = path.join(process.cwd(), METRICS_FILE);
    const dir = path.dirname(filePath);
    
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    metrics.updatedAt = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(metrics, null, 2));
  } catch (e) {
    // Save failed, log but don't throw
    console.error('Failed to save enhancement metrics:', e.message);
  }
}

/**
 * Record thinking enhanced by patterns
 * @param {Object} details Enhancement details
 */
function recordThinkingPatternEnhancement(details) {
  const metrics = loadMetrics();
  
  metrics.features.thinking.enhancedByPatterns.count++;
  
  // Update accuracy if provided
  if (details.accuracy !== undefined) {
    const current = metrics.features.thinking.enhancedByPatterns.accuracy;
    const count = metrics.features.thinking.enhancedByPatterns.count;
    metrics.features.thinking.enhancedByPatterns.accuracy = 
      (current * (count - 1) + details.accuracy) / count;
  }
  
  // Store example (limit to 10)
  if (details.example) {
    metrics.features.thinking.enhancedByPatterns.examples.push({
      timestamp: new Date().toISOString(),
      ...details.example
    });
    if (metrics.features.thinking.enhancedByPatterns.examples.length > 10) {
      metrics.features.thinking.enhancedByPatterns.examples.shift();
    }
  }
  
  metrics.summary.totalEnhancements++;
  saveMetrics(metrics);
}

/**
 * Record pattern learning enhanced by thinking
 * @param {Object} details Enhancement details
 */
function recordPatternThinkingEnhancement(details) {
  const metrics = loadMetrics();
  
  metrics.features.patterns.enhancedByThinking.count++;
  
  // Update quality if provided
  if (details.quality !== undefined) {
    const current = metrics.features.patterns.enhancedByThinking.quality;
    const count = metrics.features.patterns.enhancedByThinking.count;
    metrics.features.patterns.enhancedByThinking.quality = 
      (current * (count - 1) + details.quality) / count;
  }
  
  // Store example (limit to 10)
  if (details.example) {
    metrics.features.patterns.enhancedByThinking.examples.push({
      timestamp: new Date().toISOString(),
      ...details.example
    });
    if (metrics.features.patterns.enhancedByThinking.examples.length > 10) {
      metrics.features.patterns.enhancedByThinking.examples.shift();
    }
  }
  
  metrics.summary.totalEnhancements++;
  saveMetrics(metrics);
}

/**
 * Record MCP coordination efficiency
 * @param {number} tokenSavings Tokens saved
 * @param {string} operation Operation type
 * @param {boolean} usedFallback Whether fallback was used
 */
function recordMCPCoordination(tokenSavings, operation, usedFallback = false) {
  const metrics = loadMetrics();
  
  metrics.features.mcp.coordinationEfficiency.tokenSavings += tokenSavings;
  metrics.features.mcp.coordinationEfficiency.operations++;
  
  if (usedFallback) {
    metrics.features.mcp.coordinationEfficiency.fallbacks++;
  }
  
  // Update summary
  metrics.summary.totalTokenSavings += tokenSavings;
  
  saveMetrics(metrics);
}

/**
 * Record server health status
 * @param {string} server Server name
 * @param {boolean} healthy Health status
 */
function recordServerHealth(server, healthy) {
  const metrics = loadMetrics();
  
  if (!metrics.features.mcp.serverHealth[server]) {
    metrics.features.mcp.serverHealth[server] = {
      checks: 0,
      healthy: 0,
      unhealthy: 0,
      lastCheck: null,
      lastStatus: null
    };
  }
  
  metrics.features.mcp.serverHealth[server].checks++;
  metrics.features.mcp.serverHealth[server].lastCheck = new Date().toISOString();
  metrics.features.mcp.serverHealth[server].lastStatus = healthy ? 'healthy' : 'unhealthy';
  
  if (healthy) {
    metrics.features.mcp.serverHealth[server].healthy++;
  } else {
    metrics.features.mcp.serverHealth[server].unhealthy++;
  }
  
  saveMetrics(metrics);
}

/**
 * Record cross-feature call
 * @param {string} fromFeature Source feature
 * @param {string} toFeature Target feature
 * @param {boolean} success Call success
 */
function recordCrossFeatureCall(fromFeature, toFeature, success) {
  const metrics = loadMetrics();
  
  metrics.features.crossFeature.callSuccessRate.total++;
  if (success) {
    metrics.features.crossFeature.callSuccessRate.successful++;
  }
  
  metrics.features.crossFeature.callSuccessRate.rate = 
    metrics.features.crossFeature.callSuccessRate.successful / 
    metrics.features.crossFeature.callSuccessRate.total;
  
  metrics.summary.totalEnhancements++;
  
  saveMetrics(metrics);
}

/**
 * Record enhancement chain
 * @param {Array} chain Array of enhancement steps
 */
function recordEnhancementChain(chain) {
  const metrics = loadMetrics();
  
  metrics.features.crossFeature.enhancementChains.count++;
  
  // Update average length
  const current = metrics.features.crossFeature.enhancementChains.averageLength;
  const count = metrics.features.crossFeature.enhancementChains.count;
  metrics.features.crossFeature.enhancementChains.averageLength = 
    (current * (count - 1) + chain.length) / count;
  
  // Add to history (limit to 50)
  metrics.history.push({
    timestamp: new Date().toISOString(),
    chain,
    length: chain.length
  });
  
  if (metrics.history.length > 50) {
    metrics.history.shift();
  }
  
  saveMetrics(metrics);
}

/**
 * Get enhancement metrics
 * @returns {Object} Metrics object
 */
function getEnhancementMetrics() {
  const metrics = loadMetrics();
  
  // Calculate summary rates
  const total = metrics.features.crossFeature.callSuccessRate.total;
  const successful = metrics.features.crossFeature.callSuccessRate.successful;
  
  if (total > 0) {
    metrics.features.crossFeature.callSuccessRate.rate = successful / total;
  }
  
  // Calculate average enhancement rate
  if (metrics.features.mcp.coordinationEfficiency.operations > 0) {
    metrics.summary.averageEnhancementRate = 
      metrics.features.mcp.coordinationEfficiency.tokenSavings / 
      metrics.features.mcp.coordinationEfficiency.operations;
  }
  
  return metrics;
}

/**
 * Get metrics summary for progress command
 * @returns {Object} Summary object
 */
function getMetricsSummary() {
  const metrics = loadMetrics();
  
  return {
    totalEnhancements: metrics.summary.totalEnhancements,
    totalTokenSavings: metrics.summary.totalTokenSavings,
    averageEnhancementRate: Math.round(metrics.summary.averageEnhancementRate),
    crossFeatureCalls: {
      total: metrics.features.crossFeature.callSuccessRate.total,
      successRate: Math.round(metrics.features.crossFeature.callSuccessRate.rate * 100) + '%'
    },
    mcpCoordination: {
      operations: metrics.features.mcp.coordinationEfficiency.operations,
      tokenSavings: metrics.features.mcp.coordinationEfficiency.tokenSavings,
      fallbackRate: metrics.features.mcp.coordinationEfficiency.operations > 0 ?
        Math.round(metrics.features.mcp.coordinationEfficiency.fallbacks / 
                   metrics.features.mcp.coordinationEfficiency.operations * 100) + '%' : '0%'
    },
    thinkingEnhancements: {
      byPatterns: metrics.features.thinking.enhancedByPatterns.count,
      byComplexity: metrics.features.thinking.enhancedByComplexity.count
    },
    patternEnhancements: {
      byThinking: metrics.features.patterns.enhancedByThinking.count
    },
    enhancementChains: metrics.features.crossFeature.enhancementChains.count
  };
}

/**
 * Reset metrics
 */
function resetMetrics() {
  const metrics = { ...DEFAULT_METRICS, createdAt: new Date().toISOString() };
  saveMetrics(metrics);
}

module.exports = {
  loadMetrics,
  saveMetrics,
  recordThinkingPatternEnhancement,
  recordPatternThinkingEnhancement,
  recordMCPCoordination,
  recordServerHealth,
  recordCrossFeatureCall,
  recordEnhancementChain,
  getEnhancementMetrics,
  getMetricsSummary,
  resetMetrics
};
