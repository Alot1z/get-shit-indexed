---
phase: 28
subphase: 09
plan: A
title: CLI Package Setup
wave: 3
depends_on: [28-01, 28-02, 28-05, 28-06, 28-07]
files_modified:
  - lib/cli-tools/package.json
  - lib/cli-tools/bin/heretic
  - lib/cli-tools/src/index.ts
autonomous: true
must_haves:
  truths:
    - npm install -g works
    - heretic --version displays
    - Help text available
  artifacts:
    - lib/cli-tools/package.json:50
    - lib/cli-tools/bin/heretic:20
    - lib/cli-tools/src/index.ts:60
---

# 28-09-A: CLI Package Setup

## Objective
Create standalone CLI package for heretic tools.

## Tasks

### Task 1: Package Configuration
**File**: `lib/cli-tools/package.json`
**Lines**: ~50

```json
{
  "name": "@gsi/heretic-cli",
  "version": "0.1.0",
  "description": "Heretic semantic intervention CLI tools",
  "type": "module",
  "bin": {
    "heretic": "./bin/heretic.js"
  },
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@xenova/transformers": "^2.17.0",
    "gpt-tokenizer": "^2.1.0",
    "commander": "^12.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0"
  }
}
```

### Task 2: Binary Entry Point
**File**: `lib/cli-tools/bin/heretic.js`
**Lines**: ~20

```javascript
#!/usr/bin/env node
import { program } from 'commander';
import { analyzeCommand } from '../dist/commands/analyze.js';
import { rewriteCommand } from '../dist/commands/rewrite.js';
import { scoreCommand } from '../dist/commands/score.js';

program
  .name('heretic')
  .description('Heretic semantic intervention tools')
  .version('0.1.0');

program.addCommand(analyzeCommand);
program.addCommand(rewriteCommand);
program.addCommand(scoreCommand);

program.parse();
```

### Task 3: Main Index
**File**: `lib/cli-tools/src/index.ts`
**Lines**: ~60

```typescript
export { calculateHeuristicRisk } from './analyzer/heuristic.js';
export { calculateSemanticRisk } from './analyzer/semantic.js';
export { applyRewrite, applyBestRewrite } from './rewriter/applier.js';
export { detectSoftRefusal } from './verifier/detector.js';
export { scoreResponses, selectBestResponse } from './verifier/scorer.js';
```

## Output
- CLI package ready for npm install

**Next**: 28-09-B - Analyze Command
