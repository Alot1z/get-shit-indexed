---
name: GSI:check-todos
description: List pending todos and select one to work on
argument-hint: [area filter]
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - Task
---

<objective>
List all pending todos, allow selection, load full context for the selected todo, and route to appropriate action.

Routes to the check-todos workflow which handles:
- Todo counting and listing with area filtering
- Interactive selection with full context loading
- Roadmap correlation checking
- Action routing (work now, add to phase, brainstorm, create phase)
- STATE.md updates and git commits
</objective>

<execution_context>
@.planning/STATE.md
@.planning/ROADMAP.md
@~/.claude/get-shit-indexed/workflows/check-todos.md
</execution_context>

<process>
**Follow the check-todos workflow** from `@~/.claude/get-shit-indexed/workflows/check-todos.md`.

The workflow handles all logic including:
1. Todo existence checking
2. Area filtering
3. Interactive listing and selection
4. Full context loading with file summaries
5. Roadmap correlation checking
6. Action offering and execution
7. STATE.md updates
8. Git commits
</process>

<code_index_mcp>
**Priority: HIGH** - Direct CI usage for todo file processing

**CI Tools Integration:**
- `search_code_advanced`: Find todos across project by keywords or patterns
- `find_files`: Discover todo files in specific directories or areas
- `get_file_summary`: Quickly understand todo file structure before reading

**Usage Context:**
When checking todos, CI tools help:
- Locate todo files without manual directory traversal
- Search for specific todo content across all files
- Get summaries of todo files before full reads
- Filter todos by technical patterns (e.g., "bug", "feature", "refactor")

**Token Savings:** ~70% vs manual file operations for todo discovery
</code_index_mcp>
