/**
 * Command Context Injector
 * 
 * Injects thinking results into command execution context.
 * Extracts thinking context from results for post-command reflection.
 */

/**
 * Inject thinking context into command arguments
 * @param {Array} args - Original command arguments
 * @param {object} thinkingResult - Thinking result from orchestrator
 * @returns {Array} Enhanced arguments with thinking context
 */
function injectThinkingContext(args, thinkingResult) {
  // If args is empty, return context as first argument
  if (!args || args.length === 0) {
    return [{ _thinking: thinkingResult }];
  }
  
  // If first arg is an object (context), add thinking to it
  if (typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
    return [{
      ...args[0],
      _thinking: thinkingResult
    }, ...args.slice(1)];
  }
  
  // Otherwise, prepend thinking as new first argument
  return [{ _thinking: thinkingResult }, ...args];
}

/**
 * Extract thinking context from result
 * @param {object} result - Command execution result
 * @returns {object} Extracted thinking context
 */
function extractThinkingContext(result) {
  // If result has _thinking property
  if (result && result._thinking) {
    return result._thinking;
  }
  
  // If result is wrapped with thinking property
  if (result && result.thinking) {
    return result.thinking;
  }
  
  // Return empty context if no thinking found
  return {
    pre: null,
    post: null
  };
}

/**
 * Validate thinking context
 * @param {object} context - Context to validate
 * @returns {object} Validation result with isValid flag and errors
 */
function validateThinkingContext(context) {
  const errors = [];
  
  if (!context) {
    return {
      isValid: false,
      errors: ['Context is null or undefined']
    };
  }
  
  // Check pre-thinking
  if (context.pre === undefined) {
    errors.push('Missing pre-thinking context');
  }
  
  // Check post-thinking
  if (context.post === undefined) {
    errors.push('Missing post-thinking context');
  }
  
  // Check for cached results
  if (context.pre && context.pre.cached === true) {
    // Cached results are valid but should be noted
  }
  
  // Check for errors
  if (context.pre && context.pre.error) {
    errors.push(`Pre-thinking error: ${context.pre.error}`);
  }
  
  if (context.post && context.post.error) {
    errors.push(`Post-thinking error: ${context.post.error}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Merge thinking contexts (useful for nested commands)
 * @param {object} baseContext - Base context
 * @param {object} additionalContext - Context to merge in
 * @returns {object} Merged context
 */
function mergeThinkingContexts(baseContext, additionalContext) {
  if (!baseContext) return additionalContext;
  if (!additionalContext) return baseContext;
  
  return {
    pre: additionalContext.pre || baseContext.pre,
    post: additionalContext.post || baseContext.post,
    merged: true
  };
}

/**
 * Format thinking context for display
 * @param {object} context - Thinking context
 * @returns {string} Formatted string representation
 */
function formatThinkingContext(context) {
  if (!context) {
    return 'No thinking context';
  }
  
  const parts = [];
  
  if (context.pre) {
    if (context.pre.cached) {
      parts.push('Pre: [CACHED]');
    } else if (context.pre.server) {
      parts.push(`Pre: ${context.pre.server}`);
    } else if (context.pre.skipped) {
      parts.push(`Pre: [SKIPPED] ${context.pre.reason}`);
    } else if (context.pre.error) {
      parts.push(`Pre: [ERROR] ${context.pre.error}`);
    }
  }
  
  if (context.post) {
    if (context.post.reflection) {
      parts.push('Post: [REFLECTION]');
    } else if (context.post.error) {
      parts.push(`Post: [ERROR] ${context.post.error}`);
    }
  }
  
  return parts.join(' | ') || 'Empty context';
}

/**
 * Extract insights from thinking context
 * @param {object} context - Thinking context
 * @returns {Array} Array of insight strings
 */
function extractInsights(context) {
  const insights = [];
  
  if (!context) return insights;
  
  // Extract from pre-thinking
  if (context.pre && context.parsed) {
    if (context.pre.parsed.summary) {
      insights.push(`Pre: ${context.pre.parsed.summary}`);
    }
    if (context.pre.parsed.recommendations) {
      insights.push(...context.pre.parsed.recommendations.map(r => `Pre: ${r}`));
    }
  }
  
  // Extract from post-thinking
  if (context.post && context.post.reflection) {
    if (context.post.reflection.summary) {
      insights.push(`Post: ${context.post.reflection.summary}`);
    }
    if (context.post.learning) {
      insights.push(...context.post.learning.map(l => `Learned: ${l}`));
    }
  }
  
  return insights;
}

/**
 * Check if thinking context has warnings
 * @param {object} context - Thinking context
 * @returns {Array} Array of warning strings
 */
function extractWarnings(context) {
  const warnings = [];
  
  if (!context) return warnings;
  
  // Check pre-thinking for warnings
  if (context.pre && context.pre.parsed && context.pre.parsed.concerns) {
    warnings.push(...context.pre.parsed.concerns.map(c => `Pre: ${c}`));
  }
  
  // Check post-thinking for warnings
  if (context.post && context.post.reflection && context.post.reflection.concerns) {
    warnings.push(...context.post.reflection.concerns.map(c => `Post: ${c}`));
  }
  
  return warnings;
}

module.exports = {
  injectThinkingContext,
  extractThinkingContext,
  validateThinkingContext,
  mergeThinkingContexts,
  formatThinkingContext,
  extractInsights,
  extractWarnings
};
