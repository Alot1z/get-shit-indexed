# Thinking Servers Catalog

## Overview

This document catalogs all available thinking servers for integration with GSI workflows. Each thinking server provides specialized cognitive capabilities for different types of problems.

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

## Tractatus Thinking Server

### Server Tool

`mcp__tractatus-thinking__tractatus_thinking`

### Operations

| Operation | Description | Key Parameters |
|-----------|-------------|----------------|
| `start` | Begin analysis with concept | `concept`, `depth_limit` (default: 5), `style` (analytical/exhaustive/creative) |
| `add` | Build understanding by adding propositions | `session_id`, `content`, `parent_number`, `is_atomic` |
| `navigate` | Move between propositions | `session_id`, `target` (parent/child/sibling/root), `child_index` |
| `export` | Capture insights in format | `session_id`, `format` (markdown/json/graphviz) |
| `analyze` | Check completeness of analysis | `session_id` |
| `revise` | Refine propositions | `session_id`, `proposition_number`, `new_content` |
| `undo` | Reconsider previous steps | `session_id`, `confirm_orphaning` |
| `move` | Restructure propositions | `session_id`, `proposition_number`, `new_parent_number`, `new_position` |

### Key Concepts

- **Propositions**: Atomic truths that cannot be decomposed further
- **Logical structure**: Hierarchy of propositions showing dependencies
- **Atomic vs complex**: Some propositions are atomic, others decompose further
- **Multiplicative relationships**: A x B x C - all factors must be present
- **Logical architecture**: Shows WHY things work, not just WHAT

### Use Cases

Tractatus thinking is ideal for:

- **Breaking down complex concepts into atomic truths**: Concept decomposition
- **Understanding with room for restructuring**: Flexible analysis
- **Analysis where bundled ideas hide real problems**: Unbundling complexity
- **Concepts with unclear logical structure**: Structure clarification
- **Problems requiring multiplicative understanding**: Finding all required factors
- **Tasks needing separation of essential vs accidental**: Distinguishing what matters

### Strategic Sequencing

**Use THIS FIRST for WHAT (structure/logic)**
- Analyze architecture and dependencies
- Decompose concepts into propositions
- Identify multiplicative relationships

**Switch to sequential thinking for HOW (process/steps)**
- Plan implementation steps
- Design execution flow
- Create task breakdown

**Return to tractatus to formalize and verify**
- Verify structural completeness
- Export final architecture
- Document logical dependencies

### Tool Priority

- **Priority**: 2 (Secondary use for architectural decisions)
- **Rationale**: Supports structural analysis and architectural verification
- **Integration**: Works with CG for relationship mapping, DC for implementation

---

## Logical Structure Analysis Patterns

### Pattern 1: Concept Decomposition

**Use when**: Analyzing a complex concept or requirement

**Process**:
1. Start operation with concept question: "What is X?"
2. Add operation to break into propositions
3. Mark atomic propositions (is_atomic: true)
4. Identify multiplicative relationships (A x B x C)

**Example**:
```
Concept: "What is authentication?"

Propositions:
1. Authentication requires identity verification (atomic)
2. Authentication requires credential validation (atomic)
3. Authentication requires session establishment (atomic)
4. Authentication = identity x credential x session (multiplicative)
```

### Pattern 2: Architecture Analysis

**Use when**: Analyzing system or component architecture

**Process**:
1. Start with "Analyze X architecture"
2. Add propositions for each architectural layer
3. Find dependencies between propositions
4. Export to graphviz for visualization

**Example**:
```
Concept: "Analyze user management architecture"

Propositions:
1. User model defines data structure
2. Auth service handles authentication
3. Profile service manages user data
4. Admin panel provides oversight
5. Auth service depends on User model
6. Profile service depends on User model
```

### Pattern 3: Problem Clarification

**Use when**: Concepts feel fuzzy or bundled

**Process**:
1. Start with fuzzy concept
2. Separate bundled concepts at any level
3. Reveal dependencies between propositions
4. Identify ONE missing element preventing success

**Example**:
```
Concept: "Improve performance"

Decomposed:
1. Performance = latency x throughput x resources
2. Latency: Response time optimization
3. Throughput: Request processing capacity
4. Resources: CPU, memory, I/O
5. Missing: Only latency addressed, not throughput
```

### Pattern 4: Verification

**Use when**: Verifying structural completeness

**Process**:
1. Use analyze operation to check completeness
2. Verify all propositions are supported
3. Check for multiplicative failures
4. Confirm logical necessity vs correlation

**Integration with 7-BMAD**:
- **Model Circle**: Use tractatus for architecture alignment verification
- **Modd Circle**: Use tractatus for extensibility analysis
- Export format: markdown for documentation

---

## Tractatus Integration Examples

### Example 1: Architecture Decision Analysis

**Scenario**: "Microservices vs Monolith"

**Process**:
```
1. Start operation
   Concept: "Analyze microservices vs monolith architecture"
   Depth limit: 5

2. Add propositions
   - 1. Microservices enable independent deployment
   - 2. Microservices require service mesh
   - 3. Microservices increase operational complexity
   - 4. Monolith simplifies deployment
   - 5. Monolith limits scaling granularity
   - 6. Decision = scaling x complexity x team_size

3. Analyze operation
   Result: Architecture decision depends on 3 multiplicative factors

4. Export to markdown
   Output: Complete decision rationale with dependencies
```

### Example 2: Failure Analysis

**Scenario**: "System failing despite all components working"

**Process**:
```
1. Start operation
   Concept: "Analyze why system fails when components work"

2. Add propositions
   - 1. Component A works individually
   - 2. Component B works individually
   - 3. Component C works individually
   - 4. Integration = A x B x C (multiplicative)
   - 5. Missing factor: Data consistency between B and C

3. Navigate to find dependencies
   Result: ONE missing factor (data consistency) blocking system

4. Export findings
   Output: Clear identification of blocking issue
```

### Example 3: Concept Clarification

**Scenario**: "Fuzzy requirement: improve performance"

**Process**:
```
1. Start operation
   Concept: "Analyze performance improvement requirements"

2. Add propositions
   - 1. Performance = latency x throughput x resources
   - 2. Latency: Response time < 100ms
   - 3. Throughput: 1000 requests/second
   - 4. Resources: CPU < 80%, memory < 70%
   - 5. All factors must be satisfied (multiplicative)

3. Export to markdown
   Output: Clear, actionable requirements with metrics
```

### Integration with Sequential Thinking

**Workflow**: Tractatus (structure) → Sequential (process) → Tractatus (verify)

```
1. Tractatus Thinking - Start operation
   Concept: "Analyze authentication architecture"
   → Decompose into propositions

2. Sequential Thinking - Plan implementation
   Thought 1: "Implement JWT token generation"
   Thought 2: "Create authentication middleware"
   Thought 3: "Add session management"
   → Generate step-by-step plan

3. Tractatus Thinking - Verify structure
   Analyze operation: Check completeness
   Export operation: Document final architecture
   → Verify all propositions satisfied
```

---

## Token-Efficient Tractatus Patterns

### Compression Strategies

1. **Start with thoughts parameter**: Quick mode using raw thoughts for faster analysis
2. **Limit depth to 3-5 levels**: Use depth_limit parameter to avoid over-decomposition
3. **Export only final structure**: Skip intermediate exports, only export final result
4. **Use navigate instead of repeated add**: Move between existing propositions

### When to Use Tractatus

**Use**:
- Architecture decisions (multiple options with tradeoffs)
- Fuzzy concepts (bundled requirements hiding real issues)
- Multiplicative problems (all factors must be present)

**Skip**:
- Simple CRUD (clear requirements)
- Single-factor issues (one dependency)
- Straightforward tasks (obvious structure)

### Sizing Guidelines

| Complexity | Propositions | Depth Limit | Total Tokens |
|------------|-------------|-------------|--------------|
| Simple concepts | 5-10 | 3 | ~1K |
| Architecture analysis | 10-20 | 4-5 | ~2K |
| Complex systems | 20+ | 5+ (consider splitting) | ~3K+ |

### Integration Flow

**Tractatus (structure) → Sequential (process) → Tractatus (verify)**

```
Example: "Analyze auth architecture"
1. Tractatus: Start → Add propositions → Analyze completeness
2. Sequential: Plan implementation steps → Execute
3. Tractatus: Verify structure → Export to markdown
```

---

## Debug Thinking Server

### Server Tool

`mcp__debug-thinking__debug_thinking`

### Actions

| Action | Description | Key Parameters |
|--------|-------------|----------------|
| `create` | Add nodes to the debugging graph | `action`, `nodeType`, `content`, `parentId`, `metadata` |
| `connect` | Link nodes with relationships | `action`, `from`, `to`, `type`, `strength` |
| `query` | Search and analyze the graph | `action`, `queryType`, `parameters` |

### Node Types (for create action)

| Node Type | Description | Example |
|-----------|-------------|---------|
| `problem` | Error or bug to investigate | "TypeError: Cannot read property 'x' of undefined" |
| `hypothesis` | Proposed explanation or solution | "Missing null check in async operation" |
| `experiment` | Test to validate hypothesis | "Add optional chaining operator" |
| `observation` | Result or finding | "Error resolved, no runtime errors" |
| `learning` | Insight gained | "Async operations need null safety checks" |
| `solution` | Working fix | "Use optional chaining for property access" |

### Relationship Types (for connect action)

| Relationship | Description | Strength |
|--------------|-------------|----------|
| `decomposes` | Problem breaks into sub-problems | 0-1 |
| `hypothesizes` | Hypothesis explains problem | 0-1 |
| `tests` | Experiment validates hypothesis | 0-1 |
| `produces` | Experiment yields observation | 0-1 |
| `learns` | Observation leads to learning | 0-1 |
| `contradicts` | Evidence refutes hypothesis | 0-1 |
| `supports` | Evidence backs hypothesis | 0-1 |
| `solves` | Solution resolves problem | 0-1 |

### Query Types (for query action)

| Query Type | Description | Parameters |
|------------|-------------|------------|
| `similar-problems` | Find past debugging with pattern matching | `pattern`, `limit`, `minSimilarity` |
| `recent-activity` | Show recent debugging work | `limit` |

### Data Persistence

- **Location**: `~/.debug-thinking-mcp/`
- **Format**: Graph database
- **Retention**: Persistent across sessions

### Use Cases

Debug thinking is ideal for:

- **Systematic investigation of bugs**: Structured problem tracking
- **Tracking debugging process over time**: Knowledge persistence
- **Learning from past solutions**: Query-based knowledge retrieval
- **Building knowledge base of debugging patterns**: Learning nodes
- **Complex problems requiring multiple hypotheses**: Graph-based exploration

### Tool Priority

- **Priority**: 2 (Secondary use for systematic debugging)
- **Rationale**: Supports graph-based problem tracking with knowledge reuse
- **Integration**: Works with DC for experiments, CI for evidence search

---

## Graph-Based Debugging Patterns

### Pattern 1: Hypothesis-Driven Debugging

**Use when**: Investigating bugs with multiple possible causes

**Process**:
```
1. CREATE problem node
   - nodeType: "problem"
   - content: "{error description}"

2. CREATE hypothesis node
   - nodeType: "hypothesis"
   - content: "{proposed explanation}"

3. CONNECT: hypothesis hypothesizes problem
   - from: hypothesis_id
   - to: problem_id
   - type: "hypothesizes"
   - strength: 0.7

4. CREATE experiment node
   - nodeType: "experiment"
   - content: "{test to validate}"

5. CONNECT: experiment tests hypothesis
   - type: "tests"

6. CREATE observation node
   - nodeType: "observation"
   - content: "{result}"

7. CONNECT: observation produces experiment
   - type: "produces"

8. CONNECT: observation supports/contradicts hypothesis
   - type: "supports" or "contradicts"

9. CREATE solution node (if confirmed)
   - nodeType: "solution"
   - content: "{working fix}"

10. CONNECT: solution solves problem
    - type: "solves"
```

### Pattern 2: Problem Decomposition

**Use when**: Complex issue with multiple components

**Process**:
```
1. CREATE problem node
   - content: "{complex issue}"

2. CREATE sub-problem nodes
   - Multiple nodes for each component

3. CONNECT: Each sub-problem decomposes problem
   - type: "decomposes"
   - strength: 0-1

4. Repeat decomposition until atomic problems

5. QUERY: similar-problems for each sub-problem
   - Find past solutions before investigation
```

### Pattern 3: Knowledge Reuse

**Use when**: Similar problems may have been solved before

**Process**:
```
1. QUERY: similar-problems
   - pattern: "{error pattern}"
   - minSimilarity: 0.5
   - limit: 10

2. Review past hypotheses, experiments, solutions

3. Adapt known solutions to current problem

4. CREATE learning node
   - Links to relevant past solutions
   - content: "{adaptation notes}"
```

### Pattern 4: Learning Capture

**Use when**: Building knowledge base from debugging sessions

**Process**:
```
1. CREATE learning node after each debug session
   - nodeType: "learning"
   - content: "{insight}"
   - metadata: {tags: [...], confidence: 0.8}

2. CONNECT: learning learns from observation
   - type: "learns"

3. Future queries can retrieve these learnings
   - QUERY: similar-problems matches learning content
```

### Integration with 7-BMAD

- **Method Circle**: Solutions verified through graph structure
- **Mad Circle**: Dependencies tracked via relationships
- **Model Circle**: Debugging patterns stored for reuse
- **All circles**: Benefit from knowledge graph persistence

---

## Debug Thinking Integration Examples

### Example 1: TypeError Investigation

**Scenario**: "TypeError: Cannot read property 'x' of undefined in async operation"

**Graph Structure**:
```
1. CREATE problem: "TypeError: Cannot read property 'x' of undefined"

2. CREATE hypothesis: "Missing null check in async operation"

3. CONNECT: hypothesis hypothesizes problem (strength: 0.7)

4. CREATE experiment: "Add optional chaining operator (?.)"

5. CONNECT: experiment tests hypothesis

6. CREATE observation: "Error resolved, no runtime errors"

7. CONNECT: observation produces experiment
   CONNECT: observation supports hypothesis (strength: 0.9)

8. CREATE solution: "Use optional chaining for property access"

9. CONNECT: solution solves problem

10. CREATE learning: "Async operations need null safety checks"

11. CONNECT: learning learns from observation
```

### Example 2: Performance Problem Decomposition

**Scenario**: "Application slow on load"

**Graph Structure**:
```
1. CREATE problem: "Application slow on load"

2. CREATE sub-problem: "Database queries slow"
3. CREATE sub-problem: "Network latency high"
4. CREATE sub-problem: "JavaScript blocking main thread"

5. CONNECT: Each sub-problem decomposes problem (strength: 0.8)

6. QUERY: similar-problems with "database slow"
   Results: Past solutions (add index, optimize query, use cache)

7. CREATE experiment: "Add database index"

8. CONNECT: experiment tests sub-problem "Database queries slow"

9. CREATE observation: "Query time reduced by 80%"

10. CONNECT: observation supports "database slow" hypothesis
```

### Example 3: Knowledge Reuse

**Scenario**: "Another TypeError undefined"

**Process**:
```
1. QUERY: similar-problems
   pattern: "TypeError undefined"
   minSimilarity: 0.7
   limit: 5

2. Results: Past solutions with confidence scores
   - Solution A: Optional chaining (confidence: 0.9)
   - Solution B: Default values (confidence: 0.7)

3. Adapt Solution A to current context
   - Review: Similar async operation pattern
   - Apply: Add optional chaining operator

4. CREATE learning: "Optional chaining pattern effective for undefined errors"

5. CONNECT: learning learns from observation
```

### Integration with Other Thinking Servers

**Complete Workflow**: Tractatus → Sequential → Debug

```
1. Tractatus Thinking: Decompose problem structure
   Concept: "Analyze {bug} structure"
   → Identify multiplicative factors

2. Sequential Thinking: Plan investigation steps
   Thought 1: "Query similar problems"
   Thought 2: "Create hypothesis based on past solutions"
   Thought 3: "Design experiment to test"
   Thought 4: "Verify fix works"
   → Generate step-by-step investigation

3. Debug Thinking: Track investigation in knowledge graph
   CREATE problem/hypothesis/experiment nodes
   CONNECT relationships
   CREATE solution/learning nodes
   → Build reusable knowledge
```

---

## Token-Efficient Debug Patterns

### Compression Strategies

1. **Batch node creation**: Combine related nodes in single session
2. **Query before create**: Reuse existing knowledge from graph
3. **Minimal metadata**: Only essential tags and confidence scores
4. **Atomic sessions**: One problem per graph interaction

### When to Use Debug Thinking

**Use**:
- Complex bugs (multiple hypotheses needed)
- Repeated issues (pattern recognition helps)
- Learning-critical problems (knowledge worth capturing)

**Skip**:
- One-off trivial fixes (obvious solution)
- Obvious errors (no investigation needed)
- Quick patches (not worth tracking)

### Sizing Guidelines

| Complexity | Nodes | Types | Total Tokens |
|------------|-------|-------|--------------|
| Simple bug | 3-5 | problem, hypothesis, experiment, solution | ~1K |
| Complex issue | 5-10 | add observations, learnings, sub-problems | ~2K |
| Investigation | 10-20 | multiple hypotheses and experiments | ~3K |

**Query first**: Check if problem already solved before creating new nodes

### Integration Flow

**Query (similar problems) → Create (if new) → Connect (relationships) → Query (verify)**

```
Example: "TypeError undefined"
1. Query: Find similar past problems
2. If found: Adapt solution, create learning
3. If new: Create problem, hypothesis, experiment
4. Connect: All relationships with strengths
5. Query: Verify solution works
```

### Knowledge Graph Best Practices

1. **Create learning nodes** after each debug session
2. **Use metadata tags** for future retrieval
3. **Set confidence scores** on relationships (0-1)
4. **Query similar-problems** before starting investigation

---

*Last Updated: 2026-02-13*
*Phase: 05-thinking-server-integration*

---

## Tool Chain Integration Guide

### Tool Chain Selection Matrix

| Thinking Server | Best For | Primary MCP | Token Efficiency |
|----------------|----------|-------------|------------------|
| Sequential | Multi-step planning → CI/DC execution | CI/DC | ~2K for 5-7 thoughts |
| Tractatus | Structure → CG mapping | CG | ~2K for 10-20 propositions |
| Debug | Investigation → DC experiments | DC/Debug | ~1-2K for 3-10 nodes |

### When to Combine Thinking + MCP Servers

**Use Sequential + CI for:**
- Multi-step code analysis
- Complex codebase understanding
- Structured investigation

**Use Tractatus + CG for:**
- Architectural mapping
- Relationship discovery
- Complete structure documentation

**Use Debug + DC for:**
- Systematic bug fixing
- Experiment-based debugging
- Knowledge capture

**Use Sequential + DC for:**
- Planned file operations
- Sequential edits with verification
- Multi-step refactoring

### Token Optimization for Combined Patterns

1. **One thinking session covers multiple MCP operations**
2. **Batch MCP calls based on thinking server output**
3. **Reuse thinking context across related operations**
4. **Export thinking results for documentation reuse**

### Reference to TOOL-CHAIN-PATTERNS.md

- "See TOOL-CHAIN-PATTERNS.md for detailed variant patterns"
- "See decision tree for thinking-aware tool selection"
- "See examples for practical combined patterns"



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

