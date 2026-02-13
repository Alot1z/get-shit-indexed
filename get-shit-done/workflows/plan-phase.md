<purpose>
Create executable phase prompts (PLAN.md files) for a roadmap phase with integrated research and verification. Default flow: Research (if needed) -> Plan -> Verify -> Done. Orchestrates gsd-phase-researcher, gsd-planner, and gsd-plan-checker agents with a revision loop (max 3 iterations).
</purpose>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "list_directory", "create_directory"]
  priority: 1
  rationale: "Primary workflow for reading context files, writing plan documents, and managing planning directory structure"
code_index:
  tools: ["search_code_advanced", "find_files", "get_file_summary"]
  priority: 1
  rationale: "Co-primary workflow for searching existing plans, discovering files, and getting file metadata during planning"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<required_reading>
**Use MCP tools for reading files:**

- mcp__desktop-commander__read_file — Read STATE.md, ROADMAP.md, CONTEXT.md
- mcp__code-index-mcp__search_code_advanced — Search for patterns across planning files
- mcp__code-index-mcp__get_file_summary — Get file metadata and structure

**Use MCP tool: mcp__context7__resolve-library-id and mcp__context7__get-library-docs** for library research

**Use MCP tool: mcp__sequential-thinking__sequentialthinking** for complex planning:
- Multi-step problem decomposition (3-7 thoughts typical)
- Planning with room for revision (isRevision parameter)
- Hypothesis generation and verification

**Use MCP tool: mcp__tractatus-thinking__tractatus_thinking** for logical structure analysis:
- Concept decomposition into atomic propositions
- Architecture analysis before planning
- Verification of structural completeness
- Export to markdown/graphviz for documentation

@~/.claude/get-shit-done/references/ui-brand.md
</required_reading>

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- Use `mcp__desktop-commander__read_file` instead of Read
- Use `mcp__desktop-commander__write_file` instead of Write
- Use `mcp__desktop-commander__edit_block` instead of Edit
- Use `mcp__desktop-commander__list_directory` instead of ls
- Use `mcp__desktop-commander__create_directory` instead of mkdir

**Code Search:**
- Use `mcp__code-index-mcp__search_code_advanced` instead of Grep
- Use `mcp__code-index-mcp__find_files` instead of find
- Use `mcp__code-index-mcp__get_file_summary` for file analysis

**External Research:**
- Use `mcp__rag-web-browser__search` for web searches instead of native search
- Use `mcp__context7__resolve-library-id` and `mcp__context7__get-library-docs` for library documentation

**Process Operations:**
- Use `mcp__desktop-commander__start_process` instead of Bash for commands
- Use `mcp__desktop-commander__interact_with_process` for interactive processes

Token savings: 80-90% per MCP-TOKEN-BENCHMARK.md
</tool_requirements>

<process>

## 1. Initialize

Load all context in one call using MCP tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```bash
# MCP-based equivalent (80-90% token savings vs bash)
INIT=$(node ~/.claude/get-shit-done/bin/gsd-tools.js init plan-phase "$PHASE" --include state,roadmap,requirements,context,research,verification,uat,config)
```

Parse JSON for all file contents and settings.

**If `.planning/` missing:** Error — run `/gsd:new-project` first.

## 2. Parse and Normalize Arguments

Extract from $ARGUMENTS: phase number (integer or decimal like `2.1`), flags (`--research`, `--skip-research`, `--gaps`, `--skip-verify`).

## 3. Validate Phase

**Use MCP tool: mcp__code-index-mcp__search_code_advanced**

```bash
# MCP-based equivalent for validating phase in roadmap
PHASE_INFO=$(node ~/.claude/get-shit-done/bin/gsd-tools.js roadmap get-phase "${PHASE}")
```

If phase not found in ROADMAP.md: Error.

## 4. Load CONTEXT.md (if exists)

**Use MCP tool: mcp__desktop-commander__read_file**

```javascript
const contextContent = await mcp__desktop-commander__read_file({
  path: ".planning/phases/XX-name/CONTEXT.md"
});
```

## 5. Handle Research

**If `--skip-research` flag:** Skip to step 6.

**Use MCP tools: mcp__context7__resolve-library-id and mcp__context7__get-library-docs**

```javascript
// MCP-based library research (80-90% token savings vs bash)
const libId = await mcp__context7__resolve-library-id({ libraryName: "[library]" });
const docs = await mcp__context7__get-library-docs({
  context7CompatibleLibraryID: libId,
  topic: "[specific topic]",
  mode: "code" // for API reference, "info" for conceptual
});
```

## 5.5. Apply Sequential Thinking (for complex phases)

**For complex phases (5+ plans or architectural decisions):**

**Use MCP tool: mcp__sequential-thinking__sequentialthinking**

```javascript
// Sequential thinking for multi-step problem decomposition
const thoughts = [
  {
    thought: "Analyze phase requirements and identify key components",
    nextThoughtNeeded: true,
    thoughtNumber: 1,
    totalThoughts: 5
  },
  {
    thought: "Break down phase into logical plan sequence",
    nextThoughtNeeded: true,
    thoughtNumber: 2,
    totalThoughts: 5
  },
  {
    thought: "Identify dependencies between plans",
    nextThoughtNeeded: true,
    thoughtNumber: 3,
    totalThoughts: 5
  },
  {
    thought: "Generate task breakdown for each plan",
    nextThoughtNeeded: true,
    thoughtNumber: 4,
    totalThoughts: 5
  },
  {
    thought: "Hypothesis: Phase structure complete with all dependencies mapped",
    nextThoughtNeeded: false,
    thoughtNumber: 5,
    totalThoughts: 5
  }
];
```

**For architectural decisions, also apply tractatus thinking:**

**Use MCP tool: mcp__tractatus-thinking__tractatus_thinking**

```javascript
// Tractatus thinking for structural analysis
const analysis = await mcp__tractatus-thinking__tractatus_thinking({
  operation: "start",
  concept: "Analyze architecture for {phase goal}",
  depth_limit: 5,
  style: "analytical"
});

// Add propositions for key decisions
await mcp__tractatus-thinking__tractatus_thinking({
  operation: "add",
  session_id: analysis.session_id,
  content: "{architectural decision proposition}",
  parent_number: null,
  is_atomic: false
});

// Verify completeness
await mcp__tractatus-thinking__tractatus_thinking({
  operation: "analyze",
  session_id: analysis.session_id
});

// Export to markdown for reference
await mcp__tractatus-thinking__tractatus_thinking({
  operation: "export",
  session_id: analysis.session_id,
  format: "markdown"
});
```

## 6. Spawn gsd-phase-researcher

Researcher uses CONTEXT.md + downstream consumer requirements to create DISCOVERY.md.

**Use MCP tool: mcp__desktop-commander__write_file**

```javascript
// MCP-based for writing discovery output
await mcp__desktop-commander__write_file({
  path: ".planning/phases/XX-name/DISCOVERY.md",
  content: `[discovery content]`
});
```

## 7. Spawn gsd-planner

Planner uses DISCOVERY.md + requirements + ROADMAP to create PLAN.md.

**Use MCP tool: mcp__code-index-mcp__search_code_advanced**

```bash
# MCP-based equivalent for reading existing plans
ls .planning/phases/XX-name/*-PLAN.md 2>/dev/null
```

## 8. Verify, Revise, Present

Run up to 3 revision iterations checking for quality issues.

**Use MCP tool: mcp__code-index-mcp__get_file_summary**

```javascript
// MCP-based equivalent for checking file structure
const planInfo = await mcp__code-index-mcp__get_file_summary({
  file_path: ".planning/phases/XX-name/XX-YY-PLAN.md"
});
```

## 9. Create PLAN.md

**Use MCP tool: mcp__desktop-commander__write_file**

```javascript
await mcp__desktop-commander__write_file({
  path: ".planning/phases/XX-name/XX-YY-PLAN.md",
  content: `[plan content with frontmatter, tasks, verification, success criteria]`
});
```
</step>

</process>

<success_criteria>
- [ ] Phase validated against roadmap
- [ ] All context files loaded using MCP tools
- [ ] DISCOVERY.md created using MCP write_file (if research ran)
- [ ] Existing plans checked using MCP search_code_advanced
- [ ] PLAN.md created with valid frontmatter and tasks
- [ ] Plan verified, revised (max 3 iterations)
- [ ] User presented with actionable next steps
</success_criteria>
