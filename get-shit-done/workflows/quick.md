<thinking>auto</thinking>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "start_process"]
  priority: 1
  rationale: "Primary workflow for reading project files, writing quick outputs, and running status checks"
code_index:
  tools: ["find_files"]
  priority: 2
  rationale: "Secondary use for discovering project structure quickly"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Execute small, ad-hoc tasks with GSI guarantees (atomic commits, STATE.md tracking) while skipping optional agents (research, plan-checker, verifier). Quick mode lives in `.planning/quick/` separate from planned phases. Uses same executor and planner agents but streamlined flow.
</purpose>

<required_reading>
**Use MCP tools for reading state:**

- mcp__desktop-commander__read_file — Read STATE.md, config.json
- mcp__code-index-mcp__find_files — Check for existing quick tasks

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</required_reading>

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- mcp__desktop-commander__read_file — Read plan files
- mcp__desktop-commander__write_file — Write SUMMARY.md
- mcp__desktop-commander__list_directory — Check quick task directory

**Process Operations:**
- mcp__desktop-commander__start_process — Run GSI-tools.js commands

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</tool_requirements>

<process>

## 1. Get Task Description

Prompt user: "What do you want to do?"

Store as `$DESCRIPTION`.

**If empty:** Re-prompt with examples:
- Quick task examples
- Suggest using /GSI:progress to see pending todos

## 2. Initialize

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const INIT = await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-indexed/bin/GSI-tools.js init quick "${DESCRIPTION}"`,
  timeout_ms: 10000
});
```

Parse JSON for: `planner_model`, `executor_model`, `commit_docs`, `next_num`, `slug`, `date`, `timestamp`, `quick_dir`.

## 3. Create Quick Task Directory

**Use MCP tool: mcp__desktop-commander__create_directory**

```javascript
// MCP-based equivalent for mkdir (80-90% token savings vs bash)
await mcp__desktop-commander__create_directory({
  path: ".planning/quick/${next_num}-${slug}"
});
```

## 4. Spawn Planner (Quick Mode)

Spawn GSI-planner with quick mode context:

```
Task(
  subagent_type="GSI-planner",
  model="{planner_model}",
  description="Quick plan: ${DESCRIPTION}"
)
```

## 5. Create PLAN.md

Planner creates `.planning/quick/${next_num}-${slug}/00-PLAN.md`.

## 6. Spawn Executor

Execute the plan using GSI-executor.

## 7. Update STATE.md

**Use MCP tool: mcp__desktop-commander__edit_block** or **mcp__desktop-commander__start_process**

Update "Quick Tasks Completed" table with new entry.
</step>

</process>

<success_criteria>
- [ ] Task description obtained
- [ ] Quick task directory created using MCP create_directory
- [ ] Planner spawned with quick context
- [ ] PLAN.md created by planner
- [ ] Executor spawned and completed tasks
- [ ] STATE.md updated using MCP edit_block or start_process
- [ ] Changes committed using MCP start_process
- [ ] User knows what was accomplished
</success_criteria>
