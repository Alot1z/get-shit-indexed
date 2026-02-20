/**
 * GSI Workflow Modules - Phase 49-F Integration
 * 
 * Consolidated exports for all workflow modules:
 * - KnowledgeBase: Pattern extraction and knowledge management
 * - PatchManager: Backup and restoration of local modifications
 * - WorkflowChainer: Command chaining with dependency resolution
 * - ThinkingOrchestrator: MCP thinking server coordination
 * - ArtifactGenerator: Multi-type artifact generation
 */

// Knowledge Base Module
export {
  KnowledgeBase,
  KnowledgePattern,
  PatternCategory,
  PatternVariation,
  PatternExample,
  KnowledgeTemplate,
  BestPractice,
  AntiPattern,
  ExtractionResult,
  MultiTypeGenerationResult
} from './knowledge-base.js';

// Patch Manager Module
export {
  PatchManager,
  PatchMetadata,
  PatchFile,
  PatchSummary,
  MergeResult,
  Conflict
} from './patch-manager.js';

// Workflow Chainer Module
export {
  WorkflowChainer,
  WorkflowChain,
  WorkflowStep,
  ParallelGroup,
  WorkflowState,
  CheckpointData,
  WorkflowResult,
  CheckpointStrategy,
  FailureStrategy
} from './workflow-chainer.js';

// Thinking Orchestrator Module
export {
  ThinkingOrchestrator,
  ThinkingMode,
  ThinkingServer,
  ThinkingPhaseConfig,
  ThinkingContext,
  ComplexityFactor,
  ComplexityAnalysis,
  ThinkingResult,
  ThinkingThought
} from './thinking-orchestrator.js';

// Artifact Generator Module
export {
  ArtifactGeneratorManager,
  ArtifactGenerator,
  ArtifactType,
  GeneratedArtifact,
  ArtifactMetadata,
  SkillGenerator,
  AgentGenerator,
  LogicGenerator,
  FunctionGenerator,
  FeatureGenerator,
  ImprovementGenerator,
  IdeaGenerator
} from './artifact-generator.js';

// Pattern Miner Module
export {
  PatternMiner,
  MinedPattern,
  MiningResult,
  MiningOptions
} from './pattern-miner.js';
