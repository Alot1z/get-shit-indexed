/**
 * @fileoverview Tests for txtai embedding module
 * Part of Phase 50C: Knowledge System Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  analyzeTxtai,
  generateEmbedding,
  createEmbeddingIndex,
  searchEmbeddings,
  getSimilarDocuments,
  normalizeEmbedding,
  batchEmbeddings
} from '../../../lib/knowledge/txtai';

/**
 * Helper function to calculate cosine similarity
 */
function calculateSimilarity(vec1, vec2) {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < Math.min(vec1.length, vec2.length); i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

describe('Txtai Embedding Module', () => {
  describe('analyzeTxtai', () => {
    it('should return architecture analysis', async () => {
      const analysis = await analyzeTxtai();
      
      expect(analysis).toBeDefined();
      expect(analysis.approach).toBe('local-embeddings');
      expect(analysis.features).toContain('semantic-embeddings');
      expect(analysis.features).toContain('similarity-search');
      expect(analysis.vectorDimension).toBeGreaterThan(0);
      expect(analysis.analyzed).toBeDefined();
    });
  });

  describe('generateEmbedding', () => {
    it('should generate embedding for text', async () => {
      const text = 'This is a test document for embedding';
      const embedding = await generateEmbedding(text);
      
      expect(Array.isArray(embedding)).toBe(true);
      expect(embedding.length).toBeGreaterThan(0);
      expect(embedding.every(v => typeof v === 'number')).toBe(true);
    });

    it('should generate consistent embeddings for same text', async () => {
      const text = 'Consistent embedding test';
      const embedding1 = await generateEmbedding(text);
      const embedding2 = await generateEmbedding(text);
      
      expect(embedding1).toEqual(embedding2);
    });

    it('should generate different embeddings for different texts', async () => {
      const text1 = 'First document about cats';
      const text2 = 'Second document about programming';
      
      const embedding1 = await generateEmbedding(text1);
      const embedding2 = await generateEmbedding(text2);
      
      // Embeddings should be different
      const similarity = calculateSimilarity(embedding1, embedding2);
      expect(similarity).toBeLessThan(1);
    });

    it('should handle empty text', async () => {
      const embedding = await generateEmbedding('');
      expect(Array.isArray(embedding)).toBe(true);
    });
  });

  describe('normalizeEmbedding', () => {
    it('should normalize embedding to unit vector', () => {
      const embedding = [3, 4];
      const normalized = normalizeEmbedding(embedding);
      
      // Magnitude should be 1
      const magnitude = Math.sqrt(normalized.reduce((sum, v) => sum + v * v, 0));
      expect(Math.abs(magnitude - 1)).toBeLessThan(0.0001);
    });

    it('should handle zero vector', () => {
      const embedding = [0, 0, 0];
      const normalized = normalizeEmbedding(embedding);
      
      expect(normalized).toEqual([0, 0, 0]);
    });
  });

  describe('createEmbeddingIndex', () => {
    it('should create index from documents', async () => {
      const documents = [
        { id: '1', content: 'Document about JavaScript' },
        { id: '2', content: 'Document about Python' },
        { id: '3', content: 'Document about TypeScript' }
      ];
      
      const index = await createEmbeddingIndex(documents);
      
      expect(index).toBeDefined();
      expect(index.count).toBe(3);
      expect(index.embeddings).toBeDefined();
      expect(index.documents).toBeDefined();
    });

    it('should handle empty documents array', async () => {
      const index = await createEmbeddingIndex([]);
      
      expect(index).toBeDefined();
      expect(index.count).toBe(0);
    });
  });

  describe('searchEmbeddings', () => {
    let testIndex;

    beforeEach(async () => {
      const documents = [
        { id: '1', content: 'JavaScript is a programming language' },
        { id: '2', content: 'Python is another programming language' },
        { id: '3', content: 'TypeScript extends JavaScript' },
        { id: '4', content: 'Cooking recipes and food' }
      ];
      testIndex = await createEmbeddingIndex(documents);
    });

    it('should find similar documents', async () => {
      const results = await searchEmbeddings(testIndex, 'programming languages');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].score).toBeGreaterThanOrEqual(0);
      expect(results[0].id).toBeDefined();
    });

    it('should rank results by similarity', async () => {
      const results = await searchEmbeddings(testIndex, 'JavaScript');
      
      expect(results.length).toBeGreaterThan(1);
      // Results should be sorted by score descending
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('should respect limit parameter', async () => {
      const results = await searchEmbeddings(testIndex, 'programming', { limit: 2 });
      
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should filter by threshold', async () => {
      const results = await searchEmbeddings(testIndex, 'programming', { threshold: 0.5 });
      
      results.forEach(r => {
        expect(r.score).toBeGreaterThanOrEqual(0.5);
      });
    });
  });

  describe('getSimilarDocuments', () => {
    let testIndex;

    beforeEach(async () => {
      const documents = [
        { id: '1', content: 'React is a frontend framework' },
        { id: '2', content: 'Vue is another frontend framework' },
        { id: '3', content: 'Angular is a complete framework' },
        { id: '4', content: 'Backend development with Node.js' }
      ];
      testIndex = await createEmbeddingIndex(documents);
    });

    it('should find similar documents by ID', async () => {
      const similar = await getSimilarDocuments(testIndex, '1');
      
      expect(Array.isArray(similar)).toBe(true);
      expect(similar.length).toBeGreaterThan(0);
    });

    it('should not include the query document in results', async () => {
      const similar = await getSimilarDocuments(testIndex, '1');
      
      similar.forEach(doc => {
        expect(doc.id).not.toBe('1');
      });
    });
  });

  describe('batchEmbeddings', () => {
    it('should generate embeddings for multiple texts', async () => {
      const texts = [
        'First document',
        'Second document',
        'Third document'
      ];
      
      const embeddings = await batchEmbeddings(texts);
      
      expect(embeddings.length).toBe(texts.length);
      embeddings.forEach(emb => {
        expect(Array.isArray(emb)).toBe(true);
        expect(emb.length).toBeGreaterThan(0);
      });
    });

    it('should handle empty array', async () => {
      const embeddings = await batchEmbeddings([]);
      
      expect(embeddings).toEqual([]);
    });
  });
});
