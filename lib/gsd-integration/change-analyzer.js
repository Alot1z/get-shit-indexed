/**
 * GSD Change Analyzer
 * 
 * Analyzes differences between GSD versions
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Change categories
 */
const ChangeCategories = {
  BUG_FIX: 'BUG_FIX',
  NEW_FEATURE: 'NEW_FEATURE',
  REFACTOR: 'REFACTOR',
  DOCUMENTATION: 'DOCUMENTATION',
  GSD_SPECIFIC: 'GSD_SPECIFIC'  // Skip integration
};

/**
 * Analyze changes between two versions
 */
async function analyzeChanges(oldDir, newDir) {
  try {
    const oldFiles = await getFileList(oldDir);
    const newFiles = await getFileList(newDir);
    
    const oldSet = new Set(oldFiles);
    const newSet = new Set(newFiles);
    
    // Identify changes
    const added = [...newSet].filter(f => !oldSet.has(f));
    const removed = [...oldSet].filter(f => !newSet.has(f));
    const modified = [];
    
    // Check for modifications in common files
    for (const file of [...newSet].filter(f => oldSet.has(f))) {
      const oldPath = path.join(oldDir, file);
      const newPath = path.join(newDir, file);
      
      try {
        const oldContent = await fs.readFile(oldPath, 'utf-8');
        const newContent = await fs.readFile(newPath, 'utf-8');
        
        if (oldContent !== newContent) {
          modified.push(file);
        }
      } catch (error) {
        // Skip files that can't be read as text
      }
    }
    
    return {
      added,
      removed,
      modified,
      total: added.length + removed.length + modified.length
    };
  } catch (error) {
    throw new Error(`Failed to analyze changes: ${error.message}`);
  }
}

/**
 * Get recursive file list
 */
async function getFileList(dir, baseDir = dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      // Skip node_modules and common non-source dirs
      if (['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        const subFiles = await getFileList(fullPath, baseDir);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        files.push(relativePath);
      }
    }
    
    return files;
  } catch (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }
}

/**
 * Categorize changes by type
 */
function categorizeChanges(changes) {
  const categorized = {
    [ChangeCategories.BUG_FIX]: [],
    [ChangeCategories.NEW_FEATURE]: [],
    [ChangeCategories.REFACTOR]: [],
    [ChangeCategories.DOCUMENTATION]: [],
    [ChangeCategories.GSD_SPECIFIC]: []
  };
  
  // Process each change
  for (const file of [...changes.added, ...changes.modified]) {
    const category = categorizeFile(file);
    categorized[category].push({
      file,
      type: changes.added.includes(file) ? 'added' : 'modified'
    });
  }
  
  return categorized;
}

/**
 * Categorize individual file
 */
function categorizeFile(filePath) {
  const lowerPath = filePath.toLowerCase();
  
  // GSD-specific files (skip integration)
  if (lowerPath.includes('get-shit-done') || 
      lowerPath.includes('gsd-') ||
      lowerPath.includes('logo') ||
      lowerPath.includes('branding')) {
    return ChangeCategories.GSD_SPECIFIC;
  }
  
  // Documentation
  if (lowerPath.endsWith('.md') || 
      lowerPath.includes('doc') ||
      lowerPath.includes('readme')) {
    return ChangeCategories.DOCUMENTATION;
  }
  
  // Test files
  if (lowerPath.includes('test') || lowerPath.includes('.spec.')) {
    return ChangeCategories.BUG_FIX;
  }
  
  // Source files - heuristics based on path
  if (lowerPath.includes('lib') || lowerPath.includes('src')) {
    // New feature likely if added to core
    if (filePath.includes('commands') || filePath.includes('agents')) {
      return ChangeCategories.NEW_FEATURE;
    }
    return ChangeCategories.REFACTOR;
  }
  
  // Default to refactor
  return ChangeCategories.REFACTOR;
}

/**
 * Assess integration impact
 */
async function assessChanges(changes, gsiProjectDir) {
  const categorized = categorizeChanges(changes);
  const impact = {
    effort: 'LOW',
    conflicts: [],
    recommendations: [],
    skippable: [],
    integratable: []
  };
  
  // Assess each category
  for (const [category, items] of Object.entries(categorized)) {
    if (items.length === 0) continue;
    
    for (const item of items) {
      const assessment = await assessFileChange(item.file, item.type, category, gsiProjectDir);
      
      if (category === ChangeCategories.GSD_SPECIFIC) {
        impact.skippable.push({ ...item, reason: assessment.reason });
      } else {
        impact.integratable.push({
          ...item,
          category,
          ...assessment
        });
      }
      
      if (assessment.conflict) {
        impact.conflicts.push({
          file: item.file,
          conflict: assessment.conflict
        });
      }
    }
  }
  
  // Calculate overall effort
  const integratableCount = impact.integratable.length;
  const conflictCount = impact.conflicts.length;
  
  if (integratableCount === 0) {
    impact.effort = 'NONE';
  } else if (conflictCount > 3) {
    impact.effort = 'HIGH';
  } else if (integratableCount > 10 || conflictCount > 0) {
    impact.effort = 'MEDIUM';
  }
  
  // Generate recommendations
  if (impact.skippable.length > 0) {
    impact.recommendations.push(
      `Skip ${impact.skippable.length} GSD-specific file(s) - not relevant to GSI`
    );
  }
  
  if (impact.conflicts.length > 0) {
    impact.recommendations.push(
      `Review ${impact.conflicts.length} potential conflict(s) carefully`
    );
  }
  
  if (impact.integratable.length > 0) {
    impact.recommendations.push(
      `${impact.integratable.length} change(s) can be integrated from GSD`
    );
  }
  
  return impact;
}

/**
 * Assess individual file change
 */
async function assessFileChange(filePath, type, category, gsiProjectDir) {
  const gsiPath = path.join(gsiProjectDir, filePath);
  
  // Check if file exists in GSI
  let existsInGsi = false;
  try {
    await fs.access(gsiPath);
    existsInGsi = true;
  } catch {
    // File doesn't exist
  }
  
  const assessment = {
    existsInGsi,
    conflict: null,
    reason: null,
    suggestedAction: null
  };
  
  // Determine suggested action
  if (!existsInGsi) {
    assessment.suggestedAction = 'COPY';
    assessment.reason = 'New file in GSD, can copy directly';
  } else {
    assessment.suggestedAction = 'MERGE';
    assessment.reason = 'File exists in both, requires merge';
    assessment.conflict = 'Manual merge required';
  }
  
  // Category-specific adjustments
  if (category === ChangeCategories.GSD_SPECIFIC) {
    assessment.reason = 'GSD branding/features, not relevant to GSI';
    assessment.suggestedAction = 'SKIP';
  }
  
  return assessment;
}

module.exports = {
  ChangeCategories,
  analyzeChanges,
  categorizeChanges,
  assessChanges
};
