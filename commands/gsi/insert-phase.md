---
name: GSI:insert-phase
description: Insert urgent work as decimal phase (e.g., 72.1) between existing phases
argument-hint: <after> <description>
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
---

<objective>
Insert a decimal phase for urgent work discovered mid-milestone that must be completed between existing integer phases.

Uses decimal numbering (72.1, 72.2, etc.) to preserve the logical sequence of planned phases while accommodating urgent insertions.

Purpose: Handle urgent work discovered during execution without renumbering entire roadmap.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/insert-phase.md
</execution_context>

<context>
Arguments: $ARGUMENTS (format: <after-phase-number> <description>)

@.planning/ROADMAP.md
@.planning/STATE.md
</context>

<process>
Execute the insert-phase workflow from @~/.claude/get-shit-indexed/workflows/insert-phase.md end-to-end.
Preserve all validation gates (argument parsing, phase verification, decimal calculation, roadmap updates).
</process>

<code_index_mcp>
**Priority: MEDIUM** - Support for phase relationship analysis

**CI Tools Integration:**
- `search_code_advanced`: Find contextual relationships for inserted phase
- `find_files`: Locate adjacent phase documents
- `get_file_summary`: Understand neighboring phase content
- `get_symbol_body`: Extract integration patterns from related work

**Usage Context:**
When inserting decimal phases:
- Analyze relationships between existing phases
- Understand integration points for the new phase
- Identify dependencies and impact on existing work
- Maintain consistency with phase naming and structure

**Token Savings:** ~70% vs manual phase relationship analysis
</code_index_mcp>
