# Complete GSI Execution Order

**Generated:** 2026-02-17
**Purpose:** Fix all issues + Plan + Execute Phases 24-27

---

## PART A: Fix Current Issues

### Step A1: Fix ROADMAP (Remove CG References)

```bash
# Command: /gsi:execute-phase 36
# Or manual fix:
```

**What to fix in ROADMAP.md:**
| Line | Current | Change To |
|------|---------|-----------|
| 5 | "three MCP servers—DC, CI, CG" | "two MCP servers—DC, CI" |
| 42 | "neo4j://localhost:7687" | Remove |
| 46 | "CG server now available" | Remove |
| 53 | "DC, CI, CG" | "DC, CI" |
| All | CodeGraphContext | Remove or mark legacy |

**Alternative:** Create new ROADMAP-v2.md with 2-MCP architecture

---

### Step A2: Consolidate Phase 24 Plans

```bash
# Remove old partial plans
rm -rf .planning/phases/24-01/
rm -rf .planning/phases/24-02/

# Keep or rename universal
mv phases/24-universal-prompt-enhancement phases/24-prompt-enhancement-foundation
```

**Or via /gsi: commands:**
```
/gsi:debug fix-phase-24-duplicates
```

---

### Step A3: Integrate Phases 28-35

```bash
# Add to ROADMAP.md progress table
```

**Update ROADMAP.md:**
```markdown
| 28. Apex Architecture | 0/12 | Planned | - |
| 29. Global Tool Enforcement | 0/6 | Planned | - |
| 30. Documentation & Onboarding | 0/4 | Planned | - |
| 31. Performance Optimization | 0/4 | Planned | - |
| 32. Error Recovery | 0/4 | Planned | - |
| 33. Plugin System | 0/4 | Planned | - |
| 34. CI/CD Integration | 0/4 | Planned | - |
| 35. Release Preparation | 0/4 | Planned | - |
```

---

## PART B: Complete Command Execution Order

### Phase 0: Fix Issues (Do First)

```
Command                          Purpose                        Time
────────────────────────────────────────────────────────────────────
/gsi:debug                       Analyze issues                 2 min
  → Response: all                Fix all issues                 
/gsi:progress                    Verify fixes applied           1 min
```

### Phase 1: Prepare for Planning

```
Command                          Purpose                        Time
────────────────────────────────────────────────────────────────────
/gsi:map-codebase                Full codebase scan             3 min
/gsi:discuss-phase 24            Clarify Phase 24 requirements  5 min
/gsi:research-phase 24           Research prompt enhancement    5 min
```

### Phase 2: Plan Apex Architecture (24-27)

```
Command                          Purpose                        Time
────────────────────────────────────────────────────────────────────
/gsi:plan-phase 24               Plan Prompt Enhancement        5 min
/gsi:check-todos                 Verify plan created            1 min
/gsi:plan-phase 25               Plan Semantic Intervention     5 min
/gsi:plan-phase 26               Plan Context Optimization      5 min
/gsi:plan-phase 27               Plan SDK Integration           5 min
```

### Phase 3: Execute Apex Architecture

```
Command                          Purpose                        Time
────────────────────────────────────────────────────────────────────
/gsi:execute-phase 24            Execute Phase 24               15 min
/gsi:verify-work 24              Verify Phase 24 complete       2 min

/gsi:execute-phase 25            Execute Phase 25               15 min
/gsi:verify-work 25              Verify Phase 25 complete       2 min

/gsi:execute-phase 26            Execute Phase 26               15 min
/gsi:verify-work 26              Verify Phase 26 complete       2 min

/gsi:execute-phase 27            Execute Phase 27               15 min
/gsi:verify-work 27              Verify Phase 27 complete       2 min
```

### Phase 4: Integrate Remaining Phases (28-35)

```
Command                          Purpose                        Time
────────────────────────────────────────────────────────────────────
/gsi:discuss-phase 28            Clarify Phase 28 (duplicate?)  5 min
/gsi:plan-phase 29               Plan Global Tool Enforcement   5 min
/gsi:execute-phase 29            Execute Phase 29               15 min
/gsi:verify-work 29              Verify Phase 29 complete       2 min

# Continue for phases 30-35...
/gsi:plan-phase 30               Plan Documentation             5 min
/gsi:execute-phase 30            Execute Phase 30               15 min
# ... repeat for 31-35
```

### Phase 5: Final Verification

```
Command                          Purpose                        Time
────────────────────────────────────────────────────────────────────
/gsi:audit-milestone             Full project audit             5 min
/gsi:progress                    Check overall status           1 min
/gsi:check-todos                 Verify no pending tasks        1 min
```

---

## COMPLETE SCRIPT (Copy-Paste Ready)

```bash
# ═══════════════════════════════════════════════════════════════
# GSI COMPLETE EXECUTION ORDER
# ═══════════════════════════════════════════════════════════════

# ═══ PART 0: FIX ISSUES ═══
/gsi:debug                       # Analyze current issues
# → Type: all (to fix all issues)

/gsi:progress                    # Verify state after fixes

# ═══ PART 1: PREPARE ═══
/gsi:map-codebase                # Full codebase scan
/gsi:discuss-phase 24            # Clarify Phase 24 requirements
/gsi:research-phase 24           # Research domain (optional)

# ═══ PART 2: PLAN APEX ARCHITECTURE ═══
/gsi:plan-phase 24               # Prompt Enhancement Foundation
/gsi:plan-phase 25               # Semantic Intervention Engine
/gsi:plan-phase 26               # Context Optimization Layer
/gsi:plan-phase 27               # Claude Code SDK Integration

# ═══ PART 3: EXECUTE APEX ARCHITECTURE ═══
/gsi:execute-phase 24            # Phase 24 execution
/gsi:verify-work 24              # Verify Phase 24

/gsi:execute-phase 25            # Phase 25 execution
/gsi:verify-work 25              # Verify Phase 25

/gsi:execute-phase 26            # Phase 26 execution
/gsi:verify-work 26              # Verify Phase 26

/gsi:execute-phase 27            # Phase 27 execution
/gsi:verify-work 27              # Verify Phase 27

# ═══ PART 4: REMAINING PHASES ═══
/gsi:discuss-phase 28            # Decide on Phase 28
/gsi:plan-phase 29               # Global Tool Enforcement
/gsi:execute-phase 29            # Execute Phase 29
/gsi:verify-work 29              # Verify Phase 29

# Phases 30-35 (repeat pattern)
/gsi:plan-phase 30
/gsi:execute-phase 30
/gsi:verify-work 30
# ... continue for 31-35

# ═══ PART 5: FINAL VERIFICATION ═══
/gsi:audit-milestone             # Full audit
/gsi:progress                    # Final status
```

---

## TIME ESTIMATE

| Part | Commands | Time |
|------|----------|------|
| Part 0: Fix Issues | 2 | 5 min |
| Part 1: Prepare | 3 | 13 min |
| Part 2: Plan 24-27 | 4 | 20 min |
| Part 3: Execute 24-27 | 8 | 68 min |
| Part 4: Phases 28-35 | 16 | 120 min |
| Part 5: Verify | 3 | 7 min |
| **TOTAL** | **36** | **~4 hours** |

---

## QUICK START (Minimum Viable)

If you want to just fix issues and plan Phase 24:

```bash
# Quick fix + plan Phase 24 only
/gsi:debug          # → Type: all
/gsi:plan-phase 24
```

If you want to complete Phases 24-27:

```bash
# Complete Apex Architecture
/gsi:debug          # → Type: all
/gsi:plan-phase 24
/gsi:execute-phase 24
/gsi:verify-work 24
# Repeat for 25-27
```

---

*Generated for complete GSI workflow*
