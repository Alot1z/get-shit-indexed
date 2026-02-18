---
name: claudeception
description: Self-improving knowledge extraction that creates skills, agents, logic, functions, and features from conversation patterns
allowed-tools:
  # Desktop Commander MCP - File operations
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__desktop-commander__start_search
  - mcp__desktop-commander__read_multiple_files
  # Code-Index MCP - Code analysis
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  # Thinking servers
  - mcp__sequential-thinking__sequentialthinking
  - mcp__tractatusthinking__tractatus_thinking
  - mcp__debug-thinking__debug_thinking
  # Task for subagents
  - Task
  - AskUserQuestion
thinking_phase:
  mode: COMPREHENSIVE
  servers: [sequential, tractatus, debug]
  bmad_enabled: true
  timeout: 15000
  rationale: "Claudeception requires sequential thinking for step planning, tractatus for structural analysis of patterns, and debug thinking for quality verification of extracted knowledge"
---

# GSI Claudeception

<objective>
Extract knowledge from conversations and codebase patterns to create reusable artifacts: skills, agents, logic functions, features, improvements, and ideas. Every successful pattern becomes building block for future sessions.
</objective>

<philosophy>
**Core Principle**: "Every time you use an AI coding agent, it starts from zero. You spend an hour debugging some obscure error, the agent figures it out, session ends. Next time you hit the same issue? Another hour. This command fixes that."

When Claude Code discovers something non-obvious (a debugging technique, a workaround, some project-specific pattern), it saves that knowledge. Next time a similar problem comes up, the knowledge gets loaded automatically.

**Quality Gates**: Be picky about what gets extracted. If something is:
- Just a documentation lookup → NO SKILL
- Only useful for this one case → NO SKILL  
- Hasn't actually been tested → NO SKILL

Ask: "Would this actually help someone who hits this problem in six months?" If not → NO SKILL.
</philosophy>

<artifact_types>
1. **SKILL** - Reusable workflow or pattern
2. **AGENT** - Autonomous worker with specific role
3. **LOGIC** - TypeScript/JavaScript function
4. **FEATURE** - GSI feature enhancement
5. **IMPROVEMENT** - Enhancement to existing code
6. **IDEA** - Visionary concept for future
</artifact_types>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
@C:/Users/mose/.claude/gsi-knowledge/
</context>

<process>

## Phase 1: ANALYZE (Tractatus - Structure Analysis)

First, understand what knowledge exists in the conversation or codebase.

### Step 1.1: Identify Extractable Patterns
```
Use Tractatus thinking to analyze:
- What patterns emerged in this session?
- What problems were solved?
- What techniques were discovered?
- What domain knowledge was applied?
```

### Step 1.2: Categorize Knowledge
Classify each pattern by:
- **Domain**: debugging, planning, coding, testing, deployment
- **Complexity**: simple, moderate, complex
- **Reusability**: specific, general, universal
- **Artifact Type**: which of 6 types fits best

### Step 1.3: Quality Assessment
For each pattern, ask:
- Is this tested/verified? (MUST BE YES)
- Is this more than just docs lookup? (MUST BE YES)
- Would this help in 6 months? (MUST BE YES)
- Is this project-specific or transferable? (PREFER TRANSFERABLE)

If any answer is NO, skip extraction.

## Phase 2: EXTRACT (Sequential - Step Processing)

### Step 2.1: Create Knowledge Artifact
Based on artifact type:

**For SKILL:**
```markdown
# [Pattern Name]

## Purpose
[What problem does this solve]

## Context
[When to use this]

## Process
1. [Step 1]
2. [Step 2]
...

## Examples
[Concrete usage examples]
```

**For AGENT:**
```yaml
---
name: [agent-name]
role: [what it does]
allowed-tools: [tool list]
thinking_phase: [config]
---
# [Agent instructions]
```

**For LOGIC/FUNCTION:**
```typescript
/**
 * [Function purpose]
 * @param {type} name - description
 * @returns {type} description
 */
export function functionName(params) {
  // Implementation
}
```

**For FEATURE:**
- Feature specification
- Implementation plan
- Integration points
- CLI commands needed

**For IMPROVEMENT:**
- Target file/function
- Current behavior
- Proposed change
- Impact assessment

**For IDEA:**
- Vision description
- Use cases
- Implementation considerations
- Dependencies

### Step 2.2: Store in Knowledge Base
```
Store artifacts in:
- ~/.claude/skills/ for skills
- ~/.claude/agents/ for agents
- ~/.claude/gsi-knowledge/ for patterns
- get-shit-indexed/lib/generated/ for logic
```

## Phase 3: GENERATE (Multi-Type Creation)

### Step 3.1: Check for Multi-Type Potential
One pattern can generate multiple artifacts:
- Debugging pattern → SKILL + AGENT + LOGIC
- Workflow pattern → SKILL + FEATURE
- Architecture pattern → IDEA + FEATURE

### Step 3.2: Generate All Applicable Types
For high-value patterns, create all useful artifact types.

### Step 3.3: Cross-Reference
Link related artifacts for discoverability.

## Phase 4: INTEGRATE (Debug - Verification)

### Step 4.1: Verify Generated Artifacts
- Syntax check
- Type check (for code)
- Reference validity
- Integration test

### Step 4.2: Add to GSI System
- Register skill in settings.json if applicable
- Add CLI command if feature
- Update documentation

### Step 4.3: Track Effectiveness
```
Store in debug-thinking graph:
- Pattern ID
- Extraction date
- Artifact types generated
- Effectiveness score (updated on use)
```

## Phase 5: LEARN (Continuous Improvement)

### Step 5.1: Track Usage
Monitor when generated artifacts are used:
- How often accessed?
- Did they help solve the problem?
- Any modifications needed?

### Step 5.2: Evolve Artifacts
Based on usage data:
- Enhance frequently used artifacts
- Deprecate unused ones
- Merge similar patterns
- Split overly broad ones

### Step 5.3: Feed Back to Extraction
Improve extraction based on:
- What types are most useful?
- What patterns are missed?
- What quality gates need adjustment?

</process>

<automatic_activation>
## Hook-Based Auto-Activation

Claudeception can run automatically via hooks:

### Session End Hook
After each session, analyze:
- What was accomplished?
- What patterns emerged?
- What knowledge was gained?

### Significant Event Hook
When notable events occur:
- Problem solved → Extract solution pattern
- Error encountered → Extract debugging approach
- Optimization found → Extract improvement

### Threshold-Based Extraction
Only extract when:
- Problem took >5 minutes to solve
- Solution is non-obvious
- Pattern is reusable

</automatic_activation>

<workflow_modules_integration>
## Integration with Workflow Modules

### knowledge-base Module
- Use `extract()` for pattern extraction
- Use `search()` to find similar patterns
- Use `generateSkill()` for skill creation

### thinking-orchestrator Module
- Use `analyzeCommand()` to determine thinking needs
- Use `think()` for cognitive enhancement

### workflow-chainer Module
- Create claudeception workflow templates
- Chain extraction → generation → integration

### patch-manager Module
- Backup before adding generated files
- Restore if integration fails
</workflow_modules_integration>

<examples>

### Example 1: Extract Debugging Pattern
```
User spent 30 mins debugging a TypeScript circular dependency.
Claudeception extracts:
- SKILL: typescript-circular-dependency-resolver
- LOGIC: detectCircularDeps() function
- AGENT: typescript-debugger with circular dep focus
```

### Example 2: Extract Workflow Pattern
```
User used: research → plan → execute → verify multiple times.
Claudeception extracts:
- SKILL: full-development-cycle
- FEATURE: Auto-suggest this workflow for complex tasks
- IDEA: Predictive workflow suggestion system
```

### Example 3: Extract Project Knowledge
```
User discovered project-specific patterns for GSI hooks.
Claudeception extracts:
- SKILL: gsi-hook-development
- IMPROVEMENT: Add to hook templates
- FEATURE: Hook testing framework
```

</examples>

<success_criteria>
- [ ] Patterns identified and categorized
- [ ] Quality gates applied
- [ ] Artifacts generated for applicable types
- [ ] Artifacts stored in correct locations
- [ ] Cross-references created
- [ ] Effectiveness tracking enabled
</success_criteria>

<cli_commands>
After integration, these commands become available:
- `gsi claudeception extract` - Extract from current session
- `gsi claudeception analyze <path>` - Analyze codebase for patterns
- `gsi claudeception generate <pattern-id> <type>` - Generate specific artifact
- `gsi claudeception status` - Show knowledge base stats
- `gsi claudeception learn` - Trigger learning from history
</cli_commands>
