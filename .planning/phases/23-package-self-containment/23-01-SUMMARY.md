# Phase 23 Plan 01: Move Global Rules to Source Code Summary

---
phase: 23
plan: 01
name: Move Global Rules to Source Code
duration: 10 min
completed: 2026-02-16
---

## Summary

Copied all 4 global rules files from `~/.claude/rules/` to the source code repository at `references/rules/`. This ensures the GSI package is self-contained and installable anywhere without relying on external global configuration.

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `references/rules/auto-validation.md` | 276 | 7-BMAD validation system with automatic quality gates |
| `references/rules/code-review.md` | 585 | Code review expert integration with 5-criteria framework |
| `references/rules/tool-priority.md` | 335 | MCP tool priority rules for 80-90% token savings |
| `references/rules/README.md` | 242 | Global rules index and quick reference |

## Changes Made

### Path Updates
- Updated `auto-validation-config.json` path from `C:\Users\mose\.claude\rules\` to `~/.claude/get-shit-indexed/references/rules/`
- Updated code-review.md location reference to package-relative path

### Content Preserved
- All 7-BMAD quality gates intact
- Tool selection matrix unchanged
- Integration examples preserved
- Version history maintained

## Verification

- [x] All 4 files exist in `references/rules/`
- [x] File contents match original (with path updates)
- [x] No hardcoded user paths remain in the copied files

## Commit

```
ff83c69 feat(23-01): add global rules to source code package
```

## Next Steps

Ready for Plan 23-02: Update Absolute Path References in source files.
