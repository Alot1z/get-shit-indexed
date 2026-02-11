<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file"]
  priority: 1
  rationale: "Primary workflow for reading state and writing pause notes"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Create `.continue-here.md` handoff file to preserve complete work state across sessions. Enables seamless resumption with full context restoration.
</purpose>

<required_reading>
Read all files referenced by the invoking prompt's execution_context before starting.
</required_reading>

<process>

<step name="detect">
Find current phase directory from most recently modified files using MCP tools:

**Use MCP tool: mcp__code-index-mcp__find_files**

```javascript
// MCP-based equivalent for finding files (80-90% token savings vs bash ls)
const phaseDirs = await mcp__code-index-mcp__find_files({
  pattern: "*-PLAN.md",
  path: ".planning/phases"
});
```

If no active phase detected, ask user which phase they're pausing work on.
</step>

<step name="gather">
**Collect complete state for handoff:**

1. **Current position**: Which phase, which plan, which task
2. **Work completed**: What got done this session
3. **Work remaining**: What's left in current plan/phase
4. **Decisions made**: Key decisions and rationale
5. **Blockers/issues**: Anything stuck or concerning
6. **Mental context**: The approach, next steps, "vibe"
7. **Files modified**: What's changed but not committed
8. **Timestamps**: When each task completed

Ask user for clarifications if needed via conversational questions.
</step>

<step name="write">
**Write handoff to `.planning/phases/XX-name/.continue-here.md`:**

**Use MCP tool: mcp__desktop-commander__write_file**

```javascript
// MCP-based equivalent for file writing (80-90% token savings vs bash)
await mcp__desktop-commander__write_file({
  path: ".planning/phases/XX-name/.continue-here.md",
  content: `---
phase: XX-name
task: 3
total_tasks: 7
status: in_progress
last_updated: [timestamp from current-timestamp]

---

<current_state>
[Where exactly are we? Immediate context]
</current_state>

<completed_work>
- Task 1: [name] - Done
- Task 2: [name] - Done
- Task 3: [what's left] - In progress, [what's done]
</completed_work>

<remaining_work>
- Task 4: [what's left]
- Task 5: [what's left]
- Task 6: [what's left]
- Task 7: [what's left]
</remaining_work>

<decisions_made>
- Decided to use [X] because [reason]
- Chose [approach] over [alternative] because [rationale]
</decisions_made>

<blockers>
- [Blocker 1]: [status/workaround]
</blockers>

<context>
[Mental state, what were you thinking, plan]
</context>

<next_action>
Start with: [specific first action when resuming]
</next_action>

<timestamp>
${timestamp}
</timestamp>

---

Be specific enough for a fresh Claude to understand immediately.
```
</step>

<step name="commit">
**Commit handoff using MCP process tool:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-done/bin/gsd-tools.js commit "wip: ${phase-name} paused at task ${X}" --files .planning/phases/XX-name/.continue-here.md`,
  timeout_ms: 10000
});
```
</step>

<step name="confirm">
```
✓ Handoff created: .planning/phases/[XX-name]/.continue-here.md

Current state:

- Phase: [XX-name]
- Task: [X] of [Y]
- Status: [in_progress/blocked]
- Committed as WIP

To resume: /gsd:resume-work

```
</step>

</process>

<success_criteria>
- [ ] `.continue-here.md` created in correct phase directory
- [ ] All sections filled with specific content
- [ ] Handoff committed to git
- [ ] User knows location and how to resume
</success_criteria>
