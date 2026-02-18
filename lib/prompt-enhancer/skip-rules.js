/**
 * Skip Rules Implementation
 * Detects prompts that should not be enhanced
 */

// Single-word prompts to always skip
const SINGLE_WORD_SKIPS = new Set([
  'continue', 'yes', 'no', 'ok', 'okay', 'done', 'sure',
  'proceed', 'go', 'next', 'skip', 'pass', 'fine', 'good',
  'right', 'correct', 'exactly', 'agreed', 'understood',
  'y', 'n', 'yea', 'yeah', 'yep', 'nope', 'nah'
]);

// Regex patterns for skip detection
const SKIP_PATTERNS = [
  // Empty or whitespace only
  { pattern: /^\s*$/, reason: 'empty', priority: 1 },
  
  // Single word
  { pattern: /^\w{1,20}$/, reason: 'single-word', priority: 2 },
  
  // URL only
  { pattern: /^https?:\/\/[^\s]+$/i, reason: 'url-only', priority: 3 },
  
  // Code block only (entire message is code)
  { pattern: /^```[\s\S]*```$/, reason: 'code-block-only', priority: 4 },
  
  // File path only
  { pattern: /^[\w./\\-]+\.(js|ts|py|md|json|yaml|yml)$/i, reason: 'file-path', priority: 5 },
  
  // Number only
  { pattern: /^\d+$/, reason: 'number-only', priority: 6 }
];

// Follow-up indicators (lower priority, context-dependent)
const FOLLOW_UP_PATTERNS = [
  /^ok[,.]?\s*/i,
  /^got it[,.]?\s*/i,
  /^understood[,.]?\s*/i,
  /^thanks?($|[,.])/i,
  /^great[,.]?\s*/i,
  /^perfect[,.]?\s*/i,
  /^sounds good/i,
  /^that works/i
];

/**
 * Check if prompt should be skipped
 * @param {string} prompt - User prompt
 * @param {object} context - Additional context
 * @returns {object} { skip: boolean, reason: string, confidence: number }
 */
function shouldSkip(prompt, context = {}) {
  // Check for explicit skip flag
  if (context.forceSkip || prompt.includes('--no-enhance')) {
    return { skip: true, reason: 'explicit-flag', confidence: 1.0 };
  }
  
  // Empty check
  if (!prompt || typeof prompt !== 'string') {
    return { skip: true, reason: 'invalid-input', confidence: 1.0 };
  }
  
  const trimmed = prompt.trim();
  
  // Check single-word skips
  const lowerPrompt = trimmed.toLowerCase();
  if (SINGLE_WORD_SKIPS.has(lowerPrompt)) {
    return { skip: true, reason: 'single-word', confidence: 1.0 };
  }
  
  // Check patterns by priority
  const sortedPatterns = [...SKIP_PATTERNS].sort((a, b) => a.priority - b.priority);
  for (const { pattern, reason } of sortedPatterns) {
    if (pattern.test(trimmed)) {
      return { skip: true, reason, confidence: 0.95 };
    }
  }
  
  // Check follow-up patterns (lower confidence)
  for (const pattern of FOLLOW_UP_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { 
        skip: context.conversationLength > 3, // Only skip in long conversations
        reason: 'follow-up', 
        confidence: 0.7 
      };
    }
  }
  
  // No skip detected
  return { skip: false, reason: null, confidence: 1.0 };
}

/**
 * Check if prompt is primarily code
 * @param {string} prompt - User prompt
 * @returns {object} { isCode: boolean, codeRatio: number, language: string }
 */
function detectCodeSnippet(prompt) {
  const lines = prompt.split('\n');
  let codeLines = 0;
  let inCodeBlock = false;
  let detectedLanguage = null;
  
  for (const line of lines) {
    // Check for code block markers
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) {
        // Extract language from opening marker
        const match = line.match(/```(\w+)?/);
        if (match && match[1]) {
          detectedLanguage = match[1];
        }
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeLines++;
      continue;
    }
    
    // Check for inline code patterns
    if (line.includes('function ') || 
        line.includes('const ') ||
        line.includes('import ') ||
        line.includes('export ') ||
        line.includes('return ') ||
        line.includes('class ') ||
        /^[{\[\(]/.test(line.trim())) {
      codeLines++;
    }
  }
  
  const codeRatio = lines.length > 0 ? codeLines / lines.length : 0;
  
  return {
    isCode: codeRatio > 0.7,
    codeRatio,
    language: detectedLanguage
  };
}

/**
 * Check if prompt is a URL
 * @param {string} prompt - User prompt
 * @returns {object} { isUrl: boolean, url: string }
 */
function detectUrl(prompt) {
  const trimmed = prompt.trim();
  const urlPattern = /^https?:\/\/[^\s]+$/i;
  
  if (urlPattern.test(trimmed)) {
    return { isUrl: true, url: trimmed };
  }
  
  // Check for URL in text
  const urlMatch = trimmed.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    return { isUrl: false, containsUrl: true, url: urlMatch[0] };
  }
  
  return { isUrl: false, url: null };
}

/**
 * Detect if prompt is a follow-up response
 * @param {string} prompt - User prompt
 * @param {object} conversationContext - Conversation state
 * @returns {object} { isFollowUp: boolean, type: string }
 */
function detectFollowUp(prompt, conversationContext = {}) {
  const trimmed = prompt.trim().toLowerCase();
  const { lastEnhanced, turnCount = 0 } = conversationContext;
  
  // Short acknowledgment
  if (trimmed.length < 10 && /^(ok|yes|no|sure|done|got it|thanks?)/i.test(trimmed)) {
    return { isFollowUp: true, type: 'acknowledgment' };
  }
  
  // Agreement patterns
  if (/^(sounds good|that works|perfect|great|agreed|exactly)/i.test(trimmed)) {
    return { isFollowUp: true, type: 'agreement' };
  }
  
  // Continuation requests
  if (/^(continue|keep going|next|proceed|go ahead)/i.test(trimmed)) {
    return { isFollowUp: true, type: 'continuation' };
  }
  
  // Simple questions that don't need enhancement
  if (/^(what|why|how|when|where)\s+(about|else|now)\??$/i.test(trimmed)) {
    return { isFollowUp: true, type: 'simple-question' };
  }
  
  // Context: recently enhanced, likely follow-up
  if (lastEnhanced && turnCount < 3) {
    if (trimmed.length < 20) {
      return { isFollowUp: true, type: 'short-response', confidence: 0.6 };
    }
  }
  
  return { isFollowUp: false, type: null };
}

/**
 * Get skip decision based on multiple factors
 * @param {string} prompt - User prompt
 * @param {object} context - Full context
 * @returns {object} Skip decision with reasoning
 */
function getSkipDecision(prompt, context = {}) {
  // Basic skip check
  const basicSkip = shouldSkip(prompt, context);
  if (basicSkip.skip && basicSkip.confidence > 0.8) {
    return basicSkip;
  }
  
  // Code detection
  const codeResult = detectCodeSnippet(prompt);
  if (codeResult.isCode) {
    return { 
      skip: true, 
      reason: 'code-snippet', 
      confidence: 0.9,
      metadata: { language: codeResult.language }
    };
  }
  
  // URL detection
  const urlResult = detectUrl(prompt);
  if (urlResult.isUrl) {
    return { skip: true, reason: 'url-only', confidence: 1.0 };
  }
  
  // Follow-up detection (context-dependent)
  const followUpResult = detectFollowUp(prompt, context);
  if (followUpResult.isFollowUp && context.conversationLength > 3) {
    return { 
      skip: true, 
      reason: `follow-up-${followUpResult.type}`, 
      confidence: 0.7 
    };
  }
  
  // Combine with basic skip (lower confidence)
  if (basicSkip.skip) {
    return basicSkip;
  }
  
  return { skip: false, reason: null, confidence: 1.0 };
}

/**
 * Default skip configuration
 */
const DEFAULT_CONFIG = {
  skipSingleWords: true,
  skipCodeSnippets: true,
  skipUrls: true,
  skipFollowUps: true,
  followUpThreshold: 3, // Conversation turns before skipping follow-ups
  codeRatioThreshold: 0.7,
  customSkipWords: [],
  customSkipPatterns: []
};

let currentConfig = { ...DEFAULT_CONFIG };

/**
 * Configure skip rules
 * @param {object} config - Configuration options
 */
function configureSkipRules(config = {}) {
  currentConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    // Merge custom words/patterns
    customSkipWords: [...DEFAULT_CONFIG.customSkipWords, ...(config.customSkipWords || [])],
    customSkipPatterns: [...DEFAULT_CONFIG.customSkipPatterns, ...(config.customSkipPatterns || [])]
  };
}

/**
 * Get current configuration
 * @returns {object} Current skip configuration
 */
function getSkipConfig() {
  return { ...currentConfig };
}

/**
 * Add custom skip word
 * @param {string} word - Word to skip
 */
function addSkipWord(word) {
  const lower = word.toLowerCase();
  if (!SINGLE_WORD_SKIPS.has(lower)) {
    SINGLE_WORD_SKIPS.add(lower);
    currentConfig.customSkipWords.push(lower);
  }
}

/**
 * Add custom skip pattern
 * @param {RegExp} pattern - Pattern to skip
 * @param {string} reason - Reason for skip
 */
function addSkipPattern(pattern, reason) {
  SKIP_PATTERNS.push({ pattern, reason, priority: 99 });
  currentConfig.customSkipPatterns.push({ pattern: pattern.source, reason });
}

module.exports = {
  // Main functions
  shouldSkip,
  getSkipDecision,
  
  // Detection functions
  detectCodeSnippet,
  detectUrl,
  detectFollowUp,
  
  // Configuration
  configureSkipRules,
  getSkipConfig,
  addSkipWord,
  addSkipPattern,
  
  // Constants
  SINGLE_WORD_SKIPS,
  SKIP_PATTERNS,
  FOLLOW_UP_PATTERNS,
  DEFAULT_CONFIG
};
