# Thinking Orchestrator

Complete thinking system for GSI that integrates three thinking MCP servers with 7-BMAD quality validation.

## Overview

The Thinking Orchestrator provides intelligent thinking before and after tool execution, using three specialized thinking servers:

- **Sequential Thinking** - Multi-step problem decomposition
- **Tractatus Thinking** - Logical structure analysis
- **Debug Thinking** - Graph-based problem-solving with learning persistence

## Quick Start

```javascript
const { thinkBeforeTool, thinkAfterTool, runBMADCheck } = require('../lib/thinking');

// Think before tool execution
const context = await thinkBeforeTool('read_file', {
  filePath: '/path/to/file.txt'
});

// Execute tool...

// Think after tool execution
const reflection = await thinkAfterTool('read_file', {
  filePath: '/path/to/file.txt'
}, result);

// Run 7-BMAD quality check
const bmad = await runBMADCheck('read_file', result);
console.log(`BMAD: ${bmad.totalScore}/${bmad.maxScore} (${bmad.percentage}%)`);
```

## Core API

### `thinkBeforeTool(toolName, context)`

Triggers thinking before tool execution.

- **Returns**: `ThinkingContext` object with before thinking data
- **Mode Selection**: Automatically selects thinking server based on tool category
- **Caching**: Results cached for 5 minutes

```javascript
const context = await thinkBeforeTool('search_code_advanced', {
  pattern: 'function.*error',
  file_pattern: '*.js'
});

if (context.wasSkipped()) {
  console.log('Thinking skipped:', context.beforeThinking.reason);
} else if (context.wasCached()) {
  console.log('Using cached thinking');
} else {
  console.log('Server:', context.beforeThinking.server);
  console.log('Insights:', context.beforeThinking.parsed);
}
```

### `thinkAfterTool(toolName, context, result)`

Triggers reflection after tool execution.

- **Returns**: `ThinkingContext` object with reflection and learning
- **Learning**: Captures patterns in debug-thinking graph

```javascript
const reflection = await thinkAfterTool('edit_block', {
  filePath: '/src/file.js',
  oldString: 'foo',
  newString: 'bar'
}, result);

console.log('Reflection:', reflection.afterThinking.reflection);
console.log('Learning:', reflection.afterThinking.learning);
```

### `runBMADCheck(toolName, result, options)`

Validates result against 7-BMAD quality circles.

- **Returns**: BMAD score object with per-circle analysis
- **Circles**: Method, Mad, Model, Mode, Mod, Modd, Methodd

```javascript
const bmad = await runBMADCheck('write_file', result, {
  circles: ['method', 'mad', 'model'], // Check specific circles only
  timeout: 3000
});

if (bmad.passed) {
  console.log('All circles passed!');
} else {
  console.log('Score:', bmad.totalScore, '/', bmad.maxScore);
  for (const [key, score] of Object.entries(bmad.circles)) {
    if (!score.pass) {
      console.log(`Failed: ${score.circle} - ${score.reason}`);
    }
  }
}
```

## ThinkingContext

The `ThinkingContext` class encapsulates all thinking data.

### Properties

- `toolName` - Tool name
- `operationType` - 'tool', 'command', or 'workflow'
- `params` - Tool parameters
- `beforeThinking` - Before thinking data
- `afterThinking` - After thinking data (reflection)
- `bmadScore` - 7-BMAD validation score
- `timestamp` - Context creation time
- `result` - Tool execution result
- `metadata` - Custom metadata

### Methods

```javascript
// State checks
context.wasSkipped()   // Was thinking skipped?
context.wasCached()    // Was thinking cached?
context.wasDegraded()  // Did thinking server fail?
context.passedBMAD()   // Did BMAD check pass?

// Get duration
context.getDuration()  // Operation duration in ms

// Serialization
context.toJSON()       // Convert to JSON
ThinkingContext.fromJSON(json)  // Create from JSON

// Display
context.format()       // Format for display
```

### Static Creators

```javascript
ThinkingContext.createContext(toolName, params)
ThinkingContext.createCommandContext(commandName, params)
ThinkingContext.createWorkflowContext(workflowName, params)
```

## Mode Selection

Thinking modes are automatically selected based on:

1. **Tool Category** - File ops, Process ops, Code ops, Graph ops, Debug ops, Complex ops
2. **Context Factors** - File size, operation count, error state
3. **Configuration** - Overrides and timeouts

### Modes

- **Lightweight** - Quick thinking for simple operations (< 10KB files, 1-2 operations)
- **Standard** - Balanced thinking for typical operations
- **Comprehensive** - Deep thinking for complex operations (> 1MB files, 10+ operations)
- **Combined** - Tractatus (structure) + Sequential (process) for complex scenarios

### Configuration

```javascript
const { configure } = require('../lib/thinking');

// Configure mode selection
configure({
  forceMode: 'comprehensive',  // Force specific mode
  forceServer: 'tractatus',    // Force specific server
  disableThinking: false,      // Disable all thinking
  timeoutMultiplier: 1.5       // Increase timeouts
});
```

## Result Parsing

All thinking server results are parsed for key insights.

```javascript
const { parseThinkingResult, extractKeyInsights } = require('../lib/thinking');

// Parse result
const parsed = parseThinkingResult(result, 'sequential');

// Extract key insights
const insights = extractKeyInsights(parsed);
console.log('Insights:', insights);
// ["Decided to use regex for pattern matching", "Concerned about performance on large files"]
```

### Parsed Results by Server

**Sequential Thinking**:
- `steps` - Thinking steps with revisions
- `decisions` - Decisions made
- `concerns` - Concerns identified
- `conclusion` - Final conclusion

**Tractatus Thinking**:
- `propositions` - Logical propositions
- `structure` - Hierarchical structure
- `insights` - Key insights
- `conclusions` - Logical conclusions

**Debug Thinking**:
- `problems` - Problems identified
- `hypotheses` - Hypotheses generated
- `recommendations` - Recommendations made
- `learning` - Learnings captured

## 7-BMAD Quality Validation

The 7-BMAD system validates quality across 7 circles:

| Circle | Description | Check |
|--------|-------------|-------|
| Method | Implementation Correctness | Is the result correct? |
| Mad | Integration Completeness | Are all integrations complete? |
| Model | Architecture Alignment | Does it follow architecture? |
| Mode | Pattern Consistency | Are patterns consistent? |
| Mod | Maintainability Standards | Is it maintainable? |
| Modd | Extensibility Verification | Is it extensible? |
| Methodd | Documentation Quality | Is documentation complete? |

### Using 7-BMAD

```javascript
const { runBMADCheck, formatBMADResult } = require('../lib/thinking');

const bmad = await runBMADCheck('edit_block', result);

// Format result
console.log(formatBMADResult(bmad));
// 7-BMAD Quality Check: 7/7 (100%)
// ✓ All circles passed
// ✓ Method Circle (Implementation Correctness)
//   Analysis shows correct implementation...
// ✓ Mad Circle (Integration Completeness)
//   Analysis shows complete integration...
```

## Metrics and Logging

Comprehensive metrics tracking for thinking operations.

```javascript
const { getMetrics, formatMetrics } = require('../lib/thinking');

// Get metrics
const metrics = getMetrics();
console.log(formatMetrics(metrics));
// Thinking Metrics:
// ================
// Calls:
//   Total: 42
//   Before Tool: 38
//   After Tool: 4
//   BMAD Checks: 10
// Duration:
//   Total: 12500ms
//   Average: 297.62ms
// Server Distribution:
//   sequential: 25 (59.5%)
//   tractatus: 12 (28.6%)
//   debug: 5 (11.9%)
```

### Metrics Stored

Metrics are automatically saved to `.planning/thinking-metrics.json`.

- **Calls** - Total calls, before/after tool counts, BMAD checks
- **Duration** - Per-server duration, total, average
- **Server Distribution** - Usage percentage per server
- **Cache** - Hit rate, hits, misses
- **BMAD** - Check count, average score
- **Errors** - Error count, degraded calls, error rate
- **Per-Tool Breakdown** - Calls and duration per tool
- **Per-Operation Breakdown** - BMAD scores per operation

## Configuration

### Global Configuration

```javascript
const { configure } = require('../lib/thinking');

configure({
  // Force specific mode
  forceMode: 'lightweight' | 'standard' | 'comprehensive',
  
  // Force specific server
  forceServer: 'sequential' | 'tractatus' | 'debug' | 'combined',
  
  // Disable all thinking
  disableThinking: true,
  
  // Timeout multiplier
  timeoutMultiplier: 2.0  // Double all timeouts
});
```

### Reset Configuration

```javascript
const { resetConfiguration } = require('../lib/thinking');
resetConfiguration();
```

### Get Configuration

```javascript
const { getConfiguration } = require('../lib/thinking');
const config = getConfiguration();
console.log(config);
```

## Advanced Usage

### Manual Thinking Server Calls

```javascript
const { callSequential, callTractatus, callDebug } = require('../lib/thinking/mcp-connector');

// Call sequential thinking
const result = await callSequential('Analyze this code structure', {
  timeout: 5000,
  maxThoughts: 15
});

// Call tractatus thinking
const result = await callTractatus('What is the architecture?', {
  timeout: 5000,
  depth: 7
});

// Call debug thinking
const result = await callDebug('Investigate this error', {
  timeout: 5000,
  action: 'create'  // or 'connect', 'query'
});
```

### Manual Mode Selection

```javascript
const { selectThinkingMode, generatePrompt } = require('../lib/thinking');

// Select mode
const modeConfig = selectThinkingMode('search_code_advanced', {
  pattern: 'async.*function',
  file_pattern: '*.js'
});

// Generate prompt
const prompt = generatePrompt('search_code_advanced', modeConfig, {
  pattern: 'async.*function'
});

// Use prompt with thinking server...
```

### Custom Context Creation

```javascript
const { ThinkingContext } = require('../lib/thinking');

// Create context
const context = ThinkingContext.createContext('my_tool', {
  param1: 'value1'
});

// Add metadata
context.addMetadata('customKey', 'customValue');

// Update with result
context.updateWithResult(result);

// Set BMAD score
context.setBMADScore(bmadResult);

// Serialize
const json = context.toJSON();
fs.writeFileSync('context.json', JSON.stringify(json, null, 2));

// Deserialize
const restored = ThinkingContext.fromJSON(JSON.parse(data));
```

## Integration Points

### In Hooks

```javascript
// hooks/pre-tool-use/thinking-hook.js
const { thinkBeforeTool } = require('../../lib/thinking');

module.exports = async function(toolName, toolInput) {
  const context = await thinkBeforeTool(toolName, toolInput);
  
  if (context.wasSkipped()) {
    return; // Proceed without thinking
  }
  
  // Use thinking insights to modify tool input
  if (context.beforeThinking.parsed) {
    const insights = extractKeyInsights(context.beforeThinking.parsed);
    // Apply insights...
  }
};
```

### In Commands

```javascript
// commands/gsi/my-command.md
const { thinkBeforeTool, thinkAfterTool, runBMADCheck } = require('../../lib/thinking');

// Before execution
const beforeContext = await thinkBeforeTool('start_search', {
  path: cwd,
  pattern: searchTerm
});

// Execute command...

// After execution
const afterContext = await thinkAfterTool('start_search', {
  path: cwd
}, result);

// Validate quality
const bmad = await runBMADCheck('start_search', result);
if (!bmad.passed) {
  console.warn('Quality check failed:', formatBMADResult(bmad));
}
```

### In Workflows

```javascript
// workflows/execute-phase.md
const { thinkBeforeTool, thinkAfterTool } = require('../lib/thinking');

for (const task of tasks) {
  // Think before task
  const beforeContext = await thinkBeforeTool('task', task);
  
  // Execute task...
  
  // Think after task
  const afterContext = await thinkAfterTool('task', task, result);
  
  // Capture learnings
  if (afterContext.afterThinking.learning) {
    console.log('Learned:', afterContext.afterThinking.learning);
  }
}
```

## File Structure

```
lib/thinking/
├── index.js              # Unified API exports
├── orchestrator.js       # Core orchestrator (thinkBeforeTool, thinkAfterTool)
├── mcp-connector.js      # MCP server connector
├── result-parser.js      # Result parser for all servers
├── 7bmad-checker.js      # 7-BMAD quality validator
├── context.js            # ThinkingContext class
├── metrics.js            # Metrics tracking and logging
├── selector.js           # Unified mode selector
├── mode-selector.js      # Mode selection logic
├── categories.js         # Tool categorization
├── server-mapping.js     # Server mapping configuration
└── prompts/              # Prompt templates
    ├── sequential.js     # Sequential thinking prompts
    ├── tractatus.js      # Tractatus thinking prompts
    └── debug.js          # Debug thinking prompts
```

## Best Practices

1. **Always use caching** - Results cached for 5 minutes, reduces thinking server calls
2. **Check for degraded mode** - Thinking servers may fail, handle gracefully
3. **Use 7-BMAD validation** - Ensures quality across all dimensions
4. **Capture learning** - After-tool thinking captures patterns in debug graph
5. **Monitor metrics** - Track thinking performance and server usage
6. **Configure appropriately** - Use mode-specific timeouts and configurations

## Troubleshooting

### Thinking Not Triggering

Check if thinking is disabled:
```javascript
const { getConfiguration } = require('../lib/thinking');
const config = getConfiguration();
console.log('Thinking disabled:', config.disableThinking);
```

### Server Unavailable

Check server availability:
```javascript
const { isServerAvailable, getAvailableServers } = require('../lib/thinking/mcp-connector');

console.log('Sequential available:', isServerAvailable('sequential'));
console.log('Available servers:', getAvailableServers());
```

### High Cache Hit Rate

Clear cache if needed:
```javascript
const { clearAllCaches } = require('../lib/thinking');
clearAllCaches();
```

## See Also

- [THINKING-SERVERS.md](../../docs/THINKING-SERVERS.md) - Thinking server API documentation
- [7-BMAD-CIRCLES.md](../../docs/7-BMAD-CIRCLES.md) - 7-BMAD methodology guide
- [tool-chain-patterns.md](../../docs/tool-chain-patterns.md) - Tool chain patterns with thinking

---

**Phase**: 20-02b (Thinking Orchestrator)
**Status**: Complete
**Last Updated**: 2026-02-15
