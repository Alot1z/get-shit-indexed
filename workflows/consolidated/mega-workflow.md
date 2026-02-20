# GSI Mega Workflow Process

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- Use `mcp__desktop-commander__read_file` instead of Read
- Use `mcp__desktop-commander__write_file` instead of Write

**Code Search:**
- Use `mcp__code-index-mcp__search_code_advanced` instead of Grep
- Use `mcp__code-index-mcp__find_files` instead of Glob
</tool_requirements>

<purpose>
Detailed workflow definitions for GSI mega-workflow phases.
</purpose>

<phases>

## Phase: INIT
1. Question user until understanding is clear
2. Spawn 4 parallel researcher agents
3. Extract v1/v2/out-of-scope requirements
4. Create ROADMAP.md with phases
5. Initialize STATE.md

## Phase: PLAN
1. Research implementation approach
2. Create {phase}-{plan}-PLAN.md files
3. Verify plans against requirements
4. Present for user confirmation

## Phase: EXECUTE
1. Calculate wave structure from dependencies
2. Spawn executor agents for wave (parallel)
3. Execute tasks sequentially within plan
4. Commit after each task

## Phase: VERIFY
1. Run 7-BMAD validation gates
2. User acceptance testing
3. Gap analysis if issues found
4. Mark phase complete or remediate

## Phase: COMPLETE
1. Archive milestone to .planning/archive/
2. Tag git release
3. Generate summary
4. Option to start new milestone

</phases>

<transitions>
```
INIT → PLAN (after roadmap created)
PLAN → EXECUTE (after plans verified)
EXECUTE → VERIFY (after all plans complete)
VERIFY → PLAN (if gaps found)
VERIFY → COMPLETE (if all gates pass)
COMPLETE → INIT (new milestone) or END
```
</transitions>

---
**Version:** 1.0
**Source:** workflows/consolidated/mega-workflow.md
