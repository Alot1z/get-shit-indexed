# GSI Tool Selection Guide

**Version:** 1.0  
**Created:** 2026-02-19  
**Purpose:** Situation-specific tool guidance for all GSI agents

---

## Overview

This guide provides tool selection decision trees for each GSI agent. Use this to optimize token usage and ensure consistent tool selection across all workflows.

## Tool Priority Hierarchy

```
1. MCP Tools (80-90% token savings)
   ├── Desktop Commander (mcp__desktop-commander__*)
   ├── Code-Index MCP (mcp__code-index-mcp__*)
   └── CodeGraphContext (mcp__CodeGraphContext__*)
   
2. Thinking Servers (Cognitive Enhancement)
   ├── Sequential Thinking (mcp__sequential-thinking__*)
   ├── Tractatus Thinking (mcp__tractatusthinking__*)
   └── Debug Thinking (mcp__debug-thinking__*)
   
3. External Knowledge
   ├── Context7 (mcp__context7__*)
   └── DeepWiki (mcp__deepwiki__*)
   
4. Orchestration
   └── Task (subagent spawning)

NEVER USE: Native tools (Bash, Read, Write, Edit, Grep, Glob)
```

---

## Agent-Specific Tool Guides

### GSI-planner

**Primary Role:** Creates executable phase plans with task breakdown

**Essential Tools:**
| Task | Tool | Token Savings |
|------|------|---------------|
| Read existing plans | `mcp__desktop-commander__read_multiple_files` | 80-90% |
| Write PLAN.md | `mcp__desktop-commander__write_file` | 50-70% |
| Check project state | `mcp__code-index-mcp__search_code_advanced` | 80% |
| Find dependencies | `mcp__CodeGraphContext__analyze_code_relationships` | 70% |
| Library docs | `mcp__context7__get-library-docs` | N/A |

**Thinking Integration:**
- **Tractatus** (Primary): Structural analysis of phase requirements
- **Sequential** (Secondary): Task breakdown and sequencing

**Workflow Pattern:**
```
1. Load context → read_multiple_files (batch)
2. Analyze structure → tractatus_thinking
3. Create tasks → sequentialthinking
4. Write plan → write_file
```

---

### GSI-executor

**Primary Role:** Executes PLAN.md files atomically with per-task commits

**Essential Tools:**
| Task | Tool | Token Savings |
|------|------|---------------|
| Read plan + context | `mcp__desktop-commander__read_multiple_files` | 80-90% |
| Write code | `mcp__desktop-commander__write_file` | 50-70% |
| Edit existing code | `mcp__desktop-commander__edit_block` | 60-80% |
| Run commands | `mcp__desktop-commander__start_process` | N/A |
| Search code | `mcp__code-index-mcp__search_code_advanced` | 80% |

**Thinking Integration:**
- **Sequential** (Primary): Task execution planning and deviation handling

**Workflow Pattern:**
```
1. Load plan → read_multiple_files
2. Plan execution → sequentialthinking
3. Execute task → write_file/edit_block + start_process
4. Verify → start_process (tests)
5. Commit → start_process (git)
```

---

### GSI-verifier

**Primary Role:** Verifies phase goal achievement through goal-backward analysis

**Essential Tools:**
| Task | Tool | Token Savings |
|------|------|---------------|
| Read summaries | `mcp__desktop-commander__read_multiple_files` | 80-90% |
| Find artifacts | `mcp__code-index-mcp__find_files` | 70% |
| Search patterns | `mcp__code-index-mcp__search_code_advanced` | 80% |
| Get symbol body | `mcp__code-index-mcp__get_symbol_body` | 85% |
| Write report | `mcp__desktop-commander__write_file` | 50-70% |

**Thinking Integration:**
- **Tractatus** (Primary): Structural verification
- **Sequential** (Secondary): Verification step sequencing

**Workflow Pattern:**
```
1. Load must-haves → read_multiple_files
2. Find artifacts → find_files + search_code_advanced
3. Verify implementation → get_symbol_body + search_code_advanced
4. Check wiring → analyze_code_relationships
5. Write report → write_file
```

---

### GSI-debugger

**Primary Role:** Investigates bugs using scientific method

**Essential Tools:**
| Task | Tool | Token Savings |
|------|------|---------------|
| Read code | `mcp__desktop-commander__read_file` | 50-70% |
| Search error patterns | `mcp__code-index-mcp__search_code_advanced` | 80% |
| Run tests | `mcp__desktop-commander__start_process` | N/A |
| Edit fix | `mcp__desktop-commander__edit_block` | 60-80% |
| Write debug file | `mcp__desktop-commander__write_file` | 50-70% |

**Thinking Integration:**
- **Debug-thinking** (Primary): Hypothesis formation and evidence tracking

**Workflow Pattern:**
```
1. Create debug file → write_file
2. Gather evidence → search_code_advanced + read_file
3. Form hypothesis → debug_thinking
4. Test hypothesis → start_process
5. Apply fix → edit_block
6. Archive session → write_file
```

---

### GSI-codebase-mapper

**Primary Role:** Explores codebase and writes structured analysis documents

**Essential Tools:**
| Task | Tool | Token Savings |
|------|------|---------------|
| List directories | `mcp__desktop-commander__list_directory` | 70% |
| Read configs | `mcp__desktop-commander__read_multiple_files` | 80-90% |
| Find patterns | `mcp__code-index-mcp__search_code_advanced` | 80% |
| Analyze relationships | `mcp__CodeGraphContext__analyze_code_relationships` | 70% |
| Find complexity | `mcp__CodeGraphContext__find_most_complex_functions` | 70% |
| Write docs | `mcp__desktop-commander__write_file` | 50-70% |

**Thinking Integration:**
- **Sequential** (Primary): Exploration planning
- **Tractatus** (Secondary): Architecture analysis

**Workflow Pattern:**
```
1. Explore structure → list_directory + find_files
2. Analyze code → add_code_to_graph + analyze_code_relationships
3. Find patterns → search_code_advanced
4. Check complexity → find_most_complex_functions
5. Write docs → write_file
```

---

## Situation-Specific Tool Selection

### Situation: Reading Multiple Files

**Always use:** `mcp__desktop-commander__read_multiple_files`

```
Reading 3+ files:
  BAD: 3x Read calls = ~45K tokens
  GOOD: 1x read_multiple_files = ~5K tokens
  
Savings: 89%
```

### Situation: Searching Code Patterns

**Always use:** `mcp__code-index-mcp__search_code_advanced`

```
Finding "function auth":
  BAD: Grep = ~15K tokens
  GOOD: search_code_advanced = ~3K tokens
  
Savings: 80%
```

### Situation: Finding Files by Name

**Always use:** `mcp__code-index-mcp__find_files`

```
Finding "*.test.ts":
  BAD: Glob = ~10K tokens
  GOOD: find_files = ~3K tokens
  
Savings: 70%
```

### Situation: Extracting Symbol Implementation

**Always use:** `mcp__code-index-mcp__get_symbol_body`

```
Getting function "handleSubmit":
  BAD: Read entire file = ~20K tokens
  GOOD: get_symbol_body = ~3K tokens
  
Savings: 85%
```

### Situation: Running Shell Commands

**Always use:** `mcp__desktop-commander__start_process`

```
Running tests or git:
  BAD: Bash = ~8K tokens
  GOOD: start_process = ~2K tokens
  
Savings: 75%
```

---

## Decision Trees

### File Operations Decision Tree

```
Need to work with files?
│
├── Read files?
│   ├── Multiple files (2+)?
│   │   └── mcp__desktop-commander__read_multiple_files (BEST)
│   └── Single file?
│       └── mcp__desktop-commander__read_file
│
├── Write file?
│   └── mcp__desktop-commander__write_file
│
├── Edit existing file?
│   └── mcp__desktop-commander__edit_block
│
├── List directory?
│   └── mcp__desktop-commander__list_directory
│
└── Get file metadata?
    └── mcp__desktop-commander__get_file_info
```

### Code Search Decision Tree

```
Need to find code?
│
├── Know the file name?
│   └── mcp__code-index-mcp__find_files
│
├── Know the pattern?
│   └── mcp__code-index-mcp__search_code_advanced
│
├── Need specific function?
│   └── mcp__code-index-mcp__get_symbol_body
│
├── Need file overview?
│   └── mcp__code-index-mcp__get_file_summary
│
└── Need relationship info?
    └── mcp__CodeGraphContext__analyze_code_relationships
```

### Thinking Server Decision Tree

```
Need cognitive enhancement?
│
├── Step-by-step reasoning?
│   └── mcp__sequential-thinking__sequentialthinking
│
├── Structural/logical analysis?
│   └── mcp__tractatusthinking__tractatus_thinking
│
└── Debugging/investigation?
    └── mcp__debug-thinking__debug_thinking
```

---

## Token Savings Summary

| Operation | Native | MCP | Savings |
|-----------|--------|-----|---------|
| Read 3 files | 45K | 5K | 89% |
| Read 10 files | 150K | 15K | 90% |
| Search code | 15K | 3K | 80% |
| Find files | 10K | 3K | 70% |
| Get symbol | 20K | 3K | 85% |
| File summary | 20K | 2K | 90% |
| Edit block | 15K | 5K | 67% |
| List directory | 8K | 2.5K | 69% |

**Average Savings: 80%**

---

## Common Anti-Patterns to Avoid

### Anti-Pattern 1: Sequential Reads

```javascript
// BAD: Sequential reads
mcp__desktop-commander__read_file({ path: "file1.md" })
mcp__desktop-commander__read_file({ path: "file2.md" })
mcp__desktop-commander__read_file({ path: "file3.md" })
// 3x protocol overhead

// GOOD: Batch read
mcp__desktop-commander__read_multiple_files({
  paths: ["file1.md", "file2.md", "file3.md"]
})
// 1x protocol overhead, 80%+ savings
```

### Anti-Pattern 2: Native Tools

```javascript
// NEVER DO THIS:
Read: { file_path: "..." }
Write: { file_path: "...", content: "..." }
Bash: { command: "..." }
Grep: { pattern: "..." }
Glob: { pattern: "..." }
```

### Anti-Pattern 3: Reading Entire File for Symbol

```javascript
// BAD: Read entire file
Read: { file_path: "large-file.ts" }
// Then search manually

// GOOD: Extract symbol directly
mcp__code-index-mcp__get_symbol_body({
  file_path: "large-file.ts",
  symbol_name: "targetFunction"
})
```

---

## Module Registry Integration

All tools should register their usage patterns with the module registry:

```javascript
// In lib/tool-optimization/tool-registry.js
{
  module: "tool-optimization",
  tools: {
    "read_multiple_files": { savings: "80-90%", priority: 1 },
    "search_code_advanced": { savings: "80%", priority: 1 },
    "find_files": { savings: "70%", priority: 1 },
    "get_symbol_body": { savings: "85%", priority: 1 }
  }
}
```

---

## Version History

- v1.0 (2026-02-19): Initial tool selection guide
  - Agent-specific tool guides
  - Situation-specific decision trees
  - Token savings documentation
  - Anti-pattern warnings
