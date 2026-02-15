---
name: GSI:execute-phase
description: Execute all plans in a phase with wave-based parallelization
argument-hint: "<phase-number> [--gaps-only]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__start_process
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__build_deep_index
  - mcp__code-index-mcp__refresh_index
  - mcp__codegraphcontext__query
  - mcp__codegraphcontext__find_path
  - mcp__codegraphcontext__analyze_impact
  - ListMcpResourcesTool
  - Task
---

<!--
Golden Pattern Tool Usage:
- CG discover: CodeGraphContext for relationship analysis
- CI understand: Code-Index for code search and symbol extraction
- DC act: Desktop Commander for file operations
- DC verify: Desktop Commander for verification
- CI verify: Code-Index for code verification

CG Server: neo4j://localhost:7687

CI Tools Usage:
- search_code_advanced: Find code patterns across project
- find_files: Discover plan/summary/verification files
- get_file_summary: Understand file structure before editing
- build_deep_index: Create comprehensive symbol index
- refresh_index: Update index after git operations

CG Tools Usage:
- query: Relationship queries during verification
- find_path: Dependency analysis during verification
- analyze_impact: Impact analysis during verification
-->
<objective>
Execute all plans in a phase using wave-based parallel execution.

Orchestrator stays lean: discover plans, analyze dependencies, group into waves, spawn subagents, collect results. Each subagent loads the full execute-plan context and handles its own plan.

Context budget: ~15% orchestrator, 100% fresh per subagent.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/execute-phase.md
@~/.claude/get-shit-indexed/references/ui-brand.md
</execution_context>

<context>
Phase: $ARGUMENTS

**Flags:**
- `--gaps-only` — Execute only gap closure plans (plans with `gap_closure: true` in frontmatter). Use after verify-work creates fix plans.

@.planning/ROADMAP.md
@.planning/STATE.md
</context>

<process>
Execute the execute-phase workflow from @~/.claude/get-shit-indexed/workflows/execute-phase.md end-to-end.
Preserve all workflow gates (wave execution, checkpoint handling, verification, state updates, routing).
</process>
