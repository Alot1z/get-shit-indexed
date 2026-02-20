/**
 * @fileoverview Integration tests for Core Engine
 * Part of Phase 50A: Core Engine Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const core = require(path.join(__dirname, '../../lib/core-engine/index.js'));

describe('Core Engine Integration Tests', () => {
  const fixturesPath = path.join(__dirname, '../../test/fixtures');

  describe('Core Engine <-> Agent Framework Integration', () => {
    it('should provide search results to agents', async () => {
      // Index content first
      await core.indexContent([path.join(fixturesPath, 'docs')]);

      // Search
      const searchResults = await core.semanticSearch('authentication');

      // Verify results can be used by agents
      expect(Array.isArray(searchResults)).toBe(true);

      if (searchResults.length > 0) {
        const result = searchResults[0];
        expect(result).toHaveProperty('path');
        expect(result).toHaveProperty('content');
        expect(result).toHaveProperty('score');

        // Agent context preparation
        const agentContext = {
          relevantFiles: searchResults.map(r => r.path),
          topResult: result
        };
        expect(agentContext).toHaveProperty('relevantFiles');
      }
    });

    it('should provide CXML output for agent context', async () => {
      const testFile = path.join(fixturesPath, 'sample.md');
      const cxml = await core.filesToPrompt([testFile], { format: 'cxml' });

      // Verify CXML format
      expect(cxml).toContain('<documents>');
      expect(cxml).toContain('</documents>');
      expect(cxml).toContain('<document');

      // Agent can parse this
      const hasDocuments = cxml.includes('<document');
      expect(hasDocuments).toBe(true);
    });
  });

  describe('Core Engine Internal Integration', () => {
    it('should use fastcode patterns in semantic search', async () => {
      const start = Date.now();

      // Index and search (should use optimizations internally)
      await core.indexContent([path.join(fixturesPath, 'docs')]);
      await core.semanticSearch('complex query with many results');

      const duration = Date.now() - start;

      // Should complete in reasonable time
      expect(duration).toBeLessThan(5000);
    });

    it('should integrate files-to-prompt with semantic search', async () => {
      // Convert files to CXML
      const cxml = await core.filesToPrompt([path.join(fixturesPath, 'sample.md')], {
        format: 'cxml'
      });

      // Index for search
      const docCount = await core.indexContent([path.join(fixturesPath, 'sample.md')]);

      // Both should work together
      expect(cxml).toContain('Sample Document');
      expect(docCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('CodeGraph + Semantic Search Integration', () => {
    it('should combine graph relationships with semantic search', async () => {
      // Index content
      await core.indexContent([path.join(fixturesPath, 'docs')]);

      // Search
      const searchResults = await core.semanticSearch('authentication');

      if (searchResults.length > 0) {
        // Find related files (would use graph in production)
        const relatedFiles = await core.findCallers(searchResults[0].path);

        // Should return array (may be empty if no graph data)
        expect(Array.isArray(relatedFiles)).toBe(true);
      }
    });

    it('should use cached queries for performance', async () => {
      // Clear cache first
      core.clearGraphCache();

      // Execute query twice
      await core.cachedQuery('find_importers', { target: 'test' });
      await core.cachedQuery('find_importers', { target: 'test' });

      // Check cache stats
      const stats = core.getCacheStats();
      expect(stats.hits).toBeGreaterThan(0);
    });
  });

  describe('Full Pipeline Integration', () => {
    it('should support complete workflow: index -> search -> convert', async () => {
      // Step 1: Build search index
      const index = await core.buildSearchIndex([path.join(fixturesPath, 'docs')]);
      expect(index.documents).toBeGreaterThan(0);

      // Step 2: Search
      const results = await core.semanticSearch('authentication');
      expect(results.length).toBeGreaterThan(0);

      // Step 3: Convert results to CXML
      if (results.length > 0) {
        const cxml = await core.convertToCxml([{
          path: results[0].path,
          content: results[0].content
        }]);
        expect(cxml).toContain('<documents>');
      }
    });

    it('should support fast file operations', async () => {
      // Use fast glob
      const files = await core.fastGlob('**/*.md', fixturesPath);
      expect(files.length).toBeGreaterThan(0);

      // Use fast read
      if (files.length > 0) {
        const content = await core.fastReadFile(files[0]);
        expect(content.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Error Recovery Integration', () => {
    it('should handle errors gracefully across modules', async () => {
      // Invalid search should not crash
      const results = await core.semanticSearch('');
      expect(Array.isArray(results)).toBe(true);

      // Invalid graph query should not crash
      try {
        await core.queryGraph('invalid_query_type', {});
      } catch (e) {
        // Expected to throw
        expect(e.message).toContain('Invalid query type');
      }
    });
  });
});
