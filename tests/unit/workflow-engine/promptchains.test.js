/**
 * @fileoverview Unit tests for PromptChains
 * Part of Phase 50D: Workflow Engine Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  PromptChains,
  analyzePromptChains,
  executeChain,
  getChainTemplates,
  instantiateTemplate,
  validateChain,
  CHAIN_TEMPLATES
} from '../../../lib/workflow-engine/promptchains';

describe('PromptChains', () => {
  let executor;

  beforeEach(() => {
    executor = new PromptChains();
  });

  describe('analyzePromptChains', () => {
    it('should analyze PromptChains repository structure', async () => {
      const analysis = await analyzePromptChains('https://github.com/MIATECHPARTNERS/PromptChains');
      expect(analysis).toHaveProperty('chainFormat');
      expect(analysis).toHaveProperty('stateManagement');
      expect(analysis.chainFormat.version).toBeDefined();
    });

    it('should return analysis with execution model', async () => {
      const analysis = await analyzePromptChains();
      expect(analysis.executionModel).toBeDefined();
      expect(analysis.executionModel.order).toBe('topological');
    });

    it('should include available templates', async () => {
      const analysis = await analyzePromptChains();
      expect(analysis.templates).toBeDefined();
      expect(Array.isArray(analysis.templates)).toBe(true);
    });
  });

  describe('executeChain', () => {
    it('should execute chains in sequence with state', async () => {
      const chain = {
        steps: [
          { prompt: 'What is {{input}}?', id: 'step1' },
          { prompt: 'Summarize: {{step1.output}}', id: 'step2', dependsOn: ['step1'] }
        ]
      };
      const result = await executeChain(chain, { input: 'AI' });
      expect(result.steps).toHaveLength(2);
      expect(result.state.step1.output).toBeDefined();
      expect(result.state.step2.output).toBeDefined();
    });

    it('should execute steps in dependency order', async () => {
      const executionOrder = [];
      const chain = {
        steps: [
          { prompt: 'Step C depends on B', id: 'c', dependsOn: ['b'] },
          { prompt: 'Step A is first', id: 'a' },
          { prompt: 'Step B depends on A', id: 'b', dependsOn: ['a'] }
        ]
      };
      
      const result = await executor.execute(chain);
      expect(result.success).toBe(true);
      // Order should be a, b, c
      expect(result.steps[0].stepId).toBe('a');
      expect(result.steps[1].stepId).toBe('b');
      expect(result.steps[2].stepId).toBe('c');
    });

    it('should handle parallel independent steps', async () => {
      const chain = {
        steps: [
          { prompt: 'Independent 1', id: 'ind1' },
          { prompt: 'Independent 2', id: 'ind2' },
          { prompt: 'Combine: {{ind1.output}} and {{ind2.output}}', id: 'combine', dependsOn: ['ind1', 'ind2'] }
        ]
      };
      
      const result = await executeChain(chain);
      expect(result.success).toBe(true);
      expect(result.steps).toHaveLength(3);
    });

    it('should substitute variables correctly', async () => {
      const chain = {
        steps: [
          { prompt: 'Topic: {{topic}}, Phase: {{phase}}', id: 's1' }
        ]
      };
      
      const result = await executor.execute(chain, { topic: 'TDD', phase: '50D' });
      expect(result.success).toBe(true);
      expect(result.state.s1.output).toContain('TDD');
      expect(result.state.s1.output).toContain('50D');
    });

    it('should return error for invalid chains', async () => {
      const chain = {
        steps: []
      };
      
      const result = await executeChain(chain);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getChainTemplates', () => {
    it('should provide built-in chain templates', () => {
      const templates = getChainTemplates();
      expect(templates).toContainEqual(
        expect.objectContaining({ name: 'plan-execute-verify' })
      );
      expect(templates).toContainEqual(
        expect.objectContaining({ name: 'research-synthesize' })
      );
    });

    it('should return templates with descriptions', () => {
      const templates = getChainTemplates();
      expect(templates.length).toBeGreaterThan(0);
      expect(templates[0]).toHaveProperty('name');
      expect(templates[0]).toHaveProperty('description');
    });
  });

  describe('instantiateTemplate', () => {
    it('should instantiate template with variables', () => {
      const chain = instantiateTemplate('plan-execute-verify', { phase: '50A' });
      expect(chain.steps[0].prompt).toContain('50A');
    });

    it('should throw for unknown template', () => {
      expect(() => instantiateTemplate('unknown-template')).toThrow();
    });

    it('should preserve step dependencies', () => {
      const chain = instantiateTemplate('plan-execute-verify', { input: 'test' });
      const verifyStep = chain.steps.find(s => s.id === 'verify');
      expect(verifyStep.dependsOn).toContain('execute');
    });
  });

  describe('validateChain', () => {
    it('should reject chains with circular dependencies', () => {
      const invalidChain = {
        steps: [
          { id: 'a', prompt: '{{b.output}}' },
          { id: 'b', prompt: '{{a.output}}' }
        ]
      };
      expect(() => validateChain(invalidChain)).toThrow('circular');
    });

    it('should reject chains with missing variables', () => {
      const invalidChain = {
        steps: [{ id: '1', prompt: '{{missing.value}}' }],
        input: {}
      };
      // This should not throw but return warnings
      const executor = new PromptChains();
      const result = executor.validate(invalidChain);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should reject empty chains', () => {
      const invalidChain = { steps: [] };
      expect(() => validateChain(invalidChain)).toThrow();
    });

    it('should reject steps without ids', () => {
      const invalidChain = {
        steps: [{ prompt: 'test' }]
      };
      expect(() => validateChain(invalidChain)).toThrow('missing id');
    });

    it('should reject duplicate step ids', () => {
      const invalidChain = {
        steps: [
          { id: 'dup', prompt: 'first' },
          { id: 'dup', prompt: 'second' }
        ]
      };
      expect(() => validateChain(invalidChain)).toThrow('Duplicate');
    });

    it('should accept valid chains', () => {
      const validChain = {
        steps: [
          { id: 'a', prompt: 'First step' },
          { id: 'b', prompt: 'Second step {{a.output}}', dependsOn: ['a'] }
        ]
      };
      expect(() => validateChain(validChain)).not.toThrow();
    });
  });

  describe('variable substitution', () => {
    it('should handle nested variable paths', async () => {
      const chain = {
        steps: [
          { id: 's1', prompt: 'Value: {{data.nested.value}}' }
        ]
      };
      
      const result = await executor.execute(chain, { 
        data: { nested: { value: 'deep-value' } } 
      });
      expect(result.state.s1.output).toContain('deep-value');
    });

    it('should preserve unsubstituted variables', async () => {
      const chain = {
        steps: [
          { id: 's1', prompt: 'Keep: {{undefined}}' }
        ]
      };
      
      const result = await executor.execute(chain, {});
      expect(result.state.s1.output).toContain('{{undefined}}');
    });
  });

  describe('execution caching', () => {
    it('should cache step results', async () => {
      const chain = {
        steps: [{ id: 's1', prompt: 'test' }]
      };
      
      // Execute twice
      await executor.execute(chain);
      await executor.execute(chain);
      
      // Cache should have entries
      expect(executor.executionCache.size).toBeGreaterThan(0);
    });

    it('should clear cache on demand', async () => {
      const chain = {
        steps: [{ id: 's1', prompt: 'test' }]
      };
      
      await executor.execute(chain);
      executor.clearCache();
      
      expect(executor.executionCache.size).toBe(0);
    });
  });

  describe('custom templates', () => {
    it('should register custom templates', () => {
      executor.registerTemplate('custom-test', {
        steps: [{ id: 's1', prompt: 'Custom {{input}}' }]
      });
      
      const templates = executor.getTemplates();
      expect(templates).toContainEqual(
        expect.objectContaining({ name: 'custom-test' })
      );
    });

    it('should reject invalid custom templates', () => {
      expect(() => {
        executor.registerTemplate('invalid', { steps: [] });
      }).toThrow();
    });
  });

  describe('execution order', () => {
    it('should use topological sort for complex dependencies', async () => {
      const chain = {
        steps: [
          { id: 'd', prompt: 'D', dependsOn: ['b', 'c'] },
          { id: 'a', prompt: 'A' },
          { id: 'b', prompt: 'B', dependsOn: ['a'] },
          { id: 'c', prompt: 'C', dependsOn: ['a'] }
        ]
      };
      
      const order = executor.getExecutionOrder(chain.steps);
      expect(order.indexOf('a')).toBeLessThan(order.indexOf('b'));
      expect(order.indexOf('a')).toBeLessThan(order.indexOf('c'));
      expect(order.indexOf('b')).toBeLessThan(order.indexOf('d'));
      expect(order.indexOf('c')).toBeLessThan(order.indexOf('d'));
    });
  });
});
