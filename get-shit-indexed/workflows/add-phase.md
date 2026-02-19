<thinking>auto</thinking>

<purpose>
Add a new integer phase to the end of the current milestone in the roadmap. Automatically calculates the next phase number, creates the phase directory, and updates the roadmap structure.
</purpose>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "list_directory", "create_directory"]
  priority: 1
  rationale: "Primary workflow for reading roadmap, writing phase files, creating directories, and listing contents"
code_index:
  tools: ["find_files"]
  priority: 2
  rationale: "Secondary use for discovering existing phase files and planning documents"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<required_reading>
Read all files referenced by the invoking prompt's execution_context before starting.
</required_reading>

<process>

<step name="parse_arguments">
Parse the command arguments:
- All arguments become the phase description
- Example: `/GSI:add-phase Add authentication` → description = "Add authentication"
- Example: `/GSI:add-phase Fix critical performance issues` → description = "Fix critical performance issues"

If no arguments are provided:

```
ERROR: Phase description required
Usage: /GSI:add-phase <description>
Example: /GSI:add-phase Add authentication system
```

Exit.
</step>

<step name="init_context">
Load the phase operation context using MCP tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const INIT = await mcp__desktop-commander__start_process({
  command: "node ~/.claude/get-shit-indexed/bin/GSI-tools.js init phase-op \"0\"",
  timeout_ms: 10000
});
```

Check `roadmap_exists` from the init JSON. If false:
```
ERROR: No roadmap found (.planning/ROADMAP.md)
Run /GSI:new-project to initialize.
```
Exit.
</step>

<step name="add_phase">
**Delegate the phase addition to GSI-tools:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const RESULT = await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-indexed/bin/GSI-tools.js phase add "${description}"`,
  timeout_ms: 15000
});
```

The CLI handles:
- Finding the highest existing integer phase number
- Calculating the next phase number (max + 1)
- Generating a slug from the description
- Creating the phase directory (`.planning/phases/{NN}-{slug}/`)
- Inserting the phase entry into ROADMAP.md with Goal, Depends on, and Plans sections

Extract from the result: `phase_number`, `padded`, `name`, `slug`, `directory`.
</step>

<step name="update_project_state">
Update STATE.md to reflect the new phase.

**Use MCP tool: mcp__desktop-commander__read_file**

```javascript
// Read current STATE.md
const stateContent = await mcp__desktop-commander__read_file({
  path: ".planning/STATE.md"
});
```

**Use MCP tool: mcp__desktop-commander__edit_block**

Then update the "## Accumulated Context" → "### Roadmap Evolution" section:
   ```
   - Phase {N} added: {description}
   ```

If the "Roadmap Evolution" section doesn't exist, create it.
</step>

<step name="completion">
Present the completion summary:

```
Phase {N} added to the current milestone:
- Description: {description}
- Directory: .planning/phases/{phase-num}-{slug}/
- Status: Not planned yet

Roadmap updated: .planning/ROADMAP.md

---

## ▶ Next Up

**Phase {N}: {description}**

`/GSI:plan-phase {N}`

<sub>`/clear` first → fresh context window</sub>

---

**Also available:**
- `/GSI:add-phase <description>` — add another phase
- Review the roadmap

---
```
</step>

</process>

<success_criteria>
- [ ] `GSI-tools phase add` executed successfully
- [ ] Phase directory created
- [ ] Roadmap updated with the new phase entry
- [ ] STATE.md updated with the roadmap evolution note
- [ ] User informed of the next steps
</success_criteria>
