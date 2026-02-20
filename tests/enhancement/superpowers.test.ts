/**
 * Superpowers Tests (TDD)
 * Tests for extended features from obra/superpowers
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('superpowers analysis', () => {
  it('should extract feature catalog from superpowers', async () => {
    const { analyzeSuperpowersFeatures } = await import('../../lib/enhancement/superpowers');
    const catalog = await analyzeSuperpowersFeatures();
    
    expect(catalog).toBeDefined();
    expect(catalog.features.length).toBeGreaterThan(0);
    expect(catalog.integrated).toBeDefined();
    expect(catalog.available).toBeDefined();
  });

  it('should identify already integrated features', async () => {
    const { analyzeSuperpowersFeatures } = await import('../../lib/enhancement/superpowers');
    const catalog = await analyzeSuperpowersFeatures();
    
    // Features already in GSI should be marked
    const integrated = catalog.integrated;
    expect(integrated).toContain('desktop-commander');
    expect(integrated).toContain('code-index');
  });
});

describe('Extended Features', () => {
  it('should enable visual-explain feature', async () => {
    const { enableFeature } = await import('../../lib/enhancement/superpowers');
    const feature = await enableFeature('visual-explain');
    
    expect(feature.enabled).toBe(true);
    expect(feature.api).toBeDefined();
    expect(typeof feature.api.explain).toBe('function');
  });

  it('should return disabled for unknown features', async () => {
    const { enableFeature } = await import('../../lib/enhancement/superpowers');
    const feature = await enableFeature('unknown-feature');
    
    expect(feature.enabled).toBe(false);
  });

  it('should integrate features with GSI context', async () => {
    const { enableFeature, gsiEnhance } = await import('../../lib/enhancement/superpowers');
    await enableFeature('visual-explain');
    
    const result = await gsiEnhance('visual-explain', {
      code: 'function test() { return 1; }'
    });
    
    expect(result).toBeDefined();
    expect(result.diagram).toContain('flowchart');
  });

  it('should throw error for non-enabled feature', async () => {
    const { gsiEnhance } = await import('../../lib/enhancement/superpowers');
    
    await expect(gsiEnhance('not-enabled', {}))
      .rejects.toThrow('Feature not enabled');
  });

  it('should enable context-compress feature', async () => {
    const { enableFeature } = await import('../../lib/enhancement/superpowers');
    const feature = await enableFeature('context-compress');
    
    expect(feature.enabled).toBe(true);
    expect(feature.api).toBeDefined();
    expect(typeof feature.api.compress).toBe('function');
  });

  it('should compress context with context-compress feature', async () => {
    const { enableFeature, gsiEnhance } = await import('../../lib/enhancement/superpowers');
    await enableFeature('context-compress');
    
    const longContext = 'This is a very long context that needs to be compressed for efficiency';
    const result = await gsiEnhance('context-compress', { context: longContext });
    
    expect(result).toBeDefined();
    expect(result.compressed.length).toBeLessThanOrEqual(longContext.length);
  });
});
