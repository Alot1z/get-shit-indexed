# Thinking Servers Catalog

## Overview

This document catalogs all available thinking servers for integration with GSD workflows. Each thinking server provides specialized cognitive capabilities for different types of problems.

**Available Servers:**
- Sequential Thinking: Multi-step problem decomposition
- Tractatus Thinking: Logical structure analysis
- Debug Thinking: Graph-based problem-solving

---

## Sequential Thinking Server

### Server Tool

`mcp__sequential-thinking__sequentialthinking`

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `thought` | string | Yes | Current thinking step |
| `nextThoughtNeeded` | boolean | Yes | Whether another step is needed |
| `thoughtNumber` | integer | Yes | Current step number |
| `totalThoughts` | integer | Yes | Estimated total thoughts |
| `isRevision` | boolean | No | Whether this revises previous thinking |
| `revisesThought` | integer | No | Which thought is being reconsidered |
| `branchFromThought` | integer | No | Branching point for alternative paths |
| `branchId` | string | No | Branch identifier |
| `needsMoreThoughts` | boolean | No | Need more thoughts at end |

### Use Cases

Sequential thinking is ideal for:

- **Breaking down complex problems into steps**: Multi-step decomposition
- **Planning and design with room for revision**: Flexible planning approach
- **Analysis that might need course correction**: Adaptive analysis
- **Problems where scope isn't clear initially**: Exploratory thinking
- **Tasks needing multi-step solutions**: Structured problem-solving
- **Situations requiring filtering of irrelevant information**: Focused analysis

### Best Practices

1. **Start with initial estimate, adjust as needed**: Begin with estimated thoughts (typically 5-7), but feel free to adjust totalThoughts as understanding deepens

2. **Feel free to question or revise previous thoughts**: Use `isRevision=true` and `revisesThought` parameters when reconsidering

3. **Don't hesitate to add more thoughts at the "end"**: Use `needsMoreThoughts=true` if reaching the end but more analysis needed

4. **Express uncertainty when present**: Acknowledge uncertainty in thoughts

5. **Mark thoughts that revise previous thinking**: Use revision parameters to track changes in understanding

6. **Ignore irrelevant information for current step**: Filter out non-essential context

7. **Generate solution hypothesis when appropriate**: Create testable hypotheses

8. **Verify hypothesis based on Chain of Thought steps**: Validate through sequential reasoning

### Tool Priority

- **Priority**: 2 (Secondary use for complex execution with multi-step verification)
- **Rationale**: Supports structured thinking for complex tasks
- **Integration**: Works with DC, CI, CG servers for tool execution

---

## Sequential Thinking Integration Examples

### Example 1: Problem Decomposition

**Scenario**: Complex task requiring multiple steps

**Input**: "Implement authentication system with JWT tokens"

**Process**:
- Thought 1: "Need to design JWT token structure with claims"
- Thought 2: "Need to implement token generation with secret key"
- Thought 3: "Need to create token validation middleware"
- Thought 4: "Need to implement refresh token rotation"
- Thought 5: "Need to add token revocation on logout"
- Thought 6: "Hypothesis: Auth flow complete with security best practices"
- Thought 7: "Verify: All 7-BMAD circles satisfied"

**Output**: Structured solution with JWT auth implementation

---

### Example 2: Planning with Revision

**Scenario**: Initial plan with uncertainty

**Input**: "Design scalable microservices architecture"

**Process**:
- Thought 1: "Start with 3 core services: auth, user, content"
- Thought 2: "Need service mesh for inter-service communication"
- Thought 3: **(Revision)** "Actually, API gateway simpler than service mesh for now" (isRevision: true, revisesThought: 2)
- Thought 4: "Need message queue for async operations"
- Thought 5: "Database per service pattern for data isolation"
- Thought 6: "Hypothesis: Architecture balances simplicity with scalability"

**Output**: Revised plan with clear rationale for each decision

---

### Example 3: Multi-Step Verification

**Scenario**: Solution to verify

**Input**: "Verify this caching strategy is correct"

**Process**:
- Thought 1: "Analyze cache hit/miss patterns"
- Thought 2: "Verify cache invalidation logic"
- Thought 3: "Check for race conditions in concurrent access"
- Thought 4: "Assess cache key design for collisions"
- Thought 5: "Hypothesis: Caching strategy is sound with 90% confidence"
- Thought 6: "Gap identified: No cache warming mechanism"
- Thought 7: "Final: Add cache warming for cold start optimization"

**Output**: Confidence assessment and gaps identified with recommendations

---

### Integration with 7-BMAD

Each thought maps to 7-BMAD circles:

| Thought | 7-BMAD Circle | Focus |
|---------|--------------|-------|
| 1-2 | Method Circle | Implementation correctness |
| 3 | Mad Circle | Integration completeness |
| 4 | Model Circle | Architecture alignment |
| 5 | Mode Circle | Pattern consistency |
| 6 | Mod Circle | Maintainability check |
| 7 | Modd Circle | Extensibility verification |
| Final | Methodd Circle | Documentation quality |

**Gate-Aware Thinking Process**:
```
Thought 1: "Verify Method Circle - Does code work as specified?"
Thought 2: "Check Mad Circle - Are all integrations complete?"
Thought 3: "Assess Model Circle - Does architecture align?"
Thought 4: "Verify Mode Circle - Are patterns consistent?"
Thought 5: "Check Mod Circle - Is code maintainable?"
Thought 6: "Assess Modd Circle - Is solution extensible?"
Thought 7: "Verify Methodd Circle - Is documentation complete?"
```

---

## Token-Efficient Thinking Patterns

### Compression Strategies

1. **Combine Related Thoughts**: "Analyze X + Consider Y + Propose Z" in single thought
2. **Use Thought Numbers Strategically**: Skip intermediate states when possible
3. **Batch Verification Thoughts**: Combine multiple checks into single hypothesis

### Thought Sizing Guidelines

| Complexity | Thoughts | Words per Thought | Total Tokens |
|------------|----------|-------------------|--------------|
| Simple decomposition | 3-5 | 50-100 | ~1K |
| Standard planning | 5-7 | 100-200 | ~2K |
| Complex analysis | 7-10 | 150-250 | ~3K |

### When to Use Sequential Thinking

**Use**:
- Complex planning (3+ steps with dependencies)
- Architectural decisions (multiple options to evaluate)
- Multi-step problems (require decomposition)

**Skip**:
- Simple CRUD operations
- Configuration changes
- Straightforward tasks

### Integration with MCP Tools

Sequential thinking orchestrates MCP tool calls:

```
Thought 1: "Need to analyze authentication flow"
↓
Thought 2: "Use Code-Index MCP to search for auth patterns"
↓
Execute: mcp__code-index-mcp__search_code_advanced("authenticate")
↓
Thought 3: "Found 5 auth middleware functions - analyze each"
↓
Thought 4: "Use Desktop Commander to read auth implementation"
↓
Execute: mcp__desktop-commander__read_file("/src/auth.js")
↓
Thought 5: "Synthesize findings: Auth flow uses JWT with refresh rotation"
```

---

