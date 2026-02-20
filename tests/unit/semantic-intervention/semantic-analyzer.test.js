/**
 * Semantic Analyzer Unit Tests
 * Phase 25-01: Semantic Intervention Engine
 * 
 * Using Bun test runner
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { SemanticAnalyzer } from '../../../lib/semantic-intervention/semantic-analyzer';

describe('SemanticAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new SemanticAnalyzer();
  });

  describe('analyze()', () => {
    it('should classify implementation intent', async () => {
      const result = await analyzer.analyze('Create a new user authentication system');
      expect(result.intent.primary).toBe('implementation');
      expect(result.intent.confidence).toBeGreaterThan(0);
    });

    it('should classify modification intent', async () => {
      const result = await analyzer.analyze('Refactor the database connection handler');
      expect(result.intent.primary).toBe('modification');
    });

    it('should classify analysis intent', async () => {
      const result = await analyzer.analyze('Explain how the caching system works');
      expect(result.intent.primary).toBe('analysis');
    });

    it('should detect complexity level', async () => {
      const result = await analyzer.analyze('Build a microservices architecture with API gateway');
      expect(result.complexity).toBeGreaterThan(30);
    });

    it('should extract technical terms', async () => {
      const result = await analyzer.analyze('Implement React hooks with TypeScript');
      expect(result.technicalTerms).toBeDefined();
      expect(Array.isArray(result.technicalTerms)).toBe(true);
    });

    it('should handle empty input', async () => {
      const result = await analyzer.analyze('');
      expect(result).toBeDefined();
    });

    it('should handle null input', async () => {
      const result = await analyzer.analyze(null);
      expect(result).toBeDefined();
    });
  });

  describe('complexity scoring', () => {
    it('should score simple prompts low', async () => {
      const result = await analyzer.analyze('Fix typo in README');
      expect(result.complexity).toBeLessThan(40);
    });

    it('should score complex prompts high', async () => {
      const result = await analyzer.analyze(
        'Design and implement a distributed caching layer with Redis cluster support and automatic failover'
      );
      expect(result.complexity).toBeGreaterThan(50);
    });
  });

  describe('risk assessment', () => {
    it('should calculate risk score', async () => {
      const result = await analyzer.analyze('Delete all user data');
      expect(result.riskScore).toBeDefined();
    });

    it('should identify high-risk operations', async () => {
      const result = await analyzer.analyze('Drop the production database');
      expect(result.riskScore).toBeGreaterThan(50);
    });
  });

  describe('framework detection', () => {
    it('should detect React', async () => {
      const result = await analyzer.analyze('Create a React component');
      expect(result.frameworks).toContain('react');
    });

    it('should detect Express', async () => {
      const result = await analyzer.analyze('Build an Express API');
      expect(result.frameworks).toContain('express');
    });

    it('should detect TypeScript', async () => {
      const result = await analyzer.analyze('Write TypeScript interfaces');
      expect(result.frameworks).toContain('typescript');
    });
  });

  describe('performance', () => {
    it('should complete analysis quickly', async () => {
      const start = Date.now();
      await analyzer.analyze('Test prompt for performance');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});
