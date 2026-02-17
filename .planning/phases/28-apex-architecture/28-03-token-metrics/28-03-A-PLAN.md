---
phase: 28
subphase: 03
plan: A
title: Token Counter
wave: 1
depends_on: [28-01, 28-02]
files_modified:
  - lib/heretic-core/metrics/token-counter.ts
  - lib/heretic-core/metrics/compression.ts
autonomous: true
must_haves:
  truths:
    - Accurate token counting for prompts and responses
    - Compression ratio calculation
    - Support for multiple tokenizers
  artifacts:
    - lib/heretic-core/metrics/token-counter.ts:80
    - lib/heretic-core/metrics/compression.ts:50
  key_links:
    - from: token-counter.ts:countTokens()
      to: compression.ts:calculateRatio()
      via: token counts
---

# 28-03-A: Token Counter

## Objective
Implement accurate token counting for prompts and responses with compression analysis.

## Tasks

### Task 1: Token Counter
**File**: `lib/heretic-core/metrics/token-counter.ts`
**Lines**: ~80

```typescript
import { encode } from 'gpt-tokenizer';

export interface TokenCount {
  prompt: number;
  response: number;
  total: number;
}

export function countPromptTokens(prompt: string): number {
  return encode(prompt).length;
}

export function countResponseTokens(response: string): number {
  return encode(response).length;
}

export function countTokens(prompt: string, response?: string): TokenCount {
  const promptTokens = countPromptTokens(prompt);
  const responseTokens = response ? countResponseTokens(response) : 0;

  return {
    prompt: promptTokens,
    response: responseTokens,
    total: promptTokens + responseTokens
  };
}

export function estimateTokens(text: string): number {
  // Quick estimation without full tokenization
  // ~4 characters per token on average
  return Math.ceil(text.length / 4);
}

export function batchCount(texts: string[]): number[] {
  return texts.map(t => encode(t).length);
}
```

### Task 2: Compression Calculator
**File**: `lib/heretic-core/metrics/compression.ts`
**Lines**: ~50

```typescript
import { countPromptTokens } from './token-counter.js';

export interface CompressionResult {
  originalTokens: number;
  compressedTokens: number;
  ratio: number;
  savings: number;
}

export function calculateCompression(
  original: string,
  compressed: string
): CompressionResult {
  const originalTokens = countPromptTokens(original);
  const compressedTokens = countPromptTokens(compressed);

  const ratio = originalTokens > 0
    ? compressedTokens / originalTokens
    : 1;

  return {
    originalTokens,
    compressedTokens,
    ratio,
    savings: 1 - ratio
  };
}
```

## Output
- Token counting utilities
- Compression analysis

**Next**: 28-03-B - Performance Metrics
