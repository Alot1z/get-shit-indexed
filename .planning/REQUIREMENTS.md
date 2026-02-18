# Requirements: MCP-Enhanced GSI

**Defined:** 2025-02-11
**Core Value:** Token-efficient, reliable GSI workflows that leverage all three MCP servers (DC + CI + CG) using proven tool chain patterns.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### MCP Integration

- [ ] **MCP-001**: Code-Index MCP (CI) fully integrated with <code_index_mcp> headers across all workflows
- [ ] **MCP-002**: Desktop Commander (DC) fully integrated across all GSI workflows
- [ ] **MCP-003**: CodeGraphContext (CG) integrated for relationship-aware workflows
- [ ] **MCP-004**: All 3 MCP servers (DC + CI + CG) available and properly configured
- [ ] **MCP-005**: Tool priority rules enforced (MCP > Native) with 80-90% token savings
- [ ] **MCP-006**: Golden pattern (CG → CI → CI → DC → DC → CI) implemented in workflows

### Workflow Updates

- [ ] **WORKFLOW-001**: All 13 GSI workflow files updated with MCP tool usage instead of native bash commands
- [ ] **WORKFLOW-002**: map-codebase.md fully MCP-integrated with wave-based agent spawning
- [ ] **WORKFLOW-003**: `<code_index_mcp>` headers added to workflows for declarative MCP usage
- [ ] **WORKFLOW-004**: GSI commands at `~/.claude/commands\GSI` updated for all 3 MCP servers
- [ ] **WORKFLOW-005**: Parallel agent orchestration with rate limiting and staggered spawning
- [ ] **WORKFLOW-006**: Configurable model profiles (quality/balanced/budget) working across agents
- [ ] **WORKFLOW-007**: YOLO mode (auto-approve) for frictionless execution

### Documentation & Research Integration

- [ ] **DOC-001**: CODE-INDEX-MCP-GUIDE.md created for Code-Index server usage patterns
- [ ] **DOC-002**: TOOL-PRIORITY-RULES.md created enforcing MCP tool priority over native tools
- [ ] **DOC-003**: All MCP tool chain research files consolidated into unified reference guides
- [ ] **DOC-004**: Mermaid diagrams included for all 15 linear, 4 circular, and 5 hybrid patterns
- [ ] **DOC-005**: Tool chain reference with decision trees for optimal tool selection

### Repository Synchronization

- [ ] **REPO-001**: Local directory `~/.claude/get-shit-indexed` synced to cloned upstream repo
- [ ] **REPO-002**: `<YOUR_REPO_PATH>` updated with all 3-MCP integrations
- [ ] **REPO-003**: All local changes pushed to clone maintaining bidirectional sync
- [ ] **REPO-004**: Clone established as single source of truth for GSI enhancements

### Thinking Server Integration

- [ ] **THINK-001**: Sequential thinking server integrated with 7-BMAD methodology
- [ ] **THINK-002**: Tractatus thinking server integrated for logical structure analysis  
- [ ] **THINK-003**: Debug thinking server integrated with graph-based problem-solving
- [ ] **THINK-004**: All 3 thinking servers properly configured and available in workflows
- [ ] **THINK-005**: Tool chains updated based on which thinking server is active (DC/CI/CG variants)

### Quality & Verification

- [ ] **QUAL-001**: Auto-validation system integrated with 7-BMAD quality gates on all agent work
- [ ] **QUAL-002**: Code review expert skill integrated for validation checks
- [ ] **QUAL-003**: Plan checker integrated to verify plans achieve phase goals
- [ ] **QUAL-004**: Verifier integrated to confirm deliverables match phase goals
- [ ] **QUAL-005**: All requirements testable and verifiable with clear success criteria

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

(All research and analysis deferred to v2)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Enterprise features | No teams, stakeholders, or project management overhead |
| Complex authentication | No OAuth, SSO, or permission systems |
| Story points | No agile ceremony — just GSI guarantees |
| Separate documentation site | Single-source truth in workflow files |
| Commercial hosting | No cloud services, external dependencies |
| Database backends | No external databases, file-based only |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

### MCP Integration (Phase 1)

| Requirement | Phase | Status |
|-------------|-------|--------|
| MCP-001 | Phase 1 | Pending |
| MCP-002 | Phase 1 | Pending |
| MCP-003 | Phase 1 | Pending |
| MCP-004 | Phase 1 | Pending |
| MCP-005 | Phase 1 | Pending |
| MCP-006 | Phase 1 | Pending |

### Workflow Updates (Phases 2, 7, 8)

| Requirement | Phase | Status |
|-------------|-------|--------|
| WORKFLOW-001 | Phase 2 | Pending |
| WORKFLOW-002 | Phase 2 | Pending |
| WORKFLOW-003 | Phase 2 | Pending |
| WORKFLOW-004 | Phase 7 | Pending |
| WORKFLOW-005 | Phase 8 | Pending |
| WORKFLOW-006 | Phase 8 | Pending |
| WORKFLOW-007 | Phase 8 | Pending |

### Documentation & Research Integration (Phase 3)

| Requirement | Phase | Status |
|-------------|-------|--------|
| DOC-001 | Phase 3 | Pending |
| DOC-002 | Phase 3 | Pending |
| DOC-003 | Phase 3 | Pending |
| DOC-004 | Phase 3 | Pending |
| DOC-005 | Phase 3 | Pending |

### Repository Synchronization (Phase 4)

| Requirement | Phase | Status |
|-------------|-------|--------|
| REPO-001 | Phase 4 | Pending |
| REPO-002 | Phase 4 | Pending |
| REPO-003 | Phase 4 | Pending |
| REPO-004 | Phase 4 | Pending |

### Thinking Server Integration (Phase 5)

| Requirement | Phase | Status |
|-------------|-------|--------|
| THINK-001 | Phase 5 | Pending |
| THINK-002 | Phase 5 | Pending |
| THINK-003 | Phase 5 | Pending |
| THINK-004 | Phase 5 | Pending |
| THINK-005 | Phase 5 | Pending |

### Quality & Verification (Phase 6)

| Requirement | Phase | Status |
|-------------|-------|--------|
| QUAL-001 | Phase 6 | Pending |
| QUAL-002 | Phase 6 | Pending |
| QUAL-003 | Phase 6 | Pending |
| QUAL-004 | Phase 6 | Pending |
| QUAL-005 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0

---
*Requirements defined: 2025-02-11*
*Last updated: 2025-02-11 after requirements definition*
