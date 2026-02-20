/**
 * Knowledge Producer
 * 
 * Registers and emits knowledge from various sources:
 * - pattern-learning: Learned patterns from execution
 * - debug-thinking: Problem-solution mappings
 * - claudeception: Self-improvement insights
 * - reflection: Session insights
 * 
 * @module lib/knowledge-hub/producer
 */

const EventEmitter = require('events');

/**
 * Knowledge source types
 */
const KNOWLEDGE_SOURCES = {
  PATTERN_LEARNING: 'pattern-learning',
  DEBUG_THINKING: 'debug-thinking',
  CLAUDECEPTION: 'claudeception',
  REFLECTION: 'reflection',
  VALIDATION: 'validation'
};

/**
 * Knowledge types
 */
const KNOWLEDGE_TYPES = {
  PATTERN: 'pattern',           // Reusable code/behavior pattern
  SOLUTION: 'solution',         // Problem-solution mapping
  INSIGHT: 'insight',          // General insight or observation
  ANTI_PATTERN: 'anti-pattern', // What NOT to do
  METRIC: 'metric',            // Performance/usage metric
  DECISION: 'decision'         // Architecture/implementation decision
};

/**
 * Knowledge Producer Class
 * Emits knowledge events for consumers
 */
class KnowledgeProducer extends EventEmitter {
  constructor(source, config = {}) {
    super();
    this.source = source;
    this.config = config;
    this.emittedCount = 0;
    this.lastEmit = null;
  }
  
  /**
   * Emit knowledge to the hub
   * @param {string} type - Knowledge type
   * @param {object} data - Knowledge data
   * @param {object} metadata - Additional metadata
   */
  emit(type, data, metadata = {}) {
    const knowledge = {
      id: this.generateId(),
      source: this.source,
      type,
      data,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        emitCount: ++this.emittedCount
      }
    };
    
    this.lastEmit = knowledge;
    super.emit('knowledge', knowledge);
    
    return knowledge;
  }
  
  /**
   * Emit a pattern
   * @param {string} name - Pattern name
   * @param {object} pattern - Pattern definition
   * @param {object} context - Context where pattern applies
   */
  emitPattern(name, pattern, context = {}) {
    return this.emit(KNOWLEDGE_TYPES.PATTERN, {
      name,
      pattern,
      context,
      examples: context.examples || []
    });
  }
  
  /**
   * Emit a solution
   * @param {string} problem - Problem description
   * @param {object} solution - Solution definition
   * @param {object} evidence - Evidence of effectiveness
   */
  emitSolution(problem, solution, evidence = {}) {
    return this.emit(KNOWLEDGE_TYPES.SOLUTION, {
      problem,
      solution,
      evidence,
      success: evidence.success !== false
    });
  }
  
  /**
   * Emit an insight
   * @param {string} insight - Insight description
   * @param {object} context - Context
   * @param {number} confidence - Confidence level (0-1)
   */
  emitInsight(insight, context = {}, confidence = 0.5) {
    return this.emit(KNOWLEDGE_TYPES.INSIGHT, {
      insight,
      context,
      confidence
    });
  }
  
  /**
   * Emit an anti-pattern
   * @param {string} antiPattern - Anti-pattern description
   * @param {string} reason - Why it's problematic
   * @param {string} alternative - Better approach
   */
  emitAntiPattern(antiPattern, reason, alternative) {
    return this.emit(KNOWLEDGE_TYPES.ANTI_PATTERN, {
      antiPattern,
      reason,
      alternative
    });
  }
  
  /**
   * Emit a metric
   * @param {string} name - Metric name
   * @param {number} value - Metric value
   * @param {object} context - Context
   */
  emitMetric(name, value, context = {}) {
    return this.emit(KNOWLEDGE_TYPES.METRIC, {
      name,
      value,
      context,
      unit: context.unit || 'count'
    });
  }
  
  /**
   * Emit a decision
   * @param {string} decision - Decision description
   * @param {string} rationale - Why this decision
   * @param {object} alternatives - Alternatives considered
   */
  emitDecision(decision, rationale, alternatives = {}) {
    return this.emit(KNOWLEDGE_TYPES.DECISION, {
      decision,
      rationale,
      alternatives,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Generate unique ID for knowledge
   * @returns {string} Unique ID
   */
  generateId() {
    return `${this.source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get producer stats
   * @returns {object} Stats
   */
  getStats() {
    return {
      source: this.source,
      emittedCount: this.emittedCount,
      lastEmit: this.lastEmit
    };
  }
}

/**
 * Pattern Learning Producer
 * Emits patterns learned from code execution
 */
class PatternLearningProducer extends KnowledgeProducer {
  constructor() {
    super(KNOWLEDGE_SOURCES.PATTERN_LEARNING);
  }
  
  /**
   * Record a code pattern
   * @param {string} patternName - Pattern name
   * @param {string} code - Code snippet
   * @param {object} context - Usage context
   */
  recordPattern(patternName, code, context) {
    return this.emitPattern(patternName, {
      code,
      structure: this.analyzeStructure(code)
    }, context);
  }
  
  /**
   * Analyze code structure
   * @param {string} code - Code to analyze
   * @returns {object} Structure info
   */
  analyzeStructure(code) {
    return {
      lines: code.split('\n').length,
      hasAsync: code.includes('async'),
      hasTryCatch: code.includes('try') && code.includes('catch'),
      hasError: code.includes('Error'),
      hasCallback: code.includes('callback') || code.includes('=>')
    };
  }
}

/**
 * Debug Thinking Producer
 * Emits problem-solution mappings from debugging
 */
class DebugThinkingProducer extends KnowledgeProducer {
  constructor() {
    super(KNOWLEDGE_SOURCES.DEBUG_THINKING);
  }
  
  /**
   * Record a debugging session result
   * @param {string} problem - Problem description
   * @param {object} solution - Solution that worked
   * @param {object} attempts - Failed attempts
   */
  recordDebugResult(problem, solution, attempts = []) {
    return this.emitSolution(problem, solution, {
      attempts,
      resolutionTime: solution.timestamp,
      category: this.categorizeProblem(problem)
    });
  }
  
  /**
   * Categorize problem type
   * @param {string} problem - Problem description
   * @returns {string} Category
   */
  categorizeProblem(problem) {
    const categories = {
      'null|undefined': 'null-reference',
      'async|await|promise': 'async',
      'type|Type|interface': 'type-error',
      'import|export|module': 'module',
      'permission|auth|access': 'permission'
    };
    
    for (const [pattern, category] of Object.entries(categories)) {
      if (new RegExp(pattern, 'i').test(problem)) {
        return category;
      }
    }
    
    return 'general';
  }
}

/**
 * Claudeception Producer
 * Emits self-improvement insights
 */
class ClaudeceptionProducer extends KnowledgeProducer {
  constructor() {
    super(KNOWLEDGE_SOURCES.CLAUDECEPTION);
  }
  
  /**
   * Record a self-improvement insight
   * @param {string} insight - Insight description
   * @param {string} category - Category
   * @param {number} confidence - Confidence level
   */
  recordInsight(insight, category, confidence = 0.7) {
    return this.emitInsight(insight, { category }, confidence);
  }
  
  /**
   * Record an optimization opportunity
   * @param {string} area - Area for optimization
   * @param {string} current - Current approach
   * @param {string} suggested - Suggested improvement
   */
  recordOptimization(area, current, suggested) {
    return this.emitDecision(
      `Optimize ${area}`,
      suggested,
      { current }
    );
  }
}

/**
 * Validation Producer
 * Emits validation results and patterns
 */
class ValidationProducer extends KnowledgeProducer {
  constructor() {
    super(KNOWLEDGE_SOURCES.VALIDATION);
  }
  
  /**
   * Record validation result
   * @param {string} gate - Gate name
   * @param {boolean} passed - Whether passed
   * @param {object} issues - Issues found
   */
  recordValidation(gate, passed, issues = []) {
    if (passed) {
      return this.emitPattern(`validation-${gate}`, {
        gate,
        criteria: 'passed'
      });
    } else {
      return this.emitAntiPattern(
        `failed-${gate}`,
        issues.map(i => i.description).join('; '),
        'Fix issues and re-validate'
      );
    }
  }
}

module.exports = {
  KnowledgeProducer,
  PatternLearningProducer,
  DebugThinkingProducer,
  ClaudeceptionProducer,
  ValidationProducer,
  KNOWLEDGE_SOURCES,
  KNOWLEDGE_TYPES
};
