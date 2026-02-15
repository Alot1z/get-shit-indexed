# Plan Phase Workflow

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
Create execution plans for a phase using goal-backward methodology.
</purpose>

<required_reading>
# Validation References
@references/validation-gates.md
@references/plan-checker.md
@references/plan-frontmatter-reference.md

# Agent Reference
@agents/GSI-planner.md
</required_reading>

<process>

## Thinking Phase: Pre-Workflow

<server>tractatus</server>
<prompt>Analyze the plan-phase workflow structure:
1. What are the key objectives of planning a phase?
2. What dependencies exist between planning steps?
3. What are the potential failure points in planning?
4. What is the optimal order for planning operations?</prompt>
<expected_output>Structured breakdown of planning components with dependency mapping</expected_output>
<timeout>5000</timeout>
<integration>Use structure analysis to prioritize planning steps and identify complexity risks</integration>

<step name="load_project_state">
Read `.planning/STATE.md` to understand current position.

### Thinking Phase: Pre-Step - Load Project State

<server>sequential</server>
<prompt>Analyze the state loading step:
1. What information do we need from STATE.md?
2. How does current position affect planning decisions?
3. What context is essential for valid planning?</prompt>
<expected_output>Understanding of required state information and its planning implications</expected_output>
<timeout>3000</timeout>
<integration>Ensure all relevant context is loaded before proceeding</integration>

### Thinking Phase: Post-Step - State Loaded

<server>debug</server>
<prompt>Reflect on state loading:
1. Was the current position clear?
2. Were dependencies from previous phases identified?
3. What should be remembered about project state for planning?</prompt>
<expected_output>Observations about project state stored in debug-thinking graph</expected_output>
<timeout>3000</timeout>
</step>

<step name="define_phase_goal">
Define the phase goal from ROADMAP.md or user requirements.

### Thinking Phase: Pre-Step - Define Phase Goal

<server>tractatus</server>
<prompt>Analyze goal definition:
1. What is the structural essence of this phase?
2. How does this phase relate to adjacent phases?
3. What are the boundary conditions for this phase?</prompt>
<expected_output>Clear understanding of phase structural position and requirements</expected_output>
<timeout>3000</timeout>
<integration>Define outcome-focused goal based on structural analysis</integration>

**Goal format: Outcome-focused**
- Good: "Working authentication system with JWT refresh"
- Bad: "Build auth components"

Reframe task-shaped goals as outcomes.

### Thinking Phase: Post-Step - Goal Defined

<server>debug</server>
<prompt>Reflect on goal definition:
1. Is the goal outcome-focused or task-shaped?
2. What made this goal clear or unclear?
3. What patterns in goal definition should be remembered?</prompt>
<expected_output>Goal definition patterns stored for future reference</expected_output>
<timeout>3000</timeout>
</step>

<step name="derive_must_haves">
Use goal-backward method to derive must_haves:

### Thinking Phase: Pre-Step - Derive Must-Haves

<server>tractatus</server>
<prompt>Structural analysis of must-have derivation:
1. What are the logical components of "must-have"?
2. How do observable truths connect to artifacts?
3. What are the critical dependencies (key links)?
4. How do we ensure completeness of the derivation?</prompt>
<expected_output>Logical structure of must-have components and their relationships</expected_output>
<timeout>4000</timeout>
<integration>Apply structured derivation to ensure complete must-have coverage</integration>

1. **State the Goal** - Outcome-focused
2. **Derive Observable Truths** - 3-7 user-observable behaviors
3. **Derive Required Artifacts** - Specific file paths
4. **Derive Required Wiring** - Imports, data flows, API calls
5. **Identify Key Links** - Critical connections that break easily

See @references/plan-checker.md for detailed methodology.

### Thinking Phase: Post-Step - Must-Haves Derived

<server>debug</server>
<prompt>Reflect on must-have derivation:
1. Were all observable truths identified?
2. Are artifacts specific and testable?
3. What key links were easy to miss?
4. What patterns in must-have derivation emerged?</prompt>
<expected_output>Must-have derivation patterns stored for learning</expected_output>
<timeout>3000</timeout>
</step>

<step name="decompose_into_plans">
Break phase into 2-4 plans with 2-3 tasks each.

### Thinking Phase: Pre-Step - Decompose into Plans

<server>sequential</server>
<prompt>Plan the decomposition:
1. What are the natural groupings of work?
2. How many tasks can fit in one plan without overwhelming context?
3. What dependencies exist between potential plans?
4. What is the optimal wave structure?</prompt>
<expected_output>Step-by-step decomposition plan with dependency-aware wave structure</expected_output>
<timeout>4000</timeout>
<integration>Execute decomposition according to plan, monitor for dependency issues</integration>

**Scope sanity:**
- Target: 2-3 tasks per plan
- Context target: ~50% per plan
- Split if: >3 tasks, multiple subsystems, >5 file modifications

**Dependency graph:**
- Wave 1: No depends_on (independent)
- Wave N: max(depends_on waves) + 1
- No circular dependencies

### Thinking Phase: Post-Step - Plans Decomposed

<server>debug</server>
<prompt>Reflect on decomposition:
1. Was the scope appropriate for each plan?
2. Were dependencies correctly identified?
3. What decomposition patterns worked well?
4. What should be remembered about splitting work?</prompt>
<expected_output>Decomposition patterns stored in debug-thinking graph</expected_output>
<timeout>3000</timeout>
</step>

<step name="write_plan_files">
Create {phase}-{plan}-PLAN.md files with:

### Thinking Phase: Pre-Step - Write Plan Files

<server>sequential</server>
<prompt>Plan the file writing:
1. What information must be in each PLAN.md frontmatter?
2. How do we structure tasks for clarity?
3. What validation checkpoints should be included?
4. How do we ensure plans are executable?</prompt>
<expected_output>Step-by-step approach to writing complete, validated plan files</expected_output>
<timeout>3000</timeout>
<integration>Write each plan file systematically following the approach</integration>

**Frontmatter:**
- phase, plan, type, wave, depends_on, files_modified, autonomous
- must_haves: truths, artifacts, key_links

**Content:**
- objective (purpose and output)
- execution_context (@references to existing docs)
- context (@STATE.md, @ROADMAP.md, etc.)
- tasks (each with name, files, action, verify, done)
- verification (overall phase checks)
- success_criteria (checkbox list)
- output (summary content requirements)

Use template from `.planning/templates/plan-template.md`

### Thinking Phase: Post-Step - Plan Files Written

<server>debug</server>
<prompt>Reflect on plan file writing:
1. Were all plans complete and valid?
2. What made certain plans clearer than others?
3. What validation patterns emerged?
4. What should be remembered about plan structure?</prompt>
<expected_output>Plan writing patterns stored for future reference</expected_output>
<timeout>3000</timeout>
</step>

<step name="validate_plans">
After writing PLAN.md files, run plan checker validation:

### Thinking Phase: Pre-Step - Validate Plans

<server>sequential</server>
<prompt>Plan the validation process:
1. **Step 1**: What validation requirements exist?
2. **Step 2**: How do we map requirements to criteria?
3. **Step 3**: What is the systematic validation approach?
4. **Step 4**: How do we analyze results?
5. **Step 5**: How do we document findings?</prompt>
<expected_output>Step-by-step validation plan with clear criteria mapping</expected_output>
<timeout>3000</timeout>
<integration>Execute validation systematically according to plan</integration>

**Method Circle (Sequential) Thinking for Validation:**
1. **Step 1**: Understand validation requirements
2. **Step 2**: Map requirements to validation criteria
3. **Step 3**: Execute validation checks systematically
4. **Step 4**: Analyze results for completeness
5. **Step 5**: Document findings and recommendations

**Checklist:**
- [ ] Requirement coverage validated (each requirement mapped to task)
- [ ] Task completeness validated (each task has files, action, verify, done)
- [ ] Dependency correctness validated (no circular deps, waves correct)
- [ ] Key links validated (from/to/via/pattern specified)
- [ ] Scope sanity validated (2-3 tasks, ~50% context)
- [ ] Must-haves derivation validated (truths observable, artifacts specific)

See @references/plan-checker.md for validation criteria.

**If validation fails:**
- Fix issues before confirming plans
- Re-run validation
- Only proceed when all dimensions pass

### Thinking Phase: Post-Step - Plans Validated

<server>debug</server>
<prompt>Reflect on validation:
1. What validation issues were found?
2. Why did these issues occur?
3. What patterns in plan quality emerged?
4. What should be remembered to prevent similar issues?</prompt>
<expected_output>Validation patterns and issues stored in debug-thinking graph</expected_output>
<timeout>3000</timeout>
</step>

<step name="confirm_breakdown>
Present plans to user for confirmation:

```
Phase: {phase name}
Plans: {count}
Total tasks: {count}

[Show each plan summary]

Confirm breakdown?
```

### Thinking Phase: Post-Workflow - Planning Complete

<server>tractatus</server>
<prompt>Comprehensive workflow analysis:
1. What was the overall structure of the planning process?
2. What were the key success factors in creating valid plans?
3. What structural improvements could be made to the planning workflow?
4. What patterns should be documented for future planning?</prompt>
<expected_output>Structural insights about planning workflow and improvement recommendations</expected_output>
<timeout>5000</timeout>
<integration>Update planning workflow documentation, store patterns in debug-thinking</integration>
</step>

</process>

<validation_considerations>

## Integration with Validation System

Planning does NOT trigger validation (execution does). However:

1. **Success criteria reference validation gates:**
   - Plans should produce artifacts that will be validated
   - Success criteria aligned with 7-BMAD gates

2. **Plan frontmatter must be valid:**
   - See @references/plan-frontmatter-reference.md
   - must_haves.truths: Observable behaviors
   - must_haves.artifacts: Specific files with min_lines/contains
   - must_haves.key_links: Testable connections

3. **Task completeness affects validation:**
   - Tasks with proper verify criteria enable validation
   - Tasks with proper done criteria produce measurable outcomes

4. **Validation happens after execution:**
   - Planning is preparatory
   - Validation occurs when execution produces artifacts
   - See @workflows/execute-plan.md for completion signal

</validation_considerations>

---

**Version:** 1.0  
**Last Updated:** 2026-02-13  
**Status:** Active
