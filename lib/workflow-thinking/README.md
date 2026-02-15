# Workflow Thinking Validator

Validates that GSI workflow files have proper thinking phases integrated for cognitive enhancement.

## Purpose

Ensures all workflows have thinking phases at appropriate execution points:
- **PRE_WORKFLOW**: Before workflow starts (structural analysis)
- **PRE_STEP**: Before each major step (planning/risk assessment)
- **POST_STEP**: After each major step (reflection/learning capture)
- **POST_WORKFLOW**: After workflow completes (summary/insights)

## Usage

### Command Line

```bash
# Validate all workflows in current directory
npm run validate:workflows

# Validate workflows in specific directory
node lib/workflow-thinking/validator.js /path/to/project

# Output JSON format
node lib/workflow-thinking/validator.js . --json
```

### Programmatic API

```javascript
const {
  validate,
  validateMultiple,
  generateReport,
  findWorkflowFiles
} = require('./lib/workflow-thinking/validator');

// Validate single workflow
const result = validate('workflows/plan-phase.md');
console.log(result.isValid()); // true/false
console.log(result.getSummary()); // Detailed summary

// Validate multiple workflows
const files = findWorkflowFiles('.');
const results = validateMultiple(files);
const report = generateReport(results, 'text');
console.log(report);
```

## Validation Checks

### 1. Thinking Phase Presence
- ✓ Detects `## Thinking Phase` sections
- ✓ Validates server tags: `<server>tractatus|sequential|debug</server>`

### 2. Server Validity
- ✓ Checks server is one of: tractatus, sequential, debug
- ✓ Tracks server usage counts

### 3. Timeout Values
- ✓ Validates timeout range (1000-10000ms recommended)
- ✓ Warns if timeout outside recommended range
- ✓ Warns if timeout not specified

### 4. Phase Balance
- ✓ Checks for PRE_WORKFLOW thinking
- ✓ Checks for POST_WORKFLOW thinking
- ✓ Warns if workflow is unbalanced

### 5. Phase Coverage
- ✓ Warns if fewer than 2 thinking phases
- ✓ Encourages thinking at multiple workflow points

## Report Format

### Text Output

```markdown
# Workflow Thinking Validation Report

## Summary
- Total workflows: 4
- Valid: 3
- Invalid: 1
- With warnings: 2

## Results

### ✓ PASS (balanced) - plan-phase.md

- Phase types: PRE_WORKFLOW, PRE_STEP, POST_STEP, POST_WORKFLOW
- Servers: tractatus(3) sequential(4) debug(3)
- Issues: 0
- Warnings: 0

### ✗ FAIL (unbalanced) - check-plan.md

- Phase types: PRE_WORKFLOW, PRE_STEP
- Servers: tractatus(2) sequential(1)
- Issues: 0
- Warnings: 2

**Warnings:**
- [WARNING] Has PRE_WORKFLOW thinking but missing POST_WORKFLOW thinking (workflow structure)
- [WARNING] Only 2 thinking phase(s) found. Workflows typically benefit from thinking at multiple points. (thinking phase coverage)
```

### JSON Output

```json
{
  "summary": {
    "total": 4,
    "valid": 3,
    "invalid": 1,
    "withWarnings": 2
  },
  "results": [
    {
      "file": "workflows/plan-phase.md",
      "valid": true,
      "hasPhases": true,
      "phaseTypes": ["PRE_WORKFLOW", "PRE_STEP", "POST_STEP", "POST_WORKFLOW"],
      "serverCounts": {
        "tractatus": 3,
        "sequential": 4,
        "debug": 3
      },
      "issues": 0,
      "warnings": 0,
      "balanced": true
    }
  ]
}
```

## Integration with GSI

The validator can be integrated into the `gsi verify-work` command to automatically check workflow thinking phases:

```bash
# Run as part of verify-work
gsi verify-work --include-thinking-validation
```

## Exit Codes

- `0`: All validations passed
- `1`: One or more workflows failed validation

## Server Selection Guidelines

### Tractatus Thinking
Use for:
- Structural analysis (workflows, plans, codebases)
- Logical decomposition
- Architecture decisions
- Dependency mapping

### Sequential Thinking
Use for:
- Step-by-step processes
- Execution planning
- Risk assessment
- Process optimization

### Debug Thinking
Use for:
- Error analysis
- Pattern storage
- Learning capture
- Root cause analysis

## Timeout Guidelines

| Thinking Type | Timeout | Rationale |
|---------------|---------|-----------|
| Quick reflection | 2000ms | Simple validation checks |
| Standard step | 3000ms | Most pre/post step thinking |
| Complex analysis | 5000ms | Pre-workflow, critical steps |
| Deep analysis | 8000ms | Rare, for major architectural decisions |

## Validation Criteria

### Must Have (Errors)
- At least one thinking phase present
- All servers are valid (tractatus, sequential, debug)
- No file access errors

### Should Have (Warnings)
- PRE_WORKFLOW thinking present
- POST_WORKFLOW thinking present
- Timeout values specified
- Timeouts within recommended range
- Multiple thinking phases (2+)

## See Also

- `templates/workflow-thinking.md` - Thinking phase template
- `workflows/` - Workflow implementations using thinking phases
- `docs/thinking/THINKING-SERVERS.md` - Thinking server API reference
- `docs/thinking/7-BMAD-THINKING.md` - 7-BMAD methodology

---

**Version:** 1.0  
**Last Updated:** 2026-02-16  
**Status:** Active
