#!/usr/bin/env node

/**
 * Reflection Capture Hook
 * 
 * PostToolUse hook that captures learnings after tool execution.
 * Called by Claude Code after tools complete execution.
 * 
 * Hook receives tool result details via stdin (JSON):
 * {
 *   "toolName": "Read|Write|Task|...",
 *   "arguments": {...},
 *   "result": {...},
 *   "error": null | "error message",
 *   "sessionId": "..."
 * }
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if reflection should be triggered
 */
function shouldCaptureReflection(toolInvocation) {
  const { toolName, error, result } = toolInvocation;
  
  // Trigger conditions:
  // 1. Error occurred
  if (error) {
    return {
      shouldCapture: true,
      reason: 'error',
      message: `Tool ${toolName} failed with error`
    };
  }
  
  // 2. Significant changes (Task execution, writes, edits)
  const significantTools = ['Task', 'Write', 'Edit', 'execute-phase', 'execute-plan'];
  if (significantTools.some(pattern => toolName.includes(pattern))) {
    return {
      shouldCapture: true,
      reason: 'significant-change',
      message: `Tool ${toolName} made significant changes`
    };
  }
  
  // 3. Thinking-enabled tools (code search, analysis)
  const thinkingEnabledTools = [
    'mcp__code-index-mcp__search_code_advanced',
    'mcp__CodeGraphContext__analyze_code_relationships',
    'mcp__sequential-thinking__sequentialthinking',
    'mcp__tractatus-thinking__tractatus_thinking'
  ];
  if (thinkingEnabledTools.some(pattern => toolName.includes(pattern))) {
    return {
      shouldCapture: true,
      reason: 'thinking-enabled',
      message: `Tool ${toolName} is thinking-enabled`
    };
  }
  
  // Default: No reflection needed
  return {
    shouldCapture: false,
    reason: 'not-applicable',
    message: `Tool ${toolName} doesn't require reflection`
  };
}

/**
 * Create observation node in debug-thinking graph
 * NOTE: This is a placeholder - actual debug-thinking integration
 * would happen via MCP tools during tool execution
 */
function createDebugThinkingNode(toolInvocation, reflectionReason) {
  const { toolName, arguments: args, error, result } = toolInvocation;
  
  // Create observation data
  const observation = {
    type: 'observation',
    toolName,
    reflectionReason: reflectionReason.reason,
    timestamp: new Date().toISOString(),
    details: {
      hadError: !!error,
      errorMessage: error || null,
      resultType: result ? typeof result : 'null'
    }
  };
  
  // Log to file for now (debug-thinking integration would be via MCP)
  const logDir = path.join(process.env.CLAUDE_HOME || '', '.claude', 'reflections');
  const logFile = path.join(logDir, 'observations.jsonl');
  
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    fs.appendFileSync(logFile, JSON.stringify(observation) + '\n');
  } catch (err) {
    // Silent fail - reflection shouldn't break the hook
  }
  
  return observation;
}

/**
 * Log reflection capture for debugging
 */
function logReflectionCapture(toolName, reflectionReason, observation) {
  const logDir = path.join(process.env.CLAUDE_HOME || '', '.claude', 'logs');
  const logFile = path.join(logDir, 'reflection-capture-hook.log');
  
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      toolName,
      reflectionReason: reflectionReason.reason,
      observation,
      message: `Captured reflection for ${toolName}: ${reflectionReason.message}`
    };
    
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    // Silent fail
  }
}

/**
 * Main hook execution
 */
async function main() {
  try {
    // Read stdin for tool result details
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
    
    // Check if reflection should be captured
    const reflectionReason = shouldCaptureReflection(toolInvocation);
    
    // Log reflection decision
    console.error(`[REFLECTION-CAPTURE] ${reflectionReason.message}`);
    
    if (!reflectionReason.shouldCapture) {
      process.exit(0);
      return;
    }
    
    // Create observation node
    const observation = createDebugThinkingNode(toolInvocation, reflectionReason);
    
    // Log reflection capture
    logReflectionCapture(toolName, reflectionReason, observation);
    
    console.error(`[REFLECTION-CAPTURE] Created observation node for ${toolName}`);
    
    process.exit(0);
    
  } catch (error) {
    // Hooks must not fail - log error and exit successfully
    console.error('[REFLECTION-CAPTURE] Error:', error.message);
    process.exit(0);
  }
}

// Execute hook
main().catch(error => {
  console.error('[REFLECTION-CAPTURE] Fatal error:', error);
  process.exit(0);
});
