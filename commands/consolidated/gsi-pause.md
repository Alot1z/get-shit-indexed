---
name: gsi:pause
description: GSI Pause - Create context handoff when pausing work mid-phase
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
---

<!--
Consolidated Artifact: Pause command
Absorbs: /gsi:pause-work
-->

<objective>
Create comprehensive handoff file to preserve complete work state across sessions.
</objective>

<context>
Arguments: none

**Trigger:** `/gsi:pause`

**Load current state:**
@.planning/STATE.md
</context>

<process>

## Step 1: Detect Current Phase

Read recent files to determine current work position:
- Check `.planning/phases/*/` for most recent PLAN.md
- Identify which wave/task is in progress

## Step 2: Gather State

Collect complete context:
- Current position (phase, plan, task)
- What was completed
- What remains
- Key decisions made
- Active blockers if any
- Important context for resumption

## Step 3: Write Handoff File

Create `.continue-here.md`:

```markdown
# Continue Here

**Paused:** {timestamp}
**Phase:** {current phase}
**Position:** {plan/task}

## Completed
- [x] Task 1: Description
- [x] Task 2: Description

## Remaining
- [ ] Task 3: Description
- [ ] Task 4: Description

## Key Decisions
- Decision 1: Rationale
- Decision 2: Rationale

## Blockers
- Blocker 1 (if any): Status and next step

## Resume Command
`/gsi:go execute`

## Important Context
{Any critical context needed for resumption}
```

## Step 4: Confirm

```
╔══════════════════════════════════════════════════════════════╗
║  CHECKPOINT: Handoff Created                                 ║
╚══════════════════════════════════════════════════════════════╝

Created: .continue-here.md

Resume with: /gsi:go
```

</process>

<output_artifacts>
- `.continue-here.md` — Handoff file with complete state
</output_artifacts>

<deprecated_commands>
- `/gsi:pause-work` → Use `/gsi:pause`
</deprecated_commands>

---
**Version:** 1.0
**Consolidates:** 1 GSI pause command
