/**
 * Pattern Storage
 * 
 * Stores and retrieves learned patterns from .planning/patterns/ directory.
 */

const fs = require('fs');
const path = require('path');

const PATTERNS_DIR = path.join(__dirname, '../../.planning/patterns');

/**
 * Store a pattern
 * @param {string} type - Pattern type (sequences, conditions, optimizations)
 * @param {object} pattern - Pattern to store
 * @returns {Promise<boolean>} Success status
 */
async function storePattern(type, pattern) {
  try {
    const filePath = path.join(PATTERNS_DIR, `${type}.json`);

    // Read existing patterns
    let patterns = [];
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      patterns = JSON.parse(content);
    }

    // Add timestamp if not present
    if (!pattern.timestamp) {
      pattern.timestamp = new Date().toISOString();
    }

    // Add ID if not present
    if (!pattern.id) {
      pattern.id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Check for duplicates
    const isDuplicate = patterns.some(p => {
      if (type === 'sequences') {
        return JSON.stringify(p.operations) === JSON.stringify(pattern.operations);
      } else if (type === 'conditions') {
        return p.feature === pattern.feature && p.type === pattern.type;
      } else if (type === 'optimizations') {
        return p.tool === pattern.tool && p.suggestion === pattern.suggestion;
      }
      return false;
    });

    if (isDuplicate) {
      // Update frequency instead of adding duplicate
      const index = patterns.findIndex(p => {
        if (type === 'sequences') {
          return JSON.stringify(p.operations) === JSON.stringify(pattern.operations);
        } else if (type === 'conditions') {
          return p.feature === pattern.feature && p.type === pattern.type;
        } else if (type === 'optimizations') {
          return p.tool === pattern.tool && p.suggestion === pattern.suggestion;
        }
        return false;
      });

      if (index !== -1) {
        patterns[index].frequency = (patterns[index].frequency || 1) + 1;
        patterns[index].lastSeen = new Date().toISOString();
      }
    } else {
      // Add new pattern
      patterns.push(pattern);
    }

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(patterns, null, 2), 'utf8');

    return true;
  } catch (error) {
    console.error(`Failed to store pattern: ${error.message}`);
    return false;
  }
}

/**
 * Get patterns by type
 * @param {string} type - Pattern type (sequences, conditions, optimizations)
 * @param {object} filter - Optional filter criteria
 * @returns {Promise<Array>} Filtered patterns
 */
async function getPatterns(type, filter = {}) {
  try {
    const filePath = path.join(PATTERNS_DIR, `${type}.json`);

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let patterns = JSON.parse(content);

    // Apply filters
    if (filter.tool) {
      patterns = patterns.filter(p => p.tool === filter.tool);
    }

    if (filter.minFrequency) {
      patterns = patterns.filter(p => (p.frequency || 1) >= filter.minFrequency);
    }

    if (filter.minConfidence) {
      patterns = patterns.filter(p => (p.confidence || 0) >= filter.minConfidence);
    }

    if (filter.limit) {
      patterns = patterns.slice(0, filter.limit);
    }

    // Sort by frequency/confidence descending
    patterns.sort((a, b) => {
      const aScore = (a.frequency || 1) * (a.confidence || 1);
      const bScore = (b.frequency || 1) * (b.confidence || 1);
      return bScore - aScore;
    });

    return patterns;
  } catch (error) {
    console.error(`Failed to get patterns: ${error.message}`);
    return [];
  }
}

/**
 * Get all patterns across all types
 * @param {object} filter - Optional filter criteria
 * @returns {Promise<object>} All patterns
 */
async function getAllPatterns(filter = {}) {
  const sequences = await getPatterns('sequences', filter);
  const conditions = await getPatterns('conditions', filter);
  const optimizations = await getPatterns('optimizations', filter);

  return {
    sequences,
    conditions,
    optimizations
  };
}

/**
 * Prune old patterns
 * @param {number} maxAge - Maximum age in milliseconds (default: 30 days)
 * @returns {Promise<number>} Number of patterns pruned
 */
async function pruneOldPatterns(maxAge = 30 * 24 * 60 * 60 * 1000) {
  const now = Date.now();
  let prunedCount = 0;

  const types = ['sequences', 'conditions', 'optimizations'];

  for (const type of types) {
    try {
      const filePath = path.join(PATTERNS_DIR, `${type}.json`);

      if (!fs.existsSync(filePath)) {
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      let patterns = JSON.parse(content);

      const originalLength = patterns.length;

      // Filter out old patterns
      patterns = patterns.filter(p => {
        const timestamp = p.timestamp || p.firstSeen || p.lastSeen;
        if (!timestamp) return true; // Keep if no timestamp

        const age = now - new Date(timestamp).getTime();
        return age < maxAge || (p.frequency || 1) >= 5; // Keep if recent or high frequency
      });

      // Write back
      fs.writeFileSync(filePath, JSON.stringify(patterns, null, 2), 'utf8');

      prunedCount += originalLength - patterns.length;
    } catch (error) {
      console.error(`Failed to prune ${type}: ${error.message}`);
    }
  }

  return prunedCount;
}

/**
 * Get pattern statistics
 * @returns {Promise<object>} Pattern statistics
 */
async function getPatternStats() {
  const sequences = await getPatterns('sequences');
  const conditions = await getPatterns('conditions');
  const optimizations = await getPatterns('optimizations');

  return {
    totalSequences: sequences.length,
    totalConditions: conditions.length,
    totalOptimizations: optimizations.length,
    totalPatterns: sequences.length + conditions.length + optimizations.length,
    topSequences: sequences.slice(0, 5),
    topConditions: conditions.slice(0, 5),
    topOptimizations: optimizations.slice(0, 5)
  };
}

module.exports = {
  storePattern,
  getPatterns,
  getAllPatterns,
  pruneOldPatterns,
  getPatternStats
};
