# Roadmap: MCP-Enhanced GSD

## Overview

Transform Get Shit Done (GSD) system to fully leverage three MCP servers—Desktop Commander (DC), Code-Index MCP (CI), and CodeGraphContext (CG)—replacing native bash commands with MCP equivalents. This journey begins with foundational MCP integration, moves through workflow updates, consolidates research into unified documentation, synchronizes repositories, integrates thinking servers, and concludes with quality verification systems.

## Phases

- [x] **Phase 1: MCP Foundation** - Establish all three MCP servers with golden pattern implementation
- [x] **Phase 2: Workflow Integration** - Update all GSD workflows to use MCP tools instead of native commands
- [~] **Phase 3: Documentation Consolidation** - Consolidate research into unified reference guides with Mermaid diagrams (DEFERRED - plans TBD)
- [ ] **Phase 4: Repository Synchronization** - Sync local changes to cloned upstream repo
- [ ] **Phase 5: Thinking Server Integration** - Integrate all three thinking servers with 7-BMAD methodology
- [ ] **Phase 6: Quality & Verification** - Implement auto-validation, code review, and verification systems
- [ ] **Phase 7: Command Layer Updates** - Update GSD command definitions for all 3 MCP servers
- [ ] **Phase 8: Advanced Workflow Features** - Implement parallel orchestration, model profiles, and YOLO mode

## Phase Details

### Phase 1: MCP Foundation

**Goal**: All three MCP servers (DC, CI, CG) are available, configured, and working with golden pattern established

**Depends on**: Nothing (first phase)

**Requirements**: MCP-001, MCP-002, MCP-003, MCP-004, MCP-005, MCP-006

**Success Criteria** (what must be TRUE):
1. Desktop Commander (DC) MCP server is connected and responsive for all file/process operations
2. Code-Index MCP (CI) server is connected and responsive for code search/symbol navigation
3. CodeGraphContext (CG) server is connected and responsive for relationship analysis (neo4j://localhost:7687)
4. Golden pattern (CG discover → CI understand → CI understand → DC act → DC verify → CI verify) works end-to-end
5. All MCP tools show 80-90% token savings compared to native equivalents

**Plans**: 3 plans (REDO - CG server now available at neo4j://localhost:7687)

**Status**: Plans created, ready for execution

**Completed**: N/A

**Plans**:
- [ ] 01-01: Verify and configure all three MCP servers (DC, CI, CG) - 9 tasks with CG at neo4j://localhost:7687
- [ ] 01-02: Implement golden pattern with discover-understand-act-verify tool chain - 10 tasks with CG integration
- [ ] 01-03: Establish tool priority rules enforcing MCP > Native across system - 10 tasks complete with all 3 servers

### Phase 2: Workflow Integration

**Goal**: All GSD workflows use MCP tools instead of native bash commands

**Depends on**: Phase 1 (MCP Foundation)

**Requirements**: WORKFLOW-001, WORKFLOW-002, WORKFLOW-003

**Success Criteria** (what must be TRUE):
1. All 13 GSD workflow files use MCP tools instead of native bash commands
2. map-codebase.md implements wave-based agent spawning with rate limiting
3. <code_index_mcp> headers declaratively specify MCP usage in workflow files
4. Workflows execute using optimal tool sequences (CG → CI → DC)

**Plans**: 3 plans

**Status**: Complete (4/4 must-haves verified - 100%)

**Completed**: 2025-02-11

**Plans**:
- [x] 02-01: Update all 13 workflow files to use MCP tools instead of native bash
- [x] 02-02: Refactor map-codebase.md with wave-based spawning and staggered agent launches
- [x] 02-03: Add <code_index_mcp> headers to all workflows for declarative MCP usage

### Phase 3: Documentation Consolidation

**Goal**: All MCP tool chain research consolidated into unified reference guides with visual diagrams

**Depends on**: Phase 1 (MCP Foundation)

**Requirements**: DOC-001, DOC-002, DOC-003, DOC-004, DOC-005

**Success Criteria** (what must be TRUE):
1. CODE-INDEX-MCP-GUIDE.md exists with complete Code-Index server usage patterns
2. TOOL-PRIORITY-RULES.md enhanced with CodeGraphContext (CG) server integration at neo4j://localhost:7687
3. All MCP tool chain patterns consolidated into unified reference guides with Mermaid diagrams
4. TOOL-CHAIN-REFERENCE.md documents all 15 linear, 4 circular, and 5 hybrid patterns
5. DECISION-TREES.md provides decision trees for optimal tool and pattern selection

**Plans**: 4 plans

**Status**: Plans created, ready for execution

**Completed**: N/A

**Plans**:
- [ ] 03-01: Create CODE-INDEX-MCP-GUIDE.md with comprehensive CI usage patterns (8 tasks)
- [ ] 03-02: Enhance TOOL-PRIORITY-RULES.md with CodeGraphContext integration (8 tasks)
- [ ] 03-03: Create TOOL-CHAIN-REFERENCE.md with Mermaid diagrams for all 24 patterns (8 tasks)
- [ ] 03-04: Create DECISION-TREES.md with tool and pattern selection decision trees (8 tasks)

### Phase 4: Repository Synchronization

**Goal**: Local GSD directory synchronized with cloned upstream repo as single source of truth with complete 3-MCP integration

**Depends on**: Phase 2 (Workflow Integration), Phase 3 (Documentation Consolidation)

**Requirements**: REPO-001, REPO-002, REPO-003, REPO-004

**Success Criteria** (what must be TRUE):
1. Local directory `C:\Users\mose\.claude\get-shit-done` synced to cloned upstream repo (local -> clone)
2. Cloned repo at `C:\github-repos\my-claude-code-repos\get-shit-done-code-index` contains all 3-MCP integrations
3. All local changes pushed to clone with DC, CI, CG (neo4j://localhost:7687) integrations
4. Clone is established as single source of truth for GSD enhancements

**Plans**: 3 plans (REDO - with explicit 3-MCP integration)

**Status**: Plans created, ready for execution

**Completed**: -

**Plans**:
- [ ] 04-01: Analyze local GSD directory and cloned repo structure (10 tasks - analysis, cataloging, 3-MCP verification, backup)
- [ ] 04-02: Update cloned repo with all 3-MCP integration changes (10 tasks - copy DC+CI+CG workflows, references, research)
- [ ] 04-03: Verify bidirectional sync with 3-MCP integration (10 tasks - commit, verify DC+CI+CG, document)

### Phase 5: Thinking Server Integration

**Goal**: All three thinking servers integrated and configured with 7-BMAD methodology

**Depends on**: Phase 1 (MCP Foundation)

**Requirements**: THINK-001, THINK-002, THINK-003, THINK-004, THINK-005

**Success Criteria** (what must be TRUE):
1. Sequential thinking server is integrated with 7-BMAD methodology
2. Tractatus thinking server is integrated for logical structure analysis
3. Debug thinking server is integrated with graph-based problem-solving
4. All three thinking servers are properly configured and available in workflows
5. Tool chains update based on which thinking server is active (DC/CI/CG variants)

**Plans**: 4 plans

**Status**: Plans created, ready for execution

**Completed**: -

**Plans**:
- [ ] 05-01: Integrate sequential thinking server with 7-BMAD methodology (6 tasks)
- [ ] 05-02: Integrate tractatus thinking server for logical analysis (7 tasks)
- [ ] 05-03: Integrate debug thinking server with graph-based problem-solving (7 tasks)
- [ ] 05-04: Update tool chains with thinking-server-specific variants (8 tasks)

### Phase 6: Quality & Verification

**Goal**: Auto-validation system with 7-BMAD quality gates integrated across all agent work, ensuring all deliverables match planned goals through comprehensive verification.

**Depends on**: Phase 5 (Thinking Server Integration)

**Requirements**: QUAL-001, QUAL-002, QUAL-003, QUAL-004, QUAL-005

**Success Criteria** (what must be TRUE):
1. Auto-validation system integrated with 7-BMAD quality gates on all agent work
2. Code review expert skill integrated for validation checks
3. Plan checker integrated to verify plans achieve phase goals
4. Verifier integrated to confirm deliverables match goals
5. All requirements are testable and verifiable with clear success criteria

**Plans**: 4 plans

**Status**: Plans created

**Completed**: -

**Plans**:
- [ ] 06-01: Implement auto-validation system with 7-BMAD quality gates (10 tasks)
- [ ] 06-02: Integrate code review expert skill for validation (10 tasks)
- [ ] 06-03: Implement plan checker to verify plans achieve phase goals (10 tasks)
- [ ] 06-04: Implement verifier to confirm deliverables match goals (10 tasks)

### Phase 7: Command Layer Updates

**Goal**: GSD commands updated to work with all three MCP servers

**Depends on**: Phase 2 (Workflow Integration)

**Requirements**: WORKFLOW-004

**Success Criteria** (what must be TRUE):
1. GSD commands at `C:\Users\mose\.claude\commands\gsd` work with Desktop Commander
2. GSD commands work with Code-Index MCP
3. GSD commands work with CodeGraphContext
4. All commands handle all three MCP servers transparently

**Plans**: 3 plans

**Status**: Plans created

**Completed**: -

**Plans**:
- [ ] 07-01: Update GSD command definitions for Desktop Commander integration (10 tasks)
- [ ] 07-02: Update GSD command definitions for Code-Index MCP integration (10 tasks)
- [ ] 07-03: Update GSD command definitions for CodeGraphContext integration (10 tasks)

### Phase 8: Advanced Workflow Features

**Goal**: Parallel orchestration, configurable model profiles, and YOLO mode working across agents

**Depends on**: Phase 2 (Workflow Integration), Phase 6 (Quality & Verification)

**Requirements**: WORKFLOW-005, WORKFLOW-006, WORKFLOW-007

**Success Criteria** (what must be TRUE):
1. Parallel agent orchestration works with rate limiting and staggered spawning
2. Configurable model profiles (quality/balanced/budget) work across agents
3. YOLO mode (auto-approve) enables frictionless execution
4. Wave-based spawning prevents API rate limits

**Plans**: 4 plans

**Status**: Plans created

**Completed**: -

**Plans**:
- [ ] 08-01: Implement parallel agent orchestration with rate limiting (8 tasks)
- [ ] 08-02: Implement configurable model profiles (quality/balanced/budget) (9 tasks)
- [ ] 08-03: Implement YOLO mode for frictionless execution (10 tasks)
- [ ] 08-04: Verify wave-based spawning prevents API rate limits (10 tasks)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. MCP Foundation | 3/3 | Complete (gaps) | 2025-02-11 |
| 2. Workflow Integration | 3/3 | Complete ✓ | 2025-02-11 |
| 3. Documentation Consolidation | 0/4 | Plans created | - |
| 4. Repository Synchronization | 0/3 | Plans created | - |
| 5. Thinking Server Integration | 0/4 | Plans created | - |
| 6. Quality & Verification | 0/4 | Plans created | - |
| 7. Command Layer Updates | 0/3 | Plans created | - |
| 8. Advanced Workflow Features | 0/4 | Plans created | - |

**Overall Progress**: 6/32 plans complete (19%)

**Phase 3 (Documentation Consolidation): 4 plans created - 32 tasks total**
- Plan 03-01: 8 tasks - CODE-INDEX-MCP-GUIDE.md creation
- Plan 03-02: 8 tasks - TOOL-PRIORITY-RULES.md enhancement with CG
- Plan 03-03: 8 tasks - TOOL-CHAIN-REFERENCE.md with Mermaid diagrams
- Plan 03-04: 8 tasks - DECISION-TREES.md with decision frameworks

**Phase 4 (Repository Synchronization): 3 plans created - 30 tasks total**
- Plan 04-01: 10 tasks - Analyze and catalog local + clone with 3-MCP verification
- Plan 04-02: 10 tasks - Update clone with DC+CI+CG integrations
- Plan 04-03: 10 tasks - Verify bidirectional sync with 3-MCP documentation

**Phase 5 (Thinking Server Integration): 4 plans created - 28 tasks total**
- Plan 05-01: 6 tasks - Sequential thinking + 7-BMAD methodology
- Plan 05-02: 7 tasks - Tractatus thinking for logical structure
- Plan 05-03: 7 tasks - Debug thinking with graph-based debugging
- Plan 05-04: 8 tasks - Tool chain variants with thinking-aware selection

**Phase 6 (Quality & Verification): 4 plans created - 40 tasks total**
- Plan 06-01: 10 tasks - Auto-validation system with 7-BMAD quality gates
- Plan 06-02: 10 tasks - Code review expert skill integration
- Plan 06-03: 10 tasks - Plan checker for goal verification
- Plan 06-04: 10 tasks - Deliverable verifier

**Phase 7 (Command Layer Updates): 3 plans created - 30 tasks total**
- Plan 07-01: 10 tasks - DC integration for all 26 GSD commands
- Plan 07-02: 10 tasks - CI integration for code search and analysis
- Plan 07-03: 10 tasks - CG integration for relationship analysis

**Phase 8 (Advanced Workflow Features): 4 plans created - 37 tasks total**
- Plan 08-01: 8 tasks - Parallel orchestration with rate limiting and staggered spawning
- Plan 08-02: 9 tasks - Configurable model profiles (quality/balanced/budget)
- Plan 08-03: 10 tasks - YOLO mode for frictionless execution
- Plan 08-04: 10 tasks - Wave-based spawning verification and testing
