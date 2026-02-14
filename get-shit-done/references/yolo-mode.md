# YOLO Mode Reference

Documentation for YOLO (You Only Live Once) mode - frictionless execution without checkpoint confirmations.

---

## What is YOLO Mode?

YOLO mode enables **frictionless execution** by auto-approving all checkpoints and confirmation prompts that normally require user interaction.

**"YOLO" = "You Only Live Once"** - Execute without stopping for approval.

---

## Behavior

### Auto-Approval

When YOLO mode is enabled, the following checkpoints are **automatically approved**:

| Checkpoint Type | Normal Behavior | YOLO Behavior |
|----------------|----------------|----------------|
| `checkpoint:human-verify` | Wait for "approved" | Auto-approve with log entry |
| `checkpoint:decision` | Wait for option selection | Auto-select first/default option |
| `checkpoint:human-action` | Wait for manual step completion | Skip with warning |

### What YOLO Does NOT Bypass

YOLO mode does NOT bypass:

- **Authentication gates** - Real authentication errors still require manual action
- **Actual errors** - Code failures, crashes, validation errors still stop execution
- **Critical failures** - Systemic issues still require intervention

YOLO only skips **optional user confirmations** for verification/decision checkpoints.

---

## Activation Methods

### 1. Global Configuration

Set in `.planning/config.json`:

```json
{
  "mode": "yolo"
}
```

### 2. Per-Command Flag

```bash
/GSI:execute-phase 08 --yolo
/GSI:execute-plan 08 --yolo
```

### 3. Environment Variable

```bash
export YOLO=true
/GSI:execute-phase 08
```

**Priority:** Per-command flag > global config > environment variable

---

## Logging

When YOLO mode auto-approves a checkpoint, it logs:

```
⚡ YOLO: Auto-approving checkpoint:human-verify
Task: Verify database schema
Built: User and Session tables with relations
```

After all auto-approvals, summary includes:

```markdown
## Execution Mode

**Mode:** YOLO
**Auto-approvals:** 5 checkpoints auto-approved

### Checkpoints Auto-Approved

1. Task 3: human-verify (auto-approved)
2. Task 7: decision (auto-selected option 1)
3. Task 12: human-action (skipped with warning)
```

---

## Safety Warnings

### When to Use YOLO Mode

**Use YOLO for:**

✅ Well-tested workflows you've run many times before

✅ Non-destructive operations (reads, analysis, documentation)

✅ When you can afford to rollback (git reset if needed)

✅ Experimental features or rapid prototyping

**DO NOT use YOLO for:**

❌ First-time workflows - unknown behavior, unexpected errors

❌ Destructive operations (database migrations, deletions, production deployments)

❌ Critical systems (production databases, user-facing services)

### Risks

- **Commits without review** - All changes auto-approved and committed
- **No human verification** - Visual/functional checks are skipped
- **Fast error propagation** - Issues cascade through multiple tasks
- **Auth gates still apply** - You'll still need to manually authenticate

### Mitigation

- Use git branches for YOLO executions
- Review git log before merging
- Keep recent backups
- Test in staging first

---

## When NOT to Use YOLO Mode

### Never Use YOLO for:

1. **Production deployments** - Always verify deployments manually
2. **Database schema changes** - Migrations can destroy data
3. **Security-critical changes** - Auth, payments, permissions
4. **First-time workflows** - Unknown behavior patterns
5. **Irreversible operations** - Data deletion, permanent changes

### Proceed with Manual Approval Instead

For these operations, run with standard mode (checkpoints enabled):

```bash
# Standard execution with checkpoints
/GSI:execute-phase 05
```

---

## Example Execution Traces

### Standard Mode (with checkpoints)

```
Task 1 complete...
Task 2 complete...
╔══════════════════════════════════════════════════╗
║ CHECKPOINT: Verification Required                    ║
╚═════════════════════════════════════════════════════╝

Waiting for approval...
```

### YOLO Mode (auto-approval)

```
Task 1 complete...
Task 2 complete...
⚡ YOLO: Auto-approving checkpoint:human-verify
Task 3 complete...
Task 4 complete...
⚡ YOLO: Auto-selecting option 1 for checkpoint:decision
Task 5 complete...
```

---

## Verification After YOLO Execution

After YOLO execution, verify:

1. **Check git log** - Review auto-approved commits
2. **Run tests** - Ensure nothing is broken
3. **Manual verification** - Spot-check critical functionality
4. **Staging deploy** - Test before production

---

## Configuration Reference

See `.planning/config.json` for YOLO configuration.

See also:
- `@get-shit-indexed/workflows/execute-phase.md` - Main execution workflow
- `@get-shit-indexed/workflows/execute-plan.md` - Orchestrator workflow
- `@get-shit-indexed/templates/summary.md` - Summary template with YOLO section

---

*Generated for GSI Phase 8 - Advanced Workflow Features*