/**
 * Full Layer Integration Tests
 * Tests verifying all 6 layers work together
 */

import { describe, it, expect } from 'vitest';
import { 
  verifyAllLayers,
  coreIndex, 
  agentProcess, 
  knowledgeStore, 
  workflowExecute, 
  distributionPackage, 
  enhancementDiagram,
  listIntegratedRepos
} from './helpers';

describe('Full Stack Integration', () => {
  it('should integrate all 6 layers', async () => {
    const layers = await verifyAllLayers();
    
    expect(layers.core).toBe('operational');
    expect(layers.agent).toBe('operational');
    expect(layers.knowledge).toBe('operational');
    expect(layers.workflow).toBe('operational');
    expect(layers.distribution).toBe('operational');
    expect(layers.enhancement).toBe('operational');
  });

  it('should process request through all layers', async () => {
    const request = {
      type: 'code-analysis',
      code: 'function hello() { return "world"; }'
    };
    
    // Core: Index and search
    const indexed = await coreIndex(request.code);
    expect(indexed).toBeDefined();
    
    // Agent: Process with agent
    const processed = await agentProcess(indexed);
    expect(processed).toBeDefined();
    
    // Knowledge: Store in knowledge base
    const stored = await knowledgeStore(processed);
    expect(stored).toBeDefined();
    
    // Workflow: Execute workflow
    const result = await workflowExecute(stored);
    expect(result).toBeDefined();
    
    // Distribution: Package output
    const packaged = await distributionPackage(result);
    expect(packaged).toBeDefined();
    
    // Enhancement: Generate diagram
    const diagram = await enhancementDiagram(packaged);
    expect(diagram).toContain('flowchart');
  });

  it('should verify all 20 repositories integrated', async () => {
    const repos = await listIntegratedRepos();
    
    expect(repos.length).toBe(20);
    
    // Core repos
    expect(repos).toContain('files-to-prompt');
    expect(repos).toContain('semantic-code-search');
    expect(repos).toContain('CodeGraphContext');
    expect(repos).toContain('FastCode');
    
    // Agent repos
    expect(repos).toContain('agent-lightning');
    expect(repos).toContain('claude-agent-sdk');
    expect(repos).toContain('ralph-playbook');
    expect(repos).toContain('picobot');
    
    // Knowledge repos
    expect(repos).toContain('txtai');
    expect(repos).toContain('arscontexta');
    expect(repos).toContain('skill-compose');
    
    // Workflow repos
    expect(repos).toContain('PromptChains');
    expect(repos).toContain('mdream');
    expect(repos).toContain('taskmaster');
    
    // Distribution repos
    expect(repos).toContain('electrobun');
    expect(repos).toContain('superdoc');
    expect(repos).toContain('cxcompress');
    
    // Enhancement repos
    expect(repos).toContain('visual-explainer');
    expect(repos).toContain('awesome-sdks');
    expect(repos).toContain('superpowers');
  });
});
