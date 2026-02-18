# GSI Patch Manager

## Overview

The Patch Manager module handles backup and restoration of local modifications across GSI package updates. It was extracted from the v1.18.0 to v1.23.0 migration session where 28 files were patched.

## Purpose

When updating the GSI npm package, local modifications (such as custom thinking_phase configurations, allowed-tools additions, or other customizations) would normally be lost. The Patch Manager:

1. **Backs up** local modifications before an update
2. **Restores** those modifications after the update
3. **Merges** changes intelligently to handle conflicts
4. **Tracks** modification metadata for audit trails

## CLI Commands

### `gsi patch backup`

Backs up all local modifications before a GSI package update.

```bash
gsi patch backup [--patches-dir <path>]
```

**Options:**
- `--patches-dir <path>`: Custom directory for storing backups (default: `~/.claude/GSI-local-patches`)

**Output:**
- Creates backup files in the patches directory
- Generates `backup-meta.json` with metadata about the backup

**Example:**
```bash
# Before updating GSI
gsi patch backup

# Output:
# Backing up local modifications...
# Backed up 28 files from version 1.23.0
# Backup location: ~/.claude/GSI-local-patches
```

### `gsi patch restore`

Restores backed-up modifications to the new GSI version after an update.

```bash
gsi patch restore [--patches-dir <path>]
```

**Options:**
- `--patches-dir <path>`: Custom directory containing backups (default: `~/.claude/GSI-local-patches`)

**Behavior:**
- Reads `backup-meta.json` to identify backed-up files
- Merges modifications with current version files
- Reports any conflicts that require manual resolution

**Example:**
```bash
# After updating GSI
gsi patch restore

# Output:
# Restoring local modifications...
# Restored 28 files
# Conflicts in 2 files:
#   - commands/gsi/debug.md
#   - commands/gsi/execute-phase.md
```

### `gsi patch status`

Shows the status of local modifications backup.

```bash
gsi patch status [--patches-dir <path>]
```

**Options:**
- `--patches-dir <path>`: Custom directory for backups (default: `~/.claude/GSI-local-patches`)

**Output:**
- Backup existence and validity
- Version the backup was created from
- Timestamp of backup creation
- Number of files backed up
- List of patches by type

**Example:**
```bash
gsi patch status

# Output:
# Backup exists for version 1.23.0
# Created: 2025-02-18T10:30:00.000Z
# Files: 28
# Location: ~/.claude/GSI-local-patches
```

### `gsi patch diff`

Shows differences between backup and current files.

```bash
gsi patch diff [--patches-dir <path>]
```

**Options:**
- `--patches-dir <path>`: Custom directory for backups (default: `~/.claude/GSI-local-patches`)

**Output:**
- Files that have changed since backup
- Hash comparison for quick identification
- Summary of modifications

**Example:**
```bash
gsi patch diff

# Output:
# Found 5 files with differences:
#   - commands/gsi/add-phase.md
#   - commands/gsi/debug.md
#   - hooks/pre-tool-use/thinking-invoke.js
#   - lib/thinking/orchestrator.js
#   - workflows/execute-phase.md
```

## Typical Workflow

### Before Updating GSI

```bash
# 1. Check current status
gsi patch status

# 2. Create backup
gsi patch backup

# 3. Verify backup was created
gsi patch status
```

### After Updating GSI

```bash
# 1. Check for differences
gsi patch diff

# 2. Restore modifications
gsi patch restore

# 3. Handle any conflicts manually
# (conflicted files are listed in output)

# 4. Verify modifications applied
gsi patch diff
```

## Modification Types

The Patch Manager categorizes modifications by type:

| Type | Description |
|------|-------------|
| `thinking_phase` | Custom thinking_phase configurations added to commands |
| `allowed_tools` | Modifications to allowed-tools lists |
| `content` | General content modifications |
| `mixed` | Multiple types of modifications in one file |

## Conflict Resolution

When conflicts occur during restore:

1. **Automatic Merge**: Most modifications are merged automatically
2. **Conflict Report**: Files with unmergeable conflicts are listed
3. **Manual Resolution**: Open conflicted files and resolve manually

### Conflict Structure

```json
{
  "section": "thinking_phase",
  "userVersion": "{\"mode\":\"sequential\",\"server\":\"sequential-thinking\"}",
  "upstreamVersion": "{\"mode\":\"enhanced\",\"server\":\"7bmad\"}",
  "resolution": "user | upstream | merged"
}
```

## Programmatic Usage

The Patch Manager can also be used programmatically:

```javascript
import { PatchManager } from 'get-shit-indexed-cc/lib/workflow-modules/patch-manager.js';

const manager = new PatchManager('/custom/patches/dir');

// Backup
const metadata = await manager.backup();
console.log(`Backed up ${metadata.files.length} files`);

// Restore
const results = await manager.restore();
for (const [file, result] of results) {
  if (!result.success) {
    console.log(`Conflicts in ${file}:`, result.conflicts);
  }
}
```

## API Reference

### `PatchManager`

#### Constructor

```typescript
constructor(patchesDir?: string)
```

Creates a new PatchManager instance.

**Parameters:**
- `patchesDir` (optional): Directory for storing patches. Default: `~/.claude/GSI-local-patches`

#### Methods

##### `backup(): Promise<PatchMetadata>`

Backs up all local modifications.

**Returns:** Promise resolving to backup metadata

##### `restore(): Promise<Map<string, MergeResult>>`

Restores modifications from backup.

**Returns:** Promise resolving to map of file paths to merge results

### Types

```typescript
interface PatchMetadata {
  version: string;
  timestamp: string;
  files: PatchFile[];
  patches: PatchSummary[];
}

interface PatchFile {
  path: string;
  hash: string;
  modified: boolean;
}

interface PatchSummary {
  file: string;
  type: 'thinking_phase' | 'allowed_tools' | 'content' | 'mixed';
  description: string;
}

interface MergeResult {
  success: boolean;
  conflicts: Conflict[];
  mergedContent: string;
}

interface Conflict {
  section: string;
  userVersion: string;
  upstreamVersion: string;
  resolution?: 'user' | 'upstream' | 'merged';
}
```

## File Locations

| Path | Description |
|------|-------------|
| `~/.claude/GSI-local-patches/` | Default backup directory |
| `~/.claude/GSI-local-patches/backup-meta.json` | Backup metadata file |
| `~/.claude/GSI-local-patches/commands/gsi/*.md` | Backed up command files |

## Troubleshooting

### "No backup found"

Run `gsi patch backup` before attempting restore or diff operations.

### "GSI installation not found"

Ensure GSI is installed globally (`npm install -g get-shit-indexed-cc`) or locally in the current project.

### Conflicts After Restore

1. Check the conflict report in the restore output
2. Open each conflicted file
3. Look for conflict markers or compare with backup
4. Manually merge the changes
5. Commit the resolved files

## Version History

- **v1.23.0**: Initial release of Patch Manager
- Extracted from v1.18.0 -> v1.23.0 migration (28 files patched)
