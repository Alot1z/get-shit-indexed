/**
 * @fileoverview Tests for search index builder
 * Part of Phase 50A: Core Engine Integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the module (will fail initially - RED phase)
import {
  buildSearchIndex,
  loadSearchIndex,
  updateIndex,
  getIndexStats
} from '../../../lib/core-engine/search-index';

describe('search-index', () => {
  const fixturesPath = path.join(__dirname, '../../test/fixtures');
  const docsPath = path.join(fixturesPath, 'docs');
  const testIndexPath = path.join(__dirname, '../../test-index');

  afterEach(async () => {
    // Clean up test index
    try {
      await fs.promises.rm(testIndexPath, { recursive: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  describe('Task 6: Search Index Builder', () => {
    it('should build search index from files', async () => {
      const index = await buildSearchIndex([docsPath]);
      expect(index.documents).toBeGreaterThan(0);
      expect(index.embeddings).toBeDefined();
    });

    it('should persist index to disk', async () => {
      await buildSearchIndex([docsPath], { persist: true, path: testIndexPath });
      const loaded = await loadSearchIndex(testIndexPath);
      expect(loaded.documents).toBeGreaterThan(0);
    });

    it('should persist index to disk with correct path', async () => {
      const index = await buildSearchIndex([docsPath], {
        persist: true,
        path: testIndexPath
      });

      // Check file exists
      const indexPath = path.join(testIndexPath, 'index.json');
      const exists = await fs.promises.access(indexPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });

    it('should support incremental index updates', async () => {
      // Build initial index
      const index1 = await buildSearchIndex([docsPath], {
        persist: true,
        path: testIndexPath
      });

      // Update index with same content
      const index2 = await buildSearchIndex([docsPath], {
        persist: true,
        path: testIndexPath,
        incremental: true
      });

      expect(index2.documents).toBe(index1.documents);
    });

    it('should include document count', async () => {
      const index = await buildSearchIndex([docsPath]);
      expect(index.documents).toBeDefined();
      expect(typeof index.documents).toBe('number');
    });

    it('should include timestamp', async () => {
      const index = await buildSearchIndex([docsPath]);
      expect(index.timestamp).toBeDefined();
    });
  });

  describe('Index Statistics', () => {
    it('should provide index statistics', async () => {
      await buildSearchIndex([docsPath]);
      const stats = getIndexStats();

      expect(stats).toHaveProperty('documentCount');
      expect(stats).toHaveProperty('embeddingSize');
    });

    it('should track index size', async () => {
      await buildSearchIndex([docsPath]);
      const stats = getIndexStats();

      expect(stats.documentCount).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid paths gracefully', async () => {
      const index = await buildSearchIndex(['/nonexistent/path']);
      expect(index.documents).toBe(0);
    });

    it('should throw error when loading non-existent index', async () => {
      expect(loadSearchIndex('/nonexistent/index')).rejects.toThrow();
    });
  });
});
