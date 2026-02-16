/**
 * Risk Assessment Engine
 * Analyzes prompts for complexity and potential issues
 * Returns 0-100 risk score for local-only prompt enhancement
 */

const TRIGGER_WORDS = {
  // High-risk patterns (15 points each)
  high: [
    'exploit', 'hack', 'bypass', 'circumvent', 'vulnerability',
    'attack', 'inject', 'override', 'malicious', 'compromise'
  ],
  // Medium-risk patterns (8 points each)
  medium: [
    'debug', 'fix', 'error', 'issue', 'problem',
    'implement', 'create', 'build', 'develop', 'refactor',
    'optimize', 'integrate', 'configure', 'deploy'
  ]
};

const SKIP_PATTERNS = [
  /^$/,                    // Empty
  /^\s*$/,                 // Whitespace only
  /^\w+$/,                 // Single word
  /^https?:\/\//,          // URL only
  /^```[\s\S]*```$/,       // Code block only
  /^\d+$/,                 // Numbers only
  /^(yes|no|ok|done|continue|proceed|go|stop)$/i  // Simple confirmations
];

/**
 * Assess risk level of a prompt
 * @param {string} prompt - User prompt to analyze
 * @returns {number} Risk score 0-100
 */
function assessRisk(prompt) {
  // Handle non-string input
  if (typeof prompt !== 'string') {
    return 0;
  }

  const trimmed = prompt.trim();

  // 1. Check skip patterns - return 0 for simple inputs
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(trimmed)) {
      return 0;
    }
  }

  // 2. Calculate base score from length
  // Longer prompts are generally more complex
  let score = Math.min(30, trimmed.length / 10);

  // 3. Add trigger word weight
  const lowerPrompt = trimmed.toLowerCase();

  for (const word of TRIGGER_WORDS.high) {
    if (lowerPrompt.includes(word)) {
      score += 15;
    }
  }

  for (const word of TRIGGER_WORDS.medium) {
    if (lowerPrompt.includes(word)) {
      score += 8;
    }
  }

  // 4. Check for code indicators
  if (trimmed.includes('```') || /\bfunction\b/.test(trimmed)) {
    score += 10;
  }
  if (/\b(class|interface|type|const|let|var)\b/.test(trimmed)) {
    score += 5;
  }

  // 5. Check for multi-part requests (higher complexity)
  const conjunctionCount = (trimmed.match(/\b(and|also|then|next|finally)\b/gi) || []).length;
  score += conjunctionCount * 5;

  // 6. Check for questions (slightly lower risk - clearer intent)
  if (trimmed.includes('?')) {
    score -= 5;
  }

  // 7. Check for file paths (implementation intent)
  if (/[\/\\]/.test(trimmed) || /\.\w{1,4}$/.test(trimmed)) {
    score += 8;
  }

  // Clamp to 0-100 range
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Get risk category for a score
 * @param {number} score - Risk score 0-100
 * @returns {string} Risk category
 */
function getRiskCategory(score) {
  if (score < 10) return 'MINIMAL';
  if (score < 30) return 'LOW';
  if (score < 50) return 'MODERATE';
  if (score < 70) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Check if prompt should be skipped entirely
 * @param {string} prompt - Prompt to check
 * @returns {boolean} True if prompt should skip enhancement
 */
function shouldSkip(prompt) {
  if (typeof prompt !== 'string') return true;
  const trimmed = prompt.trim();
  return SKIP_PATTERNS.some(pattern => pattern.test(trimmed));
}

module.exports = {
  assessRisk,
  getRiskCategory,
  shouldSkip,
  TRIGGER_WORDS,
  SKIP_PATTERNS
};
