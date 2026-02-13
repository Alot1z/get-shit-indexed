# GSI Rebranding Changelog

**Date:** 2026-02-13
**Repository:** Alot1z/get-shit-indexed (forked from glittercowboy/get-shit-indexed)

## Summary

This document records the transformation from "Get Shit Done" (GSD) to "Get Shit Indexed" (GSI), including all file changes, URL migrations, and breaking changes.

---

## What Changed

### Phase 9-01: Logo Creation
- Created `assets/terminal.svg` with GSI-specific logo
- Tokyo Night color scheme: Cyan G/S (#7dcfff), Purple I (#bb9af7)
- Horizontal ellipse ring pattern representing data indexing ripples

### Phase 9-02: Global Keyword Replacement
- Replaced all GSD keywords with GSI equivalents across 220+ files
- Replacement rules applied:
  - `GetShitDone` → `getShitDone` → `Get Shit Done` → `get-shit-done` → `GSD` → `gsd`
  - All variants converted to GSI equivalents
- Hook files renamed:
  - `gsd-check-update.js` → `gsi-check-update.js`
  - `gsd-statusline.js` → `gsi-statusline.js`
- Directory renamed: `get-shit-done/` → `get-shit-indexed/`
- Bin tools renamed: `gsd-tools.js` → `gsi-tools.js`
- Removed cached export files with old branding

### Phase 9-03: Documentation Overhaul
- Updated README.md badges to point to Alot1z fork
- Updated git clone URLs to fork repository
- Updated star history chart to fork
- Created CONTRIBUTING.md for fork-specific contributions
- Updated CHANGELOG.md release links (154 URLs) to fork
- Updated SECURITY.md contact information
- Updated workflow documentation URLs

---

## URL Migration

| Old URL | New URL |
|---------|---------|
| `github.com/glittercowboy/get-shit-indexed` | `github.com/Alot1z/get-shit-indexed` |
| `github.com/glittercowboy/get-shit-indexed/blob/main/CHANGELOG.md` | `github.com/Alot1z/get-shit-indexed/blob/main/CHANGELOG.md` |
| `github.com/glittercowboy/get-shit-indexed/commits/main` | `github.com/Alot1z/get-shit-indexed/commits/main` |
| `github.com/glittercowboy/get-shit-indexed/releases/tag/*` | `github.com/Alot1z/get-shit-indexed/releases/tag/*` |

---

## Files Modified

### Documentation
- `README.md` - Badges, clone URLs, star history
- `CHANGELOG.md` - All release links (154 URLs)
- `SECURITY.md` - Contact information
- `CONTRIBUTING.md` - Created new file for fork contributions
- `get-shit-indexed/workflows/*.md` - All 30 workflow files
- `get-shit-done/workflows/*.md` - Legacy directory (if still present)

### Assets
- `assets/terminal.svg` - New GSI logo with indexing theme

### Hooks
- `hooks/gsi-check-update.js` - Renamed from gsd-*
- `hooks/gsi-statusline.js` - Renamed from gsd-*

### Directories
- `get-shit-indexed/` - Renamed from get-shit-done/
- `get-shit-done/` - Deprecated (may still exist on disk, should be deleted)

---

## Breaking Changes

### For Users

1. **Command Changes**
   - All `/GSD:` commands are now `/GSI:` commands
   - Update any saved command references

2. **Installation Path**
   - Clone URL changed to fork repository
   - NPM package remains `get-shit-indexed-cc` (unchanged)

3. **Badge Links**
   - Star history and badges point to fork
   - PRs should be submitted to Alot1z/get-shit-indexed

### For Contributors

1. **Pull Requests**
   - Submit to `Alot1z/get-shit-indexed`, not upstream
   - Fork from `Alot1z/get-shit-indexed`

2. **Issues**
   - Report to `Alot1z/get-shit-indexed/issues`
   - Reference upstream issues if applicable

3. **Security**
   - Report to fork issues or security@GSI.build
   - Do not DM upstream maintainer

---

## Migration Guide

### If You Have GSD Installed

1. **Update Commands**
   ```bash
   # Old commands no longer work
   /GSD:plan-phase    # ❌ Won't work
   
   # Use new GSI commands
   /GSI:plan-phase    # ✓ Works
   ```

2. **Reinstall (Recommended)**
   ```bash
   npx get-shit-indexed-cc@latest
   ```

3. **Update References**
   - Update any saved command aliases
   - Update documentation references
   - Update CI/CD scripts if using GSI commands

### If You're Contributing

1. **Fork the Correct Repository**
   ```bash
   git clone https://github.com/Alot1z/get-shit-indexed.git
   ```

2. **Update Your Remote**
   ```bash
   git remote set-url origin https://github.com/Alot1z/get-shit-indexed.git
   ```

3. **Submit PRs to Fork**
   - Target: `Alot1z/get-shit-indexed`
   - Base: `main`

---

## New Features (GSI-Specific)

### 3-MCP Integration
This fork includes enhanced integration with three MCP servers:

1. **Desktop Commander (DC)** - File operations, process management
2. **Code Index MCP (CI)** - Code search, symbol navigation
3. **CodeGraphContext (CG)** - Code relationships, dependency analysis

### Thinking Server Integration
- Sequential thinking for multi-step problem decomposition
- Tractatus thinking for logical structure analysis
- Debug thinking for graph-based problem-solving

### YOLO Mode
- Enhanced automation-first execution
- Reduced checkpoint friction
- Faster iteration cycles

---

## Compatibility

### NPM Package
- Package name: `get-shit-indexed-cc` (unchanged)
- Install command: `npx get-shit-indexed-cc@latest` (unchanged)

### Claude Code
- All commands work with Claude Code
- Permission model unchanged

### OpenCode / Gemini CLI
- Native support maintained
- Install flags unchanged (`--opencode`, `--gemini`)

---

## Upstream Sync

This fork may periodically sync with upstream (`glittercowboy/get-shit-indexed`) for:
- Bug fixes
- New features
- Documentation updates

Local customizations are preserved via patch system.

---

## Contact

- **Fork Repository:** https://github.com/Alot1z/get-shit-indexed
- **Issues:** https://github.com/Alot1z/get-shit-indexed/issues
- **Upstream:** https://github.com/glittercowboy/get-shit-indexed

---

*Last Updated: 2026-02-13*
*Phase 9 Documentation Overhaul Complete*
