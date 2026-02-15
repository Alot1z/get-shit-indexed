/**
 * MCP Thinking Server Connector
 * 
 * Handles communication with thinking MCP servers (sequential, tractatus, debug).
 * Provides timeout handling, error recovery, and graceful degradation.
 */

/**
 * Call Sequential Thinking server
 * @param {string} prompt - Thinking prompt
 * @param {object} options - Options
 * @param {number} options.timeout - Timeout in ms (default: 3000)
 * @param {number} options.maxThoughts - Maximum thoughts (default: 10)
 * @returns {Promise<object>} Thinking result
 */
async function callSequential(prompt, options = {}) {
  const { timeout = 3000, maxThoughts = 10 } = options;
  
  try {
    // Import MCP tool dynamically
    const mcpTool = globalThis.mcp__sequentialthinking__sequentialthinking;
    
    if (!mcpTool) {
      throw new Error('Sequential thinking server not available');
    }
    
    // Call with timeout
    const result = await withTimeout(
      mcpTool({
        thought: prompt,
        thoughtNumber: 1,
        totalThoughts: maxThoughts,
        nextThoughtNeeded: true
      }),
      timeout
    );
    
    return {
      success: true,
      server: 'sequential',
      result
    };
  } catch (error) {
    return {
      success: false,
      server: 'sequential',
      error: error.message,
      degraded: true
    };
  }
}

/**
 * Call Tractatus Thinking server
 * @param {string} prompt - Thinking prompt
 * @param {object} options - Options
 * @param {number} options.timeout - Timeout in ms (default: 3000)
 * @param {number} options.depth - Analysis depth (default: 5)
 * @returns {Promise<object>} Thinking result
 */
async function callTractatus(prompt, options = {}) {
  const { timeout = 3000, depth = 5 } = options;
  
  try {
    // Import MCP tool dynamically
    const mcpTool = globalThis.mcp__tractatusthinking__tractatus_thinking;
    
    if (!mcpTool) {
      throw new Error('Tractatus thinking server not available');
    }
    
    // Call with timeout
    const result = await withTimeout(
      mcpTool({
        operation: 'start',
        concept: prompt,
        depth_limit: depth
      }),
      timeout
    );
    
    return {
      success: true,
      server: 'tractatus',
      result
    };
  } catch (error) {
    return {
      success: false,
      server: 'tractatus',
      error: error.message,
      degraded: true
    };
  }
}

/**
 * Call Debug Thinking server
 * @param {string} prompt - Thinking prompt
 * @param {object} options - Options
 * @param {number} options.timeout - Timeout in ms (default: 3000)
 * @param {string} options.action - Debug action (create, connect, query)
 * @returns {Promise<object>} Thinking result
 */
async function callDebug(prompt, options = {}) {
  const { timeout = 3000, action = 'create' } = options;
  
  try {
    // Import MCP tool dynamically
    const mcpTool = globalThis.mcp__debugthinking__debug_thinking;
    
    if (!mcpTool) {
      throw new Error('Debug thinking server not available');
    }
    
    // Prepare parameters based on action
    const params = {
      action,
      nodeType: 'problem',
      content: prompt
    };
    
    // Call with timeout
    const result = await withTimeout(
      mcpTool(params),
      timeout
    );
    
    return {
      success: true,
      server: 'debug',
      result
    };
  } catch (error) {
    return {
      success: false,
      server: 'debug',
      error: error.message,
      degraded: true
    };
  }
}

/**
 * Execute promise with timeout
 * @param {Promise} promise - Promise to execute
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise} Promise with timeout
 */
function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ]);
}

/**
 * Check if server is available
 * @param {string} serverType - Server type (sequential, tractatus, debug)
 * @returns {boolean} True if available
 */
function isServerAvailable(serverType) {
  const tools = {
    sequential: globalThis.mcp__sequentialthinking__sequentialthinking,
    tractatus: globalThis.mcp__tractatusthinking__tractatus_thinking,
    debug: globalThis.mcp__debugthinking__debug_thinking
  };
  
  return !!tools[serverType];
}

/**
 * Get all available servers
 * @returns {Array<string>} Available server types
 */
function getAvailableServers() {
  return ['sequential', 'tractatus', 'debug'].filter(isServerAvailable);
}

module.exports = {
  callSequential,
  callTractatus,
  callDebug,
  isServerAvailable,
  getAvailableServers
};
