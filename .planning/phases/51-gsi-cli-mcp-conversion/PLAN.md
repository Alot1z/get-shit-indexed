# Phase 51: GSI → CLI/MCP Conversion

## Objective
Convert GSI from markdown-based commands to a proper CLI tool / MCP server with zero token waste.

## Current Problems
1. **Token Waste**: Commands are markdown files loaded into context (5-10K tokens each)
2. **No Real Agents**: Commands read files, don't spawn actual sub-agents
3. **Wrong Tools**: Uses native Read/Write/Bash instead of MCP tools
4. **No Compression**: No skill compression or pre-compressed tool definitions

## Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    gsi-cli (Binary)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  $ gsi progress          → Task(subagent) → MCP tools      │
│  $ gsi execute-phase 9   → Task(subagent) → TDD workflow   │
│  $ gsi yolo on           → Config flag                     │
│  $ gsi debug "issue"     → Task(debug-agent)               │
│                                                             │
│  Each command:                                              │
│  1. Spawns REAL sub-agent via Task tool                    │
│  2. Uses MCP tools exclusively (desktop-commander, etc.)   │
│  3. Returns compressed results only                        │
│  4. No markdown files loaded into context                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Tool Priority (CRITICAL)
All GSI agents MUST use MCP tools:

| Operation | Use This | NOT This |
|-----------|----------|----------|
| Read file | `mcp__desktop-commander__read_file` | `Read` |
| Write file | `mcp__desktop-commander__write_file` | `Write` |
| Edit file | `mcp__desktop-commander__edit_block` | `Edit` |
| List dir | `mcp__desktop-commander__list_directory` | `Bash ls` |
| Search | `mcp__code-index-mcp__search_code_advanced` | `Grep` |
| Find files | `mcp__code-index-mcp__find_files` | `Glob` |
| Process | `mcp__desktop-commander__start_process` | `Bash` |

## Token Savings Estimate
- Current: 5-10K tokens per command (markdown + context)
- Target: 50-100 tokens per command (spawns agent, returns result)
- **Savings: 98%+**

## Implementation Tasks

### Task 51.1: Create CLI Entry Point (`bin/gsi.js`)
### Task 51.2: Create Agent Definitions (`lib/gsi-cli/agents/`)
### Task 51.3: MCP Server Wrapper (`lib/gsi-cli/mcp-server.js`)
### Task 51.4: Convert Commands to Agents
### Task 51.5: Install as Global CLI

## Success Criteria
- [ ] `gsi progress` runs without loading markdown files
- [ ] `gsi execute-phase 9` spawns real sub-agent
- [ ] All agents use MCP tools exclusively
- [ ] Token usage reduced by 95%+
- [ ] Tests pass with new architecture

## Priority
**HIGH** - This is foundational for the entire system to work efficiently.
