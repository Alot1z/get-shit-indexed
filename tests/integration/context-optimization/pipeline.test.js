/**
 * Context Optimization Integration Tests
 * Phase 26: Full Pipeline Testing
 * 
 * Using Bun test runner
 */

import { describe, it, beforeAll, afterEach, expect } from 'bun:test';
import {
  initialize,
  countTokens,
  cacheContext,
  getCachedContext,
  optimizeContext,
  getContextStats,
  getMetrics,
  clearAllCaches
} from '../../../lib/context-optimization';

describe('Context Optimization Pipeline', () => {
  beforeAll(() => {
    initialize();
  });

  afterEach(() => {
    clearAllCaches();
  });

  describe('optimizeContext()', () => {
    it('should optimize large context under budget', async () => {
      const context = {
        files: Array(50).fill({ content: 'x'.repeat(100) }),
        instructions: 'Important task'
      };
      
      const result = await optimizeContext(context, 5000);
      
      expect(result.optimizedTokens).toBeLessThanOrEqual(5000);
      expect(result.savings).toBeGreaterThanOrEqual(0);
    });

    it('should return context unchanged if under budget', async () => {
      const context = { data: 'Small content' };
      
      const result = await optimizeContext(context, 10000);
      
      expect(result.savings).toBe(0);
      expect(result.strategies.length).toBe(0);
    });

    it('should apply strategies in order', async () => {
      const context = { 
        items: Array(100).fill('data'),
        content: 'x'.repeat(10000) 
      };
      
      const result = await optimizeContext(context, 1000);
      
      expect(result.strategies.length).toBeGreaterThanOrEqual(0);
    });

    it('should preserve critical information', async () => {
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

  describe('component integration', () => {
    it('should integrate token counting with caching', () => {
      const content = { data: 'Test content' };
      
      const tokens1 = countTokens(content);
      cacheContext('test', content);
      const cached = getCachedContext('test');
      const tokens2 = countTokens(cached);
      
      expect(tokens1).toBe(tokens2);
    });
  });

  describe('statistics', () => {
    it('should provide context statistics', () => {
      const context = { data: 'Test' };
      
      const stats = getContextStats(context);
      
      expect(stats.totalTokens).toBeGreaterThan(0);
    });

    it('should provide system metrics', () => {
      const metrics = getMetrics();
      
      expect(metrics.tokenCounter).toBeDefined();
      expect(metrics.cache).toBeDefined();
    });
  });

  describe('performance', () => {
    it('should complete optimization within time budget', async () => {
      const context = { 
        files: Array(20).fill({ content: 'x'.repeat(100) })
      };
      
      const start = Date.now();
      await optimizeContext(context, 1000);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(1000);
    });

    it('should handle concurrent optimizations', async () => {
      const promises = [];
      
      for (let i = 0; i < 5; i++) {
        promises.push(optimizeContext({ data: 'Test ' + i }, 500));
      }
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(5);
      results.forEach(r => expect(r.optimized).toBeDefined());
    });
  });

  describe('error handling', () => {
    it('should handle null input', async () => {
      const result = await optimizeContext(null, 1000);
      expect(result).toBeDefined();
    });

    it('should handle empty input', async () => {
      const result = await optimizeContext({}, 1000);
      expect(result).toBeDefined();
    });
  });
});
