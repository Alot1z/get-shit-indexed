/**
 * Install Detector
 * 
 * Detects whether GSI is installed globally or at project level.
 * 
 * @module gsi/gsi-install/detector
 */

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

// Install type
export type InstallType = 'global' | 'project';

// Install location
export interface InstallLocation {
  /** Installation type */
  type: InstallType;
  /** Base path */
  basePath: string;
  /** Detection indicators */
  indicators: string[];
  /** Detected runtime */
  runtime?: 'claude' | 'opencode' | 'gemini';
}

// Detection options
export interface DetectionOptions {
  /** Current working directory */
  cwd?: string;
  /** Force global detection */
  forceGlobal?: boolean;
  /** Force project detection */
  forceProject?: boolean;
  /** Skip cache */
  noCache?: boolean;
  /** Target runtime */
  runtime?: 'claude' | 'opencode' | 'gemini';
}

// Global installation paths
const GLOBAL_PATHS: Record<string, () => string> = {
  claude: () => {
    if (process.env.CLAUDE_CONFIG_DIR) {
      return process.env.CLAUDE_CONFIG_DIR;
    }
    return path.join(os.homedir(), '.claude');
  },
  opencode: () => {
    if (process.env.OPENCODE_CONFIG_DIR) {
      return process.env.OPENCODE_CONFIG_DIR;
    }
    if (process.env.OPENCODE_CONFIG) {
      return path.dirname(process.env.OPENCODE_CONFIG);
    }
    if (process.env.XDG_CONFIG_HOME) {
      return path.join(process.env.XDG_CONFIG_HOME, 'opencode');
    }
    return path.join(os.homedir(), '.config', 'opencode');
  },
  gemini: () => {
    if (process.env.GEMINI_CONFIG_DIR) {
      return process.env.GEMINI_CONFIG_DIR;
    }
    return path.join(os.homedir(), '.gemini');
  },
};

// Project-level indicators
const PROJECT_INDICATORS = [
  '.gsi',
  'gsi',
  '.planning',
  'get-shit-indexed',
  'package.json',
];

/**
 * Install Detector
 * 
 * Detects GSI installation type and location.
 */
export class InstallDetector {
  private cache: Map<string, InstallLocation> = new Map();

  /**
   * Detect installation location
   */
  detect(options: DetectionOptions = {}): InstallLocation {
    const {
      cwd = process.cwd(),
      forceGlobal = false,
      forceProject = false,
      noCache = false,
      runtime = 'claude',
    } = options;

    const cacheKey = `${cwd}:${forceGlobal}:${forceProject}:${runtime}`;

    // Check cache
    if (!noCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let result: InstallLocation;

    // Handle forced modes
    if (forceGlobal) {
      result = {
        type: 'global',
        basePath: GLOBAL_PATHS[runtime](),
        indicators: ['forced'],
        runtime,
      };
    } else if (forceProject) {
      result = {
        type: 'project',
        basePath: cwd,
        indicators: ['forced'],
        runtime,
      };
    } else {
      // Detect based on environment
      result = this.detectFromEnvironment(cwd, runtime);
    }

    // Cache result
    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * Detect from environment
   */
  private detectFromEnvironment(cwd: string, runtime: string): InstallLocation {
    // Check for explicit environment variable
    const envType = process.env.GSI_INSTALL_TYPE;
    if (envType === 'global') {
      return {
        type: 'global',
        basePath: GLOBAL_PATHS[runtime](),
        indicators: ['env:GSI_INSTALL_TYPE=global'],
        runtime: runtime as 'claude' | 'opencode' | 'gemini',
      };
    }
    if (envType === 'project') {
      return {
        type: 'project',
        basePath: cwd,
        indicators: ['env:GSI_INSTALL_TYPE=project'],
        runtime: runtime as 'claude' | 'opencode' | 'gemini',
      };
    }

    // Check if running from global installation
    const globalPath = GLOBAL_PATHS[runtime]();
    const normalizedCwd = path.normalize(cwd);
    const normalizedGlobal = path.normalize(globalPath);

    if (normalizedCwd.startsWith(normalizedGlobal) || normalizedCwd === normalizedGlobal) {
      return {
        type: 'global',
        basePath: globalPath,
        indicators: ['running_from_global_path'],
        runtime: runtime as 'claude' | 'opencode' | 'gemini',
      };
    }

    // Check for project-level indicators
    const indicators: string[] = [];
    for (const indicator of PROJECT_INDICATORS) {
      const indicatorPath = path.join(cwd, indicator);
      if (fs.existsSync(indicatorPath)) {
        indicators.push(indicator);
      }
    }

    // If .planning directory exists, treat as project
    if (indicators.includes('.planning')) {
      return {
        type: 'project',
        basePath: cwd,
        indicators,
        runtime: runtime as 'claude' | 'opencode' | 'gemini',
      };
    }

    // Check parent directories (up to 3 levels)
    let checkDir = cwd;
    for (let i = 0; i < 3; i++) {
      const parentDir = path.dirname(checkDir);
      if (parentDir === checkDir) break;

      const planningPath = path.join(parentDir, '.planning');
      if (fs.existsSync(planningPath)) {
        return {
          type: 'project',
          basePath: parentDir,
          indicators: ['.planning (parent)'],
          runtime: runtime as 'claude' | 'opencode' | 'gemini',
        };
      }
      checkDir = parentDir;
    }

    // Check for existing global installation
    const gsiGlobalPath = path.join(globalPath, 'get-shit-indexed');
    if (fs.existsSync(gsiGlobalPath)) {
      return {
        type: 'global',
        basePath: globalPath,
        indicators: ['existing_global_install'],
        runtime: runtime as 'claude' | 'opencode' | 'gemini',
      };
    }

    // Default to project-level
    return {
      type: 'project',
      basePath: cwd,
      indicators: indicators.length > 0 ? indicators : ['default'],
      runtime: runtime as 'claude' | 'opencode' | 'gemini',
    };
  }

  /**
   * Check if global install
   */
  isGlobal(options: DetectionOptions = {}): boolean {
    return this.detect(options).type === 'global';
  }

  /**
   * Check if project install
   */
  isProject(options: DetectionOptions = {}): boolean {
    return this.detect(options).type === 'project';
  }

  /**
   * Get global path for runtime
   */
  getGlobalPath(runtime: 'claude' | 'opencode' | 'gemini' = 'claude'): string {
    return GLOBAL_PATHS[runtime]();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
let defaultDetector: InstallDetector | null = null;

/**
 * Get default detector
 */
function getDetector(): InstallDetector {
  if (!defaultDetector) {
    defaultDetector = new InstallDetector();
  }
  return defaultDetector;
}

/**
 * Detect install type (convenience function)
 */
export function detectInstallType(options?: DetectionOptions): InstallLocation {
  return getDetector().detect(options);
}

/**
 * Check if global install (convenience function)
 */
export function isGlobalInstall(options?: DetectionOptions): boolean {
  return getDetector().isGlobal(options);
}

/**
 * Check if project install (convenience function)
 */
export function isProjectInstall(options?: DetectionOptions): boolean {
  return getDetector().isProject(options);
}
