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

## Validation Steps

### Step 1: Load Plan

Read plan file using DesktopCommander:
```
File: .planning/phases/XX-name/{phase}-{plan}-PLAN.md
```

### Step 2: Validate Frontmatter

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

- Truths are user-observable
- Artifacts are specific file paths
- Key links have testable patterns

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
