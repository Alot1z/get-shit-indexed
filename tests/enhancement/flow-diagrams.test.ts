/**
 * Flow Diagrams Tests (TDD)
 * Tests for workflow diagram generation
 */

import { describe, it, expect } from 'vitest';

describe('Flow Diagrams', () => {
  it('should generate workflow diagram from phase tasks', async () => {
    const { generateWorkflowDiagram } = await import('../../lib/enhancement/flow-diagrams');
    
    const workflow = {
      name: 'Phase 50',
      tasks: [
        { id: 'task1', name: 'Analyze', dependsOn: [] },
        { id: 'task2', name: 'Implement', dependsOn: ['task1'] },
        { id: 'task3', name: 'Test', dependsOn: ['task2'] },
        { id: 'task4', name: 'Verify', dependsOn: ['task3'] }
      ]
    };
    
    const diagram = await generateWorkflowDiagram(workflow);
    
    expect(diagram).toContain('flowchart LR');
    expect(diagram).toContain('Analyze');
    expect(diagram).toContain('Implement');
    expect(diagram).toContain('Test');
    expect(diagram).toContain('Verify');
    expect(diagram).toContain('task1 --> task2');
    expect(diagram).toContain('task2 --> task3');
    expect(diagram).toContain('task3 --> task4');
  });

  it('should handle parallel tasks in workflow', async () => {
    const { generateWorkflowDiagram } = await import('../../lib/enhancement/flow-diagrams');
    
    const parallelWorkflow = {
      name: 'Parallel Phase',
      tasks: [
        { id: 'start', name: 'Start', dependsOn: [] },
        { id: 'parallel1', name: 'Task A', dependsOn: ['start'] },
        { id: 'parallel2', name: 'Task B', dependsOn: ['start'] },
        { id: 'join', name: 'Join', dependsOn: ['parallel1', 'parallel2'] }
      ]
    };
    
    const diagram = await generateWorkflowDiagram(parallelWorkflow);
    
    expect(diagram).toContain('parallel1');
    expect(diagram).toContain('parallel2');
    // Both should converge on join
    expect(diagram).toMatch(/parallel1.*join|join.*parallel1/);
    expect(diagram).toMatch(/parallel2.*join|join.*parallel2/);
  });

  it('should generate workflow with subgraphs for waves', async () => {
    const { generateWorkflowDiagram } = await import('../../lib/enhancement/flow-diagrams');
    
    const waveWorkflow = {
      name: 'Integration',
      tasks: [
        { id: 'wave1-1', name: 'Core', dependsOn: [], wave: 1 },
        { id: 'wave2-1', name: 'Agent', dependsOn: ['wave1-1'], wave: 2 },
        { id: 'wave2-2', name: 'Knowledge', dependsOn: ['wave1-1'], wave: 2 }
      ]
    };
    
    const diagram = await generateWorkflowDiagram(waveWorkflow);
    
    expect(diagram).toContain('flowchart');
    expect(diagram).toContain('Core');
    expect(diagram).toContain('Agent');
    expect(diagram).toContain('Knowledge');
  });
});
