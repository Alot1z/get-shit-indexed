/**
 * Command Thinking Modes
 * 
 * Defines thinking modes for different command types.
 * Maps commands to appropriate thinking intensity levels.
 */

// Thinking mode definitions
const MODES = {
  COMPREHENSIVE: {
    name: 'COMPREHENSIVE',
    description: 'All 3 thinking servers, full 7-BMAD validation',
    servers: ['sequential', 'tractatus', 'debug'],
    bmadEnabled: true,
    timeoutMultiplier: 3,
    useCase: 'Complex planning and architectural decisions'
  },
  
  STANDARD: {
    name: 'STANDARD',
    description: 'Sequential + Debug thinking, partial BMAD',
    servers: ['sequential', 'debug'],
    bmadEnabled: true,
    timeoutMultiplier: 2,
    useCase: 'Standard execution workflows'
  },
  
  LIGHTWEIGHT: {
    name: 'LIGHTWEIGHT',
    description: 'Sequential thinking only, no BMAD',
    servers: ['sequential'],
    bmadEnabled: false,
    timeoutMultiplier: 1,
    useCase: 'Quick operations and queries'
  },
  
  NONE: {
    name: 'NONE',
    description: 'Skip thinking entirely',
    servers: [],
    bmadEnabled: false,
    timeoutMultiplier: 0,
    useCase: 'Simple commands and help systems'
  }
};

// Command to mode mapping
const COMMAND_MODE_MAP = {
  // Planning commands - COMPREHENSIVE
  'plan-phase': 'COMPREHENSIVE',
  'discuss-phase': 'COMPREHENSIVE',
  'create-phase': 'COMPREHENSIVE',
  
  // Execution commands - STANDARD
  'execute-phase': 'STANDARD',
  'execute-plan': 'STANDARD',
  'execute-task': 'STANDARD',
  
  // Workflow commands - STANDARD
  'verify-phase': 'STANDARD',
  'complete-phase': 'STANDARD',
  'commit-phase': 'STANDARD',
  
  // Quick operations - LIGHTWEIGHT
  'status': 'LIGHTWEIGHT',
  'list-phases': 'LIGHTWEIGHT',
  'list-plans': 'LIGHTWEIGHT',
  'show-plan': 'LIGHTWEIGHT',
  'progress': 'LIGHTWEIGHT',
  
  // Help/info - NONE
  'help': 'NONE',
  '--help': 'NONE',
  '-h': 'NONE',
  'version': 'NONE',
  '--version': 'NONE'
};

// Pattern-based mode mapping (for commands not explicitly listed)
const COMMAND_PATTERNS = [
  {
    pattern: /^(list|show|get|info)/,
    mode: 'LIGHTWEIGHT',
    reason: 'Query commands use lightweight thinking'
  },
  {
    pattern: /^(plan|design|architect)/,
    mode: 'COMPREHENSIVE',
    reason: 'Planning commands use comprehensive thinking'
  },
  {
    pattern: /^(execute|run|do|perform)/,
    mode: 'STANDARD',
    reason: 'Execution commands use standard thinking'
  },
  {
    pattern: /^(help|version|--help|-h)$/,
    mode: 'NONE',
    reason: 'Help commands skip thinking'
  }
];

/**
 * Get thinking mode for a command
 * @param {string} commandName - Command name
 * @returns {string} Mode name (COMPREHENSIVE, STANDARD, LIGHTWEIGHT, NONE)
 */
function getModeForCommand(commandName) {
  // Check explicit mapping first
  if (COMMAND_MODE_MAP[commandName]) {
    return COMMAND_MODE_MAP[commandName];
  }
  
  // Check pattern-based mapping
  for (const { pattern, mode } of COMMAND_PATTERNS) {
    if (pattern.test(commandName)) {
      return mode;
    }
  }
  
  // Default to LIGHTWEIGHT for unknown commands
  return 'LIGHTWEIGHT';
}

/**
 * Get mode configuration
 * @param {string} modeName - Mode name
 * @returns {object} Mode configuration
 */
function getModeConfig(modeName) {
  return MODES[modeName] || MODES.LIGHTWEIGHT;
}

/**
 * Check if mode is valid
 * @param {string} modeName - Mode name to check
 * @returns {boolean} True if mode exists
 */
function isValidMode(modeName) {
  return Object.keys(MODES).includes(modeName);
}

/**
 * Get all available modes
 * @returns {object} All mode definitions
 */
function getAllModes() {
  return { ...MODES };
}

/**
 * Set custom mode for a command
 * @param {string} commandName - Command name
 * @param {string} modeName - Mode name
 */
function setCommandMode(commandName, modeName) {
  if (!isValidMode(modeName)) {
    throw new Error(`Invalid mode: ${modeName}. Valid modes: ${Object.keys(MODES).join(', ')}`);
  }
  
  COMMAND_MODE_MAP[commandName] = modeName;
}

/**
 * Reset command mode to default
 * @param {string} commandName - Command name
 */
function resetCommandMode(commandName) {
  delete COMMAND_MODE_MAP[commandName];
}

/**
 * Get all command mappings
 * @returns {object} Copy of command mode map
 */
function getCommandMappings() {
  return { ...COMMAND_MODE_MAP };
}

module.exports = {
  MODES,
  getModeForCommand,
  getModeConfig,
  isValidMode,
  getAllModes,
  setCommandMode,
  resetCommandMode,
  getCommandMappings
};
