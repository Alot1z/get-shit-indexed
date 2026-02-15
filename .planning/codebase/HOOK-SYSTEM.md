# GSI Hook System Documentation

## Overview

The GSI (Get Shit Indexed) hook system integrates thinking servers into Claude Code's tool execution flow. Hooks are registered in `~/.claude/settings.json` and automatically invoked during tool operations.

## Architecture

```
User invokes tool
    ↓
PreToolUse hooks execute
    ├─ complexity-check.js (Task, execute-phase, execute-plan)
    └─ thinking-invoke.js (all tools)
    ↓
Tool executes
    ↓
PostToolUse hooks execute
    └─ reflection-capture.js (all tools)
```

## Hook Registration

Hooks are registered in `~/.claude/settings.json` under the `hooks` key:

```json
{
  "hooks": {
    "preToolUse": [
      {
        "pattern": "ToolNamePattern",
        "command": "node",
        "args": ["path/to/hook.js"],
        "timeout": 5000,
        "enabled": true
      }
    ],
    "postToolUse": [
      {
        "pattern": ".*",
        "command": "node",
        "args": ["path/to/hook.js"],
        "timeout": 5000,
        "enabled": true
      }
    ]
  }
}
```

### Registration Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| pattern | string | Yes | Regex matching tool names |
| command | string | Yes | Command to execute hook |
| args | array | Yes | Hook script path |
| timeout | number | No | Execution timeout (ms), default 5000 |
| enabled | boolean | No | Whether hook is active, default true |

## Available Hooks

### 1. Complexity Check Hook

**File:** `hooks/pre-tool-use/complexity-check.js`

**Pattern:** `Task|execute-phase|execute-plan`

**Purpose:** Analyzes plan complexity before execution and provides scoring.

**Implementation:** Uses Phase 17 complexity prediction system.

**Triggers:**
- Task tool invocations
- Phase execution commands
- Plan execution commands

### 2. Thinking Invoke Hook

**File:** `hooks/pre-tool-use/thinking-invoke.js`

**Pattern:** `.*` (all tools)

**Purpose:** Categorizes tools and logs appropriate thinking server selection.

**Tool Categorization:**

| Tool Category | Tools | Thinking Server | Rationale |
|---------------|-------|-----------------|-----------|
| file | Read, Write, Edit, mcp__desktop-commander__* | sequential-thinking | File operations benefit from sequential decomposition |
| code | mcp__code-index-mcp__*, Grep, Glob | tractatus-thinking | Code analysis benefits from structural decomposition |
| analysis | Task, execute-phase, plan-phase | sequential-thinking | Complex analysis benefits from multi-step thinking |
| relationship | mcp__CodeGraphContext__* | tractatus-thinking | Relationship analysis benefits from logical structure |
| other | *everything else* | None | Simple operations don't require thinking |

**Logging:**
- Logs to `~/.claude/logs/thinking-invoke-hook.log`
- Records tool name, category, and selected thinking server

### 3. Reflection Capture Hook

**File:** `hooks/post-tool-use/reflection-capture.js`

**Pattern:** `.*` (all tools)

**Purpose:** Captures learnings after tool execution for debug-thinking graph.

**Trigger Conditions:**

1. **Error occurred** - Tool execution failed
2. **Significant changes** - Task, Write, Edit operations
3. **Thinking enabled** - Code search, analysis tools

**Observation Data:**
```javascript
{
  type: "observation",
  toolName: "string",
  reflectionReason: "error|significant-change|thinking-enabled",
  timestamp: "ISO date",
  details: {
    hadError: boolean,
    errorMessage: string | null,
    resultType: string
  }
}
```

**Logging:**
- Logs to `~/.claude/reflections/observations.jsonl`
- Creates debug-thinking nodes for pattern learning

## Integration with Thinking Servers

### PreToolUse Flow

1. **Hook categorizes tool** → Determines thinking server type
2. **Logs categorization** → thinking-invoke-hook.log
3. **Tool executes** → Uses thinking server via MCP tools during execution

### PostToolUse Flow

1. **Tool completes** → Returns result or error
2. **Hook captures observation** → Creates debug-thinking node
3. **Logs reflection** → reflection-capture-hook.log + observations.jsonl

### Thinking Server Call Pattern

**Hooks DON'T directly call thinking servers.** Instead:

1. Hook categorizes and logs
2. During tool execution, MCP tools invoke thinking servers:
   - `mcp__sequential-thinking__sequentialthinking`
   - `mcp__tractatus-thinking__tractatus_thinking`
   - `mcp__debug-thinking__debug_thinking`

**Why this design:**
- Hooks run as separate processes without MCP access
- Thinking servers require active MCP connections
- Separation allows hooks to be lightweight

## Troubleshooting

### Hook Not Invoked

**Symptoms:** No log files created, hooks appear ignored

**Diagnosis:**
1. Check `~/.claude/settings.json` contains `hooks` section
2. Verify hook file paths are absolute paths
3. Check hook scripts have execute permissions
4. Look for hook errors in Claude logs

**Solution:**
```bash
# Re-run registration script
node .planning/phases/20-thinking-integration-completion/add-hooks.js
```

### Hook Throws Error

**Symptoms:** Tool execution fails, hook error in stderr

**Diagnosis:**
1. Run hook directly: `node hooks/pre-tool-use/thinking-invoke.js`
2. Check for syntax errors: `node -c hooks/pre-tool-use/thinking-invoke.js`
3. Review log files in `~/.claude/logs/`

**Solution:** Fix hook script error, hooks must exit successfully (code 0)

### Thinking Server Not Called

**Symptoms:** Hook logs show categorization but no thinking happens

**Diagnosis:** This is expected behavior. Hooks log categorization but don't invoke servers directly.

**Solution:** Thinking servers are called via MCP tools during tool execution, not by hooks.

## Extending the Hook System

### Adding a New PreToolUse Hook

1. Create hook script: `hooks/pre-tool-use/my-hook.js`
2. Implement hook interface:
   ```javascript
   #!/usr/bin/env node
   // Read tool invocation from stdin
   let input = '';
   for await (const chunk of process.stdin) {
     input += chunk;
   }
   const invocation = JSON.parse(input);
   
   // Process tool invocation
   console.error(`[MY-HOOK] Processing ${invocation.toolName}`);
   
   // Exit successfully
   process.exit(0);
   ```
3. Register in `~/.claude/settings.json`:
   ```json
   {
     "hooks": {
       "preToolUse": [
         {
           "pattern": "ToolPattern",
           "command": "node",
           "args": ["C:\\path\\to\\my-hook.js"],
           "enabled": true
         }
       ]
     }
   }
   ```

### Adding a New PostToolUse Hook

Same process as PreToolUse, but register under `postToolUse` array.

### Hook Patterns

**Common Patterns:**

| Pattern | Matches | Use Case |
|---------|---------|----------|
| `.*` | All tools | Universal hooks |
| `Task|execute-phase|execute-plan` | Planning tools | Complexity analysis |
| `Read|Write|Edit` | File operations | File tracking |
| `mcp__.*` | MCP tools only | MCP-specific behavior |
| `^(?!Bash).*$` | All except Bash | Exclusion pattern |

## Performance Considerations

**Hook Timeout:** Default 5000ms (5 seconds)

- Hooks must complete quickly or tool execution is delayed
- Long-running operations should be async or skipped
- Logging is lightweight and fast

**Hook Overhead:** ~50-100ms per hook

- Two preToolUse hooks = ~100-200ms before tool
- One postToolUse hook = ~50-100ms after tool
- Total overhead: ~150-300ms per tool operation

**Optimization Tips:**
- Use simple pattern matching
- Avoid heavy computation in hooks
- Log asynchronously (fire-and-forget)
- Keep hooks stateless

## Related Documentation

- **Phase 17:** Complexity Prediction System (uses complexity-check.js)
- **Phase 5:** Thinking Server Integration (sequential, tractatus, debug)
- **Phase 15:** Thinking Server Enforcement (7-BMAD methodology)
- **hooks/schemas/hook-schema.json:** JSON schema for validation

## Summary

The GSI hook system provides:
- **Tool categorization** for thinking server selection
- **Complexity analysis** for planning operations
- **Reflection capture** for pattern learning
- **Logging infrastructure** for debugging

Hooks are lightweight, fast, and non-blocking. They enable the thinking infrastructure without impacting tool execution performance.
