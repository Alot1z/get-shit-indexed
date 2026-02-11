<purpose>
Quick switch model profile for GSD agents without navigating full settings menu. Direct command: `/gsd:set-profile [quality|balanced|budget]` sets all agents at once.
</purpose>

<required_reading>
**Use MCP tool: mcp__desktop-commander__start_process** to run profile switch command

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</required_reading>

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**Process Operations:**
- mcp__desktop-commander__start_process — Run gsd-tools.js config-set command

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</tool_requirements>

<process>

<step name="apply_profile">
Switch model profile using MCP tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-done/bin/gsd-tools.js config-set workflow.model_profile ${PROFILE}`,
  timeout_ms: 10000
});
```

Valid profiles: `quality` (Opus for most agents), `balanced` (Sonnet for planning/execution, Opus for others), `budget` (Haiku where possible).

Commit config changes:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-done/bin/gsd-tools.js commit "chore: switch model profile to ${PROFILE}" --files .planning/config.json`,
  timeout_ms: 10000
});
```
</step>

<step name="confirm">
Confirm profile switch:

```
✓ Model profile switched to: ${PROFILE}

Current assignments:
- Researcher: [model]
- Synthesizer: [model]
- Roadmapper: [model]
- Planner: [model]
- Plan Checker: [model]
- Executor: [model]
- Verifier: [model]

Run /gsd:settings to see full configuration or /gsd:set-profile to change again.
```
</step>

</process>

<success_criteria>
- [ ] Model profile switched using MCP start_process
- [ ] Config committed using MCP start_process
- [ ] User confirmed with new agent assignments
</success_criteria>
