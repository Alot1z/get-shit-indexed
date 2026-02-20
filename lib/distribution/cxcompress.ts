// lib/distribution/cxcompress.ts
// Phase 50E: Distribution Layer - Context Compression (TDD GREEN Phase)
import { gzipSync, gunzipSync, brotliCompressSync, brotliDecompressSync } from 'bun';

/**
 * Compression analysis result
 */
export interface CompressionAnalysis {
  repetitionScore: number;
  recommendedAlgorithm: string;
  isStructured: boolean;
  structureType: string;
  estimatedRatio: number;
}

/**
 * Compression result
 */
export interface CompressionResult {
  compressed: Buffer;
  ratio: number;
  algorithm: string;
  success: boolean;
}

/**
 * Compression options
 */
export interface CompressionOptions {
  algorithm?: 'gzip' | 'brotli' | 'lz77';
}

/**
 * CXcompressAnalyzer - Analyzes content for compression optimization
 */
export class CXcompressAnalyzer {
  /**
   * Analyze content to determine optimal compression strategy
   */
  analyze(content: string): CompressionAnalysis {
    // Check for repeated line patterns (more accurate for multi-line content)
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    const uniqueLines = new Set(lines);
    
    // Calculate repetition based on non-empty lines
    let repetitionScore = 0;
    if (lines.length > 0) {
      repetitionScore = 1 - (uniqueLines.size / lines.length);
    }
    
    // Also check for repeated substrings for better pattern detection
    const trimmedContent = content.trim();
    if (trimmedContent.length > 0) {
      // Check if the content has repeated substrings
      const lines3 = trimmedContent.split('\n');
      if (lines3.length >= 3) {
        // For content like "pattern\npattern\npattern", repetition is high
        const firstLine = lines3[0].trim();
        const matchingLines = lines3.filter(l => l.trim() === firstLine).length;
        if (matchingLines >= 2) {
          repetitionScore = Math.max(repetitionScore, matchingLines / lines3.length);
        }
      }
    }
    
    // Check for structure
    let isStructured = false;
    let structureType = 'none';
    
    // Try JSON parse
    try {
      JSON.parse(content);
      isStructured = true;
      structureType = 'json';
    } catch {
      // Not JSON, check for other patterns
      if (content.includes('<?xml') || content.includes('<')) {
        isStructured = true;
        structureType = 'xml';
      } else if (content.includes('---') && content.includes(':')) {
        isStructured = true;
        structureType = 'yaml';
      }
    }
    
    // Calculate estimated compression ratio
    // Highly repetitive content compresses better
    let estimatedRatio = repetitionScore * 0.9;
    
    // Single character runs compress very well
    if (/^(.)\1+$/.test(content.replace(/\s/g, ''))) {
      estimatedRatio = 0.95;
    }
    
    // Structured content typically compresses 60-80%
    if (isStructured) {
      estimatedRatio = Math.max(estimatedRatio, 0.6);
    }
    
    return {
      repetitionScore,
      recommendedAlgorithm: repetitionScore > 0.3 ? 'lz77' : 'gzip',
      isStructured,
      structureType,
      estimatedRatio
    };
  }
}

/**
 * CXcompressor - Compresses and decompresses content using various algorithms
 */
export class CXcompressor {
  /**
   * Compress content using specified algorithm
   */
  async compress(content: string, options: CompressionOptions = {}): Promise<CompressionResult> {
    const algorithm = options.algorithm ?? 'gzip';
    // Use utf8 for proper text handling
    const buffer = Buffer.from(content, 'utf8');
    
    // Handle empty content
    if (buffer.length === 0) {
      return {
        compressed: Buffer.alloc(0),
        ratio: 0,
        algorithm,
        success: true
      };
    }
    
    let compressed: Buffer;
    
    try {
      switch (algorithm) {
        case 'brotli':
          compressed = brotliCompressSync(buffer);
          break;
        case 'lz77':
          // Fall back to gzip for LZ77 simulation
          compressed = gzipSync(buffer);
          break;
        case 'gzip':
        default:
          compressed = gzipSync(buffer);
          break;
      }
      
      const ratio = 1 - (compressed.length / buffer.length);
      
      return {
        compressed,
        ratio: Math.max(0, ratio),
        algorithm,
        success: true
      };
    } catch (error) {
      return {
        compressed: Buffer.alloc(0),
        ratio: 0,
        algorithm,
        success: false
      };
    }
  }

  /**
   * Decompress content using specified algorithm
   */
  async decompress(compressed: Buffer, algorithm: string = 'gzip'): Promise<string> {
    if (compressed.length === 0) {
      return '';
    }
    
    let decompressed: Buffer | Uint8Array;
    
    switch (algorithm) {
      case 'brotli':
        decompressed = brotliDecompressSync(compressed);
        break;
      case 'lz77':
      case 'gzip':
      default:
        decompressed = gunzipSync(compressed);
        break;
    }
    
    // Bun returns Uint8Array, convert to Buffer if needed
    const buffer = Buffer.isBuffer(decompressed) ? decompressed : Buffer.from(decompressed);
    
    // Use utf8 for proper text handling
    return buffer.toString('utf8');
  }
}

export default CXcompressor;
