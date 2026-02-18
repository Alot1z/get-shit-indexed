# GSI Ultimate Integration Matrix

---
created: 2026-02-18
phase: 50
status: planned
priority: CRITICAL
---

## Overview

Complete integration of 20+ repositories into unified GSI ecosystem with:
- **Core Engine**: files-to-prompt + semantic-code-search + CodeGraphContext
- **Agent Framework**: agent-lightning + claude-agent-sdk + ralph-playbook
- **Knowledge System**: txtai + arscontexta + skill-compose
- **Distribution**: electrobun + superdoc
- **Workflow**: PromptChains + mdream + taskmaster

## Repository Integration Matrix

### Layer 1: Core Engine (Foundation)

| Repository | URL | Function | Integration Point |
|------------|-----|----------|-------------------|
| **files-to-prompt** | https://github.com/simonw/files-to-prompt | Context generation | `lib/context-generator/` |
| **semantic-code-search** | https://github.com/sturdy-dev/semantic-code-search | AI code search | `lib/search/semantic/` |
| **CodeGraphContext** | https://github.com/CodeGraphContext/CodeGraphContext | Code graph analysis | `lib/graph/` |
| **FastCode** | https://github.com/HKUDS/FastCode | Fast code processing | `lib/fast-code/` |

**Chain Flow**:
```
files-to-prompt → semantic-code-search → CodeGraphContext → FastCode
     ↓                    ↓                     ↓              ↓
  Context           Semantic Index        Graph Analysis   Fast Processing
```

### Layer 2: Agent Framework (Intelligence)

| Repository | URL | Function | Integration Point |
|------------|-----|----------|-------------------|
| **agent-lightning** | https://github.com/microsoft/agent-lightning | Fast agent spawning | `lib/agents/spawner/` |
| **claude-agent-sdk** | https://github.com/anthropics/claude-agent-sdk-python | Claude SDK | `lib/agents/sdk/` |
| **ralph-playbook** | https://github.com/ClaytonFarr/ralph-playbook | Agent patterns | `lib/agents/playbook/` |
| **picobot** | https://github.com/louisho5/picobot | Bot framework | `lib/agents/bot/` |

**Chain Flow**:
```
claude-agent-sdk → agent-lightning → ralph-playbook → picobot
       ↓                  ↓                ↓            ↓
    Claude API       Fast Spawn       Patterns      Bot Interface
```

### Layer 3: Knowledge System (Memory)

| Repository | URL | Function | Integration Point |
|------------|-----|----------|-------------------|
| **txtai** | https://github.com/neuml/txtai | Embeddings/Vector DB | `lib/knowledge/embeddings/` |
| **arscontexta** | https://github.com/agenticnotetaking/arscontexta | Context management | `lib/knowledge/context/` |
| **skill-compose** | https://github.com/MooseGoose0701/skill-compose | Skill composition | `lib/knowledge/skills/` |

### Layer 4: Workflow Engine (Orchestration)

| Repository | URL | Function | Integration Point |
|------------|-----|----------|-------------------|
| **PromptChains** | https://github.com/MIATECHPARTNERS/PromptChains | Chain patterns | `lib/workflow/chains/` |
| **mdream** | https://github.com/harlan-zw/mdream | Workflow enhancement | `lib/workflow/dream/` |
| **taskmaster** | https://github.com/blader/taskmaster | Task management | `lib/workflow/tasks/` |

### Layer 5: Distribution (Delivery)

| Repository | URL | Function | Integration Point |
|------------|-----|----------|-------------------|
| **electrobun** | https://github.com/blackboardsh/electrobun | Desktop bundling | `dist/electrobun/` |
| **superdoc** | https://github.com/superdoc-dev/superdoc | Document processing | `lib/docs/processor/` |
| **CXcompress** | https://github.com/ZetaCrush/CXcompress | Context compression | `lib/compress/` |

### Layer 6: Enhancement (Polish)

| Repository | URL | Function | Integration Point |
|------------|-----|----------|-------------------|
| **visual-explainer** | https://github.com/nicobailon/visual-explainer | Visual docs | `lib/visual/` |
| **awesome-sdks** | https://github.com/pajaydev/awesome-sdks | SDK collection | `lib/sdks/` |
| **superpowers** | https://github.com/obra/superpowers | MCP tools | `lib/mcp/superpowers/` |

## Complete Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GSI UNIFIED SYSTEM                           │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    DISTRIBUTION LAYER                        │   │
│  │  electrobun (Desktop) + superdoc (Docs) + CXcompress        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    WORKFLOW ENGINE                           │   │
│  │  PromptChains + mdream + taskmaster                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    AGENT FRAMEWORK                           │   │
│  │  claude-agent-sdk + agent-lightning + ralph + picobot       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    KNOWLEDGE SYSTEM                          │   │
│  │  txtai (Embeddings) + arscontexta + skill-compose           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    CORE ENGINE                               │   │
│  │  files-to-prompt + semantic-search + CodeGraph + FastCode   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    ENHANCEMENT LAYER                         │   │
│  │  visual-explainer + awesome-sdks + superpowers (MCP)        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Unified CLI Commands

```bash
# Core Engine
gsi context generate <path>          # files-to-prompt --cxml
gsi search semantic <query>          # semantic-code-search
gsi graph analyze <file>             # CodeGraphContext
gsi code fast <operation>           # FastCode

# Agent Framework
gsi agent spawn <type>              # agent-lightning
gsi agent sdk <command>             # claude-agent-sdk
gsi playbook run <name>             # ralph-playbook
gsi bot start <config>              # picobot

# Knowledge System
gsi knowledge embed <text>          # txtai
gsi context manage <action>         # arscontexta
gsi skill compose <skills>          # skill-compose

# Workflow Engine
gsi chain run <chain>               # PromptChains
gsi dream enhance <workflow>        # mdream
gsi task queue <action>             # taskmaster

# Distribution
gsi build desktop                   # electrobun
gsi docs process <path>             # superdoc
gsi compress context                # CXcompress

# Enhancement
gsi visual explain <topic>          # visual-explainer
gsi sdk list                        # awesome-sdks
gsi mcp superpowers <tool>          # superpowers
```

## Integration Phases (12 Weeks)

| Phase | Week | Focus | Repositories |
|-------|------|-------|--------------|
| 50A | 1-2 | Core Engine | files-to-prompt, semantic-search, CodeGraph, FastCode |
| 50B | 3-4 | Agent Framework | claude-sdk, agent-lightning, ralph, picobot |
| 50C | 5-6 | Knowledge System | txtai, arscontexta, skill-compose |
| 50D | 7-8 | Workflow Engine | PromptChains, mdream, taskmaster |
| 50E | 9-10 | Distribution | electrobun, superdoc, CXcompress |
| 50F | 11-12 | Enhancement | visual-explainer, sdks, superpowers |

## Package Structure After Integration

```
get-shit-done-code-index/
├── src/
│   ├── cli/
│   │   └── gsi.ts                    # Unified CLI entry
│   │
│   └── lib/
│       ├── core/                     # Layer 1
│       │   ├── context-generator/    # files-to-prompt
│       │   ├── search/               # semantic-code-search
│       │   ├── graph/                # CodeGraphContext
│       │   └── fast-code/            # FastCode
│       │
│       ├── agents/                   # Layer 2
│       │   ├── sdk/                  # claude-agent-sdk
│       │   ├── spawner/              # agent-lightning
│       │   ├── playbook/             # ralph-playbook
│       │   └── bot/                  # picobot
│       │
│       ├── knowledge/                # Layer 3
│       │   ├── embeddings/           # txtai
│       │   ├── context/              # arscontexta
│       │   └── skills/               # skill-compose
│       │
│       ├── workflow/                 # Layer 4
│       │   ├── chains/               # PromptChains
│       │   ├── dream/                # mdream
│       │   └── tasks/                # taskmaster
│       │
│       ├── distribution/             # Layer 5
│       │   ├── desktop/              # electrobun
│       │   ├── docs/                 # superdoc
│       │   └── compress/             # CXcompress
│       │
│       └── enhancement/              # Layer 6
│           ├── visual/               # visual-explainer
│           ├── sdks/                 # awesome-sdks
│           └── mcp/                  # superpowers
│
├── dist/
├── package.json
└── tsconfig.json
```

## Success Metrics

1. **All 20 repositories** integrated and functional
2. **Unified CLI** with all commands working
3. **Desktop app** distributable via electrobun
4. **Context compression** achieving 80%+ reduction
5. **Semantic search** working across all GSI files
6. **Agent spawning** < 100ms latency
7. **Knowledge embeddings** for all GSI patterns
