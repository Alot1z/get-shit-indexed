# Sub-Phase 49-H: Tool Optimization & Architecture

---
plan: 49-H
phase: 49
type: sub-phase
created: 2026-02-19
status: planned
tasks: 18
wave: 2
depends_on: [49-02, 49-06]
integrates: [42, 43, 44, 45, 46, 47]
---

## Objective

Integrate tool optimization from Phases 42-46 and complete architecture rectification from Phase 47.

## Source Phases

| Phase | Status | Focus Area |
|-------|--------|------------|
| 42 | Planned | Agent tool optimization |
| 43 | Planned | External tool integration |
| 44 | Planned | Knowledge flow |
| 45 | Planned | Adaptive workflow |
| 46 | Planned | Self-improving validation |
| 47 | Planned | Architecture rectification |

## Tasks

### Wave 1: Phase 42 - Agent Tool Optimization (Tasks 1-3)

- [ ] **Task 1**: Optimize all 11 GSI agents
  - gsi-planner tool usage
  - gsi-executor tool usage
  - gsi-researcher tool usage
  - gsi-verifier tool usage
  - gsi-debugger tool usage
  - gsi-codebase-mapper tool usage
  - gsi-knowledge-extractor tool usage
  - gsi-patch-manager tool usage
  - gsi-workflow-chainer tool usage
  - gsi-explorer tool usage (new)
  - gsi-rectifier tool usage (new)

- [ ] **Task 2**: Create situation-specific tool guides
  - Per-situation tool recommendations
  - Tool selection decision trees
  - Optimization patterns

- [ ] **Task 3**: Benchmark agent performance
  - Token usage per agent
  - Response time per agent
  - Optimization opportunities

### Wave 2: Phase 43 - External Tool Integration (Tasks 4-7)

- [ ] **Task 4**: Research semantic-code-search
  - Evaluate for GSI integration
  - Compare with code-index-mcp
  - Document integration approach

- [ ] **Task 5**: Research picoclaw
  - Evaluate for lightweight web fetching
  - Compare with rag-web-browser
  - Document integration approach

- [ ] **Task 6**: Research agent-lightning
  - Evaluate for fast agent spawning
  - Compare with current Task tool
  - Document integration approach

- [ ] **Task 7**: Research mdream
  - Evaluate for workflow enhancement
  - Document useful patterns
  - Integration recommendations

### Wave 3: Phase 44 - Knowledge Flow (Tasks 8-11)

- [ ] **Task 8**: Create Knowledge Hub
  - Central knowledge repository
  - Knowledge producer registration
  - Knowledge consumer interface

- [ ] **Task 9**: Connect knowledge producers
  - pattern-learning → Knowledge Hub
  - debug-thinking → Knowledge Hub
  - claudeception → Knowledge Hub

- [ ] **Task 10**: Connect knowledge consumers
  - prompt-enhancer ← Knowledge Hub
  - complexity-predictor ← Knowledge Hub
  - gsi-planner ← Knowledge Hub

- [ ] **Task 11**: Create knowledge flow visualization
  - Visualize knowledge graph
  - Track knowledge propagation
  - Identify flow bottlenecks

### Wave 4: Phase 45 - Adaptive Workflow (Tasks 12-13)

- [ ] **Task 12**: Implement adaptive execution
  - Complexity-based workflow selection
  - Dynamic plan adjustment
  - Real-time optimization

- [ ] **Task 13**: Create workflow templates
  - Simple task template
  - Complex task template
  - Research task template
  - Rectification task template

### Wave 5: Phase 46 - Self-Improving Validation (Tasks 14-15)

- [ ] **Task 14**: Enhance validation with learning
  - Learn from validation failures
  - Improve validation criteria
  - Adaptive strictness

- [ ] **Task 15**: Create validation feedback loop
  - Capture validation patterns
  - Feed to pattern-learning
  - Continuous improvement

### Wave 6: Phase 47 - Architecture Rectification (Tasks 16-18)

- [ ] **Task 16**: Create module inventory
  - Inventory all lib/ modules
  - Classify by purpose
  - Identify dependencies

- [ ] **Task 17**: Create module registry system
  - Register all modules
  - Health metrics per module
  - Dependency tracking

- [ ] **Task 18**: Archive legacy modules
  - Identify unused modules
  - Archive with documentation
  - Update references

## Success Criteria

- [ ] All 11 agents optimized
- [ ] External tools researched and documented
- [ ] Knowledge Hub operational
- [ ] Module registry complete
- [ ] Self-improving validation active

## Allowed Tools (Full Cognitive Flow)

```yaml
# File Operations
mcp__desktop-commander__*     # All Desktop Commander tools

# Code Analysis
mcp__code-index-mcp__*        # All Code-Index tools
mcp__CodeGraphContext__*      # Relationship analysis

# Thinking Servers (Cognitive Flow)
mcp__sequential-thinking__*   # Step-by-step reasoning
mcp__tractatusthinking__*     # Logical structure analysis
mcp__debug-thinking__*        # Problem-solution mapping

# External Knowledge
mcp__deepwiki__*              # GitHub repo research
mcp__context7__*              # Library documentation

# Orchestration
Task                          # Subagent spawning
```
