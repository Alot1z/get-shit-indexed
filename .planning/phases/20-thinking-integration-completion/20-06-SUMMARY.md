---
phase: 20-06
plan: 06
subsystem: context
tags:
  - install-detection
  - path-resolution
  - context-aware
  - storage
provides:
  - install-context-detection
  - context-aware-paths
  - install-info-cli
affects:
  - pattern-learning
  - thinking-metrics
  - command-thinking
tech-stack:
  added:
    - lib/context/install-detector.js
    - lib/context/path-resolver.js
    - lib/context/index.js
  patterns:
    - context-aware-storage
key-files:
  created:
    - lib/context/install-detector.js
    - lib/context/path-resolver.js
    - lib/context/index.js
    - .planning/codebase/INSTALL-CONTEXT.md
    - .planning/phases/20-thinking-integration-completion/20-06-VERIFICATION.md
  modified:
    - lib/pattern-learning/storage.js
    - lib/thinking/metrics.js
    - lib/command-thinking/metrics.js
    - get-shit-indexed/bin/gsi-tools.js
key-decisions:
  - "Reflections always stored globally (per-user learnings)"
  - "Default to project context if uncertain"
  - "Support force flags for testing (--force-global, --force-project)"
duration: 12 min
completed: 2026-02-16
---

# Phase 20-06: Install Location Detection System Summary

Intelligent install location detection that adjusts storage paths based on whether GSI is installed globally or project-level.

## Performance

- **Duration:** 12 min
- **Tasks:** 7/7 completed
- **Files:** 4 created, 4 modified

## Accomplishments

### 1. Install Detector Module (`lib/context/install-detector.js`)
- Created `detectInstallLocation()` with 6 detection strategies
- Environment variable support: `GSI_INSTALL_TYPE`
- Running path check for global installation
- Project indicators: `.planning/`, `.gsi/`, `gsi/`
- Parent directory search (3 levels)
- Caching with `noCache` option for testing

### 2. Path Resolver (`lib/context/path-resolver.js`)
- `resolvePath()` for relative paths
- `resolveDataPath()` for typed data paths
- Support for 9 data types: patterns, metrics, reflections, thinking, commandThinking, complexity, gsdIntegration, workflow, todos
- Reflections always resolve globally (per-user learnings)
- Path validation with `validatePath()`

### 3. Pattern Learning Storage Updated
- Replaced hardcoded `PATTERNS_DIR` with context-aware `getPatternsDir()`
- Creates directory if missing when storing patterns
- Added `patternsPath` to stats output for debugging

### 4. Thinking Metrics Updated
- Both `lib/thinking/metrics.js` and `lib/command-thinking/metrics.js` updated
- Uses `getMetricsFilePath()` for context-aware paths
- Creates directory if missing when saving

### 5. CLI Integration
- New command: `gsi install-info`
- Flags: `--force-global`, `--force-project` for testing
- Displays: install type, base path, indicators, all data paths

### 6. Documentation
- Created `.planning/codebase/INSTALL-CONTEXT.md`
- Detection strategies, path mapping, API usage examples
- Troubleshooting section for common issues

## Task Commits

1. **Task 1: Install Detector** - `5da5b05`
2. **Task 2: Path Resolver** - `7da6e02`
3. **Task 3: Pattern Storage** - `0708e76`
4. **Task 4: Metrics Storage** - `a0f8fc8`
5. **Task 5: CLI Update** - `04ec3f4`
6. **Task 6: Documentation** - `ce312e3`
7. **Task 7: Verification** - `8e45f71`

## Key Decisions

1. **Reflections Always Global**: User learnings should be shared across all projects, so reflections are always stored in `~/.debug-thinking-mcp/reflections/`

2. **Default to Project**: When uncertain, assume project context - safer default for data isolation

3. **Force Flags for Testing**: `--force-global` and `--force-project` allow testing both contexts without changing actual installation

## Files Created/Modified

### Created
- `lib/context/install-detector.js` (211 lines)
- `lib/context/path-resolver.js` (220 lines)
- `lib/context/index.js` (29 lines)
- `.planning/codebase/INSTALL-CONTEXT.md` (287 lines)
- `.planning/phases/20-thinking-integration-completion/20-06-VERIFICATION.md` (143 lines)

### Modified
- `lib/pattern-learning/storage.js` - Uses context-aware paths
- `lib/thinking/metrics.js` - Uses context-aware paths
- `lib/command-thinking/metrics.js` - Uses context-aware paths
- `get-shit-indexed/bin/gsi-tools.js` - Added `install-info` command

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Phase 20 complete. Ready for:
- Phase 21: GSD Update Integration
- Phase 22: Advanced Pattern Learning

All context-aware infrastructure in place for consistent data storage across installation types.
