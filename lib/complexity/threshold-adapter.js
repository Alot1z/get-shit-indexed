const dc = require('../mcp/desktop-commander');
const { adaptFromHistory } = require('./learning');

/**
 * Adapt model thresholds based on historical performance
 * @param {string} modelId - Model identifier (haiku, sonnet, opus)
 * @returns {Promise<Object>} Adaptation result
 */
async function adaptThresholds(modelId) {
  // Get adaptation analysis
  const analysis = await adaptFromHistory();
  
  if (!analysis.adapted) {
    return { adapted: false, reason: analysis.reason || "No adaptation needed" };
  }
  
  // Read current model specs
  const specsPath = '.planning/model-specs.json';
  const specs = JSON.parse(await dc.read_file({ path: specsPath }));
  
  // Adjust thresholds based on problem ranges
  const modelSpec = specs[modelId] || specs['default'];
  const adjustment = -5; // Lower thresholds by 5 points
  
  // Only adjust if problem ranges overlap with current thresholds
  const problemRanges = analysis.problemRanges;
  const currentWarnThreshold = modelSpec.warn_threshold;
  
  if (problemRanges.some(r => r >= currentWarnThreshold - 10 && r <= currentWarnThreshold)) {
    const oldThresholds = { 
      warn_threshold: modelSpec.warn_threshold, 
      split_threshold: modelSpec.split_threshold 
    };
    
    modelSpec.warn_threshold = Math.max(30, modelSpec.warn_threshold + adjustment);
    modelSpec.split_threshold = Math.max(50, modelSpec.split_threshold + adjustment);
    
    // Record adaptation
    const historyPath = '.planning/complexity-history.json';
    const history = JSON.parse(await dc.read_file({ path: historyPath }));
    history.adaptations.push({
      timestamp: new Date().toISOString(),
      modelId,
      oldThresholds,
      newThresholds: { warn_threshold: modelSpec.warn_threshold, split_threshold: modelSpec.split_threshold },
      reason: analysis.recommendation
    });
    
    // Write updated specs
    await dc.write_file({ path: specsPath, content: JSON.stringify(specs, null, 2) });
    await dc.write_file({ path: historyPath, content: JSON.stringify(history, null, 2) });
    
    return {
      adapted: true,
      modelId,
      newThresholds: {
        warn_threshold: modelSpec.warn_threshold,
        split_threshold: modelSpec.split_threshold
      },
      reason: analysis.recommendation
    };
  }
  
  return { adapted: false, reason: "Problem ranges don't overlap with current thresholds" };
}

/**
 * Get adapted thresholds for a model
 * @param {string} modelId - Model identifier
 * @returns {Promise<Object>} Model thresholds
 */
async function getAdaptedThresholds(modelId) {
  const specsPath = '.planning/model-specs.json';
  const specs = JSON.parse(await dc.read_file({ path: specsPath }));
  return specs[modelId] || specs['default'];
}

module.exports = { adaptThresholds, getAdaptedThresholds };
