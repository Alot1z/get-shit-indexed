---
name: gsi:debug
description: Systematic debugging with persistent state across context resets
argument-hint: [issue description]
allowed-tools:
  # Desktop Commander MCP - File operations
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__create_directory
  - mcp__desktop-commander__start_process
  - mcp__desktop-commander__read_process_output
  - mcp__desktop-commander__interact_with_process
  # Code-Index MCP - Code analysis
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - mcp__code-index-mcp__build_deep_index
  # Thinking servers
  - mcp__debug-thinking__debug_thinking
  - mcp__sequential-thinking__sequentialthinking
  - mcp__tractatusthinking__tractatus_thinking
  # Other tools
  - Task
  - AskUserQuestion
thinking_phase:
  mode: COMPREHENSIVE
  servers: [debug, sequential, tractatus]
  bmad_enabled: true
  timeout: 20000
  rationale: "Debugging requires debug-thinking for systematic hypothesis testing and knowledge persistence, sequential for investigation step planning, and tractatus for root cause structural analysis"
---

<!--
CI Tools Usage:
- search_code_advanced: Find code patterns for error sources
- find_files: Discover relevant files
- get_file_summary: Understand file context
- get_symbol_body: Inspect problematic functions and trace relationships
- build_deep_index: Fresh symbol extraction

Debug-thinking Usage:
- create: Record problems, hypotheses, experiments, solutions
- connect: Link evidence to hypotheses
- query: Find similar problems from history
-->

<objective>
Debug issues using scientific method with subagent isolation and persistent knowledge graph.

**Orchestrator role:** Gather symptoms, query history for similar issues, spawn GSI-debugger agent, handle checkpoints, spawn continuations, capture learnings.

**Why subagent:** Investigation burns context fast (reading files, forming hypotheses, testing). Fresh 200k context per investigation. Main context stays lean for user interaction.

**Knowledge persistence:** Debug-thinking MCP stores patterns across sessions (~/.debug-thinking-mcp/)
</objective>

<context>
User's issue: $ARGUMENTS

Check for active sessions:
```bash
ls .planning/debug/*.md 2>/dev/null | grep -v resolved | head -5
```
</context>

<process>

## 0. Initialize Context

### Thinking Phase: Pre-Workflow

<server>debug</server>
<prompt>Analyze the debugging context:
1. What type of issue might this be based on the description?
2. What investigation strategies typically work for this type?
3. What information gaps need to be filled?</prompt>
<expected_output>Debug strategy with investigation priorities</expected_output>
<timeout>5000</timeout>

Load state and resolve debugger model:
```bash
INIT=$(node ~/.claude/get-shit-indexed/bin/GSI-tools.js state load)
```

Extract `commit_docs` from init JSON. Resolve debugger model:
```bash
DEBUGGER_MODEL=$(node ~/.claude/get-shit-indexed/bin/GSI-tools.js resolve-model GSI-debugger --raw)
```

Query debug-thinking for similar problems:
```
action: query
queryType: similar-problems
parameters: {pattern: "$ARGUMENTS", limit: 3, minSimilarity: 0.5}
```

If similar issues found, present them:
```markdown
## Similar Issues Found

| # | Issue | Solution | Similarity |
|---|-------|----------|------------|
| 1 | {issue} | {solution} | {similarity}% |

Would you like to:
- Continue with new investigation
- Review similar issue solution first
```

## 1. Check Active Sessions

If active sessions exist AND no $ARGUMENTS:
- List sessions with status, hypothesis, next action
- User picks number to resume OR describes new issue

If $ARGUMENTS provided OR user describes new issue:
- Continue to symptom gathering

## 2. Gather Symptoms (if new issue)

### Thinking Phase: Pre-Step - Symptom Planning

<server>sequential</server>
<prompt>Plan symptom gathering:
1. What questions will reveal the most information?
2. What details are most diagnostic?
3. What context is essential vs optional?</prompt>
<expected_output>Symptom gathering approach</expected_output>
<timeout>3000</timeout>

Use AskUserQuestion for each:

1. **Expected behavior** - What should happen?
2. **Actual behavior** - What happens instead?
3. **Error messages** - Any errors? (paste or describe)
4. **Timeline** - When did this start? Ever worked?
5. **Reproduction** - How do you trigger it?

After all gathered, confirm ready to investigate.

### Thinking Phase: Post-Step - Symptoms Analyzed

<server>debug</server>
<prompt>Reflect on symptoms:
1. What patterns emerge from the symptoms?
2. What are likely root cause categories?
3. What should be recorded for future reference?</prompt>
<expected_output>Symptom patterns stored</expected_output>
<timeout>2000</timeout>

Create problem node in debug-thinking:
```
action: create
nodeType: problem
content: {issue description from symptoms}
metadata: {tags: [error-types], severity: inferred, reproducibility: assessed}
```

## 3. Spawn GSI-debugger Agent

### Thinking Phase: Pre-Step - Investigation Planning

<server>sequential</server>
<prompt>Plan the investigation approach:
1. What should the debugger investigate first?
2. What hypotheses should it prioritize?
3. What evidence is most critical to gather?</prompt>
<expected_output>Investigation plan for subagent</expected_output>
<timeout>3000</timeout>

Fill prompt and spawn:

```markdown
<objective>
Investigate issue: {slug}

**Summary:** {trigger}
</objective>

<symptoms>
expected: {expected}
actual: {actual}
errors: {errors}
reproduction: {reproduction}
timeline: {timeline}
</symptoms>

<mode>
symptoms_prefilled: true
goal: find_and_fix
</mode>

<debug_file>
Create: .planning/debug/{slug}.md
</debug_file>

<debug_thinking_context>
Problem node ID: {node-id from debug-thinking}
</debug_thinking_context>
```

```
Task(
  prompt=filled_prompt,
  subagent_type="GSI-debugger",
  model="{debugger_model}",
  description="Debug {slug}"
)
```

## 4. Handle Agent Return

### Thinking Phase: Pre-Step - Result Analysis

<server>debug</server>
<prompt>Analyze agent results:
1. Was the root cause definitively identified?
2. What evidence supports the conclusion?
3. Is the fix approach sound?</prompt>
<expected_output>Result assessment</expected_output>
<timeout>3000</timeout>

**If `## ROOT CAUSE FOUND`:**
- Display root cause and evidence summary
- Store solution in debug-thinking:
  ```
  action: create
  nodeType: solution
  content: {root cause and fix}
  parentId: {problem-node-id}
  metadata: {verified: false}
  ```
- Offer options:
  - "Fix now" - spawn fix subagent
  - "Plan fix" - suggest /gsi:plan-phase --gaps
  - "Manual fix" - done

**If `## CHECKPOINT REACHED`:**
- Present checkpoint details to user
- Get user response
- Store checkpoint in debug-thinking:
  ```
  action: create
  nodeType: experiment
  content: {checkpoint details}
  parentId: {problem-node-id}
  metadata: {type: checkpoint, awaiting: user-response}
  ```
- Spawn continuation agent (see step 5)

**If `## INVESTIGATION INCONCLUSIVE`:**
- Show what was checked and eliminated
- Record eliminated hypotheses:
  ```
  action: create
  nodeType: observation
  content: {what was eliminated}
  parentId: {problem-node-id}
  ```
- Offer options:
  - "Continue investigating" - spawn new agent with additional context
  - "Manual investigation" - done
  - "Add more context" - gather more symptoms, spawn again

## 5. Spawn Continuation Agent (After Checkpoint)

When user responds to checkpoint, spawn fresh agent:

```markdown
<objective>
Continue debugging {slug}. Evidence is in the debug file.
</objective>

<prior_state>
Debug file: @.planning/debug/{slug}.md
</prior_state>

<checkpoint_response>
**Type:** {checkpoint_type}
**Response:** {user_response}
</checkpoint_response>

<mode>
goal: find_and_fix
</mode>

<debug_thinking_context>
Problem node ID: {node-id}
Checkpoint node ID: {checkpoint-node-id}
</debug_thinking_context>
```

```
Task(
  prompt=continuation_prompt,
  subagent_type="GSI-debugger",
  model="{debugger_model}",
  description="Continue debug {slug}"
)
```

## 6. Capture Learnings (After Resolution)

### Thinking Phase: Post-Workflow

<server>debug</server>
<prompt>Capture debugging learnings:
1. What debugging patterns worked well?
2. What investigation strategies were effective?
3. What should be remembered for future similar issues?
4. How could the process be improved?</prompt>
<expected_output>Debugging patterns stored in knowledge graph</expected_output>
<timeout>5000</timeout>

After successful resolution, update debug-thinking:

```
action: connect
from: {problem-node-id}
to: {solution-node-id}
type: solves
strength: 1.0
```

Store learnings:
```
action: create
nodeType: learning
content: {key insights from debugging session}
parentId: {solution-node-id}
metadata: {patterns: [identified-patterns], effectiveness: rating}
```

This enables future sessions to find similar problems and solutions.

</process>

<success_criteria>
- [ ] Active sessions checked
- [ ] Similar problems queried from debug-thinking history
- [ ] Symptoms gathered (if new)
- [ ] Problem node created in debug-thinking
- [ ] GSI-debugger spawned with context
- [ ] Checkpoints handled correctly
- [ ] Root cause confirmed before fixing
- [ ] Learnings captured in debug-thinking
</success_criteria>

<error_recovery>

## Common Issues and Solutions

### Issue: Debug-thinking MCP Unavailable
- Continue without knowledge graph persistence
- Log warning to user
- Proceed with standard debugging

### Issue: Similar Problems Query Fails
- Skip history lookup
- Continue with fresh investigation
- Record issue for MCP debugging

### Issue: Subagent Context Overflow
- Check for checkpoint signals
- Spawn continuation if needed
- Increase model context if available

### Issue: Fix Verification Fails
- Return to investigation phase
- Record failed hypothesis
- Form new hypothesis based on evidence

</error_recovery>
