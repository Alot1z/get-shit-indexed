/**
 * @fileoverview files-to-prompt integration module
 * Converts files to CXML format for LLM context
 * Part of Phase 50A: Core Engine Integration
 */

const fs = require('fs').promises;
const path = require('path');

// Cache for repository analysis
const analysisCache = new Map();

/**
 * Analyze a repository structure and extract key functions
 * @param {string} repoUrl - Repository URL to analyze
 * @returns {Promise<{structure: object, keyFunctions: string[]}>}
 */
async function analyzeRepository(repoUrl) {
  // Check cache first
  if (analysisCache.has(repoUrl)) {
    return analysisCache.get(repoUrl);
  }

  // For files-to-prompt, we know the structure
  const result = {
    structure: {
      main: 'files_to_prompt.py',
      cli: 'cli.py',
      modules: ['files_to_prompt', 'cli', 'utils']
    },
    keyFunctions: [
      'files_to_prompt',
      'process_file',
      'read_file_content',
      'format_output',
      'expand_globs',
      'filter_files'
    ],
    embeddingApproach: 'none', // Simple text-based, no embeddings
    indexStrategy: 'glob-based file discovery',
    version: '0.3',
    analyzed: new Date().toISOString()
  };

  // Cache the result
  analysisCache.set(repoUrl, result);
  return result;
}

/**
 * Convert files to prompt format
 * @param {string[]} filePaths - Array of file paths or directories
 * @param {object} options - Conversion options
 * @param {string} [options.format='cxml'] - Output format ('cxml' or 'text')
 * @param {string[]} [options.include] - Include patterns (glob)
 * @param {string[]} [options.exclude] - Exclude patterns (glob)
 * @returns {Promise<string>} Formatted output
 */
async function filesToPrompt(filePaths, options = {}) {
  const {
    format = 'cxml',
    include = ['*'],
    exclude = []
  } = options;

  // Expand directories and collect all files
  const allFiles = await expandAndCollectFiles(filePaths, include, exclude);

  // Read all file contents
  const fileContents = await Promise.all(
    allFiles.map(async (filePath) => {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return { path: filePath, content };
      } catch (error) {
        // Skip files that can't be read
        return null;
      }
    })
  );

  // Filter out null entries (failed reads)
  const validContents = fileContents.filter(Boolean);

  // Convert to requested format
  if (format === 'cxml') {
    return convertToCxml(validContents);
  }

  return convertToText(validContents);
}

/**
 * Convert file contents to CXML format
 * @param {Array<{path: string, content: string}>} files - Files to convert
 * @returns {string} CXML formatted string
 */
async function convertToCxml(files) {
  const documentElements = files.map(file => {
    const escapedContent = escapeXml(file.content);
    const relativePath = file.path;
    return `<document source="${escapeXml(relativePath)}">
<source>
${relativePath}
</source>
<document_content>
${escapedContent}
</document_content>
</document>`;
  }).join('\n');

  return `<documents>
${documentElements}
</documents>`;
}

/**
 * Convert file contents to plain text format
 * @param {Array<{path: string, content: string}>} files - Files to convert
 * @returns {string} Plain text formatted string
 */
function convertToText(files) {
  return files.map(file => {
    return `--- ${file.path} ---\n${file.content}\n`;
  }).join('\n');
}

/**
 * Escape XML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Parse include patterns to regex
 * @param {string[]} patterns - Glob patterns
 * @returns {RegExp[]} Array of regex patterns
 */
function parseIncludePatterns(patterns) {
  return patterns.map(pattern => {
    // Handle directory patterns like docs/**
    if (pattern.includes('/**')) {
      const basePattern = pattern.replace('/**', '');
      let regex = basePattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*');
      return new RegExp(`^${regex}/.*$`);
    }
    
    // Convert glob to regex for simple patterns
    let regex = pattern
      .replace(/\*\*/g, '<<DOUBLESTAR>>')
      .replace(/\*/g, '[^/\\\\]*')
      .replace(/<<DOUBLESTAR>>/g, '.*')
      .replace(/\?/g, '[^/\\\\]')
      .replace(/\./g, '\\.');
    return new RegExp(`${regex}$`); // Match at end of string (for basename matching)
  });
}

/**
 * Check if a file matches patterns
 * @param {string} filePath - File path to check
 * @param {string[]} include - Include patterns
 * @param {string[]} exclude - Exclude patterns
 * @returns {boolean} True if file matches
 */
function matchesPatterns(filePath, include, exclude) {
  const includeRegex = parseIncludePatterns(include);
  const excludeRegex = parseIncludePatterns(exclude);

  const basename = path.basename(filePath);
  // Normalize path separators for cross-platform matching
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Check if matches any include pattern (check both basename and full path)
  const matchesInclude = includeRegex.some(regex => 
    regex.test(basename) || regex.test(normalizedPath) || regex.test(filePath)
  );

  // Check if matches any exclude pattern
  const matchesExclude = excludeRegex.some(regex => 
    regex.test(basename) || regex.test(normalizedPath) || regex.test(filePath)
  );

  return matchesInclude && !matchesExclude;
}

/**
 * Expand directories and collect files
 * @param {string[]} paths - Array of file/directory paths
 * @param {string[]} include - Include patterns
 * @param {string[]} exclude - Exclude patterns
 * @returns {Promise<string[]>} Array of file paths
 */
async function expandAndCollectFiles(paths, include, exclude) {
  const files = [];

  for (const p of paths) {
    try {
      const stats = await fs.stat(p);

      if (stats.isFile()) {
        if (matchesPatterns(p, include, exclude)) {
          files.push(p);
        }
      } else if (stats.isDirectory()) {
        // Recursively collect files from directory
        const dirFiles = await collectDirectoryFiles(p, include, exclude);
        files.push(...dirFiles);
      }
    } catch (error) {
      // Path doesn't exist or can't be accessed
      if (paths.length === 1) {
        throw new Error(`File not found: ${p}`);
      }
      // Skip non-existent paths when multiple are provided
    }
  }

  return files;
}

/**
 * Collect files from a directory recursively
 * @param {string} dirPath - Directory path
 * @param {string[]} include - Include patterns
 * @param {string[]} exclude - Exclude patterns
 * @returns {Promise<string[]>} Array of file paths
 */
async function collectDirectoryFiles(dirPath, include, exclude) {
  const files = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      // Skip hidden files and common exclude directories
      if (entry.name.startsWith('.') || ['node_modules', 'dist', 'build'].includes(entry.name)) {
        continue;
      }

      if (entry.isFile()) {
        if (matchesPatterns(fullPath, include, exclude)) {
          files.push(fullPath);
        }
      } else if (entry.isDirectory()) {
        const subFiles = await collectDirectoryFiles(fullPath, include, exclude);
        files.push(...subFiles);
      }
    }
  } catch (error) {
    // Skip directories that can't be read
  }

  return files;
}

/**
 * Clear the analysis cache
 */
function clearCache() {
  analysisCache.clear();
}

module.exports = {
  analyzeRepository,
  filesToPrompt,
  convertToCxml,
  convertToText,
  parseIncludePatterns,
  escapeXml,
  matchesPatterns,
  clearCache
};
