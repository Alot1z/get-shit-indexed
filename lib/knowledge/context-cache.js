/**
 * @fileoverview Context cache module
 * Provides LRU and tiered caching for context
 * Part of Phase 50C: Knowledge System Integration
 */

/**
 * Create LRU cache
 * @param {object} options - Cache options
 * @returns {object} Cache instance
 */
function createLRUCache(options = {}) {
  const { maxSize = 100, ttl = null } = options;

  let cache = new Map();
  let hits = 0;
  let misses = 0;

  return {
    /**
     * Set cache value
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     */
    set(key, value) {
      // Evict oldest if at capacity
      if (cache.size >= maxSize && !cache.has(key)) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }

      cache.set(key, {
        value,
        added: Date.now(),
        expires: ttl ? Date.now() + ttl : null,
        accesses: 0
      });
    },

    /**
     * Get cache value
     * @param {string} key - Cache key
     * @returns {*} Cached value or undefined
     */
    get(key) {
      if (!cache.has(key)) {
        misses++;
        return undefined;
      }

      const entry = cache.get(key);

      // Check TTL
      if (entry.expires && Date.now() > entry.expires) {
        cache.delete(key);
        misses++;
        return undefined;
      }

      // Update access count and move to end
      entry.accesses++;
      cache.delete(key);
      cache.set(key, entry);

      hits++;
      return entry.value;
    },

    /**
     * Check if key exists
     * @param {string} key - Cache key
     * @returns {boolean} True if exists
     */
    has(key) {
      if (!cache.has(key)) return false;

      const entry = cache.get(key);
      if (entry.expires && Date.now() > entry.expires) {
        cache.delete(key);
        return false;
      }

      return true;
    },

    /**
     * Delete cache entry
     * @param {string} key - Cache key
     * @returns {boolean} True if deleted
     */
    delete(key) {
      return cache.delete(key);
    },

    /**
     * Clear cache
     */
    clear() {
      cache.clear();
      hits = 0;
      misses = 0;
    },

    /**
     * Get cache size
     * @returns {number} Number of entries
     */
    size() {
      return cache.size;
    },

    /**
     * Get cache statistics
     * @returns {object} Statistics
     */
    getStats() {
      const total = hits + misses;
      return {
        size: cache.size,
        maxSize,
        hits,
        misses,
        hitRate: total > 0 ? hits / total : 0
      };
    }
  };
}

/**
 * Create tiered cache with hot/warm/cold layers
 * @param {object} options - Cache options
 * @returns {object} Tiered cache instance
 */
function createTieredCache(options = {}) {
  const {
    tiers = [
      { name: 'hot', maxSize: 10 },
      { name: 'warm', maxSize: 50 },
      { name: 'cold', maxSize: 100 }
    ]
  } = options;

  const tierCaches = tiers.map(tier => ({
    name: tier.name,
    maxSize: tier.maxSize,
    cache: createLRUCache({ maxSize: tier.maxSize }),
    promotionThreshold: tier.promotionThreshold || 3
  }));

  const accessCounts = new Map();

  return {
    /**
     * Set value in appropriate tier
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     */
    set(key, value) {
      // Start in warm tier (middle)
      const warmTier = tierCaches[1] || tierCaches[0];
      warmTier.cache.set(key, value);
      accessCounts.set(key, 0);
    },

    /**
     * Get value from cache
     * @param {string} key - Cache key
     * @returns {*} Cached value
     */
    get(key) {
      for (const tier of tierCaches) {
        if (tier.cache.has(key)) {
          const value = tier.cache.get(key);
          
          // Update access count
          const count = (accessCounts.get(key) || 0) + 1;
          accessCounts.set(key, count);

          // Check for promotion
          this._checkPromotion(key, tier);

          return value;
        }
      }
      return undefined;
    },

    /**
     * Check and promote item if needed
     * @param {string} key - Cache key
     * @param {object} currentTier - Current tier
     */
    _checkPromotion(key, currentTier) {
      const count = accessCounts.get(key) || 0;
      const tierIndex = tierCaches.indexOf(currentTier);

      // Promote to higher tier (lower index)
      if (tierIndex > 0 && count >= currentTier.promotionThreshold) {
        const higherTier = tierCaches[tierIndex - 1];
        const entry = currentTier.cache.get(key);

        if (entry !== undefined) {
          higherTier.cache.set(key, entry);
          currentTier.cache.delete(key);
        }
      }
    },

    /**
     * Get cache statistics
     * @returns {object} Statistics
     */
    getStats() {
      const tierStats = tierCaches.map(tier => ({
        name: tier.name,
        ...tier.cache.getStats()
      }));

      const totalItems = tierStats.reduce((sum, t) => sum + t.size, 0);

      return {
        tiers: tierStats,
        totalItems
      };
    }
  };
}

/**
 * Get cache statistics
 * @param {object} cache - Cache instance
 * @returns {object} Statistics
 */
function getCacheStats(cache) {
  const stats = cache.getStats();
  return {
    size: stats.size,
    maxSize: stats.maxSize,
    utilization: stats.maxSize > 0 ? stats.size / stats.maxSize : 0,
    hitRate: stats.hitRate
  };
}

/**
 * Clear cache
 * @param {object} cache - Cache instance
 */
function clearCache(cache) {
  cache.clear();
}

/**
 * Optimize cache size based on usage
 * @param {object} cache - Cache instance
 * @returns {object} Recommendation
 */
function optimizeCacheSize(cache) {
  const stats = cache.getStats();
  const { size, maxSize, hitRate } = stats;

  let recommendation = {
    currentSize: maxSize,
    recommendedSize: maxSize,
    reason: 'Current size is optimal'
  };

  // Low hit rate suggests cache is too small
  if (hitRate < 0.5 && size >= maxSize) {
    recommendation.recommendedSize = Math.floor(maxSize * 1.5);
    recommendation.reason = 'Low hit rate suggests increasing cache size';
  }
  // Low utilization suggests cache is too large
  else if (size < maxSize * 0.5) {
    recommendation.recommendedSize = Math.floor(maxSize * 0.75);
    recommendation.reason = 'Low utilization suggests decreasing cache size';
  }

  return recommendation;
}

module.exports = {
  createLRUCache,
  createTieredCache,
  getCacheStats,
  clearCache,
  optimizeCacheSize
};
