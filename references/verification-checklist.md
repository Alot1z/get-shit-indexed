# Verification Checklist

## Overview

This document provides standardized verification checklist for all phases to ensure consistent validation outcomes.

## Section 1: Truths Verification

**Purpose:** Verify all must_haves.truths are observable and validated.

- [ ] All must_haves.truths loaded
- [ ] Each truth tested with appropriate method
- [ ] Evidence documented for each truth
- [ ] Failed truths identified with fixes

**Truth Types:**
- User-observable behaviors: Manual verification or functional test
- System behaviors: Automated test or log check
- Performance criteria: Benchmark or measurement
- Integration status: API call or connection test

**Completion Status:**
- [ ] All truths verified
- [ ] Evidence collected
- [ ] Failures documented

---

## Section 2: Artifacts Verification

**Purpose:** Verify all must_haves.artifacts exist and meet specifications.

- [ ] All must_haves.artifacts loaded
- [ ] Each artifact file exists
- [ ] min_lines specification met
- [ ] contains patterns found
- [ ] Artifact quality assessed

**Artifact Types:**
- Code files: Source, TypeScript, JavaScript, etc.
- Documentation files: Markdown, text, PDF
- Configuration files: JSON, YAML, TOML
- Test files: Test suites, fixtures
- Build artifacts: Binaries, compiled assets

**Completion Status:**
- [ ] All artifacts verified
- [ ] Specifications validated
- [ ] Missing artifacts identified

---

## Section 3: Links Verification

**Purpose:** Verify all must_haves.key_links are functional.

- [ ] All must_haves.key_links loaded
- [ ] From files exist
- [ ] To files exist
- [ ] Patterns found in from files
- [ ] Via connections tested

**Link Types:**
- Import/reference links: Module imports, references
- API links: Endpoint calls, RPC invocations
- Data flow links: Producer-consumer relationships
- Documentation links: Cross-references in docs

**Completion Status:**
- [ ] All links verified
- [ ] Connection tests performed
- [ ] Broken links documented

---

## Section 4: Success Criteria Verification

**Purpose:** Verify all plan success_criteria are met.

- [ ] All plan success_criteria loaded
- [ ] Each criterion verified
- [ ] Measurable outcomes documented
- [ ] Binary pass/fail determined

**Success Criteria Types:**
- Functional requirements: Feature works as specified
- Non-functional requirements: Performance, security, etc.
- Quality requirements: Code quality standards met
- Documentation requirements: Docs complete and accurate
- Integration requirements: Components work together

**Completion Status:**
- [ ] All criteria verified
- [ ] Pass/fail status assigned
- [ ] Overall success determined

---

## Section 5: Gap Detection

**Purpose:** Identify gaps between planned and actual deliverables.

- [ ] Planned vs actual compared
- [ ] Gaps identified and categorized
- [ ] Severity assigned to each gap
- [ ] Gap report generated

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

**Completion Status:**
- [ ] All gaps identified
- [ ] Categorized by severity
- [ ] Impact assessed
- [ ] Report generated

---

## Section 6: Next Phase Readiness

**Purpose:** Assess readiness for next phase.

- [ ] Dependencies on this phase assessed
- [ ] Satisfied dependencies identified
- [ ] Outstanding dependencies listed
- [ ] Blockers to next phase identified
- [ ] Readiness status determined

**Readiness Assessment:**
- Check ROADMAP.md for phases that depend on current phase
- Verify all dependencies are satisfied
- Identify any partial dependencies
- Document blockers

**Readiness Levels:**
- Ready: All criteria met, can proceed to next phase
- Ready with Warnings: Minor gaps, can proceed with notes
- Not Ready: Blockers found, must fix before proceeding

**Completion Status:**
- [ ] Dependency analysis complete
- [ ] Readiness status determined
- [ ] Recommendations documented

---

## Sign-off

**Verification Complete:** [ ]

- Verifier: _____________________
- Date: ___________________
- Status: ___________________
- Overall: ___________________

**Readiness Assessment:**
- Ready to proceed: [ ]
- Requires attention: [ ]
- Blockers: [ ]

**Notes:**
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

---

**Version:** 1.0  
**Last Updated:** 2026-02-13  
**Status:** Active
