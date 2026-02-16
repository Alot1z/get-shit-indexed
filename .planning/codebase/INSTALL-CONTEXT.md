# GSI Install Context

## Overview

GSI (Get Shit Indexed) can be installed in two contexts:

1. **Global Installation**: `~/.claude/get-shit-indexed/`
2. **Project-Level Installation**: `<project>/.planning/` or `<project>/gsi/`

This document describes how GSI detects its install location and adjusts data paths accordingly.

## Detection System

### Detection Order

The install detector (`lib/context/install-detector.js`) uses this priority order:

1. **Force Flags** (testing only)
   - `--force-global`: Force global context
   - `--force-project`: Force project context

2. **Environment Variable**
   - `GSI_INSTALL_TYPE=global`: Force global
   - `GSI_INSTALL_TYPE=project`: Force project

3. **Running Path Check**
   - If running from `~/.claude/get-shit-indexed/` → global

4. **Project Indicators**
   - `.planning/` directory exists → project
   - `.gsi/` directory exists → project
   - `gsi/` directory exists → project
   - `get-shit-indexed/` directory exists → project

5. **Parent Directory Check** (up to 3 levels)
   - Search for `.planning/` in parent directories → project

6. **Default**
   - If uncertain → project

### CLI Command

```bash
# Show detected install context
gsi install-info

# Force global context for testing
gsi install-info --force-global

# Force project context for testing
gsi install-info --force-project
```

## Path Resolution

### Global Installation

When GSI is installed globally, all data is stored in:

```
~/.claude/get-shit-indexed/
├── .planning/
│   ├── patterns/
│   │   ├── sequences.json
│   │   ├── conditions.json
│   │   └── optimizations.json
│   ├── thinking-metrics.json
│   ├── command-thinking-metrics.json
│   ├── complexity-history.json
│   ├── pattern-learning-metrics.json
│   └── gsd-integration-tracking.json
├── lib/
│   ├── context/
│   ├── thinking/
│   ├── pattern-learning/
│   └── ...
└── ...
```

### Project-Level Installation

When GSI is used in a project, data is stored in the project:

```
<project>/
├── .planning/
│   ├── patterns/
│   │   ├── sequences.json
│   │   ├── conditions.json
│   │   └── optimizations.json
│   ├── thinking-metrics.json
│   ├── command-thinking-metrics.json
│   ├── complexity-history.json
│   ├── pattern-learning-metrics.json
│   └── gsd-integration-tracking.json
├── src/
└── ...
```

### Special Case: Reflections

Reflections are **always** stored globally (per user), regardless of install context:

```
~/.debug-thinking-mcp/reflections/
├── observations.jsonl
└── graph-metadata.json
```

This ensures that learnings from all projects are shared globally.

## Data Types and Paths

| Data Type | Global Path | Project Path |
|-----------|-------------|--------------|
| Patterns | `~/.claude/get-shit-indexed/.planning/patterns/` | `<project>/.planning/patterns/` |
| Thinking Metrics | `~/.claude/get-shit-indexed/.planning/thinking-metrics.json` | `<project>/.planning/thinking-metrics.json` |
| Command Metrics | `~/.claude/get-shit-indexed/.planning/command-thinking-metrics.json` | `<project>/.planning/command-thinking-metrics.json` |
| Complexity History | `~/.claude/get-shit-indexed/.planning/complexity-history.json` | `<project>/.planning/complexity-history.json` |
| Reflections | `~/.debug-thinking-mcp/reflections/` | `~/.debug-thinking-mcp/reflections/` (always global) |

## API Usage

### Install Detector

```javascript
const { detectInstallLocation, isGlobalInstall, getBasePath } = require('./lib/context/install-detector');

// Detect install location
const location = detectInstallLocation();
// { type: 'global'|'project', basePath: string, indicators: string[] }

// Check context
if (isGlobalInstall()) {
  console.log('Running in global context');
}

// Get base path
const basePath = getBasePath();
// ~/.claude/get-shit-indexed/ or /path/to/project/
```

### Path Resolver

```javascript
const { 
  resolvePath, 
  resolveDataPath, 
  getPatternsPath, 
  getMetricsPath 
} = require('./lib/context/path-resolver');

// Resolve relative path
const configPath = resolvePath('.planning/config.json');

// Resolve data path by type
const patternsPath = resolveDataPath('patterns');
const metricsPath = getMetricsPath('thinking'); // thinking-metrics.json

// With options
const globalPath = resolveDataPath('patterns', { forceGlobal: true });
```

## Troubleshooting

### Issue: Wrong Context Detected

**Symptoms:**
- Data stored in unexpected location
- Patterns not persisting
- Metrics not updating

**Solutions:**

1. Check current context:
   ```bash
   gsi install-info
   ```

2. Set environment variable:
   ```bash
   export GSI_INSTALL_TYPE=global  # or project
   ```

3. Ensure `.planning/` directory exists in project root for project context

### Issue: Data Not Persisting

**Symptoms:**
- Patterns disappear after restart
- Metrics reset unexpectedly

**Solutions:**

1. Verify directory permissions:
   ```bash
   gsi install-info
   ```

2. Check if `.planning/` is in `.gitignore` (this is normal)

3. Ensure parent directories exist

### Issue: Mixed Contexts

**Symptoms:**
- Some data in global, some in project

**Solutions:**

1. Check both locations for existing data
2. Set `GSI_INSTALL_TYPE` explicitly
3. Migrate data manually if needed

## Examples

### Example 1: Global Installation

```bash
$ cd ~/.claude/get-shit-indexed
$ gsi install-info

=== GSI Install Context ===

Install Type: GLOBAL
Base Path: /Users/you/.claude/get-shit-indexed
Global Path: /Users/you/.claude/get-shit-indexed
Current Directory: /Users/you/.claude/get-shit-indexed

Detection Indicators:
  - running_from_global_path

Data Paths:
  patterns: /Users/you/.claude/get-shit-indexed/.planning/patterns
  metrics: /Users/you/.claude/get-shit-indexed/.planning
  reflections: /Users/you/.debug-thinking-mcp/reflections
  thinking: /Users/you/.claude/get-shit-indexed/.planning
  ...

Planning Path: /Users/you/.claude/get-shit-indexed/.planning
```

### Example 2: Project-Level Installation

```bash
$ cd ~/projects/my-app
$ gsi install-info

=== GSI Install Context ===

Install Type: PROJECT
Base Path: /Users/you/projects/my-app
Global Path: /Users/you/.claude/get-shit-indexed
Current Directory: /Users/you/projects/my-app

Detection Indicators:
  - .planning

Data Paths:
  patterns: /Users/you/projects/my-app/.planning/patterns
  metrics: /Users/you/projects/my-app/.planning
  reflections: /Users/you/.debug-thinking-mcp/reflections
  thinking: /Users/you/projects/my-app/.planning
  ...

Planning Path: /Users/you/projects/my-app/.planning
```

### Example 3: Override Detection

```bash
$ gsi install-info --force-global

=== GSI Install Context ===

Install Type: GLOBAL (forced)
...
```

## Version History

- v1.0 (2026-02-16): Initial install detection system
  - Context detection with multiple strategies
  - Path resolution for all data types
  - CLI command for inspecting context
  - Always-global reflections
