<documents>
<document index="1">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\add-phase.md</source>
<document_content>
﻿---
name: gsi:add-phase
description: Add phase to end of current milestone in roadmap
argument-hint: <description>
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
---

<objective>
Add a new integer phase to the end of the current milestone in the roadmap.

Routes to the add-phase workflow which handles:
- Phase number calculation (next sequential integer)
- Directory creation with slug generation
- Roadmap structure updates
- STATE.md roadmap evolution tracking
</objective>

<execution_context>
@.planning/ROADMAP.md
@.planning/STATE.md
@~/.claude/get-shit-indexed/workflows/add-phase.md
</execution_context>

<process>
**Follow the add-phase workflow** from `@~/.claude/get-shit-indexed/workflows/add-phase.md`.

The workflow handles all logic including:
1. Argument parsing and validation
2. Roadmap existence checking
3. Current milestone identification
4. Next phase number calculation (ignoring decimals)
5. Slug generation from description
6. Phase directory creation
7. Roadmap entry insertion
8. STATE.md updates
</process>

<code_index_mcp>
**Priority: MEDIUM** - Support for phase integration analysis

**CI Tools Integration:**
- `search_code_advanced`: Find existing phase patterns for consistency
- `find_files`: Locate related phase documents for context
- `get_file_summary`: Understand neighboring phase structure
- `get_symbol_body`: Extract phase implementation patterns

**Usage Context:**
When adding new phases:
- Check for naming pattern consistency with existing phases
- Understand related work in neighboring phases
- Identify integration points with existing work
- Reference established patterns from similar phases

**Token Savings:** ~65% vs manual phase analysis for integration planning
</code_index_mcp>

</document_content>
</document>
<document index="2">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\add-todo.md</source>
<document_content>
﻿---
name: gsi:add-todo
description: Capture idea or task as todo from current conversation context
argument-hint: [optional description]
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - Task
---

<objective>
Capture an idea, task, or issue that surfaces during a GSI session as a structured todo for later work.

Routes to the add-todo workflow which handles:
- Directory structure creation
- Content extraction from arguments or conversation
- Area inference from file paths
- Duplicate detection and resolution
- Todo file creation with frontmatter
- STATE.md updates
- Git commits
</objective>

<execution_context>
@.planning/STATE.md
@~/.claude/get-shit-indexed/workflows/add-todo.md
</execution_context>

<process>
**Follow the add-todo workflow** from `@~/.claude/get-shit-indexed/workflows/add-todo.md`.

The workflow handles all logic including:
1. Directory ensuring
2. Existing area checking
3. Content extraction (arguments or conversation)
4. Area inference
5. Duplicate checking
6. File creation with slug generation
7. STATE.md updates
8. Git commits
</process>

</document_content>
</document>
<document index="3">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\audit-milestone.md</source>
<document_content>
﻿---
name: gsi:audit-milestone
description: Audit milestone completion against original intent before archiving
argument-hint: "[version]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - Task
---
<objective>
Verify milestone achieved its definition of done. Check requirements coverage, cross-phase integration, and end-to-end flows.

**This command IS the orchestrator.** Reads existing VERIFICATION.md files (phases already verified during execute-phase), aggregates tech debt and deferred gaps, then spawns integration checker for cross-phase wiring.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/audit-milestone.md
</execution_context>

<context>
Version: $ARGUMENTS (optional — defaults to current milestone)

**Original Intent:**
@.planning/PROJECT.md
@.planning/REQUIREMENTS.md

**Planned Work:**
@.planning/ROADMAP.md
@.planning/config.json (if exists)

**Completed Work:**
Glob: .planning/phases/*/*-SUMMARY.md
Glob: .planning/phases/*/*-VERIFICATION.md
</context>

<process>
Execute the audit-milestone workflow from @~/.claude/get-shit-indexed/workflows/audit-milestone.md end-to-end.
Preserve all workflow gates (scope determination, verification reading, integration check, requirements coverage, routing).
</process>

</document_content>
</document>
<document index="4">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\check-todos.md</source>
<document_content>
﻿---
name: gsi:check-todos
description: List pending todos and select one to work on
argument-hint: [area filter]
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - Task
---

<objective>
List all pending todos, allow selection, load full context for the selected todo, and route to appropriate action.

Routes to the check-todos workflow which handles:
- Todo counting and listing with area filtering
- Interactive selection with full context loading
- Roadmap correlation checking
- Action routing (work now, add to phase, brainstorm, create phase)
- STATE.md updates and git commits
</objective>

<execution_context>
@.planning/STATE.md
@.planning/ROADMAP.md
@~/.claude/get-shit-indexed/workflows/check-todos.md
</execution_context>

<process>
**Follow the check-todos workflow** from `@~/.claude/get-shit-indexed/workflows/check-todos.md`.

The workflow handles all logic including:
1. Todo existence checking
2. Area filtering
3. Interactive listing and selection
4. Full context loading with file summaries
5. Roadmap correlation checking
6. Action offering and execution
7. STATE.md updates
8. Git commits
</process>

<code_index_mcp>
**Priority: HIGH** - Direct CI usage for todo file processing

**CI Tools Integration:**
- `search_code_advanced`: Find todos across project by keywords or patterns
- `find_files`: Discover todo files in specific directories or areas
- `get_file_summary`: Quickly understand todo file structure before reading

**Usage Context:**
When checking todos, CI tools help:
- Locate todo files without manual directory traversal
- Search for specific todo content across all files
- Get summaries of todo files before full reads
- Filter todos by technical patterns (e.g., "bug", "feature", "refactor")

**Token Savings:** ~70% vs manual file operations for todo discovery
</code_index_mcp>

</document_content>
</document>
<document index="5">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\claudeception.md</source>
<document_content>
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
@lib/knowledge-base/
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

</document_content>
</document>
<document index="6">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\commands.md</source>
<document_content>

</document_content>
</document>
<document index="7">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\complete-milestone.md</source>
<document_content>
﻿---
type: prompt
name: gsi:complete-milestone
description: Archive completed milestone and prepare for next version
argument-hint: <version>
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
---

<objective>
Mark milestone {{version}} complete, archive to milestones/, and update ROADMAP.md and REQUIREMENTS.md.

Purpose: Create historical record of shipped version, archive milestone artifacts (roadmap + requirements), and prepare for next milestone.
Output: Milestone archived (roadmap + requirements), PROJECT.md evolved, git tagged.
</objective>

<execution_context>
**Load these files NOW (before proceeding):**

- @~/.claude/get-shit-indexed/workflows/complete-milestone.md (main workflow)
- @~/.claude/get-shit-indexed/templates/milestone-archive.md (archive template)
  </execution_context>

<context>
**Project files:**
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/PROJECT.md`

**User input:**

- Version: {{version}} (e.g., "1.0", "1.1", "2.0")
  </context>

<process>

**Follow complete-milestone.md workflow:**

0. **Check for audit:**

   - Look for `.planning/v{{version}}-MILESTONE-AUDIT.md`
   - If missing or stale: recommend `/gsi:audit-milestone` first
   - If audit status is `gaps_found`: recommend `/gsi:plan-milestone-gaps` first
   - If audit status is `passed`: proceed to step 1

   ```markdown
   ## Pre-flight Check

   {If no v{{version}}-MILESTONE-AUDIT.md:}
   ⚠ No milestone audit found. Run `/gsi:audit-milestone` first to verify
   requirements coverage, cross-phase integration, and E2E flows.

   {If audit has gaps:}
   ⚠ Milestone audit found gaps. Run `/gsi:plan-milestone-gaps` to create
   phases that close the gaps, or proceed anyway to accept as tech debt.

   {If audit passed:}
   ✓ Milestone audit passed. Proceeding with completion.
   ```

1. **Verify readiness:**

   - Check all phases in milestone have completed plans (SUMMARY.md exists)
   - Present milestone scope and stats
   - Wait for confirmation

2. **Gather stats:**

   - Count phases, plans, tasks
   - Calculate git range, file changes, LOC
   - Extract timeline from git log
   - Present summary, confirm

3. **Extract accomplishments:**

   - Read all phase SUMMARY.md files in milestone range
   - Extract 4-6 key accomplishments
   - Present for approval

**CI Tools Usage:**
- `find_files`: Locate all SUMMARY.md files in milestone range
- `get_file_summary`: Extract accomplishment sections without reading full files
- `search_code_advanced`: Find key achievement patterns across summaries

4. **Archive milestone:**

   - Create `.planning/milestones/v{{version}}-ROADMAP.md`
   - Extract full phase details from ROADMAP.md
   - Fill milestone-archive.md template
   - Update ROADMAP.md to one-line summary with link

5. **Archive requirements:**

   - Create `.planning/milestones/v{{version}}-REQUIREMENTS.md`
   - Mark all v1 requirements as complete (checkboxes checked)
   - Note requirement outcomes (validated, adjusted, dropped)
   - Delete `.planning/REQUIREMENTS.md` (fresh one created for next milestone)

6. **Update PROJECT.md:**

   - Add "Current State" section with shipped version
   - Add "Next Milestone Goals" section
   - Archive previous content in `<details>` (if v1.1+)

7. **Commit and tag:**

   - Stage: MILESTONES.md, PROJECT.md, ROADMAP.md, STATE.md, archive files
   - Commit: `chore: archive v{{version}} milestone`
   - Tag: `git tag -a v{{version}} -m "[milestone summary]"`
   - Ask about pushing tag

8. **Offer next steps:**
   - `/gsi:new-milestone` — start next milestone (questioning → research → requirements → roadmap)

</process>

<success_criteria>

- Milestone archived to `.planning/milestones/v{{version}}-ROADMAP.md`
- Requirements archived to `.planning/milestones/v{{version}}-REQUIREMENTS.md`
- `.planning/REQUIREMENTS.md` deleted (fresh for next milestone)
- ROADMAP.md collapsed to one-line entry
- PROJECT.md updated with current state
- Git tag v{{version}} created
- Commit successful
- User knows next steps (including need for fresh requirements)
  </success_criteria>

<critical_rules>

- **Load workflow first:** Read complete-milestone.md before executing
- **Verify completion:** All phases must have SUMMARY.md files
- **User confirmation:** Wait for approval at verification gates
- **Archive before deleting:** Always create archive files before updating/deleting originals
- **One-line summary:** Collapsed milestone in ROADMAP.md should be single line with link
- **Context efficiency:** Archive keeps ROADMAP.md and REQUIREMENTS.md constant size per milestone
- **Fresh requirements:** Next milestone starts with `/gsi:new-milestone` which includes requirements definition
  </critical_rules>

</document_content>
</document>
<document index="8">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\debug.md</source>
<document_content>
---
name: gsi:debug
description: Systematic debugging with persistent state across context resets
argument-hint: [issue description]
allowed-tools:
  # Desktop Commander MCP - File operations
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__create_directory
  - mcp__desktop-commander__start_process
  - mcp__desktop-commander__read_process_output
  - mcp__desktop-commander__interact_with_process
  # Code-Index MCP - Code analysis
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - mcp__code-index-mcp__build_deep_index
  # Thinking servers
  - mcp__debug-thinking__debug_thinking
  - mcp__sequential-thinking__sequentialthinking
  - mcp__tractatusthinking__tractatus_thinking
  # Other tools
  - Task
  - AskUserQuestion
  - Bash
thinking_phase:
  mode: COMPREHENSIVE
  servers: [debug, sequential, tractatus]
  bmad_enabled: true
  timeout: 20000
  rationale: "Debugging requires debug-thinking for systematic hypothesis testing and knowledge persistence, sequential for investigation step planning, and tractatus for root cause structural analysis"
---

<!--
CI Tools Usage:
- search_code_advanced: Find code patterns for error sources
- find_files: Discover relevant files
- get_file_summary: Understand file context
- get_symbol_body: Inspect problematic functions and trace relationships
- build_deep_index: Fresh symbol extraction

Debug-thinking Usage:
- create: Record problems, hypotheses, experiments, solutions
- connect: Link evidence to hypotheses
- query: Find similar problems from history
-->

<objective>
Debug issues using scientific method with subagent isolation and persistent knowledge graph.

**Orchestrator role:** Gather symptoms, query history for similar issues, spawn GSI-debugger agent, handle checkpoints, spawn continuations, capture learnings.

**Why subagent:** Investigation burns context fast (reading files, forming hypotheses, testing). Fresh 200k context per investigation. Main context stays lean for user interaction.

**Knowledge persistence:** Debug-thinking MCP stores patterns across sessions (~/.debug-thinking-mcp/)
</objective>

<context>
User's issue: $ARGUMENTS

Check for active sessions:
```bash
ls .planning/debug/*.md 2>/dev/null | grep -v resolved | head -5
```
</context>

<process>

## 0. Initialize Context

### Thinking Phase: Pre-Workflow

<server>debug</server>
<prompt>Analyze the debugging context:
1. What type of issue might this be based on the description?
2. What investigation strategies typically work for this type?
3. What information gaps need to be filled?</prompt>
<expected_output>Debug strategy with investigation priorities</expected_output>
<timeout>5000</timeout>

Load state and resolve debugger model:
```bash
INIT=$(node ~/.claude/get-shit-indexed/bin/GSI-tools.js state load)
```

Extract `commit_docs` from init JSON. Resolve debugger model:
```bash
DEBUGGER_MODEL=$(node ~/.claude/get-shit-indexed/bin/GSI-tools.js resolve-model GSI-debugger --raw)
```

Query debug-thinking for similar problems:
```
action: query
queryType: similar-problems
parameters: {pattern: "$ARGUMENTS", limit: 3, minSimilarity: 0.5}
```

If similar issues found, present them:
```markdown
## Similar Issues Found

| # | Issue | Solution | Similarity |
|---|-------|----------|------------|
| 1 | {issue} | {solution} | {similarity}% |

Would you like to:
- Continue with new investigation
- Review similar issue solution first
```

## 1. Check Active Sessions

If active sessions exist AND no $ARGUMENTS:
- List sessions with status, hypothesis, next action
- User picks number to resume OR describes new issue

If $ARGUMENTS provided OR user describes new issue:
- Continue to symptom gathering

## 2. Gather Symptoms (if new issue)

### Thinking Phase: Pre-Step - Symptom Planning

<server>sequential</server>
<prompt>Plan symptom gathering:
1. What questions will reveal the most information?
2. What details are most diagnostic?
3. What context is essential vs optional?</prompt>
<expected_output>Symptom gathering approach</expected_output>
<timeout>3000</timeout>

Use AskUserQuestion for each:

1. **Expected behavior** - What should happen?
2. **Actual behavior** - What happens instead?
3. **Error messages** - Any errors? (paste or describe)
4. **Timeline** - When did this start? Ever worked?
5. **Reproduction** - How do you trigger it?

After all gathered, confirm ready to investigate.

### Thinking Phase: Post-Step - Symptoms Analyzed

<server>debug</server>
<prompt>Reflect on symptoms:
1. What patterns emerge from the symptoms?
2. What are likely root cause categories?
3. What should be recorded for future reference?</prompt>
<expected_output>Symptom patterns stored</expected_output>
<timeout>2000</timeout>

Create problem node in debug-thinking:
```
action: create
nodeType: problem
content: {issue description from symptoms}
metadata: {tags: [error-types], severity: inferred, reproducibility: assessed}
```

## 3. Spawn GSI-debugger Agent

### Thinking Phase: Pre-Step - Investigation Planning

<server>sequential</server>
<prompt>Plan the investigation approach:
1. What should the debugger investigate first?
2. What hypotheses should it prioritize?
3. What evidence is most critical to gather?</prompt>
<expected_output>Investigation plan for subagent</expected_output>
<timeout>3000</timeout>

Fill prompt and spawn:

```markdown
<objective>
Investigate issue: {slug}

**Summary:** {trigger}
</objective>

<symptoms>
expected: {expected}
actual: {actual}
errors: {errors}
reproduction: {reproduction}
timeline: {timeline}
</symptoms>

<mode>
symptoms_prefilled: true
goal: find_and_fix
</mode>

<debug_file>
Create: .planning/debug/{slug}.md
</debug_file>

<debug_thinking_context>
Problem node ID: {node-id from debug-thinking}
</debug_thinking_context>
```

```
Task(
  prompt=filled_prompt,
  subagent_type="GSI-debugger",
  model="{debugger_model}",
  description="Debug {slug}"
)
```

## 4. Handle Agent Return

### Thinking Phase: Pre-Step - Result Analysis

<server>debug</server>
<prompt>Analyze agent results:
1. Was the root cause definitively identified?
2. What evidence supports the conclusion?
3. Is the fix approach sound?</prompt>
<expected_output>Result assessment</expected_output>
<timeout>3000</timeout>

**If `## ROOT CAUSE FOUND`:**
- Display root cause and evidence summary
- Store solution in debug-thinking:
  ```
  action: create
  nodeType: solution
  content: {root cause and fix}
  parentId: {problem-node-id}
  metadata: {verified: false}
  ```
- Offer options:
  - "Fix now" - spawn fix subagent
  - "Plan fix" - suggest /gsi:plan-phase --gaps
  - "Manual fix" - done

**If `## CHECKPOINT REACHED`:**
- Present checkpoint details to user
- Get user response
- Store checkpoint in debug-thinking:
  ```
  action: create
  nodeType: experiment
  content: {checkpoint details}
  parentId: {problem-node-id}
  metadata: {type: checkpoint, awaiting: user-response}
  ```
- Spawn continuation agent (see step 5)

**If `## INVESTIGATION INCONCLUSIVE`:**
- Show what was checked and eliminated
- Record eliminated hypotheses:
  ```
  action: create
  nodeType: observation
  content: {what was eliminated}
  parentId: {problem-node-id}
  ```
- Offer options:
  - "Continue investigating" - spawn new agent with additional context
  - "Manual investigation" - done
  - "Add more context" - gather more symptoms, spawn again

## 5. Spawn Continuation Agent (After Checkpoint)

When user responds to checkpoint, spawn fresh agent:

```markdown
<objective>
Continue debugging {slug}. Evidence is in the debug file.
</objective>

<prior_state>
Debug file: @.planning/debug/{slug}.md
</prior_state>

<checkpoint_response>
**Type:** {checkpoint_type}
**Response:** {user_response}
</checkpoint_response>

<mode>
goal: find_and_fix
</mode>

<debug_thinking_context>
Problem node ID: {node-id}
Checkpoint node ID: {checkpoint-node-id}
</debug_thinking_context>
```

```
Task(
  prompt=continuation_prompt,
  subagent_type="GSI-debugger",
  model="{debugger_model}",
  description="Continue debug {slug}"
)
```

## 6. Capture Learnings (After Resolution)

### Thinking Phase: Post-Workflow

<server>debug</server>
<prompt>Capture debugging learnings:
1. What debugging patterns worked well?
2. What investigation strategies were effective?
3. What should be remembered for future similar issues?
4. How could the process be improved?</prompt>
<expected_output>Debugging patterns stored in knowledge graph</expected_output>
<timeout>5000</timeout>

After successful resolution, update debug-thinking:

```
action: connect
from: {problem-node-id}
to: {solution-node-id}
type: solves
strength: 1.0
```

Store learnings:
```
action: create
nodeType: learning
content: {key insights from debugging session}
parentId: {solution-node-id}
metadata: {patterns: [identified-patterns], effectiveness: rating}
```

This enables future sessions to find similar problems and solutions.

</process>

<success_criteria>
- [ ] Active sessions checked
- [ ] Similar problems queried from debug-thinking history
- [ ] Symptoms gathered (if new)
- [ ] Problem node created in debug-thinking
- [ ] GSI-debugger spawned with context
- [ ] Checkpoints handled correctly
- [ ] Root cause confirmed before fixing
- [ ] Learnings captured in debug-thinking
</success_criteria>

<error_recovery>

## Common Issues and Solutions

### Issue: Debug-thinking MCP Unavailable
- Continue without knowledge graph persistence
- Log warning to user
- Proceed with standard debugging

### Issue: Similar Problems Query Fails
- Skip history lookup
- Continue with fresh investigation
- Record issue for MCP debugging

### Issue: Subagent Context Overflow
- Check for checkpoint signals
- Spawn continuation if needed
- Increase model context if available

### Issue: Fix Verification Fails
- Return to investigation phase
- Record failed hypothesis
- Form new hypothesis based on evidence

</error_recovery>

</document_content>
</document>
<document index="9">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\discuss-phase.md</source>
<document_content>
﻿---
name: gsi:discuss-phase
description: Gather phase context through adaptive questioning before planning
argument-hint: "<phase>"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - mcp__code-index-mcp__find_files
  - Task
---

<!--
CI Tools Usage:
- search_code_advanced: Find relevant code
- get_file_summary: Understand file context
- get_symbol_body: Inspect implementations and trace dependencies
- find_files: Discover related files
-->

<objective>
Extract implementation decisions that downstream agents need — researcher and planner will use CONTEXT.md to know what to investigate and what choices are locked.

**How it works:**
1. Analyze the phase to identify gray areas (UI, UX, behavior, etc.)
2. Present gray areas — user selects which to discuss
3. Deep-dive each selected area until satisfied
4. Create CONTEXT.md with decisions that guide research and planning

**Output:** `{phase}-CONTEXT.md` — decisions clear enough that downstream agents can act without asking the user again
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/discuss-phase.md
@~/.claude/get-shit-indexed/templates/context.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

**Load project state:**
@.planning/STATE.md

**Load roadmap:**
@.planning/ROADMAP.md
</context>

<process>
1. Validate phase number (error if missing or not in roadmap)
2. Check if CONTEXT.md exists (offer update/view/skip if yes)
3. **Analyze phase** — Identify domain and generate phase-specific gray areas
4. **Present gray areas** — Multi-select: which to discuss? (NO skip option)
5. **Deep-dive each area** — 4 questions per area, then offer more/next
6. **Write CONTEXT.md** — Sections match areas discussed
7. Offer next steps (research or plan)

**CRITICAL: Scope guardrail**
- Phase boundary from ROADMAP.md is FIXED
- Discussion clarifies HOW to implement, not WHETHER to add more
- If user suggests new capabilities: "That's its own phase. I'll note it for later."
- Capture deferred ideas — don't lose them, don't act on them

**Domain-aware gray areas:**
Gray areas depend on what's being built. Analyze the phase goal:
- Something users SEE → layout, density, interactions, states
- Something users CALL → responses, errors, auth, versioning
- Something users RUN → output format, flags, modes, error handling
- Something users READ → structure, tone, depth, flow
- Something being ORGANIZED → criteria, grouping, naming, exceptions

Generate 3-4 **phase-specific** gray areas, not generic categories.

**Probing depth:**
- Ask 4 questions per area before checking
- "More questions about [area], or move to next?"
- If more → ask 4 more, check again
- After all areas → "Ready to create context?"

**Do NOT ask about (Claude handles these):**
- Technical implementation
- Architecture choices
- Performance concerns
- Scope expansion
</process>

<success_criteria>
- Gray areas identified through intelligent analysis
- User chose which areas to discuss
- Each selected area explored until satisfied
- Scope creep redirected to deferred ideas
- CONTEXT.md captures decisions, not vague vision
- User knows next steps
</success_criteria>

</document_content>
</document>
<document index="10">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\execute-phase.md</source>
<document_content>
﻿---
name: gsi:execute-phase
description: Execute all plans in a phase with wave-based parallelization
argument-hint: "<phase-number> [--gaps-only]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__start_process
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - mcp__code-index-mcp__build_deep_index
  - mcp__code-index-mcp__refresh_index
  - ListMcpResourcesTool
  - Task
---

<!--
Golden Pattern Tool Usage:
- CI understand: Code-Index for code search and symbol extraction
- DC act: Desktop Commander for file operations
- DC verify: Desktop Commander for verification
- CI verify: Code-Index for code verification

CI Tools Usage:
- search_code_advanced: Find code patterns across project
- find_files: Discover plan/summary/verification files
- get_file_summary: Understand file structure before editing
- get_symbol_body: Extract implementations and analyze relationships
- build_deep_index: Create comprehensive symbol index
- refresh_index: Update index after git operations
-->
<objective>
Execute all plans in a phase using wave-based parallel execution.

Orchestrator stays lean: discover plans, analyze dependencies, group into waves, spawn subagents, collect results. Each subagent loads the full execute-plan context and handles its own plan.

Context budget: ~15% orchestrator, 100% fresh per subagent.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/execute-phase.md
@~/.claude/get-shit-indexed/references/ui-brand.md
</execution_context>

<context>
Phase: $ARGUMENTS

**Flags:**
- `--gaps-only` — Execute only gap closure plans (plans with `gap_closure: true` in frontmatter). Use after verify-work creates fix plans.

@.planning/ROADMAP.md
@.planning/STATE.md
</context>

<process>
Execute the execute-phase workflow from @~/.claude/get-shit-indexed/workflows/execute-phase.md end-to-end.
Preserve all workflow gates (wave execution, checkpoint handling, verification, state updates, routing).
</process>

</document_content>
</document>
<document index="11">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\help.md</source>
<document_content>
﻿---
name: gsi:help
description: Show available GSI commands and usage guide
allowed-tools:
  - mcp__desktop-commander__read_file
---
<objective>
Display the complete GSI command reference.

Output ONLY the reference content below. Do NOT add:
- Project-specific analysis
- Git status or file context
- Next-step suggestions
- Any commentary beyond the reference
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/help.md
</execution_context>

<process>
Output the complete GSI command reference from @~/.claude/get-shit-indexed/workflows/help.md.
Display the reference content directly — no additions or modifications.
</process>

</document_content>
</document>
<document index="12">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\insert-phase.md</source>
<document_content>
﻿---
name: gsi:insert-phase
description: Insert urgent work as decimal phase (e.g., 72.1) between existing phases
argument-hint: <after> <description>
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
---

<objective>
Insert a decimal phase for urgent work discovered mid-milestone that must be completed between existing integer phases.

Uses decimal numbering (72.1, 72.2, etc.) to preserve the logical sequence of planned phases while accommodating urgent insertions.

Purpose: Handle urgent work discovered during execution without renumbering entire roadmap.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/insert-phase.md
</execution_context>

<context>
Arguments: $ARGUMENTS (format: <after-phase-number> <description>)

@.planning/ROADMAP.md
@.planning/STATE.md
</context>

<process>
Execute the insert-phase workflow from @~/.claude/get-shit-indexed/workflows/insert-phase.md end-to-end.
Preserve all validation gates (argument parsing, phase verification, decimal calculation, roadmap updates).
</process>

<code_index_mcp>
**Priority: MEDIUM** - Support for phase relationship analysis

**CI Tools Integration:**
- `search_code_advanced`: Find contextual relationships for inserted phase
- `find_files`: Locate adjacent phase documents
- `get_file_summary`: Understand neighboring phase content
- `get_symbol_body`: Extract integration patterns from related work

**Usage Context:**
When inserting decimal phases:
- Analyze relationships between existing phases
- Understand integration points for the new phase
- Identify dependencies and impact on existing work
- Maintain consistency with phase naming and structure

**Token Savings:** ~70% vs manual phase relationship analysis
</code_index_mcp>

</document_content>
</document>
<document index="13">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\join-discord.md</source>
<document_content>
﻿---
name: gsi:join-discord
description: Join the GSI Discord community
allowed-tools:
  - mcp__desktop-commander__read_file
---

<objective>
Display the Discord invite link for the GSI community server.
</objective>

<output>
# Join the GSI Discord

Connect with other GSI users, get help, share what you're building, and stay updated.

**Invite link:** https://discord.gg/5JJgD5svVS

Click the link or paste it into your browser to join.
</output>

</document_content>
</document>
<document index="14">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\list-phase-assumptions.md</source>
<document_content>
﻿---
name: gsi:list-phase-assumptions
description: Surface Claude's assumptions about a phase approach before planning
argument-hint: "[phase]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
---

<objective>
Analyze a phase and present Claude's assumptions about technical approach, implementation order, scope boundaries, risk areas, and dependencies.

Purpose: Help users see what Claude thinks BEFORE planning begins - enabling course correction early when assumptions are wrong.
Output: Conversational output only (no file creation) - ends with "What do you think?" prompt
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/list-phase-assumptions.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

**Load project state first:**
@.planning/STATE.md

**Load roadmap:**
@.planning/ROADMAP.md
</context>

<process>
1. Validate phase number argument (error if missing or invalid)
2. Check if phase exists in roadmap
3. Follow list-phase-assumptions.md workflow:
   - Analyze roadmap description
   - Surface assumptions about: technical approach, implementation order, scope, risks, dependencies
   - Present assumptions clearly
   - Prompt "What do you think?"
4. Gather feedback and offer next steps
</process>

<code_index_mcp>
**Priority: HIGH** - Core to phase understanding before planning

**CI Tools Integration:**
- `search_code_advanced`: Analyze existing patterns and approaches
- `find_files`: Discover related phase work and examples
- `get_file_summary`: Understand similar phase implementations
- `get_symbol_body`: Extract key architectural patterns from related work

**Usage Context:**
When surfacing phase assumptions:
- Analyze previous phases for technical patterns
- Understand established approaches for similar work
- Identify dependencies and integration points
- Surface risks based on existing codebase complexity

**Token Savings:** ~75% vs manual pattern analysis for assumption surfacing
</code_index_mcp>

<success_criteria>

- Phase validated against roadmap
- Assumptions surfaced across five areas
- User prompted for feedback
- User knows next steps (discuss context, plan phase, or correct assumptions)
  </success_criteria>

</document_content>
</document>
<document index="15">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\map-codebase.md</source>
<document_content>
---
name: gsi:map-codebase
description: Analyze codebase with parallel mapper agents to produce .planning/codebase/ documents
argument-hint: "[optional: specific area to map, e.g., 'api' or 'auth']"
allowed-tools:
  # File Operations (Desktop Commander)
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__read_multiple_files
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__desktop-commander__get_file_info
  - mcp__desktop-commander__start_search
  - mcp__desktop-commander__start_process
  # Code Index Tools (Fast Search)
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__set_project_path
  - mcp__code-index-mcp__build_deep_index
  - mcp__code-index-mcp__get_symbol_body
  # Code Graph Tools (Relationship Analysis)
  - mcp__CodeGraphContext__add_code_to_graph
  - mcp__CodeGraphContext__analyze_code_relationships
  - mcp__CodeGraphContext__find_code
  - mcp__CodeGraphContext__calculate_cyclomatic_complexity
  - mcp__CodeGraphContext__find_most_complex_functions
  - mcp__CodeGraphContext__find_dead_code
  # Orchestration
  - Task
thinking_phase:
  mode: COMPREHENSIVE
  servers:
    - name: tractatus
      purpose: "Analyze codebase structure and architecture patterns"
      timeout: 10000
    - name: sequential
      purpose: "Plan systematic codebase exploration steps"
      timeout: 8000
    - name: debug
      purpose: "Capture patterns and anti-patterns during mapping"
      timeout: 5000
  rationale: |
    Codebase mapping requires:
    1. Tractatus for structural analysis (architecture, layers, patterns)
    2. Sequential for methodical exploration planning
    3. Debug for pattern capture and reflection
    
    This comprehensive approach ensures thorough understanding of:
    - Architectural patterns and layer relationships
    - Code organization and naming conventions
    - Dependency graphs and call relationships
    - Technical debt and areas of concern
  integration: "Pre-workflow structure analysis, per-phase planning, post-phase reflection"
---

<!--
Golden Pattern Tool Usage:
- CI understand: Code-Index for code search and symbol extraction
- DC act: Desktop Commander for file operations
- CGC analyze: CodeGraphContext for relationship and complexity analysis

CI Tools Usage:
- search_code_advanced: Find code patterns across project
- find_files: Discover relevant files
- get_file_summary: Understand file structure
- set_project_path: Initialize index for codebase
- build_deep_index: Create comprehensive symbol index
- get_symbol_body: Extract function/class implementations and relationships

CGC Tools Usage:
- add_code_to_graph: Index codebase for graph analysis
- analyze_code_relationships: Query call graphs, imports, class hierarchy
- find_code: Fuzzy code discovery
- calculate_cyclomatic_complexity: Measure function complexity
- find_most_complex_functions: Identify complexity hotspots
- find_dead_code: Detect unused functions/exports
-->

<objective>
Analyze existing codebase using parallel GSI-codebase-mapper agents to produce structured codebase documents.

Each mapper agent explores a focus area and **writes documents directly** to `.planning/codebase/`. The orchestrator only receives confirmations, keeping context usage minimal.

Output: .planning/codebase/ folder with 7 structured documents about the codebase state.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/map-codebase.md
</execution_context>

<context>
Focus area: $ARGUMENTS (optional - if provided, tells agents to focus on specific subsystem)

**Load project state if exists:**
Check for .planning/STATE.md - loads context if project already initialized

**This command can run:**
- Before /gsi:new-project (brownfield codebases) - creates codebase map first
- After /gsi:new-project (greenfield codebases) - updates codebase map as code evolves
- Anytime to refresh codebase understanding
</context>

<when_to_use>
**Use map-codebase for:**
- Brownfield projects before initialization (understand existing code first)
- Refreshing codebase map after significant changes
- Onboarding to an unfamiliar codebase
- Before major refactoring (understand current state)
- When STATE.md references outdated codebase info

**Skip map-codebase for:**
- Greenfield projects with no code yet (nothing to map)
- Trivial codebases (<5 files)
</when_to_use>

<process>
1. Check if .planning/codebase/ already exists (offer to refresh or skip)
2. Create .planning/codebase/ directory structure
3. Spawn 4 parallel GSI-codebase-mapper agents:
   - Agent 1: tech focus → writes STACK.md, INTEGRATIONS.md
   - Agent 2: arch focus → writes ARCHITECTURE.md, STRUCTURE.md
   - Agent 3: quality focus → writes CONVENTIONS.md, TESTING.md
   - Agent 4: concerns focus → writes CONCERNS.md
4. Wait for agents to complete, collect confirmations (NOT document contents)
5. Verify all 7 documents exist with line counts
6. Commit codebase map
7. Offer next steps (typically: /gsi:new-project or /gsi:plan-phase)
</process>

<advanced_features>
**Complexity Analysis:**
- Use `mcp__CodeGraphContext__find_most_complex_functions` to identify complexity hotspots
- Use `mcp__CodeGraphContext__calculate_cyclomatic_complexity` for specific functions
- Report high-complexity areas in CONCERNS.md

**Relationship Mapping:**
- Use `mcp__CodeGraphContext__analyze_code_relationships` with query types:
  - `find_callers`: Who calls this function?
  - `find_callees`: What does this function call?
  - `find_importers`: What files import this module?
  - `class_hierarchy`: Inheritance relationships
  - `call_chain`: Full call chain analysis

**Dead Code Detection:**
- Use `mcp__CodeGraphContext__find_dead_code` to identify unused functions
- Report potential dead code in CONCERNS.md

**Batch File Operations:**
- Use `mcp__desktop-commander__read_multiple_files` for reading 2+ files
- Token savings: 67-87% compared to sequential reads
</advanced_features>

<success_criteria>
- [ ] .planning/codebase/ directory created
- [ ] All 7 codebase documents written by mapper agents
- [ ] Documents follow template structure
- [ ] Parallel agents completed without errors
- [ ] Thinking phase executed (COMPREHENSIVE mode)
- [ ] User knows next steps
</success_criteria>

</document_content>
</document>
<document index="16">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\new-milestone.md</source>
<document_content>
﻿---
name: gsi:new-milestone
description: Start a new milestone cycle — update PROJECT.md and route to requirements
argument-hint: "[milestone name, e.g., 'v1.1 Notifications']"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
---
<objective>
Start a new milestone: questioning → research (optional) → requirements → roadmap.

Brownfield equivalent of new-project. Project exists, PROJECT.md has history. Gathers "what's next", updates PROJECT.md, then runs requirements → roadmap cycle.

**Creates/Updates:**
- `.planning/PROJECT.md` — updated with new milestone goals
- `.planning/research/` — domain research (optional, NEW features only)
- `.planning/REQUIREMENTS.md` — scoped requirements for this milestone
- `.planning/ROADMAP.md` — phase structure (continues numbering)
- `.planning/STATE.md` — reset for new milestone

**After:** `/gsi:plan-phase [N]` to start execution.

<code_index_mcp>
**Priority: HIGH** - Critical for milestone research and analysis

**CI Tools Integration:**
- `find_files`: Discover existing project documents and research
- `search_code_advanced`: Analyze previous milestones for patterns
- `get_file_summary`: Understand existing project structure quickly
- `get_symbol_body`: Extract key patterns from previous work

**Usage Context:**
During new milestone creation:
- Analyze previous milestones for continuity
- Research domain patterns across codebase
- Understand existing architecture and conventions
- Identify areas that need research vs reuse

**Token Savings:** ~80% vs manual document analysis for understanding existing work
</code_index_mcp>
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/new-milestone.md
@~/.claude/get-shit-indexed/references/questioning.md
@~/.claude/get-shit-indexed/references/ui-brand.md
@~/.claude/get-shit-indexed/templates/project.md
@~/.claude/get-shit-indexed/templates/requirements.md
</execution_context>

<context>
Milestone name: $ARGUMENTS (optional - will prompt if not provided)

**Load project context:**
@.planning/PROJECT.md
@.planning/STATE.md
@.planning/MILESTONES.md
@.planning/config.json

**Load milestone context (if exists, from /gsi:discuss-milestone):**
@.planning/MILESTONE-CONTEXT.md
</context>

<process>
Execute the new-milestone workflow from @~/.claude/get-shit-indexed/workflows/new-milestone.md end-to-end.
Preserve all workflow gates (validation, questioning, research, requirements, roadmap approval, commits).
</process>

</document_content>
</document>
<document index="17">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\new-project.md</source>
<document_content>
﻿---
name: gsi:new-project
description: Initialize a new project with deep context gathering and PROJECT.md
argument-hint: "[--auto]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
---
<context>
**Flags:**
- `--auto` — Automatic mode. After config questions, runs research → requirements → roadmap without further interaction. Expects idea document via @ reference.
</context>

<objective>
Initialize a new project through unified flow: questioning → research (optional) → requirements → roadmap.

**Creates:**
- `.planning/PROJECT.md` — project context
- `.planning/config.json` — workflow preferences
- `.planning/research/` — domain research (optional)
- `.planning/REQUIREMENTS.md` — scoped requirements
- `.planning/ROADMAP.md` — phase structure
- `.planning/STATE.md` — project memory

**After this command:** Run `/gsi:plan-phase 1` to start execution.

<code_index_mcp>
**Priority: MEDIUM** - Support for brownfield project analysis

**CI Tools Integration:**
- `find_files`: Scan existing codebase structure
- `search_code_advanced`: Identify patterns and technologies in use
- `get_file_summary`: Understand codebase organization quickly
- `get_symbol_body`: Extract key architectural patterns

**Usage Context:**
For new projects (especially brownfield):
- Analyze existing code structure and patterns
- Identify technology stack and conventions
- Understand architecture decisions to follow
- Map existing code to new planning requirements

**Token Savings:** ~75% vs manual codebase exploration for project understanding
</code_index_mcp>
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/new-project.md
@~/.claude/get-shit-indexed/references/questioning.md
@~/.claude/get-shit-indexed/references/ui-brand.md
@~/.claude/get-shit-indexed/templates/project.md
@~/.claude/get-shit-indexed/templates/requirements.md
</execution_context>

<process>
Execute the new-project workflow from @~/.claude/get-shit-indexed/workflows/new-project.md end-to-end.
Preserve all workflow gates (validation, approvals, commits, routing).
</process>

</document_content>
</document>
<document index="18">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\pause-work.md</source>
<document_content>
﻿---
name: gsi:pause-work
description: Create context handoff when pausing work mid-phase
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - Task
---

<objective>
Create `.continue-here.md` handoff file to preserve complete work state across sessions.

Routes to the pause-work workflow which handles:
- Current phase detection from recent files
- Complete state gathering (position, completed work, remaining work, decisions, blockers)
- Handoff file creation with all context sections
- Git commit as WIP
- Resume instructions
</objective>

<execution_context>
@.planning/STATE.md
@~/.claude/get-shit-indexed/workflows/pause-work.md
</execution_context>

<process>
**Follow the pause-work workflow** from `@~/.claude/get-shit-indexed/workflows/pause-work.md`.

The workflow handles all logic including:
1. Phase directory detection
2. State gathering with user clarifications
3. Handoff file writing with timestamp
4. Git commit
5. Confirmation with resume instructions
</process>

<code_index_mcp>
**Priority: MEDIUM** - Support for state context gathering

**CI Tools Integration:**
- `search_code_advanced`: Find recent work patterns and context
- `find_files`: Locate relevant planning and execution files
- `get_file_summary`: Quickly understand phase progress and status
- `get_symbol_body`: Extract key implementation details for context

**Usage Context:**
When pausing work:
- Gather recent work patterns and progress
- Understand current implementation state
- Identify key files and context for resumption
- Surface decision points and next steps clearly

**Token Savings:** ~60% vs manual file exploration for state gathering
</code_index_mcp>

</document_content>
</document>
<document index="19">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\plan-milestone-gaps.md</source>
<document_content>
﻿---
name: gsi:plan-milestone-gaps
description: Create phases to close all gaps identified by milestone audit
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - Task
---
<objective>
Create all phases necessary to close gaps identified by `/gsi:audit-milestone`.

Reads MILESTONE-AUDIT.md, groups gaps into logical phases, creates phase entries in ROADMAP.md, and offers to plan each phase.

One command creates all fix phases — no manual `/gsi:add-phase` per gap.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/plan-milestone-gaps.md
</execution_context>

<context>
**Audit results:**
Glob: .planning/v*-MILESTONE-AUDIT.md (use most recent)

**Original intent (for prioritization):**
@.planning/PROJECT.md
@.planning/REQUIREMENTS.md

**Current state:**
@.planning/ROADMAP.md
@.planning/STATE.md
</context>

<process>
Execute the plan-milestone-gaps workflow from @~/.claude/get-shit-indexed/workflows/plan-milestone-gaps.md end-to-end.
Preserve all workflow gates (audit loading, prioritization, phase grouping, user confirmation, roadmap updates).
</process>

</document_content>
</document>
<document index="20">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\plan-phase.md</source>
<document_content>
﻿---
name: gsi:plan-phase
description: Create detailed execution plan for a phase (PLAN.md) with verification loop
argument-hint: "[phase] [--research] [--skip-research] [--gaps] [--skip-verify]"
agent: GSI-planner
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__rag-web-browser__search
  - Task
---

<!--
Golden Pattern Tool Usage:
- CI understand: Code-Index for code search and symbol extraction
- DC act: Desktop Commander for file operations

CI Tools Usage:
- search_code_advanced: Find code patterns across project
- find_files: Discover plan/summary/verification files
- get_file_summary: Understand file structure before editing
- get_symbol_body: Extract implementations and analyze dependencies
-->
<objective>
Create executable phase prompts (PLAN.md files) for a roadmap phase with integrated research and verification.

**Default flow:** Research (if needed) → Plan → Verify → Done

**Orchestrator role:** Parse arguments, validate phase, research domain (unless skipped), spawn GSI-planner, verify with GSI-plan-checker, iterate until pass or max iterations, present results.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/plan-phase.md
@~/.claude/get-shit-indexed/references/ui-brand.md
</execution_context>

<context>
Phase number: $ARGUMENTS (optional — auto-detects next unplanned phase if omitted)

**Flags:**
- `--research` — Force re-research even if RESEARCH.md exists
- `--skip-research` — Skip research, go straight to planning
- `--gaps` — Gap closure mode (reads VERIFICATION.md, skips research)
- `--skip-verify` — Skip verification loop

Normalize phase input in step 2 before any directory lookups.
</context>

<process>
Execute the plan-phase workflow from @~/.claude/get-shit-indexed/workflows/plan-phase.md end-to-end.
Preserve all workflow gates (validation, research, planning, verification loop, routing).
</process>

</document_content>
</document>
<document index="21">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\progress.md</source>
<document_content>
﻿---
name: gsi:progress
description: Check project progress, show context, and route to next action (execute or plan)
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
---

<!--
CI Tools Usage:
- search_code_advanced: Find patterns across planning files
- find_files: Discover plan and summary files
-->
<objective>
Check project progress, summarize recent work and what's ahead, then intelligently route to the next action - either executing an existing plan or creating the next one.

Provides situational awareness before continuing work.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/progress.md
</execution_context>

<process>
Execute the progress workflow from @~/.claude/get-shit-indexed/workflows/progress.md end-to-end.
Preserve all routing logic (Routes A through F) and edge case handling.
</process>

</document_content>
</document>
<document index="22">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\quick.md</source>
<document_content>
﻿---
name: gsi:quick
description: Execute a quick task with GSI guarantees (atomic commits, state tracking) but skip optional agents
argument-hint: ""
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__desktop-commander__start_process
  - Task
---
<objective>
Execute small, ad-hoc tasks with GSI guarantees (atomic commits, STATE.md tracking) while skipping optional agents (research, plan-checker, verifier).

Quick mode is the same system with a shorter path:
- Spawns GSI-planner (quick mode) + GSI-executor(s)
- Skips GSI-phase-researcher, GSI-plan-checker, GSI-verifier
- Quick tasks live in `.planning/quick/` separate from planned phases
- Updates STATE.md "Quick Tasks Completed" table (NOT ROADMAP.md)

Use when: You know exactly what to do and the task is small enough to not need research or verification.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/quick.md
</execution_context>

<context>
@.planning/STATE.md
</context>

<process>
Execute the quick workflow from @~/.claude/get-shit-indexed/workflows/quick.md end-to-end.
Preserve all workflow gates (validation, task description, planning, execution, state updates, commits).
</process>

</document_content>
</document>
<document index="23">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\reapply-patches.md</source>
<document_content>
﻿---
description: Reapply local modifications after a GSI update
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - Task
---

<purpose>
After a GSI update wipes and reinstalls files, this command merges user's previously saved local modifications back into the new version. Uses intelligent comparison to handle cases where the upstream file also changed.
</purpose>

<process>

## Step 1: Detect backed-up patches

Check for local patches directory:

```bash
# Global install
PATCHES_DIR="${HOME}/.claude/GSI-local-patches"
# Local install fallback
if [ ! -d "$PATCHES_DIR" ]; then
  PATCHES_DIR="./.claude/GSI-local-patches"
fi
```

Read `backup-meta.json` from the patches directory.

**If no patches found:**
```
No local patches found. Nothing to reapply.

Local patches are automatically saved when you run /gsi:update
after modifying any GSI workflow, command, or agent files.
```
Exit.

## Step 2: Show patch summary

```
## Local Patches to Reapply

**Backed up from:** v{from_version}
**Current version:** {read VERSION file}
**Files modified:** {count}

| # | File | Status |
|---|------|--------|
| 1 | {file_path} | Pending |
| 2 | {file_path} | Pending |
```

## Step 3: Merge each file

For each file in `backup-meta.json`:

1. **Read the backed-up version** (user's modified copy from `GSI-local-patches/`)
2. **Read the newly installed version** (current file after update)
3. **Compare and merge:**

   - If the new file is identical to the backed-up file: skip (modification was incorporated upstream)
   - If the new file differs: identify the user's modifications and apply them to the new version

   **Merge strategy:**
   - Read both versions fully
   - Identify sections the user added or modified (look for additions, not just differences from path replacement)
   - Apply user's additions/modifications to the new version
   - If a section the user modified was also changed upstream: flag as conflict, show both versions, ask user which to keep

4. **Write merged result** to the installed location
5. **Report status:**
   - `Merged` — user modifications applied cleanly
   - `Skipped` — modification already in upstream
   - `Conflict` — user chose resolution

## Step 4: Update manifest

After reapplying, regenerate the file manifest so future updates correctly detect these as user modifications:

```bash
# The manifest will be regenerated on next /gsi:update
# For now, just note which files were modified
```

## Step 5: Cleanup option

Ask user:
- "Keep patch backups for reference?" → preserve `GSI-local-patches/`
- "Clean up patch backups?" → remove `GSI-local-patches/` directory

## Step 6: Report

```
## Patches Reapplied

| # | File | Status |
|---|------|--------|
| 1 | {file_path} | ✓ Merged |
| 2 | {file_path} | ○ Skipped (already upstream) |
| 3 | {file_path} | ⚠ Conflict resolved |

{count} file(s) updated. Your local modifications are active again.
```

</process>

<success_criteria>
- [ ] All backed-up patches processed
- [ ] User modifications merged into new version
- [ ] Conflicts resolved with user input
- [ ] Status reported for each file
</success_criteria>

</document_content>
</document>
<document index="24">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\remove-phase.md</source>
<document_content>
﻿---
name: gsi:remove-phase
description: Remove a future phase from roadmap and renumber subsequent phases
argument-hint: <phase-number>
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - Task
---
<objective>
Remove an unstarted future phase from the roadmap and renumber all subsequent phases to maintain a clean, linear sequence.

Purpose: Clean removal of work you've decided not to do, without polluting context with cancelled/deferred markers.
Output: Phase deleted, all subsequent phases renumbered, git commit as historical record.
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/remove-phase.md
</execution_context>

<context>
Phase: $ARGUMENTS

@.planning/ROADMAP.md
@.planning/STATE.md
</context>

<process>
Execute the remove-phase workflow from @~/.claude/get-shit-indexed/workflows/remove-phase.md end-to-end.
Preserve all validation gates (future phase check, work check), renumbering logic, and commit.
</process>

</document_content>
</document>
<document index="25">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\research-phase.md</source>
<document_content>
﻿---
name: gsi:research-phase
description: Research how to implement a phase (standalone - usually use /gsi:plan-phase instead)
argument-hint: "[phase]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__set_project_path
  - mcp__code-index-mcp__build_deep_index
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__rag-web-browser__search
  - Task
---

<!--
Golden Pattern Tool Usage:
- CI understand: Code-Index for code search and symbol extraction
- DC act: Desktop Commander for file operations

CI Tools Usage:
- set_project_path: Initialize index for codebase
- build_deep_index: Comprehensive symbol extraction
- search_code_advanced: Pattern research
- find_files: Discover relevant files
- get_file_summary: Understand file structure
- get_symbol_body: Extract implementations and analyze relationships
-->

<objective>
Research how to implement a phase. Spawns GSI-phase-researcher agent with phase context.

**Note:** This is a standalone research command. For most workflows, use `/gsi:plan-phase` which integrates research automatically.

**Use this command when:**
- You want to research without planning yet
- You want to re-research after planning is complete
- You need to investigate before deciding if a phase is feasible

**Orchestrator role:** Parse phase, validate against roadmap, check existing research, gather context, spawn researcher agent, present results.

**Why subagent:** Research burns context fast (WebSearch, Context7 queries, source verification). Fresh 200k context for investigation. Main context stays lean for user interaction.
</objective>

<context>
Phase number: $ARGUMENTS (required)

Normalize phase input in step 1 before any directory lookups.
</context>

<process>

## 0. Initialize Context

```bash
INIT=$(node ~/.claude/get-shit-indexed/bin/GSI-tools.js init phase-op "$ARGUMENTS")
```

Extract from init JSON: `phase_dir`, `phase_number`, `phase_name`, `phase_found`, `commit_docs`, `has_research`.

Resolve researcher model:
```bash
RESEARCHER_MODEL=$(node ~/.claude/get-shit-indexed/bin/GSI-tools.js resolve-model GSI-phase-researcher --raw)
```

## 1. Validate Phase

```bash
PHASE_INFO=$(node ~/.claude/get-shit-indexed/bin/GSI-tools.js roadmap get-phase "${phase_number}")
```

**If `found` is false:** Error and exit. **If `found` is true:** Extract `phase_number`, `phase_name`, `goal` from JSON.

## 2. Check Existing Research

```bash
ls .planning/phases/${PHASE}-*/RESEARCH.md 2>/dev/null
```

**If exists:** Offer: 1) Update research, 2) View existing, 3) Skip. Wait for response.

**If doesn't exist:** Continue.

## 3. Gather Phase Context

```bash
# Phase section already loaded in PHASE_INFO
echo "$PHASE_INFO" | jq -r '.section'
cat .planning/REQUIREMENTS.md 2>/dev/null
cat .planning/phases/${PHASE}-*/*-CONTEXT.md 2>/dev/null
grep -A30 "### Decisions Made" .planning/STATE.md 2>/dev/null
```

Present summary with phase description, requirements, prior decisions.

## 4. Spawn GSI-phase-researcher Agent

Research modes: ecosystem (default), feasibility, implementation, comparison.

```markdown
<research_type>
Phase Research — investigating HOW to implement a specific phase well.
</research_type>

<key_insight>
The question is NOT "which library should I use?"

The question is: "What do I not know that I don't know?"

For this phase, discover:
- What's the established architecture pattern?
- What libraries form the standard stack?
- What problems do people commonly hit?
- What's SOTA vs what Claude's training thinks is SOTA?
- What should NOT be hand-rolled?
</key_insight>

<objective>
Research implementation approach for Phase {phase_number}: {phase_name}
Mode: ecosystem
</objective>

<context>
**Phase description:** {phase_description}
**Requirements:** {requirements_list}
**Prior decisions:** {decisions_if_any}
**Phase context:** {context_md_content}
</context>

<downstream_consumer>
Your RESEARCH.md will be loaded by `/gsi:plan-phase` which uses specific sections:
- `## Standard Stack` → Plans use these libraries
- `## Architecture Patterns` → Task structure follows these
- `## Don't Hand-Roll` → Tasks NEVER build custom solutions for listed problems
- `## Common Pitfalls` → Verification steps check for these
- `## Code Examples` → Task actions reference these patterns

Be prescriptive, not exploratory. "Use X" not "Consider X or Y."
</downstream_consumer>

<quality_gate>
Before declaring complete, verify:
- [ ] All domains investigated (not just some)
- [ ] Negative claims verified with official docs
- [ ] Multiple sources for critical claims
- [ ] Confidence levels assigned honestly
- [ ] Section names match what plan-phase expects
</quality_gate>

<output>
Write to: .planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md
</output>
```

```
Task(
  prompt="First, read ~/.claude/agents/GSI-phase-researcher.md for your role and instructions.\n\n" + filled_prompt,
  subagent_type="general-purpose",
  model="{researcher_model}",
  description="Research Phase {phase}"
)
```

## 5. Handle Agent Return

**`## RESEARCH COMPLETE`:** Display summary, offer: Plan phase, Dig deeper, Review full, Done.

**`## CHECKPOINT REACHED`:** Present to user, get response, spawn continuation.

**`## RESEARCH INCONCLUSIVE`:** Show what was attempted, offer: Add context, Try different mode, Manual.

## 6. Spawn Continuation Agent

```markdown
<objective>
Continue research for Phase {phase_number}: {phase_name}
</objective>

<prior_state>
Research file: @.planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md
</prior_state>

<checkpoint_response>
**Type:** {checkpoint_type}
**Response:** {user_response}
</checkpoint_response>
```

```
Task(
  prompt="First, read ~/.claude/agents/GSI-phase-researcher.md for your role and instructions.\n\n" + continuation_prompt,
  subagent_type="general-purpose",
  model="{researcher_model}",
  description="Continue research Phase {phase}"
)
```

</process>

<success_criteria>
- [ ] Phase validated against roadmap
- [ ] Existing research checked
- [ ] GSI-phase-researcher spawned with context
- [ ] Checkpoints handled correctly
- [ ] User knows next steps
</success_criteria>

</document_content>
</document>
<document index="26">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\resume-work.md</source>
<document_content>
﻿---
name: gsi:resume-work
description: Resume work from previous session with full context restoration
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - Task
---

<objective>
Restore complete project context and resume work seamlessly from previous session.

Routes to the resume-project workflow which handles:

- STATE.md loading (or reconstruction if missing)
- Checkpoint detection (.continue-here files)
- Incomplete work detection (PLAN without SUMMARY)
- Status presentation
- Context-aware next action routing
  </objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/resume-project.md
</execution_context>

<process>
**Follow the resume-project workflow** from `@~/.claude/get-shit-indexed/workflows/resume-project.md`.

The workflow handles all resumption logic including:

1. Project existence verification
2. STATE.md loading or reconstruction
3. Checkpoint and incomplete work detection
4. Visual status presentation
5. Context-aware option offering (checks CONTEXT.md before suggesting plan vs discuss)
6. Routing to appropriate next command
7. Session continuity updates
   </process>

</document_content>
</document>
<document index="27">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\set-profile.md</source>
<document_content>
﻿---
name: set-profile
description: Switch between model quality profiles (quality/balanced/budget)
color: cyan
---

## Usage

```bash
/gsi:set-profile [quality|balanced|budget]
```

## Examples

### Switch to quality profile (maximum capability)

```bash
/gsi:set-profile quality
```

Uses Opus for all agents (executor, planner, verifier).
Best for: Complex analysis, architectural decisions, critical tasks.

### Switch to balanced profile (recommended)

```bash
/gsi:set-profile balanced
```

Uses Sonnet for execution/planning, Opus for verification.
Best for: Standard workflows, most development tasks.

### Switch to budget profile (maximum speed)

```bash
/gsi:set-profile budget
```

Uses Haiku for execution/verification, Sonnet for planning.
Best for: Quick iterations, experimental features, cost-sensitive operations.

### Check current profile status

```bash
/gsi:set-profile
```

Displays current active profile without changing it.

---

## Profiles

| Profile | Executor | Planner | Verifier | Best For |
|---------|----------|----------|----------|-----------|
| **quality** | claude-opus-4-6 | claude-opus-4-6 | claude-opus-4-6 | Complex tasks, architecture |
| **balanced** | claude-sonnet-4-5 | claude-opus-4-6 | claude-sonnet-4-5 | Standard workflows |
| **budget** | claude-haiku-4-5 | claude-sonnet-4-5 | claude-haiku-4-5 | Quick iterations, testing |

---

## Configuration

Profile settings are stored in `.planning/config.json`:

```json
{
  "active_profile": "quality|balanced|budget",
  "profiles": {
    "quality": {
      "executor_model": "claude-opus-4-6",
      "planner_model": "claude-opus-4-6",
      "verifier_model": "claude-opus-4-6"
    },
    "balanced": {
      "executor_model": "claude-sonnet-4-5",
      "planner_model": "claude-opus-4-6",
      "verifier_model": "claude-sonnet-4-5"
    },
    "budget": {
      "executor_model": "claude-haiku-4-5",
      "planner_model": "claude-sonnet-4-5",
      "verifier_model": "claude-haiku-4-5"
    }
  }
}
```

---

## See Also

- `@get-shit-indexed/workflows/set-profile.md` — Profile switching workflow
- `@get-shit-indexed/references/model-profiles.md` — Profile reference documentation
- `@.planning/config.json` — Configuration storage

---

*Command for GSI Phase 8 - Advanced Workflow Features*
</document_content>
</document>
<document index="28">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\settings.md</source>
<document_content>
﻿---
name: gsi:settings
description: Configure GSI workflow toggles and model profile
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
---

<objective>
Interactive configuration of GSI workflow agents and model profile via multi-question prompt.

Routes to the settings workflow which handles:
- Config existence ensuring
- Current settings reading and parsing
- Interactive 5-question prompt (model, research, plan_check, verifier, branching)
- Config merging and writing
- Confirmation display with quick command references
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/settings.md
</execution_context>

<process>
**Follow the settings workflow** from `@~/.claude/get-shit-indexed/workflows/settings.md`.

The workflow handles all logic including:
1. Config file creation with defaults if missing
2. Current config reading
3. Interactive settings presentation with pre-selection
4. Answer parsing and config merging
5. File writing
6. Confirmation display
</process>

</document_content>
</document>
<document index="29">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\update.md</source>
<document_content>
﻿---
name: gsi:update
description: Update GSI to latest version with changelog display
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__start_process
---

<objective>
Check for GSI updates, install if available, and display what changed.

Routes to the update workflow which handles:
- Version detection (local vs global installation)
- npm version checking
- Changelog fetching and display
- User confirmation with clean install warning
- Update execution and cache clearing
- Restart reminder
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/update.md
</execution_context>

<process>
**Follow the update workflow** from `@~/.claude/get-shit-indexed/workflows/update.md`.

The workflow handles all logic including:
1. Installed version detection (local/global)
2. Latest version checking via npm
3. Version comparison
4. Changelog fetching and extraction
5. Clean install warning display
6. User confirmation
7. Update execution
8. Cache clearing
</process>

</document_content>
</document>
<document index="30">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\verify-work.md</source>
<document_content>
﻿---
name: gsi:verify-work
description: Validate built features through conversational UAT
argument-hint: "[phase number, e.g., '4']"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__write_file
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
---

<!--
CI Tools Usage:
- search_code_advanced: Find code patterns across project
- find_files: Discover plan/summary/verification files
- get_file_summary: Understand file structure
- get_symbol_body: Extract implementation details and function bodies
-->
<objective>
Validate built features through conversational testing with persistent state.

Purpose: Confirm what Claude built actually works from user's perspective. One test at a time, plain text responses, no interrogation. When issues are found, automatically diagnose, plan fixes, and prepare for execution.

Output: {phase}-UAT.md tracking all test results. If issues found: diagnosed gaps, verified fix plans ready for /gsi:execute-phase
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/verify-work.md
@~/.claude/get-shit-indexed/templates/UAT.md
</execution_context>

<context>
Phase: $ARGUMENTS (optional)
- If provided: Test specific phase (e.g., "4")
- If not provided: Check for active sessions or prompt for phase

@.planning/STATE.md
@.planning/ROADMAP.md
</context>

<process>
Execute the verify-work workflow from @~/.claude/get-shit-indexed/workflows/verify-work.md end-to-end.
Preserve all workflow gates (session management, test presentation, diagnosis, fix planning, routing).
</process>

</document_content>
</document>
<document index="31">
<source>C:\github-repos\my-claude-code-repos\get-shit-done-code-index\commands\gsi\yolo.md</source>
<document_content>
﻿---
name: yolo
description: Toggle YOLO mode for frictionless execution
color: magenta
examples:
  - Enable YOLO mode for current session
  - Disable YOLO mode
  - Check YOLO mode status
---

## Usage

```bash
# Enable YOLO mode
/gsi:yolo on

# Disable YOLO mode  
/gsi:yolo off

# Check status
/gsi:yolo
```

---

## Behavior

### YOLO Mode ON

When enabled, all checkpoints are auto-approved:

- **Verification checkpoints** - Auto-approve without waiting
- **Decision checkpoints** - Auto-select default option
- **Action checkpoints** - Skip with warning (true manual steps still required)

### YOLO Mode OFF

Normal checkpoint behavior:

- **Verification checkpoints** - Wait for "approved" response
- **Decision checkpoints** - Wait for option selection
- **Action checkpoints** - Wait for manual completion

---

## What is NOT Auto-Approved

Even in YOLO mode, these still require manual action:

- **Authentication gates** - CLI/API authentication errors
- **Actual failures** - Code errors, crashes, validation failures
- **Systemic issues** - Critical errors that stop execution

---

## Configuration

YOLO mode is stored in `.planning/config.json`:

```json
{
  "mode": "yolo"
}
```

When `mode: "yolo"`, all workflows skip confirmations and proceed automatically.

---

## Examples

### Enable YOLO for quick iteration

```bash
$ /gsi:yolo on
✓ YOLO mode enabled
$ /gsi:execute-phase 08
# Executes all tasks without checkpoint pauses
```

### Disable YOLO for careful execution

```bash
$ /gsi:yolo off
✓ YOLO mode disabled
$ /gsi:execute-phase 08
# Normal checkpoint behavior
```

### Check current status

```bash
$ /gsi:yolo
Current YOLO mode: off
```

---

## Safety

**⚠️ Use YOLO mode with caution:**

- Commits are made without manual review
- Verification steps are skipped
- Changes are applied immediately

**Best practices:**

- Use git branches for YOLO sessions
- Review commits before merging to main
- Keep recent backups
- Test in non-production environments first

---

## See Also

- `@get-shit-indexed/references/yolo-mode.md` - Full YOLO mode documentation
- `@.planning/config.json` - Configuration storage

---

*Command for GSI Phase 8 - Advanced Workflow Features*
</document_content>
</document>
</documents>
