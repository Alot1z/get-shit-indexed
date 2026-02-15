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

## Thinking Phase: Pre-Workflow

<server>sequential</server>
<prompt>Plan the execution strategy:
1. What is the scope of this plan?
2. What are the potential execution risks?
3. What resources are needed?
4. What could go wrong during execution?</prompt>
<expected_output>Execution plan with risk assessment and mitigation strategies</expected_output>
<timeout>5000</timeout>
<integration>Execute with awareness of identified risks and required resources</integration>

<step name="load_project_state">
Before any operation, read project state:

### Thinking Phase: Pre-Step - Load Project State

<server>sequential</server>
<prompt>Analyze state loading requirements:
1. What state information is essential for execution?
2. How does current position constrain our approach?
3. What blockers require special attention?</prompt>
<expected_output>Understanding of state context and execution constraints</expected_output>
<timeout>3000</timeout>
<integration>Load all relevant state and maintain awareness of constraints</integration>

Use `mcp__desktop-commander__read_file` for `.planning/STATE.md`

Parse and internalize:
- Current position (phase, plan, status)
- Accumulated decisions (constraints on this execution)
- Blockers/concerns (things to watch for)
- Brief alignment status

### Thinking Phase: Post-Step - State Loaded

<server>debug</server>
<prompt>Reflect on state loading:
1. Was the current position clear?
2. Were constraints well-understood?
3. What state-related patterns should be remembered?</prompt>
<expected_output>State context patterns stored in debug-thinking graph</expected_output>
<timeout>3000</timeout>
</step>

<step name="load_plan">
Read the plan prompt using `mcp__desktop-commander__read_file`:
- File: `.planning/phases/XX-name/{phase}-{plan}-PLAN.md`

### Thinking Phase: Pre-Step - Load Plan

<server>tractatus</server>
<prompt>Analyze plan structure:
1. What is the logical structure of this plan?
2. How do tasks relate to each other?
3. What are the verification checkpoints?
4. What does success look like?</prompt>
<expected_output>Understanding of plan structure and task relationships</expected_output>
<timeout>3000</timeout>
<integration>Execute tasks with awareness of structure and dependencies</integration>

Parse:
- Frontmatter (phase, plan, type, autonomous, wave, depends_on)
- Objective
- Context files to read (@-references)
- Tasks with their types
- Verification criteria
- Success criteria
- Output specification

### Thinking Phase: Post-Step - Plan Loaded

<server>debug</server>
<prompt>Reflect on plan understanding:
1. Was the plan structure clear?
2. What ambiguities existed?
3. What should be remembered about this plan type?</prompt>
<expected_output>Plan understanding patterns stored for reference</expected_output>
<timeout>3000</timeout>
</step>

<step name="execute_tasks">
Execute each task in the plan.

### Thinking Phase: Pre-Step - Execute Tasks

<server>sequential</server>
<prompt>Plan task execution:
1. What is the optimal task order?
2. What dependencies must be respected?
3. What risks exist in each task?
4. How do we track progress?</prompt>
<expected_output>Step-by-step execution approach with risk mitigation</expected_output>
<timeout>4000</timeout>
<integration>Execute tasks systematically according to plan</integration>

**For each task:**

#### Thinking Phase: Pre-Task - [Task Name]

<server>tractatus</server>
<prompt>Analyze task structure:
1. What is the exact objective of this task?
2. What files will be modified?
3. What are the acceptance criteria?
4. What could go wrong?</prompt>
<expected_output>Clear understanding of task requirements and risks</expected_output>
<timeout>2000</timeout>
<integration>Execute task with awareness of requirements and risks</integration>

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

#### Thinking Phase: Post-Task - [Task Name]

<server>debug</server>
<prompt>Reflect on task execution:
1. What went well in this task?
2. What didn't go as expected?
3. What patterns emerged?
4. What should be remembered for similar tasks?</prompt>
<expected_output>Task execution patterns stored in debug-thinking graph</expected_output>
<timeout>3000</timeout>

4. Run overall verification checks from `<verification>` section
5. Confirm all success criteria from `<success_criteria>` section met
6. Document all deviations in Summary

### Thinking Phase: Post-Step - Tasks Executed

<server>debug</server>
<prompt>Reflect on task execution:
1. What execution patterns emerged across tasks?
2. What risks were successfully mitigated?
3. What deviations occurred and why?
4. What should be remembered about this type of plan?</prompt>
<expected_output>Execution patterns stored in debug-thinking graph for future reference</expected_output>
<timeout>4000</timeout>
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

### Thinking Phase: Pre-Step - Create Summary

<server>sequential</server>
<prompt>Plan summary creation:
1. What information must be captured?
2. How do we structure the summary for clarity?
3. What metrics are important?
4. How do we document deviations?</prompt>
<expected_output>Step-by-step approach to comprehensive summary creation</expected_output>
<timeout>3000</timeout>

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

### Thinking Phase: Post-Step - Summary Created

<server>debug</server>
<prompt>Reflect on summary creation:
1. Was the summary comprehensive?
2. What information was difficult to capture?
3. What summary patterns worked well?
4. What should be remembered about this plan?</prompt>
<expected_output>Summary patterns and plan learnings stored in debug-thinking graph</expected_output>
<timeout>3000</timeout>
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

## Thinking Phase: Post-Workflow - Execution Complete

<server>sequential</server>
<prompt>Comprehensive execution review:
1. What was the overall execution process?
2. What went according to plan?
3. What deviations occurred and why?
4. What should be remembered for future executions?</prompt>
<expected_output>Process insights and improvement recommendations</expected_output>
<timeout>5000</timeout>
<integration>Store execution patterns in debug-thinking, update workflow if needed</integration>

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
