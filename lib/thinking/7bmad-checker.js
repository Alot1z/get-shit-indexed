/**
 * 7-BMAD Circle Checker
 * 
 * Validates results against 7-BMAD quality circles.
 * Each circle represents a quality dimension that must pass validation.
 */

/**
 * 7-BMAD circle definitions with prompts
 */
const BMAD_CIRCLES = {
  method: {
    name: 'Method Circle',
    description: 'Implementation Correctness',
    prompt: (toolName, result) => 
      `Method Circle - Implementation Correctness: Analyze the result from ${toolName}:\n\n${JSON.stringify(result, null, 2)}\n\nIs the implementation correct? Does it match requirements exactly? Are edge cases handled properly?`,
    checkKeywords: ['correct', 'matches', 'properly', 'as expected', 'accurate']
  },
  mad: {
    name: 'Mad Circle',
    description: 'Integration Completeness',
    prompt: (toolName, result) => 
      `Mad Circle - Integration Completeness: Analyze the result from ${toolName}:\n\n${JSON.stringify(result, null, 2)}\n\nAre all integrations complete? Do all dependencies work together? Are there missing integration points?`,
    checkKeywords: ['integrated', 'complete', 'connected', 'linked', 'all components']
  },
  model: {
    name: 'Model Circle',
    description: 'Architecture Alignment',
    prompt: (toolName, result) => 
      `Model Circle - Architecture Alignment: Analyze the result from ${toolName}:\n\n${JSON.stringify(result, null, 2)}\n\nDoes this follow the established architecture? Is it aligned with design principles?`,
    checkKeywords: ['follows', 'aligned', 'consistent', 'architecture', 'design']
  },
  mode: {
    name: 'Mode Circle',
    description: 'Pattern Consistency',
    prompt: (toolName, result) => 
      `Mode Circle - Pattern Consistency: Analyze the result from ${toolName}:\n\n${JSON.stringify(result, null, 2)}\n\nAre patterns consistent? Are naming conventions followed? Is error handling consistent?`,
    checkKeywords: ['consistent', 'pattern', 'convention', 'standard', 'uniform']
  },
  mod: {
    name: 'Mod Circle',
    description: 'Maintainability Standards',
    prompt: (toolName, result) => 
      `Mod Circle - Maintainability: Analyze the result from ${toolName}:\n\n${JSON.stringify(result, null, 2)}\n\nIs this maintainable? Is code readable? Is complexity acceptable?`,
    checkKeywords: ['readable', 'clear', 'maintainable', 'simple', 'understandable']
  },
  modd: {
    name: 'Modd Circle',
    description: 'Extensibility Verification',
    prompt: (toolName, result) => 
      `Modd Circle - Extensibility: Analyze the result from ${toolName}:\n\n${JSON.stringify(result, null, 2)}\n\nIs this extensible? Can it be easily modified? Are extension points clear?`,
    checkKeywords: ['extensible', 'flexible', 'modular', 'extendable', 'adaptable']
  },
  methodd: {
    name: 'Methodd Circle',
    description: 'Documentation Quality',
    prompt: (toolName, result) => 
      `Methodd Circle - Documentation: Analyze the result from ${toolName}:\n\n${JSON.stringify(result, null, 2)}\n\nIs documentation complete? Are usage examples provided? Is the changelog updated?`,
    checkKeywords: ['documented', 'examples', 'clear', 'explained', 'complete']
  }
};

/**
 * Run 7-BMAD check on result
 * @param {string} toolName - Tool name
 * @param {object} result - Tool execution result
 * @param {object} options - Options
 * @param {Array<string>} options.circles - Circles to check (default: all)
 * @param {number} options.timeout - Timeout per circle in ms (default: 2000)
 * @returns {Promise<object>} BMAD score and analysis
 */
async function runBMADCheck(toolName, result, options = {}) {
  const { circles = Object.keys(BMAD_CIRCLES), timeout = 2000 } = options;
  const { callSequential } = require('./mcp-connector');
  
  const scores = {};
  let totalScore = 0;
  let maxScore = circles.length;
  
  // Check each circle
  for (const circleKey of circles) {
    const circle = BMAD_CIRCLES[circleKey];
    
    if (!circle) {
      scores[circleKey] = {
        pass: false,
        reason: 'Unknown circle'
      };
      continue;
    }
    
    try {
      // Generate prompt
      const prompt = circle.prompt(toolName, result);
      
      // Call sequential thinking for analysis
      const checkResult = await callSequential(prompt, { timeout });
      
      if (checkResult.success) {
        // Extract pass/fail from thinking result
        const analysis = checkResult.result?.result || checkResult.result || '';
        const analysisText = typeof analysis === 'string' ? analysis : JSON.stringify(analysis);
        
        // Check for positive keywords
        const hasPositive = circle.checkKeywords.some(keyword => 
          analysisText.toLowerCase().includes(keyword)
        );
        
        // Check for negative indicators
        const hasNegative = analysisText.toLowerCase().includes('not') || 
                           analysisText.toLowerCase().includes('fail') ||
                           analysisText.toLowerCase().includes('missing');
        
        scores[circleKey] = {
          pass: hasPositive && !hasNegative,
          circle: circle.name,
          description: circle.description,
          analysis: analysisText.substring(0, 200) // Truncate for brevity
        };
        
        if (hasPositive && !hasNegative) {
          totalScore += 1;
        }
      } else {
        scores[circleKey] = {
          pass: false,
          circle: circle.name,
          description: circle.description,
          reason: checkResult.error || 'Thinking server unavailable'
        };
      }
    } catch (error) {
      scores[circleKey] = {
        pass: false,
        circle: circle.name,
        description: circle.description,
        reason: error.message
      };
    }
  }
  
  return {
    totalScore,
    maxScore,
    percentage: Math.round((totalScore / maxScore) * 100),
    circles: scores,
    passed: totalScore === maxScore,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get BMAD circle definitions
 * @returns {object} Circle definitions
 */
function getBMADCircles() {
  return BMAD_CIRCLES;
}

/**
 * Get specific circle definition
 * @param {string} circleKey - Circle key
 * @returns {object|null} Circle definition or null
 */
function getBMADCircle(circleKey) {
  return BMAD_CIRCLES[circleKey] || null;
}

/**
 * Format BMAD result for display
 * @param {object} bmadResult - BMAD check result
 * @returns {string} Formatted result
 */
function formatBMADResult(bmadResult) {
  let output = `7-BMAD Quality Check: ${bmadResult.totalScore}/${bmadResult.maxScore} (${bmadResult.percentage}%)\n`;
  
  if (bmadResult.passed) {
    output += '✓ All circles passed\n\n';
  } else {
    output += '✗ Some circles failed\n\n';
  }
  
  // Show each circle
  for (const [key, score] of Object.entries(bmadResult.circles)) {
    const status = score.pass ? '✓' : '✗';
    output += `${status} ${score.circle || key} (${score.description || key})\n`;
    
    if (score.analysis) {
      output += `  ${score.analysis.substring(0, 100)}...\n`;
    } else if (score.reason) {
      output += `  Error: ${score.reason}\n`;
    }
  }
  
  return output;
}

/**
 * Check if BMAD result passes threshold
 * @param {object} bmadResult - BMAD check result
 * @param {number} threshold - Minimum percentage (default: 100)
 * @returns {boolean} True if passes threshold
 */
function passesBMADThreshold(bmadResult, threshold = 100) {
  return bmadResult.percentage >= threshold;
}

module.exports = {
  runBMADCheck,
  getBMADCircles,
  getBMADCircle,
  formatBMADResult,
  passesBMADThreshold
};
