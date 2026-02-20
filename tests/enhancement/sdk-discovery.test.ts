/**
 * SDK Discovery Tests (TDD)
 * Tests for automatic SDK discovery from package.json
 */

import { describe, it, expect } from 'vitest';

describe('SDK Discovery', () => {
  it('should discover SDKs from package.json dependencies', async () => {
    const { discoverSDKs } = await import('../../lib/enhancement/sdk-discovery');
    
    const mockPackageJson = {
      dependencies: {
        'vitest': '^1.0.0',
        'typescript': '^5.0.0',
        '@anthropic/sdk': '^1.0.0'
      },
      devDependencies: {
        '@types/node': '^20.0.0'
      }
    };
    
    const discovered = await discoverSDKs(mockPackageJson);
    
    expect(discovered).toContainEqual(
      expect.objectContaining({ name: 'vitest', type: 'testing' })
    );
    expect(discovered).toContainEqual(
      expect.objectContaining({ name: '@anthropic/sdk', type: 'ai' })
    );
  });

  it('should categorize discovered SDKs', async () => {
    const { discoverSDKs } = await import('../../lib/enhancement/sdk-discovery');
    
    const packages = {
      dependencies: {
        'bun': '^1.0.0',
        'sqlite3': '^5.0.0'
      }
    };
    
    const discovered = await discoverSDKs(packages);
    
    const runtimes = discovered.filter(s => s.type === 'runtime');
    const databases = discovered.filter(s => s.type === 'database');
    
    expect(runtimes).toHaveLength(1);
    expect(databases).toHaveLength(1);
  });

  it('should handle empty dependencies', async () => {
    const { discoverSDKs } = await import('../../lib/enhancement/sdk-discovery');
    
    const packages = {
      dependencies: {},
      devDependencies: {}
    };
    
    const discovered = await discoverSDKs(packages);
    
    expect(discovered).toEqual([]);
  });

  it('should categorize unknown SDKs as other', async () => {
    const { discoverSDKs } = await import('../../lib/enhancement/sdk-discovery');
    
    const packages = {
      dependencies: {
        'unknown-package': '^1.0.0'
      }
    };
    
    const discovered = await discoverSDKs(packages);
    
    expect(discovered).toContainEqual(
      expect.objectContaining({ name: 'unknown-package', type: 'other' })
    );
  });

  it('should strip version prefixes', async () => {
    const { discoverSDKs } = await import('../../lib/enhancement/sdk-discovery');
    
    const packages = {
      dependencies: {
        'vitest': '^1.2.3',
        'typescript': '~5.0.0'
      }
    };
    
    const discovered = await discoverSDKs(packages);
    
    const vitest = discovered.find(s => s.name === 'vitest');
    const typescript = discovered.find(s => s.name === 'typescript');
    
    expect(vitest?.version).toBe('1.2.3');
    expect(typescript?.version).toBe('5.0.0');
  });
});
