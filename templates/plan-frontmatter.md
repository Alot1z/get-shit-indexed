# Plan Frontmatter Template

## Overview

This template provides the standard frontmatter format for all GSI plans.

## Template

```yaml
---
phase: XX-name        # Phase identifier (matches directory name)
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

## Field Descriptions

### phase

**What:** Phase identifier matching directory name  
**Format:** `XX-name` (two-digit number, hyphen, lowercase name)  
**Example:** `06-quality-verification`  
**Validation:** Must match directory name exactly

### plan

**What:** Plan number within phase  
**Format:** `NN` (two-digit sequential number)  
**Example:** `01`, `02`, `03`  
**Validation:** Must be sequential within phase

### type

**What:** Execution type  
**Values:** `"execute"` or `"tdd"`  
**Default:** `"execute"`  
**Validation:** Must be one of the valid values

### wave

**What:** Execution wave for parallelization  
**Format:** `N` (positive integer)  
**Example:** `1`, `2`, `3`  
**Computation:** `max(depends_on waves) + 1` or `1` if no depends_on

### depends_on

**What:** Plans this plan requires  
**Format:** Array of plan IDs `["XX-YY", "XX-ZZ"]`  
**Example:** `["06-01", "06-02"]` or `[]`  
**Validation:** All referenced plans must exist

### files_modified

**What:** Files this plan creates or modifies  
**Format:** Array of file paths  
**Example:** `["references/validation-gates.md", "workflows/execute-plan.md"]`  
**Validation:** Must be valid file paths

### autonomous

**What:** Whether plan executes without checkpoints  
**Values:** `true` or `false`  
**Meaning:**
- `true`: No checkpoints, full autonomous execution
- `false`: Has checkpoints, requires human interaction

**Validation:** Must match presence of `type="checkpoint:*"` tasks

### user_setup

**What:** External services requiring manual configuration  
**Format:** Array of descriptions  
**Example:** `["Vercel CLI authentication", "Database connection"]`  
**Optional:** Omit if no external services

### must_haves

**What:** Goal-backward verification criteria

**truths:** Observable user behaviors (3-7 items)
**artifacts:** Required files with specifications
**key_links:** Critical connections with testable patterns

See @references/plan-frontmatter-reference.md for detailed format.

## Validation Rules

### 1. Phase Format

```
Pattern: ^\d{2}-[a-z0-9-]+$
Valid: 06-quality-verification, 01-mcp-foundation
Invalid: 6-quality, Phase-6, 06_Quality
```

### 2. Plan Format

```
Pattern: ^\d{2}$
Valid: 01, 02, 03
Invalid: 1, 001, A
```

### 3. Type Values

```
Valid: execute, tdd
Invalid: execution, test, automation
```

### 4. Wave Computation

```javascript
if depends_on.length === 0) {
  wave = 1;
} else {
  wave = Math.max(...depends_on.map(p => p.wave)) + 1;
}
```

### 5. Autonomous Consistency

```yaml
autonomous: true   # No type="checkpoint:*" tasks allowed
autonomous: false  # At least one type="checkpoint:*" task required
```

## Complete Example

```yaml
---
phase: 06-quality-verification
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - references/validation-gates.md
  - references/agent-completion-signal.md
  - references/validation-workflow.md
autonomous: true

must_haves:
  truths:
    - "Auto-validation system triggers after every agent completion"
    - "7-BMAD quality gates are evaluated automatically"
    - "Failed validation triggers automatic retry with fix attempts"
    - "Validation uses compressed skills to minimize token overhead"
    - "Completion signal format is standardized for all agents"
    - "Validation agent specification is documented for system-wide consistency"
    - "Emergency overrides exist for force completion and gate skipping"
  artifacts:
    - path: references/validation-gates.md
      provides: "Complete 7-BMAD quality gate specifications with validation criteria"
      min_lines: 200
      contains: ["Method Circle", "Mad Circle", "Model Circle", "Mode Circle", "Mod Circle", "Modd Circle", "Methodd Circle"]
    - path: references/agent-completion-signal.md
      provides: "Standardized completion signal format for all agents"
      min_lines: 100
      contains: ["[COMPLETION]", "[/COMPLETION]", "Task:", "Files:", "Status:"]
    - path: references/validation-workflow.md
      provides: "End-to-end validation workflow documentation"
      min_lines: 150
      contains: ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Gate Evaluation"]
  key_links:
    - from: workflows/execute-plan.md
      to: references/validation-gates.md
      via: "Execute workflow references validation gate specifications"
      pattern: "@.*validation-gates\\.md"
    - from: workflows/plan-phase.md
      to: references/agent-completion-signal.md
      via: "Planning workflow specifies completion signal format"
      pattern: "@.*agent-completion-signal\\.md"
    - from: templates/summary.md
      to: references/validation-workflow.md
      via: "Summary template includes validation outcome reference"
      pattern: "validation.*outcome"
---
```

## Common Mistakes to Avoid

### Mistake 1: Wrong Wave Calculation

```yaml
# WRONG
wave: 1
depends_on: ["06-01"]  # Depends on plan, wave should be 2

# CORRECT
wave: 2
depends_on: ["06-01"]
```

### Mistake 2: Autonomous Mismatch

```yaml
# WRONG
autonomous: true
# But has type="checkpoint:human-verify" tasks in tasks section

# CORRECT
autonomous: false  # Has checkpoints
```

### Mistake 3: Implementation Details in Truths

```yaml
# WRONG
truths:
  - "Implement login function"  # Task-shaped, not observable

# CORRECT
truths:
  - "Users can log in with email and password"  # User-observable
```

### Mistake 4: Abstract Artifacts

```yaml
# WRONG
artifacts:
  - path: "auth files"  # Not specific

# CORRECT
artifacts:
  - path: "src/auth/login.ts"  # Specific file path
```

### Mistake 5: Untestable Key Links

```yaml
# WRONG
key_links:
  - pattern: "connected"  # Not testable

# CORRECT
key_links:
  - pattern: "import.*from.*['\"].*b['\"]"  # Testable regex
```

## References

- @references/plan-frontmatter-reference.md - Complete field specification
- @references/plan-checker.md - Validation dimensions
- @workflows/plan-phase.md - Planning workflow

---

## MCP Tool Priority Section

When writing plans that involve file operations or code analysis, include MCP tool guidance:

```yaml
---
# ... standard frontmatter fields ...

mcp_guidance:
  file_operations: "Use mcp__desktop-commander__read_multiple_files for batch reads"
  code_search: "Use mcp__code-index-mcp__search_code_advanced for indexed search"
  architecture: "Use mcp__CodeGraphContext__analyze_code_relationships for relationships"
---
```

### MCP Tool Decision Tree

```
Need to read files?
├── Multiple files? → mcp__desktop-commander__read_multiple_files (80% savings)
├── Single file? → mcp__desktop-commander__read_file (50% savings)
└── NOT: Native Read tool

Need to search code?
├── Pattern search? → mcp__code-index-mcp__search_code_advanced (80% savings)
├── File search? → mcp__code-index-mcp__find_files (70% savings)
└── NOT: Native Grep/Glob tools

Need architecture analysis?
├── Relationships? → mcp__CodeGraphContext__analyze_code_relationships (90% savings)
├── Call chain? → mcp__CodeGraphContext__analyze_code_relationships (query_type: "call_chain")
└── NOT: Manual analysis
```

---

**Version:** 1.1  
**Last Updated:** 2026-02-15  
**Status:** Active
