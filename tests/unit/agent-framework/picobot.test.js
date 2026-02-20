/**
 * @fileoverview Tests for picobot module
 * Tests automation primitives (watch, trigger, execute)
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the module
import * as picobot from '../../../lib/agent-framework/picobot';

describe('picobot analysis', () => {
  describe('analyzePicobot', () => {
    it('should analyze picobot automation primitives', async () => {
      const result = await picobot.analyzePicobot();
      
      expect(result).toHaveProperty('watchPattern');
      expect(result).toHaveProperty('triggerPattern');
      expect(result).toHaveProperty('executionPattern');
    });

    it('should document file watch pattern', async () => {
      const result = await picobot.analyzePicobot();
      
      expect(result.watchPattern).toHaveProperty('events');
      expect(result.watchPattern.events).toContain('change');
      expect(result.watchPattern.events).toContain('create');
      expect(result.watchPattern.events).toContain('delete');
    });

    it('should document trigger patterns', async () => {
      const result = await picobot.analyzePicobot();
      
      expect(result.triggerPattern).toHaveProperty('types');
      expect(result.triggerPattern.types).toContain('file');
      expect(result.triggerPattern.types).toContain('schedule');
      expect(result.triggerPattern.types).toContain('manual');
    });

    it('should catalog automation primitives', async () => {
      const result = await picobot.analyzePicobot();
      
      expect(result.primitives).toContainEqual(
        expect.objectContaining({ name: 'watch' })
      );
      expect(result.primitives).toContainEqual(
        expect.objectContaining({ name: 'trigger' })
      );
      expect(result.primitives).toContainEqual(
        expect.objectContaining({ name: 'execute' })
      );
    });
  });
});

describe('AutomationLayer', () => {
  let automation;
  const testDir = './test-automation-fixture';

  beforeEach(async () => {
    automation = new picobot.AutomationLayer();
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await automation.stopAll();
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('file watching', () => {
    it('should watch file changes and trigger execution', async () => {
      const executionLog = [];
      const testFile = path.join(testDir, 'test.txt');
      
      await automation.watch({
        path: testDir,
        events: ['change'],
        trigger: {
          type: 'file',
          pattern: '*.txt'
        },
        action: async (event) => {
          executionLog.push(event.file);
        }
      });

      await fs.writeFile(testFile, 'test content');
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for watch

      expect(executionLog).toContain(testFile);
    });

    it('should support multiple watchers', async () => {
      for (let i = 0; i < 5; i++) {
        const subDir = path.join(testDir, `dir${i}`);
        await fs.mkdir(subDir, { recursive: true });
        
        await automation.watch({
          path: subDir,
          events: ['create'],
          trigger: { type: 'file', pattern: '*' },
          action: async () => {}
        });
      }

      expect(automation.getActiveWatchers()).toBe(5);
    });
  });

  describe('scheduled triggers', () => {
    it('should trigger execution on schedule', async () => {
      const executionCount = { value: 0 };
      
      await automation.schedule({
        cron: '*/1 * * * * *', // Every second
        action: async () => {
          executionCount.value++;
        }
      });

      await new Promise(resolve => setTimeout(resolve, 2500));
      
      expect(executionCount.value).toBeGreaterThanOrEqual(2);
    });

    it('should support one-time scheduled execution', async () => {
      const executed = { value: false };
      
      await automation.schedule({
        date: new Date(Date.now() + 100),
        action: async () => {
          executed.value = true;
        }
      });

      await new Promise(resolve => setTimeout(resolve, 200));
      
      expect(executed.value).toBe(true);
    });

    it('should cancel scheduled tasks', async () => {
      const executionCount = { value: 0 };
      
      const taskId = await automation.schedule({
        cron: '*/1 * * * * *',
        action: async () => executionCount.value++
      });

      await new Promise(resolve => setTimeout(resolve, 1100));
      await automation.cancelSchedule(taskId);
      const countAfterCancel = executionCount.value;
      
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      expect(executionCount.value).toBe(countAfterCancel);
    });
  });

  describe('manual triggers', () => {
    it('should support manual triggers', async () => {
      const executionLog = [];
      
      const trigger = await automation.registerTrigger({
        name: 'manual-test',
        action: async (payload) => {
          executionLog.push(payload.message);
        }
      });

      await trigger.fire({ message: 'hello' });
      await trigger.fire({ message: 'world' });

      expect(executionLog).toEqual(['hello', 'world']);
    });

    it('should unregister triggers', async () => {
      const executionLog = [];
      
      const trigger = await automation.registerTrigger({
        name: 'removable',
        action: async (payload) => executionLog.push(payload.msg)
      });

      await trigger.fire({ msg: 'before' });
      await automation.unregisterTrigger('removable');
      
      expect(trigger.fire({ msg: 'after' })).rejects.toThrow();
      
      expect(executionLog).toEqual(['before']);
    });

    it('should list registered triggers', async () => {
      await automation.registerTrigger({
        name: 'trigger1',
        action: async () => {}
      });
      await automation.registerTrigger({
        name: 'trigger2',
        action: async () => {}
      });

      const triggers = automation.listTriggers();
      
      expect(triggers).toContain('trigger1');
      expect(triggers).toContain('trigger2');
    });
  });

  describe('error handling', () => {
    it('should handle execution errors gracefully', async () => {
      const errorLog = [];
      
      automation.onError((error) => errorLog.push(error));
      
      await automation.watch({
        path: testDir,
        events: ['change'],
        trigger: { type: 'file', pattern: '*' },
        action: async () => {
          throw new Error('Intentional test error');
        }
      });

      const testFile = path.join(testDir, 'error.txt');
      await fs.writeFile(testFile, 'trigger error');
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorLog.length).toBeGreaterThan(0);
      expect(errorLog[0].message).toBe('Intentional test error');
    });
  });

  describe('statistics', () => {
    it('should provide execution statistics', async () => {
      const trigger = await automation.registerTrigger({
        name: 'stats-test',
        action: async () => {}
      });

      for (let i = 0; i < 10; i++) {
        await trigger.fire({});
      }

      const stats = automation.getStats();
      
      expect(stats.totalExecutions).toBe(10);
      expect(stats.successRate).toBe(1);
    });
  });

  describe('shutdown', () => {
    it('should stop all watchers on shutdown', async () => {
      await automation.watch({
        path: testDir,
        events: ['change'],
        trigger: { type: 'file', pattern: '*' },
        action: async () => {}
      });

      expect(automation.getActiveWatchers()).toBeGreaterThan(0);
      
      await automation.stopAll();
      
      expect(automation.getActiveWatchers()).toBe(0);
    });

    it('should cancel all schedules on shutdown', async () => {
      await automation.schedule({
        cron: '* * * * *',
        action: async () => {}
      });

      await automation.stopAll();
      
      const stats = automation.getStats();
      expect(stats.activeSchedules).toBe(0);
    });
  });
});
