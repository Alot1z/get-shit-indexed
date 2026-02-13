# Code-Index MCP (CI) Usage Guide

**Created:** 2026-02-13
**Purpose:** Comprehensive reference for Code-Index MCP server usage

---

## Quick Reference

The Code-Index MCP (CI) server provides fast, token-efficient code search and symbol navigation.

### Tool Categories (18 tools total)

| Category | Tools | Purpose |
|----------|-------|---------|
| **Search** | 4 tools | Find code patterns, files, content |
| **Symbol** | 3 tools | Get function/class implementations, file analysis |
| **Index** | 5 tools | Build, refresh, and manage code index |
| **Watcher** | 3 tools | Auto-index on file changes |
| **Utility** | 3 tools | Settings, temp directory, search tool detection |

### Tool Inventory

**Search Tools (4):**
- `search_code_advanced` - Regex search with context
- `find_files` - Glob-style file pattern matching
- `refresh_search_tools` - Re-detect CLI tools (ripgrep, ugrep, ag)
- `start_search` - Streaming search (Desktop Commander, not CI)

**Symbol Tools (3):**
- `get_symbol_body` - Extract function/class code
- `get_file_summary` - File analysis (line count, functions, classes, imports)
- `get_file_watcher_status` - Index statistics and state

**Index Tools (5):**
- `set_project_path` - Set project root for indexing
- `build_deep_index` - Full symbol extraction
- `refresh_index` - Manual rebuild after git operations
- `get_settings_info` - Server configuration and statistics
- `check_temp_directory` - Verify index storage location

**File Watcher Tools (3):**
- `configure_file_watcher` - Enable/disable/configure auto-rebuild
- `get_file_watcher_status` - Statistics and state
- `create_temp_directory` - Initialize index storage

**Utility Tools (3):**
- `clear_settings` - Reset all settings
- `get_settings_info` - View current configuration
- `check_temp_directory` - Verify temp directory

---

## Token Efficiency

Code-Index MCP provides **80-81% token savings** compared to native Grep/Glob tools (per MCP-TOKEN-BENCHMARK.md).

### Comparison

| Operation | CI Tool | Native Tool | Token Savings |
|-----------|---------|-------------|---------------|
| Code Search | search_code_advanced | Grep | **~80%** |
| File Search | find_files | Glob | **~90%** |
| Symbol Lookup | get_symbol_body | Grep + Read | **~85%** |
| File Analysis | get_file_summary | Manual analysis | **~75%** |

**Overall Token Savings:** 80-90% for CI tools vs native equivalents

---

## When to Use Code-Index MCP

### Use CI When:

- **Finding where code exists** - Function definitions, usage patterns, imports
- **Understanding file structure** - Function lists, class definitions, imports
- **Searching for patterns** - Regex patterns across codebase
- **Getting symbol implementations** - Function/class code with signatures
- **Analyzing complexity** - Line counts, function complexity, imports

### Don't Use CI When:

- **Simple file read** - Use Desktop Commander (DC)
- **File modifications** - Use Desktop Commander (DC)
- **Process execution** - Use Desktop Commander (DC)
- **Relationship analysis** - Use CodeGraphContext (CG)

### Quick Decision

```
Need to search/code analysis? → YES → Use CI
Need to modify files? → Use DC
Need relationships? → Use CG
```

---

## Guide Structure

This guide is organized as follows:

1. **Search Tools** - Finding code and files
2. **Symbol Tools** - Getting implementations and file analysis
3. **Index Tools** - Setting up and maintaining the index
4. **File Watcher Tools** - Auto-indexing configuration
5. **Decision Tree** - Tool selection guidance
6. **Troubleshooting** - Common issues and solutions
7. **Golden Pattern Integration** - CI tools in golden pattern context


## Search Tools

Search tools find code patterns, files, and content across your codebase.

### search_code_advanced

**Purpose:** Search code content with regex support and context

**Use when:** Finding function definitions, usage patterns, imports, or any code pattern

**Parameters:**
- `pattern` (string, required) - Search string or regex pattern
- `file_pattern` (string, optional) - Filter to *.js, *.ts, *.py, etc.
- `context_lines` (number, optional, default 0) - Lines before/after match
- `regex` (boolean, optional, default true) - Enable regex mode
- `case_sensitive` (boolean, optional, default true) - Case matching
- `start_index` (number, optional, default 0) - Pagination start
- `max_results` (number, optional, default 10) - Max results to return
- `fuzzy` (boolean, optional, default false) - Fuzzy matching (ugrep only)
- `literal_search` (boolean, optional, default false) - Exact string match

**Example:**
```yaml
mcp__code-index-mcp__search_code_advanced:
  pattern: "async function.*auth"
  file_pattern: "*.ts"
  context_lines: 3
  regex: true
```

**Token savings:** ~80% vs native Grep

**Gotcha:** Requires built index - run `build_deep_index` first

**Best practices:**
- Start with specific `file_pattern` to reduce search space
- Use `context_lines: 3` to see surrounding code
- Set `case_sensitive: false` for broader searches
- Use `literal_search: true` when searching for special characters

---

### find_files

**Purpose:** Find files by name pattern using glob-style matching

**Use when:** Finding all files matching a pattern (e.g., all test files, all configs)

**Parameters:**
- `pattern` (string, required) - Glob pattern (*.js, **/*.test.ts, etc.)

**Example:**
```yaml
mcp__code-index-mcp__find_files:
  pattern: "*.test.ts"
```

**Token savings:** ~90% vs native Glob

**Gotcha:** Only searches file names, not file contents

**Best practices:**
- Use specific patterns: `*.test.ts` instead of `*test*`
- Use `**/*.config.js` for recursive searches
- Combine with `search_code_advanced` for content filtering

---

### refresh_search_tools

**Purpose:** Re-detect available CLI search tools (ripgrep, ugrep, ag, grep)

**Use when:** After installing new search tools, or if searches aren't working

**Parameters:** None

**Example:**
```yaml
mcp__code-index-mcp__refresh_search_tools: {}
```

**Returns:** List of detected search tools with priority order

**Best practices:**
- Run after installing ugrep, ripgrep, or ag
- Restart server if tools not detected
- ugrep is recommended for fuzzy search support

---

### Search Tool Selection

| Need | Tool | Example |
|------|------|---------|
| Find code pattern | search_code_advanced | `pattern: "useState"` |
| Find test files | find_files | `pattern: "*.test.ts"` |
| Search with context | search_code_advanced | `context_lines: 3` |
| Exact string match | search_code_advanced | `literal_search: true` |
| Fuzzy search | search_code_advanced | `fuzzy: true` (ugrep only) |



## Symbol Tools

Symbol tools extract function/class implementations and analyze file structure.

### get_symbol_body

**Purpose:** Extract function/class implementation with metadata

**Use when:** Understanding exact implementation before modifying, finding call sites

**Golden Pattern Step:** CI understand (Step 3) - Deep dive

**Parameters:**
- `file_path` (string, required) - Path to file containing symbol
- `symbol_name` (string, required) - Name of function/class to extract

**Response structure:**
```json
{
  "status": "success",
  "symbol_name": "authenticate",
  "type": "function",
  "line": 5,
  "end_line": 18,
  "code": "export async function authenticate(req, res, next) { ... }",
  "signature": "(req: Request, res: Response, next: NextFunction) => Promise<void>",
  "docstring": "Authentication middleware for protected routes",
  "called_by": ["src/routes/admin.ts", "src/routes/users.ts"]
}
```

**Example:**
```yaml
mcp__code-index-mcp__get_symbol_body:
  file_path: "src/auth/login.ts"
  symbol_name: "authenticate"
```

**Token savings:** ~85% vs manual search + read

**Use cases:**
- Extract implementation before refactoring
- Find call sites before modifying function signature
- Understand return types before using function
- Get parameter details for function calls

**Gotcha:** Symbol must be indexed - run `build_deep_index` if not found

**Best practices:**
- Use after `search_code_advanced` to narrow down location
- Check `called_by` list before modifying signatures
- Review `docstring` for usage context

---

### get_file_summary

**Purpose:** Analyze file structure and extract metadata

**Use when:** Understanding file architecture, checking complexity, identifying imports/exports

**Parameters:**
- `file_path` (string, required) - Path to file to analyze

**Response structure:**
```json
{
  "line_count": 45,
  "functions": ["handleLogin", "validateCredentials", "logout"],
  "classes": [],
  "imports": ["./models/user", "jsonwebtoken", "bcrypt"],
  "exports": ["handleLogin", "validateCredentials", "logout"],
  "complexity": "Low",
  "language": "TypeScript"
}
```

**Example:**
```yaml
mcp__code-index-mcp__get_file_summary:
  file_path: "src/routes/users.ts"
```

**Token savings:** ~75% vs manual analysis

**Use cases:**
- Quick overview of file contents
- Identify all functions before refactoring
- Check what's imported/exported
- Understand file complexity

**Gotcha:** Only analyzes supported file types (JS, TS, Python, Go, etc.)

**Best practices:**
- Use before editing to understand structure
- Check imports before adding new dependencies
- Review complexity to assess refactoring risk

---

### Symbol Tool Selection

| Need | Tool | Example |
|------|------|---------|
| Get function code | get_symbol_body | Extract implementation |
| Understand file | get_file_summary | View structure/complexity |
| Find call sites | get_symbol_body | Check called_by field |
| Check imports | get_file_summary | Review imports array |
| Get signature | get_symbol_body | Extract signature |



## Index Tools

Index tools set up, build, and maintain the code index for fast searches.

### set_project_path

**Purpose:** Set project root for indexing

**Use when:** First time setup, changing project scope

**Prerequisites:** None (run before any index operations)

**Parameters:**
- `path` (string, required) - Absolute path to project root

**Example:**
```yaml
mcp__code-index-mcp__set_project_path:
  path: "C:/github-repos/my-project"
```

**Output:** "Project path set to C:/github-repos/my-project"

**Gotcha:** Must use absolute paths, not relative

**Best practices:**
- Set to repository root (where .git is)
- Run once at start of session
- Re-set if switching projects

---

### build_deep_index

**Purpose:** Complete symbol extraction for all project files

**Use when:** First setup, after major code additions, CI initialization

**Prerequisites:** `set_project_path` must be called first

**Parameters:** None

**Example:**
```yaml
mcp__code-index-mcp__build_deep_index: {}
```

**Output:** "Built deep index for 123 files"

**Duration:** ~2 seconds for 123 files (varies by project size)

**When to re-run:**
- After git operations (pull, merge, rebase)
- After large code additions
- When symbols not found
- After switching branches

**Gotcha:** Can take 30+ seconds for very large projects (1000+ files)

**Best practices:**
- Run after `set_project_path`
- Run after major code changes
- Use `refresh_index` for smaller updates

---

### refresh_index

**Purpose:** Manual rebuild after git operations or file changes

**Use when:** Index is stale, files added/removed, git operations completed

**Parameters:** None

**Example:**
```yaml
mcp__code-index-mcp__refresh_index: {}
```

**Output:** "Index refreshed for 127 files"

**Duration:** ~1 second (faster than build_deep_index)

**When to use:**
- After git checkout, pull, merge
- After adding/removing files
- When search results seem stale
- Before starting new work session

**Gotcha:** Doesn't help if project path changed (use set_project_path)

**Best practices:**
- Run after git operations
- Use instead of build_deep_index for updates
- Run if searches return incomplete results

---

### get_settings_info

**Purpose:** View server configuration and statistics

**Use when:** Diagnostics, checking index status, verifying configuration

**Parameters:** None

**Example:**
```yaml
mcp__code-index-mcp__get_settings_info: {}
```

**Response structure:**
```json
{
  "project_path": "C:/github-repos/my-project",
  "indexed_files": 123,
  "index_status": "ready",
  "search_tool": "ugrep",
  "file_watcher_enabled": true
}
```

**Use cases:**
- Verify project path is correct
- Check how many files are indexed
- See which search tool is being used
- Check if file watcher is enabled

**Best practices:**
- Run when troubleshooting
- Check after `build_deep_index` to verify success
- Use to confirm configuration changes

---

### check_temp_directory

**Purpose:** Verify index storage location

**Use when:** Troubleshooting, checking disk space, verifying index location

**Parameters:** None

**Example:**
```yaml
mcp__code-index-mcp__check_temp_directory: {}
```

**Output:** Path to temp directory where index is stored

**Use cases:**
- Find index location for backup/debugging
- Check available disk space
- Verify index is being created

**Gotcha:** Temp directory location varies by OS

---

### Index Tool Selection

| Need | Tool | Example |
|------|------|---------|
| First time setup | set_project_path → build_deep_index | Initialize CI server |
| After git operations | refresh_index | Update index |
| Check status | get_settings_info | Verify configuration |
| Troubleshoot | check_temp_directory | Find index location |
| Major code changes | build_deep_index | Full rebuild |

### Setup Workflow

```yaml
# Step 1: Set project path
mcp__code-index-mcp__set_project_path:
  path: "C:/github-repos/my-project"

# Step 2: Build initial index
mcp__code-index-mcp__build_deep_index: {}

# Step 3: Verify success
mcp__code-index-mcp__get_settings_info: {}

# Step 4: (Optional) Enable auto-indexing
mcp__code-index-mcp__configure_file_watcher:
  enabled: true
```



## File Watcher Tools

File watcher tools enable automatic index rebuilding on file changes during development.

### configure_file_watcher

**Purpose:** Enable automatic index rebuild on file changes

**Use when:** Active development requiring always-current index

**Parameters:**
- `enabled` (boolean, optional) - Enable/disable watcher (default: current state)
- `debounce_seconds` (number, optional, default 2) - Delay before rebuild (range: 1-10)
- `observer_type` (string, optional, default "auto") - File observation backend
- `additional_exclude_patterns` (array, optional) - Extra patterns to ignore

**Observer Types:**
- `auto` - kqueue on macOS (reliable), platform default elsewhere
- `kqueue` - Force kqueue (macOS/BSD, most reliable)
- `fsevents` - Force FSEvents (macOS only, has reliability issues)
- `polling` - Cross-platform fallback (slower but compatible)

**Example:**
```yaml
mcp__code-index-mcp__configure_file_watcher:
  enabled: true
  debounce_seconds: 3
  observer_type: "auto"
  additional_exclude_patterns: ["node_modules", "*.log", "dist"]
```

**Note:** Debounce prevents excessive rebuilds during active editing

**Best practices:**
- Set `debounce_seconds: 3` during active editing
- Use `observer_type: "auto"` for best platform defaults
- Exclude build directories (node_modules, dist, build)
- Disable for very large projects if performance issues

---

### get_file_watcher_status

**Purpose:** Get file watcher statistics and current state

**Use when:** Diagnostics, checking if watcher is running, troubleshooting

**Parameters:** None

**Example:**
```yaml
mcp__code-index-mcp__get_file_watcher_status: {}
```

**Response structure:**
```json
{
  "enabled": true,
  "running": true,
  "observer_type": "kqueue",
  "debounce_seconds": 3,
  "rebuild_count": 15,
  "last_rebuild": "2026-02-13T00:15:00Z"
}
```

**Use cases:**
- Verify watcher is running
- Check how many rebuilds occurred
- See last rebuild time
- Troubleshoot why index isn't updating

---

### create_temp_directory

**Purpose:** Initialize index storage directory

**Use when:** First time setup, troubleshooting missing directory

**Parameters:** None

**Example:**
```yaml
mcp__code-index-mcp__create_temp_directory: {}
```

**Output:** Path to created temp directory

**Use cases:**
- Manual setup if auto-creation failed
- Troubleshooting index storage issues
- After deleting temp directory to reset

**Gotcha:** Usually auto-created by build_deep_index

---

### File Watcher Workflow

```yaml
# Step 1: Create temp directory (if needed)
mcp__code-index-mcp__create_temp_directory: {}

# Step 2: Configure watcher
mcp__code-index-mcp__configure_file_watcher:
  enabled: true
  debounce_seconds: 3
  observer_type: "auto"
  additional_exclude_patterns: ["node_modules", "dist"]

# Step 3: Verify watcher is running
mcp__code-index-mcp__get_file_watcher_status: {}
```

### File Watcher Selection

| Need | Tool | Example |
|------|------|---------|
| Enable auto-indexing | configure_file_watcher | Set enabled: true |
| Check watcher status | get_file_watcher_status | Verify running |
| Reset storage | create_temp_directory | Recreate temp dir |
| Adjust debounce | configure_file_watcher | Set debounce_seconds |



## Decision Tree

Use this decision tree to select the right CI tool for your task.

```
What do you need?
├─ Find where code exists?
│  ├─ Pattern search? → search_code_advanced
│  └─ File list? → find_files
├─ Get function implementation?
│  └─→ get_symbol_body
├─ Understand file structure?
│  └─→ get_file_summary
├─ Set up or fix index?
│  ├─ First time? → set_project_path → build_deep_index
│  └─ After git? → refresh_index
└─ Enable auto-indexing?
   └─→ configure_file_watcher
```

## Common Workflow Patterns

### Pattern 1: Single Search

**Use:** Quick code search
**Tools:** search_code_advanced
**Tokens:** ~5-8K

```yaml
mcp__code-index-mcp__search_code_advanced:
  pattern: "authenticate"
  file_pattern: "*.ts"
  context_lines: 3
```

---

### Pattern 2: Multi-File Analysis

**Use:** Understanding multiple related files
**Tools:** search_code_advanced + get_file_summary (batch)
**Tokens:** ~12-18K

```yaml
# Find all files
mcp__code-index-mcp__search_code_advanced:
  pattern: "middleware"
  file_pattern: "*.ts"

# Analyze each file
mcp__code-index-mcp__get_file_summary:
  file_path: "src/middleware/auth.ts"

mcp__code-index-mcp__get_file_summary:
  file_path: "src/middleware/logger.ts"
```

---

### Pattern 3: Symbol Deep Dive

**Use:** Understanding implementation before editing
**Tools:** get_symbol_body + search_code_advanced (find call sites)
**Tokens:** ~8-15K

```yaml
# Get implementation
mcp__code-index-mcp__get_symbol_body:
  file_path: "src/middleware/auth.ts"
  symbol_name: "authenticate"

# Find all usages
mcp__code-index-mcp__search_code_advanced:
  pattern: "authenticate"
  file_pattern: "*.ts"
  context_lines: 2
```

---

### Pattern 4: Setup Workflow

**Use:** First time CI server setup
**Tools:** set_project_path → build_deep_index → configure_file_watcher
**Tokens:** ~3-5K (one-time)

```yaml
# Step 1: Set project path
mcp__code-index-mcp__set_project_path:
  path: "C:/github-repos/my-project"

# Step 2: Build index
mcp__code-index-mcp__build_deep_index: {}

# Step 3: Enable auto-indexing (optional)
mcp__code-index-mcp__configure_file_watcher:
  enabled: true
  debounce_seconds: 3
```

---

### Pattern 5: Refresh Workflow

**Use:** After git operations or file changes
**Tools:** refresh_index
**Tokens:** ~2-3K

```yaml
mcp__code-index-mcp__refresh_index: {}
```

---

## Token Efficiency Summary

| Tool | Avg Tokens | Native Equivalent | Savings |
|------|-----------|-------------------|---------|
| search_code_advanced | 5-8K | 25-40K (Grep) | ~80% |
| find_files | 2-4K | 15-25K (Glob) | ~90% |
| get_symbol_body | 3-6K | 20-35K (Grep + Read) | ~85% |
| get_file_summary | 4-7K | 15-30K (Manual) | ~75% |
| build_deep_index | 8-12K | N/A (one-time) | N/A |
| refresh_index | 2-3K | N/A | N/A |

**Source:** MCP-TOKEN-BENCHMARK.md

## Cross-References

- **TOOL-CHAIN-PATTERNS.md** - All 24 tool chain patterns
- **GOLDEN-PATTERN.md** - Full golden pattern documentation (CG → CI → CI → DC → DC → CI)
- **TOOL-PRIORITY-RULES.md** - Tool selection hierarchy



## Troubleshooting

### Issue: search_code_advanced returns empty results

**Symptoms:** Search pattern known to exist returns 0 matches

**Possible Causes:**
1. Index is stale (files added/modified after last build)
2. File pattern filter too restrictive
3. Regex pattern invalid or case mismatch
4. Project path not set correctly

**Diagnostic Steps:**
1. Check index status: `get_settings_info`
2. Try broader search: remove file_pattern, set case_sensitive: false
3. Refresh index: `refresh_index`
4. Verify project: `get_settings_info` check project_path

**Resolution:**
```yaml
# Step 1: Refresh index
mcp__code-index-mcp__refresh_index: {}

# Step 2: Try broader search
mcp__code-index-mcp__search_code_advanced:
  pattern: "authenticate"
  file_pattern: "*.ts"  # instead of "src/middleware/*.ts"
  case_sensitive: false
```

---

### Issue: get_symbol_body fails with "symbol not found"

**Symptoms:** Symbol known to exist returns error or empty result

**Possible Causes:**
1. Index needs rebuild
2. Symbol name doesn't match (case, scope)
3. File path is relative instead of absolute
4. Symbol not exported/indexed

**Diagnostic Steps:**
1. Verify file path is absolute
2. Check symbol name matches exactly
3. Refresh index: `refresh_index`
4. Try search_code_advanced to find symbol location

**Resolution:**
```yaml
# Step 1: Find the symbol
mcp__code-index-mcp__search_code_advanced:
  pattern: "function authenticate"
  file_pattern: "*.ts"

# Step 2: Get symbol with correct path
mcp__code-index-mcp__get_symbol_body:
  file_path: "C:/project/src/middleware/auth.ts"  # Absolute path
  symbol_name: "authenticate"
```

---

### Issue: Index timing out on large projects

**Symptoms:** build_deep_index takes 30+ seconds or times out

**Possible Causes:**
1. Project too large (1000+ files)
2. Indexing unnecessary directories (node_modules)
3. Slow disk I/O
4. Limited system resources

**Diagnostic Steps:**
1. Check file count: `get_settings_info`
2. Exclude large directories from project path
3. Use refresh_index instead of full rebuild

**Resolution:**
```yaml
# Option 1: Set project to subdirectory
mcp__code-index-mcp__set_project_path:
  path: "C:/project/src"  # Instead of C:/project

# Option 2: Use refresh instead of rebuild
mcp__code-index-mcp__refresh_index: {}

# Option 3: Configure watcher to exclude directories
mcp__code-index-mcp__configure_file_watcher:
  enabled: true
  additional_exclude_patterns: ["node_modules", "dist", "build", ".git"]
```

---

### Issue: File watcher not triggering rebuilds

**Symptoms:** Files changed but search results don't update

**Possible Causes:**
1. Watcher not enabled
2. Debounce delay too long
3. Files excluded by pattern
4. Observer type not compatible with OS

**Diagnostic Steps:**
1. Check watcher status: `get_file_watcher_status`
2. Verify enabled: true
3. Check excluded patterns
4. Try different observer_type

**Resolution:**
```yaml
# Step 1: Check status
mcp__code-index-mcp__get_file_watcher_status: {}

# Step 2: Reconfigure if needed
mcp__code-index-mcp__configure_file_watcher:
  enabled: true
  debounce_seconds: 2
  observer_type: "auto"
  additional_exclude_patterns: ["*.log", "temp/*"]

# Step 3: Manually trigger rebuild
mcp__code-index-mcp__refresh_index: {}
```

---

### Issue: Can't find newly added files

**Symptoms:** New files not appearing in search results

**Possible Causes:**
1. Index not refreshed after files added
2. File watcher not enabled
3. Files in excluded directory
4. File pattern doesn't match

**Diagnostic Steps:**
1. Run refresh_index
2. Check if watcher is enabled
3. Verify file extension matches search pattern
4. Check excluded patterns

**Resolution:**
```yaml
# Step 1: Refresh index
mcp__code-index-mcp__refresh_index: {}

# Step 2: Verify file exists
mcp__code-index-mcp__find_files:
  pattern: "*.ts"  # Use broader pattern

# Step 3: Search for specific file
mcp__code-index-mcp__search_code_advanced:
  pattern: "MyNewClass"
  file_pattern: "*.ts"
  case_sensitive: false
```

---

## Quick Troubleshooting Checklist

- [ ] Check `get_settings_info` - verify project path and file count
- [ ] Run `refresh_index` - update index after changes
- [ ] Use absolute paths - not relative paths
- [ ] Verify symbol names - exact match including case
- [ ] Check file patterns - ensure they match your files
- [ ] Review excluded patterns - ensure directories aren't excluded
- [ ] Test with simpler search - narrow down the issue
- [ ] Check watcher status - verify auto-indexing is running



## Golden Pattern Integration

The **Golden Pattern** (CG → CI → CI → DC → DC → CI) uses CI tools in 3 steps for comprehensive workflow execution.

### CI Tools in Golden Pattern Steps

**Step 2: CI understand (Broad Analysis)**
- Tool: `search_code_advanced`, `get_file_summary`
- Purpose: Understand existing code patterns and file structure
- Context: After CG discover identifies affected files

**Step 3: CI understand (Deep Dive)**
- Tool: `get_symbol_body`
- Purpose: Extract exact implementation details
- Context: Before making changes to code

**Step 6: CI verify**
- Tool: `search_code_advanced`, `get_file_summary`
- Purpose: Confirm changes integrated correctly
- Context: After DC operations complete

---

### Step 2: CI understand (Broad Analysis)

**Purpose:** Understand existing code patterns and file structure

**Tools:**
- `search_code_advanced` - Find patterns across codebase
- `get_file_summary` - Understand file structure

**Example:**
```yaml
# Search for existing auth patterns
mcp__code-index-mcp__search_code_advanced:
  pattern: "middleware.*auth"
  context_lines: 3

# Analyze file structure
mcp__code-index-mcp__get_file_summary:
  file_path: "src/routes/users.ts"
```

**Output:**
- Found 3 auth middleware usage patterns
- File has 5 routes, no authentication present
- Ready for Step 3 deep dive

---

### Step 3: CI understand (Deep Dive)

**Purpose:** Extract exact implementation details

**Tools:**
- `get_symbol_body` - Get function/class code

**Example:**
```yaml
mcp__code-index-mcp__get_symbol_body:
  file_path: "src/middleware/auth.ts"
  symbol_name: "authenticate"
```

**Output:**
```json
{
  "status": "success",
  "symbol_name": "authenticate",
  "type": "function",
  "line": 5,
  "end_line": 18,
  "code": "export async function authenticate(req, res, next) { ... }",
  "signature": "(req: Request, res: Response, next: NextFunction) => Promise<void>",
  "docstring": "Authentication middleware for protected routes"
}
```

**Use:** Understand exact implementation before applying to other files

---

### Step 6: CI verify

**Purpose:** Confirm implementation matches analysis and is correct

**Tools:**
- `search_code_advanced` - Find new pattern
- `get_file_summary` - Re-analyze file
- `get_symbol_body` - Verify implementation

**Example:**
```yaml
# Verify middleware was added
mcp__code-index-mcp__search_code_advanced:
  pattern: "authenticate.*middleware"
  file_pattern: "src/routes/*.ts"

# Re-analyze file
mcp__code-index-mcp__get_file_summary:
  file_path: "src/routes/users.ts"

# Verify symbol implementation
mcp__code-index-mcp__get_symbol_body:
  file_path: "src/routes/users.ts"
  symbol_name: "router"
```

**Output:**
- Found "authenticate" in src/routes/users.ts (line 3)
- File now includes auth middleware
- Routes properly protected

---

### Full Golden Pattern Example

**Task:** Add authentication to user routes

```yaml
# Step 1: CG discover
mcp__CodeGraphContext__query_graph:
  query: "files that use or define User authentication"

# Step 2: CI understand (broad)
mcp__code-index-mcp__search_code_advanced:
  pattern: "middleware.*auth"
  context_lines: 3

mcp__code-index-mcp__get_file_summary:
  file_path: "src/routes/users.ts"

# Step 3: CI understand (deep)
mcp__code-index-mcp__get_symbol_body:
  file_path: "src/middleware/auth.ts"
  symbol_name: "authenticate"

# Step 4: DC act
mcp__desktop-commander__edit_block:
  file_path: "src/routes/users.ts"
  old_string: |
    import express from 'express';
    const router = express.Router();
  new_string: |
    import express from 'express';
    import { authenticate } from '../middleware/auth.js';
    
    const router = express.Router();
    router.use(authenticate);

# Step 5: DC verify
mcp__desktop-commander__read_file:
  path: "src/routes/users.ts"
  offset: 0
  length: 10

# Step 6: CI verify
mcp__code-index-mcp__search_code_advanced:
  pattern: "authenticate.*middleware"
  file_pattern: "src/routes/*.ts"
```

**Result:** All routes protected with authentication, verified

---

## CI Tool Quick Reference

| Step | Tool | Purpose | Example |
|------|------|---------|---------|
| Discover | search_code_advanced | Find patterns | `pattern: "auth"` |
| Analyze | get_file_summary | Understand file | Check structure |
| Deep dive | get_symbol_body | Get implementation | Extract function |
| Verify | search_code_advanced | Confirm changes | Find new pattern |
| Verify | get_file_summary | Confirm structure | Re-analyze file |

---

## Related Documentation

- **GOLDEN-PATTERN.md** - Full golden pattern documentation with examples
- **TOOL-CHAIN-PATTERNS.md** - All 24 tool chain patterns
- **TOOL-PRIORITY-RULES.md** - Tool selection hierarchy
- **MCP-TOKEN-BENCHMARK.md** - Token efficiency metrics

---

**End of Code-Index MCP (CI) Usage Guide**
