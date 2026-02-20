/**
 * GSI Pattern Miner Module - Phase 49-F Integration
 *
 * Mines patterns from GSI command usage, conversations, and artifacts
 * to feed into the knowledge extraction system.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { KnowledgePattern, PatternCategory } from './knowledge-base.js';

export interface MinedPattern {
  id: string;
  source: 'command' | 'conversation' | 'artifact' | 'workflow';
  category: PatternCategory;
  pattern: string;
  frequency: number;
  confidence: number;
  context: string[];
  examples: string[];
  metadata: Record<string, any>;
}

export interface MiningResult {
  patternsFound: number;
  patterns: MinedPattern[];
  source: string;
  duration: number;
  errors: string[];
}

export interface MiningOptions {
  minFrequency: number;
  minConfidence: number;
  maxPatterns: number;
  categories?: PatternCategory[];
  includeExamples: boolean;
}

/**
 * Mines patterns from various GSI sources
 */
export class PatternMiner {
  private outputDir: string;
  private options: MiningOptions;
  private minedPatterns: Map<string, MinedPattern>;

  constructor(outputDir: string, options?: Partial<MiningOptions>) {
    this.outputDir = outputDir;
    this.options = {
      minFrequency: 2,
      minConfidence: 0.5,
      maxPatterns: 100,
      includeExamples: true,
      ...options
    };
    this.minedPatterns = new Map();
    this.ensureDirectories();
  }

  /**
   * Mine patterns from a GSI command file
   */
  async mineFromCommand(filePath: string): Promise<MiningResult> {
    const startTime = Date.now();
    const patterns: MinedPattern[] = [];
    const errors: string[] = [];

    try {
      const content = readFileSync(filePath, 'utf-8');
      const frontmatter = this.parseFrontmatter(content);

      // Mine command structure pattern
      if (frontmatter.name) {
        patterns.push({
          id: `mined-cmd-${basename(filePath, '.md')}`,
          source: 'command',
          category: 'command-patterns',
          pattern: frontmatter.description || '',
          frequency: 1,
          confidence: 0.8,
          context: [filePath],
          examples: this.options.includeExamples ? [content.substring(0, 500)] : [],
          metadata: {
            name: frontmatter.name,
            allowedTools: frontmatter.allowed_tools || frontmatter.allowedTools || []
          }
        });
      }

      // Mine thinking config pattern
      if (frontmatter.thinking_phase) {
        patterns.push({
          id: `mined-thinking-${basename(filePath, '.md')}`,
          source: 'command',
          category: 'thinking-configs',
          pattern: JSON.stringify(frontmatter.thinking_phase),
          frequency: 1,
          confidence: 0.9,
          context: [filePath],
          examples: this.options.includeExamples ? [JSON.stringify(frontmatter.thinking_phase, null, 2)] : [],
          metadata: {
            mode: frontmatter.thinking_phase.mode,
            servers: frontmatter.thinking_phase.servers || []
          }
        });
      }

      // Mine workflow pattern from process section
      const processMatch = content.match(/<process>([\s\S]*?)<\/process>/);
      if (processMatch) {
        patterns.push({
          id: `mined-workflow-${basename(filePath, '.md')}`,
          source: 'command',
          category: 'workflows',
          pattern: processMatch[1].trim(),
          frequency: 1,
          confidence: 0.7,
          context: [filePath],
          examples: this.options.includeExamples ? [processMatch[1]] : [],
          metadata: {
            stepCount: processMatch[1].split('\n').filter(l => l.trim()).length
          }
        });
      }

    } catch (error) {
      errors.push(`Failed to mine ${filePath}: ${error}`);
    }

    // Filter by confidence
    const filtered = patterns.filter(p => 
      p.confidence >= this.options.minConfidence
    );

    // Store mined patterns
    for (const pattern of filtered) {
      this.minedPatterns.set(pattern.id, pattern);
    }

    return {
      patternsFound: filtered.length,
      patterns: filtered,
      source: filePath,
      duration: Date.now() - startTime,
      errors
    };
  }

  /**
   * Mine patterns from a directory of command files
   */
  async mineFromDirectory(dirPath: string): Promise<MiningResult[]> {
    const results: MiningResult[] = [];

    if (!existsSync(dirPath)) {
      return results;
    }

    const files = readdirSync(dirPath, { recursive: true }) as string[];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const result = await this.mineFromCommand(join(dirPath, file));
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Mine patterns from conversation context
   */
  async mineFromConversation(context: {
    userMessage: string;
    assistantResponse: string;
    toolCalls: Array<{ tool: string; input: any; output: any }>;
  }): Promise<MiningResult> {
    const startTime = Date.now();
    const patterns: MinedPattern[] = [];
    const errors: string[] = [];

    // Mine workflow pattern from multi-step responses
    const steps = context.assistantResponse.match(/\d+\.\s+[^\n]+/g);
    if (steps && steps.length >= 2) {
      patterns.push({
        id: `mined-conv-workflow-${Date.now()}`,
        source: 'conversation',
        category: 'workflows',
        pattern: steps.join('\n'),
        frequency: 1,
        confidence: 0.6,
        context: [context.userMessage.substring(0, 100)],
        examples: this.options.includeExamples ? [context.assistantResponse.substring(0, 500)] : [],
        metadata: {
          stepCount: steps.length
        }
      });
    }

    // Mine tool usage patterns
    const toolGroups = this.groupToolCalls(context.toolCalls);
    for (const [tool, calls] of toolGroups) {
      if (calls.length >= 2) {
        patterns.push({
          id: `mined-conv-tool-${tool}-${Date.now()}`,
          source: 'conversation',
          category: 'command-patterns',
          pattern: `Repeated use of ${tool}`,
          frequency: calls.length,
          confidence: 0.7,
          context: [context.userMessage.substring(0, 100)],
          examples: this.options.includeExamples ? calls.slice(0, 2).map(c => JSON.stringify(c.input)) : [],
          metadata: {
            tool,
            callCount: calls.length
          }
        });
      }
    }

    // Filter and store
    const filtered = patterns.filter(p => 
      p.confidence >= this.options.minConfidence &&
      p.frequency >= this.options.minFrequency
    );

    for (const pattern of filtered) {
      this.minedPatterns.set(pattern.id, pattern);
    }

    return {
      patternsFound: filtered.length,
      patterns: filtered,
      source: 'conversation',
      duration: Date.now() - startTime,
      errors
    };
  }

  /**
   * Mine patterns from artifact files
   */
  async mineFromArtifact(filePath: string): Promise<MiningResult> {
    const startTime = Date.now();
    const patterns: MinedPattern[] = [];
    const errors: string[] = [];

    try {
      const content = readFileSync(filePath, 'utf-8');

      // Detect artifact type from file extension or content
      const ext = filePath.split('.').pop()?.toLowerCase();
      let category: PatternCategory = 'command-patterns';

      if (ext === 'ts' || ext === 'js') {
        category = 'logic';
      } else if (ext === 'md') {
        if (content.includes('agent') || content.includes('Agent')) {
          category = 'agents';
        } else if (content.includes('workflow') || content.includes('process')) {
          category = 'workflows';
        }
      }

      // Extract patterns from content
      const functionMatches = content.match(/(?:function|const|let|var)\s+(\w+)\s*=/g) || [];
      for (const match of functionMatches) {
        const name = match.replace(/(?:function|const|let|var)\s+/, '').replace(/\s*=$/, '');
        patterns.push({
          id: `mined-artifact-${name}-${Date.now()}`,
          source: 'artifact',
          category,
          pattern: name,
          frequency: 1,
          confidence: 0.6,
          context: [filePath],
          examples: [],
          metadata: {
            type: 'function',
            name
          }
        });
      }

    } catch (error) {
      errors.push(`Failed to mine ${filePath}: ${error}`);
    }

    const filtered = patterns.filter(p => 
      p.confidence >= this.options.minConfidence
    );

    for (const pattern of filtered) {
      this.minedPatterns.set(pattern.id, pattern);
    }

    return {
      patternsFound: filtered.length,
      patterns: filtered,
      source: filePath,
      duration: Date.now() - startTime,
      errors
    };
  }

  /**
   * Convert mined patterns to knowledge patterns
   */
  toKnowledgePatterns(): KnowledgePattern[] {
    const knowledgePatterns: KnowledgePattern[] = [];

    for (const mined of this.minedPatterns.values()) {
      knowledgePatterns.push({
        id: `pattern-${mined.id}`,
        name: `${mined.category} Pattern: ${mined.pattern.substring(0, 50)}`,
        category: mined.category,
        description: `Mined from ${mined.source}: ${mined.pattern}`,
        source: mined.context[0] || 'unknown',
        whenToUse: [`When similar ${mined.source} context is encountered`],
        howToApply: ['1. Identify context match', '2. Apply pattern logic', '3. Verify result'],
        variations: [],
        examples: mined.examples.map((ex, i) => ({
          name: `Example ${i + 1}`,
          code: ex,
          explanation: 'Extracted example'
        })),
        effectiveness: mined.confidence,
        uses: mined.frequency
      });
    }

    return knowledgePatterns;
  }

  /**
   * Get all mined patterns
   */
  getMinedPatterns(): MinedPattern[] {
    return Array.from(this.minedPatterns.values());
  }

  /**
   * Get pattern by ID
   */
  getPattern(id: string): MinedPattern | undefined {
    return this.minedPatterns.get(id);
  }

  /**
   * Clear mined patterns
   */
  clear(): void {
    this.minedPatterns.clear();
  }

  /**
   * Save mined patterns to file
   */
  save(filename: string = 'mined-patterns.json'): string {
    const filePath = join(this.outputDir, filename);
    const data = {
      timestamp: new Date().toISOString(),
      count: this.minedPatterns.size,
      patterns: Array.from(this.minedPatterns.values())
    };
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    return filePath;
  }

  /**
   * Load mined patterns from file
   */
  load(filename: string = 'mined-patterns.json'): number {
    const filePath = join(this.outputDir, filename);
    if (!existsSync(filePath)) {
      return 0;
    }

    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    for (const pattern of data.patterns || []) {
      this.minedPatterns.set(pattern.id, pattern);
    }

    return this.minedPatterns.size;
  }

  /**
   * Parse frontmatter from content
   */
  private parseFrontmatter(content: string): Record<string, any> {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};

    const result: Record<string, any> = {};
    const lines = match[1].split('\n');

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Group tool calls by tool name
   */
  private groupToolCalls(toolCalls: Array<{ tool: string; input: any; output: any }>): Map<string, typeof toolCalls> {
    const groups = new Map<string, typeof toolCalls>();

    for (const call of toolCalls) {
      const tool = call.tool;
      if (!groups.has(tool)) {
        groups.set(tool, []);
      }
      groups.get(tool)!.push(call);
    }

    return groups;
  }

  /**
   * Ensure directories exist
   */
  private ensureDirectories(): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Get statistics about mined patterns
   */
  getStats(): {
    totalPatterns: number;
    bySource: Record<string, number>;
    byCategory: Record<string, number>;
    avgConfidence: number;
  } {
    const patterns = Array.from(this.minedPatterns.values());

    const bySource: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    for (const p of patterns) {
      bySource[p.source] = (bySource[p.source] || 0) + 1;
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    }

    const avgConfidence = patterns.length > 0
      ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
      : 0;

    return {
      totalPatterns: patterns.length,
      bySource,
      byCategory,
      avgConfidence
    };
  }
}

export default PatternMiner;
