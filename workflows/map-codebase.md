# Map Codebase Workflow

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- Use `mcp__desktop-commander__read_file` instead of Read
- Use `mcp__desktop-commander__write_file` instead of Write
- Use `mcp__desktop-commander__list_directory` instead of Bash ls

**Code Search:**
- Use `mcp__code-index-mcp__search_code_advanced` instead of Grep
- Use `mcp__code-index-mcp__find_files` instead of Glob
- Use `mcp__code-index-mcp__get_file_summary` for file analysis
- Use `mcp__code-index-mcp__get_symbol_body` for symbol extraction

**Code Graph:**
- Use `mcp__CodeGraphContext__add_code_to_graph` for code indexing
- Use `mcp__CodeGraphContext__analyze_code_relationships` for relationship analysis
- Use `mcp__CodeGraphContext__find_code` for code discovery
</tool_requirements>

<purpose>
Generate comprehensive codebase maps showing structure, dependencies, relationships, and patterns for navigation and planning purposes.
</purpose>

<required_reading>
# Project Structure
@references/validation-gates.md

# Agent Reference
@agents/GSI-planner.md
</required_reading>

<process>

## Thinking Phase: Pre-Workflow

<server>tractatus</server>
<prompt>Analyze the map-codebase workflow structure:
1. What are the key components of a codebase map?
2. What relationships need to be captured?
3. What level of detail is appropriate?
4. How do maps support planning and navigation?</prompt>
<expected_output>Structured breakdown of mapping components and purposes</expected_output>
<timeout>5000</timeout>
<integration>Use structure analysis to prioritize mapping areas and output formats</integration>

<step name="load_project_state">
Read `.planning/STATE.md` to understand current position and mapping needs.

### Thinking Phase: Pre-Step - Load Project State

<server>sequential</server>
<prompt>Analyze state loading for mapping:
1. What areas of codebase need mapping?
2. What mapping depth is required?
3. What context is essential?</prompt>
<expected_output>Understanding of mapping scope and requirements</expected_output>
<timeout>3000</timeout>

### Thinking Phase: Post-Step - State Loaded

<server>debug</server>
<prompt>Reflect on state for mapping:
1. What mapping context was identified?
2. What areas need priority attention?
3. What should be remembered during mapping?</prompt>
<expected_output>Mapping context patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="scan_directory_structure">
Map the physical directory structure.

### Thinking Phase: Pre-Step - Scan Directory Structure

<server>sequential</server>
<prompt>Plan directory scanning:
1. What directories are relevant?
2. What depth is needed?
3. What should be excluded?</prompt>
<expected_output>Directory scanning plan with scope</expected_output>
<timeout>3000</timeout>

**Use DesktopCommander:**
- `list_directory` with appropriate depth
- Exclude: node_modules, .git, dist, build, coverage

**Output structure:**
```
project-root/
  src/
    components/
    utils/
    services/
  tests/
  docs/
  config/
```

### Thinking Phase: Post-Step - Directory Scanned

<server>debug</server>
<prompt>Reflect on directory structure:
1. Was the structure clear?
2. What organizational patterns emerged?
3. What should be remembered about structure?</prompt>
<expected_output>Structure patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="analyze_file_types">
Categorize files by type and purpose.

### Thinking Phase: Pre-Step - Analyze File Types

<server>tractatus</server>
<prompt>Analyze file categorization:
1. What file types exist?
2. How do types relate to purpose?
3. What patterns indicate file roles?</prompt>
<expected_output>File type categorization structure</expected_output>
<timeout>3000</timeout>

**Categories:**
- Source files (.ts, .js, .py, etc.)
- Configuration files (.json, .yaml, .toml)
- Documentation files (.md, .txt)
- Test files (.test., .spec.)
- Build files (Makefile, Dockerfile)

### Thinking Phase: Post-Step - File Types Analyzed

<server>debug</server>
<prompt>Reflect on file categorization:
1. Were categories comprehensive?
2. What patterns in file naming emerged?
3. What should be remembered about file organization?</prompt>
<expected_output>File type patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="map_imports_and_dependencies">
Map import relationships between files.

### Thinking Phase: Pre-Step - Map Imports

<server>sequential</server>
<prompt>Plan import mapping:
1. What import patterns exist?
2. How do we trace dependencies?
3. What tools are most efficient?</prompt>
<expected_output>Import mapping strategy</expected_output>
<timeout>3000</timeout>

**Use CodeGraphContext:**
- `add_code_to_graph` to index codebase
- `analyze_code_relationships` with query_type="find_importers"
- `find_code` for import statement discovery

**Or use code-index-mcp:**
- `search_code_advanced` for import patterns
- `get_file_summary` for import extraction

**Document:**
- Import graph (file -> imported files)
- External dependencies
- Circular dependencies (if any)

### Thinking Phase: Post-Step - Imports Mapped

<server>debug</server>
<prompt>Reflect on import mapping:
1. Were all imports captured?
2. What dependency patterns emerged?
3. What circular dependencies exist?</prompt>
<expected_output>Import patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="map_function_call_graph">
Map function call relationships.

### Thinking Phase: Pre-Step - Map Call Graph

<server>tractatus</server>
<prompt>Analyze call graph structure:
1. What call patterns exist?
2. How do functions relate?
3. What are the critical call chains?</prompt>
<expected_output>Call graph structure understanding</expected_output>
<timeout>3000</timeout>

**Use CodeGraphContext:**
- `analyze_code_relationships` with query_type="find_callers"
- `analyze_code_relationships` with query_type="find_callees"
- `analyze_code_relationships` with query_type="call_chain"

**Document:**
- Key function hubs (high in/out degree)
- Critical call chains
- Entry points

### Thinking Phase: Post-Step - Call Graph Mapped

<server>debug</server>
<prompt>Reflect on call graph mapping:
1. What function hubs were identified?
2. What call patterns emerged?
3. What should be remembered about code flow?</prompt>
<expected_output>Call graph patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="identify_patterns_and_conventions">
Identify coding patterns and conventions.

### Thinking Phase: Pre-Step - Identify Patterns

<server>sequential</server>
<prompt>Plan pattern identification:
1. What patterns should be searched?
2. How do we identify conventions?
3. What anti-patterns exist?</prompt>
<expected_output>Pattern identification strategy</expected_output>
<timeout>3000</timeout>

**Search for patterns:**
- Naming conventions
- File organization patterns
- Error handling patterns
- State management patterns
- Testing patterns

**Use:**
- `search_code_advanced` with regex patterns
- `get_file_summary` for structure analysis

### Thinking Phase: Post-Step - Patterns Identified

<server>debug</server>
<prompt>Reflect on pattern identification:
1. What patterns were discovered?
2. What conventions are consistent?
3. What anti-patterns exist?</prompt>
<expected_output>Pattern knowledge stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="create_codebase_map">
Generate comprehensive codebase map document.

### Thinking Phase: Pre-Step - Create Map

<server>sequential</server>
<prompt>Plan map creation:
1. What information is most useful?
2. How do we structure for navigation?
3. What formats are needed?</prompt>
<expected_output>Map creation plan with structure</expected_output>
<timeout>3000</timeout>

Create `.planning/CODEBASE-MAP.md`:

```markdown
# Codebase Map

## Directory Structure
```
[Visual tree structure]
```

## File Categories
| Category | Count | Examples |
|----------|-------|----------|
| Source | X | file1.ts, file2.ts |
| Config | X | config.json |
| Test | X | file1.test.ts |
| Docs | X | README.md |

## Import Graph
### Internal Dependencies
- fileA.ts -> fileB.ts, fileC.ts
- fileB.ts -> fileD.ts

### External Dependencies
- package: ^version

## Function Call Graph
### Key Functions
- functionName (called by X files)

### Entry Points
- index.ts: main()
- server.ts: startServer()

## Patterns and Conventions
### Naming
- Components: PascalCase
- Functions: camelCase
- Files: kebab-case

### Structure
- Feature-based directories
- Shared utilities in /utils

### Error Handling
- Try-catch with custom errors
- Result pattern for async

## Complexity Metrics
- Total files: X
- Total functions: X
- Average file size: X lines
- Circular dependencies: X

## Navigation Guide
- Start here: src/index.ts
- Core logic: src/core/
- Utilities: src/utils/
- Tests: tests/
```

### Thinking Phase: Post-Step - Map Created

<server>debug</server>
<prompt>Reflect on map creation:
1. Was the map comprehensive?
2. What information is most useful?
3. What should be remembered for future mapping?</prompt>
<expected_output>Mapping patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="update_state">
Update STATE.md with:
- Codebase map completion
- Key structural insights
- Complexity notes
</step>

## Thinking Phase: Post-Workflow - Mapping Complete

<server>tractatus</server>
<prompt>Comprehensive mapping analysis:
1. What is the overall codebase structure?
2. What are the key relationships?
3. What complexity concerns exist?
4. How can this map support planning?</prompt>
<expected_output>Structural insights and planning recommendations</expected_output>
<timeout>5000</timeout>
<integration>Update map with insights, prepare for planning workflow</integration>

</process>

<completion_format>
When mapping completes successfully, return:

```markdown
## CODEBASE MAP COMPLETE

**Map File:** .planning/CODEBASE-MAP.md

## Summary
- **Total Files:** X
- **Source Files:** X
- **External Dependencies:** X
- **Key Patterns:** [Pattern 1], [Pattern 2]

## Structure
- Entry Points: X
- Core Modules: X
- Utility Modules: X

## Complexity
- Circular Dependencies: X
- High-Degree Functions: X

**Next Steps:**
- Use map for planning: @workflows/plan-phase.md
- Research specific areas: @workflows/research-phase.md
```

</completion_format>

<validation_considerations>

## Integration with Other Workflows

Codebase maps support multiple workflows:

1. **Planning** - Identify files_modified, understand scope
2. **Research** - Understand existing patterns before changes
3. **Execution** - Navigate codebase efficiently
4. **Verification** - Confirm changes are complete

Keep maps updated as codebase evolves.

</validation_considerations>

---

**Version:** 1.0  
**Last Updated:** 2026-02-17  
**Status:** Active
