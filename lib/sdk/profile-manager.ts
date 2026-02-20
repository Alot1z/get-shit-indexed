/**
 * Profile Manager
 * 
 * Manages model profiles for GSI operations.
 * Supports multiple profiles: haiku, sonnet, opus, zai, zai-flash
 * 
 * @module gsi/sdk/profile-manager
 */

// Available model profiles
export type ModelProfile = 'haiku' | 'sonnet' | 'opus' | 'zai' | 'zai-flash' | 'zai-swarm' | 'zai-legacy' | 'zai-legacy-flash';

// Profile priority levels
export type ProfilePriority = 'budget' | 'balanced' | 'quality';

// Profile configuration
export interface ProfileConfig {
  /** Model identifier for the profile */
  model: string;
  /** Display name */
  displayName: string;
  /** Description */
  description: string;
  /** Token limit for this profile */
  maxTokens: number;
  /** Whether this is a fast profile */
  fast: boolean;
  /** Whether this is a budget profile */
  budget: boolean;
  /** Priority level */
  priority: ProfilePriority;
  /** Provider (anthropic, zai) */
  provider: 'anthropic' | 'zai';
}

// Default profile configurations
const PROFILES: Record<ModelProfile, ProfileConfig> = {
  haiku: {
    model: 'claude-haiku-4-5',
    displayName: 'Claude Haiku 4.5',
    description: 'Fast & cheap Anthropic - Quick tasks',
    maxTokens: 8192,
    fast: true,
    budget: true,
    priority: 'budget',
    provider: 'anthropic',
  },
  sonnet: {
    model: 'claude-sonnet-4-5',
    displayName: 'Claude Sonnet 4.5',
    description: 'Balanced Anthropic model',
    maxTokens: 16384,
    fast: false,
    budget: false,
    priority: 'balanced',
    provider: 'anthropic',
  },
  opus: {
    model: 'claude-opus-4-6',
    displayName: 'Claude Opus 4.6',
    description: 'Best Anthropic model - Complex tasks',
    maxTokens: 32768,
    fast: false,
    budget: false,
    priority: 'quality',
    provider: 'anthropic',
  },
  'zai': {
    model: 'glm-5',
    displayName: 'Z.ai GLM-5',
    description: 'State-of-the-art Chinese model (GLM-5)',
    maxTokens: 32768,
    fast: false,
    budget: false,
    priority: 'quality',
    provider: 'zai',
  },
  'zai-flash': {
    model: 'glm-5-flash',
    displayName: 'Z.ai GLM-5 Flash',
    description: 'Ultra-fast GLM-5 for quick tasks',
    maxTokens: 8192,
    fast: true,
    budget: true,
    priority: 'budget',
    provider: 'zai',
  },
  'zai-swarm': {
    model: 'glm-5-swarm',
    displayName: 'Z.ai GLM-5 Mega Swarm',
    description: 'Maximum performance swarm mode (100 agents)',
    maxTokens: 65536,
    fast: false,
    budget: false,
    priority: 'quality',
    provider: 'zai',
  },
  'zai-legacy': {
    model: 'glm-4-7',
    displayName: 'Z.ai GLM-4.7',
    description: 'Previous generation Chinese model - Still capable',
    maxTokens: 16384,
    fast: false,
    budget: false,
    priority: 'balanced',
    provider: 'zai',
  },
  'zai-legacy-flash': {
    model: 'glm-4-7-flash',
    displayName: 'Z.ai GLM-4.7 Flash',
    description: 'Fast GLM-4.7 for quick tasks',
    maxTokens: 8192,
    fast: true,
    budget: true,
    priority: 'budget',
    provider: 'zai',
  },
};

// Agent type to model mapping (based on GSI agent requirements)
const AGENT_MODEL_MAP: Record<string, Record<ProfilePriority, ModelProfile>> = {
  'gsi-planner': { quality: 'opus', balanced: 'opus', budget: 'sonnet' },
  'gsi-roadmapper': { quality: 'opus', balanced: 'sonnet', budget: 'sonnet' },
  'gsi-executor': { quality: 'opus', balanced: 'sonnet', budget: 'sonnet' },
  'gsi-phase-researcher': { quality: 'opus', balanced: 'sonnet', budget: 'haiku' },
  'gsi-project-researcher': { quality: 'opus', balanced: 'sonnet', budget: 'haiku' },
  'gsi-research-synthesizer': { quality: 'sonnet', balanced: 'sonnet', budget: 'haiku' },
  'gsi-debugger': { quality: 'opus', balanced: 'sonnet', budget: 'sonnet' },
  'gsi-codebase-mapper': { quality: 'sonnet', balanced: 'haiku', budget: 'haiku' },
  'gsi-verifier': { quality: 'sonnet', balanced: 'sonnet', budget: 'haiku' },
  'gsi-plan-checker': { quality: 'sonnet', balanced: 'sonnet', budget: 'haiku' },
  'gsi-integration-checker': { quality: 'sonnet', balanced: 'sonnet', budget: 'haiku' },
};

/**
 * Profile Manager
 * 
 * Manages model profiles and provides profile resolution for agents.
 */
export class ProfileManager {
  private currentProfile: ModelProfile = 'balanced' as unknown as ModelProfile;
  private customProfiles: Map<string, ProfileConfig> = new Map();

  constructor() {
    // Default to sonnet (balanced profile)
    this.currentProfile = 'sonnet';
  }

  /**
   * Get all available profiles
   */
  getAvailableProfiles(): ModelProfile[] {
    return Object.keys(PROFILES) as ModelProfile[];
  }

  /**
   * Get profile configuration
   */
  getProfileConfig(profile: ModelProfile): ProfileConfig | undefined {
    // Check custom profiles first
    if (this.customProfiles.has(profile)) {
      return this.customProfiles.get(profile);
    }
    return PROFILES[profile];
  }

  /**
   * Get current profile
   */
  getCurrentProfile(): ModelProfile {
    return this.currentProfile;
  }

  /**
   * Set current profile
   */
  setProfile(profile: ModelProfile): void {
    if (!PROFILES[profile] && !this.customProfiles.has(profile)) {
      throw new Error(`Unknown profile: ${profile}`);
    }
    this.currentProfile = profile;
  }

  /**
   * Get model identifier for a profile
   */
  getModelForProfile(profile: ModelProfile): string {
    const config = this.getProfileConfig(profile);
    if (!config) {
      throw new Error(`Unknown profile: ${profile}`);
    }
    return config.model;
  }

  /**
   * Get model for an agent based on priority
   */
  getModelForAgent(agentType: string, priority: ProfilePriority = 'balanced'): string {
    const normalizedAgent = agentType.toLowerCase().replace(/[_\s]/g, '-');
    const agentMapping = AGENT_MODEL_MAP[normalizedAgent];
    
    if (!agentMapping) {
      // Default to current profile for unknown agents
      return this.getModelForProfile(this.currentProfile);
    }

    const profile = agentMapping[priority];
    return this.getModelForProfile(profile);
  }

  /**
   * Resolve model from various inputs
   */
  resolveModel(options: {
    profile?: ModelProfile;
    agentType?: string;
    priority?: ProfilePriority;
    explicitModel?: string;
  }): string {
    // Explicit model takes precedence
    if (options.explicitModel) {
      return options.explicitModel;
    }

    // Explicit profile
    if (options.profile) {
      return this.getModelForProfile(options.profile);
    }

    // Agent-based resolution
    if (options.agentType) {
      return this.getModelForAgent(options.agentType, options.priority || 'balanced');
    }

    // Default to current profile
    return this.getModelForProfile(this.currentProfile);
  }

  /**
   * Register a custom profile
   */
  registerCustomProfile(name: string, config: ProfileConfig): void {
    this.customProfiles.set(name, config);
  }

  /**
   * Remove a custom profile
   */
  removeCustomProfile(name: string): boolean {
    return this.customProfiles.delete(name);
  }

  /**
   * Check if a profile is fast
   */
  isFastProfile(profile: ModelProfile): boolean {
    const config = this.getProfileConfig(profile);
    return config?.fast ?? false;
  }

  /**
   * Check if a profile is budget-friendly
   */
  isBudgetProfile(profile: ModelProfile): boolean {
    const config = this.getProfileConfig(profile);
    return config?.budget ?? false;
  }

  /**
   * Get all profiles by provider
   */
  getProfilesByProvider(provider: 'anthropic' | 'zai'): ModelProfile[] {
    return Object.entries(PROFILES)
      .filter(([, config]) => config.provider === provider)
      .map(([name]) => name as ModelProfile);
  }

  /**
   * Get recommended profile for a task type
   */
  getRecommendedProfile(taskType: 'planning' | 'execution' | 'research' | 'verification' | 'debug'): ModelProfile {
    const recommendations: Record<string, ModelProfile> = {
      planning: 'opus',
      execution: 'sonnet',
      research: 'sonnet',
      verification: 'haiku',
      debug: 'opus',
    };
    return recommendations[taskType] || 'sonnet';
  }
}

// Singleton instance
let defaultManager: ProfileManager | null = null;

/**
 * Get the default profile manager
 */
export function getProfileManager(): ProfileManager {
  if (!defaultManager) {
    defaultManager = new ProfileManager();
  }
  return defaultManager;
}

/**
 * Get current profile (convenience function)
 */
export function getCurrentProfile(): ModelProfile {
  return getProfileManager().getCurrentProfile();
}

/**
 * Set profile (convenience function)
 */
export function setProfile(profile: ModelProfile): void {
  getProfileManager().setProfile(profile);
}

/**
 * Get available profiles (convenience function)
 */
export function getAvailableProfiles(): ModelProfile[] {
  return getProfileManager().getAvailableProfiles();
}
