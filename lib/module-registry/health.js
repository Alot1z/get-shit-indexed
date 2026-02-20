/**
 * Module Health
 * 
 * Health monitoring and diagnostics for modules.
 * Tracks metrics, identifies issues, and provides recommendations.
 * 
 * @module lib/module-registry/health
 */

/**
 * Health check types
 */
const HEALTH_CHECKS = {
  FILE_COUNT: 'file_count',
  SIZE: 'size',
  COMPLEXITY: 'complexity',
  DEPENDENCIES: 'dependencies',
  DOCUMENTATION: 'documentation',
  TESTS: 'tests'
};

/**
 * Health levels
 */
const HEALTH_LEVELS = {
  HEALTHY: 'healthy',     // 80-100
  MODERATE: 'moderate',   // 60-79
  WARNING: 'warning',     // 40-59
  CRITICAL: 'critical'    // 0-39
};

/**
 * Module Health Class
 */
class ModuleHealth {
  constructor() {
    this.checkResults = new Map();
    this.thresholds = {
      maxFiles: 20,
      maxLines: 2000,
      maxFileSize: 300,
      minDocCoverage: 0.5,
      maxDependencies: 10
    };
  }
  
  /**
   * Run all health checks on a module
   * @param {object} module - Module info
   * @returns {object} Health report
   */
  check(module) {
    const results = {
      module: module.name,
      timestamp: new Date().toISOString(),
      checks: {},
      score: 100,
      level: HEALTH_LEVELS.HEALTHY,
      issues: [],
      recommendations: []
    };
    
    // Run individual checks
    results.checks.fileCount = this.checkFileCount(module);
    results.checks.size = this.checkSize(module);
    results.checks.complexity = this.checkComplexity(module);
    results.checks.dependencies = this.checkDependencies(module);
    results.checks.documentation = this.checkDocumentation(module);
    results.checks.tests = this.checkTests(module);
    
    // Calculate overall score
    const scores = Object.values(results.checks).map(c => c.score);
    results.score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    results.level = this.scoreToLevel(results.score);
    
    // Aggregate issues and recommendations
    for (const check of Object.values(results.checks)) {
      results.issues.push(...check.issues);
      results.recommendations.push(...check.recommendations);
    }
    
    // Store result
    this.checkResults.set(module.name, results);
    
    return results;
  }
  
  /**
   * Check file count health
   * @param {object} module - Module info
   * @returns {object} Check result
   */
  checkFileCount(module) {
    const result = { score: 100, issues: [], recommendations: [] };
    const count = module.stats?.fileCount || 0;
    
    if (count === 0) {
      result.score = 0;
      result.issues.push('No files found');
      result.recommendations.push('Verify module exists and has content');
    } else if (count > this.thresholds.maxFiles) {
      result.score = 70;
      result.issues.push(`High file count: ${count}`);
      result.recommendations.push('Consider splitting into sub-modules');
    }
    
    return result;
  }
  
  /**
   * Check size health
   * @param {object} module - Module info
   * @returns {object} Check result
   */
  checkSize(module) {
    const result = { score: 100, issues: [], recommendations: [] };
    const lines = module.stats?.totalLines || 0;
    
    if (lines > this.thresholds.maxLines) {
      result.score = 60;
      result.issues.push(`Large module: ${lines} lines`);
      result.recommendations.push('Consider refactoring into smaller modules');
    }
    
    const avgSize = module.stats?.avgLinesPerFile || 0;
    if (avgSize > this.thresholds.maxFileSize) {
      result.score = Math.min(result.score, 70);
      result.issues.push(`Large files: avg ${avgSize} lines`);
      result.recommendations.push('Split large files into smaller units');
    }
    
    return result;
  }
  
  /**
   * Check complexity health
   * @param {object} module - Module info
   * @returns {object} Check result
   */
  checkComplexity(module) {
    const result = { score: 100, issues: [], recommendations: [] };
    
    // Estimate complexity based on file structure
    const avgLines = module.stats?.avgLinesPerFile || 0;
    
    if (avgLines > 200) {
      result.score = 70;
      result.issues.push(`Potential high complexity: avg ${avgLines} lines/file`);
      result.recommendations.push('Review for complexity reduction opportunities');
    }
    
    return result;
  }
  
  /**
   * Check dependencies health
   * @param {object} module - Module info
   * @returns {object} Check result
   */
  checkDependencies(module) {
    const result = { score: 100, issues: [], recommendations: [] };
    const deps = module.dependencies || [];
    
    if (deps.length > this.thresholds.maxDependencies) {
      result.score = 70;
      result.issues.push(`Many dependencies: ${deps.length}`);
      result.recommendations.push('Consider reducing dependency count');
    }
    
    // Check for circular dependencies
    for (const dep of deps) {
      if (dep.includes('..') && dep.split('..').length > 2) {
        result.score = Math.min(result.score, 60);
        result.issues.push(`Deep relative import: ${dep}`);
        result.recommendations.push('Consider restructuring module paths');
      }
    }
    
    return result;
  }
  
  /**
   * Check documentation health
   * @param {object} module - Module info
   * @returns {object} Check result
   */
  checkDocumentation(module) {
    const result = { score: 100, issues: [], recommendations: [] };
    
    // Check for description
    if (!module.description) {
      result.score = 70;
      result.issues.push('Missing module description');
      result.recommendations.push('Add JSDoc description to index.js');
    }
    
    // Check for README
    const hasReadme = module.files?.some(f => 
      f.name.toLowerCase() === 'readme.md'
    ) || false;
    
    if (!hasReadme && (module.stats?.fileCount || 0) > 3) {
      result.score = Math.min(result.score, 80);
      result.issues.push('No README.md for multi-file module');
      result.recommendations.push('Add README.md with usage examples');
    }
    
    return result;
  }
  
  /**
   * Check test health
   * @param {object} module - Module info
   * @returns {object} Check result
   */
  checkTests(module) {
    const result = { score: 100, issues: [], recommendations: [] };
    
    // Check for test files
    const hasTests = module.files?.some(f => 
      f.name.includes('.test.') || f.name.includes('.spec.') || 
      f.path.includes('__tests__')
    ) || false;
    
    if (!hasTests) {
      result.score = 60;
      result.issues.push('No test files found');
      result.recommendations.push('Add unit tests for module functionality');
    }
    
    return result;
  }
  
  /**
   * Convert score to level
   * @param {number} score - Score (0-100)
   * @returns {string} Health level
   */
  scoreToLevel(score) {
    if (score >= 80) return HEALTH_LEVELS.HEALTHY;
    if (score >= 60) return HEALTH_LEVELS.MODERATE;
    if (score >= 40) return HEALTH_LEVELS.WARNING;
    return HEALTH_LEVELS.CRITICAL;
  }
  
  /**
   * Get health history for module
   * @param {string} moduleName - Module name
   * @returns {object|null} Last check result
   */
  getHistory(moduleName) {
    return this.checkResults.get(moduleName) || null;
  }
  
  /**
   * Get all modules with issues
   * @returns {Array} Modules with issues
   */
  getModulesWithIssues() {
    const withIssues = [];
    
    for (const [name, result] of this.checkResults) {
      if (result.issues.length > 0) {
        withIssues.push({
          name,
          score: result.score,
          level: result.level,
          issueCount: result.issues.length
        });
      }
    }
    
    return withIssues.sort((a, b) => a.score - b.score);
  }
  
  /**
   * Generate health report
   * @returns {string} Markdown report
   */
  generateReport() {
    const modules = Array.from(this.checkResults.values());
    const healthy = modules.filter(m => m.level === HEALTH_LEVELS.HEALTHY).length;
    const moderate = modules.filter(m => m.level === HEALTH_LEVELS.MODERATE).length;
    const warning = modules.filter(m => m.level === HEALTH_LEVELS.WARNING).length;
    const critical = modules.filter(m => m.level === HEALTH_LEVELS.CRITICAL).length;
    
    let report = `# Module Health Report\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n\n`;
    
    report += `## Summary\n\n`;
    report += `| Level | Count |\n`;
    report += `|-------|-------|\n`;
    report += `| Healthy | ${healthy} |\n`;
    report += `| Moderate | ${moderate} |\n`;
    report += `| Warning | ${warning} |\n`;
    report += `| Critical | ${critical} |\n\n`;
    
    // List modules with issues
    const withIssues = modules.filter(m => m.issues.length > 0)
      .sort((a, b) => a.score - b.score);
    
    if (withIssues.length > 0) {
      report += `## Modules with Issues\n\n`;
      
      for (const mod of withIssues) {
        report += `### ${mod.module} (${mod.score}/100)\n\n`;
        report += `**Level:** ${mod.level}\n\n`;
        
        if (mod.issues.length > 0) {
          report += `**Issues:**\n`;
          for (const issue of mod.issues) {
            report += `- ${issue}\n`;
          }
          report += `\n`;
        }
        
        if (mod.recommendations.length > 0) {
          report += `**Recommendations:**\n`;
          for (const rec of mod.recommendations) {
            report += `- ${rec}\n`;
          }
          report += `\n`;
        }
      }
    }
    
    return report;
  }
}

module.exports = { ModuleHealth, HEALTH_CHECKS, HEALTH_LEVELS };
