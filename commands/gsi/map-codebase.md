---
name: GSI:map-codebase
description: Analyze codebase with parallel mapper agents to produce .planning/codebase/ documents
argument-hint: "[optional: specific area to map, e.g., 'api' or 'auth']"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__set_project_path
  - mcp__code-index-mcp__build_deep_index
  - mcp__code-index-mcp__get_symbol_body
  - mcp__codegraphcontext__query
  - mcp__codegraphcontext__find_components
  - mcp__codegraphcontext__get_statistics
  - mcp__desktop-commander__start_process
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
- find_files: Discover relevant files
- get_file_summary: Understand file structure
- set_project_path: Initialize index for codebase
- build_deep_index: Create comprehensive symbol index
- get_symbol_body: Extract function/class implementations

CG Tools Usage:
- query: Extract relationship graphs
- find_components: Discover subsystems
- get_statistics: Codebase metrics
-->

<objective>
Analyze existing codebase using parallel GSI-codebase-mapper agents to produce structured codebase documents.

Each mapper agent explores a focus area and **writes documents directly** to `.planning/codebase/`. The orchestrator only receives confirmations, keeping context usage minimal.

Output: .planning/codebase/ folder with 7 structured documents about the codebase state.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/map-codebase.md
</execution_context>

<context>
Focus area: $ARGUMENTS (optional - if provided, tells agents to focus on specific subsystem)

**Load project state if exists:**
Check for .planning/STATE.md - loads context if project already initialized

**This command can run:**
- Before /GSI:new-project (brownfield codebases) - creates codebase map first
- After /GSI:new-project (greenfield codebases) - updates codebase map as code evolves
- Anytime to refresh codebase understanding
</context>

<when_to_use>
**Use map-codebase for:**
- Brownfield projects before initialization (understand existing code first)
- Refreshing codebase map after significant changes
- Onboarding to an unfamiliar codebase
- Before major refactoring (understand current state)
- When STATE.md references outdated codebase info

**Skip map-codebase for:**
- Greenfield projects with no code yet (nothing to map)
- Trivial codebases (<5 files)
</when_to_use>

<process>
1. Check if .planning/codebase/ already exists (offer to refresh or skip)
2. Create .planning/codebase/ directory structure
3. Spawn 4 parallel GSI-codebase-mapper agents:
   - Agent 1: tech focus → writes STACK.md, INTEGRATIONS.md
   - Agent 2: arch focus → writes ARCHITECTURE.md, STRUCTURE.md
   - Agent 3: quality focus → writes CONVENTIONS.md, TESTING.md
   - Agent 4: concerns focus → writes CONCERNS.md
4. Wait for agents to complete, collect confirmations (NOT document contents)
5. Verify all 7 documents exist with line counts
6. Commit codebase map
7. Offer next steps (typically: /GSI:new-project or /GSI:plan-phase)
</process>

<success_criteria>
- [ ] .planning/codebase/ directory created
- [ ] All 7 codebase documents written by mapper agents
- [ ] Documents follow template structure
- [ ] Parallel agents completed without errors
- [ ] User knows next steps
</success_criteria>
