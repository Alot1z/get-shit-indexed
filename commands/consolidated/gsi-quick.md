---
name: gsi:quick
description: GSI Quick - Execute a quick task with GSI guarantees (MCP tools, validation)
argument-hint: "\"<task description>\""
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__start_process
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - Task
---

<!--
Consolidated Artifact: Quick task execution
Standalone command for ad-hoc tasks
-->

<objective>
Execute a quick task with full GSI guarantees: MCP tool priority, 7-BMAD validation, and atomic commits.
</objective>

<context>
Arguments: task description in quotes

**Trigger:** `/gsi:quick "add error handling to login function"`

**Load project context if exists:**
@.planning/PROJECT.md
</context>

<process>

## Step 1: Parse Task

Extract from argument:
- Target files/components
- Action type (add, fix, refactor, etc.)
- Scope estimate

## Step 2: Quick Planning

Brief analysis:
1. Identify affected files
2. Determine approach
3. Estimate complexity (simple/moderate/complex)

For complex tasks, suggest using full `/gsi:go plan` instead.

## Step 3: Execute

Implement the task with GSI guarantees:
- Use MCP tools (Desktop Commander, Code Index)
- Follow existing patterns
- Make atomic commits
- Add appropriate error handling

## Step 4: Quick Verification

Basic checks:
- [ ] Code runs without errors
- [ ] Existing tests pass
- [ ] Changes are minimal and focused

## Step 5: Report

```
✓ Task Complete: {task description}

Files Modified:
- src/auth/login.js (3 changes)

Commit: abc123 "Add error handling to login function"

Run tests: npm test
```

</process>

<when_to_use>
**Use /gsi:quick for:**
- Single-file changes
- Bug fixes
- Small feature additions
- Quick refactoring
- Documentation updates

**Use /gsi:go for:**
- Multi-file changes
- New features
- Architecture changes
- Complex integrations
</when_to_use>

<yolo_mode>
When YOLO mode is enabled:
- Skip confirmation after completion
- Auto-commit without review
</yolo_mode>

---
**Version:** 1.0
**Type:** Standalone quick task command
