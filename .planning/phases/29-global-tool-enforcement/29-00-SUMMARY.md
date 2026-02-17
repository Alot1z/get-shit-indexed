# Phase 29: Global Tool Enforcement & Installation

## Summary

Phase 29 creates a global GSI installation system that enforces MCP tool usage everywhere, ensuring Desktop Commander and Code-Index tools are used preferentially even when users don't invoke GSI commands directly.

## Plans Overview

| Plan | Wave | Status | Tasks | Focus |
|------|------|--------|-------|-------|
| 29-01 | 1 | Pending | 4 | Installation System (global vs project) |
| 29-02 | 1 | Pending | 4 | Tool Priority Rules System |
| 29-03 | 2 | Pending | 5 | PreToolUse Hook Enforcement |
| 29-04 | 2 | Pending | 4 | Configuration Sync System |
| 29-05 | 3 | Pending | 3 | CLI Installation Commands |
| 29-06 | 3 | Pending | 4 | Testing & Validation |

## Total Tasks: 24

## Dependencies

```
29-01 (Installation) ──→ 29-03 (Hooks)
         ↓                    ↓
29-02 (Rules) ─────────→ 29-04 (Config)
         ↓                    ↓
29-05 (CLI) ───────────→ 29-06 (Testing)
```

## Key Deliverables

1. **Global Installation** - Install GSI rules to `~/.claude/` for all projects
2. **Project Installation** - Install GSI rules to `.claude/` for single project
3. **Tool Priority Rules** - Enforce: Skills → MCP → Native
4. **PreToolUse Hook** - Intercept tool calls, redirect to MCP equivalents
5. **Config Sync** - Keep global/project configs synchronized
6. **CLI Commands** - `gsi install --global`, `gsi install --project`

## MCP Tool Mapping

| Native Tool | MCP Replacement | Priority |
|-------------|-----------------|----------|
| `Read` | `mcp__desktop-commander__read_file` | HIGH |
| `Write` | `mcp__desktop-commander__write_file` | HIGH |
| `Edit` | `mcp__desktop-commander__edit_block` | HIGH |
| `Grep` | `mcp__code-index-mcp__search_code_advanced` | HIGH |
| `Glob` | `mcp__code-index-mcp__find_files` | HIGH |
| `Bash ls` | `mcp__desktop-commander__list_directory` | HIGH |
| `Bash mkdir` | `mcp__desktop-commander__create_directory` | HIGH |
| `Bash rm` | `mcp__desktop-commander__delete_file` | MEDIUM |

## Success Metrics

- MCP tool usage: >95% when alternatives available
- Token savings: 80-90% vs native tools
- Installation time: <30 seconds
- Zero breaking changes to existing workflows

---

**Status**: Ready for execution planning
