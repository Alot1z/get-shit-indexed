# Validation Configuration Specification

## Overview

This document defines the configuration options for the 7-BMAD validation system. Configuration allows customization while maintaining sensible defaults.

## Configuration Options

### Retry Limit

**Default:** `3` attempts
**Description:** Maximum number of validation retry attempts before reporting failure
**Valid Values:** `1-10`
**Rationale:** Three attempts balance thoroughness with efficiency

```json
{
  "retry_limit": 3
}
```

### Gate Weights

**Default:** `"equal"` (1/7 each)
**Description:** How each gate contributes to overall score
**Valid Values:** `"equal"` or custom weights
**Rationale:** Equal weighting ensures all quality dimensions matter equally

```json
{
  "gate_weights": "equal"
}
```

**Custom Weights Example:**

```json
{
  "gate_weights": {
    "method": 1.5,
    "mad": 1.5,
    "model": 1.0,
    "mode": 1.0,
    "mod": 1.0,
    "modd": 0.5,
    "methodd": 0.5
  }
}
```

### Pass Threshold

**Default:** `100` (all gates must pass)
**Description:** Minimum percentage of gates that must pass for validation to succeed
**Valid Values:** `0-100`
**Rationale:** All gates are mandatory for production quality

```json
{
  "pass_threshold": 100
}
```

### Timeout Settings

**Per-Gate Timeout:**
- **Default:** `60` seconds
- **Description:** Maximum time for each gate evaluation
- **Valid Values:** `30-300` seconds

**Total Timeout:**
- **Default:** `300` seconds (5 minutes)
- **Description:** Maximum time for entire validation
- **Valid Values:** `60-1800` seconds

```json
{
  "timeout_per_gate": 60,
  "timeout_total": 300
}
```

### Strictness Level

**Default:** `"standard"`
**Description:** How strictly issues are treated
**Valid Values:** `"lenient"`, `"standard"`, `"strict"`

**Lenient:**
- Only critical issues block approval
- High issues generate warnings
- Medium/Low issues informational only

**Standard:**
- Critical + High issues block approval
- Medium issues generate warnings
- Low issues informational only

**Strict:**
- All issues must be addressed
- Even Low issues block approval
- Maximum quality enforcement

```json
{
  "strictness": "standard"
}
```

## Code Review Configuration

```json
{
  "code_review": {
    "skill": "code-review-expert",
    "depth": "standard",
    "strictness": "standard",
    "file_access": "desktop-commander",
    "token_optimization": true,
    "gates": [
      "method",
      "mad",
      "mode",
      "mod",
      "methodd"
    ],
    "criteria_reference": "references/code-review-criteria.md",
    "workflow_reference": "references/code-review-workflow.md",
    "templates_reference": "references/code-review-templates.md"
  }
}
```

### Depth Options

**Quick:**
- Changed files only
- Critical checks only
- Fastest execution
- Duration: ~2-3 minutes
- Token usage: ~3K tokens

**Standard:**
- Changed + related files
- All criteria
- Balanced execution
- Duration: ~5 minutes
- Token usage: ~8K tokens

**Comprehensive:**
- Full impact analysis
- Security analysis
- Performance analysis
- Slowest but most thorough
- Duration: ~10-15 minutes
- Token usage: ~15K tokens

### Strictness Options

**Lenient:**
- Only critical issues block approval
- High issues generate warnings
- Medium/Low issues informational only
- Use for: Early development, prototyping

**Standard:**
- Critical + High issues block approval
- Medium issues generate warnings
- Low issues informational only
- Use for: Normal development workflow

**Strict:**
- All issues must be addressed
- Even Low issues block approval
- Maximum quality enforcement
- Use for: Production code, libraries

## Per-Gate Tool Mapping

```json
{
  "gate_tools": {
    "method": {
      "primary": "code-review-expert",
      "secondary": ["find-skills"],
      "focus": "correctness"
    },
    "mad": {
      "primary": "code-review-expert",
      "secondary": ["tractatus-thinking"],
      "focus": "integration"
    },
    "model": {
      "primary": "tractatus-thinking",
      "secondary": ["code-review-expert"],
      "focus": "architecture"
    },
    "mode": {
      "primary": "code-review-expert",
      "secondary": ["find-skills"],
      "focus": "patterns"
    },
    "mod": {
      "primary": "code-review-expert",
      "secondary": [],
      "focus": "maintainability"
    },
    "modd": {
      "primary": "tractatus-thinking",
      "secondary": ["code-review-expert"],
      "focus": "extensibility"
    },
    "methodd": {
      "primary": "code-review-expert",
      "secondary": [],
      "focus": "documentation"
    }
  }
}
```

## Project-Specific Overrides

### Override by Project Type

**Frontend Projects:**
```json
{
  "project_type": "frontend",
  "strictness": "standard",
  "gate_weights": {
    "mode": 1.5,
    "mod": 1.2,
    "methodd": 1.0
  }
}
```

**Backend Projects:**
```json
{
  "project_type": "backend",
  "strictness": "strict",
  "gate_weights": {
    "method": 1.5,
    "mad": 1.5,
    "model": 1.2
  }
}
```

**Library Projects:**
```json
{
  "project_type": "library",
  "strictness": "strict",
  "gate_weights": {
    "modd": 1.5,
    "methodd": 1.5,
    "mode": 1.2
  }
}
```

### Override by Phase

**Early Phase (Foundation):**
```json
{
  "phase": "foundation",
  "strictness": "lenient",
  "pass_threshold": 80
}
```

**Production Phase:**
```json
{
  "phase": "production",
  "strictness": "strict",
  "pass_threshold": 100
}
```

## Configuration File Format

### Global Configuration

Location: `.planning/validation-config.json`

```json
{
  "version": "1.0",
  "retry_limit": 3,
  "gate_weights": "equal",
  "pass_threshold": 100,
  "timeout_per_gate": 60,
  "timeout_total": 300,
  "strictness": "standard",
  "code_review": {
    "skill": "code-review-expert",
    "depth": "standard",
    "strictness": "standard",
    "file_access": "desktop-commander",
    "token_optimization": true,
    "gates": ["method", "mad", "mode", "mod", "methodd"]
  },
  "gate_tools": {
    "method": {"primary": "code-review-expert", "focus": "correctness"},
    "mad": {"primary": "code-review-expert", "focus": "integration"},
    "model": {"primary": "tractatus-thinking", "focus": "architecture"},
    "mode": {"primary": "code-review-expert", "focus": "patterns"},
    "mod": {"primary": "code-review-expert", "focus": "maintainability"},
    "modd": {"primary": "tractatus-thinking", "focus": "extensibility"},
    "methodd": {"primary": "code-review-expert", "focus": "documentation"}
  }
}
```

### Project-Specific Configuration

Location: `{project}/.validation-config.json`

Overrides global settings for this project only.

## Auto-Detection

### Optimal Settings Detection

System can auto-detect optimal settings based on:

1. **Project Type** (from package.json, requirements.txt, etc.)
   - Frontend framework → Frontend settings
   - Backend framework → Backend settings
   - Library → Library settings

2. **Project Size** (file count, lines of code)
   - Small projects → Standard depth
   - Large projects → Quick depth (for speed)

3. **Phase** (from ROADMAP.md)
   - Early phases → Lenient strictness
   - Later phases → Standard/Strict strictness

### Auto-Detection Algorithm

```javascript
function detectOptimalConfig(project) {
  const config = {
    strictness: "standard",
    depth: "standard",
    gate_weights: "equal"
  };

  // Detect project type
  if (project.hasFrontendFramework) {
    config.gate_weights = {
      mode: 1.5, mod: 1.2, methodd: 1.0
    };
  }

  // Detect project size
  if (project.fileCount > 1000) {
    config.depth = "quick";
  }

  // Detect phase
  if (project.phase === "foundation") {
    config.strictness = "lenient";
  }

  return config;
}
```

## Configuration Validation

### Validation Rules

1. **retry_limit** must be between 1-10
2. **pass_threshold** must be between 0-100
3. **timeout_per_gate** must be less than **timeout_total**
4. **strictness** must be one of: lenient, standard, strict
5. **depth** must be one of: quick, standard, comprehensive
6. **gate_weights** must sum to 7.0 (if custom)

### Invalid Configuration Handling

If configuration is invalid:
- Log error with specific issue
- Fall back to defaults
- Continue validation
- Notify user after validation

## Environment Variables

Override configuration via environment variables:

```bash
# Retry limit
GSD_VALIDATION_RETRY_LIMIT=3

# Pass threshold
GSD_VALIDATION_PASS_THRESHOLD=100

# Strictness
GSD_VALIDATION_STRICTNESS=standard

# Timeouts
GSD_VALIDATION_TIMEOUT_PER_GATE=60
GSD_VALIDATION_TIMEOUT_TOTAL=300
```

Environment variables take precedence over config files.

## Configuration Precedence

1. Environment variables (highest priority)
2. Project-specific config (.validation-config.json)
3. Global config (.planning/validation-config.json)
4. Defaults (lowest priority)

## References

- @references/validation-gates.md - 7-BMAD quality gate specifications
- @references/validation-workflow.md - End-to-end validation workflow
- @references/code-review-criteria.md - Code review criteria

---

**Version**: 1.0  
**Last Updated:** 2026-02-13  
**Status**: Active
