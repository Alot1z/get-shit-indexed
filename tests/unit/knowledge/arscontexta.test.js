/**
 * @fileoverview Tests for arscontexta context management module
 * Part of Phase 50C: Knowledge System Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  analyzeArscontexta,
  createContextManager,
  createPriorityContext,
  manageContextWindow,
  compressContext as arsCompressContext,
  decompressContext,
  prioritizeContextItems,
  createContextCache,
  validateContextIntegrity
} from '../../../lib/knowledge/arscontexta';

describe('Arscontexta Context Management Module', () => {
  describe('analyzeArscontexta', () => {
    it('should return architecture analysis', async () => {
      const analysis = await analyzeArscontexta();
      
      expect(analysis).toBeDefined();
      expect(analysis.approach).toBe('priority-based-context');
      expect(analysis.features).toContain('context-lifecycle');
      expect(analysis.features).toContain('token-management');
      expect(analysis.features).toContain('priority-queue');
      expect(analysis.analyzed).toBeDefined();
    });
  });

  describe('createContextManager', () => {
    it('should create context manager with default options', () => {
      const manager = createContextManager();
      
      expect(manager).toBeDefined();
      expect(typeof manager.addContext).toBe('function');
      expect(typeof manager.getContext).toBe('function');
      expect(typeof manager.clearContext).toBe('function');
      expect(typeof manager.getTokenCount).toBe('function');
    });

    it('should create context manager with custom token limit', () => {
      const manager = createContextManager({ maxTokens: 5000 });
      
      expect(manager.getMaxTokens()).toBe(5000);
    });
  });

  describe('ContextManager operations', () => {
    let manager;

    beforeEach(() => {
      manager = createContextManager({ maxTokens: 1000 });
    });

    it('should add and retrieve context', () => {
      manager.addContext('test-key', 'Test content', { priority: 1 });
      
      const context = manager.getContext('test-key');
      expect(context).toBe('Test content');
    });

    it('should respect token limits', () => {
      // Add content that exceeds limit
      const largeContent = 'x'.repeat(1500);
      
      manager.addContext('large', largeContent);
      
      // Should be truncated or rejected
      expect(manager.getTokenCount()).toBeLessThanOrEqual(1000);
    });

    it('should prioritize high-priority context', () => {
      manager.addContext('low', 'Low priority content', { priority: 1 });
      manager.addContext('high', 'High priority content', { priority: 10 });
      manager.addContext('medium', 'Medium priority content', { priority: 5 });
      
      const prioritized = manager.getPrioritizedContext();
      
      // High priority should be first
      expect(prioritized[0].key).toBe('high');
    });

    it('should evict low-priority items when full', () => {
      // Fill up the context
      for (let i = 0; i < 100; i++) {
        manager.addContext(`item-${i}`, `Content ${i}`, { priority: i % 10 });
      }
      
      // High priority items should still be present
      expect(manager.hasContext('item-99')).toBe(true); // Priority 9
      expect(manager.hasContext('item-89')).toBe(true); // Priority 9
    });

    it('should clear all context', () => {
      manager.addContext('key1', 'Content 1');
      manager.addContext('key2', 'Content 2');
      
      manager.clearContext();
      
      expect(manager.getContext('key1')).toBeUndefined();
      expect(manager.getContext('key2')).toBeUndefined();
    });

    it('should track token count', () => {
      manager.addContext('key1', 'Test content');
      
      const count = manager.getTokenCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('createPriorityContext', () => {
    it('should create priority context with items', () => {
      const items = [
        { content: 'High priority', priority: 10 },
        { content: 'Low priority', priority: 1 }
      ];
      
      const context = createPriorityContext(items, { maxTokens: 500 });
      
      expect(context).toBeDefined();
      expect(context.items).toBeDefined();
      expect(context.totalTokens).toBeLessThanOrEqual(500);
    });

    it('should sort items by priority', () => {
      const items = [
        { content: 'Item A', priority: 5 },
        { content: 'Item B', priority: 10 },
        { content: 'Item C', priority: 1 }
      ];
      
      const context = createPriorityContext(items);
      
      expect(context.items[0].priority).toBe(10);
      expect(context.items[1].priority).toBe(5);
      expect(context.items[2].priority).toBe(1);
    });
  });

  describe('manageContextWindow', () => {
    it('should fit context within window', () => {
      const context = {
        items: [
          { content: 'Item 1', priority: 5 },
          { content: 'Item 2', priority: 3 },
          { content: 'Item 3', priority: 8 }
        ]
      };
      
      const managed = manageContextWindow(context, { maxTokens: 50 });
      
      expect(managed.totalTokens).toBeLessThanOrEqual(50);
    });

    it('should preserve critical items', () => {
      const context = {
        items: [
          { content: 'Critical instruction', priority: 10, critical: true },
          { content: 'Less important', priority: 1 }
        ]
      };
      
      const managed = manageContextWindow(context, { maxTokens: 30 });
      
      // Critical item should always be present
      expect(managed.items.some(item => item.critical)).toBe(true);
    });
  });

  describe('compressContext / decompressContext', () => {
    it('should compress and decompress context', async () => {
      const original = {
        items: [
          { content: 'This is a long piece of content that should be compressed' },
          { content: 'Another piece of content for compression testing' }
        ]
      };
      
      const compressed = await arsCompressContext(original);
      const decompressed = await decompressContext(compressed);
      
      expect(compressed.compressed).toBeDefined();
      expect(decompressed).toBeDefined();
    });

    it('should attempt compression for verbose content', async () => {
      const verbose = {
        items: [
          { content: 'This is a very verbose piece of content that contains many words and should be significantly compressed by the compression algorithm' },
          { content: 'Another verbose content piece with lots of unnecessary words that can be removed during compression to save space' }
        ]
      };
      
      const compressed = await arsCompressContext(verbose, { targetRatio: 0.5 });
      
      expect(compressed).toBeDefined();
      expect(compressed.compressed).toBeDefined();
    });
  });

  describe('prioritizeContextItems', () => {
    it('should sort items by multiple factors', () => {
      const items = [
        { content: 'A', priority: 5, recency: 1, relevance: 0.5 },
        { content: 'B', priority: 5, recency: 10, relevance: 0.8 },
        { content: 'C', priority: 8, recency: 5, relevance: 0.6 }
      ];
      
      const prioritized = prioritizeContextItems(items);
      
      // Should consider priority, recency, and relevance
      expect(prioritized[0].score).toBeGreaterThanOrEqual(prioritized[1].score);
    });

    it('should handle empty items', () => {
      const prioritized = prioritizeContextItems([]);
      
      expect(prioritized).toEqual([]);
    });
  });

  describe('createContextCache', () => {
    it('should create LRU cache', () => {
      const cache = createContextCache({ maxSize: 3 });
      
      expect(cache).toBeDefined();
      expect(typeof cache.set).toBe('function');
      expect(typeof cache.get).toBe('function');
      expect(typeof cache.has).toBe('function');
    });

    it('should cache and retrieve context', () => {
      const cache = createContextCache({ maxSize: 3 });
      
      cache.set('key1', 'Context 1');
      
      expect(cache.get('key1')).toBe('Context 1');
    });

    it('should evict oldest items when full', () => {
      const cache = createContextCache({ maxSize: 2 });
      
      cache.set('key1', 'Context 1');
      cache.set('key2', 'Context 2');
      cache.set('key3', 'Context 3'); // Should evict key1
      
      expect(cache.has('key1')).toBe(false);
      expect(cache.get('key2')).toBe('Context 2');
      expect(cache.get('key3')).toBe('Context 3');
    });

    it('should track hit rate', () => {
      const cache = createContextCache({ maxSize: 3 });
      
      cache.set('key1', 'Context 1');
      cache.get('key1'); // Hit
      cache.get('key2'); // Miss
      cache.get('key1'); // Hit
      
      const stats = cache.getStats();
      expect(stats.hitRate).toBeGreaterThan(0);
    });
  });

  describe('validateContextIntegrity', () => {
    it('should validate valid context', () => {
      const context = {
        items: [
          { content: 'Valid content', priority: 5 }
        ],
        totalTokens: 100
      };
      
      const result = validateContextIntegrity(context);
      
      expect(result.valid).toBe(true);
    });

    it('should detect invalid context', () => {
      const context = {
        items: 'not an array', // Invalid
        totalTokens: 100
      };
      
      const result = validateContextIntegrity(context);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
