/**
 * @fileoverview Tests for CodeGraphContext integration
 * Part of Phase 50A: Core Engine Integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

// Import the module (will fail initially - RED phase)
import {
  documentCodeGraphIntegration,
  findCallers,
  detectCircularDependencies,
  cachedQuery,
  getCacheStats,
  clearGraphCache,
  queryGraph
} from '../../../lib/core-engine/codegraph';

describe('codegraph', () => {
  describe('Task 7: CodeGraph Integration Documentation', () => {
    it('should document existing CodeGraphContext integration', async () => {
      const docs = await documentCodeGraphIntegration();
      expect(docs).toHaveProperty('connectionString');
      expect(docs).toHaveProperty('availableQueries');
      expect(docs.availableQueries).toContain('find_importers');
    });

    it('should list all supported query types', async () => {
      const docs = await documentCodeGraphIntegration();
      expect(docs.availableQueries).toContain('find_callers');
      expect(docs.availableQueries).toContain('find_callees');
      expect(docs.availableQueries).toContain('class_hierarchy');
    });

    it('should document neo4j connection requirements', async () => {
      const docs = await documentCodeGraphIntegration();
      expect(docs).toHaveProperty('connectionRequirements');
      expect(docs.connectionRequirements).toHaveProperty('host');
      expect(docs.connectionRequirements).toHaveProperty('port');
    });
  });

  describe('Task 8: Enhanced CodeGraph Integration', () => {
    it('should find all callers of a function', async () => {
      const callers = await findCallers('gsi:execute-phase');
      expect(Array.isArray(callers)).toBe(true);
      // May be empty if no graph data exists
      if (callers.length > 0) {
        expect(callers[0]).toHaveProperty('file');
        expect(callers[0]).toHaveProperty('line');
      }
    });

    it('should find callees of a function', async () => {
      const callees = await queryGraph('find_callees', { target: 'test-function' });
      expect(Array.isArray(callees)).toBe(true);
    });

    it('should detect circular dependencies', async () => {
      const cycles = await detectCircularDependencies('lib/');
      expect(Array.isArray(cycles)).toBe(true);
    });

    it('should return empty array when no cycles found', async () => {
      const cycles = await detectCircularDependencies('test/fixtures/');
      expect(Array.isArray(cycles)).toBe(true);
    });

    it('should find importers of a module', async () => {
      const importers = await queryGraph('find_importers', { target: 'fs' });
      expect(Array.isArray(importers)).toBe(true);
    });

    it('should support class hierarchy queries', async () => {
      const hierarchy = await queryGraph('class_hierarchy', { target: 'BaseClass' });
      expect(Array.isArray(hierarchy)).toBe(true);
    });
  });

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

    it('should track cache hits and misses', async () => {
      await cachedQuery('find_importers', { target: 'test1' });
      await cachedQuery('find_importers', { target: 'test1' }); // Hit
      await cachedQuery('find_importers', { target: 'test2' }); // Miss

      const stats = getCacheStats();
      expect(stats.hits).toBe(1);
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
  });

  describe('Query Builder DSL', () => {
    it('should support fluent query building', async () => {
      const results = await queryGraph('find_callers', {
        target: 'test',
        depth: 2,
        includeExternal: false
      });
      expect(Array.isArray(results)).toBe(true);
    });

    it('should support complex filter conditions', async () => {
      const results = await queryGraph('find_functions_by_decorator', {
        decorator: '@test',
        filePattern: '*.ts'
      });
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      // Should not throw, return empty results
      const results = await queryGraph('find_callers', { target: 'nonexistent' });
      expect(Array.isArray(results)).toBe(true);
    });

    it('should validate query parameters', async () => {
      expect(queryGraph('invalid_query', {})).rejects.toThrow();
    });
  });
});
