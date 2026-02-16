# Verification Template

Template for verification documents with integrated thinking phases.

---

## File Template

```markdown
---
phase: XX-name
plan: YY
verification_type: [pre-commit|post-deploy|phase-complete|gate-check]
thinking_required: true
thinking_servers:
  - sequential
  - debug
  - tractatus
---

# Verification: [Name]

<thinking_phase phase="PRE_VERIFICATION" server="sequential" timeout="5000">
Define verification approach:
- List verification steps in order
- Set success criteria for each step
- Identify potential failure modes
- Prepare rollback procedures
</thinking_phase>

## Scope

**Target:** [What is being verified]
**Context:** [Why this verification is needed]
**Risk Level:** [low|medium|high]

## 7-BMAD Circle Checks

### 1. Method Circle (Implementation Correctness)

<thinking_prompt server="debug">
Check implementation correctness:
- Code compiles/runs without errors
- Logic matches requirements
- Edge cases handled
- Performance requirements met
</thinking_prompt>

**Criteria:**
- [ ] Code compiles without errors
- [ ] Logic matches specification
- [ ] Edge cases handled properly
- [ ] Performance within bounds

**Verification Steps:**
1. [Step 1]
2. [Step 2]

**Result:** [PASS/FAIL/PARTIAL]
**Notes:** [Any observations]

### 2. Mad Circle (Integration Completeness)

<thinking_prompt server="tractatus">
Analyze integration completeness:
- All dependencies integrated
- APIs/interfaces match specs
- Data flows correctly
- No missing integration points
</thinking_prompt>

**Criteria:**
- [ ] Dependencies properly integrated
- [ ] APIs match specifications
- [ ] Data flows correctly

**Verification Steps:**
1. [Step 1]
2. [Step 2]

**Result:** [PASS/FAIL/PARTIAL]

### 3. Model Circle (Architecture Alignment)

<thinking_prompt server="tractatus">
Verify architecture alignment:
- Follows project patterns
- Separation of concerns
- Design principles adhered to
- Consistent with codebase
</thinking_prompt>

**Criteria:**
- [ ] Follows architectural patterns
- [ ] Maintains separation of concerns
- [ ] Consistent with existing code

**Verification Steps:**
1. [Step 1]
2. [Step 2]

**Result:** [PASS/FAIL/PARTIAL]

### 4. Mode Circle (Pattern Consistency)

<thinking_prompt server="sequential">
Check pattern consistency:
- Established patterns used
- Naming conventions followed
- Error handling consistent
- State management aligned
</thinking_prompt>

**Criteria:**
- [ ] Uses established patterns
- [ ] Naming conventions followed
- [ ] Error handling consistent

**Verification Steps:**
1. [Step 1]
2. [Step 2]

**Result:** [PASS/FAIL/PARTIAL]

### 5. Mod Circle (Maintainability Standards)

<thinking_prompt server="debug">
Assess maintainability:
- Code is readable
- Comments where needed
- Function/class size reasonable
- Complexity within limits
</thinking_prompt>

**Criteria:**
- [ ] Code is readable
- [ ] Appropriate comments
- [ ] Function size < 50 lines
- [ ] Complexity < 10

**Verification Steps:**
1. [Step 1]
2. [Step 2]

**Result:** [PASS/FAIL/PARTIAL]

### 6. Modd Circle (Extensibility Verification)

<thinking_prompt server="tractatus">
Verify extensibility:
- Easy to extend
- No hard-coded assumptions
- Configurable where appropriate
- Extension points clear
</thinking_prompt>

**Criteria:**
- [ ] Easy to extend/modify
- [ ] No hard-coded values
- [ ] Configurable options
- [ ] Extension points documented

**Verification Steps:**
1. [Step 1]
2. [Step 2]

**Result:** [PASS/FAIL/PARTIAL]

### 7. Methodd Circle (Documentation Quality)

<thinking_prompt server="sequential">
Check documentation:
- README updated
- API docs complete
- Usage examples provided
- Changes documented
</thinking_prompt>

**Criteria:**
- [ ] README updated if needed
- [ ] API documentation complete
- [ ] Usage examples provided
- [ ] Changelog updated

**Verification Steps:**
1. [Step 1]
2. [Step 2]

**Result:** [PASS/FAIL/PARTIAL]

## Pattern Matching

<thinking_phase phase="DURING_VERIFICATION" server="debug" timeout="8000">
Analyze for patterns:
- Identify common code patterns
- Check for anti-patterns
- Compare with established patterns
- Flag deviations for review
</thinking_phase>

### Patterns Found

| Pattern | Location | Status |
|---------|----------|--------|
| [Pattern name] | [File:line] | [match/deviation] |

### Anti-Patterns Detected

| Anti-Pattern | Location | Severity | Recommendation |
|--------------|----------|----------|----------------|
| [Anti-pattern] | [File:line] | [high/med/low] | [Fix suggestion] |

## Learning Extraction

<thinking_phase phase="POST_VERIFICATION" server="debug" timeout="5000">
Extract learnings from verification:
- What patterns worked well
- What could be improved
- New patterns discovered
- Store for future reference
</thinking_phase>

### Lessons Learned

1. **[Lesson Category]**: [Description]
2. **[Lesson Category]**: [Description]

### Patterns for Storage

```javascript
// Store in ~/.debug-thinking-mcp/patterns/
{
  "pattern_type": "verification",
  "phase": "XX-name",
  "patterns_found": [...],
  "anti_patterns": [...],
  "recommendations": [...]
}
```

## Summary

<thinking_prompt server="tractatus">
Synthesize verification results:
- Aggregate gate results
- Identify critical issues
- Determine overall status
- Generate recommendations
</thinking_prompt>

### Gate Summary

| Circle | Result | Critical Issues |
|--------|--------|-----------------|
| Method | PASS/FAIL | [count] |
| Mad | PASS/FAIL | [count] |
| Model | PASS/FAIL | [count] |
| Mode | PASS/FAIL | [count] |
| Mod | PASS/FAIL | [count] |
| Modd | PASS/FAIL | [count] |
| Methodd | PASS/FAIL | [count] |

### Overall Status

- **Total Gates:** 7
- **Passed:** [X]
- **Failed:** [Y]
- **Quality Score:** [X]/7

### Recommendation

[PROCEED / PROCEED WITH FIXES / BLOCK]

### Critical Issues

1. [Issue description and resolution]
2. [Issue description and resolution]

### Next Steps

1. [Action item]
2. [Action item]

---

*Verified: [date]*
*Verifier: [agent/system]*
```

---

## Thinking Server Mapping

| Circle | Primary Server | Rationale |
|--------|---------------|-----------|
| Method | Debug | Problem detection and analysis |
| Mad | Tractatus | Integration structure analysis |
| Model | Tractatus | Architecture structure verification |
| Mode | Sequential | Pattern sequence verification |
| Mod | Debug | Maintainability issue detection |
| Modd | Tractatus | Extensibility structure analysis |
| Methodd | Sequential | Documentation checklist |

## Usage Example

```bash
# Create verification document
gsi verify-phase 06

# Output: .planning/phases/06-quality-verification/06-01-VERIFICATION.md
```

## Integration with Debug-Thinking

Verification results are automatically stored in the debug-thinking knowledge graph:

```javascript
// After verification completes
mcp__debug-thinking__debug_thinking({
  action: "create",
  nodeType: "observation",
  content: "Verification of phase XX passed 7/7 gates",
  metadata: {
    phase: "XX-name",
    quality_score: 7,
    patterns_found: [...]
  }
})
```

---

**Version:** 1.0  
**Last Updated:** 2026-02-16  
**Status:** Active
