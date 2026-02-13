# External Integrations

**Analysis Date:** 2025-02-11

## APIs & External Services

**Code Repositories:**
- GitHub - Primary code repository hosting
  - SDK/Client: Native Git integration
  - Auth: SSH tokens or HTTPS
  - Used for: Claude code repository, plugin repositories

**Documentation Platforms:**
- Claude Platform Documentation - Official API documentation
  - SDK/Client: Web fetching via MCP
  - Used for: Reference documentation, API specs

**Knowledge Management:**
- Prompting Guide AI - External knowledge base
  - SDK/Client: Web crawling via MCP
  - Used for: Prompt engineering techniques
  - Auth: None required (public content)

**Content Management:**
- Claude Code Plugins - Plugin marketplace
  - SDK/Client: Web fetching via MCP
  - Used for: Plugin discovery and documentation
  - Auth: None required (public content)

## Data Storage

**Databases:**
- File system only - No external databases
  - Connection: N/A
  - Client: N/A

**File Storage:**
- Local file system - Primary storage
  - No cloud storage detected

**Caching:**
- File-based caching in `crawled/` and `crawled-sites/` directories
  - Used for: Web content persistence

## Authentication & Identity

**Auth Provider:**
- GitHub - Primary authentication for code repositories
  - Implementation: SSH key or PAT (Personal Access Token)
  - Environment variable: Not detected (manual management)

**API Keys:**
- No API keys detected for external services
- All integrations use public APIs or local access

## Monitoring & Observability

**Error Tracking:**
- No external error tracking service detected
- Manual logging through console output

**Logs:**
- File-based logging in `.debug-thinking-mcp/` directory
  - Format: Structured JSON
  - Purpose: Debug thinking sessions

## CI/CD & Deployment

**Hosting:**
- GitHub - Primary hosting platform
  - Integration: Native Git workflow
  - Deployment: Manual via Git operations

**CI Pipeline:**
- No external CI detected
- Manual execution through GSI workflows

## Environment Configuration

**Required env vars:**
- None detected (all configurations file-based)
- Git credentials managed separately

**Secrets location:**
- No centralized secrets management
- Git credentials managed through standard Git mechanisms

## Webhooks & Callbacks

**Incoming:**
- None detected
- All integrations are pull-based (fetch data, not receive)

**Outgoing:**
- None detected
- No notification or callback systems configured

## Content Integration Patterns

**Documentation Integration:**
- Web crawling to fetch external documentation
- Local storage in structured directories
- RAG (Retrieval-Augmented Generation) indices for knowledge graphs

**Repository Integration:**
- Direct Git operations for version control
- Web fetching for remote repository information
- Local caching of repository contents

**Plugin Integration:**
- Web crawling for plugin marketplace
- Local storage of plugin documentation
- No runtime plugin loading detected

---

*Integration audit: 2025-02-11*