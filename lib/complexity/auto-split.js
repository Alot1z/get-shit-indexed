// Layer 3: Auto-Split Decision Engine
// Automatically splits high-complexity plans into manageable sub-phases

const { getModelThresholds } = require('./model-awareness.js');
const fs = require('fs').promises;
const path = require('path');

/**
 * Calculate how many sub-phases are needed based on complexity score.
 * Uses model-specific thresholds from Layer 1.
 *
 * @param {number} score - The complexity score (0-100 scale)
 * @returns {Promise<number>} Number of sub-phases needed (1 = no split)
 */
async function calculateSubPhaseCount(score) {
  const thresholds = await getModelThresholds();
  
  if (score <= thresholds.split_threshold) {
    return 1; // No split needed
  }
  
  // Calculate how many sub-phases needed
  const subPhaseCount = Math.ceil(score / thresholds.split_threshold);
  
  // Cap at reasonable maximum (avoid over-fragmentation)
  const maxSubPhases = 5;
  return Math.min(subPhaseCount, maxSubPhases);
}

module.exports = {
  calculateSubPhaseCount
};
