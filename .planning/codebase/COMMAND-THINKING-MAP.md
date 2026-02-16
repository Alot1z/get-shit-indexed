# Command Thinking Map

## Overview

This document maps all GSI commands to their thinking modes, triggers, and recommended timeouts. It serves as a reference for understanding cognitive enhancement across the command layer.

## Thinking Modes

| Mode | Servers | BMAD | Timeout | Use Case |
|------|---------|------|---------|----------|
| **COMPREHENSIVE** | sequential, tractatus, debug | Yes | 15000ms | Complex planning, architectural decisions |
| **STANDARD** | sequential, debug | Yes | 8000-10000ms | Standard execution, verification |
| **LIGHTWEIGHT** | sequential | No | 3000-5000ms | Quick operations, queries |
| **NONE** | - | No | 0ms | Simple display, help |

## Command Thinking Map

### COMPREHENSIVE Mode (7 commands)

Commands requiring full cognitive enhancement with all 3 thinking servers.

| Command | Description | Timeout | Triggers |
|---------|-------------|---------|----------|
| `gsi:plan-phase` | Create phase execution plans | 15000ms | Phase planning start |
| `gsi:discuss-phase` | Gather phase context through questioning | 15000ms | Phase discussion start |
| `gsi:research-phase` | Research implementation approach | 15000ms | Research start |
| `gsi:map-codebase` | Analyze codebase structure | 15000ms | Codebase analysis start |
| `gsi:debug` | Systematic debugging | 15000ms | Debug session start |
| `gsi:new-project` | Initialize new project | 15000ms | Project creation start |
| `gsi:new-milestone` | Start new milestone cycle | 15000ms | Milestone creation start |

### STANDARD Mode (10 commands)

Commands requiring standard thinking with sequential + debug servers.

| Command | Description | Timeout | Triggers |
|---------|-------------|---------|----------|
| `gsi:execute-phase` | Execute all plans in phase | 10000ms | Execution start |
| `gsi:verify-work` | Validate built features | 10000ms | Verification start |
| `gsi:complete-milestone` | Archive completed milestone | 10000ms | Milestone completion start |
| `gsi:add-phase` | Add phase to roadmap | 8000ms | Phase addition |
| `gsi:insert-phase` | Insert decimal phase | 8000ms | Phase insertion |
| `gsi:remove-phase` | Remove phase from roadmap | 8000ms | Phase removal |
| `gsi:audit-milestone` | Audit milestone completion | 10000ms | Audit start |
| `gsi:plan-milestone-gaps` | Create gap closure phases | 10000ms | Gap planning start |
| `gsi:quick` | Execute quick task | 8000ms | Quick task start |

### LIGHTWEIGHT Mode (10 commands)

Commands requiring minimal thinking with sequential server only.

| Command | Description | Timeout | Triggers |
|---------|-------------|---------|----------|
| `gsi:progress` | Check project progress | 3000ms | Status check |
| `gsi:list-phase-assumptions` | Surface phase assumptions | 5000ms | Assumption listing |
| `gsi:check-todos` | List pending todos | 5000ms | Todo check |
| `gsi:add-todo` | Capture todo from context | 3000ms | Todo capture |
| `gsi:pause-work` | Create context handoff | 5000ms | Pause request |
| `gsi:resume-work` | Resume from previous session | 5000ms | Resume request |
| `gsi:set-profile` | Switch model profile | 3000ms | Profile switch |
| `gsi:settings` | Configure workflow toggles | 5000ms | Settings change |
| `gsi:update` | Update GSI version | 5000ms | Update check |
| `gsi:reapply-patches` | Reapply local modifications | 5000ms | Patch reapplication |
| `gsi:yolo` | Toggle YOLO mode | 2000ms | Mode toggle |

### NONE Mode (2 commands)

Commands with no thinking enhancement.

| Command | Description | Rationale |
|---------|-------------|-----------|
| `gsi:help` | Show command reference | Simple display |
| `gsi:join-discord` | Display Discord link | Simple display |

## Thinking Triggers by Command Type

### Planning Commands
**Trigger**: Before any planning operation
**Server Priority**: Tractatus (structure) → Sequential (process) → Debug (learning)
**Cross-reference**: `lib/command-thinking/wrapper.js`

### Execution Commands
**Trigger**: Before and during execution
**Server Priority**: Sequential (steps) → Debug (reflection)
**Cross-reference**: `lib/thinking/orchestrator.js`

### Verification Commands
**Trigger**: During verification steps
**Server Priority**: Sequential (checks) → Debug (findings)
**Cross-reference**: `lib/thinking/orchestrator.js` BMAD check

### Query Commands
**Trigger**: Before query execution
**Server Priority**: Sequential (lightweight planning)
**Cross-reference**: `lib/command-thinking/modes.js`

## Timeout Guidelines

| Context | Multiplier | Example |
|---------|------------|---------|
| Default | 1x | STANDARD = 10000ms |
| Complex phase | 1.5x | COMPREHENSIVE = 15000ms |
| Quick operation | 0.3x | LIGHTWEIGHT = 3000ms |
| YOLO mode | 0.5x | Reduced for faster iteration |

## Cross-References

### Implementation Files
- `lib/command-thinking/modes.js` - Mode definitions and mappings
- `lib/command-thinking/wrapper.js` - withThinking wrapper function
- `lib/thinking/orchestrator.js` - Thinking server orchestration
- `lib/thinking/selector.js` - Tool-to-server mapping

### Template Files
- `templates/agent-thinking.md` - Agent thinking phase template
- `templates/workflow-thinking.md` - Workflow thinking phase template

### Documentation
- `docs/thinking/THINKING-SERVERS.md` - Thinking server API reference
- `docs/thinking/7-BMAD-THINKING.md` - 7-BMAD methodology

## Metrics Integration

All command thinking is tracked in `.planning/command-thinking-metrics.json`:

```json
{
  "plan-phase": {
    "calls": 15,
    "success_rate": 0.93,
    "avg_duration_ms": 2340,
    "cache_hits": 8,
    "mode_distribution": {
      "COMPREHENSIVE": 15
    }
  }
}
```

## Related Commands

- `/gsi:settings` - Configure thinking preferences
- `/gsi:progress` - View thinking metrics summary

---

**Last Updated**: 2026-02-16
**Phase**: 20-04b (Agent & Command Thinking Integration)
**Related**: `templates/agent-thinking.md`, `lib/command-thinking/`
