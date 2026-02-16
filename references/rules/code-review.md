# Code Review Expert Integration Rules

## Overview

This document defines the integration rules for the `code-review-expert` skill, which is the primary tool for ensuring code quality across all agent work.

## Core Principles

1. **Automatic Integration**: Code review happens automatically via validation system
2. **Comprehensive Coverage**: All code changes must pass review
3. **Token Optimized**: Uses compressed skill format for efficiency
4. **Actionable Feedback**: Provides specific, implementable suggestions

## When to Use Code Review Expert

### Mandatory Use Cases

1. **After Code Completion**
   - All agent completions trigger automatic review
   - Part of 7-BMAD validation gates
   - Cannot be bypassed without override

2. **Before Git Commit**
   - Review staged changes
   - Verify commit readiness
   - Check commit message quality

3. **During PR Review**
   - Analyze pull request changes
   - Verify integration quality
   - Check documentation completeness

4. **Refactoring Verification**
   - Validate refactor preserves behavior
   - Check for improvements
   - Verify no regressions

5. **Bug Fix Validation**
   - Verify fix addresses root cause
   - Check for side effects
   - Ensure test coverage

### Optional Use Cases

1. **Learning Codebases**
   - Understand existing patterns
   - Identify improvement opportunities
   - Learn architecture decisions

2. **Technical Debt Assessment**
   - Identify debt areas
   - Prioritize remediation
   - Estimate effort

3. **Code Health Monitoring**
   - Periodic health checks
   - Trend analysis
   - Quality metrics

## Integration Points

### 1. Auto-Validation System

**Location**: `@~/.claude/get-shit-indexed/references/rules/auto-validation.md`

Code review expert is integrated into all 7-BMAD gates:

```
Gate 1 (Method) → Implementation correctness
Gate 2 (Mad) → Integration completeness
Gate 4 (Mode) → Pattern consistency
Gate 5 (Mod) → Maintainability standards
Gate 7 (Methodd) → Documentation quality
```

**Workflow**:
```
Agent completion signal
↓
Validation agent spawned
↓
code-review-expert skill invoked
↓
All gates evaluated
↓
Results aggregated
↓
Pass/Fail decision
```

### 2. DesktopCommander Integration

**File Operations**: Code review expert uses DesktopCommander for all file access

**Example**:
```javascript
// Instead of native Read tool
skill: "code-review-expert"
context: {
  target: "/path/to/code",
  operation: "review",
  file_access: "desktop-commander"  // Uses MCP tool internally
}
```

### 3. Skill Discovery Integration

**Location**: `find-skills` skill

After code review, system checks for better implementation approaches:

```
code-review-expert completes review
↓
Identifies improvement areas
↓
Invokes find-skills
↓
Searches for optimization skills
↓
Suggests better approaches
```

## Review Criteria

### 1. Implementation Correctness (Method Circle)

**Checks**:
- [ ] Code compiles/builds without errors
- [ ] Logic matches requirements exactly
- [ ] Edge cases handled properly
- [ ] Performance requirements met
- [ ] Security vulnerabilities absent
- [ ] Resource management correct

**Output Format**:
```markdown
## Implementation Correctness: PASS/FAIL

### Issues Found
1. [Severity] [Location]: [Description]
2. [Severity] [Location]: [Description]

### Recommendations
1. [Specific fix suggestion]
2. [Specific fix suggestion]
```

### 2. Integration Completeness (Mad Circle)

**Checks**:
- [ ] All dependencies properly integrated
- [ ] APIs/interfaces match specifications
- [ ] Data flows correctly between components
- [ ] No integration points missing
- [ ] Error handling across boundaries
- [ ] Contract compliance

**Output Format**:
```markdown
## Integration Completeness: PASS/FAIL

### Integration Points
- [ ] Dependency A: Integrated
- [ ] API B: Mismatched (see issue #1)
- [ ] Data Flow C: Broken (see issue #2)

### Issues Found
[Detailed integration issues]

### Recommendations
[Specific integration fixes]
```

### 3. Pattern Consistency (Mode Circle)

**Checks**:
- [ ] Uses established coding patterns
- [ ] Naming conventions followed
- [ ] Error handling patterns consistent
- [ ] State management patterns aligned
- [ ] Architecture patterns respected
- [ ] Design pattern usage correct

**Output Format**:
```markdown
## Pattern Consistency: PASS/FAIL

### Pattern Violations
1. [Pattern name]: [How it's violated]
2. [Pattern name]: [How it's violated]

### Consistency Issues
- [ ] Naming: [Issue description]
- [ ] Structure: [Issue description]

### Recommendations
- Apply pattern: [Pattern name]
- Refactor: [Specific refactoring]
```

### 4. Maintainability Standards (Mod Circle)

**Checks**:
- [ ] Code is readable and clear
- [ ] Comments where necessary (not obvious)
- [ ] Function/class size reasonable
- [ ] Complexity within acceptable limits
- [ ] Test coverage adequate
- [ ] No code duplication

**Metrics**:
- Cyclomatic complexity: <10 per function
- Function length: <50 lines
- Class length: <300 lines
- Duplication: <3% similarity

**Output Format**:
```markdown
## Maintainability: PASS/FAIL

### Metrics
- Average complexity: [X]
- Max function length: [X] lines
- Duplication: [X]%

### Issues
1. [Maintainability issue]
2. [Maintainability issue]

### Recommendations
[Specific maintainability improvements]
```

### 5. Documentation Quality (Methodd Circle)

**Checks**:
- [ ] README updated if needed
- [ ] API docs complete
- [ ] Usage examples provided
- [ ] Changes documented in changelog
- [ ] Inline comments appropriate
- [ ] Architecture docs updated

**Output Format**:
```markdown
## Documentation Quality: PASS/FAIL

### Documentation Checklist
- [ ] README: [Status]
- [ ] API docs: [Status]
- [ ] Examples: [Status]
- [ ] Changelog: [Status]

### Missing Documentation
- [ ] [What's missing]
- [ ] [What's missing]

### Recommendations
[Specific documentation additions]
```

## Review Workflow

### Standard Review

```
1. Identify Scope
   - What files changed?
   - What is the purpose?
   - What are the requirements?

2. Load Context
   - Read changed files (using DesktopCommander)
   - Read related files
   - Understand architecture

3. Execute Review
   - Apply all 5 criteria
   - Check each category
   - Document findings

4. Generate Report
   - Aggregate findings
   - Prioritize issues
   - Provide recommendations

5. Determine Outcome
   - All criteria pass? → APPROVED
   - Critical issues? → REJECTED
   - Minor issues? → APPROVED WITH NOTES
```

### Quick Review (For Small Changes)

```
1. Load changed files
2. Quick correctness check
3. Pattern consistency check
4. Generate brief report
```

### Comprehensive Review (For Large Changes)

```
1. Full standard review
2. Security analysis
3. Performance analysis
4. Test coverage review
5. Documentation review
6. Integration testing verification
7. Architecture impact analysis
```

## Severity Levels

### Critical (MUST FIX)
- Security vulnerabilities
- Data corruption risks
- Crash/panic conditions
- Breaking changes

### High (SHOULD FIX)
- Performance regressions
- Major integration issues
- Significant pattern violations
- Missing error handling

### Medium (CONSIDER FIXING)
- Minor pattern inconsistencies
- Small maintainability issues
- Missing non-critical documentation
- Code duplication

### Low (NICE TO HAVE)
- Stylistic preferences
- Minor optimizations
- Enhanced documentation
- Code organization suggestions

## Output Templates

### Approval Template

```markdown
# Code Review: APPROVED ✓

## Summary
[Change description] passes all review criteria.

## Files Reviewed
- [File 1]: [Status]
- [File 2]: [Status]

## Criteria Results
- Implementation Correctness: PASS
- Integration Completeness: PASS
- Pattern Consistency: PASS
- Maintainability Standards: PASS
- Documentation Quality: PASS

## Notes
[Optional observations or suggestions for future improvements]

## Quality Score: 5/5
```

### Approval with Notes Template

```markdown
# Code Review: APPROVED WITH NOTES ✓

## Summary
[Change description] passes critical review criteria with minor suggestions.

## Files Reviewed
- [File 1]: [Status]
- [File 2]: [Status]

## Criteria Results
- Implementation Correctness: PASS
- Integration Completeness: PASS
- Pattern Consistency: PASS (1 minor issue)
- Maintainability Standards: PASS (2 suggestions)
- Documentation Quality: PASS

## Suggestions
1. [Low priority suggestion]
2. [Low priority suggestion]

## Quality Score: 4/5
```

### Rejection Template

```markdown
# Code Review: REJECTED ✗

## Summary
[Change description] fails review criteria.

## Files Reviewed
- [File 1]: [Status - ISSUES FOUND]
- [File 2]: [Status - ISSUES FOUND]

## Criteria Results
- Implementation Correctness: FAIL (1 critical)
- Integration Completeness: FAIL (1 high)
- Pattern Consistency: PASS
- Maintainability Standards: PASS
- Documentation Quality: PASS

## Must Fix (Critical)
1. [Critical issue with location]
2. [Critical issue with location]

## Should Fix (High)
1. [High priority issue]
2. [High priority issue]

## Recommendations
[Specific fixes for each issue]

## Quality Score: 2/5
```

## Integration Examples

### Example 1: Auto-Validation Integration

```
[COMPLETION]
Agent: implementation-agent
Task: Add user authentication
Files:
  - src/auth/login.js
  - src/auth/session.js
  - tests/auth.test.js
[/COMPLETION]

↓ Auto-spawns validation agent

[VALIDATION]
Loading code-review-expert skill...
Reviewing 3 files...
Checking 7-BMAD gates...

Results:
  Gate 1 (Method): PASS
  Gate 2 (Mad): PASS
  Gate 3 (Model): PASS
  Gate 4 (Mode): PASS
  Gate 5 (Mod): PASS
  Gate 6 (Modd): PASS
  Gate 7 (Methodd): PASS

Quality Score: 7/7
Status: VALIDATED ✓
[/VALIDATION]
```

### Example 2: Find-Skills Integration

```
code-review-expert identifies opportunity:
"Authentication could use existing 'auth-patterns' skill"

↓ Invokes find-skills

find-skills discovers:
- 'auth-patterns' skill provides standardized auth implementation
- Includes token-optimized auth flows
- Has built-in security best practices

↓ Recommends refactor

Result: Use 'auth-patterns' skill instead of custom implementation
```

### Example 3: DesktopCommander Integration

```
code-review-expert needs to review multiple files:

BAD (Native):
  Read file1.js
  Read file2.js
  Read file3.js
  = ~45K tokens

GOOD (DesktopCommander):
  mcp__desktop-commander__read_multiple_files: {
    paths: ["file1.js", "file2.js", "file3.js"]
  }
  = ~5K tokens

BEST (Skill with DesktopCommander):
  skill: "code-review-expert"
  context: "Review auth implementation in src/auth/"
  Skill internally uses DesktopCommander
  = ~1K tokens
```

## Configuration

### Review Depth
- **Quick**: Changed files only, critical checks
- **Standard**: Changed + related files, all criteria
- **Comprehensive**: Full impact analysis, security, performance

### Strictness
- **Lenient**: Only critical issues block approval
- **Standard**: Critical + high issues block approval
- **Strict**: All issues must be addressed

### Output Format
- **Minimal**: Pass/fail + critical issues only
- **Standard**: Full report with all criteria
- **Detailed**: Full report + code examples + fix suggestions

## Metrics and Monitoring

### Track
- Review pass rate
- Common issue patterns
- Review duration
- Token usage per review
- Agent compliance rate

### Goals
- 95%+ pass rate (after fixes)
- <5 minutes per standard review
- 80%+ token savings vs manual review
- 100% agent compliance

## Best Practices

### For Agents
1. **Always invoke via skill**, never manual review
2. **Use DesktopCommander** for file access
3. **Provide clear context** about what to review
4. **Act on feedback** - don't ignore review results
5. **Iterate quickly** - fix issues and re-review

### For Users
1. **Trust the system** - auto-validation catches most issues
2. **Review feedback** - understand what's being flagged
3. **Provide overrides** only when truly necessary
4. **Track patterns** - learn from common issues
5. **Update criteria** - adjust rules as needed

## Troubleshooting

### Issue: Review Fails Unexpectedly

**Possible Causes**:
- Review scope too broad
- False positive in pattern matching
- Outdated review criteria

**Solutions**:
1. Narrow review scope
2. Update pattern rules
3. Adjust strictness level

### Issue: Review Takes Too Long

**Possible Causes**:
- Reviewing too many files
- Comprehensive depth when quick sufficient
- Inefficient file access

**Solutions**:
1. Reduce review scope
2. Use quick review mode
3. Ensure DesktopCommander integration

## Version History

- v1.0: Initial integration rules
  - Auto-validation system integration
  - DesktopCommander integration
  - Find-skills integration
  - 5-criteria review framework
