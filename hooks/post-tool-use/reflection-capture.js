#!/usr/bin/env node

/**
 * Enhanced Reflection Capture Hook
 * 
 * PostToolUse hook that captures learnings after tool execution using the
 * reflection system with capture engine, debug-thinking integration,
 * pattern extraction, and insight generation.
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

const path = require('path');

// Import reflection system components
const ReflectionCapture = require('../../lib/reflection/capture');
const DebugThinkingIntegration = require('../../lib/reflection/debug-integration');
const PatternExtractor = require('../../lib/reflection/patterns');
const InsightGenerator = require('../../lib/reflection/insights');

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
    'mcp__code-index-mcp__get_symbol_body',
    'mcp__sequential-thinking__sequentialthinking',
    'mcp__tractatus-thinking__tractatus_thinking',
    'mcp__debug-thinking__debug_thinking'
  ];
  if (thinkingEnabledTools.some(pattern => toolName.includes(pattern))) {
    return {
      shouldCapture: true,
      reason: 'thinking-enabled',
      message: `Tool ${toolName} is thinking-enabled`
    };
  }
  
  // 4. File operations (read, write with desktop-commander)
  const fileOperationTools = [
    'mcp__desktop-commander__read_file',
    'mcp__desktop-commander__write_file',
    'mcp__desktop-commander__edit_block'
  ];
  if (fileOperationTools.some(pattern => toolName.includes(pattern))) {
    return {
      shouldCapture: true,
      reason: 'file-operation',
      message: `Tool ${toolName} performed file operation`
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
 * Main hook execution
 */
async function main() {
  try {
    // Initialize reflection system components
    const capture = new ReflectionCapture();
    const debugIntegration = new DebugThinkingIntegration();
    const patternExtractor = new PatternExtractor();
    const insightGenerator = new InsightGenerator();
    
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
    
    const { toolName, arguments: args, result, error, sessionId } = toolInvocation;
    
    // Check if reflection should be captured
    const reflectionReason = shouldCaptureReflection(toolInvocation);
    
    // Log reflection decision
    console.error(`[REFLECTION-CAPTURE] ${reflectionReason.message}`);
    
    if (!reflectionReason.shouldCapture) {
      process.exit(0);
      return;
    }
    
    // Capture reflection
    console.error(`[REFLECTION-CAPTURE] Capturing reflection for ${toolName}...`);
    
    const reflection = capture.capture(toolName, {
      arguments: args,
      sessionId: sessionId,
      thinkingBefore: toolInvocation.thinkingBefore || null,
      thinkingAfter: toolInvocation.thinkingAfter || null,
      duration: toolInvocation.duration || null
    }, {
      result: result || null,
      error: error || null
    });
    
    console.error(`[REFLECTION-CAPTURE] Reflection captured: ${reflection.type}`);
    
    // Store in debug-thinking graph
    console.error(`[REFLECTION-CAPTURE] Storing in debug-thinking graph...`);
    const observation = await debugIntegration.storeReflection(reflection);
    if (observation) {
      console.error(`[REFLECTION-CAPTURE] Observation stored: ${observation.id || 'unknown'}`);
    }
    
    // Extract patterns
    console.error(`[REFLECTION-CAPTURE] Extracting patterns...`);
    const patterns = patternExtractor.extractPatterns(reflection);
    console.error(`[REFLECTION-CAPTURE] Extracted ${patterns.length} patterns`);
    
    // Generate insights
    console.error(`[REFLECTION-CAPTURE] Generating insights...`);
    const insights = insightGenerator.generateInsights(reflection);
    console.error(`[REFLECTION-CAPTURE] Generated ${insights.length} insights`);
    
    // Log insights
    if (insights.length > 0) {
      console.error(`[REFLECTION-CAPTURE] Top insights:`);
      insights.slice(0, 3).forEach((insight, i) => {
        console.error(`  ${i + 1}. [${insight.impact}] ${insight.title}`);
      });
    }
    
    // Create hypothesis if applicable
    const hypothesis = await debugIntegration.createHypothesis(reflection);
    if (hypothesis) {
      console.error(`[REFLECTION-CAPTURE] Hypothesis created: ${hypothesis.content.substring(0, 80)}...`);
    }
    
    // Create learning if insights exist
    if (reflection.insights.length > 0) {
      const learning = await debugIntegration.createLearning(reflection);
      if (learning) {
        console.error(`[REFLECTION-CAPTURE] Learning created with ${reflection.insights.length} insights`);
      }
    }
    
    console.error(`[REFLECTION-CAPTURE] Complete for ${toolName}`);
    
    process.exit(0);
    
  } catch (error) {
    // Hooks must not fail - log error and exit successfully
    console.error('[REFLECTION-CAPTURE] Error:', error.message);
    console.error(error.stack);
    process.exit(0);
  }
}

// Execute hook
main().catch(error => {
  console.error('[REFLECTION-CAPTURE] Fatal error:', error);
  process.exit(0);
});
