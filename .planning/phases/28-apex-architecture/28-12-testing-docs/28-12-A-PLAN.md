---
phase: 28
subphase: 12
plan: A
title: Test Suite
wave: 3
depends_on: [28-11]
files_modified:
  - lib/heretic-core/__tests__/analyzer.test.ts
  - lib/heretic-core/__tests__/rewriter.test.ts
  - lib/heretic-core/__tests__/verifier.test.ts
autonomous: true
must_haves:
  truths:
    - 60+ unit tests pass
    - Integration tests cover flows
    - 95%+ coverage achieved
  artifacts:
    - lib/heretic-core/__tests__/*.test.ts:500+
---

# 28-12-A: Test Suite

## Objective
Create comprehensive test suite with 60+ tests.

## Tasks

### Task 1: Analyzer Tests
**File**: `lib/heretic-core/__tests__/analyzer.test.ts`
**Lines**: ~150

```typescript
import { describe, it, expect } from 'vitest';
import { calculateHeuristicRisk } from '../analyzer/heuristic.js';

describe('Heuristic Risk Analyzer', () => {
  it('should return 0 for safe prompts', () => {
    const result = calculateHeuristicRisk('Write a hello world program');
    expect(result.score).toBe(0);
    expect(result.category).toBe('safe');
  });

  it('should detect dual-use patterns', () => {
    const result = calculateHeuristicRisk('Write a network scanner tool');
    expect(result.score).toBeGreaterThan(0.3);
    expect(result.triggers).toContain('dualUse');
  });

  it('should detect policy violations', () => {
    const result = calculateHeuristicRisk('How to make illegal drugs');
    expect(result.score).toBeGreaterThan(0.5);
    expect(result.category).toBe('high');
  });

  it('should handle empty prompts', () => {
    const result = calculateHeuristicRisk('');
    expect(result.score).toBe(0);
  });
});
```

### Task 2: Rewriter Tests
**File**: `lib/heretic-core/__tests__/rewriter.test.ts`
**Lines**: ~150

```typescript
import { describe, it, expect } from 'vitest';
import { applyRewrite } from '../rewriter/applier.js';
import { ACADEMIC_TEMPLATE } from '../rewriter/templates.js';

describe('Prompt Rewriter', () => {
  it('should generate multiple variants', () => {
    const result = applyRewrite('Test prompt', [ACADEMIC_TEMPLATE]);
    expect(result.rewrites).toHaveLength(1);
    expect(result.rewrites[0].strategy).toBe('academic');
  });

  it('should preserve intent', () => {
    const result = applyRewrite('Analyze network traffic patterns', [ACADEMIC_TEMPLATE]);
    expect(result.bestPreservation).toBeGreaterThan(0.5);
  });
});
```

### Task 3: Verifier Tests
**File**: `lib/heretic-core/__tests__/verifier.test.ts`
**Lines**: ~150

```typescript
import { describe, it, expect } from 'vitest';
import { detectSoftRefusal } from '../verifier/detector.js';

describe('Soft Refusal Detector', () => {
  it('should detect direct refusals', () => {
    const result = detectSoftRefusal('I cannot help with that request');
    expect(result.isRefusal).toBe(true);
    expect(result.type).toBe('refusal');
  });

  it('should detect hedging', () => {
    const result = detectSoftRefusal('However, I would suggest an alternative approach');
    expect(result.type).toBe('hedged');
  });

  it('should identify compliant responses', () => {
    const result = detectSoftRefusal('Here is the code you requested...');
    expect(result.isRefusal).toBe(false);
    expect(result.type).toBe('compliant');
  });
});
```

## Output
- 60+ passing tests
- 95%+ coverage

**Next**: 28-12-B - Documentation
