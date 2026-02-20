/**
 * Intervention Logger
 * 
 * Logs all semantic interventions for analysis and learning.
 * Tracks intervention effectiveness and patterns.
 */

const fs = require('fs');
const path = require('path');

class InterventionLogger {
  constructor(config = {}) {
    this.config = {
      logToFile: config.logToFile ?? false,
      logPath: config.logPath || './logs/interventions.json',
      maxLogSize: config.maxLogSize || 10000,
      enableAnalytics: config.enableAnalytics ?? true,
      ...config
    };
    
    this.entries = [];
    this.analytics = {
      totalInterventions: 0,
      byType: {},
      byOutcome: {
        success: 0,
        partial: 0,
        failed: 0,
        unknown: 0
      },
      averageConfidence: 0,
      topTriggers: [],
      effectivenessByType: {}
    };
    
    // Ensure log directory exists
    if (this.config.logToFile) {
      const logDir = path.dirname(this.config.logPath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
  }
  
  /**
   * Log an intervention event
   * @param {object} event - Event to log
   */
  log(event) {
    const logEntry = {
      id: `intervention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      datetime: new Date().toISOString(),
      ...event
    };
    
    // Add to in-memory log
    this.entries.push(logEntry);
    
    // Trim if over size limit
    if (this.entries.length > this.config.maxLogSize) {
      this.entries = this.entries.slice(-Math.floor(this.config.maxLogSize * 0.8));
    }
    
    // Update analytics
    if (this.config.enableAnalytics) {
      this._updateAnalytics(logEntry);
    }
    
    // Write to file if enabled
    if (this.config.logToFile) {
      this._writeToFile(logEntry);
    }
    
    return logEntry.id;
  }
  
  /**
   * Update an intervention with outcome
   * @param {string} id - Intervention ID
   * @param {object} outcome - Outcome data
   */
  updateOutcome(id, outcome) {
    const entry = this.entries.find(e => e.id === id);
    if (entry) {
      entry.outcome = {
        ...outcome,
        timestamp: Date.now()
      };
      
      // Update analytics for outcome
      if (this.config.enableAnalytics && outcome.status) {
        this.analytics.byOutcome[outcome.status] = 
          (this.analytics.byOutcome[outcome.status] || 0) + 1;
        
        // Update effectiveness by type
        if (entry.type) {
          if (!this.analytics.effectivenessByType[entry.type]) {
            this.analytics.effectivenessByType[entry.type] = {
              total: 0,
              success: 0
            };
          }
          this.analytics.effectivenessByType[entry.type].total++;
          if (outcome.status === 'success') {
            this.analytics.effectivenessByType[entry.type].success++;
          }
        }
      }
    }
  }
  
  /**
   * Update analytics with new entry
   * @private
   */
  _updateAnalytics(entry) {
    this.analytics.totalInterventions++;
    
    // Count by type
    if (entry.type) {
      this.analytics.byType[entry.type] = 
        (this.analytics.byType[entry.type] || 0) + 1;
    }
    
    // Track average confidence
    if (entry.analysis?.riskScore !== undefined) {
      const prevAvg = this.analytics.averageConfidence;
      const prevCount = this.analytics.totalInterventions - 1;
      this.analytics.averageConfidence = 
        (prevAvg * prevCount + (100 - entry.analysis.riskScore) / 100) / 
        this.analytics.totalInterventions;
    }
    
    // Track triggers
    if (entry.trigger) {
      const existing = this.analytics.topTriggers.find(t => t.trigger === entry.trigger);
      if (existing) {
        existing.count++;
      } else {
        this.analytics.topTriggers.push({ trigger: entry.trigger, count: 1 });
      }
      // Keep top 10
      this.analytics.topTriggers.sort((a, b) => b.count - a.count);
      this.analytics.topTriggers = this.analytics.topTriggers.slice(0, 10);
    }
  }
  
  /**
   * Write entry to file
   * @private
   */
  _writeToFile(entry) {
    try {
      let existing = [];
      if (fs.existsSync(this.config.logPath)) {
        const content = fs.readFileSync(this.config.logPath, 'utf8');
        try {
          existing = JSON.parse(content);
          if (!Array.isArray(existing)) existing = [];
        } catch (e) {
          existing = [];
        }
      }
      
      existing.push(entry);
      
      // Rotate if too large
      if (existing.length > this.config.maxLogSize) {
        existing = existing.slice(-Math.floor(this.config.maxLogSize * 0.8));
      }
      
      fs.writeFileSync(this.config.logPath, JSON.stringify(existing, null, 2));
    } catch (error) {
      console.error('Failed to write intervention log:', error.message);
    }
  }
  
  /**
   * Get log entries
   * @param {object} filter - Filter options
   * @returns {array} Filtered log entries
   */
  getEntries(filter = {}) {
    let entries = [...this.entries];
    
    if (filter.type) {
      entries = entries.filter(e => e.type === filter.type);
    }
    
    if (filter.since) {
      entries = entries.filter(e => e.timestamp >= filter.since);
    }
    
    if (filter.limit) {
      entries = entries.slice(-filter.limit);
    }
    
    return entries;
  }
  
  /**
   * Get statistics
   * @returns {object} Statistics
   */
  getStats() {
    return {
      ...this.analytics,
      logSize: this.entries.length,
      effectiveness: this._calculateOverallEffectiveness()
    };
  }
  
  /**
   * Calculate overall effectiveness
   * @private
   */
  _calculateOverallEffectiveness() {
    const outcomes = this.analytics.byOutcome;
    const total = outcomes.success + outcomes.partial + outcomes.failed + outcomes.unknown;
    
    if (total === 0) return 0;
    
    return {
      overall: (outcomes.success + outcomes.partial * 0.5) / total,
      successRate: outcomes.success / total,
      partialRate: outcomes.partial / total,
      failureRate: outcomes.failed / total
    };
  }
  
  /**
   * Export log to file
   * @param {string} filePath - Export path
   */
  export(filePath) {
    const exportData = {
      exported: new Date().toISOString(),
      analytics: this.analytics,
      entries: this.entries
    };
    
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
  }
  
  /**
   * Clear log
   */
  clear() {
    this.entries = [];
    this.analytics = {
      totalInterventions: 0,
      byType: {},
      byOutcome: {
        success: 0,
        partial: 0,
        failed: 0,
        unknown: 0
      },
      averageConfidence: 0,
      topTriggers: [],
      effectivenessByType: {}
    };
  }
  
  /**
   * Get learning patterns from log
   * @returns {object} Learned patterns
   */
  getLearnedPatterns() {
    const patterns = {
      commonTriggers: this.analytics.topTriggers,
      effectiveInterventions: [],
      ineffectiveInterventions: [],
      recommendations: []
    };
    
    // Analyze effectiveness by type
    for (const [type, data] of Object.entries(this.analytics.effectivenessByType)) {
      const effectiveness = data.total > 0 ? data.success / data.total : 0;
      
      if (effectiveness > 0.7) {
        patterns.effectiveInterventions.push({
          type,
          effectiveness,
          sampleSize: data.total
        });
      } else if (effectiveness < 0.3 && data.total > 5) {
        patterns.ineffectiveInterventions.push({
          type,
          effectiveness,
          sampleSize: data.total
        });
      }
    }
    
    // Generate recommendations
    if (patterns.ineffectiveInterventions.length > 0) {
      patterns.recommendations.push({
        type: 'avoid',
        message: `Consider avoiding intervention types: ${patterns.ineffectiveInterventions.map(i => i.type).join(', ')}`,
        data: patterns.ineffectiveInterventions
      });
    }
    
    if (patterns.effectiveInterventions.length > 0) {
      patterns.recommendations.push({
        type: 'prefer',
        message: `Prefer intervention types: ${patterns.effectiveInterventions.map(i => i.type).join(', ')}`,
        data: patterns.effectiveInterventions
      });
    }
    
    return patterns;
  }
}

module.exports = { InterventionLogger };
