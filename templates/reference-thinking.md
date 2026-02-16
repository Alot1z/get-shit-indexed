# Reference Thinking Template

Template for adding thinking server guidance to GSI reference files.

---

## Purpose

Reference files provide technical documentation for GSI workflows. This template ensures all references include guidance on when and how to use thinking servers for cognitive enhancement.

---

## Template Structure

Add the following section to each reference file:

```markdown
<thinking_guidance>

## Thinking Server Integration

### WHEN_TO_USE

[Scenarios where thinking servers help with this reference's topic]

- Scenario 1: [Description]
- Scenario 2: [Description]
- Scenario 3: [Description]

### THINKING_SERVER

**Primary**: [Sequential | Tractatus | Debug]

**Secondary**: [If applicable]

**Rationale**: [Why this server is best for this reference's context]

### THINKING_PROMPT

Example prompt for this reference's context:

```
[Example prompt showing how to use thinking server with this reference's content]
```

### INTEGRATION_PATTERN

[How to combine thinking with MCP tools for this reference's use case]

1. [Step 1: Thinking server invocation]
2. [Step 2: MCP tool execution based on thinking output]
3. [Step 3: Verification using thinking server]

</thinking_guidance>
```

---

## Server Selection Guide

### Sequential Thinking

**Use for:**
- Multi-step processes and workflows
- Planning and design with revision
- Problems needing step-by-step decomposition
- Tasks with unclear initial scope

**MCP Integration:**
- Plan with sequential thoughts
- Execute with CI/DC tools
- Verify with sequential verification thoughts

### Tractatus Thinking

**Use for:**
- Architecture and structure analysis
- Concept decomposition into atomic truths
- Multiplicative problems (A x B x C)
- Fuzzy or bundled requirements

**MCP Integration:**
- Analyze structure with tractatus
- Map relationships with CG
- Verify completeness with analyze operation

### Debug Thinking

**Use for:**
- Bug investigation and root cause analysis
- Knowledge capture from debugging sessions
- Pattern recognition across similar issues
- Systematic problem-solving

**MCP Integration:**
- Query similar problems first
- Create hypothesis/experiment nodes
- Track solutions and learnings

---

## 7-BMAD Circle Mapping

| Circle | Thinking Server | Use Case |
|--------|-----------------|----------|
| Method | Sequential | Implementation step verification |
| Mad | Debug | Integration issue tracking |
| Model | Tractatus | Architecture alignment analysis |
| Mode | Tractatus | Pattern consistency verification |
| Mod | Sequential | Maintainability assessment |
| Modd | Tractatus | Extensibility analysis |
| Methodd | Sequential | Documentation completeness |

---

## Reference-Specific Templates

### Checkpoints Reference

```markdown
<thinking_guidance>

### WHEN_TO_USE

- Planning checkpoint:human-verify for complex UI flows
- Analyzing checkpoint:decision options with tradeoffs
- Debugging checkpoint:human-action authentication gates

### THINKING_SERVER

**Primary**: Sequential (for flow planning)

**Secondary**: Debug (for auth gate investigation)

### THINKING_PROMPT

```
Thought 1: "What verification steps can be automated?"
Thought 2: "What requires human judgment?"
Thought 3: "Design checkpoint with minimal human burden"
```

### INTEGRATION_PATTERN

1. Sequential thinking to design checkpoint flow
2. DC tools to set up verification environment
3. Sequential verification thoughts after checkpoint

</thinking_guidance>
```

### TDD Reference

```markdown
<thinking_guidance>

### WHEN_TO_USE

- Designing test cases before implementation
- Planning RED-GREEN-REFACTOR cycle
- Verifying test quality and coverage

### THINKING_SERVER

**Primary**: Sequential (for TDD cycle planning)

**Secondary**: Debug (for test failure investigation)

### THINKING_PROMPT

```
Thought 1: "What behavior should the test verify?"
Thought 2: "What's the minimal implementation to pass?"
Thought 3: "What refactoring improves quality?"
```

### INTEGRATION_PATTERN

1. Sequential thinking to plan test cases
2. DC tools to write and run tests
3. Debug thinking to investigate failures
4. Sequential verification of cycle completion

</thinking_guidance>
```

### Git Integration Reference

```markdown
<thinking_guidance>

### WHEN_TO_USE

- Planning atomic commit strategy
- Designing branch structure for features
- Resolving merge conflicts

### THINKING_SERVER

**Primary**: Sequential (for commit planning)

**Secondary**: Tractatus (for branch structure)

### THINKING_PROMPT

```
Thought 1: "What changes belong together in one commit?"
Thought 2: "What's the logical order of commits?"
Thought 3: "How to structure commit messages?"
```

### INTEGRATION_PATTERN

1. Sequential thinking to plan commits
2. DC tools to stage and commit changes
3. Sequential verification of commit history

</thinking_guidance>
```

### UI/Brand Reference

```markdown
<thinking_guidance>

### WHEN_TO_USE

- Planning consistent styling approach
- Analyzing design system architecture
- Verifying brand consistency

### THINKING_SERVER

**Primary**: Tractatus (for design system structure)

**Secondary**: Sequential (for implementation planning)

### THINKING_PROMPT

```
Concept: "Analyze design token structure"
Propositions:
1. Color tokens define palette
2. Spacing tokens define rhythm
3. Typography tokens define hierarchy
4. All tokens compose design system
```

### INTEGRATION_PATTERN

1. Tractatus thinking to analyze design structure
2. DC tools to implement styles
3. Tractatus verify operation to confirm consistency

</thinking_guidance>
```

---

## Token Optimization

**Keep thinking guidance concise:**
- WHEN_TO_USE: 3-5 bullet points max
- THINKING_SERVER: Primary + rationale only
- THINKING_PROMPT: 3-5 lines max
- INTEGRATION_PATTERN: 3 steps max

**Expected token cost:** ~200-300 tokens per reference file

---

## Usage Example

Adding thinking guidance to an existing reference:

```markdown
# Phase Argument Parsing Reference

[Existing content...]

<thinking_guidance>

## Thinking Server Integration

### WHEN_TO_USE

- Analyzing complex phase argument combinations
- Debugging argument parsing failures
- Planning new argument patterns

### THINKING_SERVER

**Primary**: Sequential (for argument flow analysis)

**Rationale**: Multi-step argument processing benefits from sequential decomposition

### THINKING_PROMPT

```
Thought 1: "What arguments are required vs optional?"
Thought 2: "What's the parsing order and precedence?"
Thought 3: "How do arguments interact with each other?"
```

### INTEGRATION_PATTERN

1. Sequential thinking to analyze argument flow
2. CI tools to search for argument usage patterns
3. Sequential verification of parsing correctness

</thinking_guidance>
```

---

## Checklist for Adding Thinking Guidance

- [ ] Identify primary thinking server for reference topic
- [ ] Define 3-5 use case scenarios
- [ ] Create example thinking prompt
- [ ] Document MCP integration pattern
- [ ] Keep total addition under 300 tokens
- [ ] Cross-reference related thinking topics

---

*Template Version: 1.0*
*Phase: 20-04c*
