# Phase 23 Plan 02: Update Absolute Path References Summary

---
phase: 23
plan: 02
name: Update Absolute Path References
duration: 5 min
completed: 2026-02-16
---

## Summary

Replaced all hardcoded absolute paths (like `@~/.claude/rules\`) with relative package references that work on any system after installation.

## Files Modified

| File | Change |
|------|--------|
| `references/validation-gates.md` | Updated reference to auto-validation.md |
| `references/validation-workflow.md` | Updated reference to auto-validation.md |
| `references/code-review-workflow.md` | Updated reference to code-review.md |

## Path Changes

| Before | After |
|--------|-------|
| `@~/.claude/rules\auto-validation.md` | `@~/.claude/get-shit-indexed/references/rules/auto-validation.md` |
| `@~/.claude/rules\code-review.md` | `@~/.claude/get-shit-indexed/references/rules/code-review.md` |

## Verification

- [x] No `C:\Users\mose` paths remain in source
- [x] No hardcoded user paths remain
- [x] All @ references use tilde convention
- [x] Files can be found after install

## Commit

```
985acbe fix(23-02): replace absolute paths with package-relative references
```

## Next Steps

Ready for Plan 23-03: Update Install Script for Rules.
