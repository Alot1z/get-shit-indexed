/**
 * @fileoverview Core Engine unified API
 * Exports all integrated modules with unified interface
 * Part of Phase 50A: Core Engine Integration
 */

// Import all modules
const filesToPromptModule = require('./files-to-prompt');
const semanticSearchModule = require('./semantic-search');
const codegraphModule = require('./codegraph');
const fastcodeModule = require('./fastcode');
const searchIndexModule = require('./search-index');

// Version information
const version = '1.0.0';

// Re-export all functions with unified API
const exports_ = {
  // Version
  version,

  // Files-to-prompt functions
  filesToPrompt: filesToPromptModule.filesToPrompt,
  analyzeRepository: filesToPromptModule.analyzeRepository,
  convertToCxml: filesToPromptModule.convertToCxml,
  parseIncludePatterns: filesToPromptModule.parseIncludePatterns,

  // Semantic search functions
  semanticSearch: semanticSearchModule.semanticSearch,
  indexContent: semanticSearchModule.indexContent,
  getEmbedding: semanticSearchModule.getEmbedding,
  cosineSimilarity: semanticSearchModule.cosineSimilarity,

  // CodeGraph functions
  codeGraph: codegraphModule,
  queryGraph: codegraphModule.queryGraph,
  findCallers: codegraphModule.findCallers,
  detectCircularDependencies: codegraphModule.detectCircularDependencies,
  cachedQuery: codegraphModule.cachedQuery,
  getCacheStats: codegraphModule.getCacheStats,
  clearGraphCache: codegraphModule.clearGraphCache,

  // Search index functions
  buildSearchIndex: searchIndexModule.buildSearchIndex,
  loadSearchIndex: searchIndexModule.loadSearchIndex,
  updateIndex: searchIndexModule.updateIndex,
  getIndexStats: searchIndexModule.getIndexStats,

  // FastCode functions
  fastCode: fastcodeModule,
  fastReadFile: fastcodeModule.fastReadFile,
  fastWriteFile: fastcodeModule.fastWriteFile,
  fastGlob: fastcodeModule.fastGlob,
  catalogFastCodePatterns: fastcodeModule.catalogFastCodePatterns,
  getOptimizationFor: fastcodeModule.getOptimizationFor,
  applyOptimization: fastcodeModule.applyOptimization
};

// Support both CommonJS and ES modules
module.exports = exports_;
// ES module named exports
module.exports.default = exports_;
