/**
 * Enhancement Template Tests
 */

const { rewrite, selectTemplate } = require('../prompt-rewriter');
const { TEMPLATE_TYPES } = require('../enhancement-templates');

describe('Enhancement Templates', () => {
  describe('rewrite', () => {
    test('CLARITY template adds specificity', () => {
      const result = rewrite('test', TEMPLATE_TYPES.CLARITY);
      expect(result.enhanced).toContain('detailed explanation');
      expect(result.changed).toBe(true);
    });

    test('NONE template preserves original', () => {
      const result = rewrite('test', TEMPLATE_TYPES.NONE);
      expect(result.enhanced).toBe('test');
      expect(result.changed).toBe(false);
    });

    test('ENGINEERING template adds structure', () => {
      const result = rewrite('build a feature', TEMPLATE_TYPES.ENGINEERING);
      expect(result.enhanced).toContain('Architecture');
      expect(result.enhanced).toContain('Implementation');
      expect(result.changed).toBe(true);
    });

    test('ACADEMIC template adds theoretical framing', () => {
      const result = rewrite('analyze this', TEMPLATE_TYPES.ACADEMIC);
      expect(result.enhanced).toContain('theoretical');
      expect(result.enhanced).toContain('research');
    });

    test('DECOMPOSED template breaks down prompt', () => {
      const result = rewrite('implement X', TEMPLATE_TYPES.DECOMPOSED);
      expect(result.enhanced).toContain('Component analysis');
      expect(result.enhanced).toContain('Implementation steps');
    });

    test('returns metadata with result', () => {
      const result = rewrite('test', TEMPLATE_TYPES.CLARITY);
      expect(result).toHaveProperty('original');
      expect(result).toHaveProperty('enhanced');
      expect(result).toHaveProperty('template');
      expect(result).toHaveProperty('changed');
      expect(result).toHaveProperty('timestamp');
    });
  });

  describe('selectTemplate', () => {
    test('chooses ENGINEERING for implement', () => {
      const type = selectTemplate('implement feature X', 30);
      expect(type).toBe(TEMPLATE_TYPES.ENGINEERING);
    });

    test('chooses DECOMPOSED for complex prompts', () => {
      const type = selectTemplate('implement X and Y also Z with additional features', 30);
      expect(type).toBe(TEMPLATE_TYPES.DECOMPOSED);
    });

    test('chooses CLARITY for questions', () => {
      const type = selectTemplate('What is the best approach?', 30);
      expect(type).toBe(TEMPLATE_TYPES.CLARITY);
    });

    test('chooses SECURITY for security prompts', () => {
      const type = selectTemplate('check for vulnerabilities', 30);
      expect(type).toBe(TEMPLATE_TYPES.SECURITY);
    });

    test('chooses ACADEMIC for high risk', () => {
      const type = selectTemplate('explain something', 75);
      expect(type).toBe(TEMPLATE_TYPES.ACADEMIC);
    });
  });
});
