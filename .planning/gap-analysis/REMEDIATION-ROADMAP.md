# Remediation Roadmap

**Generated:** 2026-02-20
**Based on:** GAP-ANALYSIS-REPORT.md
**Total Issues:** 25 gaps

---

## Phase 1: Immediate Fixes (P0) - Today

**Estimated Time:** 15 minutes

### Fix 1.1: Module Import Mismatch
- [ ] **File:** `lib/complexity/cognitive-flow.js`
- [ ] **Line:** 5
- [ ] **Issue:** Imports `sequential-cg-phase` but file is `sequential-ci-phase.js`
- [ ] **Fix:** Change to `require('./sequential-ci-phase')`
- [ ] **TDD Test:** `node -e "require('./lib/complexity/cognitive-flow')"` should not throw
- [ ] **Impact:** Restores complexity-check hook functionality

### Fix 1.2: Remove Bash from debug.md
- [ ] **File:** `commands/gsi/debug.md`
- [ ] **Line:** 28
- [ ] **Action:** Remove `- Bash` from allowed-tools
- [ ] **TDD Test:** `grep -E "^\s*-\s*Bash" commands/gsi/debug.md | wc -l` returns 0
- [ ] **Impact:** ~73% token savings on shell operations

### Fix 1.3: Remove Bash from commands.md
- [ ] **File:** `commands/gsi/commands.md`
- [ ] **Line:** 757
- [ ] **Action:** Remove `- Bash` from allowed-tools
- [ ] **TDD Test:** `grep -E "^\s*-\s*Bash" commands/gsi/commands.md | wc -l` returns 0
- [ ] **Impact:** Consistency with MCP-only policy

### Fix 1.4: Regenerate gsi-project.md
- [ ] **File:** `gsi-project.md`
- [ ] **Action:** Run bundler to regenerate from fixed source files
- [ ] **TDD Test:** `grep -E "^\s*-\s*Bash" gsi-project.md | wc -l` returns 0
- [ ] **Impact:** Removes 2 duplicate violations

---

## Phase 2: Critical Module Connections (P1) - This Week

**Estimated Time:** 4 hours

### Fix 2.1: Wire knowledge-hub into gsi-integration
- [ ] **Create:** `lib/gsi-knowledge-init.js`
- [ ] **Modify:** `lib/gsi-integration/index.js`
- [ ] **Approach:**
  ```javascript
  // lib/gsi-knowledge-init.js
  const { KnowledgeFlow } = require('./knowledge-hub');
  
  function initializeKnowledgeFlow() {
    const flow = KnowledgeFlow.createStandardFlow();
    // Wire actual modules
    return flow;
  }
  
  module.exports = { initializeKnowledgeFlow };
  ```
- [ ] **TDD Test:** `require('./lib/gsi-knowledge-init').initializeKnowledgeFlow()` returns flow
- [ ] **Impact:** Activates entire knowledge architecture

### Fix 2.2: Connect lib/tool-optimization to mcp-enforcer
- [ ] **File:** `hooks/pre-tool-use/mcp-enforcer.js`
- [ ] **Action:** Import tool-optimization for intelligent selection
- [ ] **Approach:**
  ```javascript
  const { ToolSelector } = require('../../lib/tool-optimization');
  
  // In handler:
  const recommendation = ToolSelector.getToolRecommendation(toolName);
  ```
- [ ] **TDD Test:** mcp-enforcer uses tool-optimization for recommendations
- [ ] **Impact:** Intelligent tool selection guidance

### Fix 2.3: Connect lib/claudeception to hooks
- [ ] **File:** `hooks/hooks.json`
- [ ] **Action:** Register claudeception hooks
- [ ] **File:** `commands/gsi/claudeception.md`
- [ ] **Action:** Wire command to ClaudeceptionManager
- [ ] **TDD Test:** `/gsi:claudeception` command triggers knowledge extraction
- [ ] **Impact:** Self-improving knowledge extraction

### Fix 2.4: Connect lib/context to gsi-install
- [ ] **File:** `lib/gsi-install/index.js`
- [ ] **Action:** Import lib/context for install detection
- [ ] **TDD Test:** `detectInstallType()` returns correct type
- [ ] **Impact:** Proper installation context handling

### Fix 2.5: Connect lib/sdk to set-profile
- [ ] **File:** `commands/gsi/set-profile.md` (or lib)
- [ ] **Action:** Use lib/sdk/profile-manager.ts
- [ ] **TDD Test:** Profile switching uses SDK
- [ ] **Impact:** Native SDK integration

### Fix 2.6: Connect lib/knowledge to pattern-learning
- [ ] **File:** `lib/pattern-learning/index.js`
- [ ] **Action:** Import lib/knowledge for semantic search
- [ ] **TDD Test:** Pattern search uses semantic index
- [ ] **Impact:** Enhanced pattern discovery

### Fix 2.7: Connect lib/module-registry to settings
- [ ] **File:** `commands/gsi/settings.md`
- [ ] **Action:** Display module health from registry
- [ ] **TDD Test:** Settings shows module health status
- [ ] **Impact:** Module health visibility

---

## Phase 3: Knowledge Flow Chains (P2) - Next Sprint

**Estimated Time:** 6 hours

### Fix 3.1: Unify Pattern Storage
- [ ] **Modify:** `lib/reflection/patterns.js`
- [ ] **Action:** Use `lib/pattern-learning/storage.js` instead of local file
- [ ] **TDD Test:** Reflection stores to pattern-learning storage
- [ ] **Impact:** Eliminates storage fragmentation

### Fix 3.2: Connect pattern-learning → complexity
- [ ] **File:** `lib/complexity/learning.js`
- [ ] **Action:** Import and use `queryPatterns()`
- [ ] **Approach:**
  ```javascript
  const { queryPatterns } = require('../pattern-learning');
  
  async function adaptFromHistory() {
    const patterns = await queryPatterns({ type: 'complexity' });
    // Use patterns for prediction
  }
  ```
- [ ] **TDD Test:** Complexity uses pattern predictions
- [ ] **Impact:** Improved complexity predictions

### Fix 3.3: Connect complexity → prompt-enhancer
- [ ] **File:** `lib/prompt-enhancer/mode-selector.js`
- [ ] **Action:** Import complexity thresholds
- [ ] **Approach:**
  ```javascript
  const { THRESHOLDS } = require('../complexity');
  
  function selectMode(prompt) {
    const score = calculateComplexity(prompt);
    return score > THRESHOLDS.HIGH ? 'comprehensive' : 'standard';
  }
  ```
- [ ] **TDD Test:** Prompt enhancer uses complexity scores
- [ ] **Impact:** Mode selection based on complexity

### Fix 3.4: Wire prompt-enhancer/learning.js
- [ ] **File:** `lib/prompt-enhancer/index.js`
- [ ] **Action:** Import and use learning.js
- [ ] **TDD Test:** Enhancement history is recorded
- [ ] **Impact:** Learning from enhancement patterns

### Fix 3.5: Add token awareness to prompt-enhancer
- [ ] **File:** `lib/prompt-enhancer/index.js`
- [ ] **Action:** Import context-optimization for token counting
- [ ] **TDD Test:** Enhancement respects token limits
- [ ] **Impact:** Prevents context overflow

### Fix 3.6: Enhance thinking-invoke hook
- [ ] **File:** `hooks/pre-tool-use/thinking-invoke.js`
- [ ] **Action:** Implement actual MCP thinking invocation
- [ ] **Alternative:** Document as advisory-only
- [ ] **TDD Test:** Hook invokes thinking server (or documents advisory)
- [ ] **Impact:** Enforced thinking (or clear documentation)

---

## Phase 4: Create Missing Commands (P3) - Backlog

**Estimated Time:** 8 hours

### Command 4.1: /gsi:knowledge
- [ ] **Purpose:** Query knowledge hub capabilities
- [ ] **Module:** lib/knowledge-hub
- [ ] **Features:** List producers/consumers, query knowledge

### Command 4.2: /gsi:search-knowledge
- [ ] **Purpose:** Semantic knowledge search
- [ ] **Module:** lib/knowledge
- [ ] **Features:** Search patterns, embeddings, context

### Command 4.3: /gsi:module-status
- [ ] **Purpose:** Health check all lib modules
- [ ] **Module:** lib/module-registry
- [ ] **Features:** Show health scores, dependencies

### Command 4.4: /gsi:sdk-config
- [ ] **Purpose:** SDK profile and auth management
- [ ] **Module:** lib/sdk
- [ ] **Features:** Profile switching, auth status

### Command 4.5: /gsi:features
- [ ] **Purpose:** Feature registry exploration
- [ ] **Module:** lib/enhancement
- [ ] **Features:** List features, enable/disable

### Command 4.6: /gsi:build
- [ ] **Purpose:** Distribution layer operations
- [ ] **Module:** lib/distribution
- [ ] **Features:** Build artifacts, compress, package

### Command 4.7: /gsi:agent
- [ ] **Purpose:** Agent orchestration
- [ ] **Module:** lib/agent-framework
- [ ] **Features:** Task queue, playbooks, profiles

### Command 4.8: Update /gsi:files-to-prompt
- [ ] **Action:** Use lib/core-engine instead of standalone
- [ ] **Module:** lib/core-engine
- [ ] **Impact:** Code consolidation

---

## Phase 5: Quality Improvements (P4) - Future

**Estimated Time:** 4 hours

### Fix 5.1: Add lib/reflection/index.js
- [ ] **Action:** Create index that re-exports all components
- [ ] **Impact:** Standardized module exports

### Fix 5.2: Add TDD test suite for hooks
- [ ] **Create:** `tests/hooks/*.test.js`
- [ ] **Coverage:** All 6 hooks
- [ ] **Impact:** Prevent regression

### Fix 5.3: Add integration tests for knowledge flow
- [ ] **Create:** `tests/integration/knowledge-flow.test.js`
- [ ] **Coverage:** All 6 flow chains
- [ ] **Impact:** Verify connections work

### Fix 5.4: Add prompt-enhancer index exports
- [ ] **Action:** Export learning.js functions from index
- [ ] **Impact:** API consistency

---

## Dependencies

```
Phase 1 (No dependencies)
    ↓
Phase 2.1 (knowledge-hub) → Phase 3.1, 3.2, 3.3
    ↓
Phase 3.1 (unified storage) → Phase 3.2, 3.3, 3.4
    ↓
Phase 3 (All complete) → Phase 4 commands can use connected modules
    ↓
Phase 4 (Commands created) → Phase 5 tests verify everything
```

**Independent tracks:**
- Phase 2.2-2.7 can run in parallel
- Phase 4.1-4.8 can run in parallel after Phase 3

---

## Estimated Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Critical Gaps | 14 | 0 | -100% |
| Connected Modules | 13/24 | 24/24 | +85% |
| Working Knowledge Flows | 1/6 | 6/6 | +500% |
| Tool Compliance | 94% | 100% | +6% |
| Token Savings | 0% | 73%+ | +73% |
| Dead Code | 7 modules | 0 modules | -100% |

---

## Verification Checklist

After each phase:

- [ ] **Phase 1:** Run `node -e "require('./lib/complexity/cognitive-flow')"`
- [ ] **Phase 1:** Run `grep -E "^\s*-\s*Bash" commands/gsi/*.md | wc -l` returns 0
- [ ] **Phase 2:** Run knowledge flow TDD tests
- [ ] **Phase 3:** Run integration tests
- [ ] **Phase 4:** Execute each new command
- [ ] **Phase 5:** Full test suite passes

---

## Rollback Plan

If fixes cause issues:

1. **Phase 1:** Revert single-line changes
2. **Phase 2-3:** Comment out new imports
3. **Phase 4:** Remove command files
4. **Phase 5:** Skip quality improvements

Each fix is atomic and can be reverted independently.

---

*Roadmap generated: 2026-02-20*
*Total estimated time: 22 hours*
*Priority: P0 → P1 → P2 → P3 → P4*
