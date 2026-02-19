# Sync Strategy: Local to Clone

**Strategy Date:** 2026-02-13T00:33:25Z
**Source:** ~/.claude/get-shit-indexed (local GSI directory)
**Target:** C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index (cloned upstream repo)

## Sync Direction

**ONE-WAY SYNC:** Local → Clone

- **Source:** ~/.claude/get-shit-indexed (contains all Phase 1-3 3-MCP integration updates)
- **Target:** C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index (upstream repository to be updated)

**Rationale:** The local directory has been the active development environment for Phases 1-3, with all 3-MCP integration work (DC + CI + CG) being done there. The cloned repository needs to receive these updates to become the single source of truth.

## Content Categories

### Category 1: 3-MCP-Integrated Workflows (HIGH PRIORITY)

**Source:** `~/.claude/get-shit-indexed\workflows\*.md` (13 files)
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index\get-shit-indexed\workflows\`

These files contain the core 3-MCP tool integration:
- Desktop Commander (mcp__desktop-commander__*)
- Code-Index MCP (mcp__code-index-mcp__*)
- CodeGraphContext (neo4j://localhost:7687)

**Key Files:**
- execute-plan.md - Primary execution workflow with DC+CI tools
- plan-phase.md - Planning workflow with DC+CI tools
- map-codebase.md - Codebase mapping with DC+CI+CG references
- verify-phase.md - Verification with CI tools
- verify-work.md - Work verification with DC+CI tools

### Category 2: Reference Files with 3-MCP Tool Priority Rules (HIGH PRIORITY)

**Source:** `~/.claude/get-shit-indexed\references\*.md` (12 files)
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index\get-shit-indexed\references\`

Critical documentation for 3-MCP tool chain:
- CODE-INDEX-MCP-GUIDE.md - Complete CI server guide (1139 lines)
- TOOL-PRIORITY-RULES.md - 3-MCP tool priority rules (667 lines, includes CG)
- rate-limiting.md - Rate limiting patterns for 3-MCP servers
- checkpoints.md - Checkpoint patterns
- verification-patterns.md - Verification patterns

**Note:** The cloned repo's .planning/codebase/ already has these from Phase 3, but get-shit-indexed/references/ does NOT.

### Category 3: Research Files (MCP Tool Chain Analysis) (MEDIUM PRIORITY)

**Source:** `~/.claude/get-shit-indexed\research\**` and `~/.claude/get-shit-indexed\reseach\**`
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index\research\`

Documentation of the 3-MCP integration analysis:
- MCP-Tool-Chain-10-Cycle-Analysis.md
- mcp-tool-chain-analysis.md
- MCP-Tool-Chain-Full-Analysis.md

**Note:** Local has a typo "reseach" - both directories should be checked and merged.

### Category 4: Migration History (3-MCP Migration) (MEDIUM PRIORITY)

**Source:** `~/.claude/get-shit-indexed\implementing-using-code-index-mcp\`
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index\implementing-using-code-index-mcp\`

Contains the migration history from native tools to 3-MCP tools:
- MIGRATION-COMPLETE.md
- AUDIT-REPORT.md
- GSI-plans.txt
- GSI-rewrite.txt
- tool-research.txt

### Category 5: MCP Server Documentation (LOW PRIORITY)

**Source:** `~/.claude/get-shit-indexed\.planning\codebase\MCP-*.md`
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index\.planning\codebase\`

**Status:** Already in clone from Phase 3. Verify consistency.

### Category 6: Prompts (LOW PRIORITY)

**Source:** `~/.claude/get-shit-indexed\prompts\thinking-waves.txt`
**Target:** `C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index\prompts\`

May contain CG server patterns.

## Sync Methods

### Method A: Direct File Copy (New Files)

For files that don't exist in the target:
1. Use mcp__desktop-commander__read_file on source
2. Use mcp__desktop-commander__write_file on destination
3. Verify file was created successfully

**Use for:**
- New reference files (CODE-INDEX-MCP-GUIDE.md, TOOL-PRIORITY-RULES.md)
- Research files
- implementing-using-code-index-mcp directory
- prompts directory

### Method B: Content-Aware Merge (Existing Files)

For files that exist in both locations:
1. Compare file sizes and timestamps
2. Read both versions
3. Determine which has 3-MCP integration
4. If local has more complete 3-MCP integration, overwrite
5. If versions are comparable, keep target (may have Phase 3 updates)

**Use for:**
- Workflow files (verify 3-MCP integration completeness)
- Reference files that exist in both

### Method C: Preserve Version History (Git)

For all changes:
1. Create backup before sync (Task 8)
2. Stage all changes with git add
3. Create meaningful git commit
4. Preserve history for rollback

**Use for:** All sync operations

## Verification Steps

### Pre-Sync Verification

1. **Backup Created:**
   ```bash
   robocopy C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index 
             C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index-backup-[timestamp] /E
   ```

2. **CG Server Verified:**
   - CG server running at neo4j://localhost:7687
   - MCP-SERVER-STATUS.md documents CG server

3. **No Uncommitted Changes:**
   ```bash
   git status
   ```
   Should show clean working directory

### During Sync Verification

1. **File Count Verification:**
   - Before sync: Count files in target
   - After sync: Count files in target
   - Verify expected increase

2. **MCP Tool Reference Verification:**
   ```bash
   # Search for DC integration
   mcp__code-index-mcp__search_code_advanced pattern="mcp__desktop-commander__"
   
   # Search for CI integration
   mcp__code-index-mcp__search_code_advanced pattern="mcp__code-index-mcp__"
   
   # Search for CG integration
   mcp__code-index-mcp__search_code_advanced pattern="neo4j|CodeGraphContext"
   ```

3. **Content Spot Check:**
   - Read random synced files
   - Verify 3-MCP integration present
   - Check for corruption

### Post-Sync Verification

1. **Git Status Check:**
   ```bash
   git status
   ```
   Should show all expected files as staged/modified

2. **Commit Verification:**
   ```bash
   git show --stat
   ```
   Verify commit includes all expected files

3. **3-MCP Integration Verification:**
   - Create verification report (04-02-VERIFICATION.md)
   - Document DC, CI, CG integration counts
   - Verify coverage percentage

## Rollback Plan

If sync fails or causes issues:

### Option 1: Restore from Backup
```bash
# Delete failed sync
rm -rf C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index\*

# Restore from backup
robocopy C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index-backup-[timestamp] 
          C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index /E
```

### Option 2: Git Reset
```bash
# Reset to before sync commit
git reset --hard HEAD~1

# Verify reset
git log -1
```

### Option 3: Manual File Restoration
If only specific files are problematic:
1. Identify problematic files
2. Restore individually from backup
3. Verify fix

## Success Criteria

Sync is successful when:

1. **All Files Synced:**
   - [ ] All workflow files from local exist in clone
   - [ ] All reference files from local exist in clone
   - [ ] All research files from local exist in clone
   - [ ] implementing-using-code-index-mcp directory exists in clone

2. **3-MCP Integration Verified:**
   - [ ] DC tools (mcp__desktop-commander__*) found in workflows
   - [ ] CI tools (mcp__code-index-mcp__*) found in workflows
   - [ ] CG references (neo4j://localhost:7687) found in planning docs

3. **Git Status Clean:**
   - [ ] All changes committed
   - [ ] Commit message includes 3-MCP integration description
   - [ ] Working directory clean

4. **Verification Complete:**
   - [ ] Verification report created
   - [ ] File counts match expectations
   - [ ] No corruption detected

## Risk Assessment

### Low Risk
- Copying new files (reference, research)
- Creating new directories

### Medium Risk
- Overwriting existing workflow files
- Modifying get-shit-indexed/references/

### Mitigation
- Backup before any operations
- Content-aware merge (check before overwrite)
- Git history preservation for rollback

## Execution Order (Plan 04-02)

1. Create backup (Task 8)
2. Sync workflow files (Tasks 1-3)
3. Sync reference files (Task 4)
4. Sync research files (Task 5)
5. Sync implementing-using-code-index-mcp (Task 6)
6. Sync prompts (Task 7)
7. Sync .planning/codebase (Task 8)
8. Verify 3-MCP integration (Task 9)
9. Update ROADMAP.md (Task 10)

This order prioritizes the most critical 3-MCP content first.
