#!/usr/bin/env node

/**
 * Update STATE.md for Phase 20-01 completion
 */

const fs = require('fs');
const path = require('path');

const statePath = 'C:/github-repos/my-claude-code-repos/get-shit-done-code-index/.planning/STATE.md';
const stateContent = fs.readFileSync(statePath, 'utf8');

// Update current position
const updatedState = stateContent
  .replace(/Phase: 22 of 22 \(Advanced Pattern Learning\)/, 'Phase: 20 of 22 (Thinking Integration Completion)')
  .replace(/Plan: 0 of 10 \(All plans created, ready for execution\)/, 'Plan: 1 of 7 (20-01 complete, 6 remaining)')
  .replace(/Status: PLANNED - 10 plans with 69 tasks ready across Phases 20-22/, 'Status: IN_PROGRESS - 20-01 complete, 6 plans remaining in Phase 20')
  .replace(/Last activity: 2026-02-15 — Completed Phase 20-22 planning \(Extended Thinking Integration\)/, 'Last activity: 2026-02-15 — Completed Phase 20-01 Hook Registration')
  .replace(/Progress: \[██████████████████░\] 92% \(80\/90 plans across all phases\)/, 'Progress: [██████████████████░] 93% (81/90 plans across all phases)');

// Add Phase 20 decision
const decisionSection = `
**From Phase 20-01 (Hook Registration in Claude Settings):**
- Hook registration system implemented in Claude settings.json
- Hooks categorize tools but don't directly call thinking servers (MCP access limitation)
- Tool categorization logic: file ops → sequential, code ops → tractatus, analysis → sequential
- PreToolUse hooks: complexity-check.js (planning), thinking-invoke.js (all tools)
- PostToolUse hooks: reflection-capture.js (captures observations for debug-thinking)
- Hook logging to ~/.claude/logs/ for debugging
- Hooks complete in ~50-100ms, thinking happens during tool execution via MCP
- Complete HOOK-SYSTEM.md documentation with examples and troubleshooting
`;

// Find the insertion point (after Phase 19 section)
const phase19Section = /\*\*From Phase 19.*?\*\*From Phase 20 Planning/s;
const replacement = `$&\n${decisionSection}`;

const finalState = updatedState.replace(phase19Section, replacement);

fs.writeFileSync(statePath, finalState);

console.log('STATE.md updated successfully');
console.log('Phase: 20 of 22 (Thinking Integration Completion)');
console.log('Plan: 1 of 7 (20-01 complete)');
console.log('Status: IN_PROGRESS');
