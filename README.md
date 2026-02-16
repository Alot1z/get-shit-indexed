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

## Thinking Servers

Three thinking servers for enhanced reasoning:

- **Sequential** — Multi-step problem decomposition
- **Tractatus** — Logical structure analysis
- **Debug** — Graph-based problem-solving

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
└── .planning/        # Project state
```

## Credits

Forked from [get-shit-done](https://github.com/glittercowboy/get-shit-done) by TÂCHES.

Original GSD provided workflow structure and planning methodology. GSI adds:
- MCP tool integration (80-90% token savings)
- Three thinking servers
- Simplified architecture

## License

MIT
