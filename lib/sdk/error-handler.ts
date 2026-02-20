/**
 * SDK Error Handler
 * 
 * Handles SDK errors with automatic MCP fallback support.
 * 
 * @module gsi/sdk/error-handler
 */

import { EventEmitter } from 'events';

// SDK error types
export type SDKErrorType = 
  | 'initialization'
  | 'execution'
  | 'authentication'
  | 'rate_limit'
  | 'timeout'
  | 'network'
  | 'validation'
  | 'unknown';

// SDK error
export interface SDKError {
  /** Error type */
  type: SDKErrorType;
  /** Error message */
  message: string;
  /** Timestamp */
  timestamp: string;
  /** Operation that caused the error */
  operation?: string;
  /** Original error if wrapped */
  originalError?: Error;
  /** Whether fallback was attempted */
  fallbackAttempted?: boolean;
  /** Whether fallback succeeded */
  fallbackSucceeded?: boolean;
}

// Fallback result
export interface FallbackResult<T = unknown> {
  /** Whether fallback was used */
  usedFallback: boolean;
  /** Result data */
  data: T;
  /** Original method attempted */
  originalMethod: string;
  /** Fallback method used */
  fallbackMethod?: string;
  /** Error from original method */
  originalError?: string;
}

// Error handler config
export interface ErrorHandlerConfig {
  /** Maximum errors to keep in history */
  maxHistorySize?: number;
  /** Enable automatic error logging */
  enableLogging?: boolean;
  /** Callback for error events */
  onError?: (error: SDKError) => void;
}

/**
 * SDK Error Handler
 * 
 * Manages SDK errors and provides fallback coordination.
 */
export class SDKErrorHandler extends EventEmitter {
  private config: Required<ErrorHandlerConfig>;
  private errorHistory: SDKError[] = [];
  private errorCounts: Map<SDKErrorType, number> = new Map();

  constructor(config: ErrorHandlerConfig = {}) {
    super();
    this.config = {
      maxHistorySize: config.maxHistorySize ?? 100,
      enableLogging: config.enableLogging ?? true,
      onError: config.onError ?? (() => {}),
    };
  }

  /**
   * Record an error
   */
  recordError(error: Omit<SDKError, 'timestamp'>): void {
    const fullError: SDKError = {
      ...error,
      timestamp: new Date().toISOString(),
    };

    // Add to history
    this.errorHistory.push(fullError);
    if (this.errorHistory.length > this.config.maxHistorySize) {
      this.errorHistory.shift();
    }

    // Update counts
    const count = this.errorCounts.get(error.type) || 0;
    this.errorCounts.set(error.type, count + 1);

    // Log if enabled
    if (this.config.enableLogging) {
      console.error(`[SDK Error] ${error.type}: ${error.message}`);
    }

    // Call callback
    this.config.onError(fullError);

    // Emit event
    this.emit('error', fullError);
  }

  /**
   * Get error history
   */
  getErrorHistory(limit?: number): SDKError[] {
    if (limit) {
      return this.errorHistory.slice(-limit);
    }
    return [...this.errorHistory];
  }

  /**
   * Get error counts by type
   */
  getErrorCounts(): Record<SDKErrorType, number> {
    const result: Record<SDKErrorType, number> = {
      initialization: 0,
      execution: 0,
      authentication: 0,
      rate_limit: 0,
      timeout: 0,
      network: 0,
      validation: 0,
      unknown: 0,
    };

    for (const [type, count] of this.errorCounts) {
      result[type] = count;
    }

    return result;
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.errorHistory = [];
    this.errorCounts.clear();
    this.emit('cleared');
  }

  /**
   * Check if error should trigger fallback
   */
  shouldFallback(error: SDKError): boolean {
    // These errors should trigger fallback to MCP
    const fallbackTypes: SDKErrorType[] = [
      'execution',
      'timeout',
      'network',
      'rate_limit',
    ];

    return fallbackTypes.includes(error.type);
  }

  /**
   * Create a fallback result
   */
  createFallbackResult<T>(
    data: T,
    originalMethod: string,
    fallbackMethod: string,
    originalError?: string
  ): FallbackResult<T> {
    return {
      usedFallback: true,
      data,
      originalMethod,
      fallbackMethod,
      originalError,
    };
  }

  /**
   * Wrap an operation with fallback support
   */
  async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>,
    operationName: string
  ): Promise<FallbackResult<T>> {
    try {
      const data = await primary();
      return {
        usedFallback: false,
        data,
        originalMethod: operationName,
      };
    } catch (error) {
      const sdkError: SDKError = {
        type: this.classifyError(error),
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        operation: operationName,
        fallbackAttempted: true,
      };

      this.recordError(sdkError);

      try {
        const data = await fallback();
        sdkError.fallbackSucceeded = true;
        return this.createFallbackResult(
          data,
          operationName,
          'mcp',
          sdkError.message
        );
      } catch (fallbackError) {
        sdkError.fallbackSucceeded = false;
        this.recordError({
          type: 'execution',
          message: `Fallback failed: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`,
          operation: `${operationName}:fallback`,
        });
        throw fallbackError;
      }
    }
  }

  /**
   * Classify an error type
   */
  private classifyError(error: unknown): SDKErrorType {
    if (!(error instanceof Error)) {
      return 'unknown';
    }

    const message = error.message.toLowerCase();

    if (message.includes('timeout')) {
      return 'timeout';
    }
    if (message.includes('rate limit') || message.includes('429')) {
      return 'rate_limit';
    }
    if (message.includes('auth') || message.includes('api key') || message.includes('401')) {
      return 'authentication';
    }
    if (message.includes('network') || message.includes('enet') || message.includes('econn')) {
      return 'network';
    }
    if (message.includes('valid') || message.includes('invalid')) {
      return 'validation';
    }

    return 'execution';
  }

  /**
   * Get error summary
   */
  getSummary(): {
    totalErrors: number;
    recentErrors: number;
    topErrorType: SDKErrorType | null;
    fallbackSuccessRate: number;
  } {
    const recentTime = Date.now() - 3600000; // Last hour
    const recentErrors = this.errorHistory.filter(
      e => new Date(e.timestamp).getTime() > recentTime
    ).length;

    let topType: SDKErrorType | null = null;
    let topCount = 0;

    for (const [type, count] of this.errorCounts) {
      if (count > topCount) {
        topCount = count;
        topType = type;
      }
    }

    const fallbackAttempts = this.errorHistory.filter(e => e.fallbackAttempted);
    const fallbackSuccesses = fallbackAttempts.filter(e => e.fallbackSucceeded);
    const fallbackRate = fallbackAttempts.length > 0
      ? fallbackSuccesses.length / fallbackAttempts.length
      : 0;

    return {
      totalErrors: this.errorHistory.length,
      recentErrors,
      topErrorType: topType,
      fallbackSuccessRate: fallbackRate,
    };
  }
}
