/**
 * Context Cache
 * 
 * LRU cache for frequently-used context with TTL support.
 * Provides significant token savings by avoiding redundant reads.
 */

class ContextCache {
  constructor(config = {}) {
    this.config = {
      maxSize: config.maxSize || 100 * 1024 * 1024, // 100MB
      maxEntries: config.maxEntries || 1000,
      defaultTTL: config.defaultTTL || 300000, // 5 minutes
      enableStats: config.enableStats ?? true,
      ...config
    };
    
    this.cache = new Map();
    this.accessOrder = [];
    this.currentSize = 0;
    
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      expirations: 0,
      sets: 0,
      sizeEvictions: 0
    };
  }
  
  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }
    
    // Check TTL
    if (entry.expires && Date.now() > entry.expires) {
      this.delete(key);
      this.stats.expirations++;
      this.stats.misses++;
      return undefined;
    }
    
    // Update access order
    this._updateAccessOrder(key);
    
    // Update entry stats
    entry.accessCount++;
    entry.lastAccess = Date.now();
    
    this.stats.hits++;
    
    return entry.value;
  }
  
  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {object} options - Cache options
   */
  set(key, value, options = {}) {
    // Estimate size
    const size = this._estimateSize(value);
    
    // Check if we need to evict
    while (
      this.currentSize + size > this.config.maxSize ||
      this.cache.size >= this.config.maxEntries
    ) {
      this._evictLRU();
    }
    
    // Calculate expiration
    const ttl = options.ttl || this.config.defaultTTL;
    const expires = ttl > 0 ? Date.now() + ttl : null;
    
    // Create entry
    const entry = {
      value,
      size,
      created: Date.now(),
      expires,
      accessCount: 0,
      lastAccess: Date.now(),
      tags: options.tags || []
    };
    
    // Remove old entry if exists
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key);
      this.currentSize -= oldEntry.size;
    }
    
    // Set new entry
    this.cache.set(key, entry);
    this.currentSize += size;
    this._updateAccessOrder(key);
    
    this.stats.sets++;
    
    return true;
  }
  
  /**
   * Check if key exists
   * @param {string} key - Cache key
   * @returns {boolean} True if exists and not expired
   */
  has(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    if (entry.expires && Date.now() > entry.expires) {
      this.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete entry from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    const entry = this.cache.get(key);
    
    if (entry) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
      
      // Remove from access order
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
    }
  }
  
  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
    this.accessOrder = [];
    this.currentSize = 0;
  }
  
  /**
   * Get number of entries in cache
   * @returns {number} Number of entries
   */
  size() {
    return this.cache.size;
  }
  
  /**
   * Get entries by tag
   * @param {string} tag - Tag to search for
   * @returns {array} Entries with matching tag
   */
  getByTag(tag) {
    const results = [];
    
    for (const [key, entry] of this.cache) {
      if (entry.tags.includes(tag)) {
        results.push({ key, value: entry.value });
      }
    }
    
    return results;
  }
  
  /**
   * Invalidate entries by tag
   * @param {string} tag - Tag to invalidate
   */
  invalidateByTag(tag) {
    for (const [key, entry] of this.cache) {
      if (entry.tags.includes(tag)) {
        this.delete(key);
      }
    }
  }
  
  /**
   * Warm cache with entries
   * @param {array} entries - Array of {key, value, options}
   */
  warm(entries) {
    for (const { key, value, options } of entries) {
      this.set(key, value, options);
    }
  }
  
  /**
   * Get cache statistics
   * @returns {object} Statistics
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? this.stats.hits / (this.stats.hits + this.stats.misses)
      : 0;
    
    return {
      ...this.stats,
      entries: this.cache.size,
      sizeBytes: this.currentSize,
      sizeMB: Math.round(this.currentSize / (1024 * 1024) * 100) / 100,
      maxSizeMB: Math.round(this.config.maxSize / (1024 * 1024)),
      hitRate: Math.round(hitRate * 100),
      accessOrderLength: this.accessOrder.length
    };
  }
  
  /**
   * Update access order for LRU
   * @private
   */
  _updateAccessOrder(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }
  
  /**
   * Evict least recently used entry
   * @private
   */
  _evictLRU() {
    if (this.accessOrder.length === 0) return;
    
    const key = this.accessOrder.shift();
    const entry = this.cache.get(key);
    
    if (entry) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
      this.stats.evictions++;
      this.stats.sizeEvictions++;
    }
  }
  
  /**
   * Estimate size of value
   * @private
   */
  _estimateSize(value) {
    if (value === null || value === undefined) {
      return 8;
    }
    
    if (typeof value === 'string') {
      return value.length * 2; // UTF-16
    }
    
    if (typeof value === 'number') {
      return 8;
    }
    
    if (typeof value === 'boolean') {
      return 4;
    }
    
    if (Buffer.isBuffer(value)) {
      return value.length;
    }
    
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value).length * 2;
      } catch (e) {
        return 1024; // Default for unstringifiable objects
      }
    }
    
    return 64; // Default
  }
  
  /**
   * Get entry metadata
   * @param {string} key - Cache key
   * @returns {object|null} Entry metadata
   */
  getMeta(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    return {
      size: entry.size,
      created: entry.created,
      expires: entry.expires,
      accessCount: entry.accessCount,
      lastAccess: entry.lastAccess,
      tags: entry.tags
    };
  }
}

module.exports = { ContextCache };
