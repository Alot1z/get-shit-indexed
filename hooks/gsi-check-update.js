#!/usr/bin/env node
// Check for GSI updates in background, write result to cache
// Called by SessionStart hook - runs once per session
// 
// NOTE: This hook uses native Node.js modules because it runs BEFORE MCP tools are initialized.
// MCP alternatives would require full agent environment and server connections.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

// MCP ALTERNATIVES (for agents, not hooks):
// - File reading: mcp__desktop-commander__read_multiple_files (90% token savings)
// - Process execution: mcp__desktop-commander__start_process
// - Directory operations: mcp__desktop-commander__list_directory
// - For relationship analysis: mcp__CodeGraphContext__analyze_code_relationships

const homeDir = os.homedir();
const cwd = process.cwd();
const cacheDir = path.join(homeDir, '.claude', 'cache');
const cacheFile = path.join(cacheDir, 'GSI-update-check.json');

// TOKEN EFFICIENCY NOTE:
// This hook uses native Node.js for performance-critical update checking.
// If this were implemented as an agent operation, it could use:
// - mcp__desktop-commander__read_multiple_files for VERSION file reading
// - mcp__desktop-commander__start_process for npm version lookup
// - Estimated savings: 80-90% tokens for similar operations

// VERSION file locations (check project first, then global)
const projectVersionFile = path.join(cwd, '.claude', 'get-shit-indexed', 'VERSION');
const globalVersionFile = path.join(homeDir, '.claude', 'get-shit-indexed', 'VERSION');

// Ensure cache directory exists
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Run check in background (spawn background process, windowsHide prevents console flash)
const child = spawn(process.execPath, ['-e', `
  const fs = require('fs');
  const { execSync } = require('child_process');

  const cacheFile = ${JSON.stringify(cacheFile)};
  const projectVersionFile = ${JSON.stringify(projectVersionFile)};
  const globalVersionFile = ${JSON.stringify(globalVersionFile)};

  // Check project directory first (local install), then global
  let installed = '0.0.0';
  try {
    if (fs.existsSync(projectVersionFile)) {
      installed = fs.readFileSync(projectVersionFile, 'utf8').trim();
    } else if (fs.existsSync(globalVersionFile)) {
      installed = fs.readFileSync(globalVersionFile, 'utf8').trim();
    }
  } catch (e) {}

  let latest = null;
  try {
    latest = execSync('npm view get-shit-indexed-cc version', { encoding: 'utf8', timeout: 10000, windowsHide: true }).trim();
  } catch (e) {}

  const result = {
    update_available: latest && installed !== latest,
    installed,
    latest: latest || 'unknown',
    checked: Math.floor(Date.now() / 1000)
  };

  fs.writeFileSync(cacheFile, JSON.stringify(result));
`], {
  stdio: 'ignore',
  windowsHide: true,
  detached: true  // Required on Windows for proper process detachment
});

child.unref();
