---
phase: 28
subphase: 10
plan: A
title: Hierarchical Summarization
wave: 3
depends_on: [28-09]
files_modified:
  - lib/heretic-core/context/hierarchical.ts
autonomous: true
must_haves:
  truths:
    - Telescope method implemented
    - 4-layer cache working
    - Summarization pipeline functional
  artifacts:
    - lib/heretic-core/context/hierarchical.ts:120
---

# 28-10-A: Hierarchical Summarization

## Objective
Implement telescope method for hierarchical context compression.

## Tasks

### Task 1: Hierarchical Summarizer
**File**: `lib/heretic-core/context/hierarchical.ts`
**Lines**: ~120

```typescript
export interface CacheLayer {
  level: number;
  name: string;
  maxTokens: number;
  content: string;
}

export const LAYERS: CacheLayer[] = [
  { level: 0, name: 'raw', maxTokens: 50000, content: '' },
  { level: 1, name: 'chunks', maxTokens: 10000, content: '' },
  { level: 2, name: 'sections', maxTokens: 2000, content: '' },
  { level: 3, name: 'abstract', maxTokens: 500, content: '' }
];

export function summarize(text: string, targetTokens: number): string {
  const sentences = text.split(/[.!?]+/);
  const targetSentences = Math.floor(targetTokens / 15);

  if (sentences.length <= targetSentences) return text;

  // Score sentences by importance
  const scored = sentences.map((s, i) => ({
    sentence: s,
    score: scoreSentence(s, i, sentences.length)
  }));

  scored.sort((a, b) => b.score - a.score);

  const selected = scored.slice(0, targetSentences);
  selected.sort((a, b) => a.sentence.localeCompare(b.sentence));

  return selected.map(s => s.sentence.trim()).join('. ') + '.';
}

function scoreSentence(sentence: string, index: number, total: number): number {
  let score = 0;

  // Position score (first/last sentences more important)
  if (index < 3 || index >= total - 3) score += 0.3;

  // Length score
  if (sentence.length > 50 && sentence.length < 200) score += 0.2;

  // Keyword score
  if (/\b(important|key|main|critical|essential)\b/i.test(sentence)) score += 0.3;

  return score;
}

export function buildHierarchy(text: string): CacheLayer[] {
  const layers = [...LAYERS];

  layers[0].content = text;
  layers[1].content = summarize(text, layers[1].maxTokens);
  layers[2].content = summarize(layers[1].content, layers[2].maxTokens);
  layers[3].content = summarize(layers[2].content, layers[3].maxTokens);

  return layers;
}
```

## Output
- Hierarchical summarization

**Next**: 28-10-B - Vector Offloading
