#!/usr/bin/env node
// PreToolUse hook: Block native tools when MCP alternatives exist
// Enforces MCP-only tool usage for GSI commands

// MCP Pattern Reference:
// This hook runs BEFORE tool execution, so it uses native Node.js APIs.
// MCP tools are NOT available to hooks themselves.
// The hook RECOMMENDS MCP tools to agents for actual execution.

// Tool mappings: native -> MCP replacement with recommendations
const BLOCKED_TOOLS = {
  // File operations
  // SINGLE FILE: Use read_file
  // MULTIPLE FILES: Use read_multiple_files (90% token savings)
  'Read': {
    replacement: 'mcp__desktop-commander__read_file',
    batchAlternative: 'mcp__desktop-commander__read_multiple_files',
    batchThreshold: 2, // Use batch when reading 2+ files
    savings: '80-90%'
  },
  'Write': {
    replacement: 'mcp__desktop-commander__write_file',
    savings: '80-90%'
  },
  'Edit': {
    replacement: 'mcp__desktop-commander__edit_block',
    savings: '80-90%'
  },
  
  // Search operations
  // CODE SEARCH: Use search_code_advanced (indexed, fast)
  // RELATIONSHIP ANALYSIS: Use CodeGraphContext tools
  'Grep': {
    replacement: 'mcp__code-index-mcp__search_code_advanced',
    relationshipAlt: 'mcp__CodeGraphContext__analyze_code_relationships',
    savings: '50-70%'
  },
  'Glob': {
    replacement: 'mcp__code-index-mcp__find_files',
    savings: '50-70%'
  },
  
  // Shell operations - block for file operations
  // 'Bash': 'mcp__desktop-commander__start_process', // Keep Bash for gsi-tools.js
};

// Exceptions: allow Bash for these patterns
const BASH_EXCEPTIONS = [
  /GSI-tools\.js/,
  /gsi-tools\.js/,
  /node\s+/,
];

// Helper: Build recommendation message with batch reading and CG alternatives
function buildRecommendation(toolName, toolConfig, additionalInfo = '') {
  let message = `⛔ Native tool '${toolName}' is blocked.\n\n`;
  
  // Primary MCP replacement
  message += `📋 Use MCP tool: ${toolConfig.replacement}\n`;
  
  // Batch reading recommendation for Read operations
  if (toolConfig.batchAlternative) {
    message += `\n📦 BATCH READING (2+ files):\n`;
    message += `   Use ${toolConfig.batchAlternative}\n`;
    message += `   Example: mcp__desktop-commander__read_multiple_files({\n`;
    message += `     paths: ["file1.md", "file2.md", "file3.md"]\n`;
    message += `   })\n`;
  }
  
  // CodeGraphContext alternative for relationship analysis
  if (toolConfig.relationshipAlt) {
    message += `\n🔗 RELATIONSHIP ANALYSIS:\n`;
    message += `   Use ${toolConfig.relationshipAlt}\n`;
    message += `   Query types: find_callers, find_callees, class_hierarchy\n`;
    message += `   Requires: Neo4j at localhost:7687 (start-cg-server.ps1)\n`;
  }
  
  // Token savings
  message += `\n💰 Token savings: ${toolConfig.savings} per MCP-TOKEN-BENCHMARK.md`;
  
  if (additionalInfo) {
    message += `\n\n${additionalInfo}`;
  }
  
  return message;
}

// Read tool call from stdin (Claude Code hook protocol)
let inputData = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => inputData += chunk);
process.stdin.on('end', () => {
  try {
    const toolCall = JSON.parse(inputData);
    const toolName = toolCall.tool || toolCall.name;
    const toolInput = toolCall.input || toolCall.arguments || {};
    
    // Check if tool is blocked
    const toolConfig = BLOCKED_TOOLS[toolName];
    
    if (toolConfig) {
      // Block the tool and suggest MCP replacement with batch/CG recommendations
      const response = {
        action: 'block',
        message: buildRecommendation(toolName, toolConfig)
      };
      console.log(JSON.stringify(response));
      process.exit(0);
    }
    
    // Special handling for Bash
    if (toolName === 'Bash') {
      const command = toolInput.command || '';
      const isException = BASH_EXCEPTIONS.some(pattern => pattern.test(command));
      
      if (!isException) {
        // Check for common file operations that should use MCP
        const fileOpPatterns = [
          { 
            pattern: /\bcat\s+/i, 
            replacement: 'mcp__desktop-commander__read_file',
            tip: 'For multiple files: use read_multiple_files'
          },
          { 
            pattern: /\bls\s+/i, 
            replacement: 'mcp__desktop-commander__list_directory',
            tip: 'Recursive listing supported with depth parameter'
          },
          { 
            pattern: /\bgrep\s+/i, 
            replacement: 'mcp__code-index-mcp__search_code_advanced',
            tip: 'For relationships: use CodeGraphContext tools'
          },
          { 
            pattern: /\bfind\s+/i, 
            replacement: 'mcp__code-index-mcp__find_files',
            tip: 'Uses indexed search for faster results'
          },
          { 
            pattern: /\bmkdir\s+/i, 
            replacement: 'mcp__desktop-commander__create_directory',
            tip: 'Supports recursive creation'
          },
          { 
            pattern: /\brm\s+/i, 
            replacement: 'mcp__desktop-commander__* (appropriate file op)',
            tip: 'Use desktop-commander for safe file operations'
          },
          { 
            pattern: /\bmv\s+/i, 
            replacement: 'mcp__desktop-commander__move_file',
            tip: 'Atomic move/rename operation'
          },
          { 
            pattern: /\bcp\s+/i, 
            replacement: 'mcp__desktop-commander__read_file + write_file',
            tip: 'Use read + write for file copying'
          },
        ];
        
        for (const { pattern, replacement, tip } of fileOpPatterns) {
          if (pattern.test(command)) {
            const response = {
              action: 'block',
              message: `⚠️ Bash command contains file operation.\n\n` +
                       `📋 Use MCP tool: ${replacement}\n` +
                       `💡 Tip: ${tip}\n\n` +
                       `Command: ${command}\n\n` +
                       `💰 Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md`
            };
            console.log(JSON.stringify(response));
            process.exit(0);
          }
        }
      }
    }
    
    // Allow the tool
    const response = { action: 'allow' };
    console.log(JSON.stringify(response));
    process.exit(0);
    
  } catch (error) {
    // On error, allow the tool (fail open)
    const response = { 
      action: 'allow',
      note: `Hook error: ${error.message}`
    };
    console.log(JSON.stringify(response));
    process.exit(0);
  }
});
