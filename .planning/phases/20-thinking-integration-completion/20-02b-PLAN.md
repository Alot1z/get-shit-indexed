# Phase 20-02b: Thinking Orchestrator

## Objective
Create the thinking orchestrator that calls MCP thinking servers before tool execution.

## Problem Analysis

**Current State:**
- No orchestrator to call thinking servers
- Mode selector exists but isn't connected to actual thinking calls
- Need to invoke MCP servers with generated prompts

**Solution:**
Create an orchestrator that uses the mode selector to determine what to think about, then calls the appropriate thinking MCP server.

## Tasks

### Task 1: Create MCP Server Connector
```
<task>
Create connector module for calling MCP thinking servers.

1. Create lib/thinking/mcp-connector.js
2. Import MCP tools:
   - mcp__sequential-thinking__sequentialthinking
   - mcp__tractatus-thinking__tractatus_thinking
   - mcp__debug-thinking__debug_thinking
3. Implement callSequential(prompt, options)
4. Implement callTractatus(prompt, options)
5. Implement callDebug(prompt, options)
6. Add timeout handling (3s default)
7. Add error handling with graceful degradation
</task>

<files>
lib/thinking/mcp-connector.js
</files>

<acceptance>
- All three MCP servers callable
- Timeout handling works
- Graceful degradation on failure
</acceptance>
```

### Task 2: Create Thinking Orchestrator Core
```
<task>
Create the core thinking orchestrator.

1. Create lib/thinking/orchestrator.js
2. Import mode selector and MCP connector
3. Implement thinkBeforeTool(toolName, context):
   - Select mode using selector
   - Generate prompt from template
   - Call appropriate MCP server
   - Parse and return thinking result
4. Implement thinkAfterTool(toolName, context, result):
   - Analyze result for patterns
   - Call debug-thinking for reflection
   - Store learning
5. Add result caching
</task>

<files>
lib/thinking/orchestrator.js
</files>

<acceptance>
- thinkBeforeTool works for all tools
- thinkAfterTool captures reflection
- Result caching implemented
</acceptance>
```

### Task 3: Implement Result Parser
```
<task>
Create parser for thinking server results.

1. Create lib/thinking/result-parser.js
2. Implement parseSequentialResult(result):
   - Extract key steps
   - Identify decisions made
   - Extract concerns
3. Implement parseTractatusResult(result):
   - Extract propositions
   - Identify structure insights
   - Extract logical conclusions
4. Implement parseDebugResult(result):
   - Extract problem analysis
   - Identify hypotheses
   - Extract recommendations
5. Add unified parseThinkingResult(result, serverType)
</task>

<files>
lib/thinking/result-parser.js
</files>

<acceptance>
- All server result types parsed
- Key information extracted
- Unified API available
</acceptance>
```

### Task 4: Add 7-BMAD Integration
```
<task>
Integrate 7-BMAD circle checks into thinking orchestrator.

1. Update lib/thinking/orchestrator.js
2. Add 7-BMAD circle prompts:
   - Method: "Is the implementation correct?"
   - Mad: "Are all integrations complete?"
   - Model: "Does it follow architecture?"
   - Mode: "Are patterns consistent?"
   - Mod: "Is it maintainable?"
   - Modd: "Is it extensible?"
   - Methodd: "Is documentation complete?"
3. Add runBMADCheck(toolName, result) function
4. Add BMAD score calculation
5. Integrate with thinking results
</task>

<files>
lib/thinking/orchestrator.js
lib/thinking/7bmad-checker.js
</files>

<acceptance>
- 7-BMAD prompts integrated
- BMAD check function works
- Score calculation implemented
</acceptance>
```

### Task 5: Create Thinking Context Object
```
<task>
Create thinking context object for passing between operations.

1. Create lib/thinking/context.js
2. Define ThinkingContext class:
   - toolName: string
   - operationType: string
   - beforeThinking: object
   - afterThinking: object
   - bmadScore: number
   - timestamp: Date
3. Implement createContext(toolName, params)
4. Implement updateWithResult(context, result)
5. Implement toJSON/fromJSON for serialization
6. Export for hook integration
</task>

<files>
lib/thinking/context.js
</files>

<acceptance>
- ThinkingContext class created
- Serialization works
- Exported for hooks
</acceptance>
```

### Task 6: Add Metrics and Logging
```
<task>
Add metrics and logging to thinking orchestrator.

1. Create lib/thinking/metrics.js
2. Track metrics:
   - Thinking calls per session
   - Thinking duration per tool
   - Server usage distribution
   - BMAD score averages
   - Degraded mode frequency
3. Implement logThinking(toolName, duration, result)
4. Implement getMetrics() for reporting
5. Store in .planning/thinking-metrics.json
</task>

<files>
lib/thinking/metrics.js
.planning/thinking-metrics.json
</files>

<acceptance>
- All metrics tracked
- Logging works
- Storage implemented
</acceptance>
```

### Task 7: Export Unified API
```
<task>
Create unified export for thinking orchestrator.

1. Create lib/thinking/index.js
2. Export:
   - thinkBeforeTool
   - thinkAfterTool
   - ThinkingContext
   - getMetrics
   - runBMADCheck
3. Re-export selector functions
4. Re-export parser functions
5. Document API in README
</task>

<files>
lib/thinking/index.js
lib/thinking/README.md
</files>

<acceptance>
- Unified API exported
- All functions accessible
- API documented
</acceptance>
```

## Verification

**Must Have:**
- [ ] MCP connector works for all servers
- [ ] Orchestrator calls thinking before tools
- [ ] Result parser extracts insights
- [ ] 7-BMAD integration complete
- [ ] Metrics tracked

## Estimated Duration
12-15 minutes (7 tasks)

## Dependencies
- Phase 20-02a (Thinking Mode Selector)
