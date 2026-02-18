/**
 * GSI Patch Manager Module
 *
 * Handles backup and restoration of local modifications across GSI package updates.
 * Extracted from v1.18.0 → v1.23.0 migration session (28 files patched).
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

interface PatchMetadata {
  version: string;
  timestamp: string;
  files: PatchFile[];
  patches: PatchSummary[];
}

interface PatchFile {
  path: string;
  hash: string;
  modified: boolean;
}

interface PatchSummary {
  file: string;
  type: 'thinking_phase' | 'allowed_tools' | 'content' | 'mixed';
  description: string;
}

interface MergeResult {
  success: boolean;
  conflicts: Conflict[];
  mergedContent: string;
}

interface Conflict {
  section: string;
  userVersion: string;
  upstreamVersion: string;
  resolution?: 'user' | 'upstream' | 'merged';
}

export class PatchManager {
  private patchesDir: string;
  private gsiInstallDir: string;
  private metadataFile: string;

  constructor(patchesDir: string = join(process.env.HOME || '', '.claude', 'GSI-local-patches')) {
    this.patchesDir = patchesDir;
    this.metadataFile = join(patchesDir, 'backup-meta.json');
    this.gsiInstallDir = this.detectGSIInstallDir();
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

    if (!existsSync(this.patchesDir)) {
      mkdirSync(this.patchesDir, { recursive: true });
    }

    for (const file of modifiedFiles) {
      const sourcePath = join(this.gsiInstallDir, file);
      const backupPath = join(this.patchesDir, file);

      // Copy file to backup
      const content = readFileSync(sourcePath, 'utf-8');
      mkdirSync(join(backupPath, '..'), { recursive: true });
      writeFileSync(backupPath, content);

      // Analyze what changed
      const summary = this.analyzeModification(content);
      metadata.patches.push(summary);
      metadata.files.push({
        path: file,
        hash: this.hashFile(content),
        modified: true
      });
    }

    // Save metadata
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

      // Merge modifications
      const mergeResult = this.mergeFile(backupContent, currentContent, metadata.patches);

      if (mergeResult.success) {
        writeFileSync(currentPath, mergeResult.mergedContent);
      }

      results.set(file.path, mergeResult);
    }

    return results;
  }

  /**
   * Detect which files have local modifications
   */
  private async detectModifications(): Promise<string[]> {
    // In a real implementation, this would:
    // 1. Get list of all GSI files
    // 2. Compare hashes against known-good version
    // 3. Return files with different hashes

    // For now, return common modification locations
    return [
      'commands/GSI/add-phase.md',
      'commands/GSI/debug.md',
      // ... other files
    ];
  }

  /**
   * Analyze what was modified in a file
   */
  private analyzeModification(content: string): PatchSummary {
    // Detect thinking_phase additions
    if (content.includes('thinking_phase:')) {
      return {
        file: 'unknown',
        type: 'thinking_phase',
        description: 'Added thinking_phase configuration'
      };
    }

    // Detect allowed_tools modifications
    if (content.includes('allowed-tools:')) {
      return {
        file: 'unknown',
        type: 'allowed_tools',
        description: 'Modified allowed-tools list'
      };
    }

    return {
      file: 'unknown',
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

    // Parse YAML frontmatter
    const backupFrontmatter = this.parseYAMLFrontmatter(backupContent);
    const currentFrontmatter = this.parseYAMLFrontmatter(currentContent);

    // Merge thinking_phase if present in backup but not in current
    if (backupFrontmatter.thinking_phase && !currentFrontmatter.thinking_phase) {
      currentFrontmatter.thinking_phase = backupFrontmatter.thinking_phase;
    }

    // Check for conflicts
    if (backupFrontmatter.thinking_phase && currentFrontmatter.thinking_phase) {
      // Both have thinking_phase - check if different
      if (JSON.stringify(backupFrontmatter.thinking_phase) !==
          JSON.stringify(currentFrontmatter.thinking_phase)) {
        conflicts.push({
          section: 'thinking_phase',
          userVersion: JSON.stringify(backupFrontmatter.thinking_phase),
          upstreamVersion: JSON.stringify(currentFrontmatter.thinking_phase)
        });
      }
    }

    // Reconstruct file with merged frontmatter
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

    // Simple YAML parser for GSI format
    const lines = yaml.split('\n');
    let currentKey = '';
    let currentValue: any = '';
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
        currentValue = keyMatch[2];

        if (currentValue === '') {
          inArray = true;
        } else {
          result[currentKey] = currentValue;
        }
      } else if (inArray && line.trim().startsWith('- ')) {
        arrayValues.push(line.trim().substring(2));
      } else if (line.startsWith('  ') && currentKey) {
        // Nested value (e.g., thinking_phase fields)
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
        // Nested object (e.g., thinking_phase)
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

    throw new Error('GSI installation not found');
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
}

export default PatchManager;
