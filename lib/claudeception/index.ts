/**
 * GSI Claudeception System - Phase 49-F
 *
 * Self-improving knowledge extraction and artifact generation system.
 * Hooks into conversation flows to automatically extract patterns
 * and generate reusable artifacts.
 *
 * Integration Points:
 * - Knowledge Extractor (Phase 37-02)
 * - Artifact Generator (Phase 38-01)
 * - Workflow Modules (Phase 49-F)
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { KnowledgeBase, KnowledgePattern, PatternCategory } from '../workflow-modules/knowledge-base.js';
import { ArtifactGeneratorManager, ArtifactType, GeneratedArtifact } from '../workflow-modules/artifact-generator.js';

// Claudeception Configuration
export interface ClaudeceptionConfig {
  enabled: boolean;
  autoExtract: boolean;
  autoGenerate: boolean;
  artifactTypes: ArtifactType[];
  storageDir: string;
  minConfidence: number;
  maxArtifactsPerSession: number;
}

// Extraction Context
export interface ExtractionContext {
  conversationId: string;
  userMessage: string;
  assistantResponse: string;
  toolCalls: ToolCallRecord[];
  timestamp: string;
  metadata: Record<string, any>;
}

// Tool Call Record
export interface ToolCallRecord {
  tool: string;
  input: Record<string, any>;
  output: any;
  success: boolean;
  duration: number;
}

// Extraction Result
export interface ClaudeceptionResult {
  extracted: boolean;
  patterns: KnowledgePattern[];
  artifacts: GeneratedArtifact[];
  confidence: number;
  reason: string;
}

// Hook Types
export type HookType = 'PostToolUse' | 'PostResponse' | 'PreCommit' | 'OnError';

// Hook Handler
export interface HookHandler {
  type: HookType;
  handler: (context: ExtractionContext) => Promise<ClaudeceptionResult | null>;
}

/**
 * Claudeception Manager - Main orchestrator for self-improving system
 */
export class ClaudeceptionManager {
  private config: ClaudeceptionConfig;
  private knowledgeBase: KnowledgeBase;
  private artifactGenerator: ArtifactGeneratorManager;
  private hooks: Map<HookType, HookHandler[]>;
  private sessionArtifacts: GeneratedArtifact[];

  constructor(config?: Partial<ClaudeceptionConfig>) {
    this.config = {
      enabled: true,
      autoExtract: true,
      autoGenerate: true,
      artifactTypes: ['SKILL', 'AGENT', 'LOGIC', 'FEATURE', 'IDEA', 'IMPROVEMENT'],
      storageDir: join(process.env.HOME || process.env.USERPROFILE || '', '.claude', 'claudeception'),
      minConfidence: 0.6,
      maxArtifactsPerSession: 10,
      ...config
    };

    this.knowledgeBase = new KnowledgeBase(this.config.storageDir);
    this.artifactGenerator = new ArtifactGeneratorManager(this.config.storageDir);
    this.hooks = new Map();
    this.sessionArtifacts = [];

    this.ensureDirectories();
    this.registerDefaultHooks();
  }

  /**
   * Register default extraction hooks
   */
  private registerDefaultHooks(): void {
    // Post-Tool-Use hook - extract patterns from successful tool operations
    this.registerHook('PostToolUse', async (context) => {
      if (!this.config.autoExtract) return null;

      const pattern = this.extractPatternFromToolUse(context);
      if (!pattern) return null;

      const confidence = this.calculateConfidence(pattern, context);
      if (confidence < this.config.minConfidence) return null;

      const artifacts: GeneratedArtifact[] = [];
      if (this.config.autoGenerate) {
        for (const type of this.config.artifactTypes) {
          try {
            const artifact = await this.artifactGenerator.generate(pattern, type);
            artifacts.push(artifact);
            this.sessionArtifacts.push(artifact);
          } catch (error) {
            console.error(`Failed to generate ${type} artifact:`, error);
          }
        }
      }

      return {
        extracted: true,
        patterns: [pattern],
        artifacts,
        confidence,
        reason: 'Pattern extracted from tool usage'
      };
    });

    // Post-Response hook - extract patterns from conversation flow
    this.registerHook('PostResponse', async (context) => {
      if (!this.config.autoExtract) return null;

      const patterns = this.extractPatternsFromConversation(context);
      if (patterns.length === 0) return null;

      const artifacts: GeneratedArtifact[] = [];
      for (const pattern of patterns) {
        const confidence = this.calculateConfidence(pattern, context);
        if (confidence < this.config.minConfidence) continue;

        if (this.config.autoGenerate) {
          for (const type of this.config.artifactTypes) {
            if (this.sessionArtifacts.length >= this.config.maxArtifactsPerSession) break;

            try {
              const artifact = await this.artifactGenerator.generate(pattern, type);
              artifacts.push(artifact);
              this.sessionArtifacts.push(artifact);
            } catch (error) {
              console.error(`Failed to generate ${type} artifact:`, error);
            }
          }
        }
      }

      if (artifacts.length === 0) return null;

      return {
        extracted: true,
        patterns,
        artifacts,
        confidence: Math.max(...patterns.map((_, i) => this.calculateConfidence(patterns[i], context))),
        reason: 'Patterns extracted from conversation'
      };
    });

    // Pre-Commit hook - generate artifacts before committing changes
    this.registerHook('PreCommit', async (context) => {
      const filePatterns = this.extractPatternsFromFiles(context);
      if (filePatterns.length === 0) return null;

      const artifacts: GeneratedArtifact[] = [];
      for (const pattern of filePatterns) {
        // Only generate improvement suggestions for pre-commit
        try {
          const artifact = await this.artifactGenerator.generate(pattern, 'IMPROVEMENT');
          artifacts.push(artifact);
        } catch (error) {
          console.error('Failed to generate improvement artifact:', error);
        }
      }

      return {
        extracted: true,
        patterns: filePatterns,
        artifacts,
        confidence: 0.8,
        reason: 'Patterns extracted from staged changes'
      };
    });

    // On-Error hook - capture debugging patterns
    this.registerHook('OnError', async (context) => {
      const errorPattern = this.extractPatternFromError(context);
      if (!errorPattern) return null;

      const artifacts: GeneratedArtifact[] = [];
      try {
        const artifact = await this.artifactGenerator.generate(errorPattern, 'LOGIC');
        artifacts.push(artifact);
      } catch (error) {
        console.error('Failed to generate logic artifact from error:', error);
      }

      return {
        extracted: true,
        patterns: [errorPattern],
        artifacts,
        confidence: 0.9,
        reason: 'Error recovery pattern extracted'
      };
    });
  }

  /**
   * Register a custom hook
   */
  registerHook(type: HookType, handler: HookHandler['handler']): void {
    if (!this.hooks.has(type)) {
      this.hooks.set(type, []);
    }
    this.hooks.get(type)!.push({ type, handler });
  }

  /**
   * Trigger hooks of a specific type
   */
  async triggerHooks(type: HookType, context: ExtractionContext): Promise<ClaudeceptionResult[]> {
    if (!this.config.enabled) return [];

    const handlers = this.hooks.get(type) || [];
    const results: ClaudeceptionResult[] = [];

    for (const { handler } of handlers) {
      try {
        const result = await handler(context);
        if (result) {
          results.push(result);

          // Store extracted patterns
          for (const pattern of result.patterns) {
            await this.knowledgeBase['storePattern'](pattern);
          }
        }
      } catch (error) {
        console.error(`Hook ${type} failed:`, error);
      }
    }

    return results;
  }

  /**
   * Extract pattern from tool usage
   */
  private extractPatternFromToolUse(context: ExtractionContext): KnowledgePattern | null {
    const toolCalls = context.toolCalls;
    if (toolCalls.length === 0) return null;

    // Find successful, complex tool operations
    const successfulCalls = toolCalls.filter(c => c.success && c.duration > 500);
    if (successfulCalls.length === 0) return null;

    const primaryCall = successfulCalls[0];
    const toolName = primaryCall.tool;

    return {
      id: `pattern-tool-${toolName.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}`,
      name: `${toolName} Usage Pattern`,
      category: 'command-patterns',
      description: `Pattern for using ${toolName} tool effectively`,
      source: context.conversationId,
      whenToUse: [
        `When ${toolName} operation is needed`,
        `When similar input/output patterns are expected`
      ],
      howToApply: [
        '1. Prepare input according to tool schema',
        '2. Handle potential errors gracefully',
        '3. Process output appropriately'
      ],
      variations: [],
      examples: [
        {
          name: 'Example usage',
          code: JSON.stringify(primaryCall.input, null, 2),
          explanation: `Input to ${toolName}`
        }
      ],
      effectiveness: primaryCall.success ? 1.0 : 0.5,
      uses: 1
    };
  }

  /**
   * Extract patterns from conversation
   */
  private extractPatternsFromConversation(context: ExtractionContext): KnowledgePattern[] {
    const patterns: KnowledgePattern[] = [];
    const { userMessage, assistantResponse } = context;

    // Check for workflow patterns
    const workflowMatch = assistantResponse.match(/(\d+\.\s+[^\n]+\n?)+/g);
    if (workflowMatch) {
      const steps = workflowMatch[0].split('\n').filter(s => s.trim());
      patterns.push({
        id: `pattern-workflow-${Date.now()}`,
        name: 'Multi-Step Workflow Pattern',
        category: 'workflows',
        description: `Workflow with ${steps.length} steps extracted from conversation`,
        source: context.conversationId,
        whenToUse: ['When similar multi-step process is needed'],
        howToApply: steps,
        variations: [],
        examples: [{
          name: 'Workflow steps',
          code: workflowMatch[0],
          explanation: 'Extracted workflow steps'
        }],
        effectiveness: 0.8,
        uses: 1
      });
    }

    // Check for thinking patterns
    const thinkingMatch = assistantResponse.match(/thinking|analyzing|considering|evaluating/i);
    if (thinkingMatch) {
      patterns.push({
        id: `pattern-thinking-${Date.now()}`,
        name: 'Thinking Process Pattern',
        category: 'thinking-configs',
        description: 'Cognitive process pattern from conversation',
        source: context.conversationId,
        whenToUse: ['When similar cognitive analysis is required'],
        howToApply: [
          '1. Analyze the problem',
          '2. Consider alternatives',
          '3. Evaluate options',
          '4. Make decision'
        ],
        variations: [],
        examples: [],
        effectiveness: 0.7,
        uses: 1
      });
    }

    return patterns;
  }

  /**
   * Extract patterns from staged files
   */
  private extractPatternsFromFiles(context: ExtractionContext): KnowledgePattern[] {
    const patterns: KnowledgePattern[] = [];

    for (const toolCall of context.toolCalls) {
      if (toolCall.tool.includes('read') || toolCall.tool.includes('write')) {
        const filePath = toolCall.input?.path || toolCall.input?.file_path;
        if (filePath) {
          patterns.push({
            id: `pattern-file-${basename(filePath)}-${Date.now()}`,
            name: `${basename(filePath)} File Pattern`,
            category: 'command-patterns',
            description: `Pattern from file operation on ${basename(filePath)}`,
            source: filePath,
            whenToUse: [`When working with ${basename(filePath)}`],
            howToApply: ['1. Read file', '2. Process content', '3. Write results'],
            variations: [],
            examples: [],
            effectiveness: 0.6,
            uses: 1
          });
        }
      }
    }

    return patterns;
  }

  /**
   * Extract pattern from error context
   */
  private extractPatternFromError(context: ExtractionContext): KnowledgePattern | null {
    const failedCalls = context.toolCalls.filter(c => !c.success);
    if (failedCalls.length === 0) return null;

    const failure = failedCalls[0];
    const errorMessage = failure.output?.error || 'Unknown error';

    return {
      id: `pattern-error-${Date.now()}`,
      name: 'Error Recovery Pattern',
      category: 'error-handling',
      description: `Pattern for handling ${errorMessage}`,
      source: context.conversationId,
      whenToUse: [`When encountering similar error: ${errorMessage}`],
      howToApply: [
        '1. Identify error type',
        '2. Analyze root cause',
        '3. Implement fix',
        '4. Verify resolution'
      ],
      variations: [],
      examples: [{
        name: 'Error context',
        code: JSON.stringify(failure, null, 2),
        explanation: 'Error details for reference'
      }],
      effectiveness: 0.5,
      uses: 1
    };
  }

  /**
   * Calculate extraction confidence
   */
  private calculateConfidence(pattern: KnowledgePattern, context: ExtractionContext): number {
    let confidence = 0.5;

    // More steps = higher confidence
    confidence += Math.min(pattern.howToApply.length * 0.05, 0.2);

    // More examples = higher confidence
    confidence += Math.min(pattern.examples.length * 0.1, 0.2);

    // Recent usage = higher confidence
    confidence += 0.1;

    // Cap at 1.0
    return Math.min(confidence, 1.0);
  }

  /**
   * Manual extraction trigger
   */
  async extractManually(context: ExtractionContext, types?: ArtifactType[]): Promise<ClaudeceptionResult> {
    const patterns = this.extractPatternsFromConversation(context);
    const artifacts: GeneratedArtifact[] = [];
    const targetTypes = types || this.config.artifactTypes;

    for (const pattern of patterns) {
      for (const type of targetTypes) {
        try {
          const artifact = await this.artifactGenerator.generate(pattern, type);
          artifacts.push(artifact);
        } catch (error) {
          console.error(`Failed to generate ${type}:`, error);
        }
      }
    }

    return {
      extracted: patterns.length > 0,
      patterns,
      artifacts,
      confidence: patterns.length > 0 ? 0.9 : 0,
      reason: 'Manual extraction triggered'
    };
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    artifactsGenerated: number;
    patternsExtracted: number;
    byType: Record<ArtifactType, number>;
  } {
    const byType: Record<ArtifactType, number> = {
      SKILL: 0,
      AGENT: 0,
      LOGIC: 0,
      FUNCTION: 0,
      FEATURE: 0,
      IMPROVEMENT: 0,
      IDEA: 0
    };

    for (const artifact of this.sessionArtifacts) {
      byType[artifact.type]++;
    }

    return {
      artifactsGenerated: this.sessionArtifacts.length,
      patternsExtracted: 0, // Would need tracking
      byType
    };
  }

  /**
   * Reset session
   */
  resetSession(): void {
    this.sessionArtifacts = [];
  }

  /**
   * Get configuration
   */
  getConfig(): ClaudeceptionConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<ClaudeceptionConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Ensure storage directories exist
   */
  private ensureDirectories(): void {
    if (!existsSync(this.config.storageDir)) {
      mkdirSync(this.config.storageDir, { recursive: true });
    }

    const subdirs = ['patterns', 'skills', 'agents', 'logic', 'functions', 'features', 'improvements', 'ideas'];
    for (const dir of subdirs) {
      const path = join(this.config.storageDir, dir);
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
    }
  }

  /**
   * Export artifacts for review
   */
  exportArtifacts(outputDir: string): string[] {
    const exportedPaths: string[] = [];

    for (const artifact of this.sessionArtifacts) {
      const typeDir = join(outputDir, artifact.type.toLowerCase());
      mkdirSync(typeDir, { recursive: true });

      const filePath = join(typeDir, `${artifact.id}.md`);
      writeFileSync(filePath, artifact.content);
      exportedPaths.push(filePath);
    }

    return exportedPaths;
  }
}

// ============================================================
// GSI Claudeception Command Integration
// ============================================================

/**
 * Create the /gsi:claudeception command handler
 */
export function createClaudeceptionCommand(): {
  name: string;
  description: string;
  execute: (args: string[], manager: ClaudeceptionManager) => Promise<string>;
} {
  return {
    name: 'gsi:claudeception',
    description: 'Trigger manual knowledge extraction and artifact generation',

    execute: async (args: string[], manager: ClaudeceptionManager) => {
      const subCommand = args[0] || 'status';

      switch (subCommand) {
        case 'status':
          const stats = manager.getSessionStats();
          const config = manager.getConfig();
          return `# Claudeception Status

## Configuration
- Enabled: ${config.enabled}
- Auto Extract: ${config.autoExtract}
- Auto Generate: ${config.autoGenerate}
- Min Confidence: ${config.minConfidence}

## Session Statistics
- Artifacts Generated: ${stats.artifactsGenerated}
- By Type:
${Object.entries(stats.byType).map(([type, count]) => `  - ${type}: ${count}`).join('\n')}
`;

        case 'extract': {
          const types = args.slice(1) as ArtifactType[];
          const context: ExtractionContext = {
            conversationId: `manual-${Date.now()}`,
            userMessage: args.join(' '),
            assistantResponse: '',
            toolCalls: [],
            timestamp: new Date().toISOString(),
            metadata: {}
          };

          const result = await manager.extractManually(context, types.length > 0 ? types : undefined);

          return `# Extraction Result

## Summary
- Extracted: ${result.extracted}
- Patterns: ${result.patterns.length}
- Artifacts: ${result.artifacts.length}
- Confidence: ${(result.confidence * 100).toFixed(0)}%

## Artifacts Generated
${result.artifacts.map(a => `- ${a.type}: ${a.name} (${a.file_path})`).join('\n')}
`;
        }

        case 'enable':
          manager.updateConfig({ enabled: true, autoExtract: true, autoGenerate: true });
          return 'Claudeception enabled with auto-extraction and generation';

        case 'disable':
          manager.updateConfig({ enabled: false });
          return 'Claudeception disabled';

        case 'reset':
          manager.resetSession();
          return 'Session reset - artifact count cleared';

        case 'export': {
          const outputDir = args[1] || '.';
          const paths = manager.exportArtifacts(outputDir);
          return `Exported ${paths.length} artifacts to ${outputDir}:\n${paths.join('\n')}`;
        }

        default:
          return `Unknown subcommand: ${subCommand}

Available commands:
- status: Show current status
- extract [types]: Manually extract patterns
- enable: Enable auto-extraction
- disable: Disable auto-extraction
- reset: Reset session statistics
- export [dir]: Export artifacts to directory
`;
      }
    }
  };
}

export default ClaudeceptionManager;
