/**
 * Thinking Orchestrator Module
 *
 * Coordinates MCP thinking servers (Sequential, Tractatus, Debug) based on
 * thinking_phase configurations in GSI commands.
 *
 * Extracted from: v1.18.0 → v1.23.0 patch analysis (28 commands with thinking configs)
 *
 * Enhanced: v1.24.0 - Added expanded complexity algorithm (25 factors)
 * - Tool combination analysis
 * - Workflow step analysis
 * - Error handling complexity
 * - MCP server dependency analysis
 */

export type ThinkingMode = 'NONE' | 'LIGHTWEIGHT' | 'STANDARD' | 'COMPREHENSIVE';
export type ThinkingServer = 'sequential' | 'tractatus' | 'debug';

export interface ThinkingPhaseConfig {
  mode: ThinkingMode;
  servers: ThinkingServer[];
  bmad_enabled: boolean;
  timeout: number;
  rationale: string;
}

export interface ThinkingContext {
  command: string;
  description: string;
  objective?: string;
  process?: string;
  additionalContext?: Record<string, any>;
}

export interface ComplexityFactor {
  name: string;
  score: number;
  description?: string;
}

export interface ComplexityAnalysis {
  totalScore: number;
  mode: ThinkingMode;
  factors: ComplexityFactor[];
  breakdown: Record<string, number>;
}

export interface ThinkingResult {
  server: ThinkingServer;
  thoughts: ThinkingThought[];
  duration: number;
  success: boolean;
  error?: string;
}

export interface ThinkingThought {
  thoughtNumber: number;
  totalThoughts: number;
  thought: string;
  nextThoughtNeeded: boolean;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
}

/**
 * Orchestrates thinking servers for GSI commands
 */
export class ThinkingOrchestrator {
  private serverEndpoints: Record<ThinkingServer, string>;

  constructor() {
    this.serverEndpoints = {
      sequential: 'mcp__sequential-thinking__sequentialthinking',
      tractatus: 'mcp__tractatusthinking__tractatus_thinking',
      debug: 'mcp__debug-thinking__debug_thinking'
    };
  }

  /**
   * Execute thinking phase for a command
   */
  async think(
    config: ThinkingPhaseConfig,
    context: ThinkingContext
  ): Promise<Map<ThinkingServer, ThinkingResult>> {
    const results = new Map<ThinkingServer, ThinkingResult>();

    // Skip if mode is NONE
    if (config.mode === 'NONE') {
      return results;
    }

    // Execute each configured server
    for (const server of config.servers) {
      const startTime = Date.now();

      try {
        const thoughts = await this.executeServer(server, config, context);
        const duration = Date.now() - startTime;

        results.set(server, {
          server,
          thoughts,
          duration,
          success: true
        });
      } catch (error) {
        const duration = Date.now() - startTime;
        results.set(server, {
          server,
          thoughts: [],
          duration,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Execute a specific thinking server
   */
  private async executeServer(
    server: ThinkingServer,
    config: ThinkingPhaseConfig,
    context: ThinkingContext
  ): Promise<ThinkingThought[]> {
    const prompt = this.buildPrompt(server, config, context);

    // In a real implementation, this would call the MCP server
    // For now, we simulate the thinking process

    const thoughts: ThinkingThought[] = [];
    const maxThoughts = this.getMaxThoughts(config.mode);

    for (let i = 1; i <= maxThoughts; i++) {
      const thought = await this.generateThought(server, i, maxThoughts, prompt, thoughts);
      thoughts.push(thought);

      if (!thought.nextThoughtNeeded) {
        break;
      }
    }

    return thoughts;
  }

  /**
   * Build prompt for thinking server
   */
  private buildPrompt(
    server: ThinkingServer,
    config: ThinkingPhaseConfig,
    context: ThinkingContext
  ): string {
    let prompt = `Command: ${context.command}\n`;
    prompt += `Description: ${context.description}\n`;

    if (context.objective) {
      prompt += `Objective: ${context.objective}\n`;
    }

    if (context.process) {
      prompt += `Process: ${context.process}\n`;
    }

    prompt += `\nThinking Mode: ${config.mode}\n`;
    prompt += `BMAD Enabled: ${config.bmad_enabled}\n`;
    prompt += `Rationale: ${config.rationale}\n`;

    // Add server-specific context
    switch (server) {
      case 'sequential':
        prompt += `\nFocus on: Sequential step planning and execution order\n`;
        break;
      case 'tractatus':
        prompt += `\nFocus on: Structural analysis, relationships, and logical dependencies\n`;
        break;
      case 'debug':
        prompt += `\nFocus on: Problem detection, hypothesis generation, and solution verification\n`;
        break;
    }

    return prompt;
  }

  /**
   * Generate a single thought
   */
  private async generateThought(
    server: ThinkingServer,
    thoughtNumber: number,
    totalThoughts: number,
    prompt: string,
    previousThoughts: ThinkingThought[]
  ): Promise<ThinkingThought> {
    // In a real implementation, this would call the MCP server
    // For simulation, we generate placeholder thoughts

    const nextThoughtNeeded = thoughtNumber < totalThoughts;

    return {
      thoughtNumber,
      totalThoughts,
      thought: `[${server}] Thought ${thoughtNumber}/${totalThoughts} for: ${prompt.substring(0, 50)}...`,
      nextThoughtNeeded
    };
  }

  /**
   * Get max thoughts based on mode
   */
  private getMaxThoughts(mode: ThinkingMode): number {
    switch (mode) {
      case 'LIGHTWEIGHT':
        return 3;
      case 'STANDARD':
        return 5;
      case 'COMPREHENSIVE':
        return 10;
      default:
        return 0;
    }
  }

  /**
   * Analyze command and recommend thinking config
   */
  analyzeCommand(command: {
    description: string;
    allowedTools?: string[];
    process?: string;
    objective?: string;
  }): ThinkingPhaseConfig {
    const analysis = this.analyzeComplexity(command);
    const mode = analysis.mode;
    const servers = this.selectServers(command, analysis.totalScore);
    const timeout = this.calculateTimeout(mode, command.allowedTools?.length || 0);
    const rationale = this.generateRationale(command, mode, servers);

    return {
      mode,
      servers,
      bmad_enabled: mode === 'STANDARD' || mode === 'COMPREHENSIVE',
      timeout,
      rationale
    };
  }

  /**
   * Generate thinking_phase frontmatter for a command file
   */
  generateFrontmatter(config: ThinkingPhaseConfig): string {
    const lines = [
      'thinking_phase:',
      `  mode: ${config.mode}`,
      `  servers:`,
      ...config.servers.map(s => `    - ${s}`),
      `  bmad_enabled: ${config.bmad_enabled}`,
      `  timeout: ${config.timeout}`,
      `  rationale: "${config.rationale}"`
    ];
    return lines.join('\n');
  }

  /**
   * Validate a thinking_phase configuration
   */
  validateConfig(config: ThinkingPhaseConfig): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate mode
    const validModes: ThinkingMode[] = ['NONE', 'LIGHTWEIGHT', 'STANDARD', 'COMPREHENSIVE'];
    if (!validModes.includes(config.mode)) {
      errors.push(`Invalid mode: ${config.mode}. Must be one of: ${validModes.join(', ')}`);
    }

    // Validate servers
    const validServers: ThinkingServer[] = ['sequential', 'tractatus', 'debug'];
    for (const server of config.servers) {
      if (!validServers.includes(server)) {
        errors.push(`Invalid server: ${server}. Must be one of: ${validServers.join(', ')}`);
      }
    }

    // Validate server/mode consistency
    if (config.mode === 'NONE' && config.servers.length > 0) {
      warnings.push('Mode is NONE but servers are specified. Servers will be ignored.');
    }
    if (config.mode !== 'NONE' && !config.servers.includes('sequential')) {
      warnings.push('Sequential server is recommended for all non-NONE modes.');
    }

    // Validate timeout
    if (config.timeout < 0) {
      errors.push(`Timeout cannot be negative: ${config.timeout}`);
    }
    if (config.timeout > 15000) {
      warnings.push(`Timeout exceeds 15 seconds: ${config.timeout}ms. This may cause delays.`);
    }

    // Validate timeout/mode consistency
    const expectedTimeouts = { NONE: 0, LIGHTWEIGHT: 2000, STANDARD: 5000, COMPREHENSIVE: 9000 };
    const baseExpected = expectedTimeouts[config.mode];
    if (config.timeout > 0 && config.timeout < baseExpected * 0.5) {
      warnings.push(`Timeout seems low for ${config.mode} mode: ${config.timeout}ms (expected ~${baseExpected}ms)`);
    }

    // Validate bmad_enabled/mode consistency
    if (config.mode === 'NONE' && config.bmad_enabled) {
      warnings.push('BMAD is enabled but mode is NONE. BMAD will have no effect.');
    }
    if (config.mode === 'LIGHTWEIGHT' && config.bmad_enabled) {
      warnings.push('BMAD is typically not used with LIGHTWEIGHT mode.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get complexity factor descriptions for documentation
   */
  getComplexityFactorDescriptions(): Record<string, { category: string; description: string; range: string }> {
    return {
      // Tool-based factors
      tool_count: { category: 'Tool-Based', description: 'Number of allowed tools', range: '0-15+' },
      execution_tools: { category: 'Tool-Based', description: 'Tools for executing commands', range: '0-6' },
      delegation: { category: 'Tool-Based', description: 'Task/subagent delegation tools', range: '0-3' },
      web_integration: { category: 'Tool-Based', description: 'Web/API integration tools', range: '0-6' },
      file_modification: { category: 'Tool-Based', description: 'File modification tools', range: '0-5' },
      code_analysis: { category: 'Tool-Based', description: 'Code analysis/indexing tools', range: '0-3' },
      tool_combination: { category: 'Tool-Based', description: 'Multiple tool categories combined', range: '0-5' },
      mcp_dependency: { category: 'Tool-Based', description: 'MCP server dependencies beyond 3', range: '0-3' },
      dc_comprehensive: { category: 'Tool-Based', description: 'Comprehensive Desktop Commander usage', range: '0-2' },
      parallel_potential: { category: 'Tool-Based', description: 'High parallel execution potential', range: '0-2' },
      
      // Keyword-based factors
      debug_keywords: { category: 'Keyword-Based', description: 'Debug/troubleshoot operation', range: '0-4' },
      analysis_keywords: { category: 'Keyword-Based', description: 'Analysis/research operation', range: '0-3' },
      planning_keywords: { category: 'Keyword-Based', description: 'Planning/design operation', range: '0-3' },
      integration_keywords: { category: 'Keyword-Based', description: 'Integration/migration operation', range: '0-3' },
      verification_keywords: { category: 'Keyword-Based', description: 'Verification/testing operation', range: '0-2' },
      simplicity_keywords: { category: 'Keyword-Based', description: 'Simple/quick operation (negative)', range: '-3-0' },
      critical_keywords: { category: 'Keyword-Based', description: 'Critical/urgent operation', range: '0-3' },
      multi_component: { category: 'Keyword-Based', description: 'Multi-component operation', range: '0-2' },
      
      // Workflow factors
      workflow_steps: { category: 'Workflow', description: 'Number of workflow steps', range: '0-5' },
      workflow_branching: { category: 'Workflow', description: 'Branching/conditional points', range: '0-3' },
      workflow_checkpoints: { category: 'Workflow', description: 'Checkpoint/pause points', range: '0-2' },
      workflow_parallel: { category: 'Workflow', description: 'Parallel execution in workflow', range: '0-2' },
      
      // Error handling factors
      error_recovery: { category: 'Error Handling', description: 'Error handling points', range: '0-3' },
      validation_gates: { category: 'Error Handling', description: 'Validation gates', range: '0-2' },
      rollback_capability: { category: 'Error Handling', description: 'Rollback capability', range: '0-2' }
    };
  }

  /**
   * Get mode thresholds for documentation
   */
  getModeThresholds(): Record<ThinkingMode, { min: number; max: number; description: string }> {
    return {
      NONE: { min: 0, max: 2, description: 'Simple display commands, status checks' },
      LIGHTWEIGHT: { min: 3, max: 6, description: 'Quick operations, single-step modifications' },
      STANDARD: { min: 7, max: 12, description: 'Planning operations, multi-step workflows' },
      COMPREHENSIVE: { min: 13, max: 100, description: 'Complex debugging, architecture design' }
    };
  }

  /**
   * Calculate complexity score for a command (Enhanced with 25 factors)
   * 
   * Factor Categories:
   * 1. Tool-based factors (10): Count, combinations, execution, delegation
   * 2. Keyword-based factors (8): Debug, analysis, planning, simplicity
   * 3. Workflow factors (4): Steps, branching, checkpoints, parallelism
   * 4. Error handling factors (3): Recovery, validation, rollback
   */
  private calculateComplexity(command: {
    description: string;
    allowedTools?: string[];
    process?: string;
    objective?: string;
  }): number {
    const analysis = this.analyzeComplexity(command);
    return analysis.totalScore;
  }

  /**
   * Full complexity analysis with factor breakdown
   */
  analyzeComplexity(command: {
    description: string;
    allowedTools?: string[];
    process?: string;
    objective?: string;
  }): ComplexityAnalysis {
    const factors: ComplexityFactor[] = [];
    const breakdown: Record<string, number> = {};
    const desc = command.description.toLowerCase();
    const objective = (command.objective || '').toLowerCase();
    const combined = `${desc} ${objective}`;

    // ═══════════════════════════════════════════════════════════════
    // CATEGORY 1: TOOL-BASED FACTORS (10 factors)
    // ═══════════════════════════════════════════════════════════════

    // Factor 1: Tool count (base)
    const toolCount = command.allowedTools?.length || 0;
    if (toolCount > 0) {
      factors.push({ name: 'tool_count', score: toolCount, description: `${toolCount} tools` });
      breakdown.tools = toolCount;
    }

    // Factor 2: Execution tools (Bash, start_process)
    const execTools = command.allowedTools?.filter(t => 
      t.includes('process') || t.includes('execute') || t.includes('Bash') || t.includes('start_process')
    ) || [];
    if (execTools.length > 0) {
      const score = execTools.length * 2;
      factors.push({ name: 'execution_tools', score, description: `${execTools.length} execution tools` });
      breakdown.execution = score;
    }

    // Factor 3: Task/delegation tools
    const hasTaskTool = command.allowedTools?.some(t => t === 'Task' || t.includes('subagent')) || false;
    if (hasTaskTool) {
      factors.push({ name: 'delegation', score: 3, description: 'Has Task/subagent tool' });
      breakdown.delegation = 3;
    }

    // Factor 4: Web/API integration tools
    const webTools = command.allowedTools?.filter(t => 
      t.includes('web') || t.includes('api') || t.includes('fetch') || t.includes('http')
    ) || [];
    if (webTools.length > 0) {
      const score = webTools.length * 2;
      factors.push({ name: 'web_integration', score, description: `${webTools.length} web/API tools` });
      breakdown.web = score;
    }

    // Factor 5: File modification tools (Write, Edit)
    const fileModTools = command.allowedTools?.filter(t => 
      t.includes('write') || t.includes('edit') || t.includes('Write') || t.includes('Edit')
    ) || [];
    if (fileModTools.length > 0) {
      const score = fileModTools.length;
      factors.push({ name: 'file_modification', score, description: `${fileModTools.length} file modification tools` });
      breakdown.fileMod = score;
    }

    // Factor 6: Code analysis tools (code-index-mcp)
    const codeAnalysisTools = command.allowedTools?.filter(t => 
      t.includes('code-index') || t.includes('search_code') || t.includes('get_symbol')
    ) || [];
    if (codeAnalysisTools.length > 0) {
      const score = Math.min(codeAnalysisTools.length, 3);
      factors.push({ name: 'code_analysis', score, description: `${codeAnalysisTools.length} code analysis tools` });
      breakdown.codeAnalysis = score;
    }

    // Factor 7: Tool combination complexity (multiple categories)
    const toolCategories = new Set([
      execTools.length > 0 ? 'exec' : null,
      hasTaskTool ? 'delegation' : null,
      webTools.length > 0 ? 'web' : null,
      fileModTools.length > 0 ? 'fileMod' : null,
      codeAnalysisTools.length > 0 ? 'analysis' : null,
    ].filter(Boolean));
    if (toolCategories.size >= 3) {
      const score = toolCategories.size;
      factors.push({ name: 'tool_combination', score, description: `${toolCategories.size} tool categories combined` });
      breakdown.toolCombination = score;
    }

    // Factor 8: MCP server dependency count
    const mcpTools = command.allowedTools?.filter(t => t.startsWith('mcp__')) || [];
    if (mcpTools.length > 3) {
      const score = Math.min(mcpTools.length - 3, 3);
      factors.push({ name: 'mcp_dependency', score, description: `${mcpTools.length} MCP tool dependencies` });
      breakdown.mcpDependency = score;
    }

    // Factor 9: Desktop Commander comprehensive usage
    const dcTools = command.allowedTools?.filter(t => t.includes('desktop-commander')) || [];
    if (dcTools.length >= 4) {
      factors.push({ name: 'dc_comprehensive', score: 2, description: 'Comprehensive Desktop Commander usage' });
      breakdown.dcComprehensive = 2;
    }

    // Factor 10: Parallel execution potential (multiple independent tools)
    if (toolCount >= 6 && toolCategories.size >= 2) {
      factors.push({ name: 'parallel_potential', score: 2, description: 'High parallel execution potential' });
      breakdown.parallelPotential = 2;
    }

    // ═══════════════════════════════════════════════════════════════
    // CATEGORY 2: KEYWORD-BASED FACTORS (8 factors)
    // ═══════════════════════════════════════════════════════════════

    // Factor 11: Debug/troubleshoot keywords
    if (combined.includes('debug') || combined.includes('troubleshoot') || combined.includes('fix') || combined.includes('resolve')) {
      factors.push({ name: 'debug_keywords', score: 4, description: 'Debug/troubleshoot operation' });
      breakdown.debug = 4;
    }

    // Factor 12: Analysis/research keywords
    if (combined.includes('analyze') || combined.includes('research') || combined.includes('investigate') || combined.includes('explore')) {
      factors.push({ name: 'analysis_keywords', score: 3, description: 'Analysis/research operation' });
      breakdown.analysis = 3;
    }

    // Factor 13: Planning/design keywords
    if (combined.includes('plan') || combined.includes('design') || combined.includes('architect') || combined.includes('structure')) {
      factors.push({ name: 'planning_keywords', score: 3, description: 'Planning/design operation' });
      breakdown.planning = 3;
    }

    // Factor 14: Integration/migration keywords
    if (combined.includes('integrate') || combined.includes('migrate') || combined.includes('refactor') || combined.includes('transform')) {
      factors.push({ name: 'integration_keywords', score: 3, description: 'Integration/migration operation' });
      breakdown.integration = 3;
    }

    // Factor 15: Verification/test keywords
    if (combined.includes('verify') || combined.includes('test') || combined.includes('validate') || combined.includes('check')) {
      factors.push({ name: 'verification_keywords', score: 2, description: 'Verification/testing operation' });
      breakdown.verification = 2;
    }

    // Factor 16: Simplicity/reduction keywords (negative factor)
    if (combined.includes('quick') || combined.includes('simple') || combined.includes('display') || combined.includes('show') || combined.includes('list')) {
      factors.push({ name: 'simplicity_keywords', score: -3, description: 'Simple/quick operation' });
      breakdown.simplicity = -3;
    }

    // Factor 17: Critical/urgent keywords
    if (combined.includes('critical') || combined.includes('urgent') || combined.includes('production') || combined.includes('breaking')) {
      factors.push({ name: 'critical_keywords', score: 3, description: 'Critical/urgent operation' });
      breakdown.critical = 3;
    }

    // Factor 18: Multi-component keywords
    if (combined.includes('multi') || combined.includes('across') || combined.includes('several') || combined.includes('all ')) {
      factors.push({ name: 'multi_component', score: 2, description: 'Multi-component operation' });
      breakdown.multiComponent = 2;
    }

    // ═══════════════════════════════════════════════════════════════
    // CATEGORY 3: WORKFLOW FACTORS (4 factors)
    // ═══════════════════════════════════════════════════════════════

    if (command.process) {
      const lines = command.process.split('\n').filter(line => line.trim().length > 0);

      // Factor 19: Process step count
      if (lines.length > 0) {
        const score = Math.min(lines.length, 5);
        factors.push({ name: 'workflow_steps', score, description: `${lines.length} workflow steps` });
        breakdown.workflowSteps = score;
      }

      // Factor 20: Branching/conditional logic
      const branchingPatterns = /if|when|case|otherwise|else|depending|branch/gi;
      const branchingMatches = command.process.match(branchingPatterns) || [];
      if (branchingMatches.length > 0) {
        const score = Math.min(branchingMatches.length, 3);
        factors.push({ name: 'workflow_branching', score, description: `${branchingMatches.length} branching points` });
        breakdown.branching = score;
      }

      // Factor 21: Checkpoint/pause points
      const checkpointPatterns = /checkpoint|pause|wait|confirm|ask|review/gi;
      const checkpointMatches = command.process.match(checkpointPatterns) || [];
      if (checkpointMatches.length > 0) {
        const score = Math.min(checkpointMatches.length, 2);
        factors.push({ name: 'workflow_checkpoints', score, description: `${checkpointMatches.length} checkpoint points` });
        breakdown.checkpoints = score;
      }

      // Factor 22: Parallel execution in workflow
      const parallelPatterns = /parallel|concurrent|simultaneous|in parallel|at the same time/gi;
      if (parallelPatterns.test(command.process)) {
        factors.push({ name: 'workflow_parallel', score: 2, description: 'Parallel execution in workflow' });
        breakdown.parallelWorkflow = 2;
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // CATEGORY 4: ERROR HANDLING FACTORS (3 factors)
    // ═══════════════════════════════════════════════════════════════

    if (command.process) {
      // Factor 23: Error recovery patterns
      const errorPatterns = /catch|error|fail|retry|fallback|handle|recover/gi;
      const errorMatches = command.process.match(errorPatterns) || [];
      if (errorMatches.length > 0) {
        const score = Math.min(errorMatches.length, 3);
        factors.push({ name: 'error_recovery', score, description: `${errorMatches.length} error handling points` });
        breakdown.errorRecovery = score;
      }

      // Factor 24: Validation gates
      const validationPatterns = /validate|verify|check|ensure|confirm|assert/gi;
      const validationMatches = command.process.match(validationPatterns) || [];
      if (validationMatches.length > 1) {
        const score = Math.min(validationMatches.length - 1, 2);
        factors.push({ name: 'validation_gates', score, description: `${validationMatches.length} validation gates` });
        breakdown.validation = score;
      }

      // Factor 25: Rollback capability
      const rollbackPatterns = /rollback|undo|revert|restore|backup/gi;
      if (rollbackPatterns.test(command.process)) {
        factors.push({ name: 'rollback_capability', score: 2, description: 'Has rollback capability' });
        breakdown.rollback = 2;
      }
    }

    // Calculate total
    const totalScore = Math.max(0, factors.reduce((sum, f) => sum + f.score, 0));
    const mode = this.determineMode(totalScore);

    return {
      totalScore,
      mode,
      factors,
      breakdown
    };
  }

  /**
   * Determine thinking mode from complexity score
   */
  private determineMode(complexity: number): ThinkingMode {
    if (complexity <= 2) return 'NONE';
    if (complexity <= 6) return 'LIGHTWEIGHT';
    if (complexity <= 12) return 'STANDARD';
    return 'COMPREHENSIVE';
  }

  /**
   * Select appropriate thinking servers
   */
  private selectServers(
    command: { description: string; allowedTools?: string[]; objective?: string },
    complexity: number
  ): ThinkingServer[] {
    const servers: ThinkingServer[] = ['sequential']; // Always include sequential

    const desc = command.description.toLowerCase();
    const objective = (command.objective || '').toLowerCase();
    const combined = `${desc} ${objective}`;

    // Add tractatus for structural analysis
    if (
      combined.includes('analyze') ||
      combined.includes('structure') ||
      combined.includes('architecture') ||
      combined.includes('design') ||
      combined.includes('plan') ||
      combined.includes('research') ||
      (command.allowedTools?.some(t => t.includes('code-index-mcp')) ?? false)
    ) {
      servers.push('tractatus');
    }

    // Add debug for problem-solving
    if (
      combined.includes('debug') ||
      combined.includes('troubleshoot') ||
      combined.includes('fix') ||
      combined.includes('verify') ||
      combined.includes('test') ||
      combined.includes('resolve') ||
      combined.includes('investigate')
    ) {
      servers.push('debug');
    }

    return servers;
  }

  /**
   * Calculate timeout based on mode and tool count
   */
  private calculateTimeout(mode: ThinkingMode, toolCount: number): number {
    const baseTimeout = {
      'NONE': 0,
      'LIGHTWEIGHT': 2000,
      'STANDARD': 5000,
      'COMPREHENSIVE': 9000
    };

    const toolFactor = 500; // ms per tool
    const calculated = baseTimeout[mode] + (toolCount * toolFactor);

    return Math.min(calculated, 15000); // Max 15 seconds
  }

  /**
   * Generate rationale for thinking config
   */
  private generateRationale(
    command: { description: string },
    mode: ThinkingMode,
    servers: ThinkingServer[]
  ): string {
    const taskType = this.identifyTaskType(command.description);
    const serverDescriptions = servers.map(s => {
      switch (s) {
        case 'sequential': return 'step sequencing (Sequential)';
        case 'tractatus': return 'structural analysis (Tractatus)';
        case 'debug': return 'problem-solving (Debug)';
      }
    }).join(' and ');

    return `${taskType} requiring ${serverDescriptions}`;
  }

  /**
   * Identify task type from description
   */
  private identifyTaskType(description: string): string {
    const desc = description.toLowerCase();

    if (desc.includes('debug') || desc.includes('troubleshoot')) {
      return 'Debugging workflow';
    }
    if (desc.includes('research') || desc.includes('investigate')) {
      return 'Research task';
    }
    if (desc.includes('plan') || desc.includes('design')) {
      return 'Planning task';
    }
    if (desc.includes('execute') || desc.includes('implement')) {
      return 'Execution task';
    }
    if (desc.includes('verify') || desc.includes('test')) {
      return 'Verification task';
    }

    return 'Task execution';
  }

  /**
   * Check if thinking should be invoked based on context
   */
  shouldInvokeThinking(config: ThinkingPhaseConfig): boolean {
    return config.mode !== 'NONE' && config.servers.length > 0;
  }

  /**
   * Format thinking results for display
   */
  formatResults(results: Map<ThinkingServer, ThinkingResult>): string {
    let output = '## Thinking Phase Results\n\n';

    for (const [server, result] of results) {
      output += `### ${server.toUpperCase()} Server\n`;
      output += `- Duration: ${result.duration}ms\n`;
      output += `- Status: ${result.success ? '✓ Success' : '✗ Failed'}\n`;

      if (result.error) {
        output += `- Error: ${result.error}\n`;
      }

      output += `- Thoughts: ${result.thoughts.length}\n`;

      if (result.thoughts.length > 0) {
        output += '\n```\n';
        for (const thought of result.thoughts) {
          output += `[${thought.thoughtNumber}/${thought.totalThoughts}] ${thought.thought}\n`;
        }
        output += '```\n';
      }

      output += '\n';
    }

    return output;
  }
}

export default ThinkingOrchestrator;
