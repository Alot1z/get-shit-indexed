# Phase 26: Context Optimization Layer - TDD Execution Plan

## Overview
Implement Context-Window-as-Cache protocol with hierarchical summarization and vector offloading.

## Existing Infrastructure
- `lib/context-optimization/` - Core module EXISTS
- `lib/context-optimization/token-counter.js` - EXISTS
- `lib/context-optimization/context-cache.js` - EXISTS
- `lib/context-optimization/hierarchical-summarizer.js` - EXISTS
- `lib/context-optimization/context-compressor.js` - EXISTS
- `lib/context-optimization/vector-offloader.js` - EXISTS
- `lib/context-optimization/context-prioritizer.js` - EXISTS

## Gap Analysis
1. **Missing Unit Tests** - No tests exist for context-optimization modules
2. **Integration Tests** - No end-to-end pipeline tests
3. **Performance Benchmarks** - No performance testing
4. **Telescope Method** - Needs validation and optimization

## TDD Execution Waves

### Wave 1: Unit Tests (RED Phase)

#### 26-01-TEST: Token Counter Tests
```javascript
// tests/unit/context-optimization/token-counter.test.js

describe('TokenCounter', () => {
  let counter;

  beforeEach(() => {
    counter = new TokenCounter();
  });

  describe('count()', () => {
    test('should count tokens in plain text', () => {
      const text = 'Hello world this is a test';
      const count = counter.count(text);
      
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThan(text.length);
    });

    test('should count tokens in JSON', () => {
      const json = { key: 'value', nested: { data: 'test' } };
      const count = counter.count(json);
      
      expect(count).toBeGreaterThan(0);
    });

    test('should handle empty content', () => {
      expect(counter.count('')).toBe(0);
      expect(counter.count(null)).toBe(0);
    });

    test('should count code tokens accurately', () => {
      const code = `
        function calculateSum(arr) {
          return arr.reduce((a, b) => a + b, 0);
        }
      `;
      const count = counter.count(code);
      
      // Code has more tokens per char than prose
      expect(count).toBeGreaterThan(10);
    });
  });

  describe('caching', () => {
    test('should cache token counts', () => {
      const text = 'Test content for caching';
      
      counter.count(text);
      const cached = counter.count(text);
      
      expect(cached).toBeDefined();
    });

    test('should return consistent counts', () => {
      const text = 'Consistent text';
      
      const count1 = counter.count(text);
      const count2 = counter.count(text);
      
      expect(count1).toBe(count2);
    });
  });
});
```

#### 26-02-TEST: Context Cache Tests
```javascript
// tests/unit/context-optimization/context-cache.test.js

describe('ContextCache', () => {
  let cache;

  beforeEach(() => {
    cache = new ContextCache({ maxSize: 1000 });
  });

  afterEach(() => {
    cache.clear();
  });

  describe('set() and get()', () => {
    test('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      
      expect(cache.get('key1')).toBe('value1');
    });

    test('should handle complex objects', () => {
      const obj = { nested: { data: [1, 2, 3] } };
      cache.set('complex', obj);
      
      expect(cache.get('complex')).toEqual(obj);
    });

    test('should return undefined for missing keys', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });
  });

  describe('TTL support', () => {
    test('should expire entries after TTL', async () => {
      cache.set('ttl-key', 'value', { ttl: 100 });
      
      expect(cache.get('ttl-key')).toBe('value');
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(cache.get('ttl-key')).toBeUndefined();
    });
  });

  describe('LRU eviction', () => {
    test('should evict least recently used when full', () => {
      const smallCache = new ContextCache({ maxSize: 100 });
      
      // Fill cache
      for (let i = 0; i < 20; i++) {
        smallCache.set(`key${i}`, `x`.repeat(10));
      }
      
      // First key should be evicted
      expect(smallCache.get('key0')).toBeUndefined();
      // Recent keys should exist
      expect(smallCache.get('key19')).toBeDefined();
    });
  });

  describe('statistics', () => {
    test('should track hit rate', () => {
      cache.set('key', 'value');
      cache.get('key');
      cache.get('key');
      cache.get('missing');
      
      const stats = cache.getStats();
      
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBeCloseTo(0.67, 1);
    });
  });
});
```

#### 26-03-TEST: Hierarchical Summarizer Tests
```javascript
// tests/unit/context-optimization/hierarchical-summarizer.test.js

describe('HierarchicalSummarizer', () => {
  let summarizer;

  beforeEach(() => {
    summarizer = new HierarchicalSummarizer({ useThinkingServer: false });
  });

  describe('summarize()', () => {
    test('should create multiple summary levels', async () => {
      const context = {
        files: ['file1.js', 'file2.js', 'file3.js'],
        content: 'Long content here...'
      };
      
      const result = await summarizer.summarize(context);
      
      expect(result.levels).toBeDefined();
      expect(Object.keys(result.levels).length).toBeGreaterThan(1);
    });

    test('should preserve important information', async () => {
      const context = {
        error: 'Critical error occurred',
        data: 'Normal data'
      };
      
      const result = await summarizer.summarize(context);
      
      // Important info should be preserved at all levels
      for (const level of Object.values(result.levels)) {
        expect(level.summary.toLowerCase()).toContain('error');
      }
    });

    test('should reduce token count at each level', async () => {
      const longContent = 'x'.repeat(10000);
      const result = await summarizer.summarize({ content: longContent });
      
      const levelTokens = Object.values(result.levels)
        .map(l => l.tokens);
      
      // Each level should have fewer tokens
      for (let i = 1; i < levelTokens.length; i++) {
        expect(levelTokens[i]).toBeLessThan(levelTokens[i-1]);
      }
    });

    test('should support drill-down navigation', async () => {
      const result = await summarizer.summarize({ content: 'Test' });
      
      expect(result.navigation).toBeDefined();
      expect(result.levels).toBeDefined();
    });
  });

  describe('caching', () => {
    test('should cache summaries', async () => {
      const context = { data: 'test' };
      
      await summarizer.summarize(context);
      const statsBefore = summarizer.getStats();
      
      await summarizer.summarize(context);
      const statsAfter = summarizer.getStats();
      
      expect(statsAfter.cacheHits).toBeGreaterThan(statsBefore.cacheHits);
    });
  });
});
```

#### 26-04-TEST: Context Compressor Tests
```javascript
// tests/unit/context-optimization/context-compressor.test.js

describe('ContextCompressor', () => {
  let compressor;

  beforeEach(() => {
    compressor = new ContextCompressor();
  });

  describe('compress()', () => {
    test('should compress context', async () => {
      const context = {
        files: Array(100).fill('file.js'),
        content: 'Long content...'
      };
      
      const result = await compressor.compress(context);
      
      expect(result.compressed).toBeDefined();
      expect(result.ratio).toBeGreaterThan(0);
    });

    test('should support compression levels', async () => {
      const context = { data: 'x'.repeat(1000) };
      
      const light = await compressor.compress(context, { level: 'light' });
      const aggressive = await compressor.compress(context, { level: 'aggressive' });
      
      expect(aggressive.ratio).toBeGreaterThan(light.ratio);
    });

    test('should preserve critical data', async () => {
      const context = {
        instructions: 'Important task',
        data: 'Less important'
      };
      
      const result = await compressor.compress(context, {
        preserveKey: ['instructions']
      });
      
      expect(result.compressed.instructions).toBeDefined();
    });
  });

  describe('decompress()', () => {
    test('should restore compressed context', async () => {
      const original = { data: 'Test data' };
      const compressed = await compressor.compress(original);
      const restored = compressor.decompress(compressed.compressed);
      
      expect(restored).toEqual(original);
    });
  });
});
```

#### 26-05-TEST: Vector Offloader Tests
```javascript
// tests/unit/context-optimization/vector-offloader.test.js

describe('VectorOffloader', () => {
  let offloader;

  beforeEach(() => {
    offloader = new VectorOffloader();
  });

  afterEach(() => {
    offloader.clearIndex();
  });

  describe('offload()', () => {
    test('should offload context to vector storage', async () => {
      const context = { data: 'x'.repeat(10000) };
      
      const result = await offloader.offload(context);
      
      expect(result.reference).toBeDefined();
      expect(result.reference.id).toBeDefined();
      expect(result.retained).toBeDefined();
    });

    test('should preserve specified keys', async () => {
      const context = {
        instructions: 'Keep this',
        data: 'Offload this'
      };
      
      const result = await offloader.offload(context, {
        preserveKey: ['instructions']
      });
      
      expect(result.retained.instructions).toBe('Keep this');
    });

    test('should create chunks', async () => {
      const context = { data: 'x'.repeat(10000) };
      
      const result = await offloader.offload(context);
      
      expect(result.reference.chunkCount).toBeGreaterThan(0);
    });
  });

  describe('retrieve()', () => {
    test('should retrieve by reference ID', async () => {
      const context = { data: 'Test data' };
      const offloaded = await offloader.offload(context);
      
      const retrieved = await offloader.retrieve(offloaded.reference.id);
      
      expect(retrieved.results).toBeDefined();
      expect(retrieved.results.length).toBeGreaterThan(0);
    });

    test('should retrieve by similarity', async () => {
      await offloader.offload({ data: 'React hooks tutorial' });
      await offloader.offload({ data: 'TypeScript generics guide' });
      
      const result = await offloader.retrieve('React programming');
      
      expect(result.results).toBeDefined();
      expect(result.results.length).toBeGreaterThan(0);
    });
  });

  describe('statistics', () => {
    test('should track offload stats', async () => {
      await offloader.offload({ data: 'Test 1' });
      await offloader.offload({ data: 'Test 2' });
      
      const stats = offloader.getStats();
      
      expect(stats.offloads).toBe(2);
      expect(stats.chunksCreated).toBeGreaterThan(0);
    });
  });
});
```

### Wave 2: Implementation Enhancement (GREEN Phase)

#### 26-06-IMPL: Enhance Token Counter
- Add Claude-specific tokenization
- Improve accuracy for code
- Add token estimation caching

#### 26-07-IMPL: Enhance Context Cache
- Add persistence layer
- Improve LRU algorithm
- Add cache warming support

#### 26-08-IMPL: Enhance Hierarchical Summarizer
- Improve summary quality
- Add more detail levels
- Optimize token estimation

#### 26-09-IMPL: Enhance Vector Offloader
- Add real embedding support
- Improve similarity search
- Add chunk optimization

### Wave 3: Integration & Performance (REFACTOR Phase)

#### 26-10-INT: Integration Tests
```javascript
// tests/integration/context-optimization/pipeline.test.js

describe('Context Optimization Pipeline', () => {
  describe('optimizeContext()', () => {
    test('should optimize large context under budget', async () => {
      const context = {
        files: Array(100).fill({ content: 'x'.repeat(1000) }),
        instructions: 'Important task'
      };
      
      const result = await optimizeContext(context, 5000);
      
      expect(result.optimizedTokens).toBeLessThanOrEqual(5000);
      expect(result.savings).toBeGreaterThan(0);
    });

    test('should apply strategies in order', async () => {
      const context = { data: 'x'.repeat(20000) };
      
      const result = await optimizeContext(context, 5000);
      
      expect(result.strategies).toContain('prioritization');
      // May also include summarization, compression, etc.
    });

    test('should preserve critical information', async () => {
      const context = {
        instructions: 'Critical task',
        data: 'x'.repeat(10000)
      };
      
      const result = await optimizeContext(context, 5000, {
        preserveKey: ['instructions']
      });
      
      expect(result.optimized.instructions).toBe('Critical task');
    });
  });
});
```

#### 26-11-PERF: Performance Benchmarks
```javascript
// tests/performance/context-optimization.bench.js

describe('Context Optimization Performance', () => {
  test('token counting should be fast', () => {
    const content = 'x'.repeat(10000);
    
    const start = Date.now();
    for (let i = 0; i < 100; i++) {
      countTokens(content);
    }
    const duration = Date.now() - start;
    
    expect(duration / 100).toBeLessThan(1); // <1ms per count
  });

  test('cache operations should be instant', () => {
    const start = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      cacheContext(`key${i}`, `value${i}`);
      getCachedContext(`key${i}`);
    }
    
    const duration = Date.now() - start;
    expect(duration / 2000).toBeLessThan(1); // <1ms per op
  });

  test('hierarchical summarization should complete in time budget', async () => {
    const context = { data: 'x'.repeat(50000) };
    
    const start = Date.now();
    await summarizeHierarchically(context, { targetTokens: 5000 });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(1000); // <1s for large context
  });

  test('vector offload should be efficient', async () => {
    const context = { data: 'x'.repeat(10000) };
    
    const start = Date.now();
    await offloadToVector(context);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(100); // <100ms
  });
});
```

## Success Criteria (from ROADMAP)
1. ✅ Hierarchical summarization working - EXISTS, needs tests
2. ✅ Vector offloading implemented - EXISTS, needs tests
3. ⏳ Context-window-as-cache protocol - NEEDS VALIDATION
4. ⏳ Local embedding search - NEEDS ENHANCEMENT
5. ⏳ Large files never fill context - NEEDS VERIFICATION

## Execution Checklist

### Wave 1: Unit Tests
- [ ] Create tests/unit/context-optimization/ directory
- [ ] Write token-counter.test.js
- [ ] Write context-cache.test.js
- [ ] Write hierarchical-summarizer.test.js
- [ ] Write context-compressor.test.js
- [ ] Write vector-offloader.test.js
- [ ] Write context-prioritizer.test.js
- [ ] Run tests (expect failures - RED phase)

### Wave 2: Implementation
- [ ] Enhance token-counter.js
- [ ] Enhance context-cache.js
- [ ] Enhance hierarchical-summarizer.js
- [ ] Enhance context-compressor.js
- [ ] Enhance vector-offloader.js
- [ ] Enhance context-prioritizer.js
- [ ] Run tests (expect passes - GREEN phase)

### Wave 3: Integration & Performance
- [ ] Create integration tests
- [ ] Add performance benchmarks
- [ ] Refactor for optimization
- [ ] Create documentation
- [ ] Final verification

## File Structure
```
lib/context-optimization/
├── index.js                    # Main entry (EXISTS)
├── token-counter.js            # Token counting (EXISTS)
├── context-cache.js            # Caching (EXISTS)
├── hierarchical-summarizer.js  # Telescope method (EXISTS)
├── context-compressor.js       # Compression (EXISTS)
├── vector-offloader.js         # Vector storage (EXISTS)
├── context-prioritizer.js      # Prioritization (EXISTS)
└── README.md                   # Documentation (EXISTS)

tests/unit/context-optimization/
├── token-counter.test.js       # NEW
├── context-cache.test.js       # NEW
├── hierarchical-summarizer.test.js # NEW
├── context-compressor.test.js  # NEW
├── vector-offloader.test.js    # NEW
└── context-prioritizer.test.js # NEW

tests/integration/context-optimization/
└── pipeline.test.js            # NEW
```
