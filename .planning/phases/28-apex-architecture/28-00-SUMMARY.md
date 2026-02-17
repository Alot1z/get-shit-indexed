# Phase 28: Apex Architecture Implementation

## Summary

Phase 28 implements the unified "Heretic-API" system combined with MCP-to-CLI conversion, creating a self-contained skill/hook system for Claude Code.

## Plans Overview

| Plan | Wave | Status | Tasks | Focus |
|------|------|--------|-------|-------|
| 28-01 | 1 | Pending | 3 | Analysis & Rewriting Foundation |
| 28-02 | 2 | Pending | 3 | Parallel Branching & Verification |
| 28-03 | 2 | Pending | 4 | CLI Tools Integration |
| 28-04 | 3 | Pending | 4 | Claude Code Skill Integration |

## Total Tasks: 14

## Dependencies

```
28-01 (Foundation)
    ↓
28-02 (Branching) ──→ 28-04 (Integration)
    ↓                   ↑
28-03 (CLI) ────────────┘
```

## Key Deliverables

1. **Risk Analysis Engine** - Heuristic + semantic risk detection
2. **Prompt Rewriter** - 4 semantic strategies (academic, engineering, decomposition, counterfactual)
3. **Parallel Dispatcher** - Multi-branch API execution
4. **Soft Refusal Detector** - Hedging and refusal pattern detection
5. **Response Scorer** - Semantic similarity and completeness scoring
6. **CLI Tools** - Standalone analyze, rewrite, score commands
7. **Claude Code Skill** - Pre/post hooks for automatic intervention

## Success Metrics

- Risk detection accuracy: >80%
- Soft refusal detection: >90%
- Token reduction: >60%
- Processing latency: <10s for parallel branching
- Zero MCP server dependency for core tools

## Research References

- [Heretic Refusal Direction Paper](https://arxiv.org/abs/2403.05853)
- [Self-Consistency Reasoning](https://arxiv.org/abs/2203.11171)
- [Sentence Transformers](https://github.com/UKPLab/sentence-transformers)
- [Original Heretic Repo](https://github.com/p-e-w/heretic)

---

**Status**: Ready for execution planning confirmation
