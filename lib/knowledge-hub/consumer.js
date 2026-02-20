/**
 * Knowledge Consumer
 * 
 * Consumes knowledge from the hub for various purposes:
 * - prompt-enhancer: Uses patterns to enhance prompts
 * - complexity-predictor: Uses metrics to predict complexity
 * - gsi-planner: Uses decisions to inform planning
 * - gsi-executor: Uses patterns for implementation guidance
 * 
 * @module lib/knowledge-hub/consumer
 */

const EventEmitter = require('events');

/**
 * Consumer types
 */
const CONSUMER_TYPES = {
  PROMPT_ENHANCER: 'prompt-enhancer',
  COMPLEXITY_PREDICTOR: 'complexity-predictor',
  PLANNER: 'gsi-planner',
  EXECUTOR: 'gsi-executor',
  VERIFIER: 'gsi-verifier'
};

/**
 * Subscription filters
 */
const SUBSCRIPTION_FILTERS = {
  PATTERNS_ONLY: { type: 'pattern' },
  SOLUTIONS_ONLY: { type: 'solution' },
  INSIGHTS_ONLY: { type: 'insight' },
  DECISIONS_ONLY: { type: 'decision' },
  METRICS_ONLY: { type: 'metric' },
  ALL: {}
};

/**
 * Knowledge Consumer Class
 * Subscribes to and processes knowledge from the hub
 */
class KnowledgeConsumer extends EventEmitter {
  constructor(type, config = {}) {
    super();
    this.type = type;
    this.config = config;
    this.subscriptions = [];
    this.knowledgeBase = [];
    this.maxKnowledgeSize = config.maxKnowledgeSize || 1000;
  }
  
  /**
   * Subscribe to knowledge from the hub
   * @param {object} filter - Filter criteria
   * @param {function} handler - Handler function
   */
  subscribe(filter, handler) {
    const subscription = {
      id: `${this.type}-${Date.now()}`,
      filter,
      handler,
      active: true
    };
    
    this.subscriptions.push(subscription);
    
    return {
      unsubscribe: () => {
        subscription.active = false;
        this.subscriptions = this.subscriptions.filter(s => s.id !== subscription.id);
      }
    };
  }
  
  /**
   * Process incoming knowledge
   * @param {object} knowledge - Knowledge from producer
   */
  process(knowledge) {
    // Check if knowledge matches any subscription
    for (const sub of this.subscriptions) {
      if (!sub.active) continue;
      
      if (this.matchesFilter(knowledge, sub.filter)) {
        sub.handler(knowledge);
      }
    }
    
    // Store in knowledge base
    this.store(knowledge);
    
    // Emit processed event
    this.emit('processed', knowledge);
  }
  
  /**
   * Check if knowledge matches filter
   * @param {object} knowledge - Knowledge to check
   * @param {object} filter - Filter criteria
   * @returns {boolean} Match result
   */
  matchesFilter(knowledge, filter) {
    if (Object.keys(filter).length === 0) return true;
    
    for (const [key, value] of Object.entries(filter)) {
      if (knowledge[key] !== value) return false;
    }
    
    return true;
  }
  
  /**
   * Store knowledge in local base
   * @param {object} knowledge - Knowledge to store
   */
  store(knowledge) {
    this.knowledgeBase.push(knowledge);
    
    // Prune if too large
    if (this.knowledgeBase.length > this.maxKnowledgeSize) {
      this.knowledgeBase.shift();
    }
  }
  
  /**
   * Query knowledge base
   * @param {object} query - Query criteria
   * @returns {Array} Matching knowledge
   */
  query(query) {
    return this.knowledgeBase.filter(k => this.matchesFilter(k, query));
  }
  
  /**
   * Get patterns for context
   * @param {string} context - Context description
   * @returns {Array} Relevant patterns
   */
  getPatternsForContext(context) {
    return this.query({ type: 'pattern' })
      .filter(k => this.contextMatches(k.data.context, context));
  }
  
  /**
   * Check if pattern context matches
   * @param {object} patternContext - Pattern's context
   * @param {string} targetContext - Target context
   * @returns {boolean} Match result
   */
  contextMatches(patternContext, targetContext) {
    if (!patternContext) return true;
    
    const keywords = targetContext.toLowerCase().split(/\s+/);
    const patternKeywords = Object.values(patternContext)
      .join(' ')
      .toLowerCase()
      .split(/\s+/);
    
    return keywords.some(kw => patternKeywords.includes(kw));
  }
  
  /**
   * Get consumer stats
   * @returns {object} Stats
   */
  getStats() {
    return {
      type: this.type,
      subscriptionCount: this.subscriptions.length,
      knowledgeSize: this.knowledgeBase.length,
      knowledgeByType: this.getKnowledgeByType()
    };
  }
  
  /**
   * Get knowledge counts by type
   * @returns {object} Counts by type
   */
  getKnowledgeByType() {
    const counts = {};
    for (const k of this.knowledgeBase) {
      counts[k.type] = (counts[k.type] || 0) + 1;
    }
    return counts;
  }
}

/**
 * Prompt Enhancer Consumer
 * Uses patterns and insights to enhance prompts
 */
class PromptEnhancerConsumer extends KnowledgeConsumer {
  constructor() {
    super(CONSUMER_TYPES.PROMPT_ENHANCER);
    
    // Subscribe to patterns and solutions
    this.subscribe({ type: 'pattern' }, (k) => this.onPattern(k));
    this.subscribe({ type: 'solution' }, (k) => this.onSolution(k));
  }
  
  /**
   * Handle pattern knowledge
   * @param {object} knowledge - Pattern knowledge
   */
  onPattern(knowledge) {
    this.emit('enhancement-available', {
      type: 'pattern',
      name: knowledge.data.name,
      usage: knowledge.data.context
    });
  }
  
  /**
   * Handle solution knowledge
   * @param {object} knowledge - Solution knowledge
   */
  onSolution(knowledge) {
    this.emit('enhancement-available', {
      type: 'solution',
      problem: knowledge.data.problem,
      solution: knowledge.data.solution
    });
  }
  
  /**
   * Enhance a prompt with relevant knowledge
   * @param {string} prompt - Original prompt
   * @param {object} context - Context
   * @returns {string} Enhanced prompt
   */
  enhancePrompt(prompt, context = {}) {
    const patterns = this.getPatternsForContext(context.description || prompt);
    const enhancements = [];
    
    for (const p of patterns.slice(0, 3)) {
      enhancements.push(`Consider pattern: ${p.data.name}`);
    }
    
    if (enhancements.length > 0) {
      return `${prompt}\n\nSuggested patterns:\n${enhancements.join('\n')}`;
    }
    
    return prompt;
  }
}

/**
 * Complexity Predictor Consumer
 * Uses metrics to predict task complexity
 */
class ComplexityPredictorConsumer extends KnowledgeConsumer {
  constructor() {
    super(CONSUMER_TYPES.COMPLEXITY_PREDICTOR);
    
    // Subscribe to metrics
    this.subscribe({ type: 'metric' }, (k) => this.onMetric(k));
    this.subscribe({ type: 'solution' }, (k) => this.onSolution(k));
    
    this.metrics = {
      avgCompletionTime: 0,
      avgFilesModified: 0,
      commonPatterns: [],
      riskFactors: []
    };
  }
  
  /**
   * Handle metric knowledge
   * @param {object} knowledge - Metric knowledge
   */
  onMetric(knowledge) {
    const { name, value } = knowledge.data;
    
    if (name === 'completion_time') {
      this.updateAverage('avgCompletionTime', value);
    } else if (name === 'files_modified') {
      this.updateAverage('avgFilesModified', value);
    }
  }
  
  /**
   * Handle solution knowledge
   * @param {object} knowledge - Solution knowledge
   */
  onSolution(knowledge) {
    // Track solutions with multiple attempts as risk factors
    if (knowledge.data.evidence.attempts?.length > 2) {
      this.metrics.riskFactors.push({
        problem: knowledge.data.problem,
        attemptCount: knowledge.data.evidence.attempts.length
      });
    }
  }
  
  /**
   * Update running average
   * @param {string} key - Metric key
   * @param {number} value - New value
   */
  updateAverage(key, value) {
    const current = this.metrics[key];
    const count = this.knowledgeBase.filter(k => k.type === 'metric').length;
    this.metrics[key] = (current * (count - 1) + value) / count;
  }
  
  /**
   * Predict complexity for a task
   * @param {object} task - Task description
   * @returns {object} Complexity prediction
   */
  predict(task) {
    const factors = [];
    let score = 0;
    
    // Check for risk factors
    for (const risk of this.metrics.riskFactors) {
      if (task.description?.toLowerCase().includes(risk.problem.toLowerCase())) {
        factors.push(`Similar to problematic task: ${risk.problem}`);
        score += risk.attemptCount * 10;
      }
    }
    
    // Estimate based on file count
    if (task.files?.length > 3) {
      factors.push(`High file count: ${task.files.length}`);
      score += (task.files.length - 3) * 5;
    }
    
    // Normalize score
    const normalizedScore = Math.min(Math.max(score / 100, 0), 1);
    
    return {
      score: normalizedScore,
      level: this.getComplexityLevel(normalizedScore),
      factors,
      recommendation: this.getRecommendation(normalizedScore)
    };
  }
  
  /**
   * Get complexity level from score
   * @param {number} score - Score (0-1)
   * @returns {string} Level
   */
  getComplexityLevel(score) {
    if (score < 0.3) return 'simple';
    if (score < 0.6) return 'moderate';
    if (score < 0.8) return 'complex';
    return 'very-complex';
  }
  
  /**
   * Get recommendation based on complexity
   * @param {number} score - Score (0-1)
   * @returns {string} Recommendation
   */
  getRecommendation(score) {
    if (score < 0.3) return 'Single plan, 2-3 tasks';
    if (score < 0.6) return '2-3 plans, parallel where possible';
    if (score < 0.8) return 'Multiple sequential plans, consider checkpoints';
    return 'Comprehensive planning, checkpoints required';
  }
}

/**
 * Planner Consumer
 * Uses decisions and patterns for planning
 */
class PlannerConsumer extends KnowledgeConsumer {
  constructor() {
    super(CONSUMER_TYPES.PLANNER);
    
    this.decisions = [];
    this.patterns = [];
    
    this.subscribe({ type: 'decision' }, (k) => this.onDecision(k));
    this.subscribe({ type: 'pattern' }, (k) => this.onPattern(k));
  }
  
  /**
   * Handle decision knowledge
   * @param {object} knowledge - Decision knowledge
   */
  onDecision(knowledge) {
    this.decisions.push({
      decision: knowledge.data.decision,
      rationale: knowledge.data.rationale,
      timestamp: knowledge.metadata.timestamp
    });
  }
  
  /**
   * Handle pattern knowledge
   * @param {object} knowledge - Pattern knowledge
   */
  onPattern(knowledge) {
    this.patterns.push({
      name: knowledge.data.name,
      pattern: knowledge.data.pattern,
      context: knowledge.data.context
    });
  }
  
  /**
   * Get relevant decisions for planning
   * @param {string} phaseType - Phase type
   * @returns {Array} Relevant decisions
   */
  getRelevantDecisions(phaseType) {
    return this.decisions.filter(d => 
      d.decision.toLowerCase().includes(phaseType.toLowerCase())
    );
  }
  
  /**
   * Get applicable patterns for phase
   * @param {string} phaseType - Phase type
   * @returns {Array} Applicable patterns
   */
  getApplicablePatterns(phaseType) {
    return this.patterns.filter(p =>
      p.context?.phaseType === phaseType ||
      p.context?.appliesTo?.includes(phaseType)
    );
  }
}

module.exports = {
  KnowledgeConsumer,
  PromptEnhancerConsumer,
  ComplexityPredictorConsumer,
  PlannerConsumer,
  CONSUMER_TYPES,
  SUBSCRIPTION_FILTERS
};
