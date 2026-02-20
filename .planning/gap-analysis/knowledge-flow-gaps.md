# Knowledge Flow Gaps

**Analysis Date:** 2026-02-20

## Summary
- Flow chains analyzed: 6
- Broken chains: 5
- Missing connections: 4
- Critical gaps: 2

## Expected vs Actual Flows

### Flow 1: pattern-learning → complexity → prompt-enhancer

**Status:** BROKEN (Both segments)

**Segment A: pattern-learning → complexity**
- Expected: Complexity scoring should use learned patterns to improve predictions
- Actual: NO connection exists
- Files: `lib/pattern-learning/index.js` ↔ `lib/complexity/index.js`
- Impact: High - complexity predictions don't benefit from historical patterns
- **TDD Test:** 
  ```javascript
  test('complexity module imports pattern-learning', () => {
    const complexity = require('../lib/complexity');
    expect(complexity.queryPatterns).toBeDefined();
  });
  ```
- **Fix:** Import pattern-learning in `lib/complexity/learning.js` and call `queryPatterns()` in `adaptFromHistory()`

**Segment B: complexity → prompt-enhancer**
- Expected: Prompt enhancer should use complexity thresholds to select modes
- Actual: NO connection exists
- Files: `lib/complexity/index.js` ↔ `lib/prompt-enhancer/index.js`
- Impact: High - prompt enhancement doesn't consider complexity scores
- **TDD Test:**
  ```javascript
  test('prompt-enhancer imports complexity thresholds', () => {
    const enhancer = require('../lib/prompt-enhancer');
    expect(enhancer.THRESHOLDS).toHaveProperty('fromComplexity');
  });
  ```
- **Fix:** Import complexity thresholds in `lib/prompt-enhancer/mode-selector.js` and use in `selectMode()`

---

### Flow 2: reflection → pattern-learning

**Status:** BROKEN (Duplicate storage)

- Expected: Reflection should store extracted patterns in pattern-learning storage
- Actual: Reflection stores to separate location (`.planning/patterns.json`), pattern-learning uses (`.planning/patterns/`)
- Files: 
  - `lib/reflection/patterns.js` stores to: `.planning/patterns.json`
  - `lib/pattern-learning/storage.js` stores to: `.planning/patterns/`
- Impact: Critical - Learned patterns are siloed and not shared
- **TDD Test:**
  ```javascript
  test('reflection stores to pattern-learning storage', async () => {
    const reflection = require('../lib/reflection');
    const patternLearning = require('../lib/pattern-learning');
    
    const pattern = await reflection.PatternExtractor.extractPatterns(mockReflection);
    const stored = await patternLearning.getPatterns('sequences');
    
    expect(stored).toContainEqual(expect.objectContaining({ id: pattern.id }));
  });
  ```
- **Fix:** Modify `lib/reflection/patterns.js` to import and use `lib/pattern-learning/storage.js` instead of local file

---

### Flow 3: prompt-enhancer → thinking

**Status:** BROKEN

- Expected: Prompt enhancer should integrate with thinking orchestrator for intelligent enhancement
- Actual: NO connection exists - prompt-enhancer has its own learning.js that is never used
- Files: 
  - `lib/prompt-enhancer/index.js` does NOT import `lib/prompt-enhancer/learning.js`
  - `lib/prompt-enhancer/index.js` does NOT import `lib/thinking/orchestrator.js`
- Impact: Medium - Enhancement doesn't leverage thinking servers
- **TDD Test:**
  ```javascript
  test('prompt-enhancer uses thinking for complex prompts', async () => {
    const enhancer = require('../lib/prompt-enhancer');
    const result = await enhancer.fullEnhance('complex multi-step task');
    
    expect(result.thinkingContext).toBeDefined();
  });
  ```
- **Fix:** Wire `lib/prompt-enhancer/learning.js` into index.js and integrate with thinking orchestrator

---

### Flow 4: knowledge-hub → all modules

**Status:** BROKEN (Orphaned Module)

- Expected: knowledge-hub should be central hub connecting all knowledge producers and consumers
- Actual: Module is fully designed but NEVER IMPORTED by any other module
- Files:
  - `lib/knowledge-hub/index.js` - exports Producer, Consumer, Store, Flow
  - `lib/knowledge-hub/flow.js` - has `createStandardFlow()` that sets up connections
  - NO imports of knowledge-hub found outside of lib/knowledge-hub/
- Impact: Critical - Entire knowledge architecture is unused
- **TDD Test:**
  ```javascript
  test('knowledge-hub is initialized during GSI startup', () => {
    const gsi = require('../lib/gsi-integration');
    expect(gsi.knowledgeFlow).toBeDefined();
    expect(gsi.knowledgeFlow.getStatus().producerCount).toBeGreaterThan(0);
  });
  ```
- **Fix:** 
  1. Create `lib/gsi-knowledge-init.js` that calls `KnowledgeFlow.createStandardFlow()`
  2. Import in main GSI entry point
  3. Wire actual modules to producers/consumers

---

### Flow 5: context-optimization → prompt-enhancer

**Status:** BROKEN

- Expected: Prompt enhancer should use token counting to optimize enhancement size
- Actual: NO connection exists - prompt-enhancer has no token awareness
- Files:
  - `lib/context-optimization/index.js` - exports token counting
  - `lib/prompt-enhancer/index.js` - does NOT import context-optimization
- Impact: Medium - Enhancement may exceed context limits
- **TDD Test:**
  ```javascript
  test('prompt-enhancer counts tokens before enhancing', () => {
    const enhancer = require('../lib/prompt-enhancer');
    const result = enhancer.analyzePrompt('test prompt');
    
    expect(result.tokenCount).toBeDefined();
  });
  ```
- **Fix:** Import token counter in prompt-enhancer and check token limits before enhancement

---

### Flow 6: thinking ↔ pattern-learning

**Status:** CONNECTED (Working)

- Expected: Thinking orchestrator uses pattern predictions and records operations
- Actual: WORKING - bidirectional connection
- Files: `lib/thinking/orchestrator.js` imports and uses `lib/pattern-learning/predictor.js` and `lib/pattern-learning/loop.js`
- This is the ONLY working knowledge flow in the codebase

---

## Connection Matrix

| Source | Target | Status | Gap Type | TDD Test Exists |
|--------|--------|--------|----------|-----------------|
| pattern-learning | complexity | BROKEN | Missing import | YES |
| complexity | prompt-enhancer | BROKEN | Missing import | YES |
| reflection | pattern-learning | BROKEN | Duplicate storage | YES |
| prompt-enhancer | thinking | BROKEN | Unused module | YES |
| knowledge-hub | ALL | BROKEN | Orphaned module | YES |
| context-optimization | prompt-enhancer | BROKEN | Missing import | YES |
| thinking | pattern-learning | CONNECTED | None | N/A |

---

## Orphaned Modules

### 1. lib/knowledge-hub/ (5 files, fully implemented)

**Issue:** Complete implementation with no consumers

**Files:**
- `lib/knowledge-hub/index.js`
- `lib/knowledge-hub/producer.js` - Has PatternLearningProducer, DebugThinkingProducer
- `lib/knowledge-hub/consumer.js` - Has PromptEnhancerConsumer, ComplexityPredictorConsumer
- `lib/knowledge-hub/store.js`
- `lib/knowledge-hub/flow.js` - Has `createStandardFlow()` ready to use

**Integration Points Designed but Unused:**
- PatternLearningProducer → never instantiated
- PromptEnhancerConsumer → never instantiated
- ComplexityPredictorConsumer → never instantiated
- KnowledgeFlow.createStandardFlow() → never called

---

### 2. lib/prompt-enhancer/learning.js (335 lines, never imported)

**Issue:** Complete learning system with no integration

**Exports:**
- `recordEnhancement()` - never called
- `queryEnhancementPatterns()` - never called
- `adaptEnhancementThreshold()` - never called

**Fix:** Import in `lib/prompt-enhancer/index.js` and use in enhancement pipeline

---

## Storage Fragmentation

| Module | Storage Location | Type |
|--------|------------------|------|
| pattern-learning | `.planning/patterns/` | Directory with JSON files |
| reflection | `.planning/patterns.json` | Single JSON file |
| complexity/learning | `.planning/complexity-history.json` | Single JSON file |
| prompt-enhancer/learning | `.planning/enhancement-history.json` | Single JSON file |
| knowledge-hub/store | In-memory (designed for persistence) | Memory |

**Issue:** No unified knowledge storage - each module has its own format and location

**TDD Test for Unified Storage:**
```javascript
test('all modules store to unified knowledge-hub', async () => {
  const hub = require('../lib/knowledge-hub');
  const flow = hub.KnowledgeFlow.createStandardFlow();
  
  // Trigger pattern from reflection
  await flow.store.store({ type: 'pattern', source: 'reflection', data: {} });
  
  // Query from pattern-learning
  const results = await flow.query({ type: 'pattern' });
  expect(results.length).toBe(1);
});
```

---

## Integration Recommendations

### Priority 1: Critical (Fix Immediately)

1. **Wire knowledge-hub into GSI initialization**
   - Create `lib/gsi-knowledge-init.js`
   - Call `KnowledgeFlow.createStandardFlow()`
   - Connect actual modules as producers/consumers
   - Files: `lib/gsi-integration/index.js`

2. **Unify pattern storage**
   - Modify `lib/reflection/patterns.js` to use `lib/pattern-learning/storage.js`
   - Remove `.planning/patterns.json` usage
   - Files: `lib/reflection/patterns.js`

### Priority 2: High (Fix Soon)

3. **Connect complexity → prompt-enhancer**
   - Import complexity thresholds in mode-selector
   - Use complexity scores for mode selection
   - Files: `lib/prompt-enhancer/mode-selector.js`

4. **Connect pattern-learning → complexity**
   - Import pattern-learning in complexity/learning.js
   - Use pattern predictions in threshold adaptation
   - Files: `lib/complexity/learning.js`

### Priority 3: Medium (Fix Eventually)

5. **Wire prompt-enhancer/learning.js**
   - Import learning.js in prompt-enhancer index
   - Call recordEnhancement() after each enhancement
   - Files: `lib/prompt-enhancer/index.js`

6. **Add context-optimization to prompt-enhancer**
   - Import token counter
   - Check token limits before enhancement
   - Files: `lib/prompt-enhancer/index.js`

---

## TDD Test Suite for Knowledge Flow

```javascript
// tests/integration/knowledge-flow.test.js

describe('Knowledge Flow Integration', () => {
  
  describe('Chain: pattern-learning → complexity', () => {
    test('complexity uses pattern predictions', async () => {
      const complexity = require('../../lib/complexity');
      const patterns = await complexity.queryPatterns({ pattern: 'test' });
      expect(patterns).toBeDefined();
    });
  });
  
  describe('Chain: complexity → prompt-enhancer', () => {
    test('prompt-enhancer uses complexity thresholds', () => {
      const enhancer = require('../../lib/prompt-enhancer');
      const analysis = enhancer.analyzePrompt('complex task');
      expect(analysis.complexityScore).toBeDefined();
    });
  });
  
  describe('Chain: reflection → pattern-learning', () => {
    test('reflection stores to pattern-learning', async () => {
      const reflection = require('../../lib/reflection');
      const patternLearning = require('../../lib/pattern-learning');
      
      // This should use pattern-learning storage
      const extractor = new reflection.PatternExtractor();
      const patternsBefore = await patternLearning.getAllPatterns();
      
      // Extract and store pattern
      await extractor.extractPatterns(mockReflection);
      
      const patternsAfter = await patternLearning.getAllPatterns();
      expect(patternsAfter.length).toBeGreaterThan(patternsBefore.length);
    });
  });
  
  describe('Chain: knowledge-hub integration', () => {
    test('knowledge-hub is initialized', () => {
      // This requires gsi-integration to wire knowledge-hub
      const gsi = require('../../lib/gsi-integration');
      expect(gsi.knowledgeFlow).toBeDefined();
    });
    
    test('producers emit knowledge', (done) => {
      const { KnowledgeFlow } = require('../../lib/knowledge-hub');
      const flow = KnowledgeFlow.createStandardFlow();
      
      flow.on('flow', (data) => {
        expect(data.knowledge).toBeDefined();
        done();
      });
      
      // Trigger producer
      const producer = flow.producers.get('pattern-learning');
      producer.emitPattern('test-pattern', { code: 'test' });
    });
    
    test('consumers receive knowledge', (done) => {
      const { KnowledgeFlow } = require('../../lib/knowledge-hub');
      const flow = KnowledgeFlow.createStandardFlow();
      
      const consumer = flow.consumers.get('prompt-enhancer');
      consumer.on('processed', (knowledge) => {
        expect(knowledge.type).toBe('pattern');
        done();
      });
      
      // Trigger producer
      const producer = flow.producers.get('pattern-learning');
      producer.emitPattern('test-pattern', { code: 'test' });
    });
  });
  
  describe('Chain: context-optimization → prompt-enhancer', () => {
    test('prompt-enhancer counts tokens', () => {
      const enhancer = require('../../lib/prompt-enhancer');
      const analysis = enhancer.analyzePrompt('test prompt');
      expect(analysis.tokenCount).toBeDefined();
    });
  });
});
```

---

## Architecture Diagram (Current vs Expected)

### Current State (Fragmented)

```
pattern-learning ──────────► [isolated storage]
complexity ─────────────────► [isolated storage]
reflection ─────────────────► [isolated storage]
prompt-enhancer ────────────► [isolated storage]
thinking ◄──────────────────► pattern-learning (ONLY CONNECTION)

knowledge-hub ──────────────► [NOT CONNECTED]
```

### Expected State (Unified)

```
pattern-learning ──┐
complexity ─────────┼──► knowledge-hub ───► prompt-enhancer
reflection ─────────┤         │                │
validation ─────────┘         │                ▼
                         ┌────┴────┐      thinking
                         │ store   │
                         └─────────┘
```

---

*Knowledge flow gap analysis: 2026-02-20*
*GSI Gap Explorer Agent*
