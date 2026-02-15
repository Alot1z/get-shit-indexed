// Phase 3: Pattern Learning (Debug + Desktop Commander)
// Learns from past complexity assessments using debug thinking graph

/**
 * Phase 3: Pattern Learning
 * Uses Debug thinking for graph-based learning from past patterns, interleaved with
 * Desktop Commander for reading model specs and configuration.
 *
 * Learning-First Approach:
 * 1. Query similar past patterns FIRST (before creating new nodes)
 * 2. Read model specs via DC
 * 3. Create observation node for current assessment
 * 4. Connect to similar patterns if found
 * 5. Return learning insights
 *
 * @param {number} score - Combined complexity score from previous phases
 * @param {object} modelSpecs - Model specifications (modelId, action, thresholds)
 * @returns {Promise<object>} Learning result with pattern insights
 */
async function runLearningPhase(score, modelSpecs) {
  const startTime = Date.now();
  
  // Phase 3.1: Query similar past patterns FIRST (learning-first approach)
  let pastPatterns = { results: [] };
  try {
    pastPatterns = await mcp__debug-thinking__debug_thinking({
      action: "query",
      queryType: "similar-problems",
      parameters: {
        pattern: `complexity score ${Math.round(score)}`,
        limit: 5,
        minSimilarity: 0.3
      }
    });
  } catch (e) {
    console.debug(`Debug thinking query failed: ${e.message}`);
  }

  // Phase 3.2: Read model specs via Desktop Commander
  let specs = modelSpecs;
  try {
    const specsPath = ".planning/model-specs.json";
    const specsContent = await mcp__desktop-commander__read_file({
      path: specsPath
    });
    
    if (specsContent) {
      try {
        specs = { ...specs, ...JSON.parse(specsContent) };
      } catch (parseError) {
        console.debug(`Failed to parse model specs: ${parseError.message}`);
      }
    }
  } catch (e) {
    console.debug(`Desktop Commander unavailable for reading specs: ${e.message}`);
  }

  // Phase 3.3: Create observation node for this assessment
  let observation = { nodeId: null };
  try {
    observation = await mcp__debug-thinking__debug_thinking({
      action: "create",
      nodeType: "observation",
      content: `Complexity assessment: score=${Math.round(score)}, model=${specs.modelId || 'unknown'}, action=${specs.action || 'unknown'}`,
      parentId: null,
      metadata: {
        score: Math.round(score),
        model: specs.modelId || "unknown",
        action: specs.action || "unknown",
        timestamp: new Date().toISOString(),
        fileCount: specs.fileCount || 0
      }
    });
  } catch (e) {
    console.debug(`Debug thinking create node failed: ${e.message}`);
  }

  // Phase 3.4: Connect to similar patterns if found
  let connectionsMade = 0;
  if (observation.nodeId && pastPatterns.results && pastPatterns.results.length > 0) {
    try {
      // Connect to top 3 similar patterns
      const patternsToConnect = pastPatterns.results.slice(0, 3);
      
      for (const pattern of patternsToConnect) {
        try {
          await mcp__debug-thinking__debug_thinking({
            action: "connect",
            from: observation.nodeId,
            to: pattern.id,
            type: "supports",
            strength: pattern.similarity || 0.5
          });
          connectionsMade++;
        } catch (connectError) {
          console.debug(`Failed to connect to pattern ${pattern.id}: ${connectError.message}`);
        }
      }
    } catch (e) {
      console.debug(`Pattern connection failed: ${e.message}`);
    }
  }

  // Extract insights from past patterns
  let insights = [];
  if (pastPatterns.results && pastPatterns.results.length > 0) {
    insights = pastPatterns.results.map(p => ({
      id: p.id,
      similarity: p.similarity || 0,
      content: p.content?.substring(0, 100) || "No content"
    }));
  }

  const duration = Date.now() - startTime;

  return {
    pastPatternCount: pastPatterns.results?.length || 0,
    observationId: observation.nodeId,
    connectionsMade,
    learningApplied: (pastPatterns.results?.length || 0) > 0,
    insights: insights.slice(0, 3), // Top 3 insights
    duration,
    degraded: !observation.nodeId
  };
}

module.exports = {
  runLearningPhase
};
