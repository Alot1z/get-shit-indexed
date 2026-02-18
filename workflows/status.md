# Status Workflow

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- Use `mcp__desktop-commander__read_file` instead of Read
- Use `mcp__desktop-commander__write_file` instead of Write
- Use `mcp__desktop-commander__list_directory` instead of Bash ls

**Code Search:**
- Use `mcp__code-index-mcp__search_code_advanced` instead of Grep
- Use `mcp__code-index-mcp__find_files` instead of Glob
</tool_requirements>

<purpose>
Generate comprehensive project status reports showing current position, progress, blockers, and next steps for stakeholder communication and session continuity.
</purpose>

<required_reading>
# Project State
@STATE.md

# Agent Reference
@agents/GSI-planner.md
</required_reading>

<process>

## Thinking Phase: Pre-Workflow

<server>tractatus</server>
<prompt>Analyze the status workflow structure:
1. What information is essential for status reporting?
2. What audience needs status reports?
3. What metrics indicate project health?
4. How do status reports support decision-making?</prompt>
<expected_output>Structured breakdown of status components and purposes</expected_output>
<timeout>5000</timeout>
<integration>Use structure analysis to prioritize status information and output formats</integration>

<step name="load_project_state">
Read `.planning/STATE.md` to understand current position.

### Thinking Phase: Pre-Step - Load Project State

<server>sequential</server>
<prompt>Analyze state loading for status:
1. What state information is essential?
2. What progress metrics are tracked?
3. What blockers need highlighting?</prompt>
<expected_output>Understanding of status context and requirements</expected_output>
<timeout>3000</timeout>

### Thinking Phase: Post-Step - State Loaded

<server>debug</server>
<prompt>Reflect on state for status:
1. Was the current position clear?
2. What progress has been made?
3. What should be highlighted in status?</prompt>
<expected_output>Status context patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="calculate_progress_metrics">
Calculate quantitative progress metrics.

### Thinking Phase: Pre-Step - Calculate Metrics

<server>sequential</server>
<prompt>Plan metric calculation:
1. What metrics are tracked?
2. How do we calculate completion percentages?
3. What trends should be identified?</prompt>
<expected_output>Metric calculation approach</expected_output>
<timeout>3000</timeout>

**Metrics to calculate:**
- Phase completion percentage
- Plan completion percentage
- Task completion counts
- Time tracking (if available)
- File modification counts
- Commit counts

**Sources:**
- STATE.md for phase/plan tracking
- PLAN.md files for task counts
- SUMMARY.md files for completed tasks
- Git history for commit counts

### Thinking Phase: Post-Step - Metrics Calculated

<server>debug</server>
<prompt>Reflect on metrics:
1. Were metrics accurate?
2. What trends emerged?
3. What metrics are most useful?</prompt>
<expected_output>Metric patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="identify_blockers_and_risks">
Identify current blockers and risks.

### Thinking Phase: Pre-Step - Identify Blockers

<server>debug</server>
<prompt>Plan blocker identification:
1. What types of blockers exist?
2. How do we categorize severity?
3. What patterns indicate risks?</prompt>
<expected_output>Blocker identification approach</expected_output>
<timeout>3000</timeout>

**Sources:**
- STATE.md blockers section
- Open checkpoint tasks
- Unresolved issues
- Dependency blockers

**Categories:**
- Blocker: Prevents progress
- Risk: May cause issues
- Warning: Attention needed

### Thinking Phase: Post-Step - Blockers Identified

<server>debug</server>
<prompt>Reflect on blocker identification:
1. Were all blockers captured?
2. What blocker patterns emerged?
3. What mitigation strategies exist?</prompt>
<expected_output>Blocker patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="summarize_recent_activity">
Summarize recent work and decisions.

### Thinking Phase: Pre-Step - Summarize Activity

<server>sequential</server>
<prompt>Plan activity summary:
1. What recent work is relevant?
2. What decisions were made?
3. What time period to cover?</prompt>
<expected_output>Activity summary approach</expected_output>
<timeout>3000</timeout>

**Sources:**
- Recent SUMMARY.md files
- Recent commits (git log)
- STATE.md decisions section
- Recent PLAN.md files created

**Summarize:**
- Completed tasks
- Key decisions
- Files modified
- Patterns discovered

### Thinking Phase: Post-Step - Activity Summarized

<server>debug</server>
<prompt>Reflect on activity summary:
1. Was summary comprehensive?
2. What work was most significant?
3. What should be remembered?</prompt>
<expected_output>Activity patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="identify_next_steps">
Identify immediate next steps.

### Thinking Phase: Pre-Step - Identify Next Steps

<server>tractatus</server>
<prompt>Analyze next steps structure:
1. What are the logical next actions?
2. What dependencies affect next steps?
3. What alternatives exist?</prompt>
<expected_output>Next steps structure with dependencies</expected_output>
<timeout>3000</timeout>

**Sources:**
- ROADMAP.md for upcoming phases
- Current phase remaining tasks
- Blockers requiring resolution
- User requests

**Prioritize by:**
- Dependencies (must do first)
- Impact (highest value)
- Risk (reduce uncertainty)

### Thinking Phase: Post-Step - Next Steps Identified

<server>debug</server>
<prompt>Reflect on next steps:
1. Were next steps clear?
2. What priorities emerged?
3. What alternatives exist?</prompt>
<expected_output>Next step patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="create_status_report">
Generate status report document.

### Thinking Phase: Pre-Step - Create Report

<server>sequential</server>
<prompt>Plan report creation:
1. What format is most useful?
2. What sections are essential?
3. How do we structure for quick reading?</prompt>
<expected_output>Report creation plan with structure</expected_output>
<timeout>3000</timeout>

Create `.planning/STATUS-{date}.md`:

```markdown
# Project Status Report

**Generated:** {date}
**Session:** {session-id}

## Current Position

| Attribute | Value |
|-----------|-------|
| Phase | {phase-name} |
| Plan | {plan-name} |
| Status | {status} |
| Wave | {wave} |

## Progress Overview

```
Phases:    [=====-     ] 50% (X/Y)
Plans:     [=======--  ] 70% (X/Y)
Tasks:     [=========--] 80% (X/Y)
```

### Metrics
- **Phases Complete:** X/Y
- **Plans Complete:** X/Y
- **Tasks Complete:** X/Y
- **Files Modified:** X
- **Commits:** X

## Blockers and Risks

### Blockers (Critical)
| Blocker | Severity | Impact | Mitigation |
|---------|----------|--------|------------|
| {blocker} | Critical | Blocks Phase X | {action} |

### Risks (Watch)
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| {risk} | Medium | Affects Plan Y | {action} |

## Recent Activity (Last 24h)

### Completed
- {phase}-{plan}: {summary}

### Decisions Made
- {decision 1}
- {decision 2}

### Files Modified
- {file 1}: {change type}
- {file 2}: {change type}

## Next Steps

### Immediate (Next Session)
1. {action 1} - {workflow reference}
2. {action 2} - {workflow reference}

### Short-term (This Phase)
1. {action 1}
2. {action 2}

### Upcoming (Next Phase)
1. {phase name}

## Session Continuity

### Context for Next Session
- {key context 1}
- {key context 2}

### Decisions to Remember
- {decision 1}
- {decision 2}

### Open Questions
- {question 1}
- {question 2}

## Health Indicators

| Indicator | Status | Notes |
|-----------|--------|-------|
| Tests | PASS | All tests passing |
| Build | PASS | No errors |
| Docs | WARN | Update needed |
| Dependencies | OK | No updates required |

---

**Workflow References:**
- Continue planning: @workflows/plan-phase.md
- Execute next plan: @workflows/execute-plan.md
- Verify phase: @workflows/verify-phase.md
```

### Thinking Phase: Post-Step - Report Created

<server>debug</server>
<prompt>Reflect on report creation:
1. Was the report comprehensive?
2. What information is most useful?
3. What should be remembered for future reports?</prompt>
<expected_output>Reporting patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="update_state">
Update STATE.md with:
- Status report generation timestamp
- Session continuity notes
- Any new decisions captured
</step>

## Thinking Phase: Post-Workflow - Status Complete

<server>tractatus</server>
<prompt>Comprehensive status analysis:
1. What is the overall project health?
2. What trends are emerging?
3. What should be communicated to stakeholders?
4. What actions should be prioritized?</prompt>
<expected_output>Status insights and prioritization recommendations</expected_output>
<timeout>5000</timeout>
<integration>Update status report with insights, prepare for next workflow</integration>

</process>

<completion_format>
When status report completes, return:

```markdown
## STATUS REPORT GENERATED

**Report:** .planning/STATUS-{date}.md

## Quick Summary
- **Position:** Phase X, Plan Y, Task Z
- **Progress:** X% phases, Y% plans, Z% tasks
- **Blockers:** X critical, Y warnings
- **Next:** {next action}

## Key Insights
- {insight 1}
- {insight 2}

## Recommended Actions
1. {action 1} - Priority: HIGH
2. {action 2} - Priority: MEDIUM

**View full report:** .planning/STATUS-{date}.md
```

</completion_format>

<validation_considerations>

## Integration with Other Workflows

Status reports support:

1. **Session continuity** - Context for new sessions
2. **Decision tracking** - Documented decisions
3. **Progress tracking** - Quantitative metrics
4. **Communication** - Stakeholder updates

Generate status reports:
- At session end
- Before checkpoints
- On user request
- After phase completion

</validation_considerations>

---

**Version:** 1.0  
**Last Updated:** 2026-02-17  
**Status:** Active
