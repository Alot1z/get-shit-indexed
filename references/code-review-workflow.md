# Code Review Workflow

## Overview

This document defines the workflow for integrating code review expert skill into the 7-BMAD validation system.

## Skill Invocation Pattern

### Basic Invocation

```
Use skill: code-review-expert
Focus: [Specific gate(s) to validate]
Context: [Relevant files/changes]
```

### Invocation Examples

**Method Circle (Implementation Correctness):**
```
Use skill: code-review-expert
Focus: Implementation correctness - logic, edge cases, performance, security
Context: src/auth/login.ts, src/lib/auth.ts
```

**Mad Circle (Integration Completeness):**
```
Use skill: code-review-expert
Focus: Integration completeness - dependencies, APIs, data flow
Context: src/api/, src/models/
```

**Mode Circle (Pattern Consistency):**
```
Use skill: code-review-expert
Focus: Pattern consistency - coding patterns, naming, error handling
Context: src/components/
```

**Mod Circle (Maintainability):**
```
Use skill: code-review-expert
Focus: Maintainability - code quality, complexity, duplication
Context: src/utils/
```

**Methodd Circle (Documentation):**
```
Use skill: code-review-expert
Focus: Documentation quality - README, API docs, examples
Context: README.md, docs/api/
```

## DesktopCommander Integration

### File Access via DesktopCommander

All file access uses DesktopCommander MCP for token efficiency:

**Reading Single File:**
```javascript
mcp__desktop-commander__read_file({
  path: "/absolute/path/to/file.ts"
})
```

**Reading Multiple Files:**
```javascript
mcp__desktop-commander__read_multiple_files({
  paths: [
    "/absolute/path/to/file1.ts",
    "/absolute/path/to/file2.ts",
    "/absolute/path/to/file3.ts"
  ]
})
```

### Token Efficiency

- **Native Read tool**: ~45K tokens protocol overhead for 3 files
- **DesktopCommander MCP**: ~5K tokens protocol overhead for 3 files
- **DesktopCommander skill**: ~1K tokens protocol overhead for 3 files

**Result: 80-90% token savings**

## Find-Skills Integration

### Optimization Discovery

After code review, check for optimization opportunities:

```
Use skill: find-skills
Task: [Current implementation]
Goal: Token/quality optimization
```

### Integration Flow

```
Code Review Complete
↓
Issues Identified
↓
Find-Skills Invocation
↓
Discover Better Approaches
↓
Suggest Optimizations
↓
Update Review with Recommendations
```

## Standard Review Flow

### 1. Identify Scope

- What files changed?
- What is the purpose?
- What are the requirements?

**Inputs:**
- Completion signal with files list
- Task description
- Plan context

### 2. Load Context

**Changed Files:**
```
Use mcp__desktop-commander__read_multiple_files for all changed files
```

**Related Files:**
```
Use mcp__code-index-mcp__search_code_advanced to find related files
```

**Architecture:**
```
Use mcp__tractatus-thinking__tractatus_thinking for structure analysis
```

### 3. Execute Review

**For each gate:**
1. Apply criteria from @references/code-review-criteria.md
2. Check each category
3. Document findings
4. Assign severity levels

### 4. Generate Report

**Aggregate findings:**
- Collect all issues from all gates
- Prioritize by severity
- Group by file or category

**Determine outcome:**
- All criteria pass → APPROVED
- Critical issues → REJECTED
- Minor issues → APPROVED WITH NOTES

## Review Depth Levels

### Quick Review

**When:** Fast feedback needed, small changes

**Scope:**
- Changed files only
- Critical checks only
- Security, correctness

**Duration:** ~2-3 minutes
**Token Usage:** ~3K tokens

### Standard Review

**When:** Normal workflow, most reviews

**Scope:**
- Changed + related files
- All criteria
- All 5 applicable gates

**Duration:** ~5 minutes
**Token Usage:** ~8K tokens

### Comprehensive Review

**When:** Major changes, PR reviews

**Scope:**
- Full impact analysis
- Security analysis
- Performance analysis
- All 7 gates (including Model and Modd via tractatus-thinking)

**Duration:** ~10-15 minutes
**Token Usage:** ~15K tokens

## Metrics and Monitoring

### Track

- **Review pass rate**: Target 95%+
- **Common issue patterns**: Top 10
- **Review duration**: Target <5 min standard
- **Token usage per review**: Target 80%+ savings
- **Agent compliance rate**: Target 100%

### Quality Goals

- 95%+ pass rate after fixes
- <5 minutes per standard review
- 80%+ token savings vs manual review
- 100% agent compliance

### Monitoring Approach

- Aggregate metrics across all reviews
- Track patterns in failing reviews
- Identify common issues for proactive detection
- Measure review efficiency over time

## Best Practices

### For Agents

1. **Always invoke via skill** - Never manual review
2. **Use DesktopCommander** - For all file access
3. **Provide clear context** - About what to review
4. **Act on feedback** - Don't ignore review results
5. **Iterate quickly** - Fix issues and re-review

### For Users

1. **Trust the system** - Auto-validation catches most issues
2. **Review feedback** - Understand what's flagged
3. **Provide overrides** - Only when truly necessary
4. **Track patterns** - Learn from common issues
5. **Update criteria** - Adjust rules as needed

## Integration Examples

### Example 1: Auto-Validation Integration

```
[COMPLETION]
Agent: GSI-executor
Task: Implement JWT authentication
Files: src/auth/jwt.ts
[/COMPLETION]

↓ Auto-spawns validation agent

[VALIDATION]
Loading code-review-expert skill...
Reviewing src/auth/jwt.ts...
Checking 7-BMAD gates...

Method Circle:
- Using skill: code-review-expert
- Focus: Implementation correctness
- Result: PASS

Mad Circle:
- Using skill: code-review-expert
- Focus: Integration completeness
- Result: PASS

Mode Circle:
- Using skill: code-review-expert
- Focus: Pattern consistency
- Result: PASS

Mod Circle:
- Using skill: code-review-expert
- Focus: Maintainability
- Result: PASS

Methodd Circle:
- Using skill: code-review-expert
- Focus: Documentation
- Result: PASS

Model Circle:
- Using skill: tractatus-thinking
- Focus: Architecture
- Result: PASS

Modd Circle:
- Using skill: tractatus-thinking
- Focus: Extensibility
- Result: PASS

Results:
  All 7 gates: PASS
  Quality Score: 7/7
  Status: VALIDATED ✓
[/VALIDATION]
```

### Example 2: Find-Skills Integration

```
code-review-expert identifies opportunity:
"JWT implementation could use existing jose library for better Edge compatibility"

↓ Invokes find-skills

find-skills discovers:
- jose skill provides ESM-native JWT implementation
- Edge-compatible (unlike jsonwebtoken)
- Better token validation

↓ Recommends refactor

Result: Use jose library instead of custom JWT implementation
```

### Example 3: DesktopCommander Integration

```
Need to review multiple files:

BAD (Native):
  Read: file1.js
  Read: file2.js
  Read: file3.js
  = ~45K tokens

GOOD (DesktopCommander MCP):
  mcp__desktop-commander__read_multiple_files: {
    paths: ["file1.js", "file2.js", "file3.js"]
  }
  = ~5K tokens

BEST (Skill with DesktopCommander):
  skill: "code-review-expert"
  with context: "Review auth implementation in src/auth/"
  = ~1K tokens
```

## Troubleshooting

### Issue: Review Fails Unexpectedly

**Possible causes:**
- Review scope too broad
- False positive in pattern matching
- Outdated review criteria

**Solutions:**
1. Narrow review scope
2. Update pattern rules
3. Adjust strictness level

### Issue: Review Takes Too Long

**Possible causes:**
- Too many files
- Comprehensive depth when quick sufficient
- Inefficient file access

**Solutions:**
1. Reduce review scope
2. Use quick review mode
3. Ensure DesktopCommander integration

### Issue: False Positives

**Possible causes:**
- Pattern matching errors
- Outdated rules
- Project-specific conventions

**Solutions:**
1. Update pattern rules
2. Add project exceptions
3. Adjust criteria

## References

- @references/code-review-criteria.md - Detailed code review criteria
- @references/validation-gates.md - 7-BMAD quality gate specifications
- @references/code-review-templates.md - Standardized output templates
- @~/.claude/get-shit-indexed/references/rules/code-review.md - Code review integration rules

---

**Version**: 1.0  
**Last Updated:** 2026-02-13  
**Status**: Active
