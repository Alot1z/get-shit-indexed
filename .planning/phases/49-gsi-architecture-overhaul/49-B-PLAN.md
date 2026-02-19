# Sub-Phase 49-B: SDK & Installation Foundation

---
plan: 49-B
phase: 49
type: sub-phase
created: 2026-02-19
status: planned
tasks: 14
wave: 1
depends_on: [49-01, 49-03]
integrates: [27, 29]
---

## Objective

Integrate Claude Code SDK native access from Phase 27 and create complete installation system from Phase 29.

## Source Phases

| Phase | Status | Tasks to Integrate |
|-------|--------|-------------------|
| 27 | Planned | SDK integration |
| 29 | Planned | Installation system |

## Tasks

### Wave 1: Phase 27 - SDK Integration (Tasks 1-7)

- [ ] **Task 1**: Research Claude Code SDK capabilities
  - Document available SDK methods
  - Identify integration points
  - Map to GSI use cases

- [ ] **Task 2**: Create SDK wrapper module
  - `lib/sdk-wrapper/index.ts`
  - Abstract SDK complexity
  - Provide GSI-friendly API

- [ ] **Task 3**: Implement direct API access
  - Bypass MCP when SDK provides direct access
  - Reduce latency for common operations
  - Maintain MCP fallback

- [ ] **Task 4**: Add profile management
  - Multiple model profiles (haiku, sonnet, opus, zai)
  - Easy profile switching
  - Profile-aware execution

- [ ] **Task 5**: Create SDK authentication handling
  - Secure credential storage
  - Multi-account support
  - Token refresh automation

- [ ] **Task 6**: Implement SDK error handling
  - Graceful SDK failures
  - Automatic MCP fallback
  - Error logging and recovery

- [ ] **Task 7**: Add SDK performance monitoring
  - Track SDK call latency
  - Compare with MCP performance
  - Optimize hot paths

### Wave 2: Phase 29 - Installation System (Tasks 8-14)

- [ ] **Task 8**: Create installer module
  - `lib/gsi-install/installer.ts`
  - Detect installation type (global vs project)
  - Handle platform differences

- [ ] **Task 9**: Create CLI installer
  - `bin/gsi-install.js`
  - Interactive installation wizard
  - Dependency checking

- [ ] **Task 10**: Implement global installation
  - Install to user home directory
  - Add to PATH
  - Support multiple OS

- [ ] **Task 11**: Implement project installation
  - Install to project .gsi directory
  - Project-specific configuration
  - Team sharing support

- [ ] **Task 12**: Add hook registration to installer
  - Auto-register PreToolUse hooks
  - Auto-register PostToolUse hooks
  - Verify registration success

- [ ] **Task 13**: Create uninstall functionality
  - Clean removal of all files
  - Restore original settings
  - Backup before removal

- [ ] **Task 14**: Add installation verification
  - Verify all dependencies
  - Test MCP connections
  - Validate hook registration

## Success Criteria

- [ ] SDK wrapper module complete
- [ ] Installation system functional
- [ ] Global and project installations working
- [ ] Hooks auto-registered on install
- [ ] Installation verification passing

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
