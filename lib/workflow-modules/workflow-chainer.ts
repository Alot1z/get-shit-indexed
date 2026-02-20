/**
 * GSI Workflow Chainer Module - Phase 49-F Integration
 *
 * Chains multiple GSI commands into unified workflows with automatic
 * dependency resolution and parallel execution.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export type CheckpointStrategy = 'after-each' | 'after-phase' | 'before-execute' | 'manual';
export type FailureStrategy = 'stop-on-error' | 'continue-on-error' | 'rollback-on-error';

export interface WorkflowChain {
  name: string;
  description: string;
  chain: WorkflowStep[];
  parallel?: ParallelGroup[];
  checkpoint: CheckpointStrategy;
  rollback: boolean;
  dependencies?: Record<string, string[]>;
}

export interface WorkflowStep {
  command: string;
  args?: string;
  condition?: string;
  checkpoint?: boolean;
}

export interface ParallelGroup {
  name: string;
  steps: WorkflowStep[];
}

export interface WorkflowState {
  chain: string;
  variables: Record<string, string>;
  completed: string[];
  current?: string;
  pending: string[];
  checkpoint?: CheckpointData;
  startTime: string;
  status: 'running' | 'paused' | 'completed' | 'failed';
}

export interface CheckpointData {
  timestamp: string;
  gitCommit?: string;
  filesChanged: string[];
  stateSnapshot: Record<string, any>;
}

export interface WorkflowResult {
  chain: string;
  success: boolean;
  completedSteps: string[];
  failedStep?: string;
  error?: string;
  duration: number;
  checkpoints: CheckpointData[];
}

/**
 * Manages workflow chains for GSI commands
 */
export class WorkflowChainer {
  private stateFile: string;
  private templates: Map<string, WorkflowChain>;
  private activeWorkflows: Map<string, WorkflowState>;

  constructor(stateDir: string = '.planning') {
    this.stateFile = join(stateDir, 'workflow-state.json');
    this.templates = new Map();
    this.activeWorkflows = new Map();

    this.loadTemplates();
    this.loadState();
    this.ensureStateDir(stateDir);
  }

  /**
   * Load workflow templates
   */
  private loadTemplates(): void {
    // Full development cycle
    this.templates.set('full-cycle', {
      name: 'full-cycle',
      description: 'Research -> Plan -> Execute -> Verify',
      chain: [
        { command: 'gsi:research-phase', args: '${phase}' },
        { command: 'gsi:plan-phase', args: '${phase}' },
        { command: 'gsi:execute-phase', args: '${phase}' },
        { command: 'gsi:verify-work', args: '${phase}' }
      ],
      checkpoint: 'after-each',
      rollback: true
    });

    // Quick fix (skip research)
    this.templates.set('quick-fix', {
      name: 'quick-fix',
      description: 'Plan -> Execute -> Verify (skip research)',
      chain: [
        { command: 'gsi:plan-phase', args: '${phase} --skip-research' },
        { command: 'gsi:execute-phase', args: '${phase}' },
        { command: 'gsi:verify-work', args: '${phase}' }
      ],
      checkpoint: 'before-execute',
      rollback: true
    });

    // Project setup
    this.templates.set('project-setup', {
      name: 'project-setup',
      description: 'Initialize new project with all phases',
      chain: [
        { command: 'gsi:new-project' },
        { command: 'gsi:map-codebase' },
        { command: 'gsi:add-phase', args: '"Foundation"' },
        { command: 'gsi:plan-phase', args: '01' }
      ],
      parallel: [
        {
          name: 'status-check',
          steps: [
            { command: 'gsi:check-todos' },
            { command: 'gsi:progress' }
          ]
        }
      ],
      checkpoint: 'after-phase',
      rollback: false
    });

    // Milestone complete
    this.templates.set('milestone-complete', {
      name: 'milestone-complete',
      description: 'Complete milestone and prepare next',
      chain: [
        { command: 'gsi:audit-milestone' },
        { command: 'gsi:verify-work', args: '--all' },
        { command: 'gsi:complete-milestone' },
        { command: 'gsi:new-milestone' }
      ],
      checkpoint: 'manual',
      rollback: true
    });

    // Claudeception workflow (Phase 49-F)
    this.templates.set('claudeception', {
      name: 'claudeception',
      description: 'Extract patterns and generate artifacts',
      chain: [
        { command: 'gsi:claudeception', args: 'extract' },
        { command: 'gsi:claudeception', args: 'export .claude/claudeception' },
        { command: 'gsi:verify-work', args: '--artifacts' }
      ],
      checkpoint: 'after-each',
      rollback: false
    });
  }

  /**
   * Run a workflow chain
   */
  async run(
    chainName: string,
    variables: Record<string, string> = {},
    options: {
      failureStrategy?: FailureStrategy;
      yoloMode?: boolean;
    } = {}
  ): Promise<WorkflowResult> {
    const template = this.templates.get(chainName);
    if (!template) {
      throw new Error(`Unknown workflow chain: ${chainName}`);
    }

    const startTime = Date.now();
    const checkpoints: CheckpointData[] = [];
    const completedSteps: string[] = [];
    const failureStrategy = options.failureStrategy || 'stop-on-error';
    const yoloMode = options.yoloMode || false;

    const state: WorkflowState = {
      chain: chainName,
      variables,
      completed: [],
      pending: template.chain.map(s => s.command),
      startTime: new Date().toISOString(),
      status: 'running'
    };
    this.activeWorkflows.set(chainName, state);
    this.saveState();

    let failedStep: string | undefined;
    let error: string | undefined;

    try {
      // Execute sequential chain
      for (const step of template.chain) {
        const resolvedCommand = this.resolveVariables(step.command, variables);
        const resolvedArgs = step.args ? this.resolveVariables(step.args, variables) : '';

        state.current = resolvedCommand;
        this.saveState();

        try {
          await this.executeStep(resolvedCommand, resolvedArgs, yoloMode);
          completedSteps.push(resolvedCommand);
          state.completed.push(resolvedCommand);
          state.pending = state.pending.filter(p => p !== resolvedCommand);

          if (this.shouldCheckpoint(template.checkpoint, step, completedSteps.length)) {
            const checkpoint = await this.createCheckpoint(state);
            checkpoints.push(checkpoint);
            state.checkpoint = checkpoint;
            this.saveState();
          }
        } catch (stepError) {
          failedStep = resolvedCommand;
          error = stepError instanceof Error ? stepError.message : 'Unknown error';

          if (failureStrategy === 'stop-on-error') {
            state.status = 'failed';
            this.saveState();
            throw stepError;
          } else if (failureStrategy === 'rollback-on-error' && template.rollback) {
            await this.rollbackToCheckpoint(state, checkpoints);
            state.status = 'failed';
            this.saveState();
            throw stepError;
          }
        }
      }

      // Execute parallel groups
      if (template.parallel) {
        for (const group of template.parallel) {
          await this.executeParallelGroup(group, variables, yoloMode);
        }
      }

      state.status = 'completed';
      state.current = undefined;
      this.saveState();

    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
      state.status = 'failed';
      this.saveState();
    }

    const duration = Date.now() - startTime;

    return {
      chain: chainName,
      success: state.status === 'completed',
      completedSteps,
      failedStep,
      error,
      duration,
      checkpoints
    };
  }

  /**
   * Pause a running workflow
   */
  async pause(chainName: string): Promise<void> {
    const state = this.activeWorkflows.get(chainName);
    if (!state) {
      throw new Error(`No active workflow: ${chainName}`);
    }

    if (state.status !== 'running') {
      throw new Error(`Workflow is not running: ${chainName}`);
    }

    state.status = 'paused';
    this.saveState();
  }

  /**
   * Resume a paused workflow
   */
  async resume(chainName: string): Promise<WorkflowResult> {
    const state = this.activeWorkflows.get(chainName);
    if (!state) {
      throw new Error(`No paused workflow: ${chainName}`);
    }

    if (state.status !== 'paused') {
      throw new Error(`Workflow is not paused: ${chainName}`);
    }

    return this.run(chainName, state.variables);
  }

  /**
   * Rollback to last checkpoint
   */
  async rollback(chainName: string): Promise<void> {
    const state = this.activeWorkflows.get(chainName);
    if (!state || !state.checkpoint) {
      throw new Error(`No checkpoint available for: ${chainName}`);
    }

    await this.rollbackToCheckpoint(state, [state.checkpoint]);
  }

  /**
   * Get workflow status
   */
  getStatus(chainName?: string): WorkflowState | WorkflowState[] {
    if (chainName) {
      const state = this.activeWorkflows.get(chainName);
      if (!state) {
        throw new Error(`Unknown workflow: ${chainName}`);
      }
      return state;
    }

    return Array.from(this.activeWorkflows.values());
  }

  /**
   * Execute a single step
   */
  private async executeStep(
    command: string,
    args: string,
    yoloMode: boolean
  ): Promise<void> {
    console.log(`Executing: ${command} ${args}`);

    // Simulate async execution
    await new Promise(resolve => setTimeout(resolve, 100));

    // In real implementation, would invoke GSI command
  }

  /**
   * Execute a parallel group
   */
  private async executeParallelGroup(
    group: ParallelGroup,
    variables: Record<string, string>,
    yoloMode: boolean
  ): Promise<void> {
    const promises = group.steps.map(step => {
      const resolvedCommand = this.resolveVariables(step.command, variables);
      const resolvedArgs = step.args ? this.resolveVariables(step.args, variables) : '';
      return this.executeStep(resolvedCommand, resolvedArgs, yoloMode);
    });

    await Promise.all(promises);
  }

  /**
   * Determine if checkpoint should be created
   */
  private shouldCheckpoint(
    strategy: CheckpointStrategy,
    step: WorkflowStep,
    completedCount: number
  ): boolean {
    switch (strategy) {
      case 'after-each':
        return true;
      case 'after-phase':
        return step.command.includes('phase');
      case 'before-execute':
        return step.command.includes('execute');
      case 'manual':
        return step.checkpoint || false;
      default:
        return false;
    }
  }

  /**
   * Create a checkpoint
   */
  private async createCheckpoint(state: WorkflowState): Promise<CheckpointData> {
    return {
      timestamp: new Date().toISOString(),
      filesChanged: [],
      stateSnapshot: {
        completed: [...state.completed],
        pending: [...state.pending]
      }
    };
  }

  /**
   * Rollback to a checkpoint
   */
  private async rollbackToCheckpoint(
    state: WorkflowState,
    checkpoints: CheckpointData[]
  ): Promise<void> {
    if (checkpoints.length === 0) {
      return;
    }

    const lastCheckpoint = checkpoints[checkpoints.length - 1];

    state.completed = lastCheckpoint.stateSnapshot.completed || [];
    state.pending = lastCheckpoint.stateSnapshot.pending || [];
    state.checkpoint = lastCheckpoint;
  }

  /**
   * Resolve variables in command/args
   */
  private resolveVariables(template: string, variables: Record<string, string>): string {
    let resolved = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
      resolved = resolved.replace(regex, value);
    }

    return resolved;
  }

  /**
   * Save state to file
   */
  private saveState(): void {
    const stateObj: Record<string, WorkflowState> = {};

    for (const [name, state] of this.activeWorkflows) {
      stateObj[name] = state;
    }

    mkdirSync(join(this.stateFile, '..'), { recursive: true });
    writeFileSync(this.stateFile, JSON.stringify(stateObj, null, 2));
  }

  /**
   * Load state from file
   */
  private loadState(): void {
    if (!existsSync(this.stateFile)) {
      return;
    }

    try {
      const stateObj = JSON.parse(readFileSync(this.stateFile, 'utf-8'));

      for (const [name, state] of Object.entries(stateObj)) {
        this.activeWorkflows.set(name, state as WorkflowState);
      }
    } catch (error) {
      // Ignore errors loading state
    }
  }

  /**
   * Ensure state directory exists
   */
  private ensureStateDir(stateDir: string): void {
    if (!existsSync(stateDir)) {
      mkdirSync(stateDir, { recursive: true });
    }
  }

  /**
   * Clear completed workflows
   */
  clearCompleted(): void {
    for (const [name, state] of this.activeWorkflows) {
      if (state.status === 'completed' || state.status === 'failed') {
        this.activeWorkflows.delete(name);
      }
    }
    this.saveState();
  }

  /**
   * Create custom workflow chain
   */
  createChain(definition: WorkflowChain): void {
    this.templates.set(definition.name, definition);
  }

  /**
   * List available templates
   */
  listTemplates(): WorkflowChain[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by name
   */
  getTemplate(name: string): WorkflowChain | undefined {
    return this.templates.get(name);
  }

  /**
   * Remove a template
   */
  removeTemplate(name: string): boolean {
    return this.templates.delete(name);
  }
}

export default WorkflowChainer;
