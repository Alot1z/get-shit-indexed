/**
 * Prompt Enhancer - Pattern Learning
 * 
 * Captures enhancement history and learns from patterns to improve
 * future enhancements.
 * 
 * @module lib/prompt-enhancer/learning
 */

const fs = require('fs');
const path = require('path');

/**
 * Default history file path
 */
const HISTORY_FILE = '.planning/enhancement-history.json';

/**
 * Load enhancement history from disk
 * 
 * @param {string} historyPath - Path to history file
 * @returns {Object} - History object with patterns and statistics
 */
function loadHistory(historyPath = HISTORY_FILE) {
  try {
    const content = fs.readFileSync(historyPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    // Return default structure if file doesn't exist
    return {
      patterns: [],
      statistics: {
        totalEnhancements: 0,
        avgImprovement: 0,
        topPatterns: [],
        acceptanceRate: 0,
        editRate: 0,
        skipRate: 0
      },
      version: '1.0.0',
      created: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }
}

/**
 * Save enhancement history to disk
 * 
 * @param {Object} history - History object to save
 * @param {string} historyPath - Path to history file
 */
function saveHistory(history, historyPath = HISTORY_FILE) {
  history.lastUpdated = new Date().toISOString().split('T')[0];
  
  const dir = path.dirname(historyPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

/**
 * Record an enhancement in history
 * 
 * @param {string} originalPrompt - The original user prompt
 * @param {string} enhancedPrompt - The enhanced prompt
 * @param {string} commandType - The command type (e.g., 'plan-phase')
 * @param {number} score - Enhancement score (0-10)
 * @param {string} outcome - 'accepted', 'edited', 'rejected', 'skipped'
 * @param {string} historyPath - Path to history file
 * @returns {Object} - The recorded pattern
 */
function recordEnhancement(originalPrompt, enhancedPrompt, commandType, score, outcome, historyPath = HISTORY_FILE) {
  const history = loadHistory(historyPath);
  
  // Create pattern record
  const pattern = {
    id: `pattern-${String(history.patterns.length + 1).padStart(3, '0')}`,
    command: commandType,
    originalPrompt: originalPrompt.slice(0, 200), // Truncate for storage
    enhancedPrompt: enhancedPrompt.slice(0, 500),
    pattern: extractPattern(originalPrompt, enhancedPrompt),
    score: score,
    outcome: outcome,
    successRate: outcome === 'accepted' ? 1.0 : (outcome === 'edited' ? 0.5 : 0),
    usageCount: 1,
    timestamp: new Date().toISOString()
  };
  
  // Add to history
  history.patterns.push(pattern);
  
  // Update statistics
  updateStatistics(history, outcome, score);
  
  // Save to disk
  saveHistory(history, historyPath);
  
  return pattern;
}

/**
 * Extract reusable pattern from enhancement diff
 * 
 * @param {string} originalPrompt - Original prompt
 * @param {string} enhancedPrompt - Enhanced prompt
 * @returns {string} - Extracted pattern description
 */
function extractPattern(originalPrompt, enhancedPrompt) {
  const additions = [];
  
  // Check for context section
  if (enhancedPrompt.includes('## Context')) {
    additions.push('Add context section');
  }
  
  // Check for requirements section
  if (enhancedPrompt.includes('## Detected Requirements')) {
    additions.push('Add detected requirements');
  }
  
  // Check for enhancement notes
  if (enhancedPrompt.includes('## Enhancement Notes')) {
    additions.push('Add enhancement notes with confidence');
  }
  
  // Check for phase context
  if (enhancedPrompt.match(/Phase \d+/)) {
    additions.push('Add phase context');
  }
  
  // Check for intent clarification
  if (enhancedPrompt.includes('Intent:')) {
    additions.push('Clarify user intent');
  }
  
  return additions.length > 0 ? additions.join(', ') : 'General enhancement';
}

/**
 * Update statistics after recording enhancement
 * 
 * @param {Object} history - History object to update
 * @param {string} outcome - Enhancement outcome
 * @param {number} score - Enhancement score
 */
function updateStatistics(history, outcome, score) {
  const stats = history.statistics;
  
  stats.totalEnhancements++;
  
  // Calculate running average improvement
  const currentAvg = stats.avgImprovement || 0;
  stats.avgImprovement = ((currentAvg * (stats.totalEnhancements - 1)) + score) / stats.totalEnhancements;
  
  // Update outcome rates
  const total = stats.totalEnhancements;
  if (outcome === 'accepted') {
    stats.acceptanceRate = ((stats.acceptanceRate * (total - 1)) + 1) / total;
    stats.editRate = (stats.editRate * (total - 1)) / total;
    stats.skipRate = (stats.skipRate * (total - 1)) / total;
  } else if (outcome === 'edited') {
    stats.acceptanceRate = (stats.acceptanceRate * (total - 1)) / total;
    stats.editRate = ((stats.editRate * (total - 1)) + 1) / total;
    stats.skipRate = (stats.skipRate * (total - 1)) / total;
  } else if (outcome === 'skipped') {
    stats.acceptanceRate = (stats.acceptanceRate * (total - 1)) / total;
    stats.editRate = (stats.editRate * (total - 1)) / total;
    stats.skipRate = ((stats.skipRate * (total - 1)) + 1) / total;
  }
  
  // Update top patterns
  updateTopPatterns(history);
}

/**
 * Update top patterns based on success rate and usage
 * 
 * @param {Object} history - History object
 */
function updateTopPatterns(history) {
  // Calculate pattern quality scores
  const patternScores = history.patterns.map(p => ({
    pattern: p.pattern,
    score: (p.successRate * 0.7) + (Math.min(p.usageCount / 10, 0.3))
  }));
  
  // Sort by score and get top 5 unique patterns
  const uniquePatterns = [...new Set(patternScores.map(p => p.pattern))];
  const patternMap = new Map();
  
  for (const ps of patternScores) {
    if (!patternMap.has(ps.pattern) || patternMap.get(ps.pattern) < ps.score) {
      patternMap.set(ps.pattern, ps.score);
    }
  }
  
  history.statistics.topPatterns = uniquePatterns
    .map(p => ({ pattern: p, score: patternMap.get(p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(p => p.pattern);
}

/**
 * Query enhancement patterns for similar prompts
 * 
 * @param {string} prompt - Prompt to match
 * @param {string} commandType - Optional command type filter
 * @param {number} limit - Maximum results to return
 * @param {string} historyPath - Path to history file
 * @returns {Array} - Matching patterns with similarity scores
 */
function queryEnhancementPatterns(prompt, commandType = null, limit = 5, historyPath = HISTORY_FILE) {
  const history = loadHistory(historyPath);
  
  // Filter by command type if specified
  let patterns = history.patterns;
  if (commandType) {
    patterns = patterns.filter(p => p.command === commandType);
  }
  
  // Calculate similarity scores
  const results = patterns.map(p => ({
    ...p,
    similarity: calculateSimilarity(prompt, p.originalPrompt)
  }));
  
  // Sort by similarity and success rate
  results.sort((a, b) => {
    const scoreA = a.similarity * 0.6 + a.successRate * 0.4;
    const scoreB = b.similarity * 0.6 + b.successRate * 0.4;
    return scoreB - scoreA;
  });
  
  return results.slice(0, limit);
}

/**
 * Calculate similarity between two prompts
 * 
 * @param {string} prompt1 - First prompt
 * @param {string} prompt2 - Second prompt
 * @returns {number} - Similarity score (0-1)
 */
function calculateSimilarity(prompt1, prompt2) {
  const words1 = new Set(prompt1.toLowerCase().split(/\s+/));
  const words2 = new Set(prompt2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Adapt enhancement threshold based on history
 * 
 * @param {number} currentThreshold - Current threshold (0-10)
 * @param {string} historyPath - Path to history file
 * @returns {Object} - { threshold, adjusted, reason }
 */
function adaptEnhancementThreshold(currentThreshold, historyPath = HISTORY_FILE) {
  const history = loadHistory(historyPath);
  
  // Need at least 10 enhancements to adapt
  if (history.statistics.totalEnhancements < 10) {
    return {
      threshold: currentThreshold,
      adjusted: false,
      reason: 'Insufficient data for adaptation'
    };
  }
  
  const stats = history.statistics;
  
  // If acceptance rate is high, we can be more aggressive
  if (stats.acceptanceRate > 0.8 && stats.avgImprovement > 5) {
    const newThreshold = Math.max(2, currentThreshold - 1);
    return {
      threshold: newThreshold,
      adjusted: newThreshold !== currentThreshold,
      reason: `High acceptance rate (${(stats.acceptanceRate * 100).toFixed(0)}%), lowered threshold`
    };
  }
  
  // If skip rate is high, be more conservative
  if (stats.skipRate > 0.3) {
    const newThreshold = Math.min(5, currentThreshold + 1);
    return {
      threshold: newThreshold,
      adjusted: newThreshold !== currentThreshold,
      reason: `High skip rate (${(stats.skipRate * 100).toFixed(0)}%), raised threshold`
    };
  }
  
  return {
    threshold: currentThreshold,
    adjusted: false,
    reason: 'Threshold within acceptable range'
  };
}

/**
 * Get pattern statistics for reporting
 * 
 * @param {string} historyPath - Path to history file
 * @returns {Object} - Statistics object
 */
function getPatternStatistics(historyPath = HISTORY_FILE) {
  const history = loadHistory(historyPath);
  return {
    totalEnhancements: history.statistics.totalEnhancements,
    avgImprovement: history.statistics.avgImprovement,
    acceptanceRate: history.statistics.acceptanceRate,
    editRate: history.statistics.editRate,
    skipRate: history.statistics.skipRate,
    topPatterns: history.statistics.topPatterns,
    patternCount: history.patterns.length
  };
}

module.exports = {
  loadHistory,
  saveHistory,
  recordEnhancement,
  extractPattern,
  queryEnhancementPatterns,
  calculateSimilarity,
  adaptEnhancementThreshold,
  getPatternStatistics,
  HISTORY_FILE
};
