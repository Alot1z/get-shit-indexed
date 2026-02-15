// PreToolUse Hook: Complexity Prediction (Layer 2: Cognitive Flow)
// Triggers before agent spawn to analyze plan complexity using three-phase cognitive analysis

const fs = require('fs').promises;
const path = require('path');
const { runCognitiveFlow, ComplexityResult } = require('../../lib/complexity/cognitive-flow');

/**
 * Tools that trigger complexity prediction.
 * These are the tools that spawn agents or execute plans.
 */
const TRIGGER_TOOLS = [
  'Task',           // Agent spawn
  'execute-phase',  // Phase execution
  'execute-plan'    // Plan execution
];

/**
 * Determine if complexity prediction should trigger.
 * Checks if tool name is in trigger list or if plan file is in context.
 *
 * @param {string} toolName - Name of the tool being called
 * @param {object} context - Tool call context
 * @returns {boolean} True if complexity prediction should run
 */
function shouldTrigger(toolName, context) {
  return TRIGGER_TOOLS.includes(toolName) ||
         context?.planFile?.endsWith('-PLAN.md');
}

/**
 * Analyze plan file to extract complexity metrics.
 * Uses DC-style file reading (fs.promises for Node.js compatibility).
 * Counts XML elements and @-references to estimate complexity.
 *
 * @param {string} planPath - Absolute path to plan file
 * @returns {Promise<object>} Plan metrics with fileOps, symbolQueries, cgQueries, tasks, crossRefs
 */
async function analyzePlan(planPath) {
  try {
    const content = await fs.readFile(planPath, 'utf-8');

    // Count tasks (XML <task> elements)
    const taskCount = (content.match(/<task/g) || []).length;

    // Count file references in <files> elements
    const fileOps = (content.match(/<files>[\s\S]*?<\/files>/g) || []).length;

    // Estimate symbol queries (one per task typically)
    const symbolQueries = taskCount;

    // Estimate CG queries (dependency analysis, ~1 per 2 tasks)
    const cgQueries = Math.ceil(taskCount / 2);

    // Count cross-references (@-references)
    const crossRefs = (content.match(/@[a-zA-Z0-9_\-\/]+/g) || []).length;

    return {
      fileOps,
      symbolQueries,
      cgQueries,
      tasks: taskCount,
      crossRefs
    };
  } catch (error) {
    console.error(`[ComplexityCheck] Error analyzing plan: ${error.message}`);
    return {
      fileOps: 0,
      symbolQueries: 0,
      cgQueries: 0,
      tasks: 0,
      crossRefs: 0
    };
  }
}

/**
 * Main hook run function.
 * Orchestrates full cognitive complexity prediction flow:
 * 1. Check if trigger conditions met
 * 2. Extract plan path from context
 * 3. Analyze plan to get metrics
 * 4. Run three-phase cognitive flow (Structure → Process → Learning)
 * 5. Return ComplexityResult with rich analysis
 *
 * @param {string} toolName - Name of the tool being called
 * @param {object} context - Tool call context (may contain planFile)
 * @returns {Promise<ComplexityResult|object>} ComplexityResult or skip object
 */
async function run(toolName, context) {
  // Check if complexity prediction should trigger
  if (!shouldTrigger(toolName, context)) {
    return { skip: true };
  }

  // Extract plan path from context
  const planPath = context?.planFile || context?.arguments?.planFile;
  if (!planPath) {
    return { skip: true, reason: "No plan file in context" };
  }

  // Resolve to absolute path if relative
  const absolutePath = path.isAbsolute(planPath)
    ? planPath
    : path.join(process.cwd(), planPath);

  // Analyze plan to extract complexity metrics
  const planMetrics = await analyzePlan(absolutePath);

  // Add files array to metrics (extracted from content)
  const files = await extractFiles(absolutePath);
  planMetrics.files = files;
  planMetrics.projectPath = process.cwd();

  // Run full three-phase cognitive flow
  const cognitiveResult = await runCognitiveFlow(absolutePath, planMetrics);

  // Return structured ComplexityResult
  return new ComplexityResult(cognitiveResult);
}

/**
 * Extract file paths from plan content.
 * Looks for paths in <files> elements and @-references.
 *
 * @param {string} planPath - Path to plan file
 * @returns {Promise<string[]>} Array of file paths
 */
async function extractFiles(planPath) {
  try {
    const content = await fs.readFile(planPath, 'utf-8');
    
    // Extract file paths from <files> elements
    const filesMatch = content.match(/<files>([\s\S]*?)<\/files>/g);
    const files = [];
    
    if (filesMatch) {
      for (const match of filesMatch) {
        const paths = match
          .replace(/<\/?files>/g, '')
          .trim()
          .split('\n')
          .map(f => f.trim())
          .filter(f => f && !f.startsWith('@')); // Filter out @-references
        
        files.push(...paths);
      }
    }
    
    return files;
  } catch (error) {
    console.error(`[ComplexityCheck] Error extracting files: ${error.message}`);
    return [];
  }
}

module.exports = {
  run,
  shouldTrigger,
  analyzePlan
};
