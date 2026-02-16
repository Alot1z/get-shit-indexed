# Tool Priority Rules

## ⛔ ENFORCEMENT: NATIVE TOOLS ARE BLOCKED

**CRITICAL: Native tools (Bash, Read, Write, Edit, Grep, Glob) MUST NOT be used when MCP alternatives exist.**

### Blocked Tool Mappings

| Native Tool | MCP Replacement | Blocked? |
|-------------|-----------------|----------|
| `Read` | `mcp__desktop-commander__read_file` | ✅ YES |
| `Write` | `mcp__desktop-commander__write_file` | ✅ YES |
| `Edit` | `mcp__desktop-commander__edit_block` | ✅ YES |
| `Bash ls` | `mcp__desktop-commander__list_directory` | ✅ YES |
| `Bash mkdir` | `mcp__desktop-commander__create_directory` | ✅ YES |
| `Bash cat` | `mcp__desktop-commander__read_file` | ✅ YES |
| `Bash rm/mv/cp` | `mcp__desktop-commander__*` | ✅ YES |
| `Grep` | `mcp__code-index-mcp__search_code_advanced` | ✅ YES |
| `Glob` | `mcp__code-index-mcp__find_files` | ✅ YES |
| `Bash` (commands) | `mcp__desktop-commander__start_process` | ✅ YES |

**Only allowed for:** GSI-tools.js wrapper (no MCP equivalent), Task tool (orchestration requirement)

---

## CRITICAL RULE: MCP Tools Over Native Tools

**This is the single most important rule for token optimization.**

### Priority Order (MANDATORY)

1. **Skill Tools FIRST** - 80-90% token savings
2. **DesktopCommander MCP SECOND** - 50-70% token savings  
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

## Tool Selection Matrix

### File Operations

| Operation | Skill | DesktopCommander MCP | Native | Use |
|-----------|-------|---------------------|--------|-----|
| Read File | `desktop-commander` | `read_file` | `Read` | Skill |
| Write File | `desktop-commander` | `write_file` | `Write` | Skill |
| Edit File | `desktop-commander` | `edit_block` | `Edit` | Skill |
| List Directory | `desktop-commander` | `list_directory` | `Bash ls` | Skill |
| Search Files | `desktop-commander` | `start_search` | `Grep/Glob` | Skill |
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
| Code Search | `code-index-mcp` | `search_code_advanced` | `Grep` | MCP |
| Symbol Search | `code-index-mcp` | `get_symbol_body` | Manual | MCP |
| File Search | `code-index-mcp` | `find_files` | `Glob` | MCP |
| Build Index | `code-index-mcp` | `build_deep_index` | N/A | MCP |

**RULE: Use `code-review-expert` skill for review, MCP for search**

### Analysis Operations

| Operation | Skill | MCP | Native | Use |
|-----------|-------|-----|--------|-----|
| Sequential Thinking | `sequential-thinking` | `sequentialthinking` | Manual | Skill |
| Tractatus Thinking | `tractatus-thinking` | `tractatus_thinking` | Manual | Skill |
| Debug Thinking | `debug-thinking` | `debug_thinking` | Manual | Skill |
| Deep Wiki | `deepwiki` | `ask_question` | Web Search | MCP |
| Context7 Docs | `context7` | `get-library-docs` | Web Search | MCP |

**RULE: Skills for thinking, MCP for external knowledge**

## Decision Tree

```
Need to perform operation?
↓
Is there a Skill for it?
YES → Use Skill (STOP)
↓
NO
↓
Is there an MCP tool for it?
YES → Use MCP tool (STOP)
↓
NO
↓
Use Native tool (LAST RESORT)
```

## Common Mistakes to Avoid

### ❌ WRONG: Using Native Tools When MCP Available
```javascript
// BAD: Uses native Read tool
Read: {
  file_path: "/path/to/file.txt"
}
```

### ✅ CORRECT: Using DesktopCommander Skill
```javascript
// GOOD: Uses desktop-commander skill
skill: "desktop-commander"
```

### ❌ WRONG: Using Bash for File Operations
```javascript
// BAD: Uses native Bash tool
Bash: {
  command: "cat /path/to/file.txt"
}
```

### ✅ CORRECT: Using DesktopCommander MCP
```javascript
// GOOD: Uses DesktopCommander read_file
mcp__desktop-commander__read_file: {
  path: "/path/to/file.txt"
}
```

### ❌ WRONG: Using Native Grep
```javascript
// BAD: Uses native Grep tool
Grep: {
  pattern: "function foo",
  path: "/src"
}
```

### ✅ CORRECT: Using DesktopCommander Search
```javascript
// GOOD: Uses DesktopCommander start_search
mcp__desktop-commander__start_search: {
  path: "/src",
  pattern: "function foo",
  searchType: "content"
}
```

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

## Enforcement

### Agent Behavior

All agents MUST:

1. **Check Skills First** - Always look for relevant skill before using MCP
2. **Check MCP Second** - Always look for MCP tool before using native
3. **Document Decision** - If using native tool, explain why no alternative
4. **Optimize Calls** - Batch operations when possible

### Validation

Auto-validation system checks:

1. **Tool Selection** - Were higher-priority tools available?
2. **Batching** - Could operations have been batched?
3. **Efficiency** - Is there a more token-efficient approach?

### Failure to Comply

If agent uses native tool when MCP/skill available:

1. **Warning** - First time: educational feedback
2. **Correction** - Second time: automatic tool substitution
3. **Training** - Third time: update agent prompt with rule reinforcement

## Configuration

### Default Behavior
- Strict mode: ENFORCED (native tools rejected if MCP/skill available)
- Fallback timeout: 30 seconds (before allowing native tool)
- Batch size: 10 operations (before auto-batching)

### Override

Agent can override with justification:
```javascript
{
  tool: "Native",
  reason: "MCP tool unavailable for specific feature X",
  expected_savings: "0 tokens (no alternative)"
}
```

## Metrics and Monitoring

### Track
- Skill usage rate vs MCP vs Native
- Token savings per operation type
- Agent compliance rate
- Common violation patterns

### Goals
- 90%+ skill usage where available
- 95%+ MCP usage where skill unavailable
- <5% native tool usage (only true fallbacks)
- 80%+ overall token savings

## Quick Reference Card

### File Ops
```
Read/Write/Edit → desktop-commander skill
List/Search → desktop-commander skill
Info/Meta → desktop-commander skill
```

### Process Ops
```
Start/Interact → desktop-commander skill
List/Kill → desktop-commander skill
```

### Code Ops
```
Review → code-review-expert skill
Search → code-index-mcp
Symbols → code-index-mcp
```

### Analysis
```
Thinking → sequential-thinking skill
Logic → tractatus-thinking skill
Debug → debug-thinking skill
Docs → context7/deepwiki MCP
```

**MEMORIZE: Skills → MCP → Native**

## Version History

- v1.0: Initial tool priority rules
- DesktopCommander skill integration
- Token optimization metrics
- Auto-validation enforcement
