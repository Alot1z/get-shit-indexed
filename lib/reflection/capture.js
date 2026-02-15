/**
 * Reflection Capture Engine
 * 
 * Analyzes tool execution results and generates reflection objects.
 * Part of the PostToolUse reflection system.
 */

const { Reflection, ReflectionTypes } = require('./schema');

/**
 * Capture reflection from tool execution
 */
class ReflectionCapture {
  constructor() {
    this.captureHistory = [];
  }
  
  /**
   * Main capture function
   * @param {string} toolName - Name of the tool that was executed
   * @param {object} context - Execution context (arguments, thinking, etc.)
   * @param {object} result - Execution result or error
   * @returns {Reflection} Captured reflection
   */
  capture(toolName, context, result) {
    // Determine reflection type
    const reflectionType = this.determineReflectionType(toolName, context, result);
    
    // Create reflection
    const reflection = new Reflection({
      toolName,
      operation: this.extractOperation(context),
      type: reflectionType,
      input: {
        arguments: context.arguments || {},
        context: context.context || {},
        thinkingBefore: context.thinkingBefore || null
      },
      output: {
        result: result.result || null,
        error: result.error || null,
        thinkingAfter: context.thinkingAfter || null
      },
      metadata: {
        sessionId: context.sessionId || null,
        duration: context.duration || null,
        success: !result.error
      }
    });
    
    // Analyze result for patterns
    this.analyzeResult(reflection, toolName, context, result);
    
    // Store in history
    this.captureHistory.push(reflection);
    
    return reflection;
  }
  
  /**
   * Determine reflection type based on outcome
   */
  determineReflectionType(toolName, context, result) {
    if (result.error) {
      return ReflectionTypes.ERROR;
    }
    
    // Check for partial success
    if (result.result && result.result.partial === true) {
      return ReflectionTypes.PARTIAL;
    }
    
    // Check for new insights from thinking servers
    if (context.thinkingAfter && this.hasNewInsights(context)) {
      return ReflectionTypes.INSIGHT;
    }
    
    return ReflectionTypes.SUCCESS;
  }
  
  /**
   * Extract operation description from context
   */
  extractOperation(context) {
    const args = context.arguments || {};
    
    // Try to extract meaningful operation description
    if (args.pattern) {
      return `Search: ${args.pattern}`;
    }
    
    if (args.path) {
      return `Path: ${args.path}`;
    }
    
    if (args.cypher) {
      return `Query: ${args.cypher.substring(0, 50)}...`;
    }
    
    if (args.thought) {
      return `Thinking: ${args.thought.substring(0, 50)}...`;
    }
    
    // Generic operation description
    const keys = Object.keys(args).slice(0, 3);
    return `Operation with: ${keys.join(', ')}`;
  }
  
  /**
   * Analyze result for patterns and characteristics
   */
  analyzeResult(reflection, toolName, context, result) {
    // Check for unexpected outputs
    if (result.error) {
      this.analyzeError(reflection, result.error);
    }
    
    // Check performance characteristics
    if (context.duration) {
      this.analyzePerformance(reflection, context.duration);
    }
    
    // Check for pattern matches
    this.checkPatternMatches(reflection, toolName, context);
    
    // Extract learnings from thinking
    if (context.thinkingAfter) {
      this.extractThinkingLearnings(reflection, context.thinkingAfter);
    }
  }
  
  /**
   * Analyze error for classification
   */
  analyzeError(reflection, error) {
    const errorStr = String(error);
    
    // Classify error type
    if (errorStr.includes('ENOTFOUND') || errorStr.includes('ECONNREFUSED')) {
      reflection.recommendations.push({
        type: 'network',
        message: 'Network error detected - check connectivity or endpoint',
        priority: 'high'
      });
    } else if (errorStr.includes('timeout')) {
      reflection.recommendations.push({
        type: 'performance',
        message: 'Timeout detected - consider increasing timeout or optimizing operation',
        priority: 'medium'
      });
    } else if (errorStr.includes('authentication') || errorStr.includes('unauthorized')) {
      reflection.recommendations.push({
        type: 'auth',
        message: 'Authentication error - check credentials',
        priority: 'high'
      });
    } else if (errorStr.includes('not found') || errorStr.includes('404')) {
      reflection.recommendations.push({
        type: 'resource',
        message: 'Resource not found - verify path or identifier',
        priority: 'medium'
      });
    }
  }
  
  /**
   * Analyze performance characteristics
   */
  analyzePerformance(reflection, duration) {
    const durationSec = duration / 1000;
    
    if (durationSec > 30) {
      reflection.recommendations.push({
        type: 'performance',
        message: `Operation took ${durationSec.toFixed(1)}s - consider optimization`,
        priority: 'low'
      });
      
      reflection.metadata.performance = 'slow';
    } else if (durationSec < 0.1) {
      reflection.metadata.performance = 'fast';
    } else {
      reflection.metadata.performance = 'normal';
    }
  }
  
  /**
   * Check for pattern matches
   */
  checkPatternMatches(reflection, toolName, context) {
    // Check for common patterns
    
    // File operation pattern: read -> process -> write
    if (toolName.includes('read') && context.nextOperation?.includes('write')) {
      reflection.patterns.push({
        type: 'read-process-write',
        description: 'Read followed by write pattern detected'
      });
    }
    
    // Search then navigate pattern
    if (toolName.includes('search') && context.nextOperation?.includes('get_symbol')) {
      reflection.patterns.push({
        type: 'search-navigate',
        description: 'Search followed by symbol navigation pattern'
      });
    }
    
    // Thinking before operation pattern
    if (context.thinkingBefore && !toolName.includes('thinking')) {
      reflection.patterns.push({
        type: 'think-then-act',
        description: 'Thinking followed by tool execution pattern'
      });
    }
  }
  
  /**
   * Extract learnings from thinking output
   */
  extractThinkingLearnings(reflection, thinkingAfter) {
    if (typeof thinkingAfter === 'string') {
      // Extract key insights from thinking text
      const insights = this.extractInsightsFromText(thinkingAfter);
      reflection.insights.push(...insights);
    } else if (typeof thinkingAfter === 'object') {
      // Extract from structured thinking output
      if (thinkingAfter.thoughts) {
        const lastThought = thinkingAfter.thoughts[thinkingAfter.thoughts.length - 1];
        if (lastThought) {
          reflection.insights.push({
            source: 'thinking',
            content: lastThought.thought || lastThought,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
  }
  
  /**
   * Extract insights from text
   */
  extractInsightsFromText(text) {
    const insights = [];
    const sentences = text.split(/[.!?]+/);
    
    // Look for insight keywords
    const insightKeywords = ['realize', 'discover', 'understand', 'learn', 'found', 'identify'];
    
    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase().trim();
      if (insightKeywords.some(keyword => lower.includes(keyword))) {
        insights.push({
          source: 'thinking',
          content: sentence.trim(),
          timestamp: new Date().toISOString()
        });
      }
    });
    
    return insights.slice(0, 5); // Limit to 5 insights
  }
  
  /**
   * Check if thinking produced new insights
   */
  hasNewInsights(context) {
    if (!context.thinkingAfter) return false;
    
    const thinkingAfterStr = JSON.stringify(context.thinkingAfter);
    const thinkingBeforeStr = JSON.stringify(context.thinkingBefore);
    
    return thinkingAfterStr !== thinkingBeforeStr;
  }
  
  /**
   * Get capture statistics
   */
  getStats() {
    const stats = {
      total: this.captureHistory.length,
      byType: {},
      byTool: {},
      withErrors: 0
    };
    
    this.captureHistory.forEach(reflection => {
      // Count by type
      stats.byType[reflection.type] = (stats.byType[reflection.type] || 0) + 1;
      
      // Count by tool
      stats.byTool[reflection.toolName] = (stats.byTool[reflection.toolName] || 0) + 1;
      
      // Count errors
      if (reflection.type === ReflectionTypes.ERROR) {
        stats.withErrors++;
      }
    });
    
    return stats;
  }
}

module.exports = ReflectionCapture;
