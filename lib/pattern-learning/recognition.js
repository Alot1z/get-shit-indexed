/**
 * Pattern Recognition Engine
 * 
 * Analyzes GSI operations to identify repeated patterns, conditions, and optimizations.
 * Uses thinking servers for enhanced analysis quality.
 */

// Lazy-load thinking modules to avoid circular dependencies
let thinkingOrchestrator = null;
let tractatusThinking = null;
let debugThinking = null;

function loadThinkingModules() {
  if (!thinkingOrchestrator) {
    try {
      thinkingOrchestrator = require('../thinking/orchestrator');
    } catch (e) {
      // Thinking orchestrator not available
    }
  }
  return thinkingOrchestrator;
}

/**
 * Use Tractatus for structure analysis
 * @param {string} concept Concept to analyze
 * @returns {Promise<Object|null>} Analysis result
 */
async function useTractatusForStructure(concept) {
  try {
    // Use MCP tool directly
    const result = await global.mcp__tractatus-thinking__tractatus_thinking({
      operation: 'start',
      concept,
      depth_limit: 3
    });
    return result;
  } catch (e) {
    return null;
  }
}

/**
 * Use Debug thinking for error pattern analysis
 * @param {string} problem Problem description
 * @returns {Promise<Object|null>} Analysis result
 */
async function useDebugForErrors(problem) {
  try {
    // Use MCP tool directly
    const result = await global.mcp__debug-thinking__debug_thinking({
      action: 'query',
      queryType: 'similar-problems',
      parameters: { pattern: problem, limit: 5 }
    });
    return result;
  } catch (e) {
    return null;
  }
}

/**
 * Use Sequential thinking for sequence detection
 * @param {string} sequence Sequence to analyze
 * @returns {Promise<Object|null>} Analysis result
 */
async function useSequentialForSequences(sequence) {
  try {
    // Use MCP tool directly
    const result = await global.mcp__sequential-thinking__sequentialthinking({
      thought: `Analyze operation sequence: ${sequence}. Identify the purpose and expected outcome.`,
      thoughtNumber: 1,
      totalThoughts: 2,
      nextThoughtNeeded: true
    });
    return result;
  } catch (e) {
    return null;
  }
}

/**
 * Recognize repeated operation sequences
 * @param {Array} operations - Array of operation records
 * @param {Object} options - Options including useThinking flag
 * @returns {Promise<Array>} Recognized sequences with frequency scores
 */
async function recognizeSequence(operations, options = {}) {
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
        
        const sequencePattern = {
          type: 'sequence',
          operations: operationsList,
          length: len,
          frequency: count,
          score: count * len, // Longer + more frequent = higher score
          firstIndex: opNames.join('->').indexOf(seq),
          thinkingEnhanced: false
        };

        // Use thinking to analyze sequence purpose (if enabled)
        if (options.useThinking && count >= 3) {
          const thinkingResult = useSequentialForSequences(seq);
          if (thinkingResult) {
            sequencePattern.thinkingEnhanced = true;
            sequencePattern.analysis = thinkingResult;
          }
        }

        sequences.push(sequencePattern);
      }
    }
  }

  // Sort by score descending
  return sequences.sort((a, b) => b.score - a.score);
}

/**
 * Recognize context-result correlations
 * @param {Array} operations - Array of operation records
 * @param {Object} options - Options including useThinking flag
 * @returns {Promise<Array>} Recognized conditions
 */
async function recognizeConditions(operations, options = {}) {
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

  // Common failure patterns with thinking enhancement
  const failureFeatures = new Map();
  for (const f of conditions.failure) {
    for (const feature of f.features) {
      const count = failureFeatures.get(feature) || 0;
      failureFeatures.set(feature, count + 1);
    }
  }

  for (const [feature, count] of failureFeatures.entries()) {
    if (count >= 2) { // Feature appears in 2+ failed operations
      const failurePattern = {
        type: 'failure_condition',
        feature,
        frequency: count,
        confidence: Math.min(count / conditions.failure.length, 1),
        thinkingEnhanced: false
      };

      // Use Debug thinking to find similar error patterns
      if (options.useThinking) {
        const debugResult = useDebugForErrors(feature);
        if (debugResult) {
          failurePattern.thinkingEnhanced = true;
          failurePattern.similarProblems = debugResult;
        }
      }

      patterns.push(failurePattern);
    }
  }

  return patterns.sort((a, b) => b.frequency - a.frequency);
}

/**
 * Recognize optimization opportunities
 * @param {Array} operations - Array of operation records
 * @param {Array} metrics - Metrics for each operation
 * @param {Object} options - Options including useThinking flag
 * @returns {Promise<Array>} Optimization suggestions
 */
async function recognizeOptimizations(operations, metrics, options = {}) {
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
      const optimization = {
        type: 'token_optimization',
        suggestion: 'batch_operations',
        tool,
        reason: `High average token usage (${Math.round(avg)} tokens) across ${stats.count} operations`,
        potentialSavings: Math.round((avg - 5000) * stats.count), // Estimate
        confidence: 0.8,
        thinkingEnhanced: false
      };

      // Use Tractatus to analyze structure for better optimization suggestions
      if (options.useThinking) {
        const tractatusResult = useTractatusForStructure(`Optimize token usage for ${tool}`);
        if (tractatusResult) {
          optimization.thinkingEnhanced = true;
          optimization.structuralAnalysis = tractatusResult;
        }
      }

      optimizations.push(optimization);
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
 * Full pattern recognition with thinking enhancement
 * @param {Array} operations - Array of operation records
 * @param {Array} metrics - Metrics for each operation
 * @param {Object} options - Options
 * @returns {Promise<Object>} Enhanced patterns
 */
async function recognizePatternsWithThinking(operations, metrics, options = {}) {
  const useThinking = options.useThinking !== false;

  // Run all recognition in parallel
  const [sequences, conditions, optimizations] = await Promise.all([
    recognizeSequence(operations, { useThinking }),
    recognizeConditions(operations, { useThinking }),
    recognizeOptimizations(operations, metrics, { useThinking })
  ]);

  // Count thinking-enhanced patterns
  const thinkingEnhancedCount = 
    sequences.filter(s => s.thinkingEnhanced).length +
    conditions.filter(c => c.thinkingEnhanced).length +
    optimizations.filter(o => o.thinkingEnhanced).length;

  return {
    timestamp: new Date().toISOString(),
    sequences: sequences.slice(0, 10), // Top 10
    conditions: conditions.slice(0, 10), // Top 10
    optimizations: optimizations.slice(0, 10), // Top 10
    thinkingEnhanced: thinkingEnhancedCount,
    totalPatterns: sequences.length + conditions.length + optimizations.length
  };
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
  recognizePatternsWithThinking,
  exportPatterns
};
