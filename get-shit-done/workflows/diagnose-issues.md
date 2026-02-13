<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file"]
  priority: 1
  rationale: "Primary workflow for reading issue context and writing diagnosis documents"
code_index:
  tools: ["search_code_advanced"]
  priority: 2
  rationale: "Secondary use for searching error patterns across codebase"
debug_thinking:
  tools: ["debug_thinking"]
  priority: 2
  rationale: "Secondary use for graph-based problem tracking and knowledge retrieval"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Orchestrate parallel debug agents to investigate UAT gaps and find root causes.

After UAT finds gaps, spawn one debug agent per gap. Each agent investigates autonomously with symptoms pre-filled from UAT. Collect root causes, update UAT.md gaps with diagnosis, then hand off to plan-phase --gaps with actual diagnoses.

Orchestrator stays lean: parse gaps, spawn agents, collect results, update UAT.
</purpose>

<paths>
DEBUG_DIR=.planning/debug

Debug files use `.planning/debug/` path (hidden directory with leading dot).
</paths>

<core_principle>
**Diagnose before planning fixes.**

UAT tells us WHAT is broken (symptoms). Debug agents find WHY (root cause). plan-phase --gaps then creates targeted fixes based on actual causes, not guesses.

Without diagnosis: "Comment doesn't refresh" → guess at fix → maybe wrong
With diagnosis: "Comment doesn't refresh" → "useEffect missing dependency" → precise fix
</core_principle>

<process>

<step name="parse_gaps">
**Extract gaps from UAT.md:**

**Use MCP tool: mcp__desktop-commander__read_file**

```javascript
// MCP-based equivalent for reading files (80-90% token savings vs cat)
const uatContent = await mcp__desktop-commander__read_file({
  path: ".planning/phases/XX-name/{phase}-UAT.md"
});
```

Read "Gaps" section (YAML format):
```yaml
- truth: "Comment appears immediately after submission"
  status: failed
  reason: "User reported: works but doesn't show until I refresh page"
  severity: major
  test: 2
  artifacts: []
  missing: []
```

For each gap, also read the corresponding test from "Tests" section to get full context.

Build gap list:
```
gaps = [
  {truth: "Comment appears immediately...", severity: "major", test_num: 2, reason: "..."},
  {truth: "Reply button positioned correctly...", severity: "minor", test_num: 5, reason: "..."},
  ...
]
```
</step>

<step name="report_plan">
**Report diagnosis plan to user:**

```
## Diagnosing {N} Gaps

Spawning parallel debug agents to investigate root causes:

| Gap (Truth) | Severity |
|-------------|----------|
| Comment appears immediately after submission | major |
| Reply button positioned correctly | minor |
| Delete removes comment | blocker |

Each agent will:
1. Create DEBUG-{slug}.md with symptoms pre-filled
2. Investigate autonomously (read code, form hypotheses, test)
3. Return root cause

This runs in parallel - all gaps investigated simultaneously.
```
</step>

<step name="graph_based_diagnosis">
**For systematic debugging with knowledge graph:**

**Use MCP tool: mcp__debug-thinking__debug_thinking**

```javascript
// Query for similar problems first
const similar = await mcp__debug-thinking__debug_thinking({
  action: "query",
  queryType: "similar-problems",
  parameters: {
    pattern: "{error pattern or symptom}",
    limit: 5,
    minSimilarity: 0.5
  }
});

// Review past solutions and adapt if applicable

// Create problem node for current issue
const problem = await mcp__debug-thinking__debug_thinking({
  action: "create",
  nodeType: "problem",
  content: "{error description with context}"
});

// Create hypothesis nodes based on similar cases
const hypothesis = await mcp__debug-thinking__debug_thinking({
  action: "create",
  nodeType: "hypothesis",
  content: "{proposed explanation}",
  parentId: problem.nodeId
});

// Connect hypothesis to problem
await mcp__debug-thinking__debug_thinking({
  action: "connect",
  from: hypothesis.nodeId,
  to: problem.nodeId,
  type: "hypothesizes",
  strength: 0.7
});

// Create experiment nodes for each hypothesis
// Track results in observation nodes
// Create solution and learning nodes when resolved
```

**Integration with agents**: Each debug agent uses debug-thinking for tracking

**Knowledge graph query examples**:
- Pattern: "TypeError undefined" → Find past null safety solutions
- Pattern: "timeout connection" → Find past timeout fixes
- Pattern: "authentication failed" → Find past auth debugging

</step>

<step name="spawn_agents">
**Spawn debug agents in parallel:**

For each gap, fill in debug-subagent-prompt template and spawn:

```
Task(
  prompt=filled_debug_subagent_prompt,
  subagent_type="general-purpose",
  description="Debug: {truth_short}"
)
```

**All agents spawn in single message** (parallel execution).

Template placeholders:
- `{truth}`: The expected behavior that failed
- `{expected}`: From UAT test
- `{actual}`: Verbatim user description from reason field
- `{errors}`: Any error messages from UAT (or "None reported")
- `{reproduction}`: "Test {test_num} in UAT"
- `{timeline}`: "Discovered during UAT"
- `{goal}`: `find_root_cause_only` (UAT flow - plan-phase --gaps handles fixes)
- `{slug}`: Generated from truth
</step>

<step name="collect_results">
**Collect root causes from agents:**

Each agent returns with:
```
## ROOT CAUSE FOUND

**Debug Session:** ${DEBUG_DIR}/{slug}.md

**Root Cause:** {specific cause with evidence}

**Evidence Summary:**
- {key finding 1}
- {key finding 2}
- {key finding 3}

**Files Involved:**
- {file1}: {what's wrong}
- {file2}: {related issue}

**Suggested Fix Direction:** {brief hint for plan-phase --gaps}
```

Parse each return to extract:
- root_cause: The diagnosed cause
- files: Files involved
- debug_path: Path to debug session file
- suggested_fix: Hint for gap closure plan

If agent returns `## INVESTIGATION INCONCLUSIVE`:
- root_cause: "Investigation inconclusive - manual review needed"
- Note which issue needs manual attention
- Include remaining possibilities from agent return
</step>

<step name="update_uat">
**Update UAT.md gaps with diagnosis:**

For each gap in the Gaps section, add artifacts and missing fields:

**Use MCP tool: mcp__desktop-commander__edit_block**

```javascript
// MCP-based equivalent for editing files
await mcp__desktop-commander__edit_block({
  file_path: ".planning/phases/XX-name/{phase}-UAT.md",
  old_string: "- truth: \"Comment appears immediately after submission\"\n  status: failed\n  reason: \"User reported: works but doesn't show until I refresh page\"\n  severity: major\n  test: 2",
  new_string: "- truth: \"Comment appears immediately after submission\"\n  status: diagnosed\n  reason: \"User reported: works but doesn't show until I refresh page\"\n  severity: major\n  test: 2\n  root_cause: \"useEffect in CommentList.tsx missing commentCount dependency\"\n  artifacts:\n    - path: \"src/components/CommentList.tsx\"\n      issue: \"useEffect missing dependency\"\n  missing:\n    - \"Add commentCount to useEffect dependency array\"\n    - \"Trigger re-render when new comment added\"\n  debug_session: .planning/debug/comment-not-refreshing.md"
});
```

Update status in frontmatter to "diagnosed".

Commit updated UAT.md using MCP process tool:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: "node ~/.claude/get-shit-done/bin/gsd-tools.js commit \"docs({phase}): add root causes from diagnosis\" --files \".planning/phases/XX-name/{phase}-UAT.md\"",
  timeout_ms: 10000
});
```
</step>

<step name="report_results">
**Report diagnosis results and hand off:**

Display:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► DIAGNOSIS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Gap (Truth) | Root Cause | Files |
|-------------|------------|-------|
| Comment appears immediately | useEffect missing dependency | CommentList.tsx |
| Reply button positioned correctly | CSS flex order incorrect | ReplyButton.tsx |
| Delete removes comment | API missing auth header | api/comments.ts |

Debug sessions: ${DEBUG_DIR}/

Proceeding to plan fixes...
```

Return to verify-work orchestrator for automatic planning.
Do NOT offer manual next steps - verify-work handles the rest.
</step>

</process>

<context_efficiency>
Agents start with symptoms pre-filled from UAT (no symptom gathering).
Agents only diagnose—plan-phase --gaps handles fixes (no fix application).
</context_efficiency>

<failure_handling>
**Agent fails to find root cause:**
- Mark gap as "needs manual review"
- Continue with other gaps
- Report incomplete diagnosis

**Agent times out:**
- Check DEBUG-{slug}.md for partial progress
- Can resume with /gsd:debug

**All agents fail:**
- Something systemic (permissions, git, etc.)
- Report for manual investigation
- Fall back to plan-phase --gaps without root causes (less precise)
</failure_handling>

<success_criteria>
- [ ] Gaps parsed from UAT.md using MCP read_file
- [ ] Debug agents spawned in parallel
- [ ] Root causes collected from all agents
- [ ] UAT.md gaps updated with artifacts and missing using MCP edit_block
- [ ] Debug sessions saved to ${DEBUG_DIR}/
- [ ] Hand off to verify-work for automatic planning
</success_criteria>
