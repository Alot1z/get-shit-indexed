# GSI Consolidated Artifacts Manifest

## Overview

This document tracks the consolidated GSI artifacts that absorb 30+ individual commands into 5 unified entry points plus 2 global agents.

## Files Created

### Consolidated Commands (commands/consolidated/)

| File | Lines | Absorbs | Trigger |
|------|-------|---------|---------|
| `gsi-mega-workflow.md` | 183 | 6 commands | `/gsi:go` |
| `gsi-status.md` | 120 | 2 commands | `/gsi:status` |
| `gsi-check.md` | 140 | 2 commands | `/gsi:check` |
| `gsi-pause.md` | 107 | 1 command | `/gsi:pause` |
| `gsi-quick.md` | 107 | standalone | `/gsi:quick` |

### Consolidated Agents (agents/consolidated/)

| File | Lines | Role |
|------|-------|------|
| `gsi-orchestrator.md` | 87 | Global orchestration, spawns subagents |
| `gsi-context-manager.md` | 84 | Session continuity, knowledge persistence |

### Consolidated Workflows (workflows/consolidated/)

| File | Lines | Purpose |
|------|-------|---------|
| `mega-workflow.md` | 68 | Detailed phase definitions |

## Commands Absorbed

### gsi:go (Mega Workflow)
- `/gsi:new-project` → `/gsi:go init`
- `/gsi:new-milestone` → `/gsi:go milestone`
- `/gsi:discuss-phase` → `/gsi:go discuss`
- `/gsi:research-phase` → `/gsi:go research`
- `/gsi:plan-phase` → `/gsi:go plan`
- `/gsi:execute-phase` → `/gsi:go execute`

### gsi:status
- `/gsi:progress` → `/gsi:status`
- `/gsi:settings view` → `/gsi:status --settings`

### gsi:check
- `/gsi:verify-work` → `/gsi:check`
- `/gsi:audit-milestone` → `/gsi:check --milestone`

### gsi:pause
- `/gsi:pause-work` → `/gsi:pause`

### gsi:quick
- Standalone for ad-hoc tasks

## Token Efficiency

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Command files | 33 | 5 + 33 legacy | 85% reduction for new users |
| Entry points | 33 | 5 | 85% reduction |
| Agent files | 13 | 2 + 13 legacy | 15% reduction |

## Install Script Updates

The install script (`bin/install.js`) now copies:
1. `commands/consolidated/*.md` → `commands/gsi/` (for Claude Code/Gemini)
2. `commands/consolidated/*.md` → `command/GSI-*.md` (for OpenCode)
3. `agents/consolidated/*.md` → `agents/`
4. `workflows/consolidated/*.md` → `get-shit-indexed/workflows/`

## Deprecation Notices

All absorbed commands have deprecation notices:
```markdown
> ⚠️ **DEPRECATED**: This command is now part of `/gsi:go` (GSI Mega Workflow).
> Use `/gsi:go` for unified phase execution with auto-detection.
> This command remains for backward compatibility.
```

## Backward Compatibility

- All old commands still work
- Deprecation notices guide users to new unified commands
- Install script copies both old and new commands
- Users can migrate at their own pace

## Version

- **Created:** 2026-02-20
- **Version:** 1.0
- **Phase:** 51 - GSI Consolidation
