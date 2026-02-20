/**
 * Token Counter Unit Tests
 * Phase 26-01: Context Optimization Layer
 * 
 * Using Node.js built-in test runner
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { TokenCounter } = require('../../../lib/context-optimization/token-counter');

describe('TokenCounter', () => {
  let counter;

  beforeEach(() => {
    counter = new TokenCounter();
  });

  describe('count()', () => {
    it('should count tokens in plain text', () => {
      const text = 'Hello world this is a test';
      const count = counter.count(text);
      
      assert.ok(count > 0);
      assert.ok(count < text.length);
    });

    it('should count tokens in JSON', () => {
      const json = { key: 'value', nested: { data: 'test' } };
      const count = counter.count(json);
      
      assert.ok(count > 0);
    });

    it('should handle empty content', () => {
      assert.strictEqual(counter.count(''), 0);
    });

    it('should handle null input', () => {
      assert.strictEqual(counter.count(null), 0);
    });

    it('should count code tokens accurately', () => {
      const code = `
        function calculateSum(arr) {
          return arr.reduce((a, b) => a + b, 0);
        }
      `;
      const count = counter.count(code);
      
      assert.ok(count > 10);
    });
  });

  describe('caching', () => {
    it('should return consistent counts', () => {
      const text = 'Consistent text';
      
      const count1 = counter.count(text);
      const count2 = counter.count(text);
      
      assert.strictEqual(count1, count2);
    });
  });

  describe('performance', () => {
    it('should count tokens quickly', () => {
      const start = Date.now();
      
      for (let i = 0; i < 100; i++) {
        counter.count('Test text ' + i);
      }
      
      const duration = Date.now() - start;
      assert.ok(duration < 100, `Counting took ${duration}ms, expected <100ms`);
    });
  });
});
