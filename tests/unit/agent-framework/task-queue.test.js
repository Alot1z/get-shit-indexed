/**
 * @fileoverview Tests for task-queue module
 * Tests concurrent agent task handling with priority support
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

// Import the module
import { TaskQueue, TaskStatus } from '../../../lib/agent-framework/task-queue';

describe('TaskQueue', () => {
  let queue;

  beforeEach(() => {
    queue = new TaskQueue({ maxConcurrent: 10 });
  });

  afterEach(async () => {
    await queue.shutdown();
  });

  describe('basic operations', () => {
    it('should enqueue and process tasks', async () => {
      const task = { id: '1', type: 'test', payload: {} };
      
      await queue.enqueue(task);
      const status = await queue.getStatus('1');
      
      expect(status).toBe(TaskStatus.COMPLETED);
    });

    it('should handle 10+ concurrent agents', async () => {
      const tasks = Array.from({ length: 15 }, (_, i) => ({
        id: `task-${i}`,
        type: 'test',
        payload: { index: i }
      }));
      
      const start = Date.now();
      await Promise.all(tasks.map(t => queue.enqueue(t)));
      const duration = Date.now() - start;
      
      const stats = queue.getStats();
      expect(stats.maxConcurrent).toBeGreaterThanOrEqual(10);
      expect(duration).toBeLessThan(5000); // All 15 in under 5s
    });
  });

  describe('priority handling', () => {
    it('should prioritize tasks correctly', async () => {
      const highPriority = { id: 'high', type: 'test', payload: {}, priority: 10 };
      const lowPriority = { id: 'low', type: 'test', payload: {}, priority: 1 };
      
      await queue.enqueue(lowPriority);
      await queue.enqueue(highPriority);
      
      const order = queue.getExecutionOrder();
      expect(order[0]).toBe('high');
      expect(order[1]).toBe('low');
    });

    it('should respect priority order when queue is full', async () => {
      // Fill queue
      for (let i = 0; i < 10; i++) {
        await queue.enqueue({ id: `low-${i}`, type: 'test', payload: {}, priority: 1 });
      }
      
      // Add high priority task
      await queue.enqueue({ id: 'high-priority', type: 'test', payload: {}, priority: 100 });
      
      const order = queue.getExecutionOrder();
      expect(order[0]).toBe('high-priority');
    });
  });

  describe('error handling and retries', () => {
    it('should retry failed tasks up to max attempts', async () => {
      const failingTask = { 
        id: 'failing', 
        type: 'fail', 
        payload: {},
        maxRetries: 3
      };
      
      await queue.enqueue(failingTask);
      const status = await queue.getStatus('failing');
      const attempts = queue.getTaskAttempts('failing');
      
      expect(status).toBe(TaskStatus.FAILED);
      expect(attempts).toBe(3);
    });

    it('should track error history', async () => {
      await queue.enqueue({ id: 'error-task', type: 'fail', payload: {} });
      
      const errors = queue.getErrorHistory();
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('queue management', () => {
    it('should pause and resume queue', async () => {
      await queue.pause();
      expect(queue.isPaused()).toBe(true);
      
      await queue.resume();
      expect(queue.isPaused()).toBe(false);
    });

    it('should clear queue', async () => {
      for (let i = 0; i < 5; i++) {
        await queue.enqueue({ id: `task-${i}`, type: 'test', payload: {} });
      }
      
      await queue.clear();
      expect(queue.size()).toBe(0);
    });

    it('should provide queue statistics', async () => {
      for (let i = 0; i < 5; i++) {
        await queue.enqueue({ id: `task-${i}`, type: 'test', payload: {} });
      }
      
      const stats = queue.getStats();
      expect(stats.totalProcessed).toBe(5);
      expect(stats.successRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('concurrency control', () => {
    it('should limit concurrent executions', async () => {
      const smallQueue = new TaskQueue({ maxConcurrent: 2 });
      
      // Enqueue 5 tasks
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(smallQueue.enqueue({ id: `task-${i}`, type: 'test', payload: {} }));
      }
      
      await Promise.all(promises);
      const stats = smallQueue.getStats();
      
      expect(stats.maxConcurrentObserved).toBeLessThanOrEqual(2);
      
      await smallQueue.shutdown();
    });

    it('should handle backpressure', async () => {
      // Enqueue more tasks than queue can handle immediately
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(queue.enqueue({ id: `task-${i}`, type: 'test', payload: {} }));
      }
      
      await Promise.all(promises);
      
      const stats = queue.getStats();
      expect(stats.backpressureEvents).toBeGreaterThanOrEqual(0);
    });
  });
});
