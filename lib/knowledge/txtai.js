/**
 * @fileoverview Txtai embedding integration module
 * Provides local embedding generation and semantic search
 * Part of Phase 50C: Knowledge System Integration
 * 
 * Inspired by txtai (https://github.com/neuml/txtai)
 * Implements local embeddings without external API dependencies
 */

/**
 * Analyze txtai architecture approach
 * @returns {Promise<object>} Architecture analysis
 */
async function analyzeTxtai() {
  return {
    approach: 'local-embeddings',
    description: 'Local embedding generation using TF-IDF inspired vectors',
    features: [
      'semantic-embeddings',
      'similarity-search',
      'batch-processing',
      'index-persistence',
      'no-external-api'
    ],
    vectorDimension: 128,
    similarityMetric: 'cosine',
    version: '1.0.0',
    analyzed: new Date().toISOString()
  };
}

/**
 * Generate embedding for text
 * Uses a simple hash-based approach inspired by TF-IDF
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateEmbedding(text) {
  if (!text || text.length === 0) {
    return new Array(128).fill(0);
  }

  // Tokenize and normalize
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  // Calculate word frequencies
  const wordFreq = {};
  const totalWords = words.length;
  
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Create embedding vector using hash-based approach
  const embedding = new Array(128).fill(0);

  Object.entries(wordFreq).forEach(([word, freq]) => {
    // Generate deterministic hash for word
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i);
      hash = hash & hash;
    }

    // Distribute across multiple dimensions for better representation
    const baseIndex = Math.abs(hash) % embedding.length;
    const offset1 = Math.abs(hash >> 8) % embedding.length;
    const offset2 = Math.abs(hash >> 16) % embedding.length;

    const normalizedFreq = freq / totalWords;
    embedding[baseIndex] += normalizedFreq;
    embedding[offset1] += normalizedFreq * 0.5;
    embedding[offset2] += normalizedFreq * 0.25;
  });

  // Add n-gram features
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = words[i] + words[i + 1];
    let hash = 0;
    for (let j = 0; j < bigram.length; j++) {
      hash = ((hash << 5) - hash) + bigram.charCodeAt(j);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % embedding.length;
    embedding[index] += 0.1;
  }

  return normalizeEmbedding(embedding);
}

/**
 * Normalize embedding to unit vector
 * @param {number[]} embedding - Embedding vector
 * @returns {number[]} Normalized embedding
 */
function normalizeEmbedding(embedding) {
  const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  
  if (magnitude === 0) {
    return embedding;
  }

  return embedding.map(v => v / magnitude);
}

/**
 * Create embedding index from documents
 * @param {Array<{id: string, content: string}>} documents - Documents to index
 * @returns {Promise<object>} Embedding index
 */
async function createEmbeddingIndex(documents) {
  const index = {
    count: 0,
    documents: [],
    embeddings: [],
    idToIndex: new Map(),
    timestamp: Date.now()
  };

  for (const doc of documents) {
    const embedding = await generateEmbedding(doc.content);
    const idx = index.documents.length;
    
    index.documents.push({
      id: doc.id,
      content: doc.content,
      embedding
    });
    index.embeddings.push(embedding);
    index.idToIndex.set(doc.id, idx);
    index.count++;
  }

  return index;
}

/**
 * Search embeddings for similar documents
 * @param {object} index - Embedding index
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<Array>} Search results
 */
async function searchEmbeddings(index, query, options = {}) {
  const { limit = 10, threshold = 0 } = options;

  if (!index || index.count === 0) {
    return [];
  }

  const queryEmbedding = await generateEmbedding(query);
  const results = [];

  for (let i = 0; i < index.documents.length; i++) {
    const doc = index.documents[i];
    const score = cosineSimilarity(queryEmbedding, doc.embedding);

    if (score >= threshold) {
      results.push({
        id: doc.id,
        content: doc.content.substring(0, 500),
        score
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

/**
 * Get similar documents to a specific document
 * @param {object} index - Embedding index
 * @param {string} docId - Document ID
 * @param {object} options - Options
 * @returns {Promise<Array>} Similar documents
 */
async function getSimilarDocuments(index, docId, options = {}) {
  const { limit = 5, threshold = 0.5 } = options;

  const docIndex = index.idToIndex?.get(docId);
  if (docIndex === undefined) {
    return [];
  }

  const doc = index.documents[docIndex];
  const results = [];

  for (let i = 0; i < index.documents.length; i++) {
    if (i === docIndex) continue;

    const otherDoc = index.documents[i];
    const score = cosineSimilarity(doc.embedding, otherDoc.embedding);

    if (score >= threshold) {
      results.push({
        id: otherDoc.id,
        content: otherDoc.content.substring(0, 200),
        score
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/**
 * Generate embeddings for multiple texts in batch
 * @param {string[]} texts - Texts to embed
 * @returns {Promise<Array<number[]>>} Array of embeddings
 */
async function batchEmbeddings(texts) {
  return Promise.all(texts.map(text => generateEmbedding(text)));
}

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vec1 - First vector
 * @param {number[]} vec2 - Second vector
 * @returns {number} Similarity score (0-1)
 */
function cosineSimilarity(vec1, vec2) {
  const len = Math.min(vec1.length, vec2.length);

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < len; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

module.exports = {
  analyzeTxtai,
  generateEmbedding,
  createEmbeddingIndex,
  searchEmbeddings,
  getSimilarDocuments,
  normalizeEmbedding,
  batchEmbeddings,
  cosineSimilarity
};
