# Hook Enforcement Gaps

**Analysis Date:** 2026-02-20

## Summary
- Hooks registered: 6
- Hook files found: 6
- Unregistered hooks: 0
- Disconnected hooks: 1 (critical)
- Missing module files: 1 (critical import mismatch)

## Registration Status

### hooks.json Analysis

**Registered PreToolUse Hooks:**
1. `mcp-enforcer` -> `hooks/pre-tool-use/mcp-enforcer.js`
2. `bash-redirect` -> `hooks/pre-tool-use/bash-redirect.js`
3. `prompt-enhancer` -> `hooks/pre-tool-use/prompt-enhancer.js`
4. `complexity-check` -> `hooks/pre-tool-use/complexity-check.js`
5. `thinking-invoke` -> `hooks/pre-tool-use/thinking-invoke.js`

**Registered PostToolUse Hooks:**
1. `reflection-capture` -> `hooks/post-tool-use/reflection-capture.js`

**All hook files are registered in hooks.json.**

## Hook Gaps Found

### Gap 1: Module Import Mismatch - CRITICAL

- **Type:** Disconnected
- **Severity:** Critical
- **Hook:** `complexity-check`
- **File:** `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\lib\complexity\cognitive-flow.js`
- **Description:** 
  The complexity-check hook imports `lib/complexity/cognitive-flow.js` which contains:
  ```javascript
  const { runProcessPhase } = require('./sequential-cg-phase');
  ```
  But the actual file on disk is named `sequential-ci-phase.js`, not `sequential-cg-phase.js`.
  This will cause a `MODULE_NOT_FOUND` error when the complexity-check hook is triggered.
- **Impact:** Complete hook failure for complexity prediction
- **TDD Test:**
  ```javascript
  test('complexity-check hook imports modules correctly', async () => {
    // Attempt to require the cognitive-flow module
    const cognitiveFlow = require('../../lib/complexity/cognitive-flow');
    expect(() => cognitiveFlow.runCognitiveFlow).not.toThrow();
    
    // Test actual module resolution
    const result = await cognitiveFlow.runCognitiveFlow('test-plan.md', {});
    expect(result).toBeDefined();
    expect(result.phases.process).toBeDefined();
  });
  ```
- **Fix:** Either:
  1. Rename `lib/complexity/sequential-ci-phase.js` to `lib/complexity/sequential-cg-phase.js`
  2. OR change import in `cognitive-flow.js` from `'./sequential-cg-phase'` to `'./sequential-ci-phase'`

---

### Gap 2: thinking-invoke Hook - Passive Implementation

- **Type:** Missing Connection
- **Severity:** Medium
- **Hook:** `thinking-invoke`
- **File:** `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\hooks\pre-tool-use\thinking-invoke.js`
- **Description:** 
  The hook correctly categorizes tools and determines which thinking server to use, but it only logs to stderr:
  ```javascript
  // Log that thinking would be invoked
  // NOTE: Actual thinking server invocation happens via MCP tools
  // This hook just logs and exits - the thinking happens during tool execution
  console.error(`[THINKING-INVOKE] Would invoke ${thinkingServer} for ${toolName}`);
  ```
  The comment indicates this is intentional (thinking happens elsewhere), but the hook doesn't actually invoke any MCP thinking tools.
- **Impact:** Hook doesn't enforce thinking - relies on agent to invoke thinking separately
- **TDD Test:**
  ```javascript
  test('thinking-invoke hook should invoke MCP thinking server', async () => {
    const hook = require('../../hooks/pre-tool-use/thinking-invoke');
    // Hook should actually invoke thinking server, not just log
    const result = await hook.run({ toolName: 'Task', arguments: {} });
    // Currently this returns null for thinkingServer for most tools
    expect(result).toBeDefined();
  });
  ```
- **Fix:** Either:
  1. Document that this hook is "advisory only" and thinking happens elsewhere
  2. OR implement actual MCP tool invocation for thinking servers

---

### Gap 3: reflection-capture Hook - Schema Export Issue

- **Type:** Potential Issue
- **Severity:** Low
- **Hook:** `reflection-capture`
- **File:** `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\hooks\post-tool-use\reflection-capture.js`
- **Description:**
  The hook correctly imports all required modules:
  - `../../lib/reflection/capture` (ReflectionCapture)
  - `../../lib/reflection/debug-integration` (DebugThinkingIntegration)
  - `../../lib/reflection/patterns` (PatternExtractor)
  - `../../lib/reflection/insights` (InsightGenerator)
  
  However, the Pattern and Insight classes in schema.js are not directly exported by the index file. The hook only uses the classes as return values, not as imports, so this is not blocking but could cause issues if refactored.
- **Impact:** None currently, but could cause confusion during maintenance
- **TDD Test:**
  ```javascript
  test('reflection-capture hook module imports are valid', async () => {
    // All imports should resolve
    const ReflectionCapture = require('../../lib/reflection/capture');
    const DebugThinkingIntegration = require('../../lib/reflection/debug-integration');
    const PatternExtractor = require('../../lib/reflection/patterns');
    const InsightGenerator = require('../../lib/reflection/insights');
    
    expect(ReflectionCapture).toBeDefined();
    expect(DebugThinkingIntegration).toBeDefined();
    expect(PatternExtractor).toBeDefined();
    expect(InsightGenerator).toBeDefined();
  });
  ```
- **Fix:** No immediate fix needed - all imports work. Consider adding lib/reflection/index.js that re-exports all components.

---

### Gap 4: prompt-enhancer Hook - Conditional Module Import

- **Type:** Conditional Connection
- **Severity:** Medium
- **Hook:** `prompt-enhancer`
- **File:** `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\hooks\pre-tool-use\prompt-enhancer.js`
- **Description:**
  The hook imports from `../../lib/prompt-enhancer` inside try-catch blocks:
  ```javascript
  const { getCommandContext } = require('../../lib/prompt-enhancer/interceptor');
  // ... later in try-catch
  const { processConfirmationResponse } = require('../../lib/prompt-enhancer/confirmation');
  ```
  While the modules exist, the error handling is minimal (silently uses basic context). This could hide import errors.
- **Impact:** Failed imports are silently ignored, reducing functionality
- **TDD Test:**
  ```javascript
  test('prompt-enhancer hook requires all expected modules', () => {
    // Should not throw
    expect(() => require('../../lib/prompt-enhancer')).not.toThrow();
    expect(() => require('../../lib/prompt-enhancer/interceptor')).not.toThrow();
    expect(() => require('../../lib/prompt-enhancer/confirmation')).not.toThrow();
  });
  ```
- **Fix:** Verify all imported modules exist and export expected functions. Add explicit error logging.

---

## Enforcement Matrix

| Hook | Registered | Connected | Module Imports Valid | Enforces | Status |
|------|------------|-----------|---------------------|----------|--------|
| mcp-enforcer | YES | YES | YES | Native tool blocking | WORKING |
| bash-redirect | YES | YES | YES | Bash to DC redirect | WORKING |
| prompt-enhancer | YES | YES | YES (conditional) | Prompt enhancement | WORKING |
| complexity-check | YES | YES | NO (import mismatch) | Complexity prediction | BROKEN |
| thinking-invoke | YES | PARTIAL | YES | Thinking invocation | ADVISORY ONLY |
| reflection-capture | YES | YES | YES | Reflection capture | WORKING |

---

## Critical Issues Summary

### Immediate Action Required

1. **Fix Module Import Mismatch** (Critical)
   - File: `C:\github-repos\my-claude-code-repos\get-shit-done-code-index\lib\complexity\cognitive-flow.js`
   - Line 5: `require('./sequential-cg-phase')` -> `require('./sequential-ci-phase')`
   - OR rename file from `sequential-ci-phase.js` to `sequential-cg-phase.js`

### Recommended Improvements

1. **thinking-invoke Hook Enhancement**
   - Either document as advisory-only
   - Or implement actual MCP thinking tool invocation

2. **Add Index Files for lib modules**
   - Create `lib/reflection/index.js` with re-exports
   - Standardize module exports across all lib modules

3. **Add TDD Tests for Hooks**
   - Create test file for each hook
   - Test module imports
   - Test hook execution paths

---

## Hook Trigger Patterns Verification

### mcp-enforcer
- **Registered Trigger:** `Read|Write|Edit|Grep|Glob|Bash`
- **Implementation:** Checks `toolName` against TOOL_MAPPINGS
- **Status:** Properly configured

### bash-redirect
- **Registered Trigger:** `Bash|bash`
- **Implementation:** Checks `toolName.toLowerCase() === 'bash'`
- **Status:** Properly configured

### prompt-enhancer
- **Registered Trigger:** `/gsi:|/gsd:`
- **Implementation:** Uses `shouldRun()` to check for trigger prefixes
- **Status:** Properly configured

### complexity-check
- **Registered Trigger:** `Task|execute-phase|execute-plan`
- **Implementation:** Uses `TRIGGER_TOOLS` array and `shouldTrigger()` function
- **Status:** Properly configured (but broken due to import mismatch)

### thinking-invoke
- **Registered Trigger:** `all`
- **Implementation:** Runs on every tool call via stdin
- **Status:** Properly configured (but passive)

### reflection-capture
- **Registered Conditions:** errors, significant, thinking, file_operations, etc.
- **Implementation:** Uses `shouldCaptureReflection()` with multiple conditions
- **Status:** Properly configured

---

*Hook enforcement audit: 2026-02-20*
*Critical gaps: 1*
*Medium gaps: 2*
*Low gaps: 1*
