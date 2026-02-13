<thinking>auto</thinking>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file"]
  priority: 1
  rationale: "Primary workflow for reading milestone plans and writing gap analysis"
code_index:
  tools: ["find_files"]
  priority: 2
  rationale: "Secondary use for discovering phase plans to analyze"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Create all phases necessary to close gaps identified by `/GSI:audit-milestone`. Reads MILESTONE-AUDIT.md, groups gaps into logical phases, creates phase entries in ROADMAP.md, and offers to plan each phase. One command creates all fix phases — no manual `/GSI:add-phase` per gap.
</purpose>

<required_reading>
Read all files referenced by the invoking prompt's execution_context before starting.

**Use MCP tool: mcp__desktop-commander__read_file**

```javascript
// MCP-based equivalent for reading audit file
const auditContent = await mcp__desktop-commander__read_file({
  path: ".planning/v*-MILESTONE-AUDIT.md"
});
```
</required_reading>

<process>

## 1. Load Audit Results

**Use MCP tool: mcp__desktop-commander__read_file**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const auditContent = await mcp__desktop-commander__read_file({
  path: ".planning/v*-MILESTONE-AUDIT.md"
});
```

Parse YAML frontmatter to extract structured gaps:
- `gaps.requirements` — unsatisfied requirements
- `gaps.integration` — missing cross-phase connections
- `gaps.flows` — broken E2E user flows

## 2. Prioritize Gaps

Group gaps by priority from REQUIREMENTS.md:

| Priority | Action |
|----------|--------|
| `must` | Create phase, blocks milestone |
| `should` | Create phase, recommended |
| `nice` | Ask user: include or defer |

For integration/flow gaps, infer priority from affected requirements.

## 3. Group Gaps into Phases

Cluster related gaps into logical phases using MCP search:

**Use MCP tool: mcp__code-index-mcp__search_code_advanced**

```javascript
// Search for patterns to group related gaps
const gapPatterns = await mcp__code-index-mcp__search_code_advanced({
  pattern: "(auth|dashboard|api)",
  file_pattern: "*-AUDIT.md",
  path: ".planning"
});
```

**Grouping rules:**
- Same affected phase → combine into one fix phase
- Same subsystem (auth, API, UI) → combine
- Dependency order (fix stubs before wiring) → sequence phases

**Example grouping:**
```
Gap: Auth token missing (DASH-01)
Gap: API calls don't include auth (DASH-01)
Gap: Dashboard can't fetch data (DASH-01)
→ Phase 6: "Wire Auth to API and Dashboard"
```

## 4. Determine Phase Numbers

**Use MCP tool: mcp__code-index-mcp__find_files**

```javascript
// Find existing phases to determine next numbers
const existingPhases = await mcp__code-index-mcp__find_files({
  pattern: "*-PLAN.md",
  path: ".planning/phases"
});
```

Find highest existing phase number. Continue from there.

## 5. Present Gap Closure Plan

Display markdown showing proposed phases:

```
## Gap Closure Plan

**Milestone:** {version}
**Gaps:** {N} requirements, {M} integration, {K} flows

### Proposed Phases

**Phase {N}: {Name}**
Closes:
- {REQ-ID}: {description} (requirement gap)
- Integration: {from} → {to} (integration gap)
- Flow: {flow name} (flow gap)

Tasks: {count estimated}

[Next phase...]
```

## 6. Update ROADMAP.md

**Use MCP tool: mcp__desktop-commander__edit_block**

```javascript
// MCP-based equivalent for editing files
await mcp__desktop-commander__edit_block({
  file_path: ".planning/ROADMAP.md",
  old_string: "[existing roadmap section before gaps]",
  new_string: "[new roadmap section with gap phases]"
});
```

Add new phase entries after current milestone with `(GAP CLOSURE)` marker.

## 7. Create Phase Directories

**Use MCP tool: mcp__desktop-commander__create_directory**

```javascript
// MCP-based equivalent for mkdir (80-90% token savings vs bash)
await mcp__desktop-commander__create_directory({
  path: ".planning/phases/{NN}-{slug}"
});
```

Create one directory per gap closure phase.

## 8. Commit Roadmap Update

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-indexed/bin/GSI-tools.js commit "docs(roadmap): add gap closure phases" --files .planning/ROADMAP.md`,
  timeout_ms: 10000
});
```

## 9. Offer Next Steps

```
✓ Gap closure phases created

## ▶ Next Up

**Plan first gap closure phase**

`/GSI:plan-phase {N}`

<sub>`/clear` first → fresh context window</sub>

---

**Also available:**
- Review roadmap: Use MCP read tool to view .planning/ROADMAP.md
- `/GSI:execute-phase {N}` — if plans already exist
```
</step>

</process>

<success_criteria>
- [ ] MILESTONE-AUDIT.md loaded using MCP read_file
- [ ] Gaps parsed and prioritized
- [ ] Gaps grouped into logical phases
- [ ] Phase numbers determined using MCP find_files
- [ ] Gap closure plan presented with phases, tasks, requirements
- [ ] ROADMAP.md updated using MCP edit_block
- [ ] Phase directories created using MCP create_directory
- [ ] Roadmap committed using MCP start_process
- [ ] User informed of next steps
</success_criteria>
