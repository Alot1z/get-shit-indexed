/**
 * Tool Categories for Thinking Mode Selection
 * 
 * Defines categories for 50+ MCP tools with their thinking requirements.
 * Each category specifies which thinking server to use and mode variations.
 * 
 * Categories:
 * - FILE_OPS: File operations (read, write, edit, list)
 * - PROCESS_OPS: Process operations (start, interact, kill)
 * - CODE_OPS: Code operations (search, symbols, analysis)
 * - GRAPH_OPS: CodeGraph relationship operations
 * - DEBUG_OPS: Debug thinking operations
 * - COMPLEX_OPS: Multi-step complex operations
 */

// Tool category definitions
const CATEGORIES = {
  FILE_OPS: {
    name: 'FILE_OPS',
    description: 'File system operations',
    thinking_mode: 'sequential', // Step-by-step file reasoning
    timeout: 5000, // 5 seconds default
    priority: 'high',
    tools: [
      'read_file',
      'write_file',
      'edit_block',
      'list_directory',
      'get_file_info',
      'move_file',
      'create_directory',
      'read_multiple_files',
      'start_search',
      'get_more_search_results',
      'stop_search'
    ]
  },

  PROCESS_OPS: {
    name: 'PROCESS_OPS',
    description: 'Process management operations',
    thinking_mode: 'sequential', // Process flow reasoning
    timeout: 8000, // 8 seconds default
    priority: 'high',
    tools: [
      'start_process',
      'interact_with_process',
      'read_process_output',
      'kill_process',
      'force_terminate',
      'list_processes',
      'list_sessions'
    ]
  },

  CODE_OPS: {
    name: 'CODE_OPS',
    description: 'Code analysis and search operations',
    thinking_mode: 'tractatus', // Logical code structure
    timeout: 10000, // 10 seconds default
    priority: 'medium',
    tools: [
      'search_code_advanced',
      'find_files',
      'get_file_summary',
      'get_symbol_body',
      'build_deep_index',
      'set_project_path',
      'refresh_index',
      'refresh_search_tools',
      'get_file_watcher_status',
      'check_temp_directory',
      'get_settings_info'
    ]
  },

  GRAPH_OPS: {
    name: 'GRAPH_OPS',
    description: 'CodeGraph relationship operations',
    thinking_mode: 'tractatus', // Relationship analysis
    timeout: 15000, // 15 seconds default (Neo4j queries)
    priority: 'medium',
    tools: [
      'execute_cypher_query',
      'analyze_code_relationships',
      'find_code',
      'get_repository_stats',
      'list_indexed_repositories',
      'visualize_graph_query'
    ]
  },

  DEBUG_OPS: {
    name: 'DEBUG_OPS',
    description: 'Debug thinking operations',
    thinking_mode: 'debug', // Problem solving
    timeout: 20000, // 20 seconds default
    priority: 'low',
    tools: [
      'debug_thinking'
    ]
  },

  COMPLEX_OPS: {
    name: 'COMPLEX_OPS',
    description: 'Multi-step complex operations',
    thinking_mode: 'combined', // Tractatus + Sequential
    timeout: 30000, // 30 seconds default
    priority: 'low',
    tools: [
      'build_deep_index',
      'watch_directory',
      'unwatch_directory',
      'add_code_to_graph',
      'add_package_to_graph',
      'load_bundle',
      'delete_repository'
    ]
  }
};

// Mode variations for each category
const MODE_VARIATIONS = {
  FILE_OPS: {
    lightweight: {
      timeout: 3000,
      thoughtDepth: 2,
      description: 'Quick file operations'
    },
    standard: {
      timeout: 5000,
      thoughtDepth: 5,
      description: 'Standard file operations'
    },
    comprehensive: {
      timeout: 10000,
      thoughtDepth: 10,
      description: 'Complex file operations with validation'
    }
  },

  PROCESS_OPS: {
    lightweight: {
      timeout: 5000,
      thoughtDepth: 3,
      description: 'Quick process commands'
    },
    standard: {
      timeout: 8000,
      thoughtDepth: 5,
      description: 'Standard process operations'
    },
    comprehensive: {
      timeout: 15000,
      thoughtDepth: 10,
      description: 'Complex process flows with error handling'
    }
  },

  CODE_OPS: {
    lightweight: {
      timeout: 5000,
      thoughtDepth: 2,
      description: 'Quick code search'
    },
    standard: {
      timeout: 10000,
      thoughtDepth: 5,
      description: 'Standard code analysis'
    },
    comprehensive: {
      timeout: 20000,
      thoughtDepth: 10,
      description: 'Deep code structure analysis'
    }
  },

  GRAPH_OPS: {
    lightweight: {
      timeout: 10000,
      thoughtDepth: 3,
      description: 'Simple graph queries'
    },
    standard: {
      timeout: 15000,
      thoughtDepth: 5,
      description: 'Standard relationship analysis'
    },
    comprehensive: {
      timeout: 30000,
      thoughtDepth: 10,
      description: 'Complex graph traversals'
    }
  },

  DEBUG_OPS: {
    lightweight: {
      timeout: 10000,
      thoughtDepth: 5,
      description: 'Quick debug check'
    },
    standard: {
      timeout: 20000,
      thoughtDepth: 8,
      description: 'Standard debug session'
    },
    comprehensive: {
      timeout: 40000,
      thoughtDepth: 15,
      description: 'Deep debug investigation'
    }
  },

  COMPLEX_OPS: {
    lightweight: {
      timeout: 15000,
      thoughtDepth: 5,
      description: 'Simple multi-step operations'
    },
    standard: {
      timeout: 30000,
      thoughtDepth: 10,
      description: 'Standard complex operations'
    },
    comprehensive: {
      timeout: 60000,
      thoughtDepth: 20,
      description: 'Complex multi-phase operations'
    }
  }
};

/**
 * Get category for a tool
 * @param {string} toolName - The tool name
 * @returns {object|null} Category definition or null
 */
function getToolCategory(toolName) {
  for (const category of Object.values(CATEGORIES)) {
    if (category.tools.includes(toolName)) {
      return category;
    }
  }
  return null;
}

/**
 * Get mode variations for a category
 * @param {string} categoryName - The category name
 * @returns {object|null} Mode variations or null
 */
function getModeVariations(categoryName) {
  return MODE_VARIATIONS[categoryName] || null;
}

/**
 * Get all category names
 * @returns {string[]} Array of category names
 */
function getAllCategories() {
  return Object.keys(CATEGORIES);
}

/**
 * Get all tools in a category
 * @param {string} categoryName - The category name
 * @returns {string[]} Array of tool names
 */
function getCategoryTools(categoryName) {
  return CATEGORIES[categoryName]?.tools || [];
}

module.exports = {
  CATEGORIES,
  MODE_VARIATIONS,
  getToolCategory,
  getModeVariations,
  getAllCategories,
  getCategoryTools
};
