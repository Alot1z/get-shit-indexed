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

/**
 * Load model specifications from local cache file.
 * Falls back to default specs if model not found or file missing.
 *
 * @param {string} modelId - The model ID to load specs for
 * @returns {Promise<Object>} Model specifications with thresholds
 */
async function loadModelSpecs(modelId) {
  const fs = require('fs').promises;
  const path = require('path');

  const defaultSpecs = {
    context_window: 200000,
    safe_threshold: 40,
    warn_threshold: 70,
    split_threshold: 70,
    avg_token_per_file: 3000,
    avg_token_per_task: 15000
  };

  try {
    const specsPath = path.join(process.cwd(), '.planning', 'model-specs.json');
    const specsContent = await fs.readFile(specsPath, 'utf-8');
    const allSpecs = JSON.parse(specsContent);

    return allSpecs[modelId] || allSpecs['default'] || defaultSpecs;
  } catch (error) {
    // File not found or invalid JSON - return default specs
    return defaultSpecs;
  }
}

/**
 * Detect and track model changes across sessions.
 * Reads .planning/.last-model, compares with current model,
 * logs change if different, and updates tracking file.
 *
 * @param {string} currentModel - The current model ID
 * @returns {Promise<boolean>} True if model changed, false otherwise
 */
async function detectModelChange(currentModel) {
  const fs = require('fs').promises;
  const path = require('path');

  const lastModelPath = path.join(process.cwd(), '.planning', '.last-model');

  try {
    // Read last model if exists
    let lastModel = null;
    try {
      lastModel = await fs.readFile(lastModelPath, 'utf-8');
      lastModel = lastModel.trim();
    } catch (error) {
      // File doesn't exist yet - first run
    }

    // Check if model changed
    if (lastModel && lastModel !== currentModel) {
      console.log(`Model changed: ${lastModel} -> ${currentModel}`);
    }

    // Update tracking file
    await fs.writeFile(lastModelPath, currentModel, 'utf-8');

    // Return true if changed (or first run), false if same
    return !lastModel || lastModel !== currentModel;
  } catch (error) {
    // Error reading/writing - silently continue
    return false;
  }
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
