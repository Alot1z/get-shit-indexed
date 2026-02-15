// Main Cognitive Orchestration Flow
// Orchestrates three-phase cognitive analysis: Structure → Process → Learning

const { runStructurePhase } = require('./tractatus-ci-phase');
const { runProcessPhase } = require('./sequential-cg-phase');
const { runLearningPhase } = require('./debug-dc-phase');
const { calculateComplexityScore, decideAction } = require('./scorer');

/**
 * Run full cognitive flow for complexity prediction with graceful degradation.
 * Executes phases ITERATIVELY (NOT parallel) - each phase uses results from previous phases.
 *
 * Three-Phase Flow:
 * 1. Structure Phase (Tractatus + CI): Analyzes plan structure and file metrics
 * 2. Process Phase (Sequential + CG): Assesses dependencies and cross-file impact
 * 3. Learning Phase (Debug + DC): Learns from past patterns
 *
 * Error Handling:
 * - Each phase has internal fallback logic
 * - If MCP servers unavailable, uses basic metrics
 * - Always returns valid result (never throws)
 * - Sets degraded=true when any phase fails
 *
 * @param {string} planPath - Path to plan file being analyzed
 * @param {object} planMetrics - Plan metrics (files, tasks, crossRefs, etc.)
 * @returns {Promise<object>} Cognitive analysis result with score, action, and phase details
 */
async function runCognitiveFlow(planPath, planMetrics) {
  const startTime = Date.now();
  const results = {
    score: 0,
    action: 'execute',
    reason: '',
    phases: {},
    options: null,
    subPhaseCount: 1,
    duration: 0,
    degraded: false
  };
  
  // Execute phases ITERATIVELY with error handling
  // Each phase uses results from previous phases
  
  // Phase 1: Structure (Tractatus + CI)
  try {
    results.phases.structure = await runStructurePhase(planPath, planMetrics);
  } catch (e) {
    // Fallback: Use basic scoring without Tractatus/CI
    console.error(`Structure phase failed: ${e.message}`);
    results.phases.structure = {
      fileCount: planMetrics.files?.length || 0,
      totalLines: 0,
      totalFunctions: 0,
      structuralComplexity: 5,
      degraded: true
    };
    results.degraded = true;
  }
  
  // Phase 2: Process (Sequential + CG) - uses Phase 1 results
  try {
    results.phases.process = await runProcessPhase(planMetrics, results.phases.structure);
  } catch (e) {
    // Fallback: Skip dependency analysis
    console.error(`Process phase failed: ${e.message}`);
    results.phases.process = {
      dependencyCount: 0,
      crossFileImpact: 0,
      dependencyWeight: 0,
      processComplexity: 5,
      recommendation: 'proceed',
      degraded: true
    };
    results.degraded = true;
  }
  
  // Calculate base score from plan metrics using Layer 1 scorer
  // Always works - uses local calculations only
  const baseScore = calculateComplexityScore(planMetrics);
  
  // Combine scores with phase weights
  // Use defaults if phases degraded
  const combinedScore = (
    baseScore * 0.5 +
    (results.phases.structure.structuralComplexity || 5) * 2.5 +
    (results.phases.process.processComplexity || 5) * 2.5
  );
  
  // Get action decision using Layer 1 model-aware thresholds
  // Always works - uses local thresholds only
  try {
    const action = await decideAction(combinedScore);
    results.action = action.action;
    results.reason = action.reason;
    results.options = action.options;
    results.subPhaseCount = action.subPhaseCount;
  } catch (e) {
    // Fallback: Use simple threshold-based decision
    console.error(`Action decision failed: ${e.message}`);
    results.action = combinedScore > 50 ? 'warn' : 'execute';
    results.reason = `Score ${combinedScore.toFixed(1)} (decision degraded)`;
    results.degraded = true;
  }
  
  // Phase 3: Learning (Debug + DC) - uses combined score and action
  try {
    results.phases.learning = await runLearningPhase(combinedScore, {
      modelId: 'unknown',
      action: results.action,
      score: combinedScore,
      fileCount: results.phases.structure.fileCount
    });
  } catch (e) {
    // Fallback: Skip learning (non-critical)
    console.error(`Learning phase failed: ${e.message}`);
    results.phases.learning = {
      pastPatternCount: 0,
      observationId: null,
      connectionsMade: 0,
      learningApplied: false,
      insights: [],
      degraded: true
    };
    results.degraded = true;
  }

  results.score = Math.round(combinedScore * 10) / 10;
  results.duration = Date.now() - startTime;

  return results;
}

module.exports = {
  runCognitiveFlow
};
