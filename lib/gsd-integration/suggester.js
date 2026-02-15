/**
 * GSD Integration Suggester
 * 
 * Suggests integrations from GSD updates
 */

const { ChangeCategories } = require('./change-analyzer');

/**
 * Suggest integrations from changes
 */
function suggestIntegrations(categorizedChanges, impact) {
  const suggestions = [];
  
  // Process integratable changes
  for (const change of impact.integratable) {
    const suggestion = createSuggestion(change);
    if (suggestion) {
      suggestions.push(suggestion);
    }
  }
  
  // Prioritize by impact and effort
  suggestions.sort((a, b) => {
    // Priority: NEW_FEATURE > BUG_FIX > REFACTOR > DOCUMENTATION
    const categoryOrder = {
      [ChangeCategories.NEW_FEATURE]: 0,
      [ChangeCategories.BUG_FIX]: 1,
      [ChangeCategories.REFACTOR]: 2,
      [ChangeCategories.DOCUMENTATION]: 3
    };
    
    const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category];
    if (categoryDiff !== 0) return categoryDiff;
    
    // Then by effort (LOW first)
    const effortOrder = { LOW: 0, MEDIUM: 1, HIGH: 2 };
    return effortOrder[a.effort] - effortOrder[b.effort];
  });
  
  return suggestions;
}

/**
 * Create individual suggestion
 */
function createSuggestion(change) {
  const { file, type, category, existsInGsi, suggestedAction, reason } = change;
  
  // Estimate effort
  let effort = 'LOW';
  if (suggestedAction === 'MERGE') {
    effort = 'MEDIUM';
  }
  if (category === ChangeCategories.REFACTOR) {
    effort = 'MEDIUM';
  }
  
  // Generate description
  const description = generateDescription(change);
  
  return {
    id: generateChangeId(file, type),
    file,
    type,
    category,
    effort,
    suggestedAction,
    description,
    reason,
    existsInGsi,
    priority: calculatePriority(category, effort)
  };
}

/**
 * Generate human-readable description
 */
function generateDescription(change) {
  const { file, type, category, suggestedAction } = change;
  
  let desc = '';
  
  // Type
  if (type === 'added') {
    desc += `New file: `;
  } else {
    desc += `Modified: `;
  }
  
  // File
  desc += file;
  
  // Category
  const categoryLabels = {
    [ChangeCategories.BUG_FIX]: 'Bug fix',
    [ChangeCategories.NEW_FEATURE]: 'New feature',
    [ChangeCategories.REFACTOR]: 'Refactoring',
    [ChangeCategories.DOCUMENTATION]: 'Documentation',
    [ChangeCategories.GSD_SPECIFIC]: 'GSD-specific'
  };
  desc += ` (${categoryLabels[category]})`;
  
  // Action
  desc += ` - Suggested: ${suggestedAction}`;
  
  return desc;
}

/**
 * Calculate priority score
 */
function calculatePriority(category, effort) {
  // Priority: 1 (high) to 5 (low)
  const categoryScore = {
    [ChangeCategories.NEW_FEATURE]: 1,
    [ChangeCategories.BUG_FIX]: 2,
    [ChangeCategories.DOCUMENTATION]: 3,
    [ChangeCategories.REFACTOR]: 4,
    [ChangeCategories.GSD_SPECIFIC]: 5
  };
  
  const effortScore = { LOW: 0, MEDIUM: 1, HIGH: 2 };
  
  return categoryScore[category] + effortScore[effort];
}

/**
 * Generate unique change ID
 */
function generateChangeId(file, type) {
  const hash = require('crypto')
    .createHash('md5')
    .update(`${type}:${file}`)
    .digest('hex')
    .substring(0, 8);
  return `change-${hash}`;
}

/**
 * Generate integration plan
 */
function generateIntegrationPlan(suggestions) {
  const plan = {
    totalChanges: suggestions.length,
    estimatedEffort: calculateTotalEffort(suggestions),
    steps: [],
    warnings: [],
    dependencies: []
  };
  
  // Group by effort level
  const lowEffort = suggestions.filter(s => s.effort === 'LOW');
  const mediumEffort = suggestions.filter(s => s.effort === 'MEDIUM');
  const highEffort = suggestions.filter(s => s.effort === 'HIGH');
  
  // Generate steps
  if (lowEffort.length > 0) {
    plan.steps.push({
      phase: 'Easy Wins',
      effort: 'LOW',
      changes: lowEffort.map(s => s.id),
      description: `${lowEffort.length} low-effort change(s) - quick integration`
    });
  }
  
  if (mediumEffort.length > 0) {
    plan.steps.push({
      phase: 'Medium Complexity',
      effort: 'MEDIUM',
      changes: mediumEffort.map(s => s.id),
      description: `${mediumEffort.length} medium-effort change(s) - requires review`
    });
  }
  
  if (highEffort.length > 0) {
    plan.steps.push({
      phase: 'Complex Changes',
      effort: 'HIGH',
      changes: highEffort.map(s => s.id),
      description: `${highEffort.length} high-effort change(s) - careful integration needed`
    });
  }
  
  // Generate warnings
  const conflicts = suggestions.filter(s => s.suggestedAction === 'MERGE');
  if (conflicts.length > 0) {
    plan.warnings.push(
      `${conflicts.length} change(s) require manual merge - review carefully`
    );
  }
  
  // Generate dependencies
  const newFeatures = suggestions.filter(s => s.category === ChangeCategories.NEW_FEATURE);
  if (newFeatures.length > 0) {
    plan.dependencies.push(
      `Test new features: ${newFeatures.map(s => s.file).join(', ')}`
    );
  }
  
  return plan;
}

/**
 * Calculate total effort
 */
function calculateTotalEffort(suggestions) {
  const effortScores = { LOW: 1, MEDIUM: 3, HIGH: 5 };
  const total = suggestions.reduce((sum, s) => sum + effortScores[s.effort], 0);
  
  if (total < 5) return 'LOW';
  if (total < 15) return 'MEDIUM';
  return 'HIGH';
}

/**
 * Create merge strategy for change
 */
function createMergeStrategy(change) {
  const { file, type, existsInGsi, suggestedAction } = change;
  
  const strategy = {
    file,
    strategy: suggestedAction,
    steps: []
  };
  
  if (suggestedAction === 'COPY') {
    strategy.steps = [
      `Copy ${file} from GSD package`,
      `Verify no naming conflicts`,
      `Update imports if needed`,
      `Test integration`
    ];
  } else if (suggestedAction === 'MERGE') {
    strategy.steps = [
      `Create diff between GSD and GSI versions`,
      `Review changes line by line`,
      `Resolve conflicts keeping GSI enhancements`,
      `Test merged functionality`,
      `Update documentation if needed`
    ];
  } else if (suggestedAction === 'SKIP') {
    strategy.steps = [
      `Skip ${file} - GSD-specific`,
      `Document reason for skipping`
    ];
  }
  
  return strategy;
}

module.exports = {
  suggestIntegrations,
  generateIntegrationPlan,
  createMergeStrategy
};
