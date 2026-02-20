/**
 * @fileoverview Tests for graph-sync module
 * Part of Phase 50C: Knowledge System Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  analyzeGraphSync,
  syncEmbeddingsToGraph,
  getGraphEmbedding,
  findSimilarNodes,
  updateNodeEmbedding,
  createEmbeddingLink,
  getSyncStats
} from '../../../lib/knowledge/graph-sync';

/**
 * Helper to create mock graph
 */
function createMockGraph() {
  const nodes = new Map([
    ['node-1', { id: 'node-1', type: 'Function', name: 'testFunc' }],
    ['node-2', { id: 'node-2', type: 'Class', name: 'TestClass' }],
    ['node-3', { id: 'node-3', type: 'File', name: 'test.js' }]
  ]);

  return {
    getNode: (id) => nodes.get(id),
    getAllNodes: () => Array.from(nodes.values()),
    addEdge: () => {},
    nodeCount: () => nodes.size
  };
}

describe('Graph Sync Module', () => {
  describe('analyzeGraphSync', () => {
    it('should return architecture analysis', async () => {
      const analysis = await analyzeGraphSync();
      
      expect(analysis).toBeDefined();
      expect(analysis.approach).toBe('embedding-graph-sync');
      expect(analysis.features).toContain('node-embeddings');
      expect(analysis.features).toContain('similarity-edges');
      expect(analysis.analyzed).toBeDefined();
    });
  });

  describe('syncEmbeddingsToGraph', () => {
    it('should sync embeddings to graph nodes', async () => {
      const mockGraph = createMockGraph();
      const embeddings = new Map([
        ['node-1', [0.1, 0.2, 0.3]],
        ['node-2', [0.4, 0.5, 0.6]]
      ]);
      
      const result = await syncEmbeddingsToGraph(mockGraph, embeddings);
      
      expect(result.synced).toBeGreaterThan(0);
      expect(result.errors.length).toBe(0);
    });

    it('should handle missing nodes', async () => {
      const mockGraph = createMockGraph();
      const embeddings = new Map([
        ['nonexistent', [0.1, 0.2, 0.3]]
      ]);
      
      const result = await syncEmbeddingsToGraph(mockGraph, embeddings);
      
      expect(result.errors.some(e => e.includes('not found'))).toBe(true);
    });
  });

  describe('getGraphEmbedding', () => {
    it('should retrieve embedding for graph node', async () => {
      const mockGraph = createMockGraph();
      mockGraph.getNode('node-1').embedding = [0.1, 0.2, 0.3];
      
      const embedding = await getGraphEmbedding(mockGraph, 'node-1');
      
      expect(embedding).toEqual([0.1, 0.2, 0.3]);
    });

    it('should return null for node without embedding', async () => {
      const mockGraph = createMockGraph();
      
      const embedding = await getGraphEmbedding(mockGraph, 'node-2');
      
      expect(embedding).toBeNull();
    });
  });

  describe('findSimilarNodes', () => {
    it('should find similar nodes by embedding', async () => {
      const mockGraph = createMockGraph();
      mockGraph.getNode('node-1').embedding = [1, 0, 0];
      mockGraph.getNode('node-2').embedding = [0.9, 0.1, 0];
      mockGraph.getNode('node-3').embedding = [0, 0, 1];
      
      const similar = await findSimilarNodes(mockGraph, 'node-1', { threshold: 0.5 });
      
      expect(similar.some(n => n.id === 'node-2')).toBe(true);
      expect(similar.some(n => n.id === 'node-3')).toBe(false);
    });

    it('should respect limit parameter', async () => {
      const mockGraph = createMockGraph();
      mockGraph.getNode('node-1').embedding = [1, 0, 0];
      mockGraph.getNode('node-2').embedding = [0.99, 0.01, 0];
      mockGraph.getNode('node-3').embedding = [0.98, 0.02, 0];
      
      const similar = await findSimilarNodes(mockGraph, 'node-1', { limit: 1 });
      
      expect(similar.length).toBe(1);
    });
  });

  describe('updateNodeEmbedding', () => {
    it('should update node embedding', async () => {
      const mockGraph = createMockGraph();
      
      await updateNodeEmbedding(mockGraph, 'node-1', [0.5, 0.5, 0.5]);
      
      const node = mockGraph.getNode('node-1');
      expect(node.embedding).toEqual([0.5, 0.5, 0.5]);
    });

    it('should throw for invalid embedding', async () => {
      const mockGraph = createMockGraph();
      
      expect(updateNodeEmbedding(mockGraph, 'node-1', 'invalid')).rejects.toThrow(/Invalid embedding/);
    });
  });

  describe('createEmbeddingLink', () => {
    it('should create similarity edge between nodes', async () => {
      const mockGraph = createMockGraph();
      mockGraph.getNode('node-1').embedding = [1, 0, 0];
      mockGraph.getNode('node-2').embedding = [0.9, 0.1, 0];
      
      const link = await createEmbeddingLink(mockGraph, 'node-1', 'node-2');
      
      expect(link).toBeDefined();
      expect(link.similarity).toBeGreaterThan(0);
      expect(link.type).toBe('SIMILAR_TO');
    });

    it('should not create link for dissimilar nodes', async () => {
      const mockGraph = createMockGraph();
      mockGraph.getNode('node-1').embedding = [1, 0, 0];
      mockGraph.getNode('node-2').embedding = [0, 0, 1];
      
      const link = await createEmbeddingLink(mockGraph, 'node-1', 'node-2', { threshold: 0.9 });
      
      expect(link).toBeNull();
    });
  });

  describe('getSyncStats', () => {
    it('should return sync statistics', async () => {
      const mockGraph = createMockGraph();
      mockGraph.getNode('node-1').embedding = [0.1, 0.2];
      mockGraph.getNode('node-2').embedding = [0.3, 0.4];
      
      const stats = getSyncStats(mockGraph);
      
      expect(stats.nodesWithEmbeddings).toBeGreaterThanOrEqual(0);
      expect(stats.totalNodes).toBeGreaterThanOrEqual(0);
    });
  });
});
