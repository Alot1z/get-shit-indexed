/**
 * Prompt Enhancer - Main Entry Point
 * 
 * Provides command interception, cognitive enhancement, and user confirmation
 * for all /gsi: and /gsd: commands.
 * 
 * @module lib/prompt-enhancer
 * @version 1.0.0
 */

const {
  PROMPT_ENHANCER_VERSION,
  shouldIntercept,
  interceptCommand,
  getCommandContext,
  loadExecutionContext
} = require('./interceptor');

const {
  enhancePrompt,
  assembleEnhancedPrompt,
  formatEnhancedPrompt,
  calculateEnhancementScore,
  phase1_IntentAnalysis,
  phase2_EnhancementPlanning,
  phase3_PatternApplication
} = require('./enhancer');

const {
  isYoloMode,
  displayEnhancement,
  promptForConfirmation,
  handleUserChoice,
  editInEditor,
  confirmEnhancement,
  processConfirmationResponse
} = require('./confirmation');

const {
  loadHistory,
  saveHistory,
  recordEnhancement,
  extractPattern,
  queryEnhancementPatterns,
  calculateSimilarity,
  adaptEnhancementThreshold,
  getPatternStatistics,
  HISTORY_FILE
} = require('./learning');

/**
 * Full enhancement pipeline
 * 
 * @param {string} input - User input
 * @param {Object} mcp - MCP tools
 * @param {Object} dc - Desktop Commander instance
 * @returns {Promise<Object>} - Enhancement result
 */
async function runEnhancementPipeline(input, mcp, dc) {
  // Load context
  const execContext = await loadExecutionContext(dc);
  const config = execContext.config || {};
  
  // Check if should intercept
  const interceptResult = shouldIntercept(input, config);
  
  if (!interceptResult.shouldIntercept) {
    return {
      enhanced: false,
      reason: interceptResult.metadata.reason,
      prompt: input
    };
  }
  
  // Parse command
  const commandInfo = interceptCommand(input);
  const commandContext = await getCommandContext(commandInfo.commandName, dc);
  
  // Run enhancement
  const enhancement = await enhancePrompt(input, commandContext, mcp);
  
  // Get confirmation
  const confirmation = await confirmEnhancement(
    enhancement.enhancedPrompt,
    input,
    { config, score: enhancement.score }
  );
  
  return {
    enhanced: enhancement.enhanced,
    prompt: confirmation.prompt,
    score: enhancement.score,
    phases: enhancement.phases,
    confirmation,
    commandContext
  };
}

module.exports = {
  // Version
  PROMPT_ENHANCER_VERSION,
  
  // Interceptor
  shouldIntercept,
  interceptCommand,
  getCommandContext,
  loadExecutionContext,
  
  // Enhancer
  enhancePrompt,
  assembleEnhancedPrompt,
  formatEnhancedPrompt,
  calculateEnhancementScore,
  phase1_IntentAnalysis,
  phase2_EnhancementPlanning,
  phase3_PatternApplication,
  
  // Confirmation
  isYoloMode,
  displayEnhancement,
  promptForConfirmation,
  handleUserChoice,
  editInEditor,
  confirmEnhancement,
  processConfirmationResponse,
  
  // Learning
  loadHistory,
  saveHistory,
  recordEnhancement,
  extractPattern,
  queryEnhancementPatterns,
  calculateSimilarity,
  adaptEnhancementThreshold,
  getPatternStatistics,
  HISTORY_FILE,
  
  // Pipeline
  runEnhancementPipeline
};
