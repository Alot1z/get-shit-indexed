#!/usr/bin/env node
// PreToolUse hook: Block native tools when MCP alternatives exist
// Enforces MCP-only tool usage for GSI commands

// Tool mappings: native -> MCP replacement
const BLOCKED_TOOLS = {
  // File operations
  'Read': 'mcp__desktop-commander__read_file',
  'Write': 'mcp__desktop-commander__write_file',
  'Edit': 'mcp__desktop-commander__edit_block',
  
  // Search operations
  'Grep': 'mcp__code-index-mcp__search_code_advanced',
  'Glob': 'mcp__code-index-mcp__find_files',
  
  // Shell operations - block for file operations
  // 'Bash': 'mcp__desktop-commander__start_process', // Keep Bash for gsi-tools.js
};

// Exceptions: allow Bash for these patterns
const BASH_EXCEPTIONS = [
  /GSI-tools\.js/,
  /gsi-tools\.js/,
  /node\s+/,
];

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
    const mcpReplacement = BLOCKED_TOOLS[toolName];
    
    if (mcpReplacement) {
      // Block the tool and suggest MCP replacement
      const response = {
        action: 'block',
        message: `⛔ Native tool '${toolName}' is blocked. Use MCP tool '${mcpReplacement}' instead.\n\nToken savings: 80-90% per MCP-TOKEN-BENCHMARK.md`
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
          { pattern: /\bcat\s+/i, replacement: 'mcp__desktop-commander__read_file' },
          { pattern: /\bls\s+/i, replacement: 'mcp__desktop-commander__list_directory' },
          { pattern: /\bgrep\s+/i, replacement: 'mcp__code-index-mcp__search_code_advanced' },
          { pattern: /\bfind\s+/i, replacement: 'mcp__code-index-mcp__find_files' },
          { pattern: /\bmkdir\s+/i, replacement: 'mcp__desktop-commander__create_directory' },
          { pattern: /\brm\s+/i, replacement: 'mcp__desktop-commander__* (appropriate file op)' },
          { pattern: /\bmv\s+/i, replacement: 'mcp__desktop-commander__move_file' },
          { pattern: /\bcp\s+/i, replacement: 'mcp__desktop-commander__read_file + write_file' },
        ];
        
        for (const { pattern, replacement } of fileOpPatterns) {
          if (pattern.test(command)) {
            const response = {
              action: 'block',
              message: `⚠️ Bash command contains file operation. Consider using MCP tool '${replacement}' instead.\n\nCommand: ${command}\n\nToken savings: 80-90% per MCP-TOKEN-BENCHMARK.md`
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
