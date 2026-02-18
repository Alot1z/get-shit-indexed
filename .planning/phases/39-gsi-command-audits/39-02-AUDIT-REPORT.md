# Audit Report: /gsi:map-codebase Command

**Audit Date:** 2026-02-18
**Command File:** commands/gsi/map-codebase.md
**Workflow File:** workflows/map-codebase.md
**Agent File:** agents/gsi-codebase-mapper.md

---

## Executive Summary

The `/gsi:map-codebase` command is **partially complete** with several gaps requiring attention. The command has a solid foundation but is missing critical components for comprehensive codebase mapping.

**Overall Assessment:** 70% Complete

| Category | Status | Score |
|----------|--------|-------|
| Tool Coverage | Partial | 75% |
| Thinking Integration | Missing from Command | 0% |
| Workflow Steps | Good | 85% |
| Mapping Features | Good | 80% |
| Enhancement Opportunities | Not Implemented | 0% |

---

## 1. Tool Coverage Analysis

### Currently Allowed Tools (commands/gsi/map-codebase.md)

```yaml
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
  - mcp__desktop-commander__start_process
  - Task
```

### Missing Critical Tools

| Tool | Purpose | Priority |
|------|---------|----------|
| `mcp__desktop-commander__read_multiple_files` | Batch file reading (67-87% token savings) | HIGH |
| `mcp__desktop-commander__get_file_info` | Get file metadata (size, dates, permissions) | MEDIUM |
| `mcp__desktop-commander__start_search` | Content/file searching | MEDIUM |
| `mcp__CodeGraphContext__add_code_to_graph` | Index codebase for relationship analysis | HIGH |
| `mcp__CodeGraphContext__analyze_code_relationships` | Dependency/call graph analysis | HIGH |
| `mcp__CodeGraphContext__find_code` | Fuzzy code discovery | MEDIUM |
| `mcp__CodeGraphContext__calculate_cyclomatic_complexity` | Complexity metrics | MEDIUM |

### Recommended Tool Additions

```yaml
# ADD to allowed-tools:
  - mcp__desktop-commander__read_multiple_files
  - mcp__desktop-commander__get_file_info
  - mcp__desktop-commander__start_search
  - mcp__CodeGraphContext__add_code_to_graph
  - mcp__CodeGraphContext__analyze_code_relationships
  - mcp__CodeGraphContext__find_code
  - mcp__CodeGraphContext__calculate_cyclomatic_complexity
```

---

## 2. Thinking Integration Analysis

### Command File (commands/gsi/map-codebase.md)

**Status:** MISSING

The command file does NOT include a `thinking_phase` section. This is a **critical gap** for 7-BMAD compliance.

### Workflow File (workflows/map-codebase.md)

**Status:** COMPREHENSIVE

The workflow file includes extensive thinking integration:

| Phase | Server | Purpose | Timeout |
|-------|--------|---------|---------|
| Pre-Workflow | tractatus | Structure analysis | 5000ms |
| Pre-Step: Load State | sequential | State analysis | 3000ms |
| Post-Step: State Loaded | debug | Reflection | 2000ms |
| Pre-Step: Scan Directory | sequential | Scanning plan | 3000ms |
| Post-Step: Directory Scanned | debug | Structure reflection | 2000ms |
| Pre-Step: File Types | tractatus | Categorization | 3000ms |
| Post-Step: File Types | debug | Pattern storage | 2000ms |
| Pre-Step: Map Imports | sequential | Import strategy | 3000ms |
| Post-Step: Imports Mapped | debug | Import patterns | 2000ms |
| Pre-Step: Call Graph | tractatus | Call structure | 3000ms |
| Post-Step: Call Graph Mapped | debug | Call patterns | 2000ms |
| Pre-Step: Patterns | sequential | Pattern strategy | 3000ms |
| Post-Step: Patterns Identified | debug | Pattern storage | 2000ms |
| Pre-Step: Create Map | sequential | Map structure | 3000ms |
| Post-Step: Map Created | debug | Mapping reflection | 2000ms |
| Post-Workflow | tractatus | Comprehensive analysis | 5000ms |

### Agent File (agents/gsi-codebase-mapper.md)

**Status:** PARTIAL

Includes thinking_aware section but only mentions sequential thinking:
- Primary: Sequential (Method Circle)
- Missing: Tractatus for structure analysis
- Missing: Debug for reflection

### Recommended Thinking Phase for Command

```yaml
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
  integration: "Pre-workflow structure analysis, per-phase planning, post-phase reflection"
```

---

## 3. Workflow Steps Analysis

### Current Workflow Structure (workflows/map-codebase.md)

| Step | Purpose | Status |
|------|---------|--------|
| load_project_state | Read STATE.md context | Present |
| scan_directory_structure | Map physical structure | Present |
| analyze_file_types | Categorize files | Present |
| map_imports_and_dependencies | Import relationships | Present |
| map_function_call_graph | Function relationships | Present |
| identify_patterns_and_conventions | Pattern discovery | Present |
| create_codebase_map | Generate CODEBASE-MAP.md | Present |
| update_state | Update STATE.md | Present |

### Command Process Structure (commands/gsi/map-codebase.md)

| Step | Purpose | Status |
|------|---------|--------|
| Check existing | Offer refresh/skip | Present |
| Create directory | .planning/codebase/ | Present |
| Spawn agents | 4 parallel mappers | Present |
| Collect confirmations | Wait for completion | Present |
| Verify documents | Check line counts | Present |
| Commit | Git commit | Present |
| Next steps | Offer guidance | Present |

### Gap Analysis

| Missing Step | Purpose | Priority |
|--------------|---------|----------|
| Build code index | Pre-index codebase for fast search | HIGH |
| Analyze complexity | Cyclomatic complexity metrics | MEDIUM |
| Discover API endpoints | Find HTTP/RPC endpoints | MEDIUM |
| Test structure mapping | Map test organization | LOW |
| Generate diagram | Create visual architecture | LOW |

---

## 4. Mapping-Specific Features Analysis

### Currently Implemented

| Feature | Location | Status |
|---------|----------|--------|
| Architecture detection | ARCHITECTURE.md template | Present |
| Technology stack | STACK.md template | Present |
| Pattern recognition | CONVENTIONS.md template | Present |
| Dependency mapping | INTEGRATIONS.md template | Present |
| File structure | STRUCTURE.md template | Present |
| Testing patterns | TESTING.md template | Present |
| Concerns/tech debt | CONCERNS.md template | Present |

### Missing Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Code complexity metrics | Cyclomatic complexity per file/function | HIGH |
| API endpoint discovery | Auto-detect HTTP endpoints, routes | HIGH |
| Test coverage analysis | Identify untested areas | MEDIUM |
| Dead code detection | Find unused functions/exports | MEDIUM |
| Circular dependency detection | Identify import cycles | MEDIUM |
| Visual diagram generation | Create ASCII/mermaid architecture | LOW |
| Security vulnerability scan | Basic security pattern check | LOW |

---

## 5. Agent Consistency Analysis

### Agent vs Command Tool Mismatch

The agent file (agents/gsi-codebase-mapper.md) includes native tools:
```yaml
tools: Read, Bash, Grep, Glob, Write, mcp__desktop-commander__read_multiple_files, ...
```

**Issue:** Agent still uses native tools (Read, Bash, Grep, Glob, Write) which violates MCP tool priority rules.

**Recommendation:** Update agent to use only MCP tools:

```yaml
# CURRENT (violates tool priority):
tools: Read, Bash, Grep, Glob, Write, mcp__desktop-commander__read_multiple_files, ...

# RECOMMENDED:
tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__read_multiple_files
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__start_process
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
```

---

## 6. Enhancement Opportunities

### High Priority

1. **Add CodeGraphContext Tools**
   - `add_code_to_graph`: Index codebase for relationship analysis
   - `analyze_code_relationships`: Query call graphs, imports, class hierarchy
   - `find_code`: Fuzzy code discovery
   - `calculate_cyclomatic_complexity`: Complexity metrics

2. **Add thinking_phase to Command**
   - COMPREHENSIVE mode with tractatus, sequential, debug servers
   - Pre/post workflow analysis
   - Per-phase reflection

3. **Fix Agent Tool Compliance**
   - Remove native tools (Read, Bash, Grep, Glob, Write)
   - Use MCP alternatives exclusively

### Medium Priority

4. **Add Complexity Metrics**
   - Per-file complexity scoring
   - High-complexity function identification
   - Complexity trend in output

5. **Add API Endpoint Discovery**
   - Auto-detect Express/Fastify/Koa routes
   - Find HTTP handlers
   - Document REST endpoints

6. **Add Circular Dependency Detection**
   - Use CodeGraphContext for detection
   - Report in CONCERNS.md

### Low Priority

7. **Add Diagram Generation**
   - ASCII architecture diagram
   - Mermaid flowchart output
   - Optional visual export

8. **Add Security Pattern Check**
   - Basic vulnerability patterns
   - Missing auth checks
   - Sensitive data exposure risks

---

## 7. Recommended Changes

### 7.1 Update commands/gsi/map-codebase.md

Add to frontmatter:

```yaml
allowed-tools:
  # Existing tools...
  - mcp__desktop-commander__read_multiple_files
  - mcp__desktop-commander__get_file_info
  - mcp__desktop-commander__start_search
  - mcp__CodeGraphContext__add_code_to_graph
  - mcp__CodeGraphContext__analyze_code_relationships
  - mcp__CodeGraphContext__find_code
  - mcp__CodeGraphContext__calculate_cyclomatic_complexity

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
    Codebase mapping requires structural analysis (tractatus),
    methodical exploration planning (sequential), and
    pattern capture with reflection (debug).
  integration: "Pre-workflow structure analysis, per-phase planning, post-phase reflection"
```

### 7.2 Update agents/gsi-codebase-mapper.md

Replace tools line:

```yaml
# FROM:
tools: Read, Bash, Grep, Glob, Write, mcp__desktop-commander__read_multiple_files, ...

# TO:
tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__read_multiple_files
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__start_process
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
```

### 7.3 Update Workflow Step: Add Code Indexing

Add before `scan_directory_structure`:

```markdown
<step name="build_code_index">
Build code index for fast search and relationship analysis.

### Thinking Phase: Pre-Step - Build Index

<server>sequential</server>
<prompt>Plan code indexing:
1. What directories need indexing?
2. What tools provide fastest analysis?
3. What relationships to capture?</prompt>
<expected_output>Indexing strategy</expected_output>
<timeout>3000</timeout>

**Use CodeGraphContext:**
- `add_code_to_graph` to index the codebase
- `get_repository_stats` to verify index

**Or use code-index-mcp:**
- `set_project_path` to initialize
- `build_deep_index` for comprehensive symbol extraction

### Thinking Phase: Post-Step - Index Built

<server>debug</server>
<prompt>Reflect on index:
1. Was indexing successful?
2. What's the codebase scale?
3. What patterns emerged?</prompt>
<expected_output>Index patterns stored</expected_output>
<timeout>2000</timeout>
</step>
```

---

## 8. Verification Checklist

### Pre-Implementation

- [ ] Review all findings with team
- [ ] Prioritize changes
- [ ] Create implementation plan

### Post-Implementation

- [ ] Test command execution on sample codebase
- [ ] Verify thinking servers called correctly
- [ ] Verify all MCP tools accessible
- [ ] Check output document quality
- [ ] Verify agent tool compliance

---

## 9. Summary

### Critical Gaps (Must Fix)

1. **Missing thinking_phase in command file** - 7-BMAD compliance issue
2. **Agent uses native tools** - Violates tool priority rules
3. **Missing CodeGraphContext tools** - Limits relationship analysis

### Important Gaps (Should Fix)

4. **No code complexity metrics** - Valuable for codebase understanding
5. **No circular dependency detection** - Important quality metric
6. **Missing read_multiple_files** - Token optimization opportunity

### Enhancement Opportunities (Nice to Have)

7. API endpoint discovery
8. Diagram generation
9. Security pattern checking

---

**Audit Completed:** 2026-02-18
**Auditor:** Claude Code
**Status:** COMPLETE - Enhancements Implemented

---

## 10. Changes Implemented

### 10.1 commands/gsi/map-codebase.md Updates

**New Tools Added to allowed-tools:**
```yaml
# File Operations (new)
- mcp__desktop-commander__read_multiple_files  # Token savings: 67-87%
- mcp__desktop-commander__get_file_info        # File metadata
- mcp__desktop-commander__start_search         # Content/file search

# Code Graph Tools (new)
- mcp__CodeGraphContext__add_code_to_graph
- mcp__CodeGraphContext__analyze_code_relationships
- mcp__CodeGraphContext__find_code
- mcp__CodeGraphContext__calculate_cyclomatic_complexity
- mcp__CodeGraphContext__find_most_complex_functions
- mcp__CodeGraphContext__find_dead_code
```

**New thinking_phase Added:**
```yaml
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
  integration: "Pre-workflow structure analysis, per-phase planning, post-phase reflection"
```

**New Section Added:**
- `<advanced_features>` - Documents complexity analysis, relationship mapping, dead code detection, and batch file operations

### 10.2 agents/gsi-codebase-mapper.md Updates

**Tools Replaced (Native -> MCP):**
| Native Tool | MCP Replacement |
|-------------|-----------------|
| Read | mcp__desktop-commander__read_file |
| Bash | mcp__desktop-commander__start_process |
| Grep | mcp__code-index-mcp__search_code_advanced |
| Glob | mcp__code-index-mcp__find_files |
| Write | mcp__desktop-commander__write_file |

**New Tools Added:**
```yaml
- mcp__desktop-commander__read_multiple_files
- mcp__desktop-commander__get_file_info
- mcp__desktop-commander__start_search
- mcp__CodeGraphContext__add_code_to_graph
- mcp__CodeGraphContext__analyze_code_relationships
- mcp__CodeGraphContext__find_code
- mcp__CodeGraphContext__calculate_cyclomatic_complexity
- mcp__CodeGraphContext__find_most_complex_functions
- mcp__CodeGraphContext__find_dead_code
```

**New Process Step Added:**
- `analyze_complexity` - Uses CodeGraphContext tools for complexity analysis

**Template Enhancements:**
- ARCHITECTURE.md: Added "Complexity Metrics" section
- STRUCTURE.md: Added "Dependency Graph" section
- CONCERNS.md: Added "Code Complexity Hotspots" and "Dead Code Detected" sections

**Thinking Integration Enhanced:**
- Added tractatus server for structural analysis
- Added debug server for pattern capture

### 10.3 Summary of Improvements

| Category | Before | After |
|----------|--------|-------|
| Tool Count | 12 | 22 |
| Thinking Servers | 0 (command) / 1 (agent) | 3 (command) / 3 (agent) |
| CodeGraphContext Tools | 0 | 6 |
| Batch Reading | Not supported | Supported |
| Complexity Analysis | Manual | Automated |
| Dead Code Detection | Manual | Automated |
| MCP Compliance | Partial | Full |

---

## 11. Remaining Opportunities (Future Work)

### Low Priority Enhancements
1. **Diagram Generation** - ASCII/mermaid architecture diagrams
2. **API Endpoint Discovery** - Auto-detect HTTP routes
3. **Security Pattern Check** - Basic vulnerability patterns
4. **Test Coverage Integration** - Connect to coverage tools

### Documentation Updates
1. Update user guide with new capabilities
2. Add examples of complexity analysis output
3. Document relationship mapping features
