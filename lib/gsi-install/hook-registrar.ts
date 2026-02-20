/**
 * Hook Registrar
 * 
 * Handles registration and management of GSI hooks.
 * 
 * @module gsi/gsi-install/hook-registrar
 */

import * as path from 'path';
import * as fs from 'fs';
import { EventEmitter } from 'events';

// Hook configuration
export interface HookConfig {
  /** Hook name */
  name: string;
  /** Hook event type */
  event: 'PreToolUse' | 'PostToolUse' | 'SessionStart' | 'Stop' | 'Notification';
  /** Hook command */
  command: string;
  /** Hook timeout in ms */
  timeout?: number;
}

// Hook registration result
export interface HookResult {
  /** Successfully registered hooks */
  registered: string[];
  /** Failed registrations */
  failed: string[];
  /** Errors */
  errors: string[];
}

// Hook status
export interface HookStatus {
  /** Whether hooks are registered */
  registered: boolean;
  /** List of registered hooks */
  hooks: string[];
  /** Settings path */
  settingsPath: string;
}

// Default GSI hooks
const DEFAULT_HOOKS: HookConfig[] = [
  {
    name: 'gsi-check-update',
    event: 'SessionStart',
    command: 'node $CONFIG_DIR/hooks/gsi-check-update.js',
  },
  {
    name: 'gsi-statusline',
    event: 'SessionStart',
    command: 'node $CONFIG_DIR/hooks/gsi-statusline.js',
  },
];

/**
 * Hook Registrar
 * 
 * Manages GSI hook registration and removal.
 */
export class HookRegistrar extends EventEmitter {
  /**
   * Register all GSI hooks
   */
  async registerAll(configDir: string, runtime: string = 'claude'): Promise<HookResult> {
    const result: HookResult = {
      registered: [],
      failed: [],
      errors: [],
    };

    const settingsPath = this.getSettingsPath(configDir, runtime);
    
    // Ensure settings file exists
    await this.ensureSettingsFile(settingsPath);

    // Load current settings
    const settings = this.loadSettings(settingsPath);

    // Initialize hooks object if not exists
    if (!settings.hooks) {
      settings.hooks = {};
    }

    // Register each hook
    for (const hook of DEFAULT_HOOKS) {
      try {
        const success = this.registerHook(settings, hook, configDir);
        if (success) {
          result.registered.push(hook.name);
          this.emit('hookRegistered', { hook: hook.name, event: hook.event });
        } else {
          result.failed.push(hook.name);
        }
      } catch (error) {
        result.failed.push(hook.name);
        result.errors.push(`Failed to register ${hook.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Save settings
    this.saveSettings(settingsPath, settings);

    return result;
  }

  /**
   * Unregister all GSI hooks
   */
  async unregisterAll(configDir: string, runtime: string = 'claude'): Promise<HookResult> {
    const result: HookResult = {
      registered: [],
      failed: [],
      errors: [],
    };

    const settingsPath = this.getSettingsPath(configDir, runtime);
    
    if (!fs.existsSync(settingsPath)) {
      return result;
    }

    const settings = this.loadSettings(settingsPath);

    // Remove GSI hooks
    for (const hook of DEFAULT_HOOKS) {
      try {
        const removed = this.unregisterHook(settings, hook.name);
        if (removed) {
          result.registered.push(hook.name);
          this.emit('hookUnregistered', { hook: hook.name });
        }
      } catch (error) {
        result.failed.push(hook.name);
        result.errors.push(`Failed to unregister ${hook.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Clean up empty hook objects
    if (settings.hooks) {
      for (const event of Object.keys(settings.hooks)) {
        if (Array.isArray(settings.hooks[event]) && settings.hooks[event].length === 0) {
          delete settings.hooks[event];
        }
      }
      if (Object.keys(settings.hooks).length === 0) {
        delete settings.hooks;
      }
    }

    // Save settings
    this.saveSettings(settingsPath, settings);

    // Rename result.registered to removed for clarity
    (result as { removed: string[] }).removed = result.registered;
    result.registered = [];

    return result;
  }

  /**
   * Get hook registration status
   */
  async getStatus(configDir: string, runtime: string = 'claude'): Promise<HookStatus> {
    const settingsPath = this.getSettingsPath(configDir, runtime);
    
    if (!fs.existsSync(settingsPath)) {
      return {
        registered: false,
        hooks: [],
        settingsPath,
      };
    }

    const settings = this.loadSettings(settingsPath);
    const registeredHooks: string[] = [];

    // Check for GSI hooks
    if (settings.hooks) {
      for (const hook of DEFAULT_HOOKS) {
        if (this.isHookRegistered(settings, hook.name, hook.event)) {
          registeredHooks.push(hook.name);
        }
      }
    }

    return {
      registered: registeredHooks.length > 0,
      hooks: registeredHooks,
      settingsPath,
    };
  }

  /**
   * Register a single hook
   */
  private registerHook(settings: Record<string, unknown>, hook: HookConfig, configDir: string): boolean {
    const normalizedConfigDir = configDir.replace(/\\/g, '/');
    
    if (!settings.hooks) {
      settings.hooks = {};
    }

    const hooksObj = settings.hooks as Record<string, unknown[]>;
    if (!hooksObj[hook.event]) {
      hooksObj[hook.event] = [];
    }

    // Check if already registered
    if (this.isHookRegistered(settings, hook.name, hook.event)) {
      return true; // Already registered
    }

    // Add hook entry
    const command = hook.command.replace('$CONFIG_DIR', normalizedConfigDir);
    hooksObj[hook.event].push({
      hooks: [{
        type: 'command',
        command,
        timeout: hook.timeout || 30000,
      }],
    });

    return true;
  }

  /**
   * Unregister a single hook
   */
  private unregisterHook(settings: Record<string, unknown>, hookName: string): boolean {
    if (!settings.hooks) {
      return false;
    }

    const hooksObj = settings.hooks as Record<string, unknown[]>;
    let removed = false;

    for (const event of Object.keys(hooksObj)) {
      const entries = hooksObj[event];
      if (!Array.isArray(entries)) continue;

      // Filter out entries containing the hook
      const filtered = entries.filter(entry => {
        if (entry && typeof entry === 'object' && 'hooks' in entry) {
          const entryHooks = (entry as { hooks: unknown[] }).hooks;
          if (Array.isArray(entryHooks)) {
            const hasHook = entryHooks.some(h => {
              if (h && typeof h === 'object' && 'command' in h) {
                const cmd = (h as { command: string }).command;
                return cmd && (cmd.includes(hookName) || cmd.includes(hookName.replace('gsi-', 'GSI-')));
              }
              return false;
            });
            if (hasHook) {
              removed = true;
              return false; // Remove this entry
            }
          }
        }
        return true; // Keep this entry
      });

      hooksObj[event] = filtered;
    }

    return removed;
  }

  /**
   * Check if a hook is registered
   */
  private isHookRegistered(settings: Record<string, unknown>, hookName: string, event: string): boolean {
    if (!settings.hooks) {
      return false;
    }

    const hooksObj = settings.hooks as Record<string, unknown[]>;
    const entries = hooksObj[event];
    if (!Array.isArray(entries)) {
      return false;
    }

    return entries.some(entry => {
      if (entry && typeof entry === 'object' && 'hooks' in entry) {
        const entryHooks = (entry as { hooks: unknown[] }).hooks;
        if (Array.isArray(entryHooks)) {
          return entryHooks.some(h => {
            if (h && typeof h === 'object' && 'command' in h) {
              const cmd = (h as { command: string }).command;
              return cmd && cmd.includes(hookName);
            }
            return false;
          });
        }
      }
      return false;
    });
  }

  /**
   * Get settings path for runtime
   */
  private getSettingsPath(configDir: string, runtime: string): string {
    if (runtime === 'opencode') {
      return path.join(configDir, 'opencode.json');
    }
    return path.join(configDir, 'settings.json');
  }

  /**
   * Ensure settings file exists
   */
  private async ensureSettingsFile(settingsPath: string): Promise<void> {
    const dir = path.dirname(settingsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(settingsPath)) {
      fs.writeFileSync(settingsPath, '{}\n', { mode: 0o600 });
    }
  }

  /**
   * Load settings from file
   */
  private loadSettings(settingsPath: string): Record<string, unknown> {
    try {
      const content = fs.readFileSync(settingsPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  /**
   * Save settings to file
   */
  private saveSettings(settingsPath: string, settings: Record<string, unknown>): void {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', { mode: 0o600 });
  }
}
