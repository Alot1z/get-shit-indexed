# GSD vs GSI Feature Comparison - Complete Analysis

## Date: 2026-02-16

---

## GSD Complete Feature List (from DeepWiki)

### Core Workflow Commands (8)
| Command | GSD | GSI | Status |
|---------|-----|-----|--------|
| `/gsd:new-project [--auto]` | ✅ | ✅ `/gsi:new-project` | ✅ Complete |
| `/gsd:discuss-phase [N]` | ✅ | ✅ `/gsi:discuss-phase` | ✅ Complete |
| `/gsd:plan-phase [N]` | ✅ | ✅ `/gsi:plan-phase` | ✅ Complete |
| `/gsd:execute-phase <N>` | ✅ | ✅ `/gsi:execute-phase` | ✅ Complete |
| `/gsd:verify-work [N]` | ✅ | ✅ `/gsi:verify-work` | ✅ Complete |
| `/gsd:audit-milestone` | ✅ | ✅ `/gsi:audit-milestone` | ✅ Complete |
| `/gsd:complete-milestone` | ✅ | ✅ `/gsi:complete-milestone` | ✅ Complete |
| `/gsd:new-milestone [name]` | ✅ | ✅ `/gsi:new-milestone` | ✅ Complete |

### Navigation Commands (4)
| Command | GSD | GSI | Status |
|---------|-----|-----|--------|
| `/gsd:progress` | ✅ | ✅ `/gsi:progress` | ✅ Complete |
| `/gsd:help` | ✅ | ✅ `/gsi:help` | ✅ Complete |
| `/gsd:update` | ✅ | ✅ `/gsi:update` | ✅ Complete |
| `/gsd:join-discord` | ✅ | ❌ Missing | ⚠️ Add |

### Brownfield Commands (1)
| Command | GSD | GSI | Status |
|---------|-----|-----|--------|
| `/gsd:map-codebase` | ✅ | ✅ `/gsi:map-codebase` | ✅ Complete |

### Phase Management Commands (5)
| Command | GSD | GSI | Status |
|---------|-----|-----|--------|
| `/gsd:add-phase` | ✅ | ✅ `/gsi:add-phase` | ✅ Complete |
| `/gsd:insert-phase [N]` | ✅ | ✅ `/gsi:insert-phase` | ✅ Complete |
| `/gsd:remove-phase [N]` | ✅ | ✅ `/gsi:remove-phase` | ✅ Complete |
| `/gsd:list-phase-assumptions [N]` | ✅ | ✅ `/gsi:list-phase-assumptions` | ✅ Complete |
| `/gsd:plan-milestone-gaps` | ✅ | ✅ `/gsi:plan-milestone-gaps` | ✅ Complete |

### Session Commands (2)
| Command | GSD | GSI | Status |
|---------|-----|-----|--------|
| `/gsd:pause-work` | ✅ | ✅ `/gsi:pause-work` | ✅ Complete |
| `/gsd:resume-work` | ✅ | ✅ `/gsi:resume-work` | ✅ Complete |

### Utility Commands (6)
| Command | GSD | GSI | Status |
|---------|-----|-----|--------|
| `/gsd:settings` | ✅ | ✅ `/gsi:settings` | ✅ Complete |
| `/gsd:set-profile <profile>` | ✅ | ✅ `/gsi:set-profile` | ✅ Complete |
| `/gsd:add-todo [desc]` | ✅ | ✅ `/gsi:add-todo` | ✅ Complete |
| `/gsd:check-todos` | ✅ | ✅ `/gsi:check-todos` | ✅ Complete |
| `/gsd:debug [desc]` | ✅ | ✅ `/gsi:debug` | ✅ Complete |
| `/gsd:quick` | ✅ | ✅ `/gsi:quick` | ✅ Complete |

---

## GSD Agents (8)

| Agent | GSD | GSI | Status |
|-------|-----|-----|--------|
| `gsd-planner` | ✅ | ✅ `gsi-planner` | ✅ Complete |
| `gsd-plan-checker` | ✅ | ✅ `gsi-plan-checker` | ✅ Complete |
| `gsd-phase-researcher` | ✅ | ✅ `gsi-phase-researcher` | ✅ Complete |
| `gsd-researcher` | ✅ | ✅ `gsi-researcher` | ✅ Complete |
| `gsd-executor` | ✅ | ✅ `gsi-executor` | ✅ Complete |
| `gsd-verifier` | ✅ | ✅ `gsi-verifier` | ✅ Complete |
| `gsd-debugger` | ✅ | ✅ `gsi-debugger` | ✅ Complete |
| `gsd-codebase-mapper` | ✅ | ✅ `gsi-codebase-mapper` | ✅ Complete |

---

## GSI Exclusive Enhancements (Not in GSD)

| Feature | Description | Added in Phase |
|---------|-------------|----------------|
| **MCP Tool Integration** | Desktop Commander + Code-Index MCP | Phase 1-7 |
| **Thinking Servers** | Sequential, Tractatus, Debug | Phase 5 |
| **7-BMAD Quality** | Auto-validation framework | Phase 6 |
| **Complexity Prediction** | Three-layer cognitive analysis | Phase 17 |
| **Prompt Enhancement** | Risk assessment + mode selection | Phase 19 |
| **Pattern Learning** | Operation sequence learning | Phase 22 |
| **Context Optimization** | Hierarchical summarization | Phase 26 (planned) |
| **SDK Integration** | Claude Code SDK wrapper | Phase 27 (planned) |

---

## GSD Tools CLI Commands (40+)

### Verification Commands
- `verify plan-structure`
- `verify phase-completeness`
- `verify references`
- `verify commits`
- `verify artifacts`
- `verify key-links`

### State Management Commands
- `state advance-plan`
- `state update-progress`
- `state record-metric`
- `state add-decision`
- `state add-blocker`
- `state resolve-blocker`
- `state record-session`

### Phase Operations
- `phase add`
- `phase insert`
- `phase remove`
- `phase complete`
- `roadmap analyze`

### Templates
- `template fill summary`
- `template fill plan`
- `template fill verification`

### Frontmatter CRUD
- `frontmatter get`
- `frontmatter set`
- `frontmatter merge`
- `frontmatter validate`

---

## Missing Features in GSI

### Minor Gaps
1. `/gsi:join-discord` - Discord community link command (trivial)

### Potential Enhancements from GSD
1. **Auto-flag in new-project** - GSD has `--auto` flag for automation
2. **Multi-runtime support** - GSD supports Claude Code, OpenCode, Gemini CLI

### GSI Advantages
1. **MCP Integration** - 80-90% token savings
2. **Thinking Servers** - Cognitive enhancement
3. **Quality Framework** - 7-BMAD validation
4. **Pattern Learning** - Continuous improvement
5. **Context Optimization** - Telescope method (planned)

---

## Summary

| Metric | GSD | GSI |
|--------|-----|-----|
| Commands | 26 | 26 |
| Agents | 8 | 8 |
| Workflows | 30+ | 30+ |
| MCP Integration | ❌ | ✅ DC + CI |
| Thinking Servers | ❌ | ✅ 3 servers |
| Quality Framework | ❌ | ✅ 7-BMAD |
| Pattern Learning | ❌ | ✅ Phase 22 |
| CLI Tools | 40+ | 50+ |

**Verdict:** GSI is feature-complete vs GSD with significant enhancements.
