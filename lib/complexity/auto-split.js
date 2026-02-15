// Layer 3: Auto-Split Decision Engine
// Automatically splits high-complexity plans into manageable sub-phases

const { getModelThresholds } = require('./model-awareness.js');
const fs = require('fs').promises;
const path = require('path');

/**
 * Calculate how many sub-phases are needed based on complexity score.
 * Uses model-specific thresholds from Layer 1.
 *
 * @param {number} score - The complexity score (0-100 scale)
 * @returns {Promise<number>} Number of sub-phases needed (1 = no split)
 */
async function calculateSubPhaseCount(score) {
  const thresholds = await getModelThresholds();
  
  if (score <= thresholds.split_threshold) {
    return 1; // No split needed
  }
  
  // Calculate how many sub-phases needed
  const subPhaseCount = Math.ceil(score / thresholds.split_threshold);
  
  // Cap at reasonable maximum (avoid over-fragmentation)
  const maxSubPhases = 5;
  return Math.min(subPhaseCount, maxSubPhases);
}

/**
 * Split a plan into multiple sub-phases.
 * Distributes tasks evenly across sub-phases.
 *
 * @param {string} planContent - The full plan content as string
 * @param {number} subPhaseCount - Number of sub-phases to create
 * @returns {Promise<object>} Split result with originalTaskCount, subPhaseCount, subPhases array
 */
async function splitPlan(planContent, subPhaseCount) {
  // Parse tasks from plan content
  const taskMatches = [...planContent.matchAll(/<task[^>]*>([\s\S]*?)<\/task>/g)];
  const tasks = taskMatches.map((m, i) => ({
    index: i,
    content: m[0],
    fullMatch: m[0]
  }));
  
  // Distribute tasks across sub-phases
  const tasksPerPhase = Math.ceil(tasks.length / subPhaseCount);
  const subPhases = [];
  
  for (let i = 0; i < subPhaseCount; i++) {
    const start = i * tasksPerPhase;
    const end = Math.min(start + tasksPerPhase, tasks.length);
    subPhases.push({
      phaseNumber: i + 1,
      tasks: tasks.slice(start, end),
      taskCount: end - start
    });
  }
  
  return {
    originalTaskCount: tasks.length,
    subPhaseCount,
    subPhases
  };
}

module.exports = {
  calculateSubPhaseCount,
  splitPlan
};
