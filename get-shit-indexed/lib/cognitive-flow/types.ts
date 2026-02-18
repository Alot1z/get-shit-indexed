/**
 * Cognitive-Flow Orchestration Layer Types
 *
 * Unified types for coordinating thinking servers, MCP tools, and claudeception modules.
 *
 * @module cognitive-flow/types
 */

// ─── Cognitive Phases ─────────────────────────────────────────────────────────

/**
 * The four cognitive phases in the unified flow.
 *
 * PREPARE: Structure analysis using Tractatus thinking
 * EXECUTE: Step-by-step execution using Sequential thinking
 * REFLECT: Problem analysis using Debug thinking
 * LEARN: Knowledge capture and storage
 */
export enum CognitivePhase {
  PREPARE = 'PREPARE',
  EXECUTE = 'EXECUTE',
  REFLECT = 'REFLECT',
  LEARN = 'LEARN'
}

// ─── Thinking Server Types ─────────────────────────────────────────────────────

/**
 * Available thinking servers.
 */
export type ThinkingServer = 'sequential' | 'tractatus' | 'debug';

/**
 * Server health status.
 */
export interface ServerHealth {
  server: ThinkingServer;
  available: boolean;
  latency: number;
  lastCheck: Date;
  errorCount: number;
  lastError?: string;
}

/**
 * Server pool configuration.
 */
export interface ServerPoolConfig {
  healthCheckInterval: number;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  fallbackChain: ThinkingServer[];
}

/**
 * Server selection result.
 */
export interface ServerSelection {
  server: ThinkingServer;
  reason: string;
  alternatives: ThinkingServer[];
  confidence: number;
}

// ─── MCP Tool Types ───────────────────────────────────────────────────────────

/**
 * MCP tool categories.
 */
export type MCPToolCategory =
  | 'file-operations'
  | 'code-search'
  | 'process-management'
  | 'thinking'
  | 'documentation'
  | 'web-access';

/**
 * MCP tool metadata for optimization.
 */
export interface MCPToolInfo {
  name: string;
  category: MCPToolCategory;
  tokenCost: number;
  avgLatency: number;
  capabilities: string[];
  dependencies: string[];
}

/**
 * Tool selection matrix entry.
 */
export interface ToolSelectionEntry {
  operation: string;
  preferredTool: string;
  alternatives: string[];
  tokenSavings: number;
  priority: number;
}

/**
 * Batch optimization result.
 */
export interface BatchOptimization {
  batches: MCPToolCall[][];
  estimatedTokenSavings: number;
  parallelizable: boolean;
  dependencies: Map<string, string[]>;
}

/**
 * MCP tool call specification.
 */
export interface MCPToolCall {
  server: string;
  tool: string;
  params: Record<string, any>;
  dependencies?: string[];
}

// ─── Cognitive Context ────────────────────────────────────────────────────────

/**
 * Context for cognitive flow execution.
 */
export interface CognitiveContext {
  /** Operation being performed */
  operation: string;

  /** Phase being executed */
  phase: CognitivePhase;

  /** Input data for the operation */
  input: any;

  /** User-provided context */
  userContext?: Record<string, any>;

  /** Current file or path being worked on */
  targetPath?: string;

  /** Command being executed (if applicable) */
  command?: string;

  /** Agent type (if applicable) */
  agentType?: string;

  /** Timeout for the operation */
  timeout?: number;

  /** Whether to use BMAD enhancement */
  bmadEnabled?: boolean;

  /** Metadata for the operation */
  metadata?: Record<string, any>;
}

/**
 * Cognitive context builder for fluent API.
 */
export class CognitiveContextBuilder {
  private context: CognitiveContext;

  constructor(operation: string) {
    this.context = {
      operation,
      phase: CognitivePhase.PREPARE,
      input: null
    };
  }

  withPhase(phase: CognitivePhase): this {
    this.context.phase = phase;
    return this;
  }

  withInput(input: any): this {
    this.context.input = input;
    return this;
  }

  withUserContext(ctx: Record<string, any>): this {
    this.context.userContext = ctx;
    return this;
  }

  withTargetPath(path: string): this {
    this.context.targetPath = path;
    return this;
  }

  withCommand(command: string): this {
    this.context.command = command;
    return this;
  }

  withAgentType(agentType: string): this {
    this.context.agentType = agentType;
    return this;
  }

  withTimeout(timeout: number): this {
    this.context.timeout = timeout;
    return this;
  }

  withBMAD(enabled: boolean): this {
    this.context.bmadEnabled = enabled;
    return this;
  }

  withMetadata(metadata: Record<string, any>): this {
    this.context.metadata = metadata;
    return this;
  }

  build(): CognitiveContext {
    return { ...this.context };
  }
}

// ─── Cognitive Result ─────────────────────────────────────────────────────────

/**
 * Result from a thinking server.
 */
export interface ThinkingResult {
  server: ThinkingServer;
  phase: CognitivePhase;
  thoughts: ThinkingThought[];
  duration: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Single thought from a thinking server.
 */
export interface ThinkingThought {
  thoughtNumber: number;
  totalThoughts: number;
  thought: string;
  nextThoughtNeeded: boolean;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
}

/**
 * Result from MCP tool execution.
 */
export interface MCPToolResult {
  tool: string;
  server: string;
  success: boolean;
  result?: any;
  error?: string;
  duration: number;
  tokensUsed: number;
}

/**
 * Phase execution result.
 */
export interface PhaseResult {
  phase: CognitivePhase;
  thinkingResults: ThinkingResult[];
  toolResults: MCPToolResult[];
  success: boolean;
  duration: number;
  insights: string[];
  learnings: string[];
  nextPhase?: CognitivePhase;
  error?: string;
}

/**
 * Complete cognitive flow result.
 */
export interface CognitiveResult {
  /** Whether the flow completed successfully */
  success: boolean;

  /** The operation that was performed */
  operation: string;

  /** Results from each phase */
  phases: Map<CognitivePhase, PhaseResult>;

  /** Overall duration in milliseconds */
  duration: number;

  /** Total tokens used */
  totalTokens: number;

  /** Aggregated insights from all phases */
  insights: string[];

  /** Learnings to store */
  learnings: string[];

  /** Recommended next steps */
  nextSteps: string[];

  /** Any errors that occurred */
  errors: string[];

  /** Whether any phase was degraded */
  degraded: boolean;

  /** Final output of the operation */
  output?: any;

  /** Timestamp of completion */
  timestamp: Date;
}

// ─── Learning Types ───────────────────────────────────────────────────────────

/**
 * Learning entry for storage.
 */
export interface LearningEntry {
  id: string;
  timestamp: Date;
  operation: string;
  phase: CognitivePhase;
  context: CognitiveContext;
  outcome: 'success' | 'failure' | 'partial';
  insights: string[];
  patterns: string[];
  effectiveness: number;
  serversUsed: ThinkingServer[];
  toolsUsed: string[];
  duration: number;
}

/**
 * Pattern for learning.
 */
export interface CognitivePattern {
  id: string;
  name: string;
  description: string;
  trigger: PatternTrigger;
  action: PatternAction;
  effectiveness: number;
  uses: number;
  lastUsed: Date;
}

/**
 * Pattern trigger conditions.
 */
export interface PatternTrigger {
  operationType?: string[];
  complexity?: { min: number; max: number };
  fileType?: string[];
  commandPattern?: string;
}

/**
 * Pattern action specification.
 */
export interface PatternAction {
  preferredServer?: ThinkingServer;
  preferredTools?: string[];
  suggestedPhase?: CognitivePhase;
  timeout?: number;
  bmadEnabled?: boolean;
}

// ─── Flow Configuration ───────────────────────────────────────────────────────

/**
 * Configuration for cognitive flow execution.
 */
export interface CognitiveFlowConfig {
  /** Enable/disable phases */
  enabledPhases: CognitivePhase[];

  /** Phase timeouts in milliseconds */
  phaseTimeouts: Map<CognitivePhase, number>;

  /** Server pool configuration */
  serverPool: ServerPoolConfig;

  /** Enable learning capture */
  learningEnabled: boolean;

  /** Enable parallel tool execution */
  parallelTools: boolean;

  /** Maximum parallel tools */
  maxParallelTools: number;

  /** Token budget for the flow */
  tokenBudget: number;

  /** Enable BMAD enhancement */
  bmadEnhancement: boolean;

  /** Verbose logging */
  verbose: boolean;
}

/**
 * Default flow configuration.
 */
export const DEFAULT_FLOW_CONFIG: CognitiveFlowConfig = {
  enabledPhases: [
    CognitivePhase.PREPARE,
    CognitivePhase.EXECUTE,
    CognitivePhase.REFLECT,
    CognitivePhase.LEARN
  ],
  phaseTimeouts: new Map([
    [CognitivePhase.PREPARE, 5000],
    [CognitivePhase.EXECUTE, 15000],
    [CognitivePhase.REFLECT, 5000],
    [CognitivePhase.LEARN, 3000]
  ]),
  serverPool: {
    healthCheckInterval: 30000,
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 10000,
    fallbackChain: ['sequential', 'tractatus', 'debug']
  },
  learningEnabled: true,
  parallelTools: true,
  maxParallelTools: 5,
  tokenBudget: 50000,
  bmadEnhancement: true,
  verbose: false
};

// ─── Event Types ──────────────────────────────────────────────────────────────

/**
 * Events emitted during cognitive flow.
 */
export type CognitiveEventType =
  | 'flow:start'
  | 'flow:complete'
  | 'phase:start'
  | 'phase:complete'
  | 'phase:error'
  | 'server:select'
  | 'server:call'
  | 'server:result'
  | 'tool:select'
  | 'tool:call'
  | 'tool:result'
  | 'learning:capture'
  | 'error';

/**
 * Cognitive event payload.
 */
export interface CognitiveEvent {
  type: CognitiveEventType;
  timestamp: Date;
  phase?: CognitivePhase;
  server?: ThinkingServer;
  tool?: string;
  data?: any;
  error?: Error;
}

/**
 * Event handler type.
 */
export type CognitiveEventHandler = (event: CognitiveEvent) => void | Promise<void>;
