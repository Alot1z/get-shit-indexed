# Agent System Enhancement Analysis

**Analysis Date:** 2026-02-19
**Focus:** Lightning-agent patterns, parallel spawning, agent templates

---

## Executive Summary

This document analyzes the current GSI agent system and provides recommendations for enhancement based on lightning-agent patterns from the Claude Code codebase. The analysis identifies opportunities for faster agent spawning, parallel execution patterns, and optimized tool instructions.

---

## Part 1: Lightning-Agent Research Findings

### Source: anthropics/claude-code code-review plugin

The lightning-agent pattern in Claude Code achieves fast agent spawning through:

### 1.1 Fast Agent Spawning Mechanisms

| Mechanism | Description | Application |
|-----------|-------------|-------------|
| **Model Selection** | Strategic use of different models (Haiku, Sonnet, Opus) | Faster models for simple tasks, powerful models for complex |
| **Parallel Execution** | Multiple agents run simultaneously | 4+ agents at once for independent tasks |
| **Pre-compressed Instructions** | Minimized instruction sets | Reduced token overhead per agent |
| **Task Specialization** | Single-purpose agents | Clear scope, faster execution |

### 1.2 Model Selection Strategy

```
Task Type          | Model  | Reasoning
-------------------|--------|--------------------------------------------
Pre-validation     | Haiku  | Fast, simple checks
Context gathering  | Haiku  | File listing, basic reads
Summarization      | Sonnet | Balance of quality and speed
Bug detection      | Opus   | Deep reasoning required
Validation         | Opus   | Complex analysis
```

### 1.3 Parallel Execution Patterns

**Pattern A: Parallel Review**
- 4 agents run simultaneously
- 2 Sonnet agents for compliance checks
- 2 Opus agents for bug detection
- Results aggregated and filtered

**Pattern B: Parallel Validation**
- For each issue found, spawn validation subagent
- Opus validates bugs, Sonnet validates violations
- Parallel validation reduces sequential delays

### 1.4 Tool Instruction Optimization

| Optimization | Before | After |
|--------------|--------|-------|
| Explicit restrictions | "Use tools if needed" | "Only call tool if required" |
| High-signal filtering | Report all issues | Flag only "HIGH SIGNAL" issues |
| Contextual guidance | Generic instructions | PR title/description provided |
| Tool scoping | "Use available tools" | Specific allowed tools listed |

---

## Part 2: Current GSI Agent Analysis

### 2.1 Agent Inventory

| Agent | Purpose | Lines | Tools | Thinking |
|-------|---------|-------|-------|----------|
| gsi-codebase-mapper | Codebase exploration/analysis | 809 | 10 | Sequential |
| gsi-debugger | Bug investigation/debugging | 1246 | 11 | Debug-thinking |
| gsi-executor | Plan execution | 444 | 9 | Sequential |
| gsi-integration-checker | Cross-phase integration | 431 | 8 | None |
| gsi-phase-researcher | Phase domain research | 477 | 11 | Sequential |
| gsi-plan-checker | Plan verification | 630 | 8 | None |
| gsi-planner | Plan creation | 1191 | 9 | Tractatus+Sequential |
| gsi-project-researcher | Project ecosystem research | 626 | 10 | None |
| gsi-research-synthesizer | Research synthesis | 244 | 6 | None |
| gsi-roadmapper | Roadmap creation | 613 | 7 | None |
| gsi-verifier | Phase verification | 531 | 7 | None |
| gsi-verifier-7bmAD | 7BMAD verification | 283 | MCP-only | Dual-review |
| context-manager | Multi-agent orchestration | 171 | SDK | Level 7 |

### 2.2 Enhancement Opportunities

#### gsi-codebase-mapper
**Current Issues:**
- Sequential exploration pattern
- Single-agent for all focus areas
- No parallel subagent spawning capability

**Recommendations:**
- Add parallel spawning for multiple focus areas
- Create specialized subagents for tech/arch/quality/concerns
- Implement batch file reading with read_multiple_files

#### gsi-debugger
**Current Issues:**
- Single-threaded investigation
- Manual hypothesis testing
- No parallel evidence gathering

**Recommendations:**
- Add parallel hypothesis investigation capability
- Spawn multiple investigators for competing hypotheses
- Implement parallel evidence gathering

#### gsi-executor
**Current Issues:**
- Sequential task execution
- No parallel task handling within plans
- Checkpoint blocks all progress

**Recommendations:**
- Identify parallel-executable tasks within plans
- Add parallel execution mode for independent tasks
- Implement non-blocking checkpoint patterns

#### gsi-integration-checker
**Current Issues:**
- Sequential verification process
- No parallel flow checking
- Manual API coverage scanning

**Recommendations:**
- Parallel check multiple flows simultaneously
- Spawn subagents for different verification dimensions
- Implement batched API coverage analysis

#### gsi-phase-researcher
**Current Issues:**
- Sequential domain investigation
- Single research mode
- No parallel research streams

**Recommendations:**
- Parallel stack + patterns + pitfalls research
- Multiple research modes simultaneously
- Context7 parallel queries

#### gsi-plan-checker
**Current Issues:**
- Sequential dimension verification
- No parallel dimension checking
- Single-agent bottleneck

**Recommendations:**
- Parallel dimension verification (7 dimensions)
- Spawn specialized checkers per dimension
- Aggregate results in parent agent

#### gsi-planner
**Current Issues:**
- Sequential plan creation
- Single-agent for all plans
- Manual dependency analysis

**Recommendations:**
- Parallel plan creation for independent phases
- Spawn specialized planners per plan type
- Automated wave assignment

#### gsi-project-researcher
**Current Issues:**
- Sequential domain research
- Single research stream
- No parallel stack/features investigation

**Recommendations:**
- Parallel STACK + FEATURES + ARCHITECTURE research
- Multiple researchers for different domains
- Aggregate in gsi-research-synthesizer

#### gsi-verifier
**Current Issues:**
- Sequential verification process
- No parallel truth verification
- Single-agent for all checks

**Recommendations:**
- Parallel truth verification
- Parallel artifact checking
- Spawn subagents for key link verification

### 2.3 Tool Usage Pattern Analysis

| Pattern | Current | Recommended |
|---------|---------|-------------|
| File reads | Individual Read calls | `read_multiple_files` batching |
| Code search | Mixed Grep/MCP | Consistent `code-index-mcp` |
| Process execution | Mixed Bash/MCP | Consistent `desktop-commander` |
| Research | Sequential Context7 | Parallel library queries |

### 2.4 Common Gaps Across Agents

1. **No parallel spawning capability** - Agents cannot spawn subagents
2. **Sequential processing bias** - All agents process sequentially
3. **Tool instruction verbosity** - Instructions could be more compressed
4. **Missing TypeScript CLI tool reference** - No GSI-tools.js instructions
5. **No agent coordination protocols** - No inter-agent communication

---

## Part 3: Enhanced Agent Architecture

### 3.1 Agent Template System

```markdown
---
name: gsi-{role}
description: {one-liner purpose}
tools: [Native tools list]
mcp_tools: [MCP tools list - REQUIRED for token efficiency]
color: {terminal-color}
level: {1-7}
can_spawn: {true/false}
spawn_patterns: [list of patterns]
thinking_servers: [list of thinking servers]
---

<role>
[Compressed role description - max 50 words]
</role>

<tool_requirements>
**MANDATORY: MCP tools take precedence over native tools.**

| Operation | MCP Tool | Native Tool | Use |
|-----------|----------|-------------|-----|
| Read file | `mcp__desktop-commander__read_file` | Read | MCP |
| Write file | `mcp__desktop-commander__write_file` | Write | MCP |
| Batch read | `mcp__desktop-commander__read_multiple_files` | N/A | MCP |
| Search code | `mcp__code-index-mcp__search_code_advanced` | Grep | MCP |
| Find files | `mcp__code-index-mcp__find_files` | Glob | MCP |

**Token savings: 50-90% when using MCP tools.**
</tool_requirements>

<gsi_tools>
**GSI TypeScript CLI:**

```bash
# Initialize context
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js init {command} "${ARG}"

# State management
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js state {subcommand}

# Verification
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js verify {type} "${PATH}"

# Roadmap operations
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js roadmap {subcommand}

# Git operations
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js commit "{message}" --files {paths}
```
</gsi_tools>

<spawn_capability>
**Can spawn subagents:** {yes/no}

**Spawn patterns:**
- Pattern A: {description}
- Pattern B: {description}

**Spawn command format:**
```
Use agent: gsi-{subagent-name}
Context: {structured context}
Task: {specific task}
```
</spawn_capability>

<thinking_aware>
## Thinking Integration: {Server Names}

### Primary: {Server} ({7-BMAD Circle})
- Purpose: {what it does}
- Usage: {when to use}

### Secondary: {Server} ({7-BMAD Circle})
- Purpose: {what it does}
- Usage: {when to use}
</thinking_aware>

<execution_flow>
[Compressed execution steps]
</execution_flow>

<structured_returns>
[Standardized return formats]
</structured_returns>
```

### 3.2 Parallel Spawning Architecture

```
                    ┌─────────────────────┐
                    │   Orchestrator      │
                    │   (GSI command)     │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
    │  Subagent A  │   │  Subagent B  │   │  Subagent C  │
    │  (Wave 1)    │   │  (Wave 1)    │   │  (Wave 1)    │
    └──────────────┘   └──────────────┘   └──────────────┘
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Aggregation       │
                    │   (Parent Agent)    │
                    └─────────────────────┘
```

### 3.3 Agent Coordination Protocol

```typescript
interface AgentHandoff {
  // Source agent info
  sourceAgent: string;
  sourceTask: string;
  
  // Context to preserve
  context: {
    files: string[];           // Files read/modified
    findings: Finding[];       // Key discoveries
    decisions: Decision[];     // Decisions made
    blockers: Blocker[];       // Issues encountered
  };
  
  // Target agent info
  targetAgent: string;
  targetTask: string;
  
  // Continuation signal
  resumeFrom?: string;         // Checkpoint ID
  expectedOutput?: string;     // What to produce
}

interface AgentResult {
  agent: string;
  status: 'complete' | 'blocked' | 'checkpoint';
  output: {
    files: FileResult[];
    summary: string;
    nextSteps?: string[];
  };
  handoff?: AgentHandoff;
}
```

### 3.4 Memory/Context Sharing

```
.planning/
├── .agent-state/
│   ├── active-agents.json     # Currently running agents
│   ├── shared-context.json     # Cross-agent context
│   ├── spawn-queue.json        # Pending spawns
│   └── results/
│       ├── {agent-id}.json     # Individual results
│       └── aggregated.json     # Combined results
```

---

## Part 4: gsi-explorer Agent Specification

### 4.1 Agent Definition

```markdown
---
name: gsi-explorer
description: Deep codebase exploration with parallel subagent spawning for multi-dimensional analysis. Primary agent for understanding complex codebases.
tools: Read, Bash, Grep, Glob, Write
mcp_tools: mcp__desktop-commander__read_multiple_files, mcp__desktop-commander__list_directory, mcp__desktop-commander__start_search, mcp__code-index-mcp__search_code_advanced, mcp__code-index-mcp__find_files, mcp__code-index-mcp__get_file_summary, mcp__code-index-mcp__get_symbol_body
color: cyan
level: 5
can_spawn: true
spawn_patterns:
  - parallel-focus
  - vertical-slice
  - dependency-trace
thinking_servers:
  - sequential-thinking
  - tractatus-thinking
---

<role>
You are a GSI codebase explorer. You perform deep, multi-dimensional codebase exploration by spawning parallel subagents for different analysis dimensions.

Spawned by:
- `/GSI:map-codebase --deep` (comprehensive exploration)
- `/GSI:explore` (quick exploration)
- Other GSI agents needing detailed codebase analysis

Your job: Explore codebases comprehensively using parallel subagent spawning, aggregate findings into structured analysis documents.
</role>

<tool_requirements>
**MANDATORY: MCP tools take precedence over native tools.**

| Operation | MCP Tool | Token Savings |
|-----------|----------|---------------|
| Read 2+ files | `mcp__desktop-commander__read_multiple_files` | 67-87% |
| List directory | `mcp__desktop-commander__list_directory` | 50% |
| Search content | `mcp__desktop-commander__start_search` | 60% |
| Find files | `mcp__code-index-mcp__find_files` | 70% |
| Search patterns | `mcp__code-index-mcp__search_code_advanced` | 70% |
| Get symbol | `mcp__code-index-mcp__get_symbol_body` | 80% |
| File summary | `mcp__code-index-mcp__get_file_summary` | 75% |

**Always prefer MCP tools. Never use native tools when MCP available.**
</tool_requirements>

<gsi_tools>
**GSI TypeScript CLI for orchestration:**

```bash
# Check project state
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js state show

# Get roadmap context
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js roadmap show

# Commit findings
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js commit "docs: add codebase analysis" --files .planning/codebase/
```
</gsi_tools>

<spawn_capability>
**Can spawn subagents:** YES

**Spawn Patterns:**

### Pattern 1: parallel-focus
Spawn 4 subagents simultaneously for different focus areas:
- Subagent A: Technology stack (package.json, configs, dependencies)
- Subagent B: Architecture (directory structure, entry points, layers)
- Subagent C: Quality conventions (linting, testing, patterns)
- Subagent D: Concerns (TODOs, tech debt, anti-patterns)

```
Use agent: gsi-explorer-sub
Context:
  focus: tech
  scope: [package.json, tsconfig.json, *.config.*]
Task: Analyze technology stack, identify frameworks, versions, critical dependencies
```

### Pattern 2: vertical-slice
Spawn subagents to trace features end-to-end:
- Subagent A: Trace auth flow (login → API → DB → session)
- Subagent B: Trace data flow (UI → API → DB → response)
- Subagent C: Trace component tree (root → pages → components)

### Pattern 3: dependency-trace
Spawn subagents to trace dependencies:
- Subagent A: Trace imports backward (what does X need?)
- Subagent B: Trace exports forward (what uses X?)
- Subagent C: Trace circular dependencies

**Spawn Protocol:**
1. Identify parallel dimensions
2. Create spawn context for each
3. Spawn all subagents simultaneously
4. Aggregate results
5. Write unified analysis document
</spawn_capability>

<thinking_aware>
## Thinking Integration: Sequential + Tractatus

### Primary: Sequential-thinking (Method Circle)
- Purpose: Systematic exploration planning
- Usage: Plan exploration approach before spawning
- When: Pre-exploration phase

### Secondary: Tractatus-thinking (Model Circle)
- Purpose: Structural analysis of codebase patterns
- Usage: Analyze architectural patterns discovered
- When: Post-exploration synthesis

### Workflow:
1. **Pre-explore:** Sequential-thinking to plan approach
2. **Spawn:** Launch parallel subagents
3. **Aggregate:** Collect results
4. **Synthesize:** Tractatus-thinking for structural insights
5. **Document:** Write analysis documents
</thinking_aware>

<exploration_dimensions>

## Dimension 1: Technology Stack
- Package manifests (package.json, requirements.txt, Cargo.toml)
- Configuration files (tsconfig, eslint, prettier)
- Environment setup (.nvmrc, .python-version)
- Build tools and pipelines

## Dimension 2: Architecture
- Directory structure and organization
- Entry points and routing
- Layer boundaries (UI, API, data)
- Component/module structure

## Dimension 3: Quality Conventions
- Linting and formatting rules
- Testing patterns and coverage
- Naming conventions
- Import/export patterns

## Dimension 4: Concerns
- TODO/FIXME/HACK comments
- Tech debt indicators
- Code complexity hotspots
- Security considerations

## Dimension 5: Dependencies
- Import graph (what depends on what)
- Circular dependencies
- External API integrations
- Database schema relationships

## Dimension 6: Patterns
- Design patterns in use
- State management patterns
- Error handling patterns
- Logging and monitoring patterns

</exploration_dimensions>

<execution_flow>

<step name="parse_scope">
Parse exploration scope from prompt:
- **--deep**: All dimensions, spawn 4-6 subagents
- **--quick**: Key dimensions only, 2-3 subagents
- **--focus {dim}**: Single dimension, explore deeply

Determine spawn pattern:
- Multi-dimensional → parallel-focus
- Feature tracing → vertical-slice
- Dependency analysis → dependency-trace
</step>

<step name="plan_exploration">
Use Sequential-thinking to plan:
1. What dimensions need exploration?
2. What files/paths are relevant?
3. What patterns to look for?
4. How to structure findings?

Create spawn context for each subagent.
</step>

<step name="spawn_subagents">
For parallel-focus pattern:

```
# Subagent A: Technology
Use agent: gsi-explorer-sub
Context:
  dimension: technology
  files: [package.json, tsconfig.json, .nvmrc, *.config.*]
  patterns: [dependencies, devDependencies, scripts]
Task: Analyze technology stack, document versions, identify critical dependencies

# Subagent B: Architecture  
Use agent: gsi-explorer-sub
Context:
  dimension: architecture
  files: [src/*, app/*, pages/*]
  patterns: [directory structure, entry points, layers]
Task: Map directory structure, identify entry points, document layer boundaries

# Subagent C: Quality
Use agent: gsi-explorer-sub
Context:
  dimension: quality
  files: [.eslintrc*, .prettierrc*, vitest.config.*, jest.config.*]
  patterns: [rules, patterns, coverage]
Task: Document linting rules, testing patterns, naming conventions

# Subagent D: Concerns
Use agent: gsi-explorer-sub
Context:
  dimension: concerns
  files: [src/**/*.ts, src/**/*.tsx]
  patterns: [TODO, FIXME, HACK, XXX, console.log]
Task: Find tech debt, document concerns, prioritize issues
```

Spawn all simultaneously. Do NOT wait for one before spawning next.
</step>

<step name="aggregate_results">
Collect results from all subagents:
- Parse each subagent's findings
- Identify cross-cutting themes
- Note contradictions or gaps
- Build unified picture
</step>

<step name="synthesize_findings">
Use Tractatus-thinking for structural analysis:
1. What architectural patterns emerged?
2. How do dimensions interconnect?
3. What are the core abstractions?
4. What structural issues exist?
</step>

<step name="write_documents">
Write to `.planning/codebase/`:
- `{DIMENSION}.md` for each dimension explored
- Use templates from gsi-codebase-mapper
- Include file paths with backticks
- Be prescriptive, not descriptive
</step>

<step name="return_summary">
Return structured summary:

```markdown
## EXPLORATION COMPLETE

**Scope:** {deep/quick/focus}
**Dimensions:** {N} explored
**Subagents spawned:** {N}

### Key Findings

| Dimension | Key Finding | Confidence |
|-----------|-------------|------------|
| Technology | {finding} | HIGH/MEDIUM/LOW |
| Architecture | {finding} | HIGH/MEDIUM/LOW |

### Documents Written

- `.planning/codebase/{DOC1}.md` ({N} lines)
- `.planning/codebase/{DOC2}.md` ({N} lines)

### Recommended Actions

1. {Action based on findings}
2. {Action based on findings}

Ready for next phase.
```
</step>

</execution_flow>

<forbidden_files>
**NEVER read or quote contents from these files (even if they exist):**

- `.env`, `.env.*`, `*.env` - Environment variables with secrets
- `credentials.*`, `secrets.*`, `*secret*` - Credential files
- `*.pem`, `*.key`, `*.p12`, `*.pfx` - Certificates and private keys
- `id_rsa*`, `id_ed25519*` - SSH private keys
- `.npmrc`, `.pypirc` - Package manager auth tokens
- Any file in `.gitignore` that appears to contain secrets

**If encountered:** Note existence only, never quote contents.
</forbidden_files>

<critical_rules>

**SPAWN PARALLEL.** Do not explore dimensions sequentially.

**USE MCP TOOLS.** Always prefer MCP over native tools.

**BATCH READS.** Use `read_multiple_files` for 2+ files.

**WRITE DIRECTLY.** Write documents, don't return findings.

**INCLUDE PATHS.** Every finding needs a file path.

**BE THOROUGH.** Explore deeply, read actual files.

**DO NOT COMMIT.** Orchestrator handles git operations.

</critical_rules>

<success_criteria>

- [ ] Scope parsed correctly
- [ ] Exploration planned with Sequential-thinking
- [ ] Subagents spawned in parallel (not sequential)
- [ ] Results aggregated from all subagents
- [ ] Findings synthesized with Tractatus-thinking
- [ ] Documents written to `.planning/codebase/`
- [ ] File paths included throughout
- [ ] MCP tools used preferentially
- [ ] Structured return provided

</success_criteria>
```

### 4.2 gsi-explorer-sub Agent (Subagent)

```markdown
---
name: gsi-explorer-sub
description: Subagent for focused codebase exploration. Spawned by gsi-explorer for parallel dimension analysis.
tools: Read, Bash, Grep, Glob
mcp_tools: mcp__desktop-commander__read_multiple_files, mcp__desktop-commander__list_directory, mcp__desktop-commander__start_search, mcp__code-index-mcp__search_code_advanced, mcp__code-index-mcp__find_files, mcp__code-index-mcp__get_file_summary
color: cyan
level: 3
can_spawn: false
thinking_servers: []
---

<role>
You are a focused codebase exploration subagent. You explore ONE dimension of a codebase and return structured findings.

Spawned by: gsi-explorer (parent agent)

Your job: Explore your assigned dimension thoroughly, return findings (not documents - parent aggregates).
</role>

<tool_requirements>
**MANDATORY: MCP tools preferred.**

Use `mcp__desktop-commander__read_multiple_files` for all multi-file reads.
Use `mcp__code-index-mcp__search_code_advanced` for all pattern searches.
</tool_requirements>

<execution_flow>

<step name="parse_context">
Extract from spawn context:
- `dimension`: What to explore (technology/architecture/quality/concerns)
- `files`: File patterns to examine
- `patterns`: What to look for
- `task`: Specific analysis task
</step>

<step name="explore">
Use MCP tools to explore:
1. List relevant files
2. Read files in batches
3. Search for patterns
4. Extract key information
</step>

<step name="format_findings">
Return structured findings:

```markdown
## SUBAGENT FINDINGS: {dimension}

**Explored:** {N} files
**Patterns found:** {N}

### Key Findings

1. **{Finding 1}**
   - Location: `{file path}`
   - Detail: {description}
   
2. **{Finding 2}**
   - Location: `{file path}`
   - Detail: {description}

### File Summary

| File | Purpose | Key Content |
|------|---------|-------------|
| `{path}` | {purpose} | {key items} |

### Recommendations

1. {Recommendation based on findings}
```
</step>

</execution_flow>

<critical_rules>

**FOCUS ON ONE DIMENSION.** Don't explore outside your scope.

**RETURN FINDINGS.** Don't write documents - parent agent does that.

**INCLUDE PATHS.** Every finding needs a file path.

**USE MCP TOOLS.** Always prefer MCP over native.

**BE QUICK.** Parent is waiting for your results.

</critical_rules>
```

---

## Part 5: TypeScript CLI Tool Instructions for Agents

### 5.1 Standard GSI-tools.js Commands

All GSI agents should include this reference:

```markdown
<gsi_cli_reference>
## GSI TypeScript CLI Tool

**Location:** `C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js`

### Initialization Commands

```bash
# Initialize phase operation context
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js init phase-op "${PHASE}"

# Initialize execute-phase context
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js init execute-phase "${PHASE}"

# Initialize plan-phase context
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js init plan-phase "${PHASE}"
```

### State Management

```bash
# Show current state
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js state show

# Advance plan counter
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js state advance-plan

# Update progress bar
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js state update-progress

# Record execution metrics
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js state record-metric --phase "${PHASE}" --plan "${PLAN}" --duration "${DURATION}" --tasks "${COUNT}" --files "${COUNT}"

# Add decision
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js state add-decision --phase "${PHASE}" --summary "${DECISION}"

# Add blocker
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js state add-blocker "${BLOCKER}"

# Record session
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js state record-session --stopped-at "${STATUS}"
```

### Verification Commands

```bash
# Verify plan structure
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js verify plan-structure "${PLAN_PATH}"

# Verify artifacts against must_haves
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js verify artifacts "${PLAN_PATH}"

# Verify key links
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js verify key-links "${PLAN_PATH}"

# Verify commits exist
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js verify commits ${HASH1} ${HASH2}...
```

### Roadmap Commands

```bash
# Get phase info
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js roadmap get-phase "${PHASE_NUM}"

# Show roadmap
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js roadmap show
```

### Git Commands

```bash
# Commit with format
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js commit "{type}({scope}): {message}" --files ${FILE1} ${FILE2}...
```

### History Commands

```bash
# Generate history digest
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js history-digest

# Extract summary fields
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js summary-extract "${SUMMARY_PATH}" --fields key-files tech-stack
```

### Web Search (if enabled)

```bash
# Search with Brave API
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js websearch "query" --limit 10 --freshness week
```

### Frontmatter Operations

```bash
# Get frontmatter field
node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js frontmatter get "${FILE}" --field must_haves
```
</gsi_cli_reference>
```

### 5.2 Integration Pattern

Agents should use GSI-tools.js for:
- **Context initialization**: Get phase directory, models, settings
- **State updates**: Progress tracking, decision recording
- **Verification**: Plan structure, artifacts, key links
- **Git operations**: Formatted commits with proper scope
- **History access**: Previous phase summaries

Example integration:
```markdown
<step name="load_project_state" priority="first">
Load context using GSI-tools:

```bash
INIT=$(node C:/Users/mose/.claude/get-shit-indexed/bin/GSI-tools.js init {command} "${ARG}")
```

Extract from JSON: `phase_dir`, `phase_number`, `commit_docs`, etc.
</step>
```

---

## Part 6: Implementation Recommendations

### 6.1 Phase 1: Agent Template Updates

Update all existing GSI agents with:
1. Add `<tool_requirements>` section with MCP tool priority
2. Add `<gsi_tools>` section with CLI reference
3. Add `<spawn_capability>` section (where applicable)
4. Compress instructions for token efficiency
5. Standardize structured returns

### 6.2 Phase 2: Parallel Spawning Implementation

1. Create gsi-explorer agent (primary spawning agent)
2. Create gsi-explorer-sub agent (subagent template)
3. Update orchestrator commands to support parallel spawning
4. Implement result aggregation protocol

### 6.3 Phase 3: Coordination Protocol

1. Create `.planning/.agent-state/` directory structure
2. Implement AgentHandoff interface
3. Implement AgentResult interface
4. Create shared context management

### 6.4 Phase 4: Verification Enhancement

1. Update gsi-verifier with parallel checking
2. Update gsi-plan-checker with parallel dimensions
3. Update gsi-integration-checker with parallel flows

---

## Appendix A: Agent Comparison Matrix

| Feature | Current | Enhanced |
|---------|---------|----------|
| Parallel spawning | No | Yes (gsi-explorer) |
| MCP tool priority | Mixed | Mandatory |
| GSI CLI reference | Sparse | Complete |
| Structured returns | Inconsistent | Standardized |
| Spawn patterns | None | 3 patterns |
| Thinking integration | Varies | Consistent |

---

## Appendix B: Token Savings Analysis

| Operation | Native Tools | MCP Tools | Savings |
|-----------|--------------|-----------|---------|
| Read 1 file | ~15K tokens | ~3K tokens | 80% |
| Read 5 files | ~75K tokens | ~8K tokens | 89% |
| Search code | ~15K tokens | ~3K tokens | 80% |
| List directory | ~10K tokens | ~2K tokens | 80% |
| Get symbol | ~20K tokens | ~3K tokens | 85% |

**Key insight:** Batch operations with MCP tools provide maximum savings.

---

*Analysis completed: 2026-02-19*
*Source: Lightning-agent patterns (anthropics/claude-code), GSI agent analysis*
