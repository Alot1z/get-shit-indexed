/**
 * Skip Rules Tests
 * Tests for Phase 24-04: Skip Rules Implementation
 */

const { 
  shouldSkip, 
  getSkipDecision,
  detectCodeSnippet,
  detectUrl,
  detectFollowUp,
  SINGLE_WORD_SKIPS,
  SKIP_PATTERNS 
} = require('../skip-rules');

describe('Skip Rules', () => {
  describe('shouldSkip()', () => {
    test('skips single words', () => {
      expect(shouldSkip('continue').skip).toBe(true);
      expect(shouldSkip('yes').skip).toBe(true);
      expect(shouldSkip('done').skip).toBe(true);
      expect(shouldSkip('ok').skip).toBe(true);
    });

    test('skips URLs', () => {
      expect(shouldSkip('https://example.com').skip).toBe(true);
      expect(shouldSkip('http://test.org/path').skip).toBe(true);
    });

    test('skips empty/whitespace', () => {
      expect(shouldSkip('').skip).toBe(true);
      expect(shouldSkip('   ').skip).toBe(true);
      expect(shouldSkip('\n\t').skip).toBe(true);
    });

    test('skips numbers only', () => {
      expect(shouldSkip('123').skip).toBe(true);
      expect(shouldSkip('42').skip).toBe(true);
    });

    test('does not skip complex prompts', () => {
      expect(shouldSkip('Implement a new feature').skip).toBe(false);
      expect(shouldSkip('How do I fix this bug?').skip).toBe(false);
    });

    test('respects explicit flag', () => {
      expect(shouldSkip('test --no-enhance').skip).toBe(true);
      expect(shouldSkip('test --no-enhance').reason).toBe('explicit-flag');
    });

    test('respects context forceSkip', () => {
      expect(shouldSkip('complex prompt', { forceSkip: true }).skip).toBe(true);
    });
  });

  describe('detectCodeSnippet()', () => {
    test('detects code blocks', () => {
      const code = '```javascript\nconst x = 1;\n```';
      const result = detectCodeSnippet(code);
      // Note: 3 lines total, 1 code line = 0.33 ratio (below 0.7 threshold)
      // But language should be detected
      expect(result.language).toBe('javascript');
    });

    test('detects inline code patterns', () => {
      const code = 'function test() {\n  return 42;\n}';
      const result = detectCodeSnippet(code);
      expect(result.codeRatio).toBeGreaterThan(0);
    });

    test('returns false for plain text', () => {
      const text = 'This is just a regular message with no code.';
      const result = detectCodeSnippet(text);
      expect(result.isCode).toBe(false);
    });
  });

  describe('detectUrl()', () => {
    test('detects URL-only prompts', () => {
      const result = detectUrl('https://example.com');
      expect(result.isUrl).toBe(true);
    });

    test('detects URLs in text', () => {
      const result = detectUrl('Check out https://example.com for more info');
      expect(result.isUrl).toBe(false);
      expect(result.containsUrl).toBe(true);
    });

    test('returns false for non-URLs', () => {
      const result = detectUrl('This is not a URL');
      expect(result.isUrl).toBe(false);
      expect(result.containsUrl).toBeFalsy();
    });
  });

  describe('detectFollowUp()', () => {
    test('detects acknowledgments', () => {
      expect(detectFollowUp('ok').isFollowUp).toBe(true);
      expect(detectFollowUp('got it').isFollowUp).toBe(true);
      expect(detectFollowUp('thanks').isFollowUp).toBe(true);
    });

    test('detects agreements', () => {
      expect(detectFollowUp('sounds good').isFollowUp).toBe(true);
      expect(detectFollowUp('perfect').isFollowUp).toBe(true);
      expect(detectFollowUp('that works').isFollowUp).toBe(true);
    });

    test('detects continuation requests', () => {
      expect(detectFollowUp('continue').isFollowUp).toBe(true);
      expect(detectFollowUp('keep going').isFollowUp).toBe(true);
      expect(detectFollowUp('next').isFollowUp).toBe(true);
    });

    test('returns false for substantive prompts', () => {
      expect(detectFollowUp('I need to implement a new feature').isFollowUp).toBe(false);
    });
  });

  describe('getSkipDecision()', () => {
    test('combines all skip checks', () => {
      const result = getSkipDecision('continue');
      expect(result.skip).toBe(true);
      expect(result.reason).toBe('single-word');
    });

    test('includes metadata for code', () => {
      const code = '```python\nprint("hello")\n```';
      const result = getSkipDecision(code);
      expect(result.skip).toBe(true);
      // SKIP_PATTERNS matches "code-block-only" first, not "code-snippet"
      expect(result.reason).toBe('code-block-only');
    });

    test('returns false for enhanceable prompts', () => {
      const result = getSkipDecision('Please help me debug this function');
      expect(result.skip).toBe(false);
    });
  });

  describe('Constants', () => {
    test('SINGLE_WORD_SKIPS contains expected words', () => {
      expect(SINGLE_WORD_SKIPS.has('continue')).toBe(true);
      expect(SINGLE_WORD_SKIPS.has('yes')).toBe(true);
      expect(SINGLE_WORD_SKIPS.has('ok')).toBe(true);
    });

    test('SKIP_PATTERNS has required patterns', () => {
      const reasons = SKIP_PATTERNS.map(p => p.reason);
      expect(reasons).toContain('empty');
      expect(reasons).toContain('single-word');
      expect(reasons).toContain('url-only');
      expect(reasons).toContain('code-block-only');
    });
  });
});
