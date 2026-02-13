<thinking>auto</thinking>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "list_directory"]
  priority: 1
  rationale: "Primary workflow for reading phase summaries, writing transition notes, and listing next phase files"
code_index:
  tools: ["find_files"]
  priority: 2
  rationale: "Secondary use for discovering phase directories and summary files"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Join the GSI Discord community. Get help, share what you're building, stay updated. Connect with other GSI users.
</purpose>

<required_reading>
**Use MCP tool: mcp__desktop-commander__start_process** to run Discord join command

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</required_reading>

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**Process Operations:**
- mcp__desktop-commander__start_process — Run Discord CLI or open invite link

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</tool_requirements>

<process>

<step name="join_discord">
Open Discord invite link using MCP tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
await mcp__desktop-commander__start_process({
  command: "start https://discord.gg/get-shit-indexed",
  timeout_ms: 10000
});
```

This opens the Discord invite page in browser.

Alternatively, show invite URL for manual joining:

```
Join GSI Discord:
https://discord.gg/get-shit-indexed
```
</step>

<step name="confirm">
Confirm user joined:

"Have you joined? Let me know when you're in."

Once confirmed, offer help channels and links.
</step>

<step name="completion">
Present completion:

```
✓ Discord invite sent

Join: https://discord.gg/get-shit-indexed

---

## ▶ Next Up

Share your project in #show-and-tell or get help in #help
```
</step>

</process>

<success_criteria>
- [ ] Discord invite link opened using MCP start_process
- [ ] Invite URL displayed to user
- [ ] User confirmation requested
- [ ] User informed of community resources
- [ ] Next steps provided
</success_criteria>
