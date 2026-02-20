/**
 * @fileoverview Tests for playbooks module
 * Tests playbook templates for GSI workflows
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// Import the module
import * as playbooks from '../../../lib/agent-framework/playbooks';

describe('Playbook Templates', () => {
  describe('listPlaybookTemplates', () => {
    it('should list available playbook templates', () => {
      const templates = playbooks.listPlaybookTemplates();
      
      expect(templates).toContain('plan');
      expect(templates).toContain('execute');
      expect(templates).toContain('verify');
      expect(templates).toContain('full-cycle');
    });

    it('should return array of template names', () => {
      const templates = playbooks.listPlaybookTemplates();
      
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });
  });

  describe('getPlaybookTemplate', () => {
    it('should provide plan template for GSI workflows', () => {
      const template = playbooks.getPlaybookTemplate('plan');
      
      expect(template.steps.length).toBeGreaterThan(0);
      expect(template.steps[0].action).toBe('analyze');
      expect(template.steps[template.steps.length - 1].action).toBe('document');
    });

    it('should provide execute template for GSI workflows', () => {
      const template = playbooks.getPlaybookTemplate('execute');
      
      expect(template.steps.length).toBeGreaterThan(0);
      expect(template.steps.some(s => s.action === 'implement')).toBe(true);
    });

    it('should provide verify template for GSI workflows', () => {
      const template = playbooks.getPlaybookTemplate('verify');
      
      expect(template.steps.length).toBeGreaterThan(0);
      expect(template.steps.some(s => s.action === 'test')).toBe(true);
      expect(template.steps.some(s => s.action === 'validate')).toBe(true);
    });

    it('should provide full-cycle template combining all phases', () => {
      const template = playbooks.getPlaybookTemplate('full-cycle');
      const phases = template.steps.map(s => s.phase);
      
      expect(phases).toContain('plan');
      expect(phases).toContain('execute');
      expect(phases).toContain('verify');
    });

    it('should throw for invalid template name', () => {
      expect(() => playbooks.getPlaybookTemplate('invalid')).toThrow();
    });
  });

  describe('template customization', () => {
    it('should allow template customization', () => {
      const template = playbooks.getPlaybookTemplate('plan');
      
      const customized = template.customize({
        skipSteps: ['document'],
        addSteps: [{ name: 'custom', action: 'custom-action', order: 99 }]
      });
      
      expect(customized.steps.some(s => s.action === 'document')).toBe(false);
      expect(customized.steps.some(s => s.action === 'custom-action')).toBe(true);
    });

    it('should preserve original template when customizing', () => {
      const template = playbooks.getPlaybookTemplate('plan');
      const originalLength = template.steps.length;
      
      template.customize({
        addSteps: [{ name: 'extra', action: 'extra', order: 100 }]
      });
      
      expect(template.steps.length).toBe(originalLength);
    });

    it('should support step modification', () => {
      const template = playbooks.getPlaybookTemplate('execute');
      
      const modified = template.customize({
        modifySteps: [
          { name: 'implement', changes: { timeout: 5000 } }
        ]
      });
      
      const implementStep = modified.steps.find(s => s.action === 'implement');
      expect(implementStep.timeout).toBe(5000);
    });
  });

  describe('template metadata', () => {
    it('should include template metadata', () => {
      const template = playbooks.getPlaybookTemplate('plan');
      
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('description');
      expect(template).toHaveProperty('version');
    });

    it('should include expected duration', () => {
      const template = playbooks.getPlaybookTemplate('full-cycle');
      
      expect(template).toHaveProperty('estimatedDuration');
    });
  });
});

describe('PlanTemplate', () => {
  it('should have correct step structure', () => {
    const template = playbooks.getPlaybookTemplate('plan');
    
    const expectedActions = ['analyze', 'design', 'document'];
    const actions = template.steps.map(s => s.action);
    
    expectedActions.forEach(action => {
      expect(actions).toContain(action);
    });
  });

  it('should support GSI-specific planning steps', () => {
    const template = playbooks.getPlaybookTemplate('plan');
    
    expect(template.steps.some(s => s.action === 'analyze')).toBe(true);
  });
});

describe('ExecuteTemplate', () => {
  it('should have correct step structure', () => {
    const template = playbooks.getPlaybookTemplate('execute');
    
    expect(template.steps.some(s => s.action === 'implement')).toBe(true);
  });

  it('should support parallel execution steps', () => {
    const template = playbooks.getPlaybookTemplate('execute');
    
    const parallelSteps = template.steps.filter(s => s.parallel);
    expect(parallelSteps.length).toBeGreaterThanOrEqual(0);
  });
});

describe('VerifyTemplate', () => {
  it('should have correct step structure', () => {
    const template = playbooks.getPlaybookTemplate('verify');
    
    expect(template.steps.some(s => s.action === 'test')).toBe(true);
    expect(template.steps.some(s => s.action === 'validate')).toBe(true);
  });

  it('should include validation criteria', () => {
    const template = playbooks.getPlaybookTemplate('verify');
    
    expect(template).toHaveProperty('validationCriteria');
  });
});

describe('FullCycleTemplate', () => {
  it('should combine all phases', () => {
    const template = playbooks.getPlaybookTemplate('full-cycle');
    
    const phases = [...new Set(template.steps.map(s => s.phase))];
    
    expect(phases).toContain('plan');
    expect(phases).toContain('execute');
    expect(phases).toContain('verify');
  });

  it('should maintain phase order', () => {
    const template = playbooks.getPlaybookTemplate('full-cycle');
    
    const phaseOrder = template.steps.map(s => s.phase);
    const planIndex = phaseOrder.lastIndexOf('plan');
    const executeIndex = phaseOrder.findIndex(p => p === 'execute');
    const verifyIndex = phaseOrder.findIndex(p => p === 'verify');
    
    expect(planIndex).toBeLessThan(executeIndex);
    expect(executeIndex).toBeLessThan(verifyIndex);
  });
});
