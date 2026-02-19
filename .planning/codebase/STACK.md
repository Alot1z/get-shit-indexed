# Technology Stack

**Analysis Date:** 2025-02-11

## Languages

**Primary:**
- Markdown [Text] - Documentation and content storage
  - Used extensively throughout the codebase for README files, documentation, and knowledge base

**Secondary:**
- JSON [Data] - Structured data representation
  - Used for configuration files and indexed content

## Runtime

**Environment:**
- Command Line Interface (CLI) - Primary interaction mode
- Windows OS 10.0.19045 - Host platform

**Package Manager:**
- Git [Version control]
- No traditional package manager detected
- Configuration managed through direct file operations

## Frameworks

**Core:**
- GSI (get-shit-indexed) [v1.11.1] - Workflow orchestration framework
  - Purpose: Project management and execution pipeline
  - Location: Root directory with configuration in `.planning/config.json`

**Testing:**
- No dedicated testing framework detected
- Manual verification through workflow execution

**Build/Dev:**
- MCP (Model Context Protocol) servers - Tool integration
  - Desktop Commander - File and process operations
  - Code-Index-MCP - Code search and analysis
  - Context-Crawl - Web crawling and content extraction
  - DeepWiki - GitHub repository knowledge

## Key Dependencies

**Critical:**
- Git - Version control and repository management
- Claude Agent SDK - AI agent framework
- MCP Servers - Tool ecosystem integration
- Workflow templates - Standardized execution patterns

**Infrastructure:**
- File system operations
- Process execution
- Web content fetching
- Knowledge graph generation

## Configuration

**Environment:**
- Configuration managed through JSON files
- `.planning/config.json` - Main settings file
- Workflow-specific configurations in `workflows/` directory

**Build:**
- No build system detected
- Direct file execution
- Template-based generation

## Platform Requirements

**Development:**
- Windows 10 or later
- Git installed
- Claude Agent SDK
- MCP servers configured

**Production:**
- Same as development (CLI-based)
- No server requirements
- Client-side execution only

---

*Stack analysis: 2025-02-11*