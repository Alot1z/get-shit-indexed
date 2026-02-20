/**
 * Intervention Trigger
 * 
 * Defines conditions that trigger semantic interventions.
 * Maps triggers to appropriate intervention actions.
 */

// Trigger conditions and their thresholds
const TRIGGER_CONDITIONS = {
  highComplexity: {
    check: (ctx) => ctx.analysis?.complexity > 70,
    priority: 1,
    intervention: 'multi-path',
    reason: 'High complexity task benefits from multiple approaches'
  },
  
  highRisk: {
    check: (ctx) => ctx.analysis?.riskLevel === 'HIGH' || ctx.analysis?.riskLevel === 'EXTREME',
    priority: 1,
    intervention: 'multi-path',
    reason: 'High risk requires careful consideration of alternatives'
  },
  
  lowIntentConfidence: {
    check: (ctx) => ctx.analysis?.intent?.confidence < 0.4,
    priority: 2,
    intervention: 'clarification',
    reason: 'Unclear intent needs clarification'
  },
  
  multiFramework: {
    check: (ctx) => ctx.analysis?.frameworks?.length > 2,
    priority: 3,
    intervention: 'decomposition',
    reason: 'Multiple frameworks suggest decomposition needed'
  },
  
  securitySensitive: {
    check: (ctx) => ctx.analysis?.riskFactors?.some(f => f.factor === 'security_sensitive'),
    priority: 1,
    intervention: 'validation',
    reason: 'Security-sensitive operations require extra validation'
  },
  
  previousFailure: {
    check: (ctx) => ctx.previousAttempts?.some(a => !a.success),
    priority: 2,
    intervention: 'alternative',
    reason: 'Previous failure suggests trying alternative approach'
  },
  
  ambiguousRequest: {
    check: (ctx) => ctx.analysis?.riskFactors?.some(f => f.factor === 'ambiguity'),
    priority: 2,
    intervention: 'clarification',
    reason: 'Ambiguous requests need clarification'
  },
  
  largeScope: {
    check: (ctx) => ctx.estimatedFiles > 5 || ctx.estimatedTime > 30,
    priority: 3,
    intervention: 'decomposition',
    reason: 'Large scope benefits from decomposition'
  }
};

// Intervention action definitions
const INTERVENTION_ACTIONS = {
  'multi-path': {
    name: 'Multi-Path Reasoning',
    description: 'Explore multiple solution paths in parallel',
    requiresAlternatives: true,
    maxBranches: 3,
    execution: async (ctx, brancher) => {
      return await brancher.createBranches(
        ctx.prompt,
        ctx.analysis,
        { maxBranches: 3 }
      );
    }
  },
  
  'clarification': {
    name: 'Request Clarification',
    description: 'Ask user for clarification on ambiguous aspects',
    requiresAlternatives: false,
    execution: async (ctx) => {
      const questions = generateClarificationQuestions(ctx);
      return {
        type: 'clarification',
        questions,
        suggestions: ctx.analysis?.alternatives || []
      };
    }
  },
  
  'decomposition': {
    name: 'Task Decomposition',
    description: 'Break down complex task into smaller sub-tasks',
    requiresAlternatives: false,
    execution: async (ctx) => {
      const subTasks = decomposeTask(ctx);
      return {
        type: 'decomposition',
        subTasks,
        estimatedComplexity: ctx.analysis?.complexity / subTasks.length
      };
    }
  },
  
  'validation': {
    name: 'Enhanced Validation',
    description: 'Apply stricter validation rules',
    requiresAlternatives: false,
    execution: async (ctx) => {
      return {
        type: 'validation',
        rules: getEnhancedValidationRules(ctx),
        checkpoints: generateCheckpoints(ctx)
      };
    }
  },
  
  'alternative': {
    name: 'Alternative Approach',
    description: 'Try completely different approach',
    requiresAlternatives: true,
    maxBranches: 2,
    execution: async (ctx, brancher) => {
      return await brancher.createBranches(
        ctx.prompt,
        ctx.analysis,
        { 
          strategies: ['alternative'],
          maxBranches: 2 
        }
      );
    }
  }
};

/**
 * Generate clarification questions
 * @private
 */
function generateClarificationQuestions(ctx) {
  const questions = [];
  
  if (ctx.analysis?.intent?.confidence < 0.4) {
    questions.push({
      id: 'intent',
      question: 'What is your primary goal with this request?',
      options: ['Create something new', 'Modify existing code', 'Analyze current state', 'Research options']
    });
  }
  
  if (ctx.analysis?.frameworks?.length > 2) {
    questions.push({
      id: 'framework',
      question: 'Which framework is the primary focus?',
      options: ctx.analysis.frameworks
    });
  }
  
  if (ctx.analysis?.riskFactors?.some(f => f.factor === 'ambiguity')) {
    questions.push({
      id: 'scope',
      question: 'Can you provide more specific requirements?',
      options: ['Add specific examples', 'Define constraints', 'Specify priorities']
    });
  }
  
  return questions;
}

/**
 * Decompose task into sub-tasks
 * @private
 */
function decomposeTask(ctx) {
  const subTasks = [];
  const prompt = ctx.prompt || '';
  
  // Split by common delimiters
  const parts = prompt.split(/\s+(?:and|then|also|additionally)\s+/i);
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (part.length > 10) {
      subTasks.push({
        id: `subtask-${i + 1}`,
        description: part,
        priority: i === 0 ? 'high' : 'normal',
        dependencies: i > 0 ? [`subtask-${i}`] : []
      });
    }
  }
  
  // If no clear decomposition, create phases
  if (subTasks.length === 0) {
    subTasks.push(
      { id: 'phase-1', description: 'Analyze requirements', priority: 'high', dependencies: [] },
      { id: 'phase-2', description: 'Design solution', priority: 'high', dependencies: ['phase-1'] },
      { id: 'phase-3', description: 'Implement solution', priority: 'high', dependencies: ['phase-2'] },
      { id: 'phase-4', description: 'Validate results', priority: 'normal', dependencies: ['phase-3'] }
    );
  }
  
  return subTasks;
}

/**
 * Get enhanced validation rules for context
 * @private
 */
function getEnhancedValidationRules(ctx) {
  const rules = [
    { id: 'security', description: 'Check for security vulnerabilities', mandatory: true },
    { id: 'syntax', description: 'Validate syntax correctness', mandatory: true },
    { id: 'integration', description: 'Verify integration points', mandatory: true }
  ];
  
  if (ctx.analysis?.frameworks?.includes('react')) {
    rules.push({ id: 'react-hooks', description: 'Validate React hooks usage', mandatory: true });
  }
  
  if (ctx.analysis?.frameworks?.includes('typescript')) {
    rules.push({ id: 'types', description: 'Check type safety', mandatory: true });
  }
  
  return rules;
}

/**
 * Generate checkpoints for validation
 * @private
 */
function generateCheckpoints(ctx) {
  return [
    { stage: 'pre', checks: ['input-validation', 'context-verification'] },
    { stage: 'during', checks: ['progress-validation', 'intermediate-results'] },
    { stage: 'post', checks: ['output-validation', 'integration-test', '7bmad-check'] }
  ];
}

class InterventionTrigger {
  constructor(config = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      priorityThreshold: config.priorityThreshold || 3,
      complexityThreshold: config.complexityThreshold || 70,
      riskThreshold: config.riskThreshold || 50,
      customConditions: config.customConditions || [],
      ...config
    };
    
    this.metrics = {
      triggersChecked: 0,
      triggersFired: 0,
      byType: {},
      byCondition: {}
    };
    
    // Build conditions with configurable thresholds
    this.conditions = this._buildConditions();
    
    // Merge custom conditions
    for (const [name, condition] of Object.entries(this.config.customConditions)) {
      this.conditions[name] = condition;
    }
  }
  
  /**
   * Build trigger conditions with current config
   * @private
   */
  _buildConditions() {
    const { complexityThreshold, riskThreshold } = this.config;
    
    return {
      highComplexity: {
        check: (ctx) => (ctx.analysis?.complexity ?? 0) > complexityThreshold,
        priority: 1,
        intervention: 'multi-path',
        reason: 'High complexity task benefits from multiple approaches'
      },
      
      highRisk: {
        check: (ctx) => {
          const riskLevel = ctx.analysis?.riskLevel;
          const riskScore = ctx.analysis?.riskScore ?? 0;
          return riskLevel === 'HIGH' || riskLevel === 'EXTREME' || riskScore > riskThreshold;
        },
        priority: 1,
        intervention: 'multi-path',
        reason: 'High risk requires careful consideration of alternatives'
      },
      
      lowIntentConfidence: {
        check: (ctx) => (ctx.analysis?.intent?.confidence ?? 1) < 0.4,
        priority: 2,
        intervention: 'clarification',
        reason: 'Unclear intent needs clarification'
      },
      
      multiFramework: {
        check: (ctx) => (ctx.analysis?.frameworks?.length ?? 0) > 2,
        priority: 3,
        intervention: 'decomposition',
        reason: 'Multiple frameworks suggest decomposition needed'
      },
      
      securitySensitive: {
        check: (ctx) => ctx.analysis?.riskFactors?.some(f => f.factor === 'security_sensitive'),
        priority: 1,
        intervention: 'validation',
        reason: 'Security-sensitive operations require extra validation'
      },
      
      previousFailure: {
        check: (ctx) => ctx.previousAttempts?.some(a => !a.success),
        priority: 2,
        intervention: 'alternative',
        reason: 'Previous failure suggests trying alternative approach'
      },
      
      ambiguousRequest: {
        check: (ctx) => ctx.analysis?.riskFactors?.some(f => f.factor === 'ambiguity'),
        priority: 2,
        intervention: 'clarification',
        reason: 'Ambiguous requests need clarification'
      },
      
      largeScope: {
        check: (ctx) => (ctx.estimatedFiles ?? 0) > 5 || (ctx.estimatedTime ?? 0) > 30,
        priority: 3,
        intervention: 'decomposition',
        reason: 'Large scope benefits from decomposition'
      }
    };
  }
  
  /**
   * Check if intervention is needed
   * @param {object} context - Operation context
   * @returns {Promise<object|null>} Intervention action or null
   */
  async check(context) {
    if (!this.config.enabled) {
      return null;
    }
    
    this.metrics.triggersChecked++;
    
    // Find matching conditions
    const matchedConditions = [];
    
    for (const [name, condition] of Object.entries(this.conditions)) {
      try {
        if (condition.check(context)) {
          matchedConditions.push({
            name,
            priority: condition.priority,
            intervention: condition.intervention,
            reason: condition.reason
          });
        }
      } catch (error) {
        // Condition check failed, skip
      }
    }
    
    if (matchedConditions.length === 0) {
      return null;
    }
    
    // Sort by priority (lower = higher priority)
    matchedConditions.sort((a, b) => a.priority - b.priority);
    
    // Get highest priority intervention
    const topMatch = matchedConditions[0];
    const action = INTERVENTION_ACTIONS[topMatch.intervention];
    
    if (!action) {
      return null;
    }
    
    // Update metrics
    this.metrics.triggersFired++;
    this.metrics.byType[topMatch.intervention] = 
      (this.metrics.byType[topMatch.intervention] || 0) + 1;
    this.metrics.byCondition[topMatch.name] = 
      (this.metrics.byCondition[topMatch.name] || 0) + 1;
    
    return {
      type: topMatch.intervention,
      condition: topMatch.name,
      reason: topMatch.reason,
      priority: topMatch.priority,
      action: action,
      requiresAlternatives: action.requiresAlternatives,
      maxBranches: action.maxBranches,
      allMatches: matchedConditions.map(m => ({
        condition: m.name,
        intervention: m.intervention,
        reason: m.reason
      }))
    };
  }
  
  /**
   * Execute intervention action
   * @param {object} intervention - Intervention to execute
   * @param {object} context - Operation context
   * @param {object} brancher - Parallel brancher instance
   * @returns {Promise<object>} Execution result
   */
  async execute(intervention, context, brancher) {
    const action = intervention.action;
    
    if (!action || !action.execution) {
      return { error: 'No execution function for intervention' };
    }
    
    try {
      const result = await action.execution(context, brancher);
      return {
        success: true,
        intervention: intervention.type,
        result
      };
    } catch (error) {
      return {
        success: false,
        intervention: intervention.type,
        error: error.message
      };
    }
  }
  
  /**
   * Add custom trigger condition
   * @param {string} name - Condition name
   * @param {object} condition - Condition definition
   */
  addCondition(name, condition) {
    this.conditions[name] = condition;
  }
  
  /**
   * Remove trigger condition
   * @param {string} name - Condition name
   */
  removeCondition(name) {
    delete this.conditions[name];
  }
  
  /**
   * Get trigger statistics
   * @returns {object} Statistics
   */
  getStats() {
    return {
      ...this.metrics,
      fireRate: this.metrics.triggersChecked > 0
        ? this.metrics.triggersFired / this.metrics.triggersChecked
        : 0,
      availableConditions: Object.keys(this.conditions),
      availableActions: Object.keys(INTERVENTION_ACTIONS)
    };
  }
  
  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      triggersChecked: 0,
      triggersFired: 0,
      byType: {},
      byCondition: {}
    };
  }
}

module.exports = { 
  InterventionTrigger, 
  TRIGGER_CONDITIONS, 
  INTERVENTION_ACTIONS 
};
