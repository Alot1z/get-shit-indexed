/**
 * @fileoverview Semantic search integration module
 * Provides embedding-based code search
 * Part of Phase 50A: Core Engine Integration
 */

const fs = require('fs').promises;
const path = require('path');

// In-memory index storage
let currentIndex = null;
let indexCache = new Map();

/**
 * Analyze semantic search architecture
 * @returns {Promise<object>} Architecture analysis
 */
async function analyzeSemanticSearch() {
  return {
    embeddingApproach: 'local',
    indexStrategy: 'in-memory with optional persistence',
    supportedModels: ['tfidf', 'simple-hash', 'mock-embedding'],
    similarityMetric: 'cosine',
    features: [
      'content-indexing',
      'semantic-similarity',
      'result-ranking',
      'incremental-updates',
      'persistence'
    ],
    version: '1.0.0',
    analyzed: new Date().toISOString()
  };
}

/**
 * Index content for semantic search
 * @param {string[]} paths - Paths to index
 * @param {object} options - Indexing options
 * @returns {Promise<number>} Number of documents indexed
 */
async function indexContent(paths, options = {}) {
  const documents = [];

  for (const p of paths) {
    try {
      const stats = await fs.stat(p);

      if (stats.isFile()) {
        const content = await fs.readFile(p, 'utf-8');
        const embedding = await getEmbedding(content);
        documents.push({
          path: p,
          content,
          embedding,
          indexed: Date.now()
        });
      } else if (stats.isDirectory()) {
        const dirDocs = await indexDirectory(p, options);
        documents.push(...dirDocs);
      }
    } catch (error) {
      // Skip files/directories that can't be read
    }
  }

  currentIndex = {
    documents: documents.length,
    data: documents,
    embeddings: documents.map(d => d.embedding),
    timestamp: Date.now()
  };

  return documents.length;
}

/**
 * Index a directory recursively
 * @param {string} dirPath - Directory to index
 * @param {object} options - Indexing options
 * @returns {Promise<Array>} Array of documents
 */
async function indexDirectory(dirPath, options = {}) {
  const documents = [];
  const { fileTypes = ['.md', '.txt', '.js', '.ts', '.json'] } = options;

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (fileTypes.some(ft => ft === ext || ft === '*' || entry.name.endsWith(ft.replace('*', '')))) {
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const embedding = await getEmbedding(content);
            documents.push({
              path: fullPath,
              content,
              embedding,
              indexed: Date.now()
            });
          } catch (e) {
            // Skip files that can't be read
          }
        }
      } else if (entry.isDirectory()) {
        const subDocs = await indexDirectory(fullPath, options);
        documents.push(...subDocs);
      }
    }
  } catch (error) {
    // Skip directories that can't be read
  }

  return documents;
}

/**
 * Perform semantic search
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<Array>} Search results
 */
async function semanticSearch(query, options = {}) {
  const {
    limit = 10,
    threshold = 0.1, // Default threshold to filter out very low similarity matches
    fileTypes = null
  } = options;

  if (!currentIndex || !currentIndex.data) {
    return [];
  }

  // Get query embedding
  const queryEmbedding = await getEmbedding(query);

  // Calculate similarity for each document
  const results = currentIndex.data
    .map(doc => {
      const score = cosineSimilarity(queryEmbedding, doc.embedding);
      return {
        path: doc.path,
        content: doc.content.substring(0, 500), // Truncate for results
        score,
        context: extractContext(doc.content, query)
      };
    })
    .filter(result => result.score >= threshold)
    .filter(result => {
      if (!fileTypes) return true;
      return fileTypes.some(ft => result.path.endsWith(ft.replace('*', '')));
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

/**
 * Extract context around a query term
 * @param {string} content - Document content
 * @param {string} query - Query to find context for
 * @returns {string} Context string
 */
function extractContext(content, query) {
  const words = query.toLowerCase().split(/\s+/);
  const lowerContent = content.toLowerCase();

  for (const word of words) {
    const index = lowerContent.indexOf(word);
    if (index !== -1) {
      const start = Math.max(0, index - 50);
      const end = Math.min(content.length, index + word.length + 50);
      return '...' + content.substring(start, end) + '...';
    }
  }

  return content.substring(0, 100) + '...';
}

/**
 * Build search index from paths
 * @param {string[]} paths - Paths to index
 * @param {object} options - Build options
 * @returns {Promise<object>} Built index
 */
async function buildSearchIndex(paths, options = {}) {
  const { persist = false, path: persistPath, incremental = false } = options;

  // Check for existing index if incremental
  if (incremental && persistPath) {
    try {
      const existing = await loadSearchIndex(persistPath);
      if (existing) {
        currentIndex = existing;
        return existing;
      }
    } catch (e) {
      // No existing index, build new one
    }
  }

  // Build new index
  await indexContent(paths);

  const indexResult = {
    documents: currentIndex.documents,
    embeddings: currentIndex.embeddings,
    timestamp: currentIndex.timestamp
  };

  // Persist if requested
  if (persist && persistPath) {
    await fs.mkdir(persistPath, { recursive: true });
    await fs.writeFile(
      path.join(persistPath, 'index.json'),
      JSON.stringify(currentIndex)
    );
  }

  return indexResult;
}

/**
 * Load search index from disk
 * @param {string} indexPath - Path to index directory
 * @returns {Promise<object>} Loaded index
 */
async function loadSearchIndex(indexPath) {
  try {
    const data = await fs.readFile(path.join(indexPath, 'index.json'), 'utf-8');
    currentIndex = JSON.parse(data);
    return {
      documents: currentIndex.documents,
      embeddings: currentIndex.embeddings,
      timestamp: currentIndex.timestamp
    };
  } catch (error) {
    throw new Error(`Failed to load index from ${indexPath}`);
  }
}

/**
 * Get embedding for text (simplified local implementation)
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} Embedding vector
 */
async function getEmbedding(text) {
  // Simple TF-IDF-like embedding
  // In production, this would use a proper embedding model
  const words = text.toLowerCase().split(/\s+/);
  const wordFreq = {};

  words.forEach(word => {
    const clean = word.replace(/[^a-z0-9]/g, '');
    if (clean.length > 2) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });

  // Create a deterministic embedding based on word hashes
  const embedding = new Array(128).fill(0);

  Object.entries(wordFreq).forEach(([word, freq]) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % embedding.length;
    embedding[index] += freq / words.length;
  });

  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude;
    }
  }

  return embedding;
}

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vec1 - First vector
 * @param {number[]} vec2 - Second vector
 * @returns {number} Similarity score (0-1)
 */
function cosineSimilarity(vec1, vec2) {
  // Handle different length vectors
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
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

/**
 * Clear the current index
 */
function clearIndex() {
  currentIndex = null;
  indexCache.clear();
}

module.exports = {
  analyzeSemanticSearch,
  indexContent,
  semanticSearch,
  buildSearchIndex,
  loadSearchIndex,
  getEmbedding,
  cosineSimilarity,
  clearIndex
};
