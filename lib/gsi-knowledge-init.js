/**
 * GSI Knowledge Flow Initialization
 * 
 * Wires the knowledge-hub module into GSI, creating connections between
 * knowledge producers (pattern-learning, debug-thinking, etc.) and
 * consumers (prompt-enhancer, complexity-predictor, planner).
 * 
 * @module lib/gsi-knowledge-init
 */

const { KnowledgeFlow } = require('./knowledge-hub');

// Global knowledge flow instance
let knowledgeFlow = null;

/**
 * Initialize the knowledge flow system
 * @param {object} config - Optional configuration
 * @returns {KnowledgeFlow} The initialized flow
 */
function initializeKnowledgeFlow(config = {}) {
  if (knowledgeFlow) {
    return knowledgeFlow;
  }
  
  // Create standard flow with all producers and consumers
  knowledgeFlow = KnowledgeFlow.createStandardFlow();
  
  // Apply any custom config
  if (config.paused) {
    knowledgeFlow.pause();
  }
  
  console.error('[GSI Knowledge] Flow initialized with:');
  console.error(`  - ${knowledgeFlow.producers.size} producers`);
  console.error(`  - ${knowledgeFlow.consumers.size} consumers`);
  
  return knowledgeFlow;
}

/**
 * Get the current knowledge flow instance
 * @returns {KnowledgeFlow|null} The flow instance or null if not initialized
 */
function getKnowledgeFlow() {
  return knowledgeFlow;
}

/**
 * Emit knowledge from a producer
 * @param {string} producerName - Name of the producer
 * @param {string} type - Knowledge type
 * @param {object} data - Knowledge data
 * @returns {object|null} The emitted knowledge or null if flow not initialized
 */
function emitKnowledge(producerName, type, data) {
  if (!knowledgeFlow) {
    // Initialize on first use
    initializeKnowledgeFlow();
  }
  
  const producer = knowledgeFlow.producers.get(producerName);
  if (!producer) {
    console.error(`[GSI Knowledge] Unknown producer: ${producerName}`);
    return null;
  }
  
  return producer.emit(type, data);
}

/**
 * Query knowledge from the store
 * @param {object} filter - Filter criteria
 * @returns {Array} Matching knowledge items
 */
function queryKnowledge(filter = {}) {
  if (!knowledgeFlow) {
    initializeKnowledgeFlow();
  }
  
  return knowledgeFlow.store.query(filter);
}

/**
 * Get flow status and metrics
 * @returns {object} Status object
 */
function getKnowledgeStatus() {
  if (!knowledgeFlow) {
    return { status: 'not-initialized' };
  }
  
  return knowledgeFlow.getStatus();
}

/**
 * Optimize the knowledge flow
 * @returns {object} Optimization suggestions
 */
function optimizeKnowledgeFlow() {
  if (!knowledgeFlow) {
    initializeKnowledgeFlow();
  }
  
  return knowledgeFlow.optimize();
}

module.exports = {
  initializeKnowledgeFlow,
  getKnowledgeFlow,
  emitKnowledge,
  queryKnowledge,
  getKnowledgeStatus,
  optimizeKnowledgeFlow
};
