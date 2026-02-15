# MCP Tool Reference

## Overview

This document provides a complete reference for MCP tools used in GSI workflows, including token savings and usage patterns.

## MCP Servers

| Server | Prefix | Purpose | Token Savings |
|--------|--------|---------|---------------|
| Desktop Commander | `mcp__desktop-commander__` | File/process operations | 50-90% |
| Code-Index MCP | `mcp__code-index-mcp__` | Code search/navigation | 70-80% |
| CodeGraphContext | `mcp__CodeGraphContext__` | Architecture/relationships | 85-95% |

---

## Desktop Commander (DC)

### File Operations

#### read_file
Read single file content.
```javascript
mcp__desktop-commander__read_file({
  path: "/absolute/path/to/file.md"
})
```
**Token Savings:** 50-70% vs native Read

#### read_multiple_files
Read multiple files in one call - MAXIMUM EFFICIENCY.
```javascript
mcp__desktop-commander__read_multiple_files({
  paths: [
    "/absolute/path/to/file1.md",
    "/absolute/path/to/file2.md",
    "/absolute/path/to/file3.md"
  ]
})
```
**Token Savings:** 80-90% vs sequential native Read calls

#### write_file
Write content to file with chunking support.
```javascript
mcp__desktop-commander__write_file({
  path: "/absolute/path/to/file.md",
  content: "file content here",
  mode: "rewrite" // or "append"
})
```
**Token Savings:** 50-70% vs native Write

#### edit_block
Surgical text replacement in files.
```javascript
mcp__desktop-commander__edit_block({
  file_path: "/absolute/path/to/file.md",
  old_string: "text to replace",
  new_string: "replacement text",
  expected_replacements: 1
})
```
**Token Savings:** 60-80% vs native Edit

#### list_directory
List directory contents with depth control.
```javascript
mcp__desktop-commander__list_directory({
  path: "/absolute/path/to/dir",
  depth: 2
})
```
**Token Savings:** 70% vs native Bash ls

#### get_file_info
Get file metadata (size, dates, line count).
```javascript
mcp__desktop-commander__get_file_info({
  path: "/absolute/path/to/file.md"
})
```
**Token Savings:** 70% vs native Bash stat

### Process Operations

#### start_process
Start terminal process with smart detection.
```javascript
mcp__desktop-commander__start_process({
  command: "git status",
  timeout_ms: 30000
})
```

#### interact_with_process
Send input to running process.
```javascript
mcp__desktop-commander__interact_with_process({
  pid: 12345,
  input: "command to send"
})
```

#### list_processes
List all running processes.
```javascript
mcp__desktop-commander__list_processes({})
```

### Search Operations

#### start_search
Start streaming file/content search.
```javascript
mcp__desktop-commander__start_search({
  path: "/absolute/path/to/search",
  pattern: "search_term",
  searchType: "content", // or "files"
  filePattern: "*.md"
})
```

---

## Code-Index MCP (CI)

### Search Operations

#### search_code_advanced
Search code with pattern matching.
```javascript
mcp__code-index-mcp__search_code_advanced({
  pattern: "function_name",
  file_pattern: "*.ts",
  max_results: 10,
  regex: false
})
```
**Token Savings:** 80% vs native Grep

#### find_files
Find files matching glob pattern.
```javascript
mcp__code-index-mcp__find_files({
  pattern: "*.md"
})
```
**Token Savings:** 70% vs native Glob

### Symbol Navigation

#### get_symbol_body
Get source code of specific symbol.
```javascript
mcp__code-index-mcp__get_symbol_body({
  file_path: "/absolute/path/to/file.ts",
  symbol_name: "functionName"
})
```
**Token Savings:** 85% vs reading entire file

#### get_file_summary
Get file overview (imports, functions, complexity).
```javascript
mcp__code-index-mcp__get_file_summary({
  file_path: "/absolute/path/to/file.ts"
})
```
**Token Savings:** 90% vs reading entire file

### Index Management

#### build_deep_index
Build complete symbol index for project.
```javascript
mcp__code-index-mcp__build_deep_index({})
```

#### set_project_path
Set base project path for indexing.
```javascript
mcp__code-index-mcp__set_project_path({
  path: "/absolute/project/path"
})
```

#### refresh_index
Refresh file index after changes.
```javascript
mcp__code-index-mcp__refresh_index({})
```

---

## CodeGraphContext (CG)

### Relationship Analysis

#### analyze_code_relationships
Analyze code relationships (callers, callees, hierarchy).
```javascript
mcp__CodeGraphContext__analyze_code_relationships({
  query_type: "find_all_callers", // find_callees, class_hierarchy, etc.
  target: "function_name",
  context: "/optional/file/path"
})
```
**Token Savings:** 90% vs manual analysis

**Query Types:**
- `find_callers` - Direct callers of function
- `find_callees` - Direct callees of function
- `find_all_callers` - Transitive callers
- `find_all_callees` - Transitive callees
- `find_importers` - Files importing module
- `class_hierarchy` - Class inheritance tree
- `overrides` - Method overrides
- `dead_code` - Unused functions
- `call_chain` - Path between functions
- `module_deps` - Module dependencies

#### find_code
Find code snippets by keyword.
```javascript
mcp__CodeGraphContext__find_code({
  query: "authentication"
})
```

#### find_most_complex_functions
Find highest complexity functions.
```javascript
mcp__CodeGraphContext__find_most_complex_functions({
  limit: 10
})
```

#### find_dead_code
Find potentially unused functions.
```javascript
mcp__CodeGraphContext__find_dead_code({
  exclude_decorated_with: ["@app.route"]
})
```

### Graph Operations

#### execute_cypher_query
Run custom Cypher query.
```javascript
mcp__CodeGraphContext__execute_cypher_query({
  cypher_query: "MATCH (f:Function) RETURN f.name LIMIT 10"
})
```

#### visualize_graph_query
Generate visualization URL for query.
```javascript
mcp__CodeGraphContext__visualize_graph_query({
  cypher_query: "MATCH (f:Function)-[:CALLS]->(g:Function) RETURN f, g LIMIT 20"
})
```

### Repository Management

#### add_code_to_graph
Index repository into graph.
```javascript
mcp__CodeGraphContext__add_code_to_graph({
  path: "/absolute/repo/path",
  is_dependency: false
})
```

#### list_indexed_repositories
List all indexed repositories.
```javascript
mcp__CodeGraphContext__list_indexed_repositories({})
```

#### get_repository_stats
Get statistics for repository.
```javascript
mcp__CodeGraphContext__get_repository_stats({
  repo_path: "/absolute/repo/path"
})
```

---

## Decision Tree

```
What operation do you need?

├── Read files?
│   ├── Multiple files? → mcp__desktop-commander__read_multiple_files (80-90% savings)
│   ├── Single file? → mcp__desktop-commander__read_file (50-70% savings)
│   └── Get symbol only? → mcp__code-index-mcp__get_symbol_body (85% savings)
│
├── Write/Edit files?
│   ├── New file? → mcp__desktop-commander__write_file (50-70% savings)
│   ├── Edit existing? → mcp__desktop-commander__edit_block (60-80% savings)
│   └── NOT: Native Write/Edit tools
│
├── Search code?
│   ├── Pattern in files? → mcp__code-index-mcp__search_code_advanced (80% savings)
│   ├── Find files by name? → mcp__code-index-mcp__find_files (70% savings)
│   ├── Find keyword? → mcp__CodeGraphContext__find_code (85% savings)
│   └── NOT: Native Grep/Glob tools
│
├── Analyze relationships?
│   ├── Call chain? → mcp__CodeGraphContext__analyze_code_relationships (90% savings)
│   ├── Class hierarchy? → mcp__CodeGraphContext__analyze_code_relationships
│   ├── Dependencies? → mcp__CodeGraphContext__analyze_code_relationships
│   └── NOT: Manual analysis
│
├── Run commands?
│   ├── Start process? → mcp__desktop-commander__start_process
│   ├── Interact with process? → mcp__desktop-commander__interact_with_process
│   └── List processes? → mcp__desktop-commander__list_processes
│
└── Need file metadata?
    ├── File info? → mcp__desktop-commander__get_file_info (70% savings)
    ├── Directory list? → mcp__desktop-commander__list_directory (70% savings)
    └── File summary? → mcp__code-index-mcp__get_file_summary (90% savings)
```

---

## Token Savings Summary

| Operation Category | Native Tokens | MCP Tokens | Savings |
|--------------------|---------------|------------|---------|
| Read 3 files | ~45,000 | ~5,000 | 89% |
| Read 10 files | ~150,000 | ~15,000 | 90% |
| Search code pattern | ~15,000 | ~3,000 | 80% |
| Find file by name | ~10,000 | ~3,000 | 70% |
| Analyze call chain | ~50,000 | ~5,000 | 90% |
| Get symbol body | ~20,000 | ~3,000 | 85% |
| Edit file block | ~15,000 | ~5,000 | 67% |
| List directory | ~8,000 | ~2,500 | 69% |

**Average Token Savings: 80-90%**

---

## Common Patterns

### Pattern 1: Reading Multiple Context Files
```javascript
// Before: Sequential native reads (45K tokens)
Read: file1.md
Read: file2.md
Read: file3.md

// After: Batch MCP read (5K tokens)
mcp__desktop-commander__read_multiple_files({
  paths: ["file1.md", "file2.md", "file3.md"]
})
```

### Pattern 2: Finding Function Callers
```javascript
// Before: Manual search (50K tokens)
Grep: "function_name"
Read: each file found
Analyze: manually

// After: CG relationship query (5K tokens)
mcp__CodeGraphContext__analyze_code_relationships({
  query_type: "find_all_callers",
  target: "function_name"
})
```

### Pattern 3: Code Search + File Read
```javascript
// Before: Two operations (25K tokens)
Grep: "pattern"
Read: found_file.md

// After: CI search (5K tokens)
mcp__code-index-mcp__search_code_advanced({
  pattern: "pattern",
  max_results: 5,
  context_lines: 10  // Includes context, may not need file read
})
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Sequential Reads
```javascript
// BAD: Sequential reads
mcp__desktop-commander__read_file({ path: "file1.md" })
mcp__desktop-commander__read_file({ path: "file2.md" })
mcp__desktop-commander__read_file({ path: "file3.md" })
// Result: 3× overhead

// GOOD: Batch read
mcp__desktop-commander__read_multiple_files({
  paths: ["file1.md", "file2.md", "file3.md"]
})
// Result: 1× overhead, 80%+ savings
```

### Anti-Pattern 2: Native Tools When MCP Available
```javascript
// BAD: Native Read
Read: { file_path: "/path/to/file.md" }
// Overhead: ~15K tokens

// GOOD: MCP read
mcp__desktop-commander__read_file({ path: "/path/to/file.md" })
// Overhead: ~5K tokens
```

### Anti-Pattern 3: Manual Analysis
```javascript
// BAD: Read all files, analyze manually
Read: file1.ts
Read: file2.ts
Read: file3.ts
// Then manually trace call chain

// GOOD: Use CG for analysis
mcp__CodeGraphContext__analyze_code_relationships({
  query_type: "call_chain",
  target: "start_function"
})
```

---

## Server Status

### Checking Server Availability
```javascript
// Check DC
mcp__desktop-commander__get_config({})

// Check CI
mcp__code-index-mcp__get_settings_info({})

// Check CG
mcp__CodeGraphContext__list_indexed_repositories({})
```

### Server Connection Details
- **Desktop Commander:** Local process, always available
- **Code-Index MCP:** Local process, requires `set_project_path`
- **CodeGraphContext:** Neo4j at `neo4j://localhost:7687`

---

**Version:** 1.0  
**Last Updated:** 2026-02-15  
**Status:** Active
