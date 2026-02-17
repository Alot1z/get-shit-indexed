# Phase 28: Apex Architecture - Expanded Structure

## Overview
Phase 28 is now split into **12 sub-phases** (28-01 through 28-12) with granular tasks and clear dependencies.

---

## Wave 1: Foundation Analysis (Phases 28-01 to 28-04)

### Phase 28-01: Risk Analysis Core
**Plans: 2 | Tasks: 6**
- 28-01-A: Heuristic Risk Analyzer (3 tasks)
  - Pattern matching engine
  - Risk category classification
  - Weighted scoring algorithm
- 28-01-B: Semantic Risk Engine (3 tasks)
  - Embedding model integration
  - Refusal cluster centroids
  - Cosine similarity calculator

### Phase 28-02: Prompt Rewriting Engine
**Plans: 2 | Tasks: 7**
- 28-02-A: Template Strategies (4 tasks)
  - Academic template
  - Engineering template
  - Decomposition template
  - Counterfactual template
- 28-02-B: Strategy Selection (3 tasks)
  - Risk-to-strategy mapping
  - Template application
  - Intent preservation verification

### Phase 28-03: Token Analysis & Metrics
**Plans: 2 | Tasks: 5**
- 28-03-A: Token Counter (3 tasks)
  - Prompt token counting
  - Response token counting
  - Compression ratio calculation
- 28-03-B: Performance Metrics (2 tasks)
  - Baseline metrics collection
  - Optimization benchmarking

### Phase 28-04: Validation Gates Framework
**Plans: 3 | Tasks: 8**
- 28-04-A: Method Circle Validation (3 tasks)
  - Implementation correctness checks
  - Logic verification tests
  - Edge case handling
- 28-04-B: Mad Circle Validation (2 tasks)
  - Integration completeness checks
  - API contract validation
- 28-04-C: Quality Gates (3 tasks)
  - Automated test suite
  - Coverage reporting
  - Gate enforcement

---

## Wave 2: Execution & Verification (Phases 28-05 to 28-08)

### Phase 28-05: Parallel Execution Engine
**Plans: 3 | Tasks: 9**
- 28-05-A: Request Dispatcher (3 tasks)
  - Multi-branch request creation
  - Parallel execution controller
  - Timeout handling
- 28-05-B: API Integration (3 tasks)
  - GLM-5 client
  - Claude API client
  - OpenAI client
- 28-05-C: Response Aggregator (3 tasks)
  - Response collection
  - Metadata tagging
  - Error handling

### Phase 28-06: Refusal Detection
**Plans: 2 | Tasks: 6**
- 28-06-A: Pattern Detection (3 tasks)
  - Refusal phrase database
  - Hedging indicator detection
  - Partial compliance detection
- 28-06-B: ML Classifier (3 tasks)
  - Training data collection
  - Model training
  - Classification pipeline

### Phase 28-07: Response Scoring & Selection
**Plans: 3 | Tasks: 8**
- 28-07-A: Semantic Scorer (3 tasks)
  - Embedding similarity calculation
  - Relevance scoring
  - Quality metrics
- 28-07-B: Completeness Analyzer (2 tasks)
  - Requirement fulfillment check
  - Missing element detection
- 28-07-C: Best Response Selector (3 tasks)
  - Ranking algorithm
  - Confidence calculation
  - Fallback strategy

### Phase 28-08: Retry & Fallback Logic
**Plans: 2 | Tasks: 5**
- 28-08-A: Retry Controller (3 tasks)
  - Retry trigger logic
  - Exponential backoff
  - Max retry limits
- 28-08-B: Fallback Handler (2 tasks)
  - Degraded mode operation
  - Error recovery

---

## Wave 3: CLI & Integration (Phases 28-09 to 28-12)

### Phase 28-09: CLI Tool Development
**Plans: 4 | Tasks: 12**
- 28-09-A: Package Setup (2 tasks)
  - package.json configuration
  - Binary entry point
- 28-09-B: Analyze Command (3 tasks)
  - CLI argument parsing
  - Risk analysis output
  - JSON formatting
- 28-09-C: Rewrite Command (3 tasks)
  - Strategy selection UI
  - Multi-variant output
  - Template preview
- 28-09-D: Score Command (4 tasks)
  - File input handling
  - Batch processing
  - Comparison report

### Phase 28-10: Context Optimization
**Plans: 3 | Tasks: 8**
- 28-10-A: Hierarchical Summarization (3 tasks)
  - Telescope method implementation
  - 4-layer cache system
  - Summarization pipeline
- 28-10-B: Vector Offloading (3 tasks)
  - Local embedding index
  - Chunking strategy
  - Retrieval system
- 28-10-C: Context Manager (2 tasks)
  - LRU cache implementation
  - Cache hit rate tracking

### Phase 28-11: Claude Code Integration
**Plans: 3 | Tasks: 10**
- 28-11-A: Skill Definition (2 tasks)
  - skill.yaml configuration
  - Hook registration
- 28-11-B: Pre-Hook Implementation (4 tasks)
  - Prompt interception
  - Risk analysis trigger
  - Rewrite injection
  - Context modification
- 28-11-C: Post-Hook Implementation (4 tasks)
  - Response interception
  - Refusal detection
  - Auto-retry trigger
  - Result replacement

### Phase 28-12: Testing & Documentation
**Plans: 3 | Tasks: 9**
- 28-12-A: Test Suite (4 tasks)
  - Unit tests (60+ tests)
  - Integration tests
  - E2E scenarios
  - Performance benchmarks
- 28-12-B: Documentation (3 tasks)
  - API documentation
  - Usage examples
  - Architecture diagrams
- 28-12-C: Release Preparation (2 tasks)
  - Version tagging
  - Release notes

---

## Dependency Graph

```
Wave 1 (Foundation)
├── 28-01 (Risk) ────────────────┐
├── 28-02 (Rewrite) ─────────────┤
├── 28-03 (Metrics) ─────────────┤──→ Wave 2
└── 28-04 (Validation) ──────────┘

Wave 2 (Execution)
├── 28-05 (Dispatch) ────────────┐
├── 28-06 (Detection) ───────────┤
├── 28-07 (Scoring) ─────────────┤──→ Wave 3
└── 28-08 (Retry) ───────────────┘

Wave 3 (Integration)
├── 28-09 (CLI) ─────────────────┐
├── 28-10 (Context) ─────────────┤
├── 28-11 (Skill) ───────────────┤──→ Complete
└── 28-12 (Tests) ───────────────┘
```

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Sub-Phases | 12 |
| Total Plans | 31 |
| Total Tasks | 96 |
| Estimated Lines of Code | ~8,500 |
| Estimated Duration | 8-12 weeks |

---

## Success Criteria (All 12 Phases)

1. **Accuracy**: Risk detection >80%, Refusal detection >90%
2. **Performance**: <10s parallel execution, <500ms analysis
3. **Coverage**: 60+ unit tests, 95%+ coverage
4. **Token Savings**: >60% reduction vs baseline
5. **Integration**: Native Claude Code skill, zero MCP dependency
6. **Documentation**: Complete API docs, examples, diagrams
7. **Quality**: All 7-BMAD gates pass validation

---

**Status**: Ready for granular execution planning
