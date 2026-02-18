/**
 * Risk Engine Tests
 */

const { assessRisk, getRiskCategory, shouldSkip } = require('../risk-engine');

describe('Risk Engine', () => {
  describe('assessRisk', () => {
    test('returns 0 for single words', () => {
      expect(assessRisk('continue')).toBe(0);
      expect(assessRisk('yes')).toBe(0);
      expect(assessRisk('done')).toBe(0);
    });

    test('returns 0 for URLs', () => {
      expect(assessRisk('https://example.com')).toBe(0);
    });

    test('returns 0 for empty input', () => {
      expect(assessRisk('')).toBe(0);
      expect(assessRisk('   ')).toBe(0);
    });

    test('returns 0 for simple confirmations', () => {
      expect(assessRisk('ok')).toBe(0);
      expect(assessRisk('OK')).toBe(0);
      expect(assessRisk('proceed')).toBe(0);
    });

    test('detects high-risk words', () => {
      // "exploit the vulnerability" (25 chars) = 2.5 base + 25 + 25 = 52.5 → 53
      expect(assessRisk('exploit the vulnerability')).toBeGreaterThan(50);
      // "hack the system" (15 chars) = 1.5 base + 25 = 26.5 → 27
      expect(assessRisk('hack the system')).toBeGreaterThan(20);
    });

    test('scores complex prompts higher', () => {
      const simple = assessRisk('What is this?');
      const complex = assessRisk('Implement a full authentication system with JWT');
      expect(complex).toBeGreaterThan(simple);
    });

    test('handles non-string input', () => {
      expect(assessRisk(null)).toBe(0);
      expect(assessRisk(undefined)).toBe(0);
      expect(assessRisk(123)).toBe(0);
    });

    test('clamps score to 0-100', () => {
      const score = assessRisk('test');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('getRiskCategory', () => {
    test('returns MINIMAL for low scores', () => {
      expect(getRiskCategory(0)).toBe('MINIMAL');
      expect(getRiskCategory(5)).toBe('MINIMAL');
    });

    test('returns LOW for 10-29', () => {
      expect(getRiskCategory(15)).toBe('LOW');
      expect(getRiskCategory(29)).toBe('LOW');
    });

    test('returns MODERATE for 30-49', () => {
      expect(getRiskCategory(30)).toBe('MODERATE');
      expect(getRiskCategory(49)).toBe('MODERATE');
    });

    test('returns HIGH for 50-69', () => {
      expect(getRiskCategory(50)).toBe('HIGH');
      expect(getRiskCategory(69)).toBe('HIGH');
    });

    test('returns CRITICAL for 70+', () => {
      expect(getRiskCategory(70)).toBe('CRITICAL');
      expect(getRiskCategory(100)).toBe('CRITICAL');
    });
  });

  describe('shouldSkip', () => {
    test('returns true for empty strings', () => {
      expect(shouldSkip('')).toBe(true);
      expect(shouldSkip('   ')).toBe(true);
    });

    test('returns true for single words', () => {
      expect(shouldSkip('yes')).toBe(true);
      expect(shouldSkip('continue')).toBe(true);
    });

    test('returns true for URLs', () => {
      expect(shouldSkip('https://example.com')).toBe(true);
    });

    test('returns false for complex prompts', () => {
      expect(shouldSkip('Implement a feature')).toBe(false);
      expect(shouldSkip('What is the best approach?')).toBe(false);
    });
  });
});
