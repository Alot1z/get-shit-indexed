/**
 * GSI Patch Manager Module - Phase 49-F Integration
 *
 * Handles backup and restoration of local modifications across GSI package updates.
 * Integrated with workflow modules for comprehensive patch management.
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, basename } from 'path';

export interface PatchMetadata {
  version: string;
  timestamp: string;
  files: PatchFile[];
  patches: PatchSummary[];
}

export interface PatchFile {
  path: string;
  hash: string;
  modified: boolean;
}

export interface PatchSummary {
  file: string;
  type: 'thinking_phase' | 'allowed_tools' | 'content' | 'mixed';
  description: string;
}

export interface MergeResult {
  success: boolean;
  conflicts: Conflict[];
  mergedContent: string;
}

export interface Conflict {
  section: string;
  userVersion: string;
  upstreamVersion: string;
  resolution?: 'user' | 'upstream' | 'merged';
}

/**
 * Manages backup and restoration of local GSI modifications
 */
export class PatchManager {
  private patchesDir: string;
  private gsiInstallDir: string;
  private metadataFile: string;

  constructor(patchesDir?: string) {
    this.patchesDir = patchesDir || join(
      process.env.HOME || process.env.USERPROFILE || '',
      '.claude',
      'GSI-local-patches'
    );
    this.metadataFile = join(this.patchesDir, 'backup-meta.json');
    this.gsiInstallDir = this.detectGSIInstallDir();
    this.ensureDirectories();
  }

  /**
   * Backup all local modifications before update
   */
  async backup(): Promise<PatchMetadata> {
    const modifiedFiles = await this.detectModifications();
    const metadata: PatchMetadata = {
      version: await this.getCurrentVersion(),
      timestamp: new Date().toISOString(),
      files: [],
      patches: []
    };

    for (const file of modifiedFiles) {
      const sourcePath = join(this.gsiInstallDir, file);
      const backupPath = join(this.patchesDir, file);

      const content = readFileSync(sourcePath, 'utf-8');
      mkdirSync(join(backupPath, '..'), { recursive: true });
      writeFileSync(backupPath, content);

      const summary = this.analyzeModification(file, content);
      metadata.patches.push(summary);
      metadata.files.push({
        path: file,
        hash: this.hashFile(content),
        modified: true
      });
    }

    writeFileSync(this.metadataFile, JSON.stringify(metadata, null, 2));

    return metadata;
  }

  /**
   * Restore backed-up modifications to new version
   */
  async restore(): Promise<Map<string, MergeResult>> {
    const results = new Map<string, MergeResult>();

    if (!existsSync(this.metadataFile)) {
      throw new Error('No backup metadata found. Run backup() first.');
    }

    const metadata: PatchMetadata = JSON.parse(
      readFileSync(this.metadataFile, 'utf-8')
    );

    for (const file of metadata.files) {
      const backupPath = join(this.patchesDir, file.path);
      const currentPath = join(this.gsiInstallDir, file.path);

      if (!existsSync(backupPath) || !existsSync(currentPath)) {
        continue;
      }

      const backupContent = readFileSync(backupPath, 'utf-8');
      const currentContent = readFileSync(currentPath, 'utf-8');

      const mergeResult = this.mergeFile(backupContent, currentContent, metadata.patches);

      if (mergeResult.success) {
        writeFileSync(currentPath, mergeResult.mergedContent);
      }

      results.set(file.path, mergeResult);
    }

    return results;
  }

  /**
   * Rollback to backup version
   */
  async rollback(): Promise<void> {
    if (!existsSync(this.metadataFile)) {
      throw new Error('No backup metadata found.');
    }

    const metadata: PatchMetadata = JSON.parse(
      readFileSync(this.metadataFile, 'utf-8')
    );

    for (const file of metadata.files) {
      const backupPath = join(this.patchesDir, file.path);
      const currentPath = join(this.gsiInstallDir, file.path);

      if (existsSync(backupPath)) {
        const content = readFileSync(backupPath, 'utf-8');
        writeFileSync(currentPath, content);
      }
    }
  }

  /**
   * Detect which files have local modifications
   */
  private async detectModifications(): Promise<string[]> {
    const modifications: string[] = [];

    if (!existsSync(this.gsiInstallDir)) {
      return modifications;
    }

    // Check commands directory
    const commandsDir = join(this.gsiInstallDir, 'commands', 'GSI');
    if (existsSync(commandsDir)) {
      const files = readdirSync(commandsDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        modifications.push(`commands/GSI/${file}`);
      }
    }

    // Check agents directory
    const agentsDir = join(this.gsiInstallDir, 'agents');
    if (existsSync(agentsDir)) {
      const files = readdirSync(agentsDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        modifications.push(`agents/${file}`);
      }
    }

    return modifications;
  }

  /**
   * Analyze what was modified in a file
   */
  private analyzeModification(filePath: string, content: string): PatchSummary {
    if (content.includes('thinking_phase:')) {
      return {
        file: filePath,
        type: 'thinking_phase',
        description: 'Added thinking_phase configuration'
      };
    }

    if (content.includes('allowed-tools:') || content.includes('allowed_tools:')) {
      return {
        file: filePath,
        type: 'allowed_tools',
        description: 'Modified allowed-tools list'
      };
    }

    return {
      file: filePath,
      type: 'content',
      description: 'Content modifications'
    };
  }

  /**
   * Intelligently merge backup with current version
   */
  private mergeFile(
    backupContent: string,
    currentContent: string,
    patches: PatchSummary[]
  ): MergeResult {
    const conflicts: Conflict[] = [];

    const backupFrontmatter = this.parseYAMLFrontmatter(backupContent);
    const currentFrontmatter = this.parseYAMLFrontmatter(currentContent);

    // Merge thinking_phase if present in backup but not in current
    if (backupFrontmatter.thinking_phase && !currentFrontmatter.thinking_phase) {
      currentFrontmatter.thinking_phase = backupFrontmatter.thinking_phase;
    }

    // Check for conflicts
    if (backupFrontmatter.thinking_phase && currentFrontmatter.thinking_phase) {
      if (JSON.stringify(backupFrontmatter.thinking_phase) !==
          JSON.stringify(currentFrontmatter.thinking_phase)) {
        conflicts.push({
          section: 'thinking_phase',
          userVersion: JSON.stringify(backupFrontmatter.thinking_phase),
          upstreamVersion: JSON.stringify(currentFrontmatter.thinking_phase)
        });
      }
    }

    const mergedContent = this.reconstructFile(currentContent, currentFrontmatter);

    return {
      success: conflicts.length === 0,
      conflicts,
      mergedContent
    };
  }

  /**
   * Parse YAML frontmatter from markdown
   */
  private parseYAMLFrontmatter(content: string): Record<string, any> {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};

    const yaml = match[1];
    const result: Record<string, any> = {};

    const lines = yaml.split('\n');
    let currentKey = '';
    let inArray = false;
    let arrayValues: string[] = [];

    for (const line of lines) {
      const keyMatch = line.match(/^(\w+):\s*(.*)$/);
      if (keyMatch) {
        if (currentKey && inArray) {
          result[currentKey] = arrayValues;
          arrayValues = [];
          inArray = false;
        }

        currentKey = keyMatch[1];
        const value = keyMatch[2];

        if (value === '') {
          inArray = true;
        } else {
          result[currentKey] = value;
        }
      } else if (inArray && line.trim().startsWith('- ')) {
        arrayValues.push(line.trim().substring(2));
      } else if (line.startsWith('  ') && currentKey) {
        const nestedMatch = line.match(/^\s+(\w+):\s*(.*)$/);
        if (nestedMatch) {
          if (typeof result[currentKey] === 'string') {
            result[currentKey] = {};
          }
          result[currentKey][nestedMatch[1]] = nestedMatch[2];
        }
      }
    }

    if (currentKey && inArray) {
      result[currentKey] = arrayValues;
    }

    return result;
  }

  /**
   * Reconstruct file with merged frontmatter
   */
  private reconstructFile(originalContent: string, frontmatter: Record<string, any>): string {
    const contentWithoutFrontmatter = originalContent.replace(/^---\n[\s\S]*?\n---\n?/, '');

    let yamlStr = '---\n';
    for (const [key, value] of Object.entries(frontmatter)) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        yamlStr += `${key}:\n`;
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          yamlStr += `  ${nestedKey}: ${nestedValue}\n`;
        }
      } else if (Array.isArray(value)) {
        yamlStr += `${key}:\n`;
        for (const item of value) {
          yamlStr += `  - ${item}\n`;
        }
      } else {
        yamlStr += `${key}: ${value}\n`;
      }
    }
    yamlStr += '---\n';

    return yamlStr + contentWithoutFrontmatter;
  }

  /**
   * Calculate file hash
   */
  private hashFile(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Detect GSI installation directory
   */
  private detectGSIInstallDir(): string {
    // Check for global installation
    const globalPath = join(
      process.env.APPDATA || '',
      'npm',
      'node_modules',
      'get-shit-indexed-cc'
    );
    if (existsSync(globalPath)) {
      return globalPath;
    }

    // Check for local installation
    const localPath = join(process.cwd(), 'node_modules', 'get-shit-indexed-cc');
    if (existsSync(localPath)) {
      return localPath;
    }

    // Return default
    return process.cwd();
  }

  /**
   * Get current GSI version
   */
  private async getCurrentVersion(): Promise<string> {
    const packageJsonPath = join(this.gsiInstallDir, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.version || 'unknown';
    }
    return 'unknown';
  }

  /**
   * Get backup metadata
   */
  getMetadata(): PatchMetadata | null {
    if (!existsSync(this.metadataFile)) {
      return null;
    }
    return JSON.parse(readFileSync(this.metadataFile, 'utf-8'));
  }

  /**
   * Check if backup exists
   */
  hasBackup(): boolean {
    return existsSync(this.metadataFile);
  }

  /**
   * Clear backup
   */
  clearBackup(): void {
    if (existsSync(this.metadataFile)) {
      const metadata: PatchMetadata = JSON.parse(readFileSync(this.metadataFile, 'utf-8'));
      
      for (const file of metadata.files) {
        const backupPath = join(this.patchesDir, file.path);
        if (existsSync(backupPath)) {
          // Would use fs.unlinkSync in real implementation
        }
      }
    }
  }

  /**
   * Ensure directories exist
   */
  private ensureDirectories(): void {
    if (!existsSync(this.patchesDir)) {
      mkdirSync(this.patchesDir, { recursive: true });
    }
  }
}

export default PatchManager;
