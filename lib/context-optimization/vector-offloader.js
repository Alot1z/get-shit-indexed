/**
 * Vector Offloader
 * 
 * Offloads large context to simulated vector storage.
 * Enables similarity search and on-demand retrieval.
 * 
 * Note: This is a simplified implementation that simulates vector storage.
 * For production use, integrate with actual vector databases.
 */

class VectorOffloader {
  constructor(config = {}) {
    this.config = {
      maxMemorySize: config.maxMemorySize || 10 * 1024 * 1024, // 10MB
      chunkSize: config.chunkSize || 500, // tokens per chunk
      overlapSize: config.overlapSize || 50, // token overlap
      enableSimilarity: config.enableSimilarity ?? true,
      ...config
    };
    
    // In-memory vector store (simulated)
    this.store = new Map();
    this.chunks = [];
    this.embeddings = [];
    
    this.stats = {
      offloads: 0,
      retrievals: 0,
      chunksCreated: 0,
      similaritySearches: 0,
      averageChunkSize: 0
    };
  }
  
  /**
   * Offload context to vector storage
   * @param {object|string} context - Context to offload
   * @param {object} options - Offload options
   * @returns {Promise<object>} Offload result with retrieval reference
   */
  async offload(context, options = {}) {
    const startTime = Date.now();
    const targetTokens = options.targetTokens;
    const preserveKeys = options.preserveKey || [];
    
    // Convert to string if needed
    const contentStr = typeof context === 'string' 
      ? context 
      : JSON.stringify(context, null, 2);
    
    const totalTokens = this._estimateTokens(contentStr);
    
    // Extract preserved content
    const preserved = this._extractPreserved(context, preserveKeys);
    const preservedTokens = this._estimateTokens(JSON.stringify(preserved));
    
    // Calculate what needs to be offloaded
    const offloadableTokens = totalTokens - preservedTokens;
    const retainedTokens = targetTokens ? Math.min(targetTokens, preservedTokens + 500) : preservedTokens + 500;
    
    // Create chunks for offloading
    const chunks = this._createChunks(contentStr, preserveKeys);
    
    // Store chunks with generated IDs
    const referenceId = `offload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const storedChunks = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunkId = `${referenceId}-chunk-${i}`;
      const embedding = this._generateEmbedding(chunks[i]);
      
      this.store.set(chunkId, {
        id: chunkId,
        content: chunks[i],
        embedding,
        index: i,
        parentId: referenceId,
        tokens: this._estimateTokens(chunks[i]),
        createdAt: Date.now()
      });
      
      this.chunks.push(chunkId);
      this.embeddings.push(embedding);
      
      storedChunks.push({
        id: chunkId,
        index: i,
        tokens: this._estimateTokens(chunks[i])
      });
      
      this.stats.chunksCreated++;
    }
    
    // Update stats
    this.stats.offloads++;
    const prevAvg = this.stats.averageChunkSize;
    const prevCount = this.stats.offloads - 1;
    this.stats.averageChunkSize = 
      (prevAvg * prevCount + (totalTokens / chunks.length)) / this.stats.offloads;
    
    // Create retained context
    const retained = {
      ...preserved,
      _offloaded: {
        referenceId,
        chunkCount: chunks.length,
        totalTokens,
        offloadedTokens: offloadableTokens,
        retainedTokens
      }
    };
    
    return {
      reference: {
        id: referenceId,
        chunks: storedChunks,
        chunkCount: chunks.length,
        totalTokens,
        offloadedTokens: offloadableTokens
      },
      retained,
      stats: {
        chunksCreated: chunks.length,
        tokensOffloaded: offloadableTokens,
        tokensRetained: retainedTokens,
        compressionRatio: retainedTokens / totalTokens,
        duration: Date.now() - startTime
      }
    };
  }
  
  /**
   * Retrieve context from vector storage
   * @param {string} query - Query for retrieval
   * @param {object} options - Retrieval options
   * @returns {Promise<array>} Retrieved context chunks
   */
  async retrieve(query, options = {}) {
    const startTime = Date.now();
    const limit = options.limit || 5;
    const threshold = options.threshold || 0.5;
    
    this.stats.retrievals++;
    
    // If query is a reference ID, retrieve all chunks
    if (query.startsWith('offload-') && !query.includes('chunk-')) {
      return this._retrieveById(query, options);
    }
    
    // Otherwise, do similarity search
    this.stats.similaritySearches++;
    
    const queryEmbedding = this._generateEmbedding(query);
    const similarities = [];
    
    for (const chunkId of this.chunks) {
      const chunk = this.store.get(chunkId);
      if (chunk && chunk.embedding) {
        const similarity = this._cosineSimilarity(queryEmbedding, chunk.embedding);
        if (similarity >= threshold) {
          similarities.push({
            chunkId,
            similarity,
            content: chunk.content,
            tokens: chunk.tokens
          });
        }
      }
    }
    
    // Sort by similarity and limit
    similarities.sort((a, b) => b.similarity - a.similarity);
    const results = similarities.slice(0, limit);
    
    return {
      query,
      results,
      totalFound: similarities.length,
      returned: results.length,
      duration: Date.now() - startTime
    };
  }
  
  /**
   * Retrieve all chunks by reference ID
   * @private
   */
  _retrieveById(referenceId, options = {}) {
    const chunks = [];
    
    for (const chunkId of this.chunks) {
      if (chunkId.startsWith(referenceId)) {
        const chunk = this.store.get(chunkId);
        if (chunk) {
          chunks.push({
            chunkId,
            index: chunk.index,
            content: chunk.content,
            tokens: chunk.tokens
          });
        }
      }
    }
    
    // Sort by index
    chunks.sort((a, b) => a.index - b.index);
    
    return {
      referenceId,
      results: chunks,
      totalFound: chunks.length,
      duration: 0
    };
  }
  
  /**
   * Create chunks from content
   * @private
   */
  _createChunks(content, preserveKeys) {
    const chunks = [];
    const lines = content.split('\n');
    
    let currentChunk = [];
    let currentTokens = 0;
    
    for (const line of lines) {
      const lineTokens = this._estimateTokens(line);
      
      // Check if line should be preserved (not offloaded)
      let shouldPreserve = false;
      for (const key of preserveKeys) {
        if (line.toLowerCase().includes(key.toLowerCase())) {
          shouldPreserve = true;
          break;
        }
      }
      
      if (shouldPreserve) {
        // Skip preserved content
        continue;
      }
      
      if (currentTokens + lineTokens > this.config.chunkSize && currentChunk.length > 0) {
        // Save current chunk
        chunks.push(currentChunk.join('\n'));
        
        // Start new chunk with overlap
        const overlapLines = currentChunk.slice(-Math.ceil(this.config.overlapSize / 10));
        currentChunk = [...overlapLines, line];
        currentTokens = this._estimateTokens(overlapLines.join('\n')) + lineTokens;
      } else {
        currentChunk.push(line);
        currentTokens += lineTokens;
      }
    }
    
    // Don't forget the last chunk
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n'));
    }
    
    return chunks;
  }
  
  /**
   * Extract preserved content from context
   * @private
   */
  _extractPreserved(context, preserveKeys) {
    if (typeof context === 'string') {
      return { preserved: true };
    }
    
    const preserved = {};
    
    for (const key of preserveKeys) {
      if (context[key] !== undefined) {
        preserved[key] = context[key];
      }
    }
    
    return preserved;
  }
  
  /**
   * Generate embedding for content (simplified)
   * @private
   */
  _generateEmbedding(content) {
    // Simplified embedding: character frequency vector
    // In production, use actual embedding model
    
    const vector = new Array(128).fill(0);
    const str = content.toLowerCase();
    
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const index = charCode % 128;
      vector[index] += 1;
    }
    
    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    return vector.map(v => v / (magnitude || 1));
  }
  
  /**
   * Calculate cosine similarity between vectors
   * @private
   */
  _cosineSimilarity(a, b) {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    
    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);
    
    return dotProduct / (magA * magB || 1);
  }
  
  /**
   * Estimate tokens
   * @private
   */
  _estimateTokens(content) {
    return Math.ceil(content.length / 4);
  }
  
  /**
   * Get vector store statistics
   * @returns {object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      storeSize: this.store.size,
      chunkCount: this.chunks.length,
      memoryUsage: this._estimateMemoryUsage()
    };
  }
  
  /**
   * Estimate memory usage
   * @private
   */
  _estimateMemoryUsage() {
    let size = 0;
    for (const [key, value] of this.store) {
      size += key.length * 2;
      size += value.content.length * 2;
      size += value.embedding.length * 8;
    }
    return size;
  }
  
  /**
   * Clear vector index
   */
  clearIndex() {
    this.store.clear();
    this.chunks = [];
    this.embeddings = [];
  }
  
  /**
   * Delete chunks by reference ID
   * @param {string} referenceId - Reference ID to delete
   */
  deleteByReference(referenceId) {
    const toDelete = this.chunks.filter(id => id.startsWith(referenceId));
    
    for (const chunkId of toDelete) {
      this.store.delete(chunkId);
    }
    
    this.chunks = this.chunks.filter(id => !id.startsWith(referenceId));
  }
}

module.exports = { VectorOffloader };
