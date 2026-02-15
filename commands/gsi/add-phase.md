---
name: GSI:add-phase
description: Add phase to end of current milestone in roadmap
argument-hint: <description>
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
Add a new integer phase to the end of the current milestone in the roadmap.

Routes to the add-phase workflow which handles:
- Phase number calculation (next sequential integer)
- Directory creation with slug generation
- Roadmap structure updates
- STATE.md roadmap evolution tracking
</objective>

<execution_context>
@.planning/ROADMAP.md
@.planning/STATE.md
@~/.claude/get-shit-indexed/workflows/add-phase.md
</execution_context>

<process>
**Follow the add-phase workflow** from `@~/.claude/get-shit-indexed/workflows/add-phase.md`.

The workflow handles all logic including:
1. Argument parsing and validation
2. Roadmap existence checking
3. Current milestone identification
4. Next phase number calculation (ignoring decimals)
5. Slug generation from description
6. Phase directory creation
7. Roadmap entry insertion
8. STATE.md updates
</process>

<code_index_mcp>
**Priority: MEDIUM** - Support for phase integration analysis

**CI Tools Integration:**
- `search_code_advanced`: Find existing phase patterns for consistency
- `find_files`: Locate related phase documents for context
- `get_file_summary`: Understand neighboring phase structure
- `get_symbol_body`: Extract phase implementation patterns

**Usage Context:**
When adding new phases:
- Check for naming pattern consistency with existing phases
- Understand related work in neighboring phases
- Identify integration points with existing work
- Reference established patterns from similar phases

**Token Savings:** ~65% vs manual phase analysis for integration planning
</code_index_mcp>
