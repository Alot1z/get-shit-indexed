/**
 * Prompt Enhancer - Cognitive Enhancement Engine
 * 
 * Implements Three-Layer Cognitive Flow for prompt enhancement:
 * Phase 1: Structure Analysis (Tractatus + CI)
 * Phase 2: Process Assessment (Sequential + CG)
 * Phase 3: Pattern Learning (Debug + DC)
 * 
 * @module lib/prompt-enhancer/enhancer
 */

const { queryEnhancementPatterns, adaptEnhancementThreshold } = require('./learning');

/**
 * Calculate enhancement quality score
 * 
 * @param {Object} intentResult - Result from Phase 1
 * @param {Object} planResult - Result from Phase 2
 * @param {Object} patternResult - Result from Phase 3
 * @returns {number} - Score from 0-10
 */
function calculateEnhancementScore(intentResult, planResult, patternResult) {
  let score = 0;
  
  // Intent analysis contributes up to 4 points
  if (intentResult?.userGoal) score += 1;
  if (intentResult?.contextNeeded?.length > 0) score += 1;
  if (intentResult?.constraints?.length > 0) score += 1;
  if (intentResult?.success) score += 1;
  
  // Enhancement plan contributes up to 3 points
  if (planResult?.missingContext?.length > 0) score += 1;
  if (planResult?.clarifications?.length > 0) score += 1;
  if (planResult?.suggestions?.length > 0) score += 1;
  
  // Pattern application contributes up to 3 points
  if (patternResult?.patterns?.length > 0) score += 1;
  if (patternResult?.improvements?.length > 0) score += 1;
  if (patternResult?.applied) score += 1;
  
  return Math.min(10, score);
}

/**
 * Phase 1: Intent Analysis using Tractatus + CI
 * 
 * @param {string} originalPrompt - The original user prompt
 * @param {Object} commandContext - Context about the command
 * @param {Object} mcp - MCP tools { tractatus, ci }
 * @returns {Promise<Object>} - Intent analysis result
 */
async function phase1_IntentAnalysis(originalPrompt, commandContext, mcp) {
  const result = {
    success: false,
    userGoal: null,
    contextNeeded: [],
    constraints: [],
    error: null
  };
  
  try {
    // Use Tractatus to decompose user intent
    if (mcp.tractatus) {
      const tractatusResult = await mcp.tractatus({
        operation: 'start',
        concept: `What does the user want to accomplish with: ${originalPrompt}`,
        depth_limit: 3,
        confidence_threshold: 0.5
      });
      
      if (tractatusResult) {
        result.userGoal = tractatusResult.summary || 'Execute GSI command';
        result.success = true;
      }
    }
    
    // Use CI to search for relevant context files
    if (mcp.ci && commandContext.name) {
      const searchResult = await mcp.ci({
        pattern: commandContext.name,
        file_pattern: '*.md'
      });
      
      if (searchResult?.results) {
        result.contextNeeded = searchResult.results
          .slice(0, 3)
          .map(r => r.file || r.path);
      }
    }
    
    // Extract constraints from command arguments
    const args = commandContext.arguments;
    if (args) {
      // Phase numbers are constraints
      const phaseMatch = args.match(/\d+/);
      if (phaseMatch) {
        result.constraints.push(`Target phase: ${phaseMatch[0]}`);
      }
    }
    
  } catch (error) {
    result.error = error.message;
    // Graceful degradation - continue with partial results
  }
  
  return result;
}

/**
 * Phase 2: Enhancement Planning using Sequential + CG
 * 
 * @param {Object} intentResult - Result from Phase 1
 * @param {string} originalPrompt - The original user prompt
 * @param {Object} mcp - MCP tools { sequential, cg }
 * @returns {Promise<Object>} - Enhancement plan
 */
async function phase2_EnhancementPlanning(intentResult, originalPrompt, mcp) {
  const result = {
    success: false,
    missingContext: [],
    clarifications: [],
    suggestions: [],
    error: null
  };
  
  try {
    // Use Sequential thinking to plan enhancement
    if (mcp.sequential) {
      const sequentialResult = await mcp.sequential({
        thought: `Analyze what context would improve the prompt: "${originalPrompt}"`,
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      });
      
      if (sequentialResult) {
        // Extract suggestions from thinking
        const thought = sequentialResult.thought || '';
        
        // Look for patterns suggesting missing context
        if (thought.includes('context') || thought.includes('missing')) {
          result.suggestions.push('Add phase context from ROADMAP');
        }
        
        result.success = true;
      }
    }
    
    // Use CG to check command dependencies
    if (mcp.cg && intentResult?.contextNeeded?.length > 0) {
      // CG integration for dependency analysis
      result.suggestions.push('Check phase dependencies');
    }
    
    // Standard clarifications based on command type
    if (intentResult?.userGoal) {
      result.clarifications.push(`Intent: ${intentResult.userGoal}`);
    }
    
  } catch (error) {
    result.error = error.message;
    // Graceful degradation
  }
  
  return result;
}

/**
 * Phase 3: Pattern Application using Debug + DC
 * 
 * @param {Object} planResult - Result from Phase 2
 * @param {string} originalPrompt - The original user prompt
 * @param {Object} mcp - MCP tools { debug, dc }
 * @returns {Promise<Object>} - Pattern application result
 */
async function phase3_PatternApplication(planResult, originalPrompt, mcp) {
  const result = {
    success: false,
    patterns: [],
    improvements: [],
    applied: false,
    error: null
  };
  
  try {
    // Query Debug thinking for similar past prompts
    if (mcp.debug) {
      const debugResult = await mcp.debug({
        action: 'query',
        queryType: 'similar-problems',
        parameters: {
          pattern: originalPrompt,
          limit: 3
        }
      });
      
      if (debugResult?.results?.length > 0) {
        result.patterns = debugResult.results.map(r => ({
          pattern: r.content,
          similarity: r.similarity
        }));
      }
    }
    
    // Read enhancement patterns from patterns.json
    if (mcp.dc) {
      try {
        const patternsContent = await mcp.dc.read_file({
          path: 'lib/prompt-enhancer/patterns.json'
        });
        
        if (patternsContent) {
          const patterns = JSON.parse(patternsContent);
          result.patterns = [...result.patterns, ...(patterns.patterns || [])];
          result.applied = true;
        }
      } catch (e) {
        // patterns.json doesn't exist yet - that's okay
      }
    }
    
    // Query learning module for historical patterns
    try {
      const commandName = originalPrompt.match(/\/(?:gsi|gsd):(\S+)/)?.[1];
      const learnedPatterns = queryEnhancementPatterns(
        originalPrompt,
        commandName,
        3,
        '.planning/enhancement-history.json'
      );
      
      if (learnedPatterns && learnedPatterns.length > 0) {
        result.patterns = [...result.patterns, ...learnedPatterns.map(p => ({
          pattern: p.pattern,
          similarity: p.similarity,
          successRate: p.successRate
        }))];
        result.applied = true;
      }
    } catch (e) {
      // Learning module may not have data yet - that's okay
    }
    
    // Generate improvements based on patterns
    if (result.patterns.length > 0) {
      result.improvements = result.patterns
        .filter(p => p.successRate > 0.7 || p.similarity > 0.5)
        .map(p => p.pattern || p.content)
        .slice(0, 3);
      result.success = true;
    }
    
  } catch (error) {
    result.error = error.message;
    // Graceful degradation
  }
  
  return result;
}

/**
 * Format the enhanced prompt with clear sections
 * 
 * @param {string} originalPrompt - The original user prompt
 * @param {Object} intentResult - Result from Phase 1
 * @param {Object} planResult - Result from Phase 2
 * @param {Object} patternResult - Result from Phase 3
 * @param {number} score - Enhancement score
 * @returns {string} - Formatted enhanced prompt
 */
function formatEnhancedPrompt(originalPrompt, intentResult, planResult, patternResult, score) {
  let enhanced = originalPrompt + '\n';
  
  // Add context section if we have useful context
  if (intentResult?.userGoal || intentResult?.contextNeeded?.length > 0) {
    enhanced += '\n## Context\n';
    
    if (intentResult.userGoal) {
      enhanced += `Intent: ${intentResult.userGoal}\n`;
    }
    
    if (intentResult.constraints?.length > 0) {
      enhanced += intentResult.constraints.map(c => `- ${c}`).join('\n') + '\n';
    }
  }
  
  // Add detected requirements
  if (planResult?.suggestions?.length > 0 || planResult?.clarifications?.length > 0) {
    enhanced += '\n## Detected Requirements\n';
    
    if (planResult.clarifications?.length > 0) {
      enhanced += planResult.clarifications.map(c => `- ${c}`).join('\n') + '\n';
    }
    
    if (planResult.suggestions?.length > 0) {
      enhanced += planResult.suggestions.map(s => `- ${s}`).join('\n') + '\n';
    }
  }
  
  // Add enhancement notes
  if (patternResult?.improvements?.length > 0 || score >= 3) {
    enhanced += '\n## Enhancement Notes\n';
    
    if (patternResult.improvements?.length > 0) {
      enhanced += patternResult.improvements.map(i => `- ${i}`).join('\n') + '\n';
    }
    
    enhanced += `- Confidence: ${Math.round(score * 10)}%\n`;
  }
  
  return enhanced;
}

/**
 * Assemble the final enhanced prompt
 * 
 * @param {string} originalPrompt - The original user prompt
 * @param {Object} intentResult - Result from Phase 1
 * @param {Object} planResult - Result from Phase 2
 * @param {Object} patternResult - Result from Phase 3
 * @returns {string} - The enhanced prompt
 */
function assembleEnhancedPrompt(originalPrompt, intentResult, planResult, patternResult) {
  // If all phases failed, return original
  if (!intentResult?.success && !planResult?.success && !patternResult?.success) {
    return originalPrompt;
  }
  
  const score = calculateEnhancementScore(intentResult, planResult, patternResult);
  
  // If score is too low, don't enhance
  if (score < 3) {
    return originalPrompt;
  }
  
  return formatEnhancedPrompt(originalPrompt, intentResult, planResult, patternResult, score);
}

/**
 * Main enhancement function - orchestrates three-phase cognitive flow
 * 
 * @param {string} originalPrompt - The original user prompt
 * @param {Object} commandContext - Context about the command
 * @param {Object} mcp - MCP tools { tractatus, ci, sequential, cg, debug, dc }
 * @returns {Promise<Object>} - { enhancedPrompt, score, phases }
 */
async function enhancePrompt(originalPrompt, commandContext, mcp) {
  const startTime = Date.now();
  const phases = [];
  
  // Phase 1: Intent Analysis (Tractatus + CI)
  const intentResult = await phase1_IntentAnalysis(originalPrompt, commandContext, mcp);
  phases.push({ name: 'intent-analysis', result: intentResult });
  
  // Phase 2: Enhancement Planning (Sequential + CG)
  const planResult = await phase2_EnhancementPlanning(intentResult, originalPrompt, mcp);
  phases.push({ name: 'enhancement-planning', result: planResult });
  
  // Phase 3: Pattern Application (Debug + DC)
  const patternResult = await phase3_PatternApplication(planResult, originalPrompt, mcp);
  phases.push({ name: 'pattern-application', result: patternResult });
  
  // Calculate score
  const score = calculateEnhancementScore(intentResult, planResult, patternResult);
  
  // Assemble enhanced prompt
  const enhancedPrompt = assembleEnhancedPrompt(
    originalPrompt,
    intentResult,
    planResult,
    patternResult
  );
  
  const duration = Date.now() - startTime;
  
  return {
    enhancedPrompt,
    score,
    phases,
    duration,
    enhanced: enhancedPrompt !== originalPrompt
  };
}

module.exports = {
  enhancePrompt,
  assembleEnhancedPrompt,
  formatEnhancedPrompt,
  calculateEnhancementScore,
  phase1_IntentAnalysis,
  phase2_EnhancementPlanning,
  phase3_PatternApplication
};
