---
name: gsi:reapply-patches
description: Reapply local modifications after a GSI update
thinking_phase:
  mode: STANDARD
  servers: [sequential, debug]
  bmad_enabled: true
  timeout: 10000
  rationale: "Patch reapplication requiring systematic comparison (Sequential) and conflict detection (Debug)"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__read_multiple_files
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - Task
  - AskUserQuestion
---

<purpose>
After a GSI update wipes and reinstalls files, this command merges user's previously saved local modifications back into the new version. Uses intelligent comparison to handle cases where the upstream file also changed.
</purpose>

<process>

## Step 1: Detect backed-up patches

Check for local patches directory (lowercase gsi):

```bash
# Global install
PATCHES_DIR="${HOME}/.claude/gsi-local-patches"
# Legacy uppercase fallback
if [ ! -d "$PATCHES_DIR" ]; then
  PATCHES_DIR="${HOME}/.claude/GSI-local-patches"
fi
# Local install fallback
if [ ! -d "$PATCHES_DIR" ]; then
  PATCHES_DIR="./.claude/gsi-local-patches"
fi
```

Read `backup-meta.json` from the patches directory.

**If no patches found:**
```
No local patches found. Nothing to reapply.

Local patches are automatically saved when you run /gsi:update
after modifying any GSI workflow, command, or agent files.
```
Exit.

## Step 2: Show patch summary

```
## Local Patches to Reapply

**Backed up from:** v{from_version}
**Current version:** {read VERSION file}
**Files modified:** {count}

| # | File | Status |
|---|------|--------|
| 1 | {file_path} | Pending |
| 2 | {file_path} | Pending |
```

## Step 3: Merge each file

For each file in `backup-meta.json`:

1. **Read both versions** using `read_multiple_files` for efficiency
2. **Compare versions:**
   - If new file has `thinking_phase` AND backed-up has `thinking_phase`: Compare content
   - If new file missing `thinking_phase` BUT backed-up has it: MERGE (add thinking_phase)
   - If new file already has all user modifications: SKIP

3. **Merge strategy for thinking_phase:**
   - Take current version as base (has newest features, tilde paths)
   - Add `thinking_phase` frontmatter from backed-up version
   - Keep any new tools/sections from current version
   - Preserve `~/.claude/` tilde paths over full paths

4. **Write merged result** to the installed location
5. **Report status:**
   - `Merged` — user modifications applied cleanly
   - `Skipped` — modification already in upstream
   - `Conflict` — user chose resolution

## Step 4: Version comparison

Detect version jump:
- v1.23.0 → v1.27.1 = 4 minor versions
- Large jumps may have significant upstream changes
- Consider re-examining all modifications for compatibility

## Step 5: Cleanup option

Ask user:
- "Keep patch backups for reference?" → preserve `gsi-local-patches/`
- "Clean up patch backups?" → remove `gsi-local-patches/` directory

## Step 6: Report

```
## Patches Reapplied

| # | File | Status |
|---|------|--------|
| 1 | {file_path} | ✓ Merged |
| 2 | {file_path} | ○ Skipped (already upstream) |
| 3 | {file_path} | ⚠ Conflict resolved |

{count} file(s) updated. Your local modifications are active again.
```

</process>

<success_criteria>
- [ ] All backed-up patches processed
- [ ] User modifications merged into new version
- [ ] New version features preserved (tilde paths, new tools)
- [ ] Status reported for each file
</success_criteria>
