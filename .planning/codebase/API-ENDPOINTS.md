# API Endpoints Documentation - GSI (Get Shit Indexed)

**Audit Date:** 2026-02-13
**Project:** Alot1z/get-shit-indexed (GSI)
**Purpose:** Document all REST, GraphQL, WebSocket, and MCP endpoints

## Summary

| API Type | Endpoints | Authenticated | Status |
|-----------|-----------|--------------|--------|
| REST (External) | 6 | Yes | Active |
| MCP (Local) | 24+ | N/A | Active |
| CLI Commands | 50+ | Varies | Active |
| WebSocket | 0 | N/A | Not Used |

---

## 1. External REST APIs

### Anthropic Claude API

**Base URL:** `https://api.anthropic.com`

| Endpoint | Method | Purpose | Location | Auth |
|----------|--------|---------|---------|------|
| /v1/messages | POST | Chat completion | bin/gsi-tools.js | API Key |
| /v1/models | GET | List models | (implicit) | API Key |

#### Implementation

**File:** `bin/gsi-tools.js`

```javascript
const response = await fetch(
  'https://api.anthropic.com/v1/messages',
  {
    headers: {
      'Accept': 'application/json',
      'X-Subscription-Token': apiKey
    }
  }
);
```

**Purpose:** Subscription validation for GSI tools

**Response Format:** JSON
**Error Handling:** HTTP status codes, try-catch wrapper

### Stripe API (Template References)

**Base URL:** `https://api.stripe.com`

| Endpoint | Purpose | Template | Auth |
|----------|---------|----------|------|
| /v1/webhooks | Webhook configuration | user-setup.md | API Key |
| /v1/checkout | Checkout sessions | user-setup.md | Secret Key |

**Status:** Example code only, not active integration

### Supabase API (Template References)

**Base URL:** Project-specific

| Endpoint | Purpose | Template | Auth |
|----------|---------|----------|------|
| /auth/v1/user | Email auth | user-setup.md | Anon Key |
| /rest/v1/ | Database queries | user-setup.md | Service Role |

**Status:** Example code only, not active integration

### SendGrid API (Template References)

**Base URL:** `https://api.sendgrid.com`

| Endpoint | Purpose | Template | Auth |
|----------|---------|----------|------|
| /v3/mail/send | Send emails | user-setup.md | API Key |

**Status:** Example code only, not active integration

---

## 2. MCP (Model Context Protocol) Servers

### Desktop Commander MCP

**Connection:** `mcp__desktop-commander__*`

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| read_file | Read file contents | path | File content |
| write_file | Write/create file | path, content, mode | Success status |
| edit_block | Surgical text replacement | file_path, old_string, new_string | Replacement count |
| list_directory | Directory listing | path, depth | File/directory tree |
| start_process | Execute shell command | command, timeout_ms | PID, output |
| interact_with_process | Send input to process | pid, input | Process output |
| read_process_output | Get process output | pid | Output buffer |
| start_search | Search files/content | path, pattern, searchType | Session ID |
| get_file_info | File metadata | path | Size, dates, permissions |
| move_file | Move/rename | source, destination | Success status |
| create_directory | Create directory | path | Success status |
| kill_process | Terminate process | pid | Success status |
| get_config | Server configuration | - | Config object |
| set_config_value | Update config | key, value | Success status |

**Status:** Active (local server)
**Port:** Dynamic (stdin/stdout IPC)
**Authentication:** Local process (no network auth)

### Code Index MCP

**Connection:** `mcp__code-index-mcp__*`

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| build_deep_index | Build symbol index | - | Index stats |
| find_files | Find by pattern | pattern | File list |
| search_code_advanced | Search code | pattern, file_pattern | Matches with context |
| get_file_summary | File metrics | file_path | Line count, imports, functions |
| get_symbol_body | Get function code | file_path, symbol_name | Source code |
| set_project_path | Set index root | path | Success status |
| refresh_index | Rebuild index | - | Index stats |
| get_settings_info | Server config | - | Settings object |
| get_file_watcher_status | Watcher status | - | Watched paths |

**Status:** Active (local server)
**Port:** Dynamic (stdin/stdout IPC)
**Database:** SQLite-based (temporary directory)
**Authentication:** Local process (no network auth)

### CodeGraphContext MCP (Neo4j)

**Connection:** `mcp__CodeGraphContext__*`

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| execute_cypher_query | Run Cypher query | cypher_query | Graph results |
| analyze_code_relationships | Code analysis | query_type, target | Relationships |
| find_code | Text search | query | Matches |
| find_most_complex_functions | Complexity analysis | limit | Functions with cyclomatic complexity |
| find_dead_code | Unused code detection | exclude_decorated_with | Dead code report |
| visualize_graph_query | Generate visualization | cypher_query | Neo4j Browser URL |
| get_repository_stats | Repository metrics | repo_path | File/function/class counts |

**Status:** Active (Neo4j server required)
**Neo4j URL:** `neo4j://localhost:7687`
**Authentication:** Local Neo4j (no network auth)

### Context7 MCP

**Connection:** `mcp__context7__*`

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| resolve-library-id | Find library docs | libraryName | Library ID |
| get-library-docs | Fetch docs | context7CompatibleLibraryID, mode | Documentation |

**Status:** Active (external service)
**Authentication:** None (public API)
**Mode:** `code` (API references) or `info` (conceptual guides)

### DeepWiki MCP

**Connection:** `mcp__deepwiki__*`

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| ask_question | Query repo | repoName, question | AI-powered answer |
| read_wiki_contents | Get docs | repoName | Wiki content |
| read_wiki_structure | List topics | repoName | Topic hierarchy |

**Status:** Active (external service)
**Authentication:** None (public GitHub API)
**Rate Limit:** GitHub API limits apply

### Sequential Thinking MCP

**Connection:** `mcp__sequential-thinking__sequentialthinking`

| Parameter | Purpose |
|-----------|---------|
| thought | Current thinking step |
| nextThoughtNeeded | Continue thinking |
| thoughtNumber | Step number |
| totalThoughts | Estimated steps |
| isRevision | Revising previous thought |
| revisesThought | Which thought to revise |
| branchFromThought | Branching point |
| branchId | Branch identifier |
| needsMoreThoughts | Need more steps |

**Status:** Active (local server)
**Purpose:** Multi-step problem decomposition

### Tractatus Thinking MCP

**Connection:** `mcp__tractatus-thinking__tractatus_thinking`

| Operation | Purpose |
|----------|---------|
| start | Analyze concept structure |
| add | Add proposition |
| navigate | Explore relationships |
| export | Export analysis |
| analyze | Check completeness |
| revise | Update proposition |
| undo | Revert change |
| move | Restructure |

**Status:** Active (local server)
**Purpose:** Logical structure analysis

### Debug Thinking MCP

**Connection:** `mcp__debug-thinking__debug_thinking`

| Action | Purpose |
|--------|---------|
| create | Add node to graph |
| connect | Link nodes |
| query | Search graph |
| create (nodeType: problem) | Add problem |
| create (nodeType: hypothesis) | Add hypothesis |
| create (nodeType: experiment) | Add experiment |

**Status:** Active (local server)
**Database:** `~/.debug-thinking-mcp/`
**Purpose:** Graph-based debugging with persistent learning

### Web Reader MCP

**Connection:** `mcp__web_reader__webReader`

| Parameter | Purpose |
|-----------|---------|
| url | Target URL |
| timeout | Request timeout |
| return_format | markdown/text |
| retain_images | Include images |
| with_images_summary | Image summaries |
| with_links_summary | Link summaries |

**Status:** Active (external service)
**Purpose:** Fetch and convert web content to LLM-friendly format

---

## 3. CLI Commands (Internal API)

### Core Workflow Commands

| Command | Arguments | Purpose | Output |
|----------|-----------|---------|--------|
| /GSI:new-project | [--auto] | Initialize project | PROJECT.md, ROADMAP, etc. |
| /GSI:discuss-phase | [N] | Capture decisions | CONTEXT.md |
| /GSI:plan-phase | [N] | Create plans | SEARCH.md, PLAN.md |
| /GSI:execute-phase | <N> | Execute plans | SUMMARY.md |
| /GSI:verify-work | [N] | User acceptance | VERIFY.md |
| /GSI:audit-milestone | - | Check completion | Status report |
| /GSI:complete-milestone | - | Tag release | Git tag |

### Navigation Commands

| Command | Purpose |
|----------|---------|
| /GSI:progress | Show current position |
| /GSI:help | Show all commands |
| /GSI:update | Check for updates |
| /GSI:join-discord | Open Discord invite |

### Session Management

| Command | Purpose |
|----------|---------|
| /GSI:pause-work | Create handoff |
| /GSI:resume-work | Restore session |
| /GSI:settings | Configure profiles |
| /GSI:set-profile | Switch model profile |

### Utilities

| Command | Purpose |
|----------|---------|
| /GSI:add-todo | Capture idea |
| /GSI:check-todos | List todos |
| /GSI:debug | Debug workflow |
| /GSI:quick | Ad-hoc task |

**Total Commands:** 50+ across all categories
**Authentication:** System-level (Claude Code permissions)

---

## 4. WebSocket Endpoints

| Service | URL | Purpose | Status |
|----------|-----|---------|
| N/A | N/A | Not Used | No WebSocket endpoints |

---

## 5. Internal APIs

### Installation Script

**File:** `bin/install.js`

| Function | Parameters | Returns |
|----------|-----------|---------|
| detectRuntime() | - | claude/opencode/gemini |
| promptLocation() | - | global/local |
| promptConfirmations() | - | true/false |
| copyFiles() | runtime, location | - |
| printSuccess() | - | - |

### GSI Tools

**File:** `bin/gsi-tools.js`

| Function | Parameters | Returns |
|----------|-----------|---------|
| verifySubscription() | apiKey | true/false |
| fetchFreshness() | options | Freshness data |
| getToolList() | - | Tool list |

### Build Hooks

**Script:** `scripts/build-hooks.js`

| Function | Purpose |
|----------|---------|
| Build all hook files | Create distributable |
| Clean dist/ | Prepare for build |

---

## 6. Template APIs

### User Setup Template

**File:** `templates/user-setup.md`

| Section | API References |
|---------|---------------|
| Stripe | dashboard.stripe.com, /v1/webhooks |
| Supabase | supabase.com, /auth/v1/, /rest/v1/ |
| SendGrid | sendgrid.com, /v3/mail/send |

**Status:** Example implementations, not active endpoints

### Phase Prompt Template

**File:** `templates/phase-prompt.md`

| Section | Purpose |
|---------|---------|
| Server Start | npm run dev, localhost:3000 |
| Verification | curl localhost:3000/* |
| HTTP Examples | curl commands for testing |

**Status:** Template code, not active endpoints

---

## 7. MCP Tool Details

### Desktop Commander File Operations

| Operation | Tool | Parameters | Returns |
|-----------|------|-----------|---------|
| Read | read_file | path, offset, length | File content |
| Write | write_file | path, content, mode | Success |
| Edit | edit_block | file_path, old_string, new_string | Replacements |
| List | list_directory | path, depth | Tree |
| Search | start_search | path, pattern, type | Session ID |

### Code Index Operations

| Operation | Tool | Parameters | Returns |
|-----------|------|-----------|---------|
| Index | build_deep_index | - | Stats |
| Find | find_files | pattern | Paths |
| Search | search_code_advanced | pattern, file_pattern | Matches |
| Summary | get_file_summary | file_path | Metrics |
| Symbol | get_symbol_body | file_path, symbol_name | Code |

### CodeGraph Operations

| Operation | Tool | Parameters | Returns |
|-----------|------|-----------|---------|
| Query | execute_cypher_query | cypher_query | Graph data |
| Analyze | analyze_code_relationships | query_type, target | Relationships |
| Visualize | visualize_graph_query | cypher_query | Browser URL |

---

## 8. Authentication Methods

### External APIs

| API | Auth Method | Location |
|-----|-------------|---------|
| Anthropic | X-Subscription-Token header | bin/gsi-tools.js |
| Stripe | API Key in header | Templates (example) |
| Supabase | anon/service_role keys | Templates (example) |
| SendGrid | API Key | Templates (example) |

### MCP Servers

| Server | Auth Method |
|--------|-------------|
| Desktop Commander | Local IPC (none) |
| Code Index | Local IPC (none) |
| CodeGraphContext | Local Neo4j (none) |
| Context7 | None (public) |
| DeepWiki | None (public) |
| Thinking Servers | Local IPC (none) |

---

## 9. Rate Limits and Quotas

| API | Limit | Notes |
|-----|-------|-------|
| Anthropic | Per-account | Not documented in tools |
| GitHub (DeepWiki) | 5000/hour (unauth) | Standard API limits |
| Star History | Unknown | External service |
| Shields.io | Unknown | Badge service |

---

## 10. Error Handling

### Anthropic API

| Error | Handling |
|-------|----------|
| Network errors | Try-catch in fetch |
| Auth errors | Return false (verifySubscription) |
| Timeout | 30s default in templates |

### MCP Servers

| Error | Handling |
|-------|----------|
| Server not running | User message to start |
| Invalid params | Tool-specific validation |
| File not found | Desktop Commander error |

---

## Actions Required

### Documentation

1. [ ] Add API rate limit documentation
2. [ ] Document error codes for external APIs
3. [ ] Add retry logic documentation

### Monitoring

1. [ ] Add API call logging
2. [ ] Track rate limit usage
3. [ ] Monitor MCP server health

---

## Notes

- No REST APIs are directly exposed by GSI
- All external API calls are for subscription validation
- MCP servers provide all internal tooling
- CLI commands are system-level, not HTTP endpoints
- WebSocket endpoints are not used

---

*Last Updated: 2026-02-13*
*Phase: 11-01 Task 4*
