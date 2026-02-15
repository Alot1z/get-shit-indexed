/**
 * Tractatus Thinking Prompt Templates
 * 
 * Templates for tractatus thinking server (logical structure analysis).
 * Used for CODE_OPS, GRAPH_OPS, and COMPLEX_OPS categories.
 */

/**
 * Code operation prompt template
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function codeOperationPrompt(context = {}) {
  const {
    toolName,
    operation,
    codePath,
    pattern,
    scope
  } = context;
  
  return `
You are about to perform a code analysis operation using ${toolName}.

## Code Analysis Details
- Tool: ${toolName}
- Operation: ${operation || 'analyze'}
- Code Path: ${codePath || 'not specified'}
- Pattern: ${pattern || 'not specified'}
- Scope: ${scope || 'not specified'}

## Structural Analysis Approach
Apply Tractatus thinking to break down the code structure:

1. **Atomic Propositions**
   - What are the fundamental code units?
   - Functions, classes, modules?
   - Dependencies and imports?

2. **Logical Relationships**
   - How do components relate?
   - Call hierarchies?
   - Data flow patterns?
   - Dependency chains?

3. **Structural Decomposition**
   - What is the code architecture?
   - Design patterns in use?
   - Abstraction levels?
   - Separation of concerns?

4. **Verification Points**
   - Code consistency
   - Pattern adherence
   - Architectural alignment
   - Maintainability factors

## Questions to Answer
- What is the logical structure of this code?
- How do the components interact?
   - What patterns are evident?
- What assumptions can be verified?

Please proceed with tractatus thinking for code structure analysis.
`.trim();
}

/**
 * Graph operation prompt template
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function graphOperationPrompt(context = {}) {
  const {
    toolName,
    operation,
    queryType,
    target,
    relationship
  } = context;
  
  return `
You are about to perform a graph analysis operation using ${toolName}.

## Graph Analysis Details
- Tool: ${toolName}
- Operation: ${operation || 'query'}
- Query Type: ${queryType || 'not specified'}
- Target: ${target || 'not specified'}
- Relationship: ${relationship || 'not specified'}

## Relationship Analysis Approach
Apply Tractatus thinking to analyze code relationships:

1. **Relationship Identification**
   - What entities are involved?
   - What type of relationship exists?
   - Directionality (unidirectional/bidirectional)?
   - Cardinality (1:1, 1:N, N:M)?

2. **Logical Structure**
   - What is the relationship graph structure?
   - Are there cycles or dependencies?
   - What is the transitive closure?
   - Are there implicit relationships?

3. **Multiplicative Factors**
   - What must ALL be true for success?
   - What are the necessary conditions?
   - What are the sufficient conditions?
   - A × B × C dependencies?

4. **Decomposition**
   - Can relationships be broken down?
   - What are the atomic relationships?
   - How do they compose?

## Questions to Answer
- What is the logical structure of relationships?
- What dependencies exist?
- What are the critical paths?
- What assumptions underpin the relationships?

Please proceed with tractatus thinking for relationship analysis.
`.trim();
}

/**
 * Complex operation prompt template
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function complexOperationPrompt(context = {}) {
  const {
    toolName,
    phases,
    dependencies,
    integrationPoints
  } = context;
  
  return `
You are about to perform a complex multi-phase operation using ${toolName}.

## Complex Operation Details
- Tool: ${toolName}
- Phases: ${phases || 'multiple'}
- Dependencies: ${dependencies || 'none specified'}
- Integration Points: ${integrationPoints || 'none specified'}

## Combined Thinking Approach
Apply both Tractatus and Sequential thinking:

### Phase 1: Tractatus (Structure)
1. **Decompose the Operation**
   - What are the atomic components?
   - What is the logical structure?
   - What dependencies exist?

2. **Analyze Relationships**
   - How do phases relate?
   - What are the integration points?
   - What are the multiplicative factors?

### Phase 2: Sequential (Process)
1. **Plan the Execution**
   - What is the step sequence?
   - What are the checkpoints?
   - What are the fallbacks?

2. **Execute Step-by-Step**
   - Start with first phase
   - Verify before proceeding
   - Handle errors gracefully

### Phase 3: Tractatus (Verify)
1. **Verify Results**
   - Did all phases complete?
   - Are all relationships valid?
   - Is the structure intact?

## Questions to Answer
- What is the complete logical structure?
- What is the optimal execution sequence?
- What verification points are needed?
- How will you handle failures?

Please proceed with combined tractatus and sequential thinking.
`.trim();
}

/**
 * Generic tractatus prompt
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function genericPrompt(context = {}) {
  const {
    toolName,
    category,
    description,
    focus
  } = context;
  
  return `
You are about to perform a ${category || 'unknown'} operation using ${toolName}.

## Operation
- Tool: ${toolName}
- Category: ${category || 'unknown'}
- Focus: ${focus || 'general analysis'}
- Description: ${description || 'No description provided'}

## Tractatus Thinking Approach
Apply logical structure analysis:

1. **Clarify Concepts**
   - What are you analyzing?
   - What are the key entities?
   - What are the boundaries?

2. **Identify Relationships**
   - How do entities relate?
   - What are the dependencies?
   - What are the logical connections?

3. **Decompose Structure**
   - What are the atomic components?
   - How do they compose?
   - What is the logical architecture?

4. **Verify Logic**
   - Are all propositions true?
   - Are all relationships valid?
   - Is the structure coherent?

Please proceed with tractatus thinking for logical analysis.
`.trim();
}

module.exports = {
  codeOperationPrompt,
  graphOperationPrompt,
  complexOperationPrompt,
  genericPrompt
};
