# Phase 36: Codebase Cleanup & Consistency

## Overview

Systematic cleanup of all issues identified in comprehensive audit (~260+ issues across 200+ files).

## Goal

Clean, consistent, portable codebase with no legacy references, hardcoded paths, or broken integrations.

## Sub-Phases

| Sub-Phase | Name | Files | Priority | Wave |
|-----------|------|-------|----------|------|
| 36-01 | CodeGraphContext Removal | 106 | HIGH | 1 |
| 36-02 | Broken @-References Fix | 79 | HIGH | 1 |
| 36-03 | Hardcoded Paths Removal | 13 | HIGH | 1 |
| 36-04 | GSD → GSI Branding Fix | 54 | MEDIUM | 2 |
| 36-05 | Missing lib/index.js | 4 | MEDIUM | 2 |
| 36-06 | Missing Workflows | ~9 | MEDIUM | 2 |
| 36-07 | Duplicate Directory Cleanup | 1 | LOW | 3 |
| 36-08 | Configuration & Scripts | 3 | LOW | 3 |
| 36-09 | Final Verification | All | HIGH | 4 |

## Dependency Graph

```
Wave 1 (P1 Critical):
├── 36-01: Remove CG refs (no deps)
├── 36-02: Fix @-refs (no deps)
└── 36-03: Remove hardcoded paths (no deps)

Wave 2 (P2 Important):
├── 36-04: Fix GSD branding (no deps)
├── 36-05: Create lib/index.js (no deps)
└── 36-06: Create missing workflows (no deps)

Wave 3 (P3 Cleanup):
├── 36-07: Remove duplicate dir (no deps)
└── 36-08: Add npm scripts (no deps)

Wave 4 (Verification):
└── 36-09: Final verification (depends on ALL)
```

## Total Estimates

- **Plans**: 9
- **Total Tasks**: ~45
- **Files to Modify**: ~200+
- **Estimated Duration**: 60-90 minutes

## Success Criteria

1. 0 CodeGraphContext references remain
2. 0 hardcoded user paths remain
3. All @-references resolve correctly
4. 100% GSI branding (no GSD)
5. All lib modules have index.js
6. All referenced workflows exist
7. No duplicate directories
8. npm scripts complete

## Related Documents

- @.planning/COMPREHENSIVE-AUDIT-REPORT.md
- @.planning/ROADMAP.md
- @.planning/STATE.md
