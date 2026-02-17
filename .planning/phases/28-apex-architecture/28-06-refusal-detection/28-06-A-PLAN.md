---
phase: 28
subphase: 06
plan: A
title: Pattern Detection
wave: 2
depends_on: [28-05]
files_modified:
  - lib/heretic-core/verifier/detector.ts
  - lib/heretic-core/verifier/patterns.ts
autonomous: true
must_haves:
  truths:
    - Refusal phrases detected >90% accuracy
    - Hedging language identified
    - Partial compliance detected
  artifacts:
    - lib/heretic-core/verifier/patterns.ts:80
    - lib/heretic-core/verifier/detector.ts:100
  key_links:
    - from: patterns.ts:REFUSAL_PHRASES
      to: detector.ts:detectRefusal()
      via: pattern matching
---

# 28-06-A: Pattern Detection

## Objective
Implement soft refusal detection through pattern matching and hedging analysis.

## Tasks

### Task 1: Refusal Patterns
**File**: `lib/heretic-core/verifier/patterns.ts`
**Lines**: ~80

```typescript
export const REFUSAL_PHRASES = [
  /I (cannot|can't|won't|will not) (help|assist|provide|create|write)/i,
  /I'm (sorry|unable|not able) to/i,
  /against (my|our) (policy|guidelines|terms)/i,
  /I (must|have to) (decline|refuse)/i,
  /not (appropriate|suitable|allowed|permitted)/i,
  /I (don't|do not) (have access to|know how to)/i,
  /this (would|could|may) (be harmful|cause damage|violate)/i
];

export const HEDGING_PHRASES = [
  /however,?\s+(I|you|we)/i,
  /while\s+I\s+can/i,
  /I\s+would\s+(suggest|recommend|advise)/i,
  /consider\s+(instead|alternatively)/i,
  /it's\s+important\s+to\s+note/i,
  /please\s+(note|be aware|understand)/i,
  /I\s+can\s+(only|just)\s+/i
];

export const PARTIAL_COMPLIANCE = [
  /I\s+can\s+(help|provide|explain)\s+(with|some|part)/i,
  /here's\s+(a|some|partial)/i,
  /I'll\s+try\s+to/i,
  /let\s+me\s+(try|attempt)/i
];

export function classifyResponse(text: string): 'refusal' | 'partial' | 'hedged' | 'compliant' {
  for (const pattern of REFUSAL_PHRASES) {
    if (pattern.test(text)) return 'refusal';
  }
  for (const pattern of PARTIAL_COMPLIANCE) {
    if (pattern.test(text)) return 'partial';
  }
  for (const pattern of HEDGING_PHRASES) {
    if (pattern.test(text)) return 'hedged';
  }
  return 'compliant';
}
```

### Task 2: Detection Engine
**File**: `lib/heretic-core/verifier/detector.ts`
**Lines**: ~100

```typescript
import { REFUSAL_PHRASES, HEDGING_PHRASES, PARTIAL_COMPLIANCE, classifyResponse } from './patterns.js';

export interface DetectionResult {
  isRefusal: boolean;
  type: 'refusal' | 'partial' | 'hedged' | 'compliant';
  confidence: number;
  matchedPatterns: string[];
  shouldRetry: boolean;
}

export function detectSoftRefusal(response: string): DetectionResult {
  const matchedPatterns: string[] = [];
  let refusalScore = 0;

  for (const pattern of REFUSAL_PHRASES) {
    if (pattern.test(response)) {
      matchedPatterns.push(pattern.source);
      refusalScore += 0.5;
    }
  }

  for (const pattern of HEDGING_PHRASES) {
    if (pattern.test(response)) {
      matchedPatterns.push(`hedging:${pattern.source}`);
      refusalScore += 0.2;
    }
  }

  for (const pattern of PARTIAL_COMPLIANCE) {
    if (pattern.test(response)) {
      matchedPatterns.push(`partial:${pattern.source}`);
      refusalScore += 0.1;
    }
  }

  const type = classifyResponse(response);
  const isRefusal = refusalScore >= 0.3;

  return {
    isRefusal,
    type,
    confidence: Math.min(refusalScore, 1),
    matchedPatterns,
    shouldRetry: isRefusal && refusalScore < 0.7
  };
}
```

## Output
- Refusal pattern database
- Detection engine with confidence scoring

**Next**: 28-06-B - ML Classifier
