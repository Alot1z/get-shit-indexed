/**
 * Debug-Thinking Integration
 * 
 * Connects reflection capture to debug-thinking knowledge graph.
 * Stores observations, links to problems/hypotheses, and enables pattern learning.
 */

const fs = require('fs');
const path = require('path');

/**
 * Debug-Thinking Integration Manager
 */
class DebugThinkingIntegration {
  constructor() {
    this.debugGraphPath = path.join(
      process.env.USERPROFILE || process.env.HOME || '',
      '.debug-thinking-mcp'
    );
    this.reflectionPath = path.join(this.debugGraphPath, 'reflections');
    this.ensureDirectories();
  }
  
  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    try {
      if (!fs.existsSync(this.debugGraphPath)) {
        fs.mkdirSync(this.debugGraphPath, { recursive: true });
      }
      
      if (!fs.existsSync(this.reflectionPath)) {
        fs.mkdirSync(this.reflectionPath, { recursive: true });
      }
    } catch (error) {
      // Non-blocking - log but don't fail
      console.error('[DEBUG-INTEGRATION] Failed to create directories:', error.message);
    }
  }
  
  /**
   * Store reflection as observation in debug graph
   * @param {Reflection} reflection - Reflection object to store
   * @returns {object|null} Observation node or null if failed
   */
  async storeReflection(reflection) {
    try {
      // Create observation node
      const observation = {
        nodeType: 'observation',
        content: this.formatObservationContent(reflection),
        timestamp: reflection.timestamp,
        metadata: {
          toolName: reflection.toolName,
          type: reflection.type,
          success: reflection.metadata.success,
          duration: reflection.metadata.duration
        },
        tags: this.generateTags(reflection)
      };
      
      // Store to file (MCP integration would be via mcp__debug-thinking__debug_thinking)
      const filename = `observation_${Date.now()}_${this.sanitizeId(reflection.toolName)}.json`;
      const filepath = path.join(this.reflectionPath, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(observation, null, 2));
      
      // Also log to observations.jsonl for easy querying
      const logFile = path.join(this.reflectionPath, 'observations.jsonl');
      const logEntry = JSON.stringify({
        id: this.generateObservationId(reflection),
        ...observation
      });
      
      fs.appendFileSync(logFile, logEntry + '\n');
      
      return observation;
      
    } catch (error) {
      // Non-blocking - reflection capture shouldn't fail the system
      console.error('[DEBUG-INTEGRATION] Failed to store reflection:', error.message);
      return null;
    }
  }
  
  /**
   * Query related problems from debug graph
   * @param {string} pattern - Pattern to search for
   * @returns {Array} Related problems
   */
  async queryRelatedProblems(pattern) {
    try {
      const logFile = path.join(this.reflectionPath, 'observations.jsonl');
      
      if (!fs.existsSync(logFile)) {
        return [];
      }
      
      const content = fs.readFileSync(logFile, 'utf8');
      const observations = content.split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            return null;
          }
        })
        .filter(obs => obs !== null);
      
      // Find observations matching the pattern
      const patternLower = pattern.toLowerCase();
      const related = observations.filter(obs => {
        const content = JSON.stringify(obs).toLowerCase();
        return content.includes(patternLower);
      });
      
      return related.slice(0, 10); // Limit to 10 results
      
    } catch (error) {
      console.error('[DEBUG-INTEGRATION] Failed to query problems:', error.message);
      return [];
    }
  }
  
  /**
   * Link observation to hypothesis node
   * @param {string} observationId - Observation ID
   * @param {string} hypothesisId - Hypothesis ID
   * @param {number} strength - Relationship strength (0-1)
   * @returns {boolean} Success status
   */
  async linkToHypothesis(observationId, hypothesisId, strength = 0.8) {
    try {
      // Create link record
      const link = {
        from: observationId,
        to: hypothesisId,
        type: 'supports',
        strength: strength,
        timestamp: new Date().toISOString()
      };
      
      // Store to links.jsonl
      const linksFile = path.join(this.reflectionPath, 'links.jsonl');
      fs.appendFileSync(linksFile, JSON.stringify(link) + '\n');
      
      return true;
      
    } catch (error) {
      console.error('[DEBUG-INTEGRATION] Failed to create link:', error.message);
      return false;
    }
  }
  
  /**
   * Create hypothesis node from reflection
   * @param {Reflection} reflection - Reflection to generate hypothesis from
   * @returns {object|null} Hypothesis node or null
   */
  async createHypothesis(reflection) {
    try {
      if (reflection.type === 'SUCCESS') {
        // Success hypothesis: "This approach works"
        const hypothesis = {
          nodeType: 'hypothesis',
          content: `Approach using ${reflection.toolName} is effective for ${reflection.operation}`,
          confidence: 0.7,
          timestamp: new Date().toISOString(),
          metadata: {
            toolName: reflection.toolName,
            operation: reflection.operation,
            basedOn: 'success'
          }
        };
        
        return hypothesis;
        
      } else if (reflection.type === 'ERROR') {
        // Error hypothesis: "This approach causes errors"
        const hypothesis = {
          nodeType: 'hypothesis',
          content: `Approach using ${reflection.toolName} may cause errors: ${reflection.output.error}`,
          confidence: 0.6,
          timestamp: new Date().toISOString(),
          metadata: {
            toolName: reflection.toolName,
            operation: reflection.operation,
            basedOn: 'error'
          }
        };
        
        return hypothesis;
      }
      
      return null;
      
    } catch (error) {
      console.error('[DEBUG-INTEGRATION] Failed to create hypothesis:', error.message);
      return null;
    }
  }
  
  /**
   * Create learning node from reflection insights
   * @param {Reflection} reflection - Reflection with insights
   * @returns {object|null} Learning node or null
   */
  async createLearning(reflection) {
    try {
      if (!reflection.insights || reflection.insights.length === 0) {
        return null;
      }
      
      const learning = {
        nodeType: 'learning',
        content: reflection.insights.map(i => i.content).join('; '),
        insights: reflection.insights,
        timestamp: new Date().toISOString(),
        metadata: {
          toolName: reflection.toolName,
          operation: reflection.operation,
          insightCount: reflection.insights.length
        }
      };
      
      // Store learning node
      const filename = `learning_${Date.now()}.json`;
      const filepath = path.join(this.reflectionPath, filename);
      fs.writeFileSync(filepath, JSON.stringify(learning, null, 2));
      
      return learning;
      
    } catch (error) {
      console.error('[DEBUG-INTEGRATION] Failed to create learning:', error.message);
      return null;
    }
  }
  
  /**
   * Format observation content from reflection
   */
  formatObservationContent(reflection) {
    const parts = [];
    
    parts.push(`Tool: ${reflection.toolName}`);
    parts.push(`Operation: ${reflection.operation}`);
    parts.push(`Type: ${reflection.type}`);
    
    if (reflection.output.error) {
      parts.push(`Error: ${reflection.output.error}`);
    }
    
    if (reflection.insights.length > 0) {
      parts.push(`Insights: ${reflection.insights.map(i => i.content).join('; ')}`);
    }
    
    return parts.join(' | ');
  }
  
  /**
   * Generate tags for reflection
   */
  generateTags(reflection) {
    const tags = [];
    
    // Add type tag
    tags.push(reflection.type.toLowerCase());
    
    // Add tool name tag (simplified)
    const toolSimple = reflection.toolName.replace(/^mcp__.*?__/, '').replace(/__/g, '-');
    tags.push(toolSimple);
    
    // Add performance tag
    if (reflection.metadata.performance) {
      tags.push(`perf-${reflection.metadata.performance}`);
    }
    
    // Add pattern tags
    reflection.patterns.forEach(pattern => {
      tags.push(`pattern-${pattern.type}`);
    });
    
    return tags;
  }
  
  /**
   * Generate unique observation ID
   */
  generateObservationId(reflection) {
    const toolId = this.sanitizeId(reflection.toolName);
    const timestamp = new Date(reflection.timestamp).getTime();
    const random = Math.random().toString(36).substr(2, 9);
    return `obs_${toolId}_${timestamp}_${random}`;
  }
  
  /**
   * Sanitize ID for safe filenames
   */
  sanitizeId(id) {
    return id
      .replace(/^mcp__.*?__/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
  }
  
  /**
   * Get reflection statistics
   */
  getStats() {
    try {
      const logFile = path.join(this.reflectionPath, 'observations.jsonl');
      
      if (!fs.existsSync(logFile)) {
        return { total: 0, byType: {}, byTool: {} };
      }
      
      const content = fs.readFileSync(logFile, 'utf8');
      const observations = content.split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            return null;
          }
        })
        .filter(obs => obs !== null);
      
      const stats = {
        total: observations.length,
        byType: {},
        byTool: {}
      };
      
      observations.forEach(obs => {
        // Count by type
        const type = obs.metadata?.type || 'unknown';
        stats.byType[type] = (stats.byType[type] || 0) + 1;
        
        // Count by tool
        const tool = obs.metadata?.toolName || 'unknown';
        stats.byTool[tool] = (stats.byTool[tool] || 0) + 1;
      });
      
      return stats;
      
    } catch (error) {
      console.error('[DEBUG-INTEGRATION] Failed to get stats:', error.message);
      return { total: 0, byType: {}, byTool: {} };
    }
  }
}

module.exports = DebugThinkingIntegration;
