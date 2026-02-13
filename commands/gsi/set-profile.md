---
name: set-profile
description: Switch between model quality profiles (quality/balanced/budget)
color: cyan
---

## Usage

```bash
/GSI:set-profile [quality|balanced|budget]
```

## Examples

### Switch to quality profile (maximum capability)

```bash
/GSI:set-profile quality
```

Uses Opus for all agents (executor, planner, verifier).
Best for: Complex analysis, architectural decisions, critical tasks.

### Switch to balanced profile (recommended)

```bash
/GSI:set-profile balanced
```

Uses Sonnet for execution/planning, Opus for verification.
Best for: Standard workflows, most development tasks.

### Switch to budget profile (maximum speed)

```bash
/GSI:set-profile budget
```

Uses Haiku for execution/verification, Sonnet for planning.
Best for: Quick iterations, experimental features, cost-sensitive operations.

### Check current profile status

```bash
/GSI:set-profile
```

Displays current active profile without changing it.

---

## Profiles

| Profile | Executor | Planner | Verifier | Best For |
|---------|----------|----------|----------|-----------|
| **quality** | claude-opus-4-6 | claude-opus-4-6 | claude-opus-4-6 | Complex tasks, architecture |
| **balanced** | claude-sonnet-4-5 | claude-opus-4-6 | claude-sonnet-4-5 | Standard workflows |
| **budget** | claude-haiku-4-5 | claude-sonnet-4-5 | claude-haiku-4-5 | Quick iterations, testing |

---

## Configuration

Profile settings are stored in `.planning/config.json`:

```json
{
  "active_profile": "quality|balanced|budget",
  "profiles": {
    "quality": {
      "executor_model": "claude-opus-4-6",
      "planner_model": "claude-opus-4-6",
      "verifier_model": "claude-opus-4-6"
    },
    "balanced": {
      "executor_model": "claude-sonnet-4-5",
      "planner_model": "claude-opus-4-6",
      "verifier_model": "claude-sonnet-4-5"
    },
    "budget": {
      "executor_model": "claude-haiku-4-5",
      "planner_model": "claude-sonnet-4-5",
      "verifier_model": "claude-haiku-4-5"
    }
  }
}
```

---

## See Also

- `@get-shit-indexed/workflows/set-profile.md` — Profile switching workflow
- `@get-shit-indexed/references/model-profiles.md` — Profile reference documentation
- `@.planning/config.json` — Configuration storage

---

*Command for GSI Phase 8 - Advanced Workflow Features*