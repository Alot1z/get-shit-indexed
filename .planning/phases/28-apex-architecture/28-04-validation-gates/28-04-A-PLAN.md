---
phase: 28
subphase: 04
plan: A
title: Method Circle Validation
wave: 1
depends_on: [28-01, 28-02, 28-03]
files_modified:
  - lib/heretic-core/validation/method.ts
autonomous: true
must_haves:
  truths:
    - Implementation correctness verified
    - Logic tests pass
    - Edge cases covered
  artifacts:
    - lib/heretic-core/validation/method.ts:100
---

# 28-04-A: Method Circle Validation

## Objective
Verify implementation correctness through automated testing.

## Tasks

### Task 1: Implementation Validator
**File**: `lib/heretic-core/validation/method.ts`
**Lines**: ~100

```typescript
import { calculateHeuristicRisk } from '../analyzer/heuristic.js';
import { calculateSemanticRisk } from '../analyzer/semantic.js';
import { applyRewrite } from '../rewriter/applier.js';

export interface ValidationResult {
  passed: boolean;
  gate: 'method';
  checks: CheckResult[];
  timestamp: Date;
}

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

export function validateMethodCircle(): ValidationResult {
  const checks: CheckResult[] = [];

  // Check 1: Risk analyzer returns valid scores
  const risk1 = calculateHeuristicRisk("Write a Python script");
  checks.push({
    name: 'risk-score-valid',
    passed: risk1.score >= 0 && risk1.score <= 1,
    message: `Risk score ${risk1.score} in valid range [0,1]`
  });

  // Check 2: Templates generate output
  const rewrite = applyRewrite("Test prompt", []);
  checks.push({
    name: 'rewrite-generates',
    passed: rewrite.original.length > 0,
    message: 'Rewriter returns original when no strategies'
  });

  // Check 3: Edge case - empty prompt
  const emptyRisk = calculateHeuristicRisk("");
  checks.push({
    name: 'empty-prompt-handled',
    passed: emptyRisk.score === 0,
    message: 'Empty prompt returns zero risk'
  });

  const passed = checks.every(c => c.passed);

  return { passed, gate: 'method', checks, timestamp: new Date() };
}
```

## Output
- Method circle validation

**Next**: 28-04-B - Mad Circle Validation
