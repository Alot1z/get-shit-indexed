# GSI to GSI Replacement Manifest

**Date**: 2026-02-13
**Phase**: 09-repository-renovation
**Plan**: 02

## Summary

Total matches found: 4,526
Total lines affected: 25,928

## Replacement Rules (in order of specificity)

1. GetShitIndexed -> GetShitIndexed
2. GetShitIndexed -> getShitIndexed  
3. Get Shit Indexed -> Get Shit Indexed
4. get-shit-indexed -> get-shit-indexed
5. get_shit_indexed -> get_shit_indexed
6. GSI -> GSI
7. GSI -> gsi

## File Type Breakdown

| Type | Files | Est. Replacements |
|------|-------|-------------------|
| .md | ~150+ | ~3,500 |
| .json | ~10 | ~200 |
| .js | ~10 | ~400 |
| .ps1 | ~5 | ~50 |
| .xml | ~3 | ~100 |
| .yaml/.yml | ~5 | ~50 |
| .txt | ~5 | ~50 |

## Key Files to Update

### Documentation
- README.md (major)
- SECURITY.md
- All workflow files in get-shit-indexed/workflows/
- All files in .planning/
- All files in commands/

### Configuration
- package.json
- package-lock.json
- .planning/config.json

### Hooks
- hooks/GSI-check-update.js -> gsi-check-update.js
- hooks/GSI-statusline.js -> gsi-statusline.js
- hooks/start-cg-server.ps1

### Workflows
- All .md files in workflows/

## Execution Status

- [ ] Task 1: Create manifest (THIS FILE)
- [ ] Task 2: Replace in .md files
- [ ] Task 3: Replace in .json files
- [ ] Task 4: Replace in .ts/.js files
- [ ] Task 5: Replace in config files
- [ ] Task 6: Rename command directory
- [ ] Task 7: Update workflow files
- [ ] Task 8: Final verification

## Notes

- Use PowerShell bulk replacement for efficiency
- Commit after each major file type
- Verify no breaking changes to code functionality
- External dependencies should NOT be modified (node_modules, etc.)
