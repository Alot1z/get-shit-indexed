# GSD Update Integration Process

## Overview

This document describes how to monitor GSD (original package) updates and selectively integrate useful changes into GSI.

## Current Architecture

```
GSI (Main Package)
├── commands/gsi/     ← Main commands (source of truth)
├── commands/gsd/     ← Alias layer (auto-generated from gsi/)
├── get-shit-indexed/ ← Workflows and templates
└── install.js        ← Creates gsd/ as alias during install
```

## Update Monitoring Process

### Step 1: Check for GSD Updates

```bash
# Check npm for new GSD version
npm view get-shit-done-cc version

# Compare with last integrated version
cat .planning/gsd-integration-tracking.json | grep last_integrated_version
```

### Step 2: Download and Analyze Changes

```bash
# Download new GSD tarball
npm pack get-shit-done-cc --pack-destination=/tmp/gsd-analysis

# Extract and compare
cd /tmp/gsd-analysis
tar -xzf get-shit-done-cc-*.tgz

# Compare with GSI
diff -r package/commands/gsd/ /path/to/gsi/commands/gsi/
diff -r package/get-shit-done/ /path/to/gsi/get-shit-indexed/
```

### Step 3: Categorize Changes

| Category | Action | Example |
|----------|--------|---------|
| **Bug fixes** | Integrate | Error handling improvements |
| **New features** | Evaluate | New commands, workflow enhancements |
| **Performance** | Integrate | Token optimizations, faster operations |
| **Breaking changes** | Skip | API changes that break GSI |
| **GSD-specific** | Skip | Changes specific to original GSD branding |

### Step 4: Selective Integration

For each valuable change:

```bash
# 1. Copy the file to GSI
cp /tmp/gsd-analysis/package/commands/gsd/xyz.md commands/gsi/xyz.md

# 2. Update prefix from gsd: to gsi:
sed -i 's/name: gsd:/name: gsi:/g' commands/gsi/xyz.md
sed -i 's/\/gsd:/\/gsi:/g' commands/gsi/xyz.md

# 3. Update GSI-specific features
# - Add MCP tools if applicable
# - Add thinking server integration
# - Update paths to get-shit-indexed
```

### Step 5: Update Tracking

Update `.planning/gsd-integration-tracking.json`:

```json
{
  "last_integrated_version": "1.17.0",
  "last_check_date": "2026-02-15",
  "integrated_changes": [
    {
      "gsd_version": "1.17.0",
      "date": "2026-02-15",
      "changes": ["bug-fix-xyz", "feature-abc"],
      "files_modified": ["commands/gsi/debug.md"]
    }
  ],
  "skipped_changes": [
    {
      "gsd_version": "1.17.0",
      "reason": "GSD-specific branding change"
    }
  ]
}
```

## Automatic Rebuild

After integration, rebuild the gsd alias:

```bash
# Rebuild package
npm pack

# Reinstall
npm install -g get-shit-indexed-cc-*.tgz

# Run install.js (recreates gsd/ as alias)
node bin/install.js
```

## Integration Checklist

- [ ] Check npm for GSD updates
- [ ] Download and extract new version
- [ ] Compare files with GSI
- [ ] Categorize changes (integrate/skip)
- [ ] Apply selected changes with gsi: prefix
- [ ] Update integration tracking
- [ ] Test affected commands
- [ ] Commit with reference to GSD version

## Scheduled Check

Recommended: Check for GSD updates monthly or before major GSI releases.

```bash
# Quick check command
npm view get-shit-done-cc version && echo "Current integrated: $(cat .planning/gsd-integration-tracking.json | grep last_integrated)"
```

---

*Created: 2026-02-15*
