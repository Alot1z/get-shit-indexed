# Phase 17: Complexity Prediction System - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Create an intelligent complexity prediction system that analyzes plans before execution, predicts context limit issues, and automatically recovers through sub-phase splitting. This is a meta-cognitive layer for GSI that makes it self-aware of its own limitations.

</domain>

<decisions>
## Implementation Decisions

### Multi-Layer Prediction Architecture
- **PreToolUse Hook** - Primary prediction layer, runs before any tool execution
- **During Planning** - Complexity assessment integrated into plan-phase workflow
- **Execute-Plan Workflow** - Mid-flight adjustment capability when patterns detected
- **Separate Pre-Flight Command** - `/GSI:check-complexity` for manual verification
- All four layers work together for comprehensive coverage

### Auto-Split Behavior
- Plans with complexity score > 70: Auto-split into sub-phases
- Plans with complexity score 40-70: Warn user, offer options:
  - "Auto-split now" - Immediate split into sub-phases
  - "Discuss first" - Launch discuss-phase for the split strategy
  - "Proceed anyway" - Execute with monitoring (may fail)
- Auto-discussion logic: If split involves architectural decisions, auto-trigger discuss-phase

### Learning System Architecture
- **Primary**: Capture patterns in `~/.debug-thinking-mcp/` for future predictions
- **Secondary**: Update `complexity-thresholds.json` based on failure patterns
- **Pattern Storage**: Local-only, no external hosting required
- **Privacy**: All learning stays on user's machine (100% privacy safe)

### Complexity Scoring Formula
```
Score = (
  fileOps * 2 +      // Each file read = 2-5K tokens
  symbolQueries * 5 + // Each symbol extraction = 3-10K tokens
  cgQueries * 8 +     // Each graph query = 5-15K tokens
  taskCount * 10 +    // Each task = 10-20K tokens
  crossRefs * 3       // Each cross-reference = 5K tokens
) / 100
```

### Model-Specific Thresholds
| Model | Safe | Warning | Auto-Split |
|-------|------|---------|------------|
| haiku | <40 | 40-70 | >70 |
| sonnet | <50 | 50-80 | >80 |
| opus | <60 | 60-85 | >85 |

### Claude's Discretion
- Exact scoring weights (tune based on empirical data)
- How to present warnings to user (verbosity level)
- Which patterns to prioritize for learning
- Threshold adjustment algorithms

</decisions>

<specifics>
## Specific Ideas

### PreToolUse Hook Flow
```
1. Intercept tool call
2. Parse plan/task context
3. Calculate complexity score
4. If score > threshold:
   - Block execution
   - Log warning
   - Offer auto-split options
5. If score OK: Allow execution
```

### Execute-Plan Mid-Flight Adjustment
```
1. Monitor token usage during execution
2. If approaching limit (80% of context):
   - Pause execution
   - Create checkpoint
   - Suggest split or continue with smaller scope
3. Resume with adjusted strategy
```

### Learning Pattern Format (debug-thinking)
```javascript
{
  nodeType: "complexity_pattern",
  content: "Plan X-Y with N files failed at Z% context",
  metadata: {
    fileCount: N,
    symbolQueries: M,
    score: S,
    model: "haiku",
    outcome: "failed" | "split" | "success"
  }
}
```

### Future Enhancement: Pattern Sharing (Optional)
- Local-first design: No hosting required
- If user wants to share: Export anonymized patterns
- Community patterns could be imported as `.json` files
- No PII ever leaves user's machine
- NOT implementing now - just architecture consideration

</specifics>

<deferred>
## Deferred Ideas

- Cloud-based pattern database - Privacy concerns, hosting costs
- Real-time model switching based on complexity - Requires API changes
- Machine learning for threshold optimization - Overkill for current needs
- Cross-user pattern aggregation - Privacy and hosting concerns

</deferred>

---

*Phase: 17-complexity-prediction*
*Context gathered: 2026-02-15*
