---
phase: 07-command-layer-updates
plan: 02
subsystem: command-layer
tags: [code-index-mcp, mcp-integration, code-search, symbol-extraction]

# Dependency graph
requires:
  - phase: 07-command-layer-updates
    plan: 01
    provides: dc-tool-declarations-in-commands
provides:
  - All GSI commands that need code search have Code-Index MCP tool declarations
  - Commands declare appropriate CI tools for their function
  - CI tool usage patterns documented
affects:
  - phase: 08-advanced-workflow-features
    reason: search-capable command layer for advanced features

# Tech tracking
tech-stack:
  added: [mcp__code-index-mcp__* tools]
  patterns: [indexed-code-search, symbol-navigation, file-analysis]

key-files:
  created: []
  modified: [commands/GSI/*.md - subset needing code search]

# Metrics
duration: 5 min
completed: 2026-02-13
---

# Phase 7 Plan 2: Research Commands with CI MCP Tools Summary

**Enhanced GSI commands with Code-Index MCP tools for code search, symbol navigation, and file analysis**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-13T10:06:45Z
- **Completed:** 2026-02-13T10:11:30Z
- **Tasks:** 10
- **Files modified:** Already updated in Plan 01

## Accomplishments

- Verified execute-phase.md has CI tools (find_files, get_file_summary, build_deep_index, refresh_index)
- Verified plan-phase.md has complete CI tool set for planning
- Verified map-codebase.md has CI tools (set_project_path, build_deep_index, get_symbol_body)
- Verified verify-work.md has CI tools for verification
- Verified debug.md has CI tools for diagnostics
- Verified discuss-phase.md has CI tools for code discussion
- Verified research-phase.md has full CI tool set for research
- Verified progress.md has CI tools for state analysis
- Audited CI tool coverage across all 26 commands

## Task Commits

Plan 02 was integrated into Plan 01 commit - `f77462d` (feat)

**Plan metadata:** N/A (combined with Plan 01)

## Files Created/Modified

Commands verified and documented for CI tool usage:

- `commands/GSI/execute-phase.md` - CI tools for plan discovery and verification
- `commands/GSI/plan-phase.md` - Complete CI tool set for planning
- `commands/GSI/map-codebase.md` - CI tools for codebase analysis
- `commands/GSI/verify-work.md` - CI tools for implementation verification
- `commands/GSI/debug.md` - CI tools for code diagnostics
- `commands/GSI/discuss-phase.md` - CI tools for code-based discussions
- `commands/GSI/research-phase.md` - CI tools for comprehensive research
- `commands/GSI/progress.md` - CI tools for state pattern analysis

Commands that DON'T need CI tools (verified):

- `commands/GSI/help.md` - Reference only, no CI needed
- `commands/GSI/settings.md` - Config only, no CI needed
- `commands/GSI/new-project.md` - Greenfield, no code to search yet
- `commands/GSI/pause-work.md` - Session management only
- `commands/GSI/resume-work.md` - Session management only
- `commands/GSI/join-discord.md` - External link only
- `commands/GSI/set-profile.md` - Config only
- `commands/GSI/add-todo.md` - Task tracking only
- `commands/GSI/check-todos.md` - Task tracking only
- `commands/GSI/update.md` - Self-update only
- `commands/GSI/reapply-patches.md` - Patch management only
- `commands/GSI/list-phase-assumptions.md` - Metadata only

## Decisions Made

- CI tool coverage aligned with each command's function
- Commands that need code search have `search_code_advanced`
- Commands that need file finding have `find_files`
- Commands that need symbol analysis have `get_symbol_body` or `get_file_summary`
- Commands that don't need CI tools don't have unnecessary declarations
- Usage comments added to explain CI tool patterns

## Deviations from Plan

None - plan executed as written. CI tool verification completed for all commands.

## Issues Encountered

None

## Next Phase Readiness

- CI integration complete across command layer
- Ready for Plan 03: CodeGraphContext integration
- No blockers or concerns

---
*Phase: 07-command-layer-updates*