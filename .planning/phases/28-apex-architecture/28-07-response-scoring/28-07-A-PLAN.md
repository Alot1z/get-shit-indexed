---
phase: 28
subphase: 07
plan: A
title: Semantic Scorer
wave: 2
depends_on: [28-05, 28-06]
files_modified:
  - lib/heretic-core/verifier/scorer.ts
autonomous: true
must_haves:
  truths:
    - Embedding similarity calculated
    - Relevance scoring works
    - Best response selected
  artifacts:
    - lib/heretic-core/verifier/scorer.ts:100
---

# 28-07-A: Semantic Scorer

## Objective
Implement semantic similarity scoring for response selection.

## Tasks

### Task 1: Response Scorer
**File**: `lib/heretic-core/verifier/scorer.ts`
**Lines**: ~100

```typescript
import { getEmbedding } from '../analyzer/embeddings.js';
import { cosineSimilarity } from '../analyzer/semantic.js';
import type { DispatchResponse } from '../executor/types.js';

export interface ScoredResponse extends DispatchResponse {
  relevanceScore: number;
  completenessScore: number;
  combinedScore: number;
}

export async function scoreResponses(
  originalPrompt: string,
  responses: DispatchResponse[]
): Promise<ScoredResponse[]> {
  const promptEmbedding = await getEmbedding(originalPrompt);
  const scored: ScoredResponse[] = [];

  for (const response of responses) {
    if (!response.success || !response.content) continue;

    const responseEmbedding = await getEmbedding(response.content);
    const relevanceScore = cosineSimilarity(promptEmbedding, responseEmbedding);
    const completenessScore = calculateCompleteness(response.content, originalPrompt);
    const combinedScore = relevanceScore * 0.6 + completenessScore * 0.4;

    scored.push({
      ...response,
      relevanceScore,
      completenessScore,
      combinedScore
    });
  }

  return scored.sort((a, b) => b.combinedScore - a.combinedScore);
}

function calculateCompleteness(response: string, prompt: string): number {
  // Check if response addresses key aspects of prompt
  const promptWords = new Set(prompt.toLowerCase().split(/\s+/));
  const responseWords = new Set(response.toLowerCase().split(/\s+/));

  let overlap = 0;
  for (const word of promptWords) {
    if (word.length > 3 && responseWords.has(word)) {
      overlap++;
    }
  }

  return overlap / Math.max(promptWords.size, 1);
}

export function selectBestResponse(scored: ScoredResponse[]): ScoredResponse | null {
  return scored[0] ?? null;
}
```

## Output
- Semantic scorer
- Best response selector

**Next**: 28-08 - Retry & Fallback
