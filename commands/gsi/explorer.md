---
name: gsi:explorer
description: Analyze integration gaps across the GSI codebase using parallel exploration agents. Identifies disconnected modules, sub-optimal tool usage, and broken knowledge flow.
argument-hint: "[optional: specific area to explore, e.g., 'lib/pattern-learning' or 'hooks']"
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
  - mcp__CodeGraphContext__find_dead_code
  # Thinking Servers (Cognitive Flow)
  - mcp__sequential-thinking__sequentialthinking
  - mcp__tractatusthinking__tractatus_thinking
  - mcp__debug-thinking__debug_thinking
  # External Knowledge
  - mcp__deepwiki__ask_question
  - mcp__context7__get-library-docs
  # Orchestration
  - Task
thinking_phase:
  mode: COMPREHENSIVE
  servers:
    - name: tractatus
      purpose: "Analyze integration structure and gap patterns"
      timeout: 10000
    - name: sequential
      purpose: "Plan systematic exploration steps"
      timeout: 8000
    - name: debug
      purpose: "Capture gap patterns and store findings in knowledge graph"
      timeout: 5000
  rationale: |
    Gap analysis requires:
    1. Tractatus for structural analysis (integration patterns, dependencies)
    2. Sequential for methodical gap exploration planning
    3. Debug for pattern capture and storing findings in knowledge graph
    
    This comprehensive approach ensures thorough understanding of:
    - Integration patterns and broken connections
    - Knowledge flow between modules
    - Sub-optimal tool usage patterns
    - Disconnected features and orphaned modules
  integration: "Pre-workflow structure analysis, per-phase planning, post-phase reflection with knowledge storage"
output_formats:
  - markdown
  - cxml
---

<!--
Golden Pattern Tool Usage:
- CI understand: Code-Index for code search and symbol extraction
- DC act: Desktop Commander for file operations
- CGC analyze: CodeGraphContext for relationship and dead code analysis

Cognitive Flow:
- Tractatus: Structural analysis of integration patterns
- Sequential: Step-by-step exploration planning
- Debug: Pattern capture and knowledge graph storage

CXML Output:
- Use files-to-prompt --cxml for Claude Code XML format
- Generate combined context files for workflow consumption
-->

<objective>
Analyze integration gaps across the GSI codebase using ONLY GSI internal tools (MCP-based). Identifies disconnected modules, sub-optimal native tool usage, and broken knowledge flow patterns.

Each explorer agent explores a focus area and writes gap analysis findings directly to `.planning/gap-analysis/`. The orchestrator receives confirmations only, keeping context usage minimal.

Output: Comprehensive Gap Analysis Report with prioritized fixes and CXML context files.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/explorer.md
</execution_context>

<context>
Focus area: $ARGUMENTS (optional - if provided, tells agents to focus on specific subsystem)

**Load project state if exists:**
Check for .planning/STATE.md - loads context if project already initialized

**This command runs:**
- As part of Phase 49 GSI Architecture Overhaul
- After codebase mapping is complete
- When integration issues are suspected
- Before major refactoring to understand impact
</context>

<when_to_use>
**Use gsi:explorer for:**
- Identifying disconnected modules in lib/
- Finding native tool usage violations in GSI context
- Mapping knowledge flow gaps (pattern-learning, complexity, prompt-enhancer)
- Analyzing hook enforcement completeness
- Before architecture cleanup phases

**Skip gsi:explorer for:**
- Fresh installations (nothing to analyze)
- Trivial codebases (<5 files)
- Projects not using GSI internal tools
</when_to_use>

<gap_detection_patterns>

## Pattern 1: Disconnected Features/Modules

Detect modules that:
- Exist but are never invoked (`mcp__CodeGraphContext__find_dead_code`)
- Have no hook connections (search for hook references)
- Lack command entry points (search commands/ for references)
- Are documented but not implemented (check docs vs code)

**Detection Method:**
```
1. List all modules in lib/
2. For each module, search for imports/requires across codebase
3. Check for hook references in hooks/
4. Check for command references in commands/gsi/
5. Flag modules with <2 incoming connections
```

## Pattern 2: Sub-optimal Tool Usage

Identify patterns where:
- Native Read/Write used instead of DesktopCommander
- Native Grep used instead of code-index-mcp
- Manual file operations instead of gsi-tools wrapper
- Bash commands for file operations

**Detection Method:**
```
1. Search for "Read|Write|Edit|Grep|Glob|Bash" in commands/gsi/*.md
2. Search for "allowed-tools:" sections missing DC/CI tools
3. Search for native tool usage in agent files
4. Flag files with native tools in allowed-tools
```

## Pattern 3: Broken Knowledge Flow

Map the knowledge flow:
```
Pattern Learning <-> Complexity <-> Prompt Enhancer
```

Check:
- Does pattern-learning output feed into complexity?
- Does complexity analysis inform prompt-enhancer?
- Does prompt-enhancer use pattern-learning insights?
- Is reflection capturing patterns properly?

**Detection Method:**
```
1. Search for imports FROM pattern-learning
2. Search for imports TO complexity
3. Search for complexity threshold references in prompt-enhancer
4. Check reflection-capture for pattern storage calls
5. Flag broken reference chains
```

## Pattern 4: Missing Hook Connections

Identify missing connections:
- pre-tool-use -> gsi-integration
- post-tool-use -> pattern-learning
- Hooks not registered in hooks.json

**Detection Method:**
```
1. Read hooks/hooks.json for registered hooks
2. Compare against files in hooks/pre-tool-use/
3. Compare against files in hooks/post-tool-use/
4. Check each hook for proper module connections
5. Flag unregistered or disconnected hooks
```

</gap_detection_patterns>

<process>
1. Create .planning/gap-analysis/ directory structure
2. Spawn 4 parallel GSI-gap-explorer agents:
   - Agent 1: lib/ modules - integration gaps between features
   - Agent 2: tool usage - native vs MCP patterns
   - Agent 3: knowledge flow - broken reference chains
   - Agent 4: hooks - enforcement completeness
3. Wait for agents to complete, collect confirmations
4. Aggregate findings into GAP-ANALYSIS-REPORT.md
5. Generate CXML context file with --cxml flag support
6. Prioritize gaps by impact (Critical/High/Medium/Low)
7. Create remediation roadmap
8. Commit gap analysis artifacts
</process>

<advanced_features>

**CXML Output Format:**
When `--cxml` flag is provided:
```bash
files-to-prompt --cxml .planning/gap-analysis/ > .planning/gap-analysis/gap-analysis-context.cxml
```

This generates Claude Code XML format for efficient context loading in workflows.

**Relationship Analysis:**
- Use `mcp__CodeGraphContext__analyze_code_relationships` with query types:
  - `find_importers`: What files import this module?
  - `find_callers`: Who calls these functions?
  - `dead_code`: Unused exports detection

**Dead Code Detection:**
- Use `mcp__CodeGraphContext__find_dead_code` to identify:
  - Unused functions in lib/
  - Unreferenced modules
  - Orphaned utilities

**Batch File Operations:**
- Use `mcp__desktop-commander__read_multiple_files` for reading 2+ files
- Token savings: 67-87% compared to sequential reads

**Knowledge Graph Storage:**
- Use `mcp__debug-thinking__debug_thinking` to store:
  - Gap patterns discovered
  - Remediation approaches that work
  - Anti-patterns to avoid

</advanced_features>

<success_criteria>
- [ ] .planning/gap-analysis/ directory created
- [ ] All 4 focus areas scanned by explorer agents
- [ ] GAP-ANALYSIS-REPORT.md generated with prioritized gaps
- [ ] CXML context file generated (if --cxml flag provided)
- [ ] Thinking phase executed (COMPREHENSIVE mode)
- [ ] Knowledge graph updated with gap patterns
- [ ] Remediation roadmap created
- [ ] User knows next steps
</success_criteria>

<output_artifacts>
After execution, the following artifacts are created:

1. `.planning/gap-analysis/GAP-ANALYSIS-REPORT.md` - Main findings document
2. `.planning/gap-analysis/lib-gaps.md` - Module integration gaps
3. `.planning/gap-analysis/tool-usage-gaps.md` - Native vs MCP usage patterns
4. `.planning/gap-analysis/knowledge-flow-gaps.md` - Broken reference chains
5. `.planning/gap-analysis/hook-gaps.md` - Enforcement completeness
6. `.planning/gap-analysis/gap-analysis-context.cxml` - CXML format (optional)
7. `.planning/gap-analysis/REMEDIATION-ROADMAP.md` - Prioritized fix plan
</output_artifacts>

<forbidden_tools>
**CRITICAL: These native tools are BLOCKED in GSI context:**

```
Read      # Use mcp__desktop-commander__read_file
Write     # Use mcp__desktop-commander__write_file
Edit      # Use mcp__desktop-commander__edit_block
Grep      # Use mcp__code-index-mcp__search_code_advanced
Glob      # Use mcp__code-index-mcp__find_files
Bash      # Use mcp__desktop-commander__start_process
```

**Detection of these tools in codebase is a gap to flag.**
</forbidden_tools>

<cognitive_flow>

## Planning Phase:
```
Tractatus -> Analyze structure of gap detection
Sequential -> Plan scanning steps
```

## Execution Phase:
```
CI search -> Find patterns
DC read -> Load files
Sequential -> Process findings
```

## Reflection Phase:
```
Debug -> Store patterns in knowledge graph
Tractatus -> Synthesize insights
```

</cognitive_flow>

---

**Version:** 1.0  
**Created:** 2026-02-19  
**Phase:** 49-01  
**Status:** Active
