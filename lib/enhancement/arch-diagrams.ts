/**
 * Architecture Diagrams Module
 * 
 * Generates architecture diagrams showing module relationships and layers.
 */

export interface ArchLayer {
  name: string;
  modules: string[];
  dependsOn?: string[];
  connections?: { from: string; to: string }[];
}

export interface Architecture {
  layers: ArchLayer[];
  layout?: 'TB' | 'LR' | 'BT' | 'RL';
}

/**
 * Generate an architecture diagram from module structure
 */
export async function generateArchitectureDiagram(arch: Architecture): Promise<string> {
  const layout = arch.layout || 'TB';
  const lines: string[] = [`graph ${layout}`];
  
  // Handle empty layers
  if (!arch.layers || arch.layers.length === 0) {
    return lines.join('\n');
  }
  
  // Create subgraphs for each layer
  arch.layers.forEach(layer => {
    const layerId = sanitizeLayerId(layer.name);
    lines.push(`  subgraph ${layerId} ["${layer.name}"]`);
    
    // Add modules within layer
    layer.modules.forEach(mod => {
      lines.push(`    ${sanitizeId(mod)}["${mod}"]`);
    });
    
    lines.push('  end');
  });
  
  // Add layer dependencies
  arch.layers.forEach(layer => {
    if (layer.dependsOn && layer.dependsOn.length > 0) {
      layer.dependsOn.forEach(dep => {
        lines.push(`  ${sanitizeLayerId(dep)} --> ${sanitizeLayerId(layer.name)}`);
      });
    }
  });
  
  // Add internal connections within layers
  arch.layers.forEach(layer => {
    if (layer.connections && layer.connections.length > 0) {
      layer.connections.forEach(conn => {
        lines.push(`  ${sanitizeId(conn.from)} --> ${sanitizeId(conn.to)}`);
      });
    }
  });
  
  return lines.join('\n');
}

/**
 * Generate a layer dependency diagram
 */
export async function generateLayerDependencyDiagram(layers: ArchLayer[]): Promise<string> {
  const lines: string[] = ['graph TD'];
  
  // Add layer nodes
  layers.forEach(layer => {
    lines.push(`  ${sanitizeLayerId(layer.name)}["${layer.name}<br/>(${layer.modules.length} modules)"]`);
  });
  
  // Add dependencies
  layers.forEach(layer => {
    if (layer.dependsOn && layer.dependsOn.length > 0) {
      layer.dependsOn.forEach(dep => {
        lines.push(`  ${sanitizeLayerId(dep)} --> ${sanitizeLayerId(layer.name)}`);
      });
    }
  });
  
  return lines.join('\n');
}

/**
 * Generate a module connection diagram for a single layer
 */
export async function generateModuleConnectionDiagram(layer: ArchLayer): Promise<string> {
  const lines: string[] = ['graph LR'];
  
  // Add module nodes
  layer.modules.forEach(mod => {
    lines.push(`  ${sanitizeId(mod)}["${mod}"]`);
  });
  
  // Add connections
  if (layer.connections && layer.connections.length > 0) {
    layer.connections.forEach(conn => {
      lines.push(`  ${sanitizeId(conn.from)} --> ${sanitizeId(conn.to)}`);
    });
  }
  
  return lines.join('\n');
}

/**
 * Analyze architecture for circular dependencies
 */
export function detectCircularDependencies(layers: ArchLayer[]): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  // Build adjacency list
  const graph = new Map<string, string[]>();
  
  layers.forEach(layer => {
    graph.set(layer.name, layer.dependsOn || []);
    
    // Also add internal connections
    if (layer.connections) {
      layer.connections.forEach(conn => {
        if (!graph.has(conn.from)) {
          graph.set(conn.from, []);
        }
        graph.get(conn.from)!.push(conn.to);
      });
    }
  });
  
  function dfs(node: string, path: string[]): void {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);
    
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, [...path]);
      } else if (recursionStack.has(neighbor)) {
        // Found cycle
        const cycleStart = path.indexOf(neighbor);
        if (cycleStart !== -1) {
          cycles.push(path.slice(cycleStart));
        }
      }
    }
    
    recursionStack.delete(node);
  }
  
  graph.forEach((_, node) => {
    if (!visited.has(node)) {
      dfs(node, []);
    }
  });
  
  return cycles;
}

/**
 * Sanitize ID for Mermaid compatibility
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Sanitize layer ID for subgraph naming
 */
function sanitizeLayerId(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

export default {
  generateArchitectureDiagram,
  generateLayerDependencyDiagram,
  generateModuleConnectionDiagram,
  detectCircularDependencies
};
