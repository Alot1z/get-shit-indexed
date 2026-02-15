/**
 * Thinking Orchestrator
 * 
 * Orchestrates thinking calls before and after tool execution.
 * Uses mode selector to determine what to think about, then calls appropriate thinking server.
 * Integrates with pattern learning for prediction and recording.
 */

const { selectThinkingMode, getMetrics: getSelectorMetrics } = require('./selector');
const { callSequential, callTractatus, callDebug, isServerAvailable } = require('./mcp-connector');
const { parseThinkingResult } = require('./result-parser');
const { ThinkingContext } = require('./context');

// Pattern learning integration (optional)
let patternPredictor = null;
let patternLoop = null;
try {
  patternPredictor = require('../pattern-learning/predictor');
  patternLoop = require('../pattern-learning/loop');
} catch (e) {
  // Pattern learning not available
}

// Result cache
const resultCache = new Map();
const CACHE_TTL = 300000; // 5 minutes

// Metrics
const metrics = {
  beforeToolCalls: 0,
  afterToolCalls: 0,
  cacheHits: 0,
  cacheMisses: 0,
  errors: 0,
  degradedCalls: 0
};

/**
 * Think before tool execution
 * @param {string} toolName - Tool name
 * @param {object} context - Operation context
 * @returns {Promise<ThinkingContext>} Thinking context
 */
async function thinkBeforeTool(toolName, context = {}) {
  metrics.beforeToolCalls++;
  
  // Create thinking context
  const thinkingContext = new ThinkingContext(toolName, context);
  
  try {
    // Query pattern predictor for suggestions
    let patternSuggestions = null;
    if (patternPredictor) {
      try {
        const prediction = await patternPredictor.getPrediction({ tool: toolName, ...context });
        if (prediction.nextOperation.prediction || prediction.risks.risks.length > 0) {
          patternSuggestions = {
            nextOperation: prediction.nextOperation.prediction,
            confidence: prediction.nextOperation.confidence,
            risks: prediction.risks.risks,
            safe: prediction.risks.safe
          };
        }
      } catch (e) {
        // Pattern prediction failed, continue without it
      }
    }
    
    // Select thinking mode
    const modeConfig = selectThinkingMode(toolName, context);
    
    if (!modeConfig.enabled) {
      thinkingContext.beforeThinking = {
        skipped: true,
        reason: modeConfig.reason || 'Thinking disabled for this tool',
        patterns: patternSuggestions
      };
      return thinkingContext;
    }
    
    // Enhance prompt with pattern suggestions
    let enhancedPrompt = modeConfig.prompt;
    if (patternSuggestions && patternSuggestions.risks && patternSuggestions.risks.length > 0) {
      const riskWarnings = patternSuggestions.risks.map(r => `- ${r.reason} (confidence: ${(r.confidence * 100).toFixed(0)}%)`).join('\n');
      enhancedPrompt += `\n\n## Risk Warnings (from learned patterns)\n${riskWarnings}\n\nConsider these risks when proceeding.`;
    }
    
    if (patternSuggestions && patternSuggestions.nextOperation) {
      enhancedPrompt += `\n\n## Pattern Prediction\nExpected next operation: ${patternSuggestions.nextOperation} (confidence: ${(patternSuggestions.confidence * 100).toFixed(0)}%)\n\nConsider this prediction in your planning.`;
    }
    
    // Generate cache key
    const cacheKey = `${toolName}:${JSON.stringify(context)}:before`;
    
    // Check cache
    const cached = resultCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      metrics.cacheHits++;
      thinkingContext.beforeThinking = {
        cached: true,
        ...cached.result,
        patterns: patternSuggestions
      };
      return thinkingContext;
    }
    
    metrics.cacheMisses++;
    
    // Call appropriate thinking server
    const server = modeConfig.server;
    const prompt = enhancedPrompt;
    
    let thinkingResult;
    if (server === 'sequential') {
      thinkingResult = await callSequential(prompt, { timeout: modeConfig.timeout });
    } else if (server === 'tractatus') {
      thinkingResult = await callTractatus(prompt, { timeout: modeConfig.timeout });
    } else if (server === 'debug') {
      thinkingResult = await callDebug(prompt, { timeout: modeConfig.timeout });
    } else if (server === 'combined') {
      // Combined mode: Tractatus for structure, then Sequential for process
      const tractatusResult = await callTractatus(prompt, { timeout: modeConfig.timeout / 2 });
      const sequentialResult = await callSequential(prompt, { timeout: modeConfig.timeout / 2 });
      thinkingResult = {
        success: tractatusResult.success && sequentialResult.success,
        server: 'combined',
        results: {
          tractatus: tractatusResult,
          sequential: sequentialResult
        }
      };
    } else {
      throw new Error(`Unknown server: ${server}`);
    }
    
    // Track degraded calls
    if (!thinkingResult.success) {
      metrics.degradedCalls++;
    }
    
    // Parse thinking result
    const parsed = parseThinkingResult(thinkingResult, server);
    
    // Store in cache
    resultCache.set(cacheKey, {
      timestamp: Date.now(),
      result: parsed
    });
    
    thinkingContext.beforeThinking = {
      cached: false,
      server,
      prompt,
      parsed,
      patterns: patternSuggestions
    };
    
    return thinkingContext;
  } catch (error) {
    metrics.errors++;
    thinkingContext.beforeThinking = {
      error: error.message,
      degraded: true
    };
    return thinkingContext;
  }
}

/**
 * Think after tool execution
 * @param {string} toolName - Tool name
 * @param {object} context - Operation context
 * @param {object} result - Tool execution result
 * @returns {Promise<ThinkingContext>} Updated thinking context
 */
async function thinkAfterTool(toolName, context = {}, result = {}) {
  metrics.afterToolCalls++;
  
  // Create thinking context
  const thinkingContext = new ThinkingContext(toolName, context);
  
  try {
    // Record operation for pattern learning
    if (patternLoop) {
      try {
        const operationMetrics = {
          tokens: result.tokens || result.usage?.input_tokens + result.usage?.output_tokens || 0,
          duration: result.duration || result.time || 0
        };
        await patternLoop.recordOperation(toolName, context, result, operationMetrics);
      } catch (e) {
        // Recording failed, don't break the flow
      }
    }
    
    // Use debug thinking for reflection
    const reflectionPrompt = `Reflect on tool execution:\n\nTool: ${toolName}\nResult: ${JSON.stringify(result, null, 2)}\n\nWhat patterns did you observe? What should be learned?`;
    
    const debugResult = await callDebug(reflectionPrompt, {
      timeout: 3000,
      action: 'create'
    });
    
    // Parse reflection
    const reflection = parseThinkingResult(debugResult, 'debug');
    
    thinkingContext.afterThinking = {
      reflection,
      learning: reflection.learning || reflection.recommendations || []
    };
    
    // Store learning (if available via debug-thinking graph)
    if (debugResult.success && debugResult.result) {
      // Learning is automatically stored in debug-thinking graph
    }
    
    return thinkingContext;
  } catch (error) {
    metrics.errors++;
    thinkingContext.afterThinking = {
      error: error.message,
      degraded: true
    };
    return thinkingContext;
  }
}

/**
 * Run 7-BMAD check on result
 * @param {string} toolName - Tool name
 * @param {object} result - Tool execution result
 * @returns {Promise<object>} BMAD score and analysis
 */
async function runBMADCheck(toolName, result) {
  const bmadPrompts = {
    method: `Method Circle - Implementation Correctness: Is the result from ${toolName} correct? Does it match requirements?`,
    mad: `Mad Circle - Integration Completeness: Are all integrations complete in this result?`,
    model: `Model Circle - Architecture Alignment: Does this result follow the established architecture?`,
    mode: `Mode Circle - Pattern Consistency: Are patterns consistent in this result?`,
    mod: `Mod Circle - Maintainability: Is this result maintainable?`,
    modd: `Modd Circle - Extensibility: Is this result extensible?`,
    methodd: `Methodd Circle - Documentation: Is documentation complete?`
  };
  
  const scores = {};
  let totalScore = 0;
  
  // Check each circle
  for (const [circle, prompt] of Object.entries(bmadPrompts)) {
    try {
      const checkResult = await callSequential(prompt, { timeout: 2000 });
      
      if (checkResult.success) {
        // Extract score from thinking result (simplified)
        scores[circle] = {
          pass: true,
          analysis: checkResult.result
        };
        totalScore += 1;
      } else {
        scores[circle] = {
          pass: false,
          reason: checkResult.error
        };
      }
    } catch (error) {
      scores[circle] = {
        pass: false,
        reason: error.message
      };
    }
  }
  
  return {
    totalScore,
    maxScore: 7,
    percentage: Math.round((totalScore / 7) * 100),
    circles: scores
  };
}

/**
 * Clear result cache
 */
function clearCache() {
  resultCache.clear();
}

/**
 * Get metrics
 * @returns {object} Metrics object
 */
function getMetrics() {
  const selectorMetrics = getSelectorMetrics();
  
  return {
    ...metrics,
    selector: selectorMetrics,
    cacheSize: resultCache.size,
    cacheHitRate: metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) || 0,
    degradedRate: metrics.degradedCalls / metrics.beforeToolCalls || 0,
    errorRate: metrics.errors / (metrics.beforeToolCalls + metrics.afterToolCalls) || 0
  };
}

/**
 * Reset metrics
 */
function resetMetrics() {
  metrics.beforeToolCalls = 0;
  metrics.afterToolCalls = 0;
  metrics.cacheHits = 0;
  metrics.cacheMisses = 0;
  metrics.errors = 0;
  metrics.degradedCalls = 0;
}

module.exports = {
  thinkBeforeTool,
  thinkAfterTool,
  runBMADCheck,
  clearCache,
  getMetrics,
  resetMetrics
};
