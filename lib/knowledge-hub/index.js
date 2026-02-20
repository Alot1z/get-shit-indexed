/**
 * Knowledge Hub
 * 
 * Central knowledge repository connecting knowledge producers to consumers.
 * Integrates pattern-learning, debug-thinking, and claudeception insights.
 * 
 * @module lib/knowledge-hub
 */

const { KnowledgeProducer } = require('./producer');
const { KnowledgeConsumer } = require('./consumer');
const { KnowledgeStore } = require('./store');
const { KnowledgeFlow } = require('./flow');

module.exports = {
  KnowledgeProducer,
  KnowledgeConsumer,
  KnowledgeStore,
  KnowledgeFlow
};
