/**
 * Prompt Enhancer - Command Interceptor
 * 
 * Intercepts /gsi: and /gsd: commands before execution and routes them
 * through the enhancement pipeline.
 * 
 * @module lib/prompt-enhancer/interceptor
 */

const PROMPT_ENHANCER_VERSION = '1.0.0';

/**
 * Check if a command should be intercepted for enhancement
 * 
 * @param {string} input - The user input to check
 * @param {Object} config - Configuration object from .planning/config.json
 * @returns {Object} - { shouldIntercept: boolean, metadata: Object }
 */
function shouldIntercept(input, config = {}) {
  const trimmedInput = (input || '').trim();
  
  // Check for bypass flag
  if (trimmedInput.includes('--no-enhance')) {
    return {
      shouldIntercept: false,
      metadata: { reason: 'bypass_flag', bypassType: 'flag' }
    };
  }
  
  // Check config setting
  if (config.prompt_enhancer === false) {
    return {
      shouldIntercept: false,
      metadata: { reason: 'config_disabled', bypassType: 'config' }
    };
  }
  
  // Check for GSI or GSD command prefix
  const gsiMatch = trimmedInput.match(/^\/(gsi|gsd):(\S*)(.*)$/);
  if (!gsiMatch) {
    return {
      shouldIntercept: false,
      metadata: { reason: 'not_gsi_command' }
    };
  }
  
  const [, prefix, command, args] = gsiMatch;
  
  return {
    shouldIntercept: true,
    metadata: {
      prefix,
      command,
      args: args.trim(),
      originalInput: trimmedInput
    }
  };
}

/**
 * Extract command details from intercepted input
 * 
 * @param {string} input - The user input to parse
 * @returns {Object} - { commandName, arguments, raw }
 */
function interceptCommand(input) {
  const trimmedInput = (input || '').trim();
  const match = trimmedInput.match(/^\/(gsi|gsd):(\S*)(.*)$/);
  
  if (!match) {
    return {
      commandName: null,
      arguments: null,
      raw: trimmedInput
    };
  }
  
  const [, prefix, command, args] = match;
  
  return {
    commandName: command,
    arguments: args.trim(),
    prefix,
    raw: trimmedInput
  };
}

/**
 * Get command context from command definition file
 * 
 * @param {string} commandName - The command name (e.g., 'plan-phase')
 * @param {Object} dc - Desktop Commander MCP instance for file operations
 * @returns {Promise<Object>} - Command context object
 */
async function getCommandContext(commandName, dc) {
  const context = {
    name: commandName,
    description: null,
    allowedTools: [],
    argumentHint: null,
    found: false
  };
  
  if (!commandName) {
    return context;
  }
  
  // Try to read command definition from commands/gsi/{command}.md
  const commandPath = `commands/gsi/${commandName}.md`;
  
  try {
    const content = await dc.read_file({ path: commandPath });
    
    if (content) {
      context.found = true;
      
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        
        // Parse description
        const descMatch = frontmatter.match(/description:\s*["']?(.+?)["']?\n/);
        if (descMatch) {
          context.description = descMatch[1].replace(/["']/g, '');
        }
        
        // Parse allowed-tools
        const toolsMatch = frontmatter.match(/allowed-tools:\s*\n((?:\s+-\s+.+\n?)+)/);
        if (toolsMatch) {
          context.allowedTools = toolsMatch[1]
            .split('\n')
            .map(line => line.match(/-\s+(.+)/)?.[1])
            .filter(Boolean);
        }
        
        // Parse argument-hint
        const hintMatch = frontmatter.match(/argument-hint:\s*["']?(.+?)["']?\n/);
        if (hintMatch) {
          context.argumentHint = hintMatch[1].replace(/["']/g, '');
        }
      }
    }
  } catch (error) {
    // Command file not found or error reading - return default context
    context.error = error.message;
  }
  
  return context;
}

/**
 * Load execution context for enhancement decisions
 * 
 * @param {Object} dc - Desktop Commander MCP instance
 * @returns {Promise<Object>} - Execution context including STATE and ROADMAP
 */
async function loadExecutionContext(dc) {
  const context = {
    state: null,
    roadmap: null,
    config: null
  };
  
  try {
    const stateContent = await dc.read_file({ path: '.planning/STATE.md' });
    if (stateContent) {
      // Extract current position
      const phaseMatch = stateContent.match(/Phase:\s*(\d+)/);
      const planMatch = stateContent.match(/Plan:\s*(\d+)/);
      
      context.state = {
        currentPhase: phaseMatch ? parseInt(phaseMatch[1]) : null,
        currentPlan: planMatch ? parseInt(planMatch[1]) : null,
        raw: stateContent
      };
    }
  } catch (error) {
    context.stateError = error.message;
  }
  
  try {
    const roadmapContent = await dc.read_file({ path: '.planning/ROADMAP.md' });
    if (roadmapContent) {
      context.roadmap = { raw: roadmapContent };
    }
  } catch (error) {
    context.roadmapError = error.message;
  }
  
  try {
    const configContent = await dc.read_file({ path: '.planning/config.json' });
    if (configContent) {
      context.config = JSON.parse(configContent);
    }
  } catch (error) {
    context.configError = error.message;
  }
  
  return context;
}

module.exports = {
  PROMPT_ENHANCER_VERSION,
  shouldIntercept,
  interceptCommand,
  getCommandContext,
  loadExecutionContext
};
