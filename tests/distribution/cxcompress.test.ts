// tests/distribution/cxcompress.test.ts
// Phase 50E: Distribution Layer - CXcompress Tests (TDD RED Phase)
import { describe, it, expect } from 'bun:test';
import { CXcompressAnalyzer, CXcompressor, CompressionAnalysis, CompressionResult } from '../../lib/distribution/cxcompress';

describe('CXcompressAnalyzer', () => {
  describe('compression analysis', () => {
    it('should identify compressible patterns', () => {
      const analyzer = new CXcompressAnalyzer();
      const content = `
        This is a long string with repeated patterns.
        This is a long string with repeated patterns.
        This is a long string with repeated patterns.
      `;
      
      const analysis = analyzer.analyze(content);
      
      expect(analysis.repetitionScore).toBeGreaterThan(0.5);
      expect(analysis.recommendedAlgorithm).toBe('lz77');
    });

    it('should detect JSON structures', () => {
      const analyzer = new CXcompressAnalyzer();
      const content = '{"key": "value", "nested": {"a": 1}}';
      
      const analysis = analyzer.analyze(content);
      
      expect(analysis.isStructured).toBe(true);
      expect(analysis.structureType).toBe('json');
    });

    it('should estimate compression ratio', () => {
      const analyzer = new CXcompressAnalyzer();
      const content = 'a'.repeat(1000);
      
      const analysis = analyzer.analyze(content);
      
      expect(analysis.estimatedRatio).toBeGreaterThan(0.8);
    });
  });
});

describe('CXcompressor', () => {
  describe('compression', () => {
    it('should compress text content', async () => {
      const compressor = new CXcompressor();
      const content = 'Hello World! '.repeat(100);
      
      const result = await compressor.compress(content);
      
      expect(result.compressed.length).toBeLessThan(content.length);
      expect(result.ratio).toBeGreaterThan(0.5);
    });

    it('should achieve 80%+ compression on repetitive content', async () => {
      const compressor = new CXcompressor();
      const content = 'a'.repeat(10000);
      
      const result = await compressor.compress(content);
      
      expect(result.ratio).toBeGreaterThanOrEqual(0.8);
    });

    it('should decompress to original content', async () => {
      const compressor = new CXcompressor();
      const original = 'Test content for compression';
      
      const compressed = await compressor.compress(original);
      const decompressed = await compressor.decompress(compressed.compressed);
      
      expect(decompressed).toBe(original);
    });

    it('should handle binary content', async () => {
      const compressor = new CXcompressor();
      const content = Buffer.from([0, 1, 2, 3, 4, 5]).toString('binary');
      
      const result = await compressor.compress(content);
      
      expect(result.success).toBe(true);
    });

    it('should support multiple algorithms', async () => {
      const compressor = new CXcompressor();
      const content = 'Test content';
      
      const gzipResult = await compressor.compress(content, { algorithm: 'gzip' });
      const brotliResult = await compressor.compress(content, { algorithm: 'brotli' });
      
      expect(gzipResult.algorithm).toBe('gzip');
      expect(brotliResult.algorithm).toBe('brotli');
    });
  });
});
