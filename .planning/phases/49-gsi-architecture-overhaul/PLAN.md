# Phase 49: GSI Architecture Overhaul & Native Evolution

---
phase: 49
milestone: 4
created: 2026-02-18
status: planned
priority: CRITICAL
gap_closure: true
---

## Overview

**CRITICAL SYSTEM RECTIFICATION**: The current GSI implementation is failing to utilize internal tools. Agents default to native tools (Read, Write, Search) instead of optimized GSI features. This phase enforces proper tool usage and integrates external capabilities.

## Diagnosis

- **Problem**: Feature Creep without integration
- **State**: Project is fragile, "half-assed," suffering from technical debt
- **Core Failure**: GSI tools exist but are underutilized or misused
- **Result**: Phases piling up rather than compounding value

## Objectives

### Objective 1: Implement gsi-explorer Agent

**Status**: New Creation Required
**Source**: Fork logic from gsi-codebase-mapper
**Core Requirement**: Must strictly utilize GSI internal tools (gsi-feature) over native tools

**Function**: Analyze integration gaps

**Scan Scope**:
- `lib/` (thinking, workflow-thinking, prompt-enhancer, complexity, enhancement, pattern-learning, reflection, gsi-integration)
- `hooks/` (pre-tool-use, post-tool-use)
- `commands/gsi/`
- `workflows/`
- `agents/`

**Gap Analysis Targets**:
- Disconnected features/modules
- Sub-optimal tool usage
- Broken knowledge flow (Pattern Learning ↔ Complexity ↔ Prompt Enhancer)

### Objective 2: Enforce Tool Precedence & Auto-Activation

**Problem**: Native tools execute instead of GSI enhancements

**Directives**:
1. Configure hooks to force GSI tool usage (e.g., force prompt-enhancer on all inputs)
2. Ensure GSI flows activate by default when installed, without explicit prompting
3. Replace native Write operations with GSI planning tools

**Specific Fixes**:
- Phase 44-46 execution using GSI planning flow
- Module files to update:
  - `lib/gsi-integration/index.js`
  - `lib/prompt-enhancer/index.js`
  - `lib/pattern-learning/index.js`

### Objective 3: External Repository Absorption

**Source**: https://github.com/obra/superpowers

**Integration Targets**:
| Repository | Compare Against | URL |
|------------|-----------------|-----|
| semantic-code-search | CI search_code_advanced | (in superpowers) |
| picoclaw | DC start_search + WebFetch | https://github.com/sipeed/picoclaw |
| mdream | Workflow enhancement | https://github.com/harlan-zw/mdream |
| agent-lightning | GSI Spawning compatibility | https://github.com/microsoft/agent-lightning |
| mcporter | MCP server porting | (in superpowers) |
| PromptChains | Workflow patterns | https://github.com/MIATECHPARTNERS/PromptChains |

### Objective 4: Command Standardization

**Elementary Commands** (Context Fetching):
```bash
gsi-tools phases list --type plans        # Fetch plan queue
gsi-tools roadmap get-phase <ID>          # Fetch specific phase details
gsi-tools state-snapshot                  # Get current health/status
gsi-tools summary-extract <path>          # Extract specific artifact data
```

**Chain Commands** (Workflow Execution):
```bash
gsi-tools init execute-phase <ID> --include state,config    # Start work with full context
gsi-tools init plan-phase <ID> --include roadmap,research   # Plan with dependencies
```

**Forbidden Actions**:
- ❌ Do not use native `ls` or `cat` when GSI `phases list` or `summary-extract` exists
- ❌ Do not manually read files if `--include` can fetch them

### Objective 5: Architectural Refactor

**Target**: `lib/prompt-enhancer`
**Action**: Enhance and Expand (keep name as prompt-enhancer)
**Nomenclature**: `prompt-enhancer` (NOT gsi-instruction-controller)

**Expanded Scope**:
- Must move beyond "enhancing prompts" to enforcing system behavior
- Function as the "Central Nervous System" for Claude Code
- Inject mandatory context/health checks before any execution
- **CRITICAL**: Keep name as "prompt-enhancer" for consistency

### Objective 6: Technical Debt Consolidation

**Problem**: 40+ phases exist, but integration is broken

**Actions**:
1. **Audit**: Run `gsi-tools roadmap analyze` to identify "dead" or "orphan" phases
2. **Merge**: Consolidate "piled up" phases into unified "Milestones"
3. **Enforce**: Ensure all existing phases pass the "Integration Test"

## Duplicate Phases Found

| Phase | Directories | Action |
|-------|-------------|--------|
| 28 | `28-apex-architecture`, `28-tdd-integration` | Merge or renumber |
| 37 | Three `37-*` directories | Consolidate |
| 38 | Two `38-*` directories | Consolidate |
| 41 | `41-full-system-integration`, `41-gsi-total-project-rectification` | Renumber old to 48 |

## Plans

### Core Plans (49-01 to 49-06)

- **49-01**: gsi-explorer Agent Implementation (14 tasks)
- **49-02**: Tool Precedence Enforcement (12 tasks)
- **49-03**: External Repository Research & Integration (12 tasks)
- **49-04**: Command Standardization & Protocol Definition (8 tasks)
- **49-05**: Architectural Refactor - prompt-enhancer (10 tasks)
- **49-06**: Technical Debt Consolidation (12 tasks)

### Sub-Phases (Integration of Phases 20, 25-48)

The following sub-phases integrate 17 incomplete/planned phases into Phase 49:

| Sub-Phase | Integrates | Focus Area | Priority |
|-----------|-----------|------------|----------|
| **49-A** | 20, 25, 26 | Cognitive Enhancement | HIGH |
| **49-B** | 27, 29 | SDK & Installation | HIGH |
| **49-C** | 28, 30, 31 | Documentation & Performance | MEDIUM |
| **49-D** | 32, 33 | Error Recovery & Plugins | HIGH |
| **49-E** | 34, 35 | CI/CD & Release | MEDIUM |
| **49-F** | 37, 38 | Workflow & Claudeception | HIGH |
| **49-G** | 39, 40, 41 | GSI Command & Rectification | HIGH |
| **49-H** | 42-47 | Tool Optimization & Architecture | HIGH |

**Sub-Phase Tasks**: ~120 additional tasks integrated from incomplete phases

**Claudeception Integration**: Sub-Phase 49-F includes full `/gsi:claudeception` command implementation with auto-extraction hooks.

See `SUB-PHASES.md` for detailed integration mapping.

## Success Criteria

1. gsi-explorer agent operational using only GSI internal tools
2. All hooks enforce GSI tool precedence over native tools
3. At least 3 external repositories researched and integration path defined
4. Command standardization documented and enforced
5. prompt-enhancer enhanced with expanded scope (keep name as prompt-enhancer)
6. All duplicate phases resolved (merged or renumbered)
7. Integration test passes for all active phases
8. Electrobun verified for cross-platform desktop packaging
9. files-to-prompt integrated with --cxml flag for context generation
10. MCP tools converted to native TypeScript CLI (88% token reduction)

## Dependencies

- Phase 41 (GSI Total Project Rectification)
- Phase 47 (GSI Master Architecture Rectification)

## Estimated Tasks: 186 (66 core + 120 sub-phase)

## Priority: CRITICAL - Stabilization Sprint Required

## Files in This Phase

```
49-gsi-architecture-overhaul/
├── PLAN.md              # This file
├── SUB-PHASES.md        # Sub-phase integration mapping
├── 49-01-PLAN.md        # gsi-explorer Agent
├── 49-02-PLAN.md        # Tool Precedence
├── 49-03-PLAN.md        # External Repositories
├── 49-04-PLAN.md        # Command Standardization
├── 49-05-PLAN.md        # prompt-enhancer Refactor
├── 49-06-PLAN.md        # Technical Debt
├── 49-A-PLAN.md         # Cognitive Enhancement (20,25,26)
├── 49-B-PLAN.md         # SDK & Installation (27,29)
├── 49-C-PLAN.md         # Documentation & Performance (28,30,31)
├── 49-D-PLAN.md         # Error Recovery & Plugins (32,33)
├── 49-E-PLAN.md         # CI/CD & Release (34,35)
├── 49-F-PLAN.md         # Workflow & Claudeception (37,38)
├── 49-G-PLAN.md         # GSI Command & Rectification (39,40,41)
└── 49-H-PLAN.md         # Tool Optimization & Architecture (42-47)
```
