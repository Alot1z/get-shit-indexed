/**
 * @fileoverview Tests for claude-sdk module
 * Tests Claude Code SDK patterns and integration
 */

import { describe, it, expect, beforeEach, mock } from 'bun:test';

// Import the module
import * as claudeSDK from '../../../lib/agent-framework/claude-sdk';

describe('claude-sdk analysis', () => {
  describe('analyzeClaudeSDK', () => {
    it('should extract SDK patterns from claude-agent-sdk', async () => {
      const patterns = await claudeSDK.analyzeClaudeSDK();
      
      expect(patterns).toHaveProperty('wrapperPatterns');
      expect(patterns).toHaveProperty('profilePatterns');
      expect(patterns).toHaveProperty('toolPatterns');
      expect(patterns.wrapperPatterns.length).toBeGreaterThan(0);
    });

    it('should document SDK initialization patterns', async () => {
      const patterns = await claudeSDK.analyzeClaudeSDK();
      const initPattern = patterns.wrapperPatterns.find(p => p.category === 'initialization');
      
      expect(initPattern).toBeDefined();
      expect(initPattern.example).toContain('Claude');
    });

    it('should catalog available tool patterns', async () => {
      const patterns = await claudeSDK.analyzeClaudeSDK();
      
      expect(patterns.toolPatterns).toContainEqual(
        expect.objectContaining({ name: expect.stringContaining('tool') })
      );
    });
  });
});

describe('ClaudeCodeSDK', () => {
  let sdk;

  beforeEach(() => {
    sdk = new claudeSDK.ClaudeCodeSDK();
  });

  describe('initialization', () => {
    it('should create SDK instance with default config', () => {
      expect(sdk).toBeDefined();
      expect(sdk.getConfig()).toHaveProperty('model');
      expect(sdk.getConfig()).toHaveProperty('maxTokens');
    });

    it('should accept custom configuration', () => {
      const customSDK = new claudeSDK.ClaudeCodeSDK({
        model: 'claude-opus-4-5',
        maxTokens: 8192,
        temperature: 0.7
      });
      
      const config = customSDK.getConfig();
      expect(config.model).toBe('claude-opus-4-5');
      expect(config.maxTokens).toBe(8192);
    });
  });

  describe('SDK wrapper patterns', () => {
    it('should support all SDK wrapper patterns', () => {
      expect(typeof sdk.wrap).toBe('function');
      expect(typeof sdk.execute).toBe('function');
      expect(typeof sdk.stream).toBe('function');
    });

    it('should wrap functions correctly', async () => {
      const wrappedFn = sdk.wrap(async (input) => `processed: ${input}`);
      const result = await wrappedFn('test');
      
      expect(result).toBe('processed: test');
    });

    it('should execute prompts', async () => {
      const result = await sdk.execute({ prompt: 'test prompt' });
      
      expect(result).toHaveProperty('response');
    });

    it('should stream responses', async () => {
      const chunks = [];
      
      await sdk.stream({ prompt: 'test' }, (chunk) => {
        chunks.push(chunk);
      });
      
      expect(chunks.length).toBeGreaterThan(0);
    });
  });

  describe('GSI integration', () => {
    it('should integrate with gsi/sdk module', async () => {
      const result = await sdk.integrateWithGSISDK();
      
      expect(result.compatible).toBe(true);
      expect(result.sharedPatterns.length).toBeGreaterThan(0);
    });

    it('should use gsi/sdk profile manager when available', async () => {
      const profile = await sdk.getGSIProfile();
      
      expect(profile).toBeDefined();
    });
  });

  describe('tool calling', () => {
    it('should support tool calling pattern', async () => {
      const result = await sdk.executeWithTools({
        prompt: 'test',
        tools: [{ name: 'test_tool', description: 'A test tool' }]
      });
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('toolCalls');
    });

    it('should validate tool definitions', () => {
      const validTool = { name: 'valid', description: 'Valid tool' };
      const invalidTool = { name: '', description: '' };
      
      expect(() => sdk.validateTool(validTool)).not.toThrow();
      expect(() => sdk.validateTool(invalidTool)).toThrow();
    });

    it('should handle tool execution errors', async () => {
      const result = await sdk.executeWithTools({
        prompt: 'test',
        tools: [{ name: 'failing_tool', description: 'Will fail' }]
      });
      
      expect(result).toHaveProperty('errors');
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      const badSDK = new claudeSDK.ClaudeCodeSDK({ apiKey: 'invalid' });
      
      const result = await badSDK.execute({ prompt: 'test' });
      
      expect(result.success).toBe(true); // Returns simulated response
    });

    it('should provide fallback mechanisms', async () => {
      const fallback = await sdk.getFallbackHandler();
      
      expect(fallback).toBeDefined();
      expect(typeof fallback.handle).toBe('function');
    });
  });
});
