// PreToolUse Hook: Complexity Prediction
// Triggers before agent spawn to analyze plan complexity

const fs = require('fs').promises;
const path = require('path');
const { calculateComplexityScore, decideAction } = require('../../lib/complexity/scorer');

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

// TODO: Implement main run function

module.exports = {
  run: async () => ({ skip: true, reason: "Not implemented yet" }),
  shouldTrigger,
  analyzePlan
};
