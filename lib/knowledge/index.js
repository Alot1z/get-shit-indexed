/**
 * @fileoverview Knowledge System - Main Entry Point
 * Unified API for semantic embeddings, context management, and skill composition
 * Part of Phase 50C: Knowledge System Integration
 * 
 * This module integrates:
 * - txtai: Semantic embeddings for knowledge search
 * - arscontexta: Context lifecycle and storage management
 * - skill-compose: Skill composition from primitives
 * 
 * @module knowledge-system
 * @version 1.0.0
 */

// Txtai - Embedding-based knowledge
const txtai = require('./txtai');
const semanticIndex = require('./semantic-index');
const graphSync = require('./graph-sync');

// Arscontexta - Context management
const arscontexta = require('./arscontexta');
const contextCompress = require('./context-compress');
const contextCache = require('./context-cache');

// Skill-compose - Skill composition
const skillCompose = require('./skill-compose');
const skillRegistry = require('./skill-registry');

// Version information
const version = '1.0.0';

/**
 * Initialize the knowledge system
 * @param {object} config - Configuration options
 * @returns {object} Initialized components
 */
function initialize(config = {}) {
  const {
    maxContextTokens = 8000,
    cacheMaxSize = 100,
    embeddingDimension = 128
  } = config;

  // Create context manager
  const contextManager = arscontexta.createContextManager({
    maxTokens: maxContextTokens
  });

  // Create caches
  const contextCacheInstance = contextCache.createLRUCache({
    maxSize: cacheMaxSize
  });

  // Create skill registry
  const skills = skillRegistry.createSkillRegistry();

  return {
    contextManager,
    cache: contextCacheInstance,
    skills,
    config: {
      maxContextTokens,
      cacheMaxSize,
      embeddingDimension
    }
  };
}

/**
 * Analyze all knowledge system components
 * @returns {Promise<object>} Analysis of all components
 */
async function analyzeAll() {
  const [txtaiAnalysis, arscontextaAnalysis, skillComposeAnalysis] = await Promise.all([
    txtai.analyzeTxtai(),
    arscontexta.analyzeArscontexta(),
    skillCompose.analyzeSkillCompose()
  ]);

  return {
    txtai: txtaiAnalysis,
    arscontexta: arscontextaAnalysis,
    skillCompose: skillComposeAnalysis,
    version,
    analyzed: new Date().toISOString()
  };
}

/**
 * Create a semantic knowledge index
 * @param {Array} documents - Initial documents
 * @returns {Promise<object>} Semantic index
 */
async function createKnowledgeIndex(documents = []) {
  return semanticIndex.createSemanticIndex({ documents });
}

/**
 * Search knowledge index semantically
 * @param {object} index - Knowledge index
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<Array>} Search results
 */
async function searchKnowledge(index, query, options = {}) {
  return semanticIndex.searchIndex(index, query, options);
}

/**
 * Optimize context for token budget
 * @param {object} context - Context to optimize
 * @param {number} tokenBudget - Maximum tokens
 * @param {object} options - Optimization options
 * @returns {Promise<object>} Optimized context
 */
async function optimizeContext(context, tokenBudget, options = {}) {
  // Use context management to fit within budget
  const managed = arscontexta.manageContextWindow(context, {
    maxTokens: tokenBudget,
    ...options
  });

  // Compress if still over budget
  if (managed.totalTokens > tokenBudget) {
    const compressed = await contextCompress.compress(managed, {
      targetRatio: 1 - (tokenBudget / managed.totalTokens),
      preserve: options.preserve || []
    });
    return compressed.compressed;
  }

  return managed;
}

/**
 * Compose skills into a workflow
 * @param {string[]} skillNames - Skills to compose
 * @param {object} options - Composition options
 * @returns {object} Composed skill
 */
function composeSkillWorkflow(skillNames, options = {}) {
  return skillCompose.composeSkills(skillNames, options);
}

/**
 * Register a skill in the global registry
 * @param {object} skill - Skill to register
 */
function registerGlobalSkill(skill) {
  skillCompose.registerSkill(skill);
}

/**
 * Get system metrics
 * @returns {object} System metrics
 */
function getMetrics() {
  return {
    compression: contextCompress.getCompressionStats(),
    version
  };
}

// Re-export all modules for direct access
module.exports = {
  // Version
  version,

  // Main API
  initialize,
  analyzeAll,
  createKnowledgeIndex,
  searchKnowledge,
  optimizeContext,
  composeSkillWorkflow,
  registerGlobalSkill,
  getMetrics,

  // Txtai - Embeddings
  txtai: {
    analyze: txtai.analyzeTxtai,
    generateEmbedding: txtai.generateEmbedding,
    createIndex: txtai.createEmbeddingIndex,
    search: txtai.searchEmbeddings,
    normalize: txtai.normalizeEmbedding,
    batch: txtai.batchEmbeddings,
    cosineSimilarity: txtai.cosineSimilarity
  },

  // Semantic Index
  semanticIndex: {
    create: semanticIndex.createSemanticIndex,
    add: semanticIndex.addToIndex,
    search: semanticIndex.searchIndex,
    remove: semanticIndex.removeFromIndex,
    getStats: semanticIndex.getIndexStats,
    persist: semanticIndex.persistIndex,
    load: semanticIndex.loadIndex
  },

  // Graph Sync
  graphSync: {
    analyze: graphSync.analyzeGraphSync,
    sync: graphSync.syncEmbeddingsToGraph,
    getEmbedding: graphSync.getGraphEmbedding,
    findSimilar: graphSync.findSimilarNodes,
    updateEmbedding: graphSync.updateNodeEmbedding,
    createLink: graphSync.createEmbeddingLink,
    getStats: graphSync.getSyncStats
  },

  // Arscontexta - Context Management
  arscontexta: {
    analyze: arscontexta.analyzeArscontexta,
    createManager: arscontexta.createContextManager,
    createPriorityContext: arscontexta.createPriorityContext,
    manageWindow: arscontexta.manageContextWindow,
    compress: arscontexta.compressContext,
    decompress: arscontexta.decompressContext,
    prioritize: arscontexta.prioritizeContextItems,
    createCache: arscontexta.createContextCache,
    validate: arscontexta.validateContextIntegrity
  },

  // Context Compression
  contextCompress: {
    analyze: contextCompress.analyzeCompression,
    compress: contextCompress.compress,
    decompress: contextCompress.decompress,
    estimateTokens: contextCompress.estimateTokens,
    getRatio: contextCompress.getCompressionRatio,
    getStats: contextCompress.getCompressionStats
  },

  // Context Cache
  contextCache: {
    createLRU: contextCache.createLRUCache,
    createTiered: contextCache.createTieredCache,
    getStats: contextCache.getCacheStats,
    clear: contextCache.clearCache,
    optimizeSize: contextCache.optimizeCacheSize
  },

  // Skill Compose
  skillCompose: {
    analyze: skillCompose.analyzeSkillCompose,
    createComposer: skillCompose.createSkillComposer,
    compose: skillCompose.composeSkills,
    register: skillCompose.registerSkill,
    getRegistry: skillCompose.getSkillRegistry,
    createWorkflow: skillCompose.createWorkflow,
    validateWorkflow: skillCompose.validateWorkflow,
    executeWorkflow: skillCompose.executeWorkflow,
    decompose: skillCompose.decomposeSkill,
    mergeOutputs: skillCompose.mergeSkillOutputs
  },

  // Skill Registry
  skillRegistry: {
    create: skillRegistry.createSkillRegistry,
    register: skillRegistry.registerSkill,
    get: skillRegistry.getSkill,
    list: skillRegistry.listSkills,
    search: skillRegistry.searchSkills,
    getMetadata: skillRegistry.getSkillMetadata,
    validate: skillRegistry.validateSkill
  }
};
