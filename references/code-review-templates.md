# Code Review Output Templates

## Overview

This document defines the standardized output templates for code review results across all 5 quality gates.

## Approval Template

```markdown
# Code Review: APPROVED ✓

## Summary
[Change description] passes all review criteria.

## Files Reviewed
- [File 1]: [Status - PASSED]
- [File 2]: [Status - PASSED]
- [File 3]: [Status - PASSED]

## Criteria Results

### Method Circle (Implementation Correctness)
- **Status**: PASS
- **Issues**: None
- **Notes**: Code compiles, logic correct, edge cases handled

### Mad Circle (Integration Completeness)
- **Status**: PASS
- **Issues**: None
- **Notes**: All dependencies integrated, APIs match specs

### Model Circle (Architecture Alignment)
- **Status**: PASS
- **Issues**: None
- **Notes**: Follows architectural patterns

### Mode Circle (Pattern Consistency)
- **Status**: PASS
- **Issues**: None
- **Notes**: Coding patterns consistent, naming follows conventions

### Mod Circle (Maintainability Standards)
- **Status**: PASS
- **Issues**: None
- **Notes**: Code readable, complexity acceptable, no duplication

### Modd Circle (Extensibility Verification)
- **Status**: PASS
- **Issues**: None
- **Notes**: Easy to extend, no hard-coding

### Methodd Circle (Documentation Quality)
- **Status**: PASS
- **Issues**: None
- **Notes**: Documentation complete, examples provided

## Metrics
- **Average complexity**: 4.2
- **Max function length**: 32 lines
- **Duplication**: 0.8%

## Quality Score: 7/7
```

## Approval with Notes Template

```markdown
# Code Review: APPROVED WITH NOTES ✓

## Summary
[Change description] passes critical review criteria with minor suggestions.

## Files Reviewed
- [File 1]: [Status - PASSED]
- [File 2]: [Status - PASSED WITH NOTES]
- [File 3]: [Status - PASSED]

## Criteria Results

### Method Circle (Implementation Correctness)
- **Status**: PASS
- **Issues**: None

### Mad Circle (Integration Completeness)
- **Status**: PASS
- **Issues**: None

### Model Circle (Architecture Alignment)
- **Status**: PASS
- **Issues**: None

### Mode Circle (Pattern Consistency)
- **Status**: PASS (1 minor issue)
- **Issues**:
  - [Medium] src/components/Button.tsx:45 - Inconsistent prop naming (use `onClick` consistently)

### Mod Circle (Maintainability Standards)
- **Status**: PASS (2 suggestions)
- **Issues**:
  - [Low] src/utils/helpers.ts:78 - Consider extracting to named function
  - [Low] src/api/client.ts:23 - Add JSDoc comment for clarity

### Modd Circle (Extensibility Verification)
- **Status**: PASS
- **Issues**: None

### Methodd Circle (Documentation Quality)
- **Status**: PASS (1 suggestion)
- **Issues**:
  - [Low] README.md - Add usage example for new feature

## Suggestions

1. [Low priority suggestion]
2. [Low priority suggestion]

## Metrics
- **Average complexity**: 5.1
- **Max function length**: 48 lines
- **Duplication**: 1.2%

## Quality Score: 6/7
```

## Rejection Template

```markdown
# Code Review: REJECTED ✗

## Summary
[Change description] fails review criteria. Issues must be addressed.

## Files Reviewed
- [File 1]: [Status - FAILED - Critical issues]
- [File 2]: [Status - FAILED - High issues]
- [File 3]: [Status - PASSED]

## Criteria Results

### Method Circle (Implementation Correctness)
- **Status**: FAIL (1 critical, 1 high)
- **Must Fix (Critical)**:
  1. [Critical] src/auth/login.ts:32 - SQL injection vulnerability in user lookup
  2. [High] src/auth/login.ts:45 - Password comparison not timing-safe

- **Should Fix (High)**:
  1. [High] src/auth/login.ts:50 - No error handling for database failures

### Mad Circle (Integration Completeness)
- **Status**: FAIL (1 high)
- **Should Fix (High)**:
  1. [High] Missing dependency on bcrypt library - password hashing not available

### Model Circle (Architecture Alignment)
- **Status**: PASS
- **Issues**: None

### Mode Circle (Pattern Consistency)
- **Status**: PASS
- **Issues**: None

### Mod Circle (Maintainability Standards)
- **Status**: FAIL (1 high)
- **Should Fix (High)**:
  1. [High] src/auth/login.ts:15-80 - Function too long (65 lines), extract logic

### Modd Circle (Extensibility Verification)
- **Status**: PASS
- **Issues**: None

### Methodd Circle (Documentation Quality)
- **Status**: FAIL (1 medium)
- **Consider Fixing (Medium)**:
  1. [Medium] README.md - No documentation for new login endpoint

## Must Fix (Critical)

1. **SQL Injection Vulnerability**
   - **Location**: src/auth/login.ts:32
   - **Issue**: User input directly interpolated into SQL query
   - **Fix**: Use parameterized query or ORM
   - **Impact**: Critical security vulnerability

2. **Timing-Safe Password Comparison**
   - **Location**: src/auth/login.ts:45
   - **Issue**: Using `===` for password comparison allows timing attacks
   - **Fix**: Use timing-safe comparison function (e.g., crypto.timingSafeEqual)
   - **Impact**: Password security compromise

## Should Fix (High)

1. **Missing Error Handling**
   - **Location**: src/auth/login.ts:50
   - **Issue**: Database errors not handled, may expose sensitive info
   - **Fix**: Add try/catch with appropriate error responses

2. **Missing Dependency**
   - **Issue**: bcrypt not installed, password hashing fails
   - **Fix**: Run `npm install bcrypt @types/bcrypt`

3. **Function Too Long**
   - **Location**: src/auth/login.ts:15-80
   - **Issue**: 65-line function hard to understand and test
   - **Fix**: Extract database lookup, password validation, token generation

## Recommendations

1. Install required dependencies: `npm install bcrypt @types/bcrypt`
2. Refactor SQL query to use parameterized statements
3. Implement timing-safe password comparison
4. Add comprehensive error handling
5. Extract login function into smaller functions
6. Document login endpoint in README

## Quality Score: 2/7

**Next Steps**: Address critical and high issues, then re-submit for review.
```

## Severity Level Definitions

### Critical (MUST FIX)

**Definition**: Issues that prevent code from being production-ready or pose severe security risks.

**Examples**:
- Security vulnerabilities (SQL injection, XSS, CSRF)
- Data corruption risks
- Crash/panic conditions
- Breaking changes
- Missing authentication on protected routes

**Action**: Must fix before approval

### High (SHOULD FIX)

**Definition**: Issues that significantly impact code quality or functionality.

**Examples**:
- Performance regressions
- Major integration issues
- Significant pattern violations
- Missing error handling
- Broken functionality
- Missing critical dependencies

**Action**: Should fix before approval

### Medium (CONSIDER FIXING)

**Definition**: Issues that impact code quality but don't block functionality.

**Examples**:
- Minor pattern inconsistencies
- Small maintainability issues
- Missing non-critical documentation
- Code duplication
- Style inconsistencies

**Action**: Consider fixing, can defer

### Low (NICE TO HAVE)

**Definition**: Minor improvements that would enhance code quality.

**Examples**:
- Stylistic preferences
- Minor optimizations
- Enhanced documentation
- Code organization suggestions
- Naming improvements

**Action**: Optional improvements

## Quality Score Calculation

**Scoring:**
- 7/7: All gates pass
- 6/7: All gates pass with minor notes
- 5/7: One gate has medium issues
- 4/7: One gate fails or multiple have medium issues
- 3/7: Two gates fail
- 2/7: Three gates fail
- 1/7: Most gates fail
- 0/7: All gates fail

**Approval Thresholds:**
- 7/7: APPROVED
- 6/7: APPROVED WITH NOTES
- 5/7 or below: REJECTED (unless lenient mode)

## Usage Guidelines

### When to Use Each Template

**Approval Template:**
- All gates pass with no issues
- Clean, production-ready code

**Approval with Notes Template:**
- All gates pass with minor suggestions
- Low priority improvements suggested
- No blocking issues

**Rejection Template:**
- Critical or high issues present
- Gate failures
- Blocking issues for production

### Customization

Templates can be customized based on:
- Project-specific requirements
- Strictness level (lenient/standard/strict)
- Gate-specific concerns
- Team conventions

## References

- @references/code-review-criteria.md - Detailed review criteria
- @references/code-review-workflow.md - Review workflow
- @references/validation-gates.md - 7-BMAD quality gates

---

**Version**: 1.0  
**Last Updated:** 2026-02-13  
**Status**: Active
