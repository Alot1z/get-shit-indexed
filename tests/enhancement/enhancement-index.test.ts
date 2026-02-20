/**
 * Enhancement Index Tests (TDD)
 * Tests for unified enhancement module exports
 */

import { describe, it, expect } from 'vitest';

describe('Enhancement Index', () => {
  it('should export visual-explainer module', async () => {
    const Enhancement = await import('../../lib/enhancement/enhancement-index');
    
    expect(Enhancement.generateMermaidDiagram).toBeDefined();
    expect(Enhancement.generateWorkflowDiagram).toBeDefined();
    expect(Enhancement.generateArchitectureDiagram).toBeDefined();
  });

  it('should export SDK registry module', async () => {
    const Enhancement = await import('../../lib/enhancement/enhancement-index');
    
    expect(Enhancement.SDKRegistry).toBeDefined();
    expect(Enhancement.discoverSDKs).toBeDefined();
    expect(Enhancement.getSDK).toBeDefined();
  });

  it('should export superpowers module', async () => {
    const Enhancement = await import('../../lib/enhancement/enhancement-index');
    
    expect(Enhancement.analyzeSuperpowersFeatures).toBeDefined();
    expect(Enhancement.enableFeature).toBeDefined();
    expect(Enhancement.gsiEnhance).toBeDefined();
  });

  it('should export feature registry', async () => {
    const Enhancement = await import('../../lib/enhancement/enhancement-index');
    
    expect(Enhancement.FeatureRegistry).toBeDefined();
  });

  it('should export diagram types', async () => {
    const Enhancement = await import('../../lib/enhancement/enhancement-index');
    
    expect(Enhancement.DiagramType).toBeDefined();
  });

  it('should export SDK type', async () => {
    const Enhancement = await import('../../lib/enhancement/enhancement-index');
    
    // Type is exported, runtime it's just the interface
    // Check that the module loaded successfully
    expect(Enhancement).toBeDefined();
  });

  it('should export Feature type', async () => {
    const Enhancement = await import('../../lib/enhancement/enhancement-index');
    
    // Type is exported, runtime it's just the interface
    expect(Enhancement).toBeDefined();
  });
});
