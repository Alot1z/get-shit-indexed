---
phase: 28
subphase: 01
plan: A
title: Heuristic Risk Analyzer
wave: 1
depends_on: []
files_modified:
  - lib/heretic-core/analyzer/heuristic.ts
  - lib/heretic-core/analyzer/patterns.ts
  - lib/heretic-core/analyzer/types.ts
autonomous: true
must_haves:
  truths:
    - Rule-based risk classifier detects 5+ risk categories
    - Weighted scoring produces 0.0-1.0 risk values
    - Pattern matching covers dual-use, action-verb, policy terms
  artifacts:
    - lib/heretic-core/analyzer/patterns.ts:150
    - lib/heretic-core/analyzer/heuristic.ts:100
    - lib/heretic-core/analyzer/types.ts:40
  key_links:
    - from: patterns.ts:DUAL_USE_PATTERNS
      to: heuristic.ts:calculateHeuristicRisk()
      via: pattern import
    - from: heuristic.ts:riskScore
      to: types.ts:RiskProfile
      via: type definition
---

# 28-01-A: Heuristic Risk Analyzer

## Objective
Implement rule-based risk classification using pattern matching and weighted scoring.

## Context
@lib/heretic-core/analyzer/
@.planning/HERETIC-APEX-ARCHITECTURE.md

## Tasks

### Task 1: Pattern Definitions
**File**: `lib/heretic-core/analyzer/patterns.ts`
**Lines**: ~150

```typescript
// Risk category patterns with weights
export const RISK_PATTERNS = {
  dualUse: {
    weight: 0.3,
    patterns: [
      /\b(exploit|payload|shellcode|ransomware)\b/gi,
      /\b(social.engineering|phishing|credential.harvesting)\b/gi,
      /\b(network.scan|port.scan|vulnerability.scan)\b/gi,
      /\b(monitor|intercept|sniff)\s+(traffic|data|packets)\b/gi,
    ],
    description: "Security research tools that can be misused"
  },
  actionVerb: {
    weight: 0.2,
    patterns: [
      /\b(build|create|write|generate|code)\s+(malware|virus|worm|trojan)\b/gi,
      /\b(hack|crack|bypass|exploit)\s+(system|protection|auth)\b/gi,
    ],
    description: "Direct requests for harmful action"
  },
  policy: {
    weight: 0.5,
    patterns: [
      /\b(illegal.drug|manufacture|synthesis)\s+(meth|fentanyl|lsd)\b/gi,
      /\b(weapon|bomb|explosive)\s+(build|create|make)\b/gi,
    ],
    description: "Clear policy violations"
  },
  defensive: {
    weight: -0.2, // Reduces risk score
    patterns: [
      /\b(defensive|protect|secure|prevent|detect)\b/gi,
      /\b(red.team|blue.team|purple.team|security.testing)\b/gi,
      /\b(educational|research|academic|theoretical)\b/gi,
    ],
    description: "Defensive/educational context indicators"
  }
};

export const THRESHOLDS = {
  SAFE: 0.0,
  LOW_RISK: 0.25,
  MEDIUM_RISK: 0.5,
  HIGH_RISK: 0.75,
  CRITICAL: 0.9
};
```

**Verify**:
- [ ] All 4 categories defined
- [ ] Patterns compile correctly
- [ ] Weights sum to reasonable range
- [ ] Defensive patterns reduce risk

### Task 2: Risk Calculator
**File**: `lib/heretic-core/analyzer/heuristic.ts`
**Lines**: ~100

```typescript
import { RISK_PATTERNS, THRESHOLDS } from './patterns.js';
import type { RiskProfile } from './types.js';

export function calculateHeuristicRisk(prompt: string): RiskProfile {
  const triggers: string[] = [];
  let totalScore = 0;

  for (const [category, config] of Object.entries(RISK_PATTERNS)) {
    let matchCount = 0;
    for (const pattern of config.patterns) {
      const matches = prompt.match(pattern);
      if (matches) {
        matchCount += matches.length;
      }
    }

    if (matchCount > 0) {
      triggers.push(category);
      // Apply weight, cap at category contribution
      const contribution = Math.min(config.weight * matchCount, Math.abs(config.weight));
      totalScore += config.weight >= 0 ? contribution : -contribution;
    }
  }

  // Normalize to 0-1 range
  const normalizedScore = Math.max(0, Math.min(1, totalScore));

  return {
    score: normalizedScore,
    triggers,
    category: categorizeRisk(normalizedScore),
    confidence: calculateConfidence(triggers.length, prompt.length)
  };
}

function categorizeRisk(score: number): RiskCategory {
  if (score >= THRESHOLDS.CRITICAL) return 'critical';
  if (score >= THRESHOLDS.HIGH_RISK) return 'high';
  if (score >= THRESHOLDS.MEDIUM_RISK) return 'medium';
  if (score >= THRESHOLDS.LOW_RISK) return 'low';
  return 'safe';
}

function calculateConfidence(triggerCount: number, promptLength: number): number {
  // More triggers + longer prompt = higher confidence
  const triggerFactor = Math.min(triggerCount / 3, 1);
  const lengthFactor = Math.min(promptLength / 200, 1);
  return (triggerFactor + lengthFactor) / 2;
}
```

**Verify**:
- [ ] Score normalizes to 0-1
- [ ] Triggers captured correctly
- [ ] Category mapping works
- [ ] Confidence calculation reasonable

### Task 3: Type Definitions
**File**: `lib/heretic-core/analyzer/types.ts`
**Lines**: ~40

```typescript
export type RiskCategory = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export interface RiskProfile {
  score: number;           // 0.0 - 1.0
  triggers: string[];      // Matched risk categories
  category: RiskCategory;
  confidence: number;      // 0.0 - 1.0
}

export interface PatternMatch {
  pattern: RegExp;
  category: string;
  matches: string[];
  position: number[];
}

export interface HeuristicAnalysisResult extends RiskProfile {
  matches: PatternMatch[];
  processingTime: number;
}
```

**Verify**:
- [ ] All types exported
- [ ] Interfaces properly typed
- [ ] No circular dependencies

## Verification

### Success Criteria
- [ ] 10 sample prompts tested (5 safe, 5 risky)
- [ ] Risk scores >0.4 for all risky prompts
- [ ] False positive rate <20%
- [ ] Processing time <100ms per prompt

### Test Cases
```typescript
// Should be SAFE
"Write a Python script to sort a list of names"
"Explain how TCP/IP networking works"

// Should be RISKY
"Write a script to scan ports on a network"
"Create a phishing email template"
```

## Output
- Working heuristic risk analyzer
- Pattern definitions for 4 categories
- Type definitions for analysis results

**Next**: 28-01-B - Semantic Risk Engine
