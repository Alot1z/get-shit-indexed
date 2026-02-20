const dc = require('../mcp/desktop-commander');

// Import pattern-learning for unified knowledge access
let patternLearning = null;
try {
  patternLearning = require('../pattern-learning');
} catch (e) {
  // Pattern-learning may not be available in all contexts
}

/**
 * Record a complexity assessment to history and debug-thinking
 * @param {Object} assessment - Assessment data
 * @param {string} assessment.planPath - Path to the plan file
 * @param {number} assessment.score - Complexity score (0-100)
 * @param {string} assessment.action - Action taken (execute, auto-split, warn)
 * @param {string} assessment.model - Model used (haiku, sonnet, opus)
 * @param {string} assessment.result - Result (success, failed, pending)
 * @param {boolean} assessment.degraded - Whether MCP servers degraded
 * @param {Object} assessment.phases - Phase-specific scores
 * @returns {Promise<Object>} Assessment record
 */
async function recordAssessment(assessment) {
  // Read current history
  const historyPath = '.planning/complexity-history.json';
  const history = JSON.parse(await dc.read_file({ path: historyPath }));
  
  // Create assessment record
  const record = {
    id: `assess-${Date.now()}`,
    timestamp: new Date().toISOString(),
    planPath: assessment.planPath,
    score: assessment.score,
    action: assessment.action,
    model: assessment.model,
    result: assessment.result || 'pending', // 'success', 'failed', 'pending'
    degraded: assessment.degraded || false,
    phases: assessment.phases || {}
  };
  
  // Add to history
  history.assessments.push(record);
  
  // Update statistics
  history.statistics.totalAssessments++;
  if (assessment.action === 'auto-split') history.statistics.autoSplits++;
  if (assessment.action === 'warn') history.statistics.warnings++;
  history.statistics.avgScore = 
    history.assessments.reduce((s, a) => s + a.score, 0) / history.assessments.length;
  history.lastUpdated = record.timestamp;
  
  // Write updated history
  await dc.write_file({ path: historyPath, content: JSON.stringify(history, null, 2) });
  
  // Also record in debug-thinking knowledge graph
  await mcp__debug__debug_thinking({
    action: "create",
    nodeType: "observation",
    content: `Complexity assessment: score=${assessment.score}, action=${assessment.action}`,
    metadata: { score: assessment.score, action: assessment.action, model: assessment.model }
  });
  
  return record;
}

/**
 * Query patterns from debug-thinking and local history
 * @param {Object} criteria - Query criteria
 * @param {string} criteria.pattern - Pattern to search for
 * @param {number} criteria.minScore - Minimum score filter
 * @param {string} criteria.action - Action filter (execute, auto-split, warn)
 * @param {string} criteria.model - Model filter (haiku, sonnet, opus)
 * @param {number} criteria.limit - Max results from debug-thinking
 * @param {number} criteria.minSimilarity - Minimum similarity (0-1)
 * @returns {Promise<Object>} Pattern query results
 */
async function queryPatterns(criteria = {}) {
  // Query debug-thinking knowledge graph
  const debugPatterns = await mcp__debug__debug_thinking({
    action: "query",
    queryType: "similar-problems",
    parameters: {
      pattern: criteria.pattern || "complexity",
      limit: criteria.limit || 10,
      minSimilarity: criteria.minSimilarity || 0.3
    }
  });
  
  // Also query local history file
  const historyPath = '.planning/complexity-history.json';
  const history = JSON.parse(await dc.read_file({ path: historyPath }));
  
  // Filter by criteria
  let localPatterns = history.assessments;
  if (criteria.minScore) {
    localPatterns = localPatterns.filter(a => a.score >= criteria.minScore);
  }
  if (criteria.action) {
    localPatterns = localPatterns.filter(a => a.action === criteria.action);
  }
  if (criteria.model) {
    localPatterns = localPatterns.filter(a => a.model === criteria.model);
  }
  
  return {
    debugGraph: debugPatterns.results || [],
    localHistory: localPatterns.slice(-20), // Last 20 matching
    combinedCount: (debugPatterns.results?.length || 0) + localPatterns.length
  };
}

/**
 * Analyze historical assessments to identify adaptation patterns
 * @returns {Promise<Object>} Adaptation analysis with recommendations
 */
async function adaptFromHistory() {
  const historyPath = '.planning/complexity-history.json';
  const history = JSON.parse(await dc.read_file({ path: historyPath }));
  
  // Only adapt if we have enough data
  if (history.assessments.length < 10) {
    return { adapted: false, reason: "Insufficient history for adaptation" };
  }
  
  // Query pattern-learning for complexity patterns (if available)
  let learnedPatterns = [];
  if (patternLearning) {
    try {
      const patternResult = await patternLearning.queryPatterns({ 
        type: 'complexity',
        limit: 20 
      });
      learnedPatterns = patternResult.patterns || [];
    } catch (e) {
      // Pattern-learning unavailable, use local only
    }
  }
  
  // Analyze success rates by score ranges
  const scoreRanges = {};
  history.assessments.forEach(a => {
    const range = Math.floor(a.score / 10) * 10; // 0-10, 10-20, etc.
    if (!scoreRanges[range]) {
      scoreRanges[range] = { success: 0, failed: 0, total: 0 };
    }
    scoreRanges[range].total++;
    if (a.result === 'success') scoreRanges[range].success++;
    if (a.result === 'failed') scoreRanges[range].failed++;
  });
  
  // Find problem ranges (high failure rate)
  const problemRanges = Object.entries(scoreRanges)
    .filter(([range, stats]) => stats.failed / stats.total > 0.3)
    .map(([range]) => parseInt(range));
  
  // Calculate success rate
  const successfulAssessments = history.assessments.filter(a => a.result === 'success').length;
  history.statistics.successRate = successfulAssessments / history.assessments.length;
  
  return {
    adapted: problemRanges.length > 0,
    problemRanges,
    successRate: history.statistics.successRate,
    recommendation: problemRanges.length > 0 
      ? `Consider lowering thresholds to avoid score ranges: ${problemRanges.join(', ')}`
      : "Current thresholds performing well"
  };
}

module.exports = { recordAssessment, queryPatterns, adaptFromHistory };
