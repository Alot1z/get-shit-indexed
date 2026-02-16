/**
 * Context-Aware Path Resolver
 * 
 * Resolves paths based on GSI install location (global vs project-level).
 * Provides consistent path resolution for data storage.
 */

const path = require('path');
const fs = require('fs');
const { detectInstallLocation, getGlobalInstallPath } = require('./install-detector');

// Data type to subdirectory mapping
const DATA_PATHS = {
  patterns: '.planning/patterns',
  metrics: '.planning',
  reflections: '.debug-thinking-mcp/reflections',
  thinking: '.planning',
  commandThinking: '.planning',
  complexity: '.planning',
  gsdIntegration: '.planning',
  workflow: '.planning',
  todos: '.planning/todos'
};

// Reflections are always stored globally (per user)
const ALWAYS_GLOBAL_TYPES = ['reflections'];

/**
 * Resolve a path relative to the install base
 * @param {string} relativePath - Path relative to install base
 * @param {object} options - Resolution options
 * @param {string} options.cwd - Current working directory
 * @param {boolean} options.forceGlobal - Force global context
 * @param {boolean} options.forceProject - Force project context
 * @param {boolean} options.createDirs - Create directories if missing (default: false)
 * @returns {string} Absolute path
 */
function resolvePath(relativePath, options = {}) {
  const { createDirs = false, ...detectOptions } = options;
  const location = detectInstallLocation(detectOptions);

  // Build absolute path
  const absolutePath = path.join(location.basePath, relativePath);

  // Validate and optionally create
  if (createDirs) {
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  return absolutePath;
}

/**
 * Resolve a data path by type
 * @param {string} dataType - Type of data (patterns, metrics, reflections, thinking, etc.)
 * @param {object} options - Resolution options
 * @param {string} options.filename - Optional filename to append
 * @param {boolean} options.createDirs - Create directories if missing
 * @returns {string} Absolute path to data directory or file
 */
function resolveDataPath(dataType, options = {}) {
  const { filename, createDirs = false, forceGlobal = false, forceProject = false, cwd } = options;

  // Determine if this data type should always be global
  const useGlobal = ALWAYS_GLOBAL_TYPES.includes(dataType) || forceGlobal;

  // Get the base subpath for this data type
  const subpath = DATA_PATHS[dataType];
  if (!subpath) {
    throw new Error(`Unknown data type: ${dataType}. Known types: ${Object.keys(DATA_PATHS).join(', ')}`);
  }

  // Resolve base path
  let basePath;
  if (useGlobal) {
    basePath = getGlobalInstallPath();
  } else {
    const location = detectInstallLocation({ cwd, forceProject });
    basePath = location.basePath;
  }

  // Build full path
  let fullPath = path.join(basePath, subpath);

  // Append filename if provided
  if (filename) {
    fullPath = path.join(fullPath, filename);
  }

  // Create directories if requested
  if (createDirs) {
    const dir = filename ? path.dirname(fullPath) : fullPath;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  return fullPath;
}

/**
 * Get the .planning directory path
 * @param {object} options - Resolution options
 * @returns {string} Absolute path to .planning directory
 */
function getPlanningPath(options = {}) {
  return resolvePath('.planning', options);
}

/**
 * Get the patterns storage path
 * @param {object} options - Resolution options
 * @returns {string} Absolute path to patterns directory
 */
function getPatternsPath(options = {}) {
  return resolveDataPath('patterns', options);
}

/**
 * Get the metrics storage path
 * @param {string} metricsType - Type of metrics (thinking, commandThinking, etc.)
 * @param {object} options - Resolution options
 * @returns {string} Absolute path to metrics file
 */
function getMetricsPath(metricsType, options = {}) {
  const filenames = {
    thinking: 'thinking-metrics.json',
    commandThinking: 'command-thinking-metrics.json',
    complexity: 'complexity-history.json',
    patternLearning: 'pattern-learning-metrics.json',
    gsdIntegration: 'gsd-integration-tracking.json'
  };

  const filename = filenames[metricsType];
  if (!filename) {
    throw new Error(`Unknown metrics type: ${metricsType}. Known types: ${Object.keys(filenames).join(', ')}`);
  }

  // Determine data type based on metrics type
  const dataTypeMap = {
    thinking: 'thinking',
    commandThinking: 'commandThinking',
    complexity: 'complexity',
    patternLearning: 'patterns',
    gsdIntegration: 'gsdIntegration'
  };

  return resolveDataPath(dataTypeMap[metricsType] || 'metrics', { ...options, filename });
}

/**
 * Get the reflections storage path (always global)
 * @param {object} options - Resolution options
 * @returns {string} Absolute path to reflections directory
 */
function getReflectionsPath(options = {}) {
  // Reflections are always stored globally
  return resolveDataPath('reflections', { ...options, forceGlobal: true });
}

/**
 * Validate that a path exists and is accessible
 * @param {string} targetPath - Path to validate
 * @param {string} access - Required access level ('read', 'write', or 'both')
 * @returns {{ valid: boolean, error: string|null }}
 */
function validatePath(targetPath, access = 'read') {
  try {
    // Check existence
    if (!fs.existsSync(targetPath)) {
      return { valid: false, error: `Path does not exist: ${targetPath}` };
    }

    // Check access
    if (access === 'read' || access === 'both') {
      fs.accessSync(targetPath, fs.constants.R_OK);
    }
    if (access === 'write' || access === 'both') {
      fs.accessSync(targetPath, fs.constants.W_OK);
    }

    return { valid: true, error: null };
  } catch (err) {
    return { valid: false, error: `Access error: ${err.message}` };
  }
}

/**
 * Get all data paths for current context (useful for debugging)
 * @param {object} options - Resolution options
 * @returns {object} Map of data types to paths
 */
function getAllDataPaths(options = {}) {
  const paths = {};
  for (const dataType of Object.keys(DATA_PATHS)) {
    try {
      paths[dataType] = resolveDataPath(dataType, options);
    } catch (err) {
      paths[dataType] = { error: err.message };
    }
  }
  return paths;
}

module.exports = {
  resolvePath,
  resolveDataPath,
  getPlanningPath,
  getPatternsPath,
  getMetricsPath,
  getReflectionsPath,
  validatePath,
  getAllDataPaths,
  DATA_PATHS,
  ALWAYS_GLOBAL_TYPES
};
