# Diagnose Issues Workflow

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- Use `mcp__desktop-commander__read_file` instead of Read
- Use `mcp__desktop-commander__write_file` instead of Write
- Use `mcp__desktop-commander__list_directory` instead of Bash ls

**Code Search:**
- Use `mcp__code-index-mcp__search_code_advanced` instead of Grep
- Use `mcp__code-index-mcp__find_files` instead of Glob

**Process Operations:**
- Use `mcp__desktop-commander__start_process` for running tests/builds
- Use `mcp__desktop-commander__read_process_output` for capturing output

**Debug Tools:**
- Use `mcp__debug-thinking__debug_thinking` for systematic debugging
</tool_requirements>

<purpose>
Systematically diagnose issues (bugs, errors, failures) by following a structured investigation process that identifies root causes and recommends solutions.
</purpose>

<required_reading>
# Debug References
@references/validation-gates.md

# Agent Reference
@agents/GSI-executor.md
</required_reading>

<process>

## Thinking Phase: Pre-Workflow

<server>debug</server>
<prompt>Analyze the diagnosis workflow:
1. What type of issue is being diagnosed?
2. What symptoms are observable?
3. What investigation strategies apply?
4. What root cause patterns are likely?</prompt>
<expected_output>Diagnosis strategy with investigation priorities</expected_output>
<timeout>5000</timeout>
<integration>Use debug-thinking to structure investigation approach</integration>

<step name="capture_issue_details">
Capture the issue being diagnosed.

### Thinking Phase: Pre-Step - Capture Issue

<server>sequential</server>
<prompt>Plan issue capture:
1. What information is needed?
2. How do we reproduce the issue?
3. What context is relevant?</prompt>
<expected_output>Issue capture approach</expected_output>
<timeout>3000</timeout>

**Issue details to capture:**
- Error message or symptom
- Steps to reproduce
- Expected vs actual behavior
- Environment/context
- When it started occurring
- Any recent changes

**Create issue record in debug-thinking:**
```
action: create
nodeType: problem
content: {issue description}
metadata: {context, severity, reproducibility}
```

### Thinking Phase: Post-Step - Issue Captured

<server>debug</server>
<prompt>Reflect on issue capture:
1. Was the issue clearly defined?
2. What context is missing?
3. What patterns suggest root causes?</prompt>
<expected_output>Issue patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="gather_evidence">
Collect logs, errors, and relevant data.

### Thinking Phase: Pre-Step - Gather Evidence

<server>sequential</server>
<prompt>Plan evidence gathering:
1. What evidence sources exist?
2. How do we collect logs?
3. What data is most relevant?</prompt>
<expected_output>Evidence gathering strategy</expected_output>
<timeout>3000</timeout>

**Evidence sources:**
- Error messages and stack traces
- Log files
- Test output
- Build output
- Git history (recent changes)
- Configuration files

**Use:**
- `start_process` to run commands and capture output
- `read_file` to read log files
- `search_code_advanced` to find related code

### Thinking Phase: Post-Step - Evidence Gathered

<server>debug</server>
<prompt>Reflect on evidence gathering:
1. Was evidence comprehensive?
2. What patterns emerged?
3. What evidence is most relevant?</prompt>
<expected_output>Evidence patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="form_hypotheses">
Generate hypotheses about root cause.

### Thinking Phase: Pre-Step - Form Hypotheses

<server>tractatus</server>
<prompt>Analyze hypothesis structure:
1. What are the logical components?
2. What causal chains exist?
3. What hypotheses are testable?</prompt>
<expected_output>Hypothesis structure with testability</expected_output>
<timeout>3000</timeout>

**Create hypothesis nodes in debug-thinking:**
```
action: create
nodeType: hypothesis
content: {hypothesis description}
parentId: {problem-node-id}
metadata: {confidence: 0-100, testable: true/false}
```

**Hypothesis sources:**
- Error patterns
- Recent code changes
- Dependency issues
- Configuration problems
- Environment differences

### Thinking Phase: Post-Step - Hypotheses Formed

<server>debug</server>
<prompt>Reflect on hypothesis formation:
1. Were hypotheses comprehensive?
2. What hypotheses are most likely?
3. What hypotheses are easily testable?</prompt>
<expected_output>Hypothesis patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="prioritize_hypotheses">
Prioritize hypotheses for testing.

### Thinking Phase: Pre-Step - Prioritize Hypotheses

<server>sequential</server>
<prompt>Plan hypothesis prioritization:
1. What criteria determine priority?
2. How do we balance likelihood vs testability?
3. What order is most efficient?</prompt>
<expected_output>Prioritization approach with rationale</expected_output>
<timeout>3000</timeout>

**Prioritization criteria:**
- Likelihood (how probable)
- Testability (how easy to verify)
- Impact (if true, how severe)
- Dependencies (what else must be true)

**Connect hypotheses to problem:**
```
action: connect
from: {problem-node-id}
to: {hypothesis-node-id}
type: hypothesizes
strength: {0-1}
```

### Thinking Phase: Post-Step - Hypotheses Prioritized

<server>debug</server>
<prompt>Reflect on prioritization:
1. Was prioritization logical?
2. What tradeoffs exist?
3. What order is most efficient?</prompt>
<expected_output>Prioritization patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="test_hypotheses">
Test hypotheses systematically.

### Thinking Phase: Pre-Step - Test Hypotheses

<server>sequential</server>
<prompt>Plan hypothesis testing:
1. What tests are needed?
2. How do we isolate variables?
3. What tools are most effective?</prompt>
<expected_output>Testing plan with isolation strategy</expected_output>
<timeout>3000</timeout>

**For each hypothesis (in priority order):**

1. Design experiment
```
action: create
nodeType: experiment
content: {experiment description}
parentId: {hypothesis-node-id}
```

2. Execute experiment
- Use `start_process` for commands
- Use `search_code_advanced` for code investigation
- Use `read_file` for file inspection

3. Record observation
```
action: create
nodeType: observation
content: {observation}
parentId: {experiment-node-id}
```

4. Connect to hypothesis
```
action: connect
from: {experiment-node-id}
to: {observation-node-id}
type: produces
```

### Thinking Phase: Post-Step - Hypotheses Tested

<server>debug</server>
<prompt>Reflect on hypothesis testing:
1. Were tests conclusive?
2. What unexpected findings emerged?
3. What should be remembered?</prompt>
<expected_output>Testing patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="identify_root_cause">
Identify root cause from evidence.

### Thinking Phase: Pre-Step - Identify Root Cause

<server>tractatus</server>
<prompt>Analyze root cause structure:
1. What is the logical chain?
2. What evidence supports each link?
3. What is the fundamental cause?</prompt>
<expected_output>Root cause structure with supporting evidence</expected_output>
<timeout>3000</timeout>

**Query debug-thinking for insights:**
```
action: query
queryType: similar-problems
parameters: {pattern: {issue keywords}}
```

**Confirm root cause:**
- Multiple lines of evidence support
- No competing explanations
- Logically consistent
- Fixes the original issue

**Record solution:**
```
action: create
nodeType: solution
content: {solution description}
parentId: {problem-node-id}
metadata: {verified: true/false}
```

### Thinking Phase: Post-Step - Root Cause Identified

<server>debug</server>
<prompt>Reflect on root cause identification:
1. Was root cause definitive?
2. What evidence was most convincing?
3. What patterns should be remembered?</prompt>
<expected_output>Root cause patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="create_diagnosis_report">
Document diagnosis and recommendations.

### Thinking Phase: Pre-Step - Create Report

<server>sequential</server>
<prompt>Plan report creation:
1. What information is essential?
2. How do we structure for action?
3. What level of detail is appropriate?</prompt>
<expected_output>Report creation plan with structure</expected_output>
<timeout>3000</timeout>

Create `.planning/DIAGNOSIS-{issue-id}.md`:

```markdown
# Issue Diagnosis Report

**Issue ID:** {issue-id}
**Generated:** {date}
**Status:** Diagnosed

## Issue Summary

### Symptoms
- {symptom 1}
- {symptom 2}

### Impact
- Severity: {Critical/High/Medium/Low}
- Affected: {components/users}
- Reproducible: {Yes/No/Sometimes}

## Root Cause

**Root Cause:** {root cause description}

### Evidence Chain
1. {Evidence 1} -> {Inference 1}
2. {Evidence 2} -> {Inference 2}
3. {Evidence 3} -> Root Cause

### Hypotheses Evaluated
| Hypothesis | Likelihood | Tested | Result |
|------------|------------|--------|--------|
| {hypothesis 1} | High | Yes | Disproven |
| {hypothesis 2} | Medium | Yes | Confirmed |

## Recommended Solution

### Primary Fix
{detailed fix description}

**Files to modify:**
- {file 1}: {change description}
- {file 2}: {change description}

### Alternative Approaches
1. {alternative 1}
2. {alternative 2}

## Prevention

### Similar Issues
Query debug-thinking for similar patterns:
```
action: query
queryType: similar-problems
parameters: {pattern: {keywords}}
```

### Recommendations
1. {recommendation 1}
2. {recommendation 2}

## Next Steps

1. Implement fix
2. Add test case
3. Update documentation
4. Review similar code

---

**Debug Graph Nodes:** {node-ids}
**Confidence:** {X%}
```

### Thinking Phase: Post-Step - Report Created

<server>debug</server>
<prompt>Reflect on report creation:
1. Was diagnosis comprehensive?
2. What was learned about debugging?
3. What patterns should be stored?</prompt>
<expected_output>Diagnosis patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="update_state">
Update STATE.md with:
- Diagnosis completion
- Key learnings
- Any new blockers or decisions
</step>

## Thinking Phase: Post-Workflow - Diagnosis Complete

<server>debug</server>
<prompt>Comprehensive diagnosis reflection:
1. What debugging patterns emerged?
2. What investigation strategies worked?
3. What should be remembered for future issues?
4. How can similar issues be prevented?</prompt>
<expected_output>Debugging patterns and prevention insights</expected_output>
<timeout>5000</timeout>
<integration>Store learnings in debug-thinking, update prevention recommendations</integration>

</process>

<completion_format>
When diagnosis completes, return:

```markdown
## DIAGNOSIS COMPLETE

**Issue:** {issue-id}
**Report:** .planning/DIAGNOSIS-{issue-id}.md

## Root Cause
{root cause summary}

## Recommended Fix
{fix summary}

## Files to Modify
- {file 1}
- {file 2}

## Confidence: {X%}

## Next Steps
1. Implement fix
2. Run tests
3. Verify resolution

**Debug Graph:** Available in debug-thinking MCP
```

</completion_format>

<validation_considerations>

## Integration with Other Workflows

Diagnosis supports:

1. **Execution** - Fix bugs discovered during execution
2. **Verification** - Debug failed verifications
3. **Planning** - Understand issues before planning fixes

**Query debug-thinking for similar issues:**
```
action: query
queryType: similar-problems
parameters: {pattern: {issue keywords}, limit: 5}
```

</validation_considerations>

---

**Version:** 1.0  
**Last Updated:** 2026-02-17  
**Status:** Active
