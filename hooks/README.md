# GSI Hooks Documentation

## Overview

This directory contains Claude Code hooks that run at specific points in the agent lifecycle. These hooks enforce GSI patterns and provide useful functionality.

## Hook Files

| File | Type | Purpose |
|------|------|---------|
| `hooks.json` | Configuration | Declares which scripts run at which lifecycle events |
| `mcp-enforcer.js` | PreToolUse | Blocks native tools when MCP alternatives exist |
| `gsi-check-update.js` | SessionStart | Checks for GSI package updates in background |
| `gsi-statusline.js` | StatusLine | Shows model, task, directory, context usage |
| `start-cg-server.ps1` | PreSession | Starts CodeGraphContext Neo4j server |

## MCP Tool Limitations in Hooks

### Why Hooks Use Native Node.js APIs

**Critical constraint:** PreToolUse hooks run BEFORE the tool is executed, which means MCP servers are NOT yet available for the hook itself to use.

```
Hook Execution Flow:
1. Agent calls tool (e.g., Read)
2. PreToolUse hook intercepts
3. Hook decides: allow or block
4. If allowed, tool executes (MCP available AFTER this point)
```

### Native vs MCP in Different Contexts

| Context | MCP Available | Recommended API |
|---------|---------------|-----------------|
| PreToolUse hooks | NO | Native Node.js (fs, path, etc.) |
| Agent execution | YES | MCP tools (desktop-commander, etc.) |
| PostToolUse hooks | YES | MCP tools can be used |

### Design Decisions

1. **mcp-enforcer.js** uses native `fs` and `process.stdin`
   - Must parse tool call before execution
   - Cannot use MCP tools (they're what we're validating!)
   - Blocklist approach: native tool -> MCP replacement mapping

2. **gsi-check-update.js** uses native `fs`, `child_process`
   - Runs at session start, before MCP connection
   - Background process spawned for async check
   - Writes to cache file for statusline to read

3. **gsi-statusline.js** uses native `fs`
   - Must be fast (runs on every status update)
   - Reads cache file from update checker
   - Reads todos directory for current task

## Hook Recommendations for Agents

While hooks themselves cannot use MCP tools, they **recommend** MCP usage to agents:

### mcp-enforcer.js Recommendations

When blocking a native tool, the hook suggests:
- **Token savings**: 80-90% per operation
- **Specific replacement**: e.g., `mcp__desktop-commander__read_file`
- **Batch patterns**: For multiple files, use `read_multiple_files`

### Recommended MCP Patterns

```javascript
// Instead of multiple Read calls:
Read: file1.md
Read: file2.md
Read: file3.md

// Use batch reading (hooks recommend this):
mcp__desktop-commander__read_multiple_files({
  paths: ["file1.md", "file2.md", "file3.md"]
})
// Token savings: 80-90%
```

## Adding New Hooks

### PreToolUse Hooks

Add to `.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "ToolName",
        "hooks": ["node hooks/your-hook.js"]
      }
    ]
  }
}
```

### SessionStart/PreSession Hooks

Add to `hooks/hooks.json`:
```json
{
  "preSession": ["your-script.ps1"],
  "postSession": []
}
```

## Troubleshooting

### Hook Not Running

1. Check file permissions (must be executable)
2. Verify JSON syntax in hooks.json
3. Check Claude Code settings for PreToolUse hooks

### False Positives in mcp-enforcer

If a legitimate native tool use is blocked:
1. Check if MCP alternative truly exists
2. Add exception to `BASH_EXCEPTIONS` if needed
3. Document why native is required

## See Also

- [TOOL-PRIORITY-RULES.md](../docs/TOOL-PRIORITY-RULES.md) - MCP tool priority
- [MCP-TOKEN-BENCHMARK.md](../docs/MCP-TOKEN-BENCHMARK.md) - Token savings data
- [CODE-INDEX-MCP-GUIDE.md](../docs/CODE-INDEX-MCP-GUIDE.md) - CI tools reference
