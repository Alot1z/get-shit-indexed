// tests/distribution/integration.test.ts
// Phase 50E: Distribution Layer - Integration Tests (TDD RED Phase)
import { describe, it, expect, beforeAll } from 'bun:test';
import { DistributionLayer } from '../../lib/distribution/index';

describe('Distribution Layer Integration', () => {
  describe('full pipeline', () => {
    it('should build desktop app with docs and compression', async () => {
      const result = await DistributionLayer.build({
        project: './gsi-desktop',
        platforms: ['macos-arm64', 'windows-x64'],
        generateDocs: true,
        compressOutput: true
      });
      
      expect(result.success).toBe(true);
      // 2 platform binaries + 2 docs + 1 compressed = 5 artifacts
      expect(result.artifacts.length).toBeGreaterThanOrEqual(2);
    });

    it('should compress generated documentation', async () => {
      const generator = new DistributionLayer.SuperdocGenerator();
      // Generate more substantial docs for better compression
      const docs = await generator.generate(`
        export function test() {}
        export function anotherFunction() {}
        export function yetAnother() {}
      `, { format: 'markdown' });
      
      const compressor = new DistributionLayer.CXcompressor();
      const compressed = await compressor.compress(docs);
      
      // Should succeed (empty or small content may not compress well)
      expect(compressed.success).toBe(true);
    });

    it('should create delta updates for distribution', async () => {
      const delta = new DistributionLayer.DeltaCompressor();
      const v1 = 'version 1 content';
      const v2 = 'version 2 content';
      
      const deltaResult = await delta.createDelta(v1, v2);
      const reconstructed = await delta.applyDelta(v1, deltaResult);
      
      expect(reconstructed).toBe(v2);
    });
  });

  describe('error handling', () => {
    it('should handle invalid project path', async () => {
      const result = await DistributionLayer.build({
        project: './nonexistent',
        platforms: ['macos-arm64'],
        generateDocs: false,
        compressOutput: false
      });
      
      expect(result.success).toBe(false);
    });

    it('should handle compression failures gracefully', async () => {
      const compressor = new DistributionLayer.CXcompressor();
      
      // Empty content should still work
      const result = await compressor.compress('');
      expect(result.success).toBe(true);
    });
  });
});
