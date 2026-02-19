# GSI Project Abstract
> **Last Updated**: 2026-02-19
> **Version**: 1.0
> **Total Phases**: 49
> **Completed**: 24 (50%)
> **In Progress**: Phase 49

## What is GSI (Get Shit Indexed)?

GSI is a comprehensive AI code indexing system that enables LLMs to work with codebases efficiently. It provides:
- **Zero-token indexing** - Query code without reading files
- **MCP server integration** - 13 specialized servers
- **Cognitive flow** - 3 thinking tools for systematic analysis
- **7-BMAD quality framework** - 7-circle validation

## Core Components

### 1. MCP Server Architecture
- **Desktop Commander (DC)**: 71% token savings, file/process operations
- **Code-Index MCP (CI)**: 80% token savings, code search/symbol navigation
- **CodeGraphContext (CG)**: 70% token savings, relationship analysis
- **Sequential Thinking**: Step-by-step problem decomposition
- **Tractatus Thinking**: Logical structure analysis
- **Debug Thinking**: Problem-solution mapping
- **Context7**: Library documentation retrieval
- **DeepWiki**: GitHub repository knowledge
- **Context-Crawl**: Web crawling
- **RAG-Web-Browser**: Search and extraction
- **DeepSeek-OCR**: OCR processing
- **Firecrawl**: Web scraping

### 2. Zero-Token Indexing
A system where LLMs can query project state without reading all files:
- **SYMBOL-TABLE.json**: All phases, plans, features as queryable keys
- **SEMANTIC-INDEX.cxml**: Maps topics to line ranges
- **CHUNK-MAP.json**: Progressive loading structure
- **ABSTRACT.md**: This file - one-page overview

### 3. Tool Priority
```
Skills → DesktopCommander MCP → Other MCP → Native Tools
```
**Savings**: 85% token reduction overall

### 4. Three-Tier Distribution
- **CLI**: npm install -g @get-shit-indexed/cli (~5MB)
- **Desktop**: Electrobun packaging (14MB bundles)
- **Updates**: Delta patches via bsdiff (~5MB)

## Key Technical Decisions
| Decision | Choice | Reason |
|----------|--------|--------|
| Packaging | Electrobun | 14MB vs 150MB for Electron |
| Naming | `prompt-enhancer` | User preference, clear purpose |
| MCP Conversion | TypeScript CLI | 88% token reduction |
| Context Optimization | files-to-prompt --cxml | 95% token savings |

## Phase 49: Current Work
**Status**: In Progress
**Sub-phases**: 9 (49-A through 49-I)

| Sub-Phase | Integrates | Focus | Tasks |
|-----------|-----------|-------|-------|
| 49-A | 20, 25, 26 | Cognitive Enhancement | 18 |
| 49-B | 27, 29 | SDK & Installation | 14 |
| 49-C | 28, 30, 31 | Documentation & Performance | 16 |
| 49-D | 32, 33 | Error Recovery & Plugins | 14 |
| 49-E | 34, 35 | CI/CD & Release | 12 |
| 49-F | 37, 38 | Phase4/Log | 16 |
| 49-G | 39, 50, 41 | GSI Command & Rectification | 20 |
| 49-H |42-47 | Tool Optimization & Architecture | 18 |
| 49-I | NEW | Historical Knowledge Extraction | 10 |

## Quick Start
```bash
# Install GSI
npm install -g @get-shit-indexed/cli

# Initialize project
gsi init

# Map codebase
gsi map-codebase

# Plan phase
gsi plan-phase 1

# Execute phase
gsi execute-phase 1
```

## Documentation
- **ROADMAP.md** - Complete phase listing
- **STATE.md** - Current project state
- **EXTRACTED-KNOWLEDGE.md** - Knowledge from conversation history
- **ZERO-TOKEN-INDEXING.md** - Zero-token system design
- **SYMBOL-TABLE.json** - Queryable index

---
*This file provides instant project context without reading 326MB of conversation history*
