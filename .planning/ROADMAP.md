# Roadmap: MCP-Enhanced GSI

## Overview

Transform Get Shit Indexed (GSI) system to fully leverage three MCP servers—Desktop Commander (DC), Code-Index MCP (CI), and CodeGraphContext (CG)—replacing native bash commands with MCP equivalents. This journey begins with foundational MCP integration, moves through workflow updates, consolidates research into unified documentation, synchronizes repositories, integrates thinking servers, and concludes with quality verification systems.

## Phases

- [x] **Phase 1: MCP Foundation** - Establish all three MCP servers with golden pattern implementation
- [x] **Phase 2: Workflow Integration** - Update all GSI workflows to use MCP tools instead of native commands
- [x] **Phase 3: Documentation Consolidation** - Consolidate research into unified reference guides with Mermaid diagrams
- [x] **Phase 4: Repository Synchronization** - Sync local changes to cloned upstream repo
- [x] **Phase 5: Thinking Server Integration** - Integrate all three thinking servers with 7-BMAD methodology
- [x] **Phase 6: Quality & Verification** - Implement auto-validation, code review, and verification systems
- [x] **Phase 7: Command Layer Updates** - Update GSI command definitions for all 3 MCP servers
- [x] **Phase 8: Advanced Workflow Features** - Implement parallel orchestration, model profiles, and YOLO mode
- [ ] **Phase 9: Repository Renovation** - GSI terminal logo, global keyword replacement, documentation overhaul
- [ ] **Phase 10: MCP & Tools Audit** - Complete MCP server and tools audit with documentation
- [ ] **Phase 11: Resources & Links Audit** - Verify all external and internal resources
- [ ] **Phase 12: Theory & Practice Docs** - Document conceptual model vs actual implementation
- [ ] **Phase 13: Comprehensive Testing** - End-to-end testing of all GSI functionality
- [ ] **Phase 23: Package Self-Containment** - Make GSI package fully self-contained with no global dependencies

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

**Goal**: All GSI workflows use MCP tools instead of native bash commands

**Depends on**: Phase 1 (MCP Foundation)

**Requirements**: WORKFLOW-001, WORKFLOW-002, WORKFLOW-003

**Success Criteria** (what must be TRUE):
1. All 13 GSI workflow files use MCP tools instead of native bash commands
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

**Status**: Complete (4/4 must-haves verified - 100%)

**Completed**: 2026-02-13

**Plans**:
- [x] 03-01: Create CODE-INDEX-MCP-GUIDE.md with comprehensive CI usage patterns (8 tasks)
- [x] 03-02: Enhance TOOL-PRIORITY-RULES.md with CodeGraphContext integration (8 tasks)
- [x] 03-03: Create TOOL-CHAIN-REFERENCE.md with Mermaid diagrams for all 24 patterns (8 tasks)
- [x] 03-04: Create DECISION-TREES.md with tool and pattern selection decision trees (8 tasks)

### Phase 4: Repository Synchronization

**Goal**: Local GSI directory synchronized with cloned upstream repo as single source of truth with complete 3-MCP integration

**Depends on**: Phase 2 (Workflow Integration), Phase 3 (Documentation Consolidation)

**Requirements**: REPO-001, REPO-002, REPO-003, REPO-004

**Success Criteria** (what must be TRUE):
1. Local directory `C:\Users\mose\.claude\get-shit-indexed` synced to cloned upstream repo (local -> clone)
2. Cloned repo at `C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index` contains all 3-MCP integrations
3. All local changes pushed to clone with DC, CI, CG (neo4j://localhost:7687) integrations
4. Clone is established as single source of truth for GSI enhancements

**Plans**: 3 plans (REDO - with explicit 3-MCP integration)

**Status**: Complete (4/4 must_haves verified - 100%)

**Completed**: 2026-02-13

**Plans**:
- [x] 04-01: Analyze local GSI directory and cloned repo structure (10 tasks - analysis, cataloging, 3-MCP verification, backup)
- [x] 04-02: Update cloned repo with all 3-MCP integration changes (10 tasks - copy DC+CI+CG workflows, references, research)
- [x] 04-03: Verify bidirectional sync with 3-MCP integration (10 tasks - commit, verify DC+CI+CG, document)

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

**Status**: Complete (5/5 must_haves verified - 100%)

**Completed**: 2026-02-13

**Plans**:
- [x] 05-01: Integrate sequential thinking server with 7-BMAD methodology (6 tasks)
- [x] 05-02: Integrate tractatus thinking server for logical analysis (7 tasks)
- [x] 05-03: Integrate debug thinking server with graph-based problem-solving (7 tasks)
- [x] 05-04: Update tool chains with thinking-server-specific variants (8 tasks)

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

**Status**: Complete (5/5 must-haves verified - 100%)

**Completed**: 2026-02-13

**Plans**:
- [x] 06-01: Implement auto-validation system with 7-BMAD quality gates (10 tasks)
- [x] 06-02: Integrate code review expert skill for validation (10 tasks)
- [x] 06-03: Implement plan checker to verify plans achieve phase goals (10 tasks)
- [x] 06-04: Implement verifier to confirm deliverables match goals (10 tasks)

### Phase 7: Command Layer Updates

**Goal**: GSI commands updated to work with all three MCP servers

**Depends on**: Phase 2 (Workflow Integration)

**Requirements**: WORKFLOW-004

**Success Criteria** (what must be TRUE):
1. GSI commands at `C:\Users\mose\.claude\commands\GSI` work with Desktop Commander
2. GSI commands work with Code-Index MCP
3. GSI commands work with CodeGraphContext
4. All commands handle all three MCP servers transparently

**Plans**: 3 plans

**Status**: Complete (4/4 must-haves verified - 100%)

**Completed**: 2026-02-13

**Plans**:
- [x] 07-01: Update GSI command definitions for Desktop Commander integration (10 tasks)
- [x] 07-02: Update GSI command definitions for Code-Index MCP integration (10 tasks)
- [x] 07-03: Update GSI command definitions for CodeGraphContext integration (10 tasks)

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

**Status**: Complete (4/4 must-haves verified - 100%)

**Completed**: 2026-02-13

**Plans**:
- [x] 08-01: Implement parallel agent orchestration with rate limiting (8 tasks)
- [x] 08-02: Implement configurable model profiles (quality/balanced/budget) (9 tasks)
- [x] 08-03: Implement YOLO mode for frictionless execution (10 tasks)
- [x] 08-04: Verify wave-based spawning prevents API rate limits (10 tasks)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. MCP Foundation | 3/3 | Complete ✓ | 2025-02-11 |
| 2. Workflow Integration | 3/3 | Complete ✓ | 2025-02-11 |
| 3. Documentation Consolidation | 4/4 | Complete ✓ | 2026-02-13 |
| 4. Repository Synchronization | 3/3 | Complete ✓ | 2026-02-13 |
| 5. Thinking Server Integration | 4/4 | Complete ✓ | 2026-02-13 |
| 6. Quality & Verification | 4/4 | Complete ✓ | 2026-02-13 |
| 7. Command Layer Updates | 3/3 | Complete ✓ | 2026-02-13 |
| 8. Advanced Workflow Features | 4/4 | Complete ✓ | 2026-02-13 |
| 9. Repository Renovation | 4/4 | Complete ✓ | 2026-02-13 |
| 10. MCP & Tools Audit | 2/2 | Complete ✓ | 2026-02-13 |
| 11. Resources & Links Audit | 1/1 | Complete ✓ | 2026-02-14 |
| 12. Theory & Practice Docs | 1/1 | Complete ✓ | 2026-02-14 |
| 23. Package Self-Containment | 4/4 | Complete ✓ | 2026-02-16 |

**Overall Progress**: 41/58 plans complete (71% - 17 new plans added)

**Phase 14 (MCP Tool Optimization): 6 plans created - 36 tasks total**
- Plan 14-01: 6 tasks - read_multiple_files integration
- Plan 14-02: 6 tasks - CodeGraphContext to commands
- Plan 14-03: 7 tasks - CG analysis in workflows
- Plan 14-04: 6 tasks - CI symbol navigation
- Plan 14-05: 6 tasks - Tool usage benchmarks
- Plan 14-06: 5 tasks - mcp-enforcer updates

**Phase 15 (Thinking Enforcement): 5 plans created - 32 tasks total**
- Plan 15-01: 7 tasks - PreToolUse thinking hook
- Plan 15-02: 6 tasks - Thinking workflow sections
- Plan 15-03: 7 tasks - 7-BMAD integration
- Plan 15-04: 6 tasks - Verification checkpoints
- Plan 15-05: 6 tasks - PostToolUse reflection hook

**Phase 16 (README Transformation): 6 plans created - 44 tasks total**
- Plan 16-01: 7 tasks - Fork attribution
- Plan 16-02: 7 tasks - MCP comparison tables
- Plan 16-03: 7 tasks - Thinking server docs
- Plan 16-04: 8 tasks - Installation guide
- Plan 16-05: 8 tasks - Feature showcase
- Plan 16-06: 7 tasks - Final assembly

**Phase 3 (Documentation Consolidation): 4 plans created - 32 tasks total**

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
- Plan 07-01: 10 tasks - DC integration for all 26 GSI commands
- Plan 07-02: 10 tasks - CI integration for code search and analysis
- Plan 07-03: 10 tasks - CG integration for relationship analysis

**Phase 8 (Advanced Workflow Features): 4 plans created - 37 tasks total**
- Plan 08-01: 8 tasks - Parallel orchestration with rate limiting and staggered spawning
- Plan 08-02: 9 tasks - Configurable model profiles (quality/balanced/budget)
- Plan 08-03: 10 tasks - YOLO mode for frictionless execution
- Plan 08-04: 10 tasks - Wave-based spawning verification and testing

**Status**: Complete ✓ (2026-02-13)

**Completed**: 

**Plans**:
- [x] 08-01: Parallel orchestration with rate limiting and wave execution
- [x] 08-02: Configurable model profiles with profile switching
- [x] 08-03: YOLO mode with auto-approval and frictionless execution
- [x] 08-04: Wave verification and testing with health monitoring

### Phase 9: Repository Renovation

**Goal**: Complete GSD → GSI transformation with new logo, global keyword replacement, and documentation overhaul

**Depends on**: Phase 8 (Advanced Workflow Features)

**Success Criteria**:
1. GSI terminal logo created with ring effects (cyan G+S, purple I with horizontal ellipses)
2. ALL GSD keywords replaced with GSI globally
3. All documentation updated with GSI branding
4. All URLs point to Alot1z/get-shit-indexed fork
5. GSI-REBRANDING.md changelog created

**Plans**: 4 plans

**Status**: Complete ✓ (2026-02-13)

**Completed**: 2026-02-13

**Plans**:
- [x] 09-01: Create GSI terminal logo with Tokyo Night theme and ring effects
- [x] 09-02: Global keyword replacement (GSD→GSI, Get Shit Done→Get Shit Indexed)
- [x] 09-03: Documentation overhaul with new branding and fork URLs
- [x] 09-04: Gap closure - package.json URLs, agent renames, commands directory

**Notes**:
- get-shit-done/ directory INTENTIONALLY KEPT for backward compatibility
- Both ./gsd: and ./gsi: commands work (dual branding supports migration)

### Phase 10: MCP & Tools Audit

**Goal**: Complete audit of all MCP servers and tools with documentation and verification

**Depends on**: Phase 9 (Repository Renovation)

**Success Criteria**:
1. All MCP servers documented with purpose and status
2. All MCP servers tested and verified working
3. All tools audited and documented
4. Token efficiency documented
5. Dependency graph created

**Plans**: 2 plans

**Status**: Complete ✓ (2026-02-13)

**Completed**: 2026-02-13

**Plans**:
- [x] 10-01: MCP server audit with connection testing and documentation
- [x] 10-02: Tools audit with dependency graph and verification

**Results**:
- 13 MCP servers discovered and documented
- 7/13 connected (54%), issues documented for 4
- Token efficiency: DC 71%, CI 80%, Combined 85%
- 50+ gsi-tools.js commands cataloged
- Dependency graph with Mermaid visualization created

### Phase 11: Resources & Links Audit

**Goal**: Verify all external and internal resources and links

**Depends on**: Phase 10 (MCP & Tools Audit)

**Success Criteria**:
1. All external URLs documented and verified active
2. All links updated to point to fork (not original GSD repo)
3. API endpoints documented
4. Internal file references verified

**Plans**: 1 plan

**Status**: Complete ✓ (2026-02-14)

**Completed**: 2026-02-14

**Plans**:
- [x] 11-01: Resources and links audit with verification

**Results**:
- 70+ URLs extracted and catalogued
- All GitHub links verified to Alot1z/get-shit-indexed fork
- 0 broken links found
- 24+ API endpoints documented
- 1,407 lines of audit documentation created

### Phase 12: Theory & Practice Docs

**Goal**: Document conceptual model vs actual implementation with gap analysis

**Depends on**: Phase 11 (Resources & Links Audit)

**Success Criteria**:
1. GSI theory (conceptual model) documented
2. GSI practice (actual implementation) documented
3. Gap analysis complete with severity ratings
4. Resolution plans prioritized
5. Logic flows documented with Mermaid diagrams

**Plans**: 1 plan

**Status**: Complete ✓ (2026-02-14)

**Completed**: 2026-02-14

**Plans**:
- [x] 12-01: Theory vs Practice documentation with gap analysis

**Results**:
- THEORY-VS-PRACTICE.md: 1,125 lines (conceptual model + gap analysis)
- LOGIC-FLOWS.md: 453 lines (10+ Mermaid diagrams)
- EDGE-CASES.md: 759 lines (error handling, edge cases)
- 10 gaps identified with severity ratings and resolution plans
- 2,337 total lines of documentation

### Phase 13: Comprehensive Testing

**Goal**: End-to-end testing of all GSI functionality after GSI→GSI transformation

**Depends on**: Phase 12 (Theory & Practice Docs)

**Success Criteria**:
1. All CLI commands tested with GSI branding
2. All MCP server integrations working
3. All workflows functional
4. Documentation accuracy verified
5. No GSI references remaining (brand consistency)
6. Test summary shows high pass rate

**Plans**: 1 plan

**Status**: Complete ✓ (2026-02-14)

**Completed**: 2026-02-14

**Plans**:
- [x] 13-01: Comprehensive testing with brand verification

**Results**:
- TEST-PLAN.md: 235 lines with 6 test categories, 100+ test cases
- TEST-RESULTS.md: 356 lines with 82 tests, 98.8% pass rate
- CLI Commands: 25/25 passed (100%)
- MCP Integration: 24/24 passed (100%)
- Workflows: 15/15 passed (100%)
- Documentation: 12/12 passed (100%)
- Brand Consistency: 7/8 passed (87.5% - 1 skip for historical templates)
- No critical issues found
- Ready for release: YES

### Phase 14: MCP Tool Optimization

**Goal**: Optimize GSI to fully utilize all MCP servers with batch operations and CG analysis

**Depends on**: Phase 13 (Comprehensive Testing)

**Success Criteria**:
1. All workflows use read_multiple_files for 3+ file reads
2. CodeGraphContext tools integrated into commands
3. CI symbol navigation active in workflows
4. Tool usage benchmarks documented
5. MCP enforcement covers all new tools

**Plans**: 6 plans

**Status**: Plans created

**Plans**:
- [ ] 14-01: Add read_multiple_files to workflows (6 tasks)
- [ ] 14-02: Add CodeGraphContext to commands (6 tasks)
- [ ] 14-03: Update workflows with CG analysis (7 tasks)
- [ ] 14-04: Add CI symbol navigation (6 tasks)
- [ ] 14-05: Create tool usage benchmarks (6 tasks)
- [ ] 14-06: Update mcp-enforcer for new tools (5 tasks)

### Phase 15: Thinking Server Enforcement

**Goal**: Enforce thinking server usage before, during, and after tool execution

**Depends on**: Phase 14 (MCP Tool Optimization)

**Success Criteria**:
1. PreToolUse thinking hook created
2. All workflows have thinking_phase sections
3. 7-BMAD mapped to thinking servers
4. Thinking verification checkpoints active
5. PostToolUse reflection hook working

**Plans**: 5 plans

**Status**: Plans created

**Plans**:
- [ ] 15-01: Create PreToolUse thinking hook (7 tasks)
- [ ] 15-02: Add thinking workflow sections (6 tasks)
- [ ] 15-03: Integrate 7-BMAD with thinking servers (7 tasks)
- [ ] 15-04: Add thinking verification checkpoints (6 tasks)
- [ ] 15-05: Add PostToolUse reflection hook (6 tasks)

### Phase 16: README Transformation

**Goal**: Create completely new README for GSI fork with MCP and thinking documentation

**Depends on**: Phase 15 (Thinking Server Enforcement)

**Success Criteria**:
1. Clear fork attribution with original repo link
2. MCP tool comparison tables with token savings
3. Thinking server documentation complete
4. Installation and quick start guide working
5. Feature showcase comprehensive

**Plans**: 6 plans

**Status**: Complete ✓ (2026-02-15)

**Completed**: 2026-02-15

**Plans**:
- [x] 16-01: Fork attribution section (7 tasks)
- [x] 16-02: MCP tool comparison tables (7 tasks)
- [x] 16-03: Thinking server documentation (7 tasks)
- [x] 16-04: Installation and getting started (8 tasks)
- [x] 16-05: Feature showcase (8 tasks)
- [x] 16-06: Assemble final README (7 tasks)

### Phase 17: Complexity Prediction System

**Goal**: Intelligent complexity prediction with Three-Layer Intelligence architecture that auto-detects model specs and adapts thresholds

**Depends on**: Phase 16 (README Transformation)

**Success Criteria**:
1. Layer 1 (Model Awareness): Auto-detect model specs without internet search
2. Layer 2 (Complexity Analysis): Integrated Cognitive Orchestration (Tractatus+CI, Sequential+CG, Debug+DC)
3. Layer 3 (Auto-Split): Automatic phase splitting when score exceeds threshold
4. Learning system captures patterns in debug-thinking for continuous improvement
5. Context limit failures reduced from 35% to <5%

**Plans**: 5 plans in 3 waves

**Status**: Complete ✓ (2026-02-15)

**Completed**: 2026-02-15

**Plans**:
- [x] 17-01: Model Awareness System - Layer 1 (7 tasks) - Wave 1
- [x] 17-02: PreToolUse Complexity Hook (7 tasks) - Wave 1
- [x] 17-03: Integrated Cognitive Orchestration - Layer 2 (8 tasks) - Wave 2
- [x] 17-04: Auto-Split Decision Engine - Layer 3 (7 tasks) - Wave 2
- [x] 17-05: Learning & Threshold Adaptation (6 tasks) - Wave 3

**Results**:
- lib/complexity/ created with 11 modules (model-awareness, scorer, cognitive-flow, phases, auto-split, warning, learning, threshold-adapter)
- Three-layer architecture: Model Awareness → Cognitive Flow → Auto-Split
- PreToolUse hook for complexity prediction before agent execution
- Learning system with debug-thinking integration
- Model-specific thresholds: haiku(40), sonnet(50), opus(60)

### Phase 18: Naming Standardization

**Goal**: Standardize all GSI naming to lowercase gsi convention with no legacy gsd references

**Depends on**: Phase 17 (Complexity Prediction System)

**Success Criteria**:
1. All gsd-* agent files renamed to gsi-* in place
2. Command prefix standardized to /gsi: lowercase
3. Command directories consolidated to single commands/gsi/
4. No broken references after rename
5. Git history preserved

**Plans**: 3 plans in 3 waves

**Status**: Plans created

**Plans**:
- [ ] 18-01: Rename gsd-* agents to gsi-* (6 tasks) - Wave 1
- [ ] 18-02: Update command prefix documentation (6 tasks) - Wave 2
- [ ] 18-03: Consolidate command directories (5 tasks) - Wave 3

### Phase 19: Prompt Enhancer

**Goal**: Create Integrated Prompt Enhancer that rewrites user input for clarity using cognitive flow

**Depends on**: Phase 17 (Complexity Prediction System), Phase 18 (Naming Standardization)

**Success Criteria**:
1. All /gsi: commands can be enhanced before execution
2. Three-Layer Cognitive Flow integrated (Tractatus+CI, Sequential+CG, Debug+DC)
3. User confirmation respects YOLO mode
4. Pattern learning captures enhancement history
5. Enhancement is optional (can be bypassed)

**Plans**: 4 plans

**Status**: Plans created, ready for execution

**Plans**:
- [ ] 19-01: Command interception layer (7 tasks)
- [ ] 19-02: Cognitive enhancement engine (8 tasks)
- [ ] 19-03: User confirmation UI (6 tasks)
- [ ] 19-04: Pattern learning integration (6 tasks)

### Phase 20: Thinking Integration Completion

**Goal**: Complete thinking server integration so thinking happens before, during, and after ALL tool executions

**Depends on**: Phase 17 (Complexity Prediction System), Phase 19 (Prompt Enhancer)

**Success Criteria**:
1. Hooks registered in Claude settings (not just hooks.json)
2. Thinking servers called before tool operations (PreToolUse)
3. Reflection captured after tool operations (PostToolUse)
4. All GSI commands have thinking integration
5. All workflows have thinking phases

**Plans**: 5 plans in 5 waves

**Status**: Plans created

**Plans**:
- [ ] 20-01: Hook Registration in Claude Settings (7 tasks) - Wave 1
- [ ] 20-02: PreToolUse Thinking Integration (8 tasks) - Wave 2
- [ ] 20-03: PostToolUse Reflection System (7 tasks) - Wave 3
- [ ] 20-04: Command Thinking Integration (7 tasks) - Wave 4
- [ ] 20-05: Workflow Thinking Phases (7 tasks) - Wave 5

**Key Gap Addressed**:
The thinking infrastructure from Phase 15/17 exists as code but is NOT actually being invoked during tool execution. This phase connects the code to actual Claude tool execution through proper hook registration and thinking orchestrators.

**Extended Plans** (split from original):
- [x] 20-02a: Thinking Mode Selector (6 tasks) - Split for granularity ✅
- [x] 20-02b: Thinking Orchestrator (7 tasks) - Split for granularity ✅
- [x] 20-04a: Command Thinking Wrapper (6 tasks) - Split for granularity ✅

**Enhancement Plans** (full system integration):
- [ ] 20-04b: Agent & Command Thinking Integration (6 tasks) - All agents and commands
- [ ] 20-04c: Reference Thinking Integration (6 tasks) - All reference files
- [ ] 20-04d: Template Thinking Integration (5 tasks) - All template files
- [ ] 20-06: Install Location Detection (7 tasks) - Auto-detect global vs project
- [ ] 20-07: Cross-Feature Enhancement (7 tasks) - Full mutual feature enhancement

**Phase 20 Status**: 6/11 plans complete (55%)

### Phase 21: GSD Update Integration

**Goal**: Monitor original GSD npm package for updates and integrate relevant changes into GSI

**Depends on**: Phase 20 (Thinking Integration Completion)

**Success Criteria**:
1. Automated GSD version checking
2. Change analysis and categorization
3. Integration suggestions generated
4. CLI commands for update management
5. Update history tracked

**Plans**: 1 plan

**Status**: Plans created

**Plans**:
- [ ] 21-01: GSD Update Monitoring System (7 tasks)

### Phase 22: Advanced Pattern Learning

**Goal**: Create advanced pattern learning system that learns from operations and predicts optimal approaches

**Depends on**: Phase 20 (Thinking Integration Completion)

**Success Criteria**:
1. Pattern recognition engine working
2. Pattern storage and retrieval
3. Prediction system active
4. Learning loop integrated with thinking
5. Visualization of learned patterns

**Plans**: 1 plan

**Status**: Complete ✓ (2026-02-16)

**Plans**:
- [x] 22-01: Advanced Pattern Learning System (7 tasks)

### Phase 23: Package Self-Containment

**Goal**: Make GSI package fully self-contained with all required files in source code, no dependencies on global modifications made during development

**Depends on**: Phase 22 (Advanced Pattern Learning)

**Success Criteria**:
1. All global rules files copied to source code repository
2. All absolute path references replaced with package-relative paths
3. Install script copies rules directory during installation
4. No hardcoded user paths remain in source code
5. Package is installable on any system without prior setup

**Plans**: 4 plans in 3 waves

**Status**: Complete ✓ (2026-02-16)

**Completed**: 2026-02-16

**Plans**:
- [x] 23-01: Move Global Rules to Source Code (5 tasks) - Wave 1
- [x] 23-02: Update Absolute Path References (6 tasks) - Wave 1
- [x] 23-03: Update Install Script for Rules (6 tasks) - Wave 2
- [x] 23-04: Verification & Testing (7 tasks) - Wave 3

**Results**:
- 4 rules files copied to references/rules/ (1,434 lines)
- 3 validation files updated with package-relative paths
- Install script updated to copy rules directory
- 0 hardcoded user paths remaining
- GSI package is fully self-contained

**Key Gap Addressed**:
The global rules files (auto-validation.md, code-review.md, tool-priority.md, README.md) in ~/.claude/rules/ were created during development but never added to the source code package. This means users installing via npm wouldn't get these critical files.
