/**
 * Mode Selector
 * Chooses enhancement intensity based on risk score and context
 * Integrates with complexity module for adaptive threshold selection
 */

// Import complexity thresholds for adaptive mode selection
let complexityThresholds = null;
try {
  const complexity = require('../complexity');
  complexityThresholds = complexity.THRESHOLDS;
} catch (e) {
  // Complexity module may not be available
}

const MODES = {
  NONE: 'none',           // Skip enhancement entirely
  LIGHTWEIGHT: 'light',   // Quick cleanup only
  STANDARD: 'standard',   // Normal enhancement
  COMPREHENSIVE: 'full'   // Full cognitive enhancement
};

const THRESHOLDS = {
  none: 10,       // Below 10 = skip
  light: 30,      // 10-30 = lightweight
  standard: 60,   // 30-60 = standard
  full: 100       // 60+ = comprehensive
};

const MODE_CONFIGS = {
  [MODES.NONE]: {
    thinking: false,
    templates: false,
    timeout: 0,
    description: 'No enhancement - simple prompts only'
  },
  [MODES.LIGHTWEIGHT]: {
    thinking: false,
    templates: true,
    timeout: 1000,
    description: 'Lightweight - template-based enhancement'
  },
  [MODES.STANDARD]: {
    thinking: true,
    templates: true,
    timeout: 3000,
    description: 'Standard - thinking + templates'
  },
  [MODES.COMPREHENSIVE]: {
    thinking: true,
    templates: true,
    timeout: 5000,
    description: 'Comprehensive - full cognitive enhancement'
  }
};

/**
 * Select enhancement mode based on risk score
 * Uses complexity thresholds when available for adaptive selection
 * @param {number} riskScore - Risk score 0-100
 * @param {object} options - Override options
 * @returns {string} Selected mode
 */
function selectMode(riskScore, options = {}) {
  // Handle override options
  if (options.forceMode) {
    const validModes = Object.values(MODES);
    return validModes.includes(options.forceMode) ? options.forceMode : MODES.NONE;
  }

  if (options.disableThinking) {
    return MODES.NONE;
  }

  // Ensure score is valid number
  const score = Math.max(0, Math.min(100, riskScore || 0));

  // Use complexity thresholds if available (adaptive)
  const thresholds = complexityThresholds || THRESHOLDS;

  // Threshold-based selection
  if (score < (thresholds.none || THRESHOLDS.none)) return MODES.NONE;
  if (score < (thresholds.light || THRESHOLDS.light)) return MODES.LIGHTWEIGHT;
  if (score < (thresholds.standard || THRESHOLDS.standard)) return MODES.STANDARD;
  return MODES.COMPREHENSIVE;
}

/**
 * Get configuration for a mode
 * @param {string} mode - Mode name
 * @returns {object} Mode configuration
 */
function getModeConfig(mode) {
  return MODE_CONFIGS[mode] || MODE_CONFIGS[MODES.NONE];
}

/**
 * Get all available modes
 * @returns {string[]} Array of mode names
 */
function getAvailableModes() {
  return Object.values(MODES);
}

/**
 * Check if mode requires thinking
 * @param {string} mode - Mode name
 * @returns {boolean} True if thinking required
 */
function requiresThinking(mode) {
  const config = getModeConfig(mode);
  return config.thinking === true;
}

/**
 * Get recommended mode for a given context
 * @param {object} context - Context object with prompt, taskType, etc.
 * @returns {string} Recommended mode
 */
function getRecommendedMode(context = {}) {
  const { taskType, isInteractive, hasHistory } = context;

  // Planning tasks benefit from comprehensive mode
  if (taskType === 'planning' || taskType === 'architecture') {
    return MODES.COMPREHENSIVE;
  }

  // Interactive mode with history can use standard
  if (isInteractive && hasHistory) {
    return MODES.STANDARD;
  }

  // Default to lightweight for unknown contexts
  return MODES.LIGHTWEIGHT;
}

/**
 * Get current thresholds (from complexity if available)
 * @returns {object} Current thresholds
 */
function getThresholds() {
  return complexityThresholds || THRESHOLDS;
}

module.exports = {
  selectMode,
  getModeConfig,
  getAvailableModes,
  requiresThinking,
  getRecommendedMode,
  getThresholds,
  MODES,
  THRESHOLDS,
  MODE_CONFIGS
};
