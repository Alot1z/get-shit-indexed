---
name: gsi:list-phase-assumptions
description: Surface Claude's assumptions about a phase approach before planning
argument-hint: "[phase]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
---

<objective>
Analyze a phase and present Claude's assumptions about technical approach, implementation order, scope boundaries, risk areas, and dependencies.

Purpose: Help users see what Claude thinks BEFORE planning begins - enabling course correction early when assumptions are wrong.
Output: Conversational output only (no file creation) - ends with "What do you think?" prompt
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/list-phase-assumptions.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

**Load project state first:**
@.planning/STATE.md

**Load roadmap:**
@.planning/ROADMAP.md
</context>

<process>
1. Validate phase number argument (error if missing or invalid)
2. Check if phase exists in roadmap
3. Follow list-phase-assumptions.md workflow:
   - Analyze roadmap description
   - Surface assumptions about: technical approach, implementation order, scope, risks, dependencies
   - Present assumptions clearly
   - Prompt "What do you think?"
4. Gather feedback and offer next steps
</process>

<code_index_mcp>
**Priority: HIGH** - Core to phase understanding before planning

**CI Tools Integration:**
- `search_code_advanced`: Analyze existing patterns and approaches
- `find_files`: Discover related phase work and examples
- `get_file_summary`: Understand similar phase implementations
- `get_symbol_body`: Extract key architectural patterns from related work

**Usage Context:**
When surfacing phase assumptions:
- Analyze previous phases for technical patterns
- Understand established approaches for similar work
- Identify dependencies and integration points
- Surface risks based on existing codebase complexity

**Token Savings:** ~75% vs manual pattern analysis for assumption surfacing
</code_index_mcp>

<success_criteria>

- Phase validated against roadmap
- Assumptions surfaced across five areas
- User prompted for feedback
- User knows next steps (discuss context, plan phase, or correct assumptions)
  </success_criteria>
