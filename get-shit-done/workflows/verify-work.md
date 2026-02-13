<thinking>auto</thinking>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "start_process"]
  priority: 1
  rationale: "Primary workflow for reading phase documents, writing verification results, and running analysis commands"
code_index:
  tools: ["search_code_advanced", "find_files"]
  priority: 2
  rationale: "Secondary use for searching success criteria and finding deliverable files"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Manual testing workflow for when automated UAT isn't enough. Runs verification directly with user driving tests. Same output as verify-work but user controls pace and what to test.
</purpose>

<required_reading>
**Use MCP tools for reading verification context:**

- mcp__desktop-commander__read_file — Read SUMMARY.md, VERIFICATION.md
- mcp__code-index-mcp__find_files — Find deliverable files

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</required_reading>

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- mcp__desktop-commander__read_file — Read verification files
- mcp__code-index-mcp__find_files — Find deliverables

**Process Operations:**
- mcp__desktop-commander__start_process — Run gsi-tools.js commands

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</tool_requirements>

<process>

## 1. Load Verification Context

**Use MCP tools: mcp__desktop-commander__read_file** and **mcp__code-index-mcp__find_files**

```javascript
// MCP-based equivalent for reading files and finding deliverables
const STATE = await mcp__desktop-commander__read_file({
  path: ".planning/STATE.md"
});

const summaries = await mcp__code-index-mcp__find_files({
  pattern: "*-SUMMARY.md",
  path: ".planning/phases"
});
```

Identify phase to verify from state.
</step>

<step name="extract_deliverables">
**Use MCP tool: mcp__desktop-commander__read_file**

```javascript
// MCP-based equivalent (80-90% token savings vs bash cat)
for (const summary of summaries) {
  const content = await mcp__desktop-commander__read_file({
    path: `.planning/phases/${phase}/${summary}`
  });
  // Parse key-files.created for testable items
}
```

Extract deliverables from `key-files.created`. Map to user-facing tests.

Organize tests by feature/component with clear steps for each.
</step>

<step name="present_tests">
Present test queue and let user drive pace:

For each deliverable, provide:
1. Feature name
2. What's being tested
3. Clear test steps
4. Ask: "Ready to test? (yes/no)"

User responds when ready. You wait for their response before proceeding.

**Track results:**
- `yes` → Passed
- `no` → Failed
- `skip` → Deferred
- Issue description → Capture details

**Key difference from verify-work:** User controls when to move to next test, not you.
</step>

<step name="document_results">
Create VERIFICATION.md with test results:

**Use MCP tool: mcp__desktop-commander__write_file**

```javascript
// MCP-based equivalent for file writing (80-90% token savings vs bash)
await mcp__desktop-commander__write_file({
  path: ".planning/phases/${PHASE_DIR}/${PHASE}-UAT.md",
  content: `---\nstatus: manual\n\nresults:\n\n[All test results with pass/fail/skip status]\n---`
});
```

Commit verification:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-done/bin/gsi-tools.js commit "docs(uat-${PHASE}): manual verification complete" --files .planning/phases/${PHASE_DIR}/${PHASE}-UAT.md .planning/STATE.md`,
  timeout_ms: 10000
});
```
</step>

<step name="completion">
Present completion:

```
✓ Manual verification complete

Phase: ${PHASE_NAME}
Tests: ${N} deliverables
Results: ${passed} passed, ${failed} failed

---

## ▶ Next Up

- Review VERIFICATION.md for full results
- `/gsd:plan-phase ${PHASE} --gaps` — If issues found
- `/gsd:execute-phase ${PHASE}` — Re-run with fixes
```
</step>

</process>

<success_criteria>
- [ ] All SUMMARY.md files located using MCP find_files
- [ ] Deliverables extracted using MCP read_file
- [ ] Tests executed with user controlling pace
- [ ] Results tracked (pass/fail/skip)
- [ ] VERIFICATION.md created using MCP write_file
- [ ] Verification committed using MCP start_process
- [ ] User informed of results and next steps
</success_criteria>
