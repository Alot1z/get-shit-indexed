<thinking>auto</thinking>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "start_process"]
  priority: 1
  rationale: "Primary workflow for reading context, writing research results, and running analysis commands"
code_index:
  tools: ["search_code_advanced", "find_files"]
  priority: 2
  rationale: "Secondary use for searching codebase patterns and discovering relevant files"
tractatus_thinking:
  tools: ["tractatus_thinking"]
  priority: 2
  rationale: "Secondary use for concept decomposition and architecture analysis during research"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>Research how to implement a phase. Spawns GSI-phase-researcher with phase context.

Standalone research command. For most workflows, use `/GSI:plan-phase` which integrates research automatically.
</purpose>

<process>

## Step 0: Resolve Model Profile

@~/.claude/get-shit-indexed/references/model-profile-resolution.md

Resolve model for:
- `GSI-phase-researcher`

## Step 1: Normalize and Validate Phase

@~/.claude/get-shit-indexed/references/phase-argument-parsing.md

```bash
PHASE_INFO=$(node ~/.claude/get-shit-indexed/bin/GSI-tools.js roadmap get-phase "${PHASE}")
```

If `found` is false: Error and exit.

## Step 2: Check Existing Research

```bash
ls .planning/phases/${PHASE}-*/RESEARCH.md 2>/dev/null
```

If exists: Offer update/view/skip options.

## Step 3: Gather Phase Context

```bash
# Phase section from roadmap (already loaded in PHASE_INFO)
echo "$PHASE_INFO" | jq -r '.section'
cat .planning/REQUIREMENTS.md 2>/dev/null
cat .planning/phases/${PHASE}-*/*-CONTEXT.md 2>/dev/null
# Decisions from state-snapshot (structured JSON)
node ~/.claude/get-shit-indexed/bin/GSI-tools.js state-snapshot | jq '.decisions'
```

## Step 3.5: Apply Structural Analysis (for complex research)

**For complex research questions (multiple options, architectural decisions):**

**Use MCP tool: mcp__tractatus-thinking__tractatus_thinking**

```javascript
// Tractatus thinking for structural analysis
const analysis = await mcp__tractatus-thinking__tractatus_thinking({
  operation: "start",
  concept: "Analyze {research question} structure",
  depth_limit: 5,
  style: "analytical"
});

// Add propositions for each option/factor
await mcp__tractatus-thinking__tractatus_thinking({
  operation: "add",
  session_id: analysis.session_id,
  content: "{option A proposition}",
  is_atomic: false
});

await mcp__tractatus-thinking__tractatus_thinking({
  operation: "add",
  session_id: analysis.session_id,
  content: "{option B proposition}",
  is_atomic: false
});

// Navigate between propositions to find dependencies
await mcp__tractatus-thinking__tractatus_thinking({
  operation: "navigate",
  session_id: analysis.session_id,
  target: "child"
});

// Export findings to DISCOVERY.md
await mcp__tractatus-thinking__tractatus_thinking({
  operation: "export",
  session_id: analysis.session_id,
  format: "markdown"
});
```

**Integration Note**: Use tractatus (structure) → sequential (process) for complex research

## Step 4: Spawn Researcher

```
Task(
  prompt="<objective>
Research implementation approach for Phase {phase}: {name}
</objective>

<context>
Phase description: {description}
Requirements: {requirements}
Prior decisions: {decisions}
Phase context: {context_md}
</context>

<output>
Write to: .planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md
</output>",
  subagent_type="GSI-phase-researcher",
  model="{researcher_model}"
)
```

## Step 5: Handle Return

- `## RESEARCH COMPLETE` — Display summary, offer: Plan/Dig deeper/Review/Done
- `## CHECKPOINT REACHED` — Present to user, spawn continuation
- `## RESEARCH INCONCLUSIVE` — Show attempts, offer: Add context/Try different mode/Manual

</process>
