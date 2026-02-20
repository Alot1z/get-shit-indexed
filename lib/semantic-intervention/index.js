/**
 * Semantic Intervention Engine - Main Entry Point
 * 
 * Provides intelligent semantic analysis and intervention for GSI operations.
 * Implements Heretic-API style parallel branching for multi-path reasoning.
 * 
 * @module semantic-intervention
 */

const { SemanticAnalyzer } = require('./semantic-analyzer');
const { ParallelBrancher } = require('./parallel-brancher');
const { RefusalDetector } = require('./refusal-detector');
const { InterventionTrigger } = require('./intervention-trigger');
const { InterventionLogger } = require('./intervention-logger');

// Singleton instances
let semanticAnalyzer = null;
let parallelBrancher = null;
let refusalDetector = null;
let interventionTrigger = null;
let interventionLogger = null;

/**
 * Initialize semantic intervention system
 * @param {object} config - Configuration options
 */
function initialize(config = {}) {
  semanticAnalyzer = new SemanticAnalyzer(config.semantic);
  parallelBrancher = new ParallelBrancher(config.branching);
  refusalDetector = new RefusalDetector(config.refusal);
  interventionTrigger = new InterventionTrigger(config.trigger);
  interventionLogger = new InterventionLogger(config.logging);
  
  return {
    semanticAnalyzer,
    parallelBrancher,
    refusalDetector,
    interventionTrigger,
    interventionLogger
  };
}

/**
 * Analyze a prompt/operation semantically
 * @param {string} prompt - Input prompt to analyze
 * @param {object} context - Operation context
 * @returns {Promise<object>} Semantic analysis result
 */
async function analyze(prompt, context = {}) {
  if (!semanticAnalyzer) {
    initialize();
  }
  
  return await semanticAnalyzer.analyze(prompt, context);
}

/**
 * Create parallel reasoning branches (Heretic-API style)
 * @param {string} prompt - Input prompt
 * @param {object} analysis - Semantic analysis result
 * @param {object} options - Branching options
 * @returns {Promise<object>} Branch results with confidence scores
 */
async function createBranches(prompt, analysis, options = {}) {
  if (!parallelBrancher) {
    initialize();
  }
  
  return await parallelBrancher.createBranches(prompt, analysis, options);
}

/**
 * Detect if a response is a refusal/ambiguity
 * @param {object} response - Response to analyze
 * @returns {Promise<object>} Refusal detection result
 */
async function detectRefusal(response) {
  if (!refusalDetector) {
    initialize();
  }
  
  return await refusalDetector.detect(response);
}

/**
 * Check if intervention is needed and trigger appropriate action
 * @param {object} context - Operation context
 * @returns {Promise<object|null>} Intervention action or null
 */
async function checkIntervention(context) {
  if (!interventionTrigger) {
    initialize();
  }
  
  return await interventionTrigger.check(context);
}

/**
 * Log an intervention event
 * @param {object} event - Intervention event to log
 */
function logIntervention(event) {
  if (!interventionLogger) {
    initialize();
  }
  
  interventionLogger.log(event);
}

/**
 * Get intervention statistics
 * @returns {object} Statistics object
 */
function getStats() {
  if (!interventionLogger) {
    return { initialized: false };
  }
  
  return {
    initialized: true,
    interventions: interventionLogger.getStats(),
    refusals: refusalDetector ? refusalDetector.getStats() : {},
    branches: parallelBrancher ? parallelBrancher.getStats() : {}
  };
}

/**
 * Full intervention pipeline
 * @param {string} prompt - Input prompt
 * @param {object} context - Operation context
 * @returns {Promise<object>} Complete intervention result
 */
async function runInterventionPipeline(prompt, context = {}) {
  // Step 1: Semantic analysis
  const analysis = await analyze(prompt, context);
  
  // Step 2: Check for intervention triggers
  const intervention = await checkIntervention({
    ...context,
    analysis,
    prompt
  });
  
  if (intervention) {
    // Log intervention
    logIntervention({
      type: intervention.type,
      prompt,
      analysis,
      timestamp: Date.now()
    });
    
    // Create alternative branches if needed
    if (intervention.requiresAlternatives) {
      const branches = await createBranches(prompt, analysis, {
        maxBranches: intervention.maxBranches || 3
      });
      
      return {
        intervention: true,
        type: intervention.type,
        analysis,
        branches,
        recommendation: selectBestBranch(branches)
      };
    }
    
    return {
      intervention: true,
      type: intervention.type,
      analysis,
      action: intervention.action
    };
  }
  
  // Step 3: Create parallel branches for complex operations
  if (analysis.complexity > 50 || analysis.riskScore > 60) {
    const branches = await createBranches(prompt, analysis);
    
    return {
      intervention: false,
      analysis,
      branches,
      recommendation: selectBestBranch(branches)
    };
  }
  
  return {
    intervention: false,
    analysis,
    proceed: true
  };
}

/**
 * Select best branch from parallel results
 * @param {object} branches - Branch results
 * @returns {object} Best branch recommendation
 */
function selectBestBranch(branches) {
  if (!branches || !branches.paths || branches.paths.length === 0) {
    return null;
  }
  
  // Sort by confidence score
  const sorted = [...branches.paths].sort((a, b) => 
    (b.confidence || 0) - (a.confidence || 0)
  );
  
  return sorted[0];
}

module.exports = {
  initialize,
  analyze,
  createBranches,
  detectRefusal,
  checkIntervention,
  logIntervention,
  getStats,
  runInterventionPipeline,
  selectBestBranch,
  
  // Classes for direct use
  SemanticAnalyzer,
  ParallelBrancher,
  RefusalDetector,
  InterventionTrigger,
  InterventionLogger
};
