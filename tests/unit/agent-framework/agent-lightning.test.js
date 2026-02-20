/**
 * @fileoverview Tests for agent-lightning module
 * Tests fast agent execution patterns with <500ms overhead
 */

import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';

// Import the module
import * as agentLightning from '../../../lib/agent-framework/agent-lightning';

describe('agent-lightning', () => {
  describe('analyzeAgentLightning', () => {
    it('should analyze agent-lightning repository structure', async () => {
      const result = await agentLightning.analyzeAgentLightning('https://github.com/microsoft/agent-lightning');
      
      expect(result).toHaveProperty('structure');
      expect(result).toHaveProperty('keyPatterns');
      expect(result).toHaveProperty('executionModel');
      expect(result.keyPatterns.length).toBeGreaterThan(0);
    });

    it('should identify fast execution patterns', async () => {
      const result = await agentLightning.analyzeAgentLightning();
      
      expect(result.keyPatterns).toContainEqual(
        expect.objectContaining({ type: 'execution-optimization' })
      );
    });
  });

  describe('LightningWrapper', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = new agentLightning.LightningWrapper();
    });

    afterEach(() => {
      // Clear any state if needed
    });

    it('should execute agent with <500ms overhead', async () => {
      const start = Date.now();
      const result = await wrapper.executeAgent({
        task: 'test task',
        context: { files: [] }
      });
      const duration = Date.now() - start;
      
      expect(result).toHaveProperty('output');
      expect(duration).toBeLessThan(500);
    });

    it('should support parallel agent execution', async () => {
      const tasks = [
        { task: 'task1', context: {} },
        { task: 'task2', context: {} },
        { task: 'task3', context: {} }
      ];
      
      const results = await wrapper.executeParallel(tasks);
      
      expect(results.length).toBe(3);
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should handle agent execution errors gracefully', async () => {
      const result = await wrapper.executeAgent({
        task: 'invalid task',
        context: null
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should provide execution metrics', async () => {
      await wrapper.executeAgent({ task: 'test1', context: {} });
      await wrapper.executeAgent({ task: 'test2', context: {} });
      
      const metrics = wrapper.getMetrics();
      
      expect(metrics.totalExecutions).toBe(2);
      expect(metrics.averageDuration).toBeLessThan(500);
    });

    it('should cache repeated executions', async () => {
      const task = { task: 'cached task', context: { data: 'test' } };
      
      await wrapper.executeAgent(task);
      await wrapper.executeAgent(task);
      
      const metrics = wrapper.getMetrics();
      expect(metrics.cacheHits).toBeGreaterThan(0);
    });
  });

  describe('LightningConfig', () => {
    it('should accept custom configuration', () => {
      const customConfig = {
        timeout: 10000,
        maxRetries: 3,
        cacheEnabled: true
      };
      
      const wrapper = new agentLightning.LightningWrapper(customConfig);
      const config = wrapper.getConfig();
      
      expect(config.timeout).toBe(10000);
      expect(config.maxRetries).toBe(3);
      expect(config.cacheEnabled).toBe(true);
    });

    it('should use default configuration when not specified', () => {
      const wrapper = new agentLightning.LightningWrapper();
      const config = wrapper.getConfig();
      
      expect(config.timeout).toBeDefined();
      expect(config.maxRetries).toBeDefined();
    });
  });
});
