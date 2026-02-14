# Phase 15: Thinking Server Enforcement - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Enforce thinking server usage BEFORE, DURING, and AFTER tool execution. Integrate 7-BMAD methodology with all three thinking servers (Sequential, Tractatus, Debug).

This phase enforces thinking — it does NOT add new thinking capabilities.

</domain>

<decisions>
## Implementation Decisions

### PreToolUse Thinking Hook
- Create mcp-thinking-enforcer.js hook
- Block action tools until thinking invoked (for complex operations)
- Threshold: 3+ tools → requires thinking first
- Exception: Simple single-file operations

### Thinking Server Selection
- Sequential: Multi-step planning, implementation tasks
- Tractatus: Structural analysis, architecture decisions
- Debug: Problem investigation, bug fixing

### 7-BMAD Integration
- Method → Sequential (implementation steps)
- Mad → Debug (integration debugging)
- Model → Tractatus (architecture analysis)
- Mode → Sequential (pattern selection)
- Mod → Tractatus (maintainability structure)
- Modd → Tractatus (extensibility logic)
- Methodd → Sequential (documentation flow)

### Workflow Thinking Sections
- Add <thinking_phase> to all workflows
- Define when to use which thinking server
- Checkpoint after thinking completes

### PostToolUse Verification
- Thinking verification checkpoint
- "Did this achieve the thinking goal?"
- Automatic reflection trigger

### Claude's Discretion
- Exact thinking thresholds per workflow
- Which thinking server for edge cases
- Reflection depth

</decisions>

<specifics>
## Specific Ideas

- "Force thinking BEFORE major operations — no skipping"
- "7-BMAD should map to specific thinking servers"
- "After completion, force reflection on results"

</specifics>

<deferred>
## Deferred Ideas

- Custom thinking patterns (separate phase)
- AI-generated thinking prompts (separate phase)

</deferred>

---

*Phase: 15-thinking-enforcement*
*Context gathered: 2026-02-15*
