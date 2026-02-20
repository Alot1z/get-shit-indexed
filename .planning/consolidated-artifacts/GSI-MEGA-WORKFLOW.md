# GSI-MEGA-WORKFLOW

> **Type:** Consolidated Artifact (Skill + Workflow + Hooks)
> **Absorbs:** 5 GSI commands into 1 unified interface

---

## Purpose

Single entry point for the entire GSI project lifecycle. No need to remember separate commands - this one artifact handles it all.

---

## Components

### 1. Core Skill
```yaml
name: gsi-mega-workflow
triggers:
  - /gsi:go
  - /gsi:cycle
  - /gsi:workflow
description: |
  Master workflow orchestrator. Detects project state and 
  routes to appropriate phase automatically.
```

### 2. Embedded Workflow
```yaml
phases:
  - name: init
    commands_absorbed: [/gsi:new-project, /gsi:new-milestone]
    actions: [question, research, requirements, roadmap]
    
  - name: plan
    commands_absorbed: [/gsi:plan-phase]
    actions: [research-implementation, create-plans, verify-plans]
    
  - name: execute
    commands_absorbed: [/gsi:execute-phase]
    actions: [wave-execution, atomic-commits, progress-tracking]
    
  - name: verify
    commands_absorbed: [/gsi:verify-work]
    actions: [7-bmad-validation, gap-analysis, user-acceptance]
    
  - name: complete
    commands_absorbed: [/gsi:complete-milestone]
    actions: [archive, tag-release, cleanup]
```

### 3. Embedded Hooks
```yaml
hooks:
  pre_tool_use:
    - name: validate-mcp-priority
      trigger: any_tool_call
      action: check_tool_priority
      
  post_tool_use:
    - name: auto-validate-quality
      trigger: file_modification
      action: run_7bmad_check
      
  pre_commit:
    - name: verify-plan-alignment
      trigger: git_commit
      action: check_plan_completeness
```

---

## Usage

### Start New Project
```
/gsi:go

# Auto-detects: No project → runs init phase
# Equivalent to: /gsi:new-project --auto
```

### Continue Existing Project
```
/gsi:go

# Auto-detects: Has STATE.md → routes to current phase
# Equivalent to: /gsi:execute-phase {current}
```

### Cycle Through
```
/gsi:cycle

# Runs: plan → execute → verify → next
# Continuous development mode
```

---

## Absorbed Commands

| Original Command | Now Accessed Via |
|------------------|------------------|
| `/gsi:new-project` | `/gsi:go init` or auto-detected |
| `/gsi:new-milestone` | `/gsi:go milestone` |
| `/gsi:plan-phase N` | `/gsi:go plan N` or auto-routed |
| `/gsi:execute-phase N` | `/gsi:go execute N` or auto-routed |
| `/gsi:verify-work` | `/gsi:go verify` or auto-triggered |
| `/gsi:complete-milestone` | `/gsi:go complete` or auto-triggered |

---

## State Detection Logic

```javascript
function detectPhase() {
  if (!exists('.planning/STATE.md')) return 'init';
  
  const state = readState();
  if (state.plansRemaining > 0) return 'execute';
  if (state.needsVerification) return 'verify';
  if (state.milestoneComplete) return 'complete';
  
  return 'plan'; // default: plan next phase
}
```

---

## Token Efficiency

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Commands to remember | 6 | 1 | 83% |
| Skill files to load | 6 | 1 | 83% |
| Hook registrations | 12 | 3 | 75% |
| Documentation pages | 6 | 1 | 83% |

---

## Installation

```bash
# Install consolidated artifact
npx get-shit-indexed-cc --artifact gsi-mega-workflow

# This replaces:
# - gsi-new-project.md
# - gsi-new-milestone.md  
# - gsi-plan-phase.md
# - gsi-execute-phase.md
# - gsi-verify-work.md
# - gsi-complete-milestone.md
```

---

**Version:** 1.0
**Created:** 2026-02-20
**Status:** Design Complete, Implementation Pending
