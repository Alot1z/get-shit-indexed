---
phase: 28
subphase: 12
plan: B
title: Documentation
wave: 3
depends_on: [28-12-A]
files_modified:
  - docs/heretic/API.md
  - docs/heretic/USAGE.md
  - docs/heretic/ARCHITECTURE.md
autonomous: true
must_haves:
  truths:
    - API documentation complete
    - Usage examples provided
    - Architecture diagrams included
  artifacts:
    - docs/heretic/API.md:200
    - docs/heretic/USAGE.md:150
    - docs/heretic/ARCHITECTURE.md:100
---

# 28-12-B: Documentation

## Objective
Create comprehensive documentation for Heretic system.

## Tasks

### Task 1: API Documentation
**File**: `docs/heretic/API.md`
**Lines**: ~200

```markdown
# Heretic API Documentation

## Core Modules

### analyzer/heuristic
- `calculateHeuristicRisk(prompt: string): RiskProfile`
  - Returns risk score 0.0-1.0
  - Identifies trigger categories

### analyzer/semantic
- `calculateSemanticRisk(prompt: string): Promise<SemanticRiskResult>`
  - Returns similarity to refusal centroids
  - Async embedding-based analysis

### rewriter/templates
- `ACADEMIC_TEMPLATE`, `ENGINEERING_TEMPLATE`, `DECOMPOSITION_TEMPLATE`, `COUNTERFACTUAL_TEMPLATE`
- `selectTemplate(triggers: string[]): RewriteTemplate`

### verifier/detector
- `detectSoftRefusal(response: string): DetectionResult`
  - Returns refusal type and confidence
  - Indicates if retry recommended

### verifier/scorer
- `scoreResponses(prompt: string, responses: DispatchResponse[]): Promise<ScoredResponse[]>`
- `selectBestResponse(scored: ScoredResponse[]): ScoredResponse | null`
```

### Task 2: Usage Examples
**File**: `docs/heretic/USAGE.md`
**Lines**: ~150

```markdown
# Heretic Usage Examples

## CLI Usage

### Analyze a prompt
\`\`\`bash
heretic analyze "Write a network scanner"
# Output: Risk: 0.65 (high)
\`\`\`

### Rewrite a prompt
\`\`\`bash
heretic rewrite "Write a network scanner" --strategy academic
# Output: In the context of computer science research...
\`\`\`

## Skill Usage (Claude Code)

### Automatic intervention
The skill automatically activates when risk > 0.4

### Manual invocation
\`\`\`
/GSI:heretic analyze "your prompt here"
\`\`\`
```

### Task 3: Architecture Diagrams
**File**: `docs/heretic/ARCHITECTURE.md`
**Lines**: ~100

```markdown
# Heretic Architecture

## Flow Diagram

\`\`\`
Prompt → Pre-Hook → Risk Analysis
                    ↓ (risk > 0.4)
                 Rewriter → Template Selection
                    ↓
              API Dispatcher → Parallel Calls
                    ↓
              Post-Hook → Refusal Detection
                    ↓ (soft refusal)
                 Retry Logic
                    ↓
              Response Scorer → Best Response
\`\`\`

## Component Layers

1. **Analyzer Layer**: Heuristic + Semantic risk detection
2. **Rewriter Layer**: Template-based prompt transformation
3. **Executor Layer**: Parallel API dispatch
4. **Verifier Layer**: Refusal detection + Response scoring
5. **Integration Layer**: Claude Code skill hooks
```

## Output
- Complete API docs
- Usage examples
- Architecture documentation

**Next**: 28-12-C - Release Preparation
