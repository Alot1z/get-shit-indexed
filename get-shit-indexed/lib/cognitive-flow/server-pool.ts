/**
 * Thinking Server Pool Management
 *
 * Manages health checking, load balancing, and fallback chains for thinking servers.
 *
 * @module cognitive-flow/server-pool
 */

import {
  ThinkingServer,
  ServerHealth,
  ServerPoolConfig,
  ServerSelection,
  CognitiveContext,
  CognitivePhase
} from './types.js';

/**
 * Default server pool configuration.
 */
const DEFAULT_POOL_CONFIG: ServerPoolConfig = {
  healthCheckInterval: 30000,
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
  fallbackChain: ['sequential', 'tractatus', 'debug']
};

/**
 * Server endpoint mapping.
 */
const SERVER_ENDPOINTS: Record<ThinkingServer, string> = {
  sequential: 'mcp__sequential-thinking__sequentialthinking',
  tractatus: 'mcp__tractatusthinking__tractatus_thinking',
  debug: 'mcp__debug-thinking__debug_thinking'
};

/**
 * Server capabilities mapping.
 */
const SERVER_CAPABILITIES: Record<ThinkingServer, string[]> = {
  sequential: [
    'step-planning',
    'execution-order',
    'task-decomposition',
    'process-sequencing',
    'dependency-ordering'
  ],
  tractatus: [
    'structural-analysis',
    'logical-dependencies',
    'concept-decomposition',
    'architecture-analysis',
    'relationship-mapping'
  ],
  debug: [
    'problem-detection',
    'hypothesis-generation',
    'root-cause-analysis',
    'solution-verification',
    'error-investigation'
  ]
};

/**
 * Phase-to-server affinity mapping.
 */
const PHASE_SERVER_AFFINITY: Record<CognitivePhase, ThinkingServer[]> = {
  [CognitivePhase.PREPARE]: ['tractatus', 'sequential'],
  [CognitivePhase.EXECUTE]: ['sequential', 'tractatus'],
  [CognitivePhase.REFLECT]: ['debug', 'tractatus'],
  [CognitivePhase.LEARN]: ['debug', 'sequential']
};

/**
 * Manages a pool of thinking servers with health checking and load balancing.
 */
export class ServerPool {
  private config: ServerPoolConfig;
  private healthStatus: Map<ThinkingServer, ServerHealth>;
  private healthCheckTimer?: ReturnType<typeof setInterval>;
  private callCount: Map<ThinkingServer, number>;
  private totalLatency: Map<ThinkingServer, number>;

  constructor(config: Partial<ServerPoolConfig> = {}) {
    this.config = { ...DEFAULT_POOL_CONFIG, ...config };
    this.healthStatus = new Map();
    this.callCount = new Map();
    this.totalLatency = new Map();

    // Initialize health status for all servers
    for (const server of ['sequential', 'tractatus', 'debug'] as ThinkingServer[]) {
      this.healthStatus.set(server, {
        server,
        available: true,
        latency: 0,
        lastCheck: new Date(),
        errorCount: 0
      });
      this.callCount.set(server, 0);
      this.totalLatency.set(server, 0);
    }
  }

  /**
   * Start health checking.
   */
  startHealthChecks(): void {
    if (this.healthCheckTimer) {
      return;
    }

    // Run initial health check
    this.checkAllHealth();

    // Schedule periodic health checks
    this.healthCheckTimer = setInterval(
      () => this.checkAllHealth(),
      this.config.healthCheckInterval
    );
  }

  /**
   * Stop health checking.
   */
  stopHealthChecks(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = undefined;
    }
  }

  /**
   * Check health of all servers.
   */
  private async checkAllHealth(): Promise<void> {
    for (const server of ['sequential', 'tractatus', 'debug'] as ThinkingServer[]) {
      await this.checkServerHealth(server);
    }
  }

  /**
   * Check health of a specific server.
   */
  private async checkServerHealth(server: ThinkingServer): Promise<ServerHealth> {
    const startTime = Date.now();
    const health = this.healthStatus.get(server)!;

    try {
      // Simulate health check - in real implementation, would ping the MCP server
      // For now, assume server is available
      const latency = Date.now() - startTime;

      health.available = true;
      health.latency = latency;
      health.lastCheck = new Date();

      // Decay error count on successful check
      if (health.errorCount > 0) {
        health.errorCount = Math.max(0, health.errorCount - 1);
      }
    } catch (error) {
      health.available = false;
      health.latency = 0;
      health.lastCheck = new Date();
      health.errorCount++;
      health.lastError = error instanceof Error ? error.message : 'Unknown error';
    }

    this.healthStatus.set(server, health);
    return health;
  }

  /**
   * Get health status of a server.
   */
  getHealth(server: ThinkingServer): ServerHealth {
    return this.healthStatus.get(server)!;
  }

  /**
   * Get all server health statuses.
   */
  getAllHealth(): Map<ThinkingServer, ServerHealth> {
    return new Map(this.healthStatus);
  }

  /**
   * Select the best server for a given context.
   */
  selectServer(context: CognitiveContext): ServerSelection {
    const { phase, operation } = context;

    // Get phase-affinity servers
    const preferredServers = PHASE_SERVER_AFFINITY[phase] || this.config.fallbackChain;

    // Filter by availability and health
    const availableServers = preferredServers.filter(s => {
      const health = this.healthStatus.get(s);
      return health && health.available && health.errorCount < 3;
    });

    if (availableServers.length === 0) {
      // All servers degraded, use first in fallback chain
      return {
        server: this.config.fallbackChain[0],
        reason: 'All servers degraded, using primary fallback',
        alternatives: this.config.fallbackChain.slice(1),
        confidence: 0.3
      };
    }

    // Score each available server
    const scores = availableServers.map(server => ({
      server,
      score: this.scoreServer(server, context)
    }));

    // Sort by score (highest first)
    scores.sort((a, b) => b.score - a.score);

    const selected = scores[0];
    const alternatives = scores.slice(1).map(s => s.server);

    return {
      server: selected.server,
      reason: `Best match for ${phase} phase with score ${selected.score.toFixed(2)}`,
      alternatives,
      confidence: Math.min(0.5 + (selected.score / 100), 0.95)
    };
  }

  /**
   * Score a server for a given context.
   */
  private scoreServer(server: ThinkingServer, context: CognitiveContext): number {
    let score = 50; // Base score

    const health = this.healthStatus.get(server)!;

    // Health factor (0-20 points)
    if (health.available) {
      score += 20;
    }
    score -= health.errorCount * 5;

    // Latency factor (0-15 points)
    if (health.latency < 100) {
      score += 15;
    } else if (health.latency < 500) {
      score += 10;
    } else if (health.latency < 1000) {
      score += 5;
    }

    // Capability matching (0-15 points)
    const capabilities = SERVER_CAPABILITIES[server];
    const operationLower = context.operation.toLowerCase();

    for (const cap of capabilities) {
      if (operationLower.includes(cap.replace('-', ''))) {
        score += 3;
      }
    }

    // Phase affinity (0-10 points)
    const phaseServers = PHASE_SERVER_AFFINITY[context.phase];
    const phaseIndex = phaseServers.indexOf(server);
    if (phaseIndex === 0) {
      score += 10;
    } else if (phaseIndex === 1) {
      score += 5;
    }

    // Load balancing (-10 to 0 points)
    const callCount = this.callCount.get(server) || 0;
    const avgCount = this.getAverageCallCount();
    if (callCount > avgCount * 1.5) {
      score -= 10;
    } else if (callCount > avgCount) {
      score -= 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get average call count across all servers.
   */
  private getAverageCallCount(): number {
    const counts = Array.from(this.callCount.values());
    return counts.reduce((a, b) => a + b, 0) / counts.length;
  }

  /**
   * Record a server call.
   */
  recordCall(server: ThinkingServer, latency: number, success: boolean): void {
    // Update call count
    const count = this.callCount.get(server) || 0;
    this.callCount.set(server, count + 1);

    // Update total latency
    const total = this.totalLatency.get(server) || 0;
    this.totalLatency.set(server, total + latency);

    // Update health if failed
    if (!success) {
      const health = this.healthStatus.get(server)!;
      health.errorCount++;
      health.lastError = 'Call failed';
      this.healthStatus.set(server, health);
    }
  }

  /**
   * Get server endpoint.
   */
  getEndpoint(server: ThinkingServer): string {
    return SERVER_ENDPOINTS[server];
  }

  /**
   * Get server capabilities.
   */
  getCapabilities(server: ThinkingServer): string[] {
    return [...SERVER_CAPABILITIES[server]];
  }

  /**
   * Check if a server supports a capability.
   */
  supportsCapability(server: ThinkingServer, capability: string): boolean {
    return SERVER_CAPABILITIES[server].includes(capability);
  }

  /**
   * Get servers that support a capability.
   */
  getServersByCapability(capability: string): ThinkingServer[] {
    const servers: ThinkingServer[] = [];

    for (const [server, capabilities] of Object.entries(SERVER_CAPABILITIES)) {
      if (capabilities.includes(capability)) {
        servers.push(server as ThinkingServer);
      }
    }

    return servers;
  }

  /**
   * Get fallback chain for a server.
   */
  getFallbackChain(server: ThinkingServer): ThinkingServer[] {
    const chain = [server];

    for (const fallback of this.config.fallbackChain) {
      if (!chain.includes(fallback)) {
        chain.push(fallback);
      }
    }

    return chain;
  }

  /**
   * Get pool statistics.
   */
  getStats(): {
    totalCalls: number;
    avgLatency: number;
    serverStats: Map<ThinkingServer, {
      calls: number;
      avgLatency: number;
      errors: number;
      availability: number;
    }>;
  } {
    const serverStats = new Map<ThinkingServer, {
      calls: number;
      avgLatency: number;
      errors: number;
      availability: number;
    }>();

    let totalCalls = 0;
    let totalLatencySum = 0;

    for (const server of ['sequential', 'tractatus', 'debug'] as ThinkingServer[]) {
      const calls = this.callCount.get(server) || 0;
      const latency = this.totalLatency.get(server) || 0;
      const health = this.healthStatus.get(server)!;

      totalCalls += calls;
      totalLatencySum += latency;

      serverStats.set(server, {
        calls,
        avgLatency: calls > 0 ? latency / calls : 0,
        errors: health.errorCount,
        availability: health.available ? 100 : 0
      });
    }

    return {
      totalCalls,
      avgLatency: totalCalls > 0 ? totalLatencySum / totalCalls : 0,
      serverStats
    };
  }

  /**
   * Reset statistics.
   */
  resetStats(): void {
    for (const server of ['sequential', 'tractatus', 'debug'] as ThinkingServer[]) {
      this.callCount.set(server, 0);
      this.totalLatency.set(server, 0);
    }
  }

  /**
   * Mark a server as degraded.
   */
  markDegraded(server: ThinkingServer, reason: string): void {
    const health = this.healthStatus.get(server)!;
    health.available = false;
    health.lastError = reason;
    health.errorCount++;
    this.healthStatus.set(server, health);
  }

  /**
   * Mark a server as recovered.
   */
  markRecovered(server: ThinkingServer): void {
    const health = this.healthStatus.get(server)!;
    health.available = true;
    health.lastCheck = new Date();
    this.healthStatus.set(server, health);
  }
}

export default ServerPool;
