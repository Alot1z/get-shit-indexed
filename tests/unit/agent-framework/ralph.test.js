/**
 * @fileoverview Tests for ralph module
 * Tests playbook-style sequential task execution
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// Import the module
import * as ralph from '../../../lib/agent-framework/ralph';

describe('ralph-playbook analysis', () => {
  describe('analyzeRalphPlaybook', () => {
    it('should analyze ralph-playbook repository', async () => {
      const result = await ralph.analyzeRalphPlaybook('https://github.com/ralph-team/ralph-playbook');
      
      expect(result).toHaveProperty('playbookFormat');
      expect(result).toHaveProperty('taskTypes');
      expect(result).toHaveProperty('executionModel');
    });

    it('should document playbook schema', async () => {
      const result = await ralph.analyzeRalphPlaybook();
      
      expect(result.playbookFormat).toHaveProperty('schema');
      expect(result.playbookFormat.schema).toContain('steps');
      expect(result.playbookFormat.schema).toContain('tasks');
    });

    it('should identify sequential execution pattern', async () => {
      const result = await ralph.analyzeRalphPlaybook();
      
      expect(result.executionModel).toBe('sequential');
    });

    it('should catalog available task types', async () => {
      const result = await ralph.analyzeRalphPlaybook();
      
      expect(result.taskTypes).toContain('plan');
      expect(result.taskTypes).toContain('execute');
      expect(result.taskTypes).toContain('verify');
    });
  });
});

describe('PlaybookExecutor', () => {
  let executor;

  beforeEach(() => {
    executor = new ralph.PlaybookExecutor();
  });

  describe('sequential execution', () => {
    it('should execute playbook tasks in order', async () => {
      const playbook = {
        name: 'test-playbook',
        steps: [
          { name: 'step1', action: 'plan', order: 1 },
          { name: 'step2', action: 'execute', order: 2 },
          { name: 'step3', action: 'verify', order: 3 }
        ]
      };
      
      const executionLog = [];
      executor.on('stepComplete', (step) => executionLog.push(step.name));
      
      await executor.execute(playbook);
      
      expect(executionLog).toEqual(['step1', 'step2', 'step3']);
    });

    it('should execute steps by order property', async () => {
      const playbook = {
        name: 'unordered-playbook',
        steps: [
          { name: 'last', action: 'verify', order: 3 },
          { name: 'first', action: 'plan', order: 1 },
          { name: 'middle', action: 'execute', order: 2 }
        ]
      };
      
      const executionLog = [];
      executor.on('stepComplete', (step) => executionLog.push(step.name));
      
      await executor.execute(playbook);
      
      expect(executionLog).toEqual(['first', 'middle', 'last']);
    });
  });

  describe('failure handling', () => {
    it('should stop on step failure when configured', async () => {
      const stopExecutor = new ralph.PlaybookExecutor({ stopOnFailure: true });
      
      const playbook = {
        name: 'failing-playbook',
        steps: [
          { name: 'pass', action: 'plan', order: 1 },
          { name: 'fail', action: 'execute', order: 2, willFail: true },
          { name: 'unreachable', action: 'verify', order: 3 }
        ]
      };
      
      const result = await stopExecutor.execute(playbook);
      
      expect(result.completed).toBe(false);
      expect(result.failedStep).toBe('fail');
      expect(result.executedSteps).toBe(2);
    });

    it('should continue on failure when configured', async () => {
      const continueExecutor = new ralph.PlaybookExecutor({ stopOnFailure: false });
      
      const playbook = {
        name: 'failing-playbook',
        steps: [
          { name: 'step1', action: 'plan', order: 1 },
          { name: 'step2', action: 'execute', order: 2, willFail: true },
          { name: 'step3', action: 'verify', order: 3 }
        ]
      };
      
      const result = await continueExecutor.execute(playbook);
      
      expect(result.completed).toBe(true);
      expect(result.failedSteps).toContain('step2');
    });

    it('should track failed steps', async () => {
      const playbook = {
        name: 'multi-failure',
        steps: [
          { name: 's1', action: 'plan', order: 1 },
          { name: 's2', action: 'fail', order: 2, willFail: true },
          { name: 's3', action: 'fail', order: 3, willFail: true }
        ]
      };
      
      const continueExecutor = new ralph.PlaybookExecutor({ stopOnFailure: false });
      const result = await continueExecutor.execute(playbook);
      
      expect(result.failedSteps.length).toBe(2);
    });
  });

  describe('conditional execution', () => {
    it('should support conditional step execution', async () => {
      const playbook = {
        name: 'conditional-playbook',
        steps: [
          { name: 'setup', action: 'plan', order: 1 },
          { name: 'optional', action: 'execute', order: 2, condition: 'skip' },
          { name: 'cleanup', action: 'verify', order: 3 }
        ]
      };
      
      const result = await executor.execute(playbook, { conditions: { skip: false } });
      
      expect(result.executedSteps).toBe(2);
      expect(result.skippedSteps).toContain('optional');
    });

    it('should evaluate complex conditions', async () => {
      const playbook = {
        name: 'complex-condition',
        steps: [
          { name: 'a', action: 'plan', order: 1 },
          { name: 'b', action: 'execute', order: 2, condition: { type: 'env', value: 'production' } },
          { name: 'c', action: 'verify', order: 3 }
        ]
      };
      
      const result = await executor.execute(playbook, { env: 'development' });
      
      expect(result.skippedSteps).toContain('b');
    });
  });

  describe('progress tracking', () => {
    it('should emit progress events', async () => {
      const playbook = {
        name: 'progress-playbook',
        steps: [
          { name: 'step1', action: 'plan', order: 1 },
          { name: 'step2', action: 'execute', order: 2 }
        ]
      };
      
      const progressEvents = [];
      executor.on('progress', (p) => progressEvents.push(p));
      
      await executor.execute(playbook);
      
      expect(progressEvents).toContain(0);
      expect(progressEvents).toContain(50);
      expect(progressEvents).toContain(100);
    });

    it('should provide execution statistics', async () => {
      const playbook = {
        name: 'stats-playbook',
        steps: [
          { name: 's1', action: 'plan', order: 1 },
          { name: 's2', action: 'execute', order: 2 },
          { name: 's3', action: 'verify', order: 3 }
        ]
      };
      
      await executor.execute(playbook);
      const stats = executor.getStats();
      
      expect(stats.totalSteps).toBe(3);
      expect(stats.completedSteps).toBe(3);
    });
  });

  describe('rollback support', () => {
    it('should support rollback on failure', async () => {
      const rollbackExecutor = new ralph.PlaybookExecutor({ rollback: true });
      
      const rollbackLog = [];
      rollbackExecutor.on('rollback', (step) => rollbackLog.push(step.name));
      
      const playbook = {
        name: 'rollback-playbook',
        steps: [
          { name: 's1', action: 'plan', order: 1, rollback: 'cleanup1' },
          { name: 's2', action: 'execute', order: 2, rollback: 'cleanup2' },
          { name: 's3', action: 'fail', order: 3, willFail: true }
        ]
      };
      
      await rollbackExecutor.execute(playbook);
      
      expect(rollbackLog.length).toBeGreaterThan(0);
    });
  });
});
