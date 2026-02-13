# MCP Tool Chain Analysis

## Executive Summary

Analysis of tool usage patterns across GSD workflows to identify optimal chaining strategies and integrate CodeGraphContext MCP server capabilities.

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

**Current GSD Examples:**
- `mcp__code-index-mcp__find_files` → grep pattern → `mcp__code-index-mcp__search_code_advanced`
- `mcp__desktop-commander__read_file` → parse content → `mcp__desktop-commander__write_file`

### Parallel Tool Usage
Multiple tools used simultaneously on different data:
```
branch1: toolA → toolB → result1
branch2: toolC → toolD → result2
merge: combine results
```

**Current GSD Parallel Examples:**
- Parallel mapper agents in `/gsd:map-codebase`
- Parallel research agents in `/gsd:new-project`

### Tool Reuse Patterns
Calling the same tool multiple times vs. different tools:
```
BAD: toolA, toolA, toolA (3 calls)
GOOD: toolA, toolB, toolC (3 different tools)
```

**Analysis:** Reuse indicates optimal tool selection was achieved, or tool provides batching.

## CodeGraphContext Integration Opportunities

### Available Tools (from user config)
```json
{
  "tools": {
    "alwaysAllow": [
      "add_code_to_graph",
      "add_package_to_graph",
      "check_job_status",
      "find_code",
      "analyze_code_relationships",
      "execute_cypher_query",
      "calculate_cyclomatic_complexity",
      "find_most_complex_functions"
    ]
  }
}
```

### Potential Workflows

1. **Codebase Mapping** - Use `find_code` + `analyze_code_relationships` for architecture analysis
2. **Complexity Analysis** - Use `calculate_cyclomatic_complexity` + `find_most_complex_functions`
3. **Code Query** - Use `execute_cypher_query` for pattern-based code navigation
4. **Relationship Discovery** - Use `analyze_code_relationships` to find hidden dependencies

## Optimal Tool Flow Design

### Discovery → Analysis → Action
```
find_code → analyze_code_relationships → execute_cypher_query
```

### Batch → Process → Batch
```
Multiple files → read_multiple_files → process → write_multiple_files
```

### Circular Thinking Pattern (3-server rotation)
```
iteration 1: tractatus-thinking (structural)
iteration 2: sequential-thinking (step-by-step)
iteration 3: debug-thinking (problem-solving)
→ measure which combination best for each workflow type
→ repeat to refine patterns
```

## Key Findings

### Token Optimization Opportunities

1. **Batch Multiple Operations** - Use `read_multiple_files` instead of sequential `read_file`
2. **Reuse Tool Results** - Cache and reuse outputs when possible
3. **Minimize Tool Switching** - Stay within same tool category when possible
4. **Use Specialized Tools** - CodeGraphContext has 11 specialized code analysis tools

### Workflow-Specific Recommendations

| Workflow | Primary Tools | Optimal Pattern |
|-----------|---------------|----------------|
| map-codebase | code-index-mcp search tools | Parallel discovery |
| new-project | code-index-mcp + desktop-commander | Sequential exploration |
| plan-phase | code-index-mcp (read plans) | Context-aware planning |
| execute-phase | desktop-commander (file ops) | Batched execution |

## Conclusion

Current GSD workflows already demonstrate strong MCP tool compliance. The migration to MCP tools (DesktopCommander + Code-Index) achieving 80-90% token savings is complete and functional.

CodeGraphContext integration should complement existing tools by adding graph-based code analysis capabilities not currently available in GSD.
