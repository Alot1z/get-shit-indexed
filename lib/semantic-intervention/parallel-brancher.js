/**
 * Parallel Brancher (Heretic-API Style)
 * 
 * Creates parallel reasoning branches for complex problems.
 * Each branch represents a different approach to solving the problem.
 * Results are scored and the best approach is selected.
 * 
 * Inspired by Heretic-API's parallel branching pattern.
 */

const { callSequential, callTractatus, callDebug } = require('../thinking/mcp-connector');

// Branch strategy types
const BRANCH_STRATEGIES = {
  CONSERVATIVE: 'conservative',   // Safe, incremental approach
  MODERATE: 'moderate',           // Balanced approach
  AGGRESSIVE: 'aggressive',       // Bold, comprehensive approach
  ALTERNATIVE: 'alternative'      // Completely different approach
};

// Default branch templates
const BRANCH_TEMPLATES = {
  conservative: {
    name: 'Conservative Approach',
    description: 'Minimal changes, maximum safety',
    promptPrefix: 'Take a conservative, safe approach:',
    riskTolerance: 0.2,
    complexityLimit: 30
  },
  moderate: {
    name: 'Moderate Approach',
    description: 'Balanced changes with reasonable risk',
    promptPrefix: 'Take a balanced, moderate approach:',
    riskTolerance: 0.5,
    complexityLimit: 60
  },
  aggressive: {
    name: 'Aggressive Approach',
    description: 'Comprehensive changes, higher risk for better results',
    promptPrefix: 'Take an aggressive, comprehensive approach:',
    riskTolerance: 0.8,
    complexityLimit: 100
  },
  alternative: {
    name: 'Alternative Approach',
    description: 'Completely different solution path',
    promptPrefix: 'Consider a completely different approach:',
    riskTolerance: 0.6,
    complexityLimit: 80
  }
};

class ParallelBrancher {
  constructor(config = {}) {
    this.config = {
      maxBranches: config.maxBranches || 3,
      timeout: config.timeout || 5000,
      minConfidence: config.minConfidence || 0.5,
      strategies: config.strategies || ['conservative', 'moderate', 'aggressive'],
      useThinkingServer: config.useThinkingServer ?? true,
      ...config
    };
    
    this.metrics = {
      branchesCreated: 0,
      branchesSucceeded: 0,
      averageConfidence: 0,
      strategyDistribution: {}
    };
    
    this.activeBranches = new Map();
  }
  
  /**
   * Create parallel branches for a problem
   * @param {string} prompt - The problem prompt
   * @param {object} analysis - Semantic analysis result
   * @param {object} options - Branching options
   * @returns {Promise<object>} Branch results
   */
  async createBranches(prompt, analysis, options = {}) {
    const startTime = Date.now();
    const branchId = `branch-${Date.now()}`;
    
    // Determine which strategies to use
    const strategies = this._selectStrategies(analysis, options);
    
    // Create branch promises
    const branchPromises = strategies.map(strategy => 
      this._createBranch(prompt, analysis, strategy, options)
    );
    
    // Execute branches in parallel
    const results = await Promise.allSettled(branchPromises);
    
    // Process results
    const paths = results.map((result, index) => {
      const strategy = strategies[index];
      
      if (result.status === 'fulfilled') {
        this.metrics.branchesSucceeded++;
        return {
          strategy: strategy.name,
          strategyKey: strategies[index].key || 'unknown',
          success: true,
          solution: result.value.solution,
          reasoning: result.value.reasoning,
          confidence: result.value.confidence || this._calculateConfidence(result.value),
          riskLevel: result.value.riskLevel,
          steps: result.value.steps || [],
          duration: result.value.duration
        };
      } else {
        return {
          strategy: strategy.name || strategies[index],
          strategyKey: strategies[index].key || 'unknown',
          success: false,
          error: result.reason?.message || 'Unknown error',
          confidence: 0
        };
      }
    });
    
    // Calculate overall metrics
    const successfulPaths = paths.filter(p => p.success);
    const avgConfidence = successfulPaths.length > 0
      ? successfulPaths.reduce((sum, p) => sum + p.confidence, 0) / successfulPaths.length
      : 0;
    
    this.metrics.branchesCreated += strategies.length;
    this.metrics.averageConfidence = 
      (this.metrics.averageConfidence * (this.metrics.branchesCreated - strategies.length) + avgConfidence) /
      this.metrics.branchesCreated;
    
    // Update strategy distribution
    for (const strategy of strategies) {
      const key = strategy.key || strategy;
      this.metrics.strategyDistribution[key] = 
        (this.metrics.strategyDistribution[key] || 0) + 1;
    }
    
    return {
      branchId,
      prompt,
      strategies: strategies.map(s => s.name || s),
      paths,
      summary: {
        total: paths.length,
        succeeded: successfulPaths.length,
        failed: paths.length - successfulPaths.length,
        averageConfidence: avgConfidence,
        bestStrategy: this._findBestStrategy(paths),
        duration: Date.now() - startTime
      },
      recommendation: this._generateRecommendation(paths)
    };
  }
  
  /**
   * Select appropriate strategies based on analysis
   * @private
   */
  _selectStrategies(analysis, options) {
    // Override with options
    if (options.strategies) {
      return options.strategies.map(s => ({
        ...BRANCH_TEMPLATES[s],
        key: s
      })).filter(Boolean);
    }
    
    // Select based on analysis
    const selected = [];
    
    // Always include moderate as baseline
    selected.push({ ...BRANCH_TEMPLATES.moderate, key: 'moderate' });
    
    // Add conservative for high risk
    if (analysis.riskLevel === 'HIGH' || analysis.riskLevel === 'EXTREME') {
      selected.push({ ...BRANCH_TEMPLATES.conservative, key: 'conservative' });
    }
    
    // Add aggressive for low risk or high complexity
    if (analysis.riskLevel === 'LOW' || analysis.complexity > 60) {
      selected.push({ ...BRANCH_TEMPLATES.aggressive, key: 'aggressive' });
    }
    
    // Add alternative for ambiguous intents
    if (analysis.intent && analysis.intent.confidence < 0.5) {
      selected.push({ ...BRANCH_TEMPLATES.alternative, key: 'alternative' });
    }
    
    // Ensure at least 2 strategies for complex problems (unless maxBranches is 1)
    const maxBranches = options.maxBranches || this.config.maxBranches;
    if (selected.length < 2 && maxBranches >= 2) {
      // Add aggressive as second strategy for complex problems
      if (analysis.complexity >= 40 && !selected.find(s => s.key === 'aggressive')) {
        selected.push({ ...BRANCH_TEMPLATES.aggressive, key: 'aggressive' });
      } else if (!selected.find(s => s.key === 'conservative')) {
        // Otherwise add conservative
        selected.push({ ...BRANCH_TEMPLATES.conservative, key: 'conservative' });
      }
    }
    
    // Limit to maxBranches
    return selected.slice(0, maxBranches);
  }
  
  /**
   * Create a single branch
   * @private
   */
  async _createBranch(prompt, analysis, strategy, options) {
    const startTime = Date.now();
    const template = typeof strategy === 'string' 
      ? BRANCH_TEMPLATES[strategy] 
      : strategy;
    
    // Build branch prompt
    const branchPrompt = this._buildBranchPrompt(prompt, analysis, template);
    
    // Execute thinking
    let result;
    try {
      // Use Tractatus for structure, then Sequential for steps
      const tractatusResult = await callTractatus(branchPrompt, {
        timeout: this.config.timeout / 2
      });
      
      const sequentialResult = await callSequential(
        `Based on this analysis:\n${JSON.stringify(tractatusResult.result || {})}\n\nProvide step-by-step implementation steps.`,
        { timeout: this.config.timeout / 2 }
      );
      
      result = {
        structure: tractatusResult.result,
        steps: this._extractSteps(sequentialResult.result),
        raw: { tractatus: tractatusResult, sequential: sequentialResult }
      };
    } catch (error) {
      // Fallback to single server
      result = await callSequential(branchPrompt, {
        timeout: this.config.timeout
      });
    }
    
    return {
      solution: this._extractSolution(result),
      reasoning: result.structure || result.result,
      steps: result.steps || [],
      confidence: this._calculateConfidence(result),
      riskLevel: this._assessBranchRisk(result, template),
      duration: Date.now() - startTime
    };
  }
  
  /**
   * Build branch-specific prompt
   * @private
   */
  _buildBranchPrompt(prompt, analysis, template) {
    return `${template.promptPrefix}

Original Task: ${prompt}

Context:
- Complexity: ${analysis.complexity}/100
- Risk Level: ${analysis.riskLevel}
- Detected Frameworks: ${analysis.frameworks.join(', ') || 'None'}
- Intent: ${analysis.intent.primary}

Constraints for this approach:
- Risk Tolerance: ${template.riskTolerance * 100}%
- Maximum Complexity: ${template.complexityLimit}

Provide:
1. Structural analysis of the approach
2. Key considerations
3. Expected outcomes
4. Potential issues`;
  }
  
  /**
   * Extract solution from result
   * @private
   */
  _extractSolution(result) {
    if (!result) return null;
    
    // Try to extract from structure
    if (result.structure) {
      if (typeof result.structure === 'string') {
        return result.structure;
      }
      return JSON.stringify(result.structure);
    }
    
    // Try raw result
    if (result.raw) {
      const tractatus = result.raw.tractatus?.result;
      if (tractatus) {
        return typeof tractatus === 'string' 
          ? tractatus 
          : JSON.stringify(tractatus);
      }
    }
    
    return JSON.stringify(result);
  }
  
  /**
   * Extract steps from result
   * @private
   */
  _extractSteps(result) {
    if (!result) return [];
    
    // Try to parse steps from result
    if (typeof result === 'string') {
      const stepMatches = result.match(/(?:step|\d+\.)\s*(.+)/gi);
      if (stepMatches) {
        return stepMatches.map(s => s.trim());
      }
    }
    
    if (Array.isArray(result.steps)) {
      return result.steps;
    }
    
    return [];
  }
  
  /**
   * Calculate confidence score for a branch result
   * @private
   */
  _calculateConfidence(result) {
    if (!result) return 0;
    
    let confidence = 0.5; // Base confidence
    
    // Has structure
    if (result.structure) confidence += 0.2;
    
    // Has steps
    if (result.steps && result.steps.length > 0) confidence += 0.1;
    
    // Has solution
    if (result.solution) confidence += 0.1;
    
    // Raw results available
    if (result.raw && result.raw.tractatus?.success) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }
  
  /**
   * Assess risk level for branch
   * @private
   */
  _assessBranchRisk(result, template) {
    // Base risk from template
    let riskScore = template.riskTolerance * 100;
    
    // Adjust based on result complexity
    if (result.steps && result.steps.length > 5) {
      riskScore += 10;
    }
    
    // Categorize
    if (riskScore >= 70) return 'HIGH';
    if (riskScore >= 40) return 'MEDIUM';
    return 'LOW';
  }
  
  /**
   * Find best strategy from paths
   * @private
   */
  _findBestStrategy(paths) {
    const successful = paths.filter(p => p.success);
    if (successful.length === 0) return null;
    
    const sorted = [...successful].sort((a, b) => b.confidence - a.confidence);
    return sorted[0].strategy;
  }
  
  /**
   * Generate recommendation from paths
   * @private
   */
  _generateRecommendation(paths) {
    const successful = paths.filter(p => p.success);
    if (successful.length === 0) {
      return {
        action: 'retry',
        reason: 'All branch strategies failed',
        suggestedPrompt: 'Please provide more specific requirements'
      };
    }
    
    const best = successful.reduce((a, b) => 
      a.confidence > b.confidence ? a : b
    );
    
    return {
      action: 'proceed',
      strategy: best.strategy,
      confidence: best.confidence,
      reason: `${best.strategy} approach has highest confidence (${(best.confidence * 100).toFixed(0)}%)`,
      steps: best.steps,
      riskLevel: best.riskLevel
    };
  }
  
  /**
   * Get brancher metrics
   * @returns {object} Metrics
   */
  getStats() {
    return {
      ...this.metrics,
      successRate: this.metrics.branchesCreated > 0
        ? this.metrics.branchesSucceeded / this.metrics.branchesCreated
        : 0,
      activeBranches: this.activeBranches.size
    };
  }
  
  /**
   * Clear active branches
   */
  clearActive() {
    this.activeBranches.clear();
  }
  
  /**
   * Select the best branch from results
   * @param {object} branchResults - Results from createBranches()
   * @returns {object|null} Best branch or null if none successful
   */
  selectBestBranch(branchResults) {
    if (!branchResults || !branchResults.paths) {
      return null;
    }
    
    const successful = branchResults.paths.filter(p => p.success);
    if (successful.length === 0) {
      return null;
    }
    
    // Sort by confidence and return the best
    const sorted = [...successful].sort((a, b) => b.confidence - a.confidence);
    return sorted[0];
  }
}

module.exports = { ParallelBrancher, BRANCH_STRATEGIES, BRANCH_TEMPLATES };
