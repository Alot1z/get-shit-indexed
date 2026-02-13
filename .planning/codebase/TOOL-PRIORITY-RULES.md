# GSD Tool Priority Rules

## CRITICAL RULE: MCP Tools Over Native Tools

**This is the single most important rule for token optimization.**

### Priority Order (MANDATORY)

1. **Skill Tools FIRST** - 80-90% token savings
2. **Desktop Commander MCP SECOND** - 50-70% token savings
3. **Other MCP Tools THIRD** - 30-50% token savings
4. **Native Tools LAST** - Only as fallback (baseline)

### Why This Matters

Native tools generate excessive protocol overhead:
- Tool definitions: ~15K tokens per tool
- Parameter validation: ~5K tokens per call
- Response processing: ~10K tokens per response

MCP tools with skill compression:
- Pre-compressed definitions: ~1K tokens per tool
- Validated parameters: ~500 tokens per call
- Efficient responses: ~2K tokens per response

**Result: 80-90% token savings on typical operations**

---

## Tool Selection Matrix

### File Operations

| Operation | Skill | DesktopCommander MCP | Native | Use |
|-----------|-------|---------------------|--------|-----|
| Read File | `desktop-commander` | `read_file` | `Read` | Skill |
| Write File | `desktop-commander` | `write_file` | `Write` | Skill |
| Edit File | `desktop-commander` | `edit_block` | `Edit` | Skill |
| List Directory | `desktop-commander` | `list_directory` | `Bash ls` | Skill |
| Search Files | `desktop-commander` | `start_search` | `Glob` | Skill |
| Get File Info | `desktop-commander` | `get_file_info` | `Bash stat` | Skill |
| Move File | `desktop-commander` | `move_file` | `Bash mv` | Skill |
| Create Directory | `desktop-commander` | `create_directory` | `Bash mkdir` | Skill |

**RULE: ALWAYS use `desktop-commander` skill for file operations**

### Process Operations

| Operation | Skill | DesktopCommander MCP | Native | Use |
|-----------|-------|---------------------|--------|-----|
| Start Process | `desktop-commander` | `start_process` | `Bash` | Skill |
| Interact | `desktop-commander` | `interact_with_process` | N/A | Skill |
| Read Output | `desktop-commander` | `read_process_output` | N/A | Skill |
| List Processes | `desktop-commander` | `list_processes` | `Bash ps` | Skill |
| Kill Process | `desktop-commander` | `kill_process` | `Bash kill` | Skill |

**RULE: ALWAYS use `desktop-commander` skill for process operations**

### Code Operations

| Operation | Skill | MCP | Native | Use |
|-----------|-------|-----|--------|-----|
| Code Review | `code-review-expert` | N/A | Manual | Skill |
| Code Search | N/A | `search_code_advanced` (CI) | `Grep` | MCP |
| Symbol Search | N/A | `get_symbol_body` (CI) | Manual | MCP |
| File Search | N/A | `find_files` (CI) | `Glob` | MCP |
| Build Index | N/A | `build_deep_index` (CI) | N/A | MCP |
| Relationship Analysis | N/A | `CG query` (CG) | Manual | MCP |

**RULE: Use `code-review-expert` skill for review, MCP for search/relationships**

**CG Server:** neo4j://localhost:7687 (CodeGraphContext for relationship analysis)

### Relationship Operations

| Operation | Skill | MCP | Native | Use |
|-----------|-------|-----|--------|-----|
| Graph Query | N/A | CG query_graph | Manual grep/trace | MCP |
| Find Path | N/A | CG find_path | Manual import tracing | MCP |
| Get Neighbors | N/A | CG get_neighbors | Manual dependency search | MCP |
| Impact Analysis | N/A | CG + CI combo | Manual audit | MCP |
| Dependency Map | N/A | CG query_graph | Manual documentation | MCP |

**RULE: Use CG tools for relationship discovery, CI for code content, DC for file operations**

**CG Server:** neo4j://localhost:7687 (CodeGraphContext for relationship analysis)

### CodeGraphContext (CG) Tools

#### query_graph
**Purpose:** Query code relationships and dependencies
**Use when:** Finding files affected by changes, mapping module dependencies, impact analysis
**Golden Pattern Step:** Step 1 - CG discover
**CG Server:** neo4j://localhost:7687
**Example:**
```yaml
mcp__CodeGraphContext__query_graph:
  query: "files that import or use User.authenticate"
  depth: 2
```
**Returns:** List of files, relationships, dependency paths
**Token efficiency:** ~85% vs manual grep/trace

#### find_path
**Purpose:** Find relationship paths between nodes
**Use when:** Tracing import chains, understanding module connections, finding indirect dependencies
**Example:**
```yaml
mcp__CodeGraphContext__find_path:
  from: "src/routes/users.ts"
  to: "src/middleware/auth.ts"
  relationship_type: "imports"
  max_depth: 3
```
**Returns:** Path showing how nodes connect (A -> B -> C)
**Use cases:**
- Understand breaking change impact
- Trace data flow through system
- Find circular dependencies

#### get_neighbors
**Purpose:** Get connected nodes for a symbol
**Use when:** Finding what depends on this, what this depends on, immediate impact analysis
**Example:**
```yaml
mcp__CodeGraphContext__get_neighbors:
  node: "src/models/user.ts"
  direction: "both"
  max_depth: 1
  relationship_types: ["imports", "extends", "implements"]
```
**Returns:** List of connected nodes with relationship types
**Direction options:** "incoming" (what depends on this), "outgoing" (what this depends on), "both"

### Analysis Operations

| Operation | Skill | MCP | Native | Use |
|-----------|-------|-----|--------|-----|
| Sequential Thinking | `sequential-thinking` | `sequentialthinking` | Manual | Skill |
| Tractatus Thinking | `tractatus-thinking` | `tractatus_thinking` | Manual | Skill |
| Debug Thinking | `debug-thinking` | `debug_thinking` | Manual | Skill |
| Deep Wiki | `deepwiki` | `ask_question` | Web Search | MCP |
| Context7 Docs | `context7` | `get-library-docs` | Web Search | MCP |

**RULE: Skills for thinking, MCP for external knowledge**

---

## Decision Tree

```
Need to perform operation?
  |
  v
Is there a Skill for it?
  YES --> Use Skill (STOP)
  |
  NO
  v
Is there relationship/dependency analysis needed?
  YES --> Use CodeGraphContext (CG) tools
           - query_graph: Find relationships
           - find_path: Trace connections
           - get_neighbors: Find dependents
  |
  NO
  v
Is there an MCP tool for it?
  |    - File operations? -> Desktop Commander (DC)
  |    - Code search? -> Code-Index (CI)
  |    - Process? -> Desktop Commander (DC)
  YES --> Use MCP tool (STOP)
  |
  NO
  v
Use Native tool (LAST RESORT)
```

**CG Decision Point:**
- Relationship discovery? -> CG query_graph
- Path tracing? -> CG find_path
- Dependency mapping? -> CG get_neighbors
- Impact analysis? -> CG + CI combo
- Otherwise -> Continue to DC/CI selection

---

## Common Mistakes to Avoid

### WRONG: Using Native Tools When MCP Available

```javascript
// BAD: Uses native Read tool
Read: {
  file_path: "/path/to/file.txt"
}
```

### CORRECT: Using DesktopCommander Skill

```javascript
// GOOD: Uses desktop-commander skill
skill: "desktop-commander"
```

### CORRECT: Using DesktopCommander MCP

```javascript
// GOOD: Uses DesktopCommander read_file
mcp__desktop-commander__read_file: {
  path: "/path/to/file.txt"
}
```

### WRONG: Using Bash for File Operations

```javascript
// BAD: Uses native Bash tool
Bash: {
  command: "cat /path/to/file.txt"
}
```

### CORRECT: Using DesktopCommander MCP

```javascript
// GOOD: Uses DesktopCommander read_file
mcp__desktop-commander__read_file: {
  path: "/path/to/file.txt"
}
```

### WRONG: Using Native Grep

```javascript
// BAD: Uses native Grep tool
Grep: {
  pattern: "function foo",
  path: "/src"
}
```

### CORRECT: Using Code Index MCP

```javascript
// GOOD: Uses DesktopCommander start_search
mcp__desktop-commander__start_search: {
  path: "/src",
  pattern: "function foo",
  searchType: "content"
}
```

### WRONG: Using Manual Tracing When CG Available

```javascript
// BAD: Manually tracing imports with Grep
Grep: {
  pattern: "import.*User",
  path: "/src"
}
// Then manually reading each file to trace dependencies
```

### CORRECT: Using CodeGraphContext

```javascript
// GOOD: Use CG to trace relationships
mcp__CodeGraphContext__find_path: {
  from: "src/routes/users.ts",
  to: "src/models/user.ts",
  relationship_type: "imports"
}
// Returns direct path showing import chain
```

### WRONG: Missing CG Discover Step Before Multi-File Changes

```javascript
// BAD: Skip relationship discovery, just search code
mcp__code-index-mcp__search_code_advanced: {
  pattern: "User.authenticate"
}
// Misses indirect dependencies
```

### CORRECT: Full Golden Pattern with CG Discover

```javascript
// GOOD: Start with CG discover
mcp__CodeGraphContext__query_graph: {
  query: "files affected by User.authenticate changes",
  depth: 2
}
// Then proceed with CI understand, DC act, etc.
```

### WRONG: Using CI for Relationship Queries

```javascript
// BAD: Multiple CI searches to find dependencies
mcp__code-index-mcp__search_code_advanced: {
  pattern: "import.*ModuleA"
}
// Repeat for ModuleB, ModuleC, etc.
```

### CORRECT: Single CG Query

```javascript
// GOOD: One CG query finds all relationships
mcp__CodeGraphContext__get_neighbors: {
  node: "src/modules/ModuleA.ts",
  direction: "both",
  max_depth: 2
}
// Returns all incoming and outgoing dependencies
```

---

## Golden Pattern Integration

The **Golden Pattern** (CG -> CI -> CI -> DC -> DC -> CI) demonstrates optimal three-server workflow for complex changes.

### Pattern Flow

| Step | Server | Tool | Purpose |
|------|--------|------|---------|
| 1 | CG | query_graph | Discover affected files, map dependencies |
| 2 | CI | search_code_advanced | Understand existing patterns |
| 3 | CI | get_symbol_body | Deep dive into implementation |
| 4 | DC | edit_block/write_file | Act on files based on analysis |
| 5 | DC | read_file | Verify changes applied correctly |
| 6 | CI | search_code_advanced | Verify integration complete |

### Token Efficiency

**Golden Pattern Total:** ~33,000 tokens
**Native Equivalent:** ~240,000 tokens
**Savings:** ~86%

### When to Use Golden Pattern

**Use Golden Pattern when:**
- Multi-file refactors affecting dependencies (5+ files)
- Breaking API changes
- Security-critical modifications
- Architecture modifications
- Adding features across multiple modules

**Use simpler patterns when:**
- Single file edit -> DC-only (Patterns 1-3)
- Code search only -> CI-only (Patterns 4-6)
- Relationship query only -> CG-only (Patterns 7-8)
- Understand then edit -> CI -> DC (Patterns 11-12)
- Edit then analyze -> DC -> CI (Patterns 9-10)

**For detailed golden pattern documentation:** See GOLDEN-PATTERN.md

---

## Tool Selection Examples

### Example 1: Reading Multiple Files

**Bad (Native):**
```
Read: file1.txt
Read: file2.txt
Read: file3.txt
= ~45K tokens protocol overhead
```

**Good (DesktopCommander MCP):**
```
mcp__desktop-commander__read_multiple_files: {
  paths: ["file1.txt", "file2.txt", "file3.txt"]
}
= ~5K tokens protocol overhead
```

**Best (DesktopCommander Skill):**
```
skill: "desktop-commander"
with context: "Read file1.txt, file2.txt, file3.txt"
= ~1K tokens protocol overhead
```

### Example 2: Searching Code

**Bad (Native Grep):**
```
Grep: {
  pattern: "async function",
  path: "/src",
  type: "js"
}
= ~15K tokens protocol overhead
```

**Good (Code Index MCP):**
```
mcp__code-index-mcp__search_code_advanced: {
  pattern: "async function",
  file_pattern: "*.js"
}
= ~3K tokens protocol overhead
```

### Example 3: Code Review

**Bad (Manual Analysis):**
```
Read all files
Manually analyze
Write detailed review
= ~100K tokens + time
```

**Good (Code Review Expert Skill):**
```
skill: "code-review-expert"
with context: "Review changes in /src"
= ~10K tokens (compressed)
```

### Example 4: Relationship Analysis (CG)

**Bad (Manual Multi-File):**
```
Grep for "functionName" across all files
Manually trace imports
Analyze call chains
= ~50K tokens + time
```

**Good (CodeGraphContext MCP):**
```
CG query: "Find all callers of functionName"
= ~5K tokens with complete relationship graph
```

**CG Server:** neo4j://localhost:7687

### Example 5: Multi-file Refactor with Relationship Awareness (Golden Pattern)

**Bad (Native + Manual):**
```
Grep: find imports ~60K tokens
Read: 15 files ~90K tokens
Edit: native Edit ~50K tokens
Grep: verify ~60K tokens
= ~260K tokens total
```

**Good (Golden Pattern - CG -> CI -> CI -> DC -> DC -> CI):**
```
CG query_graph ~5K tokens
CI search + summary ~12K tokens
CI get_symbol_body ~8K tokens
DC edit_block ~6K tokens
DC read_file ~4K tokens
CI search_verify ~8K tokens
= ~43K tokens total

Savings: ~83%
```

### Example 6: Relationship Discovery Before Changes

**Bad (Manual Tracing):**
```
Grep: find "import.*User" ~20K tokens
Read: each file ~45K tokens
Manual: trace dependencies ~30K tokens
= ~95K tokens (and still incomplete)
```

**Good (CG Query):**
```
CG query_graph ~4K tokens
CG get_neighbors ~3K tokens
= ~7K tokens with complete relationship map

Savings: ~93%
```

---

## Token Optimization Metrics

### Token Savings Per Tool Level

| Tool Level | Token Savings | Reason |
|------------|---------------|---------|
| Skill Tools | 80-90% | Pre-compressed prompts |
| Desktop Commander MCP | 50-70% | Efficient protocol |
| Other MCP Tools | 30-50% | Standard MCP protocol |
| Native Tools | 0% | Baseline |

### Token Cost Comparison Table

| Operation | Native Cost | MCP Cost | Savings | Best Tool |
|-----------|-------------|-----------|----------|------------|
| Read 10 files | ~45K tokens | ~5K tokens | 89% | desktop-commander skill |
| Search code | ~15K tokens | ~3K tokens | 80% | code-index-mcp |
| Code review | ~100K tokens | ~10K tokens | 90% | code-review-expert skill |
| Directory listing | ~8K tokens | ~2K tokens | 75% | list_directory MCP |

### Batching Benefits

- **Multiple file reads:** Use `mcp__desktop-commander__read_multiple_files`
- **Multiple searches:** Batch queries when possible
- **Parallel operations:** Use appropriate patterns from TOOL-CHAIN-PATTERNS.md

---

## Monitoring and Compliance

### Auto-Validation System

The auto-validation system will check:

1. **Tool Selection:** Were MCP tools used when available?
2. **Batching:** Could operations have been batched?
3. **Efficiency:** Is there a more token-efficient approach?

### Agent Behavior

All agents MUST:

1. **Check Skills First** - Always look for relevant skill before using MCP
2. **Check MCP Second** - Always look for MCP tool before using native
3. **Document Decision** - If using native tool, explain why no alternative
4. **Optimize Calls** - Batch operations when possible
5. **Iterate Quickly** - Don't repeat expensive patterns

### Prohibited Behaviors

1. **NEVER** use native tools when MCP/skill available
2. **NEVER** bypass validation without explicit override
3. **NEVER** skip code review for production code
4. **NEVER** ignore token optimization opportunities

### Validation Failure Response

If agent uses native tool when MCP available:

1. **Warning** - First time: educational feedback
2. **Correction** - Second time: automatic tool substitution
3. **Training** - Third time: update agent prompt with rule reinforcement

---

## Enforcement

### Default Behavior

- **Strict mode:** ENFORCED (native tools rejected if MCP/skill available)
- **Fallback timeout:** 30 seconds (before allowing native tool)
- **Batch size:** 10 operations (before auto-batching)

### Override Mechanism

Agent can override with justification:
```javascript
{
  tool: "Native",
  reason: "MCP tool unavailable for specific feature X",
  expected_savings: "0 tokens (no alternative)"
}
```

---

## Metrics and Monitoring

### Track

- **Skill usage rate** vs MCP vs Native
- **Token savings** per operation type
- **Agent compliance** rate
- **Common violation** patterns

### Goals

- **90%+** skill usage where available
- **95%+** MCP usage where skill unavailable
- **<5%** native tool usage (only true fallbacks)
- **80%+** overall token savings

---

## Quick Reference Card

### File Operations
```
Read/Write/Edit --> desktop-commander skill
List/Search --> desktop-commander skill
Info/Meta --> desktop-commander skill
```

### Process Operations
```
Start/Interact --> desktop-commander skill
List/Kill --> desktop-commander skill
```

### Code Operations
```
Review --> code-review-expert skill
Search --> code-index-mcp (CI)
Symbols --> code-index-mcp (CI)
Relationships --> CodeGraphContext (CG) at neo4j://localhost:7687
```

### Relationship Operations (NEW)
```
Graph Query --> CodeGraphContext (CG)
Find Path --> CodeGraphContext (CG)
Neighbors --> CodeGraphContext (CG)
Impact Analysis --> CG + CI combo
```

### Analysis
```
Thinking --> sequential-thinking skill
Logic --> tractatus-thinking skill
Debug --> debug-thinking skill
Docs --> context7/deepwiki MCP
```

### Complex Workflows
```
Multi-file refactor --> Golden Pattern (CG -> CI -> CI -> DC -> DC -> CI)
Dependency impact --> CG query + CI search
Quick edit --> DC act + CI verify
Relationship discovery --> CG-only (Patterns 7-8)
```

### Server Summary
```
DC (Desktop Commander) --> Files, Processes, Directories
CI (Code-Index) --> Search, Symbols, File Analysis
CG (CodeGraphContext) --> Relationships, Dependencies, Paths
Skills --> Compressed workflows (code-review, thinking)
Native --> Last resort only
```

---

## All Three MCP Servers

| Server | Purpose | Connection |
|--------|---------|------------|
| DC (Desktop Commander) | File/Process operations | MCP server |
| CI (Code-Index) | Code search/symbol navigation | MCP server |
| CG (CodeGraphContext) | Relationship analysis | neo4j://localhost:7687 |

---

## Configuration

### Compliance Tracking

Edit `.planning/config.json`:

```json
{
  "tool_priority": {
    "strict_mode": true,
    "fallback_timeout_ms": 30000,
    "batch_size": 10,
    "compliance_tracking": true
  }
}
```

### Rate Limiting

Edit `.planning/config.json`:

```json
{
  "rate_limiting": {
    "enabled": true,
    "stagger_delay_ms": 500,
    "max_retries": 5,
    "initial_backoff_ms": 1000
  }
}
```

---

## MEMORIZE

**Skills → MCP → Native**

This is the tool priority hierarchy. Follow it always.

---

*Version: 1.1*
*Last Updated: 2026-02-12*
*Purpose: Enforce MCP tool usage for GSD workflows*
*Target: 80-90% token savings across all GSD operations*
*MCP Servers: DC, CI, CG (neo4j://localhost:7687)*
