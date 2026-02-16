# Git Timeout Research Plan

## Overview
Investigate why git commits keep timing out and create a plan to fix the issue.

## Research Required

### Domain Research
1. **Git Timeout Causes**
   - Study common git timeout scenarios
   - Research large file handling issues
   - Analyze network-related timeouts

2. **Git Hook Interactions**
   - Research how hooks affect commit performance
   - Study pre-commit hook timeout patterns
   - Investigate hook execution blocking

### Technical Research
1. **Current Git Configuration**
   - Check git timeout settings
   - Review HTTP post buffer settings
   - Examine credential helper configuration

2. **Hook Analysis**
   - Examine hooks/pre-tool-use/bash-redirect.js
   - Check for blocking operations
   - Identify MCP server interaction delays

## Investigation Tasks

### Sub-task 1: Git Configuration Audit
- [ ] Check global git settings
  ```bash
  git config --global --list
  ```
  
- [ ] Check project git settings
  ```bash
  git config --local --list
  ```
  
- [ ] Identify timeout-related settings
  - http.timeout
  - http.postBuffer
  - core.compression
  - credential.helper

### Sub-task 2: Hook Execution Analysis
- [ ] Analyze bash-redirect.js hook
  - Check for blocking operations
  - Identify MCP server calls
  - Measure execution time
  
- [ ] Test hook execution time
  ```bash
  time echo "test" | hooks/pre-tool-use/bash-redirect.js
  ```
  
- [ ] Identify bottlenecks
  - MCP server startup time
  - File operation delays
  - Network-related calls

### Sub-task 3: MCP Server Investigation
- [ ] Check MCP server status
  - Are servers running?
  - Response time measurement
  - Connection pooling issues
  
- [ ] Test commits with MCP disabled
  - Temporarily disable MCP servers
  - Attempt commit
  - Compare timing

### Sub-task 4: Network Analysis
- [ ] Test GitHub connectivity
  ```bash
  ssh -T git@github.com
  ping github.com
  traceroute github.com
  ```
  
- [ ] Check repository size
  ```bash
  du -sh .git
  git count-objects -vH
  ```
  
- [ ] Identify large files
  ```bash
  find . -type f -size +10M
  git rev-list --objects --all |
    git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' |
    awk '/^blob/ {print substr($0,6)}' |
    sort -n -k2 |
    tail -10
  ```

## Root Cause Hypotheses

### Hypothesis 1: Hook Timeout
**Theory**: The bash-redirect hook is taking too long to execute, causing git to timeout.

**Test**: Disable hook and try committing
```bash
cd .git/hooks
rename pre-commit pre-commit.bak
git commit -m "test"
```

**Expected**: If commit succeeds, hook is the issue.

### Hypothesis 2: MCP Server Blocking
**Theory**: Hook waits for MCP server response that times out.

**Test**: Check if MCP servers are running and responsive
```bash
# Check MCP server status
# Test server response times
```

**Expected**: If servers are down/slow, this is the cause.

### Hypothesis 3: Large File Upload
**Theory**: Repository has large files causing upload timeout.

**Test**: Check for large files as shown in Sub-task 4.

**Expected**: If large files found, may need Git LFS or compression.

### Hypothesis 4: Network Timeout
**Theory**: Unstable connection to GitHub.

**Test**: Run connectivity tests in Sub-task 4.

**Expected**: If connection issues, may need to increase timeout values.

## Resolution Tasks

### Sub-task 1: Apply Fixes Based on Findings

**If hook is the issue:**
- [ ] Optimize hook execution time
- [ ] Add timeout handling in hook
- [ ] Make hook non-blocking where possible

**If MCP servers are the issue:**
- [ ] Add timeout to MCP calls in hook
- [ ] Gracefully handle unavailability
- [ ] Add retry logic with backoff

**If large files are the issue:**
- [ ] Implement Git LFS
- [ ] Remove/add to .gitignore
- [ ] Optimize repository size

**If network is the issue:**
- [ ] Increase git timeout
  ```bash
  git config --global http.timeout 600
  git config --global http.postBuffer 524288000
  ```

### Sub-task 2: Prevent Future Timeouts
- [ ] Add pre-commit validation
  - Check repository size before commit
  - Warn about large files
  - Test hook execution time
  
- [ ] Create diagnostic command
  ```bash
  /gsi:diagnose-git
  ```
  - Check git configuration
  - Test MCP server connectivity
  - Report potential issues

### Sub-task 3: Documentation
- [ ] Document common timeout issues
  - Add to troubleshooting section
  - Provide fix instructions
  
- [ ] Create git configuration recommendations
  - Suggested timeout values
  - MCP server requirements
  - Network considerations

## Verification Criteria
- [ ] Root cause identified
- [ ] Fix applied and tested
- [ ] Can commit successfully
- [ ] Future timeouts prevented
- [ ] Documentation updated

## Success Metrics
- Git commits succeed consistently
- Commit time <30 seconds
- No intermittent timeout errors
