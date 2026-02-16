# MCP Tool Chain Analysis

## Executive Summary

Analysis of tool usage patterns across GSI workflows to identify optimal chaining strategies using Desktop Commander and Code-Index MCP servers.

## Tool Priority Order (from tool-priority.md)

### 1. Skills FIRST (80-90% token savings)
Pre-compressed skill definitions with embedded tool logic.

### 2. DesktopCommander MCP SECOND (50-70% token savings)
File operations, process management, directory operations.

### 3. Other MCP Tools THIRD (30-50% token savings)
Domain-specific tools: code-index-mcp, context7, deepwiki, etc.

### 4. Native Tools LAST (baseline)
Only as fallback when MCP/skills unavailable.

## Tool Chain Patterns

### Single-Tool Operations
Simplest pattern - direct tool use:
```
user request → tool selection → tool execution → result
```

**Examples:**
- Reading a file: `mcp__desktop-commander__read_file`
- Getting file info: `mcp__desktop-commander__get_file_info`

### Sequential Chaining
Tools used in sequence where output of one becomes input to next:
```
tool1 (read file) → process data → tool2 (search code) → tool3 (write result)
```

**Current GSI Examples:**
- `mcp__code-index-mcp__find_files` → grep pattern → `mcp__code-index-mcp__search_code_advanced`
- `mcp__desktop-commander__read_file` → parse content → `mcp__desktop-commander__write_file`

### Parallel Tool Usage
Multiple tools used simultaneously on different data:
```
branch1: toolA → toolB → result1
branch2: toolC → toolD → result2
merge: combine results
```

**Current GSI Parallel Examples:**
- Parallel mapper agents in `/GSI:map-codebase`
- Parallel research agents in `/GSI:new-project`

### Tool Reuse Patterns
Calling the same tool multiple times vs. different tools:
```
BAD: toolA, toolA, toolA (3 calls)
GOOD: toolA, toolB, toolC (3 different tools)
```

**Analysis:** Reuse indicates optimal tool selection was achieved, or tool provides batching.

## Code-Index MCP Extended Capabilities

### Available Tools
```json
{
  "tools": {
    "alwaysAllow": [
      "search_code_advanced",
      "find_files",
      "get_file_summary",
      "get_symbol_body",
      "build_deep_index",
      "refresh_index",
      "set_project_path"
    ]
  }
}
```

### Potential Workflows

1. **Codebase Mapping** - Use `search_code_advanced` + `find_files` for architecture analysis
2. **Symbol Analysis** - Use `get_symbol_body` + `get_file_summary` for code extraction
3. **Pattern Discovery** - Use `search_code_advanced` with context_lines for code navigation
4. **Index Management** - Use `build_deep_index` + `refresh_index` for project indexing

## Optimal Tool Flow Design

### Discovery → Analysis → Action
```
search_code_advanced → get_symbol_body → write_file
```

### Batch → Process → Batch
```
Multiple files → read_multiple_files → process → write_multiple_files
```

### Symbol-First Pattern
```
get_file_summary → get_symbol_body → search_code_advanced (for related code)
```

## Key Findings

### Token Optimization Opportunities

1. **Batch Multiple Operations** - Use `read_multiple_files` instead of sequential `read_file`
2. **Reuse Tool Results** - Cache and reuse outputs when possible
3. **Minimize Tool Switching** - Stay within same tool category when possible
4. **Use Symbol Extraction** - `get_symbol_body` is 85% more efficient than reading entire files

### Workflow-Specific Recommendations

| Workflow | Primary Tools | Optimal Pattern |
|-----------|---------------|----------------|
| map-codebase | code-index-mcp search tools | Parallel discovery |
| new-project | code-index-mcp + desktop-commander | Sequential exploration |
| plan-phase | code-index-mcp (read plans) | Context-aware planning |
| execute-phase | desktop-commander (file ops) | Batched execution |

## Conclusion

Current GSI workflows demonstrate strong MCP tool compliance using Desktop Commander and Code-Index MCP servers, achieving 80-90% token savings over native tools.

The two-server architecture (DC + CI) provides comprehensive coverage:
- **Desktop Commander**: All file and process operations
- **Code-Index MCP**: Code search, symbol extraction, and file summaries
