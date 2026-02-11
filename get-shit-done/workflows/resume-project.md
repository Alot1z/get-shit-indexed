<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "start_process"]
  priority: 1
  rationale: "Primary workflow for reading state, writing updates, and running git/analysis commands"
code_index:
  tools: ["search_code_advanced"]
  priority: 2
  rationale: "Secondary use for searching project context during resumption"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Resume work from a previous session that used `.continue-here.md` handoff file. Loads complete state, finds where left off, and continues execution. Orchestrator stays lean — delegates to subagents.
</purpose>

<required_reading>
**Use MCP tools to read project state and handoff file:**

- mcp__desktop-commander__read_file — Read STATE.md
- mcp__desktop-commander__read_file — Read .continue-here.md
- mcp__code-index-mcp__find_files — List phase directories

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</required_reading>

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- mcp__desktop-commander__read_file — Read handoff file
- mcp__desktop-commander__list_directory — Find current phase

**Process Operations:**
- mcp__desktop-commander__start_process — Run gsd-tools.js commands

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</tool_requirements>

<process>

## 1. Detect Current Phase

**Use MCP tool: mcp__code-index-mcp__find_files**

```javascript
// MCP-based equivalent for finding files (80-90% token savings vs bash ls)
const phaseDirs = await mcp__code-index-mcp__find_files({
  pattern: "*-PLAN.md",
  path: ".planning/phases"
});
```

Find most recently modified phase directory.

**If no active phase detected:** Ask user which phase they're resuming.
</step>

<step name="load_handoff">
**Use MCP tool: mcp__desktop-commander__read_file**

```javascript
// MCP-based equivalent (80-90% token savings vs bash cat)
const handoffContent = await mcp__desktop-commander__read_file({
  path: ".planning/phases/XX-name/.continue-here.md"
});
```

Parse YAML frontmatter:
- `phase`
- `task`
- `total_tasks`
- `status`
- `last_updated`
- `current_state` with completed/remaining work arrays
- `decisions_made`
- `blockers`
- `context`
- `next_action`

Extract all context for seamless continuation.
</step>

<step name="verify_continuation">
Check if handoff file exists and is recent.

**If missing:** Warn user that state may be stale. Ask if they want to continue anyway.
</step>

<step name="spawn_continuation">
Spawn gsd-executor with continuation context:

```
Task(
  subagent_type="gsd-executor",
  prompt="<complete state from handoff, continue from task X>",
  model="{executor_model}"
)
```

No new planning — executor reads handoff state and continues from exactly where previous session stopped.

Fresh context per subagent — no token contamination from orchestrator.
</step>

<step name="update_state">
After continuation completes, update STATE.md:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-done/bin/gsd-tools.js state record-session --stopped-at "Continuation complete" --resume-file "None"`,
  timeout_ms: 10000
});
```

Remove `.continue-here.md` after successful continuation.
</step>

<step name="completion">
Present completion report:

```
✓ Work resumed from session handoff

Phase: [XX-name]
Continued from: Task [X] of [Y]
[Summary of what was done]

---

## ▶ Next Up

Continue with remaining tasks or mark phase complete.
```
</step>

</process>

<success_criteria>
- [ ] Current phase detected using MCP find_files
- [ ] Handoff file loaded using MCP read_file
- [ ] Continuation spawned with complete state
- [ ] Work continued and tasks completed
- [ ] STATE.md updated using MCP start_process
- [ ] User informed of completion and next steps
- [ ] Handoff file cleaned up after successful continuation
</success_criteria>
