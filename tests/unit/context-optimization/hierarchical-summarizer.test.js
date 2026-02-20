/**
 * Hierarchical Summarizer Unit Tests
 * Phase 26-03: Context Optimization Layer
 * 
 * Using Node.js built-in test runner
 */

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const { HierarchicalSummarizer } = require('../../../lib/context-optimization/hierarchical-summarizer');

describe('HierarchicalSummarizer', () => {
  let summarizer;

  beforeEach(() => {
    summarizer = new HierarchicalSummarizer({ useThinkingServer: false });
  });

  afterEach(() => {
    summarizer.clearCache();
  });

  describe('summarize()', () => {
    it('should create multiple summary levels', async () => {
      const context = {
        files: ['file1.js', 'file2.js', 'file3.js'],
        content: 'Long content here...'
      };
      
      const result = await summarizer.summarize(context);
      
      assert.ok(result.levels);
      assert.ok(Object.keys(result.levels).length > 0);
    });

    it('should preserve important information', async () => {
      const context = {
        error: 'Critical error occurred',
        data: 'Normal data'
      };
      
      const result = await summarizer.summarize(context);
      
      const hasError = Object.values(result.levels).some(level => 
        level.summary.toLowerCase().includes('error')
      );
      assert.ok(hasError);
    });

    it('should support drill-down navigation', async () => {
      const result = await summarizer.summarize({ content: 'Test' });
      
      assert.ok(result.navigation);
    });

    it('should include metadata', async () => {
      const result = await summarizer.summarize({ content: 'Test' });
      
      assert.ok(result.metadata);
      assert.ok(result.metadata.createdAt);
    });

    it('should handle empty content', async () => {
      const result = await summarizer.summarize({ content: '' });
      
      assert.ok(result);
    });
  });

  describe('caching', () => {
    it('should cache summaries', async () => {
      const context = { data: 'test' };
      
      await summarizer.summarize(context);
      const statsBefore = summarizer.getStats();
      
      await summarizer.summarize(context);
      const statsAfter = summarizer.getStats();
      
      assert.ok(statsAfter.cacheHits > statsBefore.cacheHits);
    });
  });

  describe('statistics', () => {
    it('should track summarization stats', async () => {
      await summarizer.summarize({ content: 'Test 1' });
      await summarizer.summarize({ content: 'Test 2' });
      
      const stats = summarizer.getStats();
      
      assert.strictEqual(stats.summariesCreated, 2);
    });
  });

  describe('performance', () => {
    it('should summarize quickly for small content', async () => {
      const start = Date.now();
      await summarizer.summarize({ content: 'Small content' });
      const duration = Date.now() - start;
      
      assert.ok(duration < 100, `Summarization took ${duration}ms, expected <100ms`);
    });
  });
});
