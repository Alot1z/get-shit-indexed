/**
 * Command Thinking Metrics
 * 
 * Tracks per-command thinking metrics.
 * Stores metrics in .planning/command-thinking-metrics.json
 */

const path = require('path');
const fs = require('fs');

const METRICS_FILE = path.join(__dirname, '../../.planning/command-thinking-metrics.json');

// In-memory metrics store
let metrics = {};

// Load metrics from file
function loadMetrics() {
  try {
    if (fs.existsSync(METRICS_FILE)) {
      const data = fs.readFileSync(METRICS_FILE, 'utf8');
      metrics = JSON.parse(data);
    }
  } catch (error) {
    console.warn(`Failed to load metrics from ${METRICS_FILE}:`, error.message);
    metrics = {};
  }
}

// Save metrics to file
function saveMetrics() {
  try {
    const dir = path.dirname(METRICS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.warn(`Failed to save metrics to ${METRICS_FILE}:`, error.message);
  }
}

// Initialize metrics on load
loadMetrics();

/**
 * Record thinking metrics for a command
 * @param {string} commandName - Command name
 * @param {object} commandMetrics - Metrics to record
 */
function recordCommandThinking(commandName, commandMetrics) {
  if (!metrics[commandName]) {
    metrics[commandName] = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      totalDuration: 0,
      avgDuration: 0,
      modeDistribution: {},
      cacheHits: 0,
      cacheMisses: 0,
      lastUsed: null,
      history: []
    };
  }
  
  const cmdMetrics = metrics[commandName];
  
  // Update counters
  cmdMetrics.totalCalls++;
  cmdMetrics.totalDuration += commandMetrics.duration || 0;
  cmdMetrics.lastUsed = new Date().toISOString();
  
  if (commandMetrics.success) {
    cmdMetrics.successfulCalls++;
  } else {
    cmdMetrics.failedCalls++;
  }
  
  // Update mode distribution
  if (commandMetrics.mode) {
    cmdMetrics.modeDistribution[commandMetrics.mode] = 
      (cmdMetrics.modeDistribution[commandMetrics.mode] || 0) + 1;
  }
  
  // Track cache hits/misses
  if (commandMetrics.preThinking) {
    if (commandMetrics.preThinking.cached) {
      cmdMetrics.cacheHits++;
    } else {
      cmdMetrics.cacheMisses++;
    }
  }
  
  // Calculate average duration
  cmdMetrics.avgDuration = Math.round(cmdMetrics.totalDuration / cmdMetrics.totalCalls);
  
  // Add to history (keep last 100)
  cmdMetrics.history.push({
    timestamp: new Date().toISOString(),
    ...commandMetrics
  });
  
  if (cmdMetrics.history.length > 100) {
    cmdMetrics.history = cmdMetrics.history.slice(-100);
  }
  
  // Save to file
  saveMetrics();
}

/**
 * Get metrics for a specific command
 * @param {string} commandName - Command name
 * @returns {object|null} Command metrics or null if not found
 */
function getCommandMetrics(commandName) {
  return metrics[commandName] || null;
}

/**
 * Get all metrics
 * @returns {object} All metrics
 */
function getAllMetrics() {
  return { ...metrics };
}

/**
 * Get top commands by usage
 * @param {number} limit - Number of top commands to return
 * @returns {Array} Array of { commandName, totalCalls }
 */
function getTopCommands(limit = 10) {
  return Object.entries(metrics)
    .map(([commandName, cmdMetrics]) => ({
      commandName,
      totalCalls: cmdMetrics.totalCalls,
      avgDuration: cmdMetrics.avgDuration
    }))
    .sort((a, b) => b.totalCalls - a.totalCalls)
    .slice(0, limit);
}

/**
 * Get thinking effectiveness for a command
 * @param {string} commandName - Command name
 * @returns {object} Effectiveness metrics
 */
function getThinkingEffectiveness(commandName) {
  const cmdMetrics = metrics[commandName];
  
  if (!cmdMetrics) {
    return null;
  }
  
  const successRate = cmdMetrics.totalCalls > 0
    ? (cmdMetrics.successfulCalls / cmdMetrics.totalCalls) * 100
    : 0;
  
  const cacheHitRate = (cmdMetrics.cacheHits + cmdMetrics.cacheMisses) > 0
    ? (cmdMetrics.cacheHits / (cmdMetrics.cacheHits + cmdMetrics.cacheMisses)) * 100
    : 0;
  
  return {
    commandName,
    totalCalls: cmdMetrics.totalCalls,
    successRate: Math.round(successRate),
    avgDuration: cmdMetrics.avgDuration,
    cacheHitRate: Math.round(cacheHitRate),
    modeDistribution: cmdMetrics.modeDistribution,
    lastUsed: cmdMetrics.lastUsed
  };
}

/**
 * Get overall thinking metrics summary
 * @returns {object} Summary metrics
 */
function getSummary() {
  const totalCalls = Object.values(metrics).reduce((sum, m) => sum + m.totalCalls, 0);
  const totalSuccessful = Object.values(metrics).reduce((sum, m) => sum + m.successfulCalls, 0);
  const totalFailed = Object.values(metrics).reduce((sum, m) => sum + m.failedCalls, 0);
  const totalCacheHits = Object.values(metrics).reduce((sum, m) => sum + m.cacheHits, 0);
  const totalCacheMisses = Object.values(metrics).reduce((sum, m) => sum + m.cacheMisses, 0);
  
  return {
    totalCommands: Object.keys(metrics).length,
    totalCalls,
    successRate: totalCalls > 0 ? Math.round((totalSuccessful / totalCalls) * 100) : 0,
    avgDuration: totalCalls > 0 
      ? Math.round(Object.values(metrics).reduce((sum, m) => sum + m.totalDuration, 0) / totalCalls)
      : 0,
    cacheHitRate: (totalCacheHits + totalCacheMisses) > 0
      ? Math.round((totalCacheHits / (totalCacheHits + totalCacheMisses)) * 100)
      : 0,
    topCommands: getTopCommands(5)
  };
}

/**
 * Reset metrics for a command
 * @param {string} commandName - Command name
 */
function resetCommandMetrics(commandName) {
  delete metrics[commandName];
  saveMetrics();
}

/**
 * Reset all metrics
 */
function resetAllMetrics() {
  metrics = {};
  saveMetrics();
}

/**
 * Export metrics to JSON string
 * @returns {string} JSON string of metrics
 */
function exportMetrics() {
  return JSON.stringify(metrics, null, 2);
}

/**
 * Import metrics from JSON string
 * @param {string} jsonString - JSON string to import
 */
function importMetrics(jsonString) {
  try {
    const imported = JSON.parse(jsonString);
    metrics = { ...metrics, ...imported };
    saveMetrics();
  } catch (error) {
    throw new Error(`Failed to import metrics: ${error.message}`);
  }
}

module.exports = {
  recordCommandThinking,
  getCommandMetrics,
  getAllMetrics,
  getTopCommands,
  getThinkingEffectiveness,
  getSummary,
  resetCommandMetrics,
  resetAllMetrics,
  exportMetrics,
  importMetrics
};
