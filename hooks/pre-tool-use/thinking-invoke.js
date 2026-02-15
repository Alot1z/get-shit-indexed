#!/usr/bin/env node

/**
 * Thinking Invoke Hook
 * 
 * PreToolUse hook that invokes thinking servers before tool execution.
 * Called by Claude Code before tools are executed based on pattern matching.
 * 
 * Hook receives tool invocation details via stdin (JSON):
 * {
 *   "toolName": "Read|Write|Task|mcp__desktop-commander__read_file|...",
 *   "arguments": {...},
 *   "sessionId": "..."
 * }
 */

const fs = require('fs');
const path = require('path');

// Tool categorization for thinking selection
const TOOL_CATEGORIES = {
  // File operations -> Sequential thinking
  file: [
    'Read', 'Write', 'Edit',
    'mcp__desktop-commander__read_file',
    'mcp__desktop-commander__write_file', 
    'mcp__desktop-commander__edit_block',
    'mcp__desktop-commander__list_directory'
  ],
  
  // Code operations -> Tractatus thinking
  code: [
    'mcp__code-index-mcp__search_code_advanced',
    'mcp__code-index-mcp__find_files',
    'mcp__code-index-mcp__get_symbol_body',
    'mcp__code-index-mcp__get_file_summary',
    'Grep', 'Glob'
  ],
  
  // Analysis operations -> Sequential thinking
  analysis: [
    'Task', 'execute-phase', 'execute-plan',
    'plan-phase', 'map-codebase'
  ],
  
  // Relationship operations -> Tractatus thinking
  relationship: [
    'mcp__CodeGraphContext__*'
  ],
  
  // Everything else -> No thinking needed
  other: []
};

/**
 * Categorize tool and return thinking server to use
 */
function categorizeTool(toolName) {
  // File operations -> Sequential thinking
  if (TOOL_CATEGORIES.file.some(pattern => toolName.includes(pattern))) {
    return {
      category: 'file',
      thinkingServer: 'sequential-thinking',
      reason: 'File operations benefit from sequential decomposition'
    };
  }
  
  // Code operations -> Tractatus thinking
  if (TOOL_CATEGORIES.code.some(pattern => toolName.includes(pattern))) {
    return {
      category: 'code',
      thinkingServer: 'tractatus-thinking', 
      reason: 'Code analysis benefits from structural decomposition'
    };
  }
  
  // Analysis operations -> Sequential thinking
  if (TOOL_CATEGORIES.analysis.some(pattern => toolName.includes(pattern))) {
    return {
      category: 'analysis',
      thinkingServer: 'sequential-thinking',
      reason: 'Complex analysis benefits from multi-step thinking'
    };
  }
  
  // Relationship operations -> Tractatus thinking
  if (TOOL_CATEGORIES.relationship.some(pattern => toolName.includes(pattern))) {
    return {
      category: 'relationship',
      thinkingServer: 'tractatus-thinking',
      reason: 'Relationship analysis benefits from logical structure analysis'
    };
  }
  
  // Default: No thinking for simple operations
  return {
    category: 'other',
    thinkingServer: null,
    reason: 'Simple operation, no thinking needed'
  };
}

/**
 * Log hook execution for debugging
 */
function logHookExecution(toolName, category, thinkingServer) {
  const logDir = path.join(process.env.CLAUDE_HOME || '', '.claude', 'logs');
  const logFile = path.join(logDir, 'thinking-invoke-hook.log');
  
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      toolName,
      category,
      thinkingServer,
      message: thinkingServer 
        ? `Invoking ${thinkingServer} for ${toolName}`
        : `Skipping thinking for ${toolName}`
    };
    
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    // Silent fail - logging shouldn't break the hook
  }
}

/**
 * Main hook execution
 */
async function main() {
  try {
    // Read stdin for tool invocation details
    let input = '';
    for await (const chunk of process.stdin) {
      input += chunk;
    }
    
    let toolInvocation;
    try {
      toolInvocation = JSON.parse(input);
    } catch (e) {
      // If no JSON input, just exit successfully
      process.exit(0);
      return;
    }
    
    const { toolName } = toolInvocation;
    
    // Categorize tool and determine thinking server
    const { category, thinkingServer, reason } = categorizeTool(toolName);
    
    // Log execution
    logHookExecution(toolName, category, thinkingServer);
    
    // If no thinking needed, exit successfully
    if (!thinkingServer) {
      process.exit(0);
      return;
    }
    
    // Log that thinking would be invoked
    // NOTE: Actual thinking server invocation happens via MCP tools
    // This hook just logs and exits - the thinking happens during tool execution
    console.error(`[THINKING-INVOKE] Would invoke ${thinkingServer} for ${toolName}: ${reason}`);
    
    process.exit(0);
    
  } catch (error) {
    // Hooks must not fail - log error and exit successfully
    console.error('[THINKING-INVOKE] Error:', error.message);
    process.exit(0);
  }
}

// Execute hook
main().catch(error => {
  console.error('[THINKING-INVOKE] Fatal error:', error);
  process.exit(0);
});
