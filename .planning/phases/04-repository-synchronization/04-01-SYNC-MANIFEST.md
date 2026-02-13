# Sync Manifest: Local to Clone

**Source:** C:\Users\mose\.claude\get-shit-done (local GSD directory)
**Target:** C:\github-repos\my-claude-code-repos\get-shit-done-code-index (cloned upstream repo)
**Manifest Date:** 2026-02-13T00:33:25Z

## Instructions

Use this manifest as a checklist during Plan 04-02 execution. Check off each item as it's completed.

Legend:
- [ ] Not started
- [x] Complete

## Workflows (3-MCP Integrated)

**Source:** `C:\Users\mose\.claude\get-shit-done\workflows\`
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\get-shit-done\workflows\`

### Core Workflows (Part 1)
- [ ] execute-plan.md (DC + CI tools, primary execution workflow)
- [ ] plan-phase.md (DC + CI tools, planning workflow)
- [ ] map-codebase.md (DC + CI + CG references, includes neo4j://localhost:7687)

### Verification Workflows (Part 2)
- [ ] verify-phase.md (CI tools for phase verification)
- [ ] verify-work.md (DC + CI tools for work verification)
- [ ] transition.md (3-MCP integration for phase transitions)

### Remaining Workflows (Part 3)
- [ ] complete-milestone.md (3-MCP milestone completion)
- [ ] diagnose-issues.md (basic workflow, verify for updates)
- [ ] discovery-phase.md (basic workflow, verify for updates)
- [ ] discuss-phase.md (basic workflow, verify for updates)
- [ ] execute-phase.md (3-MCP integration)
- [ ] list-phase-assumptions.md (basic workflow, verify for updates)
- [ ] resume-project.md (basic workflow, verify for updates)

**Total Workflows:** 13 files

## References (3-MCP Tool Priority)

**Source:** `C:\Users\mose\.claude\get-shit-done\references\`
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\get-shit-done\references\`

### 3-MCP Core Documentation (HIGH PRIORITY)
- [ ] CODE-INDEX-MCP-GUIDE.md (1139 lines, complete CI server guide)
- [ ] TOOL-PRIORITY-RULES.md (667 lines, 3-MCP priority with CG)

### Supporting Documentation
- [ ] rate-limiting.md (rate limiting for 3-MCP servers)
- [ ] checkpoints.md (checkpoint patterns, verify version)
- [ ] verification-patterns.md (verification patterns, verify version)

### Existing Reference Files (VERIFY)
- [ ] tdd.md (verify for updates)
- [ ] planning-config.md (verify for updates)
- [ ] questioning.md (verify for updates)
- [ ] git-integration.md (verify for updates)
- [ ] model-profiles.md (verify for updates)
- [ ] continuation-format.md (verify for updates)
- [ ] ui-brand.md (verify for updates)

**Total References:** 12 files

## Research (MCP Tool Chain Analysis)

**Source:** `C:\Users\mose\.claude\get-shit-done\research\**` and `C:\Users\mose\.claude\get-shit-done\reseach\**`
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\research\`

### MCP Tool Chain Analysis
- [ ] research/mcp-tool-chain-analysis.md (correct spelling directory)
- [ ] reseach/mcp-tool-chain-analysis.md (note: typo in directory name)
- [ ] reseach/MCP-Tool-Chain-10-Cycle-Analysis.md (10-cycle analysis)
- [ ] reseach/MCP-Tool-Chain-Full-Analysis.md (full analysis)
- [ ] reseach/mcp-tool-chain-analysis - Copy.md (duplicate, verify if needed)
- [ ] reseach/plan.txt (planning notes)
- [ ] reseach/whole-chat.txt (chat history, may be large)

**Total Research Files:** ~6 files

**Note:** The local directory has both `research/` and `reseach/` (typo). Both should be checked and merged into target's `research/`.

## Migration History (3-MCP Migration)

**Source:** `C:\Users\mose\.claude\get-shit-done\implementing-using-code-index-mcp\`
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\implementing-using-code-index-mcp\`

### Migration Documentation
- [ ] MIGRATION-COMPLETE.md (migration completion status)
- [ ] AUDIT-REPORT.md (audit of migration)
- [ ] gsd-plans.txt (plan analysis)
- [ ] gsd-rewrite.txt (rewrite analysis)
- [ ] tool-research.txt (tool research)
- [ ] tool-requiremnts.txt (requirements, note typo)
- [ ] tool-reseach.txt (research, note typo)
- [ ] tool-research.txt (correct spelling)
- [ ] explore-agents.txt (agent exploration)
- [ ] gsd-agents.txt (GSD agent analysis)
- [ ] instructions.txt (migration instructions)

**Total Migration Files:** 11 files

## Prompts

**Source:** `C:\Users\mose\.claude\get-shit-done\prompts\`
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\prompts\`

### Prompt Files
- [ ] thinking-waves.txt (may contain CG server patterns)

**Total Prompts:** 1 file

## Planning Codebase (3-MCP Documentation)

**Source:** `C:\Users\mose\.claude\get-shit-done\.planning\codebase\`
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\.planning\codebase\`

### MCP Server Documentation (VERIFY - may already exist from Phase 3)
- [ ] MCP-SERVER-STATUS.md (DC + CI + CG status, neo4j://localhost:7687)
- [ ] MCP-TOKEN-BENCHMARK.md (80-90% token savings proof)

### Existing Codebase Docs (VERIFY for updates)
- [ ] ARCHITECTURE.md
- [ ] CONCERNS.md
- [ ] CONVENTIONS.md
- [ ] INTEGRATIONS.md
- [ ] STACK.md
- [ ] STRUCTURE.md
- [ ] TESTING.md

**Note:** The cloned repo already has 10 additional 3-MCP documentation files from Phase 3 (CODE-INDEX-MCP-GUIDE.md, TOOL-PRIORITY-RULES.md, TOOL-CHAIN-REFERENCE.md, TOOL-CHAIN-PATTERNS.md, DECISION-TREES.md, GOLDEN-PATTERN.md). These should NOT be overwritten.

**Total Codebase Files:** 7 files to verify

## Summary

### Files to Sync
- **Workflows:** 13 files
- **References:** 12 files (5 high priority, 7 verify)
- **Research:** ~6 files
- **Migration:** 11 files
- **Prompts:** 1 file
- **Codebase:** 7 files (verify only)

**Total Estimated Files:** ~50 files

### Directories to Create
- `get-shit-done-code-index/research/` (may not exist)
- `get-shit-done-code-index/implementing-using-code-index-mcp/` (may not exist)
- `get-shit-done-code-index/prompts/` (may not exist)

## Execution Checklist

Use this during Plan 04-02 execution:

### Pre-Sync
- [ ] Backup created
- [ ] Disk space verified
- [ ] Write permissions verified
- [ ] CG server confirmed at neo4j://localhost:7687

### During Sync
- [ ] Workflows synced (13/13)
- [ ] References synced (12/12)
- [ ] Research synced (~6/~6)
- [ ] Migration synced (11/11)
- [ ] Prompts synced (1/1)
- [ ] Codebase verified (7/7)

### Post-Sync
- [ ] File count verification passed
- [ ] MCP tool references verified (DC, CI, CG)
- [ ] Content spot check passed
- [ ] Git status checked
- [ ] Commit created with 3-MPC documentation

## Notes

1. **3-MCP Integration Focus:** This sync prioritizes files that contain 3-MCP (DC + CI + CG) integration.
2. **Verification First:** For files that exist in both locations, verify which has more complete 3-MCP integration before overwriting.
3. **Preserve Phase 3 Work:** The cloned repo's .planning/codebase/ has 10 new files from Phase 3 - do NOT overwrite these.
4. **Research Directory Typo:** Local has both `research/` and `reseach/` - merge content into target's `research/`.
5. **CG Server References:** Pay special attention to files containing `neo4j://localhost:7687` references.

## Completion Criteria

Plan 04-02 is complete when:
- All checkmarks above are [x]
- Verification report created
- 3-MCP integration confirmed in all synced files
- Git commit created
