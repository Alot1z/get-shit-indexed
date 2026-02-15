// Layer 3: Warning System
// Provides user warnings and options for borderline complexity scores

const { getModelThresholds } = require('./model-awareness.js');

/**
 * Generate a warning for borderline complexity scores.
 * Returns null if score is below warning threshold.
 *
 * @param {number} score - The complexity score (0-100 scale)
 * @param {string} planPath - Path to the plan file (for future use)
 * @returns {Promise<object|null>} Warning object with type, message, and options, or null
 */
async function generateWarning(score, planPath) {
  const thresholds = await getModelThresholds();
  
  if (score <= thresholds.warn_threshold) {
    return null; // No warning needed
  }
  
  const isCritical = score > thresholds.split_threshold;
  
  return {
    type: isCritical ? 'critical' : 'warning',
    score,
    threshold: isCritical ? thresholds.split_threshold : thresholds.warn_threshold,
    message: isCritical
      ? `Complexity score ${score} exceeds ${thresholds.split_threshold} threshold. Auto-split recommended.`
      : `Complexity score ${score} is in warning range (${thresholds.warn_threshold}-${thresholds.split_threshold}).`,
    options: [
      { id: 'proceed', label: 'Proceed anyway', risk: 'high' },
      { id: 'split', label: 'Split into sub-phases', risk: 'low', recommended: true },
      { id: 'manual', label: 'Manual review', risk: 'medium' }
    ],
    recommendation: isCritical ? 'split' : 'proceed'
  };
}

module.exports = {
  generateWarning
};
