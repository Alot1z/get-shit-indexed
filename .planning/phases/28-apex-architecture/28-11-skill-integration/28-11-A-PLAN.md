---
phase: 28
subphase: 11
plan: A
title: Skill Definition
wave: 3
depends_on: [28-09, 28-10]
files_modified:
  - skills/heretic/skill.yaml
  - .claude/skills/heretic/skill.yaml
autonomous: false
must_haves:
  truths:
    - Skill appears in /skills list
    - Hooks registered correctly
    - Tool permissions configured
  artifacts:
    - skills/heretic/skill.yaml:30
    - .claude/skills/heretic/skill.yaml:30
---

# 28-11-A: Skill Definition

## Objective
Define Claude Code skill with pre/post model hooks.

## Tasks

### Task 1: Skill Configuration
**File**: `skills/heretic/skill.yaml`
**Lines**: ~30

```yaml
name: heretic
description: Semantic intervention for refusal bypass
version: 0.1.0

hooks:
  pre_model_call:
    handler: ./pre.ts
    priority: 10
  post_model_call:
    handler: ./post.ts
    priority: 10

allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__code-index-mcp__search_code_advanced

settings:
  risk_threshold: 0.4
  max_rewrites: 4
  auto_retry: true
  timeout_ms: 30000
```

## Output
- Skill definition ready

**Next**: 28-11-B - Pre-Hook Implementation
