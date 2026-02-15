/**
 * Reflection Schema
 * 
 * Defines the structure for reflection data captured after tool execution.
 * Part of the PostToolUse reflection system.
 */

/**
 * Reflection types
 */
const ReflectionTypes = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  PARTIAL: 'PARTIAL',
  INSIGHT: 'INSIGHT'
};

/**
 * Pattern types extracted from reflections
 */
const PatternTypes = {
  SEQUENCE: 'SEQUENCE',           // Ordered operation patterns
  CONDITIONAL: 'CONDITIONAL',     // If-then patterns
  ERROR_RECOVERY: 'ERROR_RECOVERY' // Error handling patterns
};

/**
 * Insight types generated from reflections
 */
const InsightTypes = {
  OPTIMIZATION: 'OPTIMIZATION',   // Performance improvement
  SAFETY: 'SAFETY',               // Error prevention
  CLARITY: 'CLARITY'              // Understanding improvement
};

/**
 * Main reflection schema
 */
class Reflection {
  constructor(data) {
    this.timestamp = data.timestamp || new Date().toISOString();
    this.toolName = data.toolName;
    this.operation = data.operation;
    this.type = data.type || ReflectionTypes.SUCCESS;
    
    // Context
    this.input = {
      arguments: data.input?.arguments || {},
      context: data.input?.context || {},
      thinkingBefore: data.input?.thinkingBefore || null
    };
    
    // Result
    this.output = {
      result: data.output?.result || null,
      error: data.output?.error || null,
      thinkingAfter: data.output?.thinkingAfter || null
    };
    
    // Analysis
    this.patterns = data.patterns || [];
    this.insights = data.insights || [];
    this.recommendations = data.recommendations || [];
    
    // Metadata
    this.metadata = {
      sessionId: data.metadata?.sessionId || null,
      duration: data.metadata?.duration || null,
      success: data.metadata?.success !== undefined ? data.metadata.success : true
    };
  }
  
  /**
   * Validate reflection data
   */
  validate() {
    const errors = [];
    
    // Required fields
    if (!this.toolName) {
      errors.push('toolName is required');
    }
    
    if (!this.operation) {
      errors.push('operation is required');
    }
    
    // Type validation
    if (!Object.values(ReflectionTypes).includes(this.type)) {
      errors.push(`Invalid type: ${this.type}. Must be one of: ${Object.values(ReflectionTypes).join(', ')}`);
    }
    
    // Timestamp validation
    const timestamp = new Date(this.timestamp);
    if (isNaN(timestamp.getTime())) {
      errors.push('Invalid timestamp format');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      timestamp: this.timestamp,
      toolName: this.toolName,
      operation: this.operation,
      type: this.type,
      input: this.input,
      output: this.output,
      patterns: this.patterns,
      insights: this.insights,
      recommendations: this.recommendations,
      metadata: this.metadata
    };
  }
  
  /**
   * Create from tool invocation
   */
  static fromToolInvocation(toolInvocation, reflectionType) {
    const { toolName, arguments: args, result, error, sessionId } = toolInvocation;
    
    return new Reflection({
      toolName,
      operation: args ? JSON.stringify(args).substring(0, 100) : 'unknown',
      type: reflectionType,
      input: {
        arguments: args || {},
        context: {},
        thinkingBefore: null
      },
      output: {
        result: result || null,
        error: error || null,
        thinkingAfter: null
      },
      metadata: {
        sessionId: sessionId || null,
        success: !error
      }
    });
  }
}

/**
 * Pattern schema
 */
class Pattern {
  constructor(data) {
    this.id = data.id || `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = data.type;
    this.name = data.name;
    this.description = data.description;
    this.sequence = data.sequence || [];  // For SEQUENCE type
    this.condition = data.condition || null;  // For CONDITIONAL type
    this.errorHandling = data.errorHandling || null;  // For ERROR_RECOVERY type
    this.frequency = data.frequency || 1;
    this.successRate = data.successRate || 0;
    this.lastSeen = data.lastSeen || new Date().toISOString();
    this.examples = data.examples || [];
  }
  
  validate() {
    const errors = [];
    
    if (!Object.values(PatternTypes).includes(this.type)) {
      errors.push(`Invalid type: ${this.type}`);
    }
    
    if (!this.name) {
      errors.push('name is required');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      description: this.description,
      sequence: this.sequence,
      condition: this.condition,
      errorHandling: this.errorHandling,
      frequency: this.frequency,
      successRate: this.successRate,
      lastSeen: this.lastSeen,
      examples: this.examples
    };
  }
}

/**
 * Insight schema
 */
class Insight {
  constructor(data) {
    this.id = data.id || `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = data.type;
    this.title = data.title;
    this.description = data.description;
    this.impact = data.impact || 'medium';  // high, medium, low
    this.feasibility = data.feasibility || 'medium';  // high, medium, low
    this.priority = this.calculatePriority();
    this.generatedAt = data.generatedAt || new Date().toISOString();
    this.applied = data.applied || false;
  }
  
  /**
   * Calculate priority based on impact and feasibility
   */
  calculatePriority() {
    const impactScore = { high: 3, medium: 2, low: 1 }[this.impact] || 2;
    const feasibilityScore = { high: 3, medium: 2, low: 1 }[this.feasibility] || 2;
    return impactScore * feasibilityScore;
  }
  
  validate() {
    const errors = [];
    
    if (!Object.values(InsightTypes).includes(this.type)) {
      errors.push(`Invalid type: ${this.type}`);
    }
    
    if (!this.title) {
      errors.push('title is required');
    }
    
    if (!this.description) {
      errors.push('description is required');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      description: this.description,
      impact: this.impact,
      feasibility: this.feasibility,
      priority: this.priority,
      generatedAt: this.generatedAt,
      applied: this.applied
    };
  }
}

module.exports = {
  ReflectionTypes,
  PatternTypes,
  InsightTypes,
  Reflection,
  Pattern,
  Insight
};
