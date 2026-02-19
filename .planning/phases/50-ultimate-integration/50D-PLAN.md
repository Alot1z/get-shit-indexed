# 50D: Workflow Engine Integration - TDD Enhanced

---
phase: 50
plan: 50D
type: sub-plan
wave: 3
depends_on: [50B, 50C]
created: 2026-02-19
updated: 2026-02-19
status: planned
tdd_enabled: true
files_modified:
  - lib/workflow-engine/index.ts
  - lib/workflow-engine/promptchains.ts
  - lib/workflow-engine/mdream.ts
  - lib/workflow-engine/taskmaster.ts
  - lib/workflow-engine/chain-validate.ts
  - lib/workflow-engine/task-parallel.ts
  - lib/workflow-engine/task-retry.ts
  - tests/unit/workflow-engine/*.test.ts
  - tests/integration/workflow-engine.test.ts
autonomous: true
---

## Objective

Integrate 3 workflow engine repositories with **full TDD coverage** (RED-GREEN-REFACTOR for each task).

## TDD Task Structure

Each task follows: 🔴 RED (test) → 🟢 GREEN (implement) → 🔵 REFACTOR (optimize)

## Must-Haves

### Truths
1. PromptChains chaining patterns functional
2. mdream markdown processing working
3. taskmaster task orchestration available
4. **100% test coverage on all integrated code**

### Artifacts
- `lib/workflow-engine/index.ts` (min_lines: 50, contains: "export")
- `lib/workflow-engine/promptchains.ts` (min_lines: 150, contains: "chain")
- `lib/workflow-engine/mdream.ts` (min_lines: 100, contains: "markdown")
- `lib/workflow-engine/taskmaster.ts` (min_lines: 150, contains: "task")
- `tests/unit/workflow-engine/promptchains.test.ts` (min_lines: 100)
- `tests/unit/workflow-engine/mdream.test.ts` (min_lines: 100)
- `tests/unit/workflow-engine/taskmaster.test.ts` (min_lines: 100)

---

## Task 1: Analyze PromptChains

### 🔴 RED: Write Test
```typescript
// tests/unit/workflow-engine/promptchains.test.ts
import { describe, it, expect } from 'vitest';

describe('PromptChains', () => {
  it('should analyze PromptChains repository structure', async () => {
    const analysis = await analyzePromptChains('https://github.com/MIATECHPARTNERS/PromptChains');
    expect(analysis).toHaveProperty('chainFormat');
    expect(analysis).toHaveProperty('stateManagement');
    expect(analysis.chainFormat.version).toBeDefined();
  });
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Clone repo, analyze chain format, document structure
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Create analysis cache, add examples
- **Verify**: Test passes
- **Done**: ○

---

## Task 2: Implement Chain Executor

### 🔴 RED: Write Test
```typescript
it('should execute chains in sequence with state', async () => {
  const chain = {
    steps: [
      { prompt: 'What is {{input}}?', id: 'step1' },
      { prompt: 'Summarize: {{step1.output}}', id: 'step2' }
    ]
  };
  const result = await executeChain(chain, { input: 'AI' });
  expect(result.steps).toHaveLength(2);
  expect(result.state.step1.output).toBeDefined();
  expect(result.state.step2.output).toBeDefined();
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Implement chain executor with state management
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add step caching, parallel independent steps
- **Verify**: Test passes, faster execution
- **Done**: ○

---

## Task 3: Add Chain Templates

### 🔴 RED: Write Test
```typescript
it('should provide built-in chain templates', () => {
  const templates = getChainTemplates();
  expect(templates).toContainEqual(
    expect.objectContaining({ name: 'plan-execute-verify' })
  );
  expect(templates).toContainEqual(
    expect.objectContaining({ name: 'research-synthesize' })
  );
});

it('should instantiate template with variables', () => {
  const chain = instantiateTemplate('plan-execute-verify', { phase: '50A' });
  expect(chain.steps[0].prompt).toContain('50A');
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Create template library with variable substitution
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add template validation, custom templates support
- **Verify**: Tests pass
- **Done**: ○

---

## Task 4: Add Chain Validation

### 🔴 RED: Write Test
```typescript
it('should reject chains with circular dependencies', () => {
  const invalidChain = {
    steps: [
      { id: 'a', prompt: '{{b.output}}' },
      { id: 'b', prompt: '{{a.output}}' }
    ]
  };
  expect(() => validateChain(invalidChain)).toThrow('circular dependency');
});

it('should reject chains with missing variables', () => {
  const invalidChain = {
    steps: [{ id: '1', prompt: '{{missing.value}}' }],
    input: {}
  };
  const errors = validateChain(invalidChain);
  expect(errors).toContainEqual(expect.stringContaining('missing'));
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Implement chain validator with dependency analysis
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add helpful error messages, suggestions
- **Verify**: Tests pass, better UX
- **Done**: ○

---

## Task 5: Analyze mdream

### 🔴 RED: Write Test
```typescript
describe('mdream', () => {
  it('should analyze mdream markdown processing patterns', async () => {
    const analysis = await analyzeMdream('https://github.com/harlan-zw/mdream');
    expect(analysis).toHaveProperty('parsingStrategy');
    expect(analysis).toHaveProperty('outputFormats');
    expect(analysis.outputFormats).toContain('json');
  });
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Clone repo, analyze markdown processing approach
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Document integration patterns
- **Verify**: Test passes
- **Done**: ○

---

## Task 6: Implement Markdown Processor

### 🔴 RED: Write Test
```typescript
it('should convert markdown to structured JSON', async () => {
  const md = '# Title\n\n## Section\n\nContent here';
  const result = await processMarkdown(md, { format: 'json' });
  expect(result.title).toBe('Title');
  expect(result.sections).toHaveLength(1);
  expect(result.sections[0].heading).toBe('Section');
});

it('should extract code blocks with language', async () => {
  const md = '```typescript\nconst x = 1;\n```';
  const result = await processMarkdown(md, { format: 'json' });
  expect(result.codeBlocks).toHaveLength(1);
  expect(result.codeBlocks[0].language).toBe('typescript');
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Implement markdown parser with AST output
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add streaming support, optimize parsing
- **Verify**: Tests pass, faster
- **Done**: ○

---

## Task 7: Add Knowledge Extraction

### 🔴 RED: Write Test
```typescript
it('should extract knowledge patterns from markdown', async () => {
  const md = `
## Decision: Use TDD
We decided to use TDD because it ensures quality.

## Pattern: Repository Integration
Clone → Analyze → Integrate → Test
`;
  const knowledge = await extractKnowledge(md);
  expect(knowledge.decisions).toContainEqual(
    expect.objectContaining({ title: 'Use TDD' })
  );
  expect(knowledge.patterns).toContainEqual(
    expect.objectContaining({ name: 'Repository Integration' })
  );
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Implement knowledge extraction with pattern recognition
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add custom patterns, confidence scoring
- **Verify**: Test passes
- **Done**: ○

---

## Task 8: Analyze taskmaster

### 🔴 RED: Write Test
```typescript
describe('taskmaster', () => {
  it('should analyze task orchestration patterns', async () => {
    const analysis = await analyzeTaskmaster();
    expect(analysis).toHaveProperty('dependencyResolution');
    expect(analysis).toHaveProperty('parallelization');
    expect(analysis).toHaveProperty('retryStrategy');
  });
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Analyze taskmaster patterns
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Document best practices
- **Verify**: Test passes
- **Done**: ○

---

## Task 9: Implement Task Orchestrator

### 🔴 RED: Write Test
```typescript
it('should execute tasks in dependency order', async () => {
  const executionOrder: string[] = [];
  const tasks = [
    { id: 'c', run: async () => { executionOrder.push('c'); }, dependsOn: ['b'] },
    { id: 'a', run: async () => { executionOrder.push('a'); }, dependsOn: [] },
    { id: 'b', run: async () => { executionOrder.push('b'); }, dependsOn: ['a'] }
  ];
  await orchestrateTasks(tasks);
  expect(executionOrder).toEqual(['a', 'b', 'c']);
});

it('should detect circular dependencies', () => {
  const tasks = [
    { id: 'a', dependsOn: ['b'] },
    { id: 'b', dependsOn: ['a'] }
  ];
  expect(() => orchestrateTasks(tasks)).toThrow('circular');
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Implement topological sort with cycle detection
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add task priorities, progress tracking
- **Verify**: Tests pass
- **Done**: ○

---

## Task 10: Add Task Parallelization

### 🔴 RED: Write Test
```typescript
it('should run independent tasks in parallel', async () => {
  const tasks = [
    { id: 'a', run: async () => delay(100).then(() => 'a') },
    { id: 'b', run: async () => delay(100).then(() => 'b') },
    { id: 'c', run: async () => delay(100).then(() => 'c') }
  ];
  const start = Date.now();
  await executeParallel(tasks, { maxConcurrency: 3 });
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(200); // Should be ~100ms, not 300ms
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Implement parallel execution with concurrency limit
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add dynamic concurrency based on load
- **Verify**: Test passes
- **Done**: ○

---

## Task 11: Add Task Retry Logic

### 🔴 RED: Write Test
```typescript
it('should retry failed tasks with exponential backoff', async () => {
  let attempts = 0;
  const task = {
    id: 'flaky',
    run: async () => {
      attempts++;
      if (attempts < 3) throw new Error('temporary');
      return 'success';
    }
  };
  const result = await executeWithRetry(task, { maxRetries: 3, backoff: 'exponential' });
  expect(result).toBe('success');
  expect(attempts).toBe(3);
});

it('should fail after max retries', async () => {
  const task = {
    id: 'always-fails',
    run: async () => { throw new Error('permanent'); }
  };
  await expect(executeWithRetry(task, { maxRetries: 2 })).rejects.toThrow('permanent');
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Implement retry with backoff strategies
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add retry conditions, circuit breaker
- **Verify**: Tests pass
- **Done**: ○

---

## Task 12: Create Workflow Engine Index

### 🔴 RED: Write Test
```typescript
it('should export all workflow engine modules', () => {
  const wf = require('./index');
  expect(wf.executeChain).toBeDefined();
  expect(wf.processMarkdown).toBeDefined();
  expect(wf.orchestrateTasks).toBeDefined();
  expect(wf.executeParallel).toBeDefined();
  expect(wf.executeWithRetry).toBeDefined();
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Action**: Export all modules with unified API
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add TypeScript types, documentation
- **Verify**: Test passes
- **Done**: ○

---

## Integration Tests

```typescript
describe('Workflow Engine Integration', () => {
  it('should chain markdown processing with task orchestration', async () => {
    const md = await processMarkdown('# Test\n\nContent');
    const tasks = createTasksFromKnowledge(md.knowledge);
    const result = await orchestrateTasks(tasks);
    expect(result.completed).toBeGreaterThan(0);
  });

  it('should integrate with Agent Framework', async () => {
    const chain = getChainTemplate('research-synthesize');
    const result = await executeChain(chain, { topic: 'TDD' });
    expect(result.finalOutput).toBeDefined();
  });

  it('should integrate with Knowledge System', async () => {
    const md = '## Decision: Test First\nTDD ensures quality.';
    const knowledge = await extractKnowledge(md);
    await storeKnowledge(knowledge);
    const retrieved = await queryKnowledge('TDD');
    expect(retrieved).toBeDefined();
  });
});
```

---

## Verification Checklist

### TDD Verification
- [ ] All 12 tasks have RED tests written first
- [ ] All 12 tasks have GREEN implementations passing tests
- [ ] All 12 tasks have REFACTOR optimizations applied
- [ ] 100% test coverage on lib/workflow-engine/

### Integration Verification
- [ ] Workflow Engine ↔ Agent Framework integration
- [ ] Workflow Engine ↔ Knowledge System integration
- [ ] Internal chain + task integration

---

**Estimated Duration:** 3 hours (with TDD)
**Wave:** 3 (depends on Agents + Knowledge)
**Test Coverage Target:** 100%
