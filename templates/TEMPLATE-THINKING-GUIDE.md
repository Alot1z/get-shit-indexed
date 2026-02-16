# Template Thinking Integration Guide

## Overview

This guide documents how to integrate thinking phases into GSI templates so generated content includes cognitive enhancement.

## Thinking Placeholder Syntax

### Dynamic Insertion

```
{{THINKING_PHASE:type}}
```

Inserts the appropriate thinking phase content based on context:

| Type | Description | Default Server |
|------|-------------|----------------|
| `PRE_PLANNING` | Structural analysis before planning | Tractatus |
| `DURING_PLANNING` | Task breakdown during planning | Sequential |
| `POST_PLANNING` | Validation after planning | Debug |
| `PRE_EXECUTION` | Preparation before execution | Sequential |
| `DURING_EXECUTION` | Analysis during execution | Tractatus |
| `POST_EXECUTION` | Reflection after execution | Debug |
| `PRE_VERIFICATION` | Check preparation | Sequential |
| `DURING_VERIFICATION` | Pattern analysis | Debug |
| `POST_VERIFICATION` | Learning extraction | Debug |

### Server Hints

```
{{THINKING_SERVER:recommendation}}
```

Provides context-appropriate server recommendation:

- `sequential` - For multi-step processes
- `tractatus` - For structural analysis
- `debug` - For problem-solving and learning

### Conditional Thinking

```
{{#if complex}}
{{THINKING_PHASE:COMPREHENSIVE}}
{{else}}
{{THINKING_PHASE:STANDARD}}
{{/if}}
```

## Template Categories

### Document Templates

| Template | Primary Server | Thinking Phases |
|----------|---------------|-----------------|
| plan.md | Tractatus + Sequential | PRE_PLANNING, DURING_PLANNING, POST_PLANNING |
| summary.md | Debug | POST_EXECUTION, REFLECTION |
| verification.md | Debug | PRE_VERIFICATION, DURING_VERIFICATION, POST_VERIFICATION |
| context.md | Tractatus | PRE_ANALYSIS, STRUCTURE_MAPPING |

### Code Templates

| Template | Primary Server | Thinking Phases |
|----------|---------------|-----------------|
| component.md | Tractatus | PRE_DESIGN, STRUCTURE_ANALYSIS |
| function.md | Sequential | PRE_IMPLEMENTATION, STEP_BREAKDOWN |
| test.md | Debug | TEST_DESIGN, COVERAGE_ANALYSIS |

### Workflow Templates

| Template | Primary Server | Thinking Phases |
|----------|---------------|-----------------|
| phase.md | Tractatus + Sequential | PRE_WORKFLOW, PRE_STEP, POST_STEP, POST_WORKFLOW |
| task.md | Sequential | PRE_TASK, POST_TASK |
| checkpoint.md | Debug | PRE_CHECKPOINT, VALIDATION, POST_CHECKPOINT |

## Integration Examples

### Plan Template

```markdown
# Plan Template

<thinking_phase>
{{THINKING_PHASE:PRE_PLANNING}}
Use Tractatus for:
- Analyze existing code structure
- Map component relationships
- Identify integration points
</thinking_phase>

## Tasks

{{#each tasks}}
### Task {{@index}}: {{name}}
{{THINKING_PHASE:DURING_PLANNING}}
{{/each}}

<thinking_phase>
{{THINKING_PHASE:POST_PLANNING}}
Use Debug for:
- Validate task completeness
- Check for edge cases
- Document assumptions
</thinking_phase>
```

### Summary Template

```markdown
# Summary Template

## Reflection

{{THINKING_PHASE:POST_EXECUTION}}

### What Worked Well
{{LEARNING_CAPTURE:success}}

### What Could Be Improved
{{LEARNING_CAPTURE:improvement}}

### Patterns Discovered
{{LEARNING_CAPTURE:pattern}}

## Debug-Thinking Link

Patterns stored in: ~/.debug-thinking-mcp/
```

### Verification Template

```markdown
# Verification Template

<thinking_phase>
{{THINKING_PHASE:PRE_VERIFICATION}}
Use Sequential for:
- Define verification steps
- Set success criteria
- Prepare test cases
</thinking_phase>

## 7-BMAD Circle Checks

{{#each circles}}
### {{name}} Circle
{{THINKING_SERVER:debug}}
- Check: {{criteria}}
- Prompt: "{{thinking_prompt}}"
{{/each}}

<thinking_phase>
{{THINKING_PHASE:POST_VERIFICATION}}
Use Debug for:
- Extract learnings from results
- Store patterns for future
- Document any issues
</thinking_phase>
```

## Template Metadata

Add to template frontmatter:

```yaml
---
thinking_required: true
thinking_servers:
  - tractatus
  - sequential
  - debug
thinking_phases:
  - PRE_PLANNING
  - DURING_PLANNING
  - POST_PLANNING
min_thinking_duration: 3000
max_thinking_duration: 10000
---
```

## Registry Update

After updating templates, update the template registry:

```javascript
// lib/template-registry.js
module.exports = {
  templates: {
    'plan.md': {
      thinking: {
        required: true,
        servers: ['tractatus', 'sequential', 'debug'],
        phases: ['PRE_PLANNING', 'DURING_PLANNING', 'POST_PLANNING']
      }
    },
    'summary.md': {
      thinking: {
        required: true,
        servers: ['debug'],
        phases: ['POST_EXECUTION', 'REFLECTION']
      }
    }
  }
};
```

## Best Practices

1. **One Server Per Phase**: Don't mix servers in a single phase
2. **Explicit Prompts**: Include thinking prompts, not just server names
3. **Timeout Configuration**: Set appropriate timeouts (3000-10000ms)
4. **Graceful Degradation**: Templates should work if thinking fails
5. **Learning Capture**: Always include reflection sections

## Verification Checklist

- [ ] All templates have thinking metadata
- [ ] Thinking phases match template purpose
- [ ] Server recommendations are appropriate
- [ ] Prompts are specific and actionable
- [ ] Graceful degradation is implemented
