/**
 * @fileoverview Tests for semantic search integration
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
  analyzeSemanticSearch,
  indexContent,
  semanticSearch,
  buildSearchIndex,
  loadSearchIndex,
  getEmbedding,
  cosineSimilarity
} from '../../../lib/core-engine/semantic-search';

describe('semantic-search', () => {
  const fixturesPath = path.join(__dirname, '../../test/fixtures');
  const docsPath = path.join(fixturesPath, 'docs');

  describe('Task 4: Semantic Search Architecture Analysis', () => {
    it('should analyze semantic search architecture', async () => {
      const analysis = await analyzeSemanticSearch();
      expect(analysis).toHaveProperty('embeddingApproach');
      expect(analysis).toHaveProperty('indexStrategy');
      expect(analysis.embeddingApproach).toBe('local');
    });

    it('should document supported embedding models', async () => {
      const analysis = await analyzeSemanticSearch();
      expect(analysis).toHaveProperty('supportedModels');
      expect(Array.isArray(analysis.supportedModels)).toBe(true);
    });

    it('should identify similarity metrics', async () => {
      const analysis = await analyzeSemanticSearch();
      expect(analysis).toHaveProperty('similarityMetric');
      expect(analysis.similarityMetric).toBe('cosine');
    });
  });

  describe('Task 5: Semantic Search Implementation', () => {
    beforeEach(async () => {
      // Index test content before each test
      await indexContent([docsPath]);
    });

    it('should perform semantic search on indexed content', async () => {
      const results = await semanticSearch('authentication patterns');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('content');
      expect(results[0]).toHaveProperty('path');
    });

    it('should rank results by relevance', async () => {
      const results = await semanticSearch('authentication');
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('should return empty array for no matches', async () => {
      const results = await semanticSearch('xyznonexistent12345');
      expect(results.length).toBe(0);
    });

    it('should limit results by count', async () => {
      const results = await semanticSearch('authentication', { limit: 2 });
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should include context around matches', async () => {
      const results = await semanticSearch('JWT');
      if (results.length > 0) {
        expect(results[0]).toHaveProperty('context');
      }
    });
  });

  describe('Task 6: Search Index Builder', () => {
    const testIndexPath = path.join(__dirname, '../../test-index');

    afterEach(async () => {
      // Clean up test index
      try {
        await fs.promises.rm(testIndexPath, { recursive: true });
      } catch (e) {
        // Ignore cleanup errors
      }
    });

    it('should build search index from files', async () => {
      const index = await buildSearchIndex([docsPath]);
      expect(index.documents).toBeGreaterThan(0);
      expect(index.embeddings).toBeDefined();
      expect(index.embeddings.length).toBeGreaterThan(0);
    });

    it('should persist index to disk', async () => {
      await buildSearchIndex([docsPath], { persist: true, path: testIndexPath });
      const loaded = await loadSearchIndex(testIndexPath);
      expect(loaded.documents).toBeGreaterThan(0);
    });

    it('should load persisted index', async () => {
      await buildSearchIndex([docsPath], { persist: true, path: testIndexPath });
      const loaded = await loadSearchIndex(testIndexPath);
      expect(loaded.embeddings).toBeDefined();
      expect(loaded.timestamp).toBeDefined();
    });

    it('should support incremental index updates', async () => {
      // Build initial index
      const index1 = await buildSearchIndex([docsPath], { persist: true, path: testIndexPath });

      // Update index with same content (should be fast)
      const index2 = await buildSearchIndex([docsPath], {
        persist: true,
        path: testIndexPath,
        incremental: true
      });

      expect(index2.documents).toBe(index1.documents);
    });
  });

  describe('Embedding Functions', () => {
    it('should generate embeddings for text', async () => {
      const embedding = await getEmbedding('test text');
      expect(Array.isArray(embedding)).toBe(true);
      expect(embedding.length).toBeGreaterThan(0);
    });

    it('should generate consistent embeddings for same text', async () => {
      const embedding1 = await getEmbedding('same text');
      const embedding2 = await getEmbedding('same text');
      expect(embedding1).toEqual(embedding2);
    });

    it('should calculate cosine similarity', () => {
      const vec1 = [1, 0, 0];
      const vec2 = [1, 0, 0];
      const similarity = cosineSimilarity(vec1, vec2);
      expect(similarity).toBe(1);
    });

    it('should calculate zero similarity for orthogonal vectors', () => {
      const vec1 = [1, 0, 0];
      const vec2 = [0, 1, 0];
      const similarity = cosineSimilarity(vec1, vec2);
      expect(similarity).toBe(0);
    });

    it('should handle different length vectors gracefully', () => {
      const vec1 = [1, 0];
      const vec2 = [1, 0, 0];
      expect(() => cosineSimilarity(vec1, vec2)).not.toThrow();
    });
  });

  describe('Search Options', () => {
    it('should support threshold filtering', async () => {
      const results = await semanticSearch('auth', { threshold: 0.9 });
      results.forEach(result => {
        expect(result.score).toBeGreaterThanOrEqual(0.9);
      });
    });

    it('should support file type filtering', async () => {
      const results = await semanticSearch('patterns', { fileTypes: ['*.md'] });
      results.forEach(result => {
        expect(result.path).toMatch(/\.md$/);
      });
    });
  });
});
