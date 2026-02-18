# Phase 49-50 Architecture Analysis

---
created: 2026-02-18
agent: gsi-codebase-mapper
status: complete
priority: CRITICAL
---

## Executive Summary

This document provides a comprehensive analysis of Phase 49 (GSI Architecture Overhaul) and Phase 50 (Ultimate Integration), breaking down objectives into executable sub-phases with dependencies, execution waves, and verification criteria.

**Critical Finding**: The GSI system has accumulated significant technical debt with 40+ phases, disconnected modules, and native tool usage instead of optimized MCP tools. Phases 49-50 represent the culmination of the stabilization and integration effort.

## Phase 49: GSI Architecture Overhaul

### Overview

**Purpose**: Rectify critical system failures where GSI tools exist but are underutilized, enforce proper tool precedence, and absorb external repositories.

**Dependencies**: Phase 41 (Rectification), Phase 47 (Architecture Rectification)

**Total Estimated Tasks**: 66

---

### Objective 1: gsi-explorer Agent Implementation

**Status**: New Creation Required
**Source Template**: Fork from `commands/gsi/map-codebase.md`
**Critical Requirement**: MCP-ONLY tool usage

#### Sub-Phase Breakdown

| Sub-Phase | Task Count | Description | Dependencies |
|-----------|------------|-------------|--------------|
| 49-01-A | 5 | Agent Foundation | None |
| 49-01-B | 4 | lib/ Analysis | 49-01-A |
| 49-01-C | 3 | Hook Analysis | 49-01-A |
| 49-01-D | 3 | Command/Workflow Analysis | 49-01-B, 49-01-C |

#### Execution Waves

**Wave 1: Agent Foundation**
```
Task 1: Create commands/gsi/explorer.md
  - Define allowed-tools (DC, CI, CG MCP only)
  - Set up execution context
  - Define output format
  
Task 2: Fork logic from map-codebase.md
  - Copy wave-based spawning pattern
  - Adapt for gap analysis
  - Preserve MCP-only restrictions
  
Task 3: Define gap detection patterns
  - Pattern: Module exists but no invocations
  - Pattern: Native tool usage in GSI context
  - Pattern: Broken reference chains
  
Task 4: Create agent spawn configuration
  - Configure parallel module scanning
  - Set up result aggregation
  - Define report generation format
  
Task 5: Implement --cxml output support
  - Use files-to-prompt --cxml
  - Generate Claude Code XML format
  - Update workflow context loading
```

**Wave 2: lib/ Analysis**
```
Task 6: Scan lib/prompt-enhancer/
  - Check connections to other modules
  - Identify unused enhancement patterns
  
Task 7: Scan lib/pattern-learning/
  - Verify pattern storage mechanism
  - Check pattern retrieval usage
  
Task 8: Scan lib/complexity/
  - Check if data feeds prompt-enhancer
  - Verify threshold usage
  
Task 9: Scan lib/gsi-integration/
  - Map all integration points
  - Identify missing connections
```

**Wave 3: Hook Analysis**
```
Task 10: Analyze hooks/pre-tool-use/
  - Check for native tool blocking
  - Verify MCP tool routing
  
Task 11: Analyze hooks/post-tool-use/
  - Check pattern capture
  - Verify knowledge extraction
  
Task 12: Map hook-to-module connections
  - pre-tool-use → gsi-integration
  - post-tool-use → pattern-learning
```

**Wave 4: Report Generation**
```
Task 13: Scan commands/gsi/ for tool usage
  - Identify commands using native tools
  - Flag commands needing updates
  
Task 14: Generate Gap Analysis Report
  - Compile all findings
  - Prioritize by impact
  - Create remediation roadmap
```

#### Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `commands/gsi/explorer.md` | CREATE | New command definition |
| `agents/gsi-explorer.json` | CREATE | Agent configuration |
| `.planning/phases/49-*/GAP-ANALYSIS-REPORT.md` | CREATE | Analysis output |

#### Verification Criteria

- [ ] `gsi-explorer` command runs using only MCP tools
- [ ] All lib/ modules scanned for integration status
- [ ] All hooks analyzed for enforcement gaps
- [ ] Knowledge flow mapped (Pattern Learning ↔ Complexity ↔ Prompt Enhancer)
- [ ] Gap Analysis Report generated with prioritized fixes

---

### Objective 2: Tool Precedence Enforcement

**Status**: Enhancement Required
**Problem**: Native tools execute instead of GSI enhancements

#### Sub-Phase Breakdown

| Sub-Phase | Task Count | Description | Dependencies |
|-----------|------------|-------------|--------------|
| 49-02-A | 4 | Hook Configuration | 49-01 |
| 49-02-B | 4 | Module Updates | 49-02-A |
| 49-02-C | 4 | Enforcement Testing | 49-02-B |

#### Execution Waves

**Wave 1: Hook Configuration**
```
Task 1: Update hooks/hooks.json
  - Add native tool blocking rules
  - Add MCP tool routing rules
  
Task 2: Update pre-tool-use/mcp-enforcer.js
  - Intercept native Read/Write/Edit
  - Redirect to Desktop Commander MCP
  
Task 3: Update pre-tool-use/bash-redirect.js
  - Intercept Bash commands
  - Redirect to DC start_process
  
Task 4: Create tool-precedence-validator.js
  - Validate tool calls match precedence
  - Log violations for debugging
```

**Wave 2: Module Updates**
```
Task 5: Update lib/gsi-integration/index.js
  - Add tool precedence checks
  - Integrate with enforcement layer
  
Task 6: Update lib/prompt-enhancer/index.js
  - Force enhancement on all inputs
  - Add bypass mechanism for YOLO mode
  
Task 7: Update lib/pattern-learning/index.js
  - Capture tool usage patterns
  - Feed into optimization suggestions
  
Task 8: Create lib/tool-precedence/index.js
  - Centralized precedence management
  - Tool call interception API
```

**Wave 3: Enforcement Testing**
```
Task 9: Create test-tool-precedence.js
  - Test native tool blocking
  - Test MCP tool routing
  
Task 10: Create test-gsi-flows.js
  - Test default activation
  - Test without explicit prompting
  
Task 11: Run Phase 44-46 using GSI planning flow
  - Verify planning tools used
  - Verify native Write replaced
  
Task 12: Generate enforcement report
  - Document pass/fail rates
  - Identify remaining gaps
```

#### Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `hooks/hooks.json` | MODIFY | Add blocking rules |
| `hooks/pre-tool-use/mcp-enforcer.js` | MODIFY | Enhanced enforcement |
| `lib/tool-precedence/index.js` | CREATE | Centralized management |
| `scripts/test-tool-precedence.js` | CREATE | Validation tests |

#### Verification Criteria

- [ ] Native tools blocked when MCP available
- [ ] MCP tools routed correctly
- [ ] GSI flows activate by default
- [ ] Phase 44-46 execution uses GSI planning
- [ ] Enforcement tests pass 100%

---

### Objective 3: External Repository Absorption

**Status**: Research Required
**Source**: https://github.com/obra/superpowers and others

#### Sub-Phase Breakdown

| Sub-Phase | Task Count | Description | Dependencies |
|-----------|------------|-------------|--------------|
| 49-03-A | 4 | files-to-prompt Integration | None |
| 49-03-B | 3 | MCP Server Bundling | 49-03-A |
| 49-03-C | 3 | TypeScript CLI | 49-03-B |
| 49-03-D | 2 | Distribution Research | 49-03-C |

#### Execution Waves

**Wave 1: files-to-prompt Integration**
```
Task 1: Clone files-to-prompt
  - git clone to lib/files-to-prompt/
  - Preserve original attribution
  
Task 2: Convert to TypeScript
  - Rename files_to_prompt.py → files-to-prompt.ts
  - Add type definitions
  - Create index.ts entry point
  
Task 3: Add GSI-specific features
  - --cxml flag (Claude Code XML)
  - --gsi mode (GSI output structure)
  - --output-dir (.planning/context/)
  - --watch (continuous updates)
  
Task 4: Integrate with gsi-tools CLI
  - Add generate-context command
  - Map to files-to-prompt --cxml
```

**Wave 2: MCP Server Bundling**
```
Task 5: Audit MCP dependencies
  - List all MCP servers GSI depends on
  - Identify bundle vs external candidates
  
Task 6: Create bundled structure
  - lib/mcp-servers/desktop-commander/
  - lib/mcp-servers/code-index-mcp/
  - lib/mcp-servers/gsi-custom/
  
Task 7: Create gsi-custom MCP server
  - gsi_analyze_gaps
  - gsi_generate_context
  - gsi_enhance_prompt
```

**Wave 3: TypeScript CLI Tools**
```
Task 8: Create unified gsi-tools CLI
  - phases list
  - roadmap get-phase
  - state-snapshot
  - generate-context
  - install-hooks
  
Task 9: Convert scripts to TypeScript
  - scripts/install-hooks.js → .ts
  - All hooks → TypeScript
  - All utilities → TypeScript
  
Task 10: Build system setup
  - tsconfig.json
  - dist/ output
  - Type declarations
```

**Wave 4: Distribution Research**
```
Task 11: Research electrobun
  - Evaluate for desktop bundling
  - Document build process
  
Task 12: Create distribution plan
  - NPM package (primary)
  - Desktop app (electrobun)
  - Docker image (optional)
```

#### Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `lib/files-to-prompt/index.ts` | CREATE | Forked & customized |
| `lib/files-to-prompt/formatters/cxml.ts` | CREATE | Claude Code XML |
| `lib/mcp-servers/gsi-custom/index.ts` | CREATE | Custom MCP tools |
| `src/cli/index.ts` | CREATE | Unified CLI |
| `tsconfig.json` | CREATE | TypeScript config |
| `package.json` | MODIFY | Add bin, dependencies |

#### Verification Criteria

- [ ] files-to-prompt forked with --cxml flag
- [ ] All GSI tools available as TypeScript CLI
- [ ] Custom MCP server exposing GSI features
- [ ] Build system produces distributable package
- [ ] Distribution plan documented

---

### Objective 4: Command Standardization

**Status**: Protocol Definition Required

#### Sub-Phase Breakdown

| Sub-Phase | Task Count | Description | Dependencies |
|-----------|------------|-------------|--------------|
| 49-04-A | 3 | Elementary Commands | 49-03 |
| 49-04-B | 3 | Chain Commands | 49-04-A |
| 49-04-C | 2 | Forbidden Actions | 49-04-B |

#### Execution Waves

**Wave 1: Elementary Commands (Context Fetching)**
```
Task 1: Implement gsi-tools phases list
  - --type plans | all
  - Output: JSON or formatted table
  
Task 2: Implement gsi-tools roadmap get-phase
  - <ID> parameter
  - Output: Full phase details
  
Task 3: Implement gsi-tools state-snapshot
  - Current health/status
  - Progress metrics
```

**Wave 2: Chain Commands (Workflow Execution)**
```
Task 4: Implement gsi-tools init execute-phase
  - <ID> parameter
  - --include state,config
  - Load full context before execution
  
Task 5: Implement gsi-tools init plan-phase
  - <ID> parameter
  - --include roadmap,research
  - Plan with dependencies
  
Task 6: Implement gsi-tools summary-extract
  - <path> parameter
  - Extract artifact data
```

**Wave 3: Forbidden Actions Documentation**
```
Task 7: Create forbidden-actions.md
  - ❌ Native ls/cat when GSI exists
  - ❌ Manual file reads if --include available
  
Task 8: Add validation to gsi-tools
  - Detect forbidden patterns
  - Suggest correct alternatives
```

#### Verification Criteria

- [ ] All 6 elementary commands working
- [ ] All 3 chain commands working
- [ ] Forbidden actions documented
- [ ] Validation detects violations

---

### Objective 5: Architectural Refactor (prompt-enhancer → gsi-instruction-controller)

**Status**: Rename and Retool Required

#### Sub-Phase Breakdown

| Sub-Phase | Task Count | Description | Dependencies |
|-----------|------------|-------------|--------------|
| 49-05-A | 3 | Directory Restructure | None |
| 49-05-B | 4 | Expanded Scope | 49-05-A |
| 49-05-C | 3 | CNS Integration | 49-05-B |

#### Execution Waves

**Wave 1: Directory Restructure**
```
Task 1: Rename lib/prompt-enhancer/ → lib/gsi-instruction-controller/
  - Update all imports
  - Update documentation
  
Task 2: Update command references
  - commands/gsi/*.md imports
  - workflows/*.md imports
  
Task 3: Create migration guide
  - Document renamed functions
  - Provide backward compat layer
```

**Wave 2: Expanded Scope**
```
Task 4: Create central-nervous-system.js
  - Inject mandatory context
  - Add health checks before execution
  
Task 5: Create instruction-compiler.js
  - Compile instructions to execution plans
  - Validate instruction completeness
  
Task 6: Create behavior-enforcer.js
  - Enforce system behavior rules
  - Block non-compliant operations
  
Task 7: Create context-injector.js
  - Auto-inject GSI context
  - Support custom injection points
```

**Wave 3: CNS Integration**
```
Task 8: Integrate with hooks
  - PreToolUse → context injection
  - PostToolUse → behavior validation
  
Task 9: Integrate with workflows
  - Auto CNS activation
  - Context propagation
  
Task 10: Create gsi-instruction-controller.md
  - Full API documentation
  - Integration examples
```

#### Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `lib/gsi-instruction-controller/index.js` | RENAME | From prompt-enhancer |
| `lib/gsi-instruction-controller/central-nervous-system.js` | CREATE | CNS core |
| `lib/gsi-instruction-controller/instruction-compiler.js` | CREATE | Compilation |
| `lib/gsi-instruction-controller/behavior-enforcer.js` | CREATE | Enforcement |
| `lib/gsi-instruction-controller/context-injector.js` | CREATE | Auto-injection |

#### Verification Criteria

- [ ] Directory renamed with all imports updated
- [ ] CNS module working
- [ ] Mandatory context injection active
- [ ] Health checks before execution
- [ ] Documentation complete

---

### Objective 6: Technical Debt Consolidation

**Status**: Cleanup Required

#### Sub-Phase Breakdown

| Sub-Phase | Task Count | Description | Dependencies |
|-----------|------------|-------------|--------------|
| 49-06-A | 3 | Phase Audit | 49-01 |
| 49-06-B | 4 | Phase Merge | 49-06-A |
| 49-06-C | 3 | Duplicate Resolution | 49-06-B |
| 49-06-D | 2 | Integration Test | 49-06-C |

#### Duplicate Phases to Resolve

| Phase | Directories | Action |
|-------|-------------|--------|
| 28 | `28-apex-architecture`, `28-tdd-integration` | Merge or renumber |
| 37 | Three `37-*` directories | Consolidate |
| 38 | Two `38-*` directories | Consolidate |
| 41 | `41-full-system-integration`, `41-gsi-total-project-rectification` | Renumber old to 48 |

#### Execution Waves

**Wave 1: Phase Audit**
```
Task 1: Run gsi-tools roadmap analyze
  - Identify dead phases
  - Identify orphan phases
  
Task 2: Generate phase-health-report.md
  - Document active phases
  - Document deprecated phases
  
Task 3: Create phase-dependency-graph.md
  - Map phase dependencies
  - Identify circular dependencies
```

**Wave 2: Phase Merge**
```
Task 4: Merge Phase 28 directories
  - Combine unique content
  - Archive duplicates
  
Task 5: Merge Phase 37 directories
  - Consolidate three into one
  - Update ROADMAP references
  
Task 6: Merge Phase 38 directories
  - Combine into single phase
  - Update cross-references
  
Task 7: Renumber Phase 41 duplicates
  - Move old content to Phase 48
  - Update all references
```

**Wave 3: Duplicate Resolution**
```
Task 8: Update ROADMAP.md
  - Remove duplicate entries
  - Update phase numbers
  
Task 9: Create phase-migration-log.md
  - Document all changes
  - Provide rollback instructions
  
Task 10: Verify no broken references
  - Run reference validation
  - Fix any remaining issues
```

**Wave 4: Integration Test**
```
Task 11: Run integration test suite
  - Verify all phases accessible
  - Verify ROADMAP accurate
  
Task 12: Generate final consolidation report
  - Document savings
  - Document new structure
```

#### Verification Criteria

- [ ] All duplicate phases resolved
- [ ] ROADMAP.md updated
- [ ] No broken references
- [ ] Integration tests pass
- [ ] Migration log created

---

## Phase 50: Ultimate Integration

### Overview

**Purpose**: Complete integration of 20+ external repositories into unified GSI ecosystem with 6-layer architecture.

**Dependencies**: Phase 49 Complete

**Total Duration**: 12 Weeks

---

### Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LAYER 6: ENHANCEMENT                             │
│  visual-explainer + awesome-sdks + superpowers (MCP)               │
├─────────────────────────────────────────────────────────────────────┤
│                    LAYER 5: DISTRIBUTION                            │
│  electrobun (Desktop) + superdoc (Docs) + CXcompress               │
├─────────────────────────────────────────────────────────────────────┤
│                    LAYER 4: WORKFLOW ENGINE                         │
│  PromptChains + mdream + taskmaster                                │
├─────────────────────────────────────────────────────────────────────┤
│                    LAYER 3: KNOWLEDGE SYSTEM                        │
│  txtai (Embeddings) + arscontexta + skill-compose                  │
├─────────────────────────────────────────────────────────────────────┤
│                    LAYER 2: AGENT FRAMEWORK                         │
│  claude-agent-sdk + agent-lightning + ralph + picobot              │
├─────────────────────────────────────────────────────────────────────┤
│                    LAYER 1: CORE ENGINE                             │
│  files-to-prompt + semantic-search + CodeGraph + FastCode          │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Phase 50A: Core Engine Integration (Weeks 1-2)

**Repositories**: files-to-prompt, semantic-code-search, CodeGraphContext, FastCode

#### Sub-Phase Breakdown

| Sub-Phase | Tasks | Description |
|-----------|-------|-------------|
| 50A-01 | 4 | files-to-prompt integration |
| 50A-02 | 4 | semantic-code-search integration |
| 50A-03 | 4 | CodeGraphContext evaluation |
| 50A-04 | 4 | FastCode integration |

#### Execution Plan

**50A-01: files-to-prompt (CRITICAL)**
```
Task 1: Clone to lib/context-generator/
Task 2: Add --cxml formatter
Task 3: Integrate with gsi context generate
Task 4: Create context cache system
```

**50A-02: semantic-code-search**
```
Task 1: Evaluate vs CI search_code_advanced
Task 2: Identify unique capabilities
Task 3: Create hybrid integration if valuable
Task 4: Document comparison
```

**50A-03: CodeGraphContext**
```
Task 1: Already installed as MCP
Task 2: Create lib/graph/ wrapper
Task 3: Integrate with gsi graph commands
Task 4: Document API
```

**50A-04: FastCode**
```
Task 1: Clone to lib/fast-code/
Task 2: Evaluate performance benefits
Task 3: Integrate for batch operations
Task 4: Benchmark vs native
```

#### Files to Create

| File | Purpose |
|------|---------|
| `lib/context-generator/index.ts` | files-to-prompt wrapper |
| `lib/search/semantic/index.ts` | Semantic search |
| `lib/graph/index.ts` | CodeGraphContext wrapper |
| `lib/fast-code/index.ts` | Fast processing |

---

### Phase 50B: Agent Framework Integration (Weeks 3-4)

**Repositories**: claude-agent-sdk, agent-lightning, ralph-playbook, picobot

#### Sub-Phase Breakdown

| Sub-Phase | Tasks | Description |
|-----------|-------|-------------|
| 50B-01 | 4 | claude-agent-sdk integration |
| 50B-02 | 4 | agent-lightning spawning |
| 50B-03 | 4 | ralph-playbook patterns |
| 50B-04 | 4 | picobot framework |

#### Execution Plan

**50B-01: claude-agent-sdk**
```
Task 1: Clone Python SDK to lib/agents/sdk/
Task 2: Create TypeScript wrapper
Task 3: Integrate with GSI agent system
Task 4: Create agent SDK CLI commands
```

**50B-02: agent-lightning**
```
Task 1: Evaluate fast spawning approach
Task 2: Create lib/agents/spawner/
Task 3: Integrate with wave-based spawning
Task 4: Benchmark spawning latency
```

**50B-03: ralph-playbook**
```
Task 1: Extract agent patterns
Task 2: Create lib/agents/playbook/
Task 3: Integrate with GSI agents
Task 4: Document pattern library
```

**50B-04: picobot**
```
Task 1: Evaluate bot framework
Task 2: Create lib/agents/bot/
Task 3: Integrate for interactive modes
Task 4: Document bot API
```

#### Files to Create

| File | Purpose |
|------|---------|
| `lib/agents/sdk/index.ts` | Claude SDK wrapper |
| `lib/agents/spawner/index.ts` | Fast spawning |
| `lib/agents/playbook/index.ts` | Agent patterns |
| `lib/agents/bot/index.ts` | Bot framework |

---

### Phase 50C: Knowledge System Integration (Weeks 5-6)

**Repositories**: txtai, arscontexta, skill-compose

#### Sub-Phase Breakdown

| Sub-Phase | Tasks | Description |
|-----------|-------|-------------|
| 50C-01 | 5 | txtai embeddings |
| 50C-02 | 5 | arscontexta context |
| 50C-03 | 5 | skill-compose |

#### Execution Plan

**50C-01: txtai**
```
Task 1: Install txtai Python package
Task 2: Create lib/knowledge/embeddings/
Task 3: Build embeddings for GSI codebase
Task 4: Create semantic search API
Task 5: Integrate with gsi knowledge commands
```

**50C-02: arscontexta**
```
Task 1: Clone to lib/knowledge/context/
Task 2: Evaluate context management approach
Task 3: Integrate with GSI context system
Task 4: Create context window optimization
Task 5: Document API
```

**50C-03: skill-compose**
```
Task 1: Clone to lib/knowledge/skills/
Task 2: Evaluate skill composition
Task 3: Integrate with GSI skill system
Task 4: Create skill composition API
Task 5: Document patterns
```

#### Files to Create

| File | Purpose |
|------|---------|
| `lib/knowledge/embeddings/index.ts` | txtai wrapper |
| `lib/knowledge/context/index.ts` | arscontexta wrapper |
| `lib/knowledge/skills/index.ts` | skill-compose wrapper |

---

### Phase 50D: Workflow Engine Integration (Weeks 7-8)

**Repositories**: PromptChains, mdream, taskmaster

#### Sub-Phase Breakdown

| Sub-Phase | Tasks | Description |
|-----------|-------|-------------|
| 50D-01 | 5 | PromptChains patterns |
| 50D-02 | 5 | mdream enhancement |
| 50D-03 | 5 | taskmaster management |

#### Execution Plan

**50D-01: PromptChains**
```
Task 1: Clone to lib/workflow/chains/
Task 2: Extract chain patterns
Task 3: Integrate with GSI workflows
Task 4: Create chain builder API
Task 5: Document patterns
```

**50D-02: mdream**
```
Task 1: Clone to lib/workflow/dream/
Task 2: Evaluate workflow enhancement
Task 3: Integrate with GSI enhancement
Task 4: Create dream mode API
Task 5: Document approach
```

**50D-03: taskmaster**
```
Task 1: Clone to lib/workflow/tasks/
Task 2: Integrate task management
Task 3: Create task queue API
Task 4: Add task prioritization
Task 5: Document system
```

#### Files to Create

| File | Purpose |
|------|---------|
| `lib/workflow/chains/index.ts` | Chain patterns |
| `lib/workflow/dream/index.ts` | Enhancement |
| `lib/workflow/tasks/index.ts` | Task management |

---

### Phase 50E: Distribution Integration (Weeks 9-10)

**Repositories**: electrobun, superdoc, CXcompress

#### Sub-Phase Breakdown

| Sub-Phase | Tasks | Description |
|-----------|-------|-------------|
| 50E-01 | 5 | electrobun desktop |
| 50E-02 | 5 | superdoc docs |
| 50E-03 | 5 | CXcompress context |

#### Execution Plan

**50E-01: electrobun**
```
Task 1: Research electrobun bundling
Task 2: Create dist/electrobun/ config
Task 3: Build desktop app bundle
Task 4: Test cross-platform
Task 5: Document distribution
```

**50E-02: superdoc**
```
Task 1: Clone to lib/docs/processor/
Task 2: Integrate document processing
Task 3: Create docs generation API
Task 4: Add format conversion
Task 5: Document capabilities
```

**50E-03: CXcompress**
```
Task 1: Clone to lib/compress/
Task 2: Integrate context compression
Task 3: Create compression API
Task 4: Benchmark compression ratios
Task 5: Document usage
```

#### Files to Create

| File | Purpose |
|------|---------|
| `dist/electrobun/` | Desktop bundling |
| `lib/docs/processor/index.ts` | Document processing |
| `lib/compress/index.ts` | Context compression |

---

### Phase 50F: Enhancement Integration (Weeks 11-12)

**Repositories**: visual-explainer, awesome-sdks, superpowers

#### Sub-Phase Breakdown

| Sub-Phase | Tasks | Description |
|-----------|-------|-------------|
| 50F-01 | 4 | visual-explainer |
| 50F-02 | 4 | awesome-sdks |
| 50F-03 | 4 | superpowers MCP |

#### Execution Plan

**50F-01: visual-explainer**
```
Task 1: Clone to lib/visual/
Task 2: Integrate visual documentation
Task 3: Create visualization API
Task 4: Document capabilities
```

**50F-02: awesome-sdks**
```
Task 1: Clone to lib/sdks/
Task 2: Index SDK collection
Task 3: Create SDK lookup API
Task 4: Document usage
```

**50F-03: superpowers**
```
Task 1: Extract MCP tools
Task 2: Integrate to lib/mcp/superpowers/
Task 3: Create MCP tool registry
Task 4: Document available tools
```

#### Files to Create

| File | Purpose |
|------|---------|
| `lib/visual/index.ts` | Visual documentation |
| `lib/sdks/index.ts` | SDK collection |
| `lib/mcp/superpowers/index.ts` | MCP tools |

---

## Unified CLI Commands (Post-Integration)

```bash
# Core Engine
gsi context generate <path>          # files-to-prompt --cxml
gsi search semantic <query>          # semantic-code-search
gsi graph analyze <file>             # CodeGraphContext
gsi code fast <operation>           # FastCode

# Agent Framework
gsi agent spawn <type>              # agent-lightning
gsi agent sdk <command>             # claude-agent-sdk
gsi playbook run <name>             # ralph-playbook
gsi bot start <config>              # picobot

# Knowledge System
gsi knowledge embed <text>          # txtai
gsi context manage <action>         # arscontexta
gsi skill compose <skills>          # skill-compose

# Workflow Engine
gsi chain run <chain>               # PromptChains
gsi dream enhance <workflow>        # mdream
gsi task queue <action>             # taskmaster

# Distribution
gsi build desktop                   # electrobun
gsi docs process <path>             # superdoc
gsi compress context                # CXcompress

# Enhancement
gsi visual explain <topic>          # visual-explainer
gsi sdk list                        # awesome-sdks
gsi mcp superpowers <tool>          # superpowers
```

---

## Final Package Structure

```
get-shit-done-code-index/
├── src/
│   ├── cli/
│   │   └── gsi.ts                    # Unified CLI entry
│   │
│   └── lib/
│       ├── core/                     # Layer 1
│       │   ├── context-generator/    # files-to-prompt
│       │   ├── search/               # semantic-code-search
│       │   ├── graph/                # CodeGraphContext
│       │   └── fast-code/            # FastCode
│       │
│       ├── agents/                   # Layer 2
│       │   ├── sdk/                  # claude-agent-sdk
│       │   ├── spawner/              # agent-lightning
│       │   ├── playbook/             # ralph-playbook
│       │   └── bot/                  # picobot
│       │
│       ├── knowledge/                # Layer 3
│       │   ├── embeddings/           # txtai
│       │   ├── context/              # arscontexta
│       │   └── skills/               # skill-compose
│       │
│       ├── workflow/                 # Layer 4
│       │   ├── chains/               # PromptChains
│       │   ├── dream/                # mdream
│       │   └── tasks/                # taskmaster
│       │
│       ├── distribution/             # Layer 5
│       │   ├── desktop/              # electrobun
│       │   ├── docs/                 # superdoc
│       │   └── compress/             # CXcompress
│       │
│       ├── enhancement/              # Layer 6
│       │   ├── visual/               # visual-explainer
│       │   ├── sdks/                 # awesome-sdks
│       │   └── mcp/                  # superpowers
│       │
│       └── gsi-instruction-controller/  # Renamed from prompt-enhancer
│           ├── central-nervous-system.js
│           ├── instruction-compiler.js
│           ├── behavior-enforcer.js
│           └── context-injector.js
│
├── dist/
├── hooks/
├── commands/gsi/
├── workflows/
├── .planning/
│   ├── context/                      # Generated context files
│   ├── phases/
│   ├── ROADMAP.md
│   └── STATE.md
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Integration with Past Phases

### Phase Dependencies

| Phase | Provides | Phase 49/50 Needs |
|-------|----------|-------------------|
| 1-8 | MCP Foundation | DC, CI, CG integration |
| 9-13 | Branding, Audit | Clean codebase |
| 14-16 | MCP Optimization | Tool precedence |
| 17 | Complexity Prediction | Auto-split |
| 19 | Prompt Enhancer | CNS foundation |
| 20 | Thinking Integration | Cognitive flow |
| 21-22 | Pattern Learning | Knowledge system |
| 23 | Self-Containment | Package structure |
| 36 | Codebase Cleanup | Clean modules |
| 41 | Rectification | Fixed references |
| 47 | Architecture | Module registry |

### External Repository Integration Points

| Repository | GSI Integration | When |
|------------|-----------------|------|
| files-to-prompt | lib/context-generator/ | Phase 49-03, 50A |
| semantic-code-search | lib/search/semantic/ | Phase 50A |
| CodeGraphContext | lib/graph/ | Phase 50A |
| agent-lightning | lib/agents/spawner/ | Phase 50B |
| txtai | lib/knowledge/embeddings/ | Phase 50C |
| PromptChains | lib/workflow/chains/ | Phase 50D |
| electrobun | dist/electrobun/ | Phase 50E |
| superpowers | lib/mcp/superpowers/ | Phase 50F |

---

## Success Metrics

### Phase 49 Completion

- [ ] gsi-explorer agent operational (MCP-only)
- [ ] Tool precedence enforced (0 native violations)
- [ ] 3+ external repos integrated
- [ ] Command standardization documented
- [ ] prompt-enhancer → gsi-instruction-controller
- [ ] All duplicate phases resolved
- [ ] Integration tests pass 100%

### Phase 50 Completion

- [ ] All 20+ repositories integrated
- [ ] 6-layer architecture functional
- [ ] Unified CLI with all commands
- [ ] Desktop app distributable
- [ ] Context compression 80%+ reduction
- [ ] Semantic search working
- [ ] Agent spawning < 100ms

---

## Risk Assessment

### High Risk

1. **Repository Compatibility**: External repos may have conflicting dependencies
   - Mitigation: Use package aliases, isolate in subdirectories

2. **TypeScript Conversion**: Python repos need conversion
   - Mitigation: Phase conversion, keep Python as fallback

3. **MCP Server Conflicts**: Multiple MCP servers may conflict
   - Mitigation: Port isolation, unified registry

### Medium Risk

1. **Performance Regression**: Integration may slow system
   - Mitigation: Benchmark each integration, lazy loading

2. **Documentation Debt**: Integration needs documentation
   - Mitigation: Auto-generate from JSDoc

### Low Risk

1. **Naming Conflicts**: Module name collisions
   - Mitigation: Namespace prefixing

---

## Execution Timeline

| Week | Phase | Focus |
|------|-------|-------|
| 1 | 49-01 | gsi-explorer agent |
| 2 | 49-02 | Tool precedence |
| 3 | 49-03 | External repos |
| 4 | 49-04, 49-05 | Commands, refactor |
| 5 | 49-06 | Technical debt |
| 6-7 | 50A | Core engine |
| 8-9 | 50B | Agent framework |
| 10-11 | 50C | Knowledge system |
| 12-13 | 50D | Workflow engine |
| 14-15 | 50E | Distribution |
| 16-17 | 50F | Enhancement |
| 18 | Final | Integration testing |

---

*Analysis completed: 2026-02-18*
*Agent: gsi-codebase-mapper*
*Status: Ready for execution planning*
