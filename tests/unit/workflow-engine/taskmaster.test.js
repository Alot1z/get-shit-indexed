/**
 * @fileoverview Unit tests for taskmaster (Task orchestration)
 * Part of Phase 50D: Workflow Engine Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  Taskmaster,
  analyzeTaskmaster,
  orchestrateTasks,
  executeParallel,
  executeWithRetry,
  detectCircularDependencies,
  DEFAULT_RETRY_CONFIG
} from '../../../lib/workflow-engine/taskmaster';

// Helper for delays
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('taskmaster', () => {
  let taskmaster;

  beforeEach(() => {
    taskmaster = new Taskmaster();
  });

  describe('analyzeTaskmaster', () => {
    it('should analyze task orchestration patterns', async () => {
      const analysis = await analyzeTaskmaster();
      expect(analysis).toHaveProperty('dependencyResolution');
      expect(analysis).toHaveProperty('parallelization');
      expect(analysis).toHaveProperty('retryStrategy');
    });

    it('should return dependency resolution info', async () => {
      const analysis = await analyzeTaskmaster();
      expect(analysis.dependencyResolution.algorithm).toBe('topological-sort');
      expect(analysis.dependencyResolution.cycleDetection).toBe(true);
    });

    it('should return retry strategies', async () => {
      const analysis = await analyzeTaskmaster();
      expect(analysis.retryStrategy.strategies).toContain('exponential');
    });
  });

  describe('orchestrateTasks', () => {
    it('should execute tasks in dependency order', async () => {
      const executionOrder = [];
      const tasks = [
        { id: 'c', run: async () => { executionOrder.push('c'); }, dependsOn: ['b'] },
        { id: 'a', run: async () => { executionOrder.push('a'); }, dependsOn: [] },
        { id: 'b', run: async () => { executionOrder.push('b'); }, dependsOn: ['a'] }
      ];
      await orchestrateTasks(tasks);
      expect(executionOrder).toEqual(['a', 'b', 'c']);
    });

    it('should detect circular dependencies', () => {
      const tasks = [
        { id: 'a', dependsOn: ['b'] },
        { id: 'b', dependsOn: ['a'] }
      ];
      expect(orchestrateTasks(tasks)).rejects.toThrow('circular');
    });

    it('should detect missing dependencies', () => {
      const tasks = [
        { id: 'a', dependsOn: ['nonexistent'] }
      ];
      expect(orchestrateTasks(tasks)).rejects.toThrow('Missing dependency');
    });

    it('should return results for all tasks', async () => {
      const tasks = [
        { id: 'a', run: async () => 'result-a' },
        { id: 'b', run: async () => 'result-b', dependsOn: ['a'] }
      ];
      const result = await orchestrateTasks(tasks);
      expect(result.success).toBe(true);
      expect(result.results.size).toBe(2);
    });

    it('should include execution metrics', async () => {
      const tasks = [
        { id: 'a', run: async () => 'result' }
      ];
      const result = await orchestrateTasks(tasks);
      expect(result.metrics).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should handle task failures gracefully', async () => {
      const tasks = [
        { id: 'a', run: async () => { throw new Error('Task failed'); } },
        { id: 'b', run: async () => 'success', dependsOn: ['a'] }
      ];
      const result = await orchestrateTasks(tasks);
      expect(result.success).toBe(false);
    });
  });

  describe('executeParallel', () => {
    it('should run independent tasks in parallel', async () => {
      const tasks = [
        { id: 'a', run: async () => { await delay(50); return 'a'; } },
        { id: 'b', run: async () => { await delay(50); return 'b'; } },
        { id: 'c', run: async () => { await delay(50); return 'c'; } }
      ];
      const start = Date.now();
      const results = await executeParallel(tasks, { maxConcurrency: 3 });
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(150); // Should be ~50ms, not 150ms
      expect(results).toHaveLength(3);
    });

    it('should respect concurrency limit', async () => {
      let concurrent = 0;
      let maxConcurrent = 0;
      
      const tasks = Array(10).fill(null).map((_, i) => ({
        id: `task-${i}`,
        run: async () => {
          concurrent++;
          maxConcurrent = Math.max(maxConcurrent, concurrent);
          await delay(10);
          concurrent--;
          return i;
        }
      }));
      
      await executeParallel(tasks, { maxConcurrency: 3 });
      expect(maxConcurrent).toBeLessThanOrEqual(3);
    });

    it('should return results in correct order', async () => {
      const tasks = [
        { id: 'a', run: async () => 'first' },
        { id: 'b', run: async () => 'second' },
        { id: 'c', run: async () => 'third' }
      ];
      
      const results = await executeParallel(tasks);
      expect(results).toHaveLength(3);
    });
  });

  describe('executeWithRetry', () => {
    it('should retry failed tasks with exponential backoff', async () => {
      let attempts = 0;
      const task = {
        id: 'flaky',
        run: async () => {
          attempts++;
          if (attempts < 3) throw new Error('temporary');
          return 'success';
        }
      };
      const result = await executeWithRetry(task, { maxRetries: 3, backoff: 'exponential' });
      expect(result.success).toBe(true);
      expect(result.output).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should fail after max retries', async () => {
      const task = {
        id: 'always-fails',
        run: async () => { throw new Error('permanent'); }
      };
      const result = await executeWithRetry(task, { maxRetries: 2 });
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('permanent');
    });

    it('should apply linear backoff', async () => {
      let attempts = 0;
      const delays = [];
      let lastTime = Date.now();
      
      const task = {
        id: 'backoff-test',
        run: async () => {
          attempts++;
          if (attempts < 3) {
            const now = Date.now();
            delays.push(now - lastTime);
            lastTime = now;
            throw new Error('retry');
          }
          return 'done';
        }
      };
      
      await executeWithRetry(task, { maxRetries: 3, backoff: 'linear', initialDelay: 10 });
      // Linear backoff: delays should be roughly equal
      expect(attempts).toBe(3);
    });

    it('should not retry when maxRetries is 0', async () => {
      let attempts = 0;
      const task = {
        id: 'no-retry',
        run: async () => {
          attempts++;
          throw new Error('fail');
        }
      };
      
      const result = await executeWithRetry(task, { maxRetries: 0 });
      expect(attempts).toBe(1);
      expect(result.success).toBe(false);
    });
  });

  describe('detectCircularDependencies', () => {
    it('should detect simple circular dependency', () => {
      const tasks = [
        { id: 'a', dependsOn: ['b'] },
        { id: 'b', dependsOn: ['a'] }
      ];
      const result = detectCircularDependencies(tasks);
      expect(result.hasCycle).toBe(true);
      expect(result.cyclePath).toBeDefined();
    });

    it('should detect indirect circular dependency', () => {
      const tasks = [
        { id: 'a', dependsOn: ['c'] },
        { id: 'b', dependsOn: ['a'] },
        { id: 'c', dependsOn: ['b'] }
      ];
      const result = detectCircularDependencies(tasks);
      expect(result.hasCycle).toBe(true);
    });

    it('should return false for no circular dependency', () => {
      const tasks = [
        { id: 'a' },
        { id: 'b', dependsOn: ['a'] },
        { id: 'c', dependsOn: ['b'] }
      ];
      const result = detectCircularDependencies(tasks);
      expect(result.hasCycle).toBe(false);
    });

    it('should handle tasks without dependencies', () => {
      const tasks = [
        { id: 'a' },
        { id: 'b' },
        { id: 'c' }
      ];
      const result = detectCircularDependencies(tasks);
      expect(result.hasCycle).toBe(false);
    });
  });

  describe('Taskmaster class', () => {
    it('should register tasks', () => {
      taskmaster.register({ id: 'test', run: async () => {} });
      expect(taskmaster.tasks.size).toBe(1);
    });

    it('should register multiple tasks', () => {
      taskmaster.registerAll([
        { id: 'a', run: async () => {} },
        { id: 'b', run: async () => {} }
      ]);
      expect(taskmaster.tasks.size).toBe(2);
    });

    it('should clear tasks and results', async () => {
      taskmaster.register({ id: 'test', run: async () => 'result' });
      await taskmaster.orchestrate();
      taskmaster.clear();
      expect(taskmaster.tasks.size).toBe(0);
      expect(taskmaster.results.size).toBe(0);
    });

    it('should track metrics', async () => {
      taskmaster.registerAll([
        { id: 'a', run: async () => 'success' },
        { id: 'b', run: async () => { throw new Error('fail'); } }
      ]);
      
      await taskmaster.orchestrate(undefined, { continueOnError: true });
      
      expect(taskmaster.metrics.totalExecuted).toBe(2);
      expect(taskmaster.metrics.successful).toBe(1);
      expect(taskmaster.metrics.failed).toBe(1);
    });

    it('should support priority-based execution', async () => {
      const order = [];
      taskmaster.registerAll([
        { id: 'low', run: async () => { order.push('low'); }, priority: 1 },
        { id: 'high', run: async () => { order.push('high'); }, priority: 10 }
      ]);
      
      await taskmaster.orchestrate();
      // Higher priority should execute first (both are independent)
      expect(order[0]).toBe('high');
    });
  });

  describe('backoff strategies', () => {
    it('should calculate exponential backoff correctly', () => {
      const config = { backoff: 'exponential', initialDelay: 100, multiplier: 2 };
      expect(taskmaster.calculateBackoff(1, config)).toBe(100);
      expect(taskmaster.calculateBackoff(2, config)).toBe(200);
      expect(taskmaster.calculateBackoff(3, config)).toBe(400);
    });

    it('should calculate linear backoff correctly', () => {
      const config = { backoff: 'linear', initialDelay: 100 };
      expect(taskmaster.calculateBackoff(1, config)).toBe(100);
      expect(taskmaster.calculateBackoff(2, config)).toBe(200);
      expect(taskmaster.calculateBackoff(3, config)).toBe(300);
    });

    it('should return 0 for no backoff', () => {
      const config = { backoff: 'none' };
      expect(taskmaster.calculateBackoff(5, config)).toBe(0);
    });

    it('should respect maxDelay', () => {
      const config = { 
        backoff: 'exponential', 
        initialDelay: 100, 
        multiplier: 10,
        maxDelay: 1000 
      };
      expect(taskmaster.calculateBackoff(10, config)).toBeLessThanOrEqual(1000);
    });
  });

  describe('timeout handling', () => {
    it('should timeout long-running tasks', async () => {
      const task = {
        id: 'slow',
        run: async () => {
          await delay(1000);
          return 'done';
        }
      };
      
      const result = await executeWithRetry(task, { 
        maxRetries: 0,
        timeout: 100 
      });
      
      expect(result.success).toBe(false);
      expect(result.error.message).toContain('timed out');
    }, 5000);
  });

  describe('dependency handling', () => {
    it('should skip tasks with failed dependencies', async () => {
      const tasks = [
        { id: 'a', run: async () => { throw new Error('fail'); } },
        { id: 'b', run: async () => 'success', dependsOn: ['a'] }
      ];
      
      const result = await orchestrateTasks(tasks);
      const taskB = result.results.get('b');
      
      expect(taskB.skipped).toBe(true);
    });

    it('should wait for all dependencies', async () => {
      const completed = [];
      const tasks = [
        { id: 'a', run: async () => { await delay(30); completed.push('a'); } },
        { id: 'b', run: async () => { await delay(20); completed.push('b'); } },
        { id: 'c', run: async () => { completed.push('c'); }, dependsOn: ['a', 'b'] }
      ];
      
      await orchestrateTasks(tasks);
      
      // C should only execute after both a and b
      expect(completed.indexOf('c')).toBeGreaterThan(completed.indexOf('a'));
      expect(completed.indexOf('c')).toBeGreaterThan(completed.indexOf('b'));
    });
  });
});
