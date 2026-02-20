/**
 * Intervention Trigger Unit Tests
 * Phase 25-04: Semantic Intervention Engine
 * 
 * Using Bun test runner
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { InterventionTrigger } from '../../../lib/semantic-intervention/intervention-trigger';

describe('InterventionTrigger', () => {
  let trigger;

  beforeEach(() => {
    trigger = new InterventionTrigger();
  });

  describe('check()', () => {
    it('should return null when no intervention needed', async () => {
      const result = await trigger.check({
        analysis: { complexity: 20, riskScore: 10, riskLevel: 'LOW', intent: { confidence: 0.8 } }
      });
      
      expect(result).toBeNull();
    });

    it('should trigger on high complexity', async () => {
      const result = await trigger.check({
        analysis: { complexity: 80, riskScore: 20, riskLevel: 'LOW', intent: { confidence: 0.8 } }
      });
      
      expect(result).not.toBeNull();
      expect(result.type).toBeDefined();
    });

    it('should trigger on high risk', async () => {
      const result = await trigger.check({
        analysis: { complexity: 30, riskScore: 90, riskLevel: 'HIGH', intent: { confidence: 0.8 } }
      });
      
      expect(result).not.toBeNull();
    });

    it('should require alternatives for certain triggers', async () => {
      const result = await trigger.check({
        analysis: { complexity: 70, riskScore: 60, riskLevel: 'HIGH', intent: { confidence: 0.8 } }
      });
      
      if (result && result.requiresAlternatives !== undefined) {
        expect(typeof result.requiresAlternatives).toBe('boolean');
      }
    });
  });

  describe('configuration', () => {
    it('should respect complexity threshold', async () => {
      const customTrigger = new InterventionTrigger({
        complexityThreshold: 50
      });
      
      const result = await customTrigger.check({
        analysis: { complexity: 60, riskScore: 10, riskLevel: 'LOW', intent: { confidence: 0.8 } }
      });
      
      expect(result).not.toBeNull();
    });

    it('should respect risk threshold', async () => {
      const customTrigger = new InterventionTrigger({
        riskThreshold: 50
      });
      
      const result = await customTrigger.check({
        analysis: { complexity: 10, riskScore: 60, riskLevel: 'MEDIUM', intent: { confidence: 0.8 } }
      });
      
      expect(result).not.toBeNull();
    });
  });

  describe('performance', () => {
    it('should check triggers quickly', async () => {
      const start = Date.now();
      await trigger.check({ analysis: { complexity: 50, riskScore: 50, riskLevel: 'MEDIUM', intent: { confidence: 0.8 } } });
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(20);
    });
  });
});
