<thinking>auto</thinking>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "start_process"]
  priority: 1
  rationale: "Primary workflow for reading roadmap, writing updates, and running git commands"
code_index:
  tools: ["find_files"]
  priority: 2
  rationale: "Secondary use for discovering phase files to remove"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Remove a future phase from the roadmap and renumber all subsequent phases to close the gap. Updates ROADMAP.md, deletes phase directory, and commits changes.
</purpose>

<required_reading>
**Use MCP tools:**
- mcp__desktop-commander__read_file — Read ROADMAP.md before modification
- mcp__code-index-mcp__search_code_advanced — Find phase references to update

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</required_reading>

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- mcp__desktop-commander__read_file — Read files
- mcp__desktop-commander__edit_block — Edit ROADMAP.md
- mcp__desktop-commander__list_directory — List phase directories

**Code Search:**
- mcp__code-index-mcp__search_code_advanced — Search for phase references

**Process Operations:**
- mcp__desktop-commander__start_process — Run GSI-tools.js commands

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</tool_requirements>

<process>

<step name="parse_arguments">
Parse command arguments:
- First argument: phase number to remove
- Remaining arguments: (optional) confirmation flag

Example: `/GSI:remove-phase 17` → remove = 17

If no phase number:

```
ERROR: Phase number required
Usage: /GSI:remove-phase <number>
Example: /GSI:remove-phase 17
```

Exit.

Validate first argument is an integer ≤ highest phase number.
</step>

<step name="init_context">
Load phase operation context using MCP tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const INIT = await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-indexed/bin/GSI-tools.js init phase-op "${REMOVE_PHASE}"`,
  timeout_ms: 10000
});
```

Extract `roadmap_exists` from init JSON. If false:
```
ERROR: No roadmap found (.planning/ROADMAP.md)
```
Exit.
</step>

<step name="remove_phase">
**Remove phase using GSI-tools:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-indexed/bin/GSI-tools.js phase remove "${REMOVE_PHASE}"`,
  timeout_ms: 10000
});
```

The CLI handles:
- Validating phase exists in ROADMAP.md
- Removing phase entry from ROADMAP.md
- Deleting phase directory (`.planning/phases/{NN}-{slug}/`)
- Renumbering all subsequent phases (NN becomes NN-1, NN-1 becomes NN-2, etc.)

Extract from result: `removed_phase`, `removed_directory`, `renumbered_count`.

**Note:** Phase directories are NOT deleted from disk — they accumulate as execution history. Only the ROADMAP.md reference is removed.
</step>

<step name="update_state">
Update STATE.md using MCP tools:

**Use MCP tool: mcp__desktop-commander__read_file** and **mcp__desktop-commander__edit_block**

```javascript
// MCP-based equivalent for reading and editing files
const stateContent = await mcp__desktop-commander__read_file({
  path: ".planning/STATE.md"
});

await mcp__desktop-commander__edit_block({
  file_path: ".planning/STATE.md",
  old_string: "[existing roadmap evolution section]",
  new_string: "### Roadmap Evolution\n   - Phase ${removed_phase} removed: ${reason}\n   - Phases ${renumbered_count} renumbered: ${removed_phase}+1 → ${removed_phase}, ${removed_phase}+2 → ..."
});
```

If "Roadmap Evolution" section doesn't exist, create it.
</step>

<step name="completion">
Present completion summary:

```
Phase ${removed_phase} removed from roadmap:
- Directory: .planning/phases/${removed_phase}-{slug}/ (preserved on disk)
- Phases renumbered: ${renumbered_count} phases shifted
- ROADMAP.md updated

State updated: .planning/STATE.md

---

## ▶ Next Up

Review updated roadmap structure.

---

**Also available:**
- `cat .planning/ROADMAP.md` — view updated roadmap
```
</step>

</process>

<success_criteria>
- [ ] Phase exists in roadmap (validated using MCP tools)
- [ ] Phase removed using GSI-tools (MCP start_process)
- [ ] Phase directory deleted (preserved on disk)
- [ ] Subsequent phases renumbered (count tracked)
- [ ] ROADMAP.md updated using MCP edit_block
- [ ] STATE.md updated with roadmap evolution entry
- [ ] User informed of completion and next steps
</success_criteria>
