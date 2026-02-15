# Command Thinking Wrapper

Add cognitive enhancement to any GSI command execution.

## Overview

The Command Thinking Wrapper provides a `withThinking()` function that wraps any command function with:
- **Pre-command thinking**: Analysis before execution
- **Context injection**: Enhanced execution context
- **Post-command reflection**: Learning after execution
- **Metrics tracking**: Per-command performance data

## Installation

```bash
# Already included in lib/command-thinking/
npm install gsi
```

## Quick Start

### Basic Usage

```javascript
const { withThinking } = require('lib/command-thinking');

// Define a command function
async function executePlan(planId, options) {
  // Command logic here
  return { success: true, results: [] };
}

// Wrap with thinking
const wrappedExecute = withThinking(executePlan);

// Use wrapped command
const result = await wrappedExecute('plan-123', { verbose: true });
// result: { result: {...}, thinking: { pre: {...}, post: {...} } }
```

### Custom Options

```javascript
const wrapped = withThinking(executePlan, {
  mode: 'COMPREHENSIVE',  // Override default mode
  skipThinking: false,    // Force enable thinking
  context: {              // Additional context
    projectId: 'proj-456',
    userId: 'user-789'
  }
});
```

### Create Wrapped Command

```javascript
const { createWrappedCommand } = require('lib/command-thinking');

// Create with default options
const wrapped = createWrappedCommand(executePlan, {
  mode: 'STANDARD'
});

// Use with default options
const result = await wrapped('plan-123');
```

## Thinking Modes

The wrapper supports four thinking intensity levels:

### COMPREHENSIVE
- **Servers**: Sequential + Tractatus + Debug
- **7-BMAD**: Full validation
- **Use Case**: Complex planning and architectural decisions
- **Commands**: plan-phase, discuss-phase, create-phase

### STANDARD
- **Servers**: Sequential + Debug
- **7-BMAD**: Partial validation
- **Use Case**: Standard execution workflows
- **Commands**: execute-phase, execute-plan, execute-task

### LIGHTWEIGHT
- **Servers**: Sequential only
- **7-BMAD**: No validation
- **Use Case**: Quick operations and queries
- **Commands**: status, list-phases, show-plan, progress

### NONE
- **Servers**: None
- **7-BMAD**: No validation
- **Use Case**: Simple commands and help systems
- **Commands**: help, version

## API Reference

### withThinking(commandFn, options)

Wrap a command function with thinking enhancement.

**Parameters:**
- `commandFn` (Function): Command function to wrap
- `options` (Object): Wrapper options
  - `mode` (string): Thinking mode (COMPREHENSIVE, STANDARD, LIGHTWEIGHT, NONE)
  - `skipThinking` (boolean): Skip thinking entirely
  - `context` (object): Additional execution context

**Returns:** Wrapped function with thinking enhancement

**Example:**
```javascript
const wrapped = withThinking(myCommand, {
  mode: 'STANDARD',
  context: { userId: 'user-123' }
});
```

### createWrappedCommand(commandFn, defaultOptions)

Create a wrapped command with persistent default options.

**Parameters:**
- `commandFn` (Function): Command function to wrap
- `defaultOptions` (Object): Default options for this command

**Returns:** Wrapped function with `commandName` and `defaultOptions` properties

**Example:**
```javascript
const wrapped = createWrappedCommand(myCommand, {
  mode: 'COMPREHENSIVE'
});

console.log(wrapped.commandName);  // 'myCommand'
console.log(wrapped.defaultOptions);  // { mode: 'COMPREHENSIVE' }
```

### isWrapped(commandFn)

Check if a command is already wrapped (prevent double-wrapping).

**Parameters:**
- `commandFn` (Function): Command function to check

**Returns:** Boolean indicating if command is wrapped

**Example:**
```javascript
if (!isWrapped(myCommand)) {
  myCommand = withThinking(myCommand);
}
```

## Context Injection

The wrapper injects thinking results into command execution context:

```javascript
const { injectThinkingContext, extractThinkingContext } = require('lib/command-thinking');

// Inject thinking into arguments
const enhancedArgs = injectThinkingContext([arg1, arg2], thinkingResult);
// Result: [{ _thinking: thinkingResult }, arg1, arg2]

// Extract thinking from result
const thinking = extractThinkingContext(result);
// Result: { pre: {...}, post: {...} }
```

## Metrics

Track per-command thinking metrics:

```javascript
const { getCommandMetrics, getSummary } = require('lib/command-thinking');

// Get metrics for specific command
const metrics = getCommandMetrics('execute-plan');
console.log(metrics);
// {
//   totalCalls: 45,
//   successfulCalls: 42,
//   failedCalls: 3,
//   avgDuration: 1234,
//   modeDistribution: { STANDARD: 30, COMPREHENSIVE: 15 },
//   cacheHitRate: 65
// }

// Get overall summary
const summary = getSummary();
console.log(summary);
// {
//   totalCommands: 29,
//   totalCalls: 1234,
//   successRate: 95,
//   avgDuration: 987,
//   cacheHitRate: 62
// }
```

## Examples

### Example 1: Wrap a Planning Command

```javascript
const { withThinking } = require('lib/command-thinking');

async function planPhase(phaseId, options) {
  // Create plan for phase
  const plan = await createPhasePlan(phaseId, options);
  return { success: true, plan };
}

// Wrap with comprehensive thinking
const wrappedPlan = withThinking(planPhase, {
  mode: 'COMPREHENSIVE'
});

// Execute with thinking
const result = await wrappedPlan('phase-20', { detailed: true });
console.log(result.thinking.pre);
// { server: 'tractatus', parsed: { summary: '...', recommendations: [...] } }
```

### Example 2: Wrap an Execution Command

```javascript
const { createWrappedCommand } = require('lib/command-thinking');

async function executeTask(taskId) {
  // Execute task
  const result = await runTask(taskId);
  return result;
}

// Create with standard thinking
const wrappedExecute = createWrappedCommand(executeTask, {
  mode: 'STANDARD'
});

// Execute
const result = await wrappedExecute('task-456');
console.log(result.thinking.post.reflection);
// { learning: ['Task completed successfully', 'Patterns identified...'] }
```

### Example 3: Custom Mode Configuration

```javascript
const { setCommandMode, getModeForCommand } = require('lib/command-thinking');

// Set custom mode for specific command
setCommandMode('my-special-command', 'COMPREHENSIVE');

// Get mode for command
const mode = getModeForCommand('my-special-command');
console.log(mode);  // 'COMPREHENSIVE'
```

### Example 4: Extract Insights and Warnings

```javascript
const { extractInsights, extractWarnings } = require('lib/command-thinking');

// Execute wrapped command
const result = await wrappedCommand('plan-123');

// Extract insights
const insights = extractInsights(result.thinking);
console.log(insights);
// ['Pre: Consider edge cases...', 'Learned: Cache effective for...']

// Extract warnings
const warnings = extractWarnings(result.thinking);
console.log(warnings);
// ['Pre: High complexity detected', 'Post: Review integration points']
```

## Integration with GSI Commands

All 29 GSI commands can be wrapped:

```javascript
const { withThinking, getModeForCommand } = require('lib/command-thinking');

// Auto-wrap all GSI commands
const gsiCommands = require('commands/gsi');

Object.entries(gsiCommands).forEach(([name, commandFn]) => {
  const mode = getModeForCommand(name);
  gsiCommands[name] = withThinking(commandFn, { mode });
});

// Use wrapped commands
const result = await gsiCommands['execute-phase']('phase-20', { task: 'all' });
```

## Data Persistence

Metrics are stored in `.planning/command-thinking-metrics.json`:

```json
{
  "execute-plan": {
    "totalCalls": 45,
    "successfulCalls": 42,
    "failedCalls": 3,
    "totalDuration": 55530,
    "avgDuration": 1234,
    "modeDistribution": {
      "STANDARD": 30,
      "COMPREHENSIVE": 15
    },
    "cacheHits": 30,
    "cacheMisses": 15,
    "lastUsed": "2026-02-16T10:30:00.000Z",
    "history": [...]
  }
}
```

## Performance Considerations

- **Caching**: Thinking results are cached for 5 minutes
- **Timeouts**: Default timeout is 3 seconds per thinking server call
- **Graceful Degradation**: Failed thinking calls don't break command execution
- **Mode Selection**: Use appropriate mode to balance thinking depth vs speed

## Error Handling

The wrapper handles errors gracefully:

```javascript
try {
  const result = await wrappedCommand('plan-123');
} catch (error) {
  // Error from command execution
  // Thinking metrics still recorded
  console.error('Command failed:', error.message);
}
```

Failed thinking calls are marked with `degraded: true`:

```javascript
result.thinking.pre = {
  error: 'Thinking server unavailable',
  degraded: true
};
```

## CLI Integration

Metrics can be viewed via GSI CLI:

```bash
# View metrics for specific command
gsi thinking-metrics execute-plan

# View top commands
gsi thinking-metrics --top 10

# View summary
gsi thinking-metrics --summary

# Reset metrics
gsi thinking-metrics --reset execute-plan
```

## See Also

- [Thinking Orchestrator](../thinking/README.md) - Low-level thinking API
- [Thinking Mode Selector](../thinking/selector.js) - Mode selection logic
- [7-BMAD Methodology](../../.planning/docs/7-BMAD.md) - Quality framework
