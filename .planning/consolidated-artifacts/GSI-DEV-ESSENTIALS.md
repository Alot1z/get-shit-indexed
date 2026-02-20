# GSI-DEV-ESSENTIALS

> **Type:** Consolidated Artifact (Skill Pack + Quick Commands)
> **Absorbs:** 6 GSI commands for daily development

---

## Purpose

Everyday development utilities that don't fit the main workflow. Quick access to common operations, help, and maintenance.

---

## Components

### 1. Quick Command Pack
```yaml
commands:
  - name: quick
    trigger: /gsi:quick
    purpose: execute_small_task_with_guarantees
    
  - name: help
    trigger: /gsi:help
    purpose: show_available_commands
    
  - name: files
    trigger: /gsi:files
    purpose: convert_files_to_prompt
    
  - name: update
    trigger: /gsi:update
    purpose: update_gsi_version
    
  - name: patches
    trigger: /gsi:patches
    purpose: reapply_local_modifications
    
  - name: profile
    trigger: /gsi:profile
    purpose: switch_model_configuration
```

### 2. Auto-Optimization Hooks
```yaml
hooks:
  pre_prompt:
    - name: load-relevant-context
      action: check_memory_for_patterns
      
  post_response:
    - name: capture-learnings
      action: store_if_valuable
```

---

## Absorbed Commands

| Original Command | Now Accessed Via |
|------------------|------------------|
| `/gsi:quick` | `/gsi:quick` (unchanged) |
| `/gsi:help` | `/gsi:help` or `?` |
| `/gsi:files-to-prompt` | `/gsi:files` |
| `/gsi:update` | `/gsi:update` |
| `/gsi:reapply-patches` | `/gsi:patches` |
| `/gsi:set-profile` | `/gsi:profile` |

---

## Usage

### Quick Task
```
/gsi:quick "add error handling to auth"

# Dev Essentials:
# 1. Creates mini-plan
# 2. Executes with GSI guarantees
# 3. Commits atomically
# 4. Verifies quality
# Time: 2-5 minutes for typical task
```

### Help System
```
/gsi:help

# Available Commands:
# ─────────────────────────────────────
# WORKFLOW
#   /gsi:go         Start or continue project
#   /gsi:status     Check progress
#   /gsi:check      Run quality gates
# 
# MANAGEMENT
#   /gsi:pause      Save and stop
#   /gsi:resume     Continue work
#   /gsi:add        Add phase
# 
# QUICK
#   /gsi:quick      Execute small task
#   /gsi:files      Convert to prompt
#   /gsi:learn      Extract patterns
# ─────────────────────────────────────
```

### Files to Prompt
```
/gsi:files src/ --cxml

# Converts directory to Claude-friendly format
# Output: XML-wrapped content for context
```

### Update GSI
```
/gsi:update

# Checks for updates
# Downloads latest version
# Reapplies local patches
# Verifies installation
```

### Model Profile
```
/gsi:profile balanced

# Options:
#   quality  → opus (best)
#   balanced → sonnet (default)
#   budget   → haiku (fast)
```

---

## Quick Task Flow

```
/gsi:quick "task description"
         │
         ▼
┌────────────────────┐
│ Create Mini-Plan   │
│ (30 sec max)       │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Execute with MCP   │
│ Tools (2-3 min)    │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Quick Quality Check│
│ (7-BMAD lite)      │
└────────┬───────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  PASS      FAIL
    │         │
    │         ▼
    │    ┌─────────┐
    │    │ Auto-fix│
    │    └────┬────┘
    │         │
    └─────────┘
         │
         ▼
┌────────────────────┐
│ Atomic Commit      │
└────────────────────┘
```

---

## Token Efficiency

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Quick task overhead | 50% | 10% | 80% |
| Help lookup | 2min | 10sec | 92% |
| Profile switch | restart | instant | 100% |

---

**Version:** 1.0
**Created:** 2026-02-20
**Status:** Design Complete, Implementation Pending
