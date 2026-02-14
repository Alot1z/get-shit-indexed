---
name: GSI:pause-work
description: Create context handoff when pausing work mid-phase
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - Task
---

<objective>
Create `.continue-here.md` handoff file to preserve complete work state across sessions.

Routes to the pause-work workflow which handles:
- Current phase detection from recent files
- Complete state gathering (position, completed work, remaining work, decisions, blockers)
- Handoff file creation with all context sections
- Git commit as WIP
- Resume instructions
</objective>

<execution_context>
@.planning/STATE.md
@~/.claude/get-shit-indexed/workflows/pause-work.md
</execution_context>

<process>
**Follow the pause-work workflow** from `@~/.claude/get-shit-indexed/workflows/pause-work.md`.

The workflow handles all logic including:
1. Phase directory detection
2. State gathering with user clarifications
3. Handoff file writing with timestamp
4. Git commit
5. Confirmation with resume instructions
</process>
