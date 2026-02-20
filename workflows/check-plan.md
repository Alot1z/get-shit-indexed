# Check Plan Workflow

## Overview

This workflow validates plan quality against 6 dimensions before execution.

## Purpose

Validate plan quality against 6 dimensions:
1. Requirement coverage
2. Task completeness
3. Dependency correctness
4. Key links planned
5. Scope sanity
6. Must-haves derivation

## Prerequisites

- PLAN.md file exists
- @references/plan-checker.md available
- Plan frontmatter complete

## Thinking Phase: Pre-Workflow

<server>tractatus</server>
<prompt>Analyze plan verification structure:
1. What are the structural components of a valid plan?
2. How do validation dimensions relate to each other?
3. What are the critical dependencies in plan structure?
4. What makes a plan structurally sound?</prompt>
<expected_output>Understanding of plan structure and validation relationships</expected_output>
<timeout>4000</timeout>
<integration>Apply structural understanding to comprehensive plan validation</integration>

## Validation Steps

### Step 1: Load Plan

#### Thinking Phase: Pre-Step - Load Plan

<server>sequential</server>
<prompt>Plan the validation approach:
1. What information do we need from the plan?
2. How do we organize validation checks?
3. What validation order is most efficient?</prompt>
<expected_output>Step-by-step validation approach</expected_output>
<timeout>3000</timeout>

Read plan file using DesktopCommander:
```
File: .planning/phases/XX-name/{phase}-{plan}-PLAN.md
```

#### Thinking Phase: Post-Step - Plan Loaded

<server>debug</server>
<prompt>Reflect on plan structure:
1. Was the plan structure clear?
2. What patterns in plan quality emerged?
3. What should be remembered about this plan type?</prompt>
<expected_output>Plan structure patterns stored for reference</expected_output>
<timeout>2000</timeout>

### Step 2: Validate Frontmatter

#### Thinking Phase: Pre-Step - Validate Frontmatter

<server>tractatus</server>
<prompt>Analyze frontmatter structure:
1. What are the required frontmatter fields?
2. How do frontmatter fields relate to plan structure?
3. What makes frontmatter complete?</prompt>
<expected_output>Understanding of frontmatter structure and completeness criteria</expected_output>
<timeout>2000</timeout>

Check all required fields present:
- [ ] phase
- [ ] plan
- [ ] type
- [ ] wave
- [ ] depends_on
- [ ] files_modified
- [ ] autonomous
- [ ] must_haves

See @references/plan-frontmatter-reference.md for field specifications.

### Step 3: Check Requirement Coverage

For each requirement in phase goal:
- [ ] Mapped to at least one task
- [ ] Truth observable
- [ ] Artifact specified

### Step 4: Validate Task Completeness

For each task:
- [ ] Has `<name>` element
- [ ] Has `<files>` element
- [ ] Has `<action>` element
- [ ] Has `<verify>` element
- [ ] Has `<done>` element

### Step 5: Build and Validate Dependency Graph

- Build dependency graph from plan frontmatter
- Detect circular dependencies
- Verify wave assignments
- Identify parallelization opportunities

### Step 6: Check Scope Sanity

- Task count: 2-3 (target), 4-5 (warn), 6+ (error)
- Context estimation: ~50% target
- Check for split signals

### Step 7: Verify Must-Haves Derivation

#### Thinking Phase: Pre-Step - Verify Must-Haves

<server>tractatus</server>
<prompt>Analyze must-have derivation:
1. What is the logical structure of must-haves?
2. How do truths connect to artifacts?
3. What makes key links testable?</prompt>
<expected_output>Understanding of must-have structure and testability</expected_output>
<timeout>3000</timeout>

- Truths are user-observable
- Artifacts are specific file paths
- Key links have testable patterns

#### Thinking Phase: Post-Step - Must-Haves Verified

<server>debug</server>
<prompt>Reflect on must-have verification:
1. Were must-haves properly derived?
2. What patterns in must-have quality emerged?
3. What should be remembered for future plans?</prompt>
<expected_output>Must-have quality patterns stored for learning</expected_output>
<timeout>2000</timeout>

## Thinking Phase: Post-Workflow - Validation Complete

<server>debug</server>
<prompt>Comprehensive validation reflection:
1. What validation patterns emerged?
2. What common issues were found?
3. What validation improvements are needed?
4. What should be remembered about plan quality?</prompt>
<expected_output>Validation patterns and quality insights stored in debug-thinking graph</expected_output>
<timeout>4000</timeout>
<integration>Store validation learnings, improve validation workflow if needed</integration>

## Output Format

```markdown
# Plan Checker Report

## Plan: {phase}-{plan}
## Status: PASS/FAIL

### Dimension Results

| Dimension | Status | Issues |
|-----------|--------|--------|
| Requirement Coverage | PASS/FAIL | X issues |
| Task Completeness | PASS/FAIL | X issues |
| Dependency Correctness | PASS/FAIL | X issues |
| Key Links Planned | PASS/FAIL/WARNING | X issues |
| Scope Sanity | PASS/FAIL/WARNING | X issues |
| Must-Haves Derivation | PASS/FAIL | X issues |

### Overall Status
PASS if all dimensions PASS
FAIL if any dimension FAIL
WARN if only WARNINGS (no FAILS)

### Issues Found

[Detailed list of issues by dimension]

### Recommendations

[Specific fixes for each issue]

### Next Steps

If PASS: Plan is ready for execution
If FAIL: Fix issues and re-run validation
If WARN: Review warnings, can proceed if acceptable
```

## Exit Codes

- `0`: All dimensions pass
- `1`: Blocker issues found
- `2`: Warnings only

## Usage

### Command Line

```bash
# Check specific plan
GSI check-plan .planning/phases/06-quality-verification/06-01-PLAN.md

# Check all plans in phase
GSI check-plan .planning/phases/06-quality-verification/*-PLAN.md
```

### Integration with Plan Workflow

Plan workflow automatically runs plan checker after creating PLAN.md files.

See @workflows/plan-phase.md

## References

- @references/plan-checker.md - Validation dimensions and criteria
- @references/plan-frontmatter-reference.md - Frontmatter specification

---

**Version:** 1.0  
**Last Updated:** 2026-02-13  
**Status:** Active
