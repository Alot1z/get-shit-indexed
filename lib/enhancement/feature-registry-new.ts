/**
 * Feature Registry Module (New)
 * 
 * Registry for managing enhancement features.
 * Note: This is the new feature registry for enhancement layer,
 * separate from the existing feature-registry.js
 */

export interface Enhancement {
  id: string;
  name: string;
  layer: string;
  enabled: boolean;
  metadata?: Record<string, any>;
}

/**
 * Feature Registry for managing enhancements
 */
export class FeatureRegistry {
  private features: Map<string, Enhancement> = new Map();
  
  /**
   * Register a new enhancement feature
   */
  register(feature: Enhancement): void {
    this.features.set(feature.id, feature);
  }
  
  /**
   * List all registered features
   */
  listAll(): Enhancement[] {
    return Array.from(this.features.values());
  }
  
  /**
   * List features by layer
   */
  listByLayer(layer: string): Enhancement[] {
    return this.listAll().filter(f => f.layer === layer);
  }
  
  /**
   * Get a feature by ID
   */
  get(id: string): Enhancement | undefined {
    return this.features.get(id);
  }
  
  /**
   * Toggle feature enabled status
   */
  toggle(id: string, enabled: boolean): void {
    const feature = this.features.get(id);
    if (feature) {
      this.features.set(id, { ...feature, enabled });
    }
  }
  
  /**
   * List only enabled features
   */
  listEnabled(): Enhancement[] {
    return this.listAll().filter(f => f.enabled);
  }
  
  /**
   * Update feature metadata
   */
  update(id: string, updates: Partial<Enhancement>): Enhancement | undefined {
    const existing = this.features.get(id);
    if (!existing) {
      return undefined;
    }
    
    const updated = { ...existing, ...updates };
    this.features.set(id, updated);
    return updated;
  }
  
  /**
   * Remove a feature
   */
  remove(id: string): boolean {
    return this.features.delete(id);
  }
  
  /**
   * Check if a feature exists
   */
  has(id: string): boolean {
    return this.features.has(id);
  }
  
  /**
   * Clear all features
   */
  clear(): void {
    this.features.clear();
  }
  
  /**
   * Get feature count
   */
  count(): number {
    return this.features.size;
  }
  
  /**
   * Get features by multiple layers
   */
  listByLayers(layers: string[]): Enhancement[] {
    return this.listAll().filter(f => layers.includes(f.layer));
  }
  
  /**
   * Batch register features
   */
  registerBatch(features: Enhancement[]): void {
    features.forEach(f => this.register(f));
  }
  
  /**
   * Export registry state
   */
  export(): Enhancement[] {
    return this.listAll();
  }
  
  /**
   * Import registry state
   */
  import(features: Enhancement[]): void {
    this.clear();
    this.registerBatch(features);
  }
}

/**
 * Create a default registry with pre-registered enhancement features
 */
export function createDefaultRegistry(): FeatureRegistry {
  const registry = new FeatureRegistry();
  
  registry.registerBatch([
    { id: 'visual-explainer', name: 'Visual Explainer', layer: 'enhancement', enabled: true },
    { id: 'flow-diagrams', name: 'Flow Diagrams', layer: 'enhancement', enabled: true },
    { id: 'arch-diagrams', name: 'Architecture Diagrams', layer: 'enhancement', enabled: true },
    { id: 'awesome-sdks', name: 'Awesome SDKs', layer: 'enhancement', enabled: true },
    { id: 'sdk-discovery', name: 'SDK Discovery', layer: 'enhancement', enabled: true },
    { id: 'superpowers', name: 'Superpowers Extended', layer: 'enhancement', enabled: true }
  ]);
  
  return registry;
}

export default {
  FeatureRegistry,
  createDefaultRegistry
};
