/**
 * Cognitive-Flow Orchestration Layer
 *
 * Unified orchestration for thinking servers, MCP tools, and claudeception modules.
 *
 * ## Quick Start
 *
 * ```typescript
 * import { CognitiveOrchestrator, CognitivePhase } from 'cognitive-flow';
 *
 * const orchestrator = new CognitiveOrchestrator();
 *
 * const context = CognitiveOrchestrator.context('analyze-code')
 *   .withPhase(CognitivePhase.PREPARE)
 *   .withTargetPath('/path/to/file.ts')
 *   .build();
 *
 * const result = await orchestrator.execute(context);
 * ```
 *
 * ## Four-Phase Flow
 *
 * 1. **PREPARE**: Structure analysis using Tractatus thinking
 * 2. **EXECUTE**: Step-by-step execution using Sequential thinking
 * 3. **REFLECT**: Problem analysis using Debug thinking
 * 4. **LEARN**: Knowledge capture and storage
 *
 * @module cognitive-flow
 */

// Types
export {
  // Phases
  CognitivePhase,

  // Context
  CognitiveContext,
  CognitiveContextBuilder,

  // Results
  CognitiveResult,
  PhaseResult,
  ThinkingResult,
  ThinkingThought,
  MCPToolResult,

  // Server Types
  ThinkingServer,
  ServerHealth,
  ServerPoolConfig,
  ServerSelection,

  // Tool Types
  MCPToolCategory,
  MCPToolInfo,
  ToolSelectionEntry,
  BatchOptimization,
  MCPToolCall,

  // Learning Types
  LearningEntry,
  CognitivePattern,
  PatternTrigger,
  PatternAction,

  // Configuration
  CognitiveFlowConfig,
  DEFAULT_FLOW_CONFIG,

  // Events
  CognitiveEventType,
  CognitiveEvent,
  CognitiveEventHandler
} from './types.js';

// Orchestrator
export {
  CognitiveOrchestrator,
  getOrchestrator,
  executeCognitiveFlow
} from './orchestrator.js';

// Server Pool
export { ServerPool } from './server-pool.js';

// Tool Optimizer
export { ToolOptimizer } from './tool-optimizer.js';

// Version
export const COGNITIVE_FLOW_VERSION = '1.0.0';

/**
 * Initialize cognitive-flow with default configuration.
 */
export function initializeCognitiveFlow(config?: Partial<import('./types.js').CognitiveFlowConfig>): CognitiveOrchestrator {
  return new CognitiveOrchestrator(config);
}

/**
 * Quick cognitive flow execution.
 */
export async function quickCognitiveFlow(
  operation: string,
  input: any,
  options?: {
    targetPath?: string;
    command?: string;
    timeout?: number;
  }
): Promise<import('./types.js').CognitiveResult> {
  const orchestrator = getOrchestrator();
  return orchestrator.quickExecute(operation, input, options);
}
