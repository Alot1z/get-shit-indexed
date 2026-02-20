/**
 * Visual Explainer Tests (TDD)
 * Tests for diagram generation from code structures
 */

import { describe, it, expect } from 'vitest';

describe('visual-explainer analysis', () => {
  it('should document diagram generation approach', async () => {
    const { analyzeDiagramApproach } = await import('../../lib/enhancement/visual-explainer');
    const documentation = await analyzeDiagramApproach();
    expect(documentation).toBeDefined();
    expect(documentation.approach).toContain('mermaid');
    expect(documentation.supportedTypes).toContain('flowchart');
    expect(documentation.supportedTypes).toContain('sequence');
  });
});

describe('Mermaid Generator', () => {
  it('should generate flowchart from code structure', async () => {
    const { generateMermaidDiagram } = await import('../../lib/enhancement/visual-explainer');
    
    const codeStructure = {
      type: 'module',
      name: 'gsi-core',
      exports: ['plan', 'execute', 'verify'],
      imports: ['fs', 'path']
    };
    
    const diagram = await generateMermaidDiagram(codeStructure, 'flowchart');
    
    expect(diagram).toContain('flowchart TD');
    expect(diagram).toContain('gsi-core');
    expect(diagram).toContain('plan');
    expect(diagram).toContain('execute');
    expect(diagram).toContain('verify');
  });

  it('should generate sequence diagram for function calls', async () => {
    const { generateMermaidDiagram } = await import('../../lib/enhancement/visual-explainer');
    
    const callSequence = [
      { from: 'orchestrator', to: 'planner', message: 'createPlan()' },
      { from: 'planner', to: 'executor', message: 'executePlan()' },
      { from: 'executor', to: 'verifier', message: 'verifyResults()' }
    ];
    
    const diagram = await generateMermaidDiagram(callSequence, 'sequence');
    
    expect(diagram).toContain('sequenceDiagram');
    expect(diagram).toContain('orchestrator->>planner');
    expect(diagram).toContain('planner->>executor');
  });

  it('should generate class diagram for class structures', async () => {
    const { generateMermaidDiagram } = await import('../../lib/enhancement/visual-explainer');
    
    const classStructure = {
      name: 'FeatureRegistry',
      properties: ['features', 'connections'],
      methods: ['register', 'get', 'list']
    };
    
    const diagram = await generateMermaidDiagram(classStructure, 'class');
    
    expect(diagram).toContain('classDiagram');
    expect(diagram).toContain('FeatureRegistry');
  });

  it('should throw error for unsupported diagram type', async () => {
    const { generateMermaidDiagram } = await import('../../lib/enhancement/visual-explainer');
    
    await expect(generateMermaidDiagram({}, 'unsupported' as any))
      .rejects.toThrow('Unsupported diagram type');
  });
});
