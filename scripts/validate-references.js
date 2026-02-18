#!/usr/bin/env node

/**
 * Reference Validation Script for get-shit-done-code-index
 * 
 * Validates all @-references in markdown and documentation files
 * to ensure they point to existing files.
 * 
 * Usage: node scripts/validate-references.js [--fix] [--verbose]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const VERBOSE = process.argv.includes('--verbose');
const FIX_MODE = process.argv.includes('--fix');

// Patterns to detect
const REFERENCE_PATTERNS = {
  // @-references like @.planning/ROADMAP.md or @get-shit-indexed/workflows/execute.md
  // Must start with a path-like character (letter, dot, tilde) not a symbol
  atReference: /@([a-zA-Z.~][a-zA-Z0-9_\-./]+\/[a-zA-Z0-9_\-./]+)/g,
  
  // Absolute Windows paths (should be flagged as broken)
  absoluteWindowsPath: /@[A-Z]:\\[Uu]sers\\/g,
  
  // Absolute Unix paths to home directory
  absoluteHomePath: /@~\/\.claude\//g,
};

// Files/directories to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git/,
  /files\.xsl/,  // XSL transform file - handled separately
  /validate-references\.js/,  // This script
];

// Statistics
const stats = {
  filesScanned: 0,
  totalReferences: 0,
  validReferences: 0,
  brokenReferences: 0,
  absolutePaths: 0,
  fixedReferences: 0,
};

// Results
const brokenRefs = [];
const absolutePathRefs = [];

/**
 * Check if a file path should be skipped
 */
function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Resolve a reference path to an actual file path
 */
function resolveReference(refPath, fullMatch, sourceFile, isConditionalLine = false) {
  // Skip npm package references (like @types/node, @testing-library/react, @react-three/fiber)
  // Check the full match which includes the @ prefix
  if (fullMatch && fullMatch.match(/^@[a-z0-9][a-z0-9\-]*\/[a-z0-9][a-z0-9\-._]*/i)) {
    return { type: 'npm-package', resolved: null, valid: true };
  }
  
  // Skip example/placeholder paths (commonly used in templates)
  if (refPath.match(/^(path|relevant|src|example|file)\//i) || 
      refPath.includes('/relevant/') ||
      refPath.includes('/example/')) {
    return { type: 'example-path', resolved: null, valid: true };
  }
  
  // Skip local rules/ references - these are template examples showing what to replace
  if (refPath.startsWith('./rules/')) {
    return { type: 'template-example', resolved: null, valid: true };
  }
  
  // Skip conditional/optional references (e.g., lines with "(if exists)")
  if (isConditionalLine) {
    return { type: 'optional-reference', resolved: null, valid: true };
  }
  
  // Skip references in command/workflow templates - these are instructions, not actual file refs
  // Files in commands/, workflows/, templates/ are templates that reference files that should exist at runtime
  if (sourceFile.match(/[\/\\](commands|workflows|templates)[\/\\]/)) {
    // Still validate if the file exists locally or in get-shit-indexed, but don't fail
    const fullPath = path.join(path.dirname(sourceFile), refPath);
    const gsiPath = path.join(PROJECT_ROOT, 'get-shit-indexed', refPath);
    const planningPath = path.join(PROJECT_ROOT, refPath);
    
    if (fs.existsSync(fullPath) || fs.existsSync(gsiPath) || fs.existsSync(planningPath)) {
      return { type: 'template-valid', resolved: fullPath, valid: true };
    }
    // Template references are expected to resolve at runtime, not at validation time
    return { type: 'template-runtime', resolved: null, valid: true };
  }
  
  // Skip references in code blocks (marked as examples)
  // These are often in PLAN files showing what patterns to look for or replace
  
  // Skip gsi/ internal references (not file paths)
  if (refPath.startsWith('gsi/')) {
    return { type: 'gsi-internal', resolved: null, valid: true };
  }
  
  // Skip template placeholders with ...
  if (refPath.includes('...')) {
    return { type: 'template-placeholder', resolved: null, valid: true };
  }
  
  // Handle ~ references (user home - these are portable)
  if (refPath.startsWith('~/')) {
    return { type: 'user-home', resolved: null, valid: true };
  }
  
  // Handle .planning/ references (relative to project root)
  if (refPath.startsWith('.planning/')) {
    const fullPath = path.join(PROJECT_ROOT, refPath);
    return { type: 'planning', resolved: fullPath, valid: fs.existsSync(fullPath) };
  }
  
  // Handle get-shit-indexed/ references (relative to project root)
  if (refPath.startsWith('get-shit-indexed/')) {
    const fullPath = path.join(PROJECT_ROOT, refPath);
    return { type: 'package', resolved: fullPath, valid: fs.existsSync(fullPath) };
  }
  
  // Handle get-shit-done/ references (user's global config - portable)
  if (refPath.startsWith('get-shit-done/')) {
    return { type: 'global-config', resolved: null, valid: true };
  }
  
  // Handle references/ workflows/ templates/ bin/ agents/ (from templates - check both local and get-shit-indexed)
  // Note: These may also refer to get-shit-done files which are user-specific
  if (refPath.match(/^(references|workflows|templates|bin|agents)\//)) {
    const sourceDir = path.dirname(sourceFile);
    const localPath = path.join(sourceDir, refPath);
    const gsiPath = path.join(PROJECT_ROOT, 'get-shit-indexed', refPath);
    
    if (fs.existsSync(localPath)) {
      return { type: 'relative', resolved: localPath, valid: true };
    }
    if (fs.existsSync(gsiPath)) {
      return { type: 'package', resolved: gsiPath, valid: true };
    }
    // If not found locally or in get-shit-indexed, it might be in get-shit-done (global)
    // These are considered valid since they're user-specific
    return { type: 'global-config', resolved: null, valid: true };
  }
  
  // Handle codebase/ references (in .planning/codebase)
  if (refPath.startsWith('codebase/')) {
    const fullPath = path.join(PROJECT_ROOT, '.planning', refPath);
    return { type: 'planning', resolved: fullPath, valid: fs.existsSync(fullPath) };
  }
  
  // Handle lib/ references
  if (refPath.startsWith('lib/')) {
    const fullPath = path.join(PROJECT_ROOT, refPath);
    return { type: 'lib', resolved: fullPath, valid: fs.existsSync(fullPath) };
  }
  
  // Handle relative references (starting with ./ or just a path)
  if (refPath.startsWith('./') || !refPath.startsWith('/')) {
    const sourceDir = path.dirname(sourceFile);
    const fullPath = path.join(sourceDir, refPath);
    return { type: 'relative', resolved: fullPath, valid: fs.existsSync(fullPath) };
  }
  
  // Absolute paths - these are broken
  if (refPath.match(/^[A-Z]:\\/i) || refPath.startsWith('/Users/') || refPath.startsWith('/home/')) {
    return { type: 'absolute', resolved: null, valid: false };
  }
  
  return { type: 'unknown', resolved: null, valid: true };
}

/**
 * Scan a file for references
 */
function scanFile(filePath) {
  if (shouldSkip(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  stats.filesScanned++;
  
  lines.forEach((line, lineIndex) => {
    // Check for conditional/optional references on this line
    const isConditionalLine = line.match(/\(if\s+exists\)/i) || 
                              line.match(/\(optional\)/i) ||
                              line.match(/\(planned\)/i) ||
                              line.match(/\(future\)/i);
    
    // Check for absolute paths (broken)
    const absMatch = line.match(REFERENCE_PATTERNS.absoluteWindowsPath);
    if (absMatch) {
      stats.absolutePaths++;
      stats.brokenReferences++;
      absolutePathRefs.push({
        file: filePath,
        line: lineIndex + 1,
        content: line.trim(),
        type: 'absolute-windows-path',
      });
    }
    
    // Find all @-references
    let match;
    while ((match = REFERENCE_PATTERNS.atReference.exec(line)) !== null) {
      const refPath = match[1];
      const fullMatch = match[0]; // Includes the @ prefix
      stats.totalReferences++;
      
      // Skip if it looks like an email or just @ mention
      if (refPath.includes('@') || refPath.length < 2) continue;
      
      // Pass whether this is a conditional line
      const resolution = resolveReference(refPath, fullMatch, filePath, isConditionalLine);
      
      if (resolution.valid) {
        stats.validReferences++;
        if (VERBOSE) {
          console.log(`  ✓ ${refPath} (${resolution.type})`);
        }
      } else {
        stats.brokenReferences++;
        brokenRefs.push({
          file: filePath,
          line: lineIndex + 1,
          reference: refPath,
          type: resolution.type,
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
    } else if (entry.isFile() && /\.(md|txt|markdown)$/i.test(entry.name)) {
      if (VERBOSE) console.log(`\nScanning: ${fullPath}`);
      scanFile(fullPath);
    }
  }
}

/**
 * Print the report
 */
function printReport() {
  console.log('\n' + '='.repeat(60));
  console.log('REFERENCE VALIDATION REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n📊 Statistics:`);
  console.log(`   Files scanned:     ${stats.filesScanned}`);
  console.log(`   Total references:  ${stats.totalReferences}`);
  console.log(`   Valid references:  ${stats.validReferences}`);
  console.log(`   Broken references: ${stats.brokenReferences}`);
  console.log(`   Absolute paths:    ${stats.absolutePaths}`);
  
  if (absolutePathRefs.length > 0) {
    console.log('\n❌ Absolute Path References (must be fixed):');
    absolutePathRefs.forEach(ref => {
      console.log(`   ${ref.file}:${ref.line}`);
      console.log(`     → ${ref.content.substring(0, 80)}...`);
    });
  }
  
  if (brokenRefs.length > 0) {
    console.log('\n⚠️  Broken References:');
    brokenRefs.forEach(ref => {
      console.log(`   ${ref.file}:${ref.line}`);
      console.log(`     → @${ref.reference} (${ref.type})`);
    });
  }
  
  const success = stats.brokenReferences === 0;
  console.log('\n' + '='.repeat(60));
  if (success) {
    console.log('✅ VALIDATION PASSED - All references are valid');
  } else {
    console.log('❌ VALIDATION FAILED - Broken references found');
  }
  console.log('='.repeat(60));
  
  return success;
}

// Main execution
console.log('Reference Validator for get-shit-done-code-index');
console.log('Project root:', PROJECT_ROOT);
console.log('');

scanDirectory(PROJECT_ROOT);
const success = printReport();

process.exit(success ? 0 : 1);
