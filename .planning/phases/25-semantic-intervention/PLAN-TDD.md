# Phase 25: Semantic Intervention Engine - TDD Execution Plan

## Overview
Implement Heretic-API style semantic intervention with parallel branching and refusal detection.

## Existing Infrastructure
- `lib/semantic-intervention/` - Core module EXISTS
- `lib/semantic-intervention/semantic-analyzer.js` - EXISTS
- `lib/semantic-intervention/parallel-brancher.js` - EXISTS
- `lib/semantic-intervention/refusal-detector.js` - EXISTS
- `lib/semantic-intervention/intervention-trigger.js` - EXISTS
- `lib/semantic-intervention/intervention-logger.js` - EXISTS

## Gap Analysis
1. **Missing Unit Tests** - No tests exist for semantic-intervention modules
2. **Integration Tests** - No end-to-end pipeline tests
3. **Performance Benchmarks** - No performance testing
4. **Documentation** - README exists but needs enhancement

## TDD Execution Waves

### Wave 1: Unit Tests (RED Phase)

#### 25-01-TEST: Semantic Analyzer Tests
```javascript
// tests/unit/semantic-intervention/semantic-analyzer.test.js

describe('SemanticAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new SemanticAnalyzer();
  });

  describe('analyze()', () => {
    test('should classify implementation intent', async () => {
      const result = await analyzer.analyze('Create a new user authentication system');
      expect(result.intent).toBe('implementation');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    test('should classify modification intent', async () => {
      const result = await analyzer.analyze('Refactor the database connection handler');
      expect(result.intent).toBe('modification');
    });

    test('should classify analysis intent', async () => {
      const result = await analyzer.analyze('Explain how the caching system works');
      expect(result.intent).toBe('analysis');
    });

    test('should detect complexity level', async () => {
      const result = await analyzer.analyze('Build a microservices architecture with API gateway');
      expect(result.complexity).toBeGreaterThan(50);
    });

    test('should extract technical terms', async () => {
      const result = await analyzer.analyze('Implement React hooks with TypeScript');
      expect(result.technicalTerms).toContain('React');
      expect(result.technicalTerms).toContain('TypeScript');
    });
  });

  describe('complexity scoring', () => {
    test('should score simple prompts low', async () => {
      const result = await analyzer.analyze('Fix typo in README');
      expect(result.complexity).toBeLessThan(20);
    });

    test('should score complex prompts high', async () => {
      const result = await analyzer.analyze('Design and implement a distributed caching layer with Redis cluster support and automatic failover');
      expect(result.complexity).toBeGreaterThan(70);
    });
  });
});
```

#### 25-02-TEST: Parallel Brancher Tests
```javascript
// tests/unit/semantic-intervention/parallel-brancher.test.js

describe('ParallelBrancher', () => {
  let brancher;

  beforeEach(() => {
    brancher = new ParallelBrancher();
  });

  describe('createBranches()', () => {
    test('should create multiple reasoning paths', async () => {
      const prompt = 'Build a secure authentication system';
      const analysis = { complexity: 60, riskScore: 50 };
      
      const result = await brancher.createBranches(prompt, analysis);
      
      expect(result.paths).toBeDefined();
      expect(result.paths.length).toBeGreaterThanOrEqual(2);
    });

    test('should include academic framing branch', async () => {
      const result = await brancher.createBranches('Implement OAuth2', { complexity: 50 });
      
      const academicBranch = result.paths.find(p => p.type === 'academic');
      expect(academicBranch).toBeDefined();
      expect(academicBranch.prompt).toContain('theoretical');
    });

    test('should include engineering framing branch', async () => {
      const result = await brancher.createBranches('Implement OAuth2', { complexity: 50 });
      
      const engineeringBranch = result.paths.find(p => p.type === 'engineering');
      expect(engineeringBranch).toBeDefined();
      expect(engineeringBranch.prompt).toContain('observability');
    });

    test('should include decomposition branch for complex prompts', async () => {
      const result = await brancher.createBranches('Build entire backend system', { complexity: 80 });
      
      const decompositionBranch = result.paths.find(p => p.type === 'decomposition');
      expect(decompositionBranch).toBeDefined();
    });

    test('should assign confidence scores to each branch', async () => {
      const result = await brancher.createBranches('Test prompt', { complexity: 50 });
      
      for (const branch of result.paths) {
        expect(branch.confidence).toBeDefined();
        expect(branch.confidence).toBeGreaterThanOrEqual(0);
        expect(branch.confidence).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('branch selection', () => {
    test('should select highest confidence branch by default', () => {
      const branches = {
        paths: [
          { type: 'academic', confidence: 0.7 },
          { type: 'engineering', confidence: 0.85 },
          { type: 'decomposition', confidence: 0.75 }
        ]
      };
      
      const selected = brancher.selectBestBranch(branches);
      expect(selected.type).toBe('engineering');
    });
  });
});
```

#### 25-03-TEST: Refusal Detector Tests
```javascript
// tests/unit/semantic-intervention/refusal-detector.test.js

describe('RefusalDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new RefusalDetector();
  });

  describe('detect()', () => {
    test('should detect direct refusals', async () => {
      const response = 'I cannot help with that request as it violates our policy.';
      const result = await detector.detect(response);
      
      expect(result.isRefusal).toBe(true);
      expect(result.type).toBe('direct');
    });

    test('should detect ambiguous responses', async () => {
      const response = 'I\'m not sure what you mean. Could you clarify?';
      const result = await detector.detect(response);
      
      expect(result.isRefusal).toBe(true);
      expect(result.type).toBe('ambiguous');
    });

    test('should detect blocked responses', async () => {
      const response = 'The request was blocked due to access restrictions.';
      const result = await detector.detect(response);
      
      expect(result.isRefusal).toBe(true);
      expect(result.type).toBe('blocked');
    });

    test('should detect partial responses', async () => {
      const response = 'I could only partially complete the task due to limitations.';
      const result = await detector.detect(response);
      
      expect(result.isRefusal).toBe(true);
      expect(result.type).toBe('partial');
    });

    test('should not detect normal responses as refusals', async () => {
      const response = 'Here is the solution to your problem...';
      const result = await detector.detect(response);
      
      expect(result.isRefusal).toBe(false);
    });
  });

  describe('alternatives', () => {
    test('should provide alternative approaches for refusals', async () => {
      const response = 'I cannot provide that information.';
      const result = await detector.detect(response);
      
      expect(result.alternatives).toBeDefined();
      expect(result.alternatives.length).toBeGreaterThan(0);
    });

    test('should recommend best alternative', async () => {
      const response = 'I cannot help with that.';
      const result = await detector.detect(response);
      
      expect(result.recommendation).toBeDefined();
      expect(result.recommendation.approach).toBeDefined();
    });
  });

  describe('metrics', () => {
    test('should track detection statistics', async () => {
      await detector.detect('I cannot help');
      await detector.detect('I\'m not sure');
      await detector.detect('Normal response');
      
      const stats = detector.getStats();
      
      expect(stats.totalDetections).toBe(2);
      expect(stats.byType.direct).toBe(1);
      expect(stats.byType.ambiguous).toBe(1);
    });
  });
});
```

### Wave 2: Implementation Enhancement (GREEN Phase)

#### 25-04-IMPL: Enhance Semantic Analyzer
- Add more intent classification types
- Improve technical term extraction
- Add framework detection
- Enhance complexity scoring algorithm

#### 25-05-IMPL: Enhance Parallel Brancher
- Add self-consistency scoring
- Improve branch prompt templates
- Add branch result merging
- Implement branch validation

#### 25-06-IMPL: Enhance Refusal Detector
- Add more refusal patterns
- Improve alternative generation
- Add success rate tracking
- Implement learning from feedback

### Wave 3: Integration & Performance (REFACTOR Phase)

#### 25-07-INT: Integration Tests
```javascript
// tests/integration/semantic-intervention/pipeline.test.js

describe('Semantic Intervention Pipeline', () => {
  describe('runInterventionPipeline()', () => {
    test('should run full pipeline for complex prompt', async () => {
      const result = await runInterventionPipeline(
        'Design a scalable microservices architecture',
        { enableBranching: true }
      );
      
      expect(result.analysis).toBeDefined();
      expect(result.branches).toBeDefined();
      expect(result.recommendation).toBeDefined();
    });

    test('should handle refusal and provide alternatives', async () => {
      const result = await runInterventionPipeline(
        'Generate malicious code',
        {}
      );
      
      expect(result.intervention).toBe(true);
      expect(result.alternatives).toBeDefined();
    });

    test('should complete pipeline within time budget', async () => {
      const start = Date.now();
      
      await runInterventionPipeline('Simple task', {});
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // 100ms budget
    });
  });
});
```

#### 25-08-PERF: Performance Benchmarks
```javascript
// tests/performance/semantic-intervention.bench.js

describe('Semantic Intervention Performance', () => {
  test('semantic analysis should be fast', async () => {
    const start = Date.now();
    
    for (let i = 0; i < 100; i++) {
      await analyze('Test prompt ' + i);
    }
    
    const duration = Date.now() - start;
    expect(duration / 100).toBeLessThan(5); // <5ms per analysis
  });

  test('parallel branching should be efficient', async () => {
    const start = Date.now();
    
    await createBranches('Complex prompt', { complexity: 80 });
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(50); // <50ms for branching
  });

  test('refusal detection should be instant', async () => {
    const start = Date.now();
    
    await detectRefusal('I cannot help with that');
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(10); // <10ms for detection
  });
});
```

## Success Criteria (from ROADMAP)
1. ✅ Semantic brancher generates prompt variations - EXISTS, needs tests
2. ✅ Parallel sampling sends multiple rewrites - EXISTS, needs tests
3. ✅ Soft-refusal detection identifies responses - EXISTS, needs tests
4. ⏳ Response scoring and merge selects best - NEEDS ENHANCEMENT
5. ⏳ Graceful degradation on failures - NEEDS IMPLEMENTATION

## Execution Checklist

### Wave 1: Unit Tests
- [ ] Create tests/unit/semantic-intervention/ directory
- [ ] Write semantic-analyzer.test.js
- [ ] Write parallel-brancher.test.js
- [ ] Write refusal-detector.test.js
- [ ] Write intervention-trigger.test.js
- [ ] Run tests (expect failures - RED phase)

### Wave 2: Implementation
- [ ] Enhance semantic-analyzer.js based on test failures
- [ ] Enhance parallel-brancher.js with self-consistency
- [ ] Enhance refusal-detector.js with more patterns
- [ ] Add response scoring and merge functionality
- [ ] Implement graceful degradation
- [ ] Run tests (expect passes - GREEN phase)

### Wave 3: Integration & Performance
- [ ] Create integration tests
- [ ] Add performance benchmarks
- [ ] Refactor for optimization
- [ ] Create documentation
- [ ] Final verification

## File Structure
```
lib/semantic-intervention/
├── index.js                    # Main entry (EXISTS)
├── semantic-analyzer.js        # Core analyzer (EXISTS)
├── parallel-brancher.js        # Branch generator (EXISTS)
├── refusal-detector.js         # Refusal detection (EXISTS)
├── intervention-trigger.js     # Trigger system (EXISTS)
├── intervention-logger.js      # Logging (EXISTS)
├── response-scorer.js          # NEW: Score and merge responses
└── README.md                   # Documentation (EXISTS)

tests/unit/semantic-intervention/
├── semantic-analyzer.test.js   # NEW
├── parallel-brancher.test.js   # NEW
├── refusal-detector.test.js    # NEW
├── intervention-trigger.test.js # NEW
└── response-scorer.test.js     # NEW

tests/integration/semantic-intervention/
└── pipeline.test.js            # NEW
```
