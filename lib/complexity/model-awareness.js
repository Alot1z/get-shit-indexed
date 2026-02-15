// Layer 1: Model Awareness System
// Provides model detection and threshold loading without external dependencies

/**
 * Detect the current Claude model using three fallback strategies.
 * Strategy 1: Environment variable CLAUDE_MODEL
 * Strategy 2: Parse from config.json executor_model field
 * Strategy 3: Default fallback to claude-sonnet-4-5-20250929
 *
 * @returns {Promise<string>} The detected model ID
 */
async function detectCurrentModel() {
  const fs = require('fs').promises;
  const path = require('path');

  // Strategy 1: Environment variable
  if (process.env.CLAUDE_MODEL) {
    return process.env.CLAUDE_MODEL;
  }

  // Strategy 2: Config.json executor_model field
  try {
    const configPath = path.join(process.cwd(), '.planning', 'config.json');
    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    if (config.executor_model) {
      // Map short names to full model IDs
      const modelMap = {
        'haiku': 'claude-haiku-4-5-20251001',
        'sonnet': 'claude-sonnet-4-5-20250929',
        'opus': 'claude-opus-4-6'
      };

      const modelKey = config.executor_model.toLowerCase();
      return modelMap[modelKey] || config.executor_model;
    }
  } catch (error) {
    // Silently fall through to default
  }

  // Strategy 3: Default fallback
  return 'claude-sonnet-4-5-20250929';
}

async function loadModelSpecs(modelId) {
  // Load from .planning/model-specs.json
  return {};
}

async function detectModelChange(modelId) {
  // Track model changes in .planning/.last-model
  return false;
}

async function getModelThresholds() {
  // Convenience function combining all operations
  return {};
}

module.exports = {
  detectCurrentModel,
  loadModelSpecs,
  detectModelChange,
  getModelThresholds
};
