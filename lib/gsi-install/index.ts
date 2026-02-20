/**
 * GSI Installation System
 * 
 * Handles global vs project installation detection and management.
 * 
 * @module gsi/gsi-install
 */

export { Installer, type InstallConfig, type InstallOptions, type InstallResult } from './installer';
export { InstallDetector, type InstallLocation, type InstallType } from './detector';
export { HookRegistrar, type HookConfig, type HookResult } from './hook-registrar';
export { DependencyChecker, type DependencyStatus, type DependencyResult } from './dependency-checker';

// Re-export convenience functions
export { install, uninstall, verify, getStatus } from './installer';
export { detectInstallType, isGlobalInstall, isProjectInstall } from './detector';
