const dc = require('../mcp/desktop-commander');

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

module.exports = { recordAssessment };
