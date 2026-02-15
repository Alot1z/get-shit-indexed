# Phase 17: Complexity Prediction System - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning (enhanced with Three-Layer Intelligence + Model Awareness)

<domain>
## Phase Boundary

Create an intelligent complexity prediction system with Three-Layer Intelligence architecture:
1. **Layer 1 - Model Awareness**: Auto-detect model specs without user input or internet search
2. **Layer 2 - Complexity Analysis**: Integrated Cognitive Orchestration (Tractatus + Sequential + Debug)
3. **Layer 3 - Auto-Split Decision**: Automatic phase splitting when score exceeds threshold

This system makes GSI self-aware of model capabilities and adapts complexity thresholds automatically.

</domain>

<decisions>
## Implementation Decisions

### Three-Layer Intelligence Architecture (REVOLUTIONARY)

| Layer | Name | What It Does | When It Triggers |
|-------|------|--------------|------------------|
| 1 | Model Awareness | Detect current model, load specs, set thresholds | Session start, model change |
| 2 | Complexity Analysis | Full cognitive flow (Tractatus+CI → Sequential+CG → Debug+DC) | Before any agent spawn |
| 3 | Auto-Split Decision | Calculate score, decide split/warn/execute | After complexity analysis |

### Layer 1: Model Awareness System

**Zero-Token Model Detection:**
- Claude Code exposes model in API response metadata (FREE information)
- Environment variable: `CLAUDE_MODEL` or detect from response headers
- No internet search required - all information is local

**Local Model Specs Cache:**
```json
// .planning/model-specs.json (compressed, ~500 bytes)
{
  "claude-sonnet-4-5-20250929": {
    "context_window": 200000,
    "safe_threshold": 50,
    "warn_threshold": 80,
    "split_threshold": 80,
    "avg_token_per_file": 3000,
    "avg_token_per_task": 15000
  },
  "claude-opus-4-6": {
    "context_window": 200000,
    "safe_threshold": 60,
    "warn_threshold": 85,
    "split_threshold": 85,
    "avg_token_per_file": 3000,
    "avg_token_per_task": 15000
  },
  "claude-haiku-4-5-20251001": {
    "context_window": 200000,
    "safe_threshold": 40,
    "warn_threshold": 70,
    "split_threshold": 70,
    "avg_token_per_file": 3000,
    "avg_token_per_task": 15000
  }
}
```

**Model Change Detection:**
- Compare current model ID with last session's model
- If changed: Reload thresholds, log change, continue seamlessly
- No user intervention required - fully automatic

### Layer 2: Complexity Analysis (Integrated Cognitive Orchestration)

**Three-Phase Cognitive Flow (Iterative Interleave, NOT Parallel):**

**Phase 1: Structure Analysis (Tractatus + CI)**
- Tractatus: Start analysis of plan structure
- CI Integration: `get_file_summary`, `find_files` to count operations
- Tractatus: Decompose into atomic complexity propositions
- CI Integration: `search_code_advanced` for symbol references
- Tractatus: Export structural analysis with file complexity weights

**Phase 2: Process Assessment (Sequential + CG)**
- Sequential: Thought 1 - Identify dependency analysis needs
- CG Integration: `find_path` for cross-file dependencies
- Sequential: Thought 2 - Calculate dependency impact weight
- CG Integration: `query` for relationship complexity
- Sequential: Thought 3 - Sum all complexity factors
- Sequential: Final thought - Decision recommendation

**Phase 3: Pattern Learning (Debug + DC)**
- Debug: Query similar past plans FIRST (learning-first)
- DC Integration: `read_file` for model-specs.json
- Debug: Create node for this assessment
- DC Integration: `write_file` for updated patterns
- Debug: Connect to similar patterns in knowledge graph

### Layer 3: Auto-Split Decision Engine

**Complexity Scoring Formula:**
```
Score = (
  fileOps * 2 +       // Each file read = 2-5K tokens
  symbolQueries * 5 + // Each symbol extraction = 3-10K tokens
  cgQueries * 8 +     // Each graph query = 5-15K tokens
  taskCount * 10 +    // Each task = 10-20K tokens
  crossRefs * 3       // Each cross-reference = 5K tokens
) / 100
```

**Model-Specific Thresholds (Auto-Loaded from Cache):**

| Model | Safe | Warning | Auto-Split |
|-------|------|---------|------------|
| haiku | <40 | 40-70 | >70 |
| sonnet | <50 | 50-80 | >80 |
| opus | <60 | 60-85 | >85 |

**Auto-Split Behavior:**
- Score > split_threshold: Auto-split into sub-phases
- Score 40-70: Warn user, offer options (proceed/split/manual)
- Score < safe_threshold: Execute normally

### Intelligent MCP Selection (NOT Fallback)
- Research-based: Best tool selected based on situation
- Result-driven: Tool selection adapts based on previous results
- No generic fallback: Each phase has specific tools
- Flexible within phase: Dynamic selection within boundaries

### Claude's Discretion
- Exact scoring weights (tune based on empirical data)
- Which MCP tool to select for each situation
- Threshold adjustment algorithms based on learning
- How to present warnings to user
- Model spec updates when new models released

</decisions>

<specifics>
## Specific Ideas

### Layer 1: Model Awareness Implementation

```javascript
// Zero-token model detection
async function detectCurrentModel() {
  // Option 1: Environment variable (if Claude Code exposes it)
  const envModel = process.env.CLAUDE_MODEL;
  
  // Option 2: Parse from last API response metadata
  const lastResponse = getLastApiResponse();
  const modelId = lastResponse?.model;
  
  // Option 3: Infer from config.json profile
  const config = await dc.read_file(".planning/config.json");
  const profileModel = config.profiles[config.active_profile]?.model;
  
  return modelId || envModel || profileModel || "unknown";
}

// Load model specs (cached locally, ~500 bytes)
async function loadModelSpecs(modelId) {
  const specs = await dc.read_file(".planning/model-specs.json");
  const modelSpec = specs[modelId] || specs["default"];
  
  // Check if model changed from last session
  const lastModel = await dc.read_file(".planning/.last-model");
  if (lastModel !== modelId) {
    console.log(`Model changed: ${lastModel} → ${modelId}`);
    await dc.write_file(".planning/.last-model", modelId);
  }
  
  return modelSpec;
}
```

### Layer 2: Integrated Cognitive Flow

```javascript
async function complexityAssessment(plan, modelSpec) {
  // Phase 1: Structure (Tractatus + CI)
  const structure = await tractatus_thinking({
    operation: "start", 
    concept: "Analyze plan structure for complexity"
  });
  
  const fileFacts = await ci.get_file_summary(plan.files);
  await tractatus_thinking({
    operation: "add", 
    content: `Files detected: ${fileFacts.length}`
  });
  
  const structuralAnalysis = await tractatus_thinking({
    operation: "export"
  });

  // Phase 2: Process (Sequential + CG)
  const dependencies = await cg.find_path(plan.affectedFiles);
  
  const process = await sequential_thinking({
    thought: `Dependencies found: ${dependencies.length}`,
    thoughtNumber: 1,
    totalThoughts: 4,
    nextThoughtNeeded: true
  });
  
  const score = await sequential_thinking({
    thought: `Calculate score using model thresholds: ${modelSpec.safe_threshold}`,
    thoughtNumber: 4,
    totalThoughts: 4,
    nextThoughtNeeded: false
  });

  // Phase 3: Learning (Debug + DC)
  const pastPatterns = await debug_thinking({
    action: "query",
    queryType: "similar-problems",
    parameters: {pattern: "complexity", limit: 5}
  });
  
  await debug_thinking({
    action: "create",
    nodeType: "observation",
    content: `Complexity score: ${score}`
  });

  return {
    score, 
    model: modelSpec,
    action: decideAction(score, modelSpec)
  };
}
```

### Layer 3: Auto-Split Decision

```javascript
function decideAction(score, modelSpec) {
  if (score > modelSpec.split_threshold) {
    return {
      action: "auto-split",
      reason: `Score ${score} exceeds ${modelSpec.split_threshold} threshold`,
      subPhaseCount: Math.ceil(score / modelSpec.split_threshold)
    };
  } else if (score > modelSpec.warn_threshold) {
    return {
      action: "warn",
      reason: `Score ${score} in warning range (${modelSpec.warn_threshold}-${modelSpec.split_threshold})`,
      options: ["proceed", "split", "manual"]
    };
  } else {
    return {
      action: "execute",
      reason: `Score ${score} below warning threshold`
    };
  }
}
```

### Multi-Layer Integration Points

- **PreToolUse Hook**: Triggers all 3 layers before agent spawn
- **plan-phase Workflow**: Layer 1 + 2 integrated into planning
- **execute-phase Workflow**: Layer 2 + 3 for mid-flight adjustment
- **Manual Command**: `/GSI:check-complexity` for verification

</specifics>

<deferred>
## Deferred Ideas

- Cloud-based pattern database - Privacy concerns, hosting costs
- Real-time model switching based on complexity - Requires API changes
- Parallel thinking flows - Sequential dependency confirmed
- Generic "all tools available" fallback - Intelligent selection preferred
- Internet-based model spec lookup - Local cache sufficient

</deferred>

---

*Phase: 17-complexity-prediction*
*Context gathered: 2026-02-15*
*Enhanced: Three-Layer Intelligence + Model Awareness architecture*
