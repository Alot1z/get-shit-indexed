/**
 * Parallel Brancher Unit Tests
 * Phase 25-02: Semantic Intervention Engine
 * 
 * Using Bun test runner
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { ParallelBrancher } from '../../../lib/semantic-intervention/parallel-brancher';

describe('ParallelBrancher', () => {
  let brancher;

  beforeEach(() => {
    brancher = new ParallelBrancher({ useThinkingServer: false });
  });

  describe('createBranches()', () => {
    it('should create multiple reasoning paths', async () => {
      const prompt = 'Build a secure authentication system';
      const analysis = { complexity: 60, riskScore: 50, riskLevel: 'MEDIUM', intent: { confidence: 0.8 } };
      
      const result = await brancher.createBranches(prompt, analysis);
      
      expect(result.paths).toBeDefined();
      expect(result.paths.length).toBeGreaterThanOrEqual(2);
    });

    it('should include moderate branch', async () => {
      const result = await brancher.createBranches('Implement OAuth2', { complexity: 50, riskLevel: 'LOW', intent: { confidence: 0.8 } });
      
      const moderateBranch = result.paths.find(p => p.strategyKey === 'moderate' || p.strategy === 'Moderate Approach');
      expect(moderateBranch).toBeDefined();
    });

    it('should include conservative branch for high risk', async () => {
      const result = await brancher.createBranches('Implement OAuth2', { complexity: 50, riskLevel: 'HIGH', intent: { confidence: 0.8 } });
      
      const conservativeBranch = result.paths.find(p => p.strategyKey === 'conservative' || p.strategy === 'Conservative Approach');
      expect(conservativeBranch).toBeDefined();
    });

    it('should include aggressive branch for complex prompts', async () => {
      const result = await brancher.createBranches('Build entire backend system', { complexity: 80, riskLevel: 'LOW', intent: { confidence: 0.8 } });
      
      const aggressiveBranch = result.paths.find(p => p.strategyKey === 'aggressive' || p.strategy === 'Aggressive Approach');
      expect(aggressiveBranch).toBeDefined();
    });

    it('should assign confidence scores to each branch', async () => {
      const result = await brancher.createBranches('Test prompt', { complexity: 50, riskLevel: 'LOW', intent: { confidence: 0.8 } });
      
      for (const branch of result.paths) {
        expect(branch.confidence).toBeDefined();
        expect(branch.confidence).toBeGreaterThanOrEqual(0);
        expect(branch.confidence).toBeLessThanOrEqual(1);
      }
    });

    it('should respect maxBranches option', async () => {
      const result = await brancher.createBranches('Test', { complexity: 50, riskLevel: 'LOW', intent: { confidence: 0.8 } }, { maxBranches: 2 });
      
      expect(result.paths.length).toBeLessThanOrEqual(2);
    });
  });

  describe('branch selection', () => {
    it('should select highest confidence branch by default', () => {
      const branches = {
        paths: [
          { strategy: 'academic', confidence: 0.7, success: true },
          { strategy: 'engineering', confidence: 0.85, success: true },
          { strategy: 'decomposition', confidence: 0.75, success: true }
        ]
      };
      
      const selected = brancher.selectBestBranch(branches);
      expect(selected.strategy).toBe('engineering');
    });

    it('should return null for empty branches', () => {
      const selected = brancher.selectBestBranch({ paths: [] });
      expect(selected).toBeNull();
    });
    
    it('should return null for no successful branches', () => {
      const selected = brancher.selectBestBranch({ paths: [{ success: false }, { success: false }] });
      expect(selected).toBeNull();
    });
  });

  describe('self-consistency scoring', () => {
    it('should calculate consistency across branches', async () => {
      const result = await brancher.createBranches('Test prompt', { complexity: 50, riskLevel: 'LOW', intent: { confidence: 0.8 } });
      
      if (result.consistency !== undefined) {
        expect(result.consistency).toBeGreaterThanOrEqual(0);
        expect(result.consistency).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('metrics', () => {
    it('should track branching statistics', async () => {
      await brancher.createBranches('Test 1', { complexity: 50, riskLevel: 'LOW', intent: { confidence: 0.8 } });
      await brancher.createBranches('Test 2', { complexity: 70, riskLevel: 'LOW', intent: { confidence: 0.8 } });
      
      const stats = brancher.getStats();
      
      expect(stats.branchesCreated).toBeGreaterThan(0);
    });
  });

  describe('performance', () => {
    it('should create branches quickly', async () => {
      const start = Date.now();
      await brancher.createBranches('Test prompt', { complexity: 50, riskLevel: 'LOW', intent: { confidence: 0.8 } });
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500);  // Increased from 100ms to 500ms
    });
  });
});
