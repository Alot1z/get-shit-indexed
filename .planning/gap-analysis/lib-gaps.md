# lib/ Integration Gaps

**Analysis Date:** 2026-02-20

## Summary

- Total modules analyzed: 24
- Disconnected modules (0 connections): 7
- Under-connected modules (test-only): 4
- Missing entry points: 11

---

## Critical Gaps (0 Incoming Connections)

### Gap 1: lib/knowledge-hub
- **Location:** `lib/knowledge-hub/`
- **Status:** Disconnected
- **Severity:** Critical
- **Issue:** Module provides KnowledgeProducer, KnowledgeConsumer, KnowledgeStore, KnowledgeFlow but is never imported by commands, hooks, or other lib modules. Zero incoming connections found.
- **Files:**
  - `lib/knowledge-hub/index.js`
  - `lib/knowledge-hub/producer.js`
  - `lib/knowledge-hub/consumer.js`
  - `lib/knowledge-hub/store.js`
  - `lib/knowledge-hub/flow.js`
- **Incoming connections:** 0
- **TDD Test:** `test('knowledge-hub is imported by at least one command', () => { expect(findImports('lib/knowledge-hub')).toHaveLength > 0 })`
- **Remediation:** Create `/gsi:knowledge` command that exposes knowledge hub capabilities, or integrate with reflection-capture hook.

---

### Gap 2: lib/knowledge
- **Location:** `lib/knowledge/`
- **Status:** Disconnected
- **Severity:** Critical
- **Issue:** Module provides txtai embeddings, semantic-index, graph-sync, context management but is never imported outside its own tests and README documentation.
- **Files:**
  - `lib/knowledge/index.js`
  - `lib/knowledge/txtai.js`
  - `lib/knowledge/semantic-index.js`
  - `lib/knowledge/graph-sync.js`
  - `lib/knowledge/arscontexta.js`
  - `lib/knowledge/context-compress.js`
  - `lib/knowledge/context-cache.js`
  - `lib/knowledge/skill-compose.js`
  - `lib/knowledge/skill-registry.js`
- **Incoming connections:** 0
- **TDD Test:** `test('knowledge module semantic search is callable', () => { const knowledge = require('lib/knowledge'); expect(knowledge.searchKnowledge).toBeDefined() })`
- **Remediation:** Connect to pattern-learning module, create `/gsi:search-knowledge` command.

---

### Gap 3: lib/module-registry
- **Location:** `lib/module-registry/`
- **Status:** Disconnected
- **Severity:** Critical
- **Issue:** Provides ModuleRegistry, ModuleHealth, DependencyTracker for tracking all lib/ modules but is never used by any command, hook, or other module.
- **Files:**
  - `lib/module-registry/index.js`
  - `lib/module-registry/registry.js`
  - `lib/module-registry/health.js`
  - `lib/module-registry/dependencies.js`
- **Incoming connections:** 0
- **TDD Test:** `test('module-registry tracks lib modules', () => { const registry = require('lib/module-registry'); expect(registry.getModuleHealth('thinking')).toBeDefined() })`
- **Remediation:** Create `/gsi:module-status` command, integrate with `/gsi:settings` command.

---

### Gap 4: lib/sdk
- **Location:** `lib/sdk/`
- **Status:** Disconnected
- **Severity:** Critical
- **Issue:** TypeScript module provides ClaudeCodeSDK, ProfileManager, DirectAPI, AuthManager for native SDK integration but is never imported by commands or hooks.
- **Files:**
  - `lib/sdk/index.ts`
  - `lib/sdk/sdk-wrapper.ts`
  - `lib/sdk/profile-manager.ts`
  - `lib/sdk/direct-api.ts`
  - `lib/sdk/auth-manager.ts`
  - `lib/sdk/error-handler.ts`
  - `lib/sdk/performance-monitor.ts`
- **Incoming connections:** 0
- **TDD Test:** `test('SDK profile manager is accessible', () => { const sdk = require('lib/sdk'); expect(sdk.getCurrentProfile).toBeDefined() })`
- **Remediation:** Integrate with set-profile command, use in gsi-install for authentication.

---

### Gap 5: lib/tool-optimization
- **Location:** `lib/tool-optimization/`
- **Status:** Disconnected
- **Severity:** High
- **Issue:** Provides TOOL_REGISTRY, ToolSelector, SituationAnalyzer for MCP tool selection guidance but is never used despite mcp-enforcer hook needing this capability.
- **Files:**
  - `lib/tool-optimization/index.js`
  - `lib/tool-optimization/tool-registry.js`
  - `lib/tool-optimization/tool-selector.js`
  - `lib/tool-optimization/situation-analyzer.js`
- **Incoming connections:** 0
- **TDD Test:** `test('tool-optimization recommends MCP over native', () => { const opt = require('lib/tool-optimization'); expect(opt.getToolRecommendation('Read').mcp).toBe('mcp__desktop-commander__read_file') })`
- **Remediation:** Import in hooks/pre-tool-use/mcp-enforcer.js for intelligent tool selection.

---

### Gap 6: lib/claudeception
- **Location:** `lib/claudeception/`
- **Status:** Disconnected
- **Severity:** High
- **Issue:** Self-improving knowledge extraction system with PostToolUse/PostResponse hooks but is never invoked from commands/gsi/claudeception.md or the hooks system.
- **Files:**
  - `lib/claudeception/index.ts`
  - `lib/claudeception/claudeception.ts`
- **Incoming connections:** 0
- **TDD Test:** `test('claudeception hooks are registered', () => { const cc = require('lib/claudeception'); const cmd = cc.createClaudeceptionCommand(); expect(cmd.name).toBe('gsi:claudeception') })`
- **Remediation:** Connect claudeception.md command to ClaudeceptionManager, register hooks in hooks.json.

---

### Gap 7: lib/context
- **Location:** `lib/context/`
- **Status:** Disconnected
- **Severity:** High
- **Issue:** Provides path-resolver, install-detector for detecting GSI installation type but no commands or hooks import it.
- **Files:**
  - `lib/context/index.js`
  - `lib/context/path-resolver.js`
  - `lib/context/install-detector.js`
- **Incoming connections:** 0
- **TDD Test:** `test('context detects install type', () => { const ctx = require('lib/context'); expect(ctx.detectInstallType).toBeDefined() })`
- **Remediation:** Use in gsi-install module, integrate with settings command.

---

## Medium Gaps (Test-Only Connections)

### Gap 8: lib/enhancement
- **Location:** `lib/enhancement/`
- **Status:** Under-connected
- **Severity:** Medium
- **Issue:** Feature registry and MCP coordinator only used internally. No commands expose enhancement capabilities.
- **Files:**
  - `lib/enhancement/index.js`
  - `lib/enhancement/feature-registry.js`
  - `lib/enhancement/orchestrator.js`
  - `lib/enhancement/mcp-coordinator.js`
  - `lib/enhancement/metrics.js`
- **Incoming connections:** 2 (internal only)
- **TDD Test:** `test('enhancement features are queryable', () => { const enh = require('lib/enhancement'); expect(enh.getAllFeatures().length).toBeGreaterThan(0) })`
- **Remediation:** Create `/gsi:features` command to expose feature registry.

---

### Gap 9: lib/distribution
- **Location:** `lib/distribution/`
- **Status:** Under-connected
- **Severity:** Medium
- **Issue:** Provides CXcompress, DeltaCompress, Electrobun, Superdoc for distribution but only used by tests.
- **Files:**
  - `lib/distribution/index.ts`
  - `lib/distribution/cxcompress.ts`
  - `lib/distribution/delta-compress.ts`
  - `lib/distribution/electrobun.ts`
  - `lib/distribution/superdoc.ts`
  - `lib/distribution/api-docs.ts`
- **Incoming connections:** 0 (tests only)
- **TDD Test:** `test('distribution layer builds artifacts', () => { const dist = require('lib/distribution'); expect(dist.DistributionLayer).toBeDefined() })`
- **Remediation:** Create `/gsi:build` command for distribution, integrate with update workflow.

---

### Gap 10: lib/agent-framework
- **Location:** `lib/agent-framework/`
- **Status:** Under-connected
- **Severity:** Medium
- **Issue:** Provides agent-lightning, picobot, ralph, task-queue, playbooks for agent orchestration but only used by tests.
- **Files:**
  - `lib/agent-framework/index.js`
  - `lib/agent-framework/agent-lightning.js`
  - `lib/agent-framework/picobot.js`
  - `lib/agent-framework/ralph.js`
  - `lib/agent-framework/task-queue.js`
  - `lib/agent-framework/profiles.js`
  - `lib/agent-framework/claude-sdk.js`
  - `lib/agent-framework/playbooks/`
- **Incoming connections:** 0 (tests only)
- **TDD Test:** `test('agent-framework creates task queue', () => { const af = require('lib/agent-framework'); expect(new af.TaskQueue()).toBeDefined() })`
- **Remediation:** Create `/gsi:agent` command, integrate with workflow-engine.

---

### Gap 11: lib/core-engine
- **Location:** `lib/core-engine/`
- **Status:** Under-connected
- **Severity:** Medium
- **Issue:** Provides codegraph, fastcode, files-to-prompt, semantic-search but files-to-prompt command does not import from this module.
- **Files:**
  - `lib/core-engine/index.js`
  - `lib/core-engine/codegraph.js`
  - `lib/core-engine/fastcode.js`
  - `lib/core-engine/files-to-prompt.js`
  - `lib/core-engine/search-index.js`
  - `lib/core-engine/semantic-search.js`
- **Incoming connections:** 0 (tests only)
- **TDD Test:** `test('core-engine files-to-prompt is used by command', () => { const cmd = readCommand('files-to-prompt'); expect(cmd).toContain('lib/core-engine') })`
- **Remediation:** Update files-to-prompt.md to use core-engine module.

---

## Connected Modules (Reference)

The following modules have proper integration:

| Module | Connections | Entry Points |
|--------|-------------|--------------|
| lib/thinking | 53+ | thinking-invoke hook, all commands via thinking_phase |
| lib/prompt-enhancer | 24 | prompt-enhancer hook |
| lib/reflection | 31 | reflection-capture hook |
| lib/pattern-learning | 17 | orchestrator, thinking module |
| lib/complexity | 2 | complexity-check hook |
| lib/gsi-integration | 50+ | check-gsi-updates hook |
| lib/workflow-modules | 38 | workflow-chainer, knowledge-base docs |
| lib/context-optimization | 15 | knowledge module, tests |
| lib/semantic-intervention | 10 | tests, README |
| lib/command-thinking | 27 | command wrappers |
| lib/workflow-engine | 3 | tests |

---

## Missing Command Entry Points

| Module | Suggested Command | Purpose |
|--------|-------------------|---------|
| lib/knowledge-hub | `/gsi:knowledge` | Query knowledge producers/consumers |
| lib/knowledge | `/gsi:search-knowledge` | Semantic knowledge search |
| lib/module-registry | `/gsi:module-status` | Health check all lib modules |
| lib/sdk | `/gsi:sdk-config` | SDK profile and auth management |
| lib/tool-optimization | (integrate in mcp-enforcer) | Intelligent tool selection |
| lib/claudeception | `/gsi:claudeception` | Knowledge extraction (exists but disconnected) |
| lib/context | (integrate in gsi-install) | Installation context detection |
| lib/enhancement | `/gsi:features` | Feature registry exploration |
| lib/distribution | `/gsi:build` | Distribution layer operations |
| lib/agent-framework | `/gsi:agent` | Agent orchestration |
| lib/core-engine | (integrate in files-to-prompt) | Core engine capabilities |

---

## Integration Recommendations

### Priority 1 (Critical - Dead Code Risk)
1. Connect lib/claudeception to hooks.json and claudeception.md command
2. Connect lib/tool-optimization to mcp-enforcer.js hook
3. Connect lib/knowledge-hub to reflection-capture hook

### Priority 2 (High - Feature Gaps)
4. Create `/gsi:knowledge` command for lib/knowledge module
5. Create `/gsi:module-status` command for lib/module-registry
6. Integrate lib/sdk with set-profile and gsi-install commands

### Priority 3 (Medium - Consolidation)
7. Connect lib/core-engine to files-to-prompt.md command
8. Create `/gsi:features` command for lib/enhancement
9. Create `/gsi:build` command for lib/distribution

### Priority 4 (Lower - Future Use)
10. Create `/gsi:agent` command for lib/agent-framework
11. Connect lib/context to gsi-install module

---

## Dead Code Candidates

The following modules have zero connections and could be considered for removal if not planned for future use:

- `lib/knowledge-hub/` - Unless knowledge flow is planned
- `lib/module-registry/` - Unless module health monitoring is planned
- `lib/sdk/` - Unless SDK integration is planned

**Recommendation:** Before removal, verify against roadmap and planned features.

---

*Gap analysis generated: 2026-02-20*
*Method: Code index search for import/require patterns*
*Total files indexed: 466*
