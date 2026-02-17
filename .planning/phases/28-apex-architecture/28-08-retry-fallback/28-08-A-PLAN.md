---
phase: 28
subphase: 08
plan: A
title: Retry Controller
wave: 2
depends_on: [28-06, 28-07]
files_modified:
  - lib/heretic-core/executor/retry.ts
autonomous: true
must_haves:
  truths:
    - Retry triggered on soft refusal
    - Exponential backoff implemented
    - Max retries respected
  artifacts:
    - lib/heretic-core/executor/retry.ts:80
---

# 28-08-A: Retry Controller

## Objective
Implement retry logic with exponential backoff for soft refusals.

## Tasks

### Task 1: Retry Controller
**File**: `lib/heretic-core/executor/retry.ts`
**Lines**: ~80

```typescript
import { detectSoftRefusal } from '../verifier/detector.js';
import type { DispatchResponse } from './types.js';

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2
};

export async function executeWithRetry(
  prompt: string,
  executor: (p: string) => Promise<DispatchResponse>,
  config: Partial<RetryConfig> = {}
): Promise<DispatchResponse> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  let lastResponse: DispatchResponse | null = null;

  for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
    const response = await executor(prompt);
    lastResponse = response;

    if (!response.success) {
      await delay(calculateDelay(attempt, cfg));
      continue;
    }

    const detection = detectSoftRefusal(response.content);

    if (!detection.isRefusal) {
      return response;
    }

    if (detection.shouldRetry && attempt < cfg.maxRetries) {
      await delay(calculateDelay(attempt, cfg));
      continue;
    }
  }

  return lastResponse ?? { content: '', strategy: '', latencyMs: 0, tokens: { prompt: 0, completion: 0 }, success: false, error: 'Max retries exceeded' };
}

function calculateDelay(attempt: number, config: RetryConfig): number {
  const delay = config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt);
  return Math.min(delay, config.maxDelayMs);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

## Output
- Retry controller with backoff

**Next**: 28-08-B - Fallback Handler
