---
phase: 28
subphase: 12
plan: C
title: Release Preparation
wave: 3
depends_on: [28-12-A, 28-12-B]
files_modified:
  - CHANGELOG.md
  - lib/cli-tools/package.json
  - skills/heretic/skill.yaml
autonomous: false
must_haves:
  truths:
    - Version tagged correctly
    - Release notes complete
    - All tests passing
  artifacts:
    - CHANGELOG.md:50 (addition)
    - lib/cli-tools/package.json:version update
    - skills/heretic/skill.yaml:version update
---

# 28-12-C: Release Preparation

## Objective
Prepare Heretic v0.1.0 for release.

## Tasks

### Task 1: Version Tagging
**Action**: Update version numbers

```json
// lib/cli-tools/package.json
{ "version": "0.1.0" }

// skills/heretic/skill.yaml
version: 0.1.0
```

### Task 2: Release Notes
**File**: `CHANGELOG.md` (addition)
**Lines**: ~50

```markdown
## [0.1.0] - 2026-02-17

### Added
- Heuristic risk analyzer with 4 risk categories
- Semantic risk engine with embedding-based detection
- 4 prompt rewriting strategies (academic, engineering, decomposition, counterfactual)
- Parallel API dispatcher with timeout handling
- Soft refusal detection with >90% accuracy
- Response scoring with semantic similarity
- CLI tools: heretic analyze, rewrite, score
- Claude Code skill with pre/post hooks
- Hierarchical context summarization

### Performance
- Risk analysis: <500ms
- Parallel dispatch: <10s for 5 variants
- Token savings: >60%

### Tested
- 60+ unit tests
- 95%+ code coverage
- All 7-BMAD gates passing
```

### Task 3: Final Verification
**Checklist**:
- [ ] All tests pass
- [ ] Documentation complete
- [ ] Version numbers updated
- [ ] CHANGELOG updated
- [ ] Git tag created

## Output
- Release-ready v0.1.0

**Phase 28 Complete**
