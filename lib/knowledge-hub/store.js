/**
 * Knowledge Store
 * 
 * Persistent storage for knowledge items with indexing and retrieval.
 * Supports querying, aggregation, and knowledge lifecycle management.
 * 
 * @module lib/knowledge-hub/store
 */

const fs = require('fs');
const path = require('path');

/**
 * Storage configuration
 */
const DEFAULT_CONFIG = {
  storagePath: '.planning/knowledge',
  maxItems: 5000,
  ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
  indexFields: ['type', 'source', 'timestamp']
};

/**
 * Knowledge Store Class
 * Persistent storage with indexing
 */
class KnowledgeStore {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.items = new Map();
    this.indexes = new Map();
    this.stats = {
      totalItems: 0,
      itemsByType: {},
      itemsBySource: {},
      lastCleanup: null
    };
    
    // Initialize indexes
    for (const field of this.config.indexFields) {
      this.indexes.set(field, new Map());
    }
    
    // Load existing data
    this.load();
  }
  
  /**
   * Store a knowledge item
   * @param {object} knowledge - Knowledge to store
   * @returns {object} Stored knowledge with ID
   */
  store(knowledge) {
    const id = knowledge.id || this.generateId();
    const item = {
      ...knowledge,
      id,
      storedAt: new Date().toISOString()
    };
    
    // Store in main map
    this.items.set(id, item);
    
    // Update indexes
    this.indexItem(item);
    
    // Update stats
    this.updateStats(item, 'add');
    
    // Check for cleanup
    if (this.items.size > this.config.maxItems) {
      this.cleanup();
    }
    
    return item;
  }
  
  /**
   * Retrieve a knowledge item by ID
   * @param {string} id - Knowledge ID
   * @returns {object|null} Knowledge item
   */
  get(id) {
    return this.items.get(id) || null;
  }
  
  /**
   * Query knowledge items
   * @param {object} criteria - Query criteria
   * @returns {Array} Matching items
   */
  query(criteria = {}) {
    let results = Array.from(this.items.values());
    
    // Filter by indexed fields first (faster)
    for (const field of this.config.indexFields) {
      if (criteria[field]) {
        const index = this.indexes.get(field);
        const matchingIds = index.get(criteria[field]) || new Set();
        results = results.filter(item => matchingIds.has(item.id));
        delete criteria[field];
      }
    }
    
    // Filter by remaining criteria
    for (const [key, value] of Object.entries(criteria)) {
      if (key === 'since') {
        results = results.filter(item => 
          new Date(item.timestamp) >= new Date(value)
        );
      } else if (key === 'before') {
        results = results.filter(item => 
          new Date(item.timestamp) <= new Date(value)
        );
      } else if (key === 'search') {
        const searchLower = value.toLowerCase();
        results = results.filter(item => 
          JSON.stringify(item).toLowerCase().includes(searchLower)
        );
      } else if (typeof value === 'object' && value.regex) {
        const regex = new RegExp(value.regex, value.flags || 'i');
        results = results.filter(item => regex.test(JSON.stringify(item)));
      } else {
        results = results.filter(item => item[key] === value);
      }
    }
    
    return results;
  }
  
  /**
   * Get aggregated statistics
   * @param {string} groupBy - Field to group by
   * @returns {object} Aggregated stats
   */
  aggregate(groupBy = 'type') {
    const groups = {};
    
    for (const item of this.items.values()) {
      const key = item[groupBy] || 'unknown';
      if (!groups[key]) {
        groups[key] = { count: 0, items: [] };
      }
      groups[key].count++;
      groups[key].items.push(item.id);
    }
    
    return groups;
  }
  
  /**
   * Index a knowledge item
   * @param {object} item - Item to index
   */
  indexItem(item) {
    for (const field of this.config.indexFields) {
      const index = this.indexes.get(field);
      const value = item[field];
      
      if (value) {
        if (!index.has(value)) {
          index.set(value, new Set());
        }
        index.get(value).add(item.id);
      }
    }
  }
  
  /**
   * Remove item from indexes
   * @param {object} item - Item to de-index
   */
  deindexItem(item) {
    for (const field of this.config.indexFields) {
      const index = this.indexes.get(field);
      const value = item[field];
      
      if (value && index.has(value)) {
        index.get(value).delete(item.id);
        if (index.get(value).size === 0) {
          index.delete(value);
        }
      }
    }
  }
  
  /**
   * Update internal statistics
   * @param {object} item - Item being added/removed
   * @param {string} action - 'add' or 'remove'
   */
  updateStats(item, action) {
    const delta = action === 'add' ? 1 : -1;
    
    this.stats.totalItems += delta;
    
    // Update type counts
    if (item.type) {
      this.stats.itemsByType[item.type] = 
        (this.stats.itemsByType[item.type] || 0) + delta;
      if (this.stats.itemsByType[item.type] <= 0) {
        delete this.stats.itemsByType[item.type];
      }
    }
    
    // Update source counts
    if (item.source) {
      this.stats.itemsBySource[item.source] = 
        (this.stats.itemsBySource[item.source] || 0) + delta;
      if (this.stats.itemsBySource[item.source] <= 0) {
        delete this.stats.itemsBySource[item.source];
      }
    }
  }
  
  /**
   * Cleanup old items
   */
  cleanup() {
    const cutoff = new Date(Date.now() - this.config.ttl);
    const toRemove = [];
    
    for (const [id, item] of this.items) {
      if (new Date(item.timestamp) < cutoff) {
        toRemove.push(id);
      }
    }
    
    for (const id of toRemove) {
      const item = this.items.get(id);
      this.deindexItem(item);
      this.updateStats(item, 'remove');
      this.items.delete(id);
    }
    
    this.stats.lastCleanup = new Date().toISOString();
  }
  
  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `kno-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Persist to disk
   */
  save() {
    const storageDir = this.config.storagePath;
    
    // Ensure directory exists
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    
    // Save items
    const data = {
      items: Array.from(this.items.entries()),
      stats: this.stats,
      savedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(storageDir, 'knowledge-store.json'),
      JSON.stringify(data, null, 2)
    );
  }
  
  /**
   * Load from disk
   */
  load() {
    const storePath = path.join(this.config.storagePath, 'knowledge-store.json');
    
    if (!fs.existsSync(storePath)) {
      return;
    }
    
    try {
      const data = JSON.parse(fs.readFileSync(storePath, 'utf8'));
      
      // Restore items
      for (const [id, item] of data.items || []) {
        this.items.set(id, item);
        this.indexItem(item);
      }
      
      // Restore stats
      if (data.stats) {
        this.stats = { ...this.stats, ...data.stats };
      }
    } catch (error) {
      console.warn('Failed to load knowledge store:', error.message);
    }
  }
  
  /**
   * Get store statistics
   * @returns {object} Stats
   */
  getStats() {
    return {
      ...this.stats,
      indexStats: Object.fromEntries(
        Array.from(this.indexes.entries()).map(([field, index]) => [
          field,
          index.size
        ])
      )
    };
  }
  
  /**
   * Clear all knowledge
   */
  clear() {
    this.items.clear();
    for (const index of this.indexes.values()) {
      index.clear();
    }
    this.stats = {
      totalItems: 0,
      itemsByType: {},
      itemsBySource: {},
      lastCleanup: null
    };
  }
}

module.exports = { KnowledgeStore, DEFAULT_CONFIG };
