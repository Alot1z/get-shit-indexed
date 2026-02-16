# IMPROVEMENT-02: Connect Thinking Hooks to Claude Settings

## Priority
**HIGH** - Integrate thinking servers with Claude's configuration system

## Overview
The three thinking servers (Sequential, Tractatus, Debug) are available but not integrated with Claude Code's settings. This task enables thinking hooks to be configured via Claude settings.

## Research Required

### Domain Research
1. **Claude Settings Architecture**
   - Study ~/.claude/settings.json structure
   - Research Claude settings extension mechanism
   - Analyze existing hooks integration patterns

2. **Thinking Hook Configuration**
   - Research MCP server connection patterns
   - Study hook ordering and priority
   - Investigate conditional hook activation

### Technical Research
1. **Settings.json Format**
   ```json
   {
     "hooks": {
       "preToolUse": [...],
       "postToolUse": [...]
     },
     "mcpServers": {...}
   }
   ```

2. **Hook Script Patterns**
   - Study bash-redirect.js as reference
   - Research node.js hook scripts
   - Investigate hook communication patterns

## Implementation Tasks

### Sub-task 1: Thinking Hook Scripts
- [ ] Create sequential-thinking hook
  - File: hooks/pre-tool-use/sequential-thinking.js
  - Trigger on complex prompts (>50 words)
  - Optional: configurable threshold
  
- [ ] Create tractatus-thinking hook
  - File: hooks/pre-tool-use/tractatus-thinking.js
  - Trigger on architectural queries
  - Detect: "architecture", "design", "structure" keywords
  
- [ ] Create debug-thinking hook
  - File: hooks/pre-tool-use/debug-thinking.js
  - Trigger on error/debug scenarios
  - Detect: "error", "bug", "debug", "fix" keywords

### Sub-task 2: Hook Configuration
- [ ] Update hooks/hooks.json
  ```json
  {
    "sequential-thinking": {
      "file": "./hooks/pre-tool-use/sequential-thinking.js",
      "priority": 2,
      "enabled": true
    },
    "tractatus-thinking": {
      "file": "./hooks/pre-tool-use/tractatus-thinking.js",
      "priority": 3,
      "enabled": true
    },
    "debug-thinking": {
      "file": "./hooks/pre-tool-use/debug-thinking.js",
      "priority": 4,
      "enabled": true
    }
  }
  ```
  
- [ ] Create settings.json integration
  - Add thinking hooks to Claude settings
  - Make hooks configurable
  - Enable/disable per hook

### Sub-task 3: Trigger Logic
- [ ] Implement intelligent activation
  - Analyze prompt before hook execution
  - Determine appropriate thinking server
  - Skip if not relevant
  
- [ ] Create fallback logic
  - If MCP server unavailable, skip gracefully
  - Log hook execution for debugging
  - Provide hook status command

### Sub-task 4: User Controls
- [ ] Create gsi:thinking-config command
  - Show current hook status
  - Enable/disable individual hooks
  - Configure trigger thresholds
  
- [ ] Update gsi:settings command
  - Include thinking hook configuration
  - Show hook execution history
  - Provide hook diagnostics

## Verification Criteria
- [ ] Thinking hooks activate on appropriate prompts
- [ ] Hooks integrate with Claude settings seamlessly
- [ ] Hooks fail gracefully when MCP servers unavailable
- [ ] User can enable/disable hooks individually
- [ ] gsi:thinking-config command works

## Files to Create
- hooks/pre-tool-use/sequential-thinking.js
- hooks/pre-tool-use/tractatus-thinking.js
- hooks/pre-tool-use/debug-thinking.js

## Files to Modify
- hooks/hooks.json
- commands/gsi:settings.js
- commands/gsi:thinking-config.js (new)

## Success Metrics
- Thinking hooks activate correctly >90% of relevant prompts
- False positive rate <10%
- User satisfaction >4.0/5.0
