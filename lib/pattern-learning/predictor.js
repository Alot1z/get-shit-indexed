/**
 * Pattern Predictor
 * 
 * Predicts next operations, optimal approaches, and risks based on learned patterns.
 */

const { getPatterns, getAllPatterns } = require('./storage');

/**
 * Predict next operation based on current context
 * @param {object} context - Current operation context
 * @returns {Promise<object>} Prediction with confidence
 */
async function predictNextOperation(context) {
  try {
    const sequences = await getPatterns('sequences', { minFrequency: 2 });

    if (sequences.length === 0) {
      return {
        prediction: null,
        confidence: 0,
        reason: 'No patterns learned yet'
      };
    }

    // Find sequences that match the context
    const currentTool = context.tool || context.operation;
    const matches = [];

    for (const seq of sequences) {
      // Find sequences where current tool appears
      const toolIndex = seq.operations.indexOf(currentTool);

      if (toolIndex !== -1 && toolIndex < seq.operations.length - 1) {
        // Current tool is in sequence, predict next tool
        matches.push({
          nextOperation: seq.operations[toolIndex + 1],
          confidence: seq.frequency * seq.score,
          sequence: seq.operations,
          frequency: seq.frequency
        });
      }
    }

    if (matches.length === 0) {
      return {
        prediction: null,
        confidence: 0,
        reason: 'No matching patterns found'
      };
    }

    // Sort by confidence
    matches.sort((a, b) => b.confidence - a.confidence);

    const topMatch = matches[0];

    // Normalize confidence to 0-1
    const maxConfidence = matches[0].confidence;
    const normalizedConfidence = Math.min(maxConfidence / 100, 1);

    return {
      prediction: topMatch.nextOperation,
      confidence: normalizedConfidence,
      sequence: topMatch.sequence,
      alternatives: matches.slice(1, 3).map(m => m.nextOperation),
      reason: `Based on ${topMatch.frequency} occurrences of this sequence`
    };
  } catch (error) {
    return {
      prediction: null,
      confidence: 0,
      error: error.message
    };
  }
}

/**
 * Predict optimal approach for a goal
 * @param {string} goal - Goal to achieve
 * @param {object} context - Current context
 * @returns {Promise<object>} Suggested approach with ranking
 */
async function predictOptimalApproach(goal, context = {}) {
  try {
    const optimizations = await getPatterns('optimizations', { minConfidence: 0.5 });

    if (optimizations.length === 0) {
      return {
        approach: null,
        confidence: 0,
        reason: 'No optimization patterns learned yet'
      };
    }

    // Match optimizations to goal
    const matches = optimizations.map(opt => {
      let relevance = 0;

      // Check if optimization type matches goal intent
      if (goal.includes('token') || goal.includes('efficient')) {
        if (opt.type === 'token_optimization') relevance = 1;
      }

      if (goal.includes('fast') || goal.includes('quick') || goal.includes('time')) {
        if (opt.type === 'time_optimization') relevance = 1;
      }

      if (goal.includes('batch') || goal.includes('multiple')) {
        if (opt.type === 'batch_optimization') relevance = 1;
      }

      // Context matching
      if (context.tool === opt.tool) {
        relevance += 0.5;
      }

      return {
        ...opt,
        relevance
      };
    });

    // Filter relevant matches
    const relevantMatches = matches.filter(m => m.relevance > 0);

    if (relevantMatches.length === 0) {
      return {
        approach: null,
        confidence: 0,
        reason: 'No relevant optimizations found for this goal'
      };
    }

    // Sort by relevance * confidence
    relevantMatches.sort((a, b) => (b.relevance * b.confidence) - (a.relevance * a.confidence));

    const topMatch = relevantMatches[0];

    return {
      approach: {
        suggestion: topMatch.suggestion,
        tool: topMatch.tool,
        reason: topMatch.reason,
        potentialSavings: topMatch.potentialSavings
      },
      confidence: topMatch.confidence * topMatch.relevance,
      alternatives: relevantMatches.slice(1, 3).map(m => ({
        suggestion: m.suggestion,
        tool: m.tool,
        reason: m.reason
      })),
      reason: `Based on ${topMatch.frequency} similar optimizations`
    };
  } catch (error) {
    return {
      approach: null,
      confidence: 0,
      error: error.message
    };
  }
}

/**
 * Predict risks based on current context
 * @param {object} context - Current operation context
 * @returns {Promise<object>} Risk assessment
 */
async function predictRisks(context) {
  try {
    const conditions = await getPatterns('conditions');
    const failureConditions = conditions.filter(c => c.type === 'failure_condition');

    if (failureConditions.length === 0) {
      return {
        risks: [],
        safe: true,
        reason: 'No failure patterns learned yet'
      };
    }

    const risks = [];
    const currentTool = context.tool || context.operation;

    // Check for matching failure conditions
    for (const failure of failureConditions) {
      let match = false;
      let riskReason = '';

      // Tool matches
      if (failure.tool === currentTool) {
        match = true;
        riskReason = `Previous failures observed with ${currentTool}`;
      }

      // Context feature matches
      if (context.features) {
        for (const feature of context.features) {
          if (failure.feature.includes(feature)) {
            match = true;
            riskReason = `Context pattern "${failure.feature}" has led to failures`;
            break;
          }
        }
      }

      if (match) {
        risks.push({
          type: 'known_failure_pattern',
          severity: Math.round(failure.confidence * 10), // 1-10 scale
          reason: riskReason,
          confidence: failure.confidence,
          frequency: failure.frequency
        });
      }
    }

    // Check for optimization warnings (high token usage)
    const optimizations = await getPatterns('optimizations');
    const tokenOptimizations = optimizations.filter(o => o.type === 'token_optimization' && o.tool === currentTool);

    for (const opt of tokenOptimizations) {
      if (opt.confidence > 0.7) {
        risks.push({
          type: 'high_token_usage',
          severity: 3,
          reason: opt.reason,
          confidence: opt.confidence,
          suggestion: opt.suggestion
        });
      }
    }

    // Sort by severity
    risks.sort((a, b) => b.severity - a.severity);

    return {
      risks,
      safe: risks.length === 0,
      severity: risks.length > 0 ? risks[0].severity : 0,
      summary: risks.length > 0 ? `${risks.length} risk(s) detected` : 'No known risks'
    };
  } catch (error) {
    return {
      risks: [],
      safe: false,
      error: error.message
    };
  }
}

/**
 * Get comprehensive prediction for context
 * @param {object} context - Current operation context
 * @param {string} goal - Optional goal
 * @returns {Promise<object>} Comprehensive prediction
 */
async function getPrediction(context, goal = null) {
  const [nextOp, approach, risks] = await Promise.all([
    predictNextOperation(context),
    goal ? predictOptimalApproach(goal, context) : Promise.resolve({ approach: null }),
    predictRisks(context)
  ]);

  return {
    nextOperation: nextOp,
    optimalApproach: approach,
    risks,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  predictNextOperation,
  predictOptimalApproach,
  predictRisks,
  getPrediction
};
