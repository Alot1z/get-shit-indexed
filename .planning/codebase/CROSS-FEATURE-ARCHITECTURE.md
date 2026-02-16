# Cross-Feature Architecture

## Overview

The GSI Cross-Feature Enhancement System enables all GSI features to use and enhance each other, creating a virtuous cycle of improvement.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Enhancement Orchestrator                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     Feature Registry                         │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ │ │
│  │  │Thinking │ │Patterns │ │   MCP   │ │Reflect  │ │Complex │ │ │
│  │  │ System  │ │Learning │ │ Android │ │ System  │ │  Pred  │ │ │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └───┬────┘ │ │
│  └───────┼──────────┼──────────┼──────────┼──────────┼───────┘ │
│          │          │          │          │          │         │
│  ┌───────┴──────────┴──────────┴──────────┴──────────┴───────┐ │
│  │                    Enhancement Layer                       │ │
│  │  • Thinking ←→ Patterns (mutual prediction/analysis)       │ │
│  │  • All Features ←→ MCP (optimal tool selection)            │ │
│  │  • Reflection → All (learning capture)                     │ │
│  │  • Complexity → Thinking (auto-trigger)                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Enhancement Metrics                       │ │
│  │  Token Savings | Cross-Feature Calls | Enhancement Chains   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Feature Registry Structure

### Location
`lib/enhancement/feature-registry.js`

### Registered Features

| Feature | Description | Servers | Capabilities |
|---------|-------------|---------|--------------|
| thinking | Multi-server thinking | sequential, tractatus, debug | decompose, analyze, debug |
| patterns | Pattern learning | - | predict, learn, visualize |
| mcp | MCP tool coordination | dc, ci, cg | fileOps, codeSearch, graphQuery |
| reflection | Post-operation capture | debug-thinking | capture, patterns, insights |
| complexity | Pre-execution scoring | all thinking | score, autoSplit, adapt |
| commandThinking | Command enhancement | all thinking | wrap, inject, metrics |
| workflowThinking | Workflow phases | all thinking | validate, inject |
| gsdIntegration | GSD monitoring | - | checkUpdates, analyze, suggest |

### Feature Definition Schema

```javascript
{
  name: 'Feature Name',
  description: 'What the feature does',
  servers: ['list', 'of', 'mcp', 'servers'],
  capabilities: {
    capName: { server: 'which', description: 'what it does' }
  },
  triggers: ['when', 'to', 'activate'],
  location: 'lib/path/',
  status: 'active' | 'inactive' | 'development'
}
```

## Enhancement Flow

### Before Operation

```
1. Operation Request
   ↓
2. Query Pattern Predictor
   - Predict next operation
   - Identify risks
   - Suggest optimal approach
   ↓
3. Check Complexity Score
   - If > 60: Consider auto-split
   - If > 30: Trigger comprehensive thinking
   ↓
4. Select Thinking Mode
   - Use predictions in prompt
   - Include risk warnings
   ↓
5. Execute Operation
```

### During Operation

```
1. Select Optimal MCP Tools
   - Check server health
   - Use fallback chains if needed
   - Maximize token savings
   ↓
2. Execute with Selected Tools
   - Track MCP usage
   - Monitor for errors
   ↓
3. Capture Results
```

### After Operation

```
1. Capture Reflection
   - Success/failure analysis
   - Pattern extraction
   - Insight generation
   ↓
2. Record for Pattern Learning
   - Store operation sequence
   - Track outcomes
   ↓
3. Trigger Thinking After Tool
   - Debug for error analysis
   - Learning capture
```

## Cross-Feature Connections

### Thinking ←→ Patterns (Bidirectional)

```
Thinking enhances Patterns:
┌──────────────────────────────────────────────────────────────┐
│ Pattern Recognition                                          │
│   ↓                                                          │
│ Tractatus: Analyze pattern structure                         │
│ Sequential: Identify pattern sequences                       │
│ Debug: Analyze error patterns                                │
│   ↓                                                          │
│ Enhanced patterns with quality analysis                      │
└──────────────────────────────────────────────────────────────┘

Patterns enhance Thinking:
┌──────────────────────────────────────────────────────────────┐
│ Before Tool Call                                             │
│   ↓                                                          │
│ Pattern Predictor: "Expected operation: X (85% confidence)"  │
│ Pattern Predictor: "Risk: Y has failed 3 times before"       │
│   ↓                                                          │
│ Thinking prompt includes predictions and warnings            │
└──────────────────────────────────────────────────────────────┘
```

### MCP → All Features (Tool Optimization)

```
┌──────────────────────────────────────────────────────────────┐
│ MCP Coordinator                                              │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │Desktop Cmdr │  │ Code-Index  │  │CodeGraph Ctx│         │
│  │  80% savings│  │  70% savings│  │  60% savings│         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Optimal Tool Selection                  │    │
│  │  • Check pattern predictions for likely operations   │    │
│  │  • Check complexity prediction for load              │    │
│  │  • Check available MCP servers                       │    │
│  │  • Select optimal mode and tools                     │    │
│  │  • Provide fallback chains when servers unavailable  │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Reflection → All (Learning)

```
┌──────────────────────────────────────────────────────────────┐
│ PostToolUse Hook                                             │
│   ↓                                                          │
│ Capture: { tool, input, output, timestamp }                  │
│   ↓                                                          │
│ Extract Patterns:                                            │
│   - SEQUENCE: repeated operation chains                      │
│   - CONDITIONAL: context-result correlations                 │
│   - ERROR_RECOVERY: how errors were resolved                 │
│   ↓                                                          │
│ Generate Insights:                                           │
│   - OPTIMIZATION: ways to improve                            │
│   - SAFETY: risks to avoid                                   │
│   - CLARITY: better approaches                               │
│   ↓                                                          │
│ Store in:                                                    │
│   - ~/.debug-thinking-mcp/reflections/ (debug graph)         │
│   - .planning/patterns/ (pattern storage)                    │
└──────────────────────────────────────────────────────────────┘
```

## Token Savings from Coordination

### MCP vs Native Tools

| Operation | Native Tokens | MCP Tokens | Savings |
|-----------|---------------|------------|---------|
| Read file | ~15K | ~3K | 80% |
| Read 3 files | ~45K | ~5K | 89% |
| Code search | ~15K | ~3K | 80% |
| Directory list | ~10K | ~2K | 80% |
| Process start | ~8K | ~2K | 75% |

### Feature Coordination Savings

| Enhancement | Estimated Savings |
|-------------|-------------------|
| Pattern prediction prevents exploration | 500-2000 tokens |
| Thinking focuses analysis | 1000-5000 tokens |
| MCP tool selection | 80-90% per operation |
| Batch operations | 50-70% reduction |

### Monthly Estimate

```
Average session: 50 operations
Average savings per operation: 10K tokens
Daily sessions: 5
Monthly working days: 20

Monthly savings: 50 * 10K * 5 * 20 = 50M tokens
At $3/1M tokens: $150/month saved
```

## Integration Examples

### Example 1: Execute Plan with Full Enhancement

```javascript
const { enhanceWithFeatures } = require('lib/enhancement');

// Before: Direct execution
const result = await executePlan(planPath);

// After: Enhanced execution
const enhanced = await enhanceWithFeatures('execute-plan', {
  planPath,
  complexity: 65
}, async (ctx) => {
  return executePlan(ctx.planPath);
});

// enhanced.enhancements = [
//   { feature: 'patterns', phase: 'before', type: 'prediction' },
//   { feature: 'thinking', phase: 'before', type: 'cognitive' },
//   { feature: 'mcp', phase: 'during', type: 'tool-optimization' },
//   { feature: 'reflection', phase: 'after', type: 'capture' }
// ]
// enhanced.metrics.tokenSavings = 25000
```

### Example 2: Pattern-Guided Thinking

```javascript
const { thinkBeforeTool } = require('lib/thinking/orchestrator');

// Thinking automatically queries patterns
const thinking = await thinkBeforeTool('read_file', {
  filePath: '/src/components/Button.tsx'
});

// thinking.beforeThinking.patterns = {
//   nextOperation: 'edit_file',
//   confidence: 0.85,
//   risks: [{ reason: 'Large file, consider batching', confidence: 0.7 }]
// }
```

### Example 3: MCP Tool Selection

```javascript
const { selectOptimalTool } = require('lib/enhancement');

const selection = selectOptimalTool('file', {
  fileCount: 3,
  complexity: 40
});

// selection = {
//   recommended: 'mcp__desktop-commander__read_multiple_files',
//   server: 'desktop-commander',
//   tokenSavings: 80,
//   reasoning: ['Batch operation for multiple files']
// }
```

## Troubleshooting

### Feature Not Enhancing

1. **Check feature status**
   ```javascript
   const health = registry.checkFeatureHealth('thinking');
   // { healthy: true/false, issues: [...] }
   ```

2. **Check server health**
   ```javascript
   const isHealthy = checkServerHealth('sequential-thinking');
   // true/false
   ```

3. **Check enhancement opportunities**
   ```javascript
   const opportunities = getEnhancementOpportunities('execute-plan', context);
   // [{ feature, reason, priority }]
   ```

### Low Token Savings

1. **Verify MCP tools being used**
   - Check tool names start with `mcp__`
   - Native tools don't provide savings

2. **Check batch operations**
   - Use `read_multiple_files` for multiple files
   - Group related operations

3. **Review fallback usage**
   - Fallbacks to native tools reduce savings
   - Check server health report

### Pattern Predictions Inaccurate

1. **Check pattern storage**
   - `.planning/patterns/` should contain learned patterns
   - Patterns need 5+ operations to become reliable

2. **Review prediction confidence**
   - Low confidence (< 0.5) should be treated as suggestions
   - High confidence (> 0.8) can be trusted

3. **Force pattern relearning**
   ```javascript
   const { recognizePatternsWithThinking } = require('lib/pattern-learning/recognition');
   await recognizePatternsWithThinking(operations, metrics, { useThinking: true });
   ```

## Configuration

### Enable/Disable Features

```javascript
const { getRegistry } = require('lib/enhancement');

const registry = getRegistry();
registry.features.thinking.status = 'inactive'; // Disable thinking
```

### Adjust Complexity Thresholds

```javascript
const { getConfiguration, configure } = require('lib/thinking/selector');

configure({
  forceMode: 'comprehensive',  // Force comprehensive thinking
  disableThinking: false,      // Enable/disable
  timeoutMultiplier: 1.5       // 50% more timeout
});
```

### Customize Fallback Chains

```javascript
// In mcp-coordinator.js
const FALLBACK_CHAINS = {
  'desktop-commander': ['native'],
  'code-index-mcp': ['native-grep', 'native-glob'],
  'CodeGraphContext': ['code-index-mcp', 'native']
};
```

## Metrics and Monitoring

### View Enhancement Metrics

```bash
gsi progress enhancement
```

### Metrics Stored

- `.planning/enhancement-metrics.json` - All enhancement metrics
- `.planning/thinking-metrics.json` - Thinking-specific metrics
- `.planning/pattern-metrics.json` - Pattern learning metrics
- `~/.debug-thinking-mcp/` - Debug graph with reflections

### Key Metrics to Track

1. **Cross-feature call success rate** - Should be > 95%
2. **Token savings rate** - Should be > 70%
3. **Pattern prediction accuracy** - Should improve over time
4. **Thinking enhancement quality** - Track via 7-BMAD scores

---

**Created:** 2026-02-16
**Phase:** 20-07
**Version:** 1.0
