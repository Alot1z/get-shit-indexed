# Phase 18: Naming Standardization - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Standardize all GSI naming to lowercase `gsi` convention. This includes:
- Rename legacy `gsd-*` agent files to `gsi-*` in place
- Update command prefix from `GSI:` to `gsi:` throughout
- Consolidate `commands/gsd/` and `commands/GSI/` to single `commands/gsi/`

No new capabilities - purely consistency cleanup.

</domain>

<decisions>
## Implementation Decisions

### Agent File Updates
- Rename all `gsd-*.md` agent files to `gsi-*.md` in place
- Update internal references within each agent file
- No deletion - all files preserved with new names
- 13 agent files to update

### Command Prefix Standard
- All command references use `/gsi:` lowercase
- Update 217+ documentation references from `GSI:` to `gsi:`
- Command directories: merge `gsd/` and `GSI/` into single `gsi/`

### Directory Structure
- `commands/gsd/` → merge into `commands/gsi/`
- `commands/GSI/` → rename to `commands/gsi/`
- Ensure no duplicate command files

### Claude's Discretion
- Exact rename order to avoid broken references
- How to handle any hard-coded paths
- Git history preservation during renames

</decisions>

<specifics>
## Specific Ideas

### Files to Update

**Agent Files (13):**
```
~/.claude/agents/gsd-codebase-mapper.md → gsi-codebase-mapper.md
~/.claude/agents/gsd-debugger.md → gsi-debugger.md
~/.claude/agents/gsd-executor.md → gsi-executor.md
~/.claude/agents/gsd-integration-checker.md → gsi-integration-checker.md
~/.claude/agents/gsd-phase-researcher.md → gsi-phase-researcher.md
~/.claude/agents/gsd-plan-checker.md → gsi-plan-checker.md
~/.claude/agents/gsd-planner.md → gsi-planner.md
~/.claude/agents/gsd-project-researcher.md → gsi-project-researcher.md
~/.claude/agents/gsd-research-synthesizer.md → gsi-research-synthesizer.md
~/.claude/agents/gsd-roadmapper.md → gsi-roadmapper.md
~/.claude/agents/gsd-verifier-7bmAD.md → gsi-verifier-7bmAD.md
~/.claude/agents/gsd-verifier.md → gsi-verifier.md
```

**Command Directories:**
```
~/.claude/commands/gsd/ → merge into gsi/
~/.claude/commands/GSI/ → rename to gsi/
```

### Search Patterns to Update
- `GSI:` → `gsi:` in all documentation (217+ instances)
- `subagent_type: "gsd-*"` → `subagent_type: "gsi-*"` in workflows
- Agent references in command files

</specifics>

<deferred>
## Deferred Ideas

- None - this is a focused cleanup phase

</deferred>

---

*Phase: 18-naming-standardization*
*Context gathered: 2026-02-15*
