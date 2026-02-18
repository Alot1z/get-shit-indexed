# Cognitive-Flow Orchestration Layer

> Unified orchestration for thinking servers, MCP tools, and claudeception modules.

## Overview

The Cognitive-Flow Orchestration Layer provides a unified interface for coordinating multiple cognitive services:

- **Thinking Servers**: Sequential, Tractatus, Debug thinking
- **MCP Tools**: File operations, code search, process management, documentation
- **Claudeception Modules**: Knowledge extraction, pattern learning, reflection capture

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Cognitive Orchestrator                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ PREPARE │→ │ EXECUTE │→ │ REFLECT │→ │  LEARN  │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
│  ┌────▼────────────▼────────────▼────────────▼────┐        │
│  │              Server Pool                        │        │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐    │        │
│  │  │ Sequential│ │ Tractatus │ │   Debug   │    │        │
│  │  └───────────┘ └───────────┘ └───────────┘    │        │
│  └─────────────────────────────────────────────────┘        │
│                                                              │
│  ┌─────────────────────────────────────────────────┐        │
│  │              Tool Optimizer                      │        │
│  │  • Tool Selection Matrix                         │        │
│  │  • Token Cost Estimation                         │        │
│  │  • Batch Optimization                            │        │
│  │  • Parallel Execution Planner                    │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Four-Phase Flow

### Phase 1: PREPARE
**Purpose**: Structure analysis and planning
**Thinking Server**: Tractatus (primary), Sequential (secondary)
**Operations**:
- Analyze file structure
- Identify dependencies
- Plan execution approach

### Phase 2: EXECUTE
**Purpose**: Step-by-step execution
**Thinking Server**: Sequential (primary), Tractatus (secondary)
**Operations**:
- Execute planned steps
- Process files
- Apply changes

### Phase 3: REFLECT
**Purpose**: Problem analysis and verification
**Thinking Server**: Debug (primary), Tractatus (secondary)
**Operations**:
- Analyze results
- Detect issues
- Generate insights

### Phase 4: LEARN
**Purpose**: Knowledge capture and storage
**Thinking Server**: Debug (primary), Sequential (secondary)
**Operations**:
- Capture patterns
- Store in knowledge base
- Update effectiveness metrics

## Server Selection Algorithm

The server pool uses a scoring system to select the best thinking server:

### Scoring Factors

| Factor | Points | Description |
|--------|--------|-------------|
| Health | 0-20 | Server availability and error count |
| Latency | 0-15 | Response time (lower is better) |
| Capability Match | 0-15 | How well capabilities match the operation |
| Phase Affinity | 0-10 | Server's suitability for current phase |
| Load Balance | -10-0 | Penalize overloaded servers |

### Phase Affinity Matrix

| Phase | Primary Server | Secondary Server |
|-------|---------------|------------------|
| PREPARE | Tractatus | Sequential |
| EXECUTE | Sequential | Tractatus |
| REFLECT | Debug | Tractatus |
| LEARN | Debug | Sequential |

### Fallback Chain

Default: `sequential` → `tractatus` → `debug`

## Tool Optimization

### Tool Selection Matrix

| Operation | Preferred Tool | Token Savings |
|-----------|---------------|---------------|
| read-file | mcp__desktop-commander__read_file | 50% |
| write-file | mcp__desktop-commander__write_file | 50% |
| edit-file | mcp__desktop-commander__edit_block | 60% |
| search-code | mcp__code-index-mcp__search_code_advanced | 75% |
| get-symbol | mcp__code-index-mcp__get_symbol_body | 90% |
| get-library-docs | mcp__context7__get-library-docs | 70% |

### Batch Optimization

The tool optimizer can batch multiple operations for efficiency:

```typescript
const optimizer = new ToolOptimizer();

const calls = [
  { server: 'desktop-commander', tool: 'read_file', params: { path: 'a.ts' } },
  { server: 'desktop-commander', tool: 'read_file', params: { path: 'b.ts' } },
  { server: 'desktop-commander', tool: 'read_file', params: { path: 'c.ts' } }
];

const optimization = optimizer.optimizeBatch(calls);
// Result: Batches calls, estimates 85% token savings
```

## API Reference

### CognitiveOrchestrator

```typescript
import { CognitiveOrchestrator, CognitivePhase } from 'cognitive-flow';

// Create orchestrator
const orchestrator = new CognitiveOrchestrator({
  learningEnabled: true,
  parallelTools: true,
  tokenBudget: 50000
});

// Build context
const context = CognitiveOrchestrator.context('analyze-code')
  .withPhase(CognitivePhase.PREPARE)
  .withTargetPath('/path/to/file.ts')
  .withTimeout(10000)
  .build();

// Execute flow
const result = await orchestrator.execute(context);

// Check results
console.log(result.success);
console.log(result.insights);
console.log(result.totalTokens);
```

### ServerPool

```typescript
import { ServerPool } from 'cognitive-flow';

const pool = new ServerPool({
  healthCheckInterval: 30000,
  maxRetries: 3
});

// Start health monitoring
pool.startHealthChecks();

// Select server
const selection = pool.selectServer(context);
console.log(selection.server);      // 'tractatus'
console.log(selection.confidence);  // 0.85
console.log(selection.alternatives); // ['sequential']

// Get stats
const stats = pool.getStats();
```

### ToolOptimizer

```typescript
import { ToolOptimizer } from 'cognitive-flow';

const optimizer = new ToolOptimizer();

// Select tool
const selection = optimizer.selectTool('read-file');
console.log(selection.preferredTool);    // 'mcp__desktop-commander__read_file'
console.log(selection.tokenSavings);     // 50

// Estimate costs
const cost = optimizer.estimateTokenCost('mcp__desktop-commander__read_file');

// Optimize batch
const optimization = optimizer.optimizeBatch(calls);
```

### Quick Execute

```typescript
import { quickCognitiveFlow } from 'cognitive-flow';

const result = await quickCognitiveFlow(
  'analyze-code',
  { filePath: '/path/to/file.ts' },
  { targetPath: '/path/to/file.ts' }
);
```

## CLI Commands

### gsi cognitive flow

Execute a command with cognitive flow enhancement.

```bash
gsi cognitive flow analyze --file path/to/file.ts
```

### gsi cognitive status

Show cognitive system status.

```bash
gsi cognitive status
```

Output:
```json
{
  "serverPool": {
    "totalCalls": 150,
    "avgLatency": 45,
    "serverStats": {
      "sequential": { "calls": 50, "errors": 0 },
      "tractatus": { "calls": 75, "errors": 1 },
      "debug": { "calls": 25, "errors": 0 }
    }
  },
  "toolOptimizer": {
    "totalCalls": 200,
    "totalTokensSaved": 15000
  },
  "activeFlows": 0,
  "learningBufferSize": 5
}
```

### gsi cognitive learn

Trigger learning capture.

```bash
gsi cognitive learn --operation analyze-code
```

### gsi cognitive optimize

Optimize cognitive settings.

```bash
gsi cognitive optimize --reset-stats
gsi cognitive optimize --set-timeout PREPARE=3000
```

## Configuration

### Default Configuration

```typescript
const DEFAULT_FLOW_CONFIG = {
  enabledPhases: ['PREPARE', 'EXECUTE', 'REFLECT', 'LEARN'],
  phaseTimeouts: {
    PREPARE: 5000,
    EXECUTE: 15000,
    REFLECT: 5000,
    LEARN: 3000
  },
  serverPool: {
    healthCheckInterval: 30000,
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 10000,
    fallbackChain: ['sequential', 'tractatus', 'debug']
  },
  learningEnabled: true,
  parallelTools: true,
  maxParallelTools: 5,
  tokenBudget: 50000,
  bmadEnhancement: true,
  verbose: false
};
```

### Custom Configuration

```typescript
const orchestrator = new CognitiveOrchestrator({
  enabledPhases: ['PREPARE', 'EXECUTE'],  // Skip REFLECT and LEARN
  phaseTimeouts: new Map([
    [CognitivePhase.PREPARE, 3000],
    [CognitivePhase.EXECUTE, 20000]
  ]),
  learningEnabled: false,  // Disable learning
  tokenBudget: 100000     // Increase token budget
});
```

## Events

The orchestrator emits events for monitoring and debugging:

```typescript
orchestrator.on('flow:start', (event) => {
  console.log('Flow started:', event.data);
});

orchestrator.on('phase:complete', (event) => {
  console.log(`Phase ${event.phase} completed:`, event.data);
});

orchestrator.on('server:select', (event) => {
  console.log(`Selected server: ${event.server}`);
});

orchestrator.on('learning:capture', (event) => {
  console.log('Learning captured:', event.data);
});
```

### Event Types

| Event | Description |
|-------|-------------|
| `flow:start` | Flow execution started |
| `flow:complete` | Flow execution completed |
| `phase:start` | Phase execution started |
| `phase:complete` | Phase execution completed |
| `phase:error` | Phase execution failed |
| `server:select` | Server selection made |
| `server:call` | Server call initiated |
| `server:result` | Server result received |
| `tool:select` | Tool selection made |
| `tool:call` | Tool call initiated |
| `tool:result` | Tool result received |
| `learning:capture` | Learning entry captured |
| `error` | General error |

## Integration Points

### Thinking Orchestrator Integration

```typescript
import { ThinkingOrchestrator } from '../workflow-modules/thinking-orchestrator.js';
import { CognitiveOrchestrator } from './cognitive-flow.js';

// Use cognitive orchestrator for enhanced thinking
const cognitive = new CognitiveOrchestrator();
const thinking = new ThinkingOrchestrator();

// Cognitive flow enhances thinking with phases
const result = await cognitive.execute(
  CognitiveOrchestrator.context('analyze')
    .withPhase(CognitivePhase.PREPARE)
    .build()
);
```

### Workflow Chainer Integration

```typescript
import { WorkflowChainer } from '../workflow-modules/workflow-chainer.js';
import { CognitiveOrchestrator } from './cognitive-flow.js';

const chainer = new WorkflowChainer();
const cognitive = new CognitiveOrchestrator();

// Add cognitive enhancement to workflow steps
chainer.createChain({
  name: 'cognitive-enhanced',
  chain: [
    { command: 'gsi:plan-phase', cognitive: true },
    { command: 'gsi:execute-phase', cognitive: true },
    { command: 'gsi:verify-work', cognitive: true }
  ]
});
```

### Knowledge Base Integration

```typescript
import { KnowledgeBase } from '../workflow-modules/knowledge-base.js';
import { CognitiveOrchestrator, CognitivePhase } from './cognitive-flow.js';

const knowledge = new KnowledgeBase();
const cognitive = new CognitiveOrchestrator({
  learningEnabled: true
});

// Learning phase stores patterns in knowledge base
cognitive.on('learning:capture', async (event) => {
  const entry = event.data;
  // Store in knowledge base
  await knowledge.storePattern({
    id: entry.id,
    name: `Pattern: ${entry.operation}`,
    category: 'cognitive-patterns',
    description: `Learned from ${entry.operation}`,
    // ...
  });
});
```

## Best Practices

1. **Use Context Builders**: Always use the fluent API for building contexts
2. **Handle Degradation**: Check `result.degraded` and handle gracefully
3. **Monitor Events**: Subscribe to events for debugging and monitoring
4. **Configure Timeouts**: Set appropriate timeouts for each phase
5. **Enable Learning**: Keep learning enabled for continuous improvement
6. **Check Server Health**: Monitor server pool statistics
7. **Optimize Tools**: Use tool optimizer for batch operations

## Troubleshooting

### Phase Timeout

If phases are timing out:
- Increase phase timeout in configuration
- Check server health with `gsi cognitive status`
- Verify MCP servers are running

### High Token Usage

If token usage is high:
- Enable batch optimization
- Use `get_file_summary` instead of reading entire files
- Check tool selection matrix for better alternatives

### Server Unavailable

If servers are marked unavailable:
- Check MCP server logs
- Verify network connectivity
- Use `gsi cognitive optimize --reset-stats` to reset error counts

## Version History

- **1.0.0**: Initial release
  - Four-phase cognitive flow
  - Server pool with health checking
  - Tool optimizer with batch processing
  - Learning capture and storage
  - CLI commands for cognitive operations
