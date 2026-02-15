/**
 * Workflow Thinking Validator
 *
 * Validates that GSI workflow files have proper thinking phases integrated.
 * Ensures cognitive enhancement at workflow execution points.
 *
 * @module lib/workflow-thinking/validator
 */

const fs = require('fs');
const path = require('path');

/**
 * Thinking phase types that should be present in workflows
 */
const THINKING_PHASE_TYPES = [
  'PRE_WORKFLOW',
  'PRE_STEP',
  'POST_STEP',
  'POST_WORKFLOW'
];

/**
 * Valid thinking servers
 */
const VALID_SERVERS = [
  'tractatus',
  'sequential',
  'debug'
];

/**
 * Default timeout values (in milliseconds)
 */
const TIMEOUT_DEFAULTS = {
  quick: 2000,
  standard: 3000,
  complex: 5000,
  deep: 8000
};

/**
 * Valid timeout range
 */
const TIMEOUT_RANGE = {
  min: 1000,
  max: 10000,
  recommended: 3000
};

/**
 * Validation result structure
 */
class ValidationResult {
  constructor(filePath) {
    this.filePath = filePath;
    this.hasThinkingPhases = false;
    this.phaseTypes = [];
    this.issues = [];
    this.warnings = [];
    this.serverCounts = { tractatus: 0, sequential: 0, debug: 0 };
    this.timeoutValues = [];
    this.balancedPhases = { preWorkflow: false, postWorkflow: false };
  }

  addIssue(severity, message, location) {
    const issue = { severity, message, location };
    if (severity === 'error') {
      this.issues.push(issue);
    } else {
      this.warnings.push(issue);
    }
  }

  isValid() {
    return this.hasThinkingPhases && this.issues.length === 0;
  }

  getSummary() {
    return {
      file: this.filePath,
      valid: this.isValid(),
      hasPhases: this.hasThinkingPhases,
      phaseTypes: this.phaseTypes,
      serverCounts: this.serverCounts,
      issues: this.issues.length,
      warnings: this.warnings.length,
      balanced: this.isBalanced()
    };
  }

  isBalanced() {
    return this.balancedPhases.preWorkflow && this.balancedPhases.postWorkflow;
  }
}

/**
 * Extract thinking phase sections from workflow content
 */
function extractThinkingPhases(content) {
  const phases = [];
  const thinkingPhaseRegex = /##\s+Thinking\s+Phase[^\n]*\n<server>(\w+)<\/server>/gi;
  let match;

  while ((match = thinkingPhaseRegex.exec(content)) !== null) {
    phases.push({
      server: match[1],
      startIndex: match.index,
      fullMatch: match[0]
    });
  }

  return phases;
}

/**
 * Detect phase type from thinking phase content
 */
function detectPhaseType(content, startIndex) {
  const precedingContent = content.substring(0, startIndex);

  // Look for phase type indicators in the preceding content
  if (/pre-workflow|Pre-Workflow/i.test(precedingContent.slice(-200))) {
    return 'PRE_WORKFLOW';
  }
  if (/pre-step|Pre-Step/i.test(precedingContent.slice(-100))) {
    return 'PRE_STEP';
  }
  if (/post-step|Post-Step/i.test(precedingContent.slice(-100))) {
    return 'POST_STEP';
  }
  if (/post-workflow|Post-Workflow/i.test(precedingContent.slice(-200))) {
    return 'POST_WORKFLOW';
  }

  return 'UNKNOWN';
}

/**
 * Extract timeout value from thinking phase
 */
function extractTimeout(thinkingPhaseContent) {
  const timeoutMatch = /<timeout>(\d+)<\/timeout>/i.exec(thinkingPhaseContent);
  if (timeoutMatch) {
    return parseInt(timeoutMatch[1], 10);
  }
  return null;
}

/**
 * Validate workflow thinking phases
 */
function validate(filePath) {
  const result = new ValidationResult(filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract all thinking phases
    const phases = extractThinkingPhases(content);

    if (phases.length === 0) {
      result.addIssue('error', 'No thinking phases found in workflow', 'entire file');
      return result;
    }

    result.hasThinkingPhases = true;

    // Analyze each thinking phase
    for (const phase of phases) {
      // Validate server
      if (!VALID_SERVERS.includes(phase.server)) {
        result.addIssue(
          'error',
          `Invalid thinking server: "${phase.server}". Must be one of: ${VALID_SERVERS.join(', ')}`,
          `server: ${phase.server}`
        );
      } else {
        result.serverCounts[phase.server]++;
      }

      // Detect phase type
      const phaseType = detectPhaseType(content, phase.startIndex);
      if (!result.phaseTypes.includes(phaseType)) {
        result.phaseTypes.push(phaseType);
      }

      // Extract thinking phase section content
      const sectionStart = content.indexOf('## Thinking Phase', phase.startIndex);
      const sectionEnd = content.indexOf('##', sectionStart + 2);
      const phaseContent = content.substring(
        sectionStart,
        sectionEnd === -1 ? content.length : sectionEnd
      );

      // Validate timeout
      const timeout = extractTimeout(phaseContent);
      if (timeout !== null) {
        result.timeoutValues.push(timeout);

        if (timeout < TIMEOUT_RANGE.min || timeout > TIMEOUT_RANGE.max) {
          result.addIssue(
            'warning',
            `Timeout ${timeout}ms is outside recommended range (${TIMEOUT_RANGE.min}-${TIMEOUT_RANGE.max}ms)`,
            `timeout: ${timeout}ms`
          );
        }
      } else {
        result.addIssue(
          'warning',
          'No timeout specified in thinking phase (using default 3000ms)',
          'thinking phase'
        );
      }

      // Check for balanced phases
      if (phaseType === 'PRE_WORKFLOW') {
        result.balancedPhases.preWorkflow = true;
      } else if (phaseType === 'POST_WORKFLOW') {
        result.balancedPhases.postWorkflow = true;
      }
    }

    // Check for balanced pre/post workflow phases
    if (result.balancedPhases.preWorkflow && !result.balancedPhases.postWorkflow) {
      result.addIssue(
        'warning',
        'Has PRE_WORKFLOW thinking but missing POST_WORKFLOW thinking',
        'workflow structure'
      );
    } else if (!result.balancedPhases.preWorkflow && result.balancedPhases.postWorkflow) {
      result.addIssue(
        'warning',
        'Has POST_WORKFLOW thinking but missing PRE_WORKFLOW thinking',
        'workflow structure'
      );
    }

    // Check for reasonable number of thinking phases
    if (phases.length < 2) {
      result.addIssue(
        'warning',
        `Only ${phases.length} thinking phase(s) found. Workflows typically benefit from thinking at multiple points.`,
        'thinking phase coverage'
      );
    }

  } catch (error) {
    result.addIssue('error', `Failed to read workflow file: ${error.message}`, 'file access');
  }

  return result;
}

/**
 * Validate multiple workflow files
 */
function validateMultiple(filePaths) {
  const results = [];

  for (const filePath of filePaths) {
    const result = validate(filePath);
    results.push(result);
  }

  return results;
}

/**
 * Generate validation report
 */
function generateReport(results, format = 'text') {
  if (format === 'json') {
    return JSON.stringify(
      {
        summary: {
          total: results.length,
          valid: results.filter(r => r.isValid()).length,
          invalid: results.filter(r => !r.isValid()).length,
          withWarnings: results.filter(r => r.warnings.length > 0).length
        },
        results: results.map(r => r.getSummary())
      },
      null,
      2
    );
  }

  // Text format
  let report = '# Workflow Thinking Validation Report\n\n';

  // Summary
  const valid = results.filter(r => r.isValid()).length;
  const invalid = results.filter(r => !r.isValid()).length;
  const withWarnings = results.filter(r => r.warnings.length > 0).length;

  report += '## Summary\n';
  report += `- Total workflows: ${results.length}\n`;
  report += `- Valid: ${valid}\n`;
  report += `- Invalid: ${invalid}\n`;
  report += `- With warnings: ${withWarnings}\n\n`;

  // Individual results
  report += '## Results\n\n';

  for (const result of results) {
    const summary = result.getSummary();
    const status = summary.valid ? '✓ PASS' : '✗ FAIL';
    const balanceStatus = summary.balanced ? ' (balanced)' : ' (unbalanced)';

    report += `### ${status}${balanceStatus} - ${path.basename(summary.file)}\n\n`;
    report += `- Phase types: ${summary.phaseTypes.join(', ') || 'None detected'}\n`;
    report += `- Servers: tractatus(${summary.serverCounts.tractatus}) ` +
              `sequential(${summary.serverCounts.sequential}) ` +
              `debug(${summary.serverCounts.debug})\n`;
    report += `- Issues: ${summary.issues}\n`;
    report += `- Warnings: ${summary.warnings}\n\n`;

    // Show issues and warnings
    if (result.issues.length > 0) {
      report += '**Issues:**\n';
      for (const issue of result.issues) {
        report += `- [${issue.severity.toUpperCase()}] ${issue.message} (${issue.location})\n`;
      }
      report += '\n';
    }

    if (result.warnings.length > 0) {
      report += '**Warnings:**\n';
      for (const warning of result.warnings) {
        report += `- [${warning.severity.toUpperCase()}] ${warning.message} (${warning.location})\n`;
      }
      report += '\n';
    }
  }

  return report;
}

/**
 * Find all workflow files in a directory
 */
function findWorkflowFiles(dir) {
  const workflowsDir = path.join(dir, 'workflows');
  const files = [];

  if (!fs.existsSync(workflowsDir)) {
    return files;
  }

  const entries = fs.readdirSync(workflowsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(path.join(workflowsDir, entry.name));
    }
  }

  return files;
}

/**
 * CLI entry point
 */
function main() {
  const args = process.argv.slice(2);
  const projectDir = args[0] || process.cwd();
  const format = args.includes('--json') ? 'json' : 'text';

  const workflowFiles = findWorkflowFiles(projectDir);

  if (workflowFiles.length === 0) {
    console.error('No workflow files found');
    process.exit(1);
  }

  const results = validateMultiple(workflowFiles);
  const report = generateReport(results, format);

  console.log(report);

  // Exit with error code if any validation failed
  const hasFailures = results.some(r => !r.isValid());
  process.exit(hasFailures ? 1 : 0);
}

// Export for programmatic use
module.exports = {
  validate,
  validateMultiple,
  generateReport,
  findWorkflowFiles,
  ValidationResult,
  THINKING_PHASE_TYPES,
  VALID_SERVERS,
  TIMEOUT_DEFAULTS,
  TIMEOUT_RANGE
};

// Run as CLI if executed directly
if (require.main === module) {
  main();
}
