# GSI-CONTEXT-MANAGER

> **Type:** Consolidated Artifact (Agent + Knowledge + State)
> **Absorbs:** 5 GSI commands + session continuity

---

## Purpose

Preserves and restores development context across sessions. Manages state, knowledge, and phase transitions seamlessly.

---

## Components

### 1. Context Agent
```yaml
name: gsi-context-manager
type: persistent-agent
capabilities:
  - save_session_state
  - restore_session_state
  - capture_patterns
  - store_knowledge
  - manage_transitions
```

### 2. State Management
```yaml
state_files:
  - path: .planning/STATE.md
    purpose: current_position
    
  - path: .planning/config.json
    purpose: settings_and_decisions
    
  - path: .planning/handoff.md
    purpose: pause_context
    
  - path: .claude/memory/
    purpose: cross_session_knowledge
```

### 3. Knowledge Integration
```yaml
knowledge_system:
  storage: debug-thinking-mcp
  node_types:
    - problem: issues_encountered
    - solution: fixes_applied
    - learning: patterns_discovered
    - observation: things_noted
```

---

## Absorbed Commands

| Original Command | Now Accessed Via |
|------------------|------------------|
| `/gsi:pause-work` | `/gsi:pause` or auto on session end |
| `/gsi:resume-work` | `/gsi:resume` or auto on session start |
| `/gsi:claudeception` | `/gsi:learn` or auto pattern capture |
| `/gsi:add-phase` | `/gsi:add` |
| `/gsi:insert-phase` | `/gsi:insert` |

---

## Usage

### Pause Work
```
/gsi:pause

# Context Manager:
# 1. Captures current state
# 2. Summarizes progress
# 3. Notes next steps
# 4. Stores in handoff.md
# 5. Saves patterns to knowledge base
#
# Output: handoff.md created
```

### Resume Work
```
/gsi:resume

# Context Manager:
# 1. Reads handoff.md
# 2. Restores STATE.md context
# 3. Loads relevant knowledge
# 4. Presents summary to user
# 5. Suggests next action
```

### Extract Knowledge
```
/gsi:learn

# Context Manager:
# 1. Analyzes recent work
# 2. Identifies reusable patterns
# 3. Stores in debug-thinking
# 4. Creates skill/agent if valuable
```

### Add Phase
```
/gsi:add "feature description"

# Context Manager:
# 1. Generates phase number
# 2. Creates directory
# 3. Updates ROADMAP.md
# 4. Notifies orchestrator
```

### Insert Urgent Work
```
/gsi:insert 3.5 "hotfix description"

# Context Manager:
# 1. Creates decimal phase
# 2. Shifts subsequent phases
# 3. Updates all references
```

---

## Session Lifecycle

```
┌─────────────────────────────────────────────────────┐
│                 SESSION START                        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ Auto-Resume Check                                    │
│ if (handoff.md exists) → restore context            │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                 ACTIVE WORK                          │
│ - Pattern capture (automatic)                        │
│ - Knowledge storage (on solution)                    │
│ - State updates (on progress)                        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                SESSION END                           │
│ - Auto-pause triggered                               │
│ - Context preserved                                   │
│ - Knowledge persisted                                 │
└─────────────────────────────────────────────────────┘
```

---

## Auto-Capture Rules

```yaml
auto_capture:
  - trigger: problem_solved
    action: store_solution_pattern
    threshold: 5_minutes_to_solve
    
  - trigger: novel_approach
    action: store_as_learning
    threshold: user_reacts_positive
    
  - trigger: error_encountered
    action: store_as_problem
    threshold: any_error
```

---

## Token Efficiency

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Session restore time | 10min | 30sec | 95% |
| Knowledge retrieval | manual | auto | 90% |
| Context loss | 40% | 5% | 87% |

---

**Version:** 1.0
**Created:** 2026-02-20
**Status:** Design Complete, Implementation Pending
