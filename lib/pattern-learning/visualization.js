/**
 * Pattern Visualization
 * 
 * Generates reports and Mermaid diagrams for learned patterns.
 */

const { getPatternStats } = require('./storage');

/**
 * Generate comprehensive pattern report
 * @returns {Promise<string>} Markdown report
 */
async function generatePatternReport() {
  const stats = await getPatternStats();

  const report = [];

  report.push('# Pattern Learning Report');
  report.push('');
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push('');

  // Summary
  report.push('## Summary');
  report.push('');
  report.push(`- **Total Patterns**: ${stats.totalPatterns}`);
  report.push(`- **Sequences**: ${stats.totalSequences}`);
  report.push(`- **Conditions**: ${stats.totalConditions}`);
  report.push(`- **Optimizations**: ${stats.totalOptimizations}`);
  report.push('');

  // Top Sequences
  if (stats.topSequences.length > 0) {
    report.push('## Top Sequences');
    report.push('');
    report.push('| Sequence | Length | Frequency | Score |');
    report.push('|----------|--------|-----------|-------|');

    for (const seq of stats.topSequences) {
      const seqStr = seq.operations.join(' → ');
      report.push(`| ${seqStr} | ${seq.length} | ${seq.frequency} | ${seq.score} |`);
    }

    report.push('');
  }

  // Top Conditions
  if (stats.topConditions.length > 0) {
    report.push('## Top Conditions');
    report.push('');
    report.push('| Type | Feature | Frequency | Confidence |');
    report.push('|------|---------|-----------|------------|');

    for (const cond of stats.topConditions) {
      report.push(`| ${cond.type} | \`${cond.feature}\` | ${cond.frequency} | ${(cond.confidence * 100).toFixed(0)}% |`);
    }

    report.push('');
  }

  // Top Optimizations
  if (stats.topOptimizations.length > 0) {
    report.push('## Top Optimizations');
    report.push('');
    report.push('| Type | Tool | Suggestion | Potential Savings | Confidence |');
    report.push('|------|------|------------|-------------------|------------|');

    for (const opt of stats.topOptimizations) {
      report.push(`| ${opt.type} | ${opt.tool} | ${opt.suggestion} | ${opt.potentialSavings} | ${(opt.confidence * 100).toFixed(0)}% |`);
    }

    report.push('');
  }

  // Efficiency Metrics
  report.push('## Efficiency Metrics');
  report.push('');
  report.push('### Token Savings');
  report.push('');

  const tokenOptimizations = stats.topOptimizations.filter(o => o.type === 'token_optimization');
  if (tokenOptimizations.length > 0) {
    const totalSavings = tokenOptimizations.reduce((sum, o) => sum + (o.potentialSavings || 0), 0);
    report.push(`- **Total Potential Token Savings**: ${totalSavings.toLocaleString()} tokens`);
    report.push(`- **Token Optimization Opportunities**: ${tokenOptimizations.length}`);
    report.push('');
  } else {
    report.push('No token optimization patterns detected yet.');
    report.push('');
  }

  report.push('### Time Savings');
  report.push('');

  const timeOptimizations = stats.topOptimizations.filter(o => o.type === 'time_optimization');
  if (timeOptimizations.length > 0) {
    const totalSavings = timeOptimizations.reduce((sum, o) => sum + (o.potentialSavings || 0), 0);
    report.push(`- **Total Potential Time Savings**: ${totalSavings.toLocaleString()}ms`);
    report.push(`- **Time Optimization Opportunities**: ${timeOptimizations.length}`);
    report.push('');
  } else {
    report.push('No time optimization patterns detected yet.');
    report.push('');
  }

  return report.join('\n');
}

/**
 * Generate Mermaid diagram for a sequence
 * @param {object} pattern - Pattern object (sequence)
 * @returns {string} Mermaid diagram
 */
function generateMermaidDiagram(pattern) {
  if (!pattern || !pattern.operations) {
    return '';
  }

  const lines = [];
  lines.push('```mermaid');
  lines.push('graph LR');

  // Generate nodes
  for (let i = 0; i < pattern.operations.length; i++) {
    const op = pattern.operations[i].replace(/[^a-zA-Z0-9]/g, '_');
    lines.push(`  ${op}[${pattern.operations[i]}]`);

    // Add edge to next operation
    if (i < pattern.operations.length - 1) {
      const nextOp = pattern.operations[i + 1].replace(/[^a-zA-Z0-9]/g, '_');
      lines.push(`  ${op} -->|${pattern.frequency}x| ${nextOp}`);
    }
  }

  // Add metadata
  lines.push('');
  lines.push('classDef sequenceNode fill:#7dcfff,stroke:#bb9af7,stroke-width:2px;');
  lines.push('class ' + pattern.operations.map(op => op.replace(/[^a-zA-Z0-9]/g, '_')).join(',') + ' sequenceNode;');
  lines.push('```');

  return lines.join('\n');
}

/**
 * Generate comprehensive visualization report
 * @returns {Promise<string>} Full visualization report with diagrams
 */
async function generateVisualizationReport() {
  const stats = await getPatternStats();
  const report = [];

  report.push('# Pattern Learning Visualization');
  report.push('');
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push('');

  // Overview diagram (if we have sequences)
  if (stats.topSequences.length > 0) {
    report.push('## Top Sequence Patterns');
    report.push('');
    report.push('### Most Common Operation Flow');
    report.push('');
    report.push(generateMermaidDiagram(stats.topSequences[0]));
    report.push('');
  }

  // Success/failure conditions diagram
  if (stats.topConditions.length > 0) {
    report.push('## Condition Patterns');
    report.push('');
    report.push('```mermaid');
    report.push('graph TD');

    const successConds = stats.topConditions.filter(c => c.type === 'success_condition').slice(0, 3);
    const failureConds = stats.topConditions.filter(c => c.type === 'failure_condition').slice(0, 3);

    let nodeId = 0;
    for (const cond of successConds) {
      const id = `success${nodeId++}`;
      report.push(`  ${id}[SUCCESS: ${cond.feature}]`);
      report.push(`  ${id}:::successNode`);
    }

    for (const cond of failureConds) {
      const id = `failure${nodeId++}`;
      report.push(`  ${id}[FAILURE: ${cond.feature}]`);
      report.push(`  ${id}:::failureNode`);
    }

    report.push('');
    report.push('classDef successNode fill:#9ece6a,stroke:#73daca,stroke-width:2px;');
    report.push('classDef failureNode fill:#f7768e,stroke:#db4b4b,stroke-width:2px;');
    report.push('```');
    report.push('');
  }

  // Optimization opportunities diagram
  if (stats.topOptimizations.length > 0) {
    report.push('## Optimization Opportunities');
    report.push('');
    report.push('```mermaid');
    report.push('mindmap');
    report.push('  root((Optimizations))');

    for (const opt of stats.topOptimizations.slice(0, 5)) {
      const safeName = opt.suggestion.replace(/[^a-zA-Z0-9]/g, '_');
      report.push(`    ${safeName}[${opt.suggestion}]`);
      report.push(`      ${safeName}_tool[${opt.tool}]`);
      report.push(`      ${safeName}_savings[${opt.potentialSavings}]`);
    }

    report.push('```');
    report.push('');
  }

  return report.join('\n');
}

/**
 * Export report to file
 * @param {string} filePath - Path to save report
 * @param {string} content - Report content
 */
async function exportReport(filePath, content) {
  const fs = require('fs');
  fs.writeFileSync(filePath, content, 'utf8');
}

module.exports = {
  generatePatternReport,
  generateMermaidDiagram,
  generateVisualizationReport,
  exportReport
};
