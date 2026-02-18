/**
 * GSI Feature Registry
 * 
 * Central registry for all GSI features and their capabilities.
 * Enables cross-feature enhancement and discovery.
 */

const fs = require('fs');
const path = require('path');

// Feature definitions
const FEATURES = {
  thinking: {
    name: 'Thinking System',
    description: 'Multi-server thinking with Sequential, Tractatus, and Debug',
    servers: ['sequential-thinking', 'tractatus-thinking', 'debug-thinking'],
    capabilities: {
      decompose: { server: 'sequential', description: 'Multi-step problem decomposition' },
      analyze: { server: 'tractatus', description: 'Logical structure analysis' },
      debug: { server: 'debug', description: 'Graph-based problem solving' }
    },
    triggers: ['complexity > 30', 'new task', 'error state'],
    location: 'lib/thinking/',
    status: 'active'
  },

  patterns: {
    name: 'Pattern Learning',
    description: 'Operation pattern recognition and prediction',
    servers: [],
    capabilities: {
      predict: { description: 'Predict next operations' },
      learn: { description: 'Learn from operation sequences' },
      visualize: { description: 'Generate pattern diagrams' }
    },
    triggers: ['5+ operations', 'repeated sequences'],
    storage: '.planning/patterns/',
    location: 'lib/pattern-learning/',
    status: 'active'
  },

  mcp: {
    name: 'MCP Tools',
    description: 'Model Context Protocol tool coordination',
    servers: ['desktop-commander', 'code-index-mcp'],
    capabilities: {
      fileOps: { server: 'dc', description: 'File operations (80-90% token savings)' },
      codeSearch: { server: 'ci', description: 'Indexed code search' },
      symbolExtraction: { server: 'ci', description: 'Symbol body extraction (85% token savings)' }
    },
    triggers: ['file read/write', 'code search', 'symbol extraction'],
    location: 'Multiple MCP servers',
    status: 'active'
  },

  reflection: {
    name: 'Reflection System',
    description: 'Post-operation reflection and insight capture',
    servers: ['debug-thinking'],
    capabilities: {
      capture: { description: 'Capture operation outcomes' },
      patterns: { description: 'Extract patterns from results' },
      insights: { description: 'Generate improvement insights' }
    },
    triggers: ['post-tool', 'error', 'success pattern'],
    storage: '.debug-thinking-mcp/reflections/',
    location: 'lib/reflection/',
    status: 'active'
  },

  complexity: {
    name: 'Complexity Prediction',
    description: 'Pre-execution complexity scoring and auto-split',
    servers: ['sequential-thinking', 'tractatus-thinking', 'debug-thinking'],
    capabilities: {
      score: { description: 'Calculate operation complexity' },
      autoSplit: { description: 'Auto-split high-complexity plans' },
      adapt: { description: 'Adapt thresholds from history' }
    },
    triggers: ['pre-tool', 'plan execution'],
    thresholds: { warn: 40, split: 60 },
    location: 'lib/complexity/',
    status: 'active'
  },

  commandThinking: {
    name: 'Command Thinking',
    description: 'Cognitive enhancement for CLI commands',
    servers: ['sequential-thinking', 'tractatus-thinking', 'debug-thinking'],
    capabilities: {
      wrap: { description: 'Wrap commands with thinking' },
      inject: { description: 'Inject thinking context' },
      metrics: { description: 'Track command thinking metrics' }
    },
    modes: ['COMPREHENSIVE', 'STANDARD', 'LIGHTWEIGHT', 'NONE'],
    location: 'lib/command-thinking/',
    status: 'active'
  },

  workflowThinking: {
    name: 'Workflow Thinking',
    description: 'Structured thinking phases for workflows',
    servers: ['sequential-thinking', 'tractatus-thinking', 'debug-thinking'],
    capabilities: {
      validate: { description: 'Validate workflow thinking phases' },
      inject: { description: 'Inject thinking into workflow steps' }
    },
    phases: ['PRE_WORKFLOW', 'PRE_STEP', 'POST_STEP', 'POST_WORKFLOW'],
    location: 'lib/workflow-thinking/',
    status: 'active'
  },

  gsdIntegration: {
    name: 'GSD Update Integration',
    description: 'GSD upstream monitoring and integration',
    servers: [],
    capabilities: {
      checkUpdates: { description: 'Check for GSD updates' },
      analyze: { description: 'Analyze change impact' },
      suggest: { description: 'Generate integration suggestions' }
    },
    triggers: ['scheduled', 'manual'],
    location: 'lib/gsi-integration/',
    status: 'active'
  }
};

/**
 * Feature Registry class
 */
class FeatureRegistry {
  constructor() {
    this.features = { ...FEATURES };
    this.healthStatus = new Map();
    this.lastHealthCheck = null;
  }

  /**
   * Get all registered features
   * @returns {Object} Feature definitions
   */
  getAllFeatures() {
    return { ...this.features };
  }

  /**
   * Get a specific feature
   * @param {string} name Feature name
   * @returns {Object|null} Feature definition
   */
  getFeature(name) {
    return this.features[name] || null;
  }

  /**
   * Get features by capability
   * @param {string} capability Capability name
   * @returns {Array} Features with the capability
   */
  getFeaturesByCapability(capability) {
    return Object.entries(this.features)
      .filter(([_, feature]) => feature.capabilities && feature.capabilities[capability])
      .map(([name, feature]) => ({ name, ...feature }));
  }

  /**
   * Get features by server
   * @param {string} server MCP server name
   * @returns {Array} Features using the server
   */
  getFeaturesByServer(server) {
    return Object.entries(this.features)
      .filter(([_, feature]) => feature.servers && feature.servers.includes(server))
      .map(([name, feature]) => ({ name, ...feature }));
  }

  /**
   * Get all MCP servers used by features
   * @returns {Set} Unique server names
   */
  getAllServers() {
    const servers = new Set();
    for (const feature of Object.values(this.features)) {
      if (feature.servers) {
        feature.servers.forEach(s => servers.add(s));
      }
    }
    return servers;
  }

  /**
   * Get all capabilities across features
   * @returns {Object} Capabilities grouped by feature
   */
  getAllCapabilities() {
    const capabilities = {};
    for (const [name, feature] of Object.entries(this.features)) {
      if (feature.capabilities) {
        capabilities[name] = Object.keys(feature.capabilities);
      }
    }
    return capabilities;
  }

  /**
   * Check health of a feature
   * @param {string} name Feature name
   * @returns {Object} Health status
   */
  checkFeatureHealth(name) {
    const feature = this.features[name];
    if (!feature) {
      return { healthy: false, error: 'Feature not found' };
    }

    const issues = [];

    // Check if location exists (for file-based features)
    if (feature.location && feature.location.startsWith('lib/')) {
      const locPath = path.join(process.cwd(), feature.location);
      if (!fs.existsSync(locPath)) {
        issues.push(`Location not found: ${feature.location}`);
      }
    }

    // Check if storage exists (for storage-based features)
    if (feature.storage) {
      const storagePath = path.join(process.cwd(), feature.storage);
      if (!fs.existsSync(storagePath)) {
        issues.push(`Storage not found: ${feature.storage}`);
      }
    }

    return {
      healthy: issues.length === 0,
      issues,
      lastChecked: new Date().toISOString()
    };
  }

  /**
   * Check health of all features
   * @returns {Object} Health report
   */
  checkAllHealth() {
    const report = {
      timestamp: new Date().toISOString(),
      features: {},
      summary: { total: 0, healthy: 0, unhealthy: 0 }
    };

    for (const name of Object.keys(this.features)) {
      const health = this.checkFeatureHealth(name);
      report.features[name] = health;
      report.summary.total++;
      if (health.healthy) {
        report.summary.healthy++;
      } else {
        report.summary.unhealthy++;
      }
      this.healthStatus.set(name, health);
    }

    this.lastHealthCheck = report.timestamp;
    return report;
  }

  /**
   * Get feature connections (which features can enhance each other)
   * @returns {Array} Connection pairs
   */
  getFeatureConnections() {
    const connections = [];

    // Thinking enhances patterns (analysis)
    connections.push({
      from: 'thinking',
      to: 'patterns',
      type: 'analysis',
      description: 'Thinking analyzes pattern quality'
    });

    // Patterns enhance thinking (predictions)
    connections.push({
      from: 'patterns',
      to: 'thinking',
      type: 'prediction',
      description: 'Patterns predict optimal thinking approach'
    });

    // MCP enhances all (tools)
    for (const name of Object.keys(this.features)) {
      if (name !== 'mcp' && this.features[name].servers?.length > 0) {
        connections.push({
          from: 'mcp',
          to: name,
          type: 'tools',
          description: `MCP provides tools for ${name}`
        });
      }
    }

    // Reflection enhances patterns (learning)
    connections.push({
      from: 'reflection',
      to: 'patterns',
      type: 'learning',
      description: 'Reflection provides data for pattern learning'
    });

    // Complexity triggers thinking
    connections.push({
      from: 'complexity',
      to: 'thinking',
      type: 'trigger',
      description: 'High complexity triggers comprehensive thinking'
    });

    return connections;
  }

  /**
   * Register a new feature
   * @param {string} name Feature name
   * @param {Object} definition Feature definition
   */
  registerFeature(name, definition) {
    this.features[name] = {
      ...definition,
      status: definition.status || 'active'
    };
  }

  /**
   * Get enhancement opportunities for an operation
   * @param {string} operationType Operation type
   * @param {Object} context Operation context
   * @returns {Array} Applicable enhancements
   */
  getEnhancementOpportunities(operationType, context = {}) {
    const opportunities = [];

    // Check if thinking would help
    if (this.features.thinking.status === 'active') {
      if (context.complexity > 30 || context.isNewTask || context.hasError) {
        opportunities.push({
          feature: 'thinking',
          reason: 'Operation complexity or context suggests thinking',
          priority: context.complexity > 60 ? 'high' : 'medium'
        });
      }
    }

    // Check if pattern prediction available
    if (this.features.patterns.status === 'active') {
      opportunities.push({
        feature: 'patterns',
        reason: 'Check for predicted optimal approach',
        priority: 'medium'
      });
    }

    // Check if reflection should capture
    if (operationType === 'post-tool' && this.features.reflection.status === 'active') {
      opportunities.push({
        feature: 'reflection',
        reason: 'Capture operation outcome for learning',
        priority: 'low'
      });
    }

    return opportunities.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}

// Singleton instance
let registryInstance = null;

/**
 * Get the feature registry singleton
 * @returns {FeatureRegistry}
 */
function getRegistry() {
  if (!registryInstance) {
    registryInstance = new FeatureRegistry();
  }
  return registryInstance;
}

module.exports = {
  FeatureRegistry,
  FEATURES,
  getRegistry,
  // Convenience exports
  getAllFeatures: () => getRegistry().getAllFeatures(),
  getFeature: (name) => getRegistry().getFeature(name),
  getFeaturesByCapability: (cap) => getRegistry().getFeaturesByCapability(cap),
  getFeaturesByServer: (server) => getRegistry().getFeaturesByServer(server),
  checkAllHealth: () => getRegistry().checkAllHealth(),
  getFeatureConnections: () => getRegistry().getFeatureConnections(),
  getEnhancementOpportunities: (op, ctx) => getRegistry().getEnhancementOpportunities(op, ctx)
};
