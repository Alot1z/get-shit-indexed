/**
 * Semantic Intervention Integration Tests
 * Phase 25: Full Pipeline Testing
 * 
 * Using Bun test runner
 */

import { describe, it, beforeAll, expect } from 'bun:test';
import {
  initialize,
  analyze,
  createBranches,
  detectRefusal,
  checkIntervention,
  runInterventionPipeline,
  getStats
} from '../../../lib/semantic-intervention';

describe('Semantic Intervention Pipeline', () => {
  beforeAll(() => {
    initialize();
  });

  describe('runInterventionPipeline()', () => {
    it('should run full pipeline for complex prompt', async () => {
      const result = await runInterventionPipeline(
        'Design a scalable microservices architecture',
        { enableBranching: true }
      );
      
      expect(result.analysis).toBeDefined();
      expect(result.branches || result.proceed || result.action || result.intervention).toBeDefined();
    });

    it('should handle simple prompts without branching', async () => {
      const result = await runInterventionPipeline(
        'Fix a typo',
        {}
      );
      
      expect(result.analysis).toBeDefined();
    });

    it('should return recommendation when branching', async () => {
      const result = await runInterventionPipeline(
        'Build a complete authentication system with OAuth2',
        { enableBranching: true }
      );
      
      if (result.branches) {
        expect(result.recommendation).toBeDefined();
      }
    });
  });

  describe('component integration', () => {
    it('should integrate analysis with branching', async () => {
      const prompt = 'Implement a caching layer';
      const analysis = await analyze(prompt);
      const branches = await createBranches(prompt, analysis);
      
      expect(branches.paths.length).toBeGreaterThan(0);
    });

    it('should integrate detection with alternatives', async () => {
      const response = 'I cannot help with that request.';
      const detection = await detectRefusal(response);
      
      expect(detection.alternatives.length).toBeGreaterThan(0);
    });

    it('should integrate intervention with pipeline', async () => {
      const context = {
        analysis: { complexity: 80, riskScore: 70 }
      };
      
      const intervention = await checkIntervention(context);
      
      expect(intervention).not.toBeNull();
    });
  });

  describe('end-to-end scenarios', () => {
    it('should handle implementation request', async () => {
      const result = await runInterventionPipeline(
        'Create a REST API for user management'
      );
      
      expect(result.analysis.intent.primary).toBe('implementation');
    });

    it('should handle modification request', async () => {
      const result = await runInterventionPipeline(
        'Refactor the authentication module'
      );
      
      expect(result.analysis.intent.primary).toBe('modification');
    });

    it('should handle analysis request', async () => {
      const result = await runInterventionPipeline(
        'Explain the database schema'
      );
      
      expect(result.analysis.intent.primary).toBe('analysis');
    });
  });

  describe('statistics', () => {
    it('should track pipeline statistics', async () => {
      await runInterventionPipeline('Test 1');
      await runInterventionPipeline('Test 2');
      
      const stats = getStats();
      
      expect(stats.initialized).toBe(true);
    });
  });

  describe('performance', () => {
    it('should complete pipeline within time budget', async () => {
      const start = Date.now();
      
      await runInterventionPipeline('Test prompt for performance');
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(200);
    });

    it('should handle multiple concurrent requests', async () => {
      const promises = [];
      
      for (let i = 0; i < 5; i++) {
        promises.push(runInterventionPipeline(`Concurrent test ${i}`));
      }
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(5);
      results.forEach(result => {
        expect(result.analysis).toBeDefined();
      });
    });
  });

  describe('error handling', () => {
    it('should handle malformed input', async () => {
      const result = await runInterventionPipeline(null);
      expect(result).toBeDefined();
    });

    it('should handle empty input', async () => {
      const result = await runInterventionPipeline('');
      expect(result).toBeDefined();
    });

    it('should handle very long input', async () => {
      const longInput = 'x'.repeat(10000);
      const result = await runInterventionPipeline(longInput);
      expect(result).toBeDefined();
    });
  });
});
