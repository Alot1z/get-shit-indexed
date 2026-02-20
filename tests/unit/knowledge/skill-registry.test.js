/**
 * @fileoverview Tests for skill registry module
 * Part of Phase 50C: Knowledge System Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  createSkillRegistry,
  registerSkill,
  getSkill,
  listSkills,
  searchSkills,
  getSkillMetadata,
  validateSkill
} from '../../../lib/knowledge/skill-registry';

describe('Skill Registry Module', () => {
  describe('createSkillRegistry', () => {
    it('should create empty skill registry', () => {
      const registry = createSkillRegistry();
      
      expect(registry).toBeDefined();
      expect(typeof registry.register).toBe('function');
      expect(typeof registry.get).toBe('function');
      expect(typeof registry.list).toBe('function');
    });

    it('should create registry with initial skills', () => {
      const skills = [
        { name: 'skill-1', execute: () => {}, description: 'First skill' },
        { name: 'skill-2', execute: () => {}, description: 'Second skill' }
      ];
      
      const registry = createSkillRegistry({ initialSkills: skills });
      
      expect(registry.size()).toBe(2);
    });
  });

  describe('registerSkill / getSkill', () => {
    let registry;

    beforeEach(() => {
      registry = createSkillRegistry();
    });

    it('should register and retrieve skill', () => {
      const skill = {
        name: 'test-skill',
        execute: () => 'result',
        description: 'Test skill'
      };
      
      registry.register(skill);
      
      const retrieved = registry.get('test-skill');
      expect(retrieved.name).toBe('test-skill');
    });

    it('should throw for duplicate skill name', () => {
      const skill = {
        name: 'duplicate',
        execute: () => {},
        description: 'First'
      };
      
      registry.register(skill);
      
      expect(() => registry.register(skill)).toThrow(/already exists/);
    });

    it('should validate skill on registration', () => {
      const invalidSkill = {
        name: 'invalid'
        // Missing execute function
      };
      
      expect(() => registry.register(invalidSkill)).toThrow(/execute/);
    });

    it('should return undefined for unknown skill', () => {
      const skill = registry.get('unknown');
      
      expect(skill).toBeUndefined();
    });
  });

  describe('listSkills', () => {
    let registry;

    beforeEach(() => {
      registry = createSkillRegistry();
      registry.register({ name: 'alpha', execute: () => {}, description: 'Alpha skill' });
      registry.register({ name: 'beta', execute: () => {}, description: 'Beta skill' });
      registry.register({ name: 'gamma', execute: () => {}, description: 'Gamma skill' });
    });

    it('should list all registered skills', () => {
      const skills = registry.list();
      
      expect(skills.length).toBe(3);
    });

    it('should filter skills by category', () => {
      registry.register({
        name: 'categorized',
        execute: () => {},
        description: 'Categorized skill',
        category: 'testing'
      });
      
      const skills = registry.list({ category: 'testing' });
      
      expect(skills.length).toBe(1);
      expect(skills[0].name).toBe('categorized');
    });

    it('should sort skills by name', () => {
      const skills = registry.list({ sort: 'name' });
      
      expect(skills[0].name).toBe('alpha');
      expect(skills[1].name).toBe('beta');
      expect(skills[2].name).toBe('gamma');
    });
  });

  describe('searchSkills', () => {
    let registry;

    beforeEach(() => {
      registry = createSkillRegistry();
      registry.register({
        name: 'javascript-helpers',
        execute: () => {},
        description: 'JavaScript utility functions',
        tags: ['javascript', 'utilities']
      });
      registry.register({
        name: 'python-helpers',
        execute: () => {},
        description: 'Python utility functions',
        tags: ['python', 'utilities']
      });
      registry.register({
        name: 'data-processors',
        execute: () => {},
        description: 'Data processing utilities',
        tags: ['data', 'processing']
      });
    });

    it('should search skills by name', () => {
      const results = searchSkills(registry, 'javascript');
      
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('javascript-helpers');
    });

    it('should search skills by description', () => {
      const results = searchSkills(registry, 'utility');
      
      expect(results.length).toBe(2);
    });

    it('should search skills by tags', () => {
      const results = searchSkills(registry, 'utilities', { searchTags: true });
      
      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('should return empty array for no matches', () => {
      const results = searchSkills(registry, 'nonexistent');
      
      expect(results).toEqual([]);
    });
  });

  describe('getSkillMetadata', () => {
    let registry;

    beforeEach(() => {
      registry = createSkillRegistry();
    });

    it('should return skill metadata', () => {
      registry.register({
        name: 'meta-skill',
        execute: () => {},
        description: 'Skill with metadata',
        metadata: {
          version: '1.0.0',
          author: 'test',
          tags: ['meta']
        }
      });
      
      const metadata = getSkillMetadata(registry, 'meta-skill');
      
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.author).toBe('test');
    });

    it('should return null for unknown skill', () => {
      const metadata = getSkillMetadata(registry, 'unknown');
      
      expect(metadata).toBeNull();
    });
  });

  describe('validateSkill', () => {
    it('should validate valid skill', () => {
      const skill = {
        name: 'valid-skill',
        execute: () => {},
        description: 'Valid skill'
      };
      
      const result = validateSkill(skill);
      
      expect(result.valid).toBe(true);
    });

    it('should detect missing name', () => {
      const skill = {
        execute: () => {},
        description: 'Missing name'
      };
      
      const result = validateSkill(skill);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('name'))).toBe(true);
    });

    it('should detect missing execute function', () => {
      const skill = {
        name: 'no-execute',
        description: 'Missing execute'
      };
      
      const result = validateSkill(skill);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('execute'))).toBe(true);
    });

    it('should warn about missing description', () => {
      const skill = {
        name: 'no-desc',
        execute: () => {}
      };
      
      const result = validateSkill(skill);
      
      expect(result.valid).toBe(true); // Still valid
      expect(result.warnings.some(w => w.includes('description'))).toBe(true);
    });
  });

  describe('GSI Skills Integration', () => {
    it('should list GSI skills', () => {
      const registry = createSkillRegistry();
      
      // Register a few GSI-like skills
      registry.register({
        name: 'sequential-thinking',
        execute: () => {},
        description: 'Sequential thinking MCP',
        category: 'thinking'
      });
      registry.register({
        name: 'tractatus-thinking',
        execute: () => {},
        description: 'Tractatus thinking MCP',
        category: 'thinking'
      });
      registry.register({
        name: 'desktop-commander',
        execute: () => {},
        description: 'Desktop Commander MCP',
        category: 'tools'
      });
      
      const skills = registry.list();
      
      expect(skills.length).toBeGreaterThanOrEqual(3);
    });
  });
});
