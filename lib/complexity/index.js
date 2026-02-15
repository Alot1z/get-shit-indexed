// Complexity Prediction System
// Main entry point exporting all complexity functions (Layer 1 + Layer 2)

const modelAwareness = require('./model-awareness.js');
const scorer = require('./scorer.js');
const cognitiveFlow = require('./cognitive-flow.js');
const tractatusCi = require('./tractatus-ci-phase.js');
const sequentialCg = require('./sequential-cg-phase.js');
const debugDc = require('./debug-dc-phase.js');

module.exports = {
  // Layer 1: Model Awareness
  ...modelAwareness,
  
  // Layer 2: Scoring
  ...scorer,
  
  // Layer 2: Cognitive Flow (Main API)
  runCognitiveFlow: cognitiveFlow.runCognitiveFlow,
  ComplexityResult: cognitiveFlow.ComplexityResult,
  
  // Layer 2: Individual Phases (for testing/debugging)
  runStructurePhase: tractatusCi.runStructurePhase,
  runProcessPhase: sequentialCg.runProcessPhase,
  runLearningPhase: debugDc.runLearningPhase
};
