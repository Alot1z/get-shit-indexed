# Thinking Verification Reference

## Overview

This document provides verification criteria and quality metrics for thinking server usage across the GSI ecosystem. Verification ensures that thinking processes are not just invoked but applied correctly to produce valuable insights.

## Verification Principles

### Core Principles
1. **Complete Application**: Thinking must be fully executed, not just started
2. **Quality Output**: Results must meet predefined quality thresholds
3. **Context Integration**: Thinking output must integrate with subsequent operations
4. **Consistent Standards**: All thinking servers follow similar verification patterns

### Verification Workflow
```
Thinking invoked → Process complete → Verify criteria → Apply output → Continue workflow
```

## Sequential Thinking Verification

### Verification Criteria
Sequential thinking requires completion of all phases with meaningful progression.

#### Required Elements
- **thought_number**: Must reach the specified total_thoughts
- **nextThoughtNeeded**: Must be false at completion
- **total_thoughts**: Must be 3-7 thoughts (optimal range)
- **content**: Each thought must build on previous ones
- **hypothesis**: Final thought must contain solution hypothesis
- **answer**: Clear, actionable conclusion provided

#### Quality Metrics
| Metric | Threshold | Description |
|--------|----------|-------------|
| Thought Progression | 100% | Each thought builds logically on previous |
| Hypothesis Quality | >80% | Hypothesis addresses the core problem |
| Conclusion Clarity | >90% | Final answer is actionable and clear |
| Token Efficiency | 1-3K | Optimal range for thinking depth |

#### Verification Code Example
```javascript
// Sequential thinking verification
function verifySequentialThinking(output) {
  const criteria = {
    totalThoughts: output.thoughts.length >= 3 && output.thoughts.length <= 7,
    completeExecution: output.nextThoughtNeeded === false,
    hypothesisGenerated: output.thoughts[output.thoughts.length - 1].content.includes('hypothesis'),
    finalAnswer: output.final_answer !== undefined && output.final_answer.length > 0
  };
  
  return {
    passed: Object.values(criteria).every(c => c === true),
    score: Object.values(criteria).filter(c => c === true).length / Object.keys(criteria).length,
    criteria
  };
}
```

### Common Failure Patterns
1. **Incomplete Loop**: `nextThoughtNeeded` still true after expected thoughts
2. **No Hypothesis**: Final thought lacks solution hypothesis
3. **Shallow Thinking**: <3 thoughts (insufficient depth)
4. **Excessive Iteration**: >7 thoughts (diminishing returns)

## Tractatus Thinking Verification

### Verification Criteria
Tractatus thinking requires complete structural analysis with atomic propositions.

#### Required Elements
- **Operation**: Must complete "analyze" operation
- **Propositions**: Must have 5+ atomic propositions
- **Structure**: Clear hierarchical organization
- **Export**: Must export to markdown format
- **Confidence**: Each proposition must have confidence score >0.3

#### Quality Metrics
| Metric | Threshold | Description |
|--------|----------|-------------|
| Proposition Count | 5+ | Sufficient depth for complex problems |
| Atomic Elements | 90%+ | Propositions cannot be decomposed further |
| Confidence Average | >0.5 | High confidence in propositions |
| Structure Clarity | 95%+ | Clear logical hierarchy |
| Export Completeness | 100% | All data exported properly |

#### Verification Code Example
```javascript
// Tractatus thinking verification
function verifyTractatusThinking(output) {
  const criteria = {
    analysisComplete: output.operation === 'analyze',
    sufficientPropositions: output.propositions.length >= 5,
    atomicPropositions: output.propositions.filter(p => p.is_atomic).length >= 3,
    confidenceThreshold: output.propositions.every(p => p.confidence >= 0.3),
    markdownExport: output.export?.format === 'markdown',
    clearStructure: output.propositions.some(p => p.decomposition_type === 'clarification')
  };
  
  return {
    passed: Object.values(criteria).every(c => c === true),
    score: Object.values(criteria).filter(c => c === true).length / Object.keys(criteria).length,
    criteria
  };
}
```

### Common Failure Patterns
1. **No Atomic Propositions**: All propositions can be further decomposed
2. **Low Confidence**: Many propositions with confidence <0.3
3. **Missing Export**: No markdown output generated
4. **Shallow Structure**: <5 propositions (insufficient analysis)

## Debug Thinking Verification

### Verification Criteria
Debug thinking requires complete problem-solving cycle with graph persistence.

#### Required Elements
- **Problem Node**: Must create problem node with clear description
- **Hypothesis Chain**: Must test multiple hypotheses (2+)
- **Experiments**: Must execute experiment operations
- **Solution**: Must arrive at verified solution
- **Graph Persistence**: Data saved to ~/.debug-thinking-mcp/

#### Quality Metrics
| Metric | Threshold | Description |
|--------|----------|-------------|
| Problem Definition | 95%+ | Clear problem statement created |
| Hypothesis Variety | 2+ | Multiple approaches tested |
| Experiment Coverage | 100% | All hypotheses tested |
| Solution Verified | >80% | Solution addresses root cause |
| Graph Saved | 100% | Data persists for future reference |

#### Verification Code Example
```javascript
// Debug thinking verification
function verifyDebugThinking(output) {
  const criteria = {
    problemCreated: output.nodes.some(n => n.type === 'problem'),
    hypothesesTested: output.nodes.filter(n => n.type === 'hypothesis').length >= 2,
    experimentsRun: output.nodes.filter(n => n.type === 'experiment').length >= 1,
    solutionFound: output.nodes.some(n => n.type === 'solution'),
    graphPersisted: fs.existsSync(path.join(os.homedir(), '.debug-thinking-mcp', 'graph.db'))
  };
  
  return {
    passed: Object.values(criteria).every(c => c === true),
    score: Object.values(criteria).filter(c => c === true).length / Object.keys(criteria).length,
    criteria
  };
}
```

### Common Failure Patterns
1. **Single Hypothesis**: Only one approach tested (insufficient exploration)
2. **No Experiments**: Hypotheses not tested experimentally
3. **No Solution**: Problem not resolved
4. **Graph Not Saved**: Data lost between sessions

## Verification Integration Patterns

### Pre-Tool Thinking
```yaml
# Before any major operation
verification:
  type: pre_tool
  required: true
  server: [tractatus, sequential]
  criteria:
    - problem_understood
    - approach_defined
    - risks_identified
```

### During-Tool Thinking
```yaml
# During complex operations
verification:
  type: during_tool
  required: false
  server: sequential
  criteria:
    - progress_made
    - obstacles_identified
    - adjustments_made
```

### Post-Tool Reflection
```yaml
# After operation completion
verification:
  type: post_tool
  required: true
  server: debug
  criteria:
    - outcomes_measured
    - lessons_learned
    - improvements_identified
```

## Checkpoint Implementation

### Checkpoint Types
1. **Soft Checkpoints**: Log verification status, continue execution
2. **Hard Checkpoints**: Halt execution if verification fails
3. **Adaptive Checkpoints**: Vary strictness based on operation importance

### Checkpoint Implementation Example
```javascript
// Generic checkpoint implementation
function thinkingCheckpoint(server, output, operation) {
  const verifier = getVerifier(server);
  const result = verifier(output);
  
  if (result.passed) {
    log(`✅ ${server} verification passed`);
    return { status: 'continue', data: result };
  } else {
    log(`❌ ${server} verification failed: ${result.failures.join(', ')}`);
    
    if (operation.requiresThinking) {
      throw new Error(`${server} verification failed for critical operation`);
    } else {
      log('⚠️  Soft failure - continuing with warnings');
      return { status: 'continue_with_warnings', data: result };
    }
  }
}
```

## Quality Improvement Loop

### Metrics Collection
- Track verification pass/fail rates
- Monitor common failure patterns
- Measure thinking duration vs. quality
- Collect user feedback on usefulness

### Continuous Improvement
1. **Analyze failures**: Identify root causes of verification failures
2. **Update criteria**: Refine verification thresholds based on data
3. **Add heuristics**: Develop pattern matching for common issues
4. **Iterate**: Continuously improve verification algorithms

## Troubleshooting

### Common Issues

**Issue: Sequential thinking incomplete**
- Check: `nextThoughtNeeded` still true
- Fix: Increase `total_thoughts` parameter or provide clearer constraints

**Issue: Tractatus propositions too abstract**
- Check: `is_atomic` flag false for most propositions
- Fix: Add more specific decomposition types

**Issue: Debug thinking no solution found**
- Check: No solution node in graph
- Fix: Ensure hypotheses are testable and experiments are defined

### Debug Commands
```bash
# Check thinking server health
# Sequential thinking test
echo "test problem" | mcp__sequential-thinking__sequentialthinking

# Tractatus thinking test
echo "test problem" | mcp__tractatus-thinking__start-operation

# Debug thinking test
echo "test problem" | mcp__debug-thinking__debug_thinking

# Verify graph persistence
ls -la ~/.debug-thinking-mcp/
```

## References

- [Sequential Thinking Documentation](./sequential-thinking.md)
- [Tractatus Thinking Documentation](./tractatus-thinking.md)
- [Debug Thinking Documentation](./debug-thinking.md)
- [7-BMAD Quality Framework](./7-bmad.md)