# Phase 2 Plan 3: Declarative MCP Tool Headers for Workflows

**Summary:** Added `<code_index_mcp>` headers to all 27 GSI workflow files, specifying MCP tool usage declaratively with desktop_commander and code_index tools at appropriate priority levels.

**Tags:** workflows, mcp-integration, tool-declaration, token-optimization

## Execution Timeline

- **Start:** 2026-02-11T19:37:19Z
- **End:** 2026-02-11T19:43:13Z
- **Duration:** 6 minutes

## Tasks Completed

| Task | Commit | Files | Description |
|------|---------|--------|-------------|
| 1 | afeb2d6 | map-codebase.md | Defined `<code_index_mcp>` header format specification |
| 2 | 3c3578e | execute-plan.md, plan-phase.md | Added headers to 2 file-heavy workflows |
| 3 | 4f9dd8b | 24 remaining workflow files | Added headers to all remaining workflows |

## Key Deliverables

### code_index_mcp Header Format

Defined in `map-codebase.md` as the canonical example:

```yaml
<code_index_mcp>
desktop_commander:
  tools: ["list_directory", "read_file", "write_file", "start_process"]
  priority: 1
  rationale: "Primary workflow for file system operations..."
code_index:
  tools: ["search_code_advanced", "find_files", "get_file_summary"]
  priority: 2
  rationale: "Secondary use for codebase search and discovery..."
native:
  priority: 3
  rationale: "Fallback only - all operations use MCP tools for 80-90% token savings"
</code_index_mcp>
```

**Priority levels:**
- 1: Primary MCP server for this workflow
- 2: Secondary MCP server
- 3: Native tools (fallback only)

### Workflow Files Updated

All 27 workflow files in `get-shit-indexed/workflows/` now have `<code_index_mcp>` headers:

**File operation workflows** (desktop_commander priority 1):
- add-phase.md, add-todo.md, audit-milestone.md, check-todos.md
- complete-milestone.md, insert-phase.md, new-milestone.md, new-project.md
- pause-work.md, remove-phase.md, set-profile.md, settings.md, update.md

**Process workflows** (desktop_commander priority 1, start_process):
- execute-phase.md, execute-plan.md, map-codebase.md
- progress.md, quick.md, resume-project.md, research-phase.md

**Search/codebase workflows** (code_index priority 1-2):
- plan-phase.md, discovery-phase.md, diagnose-issues.md
- verify-phase.md, verify-work.md, list-phase-assumptions.md

**Documentation workflows** (minimal tools):
- help.md (read_file only)

## Technical Decisions

### Header Placement

Headers are placed immediately after `<purpose>` section (or at top if no purpose section exists). This ensures:
- Headers appear early in the file for quick reference
- They don't interrupt existing frontmatter structure
- Consistent location across all workflow files

### Tool Categorization

Workflows are categorized by dominant tool usage:
1. **File operation workflows** - desktop_commander priority 1 (read, write, list, create)
2. **Search workflows** - code_index priority 1-2 (search_code_advanced, find_files)
3. **Process workflows** - desktop_commander priority 1 with start_process
4. **Hybrid workflows** - Both MCP servers with appropriate priorities

### Rationale Documentation

Each header includes a `rationale` field explaining:
- Why specific MCP tools are used
- What the workflow accomplishes with those tools
- Why native tools are fallback only (token savings motivation)

## Dependencies

### Requires
- Phase 02-01 (Wave-Based Agent Spawning) - for understanding parallel execution patterns
- Phase 02-02 (Code Index Integration) - for MCP tool usage context

### Provides
- Declarative tool specification for all GSI workflows
- Quick reference for workflow maintainers about MCP tool dependencies
- Foundation for automated tool selection optimization

### Affects
- Future phases can now reference workflow headers for tool planning
- Workflow documentation is self-documenting regarding MCP usage
- Tool pattern propagation is explicit across the codebase

## Deviations from Plan

None - plan executed exactly as written.

## Files Modified

**Workflow headers added (27 files):**
- get-shit-indexed/workflows/map-codebase.md
- get-shit-indexed/workflows/execute-plan.md
- get-shit-indexed/workflows/plan-phase.md
- get-shit-indexed/workflows/add-phase.md
- get-shit-indexed/workflows/add-todo.md
- get-shit-indexed/workflows/audit-milestone.md
- get-shit-indexed/workflows/check-todos.md
- get-shit-indexed/workflows/complete-milestone.md
- get-shit-indexed/workflows/diagnose-issues.md
- get-shit-indexed/workflows/discovery-phase.md
- get-shit-indexed/workflows/discuss-phase.md
- get-shit-indexed/workflows/execute-phase.md
- get-shit-indexed/workflows/help.md
- get-shit-indexed/workflows/insert-phase.md
- get-shit-indexed/workflows/list-phase-assumptions.md
- get-shit-indexed/workflows/new-milestone.md
- get-shit-indexed/workflows/new-project.md
- get-shit-indexed/workflows/pause-work.md
- get-shit-indexed/workflows/plan-milestone-gaps.md
- get-shit-indexed/workflows/progress.md
- get-shit-indexed/workflows/quick.md
- get-shit-indexed/workflows/remove-phase.md
- get-shit-indexed/workflows/research-phase.md
- get-shit-indexed/workflows/resume-project.md
- get-shit-indexed/workflows/set-profile.md
- get-shit-indexed/workflows/settings.md
- get-shit-indexed/workflows/transition.md
- get-shit-indexed/workflows/update.md
- get-shit-indexed/workflows/verify-phase.md
- get-shit-indexed/workflows/verify-work.md

## Next Phase Readiness

Phase 2 (Workflow Integration) now complete. All 3 plans executed:
- 02-01: Wave-based agent spawning
- 02-02: Code index integration references
- 02-03: Declarative MCP tool headers

**Ready for Phase 3:** See ROADMAP.md for next phase details.

## Verification

- [x] `<code_index_mcp>` header format defined in map-codebase.md
- [x] All 27 workflow files have `<code_index_mcp>` headers
- [x] Headers correctly specify MCP tools used by each workflow
- [x] Priority levels follow Skills > MCP > Native hierarchy
- [x] Documentation comments explain MCP tool selection rationale
- [x] No workflow files broken by header additions
