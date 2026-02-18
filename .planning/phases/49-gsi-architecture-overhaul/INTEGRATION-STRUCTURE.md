# GSI Package Integration Structure

---
created: 2026-02-18
phase: 49
status: planned
---

## Overview

GSI will become a complete, self-contained TypeScript package with:
- Forked & customized `files-to-prompt` with `--cxml` support
- Custom MCP server exposing GSI internal tools
- Unified TypeScript CLI (`gsi-tools`)
- Cross-platform distribution via electrobun

## Repository Integrations

### 1. files-to-prompt (Fork & Customize)
**Source**: https://github.com/simonw/files-to-prompt

**Custom Additions**:
```bash
# New flags
files-to-prompt <path> --cxml              # Claude Code XML format
files-to-prompt <path> --gsi               # GSI mode (auto CXML + structure)
files-to-prompt <path> --output-dir ./...  # Custom output directory
files-to-prompt <path> --watch             # Continuous updates
```

**Integration Location**: `lib/files-to-prompt/`

### 2. electrobun (Distribution)
**Source**: https://github.com/blackboardsh/electrobun

**Purpose**: Bundle GSI as cross-platform desktop app

### 3. superpowers (MCP Components)
**Source**: https://github.com/obra/superpowers

**Extract**:
- `semantic-code-search` → Compare with CI search
- `mcporter` → MCP server porting

### 4. Additional Integrations

| Repo | URL | Use Case |
|------|-----|----------|
| picoclaw | https://github.com/sipeed/picoclaw | Web fetching |
| mdream | https://github.com/harlan-zw/mdream | Workflow enhancement |
| agent-lightning | https://github.com/microsoft/agent-lightning | Agent spawning |
| PromptChains | https://github.com/MIATECHPARTNERS/PromptChains | Chain patterns |

## Target Directory Structure

```
get-shit-done-code-index/
├── src/
│   ├── cli/                          # TypeScript CLI
│   │   ├── index.ts                  # Main entry (gsi-tools)
│   │   └── commands/
│   │       ├── phases-list.ts
│   │       ├── roadmap-get.ts
│   │       ├── state-snapshot.ts
│   │       ├── generate-context.ts
│   │       ├── install-hooks.ts
│   │       └── execute-phase.ts
│   │
│   └── lib/
│       ├── files-to-prompt/          # FORKED & CUSTOMIZED
│       │   ├── index.ts
│       │   ├── cli.ts
│       │   └── formatters/
│       │       ├── markdown.ts
│       │       ├── cxml.ts           # NEW: Claude Code XML
│       │       └── gsi.ts            # NEW: GSI format
│       │
│       ├── mcp-servers/
│       │   └── gsi-custom/           # NEW: Custom MCP server
│       │       ├── src/
│       │       │   ├── index.ts
│       │       │   ├── tools/
│       │       │   │   ├── gsi-analyze-gaps.ts
│       │       │   │   ├── gsi-generate-context.ts
│       │       │   │   └── gsi-enhance-prompt.ts
│       │       │   └── resources/
│       │       └── package.json
│       │
│       ├── prompt-enhancer/          # Existing
│       ├── pattern-learning/         # Existing
│       ├── complexity/               # Existing
│       └── gsi-integration/          # Existing
│
├── dist/                             # Built output
│   ├── cli/
│   └── lib/
│
├── hooks/                            # Existing hooks (TypeScript)
├── commands/gsi/                     # GSI command definitions
├── workflows/                        # Workflow files
├── .planning/                        # Planning directory
│   ├── context/                      # NEW: Generated context files
│   │   ├── phases/
│   │   └── commands/
│   ├── phases/
│   ├── ROADMAP.md
│   └── STATE.md
│
├── package.json
├── tsconfig.json
└── README.md
```

## gsi-tools CLI Commands

```bash
# Context Generation (from files-to-prompt)
gsi-tools generate-context <path> [--format cxml|md] [--output <dir>]

# Phase Management
gsi-tools phases list [--type plans|all]
gsi-tools roadmap get-phase <id>
gsi-tools state-snapshot

# Hook Management
gsi-tools install-hooks [--force]
gsi-tools uninstall-hooks

# Workflow Execution
gsi-tools init execute-phase <id> [--include state,config]
gsi-tools init plan-phase <id> [--include roadmap,research]

# MCP Server
gsi-tools mcp start                    # Start gsi-custom MCP server
gsi-tools mcp tools list               # List available tools
```

## Package.json Structure

```json
{
  "name": "get-shit-indexed",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "gsi-tools": "./dist/cli/index.js"
  },
  "main": "./dist/lib/index.js",
  "types": "./dist/lib/index.d.ts",
  "exports": {
    ".": "./dist/lib/index.js",
    "./cli": "./dist/cli/index.js",
    "./mcp-server": "./dist/lib/mcp-servers/gsi-custom/index.js"
  },
  "scripts": {
    "build": "tsc",
    "postinstall": "node ./dist/cli/commands/install-hooks.js",
    "mcp:start": "node ./dist/lib/mcp-servers/gsi-custom/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "commander": "^12.0.0",
    "glob": "^10.0.0",
    "xmlbuilder2": "^3.0.0",
    "marked": "^12.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

## Context File Generation

### Usage Examples

```bash
# Generate context for all GSI commands
gsi-tools generate-context ./commands/gsi --format cxml --output .planning/context/commands/

# Generate context for a phase
gsi-tools generate-context .planning/phases/41-gsi-total-project-rectification --format cxml

# Generate context with watch mode (continuous updates)
gsi-tools generate-context ./lib --format cxml --watch
```

### Output Format (CXML)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<claude_context>
  <files>
    <file path="commands/gsi/execute-phase.md">
      <content>
        <![CDATA[
        ... file content ...
        ]]>
      </content>
    </file>
  </files>
  <metadata>
    <generated_at>2026-02-18T12:00:00Z</generated_at>
    <file_count>30</file_count>
    <total_tokens>45000</total_tokens>
  </metadata>
</claude_context>
```

## Next Steps

1. Clone `files-to-prompt` to `lib/files-to-prompt/`
2. Add `--cxml` formatter
3. Create `gsi-custom` MCP server
4. Convert CLI to TypeScript
5. Set up build system
6. Test distribution
