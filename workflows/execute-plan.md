# Execute Plan Workflow

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- Use `mcp__desktop-commander__read_file` instead of Read
- Use `mcp__desktop-commander__write_file` instead of Write
- Use `mcp__desktop-commander__edit_block` instead of Edit
- Use `mcp__desktop-commander__list_directory` instead of Bash ls

**Code Search:**
- Use `mcp__code-index-mcp__search_code_advanced` instead of Grep
- Use `mcp__code-index-mcp__find_files` instead of Glob
- Use `mcp__code-index-mcp__get_file_summary` for file analysis

**Process Operations:**
- Use `mcp__desktop-commander__start_process` for system commands
- Use `mcp__desktop-commander__interact_with_process` for interactive sessions

**Exception: Git operations use Bash tool directly (no MCP git equivalent exists).**
</tool_requirements>

<purpose>
Execute a phase prompt (PLAN.md) and create the outcome summary (SUMMARY.md).
</purpose>

<required_reading>
Read STATE.md before any operation to load project context.
Read config.json for planning behavior settings.

# Validation References
@references/validation-gates.md
@references/validation-workflow.md
@references/agent-completion-signal.md
@references/code-review-criteria.md
</required_reading>

<process>

<step name="load_project_state">
Before any operation, read project state:

Use `mcp__desktop-commander__read_file` for `.planning/STATE.md`

Parse and internalize:
- Current position (phase, plan, status)
- Accumulated decisions (constraints on this execution)
- Blockers/concerns (things to watch for)
- Brief alignment status
</step>

<step name="load_plan">
Read the plan prompt using `mcp__desktop-commander__read_file`:
- File: `.planning/phases/XX-name/{phase}-{plan}-PLAN.md`

Parse:
- Frontmatter (phase, plan, type, autonomous, wave, depends_on)
- Objective
- Context files to read (@-references)
- Tasks with their types
- Verification criteria
- Success criteria
- Output specification
</step>

<step name="execute_tasks">
Execute each task in the plan.

**For each task:**

1. Read task type

2. If `type="auto"`:
   - Check if task has `tdd="true"` attribute → follow TDD execution flow
   - Work toward task completion
   - When you discover additional work not in plan: Apply deviation rules automatically
   - Run the verification
   - Confirm done criteria met
   - Commit the task
   - Track task completion and commit hash for Summary
   - Continue to next task

3. If `type="checkpoint:*"`:
   - STOP immediately (do not continue to next task)
   - Return structured checkpoint message
   - You will NOT continue - a fresh agent will be spawned

4. Run overall verification checks from `<verification>` section
5. Confirm all success criteria from `<success_criteria>` section met
6. Document all deviations in Summary
</step>

<step name="emit_completion_signal">
After all tasks complete, emit completion signal:

```markdown
[COMPLETION]
Agent: GSI-executor
Task: {phase} - {plan name}
Files:
  - {list of files created/modified}
Status: Success
Deviations: {count or "None"}
[/COMPLETION]
```

This signal triggers automatic validation via validation workflow.
</step>

<step name="create_summary">
Create `{phase}-{plan}-SUMMARY.md` in phase directory.

Use template from `templates/summary.md`

Populate:
- Frontmatter (phase, plan, subsystem, tags, tech tracking, file tracking, decisions, metrics)
- All tasks completed with commit hashes
- Deviations from plan
- Authentication gates (if any)
- Duration calculation
- Next steps

**Include validation outcome section:**

```markdown
## Validation Outcome
- **7-BMAD Gates:** [X/7 passed]
- **Quality Score:** [X/7]
```
</step>

<step name="update_state">
Update STATE.md with:
- Current position (phase, plan, status)
- Extract decisions from SUMMARY.md
- Update progress bar
- Update session continuity
</step>

<step name="final_commit">
Commit SUMMARY.md and STATE.md:

If `COMMIT_PLANNING_DOCS=true`:
```bash
git add .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md
git add .planning/STATE.md
git commit -m "docs({phase}-{plan}): complete {plan-name} plan

Tasks completed: [N]/[N]
SUMMARY: .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md"
```
</step>

</process>

<completion_format>
When plan completes successfully, return:

```markdown
## PLAN COMPLETE

**Plan:** {phase}-{plan}
**Tasks:** {completed}/{total}
**SUMMARY:** {path to SUMMARY.md}

**Commits:**
- {hash}: {message}
- {hash}: {message}

**Duration:** {time}
```

Include completion signal that triggers validation:

```markdown
[COMPLETION]
Agent: GSI-executor
Task: Phase {phase} Plan {plan} - {name}
Files: [modified files]
Status: Success
Deviations: None
[/COMPLETION]
```

This signal format enables automatic validation triggering.
</completion_format>

<deviation_rules>
See @references/validation-gates.md for 7-BMAD quality gate validation.

Auto-fix bugs, missing critical functionality, and blocking issues.
Ask about architectural changes.
</deviation_rules>

<authentication_gates>
Handle authentication errors during execution by creating checkpoint:human-action
</authentication_gates>

<task_commit_protocol>
After each task completes:
1. Identify modified files
2. Stage only task-related files
3. Determine commit type (feat/fix/test/refactor/perf/docs/style/chore)
4. Craft commit message
5. Record commit hash
</task_commit_protocol>

---

**Version:** 1.0  
**Last Updated:** 2026-02-13  
**Status:** Active
