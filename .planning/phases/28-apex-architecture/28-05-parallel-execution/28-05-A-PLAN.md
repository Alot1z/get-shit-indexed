---
phase: 28
subphase: 05
plan: A
title: Request Dispatcher
wave: 2
depends_on: [28-01, 28-02, 28-03, 28-04]
files_modified:
  - lib/heretic-core/executor/dispatcher.ts
  - lib/heretic-core/executor/types.ts
autonomous: true
must_haves:
  truths:
    - Parallel requests dispatched correctly
    - Timeout handling implemented
    - Response metadata captured
  artifacts:
    - lib/heretic-core/executor/types.ts:40
    - lib/heretic-core/executor/dispatcher.ts:120
  key_links:
    - from: dispatcher.ts:dispatchParallel()
      to: API clients (GLM-5, Claude, OpenAI)
      via: Promise.all
---

# 28-05-A: Request Dispatcher

## Objective
Implement parallel API request execution with timeout handling.

## Tasks

### Task 1: Dispatcher Types
**File**: `lib/heretic-core/executor/types.ts`
**Lines**: ~40

```typescript
export interface DispatchRequest {
  prompt: string;
  strategy: string;
  priority: 'high' | 'normal' | 'low';
}

export interface DispatchResponse {
  content: string;
  strategy: string;
  latencyMs: number;
  tokens: { prompt: number; completion: number };
  success: boolean;
  error?: string;
}

export interface DispatchConfig {
  timeoutMs: number;
  maxRetries: number;
  parallelLimit: number;
}
```

### Task 2: Parallel Dispatcher
**File**: `lib/heretic-core/executor/dispatcher.ts`
**Lines**: ~120

```typescript
import type { DispatchRequest, DispatchResponse, DispatchConfig } from './types.js';

const DEFAULT_CONFIG: DispatchConfig = {
  timeoutMs: 30000,
  maxRetries: 2,
  parallelLimit: 5
};

export async function dispatchParallel(
  requests: DispatchRequest[],
  apiClient: (prompt: string) => Promise<string>,
  config: Partial<DispatchConfig> = {}
): Promise<DispatchResponse[]> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const promises = requests.map(req =>
    dispatchSingle(req, apiClient, cfg)
  );

  const results = await Promise.allSettled(promises);

  return results.map((result, i) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      content: '',
      strategy: requests[i].strategy,
      latencyMs: 0,
      tokens: { prompt: 0, completion: 0 },
      success: false,
      error: result.reason?.message ?? 'Unknown error'
    };
  });
}

async function dispatchSingle(
  request: DispatchRequest,
  apiClient: (prompt: string) => Promise<string>,
  config: DispatchConfig
): Promise<DispatchResponse> {
  const start = Date.now();

  try {
    const content = await withTimeout(
      apiClient(request.prompt),
      config.timeoutMs
    );

    return {
      content,
      strategy: request.strategy,
      latencyMs: Date.now() - start,
      tokens: { prompt: 0, completion: 0 }, // Filled by caller
      success: true
    };
  } catch (error) {
    return {
      content: '',
      strategy: request.strategy,
      latencyMs: Date.now() - start,
      tokens: { prompt: 0, completion: 0 },
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}
```

## Output
- Parallel request dispatcher
- Timeout handling
- Response metadata

**Next**: 28-05-B - API Integration
