# Workflow Thinking Template

## Overview

This template defines the standard structure for integrating thinking phases into GSI workflow steps. Thinking phases ensure cognitive enhancement at each critical point using appropriate thinking servers.

## Thinking Phase Structure

```markdown
## Thinking Phase

<server>tractatus|sequential|debug</server>
<prompt>Context-aware prompt for the thinking server</prompt>
<expected_output>What the thinking should produce</expected_output>
<timeout>3000</timeout>
<integration>How results influence the next step</integration>
```

## Thinking Phase Types

### 1. PRE_WORKFLOW Thinking
**When**: Before workflow execution begins
**Purpose**: Understand workflow context, identify potential issues
**Server**: Tractatus for structure analysis, Sequential for process planning
**Example**:
```markdown
## Thinking Phase: Pre-Workflow Analysis

<server>tractatus</server>
<prompt>Analyze the workflow structure for this phase:
- What are the key objectives?
- What dependencies exist?
- What are the potential failure points?
- What is the optimal execution order?</prompt>
<expected_output>Structured breakdown of workflow components and dependencies</expected_output>
<timeout>5000</timeout>
<integration>Use structure analysis to prioritize steps and identify risks</integration>
```

### 2. PRE_STEP Thinking
**When**: Before each major workflow step
**Purpose**: Ensure step is well-understood, risks are assessed
**Server**: Sequential for step-by-step analysis, Debug for error-prone steps
**Example**:
```markdown
## Thinking Phase: Pre-Step - [Step Name]

<server>sequential</server>
<prompt>Analyze the upcoming step:
1. What is the exact objective of this step?
2. What tools/resources are needed?
3. What could go wrong?
4. What are the success criteria?</prompt>
<expected_output>Step execution plan with risk mitigation</expected_output>
<timeout>3000</timeout>
<integration>Execute step according to plan, monitor for identified risks</integration>
```

### 3. POST_STEP Thinking
**When**: After each major workflow step
**Purpose**: Capture learnings, verify results, identify improvements
**Server**: Debug for storing observations, Sequential for process reflection
**Example**:
```markdown
## Thinking Phase: Post-Step Reflection - [Step Name]

<server>debug</server>
<prompt>Reflect on the completed step:
1. What worked well?
2. What didn't work as expected?
3. What should be remembered for next time?
4. What patterns emerged?</prompt>
<expected_output>Observations stored in debug-thinking graph for future reference</expected_output>
<timeout>3000</timeout>
<integration>Store learnings in debug-thinking, adjust approach for next steps</integration>
```

### 4. POST_WORKFLOW Thinking
**When**: After workflow completes
**Purpose**: Comprehensive workflow review, capture overall learnings
**Server**: Tractatus for structural insights, Debug for pattern storage
**Example**:
```markdown
## Thinking Phase: Post-Workflow Summary

<server>tractatus</server>
<prompt>Comprehensive workflow analysis:
1. What was the overall workflow structure?
2. What were the key success factors?
3. What structural improvements could be made?
4. What patterns should be documented?</prompt>
<expected_output>Structural insights and improvement recommendations</expected_output>
<timeout>5000</timeout>
<integration>Update workflow documentation, store patterns in debug-thinking</integration>
```

## Server Selection Guidelines

### Tractatus Thinking
**Use for**:
- Structural analysis (workflows, plans, codebases)
- Logical decomposition
- Architecture decisions
- Dependency mapping

**When to use**: When you need to understand "what are the components and how do they relate?"

### Sequential Thinking
**Use for**:
- Step-by-step processes
- Execution planning
- Risk assessment
- Process optimization

**When to use**: When you need to figure out "how do we get from A to B?"

### Debug Thinking
**Use for**:
- Error analysis
- Pattern storage
- Learning capture
- Root cause analysis

**When to use**: When you need to understand "what went wrong and what did we learn?"

## Timeout Guidelines

| Thinking Type | Timeout | Rationale |
|---------------|---------|-----------|
| Quick reflection | 2000ms | Simple validation checks |
| Standard step | 3000ms | Most pre/post step thinking |
| Complex analysis | 5000ms | Pre-workflow, critical steps |
| Deep analysis | 8000ms | Rare, for major architectural decisions |

## Integration Patterns

### Pattern 1: Tractatus → Execute → Debug
```markdown
## Pre-Step: Tractatus Analysis
[Understand structure]

## Execute Step
[Perform the work]

## Post-Step: Debug Reflection
[Store learnings]
```

### Pattern 2: Sequential → Execute → Sequential
```markdown
## Pre-Step: Sequential Planning
[Plan the process]

## Execute Step
[Follow the plan]

## Post-Step: Sequential Review
[Review the process]
```

### Pattern 3: Combined Thinking (Complex Steps)
```markdown
## Pre-Step: Tractatus + Sequential
[Understand structure + plan process]

## Execute Step
[Execute with full understanding]

## Post-Step: Debug + Tractatus
[Store learnings + structural insights]
```

## Usage Examples

### Example 1: Plan Phase Workflow
```markdown
# Plan Phase Workflow

## Thinking Phase: Pre-Workflow
<server>tractatus</server>
<prompt>Analyze phase requirements...</prompt>

## Step 1: Research Context
### Thinking Phase: Pre-Step
<server>sequential</server>
<prompt>Plan research approach...</prompt>

[Execute research]

### Thinking Phase: Post-Step
<server>debug</server>
<prompt>Store research findings...</prompt>

## Step 2: Create Tasks
[...similar thinking pattern...]

## Thinking Phase: Post-Workflow
<server>tractatus</server>
<prompt>Review plan structure...</prompt>
```

### Example 2: Execute Phase Workflow
```markdown
# Execute Phase Workflow

## Thinking Phase: Pre-Workflow
<server>sequential</server>
<prompt>Plan execution strategy...</prompt>

## Step 1: Task Understanding
### Thinking Phase: Pre-Step
<server>tractatus</server>
<prompt>Analyze task structure...</prompt>

[Execute task]

### Thinking Phase: Post-Step
<server>debug</server>
<prompt>Store execution learnings...</prompt>

[...remaining steps...]

## Thinking Phase: Post-Workflow
<server>sequential</server>
<prompt>Review execution process...</prompt>
```

## Template Registry

This template is registered at:
- File: `templates/workflow-thinking.md`
- Category: Thinking
- Tags: workflow, thinking, phases, tractatus, sequential, debug
- Used by: All workflow files in `workflows/` directory

## Maintenance

When updating this template:
1. Maintain backward compatibility with existing workflows
2. Update template registry metadata
3. Provide migration guide for breaking changes
4. Update examples to reflect new patterns

## Related Documentation

- `docs/thinking/THINKING-SERVERS.md` - Thinking server API reference
- `docs/thinking/7-BMAD-THINKING.md` - 7-BMAD methodology
- `workflows/` - All workflow implementations using this template

---

## Template Metadata

```yaml
---
template_type: workflow-thinking
thinking_required: true
thinking_servers:
  - tractatus
  - sequential
  - debug
thinking_phases:
  - PRE_WORKFLOW
  - PRE_STEP
  - POST_STEP
  - POST_WORKFLOW
default_timeout: 3000
complex_timeout: 5000
deep_timeout: 8000
version: 1.1
last_updated: 2026-02-16
---
```

### Registry Entry

This template is registered in the template registry:

```javascript
// lib/template-registry.js
templates['workflow-thinking.md'] = {
  type: 'thinking',
  thinking: {
    required: true,
    servers: ['tractatus', 'sequential', 'debug'],
    phases: ['PRE_WORKFLOW', 'PRE_STEP', 'POST_STEP', 'POST_WORKFLOW'],
    timeouts: {
      quick: 2000,
      standard: 3000,
      complex: 5000,
      deep: 8000
    }
  },
  used_by: [
    'workflows/plan-phase.md',
    'workflows/execute-plan.md',
    'workflows/check-plan.md',
    'workflows/verify-phase.md'
  ]
};
```
