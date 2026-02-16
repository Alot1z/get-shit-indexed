/**
 * GSI Enhancement Orchestrator
 * 
 * Connects all GSI features for mutual enhancement.
 * Coordinates before/during/after operation enhancements.
 */

const {
  getRegistry,
  getFeatureConnections,
  getEnhancementOpportunities
} = require('./feature-registry');

// Import feature modules (lazy loading for circular dependency avoidance)
let thinkingOrchestrator = null;
let patternPredictor = null;
let reflectionCapture = null;

function loadThinkingOrchestrator() {
  if (!thinkingOrchestrator) {
    try {
      thinkingOrchestrator = require('../thinking/orchestrator');
    } catch (e) {
      // Module not available
    }
  }
  return thinkingOrchestrator;
}

function loadPatternPredictor() {
  if (!patternPredictor) {
    try {
      patternPredictor = require('../pattern-learning/predictor');
    } catch (e) {
      // Module not available
    }
  }
  return patternPredictor;
}

function loadReflectionCapture() {
  if (!reflectionCapture) {
    try {
      reflectionCapture = require('../reflection/capture');
    } catch (e) {
      // Module not available
    }
  }
  return reflectionCapture;
}

/**
 * Enhancement priority levels
 */
const PRIORITY = {
  CRITICAL: 100,
  HIGH: 75,
  MEDIUM: 50,
  LOW: 25,
  OPTIONAL: 10
};

/**
 * Enhancement phase types
 */
const PHASE = {
  BEFORE: 'before',
  DURING: 'during',
  AFTER: 'after'
};

/**
 * Enhancement Orchestrator class
 */
class EnhancementOrchestrator {
  constructor() {
    this.registry = getRegistry();
    this.enhancementHistory = [];
    this.metrics = {
      enhancementsApplied: 0,
      enhancementsSkipped: 0,
      tokenSavings: 0,
      errors: 0
    };
  }

  /**
   * Enhance an operation with all applicable features
   * @param {string} operation Operation name
   * @param {Object} context Operation context
   * @param {Function} operationFn The actual operation function
   * @returns {Promise<Object>} Enhanced operation result
   */
  async enhanceWithFeatures(operation, context, operationFn) {
    const startTime = Date.now();
    const result = {
      operation,
      phases: {},
      result: null,
      enhancements: [],
      metrics: { duration: 0, tokenSavings: 0 }
    };

    try {
      // BEFORE phase: Pre-operation enhancements
      result.phases.before = await this.beforeOperation(operation, context);
      result.enhancements.push(...result.phases.before.enhancements);

      // Merge before-phase context
      const enhancedContext = {
        ...context,
        ...result.phases.before.context,
        predictions: result.phases.before.predictions,
        thinking: result.phases.before.thinking
      };

      // DURING phase: Execute with optimal tools
      result.phases.during = await this.duringOperation(operation, enhancedContext, operationFn);
      result.result = result.phases.during.result;
      result.enhancements.push(...result.phases.during.enhancements);

      // AFTER phase: Capture and learn
      result.phases.after = await this.afterOperation(operation, enhancedContext, result.result);
      result.enhancements.push(...result.phases.after.enhancements);

    } catch (error) {
      result.error = error.message;
      this.metrics.errors++;
    }

    result.metrics.duration = Date.now() - startTime;
    result.metrics.tokenSavings = this.calculateTokenSavings(result.enhancements);

    // Record in history
    this.enhancementHistory.push({
      timestamp: new Date().toISOString(),
      operation,
      enhancementCount: result.enhancements.length,
      duration: result.metrics.duration,
      tokenSavings: result.metrics.tokenSavings
    });

    // Keep history limited
    if (this.enhancementHistory.length > 100) {
      this.enhancementHistory.shift();
    }

    return result;
  }

  /**
   * Before operation enhancements
   * @param {string} operation Operation name
   * @param {Object} context Operation context
   * @returns {Promise<Object>} Before-phase result
   */
  async beforeOperation(operation, context) {
    const result = {
      enhancements: [],
      context: {},
      predictions: null,
      thinking: null
    };

    // 1. Check pattern predictions
    const predictor = loadPatternPredictor();
    if (predictor) {
      try {
        const prediction = await predictor.predictNextOperation(context.recentOperations || []);
        if (prediction) {
          result.predictions = prediction;
          result.enhancements.push({
            feature: 'patterns',
            phase: PHASE.BEFORE,
            type: 'prediction',
            value: prediction,
            priority: PRIORITY.MEDIUM
          });
        }
      } catch (e) {
        // Predictor failed, continue without
      }
    }

    // 2. Trigger thinking if needed
    const thinking = loadThinkingOrchestrator();
    if (thinking && this.shouldThink(operation, context)) {
      try {
        const thinkingResult = await thinking.thinkBeforeTool(operation, {
          ...context,
          predictions: result.predictions
        });
        result.thinking = thinkingResult;
        result.enhancements.push({
          feature: 'thinking',
          phase: PHASE.BEFORE,
          type: 'cognitive',
          value: thinkingResult,
          priority: PRIORITY.HIGH
        });
      } catch (e) {
        // Thinking failed, continue without
      }
    }

    // 3. Get enhancement opportunities
    const opportunities = getEnhancementOpportunities(operation, context);
    for (const opp of opportunities) {
      result.enhancements.push({
        feature: opp.feature,
        phase: PHASE.BEFORE,
        type: 'opportunity',
        reason: opp.reason,
        priority: PRIORITY[opp.priority.toUpperCase()] || PRIORITY.MEDIUM
      });
    }

    return result;
  }

  /**
   * During operation enhancements
   * @param {string} operation Operation name
   * @param {Object} context Operation context
   * @param {Function} operationFn Operation function
   * @returns {Promise<Object>} During-phase result
   */
  async duringOperation(operation, context, operationFn) {
    const result = {
      enhancements: [],
      result: null
    };

    // Execute the operation
    if (operationFn) {
      try {
        result.result = await operationFn(context);
      } catch (e) {
        result.result = { error: e.message };
      }
    }

    // Track MCP tool usage for token savings
    if (context.usedMCP) {
      result.enhancements.push({
        feature: 'mcp',
        phase: PHASE.DURING,
        type: 'tool-optimization',
        value: `Used MCP tools for ${operation}`,
        priority: PRIORITY.HIGH,
        tokenSavings: context.estimatedTokens * 0.8 // 80% savings
      });
    }

    return result;
  }

  /**
   * After operation enhancements
   * @param {string} operation Operation name
   * @param {Object} context Operation context
   * @param {Object} operationResult Operation result
   * @returns {Promise<Object>} After-phase result
   */
  async afterOperation(operation, context, operationResult) {
    const result = {
      enhancements: [],
      patterns: null,
      reflection: null
    };

    // 1. Capture reflection
    const reflection = loadReflectionCapture();
    if (reflection) {
      try {
        const reflectionResult = await reflection.captureReflection({
          tool: operation,
          input: context,
          output: operationResult,
          timestamp: new Date().toISOString()
        });
        result.reflection = reflectionResult;
        result.enhancements.push({
          feature: 'reflection',
          phase: PHASE.AFTER,
          type: 'capture',
          value: reflectionResult,
          priority: PRIORITY.LOW
        });
      } catch (e) {
        // Reflection failed, continue without
      }
    }

    // 2. Record for pattern learning
    const predictor = loadPatternPredictor();
    if (predictor && operationResult) {
      try {
        await predictor.recordOperation({
          operation,
          context,
          result: operationResult,
          success: !operationResult.error
        });
        result.enhancements.push({
          feature: 'patterns',
          phase: PHASE.AFTER,
          type: 'learning',
          value: 'Recorded for pattern analysis',
          priority: PRIORITY.LOW
        });
      } catch (e) {
        // Recording failed, continue without
      }
    }

    // 3. Trigger thinking after tool
    const thinking = loadThinkingOrchestrator();
    if (thinking && this.shouldReflect(operation, context, operationResult)) {
      try {
        const thinkingResult = await thinking.thinkAfterTool(operation, operationResult, context);
        result.enhancements.push({
          feature: 'thinking',
          phase: PHASE.AFTER,
          type: 'reflection',
          value: thinkingResult,
          priority: PRIORITY.MEDIUM
        });
      } catch (e) {
        // Thinking failed, continue without
      }
    }

    return result;
  }

  /**
   * Determine if thinking should be triggered
   * @param {string} operation Operation name
   * @param {Object} context Context
   * @returns {boolean} Should think
   */
  shouldThink(operation, context) {
    // Check complexity
    if (context.complexity && context.complexity > 30) {
      return true;
    }

    // Check for new/complex operations
    const complexOperations = ['plan-phase', 'execute-plan', 'map-codebase'];
    if (complexOperations.includes(operation)) {
      return true;
    }

    // Check for error state
    if (context.hasError || context.previousError) {
      return true;
    }

    return false;
  }

  /**
   * Determine if reflection should be captured
   * @param {string} operation Operation name
   * @param {Object} context Context
   * @param {Object} result Operation result
   * @returns {boolean} Should reflect
   */
  shouldReflect(operation, context, result) {
    // Always reflect on errors
    if (result && result.error) {
      return true;
    }

    // Reflect on significant operations
    const significantOps = ['execute-plan', 'plan-phase'];
    if (significantOps.includes(operation)) {
      return true;
    }

    return false;
  }

  /**
   * Get available enhancements for an operation
   * @param {string} operation Operation name
   * @returns {Array} Available enhancements
   */
  getEnhancements(operation) {
    const enhancements = [];
    const connections = getFeatureConnections();

    // Map connections to enhancements
    for (const conn of connections) {
      enhancements.push({
        source: conn.from,
        target: conn.to,
        type: conn.type,
        description: conn.description,
        applicable: this.isEnhancementApplicable(conn, operation)
      });
    }

    return enhancements.filter(e => e.applicable);
  }

  /**
   * Check if enhancement is applicable
   * @param {Object} enhancement Enhancement definition
   * @param {string} operation Operation name
   * @returns {boolean} Is applicable
   */
  isEnhancementApplicable(enhancement, operation) {
    // MCP applies to all operations
    if (enhancement.from === 'mcp') {
      return true;
    }

    // Thinking applies to complex operations
    if (enhancement.to === 'thinking') {
      const complexOps = ['plan-phase', 'execute-plan', 'map-codebase', 'research'];
      return complexOps.some(op => operation.includes(op));
    }

    // Patterns apply to repeated operations
    if (enhancement.from === 'patterns') {
      return true;
    }

    // Reflection applies to post-tool
    if (enhancement.from === 'reflection') {
      return operation.includes('post') || operation.includes('after');
    }

    return false;
  }

  /**
   * Calculate token savings from enhancements
   * @param {Array} enhancements Applied enhancements
   * @returns {number} Estimated token savings
   */
  calculateTokenSavings(enhancements) {
    let savings = 0;

    for (const enhancement of enhancements) {
      if (enhancement.tokenSavings) {
        savings += enhancement.tokenSavings;
      } else if (enhancement.feature === 'mcp') {
        // Default MCP savings: 80%
        savings += 1000; // Assume 1000 tokens saved per MCP operation
      } else if (enhancement.feature === 'patterns') {
        // Patterns prevent re-exploration
        savings += 500;
      }
    }

    return savings;
  }

  /**
   * Get enhancement metrics
   * @returns {Object} Metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      historySize: this.enhancementHistory.length,
      recentEnhancements: this.enhancementHistory.slice(-10)
    };
  }
}

// Singleton instance
let orchestratorInstance = null;

/**
 * Get the enhancement orchestrator singleton
 * @returns {EnhancementOrchestrator}
 */
function getOrchestrator() {
  if (!orchestratorInstance) {
    orchestratorInstance = new EnhancementOrchestrator();
  }
  return orchestratorInstance;
}

/**
 * Enhance an operation with all features
 * @param {string} operation Operation name
 * @param {Object} context Context
 * @param {Function} fn Operation function
 * @returns {Promise<Object>} Enhanced result
 */
async function enhanceWithFeatures(operation, context, fn) {
  return getOrchestrator().enhanceWithFeatures(operation, context, fn);
}

/**
 * Get enhancements for an operation
 * @param {string} operation Operation name
 * @returns {Array} Enhancements
 */
function getEnhancements(operation) {
  return getOrchestrator().getEnhancements(operation);
}

module.exports = {
  EnhancementOrchestrator,
  getOrchestrator,
  enhanceWithFeatures,
  getEnhancements,
  PRIORITY,
  PHASE
};
