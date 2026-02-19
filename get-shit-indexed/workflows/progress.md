<thinking>auto</thinking>

<purpose>
Check project progress, summarize recent work and what's ahead, then intelligently route to next action — either executing an existing plan or creating a next one. Provides situational awareness before continuing work.
</purpose>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "start_process"]
  priority: 1
  rationale: "Primary workflow for reading state/roadmap, writing summaries, and running status commands"
code_index:
  tools: ["find_files", "get_file_summary"]
  priority: 2
  rationale: "Secondary use for listing phase directories and getting file metadata"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<required_reading>
**Use MCP tools to read project state:**

- mcp__desktop-commander__read_file — Read STATE.md, ROADMAP.md
- mcp__code-index-mcp__find_files — List phase directories
- mcp__code-index-mcp__get_file_summary — Get file metadata

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</required_reading>

<process>

<step name="init_context">
Load progress context using MCP tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const INIT = await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-indexed/bin/GSI-tools.js init progress --include state,roadmap,project,config`,
  timeout_ms: 10000
});
```

Extract JSON: `project_exists`, `roadmap_exists`, `state_exists`, `phases`, `current_phase`, `next_phase`, `milestone_version`, `completed_count`, `phase_count`, `paused_at`.
</step>

<step name="analyze_roadmap">
**Use MCP tool: mcp__code-index-mcp__search_code_advanced** or **mcp__desktop-commander__read_file**

```javascript
// MCP-based equivalent for roadmap analysis
const roadmap = await mcp__desktop-commander__read_file({
  path: ".planning/ROADMAP.md"
});

// Or use search for pattern matching
```

Parse roadmap structure:
- Current phase number
- Next phase number
- Phase names and goals
- Milestone boundaries

**If roadmap missing:** Error — run `/GSI:new-project` first.
</step>

<step name="recent">
**Gather recent work context:**

**Use MCP tool: mcp__code-index-mcp__find_files** and **mcp__desktop-commander__read_file**

```javascript
// MCP-based equivalent for finding and reading summary files
const summaryFiles = await mcp__code-index-mcp__find_files({
  pattern: "*-SUMMARY.md",
  path: ".planning/phases"
});

// Read last 2-3 summaries for recent work
```

Extract:
- What was built (one-liners)
- Any notable deviations or issues
- Completion timestamps
</step>

<step name="position">
**Parse current position from init context and roadmap:**

- Are we in a phase? What number?
- Is there a next phase?
- Are we at milestone completion?

Determine smart routing based on state.
</step>

<step name="report">
**Generate rich status report:**

```
# [Project Name]

**Progress:** [visual progress bar from init]

## Current Position
Phase [N]: [Name]
[Status: In Progress / Complete / Not Started]

## Recent Work
[Last 2-3 phase summaries]

## What's Ahead
Phase [N+1]: [Name]

## Key Decisions
[From STATE.md decisions table]

## Pending Todos
[Count pending - use /GSI:check-todos]

## Blockers/Concerns
[Any open issues]

---

## ▶ Next Up
[Smart routing suggestion]
```
</step>

<step name="route">
**Smart routing based on state:**

| Condition | Route | Action |
|-----------|--------|--------|
| Phase complete + no next phase | Suggest `/GSI:complete-milestone` | Archive milestone, start next cycle |
| Phase in progress + plans exist | Suggest `/GSI:execute-phase {N}` | Continue current phase |
| Phase in progress + no plans | Suggest `/GSI:plan-phase {N}` | Create execution plans |
| No phase active | Suggest `/GSI:discuss-phase {N}` | Gather context before planning |
| Paused phase | Suggest `/GSI:resume-work` | Continue where left off |
| Pending todos exist | Suggest `/GSI:check-todos` | Review and work on todos |

Present the routed action clearly.
</step>

</process>

<success_criteria>
- [ ] Progress context loaded using MCP start_process
- [ ] Roadmap analyzed using MCP read_file or search_code_advanced
- [ ] Recent summaries found using MCP find_files
- [ ] Current position determined
- [ ] Rich status report displayed with progress bar
- [ ] Smart routing suggestion provided
- [ ] User knows next actions
</success_criteria>
