/**
 * Debug Thinking Prompt Templates
 * 
 * Templates for debug thinking server (graph-based problem solving).
 * Used for DEBUG_OPS category and error states.
 */

/**
 * Debug operation prompt template
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function debugOperationPrompt(context = {}) {
  const {
    toolName,
    problem,
    error,
    attempts,
    context: debugContext
  } = context;
  
  return `
You are about to perform a debug analysis using ${toolName}.

## Debug Analysis Details
- Tool: ${toolName}
- Problem: ${problem || 'not specified'}
- Error: ${error || 'none'}
- Previous Attempts: ${attempts || 0}
- Context: ${debugContext || 'not provided'}

## Debug Thinking Approach
Apply graph-based debugging to systematically solve the problem:

### 1. Problem Decomposition
- What is the core problem?
- What are the symptoms?
- What are the potential causes?
- Can the problem be broken down into sub-problems?

### 2. Hypothesis Generation
- What are the most likely causes?
- What evidence supports each hypothesis?
- What would disprove each hypothesis?
- Which hypothesis should be tested first?

### 3. Experiment Design
- What experiment will test the hypothesis?
- What is the expected outcome?
- What would indicate the hypothesis is wrong?
- How will results be measured?

### 4. Observation & Learning
- What was observed?
- Do results support or refute the hypothesis?
- What was learned?
- How does this change understanding?

### 5. Iteration
- Should another hypothesis be tested?
- Is the problem solved?
- What are the next steps?
- What patterns were discovered?

## Debug Thinking Graph
Create nodes for:
- **problem**: The issue being debugged
- **hypothesis**: Potential causes
- **experiment**: Tests to run
- **observation**: Results and findings
- **learning**: Insights and patterns

Connect nodes with relationships:
- **decomposes**: Problem broken into sub-problems
- **hypothesizes**: Hypothesis for problem
- **tests**: Experiment tests hypothesis
- **produces**: Experiment yields observation
- **learns**: Learning from results

## Questions to Answer
- What is the root cause?
- What is the minimal reproducible case?
- What is the fix?
- How can this be prevented in the future?

Please proceed with debug thinking for systematic problem solving.
`.trim();
}

/**
 * Error state prompt template
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function errorStatePrompt(context = {}) {
  const {
    toolName,
    operation,
    errorMessage,
    stackTrace,
    reproductionSteps
  } = context;
  
  return `
An error occurred during operation with ${toolName}.

## Error Details
- Tool: ${toolName}
- Operation: ${operation || 'unknown'}
- Error Message: ${errorMessage || 'not provided'}
- Stack Trace: ${stackTrace || 'not provided'}

## Reproduction Steps
${reproductionSteps || 'No reproduction steps provided'}

## Debug Approach
Apply systematic debugging to understand and resolve the error:

### Phase 1: Problem Analysis
1. **Create Problem Node**
   - What exactly failed?
   - When did it fail?
   - What was the expected behavior?

2. **Context Collection**
   - What was the input?
   - What was the state?
   - What were the conditions?

### Phase 2: Hypothesis Generation
1. **Generate Hypotheses**
   - What could cause this error?
   - What are the most likely causes?
   - What are the less likely causes?

2. **Prioritize Hypotheses**
   - Which is most probable?
   - Which is easiest to test?
   - Which is most critical?

### Phase 3: Investigation
1. **Design Experiments**
   - What test will confirm the hypothesis?
   - What logs or diagnostics are needed?
   - What isolation steps can be taken?

2. **Execute Investigation**
   - Run tests
   - Check logs
   - Verify assumptions

### Phase 4: Resolution
1. **Implement Fix**
   - What is the minimal fix?
   - Does it resolve the root cause?
   - Are there side effects?

2. **Verify Solution**
   - Does the error still occur?
   - Are there other similar errors?
   - What can be learned?

## Learning Capture
Store in debug graph for future reference:
- What was the problem?
- What was the solution?
- What patterns were identified?
- How can this be prevented?

Please proceed with debug thinking to resolve this error.
`.trim();
}

/**
 * Pattern learning prompt template
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function patternLearningPrompt(context = {}) {
  const {
    toolName,
    pattern,
    occurrences,
    solutions
  } = context;
  
  return `
You are about to analyze a recurring pattern using ${toolName}.

## Pattern Analysis Details
- Tool: ${toolName}
- Pattern: ${pattern || 'not specified'}
- Occurrences: ${occurrences || 'multiple'}
- Known Solutions: ${solutions || 'none documented'}

## Pattern Learning Approach
Use debug thinking to capture and learn from patterns:

### 1. Pattern Identification
- What is the recurring pattern?
- Where does it occur?
- How often does it occur?
- What are the variations?

### 2. Root Cause Analysis
- What causes this pattern?
- Is there a common trigger?
- What are the contributing factors?
- What is the logical structure?

### 3. Solution Analysis
- What solutions have worked?
- What solutions have failed?
- What is the best practice?
- What is the minimal fix?

### 4. Knowledge Capture
Store in debug graph:
- **pattern**: The recurring issue
- **root_cause**: Why it happens
- **solution**: How to fix it
- **prevention**: How to avoid it

### 5. Prediction
- When will this pattern recur?
- What are the early warning signs?
- How can it be prevented?
- What should be automated?

## Questions to Answer
- What is the pattern?
- Why does it occur?
- How is it best resolved?
- How can it be prevented?

Please proceed with debug thinking for pattern learning.
`.trim();
}

/**
 * Generic debug prompt
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function genericPrompt(context = {}) {
  const {
    toolName,
    category,
    description,
    severity
  } = context;
  
  return `
You are about to perform a ${category || 'unknown'} operation using ${toolName}.

## Operation
- Tool: ${toolName}
- Category: ${category || 'unknown'}
- Severity: ${severity || 'medium'}
- Description: ${description || 'No description provided'}

## Debug Thinking Approach
Apply systematic problem solving:

1. **Understand the Problem**
   - What is the issue?
   - What are the symptoms?
   - What is the impact?

2. **Decompose**
   - Can it be broken down?
   - What are the sub-problems?
   - What are the dependencies?

3. **Hypothesize**
   - What are the causes?
   - What is most likely?
   - How can it be tested?

4. **Experiment**
   - What test is needed?
   - What is the expected result?
   - How will it be measured?

5. **Learn**
   - What was discovered?
   - What patterns emerged?
   - How can this be reused?

Please proceed with debug thinking for systematic analysis.
`.trim();
}

module.exports = {
  debugOperationPrompt,
  errorStatePrompt,
  patternLearningPrompt,
  genericPrompt
};
