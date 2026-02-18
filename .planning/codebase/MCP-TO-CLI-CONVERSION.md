# MCP to Native TypeScript CLI Conversion Specification

**Document Version:** 1.0  
**Created:** 2025-02-19  
**Status:** Design Phase

---

## Executive Summary

This document specifies the conversion of 8 MCP (Model Context Protocol) servers to native TypeScript CLI applications integrated with the GSI (Get Shit Indexed) tooling ecosystem. The conversion eliminates MCP protocol overhead, reduces token consumption by 70-90%, and provides direct CLI access to functionality currently locked behind MCP client connections.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Unified CLI Design](#unified-cli-design)
3. [MCP Server Conversions](#mcp-server-conversions)
4. [TypeScript Interfaces](#typescript-interfaces)
5. [Integration with gsi-tools.js](#integration-with-gsi-toolsjs)
6. [Token Efficiency Comparison](#token-efficiency-comparison)
7. [Implementation Roadmap](#implementation-roadmap)

---

## Architecture Overview

### Current State (MCP-Based)

```
┌─────────────────┐     MCP Protocol      ┌─────────────────┐
│   Claude/AI     │ ◄───────────────────► │   MCP Server    │
│     Client      │   (JSON-RPC/stdio)    │   (Node/Python) │
└─────────────────┘                       └─────────────────┘
        │
        ~15K tokens per tool definition
        ~5K tokens per parameter validation
        ~10K tokens per response
```

### Target State (Native CLI)

```
┌─────────────────┐     Direct Exec       ┌─────────────────┐
│   gsi-tools.js  │ ───────────────────► │  Native CLI     │
│   (Wrapper)     │   (spawn/exec)        │  (TypeScript)   │
└─────────────────┘                       └─────────────────┘
        │
        ~500 tokens per command
        ~200 tokens per parameter
        ~2K tokens per response
        
Token Savings: 80-90%
```

### Design Principles

1. **Single Entry Point**: All commands go through `gsi <domain> <action>`
2. **JSON-First Output**: Structured output for programmatic consumption
3. **Human-Readable Fallback**: Text output with `--raw` or `--text` flags
4. **Cross-Platform**: Windows, macOS, Linux support
5. **Exit Code Standards**: 0=success, 1=error, 2=validation error, 3=not found

---

## Unified CLI Design

### Command Structure

```bash
gsi <domain> <action> [options] [arguments]

# Domain mapping:
#   file     → Desktop Commander file operations
#   process  → Desktop Commander process operations  
#   search   → Code-Index-MCP code search
#   index    → Code-Index-MCP indexing
#   think    → Sequential/Tractatus thinking
#   debug    → Debug-thinking graph operations
#   docs     → Context7 library documentation
#   wiki     → DeepWiki repository knowledge
#   graph    → CodeGraphContext analysis
```

### Global Options

```bash
--output <format>    Output format: json|text|yaml (default: json)
--quiet              Suppress non-essential output
--verbose            Extended logging
--timeout <ms>       Command timeout (default: 30000)
--config <path>      Custom config file path
--help               Show help for command
--version            Show version
```

### Output Formats

```typescript
// JSON (default) - for programmatic consumption
gsi file read src/index.ts --output json
// → {"content": "...", "path": "src/index.ts", "lines": 150, "size": 4500}

// Text - for human reading
gsi file read src/index.ts --output text
// → [file contents]

// YAML - for configuration files
gsi state get --output yaml
// → current_phase: 47
//    current_plan: 3
//    ...
```

---

## MCP Server Conversions

### 1. Desktop Commander → `gsi file` / `gsi process`

**MCP Prefix:** `mcp__desktop-commander__*`

#### File Operations (`gsi file`)

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `read_file` | `gsi file read <path>` | Read file contents |
| `read_multiple_files` | `gsi file read <path1> <path2> ...` | Read multiple files |
| `write_file` | `gsi file write <path> [--append]` | Write/append to file |
| `edit_block` | `gsi file edit <path> --old "..." --new "..."` | Surgical text replacement |
| `create_directory` | `gsi file mkdir <path>` | Create directory |
| `list_directory` | `gsi file ls <path> [--depth N]` | List directory contents |
| `move_file` | `gsi file mv <src> <dest>` | Move/rename file |
| `get_file_info` | `gsi file info <path>` | Get file metadata |
| `start_search` | `gsi file search <pattern> [--type files|content]` | Search files/content |
| `get_more_search_results` | `gsi file search-results <session>` | Get paginated results |
| `stop_search` | `gsi file search-stop <session>` | Stop search |

#### Process Operations (`gsi process`)

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `start_process` | `gsi process start <cmd> [--shell bash|powershell]` | Start process |
| `interact_with_process` | `gsi process send <pid> <input>` | Send input to process |
| `read_process_output` | `gsi process output <pid> [--timeout N]` | Read process output |
| `list_processes` | `gsi process list` | List running processes |
| `list_sessions` | `gsi process sessions` | List terminal sessions |
| `kill_process` | `gsi process kill <pid>` | Kill process |
| `force_terminate` | `gsi process terminate <pid>` | Force terminate |

#### Configuration (`gsi config`)

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `get_config` | `gsi config get` | Get full configuration |
| `set_config_value` | `gsi config set <key> <value>` | Set configuration value |
| `get_usage_stats` | `gsi config stats` | Get usage statistics |

#### CLI Interface Design

```typescript
// gsi file read
interface FileReadOptions {
  path: string;
  offset?: number;      // Start line (negative = from end)
  length?: number;      // Max lines to read
  isUrl?: boolean;      // Read from URL
  output?: 'json' | 'text';
}

// Example usage:
// gsi file read src/index.ts --offset 10 --length 50
// gsi file read https://example.com/data.json --is-url

// gsi file edit
interface FileEditOptions {
  path: string;
  old_string: string;
  new_string: string;
  expected_replacements?: number;
}

// Example usage:
// gsi file edit src/index.ts --old "console.log('old')" --new "console.log('new')"

// gsi process start
interface ProcessStartOptions {
  command: string;
  timeout_ms?: number;
  shell?: 'bash' | 'powershell' | 'cmd';
}

// Example usage:
// gsi process start "npm test" --timeout 60000
```

---

### 2. Code-Index-MCP → `gsi search` / `gsi index`

**MCP Prefix:** `mcp__code-index-mcp__*`

#### Indexing Operations (`gsi index`)

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `set_project_path` | `gsi index set-path <path>` | Set project root |
| `build_deep_index` | `gsi index build` | Build full symbol index |
| `refresh_index` | `gsi index refresh` | Refresh file index |
| `get_settings_info` | `gsi index settings` | View index settings |
| `configure_file_watcher` | `gsi index watch [--enable] [--debounce N]` | Configure watcher |
| `get_file_watcher_status` | `gsi index watch-status` | Watcher status |
| `check_temp_directory` | `gsi index temp-check` | Check temp directory |
| `create_temp_directory` | `gsi index temp-create` | Create temp directory |
| `clear_settings` | `gsi index clear` | Clear all settings |
| `refresh_search_tools` | `gsi index tools-refresh` | Re-detect search tools |

#### Search Operations (`gsi search`)

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `search_code_advanced` | `gsi search code <pattern>` | Code search with options |
| `find_files` | `gsi search files <pattern>` | Find files by glob |
| `get_file_summary` | `gsi search summary <path>` | Get file analysis |
| `get_symbol_body` | `gsi search symbol <path> <name>` | Get symbol source |

#### CLI Interface Design

```typescript
// gsi search code
interface SearchCodeOptions {
  pattern: string;
  file_pattern?: string;      // Glob pattern (e.g., "*.ts")
  case_sensitive?: boolean;
  regex?: boolean;
  fuzzy?: boolean;
  context_lines?: number;
  max_results?: number;
  start_index?: number;       // Pagination
}

// Example usage:
// gsi search code "function authenticate" --file-pattern "*.ts" --context 3

// gsi search files
interface SearchFilesOptions {
  pattern: string;            // Glob pattern
}

// Example usage:
// gsi search files "**/*.test.ts"

// gsi search symbol
interface SearchSymbolOptions {
  file_path: string;
  symbol_name: string;
}

// Example usage:
// gsi search symbol src/auth.ts authenticate
```

---

### 3. Sequential Thinking → `gsi think sequential`

**MCP Prefix:** `mcp__sequential-thinking__sequentialthinking`

#### Command Mapping

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `sequentialthinking` | `gsi think seq [options]` | Sequential thinking process |

#### CLI Interface Design

```typescript
// gsi think seq
interface SequentialThinkOptions {
  thought: string;
  thought_number: number;
  total_thoughts: number;
  next_thought_needed: boolean;
  is_revision?: boolean;
  revises_thought?: number;
  branch_from_thought?: number;
  branch_id?: string;
  needs_more_thoughts?: boolean;
  available_tools?: string[];    // MCP tools available
  current_step?: StepRecommendation;
  previous_steps?: StepRecommendation[];
  remaining_steps?: string[];
}

interface StepRecommendation {
  step_description: string;
  recommended_tools: ToolRecommendation[];
  expected_outcome: string;
  next_step_conditions?: string[];
}

interface ToolRecommendation {
  tool_name: string;
  confidence: number;          // 0-1
  rationale: string;
  priority: number;
  suggested_inputs?: Record<string, unknown>;
  alternatives?: string[];
}

// Example usage:
// gsi think seq --thought "Analyze authentication flow" --thought-number 1 --total-thoughts 5 --next
// gsi think seq --thought "Need to revise approach" --revision --revises 3

// Interactive mode:
// gsi think seq --interactive
// → Opens interactive thinking session
```

---

### 4. Tractatus Thinking → `gsi think tractatus`

**MCP Prefix:** `mcp__tractatusthinking__tractatus_thinking`

#### Command Mapping

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `tractatus_thinking` (start) | `gsi think tract start <concept>` | Start analysis |
| `tractatus_thinking` (add) | `gsi think tract add <content>` | Add proposition |
| `tractatus_thinking` (navigate) | `gsi think tract nav <target>` | Navigate tree |
| `tractatus_thinking` (analyze) | `gsi think tract analyze` | Analyze completeness |
| `tractatus_thinking` (export) | `gsi think tract export [--format]` | Export analysis |
| `tractatus_thinking` (revise) | `gsi think tract revise <num> <content>` | Revise proposition |
| `tractatus_thinking` (undo) | `gsi think tract undo` | Undo last action |
| `tractatus_thinking` (move) | `gsi think tract move <num> <parent>` | Move proposition |

#### CLI Interface Design

```typescript
// gsi think tract start
interface TractatusStartOptions {
  concept: string;
  thoughts?: string;           // Raw thoughts for quick analysis
  depth_limit?: number;        // Max depth (1-10, default 5)
  style?: 'analytical' | 'exhaustive' | 'creative';
  confidence_threshold?: number;  // 0.1-1.0
}

// gsi think tract add
interface TractatusAddOptions {
  session_id: string;
  content: string;
  parent_number?: string;      // e.g., "1.2.3"
  decomposition_type?: 'clarification' | 'analysis' | 'cases' | 'implication' | 'negation';
  is_atomic?: boolean;
  confidence?: number;
}

// gsi think tract export
interface TractatusExportOptions {
  session_id: string;
  format?: 'markdown' | 'json' | 'graphviz';
  include_metadata?: boolean;
}

// Example usage:
// gsi think tract start "What is code quality?" --depth-limit 5 --style analytical
// gsi think tract add --session abc123 "Code quality encompasses readability" --parent 1
// gsi think tract export --session abc123 --format markdown
```

---

### 5. Debug Thinking → `gsi debug`

**MCP Prefix:** `mcp__debug-thinking__debug_thinking`

#### Command Mapping

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `debug_thinking` (create) | `gsi debug create <type> <content>` | Create node |
| `debug_thinking` (connect) | `gsi debug connect <from> <to> <type>` | Connect nodes |
| `debug_thinking` (query) | `gsi debug query <type> [pattern]` | Query graph |

#### Node Types
- `problem` - The issue being debugged
- `hypothesis` - Potential cause
- `experiment` - Test to verify hypothesis
- `observation` - Result from experiment
- `learning` - Insight gained
- `solution` - Final resolution

#### Relationship Types
- `decomposes` - Breaks down into
- `hypothesizes` - Proposes cause
- `tests` - Verifies hypothesis
- `produces` - Creates result
- `learns` - Gains insight
- `contradicts` - Opposes
- `supports` - Confirms
- `solves` - Resolves

#### CLI Interface Design

```typescript
// gsi debug create
interface DebugCreateOptions {
  nodeType: 'problem' | 'hypothesis' | 'experiment' | 'observation' | 'learning' | 'solution';
  content: string;
  parentId?: string;
  metadata?: {
    confidence?: number;       // 0-100
    tags?: string[];
  };
}

// gsi debug connect
interface DebugConnectOptions {
  from: string;                // Source node ID
  to: string;                  // Target node ID
  type: 'decomposes' | 'hypothesizes' | 'tests' | 'produces' | 'learns' | 'contradicts' | 'supports' | 'solves';
  strength?: number;           // 0-1
}

// gsi debug query
interface DebugQueryOptions {
  queryType: 'similar-problems' | 'recent-activity';
  pattern?: string;            // Search pattern
  limit?: number;
  minSimilarity?: number;      // 0-1
}

// Example usage:
// gsi debug create problem "TypeError: Cannot read property 'x' of undefined"
// gsi debug create hypothesis "Missing null check in async flow" --parent <problem-id>
// gsi debug connect <problem-id> <hypothesis-id> hypothesizes --strength 0.8
// gsi debug query similar-problems --pattern "TypeError undefined" --limit 10
```

---

### 6. Context7 → `gsi docs`

**MCP Prefix:** `mcp__context7__*`

#### Command Mapping

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `resolve-library-id` | `gsi docs resolve <library>` | Find library ID |
| `get-library-docs` | `gsi docs get <library-id> [topic]` | Get documentation |

#### CLI Interface Design

```typescript
// gsi docs resolve
interface DocsResolveOptions {
  libraryName: string;
  output?: 'json' | 'text';
}

// Output format:
interface LibraryMatch {
  id: string;                  // Context7 ID (e.g., /vercel/next.js)
  name: string;
  description: string;
  codeSnippets: number;
  sourceReputation: 'High' | 'Medium' | 'Low';
  benchmarkScore: number;
  versions?: string[];
}

// gsi docs get
interface DocsGetOptions {
  libraryId: string;           // e.g., /vercel/next.js
  topic?: string;              // Focus area
  mode?: 'code' | 'info';      // code=API/usage, info=concepts
  page?: number;               // Pagination
  output?: 'json' | 'text' | 'markdown';
}

// Example usage:
// gsi docs resolve react
// gsi docs get /facebook/react hooks --mode code
// gsi docs get /vercel/next.js routing --page 2

// API Key configuration via environment:
// CONTEXT7_API_KEY=ctx7sk-xxx
```

---

### 7. DeepWiki → `gsi wiki`

**MCP Prefix:** `mcp__deepwiki__*`

#### Command Mapping

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `ask_question` | `gsi wiki ask <repo> <question>` | Ask about repo |
| `read_wiki_contents` | `gsi wiki read <repo>` | Read full wiki |
| `read_wiki_structure` | `gsi wiki structure <repo>` | Get wiki structure |

#### CLI Interface Design

```typescript
// gsi wiki ask
interface WikiAskOptions {
  repoName: string | string[]; // e.g., "facebook/react" or multiple
  question: string;
  output?: 'json' | 'text';
}

// gsi wiki read
interface WikiReadOptions {
  repoName: string;
  output?: 'json' | 'text' | 'markdown';
}

// gsi wiki structure
interface WikiStructureOptions {
  repoName: string;
  output?: 'json' | 'text';
}

// Output format for structure:
interface WikiStructure {
  repo: string;
  topics: {
    title: string;
    slug: string;
    children?: WikiStructure[];
  }[];
}

// Example usage:
// gsi wiki ask facebook/react "How does the reconciliation algorithm work?"
// gsi wiki read vercel/next.js
// gsi wiki structure microsoft/typescript
```

---

### 8. CodeGraphContext → `gsi graph`

**MCP Prefix:** `mcp__CodeGraphContext__*`

#### Command Mapping

| MCP Tool | CLI Command | Description |
|----------|-------------|-------------|
| `add_code_to_graph` | `gsi graph add <path>` | Add code to graph |
| `add_package_to_graph` | `gsi graph add-pkg <name> <lang>` | Add package |
| `analyze_code_relationships` | `gsi graph analyze <target> <type>` | Analyze relationships |
| `calculate_cyclomatic_complexity` | `gsi graph complexity <function>` | Get complexity |
| `check_job_status` | `gsi graph job <id>` | Check job status |
| `delete_repository` | `gsi graph delete <path>` | Delete from graph |
| `execute_cypher_query` | `gsi graph cypher <query>` | Run Cypher query |
| `find_code` | `gsi graph find <query>` | Find code snippets |
| `find_dead_code` | `gsi graph dead-code` | Find unused code |
| `find_most_complex_functions` | `gsi graph complex [--limit N]` | Most complex functions |
| `get_repository_stats` | `gsi graph stats [path]` | Repository statistics |
| `list_indexed_repositories` | `gsi graph list` | List repositories |
| `list_jobs` | `gsi graph jobs` | List background jobs |
| `list_watched_paths` | `gsi graph watched` | List watched paths |
| `load_bundle` | `gsi graph load <bundle>` | Load pre-indexed bundle |
| `search_registry_bundles` | `gsi graph bundles [query]` | Search bundles |
| `unwatch_directory` | `gsi graph unwatch <path>` | Stop watching |
| `visualize_graph_query` | `gsi graph viz <query>` | Generate visualization URL |
| `watch_directory` | `gsi graph watch <path>` | Watch for changes |

#### CLI Interface Design

```typescript
// gsi graph analyze
interface GraphAnalyzeOptions {
  target: string;              // Function/class/module
  queryType: 'find_callers' | 'find_callees' | 'find_all_callers' | 
             'find_all_callees' | 'find_importers' | 'who_modifies' | 
             'class_hierarchy' | 'overrides' | 'dead_code' | 'call_chain' | 
             'module_deps' | 'variable_scope' | 'find_complexity' | 
             'find_functions_by_argument' | 'find_functions_by_decorator';
  context?: string;            // File path for precision
}

// gsi graph cypher
interface GraphCypherOptions {
  query: string;               // Cypher query
}

// gsi graph find
interface GraphFindOptions {
  query: string;
  fuzzy_search?: boolean;
  edit_distance?: number;      // 0-2
}

// gsi graph add-pkg
interface GraphAddPackageOptions {
  package_name: string;
  language: 'python' | 'javascript' | 'typescript' | 'java' | 'c' | 'go' | 'ruby' | 'php' | 'cpp';
  is_dependency?: boolean;
}

// Example usage:
// gsi graph analyze authenticate find_callers --context src/auth.ts
// gsi graph complexity handleRequest
// gsi graph find "async function" --fuzzy
// gsi graph dead-code
// gsi graph cypher "MATCH (f:Function) WHERE f.cyclomatic_complexity > 10 RETURN f"
// gsi graph watch ./src
// gsi graph bundles react
```

---

## TypeScript Interfaces

### Core Types

```typescript
// === Command Result ===
interface CLIResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    duration_ms: number;
    timestamp: string;
    version: string;
  };
}

// === File Operations ===
namespace File {
  interface ReadResult {
    content: string;
    path: string;
    lines: number;
    size: number;
    encoding: string;
  }

  interface WriteResult {
    path: string;
    bytes_written: number;
    mode: 'rewrite' | 'append';
  }

  interface EditResult {
    path: string;
    replacements: number;
    old: string;
    new: string;
  }

  interface ListResult {
    path: string;
    entries: Array<{
      name: string;
      type: 'file' | 'directory';
      size?: number;
      modified?: string;
    }>;
    total: number;
  }

  interface SearchOptions {
    pattern: string;
    type: 'files' | 'content';
    path: string;
    caseInsensitive?: boolean;
    literalSearch?: boolean;
    filePattern?: string;
    maxResults?: number;
    contextLines?: number;
  }

  interface SearchResult {
    session_id: string;
    matches: Array<{
      path: string;
      line?: number;
      content?: string;
      context?: string[];
    }>;
    total: number;
    has_more: boolean;
  }
}

// === Process Operations ===
namespace Process {
  interface StartResult {
    pid: number;
    command: string;
    status: 'running' | 'completed' | 'error';
    blocked: boolean;
  }

  interface OutputResult {
    pid: number;
    output: string;
    status: 'waiting' | 'finished' | 'timeout' | 'error';
    duration_ms: number;
  }

  interface ProcessInfo {
    pid: number;
    command: string;
    cpu_percent: number;
    memory_bytes: number;
    status: string;
  }

  interface SessionInfo {
    pid: number;
    blocked: boolean;
    runtime_seconds: number;
  }
}

// === Search Operations ===
namespace Search {
  interface CodeResult {
    pattern: string;
    matches: Array<{
      file: string;
      line: number;
      column: number;
      content: string;
      context_before?: string[];
      context_after?: string[];
    }>;
    total: number;
    page: number;
    has_more: boolean;
  }

  interface FileResult {
    pattern: string;
    files: Array<{
      path: string;
      name: string;
      directory: string;
    }>;
    total: number;
  }

  interface SymbolResult {
    file_path: string;
    symbol_name: string;
    type: 'function' | 'method' | 'class' | 'variable' | 'interface';
    line: number;
    end_line: number;
    code: string;
    signature?: string;
    docstring?: string;
    called_by?: string[];
  }

  interface FileSummary {
    path: string;
    line_count: number;
    functions: string[];
    classes: string[];
    imports: string[];
    complexity?: number;
  }
}

// === Thinking Operations ===
namespace Thinking {
  // Sequential
  interface SequentialResult {
    thought: string;
    thought_number: number;
    total_thoughts: number;
    next_thought_needed: boolean;
    current_step?: StepRecommendation;
    is_revision: boolean;
  }

  // Tractatus
  interface TractatusSession {
    session_id: string;
    concept: string;
    propositions: Proposition[];
    created_at: string;
  }

  interface Proposition {
    number: string;           // e.g., "1.2.3"
    content: string;
    parent_number: string | null;
    is_atomic: boolean;
    confidence: number;
    children: Proposition[];
  }

  // Debug
  interface DebugNode {
    id: string;
    type: 'problem' | 'hypothesis' | 'experiment' | 'observation' | 'learning' | 'solution';
    content: string;
    created_at: string;
    metadata?: {
      confidence?: number;
      tags?: string[];
    };
    edges: DebugEdge[];
  }

  interface DebugEdge {
    from: string;
    to: string;
    type: string;
    strength: number;
  }
}

// === Documentation Operations ===
namespace Docs {
  interface LibraryMatch {
    id: string;
    name: string;
    description: string;
    code_snippets: number;
    source_reputation: string;
    benchmark_score: number;
    versions?: string[];
  }

  interface DocumentationResult {
    library_id: string;
    topic?: string;
    content: string;
    page: number;
    has_more: boolean;
  }
}

// === Graph Operations ===
namespace Graph {
  interface AnalysisResult {
    target: string;
    query_type: string;
    results: Array<{
      name: string;
      path?: string;
      type?: string;
      details?: Record<string, unknown>;
    }>;
  }

  interface ComplexityResult {
    function_name: string;
    path?: string;
    cyclomatic_complexity: number;
  }

  interface RepositoryStats {
    path: string;
    files: number;
    functions: number;
    classes: number;
    modules: number;
  }

  interface CodeMatch {
    name: string;
    path: string;
    type: string;
    snippet: string;
    score: number;
  }
}
```

### Configuration Types

```typescript
// === Global Configuration ===
interface GSIConfig {
  version: string;
  defaults: {
    output_format: 'json' | 'text' | 'yaml';
    timeout_ms: number;
    verbose: boolean;
  };
  servers: {
    context7?: {
      api_key?: string;
    };
    codegraph?: {
      neo4j_uri?: string;
      neo4j_user?: string;
      neo4j_password?: string;
    };
  };
  paths: {
    cache_dir: string;
    temp_dir: string;
  };
}

// === Command-Specific Config ===
interface FileCommandConfig {
  read_line_limit: number;
  write_line_limit: number;
  allowed_directories: string[];
}

interface SearchCommandConfig {
  default_max_results: number;
  default_context_lines: number;
  search_tools_preference: ('ugrep' | 'ripgrep' | 'ag' | 'grep')[];
}

interface ThinkCommandConfig {
  max_history_size: number;
  default_depth_limit: number;
  default_confidence_threshold: number;
}
```

---

## Integration with gsi-tools.js

### Wrapper Pattern

The existing `gsi-tools.js` will be extended to support the new CLI commands while maintaining backward compatibility.

```javascript
// Extension to gsi-tools.js

// === New Command Categories ===

// File operations (Desktop Commander replacement)
function cmdFileRead(cwd, paths, options, raw) {
  const args = ['file', 'read', ...paths];
  if (options.offset !== undefined) args.push('--offset', options.offset);
  if (options.length !== undefined) args.push('--length', options.length);
  if (options.isUrl) args.push('--is-url');
  if (options.output) args.push('--output', options.output);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdFileWrite(cwd, path, content, options, raw) {
  const args = ['file', 'write', path, '--content', content];
  if (options.mode) args.push('--mode', options.mode);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdFileEdit(cwd, path, oldString, newString, options, raw) {
  const args = ['file', 'edit', path, '--old', oldString, '--new', newString];
  if (options.expectedReplacements) {
    args.push('--expected-replacements', options.expectedReplacements);
  }
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdFileList(cwd, path, options, raw) {
  const args = ['file', 'ls', path];
  if (options.depth) args.push('--depth', options.depth);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdFileSearch(cwd, pattern, options, raw) {
  const args = ['file', 'search', pattern, '--path', options.path || cwd];
  if (options.type) args.push('--type', options.type);
  if (options.filePattern) args.push('--file-pattern', options.filePattern);
  if (options.caseInsensitive !== false) args.push('--ignore-case');
  return execCLI('gsi', args, { cwd }, raw);
}

// Process operations
function cmdProcessStart(cwd, command, options, raw) {
  const args = ['process', 'start', command];
  if (options.timeout) args.push('--timeout', options.timeout);
  if (options.shell) args.push('--shell', options.shell);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdProcessInteract(cwd, pid, input, options, raw) {
  const args = ['process', 'send', pid, input];
  if (options.timeout) args.push('--timeout', options.timeout);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdProcessOutput(cwd, pid, options, raw) {
  const args = ['process', 'output', pid];
  if (options.timeout) args.push('--timeout', options.timeout);
  return execCLI('gsi', args, { cwd }, raw);
}

// Search operations (Code-Index-MCP replacement)
function cmdSearchCode(cwd, pattern, options, raw) {
  const args = ['search', 'code', pattern];
  if (options.filePattern) args.push('--file-pattern', options.filePattern);
  if (options.caseSensitive) args.push('--case-sensitive');
  if (options.regex) args.push('--regex');
  if (options.fuzzy) args.push('--fuzzy');
  if (options.contextLines) args.push('--context', options.contextLines);
  if (options.maxResults) args.push('--max-results', options.maxResults);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdSearchFiles(cwd, pattern, raw) {
  return execCLI('gsi', ['search', 'files', pattern], { cwd }, raw);
}

function cmdSearchSymbol(cwd, filePath, symbolName, raw) {
  return execCLI('gsi', ['search', 'symbol', filePath, symbolName], { cwd }, raw);
}

function cmdIndexBuild(cwd, raw) {
  return execCLI('gsi', ['index', 'build'], { cwd }, raw);
}

// Thinking operations
function cmdThinkSequential(cwd, options, raw) {
  const args = ['think', 'seq'];
  if (options.thought) args.push('--thought', options.thought);
  if (options.thoughtNumber) args.push('--thought-number', options.thoughtNumber);
  if (options.totalThoughts) args.push('--total-thoughts', options.totalThoughts);
  if (options.nextThoughtNeeded) args.push('--next');
  if (options.isRevision) args.push('--revision');
  if (options.revisesThought) args.push('--revises', options.revisesThought);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdThinkTractatus(cwd, action, options, raw) {
  const args = ['think', 'tract', action];
  if (options.concept) args.push(options.concept);
  if (options.sessionId) args.push('--session', options.sessionId);
  if (options.content) args.push('--content', options.content);
  if (options.depthLimit) args.push('--depth-limit', options.depthLimit);
  return execCLI('gsi', args, { cwd }, raw);
}

// Debug operations
function cmdDebugCreate(cwd, nodeType, content, options, raw) {
  const args = ['debug', 'create', nodeType, content];
  if (options.parentId) args.push('--parent', options.parentId);
  if (options.confidence) args.push('--confidence', options.confidence);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdDebugConnect(cwd, fromId, toId, relationType, options, raw) {
  const args = ['debug', 'connect', fromId, toId, relationType];
  if (options.strength) args.push('--strength', options.strength);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdDebugQuery(cwd, queryType, options, raw) {
  const args = ['debug', 'query', queryType];
  if (options.pattern) args.push('--pattern', options.pattern);
  if (options.limit) args.push('--limit', options.limit);
  return execCLI('gsi', args, { cwd }, raw);
}

// Docs operations (Context7 replacement)
function cmdDocsResolve(cwd, libraryName, raw) {
  return execCLI('gsi', ['docs', 'resolve', libraryName], { cwd }, raw);
}

function cmdDocsGet(cwd, libraryId, options, raw) {
  const args = ['docs', 'get', libraryId];
  if (options.topic) args.push(options.topic);
  if (options.mode) args.push('--mode', options.mode);
  if (options.page) args.push('--page', options.page);
  return execCLI('gsi', args, { cwd }, raw);
}

// Wiki operations (DeepWiki replacement)
function cmdWikiAsk(cwd, repoName, question, raw) {
  return execCLI('gsi', ['wiki', 'ask', repoName, question], { cwd }, raw);
}

function cmdWikiRead(cwd, repoName, raw) {
  return execCLI('gsi', ['wiki', 'read', repoName], { cwd }, raw);
}

function cmdWikiStructure(cwd, repoName, raw) {
  return execCLI('gsi', ['wiki', 'structure', repoName], { cwd }, raw);
}

// Graph operations (CodeGraphContext replacement)
function cmdGraphAnalyze(cwd, target, queryType, options, raw) {
  const args = ['graph', 'analyze', target, queryType];
  if (options.context) args.push('--context', options.context);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdGraphFind(cwd, query, options, raw) {
  const args = ['graph', 'find', query];
  if (options.fuzzy) args.push('--fuzzy');
  if (options.editDistance) args.push('--edit-distance', options.editDistance);
  return execCLI('gsi', args, { cwd }, raw);
}

function cmdGraphDeadCode(cwd, raw) {
  return execCLI('gsi', ['graph', 'dead-code'], { cwd }, raw);
}

// === Helper: Execute CLI ===
function execCLI(command, args, options, raw) {
  const { spawnSync } = require('child_process');
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf-8',
    timeout: options.timeout || 30000,
    maxBuffer: 50 * 1024 * 1024,  // 50MB
  });

  if (result.error) {
    return { success: false, error: result.error.message };
  }

  if (result.status !== 0) {
    return { 
      success: false, 
      error: result.stderr || 'Unknown error',
      exitCode: result.status 
    };
  }

  if (raw) {
    return { success: true, raw: result.stdout };
  }

  try {
    return { success: true, data: JSON.parse(result.stdout) };
  } catch {
    return { success: true, raw: result.stdout };
  }
}
```

### Migration Strategy

```javascript
// === Migration Helper ===
// Provides gradual migration from MCP to native CLI

const USE_NATIVE_CLI = {
  file: true,      // Use native CLI for file ops
  process: true,   // Use native CLI for process ops
  search: true,    // Use native CLI for search
  think: false,    // Still using MCP (Phase 2)
  debug: false,    // Still using MCP (Phase 2)
  docs: false,     // Still using MCP (Phase 2)
  wiki: false,     // Still using MCP (Phase 2)
  graph: false,    // Still using MCP (Phase 2)
};

function getFileOperation(operation) {
  if (USE_NATIVE_CLI.file) {
    return nativeFileOperations[operation];
  }
  return mcpFileOperations[operation];  // Fallback to MCP
}
```

---

## Token Efficiency Comparison

### Baseline: MCP Protocol Overhead

| Component | Token Cost | Notes |
|-----------|------------|-------|
| Tool definition schema | ~15,000 | JSON Schema, descriptions, examples |
| Parameter validation | ~5,000 | Type checking, constraints |
| Request envelope | ~2,000 | JSON-RPC wrapper |
| Response envelope | ~2,000 | JSON-RPC response |
| **Total per call** | **~24,000** | Per tool invocation |

### Optimized: Native CLI

| Component | Token Cost | Notes |
|-----------|------------|-------|
| Command string | ~200 | Simple command line |
| Arguments | ~300 | Minimal parameter encoding |
| Response | ~2,000 | Direct JSON output |
| **Total per call** | **~2,500** | Per command invocation |

### Savings Analysis

| Operation Type | MCP Tokens | CLI Tokens | Savings | % Reduction |
|---------------|------------|------------|---------|-------------|
| File read | 24,000 | 2,500 | 21,500 | 89.6% |
| Code search | 24,000 | 2,800 | 21,200 | 88.3% |
| Process start | 24,000 | 2,200 | 21,800 | 90.8% |
| Sequential think | 24,000 | 3,500 | 20,500 | 85.4% |
| Graph analysis | 24,000 | 3,000 | 21,000 | 87.5% |
| **Average** | **24,000** | **2,800** | **21,200** | **88.3%** |

### Cumulative Impact (Typical Session)

```
Session: 50 tool calls

MCP:    50 × 24,000 = 1,200,000 tokens
CLI:    50 × 2,800  = 140,000 tokens

Savings: 1,060,000 tokens (88.3%)

Cost Impact (at $15/1M tokens):
  MCP:  $18.00 per session
  CLI:  $2.10 per session
  
Monthly Savings (100 sessions): $1,590
```

---

## Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1-2)

**Objective:** Establish CLI foundation and file/process operations

1. **Project Setup**
   - Create `gsi-cli` package in monorepo
   - Set up TypeScript build configuration
   - Define command infrastructure (commander.js or oclif)
   - Create shared type definitions

2. **File Operations Module**
   - Implement `gsi file read/write/edit/ls/mkdir/mv`
   - Add path validation and security checks
   - Implement streaming for large files
   - Add URL fetch capability

3. **Process Operations Module**
   - Implement `gsi process start/send/output/list/kill`
   - Add REPL detection and interaction
   - Implement timeout handling
   - Cross-platform shell support

4. **Integration**
   - Extend `gsi-tools.js` with new command wrappers
   - Add configuration for native CLI toggle
   - Create migration guide for existing commands

**Deliverables:**
- Working `gsi file` and `gsi process` commands
- Updated `gsi-tools.js` with native CLI support
- Documentation for file/process operations

### Phase 2: Search and Index (Week 3-4)

**Objective:** Replace Code-Index-MCP functionality

1. **Search Module**
   - Implement `gsi search code/files/symbol`
   - Integrate with ugrep/ripgrep/ag/grep
   - Add pagination support
   - Implement fuzzy matching

2. **Index Module**
   - Implement `gsi index build/refresh/watch`
   - Create symbol extraction (Tree-sitter)
   - Add file watching for live updates
   - Implement caching layer

3. **Integration**
   - Replace MCP search calls in workflows
   - Update agent commands to use native search
   - Performance benchmarking

**Deliverables:**
- Working `gsi search` and `gsi index` commands
- Symbol extraction for TypeScript, JavaScript, Python
- Performance comparison report

### Phase 3: Thinking Systems (Week 5-6)

**Objective:** Replace thinking MCP servers

1. **Sequential Thinking Module**
   - Implement `gsi think seq`
   - Add step recommendations
   - Implement branching and revision
   - Add history management

2. **Tractatus Thinking Module**
   - Implement `gsi think tract start/add/nav/export`
   - Create proposition tree management
   - Add completeness analysis
   - Implement export formats

3. **Debug Thinking Module**
   - Implement `gsi debug create/connect/query`
   - Create graph storage (JSONL-based)
   - Add similarity search
   - Implement pattern extraction

**Deliverables:**
- Working `gsi think` and `gsi debug` commands
- Thinking workflow documentation
- Integration with gsi-tools.js

### Phase 4: External Services (Week 7-8)

**Objective:** Replace documentation and knowledge MCP servers

1. **Context7 Module**
   - Implement `gsi docs resolve/get`
   - Add API key management
   - Implement caching
   - Add offline mode

2. **DeepWiki Module**
   - Implement `gsi wiki ask/read/structure`
   - Add response caching
   - Implement batch queries

3. **CodeGraphContext Module**
   - Implement `gsi graph analyze/find/complexity`
   - Create Neo4j connection management
   - Add bundle support
   - Implement visualization URL generation

**Deliverables:**
- Working `gsi docs`, `gsi wiki`, `gsi graph` commands
- API key configuration documentation
- External service integration guide

### Phase 5: Polish and Optimization (Week 9-10)

**Objective:** Finalize and optimize

1. **Performance Optimization**
   - Profile and optimize hot paths
   - Implement connection pooling
   - Add response caching
   - Optimize JSON serialization

2. **Error Handling**
   - Standardize error codes
   - Add helpful error messages
   - Implement retry logic
   - Add graceful degradation

3. **Documentation**
   - Complete CLI reference
   - Write migration guide
   - Create examples and tutorials
   - Update agent documentation

4. **Testing**
   - Unit tests for all commands
   - Integration tests
   - Performance benchmarks
   - Cross-platform testing

**Deliverables:**
- Optimized CLI implementation
- Comprehensive documentation
- Test suite with >80% coverage
- Performance benchmark report

---

## Appendix A: Command Reference Card

### Quick Reference

```bash
# === FILE OPERATIONS ===
gsi file read <path> [--offset N] [--length N]     Read file
gsi file write <path> --content "..." [--append]   Write file
gsi file edit <path> --old "..." --new "..."       Edit file
gsi file ls <path> [--depth N]                     List directory
gsi file mkdir <path>                              Create directory
gsi file mv <src> <dest>                           Move/rename
gsi file info <path>                               Get metadata
gsi file search <pattern> [--type files|content]   Search

# === PROCESS OPERATIONS ===
gsi process start <cmd> [--shell bash|powershell]  Start process
gsi process send <pid> <input>                     Send input
gsi process output <pid> [--timeout N]             Read output
gsi process list                                   List processes
gsi process kill <pid>                             Kill process

# === SEARCH OPERATIONS ===
gsi search code <pattern> [--file-pattern "*.ts"]  Search code
gsi search files <pattern>                         Find files
gsi search symbol <path> <name>                    Get symbol
gsi search summary <path>                          File analysis

# === INDEX OPERATIONS ===
gsi index build                                    Build index
gsi index refresh                                  Refresh index
gsi index set-path <path>                          Set project path
gsi index watch [--enable]                         Watch for changes

# === THINKING OPERATIONS ===
gsi think seq --thought "..." --next               Sequential think
gsi think tract start <concept>                    Start tractatus
gsi think tract add --content "..."                Add proposition
gsi think tract export [--format json|md]          Export analysis

# === DEBUG OPERATIONS ===
gsi debug create problem "..."                     Create problem
gsi debug create hypothesis "..." --parent ID      Add hypothesis
gsi debug connect <from> <to> hypothesizes         Link nodes
gsi debug query similar-problems --pattern "..."   Query graph

# === DOCUMENTATION ===
gsi docs resolve <library>                         Find library ID
gsi docs get <library-id> [topic] [--mode code]    Get docs

# === WIKI ===
gsi wiki ask <repo> <question>                     Ask about repo
gsi wiki read <repo>                               Read wiki
gsi wiki structure <repo>                          Get structure

# === GRAPH ===
gsi graph analyze <target> find_callers            Analyze code
gsi graph find <query> [--fuzzy]                   Find code
gsi graph dead-code                                Find dead code
gsi graph complexity <function>                    Get complexity
gsi graph watch <path>                             Watch directory
```

---

## Appendix B: Error Codes

| Code | Meaning | HTTP Equivalent |
|------|---------|-----------------|
| 0 | Success | 200 OK |
| 1 | General error | 500 Internal Server Error |
| 2 | Validation error | 400 Bad Request |
| 3 | Not found | 404 Not Found |
| 4 | Permission denied | 403 Forbidden |
| 5 | Timeout | 408 Request Timeout |
| 6 | Configuration error | 500 Internal Server Error |
| 7 | External service error | 502 Bad Gateway |
| 8 | Rate limited | 429 Too Many Requests |

---

## Appendix C: Configuration File Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "version": { "type": "string" },
    "defaults": {
      "type": "object",
      "properties": {
        "output_format": { "enum": ["json", "text", "yaml"] },
        "timeout_ms": { "type": "integer", "minimum": 1000 },
        "verbose": { "type": "boolean" }
      }
    },
    "servers": {
      "type": "object",
      "properties": {
        "context7": {
          "type": "object",
          "properties": {
            "api_key": { "type": "string" }
          }
        },
        "codegraph": {
          "type": "object",
          "properties": {
            "neo4j_uri": { "type": "string" },
            "neo4j_user": { "type": "string" },
            "neo4j_password": { "type": "string" }
          }
        }
      }
    },
    "paths": {
      "type": "object",
      "properties": {
        "cache_dir": { "type": "string" },
        "temp_dir": { "type": "string" }
      }
    }
  }
}
```

---

## Appendix D: Environment Variables

```bash
# GSI Configuration
GSI_CONFIG_PATH=/path/to/config.json
GSI_OUTPUT_FORMAT=json|text|yaml
GSI_TIMEOUT_MS=30000
GSI_VERBOSE=true|false

# Context7
CONTEXT7_API_KEY=ctx7sk-xxx

# CodeGraphContext
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=xxx

# DeepWiki
DEEPWIKI_API_URL=https://api.deepwiki.com

# Debug Thinking
DEBUG_THINKING_DATA_DIR=~/.debug-thinking-mcp

# Sequential Thinking
MAX_HISTORY_SIZE=1000

# Code Index
CODE_INDEX_TEMP_DIR=/tmp/gsi-index
```

---

*End of Document*
