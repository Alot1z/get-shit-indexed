# Phase 27: Claude Code SDK Integration - TDD Execution Plan

## Overview
Integrate Claude Code SDK and Agent SDK for native tool execution with PreUserPrompt hook.

## Existing Infrastructure
- `lib/sdk/` - SDK module EXISTS
- `lib/sdk/sdk-wrapper.ts` - EXISTS
- `lib/sdk/profile-manager.ts` - EXISTS
- `lib/sdk/direct-api.ts` - EXISTS
- `lib/sdk/auth-manager.ts` - EXISTS
- `lib/sdk/error-handler.ts` - EXISTS
- `lib/sdk/performance-monitor.ts` - EXISTS

## Gap Analysis
1. **Missing PreUserPrompt Hook** - Not implemented
2. **Missing Agent SDK Integration** - Not implemented
3. **Missing MCP Server Alternative** - Not implemented
4. **Missing Unit Tests** - No comprehensive tests
5. **Documentation Gaps** - Needs enhancement

## TDD Execution Waves

### Wave 1: Unit Tests (RED Phase)

#### 27-01-TEST: SDK Wrapper Tests
```typescript
// tests/unit/sdk/sdk-wrapper.test.ts

import { ClaudeCodeSDK, createSDK, getSDK, isSDKAvailable } from '../../../lib/sdk';

describe('ClaudeCodeSDK', () => {
  describe('initialization', () => {
    test('should initialize with default config', () => {
      const sdk = new ClaudeCodeSDK();
      expect(sdk).toBeDefined();
      expect(sdk.isReady()).toBe(true);
    });

    test('should accept custom configuration', () => {
      const sdk = new ClaudeCodeSDK({
        model: 'claude-3-opus',
        maxTokens: 4096
      });
      
      expect(sdk.getConfig().model).toBe('claude-3-opus');
      expect(sdk.getConfig().maxTokens).toBe(4096);
    });
  });

  describe('createSDK()', () => {
    test('should create SDK instance', () => {
      const sdk = createSDK();
      expect(sdk).toBeInstanceOf(ClaudeCodeSDK);
    });

    test('should reuse existing instance', () => {
      const sdk1 = createSDK();
      const sdk2 = createSDK();
      
      expect(sdk1).toBe(sdk2);
    });
  });

  describe('isSDKAvailable()', () => {
    test('should return true when SDK is available', () => {
      expect(isSDKAvailable()).toBe(true);
    });
  });
});
```

#### 27-02-TEST: PreUserPrompt Hook Tests
```typescript
// tests/unit/sdk/pre-user-prompt-hook.test.ts

import { PreUserPromptHook } from '../../../lib/sdk/pre-user-prompt-hook';

describe('PreUserPromptHook', () => {
  let hook: PreUserPromptHook;

  beforeEach(() => {
    hook = new PreUserPromptHook();
  });

  describe('register()', () => {
    test('should register a hook function', () => {
      const callback = jest.fn();
      
      hook.register('test-hook', callback);
      
      expect(hook.hasHook('test-hook')).toBe(true);
    });

    test('should support multiple hooks', () => {
      hook.register('hook1', jest.fn());
      hook.register('hook2', jest.fn());
      
      expect(hook.getHookCount()).toBe(2);
    });
  });

  describe('execute()', () => {
    test('should execute hooks in priority order', async () => {
      const order: string[] = [];
      
      hook.register('low', async () => { order.push('low'); }, { priority: 1 });
      hook.register('high', async () => { order.push('high'); }, { priority: 10 });
      hook.register('medium', async () => { order.push('medium'); }, { priority: 5 });
      
      await hook.execute('test prompt');
      
      expect(order).toEqual(['high', 'medium', 'low']);
    });

    test('should modify prompt through hook chain', async () => {
      hook.register('modifier1', async (prompt) => {
        return prompt + ' modified1';
      });
      hook.register('modifier2', async (prompt) => {
        return prompt + ' modified2';
      });
      
      const result = await hook.execute('original');
      
      expect(result.prompt).toBe('original modified1 modified2');
    });

    test('should handle hook errors gracefully', async () => {
      hook.register('failing', async () => {
        throw new Error('Hook failed');
      });
      hook.register('working', async (prompt) => {
        return prompt + ' working';
      });
      
      const result = await hook.execute('test');
      
      expect(result.prompt).toContain('working');
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('intercept()', () => {
    test('should intercept prompts before Claude sees them', async () => {
      const intercepted: string[] = [];
      
      hook.register('interceptor', async (prompt) => {
        intercepted.push(prompt);
        return prompt;
      });
      
      await hook.intercept('user prompt');
      
      expect(intercepted).toContain('user prompt');
    });

    test('should support prompt enhancement', async () => {
      hook.register('enhancer', async (prompt) => {
        return `[Enhanced] ${prompt}`;
      });
      
      const result = await hook.intercept('test');
      
      expect(result).toBe('[Enhanced] test');
    });
  });
});
```

#### 27-03-TEST: Agent SDK Integration Tests
```typescript
// tests/unit/sdk/agent-sdk.test.ts

import { AgentSDK, AgentConfig } from '../../../lib/sdk/agent-sdk';

describe('AgentSDK', () => {
  describe('createAgent()', () => {
    test('should create agent with config', () => {
      const config: AgentConfig = {
        name: 'test-agent',
        model: 'claude-3-opus',
        instructions: 'You are a helpful assistant'
      };
      
      const agent = AgentSDK.createAgent(config);
      
      expect(agent).toBeDefined();
      expect(agent.name).toBe('test-agent');
    });
  });

  describe('execute()', () => {
    test('should execute agent task', async () => {
      const agent = AgentSDK.createAgent({
        name: 'test',
        model: 'claude-3-sonnet'
      });
      
      const result = await agent.execute('Say hello');
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    test('should support streaming responses', async () => {
      const agent = AgentSDK.createAgent({
        name: 'streaming-test',
        model: 'claude-3-sonnet'
      });
      
      const chunks: string[] = [];
      
      await agent.execute('Count to 5', {
        onChunk: (chunk) => chunks.push(chunk)
      });
      
      expect(chunks.length).toBeGreaterThan(0);
    });
  });

  describe('tool calling', () => {
    test('should support MCP tools', async () => {
      const agent = AgentSDK.createAgent({
        name: 'tool-test',
        tools: ['desktop-commander', 'code-index-mcp']
      });
      
      const result = await agent.execute('List files in current directory');
      
      expect(result.toolCalls).toBeDefined();
      expect(result.toolCalls.length).toBeGreaterThan(0);
    });
  });
});
```

#### 27-04-TEST: MCP Server Alternative Tests
```typescript
// tests/unit/sdk/mcp-alternative.test.ts

import { MCPAlternative, MCPProxy } from '../../../lib/sdk/mcp-alternative';

describe('MCPAlternative', () => {
  describe('createProxy()', () => {
    test('should create proxy for MCP server', () => {
      const proxy = MCPAlternative.createProxy('desktop-commander');
      
      expect(proxy).toBeDefined();
      expect(proxy.serverName).toBe('desktop-commander');
    });
  });

  describe('callTool()', () => {
    test('should call MCP tool via SDK', async () => {
      const proxy = MCPAlternative.createProxy('desktop-commander');
      
      const result = await proxy.callTool('read_file', {
        path: '/test/file.txt'
      });
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    test('should fallback to native MCP on SDK failure', async () => {
      const proxy = MCPAlternative.createProxy('desktop-commander', {
        fallback: true
      });
      
      // Simulate SDK failure
      const result = await proxy.callTool('read_file', {
        path: '/nonexistent'
      });
      
      expect(result.fallback).toBe(true);
    });
  });

  describe('batch operations', () => {
    test('should batch multiple tool calls', async () => {
      const proxy = MCPAlternative.createProxy('desktop-commander');
      
      const results = await proxy.batch([
        { tool: 'read_file', args: { path: '/file1.txt' } },
        { tool: 'read_file', args: { path: '/file2.txt' } },
        { tool: 'read_file', args: { path: '/file3.txt' } }
      ]);
      
      expect(results).toHaveLength(3);
    });
  });
});
```

#### 27-05-TEST: Performance Monitor Tests
```typescript
// tests/unit/sdk/performance-monitor.test.ts

import { PerformanceMonitor } from '../../../lib/sdk/performance-monitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });

  describe('timing', () => {
    test('should track operation timing', () => {
      monitor.startOperation('test-op');
      
      // Simulate work
      const result = monitor.endOperation('test-op');
      
      expect(result.duration).toBeGreaterThan(0);
    });

    test('should calculate average timing', () => {
      for (let i = 0; i < 5; i++) {
        monitor.startOperation('repeat-op');
        monitor.endOperation('repeat-op');
      }
      
      const stats = monitor.getStats('repeat-op');
      
      expect(stats.averageDuration).toBeGreaterThan(0);
      expect(stats.count).toBe(5);
    });
  });

  describe('metrics', () => {
    test('should track success/failure rates', () => {
      monitor.recordSuccess('op1');
      monitor.recordSuccess('op1');
      monitor.recordFailure('op1');
      
      const metrics = monitor.getMetrics('op1');
      
      expect(metrics.successRate).toBeCloseTo(0.67, 1);
    });

    test('should track token usage', () => {
      monitor.recordTokens('op1', 100);
      monitor.recordTokens('op1', 200);
      
      const metrics = monitor.getMetrics('op1');
      
      expect(metrics.totalTokens).toBe(300);
      expect(metrics.averageTokens).toBe(150);
    });
  });

  describe('reporting', () => {
    test('should generate performance report', () => {
      monitor.startOperation('op1');
      monitor.endOperation('op1');
      monitor.recordSuccess('op1');
      
      const report = monitor.generateReport();
      
      expect(report.operations).toContain('op1');
      expect(report.summary).toBeDefined();
    });
  });
});
```

### Wave 2: Implementation Enhancement (GREEN Phase)

#### 27-06-IMPL: PreUserPrompt Hook Implementation
```typescript
// lib/sdk/pre-user-prompt-hook.ts

import { PromptEnhancer } from '../prompt-enhancer';

export interface HookResult {
  prompt: string;
  modified: boolean;
  errors: Error[];
  metadata: Record<string, any>;
}

export interface HookConfig {
  priority?: number;
  timeout?: number;
  enabled?: boolean;
}

export class PreUserPromptHook {
  private hooks: Map<string, {
    callback: (prompt: string, context?: any) => Promise<string>;
    config: HookConfig;
  }> = new Map();

  private enhancer: PromptEnhancer;

  constructor() {
    this.enhancer = new PromptEnhancer();
    this.registerBuiltInHooks();
  }

  private registerBuiltInHooks(): void {
    // Built-in enhancement hook
    this.register('enhancement', async (prompt, context) => {
      const result = await this.enhancer.fullEnhance(prompt, context);
      return result.enhancement.enhanced;
    }, { priority: 5, enabled: true });

    // Built-in validation hook
    this.register('validation', async (prompt) => {
      // Basic validation
      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Empty prompt');
      }
      return prompt;
    }, { priority: 10, enabled: true });
  }

  register(
    name: string,
    callback: (prompt: string, context?: any) => Promise<string>,
    config: HookConfig = {}
  ): void {
    this.hooks.set(name, {
      callback,
      config: {
        priority: config.priority ?? 0,
        timeout: config.timeout ?? 5000,
        enabled: config.enabled ?? true
      }
    });
  }

  hasHook(name: string): boolean {
    return this.hooks.has(name);
  }

  getHookCount(): number {
    return this.hooks.size;
  }

  async execute(prompt: string, context?: any): Promise<HookResult> {
    const errors: Error[] = [];
    let currentPrompt = prompt;
    let modified = false;

    // Sort hooks by priority (highest first)
    const sortedHooks = Array.from(this.hooks.entries())
      .filter(([_, { config }]) => config.enabled)
      .sort((a, b) => b[1].config.priority! - a[1].config.priority!);

    for (const [name, { callback, config }] of sortedHooks) {
      try {
        const result = await this.executeWithTimeout(
          callback(currentPrompt, context),
          config.timeout!
        );

        if (result !== currentPrompt) {
          currentPrompt = result;
          modified = true;
        }
      } catch (error) {
        errors.push(error as Error);
      }
    }

    return {
      prompt: currentPrompt,
      modified,
      errors,
      metadata: {
        hookCount: sortedHooks.length,
        timestamp: Date.now()
      }
    };
  }

  async intercept(prompt: string, context?: any): Promise<string> {
    const result = await this.execute(prompt, context);
    return result.prompt;
  }

  private async executeWithTimeout<T>(
    promise: Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Hook timeout')), timeout)
      )
    ]);
  }

  remove(name: string): boolean {
    return this.hooks.delete(name);
  }

  enable(name: string): void {
    const hook = this.hooks.get(name);
    if (hook) {
      hook.config.enabled = true;
    }
  }

  disable(name: string): void {
    const hook = this.hooks.get(name);
    if (hook) {
      hook.config.enabled = false;
    }
  }
}

export const preUserPromptHook = new PreUserPromptHook();
```

#### 27-07-IMPL: Agent SDK Implementation
```typescript
// lib/sdk/agent-sdk.ts

import { ClaudeCodeSDK } from './sdk-wrapper';

export interface AgentConfig {
  name: string;
  model?: string;
  instructions?: string;
  tools?: string[];
  maxTokens?: number;
}

export interface AgentResult {
  success: boolean;
  response?: string;
  toolCalls?: any[];
  error?: Error;
}

export class AgentSDK {
  private static agents: Map<string, AgentSDK> = new Map();

  readonly name: string;
  private sdk: ClaudeCodeSDK;
  private config: AgentConfig;

  private constructor(config: AgentConfig) {
    this.name = config.name;
    this.config = config;
    this.sdk = new ClaudeCodeSDK({
      model: config.model,
      maxTokens: config.maxTokens
    });
  }

  static createAgent(config: AgentConfig): AgentSDK {
    if (this.agents.has(config.name)) {
      return this.agents.get(config.name)!;
    }

    const agent = new AgentSDK(config);
    this.agents.set(config.name, agent);
    return agent;
  }

  async execute(prompt: string, options?: {
    onChunk?: (chunk: string) => void;
    tools?: string[];
  }): Promise<AgentResult> {
    try {
      // Build message with instructions
      const fullPrompt = this.config.instructions
        ? `${this.config.instructions}\n\n${prompt}`
        : prompt;

      // Execute via SDK
      const result = await this.sdk.sendMessage(fullPrompt, {
        tools: options?.tools || this.config.tools,
        onChunk: options?.onChunk
      });

      return {
        success: true,
        response: result.content,
        toolCalls: result.toolCalls
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error
      };
    }
  }

  updateConfig(config: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): AgentConfig {
    return { ...this.config };
  }

  static getAgent(name: string): AgentSDK | undefined {
    return this.agents.get(name);
  }

  static listAgents(): string[] {
    return Array.from(this.agents.keys());
  }
}
```

#### 27-08-IMPL: MCP Alternative Implementation
```typescript
// lib/sdk/mcp-alternative.ts

import { ClaudeCodeSDK } from './sdk-wrapper';

export interface MCPProxyConfig {
  fallback?: boolean;
  timeout?: number;
}

export class MCPProxy {
  readonly serverName: string;
  private sdk: ClaudeCodeSDK;
  private config: MCPProxyConfig;

  constructor(serverName: string, config: MCPProxyConfig = {}) {
    this.serverName = serverName;
    this.config = {
      fallback: config.fallback ?? true,
      timeout: config.timeout ?? 30000
    };
    this.sdk = new ClaudeCodeSDK();
  }

  async callTool(toolName: string, args: Record<string, any>): Promise<any> {
    try {
      // Try SDK first
      const result = await this.sdk.callTool(
        this.serverName,
        toolName,
        args
      );

      return {
        success: true,
        result,
        fallback: false
      };
    } catch (sdkError) {
      if (!this.config.fallback) {
        throw sdkError;
      }

      // Fallback to native MCP
      try {
        const mcpResult = await this.callNativeMCP(toolName, args);
        return {
          success: true,
          result: mcpResult,
          fallback: true
        };
      } catch (mcpError) {
        throw new Error(
          `Both SDK and MCP failed: SDK=${sdkError}, MCP=${mcpError}`
        );
      }
    }
  }

  async batch(calls: Array<{ tool: string; args: Record<string, any> }>): Promise<any[]> {
    return Promise.all(
      calls.map(call => this.callTool(call.tool, call.args))
    );
  }

  private async callNativeMCP(toolName: string, args: Record<string, any>): Promise<any> {
    // This would call the native MCP tool
    // Implementation depends on MCP client availability
    const mcpToolName = `mcp__${this.serverName}__${toolName}`;
    
    // Simulate MCP call (actual implementation would use MCP client)
    throw new Error('Native MCP not available');
  }
}

export class MCPAlternative {
  static proxies: Map<string, MCPProxy> = new Map();

  static createProxy(serverName: string, config?: MCPProxyConfig): MCPProxy {
    if (this.proxies.has(serverName)) {
      return this.proxies.get(serverName)!;
    }

    const proxy = new MCPProxy(serverName, config);
    this.proxies.set(serverName, proxy);
    return proxy;
  }

  static getProxy(serverName: string): MCPProxy | undefined {
    return this.proxies.get(serverName);
  }

  static listProxies(): string[] {
    return Array.from(this.proxies.keys());
  }
}
```

### Wave 3: Integration & Performance (REFACTOR Phase)

#### 27-09-INT: Integration Tests
```typescript
// tests/integration/sdk/full-integration.test.ts

import { ClaudeCodeSDK } from '../../../lib/sdk';
import { PreUserPromptHook } from '../../../lib/sdk/pre-user-prompt-hook';
import { AgentSDK } from '../../../lib/sdk/agent-sdk';
import { MCPAlternative } from '../../../lib/sdk/mcp-alternative';

describe('SDK Full Integration', () => {
  describe('End-to-End Flow', () => {
    test('should enhance prompt via hook and execute via agent', async () => {
      // Setup hook
      const hook = new PreUserPromptHook();
      hook.register('test-enhancer', async (prompt) => {
        return `[Enhanced] ${prompt}`;
      });

      // Create agent
      const agent = AgentSDK.createAgent({
        name: 'test-agent',
        model: 'claude-3-sonnet'
      });

      // Execute flow
      const enhanced = await hook.intercept('Test prompt');
      const result = await agent.execute(enhanced);

      expect(enhanced).toBe('[Enhanced] Test prompt');
      expect(result.success).toBe(true);
    });

    test('should fallback from SDK to MCP on failure', async () => {
      const proxy = MCPAlternative.createProxy('test-server', {
        fallback: true
      });

      // SDK will fail, MCP should work
      const result = await proxy.callTool('test_tool', { arg: 'value' });

      expect(result.fallback).toBe(true);
    });

    test('should track performance across all components', async () => {
      const sdk = new ClaudeCodeSDK();
      
      // Execute multiple operations
      for (let i = 0; i < 5; i++) {
        await sdk.sendMessage(`Test message ${i}`);
      }

      const report = sdk.getPerformanceReport();
      
      expect(report.operations).toBeGreaterThan(0);
      expect(report.averageLatency).toBeGreaterThan(0);
    });
  });
});
```

## Success Criteria (from ROADMAP)
1. ✅ SDK wrapper module created - EXISTS
2. ⏳ PreUserPrompt hook integration - NEEDS IMPLEMENTATION
3. ⏳ Agent SDK integrated - NEEDS IMPLEMENTATION
4. ⏳ MCP server alternative - NEEDS IMPLEMENTATION
5. ⏳ Wrapper script for enhancement - NEEDS IMPLEMENTATION

## Execution Checklist

### Wave 1: Unit Tests
- [ ] Create tests/unit/sdk/ directory
- [ ] Write sdk-wrapper.test.ts
- [ ] Write pre-user-prompt-hook.test.ts
- [ ] Write agent-sdk.test.ts
- [ ] Write mcp-alternative.test.ts
- [ ] Write performance-monitor.test.ts
- [ ] Run tests (expect failures - RED phase)

### Wave 2: Implementation
- [ ] Implement pre-user-prompt-hook.ts
- [ ] Implement agent-sdk.ts
- [ ] Implement mcp-alternative.ts
- [ ] Enhance existing SDK modules
- [ ] Run tests (expect passes - GREEN phase)

### Wave 3: Integration & Performance
- [ ] Create integration tests
- [ ] Add performance benchmarks
- [ ] Refactor for optimization
- [ ] Create documentation
- [ ] Final verification

## File Structure
```
lib/sdk/
├── index.ts                    # Main entry (EXISTS)
├── sdk-wrapper.ts              # SDK wrapper (EXISTS)
├── profile-manager.ts          # Profiles (EXISTS)
├── direct-api.ts               # Direct API (EXISTS)
├── auth-manager.ts             # Auth (EXISTS)
├── error-handler.ts            # Errors (EXISTS)
├── performance-monitor.ts      # Performance (EXISTS)
├── pre-user-prompt-hook.ts     # NEW: Hook system
├── agent-sdk.ts                # NEW: Agent SDK
└── mcp-alternative.ts          # NEW: MCP proxy

tests/unit/sdk/
├── sdk-wrapper.test.ts         # NEW
├── pre-user-prompt-hook.test.ts # NEW
├── agent-sdk.test.ts           # NEW
├── mcp-alternative.test.ts     # NEW
└── performance-monitor.test.ts # NEW

tests/integration/sdk/
└── full-integration.test.ts    # NEW
```
