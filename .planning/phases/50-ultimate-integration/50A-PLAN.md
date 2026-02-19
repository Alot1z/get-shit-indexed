# 50A: Core Engine Integration - TDD Enhanced

---
phase: 50
plan: 50A
type: sub-plan
wave: 1
depends_on: []
created: 2026-02-19
updated: 2026-02-19
status: planned
tdd_enabled: true
files_modified:
  - lib/core-engine/index.ts
  - lib/core-engine/files-to-prompt.ts
  - lib/core-engine/semantic-search.ts
  - lib/core-engine/codegraph.ts
  - lib/core-engine/fastcode.ts
  - tests/unit/core-engine/*.test.ts
  - tests/integration/core-engine.test.ts
autonomous: true
---

## Objective

Integrate 4 core engine repositories with **full TDD coverage** (RED-GREEN-REFACTOR for each task).

## TDD Task Structure

Each task follows this pattern:
```
🔴 RED:   Write failing test defining expected behavior
🟢 GREEN: Write minimum code to pass the test
🔵 REFACTOR: Optimize while keeping tests green
```

## Must-Haves

### Truths
1. files-to-prompt functionality accessible from GSI CLI
2. Semantic code search working across project files
3. CodeGraphContext relationship queries functional
4. FastCode patterns available for common operations
5. **100% test coverage on all integrated code**

### Artifacts
- `lib/core-engine/index.ts` (min_lines: 50, contains: "export")
- `lib/core-engine/files-to-prompt.ts` (min_lines: 200, contains: "cxml")
- `lib/core-engine/semantic-search.ts` (min_lines: 150, contains: "search")
- `lib/core-engine/codegraph.ts` (min_lines: 100, contains: "neo4j")
- `lib/core-engine/fastcode.ts` (min_lines: 100, contains: "pattern")
- `tests/unit/core-engine/files-to-prompt.test.ts` (min_lines: 100)
- `tests/unit/core-engine/semantic-search.test.ts` (min_lines: 100)
- `tests/unit/core-engine/codegraph.test.ts` (min_lines: 50)
- `tests/unit/core-engine/fastcode.test.ts` (min_lines: 50)

### Key Links
- files-to-prompt → generates cxml from files (TESTED)
- semantic-search → uses files-to-prompt output (TESTED)
- codegraph → queries neo4j for relationships (TESTED)
- fastcode → provides optimized patterns (TESTED)

---

## Task 1: Analyze files-to-prompt Repository

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/files-to-prompt.test.ts
- **Action**: Write test for `analyzeRepository()` function that returns repo structure
- **Test Code**:
```typescript
describe('files-to-prompt', () => {
  it('should analyze repository structure', async () => {
    const result = await analyzeRepository('https://github.com/simonw/files-to-prompt');
    expect(result).toHaveProperty('structure');
    expect(result).toHaveProperty('keyFunctions');
    expect(result.keyFunctions.length).toBeGreaterThan(0);
  });
});
```
- **Verify**: Test fails (function not implemented)
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/files-to-prompt.ts
- **Action**: Clone repo, analyze structure, extract key functions
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Files**: lib/core-engine/files-to-prompt.ts
- **Action**: Add caching for repo analysis, improve error handling
- **Verify**: Tests still pass, code cleaner
- **Done**: ○

---

## Task 2: Integrate files-to-prompt Core

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/files-to-prompt.test.ts
- **Test Code**:
```typescript
it('should convert files to cxml format', async () => {
  const result = await filesToPrompt(['test/fixtures/sample.md'], { format: 'cxml' });
  expect(result).toContain('<documents>');
  expect(result).toContain('<document');
  expect(result).toContain('</documents>');
});

it('should support include patterns', async () => {
  const result = await filesToPrompt(['test/fixtures/'], { include: ['*.md'] });
  expect(result).toContain('sample.md');
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/files-to-prompt.ts
- **Action**: Port core logic to TypeScript with cxml support
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Files**: lib/core-engine/files-to-prompt.ts
- **Action**: Add streaming support for large files
- **Verify**: Tests pass, memory usage improved
- **Done**: ○

---

## Task 3: Add files-to-prompt CLI Wrapper

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/cli.test.ts
- **Test Code**:
```typescript
it('should show help when --help flag provided', async () => {
  const result = await execCLI(['--help']);
  expect(result.stdout).toContain('Usage:');
  expect(result.stdout).toContain('--cxml');
  expect(result.stdout).toContain('--output');
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: bin/gsi-files-to-prompt
- **Action**: Create CLI wrapper using Commander or similar
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add shell completion, improve error messages
- **Verify**: Tests pass, UX improved
- **Done**: ○

---

## Task 4: Analyze semantic-code-search

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/semantic-search.test.ts
- **Test Code**:
```typescript
it('should analyze semantic search architecture', async () => {
  const analysis = await analyzeSemanticSearch();
  expect(analysis).toHaveProperty('embeddingApproach');
  expect(analysis).toHaveProperty('indexStrategy');
  expect(analysis.embeddingApproach).toBe('local');
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/semantic-search.ts
- **Action**: Extract patterns from obra/superpowers semantic-code-search
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Document embedding strategy for future integrations
- **Verify**: Test passes, docs complete
- **Done**: ○

---

## Task 5: Implement Semantic Search

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/semantic-search.test.ts
- **Test Code**:
```typescript
it('should perform semantic search on indexed content', async () => {
  await indexContent(['test/fixtures/docs/']);
  const results = await semanticSearch('authentication patterns');
  expect(results.length).toBeGreaterThan(0);
  expect(results[0]).toHaveProperty('score');
  expect(results[0]).toHaveProperty('content');
});

it('should rank results by relevance', async () => {
  const results = await semanticSearch('test query');
  for (let i = 1; i < results.length; i++) {
    expect(results[i-1].score).toBeGreaterThanOrEqual(results[i].score);
  }
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/semantic-search.ts
- **Action**: Implement local embeddings and similarity search
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add embedding cache, batch processing
- **Verify**: Tests pass, search faster
- **Done**: ○

---

## Task 6: Add Search Index Builder

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/search-index.test.ts
- **Test Code**:
```typescript
it('should build search index from files', async () => {
  const index = await buildSearchIndex(['test/fixtures/']);
  expect(index.documents).toBeGreaterThan(0);
  expect(index.embeddings).toBeDefined();
});

it('should persist index to disk', async () => {
  await buildSearchIndex(['test/fixtures/'], { persist: true, path: '.test-index' });
  const loaded = await loadSearchIndex('.test-index');
  expect(loaded.documents).toBeGreaterThan(0);
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/search-index.ts
- **Action**: Create index builder with persistence
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add incremental index updates
- **Verify**: Tests pass, rebuild faster
- **Done**: ○

---

## Task 7: Analyze CodeGraphContext

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/codegraph.test.ts
- **Test Code**:
```typescript
it('should document existing CodeGraphContext integration', async () => {
  const docs = await documentCodeGraphIntegration();
  expect(docs).toHaveProperty('connectionString');
  expect(docs).toHaveProperty('availableQueries');
  expect(docs.availableQueries).toContain('find_importers');
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/codegraph.ts
- **Action**: Document and verify existing Phase 1-8 integration
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add integration documentation to README
- **Verify**: Test passes, docs complete
- **Done**: ○

---

## Task 8: Enhance CodeGraph Integration

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/codegraph.test.ts
- **Test Code**:
```typescript
it('should find all callers of a function', async () => {
  const callers = await findCallers('gsi:execute-phase');
  expect(callers.length).toBeGreaterThan(0);
  expect(callers[0]).toHaveProperty('file');
  expect(callers[0]).toHaveProperty('line');
});

it('should detect circular dependencies', async () => {
  const cycles = await detectCircularDependencies('lib/');
  expect(Array.isArray(cycles)).toBe(true);
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/codegraph.ts
- **Action**: Add higher-level query helpers
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add query builder DSL for complex queries
- **Verify**: Tests pass, API cleaner
- **Done**: ○

---

## Task 9: Add Graph Query Cache

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/graph-cache.test.ts
- **Test Code**:
```typescript
it('should cache query results', async () => {
  const result1 = await cachedQuery('find_importers', { target: 'test' });
  const result2 = await cachedQuery('find_importers', { target: 'test' });
  expect(result1).toEqual(result2);
  expect(getCacheStats().hits).toBe(1);
});

it('should achieve 50%+ cache hit rate on repeated queries', async () => {
  // Run same queries multiple times
  for (let i = 0; i < 10; i++) {
    await cachedQuery('find_importers', { target: 'gsi:execute-phase' });
  }
  expect(getCacheStats().hitRate).toBeGreaterThan(0.5);
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/graph-cache.ts
- **Action**: Implement LRU cache with TTL for query results
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add cache invalidation on graph updates
- **Verify**: Tests pass, cache coherent
- **Done**: ○

---

## Task 10: Analyze FastCode Patterns

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/fastcode.test.ts
- **Test Code**:
```typescript
it('should catalog FastCode optimization patterns', async () => {
  const patterns = await catalogFastCodePatterns();
  expect(patterns.length).toBeGreaterThan(0);
  expect(patterns[0]).toHaveProperty('name');
  expect(patterns[0]).toHaveProperty('useCase');
  expect(patterns[0]).toHaveProperty('expectedImprovement');
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/fastcode.ts
- **Action**: Research and document FastCode patterns
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Categorize patterns by use case
- **Verify**: Test passes, docs organized
- **Done**: ○

---

## Task 11: Implement FastCode Utilities

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/fastcode.test.ts
- **Test Code**:
```typescript
it('should provide optimized file read utility', async () => {
  const start = Date.now();
  const content = await fastReadFile('test/fixtures/large-file.txt');
  const duration = Date.now() - start;
  expect(content.length).toBeGreaterThan(0);
  expect(duration).toBeLessThan(100); // Should be fast
});

it('should benchmark 2x+ improvement over naive approach', async () => {
  const naiveTime = await benchmarkNaive();
  const fastTime = await benchmarkFast();
  expect(fastTime).toBeLessThan(naiveTime / 2);
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/fastcode.ts
- **Action**: Implement optimized utilities for common operations
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add more utilities based on profiling
- **Verify**: Tests pass, more utilities
- **Done**: ○

---

## Task 12: Create Core Engine Index

### 🔴 RED: Write Test
- **Files**: tests/unit/core-engine/index.test.ts
- **Test Code**:
```typescript
it('should export all core engine modules', () => {
  const core = require('./index');
  expect(core.filesToPrompt).toBeDefined();
  expect(core.semanticSearch).toBeDefined();
  expect(core.codeGraph).toBeDefined();
  expect(core.fastCode).toBeDefined();
});

it('should provide unified API', () => {
  const core = require('./index');
  expect(typeof core.filesToPrompt).toBe('function');
  expect(typeof core.semanticSearch).toBe('function');
  expect(typeof core.queryGraph).toBe('function');
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/core-engine/index.ts
- **Action**: Export all modules with unified API
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add TypeScript types for all exports
- **Verify**: Tests pass, types complete
- **Done**: ○

---

## Integration Tests

### Integration Test 1: Core Engine ↔ Agent Framework
```typescript
describe('Core Engine to Agent Framework Integration', () => {
  it('should provide search results to agents', async () => {
    const searchResults = await coreEngine.semanticSearch('test query');
    const agentContext = await agentFramework.prepareContext(searchResults);
    expect(agentContext).toHaveProperty('relevantFiles');
  });
});
```

### Integration Test 2: Core Engine Internal
```typescript
describe('Core Engine Internal Integration', () => {
  it('should use fastcode patterns in semantic search', async () => {
    const start = Date.now();
    await coreEngine.semanticSearch('complex query with many results');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000); // Should use optimizations
  });
});
```

### Integration Test 3: Graph + Search Integration
```typescript
describe('CodeGraph + Semantic Search Integration', () => {
  it('should combine graph relationships with semantic search', async () => {
    const searchResults = await coreEngine.semanticSearch('authentication');
    const relatedFiles = await coreEngine.findRelated(searchResults[0].file);
    expect(relatedFiles.length).toBeGreaterThan(0);
  });
});
```

---

## Verification Checklist

### TDD Verification
- [ ] All 12 tasks have RED tests written first
- [ ] All 12 tasks have GREEN implementations passing tests
- [ ] All 12 tasks have REFACTOR optimizations applied
- [ ] 100% test coverage on lib/core-engine/

### Integration Verification
- [ ] Core Engine ↔ Agent Framework integration test passes
- [ ] Core Engine internal integration test passes
- [ ] Graph + Search integration test passes

### Coverage Targets
- [ ] files-to-prompt.ts: 100% coverage
- [ ] semantic-search.ts: 100% coverage
- [ ] codegraph.ts: 100% coverage
- [ ] fastcode.ts: 100% coverage

---

## Output

Core Engine module with **full TDD coverage**, integration tests, and 100% test coverage on all integrated code.

---

**Estimated Duration:** 3 hours (with TDD)
**Wave:** 1 (Foundation)
**Test Coverage Target:** 100%
