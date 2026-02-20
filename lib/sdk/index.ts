/**
 * GSI SDK Integration Module
 * 
 * Provides native Claude Code SDK integration for GSI operations.
 * Falls back to MCP tools when SDK is not available.
 * 
 * @module gsi/sdk
 */

export { ClaudeCodeSDK, SDKManager } from './sdk-wrapper';
export { ProfileManager, type ModelProfile, type ProfileConfig } from './profile-manager';
export { DirectAPI, type APIResponse, type APIConfig } from './direct-api';
export { AuthManager, type AuthConfig, type Credentials } from './auth-manager';
export { SDKErrorHandler, type SDKError, type FallbackResult } from './error-handler';
export { PerformanceMonitor, type PerformanceMetrics, type OperationTiming } from './performance-monitor';

// Re-export convenience functions
export { createSDK, getSDK, isSDKAvailable } from './sdk-wrapper';
export { getCurrentProfile, setProfile, getAvailableProfiles } from './profile-manager';
