/**
 * Flow Diagrams Module
 * 
 * Generates workflow diagrams from phase tasks and dependencies.
 * Supports sequential, parallel, and wave-based workflows.
 */

export interface WorkflowTask {
  id: string;
  name: string;
  dependsOn: string[];
  wave?: number;
}

export interface Workflow {
  name: string;
  tasks: WorkflowTask[];
}

/**
 * Generate a workflow diagram from phase tasks
 */
export async function generateWorkflowDiagram(workflow: Workflow): Promise<string> {
  const lines: string[] = ['flowchart LR'];
  
  // Group tasks by wave if available
  const hasWaves = workflow.tasks.some(t => t.wave !== undefined);
  
  if (hasWaves) {
    // Create subgraphs for each wave
    const waveGroups = groupByWave(workflow.tasks);
    
    Object.entries(waveGroups).forEach(([wave, tasks]) => {
      if (tasks.length > 0) {
        lines.push(`  subgraph Wave_${wave}`);
        tasks.forEach(task => {
          lines.push(`    ${task.id}["${task.name}"]`);
        });
        lines.push('  end');
      }
    });
  } else {
    // Create single subgraph for workflow
    lines.push(`  subgraph ${sanitizeWorkflowName(workflow.name)}`);
    workflow.tasks.forEach(task => {
      lines.push(`    ${task.id}["${task.name}"]`);
    });
    lines.push('  end');
  }
  
  // Add dependencies as connections
  workflow.tasks.forEach(task => {
    task.dependsOn.forEach(dep => {
      lines.push(`  ${dep} --> ${task.id}`);
    });
  });
  
  return lines.join('\n');
}

/**
 * Group tasks by their wave number
 */
function groupByWave(tasks: WorkflowTask[]): Record<number, WorkflowTask[]> {
  const groups: Record<number, WorkflowTask[]> = {};
  
  tasks.forEach(task => {
    const wave = task.wave || 1;
    if (!groups[wave]) {
      groups[wave] = [];
    }
    groups[wave].push(task);
  });
  
  return groups;
}

/**
 * Sanitize workflow name for Mermaid compatibility
 */
function sanitizeWorkflowName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Generate a task dependency graph
 */
export async function generateDependencyGraph(tasks: WorkflowTask[]): Promise<string> {
  const lines: string[] = ['graph TD'];
  
  // Add all task nodes
  tasks.forEach(task => {
    lines.push(`  ${task.id}["${task.name}"]`);
  });
  
  // Add dependency edges
  tasks.forEach(task => {
    task.dependsOn.forEach(dep => {
      lines.push(`  ${dep} --> ${task.id}`);
    });
  });
  
  return lines.join('\n');
}

/**
 * Analyze workflow for parallel execution opportunities
 */
export function analyzeParallelism(tasks: WorkflowTask[]): {
  parallelizable: string[][];
  critical: string[];
} {
  // Find tasks that can run in parallel (no dependencies on each other)
  const taskMap = new Map(tasks.map(t => [t.id, t]));
  const parallelizable: string[][] = [];
  const critical: string[] = [];
  
  // Group tasks by their dependency depth
  const depths = new Map<string, number>();
  
  function getDepth(taskId: string): number {
    if (depths.has(taskId)) {
      return depths.get(taskId)!;
    }
    
    const task = taskMap.get(taskId);
    if (!task || task.dependsOn.length === 0) {
      depths.set(taskId, 0);
      return 0;
    }
    
    const maxDepDepth = Math.max(...task.dependsOn.map(getDepth));
    const depth = maxDepDepth + 1;
    depths.set(taskId, depth);
    return depth;
  }
  
  tasks.forEach(t => getDepth(t.id));
  
  // Group by depth
  const depthGroups: Record<number, string[]> = {};
  depths.forEach((depth, taskId) => {
    if (!depthGroups[depth]) {
      depthGroups[depth] = [];
    }
    depthGroups[depth].push(taskId);
  });
  
  // Parallelizable groups are those with multiple tasks at same depth
  Object.values(depthGroups).forEach(group => {
    if (group.length > 1) {
      parallelizable.push(group);
    }
  });
  
  // Critical path is the longest path
  const maxDepth = Math.max(...depths.values());
  depths.forEach((depth, taskId) => {
    if (depth === maxDepth) {
      critical.push(taskId);
    }
  });
  
  return { parallelizable, critical };
}

export default {
  generateWorkflowDiagram,
  generateDependencyGraph,
  analyzeParallelism
};
