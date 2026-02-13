# Sync Prerequisites: Local to Clone

**Document Date:** 2026-02-13T00:33:25Z
**For:** Plan 04-02 (Repository Sync Execution)

## Pre-Sync Checklist

Before executing the sync from local to clone, verify the following:

### 1. CG Server Verification
- [ ] CG server is running at neo4j://localhost:7687
- [ ] CG server is accessible via MCP
- [ ] MCP-SERVER-STATUS.md documents CG server status
- [ ] hooks/start-cg-server.ps1 exists for auto-startup

**Verification Command:**
```powershell
# Check CG server connectivity
Test-NetConnection -ComputerName localhost -Port 7687
```

**Expected Result:** TCP test succeeded for port 7687

### 2. Git Repository Status
- [ ] No uncommitted changes in cloned repository
- [ ] Current branch is `main`
- [ ] Remote `origin` is configured
- [ ] Repository is clean (working directory)

**Verification Commands:**
```bash
git status
git branch -vv
git remote -v
```

**Expected Result:** 
- `git status` shows "nothing to commit, working tree clean"
- `git branch` shows current branch is `main`
- `git remote` shows origin URL

### 3. Backup Creation
- [ ] Backup directory created with timestamp
- [ ] Backup contains all repository content
- [ ] Backup size is comparable to source
- [ ] Backup location documented for rollback

**Backup Command:**
```bash
robocopy C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index 
          C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index-backup-20260213-003325 /E /R:0 /W:0
```

### 4. Disk Space Verification
- [ ] At least 2x clone size available
- [ ] Target directory has write permissions
- [ ] Temporary space available for operations

**Verification Command:**
```powershell
Get-PSDrive C | Select-Object Used,Free,@{Name="UsedGB";Expression={[math]::Round($_.Used/1GB,2)}},@{Name="FreeGB";Expression={[math]::Round($_.Free/1GB,2)}}
```

**Expected Result:** Free space > 2GB (conservative estimate)

### 5. 3-MCP Verification
- [ ] Desktop Commander (DC) tools documented in workflows
- [ ] Code-Index MCP (CI) tools documented in workflows
- [ ] CodeGraphContext (CG) references documented (neo4j://localhost:7687)
- [ ] MCP-SERVER-STATUS.md includes all 3 servers

**3-MCP Status Summary:**
- **DC**: 246+ tool references across workflow files
- **CI**: 41+ tool references across workflow files
- **CG**: Documented in execute-plan.md and research files

## 3-MCP Integration Status

### Desktop Commander (DC)
**Status:** Fully Integrated
- **Tool References:** mcp__desktop-commander__* (246+ matches)
- **Key Files:**
  - workflows/execute-plan.md
  - workflows/plan-phase.md
  - workflows/map-codebase.md
  - workflows/verify-phase.md
  - workflows/verify-work.md
  - All other workflow files

**Integration Pattern:**
- File operations: read_file, write_file, edit_block, list_directory
- Process operations: start_process, interact_with_process
- Search operations: start_search

### Code-Index MCP (CI)
**Status:** Fully Integrated
- **Tool References:** mcp__code-index-mcp__* (41+ matches)
- **Key Files:**
  - workflows/execute-phase.md
  - workflows/plan-phase.md
  - workflows/verify-phase.md
  - workflows/verify-work.md
  - workflows/add-todo.md

**Integration Pattern:**
- Code search: search_code_advanced
- File finding: find_files
- File analysis: get_file_summary
- Symbol navigation: get_symbol_body

### CodeGraphContext (CG)
**Status:** Documented and Referenced
- **Server URL:** neo4j://localhost:7687
- **Key Files:**
  - workflows/execute-plan.md (relationship analysis section)
  - .planning/codebase/MCP-SERVER-STATUS.md
  - research/MCP-Tool-Chain-*.md files
  - hooks/start-cg-server.ps1 (auto-startup)

**Integration Pattern:**
- Relationship mapping between code entities
- Caller/callee analysis
- Code graph queries at neo4j://localhost:7687

## Rollback Plan

If sync fails or causes issues, use one of these rollback methods:

### Option 1: Restore from Backup (Recommended)

**Steps:**
1. Delete failed sync content:
   ```bash
   cd C:\github-repos\my-claude-code-repos
   rm -rf get-shit-indexed-code-index
   ```

2. Restore from backup:
   ```bash
   robocopy get-shit-indexed-code-index-backup-20260213-003325 
             get-shit-indexed-code-index /E /R:0 /W:0
   ```

3. Verify restoration:
   ```bash
   git status
   git log -3
   ```

### Option 2: Git Reset (If Commit Created)

**Steps:**
1. Reset to before sync commit:
   ```bash
   git reset --hard HEAD~1
   ```

2. Verify reset:
   ```bash
   git log -1
   git status
   ```

3. Force clean (if needed):
   ```bash
   git clean -fd
   ```

### Option 3: Selective File Restoration

If only specific files are problematic:

1. Identify problematic files from git diff:
   ```bash
   git diff --name-only
   ```

2. Restore individual files from backup:
   ```bash
   copy get-shit-indexed-code-index-backup-20260213-003325\path\to\file.md 
        get-shit-indexed-code-index\path\to\file.md
   ```

3. Verify fix:
   ```bash
   git diff path/to/file.md
   ```

## Rollback Verification

After rollback, verify:

1. **Repository State:**
   - [ ] Git status is clean
   - [ ] Git log shows expected commit history
   - [ ] No unexpected files present

2. **3-MCP Integration:**
   - [ ] DC tools still work (test a workflow)
   - [ ] CI tools still work (test a search)
   - [ ] CG server still accessible

3. **File Counts:**
   - [ ] Workflow file count matches pre-sync
   - [ ] Reference file count matches pre-sync
   - [ ] Planning directory intact

## Troubleshooting

### Issue: CG Server Not Running
**Symptom:** Connection refused on port 7687

**Solution:**
1. Start CG server manually:
   ```powershell
   .\hooks\start-cg-server.ps1
   ```

2. Or restart MCP server that provides CG

3. Verify connectivity:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 7687
   ```

### Issue: Insufficient Disk Space
**Symptom:** Robocopy fails with "insufficient disk space"

**Solution:**
1. Clean up temporary files:
   ```powershell
   Remove-Item -Recurse -Force $env:TEMP\*
   ```

2. Use alternative backup location with more space

3. Use external drive for backup

### Issue: Git Repository Dirty
**Symptom:** `git status` shows uncommitted changes

**Solution:**
1. Stash changes:
   ```bash
   git stash save "Pre-sync stash"
   ```

2. Or commit changes:
   ```bash
   git add -A
   git commit -m "Pre-sync commit"
   ```

3. Verify clean:
   ```bash
   git status
   ```

## Post-Sync Verification

After sync completes (Plan 04-03), verify:

1. **Git Status:**
   - [ ] All changes committed
   - [ ] Commit includes 3-MCP integration
   - [ ] Working directory clean

2. **File Counts:**
   - [ ] Workflow files increased (new 3-MCP files)
   - [ ] Reference files increased (new 3-MCP docs)
   - [ ] Research files present (MCP analysis)

3. **3-MCP Integration:**
   - [ ] DC tools work in cloned repo
   - [ ] CI tools work in cloned repo
   - [ ] CG references present in docs

4. **Push Readiness:**
   - [ ] Repository ready for git push
   - [ ] Push command documented
   - [ ] User notified to execute push

## Success Criteria

Prerequisites are met when:

- [ ] CG server verified at neo4j://localhost:7687
- [ ] Git repository is clean
- [ ] Backup created successfully
- [ ] Disk space sufficient
- [ ] Write permissions verified
- [ ] 3-MCP status documented
- [ ] Rollback plan understood

**When all items checked, proceed to Plan 04-02 execution.**
