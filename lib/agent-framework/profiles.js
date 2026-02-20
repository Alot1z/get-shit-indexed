/**
 * @fileoverview Profiles Module
 * Profile management for different Claude models
 * Part of Phase 50B: Agent Framework Integration
 */

const { EventEmitter } = require('events');
const fs = require('fs/promises');

/**
 * @typedef {Object} Profile
 * @property {string} name
 * @property {string} model
 * @property {number} maxTokens
 * @property {'fast' | 'balanced' | 'quality' | 'custom'} speed
 * @property {string} [provider]
 * @property {number} [temperature]
 * @property {string} [description]
 */

/**
 * @typedef {Object} ProfileManagerConfig
 * @property {string} [configPath]
 * @property {string} [defaultProfile]
 */

// Built-in profiles
const BUILTIN_PROFILES = {
  haiku: {
    name: 'haiku',
    model: 'claude-haiku-4-5',
    maxTokens: 8192,
    speed: 'fast',
    description: 'Fast and efficient for quick tasks'
  },
  sonnet: {
    name: 'sonnet',
    model: 'claude-sonnet',
    maxTokens: 16384,
    speed: 'balanced',
    description: 'Balanced performance for general tasks'
  },
  opus: {
    name: 'opus',
    model: 'claude-opus-4-5',
    maxTokens: 32768,
    speed: 'quality',
    description: 'Highest quality for complex tasks'
  },
  zai: {
    name: 'zai',
    model: 'glm-5',
    maxTokens: 16384,
    speed: 'balanced',
    provider: 'zhipu',
    description: 'Zhipu GLM model for Chinese language tasks'
  },
  'zai-flash': {
    name: 'zai-flash',
    model: 'glm-5-flash',
    maxTokens: 8192,
    speed: 'fast',
    provider: 'zhipu',
    description: 'Fast Zhipu GLM model'
  }
};

// Task type recommendations
const TASK_RECOMMENDATIONS = {
  'quick-analysis': 'haiku',
  'simple-task': 'haiku',
  'general-task': 'sonnet',
  'complex-reasoning': 'opus',
  'code-generation': 'sonnet',
  'code-review': 'opus',
  'chinese-task': 'zai'
};

/**
 * ProfileManager - Manages model profiles
 */
class ProfileManager extends EventEmitter {
  /**
   * @param {ProfileManagerConfig} [config]
   */
  constructor(config = {}) {
    super();
    /** @type {Map<string, Profile>} */
    this.profiles = new Map(Object.entries(BUILTIN_PROFILES));
    this.configPath = config.configPath ?? null;
    this.currentProfile = this.profiles.get(config.defaultProfile ?? 'haiku');
  }

  /**
   * Get a profile by name
   * @param {string} name
   * @returns {Profile}
   */
  getProfile(name) {
    const profile = this.profiles.get(name);
    if (!profile) {
      throw new Error(`Profile not found: ${name}`);
    }
    return { ...profile };
  }

  /**
   * Get current profile
   * @returns {Profile}
   */
  getCurrentProfile() {
    return { ...this.currentProfile };
  }

  /**
   * List all available profiles
   * @returns {string[]}
   */
  listProfiles() {
    return Array.from(this.profiles.keys());
  }

  /**
   * Switch to a different profile
   * @param {string} name
   * @returns {Promise<void>}
   */
  async switchProfile(name) {
    const profile = this.profiles.get(name);
    if (!profile) {
      throw new Error(`Cannot switch to unknown profile: ${name}`);
    }
    
    const previousProfile = this.currentProfile;
    this.currentProfile = profile;
    
    this.emit('profileChange', { ...this.currentProfile }, previousProfile);
  }

  /**
   * Add a new profile
   * @param {Profile} profile
   * @param {{ override?: boolean }} [options]
   */
  addProfile(profile, options) {
    // Validate profile
    this.validateProfile(profile);
    
    // Check for existing profile
    if (this.profiles.has(profile.name) && !options?.override) {
      throw new Error(`Profile already exists: ${profile.name}`);
    }
    
    this.profiles.set(profile.name, profile);
  }

  /**
   * Save current preference to file
   * @returns {Promise<void>}
   */
  async savePreference() {
    if (!this.configPath) {
      return;
    }
    
    await fs.writeFile(
      this.configPath,
      JSON.stringify({ currentProfile: this.currentProfile.name }, null, 2)
    );
  }

  /**
   * Load preference from file
   * @returns {Promise<void>}
   */
  async loadPreference() {
    if (!this.configPath) {
      return;
    }
    
    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      const data = JSON.parse(content);
      
      if (data.currentProfile && this.profiles.has(data.currentProfile)) {
        this.currentProfile = this.profiles.get(data.currentProfile);
      }
    } catch {
      // File doesn't exist or is invalid, use default
    }
  }

  /**
   * Compare two profiles
   * @param {string} name1
   * @param {string} name2
   * @returns {{ faster: string; moreCapable: string }}
   */
  compareProfiles(name1, name2) {
    const p1 = this.getProfile(name1);
    const p2 = this.getProfile(name2);
    
    const speedOrder = { fast: 1, balanced: 2, quality: 3, custom: 2 };
    
    return {
      faster: speedOrder[p1.speed] <= speedOrder[p2.speed] ? name1 : name2,
      moreCapable: p1.maxTokens >= p2.maxTokens ? name1 : name2
    };
  }

  /**
   * Recommend profile for a task type
   * @param {string} taskType
   * @returns {string}
   */
  recommendForTask(taskType) {
    return TASK_RECOMMENDATIONS[taskType] ?? 'sonnet';
  }

  /**
   * Validate profile configuration
   * @param {Profile} profile
   */
  validateProfile(profile) {
    if (!profile.name || profile.name.trim() === '') {
      throw new Error('Profile name is required');
    }
    
    if (!profile.model || profile.model.trim() === '') {
      throw new Error('Profile model is required');
    }
    
    if (profile.maxTokens < 1 || profile.maxTokens > 1000000) {
      throw new Error('Invalid maxTokens value');
    }
    
    const validSpeeds = ['fast', 'balanced', 'quality', 'custom', 'turbo'];
    if (!validSpeeds.includes(profile.speed)) {
      throw new Error(`Invalid speed value: ${profile.speed}`);
    }
  }
}

// Singleton for quick access
let defaultManager = null;

/**
 * Get or create default ProfileManager
 * @param {ProfileManagerConfig} [config]
 * @returns {ProfileManager}
 */
function getProfileManager(config) {
  if (!defaultManager) {
    defaultManager = new ProfileManager(config);
  }
  return defaultManager;
}

module.exports = {
  ProfileManager,
  getProfileManager
};
