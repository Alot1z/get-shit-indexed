/**
 * Architecture Diagrams Tests (TDD)
 * Tests for architecture diagram generation
 */

import { describe, it, expect } from 'vitest';

describe('Architecture Diagrams', () => {
  it('should generate architecture diagram from module structure', async () => {
    const { generateArchitectureDiagram } = await import('../../lib/enhancement/arch-diagrams');
    
    const architecture = {
      layers: [
        {
          name: 'Core',
          modules: ['files-to-prompt', 'semantic-search', 'code-graph']
        },
        {
          name: 'Agent',
          modules: ['lightning', 'sdk', 'ralph'],
          dependsOn: ['Core']
        },
        {
          name: 'Enhancement',
          modules: ['visual', 'sdks', 'superpowers'],
          dependsOn: ['Agent']
        }
      ]
    };
    
    const diagram = await generateArchitectureDiagram(architecture);
    
    expect(diagram).toContain('graph TB');
    expect(diagram).toContain('subgraph Core');
    expect(diagram).toContain('subgraph Agent');
    expect(diagram).toContain('subgraph Enhancement');
    expect(diagram).toContain('Core --> Agent');
    expect(diagram).toContain('Agent --> Enhancement');
  });

  it('should show module connections within layers', async () => {
    const { generateArchitectureDiagram } = await import('../../lib/enhancement/arch-diagrams');
    
    const arch = {
      layers: [
        {
          name: 'Core',
          modules: ['a', 'b', 'c'],
          connections: [
            { from: 'a', to: 'b' },
            { from: 'b', to: 'c' }
          ]
        }
      ]
    };
    
    const diagram = await generateArchitectureDiagram(arch);
    
    expect(diagram).toContain('a --> b');
    expect(diagram).toContain('b --> c');
  });

  it('should support different layout directions', async () => {
    const { generateArchitectureDiagram } = await import('../../lib/enhancement/arch-diagrams');
    
    const arch = {
      layers: [{ name: 'Test', modules: ['x'] }],
      layout: 'LR'
    };
    
    const diagram = await generateArchitectureDiagram(arch);
    
    expect(diagram).toContain('graph LR');
  });

  it('should handle empty layers gracefully', async () => {
    const { generateArchitectureDiagram } = await import('../../lib/enhancement/arch-diagrams');
    
    const arch = {
      layers: []
    };
    
    const diagram = await generateArchitectureDiagram(arch);
    
    expect(diagram).toContain('graph TB');
  });
});
