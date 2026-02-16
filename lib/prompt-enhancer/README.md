# Prompt Enhancer Module

Intelligent prompt analysis and enhancement for GSI workflows.

## Overview

The Prompt Enhancer analyzes user prompts for complexity and applies appropriate enhancements to improve clarity, structure, and safety.

## Features

- **Risk Assessment** - Scores prompts 0-100 for complexity/risk
- **Mode Selection** - Chooses enhancement intensity based on score
- **Template System** - Multiple enhancement strategies for different contexts
- **Intelligent Rewriting** - Applies templates with context awareness

## Installation

```javascript
const promptEnhancer = require('./lib/prompt-enhancer');
```

## Quick Start

```javascript
const { analyzePrompt, fullEnhance, quickEnhance } = require('./lib/prompt-enhancer');

// Analyze a prompt
const analysis = analyzePrompt('Implement authentication');
console.log(analysis.riskScore);    // e.g., 45
console.log(analysis.mode);          // e.g., 'standard'
console.log(analysis.template);      // e.g., 'engineering'

// Full enhancement pipeline
const result = fullEnhance('Implement authentication');
console.log(result.enhancement.enhanced);  // Enhanced prompt

// Quick enhancement (no thinking)
const enhanced = quickEnhance('fix bug');
```

## API Reference

### Main Functions

#### `analyzePrompt(prompt, options)`

Analyzes a prompt and returns risk assessment with recommended mode.

```javascript
const analysis = analyzePrompt('Build a REST API', {
  forceMode: 'full',        // Optional: Force specific mode
  disableThinking: false    // Optional: Disable thinking
});
```

**Returns:**
```javascript
{
  prompt: string,
  riskScore: number,        // 0-100
  riskCategory: string,     // MINIMAL|LOW|MODERATE|HIGH|CRITICAL
  mode: string,             // none|light|standard|full
  config: object,           // Mode configuration
  template: string,         // Recommended template
  skipped: boolean,         // Whether prompt was skipped
  shouldEnhance: boolean    // Whether enhancement recommended
}
```

#### `fullEnhance(prompt, options)`

Complete enhancement pipeline with analysis and rewriting.

```javascript
const result = fullEnhance('Implement user auth');
```

**Returns:**
```javascript
{
  analysis: object,    // Full analysis result
  enhancement: object, // Rewrite result
  summary: {
    enhanced: boolean,
    template: string,
    riskScore: number,
    mode: string
  }
}
```

#### `quickEnhance(prompt)`

Simplified enhancement for performance-critical paths.

```javascript
const enhanced = quickEnhance('fix this bug');
// Returns enhanced prompt string
```

### Risk Engine

```javascript
const { assessRisk, getRiskCategory, shouldSkip } = require('./lib/prompt-enhancer');

assessRisk('complex prompt');     // Returns 0-100 score
getRiskCategory(45);              // Returns 'MODERATE'
shouldSkip('yes');                // Returns true
```

### Mode Selector

```javascript
const { selectMode, getModeConfig, MODES } = require('./lib/prompt-enhancer');

selectMode(45);                   // Returns 'standard'
getModeConfig('full');            // Returns config object
MODES.STANDARD                    // 'standard'
```

### Templates

```javascript
const { rewrite, selectTemplate, TEMPLATE_TYPES } = require('./lib/prompt-enhancer');

rewrite('test', TEMPLATE_TYPES.ENGINEERING);  // Apply template
selectTemplate('implement X', 30);            // Auto-select template
```

## Modes

| Mode | Score Range | Description |
|------|-------------|-------------|
| NONE | 0-9 | Skip enhancement |
| LIGHTWEIGHT | 10-29 | Template-based only |
| STANDARD | 30-59 | Thinking + templates |
| COMPREHENSIVE | 60-100 | Full cognitive enhancement |

## Templates

| Template | Use Case |
|----------|----------|
| CLARITY | Questions, short prompts |
| ENGINEERING | Implementation tasks |
| DECOMPOSED | Complex multi-part requests |
| ACADEMIC | Theoretical analysis |
| SECURITY | Security-related prompts |

## Configuration

```javascript
// Override mode thresholds
const THRESHOLDS = {
  none: 10,
  light: 30,
  standard: 60,
  full: 100
};

// Force specific behavior
const options = {
  forceMode: 'comprehensive',
  disableThinking: true
};
```

## Performance

- Risk assessment: <1ms
- Template selection: <1ms
- Full enhancement: <5ms
- No external API calls

## Integration

### With GSI Workflows

```javascript
// In execute-plan workflow
const analysis = analyzePrompt(task.action);
if (analysis.shouldEnhance) {
  const result = fullEnhance(task.action);
  // Use enhanced prompt
}
```

### With Thinking System

```javascript
if (requiresThinking(analysis.mode)) {
  // Invoke thinking servers
  const thoughts = await thinkBeforeTool(analysis);
}
```

## License

MIT - Part of GSI (Get Shit Indexed)
