# Agent Thinking Template

## Overview

This template defines the standard structure for integrating thinking phases into GSI agent files. Thinking phases ensure cognitive enhancement at each critical point during agent execution.

## Agent Thinking Phase Types

### 1. PRE_AGENT Thinking
**When**: Before agent execution begins
**Purpose**: Understand task structure, predict complexity, prepare execution strategy
**Server**: Tractatus for structural analysis
**Integration Point**: First step in agent execution flow

```markdown
## Thinking Phase: Pre-Agent Analysis

<phase>PRE_AGENT</phase>
<server>tractatus</server>
<prompt>Analyze the agent task structure:
1. What is the primary objective?
2. What are the component parts?
3. What dependencies exist between parts?
4. What patterns from 7-BMAD apply?
5. What is the predicted complexity level?</prompt>
<expected_output>
- Structural breakdown of task
- Identified dependencies
- Complexity prediction (low/medium/high)
- Recommended thinking mode
</expected_output>
<timeout>5000</timeout>
<integration>
- Use complexity prediction to select thinking mode
- Use structural breakdown to plan execution order
- Use 7-BMAD analysis to guide quality checks
</integration>
```

### 2. PRE_TOOL Thinking
**When**: Before each tool invocation
**Purpose**: Ensure optimal tool selection, assess operation complexity
**Server**: Sequential for step-by-step analysis, Debug for error-prone operations
**Integration Point**: Before each allowed-tools call

```markdown
## Thinking Phase: Pre-Tool Selection

<phase>PRE_TOOL</phase>
<server>sequential</server>
<prompt>Evaluate the upcoming tool call:
1. What operation is needed?
2. What is the best tool for this operation?
3. What parameters are required?
4. What could go wrong?
5. What is the fallback if this fails?</prompt>
<expected_output>
- Tool selection decision
- Parameter plan
- Error handling strategy
- Fallback approach
</expected_output>
<timeout>3000</timeout>
<integration>
- Use tool selection for optimal MCP usage
- Use parameter plan for correct invocation
- Use error strategy for graceful degradation
</integration>
```

### 3. POST_TOOL Thinking
**When**: After each tool invocation
**Purpose**: Capture learnings, detect patterns, store for future reference
**Server**: Debug for pattern learning
**Integration Point**: After each tool result

```markdown
## Thinking Phase: Post-Tool Reflection

<phase>POST_TOOL</phase>
<server>debug</server>
<prompt>Reflect on the completed tool call:
1. Did the result match expectations?
2. What patterns emerged?
3. What should be remembered?
4. What would improve this operation?</prompt>
<expected_output>
- Success/failure observation
- Pattern detected (if any)
- Learning to store
- Improvement suggestion
</expected_output>
<timeout>2000</timeout>
<integration>
- Store patterns in debug-thinking graph
- Update execution strategy based on learnings
- Apply improvements to subsequent calls
</integration>
```

### 4. POST_AGENT Thinking
**When**: After agent execution completes
**Purpose**: Comprehensive reflection, capture agent-level patterns
**Server**: Debug for learning storage, Tractatus for structural insights
**Integration Point**: Final step in agent execution flow

```markdown
## Thinking Phase: Post-Agent Reflection

<phase>POST_AGENT</phase>
<server>debug</server>
<prompt>Comprehensive agent execution analysis:
1. What was the overall execution structure?
2. What worked well?
3. What challenges were encountered?
4. What patterns should be documented?
5. What would improve this agent type?</prompt>
<expected_output>
- Execution summary
- Success factors
- Challenge log
- Reusable patterns
- Improvement recommendations
</expected_output>
<timeout>5000</timeout>
<integration>
- Store patterns in debug-thinking graph
- Update agent documentation
- Feed improvements back to agent definition
</integration>
```

## Server Selection for Agents

| Thinking Need | Server | Rationale |
|--------------|--------|-----------|
| Task structure understanding | Tractatus | Decomposes complex tasks into atomic parts |
| Execution planning | Sequential | Step-by-step process optimization |
| Error analysis | Debug | Root cause identification and learning |
| Pattern capture | Debug | Knowledge graph storage |
| Tool selection | Sequential | Decision tree navigation |
| Quality validation | Tractatus | 7-BMAD circle verification |

## Agent-Specific Thinking Modes

### GSI Executor Agent
- **Primary Mode**: STANDARD (Sequential)
- **PRE_AGENT**: Tractatus for task structure
- **PRE_TOOL**: Sequential for tool decisions
- **POST_TOOL**: Debug for learning capture
- **POST_AGENT**: Debug for reflection storage

### GSI Planner Agent
- **Primary Mode**: COMPREHENSIVE (Tractatus + Sequential)
- **PRE_AGENT**: Tractatus for phase structure
- **PRE_TOOL**: Sequential for discovery decisions
- **POST_TOOL**: Debug for research learnings
- **POST_AGENT**: Tractatus for plan validation

### GSI Debugger Agent
- **Primary Mode**: COMPREHENSIVE (Debug-focused)
- **PRE_AGENT**: Debug for similar issues query
- **PRE_TOOL**: Debug for investigation planning
- **POST_TOOL**: Debug for finding storage
- **POST_AGENT**: Debug for solution documentation

### GSI Verifier Agent
- **Primary Mode**: STANDARD (Sequential)
- **PRE_AGENT**: Sequential for verification planning
- **PRE_TOOL**: Tractatus for structure checks
- **POST_TOOL**: Debug for issue recording
- **POST_AGENT**: Sequential for report generation

## Allowed-Tools Compatibility

When adding thinking phases to agents, consider tool availability:

### Tools That Support Thinking
All tools support thinking phases. The thinking happens BEFORE the tool call.

### Integration Pattern
```markdown
<allowed_tools>
Tool A, Tool B, Tool C
</allowed_tools>

<thinking_requirements>
- PRE_AGENT: Required for complex tasks
- PRE_TOOL: Recommended for expensive operations
- POST_TOOL: Recommended for learning capture
- POST_AGENT: Required for all executions
</thinking_requirements>

<thinking_mode>
STANDARD | COMPREHENSIVE | LIGHTWEIGHT | NONE
</thinking_mode>
```

## Timeout Guidelines for Agents

| Agent Type | PRE_AGENT | PRE_TOOL | POST_TOOL | POST_AGENT |
|------------|-----------|----------|-----------|------------|
| Executor | 5000ms | 3000ms | 2000ms | 5000ms |
| Planner | 8000ms | 3000ms | 2000ms | 5000ms |
| Debugger | 5000ms | 5000ms | 3000ms | 5000ms |
| Verifier | 3000ms | 2000ms | 2000ms | 3000ms |

## Integration with 7-BMAD Circles

Agent thinking phases align with 7-BMAD quality circles:

| Circle | Thinking Phase | Server |
|--------|---------------|--------|
| Method (Implementation) | PRE_TOOL | Sequential |
| Mad (Integration) | POST_TOOL | Debug |
| Model (Architecture) | PRE_AGENT | Tractatus |
| Mode (Pattern) | POST_TOOL | Debug |
| Mod (Maintainability) | POST_AGENT | Sequential |
| Modd (Extensibility) | PRE_AGENT | Tractatus |
| Methodd (Documentation) | POST_AGENT | Debug |

## Template Usage

To add thinking to an agent file:

1. Add `<thinking_aware>` section after `<role>`
2. Define thinking servers and their usage
3. Specify thinking mode
4. Document when to use each server
5. Add thinking requirements to allowed-tools

Example minimal integration:
```markdown
<thinking_aware>
## Thinking Integration: Sequential Only

### Primary Thinking Server: Sequential (All 7-BMAD Circles)
- **Purpose**: Multi-step problem decomposition
- **Usage**: Task execution planning, deviation handling
- **Mode**: STANDARD

### Thinking Workflow
1. **Pre-Task**: Plan execution approach
2. **During**: Handle deviations with reasoning
3. **Post-Task**: Capture learnings
</thinking_aware>
```

## Related Documentation

- `templates/workflow-thinking.md` - Workflow thinking template
- `docs/thinking/THINKING-SERVERS.md` - Thinking server API reference
- `docs/thinking/7-BMAD-THINKING.md` - 7-BMAD methodology
- `lib/thinking/README.md` - Thinking orchestrator documentation

## Template Registry

- File: `templates/agent-thinking.md`
- Category: Thinking
- Tags: agent, thinking, phases, tractatus, sequential, debug, 7-BMAD
- Used by: All agent files in `~/.claude/agents/` directory
