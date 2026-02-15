# Verify Phase Workflow

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- Use `mcp__desktop-commander__read_file` instead of Read
- Use `mcp__desktop-commander__write_file` instead of Write
- Use `mcp__desktop-commander__list_directory` instead of Bash ls

**Code Search:**
- Use `mcp__code-index-mcp__search_code_advanced` instead of Grep
- Use `mcp__code-index-mcp__find_files` instead of Glob
</tool_requirements>

<purpose>
Verify phase deliverables match planned goals through comprehensive verification of truths, artifacts, key links, success criteria, and next phase readiness.
</purpose>

<required_reading>
# Verification References
@references/verifier.md
@references/verification-checklist.md

# Agent Reference
@agents/GSI-verifier.md

# 7-BMAD Quality Gates
@references/validation-gates.md
</required_reading>

<process>

## Thinking Phase: Pre-Workflow

<server>debug</server>
<prompt>Analyze verification approach:
1. What verification issues might arise?
2. What are the critical failure points?
3. What detection patterns should we use?
4. How do we ensure comprehensive coverage?</prompt>
<expected_output>Verification strategy with issue detection patterns</expected_output>
<timeout>5000</timeout>
<integration>Execute verification with awareness of potential issues and detection patterns</integration>

<step name="load_project_state">
Read `.planning/STATE.md` to understand current position.

### Thinking Phase: Pre-Step - Load Project State

<server>sequential</server>
<prompt>Plan state loading for verification:
1. What state information is needed for verification?
2. How does current position affect verification approach?
3. What context is essential?</prompt>
<expected_output>Understanding of verification context and requirements</expected_output>
<timeout>3000</timeout>

### Thinking Phase: Post-Step - State Loaded

<server>debug</server>
<prompt>Reflect on verification context:
1. Was the verification context clear?
2. What position-related factors affect verification?
3. What should be remembered about this phase context?</prompt>
<expected_output>Verification context patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="load_must_haves">
Load plan must_haves from plan frontmatter.

### Thinking Phase: Pre-Step - Load Must-Haves

<server>tractatus</server>
<prompt>Analyze must-have structure:
1. What are the structural components of must-haves?
2. How do truths, artifacts, and links relate?
3. What makes must-haves verifiable?</prompt>
<expected_output>Understanding of must-have structure and verifiability</expected_output>
<timeout>3000</timeout>

Extract:
- must_haves.truths
- must_haves.artifacts
- must_haves.key_links

### Thinking Phase: Post-Step - Must-Haves Loaded

<server>debug</server>
<prompt>Reflect on must-have understanding:
1. Were must-haves well-defined?
2. What ambiguities existed?
3. What should be remembered about this plan's must-haves?</prompt>
<expected_output>Must-have understanding patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="verify_truths">
Verify each must_haves.truth is observable and verifiable.

### Thinking Phase: Pre-Step - Verify Truths

<server>sequential</server>
<prompt>Plan truth verification:
1. What verification methods are appropriate?
2. How do we observe each truth?
3. What constitutes valid evidence?</prompt>
<expected_output>Step-by-step truth verification approach</expected_output>
<timeout>3000</timeout>

For each truth:
- Determine verification method (automated test, manual check, observable behavior)
- Execute verification
- Document result: PASS/FAIL with evidence
- If FAIL: Document gap and severity

See @references/verifier.md for detailed methodology.

### Thinking Phase: Post-Step - Truths Verified

<server>debug</server>
<prompt>Reflect on truth verification:
1. Were all truths observable?
2. What verification methods worked best?
3. What truth verification patterns emerged?</prompt>
<expected_output>Truth verification patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="verify_artifacts">
Verify each must_haves.artifact exists and meets specifications.

### Thinking Phase: Pre-Step - Verify Artifacts

<server>sequential</server>
<prompt>Plan artifact verification:
1. What artifact checks are needed?
2. How do we verify specifications?
3. What tools are most efficient?</prompt>
<expected_output>Efficient artifact verification approach</expected_output>
<timeout>3000</timeout>

For each artifact:
- Check file exists using mcp__desktop-commander__get_file_info
- Verify min_lines met
- Verify contains patterns using mcp__code-index-mcp__search_code_advanced
- Document result: PASS/FAIL/WARNING

See @references/verifier.md for detailed methodology.

### Thinking Phase: Post-Step - Artifacts Verified

<server>debug</server>
<prompt>Reflect on artifact verification:
1. Were all artifacts complete?
2. What specification patterns emerged?
3. What should be remembered about artifact quality?</prompt>
<expected_output>Artifact quality patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="verify_links">
Verify each must_haves.key_link is functional.

### Thinking Phase: Pre-Step - Verify Links

<server>tractatus</server>
<prompt>Analyze link verification:
1. What makes a link functional?
2. How do we test connections?
3. What patterns indicate broken links?</prompt>
<expected_output>Understanding of link structure and testability</expected_output>
<timeout>3000</timeout>

For each link:
- Verify from file exists
- Verify to file exists
- Test via connection if testable
- Search for pattern in from file
- Document result: PASS/FAIL/WARNING

See @references/verifier.md for detailed methodology.

### Thinking Phase: Post-Step - Links Verified

<server>debug</server>
<prompt>Reflect on link verification:
1. Were all links functional?
2. What link patterns were fragile?
3. What should be remembered about link quality?</prompt>
<expected_output>Link quality patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="verify_success_criteria">
Verify all plan success_criteria are met.

### Thinking Phase: Pre-Step - Verify Success Criteria

<server>sequential</server>
<prompt>Plan success criteria verification:
1. How do we measure each criterion?
2. What evidence is needed?
3. How do we determine pass/fail?</prompt>
<expected_output>Clear criteria verification approach</expected_output>
<timeout>3000</timeout>

For each criterion:
- Check if criterion is satisfied
- Document measurable outcome
- Determine pass/fail status

See @references/verifier.md for success criteria verification.

### Thinking Phase: Post-Step - Success Criteria Verified

<server>debug</server>
<prompt>Reflect on success criteria verification:
1. Were all criteria measurable?
2. What criteria were ambiguous?
3. What success criteria patterns emerged?</prompt>
<expected_output>Success criteria patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="detect_gaps">
Compare planned must_haves to actual deliverables.

### Thinking Phase: Pre-Step - Detect Gaps

<server>debug</server>
<prompt>Plan gap detection:
1. What types of gaps might exist?
2. How do we categorize severity?
3. What patterns indicate gaps?</prompt>
<expected_output>Systematic gap detection approach</expected_output>
<timeout>3000</timeout>

Identify:
- Truth gaps: Planned truths not verified or failed
- Artifact gaps: Required artifacts missing or incomplete
- Link gaps: Planned links not functional
- Criteria gaps: Success criteria not met
- Scope gaps: Deliverables differ from plan

Categorize by severity:
- Blocker: Must fix before phase complete
- Warning: Should fix, may affect next phase
- Info: Optional improvement

Document in gap report.

### Thinking Phase: Post-Step - Gaps Detected

<server>debug</server>
<prompt>Reflect on gap detection:
1. What gap patterns emerged?
2. What caused these gaps?
3. What should be remembered to prevent similar gaps?</prompt>
<expected_output>Gap patterns stored in debug-thinking graph</expected_output>
<timeout>3000</timeout>
</step>

<step name="assess_readiness">
Determine next phase readiness.

### Thinking Phase: Pre-Step - Assess Readiness

<server>tractatus</server>
<prompt>Analyze phase readiness:
1. What are the structural dependencies?
2. What makes a phase ready?
3. How do gaps affect readiness?</prompt>
<expected_output>Understanding of readiness structure and impact</expected_output>
<timeout>3000</timeout>

Check:
- ROADMAP.md for dependent phases
- All dependencies satisfied
- No blocker gaps

Determine readiness:
- Ready: All criteria met
- Ready with Warnings: Minor gaps
- Not Ready: Blockers found

Document in readiness report.

### Thinking Phase: Post-Step - Readiness Assessed

<server>debug</server>
<prompt>Reflect on readiness assessment:
1. Was readiness clear?
2. What factors affected readiness?
3. What should be remembered about phase transitions?</prompt>
<expected_output>Readiness assessment patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="create_summary">
Create {phase}-{plan}-SUMMARY.md in phase directory.

### Thinking Phase: Pre-Step - Create Summary

<server>sequential</server>
<prompt>Plan summary creation:
1. What verification outcomes must be captured?
2. How do we structure gap documentation?
3. What readiness information is needed?</prompt>
<expected_output>Comprehensive summary structure</expected_output>
<timeout>3000</timeout>

Include:
- All task commits
- Deviations from plan
- Verification outcome
- Gaps identified
- Next phase readiness

Use @templates/summary.md for format.

### Thinking Phase: Post-Step - Summary Created

<server>debug</server>
<prompt>Reflect on summary creation:
1. Was the summary comprehensive?
2. What verification patterns emerged?
3. What should be remembered about this phase?</prompt>
<expected_output>Phase verification patterns stored</expected_output>
<timeout>3000</timeout>
</step>

<step name="update_state">
Update STATE.md with:
- Current position (phase, plan, status)
- Extract decisions from SUMMARY.md
- Update progress bar
- Update session continuity
</step>

<step name="final_commit">
Commit SUMMARY.md and STATE.md.

If `COMMIT_PLANNING_DOCS=true`:
```bash
git add .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md
git add .planning/STATE.md
git commit -m "docs({phase}-{plan}): complete {plan-name} plan

Tasks completed: [N]/[N]
SUMMARY: .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md"
```
</step>

## Thinking Phase: Post-Workflow - Verification Complete

<server>debug</server>
<prompt>Comprehensive verification reflection:
1. What verification patterns emerged across all checks?
2. What common issues were found?
3. What verification improvements are needed?
4. What should be remembered about this phase's verification?</prompt>
<expected_output>Verification patterns and quality insights stored in debug-thinking graph</expected_output>
<timeout>5000</timeout>
<integration>Store verification learnings, improve verification workflow if needed</integration>

</process>

<completion_format>
When phase verification completes successfully, return:

```markdown
## PHASE COMPLETE

**Phase:** {phase name}
**Plans:** {completed}/{total}
**SUMMARY:** {path to SUMMARY.md}

**Commits:**
- {hash}: {message}
- {hash}: {message}

**Verification Outcome:**
- Truths: [passed]/[total]
- Artifacts: [passed]/[total]
- Links: [passed]/[total]
- Criteria: [passed]/[total]
- Gaps: [count]
- Readiness: [status]

**Duration:** {time}
```

---

**Version:** 1.0  
**Last Updated:** 2026-02-13  
**Status:** Active
