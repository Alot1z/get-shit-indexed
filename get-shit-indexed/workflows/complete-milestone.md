<thinking>auto</thinking>

<code_index_mcp>
desktop_commander:
  tools: ["read_file", "write_file", "list_directory"]
  priority: 1
  rationale: "Primary workflow for reading roadmap, writing milestone status, and listing phase directories"
code_index:
  tools: ["find_files"]
  priority: 2
  rationale: "Secondary use for finding all phase SUMMARY.md files"
native:
  priority: 3
  rationale: "Fallback only - MCP tools provide 80-90% token savings"
</code_index_mcp>

<purpose>
Mark a shipped version (v1.0, v1.1, v2.0) as complete. Creates historical record in MILESTONES.md, performs full PROJECT.md evolution review, reorganizes ROADMAP.md with milestone groupings, and tags the release in git.

</purpose>

<required_reading>

1. templates/milestone.md
2. templates/milestone-archive.md
3. `.planning/ROADMAP.md`
4. `.planning/REQUIREMENTS.md`
5. `.planning/PROJECT.md`

</required_reading>

<archival_behavior>

When a milestone completes:

1. Extract full milestone details to `.planning/milestones/v[X.Y]-ROADMAP.md`
2. Archive requirements to `.planning/milestones/v[X.Y]-REQUIREMENTS.md`
3. Update ROADMAP.md — replace milestone details with one-line summary
4. Delete REQUIREMENTS.md (fresh one for next milestone)
5. Perform full PROJECT.md evolution review
6. Offer to create next milestone inline

**Context Efficiency:** Archives keep ROADMAP.md constant-size and REQUIREMENTS.md milestone-scoped.

**ROADMAP archive** uses `templates/milestone-archive.md` — includes milestone header (status, phases, date), full phase details, milestone summary (decisions, issues, tech debt).

**REQUIREMENTS archive** contains all requirements marked complete with outcomes, traceability table with final status, notes on changed requirements.

</archival_behavior>

<process>

<step name="verify_readiness">

**Use `roadmap analyze` for comprehensive readiness check:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const ROADMAP = await mcp__desktop-commander__start_process({
  command: "node ~/.claude/get-shit-indexed/bin/GSI-tools.js roadmap analyze",
  timeout_ms: 15000
});
```

This returns all phases with plan/summary counts and disk status. Use this to verify:
- Which phases belong to this milestone?
- All phases complete (all plans have summaries)? Check `disk_status === 'complete'` for each.
- `progress_percent` should be 100%.

Present:

```
Milestone: [Name, e.g., "v1.0 MVP"]

Includes:
- Phase 1: Foundation (2/2 plans complete)
- Phase 2: Authentication (2/2 plans complete)
- Phase 3: Core Features (3/3 plans complete)
- Phase 4: Polish (1/1 plan complete)

Total: {phase_count} phases, {total_plans} plans, all complete
```

<config-check>

**Use MCP tool: mcp__desktop-commander__read_file**

```javascript
// MCP-based equivalent for reading config
const config = await mcp__desktop-commander__read_file({
  path: ".planning/config.json"
});
```

</config-check>

<if mode="yolo">

```
⚡ Auto-approved: Milestone scope verification
[Show breakdown summary without prompting]
Proceeding to stats gathering...
```

Proceed to gather_stats.

</if>

<if mode="interactive" OR="custom with gates.confirm_milestone_scope true">

```
Ready to mark this milestone as shipped?
(yes / wait / adjust scope)
```

Wait for confirmation.
- "adjust scope": Ask which phases to include.
- "wait": Stop, user returns when ready.

</if>

</step>

<step name="gather_stats">

Calculate milestone statistics using MCP process tools:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent for git and file stats
const gitLog = await mcp__desktop-commander__start_process({
  command: "git log --oneline --grep=\"feat(\" | head -20",
  timeout_ms: 10000
});

const gitDiff = await mcp__desktop-commander__start_process({
  command: "git diff --stat FIRST_COMMIT..LAST_COMMIT | tail -1",
  timeout_ms: 10000
});

const loc = await mcp__desktop-commander__start_process({
  command: "find . -name \"*.swift\" -o -name \"*.ts\" -o -name \"*.py\" | xargs wc -l 2>/dev/null",
  timeout_ms: 10000
});

const gitStart = await mcp__desktop-commander__start_process({
  command: "git log --format=\"%ai\" FIRST_COMMIT | tail -1",
  timeout_ms: 10000
});

const gitEnd = await mcp__desktop-commander__start_process({
  command: "git log --format=\"%ai\" LAST_COMMIT | head -1",
  timeout_ms: 10000
});
```

Present:

```
Milestone Stats:
- Phases: [X-Y]
- Plans: [Z] total
- Tasks: [N] total (from phase summaries)
- Files modified: [M]
- Lines of code: [LOC] [language]
- Timeline: [Days] days ([Start] → [End])
- Git range: feat(XX-XX) → feat(YY-YY)
```

</step>

<step name="extract_accomplishments">

Extract one-liners from SUMMARY.md files using MCP process tool:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent for summary extraction
for (const summary of summaryFiles) {
  const result = await mcp__desktop-commander__start_process({
    command: `node ~/.claude/get-shit-indexed/bin/GSI-tools.js summary-extract "${summary}" --fields one_liner --raw`,
    timeout_ms: 10000
  });
  // Parse result for one_liner
}
```

Extract 4-6 key accomplishments. Present:

```
Key accomplishments for this milestone:
1. [Achievement from phase 1]
2. [Achievement from phase 2]
3. [Achievement from phase 3]
4. [Achievement from phase 4]
5. [Achievement from phase 5]
```

</step>

<step name="create_milestone_entry">

**Note:** MILESTONES.md entry is now created automatically by `GSI-tools milestone complete` in the archive_milestone step. The entry includes version, date, phase/plan/task counts, and accomplishments extracted from SUMMARY.md files.

If additional details are needed (e.g., user-provided "Delivered" summary, git range, LOC stats), add them manually after the CLI creates the base entry.
</step>

<step name="evolve_project_full_review">

Full PROJECT.md evolution review at milestone completion.

**Use MCP tools to read all phase summaries:**

**Use MCP tool: mcp__desktop-commander__read_file** or **mcp__desktop-commander__read_multiple_files**

```javascript
// MCP-based equivalent for reading multiple files
const summaries = await mcp__desktop-commander__read_multiple_files({
  paths: [
    ".planning/phases/01-*/01-*-SUMMARY.md",
    ".planning/phases/02-*/02-*-SUMMARY.md",
    // etc.
  ]
});
```

**Full review checklist:**

1. **"What This Is" accuracy:**
   - Compare current description to what was built
   - Update if product has meaningfully changed

2. **Core Value check:**
   - Still the right priority? Did shipping reveal a different core value?
   - Update if the ONE thing has shifted

3. **Requirements audit:**

   **Validated section:**
   - All Active requirements shipped this milestone → Move to Validated
   - Format: `- ✓ [Requirement] — v[X.Y]`

   **Active section:**
   - Remove requirements moved to Validated
   - Add new requirements for next milestone
   - Keep unaddressed requirements

   **Out of Scope audit:**
   - Review each item — reasoning still valid?
   - Remove irrelevant items
   - Add requirements invalidated during milestone

4. **Context update:**
   - Current codebase state (LOC, tech stack)
   - User feedback themes (if any)
   - Known issues or technical debt

5. **Key Decisions audit:**
   - Extract all decisions from milestone phase summaries
   - Add to Key Decisions table with outcomes
   - Mark ✓ Good, ⚠️ Revisit, or — Pending

6. **Constraints check:**
   - Any constraints changed during development? Update as needed

**Use MCP tool: mcp__desktop-commander__edit_block** to update PROJECT.md inline.

Update "Last updated" footer:

```markdown
---
*Last updated: [date] after v[X.Y] milestone*
```

**Example full evolution (v1.0 → v1.1 prep):**

Before:

```markdown
## What This Is

A real-time collaborative whiteboard for remote teams.

## Core Value

Real-time sync that feels instant.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Canvas drawing tools
- [ ] Real-time sync < 500ms
- [ ] User authentication

### Out of Scope

- Mobile app — web-first approach
- Video chat — use external tools
```

After v1.0:

```markdown
## What This Is

A real-time collaborative whiteboard for remote teams with instant sync and drawing tools.

## Core Value

Real-time sync that feels instant.

## Requirements

### Validated

- ✓ Canvas drawing tools — v1.0
- ✓ Real-time sync < 500ms — v1.0 (achieved 200ms avg)
- ✓ User authentication — v1.0

### Active

- [ ] Export to PNG
- [ ] Undo/redo history
- [ ] Shape tools (rectangles, circles)

### Out of Scope

- Mobile app — web-first approach, PWA works well
- Video chat — use external tools
- Offline mode — real-time is core value

## Context

Shipped v1.0 with 2,400 LOC TypeScript.
Tech stack: Next.js, Supabase, Canvas API.
Initial user testing showed demand for shape tools.
```

**Step complete when:**

- [ ] "What This Is" reviewed and updated if needed
- [ ] Core Value verified as still correct
- [ ] All shipped requirements moved to Validated
- [ ] New requirements added to Active for next milestone
- [ ] Out of Scope reasoning audited
- [ ] Context updated with current state
- [ ] All milestone decisions added to Key Decisions
- [ ] "Last updated" footer reflects milestone completion

</step>

<step name="reorganize_roadmap">

Update `.planning/ROADMAP.md` — group completed milestone phases.

**Use MCP tool: mcp__desktop-commander__read_file** and **mcp__desktop-commander__edit_block**

```markdown
# Roadmap: [Project Name]

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped YYYY-MM-DD)
- 🚧 **v1.1 Security** — Phases 5-6 (in progress)
- 📋 **v2.0 Redesign** — Phases 7-10 (planned)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED YYYY-MM-DD</summary>

- [x] Phase 1: Foundation (2/2 plans) — completed YYYY-MM-DD
- [x] Phase 2: Authentication (2/2 plans) — completed YYYY-MM-DD
- [x] Phase 3: Core Features (3/3 plans) — completed YYYY-MM-DD
- [x] Phase 4: Polish (1/1 plan) — completed YYYY-MM-DD

</details>

### 🚧 v[Next] [Name] (In Progress / Planned)

- [ ] Phase 5: [Name] ([N] plans)
- [ ] Phase 6: [Name] ([N] plans)

## Progress

| Phase             | Milestone | Plans Complete | Status      | Completed  |
| ----------------- | --------- | -------------- | ----------- | ---------- |
| 1. Foundation     | v1.0      | 2/2            | Complete    | YYYY-MM-DD |
| 2. Authentication | v1.0      | 2/2            | Complete    | YYYY-MM-DD |
| 3. Core Features  | v1.0      | 3/3            | Complete    | YYYY-MM-DD |
| 4. Polish         | v1.0      | 1/1            | Complete    | YYYY-MM-DD |
| 5. Security Audit | v1.1      | 0/1            | Not started | -          |
| 6. Hardening      | v1.1      | 0/2            | Not started | -          |
```
</step>

<step name="archive_milestone">

**Delegate archival to GSI-tools:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent (80-90% token savings vs bash)
const ARCHIVE = await mcp__desktop-commander__start_process({
  command: `node ~/.claude/get-shit-indexed/bin/GSI-tools.js milestone complete "v[X.Y]" --name "[Milestone Name]"`,
  timeout_ms: 15000
});
```

The CLI handles:
- Creating `.planning/milestones/` directory
- Archiving ROADMAP.md to `milestones/v[X.Y]-ROADMAP.md`
- Archiving REQUIREMENTS.md to `milestones/v[X.Y]-REQUIREMENTS.md` with archive header
- Moving audit file to milestones if it exists
- Creating/appending MILESTONES.md entry with accomplishments from SUMMARY.md files
- Updating STATE.md (status, last activity)

Extract from result: `version`, `date`, `phases`, `plans`, `tasks`, `accomplishments`, `archived`.

Verify: `✅ Milestone archived to .planning/milestones/`

**Note:** Phase directories (`.planning/phases/`) are NOT deleted — they accumulate across milestones as raw execution history. Phase numbering continues (v1.0 phases 1-4, v1.1 phases 5-8, etc.).

After archival, the AI still handles:
- Reorganizing ROADMAP.md with milestone grouping (requires judgment)
- Full PROJECT.md evolution review (requires understanding)
- Deleting original ROADMAP.md and REQUIREMENTS.md
- These are NOT fully delegated because they require AI interpretation of content

</step>

<step name="reorganize_roadmap_and_delete_originals">

After `milestone complete` has archived, reorganize ROADMAP.md with milestone groupings, then delete originals:

**Reorganize ROADMAP.md** — group completed milestone phases.

**Use MCP tool: mcp__desktop-commander__write_file**

```markdown
# Roadmap: [Project Name]

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped YYYY-MM-DD)
- 🚧 **v1.1 Security** — Phases 5-6 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED YYYY-MM-DD</summary>

- [x] Phase 1: Foundation (2/2 plans) — completed YYYY-MM-DD
- [x] Phase 2: Authentication (2/2 plans) — completed YYYY-MM-DD

</details>
```

**Then delete originals using MCP process tool:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent for file deletion
await mcp__desktop-commander__start_process({
  command: "rm .planning/ROADMAP.md",
  timeout_ms: 5000
});

await mcp__desktop-commander__start_process({
  command: "rm .planning/REQUIREMENTS.md",
  timeout_ms: 5000
});
```

</step>

<step name="update_state">

Most STATE.md updates were handled by `milestone complete`, but verify and update remaining fields.

**Project Reference:**

```markdown
## Project Reference

See: .planning/PROJECT.md (updated [today])

**Core value:** [Current core value from PROJECT.md]
**Current focus:** [Next milestone or "Planning next milestone"]
```

**Accumulated Context:**
- Clear decisions summary (full log in PROJECT.md)
- Clear resolved blockers
- Keep open blockers for next milestone

</step>

<step name="handle_branches">

Check branching strategy and offer merge options.

**Use MCP tool: mcp__desktop-commander__start_process** for context, or load config directly:

```javascript
const INIT = await mcp__desktop-commander__start_process({
  command: "node ~/.claude/get-shit-indexed/bin/GSI-tools.js init execute-phase \"1\"",
  timeout_ms: 10000
});
```

Extract `branching_strategy`, `phase_branch_template`, `milestone_branch_template` from init JSON.

**If "none":** Skip to git_tag.

**For "phase" strategy:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
const BRANCH_PREFIX = await mcp__desktop-commander__start_process({
  command: `echo "$PHASE_BRANCH_TEMPLATE" | sed 's/{.*//'`,
  timeout_ms: 5000
});

const PHASE_BRANCHES = await mcp__desktop-commander__start_process({
  command: `git branch --list "${BRANCH_PREFIX}*" 2>/dev/null | sed 's/^[* ]*//' | tr -d ' '`,
  timeout_ms: 5000
});
```

**For "milestone" strategy:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
const BRANCH_PREFIX = await mcp__desktop-commander__start_process({
  command: `echo "$MILESTONE_BRANCH_TEMPLATE" | sed 's/{.*//'`,
  timeout_ms: 5000
});

const MILESTONE_BRANCH = await mcp__desktop-commander__start_process({
  command: `git branch --list "${BRANCH_PREFIX}*" 2>/dev/null | sed 's/^[* ]*//' | tr -d ' ' | head -1`,
  timeout_ms: 5000
});
```

**If no branches found:** Skip to git_tag.

**If branches exist:**

```
## Git Branches Detected

Branching strategy: {phase/milestone}
Branches: {list}

Options:
1. **Merge to main** — Merge branch(es) to main
2. **Delete without merging** — Already merged or not needed
3. **Keep branches** — Leave for manual handling
```

AskUserQuestion with options: Squash merge (Recommended), Merge with history, Delete without merging, Keep branches.

**Squash merge:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent for git operations
const CURRENT_BRANCH = await mcp__desktop-commander__start_process({
  command: "git branch --show-current",
  timeout_ms: 5000
});

await mcp__desktop-commander__start_process({
  command: "git checkout main",
  timeout_ms: 5000
});

// Merge each branch with squash
for (const branch of phaseBranches) {
  await mcp__desktop-commander__start_process({
    command: `git merge --squash "${branch}"`,
    timeout_ms: 10000
  });
  await mcp__desktop-commander__start_process({
    command: `git commit -m "feat: ${branch} for v[X.Y]"`,
    timeout_ms: 5000
  });
}

await mcp__desktop-commander__start_process({
  command: `git checkout "${CURRENT_BRANCH}"`,
  timeout_ms: 5000
});
```

**Merge with history:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
const CURRENT_BRANCH = await mcp__desktop-commander__start_process({
  command: "git branch --show-current",
  timeout_ms: 5000
});

await mcp__desktop-commander__start_process({
  command: "git checkout main",
  timeout_ms: 5000
});

// Merge each branch with history
for (const branch of phaseBranches) {
  await mcp__desktop-commander__start_process({
    command: `git merge --no-ff "${branch}" -m "Merge branch '${branch}' for v[X.Y]"`,
    timeout_ms: 10000
  });
}

await mcp__desktop-commander__start_process({
  command: `git checkout "${CURRENT_BRANCH}"`,
  timeout_ms: 5000
});
```

**Delete without merging:**

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent for branch deletion
for (const branch of phaseBranches) {
  await mcp__desktop-commander__start_process({
    command: `git branch -d "${branch}" 2>/dev/null || git branch -D "${branch}"`,
    timeout_ms: 5000
  });
}
```

**Keep branches:** Report "Branches preserved for manual handling"

</step>

<step name="git_tag">

Create git tag using MCP process tool:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
// MCP-based equivalent for git tagging
await mcp__desktop-commander__start_process({
  command: `git tag -a v[X.Y] -m "v[X.Y] [Name]

Delivered: [One sentence]

Key accomplishments:
- [Item 1]
- [Item 2]
- [Item 3]

See .planning/MILESTONES.md for full details."`,
  timeout_ms: 5000
});
```

Confirm: "Tagged: v[X.Y]"

Ask: "Push tag to remote? (y/n)"

If yes:

**Use MCP tool: mcp__desktop-commander__start_process**

```javascript
await mcp__desktop-commander__start_process({
  command: `git push origin v[X.Y]`,
  timeout_ms: 15000
});
```

</step>

<step name="git_commit_milestone">

Commit milestone completion using MCP process tool:

**Use MCP tool: mcp__desktop-commander__start_process**

```bash
node ~/.claude/get-shit-indexed/bin/GSI-tools.js commit "chore: complete v[X.Y] milestone" --files .planning/milestones/v[X.Y]-ROADMAP.md .planning/milestones/v[X.Y]-REQUIREMENTS.md .planning/milestones/v[X.Y]-MILESTONE-AUDIT.md .planning/MILESTONES.md .planning/PROJECT.md .planning/STATE.md
```
```
Confirm: "Committed: chore: complete v[X.Y] milestone"

</step>

<step name="offer_next">

```
✅ Milestone v[X.Y] [Name] complete

Shipped:
- [N] phases ([M] plans, [P] tasks)
- [One sentence of what shipped]

Archived:
- milestones/v[X.Y]-ROADMAP.md
- milestones/v[X.Y]-REQUIREMENTS.md

Summary: .planning/MILESTONES.md
Tag: v[X.Y]

---

## ▶ Next Up

**Start Next Milestone** — questioning → research → requirements → roadmap

`/GSI:new-milestone`

<sub>`/clear` first → fresh context window</sub>

---
```

</step>

</process>

<milestone_naming>

**Version conventions:**
- **v1.0** — Initial MVP
- **v1.1, v1.2** — Minor updates, new features, fixes
- **v2.0, v3.0** — Major rewrites, breaking changes, new direction

**Names:** Short 1-2 words (v1.0 MVP, v1.1 Security, v1.2 Performance, v2.0 Redesign).

</milestone_naming>

<what_qualifies>

**Create milestones for:** Initial release, public releases, major feature sets shipped, before archiving planning.

**Don't create milestones for:** Every phase completion (too granular), work in progress, internal dev iterations (unless truly shipped).

Heuristic: "Is this deployed/usable/shipped?" If yes → milestone. If no → keep working.

</what_qualifies>

<success_criteria>

Milestone completion is successful when:

- [ ] MILESTONES.md entry created with stats and accomplishments
- [ ] PROJECT.md full evolution review completed
- [ ] All shipped requirements moved to Validated in PROJECT.md
- [ ] Key Decisions updated with outcomes
- [ ] ROADMAP.md reorganized with milestone grouping
- [ ] Roadmap archive created (milestones/v[X.Y]-ROADMAP.md)
- [ ] Requirements archive created (milestones/v[X.Y]-REQUIREMENTS.md)
- [ ] REQUIREMENTS.md deleted (fresh for next milestone)
- [ ] STATE.md updated with fresh project reference
- [ ] Git tag created (v[X.Y])
- [ ] Milestone commit made (includes archive files and deletion)
- [ ] User knows next step (/GSI:new-milestone)

</success_criteria>
