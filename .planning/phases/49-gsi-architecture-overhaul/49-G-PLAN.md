# Sub-Phase 49-G: GSI Command & Rectification

---
plan: 49-G
phase: 49
type: sub-phase
created: 2026-02-19
status: planned
tasks: 20
wave: 1
depends_on: [49-01, 49-06]
integrates: [39, 40, 41]
---

## Objective

Complete command audits from Phase 39, claudeception command from Phase 40, and project rectification from Phase 41.

## Source Phases

| Phase | Status | Tasks to Integrate |
|-------|--------|-------------------|
| 39 | Planned | Command audits |
| 40 | Planned | Claudeception command |
| 41 | Planned (duplicate) | Project rectification |

## Critical Rectification Items (Phase 41)

From audit findings:
- 260+ audit findings to address
- 79 broken @-references
- 13 hardcoded paths
- Hooks not registered in settings

## Tasks

### Wave 1: Phase 39 - Command Audits (Tasks 1-5)

- [ ] **Task 1**: Audit /gsi:debug command
  - Verify MCP tool usage
  - Check cognitive flow integration
  - Test all debug workflows

- [ ] **Task 2**: Audit /gsi:map-codebase command
  - Verify parallel spawning
  - Check output document quality
  - Test focus area filtering

- [ ] **Task 3**: Audit /gsi:execute-phase command
  - Verify wave execution
  - Check checkpoint handling
  - Test gap closure mode

- [ ] **Task 4**: Audit /gsi:plan-phase command
  - Verify research integration
  - Check plan validation
  - Test verification loop

- [ ] **Task 5**: Create audit report
  - Document all findings
  - Prioritize fixes
  - Track resolution

### Wave 2: Phase 40 - Claudeception Command (Tasks 6-10)

- [ ] **Task 6**: Design /gsi:claudeception command
  - Define command interface
  - Specify artifact types
  - Design output format

- [ ] **Task 7**: Implement claudeception trigger
  - Manual extraction trigger
  - Scope selection (conversation, file, directory)
  - Artifact type selection

- [ ] **Task 8**: Add artifact review workflow
  - Display generated artifacts
  - Enable editing before save
  - Approve/reject mechanism

- [ ] **Task 9**: Create claudeception storage
  - `.claude/claudeception/skills/`
  - `.claude/claudeception/agents/`
  - `.claude/claudeception/logic/`
  - `.claude/claudeception/features/`

- [ ] **Task 10**: Integrate with roadmap
  - Link artifacts to roadmap items
  - Auto-create phase from feature
  - Track artifact implementation

### Wave 3: Phase 41 - Project Rectification (Tasks 11-20)

- [ ] **Task 11**: Fix broken @-references (79 total)
  - Map all @-references
  - Identify broken references
  - Fix or remove broken references

- [ ] **Task 12**: Fix hardcoded paths (13 total)
  - Identify all hardcoded paths
  - Replace with relative/configurable paths
  - Test on multiple systems

- [ ] **Task 13**: Register hooks in settings
  - Update ~/.claude/settings.json
  - Register all PreToolUse hooks
  - Register all PostToolUse hooks

- [ ] **Task 14**: Fix Phase 41 duplicate directories
  - Merge 41-full-system-integration into 48
  - Keep 41-gsi-total-project-rectification
  - Update ROADMAP references

- [ ] **Task 15**: Resolve remaining audit findings
  - Address high-priority findings
  - Document medium-priority deferrals
  - Create remediation timeline

- [ ] **Task 16**: Verify module imports
  - Check all import statements
  - Fix broken imports
  - Add missing exports

- [ ] **Task 17**: Verify hook functionality
  - Test all hook triggers
  - Verify hook output
  - Document hook behavior

- [ ] **Task 18**: Create rectification report
  - Document all fixes applied
  - Track remaining issues
  - Create verification checklist

- [ ] **Task 19**: Update documentation
  - Update README.md
  - Update ROADMAP.md
  - Update STATE.md

- [ ] **Task 20**: Run integration tests
  - Test all commands end-to-end
  - Verify hook registration
  - Confirm no regressions

## Success Criteria

- [ ] All command audits complete
- [ ] /gsi:claudeception command functional
- [ ] 90%+ @-references fixed
- [ ] All hooks registered
- [ ] Integration tests passing

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
