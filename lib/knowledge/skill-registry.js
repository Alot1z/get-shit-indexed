/**
 * @fileoverview Skill registry module
 * Provides skill registration and discovery
 * Part of Phase 50C: Knowledge System Integration
 */

/**
 * Create a skill registry
 * @param {object} options - Registry options
 * @returns {object} Registry instance
 */
function createSkillRegistry(options = {}) {
  const { initialSkills = [] } = options;
  const skills = new Map();

  // Register initial skills
  for (const skill of initialSkills) {
    _registerSkill(skills, skill);
  }

  return {
    /**
     * Register a skill
     * @param {object} skill - Skill to register
     */
    register(skill) {
      _registerSkill(skills, skill);
    },

    /**
     * Get a skill by name
     * @param {string} name - Skill name
     * @returns {object|undefined} Skill definition
     */
    get(name) {
      return skills.get(name);
    },

    /**
     * List skills with optional filtering
     * @param {object} options - Filter options
     * @returns {Array} Matching skills
     */
    list(options = {}) {
      const { category, sort } = options;
      let result = Array.from(skills.values());

      if (category) {
        result = result.filter(s => s.category === category);
      }

      if (sort === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }

      return result;
    },

    /**
     * Get registry size
     * @returns {number} Number of skills
     */
    size() {
      return skills.size;
    }
  };
}

/**
 * Register a skill in a skills map
 * @param {Map} skills - Skills map
 * @param {object} skill - Skill to register
 * @private
 */
function _registerSkill(skills, skill) {
  // Validate skill
  const validation = _validateSkill(skill);
  if (!validation.valid) {
    throw new Error(validation.errors[0]);
  }

  // Check for duplicate
  if (skills.has(skill.name)) {
    throw new Error(`Skill already exists: ${skill.name}`);
  }

  skills.set(skill.name, {
    ...skill,
    registered: Date.now()
  });
}

/**
 * Validate a skill definition
 * @param {object} skill - Skill to validate
 * @returns {object} Validation result
 * @private
 */
function _validateSkill(skill) {
  const errors = [];
  const warnings = [];

  if (!skill.name) {
    errors.push('Skill must have a name');
  }

  if (!skill.execute || typeof skill.execute !== 'function') {
    errors.push('Skill must have an execute function');
  }

  if (!skill.description) {
    warnings.push('Skill should have a description');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Register skill in global registry (alias for compatibility)
 * @param {object} skill - Skill to register
 */
function registerSkill(skill) {
  const validation = _validateSkill(skill);
  if (!validation.valid) {
    throw new Error(validation.errors[0]);
  }
  // Note: Global registry is managed by skill-compose module
}

/**
 * Get skill from registry
 * @param {object} registry - Registry instance
 * @param {string} name - Skill name
 * @returns {object|undefined} Skill
 */
function getSkill(registry, name) {
  return registry.get(name);
}

/**
 * List skills from registry
 * @param {object} registry - Registry instance
 * @param {object} options - Filter options
 * @returns {Array} Skills list
 */
function listSkills(registry, options = {}) {
  return registry.list(options);
}

/**
 * Search skills by name, description, or tags
 * @param {object} registry - Registry instance
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Array} Matching skills
 */
function searchSkills(registry, query, options = {}) {
  const { searchTags = true } = options;
  const lowerQuery = query.toLowerCase();
  const allSkills = registry.list();

  return allSkills.filter(skill => {
    // Search in name
    if (skill.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in description
    if (skill.description && skill.description.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in tags
    if (searchTags && skill.tags) {
      return skill.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    }

    return false;
  });
}

/**
 * Get skill metadata
 * @param {object} registry - Registry instance
 * @param {string} name - Skill name
 * @returns {object|null} Skill metadata
 */
function getSkillMetadata(registry, name) {
  const skill = registry.get(name);
  if (!skill) return null;

  return {
    name: skill.name,
    description: skill.description,
    category: skill.category,
    tags: skill.tags,
    version: skill.metadata?.version,
    author: skill.metadata?.author,
    registered: skill.registered
  };
}

/**
 * Validate skill definition (public API)
 * @param {object} skill - Skill to validate
 * @returns {object} Validation result
 */
function validateSkill(skill) {
  return _validateSkill(skill);
}

module.exports = {
  createSkillRegistry,
  registerSkill,
  getSkill,
  listSkills,
  searchSkills,
  getSkillMetadata,
  validateSkill
};
