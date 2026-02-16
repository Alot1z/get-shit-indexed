# Phase Improvement Tasks

## High Priority Improvements

### IMP-001: Remove CodeGraphContext from Commands
**Status:** ✅ COMPLETE
**Phase:** All
**Issue:** CodeGraphContext tools still referenced in command files
**Fix:** Replace all `mcp__codegraphcontext__*` with `mcp__code-index-mcp__*` equivalents
**Files:** commands/gsi/*.md (9 files)

### IMP-002: Connect Thinking Hooks
**Status:** ⚠️ IN PROGRESS
**Phase:** 15, 20
**Issue:** Thinking infrastructure exists but not connected to Claude settings
**Fix:** Register PreToolUse/PostToolUse hooks in Claude settings.json
**Files:** 
- hooks/pre-tool-use/complexity-check.js
- hooks/post-tool-use/reflection-capture.js
- Claude settings.json

### IMP-003: Update Documentation for 2-Server Architecture
**Status:** ⚠️ PARTIAL
**Phase:** 1-13
**Issue:** Documentation still references neo4j and CG server
**Fix:** Update all docs to reflect DC + CI only
**Files:**
- ROADMAP.md (Overview section)
- references/*.md
- workflows/*.md

---

## Medium Priority Improvements

### IMP-004: Clean Duplicate Directories
**Status:** ⚠️ PENDING
**Phase:** 9
**Issue:** get-shit-done/ directory still exists
**Fix:** Complete removal after verification
**Files:** get-shit-done/ directory

### IMP-005: Add join-discord Command
**Status:** ⚠️ PENDING
**Phase:** Utility
**Issue:** GSD has /gsd:join-discord, GSI missing
**Fix:** Create /gsi:join-discord command
**Files:** commands/gsi/join-discord.md

### IMP-006: Improve Test Coverage
**Status:** ⚠️ PENDING
**Phase:** 13
**Issue:** Brand consistency at 87.5%, should be 100%
**Fix:** Fix remaining GSD references in historical templates
**Files:** templates/*.md

---

## Low Priority Improvements

### IMP-007: Add --auto Flag to new-project
**Status:** ⚠️ PENDING
**Phase:** Utility
**Issue:** GSD has --auto flag for automation
**Fix:** Add --auto flag to /gsi:new-project
**Files:** commands/gsi/new-project.md

### IMP-008: Multi-Runtime Support
**Status:** ⚠️ PENDING
**Phase:** Future
**Issue:** GSD supports OpenCode, Gemini CLI
**Fix:** Add runtime detection and transformation
**Files:** New module required

---

## Completed Improvements

| ID | Description | Status | Date |
|----|-------------|--------|------|
| IMP-001 | Remove CG from commands | ✅ Done | 2026-02-16 |
| CUS-001 | Git history rewrite to Mose | ✅ Done | 2026-02-16 |
| CUS-002 | GSI Statusline v2.0 | ✅ Done | 2026-02-16 |
| CUS-003 | Phases 24-27 planning | ✅ Done | 2026-02-16 |

---

## Next Steps

1. **IMP-002**: Connect thinking hooks to Claude settings
2. **IMP-003**: Update all documentation
3. **IMP-005**: Add join-discord command
4. Execute Phase 24-01 (Risk Assessment Engine)
