// tests/distribution/index.test.ts
// Phase 50E: Distribution Layer - Index Tests (TDD RED Phase)
import { describe, it, expect } from 'bun:test';
import { DistributionLayer, BuildOptions, BuildResult } from '../../lib/distribution/index';

describe('DistributionLayer', () => {
  describe('module exports', () => {
    it('should export ElectrobunProject', () => {
      expect(DistributionLayer.ElectrobunProject).toBeDefined();
    });

    it('should export SuperdocGenerator', () => {
      expect(DistributionLayer.SuperdocGenerator).toBeDefined();
    });

    it('should export CXcompressor', () => {
      expect(DistributionLayer.CXcompressor).toBeDefined();
    });

    it('should export DeltaCompressor', () => {
      expect(DistributionLayer.DeltaCompressor).toBeDefined();
    });

    it('should provide unified build function', async () => {
      const result = await DistributionLayer.build({
        project: './gsi-desktop',
        platforms: ['macos-arm64'],
        generateDocs: true,
        compressOutput: true
      });
      
      expect(result.success).toBe(true);
      expect(result.artifacts).toBeDefined();
    });

    it('should provide version info', () => {
      expect(DistributionLayer.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
});
