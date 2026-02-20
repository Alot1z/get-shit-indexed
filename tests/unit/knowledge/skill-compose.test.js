/**
 * @fileoverview Tests for skill-compose module
 * Part of Phase 50C: Knowledge System Integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import {
  analyzeSkillCompose,
  composeSkills,
  createSkillComposer,
  registerSkill,
  getSkillRegistry,
  createWorkflow,
  validateWorkflow,
  executeWorkflow,
  decomposeSkill,
  mergeSkillOutputs
} from '../../../lib/knowledge/skill-compose';

describe('Skill Compose Module', () => {
  describe('analyzeSkillCompose', () => {
    it('should return architecture analysis', async () => {
      const analysis = await analyzeSkillCompose();
      
      expect(analysis).toBeDefined();
      expect(analysis.approach).toBe('composable-skills');
      expect(analysis.features).toContain('skill-composition');
      expect(analysis.features).toContain('workflow-chaining');
      expect(analysis.features).toContain('primitive-skills');
      expect(analysis.analyzed).toBeDefined();
    });
  });

  describe('createSkillComposer', () => {
    it('should create skill composer instance', () => {
      const composer = createSkillComposer();
      
      expect(composer).toBeDefined();
      expect(typeof composer.compose).toBe('function');
      expect(typeof composer.register).toBe('function');
      expect(typeof composer.getSkill).toBe('function');
    });

    it('should register and retrieve skills', () => {
      const composer = createSkillComposer();
      
      composer.register('test-skill', {
        execute: () => 'test result',
        description: 'A test skill'
      });
      
      const skill = composer.getSkill('test-skill');
      expect(skill).toBeDefined();
      expect(skill.description).toBe('A test skill');
    });
  });

  describe('registerSkill', () => {
    beforeEach(() => {
      // Clear global registry
      getSkillRegistry().clear();
    });

    it('should register a skill globally', () => {
      const skill = {
        name: 'global-skill',
        execute: () => 'global result',
        description: 'A globally registered skill'
      };
      
      registerSkill(skill);
      
      const registry = getSkillRegistry();
      expect(registry.has('global-skill')).toBe(true);
    });

    it('should validate skill on registration', () => {
      const invalidSkill = {
        name: 'invalid-skill'
        // Missing execute function
      };
      
      expect(() => registerSkill(invalidSkill)).toThrow(/execute/);
    });
  });

  describe('composeSkills', () => {
    beforeEach(() => {
      getSkillRegistry().clear();
      // Register test skills
      registerSkill({
        name: 'skill-a',
        execute: (input) => `${input}-a`,
        description: 'Skill A'
      });
      
      registerSkill({
        name: 'skill-b',
        execute: (input) => `${input}-b`,
        description: 'Skill B'
      });
    });

    it('should compose multiple skills', () => {
      const composed = composeSkills(['skill-a', 'skill-b']);
      
      expect(composed).toBeDefined();
      expect(typeof composed.execute).toBe('function');
    });

    it('should execute composed skills in sequence', async () => {
      const composed = composeSkills(['skill-a', 'skill-b']);
      
      const result = await composed.execute('start');
      
      expect(result).toBe('start-a-b');
    });

    it('should handle parallel composition', () => {
      const composed = composeSkills(['skill-a', 'skill-b'], { mode: 'parallel' });
      
      expect(composed).toBeDefined();
      expect(typeof composed.execute).toBe('function');
    });

    it('should throw for unknown skills', () => {
      expect(() => composeSkills(['unknown-skill'])).toThrow();
    });
  });

  describe('createWorkflow', () => {
    beforeEach(() => {
      getSkillRegistry().clear();
      registerSkill({
        name: 'add-prefix',
        execute: (input) => `prefix-${input}`,
        description: 'Add prefix'
      });
      
      registerSkill({
        name: 'add-suffix',
        execute: (input) => `${input}-suffix`,
        description: 'Add suffix'
      });
    });

    it('should create workflow from steps', () => {
      const steps = [
        { skill: 'add-prefix', input: 'initial' },
        { skill: 'add-suffix' }
      ];
      
      const workflow = createWorkflow(steps);
      
      expect(workflow).toBeDefined();
      expect(typeof workflow.run).toBe('function');
      expect(workflow.steps.length).toBe(2);
    });

    it('should validate workflow steps', () => {
      const invalidSteps = [
        { skill: 'unknown-skill' } // Unknown skill
      ];
      
      expect(() => createWorkflow(invalidSteps)).toThrow();
    });
  });

  describe('validateWorkflow', () => {
    beforeEach(() => {
      getSkillRegistry().clear();
      registerSkill({
        name: 'skill-a',
        execute: () => {},
        description: 'Skill A'
      });
      registerSkill({
        name: 'skill-b',
        execute: () => {},
        description: 'Skill B'
      });
    });

    it('should validate valid workflow', () => {
      const workflow = {
        steps: [
          { skill: 'skill-a' },
          { skill: 'skill-b' }
        ]
      };
      
      const result = validateWorkflow(workflow);
      
      expect(result.valid).toBe(true);
    });

    it('should detect invalid workflow', () => {
      const workflow = {
        steps: [
          { skill: 'unknown-skill' }
        ]
      };
      
      const result = validateWorkflow(workflow);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect circular dependencies', () => {
      const workflow = {
        steps: [
          { skill: 'skill-a', dependsOn: ['skill-b'] },
          { skill: 'skill-b', dependsOn: ['skill-a'] }
        ]
      };
      
      const result = validateWorkflow(workflow);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('circular'))).toBe(true);
    });
  });

  describe('executeWorkflow', () => {
    beforeEach(() => {
      getSkillRegistry().clear();
      registerSkill({
        name: 'add-prefix',
        execute: (input) => `prefix-${input}`,
        description: 'Add prefix'
      });
      
      registerSkill({
        name: 'add-suffix',
        execute: (input) => `${input}-suffix`,
        description: 'Add suffix'
      });
    });

    it('should execute workflow steps in order', async () => {
      const workflow = createWorkflow([
        { skill: 'add-prefix', input: 'test' },
        { skill: 'add-suffix' }
      ]);
      
      const result = await executeWorkflow(workflow);
      
      expect(result).toBe('prefix-test-suffix');
    });

    it('should pass output between steps', async () => {
      const workflow = createWorkflow([
        { skill: 'add-prefix', input: 'data' },
        { skill: 'add-prefix' },
        { skill: 'add-suffix' }
      ]);
      
      const result = await executeWorkflow(workflow);
      
      expect(result).toBe('prefix-prefix-data-suffix');
    });

    it('should handle step errors', async () => {
      getSkillRegistry().clear();
      registerSkill({
        name: 'failing-skill',
        execute: () => { throw new Error('Step failed'); },
        description: 'A failing skill'
      });
      
      const workflow = createWorkflow([
        { skill: 'failing-skill' }
      ]);
      
      expect(executeWorkflow(workflow)).rejects.toThrow(/Step failed/);
    });
  });

  describe('decomposeSkill', () => {
    beforeEach(() => {
      getSkillRegistry().clear();
    });

    it('should decompose complex skill into primitives', () => {
      registerSkill({
        name: 'complex-skill',
        primitives: ['read', 'parse', 'transform'],
        execute: () => {},
        description: 'Complex skill'
      });
      
      const decomposed = decomposeSkill('complex-skill');
      
      expect(decomposed).toBeDefined();
      expect(decomposed.primitives).toEqual(['read', 'parse', 'transform']);
    });

    it('should return null for unknown skill', () => {
      const decomposed = decomposeSkill('unknown-skill');
      
      expect(decomposed).toBeNull();
    });
  });

  describe('mergeSkillOutputs', () => {
    it('should merge outputs from multiple skills', () => {
      const outputs = [
        { data: 'output1', source: 'skill-a' },
        { data: 'output2', source: 'skill-b' }
      ];
      
      const merged = mergeSkillOutputs(outputs);
      
      expect(merged).toBeDefined();
      expect(merged.data).toBeDefined();
      expect(merged.sources.length).toBe(2);
    });

    it('should handle single output', () => {
      const outputs = [
        { data: 'only-output', source: 'skill-a' }
      ];
      
      const merged = mergeSkillOutputs(outputs);
      
      expect(merged.data).toBe('only-output');
    });

    it('should handle empty outputs', () => {
      const merged = mergeSkillOutputs([]);
      
      expect(merged).toEqual({ data: null, sources: [] });
    });
  });

  describe('Skill Registry', () => {
    beforeEach(() => {
      getSkillRegistry().clear();
    });

    it('should list all registered skills', () => {
      registerSkill({
        name: 'test-skill',
        execute: () => {},
        description: 'Test'
      });
      
      const registry = getSkillRegistry();
      
      expect(registry instanceof Map).toBe(true);
      expect(registry.size).toBeGreaterThan(0);
    });

    it('should provide skill metadata', () => {
      registerSkill({
        name: 'meta-skill',
        execute: () => {},
        description: 'Skill with metadata',
        metadata: { version: '1.0', author: 'test' }
      });
      
      const registry = getSkillRegistry();
      const skill = registry.get('meta-skill');
      
      expect(skill.metadata.version).toBe('1.0');
    });
  });
});
