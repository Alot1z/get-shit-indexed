# Plan Frontmatter Reference

## Overview

This document provides the complete reference for plan frontmatter fields and validation.

## Required Fields

### phase

**Format:** `XX-name`
**Description:** Phase identifier matching directory name
**Example:** `06-quality-verification`, `01-mcp-foundation`
**Validation:** Must match directory name pattern

### plan

**Format:** `NN` (two-digit number)
**Description:** Plan number within phase (sequential)
**Example:** `01`, `02`, `03`
**Validation:** Must be sequential within phase

### type

**Format:** `"execute"` or `"tdd"`
**Description:** Plan type
**Values:**
- `execute`: Standard execution with independent tasks
- `tdd`: Test-driven development with RED-GREEN-REFACTOR cycle

**Validation:** Must be one of the valid values

### wave

**Format:** `N` (integer)
**Description:** Execution wave number (1, 2, 3...)
**Example:** `1`, `2`, `3`
**Validation:** Must equal max(depends_on waves) + 1, or 1 if no depends_on

**Wave Computation:**
```
if depends_on is empty:
  wave = 1
else:
  wave = max(waves[dep] for dep in depends_on) + 1
```

### depends_on

**Format:** Array of plan IDs
**Description:** Plans this plan requires before execution
**Example:** `["06-01", "06-02"]` or `[]`
**Validation:** All referenced plans must exist

### files_modified

**Format:** Array of file paths
**Description:** Files this plan will create or modify
**Example:** `["references/validation-gates.md", "workflows/execute-plan.md"]`
**Validation:** Must be valid file paths

### autonomous

**Format:** `true` or `false`
**Description:** Whether plan can execute autonomously
**Values:**
- `true`: No checkpoints, full autonomous execution
- `false`: Has checkpoints, requires human interaction

**Validation:** Must match presence of checkpoint tasks
- If `autonomous: true`, no `type="checkpoint:*"` tasks
- If `autonomous: false`, at least one `type="checkpoint:*"` task

### must_haves

**Format:** Object with truths, artifacts, key_links
**Description:** Goal-backward verification criteria

**Structure:**
```yaml
must_haves:
  truths:
    - "Observable behavior 1"
    - "Observable behavior 2"
  artifacts:
    - path: "specific/file/path.ext"
      provides: "what this artifact provides"
      min_lines: N
      contains: ["pattern1", "pattern2"]
  key_links:
    - from: "source-file.md"
      to: "target-file.md"
      via: "connection description"
      pattern: "searchable-pattern"
```

## Optional Fields

### user_setup

**Format:** Array of external service requirements
**Description:** External services requiring manual configuration
**Example:** `["Vercel CLI authentication", "Database connection"]`
**Validation:** Omit if empty (no external services)

## Field Validation Rules

### phase

```regex
^\d{2}-[a-z0-9-]+$
```

Must match directory name:
- Two-digit phase number
- Hyphen
- Lowercase alphanumeric with hyphens

### plan

```regex
^\d{2}$
```

Must be sequential within phase (01, 02, 03...)

### type

```regex
^(execute|tdd)$
```

### wave

```regex
^\d+$
```

Positive integer, computed from depends_on

### depends_on

Array of strings in format `XX-YY` where XX is phase and YY is plan

### files_modified

Array of valid file paths (relative to project root)

### autonomous

Boolean value: `true` or `false`

### must_haves.truths

Array of 3-7 observable behaviors

**Format:** User-observable, not implementation

Good:
- "Users can log in with email and password"
- "Dashboard displays real-time metrics"

Bad:
- "Login function implemented"
- "Dashboard component created"

### must_haves.artifacts

Array of artifact specifications

Each artifact must have:
- `path`: Specific file path (not "the auth files")
- `provides`: Description of what artifact provides
- `min_lines`: Minimum line count (optional)
- `contains`: Array of patterns that must be present (optional)

### must_haves.key_links

Array of link specifications

Each link must have:
- `from`: Source file path
- `to`: Target file path
- `via`: How they connect (import, data flow, API call)
- `pattern`: Testable regex pattern for verification

## Validation Examples

### Valid Frontmatter

```yaml
---
phase: 06-quality-verification
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [references/validation-gates.md]
autonomous: true
must_haves:
  truths:
    - "Auto-validation system triggers after every agent completion"
    - "7-BMAD quality gates are evaluated automatically"
  artifacts:
    - path: references/validation-gates.md
      provides: "7-BMAD quality gate specifications"
      min_lines: 200
      contains: ["Method Circle", "Mad Circle"]
  key_links: []
---
```

### Invalid Frontmatter Examples

**Missing required field:**
```yaml
---
phase: 06-quality-verification
# Missing: plan
type: execute
---
```

**Invalid wave assignment:**
```yaml
---
phase: 06-quality-verification
plan: 02
wave: 1  # Should be 2 (depends on 06-01)
depends_on: ["06-01"]
---
```

**Autonomous mismatch:**
```yaml
---
autonomous: true  # Says autonomous
# But has checkpoint tasks in tasks section
---
```

**Non-specific artifacts:**
```yaml
---
must_haves:
  artifacts:
    - path: "auth files"  # Not specific
      provides: "Auth functionality"
---
```

## Frontmatter Template

```yaml
---
phase: XX-name        # Phase identifier
plan: NN              # Plan number (01, 02, 03...)
type: execute         # Type: "execute" or "tdd"
wave: N               # Execution wave (1, 2, 3...)
depends_on: []        # Array of plan IDs this plan requires
files_modified: []    # Files this plan touches
autonomous: true      # false if plan has checkpoints
user_setup: []        # External services (omit if empty)

must_haves:
  truths: []          # Observable behaviors (3-7 items)
  artifacts: []       # Required files with min_lines/contains
  key_links: []       # Critical connections (from/to/via/pattern)
---
```

## Common Mistakes

### Mistake 1: Task-shaped truths

**Bad:**
```yaml
truths:
  - "Implement login function"
  - "Create user model"
```

**Good:**
```yaml
truths:
  - "Users can log in with email and password"
  - "User accounts are stored in database"
```

### Mistake 2: Abstract artifacts

**Bad:**
```yaml
artifacts:
  - path: "auth files"
  - path: "API endpoints"
```

**Good:**
```yaml
artifacts:
  - path: "src/auth/login.ts"
  - path: "src/api/auth/login/route.ts"
```

### Mistake 3: Untestable key_links

**Bad:**
```yaml
key_links:
  - from: "a.ts"
    to: "b.ts"
    pattern: "connected somehow"
```

**Good:**
```yaml
key_links:
  - from: "a.ts"
    to: "b.ts"
    pattern: "import.*from.*['\"].*b['\"]"
```

### Mistake 4: Wrong wave calculation

**Bad:**
```yaml
wave: 1
depends_on: ["06-01"]  # Should be wave 2
```

**Good:**
```yaml
wave: 2
depends_on: ["06-01"]
```

## References

- @references/plan-checker.md - Plan checker validation dimensions
- @workflows/plan-phase.md - Planning workflow
- @templates/plan-frontmatter.md - Frontmatter template

---

**Version**: 1.0  
**Last Updated:** 2026-02-13  
**Status**: Active
