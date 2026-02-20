# GSI-ORCHESTRATOR

> **Type:** Consolidated Artifact (Global Agent + Agent-Skills)
> **Absorbs:** 5 GSI commands + 4 agent types

---

## Purpose

Persistent orchestration agent that manages the entire GSI agent ecosystem. One global agent that spawns specialized subagents as needed.

---

## Components

### 1. Global Agent Definition
```yaml
name: gsi-orchestrator
type: global-agent
persistence: session-spanning
capabilities:
  - spawn_specialized_agents
  - track_agent_progress
  - aggregate_results
  - manage_context_windows
  - report_status
```

### 2. Agent-Skills Pack
```yaml
subagents:
  gsi-researcher:
    triggers: [/gsi:research, research needed]
    tools: [context7, deepwiki, web-search]
    output: RESEARCH.md
    
  gsi-planner:
    triggers: [/gsi:plan, planning needed]
    tools: [code-index, desktop-commander]
    output: PLAN.md
    
  gsi-executor:
    triggers: [/gsi:execute, execution needed]
    tools: [desktop-commander, bash]
    output: COMMITS
    
  gsi-explorer:
    triggers: [/gsi:explore, gap analysis]
    tools: [code-index, codegraph]
    output: GAP-ANALYSIS.md
```

### 3. Status & Settings Integration
```yaml
commands_absorbed:
  - /gsi:research-phase → routed to gsi-researcher
  - /gsi:map-codebase → routed to gsi-explorer
  - /gsi:explorer → routed to gsi-explorer
  - /gsi:progress → status reporting
  - /gsi:settings → orchestrator configuration
```

---

## Usage

### Check System Status
```
/gsi:status

# Output:
# ┌────────────────────────────────────────┐
# │ GSI Orchestrator Status                 │
# ├────────────────────────────────────────┤
# │ Project: my-app                         │
# │ Phase: 3 of 5                           │
# │ Plans: 2/4 complete (50%)               │
# │ Active Agents: gsi-executor (2)         │
# │ Pending: verify phase 3                 │
# └────────────────────────────────────────┘
```

### Spawn Research Agent
```
/gsi:research "authentication patterns"

# Orchestrator:
# 1. Spawns gsi-researcher agent
# 2. Agent uses context7 + deepwiki
# 3. Returns findings to orchestrator
# 4. Orchestrator presents summary
```

### Map Codebase
```
/gsi:map

# Orchestrator:
# 1. Spawns gsi-explorer agents (parallel)
# 2. Each agent analyzes focus area
# 3. Results aggregated
# 4. Comprehensive map generated
```

### Configure Settings
```
/gsi:config

# Interactive configuration:
# 1. Model profile (opus/sonnet/haiku)
# 2. Agent spawn behavior (sequential/parallel)
# 3. Verification strictness
# 4. Hook enable/disable
```

---

## Agent Spawn Strategy

```javascript
const spawnStrategy = {
  // Parallel spawn for independent analysis
  parallel: {
    map_codebase: [
      'gsi-explorer:tech',
      'gsi-explorer:arch', 
      'gsi-explorer:quality',
      'gsi-explorer:concerns'
    ],
    research: [
      'gsi-researcher:stack',
      'gsi-researcher:features',
      'gsi-researcher:patterns'
    ]
  },
  
  // Sequential spawn for dependent tasks
  sequential: {
    execute_phase: [
      'gsi-planner',      // Must plan first
      'gsi-executor'      // Then execute
    ]
  }
};
```

---

## Absorbed Commands

| Original Command | Now Accessed Via |
|------------------|------------------|
| `/gsi:research-phase` | `/gsi:research` or auto-spawned |
| `/gsi:map-codebase` | `/gsi:map` |
| `/gsi:explorer` | `/gsi:explore` |
| `/gsi:progress` | `/gsi:status` |
| `/gsi:settings` | `/gsi:config` |

---

## Context Management

```yaml
context_strategy:
  main_agent:
    max_tokens: 50000
    purpose: orchestration_only
    
  subagents:
    max_tokens: 200000
    purpose: heavy_lifting
    
  result_aggregation:
    method: summary_only
    max_output: 5000
```

---

## Token Efficiency

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Agent definitions | 5 | 1 + spawn | 60% |
| Command skills | 5 | 1 | 80% |
| Context per task | 50k | 5k + subagent | 90% |

---

## Installation

```bash
# Install consolidated artifact
npx get-shit-indexed-cc --artifact gsi-orchestrator

# Creates global agent that persists across sessions
# Subagents spawned on demand
```

---

**Version:** 1.0
**Created:** 2026-02-20
**Status:** Design Complete, Implementation Pending
