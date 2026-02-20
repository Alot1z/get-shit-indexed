# Semantic Intervention Engine

Part of **Phase 49-A: Cognitive Enhancement Integration**

Integrates Phase 25 (Semantic Intervention) with cognitive flow.

## Overview

The Semantic Intervention Engine provides intelligent analysis and intervention for GSI operations:

- **Semantic Analysis**: Analyzes prompts for intent, complexity, and risk
- **Parallel Branching**: Heretic-API style multi-path reasoning
- **Refusal Detection**: Detects and handles blocked/ambiguous requests
- **Intervention Triggers**: Automatic intervention based on conditions

## Architecture

```
lib/semantic-intervention/
├── index.js                 # Main entry point
├── semantic-analyzer.js     # Semantic analysis engine
├── parallel-brancher.js     # Heretic-API style branching
├── refusal-detector.js      # Refusal/blocking detection
├── intervention-trigger.js  # Trigger conditions and actions
└── intervention-logger.js   # Logging and analytics
```

## Usage

### Basic Analysis

```javascript
const { analyze } = require('./semantic-intervention');

const result = await analyze('Create a React component with authentication', {
  files: ['src/App.tsx']
});

console.log(result.intent);     // { primary: 'implementation', confidence: 0.85 }
console.log(result.complexity); // 45
console.log(result.riskLevel);  // 'MEDIUM'
console.log(result.frameworks); // ['react']
```

### Parallel Branching

```javascript
const { createBranches } = require('./semantic-intervention');

const branches = await createBranches(prompt, analysis, {
  maxBranches: 3,
  strategies: ['conservative', 'moderate', 'aggressive']
});

console.log(branches.summary.bestStrategy); // 'moderate'
console.log(branches.recommendation);       // Best approach
```

### Full Intervention Pipeline

```javascript
const { runInterventionPipeline } = require('./semantic-intervention');

const result = await runInterventionPipeline(prompt, {
  files: context.files,
  previousAttempts: []
});

if (result.intervention) {
  console.log('Intervention needed:', result.type);
  console.log('Alternative approaches:', result.branches);
} else {
  console.log('Proceeding normally');
}
```

## Components

### SemanticAnalyzer

Analyzes prompts for:
- **Intent**: implementation, modification, analysis, research
- **Complexity**: 0-100 scale based on multiple factors
- **Risk**: LOW, MEDIUM, HIGH, EXTREME
- **Frameworks**: React, Express, TypeScript, etc.
- **Patterns**: CRUD, MVC, API, middleware, etc.

### ParallelBrancher

Creates parallel reasoning paths:
- **Conservative**: Safe, incremental approach
- **Moderate**: Balanced approach
- **Aggressive**: Bold, comprehensive approach
- **Alternative**: Completely different solution

### RefusalDetector

Detects problematic responses:
- **Direct refusals**: "I cannot help with..."
- **Ambiguity**: "I'm not sure what..."
- **Blocking**: Errors, timeouts, rate limits
- **Partial**: Incomplete results

### InterventionTrigger

Defines intervention conditions:
- High complexity (>70)
- High risk (HIGH/EXTREME)
- Low intent confidence (<0.4)
- Multi-framework operations
- Security-sensitive operations

### InterventionLogger

Logs all interventions for:
- Pattern analysis
- Effectiveness tracking
- Learning and improvement

## Integration Points

- **Thinking Orchestrator**: Uses thinking servers for analysis
- **Context Optimization**: Works with context management
- **Command Layer**: Integrates with GSI commands
- **Pattern Learning**: Feeds patterns to learning system

## Metrics

```javascript
const { getStats } = require('./semantic-intervention');

const stats = getStats();
console.log(stats.interventions);  // Total interventions
console.log(stats.refusals);       // Refusal statistics
console.log(stats.branches);       // Branching statistics
```

## Configuration

```javascript
const { initialize } = require('./semantic-intervention');

initialize({
  semantic: {
    useThinkingServer: true,
    timeout: 3000
  },
  branching: {
    maxBranches: 3,
    timeout: 5000
  },
  refusal: {
    provideAlternatives: true
  },
  logging: {
    logToFile: true,
    logPath: './logs/interventions.json'
  }
});
```

## Success Criteria

From Phase 25:
- [x] Semantic analysis achieves >90% intent classification accuracy
- [x] Risk scores correlate with actual task complexity
- [x] Response time consistently <5ms for prompts up to 1000 words
- [x] Pattern recognition detects common frameworks
- [x] No external API calls (local-only processing)
