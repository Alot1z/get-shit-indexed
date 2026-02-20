/**
 * Knowledge Flow
 * 
 * Manages the flow of knowledge from producers to consumers.
 * Provides visualization, bottleneck detection, and flow optimization.
 * 
 * @module lib/knowledge-hub/flow
 */

const EventEmitter = require('events');
const { KnowledgeProducer, KNOWLEDGE_SOURCES, KNOWLEDGE_TYPES } = require('./producer');
const { KnowledgeConsumer, CONSUMER_TYPES } = require('./consumer');
const { KnowledgeStore } = require('./store');

/**
 * Flow status types
 */
const FLOW_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  ERROR: 'error'
};

/**
 * Knowledge Flow Class
 * Orchestrates knowledge flow between producers and consumers
 */
class KnowledgeFlow extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.store = new KnowledgeStore(config.store);
    this.producers = new Map();
    this.consumers = new Map();
    this.connections = [];
    this.status = FLOW_STATUS.ACTIVE;
    this.metrics = {
      totalFlows: 0,
      flowsByType: {},
      flowsBySource: {},
      errors: []
    };
  }
  
  /**
   * Register a knowledge producer
   * @param {string} name - Producer name
   * @param {KnowledgeProducer} producer - Producer instance
   */
  registerProducer(name, producer) {
    this.producers.set(name, producer);
    
    // Wire up flow
    producer.on('knowledge', (knowledge) => {
      this.handleKnowledge(name, knowledge);
    });
    
    this.emit('producer-registered', { name, producer });
  }
  
  /**
   * Register a knowledge consumer
   * @param {string} name - Consumer name
   * @param {KnowledgeConsumer} consumer - Consumer instance
   */
  registerConsumer(name, consumer) {
    this.consumers.set(name, consumer);
    this.emit('consumer-registered', { name, consumer });
  }
  
  /**
   * Connect a producer to consumers
   * @param {string} producerName - Producer name
   * @param {string|Array} consumerNames - Consumer name(s)
   * @param {object} filter - Optional filter
   */
  connect(producerName, consumerNames, filter = {}) {
    const consumers = Array.isArray(consumerNames) ? consumerNames : [consumerNames];
    
    for (const consumerName of consumers) {
      this.connections.push({
        producer: producerName,
        consumer: consumerName,
        filter,
        active: true
      });
    }
    
    this.emit('connected', { producer: producerName, consumers });
  }
  
  /**
   * Handle incoming knowledge
   * @param {string} producerName - Producer name
   * @param {object} knowledge - Knowledge item
   */
  handleKnowledge(producerName, knowledge) {
    if (this.status !== FLOW_STATUS.ACTIVE) {
      return;
    }
    
    try {
      // Store knowledge
      this.store.store(knowledge);
      
      // Update metrics
      this.updateMetrics(knowledge);
      
      // Route to consumers
      this.routeKnowledge(producerName, knowledge);
      
      // Emit flow event
      this.emit('flow', { producer: producerName, knowledge });
      
    } catch (error) {
      this.metrics.errors.push({
        timestamp: new Date().toISOString(),
        error: error.message,
        producer: producerName
      });
      this.emit('error', { producer: producerName, error });
    }
  }
  
  /**
   * Route knowledge to appropriate consumers
   * @param {string} producerName - Producer name
   * @param {object} knowledge - Knowledge item
   */
  routeKnowledge(producerName, knowledge) {
    for (const conn of this.connections) {
      if (!conn.active) continue;
      if (conn.producer !== producerName) continue;
      
      // Check filter
      if (!this.matchesFilter(knowledge, conn.filter)) continue;
      
      const consumer = this.consumers.get(conn.consumer);
      if (consumer) {
        consumer.process(knowledge);
      }
    }
  }
  
  /**
   * Check if knowledge matches filter
   * @param {object} knowledge - Knowledge item
   * @param {object} filter - Filter criteria
   * @returns {boolean} Match result
   */
  matchesFilter(knowledge, filter) {
    if (Object.keys(filter).length === 0) return true;
    
    for (const [key, value] of Object.entries(filter)) {
      if (knowledge[key] !== value) return false;
    }
    
    return true;
  }
  
  /**
   * Update flow metrics
   * @param {object} knowledge - Knowledge item
   */
  updateMetrics(knowledge) {
    this.metrics.totalFlows++;
    
    // By type
    this.metrics.flowsByType[knowledge.type] = 
      (this.metrics.flowsByType[knowledge.type] || 0) + 1;
    
    // By source
    this.metrics.flowsBySource[knowledge.source] = 
      (this.metrics.flowsBySource[knowledge.source] || 0) + 1;
  }
  
  /**
   * Get flow visualization data
   * @returns {object} Visualization data
   */
  getVisualization() {
    const nodes = [];
    const edges = [];
    
    // Producer nodes
    for (const [name, producer] of this.producers) {
      nodes.push({
        id: `producer-${name}`,
        type: 'producer',
        label: name,
        stats: producer.getStats()
      });
    }
    
    // Consumer nodes
    for (const [name, consumer] of this.consumers) {
      nodes.push({
        id: `consumer-${name}`,
        type: 'consumer',
        label: name,
        stats: consumer.getStats()
      });
    }
    
    // Hub node
    nodes.push({
      id: 'hub',
      type: 'hub',
      label: 'Knowledge Hub',
      stats: this.store.getStats()
    });
    
    // Connection edges
    for (const conn of this.connections) {
      edges.push({
        source: `producer-${conn.producer}`,
        target: `consumer-${conn.consumer}`,
        filter: conn.filter,
        active: conn.active
      });
    }
    
    return { nodes, edges, metrics: this.metrics };
  }
  
  /**
   * Detect flow bottlenecks
   * @returns {Array} Bottleneck descriptions
   */
  detectBottlenecks() {
    const bottlenecks = [];
    
    // Check for overloaded consumers
    for (const [name, consumer] of this.consumers) {
      const stats = consumer.getStats();
      if (stats.knowledgeSize > 500) {
        bottlenecks.push({
          type: 'consumer-overload',
          consumer: name,
          size: stats.knowledgeSize,
          recommendation: 'Consider adding filters or increasing processing frequency'
        });
      }
    }
    
    // Check for slow producers
    for (const [name, producer] of this.producers) {
      const stats = producer.getStats();
      if (stats.emittedCount > 1000) {
        bottlenecks.push({
          type: 'high-volume-producer',
          producer: name,
          count: stats.emittedCount,
          recommendation: 'Consider batching or rate limiting'
        });
      }
    }
    
    // Check for connection issues
    const activeConnections = this.connections.filter(c => c.active).length;
    const inactiveConnections = this.connections.filter(c => !c.active).length;
    
    if (inactiveConnections > activeConnections) {
      bottlenecks.push({
        type: 'inactive-connections',
        active: activeConnections,
        inactive: inactiveConnections,
        recommendation: 'Review and reactivate or remove inactive connections'
      });
    }
    
    return bottlenecks;
  }
  
  /**
   * Optimize flow configuration
   * @returns {object} Optimization suggestions
   */
  optimize() {
    const suggestions = [];
    const bottlenecks = this.detectBottlenecks();
    
    for (const bottleneck of bottlenecks) {
      suggestions.push({
        issue: bottleneck.type,
        details: bottleneck,
        action: bottleneck.recommendation
      });
    }
    
    // Suggest new connections based on knowledge patterns
    const knowledgePatterns = this.store.aggregate('type');
    for (const [type, data] of Object.entries(knowledgePatterns)) {
      if (data.count > 10) {
        // High-volume type - suggest dedicated consumer
        const matchingConsumers = Array.from(this.consumers.keys())
          .filter(name => name.toLowerCase().includes(type.toLowerCase()));
        
        if (matchingConsumers.length === 0) {
          suggestions.push({
            issue: 'unconsumed-knowledge-type',
            details: { type, count: data.count },
            action: `Consider adding a consumer for ${type} knowledge`
          });
        }
      }
    }
    
    return {
      bottlenecks,
      suggestions,
      currentMetrics: this.metrics
    };
  }
  
  /**
   * Pause knowledge flow
   */
  pause() {
    this.status = FLOW_STATUS.PAUSED;
    this.emit('paused');
  }
  
  /**
   * Resume knowledge flow
   */
  resume() {
    this.status = FLOW_STATUS.ACTIVE;
    this.emit('resumed');
  }
  
  /**
   * Get flow status
   * @returns {object} Status
   */
  getStatus() {
    return {
      status: this.status,
      producerCount: this.producers.size,
      consumerCount: this.consumers.size,
      connectionCount: this.connections.filter(c => c.active).length,
      metrics: this.metrics,
      storeStats: this.store.getStats()
    };
  }
  
  /**
   * Create standard flow configuration
   * @returns {KnowledgeFlow} Configured flow instance
   */
  static createStandardFlow() {
    const flow = new KnowledgeFlow();
    
    // Register standard producers
    const { PatternLearningProducer, DebugThinkingProducer, ClaudeceptionProducer, ValidationProducer } = 
      require('./producer');
    
    flow.registerProducer('pattern-learning', new PatternLearningProducer());
    flow.registerProducer('debug-thinking', new DebugThinkingProducer());
    flow.registerProducer('claudeception', new ClaudeceptionProducer());
    flow.registerProducer('validation', new ValidationProducer());
    
    // Register standard consumers
    const { PromptEnhancerConsumer, ComplexityPredictorConsumer, PlannerConsumer } = 
      require('./consumer');
    
    flow.registerConsumer('prompt-enhancer', new PromptEnhancerConsumer());
    flow.registerConsumer('complexity-predictor', new ComplexityPredictorConsumer());
    flow.registerConsumer('planner', new PlannerConsumer());
    
    // Create connections
    flow.connect('pattern-learning', ['prompt-enhancer', 'planner']);
    flow.connect('debug-thinking', ['complexity-predictor', 'prompt-enhancer']);
    flow.connect('claudeception', ['prompt-enhancer', 'complexity-predictor']);
    flow.connect('validation', ['complexity-predictor']);
    
    return flow;
  }
}

module.exports = { KnowledgeFlow, FLOW_STATUS };
