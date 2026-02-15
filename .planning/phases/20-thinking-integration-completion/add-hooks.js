#!/usr/bin/env node

/**
 * Add hooks section to Claude settings.json
 * Preserves all existing settings and adds hooks registration
 */

const fs = require('fs');
const path = require('path');

const settingsPath = path.join(process.env.CLAUDE_HOME || '', 'settings.json');
const repoPath = 'C:\\github-repos\\my-claude-code-repos\\get-shit-done-code-index';

// Read current settings
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

// Add hooks section before userLevelOverrides
settings.hooks = {
  preToolUse: [
    {
      pattern: 'Task|execute-phase|execute-plan',
      command: 'node',
      args: [path.join(repoPath, 'hooks', 'pre-tool-use', 'complexity-check.js')],
      timeout: 5000,
      enabled: true
    },
    {
      pattern: '.*',
      command: 'node',
      args: [path.join(repoPath, 'hooks', 'pre-tool-use', 'thinking-invoke.js')],
      timeout: 5000,
      enabled: true
    }
  ],
  postToolUse: [
    {
      pattern: '.*',
      command: 'node',
      args: [path.join(repoPath, 'hooks', 'post-tool-use', 'reflection-capture.js')],
      timeout: 5000,
      enabled: true
    }
  ]
};

// Write updated settings
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

console.log('Hooks registered successfully in settings.json');
console.log('PreToolUse hooks:');
console.log('  - complexity-check.js (Task, execute-phase, execute-plan)');
console.log('  - thinking-invoke.js (all tools)');
console.log('PostToolUse hooks:');
console.log('  - reflection-capture.js (all tools)');
