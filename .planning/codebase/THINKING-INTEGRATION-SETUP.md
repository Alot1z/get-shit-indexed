# Thinking Integration Setup

## Overview

This document verifies the thinking integration setup for GSI workflows, enabling automatic thinking server usage before, during, and after MCP tool execution.

## Setup Completed

### 1. Config.json Updated

**File**: `.planning/config.json`

**Added Section**:
```json
"thinking_integration": {
  "enabled": true,
  "mode": "continuous",
  "force_during_execution": true,
  "force_after_execution": true,
  "wrappers": {
    "desktop_commander": {
      "pre_thinking": "tractatus",
      "during_thinking": "sequential",
      "post_thinking": "debug"
    },
    "code_index_mcp": {
      "pre_thinking": "tractatus",
      "during_thinking": "sequential",
      "post_thinking": "debug"
    },
    "codegraphcontext": {
      "pre_thinking": "tractatus",
      "during_thinking": "sequential",
      "post_thinking": "debug"
    }
  },
  "modes": {
    "lightweight": { ... },
    "standard": { ... },
    "comprehensive": { ... }
  },
  "tool_mapping": {
    "file_read": "lightweight",
    "file_write": "standard",
    "file_edit": "standard",
    "code_search": "standard",
    "graph_query": "comprehensive",
    "multi_step_operation": "comprehensive"
  },
  "cycle_mapping": {
    "cycle_1": "Tractatus → Sequential → Debug",
    "cycle_2": "Sequential → Debug → Tractatus",
    "cycle_3": "Debug → Tractatus → Sequential",
    "cycle_4": "Tractatus → Sequential → Debug",
    "cycle_5": "Sequential → Debug → Tractatus",
    "cycle_6": "Debug → Tractatus → Sequential",
    "cycle_7": "All → Ultrathink"
  }
}
```

### 2. Workflow Files Updated

**Files Modified**: 30 workflow files in `get-shit-indexed/workflows/`

**Change Applied**: Added `<thinking>auto</thinking>` tag to each workflow file

**Files Updated**:
- add-phase.md
- add-todo.md
- audit-milestone.md
- check-todos.md
- complete-milestone.md
- diagnose-issues.md
- discovery-phase.md
- discuss-phase.md
- execute-phase.md
- execute-plan.md
- help.md
- insert-phase.md
- list-phase-assumptions.md
- map-codebase.md
- new-milestone.md
- new-project.md
- pause-work.md
- plan-milestone-gaps.md
- plan-phase.md
- progress.md
- quick.md
- remove-phase.md
- research-phase.md
- resume-project.md
- set-profile.md
- settings.md
- transition.md
- update.md
- verify-phase.md
- verify-work.md

## 7-Cycle Thinking Integration

### Cycle Pattern

| Cycle | Flow | Purpose |
|-------|------|---------|
| 1 | Tractatus → Sequential → Debug | Foundation - Atomic truth analysis |
| 2 | Sequential → Debug → Tractatus | Exploration - Pattern discovery |
| 3 | Debug → Tractatus → Sequential | Analysis - Problem tracking |
| 4 | Tractatus → Sequential → Debug | Synthesis - Solution design |
| 5 | Sequential → Debug → Tractatus | Implementation - Execution monitoring |
| 6 | Debug → Tractatus → Sequential | Validation - Result verification |
| 7 | All → Ultrathink | Final Synthesis - Meta-analysis |

### Thinking Server Usage

| Operation Type | Mode | Thinking Servers |
|----------------|------|------------------|
| File Read | lightweight | sequential |
| File Write | standard | tractatus, sequential, debug |
| File Edit | standard | tractatus, sequential, debug |
| Code Search | standard | tractatus, sequential, debug |
| Graph Query | comprehensive | tractatus, sequential, debug + ultrathink |
| Multi-step | comprehensive | tractatus, sequential, debug + ultrathink |

## Verification

### Config Check
- [x] thinking_integration section added to config.json
- [x] enabled: true
- [x] mode: "continuous"
- [x] All wrappers configured
- [x] All cycle mappings defined

### Workflow Files Check
- [x] All 30 workflow files updated
- [x] `<thinking>auto</thinking>` tag added to each file
- [x] Tag placed at beginning of each file

## Expected Behavior

When GSI commands are executed:

1. **BEFORE Tool**: Tractatus thinking analyzes atomic truths
2. **DURING Tool**: Sequential thinking tracks progress in real-time
3. **AFTER Tool**: Debug thinking captures problems and learnings

This ensures every MCP tool execution is wrapped in intelligent reasoning, providing:
- Error prevention through pre-analysis
- Real-time progress monitoring
- Learning capture for future optimization

## Setup Date

**Created**: 2026-02-13
**Status**: COMPLETE

## Related Files

- `.planning/config.json` - Main configuration with thinking_integration
- `get-shit-indexed/workflows/*.md` - All workflow files with thinking tag
- `.planning/codebase/THINKING-SERVERS.md` - Thinking server documentation
- `.planning/codebase/7-BMAD-METHODOLOGY.md` - 7-BMAD quality gates
