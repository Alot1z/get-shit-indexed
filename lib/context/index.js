/**
 * Context Module Index
 * 
 * Exports all context-aware utilities for GSI.
 */

const installDetector = require('./install-detector');
const pathResolver = require('./path-resolver');

module.exports = {
  // Install detection
  detectInstallLocation: installDetector.detectInstallLocation,
  isGlobalInstall: installDetector.isGlobalInstall,
  isProjectInstall: installDetector.isProjectInstall,
  getBasePath: installDetector.getBasePath,
  clearDetectionCache: installDetector.clearCache,
  getGlobalInstallPath: installDetector.getGlobalInstallPath,
  GLOBAL_INSTALL_PATH: installDetector.GLOBAL_INSTALL_PATH,

  // Path resolution
  resolvePath: pathResolver.resolvePath,
  resolveDataPath: pathResolver.resolveDataPath,
  getPlanningPath: pathResolver.getPlanningPath,
  getPatternsPath: pathResolver.getPatternsPath,
  getMetricsPath: pathResolver.getMetricsPath,
  getReflectionsPath: pathResolver.getReflectionsPath,
  validatePath: pathResolver.validatePath
};
