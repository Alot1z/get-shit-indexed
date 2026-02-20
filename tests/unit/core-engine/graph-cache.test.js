/**
 * @fileoverview Tests for graph query cache
 * Part of Phase 50A: Core Engine Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  cachedQuery,
  getCacheStats,
  clearGraphCache
} from '../../../lib/core-engine/codegraph';

describe('graph-cache', () => {
  describe('Task 9: Graph Query Cache', () => {
    beforeEach(() => {
      clearGraphCache();
    });

    it('should cache query results', async () => {
      const result1 = await cachedQuery('find_importers', { target: 'test' });
      const result2 = await cachedQuery('find_importers', { target: 'test' });

      expect(result1).toEqual(result2);

      const stats = getCacheStats();
      expect(stats.hits).toBe(1);
    });

    it('should track cache misses', async () => {
      await cachedQuery('find_importers', { target: 'test1' });
      await cachedQuery('find_importers', { target: 'test2' });

      const stats = getCacheStats();
      expect(stats.misses).toBe(2);
    });

    it('should achieve 50%+ cache hit rate on repeated queries', async () => {
      // Run same queries multiple times
      for (let i = 0; i < 10; i++) {
        await cachedQuery('find_importers', { target: 'gsi:execute-phase' });
      }

      const stats = getCacheStats();
      expect(stats.hitRate).toBeGreaterThan(0.5);
    });

    it('should respect cache TTL', async () => {
      // Query with short TTL
      await cachedQuery('find_importers', { target: 'test' }, { ttl: 100 });

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be a miss now
      await cachedQuery('find_importers', { target: 'test' });

      const stats = getCacheStats();
      expect(stats.misses).toBe(2); // Original + expired
    });

    it('should clear cache completely', async () => {
      await cachedQuery('find_importers', { target: 'test' });
      clearGraphCache();

      const stats = getCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });

    it('should limit cache size', async () => {
      // Add many entries
      for (let i = 0; i < 150; i++) {
        await cachedQuery('find_importers', { target: `test-${i}` });
      }

      const stats = getCacheStats();
      expect(stats.size).toBeLessThanOrEqual(100);
    });

    it('should handle concurrent access', async () => {
      const promises = [];

      for (let i = 0; i < 10; i++) {
        promises.push(cachedQuery('find_importers', { target: 'concurrent' }));
      }

      await Promise.all(promises);

      const stats = getCacheStats();
      expect(stats.hits).toBe(9); // First is miss, rest are hits
    });
  });
});
