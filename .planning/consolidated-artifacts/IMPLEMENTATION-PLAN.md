# GSI Consolidated Artifacts - Implementation Plan

> **Status:** Planning Phase
> **Created:** 2026-02-20

---

## Overview

This plan breaks down implementation of 5 consolidated artifacts into concrete, executable phases.

---

## Phase 1: GSI-MEGA-WORKFLOW

**Priority:** HIGHEST (Main entry point)
**Complexity:** HIGH
**Time Estimate:** 4-6 hours

### 1.1 Create Skill File
```
Target: C:/Users/mose/.claude/skills/gsi-mega-workflow.md

Tasks:
□ Create skill file with triggers: /gsi:go, /gsi:cycle
□ Add state detection logic (no project → init, has STATE.md → continue)
□ Embed workflow phases (init, plan, execute, verify, complete)
□ Add YOLO mode support
```

### 1.2 Create Workflow File
```
Target: C:/Users/mose/.claude/get-shit-indexed/workflows/mega-workflow.md

Tasks:
□ Define phase transitions
□ Add thinking server configs per phase
□ Create spawn logic for subagents
□ Add checkpoint/verification logic
```

### 1.3 Create Hook Definitions
```
Target: C:/Users/mose/.claude/get-shit-indexed/hooks/mega-workflow/

Tasks:
□ pre-tool-use: MCP priority check
□ post-tool-use: Auto-validate
□ pre-commit: Plan alignment check
```

### 1.4 Deprecation Layer
```
Target: commands/gsi/*.md

Tasks:
□ Add deprecation notices to: new-project, plan-phase, execute-phase, verify-work, complete-milestone
□ Redirect old commands to mega-workflow
□ Add migration guide
```

### 1.5 Tests
```
Tasks:
□ Test: /gsi:go on empty directory → triggers init
□ Test: /gsi:go on existing project → continues work
□ Test: /gsi:cycle → runs full cycle
□ Test: YOLO mode bypasses checkpoints
```

---

## Phase 2: GSI-ORCHESTRATOR

**Priority:** HIGH (Agent ecosystem)
**Complexity:** HIGH
**Time Estimate:** 4-5 hours

### 2.1 Create Global Agent
```
Target: C:/Users/mose/.claude/agents/gsi-orchestrator.md

Tasks:
□ Define agent with persistent context
□ Add spawn capabilities for subagents
□ Add status reporting logic
□ Add configuration management
```

### 2.2 Create Subagent Definitions
```
Target: C:/Users/mose/.claude/agents/

Tasks:
□ gsi-researcher.md - Research agent with context7/deepwiki tools
□ gsi-planner.md - Planning agent with code-index tools
□ gsi-executor.md - Execution agent with desktop-commander
□ gsi-explorer.md - Gap analysis agent
```

### 2.3 Create Status Command
```
Target: C:/Users/mose/.claude/skills/gsi-status.md

Tasks:
□ Read STATE.md and display progress
□ Show active agents
□ Show pending tasks
□ Show next steps
```

### 2.4 Create Config Command
```
Target: C:/Users/mose/.claude/skills/gsi-config.md

Tasks:
□ Interactive configuration
□ Model profile selection
□ Agent spawn preferences
□ Hook enable/disable
```

### 2.5 Tests
```
Tasks:
□ Test: /gsi:status shows correct progress
□ Test: /gsi:config changes persist
□ Test: Agent spawn works correctly
□ Test: Parallel vs sequential spawning
```

---

## Phase 3: GSI-QUALITY-GATE

**Priority:** MEDIUM (Automation)
**Complexity:** MEDIUM
**Time Estimate:** 3-4 hours

### 3.1 Create Hook Chain
```
Target: C:/Users/mose/.claude/get-shit-indexed/hooks/quality-gate/

Tasks:
□ pre-tool-use: Tool priority enforcement
□ post-tool-use: Auto 7-BMAD validation
□ pre-commit: Quality gate check
```

### 3.2 Create 7-BMAD Validator
```
Target: C:/Users/mose/.claude/skills/gsi-check.md

Tasks:
□ Method gate check
□ Mad gate check
□ Model gate check
□ Mode gate check
□ Mod gate check
□ Modd gate check
□ Methodd gate check
□ Aggregate results
```

### 3.3 Create Auto-Fix Engine
```
Target: lib/quality/auto-fix.js

Tasks:
□ Native tool → MCP suggestion
□ Naming convention fixer
□ Missing docs generator
□ Error pattern injector
```

### 3.4 Create Audit Command
```
Target: C:/Users/mose/.claude/skills/gsi-audit.md

Tasks:
□ Comprehensive milestone audit
□ Plan coverage check
□ Test coverage check
□ Documentation completeness
```

### 3.5 Tests
```
Tasks:
□ Test: Native tool triggers warning
□ Test: 7-BMAD validation catches issues
□ Test: Auto-fix applies corrections
□ Test: Audit produces complete report
```

---

## Phase 4: GSI-CONTEXT-MANAGER

**Priority:** MEDIUM (Session continuity)
**Complexity:** MEDIUM
**Time Estimate:** 3-4 hours

### 4.1 Create Context Agent
```
Target: C:/Users/mose/.claude/agents/gsi-context-manager.md

Tasks:
□ Session state capture
□ Session state restore
□ Pattern capture logic
□ Knowledge storage integration
```

### 4.2 Create Pause Command
```
Target: C:/Users/mose/.claude/skills/gsi-pause.md

Tasks:
□ Capture current state
□ Summarize progress
□ Create handoff.md
□ Store patterns in debug-thinking
```

### 4.3 Create Resume Command
```
Target: C:/Users/mose/.claude/skills/gsi-resume.md

Tasks:
□ Read handoff.md
□ Restore STATE.md context
□ Load relevant knowledge
□ Present summary
```

### 4.4 Create Learn Command
```
Target: C:/Users/mose/.claude/skills/gsi-learn.md

Tasks:
□ Analyze recent work
□ Identify reusable patterns
□ Store in debug-thinking MCP
□ Optionally create skill/agent
```

### 4.5 Create Add/Insert Commands
```
Target: C:/Users/mose/.claude/skills/

Tasks:
□ gsi-add.md - Add phase to end
□ gsi-insert.md - Insert decimal phase
```

### 4.6 Tests
```
Tasks:
□ Test: Pause creates valid handoff
□ Test: Resume restores context correctly
□ Test: Learn captures patterns
□ Test: Add/Insert update ROADMAP
```

---

## Phase 5: GSI-DEV-ESSENTIALS

**Priority:** LOW (Utilities)
**Complexity:** LOW
**Time Estimate:** 2-3 hours

### 5.1 Create Quick Command
```
Target: C:/Users/mose/.claude/skills/gsi-quick.md

Tasks:
□ Mini-plan generation
□ Quick execution logic
□ Light quality check
□ Atomic commit
```

### 5.2 Create Help Command
```
Target: C:/Users/mose/.claude/skills/gsi-help.md

Tasks:
□ List available commands
□ Show consolidated artifact info
□ Provide usage examples
```

### 5.3 Create Files Command
```
Target: C:/Users/mose/.claude/skills/gsi-files.md

Tasks:
□ Wrap files-to-prompt
□ Support --cxml flag
□ Directory traversal
```

### 5.4 Create Update/Patch Commands
```
Target: C:/Users/mose/.claude/skills/

Tasks:
□ gsi-update.md - Update GSI
□ gsi-patches.md - Reapply patches
□ gsi-profile.md - Model profile switch
```

### 5.5 Tests
```
Tasks:
□ Test: Quick task completes successfully
□ Test: Help shows correct info
□ Test: Files produces valid output
□ Test: Profile switch works
```

---

## Dependency Graph

```
Phase 1 (MEGA-WORKFLOW)
    │
    ├──▶ Phase 2 (ORCHESTRATOR) ──▶ Phase 3 (QUALITY-GATE)
    │         │
    │         └──▶ Phase 4 (CONTEXT-MANAGER)
    │
    └──▶ Phase 5 (DEV-ESSENTIALS) [independent]
```

**Critical Path:** Phase 1 → Phase 2 → Phase 4
**Can Parallelize:** Phase 3 + Phase 5 (after Phase 1)

---

## Migration Strategy

### Option A: Big Bang
- Implement all 5 phases
- Replace all old commands at once
- Higher risk, cleaner result

### Option B: Gradual (Recommended)
- Implement Phase 1 first
- Old commands still work
- Add deprecation notices
- Migrate users over time

### Option C: Parallel Coexistence
- New artifacts alongside old commands
- Users choose which to use
- No breaking changes
- Slower adoption

---

## File Structure After Implementation

```
C:/Users/mose/.claude/
├── skills/
│   ├── gsi-mega-workflow.md    # Main entry: /gsi:go
│   ├── gsi-status.md           # Status: /gsi:status
│   ├── gsi-check.md            # Validation: /gsi:check
│   ├── gsi-pause.md            # Pause: /gsi:pause
│   ├── gsi-resume.md           # Resume: /gsi:resume
│   ├── gsi-learn.md            # Learn: /gsi:learn
│   ├── gsi-quick.md            # Quick: /gsi:quick
│   ├── gsi-help.md             # Help: /gsi:help
│   └── ...
├── agents/
│   ├── gsi-orchestrator.md     # Global orchestrator
│   ├── gsi-researcher.md       # Research subagent
│   ├── gsi-planner.md          # Planning subagent
│   ├── gsi-executor.md         # Execution subagent
│   ├── gsi-explorer.md         # Exploration subagent
│   └── gsi-context-manager.md  # Context agent
└── get-shit-indexed/
    ├── workflows/
    │   └── mega-workflow.md
    └── hooks/
        ├── mega-workflow/
        └── quality-gate/
```

---

## Summary

| Phase | Artifact | Tasks | Est. Time | Priority |
|-------|----------|-------|-----------|----------|
| 1 | GSI-MEGA-WORKFLOW | 5 | 4-6 hrs | HIGHEST |
| 2 | GSI-ORCHESTRATOR | 5 | 4-5 hrs | HIGH |
| 3 | GSI-QUALITY-GATE | 5 | 3-4 hrs | MEDIUM |
| 4 | GSI-CONTEXT-MANAGER | 6 | 3-4 hrs | MEDIUM |
| 5 | GSI-DEV-ESSENTIALS | 5 | 2-3 hrs | LOW |

**Total:** 26 tasks, 16-22 hours

**Recommended Order:**
1. Phase 1 (Mega-Workflow) - Immediate impact
2. Phase 2 (Orchestrator) - Agent foundation
3. Phase 4 (Context-Manager) - Session continuity
4. Phase 3 (Quality-Gate) - Automation
5. Phase 5 (Dev-Essentials) - Polish

---

**Version:** 1.0
**Status:** Ready for Approval
