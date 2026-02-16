# MCP Quick Reference - GSI

**Phase:** 10-mcp-tools-audit
**Plan:** 10-01
**Purpose:** Quick decision matrix for MCP tool selection in GSI workflows
**Last Updated:** 2026-02-13

---

## Tool Selection Matrix

### File Operations

| Operation | Native Tool | MCP Tool | Token Savings | When to Use |
|------------|-------------|-----------|---------------|-------------|
| Read file | `Read` | `mcp__desktop-commander__read_file` | ~70% | Always |
| Write file | `Write` | `mcp__desktop-commander__write_file` | ~75% | Always |
| Edit file | `Edit` | `mcp__desktop-commander__edit_block` | ~60% | Always |
| List directory | `Bash ls` | `mcp__desktop-commander__list_directory` | ~80% | Always |
| Create directory | `Bash mkdir` | `mcp__desktop-commander__create_directory` | ~65% | Always |
| Move file | `Bash mv` | `mcp__desktop-commander__move_file` | ~70% | Always |
| File info | `Bash stat` | `mcp__desktop-commander__get_file_info` | ~75% | Always |

### Code Search

| Operation | Native Tool | MCP Tool | Token Savings | When to Use |
|------------|-------------|-----------|---------------|-------------|
| Search code | `Grep` | `mcp__code-index-mcp__search_code_advanced` | ~80% | Always |
| Find files | `Glob` | `mcp__code-index-mcp__find_files` | ~75% | Always |
| Get symbol | Manual | `mcp__code-index-mcp__get_symbol_body` | ~90% | Need function code |
| File summary | Manual | `mcp__code-index-mcp__get_file_summary` | ~85% | File analysis |

### Process Operations

| Operation | Native Tool | MCP Tool | Token Savings | When to Use |
|------------|-------------|-----------|---------------|-------------|
| Start process | `Bash` | `mcp__desktop-commander__start_process` | ~50% | Long-running commands |
| Interact | N/A | `mcp__desktop-commander__interact_with_process` | N/A | REPL sessions |
| Read output | N/A | `mcp__desktop-commander__read_process_output` | ~60% | Process monitoring |

### Thinking Operations

| Operation | Server | Tool | When to Use |
|------------|--------|------|-------------|
| Multi-step | sequential-thinking | `sequentialthinking` | Complex problems |
| Graph debug | debug-thinking | `debug_thinking` | Bug tracking |
| Structure analysis | tractatus-thinking | `tractatus_thinking` | Architecture |

### Knowledge Operations

| Operation | Server | Tool | When to Use |
|------------|--------|------|-------------|
| Library docs | context7 | `get-library-docs` | API reference |
| GitHub wiki | deepwiki | `ask_question` | Repository knowledge |
| Graph query | CodeGraphContext | `execute_cypher_query` | Relationships |

---

## Decision Tree

```
Need to perform operation?
|
├─ File operation?
│  └─> Use desktop-commander (mcp__desktop-commander__*)
|
├─ Code search?
│  └─> Use code-index-mcp (mcp__code-index-mcp__*)
|
├─ Process/terminal?
│  ├─ Interactive? → interact_with_process
│  └─ One-time? → start_process
|
├─ Thinking/analysis?
│  ├─ Multi-step? → sequential-thinking
│  ├─ Structure? → tractatus-thinking
│  └─ Debug? → debug-thinking
|
├─ Code relationships?
│  └─> Use CodeGraphContext (neo4j://localhost:7687)
|
├─ External knowledge?
│  ├─ Library docs? → context7
│  ├─ GitHub repo? → deepwiki
│  └─ Web search? → rag-web-browser (needs APIFY_TOKEN)
|
└─ Image analysis?
   └─> Use 4.5v-mcp (analyze_image)
```

---

## Common Patterns

### Golden Pattern (3-MCP Integration)
```
CG (CodeGraphContext) - Analyze relationships
  ↓
CI (CodeIndex) - Search code
  ↓
DC (DesktopCommander) - Execute operations
```

### File Audit Pattern
```
1. DC: list_directory - Get all files
2. CI: search_code_advanced - Find patterns
3. DC: read_file - Get content
4. CI: get_file_summary - Analyze
```

### Code Analysis Pattern
```
1. CG: execute_cypher_query - Find relationships
2. CI: get_symbol_body - Get function code
3. CI: search_code_advanced - Find usages
4. DC: edit_block - Apply changes
```

---

## Troubleshooting

### Server Not Responding

**desktop-commander**
- Check: Claude Code running?
- Restart: Reload Claude Code
- Config: `get_config` for diagnostics

**code-index-mcp**
- Check: `get_settings_info` - temp dir exists?
- Fix: `create_temp_directory` if needed
- Reset: `clear_settings` then reconfigure

**CodeGraphContext**
- Check: Neo4j running at localhost:7687?
- Command: `docker ps | grep neo4j`
- Start: See MCP-SERVER-AUDIT.md Task 4

### Connection Issues

**sequential-thinking**
- Tool name: `sequentialthinking` (one word)
- No issues reported

**tractatus-thinking**
- Issue: Tool name mismatch
- Try: `tractatus_thinking` (underscore, not hyphen)

**debug-thinking**
- Status: Working
- Storage: `~/.debug-thinking-mcp/`

### Performance Tips

1. **Use batch operations:**
   - `read_multiple_files` instead of multiple `read_file`
   - Batch size: 5-10 files

2. **Cache when possible:**
   - CI results cache automatically
   - Reuse symbol bodies

3. **Choose right tool:**
   - `find_files` for names
   - `search_code_advanced` for content
   - Don't mix up

4. **Index status:**
   - `get_file_watcher_status` - auto-rebuild enabled?
   - `refresh_index` - after git operations

---

## Server Priority (GSI)

1. **Primary (Always Available):**
   - desktop-commander
   - code-index-mcp
   - CodeGraphContext

2. **Thinking (Conditional):**
   - sequential-thinking ✅
   - debug-thinking ✅
   - tractatus-thinking ⚠️ (name issue)

3. **Knowledge (Conditional):**
   - context7 ✅
   - deepwiki ✅
   - rag-web-browser ❌ (needs config)

4. **Special Purpose:**
   - deepseek-ocr ❌ (needs modal)
   - 4.5v-mcp ⚠️ (not tested)
   - context-crawl ⚠️ (network issues)

---

## Quick Commands

### Check All Server Status
```javascript
// Run these in sequence
mcp__desktop-commander__get_config()
mcp__code-index-mcp__get_settings_info()
mcp__CodeGraphContext__get_repository_stats()
```

### Refresh All Indexes
```javascript
// After git operations
mcp__code-index-mcp__refresh_index()
mcp__CodeGraphContext__watch_directory("/path/to/repo")
```

### Emergency Reset
```javascript
// If something breaks
mcp__desktop-commander__get_config() // Check config
mcp__code-index-mcp__clear_settings() // Reset CI
```

---

**Status:** ✅ Quick reference complete

---

## Thinking Server Quick Reference

### When to Use Which Server

| Problem Type | Server | Prompt Pattern |
|--------------|--------|----------------|
| Multi-step task | Sequential | "Thought 1: Plan... Thought 2: Execute... Thought 3: Verify" |
| Architecture analysis | Tractatus | "Concept: 'Analyze X'. Add propositions. Export findings." |
| Bug investigation | Debug | "Query similar problems. Create hypothesis. Test. Record learning." |

### Thinking + MCP Integration

```
1. THINK (plan with Sequential/Tractatus)
   |
   v
2. MCP TOOLS (execute with DC/CI/CG)
   |
   v
3. THINK (verify with Sequential/Debug)
```

### Quick Token Guide

| Server | Tokens | Best For |
|--------|--------|----------|
| Sequential | 1-3K | Multi-step planning, verification |
| Tractatus | 1-2K | Structure analysis, architecture |
| Debug | 1-2K | Bug tracking, pattern learning |

### 7-BMAD Quick Mapping

| Circle | Thinking | MCP Tools |
|--------|----------|-----------|
| Method | Sequential | DC/CI (implement) |
| Mad | Debug | CG (integrate) |
| Model | Tractatus | CG (architecture) |
| Mode | Tractatus | CI (patterns) |
| Mod | Sequential | DC/CI (maintain) |
| Modd | Tractatus | CG (extend) |
| Methodd | Sequential | DC (document) |
