/**
 * MCP Coordinator
 * 
 * Coordinates MCP tool selection across all GSI features.
 * Uses pattern predictions, complexity prediction, and server health for optimal selection.
 */

const { getRegistry, getFeature } = require('./feature-registry');

// Server health status
const serverHealth = new Map();
const HEALTH_CHECK_INTERVAL = 60000; // 1 minute

// Fallback chains for each server
const FALLBACK_CHAINS = {
  'desktop-commander': ['native'],
  'code-index-mcp': ['native-grep', 'native-glob'],
  'sequential-thinking': ['tractatus-thinking', 'debug-thinking', 'none'],
  'tractatus-thinking': ['sequential-thinking', 'debug-thinking', 'none'],
  'debug-thinking': ['sequential-thinking', 'tractatus-thinking', 'none']
};

// Tool-to-server mapping
const TOOL_SERVER_MAP = {
  // Desktop Commander tools
  'mcp__desktop-commander__read_file': 'desktop-commander',
  'mcp__desktop-commander__write_file': 'desktop-commander',
  'mcp__desktop-commander__edit_block': 'desktop-commander',
  'mcp__desktop-commander__list_directory': 'desktop-commander',
  'mcp__desktop-commander__read_multiple_files': 'desktop-commander',
  'mcp__desktop-commander__start_process': 'desktop-commander',
  'mcp__desktop-commander__start_search': 'desktop-commander',
  'mcp__desktop-commander__get_file_info': 'desktop-commander',
  
  // Code-Index MCP tools
  'mcp__code-index-mcp__search_code_advanced': 'code-index-mcp',
  'mcp__code-index-mcp__find_files': 'code-index-mcp',
  'mcp__code-index-mcp__get_file_summary': 'code-index-mcp',
  'mcp__code-index-mcp__get_symbol_body': 'code-index-mcp',
  'mcp__code-index-mcp__build_deep_index': 'code-index-mcp',
  'mcp__code-index-mcp__set_project_path': 'code-index-mcp',
  'mcp__code-index-mcp__refresh_index': 'code-index-mcp',
  
  // Thinking tools
  'mcp__sequential-thinking__sequentialthinking': 'sequential-thinking',
  'mcp__tractatus-thinking__tractatus_thinking': 'tractatus-thinking',
  'mcp__debug-thinking__debug_thinking': 'debug-thinking'
};

/**
 * Initialize server health status
 */
function initializeServerHealth() {
  const servers = ['desktop-commander', 'code-index-mcp',
                   'sequential-thinking', 'tractatus-thinking', 'debug-thinking'];
  
  for (const server of servers) {
    serverHealth.set(server, {
      available: true,
      lastChecked: null,
      errorCount: 0,
      lastError: null
    });
  }
}

/**
 * Check server health
 * @param {string} server Server name
 * @returns {boolean} Is healthy
 */
function checkServerHealth(server) {
  const health = serverHealth.get(server);
  if (!health) {
    return false;
  }
  
  // If error count is high, consider unhealthy
  if (health.errorCount > 3) {
    return false;
  }
  
  return health.available;
}

/**
 * Mark server as unavailable
 * @param {string} server Server name
 * @param {string} error Error message
 */
function markServerUnavailable(server, error) {
  const health = serverHealth.get(server);
  if (health) {
    health.available = false;
    health.errorCount++;
    health.lastError = error;
    health.lastChecked = new Date().toISOString();
  }
}

/**
 * Mark server as available
 * @param {string} server Server name
 */
function markServerAvailable(server) {
  const health = serverHealth.get(server);
  if (health) {
    health.available = true;
    health.errorCount = 0;
    health.lastError = null;
    health.lastChecked = new Date().toISOString();
  }
}

/**
 * Get fallback server
 * @param {string} server Original server
 * @returns {string|null} Fallback server or null
 */
function getFallbackServer(server) {
  const chain = FALLBACK_CHAINS[server];
  if (!chain) {
    return null;
  }
  
  for (const fallback of chain) {
    if (fallback === 'native' || fallback === 'native-grep' || fallback === 'native-glob' || fallback === 'none') {
      return fallback;
    }
    
    if (checkServerHealth(fallback)) {
      return fallback;
    }
  }
  
  return null;
}

/**
 * Select optimal MCP tool for an operation
 * @param {string} operationType Operation type (file, search, graph, think)
 * @param {Object} context Operation context
 * @returns {Object} Tool selection result
 */
function selectOptimalTool(operationType, context = {}) {
  const result = {
    recommended: null,
    server: null,
    fallback: null,
    reasoning: [],
    tokenSavings: 0
  };
  
  // Check pattern predictions
  if (context.patternPrediction) {
    result.reasoning.push(`Pattern prediction: ${context.patternPrediction}`);
  }
  
  // Check complexity prediction
  const complexity = context.complexity || 0;
  result.reasoning.push(`Complexity score: ${complexity}`);
  
  switch (operationType) {
    case 'file':
      result.recommended = 'mcp__desktop-commander__read_file';
      result.server = 'desktop-commander';
      result.tokenSavings = 80; // 80% savings vs native
      
      // Use batch for multiple files
      if (context.fileCount && context.fileCount > 1) {
        result.recommended = 'mcp__desktop-commander__read_multiple_files';
        result.reasoning.push('Batch operation for multiple files');
      }
      break;
      
    case 'search':
      result.recommended = 'mcp__code-index-mcp__search_code_advanced';
      result.server = 'code-index-mcp';
      result.tokenSavings = 70;
      
      // Fall back to DC search if CI unavailable
      if (!checkServerHealth('code-index-mcp')) {
        result.recommended = 'mcp__desktop-commander__start_search';
        result.server = 'desktop-commander';
        result.fallback = true;
        result.reasoning.push('Code-Index unavailable, using DC search');
      }
      break;
      
    case 'graph':
      // Use code-index-mcp for symbol analysis (CodeGraphContext removed)
      result.recommended = 'mcp__code-index-mcp__get_symbol_body';
      result.server = 'code-index-mcp';
      result.tokenSavings = 85;
      
      // Check if CI is healthy
      if (!checkServerHealth('code-index-mcp')) {
        result.fallback = 'native';
        result.reasoning.push('Code-Index unavailable, using native read');
      }
      break;
      
    case 'think-sequential':
      result.recommended = 'mcp__sequential-thinking__sequentialthinking';
      result.server = 'sequential-thinking';
      result.tokenSavings = 50;
      
      if (!checkServerHealth('sequential-thinking')) {
        result.fallback = getFallbackServer('sequential-thinking');
        result.reasoning.push(`Sequential-thinking unavailable, fallback: ${result.fallback}`);
      }
      break;
      
    case 'think-tractatus':
      result.recommended = 'mcp__tractatus-thinking__tractatus_thinking';
      result.server = 'tractatus-thinking';
      result.tokenSavings = 50;
      
      if (!checkServerHealth('tractatus-thinking')) {
        result.fallback = getFallbackServer('tractatus-thinking');
        result.reasoning.push(`Tractatus-thinking unavailable, fallback: ${result.fallback}`);
      }
      break;
      
    case 'think-debug':
      result.recommended = 'mcp__debug-thinking__debug_thinking';
      result.server = 'debug-thinking';
      result.tokenSavings = 50;
      
      if (!checkServerHealth('debug-thinking')) {
        result.fallback = getFallbackServer('debug-thinking');
        result.reasoning.push(`Debug-thinking unavailable, fallback: ${result.fallback}`);
      }
      break;
      
    default:
      result.recommended = 'native';
      result.reasoning.push('Unknown operation type, using native tools');
  }
  
  // Adjust based on complexity
  if (complexity > 60) {
    result.reasoning.push('High complexity - consider batch operations');
  }
  
  return result;
}

/**
 * Get optimal tool chain for an operation sequence
 * @param {Array} operations Array of operation types
 * @param {Object} context Shared context
 * @returns {Array} Optimal tool chain
 */
function getOptimalToolChain(operations, context = {}) {
  const chain = [];
  
  for (const op of operations) {
    const selection = selectOptimalTool(op.type || op, {
      ...context,
      ...op.context
    });
    
    chain.push({
      operation: op,
      tool: selection.recommended,
      server: selection.server,
      fallback: selection.fallback,
      tokenSavings: selection.tokenSavings
    });
  }
  
  // Calculate total token savings
  const totalSavings = chain.reduce((sum, item) => sum + item.tokenSavings, 0);
  
  return {
    chain,
    totalTokenSavings: totalSavings,
    averageSavings: totalSavings / chain.length
  };
}

/**
 * Get server for a tool
 * @param {string} tool Tool name
 * @returns {string|null} Server name
 */
function getServerForTool(tool) {
  return TOOL_SERVER_MAP[tool] || null;
}

/**
 * Get all available servers
 * @returns {Array} Available server names
 */
function getAvailableServers() {
  const available = [];
  
  for (const [server, health] of serverHealth.entries()) {
    if (health.available && health.errorCount < 3) {
      available.push(server);
    }
  }
  
  return available;
}

/**
 * Get health report
 * @returns {Object} Health report
 */
function getHealthReport() {
  const report = {
    timestamp: new Date().toISOString(),
    servers: {},
    summary: {
      total: serverHealth.size,
      available: 0,
      unavailable: 0
    }
  };
  
  for (const [server, health] of serverHealth.entries()) {
    report.servers[server] = { ...health };
    
    if (health.available && health.errorCount < 3) {
      report.summary.available++;
    } else {
      report.summary.unavailable++;
    }
  }
  
  return report;
}

// Initialize on load
initializeServerHealth();

module.exports = {
  selectOptimalTool,
  getOptimalToolChain,
  getServerForTool,
  getAvailableServers,
  checkServerHealth,
  markServerAvailable,
  markServerUnavailable,
  getFallbackServer,
  getHealthReport,
  TOOL_SERVER_MAP,
  FALLBACK_CHAINS
};
