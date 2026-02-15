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

<step name="load_project_state">
Read `.planning/STATE.md` to understand current position.
</step>

<step name="define_phase_goal">
Define the phase goal from ROADMAP.md or user requirements.

**Goal format: Outcome-focused**
- Good: "Working authentication system with JWT refresh"
- Bad: "Build auth components"

Reframe task-shaped goals as outcomes.
</step>

<step name="derive_must_haves">
Use goal-backward method to derive must_haves:

1. **State the Goal** - Outcome-focused
2. **Derive Observable Truths** - 3-7 user-observable behaviors
3. **Derive Required Artifacts** - Specific file paths
4. **Derive Required Wiring** - Imports, data flows, API calls
5. **Identify Key Links** - Critical connections that break easily

See @references/plan-checker.md for detailed methodology.
</step>

<step name="decompose_into_plans">
Break phase into 2-4 plans with 2-3 tasks each.

**Scope sanity:**
- Target: 2-3 tasks per plan
- Context target: ~50% per plan
- Split if: >3 tasks, multiple subsystems, >5 file modifications

**Dependency graph:**
- Wave 1: No depends_on (independent)
- Wave N: max(depends_on waves) + 1
- No circular dependencies
</step>

<step name="write_plan_files">
Create {phase}-{plan}-PLAN.md files with:

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
</step>

<step name="validate_plans">
After writing PLAN.md files, run plan checker validation:

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
