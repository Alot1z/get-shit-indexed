---
name: gsi:claudeception
description: Self-improving knowledge extraction that creates skills, agents, logic, functions, and features from conversation patterns
argument-hint: "[optional: scope - 'conversation' | 'file:<path>' | 'directory:<path>' | 'auto']"
allowed-tools:
  # Desktop Commander MCP - File operations
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__read_multiple_files
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__desktop-commander__start_search
  - mcp__desktop-commander__get_file_info
  # Code-Index MCP - Code analysis
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - mcp__code-index-mcp__build_deep_index
  # CodeGraphContext - Relationship analysis
  - mcp__CodeGraphContext__find_code
  - mcp__CodeGraphContext__analyze_code_relationships
  # Thinking servers
  - mcp__sequential-thinking__sequentialthinking
  - mcp__tractatusthinking__tractatus_thinking
  - mcp__debug-thinking__debug_thinking
  # Orchestration
  - Task
  - AskUserQuestion
thinking_phase:
  mode: COMPREHENSIVE
  servers:
    - name: tractatus
      purpose: "Analyze knowledge structure and artifact relationships"
      timeout: 10000
    - name: sequential
      purpose: "Plan extraction and generation steps"
      timeout: 8000
    - name: debug
      purpose: "Quality verification and pattern validation"
      timeout: 5000
  bmad_enabled: true
  rationale: |
    Claudeception requires:
    1. Tractatus for analyzing pattern structure and artifact taxonomy
    2. Sequential for planning multi-type artifact generation
    3. Debug for quality gates and effectiveness tracking
    
    This ensures extracted knowledge is:
    - Structurally sound and well-organized
    - Generated in correct dependency order
    - Quality-verified before storage
  integration: "Pre-extraction structure analysis, per-artifact planning, post-generation verification"
---

# GSI Claudeception

<!--
CI Tools Usage:
- search_code_advanced: Find similar patterns in codebase
- find_files: Locate relevant source files
- get_file_summary: Understand file structure
- get_symbol_body: Extract function implementations
- build_deep_index: Fresh symbol extraction for analysis

CodeGraphContext Usage:
- find_code: Fuzzy discovery of related code
- analyze_code_relationships: Understand dependencies

Debug-thinking Usage:
- create: Store extracted patterns as knowledge nodes
- connect: Link related patterns and artifacts
- query: Find similar existing patterns
-->

<objective>
Extract knowledge from conversations and codebase patterns to create reusable artifacts: skills, agents, logic functions, features, improvements, and ideas. Every successful pattern becomes a building block for future sessions.

**Orchestrator role:** Initialize context, analyze scope, spawn GSI-extractor agents for parallel extraction, review artifacts, store in knowledge base.

**Why subagent:** Pattern analysis burns context (reading files, forming abstractions, generating code). Fresh 200k context per extraction focus area.

**Knowledge persistence:** Debug-thinking MCP stores patterns across sessions; skills/agents stored in knowledge base.
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
Scope: $ARGUMENTS (defaults to 'conversation' if not provided)

**Load GSI state:**
```bash
node ~/.claude/get-shit-indexed/bin/GSI-tools.js state load
```

**Load project context if exists:**
@.planning/STATE.md
@.planning/ROADMAP.md
</context>

<when_to_use>
**Use gsi:claudeception for:**
- After solving a non-trivial problem (extract the solution pattern)
- After discovering a reusable workflow (extract as skill)
- After identifying code that could be generalized (extract as logic)
- After having an idea worth preserving (extract as idea/feature)
- After noticing a repeated pattern (extract for automation)

**Skip gsi:claudeception for:**
- Simple lookups or documentation references
- One-time ad-hoc solutions
- Untested or unverified approaches
- Trivial changes with no pattern value
</when_to_use>

<process>

## 0. Initialize Context

### Thinking Phase: Pre-Workflow

<server>tractatus</server>
<prompt>Analyze the extraction scope:
1. What type of knowledge might be extractable?
2. What artifact types are most likely?
3. What quality gates should apply?</prompt>
<expected_output>Extraction strategy with artifact priorities</expected_output>
<timeout>5000</timeout>

Load GSI state and resolve extractor model:
```bash
INIT=$(node ~/.claude/get-shit-indexed/bin/GSI-tools.js state load)
EXTRACTOR_MODEL=$(node ~/.claude/get-shit-indexed/bin/GSI-tools.js resolve-model GSI-extractor --raw)
```

Query debug-thinking for similar patterns:
```
action: query
queryType: similar-problems
parameters: {pattern: "$ARGUMENTS", limit: 5, minSimilarity: 0.4}
```

If similar patterns exist, show them and ask whether to:
- Create new artifact (different enough)
- Enhance existing artifact
- Skip extraction (already covered)

## Phase 1: ANALYZE (Tractatus - Structure Analysis)

First, understand what knowledge exists in the conversation or codebase.

### Step 1.1: Identify Extractable Patterns

### Thinking Phase: Pre-Step - Pattern Discovery

<server>tractatus</server>
<prompt>Analyze for extractable patterns:
1. What patterns emerged in this session/scope?
2. What problems were solved?
3. What techniques were discovered?
4. What domain knowledge was applied?</prompt>
<expected_output>Pattern candidates with categories</expected_output>
<timeout>8000</timeout>

### Step 1.2: Categorize Knowledge
Classify each pattern by:
- **Domain**: debugging, planning, coding, testing, deployment
- **Complexity**: simple, moderate, complex
- **Reusability**: specific, general, universal
- **Artifact Type**: which of 6 types fits best

### Step 1.3: Quality Assessment

### Thinking Phase: Post-Step - Quality Check

<server>debug</server>
<prompt>Apply quality gates:
1. Is this tested/verified?
2. Is this more than just docs lookup?
3. Would this help in 6 months?
4. Is this transferable?</prompt>
<expected_output>Pass/fail decision for each pattern</expected_output>
<timeout>3000</timeout>

For each pattern, verify:
- Is this tested/verified? (MUST BE YES)
- Is this more than just docs lookup? (MUST BE YES)
- Would this help in 6 months? (MUST BE YES)
- Is this project-specific or transferable? (PREFER TRANSFERABLE)

If any answer is NO, skip extraction.

## Phase 2: EXTRACT (Sequential - Step Processing)

### Step 2.1: Spawn GSI-extractor Agents

### Thinking Phase: Pre-Step - Extraction Planning

<server>sequential</server>
<prompt>Plan the extraction:
1. What artifacts should each agent generate?
2. What dependencies exist between artifacts?
3. What storage locations are needed?</prompt>
<expected_output>Extraction plan with agent assignments</expected_output>
<timeout>5000</timeout>

For each pattern type, spawn an extractor agent:

```
Task(
  prompt="""
  <objective>
  Extract {artifact_type} from: {pattern_description}
  </objective>
  
  <scope>
  Source: {scope_details}
  Pattern: {pattern_identified}
  Quality: Verified, reusable, tested
  </scope>
  
  <output>
  Create artifact at: {storage_path}
  Format: {artifact_format}
  Cross-reference: {related_artifacts}
  </output>
  
  <knowledge_context>
  Pattern ID: {pattern_id}
  Similar patterns: {similar_pattern_ids}
  </knowledge_context>
  """,
  subagent_type="GSI-extractor",
  model="{extractor_model}",
  description="Extract {artifact_type}"
)
```

### Step 2.2: Artifact Templates by Type

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

### Step 2.3: Store in Knowledge Base

### Thinking Phase: Post-Step - Storage Verification

<server>debug</server>
<prompt>Verify artifact storage:
1. Was artifact created successfully?
2. Is format correct?
3. Are cross-references valid?</prompt>
<expected_output>Storage confirmation</expected_output>
<timeout>2000</timeout>

Store artifacts in appropriate locations:
- `~/.claude/skills/` for skills
- `~/.claude/agents/` for agents  
- `lib/knowledge-base/patterns/` for patterns
- `lib/generated/` for logic functions
- `.planning/features/` for feature specs

Create debug-thinking nodes:
```
action: create
nodeType: solution
content: {artifact description}
metadata: {type, pattern_id, created_date, effectiveness: 0}
```

## Phase 3: GENERATE (Multi-Type Creation)

### Step 3.1: Check for Multi-Type Potential
One pattern can generate multiple artifacts:
- Debugging pattern → SKILL + AGENT + LOGIC
- Workflow pattern → SKILL + FEATURE
- Architecture pattern → IDEA + FEATURE

### Step 3.2: Generate All Applicable Types

### Thinking Phase: Pre-Step - Multi-Type Planning

<server>sequential</server>
<prompt>Plan multi-type generation:
1. What secondary artifact types apply?
2. What's the generation order?
3. What cross-references are needed?</prompt>
<expected_output>Multi-type generation plan</expected_output>
<timeout>5000</timeout>

For high-value patterns, spawn additional extractors for each applicable type.

### Step 3.3: Cross-Reference
Link related artifacts:
```
action: connect
from: {primary_pattern_id}
to: {secondary_pattern_id}
type: generates
strength: 0.8
```

## Phase 4: INTEGRATE (Debug - Verification)

### Step 4.1: Verify Generated Artifacts

### Thinking Phase: Pre-Step - Integration Check

<server>debug</server>
<prompt>Verify integration readiness:
1. Are all artifacts syntactically correct?
2. Do references resolve?
3. Is the artifact usable?</prompt>
<expected_output>Integration readiness assessment</expected_output>
<timeout>5000</timeout>

For each artifact:
- Syntax check
- Type check (for code)
- Reference validity
- Integration test

### Step 4.2: Add to GSI System
- Register skill in settings.json if applicable
- Add CLI command if feature
- Update documentation

### Step 4.3: Track Effectiveness
Store in debug-thinking graph:
```
action: create
nodeType: learning
content: {extraction summary}
metadata: {pattern_id, artifact_types, created_date, effectiveness: 0}
```

## Phase 5: LEARN (Continuous Improvement)

### Thinking Phase: Post-Workflow

<server>debug</server>
<prompt>Capture extraction learnings:
1. What extraction patterns worked well?
2. What artifact types were most useful?
3. How can quality gates be improved?</prompt>
<expected_output>Extraction improvement insights</expected_output>
<timeout>3000</timeout>

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
- [ ] GSI state loaded and model resolved
- [ ] Similar patterns queried from debug-thinking
- [ ] Scope analyzed for extractable patterns
- [ ] Quality gates applied (verified, tested, reusable)
- [ ] GSI-extractor agents spawned for each artifact type
- [ ] Artifacts generated and stored correctly
- [ ] Cross-references created between related artifacts
- [ ] Effectiveness tracking enabled in debug-thinking
- [ ] User knows available claudeception CLI commands
</success_criteria>

<error_recovery>

## Common Issues and Solutions

### Issue: No Extractable Patterns Found
- Pattern may be too simple or specific
- Check if pattern meets quality gates
- Consider combining with related patterns
- Document why extraction was skipped

### Issue: Similar Pattern Already Exists
- Offer to enhance existing pattern instead
- Check if new pattern adds unique value
- Consider merging patterns if similar enough
- Create variant if different context applies

### Issue: Artifact Storage Fails
- Check directory permissions
- Verify path exists or can be created
- Use fallback storage location
- Log error for debugging

### Issue: Quality Gate Fails
- Document why pattern failed quality check
- Suggest what would make it pass
- Offer to extract as lower-priority IDEA
- Track for future enhancement

### Issue: Multi-Type Generation Conflicts
- Prioritize artifact types by usefulness
- Generate primary type first
- Queue secondary types for later
- Document dependencies between types

</error_recovery>

<cli_commands>
After integration, these commands become available:
- `gsi claudeception extract` - Extract from current session
- `gsi claudeception analyze <path>` - Analyze codebase for patterns
- `gsi claudeception generate <pattern-id> <type>` - Generate specific artifact
- `gsi claudeception status` - Show knowledge base stats
- `gsi claudeception learn` - Trigger learning from history
</cli_commands>
