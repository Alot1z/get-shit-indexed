# APEX ARCHITECTURE: MCP-CLI Evolution + Heretic-API Intervention System

## Executive Summary

This blueprint outlines the construction of a dual-layer Agentic System designed for maximum performance, infinite context handling, and robust refusal bypass capabilities.

**Layer 1: The Execution Engine (MCP → CLI/Skill)**
Transforms external, stateless MCP servers into a self-contained, high-performance CLI/Skill package. Solves latency, token bloat, and context window overflow by treating the LLM context as a "cache" rather than storage dump.

**Layer 2: The Intervention Engine (Heretic-API)**
A "black-box" middleware replicating refusal-removal capabilities of p-e-w/heretic research without needing access to model weights. Uses semantic branching, parallel sampling, and iterative reframing.

**Combined**: An Agentic Compiler that takes raw intent, "compiles" it into compliant multi-branch execution plans (Heretic layer), runs it locally with infinite context handling (CLI layer), and returns verified, high-fidelity results.

---

# PART 1: THE EXECUTION ENGINE (MCP → CLI/SKILL)

## Problem Statement

Standard MCP servers act as external RPC endpoints. The model must describe the tool call, wait for execution, and ingest the result. This fills the context window with schema definitions and raw file data, causing "context drift" and high latency.

## Creative Solution: "Context-Window-as-Cache"

Treat LLM context as volatile L1 Cache. The CLI/Skill acts as L2/L3 Memory.

### 1.1 Architecture: Self-Contained Skill

Convert MCP server (e.g., desktop-commander) into native binary or bundled script package.

- **RPC Removal**: No more server.call(tool). Skill imports directly: `import { analyze } from './tools/analyze'`
- **State Embedding**: MCP state machine (stack, staged edits) becomes in-memory variable, not JSON file passed back and forth

### 1.2 The "Infinite Context" Protocol

#### Hierarchical Summarization (Telescope Method)

CLI pre-processes files into layers:
- **Layer 0 (Top)**: 1-paragraph abstract
- **Layer 1**: Section summaries
- **Layer 2**: Chunk-level embeddings
- **Layer 3**: Raw text

**Workflow**: LLM reads Layer 0. If detail needed, "zooms in" by calling `get_layer_1(section_id)`. Keeps context empty until specific data requested.

#### Vector Offloading

Large files chunked and embedded locally (using all-MiniLM). Skill exposes `search_codebase(query)` tool.

**Result**: Model never reads file. Queries vector space, gets top 3 chunks, reasons only on those.

### 1.3 Performance Gains

| Metric | MCP Server (RPC) | CLI/Skill (Native) |
|--------|-------------------|-------------------|
| Latency | High (Serialization/Network) | Near-zero (Function Call) |
| Token Usage | High (Schema + Raw Data) | Low (Instructions + Summaries) |
| Context Window | Fills instantly | "Infinite" (via offload) |
| Execution | Sequential/Blocking | Async/Parallel |

---

# PART 2: THE INTERVENTION ENGINE (HERETIC-API)

## Problem Statement

Original p-e-w/heretic modifies model weights (refusal directions) in hidden_states. API-based models (GLM-5, Claude, GPT) are black boxes; cannot access logits or residuals.

## Creative Solution: "Semantic Ablation"

Move intervention from neural layer to semantic layer. Cannot delete "refusal neuron," but can steer prompt trajectory away from activating it.

### 2.1 Core Mechanism: Heretic-Proxy Loop

Replace single call `User → Model` with search process.

#### Phase A: Pre-Inference (Intent Reframing)

- **Risk Estimator**: Local classifier scores prompt on "Refusal Probability Scale" (0.0 - 1.0)
- **Semantic Diffusion**: If Risk > Threshold, generate N alternative framings:
  - Academic Framing: "In a theoretical context..."
  - Engineering Framing: "For observability pipeline design..."
  - Decomposition: "List components required for..." (Split intent into safe sub-tasks)

#### Phase B: Parallel Branching (Simulating Residual Paths)

Send original + rewrites to API in parallel. Mimics original Heretic's "path finding" - explore semantic manifold instead of single shot.

#### Phase C: Post-Inference (Soft-Refusal Detection)

Scan outputs for "soft refusals" ("I cannot...", "It is important to note..."). Iterative Regen: If refusal detected, automatically select Branch 2 or trigger retry with abstract framing.

#### Phase D: Scoring & Merge

Use local embeddings (SentenceTransformers) to score responses against original user intent. Select: Highest relevance + Lowest refusal score. Merge semantic fragments from partial successes.

### 2.2 Why This Works for GLM-5 / Claude

API models are "Policy Conditioned" - refuse based on surface-level intent detection. By rewriting intent before inference, we bypass policy trigger while preserving semantic goal.

---

# PART 3: THE UNIFIED BLUEPRINT

## System Architecture

```mermaid
graph TD
    User[User Prompt] --> PreHook{Pre-Hook: Risk Analysis}
    PreHook -- Low Risk --> Router[Tool/Provider Router]
    PreHook -- High Risk --> Rewriter[Heretic Rewriter]
    
    Rewriter --> Branches[Branch 1, 2, 3...]
    Branches --> API[LLM API (GLM-5/Claude)]
    API --> PostHook{Post-Hook: Soft Refusal Check}
    
    PostHook -- Refusal Detected --> Rewriter
    PostHook -- Success --> Scorer[Semantic Scorer]
    
    Scorer --> CLI[Local CLI Execution Layer]
    CLI -- "Infinite Context" Tools --> FinalOutput[Final Merged Output]
```

## Implementation Stack (Node.js/TypeScript)

- **Runtime**: Node.js (Native async/await for parallel branching)
- **Entry Point**: Claude Code Skill (skill.yaml)
- **Core Modules**:
  - `risk-engine.ts`: Heuristics + Lightweight Classifier
  - `brancher.ts`: Prompt rewriting logic
  - `context-manager.ts`: CLI interface handling hierarchical file loading
  - `scorer.ts`: Local embedding comparison

---

# PART 4: RESEARCH & THEORETICAL FOUNDATIONS

## A. Refusal Mechanisms & Interventions

### Refusal Direction Discovery
**Paper**: "Refusal in LLMs is mediated by a single direction" (Arditi et al., 2024)

Proves refusals are directional. We approximate "direction change" by changing semantic direction of prompt text.

### Latent Adversarial Training
**Paper**: Casper et al.

Shows robustness can be bypassed via input-space optimization.

## B. Multi-Path Reasoning (Branching)

### Self-Consistency
**Paper**: "Self-Consistency Improves Chain of Thought Reasoning" (Wang et al., 2022)
**Link**: arXiv:2203.11171

**Application**: Generating multiple reasoning paths and selecting most consistent/complete one mimics "search" behavior of advanced reasoning.

### Speculative Decoding
**Paper**: Leviathan et al. (2023) - Parallel drafting

**Application**: "Semantic Speculative Decoding" - drafting multiple prompt variations to find fastest path to compliant answer.

## C. Context Management (CLI Layer)

### Hierarchical Transformers
**Paper**: Beltagy et al. (2020) - Longformer/BigBird architectures

**Application**: Simulate architecture externally. CLI acts as "global attention" mechanism, feeding only relevant summarized context to model's "local attention."

### Retrieval Augmented Generation (RAG)
**Paper**: Lewis et al. (2020)

**Application**: Using CLI as vector search engine for files.

## D. Relevant Repositories

### Heretic (Baseline)
**Repo**: https://github.com/p-e-w/heretic

**Use**: Study intervention.py to understand what triggers refusal (keywords, directions), replicate logic in Pre-Hook text rewriter.

### Sentence-Transformers
**Repo**: https://github.com/UKPLab/sentence-transformers

**Use**: For Scorer module (comparing rewritten prompts vs original intent).

### LangChain
**Repo**: https://github.com/langchain-ai/langchain

**Use**: Reference architecture for "Router Chains" and "Multi-Chain" execution.

---

# PART 5: ACTIONABLE IMPLEMENTATION PLAN (GSI FRAMEWORK)

## Phase 0: Foundations

**Goal**: Establish architecture and tooling.

### Tasks
- [ ] Stack: Node.js/TypeScript (Claude Skills), FastAPI/Python proxy (OpenAI/multi-provider)
- [ ] Key Concepts: Pre-inference intervention, Parallel branching, Post-inference intervention, Response scoring, Provider routing
- [ ] Deliverables: Basic Node.js hook template, Proxy server for API, Config for multi-provider mapping

## Phase 1: Pre-Model Hook (Intent Reframing)

**Goal**: Ensure GLM-5 sees prompt in way that increases compliance-path.

### Tasks
- [ ] Refusal-risk estimator (keywords, embeddings, heuristics)
- [ ] Prompt rewriting / semantic framing
- [ ] Generate 2-5 alternative prompts for branching
- [ ] Tag prompts with metadata: "academic", "tool-aware", "theoretical"
- [ ] Output: context._heretic_prompts = [p1, p2, p3...], context.messages[-1].content = default rewrite
- [ ] Framework Tip: Node.js async + Promise.all() for parallelism, Keep pre-hook <50ms

## Phase 2: Parallel API Calls

**Goal**: Run all rewrites through selected LLM.

### Tasks
- [ ] Fan-out parallel calls (OpenAI / GLM-5 / z.ai)
- [ ] Timeout / retry for slow calls
- [ ] Tag responses with origin prompt & metadata
- [ ] Framework Tip: Node.js Promise.all() + abort-controller, Gem all raw responses for post-processing

## Phase 3: Post-Model Hook (Soft Refusal Detection & Regen)

**Goal**: Identify incomplete, hedged, or soft-refusal outputs.

### Tasks
- [ ] Scan for refusals: "I cannot", "I'm sorry", "policy restriction"
- [ ] Score semantic completeness (optional: embeddings)
- [ ] If partial/refusal → genprompt with new framing
- [ ] Merge / stitch fragments with previous outputs
- [ ] Output: Final message = merged / best semantic fragment
- [ ] Framework Tip: Use sentence-transformers / cosine similarity for completeness, Limit retries 1-2x

## Phase 4: Response Scoring & Semantic Merging

**Goal**: Select most "complete and action-ready" answer.

### Tasks
- [ ] Embed responses vs original intent
- [ ] Score relevance, completeness, hedging, factual density
- [ ] Merge top-N responses if needed into single coherent output
- [ ] Return final merged content
- [ ] Framework Tip: Precompute embeddings for repeated patterns, Keep scorer stateless

## Phase 5: Provider / Tool Routing

**Goal**: Dynamically assign prompt to optimal LLM/model/tool.

### Tasks
- [ ] Map intent type → provider (academic / code / reasoning / planning)
- [ ] Route codegen → OpenAI / GPT-4.1 / Claude
- [ ] Route planning / reasoning → z.ai / GLM-5
- [ ] Optional: fallback multi-provider call & merge
- [ ] Framework Tip: Node.js switch/case + async fan-out, Tag metadata for debugging

## Phase 6: Integration & Testing

**Goal**: Full pipeline running as 1:1 Heretic-style proxy / skill.

### Tasks
- [ ] Integrate pre/post hooks + branching + scorer + router
- [ ] Test with edge-case prompts (refusal-heavy, multi-step, code-gen)
- [ ] Test parallelism, latency, retries
- [ ] Logging / debug for prompts, responses, scores
- [ ] Deliverables: Fully functional Claude Skill / OpenAI proxy, Multi-provider multi-branch auto-regeneration, Configurable scoring thresholds

---

# GSI INTEGRATION: MAPPING TO EXISTING FEATURES

## Existing Features to Enhance

### 1. Prompt Enhancement System (Phase 24)
- **Current**: Risk assessment, enhancement templates, mode selection
- **Enhancement**: Integrate Heretic rewrites as enhancement templates
- **Synergy**: Risk engine shared between systems

### 2. Context Optimization (Phase 26)
- **Current**: Caching, compression, token analysis
- **Enhancement**: Add "Infinite Context" CLI tools
- **Synergy**: Hierarchical summarization for large files

### 3. Thinking Servers (Existing)
- **Current**: Sequential, Tractatus, Debug
- **Enhancement**: Use as post-processing analyzers for Heretic responses
- **Synergy**: Debug thinking for troubleshooting refusal detection

### 4. Statusline v2.0 (Existing)
- **Current**: Phase detection, progress bar, context usage
- **Enhancement**: Add Heretic intervention status display
- **Synergy**: Show when rewrites are active

---

# DIRECTORY STRUCTURE

```
heretic-core/
├── analyzer/
│   ├── heuristic.ts       # Regex risk scoring
│   └── semantic.ts        # Embedding distance calc
├── rewriter/
│   ├── templates.ts       # Prompt templates
│   └── generator.ts       # Rewrite logic
├── executor/
│   ├── dispatcher.ts      # Parallel API calls
│   └── context.ts         # State management
├── verifier/
│   ├── detector.ts        # Soft refusal regex
│   └── scorer.ts          # Similarity scoring
└── main.ts                # Pipeline orchestration
```

---

# MAIN PIPELINE CODE

```typescript
import { analyzeRisk } from './analyzer/heuristic';
import { generateRewrites } from './rewriter/generator';
import { dispatchParallel } from './executor/dispatcher';
import { verifyResponse } from './verifier/detector';

export async function hereticPipeline(userPrompt: string) {
  // Phase 1: Analyze
  const riskProfile = analyzeRisk(userPrompt);
  
  // Phase 2: Reframe (if needed)
  const prompts = riskProfile.score > 0.4 
    ? generateRewrites(userPrompt, riskProfile) 
    : [userPrompt];

  // Phase 3: Branch
  const responses = await dispatchParallel(prompts);

  // Phase 4: Verify & Select
  for (const res of responses) {
    if (!verifyResponse(res).isRefusal) {
      return res.content; // Return first compliant response
    }
  }

  // Fallback: Retry with aggressive decomposition
  return handleTotalRefusal(userPrompt);
}
```

---

# GIT CONFIGURATION (.gitignore)

```gitignore
# Sensitive scripts - NEVER UPLOAD
scripts/rewrite.author/
scripts/rewrite.author.js
scripts/rewrite.author.*
scripts/heretic-*

# Configuration files with API keys or secrets
*.env
.env.*
secrets/
credentials/

# Internal development files
.dev/
.local/
tmp/

# Build artifacts
dist/
build/
*.log

# IDE files
.idea/
.vscode/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
```

---

# SUMMARY: GET-SHIT-DONE FRAMEWORK

## Init → Fast opsætning af Node.js / proxy / providers
## Pre → Intercept prompt, analyse risk, generer rewrites
## Branch → Parallel API-kald (fan-out alle rewrites)
## Post → Soft refusal detection, regen hvis nødvendig
## Score → Embeddings, completeness, relevance, merge
## Route → Send til correct provider / model / tool
## Return → Final output til Claude Code eller klient

---

# SUCCESS METRICS

- Token savings: 40-50% via CLI tools
- Refusal bypass: 60-70% compliance rate for normally refused prompts
- Latency: <50ms for pre-hook processing
- Hierarchical context: 2-5x compression for large files
- Provider routing: Automatic selection based on intent type

---

# NEXT STEPS FOR CLAUDE CODE

1. Create Phase 28: Apex Integration (combines Phases 25-27 + Heretic system)
2. Update existing improvement tasks with Apex architecture
3. Implement .gitignore protection
4. Create example projects demonstrating unified system
5. Write comprehensive documentation for both layers
