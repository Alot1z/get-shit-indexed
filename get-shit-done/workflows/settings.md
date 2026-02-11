<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file"]
  priority: 1
  rationale: "Primary workflow for reading and writing configuration"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Configure workflow toggles and model profile interactively. Changes mode (interactive/yolo), depth (quick/standard/comprehensive), parallelization, and model assignments for planning agents.
</purpose>

<required_reading>
**Use MCP tool: mcp__desktop-commander__read_file** to read current config

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</required_reading>

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- mcp__desktop-commander__read_file — Read config.json
- mcp__desktop-commander__write_file — Write updated config

**Process Operations:**
- mcp__desktop-commander__start_process — Run gsd-tools.js config commands

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</tool_requirements>

<process>

<step name="init_context">
Load settings context using MCP tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const CONFIG_JSON = await mcp__desktop-commander__read_file({
  path: ".planning/config.json"
});

await mcp__desktop-commander__start_process({
  command: "node ~/.claude/get-shit-done/bin/gsd-tools.js config-init",
  timeout_ms: 10000
});
```

Display current config with menu for toggles.
</step>

<step name="interactive_menu">
Present settings menu:

```
## GSD Settings

**Current Configuration:**

Mode: [interactive | yolo]
Depth: [quick | standard | comprehensive]
Parallelization: [enabled | disabled]
Commit Docs: [true | false]
Model Profile: [quality | balanced | budget]

---

## Toggle Mode

/gsd:settings --mode [interactive|yolo]

## Set Depth

/gsd:settings --depth [quick|standard|comprehensive]

## Toggle Parallelization

/gsd:settings --parallelization [true|false]

## Toggle Commit Docs

/gsd:settings --commit-docs [true|false]

## Set Model Profile

/gsd:settings --profile [quality|balanced|budget]

---

What would you like to change?
```

Wait for user response.
</step>

<step name="apply_changes">
Apply selected setting using MCP tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-done/bin/gsd-tools.js config-set ${KEY} ${VALUE}`,
  timeout_ms: 10000
});
```

**Use MCP tool: mcp__desktop-commander__write_file** to update config.json

```javascript
await mcp__desktop-commander__write_file({
  path: ".planning/config.json",
  content: `[updated config JSON]`
});
```

Commit config changes:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-done/bin/gsd-tools.js commit "chore: update GSD settings" --files .planning/config.json`,
  timeout_ms: 10000
});
```

Confirm: "Settings updated. [Key]: [new value]"
</step>

<step name="model_profile_info">
If user wants to change model profile, show current assignments:

| Agent | Quality Profile | Balanced Profile | Budget Profile |
|-------|---------------|----------------|--------------|
| Researcher | Opus | Sonnet | Haiku |
| Synthesizer | Opus | Sonnet | Haiku |
| Roadmapper | Opus | Sonnet | Haiku |
| Planner | Opus | Sonnet | Sonnet |
| Plan Checker | Sonnet | Sonnet | Haiku |

Note: Quality = best performance, Budget = lowest cost.
</step>

</process>

<success_criteria>
- [ ] Current config loaded using MCP read_file
- [ ] User presented with settings menu
- [ ] Setting applied using MCP start_process and write_file
- [ ] Config committed using MCP start_process
- [ ] User informed of changes
- [ ] Model profile information provided if requested
</success_criteria>
