# Tool Priority Rules

> **Purpose:** Enforce MCP tool precedence over native Claude Code tools
> **Status:** ACTIVE - Enforced by hooks/pre-tool-use/mcp-enforcer.js
> **Updated:** 2026-02-19

---

## Executive Summary

**CRITICAL: Native tools (Read, Write, Edit, Grep, Glob, Bash) MUST NOT be used when MCP alternatives exist.**

| Tool Type | Savings | Enforcement |
|-----------|---------|-------------|
| Skills | 80-90% | RECOMMENDED |
| DesktopCommander MCP | 50-70% | REQUIRED |
| Code-Index MCP | 30-50% | REQUIRED |
| Other MCP | 30-50% | PREFERRED |
| Native Tools | 0% | BLOCKED |

---

## Tool Precedence Hierarchy

### Priority Order (MANDATORY)

```
1. Skills (BEST)         - 80-90% token savings
2. DesktopCommander MCP  - 50-70% token savings
3. Code-Index MCP        - 30-50% token savings
4. Other MCP Tools       - 30-50% token savings
5. Native Tools (LAST)   - 0% savings, baseline
```

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

## Blocked Tool Mappings

### File Operations

| Native Tool | MCP Replacement | Token Savings | Status |
|-------------|-----------------|---------------|--------|
| `Read` | `mcp__desktop-commander__read_file` | 80-90% | BLOCKED |
| `Write` | `mcp__desktop-commander__write_file` | 80-90% | BLOCKED |
| `Edit` | `mcp__desktop-commander__edit_block` | 80-90% | BLOCKED |
| `Bash cat` | `mcp__desktop-commander__read_file` | 80-90% | BLOCKED |
| `Bash ls` | `mcp__desktop-commander__list_directory` | 70% | BLOCKED |
| `Bash mkdir` | `mcp__desktop-commander__create_directory` | 80% | BLOCKED |
| `Bash rm` | `mcp__desktop-commander__delete_file` | 80% | BLOCKED |
| `Bash mv` | `mcp__desktop-commander__move_file` | 80% | BLOCKED |

### Search Operations

| Native Tool | MCP Replacement | Token Savings | Status |
|-------------|-----------------|---------------|--------|
| `Grep` | `mcp__code-index-mcp__search_code_advanced` | 50-70% | BLOCKED |
| `Glob` | `mcp__code-index-mcp__find_files` | 50-70% | BLOCKED |
| `Bash grep` | `mcp__code-index-mcp__search_code_advanced` | 50-70% | BLOCKED |
| `Bash find` | `mcp__code-index-mcp__find_files` | 50-70% | BLOCKED |

### Shell Operations (Redirected, Not Blocked)

| Native Command | Redirect To | Status |
|----------------|-------------|--------|
| `Bash` (general) | `mcp__desktop-commander__start_process` | REDIRECTED |
| `git` | Native | ALLOWED |
| `npm/node` | Native | ALLOWED |
| `docker/kubectl` | Native | ALLOWED |

---

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

---

## Usage Patterns

### 1. Reading Files

#### Single File
```javascript
// WRONG (Blocked)
Read({ file_path: "/src/file.ts" })

// CORRECT
mcp__desktop-commander__read_file({ path: "/src/file.ts" })
```

#### Multiple Files (BATCH)
```javascript
// WRONG (Blocked + Inefficient)
Read({ file_path: "/src/file1.ts" })
Read({ file_path: "/src/file2.ts" })
Read({ file_path: "/src/file3.ts" })

// CORRECT (90% savings)
mcp__desktop-commander__read_multiple_files({
  paths: ["/src/file1.ts", "/src/file2.ts", "/src/file3.ts"]
})
```

### 2. Writing Files

```javascript
// WRONG (Blocked)
Write({ file_path: "/src/file.ts", content: "..." })

// CORRECT
mcp__desktop-commander__write_file({ path: "/src/file.ts", content: "..." })
```

### 3. Editing Files

```javascript
// WRONG (Blocked)
Edit({ 
  file_path: "/src/file.ts", 
  old_string: "foo", 
  new_string: "bar" 
})

// CORRECT
mcp__desktop-commander__edit_block({
  file_path: "/src/file.ts",
  old_string: "foo",
  new_string: "bar"
})
```

### 4. Searching Code

```javascript
// WRONG (Blocked)
Grep({ pattern: "function", path: "/src", type: "js" })

// CORRECT
mcp__code-index-mcp__search_code_advanced({
  pattern: "function",
  file_pattern: "*.js",
  max_results: 50
})
```

### 5. Finding Files

```javascript
// WRONG (Blocked)
Glob({ pattern: "**/*.ts", path: "/src" })

// CORRECT
mcp__code-index-mcp__find_files({ pattern: "*.ts" })
```

### 6. Shell Commands

```javascript
// File operations via Bash (Blocked)
Bash({ command: "cat /src/file.ts" })

// CORRECT - Use MCP
mcp__desktop-commander__read_file({ path: "/src/file.ts" })

// Git commands (Allowed)
Bash({ command: "git status" })  // OK
```

---

## Quick Reference Card

### File Operations
```
Read/Write/Edit → mcp__desktop-commander__read_file/write_file/edit_block
Multiple Files  → mcp__desktop-commander__read_multiple_files
List Directory  → mcp__desktop-commander__list_directory
Create Dir      → mcp__desktop-commander__create_directory
Move/Delete     → mcp__desktop-commander__move_file/delete_file
```

### Search Operations
```
Code Search     → mcp__code-index-mcp__search_code_advanced
File Search     → mcp__code-index-mcp__find_files
Symbol Extract  → mcp__code-index-mcp__get_symbol_body
File Summary    → mcp__code-index-mcp__get_file_summary
```

### Process Operations
```
Start Process   → mcp__desktop-commander__start_process
Interact        → mcp__desktop-commander__interact_with_process
List Processes  → mcp__desktop-commander__list_processes
Kill Process    → mcp__desktop-commander__kill_process
```

### Analysis
```
Code Review     → skill: code-review-expert
Thinking        → skill: sequential-thinking
Logic Analysis  → skill: tractatus-thinking
Debug           → skill: debug-thinking
```

---

## Common Mistakes to Avoid

### Mistake 1: Using Native Read
```javascript
// WRONG
Read({ file_path: "/path/to/file.md" })

// CORRECT
mcp__desktop-commander__read_file({ path: "/path/to/file.md" })
```

### Mistake 2: Sequential File Reads
```javascript
// WRONG - 3 separate reads
Read({ file_path: "file1.md" })
Read({ file_path: "file2.md" })
Read({ file_path: "file3.md" })

// CORRECT - Batch read (90% savings)
mcp__desktop-commander__read_multiple_files({
  paths: ["file1.md", "file2.md", "file3.md"]
})
```

### Mistake 3: Using Grep
```javascript
// WRONG
Grep({ pattern: "function", path: "/src" })

// CORRECT
mcp__code-index-mcp__search_code_advanced({
  pattern: "function",
  file_pattern: "*.ts"
})
```

### Mistake 4: Bash for File Operations
```javascript
// WRONG
Bash({ command: "cat /src/file.ts" })

// CORRECT
mcp__desktop-commander__read_file({ path: "/src/file.ts" })
```

---

## Token Savings Reference

| Operation | Native Tokens | MCP Tokens | Savings |
|-----------|---------------|------------|---------|
| Read 1 file | ~6,500 | ~2,300 | 65% |
| Read 5 files | ~32,500 | ~10,000 | 69% |
| Code search | ~6,500 | ~2,600 | 60% |
| Symbol extract | ~11,000 | ~1,300 | 88% |
| File summary | ~8,500 | ~1,000 | 88% |

**Average savings: 80-90%**

See `references/MCP-TOKEN-BENCHMARK.md` for detailed benchmarks.

---

## Hook Configuration

The MCP Enforcer hook is registered in Claude settings:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Write|Edit|Grep|Glob|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node hooks/pre-tool-use/mcp-enforcer.js"
          }
        ]
      }
    ]
  }
}
```

### Hook Response Format

```json
{
  "action": "block",
  "message": "⛔ NATIVE TOOL BLOCKED: Read\n\n💰 TOKEN SAVINGS: 80-90%\n\n📋 PRIMARY MCP REPLACEMENT:\n   mcp__desktop-commander__read_file\n\n📚 Reference: references/MCP-TOKEN-BENCHMARK.md",
  "metadata": {
    "blockedTool": "Read",
    "replacement": "mcp__desktop-commander__read_file",
    "savings": "80-90%",
    "timestamp": "2026-02-19T12:00:00.000Z"
  }
}
```

---

## Enforcement Levels

### Level 1: Block (File Operations)
- **Tools**: Read, Write, Edit
- **Action**: Block with recommendation
- **Recovery**: Use MCP replacement

### Level 2: Redirect (Shell Operations)
- **Tools**: Bash
- **Action**: Block file operations, allow others
- **Recovery**: Use MCP for file ops, native for git/npm

### Level 3: Recommend (Search Operations)
- **Tools**: Grep, Glob
- **Action**: Block with indexed alternative
- **Recovery**: Use Code-Index MCP

---

## Metrics and Monitoring

### Tracked Metrics
- Blocked tool attempts
- MCP tool usage rate
- Token savings per session
- Compliance rate by tool type

### Goals
- 95%+ MCP usage rate
- 80%+ token savings
- <5% native tool usage (exceptions only)

---

## Exception Handling

### Allowed Exceptions

1. **Hook Internal Operations**
   - Hooks themselves use native APIs
   - Path: `hooks/pre-tool-use/*`

2. **System Commands**
   - git, npm, node, docker, kubectl
   - No MCP equivalent needed

3. **Override Mechanism**
   ```
   [FORCE NATIVE]
   Tool: Read
   Reason: MCP server unavailable
   [/FORCE NATIVE]
   ```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-19 | Initial tool priority rules |
| 1.1 | 2026-02-19 | Added comprehensive usage patterns |
| 1.2 | 2026-02-19 | Integrated with mcp-enforcer.js hook |

---

## Related Files

- `hooks/pre-tool-use/mcp-enforcer.js` - Enforcement hook
- `references/MCP-TOKEN-BENCHMARK.md` - Token savings benchmarks
- `hooks/hooks.json` - Hook configuration
- `.claude/settings.json` - Claude Code settings

---

**MEMORIZE: Skills → MCP → Native**
