<div align="center">

# Get Shit Indexed (GSI)

**An MCP-enhanced fork of [get-shit-done](https://github.com/GSD-build/get-shit-done)** — featuring 80-90% token savings through native MCP server integration.

A light-weight and powerful meta-prompting, context engineering and spec-driven development system for Claude Code.

[![npm version](https://img.shields.io/npm/v/get-shit-indexed-cc?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/get-shit-indexed-cc)
[![GitHub stars](https://img.shields.io/github/stars/Alot1z/get-shit-indexed?style=for-the-badge&logo=github&color=181717)](https://github.com/Alot1z/get-shit-indexed)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

<br>

```bash
npx get-shit-indexed-cc@latest
```

**Works on Mac, Windows, and Linux.**

<br>

![GSI Install](assets/terminal.svg)

</div>

---

## Why This Fork Exists

**The original [get-shit-done](https://github.com/GSD-build/get-shit-done)** is an excellent spec-driven development system. But it was built primarily with native tools (Bash, Read, Write, Grep).

**This fork rewrites every workflow to use MCP (Model Context Protocol) servers instead of native tools**, resulting in:

| Metric | Original GSD | This Fork (GSI) | Savings |
|--------|--------------|-----------------|---------|
| File operations | ~15K tokens/call | ~1-2K tokens/call | **80-90%** |
| Code search | ~15K tokens/call | ~2-3K tokens/call | **80%** |
| Process spawning | ~15K tokens/call | ~2K tokens/call | **85%** |

**Why it matters:** With 200K context windows, every token saved = more room for actual work. An 80% reduction in tool overhead means you can execute 5x more operations before hitting context limits.

---

## MCP Server Integration

GSI integrates **3 operational MCP servers** + **3 thinking MCP servers**:

### Operational Servers

| Server | Purpose | Token Savings | Example Usage |
|--------|---------|---------------|---------------|
| **Desktop Commander** | File/process operations | 80-90% | `read_file`, `write_file`, `start_process` |
| **Code-Index MCP** | Code search & symbols | 80% | `search_code_advanced`, `find_files`, `get_symbol_body` |
| **CodeGraphContext** | Relationship analysis | 85% | `analyze_code_relationships`, `find_callers`, `query` |

### Thinking Servers

| Server | Purpose | Integration Point |
|--------|---------|-------------------|
| **Sequential Thinking** | Multi-step decomposition | Planning, debugging |
| **Tractatus Thinking** | Logical structure analysis | Architecture, verification |
| **Debug Thinking** | Graph-based problem solving | Debugging, diagnostics |

### Tool Priority Hierarchy

Every workflow follows this priority:

```
1. Skills (pre-compressed) → 80-90% savings
2. MCP Tools → 50-70% savings  
3. Native Tools → baseline (fallback only)
```

**Golden Pattern:**
```
CodeGraphContext (discover) → Code-Index (understand) → Desktop Commander (act)
```

---

## Comparison: Native vs MCP Tools

### File Operations

| Operation | Native Tool | MCP Tool | Token Savings |
|-----------|-------------|----------|---------------|
| Read file | `Read` (~15K) | `desktop-commander.read_file` (~2K) | **87%** |
| Write file | `Write` (~15K) | `desktop-commander.write_file` (~2K) | **87%** |
| Edit file | `Edit` (~15K) | `desktop-commander.edit_block` (~2K) | **87%** |
| List directory | `Bash ls` (~15K) | `desktop-commander.list_directory` (~1K) | **93%** |
| Read multiple | 3× `Read` (~45K) | `read_multiple_files` (~5K) | **89%** |

### Code Search

| Operation | Native Tool | MCP Tool | Token Savings |
|-----------|-------------|----------|---------------|
| Search code | `Grep` (~15K) | `code-index.search_code_advanced` (~3K) | **80%** |
| Find files | `Glob` (~10K) | `code-index.find_files` (~1K) | **90%** |
| Get symbol | Manual analysis | `code-index.get_symbol_body` (~2K) | **85%** |

### Process Operations

| Operation | Native Tool | MCP Tool | Token Savings |
|-----------|-------------|----------|---------------|
| Start process | `Bash` (~15K) | `desktop-commander.start_process` (~2K) | **87%** |
| Read output | N/A | `desktop-commander.read_process_output` (~1K) | N/A |
| Interact | N/A | `desktop-commander.interact_with_process` (~1K) | N/A |

---

## 7-BMAD Methodology

GSI validates all work against the **7-BMAD quality circles**:

| Circle | Focus | Validation Tool |
|--------|-------|-----------------|
| **Method** | Implementation correctness | `code-review-expert` |
| **Mad** | Integration completeness | `code-review-expert` |
| **Model** | Architecture alignment | `tractatus-thinking` |
| **Mode** | Pattern consistency | `code-review-expert` |
| **Mod** | Maintainability standards | `code-review-expert` |
| **Modd** | Extensibility verification | `tractatus-thinking` |
| **Methodd** | Documentation quality | `code-review-expert` |

---

## What's Different from Original GSD

| Feature | Original GSD | GSI Fork |
|---------|--------------|----------|
| File operations | Native Bash/Read/Write | Desktop Commander MCP |
| Code search | Native Grep/Glob | Code-Index MCP |
| Relationship analysis | Manual | CodeGraphContext MCP |
| Thinking tools | None integrated | 3 thinking servers |
| Token efficiency | Baseline | 80-90% savings |
| Quality validation | Manual | Auto-validation (7-BMAD) |
| Tool priority | None enforced | Skills → MCP → Native |

---

## Getting Started

```bash
npx get-shit-indexed-cc@latest
```

The installer prompts you to choose:
1. **Runtime** — Claude Code (recommended), OpenCode, or Gemini
2. **Location** — Global (all projects) or local (current project only)

Verify with `/gsi:help` inside Claude Code.

### Non-interactive Install

```bash
# Claude Code global
npx get-shit-indexed-cc --claude --global

# Claude Code local (project-specific)
npx get-shit-indexed-cc --claude --local
```

### Recommended: Skip Permissions Mode

```bash
claude --dangerously-skip-permissions
```

---

## Core Commands

### Workflow

| Command | Description |
|---------|-------------|
| `/gsi:new-project` | Initialize: questions → research → requirements → roadmap |
| `/gsi:plan-phase [N]` | Research + plan + verify for a phase |
| `/gsi:execute-phase <N>` | Execute plans in parallel waves |
| `/gsi:verify-work [N]` | Manual user acceptance testing |
| `/gsi:complete-milestone` | Archive milestone, tag release |

### Utilities

| Command | Description |
|---------|-------------|
| `/gsi:map-codebase` | Analyze existing codebase before new-project |
| `/gsi:progress` | Show current position and next steps |
| `/gsi:quick` | Execute ad-hoc task with GSI guarantees |
| `/gsi:debug` | Systematic debugging with persistent state |
| `/gsi:settings` | Configure model profile and workflow agents |

### Phase Management

| Command | Description |
|---------|-------------|
| `/gsi:add-phase` | Append phase to roadmap |
| `/gsi:insert-phase [N]` | Insert urgent work between phases |
| `/gsi:pause-work` | Create handoff when stopping mid-phase |
| `/gsi:resume-work` | Restore from last session |

---

## How It Works

### 1. Initialize Project

```
/gsi:new-project
```

The system:
1. **Questions** — Asks until it understands your idea
2. **Research** — Spawns parallel agents to investigate the domain
3. **Requirements** — Extracts v1/v2/out-of-scope
4. **Roadmap** — Creates phases mapped to requirements

### 2. Plan Phase

```
/gsi:plan-phase 1
```

1. **Researches** — Investigates how to implement
2. **Plans** — Creates atomic task plans with XML structure
3. **Verifies** — Checks plans against requirements

### 3. Execute Phase

```
/gsi:execute-phase 1
```

1. **Runs plans in waves** — Parallel where possible
2. **Fresh context per plan** — 200k tokens for implementation
3. **Commits per task** — Atomic commits with clear history
4. **Verifies against goals** — Checks deliverables match promises

---

## Architecture

```
GSI System Architecture
├── MCP Servers
│   ├── Desktop Commander (DC) — File & process operations
│   ├── Code-Index (CI) — Code search & symbol navigation
│   └── CodeGraphContext (CG) — Relationship analysis
├── Thinking Servers
│   ├── Sequential — Multi-step decomposition
│   ├── Tractatus — Logical structure analysis
│   └── Debug — Graph-based problem solving
├── Quality System
│   ├── 7-BMAD Validation Gates
│   ├── Auto-validation on completion
│   └── Code review expert skill
└── Workflows
    ├── plan-phase.md
    ├── execute-phase.md
    ├── map-codebase.md
    └── 27 more workflows
```

---

## Configuration

Model profiles for quality vs token balance:

| Profile | Planning | Execution | Verification |
|---------|----------|-----------|--------------|
| `quality` | Opus | Opus | Sonnet |
| `balanced` (default) | Opus | Sonnet | Sonnet |
| `budget` | Sonnet | Sonnet | Haiku |

Switch: `/gsi:set-profile budget`

---

## Credits

**Original Project:** [get-shit-done](https://github.com/GSD-build/get-shit-done) by TÂCHES

**This Fork:** MCP integration, thinking server integration, 7-BMAD quality system, and 80-90% token optimization.

---

## Star History

<a href="https://star-history.com/#Alot1z/get-shit-indexed&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Alot1z/get-shit-indexed&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Alot1z/get-shit-indexed&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Alot1z/get-shit-indexed&type=Date" />
 </picture>
</a>

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Claude Code is powerful. GSI makes it efficient.**

</div>
