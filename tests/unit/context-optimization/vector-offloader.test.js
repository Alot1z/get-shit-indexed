/**
 * Vector Offloader Unit Tests
 * Phase 26-04: Context Optimization Layer
 * 
 * Using Node.js built-in test runner
 */

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const { VectorOffloader } = require('../../../lib/context-optimization/vector-offloader');

describe('VectorOffloader', () => {
  let offloader;

  beforeEach(() => {
    offloader = new VectorOffloader();
  });

  afterEach(() => {
    offloader.clearIndex();
  });

  describe('offload()', () => {
    it('should offload context to vector storage', async () => {
      const context = { data: 'x'.repeat(1000) };
      
      const result = await offloader.offload(context);
      
      assert.ok(result.reference);
      assert.ok(result.reference.id);
      assert.ok(result.retained);
    });

    it('should preserve specified keys', async () => {
      const context = {
        instructions: 'Keep this',
        data: 'Offload this'
      };
      
      const result = await offloader.offload(context, {
        preserveKey: ['instructions']
      });
      
      assert.strictEqual(result.retained.instructions, 'Keep this');
    });

    it('should create chunks', async () => {
      const context = { data: 'x'.repeat(5000) };
      
      const result = await offloader.offload(context);
      
      assert.ok(result.reference.chunkCount > 0);
    });

    it('should track token counts', async () => {
      const context = { data: 'x'.repeat(1000) };
      
      const result = await offloader.offload(context);
      
      assert.ok(result.stats.tokensOffloaded > 0);
      assert.ok(result.stats.tokensRetained > 0);
    });
  });

  describe('retrieve()', () => {
    it('should retrieve by reference ID', async () => {
      const context = { data: 'Test data' };
      const offloaded = await offloader.offload(context);
      
      const retrieved = await offloader.retrieve(offloaded.reference.id);
      
      assert.ok(retrieved.results);
      assert.ok(retrieved.results.length > 0);
    });

    it('should retrieve by similarity', async () => {
      await offloader.offload({ data: 'React hooks tutorial' });
      await offloader.offload({ data: 'TypeScript generics guide' });
      
      const result = await offloader.retrieve('React programming');
      
      assert.ok(result.results);
    });

    it('should respect limit parameter', async () => {
      await offloader.offload({ data: 'Content 1' });
      await offloader.offload({ data: 'Content 2' });
      await offloader.offload({ data: 'Content 3' });
      
      const result = await offloader.retrieve('Content', { limit: 2 });
      
      assert.ok(result.results.length <= 2);
    });
  });

  describe('deleteByReference()', () => {
    it('should delete all chunks for a reference', async () => {
      const context = { data: 'x'.repeat(1000) };
      const offloaded = await offloader.offload(context);
      
      offloader.deleteByReference(offloaded.reference.id);
      
      const retrieved = await offloader.retrieve(offloaded.reference.id);
      assert.strictEqual(retrieved.results.length, 0);
    });
  });

  describe('statistics', () => {
    it('should track offload stats', async () => {
      await offloader.offload({ data: 'Test 1' });
      await offloader.offload({ data: 'Test 2' });
      
      const stats = offloader.getStats();
      
      assert.strictEqual(stats.offloads, 2);
      assert.ok(stats.chunksCreated > 0);
    });
  });

  describe('performance', () => {
    it('should offload quickly', async () => {
      const start = Date.now();
      await offloader.offload({ data: 'x'.repeat(1000) });
      const duration = Date.now() - start;
      
      assert.ok(duration < 50, `Offload took ${duration}ms, expected <50ms`);
    });

    it('should retrieve quickly', async () => {
      await offloader.offload({ data: 'Test content' });
      
      const start = Date.now();
      await offloader.retrieve('Test');
      const duration = Date.now() - start;
      
      assert.ok(duration < 20, `Retrieval took ${duration}ms, expected <20ms`);
    });
  });
});
