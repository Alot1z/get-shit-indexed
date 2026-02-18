/**
 * GSI Knowledge Base Module
 *
 * Extracts patterns, principles, and reusable knowledge from the GSI codebase
 * to create new skills, improve existing commands, and build searchable knowledge.
 *
 * Extracted from: Claudeception analysis of GSI patch reapplication session
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { ArtifactGeneratorManager, ArtifactType, GeneratedArtifact } from './artifact-generator.js';

export interface KnowledgePattern {
  id: string;
  name: string;
  category: PatternCategory;
  description: string;
  source: string;
  whenToUse: string[];
  howToApply: string[];
  variations: PatternVariation[];
  examples: PatternExample[];
  effectiveness: number;
  uses: number;
}

export type PatternCategory =
  | 'command-patterns'
  | 'thinking-configs'
  | 'workflows'
  | 'agents'
  | 'error-handling'
  | 'optimization';

export interface PatternVariation {
  name: string;
  description: string;
  context: string;
}

export interface PatternExample {
  name: string;
  code: string;
  explanation: string;
}

export interface KnowledgeTemplate {
  type: 'gsi-command' | 'thinking-config' | 'workflow';
  template: string;
  variables: string[];
  description: string;
}

export interface BestPractice {
  id: string;
  title: string;
  category: string;
  description: string;
  rationale: string;
  examples: string[];
  antiPatterns: string[];
}

export interface AntiPattern {
  id: string;
  name: string;
  description: string;
  whyBad: string;
  instead: string;
  examples: string[];
}

export interface ExtractionResult {
  patternsFound: number;
  patternsExtracted: KnowledgePattern[];
  templatesGenerated: KnowledgeTemplate[];
  bestPractices: BestPractice[];
}

export interface MultiTypeGenerationResult {
  pattern: KnowledgePattern;
  artifacts: GeneratedArtifact[];
  types: ArtifactType[];
  success: boolean;
  errors: string[];
}

/**
 * Manages knowledge extraction and storage for GSI
 */
export class KnowledgeBase {
  private knowledgeDir: string;
  private patternsDir: string;
  private templatesDir: string;
  private practicesDir: string;
  private indexFile: string;
  private artifactGenerator: ArtifactGeneratorManager;

  constructor(knowledgeDir: string = join(process.env.HOME || '', '.claude', 'gsi-knowledge')) {
    this.knowledgeDir = knowledgeDir;
    this.patternsDir = join(knowledgeDir, 'patterns');
    this.templatesDir = join(knowledgeDir, 'templates');
    this.practicesDir = join(knowledgeDir, 'best-practices');
    this.indexFile = join(knowledgeDir, 'index.json');
    this.artifactGenerator = new ArtifactGeneratorManager(knowledgeDir);

    this.ensureDirectories();
  }

  /**
   * Extract patterns from GSI files
   */
  async extract(sourcePath: string, category?: PatternCategory): Promise<ExtractionResult> {
    const patterns: KnowledgePattern[] = [];
    const templates: KnowledgeTemplate[] = [];
    const practices: BestPractice[] = [];

    // Read GSI files
    const files = await this.discoverFiles(sourcePath);

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');

      // Extract patterns
      const filePatterns = this.extractPatternsFromFile(file, content, category);
      patterns.push(...filePatterns);

      // Extract templates
      const fileTemplates = this.extractTemplatesFromFile(file, content);
      templates.push(...fileTemplates);

      // Extract best practices
      const filePractices = this.extractBestPracticesFromFile(file, content);
      practices.push(...filePractices);
    }

    // Store extracted knowledge
    for (const pattern of patterns) {
      await this.storePattern(pattern);
    }

    for (const template of templates) {
      await this.storeTemplate(template);
    }

    for (const practice of practices) {
      await this.storeBestPractice(practice);
    }

    // Update index
    this.updateIndex(patterns, templates, practices);

    return {
      patternsFound: files.length,
      patternsExtracted: patterns,
      templatesGenerated: templates,
      bestPractices: practices
    };
  }

  /**
   * Extract patterns from a single file
   */
  private extractPatternsFromFile(
    filePath: string,
    content: string,
    category?: PatternCategory
  ): KnowledgePattern[] {
    const patterns: KnowledgePattern[] = [];
    const frontmatter = this.parseYAMLFrontmatter(content);

    // Detect command patterns
    if (frontmatter.allowed_tools && !category) {
      patterns.push(this.extractCommandPattern(filePath, frontmatter));
    }

    // Detect thinking patterns
    if (frontmatter.thinking_phase) {
      patterns.push(this.extractThinkingPattern(filePath, frontmatter));
    }

    // Detect workflow patterns from process sections
    const processMatch = content.match(/<process>([\s\S]*?)<\/process>/);
    if (processMatch) {
      patterns.push(this.extractWorkflowPattern(filePath, processMatch[1]));
    }

    return patterns;
  }

  /**
   * Extract command pattern
   */
  private extractCommandPattern(
    filePath: string,
    frontmatter: Record<string, any>
  ): KnowledgePattern {
    const commandName = frontmatter.name || basename(filePath, '.md');
    const toolCount = frontmatter.allowed_tools?.length || 0;

    return {
      id: `pattern-command-${commandName}`,
      name: `${commandName} Command Pattern`,
      category: 'command-patterns',
      description: `Pattern for ${commandName} command with ${toolCount} tools`,
      source: filePath,
      whenToUse: [
        `When implementing a command similar to ${commandName}`,
        `When ${toolCount} tools are needed`,
        `When the command has similar complexity`
      ],
      howToApply: [
        '1. Copy the command structure',
        '2. Modify description and objective',
        '3. Adjust allowed-tools list',
        '4. Update process section'
      ],
      variations: [
        {
          name: 'Simplified',
          description: 'Remove non-essential tools',
          context: 'When simpler version is needed'
        }
      ],
      examples: [
        {
          name: 'Basic usage',
          code: frontmatter.description || '',
          explanation: 'Command description'
        }
      ],
      effectiveness: 1.0,
      uses: 0
    };
  }

  /**
   * Extract thinking pattern
   */
  private extractThinkingPattern(
    filePath: string,
    frontmatter: Record<string, any>
  ): KnowledgePattern {
    const thinking = frontmatter.thinking_phase;

    return {
      id: `pattern-thinking-${basename(filePath, '.md')}`,
      name: `${thinking.mode} Thinking Pattern`,
      category: 'thinking-configs',
      description: `Thinking configuration with ${thinking.mode} mode`,
      source: filePath,
      whenToUse: [
        `When ${thinking.mode.toLowerCase()} cognitive enhancement is needed`,
        `When using ${thinking.servers?.join(', ') || 'no'} servers`,
        `Timeout around ${thinking.timeout}ms`
      ],
      howToApply: [
        '1. Copy thinking_phase section',
        '2. Adjust mode based on complexity',
        '3. Select appropriate servers',
        '4. Set timeout based on expected duration'
      ],
      variations: [
        {
          name: 'Lighter',
          description: 'Use LIGHTWEIGHT instead of STANDARD',
          context: 'When faster execution is needed'
        },
        {
          name: 'Heavier',
          description: 'Use COMPREHENSIVE instead of STANDARD',
          context: 'When deeper analysis is needed'
        }
      ],
      examples: [
        {
          name: 'Thinking config',
          code: JSON.stringify(thinking, null, 2),
          explanation: thinking.rationale || 'Thinking configuration'
        }
      ],
      effectiveness: 1.0,
      uses: 0
    };
  }

  /**
   * Extract workflow pattern
   */
  private extractWorkflowPattern(filePath: string, processContent: string): KnowledgePattern {
    const steps = processContent.split('\n').filter(line => line.trim().length > 0);

    return {
      id: `pattern-workflow-${basename(filePath, '.md')}`,
      name: `Workflow Pattern (${steps.length} steps)`,
      category: 'workflows',
      description: `Multi-step workflow with ${steps.length} process steps`,
      source: filePath,
      whenToUse: [
        'When implementing multi-step processes',
        'When sequential execution is required',
        'When checkpoint/resume is needed'
      ],
      howToApply: [
        '1. Define process steps clearly',
        '2. Add validation between steps',
        '3. Implement error handling',
        '4. Add checkpoint markers'
      ],
      variations: [],
      examples: [
        {
          name: 'Process steps',
          code: processContent.substring(0, 500),
          explanation: 'First 500 chars of process'
        }
      ],
      effectiveness: 1.0,
      uses: 0
    };
  }

  /**
   * Extract templates from file
   */
  private extractTemplatesFromFile(filePath: string, content: string): KnowledgeTemplate[] {
    const templates: KnowledgeTemplate[] = [];
    const frontmatter = this.parseYAMLFrontmatter(content);

    if (frontmatter.name && frontmatter.description) {
      templates.push({
        type: 'gsi-command',
        template: content,
        variables: ['${name}', '${description}', '${thinking_phase}', '${allowed-tools}'],
        description: `Template based on ${frontmatter.name} command`
      });
    }

    if (frontmatter.thinking_phase) {
      templates.push({
        type: 'thinking-config',
        template: JSON.stringify(frontmatter.thinking_phase, null, 2),
        variables: ['${mode}', '${servers}', '${bmad_enabled}', '${timeout}', '${rationale}'],
        description: `Thinking config template (${frontmatter.thinking_phase.mode})`
      });
    }

    return templates;
  }

  /**
   * Extract best practices from file
   */
  private extractBestPracticesFromFile(filePath: string, content: string): BestPractice[] {
    const practices: BestPractice[] = [];

    // Extract from comments or documentation sections
    const bestPracticeMatches = content.matchAll(/Best Practice[s]?:\s*(.*?)(?=\n\n|\n#|$)/gis);

    for (const match of bestPracticeMatches) {
      practices.push({
        id: `practice-${basename(filePath, '.md')}-${practices.length}`,
        title: `Best Practice from ${basename(filePath)}`,
        category: 'general',
        description: match[1].trim(),
        rationale: 'Extracted from GSI documentation',
        examples: [],
        antiPatterns: []
      });
    }

    return practices;
  }

  /**
   * Search knowledge base
   */
  search(query: string, category?: PatternCategory): KnowledgePattern[] {
    const results: KnowledgePattern[] = [];
    const queryLower = query.toLowerCase();

    if (!existsSync(this.patternsDir)) {
      return results;
    }

    const files = readdirSync(this.patternsDir, { recursive: true }) as string[];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const pattern: KnowledgePattern = JSON.parse(
        readFileSync(join(this.patternsDir, file), 'utf-8')
      );

      // Filter by category
      if (category && pattern.category !== category) {
        continue;
      }

      // Search in pattern fields
      if (
        pattern.name.toLowerCase().includes(queryLower) ||
        pattern.description.toLowerCase().includes(queryLower) ||
        pattern.whenToUse.some(u => u.toLowerCase().includes(queryLower))
      ) {
        results.push(pattern);
      }
    }

    // Sort by effectiveness
    results.sort((a, b) => b.effectiveness - a.effectiveness);

    return results;
  }

  /**
   * Generate skill from pattern
   */
  async generateSkill(patternId: string): Promise<string> {
    const pattern = await this.getPattern(patternId);
    if (!pattern) {
      throw new Error(`Pattern not found: ${patternId}`);
    }

    const skillContent = this.patternToSkill(pattern);

    // Save skill
    const skillPath = join(
      process.env.HOME || '',
      '.claude',
      'skills',
      `generated-${pattern.id}`,
      'skill.md'
    );

    mkdirSync(join(skillPath, '..'), { recursive: true });
    writeFileSync(skillPath, skillContent);

    return skillPath;
  }

  /**
   * Convert pattern to skill
   */
  private patternToSkill(pattern: KnowledgePattern): string {
    return `# ${pattern.name}

## Purpose
${pattern.description}

## Context
Extracted from: ${pattern.source}

## When to Use
${pattern.whenToUse.map(u => `- ${u}`).join('\n')}

## How to Apply
${pattern.howToApply.map(a => a).join('\n')}

## Variations
${pattern.variations.map(v => `### ${v.name}\n${v.description}\nContext: ${v.context}`).join('\n\n')}

## Examples
${pattern.examples.map(e => `### ${e.name}\n\`\`\`\n${e.code}\n\`\`\`\n${e.explanation}`).join('\n\n')}

## Effectiveness
${(pattern.effectiveness * 100).toFixed(0)}% (based on ${pattern.uses} uses)

## History
- Extracted: ${new Date().toISOString()}
- Source: ${pattern.source}
- Uses: ${pattern.uses}
`;
  }

  /**
   * Get pattern by ID
   */
  private async getPattern(patternId: string): Promise<KnowledgePattern | null> {
    const patternFile = join(this.patternsDir, `${patternId}.json`);

    if (!existsSync(patternFile)) {
      return null;
    }

    return JSON.parse(readFileSync(patternFile, 'utf-8'));
  }

  /**
   * Store pattern
   */
  private async storePattern(pattern: KnowledgePattern): Promise<void> {
    const categoryDir = join(this.patternsDir, pattern.category);
    mkdirSync(categoryDir, { recursive: true });

    const patternFile = join(categoryDir, `${pattern.id}.json`);
    writeFileSync(patternFile, JSON.stringify(pattern, null, 2));
  }

  /**
   * Store template
   */
  private async storeTemplate(template: KnowledgeTemplate): Promise<void> {
    const templateFile = join(this.templatesDir, `${template.type}-${Date.now()}.json`);
    writeFileSync(templateFile, JSON.stringify(template, null, 2));
  }

  /**
   * Store best practice
   */
  private async storeBestPractice(practice: BestPractice): Promise<void> {
    const practiceFile = join(this.practicesDir, `${practice.id}.md`);
    writeFileSync(practiceFile, `# ${practice.title}\n\n${practice.description}`);
  }

  /**
   * Update index
   */
  private updateIndex(
    patterns: KnowledgePattern[],
    templates: KnowledgeTemplate[],
    practices: BestPractice[]
  ): void {
    const index = {
      lastUpdated: new Date().toISOString(),
      patterns: patterns.length,
      templates: templates.length,
      practices: practices.length,
      categories: [...new Set(patterns.map(p => p.category))]
    };

    writeFileSync(this.indexFile, JSON.stringify(index, null, 2));
  }

  /**
   * Discover GSI files
   */
  private async discoverFiles(sourcePath: string): Promise<string[]> {
    const files: string[] = [];

    if (!existsSync(sourcePath)) {
      return files;
    }

    // In a real implementation, would recursively find all .md files
    // For now, return common locations
    const commonFiles = [
      'commands/GSI/add-phase.md',
      'commands/GSI/debug.md',
      'agents/gsi-planner.md'
    ];

    for (const file of commonFiles) {
      const fullPath = join(sourcePath, file);
      if (existsSync(fullPath)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Parse YAML frontmatter
   */
  private parseYAMLFrontmatter(content: string): Record<string, any> {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};

    // Simple YAML parser - in production would use proper YAML library
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
   * Ensure directories exist
   */
  private ensureDirectories(): void {
    if (!existsSync(this.knowledgeDir)) {
      mkdirSync(this.knowledgeDir, { recursive: true });
    }
    if (!existsSync(this.patternsDir)) {
      mkdirSync(this.patternsDir, { recursive: true });
    }
    if (!existsSync(this.templatesDir)) {
      mkdirSync(this.templatesDir, { recursive: true });
    }
    if (!existsSync(this.practicesDir)) {
      mkdirSync(this.practicesDir, { recursive: true });
    }
  }

  /**
   * Track pattern effectiveness
   */
  trackEffectiveness(patternId: string, success: boolean): void {
    const pattern = this.getPattern(patternId);
    if (!pattern) return;

    pattern.then(p => {
      p.uses++;
      if (success) {
        // Update effectiveness with moving average
        p.effectiveness = (p.effectiveness * (p.uses - 1) + 1) / p.uses;
      } else {
        p.effectiveness = (p.effectiveness * (p.uses - 1)) / p.uses;
      }

      this.storePattern(p);
    });
  }

  // ============================================================
  // Multi-Type Artifact Generation Methods (Phase 38-01)
  // ============================================================

  /**
   * Get the artifact generator manager
   */
  getArtifactGenerator(): ArtifactGeneratorManager {
    return this.artifactGenerator;
  }

  /**
   * Get available artifact types
   */
  getAvailableArtifactTypes(): ArtifactType[] {
    return this.artifactGenerator.getAvailableTypes();
  }

  /**
   * Generate all artifact types from a pattern
   */
  async generateAllArtifacts(patternId: string): Promise<MultiTypeGenerationResult> {
    const pattern = await this.getPattern(patternId);
    if (!pattern) {
      return {
        pattern: null as any,
        artifacts: [],
        types: [],
        success: false,
        errors: [`Pattern not found: ${patternId}`]
      };
    }

    const errors: string[] = [];
    const artifacts: GeneratedArtifact[] = [];

    try {
      const generatedArtifacts = await this.artifactGenerator.generateAll(pattern);
      artifacts.push(...generatedArtifacts);
    } catch (error) {
      errors.push(`Failed to generate artifacts: ${error}`);
    }

    return {
      pattern,
      artifacts,
      types: artifacts.map(a => a.type),
      success: errors.length === 0,
      errors
    };
  }

  /**
   * Generate specific artifact types from a pattern
   */
  async generateArtifactTypes(patternId: string, types: ArtifactType[]): Promise<MultiTypeGenerationResult> {
    const pattern = await this.getPattern(patternId);
    if (!pattern) {
      return {
        pattern: null as any,
        artifacts: [],
        types: [],
        success: false,
        errors: [`Pattern not found: ${patternId}`]
      };
    }

    const errors: string[] = [];
    const artifacts: GeneratedArtifact[] = [];

    try {
      const generatedArtifacts = await this.artifactGenerator.generateTypes(pattern, types);
      artifacts.push(...generatedArtifacts);
    } catch (error) {
      errors.push(`Failed to generate artifacts: ${error}`);
    }

    return {
      pattern,
      artifacts,
      types: artifacts.map(a => a.type),
      success: errors.length === 0,
      errors
    };
  }

  /**
   * Generate a single artifact type from a pattern
   */
  async generateArtifact(patternId: string, type: ArtifactType): Promise<GeneratedArtifact | null> {
    const pattern = await this.getPattern(patternId);
    if (!pattern) {
      throw new Error(`Pattern not found: ${patternId}`);
    }

    return this.artifactGenerator.generate(pattern, type);
  }

  /**
   * Generate an agent from a pattern
   */
  async generateAgent(patternId: string): Promise<GeneratedArtifact> {
    return this.generateArtifact(patternId, 'AGENT');
  }

  /**
   * Generate a feature specification from a pattern
   */
  async generateFeature(patternId: string): Promise<GeneratedArtifact> {
    return this.generateArtifact(patternId, 'FEATURE');
  }

  /**
   * Generate an idea document from a pattern
   */
  async generateIdea(patternId: string): Promise<GeneratedArtifact> {
    return this.generateArtifact(patternId, 'IDEA');
  }

  /**
   * Generate a logic module from a pattern
   */
  async generateLogic(patternId: string): Promise<GeneratedArtifact> {
    return this.generateArtifact(patternId, 'LOGIC');
  }

  /**
   * Generate a function from a pattern
   */
  async generateFunction(patternId: string): Promise<GeneratedArtifact> {
    return this.generateArtifact(patternId, 'FUNCTION');
  }

  /**
   * Generate an improvement suggestion from a pattern
   */
  async generateImprovement(patternId: string): Promise<GeneratedArtifact> {
    return this.generateArtifact(patternId, 'IMPROVEMENT');
  }

  /**
   * Extract patterns and generate all artifact types in one operation
   */
  async extractAndGenerate(
    sourcePath: string,
    category?: PatternCategory,
    artifactTypes?: ArtifactType[]
  ): Promise<{ extraction: ExtractionResult; generations: MultiTypeGenerationResult[] }> {
    // Extract patterns
    const extraction = await this.extract(sourcePath, category);

    // Generate artifacts for each pattern
    const generations: MultiTypeGenerationResult[] = [];

    for (const pattern of extraction.patternsExtracted) {
      // Store pattern first
      await this.storePattern(pattern);

      // Generate artifacts
      if (artifactTypes && artifactTypes.length > 0) {
        const result = await this.generateArtifactTypes(pattern.id, artifactTypes);
        generations.push(result);
      } else {
        const result = await this.generateAllArtifacts(pattern.id);
        generations.push(result);
      }
    }

    return { extraction, generations };
  }

  /**
   * Batch generate artifacts for multiple patterns
   */
  async batchGenerate(
    patternIds: string[],
    types: ArtifactType[]
  ): Promise<Map<string, MultiTypeGenerationResult>> {
    const results = new Map<string, MultiTypeGenerationResult>();

    for (const patternId of patternIds) {
      try {
        const result = await this.generateArtifactTypes(patternId, types);
        results.set(patternId, result);
      } catch (error) {
        results.set(patternId, {
          pattern: null as any,
          artifacts: [],
          types: [],
          success: false,
          errors: [String(error)]
        });
      }
    }

    return results;
  }
}

export default KnowledgeBase;
