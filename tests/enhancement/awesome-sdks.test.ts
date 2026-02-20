/**
 * Awesome SDKs Tests (TDD)
 * Tests for SDK catalog and registry
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('awesome-sdks analysis', () => {
  it('should document SDK catalog format', async () => {
    const { analyzeCatalogFormat } = await import('../../lib/enhancement/awesome-sdks');
    const catalogFormat = await analyzeCatalogFormat();
    
    expect(catalogFormat).toBeDefined();
    expect(catalogFormat.schema).toContain('name');
    expect(catalogFormat.schema).toContain('version');
    expect(catalogFormat.schema).toContain('description');
    expect(catalogFormat.source).toBeDefined();
  });
});

describe('SDK Registry', () => {
  it('should register SDK with metadata', async () => {
    const { SDKRegistry } = await import('../../lib/enhancement/awesome-sdks');
    const registry = new SDKRegistry();
    
    await registry.register({
      name: 'context7',
      version: '1.0.0',
      description: 'Documentation retrieval',
      category: 'ai',
      repo: 'https://github.com/context7/context7'
    });
    
    const sdk = await registry.get('context7');
    
    expect(sdk).toBeDefined();
    expect(sdk!.name).toBe('context7');
    expect(sdk!.version).toBe('1.0.0');
    expect(sdk!.category).toBe('ai');
  });

  it('should list all SDKs by category', async () => {
    const { SDKRegistry } = await import('../../lib/enhancement/awesome-sdks');
    const registry = new SDKRegistry();
    
    await registry.register({ name: 'sdk1', version: '1.0', category: 'ai', description: '', repo: '' });
    await registry.register({ name: 'sdk2', version: '1.0', category: 'ai', description: '', repo: '' });
    await registry.register({ name: 'sdk3', version: '1.0', category: 'database', description: '', repo: '' });
    
    const aiSdks = await registry.listByCategory('ai');
    const dbSdks = await registry.listByCategory('database');
    
    expect(aiSdks).toHaveLength(2);
    expect(dbSdks).toHaveLength(1);
  });

  it('should search SDKs by name or description', async () => {
    const { SDKRegistry } = await import('../../lib/enhancement/awesome-sdks');
    const registry = new SDKRegistry();
    
    await registry.register({ 
      name: 'context7', 
      version: '1.0', 
      category: 'ai', 
      description: 'Documentation retrieval for AI', 
      repo: '' 
    });
    await registry.register({ 
      name: 'langchain', 
      version: '1.0', 
      category: 'ai', 
      description: 'LLM chain framework', 
      repo: '' 
    });
    
    const results = await registry.search('documentation');
    
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('context7');
  });

  it('should list all SDKs', async () => {
    const { SDKRegistry } = await import('../../lib/enhancement/awesome-sdks');
    const registry = new SDKRegistry();
    
    await registry.register({ name: 'sdk1', version: '1.0', category: 'ai', description: '', repo: '' });
    await registry.register({ name: 'sdk2', version: '1.0', category: 'database', description: '', repo: '' });
    
    const all = await registry.listAll();
    
    expect(all).toHaveLength(2);
  });
});

describe('getSDK helper', () => {
  it('should get SDK by name', async () => {
    const { getSDK, SDKRegistry } = await import('../../lib/enhancement/awesome-sdks');
    
    // getSDK uses a default registry, should work independently
    const sdk = await getSDK('nonexistent');
    
    // Since default registry is empty, should return undefined
    expect(sdk).toBeUndefined();
  });
});
