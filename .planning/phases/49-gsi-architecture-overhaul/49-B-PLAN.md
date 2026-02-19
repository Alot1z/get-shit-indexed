# Sub-Phase 49-B: SDK & Installation Foundation

---
plan: 49-B
phase: 49
type: sub-phase
created: 2026-02-19
status: completed
tasks: 14
wave: 1
depends_on: [49-01, 49-03]
integrates: [27, 29]
completed_at: 2026-02-19
---

## Objective

Integrate Claude Code SDK native access from Phase 27 and create complete installation system from Phase 29.

## Source Phases

| Phase | Status | Tasks to Integrate |
|-------|--------|-------------------|
| 27 | Integrated | SDK integration |
| 29 | Integrated | Installation system |

## Tasks

### Wave 1: Phase 27 - SDK Integration (Tasks 1-7)

- [x] **Task 1**: Research Claude Code SDK capabilities
  - Document available SDK methods
  - Identify integration points
  - Map to GSI use cases

- [x] **Task 2**: Create SDK wrapper module
  - `lib/sdk/index.ts` - Module entry point
  - `lib/sdk/sdk-wrapper.ts` - SDK abstraction layer
  - Provide GSI-friendly API

- [x] **Task 3**: Implement direct API access
  - `lib/sdk/direct-api.ts`
  - Bypass MCP when SDK provides direct access
  - Reduce latency for common operations
  - Maintain MCP fallback

- [x] **Task 4**: Add profile management
  - `lib/sdk/profile-manager.ts`
  - Multiple model profiles (haiku, sonnet, opus, zai, zai-flash, zai-swarm)
  - Easy profile switching
  - Profile-aware execution

- [x] **Task 5**: Create SDK authentication handling
  - `lib/sdk/auth-manager.ts`
  - Secure credential storage with AES-256-GCM encryption
  - Multi-account support
  - Token refresh automation

- [x] **Task 6**: Implement SDK error handling
  - `lib/sdk/error-handler.ts`
  - Graceful SDK failures
  - Automatic MCP fallback
  - Error logging and recovery

- [x] **Task 7**: Add SDK performance monitoring
  - `lib/sdk/performance-monitor.ts`
  - Track SDK call latency
  - Compare with MCP performance
  - Optimize hot paths

### Wave 2: Phase 29 - Installation System (Tasks 8-14)

- [x] **Task 8**: Create installer module
  - `lib/gsi-install/installer.ts`
  - Detect installation type (global vs project)
  - Handle platform differences

- [x] **Task 9**: Create CLI installer
  - `bin/gsi-install.js`
  - Interactive installation wizard
  - Dependency checking

- [x] **Task 10**: Implement global installation
  - `lib/gsi-install/detector.ts`
  - Install to user home directory
  - Support for Claude, OpenCode, Gemini runtimes
  - Cross-platform path resolution

- [x] **Task 11**: Implement project installation
  - Project-level detection via `.planning`, `.gsi` indicators
  - Project-specific configuration
  - Team sharing support

- [x] **Task 12**: Add hook registration to installer
  - `lib/gsi-install/hook-registrar.ts`
  - Auto-register PreToolUse hooks
  - Auto-register SessionStart hooks
  - Verify registration success

- [x] **Task 13**: Create uninstall functionality
  - Clean removal of all GSI files
  - Hook unregistration
  - Settings cleanup

- [x] **Task 14**: Add installation verification
  - `lib/gsi-install/dependency-checker.ts`
  - Verify Node.js version
  - Test MCP connections
  - Validate hook registration

## Implementation Summary

### Files Created

**SDK Module** (`lib/sdk/`):
- `index.ts` - Module entry point with exports
- `sdk-wrapper.ts` - ClaudeCodeSDK class with SDK abstraction
- `direct-api.ts` - Direct API access module
- `profile-manager.ts` - Model profile management (8 profiles)
- `auth-manager.ts` - Secure credential storage with encryption
- `error-handler.ts` - Error handling with MCP fallback
- `performance-monitor.ts` - Performance tracking and comparison

**Installation Module** (`lib/gsi-install/`):
- `index.ts` - Module entry point with exports
- `installer.ts` - Main Installer class
- `detector.ts` - Install type detection
- `hook-registrar.ts` - Hook registration management
- `dependency-checker.ts` - Dependency verification

**CLI** (`bin/`):
- `gsi-install.js` - CLI installer with interactive mode

**Configuration**:
- `tsconfig.json` - TypeScript configuration for SDK and install modules
- Updated `package.json` - Added gsi-install bin, TypeScript dependencies

### Success Criteria

- [x] SDK wrapper module complete
- [x] Installation system functional
- [x] Global and project installations supported
- [x] Hooks auto-registered on install
- [x] Installation verification implemented

## Allowed Tools (Full Cognitive Flow)

```yaml
# File Operations
mcp__desktop-commander__*     # All Desktop Commander tools

# Code Analysis
mcp__code-index-mcp__*        # All Code-Index tools
mcp__CodeGraphContext__*      # Relationship analysis

# Thinking Servers (Cognitive Flow)
mcp__sequential-thinking__*   # Step-by-step reasoning
mcp__tractatusthinking__*     # Logical structure analysis
mcp__debug-thinking__*        # Problem-solution mapping

# External Knowledge
mcp__deepwiki__*              # GitHub repo research
mcp__context7__*              # Library documentation

# Orchestration
Task                          # Subagent spawning
```
