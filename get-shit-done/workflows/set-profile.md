---
code_index_mcp>
enabled: true
auto_continue: true
project_index: .planning/codebase-index
</code_index_mcp>

<purpose>
Switch active model profile for GSD workflows to balance speed vs capability.

Three profiles available:
- **quality**: Maximum capability (Opus for all agents)
- **balanced**: Balanced performance/cost (Sonnet for execution/planning, Opus for verification)
- **budget**: Maximum speed (Haiku for execution/verification, Sonnet for planning)
</purpose>

<process>

<step name="load_current_profile">
Read current active profile from config.json:

```bash
# Use mcp__desktop-commander__read_file for config operations
ACTIVE_PROFILE=$(cat .planning/config.json | grep -oP '"active_profile"' | head -1)
```

Display current profile and model assignments:

```
Current Profile: {quality|balanced|budget}

Model Assignments:
- Executor: {model}
- Planner: {model}
- Verifier: {model}
```

</step>

<step name="list_profiles">
Display all available profiles with descriptions:

```
Available Profiles:

1. quality — Maximum capability
   Executor: claude-opus-4-6
   Planner: claude-opus-4-6
   Verifier: claude-opus-4-6
   
   Use for: Complex analysis, architectural decisions, critical tasks
   
2. balanced — Balanced performance/cost
   Executor: claude-sonnet-4-5
   Planner: claude-opus-4-6
   Verifier: claude-sonnet-4-5
   
   Use for: Standard workflows, most development tasks
   
3. budget — Maximum speed
   Executor: claude-haiku-4-5
   Planner: claude-sonnet-4-5
   Verifier: claude-haiku-4-5
   
   Use for: Quick iterations, experimental features, cost-sensitive operations
```

</step>

<step name="select_profile">
Prompt user to select new profile:

```
Select new profile (1-3):
1. quality (Opus everywhere)
2. balanced (Sonnet execution/planning, Opus verification)
3. budget (Haiku execution/verification, Sonnet planning)

Current: {active_profile}
```

Wait for user input (1, 2, or 3).
</step>

<step name="update_config">
Update .planning/config.json with new active_profile:

```bash
# Use mcp__desktop-commander__edit_block to update config
# Read current config first, then edit the active_profile value
```

New config entry:

```json
{
  "model_profile": "quality|balanced|budget",
  "active_profile": "{selected_profile}",
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

</step>

<step name="verify">
Verify and confirm the profile change:

```bash
# Re-read config to verify
NEW_PROFILE=$(cat .planning/config.json | grep -oP '"active_profile"' | head -1)

echo "Profile changed: $OLD_PROFILE -> $NEW_PROFILE"
echo "Executor model: {executor_model}"
echo "Planner model: {planner_model}"
echo "Verifier model: {verifier_model}"
```

Display confirmation:

```
✓ Profile updated successfully

Active Profile: {selected}
Models in use:
- Executor: {model}
- Planner: {model}
- Verifier: {model}
```

</step>

</process>

<examples>

### Example 1: Switch to quality profile

```bash
/gsd:set-profile quality

Current Profile: balanced
Available Profiles:

1. quality — Maximum capability
   Executor: claude-opus-4-6
   Planner: claude-opus-4-6
   Verifier: claude-opus-4-6
   
2. balanced — Balanced performance/cost
   ...
   
3. budget — Maximum speed
   ...

Select new profile (1-3):
1
```

User selects "1":

```
✓ Profile updated successfully

Active Profile: quality
Models in use:
- Executor: claude-opus-4-6
- Planner: claude-opus-4-6
- Verifier: claude-opus-4-6
```

### Example 2: Switch to budget profile for speed

```bash
/gsd:set-profile budget

Current Profile: quality
...
Select new profile (1-3):
3
```

Output:

```
✓ Profile updated successfully

Active Profile: budget
Models in use:
- Executor: claude-haiku-4-5
- Planner: claude-sonnet-4-5
- Verifier: claude-haiku-4-5
```

---

## Profile Trade-offs

| Profile | Speed | Capability | Cost | Best For |
|---------|-------|------------|-------|-----------|
| quality | Slow | Maximum | High | Complex tasks, architecture |
| balanced | Medium | High | Medium | Standard workflows |
| budget | Fast | Low | Low | Quick iterations, testing |

---

*Generated for GSD Phase 8 - Advanced Workflow Features*