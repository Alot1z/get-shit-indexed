# Phase 23 Plan 03: Update Install Script for Rules Summary

---
phase: 23
plan: 03
name: Update Install Script for Rules
duration: 5 min
completed: 2026-02-16
---

## Summary

Modified the install script (`bin/install.js`) to copy the `references/rules/` directory during installation so users get the rules files when they install GSI.

## Files Modified

| File | Change |
|------|--------|
| `bin/install.js` | Added rules directory copy logic |

## Changes Made

### Added Rules Copy Logic

```javascript
// Copy rules directory (auto-validation, code-review, tool-priority rules)
const rulesSrc = path.join(src, 'references', 'rules');
if (fs.existsSync(rulesSrc)) {
  const rulesDest = path.join(targetDir, 'get-shit-indexed', 'references', 'rules');
  fs.mkdirSync(rulesDest, { recursive: true });
  const rulesEntries = fs.readdirSync(rulesSrc, { withFileTypes: true });
  for (const entry of rulesEntries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const srcFile = path.join(rulesSrc, entry.name);
      const destFile = path.join(rulesDest, entry.name);
      fs.copyFileSync(srcFile, destFile);
    }
  }
  if (verifyInstalled(rulesDest, 'rules')) {
    console.log(`  ${green}✓${reset} Installed rules (validation, code-review, tool-priority)`);
  }
}
```

### Installation Path

Rules are installed to:
```
~/.claude/get-shit-indexed/references/rules/auto-validation.md
~/.claude/get-shit-indexed/references/rules/code-review.md
~/.claude/get-shit-indexed/references/rules/tool-priority.md
~/.claude/get-shit-indexed/references/rules/README.md
```

### Uninstall

No additional uninstall code needed - the rules directory is automatically removed when the entire `get-shit-indexed/` directory is deleted during uninstall.

### Manifest

Rules files are automatically included in the file manifest (`gsi-file-manifest.json`) because the `generateManifest` function recursively collects all files in `get-shit-indexed/`.

## Verification

- [x] Rules directory is copied during install
- [x] Rules appear at correct location after install
- [x] Uninstall removes rules (via parent directory removal)
- [x] Manifest includes rules files (via recursive collection)

## Commit

```
2390e35 feat(23-03): add rules directory to install script
```

## Next Steps

Ready for Plan 23-04: Verification & Testing.
