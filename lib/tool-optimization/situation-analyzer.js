/**
 * Situation Analyzer
 * 
 * Analyzes operation context to determine optimal tool selection.
 * Detects patterns like batch reads, complex searches, etc.
 * 
 * @module lib/tool-optimization/situation-analyzer
 */

/**
 * Situation patterns for tool optimization
 */
const SITUATION_PATTERNS = {
  // File operation patterns
  BATCH_READ: {
    pattern: (context) => context.fileCount > 1,
    recommendation: 'mcp__desktop-commander__read_multiple_files',
    savings: '80-90%',
    reason: 'Batch reading eliminates repeated protocol overhead'
  },
  
  SYMBOL_EXTRACTION: {
    pattern: (context) => context.targetSymbol && !context.fullFileNeeded,
    recommendation: 'mcp__code-index-mcp__get_symbol_body',
    savings: '85%',
    reason: 'Extract only needed symbol instead of entire file'
  },
  
  FILE_OVERVIEW: {
    pattern: (context) => context.needOverview && !context.needContent,
    recommendation: 'mcp__code-index-mcp__get_file_summary',
    savings: '90%',
    reason: 'Get structure without reading content'
  },
  
  // Search patterns
  CODE_SEARCH: {
    pattern: (context) => context.pattern && context.inCode,
    recommendation: 'mcp__code-index-mcp__search_code_advanced',
    savings: '80%',
    reason: 'Indexed code search with context lines'
  },
  
  FILE_SEARCH: {
    pattern: (context) => context.filePattern && !context.contentPattern,
    recommendation: 'mcp__code-index-mcp__find_files',
    savings: '70%',
    reason: 'Indexed file discovery'
  },
  
  FUZZY_SEARCH: {
    pattern: (context) => context.fuzzyMatch && context.approximate,
    recommendation: 'mcp__CodeGraphContext__find_code',
    savings: '70%',
    reason: 'Graph-based fuzzy code search'
  },
  
  // Analysis patterns
  RELATIONSHIP_ANALYSIS: {
    pattern: (context) => context.analyzeRelationships,
    recommendation: 'mcp__CodeGraphContext__analyze_code_relationships',
    savings: '70%',
    reason: 'Graph-based relationship analysis'
  },
  
  COMPLEXITY_ANALYSIS: {
    pattern: (context) => context.analyzeComplexity,
    recommendation: 'mcp__CodeGraphContext__find_most_complex_functions',
    savings: '70%',
    reason: 'Automated complexity hotspot detection'
  },
  
  DEAD_CODE_DETECTION: {
    pattern: (context) => context.findDeadCode,
    recommendation: 'mcp__CodeGraphContext__find_dead_code',
    savings: '70%',
    reason: 'Graph-based unused code detection'
  },
  
  // Thinking patterns
  COMPLEX_REASONING: {
    pattern: (context) => context.multiStep && context.needsReasoning,
    recommendation: 'mcp__sequential-thinking__sequentialthinking',
    savings: 'cognitive',
    reason: 'Step-by-step problem decomposition'
  },
  
  STRUCTURAL_ANALYSIS: {
    pattern: (context) => context.analyzeStructure && context.logicalDecomposition,
    recommendation: 'mcp__tractatusthinking__tractatus_thinking',
    savings: 'cognitive',
    reason: 'Logical structure analysis'
  },
  
  DEBUG_INVESTIGATION: {
    pattern: (context) => context.debugging && context.hypothesisTesting,
    recommendation: 'mcp__debug-thinking__debug_thinking',
    savings: 'cognitive',
    reason: 'Systematic hypothesis testing'
  }
};

/**
 * Situation Analyzer Class
 */
class SituationAnalyzer {
  constructor() {
    this.detectedPatterns = [];
  }
  
  /**
   * Analyze operation context to detect patterns
   * @param {string} operation - Operation type
   * @param {object} context - Operation context
   * @returns {object} Analysis result
   */
  analyze(operation, context) {
    this.detectedPatterns = [];
    
    // Detect applicable patterns
    for (const [patternName, patternConfig] of Object.entries(SITUATION_PATTERNS)) {
      if (patternConfig.pattern(context)) {
        this.detectedPatterns.push({
          name: patternName,
          recommendation: patternConfig.recommendation,
          savings: patternConfig.savings,
          reason: patternConfig.reason
        });
      }
    }
    
    // Get primary recommendation
    const primary = this.detectedPatterns[0];
    
    return {
      operation,
      context,
      detectedPatterns: this.detectedPatterns,
      primaryRecommendation: primary?.recommendation || null,
      primarySavings: primary?.savings || null,
      primaryReason: primary?.reason || null,
      confidence: this.calculateConfidence(context)
    };
  }
  
  /**
   * Calculate confidence in recommendation
   * @param {object} context - Context
   * @returns {number} Confidence score (0-1)
   */
  calculateConfidence(context) {
    // More context info = higher confidence
    const contextKeys = Object.keys(context).length;
    const baseConfidence = Math.min(contextKeys * 0.15, 0.7);
    
    // Bonus for specific indicators
    let bonus = 0;
    if (context.fileCount) bonus += 0.1;
    if (context.targetSymbol) bonus += 0.1;
    if (context.pattern) bonus += 0.05;
    if (context.analyzeRelationships) bonus += 0.1;
    
    return Math.min(baseConfidence + bonus, 1);
  }
  
  /**
   * Get situation-specific guidance
   * @param {string} situation - Situation type
   * @returns {object} Guidance
   */
  getGuidance(situation) {
    const guidanceMap = {
      'reading_multiple_files': {
        pattern: 'When reading 2+ files, always batch',
        tool: 'mcp__desktop-commander__read_multiple_files',
        example: {
          paths: ['file1.md', 'file2.md', 'file3.md']
        },
        savings: '80-90%',
        antiPattern: 'Sequential read_file calls'
      },
      
      'finding_code_pattern': {
        pattern: 'Use indexed search for code patterns',
        tool: 'mcp__code-index-mcp__search_code_advanced',
        example: {
          pattern: 'function.*auth',
          file_pattern: '*.ts',
          max_results: 10
        },
        savings: '80%',
        antiPattern: 'Grep tool'
      },
      
      'extracting_function': {
        pattern: 'Extract specific symbol, not entire file',
        tool: 'mcp__code-index-mcp__get_symbol_body',
        example: {
          file_path: '/path/to/file.ts',
          symbol_name: 'handleAuth'
        },
        savings: '85%',
        antiPattern: 'Reading entire file then searching'
      },
      
      'running_commands': {
        pattern: 'Use MCP process management',
        tool: 'mcp__desktop-commander__start_process',
        example: {
          command: 'npm test',
          timeout_ms: 60000
        },
        savings: '75%',
        antiPattern: 'Bash tool'
      },
      
      'understanding_architecture': {
        pattern: 'Analyze relationships, not just read files',
        tool: 'mcp__CodeGraphContext__analyze_code_relationships',
        example: {
          query_type: 'find_all_callers',
          target: 'processPayment'
        },
        savings: '70%',
        antiPattern: 'Manual file reading and tracing'
      }
    };
    
    return guidanceMap[situation] || null;
  }
  
  /**
   * Detect anti-patterns in proposed tool usage
   * @param {string} toolName - Proposed tool
   * @param {object} context - Context
   * @returns {object} Anti-pattern detection result
   */
  detectAntiPattern(toolName, context) {
    const antiPatterns = [];
    
    // Check for sequential reads
    if (toolName === 'mcp__desktop-commander__read_file' && context.fileCount > 1) {
      antiPatterns.push({
        type: 'sequential_reads',
        severity: 'high',
        message: 'Reading multiple files sequentially instead of batching',
        recommendation: 'Use read_multiple_files for 80-90% savings'
      });
    }
    
    // Check for native tool usage
    const nativeTools = ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob'];
    if (nativeTools.includes(toolName)) {
      antiPatterns.push({
        type: 'native_tool',
        severity: 'critical',
        message: `Native tool ${toolName} should not be used`,
        recommendation: TOOL_PREFERENCES[toolName] || 'Use MCP alternative'
      });
    }
    
    // Check for reading entire file for symbol
    if (toolName === 'mcp__desktop-commander__read_file' && context.targetSymbol) {
      antiPatterns.push({
        type: 'full_file_for_symbol',
        severity: 'high',
        message: 'Reading entire file when only symbol is needed',
        recommendation: 'Use get_symbol_body for 85% savings'
      });
    }
    
    return {
      hasAntiPatterns: antiPatterns.length > 0,
      antiPatterns,
      severity: antiPatterns.length > 0 ? 
        antiPatterns.reduce((max, ap) => ap.severity > max ? ap.severity : max, 'low') : 
        'none'
    };
  }
  
  /**
   * Get optimization suggestions based on context
   * @param {object} context - Context
   * @returns {Array} Optimization suggestions
   */
  getOptimizations(context) {
    const optimizations = [];
    
    // Batch reading optimization
    if (context.pendingReads && context.pendingReads.length > 1) {
      optimizations.push({
        type: 'batch_reads',
        current: `${context.pendingReads.length} sequential reads`,
        suggested: '1 batch read',
        tool: 'mcp__desktop-commander__read_multiple_files',
        savings: '80-90%'
      });
    }
    
    // Symbol extraction optimization
    if (context.fullFileRead && context.targetSymbol) {
      optimizations.push({
        type: 'symbol_extraction',
        current: 'Reading entire file',
        suggested: 'Extract symbol only',
        tool: 'mcp__code-index-mcp__get_symbol_body',
        savings: '85%'
      });
    }
    
    // Indexed search optimization
    if (context.usingGrep) {
      optimizations.push({
        type: 'indexed_search',
        current: 'Grep (filesystem scan)',
        suggested: 'Indexed code search',
        tool: 'mcp__code-index-mcp__search_code_advanced',
        savings: '80%'
      });
    }
    
    return optimizations;
  }
}

/**
 * Tool preference mapping for anti-pattern detection
 */
const TOOL_PREFERENCES = {
  'Read': 'mcp__desktop-commander__read_file or read_multiple_files',
  'Write': 'mcp__desktop-commander__write_file',
  'Edit': 'mcp__desktop-commander__edit_block',
  'Bash': 'mcp__desktop-commander__start_process',
  'Grep': 'mcp__code-index-mcp__search_code_advanced',
  'Glob': 'mcp__code-index-mcp__find_files'
};

module.exports = { SituationAnalyzer, SITUATION_PATTERNS, TOOL_PREFERENCES };
