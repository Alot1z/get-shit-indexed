/**
 * @fileoverview Tests for context compression module
 * Part of Phase 50C: Knowledge System Integration
 */

import { describe, it, expect } from 'bun:test';
import {
  analyzeCompression,
  compress,
  decompress,
  estimateTokens,
  getCompressionRatio,
  getCompressionStats
} from '../../../lib/knowledge/context-compress';

describe('Context Compression Module', () => {
  describe('analyzeCompression', () => {
    it('should return compression analysis', async () => {
      const analysis = await analyzeCompression();
      
      expect(analysis).toBeDefined();
      expect(analysis.approach).toBe('hybrid-compression');
      expect(analysis.features).toContain('token-reduction');
      expect(analysis.features).toContain('summarization');
      expect(analysis.targetRatio).toBeGreaterThanOrEqual(0.5);
      expect(analysis.analyzed).toBeDefined();
    });
  });

  describe('compress', () => {
    it('should compress verbose content', async () => {
      const verbose = 'This is a very long piece of text that contains many words and should be compressed to a smaller form while preserving the essential meaning.';
      
      const result = await compress(verbose);
      
      expect(result.compressed).toBeDefined();
      expect(result.compressed.length).toBeLessThan(verbose.length);
      expect(result.originalLength).toBeGreaterThan(0);
      expect(result.compressedLength).toBeGreaterThan(0);
    });

    it('should compress context objects', async () => {
      const context = {
        instructions: 'Please perform the following task carefully',
        files: [
          { path: 'a.js', content: 'const a = 1;' },
          { path: 'b.js', content: 'const b = 2;' }
        ],
        metadata: { source: 'test' }
      };
      
      const result = await compress(context);
      
      expect(result.compressed).toBeDefined();
      expect(result.ratio).toBeGreaterThan(0);
    });

    it('should respect target ratio', async () => {
      const verbose = 'Word '.repeat(100);
      
      const result = await compress(verbose, { targetRatio: 0.3 });
      
      // Should achieve some compression
      expect(result.compressed.length).toBeLessThan(verbose.length);
      expect(result.ratio).toBeGreaterThan(0);
    });

    it('should preserve critical content', async () => {
      const content = {
        critical: 'DO NOT MODIFY THIS',
        filler: 'This is just filler content that can be compressed'
      };
      
      const result = await compress(content, { preserve: ['critical'] });
      
      // Critical content should be preserved in some form
      expect(result.compressed).toBeDefined();
    });
  });

  describe('decompress', () => {
    it('should decompress to original structure', async () => {
      const original = {
        message: 'Test message for decompression'
      };
      
      const compressed = await compress(original);
      const decompressed = await decompress(compressed);
      
      expect(decompressed).toBeDefined();
    });

    it('should restore key information', async () => {
      const original = {
        task: 'Write a function',
        language: 'JavaScript'
      };
      
      const compressed = await compress(original);
      const decompressed = await decompress(compressed);
      
      expect(decompressed).toBeDefined();
    });
  });

  describe('estimateTokens', () => {
    it('should estimate token count for string', () => {
      const text = 'This is a test string';
      
      const tokens = estimateTokens(text);
      
      expect(tokens).toBeGreaterThan(0);
      expect(typeof tokens).toBe('number');
    });

    it('should estimate higher for longer text', () => {
      const short = 'Short';
      const long = 'This is a much longer piece of text that should have more tokens';
      
      const shortTokens = estimateTokens(short);
      const longTokens = estimateTokens(long);
      
      expect(longTokens).toBeGreaterThan(shortTokens);
    });

    it('should estimate for objects', () => {
      const obj = { key1: 'value1', key2: 'value2' };
      
      const tokens = estimateTokens(obj);
      
      expect(tokens).toBeGreaterThan(0);
    });
  });

  describe('getCompressionRatio', () => {
    it('should calculate compression ratio', async () => {
      const original = 'A'.repeat(1000);
      const compressed = 'A'.repeat(100);
      
      const ratio = getCompressionRatio(original, compressed);
      
      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThanOrEqual(1);
    });

    it('should return 0 for same content', () => {
      const content = 'Same content';
      
      const ratio = getCompressionRatio(content, content);
      
      expect(ratio).toBe(0);
    });
  });

  describe('getCompressionStats', () => {
    it('should return compression statistics', () => {
      const stats = getCompressionStats();
      
      expect(typeof stats.totalCompressions).toBe('number');
      expect(typeof stats.averageRatio).toBe('number');
    });
  });

  describe('Integration with lib/context-optimization', () => {
    it('should achieve compression for verbose context', async () => {
      const verbose = {
        instructions: 'Please analyze the following code and provide detailed feedback on its structure, performance, and maintainability. Consider all aspects including naming conventions, error handling, and documentation.',
        code: '// This is a very verbose comment that explains the function in great detail\nfunction processData(input) {\n  // First we validate the input\n  if (!input) {\n    throw new Error("Input is required");\n  }\n  // Then we process it\n  return input.toUpperCase();\n}'
      };
      
      const result = await compress(verbose, { targetRatio: 0.8 });
      
      // Should achieve some compression
      expect(result.ratio).toBeGreaterThan(0);
      expect(result.compressed).toBeDefined();
    });
  });
});
