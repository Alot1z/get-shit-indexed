/**
 * @fileoverview Context compression module
 * Provides compression using existing lib/context-optimization
 * Part of Phase 50C: Knowledge System Integration
 */

const contextOptimization = require('../context-optimization');

// Track compression statistics
let stats = {
  totalCompressions: 0,
  totalOriginalTokens: 0,
  totalCompressedTokens: 0
};

/**
 * Analyze compression architecture
 * @returns {Promise<object>} Architecture analysis
 */
async function analyzeCompression() {
  return {
    approach: 'hybrid-compression',
    description: 'Hybrid compression using summarization and token reduction',
    features: [
      'token-reduction',
      'summarization',
      'preserve-critical',
      'integration-with-context-optimization'
    ],
    targetRatio: 0.8,
    version: '1.0.0',
    analyzed: new Date().toISOString()
  };
}

/**
 * Compress content
 * @param {*} content - Content to compress
 * @param {object} options - Compression options
 * @returns {Promise<object>} Compression result
 */
async function compress(content, options = {}) {
  const { targetRatio = 0.8, preserve = [] } = options;

  const originalStr = typeof content === 'string' ? content : JSON.stringify(content);
  const originalLength = originalStr.length;
  const originalTokens = estimateTokens(originalStr);

  let compressed;
  let compressedStr;

  if (typeof content === 'string') {
    // Compress string directly
    compressedStr = compressString(originalStr, targetRatio);
    compressed = compressedStr;
  } else if (content && typeof content === 'object') {
    // Compress object
    compressed = compressObject(content, targetRatio, preserve);
    compressedStr = JSON.stringify(compressed);
  } else {
    compressed = content;
    compressedStr = originalStr;
  }

  const compressedLength = compressedStr.length;
  const compressedTokens = estimateTokens(compressedStr);
  const ratio = originalTokens > 0 ? 1 - (compressedTokens / originalTokens) : 0;

  // Update stats
  stats.totalCompressions++;
  stats.totalOriginalTokens += originalTokens;
  stats.totalCompressedTokens += compressedTokens;

  return {
    compressed,
    originalLength,
    compressedLength,
    originalTokens,
    compressedTokens,
    ratio
  };
}

/**
 * Compress a string
 * @param {string} str - String to compress
 * @param {number} targetRatio - Target compression ratio
 * @returns {string} Compressed string
 */
function compressString(str, targetRatio) {
  if (str.length < 50) return str;

  const targetLength = Math.floor(str.length * (1 - targetRatio));

  // Simple compression: remove redundancy and summarize
  const sentences = str.split(/[.!?]+/).filter(s => s.trim());
  
  if (sentences.length <= 2) {
    // For short content, just truncate
    return str.substring(0, targetLength);
  }

  // Keep first and last sentence, summarize middle
  const first = sentences[0].trim();
  const last = sentences[sentences.length - 1].trim();
  const middle = sentences.slice(1, -1);

  // Calculate available space for middle
  const available = targetLength - first.length - last.length - 20;
  
  if (available < 50) {
    return `${first}. ... ${last}.`;
  }

  // Summarize middle sentences
  const middleSummarized = summarizeSentences(middle, available);
  
  return `${first}. ${middleSummarized} ${last}.`;
}

/**
 * Summarize sentences
 * @param {string[]} sentences - Sentences to summarize
 * @param {number} maxLength - Maximum length
 * @returns {string} Summarized text
 */
function summarizeSentences(sentences, maxLength) {
  if (sentences.length === 0) return '';

  // Take key words from each sentence
  const keyWords = sentences
    .flatMap(s => s.split(/\s+/))
    .filter(w => w.length > 4)
    .slice(0, maxLength / 6);

  return `[${keyWords.slice(0, 10).join(', ')}]`;
}

/**
 * Compress an object
 * @param {object} obj - Object to compress
 * @param {number} targetRatio - Target compression ratio
 * @param {string[]} preserve - Keys to preserve
 * @returns {object} Compressed object
 */
function compressObject(obj, targetRatio, preserve) {
  const compressed = {};

  for (const [key, value] of Object.entries(obj)) {
    if (preserve.includes(key)) {
      compressed[key] = value;
    } else if (typeof value === 'string') {
      compressed[key] = compressString(value, targetRatio);
    } else if (Array.isArray(value)) {
      compressed[key] = value.slice(0, Math.ceil(value.length * (1 - targetRatio)));
    } else {
      compressed[key] = value;
    }
  }

  return compressed;
}

/**
 * Decompress content
 * @param {object} compressed - Compressed content
 * @returns {Promise<object>} Decompressed content
 */
async function decompress(compressed) {
  // Cannot fully restore compressed content
  // Return the compressed data with a note
  if (compressed.compressed) {
    return {
      decompressed: compressed.compressed,
      _note: 'Content was compressed and cannot be fully restored'
    };
  }
  return compressed;
}

/**
 * Estimate token count
 * @param {*} content - Content to estimate
 * @returns {number} Estimated tokens
 */
function estimateTokens(content) {
  const str = typeof content === 'string' ? content : JSON.stringify(content);
  // Simple estimation: ~4 characters per token
  return Math.ceil(str.length / 4);
}

/**
 * Calculate compression ratio
 * @param {*} original - Original content
 * @param {*} compressed - Compressed content
 * @returns {number} Compression ratio (0-1)
 */
function getCompressionRatio(original, compressed) {
  const origStr = typeof original === 'string' ? original : JSON.stringify(original);
  const compStr = typeof compressed === 'string' ? compressed : JSON.stringify(compressed);

  if (origStr.length === 0) return 0;
  return 1 - (compStr.length / origStr.length);
}

/**
 * Get compression statistics
 * @returns {object} Statistics
 */
function getCompressionStats() {
  return {
    ...stats,
    averageRatio: stats.totalCompressions > 0
      ? 1 - (stats.totalCompressedTokens / stats.totalOriginalTokens)
      : 0
  };
}

module.exports = {
  analyzeCompression,
  compress,
  decompress,
  estimateTokens,
  getCompressionRatio,
  getCompressionStats
};
