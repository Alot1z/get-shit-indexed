// Layer 2: Complexity Scoring System
// Calculates complexity scores from plan structure and metrics

/**
 * Complexity scoring weights.
 * Each weight represents estimated token cost in thousands.
 */
const WEIGHTS = {
  fileOp: 2,        // Each file read = 2-5K tokens
  symbolQuery: 5,   // Each symbol extraction = 3-10K tokens
  cgQuery: 8,       // Each graph query = 5-15K tokens
  task: 10,         // Each task = 10-20K tokens
  crossRef: 3       // Each cross-reference = 5K tokens
};

/**
 * Calculate complexity score from plan metrics.
 * Score is normalized to 0-100 scale for easy comparison.
 *
 * @param {object} plan - Plan metrics object
 * @param {number} plan.fileOps - Number of file operations
 * @param {number} plan.symbolQueries - Number of symbol queries
 * @param {number} plan.cgQueries - Number of CodeGraph queries
 * @param {number} plan.tasks - Number of tasks
 * @param {number} plan.crossRefs - Number of cross-references
 * @returns {number} Complexity score (0-100 scale)
 */
function calculateComplexityScore(plan) {
  const score = (
    (plan.fileOps || 0) * WEIGHTS.fileOp +
    (plan.symbolQueries || 0) * WEIGHTS.symbolQuery +
    (plan.cgQueries || 0) * WEIGHTS.cgQuery +
    (plan.tasks?.length || plan.tasks || 0) * WEIGHTS.task +
    (plan.crossRefs || 0) * WEIGHTS.crossRef
  ) / 100;

  return Math.round(score * 10) / 10; // Round to 1 decimal
}

module.exports = {
  WEIGHTS,
  calculateComplexityScore
};
