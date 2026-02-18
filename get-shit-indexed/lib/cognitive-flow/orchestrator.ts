/**
 * Cognitive Flow Orchestrator
 *
 * Unified orchestration layer that coordinates thinking servers, MCP tools,
 * and claudeception modules for intelligent cognitive operations.
 *
 * Four-Phase Flow:
 * 1. PREPARE: Structure analysis using Tractatus thinking
 * 2. EXECUTE: Step-by-step execution using Sequential thinking
 * 3. REFLECT: Problem analysis using Debug thinking
 * 4. LEARN: Knowledge capture and storage
 *
 * @module cognitive-flow/orchestrator
 */

import {
  CognitivePhase,
  CognitiveContext,
  CognitiveResult,
  CognitiveFlowConfig,
  CognitiveContextBuilder,
  CognitiveEvent,
  CognitiveEventType,
  CognitiveEventHandler,
  PhaseResult,
  ThinkingResult,
  ThinkingThought,
  MCPToolResult,
  DEFAULT_FLOW_CONFIG,
  LearningEntry
} from './types.js';

import { ServerPool } from './server-pool.js';
import { ToolOptimizer, MCPToolCall } from './tool-optimizer.js';

/**
 * Main cognitive orchestrator class.
 */
export class CognitiveOrchestrator {
  private config: CognitiveFlowConfig;
  private serverPool: ServerPool;
  private toolOptimizer: ToolOptimizer;
  private eventHandlers: Map<CognitiveEventType, CognitiveEventHandler[]>;
  private learningBuffer: LearningEntry[];
  private activeFlows: Map<string, CognitiveResult>;

  constructor(config: Partial<CognitiveFlowConfig> = {}) {
    this.config = { ...DEFAULT_FLOW_CONFIG, ...config };
    this.serverPool = new ServerPool(this.config.serverPool);
    this.toolOptimizer = new ToolOptimizer();
    this.eventHandlers = new Map();
    this.learningBuffer = [];
    this.activeFlows = new Map();

    // Start server health checks
    this.serverPool.startHealthChecks();
  }

  /**
   * Execute a cognitive flow.
   */
  async execute(context: CognitiveContext): Promise<CognitiveResult> {
    const startTime = Date.now();
    const flowId = `${context.operation}-${Date.now()}`;

    this.emit('flow:start', { phase: context.phase, data: { flowId, context } });

    const result: CognitiveResult = {
      success: false,
      operation: context.operation,
      phases: new Map(),
      duration: 0,
      totalTokens: 0,
      insights: [],
      learnings: [],
      nextSteps: [],
      errors: [],
      degraded: false,
      timestamp: new Date()
    };

    try {
      // Execute each enabled phase
      for (const phase of this.config.enabledPhases) {
        const phaseTimeout = this.config.phaseTimeouts.get(phase) || 5000;

        this.emit('phase:start', { phase });

        try {
          const phaseResult = await this.executePhaseWithTimeout(
            phase,
            context,
            phaseTimeout
          );

          result.phases.set(phase, phaseResult);

          if (!phaseResult.success) {
            result.degraded = true;
          }

          // Aggregate insights and learnings
          result.insights.push(...phaseResult.insights);
          result.learnings.push(...phaseResult.learnings);

          // Calculate tokens
          for (const toolResult of phaseResult.toolResults) {
            result.totalTokens += toolResult.tokensUsed;
          }

          this.emit('phase:complete', { phase, data: phaseResult });
        } catch (error) {
          result.degraded = true;
          result.errors.push(`Phase ${phase} failed: ${error}`);

          this.emit('phase:error', { phase, error: error as Error });
        }
      }

      result.success = !result.degraded || result.phases.size > 0;

      // Store learning if enabled
      if (this.config.learningEnabled) {
        await this.captureLearning(context, result);
      }

    } catch (error) {
      result.errors.push(`Flow failed: ${error}`);
      this.emit('error', { error: error as Error });
    }

    result.duration = Date.now() - startTime;
    this.activeFlows.set(flowId, result);

    this.emit('flow:complete', { data: result });

    return result;
  }

  /**
   * Execute a single phase with timeout.
   */
  private async executePhaseWithTimeout(
    phase: CognitivePhase,
    context: CognitiveContext,
    timeout: number
  ): Promise<PhaseResult> {
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Phase ${phase} timed out after ${timeout}ms`));
      }, timeout);

      try {
        const result = await this.executePhase(phase, context);
        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Execute a single cognitive phase.
   */
  private async executePhase(
    phase: CognitivePhase,
    context: CognitiveContext
  ): Promise<PhaseResult> {
    const startTime = Date.now();
    const phaseContext: CognitiveContext = {
      ...context,
      phase
    };

    const thinkingResults: ThinkingResult[] = [];
    const toolResults: MCPToolResult[] = [];
    const insights: string[] = [];
    const learnings: string[] = [];

    // Execute thinking for this phase
    const thinkingResult = await this.executeThinking(phase, phaseContext);
    if (thinkingResult) {
      thinkingResults.push(thinkingResult);
      insights.push(...this.extractInsights(thinkingResult));
    }

    // Execute tools for this phase
    const toolsToExecute = this.selectToolsForPhase(phase, phaseContext);
    for (const toolCall of toolsToExecute) {
      const toolResult = await this.executeTool(toolCall);
      toolResults.push(toolResult);
    }

    const duration = Date.now() - startTime;

    return {
      phase,
      thinkingResults,
      toolResults,
      success: thinkingResults.some(r => r.success) || toolResults.some(r => r.success),
      duration,
      insights,
      learnings,
      nextPhase: this.determineNextPhase(phase, thinkingResults)
    };
  }

  /**
   * Execute thinking server for a phase.
   */
  private async executeThinking(
    phase: CognitivePhase,
    context: CognitiveContext
  ): Promise<ThinkingResult | null> {
    const selection = this.serverPool.selectServer(context);

    this.emit('server:select', { server: selection.server, data: selection });

    const startTime = Date.now();

    try {
      this.emit('server:call', { server: selection.server, phase });

      // Simulate thinking execution
      // In real implementation, would call the MCP server
      const thoughts = await this.simulateThinking(selection.server, context);

      const duration = Date.now() - startTime;

      this.serverPool.recordCall(selection.server, duration, true);

      const result: ThinkingResult = {
        server: selection.server,
        phase,
        thoughts,
        duration,
        success: true,
        metadata: { selection }
      };

      this.emit('server:result', { server: selection.server, data: result });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.serverPool.recordCall(selection.server, duration, false);

      return {
        server: selection.server,
        phase,
        thoughts: [],
        duration,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Simulate thinking execution.
   * In production, this would call the actual MCP server.
   */
  private async simulateThinking(
    server: string,
    context: CognitiveContext
  ): Promise<ThinkingThought[]> {
    const thoughts: ThinkingThought[] = [];
    const maxThoughts = this.getMaxThoughtsForPhase(context.phase);

    for (let i = 1; i <= maxThoughts; i++) {
      thoughts.push({
        thoughtNumber: i,
        totalThoughts: maxThoughts,
        thought: `[${server}] Processing ${context.operation} - Step ${i}/${maxThoughts}`,
        nextThoughtNeeded: i < maxThoughts
      });
    }

    return thoughts;
  }

  /**
   * Get max thoughts for a phase.
   */
  private getMaxThoughtsForPhase(phase: CognitivePhase): number {
    switch (phase) {
      case CognitivePhase.PREPARE:
        return 3;
      case CognitivePhase.EXECUTE:
        return 5;
      case CognitivePhase.REFLECT:
        return 4;
      case CognitivePhase.LEARN:
        return 2;
      default:
        return 3;
    }
  }

  /**
   * Select tools for a phase.
   */
  private selectToolsForPhase(phase: CognitivePhase, context: CognitiveContext): MCPToolCall[] {
    const tools: MCPToolCall[] = [];

    switch (phase) {
      case CognitivePhase.PREPARE:
        // Structure analysis tools
        if (context.targetPath) {
          tools.push({
            server: 'code-index-mcp',
            tool: 'get_file_summary',
            params: { file_path: context.targetPath }
          });
        }
        break;

      case CognitivePhase.EXECUTE:
        // Execution tools based on operation
        if (context.targetPath) {
          tools.push({
            server: 'desktop-commander',
            tool: 'read_file',
            params: { path: context.targetPath }
          });
        }
        break;

      case CognitivePhase.REFLECT:
        // Analysis tools
        tools.push({
          server: 'code-index-mcp',
          tool: 'search_code_advanced',
          params: { pattern: context.operation, max_results: 5 }
        });
        break;

      case CognitivePhase.LEARN:
        // Learning capture tools
        // Learning is handled separately
        break;
    }

    return tools;
  }

  /**
   * Execute a tool.
   */
  private async executeTool(call: MCPToolCall): Promise<MCPToolResult> {
    const startTime = Date.now();
    const tokenCost = this.toolOptimizer.estimateTokenCost(
      `${call.server}__${call.tool}`,
      call.params
    );

    this.emit('tool:call', { tool: call.tool, data: call });

    try {
      // Simulate tool execution
      // In production, would call the actual MCP server
      await new Promise(resolve => setTimeout(resolve, 50));

      const duration = Date.now() - startTime;

      const result: MCPToolResult = {
        tool: call.tool,
        server: call.server,
        success: true,
        result: { simulated: true },
        duration,
        tokensUsed: tokenCost
      };

      this.emit('tool:result', { tool: call.tool, data: result });

      this.toolOptimizer.recordCall(call, result);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        tool: call.tool,
        server: call.server,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        tokensUsed: tokenCost
      };
    }
  }

  /**
   * Extract insights from thinking results.
   */
  private extractInsights(result: ThinkingResult): string[] {
    const insights: string[] = [];

    for (const thought of result.thoughts) {
      // Extract key insights from thoughts
      if (thought.thought.includes('pattern')) {
        insights.push(`Pattern detected: ${thought.thought.slice(0, 100)}`);
      }
      if (thought.thought.includes('recommendation')) {
        insights.push(`Recommendation: ${thought.thought.slice(0, 100)}`);
      }
    }

    return insights;
  }

  /**
   * Determine next phase based on results.
   */
  private determineNextPhase(
    currentPhase: CognitivePhase,
    results: ThinkingResult[]
  ): CognitivePhase | undefined {
    const phases = this.config.enabledPhases;
    const currentIndex = phases.indexOf(currentPhase);

    if (currentIndex < phases.length - 1) {
      return phases[currentIndex + 1];
    }

    return undefined;
  }

  /**
   * Capture learning from the flow.
   */
  private async captureLearning(context: CognitiveContext, result: CognitiveResult): Promise<void> {
    const entry: LearningEntry = {
      id: `learning-${Date.now()}`,
      timestamp: new Date(),
      operation: context.operation,
      phase: context.phase,
      context,
      outcome: result.success ? 'success' : result.degraded ? 'partial' : 'failure',
      insights: result.insights,
      patterns: this.extractPatterns(result),
      effectiveness: this.calculateEffectiveness(result),
      serversUsed: Array.from(result.phases.values())
        .flatMap(p => p.thinkingResults.map(r => r.server)),
      toolsUsed: Array.from(result.phases.values())
        .flatMap(p => p.toolResults.map(r => `${r.server}__${r.tool}`)),
      duration: result.duration
    };

    this.learningBuffer.push(entry);

    // Store in debug-thinking graph if available
    this.emit('learning:capture', { data: entry });

    // Flush buffer periodically
    if (this.learningBuffer.length >= 10) {
      await this.flushLearningBuffer();
    }
  }

  /**
   * Extract patterns from result.
   */
  private extractPatterns(result: CognitiveResult): string[] {
    const patterns: string[] = [];

    // Pattern: Successful phase combinations
    const successfulPhases = Array.from(result.phases.entries())
      .filter(([_, p]) => p.success)
      .map(([phase]) => phase);

    if (successfulPhases.length > 1) {
      patterns.push(`Phase pattern: ${successfulPhases.join(' -> ')}`);
    }

    // Pattern: Tool usage patterns
    const tools = Array.from(result.phases.values())
      .flatMap(p => p.toolResults.filter(r => r.success).map(r => r.tool));

    if (tools.length > 0) {
      patterns.push(`Tool pattern: ${[...new Set(tools)].join(', ')}`);
    }

    return patterns;
  }

  /**
   * Calculate effectiveness score.
   */
  private calculateEffectiveness(result: CognitiveResult): number {
    let score = 0;

    // Success factor
    if (result.success) score += 50;
    else if (result.degraded) score += 25;

    // Phase completion factor
    const phaseCount = result.phases.size;
    const enabledCount = this.config.enabledPhases.length;
    score += (phaseCount / enabledCount) * 30;

    // Insights factor
    score += Math.min(result.insights.length * 5, 20);

    return Math.min(100, score);
  }

  /**
   * Flush learning buffer to storage.
   */
  private async flushLearningBuffer(): Promise<void> {
    if (this.learningBuffer.length === 0) return;

    // In production, would persist to debug-thinking graph
    // For now, clear buffer
    this.learningBuffer = [];
  }

  /**
   * Register an event handler.
   */
  on(eventType: CognitiveEventType, handler: CognitiveEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  /**
   * Emit an event.
   */
  private emit(type: CognitiveEventType, event: Partial<CognitiveEvent>): void {
    const handlers = this.eventHandlers.get(type) || [];

    const fullEvent: CognitiveEvent = {
      type,
      timestamp: new Date(),
      ...event
    };

    for (const handler of handlers) {
      try {
        handler(fullEvent);
      } catch (error) {
        // Ignore handler errors
      }
    }
  }

  /**
   * Get orchestrator status.
   */
  getStatus(): {
    serverPool: ReturnType<ServerPool['getStats']>;
    toolOptimizer: ReturnType<ToolOptimizer['getStats']>;
    activeFlows: number;
    learningBufferSize: number;
    config: CognitiveFlowConfig;
  } {
    return {
      serverPool: this.serverPool.getStats(),
      toolOptimizer: this.toolOptimizer.getStats(),
      activeFlows: this.activeFlows.size,
      learningBufferSize: this.learningBuffer.length,
      config: this.config
    };
  }

  /**
   * Update configuration.
   */
  updateConfig(config: Partial<CognitiveFlowConfig>): void {
    this.config = { ...this.config, ...config };

    // Update server pool config if provided
    if (config.serverPool) {
      this.serverPool = new ServerPool(this.config.serverPool);
    }
  }

  /**
   * Create a context builder.
   */
  static context(operation: string): CognitiveContextBuilder {
    return new CognitiveContextBuilder(operation);
  }

  /**
   * Quick execute with minimal setup.
   */
  async quickExecute(
    operation: string,
    input: any,
    options: {
      targetPath?: string;
      command?: string;
      timeout?: number;
    } = {}
  ): Promise<CognitiveResult> {
    const context = CognitiveOrchestrator.context(operation)
      .withInput(input)
      .withTargetPath(options.targetPath || '')
      .withCommand(options.command || '')
      .withTimeout(options.timeout || 10000)
      .build();

    return this.execute(context);
  }

  /**
   * Shutdown the orchestrator.
   */
  shutdown(): void {
    this.serverPool.stopHealthChecks();
    this.activeFlows.clear();
    this.learningBuffer = [];
    this.eventHandlers.clear();
  }
}

// Export singleton instance
let defaultOrchestrator: CognitiveOrchestrator | null = null;

/**
 * Get the default orchestrator instance.
 */
export function getOrchestrator(config?: Partial<CognitiveFlowConfig>): CognitiveOrchestrator {
  if (!defaultOrchestrator) {
    defaultOrchestrator = new CognitiveOrchestrator(config);
  }
  return defaultOrchestrator;
}

/**
 * Execute a cognitive flow using the default orchestrator.
 */
export async function executeCognitiveFlow(
  context: CognitiveContext
): Promise<CognitiveResult> {
  return getOrchestrator().execute(context);
}

export default CognitiveOrchestrator;
