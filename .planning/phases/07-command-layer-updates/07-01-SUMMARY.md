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
  - All 26 GSD command files updated with Desktop Commander MCP tool declarations
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
  modified: [commands/gsd/*.md - all 26 command files]

# Metrics
duration: 12 min
completed: 2026-02-13
---

# Phase 7 Plan 1: Core Command Enhancement with DC MCP Tools Summary

**All 26 GSD command files updated with Desktop Commander MCP tools for file operations, replacing native Read/Write/Edit/Glob/Grep equivalents**

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

1. **Update all 26 GSD commands with DC, CI, and CG MCP tools** - `f77462d` (feat)

**Plan metadata:** N/A (single commit for all three plans)

## Files Created/Modified

All 26 command files updated:

- `commands/gsd/execute-phase.md` - Full DC + CI + CG tool declarations
- `commands/gsd/plan-phase.md` - DC + context7 + web-browser + CG tools
- `commands/gsd/map-codebase.md` - Full DC + CI + CG tool set
- `commands/gsd/verify-work.md` - DC + CI + CG tools
- `commands/gsd/quick.md` - DC tools without AskUserQuestion
- `commands/gsd/new-project.md` - DC file creation tools
- `commands/gsd/new-milestone.md` - DC file creation tools
- `commands/gsd/add-phase.md` - DC tools for phase management
- `commands/gsd/insert-phase.md` - DC tools for phase insertion
- `commands/gsd/remove-phase.md` - DC tools for phase removal
- `commands/gsd/audit-milestone.md` - DC + CI search tools
- `commands/gsd/complete-milestone.md` - DC tools for completion
- `commands/gsd/plan-milestone-gaps.md` - DC + CI tools
- `commands/gsd/add-todo.md` - DC tools for todo management
- `commands/gsd/check-todos.md` - DC tools for todo checking
- `commands/gsd/debug.md` - DC + CI + CG diagnostic tools
- `commands/gsd/help.md` - DC read-only (reference command)
- `commands/gsd/progress.md` - DC + CI tools for progress tracking
- `commands/gsd/settings.md` - DC tools for configuration
- `commands/gsd/pause-work.md` - DC tools for session management
- `commands/gsd/resume-work.md` - DC tools for session resumption
- `commands/gsd/update.md` - DC tools for updates
- `commands/gsd/reapply-patches.md` - DC + CI tools for patch management
- `commands/gsd/discuss-phase.md` - DC + CI + CG tools
- `commands/gsd/research-phase.md` - Full DC + CI + CG + context7 + web-browser tool set
- `commands/gsd/join-discord.md` - DC read-only (external link)
- `commands/gsd/list-phase-assumptions.md` - DC + CI tools for assumption listing
- `commands/gsd/set-profile.md` - DC tools for profile management

## Decisions Made

- Unified all three plans (07-01, 07-02, 07-03) into single atomic commit for efficiency
- Applied golden pattern reference comments to execute-phase, plan-phase, map-codebase
- Added CI/CG usage comments to commands that use those tools
- Removed native tool names (Read/Write/Edit/Glob/Grep) from all allowed-tools sections
- Retained Bash tool for gsd-tools.js wrapper (no MCP equivalent)
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