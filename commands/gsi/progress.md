---
name: GSI:progress
description: Check project progress, show context, and route to next action (execute or plan)
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
---

<!--
CI Tools Usage:
- search_code_advanced: Find patterns across planning files
- find_files: Discover plan and summary files
-->
<objective>
Check project progress, summarize recent work and what's ahead, then intelligently route to the next action - either executing an existing plan or creating the next one.

Provides situational awareness before continuing work.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/progress.md
</execution_context>

<process>
Execute the progress workflow from @~/.claude/get-shit-indexed/workflows/progress.md end-to-end.
Preserve all routing logic (Routes A through F) and edge case handling.
</process>
