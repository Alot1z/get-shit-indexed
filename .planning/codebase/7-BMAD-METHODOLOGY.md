# 7-BMAD Methodology

## Overview

The 7-BMAD (7-Scared Circle Method) quality framework provides comprehensive validation gates for all agent work. This methodology ensures systematic verification across implementation, integration, architecture, patterns, maintainability, extensibility, and documentation.

**Reference:** See `~/.claude/rules\auto-validation.md` for validation system integration.

---

## The 7 Circles

### Method Circle (Implementation Correctness)

**Validation Focus**: Code correctness and behavior

**Checks:**
- [ ] Code compiles/runs without errors
- [ ] Logic matches requirements exactly
- [ ] Edge cases handled properly
- [ ] Performance requirements met
- [ ] Security vulnerabilities absent
- [ ] Resource management correct

**Validation Tool**: `code-review-expert` with focus on correctness

---

### Mad Circle (Integration Completeness)

**Validation Focus**: Component integration and data flow

**Checks:**
- [ ] All dependencies properly integrated
- [ ] APIs/interfaces match specifications
- [ ] Data flows correctly between components
- [ ] No integration points missing
- [ ] Error handling across boundaries
- [ ] Contract compliance

**Validation Tool**: `code-review-expert` with focus on integration

---

### Model Circle (Architecture Alignment)

**Validation Focus**: Architectural patterns and structure

**Checks:**
- [ ] Follows project architectural patterns
- [ ] Maintains separation of concerns
- [ ] Adheres to design principles
- [ ] Consistent with existing codebase

**Validation Tool**: `tractatus-thinking` for structural analysis

**Process:**
- Use `mcp__tractatus-thinking__tractatus_thinking` (operation: start)
- Concept: "Analyze {architecture/component} structure"
- Add propositions for architectural patterns
- Use analyze operation to verify alignment
- Export findings for verification report

---

### Mode Circle (Pattern Consistency)

**Validation Focus**: Coding pattern consistency

**Checks:**
- [ ] Uses established coding patterns
- [ ] Naming conventions followed
- [ ] Error handling patterns consistent
- [ ] State management patterns aligned
- [ ] Architecture patterns respected
- [ ] Design pattern usage correct

**Validation Tool**: `code-review-expert` with pattern analysis

---

### Mod Circle (Maintainability Standards)

**Validation Focus**: Code maintainability and clarity

**Checks:**
- [ ] Code is readable and clear
- [ ] Comments where necessary (not obvious)
- [ ] Function/class size reasonable
- [ ] Complexity within acceptable limits
- [ ] Test coverage adequate
- [ ] No code duplication

**Metrics:**
- Cyclomatic complexity: <10 per function
- Function length: <50 lines
- Class length: <300 lines
- Duplication: <3% similarity

**Validation Tool**: `code-review-expert` with maintainability metrics

---

### Modd Circle (Extensibility Verification)

**Validation Focus**: Code extensibility and flexibility

**Checks:**
- [ ] Easy to extend/modify
- [ ] No hard-coded assumptions
- [ ] Configurable where appropriate
- [ ] Plugin/extension points clear

**Validation Tool**: `tractatus-thinking` for extensibility analysis

**Process:**
- Use tractatus-thinking to decompose extensibility requirements
- Identify atomic extensibility points
- Verify plugin/extension structure is complete
- Export to markdown for documentation

---

### Methodd Circle (Documentation Quality)

**Validation Focus**: Documentation completeness

**Checks:**
- [ ] README updated if needed
- [ ] API docs complete
- [ ] Usage examples provided
- [ ] Changes documented in changelog
- [ ] Inline comments appropriate
- [ ] Architecture docs updated

**Validation Tool**: `code-review-expert` with documentation check

---

## Validation Workflow

### Phase 1: Completion Detection

```
Agent signals completion
↓
System detects completion signal
↓
Validation agent auto-spawns
```

### Phase 2: Quality Assessment

```
Validation agent loads context
↓
Executes code-review-expert skill
↓
Runs find-skills for optimization check
↓
Applies 7-BMAD gate assessment
```

### Phase 3: Gate Evaluation

Each of the 7 circles is evaluated:

1. **Method Circle**: Implementation correctness check
2. **Mad Circle**: Integration completeness check
3. **Model Circle**: Architecture alignment check
4. **Mode Circle**: Pattern consistency check
5. **Mod Circle**: Maintainability standards check
6. **Modd Circle**: Extensibility verification check
7. **Methodd Circle**: Documentation quality check

### Phase 4: Decision Point

```
All Gates Pass?
YES → Mark complete, notify user
NO  → Automatic fix attempt
     ↓
     Identify failing gates
     ↓
     Generate targeted fixes
     ↓
     Re-run validation
     ↓
     Max 3 retry attempts
     ↓
     If still failing → Notify user with details
```

---

## How Sequential Thinking Supports 7-BMAD

Sequential thinking integrates with 7-BMAD methodology by:

1. **Method Circle**: Each thought can verify implementation correctness
2. **Mad Circle**: Sequential steps ensure integration completeness
3. **Model Circle**: Thought progression reveals architectural alignment
4. **Mode Circle**: Consistent thinking patterns support code pattern consistency
5. **Mod Circle**: Structured thoughts improve maintainability
6. **Modd Circle**: Revision parameters support extensibility verification
7. **Methodd Circle**: Thought documentation supports documentation quality

### Example: 7-BMAD-Aware Sequential Thinking

```
Thought 1: "Analyze requirements for Method Circle (correctness)"
Thought 2: "Verify Mad Circle (integration) - check all dependencies"
Thought 3: "Assess Model Circle (architecture) - verify patterns"
Thought 4: "Check Mode Circle (patterns) - consistency review"
Thought 5: "Evaluate Mod Circle (maintainability) - complexity check"
Thought 6: "Verify Modd Circle (extensibility) - extension points"
Thought 7: "Confirm Methodd Circle (documentation) - docs complete"
```

---

## Gate Evaluation Process

### Automatic Validation

- **Trigger**: After every agent completion
- **Tool**: code-review-expert skill
- **Coverage**: All 7 circles
- **Retry**: Up to 3 attempts on failure

### Manual Validation

- **Trigger**: On-demand via skill invocation
- **Tool**: code-review-expert or tractatus-thinking
- **Coverage**: Specific circles or all
- **Output**: Detailed report with recommendations

---

## Integration with Thinking Servers

### Sequential Thinking + 7-BMAD

- Use sequential thinking for multi-step verification
- Each thought can target a specific circle
- Revision parameters allow gate re-evaluation

### Tractatus Thinking + 7-BMAD

- Model Circle: Use for structural analysis
- Modd Circle: Use for extensibility decomposition
- Export format: markdown for documentation

### Debug Thinking + 7-BMAD

- Method Circle: Solutions verified through graph
- Mad Circle: Dependencies tracked via relationships
- Model Circle: Debugging patterns stored for reuse

---

## Thinking Server Mapping

### Detailed Circle-to-Server Mapping

| Circle | Primary Server | Secondary | Use Case | Example Prompt |
|--------|----------------|-----------|----------|----------------|
| **Method** | Sequential | Debug | Step-by-step implementation verification | "Thought 1: Verify code compiles. Thought 2: Test edge cases. Thought 3: Check performance." |
| **Mad** | Debug | Sequential | Integration issue tracking and dependency verification | "Query: similar integration issues. Create: hypothesis about missing dependency. Test: add import and verify." |
| **Model** | Tractatus | - | Architecture alignment analysis | "Concept: 'Analyze architecture alignment'. Propositions: 1. Follows layer pattern 2. Separates concerns 3. Consistent with codebase" |
| **Mode** | Tractatus | Sequential | Pattern consistency verification | "Concept: 'Verify pattern consistency'. Decompose: naming, error handling, state management. Analyze: compliance with established patterns" |
| **Mod** | Sequential | Tractatus | Maintainability assessment | "Thought 1: Check function complexity. Thought 2: Verify comments appropriate. Thought 3: Assess duplication." |
| **Modd** | Tractatus | - | Extensibility decomposition | "Concept: 'Extensibility requirements'. Propositions: 1. No hard-coded values 2. Clear extension points 3. Configurable behavior" |
| **Methodd** | Sequential | - | Documentation completeness check | "Thought 1: Check README updated. Thought 2: Verify API docs complete. Thought 3: Confirm examples provided." |

### Combined Circle Analysis

When validating multiple circles simultaneously, use this workflow:

```
1. Tractatus: Analyze Model + Mode + Modd (structural circles)
   - Concept: "Analyze structural quality"
   - Add propositions for architecture, patterns, extensibility
   - Export findings

2. Sequential: Verify Method + Mod + Methodd (process circles)
   - Thought 1-2: Implementation correctness (Method)
   - Thought 3-4: Maintainability check (Mod)
   - Thought 5-6: Documentation review (Methodd)

3. Debug: Track Mad Circle (integration)
   - Query: similar integration issues
   - Create: integration verification nodes
   - Connect: dependencies in graph
```

### Example Prompts by Circle

#### Method Circle (Sequential)
```
Thought 1: "Does the code compile without errors?"
Thought 2: "Do edge cases produce expected results?"
Thought 3: "Are performance requirements met?"
Thought 4: "Hypothesis: Implementation is correct if all tests pass"
```

#### Mad Circle (Debug)
```
Query: "Find similar integration issues"
Create hypothesis: "Missing dependency between modules A and B"
Create experiment: "Add explicit import and test"
Record observation: "Integration works after adding import"
Create learning: "Module dependencies must be explicit"
```

#### Model Circle (Tractatus)
```
Concept: "Analyze architecture alignment"
Proposition 1: "Code follows established layer pattern"
Proposition 2: "Separation of concerns maintained"
Proposition 3: "Consistent with existing codebase architecture"
Analyze: Check completeness
Export: Architecture compliance report
```

#### Mode Circle (Tractatus)
```
Concept: "Verify pattern consistency"
Proposition 1: "Naming conventions followed"
Proposition 2: "Error handling pattern matches codebase"
Proposition 3: "State management pattern aligned"
Analyze: Identify pattern violations
Export: Pattern compliance findings
```

#### Mod Circle (Sequential)
```
Thought 1: "Is cyclomatic complexity under 10 per function?"
Thought 2: "Are functions under 50 lines?"
Thought 3: "Is code duplication under 3%?"
Thought 4: "Hypothesis: Code meets maintainability standards"
```

#### Modd Circle (Tractatus)
```
Concept: "Analyze extensibility requirements"
Proposition 1: "No hard-coded values prevent extension"
Proposition 2: "Plugin/extension points clearly defined"
Proposition 3: "Configuration allows customization"
Proposition 4: "Multiplicative: All factors must be present"
Analyze: Verify atomic extensibility points
```

#### Methodd Circle (Sequential)
```
Thought 1: "Is README updated with new features?"
Thought 2: "Are API docs complete for new endpoints?"
Thought 3: "Are usage examples provided?"
Thought 4: "Is CHANGELOG updated?"
Thought 5: "Hypothesis: Documentation is complete"
```

---

## Success Criteria

All 7-BMAD validation passes when:

- [ ] Method Circle: Implementation correct and functional
- [ ] Mad Circle: All integrations complete and verified
- [ ] Model Circle: Architecture aligned with project patterns
- [ ] Mode Circle: All patterns consistent with codebase
- [ ] Mod Circle: Code maintainable and clear
- [ ] Modd Circle: Solution is extensible
- [ ] Methodd Circle: Documentation complete and accurate

---

*Last Updated: 2026-02-16*
*Phase: 20-04c*
*Thinking Servers: Sequential, Tractatus, Debug*
