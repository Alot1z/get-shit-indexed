/**
 * Insight Generation System
 * 
 * Generates actionable recommendations from reflection data.
 * Analyzes success factors, improvement opportunities, and produces ranked insights.
 */

const { Insight, InsightTypes } = require('./schema');

/**
 * Insight Generation Manager
 */
class InsightGenerator {
  constructor() {
    this.insightsHistory = [];
  }
  
  /**
   * Generate insights from reflection
   * @param {Reflection} reflection - Reflection to analyze
   * @returns {Array} Generated insights
   */
  generateInsights(reflection) {
    const insights = [];
    
    // Generate optimization insights
    const optimizationInsights = this.generateOptimizationInsights(reflection);
    insights.push(...optimizationInsights);
    
    // Generate safety insights
    const safetyInsights = this.generateSafetyInsights(reflection);
    insights.push(...safetyInsights);
    
    // Generate clarity insights
    const clarityInsights = this.generateClarityInsights(reflection);
    insights.push(...clarityInsights);
    
    // Rank insights by priority
    insights.sort((a, b) => b.priority - a.priority);
    
    // Store in history
    this.insightsHistory.push(...insights);
    
    return insights;
  }
  
  /**
   * Generate optimization insights (performance improvements)
   */
  generateOptimizationInsights(reflection) {
    const insights = [];
    
    // Check for slow operations
    if (reflection.metadata.performance === 'slow') {
      insights.push(new Insight({
        type: InsightTypes.OPTIMIZATION,
        title: 'Optimize Slow Operation',
        description: `Operation ${reflection.toolName} took over 30 seconds. Consider: 1) Increasing timeout, 2) Optimizing search patterns, 3) Using batch operations, 4) Caching results`,
        impact: 'high',
        feasibility: 'medium'
      }));
    }
    
    // Check for repeated operations
    if (reflection.patterns.some(p => p.type === 'search-navigate')) {
      insights.push(new Insight({
        type: InsightTypes.OPTIMIZATION,
        title: 'Use Direct Symbol Access',
        description: 'Pattern detected: search followed by navigation. Consider using get_symbol_body directly if symbol path is known to avoid search overhead.',
        impact: 'medium',
        feasibility: 'high'
      }));
    }
    
    // Check for file I/O patterns
    if (reflection.patterns.some(p => p.type === 'read-process-write')) {
      insights.push(new Insight({
        type: InsightTypes.OPTIMIZATION,
        title: 'Batch File Operations',
        description: 'Multiple file operations detected. Consider using read_multiple_files or batching edits to reduce I/O overhead.',
        impact: 'medium',
        feasibility: 'high'
      }));
    }
    
    // Check for missing thinking
    if (!reflection.input.thinkingBefore && reflection.toolName.includes('mcp__')) {
      insights.push(new Insight({
        type: InsightTypes.OPTIMIZATION,
        title: 'Add Pre-Tool Thinking',
        description: `MCP tool ${reflection.toolName} executed without thinking. Consider using thinking server to plan approach for better results.`,
        impact: 'low',
        feasibility: 'high'
      }));
    }
    
    return insights;
  }
  
  /**
   * Generate safety insights (error prevention)
   */
  generateSafetyInsights(reflection) {
    const insights = [];
    
    // Check for errors
    if (reflection.type === 'ERROR') {
      const error = reflection.output.error;
      
      if (error && (error.includes('authentication') || error.includes('unauthorized'))) {
        insights.push(new Insight({
          type: InsightTypes.SAFETY,
          title: 'Add Authentication Check',
          description: 'Authentication error detected. Add credential verification before operation or implement automatic re-authentication.',
          impact: 'high',
          feasibility: 'medium'
        }));
      }
      
      if (error && (error.includes('ENOTFOUND') || error.includes('ECONNREFUSED'))) {
        insights.push(new Insight({
          type: InsightTypes.SAFETY,
          title: 'Add Network Connectivity Check',
          description: 'Network error detected. Add connectivity check before operation and implement retry logic with exponential backoff.',
          impact: 'high',
          feasibility: 'medium'
        }));
      }
      
      if (error && error.includes('timeout')) {
        insights.push(new Insight({
          type: InsightTypes.SAFETY,
          title: 'Add Timeout Handling',
          description: 'Timeout error detected. Implement: 1) Configurable timeout, 2) Retry with longer timeout, 3) Fallback to alternative approach.',
          impact: 'high',
          feasibility: 'high'
        }));
      }
      
      if (error && (error.includes('not found') || error.includes('404'))) {
        insights.push(new Insight({
          type: InsightTypes.SAFETY,
          title: 'Add Resource Existence Check',
          description: 'Resource not found error. Add existence check before operation and provide clearer error messages with suggestions.',
          impact: 'medium',
          feasibility: 'high'
        }));
      }
    }
    
    // Check for partial success
    if (reflection.type === 'PARTIAL') {
      insights.push(new Insight({
        type: InsightTypes.SAFETY,
        title: 'Handle Partial Success',
        description: 'Operation partially succeeded. Add verification of all expected results and implement rollback or completion logic.',
        impact: 'medium',
        feasibility: 'medium'
      }));
    }
    
    // Check for missing error handling in recommendations
    if (reflection.recommendations.length > 2) {
      insights.push(new Insight({
        type: InsightTypes.SAFETY,
        title: 'Proactive Error Handling',
        description: 'Multiple recommendations generated. Consider implementing error handling proactively for common cases instead of reactive fixes.',
        impact: 'medium',
        feasibility: 'medium'
      }));
    }
    
    return insights;
  }
  
  /**
   * Generate clarity insights (understanding improvements)
   */
  generateClarityInsights(reflection) {
    const insights = [];
    
    // Check for complex operations without thinking
    if (reflection.patterns.length > 2 && !reflection.input.thinkingBefore) {
      insights.push(new Insight({
        type: InsightTypes.CLARITY,
        title: 'Document Complex Operations',
        description: 'Complex operation pattern detected without prior thinking. Consider adding thinking phase to clarify approach and document rationale.',
        impact: 'medium',
        feasibility: 'high'
      }));
    }
    
    // Check for insights from thinking
    if (reflection.insights.length > 0) {
      insights.push(new Insight({
        type: InsightTypes.CLARITY,
        title: 'Capture Thinking Insights',
        description: `Thinking produced ${reflection.insights.length} insights. Consider documenting these for future reference and team knowledge sharing.`,
        impact: 'low',
        feasibility: 'high'
      }));
    }
    
    // Check for tool usage patterns
    if (reflection.toolName.includes('mcp__') && !reflection.toolName.includes('desktop-commander')) {
      insights.push(new Insight({
        type: InsightTypes.CLARITY,
        title: 'Consider Desktop Commander Skills',
        description: `Using MCP tool ${reflection.toolName}. Consider using desktop-commander skill for even better token efficiency and simpler API.`,
        impact: 'low',
        feasibility: 'high'
      }));
    }
    
    // Check for operation clarity
    if (reflection.operation.length > 100) {
      insights.push(new Insight({
        type: InsightTypes.CLARITY,
        title: 'Improve Operation Description',
        description: 'Operation description is very long. Consider adding more structured context to improve clarity and debuggability.',
        impact: 'low',
        feasibility: 'medium'
      }));
    }
    
    // Learning from success
    if (reflection.type === 'SUCCESS' && reflection.insights.length > 0) {
      insights.push(new Insight({
        type: InsightTypes.CLARITY,
        title: 'Document Success Pattern',
        description: 'Successful operation with insights. Document this pattern as reusable approach for similar operations.',
        impact: 'medium',
        feasibility: 'high'
      }));
    }
    
    return insights;
  }
  
  /**
   * Get insights by type
   */
  getInsightsByType(type) {
    return this.insightsHistory.filter(insight => insight.type === type);
  }
  
  /**
   * Get high-priority insights
   */
  getHighPriorityInsights(minPriority = 6) {
    return this.insightsHistory
      .filter(insight => insight.priority >= minPriority && !insight.applied)
      .sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Get insights by impact level
   */
  getInsightsByImpact(impact) {
    return this.insightsHistory.filter(insight => insight.impact === impact);
  }
  
  /**
   * Mark insight as applied
   */
  markInsightApplied(insightId) {
    const insight = this.insightsHistory.find(i => i.id === insightId);
    if (insight) {
      insight.applied = true;
      insight.appliedAt = new Date().toISOString();
    }
  }
  
  /**
   * Get insight statistics
   */
  getStats() {
    const total = this.insightsHistory.length;
    const applied = this.insightsHistory.filter(i => i.applied).length;
    const pending = total - applied;
    
    return {
      total,
      applied,
      pending,
      applicationRate: total > 0 ? (applied / total * 100).toFixed(1) + '%' : '0%',
      byType: {
        optimization: this.insightsHistory.filter(i => i.type === InsightTypes.OPTIMIZATION).length,
        safety: this.insightsHistory.filter(i => i.type === InsightTypes.SAFETY).length,
        clarity: this.insightsHistory.filter(i => i.type === InsightTypes.CLARITY).length
      },
      byImpact: {
        high: this.insightsHistory.filter(i => i.impact === 'high').length,
        medium: this.insightsHistory.filter(i => i.impact === 'medium').length,
        low: this.insightsHistory.filter(i => i.impact === 'low').length
      },
      avgPriority: total > 0 
        ? (this.insightsHistory.reduce((sum, i) => sum + i.priority, 0) / total).toFixed(1)
        : 0
    };
  }
  
  /**
   * Get top insights across all categories
   */
  getTopInsights(limit = 10) {
    return this.insightsHistory
      .filter(i => !i.applied)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }
}

module.exports = InsightGenerator;
