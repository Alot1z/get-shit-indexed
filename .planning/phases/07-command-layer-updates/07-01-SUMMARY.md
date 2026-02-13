---
phase: 07-command-layer-updates
plan: 01
subsystem: command-layer
tags: [desktop-commander, mcp-integration, file-operations, tool-declarations]

# Dependency graph
requires:
  - phase: 06-quality-verification
    provides: verified-command-layer-ready-for-mcp-integration
provides:
  - All 26 GSI command files updated with Desktop Commander MCP tool declarations
  - Native Read/Write/Edit/Glob/Grep tools replaced with MCP equivalents
  - Tool usage comments added explaining DC operations
affects:
  - phase: 08-advanced-workflow-features
    reason: command-layer foundation for advanced workflow features

# Tech tracking
tech-stack:
  added: [mcp__desktop-commander__* tools]
  patterns: [mcp-first-tool-declaration, allowed-tools-frontmatter]

key-files:
  created: []
  modified: [commands/GSI/*.md - all 26 command files]

# Metrics
duration: 12 min
completed: 2026-02-13
---

# Phase 7 Plan 1: Core Command Enhancement with DC MCP Tools Summary

**All 26 GSI command files updated with Desktop Commander MCP tools for file operations, replacing native Read/Write/Edit/Glob/Grep equivalents**

## Performance

- **Duration:** 12 min
- **Started:** 2026-02-13T09:54:26Z
- **Completed:** 2026-02-13T10:06:44Z
- **Tasks:** 10
- **Files modified:** 26 command files

## Accomplishments

- Updated execute-phase.md with full DC tool set (read, write, edit, list, start_process)
- Updated plan-phase.md with DC tools for planning workflow
- Updated map-codebase.md with DC tools for parallel mapping
- Updated verify-work.md with read-only DC tools
- Updated quick.md without AskUserQuestion
- Updated project management commands (new-project, new-milestone)
- Updated phase management commands (add-phase, insert-phase, remove-phase)
- Updated milestone commands (audit-milestone, complete-milestone, plan-milestone-gaps)
- Updated utility commands (add-todo, check-todos, debug, help, progress, settings)
- Updated work management commands (pause-work, resume-work, update, reapply-patches)
- Updated research/discuss commands (research-phase, discuss-phase)
- Updated remaining commands (join-discord, list-phase-assumptions, set-profile)

## Task Commits

1. **Update all 26 GSI commands with DC, CI, and CG MCP tools** - `f77462d` (feat)

**Plan metadata:** N/A (single commit for all three plans)

## Files Created/Modified

All 26 command files updated:

- `commands/GSI/execute-phase.md` - Full DC + CI + CG tool declarations
- `commands/GSI/plan-phase.md` - DC + context7 + web-browser + CG tools
- `commands/GSI/map-codebase.md` - Full DC + CI + CG tool set
- `commands/GSI/verify-work.md` - DC + CI + CG tools
- `commands/GSI/quick.md` - DC tools without AskUserQuestion
- `commands/GSI/new-project.md` - DC file creation tools
- `commands/GSI/new-milestone.md` - DC file creation tools
- `commands/GSI/add-phase.md` - DC tools for phase management
- `commands/GSI/insert-phase.md` - DC tools for phase insertion
- `commands/GSI/remove-phase.md` - DC tools for phase removal
- `commands/GSI/audit-milestone.md` - DC + CI search tools
- `commands/GSI/complete-milestone.md` - DC tools for completion
- `commands/GSI/plan-milestone-gaps.md` - DC + CI tools
- `commands/GSI/add-todo.md` - DC tools for todo management
- `commands/GSI/check-todos.md` - DC tools for todo checking
- `commands/GSI/debug.md` - DC + CI + CG diagnostic tools
- `commands/GSI/help.md` - DC read-only (reference command)
- `commands/GSI/progress.md` - DC + CI tools for progress tracking
- `commands/GSI/settings.md` - DC tools for configuration
- `commands/GSI/pause-work.md` - DC tools for session management
- `commands/GSI/resume-work.md` - DC tools for session resumption
- `commands/GSI/update.md` - DC tools for updates
- `commands/GSI/reapply-patches.md` - DC + CI tools for patch management
- `commands/GSI/discuss-phase.md` - DC + CI + CG tools
- `commands/GSI/research-phase.md` - Full DC + CI + CG + context7 + web-browser tool set
- `commands/GSI/join-discord.md` - DC read-only (external link)
- `commands/GSI/list-phase-assumptions.md` - DC + CI tools for assumption listing
- `commands/GSI/set-profile.md` - DC tools for profile management

## Decisions Made

- Unified all three plans (07-01, 07-02, 07-03) into single atomic commit for efficiency
- Applied golden pattern reference comments to execute-phase, plan-phase, map-codebase
- Added CI/CG usage comments to commands that use those tools
- Removed native tool names (Read/Write/Edit/Glob/Grep) from all allowed-tools sections
- Retained Bash tool for GSI-tools.js wrapper (no MCP equivalent)
- Retained Task tool for subagent spawning (orchestration requirement)

## Deviations from Plan

None - plan executed exactly as written. All three plans (07-01, 07-02, 07-03) were completed together in a unified approach.

## Issues Encountered

None

## Next Phase Readiness

- Desktop Commander MCP integration complete across all 26 command files
- Ready for Phase 8: Advanced Workflow Features
- No blockers or concerns

---
*Phase: 07-command-layer-updates*