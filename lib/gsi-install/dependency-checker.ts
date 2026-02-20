/**
 * Dependency Checker
 * 
 * Verifies all dependencies for GSI installation.
 * 
 * @module gsi/gsi-install/dependency-checker
 */

import { EventEmitter } from 'events';
import * as childProcess from 'child_process';
import * as os from 'os';

// Individual dependency status
export interface DependencyStatus {
  /** Dependency name */
  name: string;
  /** Whether dependency is satisfied */
  satisfied: boolean;
  /** Installed version if available */
  version?: string;
  /** Required version */
  requiredVersion?: string;
  /** Error message if not satisfied */
  error?: string;
  /** Installation hint */
  hint?: string;
}

// Full dependency check result
export interface DependencyResult {
  /** Whether all dependencies are satisfied */
  success: boolean;
  /** Platform information */
  platform: {
    os: string;
    arch: string;
    nodeVersion: string;
  };
  /** Individual dependency statuses */
  dependencies: DependencyStatus[];
  /** Errors */
  errors: string[];
  /** Warnings */
  warnings: string[];
}

// Required dependencies
const REQUIRED_DEPENDENCIES = [
  {
    name: 'Node.js',
    command: 'node --version',
    versionRegex: /v?(\d+\.\d+\.\d+)/,
    requiredVersion: '16.7.0',
    hint: 'Install Node.js from https://nodejs.org/',
  },
  {
    name: 'npm',
    command: 'npm --version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    requiredVersion: '7.0.0',
    hint: 'npm comes bundled with Node.js',
  },
];

// Optional dependencies (MCP servers)
const OPTIONAL_DEPENDENCIES = [
  {
    name: 'Desktop Commander MCP',
    check: () => checkMCPServer('desktop-commander'),
    hint: 'Install via: npm install -g @anthropic-ai/desktop-commander-mcp',
  },
  {
    name: 'Code Index MCP',
    check: () => checkMCPServer('code-index-mcp'),
    hint: 'Install via: npm install -g code-index-mcp',
  },
];

/**
 * Check if an MCP server is available
 */
async function checkMCPServer(_serverName: string): Promise<{ available: boolean; version?: string }> {
  // In a real implementation, this would check MCP server availability
  // For now, return a placeholder
  return { available: false };
}

/**
 * Dependency Checker
 * 
 * Verifies all GSI dependencies.
 */
export class DependencyChecker extends EventEmitter {
  /**
   * Check all dependencies
   */
  async checkAll(): Promise<DependencyResult> {
    const result: DependencyResult = {
      success: true,
      platform: {
        os: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
      },
      dependencies: [],
      errors: [],
      warnings: [],
    };

    // Check required dependencies
    for (const dep of REQUIRED_DEPENDENCIES) {
      const status = await this.checkDependency(dep);
      result.dependencies.push(status);

      if (!status.satisfied) {
        result.success = false;
        result.errors.push(`${dep.name}: ${status.error}`);
      }
    }

    // Check optional dependencies
    for (const dep of OPTIONAL_DEPENDENCIES) {
      try {
        const checkResult = await dep.check();
        result.dependencies.push({
          name: dep.name,
          satisfied: checkResult.available,
          version: checkResult.version,
        });

        if (!checkResult.available) {
          result.warnings.push(`${dep.name} not available. ${dep.hint}`);
        }
      } catch (error) {
        result.dependencies.push({
          name: dep.name,
          satisfied: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          hint: dep.hint,
        });
      }
    }

    return result;
  }

  /**
   * Check a single dependency
   */
  private async checkDependency(dep: {
    name: string;
    command: string;
    versionRegex: RegExp;
    requiredVersion?: string;
    hint: string;
  }): Promise<DependencyStatus> {
    try {
      const output = await this.executeCommand(dep.command);
      const match = output.match(dep.versionRegex);

      if (!match) {
        return {
          name: dep.name,
          satisfied: false,
          error: 'Could not determine version',
          hint: dep.hint,
        };
      }

      const version = match[1];
      const satisfied = dep.requiredVersion
        ? this.compareVersions(version, dep.requiredVersion) >= 0
        : true;

      return {
        name: dep.name,
        satisfied,
        version,
        requiredVersion: dep.requiredVersion,
        error: satisfied ? undefined : `Version ${dep.requiredVersion} or higher required`,
        hint: satisfied ? undefined : dep.hint,
      };
    } catch (error) {
      return {
        name: dep.name,
        satisfied: false,
        error: 'Not found',
        hint: dep.hint,
      };
    }
  }

  /**
   * Execute a command and return output
   */
  private executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      childProcess.exec(command, { timeout: 5000 }, (error, stdout, _stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  /**
   * Compare semantic versions
   */
  private compareVersions(a: string, b: string): number {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);

    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const valA = partsA[i] || 0;
      const valB = partsB[i] || 0;

      if (valA > valB) return 1;
      if (valA < valB) return -1;
    }

    return 0;
  }

  /**
   * Check platform compatibility
   */
  checkPlatform(): {
    compatible: boolean;
    platform: string;
    issues: string[];
  } {
    const platform = os.platform();
    const issues: string[] = [];

    // Check for known platform issues
    if (platform === 'win32') {
      // Windows-specific checks
      const release = os.release();
      const majorVersion = parseInt(release.split('.')[0], 10);
      
      if (majorVersion < 10) {
        issues.push('Windows 10 or later is recommended');
      }
    }

    return {
      compatible: issues.length === 0,
      platform,
      issues,
    };
  }

  /**
   * Get installation recommendations
   */
  getRecommendations(result: DependencyResult): string[] {
    const recommendations: string[] = [];

    for (const dep of result.dependencies) {
      if (!dep.satisfied && dep.hint) {
        recommendations.push(dep.hint);
      }
    }

    if (result.warnings.length > 0) {
      recommendations.push('Consider installing optional MCP servers for enhanced functionality');
    }

    return recommendations;
  }
}
