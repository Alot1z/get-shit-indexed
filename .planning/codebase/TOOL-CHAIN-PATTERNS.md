# Tool Chain Pattern Catalog

**Created:** 2026-02-11
**Updated:** 2026-02-12
**Purpose:** Catalog of proven tool chain patterns for GSI workflow selection

**CG Server Status:** ✅ CodeGraphContext operational at neo4j://localhost:7687

---

## Overview

This document catalogs 24 proven tool chain patterns for different workflow scenarios:

- **15 Linear Patterns:** Sequential one-way flows
- **4 Circular Patterns:** Loops for iterative refinement
- **5 Hybrid Patterns:** Complex multi-path workflows

Each pattern includes:
- Visual flow diagram
- When to use (decision criteria)
- MCP tools at each step
- Token efficiency notes
- Example use case

---

## Quick Decision Tree

```
What type of operation?
│
├─ File operation only?
│  └─→ DC-only patterns (1-3)
│
├─ Code analysis/search only?
│  └─→ CI-only patterns (4-6)
│
├─ Relationship discovery needed?
│  └─→ CG → CI patterns (7-8)
│
├─ Edit then analyze impact?
│  └─→ DC → CI patterns (9-10)
│
├─ Understand then edit?
│  └─→ CI → DC patterns (11-12)
│
└─ Complex multi-file change?
   └─→ Golden pattern (13-14) or Hybrid patterns (15-19)
```

---

## Linear Patterns (1-15)

Linear patterns flow in one direction with no loops. Simple and predictable.

### Pattern 1: DC-only Read

```
┌────────┐
│ DC act │ → read_file
└────────┘
```

**When to use:**
- Simple file reading
- Quick content inspection
- Configuration verification

**MCP Tools:** `mcp__desktop-commander__read_file`

**Example:** Read package.json to check version

---

### Pattern 2: DC-only Write

```
┌────────┐
│ DC act │ → write_file
└────────┘
```

**When to use:**
- Creating new files
- Overwriting existing content
- Simple file generation

**MCP Tools:** `mcp__desktop-commander__write_file`

**Example:** Create new .env file with defaults

---

### Pattern 3: DC-only Edit

```
┌────────┐
│ DC act │ → edit_block
└────────┘
```

**When to use:**
- Surgical text replacement
- Small targeted changes
- Function signature updates

**MCP Tools:** `mcp__desktop-commander__edit_block`

**Example:** Update port number in server config

---

### Pattern 4: CI-only Search

```
┌────────┐
│ CI     │ → search_code_advanced
└────────┘
```

**When to use:**
- Finding where code exists
- Pattern searching across files
- Usage location discovery

**MCP Tools:** `mcp__code-index-mcp__search_code_advanced`

**Example:** Find all uses of `useState` hook

---

### Pattern 5: CI-only Symbol Navigation

```
┌────────┐
│ CI     │ → get_symbol_body
└────────┘
```

**When to use:**
- Understanding function implementation
- Extracting class definitions
- Reading method signatures

**MCP Tools:** `mcp__code-index-mcp__get_symbol_body`

**Example:** Get `authenticate` middleware implementation

---

### Pattern 6: CI-only File Analysis

```
┌────────┐
│ CI     │ → get_file_summary
└────────┘
```

**When to use:**
- Understanding file structure
- Checking complexity metrics
- Identifying imports/exports

**MCP Tools:** `mcp__code-index-mcp__get_file_summary`

**Example:** Analyze route handler file structure

---

### Pattern 7: CG → CI Discovery

```
┌───┐    ┌───┐
│ CG │ ──→│ CI │ → query_graph then search_code_advanced
└───┘    └───┘
```

**When to use:**
- Finding related files
- Understanding dependencies
- Impact analysis before changes

**MCP Tools:** `mcp__CodeGraphContext__query_graph`, `mcp__code-index-mcp__search_code_advanced`

**Example:** Find all files affected by changing User model

---

### Pattern 8: CG → CI Relationship Discovery

```
┌───┐    ┌───┐
│ CG │ ──→│ CI │ → find_path then get_symbol_body
└───┘    └───┘
```

**When to use:**
- Tracing import chains
- Understanding module relationships
- Finding connection paths

**MCP Tools:** `mcp__CodeGraphContext__find_path`, `mcp__code-index-mcp__get_symbol_body`

**Example:** Trace how auth module depends on User model

---

### Pattern 9: DC → CI Impact Analysis

```
┌───┐    ┌───┐
│ DC │ ──→│ CI │ → edit_block then search_code_advanced
└───┘    └───┘
```

**When to use:**
- Making change and checking usage
- Quick iteration with feedback
- Verifying ripple effects

**MCP Tools:** `mcp__desktop-commander__edit_block`, `mcp__code-index-mcp__search_code_advanced`

**Example:** Update function name and find all call sites

---

### Pattern 10: DC → CI Verification

```
┌───┐    ┌───┐
│ DC │ ──→│ CI │ → write_file then get_file_summary
└───┘    └───┘
```

**When to use:**
- Creating new file and verifying structure
- Checking if file was indexed correctly
- Confirming export/import worked

**MCP Tools:** `mcp__desktop-commander__write_file`, `mcp__code-index-mcp__get_file_summary`

**Example:** Create new route file and verify it's structured correctly

---

### Pattern 11: CI → DC Implementation

```
┌───┐    ┌───┐
│ CI │ ──→│ DC │ → get_symbol_body then edit_block
└───┘    └───┘
```

**When to use:**
- Understanding existing pattern then applying elsewhere
- Following established conventions
- Copying implementation style

**MCP Tools:** `mcp__code-index-mcp__get_symbol_body`, `mcp__desktop-commander__edit_block`

**Example:** Read existing route pattern, create similar route

---

### Pattern 12: CI → DC Multi-File

```
┌───┐    ┌─────────┐
│ CI │ ──→│    DC    │ → search_code_advanced then edit_block (multiple)
└───┘    └─────────┘
```

**When to use:**
- Finding pattern instances across files
- Bulk updates to similar code
- Consistency updates

**MCP Tools:** `mcp__code-index-mcp__search_code_advanced`, `mcp__desktop-commander__edit_block`

**Example:** Update import path in 5 files that use old module

---

### Pattern 13: Golden Pattern (Full)

```
┌───┐    ┌───┐    ┌───┐    ┌───┐    ┌───┐
│ CG │ ──→│ CI │ ──→│ CI │ ──→│ DC │ ──→│ DC │ ──→│ CI │
└───┘    └───┘    └───┘    └───┘    └───┘    └───┘
discover  understand  understand  act   verify  verify
```

**When to use:**
- Complex multi-file refactors
- Breaking API changes
- Feature additions requiring verification
- Security-critical changes

**MCP Tools:**
- `mcp__CodeGraphContext__query_graph`
- `mcp__code-index-mcp__search_code_advanced`
- `mcp__code-index-mcp__get_symbol_body`
- `mcp__desktop-commander__edit_block`
- `mcp__desktop-commander__read_file`
- `mcp__code-index-mcp__search_code_advanced`

**Example:** Add authentication to all protected routes (see GOLDEN-PATTERN.md)

**Token Efficiency:** ~80-90% vs native tools

---

### Pattern 14: Golden Pattern (CI-only fallback)

```
┌───┐    ┌───┐    ┌───┐    ┌───┐    ┌───┐
│ CI │ ──→│ CI │ ──→│ CI │ ──→│ DC │ ──→│ DC │ ──→│ CI │
└───┘    └───┘    └───┘    └───┘    └───┘    └───┘
discover  understand  understand  act   verify  verify
```

**When to use:**
- CG server unavailable
- Relationship discovery not critical
- Faster execution (skip CG step)

**MCP Tools:**
- `mcp__code-index-mcp__search_code_advanced` (discover)
- `mcp__code-index-mcp__get_file_summary` (understand)
- `mcp__code-index-mcp__get_symbol_body` (understand)
- `mcp__desktop-commander__edit_block` (act)
- `mcp__desktop-commander__read_file` (verify)
- `mcp__code-index-mcp__search_code_advanced` (verify)

**Example:** Same as Golden Pattern but without relationship analysis

---

### Pattern 15: DC Process → CI Verify

```
┌─────────┐    ┌───┐
│   DC    │ ──→│ CI │ → start_process then search_code_advanced
│ Process │    └───┘
└─────────┘
```

**When to use:**
- Running tests and verifying results
- Building and checking output
- Executing CLI and validating effects

**MCP Tools:** `mcp__desktop-commander__start_process`, `mcp__code-index-mcp__search_code_advanced`

**Example:** Run type check and verify no new errors were introduced

---

## Circular Patterns (16-19)

Circular patterns include loops for iterative refinement or verification.

### Pattern 16: CI Verify → DC Act → CI Verify

```
    ┌──────────────┐
    │              │
    ▼              │
┌───┐         ┌───┐
│ CI │ ←──────│ DC │
└───┘  verify └───┘
  ^              │
  │              │
  └────── act ───┘
```

**When to use:**
- Verification loop during refactoring
- Test-driven development workflow
- Iterative bug fixing

**MCP Tools:** CI search → DC edit → CI search (repeat)

**Example:**
1. CI: Find failing test
2. DC: Fix code
3. CI: Verify test passes
4. If not pass, repeat

---

### Pattern 17: DC Act → CI Analyze → DC Adjust

```
    ┌──────────────┐
    │              │
    ▼              │
┌───┐         ┌───┐
│ DC │ ←──────│ CI │
└───┘  analyze  └───┘
  ^              │
  │              │
  └───── adjust ─┘
```

**When to use:**
- Progressive refinement of code
- Learning existing patterns incrementally
- Discovering ripple effects

**MCP Tools:** DC edit → CI analyze → DC edit (repeat)

**Example:**
1. DC: Make initial change
2. CI: Find affected files
3. DC: Update affected files
4. Repeat until complete

---

### Pattern 18: CG Discover → CI Understand → CG Refine

```
    ┌──────────────────┐
    │                  │
    ▼                  │
┌───┐           ┌───┐
│ CG │ ←────────│ CI │
└───┘  refine   └───┘
  ^                 │
  │                 │
  └── discover  ───┘
```

**When to use:**
- Deep relationship exploration
- Understanding complex dependencies
- Architecture discovery

**MCP Tools:** CG query → CI analyze → CG refined query (repeat)

**Example:**
1. CG: Find modules using User
2. CI: Analyze authentication usage
3. CG: Find modules depending on auth
4. Repeat for full dependency chain

---

### Pattern 19: CI Symbol Lookup → DC Apply → CI Re-index

```
    ┌─────────────────┐
    │                │
    ▼                │
┌───┐         ┌───┐
│ CI │ ←──────│ DC │
└───┘ re-index └───┘
  ^             │
  │             │
  └── lookup ───┘
```

**When to use:**
- Multi-step code generation
- Symbol-based code creation
- Ensuring index stays current

**MCP Tools:** CI symbol lookup → DC write → CI refresh_index (repeat)

**Example:**
1. CI: Get interface signature
2. DC: Implement interface
3. CI: Re-index to include new implementation
4. Repeat for each method

---

## Hybrid Patterns (20-24)

Hybrid patterns combine multiple flows or use parallel operations.

### Pattern 20: Parallel DC Operations

```
        ┌───────┐
        │       │
    ┌───┴───┐   │
    │         │   │
┌───┴──┐  ┌───┴──┐
│ DC 1  │  │ DC 2  │
└───────┘  └───────┘
```

**When to use:**
- Independent file operations
- Unrelated edits
- Batch file creation

**MCP Tools:** Multiple parallel `mcp__desktop-commander__edit_block` or `write_file`

**Example:** Create 3 new test files simultaneously (user.test.ts, auth.test.ts, api.test.ts)

**Token Efficiency:** Parallel operations reduce total tokens by batching context

---

### Pattern 21: Batch CI Queries Before DC Operations

```
        ┌─────────┐
        │         │
    ┌───┴───┬───┴───┐
    │        │        │
┌───┴──┐  ┌───┴──┐  ┌───┴──┐
│ CI 1  │  │ CI 2  │  │ CI 3  │
└───────┘  └───────┘  └───────┘
    │           │           │
    └───────────┴─────────┘
                │
                ▼
            ┌───────┐
            │   DC   │
            └───────┘
```

**When to use:**
- Need multiple analyses before acting
- Understanding multiple files
- Comprehensive context gathering

**MCP Tools:** Multiple CI queries (search, summary, symbols) then single DC operation

**Example:** Search for all error handling patterns, then implement consistent error handling

**Token Efficiency:** Batch queries share index context, reducing per-query overhead

---

### Pattern 22: CG-Guided Multi-File DC Operations

```
        ┌───────┐
        │   CG   │ → dependency map
        └───────┘
            │
            ▼
        ┌─────────┐
    ┌───┴───┬───┴───┐
    │        │        │
┌───┴──┐  ┌───┴──┐  ┌───┴──┐
│ DC 1  │  │ DC 2  │  │ DC 3  │
└───────┘  └───────┘  └───────┘
```

**When to use:**
- Coordinated multi-file changes
- Relationship-aware edits
- Dependency-respecting updates

**MCP Tools:** CG discover → multiple coordinated DC operations

**Example:** Update User model and all files that import it, in correct order

**Token Efficiency:** Single CG query guides multiple DC operations, avoiding repeated analysis

---

### Pattern 23: CI Pre-Analysis with DC Post-Verification

```
┌─────────────────────┐
│                   │
    ┌────────────┐   │
    │            │   │
┌───┴──┐  ┌───┴──┐
│ CI 1  │  │ CI 2  │ → Analysis
└───────┘  └───────┘
    │           │
    └───────────┘
                │
                ▼
            ┌───────┐
            │   DC   │ → Action
            └───────┘
                │
                ▼
            ┌───────┐
            │   CI   │ → Verification
            └───────┘
```

**When to use:**
- High-confidence changes
- Well-understood modifications
- Redundant verification important

**MCP Tools:** Multiple CI analyses → DC action → CI verification

**Example:** Analyze current and target states, make change, verify both analyses match

**Token Efficiency:** Dual verification reduces rollback likelihood, saving re-work tokens

---

### Pattern 24: Adaptive Pattern Selection

```
                   ┌─────────┐
                   │ Context │
                   └────┬────┘
                        │
            ┌───────────┼───────────┐
            │           │           │
            ▼           ▼           ▼
        ┌───────┐  ┌───────┐  ┌───────┐
        │ Simple │  │ Medium │  │Complex │
        │   DC   │  │  CI→DC │  │ Golden  │
        └───────┘  └───────┘  └───────┘
```

**When to use:**
- Dynamic workflow selection based on complexity
- Uncertain about operation scope
- Building flexible automation

**Decision Criteria:**
- Simple (single file): DC-only
- Medium (multi-file, no refactoring): CI → DC
- Complex (refactoring, dependencies): Golden Pattern

**MCP Tools:** Selected based on context analysis

**Example:** Agent analyzes task, selects appropriate pattern automatically

**Token Efficiency:** Avoids over-engineering simple tasks, under-analyzing complex ones

---

## Decision Tree for Pattern Selection

### Step 1: What operation type?

**File operation only** → Patterns 1-3 (DC-only)
**Code analysis only** → Patterns 4-6 (CI-only)
**Mixed operations** → Continue to step 2

---

### Step 2: Is relationship discovery needed?

**Yes** →
- Simple discovery: Pattern 7 (CG → CI)
- Complex relationships: Pattern 22 (CG-guided multi-file)
- Full analysis: Pattern 13 (Golden)

**No** → Continue to step 3

---

### Step 3: What's the primary direction?

**Analyze then act** →
- Single file: Pattern 11 (CI → DC)
- Multi-file: Pattern 12 (CI → DC multi-file)

**Act then analyze** →
- Quick check: Pattern 9 (DC → CI impact)
- Verification: Pattern 10 (DC → CI verify)
- Process-based: Pattern 15 (DC process → CI)

**Iterative refinement** →
- Verification loop: Pattern 16 (CI → DC → CI)
- Progressive: Pattern 17 (DC → CI → DC)

**Complex change** →
- Full golden: Pattern 13 (Golden)
- CI fallback: Pattern 14 (Golden without CG)

---

### Step 4: Can operations be parallelized?

**Yes, independent** → Pattern 20 (Parallel DC)
**Yes, batch analysis** → Pattern 21 (Batch CI → DC)
**No** → Use pattern from step 3

---

## Example Scenarios

### Scenario 1: "Find where function X is defined"

**Path:** What operation? → Code analysis only → Pattern 4 or 5

**Selected Pattern:** Pattern 5 (CI-only Symbol Navigation)

**Flow:** CI get_symbol_body

**Result:** Direct function definition retrieved

---

### Scenario 2: "Add authentication to 5 routes"

**Path:** What operation? → Mixed → Relationship needed? → Yes → Complex change

**Selected Pattern:** Pattern 13 (Golden Pattern)

**Flow:** CG discover → CI understand → CI understand → DC act → DC verify → CI verify

**Result:** All routes updated with authentication, verified

---

### Scenario 3: "Update config in 3 independent files"

**Path:** What operation? → Mixed → Relationship needed? → No → Parallelizable?

**Selected Pattern:** Pattern 20 (Parallel DC Operations)

**Flow:** Multiple parallel DC edit operations

**Result:** All 3 config files updated simultaneously

---

### Scenario 4: "Understand how module A depends on module B"

**Path:** What operation? → Mixed → Relationship needed? → Yes

**Selected Pattern:** Pattern 8 (CG → CI Relationship Discovery)

**Flow:** CG find_path → CI get_symbol_body

**Result:** Dependency chain mapped with implementation details

---

### Scenario 5: "Rename export across codebase"

**Path:** What operation? → Mixed → Relationship needed? → Yes → Multi-file

**Selected Pattern:** Pattern 22 (CG-Guided Multi-File DC)

**Flow:** CG query (find all usages) → Multiple DC edits (rename each)

**Result:** All exports renamed consistently, no broken imports

---

## Token Efficiency Notes

### Pattern Efficiency Ranking (Most to Least Efficient)

1. **Pattern 20 (Parallel DC)** - Highest token efficiency
   - Batches context across operations
   - Single tool definition overhead

2. **Pattern 21 (Batch CI)** - High efficiency
   - Shared index context
   - Reduced query overhead

3. **Patterns 1-6 (Single-server)** - Good efficiency
   - Direct tool usage
   - No server switching

4. **Patterns 7-12 (Two-server)** - Medium efficiency
   - Two tool contexts
   - Minimal switching

5. **Patterns 13-14 (Golden)** - Medium-High efficiency
   - Multiple tools but optimal sequence
   - Verification prevents re-work

6. **Patterns 16-19 (Circular)** - Lower efficiency
   - Repeated operations
   - Necessary for refinement

7. **Patterns 22-24 (Hybrid)** - Variable efficiency
   - Context dependent
   - Optimizes for specific scenarios

### General Efficiency Guidelines

- **Prefer single-server patterns** when task is simple
- **Use Golden Pattern** for complex tasks (saves re-work)
- **Parallelize independent operations** whenever possible
- **Batch queries** before acting (share index context)
- **Verification costs tokens** but saves more in re-work avoidance

---

## Relationship to Golden Pattern

The **Golden Pattern (13)** is the comprehensive pattern for complex workflows. All other patterns are simplifications or specializations:

- **Patterns 1-6:** Single-server simplifications
- **Patterns 7-12:** Two-server subsets
- **Patterns 16-19:** Iterative/loop-based variants
- **Patterns 20-24:** Specialized optimizations

**Rule of thumb:** Start with the simplest pattern that meets requirements. Only escalate to Golden Pattern when complexity demands it.

---

## Comprehensive Decision Tree

### Visual Decision Tree

```
START: What type of operation?
│
├──────────────────────────────────────────────────────
│  FILE OPERATION ONLY?
│  ├─ Yes → Single file read? → Pattern 1 (DC-only Read)
│  │         └─ Single file write? → Pattern 2 (DC-only Write)
│  │         └─ Single file edit? → Pattern 3 (DC-only Edit)
│  │
│  └─ No → Continue to CODE ANALYSIS?
│
├──────────────────────────────────────────────────────
│  CODE ANALYSIS ONLY?
│  ├─ Yes → Find where code exists? → Pattern 4 (CI-only Search)
│  │         └─ Understand implementation? → Pattern 5 (CI-only Symbol)
│  │                                       → Pattern 6 (CI-only Analysis)
│  │
│  └─ No → Continue to RELATIONSHIP DISCOVERY?
│
├──────────────────────────────────────────────────────
│  RELATIONSHIP DISCOVERY NEEDED?
│  ├─ Yes → Simple dependency mapping? → Pattern 7 (CG → CI Discovery)
│  │         └─ Trace import chains? → Pattern 8 (CG → CI Relationships)
│  │
│  └─ No → Continue to OPERATION DIRECTION?
│
├──────────────────────────────────────────────────────
│  WHAT'S THE PRIMARY DIRECTION?
│  │
│  ├─ Analyze then act
│  │   └─ Single file? → Pattern 11 (CI → DC Implementation)
│  │       └─ Multi-file? → Pattern 12 (CI → DC Multi-File)
│  │
│  ├─ Act then analyze
│  │   ├─ Quick impact check? → Pattern 9 (DC → CI Impact)
│  │   ├─ Verify structure? → Pattern 10 (DC → CI Verification)
│  │   └─ Process execution? → Pattern 15 (DC Process → CI)
│  │
│  └─ Iterative refinement
│      ├─ Verification loop? → Pattern 16 (CI Verify → DC → CI)
│      ├─ Progressive adjust? → Pattern 17 (DC Act → CI → DC)
│      └─ Architecture discovery? → Pattern 18 (CG → CI → CG)
│
└──────────────────────────────────────────────────────
   COMPLEX MULTI-FILE CHANGE?
   ├─ CG available? → Pattern 13 (Golden Pattern)
   ├─ CG unavailable? → Pattern 14 (Golden CI-only)
   └─ Parallelizable? → Pattern 20-24 (Hybrid)
```

---

## Decision Criteria Reference

### DC-only Patterns (1-3)

**Use when:**
- Operation is purely file-based
- No code understanding needed
- Single file involved
- No verification required beyond write confirmation

**Don't use when:**
- Need to understand existing code
- Making code changes (not just content)
- Need to verify correctness

---

### CI-only Patterns (4-6)

**Use when:**
- Only reading/analyzing code
- No file modifications needed
- Finding symbols or patterns
- Understanding implementation

**Don't use when:**
- Need to modify files
- Need to execute commands
- Making changes to codebase

---

### CG Patterns (7-8, 18)

**Use when:**
- Need to understand relationships
- Finding dependencies
- Impact analysis
- Tracing imports/exports

**Don't use when:**
- CG unavailable (use CI fallback)
- Simple file operations
- Direct code access is sufficient

---

### Two-Server Patterns (9-12)

**CI → DC (11-12): Use when**
- Need to understand before acting
- Following existing patterns
- Implementation requires analysis first

**DC → CI (9-10, 15): Use when**
- Quick iterations needed
- Verification after action
- Experimental changes

---

### Circular Patterns (16-19)

**Use when:**
- Iterative refinement required
- Verification loops
- Progressive discovery
- Test-driven development

**Don't use when:**
- One-shot operation is possible
- No iteration needed
- Single-pass sufficient

---

### Hybrid Patterns (20-24)

**Use when:**
- Multiple independent operations
- Batch queries beneficial
- Complex workflows requiring optimization
- Adaptive pattern selection needed

**Don't use when:**
- Single straightforward operation
- Simple pattern suffices

---

### Golden Pattern (13-14)

**Use when:**
- Multi-file refactor affecting dependencies
- Breaking API changes
- Security-critical modifications
- Feature additions requiring verification
- Architecture modifications

**Don't use when:**
- Single file edit (use DC-only)
- Simple search (use CI-only)
- Non-code change

---

## Example Walkthroughs

### Example 1: "I need to find where function X is defined"

**Decision Path:**
1. What type of operation? → Code analysis only
2. What kind of analysis? → Understand implementation

**Selected Pattern:** Pattern 5 (CI-only Symbol Navigation)

**Flow:**
```yaml
mcp__code-index-mcp__get_symbol_body:
  file_path: "unknown/path.ts"
  symbol_name: "functionX"
```

**Outcome:** Function definition retrieved with signature, docstring, and code

---

### Example 2: "I need to add authentication to these 5 routes"

**Decision Path:**
1. What type of operation? → Mixed (file changes + analysis)
2. Relationship discovery needed? → Yes (middleware integration)
3. Complex multi-file change? → Yes

**Selected Pattern:** Pattern 13 (Golden Pattern)

**Flow:**
```yaml
Step 1: CG discover → Find all route files
Step 2: CI understand → Understand current auth pattern
Step 3: CI understand → Get authenticate middleware signature
Step 4: DC act → Add middleware to each route file
Step 5: DC verify → Confirm each file was edited
Step 6: CI verify → Search for middleware usage in all routes
```

**Outcome:** All 5 routes protected with authentication, verified

---

### Example 3: "I need to understand how module A depends on module B"

**Decision Path:**
1. What type of operation? → Code analysis + relationship discovery
2. Relationship discovery needed? → Yes

**Selected Pattern:** Pattern 8 (CG → CI Relationship Discovery)

**Flow:**
```yaml
Step 1: CG → Find relationship path between A and B
Step 2: CI → Get symbol body for import/export points
```

**Outcome:** Dependency chain mapped with implementation details

---

### Example 4: "I need to update config in 3 independent files"

**Decision Path:**
1. What type of operation? → File operations
2. Multiple files? → Yes
3. Independent? → Yes (no dependencies between files)
4. Parallelizable? → Yes

**Selected Pattern:** Pattern 20 (Parallel DC Operations)

**Flow:**
```yaml
Parallel execution:
  - DC edit config/file1.json
  - DC edit config/file2.json
  - DC edit config/file3.json
```

**Outcome:** All 3 config files updated simultaneously

---

### Example 5: "I need to rename an export across the codebase"

**Decision Path:**
1. What type of operation? → Mixed (analysis + file changes)
2. Relationship discovery needed? → Yes (need all usages)
3. Multi-file change? → Yes

**Selected Pattern:** Pattern 22 (CG-Guided Multi-File DC)

**Flow:**
```yaml
Step 1: CG → Query for all files importing oldExportName
Step 2: DC → Edit each file to use newExportName
  (Coordinated in dependency order)
```

**Outcome:** All exports renamed consistently, no broken imports

---

## Quick Reference Card

| Question | Answer → Pattern |
|----------|-----------------|
| Read single file? | Yes → Pattern 1 |
| Write single file? | Yes → Pattern 2 |
| Edit single file? | Yes → Pattern 3 |
| Search code? | Yes → Pattern 4 |
| Get symbol? | Yes → Pattern 5 |
| Analyze file? | Yes → Pattern 6 |
| Find dependencies? | Yes → Pattern 7 |
| Trace imports? | Yes → Pattern 8 |
| Edit then check impact? | Yes → Pattern 9 |
| Write then verify? | Yes → Pattern 10 |
| Understand then edit? | Yes → Pattern 11 |
| Find all, update all? | Yes → Pattern 12 |
| Complex refactor? | Yes → Pattern 13 |
| CG unavailable? | Yes → Pattern 14 |
| Run process, verify? | Yes → Pattern 15 |
| Verification loop? | Yes → Pattern 16 |
| Iterative refinement? | Yes → Pattern 17 |
| Deep discovery? | Yes → Pattern 18 |
| Symbol-based creation? | Yes → Pattern 19 |
| Independent files? | Yes → Pattern 20 |
| Batch analysis? | Yes → Pattern 21 |
| Coordinated changes? | Yes → Pattern 22 |
| Dual verification? | Yes → Pattern 23 |
| Uncertain complexity? | Yes → Pattern 24 |

---

*Tool Chain Pattern Catalog*
*Created: 2026-02-11*
*Updated: 2026-02-13 (Phase 5: Thinking Server Integration)*
*Reference: MCP-Tool-Chain-Full-Analysis.md*
*Related: GOLDEN-PATTERN.md*

---

# Thinking Server Variants

**Overview:** Tool chain patterns optimized based on which thinking server is active (Sequential/Tractatus/Debug) with DC/CI/CG specific patterns.

**Integration:** Thinking servers orchestrate MCP tool calls for structured problem-solving.

---

## Sequential Thinking Variants

### Sequential + DC Variant

**Pattern:** Sequential thinking orchestrates DC operations

**Flow:**
```
┌──────────────┐    ┌────────┐    ┌──────────────┐
│ Sequential   │ →  │ DC act │ →  │ Sequential   │
│ (plan)       │    │        │    │ (verify)     │
└──────────────┘    └────────┘    └──────────────┘
```

**When to use:**
- Multi-step file operations with verification
- Planned file refactoring
- Sequential edits requiring verification

**MCP Tools:**
- `mcp__sequential-thinking__sequentialthinking` (planning + verification)
- `mcp__desktop-commander__read_file/write_file/edit_block` (execution)

**Example Flow:**
```yaml
Step 1: Sequential Thinking (plan)
  Thought 1: "Need to refactor auth.js into 3 modules"
  Thought 2: "Extract token validation to separate module"
  Thought 3: "Extract session management to separate module"
  Thought 4: "Extract middleware to separate module"
  Thought 5: "Update imports in dependent files"

Step 2: DC Operations (execute)
  DC: create token-validation.js
  DC: create session-management.js
  DC: create auth-middleware.js
  DC: edit auth.js (use new modules)

Step 3: Sequential Thinking (verify)
  Thought 6: "Verify: All modules created, imports updated, tests pass"
```

---

### Sequential + CI Variant

**Pattern:** Sequential thinking breaks down code analysis

**Flow:**
```
┌──────────────┐    ┌────────┐    ┌──────────────┐
│ Sequential   │ →  │ CI     │ →  │ Sequential   │
│ (decompose)  │    │        │    │ (synthesize) │
└──────────────┘    └────────┘    └──────────────┘
```

**When to use:**
- Complex codebase understanding
- Multi-step code analysis
- Structured investigation

**MCP Tools:**
- `mcp__sequential-thinking__sequentialthinking` (decomposition + synthesis)
- `mcp__code-index-mcp__search_code_advanced/get_symbol_body` (analysis)

**Example Flow:**
```yaml
Step 1: Sequential Thinking (decompose)
  Thought 1: "Need to understand authentication flow"
  Thought 2: "Find auth entry points"
  Thought 3: "Trace auth middleware usage"
  Thought 4: "Identify protected routes"
  Thought 5: "Find session/token storage"

Step 2: CI Operations (search)
  CI: search_code_advanced("authenticate.*middleware")
  CI: get_symbol_body("requireAuth")
  CI: search_code_advanced("session.*storage")

Step 3: Sequential Thinking (synthesize)
  Thought 6: "Auth flows: middleware → route guards → session storage"
```

---

### Sequential + CG Variant

**Pattern:** Sequential thinking guides relationship discovery

**Flow:**
```
┌──────────────┐    ┌────────┐    ┌──────────────┐
│ Sequential   │ →  │ CG     │ →  │ Sequential   │
│ (identify)   │    │        │    │ (interpret)  │
└──────────────┘    └────────┘    └──────────────┘
```

**When to use:**
- Architectural dependency mapping
- Relationship-based investigation
- Structured dependency analysis

**MCP Tools:**
- `mcp__sequential-thinking__sequentialthinking` (identify + interpret)
- `mcp__codegraph__query_graph` (relationship mapping)

**Example Flow:**
```yaml
Step 1: Sequential Thinking (identify)
  Thought 1: "Need to map service dependencies"
  Thought 2: "Find all services using User model"
  Thought 3: "Trace authentication dependencies"
  Thought 4: "Map data flow between services"
  Thought 5: "Identify critical paths"

Step 2: CG Operations (query)
  CG: query_graph for User model imports
  CG: find_path between services
  CG: analyze relationship strengths

Step 3: Sequential Thinking (interpret)
  Thought 6: "Services: Auth → User → Profile with circular dependency"
```

---

## Tractatus Thinking Variants

### Tractatus + DC Variant

**Pattern:** Tractatus analyzes structure, DC implements

**Flow:**
```
┌──────────────┐    ┌────────┐    ┌──────────────┐
│ Tractatus    │ →  │ DC act │ →  │ Tractatus    │
│ (start)      │    │        │    │ (verify)     │
└──────────────┘    └────────┘    └──────────────┘
```

**When to use:**
- Architectural changes requiring structural verification
- Concept-driven implementation
- Structure-first development

**MCP Tools:**
- `mcp__tractatus-thinking__tractatus_thinking` (start/analyze/export)
- `mcp__desktop-commander__write_file/edit_block` (implementation)

**Example Flow:**
```yaml
Step 1: Tractatus Thinking (start)
  Concept: "Analyze authentication structure"
  Add propositions:
    - Auth requires token validation
    - Auth requires session management
    - Auth requires middleware
  Export: Structure to markdown

Step 2: DC Operations (implement)
  DC: create token-validation.js
  DC: create session-management.js
  DC: create auth-middleware.js

Step 3: Tractatus Thinking (verify)
  Analyze: Verify all propositions satisfied
  Export: Final structure documentation
```

---

### Tractatus + CI Variant

**Pattern:** Tractatus decomposes concepts, CI provides evidence

**Flow:**
```
┌──────────────┐    ┌────────┐    ┌──────────────┐
│ Tractatus    │ →  │ CI     │ →  │ Tractatus    │
│ (propositions)│   │        │    │ (refine)     │
└──────────────┘    └────────┘    └──────────────┘
```

**When to use:**
- Concept verification against codebase
- Evidence-based architecture validation
- Structure confirmation

**MCP Tools:**
- `mcp__tractatus-thinking__tractatus_thinking` (propositions/refine)
- `mcp__code-index-mcp__search_code_advanced` (evidence)

**Example Flow:**
```yaml
Step 1: Tractatus Thinking (propositions)
  Concept: "Verify auth architecture"
  Add propositions:
    - Token validation exists
    - Session management exists
    - Middleware usage consistent

Step 2: CI Operations (evidence)
  CI: search_code_advanced("token.*validation")
  CI: search_code_advanced("session.*manage")
  CI: search_code_advanced("authenticate.*middleware")

Step 3: Tractatus Thinking (refine)
  Refine: Update propositions based on evidence
  Analyze: Verify completeness
  Export: Final validated structure
```

---

### Tractatus + CG Variant

**Pattern:** Tractatus structural analysis with CG relationship mapping

**Flow:**
```
┌──────────────┐    ┌────────┐    ┌──────────────┐
│ Tractatus    │ →  │ CG     │ →  │ Tractatus    │
│ (decompose)  │    │        │    │ (export)     │
└──────────────┘    └────────┘    └──────────────┘
```

**When to use:**
- Full architecture documentation
- Relationship-driven decomposition
- Complete structure mapping

**MCP Tools:**
- `mcp__tractatus-thinking__tractatus_thinking` (decompose/export)
- `mcp__codegraph__query_graph` (relationship mapping)

**Example Flow:**
```yaml
Step 1: Tractatus Thinking (decompose)
  Concept: "Decompose user management system"
  Add propositions:
    - User model defines data
    - Auth service handles authentication
    - Profile service manages data
    - Admin panel provides oversight

Step 2: CG Operations (map)
  CG: Query all imports of User model
  CG: Find paths between services
  CG: Map relationship strengths

Step 3: Tractatus Thinking (export)
  Export: Complete structure with dependencies
  Format: markdown with relationship graph
```

---

## Debug Thinking Variants

### Debug + DC Variant

**Pattern:** Debug graph tracks DC operations

**Flow:**
```
┌────────┐    ┌────────┐    ┌────────┐
│ Debug  │ →  │ DC     │ →  │ Debug  │
│(create)│    │(experiment)│ │(observe)│
└────────┘    └────────┘    └────────┘
```

**When to use:**
- Systematic bug fixing with knowledge tracking
- Experiment-based debugging
- Learning-oriented problem solving

**MCP Tools:**
- `mcp__debug-thinking__debug_thinking` (create/observe)
- `mcp__desktop-commander__edit_block` (experiments)

**Example Flow:**
```yaml
Step 1: Debug Thinking (create)
  CREATE problem: "TypeError: Cannot read property 'x' of undefined"

Step 2: DC Operations (experiment)
  DC: edit_block - Add optional chaining operator

Step 3: Debug Thinking (observe)
  CREATE observation: "Error resolved, no runtime errors"
  CREATE solution: "Use optional chaining"
  CREATE learning: "Async operations need null safety"
```

---

### Debug + CI Variant

**Pattern:** Debug knowledge base informs CI searches

**Flow:**
```
┌────────┐    ┌────────┐    ┌────────┐
│ Debug  │ →  │ CI     │ →  │ Debug  │
│(query) │    │(search)│    │(connect)│
└────────┘    └────────┘    └────────┘
```

**When to use:**
- Leveraging past debugging solutions
- Knowledge-based investigation
- Pattern-based problem solving

**MCP Tools:**
- `mcp__debug-thinking__debug_thinking` (query/connect)
- `mcp__code-index-mcp__search_code_advanced` (search)

**Example Flow:**
```yaml
Step 1: Debug Thinking (query)
  QUERY: similar-problems pattern "TypeError undefined"
  Results: Past solutions (optional chaining, default values)

Step 2: CI Operations (search)
  CI: search_code_advanced for similar error patterns
  CI: Find all locations using pattern from past solutions

Step 3: Debug Thinking (connect)
  CREATE hypothesis: "Apply optional chaining pattern"
  CONNECT to: Similar past solutions
  CREATE learning: "Pattern effective for this codebase"
```

---

### Debug + CG Variant

**Pattern:** Debug graph tracks relationship-based failures

**Flow:**
```
┌────────┐    ┌────────┐    ┌────────┐
│ Debug  │ →  │ CG     │ →  │ Debug  │
│(create)│    │(find)  │    │(solve) │
└────────┘    └────────┘    └────────┘
```

**When to use:**
- Multi-component failure analysis
- Relationship-based debugging
- Dependency issue resolution

**MCP Tools:**
- `mcp__debug-thinking__debug_thinking` (create/solve)
- `mcp__codegraph__query_graph` (find broken dependencies)

**Example Flow:**
```yaml
Step 1: Debug Thinking (create)
  CREATE problem: "Integration failure between services"

Step 2: CG Operations (find)
  CG: Find broken relationship path
  CG: Identify missing dependency
  CG: Map affected components

Step 3: Debug Thinking (solve)
  CREATE solution: "Restore missing dependency"
  CONNECT solution to problem
  CREATE learning: "Service X depends on Y"
```

---

## Thinking-Aware Tool Selection Decision Tree

### Primary Decision: Which thinking server?

```
What type of problem?
│
├─ Multi-step planning?
│  └─→ Sequential thinking (decompose → plan → verify)
│
├─ Architectural/structural analysis?
│  └─→ Tractatus thinking (start → add → export)
│
└─ Bug investigation?
   └─→ Debug thinking (create → connect → query)
```

### Secondary Decision: Which MCP server?

**Based on thinking server output:**

| Thinking Server | Output Guides | MCP Server |
|----------------|---------------|------------|
| Sequential | "Use CI to verify X" | CI |
| Sequential | "Use DC to create Y" | DC |
| Sequential | "Use CG to map Z" | CG |
| Tractatus | "Use CG to map dependencies" | CG |
| Tractatus | "Use CI to find evidence" | CI |
| Debug | "Query similar problems first" | Debug |
| Debug | "Use DC for experiments" | DC |

### Combined Pattern Selection

```
Thinking Server + MCP Server = Optimal Tool Chain

Examples:
- Sequential + CI: "Plan 7-step analysis" → CI search each step
- Tractatus + CG: "Decompose architecture" → CG map dependencies
- Debug + DC: "Create problem" → DC experiments → Create solution
- Tractatus + DC: "Analyze structure" → DC implement → Verify structure
```

### Token Efficiency Guidelines

1. **One thinking session per workflow**: Avoid multiple thinking calls
2. **Thinking output specifies exact MCP tools**: Don't guess, use what thinking suggests
3. **Batch operations based on thinking**: Group related MCP calls
4. **Reuse thinking context**: Don't restart thinking for related operations

---

## Integrated Tool Chain Examples

### Example 1: Sequential + CI for Codebase Analysis

**Scenario:** "Understand how authentication flows through the system"

**Flow:**
```yaml
Step 1: Sequential Thinking (5 thoughts)
  Thought 1: "Need to find auth entry points"
  Thought 2: "Need to trace auth middleware usage"
  Thought 3: "Need to identify protected routes"
  Thought 4: "Need to find session/token storage"
  Thought 5: "Need to verify auth check consistency"

Step 2: CI Operations (guided by thoughts)
  CI: search_code_advanced("authenticate.*middleware")
  CI: get_symbol_body("requireAuth")
  CI: search_code_advanced("session.*storage")

Step 3: Sequential Thinking (synthesize)
  Thought 6: "Auth flows: middleware → route guards → session storage"
```

---

### Example 2: Tractatus + CG for Architecture Documentation

**Scenario:** "Document user management architecture"

**Flow:**
```yaml
Step 1: Tractatus Thinking (start)
  Concept: "Analyze user management architecture"
  Add propositions:
    - User model defines data structure
    - Auth service handles authentication
    - Profile service manages user data
    - Admin panel provides oversight

Step 2: CG Operations (map)
  CG: query_graph for all User model imports
  CG: find_path between Auth and User
  CG: analyze relationship strengths

Step 3: Tractatus Thinking (export)
  Export: Complete structure to markdown
  Include: All dependencies and relationships
```

---

### Example 3: Debug + DC for Systematic Bug Fix

**Scenario:** "Fix intermittent TypeError in async operations"

**Flow:**
```yaml
Step 1: Debug Thinking (create)
  CREATE problem: "TypeError undefined in async"

Step 2: Debug Thinking (query)
  QUERY: similar-problems pattern "TypeError undefined async"
  Results: Optional chaining solution (confidence: 0.9)

Step 3: DC Operations (experiment)
  DC: edit_block - Add optional chaining operator

Step 4: Debug Thinking (create solution/learning)
  CREATE solution: "Use optional chaining"
  CREATE learning: "Async operations need null safety"
```

---

### Example 4: Combined Tractatus → Sequential → DC Flow

**Scenario:** "Implement new authentication system"

**Flow:**
```yaml
Step 1: Tractatus Thinking (structure analysis)
  Concept: "Analyze authentication architecture requirements"
  Add propositions:
    - Auth requires identity verification
    - Auth requires credential validation
    - Auth requires session establishment
    - Auth = identity x credential x session
  Export: Structure specification

Step 2: Sequential Thinking (implementation planning)
  Thought 1: "Implement JWT token generation"
  Thought 2: "Create authentication middleware"
  Thought 3: "Add session management"
  Thought 4: "Implement refresh token rotation"
  Thought 5: "Add token revocation on logout"

Step 3: DC Operations (implementation)
  DC: create token-service.js
  DC: create auth-middleware.js
  DC: create session-manager.js

Step 4: Tractatus Thinking (verify)
  Analyze: Verify all propositions satisfied
  Export: Final architecture documentation
```

---

## Tool Chain Integration Guide

### Tool Chain Selection Matrix

| Thinking Server | Best For | Primary MCP | Secondary MCP |
|----------------|----------|-------------|---------------|
| Sequential | Multi-step planning | CI | DC |
| Tractatus | Structure analysis | CG | CI |
| Debug | Bug investigation | DC | Debug (query) |

### When to Combine Thinking + MCP Servers

**Use Sequential + CI when:**
- Multi-step code analysis needed
- Complex codebase understanding required
- Structured investigation beneficial

**Use Tractatus + CG when:**
- Architectural mapping required
- Relationship discovery needed
- Full structure documentation desired

**Use Debug + DC when:**
- Systematic bug fixing required
- Experiment-based debugging needed
- Knowledge capture important

**Use Sequential + DC when:**
- Planned file operations needed
- Sequential edits with verification
- Multi-step refactoring

### Token Optimization for Combined Patterns

1. **One thinking session covers multiple MCP operations**: Don't restart thinking
2. **Batch MCP calls based on thinking output**: Group related operations
3. **Reuse thinking context across operations**: Maintain continuity
4. **Export thinking results for documentation**: Reuse in future sessions

### Reference to THINKING-SERVERS.md

- "See THINKING-SERVERS.md for detailed thinking server APIs"
- "See decision tree above for thinking-aware tool selection"
- "See examples for practical combined patterns"

---

*Updated: 2026-02-13*
*Phase: 05-thinking-server-integration*

