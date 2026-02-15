---
name: gsi:new-project
description: Initialize a new project with deep context gathering and PROJECT.md
argument-hint: "[--auto]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
---
<context>
**Flags:**
- `--auto` — Automatic mode. After config questions, runs research → requirements → roadmap without further interaction. Expects idea document via @ reference.
</context>

<objective>
Initialize a new project through unified flow: questioning → research (optional) → requirements → roadmap.

**Creates:**
- `.planning/PROJECT.md` — project context
- `.planning/config.json` — workflow preferences
- `.planning/research/` — domain research (optional)
- `.planning/REQUIREMENTS.md` — scoped requirements
- `.planning/ROADMAP.md` — phase structure
- `.planning/STATE.md` — project memory

**After this command:** Run `/gsi:plan-phase 1` to start execution.

<code_index_mcp>
**Priority: MEDIUM** - Support for brownfield project analysis

**CI Tools Integration:**
- `find_files`: Scan existing codebase structure
- `search_code_advanced`: Identify patterns and technologies in use
- `get_file_summary`: Understand codebase organization quickly
- `get_symbol_body`: Extract key architectural patterns

**Usage Context:**
For new projects (especially brownfield):
- Analyze existing code structure and patterns
- Identify technology stack and conventions
- Understand architecture decisions to follow
- Map existing code to new planning requirements

**Token Savings:** ~75% vs manual codebase exploration for project understanding
</code_index_mcp>
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/new-project.md
@~/.claude/get-shit-indexed/references/questioning.md
@~/.claude/get-shit-indexed/references/ui-brand.md
@~/.claude/get-shit-indexed/templates/project.md
@~/.claude/get-shit-indexed/templates/requirements.md
</execution_context>

<process>
Execute the new-project workflow from @~/.claude/get-shit-indexed/workflows/new-project.md end-to-end.
Preserve all workflow gates (validation, approvals, commits, routing).
</process>
