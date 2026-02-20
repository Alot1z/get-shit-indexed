/**
 * @fileoverview Semantic index module
 * Provides semantic search index using embeddings
 * Part of Phase 50C: Knowledge System Integration
 */

const { generateEmbedding, cosineSimilarity } = require('./txtai');

/**
 * Create a semantic index
 * @param {object} options - Index options
 * @returns {Promise<object>} Semantic index instance
 */
async function createSemanticIndex(options = {}) {
  const { documents = [] } = options;

  const index = {
    _documents: new Map(),
    _embeddings: new Map(),

    /**
     * Add document to index
     * @param {object} doc - Document to add
     */
    async add(doc) {
      if (!doc.id || !doc.content) {
        throw new Error('Document must have id and content');
      }

      const embedding = await generateEmbedding(doc.content);
      this._documents.set(doc.id, { ...doc, embedding });
      this._embeddings.set(doc.id, embedding);
    },

    /**
     * Get document by ID
     * @param {string} id - Document ID
     * @returns {object} Document
     */
    get(id) {
      return this._documents.get(id);
    },

    /**
     * Remove document from index
     * @param {string} id - Document ID
     */
    remove(id) {
      this._documents.delete(id);
      this._embeddings.delete(id);
    },

    /**
     * Search the index
     * @param {string} query - Search query
     * @param {object} opts - Search options
     * @returns {Promise<Array>} Search results
     */
    async search(query, opts = {}) {
      const { limit = 10, threshold = 0 } = opts;
      const queryEmbedding = await generateEmbedding(query);
      const results = [];

      for (const [id, doc] of this._documents) {
        const score = cosineSimilarity(queryEmbedding, doc.embedding);
        if (score >= threshold) {
          results.push({
            id,
            content: doc.content.substring(0, 500),
            score
          });
        }
      }

      results.sort((a, b) => b.score - a.score);
      return results.slice(0, limit);
    },

    /**
     * Get index size
     * @returns {number} Number of documents
     */
    size() {
      return this._documents.size;
    }
  };

  // Add initial documents
  for (const doc of documents) {
    await index.add(doc);
  }

  return index;
}

/**
 * Add documents to index
 * @param {object} index - Semantic index
 * @param {object|Array} documents - Document(s) to add
 */
async function addToIndex(index, documents) {
  const docs = Array.isArray(documents) ? documents : [documents];

  for (const doc of docs) {
    await index.add(doc);
  }
}

/**
 * Search the index
 * @param {object} index - Semantic index
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<Array>} Search results
 */
async function searchIndex(index, query, options = {}) {
  return index.search(query, options);
}

/**
 * Remove document from index
 * @param {object} index - Semantic index
 * @param {string} id - Document ID
 */
function removeFromIndex(index, id) {
  index.remove(id);
}

/**
 * Get index statistics
 * @param {object} index - Semantic index
 * @returns {object} Statistics
 */
function getIndexStats(index) {
  return {
    documentCount: index.size(),
    indexSize: index._documents.size * 1000, // Approximate bytes
    hasEmbeddings: index._embeddings.size > 0
  };
}

/**
 * Persist index to disk
 * @param {object} index - Semantic index
 * @param {string} path - Path to save
 */
async function persistIndex(index, path) {
  const fs = require('fs').promises;

  const data = {
    documents: Array.from(index._documents.entries()).map(([id, doc]) => ({
      id,
      content: doc.content,
      embedding: doc.embedding
    })),
    timestamp: Date.now()
  };

  await fs.writeFile(`${path}/index.json`, JSON.stringify(data));
}

/**
 * Load index from disk
 * @param {string} path - Path to load from
 * @returns {Promise<object>} Loaded index
 */
async function loadIndex(path) {
  const fs = require('fs').promises;

  const data = JSON.parse(await fs.readFile(`${path}/index.json`, 'utf-8'));
  const index = await createSemanticIndex();

  for (const doc of data.documents) {
    index._documents.set(doc.id, doc);
    index._embeddings.set(doc.id, doc.embedding);
  }

  return index;
}

module.exports = {
  createSemanticIndex,
  addToIndex,
  searchIndex,
  removeFromIndex,
  getIndexStats,
  persistIndex,
  loadIndex
};
