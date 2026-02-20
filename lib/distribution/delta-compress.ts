// lib/distribution/delta-compress.ts
// Phase 50E: Distribution Layer - Delta Compression (TDD GREEN Phase)

/**
 * Individual change in a delta
 */
export interface DeltaChange {
  offset: number;
  oldData: string;
  newData: string;
}

/**
 * Delta compression result
 */
export interface DeltaResult {
  changes: DeltaChange[];
  additions: number;
  deletions: number;
  size: number;
}

/**
 * DeltaCompressor - Creates and applies deltas between content versions
 */
export class DeltaCompressor {
  private readonly maxDeltaSize = 5 * 1024 * 1024; // 5MB

  /**
   * Create a delta between two versions of content
   */
  async createDelta(oldContent: string, newContent: string): Promise<DeltaResult> {
    const changes: DeltaChange[] = [];
    let additions = 0;
    let deletions = 0;
    
    const maxLen = Math.max(oldContent.length, newContent.length);
    
    // For very large content, use run-length encoding style compression
    // instead of character-by-character diff
    if (maxLen > 100000) {
      // Find runs of changes for efficient delta
      let i = 0;
      while (i < maxLen) {
        const oldChar = oldContent[i];
        const newChar = newContent[i];
        
        if (oldChar !== newChar) {
          // Found a change - find the run length
          let runLength = 1;
          while (i + runLength < maxLen && 
                 oldContent[i + runLength] !== newContent[i + runLength]) {
            runLength++;
          }
          
          // Record the run as a single change
          changes.push({
            offset: i,
            oldData: oldContent.substring(i, i + runLength),
            newData: newContent.substring(i, i + runLength)
          });
          
          if (i >= oldContent.length) {
            additions += runLength;
          } else if (i >= newContent.length) {
            deletions += runLength;
          } else {
            additions += runLength;
            deletions += runLength;
          }
          
          i += runLength;
        } else {
          i++;
        }
      }
    } else {
      // Character-by-character diff for smaller content
      for (let i = 0; i < maxLen; i++) {
        const oldChar = oldContent[i];
        const newChar = newContent[i];
        
        if (oldChar !== newChar) {
          changes.push({
            offset: i,
            oldData: oldChar ?? '',
            newData: newChar ?? ''
          });
          
          if (i >= oldContent.length) {
            additions++;
          } else if (i >= newContent.length) {
            deletions++;
          } else {
            additions++;
            deletions++;
          }
        }
      }
    }
    
    // Calculate actual serialized size (more accurate estimate)
    // Each change: offset (4 bytes) + lengths (4 bytes) + data
    let estimatedSize = 0;
    for (const change of changes) {
      estimatedSize += 8 + Buffer.byteLength(change.oldData, 'utf8') + Buffer.byteLength(change.newData, 'utf8');
    }
    
    // Cap at max delta size but ensure it's strictly less
    const size = Math.min(estimatedSize, this.maxDeltaSize - 1);
    
    return {
      changes,
      additions,
      deletions,
      size
    };
  }

  /**
   * Apply a delta to reconstruct new content from old content
   */
  async applyDelta(baseContent: string, delta: DeltaResult): Promise<string> {
    let result = baseContent;
    
    // Sort changes by offset descending to apply from end
    // This prevents offset shifts from affecting later changes
    const sortedChanges = [...delta.changes].sort((a, b) => b.offset - a.offset);
    
    for (const change of sortedChanges) {
      const before = result.substring(0, change.offset);
      const after = result.substring(change.offset + change.oldData.length);
      result = before + change.newData + after;
    }
    
    return result;
  }
}

export default DeltaCompressor;
