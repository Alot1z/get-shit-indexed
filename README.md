# Get Shit Indexed

A light-weight and powerful meta-prompting, context engineering and spec-driven development system for Claude Code, OpenCode, and Gemini CLI.

**Solves context rot** — the quality degradation that happens as Claude fills its context window.

```
npx get-shit-indexed-cc@latest
```

![GSI Terminal](assets/terminal.svg)

## Why This Fork

Forked from [get-shit-done](https://github.com/glittercowboy/get-shit-done) with MCP tool integration for **80-90% token savings**.

Native tools (Bash, Read, Write, Grep, Glob) burn through context windows with protocol overhead. GSI uses MCP tools instead:

| Operation | Native | MCP | Savings |
|-----------|--------|-----|---------|
| Read file | ~15K tokens | ~2K tokens | 87% |
| Write file | ~15K tokens | ~2K tokens | 87% |
| Search code | ~15K tokens | ~3K tokens | 80% |
| List files | ~15K tokens | ~2K tokens | 87% |

**Same work, 80-90% less context waste.**

## Quick Start

```bash
# Interactive install
npx get-shit-indexed-cc

# Non-interactive
npx get-shit-indexed-cc --claude --global
npx get-shit-indexed-cc --opencode --global
npx get-shit-indexed-cc --gemini --global
npx get-shit-indexed-cc --all --global
```

Verify with `/gsi:help` inside Claude Code.

## Features

### Prompt Enhancement System (NEW)

GSI now includes an intelligent prompt analysis and enhancement system:

- **Risk Assessment** — Scores prompts 0-100 for complexity
- **Mode Selection** — Auto-selects enhancement intensity (none/light/standard/full)
- **Template System** — 5 enhancement templates (Engineering, Clarity, Decomposed, Academic, Security)
- **Local Processing** — No external API calls, <5ms response time

```javascript
const { analyzePrompt, fullEnhance } = require('get-shit-indexed-cc/lib/prompt-enhancer');

const analysis = analyzePrompt('Implement authentication');
// { riskScore: 45, mode: 'standard', template: 'engineering' }

const result = fullEnhance('Build a REST API');
// Enhanced prompt with structure and clarity improvements
```

### Thinking Servers

Three thinking servers for enhanced reasoning:

- **Sequential** — Multi-step problem decomposition
- **Tractatus** — Logical structure analysis  
- **Debug** — Graph-based problem-solving

### GSI Statusline v2.0

Tokyo Night themed statusline with:
- Phase detection from STATE.md
- 8-segment gradient progress bar
- Context usage display
- Model identification

## How It Works

1. `/gsi:new-project` — Initialize project with research and requirements
2. `/gsi:plan-phase N` — Research + plan + verify phase N
3. `/gsi:execute-phase N` — Execute plans in parallel waves
4. `/gsi:verify-work` — User acceptance testing
5. `/gsi:complete-milestone` — Archive and release

## MCP Servers

GSI uses two MCP servers for token-efficient operations:

**Desktop Commander** — File operations, process management
- read_file, write_file, list_directory, start_process
- 80-90% token savings vs native tools

**Code-Index MCP** — Code search and symbol navigation  
- search_code_advanced, find_files, get_symbol_body
- 70-80% token savings vs Grep

## Commands

| Command | Purpose |
|---------|---------|
| `/gsi:new-project` | Initialize project |
| `/gsi:plan-phase N` | Plan phase N |
| `/gsi:execute-phase N` | Execute phase N |
| `/gsi:verify-work` | UAT validation |
| `/gsi:progress` | Show status |
| `/gsi:help` | All commands |
| `/gsi:yolo` | Maximum speed mode |

## Project Structure

```
get-shit-indexed/
├── bin/              # CLI installer
├── commands/         # 26 gsi commands
├── agents/           # 12 gsi agents
├── workflows/        # 30+ workflow definitions
├── references/       # Documentation
├── templates/        # Plan templates
├── lib/              # Core modules
│   ├── prompt-enhancer/  # Risk assessment + enhancement
│   ├── complexity/       # Complexity prediction
│   ├── thinking/         # Thinking orchestration
│   └── workflow-thinking/# Workflow integration
└── .planning/        # Project state
```

## Recent Changes

### v1.22.0 (2026-02-16)
- **Prompt Enhancement System** — Risk assessment engine with 0-100 scoring
- 5 enhancement templates (Engineering, Clarity, Decomposed, Academic, Security)
- Mode selection (none/light/standard/full) based on prompt complexity
- Local-only processing, <5ms response time

### v1.21.0 (2026-02-16)
- **GSI Statusline v2.0** — Tokyo Night edition
- CodeGraphContext removed — 2-server architecture (DC + CI only)
- Git author rewrite — all commits show "Mose" as author

## Credits

Forked from [get-shit-done](https://github.com/glittercowboy/get-shit-done) by TÂCHES.

Original GSD provided workflow structure and planning methodology. GSI adds:
- MCP tool integration (80-90% token savings)
- Three thinking servers
- Prompt enhancement system
- Simplified 2-server architecture

## License

MIT
