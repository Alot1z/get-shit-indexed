---
name: GSI:new-milestone
description: Start a new milestone cycle — update PROJECT.md and route to requirements
argument-hint: "[milestone name, e.g., 'v1.1 Notifications']"
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
<objective>
Start a new milestone: questioning → research (optional) → requirements → roadmap.

Brownfield equivalent of new-project. Project exists, PROJECT.md has history. Gathers "what's next", updates PROJECT.md, then runs requirements → roadmap cycle.

**Creates/Updates:**
- `.planning/PROJECT.md` — updated with new milestone goals
- `.planning/research/` — domain research (optional, NEW features only)
- `.planning/REQUIREMENTS.md` — scoped requirements for this milestone
- `.planning/ROADMAP.md` — phase structure (continues numbering)
- `.planning/STATE.md` — reset for new milestone

**After:** `/GSI:plan-phase [N]` to start execution.

<code_index_mcp>
**Priority: HIGH** - Critical for milestone research and analysis

**CI Tools Integration:**
- `find_files`: Discover existing project documents and research
- `search_code_advanced`: Analyze previous milestones for patterns
- `get_file_summary`: Understand existing project structure quickly
- `get_symbol_body`: Extract key patterns from previous work

**Usage Context:**
During new milestone creation:
- Analyze previous milestones for continuity
- Research domain patterns across codebase
- Understand existing architecture and conventions
- Identify areas that need research vs reuse

**Token Savings:** ~80% vs manual document analysis for understanding existing work
</code_index_mcp>
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/new-milestone.md
@~/.claude/get-shit-indexed/references/questioning.md
@~/.claude/get-shit-indexed/references/ui-brand.md
@~/.claude/get-shit-indexed/templates/project.md
@~/.claude/get-shit-indexed/templates/requirements.md
</execution_context>

<context>
Milestone name: $ARGUMENTS (optional - will prompt if not provided)

**Load project context:**
@.planning/PROJECT.md
@.planning/STATE.md
@.planning/MILESTONES.md
@.planning/config.json

**Load milestone context (if exists, from /GSI:discuss-milestone):**
@.planning/MILESTONE-CONTEXT.md
</context>

<process>
Execute the new-milestone workflow from @~/.claude/get-shit-indexed/workflows/new-milestone.md end-to-end.
Preserve all workflow gates (validation, questioning, research, requirements, roadmap approval, commits).
</process>
