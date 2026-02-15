// Layer 3: Warning System
// Provides user warnings and options for borderline complexity scores

const { getModelThresholds } = require('./model-awareness.js');
const { executeAutoSplit } = require('./auto-split.js');

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

/**
 * Handle user response to warning.
 * Processes user decision and executes appropriate action.
 *
 * @param {object} warning - Warning object from generateWarning
 * @param {string} userResponse - User's response: 'proceed', 'split', or 'manual'
 * @param {string} planPath - Path to the plan file
 * @param {number} score - Complexity score
 * @returns {Promise<object>} Action result with action, reason, and optional fields
 */
async function handleUserResponse(warning, userResponse, planPath, score) {
  switch (userResponse) {
    case 'proceed':
      return {
        action: 'proceed',
        reason: 'User approved execution despite warning',
        risk: warning.options.find(o => o.id === 'proceed')?.risk || 'high'
      };
      
    case 'split':
      const splitResult = await executeAutoSplit(planPath, score);
      return {
        action: 'split',
        reason: 'User approved auto-split',
        ...splitResult
      };
      
    case 'manual':
      return {
        action: 'manual',
        reason: 'User requested manual review',
        requiresHumanIntervention: true
      };
      
    default:
      return {
        action: 'unknown',
        reason: `Unknown response: ${userResponse}`,
        fallback: 'proceed'
      };
  }
}

module.exports = {
  generateWarning,
  handleUserResponse
};
