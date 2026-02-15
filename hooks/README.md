# Hook Files Documentation

## Overview

This directory contains hook files that extend the GSI (Get Shit Indexed) functionality. These hooks run automatically at various points in the development workflow.

## Hook Files

### 1. gsi-check-update.js
**Purpose:** Checks for available updates to GSI tools and documentation
**Trigger:** Before each command execution
**Uses:** Native Node.js `fs` and `fetch` modules
**Location:** `.hooks/gsi-check-update.js`

### 2. gsi-statusline.js
**Purpose:** Displays status information in the terminal
**Trigger:** After successful command execution
**Uses:** Native Node.js `fs` module
**Location:** `.hooks/gsi-statusline.js`

### 3. mcp-enforcer.js
**Purpose:** Enforces MCP tool usage patterns and provides warnings
**Trigger:** Before each command execution
**Uses:** Native Node.js `fs` module
**Location:** `.hooks/mcp-enforcer.js`

### 4. hooks.json
**Purpose:** Configuration file for hook behavior
**Format:** JSON configuration
**Location:** `.hooks/hooks.json`

### 5. start-cg-server.ps1
**Purpose:** Starts the CodeGraphContext Neo4j server
**Trigger:** On demand or via `start-cg-server` command
**Uses:** Native PowerShell commands
**Location:** `.hooks/start-cg-server.ps1`

## MCP Tool Limitations in Hooks

### Why Hooks Cannot Use MCP Tools Directly

Hook files have a unique constraint: they run **before** MCP tools are initialized in the agent environment. This creates the following limitations:

#### 1. Timing Issue
- MCP tools are initialized after the PreToolUse hook completes
- Hooks run during the tool selection phase, before any MCP tool calls
- This creates a chicken-and-egg problem for hook implementation

#### 2. Environment Isolation
- Hooks run in a separate Node.js process from the agent
- MCP tools require the full agent environment with server connections
- No direct access to CI (Code-Index) or CG (CodeGraphContext) servers

#### 3. Performance Considerations
- Hooks need to be fast and lightweight
- Establishing MCP connections would add startup overhead
- Hooks are meant to be minimal checks, not full operations

### Native Tools Are Required

Given these constraints, hook files must use native Node.js modules:

```javascript
// Required for all hooks
const fs = require('fs');
const path = require('path');
const os = require('os');

// For update checking
const https = require('https');
const { fetch } = require('node-fetch'); // gsi-check-update.js
```

### MCP Recommendations in Hooks

While hooks cannot use MCP tools directly, they can **recommend** MCP usage to agents:

#### mcp-enforcer.js Recommendations
- **Batch Reading:** Suggests `read_multiple_files` for file operations
- **Code Search:** Recommends `search_code_advanced` instead of grep
- **Relationship Analysis:** Points to CodeGraphContext for complex queries
- **Token Savings:** Includes estimates for MCP vs native operations

#### gsi-check-update.js Documentation
- Comments explain why native `fetch` is used (timing)
- References MCP alternatives for future implementations
- Documents the hook constraint clearly

#### gsi-statusline.js Documentation
- Explains native file reading necessity
- References `read_multiple_files` pattern for agents
- Documents why MCP cannot be used in hook context

### Best Practices for Hook Development

#### 1. Keep Hooks Minimal
- Focus on single, specific responsibilities
- Avoid complex operations or dependencies
- Keep execution time under 100ms

#### 2. Document MCP Alternatives
- Always comment why native tools are used
- Reference the appropriate MCP tool pattern
- Include token savings estimates where possible

#### 3. Provide Clear Error Messages
- Explain hook failures with actionable messages
- Include MCP recommendations in error output
- Guide users toward optimal tool usage

#### 4. Avoid Side Effects
- Hooks should not modify files unless absolutely necessary
- Prefer read-only operations when possible
- Document any file modifications in the hook's purpose

### Hook vs Agent Tool Usage

| Operation | Hook Usage | Agent Recommendation |
|-----------|------------|-------------------|
| File Reading | `fs.readFileSync()` | `read_multiple_files` (batch, 90% token savings) |
| File Writing | `fs.writeFileSync()` | `write_file` (skill, 80% token savings) |
| Code Search | Not applicable | `search_code_advanced` (CI, 50% token savings) |
| Directory Listing | `fs.readdir()` | `list_directory` (DC, 70% token savings) |
| Process Execution | `child_process` | `start_process` (DC, 60% token savings) |
| Relationship Analysis | Not applicable | `query` (CG, 40% token savings) |

### Future Considerations

#### Potential Hook Alternatives
1. **Post-Hook MCP Calls**: Run MCP operations after hook validation
2. **Hook Service**: Separate service with MCP capabilities
3. **Agent Pre-Flight**: Move hook logic into agent as pre-flight checks
4. **Lazy MCP Initialization**: Initialize MCP tools within hook if needed

#### Trade-offs Analysis
- **Option 1**: Adds complexity but enables MCP in hooks
- **Option 2**: Clean separation but adds service management
- **Option 3**: Simpler flow but moves logic out of hooks
- **Option 4**: Elegant but requires MCP server availability

Current approach keeps hooks simple and focused on their core responsibilities while providing clear guidance to agents for MCP usage.

## MCP Tools Reference

For agents, here are the MCP tools that should be used instead of native operations:

### Desktop Commander Tools
- `read_multiple_files`: Batch file reading (90% token savings)
- `list_directory`: Directory listing with metadata
- `start_process`: Process execution with state tracking
- `get_file_info`: File metadata extraction
- `move_file`: Atomic file operations

### Code-Index MCP Tools
- `search_code_advanced`: Fast code search with regex support
- `find_files`: Pattern-based file discovery
- `get_symbol_body`: Function/class source extraction
- `build_deep_index`: Complete symbol indexing
- `get_file_summary`: Quick file analysis

### CodeGraphContext Tools
- `query`: Neo4j relationship queries
- `find_path`: Path analysis between code elements
- `analyze_impact`: Change impact analysis
- `visualize`: Graph visualization
- `get_statistics`: Repository metrics

## Conclusion

Hook files serve an important role in the GSI workflow by providing lightweight pre- and post-operation checks. While they cannot use MCP tools directly due to timing and environment constraints, they should actively promote MCP usage to agents through clear documentation and recommendations.