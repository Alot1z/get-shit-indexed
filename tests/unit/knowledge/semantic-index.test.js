/**
 * @fileoverview Tests for semantic index module
 * Part of Phase 50C: Knowledge System Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  createSemanticIndex,
  addToIndex,
  searchIndex,
  removeFromIndex,
  getIndexStats,
  persistIndex,
  loadIndex
} from '../../../lib/knowledge/semantic-index';

describe('Semantic Index Module', () => {
  describe('createSemanticIndex', () => {
    it('should create empty semantic index', async () => {
      const index = await createSemanticIndex();
      
      expect(index).toBeDefined();
      expect(typeof index.add).toBe('function');
      expect(typeof index.search).toBe('function');
      expect(typeof index.remove).toBe('function');
    });

    it('should create index with initial documents', async () => {
      const documents = [
        { id: '1', content: 'First document' },
        { id: '2', content: 'Second document' }
      ];
      
      const index = await createSemanticIndex({ documents });
      
      expect(index.size()).toBe(2);
    });
  });

  describe('addToIndex', () => {
    it('should add document to index', async () => {
      const index = await createSemanticIndex();
      
      await addToIndex(index, { id: '1', content: 'Test document' });
      
      expect(index.size()).toBe(1);
    });

    it('should generate embedding for document', async () => {
      const index = await createSemanticIndex();
      
      await addToIndex(index, { id: '1', content: 'Test document' });
      
      const doc = index.get('1');
      expect(doc.embedding).toBeDefined();
      expect(Array.isArray(doc.embedding)).toBe(true);
    });

    it('should handle batch additions', async () => {
      const index = await createSemanticIndex();
      
      await addToIndex(index, [
        { id: '1', content: 'First' },
        { id: '2', content: 'Second' },
        { id: '3', content: 'Third' }
      ]);
      
      expect(index.size()).toBe(3);
    });
  });

  describe('searchIndex', () => {
    let index;

    beforeEach(async () => {
      index = await createSemanticIndex();
      await addToIndex(index, [
        { id: '1', content: 'JavaScript programming language' },
        { id: '2', content: 'Python data science' },
        { id: '3', content: 'TypeScript for web development' },
        { id: '4', content: 'Cooking recipes' }
      ]);
    });

    it('should find similar documents', async () => {
      const results = await searchIndex(index, 'programming');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBeDefined();
      expect(results[0].score).toBeGreaterThanOrEqual(0);
    });

    it('should rank by similarity', async () => {
      const results = await searchIndex(index, 'JavaScript');
      
      // JavaScript document should be top result
      expect(results[0].id).toBe('1');
    });

    it('should respect limit', async () => {
      const results = await searchIndex(index, 'development', { limit: 2 });
      
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should apply threshold', async () => {
      const results = await searchIndex(index, 'xyzabc123', { threshold: 0.9 });
      
      // No results should match with high threshold
      expect(results.length).toBe(0);
    });
  });

  describe('removeFromIndex', () => {
    it('should remove document from index', async () => {
      const index = await createSemanticIndex();
      await addToIndex(index, { id: '1', content: 'Test' });
      
      removeFromIndex(index, '1');
      
      expect(index.size()).toBe(0);
    });

    it('should handle missing document', async () => {
      const index = await createSemanticIndex();
      
      // Should not throw
      expect(() => removeFromIndex(index, 'nonexistent')).not.toThrow();
    });
  });

  describe('getIndexStats', () => {
    it('should return index statistics', async () => {
      const index = await createSemanticIndex();
      await addToIndex(index, [
        { id: '1', content: 'First document' },
        { id: '2', content: 'Second document' }
      ]);
      
      const stats = getIndexStats(index);
      
      expect(stats.documentCount).toBeDefined();
      expect(stats.indexSize).toBeDefined();
      expect(stats.documentCount).toBe(2);
    });
  });
});
