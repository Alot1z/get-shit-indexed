/**
 * @fileoverview Tests for agent-framework index module
 * Tests unified API and module exports
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

// Import the module
import * as agentFramework from '../../../lib/agent-framework';

describe('Agent Framework Index', () => {
  describe('module exports', () => {
    it('should export LightningWrapper', () => {
      expect(agentFramework.LightningWrapper).toBeDefined();
      expect(typeof agentFramework.LightningWrapper).toBe('function');
    });

    it('should export TaskQueue', () => {
      expect(agentFramework.TaskQueue).toBeDefined();
      expect(typeof agentFramework.TaskQueue).toBe('function');
    });

    it('should export ClaudeCodeSDK', () => {
      expect(agentFramework.ClaudeCodeSDK).toBeDefined();
      expect(typeof agentFramework.ClaudeCodeSDK).toBe('function');
    });

    it('should export ProfileManager', () => {
      expect(agentFramework.ProfileManager).toBeDefined();
      expect(typeof agentFramework.ProfileManager).toBe('function');
    });

    it('should export PlaybookExecutor', () => {
      expect(agentFramework.PlaybookExecutor).toBeDefined();
      expect(typeof agentFramework.PlaybookExecutor).toBe('function');
    });

    it('should export AutomationLayer', () => {
      expect(agentFramework.AutomationLayer).toBeDefined();
      expect(typeof agentFramework.AutomationLayer).toBe('function');
    });

    it('should export playbook templates', () => {
      expect(agentFramework.getPlaybookTemplate).toBeDefined();
      expect(agentFramework.listPlaybookTemplates).toBeDefined();
    });
  });

  describe('createAgentFramework', () => {
    it('should provide unified API', () => {
      const api = agentFramework.createAgentFramework();
      
      expect(api).toHaveProperty('lightning');
      expect(api).toHaveProperty('sdk');
      expect(api).toHaveProperty('playbooks');
      expect(api).toHaveProperty('automation');
      expect(api).toHaveProperty('queue');
      expect(api).toHaveProperty('profiles');
    });

    it('should create initialized components', () => {
      const api = agentFramework.createAgentFramework();
      
      expect(api.lightning).toBeDefined();
      expect(api.sdk).toBeDefined();
      expect(api.queue).toBeDefined();
    });
  });

  describe('quickInit', () => {
    it('should support quick initialization', async () => {
      const framework = await agentFramework.quickInit({
        profile: 'haiku',
        maxConcurrent: 5
      });
      
      expect(framework).toBeDefined();
      expect(framework.profiles.getCurrentProfile().name).toBe('haiku');
      expect(framework.queue.getMaxConcurrent()).toBe(5);
    });

    it('should use defaults when options not provided', async () => {
      const framework = await agentFramework.quickInit();
      
      expect(framework).toBeDefined();
      expect(framework.profiles.getCurrentProfile()).toBeDefined();
    });

    it('should initialize all components', async () => {
      const framework = await agentFramework.quickInit();
      
      expect(framework.lightning).toBeDefined();
      expect(framework.sdk).toBeDefined();
      expect(framework.playbooks).toBeDefined();
      expect(framework.automation).toBeDefined();
      expect(framework.queue).toBeDefined();
      expect(framework.profiles).toBeDefined();
    });
  });

  describe('AgentFrameworkAPI', () => {
    let framework;

    beforeEach(async () => {
      framework = await agentFramework.quickInit();
    });

    afterEach(async () => {
      if (framework && framework.shutdown) {
        await framework.shutdown();
      }
    });

    it('should provide executeWorkflow method', () => {
      expect(typeof framework.executeWorkflow).toBe('function');
    });

    it('should provide shutdown method', () => {
      expect(typeof framework.shutdown).toBe('function');
    });

    it('should provide prepareAgentContext method', () => {
      expect(typeof framework.prepareAgentContext).toBe('function');
    });

    it('should integrate with core engine search', async () => {
      const context = await framework.prepareAgentContext({
        task: 'Find authentication code',
        useSearch: true
      });
      
      expect(context).toHaveProperty('relevantFiles');
    });
  });
});

describe('Version Information', () => {
  it('should export version', () => {
    expect(agentFramework.version).toBeDefined();
    expect(typeof agentFramework.version).toBe('string');
  });
});

describe('Types', () => {
  it('should export TaskStatus', () => {
    expect(agentFramework.TaskStatus).toBeDefined();
  });
});
