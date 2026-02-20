/**
 * @fileoverview Tests for core engine index
 * Part of Phase 50A: Core Engine Integration
 */

import { describe, it, expect } from 'bun:test';

// Import the module (will fail initially - RED phase)
import * as core from '../../../lib/core-engine/index';

describe('core-engine index', () => {
  describe('Task 12: Core Engine Index', () => {
    it('should export all core engine modules', () => {
      expect(core.filesToPrompt).toBeDefined();
      expect(core.semanticSearch).toBeDefined();
      expect(core.codeGraph).toBeDefined();
      expect(core.fastCode).toBeDefined();
    });

    it('should provide unified API', () => {
      expect(typeof core.filesToPrompt).toBe('function');
      expect(typeof core.semanticSearch).toBe('function');
      expect(typeof core.queryGraph).toBe('function');
    });

    it('should export search functions', () => {
      expect(core.indexContent).toBeDefined();
      expect(core.buildSearchIndex).toBeDefined();
    });

    it('should export utility functions', () => {
      expect(core.getEmbedding).toBeDefined();
      expect(core.cosineSimilarity).toBeDefined();
    });

    it('should export graph functions', () => {
      expect(core.findCallers).toBeDefined();
      expect(core.cachedQuery).toBeDefined();
    });

    it('should export fastcode functions', () => {
      expect(core.fastReadFile).toBeDefined();
      expect(core.fastWriteFile).toBeDefined();
      expect(core.fastGlob).toBeDefined();
    });

    it('should have version information', () => {
      expect(core.version).toBeDefined();
      expect(core.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('Module Integration', () => {
    it('should allow using filesToPrompt', async () => {
      const result = await core.filesToPrompt([], { format: 'cxml' });
      expect(result).toContain('<documents>');
    });

    it('should allow using semanticSearch', async () => {
      const results = await core.semanticSearch('test query');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should allow using queryGraph', async () => {
      const results = await core.queryGraph('find_callers', { target: 'test' });
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
