# Verifier Specification

## Overview

This document defines the verifier specification for confirming deliverables match phase goals through comprehensive verification of truths, artifacts, key links, success criteria, and next phase readiness.

## Verification Dimensions

### Dimension 1: Truth Verification

**Purpose:** Verify each must_haves.truth is observable and verifiable.

**Criteria:**
- Each truth can be tested
- Evidence documented
- Failure mode documented

**Validation:** Test each truth, document pass/fail with evidence

**Severity:** Blocker if any truth fails

**Truth Verification Template:**
```markdown
### Truth: [Truth statement]
- Status: PASS/FAIL
- Verification: [Method used]
- Evidence: [What proves the truth]
- Date: [Verification date]
```

### Dimension 2: Artifact Verification

**Purpose:** Verify each must_haves.artifact exists and meets specifications.

**Criteria:**
- File exists at specified path
- min_lines met (file line count >= min_lines)
- contains patterns found

**Validation:** Check file exists, verify min_lines and contains

**Severity:** Blocker if required artifact missing, warning if spec not met

**Artifact Verification Template:**
```markdown
### Artifact: [path]
- Status: PASS/FAIL/WARNING
- Exists: [yes/no]
- Line Count: [actual/min_required]
- Contains: [patterns found]
- Missing: [patterns not found]
- Evidence: [File info or excerpt]
```

### Dimension 3: Link Verification

**Purpose:** Verify each must_haves.key_links is functional.

**Criteria:**
- from file exists
- to file exists
- Test via connection (if testable)
- Search for pattern in from file

**Validation:** Check file existence, pattern search, connection test

**Severity:** Warning if link broken (may need documentation update)

**Link Verification Template:**
```markdown
### Link: [from] -> [to]
- Status: PASS/FAIL/WARNING
- From Exists: [yes/no]
- To Exists: [yes/no]
- Pattern Found: [yes/no]
- Via Connection: [tested/not testable]
- Evidence: [Search results or connection test]
```

### Dimension 4: Success Criteria Verification

**Purpose:** Verify all plan success_criteria are met.

**Criteria:**
- All success_criteria from plan checked
- Each criterion verified
- Measurable outcomes documented

**Validation:** Check each criterion, document pass/fail

**Severity:** Blocker if any success criterion fails

### Dimension 5: Gap Detection

**Purpose:** Identify gaps between planned and actual.

**Criteria:**
- Compare plan must_haves to actual deliverables
- Identify discrepancies
- Categorize gaps by type

**Gap Types:**
- Truth Gap: Planned truth not verifiable or failed
- Artifact Gap: Required artifact missing or incomplete
- Link Gap: Planned link not functional
- Criteria Gap: Success criterion not met
- Scope Gap: Deliverables exceed or fall short of plan

**Gap Severity:**
- Blocker: Must fix before phase considered complete
- Warning: Should fix, may affect next phase
- Info: Optional improvement, not required

**Gap Report Template:**
```markdown
# Verification Gap Report
## Phase: [phase-name]
## Date: [date]

### Summary
- Truths: [passed]/[total]
- Artifacts: [passed]/[total]
- Links: [passed]/[total]
- Criteria: [passed]/[total]
- Overall Status: PASS/FAIL

### Gaps Found

#### [Severity]: [Gap Title]
- **Type:** [truth/artifact/link/criteria]
- **Source:** [Which must_haves item]
- **Issue:** [What's wrong]
- **Impact:** [How this affects the phase or next phase]
- **Fix Required:** [What needs to be done]

### Recommendations
[Prioritized list of fixes]
```

### Dimension 6: Next Phase Readiness

**Purpose:** Assess readiness for next phase.

**Criteria:**
- Check ROADMAP.md for phases that depend on current phase
- Verify all dependencies are satisfied
- Identify any partial dependencies

**Readiness Criteria:**
- All truths verified (PASS)
- All critical artifacts present
- All critical links functional
- No blocker gaps
- Success criteria met

**Readiness Levels:**
- Ready: All criteria met, can proceed to next phase
- Ready with Warnings: Minor gaps, can proceed with notes
- Not Ready: Blockers found, must fix before proceeding

**Readiness Report Template:**
```markdown
### Next Phase Readiness
- **Status:** [Ready/Ready with Warnings/Not Ready]
- **Dependent Phases:** [list of phases that depend on this]
- **Satisfied Dependencies:** [list]
- **Outstanding Dependencies:** [list]
- **Blockers:** [list or None]
- **Recommendations:** [what to do before next phase]
```

## Verification Methodologies

### Truth Verification

**Process:**
1. Load must_haves.truths from plan frontmatter
2. For each truth:
   - Determine verification method
   - Execute verification
   - Document result: PASS/FAIL with evidence
   - If FAIL: Document what's missing or broken

**Truth Types:**
- User-observable behaviors: Manual verification or functional test
- System behaviors: Automated test or log check
- Performance criteria: Benchmark or measurement
- Integration status: API call or connection test
- Documentation completeness: File existence and content check

**Evidence Requirements:**
- PASS: Screenshot, test output, log excerpt, or measurement
- FAIL: Description of what's wrong, error message, or missing element

### Artifact Verification

**Process:**
1. Load must_haves.artifacts from plan frontmatter
2. For each artifact:
   - Check file exists using mcp__desktop-commander__get_file_info
   - Verify min_lines using line count
   - Verify contains using mcp__code-index-mcp__search_code_advanced
   - Document result: PASS/FAIL/WARNING

**Verification Methods:**
- File exists: mcp__desktop-commander__get_file_info
- Line count: Check .lastLine or .lineCount from get_file_info
- Contains: mcp__code-index-mcp__search_code_advanced

**Handling Failures:**
- File doesn't exist: FAIL, create gap
- Below min_lines: WARNING, check if content valid
- Pattern missing: FAIL if critical, WARNING if optional

### Link Verification

**Process:**
1. Load must_haves.key_links from plan frontmatter
2. For each link:
   - Verify from file exists
   - Verify to file exists
   - Test via connection (if testable)
   - Search for pattern in from file
   - Document result: PASS/FAIL/WARNING

**Link Types:**
- Import/reference links: Search for import statement
- API links: Check endpoint exists and callable
- Data flow links: Verify source produces, target consumes
- Documentation links: Check reference exists in documentation

**Handling Failures:**
- File missing: FAIL, create gap
- Pattern not found: WARNING, may be documentation issue
- Connection broken: FAIL if critical, WARNING if optional

## Integration Points

### With Validation Workflow

Verifier integrates with validation workflow in Phase 4.

See @workflows/verify-phase.md for integration details.

### With Summary Template

Summary template includes verification outcome section.

See @templates/summary.md for verification outcome format.

## References

- @references/validation-gates.md - 7-BMAD quality gate specifications
- @references/code-review-criteria.md - Code review criteria
- @references/plan-checker.md - Plan checker specification
- @workflows/verify-phase.md - Verification workflow

---

## MCP Tool Integration

### Artifact Verification with MCP

**Use batch reading for multiple artifacts:**
```javascript
// When verifying multiple artifact files
mcp__desktop-commander__read_multiple_files({
  paths: ["path/to/artifact1.md", "path/to/artifact2.md", "path/to/artifact3.md"]
})
// Token savings: 80%+ vs sequential native reads
```

**Use CI for pattern verification:**
```javascript
// When checking contains patterns in artifacts
mcp__code-index-mcp__search_code_advanced({
  pattern: "contains_pattern",
  file_pattern: "artifact.md",
  max_results: 10
})
// Token savings: 80% vs native Grep
```

### Link Verification with MCP

**Use CI for finding related files:**
```javascript
// When verifying key links - find files that reference target
mcp__code-index-mcp__search_code_advanced({
  pattern: "target_file_name",
  file_pattern: "*.md",
  max_results: 20
})
```

**Use CG for relationship verification:**
```javascript
// When verifying code relationships
mcp__CodeGraphContext__analyze_code_relationships({
  query_type: "find_all_callers",
  target: "function_name"
})
// Token savings: 90% vs manual analysis
```

### Batch Reading for Multi-File Verification

**Pattern for verifying multiple dimensions:**
```javascript
// Read all verification-related files at once
mcp__desktop-commander__read_multiple_files({
  paths: [
    "references/validation-gates.md",
    "references/verification-checklist.md",
    "references/code-review-criteria.md"
  ]
})
// Single batch operation vs 3 sequential reads
```

### Token Savings Summary

| Verification Task | Native Approach | MCP Approach | Savings |
|-------------------|-----------------|--------------|---------|
| Verify 5 artifacts | 5×Read (~75K) | read_multiple_files (~8K) | 89% |
| Find pattern in files | Grep (~15K) | search_code_advanced (~3K) | 80% |
| Trace code relationships | Manual (~50K) | CG relationships (~5K) | 90% |

---

**Version**: 1.1  
**Last Updated:** 2026-02-15  
**Status**: Active
