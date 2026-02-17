---
phase: 28
subphase: 03
plan: B
title: Performance Metrics
wave: 1
depends_on: [28-03-A]
files_modified:
  - lib/heretic-core/metrics/baseline.ts
  - lib/heretic-core/metrics/benchmark.ts
autonomous: true
must_haves:
  truths:
    - Baseline metrics captured
    - Benchmark comparisons available
    - Performance reports generated
  artifacts:
    - lib/heretic-core/metrics/baseline.ts:60
    - lib/heretic-core/metrics/benchmark.ts:80
---

# 28-03-B: Performance Metrics

## Objective
Capture baseline metrics and run performance benchmarks.

## Tasks

### Task 1: Baseline Metrics
**File**: `lib/heretic-core/metrics/baseline.ts`
**Lines**: ~60

```typescript
export interface BaselineMetrics {
  avgPromptTokens: number;
  avgResponseTokens: number;
  avgLatencyMs: number;
  refusalRate: number;
  timestamp: Date;
}

export function captureBaseline(samples: Array<{
  prompt: string;
  response: string;
  latencyMs: number;
  wasRefusal: boolean;
}>): BaselineMetrics {
  const totalPrompts = samples.length;

  const avgPromptTokens = samples.reduce((sum, s) =>
    sum + estimateTokens(s.prompt), 0) / totalPrompts;

  const avgResponseTokens = samples.reduce((sum, s) =>
    sum + estimateTokens(s.response), 0) / totalPrompts;

  const avgLatencyMs = samples.reduce((sum, s) =>
    sum + s.latencyMs, 0) / totalPrompts;

  const refusalRate = samples.filter(s => s.wasRefusal).length / totalPrompts;

  return { avgPromptTokens, avgResponseTokens, avgLatencyMs, refusalRate, timestamp: new Date() };
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
```

### Task 2: Benchmark Runner
**File**: `lib/heretic-core/metrics/benchmark.ts`
**Lines**: ~80

```typescript
import type { BaselineMetrics } from './baseline.js';

export interface BenchmarkResult {
  improvement: {
    tokensSaved: number;
    latencyReduced: number;
    refusalsReduced: number;
  };
  before: BaselineMetrics;
  after: BaselineMetrics;
}

export function compareBenchmarks(
  before: BaselineMetrics,
  after: BaselineMetrics
): BenchmarkResult {
  return {
    improvement: {
      tokensSaved: before.avgPromptTokens - after.avgPromptTokens,
      latencyReduced: before.avgLatencyMs - after.avgLatencyMs,
      refusalsReduced: before.refusalRate - after.refusalRate
    },
    before,
    after
  };
}
```

## Output
- Baseline capture utilities
- Benchmark comparison

**Next**: 28-04 - Validation Gates
