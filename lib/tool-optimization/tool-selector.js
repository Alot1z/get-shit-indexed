/**
 * Tool Selector
 * 
 * Intelligent tool selection based on agent context and operation requirements.
 * Provides real-time recommendations for optimal tool usage.
 * 
 * @module lib/tool-optimization/tool-selector
 */

const { TOOL_REGISTRY, AGENT_TOOL_MAP, TOOL_CATEGORIES } = require('./tool-registry');

/**
 * Tool Selector Class
 * Provides intelligent tool selection for GSI agents
 */
class ToolSelector {
  constructor(agentName) {
    this.agentName = agentName;
    this.agentTools = AGENT_TOOL_MAP[agentName] || { primary: [], thinking: [], secondary: [] };
    this.usageHistory = [];
  }
  
  /**
   * Get recommended tool for an operation
   * @param {string} operation - Operation type
   * @param {object} context - Operation context
   * @returns {object} Recommendation
   */
  select(operation, context = {}) {
    const candidates = this.findCandidates(operation, context);
    const ranked = this.rankByEfficiency(candidates, context);
    
    // Record for learning
    this.recordUsage(ranked[0], operation, context);
    
    return {
      recommended: ranked[0],
      alternatives: ranked.slice(1, 3),
      savings: this.calculateSavings(ranked[0], context),
      reason: this.getReason(ranked[0], operation, context)
    };
  }
  
  /**
   * Find candidate tools for an operation
   * @param {string} operation - Operation type
   * @param {object} context - Context
   * @returns {Array} Candidate tools
   */
  findCandidates(operation, context) {
    const candidates = [];
    
    // Check if agent has this operation in its toolkit
    const allAgentTools = [
      ...this.agentTools.primary,
      ...this.agentTools.thinking,
      ...this.agentTools.secondary
    ];
    
    for (const [toolName, toolInfo] of Object.entries(TOOL_REGISTRY)) {
      // Skip blocked tools
      if (toolInfo.blocked) continue;
      
      // Check if tool matches operation
      if (this.toolMatchesOperation(toolName, operation, context)) {
        // Check if agent can use this tool
        if (allAgentTools.includes(toolName) || toolInfo.agents?.includes(this.agentName)) {
          candidates.push({ name: toolName, ...toolInfo });
        }
      }
    }
    
    return candidates;
  }
  
  /**
   * Check if tool matches operation type
   * @param {string} toolName - Tool name
   * @param {string} operation - Operation type
   * @param {object} context - Context
   * @returns {boolean} Match result
   */
  toolMatchesOperation(toolName, operation, context) {
    const operationPatterns = {
      read: ['read_file', 'read_multiple_files', 'get_symbol_body', 'get_file_summary'],
      write: ['write_file'],
      edit: ['edit_block'],
      search: ['search_code_advanced', 'find_files', 'find_code', 'start_search'],
      symbol: ['get_symbol_body', 'get_file_summary'],
      command: ['start_process', 'interact_with_process', 'read_process_output'],
      directory: ['list_directory', 'get_file_info'],
      analyze: ['analyze_code_relationships', 'find_most_complex_functions', 'find_dead_code', 'calculate_cyclomatic_complexity'],
      thinking: ['sequentialthinking', 'tractatus_thinking', 'debug_thinking'],
      external: ['get-library-docs', 'resolve-library-id', 'ask_question']
    };
    
    const patterns = operationPatterns[operation] || [];
    return patterns.some(pattern => toolName.includes(pattern));
  }
  
  /**
   * Rank candidates by efficiency
   * @param {Array} candidates - Candidate tools
   * @param {object} context - Context
   * @returns {Array} Ranked tools
   */
  rankByEfficiency(candidates, context) {
    return candidates.sort((a, b) => {
      // Priority first (lower is better)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      
      // Then by savings (parse percentage)
      const savingsA = this.parseSavings(a.savings);
      const savingsB = this.parseSavings(b.savings);
      return savingsB - savingsA;
    });
  }
  
  /**
   * Parse savings percentage string
   * @param {string} savings - Savings string (e.g., "80-90%")
   * @returns {number} Average percentage
   */
  parseSavings(savings) {
    if (!savings) return 0;
    if (savings === 'cognitive' || savings === 'N/A') return 50; // Medium priority
    
    const match = savings.match(/(\d+)(?:-(\d+))?%?/);
    if (!match) return 0;
    
    const min = parseInt(match[1], 10);
    const max = match[2] ? parseInt(match[2], 10) : min;
    return (min + max) / 2;
  }
  
  /**
   * Calculate token savings
   * @param {object} tool - Selected tool
   * @param {object} context - Context
   * @returns {object} Savings info
   */
  calculateSavings(tool, context) {
    const baseSavings = tool.savings || '0%';
    
    // Enhanced calculation based on context
    if (context.fileCount && context.fileCount > 1 && tool.name?.includes('multiple')) {
      const nativeTokens = context.fileCount * 15000;
      const mcpTokens = 5000 + (context.fileCount * 500);
      const savings = Math.round((1 - mcpTokens / nativeTokens) * 100);
      return `${savings}%`;
    }
    
    return baseSavings;
  }
  
  /**
   * Get reason for recommendation
   * @param {object} tool - Selected tool
   * @param {string} operation - Operation type
   * @param {object} context - Context
   * @returns {string} Reason
   */
  getReason(tool, operation, context) {
    const reasons = {
      read_multiple_files: 'Batch reading reduces protocol overhead by 80-90%',
      read_file: 'MCP tool has lower protocol overhead than native Read',
      write_file: 'MCP tool provides chunking and lower overhead',
      edit_block: 'Surgical replacement with atomic operations',
      search_code_advanced: 'Indexed search with context lines included',
      find_files: 'Indexed file discovery, no filesystem scan needed',
      get_symbol_body: 'Extract only needed symbol, 85% savings over reading entire file',
      get_file_summary: 'File overview without reading content, 90% savings',
      start_process: 'Smart process management with early exit detection',
      list_directory: 'Structured listing with depth control',
      analyze_code_relationships: 'Graph-based relationship analysis',
      sequentialthinking: 'Step-by-step reasoning for complex problems',
      tractatus_thinking: 'Logical structure analysis for architecture',
      debug_thinking: 'Systematic hypothesis testing for debugging'
    };
    
    return reasons[tool.name?.split('__').pop()] || tool.description || 'Optimal tool for operation';
  }
  
  /**
   * Record tool usage for learning
   * @param {object} tool - Used tool
   * @param {string} operation - Operation type
   * @param {object} context - Context
   */
  recordUsage(tool, operation, context) {
    this.usageHistory.push({
      tool: tool.name,
      operation,
      context: { ...context },
      timestamp: new Date().toISOString()
    });
    
    // Keep history manageable
    if (this.usageHistory.length > 100) {
      this.usageHistory.shift();
    }
  }
  
  /**
   * Get usage statistics
   * @returns {object} Usage stats
   */
  getUsageStats() {
    const toolCounts = {};
    const operationCounts = {};
    
    for (const usage of this.usageHistory) {
      toolCounts[usage.tool] = (toolCounts[usage.tool] || 0) + 1;
      operationCounts[usage.operation] = (operationCounts[usage.operation] || 0) + 1;
    }
    
    return {
      totalUsages: this.usageHistory.length,
      toolCounts,
      operationCounts,
      mostUsedTool: Object.entries(toolCounts).sort((a, b) => b[1] - a[1])[0]?.[0],
      mostCommonOperation: Object.entries(operationCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    };
  }
  
  /**
   * Check if native tool should be blocked
   * @param {string} toolName - Tool name to check
   * @returns {object} Block status and replacement
   */
  checkBlocked(toolName) {
    const tool = TOOL_REGISTRY[toolName];
    
    if (tool?.blocked) {
      return {
        blocked: true,
        reason: `Native tool ${toolName} is blocked per tool-priority rules`,
        replacement: tool.replacement,
        savings: 'Use MCP alternative for 50-90% token savings'
      };
    }
    
    return { blocked: false };
  }
  
  /**
   * Get all available tools for this agent
   * @returns {object} Available tools by category
   */
  getAvailableTools() {
    return {
      primary: this.agentTools.primary.map(t => ({
        name: t,
        ...TOOL_REGISTRY[t]
      })),
      thinking: this.agentTools.thinking.map(t => ({
        name: t,
        ...TOOL_REGISTRY[t]
      })),
      secondary: this.agentTools.secondary.map(t => ({
        name: t,
        ...TOOL_REGISTRY[t]
      }))
    };
  }
}

module.exports = { ToolSelector };
