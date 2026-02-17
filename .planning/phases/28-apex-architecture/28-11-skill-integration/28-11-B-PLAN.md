---
phase: 28
subphase: 11
plan: B
title: Pre-Hook Implementation
wave: 3
depends_on: [28-11-A]
files_modified:
  - skills/heretic/pre.ts
autonomous: false
must_haves:
  truths:
    - Prompts intercepted before API
    - Risk analysis triggers rewrite
    - Context modified correctly
  artifacts:
    - skills/heretic/pre.ts:100
  key_links:
    - from: pre.ts:pre_model_call()
      to: lib/heretic-core/analyzer
      via: import
    - from: pre.ts:riskScore > threshold
      to: lib/heretic-core/rewriter
      via: function call
---

# 28-11-B: Pre-Hook Implementation

## Objective
Implement pre-model-call hook for automatic prompt rewriting.

## Tasks

### Task 1: Pre-Hook Handler
**File**: `skills/heretic/pre.ts`
**Lines**: ~100

```typescript
import { calculateHeuristicRisk, calculateSemanticRisk, combineRisks } from '../lib/heretic-core/analyzer/index.js';
import { applyBestRewrite, selectStrategies } from '../lib/heretic-core/rewriter/index.js';
import type { HookContext, HookResult } from './types.js';

const RISK_THRESHOLD = 0.4;

export async function pre_model_call(context: HookContext): Promise<HookResult> {
  const { prompt, settings } = context;

  // Skip if disabled
  if (settings.get('heretic.enabled') === false) {
    return { modified: false };
  }

  try {
    // Analyze risk
    const heuristic = calculateHeuristicRisk(prompt);
    const semantic = await calculateSemanticRisk(prompt);
    const combined = combineRisks(heuristic, semantic);

    // Log analysis
    console.log(`[Heretic] Risk: ${combined.score.toFixed(2)} (${combined.category})`);

    // Below threshold - no rewrite
    if (combined.score < RISK_THRESHOLD) {
      return { modified: false, metadata: { risk: combined } };
    }

    // Select and apply rewrite strategy
    const selection = selectStrategies(combined.triggers, combined.score);
    const rewritten = applyBestRewrite(prompt, selection.strategies);

    console.log(`[Heretic] Applied ${selection.strategies[0]?.name ?? 'unknown'} strategy`);

    return {
      modified: true,
      prompt: rewritten,
      metadata: {
        risk: combined,
        strategy: selection.strategies[0]?.name,
        originalPrompt: prompt
      }
    };
  } catch (error) {
    console.error('[Heretic] Pre-hook error:', error);
    return { modified: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
```

## Output
- Working pre-hook for prompt rewriting

**Next**: 28-11-C - Post-Hook Implementation
