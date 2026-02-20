/**
 * Module Registry
 * 
 * Central registry for all lib/ modules with metadata,
 * health metrics, and classification.
 * 
 * @module lib/module-registry/registry
 */

const fs = require('fs');
const path = require('path');

/**
 * Module categories
 */
const MODULE_CATEGORIES = {
  CORE: 'core',           // Essential functionality
  INTEGRATION: 'integration', // External integrations
  ENHANCEMENT: 'enhancement', // Prompt/workflow enhancement
  ANALYSIS: 'analysis',   // Code analysis
  ORCHESTRATION: 'orchestration', // Workflow orchestration
  UTILITY: 'utility',     // Helper utilities
  LEGACY: 'legacy'        // Deprecated/to be removed
};

/**
 * Module status types
 */
const MODULE_STATUS = {
  ACTIVE: 'active',
  DEPRECATED: 'deprecated',
  ARCHIVED: 'archived',
  EXPERIMENTAL: 'experimental'
};

/**
 * Module Registry Class
 */
class ModuleRegistry {
  constructor(libPath = 'lib') {
    this.libPath = libPath;
    this.modules = new Map();
    this.indexes = {
      byCategory: new Map(),
      byStatus: new Map(),
      byDependency: new Map()
    };
  }
  
  /**
   * Scan and register all modules in lib/
   */
  scan() {
    const modules = this.discoverModules(this.libPath);
    
    for (const modulePath of modules) {
      this.registerModule(modulePath);
    }
    
    return this.modules.size;
  }
  
  /**
   * Discover modules in directory
   * @param {string} dir - Directory to scan
   * @returns {Array} Module paths
   */
  discoverModules(dir) {
    const modules = [];
    
    if (!fs.existsSync(dir)) {
      return modules;
    }
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Check if it's a module directory
        const indexPath = path.join(fullPath, 'index.js');
        if (fs.existsSync(indexPath)) {
          modules.push(fullPath);
        } else {
          // Recurse into subdirectory
          modules.push(...this.discoverModules(fullPath));
        }
      }
    }
    
    return modules;
  }
  
  /**
   * Register a module
   * @param {string} modulePath - Path to module
   */
  registerModule(modulePath) {
    const name = path.basename(modulePath);
    const indexPath = path.join(modulePath, 'index.js');
    
    // Gather module info
    const info = this.analyzeModule(modulePath, indexPath);
    
    // Register in main map
    this.modules.set(name, {
      name,
      path: modulePath,
      ...info,
      registeredAt: new Date().toISOString()
    });
    
    // Update indexes
    this.indexModule(name, info);
  }
  
  /**
   * Analyze module structure and content
   * @param {string} modulePath - Module path
   * @param {string} indexPath - Index file path
   * @returns {object} Module info
   */
  analyzeModule(modulePath, indexPath) {
    const files = this.listFiles(modulePath);
    const stats = this.gatherStats(files);
    const metadata = this.extractMetadata(indexPath);
    
    return {
      files,
      stats,
      category: metadata.category || this.classifyModule(modulePath, files),
      status: metadata.status || MODULE_STATUS.ACTIVE,
      description: metadata.description || '',
      dependencies: metadata.dependencies || this.extractDependencies(files),
      exports: metadata.exports || this.extractExports(indexPath),
      health: this.calculateHealth(stats)
    };
  }
  
  /**
   * List files in module
   * @param {string} modulePath - Module path
   * @returns {Array} File list
   */
  listFiles(modulePath) {
    const files = [];
    
    const scan = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && entry.name !== 'node_modules') {
          scan(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
          files.push({
            name: entry.name,
            path: fullPath,
            size: fs.statSync(fullPath).size,
            lines: this.countLines(fullPath)
          });
        }
      }
    };
    
    scan(modulePath);
    return files;
  }
  
  /**
   * Count lines in file
   * @param {string} filePath - File path
   * @returns {number} Line count
   */
  countLines(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.split('\n').length;
    } catch {
      return 0;
    }
  }
  
  /**
   * Gather statistics from files
   * @param {Array} files - File list
   * @returns {object} Statistics
   */
  gatherStats(files) {
    return {
      fileCount: files.length,
      totalLines: files.reduce((sum, f) => sum + f.lines, 0),
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      avgLinesPerFile: files.length > 0 ? 
        Math.round(files.reduce((sum, f) => sum + f.lines, 0) / files.length) : 0
    };
  }
  
  /**
   * Extract metadata from index.js
   * @param {string} indexPath - Index file path
   * @returns {object} Metadata
   */
  extractMetadata(indexPath) {
    const metadata = {};
    
    try {
      const content = fs.readFileSync(indexPath, 'utf8');
      
      // Extract JSDoc description
      const descMatch = content.match(/@description\s+(.+)/);
      if (descMatch) {
        metadata.description = descMatch[1].trim();
      }
      
      // Extract module marker
      const moduleMatch = content.match(/@module\s+(.+)/);
      if (moduleMatch) {
        metadata.module = moduleMatch[1].trim();
      }
      
    } catch {
      // File not readable
    }
    
    return metadata;
  }
  
  /**
   * Classify module by path and files
   * @param {string} modulePath - Module path
   * @param {Array} files - File list
   * @returns {string} Category
   */
  classifyModule(modulePath, files) {
    const pathLower = modulePath.toLowerCase();
    const fileNames = files.map(f => f.name.toLowerCase()).join(' ');
    
    // Classification heuristics
    if (pathLower.includes('integration') || fileNames.includes('integration')) {
      return MODULE_CATEGORIES.INTEGRATION;
    }
    if (pathLower.includes('enhancement') || pathLower.includes('enhancer')) {
      return MODULE_CATEGORIES.ENHANCEMENT;
    }
    if (pathLower.includes('analysis') || pathLower.includes('analyzer')) {
      return MODULE_CATEGORIES.ANALYSIS;
    }
    if (pathLower.includes('orchestrat') || fileNames.includes('orchestrator')) {
      return MODULE_CATEGORIES.ORCHESTRATION;
    }
    if (pathLower.includes('util') || pathLower.includes('helper')) {
      return MODULE_CATEGORIES.UTILITY;
    }
    
    return MODULE_CATEGORIES.CORE;
  }
  
  /**
   * Extract dependencies from files
   * @param {Array} files - File list
   * @returns {Array} Dependencies
   */
  extractDependencies(files) {
    const deps = new Set();
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file.path, 'utf8');
        
        // Match require statements
        const requireMatches = content.matchAll(/require\(['"]([^'"]+)['"]\)/g);
        for (const match of requireMatches) {
          const dep = match[1];
          if (dep.startsWith('./') || dep.startsWith('../')) {
            deps.add(dep);
          }
        }
        
        // Match import statements
        const importMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
        for (const match of importMatches) {
          const dep = match[1];
          if (dep.startsWith('./') || dep.startsWith('../')) {
            deps.add(dep);
          }
        }
      } catch {
        // File not readable
      }
    }
    
    return Array.from(deps);
  }
  
  /**
   * Extract exports from index.js
   * @param {string} indexPath - Index file path
   * @returns {Array} Exports
   */
  extractExports(indexPath) {
    const exports = [];
    
    try {
      const content = fs.readFileSync(indexPath, 'utf8');
      
      // Match module.exports
      const moduleExportsMatch = content.match(/module\.exports\s*=\s*\{([^}]+)\}/);
      if (moduleExportsMatch) {
        const match = moduleExportsMatch[1];
        const names = match.match(/(\w+)/g);
        if (names) {
          exports.push(...names);
        }
      }
      
    } catch {
      // File not readable
    }
    
    return exports;
  }
  
  /**
   * Calculate module health score
   * @param {object} stats - Module stats
   * @returns {object} Health info
   */
  calculateHealth(stats) {
    let score = 100;
    const issues = [];
    
    // Check file count
    if (stats.fileCount === 0) {
      score -= 50;
      issues.push('No files found');
    } else if (stats.fileCount > 20) {
      score -= 10;
      issues.push('High file count - consider splitting');
    }
    
    // Check size
    if (stats.totalLines > 2000) {
      score -= 15;
      issues.push('Large module - consider refactoring');
    }
    
    // Check average file size
    if (stats.avgLinesPerFile > 300) {
      score -= 10;
      issues.push('Large files - consider splitting');
    }
    
    return {
      score: Math.max(0, score),
      level: this.getHealthLevel(score),
      issues
    };
  }
  
  /**
   * Get health level from score
   * @param {number} score - Health score
   * @returns {string} Health level
   */
  getHealthLevel(score) {
    if (score >= 80) return 'healthy';
    if (score >= 60) return 'moderate';
    if (score >= 40) return 'warning';
    return 'critical';
  }
  
  /**
   * Index module by various fields
   * @param {string} name - Module name
   * @param {object} info - Module info
   */
  indexModule(name, info) {
    // By category
    if (!this.indexes.byCategory.has(info.category)) {
      this.indexes.byCategory.set(info.category, new Set());
    }
    this.indexes.byCategory.get(info.category).add(name);
    
    // By status
    if (!this.indexes.byStatus.has(info.status)) {
      this.indexes.byStatus.set(info.status, new Set());
    }
    this.indexes.byStatus.get(info.status).add(name);
    
    // By dependency
    for (const dep of info.dependencies || []) {
      if (!this.indexes.byDependency.has(dep)) {
        this.indexes.byDependency.set(dep, new Set());
      }
      this.indexes.byDependency.get(dep).add(name);
    }
  }
  
  /**
   * Get module by name
   * @param {string} name - Module name
   * @returns {object|null} Module info
   */
  getModule(name) {
    return this.modules.get(name) || null;
  }
  
  /**
   * Get modules by category
   * @param {string} category - Category
   * @returns {Array} Modules
   */
  getByCategory(category) {
    const names = this.indexes.byCategory.get(category) || new Set();
    return Array.from(names).map(name => this.modules.get(name));
  }
  
  /**
   * Get modules by status
   * @param {string} status - Status
   * @returns {Array} Modules
   */
  getByStatus(status) {
    const names = this.indexes.byStatus.get(status) || new Set();
    return Array.from(names).map(name => this.modules.get(name));
  }
  
  /**
   * Get registry summary
   * @returns {object} Summary
   */
  getSummary() {
    const summary = {
      totalModules: this.modules.size,
      byCategory: {},
      byStatus: {},
      healthIssues: []
    };
    
    // Count by category
    for (const [category, names] of this.indexes.byCategory) {
      summary.byCategory[category] = names.size;
    }
    
    // Count by status
    for (const [status, names] of this.indexes.byStatus) {
      summary.byStatus[status] = names.size;
    }
    
    // Collect health issues
    for (const [name, module] of this.modules) {
      if (module.health.issues.length > 0) {
        summary.healthIssues.push({
          module: name,
          issues: module.health.issues
        });
      }
    }
    
    return summary;
  }
  
  /**
   * Generate inventory report
   * @returns {string} Markdown report
   */
  generateInventoryReport() {
    const summary = this.getSummary();
    let report = `# Module Inventory\n\n`;
    report += `**Total Modules:** ${summary.totalModules}\n\n`;
    
    // By Category
    report += `## By Category\n\n`;
    for (const [category, count] of Object.entries(summary.byCategory)) {
      const modules = this.getByCategory(category);
      report += `### ${category} (${count})\n\n`;
      for (const mod of modules) {
        report += `- **${mod.name}** - ${mod.description || 'No description'}\n`;
        report += `  - Files: ${mod.stats.fileCount}, Lines: ${mod.stats.totalLines}\n`;
        report += `  - Health: ${mod.health.level} (${mod.health.score})\n`;
      }
      report += `\n`;
    }
    
    // Health Issues
    if (summary.healthIssues.length > 0) {
      report += `## Health Issues\n\n`;
      for (const issue of summary.healthIssues) {
        report += `### ${issue.module}\n`;
        for (const i of issue.issues) {
          report += `- ${i}\n`;
        }
        report += `\n`;
      }
    }
    
    return report;
  }
}

module.exports = {
  ModuleRegistry,
  MODULE_CATEGORIES,
  MODULE_STATUS
};
