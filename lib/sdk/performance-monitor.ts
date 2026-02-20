/**
 * Performance Monitor
 * 
 * Tracks SDK call latency and compares with MCP performance.
 * 
 * @module gsi/sdk/performance-monitor
 */

import { EventEmitter } from 'events';

// Operation timing record
export interface OperationTiming {
  /** Operation name */
  operation: string;
  /** Method used (sdk or mcp) */
  method: 'sdk' | 'mcp';
  /** Duration in milliseconds */
  duration: number;
  /** Whether operation succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Timestamp */
  timestamp: string;
  /** Token usage if available */
  tokens?: {
    input: number;
    output: number;
  };
}

// Performance metrics
export interface PerformanceMetrics {
  /** Total operations recorded */
  totalOperations: number;
  /** SDK operations count */
  sdkOperations: number;
  /** MCP operations count */
  mcpOperations: number;
  /** Average SDK duration (ms) */
  avgSdkDuration: number;
  /** Average MCP duration (ms) */
  avgMcpDuration: number;
  /** SDK success rate */
  sdkSuccessRate: number;
  /** MCP success rate */
  mcpSuccessRate: number;
  /** Performance comparison (SDK vs MCP) */
  comparison: {
    faster: 'sdk' | 'mcp' | 'equal';
    percentDifference: number;
  };
  /** Operations by type */
  operationsByType: Record<string, {
    count: number;
    avgDuration: number;
    successRate: number;
  }>;
  /** Recent operations (last 100) */
  recentOperations: OperationTiming[];
}

// Monitor config
export interface MonitorConfig {
  /** Maximum operations to keep */
  maxOperations?: number;
  /** Enable detailed logging */
  enableLogging?: boolean;
  /** Sample rate for recording (1 = 100%) */
  sampleRate?: number;
}

/**
 * Performance Monitor
 * 
 * Tracks and analyzes SDK vs MCP performance.
 */
export class PerformanceMonitor extends EventEmitter {
  private config: Required<MonitorConfig>;
  private operations: OperationTiming[] = [];
  private startTime: number;

  constructor(config: MonitorConfig = {}) {
    super();
    this.config = {
      maxOperations: config.maxOperations ?? 1000,
      enableLogging: config.enableLogging ?? false,
      sampleRate: config.sampleRate ?? 1,
    };
    this.startTime = Date.now();
  }

  /**
   * Record an operation timing
   */
  recordTiming(timing: Omit<OperationTiming, 'timestamp'>): void {
    // Apply sample rate
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    const fullTiming: OperationTiming = {
      ...timing,
      timestamp: new Date().toISOString(),
    };

    this.operations.push(fullTiming);

    // Trim if over limit
    if (this.operations.length > this.config.maxOperations) {
      this.operations.shift();
    }

    // Log if enabled
    if (this.config.enableLogging) {
      console.log(
        `[Perf] ${timing.operation} via ${timing.method}: ${timing.duration}ms (${timing.success ? 'success' : 'failed'})`
      );
    }

    this.emit('operation', fullTiming);
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    const sdkOps = this.operations.filter(o => o.method === 'sdk');
    const mcpOps = this.operations.filter(o => o.method === 'mcp');

    const avgSdkDuration = this.calculateAverage(sdkOps.map(o => o.duration));
    const avgMcpDuration = this.calculateAverage(mcpOps.map(o => o.duration));

    const sdkSuccessRate = this.calculateSuccessRate(sdkOps);
    const mcpSuccessRate = this.calculateSuccessRate(mcpOps);

    // Calculate comparison
    let faster: 'sdk' | 'mcp' | 'equal' = 'equal';
    let percentDifference = 0;

    if (avgSdkDuration > 0 && avgMcpDuration > 0) {
      if (avgSdkDuration < avgMcpDuration) {
        faster = 'sdk';
        percentDifference = ((avgMcpDuration - avgSdkDuration) / avgMcpDuration) * 100;
      } else if (avgMcpDuration < avgSdkDuration) {
        faster = 'mcp';
        percentDifference = ((avgSdkDuration - avgMcpDuration) / avgSdkDuration) * 100;
      }
    }

    // Group by operation type
    const operationsByType: Record<string, {
      count: number;
      avgDuration: number;
      successRate: number;
    }> = {};

    const typeGroups = this.groupBy(this.operations, 'operation');
    for (const [type, ops] of Object.entries(typeGroups)) {
      operationsByType[type] = {
        count: ops.length,
        avgDuration: this.calculateAverage(ops.map(o => o.duration)),
        successRate: this.calculateSuccessRate(ops),
      };
    }

    return {
      totalOperations: this.operations.length,
      sdkOperations: sdkOps.length,
      mcpOperations: mcpOps.length,
      avgSdkDuration,
      avgMcpDuration,
      sdkSuccessRate,
      mcpSuccessRate,
      comparison: {
        faster,
        percentDifference: Math.round(percentDifference * 10) / 10,
      },
      operationsByType,
      recentOperations: this.operations.slice(-100),
    };
  }

  /**
   * Get metrics for a specific operation
   */
  getOperationMetrics(operation: string): {
    count: number;
    avgDuration: number;
    sdkCount: number;
    mcpCount: number;
    sdkAvgDuration: number;
    mcpAvgDuration: number;
    successRate: number;
  } {
    const ops = this.operations.filter(o => o.operation === operation);
    const sdkOps = ops.filter(o => o.method === 'sdk');
    const mcpOps = ops.filter(o => o.method === 'mcp');

    return {
      count: ops.length,
      avgDuration: this.calculateAverage(ops.map(o => o.duration)),
      sdkCount: sdkOps.length,
      mcpCount: mcpOps.length,
      sdkAvgDuration: this.calculateAverage(sdkOps.map(o => o.duration)),
      mcpAvgDuration: this.calculateAverage(mcpOps.map(o => o.duration)),
      successRate: this.calculateSuccessRate(ops),
    };
  }

  /**
   * Get performance comparison summary
   */
  getComparison(): {
    sdk: { avgDuration: number; successRate: number; count: number };
    mcp: { avgDuration: number; successRate: number; count: number };
    recommendation: 'prefer_sdk' | 'prefer_mcp' | 'no_preference';
    tokenSavings: number; // Estimated percentage
  } {
    const metrics = this.getMetrics();

    // Determine recommendation based on performance and reliability
    let recommendation: 'prefer_sdk' | 'prefer_mcp' | 'no_preference' = 'no_preference';

    if (metrics.sdkOperations > 10 && metrics.mcpOperations > 10) {
      // Both have enough data for comparison
      const sdkBetter = metrics.avgSdkDuration < metrics.avgMcpDuration;
      const sdkReliable = metrics.sdkSuccessRate >= metrics.mcpSuccessRate - 0.1;

      if (sdkBetter && sdkReliable) {
        recommendation = 'prefer_sdk';
      } else if (!sdkBetter && metrics.mcpSuccessRate > metrics.sdkSuccessRate) {
        recommendation = 'prefer_mcp';
      }
    }

    // Estimate token savings (SDK typically saves 80-90% vs native tools)
    // MCP saves about 50-70% vs native, SDK is additional 50% over MCP
    const tokenSavings = recommendation === 'prefer_sdk' ? 80 : 
                         recommendation === 'prefer_mcp' ? 50 : 0;

    return {
      sdk: {
        avgDuration: metrics.avgSdkDuration,
        successRate: metrics.sdkSuccessRate,
        count: metrics.sdkOperations,
      },
      mcp: {
        avgDuration: metrics.avgMcpDuration,
        successRate: metrics.mcpSuccessRate,
        count: metrics.mcpOperations,
      },
      recommendation,
      tokenSavings,
    };
  }

  /**
   * Get uptime
   */
  getUptime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.operations = [];
    this.startTime = Date.now();
    this.emit('reset');
  }

  /**
   * Calculate average
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Calculate success rate
   */
  private calculateSuccessRate(operations: OperationTiming[]): number {
    if (operations.length === 0) return 0;
    const successes = operations.filter(o => o.success).length;
    return successes / operations.length;
  }

  /**
   * Group array by key
   */
  private groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  /**
   * Export metrics as JSON
   */
  exportJson(): string {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      uptime: this.getUptime(),
      metrics: this.getMetrics(),
    }, null, 2);
  }

  /**
   * Get slow operations (above threshold)
   */
  getSlowOperations(thresholdMs: number = 5000): OperationTiming[] {
    return this.operations.filter(o => o.duration > thresholdMs);
  }

  /**
   * Get failed operations
   */
  getFailedOperations(): OperationTiming[] {
    return this.operations.filter(o => !o.success);
  }
}
