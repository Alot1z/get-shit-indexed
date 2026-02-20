/**
 * @fileoverview Tests for profiles module
 * Tests profile management for different Claude models
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the module
import { ProfileManager } from '../../../lib/agent-framework/profiles';

describe('ProfileManager', () => {
  let manager;
  const testConfigPath = './test-profile-config.json';

  beforeEach(() => {
    manager = new ProfileManager({ configPath: testConfigPath });
  });

  afterEach(async () => {
    try {
      await fs.unlink(testConfigPath);
    } catch {
      // File might not exist
    }
  });

  describe('built-in profiles', () => {
    it('should support haiku profile', () => {
      const profile = manager.getProfile('haiku');
      
      expect(profile).toBeDefined();
      expect(profile.model).toBe('claude-haiku-4-5');
      expect(profile.speed).toBe('fast');
    });

    it('should support sonnet profile', () => {
      const profile = manager.getProfile('sonnet');
      
      expect(profile).toBeDefined();
      expect(profile.model).toBe('claude-sonnet');
      expect(profile.speed).toBe('balanced');
    });

    it('should support opus profile', () => {
      const profile = manager.getProfile('opus');
      
      expect(profile).toBeDefined();
      expect(profile.model).toBe('claude-opus-4-5');
      expect(profile.speed).toBe('quality');
    });

    it('should support zai profile', () => {
      const profile = manager.getProfile('zai');
      
      expect(profile).toBeDefined();
      expect(profile.provider).toBe('zhipu');
      expect(profile.model).toContain('glm');
    });

    it('should list all available profiles', () => {
      const profileList = manager.listProfiles();
      
      expect(profileList).toContain('haiku');
      expect(profileList).toContain('sonnet');
      expect(profileList).toContain('opus');
      expect(profileList).toContain('zai');
      expect(profileList.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('profile switching', () => {
    it('should switch profiles dynamically', async () => {
      await manager.switchProfile('haiku');
      expect(manager.getCurrentProfile().name).toBe('haiku');
      
      await manager.switchProfile('opus');
      expect(manager.getCurrentProfile().name).toBe('opus');
    });

    it('should emit event on profile change', async () => {
      const changes = [];
      manager.on('profileChange', (profile) => changes.push(profile.name));
      
      await manager.switchProfile('sonnet');
      
      expect(changes).toContain('sonnet');
    });

    it('should validate profile before switching', async () => {
      expect(manager.switchProfile('invalid-profile')).rejects.toThrow();
    });
  });

  describe('persistence', () => {
    it('should persist profile preference', async () => {
      await manager.switchProfile('sonnet');
      await manager.savePreference();
      
      const newManager = new ProfileManager({ configPath: testConfigPath });
      await newManager.loadPreference();
      
      expect(newManager.getCurrentProfile().name).toBe('sonnet');
    });

    it('should use default profile when no preference saved', () => {
      const freshManager = new ProfileManager({ configPath: './nonexistent-config.json' });
      
      const profile = freshManager.getCurrentProfile();
      expect(profile.name).toBe('haiku'); // Default
    });
  });

  describe('profile validation', () => {
    it('should validate profile configuration', () => {
      const invalidProfile = {
        name: 'invalid',
        model: '',
        maxTokens: -1
      };
      
      expect(() => manager.addProfile(invalidProfile)).toThrow();
    });

    it('should validate required fields', () => {
      const profile = manager.getProfile('haiku');
      
      expect(profile).toHaveProperty('name');
      expect(profile).toHaveProperty('model');
      expect(profile).toHaveProperty('maxTokens');
      expect(profile).toHaveProperty('speed');
    });

    it('should validate maxTokens range', () => {
      const invalidProfile = {
        name: 'bad-tokens',
        model: 'test',
        maxTokens: 999999999
      };
      
      expect(() => manager.addProfile(invalidProfile)).toThrow();
    });
  });

  describe('custom profiles', () => {
    it('should add custom profiles', () => {
      const customProfile = {
        name: 'custom',
        model: 'custom-model',
        maxTokens: 4096,
        speed: 'custom'
      };
      
      manager.addProfile(customProfile);
      const profile = manager.getProfile('custom');
      
      expect(profile.name).toBe('custom');
    });

    it('should override existing profiles', () => {
      const modifiedHaiku = {
        name: 'haiku',
        model: 'claude-haiku-4-5-modified',
        maxTokens: 16384,
        speed: 'turbo'
      };
      
      manager.addProfile(modifiedHaiku, { override: true });
      const profile = manager.getProfile('haiku');
      
      expect(profile.speed).toBe('turbo');
    });

    it('should not override without flag', () => {
      const duplicate = {
        name: 'haiku',
        model: 'duplicate',
        maxTokens: 4096,
        speed: 'fast'
      };
      
      expect(() => manager.addProfile(duplicate)).toThrow();
    });
  });

  describe('profile comparison', () => {
    it('should compare profile capabilities', () => {
      const comparison = manager.compareProfiles('haiku', 'opus');
      
      expect(comparison).toHaveProperty('faster');
      expect(comparison).toHaveProperty('moreCapable');
      expect(comparison.faster).toBe('haiku');
      expect(comparison.moreCapable).toBe('opus');
    });

    it('should recommend profile for task type', () => {
      const recommendation = manager.recommendForTask('quick-analysis');
      expect(recommendation).toBe('haiku');
      
      const complexRec = manager.recommendForTask('complex-reasoning');
      expect(complexRec).toBe('opus');
    });
  });
});
