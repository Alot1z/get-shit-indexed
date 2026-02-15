// Main Cognitive Orchestration Flow
// Orchestrates three-phase cognitive analysis: Structure → Process → Learning

const { runStructurePhase } = require('./tractatus-ci-phase');
const { runProcessPhase } = require('./sequential-cg-phase');
const { runLearningPhase } = require('./debug-dc-phase');
const { calculateComplexityScore, decideAction } = require('./scorer');

/**
 * Run full cognitive flow for complexity prediction.
 * Executes phases ITERATIVELY (NOT parallel) - each phase uses results from previous phases.
 *
 * Three-Phase Flow:
 * 1. Structure Phase (Tractatus + CI): Analyzes plan structure and file metrics
 * 2. Process Phase (Sequential + CG): Assesses dependencies and cross-file impact
 * 3. Learning Phase (Debug + DC): Learns from past patterns
 *
 * @param {string} planPath - Path to plan file being analyzed
 * @param {object} planMetrics - Plan metrics (files, tasks, crossRefs, etc.)
 * @returns {Promise<object>} Cognitive analysis result with score, action, and phase details
 */
async function runCognitiveFlow(planPath, planMetrics) {
  const startTime = Date.now();
  
  // Execute phases ITERATIVELY (NOT parallel)
  // Each phase uses results from previous phases
  
  // Phase 1: Structure (Tractatus + CI)
  const structureResult = await runStructurePhase(planPath, planMetrics);
  
  // Phase 2: Process (Sequential + CG) - uses Phase 1 results
  const processResult = await runProcessPhase(planMetrics, structureResult);
  
  // Calculate base score from plan metrics using Layer 1 scorer
  const baseScore = calculateComplexityScore(planMetrics);
  
  // Combine scores with phase weights
  // Base score: 50%, Structure: 25%, Process: 25%
  const combinedScore = (
    baseScore * 0.5 +
    (structureResult.structuralComplexity || 5) * 2.5 +
    (processResult.processComplexity || 5) * 2.5
  );
  
  // Get action decision using Layer 1 model-aware thresholds
  const action = await decideAction(combinedScore);
  
  // Phase 3: Learning (Debug + DC) - uses combined score and action
  const learningResult = await runLearningPhase(combinedScore, {
    modelId: action.modelId,
    action: action.action,
    score: combinedScore,
    fileCount: structureResult.fileCount
  });

  const duration = Date.now() - startTime;

  return {
    score: Math.round(combinedScore * 10) / 10,
    action: action.action,
    reason: action.reason,
    phases: {
      structure: structureResult,
      process: processResult,
      learning: learningResult
    },
    options: action.options,
    subPhaseCount: action.subPhaseCount,
    duration,
    degraded: structureResult.degraded || processResult.degraded || learningResult.degraded
  };
}

module.exports = {
  runCognitiveFlow
};
