/**
 * Install Location Detector
 * 
 * Detects whether GSI is installed globally (~/.claude/get-shit-indexed/)
 * or at project-level (./gsi/ or ./get-shit-indexed/).
 * 
 * Provides caching for performance.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Cache for install location
let cachedLocation = null;

// Global installation path
const GLOBAL_INSTALL_PATH = path.join(os.homedir(), '.claude', 'get-shit-indexed');

// Project-level installation indicators
const PROJECT_INDICATORS = [
  '.gsi',
  'gsi',
  '.planning',
  'get-shit-indexed'
];

/**
 * Detect GSI install location
 * @param {object} options - Detection options
 * @param {string} options.cwd - Current working directory (defaults to process.cwd())
 * @param {boolean} options.forceGlobal - Force global detection (for testing)
 * @param {boolean} options.forceProject - Force project detection (for testing)
 * @param {boolean} options.noCache - Skip cache (for testing)
 * @returns {{ type: 'global'|'project', basePath: string, indicators: string[] }}
 */
function detectInstallLocation(options = {}) {
  const {
    cwd = process.cwd(),
    forceGlobal = false,
    forceProject = false,
    noCache = false
  } = options;

  // Check cache first (unless bypassed)
  if (!noCache && cachedLocation && !forceGlobal && !forceProject) {
    return cachedLocation;
  }

  // Check for forced modes (testing)
  if (forceGlobal) {
    const result = {
      type: 'global',
      basePath: GLOBAL_INSTALL_PATH,
      indicators: ['forced']
    };
    if (!noCache) cachedLocation = result;
    return result;
  }

  if (forceProject) {
    const result = {
      type: 'project',
      basePath: cwd,
      indicators: ['forced']
    };
    if (!noCache) cachedLocation = result;
    return result;
  }

  // Check for GSI_INSTALL_TYPE environment variable
  const envType = process.env.GSI_INSTALL_TYPE;
  if (envType === 'global') {
    const result = {
      type: 'global',
      basePath: GLOBAL_INSTALL_PATH,
      indicators: ['env:GSI_INSTALL_TYPE=global']
    };
    if (!noCache) cachedLocation = result;
    return result;
  }

  if (envType === 'project') {
    const result = {
      type: 'project',
      basePath: cwd,
      indicators: ['env:GSI_INSTALL_TYPE=project']
    };
    if (!noCache) cachedLocation = result;
    return result;
  }

  // Check if running from global installation
  const normalizedCwd = path.normalize(cwd);
  const normalizedGlobal = path.normalize(GLOBAL_INSTALL_PATH);

  if (normalizedCwd.startsWith(normalizedGlobal) ||
      normalizedCwd === normalizedGlobal) {
    const result = {
      type: 'global',
      basePath: GLOBAL_INSTALL_PATH,
      indicators: ['running_from_global_path']
    };
    if (!noCache) cachedLocation = result;
    return result;
  }

  // Check for project-level indicators
  const indicators = [];
  for (const indicator of PROJECT_INDICATORS) {
    const indicatorPath = path.join(cwd, indicator);
    if (fs.existsSync(indicatorPath)) {
      indicators.push(indicator);
    }
  }

  // If we find .planning directory, treat as project-level
  if (indicators.includes('.planning')) {
    const result = {
      type: 'project',
      basePath: cwd,
      indicators
    };
    if (!noCache) cachedLocation = result;
    return result;
  }

  // Check parent directories for .planning (up to 3 levels)
  let checkDir = cwd;
  for (let i = 0; i < 3; i++) {
    const parentDir = path.dirname(checkDir);
    if (parentDir === checkDir) break; // reached root

    const planningPath = path.join(parentDir, '.planning');
    if (fs.existsSync(planningPath)) {
      const result = {
        type: 'project',
        basePath: parentDir,
        indicators: ['.planning (parent)']
      };
      if (!noCache) cachedLocation = result;
      return result;
    }
    checkDir = parentDir;
  }

  // Default to project-level if uncertain
  const result = {
    type: 'project',
    basePath: cwd,
    indicators: indicators.length > 0 ? indicators : ['default']
  };
  if (!noCache) cachedLocation = result;
  return result;
}

/**
 * Check if running in global mode
 * @param {object} options - Detection options
 * @returns {boolean}
 */
function isGlobalInstall(options = {}) {
  const location = detectInstallLocation(options);
  return location.type === 'global';
}

/**
 * Check if running in project mode
 * @param {object} options - Detection options
 * @returns {boolean}
 */
function isProjectInstall(options = {}) {
  const location = detectInstallLocation(options);
  return location.type === 'project';
}

/**
 * Get the base path for GSI installation
 * @param {object} options - Detection options
 * @returns {string}
 */
function getBasePath(options = {}) {
  const location = detectInstallLocation(options);
  return location.basePath;
}

/**
 * Clear the detection cache (for testing)
 */
function clearCache() {
  cachedLocation = null;
}

/**
 * Get the global installation path
 * @returns {string}
 */
function getGlobalInstallPath() {
  return GLOBAL_INSTALL_PATH;
}

module.exports = {
  detectInstallLocation,
  isGlobalInstall,
  isProjectInstall,
  getBasePath,
  clearCache,
  getGlobalInstallPath,
  GLOBAL_INSTALL_PATH
};
