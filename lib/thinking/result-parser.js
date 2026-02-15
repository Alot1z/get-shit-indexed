/**
 * Thinking Result Parser
 * 
 * Parses results from thinking MCP servers to extract key information.
 * Provides unified API for different server result types.
 */

/**
 * Parse sequential thinking result
 * @param {object} result - Raw result from sequential thinking server
 * @returns {object} Parsed result
 */
function parseSequentialResult(result) {
  if (!result || !result.result) {
    return {
      steps: [],
      decisions: [],
      concerns: [],
      conclusion: null
    };
  }
  
  const response = result.result;
  
  // Extract steps (thoughts)
  const steps = [];
  if (response.thoughts && Array.isArray(response.thoughts)) {
    response.thoughts.forEach((thought, index) => {
      steps.push({
        number: index + 1,
        content: thought.thought || thought,
        isRevision: thought.isRevision || false
      });
    });
  } else if (response.thought) {
    steps.push({
      number: 1,
      content: response.thought,
      isRevision: response.isRevision || false
    });
  }
  
  // Extract decisions (look for decision keywords)
  const decisions = [];
  const decisionKeywords = ['decide', 'choose', 'select', 'will', 'should'];
  steps.forEach(step => {
    const content = step.content.toLowerCase();
    if (decisionKeywords.some(keyword => content.includes(keyword))) {
      decisions.push(step.content);
    }
  });
  
  // Extract concerns (look for concern keywords)
  const concerns = [];
  const concernKeywords = ['concern', 'issue', 'problem', 'risk', 'uncertain'];
  steps.forEach(step => {
    const content = step.content.toLowerCase();
    if (concernKeywords.some(keyword => content.includes(keyword))) {
      concerns.push(step.content);
    }
  });
  
  // Extract conclusion (last step often has the conclusion)
  const conclusion = steps.length > 0 ? steps[steps.length - 1].content : null;
  
  return {
    steps,
    decisions,
    concerns,
    conclusion,
    serverType: 'sequential'
  };
}

/**
 * Parse tractatus thinking result
 * @param {object} result - Raw result from tractatus thinking server
 * @returns {object} Parsed result
 */
function parseTractatusResult(result) {
  if (!result || !result.result) {
    return {
      propositions: [],
      structure: null,
      insights: [],
      conclusions: []
    };
  }
  
  const response = result.result;
  
  // Extract propositions
  const propositions = [];
  if (response.propositions && Array.isArray(response.propositions)) {
    response.propositions.forEach(prop => {
      propositions.push({
        number: prop.number || prop.proposition_number,
        content: prop.content || prop.proposition_content,
        isAtomic: prop.is_atomic || false
      });
    });
  }
  
  // Extract structure insights
  const structure = response.structure || response.hierarchy || null;
  
  // Extract insights (look for insight keywords)
  const insights = [];
  const insightKeywords = ['insight', 'realize', 'understand', 'see that', 'note'];
  propositions.forEach(prop => {
    const content = prop.content.toLowerCase();
    if (insightKeywords.some(keyword => content.includes(keyword))) {
      insights.push(prop.content);
    }
  });
  
  // Extract conclusions (last propositions often contain conclusions)
  const conclusions = propositions.length > 0 
    ? propositions.slice(-3).map(p => p.content)
    : [];
  
  return {
    propositions,
    structure,
    insights,
    conclusions,
    serverType: 'tractatus'
  };
}

/**
 * Parse debug thinking result
 * @param {object} result - Raw result from debug thinking server
 * @returns {object} Parsed result
 */
function parseDebugResult(result) {
  if (!result || !result.result) {
    return {
      problems: [],
      hypotheses: [],
      recommendations: [],
      learning: []
    };
  }
  
  const response = result.result;
  
  // Extract problems
  const problems = [];
  if (response.problems && Array.isArray(response.problems)) {
    response.problems.forEach(prob => {
      problems.push({
        id: prob.id,
        content: prob.content || prob.description
      });
    });
  }
  
  // Extract hypotheses
  const hypotheses = [];
  if (response.hypotheses && Array.isArray(response.hypotheses)) {
    response.hypotheses.forEach(hyp => {
      hypotheses.push({
        id: hyp.id,
        content: hyp.content || hyp.description
      });
    });
  }
  
  // Extract recommendations
  const recommendations = [];
  const recommendationKeywords = ['recommend', 'suggest', 'should', 'try'];
  
  // Look in various fields
  const textContent = 
    response.recommendations || 
    response.suggestions || 
    response.next_steps ||
    [];
  
  if (Array.isArray(textContent)) {
    recommendations.push(...textContent);
  } else if (typeof textContent === 'string') {
    recommendations.push(textContent);
  }
  
  // Extract learning
  const learning = [];
  if (response.learnings && Array.isArray(response.learnings)) {
    response.learnings.forEach(learn => {
      learning.push({
        id: learn.id,
        content: learn.content || learn.description
      });
    });
  }
  
  return {
    problems,
    hypotheses,
    recommendations,
    learning,
    serverType: 'debug'
  };
}

/**
 * Parse thinking result (unified API)
 * @param {object} result - Raw result from any thinking server
 * @param {string} serverType - Server type (sequential, tractatus, debug, combined)
 * @returns {object} Parsed result
 */
function parseThinkingResult(result, serverType) {
  if (serverType === 'sequential') {
    return parseSequentialResult(result);
  } else if (serverType === 'tractatus') {
    return parseTractatusResult(result);
  } else if (serverType === 'debug') {
    return parseDebugResult(result);
  } else if (serverType === 'combined') {
    // Parse combined results
    const combined = {
      serverType: 'combined',
      tractatus: null,
      sequential: null
    };
    
    if (result.results) {
      if (result.results.tractatus) {
        combined.tractatus = parseTractatusResult(result.results.tractatus);
      }
      if (result.results.sequential) {
        combined.sequential = parseSequentialResult(result.results.sequential);
      }
    }
    
    return combined;
  }
  
  // Unknown server type
  return {
    serverType: 'unknown',
    raw: result
  };
}

/**
 * Extract key insights from parsed result
 * @param {object} parsedResult - Parsed result
 * @returns {Array<string>} Key insights
 */
function extractKeyInsights(parsedResult) {
  const insights = [];
  
  if (parsedResult.serverType === 'sequential') {
    insights.push(...parsedResult.decisions);
    if (parsedResult.conclusion) {
      insights.push(parsedResult.conclusion);
    }
  } else if (parsedResult.serverType === 'tractatus') {
    insights.push(...parsedResult.insights);
    insights.push(...parsedResult.conclusions);
  } else if (parsedResult.serverType === 'debug') {
    insights.push(...parsedResult.recommendations);
    insights.push(...parsedResult.learning.map(l => l.content));
  } else if (parsedResult.serverType === 'combined') {
    if (parsedResult.tractatus) {
      insights.push(...extractKeyInsights(parsedResult.tractatus));
    }
    if (parsedResult.sequential) {
      insights.push(...extractKeyInsights(parsedResult.sequential));
    }
  }
  
  return insights;
}

/**
 * Format thinking result for display
 * @param {object} parsedResult - Parsed result
 * @returns {string} Formatted result
 */
function formatThinkingResult(parsedResult) {
  if (parsedResult.serverType === 'sequential') {
    return `Sequential Thinking (${parsedResult.steps.length} steps):\n` +
      parsedResult.steps.map(s => `${s.number}. ${s.content}`).join('\n');
  } else if (parsedResult.serverType === 'tractatus') {
    return `Tractatus Thinking (${parsedResult.propositions.length} propositions):\n` +
      parsedResult.propositions.map(p => `${p.number}. ${p.content}`).join('\n');
  } else if (parsedResult.serverType === 'debug') {
    return `Debug Thinking:\n` +
      `Problems: ${parsedResult.problems.length}\n` +
      `Hypotheses: ${parsedResult.hypotheses.length}\n` +
      `Recommendations: ${parsedResult.recommendations.length}\n` +
      `Learning: ${parsedResult.learning.length}`;
  } else if (parsedResult.serverType === 'combined') {
    let output = 'Combined Thinking:\n';
    if (parsedResult.tractatus) {
      output += formatThinkingResult(parsedResult.tractatus) + '\n\n';
    }
    if (parsedResult.sequential) {
      output += formatThinkingResult(parsedResult.sequential);
    }
    return output;
  }
  
  return 'Unknown thinking result';
}

module.exports = {
  parseSequentialResult,
  parseTractatusResult,
  parseDebugResult,
  parseThinkingResult,
  extractKeyInsights,
  formatThinkingResult
};
