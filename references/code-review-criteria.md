# Code Review Criteria

## Overview

This document defines the detailed code review criteria for 5 of the 7 quality gates in the 7-BMAD validation system.

## Gate 1: Implementation Correctness (Method Circle)

### Purpose
Verify that the implementation correctly fulfills requirements and functions as intended.

### Checks

#### Code Compilation/Execution
- [ ] Code compiles or runs without syntax errors
- [ ] No runtime errors during normal operation
- [ ] Build process succeeds
- [ ] No type errors (if typed language)

#### Logic Correctness
- [ ] Logic matches requirements exactly
- [ ] Output matches expected results
- [ ] Algorithms implement specified behavior
- [ ] Data transformations are correct
- [ ] Control flow is correct

#### Edge Case Handling
- [ ] Null/undefined values handled properly
- [ ] Empty inputs processed correctly
- [ ] Boundary conditions tested
- [ ] Error cases covered
- [ ] Invalid inputs rejected

#### Performance Requirements
- [ ] Response time meets specifications
- [ ] Memory usage within limits
- [ ] Scalability requirements satisfied
- [ ] No obvious performance bottlenecks
- [ ] No unnecessary loops or recursion

#### Security
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Proper authentication/authorization
- [ ] Input validation present
- [ ] Secrets not hardcoded
- [ ] CSRF protection where needed

#### Resource Management
- [ ] Connections properly closed
- [ ] Memory leaks absent
- [ ] File handles released
- [ ] Resources cleaned up
- [ ] No memory leaks

### Output Format

```markdown
## Method Circle: PASS/FAIL

### Issues Found
1. [Critical/High/Medium/Low] [Location]: [Description]
2. [Critical/High/Medium/Low] [Location]: [Description]

### Recommendations
1. [Specific fix suggestion]
2. [Specific fix suggestion]
```

### Metrics

- Build success: Pass/Fail
- Test pass rate: X%
- Performance benchmarks: Pass/Fail
- Security scan: Pass/Fail

---

## Gate 2: Integration Completeness (Mad Circle)

### Purpose
Verify that all components are properly integrated and work together correctly.

### Checks

#### Dependency Integration
- [ ] All required dependencies installed/imported
- [ ] Dependency versions compatible
- [ ] No missing imports
- [ ] No unused dependencies
- [ ] Package managers properly configured

#### API/Interface Matching
- [ ] APIs match specifications exactly
- [ ] Interfaces implemented completely
- [ ] Function signatures correct
- [ ] Parameter types match
- [ ] Return types match

#### Data Flow
- [ ] Data flows correctly between components
- [ ] No broken data pipelines
- [ ] State changes propagate properly
- [ ] Data transformations complete
- [ ] No data loss in transformations

#### Integration Points
- [ ] No missing integration points
- [ ] All connectors present
- [ ] Cross-module calls work
- [ ] External integrations functional
- [ ] Database connections work

#### Error Handling Across Boundaries
- [ ] Errors propagate correctly
- [ ] Error handling at boundaries
- [ ] Fallback mechanisms present
- [ ] Graceful degradation
- [ ] Error messages informative

#### Contract Compliance
- [ ] API contracts honored
- [ ] Data structure contracts met
- [ ] Protocol compliance
- [ ] Interface contracts satisfied
- [ ] Version compatibility

### Output Format

```markdown
## Mad Circle: PASS/FAIL

### Integration Points
- [ ] Dependency A: Integrated
- [ ] API B: Mismatched (see issue #1)
- [ ] Data Flow C: Broken (see issue #2)

### Issues Found
[Detailed integration issues]

### Recommendations
[Specific integration fixes]
```

### Metrics

- Integration coverage: X%
- Contract compliance rate: X%
- External integration success: X%

---

## Gate 4: Pattern Consistency (Mode Circle)

### Purpose
Verify that coding patterns and conventions are consistently applied.

### Checks

#### Coding Patterns
- [ ] Uses established coding patterns
- [ ] Pattern application consistent
- [ ] Patterns appropriate for context
- [ ] No anti-patterns present
- [ ] Design patterns used correctly

#### Naming Conventions
- [ ] Variables named consistently
- [ ] Functions named according to convention
- [ ] Classes follow naming standards
- [ ] Files named appropriately
- [ ] Constants follow convention

#### Error Handling Patterns
- [ ] Error handling consistent
- [ ] Error patterns established
- [ ] Error propagation uniform
- [ ] Error messages follow format
- [ ] Error logging consistent

#### State Management Patterns
- [ ] State management patterns aligned
- [ ] State updates consistent
- [ ] State mutations controlled
- [ ] State access patterns uniform
- [ ] Immutable patterns where appropriate

#### Code Structure Patterns
- [ ] File structure consistent
- [ ] Module organization uniform
- [ ] Code layout follows standards
- [ ] Section ordering consistent
- [ ] Directory structure organized

#### Comment Patterns
- [ ] Comment style consistent
- [ ] Comment placement appropriate
- [ ] Comment format uniform
- [ ] Documentation comments complete
- [ ] Inline comments helpful

### Output Format

```markdown
## Mode Circle: PASS/FAIL

### Pattern Violations
1. [Pattern name]: [How it's violated]
2. [Pattern name]: [How it's violated]

### Consistency Issues
- Naming: [Issue description]
- Structure: [Issue description]

### Recommendations
- Apply pattern: [Pattern name]
- Refactor: [Specific refactoring]
```

### Metrics

- Pattern compliance rate: X%
- Naming consistency score: X%
- Code structure consistency: X%

---

## Gate 5: Maintainability Standards (Mod Circle)

### Purpose
Verify that code is maintainable, readable, and follows best practices.

### Checks

#### Code Readability
- [ ] Code is clear and understandable
- [ ] Intent is obvious from reading
- [ ] No confusing constructs
- [ ] Self-documenting code
- [ ] No clever/obscure code

#### Comments
- [ ] Comments where necessary (not obvious)
- [ ] Comments explain WHY not WHAT
- [ ] No misleading comments
- [ ] Complex logic explained
- [ ] Public APIs documented

#### Function/Class Size
- [ ] Function length reasonable (<50 lines)
- [ ] Class length reasonable (<300 lines)
- [ ] Parameter count limited (<5 parameters)
- [ ] Nesting depth controlled (<5 levels)
- [ ] Method complexity manageable

#### Complexity Management
- [ ] Cyclomatic complexity acceptable (<10)
- [ ] Cognitive complexity manageable
- [ ] No overly complex algorithms
- [ ] Simplification where possible
- [ ] No nested ternaries

#### Test Coverage
- [ ] Unit tests present
- [ ] Tests cover critical paths
- [ ] Edge cases tested
- [ ] Tests are meaningful
- [ ] Test assertions clear

#### Code Duplication
- [ ] No significant duplication (<3% similarity)
- [ ] DRY principle followed
- [ ] Shared code extracted
- [ ] No copy-paste programming
- [ ] Similar code consolidated

### Metrics

- **Cyclomatic complexity**: <10 per function
- **Function length**: <50 lines
- **Class length**: <300 lines
- **Duplication**: <3% similarity
- **Test coverage**: Target 80%+

### Output Format

```markdown
## Mod Circle: PASS/FAIL

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

---

## Gate 7: Documentation Quality (Methodd Circle)

### Purpose
Verify that documentation is complete, accurate, and useful.

### Checks

#### README Updates
- [ ] README updated if functionality changed
- [ ] New features documented
- [ ] Usage instructions clear
- [ ] Installation steps accurate
- [ ] Examples provided

#### API Documentation
- [ ] API documentation complete
- [ ] All public APIs documented
- [ ] Parameters documented
- [ ] Return values specified
- [ ] Exceptions documented

#### Usage Examples
- [ ] Usage examples provided
- [ ] Examples are clear
- [ ] Examples cover common cases
- [ ] Examples are runnable
- [ ] Edge cases shown in examples

#### Changelog Updates
- [ ] Changes documented in changelog
- [ ] Change descriptions meaningful
- [ ] Breaking changes noted
- [ ] Version numbers correct
- [ ] Date stamps accurate

#### Inline Comments
- [ ] Complex code commented
- [ ] Non-obvious logic explained
- [ ] References to external sources
- [ ] TODO/FIXME comments appropriate
- [ ] No outdated comments

#### Architecture Documentation
- [ ] Architecture docs updated
- [ ] Design decisions documented
- [ ] System diagrams current
- [ ] Data flows documented
- [ ] Dependencies documented

### Output Format

```markdown
## Methodd Circle: PASS/FAIL

### Documentation Checklist
- README: [Status]
- API docs: [Status]
- Examples: [Status]
- Changelog: [Status]

### Missing Documentation
- [ ] [What's missing]
- [ ] [What's missing]

### Recommendations
[Specific documentation additions]
```

### Metrics

- Documentation coverage: X%
- Example completeness: X%
- API documentation completeness: X%

---

## Severity Levels

### Critical (MUST FIX)
- Security vulnerabilities
- Data corruption risks
- Crash/panic conditions
- Breaking changes
- Missing authentication

### High (SHOULD FIX)
- Performance regressions
- Major integration issues
- Significant pattern violations
- Missing error handling
- Broken functionality

### Medium (CONSIDER FIXING)
- Minor pattern inconsistencies
- Small maintainability issues
- Missing non-critical documentation
- Code duplication
- Style inconsistencies

### Low (NICE TO HAVE)
- Stylistic preferences
- Minor optimizations
- Enhanced documentation
- Code organization suggestions
- Naming improvements

---

## Integration with 7-BMAD Gates

These criteria map to the 7-BMAD quality gates as follows:

- **Method Circle** → Implementation Correctness (this document)
- **Mad Circle** → Integration Completeness (this document)
- **Model Circle** → Architecture Alignment (uses tractatus-thinking)
- **Mode Circle** → Pattern Consistency (this document)
- **Mod Circle** → Maintainability Standards (this document)
- **Modd Circle** → Extensibility Verification (uses tractatus-thinking)
- **Methodd Circle** → Documentation Quality (this document)

## References

- @references/validation-gates.md - 7-BMAD quality gate specifications
- @references/code-review-workflow.md - Code review workflow
- @references/code-review-templates.md - Output templates

---

**Version**: 1.0  
**Last Updated**: 2026-02-13  
**Status**: Active
