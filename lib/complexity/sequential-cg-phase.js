// Phase 2: Process Assessment (Sequential + CodeGraph MCP)
// Assesses process complexity using sequential thinking interleaved with dependency analysis

/**
 * Phase 2: Process Assessment
 * Uses Sequential thinking for multi-step process reasoning, interleaved with
 * CodeGraphContext MCP for dependency and relationship analysis.
 *
 * Flow:
 * 1. Start sequential thinking for process assessment
 * 2. Use CG to analyze code relationships and dependencies
 * 3. Continue thinking with dependency insights
 * 4. Calculate dependency impact on complexity
 * 5. Generate final recommendation
 *
 * @param {object} planMetrics - Plan metrics (files, tasks, etc.)
 * @param {object} structureResult - Results from Phase 1 structure analysis
 * @returns {Promise<object>} Process assessment result
 */
async function runProcessPhase(planMetrics, structureResult) {
  const startTime = Date.now();
  const files = planMetrics.files || [];
  
  // Phase 2.1: Start sequential thinking for process assessment
  let thought;
  try {
    thought = await mcp__sequential-thinking__sequentialthinking({
      thought: `Beginning process assessment. Phase 1 found ${structureResult.fileCount} files with ${structureResult.totalLines} lines. Need to assess dependency complexity.`,
      thoughtNumber: 1,
      totalThoughts: 4,
      nextThoughtNeeded: true
    });
  } catch (e) {
    console.debug(`Sequential thinking unavailable for process phase: ${e.message}`);
  }

  // Phase 2.2: Use CodeGraphContext MCP for dependency analysis
  let dependencyCount = 0;
  let crossFileImpact = 0;

  if (files.length > 0) {
    try {
      // Analyze first file's dependencies as representative
      const targetFile = files[0];
      
      const dependencies = await mcp__CodeGraphContext__analyze_code_relationships({
        query_type: "module_deps",
        target: targetFile,
        context: planMetrics.projectPath || process.cwd()
      });

      if (dependencies && dependencies.length > 0) {
        dependencyCount = dependencies.length;
        crossFileImpact = Math.min(10, dependencies.length / 2);
      }

      // Phase 2.3: Continue thinking with dependency info
      if (thought && thought.nextThoughtNeeded !== false) {
        try {
          thought = await mcp__sequential-thinking__sequentialthinking({
            thought: `Dependencies found: ${dependencyCount}. Cross-file impact score: ${crossFileImpact}/10. This affects how changes propagate.`,
            thoughtNumber: 2,
            totalThoughts: 4,
            nextThoughtNeeded: true
          });
        } catch (e) {
          console.debug(`Sequential thinking continuation failed: ${e.message}`);
        }
      }
    } catch (e) {
      // CG might not be available - use heuristics
      console.debug(`CodeGraphContext unavailable for process phase: ${e.message}`);
      
      // Fallback: Estimate dependency impact from file count
      crossFileImpact = Math.min(10, structureResult.fileCount / 3);
      dependencyCount = Math.round(structureResult.fileCount * 1.5); // Assume 1.5 deps per file
    }
  }

  // Phase 2.4: Calculate dependency weight
  const dependencyWeight = Math.min(10, (dependencyCount * 0.3) + crossFileImpact);
  
  if (thought && thought.nextThoughtNeeded !== false) {
    try {
      thought = await mcp__sequential-thinking__sequentialthinking({
        thought: `Dependency weight calculated: ${dependencyWeight.toFixed(1)}/10. This represents cross-file coupling and change impact.`,
        thoughtNumber: 3,
        totalThoughts: 4,
        nextThoughtNeeded: true
      });
    } catch (e) {
      console.debug(`Sequential thinking continuation failed: ${e.message}`);
    }
  }

  // Phase 2.5: Final recommendation
  let recommendation = "proceed";
  if (thought && thought.nextThoughtNeeded !== false) {
    try {
      thought = await mcp__sequential-thinking__sequentialthinking({
        thought: `Process assessment complete. Structural complexity: ${structureResult.structuralComplexity}/10, Dependency weight: ${dependencyWeight.toFixed(1)}/10. Combined assessment suggests appropriate action.`,
        thoughtNumber: 4,
        totalThoughts: 4,
        nextThoughtNeeded: false
      });
      
      recommendation = thought?.answer || "proceed";
    } catch (e) {
      console.debug(`Sequential thinking final step failed: ${e.message}`);
    }
  }

  // Calculate process complexity (base 5 + dependency impact)
  const processComplexity = Math.min(10, 5 + (dependencyWeight / 2));

  const duration = Date.now() - startTime;

  return {
    dependencyCount,
    crossFileImpact: Math.round(crossFileImpact * 10) / 10,
    dependencyWeight: Math.round(dependencyWeight * 10) / 10,
    processComplexity: Math.round(processComplexity * 10) / 10,
    recommendation,
    duration,
    degraded: !thought || files.length === 0
  };
}

module.exports = {
  runProcessPhase
};
