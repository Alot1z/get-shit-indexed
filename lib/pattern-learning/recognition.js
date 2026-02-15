/**
 * Pattern Recognition Engine
 * 
 * Analyzes GSI operations to identify repeated patterns, conditions, and optimizations.
 */

/**
 * Recognize repeated operation sequences
 * @param {Array} operations - Array of operation records
 * @returns {Array} Recognized sequences with frequency scores
 */
function recognizeSequence(operations) {
  if (!Array.isArray(operations) || operations.length < 2) {
    return [];
  }

  const sequences = [];
  const minSequenceLength = 2;
  const maxSequenceLength = 5;

  // Extract operation names
  const opNames = operations.map(op => op.tool || op.name || 'unknown');

  // Find repeated sequences of varying lengths
  for (let len = minSequenceLength; len <= maxSequenceLength && len <= opNames.length / 2; len++) {
    const sequenceMap = new Map();

    for (let i = 0; i <= opNames.length - len; i++) {
      const sequence = opNames.slice(i, i + len).join('->');
      const count = sequenceMap.get(sequence) || 0;
      sequenceMap.set(sequence, count + 1);
    }

    // Filter sequences that appear more than once
    for (const [seq, count] of sequenceMap.entries()) {
      if (count > 1) {
        const operationsList = seq.split('->');
        sequences.push({
          type: 'sequence',
          operations: operationsList,
          length: len,
          frequency: count,
          score: count * len, // Longer + more frequent = higher score
          firstIndex: opNames.join('->').indexOf(seq)
        });
      }
    }
  }

  // Sort by score descending
  return sequences.sort((a, b) => b.score - a.score);
}

/**
 * Recognize context-result correlations
 * @param {Array} operations - Array of operation records
 * @returns {Array} Recognized conditions
 */
function recognizeConditions(operations) {
  if (!Array.isArray(operations)) {
    return [];
  }

  const conditions = {
    success: [],
    failure: [],
    context: []
  };

  for (const op of operations) {
    const context = op.context || {};
    const result = op.result || {};
    const success = result.success !== false && result.error == null;

    // Extract context features
    const features = Object.entries(context).map(([key, value]) => {
      return `${key}:${JSON.stringify(value)}`;
    });

    // Track success conditions
    if (success) {
      conditions.success.push({
        tool: op.tool,
        features,
        timestamp: op.timestamp
      });
    } else {
      conditions.failure.push({
        tool: op.tool,
        features,
        error: result.error,
        timestamp: op.timestamp
      });
    }
  }

  // Analyze patterns in conditions
  const patterns = [];

  // Common success patterns
  const successFeatures = new Map();
  for (const s of conditions.success) {
    for (const feature of s.features) {
      const count = successFeatures.get(feature) || 0;
      successFeatures.set(feature, count + 1);
    }
  }

  for (const [feature, count] of successFeatures.entries()) {
    if (count >= 3) { // Feature appears in 3+ successful operations
      patterns.push({
        type: 'success_condition',
        feature,
        frequency: count,
        confidence: Math.min(count / conditions.success.length, 1)
      });
    }
  }

  // Common failure patterns
  const failureFeatures = new Map();
  for (const f of conditions.failure) {
    for (const feature of f.features) {
      const count = failureFeatures.get(feature) || 0;
      failureFeatures.set(feature, count + 1);
    }
  }

  for (const [feature, count] of failureFeatures.entries()) {
    if (count >= 2) { // Feature appears in 2+ failed operations
      patterns.push({
        type: 'failure_condition',
        feature,
        frequency: count,
        confidence: Math.min(count / conditions.failure.length, 1)
      });
    }
  }

  return patterns.sort((a, b) => b.frequency - a.frequency);
}

/**
 * Recognize optimization opportunities
 * @param {Array} operations - Array of operation records
 * @param {Array} metrics - Metrics for each operation
 * @returns {Array} Optimization suggestions
 */
function recognizeOptimizations(operations, metrics) {
  if (!Array.isArray(operations)) {
    return [];
  }

  const optimizations = [];

  // Token-saving opportunities
  const tokenUsage = operations.map((op, i) => ({
    tool: op.tool,
    tokens: metrics[i]?.tokens || op.tokens || 0,
    timestamp: op.timestamp
  }));

  // Group by tool and calculate averages
  const toolTokenStats = new Map();
  for (const usage of tokenUsage) {
    if (usage.tokens === 0) continue;

    const stats = toolTokenStats.get(usage.tool) || {
      total: 0,
      count: 0,
      max: 0
    };

    stats.total += usage.tokens;
    stats.count += 1;
    stats.max = Math.max(stats.max, usage.tokens);
    toolTokenStats.set(usage.tool, stats);
  }

  for (const [tool, stats] of toolTokenStats.entries()) {
    const avg = stats.total / stats.count;

    // Suggest batch operations if high average token usage
    if (avg > 10000 && stats.count > 2) {
      optimizations.push({
        type: 'token_optimization',
        suggestion: 'batch_operations',
        tool,
        reason: `High average token usage (${Math.round(avg)} tokens) across ${stats.count} operations`,
        potentialSavings: Math.round((avg - 5000) * stats.count), // Estimate
        confidence: 0.8
      });
    }
  }

  // Time-saving opportunities
  const durations = operations.map((op, i) => ({
    tool: op.tool,
    duration: metrics[i]?.duration || op.duration || 0,
    timestamp: op.timestamp
  }));

  // Group by tool
  const toolDurationStats = new Map();
  for (const d of durations) {
    if (d.duration === 0) continue;

    const stats = toolDurationStats.get(d.tool) || {
      total: 0,
      count: 0,
      max: 0
    };

    stats.total += d.duration;
    stats.count += 1;
    stats.max = Math.max(stats.max, d.duration);
    toolDurationStats.set(d.tool, stats);
  }

  for (const [tool, stats] of toolDurationStats.entries()) {
    const avg = stats.total / stats.count;

    // Suggest parallelization if operations are sequential and slow
    if (avg > 5000 && stats.count > 2) {
      optimizations.push({
        type: 'time_optimization',
        suggestion: 'parallel_execution',
        tool,
        reason: `Slow average duration (${Math.round(avg)}ms) across ${stats.count} operations`,
        potentialSavings: Math.round((avg - 1000) * stats.count), // Estimate
        confidence: 0.7
      });
    }
  }

  // Batch operation suggestions (same tool called repeatedly)
  const toolCalls = operations.map(op => op.tool);
  const consecutiveGroups = [];

  let currentTool = null;
  let currentGroup = [];

  for (const tool of toolCalls) {
    if (tool === currentTool) {
      currentGroup.push(tool);
    } else {
      if (currentGroup.length > 0) {
        consecutiveGroups.push({
          tool: currentTool,
          count: currentGroup.length
        });
      }
      currentTool = tool;
      currentGroup = [tool];
    }
  }

  if (currentGroup.length > 0) {
    consecutiveGroups.push({
      tool: currentTool,
      count: currentGroup.length
    });
  }

  for (const group of consecutiveGroups) {
    if (group.count >= 3) {
      optimizations.push({
        type: 'batch_optimization',
        suggestion: 'use_batch_api',
        tool: group.tool,
        reason: `${group.count} consecutive calls to ${group.tool}`,
        potentialSavings: Math.round(group.count * 0.3), // 30% savings estimate
        confidence: 0.9
      });
    }
  }

  return optimizations.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Export recognized patterns for storage
 * @param {Array} sequences - Recognized sequences
 * @param {Array} conditions - Recognized conditions
 * @param {Array} optimizations - Recognized optimizations
 * @returns {object} Exported patterns
 */
function exportPatterns(sequences, conditions, optimizations) {
  return {
    timestamp: new Date().toISOString(),
    sequences: sequences.slice(0, 10), // Top 10
    conditions: conditions.slice(0, 10), // Top 10
    optimizations: optimizations.slice(0, 10) // Top 10
  };
}

module.exports = {
  recognizeSequence,
  recognizeConditions,
  recognizeOptimizations,
  exportPatterns
};
