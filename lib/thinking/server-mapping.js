/**
 * Server Mapping for Thinking Mode Selection
 * 
 * Maps tool categories to thinking servers with mode variations.
 * Provides fallback logic when servers are unavailable.
 * 
 * Server Mappings:
 * - FILE_OPS → Sequential (step-by-step file reasoning)
 * - PROCESS_OPS → Sequential (process flow reasoning)
 * - CODE_OPS → Tractatus (logical code structure)
 * - GRAPH_OPS → Tractatus (relationship analysis)
 * - DEBUG_OPS → Debug (problem solving)
 * - COMPLEX_OPS → Combined (Tractatus + Sequential)
 */

const { CATEGORIES, MODE_VARIATIONS } = require('./categories');

// Server definitions with MCP tool names
const SERVERS = {
  SEQUENTIAL: {
    name: 'sequential',
    mcp_tool: 'mcp__sequential-thinking__sequentialthinking',
    description: 'Multi-step problem decomposition',
    strengths: ['step-by-step reasoning', 'process flows', 'file operations'],
    available: true // Could be dynamic based on MCP server status
  },
  TRACTATUS: {
    name: 'tractatus',
    mcp_tool: 'mcp__tractatus-thinking__tractatus_thinking',
    description: 'Logical structure analysis',
    strengths: ['code structure', 'relationships', 'architecture'],
    available: true
  },
  DEBUG: {
    name: 'debug',
    mcp_tool: 'mcp__debug-thinking__debug_thinking',
    description: 'Graph-based problem solving',
    strengths: ['debugging', 'problem solving', 'learning'],
    available: true
  }
};

// Primary server mapping for each category
const SERVER_MAPPING = {
  FILE_OPS: {
    primary: SERVERS.SEQUENTIAL,
    fallback: null, // No fallback for file ops
    reason: 'Step-by-step reasoning best for file operations'
  },
  PROCESS_OPS: {
    primary: SERVERS.SEQUENTIAL,
    fallback: null,
    reason: 'Process flow reasoning requires sequential thinking'
  },
  CODE_OPS: {
    primary: SERVERS.TRACTATUS,
    fallback: SERVERS.SEQUENTIAL,
    reason: 'Logical code structure analysis'
  },
  GRAPH_OPS: {
    primary: SERVERS.TRACTATUS,
    fallback: SERVERS.SEQUENTIAL,
    reason: 'Relationship analysis suits tractatus thinking'
  },
  DEBUG_OPS: {
    primary: SERVERS.DEBUG,
    fallback: SERVERS.TRACTATUS,
    reason: 'Problem solving is debug server specialty'
  },
  COMPLEX_OPS: {
    primary: 'COMBINED', // Special marker
    fallback: SERVERS.TRACTATUS,
    reason: 'Complex operations benefit from combined thinking'
  }
};

/**
 * Get primary server for a category
 * @param {string} categoryName - The category name
 * @returns {object|string} Server object or 'COMBINED' marker
 */
function getPrimaryServer(categoryName) {
  const mapping = SERVER_MAPPING[categoryName];
  return mapping?.primary || null;
}

/**
 * Get fallback server for a category
 * @param {string} categoryName - The category name
 * @returns {object|null} Server object or null
 */
function getFallbackServer(categoryName) {
  const mapping = SERVER_MAPPING[categoryName];
  return mapping?.fallback || null;
}

/**
 * Get server for a category with fallback logic
 * @param {string} categoryName - The category name
 * @param {object} options - Options for server selection
 * @param {boolean} options.useFallback - Whether to use fallback if primary unavailable
 * @param {boolean} options.checkAvailability - Whether to check server availability
 * @returns {object|null} Selected server or null
 */
function getServer(categoryName, options = {}) {
  const { useFallback = true, checkAvailability = false } = options;
  
  const primary = getPrimaryServer(categoryName);
  
  // Special case: COMBINED mode
  if (primary === 'COMBINED') {
    return {
      name: 'combined',
      servers: [SERVERS.TRACTATUS, SERVERS.SEQUENTIAL],
      description: 'Combined Tractatus + Sequential thinking',
      mcp_tool: null // No single tool
    };
  }
  
  // Check availability if requested
  if (checkAvailability && !primary.available) {
    if (useFallback) {
      const fallback = getFallbackServer(categoryName);
      if (fallback && fallback.available) {
        return fallback;
      }
    }
    return null;
  }
  
  return primary;
}

/**
 * Get server mapping reason for a category
 * @param {string} categoryName - The category name
 * @returns {string} Reason for the mapping
 */
function getMappingReason(categoryName) {
  const mapping = SERVER_MAPPING[categoryName];
  return mapping?.reason || 'No mapping reason specified';
}

/**
 * Get all available servers
 * @returns {object} All server definitions
 */
function getAllServers() {
  return SERVERS;
}

/**
 * Check if a server is available
 * @param {string} serverName - The server name (sequential, tractatus, debug)
 * @returns {boolean} True if server is available
 */
function isServerAvailable(serverName) {
  const server = SERVERS[serverName.toUpperCase()];
  return server?.available || false;
}

/**
 * Get mode configuration for a category and variation
 * @param {string} categoryName - The category name
 * @param {string} variation - Mode variation (lightweight, standard, comprehensive)
 * @returns {object|null} Mode configuration or null
 */
function getModeConfig(categoryName, variation = 'standard') {
  const variations = MODE_VARIATIONS[categoryName];
  return variations?.[variation] || null;
}

module.exports = {
  SERVERS,
  SERVER_MAPPING,
  getPrimaryServer,
  getFallbackServer,
  getServer,
  getMappingReason,
  getAllServers,
  isServerAvailable,
  getModeConfig
};
