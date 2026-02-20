---
name: gsi:check
description: GSI Check - Run 7-BMAD validation gates on completed work
argument-hint: "[phase] [--milestone]"
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__list_directory
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__get_symbol_body
  - Task
---

<!--
Consolidated Artifact: Verification command
Absorbs: /gsi:verify-work, /gsi:audit-milestone
-->

<objective>
Run 7-BMAD validation gates to verify completed work meets quality standards.
</objective>

<context>
Arguments: phase number or --milestone

**Triggers:**
- `/gsi:check` — Verify current phase
- `/gsi:check 3` — Verify specific phase
- `/gsi:check --milestone` — Audit entire milestone

**Load verification context:**
@.planning/STATE.md
@references/validation-gates.md
</context>

<validation_gates>

## 7-BMAD Quality Framework

### Gate 1: Method Circle (Implementation Correctness)
- [ ] Code compiles/runs without errors
- [ ] Logic matches requirements exactly
- [ ] Edge cases handled properly
- [ ] Performance requirements met

### Gate 2: Mad Circle (Integration Completeness)
- [ ] All dependencies properly integrated
- [ ] APIs/interfaces match specifications
- [ ] Data flows correctly between components
- [ ] No integration points missing

### Gate 3: Model Circle (Architecture Alignment)
- [ ] Follows project architectural patterns
- [ ] Maintains separation of concerns
- [ ] Adheres to design principles

### Gate 4: Mode Circle (Pattern Consistency)
- [ ] Uses established coding patterns
- [ ] Naming conventions followed
- [ ] Error handling patterns consistent

### Gate 5: Mod Circle (Maintainability Standards)
- [ ] Code is readable and clear
- [ ] Comments where necessary
- [ ] Function/class size reasonable
- [ ] Complexity within acceptable limits

### Gate 6: Modd Circle (Extensibility Verification)
- [ ] Easy to extend/modify
- [ ] No hard-coded assumptions
- [ ] Configurable where appropriate

### Gate 7: Methodd Circle (Documentation Quality)
- [ ] README updated if needed
- [ ] API docs complete
- [ ] Usage examples provided

</validation_gates>

<process>

## Step 1: Load Phase Context

Read phase PLAN.md files and VERIFICATION.md if exists.

## Step 2: Run Validation Gates

For each gate:
1. Check requirements against implementation
2. Document findings
3. Pass/Fail determination

## Step 3: Generate Report

```
╔══════════════════════════════════════════════════════════════╗
║  CHECKPOINT: Verification Required                           ║
╚══════════════════════════════════════════════════════════════╝

Phase 3 Verification Results:

Gate 1 (Method):   ✓ PASS
Gate 2 (Mad):      ✓ PASS
Gate 3 (Model):    ✓ PASS
Gate 4 (Mode):     ✓ PASS
Gate 5 (Mod):      ⚠ WARN - 2 functions >50 lines
Gate 6 (Modd):     ✓ PASS
Gate 7 (Methodd):  ✗ FAIL - Missing API docs

──────────────────────────────────────────────────────────────
→ Type "approved" to proceed, or describe issues to fix
──────────────────────────────────────────────────────────────
```

## Step 4: Handle Results

- **All Pass**: Mark phase complete, update STATE.md
- **Warnings**: Present to user, allow proceed with caveats
- **Failures**: Block completion, provide fix recommendations

</process>

<yolo_mode>
When YOLO mode is enabled:
- Auto-approve all gates
- Continue without checkpoint pause
- Still log warnings for later review
</yolo_mode>

<deprecated_commands>
- `/gsi:verify-work` → Use `/gsi:check`
- `/gsi:audit-milestone` → Use `/gsi:check --milestone`
</deprecated_commands>

---
**Version:** 1.0
**Consolidates:** 2 GSI verification commands
