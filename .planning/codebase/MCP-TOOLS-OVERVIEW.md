# GSI MCP Tools Overview

**Last Updated:** 2026-02-14
**Purpose:** Quick reference for all MCP tools used by GSI

---

## Desktop Commander (DC)

**Purpose:** File operations, process management, search
**Prefix:** `mcp__desktop-commander__`
**Token Savings:** ~71% vs native tools

| Tool | Description | Replaces |
|------|-------------|----------|
| `read_file` | Read file contents with offset/length | Native Read |
| `write_file` | Write/create files with chunking | Native Write |
| `edit_block` | Surgical text replacements | Native Edit |
| `list_directory` | List folder contents with depth control | Bash ls |
| `create_directory` | Create directories recursively | Bash mkdir |
| `move_file` | Move/rename files | Bash mv |
| `get_file_info` | File metadata (size, dates, permissions) | Bash stat |
| `start_process` | Launch terminal processes | Bash |
| `interact_with_process` | Send input to running processes | N/A |
| `read_process_output` | Get output from processes | N/A |
| `start_search` | Background file/content search | Grep/Glob |
| `get_more_search_results` | Paginate search results | N/A |
| `list_processes` | Show running processes | Bash ps |
| `kill_process` | Terminate processes by PID | Bash kill |
| `force_terminate` | Force kill stuck processes | Bash kill -9 |
| `list_sessions` | Show active terminal sessions | N/A |
| `get_config` | Get Desktop Commander configuration | N/A |
| `set_config_value` | Update configuration | N/A |

---

## Code-Index MCP (CI)

**Purpose:** Code search, symbol navigation, file analysis
**Prefix:** `mcp__code-index-mcp__`
**Token Savings:** ~80% vs native Grep/Glob

| Tool | Description |
|------|-------------|
| `search_code_advanced` | Regex search with pagination and context |
| `find_files` | Glob pattern file search |
| `get_file_summary` | Line count, functions, imports, complexity |
| `get_symbol_body` | Extract function/class source code |
| `build_deep_index` | Full project symbol extraction |
| `set_project_path` | Define project root for indexing |
| `refresh_index` | Rebuild index after changes |
| `configure_file_watcher` | Auto-index on file changes |
| `get_file_watcher_status` | Check watcher health |
| `check_temp_directory` | Verify index storage |
| `get_settings_info` | Current configuration state |

---

## CodeGraphContext (CG)

**Purpose:** Code relationship analysis, graph queries
**Connection:** `neo4j://localhost:7687`
**Token Savings:** ~85% combined with DC+CI

| Tool | Description |
|------|-------------|
| `query` / `execute_cypher_query` | Neo4j Cypher queries |
| `find_path` | Trace dependencies between components |
| `analyze_impact` | Assess change ripple effects |
| `visualize` | Generate graph visualizations |
| `find_components` | Identify coupled modules |
| `get_statistics` | Graph metrics and counts |
| `suggest_refactor` | AI-powered refactoring suggestions |
| `add_code_to_graph` | Index new code into Neo4j |
| `watch_directory` | Auto-index directory changes |

---

## Thinking Servers

### Sequential Thinking
**Prefix:** `mcp__sequential-thinking__sequentialthinking`
**Purpose:** Step-by-step problem decomposition

- Multi-step reasoning with revision support
- Branch/merge reasoning paths
- Used for: Planning, complex analysis, verification chains

### Tractatus Thinking
**Prefix:** `mcp__tractatusthinking__tractatus_thinking`
**Purpose:** Logical concept analysis (Wittgenstein-style)

| Operation | Description |
|-----------|-------------|
| `start` | Begin analysis with concept |
| `add` | Add proposition to hierarchy |
| `navigate` | Move through proposition tree |
| `export` | Export as markdown/json/graphviz |
| `analyze` | Check completeness |
| `revise` | Update propositions |
| `undo` | Revert changes |
| `move` | Restructure hierarchy |

### Debug Thinking
**Prefix:** `mcp__debug-thinking__debug_thinking`
**Purpose:** Graph-based debugging knowledge management

| Node Type | Description |
|-----------|-------------|
| `problem` | Issue to solve |
| `hypothesis` | Potential cause |
| `experiment` | Test to run |
| `observation` | What happened |
| `learning` | Knowledge gained |
| `solution` | Fix applied |

**Persistence:** `~/.debug-thinking-mcp/`

---

## Documentation Servers

### Context7
**Prefix:** `mcp__context7__`

| Tool | Description |
|------|-------------|
| `resolve-library-id` | Find library by name |
| `get-library-docs` | Fetch up-to-date library documentation |

**Usage:** API research, library examples, version-specific docs

### DeepWiki
**Prefix:** `mcp__deepwiki__`

| Tool | Description |
|------|-------------|
| `ask_question` | Query GitHub repos with AI |
| `read_wiki_contents` | View full repo documentation |
| `read_wiki_structure` | Get documentation topic list |

**Usage:** GitHub repo research, understanding codebases

---

## Web Tools

### RAG-Web-Browser
**Prefix:** `mcp__rag-web-browser__`

| Tool | Description |
|------|-------------|
| `search` | Google search + web page extraction |

**Output Formats:** markdown, text, HTML

### Web-Reader
**Prefix:** `mcp__web_reader__`

| Tool | Description |
|------|-------------|
| `webReader` | Fetch URLs and convert to LLM-friendly format |

**Features:** Preserves images, links, structure

### Context-Crawl
**Prefix:** `mcp__context-crawl__`

| Tool | Description |
|------|-------------|
| `crawl` | Intelligent website crawling |
| `fetch_url` | Single URL fetch |
| `parse_html` | Extract structured data |
| `browser_navigate` | Navigate to URL |
| `browser_click` | Click elements |
| `browser_fill` | Fill form fields |
| `browser_screenshot` | Capture page |
| `store_with_rag` | Create RAG indices |

---

## Utility Servers

### DeepSeek-OCR
**Prefix:** `mcp__deepseek-ocr__`

| Tool | Description |
|------|-------------|
| `deepseek_ocr_extract` | Extract text from images |
| `deepseek_ocr_custom` | Custom prompt OCR |

**Output:** Markdown format

### 4.5V-MCP (Vision)
**Prefix:** `mcp__4_5v_mcp__`

| Tool | Description |
|------|-------------|
| `analyze_image` | Vision model image analysis |

---

## Golden Pattern (Tool Chain)

```
CG → CI → CI → DC → DC → CI
(discover → understand → act → verify)
```

| Phase | Tools | Purpose |
|-------|-------|---------|
| Discover | CG | Find relationships, dependencies |
| Understand | CI → CI | Search code, get symbols |
| Act | DC → DC | Read/write files, run processes |
| Verify | CI | Search and confirm changes |

---

## Priority Order

```
Skills > Desktop Commander MCP > Code-Index MCP > CodeGraphContext MCP > Native Tools
```

| Priority | Type | Token Savings |
|----------|------|---------------|
| 1 | Skills | 80-90% |
| 2 | Desktop Commander | 50-70% |
| 3 | Code-Index MCP | 30-50% |
| 4 | CodeGraphContext | 30-50% |
| 5 | Native Tools | 0% (baseline) |

---

## Token Efficiency Summary

| Tool | Savings vs Native |
|------|-------------------|
| Desktop Commander | ~71% |
| Code-Index MCP | ~80% |
| Combined (Golden Pattern) | ~85% |
| With Batching | ~90% |

---

## Quick Reference

```
# File Operations
read_file, write_file, edit_block → DC

# Code Search
search_code_advanced, find_files → CI

# Symbol Navigation
get_symbol_body, get_file_summary → CI

# Relationships
query, find_path, analyze_impact → CG

# Thinking
sequentialthinking, tractatus_thinking, debug_thinking

# Documentation
get-library-docs (context7), ask_question (deepwiki)

# Web
search (rag-web-browser), webReader, crawl (context-crawl)
```

---

*Generated by GSI Phase 13 - Comprehensive Testing*
