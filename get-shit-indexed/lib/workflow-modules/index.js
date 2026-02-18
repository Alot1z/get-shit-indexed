/**
 * GSI Workflow Modules Index
 * 
 * Exports all workflow modules for use by GSI commands and CLI.
 * These modules provide the foundation for claudeception-style self-improvement.
 */

// Patch Manager - Handles backup/restore of local modifications across GSI updates
export { PatchManager } from './patch-manager.js';
export type { 
  PatchMetadata, 
  PatchFile, 
  PatchSummary, 
  MergeResult, 
  Conflict 
} from './patch-manager.js';

// Thinking Orchestrator - Coordinates MCP thinking servers based on thinking_phase configs
export { ThinkingOrchestrator } from './thinking-orchestrator.js';
export type { 
  ThinkingMode, 
  ThinkingServer, 
  ThinkingPhaseConfig, 
  ThinkingContext,
  ThinkingResult,
  ThinkingThought
} from './thinking-orchestrator.js';

// Workflow Chainer - Chains multiple GSI commands with dependency resolution
export { WorkflowChainer } from './workflow-chainer.js';
export type { 
  WorkflowChain, 
  WorkflowStep, 
  WorkflowState,
  WorkflowResult,
  ParallelGroup,
  CheckpointData,
  CheckpointStrategy,
  FailureStrategy
} from './workflow-chainer.js';

// Knowledge Base - Extracts patterns and generates skills/agents/features
export { KnowledgeBase } from './knowledge-base.js';
export type { 
  KnowledgePattern, 
  PatternCategory,
  KnowledgeTemplate,
  BestPractice,
  AntiPattern,
  ExtractionResult,
  PatternVariation,
  PatternExample
} from './knowledge-base.js';

// Convenience function to initialize all modules
export function initializeWorkflowModules(options?: {
  knowledgeDir?: string;
  stateDir?: string;
  patchesDir?: string;
}) {
  return {
    patchManager: new PatchManager(options?.patchesDir),
    thinkingOrchestrator: new ThinkingOrchestrator(),
    workflowChainer: new WorkflowChainer(options?.stateDir),
    knowledgeBase: new KnowledgeBase(options?.knowledgeDir)
  };
}
