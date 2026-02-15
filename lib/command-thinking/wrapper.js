/**
 * Command Thinking Wrapper
 * 
 * Provides a wrapper function that adds thinking to any command execution.
 * Supports pre-command thinking, command execution with context injection,
 * and post-command reflection.
 */

const { thinkBeforeTool, thinkAfterTool } = require('../thinking/orchestrator');
const { injectThinkingContext, extractThinkingContext } = require('./context-injector');
const { recordCommandThinking } = require('./metrics');
const { getModeForCommand } = require('./modes');

/**
 * Wrap a command function with thinking enhancement
 * @param {Function} commandFn - Command function to wrap
 * @param {object} options - Wrapper options
 * @returns {Function} Wrapped command function
 */
function withThinking(commandFn, options = {}) {
  return async function wrappedCommand(...args) {
    const startTime = Date.now();
    const commandName = commandFn.name || 'anonymous-command';
    
    // Get thinking mode for this command
    const mode = options.mode || getModeForCommand(commandName);
    
    // Skip thinking if mode is NONE or explicitly disabled
    if (mode === 'NONE' || options.skipThinking) {
      return await commandFn.apply(this, args);
    }
    
    try {
      // Phase 1: Pre-command thinking
      const preThinking = await thinkBeforeTool(commandName, {
        commandArgs: args,
        mode,
        ...options.context
      });
      
      // Phase 2: Inject thinking into command context
      const enhancedArgs = injectThinkingContext(args, preThinking);
      
      // Phase 3: Execute command with enhanced context
      const result = await commandFn.apply(this, enhancedArgs);
      
      // Phase 4: Post-command reflection
      const postThinking = await thinkAfterTool(commandName, {
        commandArgs: args,
        mode,
        result,
        ...options.context
      });
      
      // Phase 5: Record metrics
      const duration = Date.now() - startTime;
      recordCommandThinking(commandName, {
        mode,
        duration,
        preThinking: preThinking.beforeThinking,
        postThinking: postThinking.afterThinking,
        success: true
      });
      
      // Return combined result
      return {
        result,
        thinking: {
          pre: preThinking.beforeThinking,
          post: postThinking.afterThinking
        }
      };
      
    } catch (error) {
      // Record error metrics
      const duration = Date.now() - startTime;
      recordCommandThinking(commandName, {
        mode,
        duration,
        error: error.message,
        success: false
      });
      
      // Re-throw error for caller to handle
      throw error;
    }
  };
}

/**
 * Create a wrapped command with options
 * @param {Function} commandFn - Command function to wrap
 * @param {object} defaultOptions - Default options for this command
 * @returns {Function} Wrapped command function with default options
 */
function createWrappedCommand(commandFn, defaultOptions = {}) {
  const wrapped = withThinking(commandFn, defaultOptions);
  wrapped.commandName = commandFn.name || 'anonymous-command';
  wrapped.defaultOptions = defaultOptions;
  return wrapped;
}

/**
 * Check if a command is already wrapped (prevent double-wrapping)
 * @param {Function} commandFn - Command function to check
 * @returns {boolean} True if command is already wrapped
 */
function isWrapped(commandFn) {
  return commandFn.__isWrapped === true || commandFn.commandName !== undefined;
}

module.exports = {
  withThinking,
  createWrappedCommand,
  isWrapped
};
