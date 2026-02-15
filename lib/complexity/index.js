// Layer 1: Model Awareness System
// Main entry point exporting all model awareness functions

const {
  detectCurrentModel,
  loadModelSpecs,
  detectModelChange,
  getModelThresholds
} = require('./model-awareness.js');

module.exports = {
  detectCurrentModel,
  loadModelSpecs,
  detectModelChange,
  getModelThresholds
};
