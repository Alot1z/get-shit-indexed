// Phase 1: Structure Analysis (Tractatus + Code-Index MCP)
// Analyzes plan structure using logical decomposition interleaved with file summaries

/**
 * Phase 1: Structure Analysis
 * Uses Tractatus thinking for logical structure analysis, interleaved with
 * Code-Index MCP for file-level metrics.
 *
 * Flow:
 * 1. Start Tractatus analysis session
 * 2. Use CI to get file summaries (line counts, function counts)
 * 3. Add structural propositions to Tractatus
 * 4. Export structured analysis
 *
 * @param {string} planPath - Path to plan file being analyzed
 * @param {object} planMetrics - Plan metrics (files, tasks, etc.)
 * @returns {Promise<object>} Structure analysis result
 */
async function runStructurePhase(planPath, planMetrics) {
  const startTime = Date.now();
  const files = planMetrics.files || [];

  // Phase 1.1: Start Tractatus analysis
  // Using tractatus thinking for logical decomposition of plan structure
  const tractatusResult = await mcp__tractatusthinking__tractatus_thinking({
    operation: "start",
    concept: `Analyze plan structure for complexity factors: ${planPath}`,
    thoughts: `Plan has ${files.length} files and ${(planMetrics.tasks || []).length} tasks. Need to assess structural complexity.`,
    depth_limit: 3,
    style: "analytical"
  });

  const sessionId = tractatusResult.session_id || "unknown";

  // Phase 1.2: Use Code-Index MCP to get file summaries
  // Batch file analysis for efficiency
  let fileSummaries = [];
  let totalLines = 0;
  let totalFunctions = 0;

  if (files.length > 0) {
    try {
      // Get summaries for first 10 files (token optimization)
      const filesToAnalyze = files.slice(0, 10);
      
      for (const file of filesToAnalyze) {
        try {
          const summary = await mcp__code-index-mcp__get_file_summary({
            file_path: file
          });
          
          if (summary) {
            fileSummaries.push(summary);
            totalLines += summary.lineCount || 0;
            totalFunctions += summary.functionCount || 0;
          }
        } catch (e) {
          // Silently skip files that can't be analyzed
          console.debug(`Skipping ${file}: ${e.message}`);
        }
      }
    } catch (e) {
      // CI might not be available - use defaults
      console.debug(`Code-Index unavailable for structure phase: ${e.message}`);
    }
  }

  // Phase 1.3: Add structural propositions to Tractatus
  try {
    await mcp__tractatusthinking__tractatus_thinking({
      operation: "add",
      session_id: sessionId,
      content: `Files analyzed: ${fileSummaries.length} of ${files.length}, total lines: ${totalLines}, total functions: ${totalFunctions}`,
      parent_number: null,
      confidence: 0.8
    });
  } catch (e) {
    // Tractatus might not be available - continue without it
    console.debug(`Tractatus unavailable for structure phase: ${e.message}`);
  }

  // Phase 1.4: Export analysis
  let structuralComplexity = 5; // Default moderate complexity
  
  try {
    const analysis = await mcp__tractatusthinking__tractatus_thinking({
      operation: "export",
      session_id: sessionId,
      format: "json"
    });
    
    // Extract complexity from analysis if available
    if (analysis && analysis.propositions) {
      structuralComplexity = Math.min(10, Math.max(1, analysis.propositions.length / 2));
    }
  } catch (e) {
    // Calculate structural complexity from metrics if Tractatus unavailable
    structuralComplexity = calculateStructuralComplexity(files.length, totalLines, totalFunctions);
  }

  const duration = Date.now() - startTime;

  return {
    fileCount: files.length,
    filesAnalyzed: fileSummaries.length,
    totalLines,
    totalFunctions,
    structuralComplexity: Math.round(structuralComplexity * 10) / 10,
    tractatusSession: sessionId,
    duration,
    degraded: fileSummaries.length === 0 || !sessionId || sessionId === "unknown"
  };
}

/**
 * Calculate structural complexity from basic metrics.
 * Used as fallback when Tractatus is unavailable.
 *
 * @param {number} fileCount - Number of files
 * @param {number} totalLines - Total lines of code
 * @param {number} totalFunctions - Total functions
 * @returns {number} Structural complexity (1-10 scale)
 */
function calculateStructuralComplexity(fileCount, totalLines, totalFunctions) {
  // Base complexity from file count
  let complexity = Math.min(10, 1 + (fileCount / 5));
  
  // Adjust for code volume
  if (totalLines > 1000) complexity += 1;
  if (totalLines > 5000) complexity += 1;
  
  // Adjust for functional complexity
  if (totalFunctions > 50) complexity += 0.5;
  if (totalFunctions > 200) complexity += 0.5;
  
  return Math.min(10, Math.max(1, complexity));
}

module.exports = {
  runStructurePhase,
  calculateStructuralComplexity
};
