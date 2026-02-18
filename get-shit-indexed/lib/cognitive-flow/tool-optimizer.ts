/**
 * MCP Tool Optimizer
 *
 * Provides tool selection matrix, token cost estimation, batch optimization,
 * and parallel execution planning for MCP tools.
 *
 * @module cognitive-flow/tool-optimizer
 */

import {
  MCPToolCategory,
  MCPToolInfo,
  ToolSelectionEntry,
  BatchOptimization,
  MCPToolCall,
  MCPToolResult
} from './types.js';

/**
 * Tool selection matrix with preferred tools and token savings.
 */
const TOOL_SELECTION_MATRIX: ToolSelectionEntry[] = [
  // File Operations
  {
    operation: 'read-file',
    preferredTool: 'mcp__desktop-commander__read_file',
    alternatives: ['Read'],
    tokenSavings: 50,
    priority: 1
  },
  {
    operation: 'write-file',
    preferredTool: 'mcp__desktop-commander__write_file',
    alternatives: ['Write'],
    tokenSavings: 50,
    priority: 1
  },
  {
    operation: 'edit-file',
    preferredTool: 'mcp__desktop-commander__edit_block',
    alternatives: ['Edit'],
    tokenSavings: 60,
    priority: 1
  },
  {
    operation: 'list-directory',
    preferredTool: 'mcp__desktop-commander__list_directory',
    alternatives: ['Bash ls'],
    tokenSavings: 70,
    priority: 1
  },
  {
    operation: 'search-files',
    preferredTool: 'mcp__desktop-commander__start_search',
    alternatives: ['Grep', 'Glob'],
    tokenSavings: 80,
    priority: 1
  },
  {
    operation: 'create-directory',
    preferredTool: 'mcp__desktop-commander__create_directory',
    alternatives: ['Bash mkdir'],
    tokenSavings: 60,
    priority: 1
  },
  {
    operation: 'move-file',
    preferredTool: 'mcp__desktop-commander__move_file',
    alternatives: ['Bash mv'],
    tokenSavings: 60,
    priority: 1
  },
  {
    operation: 'read-multiple-files',
    preferredTool: 'mcp__desktop-commander__read_multiple_files',
    alternatives: ['Read (multiple calls)'],
    tokenSavings: 85,
    priority: 1
  },
  // Code Search
  {
    operation: 'search-code',
    preferredTool: 'mcp__code-index-mcp__search_code_advanced',
    alternatives: ['Grep'],
    tokenSavings: 75,
    priority: 1
  },
  {
    operation: 'find-files',
    preferredTool: 'mcp__code-index-mcp__find_files',
    alternatives: ['Glob'],
    tokenSavings: 70,
    priority: 1
  },
  {
    operation: 'get-symbol',
    preferredTool: 'mcp__code-index-mcp__get_symbol_body',
    alternatives: ['Read + Manual search'],
    tokenSavings: 90,
    priority: 1
  },
  {
    operation: 'file-summary',
    preferredTool: 'mcp__code-index-mcp__get_file_summary',
    alternatives: ['Read entire file'],
    tokenSavings: 85,
    priority: 1
  },
  // Process Management
  {
    operation: 'start-process',
    preferredTool: 'mcp__desktop-commander__start_process',
    alternatives: ['Bash'],
    tokenSavings: 60,
    priority: 1
  },
  {
    operation: 'interact-process',
    preferredTool: 'mcp__desktop-commander__interact_with_process',
    alternatives: ['Bash (limited)'],
    tokenSavings: 80,
    priority: 1
  },
  {
    operation: 'list-processes',
    preferredTool: 'mcp__desktop-commander__list_processes',
    alternatives: ['Bash ps'],
    tokenSavings: 50,
    priority: 1
  },
  // Documentation
  {
    operation: 'get-library-docs',
    preferredTool: 'mcp__context7__get-library-docs',
    alternatives: ['Web search'],
    tokenSavings: 70,
    priority: 1
  },
  {
    operation: 'resolve-library',
    preferredTool: 'mcp__context7__resolve-library-id',
    alternatives: ['Manual lookup'],
    tokenSavings: 80,
    priority: 1
  },
  {
    operation: 'wiki-contents',
    preferredTool: 'mcp__deepwiki__read_wiki_contents',
    alternatives: ['Manual browsing'],
    tokenSavings: 75,
    priority: 1
  },
  // Web Access
  {
    operation: 'fetch-url',
    preferredTool: 'mcp__web_reader__webReader',
    alternatives: ['Bash curl'],
    tokenSavings: 65,
    priority: 1
  },
  {
    operation: 'crawl-web',
    preferredTool: 'mcp__context-crawl__crawl',
    alternatives: ['Manual browsing'],
    tokenSavings: 80,
    priority: 1
  },
  {
    operation: 'search-web',
    preferredTool: 'mcp__rag-web-browser__search',
    alternatives: ['Manual search'],
    tokenSavings: 70,
    priority: 1
  }
];

/**
 * Token cost estimates for different tool categories.
 */
const CATEGORY_TOKEN_COSTS: Record<MCPToolCategory, { overhead: number; perCall: number }> = {
  'file-operations': { overhead: 500, perCall: 200 },
  'code-search': { overhead: 800, perCall: 300 },
  'process-management': { overhead: 600, perCall: 250 },
  'thinking': { overhead: 2000, perCall: 1000 },
  'documentation': { overhead: 1000, perCall: 400 },
  'web-access': { overhead: 1500, perCall: 500 }
};

/**
 * Tool information database.
 */
const TOOL_INFO: Map<string, MCPToolInfo> = new Map([
  // Desktop Commander
  ['mcp__desktop-commander__read_file', {
    name: 'read_file',
    category: 'file-operations',
    tokenCost: 700,
    avgLatency: 50,
    capabilities: ['read', 'file', 'text', 'binary', 'images'],
    dependencies: []
  }],
  ['mcp__desktop-commander__write_file', {
    name: 'write_file',
    category: 'file-operations',
    tokenCost: 800,
    avgLatency: 100,
    capabilities: ['write', 'file', 'create', 'append'],
    dependencies: []
  }],
  ['mcp__desktop-commander__edit_block', {
    name: 'edit_block',
    category: 'file-operations',
    tokenCost: 900,
    avgLatency: 75,
    capabilities: ['edit', 'replace', 'file', 'surgical'],
    dependencies: []
  }],
  ['mcp__desktop-commander__read_multiple_files', {
    name: 'read_multiple_files',
    category: 'file-operations',
    tokenCost: 1200,
    avgLatency: 100,
    capabilities: ['read', 'multiple', 'batch', 'files'],
    dependencies: []
  }],
  ['mcp__desktop-commander__list_directory', {
    name: 'list_directory',
    category: 'file-operations',
    tokenCost: 600,
    avgLatency: 30,
    capabilities: ['list', 'directory', 'files', 'recursive'],
    dependencies: []
  }],
  ['mcp__desktop-commander__start_search', {
    name: 'start_search',
    category: 'code-search',
    tokenCost: 800,
    avgLatency: 200,
    capabilities: ['search', 'files', 'content', 'streaming'],
    dependencies: []
  }],
  ['mcp__desktop-commander__start_process', {
    name: 'start_process',
    category: 'process-management',
    tokenCost: 850,
    avgLatency: 100,
    capabilities: ['process', 'execute', 'shell', 'interactive'],
    dependencies: []
  }],
  ['mcp__desktop-commander__interact_with_process', {
    name: 'interact_with_process',
    category: 'process-management',
    tokenCost: 700,
    avgLatency: 50,
    capabilities: ['interact', 'input', 'repl', 'process'],
    dependencies: ['start_process']
  }],

  // Code Index MCP
  ['mcp__code-index-mcp__search_code_advanced', {
    name: 'search_code_advanced',
    category: 'code-search',
    tokenCost: 1100,
    avgLatency: 150,
    capabilities: ['search', 'code', 'regex', 'fuzzy', 'indexed'],
    dependencies: ['build_deep_index']
  }],
  ['mcp__code-index-mcp__find_files', {
    name: 'find_files',
    category: 'code-search',
    tokenCost: 600,
    avgLatency: 30,
    capabilities: ['find', 'files', 'glob', 'indexed'],
    dependencies: ['build_deep_index']
  }],
  ['mcp__code-index-mcp__get_symbol_body', {
    name: 'get_symbol_body',
    category: 'code-search',
    tokenCost: 900,
    avgLatency: 50,
    capabilities: ['symbol', 'function', 'class', 'extract', 'indexed'],
    dependencies: ['build_deep_index']
  }],
  ['mcp__code-index-mcp__get_file_summary', {
    name: 'get_file_summary',
    category: 'code-search',
    tokenCost: 700,
    avgLatency: 40,
    capabilities: ['summary', 'file', 'stats', 'symbols'],
    dependencies: ['build_deep_index']
  }],
  ['mcp__code-index-mcp__build_deep_index', {
    name: 'build_deep_index',
    category: 'code-search',
    tokenCost: 3000,
    avgLatency: 5000,
    capabilities: ['index', 'build', 'symbols', 'cache'],
    dependencies: []
  }],

  // Context7
  ['mcp__context7__get-library-docs', {
    name: 'get-library-docs',
    category: 'documentation',
    tokenCost: 2000,
    avgLatency: 2000,
    capabilities: ['docs', 'library', 'api', 'examples'],
    dependencies: ['resolve-library-id']
  }],
  ['mcp__context7__resolve-library-id', {
    name: 'resolve-library-id',
    category: 'documentation',
    tokenCost: 800,
    avgLatency: 500,
    capabilities: ['resolve', 'library', 'id', 'search'],
    dependencies: []
  }],

  // DeepWiki
  ['mcp__deepwiki__read_wiki_contents', {
    name: 'read_wiki_contents',
    category: 'documentation',
    tokenCost: 1500,
    avgLatency: 1000,
    capabilities: ['wiki', 'docs', 'repository'],
    dependencies: []
  }],

  // Web Access
  ['mcp__web_reader__webReader', {
    name: 'webReader',
    category: 'web-access',
    tokenCost: 1800,
    avgLatency: 2000,
    capabilities: ['fetch', 'url', 'markdown', 'read'],
    dependencies: []
  }],
  ['mcp__context-crawl__crawl', {
    name: 'crawl',
    category: 'web-access',
    tokenCost: 2500,
    avgLatency: 5000,
    capabilities: ['crawl', 'website', 'extract', 'batch'],
    dependencies: []
  }],
  ['mcp__rag-web-browser__search', {
    name: 'search',
    category: 'web-access',
    tokenCost: 1200,
    avgLatency: 1500,
    capabilities: ['search', 'web', 'google', 'extract'],
    dependencies: []
  }]
]);

/**
 * MCP Tool Optimizer class.
 */
export class ToolOptimizer {
  private selectionMatrix: Map<string, ToolSelectionEntry>;
  private toolInfo: Map<string, MCPToolInfo>;
  private callHistory: MCPToolCall[];

  constructor() {
    this.selectionMatrix = new Map(
      TOOL_SELECTION_MATRIX.map(entry => [entry.operation, entry])
    );
    this.toolInfo = TOOL_INFO;
    this.callHistory = [];
  }

  /**
   * Select the best tool for an operation.
   */
  selectTool(operation: string): ToolSelectionEntry | null {
    const entry = this.selectionMatrix.get(operation);
    if (entry) {
      return entry;
    }

    // Try partial match
    for (const [key, value] of this.selectionMatrix) {
      if (operation.includes(key) || key.includes(operation)) {
        return value;
      }
    }

    return null;
  }

  /**
   * Get tool information.
   */
  getToolInfo(toolName: string): MCPToolInfo | null {
    return this.toolInfo.get(toolName) || null;
  }

  /**
   * Estimate token cost for a tool call.
   */
  estimateTokenCost(toolName: string, params?: Record<string, any>): number {
    const info = this.toolInfo.get(toolName);
    if (!info) {
      return 1000; // Default estimate
    }

    let cost = info.tokenCost;

    // Adjust based on params
    if (params) {
      // Add cost for large inputs
      if (params.path && Array.isArray(params.path)) {
        cost += params.path.length * 100;
      }
      if (params.content && typeof params.content === 'string') {
        cost += Math.ceil(params.content.length / 100) * 50;
      }
      if (params.pattern && typeof params.pattern === 'string') {
        cost += 50;
      }
    }

    return cost;
  }

  /**
   * Estimate token savings by using MCP tool over native.
   */
  estimateTokenSavings(operation: string): number {
    const entry = this.selectionMatrix.get(operation);
    return entry ? entry.tokenSavings : 0;
  }

  /**
   * Optimize a batch of tool calls.
   */
  optimizeBatch(calls: MCPToolCall[]): BatchOptimization {
    // Build dependency graph
    const dependencies = new Map<string, string[]>();
    const callMap = new Map<string, MCPToolCall>();

    for (const call of calls) {
      const id = this.generateCallId(call);
      callMap.set(id, call);

      const deps: string[] = [];
      if (call.dependencies) {
        deps.push(...call.dependencies);
      }

      // Check tool dependencies
      const info = this.toolInfo.get(`${call.server}__${call.tool}`);
      if (info && info.dependencies) {
        for (const dep of info.dependencies) {
          // Find calls that satisfy this dependency
          for (const [otherId, otherCall] of callMap) {
            if (otherCall.tool === dep) {
              deps.push(otherId);
            }
          }
        }
      }

      dependencies.set(id, deps);
    }

    // Topological sort for execution order
    const sorted = this.topologicalSort(callMap, dependencies);

    // Group into parallelizable batches
    const batches: MCPToolCall[][] = [];
    const completed = new Set<string>();

    while (completed.size < sorted.length) {
      const batch: MCPToolCall[] = [];

      for (const id of sorted) {
        if (completed.has(id)) continue;

        const deps = dependencies.get(id) || [];
        const allDepsMet = deps.every(dep => completed.has(dep));

        if (allDepsMet) {
          const call = callMap.get(id)!;
          batch.push(call);
          completed.add(id);

          // Limit batch size
          if (batch.length >= 5) break;
        }
      }

      if (batch.length > 0) {
        batches.push(batch);
      }
    }

    // Calculate token savings
    let estimatedTokenSavings = 0;
    for (const call of calls) {
      const operation = call.tool.replace(/_/g, '-');
      estimatedTokenSavings += this.estimateTokenSavings(operation);
    }

    return {
      batches,
      estimatedTokenSavings,
      parallelizable: batches.some(b => b.length > 1),
      dependencies
    };
  }

  /**
   * Topological sort for dependency resolution.
   */
  private topologicalSort(
    callMap: Map<string, MCPToolCall>,
    dependencies: Map<string, string[]>
  ): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (id: string) => {
      if (visited.has(id)) return;
      if (visiting.has(id)) {
        // Circular dependency - just continue
        return;
      }

      visiting.add(id);

      const deps = dependencies.get(id) || [];
      for (const dep of deps) {
        visit(dep);
      }

      visiting.delete(id);
      visited.add(id);
      result.push(id);
    };

    for (const id of callMap.keys()) {
      visit(id);
    }

    return result;
  }

  /**
   * Generate a unique ID for a tool call.
   */
  private generateCallId(call: MCPToolCall): string {
    return `${call.server}__${call.tool}__${JSON.stringify(call.params).slice(0, 50)}`;
  }

  /**
   * Plan parallel execution for independent operations.
   */
  planParallelExecution(operations: string[]): {
    parallel: string[][];
    sequential: string[];
  } {
    const parallel: string[][] = [];
    const sequential: string[] = [];

    // Group operations by category
    const byCategory = new Map<MCPToolCategory, string[]>();

    for (const op of operations) {
      const entry = this.selectionMatrix.get(op);
      if (entry) {
        const info = this.toolInfo.get(entry.preferredTool);
        if (info) {
          const cat = info.category;
          if (!byCategory.has(cat)) {
            byCategory.set(cat, []);
          }
          byCategory.get(cat)!.push(op);
        }
      }
    }

    // Operations in different categories can run in parallel
    if (byCategory.size > 1) {
      const batch: string[] = [];
      for (const [cat, ops] of byCategory) {
        if (ops.length === 1) {
          batch.push(ops[0]);
        } else {
          // Multiple ops in same category - first can be parallel, rest sequential
          batch.push(ops[0]);
          sequential.push(...ops.slice(1));
        }
      }
      if (batch.length > 1) {
        parallel.push(batch);
      } else {
        sequential.push(...batch);
      }
    } else {
      // All operations in same category - mostly sequential
      sequential.push(...operations);
    }

    return { parallel, sequential };
  }

  /**
   * Optimize tool chain for minimum token usage.
   */
  optimizeToolChain(operations: string[]): {
    optimized: string[];
    savings: number;
  } {
    const optimized: string[] = [];
    let savings = 0;

    // Deduplicate operations
    const seen = new Set<string>();
    for (const op of operations) {
      if (!seen.has(op)) {
        seen.add(op);
        optimized.push(op);
        savings += this.estimateTokenSavings(op);
      }
    }

    // Reorder for efficiency (group by category)
    optimized.sort((a, b) => {
      const entryA = this.selectionMatrix.get(a);
      const entryB = this.selectionMatrix.get(b);

      if (!entryA || !entryB) return 0;

      const infoA = this.toolInfo.get(entryA.preferredTool);
      const infoB = this.toolInfo.get(entryB.preferredTool);

      if (!infoA || !infoB) return 0;

      // Sort by latency (faster first)
      return infoA.avgLatency - infoB.avgLatency;
    });

    return { optimized, savings };
  }

  /**
   * Record a tool call in history.
   */
  recordCall(call: MCPToolCall, result: MCPToolResult): void {
    this.callHistory.push(call);

    // Limit history size
    if (this.callHistory.length > 1000) {
      this.callHistory = this.callHistory.slice(-500);
    }
  }

  /**
   * Get tool call statistics.
   */
  getStats(): {
    totalCalls: number;
    byCategory: Map<MCPToolCategory, number>;
    byTool: Map<string, number>;
    avgLatency: number;
    totalTokensUsed: number;
    totalTokensSaved: number;
  } {
    const byCategory = new Map<MCPToolCategory, number>();
    const byTool = new Map<string, number>();
    let totalTokensUsed = 0;
    let totalTokensSaved = 0;

    for (const call of this.callHistory) {
      const toolKey = `${call.server}__${call.tool}`;
      byTool.set(toolKey, (byTool.get(toolKey) || 0) + 1);

      const info = this.toolInfo.get(toolKey);
      if (info) {
        byCategory.set(info.category, (byCategory.get(info.category) || 0) + 1);
        totalTokensUsed += info.tokenCost;
      }
    }

    // Estimate savings (compared to native tools)
    for (const entry of this.selectionMatrix.values()) {
      const toolKey = entry.preferredTool;
      const count = byTool.get(toolKey) || 0;
      totalTokensSaved += count * entry.tokenSavings;
    }

    return {
      totalCalls: this.callHistory.length,
      byCategory,
      byTool,
      avgLatency: 0, // Would need to track this
      totalTokensUsed,
      totalTokensSaved
    };
  }

  /**
   * Get all available tools.
   */
  getAvailableTools(): string[] {
    return Array.from(this.toolInfo.keys());
  }

  /**
   * Get tools by category.
   */
  getToolsByCategory(category: MCPToolCategory): MCPToolInfo[] {
    const tools: MCPToolInfo[] = [];

    for (const info of this.toolInfo.values()) {
      if (info.category === category) {
        tools.push(info);
      }
    }

    return tools;
  }

  /**
   * Check if a tool is an MCP tool.
   */
  isMCPTool(toolName: string): boolean {
    return toolName.startsWith('mcp__');
  }

  /**
   * Get native tool alternative.
   */
  getNativeAlternative(operation: string): string | null {
    const entry = this.selectionMatrix.get(operation);
    if (entry && entry.alternatives.length > 0) {
      return entry.alternatives[0];
    }
    return null;
  }
}

export default ToolOptimizer;
