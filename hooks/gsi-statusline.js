#!/usr/bin/env node
// GSI Statusline v2.0 - Tokyo Night Edition
// Shows: GSI ◆ model │ task │ phase │ context
// 
// Colors: Cyan G/S (#7dcfff), Purple I (#bb9af7)
// 
// NOTE: This hook uses native Node.js because it runs BEFORE MCP tools are initialized.
// MCP alternatives would require full agent environment and server connections.

const fs = require('fs');
const path = require('path');
const os = require('os');

// Tokyo Night color palette
const COLORS = {
  cyan: '\x1b[38;5;117m',      // #7dcfff - G/S color
  purple: '\x1b[38;5;183m',    // #bb9af7 - I color
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  orange: '\x1b[38;5;208m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
  blink: '\x1b[5m'
};

// Read JSON from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const session = data.session_id || '';
    const remaining = data.context_window?.remaining_percentage;

    // === GSI Branding ===
    // Cyan G + S, Purple I with diamond separator
    const gsiBrand = `${COLORS.cyan}G${COLORS.purple}S${COLORS.cyan}I${COLORS.reset} ◆`;

    // === Model Display (shortened) ===
    const modelShort = model
      .replace('Claude ', '')
      .replace('Opus 4.6', 'Opus')
      .replace('Sonnet 4.5', 'Sonnet')
      .replace('Haiku 4.5', 'Haiku')
      .replace('GLM-5', 'GLM5')
      .replace('GLM-4.7', 'GLM4');
    const modelDisplay = `${COLORS.dim}${modelShort}${COLORS.reset}`;

    // === Context Window (improved progress bar) ===
    let ctxBar = '';
    if (remaining != null) {
      const rem = Math.round(remaining);
      const rawUsed = Math.max(0, Math.min(100, 100 - rem));
      const used = Math.min(100, Math.round((rawUsed / 80) * 100));

      // 8-segment progress bar with gradient colors
      const filled = Math.min(8, Math.floor(used / 12.5));
      
      // Color gradient based on usage
      let barColor;
      if (used < 50) {
        barColor = COLORS.green;
      } else if (used < 65) {
        barColor = COLORS.yellow;
      } else if (used < 80) {
        barColor = COLORS.orange;
      } else if (used < 95) {
        barColor = COLORS.red;
      } else {
        barColor = COLORS.blink + COLORS.red;
      }

      // Build bar: filled blocks + empty blocks
      const filledChar = '▓';
      const emptyChar = '░';
      const bar = filledChar.repeat(filled) + emptyChar.repeat(8 - filled);
      
      // Percentage with color
      const pctDisplay = used < 95 ? `${used}%` : '!!!';
      ctxBar = ` ${barColor}${bar}${COLORS.reset} ${COLORS.dim}${pctDisplay}${COLORS.reset}`;
    }

    // === Current Task from todos ===
    let task = '';
    const homeDir = os.homedir();
    const todosDir = path.join(homeDir, '.claude', 'todos');
    
    if (session && fs.existsSync(todosDir)) {
      try {
        const files = fs.readdirSync(todosDir)
          .filter(f => f.startsWith(session) && f.includes('-agent-') && f.endsWith('.json'))
          .map(f => ({ name: f, mtime: fs.statSync(path.join(todosDir, f)).mtime }))
          .sort((a, b) => b.mtime - a.mtime);

        if (files.length > 0) {
          try {
            const todos = JSON.parse(fs.readFileSync(path.join(todosDir, files[0].name), 'utf8'));
            const inProgress = todos.find(t => t.status === 'in_progress');
            if (inProgress) {
              // Truncate long task names
              task = inProgress.activeForm || '';
              if (task.length > 25) {
                task = task.substring(0, 22) + '...';
              }
            }
          } catch (e) {}
        }
      } catch (e) {}
    }

    // === GSI Phase from STATE.md ===
    let phase = '';
    try {
      const statePath = path.join(dir, '.planning', 'STATE.md');
      if (fs.existsSync(statePath)) {
        const stateContent = fs.readFileSync(statePath, 'utf8');
        
        // Extract current phase
        const phaseMatch = stateContent.match(/Phase:\s*(\d+)/i);
        const statusMatch = stateContent.match(/Status:\s*(\w+)/i);
        
        if (phaseMatch && statusMatch) {
          const phaseNum = phaseMatch[1];
          const status = statusMatch[1];
          
          if (status.toLowerCase() === 'complete') {
            phase = `${COLORS.green}P${phaseNum}✓${COLORS.reset}`;
          } else {
            phase = `${COLORS.purple}P${phaseNum}${COLORS.reset}`;
          }
        }
      }
    } catch (e) {}

    // === GSI Update available? ===
    let gsiUpdate = '';
    const cacheFile = path.join(homeDir, '.claude', 'cache', 'GSI-update-check.json');
    if (fs.existsSync(cacheFile)) {
      try {
        const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        if (cache.update_available) {
          gsiUpdate = `${COLORS.yellow}⬆${COLORS.reset} `;
        }
      } catch (e) {}
    }

    // === Directory name (shortened) ===
    let dirname = path.basename(dir);
    if (dirname.length > 15) {
      dirname = dirname.substring(0, 12) + '...';
    }

    // === Build Output ===
    const parts = [gsiBrand, modelDisplay];
    
    if (task) {
      parts.push(`${COLORS.bold}${task}${COLORS.reset}`);
    }
    
    if (phase) {
      parts.push(phase);
    }
    
    parts.push(`${COLORS.dim}${dirname}${COLORS.reset}`);
    
    // Add context bar at end
    const output = gsiUpdate + parts.join(` ${COLORS.dim}│${COLORS.reset} `) + ctxBar;
    
    process.stdout.write(output);
  } catch (e) {
    // Silent fail - don't break statusline on parse errors
  }
});
