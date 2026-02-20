/**
 * GSI Claudeception Module - Phase 49-F
 *
 * Self-improving knowledge extraction and artifact generation system.
 */

export {
  ClaudeceptionManager,
  ClaudeceptionConfig,
  ExtractionContext,
  ToolCallRecord,
  ClaudeceptionResult,
  HookType,
  HookHandler,
  createClaudeceptionCommand
} from './index.js';

// Re-export workflow modules for convenience
export {
  KnowledgeBase,
  KnowledgePattern,
  PatternCategory,
  ExtractionResult,
  MultiTypeGenerationResult
} from '../workflow-modules/knowledge-base.js';

export {
  ArtifactGeneratorManager,
  ArtifactType,
  GeneratedArtifact
} from '../workflow-modules/artifact-generator.js';

export {
  WorkflowChainer,
  WorkflowChain,
  WorkflowStep,
  WorkflowResult
} from '../workflow-modules/workflow-chainer.js';

export {
  PatternMiner,
  MinedPattern,
  MiningResult,
  MiningOptions
} from '../workflow-modules/pattern-miner.js';
