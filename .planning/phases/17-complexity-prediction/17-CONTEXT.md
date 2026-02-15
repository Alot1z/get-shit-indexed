# Phase 17: Complexity Prediction System - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning (enhanced with Integrated Cognitive Orchestration)

<domain>
## Phase Boundary

Create an intelligent complexity prediction system that uses Integrated Cognitive Orchestration - combining all 3 thinking servers (Tractatus, Sequential, Debug) with all 3 MCP servers (CI, CG, DC) in an iterative, learning-first flow. This revolutionizes how thinking servers work: instead of isolated thoughts, they interleave with MCP tools in a continuous cognitive loop.

</domain>

<decisions>
## Implementation Decisions

### Cognitive Flow Architecture (REVOLUTIONARY)
- **NOT parallel flows** - Each step must feed the next (sequential dependency)
- **Three-phase flow**: Structure → Process → Learning (iterative interleave)
- **Learning-first**: Debug queries patterns BEFORE analysis begins
- **Result feeding**: Each MCP tool output feeds next thinking server decision

### Phase 1: Structure Analysis (Tractatus + CI)
- Tractatus: Start analysis of plan structure and complexity factors
- CI Integration: `get_file_summary`, `find_files` to count operations
- Tractatus: Decompose into atomic complexity propositions
- CI Integration: `search_code_advanced` for symbol references
- Tractatus: Export structural analysis with file complexity weights

### Phase 2: Process Assessment (Sequential + CG)
- Sequential: Thought 1 - Identify what needs dependency analysis
- CG Integration: `find_path` for cross-file dependencies
- Sequential: Thought 2 - Calculate dependency impact weight
- CG Integration: `query` for relationship complexity
- Sequential: Thought 3 - Sum all complexity factors into score
- Sequential: Final thought - Decision on split/warn/execute

### Phase 3: Pattern Learning (Debug + DC)
- Debug: Query similar past plans FIRST (learning-first approach)
- DC Integration: `read_file` for complexity-thresholds.json
- Debug: Create node for this assessment in knowledge graph
- DC Integration: `write_file` for updated thresholds if pattern changes
- Debug: Connect to similar patterns in graph for future predictions

### Intelligent MCP Selection (NOT fallback)
- **Research-based**: Best tool selected based on situation analysis
- **Result-driven**: Tool selection adapts based on previous results
- **No generic fallback**: Each phase has specific tools, not "all available"
- **Flexible within phase**: Dynamic selection within defined boundaries

### Auto-Split Behavior
- Plans with complexity score > 70: Auto-split into sub-phases
- Plans with complexity score 40-70: Warn user, offer options
- Learning captured in debug-thinking for every decision

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
- Which MCP tool to select for each situation
- Threshold adjustment algorithms based on learning
- How to present warnings to user

</decisions>

<specifics>
## Specific Ideas

### Integrated Cognitive Flow (New Concept)
```javascript
// NOT isolated: sequential-thinking → done
// NEW: iterative interleave with result feeding

async function complexityAssessment(plan) {
  // Phase 1: Structure (Tractatus + CI)
  const structure = await tractatus_thinking({operation: "start", concept: "Analyze plan structure"});
  const fileFacts = await ci.get_file_summary(plan.files); // Feeds thinking
  await tractatus_thinking({operation: "add", content: `Files: ${fileFacts.length}`});
  const structuralAnalysis = await tractatus_thinking({operation: "export"});
  
  // Phase 2: Process (Sequential + CG)
  const dependencies = await cg.find_path(plan.affectedFiles); // Feeds thinking
  const process = await sequential_thinking({thought: `Dependencies: ${dependencies.length}`, ...});
  const score = await sequential_thinking({thought: "Calculate score", ...});
  
  // Phase 3: Learning (Debug + DC)
  const pastPatterns = await debug_thinking({action: "query", pattern: "complexity"}); // Learning-first
  const thresholds = await dc.read_file("complexity-thresholds.json");
  await debug_thinking({action: "create", content: `Score: ${score}`, metadata: {...}});
  
  return {score, action: decideAction(score)};
}
```

### Learning-First Approach
```javascript
// Query patterns BEFORE analysis, not after
const similarPlans = await debug_thinking({
  action: "query",
  queryType: "similar-problems",
  parameters: {pattern: "plan-complexity", limit: 5}
});

// Use historical data to inform current assessment
if (similarPlans.length > 0) {
  const avgScore = similarPlans.reduce((a, b) => a + b.score, 0) / similarPlans.length;
  // Adjust thresholds based on history
}
```

### Result Feeding Pattern
```
Tractatus analysis → produces structure propositions
     ↓ feeds
CI get_file_summary → produces file facts
     ↓ feeds
Sequential thinking → uses file facts in thoughts
     ↓ feeds
CG find_path → produces dependency graph
     ↓ feeds
Debug capture → stores enriched pattern with all data
```

### Multi-Layer Prediction Architecture
- **PreToolUse Hook** - Primary prediction layer using full cognitive flow
- **During Planning** - Complexity assessment integrated into plan-phase
- **Execute-Plan Workflow** - Mid-flight adjustment with learning capture
- **Separate Pre-Flight Command** - `/GSI:check-complexity` for manual verification

</specifics>

<deferred>
## Deferred Ideas

- Cloud-based pattern database - Privacy concerns, hosting costs
- Real-time model switching based on complexity - Requires API changes
- Parallel thinking flows - User confirmed sequential dependency needed
- Generic "all tools available" fallback - User wants intelligent selection instead

</deferred>

---

*Phase: 17-complexity-prediction*
*Context gathered: 2026-02-15*
*Enhanced: Integrated Cognitive Orchestration architecture*
