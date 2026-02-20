/**
 * Feature Registry Tests (TDD)
 * Tests for enhancement feature registry
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Registry', () => {
  it('should register enhancements', async () => {
    const { FeatureRegistry } = await import('../../lib/enhancement/feature-registry-new');
    const registry = new FeatureRegistry();
    
    registry.register({
      id: 'visual-explainer',
      name: 'Visual Explainer',
      layer: 'enhancement',
      enabled: true
    });
    
    const all = registry.listAll();
    
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe('visual-explainer');
  });

  it('should filter by layer', async () => {
    const { FeatureRegistry } = await import('../../lib/enhancement/feature-registry-new');
    const registry = new FeatureRegistry();
    
    registry.register({ id: 'core-1', name: 'Core 1', layer: 'core', enabled: true });
    registry.register({ id: 'enhance-1', name: 'Enhance 1', layer: 'enhancement', enabled: true });
    
    const enhancements = registry.listByLayer('enhancement');
    
    expect(enhancements).toHaveLength(1);
    expect(enhancements[0].layer).toBe('enhancement');
  });

  it('should toggle feature status', async () => {
    const { FeatureRegistry } = await import('../../lib/enhancement/feature-registry-new');
    const registry = new FeatureRegistry();
    
    registry.register({ id: 'test', name: 'Test', layer: 'test', enabled: true });
    
    registry.toggle('test', false);
    
    const feature = registry.get('test');
    expect(feature?.enabled).toBe(false);
  });

  it('should get feature by id', async () => {
    const { FeatureRegistry } = await import('../../lib/enhancement/feature-registry-new');
    const registry = new FeatureRegistry();
    
    registry.register({ id: 'my-feature', name: 'My Feature', layer: 'enhancement', enabled: true });
    
    const feature = registry.get('my-feature');
    
    expect(feature).toBeDefined();
    expect(feature?.name).toBe('My Feature');
  });

  it('should return undefined for non-existent feature', async () => {
    const { FeatureRegistry } = await import('../../lib/enhancement/feature-registry-new');
    const registry = new FeatureRegistry();
    
    const feature = registry.get('nonexistent');
    
    expect(feature).toBeUndefined();
  });

  it('should list enabled features only', async () => {
    const { FeatureRegistry } = await import('../../lib/enhancement/feature-registry-new');
    const registry = new FeatureRegistry();
    
    registry.register({ id: 'enabled-1', name: 'Enabled 1', layer: 'test', enabled: true });
    registry.register({ id: 'disabled-1', name: 'Disabled 1', layer: 'test', enabled: false });
    registry.register({ id: 'enabled-2', name: 'Enabled 2', layer: 'test', enabled: true });
    
    const enabled = registry.listEnabled();
    
    expect(enabled).toHaveLength(2);
    expect(enabled.every(f => f.enabled)).toBe(true);
  });

  it('should update feature metadata', async () => {
    const { FeatureRegistry } = await import('../../lib/enhancement/feature-registry-new');
    const registry = new FeatureRegistry();
    
    registry.register({ id: 'test', name: 'Test', layer: 'test', enabled: true });
    
    registry.update('test', { name: 'Updated Test' });
    
    const feature = registry.get('test');
    expect(feature?.name).toBe('Updated Test');
  });
});
