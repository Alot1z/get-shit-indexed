/**
 * GSI Pattern Miner Module
 *
 * Discovers and creates workflow patterns from observed command sequences.
 * Tracks usage, mines patterns, generates templates, and suggests optimizations.
 *
 * Phase 38-03: Enhance workflow-chainer with Pattern Discovery
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import type { WorkflowChain, WorkflowStep } from './workflow-chainer.js';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface CommandExecution {
  command: string;
  args?: string;
  timestamp: string;
  success: boolean;
  duration: number;
  context?: Record<string, any>;
}

export interface CommandSequence {
  id: string;
  commands: CommandExecution[];
  startTime: string;
  endTime: string;
  totalDuration: number;
  successRate: number;
  source: 'manual' | 'workflow' | 'discovered';
  workflowName?: string;
}

export interface DiscoveredPattern {
  id: string;
  name: string;
  description: string;
  sequence: string[];
  frequency: number;
  successRate: number;
  avgDuration: number;
  timeSavings: number;
  qualityScore: number;
  variables: PatternVariable[];
  conditions?: PatternCondition[];
  optimizations?: PatternOptimization[];
  firstSeen: string;
  lastSeen: string;
  sources: string[];
}

export interface PatternVariable {
  name: string;
  type: 'phase' | 'string' | 'number' | 'boolean';
  extraction: string; // Regex or extraction rule
  required: boolean;
  defaultValue?: string;
}

export interface PatternCondition {
  type: 'if_success' | 'if_failure' | 'if_exists' | 'if_equals';
  target: string;
  value?: string;
  then_step?: string;
  else_step?: string;
}

export interface PatternOptimization {
  type: 'parallel' | 'skip' | 'reorder' | 'merge';
  steps: string[];
  reason: string;
  estimatedSavings: number;
}

export interface WorkflowHistory {
  sequences: CommandSequence[];
  executions: CommandExecution[];
  patterns: DiscoveredPattern[];
  stats: HistoryStats;
}

export interface HistoryStats {
  totalExecutions: number;
  totalSequences: number;
  successfulExecutions: number;
  failedExecutions: number;
  avgExecutionTime: number;
  mostUsedCommands: { command: string; count: number }[];
  patternsDiscovered: number;
  templatesGenerated: number;
}

export interface PatternRecommendation {
  pattern: DiscoveredPattern;
  relevanceScore: number;
  reason: string;
  suggestedVariables: Record<string, string>;
}

export interface OptimizationSuggestion {
  type: 'parallel' | 'skip' | 'reorder' | 'merge' | 'checkpoint';
  steps: string[];
  description: string;
  estimatedTimeSavings: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// ─── Pattern Miner Class ───────────────────────────────────────────────────────

export class PatternMiner {
  private historyFile: string;
  private templatesDir: string;
  private history: WorkflowHistory;

  constructor(stateDir: string = '.planning') {
    this.historyFile = join(stateDir, 'workflow-history.json');
    this.templatesDir = join(stateDir, 'workflow-templates', 'discovered');
    this.history = this.loadHistory();
  }

  // ─── Usage Tracking ───────────────────────────────────────────────────────────

  /**
   * Track a command execution
   */
  trackExecution(execution: CommandExecution): void {
    this.history.executions.push(execution);
    this.updateStats();
    this.saveHistory();
  }

  /**
   * Track a command sequence (complete workflow run)
   */
  trackSequence(sequence: CommandSequence): void {
    this.history.sequences.push(sequence);
    this.updateStats();
    this.saveHistory();
  }

  /**
   * Start tracking a new sequence
   */
  startSequence(source: 'manual' | 'workflow' | 'discovered' = 'manual', workflowName?: string): string {
    const id = this.generateId('seq');
    const sequence: CommandSequence = {
      id,
      commands: [],
      startTime: new Date().toISOString(),
      endTime: '',
      totalDuration: 0,
      successRate: 0,
      source,
      workflowName
    };

    // Store temporarily (will be completed later)
    this.history.sequences.push(sequence);
    this.saveHistory();

    return id;
  }

  /**
   * Add command to active sequence
   */
  addToSequence(sequenceId: string, execution: CommandExecution): void {
    const sequence = this.history.sequences.find(s => s.id === sequenceId);
    if (sequence) {
      sequence.commands.push(execution);
      this.saveHistory();
    }
  }

  /**
   * Complete a sequence
   */
  completeSequence(sequenceId: string): CommandSequence | null {
    const sequence = this.history.sequences.find(s => s.id === sequenceId);
    if (!sequence) return null;

    sequence.endTime = new Date().toISOString();
    sequence.totalDuration = sequence.commands.reduce((sum, c) => sum + c.duration, 0);
    sequence.successRate = sequence.commands.filter(c => c.success).length / sequence.commands.length;

    this.updateStats();
    this.saveHistory();

    return sequence;
  }

  // ─── Pattern Mining ───────────────────────────────────────────────────────────

  /**
   * Mine patterns from command history
   */
  minePatterns(options: {
    minFrequency?: number;
    minSuccessRate?: number;
    minLength?: number;
    maxLength?: number;
  } = {}): DiscoveredPattern[] {
    const {
      minFrequency = 2,
      minSuccessRate = 0.5,
      minLength = 2,
      maxLength = 10
    } = options;

    // Extract all command sequences
    const allSequences = this.history.sequences.map(s => s.commands.map(c => c.command));
    const allExecutions = this.extractExecutionPatterns();

    // Combine sequences
    const patterns = this.findFrequentPatterns(
      [...allSequences, ...allExecutions],
      minFrequency,
      minLength,
      maxLength
    );

    // Score and filter patterns
    const scoredPatterns = patterns
      .map(p => this.scorePattern(p))
      .filter(p => p.successRate >= minSuccessRate && p.frequency >= minFrequency);

    // Merge with existing patterns
    for (const pattern of scoredPatterns) {
      const existing = this.history.patterns.find(p => p.id === pattern.id);
      if (existing) {
        existing.frequency += pattern.frequency;
        existing.lastSeen = new Date().toISOString();
      } else {
        this.history.patterns.push(pattern);
      }
    }

    this.updateStats();
    this.saveHistory();

    return scoredPatterns;
  }

  /**
   * Extract execution patterns from individual commands
   */
  private extractExecutionPatterns(): string[][] {
    const patterns: string[][] = [];
    const windowSize = 5;

    // Sliding window over executions to find patterns
    for (let i = 0; i <= this.history.executions.length - windowSize; i++) {
      const window = this.history.executions.slice(i, i + windowSize);
      patterns.push(window.map(e => e.command));
    }

    return patterns;
  }

  /**
   * Find frequent patterns using pattern matching
   */
  private findFrequentPatterns(
    sequences: string[][],
    minFrequency: number,
    minLength: number,
    maxLength: number
  ): DiscoveredPattern[] {
    const patternCounts = new Map<string, { count: number; sequences: number[][]; durations: number[]; successes: number[] }>();

    // Find all subsequences
    for (let seqIdx = 0; seqIdx < sequences.length; seqIdx++) {
      const seq = sequences[seqIdx];

      for (let start = 0; start < seq.length; start++) {
        for (let len = minLength; len <= Math.min(maxLength, seq.length - start); len++) {
          const subseq = seq.slice(start, start + len);
          const key = subseq.join(' -> ');

          if (!patternCounts.has(key)) {
            patternCounts.set(key, { count: 0, sequences: [], durations: [], successes: [] });
          }

          const entry = patternCounts.get(key)!;
          entry.count++;
          entry.sequences.push([seqIdx, start, start + len]);

          // Get timing data if available
          const sequence = this.history.sequences[seqIdx];
          if (sequence && sequence.commands.length >= start + len) {
            const duration = sequence.commands
              .slice(start, start + len)
              .reduce((sum, c) => sum + c.duration, 0);
            entry.durations.push(duration);

            const successCount = sequence.commands
              .slice(start, start + len)
              .filter(c => c.success).length;
            entry.successes.push(successCount / len);
          }
        }
      }
    }

    // Convert to DiscoveredPattern objects
    const patterns: DiscoveredPattern[] = [];

    for (const [key, data] of patternCounts) {
      if (data.count >= minFrequency) {
        const commands = key.split(' -> ');

        patterns.push({
          id: this.generatePatternId(commands),
          name: this.generatePatternName(commands),
          description: `Discovered pattern: ${commands.slice(0, 3).join(' -> ')}${commands.length > 3 ? '...' : ''}`,
          sequence: commands,
          frequency: data.count,
          successRate: data.successes.length > 0
            ? data.successes.reduce((a, b) => a + b, 0) / data.successes.length
            : 1,
          avgDuration: data.durations.length > 0
            ? data.durations.reduce((a, b) => a + b, 0) / data.durations.length
            : 0,
          timeSavings: 0, // Calculated during scoring
          qualityScore: 0, // Calculated during scoring
          variables: this.extractVariables(commands),
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          sources: ['history']
        });
      }
    }

    return patterns;
  }

  /**
   * Extract variables from command sequence
   */
  private extractVariables(commands: string[]): PatternVariable[] {
    const variables: PatternVariable[] = [];
    const seenVars = new Set<string>();

    for (const cmd of commands) {
      // Extract phase numbers
      const phaseMatches = cmd.matchAll(/(\d+(?:\.\d+)?)/g);
      for (const match of phaseMatches) {
        if (!seenVars.has('phase')) {
          variables.push({
            name: 'phase',
            type: 'phase',
            extraction: '(\\d+(?:\\.\\d+)?)',
            required: true
          });
          seenVars.add('phase');
        }
      }

      // Extract quoted strings as potential name variables
      const nameMatches = cmd.matchAll(/"([^"]+)"/g);
      for (const match of nameMatches) {
        if (!seenVars.has('name')) {
          variables.push({
            name: 'name',
            type: 'string',
            extraction: '"([^"]+)"',
            required: false,
            defaultValue: 'unnamed'
          });
          seenVars.add('name');
        }
      }
    }

    return variables;
  }

  /**
   * Score a pattern based on multiple factors
   */
  private scorePattern(pattern: DiscoveredPattern): DiscoveredPattern {
    // Calculate time savings (compare to average individual execution)
    const individualAvg = this.getCommandAvgDuration(pattern.sequence[0]) || pattern.avgDuration / pattern.sequence.length;
    const sequentialTime = individualAvg * pattern.sequence.length;
    const timeSavings = Math.max(0, sequentialTime - pattern.avgDuration);

    // Calculate quality score
    const frequencyScore = Math.min(pattern.frequency / 10, 1) * 25; // 0-25 points
    const successScore = pattern.successRate * 35; // 0-35 points
    const savingsScore = Math.min(timeSavings / 60000, 1) * 25; // 0-25 points (1min max)
    const lengthScore = Math.min(pattern.sequence.length / 5, 1) * 15; // 0-15 points (5 steps max)

    pattern.timeSavings = timeSavings;
    pattern.qualityScore = frequencyScore + successScore + savingsScore + lengthScore;

    return pattern;
  }

  /**
   * Get average duration for a command
   */
  private getCommandAvgDuration(command: string): number | null {
    const executions = this.history.executions.filter(e => e.command === command);
    if (executions.length === 0) return null;
    return executions.reduce((sum, e) => sum + e.duration, 0) / executions.length;
  }

  // ─── Template Generation ──────────────────────────────────────────────────────

  /**
   * Generate a workflow template from a pattern
   */
  generateTemplate(patternId: string): WorkflowChain | null {
    const pattern = this.history.patterns.find(p => p.id === patternId);
    if (!pattern) return null;

    // Convert pattern sequence to workflow steps
    const chain: WorkflowStep[] = pattern.sequence.map((cmd, idx) => {
      const step: WorkflowStep = {
        command: cmd,
        checkpoint: idx === 0 || idx === pattern.sequence.length - 1
      };

      // Add args with variable substitution
      const vars = this.extractVariablesFromCommand(cmd, pattern.variables);
      if (Object.keys(vars).length > 0) {
        step.args = this.createVariableArgs(cmd, pattern.variables);
      }

      return step;
    });

    // Determine checkpoint strategy based on pattern
    const checkpoint: 'after-each' | 'after-phase' | 'before-execute' | 'manual' =
      pattern.sequence.some(cmd => cmd.includes('execute')) ? 'before-execute' :
      pattern.sequence.some(cmd => cmd.includes('phase')) ? 'after-phase' : 'after-each';

    // Determine if rollback should be enabled
    const rollback = pattern.successRate > 0.8;

    const template: WorkflowChain = {
      name: pattern.name,
      description: pattern.description,
      chain,
      checkpoint,
      rollback,
      metadata: {
        pattern_id: pattern.id,
        frequency: pattern.frequency,
        success_rate: pattern.successRate,
        quality_score: pattern.qualityScore,
        discovered_at: pattern.firstSeen,
        auto_generated: true
      }
    };

    // Add optimizations if available
    if (pattern.optimizations && pattern.optimizations.length > 0) {
      template.parallel = this.convertOptimizationsToParallel(pattern.optimizations);
    }

    return template;
  }

  /**
   * Extract variables from a command string
   */
  private extractVariablesFromCommand(cmd: string, variables: PatternVariable[]): Record<string, string> {
    const result: Record<string, string> = {};

    for (const v of variables) {
      const regex = new RegExp(v.extraction);
      const match = cmd.match(regex);
      if (match) {
        result[v.name] = match[1];
      }
    }

    return result;
  }

  /**
   * Create args string with variable placeholders
   */
  private createVariableArgs(cmd: string, variables: PatternVariable[]): string {
    let result = cmd;

    for (const v of variables) {
      const regex = new RegExp(v.extraction, 'g');
      result = result.replace(regex, `\${${v.name}}`);
    }

    // Remove the command prefix, keep only args
    const parts = result.split(' ');
    if (parts.length > 1) {
      return parts.slice(1).join(' ');
    }

    return '';
  }

  /**
   * Convert optimizations to parallel groups
   */
  private convertOptimizationsToParallel(optimizations: PatternOptimization[]): any[] {
    return optimizations
      .filter(o => o.type === 'parallel')
      .map(o => ({
        name: `parallel-${o.steps.join('-')}`,
        steps: o.steps.map(s => ({ command: s }))
      }));
  }

  /**
   * Save template to discovered templates directory
   */
  saveTemplate(template: WorkflowChain): string {
    if (!existsSync(this.templatesDir)) {
      mkdirSync(this.templatesDir, { recursive: true });
    }

    const filePath = join(this.templatesDir, `${template.name}.json`);
    writeFileSync(filePath, JSON.stringify(template, null, 2));

    return filePath;
  }

  /**
   * Generate and save all high-quality patterns as templates
   */
  generateAllTemplates(minQualityScore: number = 50): string[] {
    const templates: string[] = [];

    for (const pattern of this.history.patterns) {
      if (pattern.qualityScore >= minQualityScore) {
        const template = this.generateTemplate(pattern.id);
        if (template) {
          const path = this.saveTemplate(template);
          templates.push(path);
        }
      }
    }

    return templates;
  }

  // ─── Pattern Scoring & Recommendations ────────────────────────────────────────

  /**
   * Get pattern recommendations based on current context
   */
  getRecommendations(context: {
    currentPhase?: string;
    recentCommands?: string[];
    workflowGoal?: string;
  }): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    for (const pattern of this.history.patterns) {
      const relevanceScore = this.calculateRelevance(pattern, context);

      if (relevanceScore > 0.3) {
        recommendations.push({
          pattern,
          relevanceScore,
          reason: this.getRecommendationReason(pattern, context),
          suggestedVariables: this.suggestVariables(pattern, context)
        });
      }
    }

    // Sort by relevance
    recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return recommendations.slice(0, 5);
  }

  /**
   * Calculate relevance score for a pattern
   */
  private calculateRelevance(pattern: DiscoveredPattern, context: {
    currentPhase?: string;
    recentCommands?: string[];
    workflowGoal?: string;
  }): number {
    let score = 0;

    // Check if recent commands match pattern start
    if (context.recentCommands && context.recentCommands.length > 0) {
      const lastCmd = context.recentCommands[context.recentCommands.length - 1];
      const patternIdx = pattern.sequence.indexOf(lastCmd);
      if (patternIdx >= 0 && patternIdx < pattern.sequence.length - 1) {
        score += 0.4;
      }
    }

    // Check phase relevance
    if (context.currentPhase) {
      const hasPhase = pattern.sequence.some(cmd =>
        cmd.includes('phase') || cmd.includes(context.currentPhase!)
      );
      if (hasPhase) {
        score += 0.3;
      }
    }

    // Factor in quality score
    score += (pattern.qualityScore / 100) * 0.3;

    return Math.min(score, 1);
  }

  /**
   * Get human-readable recommendation reason
   */
  private getRecommendationReason(pattern: DiscoveredPattern, context: {
    currentPhase?: string;
    recentCommands?: string[];
    workflowGoal?: string;
  }): string {
    if (context.recentCommands && context.recentCommands.length > 0) {
      const lastCmd = context.recentCommands[context.recentCommands.length - 1];
      const patternIdx = pattern.sequence.indexOf(lastCmd);
      if (patternIdx >= 0 && patternIdx < pattern.sequence.length - 1) {
        return `Continues from ${lastCmd} with ${pattern.sequence.slice(patternIdx + 1).join(' -> ')}`;
      }
    }

    if (context.currentPhase && pattern.sequence.some(cmd => cmd.includes('phase'))) {
      return `Frequently used pattern for phase operations (${pattern.frequency} times)`;
    }

    return `High-quality pattern with ${(pattern.successRate * 100).toFixed(0)}% success rate`;
  }

  /**
   * Suggest variable values for a pattern
   */
  private suggestVariables(pattern: DiscoveredPattern, context: {
    currentPhase?: string;
    recentCommands?: string[];
    workflowGoal?: string;
  }): Record<string, string> {
    const vars: Record<string, string> = {};

    for (const v of pattern.variables) {
      if (v.type === 'phase' && context.currentPhase) {
        vars[v.name] = context.currentPhase;
      } else if (v.defaultValue) {
        vars[v.name] = v.defaultValue;
      }
    }

    return vars;
  }

  // ─── Optimization Engine ──────────────────────────────────────────────────────

  /**
   * Analyze a workflow for optimization opportunities
   */
  analyzeOptimizations(workflowName: string): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Find workflow in sequences
    const sequences = this.history.sequences.filter(s => s.workflowName === workflowName);
    if (sequences.length === 0) return [];

    // Analyze each sequence
    for (const seq of sequences) {
      // Find parallel opportunities
      const parallelOpts = this.findParallelOpportunities(seq);
      suggestions.push(...parallelOpts);

      // Find redundant steps
      const skipOpts = this.findSkipOpportunities(seq);
      suggestions.push(...skipOpts);

      // Find reorder opportunities
      const reorderOpts = this.findReorderOpportunities(seq);
      suggestions.push(...reorderOpts);

      // Find merge opportunities
      const mergeOpts = this.findMergeOpportunities(seq);
      suggestions.push(...mergeOpts);
    }

    // Deduplicate and sort by estimated savings
    const unique = this.deduplicateSuggestions(suggestions);
    unique.sort((a, b) => b.estimatedTimeSavings - a.estimatedTimeSavings);

    return unique;
  }

  /**
   * Find opportunities for parallel execution
   */
  private findParallelOpportunities(seq: CommandSequence): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    for (let i = 0; i < seq.commands.length - 1; i++) {
      for (let j = i + 2; j < seq.commands.length; j++) {
        const cmd1 = seq.commands[i];
        const cmd2 = seq.commands[j];

        // Check if commands are independent (no data dependency)
        if (this.areIndependent(cmd1, cmd2)) {
          const timeSavings = Math.min(cmd1.duration, cmd2.duration);

          if (timeSavings > 1000) { // Only suggest if saves > 1 second
            suggestions.push({
              type: 'parallel',
              steps: [cmd1.command, cmd2.command],
              description: `${cmd1.command} and ${cmd2.command} can run in parallel`,
              estimatedTimeSavings: timeSavings,
              riskLevel: 'low'
            });
          }
        }
      }
    }

    return suggestions;
  }

  /**
   * Find steps that can be skipped
   */
  private findSkipOpportunities(seq: CommandSequence): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Find duplicate commands
    const seen = new Map<string, number>();

    for (let i = 0; i < seq.commands.length; i++) {
      const cmd = seq.commands[i];

      if (seen.has(cmd.command)) {
        const prevIdx = seen.get(cmd.command)!;
        suggestions.push({
          type: 'skip',
          steps: [cmd.command],
          description: `${cmd.command} is redundant (already executed at step ${prevIdx + 1})`,
          estimatedTimeSavings: cmd.duration,
          riskLevel: 'medium'
        });
      } else {
        seen.set(cmd.command, i);
      }
    }

    return suggestions;
  }

  /**
   * Find opportunities to reorder steps for efficiency
   */
  private findReorderOpportunities(seq: CommandSequence): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Look for quick commands that are delayed behind slow ones
    for (let i = 0; i < seq.commands.length - 1; i++) {
      const current = seq.commands[i];
      const next = seq.commands[i + 1];

      // If current is slow and next is fast, and they're independent
      if (current.duration > next.duration * 2 && this.areIndependent(current, next)) {
        suggestions.push({
          type: 'reorder',
          steps: [current.command, next.command],
          description: `Move fast step ${next.command} before slow step ${current.command}`,
          estimatedTimeSavings: (current.duration - next.duration) * 0.1, // Estimated overlap
          riskLevel: 'medium'
        });
      }
    }

    return suggestions;
  }

  /**
   * Find opportunities to merge similar commands
   */
  private findMergeOpportunities(seq: CommandSequence): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Find consecutive similar commands
    for (let i = 0; i < seq.commands.length - 1; i++) {
      const current = seq.commands[i];
      const next = seq.commands[i + 1];

      if (this.areMergeable(current, next)) {
        suggestions.push({
          type: 'merge',
          steps: [current.command, next.command],
          description: `${current.command} and ${next.command} could be merged into a single operation`,
          estimatedTimeSavings: (current.duration + next.duration) * 0.2, // 20% savings from merge
          riskLevel: 'high'
        });
      }
    }

    return suggestions;
  }

  /**
   * Check if two commands are independent (can run in parallel)
   */
  private areIndependent(cmd1: CommandExecution, cmd2: CommandExecution): boolean {
    // Commands that read vs write to different resources
    const readOnlyCommands = ['check', 'list', 'status', 'verify', 'progress', 'get'];
    const writeCommands = ['create', 'update', 'delete', 'execute', 'commit', 'complete'];

    const cmd1IsRead = readOnlyCommands.some(c => cmd1.command.includes(c));
    const cmd2IsRead = readOnlyCommands.some(c => cmd2.command.includes(c));

    // Both read-only commands are independent
    if (cmd1IsRead && cmd2IsRead) return true;

    // Commands on different phases are independent
    const phase1 = cmd1.args?.match(/(\d+(?:\.\d+)?)/)?.[1];
    const phase2 = cmd2.args?.match(/(\d+(?:\.\d+)?)/)?.[1];

    if (phase1 && phase2 && phase1 !== phase2) return true;

    return false;
  }

  /**
   * Check if two commands can be merged
   */
  private areMergeable(cmd1: CommandExecution, cmd2: CommandExecution): boolean {
    // Same command base with different args
    const base1 = cmd1.command.split(' ').slice(0, 2).join(' ');
    const base2 = cmd2.command.split(' ').slice(0, 2).join(' ');

    return base1 === base2 && cmd1.command !== cmd2.command;
  }

  /**
   * Deduplicate optimization suggestions
   */
  private deduplicateSuggestions(suggestions: OptimizationSuggestion[]): OptimizationSuggestion[] {
    const seen = new Set<string>();
    return suggestions.filter(s => {
      const key = `${s.type}:${s.steps.join(',')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // ─── Analysis & Reporting ─────────────────────────────────────────────────────

  /**
   * Analyze all workflows and patterns
   */
  analyzeWorkflows(): {
    patterns: DiscoveredPattern[];
    topPatterns: DiscoveredPattern[];
    optimizationOpportunities: number;
    recommendations: PatternRecommendation[];
  } {
    // Get top patterns by quality score
    const topPatterns = [...this.history.patterns]
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, 10);

    // Count optimization opportunities
    const workflowNames = new Set(
      this.history.sequences
        .filter(s => s.workflowName)
        .map(s => s.workflowName!)
    );

    let optimizationOpportunities = 0;
    for (const name of workflowNames) {
      optimizationOpportunities += this.analyzeOptimizations(name).length;
    }

    // Get general recommendations
    const recommendations = this.getRecommendations({});

    return {
      patterns: this.history.patterns,
      topPatterns,
      optimizationOpportunities,
      recommendations
    };
  }

  /**
   * Get usage statistics
   */
  getStats(): HistoryStats {
    return this.history.stats;
  }

  /**
   * Get all patterns
   */
  getPatterns(): DiscoveredPattern[] {
    return this.history.patterns;
  }

  /**
   * Get pattern by ID
   */
  getPattern(patternId: string): DiscoveredPattern | null {
    return this.history.patterns.find(p => p.id === patternId) || null;
  }

  // ─── Persistence ──────────────────────────────────────────────────────────────

  /**
   * Update statistics
   */
  private updateStats(): void {
    const stats = this.history.stats;

    stats.totalExecutions = this.history.executions.length;
    stats.totalSequences = this.history.sequences.length;
    stats.successfulExecutions = this.history.executions.filter(e => e.success).length;
    stats.failedExecutions = this.history.executions.filter(e => !e.success).length;
    stats.patternsDiscovered = this.history.patterns.length;

    // Calculate average execution time
    if (this.history.executions.length > 0) {
      stats.avgExecutionTime = this.history.executions.reduce((sum, e) => sum + e.duration, 0) / this.history.executions.length;
    }

    // Find most used commands
    const commandCounts = new Map<string, number>();
    for (const e of this.history.executions) {
      commandCounts.set(e.command, (commandCounts.get(e.command) || 0) + 1);
    }

    stats.mostUsedCommands = Array.from(commandCounts.entries())
      .map(([command, count]) => ({ command, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Load history from file
   */
  private loadHistory(): WorkflowHistory {
    if (!existsSync(this.historyFile)) {
      return {
        sequences: [],
        executions: [],
        patterns: [],
        stats: {
          totalExecutions: 0,
          totalSequences: 0,
          successfulExecutions: 0,
          failedExecutions: 0,
          avgExecutionTime: 0,
          mostUsedCommands: [],
          patternsDiscovered: 0,
          templatesGenerated: 0
        }
      };
    }

    try {
      return JSON.parse(readFileSync(this.historyFile, 'utf-8'));
    } catch {
      return {
        sequences: [],
        executions: [],
        patterns: [],
        stats: {
          totalExecutions: 0,
          totalSequences: 0,
          successfulExecutions: 0,
          failedExecutions: 0,
          avgExecutionTime: 0,
          mostUsedCommands: [],
          patternsDiscovered: 0,
          templatesGenerated: 0
        }
      };
    }
  }

  /**
   * Save history to file
   */
  private saveHistory(): void {
    const dir = dirname(this.historyFile);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(this.historyFile, JSON.stringify(this.history, null, 2));
  }

  // ─── Utility Methods ──────────────────────────────────────────────────────────

  /**
   * Generate unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate pattern ID from command sequence
   */
  private generatePatternId(commands: string[]): string {
    const hash = commands.reduce((acc, cmd) => {
      for (let i = 0; i < cmd.length; i++) {
        acc = ((acc << 5) - acc + cmd.charCodeAt(i)) | 0;
      }
      return acc;
    }, 0);

    return `pattern-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Generate pattern name from commands
   */
  private generatePatternName(commands: string[]): string {
    const verbs = commands.map(cmd => {
      const parts = cmd.split(/[ :]/);
      return parts[parts.length - 1] || parts[0];
    });

    if (verbs.length <= 3) {
      return verbs.join('-');
    }

    return `${verbs[0]}-${verbs.length}-step`;
  }

  /**
   * Export pattern as template JSON
   */
  exportPattern(patternId: string): string | null {
    const pattern = this.getPattern(patternId);
    if (!pattern) return null;

    const template = this.generateTemplate(patternId);
    if (!template) return null;

    return JSON.stringify(template, null, 2);
  }
}

export default PatternMiner;
