/**
 * Enhancement Layer Index
 * 
 * Unified exports for all enhancement layer modules:
 * - Visual Explainer (diagram generation)
 * - Flow Diagrams (workflow visualization)
 * - Architecture Diagrams (module structure)
 * - Awesome SDKs (SDK catalog and registry)
 * - SDK Discovery (automatic SDK detection)
 * - Superpowers (extended features)
 * - Feature Registry (feature management)
 */

// Visual Explainer
export {
  generateMermaidDiagram,
  analyzeDiagramApproach
} from './visual-explainer';

export type { 
  DiagramType,
  DiagramDocumentation,
  CodeStructure,
  CallSequence,
  ClassStructure
} from './visual-explainer';

// Flow Diagrams
export {
  generateWorkflowDiagram,
  generateDependencyGraph,
  analyzeParallelism
} from './flow-diagrams';

export type {
  WorkflowTask,
  Workflow
} from './flow-diagrams';

// Architecture Diagrams
export {
  generateArchitectureDiagram,
  generateLayerDependencyDiagram,
  generateModuleConnectionDiagram,
  detectCircularDependencies
} from './arch-diagrams';

export type {
  ArchLayer,
  Architecture
} from './arch-diagrams';

// SDK Registry
export {
  SDKRegistry,
  getSDK,
  analyzeCatalogFormat,
  getDefaultRegistry
} from './awesome-sdks';

export type {
  SDK,
  CatalogFormat
} from './awesome-sdks';

// SDK Discovery
export {
  discoverSDKs,
  getSDKStats,
  filterByCategory,
  getCategories,
  discoverAndGroup
} from './sdk-discovery';

export type {
  DiscoveredSDK
} from './sdk-discovery';

// Superpowers
export {
  analyzeSuperpowersFeatures,
  enableFeature,
  gsiEnhance,
  getEnabledFeatures,
  disableFeature,
  isFeatureEnabled,
  getFeature
} from './superpowers';

export type {
  Feature,
  FeatureCatalog
} from './superpowers';

// Feature Registry (New)
export {
  FeatureRegistry,
  createDefaultRegistry
} from './feature-registry-new';

export type {
  Enhancement
} from './feature-registry-new';

// Re-export DiagramType as value for runtime use
export const DiagramType = {
  FLOWCHART: 'flowchart' as const,
  SEQUENCE: 'sequence' as const,
  CLASS: 'class' as const,
  STATE: 'state' as const
};
