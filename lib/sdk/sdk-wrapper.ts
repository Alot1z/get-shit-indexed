/**
 * Claude Code SDK Wrapper
 * 
 * Abstracts Claude Code SDK complexity and provides GSI-friendly API.
 * Handles SDK initialization, method mapping, and MCP fallback.
 * 
 * @module gsi/sdk/sdk-wrapper
 */

import { EventEmitter } from 'events';
import { DirectAPI } from './direct-api';
import { ProfileManager, type ModelProfile } from './profile-manager';
import { SDKErrorHandler } from './error-handler';
import { PerformanceMonitor } from './performance-monitor';

// SDK method types
export interface SDKMethod {
  name: string;
  params: Record<string, unknown>;
  returns: unknown;
}

// SDK configuration
export interface SDKConfig {
  /** Enable SDK if available (default: true) */
  enabled: boolean;
  /** Fallback to MCP on SDK failure (default: true) */
  fallbackToMCP: boolean;
  /** Profile to use for model selection */
  profile?: string;
  /** Timeout for SDK operations (ms) */
  timeout?: number;
  /** Enable performance monitoring */
  monitorPerformance?: boolean;
}

// SDK status
export type SDKStatus = 'available' | 'unavailable' | 'error' | 'initializing';

// SDK capabilities detection result
export interface SDKCapabilities {
  directAPI: boolean;
  streaming: boolean;
  fileOperations: boolean;
  toolExecution: boolean;
  sessionManagement: boolean;
}

/**
 * Claude Code SDK Wrapper
 * 
 * Provides a unified interface for Claude Code SDK operations with
 * automatic MCP fallback when SDK is unavailable.
 */
export class ClaudeCodeSDK extends EventEmitter {
  private config: SDKConfig;
  private directAPI: DirectAPI | null = null;
  private profileManager: ProfileManager;
  private errorHandler: SDKErrorHandler;
  private performanceMonitor: PerformanceMonitor;
  private _status: SDKStatus = 'unavailable';
  private _capabilities: SDKCapabilities | null = null;

  constructor(config: Partial<SDKConfig> = {}) {
    super();
    this.config = {
      enabled: true,
      fallbackToMCP: true,
      profile: 'balanced',
      timeout: 30000,
      monitorPerformance: true,
      ...config,
    };

    this.profileManager = new ProfileManager();
    this.errorHandler = new SDKErrorHandler();
    this.performanceMonitor = new PerformanceMonitor();
  }

  /**
   * Initialize SDK and detect capabilities
   */
  async initialize(): Promise<void> {
    this._status = 'initializing';
    this.emit('statusChange', this._status);

    try {
      // Try to initialize Direct API
      this.directAPI = new DirectAPI({
        timeout: this.config.timeout,
      });

      const available = await this.directAPI.checkAvailability();
      
      if (available) {
        this._capabilities = await this.detectCapabilities();
        this._status = 'available';
      } else {
        this._status = 'unavailable';
      }
    } catch (error) {
      this._status = 'error';
      this.errorHandler.recordError({
        type: 'initialization',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    this.emit('statusChange', this._status);
  }

  /**
   * Get current SDK status
   */
  get status(): SDKStatus {
    return this._status;
  }

  /**
   * Check if SDK is available
   */
  isAvailable(): boolean {
    return this._status === 'available';
  }

  /**
   * Get detected capabilities
   */
  get capabilities(): SDKCapabilities | null {
    return this._capabilities;
  }

  /**
   * Detect SDK capabilities
   */
  private async detectCapabilities(): Promise<SDKCapabilities> {
    if (!this.directAPI) {
      return {
        directAPI: false,
        streaming: false,
        fileOperations: false,
        toolExecution: false,
        sessionManagement: false,
      };
    }

    return {
      directAPI: true,
      streaming: await this.directAPI.hasCapability('streaming'),
      fileOperations: await this.directAPI.hasCapability('fileOperations'),
      toolExecution: await this.directAPI.hasCapability('toolExecution'),
      sessionManagement: await this.directAPI.hasCapability('sessionManagement'),
    };
  }

  /**
   * Execute a prompt using SDK or MCP fallback
   */
  async executePrompt(
    prompt: string,
    options: {
      model?: string;
      profile?: string;
      stream?: boolean;
    } = {}
  ): Promise<unknown> {
    const startTime = Date.now();
    const profile = options.profile || this.config.profile || 'balanced';
    const model = options.model || this.profileManager.getModelForProfile(profile as ModelProfile);

    try {
      if (this.isAvailable() && this.directAPI) {
        const result = await this.directAPI.execute(prompt, { model, ...options });
        
        if (this.config.monitorPerformance) {
          this.performanceMonitor.recordTiming({
            operation: 'executePrompt',
            method: 'sdk',
            duration: Date.now() - startTime,
            success: true,
          });
        }

        return result;
      }

      // Fallback to MCP
      if (this.config.fallbackToMCP) {
        return this.executeViaMCP(prompt, { model, ...options });
      }

      throw new Error('SDK unavailable and MCP fallback disabled');
    } catch (error) {
      if (this.config.monitorPerformance) {
        this.performanceMonitor.recordTiming({
          operation: 'executePrompt',
          method: this.isAvailable() ? 'sdk' : 'mcp',
          duration: Date.now() - startTime,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // Try MCP fallback on error
      if (this.config.fallbackToMCP && this.isAvailable()) {
        this.errorHandler.recordError({
          type: 'execution',
          message: error instanceof Error ? error.message : 'Unknown error',
          operation: 'executePrompt',
        });

        return this.executeViaMCP(prompt, { model, ...options });
      }

      throw error;
    }
  }

  /**
   * Execute via MCP fallback
   */
  private async executeViaMCP(
    prompt: string,
    options: Record<string, unknown>
  ): Promise<unknown> {
    // This would call MCP tools like mcp__desktop-commander__start_process
    // For now, return a placeholder that indicates MCP should be used
    return {
      _mcpFallback: true,
      prompt,
      options,
      message: 'Use MCP tools for this operation',
    };
  }

  /**
   * Get current model profile
   */
  getCurrentProfile(): ModelProfile {
    return (this.config.profile || 'balanced') as ModelProfile;
  }

  /**
   * Set model profile
   */
  setProfile(profile: ModelProfile): void {
    this.config.profile = profile;
    this.emit('profileChange', profile);
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return this.performanceMonitor.getMetrics();
  }

  /**
   * Get error history
   */
  getErrorHistory() {
    return this.errorHandler.getErrorHistory();
  }
}

/**
 * Singleton SDK manager
 */
class SDKManagerImpl {
  private instances: Map<string, ClaudeCodeSDK> = new Map();
  private defaultInstance: ClaudeCodeSDK | null = null;

  /**
   * Create or get SDK instance
   */
  create(name: string = 'default', config?: Partial<SDKConfig>): ClaudeCodeSDK {
    if (this.instances.has(name)) {
      return this.instances.get(name)!;
    }

    const sdk = new ClaudeCodeSDK(config);
    this.instances.set(name, sdk);

    if (name === 'default') {
      this.defaultInstance = sdk;
    }

    return sdk;
  }

  /**
   * Get SDK instance by name
   */
  get(name: string = 'default'): ClaudeCodeSDK | undefined {
    return this.instances.get(name);
  }

  /**
   * Get default instance (creates if not exists)
   */
  getDefault(): ClaudeCodeSDK {
    if (!this.defaultInstance) {
      this.defaultInstance = this.create('default');
    }
    return this.defaultInstance;
  }

  /**
   * Check if SDK is available
   */
  async isAvailable(): Promise<boolean> {
    const sdk = this.getDefault();
    if (sdk.status === 'unavailable') {
      await sdk.initialize();
    }
    return sdk.isAvailable();
  }

  /**
   * Dispose all instances
   */
  disposeAll(): void {
    this.instances.clear();
    this.defaultInstance = null;
  }
}

export const SDKManager = new SDKManagerImpl();

// Convenience functions
export function createSDK(config?: Partial<SDKConfig>): ClaudeCodeSDK {
  return SDKManager.create('default', config);
}

export function getSDK(): ClaudeCodeSDK {
  return SDKManager.getDefault();
}

export async function isSDKAvailable(): Promise<boolean> {
  return SDKManager.isAvailable();
}
