/**
 * Enhancement Templates
 * Different framing strategies for prompt improvement
 */

const TEMPLATE_TYPES = {
  ACADEMIC: 'academic',
  ENGINEERING: 'engineering',
  DECOMPOSED: 'decomposed',
  CLARITY: 'clarity',
  SECURITY: 'security',
  NONE: 'none'
};

const TEMPLATES = {
  [TEMPLATE_TYPES.ACADEMIC]: {
    name: 'Academic',
    description: 'Theoretical research framing',
    transform: (prompt) => {
      return `In a theoretical research context, analyze and explain: ${prompt}

Please provide:
1. Theoretical foundation
2. Key concepts and definitions
3. Relevant literature or precedents
4. Methodology considerations
5. Potential implications`;
    }
  },

  [TEMPLATE_TYPES.ENGINEERING]: {
    name: 'Engineering',
    description: 'Practical implementation framing',
    transform: (prompt) => {
      return `Design a practical, observable solution for: ${prompt}

Consider:
1. Architecture and component design
2. Implementation approach
3. Error handling and edge cases
4. Testing strategy
5. Performance considerations
6. Documentation requirements`;
    }
  },

  [TEMPLATE_TYPES.DECOMPOSED]: {
    name: 'Decomposed',
    description: 'Break down into discrete components',
    transform: (prompt) => {
      return `Break down the following into discrete, manageable components:

Original: ${prompt}

Provide:
1. Component analysis - What are the distinct parts?
2. Implementation steps - In what order should they be done?
3. Dependencies - What must be completed first?
4. Estimation - Relative complexity of each part
5. Verification - How to confirm each part works`;
    }
  },

  [TEMPLATE_TYPES.CLARITY]: {
    name: 'Clarity',
    description: 'Improve specificity and clarity',
    transform: (prompt) => {
      // Add specificity improvements for short prompts
      if (!prompt.includes('?') && !prompt.includes('.') && prompt.length < 50) {
        return `Please provide a detailed explanation of: ${prompt}

Include:
- Clear definition and context
- Specific examples
- Edge cases and limitations
- Best practices`;
      }
      // For longer prompts, add structure
      return `Clarify and structure the following request:

${prompt}

Ensure:
1. Clear objectives are stated
2. Success criteria are defined
3. Constraints are identified
4. Context is complete`;
    }
  },

  [TEMPLATE_TYPES.SECURITY]: {
    name: 'Security',
    description: 'Security-focused analysis',
    transform: (prompt) => {
      return `Analyze from a security perspective: ${prompt}

Consider:
1. Input validation requirements
2. Authentication and authorization
3. Data protection and encryption
4. Potential vulnerabilities
5. Security best practices
6. Audit and logging needs`;
    }
  },

  [TEMPLATE_TYPES.NONE]: {
    name: 'None',
    description: 'No transformation',
    transform: (prompt) => prompt
  }
};

/**
 * Get template by type
 * @param {string} type - Template type
 * @returns {object} Template object
 */
function getTemplate(type) {
  return TEMPLATES[type] || TEMPLATES[TEMPLATE_TYPES.NONE];
}

/**
 * Get all available template types
 * @returns {string[]} Array of template types
 */
function getTemplateTypes() {
  return Object.values(TEMPLATE_TYPES);
}

/**
 * Get all templates
 * @returns {object} All templates
 */
function getAllTemplates() {
  return { ...TEMPLATES };
}

/**
 * Check if template type is valid
 * @param {string} type - Template type to check
 * @returns {boolean} True if valid
 */
function isValidTemplateType(type) {
  return Object.values(TEMPLATE_TYPES).includes(type);
}

module.exports = {
  TEMPLATES,
  TEMPLATE_TYPES,
  getTemplate,
  getTemplateTypes,
  getAllTemplates,
  isValidTemplateType
};
