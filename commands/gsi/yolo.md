---
name: yolo
description: Toggle YOLO mode for frictionless execution
color: magenta
examples:
  - Enable YOLO mode for current session
  - Disable YOLO mode
  - Check YOLO mode status
---

## Usage

```bash
# Enable YOLO mode
/GSI:yolo on

# Disable YOLO mode  
/GSI:yolo off

# Check status
/GSI:yolo
```

---

## Behavior

### YOLO Mode ON

When enabled, all checkpoints are auto-approved:

- **Verification checkpoints** - Auto-approve without waiting
- **Decision checkpoints** - Auto-select default option
- **Action checkpoints** - Skip with warning (true manual steps still required)

### YOLO Mode OFF

Normal checkpoint behavior:

- **Verification checkpoints** - Wait for "approved" response
- **Decision checkpoints** - Wait for option selection
- **Action checkpoints** - Wait for manual completion

---

## What is NOT Auto-Approved

Even in YOLO mode, these still require manual action:

- **Authentication gates** - CLI/API authentication errors
- **Actual failures** - Code errors, crashes, validation failures
- **Systemic issues** - Critical errors that stop execution

---

## Configuration

YOLO mode is stored in `.planning/config.json`:

```json
{
  "mode": "yolo"
}
```

When `mode: "yolo"`, all workflows skip confirmations and proceed automatically.

---

## Examples

### Enable YOLO for quick iteration

```bash
$ /GSI:yolo on
✓ YOLO mode enabled
$ /GSI:execute-phase 08
# Executes all tasks without checkpoint pauses
```

### Disable YOLO for careful execution

```bash
$ /GSI:yolo off
✓ YOLO mode disabled
$ /GSI:execute-phase 08
# Normal checkpoint behavior
```

### Check current status

```bash
$ /GSI:yolo
Current YOLO mode: off
```

---

## Safety

**⚠️ Use YOLO mode with caution:**

- Commits are made without manual review
- Verification steps are skipped
- Changes are applied immediately

**Best practices:**

- Use git branches for YOLO sessions
- Review commits before merging to main
- Keep recent backups
- Test in non-production environments first

---

## See Also

- `@get-shit-indexed/references/yolo-mode.md` - Full YOLO mode documentation
- `@.planning/config.json` - Configuration storage

---

*Command for GSI Phase 8 - Advanced Workflow Features*