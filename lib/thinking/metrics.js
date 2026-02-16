/**
 * Thinking Metrics and Logging
 * 
 * Tracks metrics for thinking operations and stores to JSON file.
 * Provides insight into thinking server usage and performance.
 * Uses context-aware path resolution for global vs project-level installation.
 */

const fs = require('fs');
const path = require('path');
const { getMetricsPath, getPlanningPath } = require('../context/path-resolver');

/**
 * Get the metrics file path (context-aware)
 * @returns {string} Absolute path to metrics file
 */
function getMetricsFilePath() {
  return getMetricsPath('thinking');
}

// In-memory metrics
const sessionMetrics = {
  calls: {
    beforeTool: 0,
    afterTool: 0,
    bmadChecks: 0,
    total: 0
  },
  duration: {
    sequential: 0,
    tractatus: 0,
    debug: 0,
    combined: 0,
    total: 0
  },
  servers: {
    sequential: 0,
    tractatus: 0,
    debug: 0,
    combined: 0
  },
  cache: {
    hits: 0,
    misses: 0,
    hitRate: 0
  },
  bmad: {
    totalScore: 0,
    checkCount: 0,
    averageScore: 0
  },
  errors: {
    count: 0,
    degraded: 0,
    errorRate: 0
  },
  byTool: {},
  byOperation: {},
  startTime: new Date().toISOString()
};

/**
 * Log thinking operation
 * @param {string} toolName - Tool name
 * @param {number} duration - Duration in milliseconds
 * @param {object} result - Thinking result
 */
function logThinking(toolName, duration, result) {
  sessionMetrics.calls.total++;
  
  // Track by server type
  if (result.server) {
    sessionMetrics.servers[result.server] = (sessionMetrics.servers[result.server] || 0) + 1;
    sessionMetrics.duration[result.server] = (sessionMetrics.duration[result.server] || 0) + duration;
  }
  
  sessionMetrics.duration.total += duration;
  
  // Track by tool
  if (!sessionMetrics.byTool[toolName]) {
    sessionMetrics.byTool[toolName] = {
      calls: 0,
      duration: 0,
      servers: {}
    };
  }
  sessionMetrics.byTool[toolName].calls++;
  sessionMetrics.byTool[toolName].duration += duration;
  
  if (result.server) {
    sessionMetrics.byTool[toolName].servers[result.server] = 
      (sessionMetrics.byTool[toolName].servers[result.server] || 0) + 1;
  }
  
  // Track errors and degraded calls
  if (!result.success) {
    sessionMetrics.errors.count++;
  }
  if (result.degraded) {
    sessionMetrics.errors.degraded++;
  }
  
  // Save to file
  saveMetrics();
}

/**
 * Log cache hit/miss
 * @param {boolean} hit - True if cache hit
 */
function logCacheAccess(hit) {
  if (hit) {
    sessionMetrics.cache.hits++;
  } else {
    sessionMetrics.cache.misses++;
  }
  
  const total = sessionMetrics.cache.hits + sessionMetrics.cache.misses;
  sessionMetrics.cache.hitRate = total > 0 ? sessionMetrics.cache.hits / total : 0;
}

/**
 * Log BMAD check
 * @param {string} toolName - Tool name
 * @param {object} bmadResult - BMAD check result
 */
function logBMADCheck(toolName, bmadResult) {
  sessionMetrics.calls.bmadChecks++;
  sessionMetrics.bmad.checkCount++;
  sessionMetrics.bmad.totalScore += bmadResult.totalScore;
  sessionMetrics.bmad.averageScore = sessionMetrics.bmad.totalScore / sessionMetrics.bmad.checkCount;
  
  // Track by operation
  if (!sessionMetrics.byOperation[toolName]) {
    sessionMetrics.byOperation[toolName] = {
      bmadChecks: 0,
      averageScore: 0
    };
  }
  sessionMetrics.byOperation[toolName].bmadChecks++;
  sessionMetrics.byOperation[toolName].averageScore = 
    ((sessionMetrics.byOperation[toolName].averageScore * (sessionMetrics.byOperation[toolName].bmadChecks - 1)) + 
     bmadResult.percentage) / sessionMetrics.byOperation[toolName].bmadChecks;
}

/**
 * Log before tool thinking
 * @param {string} toolName - Tool name
 * @param {number} duration - Duration in milliseconds
 * @param {object} context - Thinking context
 */
function logBeforeTool(toolName, duration, context) {
  sessionMetrics.calls.beforeTool++;
  logThinking(toolName, duration, context);
}

/**
 * Log after tool thinking
 * @param {string} toolName - Tool name
 * @param {number} duration - Duration in milliseconds
 * @param {object} context - Thinking context
 */
function logAfterTool(toolName, duration, context) {
  sessionMetrics.calls.afterTool++;
  logThinking(toolName, duration, context);
}

/**
 * Get metrics
 * @returns {object} Metrics object
 */
function getMetrics() {
  // Calculate derived metrics
  const totalCalls = sessionMetrics.calls.total;
  const totalDuration = sessionMetrics.duration.total;
  
  return {
    ...sessionMetrics,
    derived: {
      averageDuration: totalCalls > 0 ? totalDuration / totalCalls : 0,
      serverDistribution: sessionMetrics.servers,
      errorRate: totalCalls > 0 ? sessionMetrics.errors.count / totalCalls : 0,
      degradedRate: totalCalls > 0 ? sessionMetrics.errors.degraded / totalCalls : 0
    },
    sessionDuration: Date.now() - new Date(sessionMetrics.startTime).getTime()
  };
}

/**
 * Reset metrics
 */
function resetMetrics() {
  sessionMetrics.calls = {
    beforeTool: 0,
    afterTool: 0,
    bmadChecks: 0,
    total: 0
  };
  sessionMetrics.duration = {
    sequential: 0,
    tractatus: 0,
    debug: 0,
    combined: 0,
    total: 0
  };
  sessionMetrics.servers = {
    sequential: 0,
    tractatus: 0,
    debug: 0,
    combined: 0
  };
  sessionMetrics.cache = {
    hits: 0,
    misses: 0,
    hitRate: 0
  };
  sessionMetrics.bmad = {
    totalScore: 0,
    checkCount: 0,
    averageScore: 0
  };
  sessionMetrics.errors = {
    count: 0,
    degraded: 0,
    errorRate: 0
  };
  sessionMetrics.byTool = {};
  sessionMetrics.byOperation = {};
  sessionMetrics.startTime = new Date().toISOString();
}

/**
 * Save metrics to file (context-aware path)
 */
function saveMetrics() {
  try {
    const metrics = getMetrics();
    const metricsFile = getMetricsFilePath();
    
    // Ensure directory exists
    const dir = path.dirname(metricsFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write to file
    fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving thinking metrics:', error.message);
  }
}

/**
 * Load metrics from file
 * @returns {object|null} Metrics object or null
 */
function loadMetrics() {
  try {
    const metricsFile = getMetricsFilePath();
    if (fs.existsSync(metricsFile)) {
      const data = fs.readFileSync(metricsFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading thinking metrics:', error.message);
  }
  return null;
}

/**
 * Format metrics for display
 * @param {object} metrics - Metrics object
 * @returns {string} Formatted metrics
 */
function formatMetrics(metrics = null) {
  const m = metrics || getMetrics();
  
  let output = 'Thinking Metrics:\n';
  output += '================\n\n';
  
  output += `Calls:\n`;
  output += `  Total: ${m.calls.total}\n`;
  output += `  Before Tool: ${m.calls.beforeTool}\n`;
  output += `  After Tool: ${m.calls.afterTool}\n`;
  output += `  BMAD Checks: ${m.calls.bmadChecks}\n\n`;
  
  output += `Duration:\n`;
  output += `  Total: ${m.duration.total}ms\n`;
  output += `  Average: ${m.derived.averageDuration.toFixed(2)}ms\n`;
  output += `  Sequential: ${m.duration.sequential}ms\n`;
  output += `  Tractatus: ${m.duration.tractatus}ms\n`;
  output += `  Debug: ${m.duration.debug}ms\n`;
  output += `  Combined: ${m.duration.combined}ms\n\n`;
  
  output += `Server Distribution:\n`;
  for (const [server, count] of Object.entries(m.servers)) {
    const pct = m.calls.total > 0 ? ((count / m.calls.total) * 100).toFixed(1) : 0;
    output += `  ${server}: ${count} (${pct}%)\n`;
  }
  output += '\n';
  
  output += `Cache:\n`;
  output += `  Hit Rate: ${(m.cache.hitRate * 100).toFixed(1)}%\n`;
  output += `  Hits: ${m.cache.hits}\n`;
  output += `  Misses: ${m.cache.misses}\n\n`;
  
  output += `BMAD:\n`;
  output += `  Checks: ${m.bmad.checkCount}\n`;
  output += `  Average Score: ${m.bmad.averageScore.toFixed(2)}/7\n\n`;
  
  output += `Errors:\n`;
  output += `  Count: ${m.errors.count}\n`;
  output += `  Degraded: ${m.errors.degraded}\n`;
  output += `  Error Rate: ${(m.derived.errorRate * 100).toFixed(1)}%\n\n`;
  
  output += `Session Duration: ${(m.sessionDuration / 1000).toFixed(1)}s\n`;
  output += `Started: ${m.startTime}\n`;
  
  return output;
}

module.exports = {
  logThinking,
  logCacheAccess,
  logBMADCheck,
  logBeforeTool,
  logAfterTool,
  getMetrics,
  resetMetrics,
  saveMetrics,
  loadMetrics,
  formatMetrics,
  getMetricsFilePath
};
