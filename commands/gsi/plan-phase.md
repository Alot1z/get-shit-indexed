---
name: GSI:plan-phase
description: Create detailed execution plan for a phase (PLAN.md) with verification loop
argument-hint: "[phase] [--research] [--skip-research] [--gaps] [--skip-verify]"
agent: GSI-planner
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__rag-web-browser__search
  - mcp__codegraphcontext__query
  - mcp__codegraphcontext__find_path
  - mcp__codegraphcontext__suggest_refactor
  - Task
---

<!--
Golden Pattern Tool Usage:
- CG discover: CodeGraphContext for relationship analysis
- CI understand: Code-Index for code search and symbol extraction
- DC act: Desktop Commander for file operations

CG Server: neo4j://localhost:7687

CI Tools Usage:
- search_code_advanced: Find code patterns across project
- find_files: Discover plan/summary/verification files
- get_file_summary: Understand file structure before editing

CG Tools Usage:
- query: Understanding existing dependencies
- find_path: Analyzing implementation impact
- suggest_refactor: Planning changes with relationship awareness
-->
<objective>
Create executable phase prompts (PLAN.md files) for a roadmap phase with integrated research and verification.

**Default flow:** Research (if needed) → Plan → Verify → Done

**Orchestrator role:** Parse arguments, validate phase, research domain (unless skipped), spawn GSI-planner, verify with GSI-plan-checker, iterate until pass or max iterations, present results.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/plan-phase.md
@~/.claude/get-shit-indexed/references/ui-brand.md
</execution_context>

<context>
Phase number: $ARGUMENTS (optional — auto-detects next unplanned phase if omitted)

**Flags:**
- `--research` — Force re-research even if RESEARCH.md exists
- `--skip-research` — Skip research, go straight to planning
- `--gaps` — Gap closure mode (reads VERIFICATION.md, skips research)
- `--skip-verify` — Skip verification loop

Normalize phase input in step 2 before any directory lookups.
</context>

<process>
Execute the plan-phase workflow from @~/.claude/get-shit-indexed/workflows/plan-phase.md end-to-end.
Preserve all workflow gates (validation, research, planning, verification loop, routing).
</process>
