---
name: gsi:map-codebase
description: Analyze codebase with parallel mapper agents to produce .planning/codebase/ documents
argument-hint: "[optional: specific area to map, e.g., 'api' or 'auth']"
allowed-tools:
  # File Operations (Desktop Commander)
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__read_multiple_files
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__desktop-commander__get_file_info
  - mcp__desktop-commander__start_search
  - mcp__desktop-commander__start_process
  # Code Index Tools (Fast Search)
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__set_project_path
  - mcp__code-index-mcp__build_deep_index
  - mcp__code-index-mcp__get_symbol_body
  # Code Graph Tools (Relationship Analysis)
  - mcp__CodeGraphContext__add_code_to_graph
  - mcp__CodeGraphContext__analyze_code_relationships
  - mcp__CodeGraphContext__find_code
  - mcp__CodeGraphContext__calculate_cyclomatic_complexity
  - mcp__CodeGraphContext__find_most_complex_functions
  - mcp__CodeGraphContext__find_dead_code
  # Orchestration
  - Task
thinking_phase:
  mode: COMPREHENSIVE
  servers:
    - name: tractatus
      purpose: "Analyze codebase structure and architecture patterns"
      timeout: 10000
    - name: sequential
      purpose: "Plan systematic codebase exploration steps"
      timeout: 8000
    - name: debug
      purpose: "Capture patterns and anti-patterns during mapping"
      timeout: 5000
  rationale: |
    Codebase mapping requires:
    1. Tractatus for structural analysis (architecture, layers, patterns)
    2. Sequential for methodical exploration planning
    3. Debug for pattern capture and reflection
    
    This comprehensive approach ensures thorough understanding of:
    - Architectural patterns and layer relationships
    - Code organization and naming conventions
    - Dependency graphs and call relationships
    - Technical debt and areas of concern
  integration: "Pre-workflow structure analysis, per-phase planning, post-phase reflection"
---

<!--
Golden Pattern Tool Usage:
- CI understand: Code-Index for code search and symbol extraction
- DC act: Desktop Commander for file operations
- CGC analyze: CodeGraphContext for relationship and complexity analysis

CI Tools Usage:
- search_code_advanced: Find code patterns across project
- find_files: Discover relevant files
- get_file_summary: Understand file structure
- set_project_path: Initialize index for codebase
- build_deep_index: Create comprehensive symbol index
- get_symbol_body: Extract function/class implementations and relationships

CGC Tools Usage:
- add_code_to_graph: Index codebase for graph analysis
- analyze_code_relationships: Query call graphs, imports, class hierarchy
- find_code: Fuzzy code discovery
- calculate_cyclomatic_complexity: Measure function complexity
- find_most_complex_functions: Identify complexity hotspots
- find_dead_code: Detect unused functions/exports
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
- Before /gsi:new-project (brownfield codebases) - creates codebase map first
- After /gsi:new-project (greenfield codebases) - updates codebase map as code evolves
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
7. Offer next steps (typically: /gsi:new-project or /gsi:plan-phase)
</process>

<advanced_features>
**Complexity Analysis:**
- Use `mcp__CodeGraphContext__find_most_complex_functions` to identify complexity hotspots
- Use `mcp__CodeGraphContext__calculate_cyclomatic_complexity` for specific functions
- Report high-complexity areas in CONCERNS.md

**Relationship Mapping:**
- Use `mcp__CodeGraphContext__analyze_code_relationships` with query types:
  - `find_callers`: Who calls this function?
  - `find_callees`: What does this function call?
  - `find_importers`: What files import this module?
  - `class_hierarchy`: Inheritance relationships
  - `call_chain`: Full call chain analysis

**Dead Code Detection:**
- Use `mcp__CodeGraphContext__find_dead_code` to identify unused functions
- Report potential dead code in CONCERNS.md

**Batch File Operations:**
- Use `mcp__desktop-commander__read_multiple_files` for reading 2+ files
- Token savings: 67-87% compared to sequential reads
</advanced_features>

<success_criteria>
- [ ] .planning/codebase/ directory created
- [ ] All 7 codebase documents written by mapper agents
- [ ] Documents follow template structure
- [ ] Parallel agents completed without errors
- [ ] Thinking phase executed (COMPREHENSIVE mode)
- [ ] User knows next steps
</success_criteria>
