/**
 * Learning Loop
 * 
 * Continuously learns from GSI operations through recording, analysis, and feedback.
 */

const { recognizeSequence, recognizeConditions, recognizeOptimizations, exportPatterns } = require('./recognition');
const { storePattern, getPatternStats } = require('./storage');

// In-memory session buffer
const sessionBuffer = [];
const MAX_BUFFER_SIZE = 100;

/**
 * Record an operation for learning
 * @param {string} operation - Operation name
 * @param {object} context - Operation context
 * @param {object} result - Operation result
 * @param {object} metrics - Operation metrics (tokens, duration)
 */
async function recordOperation(operation, context = {}, result = {}, metrics = {}) {
  const record = {
    operation,
    tool: operation, // Alias for consistency
    context,
    result,
    metrics: {
      tokens: metrics.tokens || 0,
      duration: metrics.duration || 0
    },
    timestamp: new Date().toISOString()
  };

  // Add to session buffer
  sessionBuffer.push(record);

  // Trim buffer if needed
  if (sessionBuffer.length > MAX_BUFFER_SIZE) {
    sessionBuffer.shift();
  }

  // Trigger pattern analysis if buffer is large enough
  if (sessionBuffer.length >= 5) {
    await analyzeSession(sessionBuffer);
  }
}

/**
 * Analyze session for patterns
 * @param {Array} sessionOperations - Operations in this session
 * @returns {Promise<object>} Analysis results
 */
async function analyzeSession(sessionOperations) {
  try {
    // Recognize patterns
    const sequences = recognizeSequence(sessionOperations);
    const conditions = recognizeConditions(sessionOperations);
    const metrics = sessionOperations.map(op => op.metrics || {});
    const optimizations = recognizeOptimizations(sessionOperations, metrics);

    // Store patterns
    for (const seq of sequences) {
      if (seq.score > 5) { // Only store high-quality patterns
        await storePattern('sequences', seq);
      }
    }

    for (const cond of conditions) {
      if (cond.confidence > 0.5) { // Only store confident patterns
        await storePattern('conditions', cond);
      }
    }

    for (const opt of optimizations) {
      if (opt.confidence > 0.6) { // Only store confident optimizations
        await storePattern('optimizations', opt);
      }
    }

    // Export patterns
    const exported = exportPatterns(sequences, conditions, optimizations);

    return {
      patternsFound: sequences.length + conditions.length + optimizations.length,
      patternsStored: exported.sequences.length + exported.conditions.length + exported.optimizations.length,
      topSequences: exported.sequences.slice(0, 3),
      topConditions: exported.conditions.slice(0, 3),
      topOptimizations: exported.optimizations.slice(0, 3)
    };
  } catch (error) {
    console.error(`Session analysis failed: ${error.message}`);
    return {
      error: error.message,
      patternsFound: 0,
      patternsStored: 0
    };
  }
}

/**
 * Adapt pattern based on feedback
 * @param {string} patternId - Pattern ID
 * @param {string} feedback - Feedback type (positive, negative, neutral)
 * @param {object} details - Additional feedback details
 */
async function adaptFromFeedback(patternId, feedback, details = {}) {
  try {
    const patterns = await require('./storage').getAllPatterns();
    let found = false;
    let adapted = false;

    // Search for pattern
    for (const type of ['sequences', 'conditions', 'optimizations']) {
      const index = patterns[type].findIndex(p => p.id === patternId);

      if (index !== -1) {
        found = true;
        const pattern = patterns[type][index];

        // Adjust based on feedback
        if (feedback === 'positive') {
          pattern.confidence = Math.min((pattern.confidence || 0.5) + 0.1, 1);
          pattern.successCount = (pattern.successCount || 0) + 1;
          adapted = true;
        } else if (feedback === 'negative') {
          pattern.confidence = Math.max((pattern.confidence || 0.5) - 0.2, 0);
          pattern.failureCount = (pattern.failureCount || 0) + 1;
          adapted = true;
        } else if (feedback === 'neutral') {
          pattern.neutralCount = (pattern.neutralCount || 0) + 1;
        }

        // Update conditions based on feedback
        if (details.newCondition) {
          pattern.conditions = pattern.conditions || [];
          pattern.conditions.push({
            condition: details.newCondition,
            timestamp: new Date().toISOString()
          });
        }

        // Store updated pattern
        await storePattern(type.slice(0, -1), pattern); // Remove trailing 's'

        break;
      }
    }

    return {
      found,
      adapted,
      feedback,
      patternId
    };
  } catch (error) {
    console.error(`Feedback adaptation failed: ${error.message}`);
    return {
      found: false,
      adapted: false,
      error: error.message
    };
  }
}

/**
 * Get session statistics
 * @returns {object} Session statistics
 */
function getSessionStats() {
  const successfulOps = sessionBuffer.filter(op => op.result.success !== false && !op.result.error);
  const failedOps = sessionBuffer.filter(op => op.result.success === false || op.result.error);

  const totalTokens = sessionBuffer.reduce((sum, op) => sum + (op.metrics.tokens || 0), 0);
  const totalDuration = sessionBuffer.reduce((sum, op) => sum + (op.metrics.duration || 0), 0);

  return {
    totalOperations: sessionBuffer.length,
    successfulOperations: successfulOps.length,
    failedOperations: failedOps.length,
    successRate: sessionBuffer.length > 0 ? successfulOps.length / sessionBuffer.length : 0,
    totalTokens,
    totalDuration,
    avgTokens: sessionBuffer.length > 0 ? totalTokens / sessionBuffer.length : 0,
    avgDuration: sessionBuffer.length > 0 ? totalDuration / sessionBuffer.length : 0
  };
}

/**
 * Clear session buffer
 */
function clearSession() {
  sessionBuffer.length = 0;
}

/**
 * Get learning summary
 * @returns {Promise<object>} Combined session and stored pattern stats
 */
async function getLearningSummary() {
  const sessionStats = getSessionStats();
  const patternStats = await getPatternStats();

  return {
    session: sessionStats,
    patterns: patternStats,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  recordOperation,
  analyzeSession,
  adaptFromFeedback,
  getSessionStats,
  clearSession,
  getLearningSummary
};
