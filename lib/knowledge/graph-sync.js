/**
 * @fileoverview Graph sync module
 * Syncs embeddings to CodeGraphContext nodes
 * Part of Phase 50C: Knowledge System Integration
 */

const { cosineSimilarity } = require('./txtai');

/**
 * Analyze graph sync architecture
 * @returns {Promise<object>} Architecture analysis
 */
async function analyzeGraphSync() {
  return {
    approach: 'embedding-graph-sync',
    description: 'Synchronize embeddings to graph nodes for semantic navigation',
    features: [
      'node-embeddings',
      'similarity-edges',
      'incremental-sync',
      'batch-updates'
    ],
    version: '1.0.0',
    analyzed: new Date().toISOString()
  };
}

/**
 * Sync embeddings to graph nodes
 * @param {object} graph - Graph instance
 * @param {Map} embeddings - Map of node ID to embedding
 * @returns {Promise<object>} Sync result
 */
async function syncEmbeddingsToGraph(graph, embeddings) {
  const result = {
    synced: 0,
    errors: [],
    timestamp: Date.now()
  };

  for (const [nodeId, embedding] of embeddings) {
    try {
      const node = graph.getNode(nodeId);
      if (!node) {
        result.errors.push(`Node not found: ${nodeId}`);
        continue;
      }

      // Update node with embedding
      node.embedding = embedding;
      result.synced++;
    } catch (error) {
      result.errors.push(`Failed to sync ${nodeId}: ${error.message}`);
    }
  }

  return result;
}

/**
 * Get embedding for a graph node
 * @param {object} graph - Graph instance
 * @param {string} nodeId - Node ID
 * @returns {Promise<number[]|null>} Node embedding
 */
async function getGraphEmbedding(graph, nodeId) {
  const node = graph.getNode(nodeId);
  if (!node || !node.embedding) {
    return null;
  }
  return node.embedding;
}

/**
 * Find similar nodes by embedding
 * @param {object} graph - Graph instance
 * @param {string} nodeId - Source node ID
 * @param {object} options - Search options
 * @returns {Promise<Array>} Similar nodes
 */
async function findSimilarNodes(graph, nodeId, options = {}) {
  const { threshold = 0.5, limit = 10 } = options;

  const sourceNode = graph.getNode(nodeId);
  if (!sourceNode || !sourceNode.embedding) {
    return [];
  }

  const results = [];
  const nodes = graph.getAllNodes();

  for (const node of nodes) {
    if (node.id === nodeId || !node.embedding) continue;

    const similarity = cosineSimilarity(sourceNode.embedding, node.embedding);
    if (similarity >= threshold) {
      results.push({
        id: node.id,
        type: node.type,
        name: node.name,
        similarity
      });
    }
  }

  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, limit);
}

/**
 * Update node embedding
 * @param {object} graph - Graph instance
 * @param {string} nodeId - Node ID
 * @param {number[]} embedding - New embedding
 */
async function updateNodeEmbedding(graph, nodeId, embedding) {
  if (!Array.isArray(embedding)) {
    throw new Error('Invalid embedding: must be an array');
  }

  const node = graph.getNode(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  node.embedding = embedding;
  node.embeddingUpdated = Date.now();
}

/**
 * Create embedding-based similarity link
 * @param {object} graph - Graph instance
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 * @param {object} options - Options
 * @returns {Promise<object|null>} Created link or null
 */
async function createEmbeddingLink(graph, sourceId, targetId, options = {}) {
  const { threshold = 0.7 } = options;

  const sourceNode = graph.getNode(sourceId);
  const targetNode = graph.getNode(targetId);

  if (!sourceNode || !targetNode) {
    return null;
  }

  if (!sourceNode.embedding || !targetNode.embedding) {
    return null;
  }

  const similarity = cosineSimilarity(sourceNode.embedding, targetNode.embedding);

  if (similarity < threshold) {
    return null;
  }

  // Create edge
  graph.addEdge({
    from: sourceId,
    to: targetId,
    type: 'SIMILAR_TO',
    similarity
  });

  return {
    type: 'SIMILAR_TO',
    source: sourceId,
    target: targetId,
    similarity
  };
}

/**
 * Get sync statistics
 * @param {object} graph - Graph instance
 * @returns {object} Statistics
 */
function getSyncStats(graph) {
  const nodes = graph.getAllNodes();
  const nodesWithEmbeddings = nodes.filter(n => n.embedding).length;

  return {
    totalNodes: nodes.length,
    nodesWithEmbeddings,
    coverage: nodes.length > 0 ? nodesWithEmbeddings / nodes.length : 0
  };
}

module.exports = {
  analyzeGraphSync,
  syncEmbeddingsToGraph,
  getGraphEmbedding,
  findSimilarNodes,
  updateNodeEmbedding,
  createEmbeddingLink,
  getSyncStats
};
