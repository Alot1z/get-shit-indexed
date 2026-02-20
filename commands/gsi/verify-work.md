---
name: gsi:verify-work
description: Validate built features through conversational UAT
argument-hint: "[phase number, e.g., '4']"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__write_file
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
---

> ⚠️ **DEPRECATED**: This command is now part of `/gsi:check` (GSI Check).
> Use `/gsi:check [phase]` for unified verification and auditing.
> This command remains for backward compatibility.

<!--
CI Tools Usage:
- search_code_advanced: Find code patterns across project
- find_files: Discover plan/summary/verification files
- get_file_summary: Understand file structure
- get_symbol_body: Extract implementation details and function bodies
-->
<objective>
Validate built features through conversational testing with persistent state.

Purpose: Confirm what Claude built actually works from user's perspective. One test at a time, plain text responses, no interrogation. When issues are found, automatically diagnose, plan fixes, and prepare for execution.

Output: {phase}-UAT.md tracking all test results. If issues found: diagnosed gaps, verified fix plans ready for /gsi:execute-phase
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/verify-work.md
@~/.claude/get-shit-indexed/templates/UAT.md
</execution_context>

<context>
Phase: $ARGUMENTS (optional)
- If provided: Test specific phase (e.g., "4")
- If not provided: Check for active sessions or prompt for phase

@.planning/STATE.md
@.planning/ROADMAP.md
</context>

<process>
Execute the verify-work workflow from @~/.claude/get-shit-indexed/workflows/verify-work.md end-to-end.
Preserve all workflow gates (session management, test presentation, diagnosis, fix planning, routing).
</process>
