/**
 * Pattern Learning Metrics
 * 
 * Tracks and reports metrics for pattern learning effectiveness.
 */

const fs = require('fs');
const path = require('path');

const METRICS_FILE = path.join(__dirname, '../../.planning/pattern-learning-metrics.json');

// In-memory metrics
const metrics = {
  sessions: {
    total: 0,
    withPatterns: 0,
    avgPatternsPerSession: 0
  },
  predictions: {
    total: 0,
    accurate: 0,
    accuracy: 0
  },
  optimizations: {
    suggested: 0,
    accepted: 0,
    acceptanceRate: 0,
    totalTokensSaved: 0,
    totalTimeSaved: 0
  },
  patterns: {
    sequencesLearned: 0,
    conditionsLearned: 0,
    optimizationsLearned: 0,
    totalPatterns: 0
  },
  efficiency: {
    avgSessionTokens: 0,
    avgSessionDuration: 0,
    tokenImprovement: 0,
    timeImprovement: 0
  }
};

// Load metrics from file
function loadMetrics() {
  try {
    if (fs.existsSync(METRICS_FILE)) {
      const content = fs.readFileSync(METRICS_FILE, 'utf8');
      const loaded = JSON.parse(content);
      Object.assign(metrics, loaded);
    }
  } catch (e) {
    // Start fresh
  }
}

// Save metrics to file
function saveMetrics() {
  try {
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save metrics:', e.message);
  }
}

/**
 * Record session metrics
 * @param {object} sessionStats - Session statistics
 */
function recordSession(sessionStats) {
  metrics.sessions.total++;

  if (sessionStats.patternsFound > 0) {
    metrics.sessions.withPatterns++;
    metrics.sessions.avgPatternsPerSession =
      (metrics.sessions.avgPatternsPerSession * (metrics.sessions.withPatterns - 1) + sessionStats.patternsFound) /
      metrics.sessions.withPatterns;
  }

  // Track efficiency
  if (sessionStats.totalTokens > 0) {
    metrics.efficiency.avgSessionTokens =
      (metrics.efficiency.avgSessionTokens * (metrics.sessions.total - 1) + sessionStats.totalTokens) /
      metrics.sessions.total;
  }

  if (sessionStats.totalDuration > 0) {
    metrics.efficiency.avgSessionDuration =
      (metrics.efficiency.avgSessionDuration * (metrics.sessions.total - 1) + sessionStats.totalDuration) /
      metrics.sessions.total;
  }

  saveMetrics();
}

/**
 * Record prediction result
 * @param {boolean} accurate - Whether prediction was accurate
 */
function recordPrediction(accurate) {
  metrics.predictions.total++;

  if (accurate) {
    metrics.predictions.accurate++;
  }

  metrics.predictions.accuracy = metrics.predictions.accurate / metrics.predictions.total;

  saveMetrics();
}

/**
 * Record optimization suggestion
 * @param {string} type - Optimization type
 * @param {boolean} accepted - Whether suggestion was accepted
 * @param {number} tokensSaved - Tokens saved (if accepted)
 * @param {number} timeSaved - Time saved in ms (if accepted)
 */
function recordOptimization(type, accepted, tokensSaved = 0, timeSaved = 0) {
  metrics.optimizations.suggested++;

  if (accepted) {
    metrics.optimizations.accepted++;
    metrics.optimizations.totalTokensSaved += tokensSaved;
    metrics.optimizations.totalTimeSaved += timeSaved;
  }

  metrics.optimizations.acceptanceRate = metrics.optimizations.accepted / metrics.optimizations.suggested;

  saveMetrics();
}

/**
 * Record pattern learned
 * @param {string} type - Pattern type (sequence, condition, optimization)
 */
function recordPattern(type) {
  if (type === 'sequence') {
    metrics.patterns.sequencesLearned++;
  } else if (type === 'condition') {
    metrics.patterns.conditionsLearned++;
  } else if (type === 'optimization') {
    metrics.patterns.optimizationsLearned++;
  }

  metrics.patterns.totalPatterns =
    metrics.patterns.sequencesLearned +
    metrics.patterns.conditionsLearned +
    metrics.patterns.optimizationsLearned;

  saveMetrics();
}

/**
 * Record efficiency improvement
 * @param {number} tokenImprovement - Token improvement percentage
 * @param {number} timeImprovement - Time improvement percentage
 */
function recordEfficiencyImprovement(tokenImprovement, timeImprovement) {
  if (tokenImprovement > 0) {
    metrics.efficiency.tokenImprovement =
      (metrics.efficiency.tokenImprovement * (metrics.sessions.total - 1) + tokenImprovement) /
      metrics.sessions.total;
  }

  if (timeImprovement > 0) {
    metrics.efficiency.timeImprovement =
      (metrics.efficiency.timeImprovement * (metrics.sessions.total - 1) + timeImprovement) /
      metrics.sessions.total;
  }

  saveMetrics();
}

/**
 * Get all metrics
 * @returns {object} Current metrics
 */
function getMetrics() {
  return { ...metrics };
}

/**
 * Get metrics summary
 * @returns {string} Human-readable summary
 */
function getMetricsSummary() {
  const summary = [];

  summary.push('# Pattern Learning Metrics');
  summary.push('');
  summary.push('## Sessions');
  summary.push(`- Total Sessions: ${metrics.sessions.total}`);
  summary.push(`- Sessions with Patterns: ${metrics.sessions.withPatterns}`);
  summary.push(`- Avg Patterns/Session: ${metrics.sessions.avgPatternsPerSession.toFixed(1)}`);
  summary.push('');

  summary.push('## Predictions');
  summary.push(`- Total Predictions: ${metrics.predictions.total}`);
  summary.push(`- Accurate Predictions: ${metrics.predictions.accurate}`);
  summary.push(`- Accuracy: ${(metrics.predictions.accuracy * 100).toFixed(1)}%`);
  summary.push('');

  summary.push('## Optimizations');
  summary.push(`- Suggestions: ${metrics.optimizations.suggested}`);
  summary.push(`- Accepted: ${metrics.optimizations.accepted}`);
  summary.push(`- Acceptance Rate: ${(metrics.optimizations.acceptanceRate * 100).toFixed(1)}%`);
  summary.push(`- Total Tokens Saved: ${metrics.optimizations.totalTokensSaved.toLocaleString()}`);
  summary.push(`- Total Time Saved: ${metrics.optimizations.totalTimeSaved.toLocaleString()}ms`);
  summary.push('');

  summary.push('## Patterns Learned');
  summary.push(`- Sequences: ${metrics.patterns.sequencesLearned}`);
  summary.push(`- Conditions: ${metrics.patterns.conditionsLearned}`);
  summary.push(`- Optimizations: ${metrics.patterns.optimizationsLearned}`);
  summary.push(`- Total: ${metrics.patterns.totalPatterns}`);
  summary.push('');

  summary.push('## Efficiency');
  summary.push(`- Avg Session Tokens: ${Math.round(metrics.efficiency.avgSessionTokens).toLocaleString()}`);
  summary.push(`- Avg Session Duration: ${Math.round(metrics.efficiency.avgSessionDuration).toLocaleString()}ms`);
  summary.push(`- Token Improvement: ${(metrics.efficiency.tokenImprovement * 100).toFixed(1)}%`);
  summary.push(`- Time Improvement: ${(metrics.efficiency.timeImprovement * 100).toFixed(1)}%`);
  summary.push('');

  return summary.join('\n');
}

/**
 * Reset metrics
 */
function resetMetrics() {
  metrics.sessions = { total: 0, withPatterns: 0, avgPatternsPerSession: 0 };
  metrics.predictions = { total: 0, accurate: 0, accuracy: 0 };
  metrics.optimizations = { suggested: 0, accepted: 0, acceptanceRate: 0, totalTokensSaved: 0, totalTimeSaved: 0 };
  metrics.patterns = { sequencesLearned: 0, conditionsLearned: 0, optimizationsLearned: 0, totalPatterns: 0 };
  metrics.efficiency = { avgSessionTokens: 0, avgSessionDuration: 0, tokenImprovement: 0, timeImprovement: 0 };

  saveMetrics();
}

// Initialize
loadMetrics();

module.exports = {
  recordSession,
  recordPrediction,
  recordOptimization,
  recordPattern,
  recordEfficiencyImprovement,
  getMetrics,
  getMetricsSummary,
  resetMetrics
};
