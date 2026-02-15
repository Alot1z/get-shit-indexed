/**
 * Thinking Context Object
 * 
 * Context object for passing thinking information between operations.
 * Encapsulates before/after thinking, BMAD scores, and metadata.
 */

/**
 * Thinking Context class
 */
class ThinkingContext {
  /**
   * Create thinking context
   * @param {string} toolName - Tool name
   * @param {object} params - Tool parameters
   * @param {string} operationType - Operation type
   */
  constructor(toolName, params = {}, operationType = 'tool') {
    this.toolName = toolName;
    this.operationType = operationType;
    this.params = params;
    this.beforeThinking = null;
    this.afterThinking = null;
    this.bmadScore = null;
    this.timestamp = new Date().toISOString();
    this.metadata = {};
  }
  
  /**
   * Update with tool result
   * @param {object} result - Tool execution result
   * @returns {ThinkingContext} This context
   */
  updateWithResult(result) {
    this.result = result;
    this.resultTimestamp = new Date().toISOString();
    return this;
  }
  
  /**
   * Set before thinking
   * @param {object} thinking - Before thinking data
   * @returns {ThinkingContext} This context
   */
  setBeforeThinking(thinking) {
    this.beforeThinking = thinking;
    return this;
  }
  
  /**
   * Set after thinking
   * @param {object} thinking - After thinking data
   * @returns {ThinkingContext} This context
   */
  setAfterThinking(thinking) {
    this.afterThinking = thinking;
    return this;
  }
  
  /**
   * Set BMAD score
   * @param {object} score - BMAD score data
   * @returns {ThinkingContext} This context
   */
  setBMADScore(score) {
    this.bmadScore = score;
    return this;
  }
  
  /**
   * Add metadata
   * @param {string} key - Metadata key
   * @param {any} value - Metadata value
   * @returns {ThinkingContext} This context
   */
  addMetadata(key, value) {
    this.metadata[key] = value;
    return this;
  }
  
  /**
   * Check if thinking was skipped
   * @returns {boolean} True if skipped
   */
  wasSkipped() {
    return this.beforeThinking && this.beforeThinking.skipped;
  }
  
  /**
   * Check if thinking was cached
   * @returns {boolean} True if cached
   */
  wasCached() {
    return this.beforeThinking && this.beforeThinking.cached;
  }
  
  /**
   * Check if thinking was degraded
   * @returns {boolean} True if degraded
   */
  wasDegraded() {
    return (this.beforeThinking && this.beforeThinking.degraded) ||
           (this.afterThinking && this.afterThinking.degraded);
  }
  
  /**
   * Check if BMAD passed
   * @returns {boolean} True if passed
   */
  passedBMAD() {
    return this.bmadScore && this.bmadScore.passed;
  }
  
  /**
   * Get thinking duration
   * @returns {number|null} Duration in milliseconds or null
   */
  getDuration() {
    if (!this.resultTimestamp) {
      return null;
    }
    
    const start = new Date(this.timestamp).getTime();
    const end = new Date(this.resultTimestamp).getTime();
    return end - start;
  }
  
  /**
   * Convert to JSON
   * @returns {object} JSON object
   */
  toJSON() {
    return {
      toolName: this.toolName,
      operationType: this.operationType,
      params: this.params,
      beforeThinking: this.beforeThinking,
      afterThinking: this.afterThinking,
      bmadScore: this.bmadScore,
      result: this.result,
      timestamp: this.timestamp,
      resultTimestamp: this.resultTimestamp,
      duration: this.getDuration(),
      metadata: this.metadata,
      flags: {
        skipped: this.wasSkipped(),
        cached: this.wasCached(),
        degraded: this.wasDegraded(),
        passedBMAD: this.passedBMAD()
      }
    };
  }
  
  /**
   * Create from JSON
   * @param {object} json - JSON object
   * @returns {ThinkingContext} Thinking context
   */
  static fromJSON(json) {
    const context = new ThinkingContext(
      json.toolName,
      json.params,
      json.operationType
    );
    
    context.beforeThinking = json.beforeThinking;
    context.afterThinking = json.afterThinking;
    context.bmadScore = json.bmadScore;
    context.result = json.result;
    context.timestamp = json.timestamp;
    context.resultTimestamp = json.resultTimestamp;
    context.metadata = json.metadata || {};
    
    return context;
  }
  
  /**
   * Create context for tool operation
   * @param {string} toolName - Tool name
   * @param {object} params - Tool parameters
   * @returns {ThinkingContext} New context
   */
  static createContext(toolName, params = {}) {
    return new ThinkingContext(toolName, params, 'tool');
  }
  
  /**
   * Create context for command operation
   * @param {string} commandName - Command name
   * @param {object} params - Command parameters
   * @returns {ThinkingContext} New context
   */
  static createCommandContext(commandName, params = {}) {
    return new ThinkingContext(commandName, params, 'command');
  }
  
  /**
   * Create context for workflow operation
   * @param {string} workflowName - Workflow name
   * @param {object} params - Workflow parameters
   * @returns {ThinkingContext} New context
   */
  static createWorkflowContext(workflowName, params = {}) {
    return new ThinkingContext(workflowName, params, 'workflow');
  }
  
  /**
   * Format context for display
   * @returns {string} Formatted context
   */
  format() {
    let output = `Thinking Context: ${this.toolName}\n`;
    output += `Operation: ${this.operationType}\n`;
    output += `Timestamp: ${this.timestamp}\n`;
    
    if (this.getDuration()) {
      output += `Duration: ${this.getDuration()}ms\n`;
    }
    
    output += '\n';
    
    if (this.beforeThinking) {
      output += 'Before Thinking:\n';
      if (this.beforeThinking.skipped) {
        output += `  Skipped: ${this.beforeThinking.reason}\n`;
      } else if (this.beforeThinking.cached) {
        output += `  Cached: Yes\n`;
      } else {
        output += `  Server: ${this.beforeThinking.server}\n`;
        output += `  Insights: ${this.beforeThinking.parsed ? JSON.stringify(this.beforeThinking.parsed).substring(0, 100) : 'N/A'}...\n`;
      }
      output += '\n';
    }
    
    if (this.afterThinking) {
      output += 'After Thinking:\n';
      output += `  Reflection: ${JSON.stringify(this.afterThinking.reflection).substring(0, 100) || 'N/A'}...\n`;
      if (this.afterThinking.learning && this.afterThinking.learning.length > 0) {
        output += `  Learning: ${this.afterThinking.learning.length} items\n`;
      }
      output += '\n';
    }
    
    if (this.bmadScore) {
      output += `BMAD Score: ${this.bmadScore.totalScore}/${this.bmadScore.maxScore} (${this.bmadScore.percentage}%)\n`;
      output += `  Status: ${this.bmadScore.passed ? '✓ Passed' : '✗ Failed'}\n`;
    }
    
    return output;
  }
}

module.exports = {
  ThinkingContext
};
