// tests/distribution/delta-compress.test.ts
// Phase 50E: Distribution Layer - Delta Compression Tests (TDD RED Phase)
import { describe, it, expect } from 'bun:test';
import { DeltaCompressor, DeltaResult } from '../../lib/distribution/delta-compress';

describe('DeltaCompressor', () => {
  describe('delta compression', () => {
    it('should create delta between two versions', async () => {
      const compressor = new DeltaCompressor();
      const v1 = 'Hello World!';
      const v2 = 'Hello Universe!';
      
      const delta = await compressor.createDelta(v1, v2);
      
      expect(delta.changes).toBeDefined();
      expect(delta.additions).toBeGreaterThan(0);
    });

    it('should apply delta to reconstruct content', async () => {
      const compressor = new DeltaCompressor();
      const v1 = 'Original content here';
      const v2 = 'Original content there';
      
      const delta = await compressor.createDelta(v1, v2);
      const reconstructed = await compressor.applyDelta(v1, delta);
      
      expect(reconstructed).toBe(v2);
    });

    it('should produce delta smaller than full content', async () => {
      const compressor = new DeltaCompressor();
      const v1 = 'a'.repeat(1000) + 'old' + 'b'.repeat(1000);
      const v2 = 'a'.repeat(1000) + 'new' + 'b'.repeat(1000);
      
      const delta = await compressor.createDelta(v1, v2);
      
      expect(delta.size).toBeLessThan(v2.length);
    });

    it('should keep delta updates under 5MB', async () => {
      const compressor = new DeltaCompressor();
      const v1 = 'x'.repeat(10 * 1024 * 1024); // 10MB
      const v2 = 'y'.repeat(10 * 1024 * 1024); // 10MB changed
      
      const delta = await compressor.createDelta(v1, v2);
      
      expect(delta.size).toBeLessThan(5 * 1024 * 1024);
    });

    it('should handle binary deltas', async () => {
      const compressor = new DeltaCompressor();
      const v1 = Buffer.from([0, 1, 2, 3, 4, 5]).toString('binary');
      const v2 = Buffer.from([0, 1, 2, 9, 4, 5]).toString('binary');
      
      const delta = await compressor.createDelta(v1, v2);
      const reconstructed = await compressor.applyDelta(v1, delta);
      
      expect(reconstructed).toBe(v2);
    });
  });
});
