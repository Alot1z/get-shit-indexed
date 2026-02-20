/**
 * @fileoverview Search index builder module
 * Provides index persistence and management
 * Part of Phase 50A: Core Engine Integration
 */

const fs = require('fs').promises;
const path = require('path');

// Import semantic search for embedding generation
let semanticSearch = null;
try {
  semanticSearch = require('./semantic-search');
} catch (e) {
  // Module not available
}

// Current index reference
let currentStats = {
  documentCount: 0,
  embeddingSize: 128,
  lastUpdated: null
};

/**
 * Build search index from paths
 * @param {string[]} paths - Paths to index
 * @param {object} options - Build options
 * @returns {Promise<object>} Built index metadata
 */
async function buildSearchIndex(paths, options = {}) {
  const { persist = false, path: persistPath, incremental = false } = options;

  // Check for existing index if incremental
  if (incremental && persistPath) {
    try {
      const existing = await loadSearchIndex(persistPath);
      if (existing) {
        return existing;
      }
    } catch (e) {
      // No existing index, build new one
    }
  }

  // Use semantic search to build index if available
  let documents = 0;
  let embeddings = [];

  if (semanticSearch) {
    documents = await semanticSearch.indexContent(paths);
    const index = semanticSearch.buildSearchIndex ? await semanticSearch.buildSearchIndex(paths) : null;
    if (index) {
      embeddings = index.embeddings || [];
    }
  } else {
    // Fallback: simple file counting
    documents = await countDocuments(paths);
  }

  // Update stats
  currentStats = {
    documentCount: documents,
    embeddingSize: embeddings.length > 0 ? embeddings[0].length : 128,
    lastUpdated: new Date().toISOString()
  };

  const indexResult = {
    documents,
    embeddings,
    timestamp: Date.now()
  };

  // Persist if requested
  if (persist && persistPath) {
    await fs.mkdir(persistPath, { recursive: true });
    await fs.writeFile(
      path.join(persistPath, 'index.json'),
      JSON.stringify({
        ...indexResult,
        stats: currentStats
      })
    );
  }

  return indexResult;
}

/**
 * Count documents in paths
 * @param {string[]} paths - Paths to count
 * @returns {Promise<number>} Document count
 */
async function countDocuments(paths) {
  let count = 0;

  for (const p of paths) {
    try {
      const stats = await fs.stat(p);

      if (stats.isFile()) {
        count++;
      } else if (stats.isDirectory()) {
        const files = await countDirectoryFiles(p);
        count += files;
      }
    } catch (e) {
      // Skip invalid paths
    }
  }

  return count;
}

/**
 * Count files in a directory recursively
 * @param {string} dirPath - Directory path
 * @returns {Promise<number>} File count
 */
async function countDirectoryFiles(dirPath) {
  let count = 0;

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);

      if (entry.isFile()) {
        count++;
      } else if (entry.isDirectory()) {
        count += await countDirectoryFiles(fullPath);
      }
    }
  } catch (e) {
    // Skip directories that can't be read
  }

  return count;
}

/**
 * Load search index from disk
 * @param {string} indexPath - Path to index directory
 * @returns {Promise<object>} Loaded index
 */
async function loadSearchIndex(indexPath) {
  try {
    const data = await fs.readFile(path.join(indexPath, 'index.json'), 'utf-8');
    const parsed = JSON.parse(data);

    // Update stats
    if (parsed.stats) {
      currentStats = parsed.stats;
    }

    return {
      documents: parsed.documents,
      embeddings: parsed.embeddings,
      timestamp: parsed.timestamp
    };
  } catch (error) {
    throw new Error(`Failed to load index from ${indexPath}: ${error.message}`);
  }
}

/**
 * Update existing index with new content
 * @param {string} indexPath - Path to existing index
 * @param {string[]} newPaths - New paths to add
 * @returns {Promise<object>} Updated index
 */
async function updateIndex(indexPath, newPaths) {
  // Load existing index
  const existing = await loadSearchIndex(indexPath);

  // Build index for new content
  const newDocs = await countDocuments(newPaths);

  // Merge (simplified - real implementation would merge embeddings)
  const updated = {
    documents: existing.documents + newDocs,
    embeddings: existing.embeddings,
    timestamp: Date.now()
  };

  // Persist updated index
  await fs.writeFile(
    path.join(indexPath, 'index.json'),
    JSON.stringify({
      ...updated,
      stats: {
        documentCount: updated.documents,
        embeddingSize: currentStats.embeddingSize,
        lastUpdated: new Date().toISOString()
      }
    })
  );

  return updated;
}

/**
 * Get index statistics
 * @returns {object} Index stats
 */
function getIndexStats() {
  return { ...currentStats };
}

module.exports = {
  buildSearchIndex,
  loadSearchIndex,
  updateIndex,
  getIndexStats
};
