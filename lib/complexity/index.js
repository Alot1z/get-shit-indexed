// Complexity Prediction System
// Main entry point exporting all complexity functions

const modelAwareness = require('./model-awareness.js');
const scorer = require('./scorer.js');

module.exports = {
  // Layer 1: Model Awareness
  ...modelAwareness,
  // Layer 2: Complexity Scoring
  ...scorer
};
