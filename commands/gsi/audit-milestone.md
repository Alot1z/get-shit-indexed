---
name: gsi:audit-milestone
description: Audit milestone completion against original intent before archiving
argument-hint: "[version]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - Task
---

> ⚠️ **DEPRECATED**: This command is now part of `/gsi:check` (GSI Check).
> Use `/gsi:check --milestone` for unified milestone auditing.
> This command remains for backward compatibility.

<objective>
Verify milestone achieved its definition of done. Check requirements coverage, cross-phase integration, and end-to-end flows.

**This command IS the orchestrator.** Reads existing VERIFICATION.md files (phases already verified during execute-phase), aggregates tech debt and deferred gaps, then spawns integration checker for cross-phase wiring.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/audit-milestone.md
</execution_context>

<context>
Version: $ARGUMENTS (optional — defaults to current milestone)

**Original Intent:**
@.planning/PROJECT.md
@.planning/REQUIREMENTS.md

**Planned Work:**
@.planning/ROADMAP.md
@.planning/config.json (if exists)

**Completed Work:**
Glob: .planning/phases/*/*-SUMMARY.md
Glob: .planning/phases/*/*-VERIFICATION.md
</context>

<process>
Execute the audit-milestone workflow from @~/.claude/get-shit-indexed/workflows/audit-milestone.md end-to-end.
Preserve all workflow gates (scope determination, verification reading, integration check, requirements coverage, routing).
</process>
