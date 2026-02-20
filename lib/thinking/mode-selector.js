/**
 * Mode Selection Logic
 * 
 * Implements intelligent thinking mode selection based on tool and context.
 * Considers file size, operation count, error state, and configuration overrides.
 * 
 * Selection Factors:
 * - File size: small → lightweight, large → comprehensive
 * - Operation count: single → lightweight, batch → standard
 * - Error state: error → comprehensive debug mode
 * - Configuration: explicit override support
 */

const { getToolCategory } = require('./categories');
const { getServer, getModeConfig, getMappingReason } = require('./server-mapping');

// Configuration overrides (can be set externally)
const config = {
  forceMode: null, // Force specific mode (lightweight, standard, comprehensive)
  forceServer: null, // Force specific server (sequential, tractatus, debug)
  disableThinking: false, // Disable thinking entirely
  timeoutMultiplier: 1.0 // Multiplier for timeouts
};

/**
 * Determine mode variation based on context
 * @param {object} context - Operation context
 * @param {number} context.fileSize - File size in bytes
 * @param {number} context.operationCount - Number of operations
 * @param {boolean} context.isError - Whether this is an error state
 * @param {string} context.complexity - Manual complexity hint (low, medium, high)
 * @returns {string} Mode variation (lightweight, standard, comprehensive)
 */
function determineModeVariation(context = {}) {
  const {
    fileSize = 0,
    operationCount = 1,
    isError = false,
    complexity = null
  } = context;
  
  // Error state always gets comprehensive mode
  if (isError) {
    return 'comprehensive';
  }
  
  // Manual complexity hint takes precedence
  if (complexity) {
    const complexityMap = {
      low: 'lightweight',
      medium: 'standard',
      high: 'comprehensive'
    };
    return complexityMap[complexity] || 'standard';
  }
  
  // Automatic selection based on context factors
  let score = 0;

  // File size factor (0-5 points)
  if (fileSize > 1000000) score += 5; // > 1MB
  else if (fileSize > 100000) score += 3; // > 100KB
  else if (fileSize > 10000) score += 1; // > 10KB

  // Operation count factor (0-5 points) - batch operations are complex
  if (operationCount > 10) score += 5; // Large batch → comprehensive
  else if (operationCount > 5) score += 3;
  else if (operationCount > 1) score += 1;
  
  // Map score to mode
  if (score >= 5) return 'comprehensive';
  if (score >= 3) return 'standard';
  return 'lightweight';
}

/**
 * Select thinking mode for a tool operation
 * @param {string} toolName - The tool name
 * @param {object} context - Operation context
 * @param {number} context.fileSize - File size in bytes
 * @param {number} context.operationCount - Number of operations
 * @param {boolean} context.isError - Whether this is an error state
 * @param {string} context.complexity - Manual complexity hint
 * @returns {object|null} Mode configuration with server, variation, timeout, etc.
 */
function selectMode(toolName, context = {}) {
  // Check if thinking is disabled
  if (config.disableThinking) {
    return {
      enabled: false,
      mode: 'disabled',
      reason: 'Thinking disabled by configuration'
    };
  }
  
  // Get tool category
  const category = getToolCategory(toolName);
  if (!category) {
    return {
      enabled: false,
      reason: `Tool '${toolName}' not categorized`
    };
  }
  
  // Get server for category
  const server = getServer(category.name, {
    useFallback: true,
    checkAvailability: true
  });
  
  if (!server) {
    return {
      enabled: false,
      reason: `No available server for category '${category.name}'`
    };
  }
  
  // Determine mode variation
  const variation = config.forceMode || determineModeVariation(context);
  
  // Get mode configuration
  const modeConfig = getModeConfig(category.name, variation);
  if (!modeConfig) {
    return {
      enabled: false,
      reason: `No mode configuration for '${category.name}' / '${variation}'`
    };
  }
  
  // Apply timeout multiplier
  const timeout = modeConfig.timeout * config.timeoutMultiplier;
  
  // Apply server override if set
  const selectedServer = config.forceServer 
    ? { ...server, name: config.forceServer }
    : server;
  
  return {
    enabled: true,
    tool: toolName,
    category: category.name,
    server: selectedServer.name,
    serverType: server.name === 'combined' ? 'combined' : 'single',
    mcpTool: selectedServer.mcp_tool,
    variation,
    timeout,
    thoughtDepth: modeConfig.thoughtDepth,
    description: modeConfig.description,
    mappingReason: getMappingReason(category.name),
    context: {
      fileSize: context.fileSize || 0,
      operationCount: context.operationCount || 1,
      isError: context.isError || false
    }
  };
}

/**
 * Configure mode selector
 * @param {object} options - Configuration options
 * @param {string} options.forceMode - Force specific mode
 * @param {string} options.forceServer - Force specific server
 * @param {boolean} options.disableThinking - Disable thinking
 * @param {number} options.timeoutMultiplier - Timeout multiplier
 */
function configure(options = {}) {
  if (options.forceMode !== undefined) {
    config.forceMode = options.forceMode;
  }
  if (options.forceServer !== undefined) {
    config.forceServer = options.forceServer;
  }
  if (options.disableThinking !== undefined) {
    config.disableThinking = options.disableThinking;
  }
  if (options.timeoutMultiplier !== undefined) {
    config.timeoutMultiplier = options.timeoutMultiplier;
  }
}

/**
 * Reset configuration to defaults
 */
function resetConfiguration() {
  config.forceMode = null;
  config.forceServer = null;
  config.disableThinking = false;
  config.timeoutMultiplier = 1.0;
}

/**
 * Get current configuration
 * @returns {object} Current configuration
 */
function getConfiguration() {
  return { ...config };
}

module.exports = {
  selectMode,
  determineModeVariation,
  configure,
  resetConfiguration,
  getConfiguration
};
