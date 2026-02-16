/**
 * PreToolUse Hook - Prompt Enhancer
 * 
 * Intercepts /gsi: and /gsd: commands before execution and enhances them
 * using the Three-Layer Cognitive Flow.
 * 
 * @module hooks/pre-tool-use/prompt-enhancer
 */

const {
  shouldIntercept,
  interceptCommand,
  enhancePrompt,
  confirmEnhancement,
  PROMPT_ENHANCER_VERSION
} = require('../../lib/prompt-enhancer');

/**
 * Hook configuration
 */
const config = {
  name: 'prompt-enhancer',
  version: PROMPT_ENHANCER_VERSION,
  triggers: ['/gsi:', '/gsd:'],
  priority: 5, // Run before other hooks
  enabled: true
};

/**
 * Check if this hook should run for the given input
 * 
 * @param {string} input - User input
 * @param {Object} context - Execution context
 * @returns {boolean} - True if hook should run
 */
function shouldRun(input, context = {}) {
  // Check if prompt enhancer is disabled
  if (context.config?.prompt_enhancer === false) {
    return false;
  }
  
  // Check for bypass flag
  if (input?.includes('--no-enhance')) {
    return false;
  }
  
  // Check for trigger prefix
  return config.triggers.some(trigger => input?.startsWith(trigger));
}

/**
 * Execute the prompt enhancer hook
 * 
 * @param {string} input - User input
 * @param {Object} context - Execution context with MCP tools
 * @returns {Promise<Object>} - Hook result
 */
async function execute(input, context = {}) {
  const { mcp, dc, config: projectConfig } = context;
  
  // Determine if we should intercept
  const interceptResult = shouldIntercept(input, projectConfig);
  
  if (!interceptResult.shouldIntercept) {
    return {
      action: 'pass',
      input,
      reason: interceptResult.metadata.reason
    };
  }
  
  // Parse command details
  const commandInfo = interceptCommand(input);
  
  // Build MCP tools object
  const mcpTools = {
    tractatus: mcp?.tractatus,
    ci: mcp?.codeIndex,
    sequential: mcp?.sequential,
    cg: mcp?.codeGraph,
    debug: mcp?.debug,
    dc: dc
  };
  
  // Get command context
  let commandContext = { name: commandInfo.commandName, arguments: commandInfo.arguments };
  if (dc) {
    try {
      const { getCommandContext } = require('../../lib/prompt-enhancer/interceptor');
      commandContext = await getCommandContext(commandInfo.commandName, dc);
      commandContext.arguments = commandInfo.arguments;
    } catch (e) {
      // Use basic context if getCommandContext fails
    }
  }
  
  // Run enhancement
  try {
    const enhancement = await enhancePrompt(input, commandContext, mcpTools);
    
    // If enhancement score is too low, pass through
    if (enhancement.score < 3) {
      return {
        action: 'pass',
        input,
        reason: 'Enhancement score below threshold',
        score: enhancement.score
      };
    }
    
    // Get confirmation
    const confirmation = await confirmEnhancement(
      enhancement.enhancedPrompt,
      input,
      { config: projectConfig, score: enhancement.score }
    );
    
    if (confirmation.autoApproved) {
      return {
        action: 'modify',
        originalInput: input,
        input: enhancement.enhancedPrompt,
        score: enhancement.score,
        autoApproved: true,
        phases: enhancement.phases
      };
    }
    
    // Return for user interaction
    return {
      action: 'confirm',
      originalInput: input,
      enhancedInput: enhancement.enhancedPrompt,
      score: enhancement.score,
      display: confirmation.display,
      options: confirmation.options,
      phases: enhancement.phases
    };
    
  } catch (error) {
    // On error, pass through original input
    return {
      action: 'pass',
      input,
      reason: 'Enhancement failed',
      error: error.message
    };
  }
}

/**
 * Handle user's response to confirmation
 * 
 * @param {string} choice - User's choice (A/E/C/S)
 * @param {Object} hookResult - Result from execute()
 * @returns {Object} - Final result
 */
function handleConfirmation(choice, hookResult) {
  const { processConfirmationResponse } = require('../../lib/prompt-enhancer/confirmation');
  
  const result = processConfirmationResponse(
    choice,
    hookResult.enhancedInput,
    hookResult.originalInput
  );
  
  if (result.approved) {
    return {
      action: 'modify',
      originalInput: hookResult.originalInput,
      input: result.prompt,
      edited: result.edited,
      skipped: result.skipped
    };
  }
  
  return {
    action: 'cancel',
    reason: result.message
  };
}

module.exports = {
  config,
  shouldRun,
  execute,
  handleConfirmation
};
