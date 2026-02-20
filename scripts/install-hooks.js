#!/usr/bin/env node

/**
 * GSI Hook Installer
 * 
 * Registers GSI hooks in the user's Claude settings.json
 * Run automatically via npm postinstall or manually via: node scripts/install-hooks.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Paths
const GSI_ROOT = path.resolve(__dirname, '..');
const HOOKS_DIR = path.join(GSI_ROOT, 'hooks');
const CLAUDE_SETTINGS = path.join(os.homedir(), '.claude', 'settings.json');

// Hook configuration to inject
const GSI_HOOKS = {
  PreToolUse: [
    {
      matcher: "Bash|bash",
      hooks: [
        {
          type: "command",
          command: `node ${path.join(HOOKS_DIR, 'pre-tool-use', 'bash-redirect.js')}`
        }
      ]
    },
    {
      matcher: "/gsi:|/gsd:",
      hooks: [
        {
          type: "command",
          command: `node ${path.join(HOOKS_DIR, 'pre-tool-use', 'prompt-enhancer.js')}`
        }
      ]
    },
    {
      matcher: "Task|execute-phase|execute-plan",
      hooks: [
        {
          type: "command",
          command: `node ${path.join(HOOKS_DIR, 'pre-tool-use', 'complexity-check.js')}`
        }
      ]
    },
    {
      matcher: ".*",
      hooks: [
        {
          type: "command",
          command: `node ${path.join(HOOKS_DIR, 'pre-tool-use', 'thinking-invoke.js')}`
        }
      ]
    }
  ],
  PostToolUse: [
    {
      matcher: ".*",
      hooks: [
        {
          type: "command",
          command: `node ${path.join(HOOKS_DIR, 'post-tool-use', 'reflection-capture.js')}`
        }
      ]
    }
  ]
};

function installHooks() {
  console.log('🔧 GSI Hook Installer');
  console.log('=====================');
  
  // Check if settings.json exists
  if (!fs.existsSync(CLAUDE_SETTINGS)) {
    console.error('❌ Claude settings.json not found at:', CLAUDE_SETTINGS);
    console.log('   Please ensure Claude Code is installed and configured.');
    process.exit(1);
  }
  
  // Read current settings
  let settings;
  try {
    const content = fs.readFileSync(CLAUDE_SETTINGS, 'utf8');
    settings = JSON.parse(content);
  } catch (err) {
    console.error('❌ Failed to parse settings.json:', err.message);
    process.exit(1);
  }
  
  // Check if GSI hooks already installed
  if (settings.hooks && settings.hooks._gsi_installed) {
    console.log('✅ GSI hooks already installed.');
    console.log('   Run with --force to reinstall.');
    if (process.argv.includes('--force')) {
      console.log('   Force reinstalling...');
    } else {
      return;
    }
  }
  
  // Merge hooks
  settings.hooks = settings.hooks || {};
  settings.hooks._gsi_installed = true;
  settings.hooks._gsi_version = require(path.join(GSI_ROOT, 'package.json')).version || 'unknown';
  
  // Add PreToolUse hooks
  settings.hooks.PreToolUse = settings.hooks.PreToolUse || [];
  for (const hook of GSI_HOOKS.PreToolUse) {
    // Remove existing GSI hook with same matcher
    settings.hooks.PreToolUse = settings.hooks.PreToolUse.filter(h => h.matcher !== hook.matcher);
    settings.hooks.PreToolUse.push(hook);
    console.log(`   ✅ Added PreToolUse hook: ${hook.matcher}`);
  }
  
  // Add PostToolUse hooks
  settings.hooks.PostToolUse = settings.hooks.PostToolUse || [];
  for (const hook of GSI_HOOKS.PostToolUse) {
    // Remove existing GSI hook with same matcher
    settings.hooks.PostToolUse = settings.hooks.PostToolUse.filter(h => h.matcher !== hook.matcher);
    settings.hooks.PostToolUse.push(hook);
    console.log(`   ✅ Added PostToolUse hook: ${hook.matcher}`);
  }
  
  // Backup original settings
  const backupPath = CLAUDE_SETTINGS + '.backup.' + Date.now();
  fs.copyFileSync(CLAUDE_SETTINGS, backupPath);
  console.log(`   📦 Backup created: ${backupPath}`);
  
  // Write updated settings
  try {
    fs.writeFileSync(CLAUDE_SETTINGS, JSON.stringify(settings, null, 2));
    console.log('✅ GSI hooks installed successfully!');
    console.log('');
    console.log('Installed hooks:');
    console.log('  • bash-redirect.js - Redirects Bash to Desktop Commander');
    console.log('  • prompt-enhancer.js - Enhances /gsi: commands');
    console.log('  • complexity-check.js - Checks task complexity');
    console.log('  • thinking-invoke.js - Auto-invoke thinking servers');
    console.log('  • reflection-capture.js - Captures operation patterns');
  } catch (err) {
    console.error('❌ Failed to write settings.json:', err.message);
    // Restore backup
    fs.copyFileSync(backupPath, CLAUDE_SETTINGS);
    console.log('   Restored from backup.');
    process.exit(1);
  }
}

function uninstallHooks() {
  console.log('🗑️  GSI Hook Uninstaller');
  console.log('=======================');
  
  if (!fs.existsSync(CLAUDE_SETTINGS)) {
    console.error('❌ Claude settings.json not found.');
    process.exit(1);
  }
  
  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(CLAUDE_SETTINGS, 'utf8'));
  } catch (err) {
    console.error('❌ Failed to parse settings.json:', err.message);
    process.exit(1);
  }
  
  if (!settings.hooks || !settings.hooks._gsi_installed) {
    console.log('ℹ️  GSI hooks not installed.');
    return;
  }
  
  // Remove GSI hooks
  const gsiMatchers = GSI_HOOKS.PreToolUse.map(h => h.matcher)
    .concat(GSI_HOOKS.PostToolUse.map(h => h.matcher));
  
  if (settings.hooks.PreToolUse) {
    settings.hooks.PreToolUse = settings.hooks.PreToolUse.filter(
      h => !gsiMatchers.includes(h.matcher)
    );
  }
  
  if (settings.hooks.PostToolUse) {
    settings.hooks.PostToolUse = settings.hooks.PostToolUse.filter(
      h => !gsiMatchers.includes(h.matcher)
    );
  }
  
  delete settings.hooks._gsi_installed;
  delete settings.hooks._gsi_version;
  
  // Backup and write
  const backupPath = CLAUDE_SETTINGS + '.backup.' + Date.now();
  fs.copyFileSync(CLAUDE_SETTINGS, backupPath);
  fs.writeFileSync(CLAUDE_SETTINGS, JSON.stringify(settings, null, 2));
  
  console.log('✅ GSI hooks uninstalled successfully!');
}

// CLI
const command = process.argv[2];
if (command === 'uninstall') {
  uninstallHooks();
} else {
  installHooks();
}
