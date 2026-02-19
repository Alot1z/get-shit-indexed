<thinking>auto</thinking>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "list_directory"]
  priority: 1
  rationale: "Primary workflow for reading phase plans, writing verification results, and listing deliverables"
code_index:
  tools: ["search_code_advanced", "find_files"]
  priority: 2
  rationale: "Secondary use for searching success criteria and finding deliverable files"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Validate built features through conversational UAT. Extracts testable deliverables from SUMMARY.md files, presents tests one at a time (yes/no responses), automatically diagnoses failures and creates fix plans. Ready for re-execution if issues found.
</purpose>

<required_reading>
**Use MCP tools for reading phase summaries and STATE.md:**

- mcp__desktop-commander__read_file — Read SUMMARY.md files
- mcp__code-index-mcp__find_files — Find phase directories

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</required_reading>

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- mcp__desktop-commander__read_file — Read SUMMARY.md
- mcp__code-index-mcp__find_files — Find verification files

**Process Operations:**
- mcp__desktop-commander__start_process — Run GSI-tools.js commands

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</tool_requirements>

<process>

## 1. Load Verification Context

**Use MCP tool: mcp__desktop-commander__read_file**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const STATE = await mcp__desktop-commander__read_file({
  path: ".planning/STATE.md"
});
```

Extract: Current phase, milestone, position.

**Use MCP tool: mcp__code-index-mcp__find_files**

```javascript
// MCP-based equivalent for finding files (80-90% token savings vs bash ls)
const phaseDirs = await mcp__code-index-mcp__find_files({
  pattern: "*-SUMMARY.md",
  path: ".planning/phases"
});
```

Identify all SUMMARY.md files in current phase.

## 2. Extract Testable Deliverables

From each SUMMARY.md, extract `key-files.created` and map to user-facing tests:

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

Create test queue organized by component/feature.
</step>

<step name="run_tests">
Present tests one at a time using conversational prompts:

For each deliverable:
1. Describe what's being tested (from SUMMARY.md)
2. Provide clear test steps
3. Ask: "Ready to test? (yes/no)"

Wait for user response (yes/no/skip/issue description).

**Track results:**
- `yes` → Mark as passed
- `no` → Mark as failed or skipped
- `issue` → Capture failure details

Document any issues found for gap closure planning.
</step>

<step name="diagnose_failures">
For failed tests, spawn debug agents:

**Use MCP tool: mcp__desktop-commander__start_process** to spawn debug agents

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
await mcp__desktop-commander__start_process({
  command: "node ~/.claude/get-shit-indexed/bin/GSI-tools.js init debug ${test_name}",
  timeout_ms: 10000
});
```

Each agent investigates root cause.
</step>

<step name="create_fix_plans">
After diagnosis, group issues into gap closure phases using MCP tools:

**Use MCP tool: mcp__desktop-commander__write_file**

```javascript
// MCP-based equivalent for file writing (80-90% token savings vs bash)
await mcp__desktop-commander__start_process({
  command: "node ~/.claude/get-shit-indexed/bin/GSI-tools.js plan-phase ${PHASE} --gaps",
  timeout_ms: 10000
});
```
</step>

<step name="offer_reexecution">
If issues found, offer to re-execute phase with gap closure plans:

```
## ⚠ Verification Issues Found

**Failures:** {N} tests failed

---

## ▶ Next Up

**Plan gap closure** — Create phases to fix issues

`/GSI:plan-phase {PHASE} --gaps`

<sub>`/clear` first → fresh context window</sub>

Or **Skip re-execution** — Accept issues, mark phase complete

---

**All tests passed?**

[yes/no]
```

If all passed: Update phase status to passed in STATE.md.
</step>

<step name="update_phase_status">
Update phase verification status in ROADMAP.md and STATE.md using MCP tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-indexed/bin/GSI-tools.js commit "docs(uat-${PHASE}): all tests passed" --files .planning/ROADMAP.md .planning/STATE.md .planning/phases/${PHASE_DIR}/*-UAT.md`,
  timeout_ms: 10000
});
```
</step>

</process>

<success_criteria>
- [ ] All SUMMARY.md files located using MCP find_files
- [ ] Testable deliverables extracted using MCP read_file
- [ ] Tests executed conversationaly
- [ ] Failures diagnosed using MCP start_process
- [ ] Fix plans created using MCP start_process if issues found
- [ ] Re-execution offered if needed
- [ ] Phase status updated using MCP start_process
- [ ] User informed of verification results
</success_criteria>
