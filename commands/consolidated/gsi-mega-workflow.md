---
name: gsi:go
description: GSI Mega Workflow - Single entry point for entire project lifecycle with auto-detection
argument-hint: "[init|plan|execute|verify|complete|cycle] [phase]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__start_process
  - mcp__desktop-commander__create_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - Task
---

<!--
Consolidated Artifact: Absorbs 6 GSI commands into single entry point

Commands absorbed:
- /gsi:new-project → /gsi:go init
- /gsi:new-milestone → /gsi:go milestone
- /gsi:plan-phase → /gsi:go plan
- /gsi:execute-phase → /gsi:go execute
- /gsi:verify-work → /gsi:go verify
- /gsi:complete-milestone → /gsi:go complete
-->

<objective>
Single entry point for entire GSI project lifecycle. Auto-detects project state and routes to appropriate phase.
</objective>

<context>
Arguments: none (auto-detects) or phase name

**Triggers:**
- `/gsi:go` — Auto-detect and continue
- `/gsi:go init` — Force initialization
- `/gsi:go plan [N]` — Plan specific phase
- `/gsi:go execute [N]` — Execute specific phase
- `/gsi:go verify` — Run verification
- `/gsi:go complete` — Complete milestone
- `/gsi:cycle` — Run full cycle (plan→execute→verify→next)

**Load project state if exists:**
@.planning/STATE.md
@.planning/ROADMAP.md
</context>

<state_detection>
```javascript
function detectPhase() {
  // No project exists
  if (!exists('.planning/STATE.md')) return 'init';
  
  const state = readState();
  
  // Phase has incomplete plans
  if (state.plansRemaining > 0) return 'execute';
  
  // Phase needs verification
  if (state.needsVerification) return 'verify';
  
  // All phases complete
  if (state.milestoneComplete) return 'complete';
  
  // Default: plan next phase
  return 'plan';
}
```
</state_detection>

<process>

## Step 1: Detect State

Load current state and determine next action:
- Read `.planning/STATE.md` if exists
- Read `.planning/config.json` for settings
- Determine which phase to route to

## Step 2: Route to Phase

### INIT Phase
Equivalent to: /gsi:new-project --auto

1. Question user until understanding is clear
2. Spawn research agents (parallel)
3. Extract v1/v2/out-of-scope requirements
4. Create ROADMAP.md with phases
5. Initialize STATE.md

### PLAN Phase
Equivalent to: /gsi:plan-phase

1. Research implementation approach
2. Create {phase}-{plan}-PLAN.md files
3. Verify plans against requirements
4. Present for user confirmation

### EXECUTE Phase
Equivalent to: /gsi:execute-phase

1. Run plans in parallel waves
2. Fresh context per plan (200k tokens)
3. Atomic commits per task
4. Verify against goals

### VERIFY Phase
Equivalent to: /gsi:verify-work

1. Run 7-BMAD validation gates
2. User acceptance testing
3. Gap analysis if issues found
4. Mark phase complete or remediate

### COMPLETE Phase
Equivalent to: /gsi:complete-milestone

1. Archive milestone to .planning/archive/
2. Tag git release
3. Generate summary
4. Option to start new milestone

## Step 3: Execute Phase

Run the appropriate phase with all GSI guarantees:
- MCP tool priority enforced
- 7-BMAD quality gates
- Atomic commits
- Pattern capture

</process>

<yolo_mode>
When YOLO mode is enabled (via `/gsi:yolo on` or config.json):
- Skip all checkpoint confirmations
- Auto-approve verification gates
- Continue through phases without pause
- Still respect: authentication gates, actual failures, systemic issues
</yolo_mode>

<examples>

### Start New Project
```
User: /gsi:go

Detecting: No STATE.md found
Routing to: INIT phase

[Questions follow...]
[Research spawns...]
[ROADMAP created...]
```

### Continue Existing
```
User: /gsi:go

Detecting: STATE.md shows Phase 3, 2/4 plans complete
Routing to: EXECUTE phase

[Continues execution...]
```

</examples>

<deprecated_commands>
The following commands are absorbed by /gsi:go:
- `/gsi:new-project` → Use `/gsi:go init`
- `/gsi:new-milestone` → Use `/gsi:go milestone`
- `/gsi:plan-phase N` → Use `/gsi:go plan N`
- `/gsi:execute-phase N` → Use `/gsi:go execute N`
- `/gsi:verify-work` → Use `/gsi:go verify`
- `/gsi:complete-milestone` → Use `/gsi:go complete`
</deprecated_commands>

---
**Version:** 1.0
**Consolidates:** 6 GSI workflow commands
