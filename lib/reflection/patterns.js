/**
 * Pattern Extraction System
 * 
 * Extracts reusable patterns from tool execution results.
 * Identifies recurring sequences, successful approaches, and anti-patterns.
 */

const fs = require('fs');
const path = require('path');
const { Pattern, PatternTypes } = require('./schema');

/**
 * Pattern Extraction Manager
 */
class PatternExtractor {
  constructor() {
    this.patternsPath = path.join(
      process.cwd(),
      '.planning',
      'patterns.json'
    );
    this.patterns = this.loadPatterns();
  }
  
  /**
   * Load patterns from storage
   */
  loadPatterns() {
    try {
      if (fs.existsSync(this.patternsPath)) {
        const content = fs.readFileSync(this.patternsPath, 'utf8');
        const data = JSON.parse(content);
        return data.patterns || [];
      }
    } catch (error) {
      console.error('[PATTERN-EXTRACTOR] Failed to load patterns:', error.message);
    }
    return [];
  }
  
  /**
   * Save patterns to storage
   */
  savePatterns() {
    try {
      const data = {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        patterns: this.patterns
      };
      
      // Ensure directory exists
      const dir = path.dirname(this.patternsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.patternsPath, JSON.stringify(data, null, 2));
      return true;
      
    } catch (error) {
      console.error('[PATTERN-EXTRACTOR] Failed to save patterns:', error.message);
      return false;
    }
  }
  
  /**
   * Extract patterns from reflection
   * @param {Reflection} reflection - Reflection to analyze
   * @returns {Array} Extracted patterns
   */
  extractPatterns(reflection) {
    const extracted = [];
    
    // Extract sequence patterns
    const sequencePatterns = this.extractSequencePatterns(reflection);
    extracted.push(...sequencePatterns);
    
    // Extract conditional patterns
    const conditionalPatterns = this.extractConditionalPatterns(reflection);
    extracted.push(...conditionalPatterns);
    
    // Extract error recovery patterns
    const errorRecoveryPatterns = this.extractErrorRecoveryPatterns(reflection);
    extracted.push(...errorRecoveryPatterns);
    
    // Update or add patterns
    extracted.forEach(extractedPattern => {
      this.updateOrAddPattern(extractedPattern);
    });
    
    // Save to storage
    this.savePatterns();
    
    return extracted;
  }
  
  /**
   * Extract sequence patterns (ordered operations)
   */
  extractSequencePatterns(reflection) {
    const patterns = [];
    
    // Check for common sequences
    
    // Pattern: Search → Get Symbol
    if (reflection.toolName.includes('search') && reflection.patterns.some(p => p.type === 'search-navigate')) {
      patterns.push(new Pattern({
        type: PatternTypes.SEQUENCE,
        name: 'Search then Navigate',
        description: 'Search for code pattern, then navigate to specific symbol',
        sequence: ['search_code_advanced', 'get_symbol_body'],
        frequency: 1,
        successRate: reflection.metadata.success ? 1 : 0
      }));
    }
    
    // Pattern: Read → Analyze → Write
    if (reflection.toolName.includes('read') && reflection.patterns.some(p => p.type === 'read-process-write')) {
      patterns.push(new Pattern({
        type: PatternTypes.SEQUENCE,
        name: 'Read-Process-Write',
        description: 'Read file, process content, write changes',
        sequence: ['read_file', 'edit_block', 'write_file'],
        frequency: 1,
        successRate: reflection.metadata.success ? 1 : 0
      }));
    }
    
    // Pattern: Thinking → Action
    if (reflection.patterns.some(p => p.type === 'think-then-act')) {
      patterns.push(new Pattern({
        type: PatternTypes.SEQUENCE,
        name: 'Think Then Act',
        description: 'Use thinking server before executing tool',
        sequence: ['sequentialthinking', 'tool_execution'],
        frequency: 1,
        successRate: reflection.metadata.success ? 1 : 0
      }));
    }
    
    return patterns;
  }
  
  /**
   * Extract conditional patterns (if-then logic)
   */
  extractConditionalPatterns(reflection) {
    const patterns = [];
    
    // Pattern: If error occurs, use specific recovery
    if (reflection.type === 'ERROR' && reflection.recommendations.length > 0) {
      const authRec = reflection.recommendations.find(r => r.type === 'auth');
      if (authRec) {
        patterns.push(new Pattern({
          type: PatternTypes.CONDITIONAL,
          name: 'Auth Error Recovery',
          description: 'If authentication error, check credentials before retry',
          condition: {
            if: 'error includes "authentication" or "unauthorized"',
            then: 'verify credentials and retry'
          },
          frequency: 1,
          successRate: 0
        }));
      }
      
      const networkRec = reflection.recommendations.find(r => r.type === 'network');
      if (networkRec) {
        patterns.push(new Pattern({
          type: PatternTypes.CONDITIONAL,
          name: 'Network Error Recovery',
          description: 'If network error, check connectivity before retry',
          condition: {
            if: 'error includes "ENOTFOUND" or "ECONNREFUSED"',
            then: 'verify network connectivity and endpoint'
          },
          frequency: 1,
          successRate: 0
        }));
      }
    }
    
    // Pattern: If large file, use comprehensive mode
    if (reflection.metadata.performance === 'slow') {
      patterns.push(new Pattern({
        type: PatternTypes.CONDITIONAL,
        name: 'Large File Handling',
        description: 'For large files or slow operations, use comprehensive thinking mode',
        condition: {
          if: 'operation duration > 30s',
          then: 'use comprehensive thinking mode with more analysis cycles'
        },
        frequency: 1,
        successRate: 1
      }));
    }
    
    return patterns;
  }
  
  /**
   * Extract error recovery patterns
   */
  extractErrorRecoveryPatterns(reflection) {
    const patterns = [];
    
    if (reflection.type !== 'ERROR') {
      return patterns;
    }
    
    // Pattern: Retry with different approach
    patterns.push(new Pattern({
      type: PatternTypes.ERROR_RECOVERY,
      name: 'Retry with Alternative',
      description: 'If tool fails, try alternative tool or approach',
      errorHandling: {
        errorType: 'general',
        recovery: 'identify alternative tool from tool-priority rules and retry'
      },
      frequency: 1,
      successRate: 0
    }));
    
    // Pattern: Timeout recovery
    if (reflection.output.error && reflection.output.error.includes('timeout')) {
      patterns.push(new Pattern({
        type: PatternTypes.ERROR_RECOVERY,
        name: 'Timeout Recovery',
        description: 'If operation times out, increase timeout or optimize query',
        errorHandling: {
          errorType: 'timeout',
          recovery: 'increase timeout parameter or refine search pattern to reduce scope'
        },
        frequency: 1,
        successRate: 0
      }));
    }
    
    return patterns;
  }
  
  /**
   * Update existing pattern or add new one
   */
  updateOrAddPattern(newPattern) {
    // Check if similar pattern exists
    const existing = this.patterns.find(p => 
      p.name === newPattern.name && 
      p.type === newPattern.type
    );
    
    if (existing) {
      // Update existing pattern
      existing.frequency++;
      existing.lastSeen = newPattern.lastSeen;
      
      // Update success rate (moving average)
      const totalAttempts = existing.frequency;
      const currentRate = existing.successRate;
      const newSuccess = newPattern.successRate;
      existing.successRate = (
        (currentRate * (totalAttempts - 1) + newSuccess) / totalAttempts
      );
      
      // Add example if not already present
      if (newPattern.examples && newPattern.examples.length > 0) {
        existing.examples = existing.examples || [];
        const exampleIds = existing.examples.map(e => e.id);
        newPattern.examples.forEach(ex => {
          if (!exampleIds.includes(ex.id)) {
            existing.examples.push(ex);
          }
        });
        
        // Keep only last 10 examples
        if (existing.examples.length > 10) {
          existing.examples = existing.examples.slice(-10);
        }
      }
      
    } else {
      // Add new pattern
      this.patterns.push(newPattern);
    }
  }
  
  /**
   * Find patterns matching tool sequence
   */
  findMatchingPatterns(toolSequence) {
    return this.patterns.filter(pattern => {
      if (pattern.type !== PatternTypes.SEQUENCE) {
        return false;
      }
      
      // Check if sequence matches (allowing for partial matches)
      const patternSeq = pattern.sequence || [];
      const inputSeq = toolSequence || [];
      
      if (patternSeq.length > inputSeq.length) {
        return false;
      }
      
      // Check if pattern sequence is contained in input sequence
      for (let i = 0; i <= inputSeq.length - patternSeq.length; i++) {
        const slice = inputSeq.slice(i, i + patternSeq.length);
        if (JSON.stringify(slice) === JSON.stringify(patternSeq)) {
          return true;
        }
      }
      
      return false;
    });
  }
  
  /**
   * Get patterns by type
   */
  getPatternsByType(type) {
    return this.patterns.filter(p => p.type === type);
  }
  
  /**
   * Get high-success patterns
   */
  getSuccessfulPatterns(minSuccessRate = 0.7, minFrequency = 2) {
    return this.patterns.filter(p => 
      p.successRate >= minSuccessRate && 
      p.frequency >= minFrequency
    ).sort((a, b) => b.successRate - a.successRate);
  }
  
  /**
   * Get anti-patterns (low success rate)
   */
  getAntiPatterns(maxSuccessRate = 0.3, minFrequency = 2) {
    return this.patterns.filter(p => 
      p.successRate <= maxSuccessRate && 
      p.frequency >= minFrequency
    ).sort((a, b) => a.successRate - b.successRate);
  }
  
  /**
   * Get pattern statistics
   */
  getStats() {
    return {
      total: this.patterns.length,
      byType: {
        sequence: this.patterns.filter(p => p.type === PatternTypes.SEQUENCE).length,
        conditional: this.patterns.filter(p => p.type === PatternTypes.CONDITIONAL).length,
        errorRecovery: this.patterns.filter(p => p.type === PatternTypes.ERROR_RECOVERY).length
      },
      highSuccess: this.getSuccessfulPatterns().length,
      antiPatterns: this.getAntiPatterns().length
    };
  }
}

module.exports = PatternExtractor;
