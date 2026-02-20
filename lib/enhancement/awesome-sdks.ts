/**
 * Awesome SDKs Module
 * 
 * SDK catalog and registry for managing available SDKs.
 */

export interface SDK {
  name: string;
  version: string;
  description: string;
  category: string;
  repo: string;
}

export interface CatalogFormat {
  schema: string[];
  source: string;
  categories: string[];
}

/**
 * Analyze and document the SDK catalog format
 */
export async function analyzeCatalogFormat(): Promise<CatalogFormat> {
  return {
    schema: ['name', 'version', 'description', 'category', 'repo'],
    source: 'awesome-sdks catalog',
    categories: ['ai', 'database', 'web', 'cli', 'testing']
  };
}

/**
 * SDK Registry class for managing SDKs
 */
export class SDKRegistry {
  private sdks: Map<string, SDK> = new Map();
  
  /**
   * Register a new SDK
   */
  async register(sdk: SDK): Promise<void> {
    this.sdks.set(sdk.name, sdk);
  }
  
  /**
   * Get an SDK by name
   */
  async get(name: string): Promise<SDK | undefined> {
    return this.sdks.get(name);
  }
  
  /**
   * List all SDKs in a category
   */
  async listByCategory(category: string): Promise<SDK[]> {
    return Array.from(this.sdks.values())
      .filter(sdk => sdk.category === category);
  }
  
  /**
   * List all registered SDKs
   */
  async listAll(): Promise<SDK[]> {
    return Array.from(this.sdks.values());
  }
  
  /**
   * Search SDKs by name or description
   */
  async search(query: string): Promise<SDK[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.sdks.values())
      .filter(sdk => 
        sdk.name.toLowerCase().includes(lowerQuery) ||
        sdk.description.toLowerCase().includes(lowerQuery)
      );
  }
  
  /**
   * Remove an SDK from the registry
   */
  async remove(name: string): Promise<boolean> {
    return this.sdks.delete(name);
  }
  
  /**
   * Update an existing SDK
   */
  async update(name: string, updates: Partial<SDK>): Promise<SDK | undefined> {
    const existing = this.sdks.get(name);
    if (!existing) {
      return undefined;
    }
    
    const updated = { ...existing, ...updates };
    this.sdks.set(name, updated);
    return updated;
  }
  
  /**
   * Get all available categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.sdks.forEach(sdk => categories.add(sdk.category));
    return Array.from(categories);
  }
  
  /**
   * Get SDK count by category
   */
  getCountByCategory(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.sdks.forEach(sdk => {
      counts[sdk.category] = (counts[sdk.category] || 0) + 1;
    });
    return counts;
  }
}

// Default registry instance
const defaultRegistry = new SDKRegistry();

/**
 * Get an SDK by name using the default registry
 */
export async function getSDK(name: string): Promise<SDK | undefined> {
  return defaultRegistry.get(name);
}

/**
 * Get the default registry instance
 */
export function getDefaultRegistry(): SDKRegistry {
  return defaultRegistry;
}

export default {
  SDKRegistry,
  analyzeCatalogFormat,
  getSDK,
  getDefaultRegistry
};
