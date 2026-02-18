#!/usr/bin/env node

/**
 * Comprehensive Validation Script for get-shit-done-code-index
 * 
 * Performs multiple validation checks:
 * - CodeGraphContext references (should be 0)
 * - Hardcoded paths (should be 0)
 * - GSD commands (should be 0)
 * - Reference validity (delegates to validate-references.js)
 * - Branding consistency (delegates to validate-branding.js)
 * 
 * Usage: node scripts/validate.js [--fix] [--verbose] [--skip-refs] [--skip-brand]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const VERBOSE = process.argv.includes('--verbose');
const FIX_MODE = process.argv.includes('--fix');
const SKIP_REFS = process.argv.includes('--skip-refs');
const SKIP_BRAND = process.argv.includes('--skip-brand');

// Patterns to detect
const PATTERNS = {
  // CodeGraphContext references - these should NOT exist
  codeGraphContext: /CodeGraphContext/gi,
  
  // Hardcoded Windows paths (C:\Users\..., D:\projects\..., etc.)
  hardcodedWindowsPath: /[A-Z]:\\(?:Users|home|projects|github|repos|code|dev|workspace)[\\\/][^\s"'\)]+/gi,
  
  // Hardcoded Unix paths (/home/user/..., /Users/... without @ prefix)
  hardcodedUnixPath: /(?<!@)(?:\/home\/[^\s"'\)]+|\/Users\/[^\s"'\)]+)/gi,
  
  // GSD commands (should use gsi instead)
  gsdCommand: /\bgsd\b/gi,
  
  // Old package name references
  oldPackageName: /get-shit-done(?!-code-index)/gi,
};

// Files/directories to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git/,
  /validate\.js$/,  // This script
  /validate-references\.js$/,
  /validate-branding\.js$/,
  /\.test\.js$/,  // Test files
  /__tests__/,
];

// Statistics
const stats = {
  filesScanned: 0,
  codeGraphContextRefs: 0,
  hardcodedPaths: 0,
  gsdCommands: 0,
  oldPackageNames: 0,
  totalIssues: 0,
};

// Results
const issues = {
  codeGraphContext: [],
  hardcodedPaths: [],
  gsdCommands: [],
  oldPackageNames: [],
};

/**
 * Check if a file path should be skipped
 */
function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Check if content is in a code block (should be skipped)
 */
function isInCodeBlock(lines, lineIndex) {
  let inCodeBlock = false;
  for (let i = 0; i < lineIndex; i++) {
    if (lines[i].match(/^```/)) {
      inCodeBlock = !inCodeBlock;
    }
  }
  return inCodeBlock;
}

/**
 * Scan a file for issues
 */
function scanFile(filePath) {
  if (shouldSkip(filePath)) return;
  
  // Only scan text-based files
  const ext = path.extname(filePath).toLowerCase();
  if (!['.js', '.ts', '.md', '.txt', '.json', '.yml', '.yaml'].includes(ext)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  stats.filesScanned++;
  
  lines.forEach((line, lineIndex) => {
    const lineNum = lineIndex + 1;
    const inCodeBlock = isInCodeBlock(lines, lineIndex);
    
    // Skip lines in code blocks (examples, not actual code)
    if (inCodeBlock && ext === '.md') return;
    
    // Check for CodeGraphContext references
    const cgcMatches = line.match(PATTERNS.codeGraphContext);
    if (cgcMatches) {
      stats.codeGraphContextRefs += cgcMatches.length;
      stats.totalIssues += cgcMatches.length;
      issues.codeGraphContext.push({
        file: filePath,
        line: lineNum,
        content: line.trim(),
        count: cgcMatches.length,
      });
    }
    
    // Check for hardcoded paths
    const winMatches = line.match(PATTERNS.hardcodedWindowsPath);
    const unixMatches = line.match(PATTERNS.hardcodedUnixPath);
    const pathMatches = (winMatches || []).concat(unixMatches || []);
    if (pathMatches.length > 0) {
      // Filter out intentional @references
      const filtered = pathMatches.filter(p => !line.includes(`@${p}`));
      if (filtered.length > 0) {
        stats.hardcodedPaths += filtered.length;
        stats.totalIssues += filtered.length;
        issues.hardcodedPaths.push({
          file: filePath,
          line: lineNum,
          content: line.trim(),
          paths: filtered,
        });
      }
    }
    
    // Check for GSD commands (skip if in validate.js itself or documentation about GSD)
    if (!filePath.includes('validate') && !line.includes('get-shit-done-code-index')) {
      const gsdMatches = line.match(PATTERNS.gsdCommand);
      if (gsdMatches && !line.includes('gsi') && !line.includes('get-shit-indexed')) {
        stats.gsdCommands += gsdMatches.length;
        stats.totalIssues += gsdMatches.length;
        issues.gsdCommands.push({
          file: filePath,
          line: lineNum,
          content: line.trim(),
        });
      }
    }
    
    // Check for old package name references
    // Skip files that legitimately reference the old name
    if (!filePath.includes('package.json') && 
        !filePath.includes('README') && 
        !filePath.includes('CHANGELOG') &&
        !filePath.includes('validate')) {
      const oldNameMatches = line.match(PATTERNS.oldPackageName);
      if (oldNameMatches && !line.includes('get-shit-done-code-index')) {
        stats.oldPackageNames += oldNameMatches.length;
        stats.totalIssues += oldNameMatches.length;
        issues.oldPackageNames.push({
          file: filePath,
          line: lineNum,
          content: line.trim(),
        });
      }
    }
  });
}

/**
 * Recursively scan a directory
 */
function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (shouldSkip(fullPath)) continue;
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      if (VERBOSE) console.log(`Scanning: ${fullPath}`);
      scanFile(fullPath);
    }
  }
}

/**
 * Run reference validation
 */
function runReferenceValidation() {
  if (SKIP_REFS) {
    console.log('⏭️  Skipping reference validation');
    return true;
  }
  
  console.log('\n🔍 Running reference validation...');
  try {
    execSync('node scripts/validate-references.js', {
      cwd: PROJECT_ROOT,
      stdio: VERBOSE ? 'inherit' : 'pipe',
    });
    console.log('✅ Reference validation passed');
    return true;
  } catch (error) {
    console.log('❌ Reference validation failed');
    if (VERBOSE && error.stdout) {
      console.log(error.stdout.toString());
    }
    return false;
  }
}

/**
 * Run branding validation
 */
function runBrandingValidation() {
  if (SKIP_BRAND) {
    console.log('⏭️  Skipping branding validation');
    return true;
  }
  
  console.log('\n🔍 Running branding validation...');
  try {
    execSync('node scripts/validate-branding.js', {
      cwd: PROJECT_ROOT,
      stdio: VERBOSE ? 'inherit' : 'pipe',
    });
    console.log('✅ Branding validation passed');
    return true;
  } catch (error) {
    console.log('❌ Branding validation failed');
    if (VERBOSE && error.stdout) {
      console.log(error.stdout.toString());
    }
    return false;
  }
}

/**
 * Print the report
 */
function printReport() {
  console.log('\n' + '='.repeat(60));
  console.log('COMPREHENSIVE VALIDATION REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n📊 Scan Statistics:`);
  console.log(`   Files scanned:        ${stats.filesScanned}`);
  console.log(`   Total issues found:   ${stats.totalIssues}`);
  
  if (issues.codeGraphContext.length > 0) {
    console.log('\n❌ CodeGraphContext References (must remove):');
    issues.codeGraphContext.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} (${issue.count}x)`);
      if (VERBOSE) console.log(`     → ${issue.content.substring(0, 80)}...`);
    });
  }
  
  if (issues.hardcodedPaths.length > 0) {
    console.log('\n❌ Hardcoded Paths (must fix):');
    issues.hardcodedPaths.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      if (VERBOSE) {
        console.log(`     → ${issue.paths.join(', ')}`);
        console.log(`     → ${issue.content.substring(0, 80)}...`);
      }
    });
  }
  
  if (issues.gsdCommands.length > 0) {
    console.log('\n⚠️  GSD Commands (should use gsi instead):');
    issues.gsdCommands.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      if (VERBOSE) console.log(`     → ${issue.content.substring(0, 80)}...`);
    });
  }
  
  if (issues.oldPackageNames.length > 0) {
    console.log('\n⚠️  Old Package Name References:');
    issues.oldPackageNames.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      if (VERBOSE) console.log(`     → ${issue.content.substring(0, 80)}...`);
    });
  }
  
  const success = stats.totalIssues === 0;
  console.log('\n' + '='.repeat(60));
  if (success) {
    console.log('✅ VALIDATION PASSED - No issues found');
  } else {
    console.log('❌ VALIDATION FAILED - Issues found');
    console.log(`   CodeGraphContext: ${stats.codeGraphContextRefs}`);
    console.log(`   Hardcoded paths:  ${stats.hardcodedPaths}`);
    console.log(`   GSD commands:     ${stats.gsdCommands}`);
    console.log(`   Old names:        ${stats.oldPackageNames}`);
  }
  console.log('='.repeat(60));
  
  return success;
}

// Main execution
console.log('Comprehensive Validator for get-shit-done-code-index');
console.log('Project root:', PROJECT_ROOT);
console.log('');

console.log('🔍 Scanning for issues...');
scanDirectory(PROJECT_ROOT);

const scanSuccess = printReport();

// Run sub-validations
const refSuccess = runReferenceValidation();
const brandSuccess = runBrandingValidation();

// Overall success
const overallSuccess = scanSuccess && refSuccess && brandSuccess;

console.log('\n' + '='.repeat(60));
if (overallSuccess) {
  console.log('✅ ALL VALIDATIONS PASSED');
} else {
  console.log('❌ SOME VALIDATIONS FAILED');
}
console.log('='.repeat(60));

process.exit(overallSuccess ? 0 : 1);
