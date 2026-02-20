---
name: gsi:status
description: GSI Status - Display comprehensive project status including progress and next steps
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
---

<!--
Consolidated Artifact: Status command
Absorbs: /gsi:progress, /gsi:settings view
-->

<objective>
Display comprehensive project status including progress, active agents, and next steps.
</objective>

<context>
Arguments: none

**Trigger:** `/gsi:status`

**Load project state:**
@.planning/STATE.md
@.planning/ROADMAP.md
@.planning/config.json
</context>

<process>

## Step 1: Load State

Read `.planning/STATE.md` if exists to get:
- Current phase
- Completed phases
- Active plans
- Verification status

## Step 2: Calculate Progress

```
Progress: [████████░░] 80%

Phase 1: ✓ Complete (3/3 plans)
Phase 2: ✓ Complete (4/4 plans)
Phase 3: ◆ In Progress (2/4 plans, 1 wave remaining)
Phase 4: ○ Pending
```

## Step 3: Show Next Steps

```
───────────────────────────────────────────────────────────────

## ▶ Next Up

**Phase 3-03: Final Integration** — Complete remaining API endpoints

`/gsi:go execute`

───────────────────────────────────────────────────────────────
```

## Step 4: Settings Summary (if --settings flag)

Show current config.json settings:
- Model profile
- Research mode
- Plan check enabled
- Verifier enabled
- Branching strategy

</process>

<output_format>
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSI ► PROJECT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: {project name from PROJECT.md}
Milestone: {current milestone}
Status: {active/paused/complete}

Progress: [████████░░] 80%

Phases:
| Phase | Status | Plans | Progress |
|-------|--------|-------|----------|
| 1     | ✓      | 3/3   | 100%     |
| 2     | ✓      | 4/4   | 100%     |
| 3     | ◆      | 2/4   | 50%      |
| 4     | ○      | 0/2   | 0%       |

Last Activity: {timestamp from STATE.md}
Next Action: {recommended next command}

───────────────────────────────────────────────────────────────

## ▶ Next Up

**{next task description}**

`/gsi:go`

───────────────────────────────────────────────────────────────
```
</output_format>

<deprecated_commands>
- `/gsi:progress` → Use `/gsi:status`
- `/gsi:settings view` → Use `/gsi:status --settings`
</deprecated_commands>

---
**Version:** 1.0
**Consolidates:** 2 GSI status commands
