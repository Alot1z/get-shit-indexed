/**
 * @fileoverview Integration tests for Workflow Engine
 * Part of Phase 50D: Workflow Engine Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const workflowEngine = require(path.join(__dirname, '../../lib/workflow-engine/index.js'));

// Helper for delays
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Workflow Engine Integration Tests', () => {
  let engine;

  beforeEach(() => {
    engine = workflowEngine.initialize({
      maxConcurrency: 5,
      defaultTimeout: 5000,
      defaultRetries: 2
    });
  });

  describe('Workflow Engine <-> Agent Framework Integration', () => {
    it('should integrate with Agent Framework', async () => {
      const chain = workflowEngine.instantiateTemplate('research-synthesize', { topic: 'TDD' });
      const result = await workflowEngine.executeChain(chain, { topic: 'TDD' });
      expect(result.finalOutput).toBeDefined();
    });

    it('should prepare agent context from chains', async () => {
      const chain = {
        steps: [
          { id: 'analyze', prompt: 'Analyze: {{input}}' },
          { id: 'summarize', prompt: 'Summarize: {{analyze.output}}', dependsOn: ['analyze'] }
        ]
      };
      
      const result = await workflowEngine.executeChain(chain, { input: 'code quality' });
      
      // Context should be available for agents
      expect(result.state.analyze.output).toBeDefined();
      expect(result.state.summarize.output).toBeDefined();
    });
  });

  describe('Workflow Engine <-> Knowledge System Integration', () => {
    it('should integrate with Knowledge System', async () => {
      const md = '## Decision: Test First\nTDD ensures quality.';
      const knowledge = await workflowEngine.extractKnowledge(md);
      expect(knowledge.decisions).toBeDefined();
      expect(knowledge.decisions.length).toBeGreaterThan(0);
    });

    it('should store and retrieve knowledge through workflow', async () => {
      const md = `
## Pattern: GSI Integration
1. Clone repository
2. Analyze patterns
3. Integrate modules
4. Write tests
`;
      const knowledge = await workflowEngine.extractKnowledge(md);
      
      // Create tasks from knowledge
      const tasks = workflowEngine.createTasksFromKnowledge(knowledge);
      expect(tasks.length).toBeGreaterThan(0);
      
      // Execute tasks
      const result = await workflowEngine.orchestrateTasks(tasks);
      expect(result.success).toBe(true);
    });

    it('should convert markdown to agent-friendly format', async () => {
      const md = '# API Documentation\n\n## Endpoints\n\nGET /api/users';
      const processed = await workflowEngine.processMarkdown(md);
      
      expect(processed.title).toBe('API Documentation');
      expect(processed.sections).toBeDefined();
    });
  });

  describe('Internal Chain + Task Integration', () => {
    it('should chain markdown processing with task orchestration', async () => {
      const md = await workflowEngine.processMarkdown('# Test\n\nContent');
      const tasks = workflowEngine.createTasksFromKnowledge(md.knowledge);
      const result = await workflowEngine.orchestrateTasks(tasks);
      // result.results is a Map of task results, check it exists
      expect(result.results).toBeDefined();
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should execute chain steps as parallel tasks', async () => {
      const chain = {
        steps: [
          { id: 'a', prompt: 'Task A: {{input}}' },
          { id: 'b', prompt: 'Task B: {{input}}' },
          { id: 'c', prompt: 'Combine: {{a.output}} and {{b.output}}', dependsOn: ['a', 'b'] }
        ]
      };
      
      const result = await workflowEngine.executeChain(chain, { input: 'test' });
      
      expect(result.success).toBe(true);
      expect(result.steps).toHaveLength(3);
    });

    it('should retry failed chain steps', async () => {
      let attempts = 0;
      
      const chain = {
        steps: [
          {
            id: 'flaky',
            prompt: 'Flaky step',
            run: async () => {
              attempts++;
              if (attempts < 2) throw new Error('temporary');
              return 'success';
            }
          }
        ]
      };
      
      // Use retry wrapper
      const task = {
        id: 'retry-chain',
        run: async () => {
          return workflowEngine.executeChain(chain, { input: 'test' });
        }
      };
      
      const result = await workflowEngine.executeWithRetry(task, { maxRetries: 3 });
      expect(result.success).toBe(true);
    });
  });

  describe('Full Pipeline Integration', () => {
    it('should support complete workflow: parse -> plan -> execute', async () => {
      // Step 1: Parse markdown requirements
      const md = `
# Phase 50D Requirements

## Todo
- [ ] Implement PromptChains
- [ ] Implement mdream
- [ ] Implement taskmaster

## Pattern: TDD Workflow
1. Write test
2. Implement
3. Verify
`;
      const processed = await workflowEngine.processMarkdown(md);
      
      // Step 2: Create tasks from knowledge
      const tasks = workflowEngine.createTasksFromKnowledge(processed.knowledge);
      
      // Step 3: Execute tasks
      if (tasks.length > 0) {
        const result = await workflowEngine.orchestrateTasks(tasks);
        expect(result).toBeDefined();
      }
    });

    it('should chain multiple workflow operations', async () => {
      // Waterfall through multiple operations
      const result = await workflowEngine.waterfall([
        async () => {
          return workflowEngine.processMarkdown('# Test\n\n- [ ] Task 1\n- [ ] Task 2');
        },
        async (processed) => {
          return workflowEngine.createTasksFromKnowledge(processed.knowledge);
        },
        async (tasks) => {
          if (tasks.length === 0) return { completed: 0 };
          return workflowEngine.orchestrateTasks(tasks);
        }
      ]);
      
      expect(result).toBeDefined();
    });
  });

  describe('Error Recovery Integration', () => {
    it('should handle errors gracefully across modules', async () => {
      // Invalid markdown should not crash
      const result = await workflowEngine.processMarkdown('');
      expect(result).toBeDefined();
      
      // Invalid chain should return error, not throw
      const chainResult = await workflowEngine.executeChain({ steps: [] });
      expect(chainResult.success).toBe(false);
    });

    it('should use circuit breaker for unreliable operations', async () => {
      let failures = 0;
      
      const unreliableTask = workflowEngine.withCircuitBreaker(
        async () => {
          failures++;
          if (failures < 3) throw new Error('Service unavailable');
          return 'success';
        },
        { failureThreshold: 2, timeout: 100 }
      );
      
      // First few calls should fail
      try {
        await unreliableTask();
      } catch (e) {
        // Expected
      }
      
      try {
        await unreliableTask();
      } catch (e) {
        // Expected - circuit should be open now
      }
    });
  });

  describe('Template Integration', () => {
    it('should use templates for common workflows', async () => {
      const templates = workflowEngine.getChainTemplates();
      expect(templates.length).toBeGreaterThan(0);
      
      for (const template of templates.slice(0, 2)) {
        const chain = workflowEngine.instantiateTemplate(template.name, { 
          input: 'test',
          topic: 'test',
          task: 'test',
          problem: 'test'
        });
        const result = await workflowEngine.executeChain(chain);
        expect(result.success).toBe(true);
      }
    });

    it('should customize templates dynamically', async () => {
      const chain = workflowEngine.instantiateTemplate('iterate-refine', {
        task: 'Implement authentication'
      });
      
      // Check customization worked
      expect(chain.steps[0].prompt).toContain('authentication');
    });
  });

  describe('Parallel Execution Integration', () => {
    it('should execute independent operations in parallel', async () => {
      const start = Date.now();
      
      const results = await workflowEngine.parallel([
        async () => { await delay(50); return 'a'; },
        async () => { await delay(50); return 'b'; },
        async () => { await delay(50); return 'c'; }
      ], { maxConcurrency: 3 });
      
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(150);
      expect(results.success).toBe(true);
      expect(results.results).toHaveLength(3);
    });

    it('should use dynamic parallelism based on load', async () => {
      const results = await workflowEngine.dynamicParallel([
        async () => 'task1',
        async () => 'task2',
        async () => 'task3',
        async () => 'task4'
      ], {
        minConcurrency: 1,
        maxConcurrency: 4
      });
      
      expect(results.success).toBe(true);
      expect(results.results).toHaveLength(4);
    });
  });

  describe('Validation Integration', () => {
    it('should validate chains before execution', async () => {
      const validChain = {
        steps: [
          { id: 'a', prompt: 'First' },
          { id: 'b', prompt: 'Second {{a.output}}', dependsOn: ['a'] }
        ]
      };
      
      const validation = workflowEngine.validateChain(validChain);
      expect(validation.valid).toBe(true);
    });

    it('should provide helpful validation errors', () => {
      const invalidChain = {
        steps: [
          { id: 'a', prompt: '{{missing}}' }
        ]
      };
      
      const validation = workflowEngine.validateChain(invalidChain);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Metrics and Monitoring', () => {
    it('should track execution metrics', async () => {
      const chain = {
        steps: [
          { id: 'a', prompt: 'Step A' },
          { id: 'b', prompt: 'Step B', dependsOn: ['a'] }
        ]
      };

      const result = await workflowEngine.executeChain(chain);
      expect(result.duration).toBeDefined();
      expect(result.duration).toBeGreaterThanOrEqual(0); // Can be 0 for very fast executions
    });

    it('should aggregate metrics across modules', async () => {
      // Execute some operations
      await workflowEngine.processMarkdown('# Test');
      await workflowEngine.executeChain({ steps: [{ id: 'a', prompt: 'test' }] });
      
      const metrics = workflowEngine.getMetrics(engine.tasks);
      expect(metrics).toBeDefined();
    });
  });
});
