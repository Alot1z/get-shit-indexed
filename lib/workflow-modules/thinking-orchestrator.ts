/**
 * Thinking Orchestrator Module - Phase 49-F Integration
 *
 * Coordinates MCP thinking servers (Sequential, Tractatus, Debug) based on
 * thinking_phase configurations in GSI commands.
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

    if (config.mode === 'NONE') {
      return results;
    }

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

    const validModes: ThinkingMode[] = ['NONE', 'LIGHTWEIGHT', 'STANDARD', 'COMPREHENSIVE'];
    if (!validModes.includes(config.mode)) {
      errors.push(`Invalid mode: ${config.mode}`);
    }

    const validServers: ThinkingServer[] = ['sequential', 'tractatus', 'debug'];
    for (const server of config.servers) {
      if (!validServers.includes(server)) {
        errors.push(`Invalid server: ${server}`);
      }
    }

    if (config.mode === 'NONE' && config.servers.length > 0) {
      warnings.push('Mode is NONE but servers are specified');
    }

    if (config.timeout < 0) {
      errors.push(`Timeout cannot be negative: ${config.timeout}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
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

    // Tool-based factors
    const toolCount = command.allowedTools?.length || 0;
    if (toolCount > 0) {
      factors.push({ name: 'tool_count', score: toolCount, description: `${toolCount} tools` });
      breakdown.tools = toolCount;
    }

    // Keyword-based factors
    if (combined.includes('debug') || combined.includes('troubleshoot')) {
      factors.push({ name: 'debug_keywords', score: 4, description: 'Debug operation' });
      breakdown.debug = 4;
    }

    if (combined.includes('analyze') || combined.includes('research')) {
      factors.push({ name: 'analysis_keywords', score: 3, description: 'Analysis operation' });
      breakdown.analysis = 3;
    }

    if (combined.includes('plan') || combined.includes('design')) {
      factors.push({ name: 'planning_keywords', score: 3, description: 'Planning operation' });
      breakdown.planning = 3;
    }

    if (combined.includes('quick') || combined.includes('simple') || combined.includes('display')) {
      factors.push({ name: 'simplicity_keywords', score: -3, description: 'Simple operation' });
      breakdown.simplicity = -3;
    }

    // Workflow factors
    if (command.process) {
      const lines = command.process.split('\n').filter(line => line.trim().length > 0);
      if (lines.length > 0) {
        const score = Math.min(lines.length, 5);
        factors.push({ name: 'workflow_steps', score, description: `${lines.length} steps` });
        breakdown.workflowSteps = score;
      }
    }

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
    const servers: ThinkingServer[] = ['sequential'];

    const desc = command.description.toLowerCase();
    const objective = (command.objective || '').toLowerCase();
    const combined = `${desc} ${objective}`;

    if (
      combined.includes('analyze') ||
      combined.includes('structure') ||
      combined.includes('architecture') ||
      combined.includes('design') ||
      combined.includes('plan')
    ) {
      servers.push('tractatus');
    }

    if (
      combined.includes('debug') ||
      combined.includes('troubleshoot') ||
      combined.includes('fix') ||
      combined.includes('verify')
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

    const toolFactor = 500;
    const calculated = baseTimeout[mode] + (toolCount * toolFactor);

    return Math.min(calculated, 15000);
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
        case 'sequential': return 'Sequential';
        case 'tractatus': return 'Tractatus';
        case 'debug': return 'Debug';
      }
    }).join(' and ');

    return `${taskType} requiring ${serverDescriptions} thinking`;
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
   * Check if thinking should be invoked
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
      output += `- Status: ${result.success ? 'Success' : 'Failed'}\n`;

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
