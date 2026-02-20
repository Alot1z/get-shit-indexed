/**
 * Context Cache Unit Tests
 * Phase 26-02: Context Optimization Layer
 * 
 * Using Node.js built-in test runner
 */

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const { ContextCache } = require('../../../lib/context-optimization/context-cache');

describe('ContextCache', () => {
  let cache;

  beforeEach(() => {
    cache = new ContextCache({ maxSize: 10000 });
  });

  afterEach(() => {
    cache.clear();
  });

  describe('set() and get()', () => {
    it('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      
      assert.strictEqual(cache.get('key1'), 'value1');
    });

    it('should handle complex objects', () => {
      const obj = { nested: { data: [1, 2, 3] } };
      cache.set('complex', obj);
      
      assert.deepStrictEqual(cache.get('complex'), obj);
    });

    it('should return undefined for missing keys', () => {
      assert.strictEqual(cache.get('nonexistent'), undefined);
    });
  });

  describe('TTL support', () => {
    it('should expire entries after TTL', async () => {
      cache.set('ttl-key', 'value', { ttl: 100 });
      
      assert.strictEqual(cache.get('ttl-key'), 'value');
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      assert.strictEqual(cache.get('ttl-key'), undefined);
    });
  });

  describe('has()', () => {
    it('should return true for existing keys', () => {
      cache.set('key', 'value');
      assert.strictEqual(cache.has('key'), true);
    });

    it('should return false for missing keys', () => {
      assert.strictEqual(cache.has('missing'), false);
    });
  });

  describe('delete()', () => {
    it('should remove entries', () => {
      cache.set('key', 'value');
      cache.delete('key');
      
      assert.strictEqual(cache.get('key'), undefined);
    });
  });

  describe('clear()', () => {
    it('should remove all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      
      assert.strictEqual(cache.size(), 0);
    });
  });

  describe('statistics', () => {
    it('should track hit rate', () => {
      cache.set('key', 'value');
      cache.get('key');
      cache.get('key');
      cache.get('missing');
      
      const stats = cache.getStats();
      
      assert.strictEqual(stats.hits, 2);
      assert.strictEqual(stats.misses, 1);
    });

    it('should track size', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      assert.strictEqual(cache.size(), 2);
    });
  });

  describe('performance', () => {
    it('should perform operations quickly', () => {
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        cache.set(`key${i}`, `value${i}`);
        cache.get(`key${i}`);
      }
      
      const duration = Date.now() - start;
      assert.ok(duration < 100, `Operations took ${duration}ms, expected <100ms`);
    });
  });
});
