---
phase: 09-repository-renovation
plan: 02
subsystem: branding
tags: [rebranding, gsd, gsi, rename, global-replace]

# Dependency graph
requires:
  - phase: 09-01
    provides: GSI terminal logo with visual identity
provides:
  - All GSD keywords replaced with GSI throughout codebase
  - All get-shit-done paths renamed to get-shit-indexed
  - Hook files renamed from gsd to gsi prefix
  - Git-tracked files updated with GSI branding
affects: [all-future-phases, documentation]

# Tech tracking
tech-stack:
  added: []
  patterns: [bulk-search-replace, git-mv-for-renaming]

key-files:
  created:
    - .planning/codebase/GSD-REPLACEMENT-MANIFEST.md
    - .planning/codebase/GSD-REPLACEMENT-VERIFY.md
    - get-shit-indexed/ (directory rename)
  modified:
    - README.md
    - package.json
    - package-lock.json
    - hooks/gsi-check-update.js (renamed)
    - hooks/gsi-statusline.js (renamed)

key-decisions:
  - "Used PowerShell bulk replacement scripts for efficiency"
  - "Copied get-shit-done to get-shit-indexed due to file lock on original"
  - "Removed old directory from git tracking, physical deletion pending"

patterns-established:
  - "Replacement order: most specific patterns first (GetShitDone -> getShitDone -> get-shit-done -> GSD -> gsd)"

# Metrics
duration: 15min
completed: 2026-02-13
---

# Phase 9 Plan 2: Global Keyword Replacement Summary

**Complete rebranding from GSD to GSI across 220+ files with PowerShell bulk replacement and git directory restructuring**

## Performance

- **Duration:** 15 min
- **Started:** 2026-02-13T17:57:20Z
- **Completed:** 2026-02-13T18:12:00Z
- **Tasks:** 8
- **Files modified:** 220+

## Accomplishments
- Replaced all GSD keywords with GSI across 193 .md files
- Updated JSON files (package.json, package-lock.json) with get-shit-indexed branding
- Renamed hook files from gsd to gsi prefix
- Created get-shit-indexed directory to replace locked get-shit-done directory
- Removed cached export files with outdated content
- Comprehensive verification report created

## Task Commits

Each task was committed atomically:

1. **Task 1: Scan codebase for all GSD references** - `9763fd3` (docs)
2. **Tasks 2-5: Replace GSD in all file types** - `eaf0bff` (refactor)
3. **Task 6: Rename hook files** - `d1bf19c` (refactor)
4. **Task 6 continued: Add get-shit-indexed directory** - `5a4fcf7` (refactor)
5. **Task 6 continued: Remove old directory from git** - `2e7999e` (refactor)
6. **Task 6 continued: Rename bin tools** - `3bdbe26` (refactor)
7. **Task 7: Remove cached exports** - `092da91` (chore)
8. **Task 8: Final verification** - `8d36d72` (docs)

**Additional fix:** `0d3e652` - fix get-shit-indexed directory with GSI replacements

## Files Created/Modified
- `README.md` - Updated with GSI branding and commands
- `package.json` - get-shit-indexed package name
- `package-lock.json` - Lockfile with new package name
- `hooks/gsi-check-update.js` - Renamed from gsd-check-update.js
- `hooks/gsi-statusline.js` - Renamed from gsd-statusline.js
- `get-shit-indexed/` - New directory with GSI branding
- `.planning/codebase/GSD-REPLACEMENT-MANIFEST.md` - Task documentation
- `.planning/codebase/GSD-REPLACEMENT-VERIFY.md` - Verification report
- All workflow files in `get-shit-indexed/workflows/`
- All reference files in `get-shit-indexed/references/`
- All template files in `get-shit-indexed/templates/`

## Decisions Made
- Used PowerShell scripts for bulk replacement (faster than per-file editing)
- Replacement order: GetShitDone -> getShitDone -> Get Shit Done -> get-shit-done -> get_shit_done -> GSD -> gsd
- Copied directory instead of renaming due to file lock on get-shit-done
- Removed binary export files (plans.xls, files.xls) as they contained old content

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Directory rename failed due to file lock**
- **Found during:** Task 6 (Update command file names)
- **Issue:** get-shit-done directory locked by another process, git mv failed
- **Fix:** Copied directory to get-shit-indexed, added to git, removed old from tracking
- **Files modified:** get-shit-indexed/ (new), get-shit-done/ (removed from tracking)
- **Verification:** git status shows get-shit-indexed tracked, get-shit-done untracked
- **Committed in:** 5a4fcf7, 2e7999e

**2. [Rule 1 - Bug] get-shit-indexed files still had old GSD content**
- **Found during:** Task 8 (Final verification)
- **Issue:** Directory was copied before replacements ran
- **Fix:** Re-ran replacement script specifically on get-shit-indexed directory
- **Files modified:** 10 workflow files in get-shit-indexed/workflows/
- **Verification:** Search shows 0 GSD in tracked files
- **Committed in:** 0d3e652

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Physical directory cleanup pending manual action when locks released. Git-tracked content fully updated.

## Issues Encountered
- File lock prevented direct rename of get-shit-done directory - worked around by copying
- Binary export files (plans.xls, etc.) not processed by text replacement - removed instead

## User Setup Required

**Manual cleanup required:**
The old `get-shit-done/` physical directory still exists on disk (untracked in git) but is locked. To remove:
```powershell
# After all file locks are released:
Remove-Item -Path "get-shit-done" -Recurse -Force
```

## Next Phase Readiness
- All git-tracked files updated with GSI branding
- Ready for Plan 03: README.md updates
- Ready for Plan 04: Documentation branding updates

---
*Phase: 09-repository-renovation*
*Completed: 2026-02-13*
