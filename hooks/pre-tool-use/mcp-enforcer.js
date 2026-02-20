#!/usr/bin/env node
/**
 * MCP Enforcer Hook - PreToolUse
 * 
 * Blocks native tools (Read, Write, Edit, Grep, Glob, Bash) when MCP alternatives exist.
 * Enforces tool precedence hierarchy for optimal token savings.
 * 
 * Tool Precedence:
 * 1. Skills (BEST)         - 80-90% token savings
 * 2. DesktopCommander MCP  - 50-70% token savings
 * 3. Code-Index MCP        - 30-50% token savings
 * 4. Other MCP Tools       - 30-50% token savings
 * 5. Native Tools (LAST)   - 0% savings, baseline
 * 
 * Usage: This hook is invoked by Claude Code before tool execution.
 * Input: JSON tool call via stdin
 * Output: JSON response with action (allow/block) via stdout
 */

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  // Enable/disable enforcement
  enabled: true,
  
  // Log level: 'debug', 'info', 'warn', 'error', 'none'
  logLevel: 'info',
  
  // Allow native tools in these directories
  allowedPaths: [
    /node_modules/,
    /\.git/,
    /hooks\/pre-tool-use/,  // Hooks themselves can use native APIs
  ],
  
  // Maximum files before recommending batch
  batchThreshold: 2,
};

// ============================================================
// TOOL MAPPINGS
// ============================================================

const TOOL_MAPPINGS = {
  // ---- FILE OPERATIONS ----
  Read: {
    blocked: true,
    replacement: 'mcp__desktop-commander__read_file',
    batchAlternative: 'mcp__desktop-commander__read_multiple_files',
    batchThreshold: CONFIG.batchThreshold,
    savings: '80-90%',
    category: 'file-operation',
    description: 'Read file contents',
    examples: [
      {
        native: 'Read({ file_path: "/src/file.ts" })',
        mcp: 'mcp__desktop-commander__read_file({ path: "/src/file.ts" })',
      },
      {
        native: 'Multiple Read calls',
        mcp: 'mcp__desktop-commander__read_multiple_files({ paths: ["file1.ts", "file2.ts"] })',
        note: 'Use batch for 2+ files - 90% token savings',
      },
    ],
  },
  
  Write: {
    blocked: true,
    replacement: 'mcp__desktop-commander__write_file',
    savings: '80-90%',
    category: 'file-operation',
    description: 'Write content to file',
    examples: [
      {
        native: 'Write({ file_path: "/src/file.ts", content: "..." })',
        mcp: 'mcp__desktop-commander__write_file({ path: "/src/file.ts", content: "..." })',
      },
    ],
  },
  
  Edit: {
    blocked: true,
    replacement: 'mcp__desktop-commander__edit_block',
    savings: '80-90%',
    category: 'file-operation',
    description: 'Edit file with surgical replacement',
    examples: [
      {
        native: 'Edit({ file_path: "/src/file.ts", old_string: "...", new_string: "..." })',
        mcp: 'mcp__desktop-commander__edit_block({ file_path: "/src/file.ts", old_string: "...", new_string: "..." })',
      },
    ],
  },
  
  // ---- SEARCH OPERATIONS ----
  Grep: {
    blocked: true,
    replacement: 'mcp__code-index-mcp__search_code_advanced',
    alternatives: [
      {
        tool: 'mcp__desktop-commander__start_search',
        useCase: 'When Code-Index is unavailable',
      },
      {
        tool: 'mcp__code-index-mcp__get_symbol_body',
        useCase: 'When extracting specific function/class',
      },
    ],
    savings: '50-70%',
    category: 'search-operation',
    description: 'Search code patterns',
    examples: [
      {
        native: 'Grep({ pattern: "function", path: "/src", type: "js" })',
        mcp: 'mcp__code-index-mcp__search_code_advanced({ pattern: "function", file_pattern: "*.js" })',
      },
    ],
  },
  
  Glob: {
    blocked: true,
    replacement: 'mcp__code-index-mcp__find_files',
    alternatives: [
      {
        tool: 'mcp__desktop-commander__start_search',
        useCase: 'When Code-Index is unavailable',
        searchType: 'files',
      },
    ],
    savings: '50-70%',
    category: 'search-operation',
    description: 'Find files by pattern',
    examples: [
      {
        native: 'Glob({ pattern: "**/*.ts", path: "/src" })',
        mcp: 'mcp__code-index-mcp__find_files({ pattern: "*.ts" })',
      },
    ],
  },
  
  // ---- SHELL OPERATIONS ----
  Bash: {
    blocked: false, // Bash is redirected, not fully blocked
    redirect: 'mcp__desktop-commander__start_process',
    savings: '50-80%',
    category: 'shell-operation',
    description: 'Execute shell commands',
    // Patterns that should use MCP instead
    fileOperationPatterns: [
      { pattern: /\bcat\s+/i, replacement: 'mcp__desktop-commander__read_file', savings: '80-90%' },
      { pattern: /\bls\s+/i, replacement: 'mcp__desktop-commander__list_directory', savings: '70%' },
      { pattern: /\bfind\s+/i, replacement: 'mcp__code-index-mcp__find_files', savings: '50-70%' },
      { pattern: /\bgrep\s+/i, replacement: 'mcp__code-index-mcp__search_code_advanced', savings: '50-70%' },
      { pattern: /\bmkdir\s+/i, replacement: 'mcp__desktop-commander__create_directory', savings: '80%' },
      { pattern: /\brm\s+/i, replacement: 'mcp__desktop-commander__delete_file', savings: '80%' },
      { pattern: /\bmv\s+/i, replacement: 'mcp__desktop-commander__move_file', savings: '80%' },
      { pattern: /\bcp\s+/i, replacement: 'mcp__desktop-commander__read_file + write_file', savings: '80%' },
      { pattern: /\bhead\s+/i, replacement: 'mcp__desktop-commander__read_file with offset', savings: '80%' },
      { pattern: /\btail\s+/i, replacement: 'mcp__desktop-commander__read_file with offset=-N', savings: '80%' },
    ],
    // Patterns that should stay native
    keepNative: [
      /^git\s+/,
      /^npm\s+/,
      /^node\s+/,
      /^npx\s+/,
      /^yarn\s+/,
      /^pnpm\s+/,
      /^python\d*\s+/,
      /^pip\d*\s+/,
      /^docker\s+/,
      /^kubectl\s+/,
      /GSI-tools\.js/,
      /gsi-tools\.js/,
    ],
  },
};

// ============================================================
// LOGGING
// ============================================================

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
};

function log(level, message, data = null) {
  if (LOG_LEVELS[level] < LOG_LEVELS[CONFIG.logLevel]) return;
  
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    hook: 'mcp-enforcer',
    message,
    ...(data && { data }),
  };
  
  // Log to stderr to not interfere with stdout JSON output
  console.error(JSON.stringify(logEntry));
}

// ============================================================
// RECOMMENDATION BUILDER
// ============================================================

function buildRecommendation(toolName, toolConfig, context = {}) {
  const lines = [];
  
  // Header
  lines.push('');
  lines.push('============================================================');
  lines.push(`⛔ NATIVE TOOL BLOCKED: ${toolName}`);
  lines.push('============================================================');
  lines.push('');
  
  // Token savings highlight
  lines.push(`💰 TOKEN SAVINGS: ${toolConfig.savings}`);
  lines.push('');
  
  // Primary replacement
  lines.push('📋 PRIMARY MCP REPLACEMENT:');
  lines.push(`   ${toolConfig.replacement}`);
  lines.push('');
  
  // Batch alternative for Read
  if (toolConfig.batchAlternative) {
    lines.push('📦 BATCH OPERATION (2+ files):');
    lines.push(`   ${toolConfig.batchAlternative}`);
    lines.push('   Example:');
    lines.push('   {');
    lines.push('     "paths": ["file1.ts", "file2.ts", "file3.ts"]');
    lines.push('   }');
    lines.push('   ⚡ Token savings: 90% vs sequential reads');
    lines.push('');
  }
  
  // Additional alternatives for search tools
  if (toolConfig.alternatives) {
    lines.push('🔄 ALTERNATIVES:');
    toolConfig.alternatives.forEach(alt => {
      lines.push(`   • ${alt.tool}`);
      lines.push(`     Use case: ${alt.useCase}`);
    });
    lines.push('');
  }
  
  // Examples
  if (toolConfig.examples) {
    lines.push('📝 USAGE EXAMPLES:');
    toolConfig.examples.forEach((ex, i) => {
      lines.push(`   Example ${i + 1}:`);
      lines.push(`   ❌ Native: ${ex.native}`);
      lines.push(`   ✅ MCP:    ${ex.mcp}`);
      if (ex.note) {
        lines.push(`   💡 Note:   ${ex.note}`);
      }
      lines.push('');
    });
  }
  
  // Reference
  lines.push('📚 Reference: references/MCP-TOKEN-BENCHMARK.md');
  lines.push('📚 Reference: references/tool-priority.md');
  lines.push('');
  lines.push('============================================================');
  
  return lines.join('\n');
}

function buildBashRecommendation(command, pattern, replacement, savings) {
  const lines = [];
  
  lines.push('');
  lines.push('============================================================');
  lines.push('⚠️ BASH FILE OPERATION DETECTED');
  lines.push('============================================================');
  lines.push('');
  lines.push(`Command: ${command}`);
  lines.push('');
  lines.push(`💡 Pattern detected: ${pattern.source}`);
  lines.push('');
  lines.push('📋 USE MCP INSTEAD:');
  lines.push(`   ${replacement}`);
  lines.push('');
  lines.push(`💰 Token savings: ${savings}`);
  lines.push('');
  lines.push('📚 Reference: references/MCP-TOKEN-BENCHMARK.md');
  lines.push('============================================================');
  
  return lines.join('\n');
}

// ============================================================
// PATH CHECKING
// ============================================================

function isAllowedPath(input) {
  const path = input?.file_path || input?.path || '';
  
  for (const pattern of CONFIG.allowedPaths) {
    if (pattern.test(path)) {
      return true;
    }
  }
  
  return false;
}

// ============================================================
// MAIN HOOK LOGIC
// ============================================================

function processToolCall(toolCall) {
  const toolName = toolCall.tool || toolCall.name;
  const toolInput = toolCall.input || toolCall.arguments || {};
  
  log('debug', 'Processing tool call', { tool: toolName });
  
  // Check if enforcement is enabled
  if (!CONFIG.enabled) {
    return { action: 'allow' };
  }
  
  // Check allowed paths
  if (isAllowedPath(toolInput)) {
    log('debug', 'Path allowed, skipping enforcement', { tool: toolName });
    return { action: 'allow' };
  }
  
  const toolConfig = TOOL_MAPPINGS[toolName];
  
  // Tool not in our mappings - allow
  if (!toolConfig) {
    return { action: 'allow' };
  }
  
  // ---- FILE OPERATIONS: Read, Write, Edit ----
  if (toolConfig.blocked === true) {
    log('info', `Blocking native tool: ${toolName}`, { 
      replacement: toolConfig.replacement,
      savings: toolConfig.savings 
    });
    
    return {
      action: 'block',
      message: buildRecommendation(toolName, toolConfig, toolInput),
      metadata: {
        blockedTool: toolName,
        replacement: toolConfig.replacement,
        savings: toolConfig.savings,
        timestamp: new Date().toISOString(),
      },
    };
  }
  
  // ---- SHELL OPERATIONS: Bash ----
  if (toolName === 'Bash') {
    const command = toolInput.command || '';
    
    // Check for keep-native patterns
    for (const pattern of toolConfig.keepNative) {
      if (pattern.test(command)) {
        log('debug', 'Bash command allowed (keep-native pattern)', { command });
        return { action: 'allow' };
      }
    }
    
    // Check for file operation patterns
    for (const { pattern, replacement, savings } of toolConfig.fileOperationPatterns) {
      if (pattern.test(command)) {
        log('info', 'Bash file operation detected', { command, pattern: pattern.source });
        
        return {
          action: 'block',
          message: buildBashRecommendation(command, pattern, replacement, savings),
          metadata: {
            blockedTool: 'Bash',
            detectedPattern: pattern.source,
            replacement,
            savings,
            timestamp: new Date().toISOString(),
          },
        };
      }
    }
    
    // Other Bash commands are allowed (redirected by bash-redirect.js)
    return { action: 'allow' };
  }
  
  // Default: allow
  return { action: 'allow' };
}

// ============================================================
// STDIN/STDOUT HANDLER
// ============================================================

let inputData = '';

process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  try {
    // Parse tool call from stdin
    const toolCall = JSON.parse(inputData);
    
    // Process the tool call
    const result = processToolCall(toolCall);
    
    // Output result to stdout
    console.log(JSON.stringify(result));
    
    // Exit with appropriate code
    process.exit(0);
    
  } catch (error) {
    // On error, fail open (allow the tool)
    log('error', 'Hook error, failing open', { error: error.message });
    
    const result = {
      action: 'allow',
      note: `MCP Enforcer hook error: ${error.message}`,
    };
    
    console.log(JSON.stringify(result));
    process.exit(0);
  }
});

// ============================================================
// MODULE EXPORTS (for testing)
// ============================================================

module.exports = {
  TOOL_MAPPINGS,
  CONFIG,
  processToolCall,
  buildRecommendation,
  buildBashRecommendation,
  isAllowedPath,
};
