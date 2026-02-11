<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "start_process"]
  priority: 1
  rationale: "Primary workflow for reading state, writing updates, and running upgrade commands"
code_index:
  tools: ["find_files"]
  priority: 2
  rationale: "Secondary use for discovering workflow and template files during update"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Update GSD to latest version and show changelog preview. Checks installed vs latest version comparison and displays changelog entries for versions user may have missed. Better than raw `npx get-shit-done-cc@latest` — has intelligent checks and confirmation.
</purpose>

<required_reading>
**Use MCP tool: mcp__desktop-commander__start_process** to check version and run update

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</required_reading>

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**Process Operations:**
- mcp__desktop-commander__start_process — Run gsd-tools.js update and install commands

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</tool_requirements>

<process>

<step name="check_version">
Check installed and latest versions using MCP tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const versionInfo = await mcp__desktop-commander__start_process({
  command: "npm show get-shit-done version && npm view get-shit-done dist/tags",
  timeout_ms: 15000
});
```

Parse versions:
- `installed`: Current version in package.json
- `latest`: Latest from npm registry

If installed is latest: Already up to date.

If out of date: Show preview of changelogs and confirm update.
</step>

<step name="fetch_changelog">
If out of date, fetch changelog using MCP tools:

**Use MCP tool: mcp__rag-web-browser__search** or **mcp__web_reader__webReader**

```javascript
// MCP-based web search for changelog
const changelog = await mcp__rag-web-browser__search({
  query: "get-shit-done changelog ${installed}..${latest}",
  maxResults: 10
});

// Or use web reader
const changelog = await mcp__web_reader__webReader({
  url: "https://github.com/glittercowboy/get-shit-done/blob/main/CHANGELOG.md",
  returnFormat: "markdown"
});
```

## 3. Preview Changes

Display key changes between versions:

```
## Changes Since [Installed Version]

[Browse full changelogs at https://github.com/glittercowboy/get-shit-done/commits/main]

### Added
- [Feature 1]
- [Feature 2]

### Changed
- [Breaking change 1]
- [Improvement 1]

### Fixed
- [Bug fix 1]
- [Bug fix 2]
```
</step>

<step name="confirm_update">
Ask user confirmation:

```
Update from ${installed} to ${latest}?
[y] - Download and install
[n] - Skip for now

Run /gsd:update anytime to check again.
```

**If yes:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash npm install)
await mcp__desktop-commander__start_process({
  command: "npx get-shit-done-cc@latest",
  timeout_ms: 120000
});
```

Confirm: "Updated to ${latest}"

**If no:**
Note that future `/gsd:progress` checks will continue showing out of date status.
</step>

<step name="completion">
Present completion:

```
✓ Version check complete

Installed: ${installed}
Latest: ${latest}

Status: [Up to date / Update available]

---

## ▶ Next Up

`/gsd:progress` — Check project status
```
</step>

</process>

<success_criteria>
- [ ] Version check completed using MCP start_process
- [ ] Changelog fetched using MCP web search tools
- [ ] Changes preview displayed to user
- [ ] User confirmation obtained
- [ ] Update installed using MCP start_process if confirmed
- [ ] User informed of current status
- [ ] Next steps provided
</success_criteria>
