/**
 * Tool Registry
 * 
 * Central registry of all tools with token savings metrics
 * and usage recommendations for GSI agents.
 * 
 * @module lib/tool-optimization/tool-registry
 */

/**
 * Tool categories with priority levels
 */
const TOOL_CATEGORIES = {
  MCP_FILE: 'mcp_file',
  MCP_SEARCH: 'mcp_search',
  MCP_GRAPH: 'mcp_graph',
  THINKING: 'thinking',
  EXTERNAL: 'external',
  NATIVE: 'native' // Last resort only
};

/**
 * Complete tool registry with metadata
 */
const TOOL_REGISTRY = {
  // ==================== MCP FILE OPERATIONS ====================
  
  'mcp__desktop-commander__read_file': {
    category: TOOL_CATEGORIES.MCP_FILE,
    description: 'Read single file content',
    priority: 1,
    savings: '50-70%',
    replaces: 'Read',
    usage: {
      params: ['path'],
      returns: 'file content'
    },
    agents: ['planner', 'executor', 'verifier', 'debugger', 'codebase-mapper']
  },
  
  'mcp__desktop-commander__read_multiple_files': {
    category: TOOL_CATEGORIES.MCP_FILE,
    description: 'Read multiple files in one call - MAXIMUM EFFICIENCY',
    priority: 1,
    savings: '80-90%',
    replaces: 'multiple Read calls',
    usage: {
      params: ['paths (array)'],
      returns: 'object with file contents'
    },
    bestFor: 'reading 2+ files at once',
    agents: ['planner', 'executor', 'verifier', 'debugger', 'codebase-mapper']
  },
  
  'mcp__desktop-commander__write_file': {
    category: TOOL_CATEGORIES.MCP_FILE,
    description: 'Write content to file with chunking support',
    priority: 1,
    savings: '50-70%',
    replaces: 'Write',
    usage: {
      params: ['path', 'content', 'mode (rewrite|append)'],
      returns: 'success status'
    },
    agents: ['planner', 'executor', 'verifier', 'debugger', 'codebase-mapper']
  },
  
  'mcp__desktop-commander__edit_block': {
    category: TOOL_CATEGORIES.MCP_FILE,
    description: 'Surgical text replacement in files',
    priority: 1,
    savings: '60-80%',
    replaces: 'Edit',
    usage: {
      params: ['file_path', 'old_string', 'new_string', 'expected_replacements'],
      returns: 'success status'
    },
    agents: ['executor', 'debugger']
  },
  
  'mcp__desktop-commander__list_directory': {
    category: TOOL_CATEGORIES.MCP_FILE,
    description: 'List directory contents with depth control',
    priority: 1,
    savings: '70%',
    replaces: 'Bash ls',
    usage: {
      params: ['path', 'depth'],
      returns: 'directory listing'
    },
    agents: ['planner', 'executor', 'codebase-mapper']
  },
  
  'mcp__desktop-commander__get_file_info': {
    category: TOOL_CATEGORIES.MCP_FILE,
    description: 'Get file metadata (size, dates, line count)',
    priority: 1,
    savings: '70%',
    replaces: 'Bash stat',
    usage: {
      params: ['path'],
      returns: 'file metadata'
    },
    agents: ['codebase-mapper']
  },
  
  // ==================== MCP PROCESS OPERATIONS ====================
  
  'mcp__desktop-commander__start_process': {
    category: TOOL_CATEGORIES.MCP_FILE,
    description: 'Start terminal process with smart detection',
    priority: 1,
    savings: '75%',
    replaces: 'Bash',
    usage: {
      params: ['command', 'timeout_ms'],
      returns: 'process info with pid'
    },
    agents: ['executor', 'debugger']
  },
  
  'mcp__desktop-commander__interact_with_process': {
    category: TOOL_CATEGORIES.MCP_FILE,
    description: 'Send input to running process',
    priority: 1,
    savings: 'N/A',
    replaces: 'none',
    usage: {
      params: ['pid', 'input', 'timeout_ms'],
      returns: 'process response'
    },
    agents: ['executor', 'debugger']
  },
  
  'mcp__desktop-commander__read_process_output': {
    category: TOOL_CATEGORIES.MCP_FILE,
    description: 'Read output from running process',
    priority: 1,
    savings: 'N/A',
    replaces: 'none',
    usage: {
      params: ['pid', 'timeout_ms'],
      returns: 'process output'
    },
    agents: ['executor', 'debugger']
  },
  
  'mcp__desktop-commander__start_search': {
    category: TOOL_CATEGORIES.MCP_FILE,
    description: 'Start streaming file/content search',
    priority: 1,
    savings: '60-70%',
    replaces: 'Grep',
    usage: {
      params: ['path', 'pattern', 'searchType', 'filePattern'],
      returns: 'search session ID'
    },
    agents: ['planner', 'executor', 'verifier', 'debugger']
  },
  
  // ==================== MCP CODE SEARCH ====================
  
  'mcp__code-index-mcp__search_code_advanced': {
    category: TOOL_CATEGORIES.MCP_SEARCH,
    description: 'Search code with pattern matching - PRIMARY SEARCH TOOL',
    priority: 1,
    savings: '80%',
    replaces: 'Grep',
    usage: {
      params: ['pattern', 'file_pattern', 'max_results', 'regex', 'context_lines'],
      returns: 'search results with context'
    },
    agents: ['planner', 'executor', 'verifier', 'debugger', 'codebase-mapper']
  },
  
  'mcp__code-index-mcp__find_files': {
    category: TOOL_CATEGORIES.MCP_SEARCH,
    description: 'Find files matching glob pattern',
    priority: 1,
    savings: '70%',
    replaces: 'Glob',
    usage: {
      params: ['pattern'],
      returns: 'matching file paths'
    },
    agents: ['planner', 'executor', 'verifier', 'codebase-mapper']
  },
  
  'mcp__code-index-mcp__get_symbol_body': {
    category: TOOL_CATEGORIES.MCP_SEARCH,
    description: 'Get source code of specific symbol - HIGH EFFICIENCY',
    priority: 1,
    savings: '85%',
    replaces: 'reading entire file',
    usage: {
      params: ['file_path', 'symbol_name'],
      returns: 'symbol source code'
    },
    agents: ['planner', 'executor', 'verifier', 'debugger']
  },
  
  'mcp__code-index-mcp__get_file_summary': {
    category: TOOL_CATEGORIES.MCP_SEARCH,
    description: 'Get file overview (imports, functions, complexity)',
    priority: 1,
    savings: '90%',
    replaces: 'reading entire file',
    usage: {
      params: ['file_path'],
      returns: 'file summary object'
    },
    agents: ['planner', 'executor', 'verifier', 'codebase-mapper']
  },
  
  'mcp__code-index-mcp__build_deep_index': {
    category: TOOL_CATEGORIES.MCP_SEARCH,
    description: 'Build complete symbol index for project',
    priority: 1,
    savings: 'N/A',
    replaces: 'none',
    usage: {
      params: [],
      returns: 'index build status'
    },
    agents: ['codebase-mapper']
  },
  
  'mcp__code-index-mcp__set_project_path': {
    category: TOOL_CATEGORIES.MCP_SEARCH,
    description: 'Set base project path for indexing',
    priority: 1,
    savings: 'N/A',
    replaces: 'none',
    usage: {
      params: ['path'],
      returns: 'success status'
    },
    agents: ['codebase-mapper']
  },
  
  // ==================== MCP CODE GRAPH ====================
  
  'mcp__CodeGraphContext__add_code_to_graph': {
    category: TOOL_CATEGORIES.MCP_GRAPH,
    description: 'Index code for relationship analysis',
    priority: 1,
    savings: 'N/A',
    replaces: 'none',
    usage: {
      params: ['path', 'is_dependency'],
      returns: 'job ID'
    },
    agents: ['codebase-mapper']
  },
  
  'mcp__CodeGraphContext__analyze_code_relationships': {
    category: TOOL_CATEGORIES.MCP_GRAPH,
    description: 'Analyze code relationships (callers, callees, hierarchy)',
    priority: 1,
    savings: '70%',
    replaces: 'manual analysis',
    usage: {
      params: ['query_type', 'target', 'context'],
      returns: 'relationship data'
    },
    agents: ['planner', 'verifier', 'codebase-mapper']
  },
  
  'mcp__CodeGraphContext__find_code': {
    category: TOOL_CATEGORIES.MCP_GRAPH,
    description: 'Find code by keyword with fuzzy search',
    priority: 1,
    savings: '70%',
    replaces: 'Grep',
    usage: {
      params: ['query', 'fuzzy_search', 'edit_distance'],
      returns: 'matching code snippets'
    },
    agents: ['planner', 'debugger', 'codebase-mapper']
  },
  
  'mcp__CodeGraphContext__find_most_complex_functions': {
    category: TOOL_CATEGORIES.MCP_GRAPH,
    description: 'Find highest complexity functions',
    priority: 1,
    savings: '70%',
    replaces: 'manual analysis',
    usage: {
      params: ['limit'],
      returns: 'complex functions with scores'
    },
    agents: ['verifier', 'codebase-mapper']
  },
  
  'mcp__CodeGraphContext__find_dead_code': {
    category: TOOL_CATEGORIES.MCP_GRAPH,
    description: 'Find potentially unused functions',
    priority: 1,
    savings: '70%',
    replaces: 'manual analysis',
    usage: {
      params: ['exclude_decorated_with'],
      returns: 'dead code list'
    },
    agents: ['verifier', 'codebase-mapper']
  },
  
  'mcp__CodeGraphContext__calculate_cyclomatic_complexity': {
    category: TOOL_CATEGORIES.MCP_GRAPH,
    description: 'Calculate complexity of specific function',
    priority: 1,
    savings: '70%',
    replaces: 'manual analysis',
    usage: {
      params: ['function_name', 'path'],
      returns: 'complexity score'
    },
    agents: ['verifier', 'codebase-mapper']
  },
  
  // ==================== THINKING SERVERS ====================
  
  'mcp__sequential-thinking__sequentialthinking': {
    category: TOOL_CATEGORIES.THINKING,
    description: 'Step-by-step problem decomposition',
    priority: 2,
    savings: 'cognitive',
    replaces: 'unstructured reasoning',
    usage: {
      params: ['thought', 'thoughtNumber', 'totalThoughts', 'nextThoughtNeeded'],
      returns: 'reasoning chain'
    },
    agents: ['planner', 'executor', 'verifier']
  },
  
  'mcp__tractatusthinking__tractatus_thinking': {
    category: TOOL_CATEGORIES.THINKING,
    description: 'Logical structure analysis',
    priority: 2,
    savings: 'cognitive',
    replaces: 'unstructured analysis',
    usage: {
      params: ['operation', 'concept', 'content', 'depth_limit'],
      returns: 'structural analysis'
    },
    agents: ['planner', 'verifier', 'codebase-mapper']
  },
  
  'mcp__debug-thinking__debug_thinking': {
    category: TOOL_CATEGORIES.THINKING,
    description: 'Systematic debugging with hypothesis testing',
    priority: 2,
    savings: 'cognitive',
    replaces: 'unstructured debugging',
    usage: {
      params: ['action', 'nodeType', 'content', 'parentId'],
      returns: 'debug graph nodes'
    },
    agents: ['debugger']
  },
  
  // ==================== EXTERNAL KNOWLEDGE ====================
  
  'mcp__context7__get-library-docs': {
    category: TOOL_CATEGORIES.EXTERNAL,
    description: 'Retrieve up-to-date library documentation',
    priority: 3,
    savings: 'N/A',
    replaces: 'web search',
    usage: {
      params: ['context7CompatibleLibraryID', 'topic', 'mode'],
      returns: 'library documentation'
    },
    agents: ['planner', 'debugger']
  },
  
  'mcp__context7__resolve-library-id': {
    category: TOOL_CATEGORIES.EXTERNAL,
    description: 'Resolve library name to Context7 ID',
    priority: 3,
    savings: 'N/A',
    replaces: 'web search',
    usage: {
      params: ['libraryName'],
      returns: 'library ID and options'
    },
    agents: ['planner', 'debugger']
  },
  
  'mcp__deepwiki__ask_question': {
    category: TOOL_CATEGORIES.EXTERNAL,
    description: 'Ask question about GitHub repository',
    priority: 3,
    savings: 'N/A',
    replaces: 'web search',
    usage: {
      params: ['repoName', 'question'],
      returns: 'AI-powered answer'
    },
    agents: ['planner', 'debugger']
  },
  
  // ==================== NATIVE TOOLS (BLOCKED) ====================
  
  'Read': {
    category: TOOL_CATEGORIES.NATIVE,
    description: 'BLOCKED - Use mcp__desktop-commander__read_file instead',
    priority: 999,
    savings: '0%',
    blocked: true,
    replacement: 'mcp__desktop-commander__read_file'
  },
  
  'Write': {
    category: TOOL_CATEGORIES.NATIVE,
    description: 'BLOCKED - Use mcp__desktop-commander__write_file instead',
    priority: 999,
    savings: '0%',
    blocked: true,
    replacement: 'mcp__desktop-commander__write_file'
  },
  
  'Edit': {
    category: TOOL_CATEGORIES.NATIVE,
    description: 'BLOCKED - Use mcp__desktop-commander__edit_block instead',
    priority: 999,
    savings: '0%',
    blocked: true,
    replacement: 'mcp__desktop-commander__edit_block'
  },
  
  'Bash': {
    category: TOOL_CATEGORIES.NATIVE,
    description: 'BLOCKED - Use mcp__desktop-commander__start_process instead',
    priority: 999,
    savings: '0%',
    blocked: true,
    replacement: 'mcp__desktop-commander__start_process'
  },
  
  'Grep': {
    category: TOOL_CATEGORIES.NATIVE,
    description: 'BLOCKED - Use mcp__code-index-mcp__search_code_advanced instead',
    priority: 999,
    savings: '0%',
    blocked: true,
    replacement: 'mcp__code-index-mcp__search_code_advanced'
  },
  
  'Glob': {
    category: TOOL_CATEGORIES.NATIVE,
    description: 'BLOCKED - Use mcp__code-index-mcp__find_files instead',
    priority: 999,
    savings: '0%',
    blocked: true,
    replacement: 'mcp__code-index-mcp__find_files'
  }
};

/**
 * Agent-specific tool recommendations
 */
const AGENT_TOOL_MAP = {
  planner: {
    primary: [
      'mcp__desktop-commander__read_multiple_files',
      'mcp__desktop-commander__write_file',
      'mcp__code-index-mcp__search_code_advanced',
      'mcp__context7__get-library-docs'
    ],
    thinking: ['mcp__tractatusthinking__tractatus_thinking', 'mcp__sequential-thinking__sequentialthinking'],
    secondary: [
      'mcp__desktop-commander__list_directory',
      'mcp__CodeGraphContext__analyze_code_relationships'
    ]
  },
  
  executor: {
    primary: [
      'mcp__desktop-commander__read_multiple_files',
      'mcp__desktop-commander__write_file',
      'mcp__desktop-commander__edit_block',
      'mcp__desktop-commander__start_process'
    ],
    thinking: ['mcp__sequential-thinking__sequentialthinking'],
    secondary: [
      'mcp__code-index-mcp__search_code_advanced',
      'mcp__code-index-mcp__get_symbol_body'
    ]
  },
  
  verifier: {
    primary: [
      'mcp__desktop-commander__read_multiple_files',
      'mcp__code-index-mcp__find_files',
      'mcp__code-index-mcp__search_code_advanced',
      'mcp__code-index-mcp__get_symbol_body'
    ],
    thinking: ['mcp__tractatusthinking__tractatus_thinking', 'mcp__sequential-thinking__sequentialthinking'],
    secondary: [
      'mcp__desktop-commander__write_file',
      'mcp__CodeGraphContext__analyze_code_relationships',
      'mcp__CodeGraphContext__find_most_complex_functions'
    ]
  },
  
  debugger: {
    primary: [
      'mcp__desktop-commander__read_file',
      'mcp__code-index-mcp__search_code_advanced',
      'mcp__desktop-commander__start_process',
      'mcp__desktop-commander__edit_block'
    ],
    thinking: ['mcp__debug-thinking__debug_thinking'],
    secondary: [
      'mcp__desktop-commander__write_file',
      'mcp__context7__get-library-docs'
    ]
  },
  
  'codebase-mapper': {
    primary: [
      'mcp__desktop-commander__list_directory',
      'mcp__desktop-commander__read_multiple_files',
      'mcp__code-index-mcp__search_code_advanced',
      'mcp__desktop-commander__write_file'
    ],
    thinking: ['mcp__sequential-thinking__sequentialthinking', 'mcp__tractatusthinking__tractatus_thinking'],
    secondary: [
      'mcp__CodeGraphContext__add_code_to_graph',
      'mcp__CodeGraphContext__analyze_code_relationships',
      'mcp__CodeGraphContext__find_most_complex_functions'
    ]
  }
};

/**
 * Get recommended tool for a given situation
 * @param {string} agent - Agent name (planner, executor, verifier, debugger, codebase-mapper)
 * @param {string} operation - Operation type (read, write, search, etc.)
 * @param {object} context - Additional context (fileCount, pattern, etc.)
 * @returns {object} Recommended tool and alternatives
 */
function getToolRecommendation(agent, operation, context = {}) {
  const recommendations = {
    tool: null,
    alternatives: [],
    savings: null,
    reason: null
  };
  
  // Operation-based recommendations
  switch (operation) {
    case 'read':
      if (context.fileCount && context.fileCount > 1) {
        recommendations.tool = 'mcp__desktop-commander__read_multiple_files';
        recommendations.savings = '80-90%';
        recommendations.reason = 'Batch reading reduces protocol overhead';
      } else {
        recommendations.tool = 'mcp__desktop-commander__read_file';
        recommendations.savings = '50-70%';
        recommendations.reason = 'MCP tool has lower protocol overhead';
      }
      recommendations.alternatives = ['mcp__code-index-mcp__get_symbol_body'];
      break;
      
    case 'write':
      recommendations.tool = 'mcp__desktop-commander__write_file';
      recommendations.savings = '50-70%';
      recommendations.reason = 'MCP tool has lower protocol overhead';
      recommendations.alternatives = [];
      break;
      
    case 'edit':
      recommendations.tool = 'mcp__desktop-commander__edit_block';
      recommendations.savings = '60-80%';
      recommendations.reason = 'Surgical replacement with lower overhead';
      recommendations.alternatives = [];
      break;
      
    case 'search':
      if (context.pattern) {
        recommendations.tool = 'mcp__code-index-mcp__search_code_advanced';
        recommendations.savings = '80%';
        recommendations.reason = 'Indexed search with context lines';
        recommendations.alternatives = ['mcp__CodeGraphContext__find_code'];
      } else {
        recommendations.tool = 'mcp__code-index-mcp__find_files';
        recommendations.savings = '70%';
        recommendations.reason = 'Indexed file discovery';
        recommendations.alternatives = [];
      }
      break;
      
    case 'symbol':
      recommendations.tool = 'mcp__code-index-mcp__get_symbol_body';
      recommendations.savings = '85%';
      recommendations.reason = 'Extract only needed symbol, not entire file';
      recommendations.alternatives = ['mcp__code-index-mcp__get_file_summary'];
      break;
      
    case 'command':
      recommendations.tool = 'mcp__desktop-commander__start_process';
      recommendations.savings = '75%';
      recommendations.reason = 'Smart process management with lower overhead';
      recommendations.alternatives = [];
      break;
      
    case 'directory':
      recommendations.tool = 'mcp__desktop-commander__list_directory';
      recommendations.savings = '70%';
      recommendations.reason = 'Structured listing with depth control';
      recommendations.alternatives = [];
      break;
      
    case 'analyze':
      recommendations.tool = 'mcp__CodeGraphContext__analyze_code_relationships';
      recommendations.savings = '70%';
      recommendations.reason = 'Graph-based relationship analysis';
      recommendations.alternatives = ['mcp__code-index-mcp__get_file_summary'];
      break;
      
    default:
      recommendations.tool = null;
      recommendations.reason = 'Unknown operation type';
  }
  
  return recommendations;
}

/**
 * Calculate token savings for a tool usage
 * @param {string} tool - Tool name
 * @param {object} context - Usage context
 * @returns {object} Savings calculation
 */
function getTokenSavings(tool, context = {}) {
  const toolInfo = TOOL_REGISTRY[tool];
  if (!toolInfo) {
    return { error: 'Unknown tool' };
  }
  
  // Base savings from registry
  const baseSavings = toolInfo.savings || '0%';
  
  // Calculate based on context
  let estimatedSavings = 0;
  
  if (tool === 'mcp__desktop-commander__read_multiple_files' && context.fileCount) {
    // Native: ~15K per file, MCP: ~5K + ~500 per file
    const nativeTokens = context.fileCount * 15000;
    const mcpTokens = 5000 + (context.fileCount * 500);
    estimatedSavings = Math.round((1 - mcpTokens / nativeTokens) * 100);
  } else if (tool === 'mcp__code-index-mcp__get_symbol_body') {
    // Reading symbol vs entire file
    estimatedSavings = 85;
  } else if (tool === 'mcp__code-index-mcp__search_code_advanced') {
    estimatedSavings = 80;
  }
  
  return {
    tool,
    baseSavings,
    estimatedSavings: estimatedSavings ? `${estimatedSavings}%` : baseSavings,
    category: toolInfo.category,
    priority: toolInfo.priority
  };
}

module.exports = {
  TOOL_CATEGORIES,
  TOOL_REGISTRY,
  AGENT_TOOL_MAP,
  getToolRecommendation,
  getTokenSavings
};
