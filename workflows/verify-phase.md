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
@agents/gsd-verifier.md

# 7-BMAD Quality Gates
@references/validation-gates.md
</required_reading>

<process>

<step name="load_project_state">
Read `.planning/STATE.md` to understand current position.
</step>

<step name="load_must_haves">
Load plan must_haves from plan frontmatter.

Extract:
- must_haves.truths
- must_haves.artifacts
- must_haves.key_links
</step>

<step name="verify_truths">
Verify each must_haves.truth is observable and verifiable.

For each truth:
- Determine verification method (automated test, manual check, observable behavior)
- Execute verification
- Document result: PASS/FAIL with evidence
- If FAIL: Document gap and severity

See @references/verifier.md for detailed methodology.
</step>

<step name="verify_artifacts">
Verify each must_haves.artifact exists and meets specifications.

For each artifact:
- Check file exists using mcp__desktop-commander__get_file_info
- Verify min_lines met
- Verify contains patterns using mcp__code-index-mcp__search_code_advanced
- Document result: PASS/FAIL/WARNING

See @references/verifier.md for detailed methodology.
</step>

<step name="verify_links">
Verify each must_haves.key_link is functional.

For each link:
- Verify from file exists
- Verify to file exists
- Test via connection if testable
- Search for pattern in from file
- Document result: PASS/FAIL/WARNING

See @references/verifier.md for detailed methodology.
</step>

<step name="verify_success_criteria">
Verify all plan success_criteria are met.

For each criterion:
- Check if criterion is satisfied
- Document measurable outcome
- Determine pass/fail status

See @references/verifier.md for success criteria verification.
</step>

<step name="detect_gaps">
Compare planned must_haves to actual deliverables.

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
</step>

<step name="assess_readiness">
Determine next phase readiness.

Check:
- ROADMAP.md for dependent phases
- All dependencies satisfied
- No blocker gaps

Determine readiness:
- Ready: All criteria met
- Ready with Warnings: Minor gaps
- Not Ready: Blockers found

Document in readiness report.
</step>

<step name="create_summary">
Create {phase}-{plan}-SUMMARY.md in phase directory.

Include:
- All task commits
- Deviations from plan
- Verification outcome
- Gaps identified
- Next phase readiness

Use @templates/summary.md for format.
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
