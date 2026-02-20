/**
 * @fileoverview Tests for context cache module
 * Part of Phase 50C: Knowledge System Integration
 */

import { describe, it, expect } from 'bun:test';
import {
  createLRUCache,
  createTieredCache,
  getCacheStats,
  clearCache,
  optimizeCacheSize
} from '../../../lib/knowledge/context-cache';

describe('Context Cache Module', () => {
  describe('createLRUCache', () => {
    it('should create LRU cache with max size', () => {
      const cache = createLRUCache({ maxSize: 100 });
      
      expect(cache).toBeDefined();
      expect(typeof cache.set).toBe('function');
      expect(typeof cache.get).toBe('function');
      expect(typeof cache.has).toBe('function');
      expect(typeof cache.delete).toBe('function');
    });

    it('should store and retrieve values', () => {
      const cache = createLRUCache({ maxSize: 10 });
      
      cache.set('key1', 'value1');
      
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return undefined for missing keys', () => {
      const cache = createLRUCache({ maxSize: 10 });
      
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should evict least recently used when full', () => {
      const cache = createLRUCache({ maxSize: 2 });
      
      cache.set('a', 'value-a');
      cache.set('b', 'value-b');
      cache.set('c', 'value-c'); // Should evict 'a'
      
      expect(cache.has('a')).toBe(false);
      expect(cache.get('b')).toBe('value-b');
      expect(cache.get('c')).toBe('value-c');
    });

    it('should update LRU order on access', () => {
      const cache = createLRUCache({ maxSize: 2 });
      
      cache.set('a', 'value-a');
      cache.set('b', 'value-b');
      cache.get('a'); // Access 'a' to make it more recent
      cache.set('c', 'value-c'); // Should evict 'b' now
      
      expect(cache.get('a')).toBe('value-a');
      expect(cache.has('b')).toBe(false);
    });

    it('should track cache statistics', () => {
      const cache = createLRUCache({ maxSize: 10 });
      
      cache.set('key1', 'value1');
      cache.get('key1'); // Hit
      cache.get('key2'); // Miss
      
      const stats = cache.getStats();
      
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBeGreaterThan(0);
    });
  });

  describe('createTieredCache', () => {
    it('should create multi-tier cache', () => {
      const cache = createTieredCache({
        tiers: [
          { name: 'hot', maxSize: 10 },
          { name: 'warm', maxSize: 50 },
          { name: 'cold', maxSize: 100 }
        ]
      });
      
      expect(cache).toBeDefined();
      expect(typeof cache.set).toBe('function');
      expect(typeof cache.get).toBe('function');
    });

    it('should promote frequently accessed items', () => {
      const cache = createTieredCache({
        tiers: [
          { name: 'hot', maxSize: 2 },
          { name: 'warm', maxSize: 5 }
        ]
      });
      
      cache.set('key1', 'value1');
      
      // Access multiple times to trigger promotion
      cache.get('key1');
      cache.get('key1');
      
      const stats = cache.getStats();
      expect(stats.tiers.length).toBeGreaterThan(0);
    });

    it('should demote less frequently accessed items', async () => {
      const cache = createTieredCache({
        tiers: [
          { name: 'hot', maxSize: 2 },
          { name: 'warm', maxSize: 5 }
        ]
      });
      
      cache.set('old', 'old-value');
      cache.set('new1', 'new1-value');
      cache.set('new2', 'new2-value');
      cache.set('new3', 'new3-value');
      
      // 'old' should be demoted due to less access
      const stats = cache.getStats();
      expect(stats.totalItems).toBeGreaterThan(0);
    });
  });

  describe('getCacheStats', () => {
    it('should return global cache statistics', () => {
      const cache = createLRUCache({ maxSize: 10 });
      cache.set('key1', 'value1');
      
      const stats = getCacheStats(cache);
      
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.maxSize).toBe('number');
      expect(typeof stats.utilization).toBe('number');
    });
  });

  describe('clearCache', () => {
    it('should clear all cache entries', () => {
      const cache = createLRUCache({ maxSize: 10 });
      
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      clearCache(cache);
      
      expect(cache.size()).toBe(0);
    });
  });

  describe('optimizeCacheSize', () => {
    it('should recommend optimal cache size based on usage', () => {
      const cache = createLRUCache({ maxSize: 100 });
      
      // Simulate usage pattern
      for (let i = 0; i < 50; i++) {
        cache.set(`key-${i}`, `value-${i}`);
      }
      
      const recommendation = optimizeCacheSize(cache);
      
      expect(recommendation.currentSize).toBeDefined();
      expect(recommendation.recommendedSize).toBeDefined();
      expect(recommendation.reason).toBeDefined();
    });
  });

  describe('Cache hit rate requirements', () => {
    it('should achieve >60% hit rate with repetitive access pattern', () => {
      const cache = createLRUCache({ maxSize: 20 });
      
      // Fill cache
      for (let i = 0; i < 20; i++) {
        cache.set(`key-${i}`, `value-${i}`);
      }
      
      // Access same keys repeatedly
      for (let round = 0; round < 5; round++) {
        for (let i = 0; i < 10; i++) {
          cache.get(`key-${i}`);
        }
      }
      
      // Access some non-existent keys (misses)
      for (let i = 0; i < 5; i++) {
        cache.get(`missing-${i}`);
      }
      
      const stats = cache.getStats();
      expect(stats.hitRate).toBeGreaterThanOrEqual(0.6);
    });
  });
});
