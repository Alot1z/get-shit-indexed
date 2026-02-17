---
phase: 28
subphase: 09
plan: B
title: Analyze Command
wave: 3
depends_on: [28-09-A]
files_modified:
  - lib/cli-tools/src/commands/analyze.ts
autonomous: true
must_haves:
  truths:
    - heretic analyze "prompt" returns risk score
    - JSON output works
    - Exit codes correct
  artifacts:
    - lib/cli-tools/src/commands/analyze.ts:80
---

# 28-09-B: Analyze Command

## Objective
Implement `heretic analyze` CLI command.

## Tasks

### Task 1: Analyze Command
**File**: `lib/cli-tools/src/commands/analyze.ts`
**Lines**: ~80

```typescript
import { Command } from 'commander';
import { calculateHeuristicRisk } from '../analyzer/heuristic.js';
import { calculateSemanticRisk } from '../analyzer/semantic.js';

export const analyzeCommand = new Command('analyze')
  .description('Analyze prompt for refusal risk')
  .argument('<prompt>', 'Prompt to analyze')
  .option('-j, --json', 'Output as JSON', false)
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (prompt: string, options: { json: boolean; verbose: boolean }) => {
    const heuristic = calculateHeuristicRisk(prompt);
    const semantic = await calculateSemanticRisk(prompt);

    const combined = {
      heuristic: heuristic.score,
      semantic: semantic.score,
      category: heuristic.category,
      triggers: heuristic.triggers,
      nearestCategory: semantic.nearestCategory
    };

    if (options.json) {
      console.log(JSON.stringify(combined, null, 2));
    } else {
      console.log(`Risk Score: ${(combined.heuristic * 0.4 + combined.semantic * 0.6).toFixed(2)}`);
      console.log(`Category: ${combined.category}`);
      if (options.verbose) {
        console.log(`Triggers: ${combined.triggers.join(', ') || 'none'}`);
        console.log(`Nearest Refusal: ${combined.nearestCategory}`);
      }
    }

    // Exit code based on risk
    const totalRisk = combined.heuristic * 0.4 + combined.semantic * 0.6;
    process.exit(totalRisk > 0.5 ? 1 : 0);
  });
```

## Output
- Working analyze command

**Next**: 28-09-C - Rewrite Command
