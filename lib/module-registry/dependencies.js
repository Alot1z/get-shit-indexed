/**
 * Dependency Tracker
 * 
 * Tracks and analyzes module dependencies.
 * Detects circular dependencies and provides dependency graphs.
 * 
 * @module lib/module-registry/dependencies
 */

/**
 * Dependency types
 */
const DEPENDENCY_TYPES = {
  INTERNAL: 'internal',   // Within lib/
  EXTERNAL: 'external',   // npm packages
  BUILTIN: 'builtin'      // Node.js built-ins
};

/**
 * Dependency Tracker Class
 */
class DependencyTracker {
  constructor() {
    this.graph = new Map();
    this.reverseGraph = new Map();
    this.cycles = [];
  }
  
  /**
   * Build dependency graph from modules
   * @param {Map} modules - Module registry
   */
  buildGraph(modules) {
    this.graph.clear();
    this.reverseGraph.clear();
    this.cycles = [];
    
    // Build forward graph
    for (const [name, module] of modules) {
      const deps = this.parseDependencies(module.dependencies || []);
      this.graph.set(name, deps);
      
      // Build reverse graph
      for (const dep of deps.internal) {
        if (!this.reverseGraph.has(dep)) {
          this.reverseGraph.set(dep, new Set());
        }
        this.reverseGraph.get(dep).add(name);
      }
    }
    
    // Detect cycles
    this.detectCycles();
  }
  
  /**
   * Parse dependencies into categories
   * @param {Array} deps - Raw dependencies
   * @returns {object} Categorized dependencies
   */
  parseDependencies(deps) {
    const result = {
      internal: [],
      external: [],
      builtin: []
    };
    
    const builtins = ['fs', 'path', 'events', 'util', 'stream', 'http', 'https', 'crypto'];
    
    for (const dep of deps) {
      if (dep.startsWith('./') || dep.startsWith('../')) {
        // Internal dependency
        result.internal.push(this.normalizePath(dep));
      } else if (builtins.includes(dep.split('/')[0])) {
        result.builtin.push(dep);
      } else {
        result.external.push(dep);
      }
    }
    
    return result;
  }
  
  /**
   * Normalize relative path to module name
   * @param {string} path - Relative path
   * @returns {string} Module name
   */
  normalizePath(path) {
    return path.replace(/^\.+\//, '').replace(/\/index\.js$/, '');
  }
  
  /**
   * Detect circular dependencies
   */
  detectCycles() {
    const visited = new Set();
    const recursionStack = new Set();
    const path = [];
    
    const dfs = (node) => {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);
      
      const deps = this.graph.get(node)?.internal || [];
      
      for (const dep of deps) {
        if (!visited.has(dep)) {
          dfs(dep);
        } else if (recursionStack.has(dep)) {
          // Found cycle
          const cycleStart = path.indexOf(dep);
          this.cycles.push(path.slice(cycleStart));
        }
      }
      
      path.pop();
      recursionStack.delete(node);
    };
    
    for (const node of this.graph.keys()) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }
  }
  
  /**
   * Get dependencies of a module
   * @param {string} moduleName - Module name
   * @returns {object} Dependencies
   */
  getDependencies(moduleName) {
    return this.graph.get(moduleName) || { internal: [], external: [], builtin: [] };
  }
  
  /**
   * Get dependents of a module (reverse dependencies)
   * @param {string} moduleName - Module name
   * @returns {Array} Dependent modules
   */
  getDependents(moduleName) {
    return Array.from(this.reverseGraph.get(moduleName) || []);
  }
  
  /**
   * Check if module has circular dependency
   * @param {string} moduleName - Module name
   * @returns {boolean} Has cycle
   */
  hasCycle(moduleName) {
    return this.cycles.some(cycle => cycle.includes(moduleName));
  }
  
  /**
   * Get all circular dependency paths
   * @returns {Array} Cycles
   */
  getCycles() {
    return this.cycles;
  }
  
  /**
   * Calculate dependency depth
   * @param {string} moduleName - Module name
   * @returns {number} Maximum depth
   */
  getDependencyDepth(moduleName, visited = new Set()) {
    if (visited.has(moduleName)) return 0;
    visited.add(moduleName);
    
    const deps = this.graph.get(moduleName)?.internal || [];
    if (deps.length === 0) return 0;
    
    const depths = deps.map(dep => this.getDependencyDepth(dep, new Set(visited)));
    return 1 + Math.max(...depths, 0);
  }
  
  /**
   * Get modules sorted by dependency order (topological sort)
   * @returns {Array} Module names in dependency order
   */
  getTopologicalOrder() {
    const result = [];
    const visited = new Set();
    const temp = new Set();
    
    const visit = (node) => {
      if (temp.has(node)) {
        // Cycle detected, skip
        return;
      }
      if (visited.has(node)) return;
      
      temp.add(node);
      
      const deps = this.graph.get(node)?.internal || [];
      for (const dep of deps) {
        visit(dep);
      }
      
      temp.delete(node);
      visited.add(node);
      result.push(node);
    };
    
    for (const node of this.graph.keys()) {
      if (!visited.has(node)) {
        visit(node);
      }
    }
    
    return result;
  }
  
  /**
   * Get dependency statistics
   * @returns {object} Statistics
   */
  getStats() {
    const stats = {
      totalModules: this.graph.size,
      totalDependencies: 0,
      internalDependencies: 0,
      externalDependencies: 0,
      builtinDependencies: 0,
      cyclesDetected: this.cycles.length,
      avgDependencyCount: 0,
      maxDependencyDepth: 0
    };
    
    for (const [name, deps] of this.graph) {
      stats.totalDependencies += deps.internal.length + deps.external.length + deps.builtin.length;
      stats.internalDependencies += deps.internal.length;
      stats.externalDependencies += deps.external.length;
      stats.builtinDependencies += deps.builtin.length;
      
      const depth = this.getDependencyDepth(name);
      if (depth > stats.maxDependencyDepth) {
        stats.maxDependencyDepth = depth;
      }
    }
    
    stats.avgDependencyCount = stats.totalModules > 0 ?
      (stats.totalDependencies / stats.totalModules).toFixed(2) : 0;
    
    return stats;
  }
  
  /**
   * Generate dependency graph visualization
   * @returns {object} Graph data
   */
  getVisualizationData() {
    const nodes = [];
    const edges = [];
    
    // Create nodes
    for (const [name] of this.graph) {
      nodes.push({
        id: name,
        label: name,
        hasCycle: this.hasCycle(name)
      });
    }
    
    // Create edges
    for (const [source, deps] of this.graph) {
      for (const target of deps.internal) {
        edges.push({
          source,
          target,
          type: DEPENDENCY_TYPES.INTERNAL
        });
      }
    }
    
    return { nodes, edges, cycles: this.cycles };
  }
  
  /**
   * Generate dependency report
   * @returns {string} Markdown report
   */
  generateReport() {
    const stats = this.getStats();
    let report = `# Dependency Report\n\n`;
    
    report += `## Statistics\n\n`;
    report += `- **Total Modules:** ${stats.totalModules}\n`;
    report += `- **Total Dependencies:** ${stats.totalDependencies}\n`;
    report += `- **Internal:** ${stats.internalDependencies}\n`;
    report += `- **External:** ${stats.externalDependencies}\n`;
    report += `- **Built-in:** ${stats.builtinDependencies}\n`;
    report += `- **Avg Dependencies:** ${stats.avgDependencyCount}\n`;
    report += `- **Max Depth:** ${stats.maxDependencyDepth}\n`;
    report += `- **Cycles Detected:** ${stats.cyclesDetected}\n\n`;
    
    // Cycles
    if (this.cycles.length > 0) {
      report += `## Circular Dependencies\n\n`;
      report += `**Warning:** ${this.cycles.length} circular dependency chain(s) detected.\n\n`;
      
      for (let i = 0; i < this.cycles.length; i++) {
        report += `### Cycle ${i + 1}\n\n`;
        report += `\`\`\`\n${this.cycles[i].join(' -> ')} -> ${this.cycles[i][0]}\n\`\`\`\n\n`;
      }
    }
    
    // Top modules by dependency count
    const byDepCount = Array.from(this.graph.entries())
      .map(([name, deps]) => ({
        name,
        count: deps.internal.length + deps.external.length + deps.builtin.length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    if (byDepCount.length > 0) {
      report += `## Most Dependent Modules\n\n`;
      report += `| Module | Dependencies |\n`;
      report += `|--------|-------------|\n`;
      for (const mod of byDepCount) {
        report += `| ${mod.name} | ${mod.count} |\n`;
      }
      report += `\n`;
    }
    
    return report;
  }
}

module.exports = { DependencyTracker, DEPENDENCY_TYPES };
