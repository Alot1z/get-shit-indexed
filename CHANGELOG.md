# Changelog

All notable changes to GSI will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.21.0] - 2026-02-16

### Changed
- **README overhaul** — Simplified to match original GSD style, removed AI-slop (emojis, excessive Mermaid diagrams), focused on clarity
- **CodeGraphContext replaced** — All CG references replaced with code-index-mcp tools (search_code_advanced, get_symbol_body, get_file_summary)
- Simplified to 2 MCP servers: Desktop Commander + Code-Index MCP only
- Terminal image now at top of README like original GSD
- Command references updated to `npx get-shit-indexed-cc@latest`

### Added
- **GSI Statusline v2.0** — Tokyo Night edition with cyan/purple branding, phase display, improved progress bar
  - Shows: `GSI ◆ model │ task │ phase │ directory │ context`
  - Tokyo Night colors: Cyan (#7dcfff) for G/S, Purple (#bb9af7) for I
  - Auto-detects current phase from STATE.md
  - 8-segment gradient progress bar for context usage
  - Truncates long task names and directory names

### Fixed
- Git author rewrite — all commits now show "Mose" as author instead of "Claude Opus 4.6"
- Removed duplicate `get-shit-done/` directory (only `get-shit-indexed/` remains)
- Logo files updated to exact terminal block ASCII style (no 3D effects, no rings on logos)
- terminal.svg updated with diagonal "INDEX" text with ring effects

### Added
- `rewrite-author.bat` — Windows batch file for git author rewrite
- `gsi-logo-dark.svg` — Block ASCII GSI logo for dark backgrounds
- `gsi-logo-white.svg` — Block ASCII GSI logo for light backgrounds
- Tokyo Night color scheme: Cyan G/S (#7dcfff), Purple I (#bb9af7)

### Removed
- `hooks/start-cg-server.ps1` — No longer needed (CodeGraphContext removed)
- Excessive Mermaid diagrams that bloated README
- Duplicate `get-shit-done/` directory
- Old GSD logo files (gsd-logo-2000*)

## [1.20.0] - 2026-02-16

### Added
- npm publish as `get-shit-indexed-cc`
- `.npmrc` for npm authentication (added to .gitignore for security)
- Comprehensive README with Mermaid diagrams and feature tables
- GSI branding with terminal-style block ASCII logos

### Changed
- Package version bumped to 1.20.0
- All GSD references replaced with GSI branding

## [1.19.0] - 2026-02-15

### Added
- Complete GSI package with all 10 lib/ modules and 4 rules files
- Package verified: 228 files, 2.0 MB unpacked
- Installed globally to ~/.claude/get-shit-indexed/

## [1.18.0] - 2026-02-08

### Added
- `--auto` flag for `/gsi:new-project` — runs research → requirements → roadmap automatically

### Fixed
- Windows: SessionStart hook spawns detached process correctly
- Windows: Replaced HEREDOC with literal newlines for git commit compatibility
- Research decision from `/gsi:new-milestone` persists to config.json

## [1.17.0] - 2026-02-08

### Added
- **gsi-tools verification suite**: `verify plan-structure`, `verify phase-completeness`, `verify references`, `verify commits`, `verify artifacts`, `verify key-links`
- **gsi-tools frontmatter CRUD**: `frontmatter get/set/merge/validate`
- **gsi-tools template fill**: `template fill summary/plan/verification`
- **gsi-tools state progression**: `state advance-plan`, `state update-progress`, etc.
- Local patch preservation during updates
- `/gsi:reapply-patches` command

### Changed
- Agents now use gsi-tools for state updates instead of manual markdown parsing

## [1.16.0] - 2026-02-08

### Added
- 10 new gsi-tools CLI commands for deterministic operations
- `phase add/insert/remove/complete`, `roadmap analyze`, `milestone complete`, etc.

### Changed
- Workflows delegate deterministic operations to gsi-tools CLI

## [1.15.0] - 2026-02-08

### Changed
- Optimized workflow context loading, reducing token usage by ~5,000-10,000 tokens

## [1.14.0] - 2026-02-08

### Added
- Context-optimizing parsing commands in gsi-tools

### Fixed
- Installer handles JSONC parse errors correctly

## [1.13.0] - 2026-02-08

### Added
- `gsi-tools history-digest`, `phases list`, `roadmap get-phase`, etc.
- Test infrastructure with 22 tests

## [1.12.0] - 2026-02-07

### Changed
- **Architecture: Thin orchestrator pattern** — Commands delegate to workflows
- **Centralized utilities** — New `gsi-tools.js` replaces repetitive bash patterns
- ~22k characters removed from affected files

## [1.11.2] - 2026-02-05

### Added
- Security section in README with deny rules for sensitive files

### Fixed
- **CRITICAL:** Prevent API keys from being committed via `/gsi:map-codebase`
- Context fidelity in planning pipeline
- Executor verifies task completion

## [1.11.1] - 2026-01-31

### Added
- Git branching strategy configuration (none/phase/milestone)
- Squash merge option at milestone completion

### Fixed
- CONTEXT.md flows to all downstream agents

## [1.10.0] - 2026-01-29

### Added
- Native Gemini CLI support — install with `--gemini` flag
- New `--all` flag to install for Claude Code, OpenCode, and Gemini

## [1.9.0] - 2025-01-20

### Added
- **Model Profiles** — `/gsi:set-profile` for quality/balanced/budget configurations
- **Workflow Settings** — `/gsi:settings` for toggling behaviors interactively

## [1.8.0] - 2026-01-19

### Added
- Uncommitted planning mode via `planning.commit_docs: false`

## [1.7.0] - 2026-01-19

### Added
- **Quick Mode** (`/gsi:quick`) — Execute small tasks with gsi guarantees

## [1.6.0] - 2026-01-17

### Changed
- **BREAKING:** Unified `/gsi:new-milestone` flow

### Removed
- **BREAKING:** `/gsi:discuss-milestone` — consolidated into new-milestone
- **BREAKING:** `/gsi:create-roadmap` — integrated into flows
- **BREAKING:** `/gsi:define-requirements` — integrated into flows
- **BREAKING:** `/gsi:research-project` — integrated into flows

## [1.5.0] - 2026-01-14

### Added
- `/gsi:research-project` for pre-roadmap ecosystem research
- `/gsi:define-requirements` for scoping v1 requirements
- Requirements traceability with 100% coverage validation

### Changed
- **BREAKING:** New project flow: `new-project → research-project → define-requirements → create-roadmap`

---

For earlier versions, see [GitHub releases](https://github.com/Alot1z/get-shit-indexed/releases).
