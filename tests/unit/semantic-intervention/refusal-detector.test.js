/**
 * Refusal Detector Unit Tests
 * Phase 25-03: Semantic Intervention Engine
 * 
 * Using Bun test runner
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { RefusalDetector } from '../../../lib/semantic-intervention/refusal-detector';

describe('RefusalDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new RefusalDetector();
  });

  describe('detect()', () => {
    it('should detect direct refusals', async () => {
      const response = 'I cannot help with that request as it violates our policy.';
      const result = await detector.detect(response);
      
      expect(result.isRefusal).toBe(true);
      expect(result.type).toBe('direct');
    });

    it('should detect ambiguous responses', async () => {
      const response = 'I\'m not sure what you mean. Could you clarify?';
      const result = await detector.detect(response);
      
      expect(result.isRefusal).toBe(true);
      expect(result.type).toBe('ambiguous');
    });

    it('should detect blocked responses', async () => {
      const response = 'The request was blocked due to access restrictions.';
      const result = await detector.detect(response);
      
      expect(result.isRefusal).toBe(true);
      expect(result.type).toBe('blocked');
    });

    it('should detect partial responses', async () => {
      const response = 'I could only partially complete the task due to limitations.';
      const result = await detector.detect(response);
      
      expect(result.isRefusal).toBe(true);
      expect(result.type).toBe('partial');
    });

    it('should not detect normal responses as refusals', async () => {
      const response = 'Here is the solution to your problem...';
      const result = await detector.detect(response);
      
      expect(result.isRefusal).toBe(false);
    });

    it('should handle empty input', async () => {
      const result = await detector.detect('');
      expect(result.isRefusal).toBe(false);
    });

    it('should handle null input', async () => {
      const result = await detector.detect(null);
      expect(result.isRefusal).toBe(false);
    });
  });

  describe('alternatives', () => {
    it('should provide alternative approaches for refusals', async () => {
      const response = 'I cannot provide that information.';
      const result = await detector.detect(response);
      
      expect(result.alternatives).toBeDefined();
      expect(result.alternatives.length).toBeGreaterThan(0);
    });

    it('should recommend best alternative', async () => {
      const response = 'I cannot help with that.';
      const result = await detector.detect(response);
      
      expect(result.recommendation).toBeDefined();
      expect(result.recommendation.approach).toBeDefined();
    });

    it('should provide description for alternatives', async () => {
      const response = 'I\'m not sure what you mean.';
      const result = await detector.detect(response);
      
      expect(result.alternatives[0].description).toBeDefined();
    });
  });

  describe('confidence scoring', () => {
    it('should assign confidence score', async () => {
      const response = 'I cannot help with that request.';
      const result = await detector.detect(response);
      
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should have higher confidence for clear refusals', async () => {
      const clearRefusal = 'I cannot and will not help with that.';
      const ambiguous = 'I might not be able to help fully.';
      
      const clearResult = await detector.detect(clearRefusal);
      const ambiguousResult = await detector.detect(ambiguous);
      
      expect(clearResult.confidence).toBeGreaterThanOrEqual(ambiguousResult.confidence);
    });
  });

  describe('metrics', () => {
    it('should track detection statistics', async () => {
      await detector.detect('I cannot help');
      await detector.detect('I\'m not sure what you mean');
      await detector.detect('Normal response');
      
      const stats = detector.getStats();
      
      expect(stats.totalDetections).toBe(2);
      expect(stats.byType.direct).toBe(1);
      expect(stats.byType.ambiguous).toBe(1);
    });

    it('should track alternative success rate', () => {
      detector.recordAlternativeResult('decompose', true);
      detector.recordAlternativeResult('rephrase', false);
      detector.recordAlternativeResult('context', true);
      
      const stats = detector.getStats();
      
      expect(stats.alternativesAttempted).toBe(3);
      expect(stats.alternativesSucceeded).toBe(2);
      expect(Math.abs(stats.alternativeSuccessRate - 0.67)).toBeLessThan(0.1);
    });
  });

  describe('pattern access', () => {
    it('should expose refusal patterns', () => {
      const patterns = detector.getPatterns();
      
      expect(patterns).toBeDefined();
      expect(patterns.direct).toBeDefined();
      expect(patterns.ambiguous).toBeDefined();
    });

    it('should expose alternative templates', () => {
      const alternatives = detector.getAlternatives();
      
      expect(alternatives).toBeDefined();
      expect(alternatives.direct).toBeDefined();
    });
  });

  describe('matchesType()', () => {
    it('should match specific refusal types', () => {
      expect(detector.matchesType('I cannot help', 'direct')).toBe(true);
      expect(detector.matchesType('I\'m not sure what you mean', 'ambiguous')).toBe(true);
      expect(detector.matchesType('Access denied', 'blocked')).toBe(true);
    });

    it('should not match wrong types', () => {
      expect(detector.matchesType('I cannot help', 'ambiguous')).toBe(false);
    });
  });

  describe('performance', () => {
    it('should detect refusals quickly', async () => {
      const start = Date.now();
      await detector.detect('I cannot help with that request');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(20);
    });
  });
});
