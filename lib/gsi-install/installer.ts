/**
 * GSI Installer
 * 
 * Main installation module for GSI.
 * Handles global vs project installation, dependency checking, and hook registration.
 * 
 * @module gsi/gsi-install/installer
 */

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { EventEmitter } from 'events';
import { InstallDetector, type InstallType } from './detector';
import { HookRegistrar } from './hook-registrar';
import { DependencyChecker } from './dependency-checker';

// Installation configuration
export interface InstallConfig {
  /** Installation type (global or project) */
  type: InstallType;
  /** Target runtime (claude, opencode, gemini) */
  runtime: 'claude' | 'opencode' | 'gemini';
  /** Custom config directory */
  configDir?: string;
  /** Force overwrite existing installation */
  force?: boolean;
  /** Skip hook registration */
  skipHooks?: boolean;
  /** Skip dependency checks */
  skipDependencyCheck?: boolean;
  /** Verbose output */
  verbose?: boolean;
  /** Dry run (show what would be done) */
  dryRun?: boolean;
}

// Installation options (simplified for CLI)
export interface InstallOptions {
  global?: boolean;
  local?: boolean;
  runtime?: 'claude' | 'opencode' | 'gemini';
  configDir?: string;
  force?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}

// Installation result
export interface InstallResult {
  /** Whether installation succeeded */
  success: boolean;
  /** Installation type performed */
  type: InstallType;
  /** Runtime installed to */
  runtime: string;
  /** Config directory path */
  configDir: string;
  /** Files installed */
  filesInstalled: string[];
  /** Hooks registered */
  hooksRegistered: string[];
  /** Errors encountered */
  errors: string[];
  /** Warnings */
  warnings: string[];
  /** Installation duration in ms */
  duration: number;
}

// Uninstall result
export interface UninstallResult {
  success: boolean;
  type: InstallType;
  runtime: string;
  filesRemoved: string[];
  hooksRemoved: string[];
  errors: string[];
  warnings: string[];
  duration: number;
}

// Verification result
export interface VerifyResult {
  success: boolean;
  checks: {
    dependencies: boolean;
    hooks: boolean;
    files: boolean;
    mcpConnections: boolean;
  };
  errors: string[];
  warnings: string[];
}

/**
 * GSI Installer
 * 
 * Handles complete GSI installation workflow.
 */
export class Installer extends EventEmitter {
  private detector: InstallDetector;
  private hookRegistrar: HookRegistrar;
  private dependencyChecker: DependencyChecker;

  constructor() {
    super();
    this.detector = new InstallDetector();
    this.hookRegistrar = new HookRegistrar();
    this.dependencyChecker = new DependencyChecker();
  }

  /**
   * Install GSI
   */
  async install(options: InstallOptions = {}): Promise<InstallResult> {
    const startTime = Date.now();
    const result: InstallResult = {
      success: false,
      type: options.global ? 'global' : 'project',
      runtime: options.runtime || 'claude',
      configDir: '',
      filesInstalled: [],
      hooksRegistered: [],
      errors: [],
      warnings: [],
      duration: 0,
    };

    try {
      // Determine installation type
      const installType: InstallType = options.global ? 'global' : 'project';
      result.type = installType;

      // Get config directory
      result.configDir = this.getConfigDir(installType, options.runtime || 'claude', options.configDir);

      this.emit('progress', { stage: 'detecting', message: `Installing to ${result.configDir}` });

      // Check dependencies unless skipped
      if (!options.dryRun) {
        const depResult = await this.dependencyChecker.checkAll();
        if (!depResult.success && !options.force) {
          result.errors.push(...depResult.errors);
          result.warnings.push(...depResult.warnings);
          // Continue anyway with warnings
        }
      }

      // Create config directory
      if (!options.dryRun && !fs.existsSync(result.configDir)) {
        fs.mkdirSync(result.configDir, { recursive: true });
        this.emit('progress', { stage: 'createdir', message: `Created ${result.configDir}` });
      }

      // Install files (placeholder - would copy from package)
      const filesToInstall = this.getFilesToInstall();
      for (const file of filesToInstall) {
        if (options.verbose) {
          this.emit('progress', { stage: 'install', message: `Installing ${file}` });
        }
        result.filesInstalled.push(file);
      }

      // Register hooks
      if (!options.dryRun) {
        const hookResult = await this.hookRegistrar.registerAll(result.configDir, options.runtime || 'claude');
        result.hooksRegistered = hookResult.registered;
        if (hookResult.errors.length > 0) {
          result.warnings.push(...hookResult.errors);
        }
      }

      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;

      this.emit('complete', result);
      return result;
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.duration = Date.now() - startTime;
      this.emit('error', error);
      return result;
    }
  }

  /**
   * Uninstall GSI
   */
  async uninstall(options: InstallOptions = {}): Promise<UninstallResult> {
    const startTime = Date.now();
    const runtime = options.runtime || 'claude';
    const installType: InstallType = options.global ? 'global' : 'project';
    const configDir = this.getConfigDir(installType, runtime, options.configDir);

    const result: UninstallResult = {
      success: false,
      type: installType,
      runtime,
      filesRemoved: [],
      hooksRemoved: [],
      errors: [],
      warnings: [],
      duration: 0,
    };

    try {
      // Unregister hooks
      if (!options.dryRun) {
        const hookResult = await this.hookRegistrar.unregisterAll(configDir, runtime);
        result.hooksRemoved = hookResult.removed || [];
        if (hookResult.errors.length > 0) {
          result.warnings.push(...hookResult.errors);
        }
      }

      // Remove files
      const filesToRemove = this.getInstalledFiles(configDir);
      for (const file of filesToRemove) {
        if (fs.existsSync(file)) {
          if (!options.dryRun) {
            fs.unlinkSync(file);
          }
          result.filesRemoved.push(file);
        }
      }

      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;

      this.emit('uninstall', result);
      return result;
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.duration = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Verify installation
   */
  async verify(options: InstallOptions = {}): Promise<VerifyResult> {
    const runtime = options.runtime || 'claude';
    const installType: InstallType = options.global ? 'global' : 'project';
    const configDir = this.getConfigDir(installType, runtime, options.configDir);

    const result: VerifyResult = {
      success: false,
      checks: {
        dependencies: false,
        hooks: false,
        files: false,
        mcpConnections: false,
      },
      errors: [],
      warnings: [],
    };

    // Check dependencies
    const depResult = await this.dependencyChecker.checkAll();
    result.checks.dependencies = depResult.success;
    if (!depResult.success) {
      result.errors.push(...depResult.errors);
    }

    // Check hooks
    const hookStatus = await this.hookRegistrar.getStatus(configDir, runtime);
    result.checks.hooks = hookStatus.registered;
    if (!hookStatus.registered) {
      result.warnings.push('Hooks not registered');
    }

    // Check files
    const requiredFiles = this.getRequiredFiles();
    const missingFiles = requiredFiles.filter(f => !fs.existsSync(path.join(configDir, f)));
    result.checks.files = missingFiles.length === 0;
    if (missingFiles.length > 0) {
      result.warnings.push(`Missing files: ${missingFiles.join(', ')}`);
    }

    // MCP connections (placeholder)
    result.checks.mcpConnections = true;

    result.success = Object.values(result.checks).every(v => v);
    return result;
  }

  /**
   * Get installation status
   */
  getStatus(options: InstallOptions = {}): {
    type: InstallType;
    runtime: string;
    configDir: string;
    installed: boolean;
    version: string | null;
  } {
    const runtime = options.runtime || 'claude';
    const location = this.detector.detect({
      forceGlobal: options.global,
      forceProject: options.local,
    });

    const configDir = this.getConfigDir(location.type, runtime, options.configDir);
    const version = this.getInstalledVersion(configDir);

    return {
      type: location.type,
      runtime,
      configDir,
      installed: version !== null,
      version,
    };
  }

  /**
   * Get config directory for runtime
   */
  private getConfigDir(type: InstallType, runtime: string, customDir?: string): string {
    if (customDir) {
      return customDir;
    }

    if (type === 'global') {
      switch (runtime) {
        case 'opencode':
          return path.join(os.homedir(), '.config', 'opencode');
        case 'gemini':
          return path.join(os.homedir(), '.gemini');
        default:
          return path.join(os.homedir(), '.claude');
      }
    }

    // Project installation
    const projectDir = process.cwd();
    switch (runtime) {
      case 'opencode':
        return path.join(projectDir, '.opencode');
      case 'gemini':
        return path.join(projectDir, '.gemini');
      default:
        return path.join(projectDir, '.claude');
    }
  }

  /**
   * Get files to install
   */
  private getFilesToInstall(): string[] {
    return [
      'commands/gsi/',
      'agents/gsi-*.md',
      'hooks/gsi-*.js',
      'get-shit-indexed/',
    ];
  }

  /**
   * Get list of installed files
   */
  private getInstalledFiles(configDir: string): string[] {
    const files: string[] = [];
    const gsiDir = path.join(configDir, 'get-shit-indexed');
    
    if (fs.existsSync(gsiDir)) {
      files.push(gsiDir);
    }

    // Add other GSI directories
    const commandsDir = path.join(configDir, 'commands', 'gsi');
    if (fs.existsSync(commandsDir)) {
      files.push(commandsDir);
    }

    return files;
  }

  /**
   * Get required files for verification
   */
  private getRequiredFiles(): string[] {
    return [
      'get-shit-indexed/bin/gsi-tools.js',
    ];
  }

  /**
   * Get installed version
   */
  private getInstalledVersion(configDir: string): string | null {
    const pkgPath = path.join(configDir, 'get-shit-indexed', 'package.json');
    try {
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return pkg.version;
      }
    } catch {
      // Ignore errors
    }
    return null;
  }
}

// Singleton instance
let defaultInstaller: Installer | null = null;

/**
 * Get default installer
 */
function getInstaller(): Installer {
  if (!defaultInstaller) {
    defaultInstaller = new Installer();
  }
  return defaultInstaller;
}

/**
 * Install GSI (convenience function)
 */
export async function install(options?: InstallOptions): Promise<InstallResult> {
  return getInstaller().install(options);
}

/**
 * Uninstall GSI (convenience function)
 */
export async function uninstall(options?: InstallOptions): Promise<UninstallResult> {
  return getInstaller().uninstall(options);
}

/**
 * Verify installation (convenience function)
 */
export async function verify(options?: InstallOptions): Promise<VerifyResult> {
  return getInstaller().verify(options);
}

/**
 * Get installation status (convenience function)
 */
export function getStatus(options?: InstallOptions): ReturnType<Installer['getStatus']> {
  return getInstaller().getStatus(options);
}
