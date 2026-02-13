# Plan Checker Specification

## Overview

This document defines the plan checker specification with validation dimensions and criteria for ensuring plans are complete, valid, and achievable before execution.

## Validation Dimensions

### Dimension 1: Requirement Coverage

**Purpose:** Verify each requirement from ROADMAP.md is mapped to at least one task.

**Criteria:**
- Each requirement in phase goal maps to at least one task
- No orphaned requirements
- All phase goals addressed

**Validation:** Cross-reference requirement IDs with task descriptions

**Severity:** Blocker if requirement missing

**Example:**
```
PASS: Phase goal "JWT authentication" → Task 1 "Create user model", Task 2 "Implement login"
FAIL: Phase goal "JWT authentication" → No tasks address token generation
```

### Dimension 2: Task Completeness

**Purpose:** Verify each task has required XML elements.

**Criteria:**
- Each task has `<files>` element
- Each task has `<action>` element
- Each task has `<verify>` element
- Each task has `<done>` element

**Validation:** XML structure check for required elements

**Severity:** Blocker if any element missing

**Example:**
```
PASS: Task has <files>, <action>, <verify>, <done>
FAIL: Task missing <verify> element
```

### Dimension 3: Dependency Correctness

**Purpose:** Verify dependency graph is valid.

**Criteria:**
- depends_on array valid (references existing plans)
- No circular dependencies
- Wave assignments correct (wave = max(dep waves) + 1)
- Parallelization opportunities identified

**Validation:** Build dependency graph, detect cycles, verify wave computation

**Severity:**
- Blocker: Circular dependency
- Warning: Wave inconsistent

**Example:**
```
PASS: Plan A (wave 1) → Plan B (wave 2, depends_on: [A])
FAIL: Plan A → Plan B → Plan A (circular)
WARN: Plan B wave should be 2, not 3
```

### Dimension 4: Key Links Planned

**Purpose:** Verify must_haves.key_links are specified.

**Criteria:**
- must_haves.key_links present
- All links have required fields: from, to, via, pattern
- Patterns are testable (regex/searchable)

**Validation:** Check link structure and pattern testability

**Severity:** Warning if links missing (may be optional)

**Example:**
```
PASS: key_links: [{from: "a.md", to: "b.md", via: "import", pattern: "import.*from.*b"}]
FAIL: key_links: [{from: "a.md"}] (missing to, via, pattern)
WARN: No key_links specified
```

### Dimension 5: Scope Sanity

**Purpose:** Verify plan scope is appropriate.

**Criteria:**
- 2-3 tasks per plan (target)
- ~50% context target per plan
- Appropriate complexity for single execution

**Validation:** Task count, estimated context per task

**Severity:**
- Warning: 4-5 tasks (consider splitting)
- Error: 6+ tasks (must split)

**Example:**
```
PASS: 3 tasks, estimated 45% context
WARN: 4 tasks, estimated 55% context (consider splitting)
FAIL: 7 tasks, estimated 90% context (must split)
```

### Dimension 6: Must-Haves Derivation

**Purpose:** Verify must_haves derived using goal-backward method.

**Criteria:**
- must_haves.truths are observable behaviors
- must_haves.artifacts are specific file paths
- must_haves.key_links have testable patterns
- All truths trace to artifacts

**Validation:** Check truth format, artifact specificity, link testability

**Severity:** Blocker if must_haves not derivable from goal

**Example:**
```
PASS: truths: ["Users can log in with email/password"], artifacts: [{path: "src/auth/login.ts"}]
FAIL: truths: ["Login function implemented"], artifacts: [{path: "auth files"}]
```

## Goal-Backward Derivation Method

### Step 1: State the Goal

Take phase goal from ROADMAP.md and reframe as outcome.

**Good:** "Working chat interface"
**Bad:** "Build chat components"

### Step 2: Derive Observable Truths

Ask: "What must be TRUE for this goal?"

List 3-7 truths from USER's perspective.

Each truth must be verifiable by human using the application.

### Step 3: Derive Required Artifacts

For each truth, ask: "What must EXIST?"

List specific files or database objects.

Each artifact should be a specific file path.

### Step 4: Derive Required Wiring

For each artifact, ask: "What must be CONNECTED?"

Document imports, data flows, API calls.

### Step 5: Identify Key Links

Ask: "Where is this most likely to break?"

List critical connections that cause cascading failures.

### Validation Checklist

- [ ] Truths are user-observable, not implementation details
- [ ] Artifacts are specific file paths, not abstractions
- [ ] Key links specify exact connection patterns
- [ ] All truths trace to artifacts
- [ ] All artifacts have wiring specified

## Task Completeness Criteria

### Required Elements

Each task must have:

1. **`<name>`**: Action-oriented name
   - Format: "Task N: [Verb] [noun]"
   - Good: "Task 1: Create user model"
   - Bad: "Task 1: Database"

2. **`<files>`**: Exact file paths created or modified
   - Format: "path/to/file.ext"
   - Multiple files separated by comma
   - Not: "the auth files", "relevant components"

3. **`<action>`**: Specific implementation instructions
   - What to do and why
   - What to avoid and why
   - Specific libraries/tools to use
   - Enough detail for autonomous execution

4. **`<verify>`**: How to prove task is complete
   - Command or check
   - Expected output
   - Pass/fail criteria

5. **`<done>`**: Acceptance criteria
   - Measurable state of completion
   - Observable outcome
   - Not "It works"

### Validation Rules

- All 5 elements present
- Files are specific paths
- Action is implementable without clarification
- Verify produces binary result
- Done is observable

## Dependency Graph Validation

### Build Dependency Graph

```
For each task, record:
  needs: [tasks this task depends on]
  creates: [artifacts this task produces]
  has_checkpoint: [true if checkpoint task]
```

### Validate No Circular Dependencies

Detect cycles in dependency graph.

**Report:** "Circular dependency: Task A → Task B → Task A"

### Validate Wave Assignments

- Wave 1: No depends_on (independent roots)
- Wave N: max(depends_on waves) + 1

**Report:** "Task X wave should be N, not M"

### Validate Parallelization Opportunities

Identify tasks in same wave with no file conflicts.

**Suggest:** "Tasks A and B can run in parallel (both Wave 1, no file overlap)"

### Wave Computation Algorithm

```
waves = {}
for each plan:
  if plan.depends_on is empty:
    plan.wave = 1
  else:
    plan.wave = max(waves[dep] for dep in plan.depends_on) + 1
  waves[plan.id] = plan.wave
```

## Scope Sanity Validation

### Task Count Check

- Target: 2-3 tasks per plan
- Warning: 4-5 tasks (consider splitting)
- Error: 6+ tasks (must split)

### Context Estimation

- Simple tasks: ~10-15% context each
- Complex tasks: ~20-30% context each
- Very complex: ~40% context each
- Target: ~50% total context per plan

### Split Signals (ALWAYS split if)

- More than 3 tasks
- Multiple subsystems (DB + API + UI)
- Any task with >5 file modifications
- Checkpoint + implementation work in same plan
- Discovery + implementation in same plan

### Context Budget Rules

- Plans should complete within ~50% context usage
- Above 50%: Quality degradation begins
- Above 70%: Significant quality risk
- Split if approaching 50%

## Troubleshooting

### Common Issues

**Issue: "Requirement not mapped to any task"**
- Cause: Requirement in ROADMAP.md not covered
- Solution: Add task or update must_haves.truths

**Issue: "Circular dependency detected"**
- Cause: Task A needs Task B, Task B needs Task A
- Solution: Restructure tasks or combine into single task

**Issue: "Task missing required element"**
- Cause: <files>, <action>, <verify>, or <done> missing
- Solution: Add missing element to task

**Issue: "Scope exceeds target (50% context)"**
- Cause: Too many tasks or too complex
- Solution: Split plan into multiple smaller plans

**Issue: "Must-haves not derivable from goal"**
- Cause: Truths are implementation details
- Solution: Reframe truths as user behaviors

**Issue: "Wave assignment inconsistent"**
- Cause: depends_on missing or incorrect
- Solution: Fix depends_on array

**Issue: "Key links missing pattern"**
- Cause: Link not testable via grep/search
- Solution: Add testable pattern or remove link

**Issue: "Files not specific"**
- Cause: Files field uses abstractions
- Solution: Use exact file paths

## References

- @references/plan-frontmatter-reference.md - Frontmatter field specification
- @workflows/plan-phase.md - Planning workflow
- @workflows/check-plan.md - Plan checker workflow

---

**Version:** 1.0  
**Last Updated:** 2026-02-13  
**Status:** Active
