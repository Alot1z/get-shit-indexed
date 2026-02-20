/**
 * SDK Discovery Module
 * 
 * Automatically discovers and categorizes SDKs from package.json dependencies.
 */

export interface DiscoveredSDK {
  name: string;
  version: string;
  type: string;
}

/**
 * SDK categorization rules
 */
const SDK_CATEGORIES: Record<string, string[]> = {
  testing: ['vitest', 'jest', 'mocha', 'chai', 'ava', 'tape'],
  ai: ['@anthropic/sdk', 'openai', 'langchain', '@anthropic-ai/sdk', 'llamaindex'],
  runtime: ['bun', 'deno', 'node'],
  database: ['sqlite3', 'pg', 'mongodb', 'mongoose', 'prisma', '@prisma/client'],
  web: ['express', 'fastify', 'hono', 'koa', 'next', 'react', 'vue'],
  cli: ['commander', 'yargs', 'oclif', 'ink'],
  build: ['esbuild', 'webpack', 'vite', 'rollup', 'turbo'],
  typescript: ['typescript', '@types/', 'tslib']
};

/**
 * Discover SDKs from package.json dependencies
 */
export async function discoverSDKs(packageJson: any): Promise<DiscoveredSDK[]> {
  const discovered: DiscoveredSDK[] = [];
  const allDeps: Record<string, string> = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {})
  };
  
  for (const [name, version] of Object.entries(allDeps)) {
    const type = categorizeSDK(name);
    discovered.push({
      name,
      version: stripVersionPrefix(version as string),
      type
    });
  }
  
  return discovered;
}

/**
 * Categorize an SDK by its name
 */
function categorizeSDK(name: string): string {
  // Check each category for matches
  for (const [category, patterns] of Object.entries(SDK_CATEGORIES)) {
    for (const pattern of patterns) {
      if (name.includes(pattern) || name === pattern) {
        return category;
      }
    }
  }
  
  return 'other';
}

/**
 * Strip version prefixes (^, ~, etc.)
 */
function stripVersionPrefix(version: string): string {
  return version.replace(/^[\^~>=<]+/, '');
}

/**
 * Get SDK category statistics
 */
export function getSDKStats(discovered: DiscoveredSDK[]): Record<string, number> {
  const stats: Record<string, number> = {};
  
  discovered.forEach(sdk => {
    stats[sdk.type] = (stats[sdk.type] || 0) + 1;
  });
  
  return stats;
}

/**
 * Filter SDKs by category
 */
export function filterByCategory(discovered: DiscoveredSDK[], category: string): DiscoveredSDK[] {
  return discovered.filter(sdk => sdk.type === category);
}

/**
 * Get unique SDK categories from discovered list
 */
export function getCategories(discovered: DiscoveredSDK[]): string[] {
  const categories = new Set<string>();
  discovered.forEach(sdk => categories.add(sdk.type));
  return Array.from(categories);
}

/**
 * Discover and group SDKs by category
 */
export async function discoverAndGroup(packageJson: any): Promise<Record<string, DiscoveredSDK[]>> {
  const discovered = await discoverSDKs(packageJson);
  const grouped: Record<string, DiscoveredSDK[]> = {};
  
  discovered.forEach(sdk => {
    if (!grouped[sdk.type]) {
      grouped[sdk.type] = [];
    }
    grouped[sdk.type].push(sdk);
  });
  
  return grouped;
}

export default {
  discoverSDKs,
  getSDKStats,
  filterByCategory,
  getCategories,
  discoverAndGroup
};
