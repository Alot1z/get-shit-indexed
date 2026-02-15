// Layer 1: Model Awareness System
// Provides model detection and threshold loading without external dependencies

/**
 * Model specs cache (embedded, no external file dependency).
 * Contains context window and complexity thresholds for each model.
 */
const MODEL_SPECS = {
  'claude-sonnet-4-5-20250929': {
    context_window: 200000,
    safe_threshold: 50,
    warn_threshold: 80,
    split_threshold: 80
  },
  'claude-opus-4-6': {
    context_window: 200000,
    safe_threshold: 60,
    warn_threshold: 85,
    split_threshold: 85
  },
  'claude-haiku-4-5-20251001': {
    context_window: 200000,
    safe_threshold: 40,
    warn_threshold: 70,
    split_threshold: 70
  },
  'default': {
    context_window: 200000,
    safe_threshold: 50,
    warn_threshold: 80,
    split_threshold: 80
  }
};

/**
 * Track last model for change detection.
 * Persists across function calls within same session.
 */
let lastModelId = null;

/**
 * Detect the current Claude model using three fallback strategies.
 * Strategy 1: Environment variable CLAUDE_MODEL
 * Strategy 2: Parse from config.json executor_model field
 * Strategy 3: Default fallback to claude-sonnet-4-5-20250929
 *
 * @returns {Promise<string>} The detected model ID
 */
async function detectCurrentModel() {
  // Strategy 1: Environment variable
  if (process.env.CLAUDE_MODEL) {
    return process.env.CLAUDE_MODEL;
  }

  // Strategy 2: Config.json executor_model field
  try {
    const fs = require('fs').promises;
    const path = require('path');
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
 * Load model specifications from embedded cache.
 * Provides thresholds for complexity analysis.
 *
 * @param {string} modelId - The model identifier
 * @returns {Promise<object>} Model specifications with thresholds
 */
async function loadModelSpecs(modelId) {
  return MODEL_SPECS[modelId] || MODEL_SPECS['default'];
}

/**
 * Detect if model has changed since last call.
 * Logs change and updates internal tracking.
 *
 * @param {string} modelId - The current model ID
 * @returns {Promise<boolean>} True if model changed, false otherwise
 */
async function detectModelChange(modelId) {
  const changed = lastModelId !== null && lastModelId !== modelId;
  if (changed) {
    console.log(`[ModelAwareness] Model changed: ${lastModelId} → ${modelId}`);
  }
  lastModelId = modelId;
  return changed;
}

/**
 * Get complexity thresholds for current model.
 * Convenience function combining detection, specs loading, and change detection.
 *
 * @returns {Promise<object>} Object with safe_threshold, warn_threshold, split_threshold
 */
async function getModelThresholds() {
  const modelId = await detectCurrentModel();
  const specs = await loadModelSpecs(modelId);
  await detectModelChange(modelId);
  return specs;
}

module.exports = {
  detectCurrentModel,
  loadModelSpecs,
  detectModelChange,
  getModelThresholds
};
