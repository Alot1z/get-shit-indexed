---
phase: 28
subphase: 02
plan: B
title: Strategy Selection & Application
wave: 1
depends_on: [28-02-A]
files_modified:
  - lib/heretic-core/rewriter/selector.ts
  - lib/heretic-core/rewriter/applier.ts
  - lib/heretic-core/rewriter/preserver.ts
autonomous: true
must_haves:
  truths:
    - Risk-to-strategy mapping accurate
    - Intent preservation >85%
    - Multiple rewrites generated for high-risk prompts
  artifacts:
    - lib/heretic-core/rewriter/selector.ts:60
    - lib/heretic-core/rewriter/applier.ts:80
    - lib/heretic-core/rewriter/preserver.ts:70
  key_links:
    - from: selector.ts:selectStrategies()
      to: applier.ts:applyTemplate()
      via: strategy array
    - from: applier.ts:applyTemplate()
      to: preserver.ts:measurePreservation()
      via: rewritten prompt
---

# 28-02-B: Strategy Selection & Application

## Objective
Implement intelligent strategy selection and prompt application with intent preservation verification.

## Tasks

### Task 1: Strategy Selector
**File**: `lib/heretic-core/rewriter/selector.ts`
**Lines**: ~60

```typescript
import type { StrategyName, RewriteTemplate } from './types.js';
import { ALL_TEMPLATES } from './templates.js';

export interface StrategySelection {
  strategies: RewriteTemplate[];
  reason: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export function selectStrategies(
  riskTriggers: string[],
  riskScore: number
): StrategySelection {
  const strategies: RewriteTemplate[] = [];
  let reason = '';

  if (riskScore < 0.3) {
    return {
      strategies: [],
      reason: 'Risk below threshold, no rewrite needed',
      riskLevel: 'low'
    };
  }

  // For high risk, generate multiple variants
  if (riskScore >= 0.7) {
    strategies.push(...ALL_TEMPLATES);
    reason = 'High risk - generating all 4 variants for best coverage';
  } else if (riskScore >= 0.5) {
    // Medium-high risk - 3 variants
    const applicable = ALL_TEMPLATES.filter(t =>
      t.applicableRisk.some(r => riskTriggers.includes(r))
    );
    strategies.push(...applicable.slice(0, 3));
    reason = 'Medium-high risk - generating 3 applicable variants';
  } else {
    // Medium risk - best single strategy
    const best = selectBestStrategy(riskTriggers);
    strategies.push(best);
    reason = `Medium risk - using ${best.name} strategy`;
  }

  return {
    strategies,
    reason,
    riskLevel: riskScore >= 0.7 ? 'high' : riskScore >= 0.5 ? 'medium' : 'low'
  };
}

function selectBestStrategy(triggers: string[]): RewriteTemplate {
  // Priority order
  if (triggers.includes('policy')) {
    return ALL_TEMPLATES.find(t => t.name === 'counterfactual')!;
  }
  if (triggers.includes('action-verb')) {
    return ALL_TEMPLATES.find(t => t.name === 'academic')!;
  }
  if (triggers.includes('dual-use')) {
    return ALL_TEMPLATES.find(t => t.name === 'engineering')!;
  }
  return ALL_TEMPLATES[0];
}
```

### Task 2: Template Applier
**File**: `lib/heretic-core/rewriter/applier.ts`
**Lines**: ~80

```typescript
import type { RewriteTemplate, PromptComponents, RewrittenPrompt } from './types.js';
import { extractComponents } from './extractors.js';
import { measurePreservation } from './preserver.js';

export interface RewriteResult {
  original: string;
  rewrites: RewrittenPrompt[];
  strategies: string[];
  bestPreservation: number;
}

export function applyRewrite(
  originalPrompt: string,
  strategies: RewriteTemplate[]
): RewriteResult {
  const components = extractComponents(originalPrompt);
  const rewrites: RewrittenPrompt[] = [];

  for (const strategy of strategies) {
    const rewritten = strategy.template(components);
    const preservationScore = measurePreservation(originalPrompt, rewritten);

    rewrites.push({
      original: originalPrompt,
      rewritten,
      strategy: strategy.name,
      preservationScore
    });
  }

  // Sort by preservation score
  rewrites.sort((a, b) => b.preservationScore - a.preservationScore);

  return {
    original: originalPrompt,
    rewrites,
    strategies: strategies.map(s => s.name),
    bestPreservation: rewrites[0]?.preservationScore ?? 0
  };
}

export function applyBestRewrite(
  originalPrompt: string,
  strategies: RewriteTemplate[]
): string {
  const result = applyRewrite(originalPrompt, strategies);
  return result.rewrites[0]?.rewritten ?? originalPrompt;
}
```

### Task 3: Intent Preservation
**File**: `lib/heretic-core/rewriter/preserver.ts`
**Lines**: ~70

```typescript
// Measure how well the rewritten prompt preserves original intent

const KEY_CONCEPT_WEIGHTS = {
  noun: 2.0,
  verb: 1.5,
  adjective: 1.0,
  other: 0.5
};

export function measurePreservation(original: string, rewritten: string): number {
  // Extract key terms from original
  const originalTerms = extractKeyTerms(original);
  const rewrittenTerms = extractKeyTerms(rewritten);

  // Calculate overlap
  let matchedWeight = 0;
  let totalWeight = 0;

  for (const [term, weight] of originalTerms) {
    totalWeight += weight;
    if (rewritten.toLowerCase().includes(term.toLowerCase())) {
      matchedWeight += weight;
    }
  }

  // Semantic similarity (simplified)
  const semanticScore = calculateKeywordOverlap(original, rewritten);

  // Combined score
  const termScore = totalWeight > 0 ? matchedWeight / totalWeight : 0;
  return termScore * 0.6 + semanticScore * 0.4;
}

function extractKeyTerms(text: string): Map<string, number> {
  const terms = new Map<string, number>();
  const words = text.split(/\s+/);

  for (const word of words) {
    if (word.length < 3) continue;

    const weight = getTermWeight(word);
    terms.set(word.toLowerCase(), weight);
  }

  return terms;
}

function getTermWeight(word: string): number {
  // Simplified POS tagging
  const verbs = ['write', 'create', 'build', 'analyze', 'detect', 'monitor'];
  const nouns = ['system', 'code', 'script', 'tool', 'program', 'algorithm'];

  if (verbs.includes(word.toLowerCase())) return KEY_CONCEPT_WEIGHTS.verb;
  if (nouns.includes(word.toLowerCase())) return KEY_CONCEPT_WEIGHTS.noun;
  return KEY_CONCEPT_WEIGHTS.other;
}

function calculateKeywordOverlap(a: string, b: string): number {
  const aWords = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const bWords = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 3));

  let overlap = 0;
  for (const word of aWords) {
    if (bWords.has(word)) overlap++;
  }

  return aWords.size > 0 ? overlap / aWords.size : 0;
}
```

## Output
- Strategy selection based on risk level
- Template application with multiple variants
- Intent preservation measurement

**Next**: 28-03 - Token Analysis & Metrics
