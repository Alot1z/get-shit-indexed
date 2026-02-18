#!/usr/bin/env node

/**
 * Branding Validation Script for get-shit-done-code-index
 * 
 * Validates branding consistency across the codebase:
 * - Package name should be "get-shit-indexed-cc" or "get-shit-indexed"
 * - Command should be "gsi" not "gsd"
 * - No references to "get-shit-done" as the package name
 * 
 * Usage: node scripts/validate-branding.js [--fix] [--verbose]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const VERBOSE = process.argv.includes('--verbose');
const FIX_MODE = process.argv.includes('--fix');

// Expected branding
const EXPECTED = {
  packageName: 'get-shit-indexed-cc',
  shortName: 'get-shit-indexed',
  command: 'gsi',
  cliName: 'GSI',
};

// Patterns to check
const PATTERNS = {
  // Correct patterns (should exist)
  correctPackage: /get-shit-indexed-cc/gi,
  correctShort: /get-shit-indexed/gi,
  correctCommand: /\bgsi\b/gi,
  
  // Incorrect patterns (should NOT exist)
  incorrectPackage: /get-shit-done-cc/gi,
  incorrectCommand: /\bgsd\b/gi,
  
  // Deprecated patterns (flag for review)
  deprecated: {
    // Old command names
    oldCommand: /get-shit-done(?!-code-index)/gi,
  },
};

// Files/directories to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git/,
  /validate-branding\.js$/,
  /package-lock\.json$/,
];

// Allowed exceptions (files that can have old branding for historical reasons)
const ALLOWED_EXCEPTIONS = [
  /CHANGELOG/,  // Changelog documents history
  /README/,     // README may reference history
  /\.npmrc$/,   // NPM config
  /license/i,   // License files
];

// Statistics
const stats = {
  filesScanned: 0,
  correctBranding: 0,
  incorrectBranding: 0,
  deprecatedReferences: 0,
  missingBranding: 0,
};

// Results
const issues = {
  incorrectBranding: [],
  deprecatedReferences: [],
  missingBranding: [],
};

/**
 * Check if a file path should be skipped
 */
function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Check if a file is an allowed exception
 */
function isAllowedException(filePath) {
  return ALLOWED_EXCEPTIONS.some(pattern => pattern.test(filePath));
}

/**
 * Check if content is in a code block
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
 * Scan a file for branding issues
 */
function scanFile(filePath) {
  if (shouldSkip(filePath)) return;
  
  const ext = path.extname(filePath).toLowerCase();
  const isAllowed = isAllowedException(filePath);
  
  // Only scan text-based files
  if (!['.js', '.ts', '.md', '.txt', '.json', '.yml', '.yaml'].includes(ext)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  stats.filesScanned++;
  
  // Check package.json for correct name
  if (filePath.endsWith('package.json')) {
    try {
      const pkg = JSON.parse(content);
      if (pkg.name !== EXPECTED.packageName) {
        issues.missingBranding.push({
          file: filePath,
          issue: `Package name should be "${EXPECTED.packageName}", found "${pkg.name}"`,
        });
        stats.missingBranding++;
      }
    } catch (e) {
      // Invalid JSON, skip
    }
    return; // Don't scan package.json content further
  }
  
  lines.forEach((line, lineIndex) => {
    const lineNum = lineIndex + 1;
    const inCodeBlock = isInCodeBlock(lines, lineIndex);
    
    // Check for incorrect branding
    const incorrectPkg = line.match(PATTERNS.incorrectPackage);
    if (incorrectPkg) {
      stats.incorrectBranding += incorrectPkg.length;
      issues.incorrectBranding.push({
        file: filePath,
        line: lineNum,
        content: line.trim(),
        issue: 'Incorrect package name',
        expected: EXPECTED.packageName,
        found: incorrectPkg[0],
      });
    }
    
    // Check for GSD command (should be GSI)
    // Skip allowed exceptions and documentation about the transition
    if (!isAllowed && !inCodeBlock) {
      const gsdMatch = line.match(PATTERNS.incorrectCommand);
      if (gsdMatch && !line.includes('gsi') && !line.toLowerCase().includes('get-shit-indexed')) {
        stats.incorrectBranding += gsdMatch.length;
        issues.incorrectBranding.push({
          file: filePath,
          line: lineNum,
          content: line.trim(),
          issue: 'Incorrect command',
          expected: EXPECTED.command,
          found: gsdMatch[0],
        });
      }
    }
    
    // Check for deprecated references (warning, not error)
    if (!isAllowed) {
      const deprecatedMatch = line.match(PATTERNS.deprecated.oldCommand);
      if (deprecatedMatch && !line.includes('get-shit-done-code-index')) {
        stats.deprecatedReferences += deprecatedMatch.length;
        issues.deprecatedReferences.push({
          file: filePath,
          line: lineNum,
          content: line.trim(),
          issue: 'Deprecated reference to old package name',
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
 * Print the report
 */
function printReport() {
  console.log('\n' + '='.repeat(60));
  console.log('BRANDING VALIDATION REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n📋 Expected Branding:`);
  console.log(`   Package name: ${EXPECTED.packageName}`);
  console.log(`   Short name:   ${EXPECTED.shortName}`);
  console.log(`   Command:      ${EXPECTED.command}`);
  
  console.log(`\n📊 Statistics:`);
  console.log(`   Files scanned:          ${stats.filesScanned}`);
  console.log(`   Incorrect branding:     ${stats.incorrectBranding}`);
  console.log(`   Deprecated references:  ${stats.deprecatedReferences}`);
  console.log(`   Missing branding:       ${stats.missingBranding}`);
  
  if (issues.incorrectBranding.length > 0) {
    console.log('\n❌ Incorrect Branding (must fix):');
    issues.incorrectBranding.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`     Issue: ${issue.issue}`);
      console.log(`     Expected: ${issue.expected}, Found: ${issue.found}`);
      if (VERBOSE) console.log(`     → ${issue.content.substring(0, 80)}...`);
    });
  }
  
  if (issues.missingBranding.length > 0) {
    console.log('\n❌ Missing/Incorrect Branding:');
    issues.missingBranding.forEach(issue => {
      console.log(`   ${issue.file}`);
      console.log(`     ${issue.issue}`);
    });
  }
  
  if (issues.deprecatedReferences.length > 0) {
    console.log('\n⚠️  Deprecated References (review):');
    issues.deprecatedReferences.slice(0, 10).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      if (VERBOSE) console.log(`     → ${issue.content.substring(0, 80)}...`);
    });
    if (issues.deprecatedReferences.length > 10) {
      console.log(`   ... and ${issues.deprecatedReferences.length - 10} more`);
    }
  }
  
  const hasErrors = stats.incorrectBranding > 0 || stats.missingBranding > 0;
  const hasWarnings = stats.deprecatedReferences > 0;
  
  console.log('\n' + '='.repeat(60));
  if (!hasErrors && !hasWarnings) {
    console.log('✅ BRANDING VALIDATION PASSED');
  } else if (!hasErrors && hasWarnings) {
    console.log('⚠️  BRANDING VALIDATION PASSED WITH WARNINGS');
  } else {
    console.log('❌ BRANDING VALIDATION FAILED');
    console.log(`   Incorrect branding: ${stats.incorrectBranding}`);
    console.log(`   Missing branding:   ${stats.missingBranding}`);
    console.log(`   Deprecated refs:    ${stats.deprecatedReferences}`);
  }
  console.log('='.repeat(60));
  
  return !hasErrors;
}

// Main execution
console.log('Branding Validator for get-shit-done-code-index');
console.log('Project root:', PROJECT_ROOT);
console.log('');

scanDirectory(PROJECT_ROOT);
const success = printReport();

process.exit(success ? 0 : 1);
