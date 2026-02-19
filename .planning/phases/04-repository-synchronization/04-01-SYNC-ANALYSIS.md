# Sync Analysis: Local vs Clone Repository

**Analysis Date:** 2026-02-13T00:33:25Z
**Source:** ~/.claude/get-shit-indexed (local GSI directory)
**Target:** C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index (cloned upstream repo)

## Executive Summary

This document provides a comprehensive comparison between the local GSI directory (source of all 3-MCP integration updates) and the cloned upstream repository. The analysis reveals significant differences in workflow files, reference documentation, and research content that need to be synchronized.

**Key Finding:** The local directory contains complete 3-MCP integration (DC + CI + CG) updates that must be synced to the cloned repository.

## Local GSI Directory Structure

```
~/.claude/get-shit-indexed\
├── .planning/
│   ├── codebase/           (7 files)
│   ├── config.json
│   ├── PROJECT.md
│   ├── REQUIREMENTS.md
│   ├── ROADMAP.md
│   └── STATE.md
├── implementing-using-code-index-mcp/  (11 files - MCP migration history)
├── prompts/                (1 file)
├── references/             (12 files - includes 3-MCP tool priority)
├── reseach/                (5 files - typo in directory name, MCP research)
├── research/               (1 file)
├── templates/              (36 files)
└── workflows/              (13 files - 3-MCP integrated)
```

**Total Files in Local GSI:**
- .planning/codebase: 7 files
- implementing-using-code-index-mcp: 11 files
- prompts: 1 file
- references: 12 files (includes CODE-INDEX-MCP-GUIDE.md, TOOL-PRIORITY-RULES.md)
- reseach: 5 files (MCP tool chain analysis)
- research: 1 file
- templates: 36 files
- workflows: 13 files

## Cloned Repository Structure

```
C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index\
├── .github/
│   ├── workflows/          (CI/CD workflows)
│   └── ISSUE_TEMPLATE/
├── .planning/
│   ├── codebase/           (17 files - includes 3-MCP documentation)
│   ├── config.json
│   ├── phases/             (8 phase directories, each with subdirectories)
│   ├── templates/
│   ├── PROJECT.md
│   ├── REQUIREMENTS.md
│   ├── ROADMAP.md
│   └── STATE.md
├── agents/                 (11 agent definition files)
├── assets/                 (logo files)
├── bin/
├── commands/GSI/           (34 command files)
├── get-shit-indexed/
│   ├── bin/
│   ├── references/         (12 files)
│   ├── templates/          (23 files)
│   └── workflows/          (34 files)
├── hooks/                  (4 hook files + start-cg-server.ps1)
└── scripts/
```

**Total Files in Cloned Repo:**
- .planning/codebase: 17 files (already has 3-MCP docs from Phase 3)
- agents: 11 files
- commands/GSI: 34 files
- get-shit-indexed/references: 12 files
- get-shit-indexed/templates: 23 files
- get-shit-indexed/workflows: 34 files
- hooks: 4 files + start-cg-server.ps1

## Critical Differences Analysis

### Category 1: Files ONLY in Local (Need Sync)

#### Workflows (3-MCP Integrated) - HIGH PRIORITY
The local workflows contain the complete 3-MCP tool integration from Phase 2. These MUST be synced:

1. **execute-plan.md** - Contains mcp__desktop-commander__* and mcp__code-index-mcp__* references
2. **plan-phase.md** - 3-MCP tool priority headers
3. **map-codebase.md** - CG server references (neo4j://localhost:7687)
4. **verify-phase.md** - CI verification tools
5. **verify-work.md** - DC + CI verification
6. **transition.md** - 3-MCP integration

#### References (3-MCP Documentation) - HIGH PRIORITY
Local has critical 3-MCP documentation that needs to be in get-shit-indexed/references:

1. **CODE-INDEX-MCP-GUIDE.md** - Complete CI server guide (1139 lines)
2. **TOOL-PRIORITY-RULES.md** - 3-MCP tool priority rules (667 lines, includes CG)
3. **rate-limiting.md** - Rate limiting patterns
4. **checkpoints.md** - Checkpoint patterns
5. **verification-patterns.md** - Verification patterns

Note: The cloned repo's .planning/codebase already has these files from Phase 3, but get-shit-indexed/references does NOT have them.

#### Research (MCP Tool Chain Analysis) - MEDIUM PRIORITY
Local has extensive MCP research that documents the 3-MCP integration analysis:

1. **reseach/MCP-Tool-Chain-10-Cycle-Analysis.md** (note: typo in "reseach")
2. **reseach/mcp-tool-chain-analysis.md**
3. **reseach/MCP-Tool-Chain-Full-Analysis.md**
4. **research/mcp-tool-chain-analysis.md**

These files document the analysis that led to the 3-MCP integration pattern.

#### Migration History (3-MCP Migration) - MEDIUM PRIORITY
**implementing-using-code-index-mcp/** directory contains:
- MIGRATION-COMPLETE.md
- AUDIT-REPORT.md
- GSI-plans.txt
- GSI-rewrite.txt
- tool-research.txt

This directory documents the migration from native tools to 3-MCP tools.

#### Prompts - LOW PRIORITY
**prompts/thinking-waves.txt** - May reference CG server patterns

### Category 2: Files ONLY in Clone (Keep These)

These files are part of the cloned repo structure and should be preserved:

1. **agents/** - 11 agent definition files (not in local)
2. **commands/GSI/** - 34 command files (not in local)
3. **hooks/** - Hook files including start-cg-server.ps1 (not in local)
4. **.github/** - GitHub workflows and templates (not in local)
5. **get-shit-indexed/bin/** - Binary files (not in local)
6. **assets/** - Logo files (not in local)

### Category 3: Files in BOTH (Compare for 3-MCP Content)

#### get-shit-indexed/workflows/

| File | Local | Clone | Sync Needed |
|------|-------|-------|-------------|
| execute-plan.md | Has DC+CI | Has DC+CI | **VERIFY** |
| plan-phase.md | Has DC+CI | Has DC+CI | **VERIFY** |
| map-codebase.md | Has DC+CI+CG | Has DC+CI+CG | **VERIFY** |
| verify-phase.md | Has DC+CI | Has DC+CI | **VERIFY** |
| verify-work.md | Has DC+CI | Has DC+CI | **VERIFY** |
| transition.md | Has 3-MCP | Has 3-MCP | **VERIFY** |
| execute-phase.md | Has 3-MCP | Has 3-MCP | **VERIFY** |
| discovery-phase.md | Basic | Basic | No |
| discuss-phase.md | Basic | Basic | No |
| complete-milestone.md | Basic | Has 3-MCP | **VERIFY** |
| diagnose-issues.md | Basic | Basic | No |
| list-phase-assumptions.md | Basic | Basic | No |
| resume-project.md | Basic | Basic | No |

#### get-shit-indexed/references/

| File | Local | Clone | Sync Needed |
|------|-------|-------|-------------|
| CODE-INDEX-MCP-GUIDE.md | **YES** | NO | **YES** |
| TOOL-PRIORITY-RULES.md | **YES** | NO | **YES** |
| rate-limiting.md | **YES** | NO | **YES** |
| checkpoints.md | **YES** | Has | **YES** (may differ) |
| verification-patterns.md | **YES** | Has | **YES** (may differ) |
| tdd.md | YES | Has | **VERIFY** |
| planning-config.md | YES | Has | **VERIFY** |
| questioning.md | YES | Has | **VERIFY** |
| git-integration.md | YES | Has | **VERIFY** |
| model-profiles.md | YES | Has | **VERIFY** |
| continuation-format.md | YES | Has | **VERIFY** |
| ui-brand.md | YES | Has | **VERIFY** |

#### .planning/codebase/

| File | Local | Clone | Sync Needed |
|------|-------|-------|-------------|
| ARCHITECTURE.md | YES | YES | **VERIFY** |
| CONCERNS.md | YES | YES | **VERIFY** |
| CONVENTIONS.md | YES | YES | **VERIFY** |
| INTEGRATIONS.md | YES | YES | **VERIFY** |
| STACK.md | YES | YES | **VERIFY** |
| STRUCTURE.md | YES | YES | **VERIFY** |
| TESTING.md | YES | YES | **VERIFY** |
| MCP-SERVER-STATUS.md | **YES** | **YES** | **VERIFY** |
| MCP-TOKEN-BENCHMARK.md | **YES** | **YES** | **VERIFY** |
| CODE-INDEX-MCP-GUIDE.md | NO | **YES** | No (clone has Phase 3 version) |
| TOOL-PRIORITY-RULES.md | NO | **YES** | No (clone has Phase 3 version) |
| TOOL-CHAIN-REFERENCE.md | NO | **YES** | No (Phase 3 created) |
| TOOL-CHAIN-PATTERNS.md | NO | **YES** | No (Phase 3 created) |
| DECISION-TREES.md | NO | **YES** | No (Phase 3 created) |
| GOLDEN-PATTERN.md | NO | **YES** | No (Phase 3 created) |

Note: Local's .planning/codebase has 7 files. Clone's .planning/codebase has 17 files (Phase 3 added 10 new documentation files).

## 3-MCP Integration Status

### Desktop Commander (DC)
- **Local:** Workflows contain mcp__desktop-commander__* references
- **Clone:** Workflows contain mcp__desktop-commander__* references (from Phase 2)
- **Status:** Already in clone, verify consistency

### Code-Index MCP (CI)
- **Local:** Workflows contain mcp__code-index-mcp__* references
- **Clone:** Workflows contain mcp__code-index-mcp__* references (from Phase 2)
- **Status:** Already in clone, verify consistency

### CodeGraphContext (CG)
- **Local:** References to neo4j://localhost:7687 in planning docs
- **Clone:** MCP-SERVER-STATUS.md has CG server documentation (from Phase 3)
- **Status:** Already documented in .planning/codebase

**Key Insight:** The cloned repository already has significant 3-MCP integration from Phases 2 and 3. The sync should focus on:
1. Ensuring get-shit-indexed/references has the 3-MCP documentation
2. Adding research files that document the 3-MCP analysis
3. Adding migration history directory
4. Verifying workflow files have consistent 3-MCP integration

## Sync Recommendations

### Priority 1: Must Sync (3-MCP Core Documentation)
1. Copy references/CODE-INDEX-MCP-GUIDE.md to get-shit-indexed/references/
2. Copy references/TOOL-PRIORITY-RULES.md to get-shit-indexed/references/
3. Copy references/rate-limiting.md to get-shit-indexed/references/
4. Sync research/ and reseach/ directories (MCP analysis documentation)
5. Copy implementing-using-code-index-mcp/ directory

### Priority 2: Verify and Update (3-MCP Integration Consistency)
1. Compare workflow files between local and clone
2. Ensure <tool_requirements> sections are consistent
3. Verify <code_index_mcp> headers are present
4. Check CG server references (neo4j://localhost:7687)

### Priority 3: Optional (Research and History)
1. Copy prompts/thinking-waves.txt if it has CG patterns
2. Consider adding templates/ from local if they have updates

## File Count Summary

| Location | Workflows | References | Research | Templates | Other | Total |
|----------|-----------|------------|----------|-----------|-------|-------|
| Local | 13 | 12 | 6 | 36 | 19 | 86 |
| Clone (get-shit-indexed/) | 34 | 12 | 0 | 23 | 2 | 71 |
| Clone (root) | 0 | 0 | 0 | 0 | 67 | 67 |

## 3-MCP Integration Status (Verified)

### Desktop Commander (DC)
**Status:** FULLY INTEGRATED (246+ tool references)
- **Files with DC integration:**
  - execute-plan.md, plan-phase.md, map-codebase.md
  - verify-phase.md, verify-work.md, transition.md
  - execute-phase.md, complete-milestone.md
  - All workflow files (13/13 have DC tools)
- **Tools Used:**
  - File operations: read_file, write_file, edit_block, list_directory
  - Process operations: start_process, interact_with_process
  - Search operations: start_search

### Code-Index MCP (CI)
**Status:** FULLY INTEGRATED (41+ tool references)
- **Files with CI integration:**
  - execute-phase.md, plan-phase.md, verify-phase.md
  - verify-work.md, add-todo.md, progress.md
  - pause-work.md, plan-milestone-gaps.md
- **Tools Used:**
  - Code search: search_code_advanced
  - File finding: find_files
  - File analysis: get_file_summary
  - Symbol navigation: get_symbol_body

### CodeGraphContext (CG)
**Status:** DOCUMENTED AND REFERENCED
- **Server URL:** neo4j://localhost:7687
- **Files with CG references:**
  - workflows/execute-plan.md (relationship analysis section)
  - research/MCP-Tool-Chain-*.md files (analysis documentation)
  - .planning/codebase/MCP-SERVER-STATUS.md (Phase 3)
  - hooks/start-cg-server.ps1 (auto-startup hook)
- **Integration Pattern:**
  - Relationship mapping between code entities
  - Caller/callee analysis
  - Code graph queries at neo4j://localhost:7687

### Backup Status
**Created:** 2026-02-13T00:33:25Z
**Location:** C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index-backup-20260213-003325
**Contents:** 238 directories, 602 files, 5.40 MB
**Status:** Complete and verified

## Next Steps

1. [x] Create sync strategy document (04-01-SYNC-STRATEGY.md)
2. [x] Create sync manifest (04-01-SYNC-MANIFEST.md)
3. [x] Create prerequisites document (04-01-PREREQUISITES.md)
4. [x] Create backup of cloned repository
5. [ ] Proceed with Plan 04-02 for actual sync execution
