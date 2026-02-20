/**
 * Agent Thinking Integration
 * 
 * Provides thinking phase integration for GSI agents.
 * Includes PRE_AGENT, PRE_TOOL, POST_TOOL, and POST_AGENT phases.
 */

const { thinkBeforeTool, thinkAfterTool } = require('../thinking/orchestrator');
const { callTractatus, callSequential, callDebug } = require('../thinking/mcp-connector');

// Agent thinking phases
const AGENT_PHASES = {
  PRE_AGENT: {
    name: 'pre-agent',
    description: 'Before agent execution',
    server: 'tractatus',
    purpose: 'Task structure analysis and planning'
  },
  PRE_TOOL: {
    name: 'pre-tool',
    description: 'Before each tool call',
    server: 'auto',
    purpose: 'Mode-based tool selection'
  },
  POST_TOOL: {
    name: 'post-tool',
    description: 'After tool call',
    server: 'debug',
    purpose: 'Learning from tool results'
  },
  POST_AGENT: {
    name: 'post-agent',
    description: 'After agent completion',
    server: 'debug',
    purpose: 'Reflection capture and learning'
  }
};

// Agent-specific thinking modes
const AGENT_THINKING_MODES = {
  'gsi-executor': {
    preAgent: 'comprehensive',
    preTool: 'standard',
    postTool: 'lightweight',
    postAgent: 'standard'
  },
  'gsi-planner': {
    preAgent: 'comprehensive',
    preTool: 'lightweight',
    postTool: 'lightweight',
    postAgent: 'comprehensive'
  },
  'gsi-researcher': {
    preAgent: 'standard',
    preTool: 'lightweight',
    postTool: 'lightweight',
    postAgent: 'standard'
  },
  'gsi-validator': {
    preAgent: 'comprehensive',
    preTool: 'standard',
    postTool: 'standard',
    postAgent: 'comprehensive'
  },
  'gsi-debugger': {
    preAgent: 'standard',
    preTool: 'standard',
    postTool: 'comprehensive',
    postAgent: 'comprehensive'
  }
};

// Default mode for unknown agents
const DEFAULT_AGENT_MODE = {
  preAgent: 'standard',
  preTool: 'lightweight',
  postTool: 'lightweight',
  postAgent: 'standard'
};

class AgentThinking {
  constructor(config = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      timeout: config.timeout || 5000,
      captureReflections: config.captureReflections ?? true,
      ...config
    };
    
    this.sessions = new Map();
    this.metrics = {
      agentsEnhanced: 0,
      phasesExecuted: 0,
      byAgent: {},
      byPhase: {}
    };
  }
  
  /**
   * Create thinking wrapper for agent
   * @param {string} agentName - Agent name
   * @param {Function} agentFn - Agent function to wrap
   * @param {object} options - Wrapper options
   * @returns {Function} Wrapped agent function
   */
  wrapAgent(agentName, agentFn, options = {}) {
    const self = this;
    
    return async function wrappedAgent(...args) {
      if (!self.config.enabled) {
        return await agentFn.apply(this, args);
      }
      
      const sessionId = `${agentName}-${Date.now()}`;
      const mode = AGENT_THINKING_MODES[agentName] || DEFAULT_AGENT_MODE;
      
      // Initialize session
      self.sessions.set(sessionId, {
        agentName,
        startTime: Date.now(),
        phases: {},
        metrics: {}
      });
      
      self.metrics.agentsEnhanced++;
      self.metrics.byAgent[agentName] = (self.metrics.byAgent[agentName] || 0) + 1;
      
      try {
        // PRE_AGENT phase
        const preAgentContext = await self._executePhase(
          sessionId,
          'PRE_AGENT',
          agentName,
          { args, mode: mode.preAgent },
          options
        );
        
        // Inject thinking context into agent args
        const enhancedArgs = self._injectContext(args, preAgentContext);
        
        // Create tool wrapper for PRE_TOOL/POST_TOOL
        const toolWrapper = self._createToolWrapper(sessionId, agentName, mode);
        
        // Execute agent with enhanced context
        const agentContext = {
          ...enhancedArgs[0],
          _thinking: {
            sessionId,
            preAgent: preAgentContext,
            wrapTool: toolWrapper
          }
        };
        
        const result = await agentFn.call(this, agentContext, ...enhancedArgs.slice(1));
        
        // POST_AGENT phase
        const postAgentContext = await self._executePhase(
          sessionId,
          'POST_AGENT',
          agentName,
          { result, mode: mode.postAgent },
          options
        );
        
        // Finalize session
        const session = self.sessions.get(sessionId);
        session.endTime = Date.now();
        session.duration = session.endTime - session.startTime;
        session.result = result;
        session.postAgent = postAgentContext;
        
        return {
          result,
          thinking: {
            sessionId,
            preAgent: preAgentContext,
            postAgent: postAgentContext,
            duration: session.duration
          }
        };
        
      } catch (error) {
        // Record error in session
        const session = self.sessions.get(sessionId);
        if (session) {
          session.error = error.message;
          session.endTime = Date.now();
        }
        
        throw error;
      }
    };
  }
  
  /**
   * Execute a thinking phase
   * @private
   */
  async _executePhase(sessionId, phaseName, agentName, context, options) {
    const phase = AGENT_PHASES[phaseName];
    const startTime = Date.now();
    
    this.metrics.phasesExecuted++;
    this.metrics.byPhase[phaseName] = (this.metrics.byPhase[phaseName] || 0) + 1;
    
    try {
      let result;
      
      switch (phaseName) {
        case 'PRE_AGENT':
          result = await this._preAgent(agentName, context, phase);
          break;
        case 'POST_AGENT':
          result = await this._postAgent(agentName, context, phase);
          break;
        default:
          result = { executed: false, reason: 'Unknown phase' };
      }
      
      // Store in session
      const session = this.sessions.get(sessionId);
      if (session) {
        session.phases[phaseName] = {
          executed: true,
          duration: Date.now() - startTime,
          result
        };
      }
      
      return result;
      
    } catch (error) {
      return {
        executed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }
  
  /**
   * Pre-agent thinking
   * @private
   */
  async _preAgent(agentName, context, phase) {
    const { args, mode } = context;
    const taskDescription = this._extractTaskDescription(args);
    
    const prompt = `Analyze this agent task for ${agentName}:

Task: ${taskDescription}

Provide:
1. Task structure analysis
2. Key components to handle
3. Potential challenges
4. Recommended approach`;

    const result = await callTractatus(prompt, {
      timeout: this.config.timeout
    });
    
    return {
      phase: phase.name,
      taskDescription,
      analysis: result.result,
      mode,
      success: result.success
    };
  }
  
  /**
   * Post-agent reflection
   * @private
   */
  async _postAgent(agentName, context, phase) {
    const { result, mode } = context;
    
    if (!this.config.captureReflections) {
      return { phase: phase.name, captured: false };
    }
    
    const resultSummary = typeof result === 'string' 
      ? result.substring(0, 500) 
      : JSON.stringify(result).substring(0, 500);
    
    const prompt = `Reflect on agent execution:

Agent: ${agentName}
Result Summary: ${resultSummary}

What was learned? What patterns were observed?`;

    const reflection = await callDebug(prompt, {
      timeout: this.config.timeout,
      action: 'create'
    });
    
    return {
      phase: phase.name,
      reflection: reflection.result,
      mode,
      success: reflection.success
    };
  }
  
  /**
   * Create tool wrapper for PRE_TOOL/POST_TOOL
   * @private
   */
  _createToolWrapper(sessionId, agentName, mode) {
    const self = this;
    
    return async function(toolName, toolFn, ...args) {
      // PRE_TOOL
      const preToolContext = await self._preTool(sessionId, agentName, toolName, args, mode.preTool);
      
      try {
        // Execute tool
        const result = await toolFn(...args);
        
        // POST_TOOL
        const postToolContext = await self._postTool(sessionId, agentName, toolName, result, mode.postTool);
        
        return {
          result,
          thinking: {
            preTool: preToolContext,
            postTool: postToolContext
          }
        };
      } catch (error) {
        // POST_TOOL for error
        await self._postTool(sessionId, agentName, toolName, { error: error.message }, mode.postTool);
        throw error;
      }
    };
  }
  
  /**
   * Pre-tool thinking
   * @private
   */
  async _preTool(sessionId, agentName, toolName, args, mode) {
    this.metrics.phasesExecuted++;
    this.metrics.byPhase['PRE_TOOL'] = (this.metrics.byPhase['PRE_TOOL'] || 0) + 1;
    
    // Use thinkBeforeTool from orchestrator
    const context = { agentName, args, mode };
    const thinking = await thinkBeforeTool(toolName, context);
    
    return {
      toolName,
      mode,
      thinking: thinking.beforeThinking
    };
  }
  
  /**
   * Post-tool thinking
   * @private
   */
  async _postTool(sessionId, agentName, toolName, result, mode) {
    this.metrics.phasesExecuted++;
    this.metrics.byPhase['POST_TOOL'] = (this.metrics.byPhase['POST_TOOL'] || 0) + 1;
    
    // Use thinkAfterTool from orchestrator
    const context = { agentName, mode };
    const thinking = await thinkAfterTool(toolName, context, result);
    
    return {
      toolName,
      mode,
      reflection: thinking.afterThinking
    };
  }
  
  /**
   * Extract task description from args
   * @private
   */
  _extractTaskDescription(args) {
    if (!args || args.length === 0) return 'No task description';
    
    const firstArg = args[0];
    
    if (typeof firstArg === 'string') {
      return firstArg.substring(0, 500);
    }
    
    if (firstArg.task) {
      return firstArg.task.substring(0, 500);
    }
    
    if (firstArg.prompt) {
      return firstArg.prompt.substring(0, 500);
    }
    
    return JSON.stringify(firstArg).substring(0, 500);
  }
  
  /**
   * Inject thinking context into args
   * @private
   */
  _injectContext(args, preAgentContext) {
    if (!args || args.length === 0) {
      return [{ _thinking: { preAgent: preAgentContext } }];
    }
    
    const enhancedArgs = [...args];
    if (typeof enhancedArgs[0] === 'object') {
      enhancedArgs[0] = {
        ...enhancedArgs[0],
        _thinking: { preAgent: preAgentContext }
      };
    }
    
    return enhancedArgs;
  }
  
  /**
   * Get session by ID
   * @param {string} sessionId - Session ID
   * @returns {object|null} Session data
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }
  
  /**
   * Get metrics
   * @returns {object} Metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      activeSessions: this.sessions.size
    };
  }
  
  /**
   * Clear sessions
   */
  clearSessions() {
    this.sessions.clear();
  }
}

module.exports = { 
  AgentThinking, 
  AGENT_PHASES, 
  AGENT_THINKING_MODES, 
  DEFAULT_AGENT_MODE 
};
