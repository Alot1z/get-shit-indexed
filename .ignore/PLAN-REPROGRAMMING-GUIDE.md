# Plan Reprogramming Guide

## How the DOCX Analysis Can Help Reprogram Plans

The `MCP-Enhanced-GSD-Phases-1-8-Complete-Analysis.docx` provides the **authoritative reference** for how phases should be structured and documented.

---

## Key Insights from the Document

### 1. Golden Pattern (Must Follow)
```
CG → CI → CI → DC → DC → CI
(discover → understand → act → verify)
```

This pattern should be embedded in ALL plan files.

### 2. Phase Structure Template

Every phase should have:
```yaml
Phase Name:
  Goal: [Single sentence what must be TRUE]
  Plans: [Number of plans]
  Key Deliverables: [Bullet list of artifacts]
  Requirements: [Mapped requirement IDs]
  Success Criteria: [Measurable outcomes]
```

### 3. Requirements Coverage Format
```
Category | Requirement IDs | Total | Phases
---------|-----------------|-------|--------
MCP Integration | MCP-001 through MCP-006 | 6 | Phase 1
Workflow Updates | WORKFLOW-001 through WORKFLOW-007 | 7 | Phases 2, 7, 8
```

### 4. Token Efficiency Standards
| Operation | Native (tokens) | MCP (tokens) | Savings |
|-----------|-----------------|--------------|---------|
| File read | 15,000+ | 2,000 | 87% |
| Code search | 8,000+ | 1,200 | 85% |
| Symbol extraction | 5,000+ | 800 | 84% |

### 5. 7-BMAD Circle Template
```
Circle | Focus | Validation Checks
-------|-------|------------------
Method | Implementation Correctness | Code compiles, logic matches, edge cases
Mad | Integration Completeness | Dependencies integrated, APIs match
Model | Architecture Alignment | Patterns followed, separation of concerns
Mode | Pattern Consistency | Coding patterns, naming conventions
Mod | Maintainability Standards | Readability, complexity limits
Modd | Extensibility Verification | Easy to extend, configurable
Methodd | Documentation Completeness | API docs, examples, troubleshooting
```

---

## Plan File Standard Template (Based on Document)

```markdown
---
phase: XX-phase-name
plan: YY
type: execute
wave: N
depends_on: [list of dependencies]
files_modified: [list of files]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "[What must be TRUE after completion]"
    - "[Measurable statement]"
  artifacts:
    - path: "[file path]"
      provides: "[what it provides]"
      min_lines: [number]
      contains: ["keyword1", "keyword2"]
  key_links:
    - from: "[source]"
      to: "[target]"
      via: "[relationship]"
      pattern: "[regex pattern]"

<tool_priority>
**Tool Selection Hierarchy (MANDATORY):**
1. Skills FIRST (pre-compressed, maximum efficiency)
2. Desktop Commander MCP SECOND (high efficiency)
3. Other MCP Tools THIRD (medium efficiency)
4. Native Tools LAST (fallback only)

**Quick Reference:**
- File ops -> mcp__desktop-commander__*
- Code search -> mcp__code-index-mcp__*
- Process ops -> mcp__desktop-commander__start_process
- Relationships -> mcp__CodeGraphContext__*

**Golden Pattern: CG → CI → CI → DC → DC → CI**
</tool_priority>
---

<objective>
[Single paragraph describing the objective]

Purpose: [Why this matters]
Output: [What will be produced]
</objective>

<execution_context>
@C:\Users\mose\.claude\get-shit-done\workflows\execute-plan.md
@C:\Users\mose\.claude\get-shit-done\templates\summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task N: [Task name]</name>
  <files>[Files modified]</files>
  <action>
    [Detailed action using MCP tools]

    1. Use mcp__desktop-commander__* for file operations
    2. Use mcp__code-index-mcp__* for code search
    3. [Step 3...]

    [Expected outcome]
  </action>
  <verify>[How to verify completion]</verify>
  <done>[Success message]</done>
</task>

</tasks>

<verification>
1. [Verification point 1]
2. [Verification point 2]
3. [All must_haves satisfied]
</verification>

<success_criteria>
- [ ] [Criterion 1 - measurable]
- [ ] [Criterion 2 - measurable]
- [ ] [Criterion 3 - measurable]
</success_criteria>

<output>
After completion, create `.planning/phases/XX-name/XX-YY-SUMMARY.md` with:
- Duration metrics
- All task commits
- Files created/modified
- Next steps
</output>
```

---

## Applying to Phases 9-13 Reprogramming

### Phase 9: Repository Renovation

**From Document Pattern:**
```yaml
Phase 9: Repository Renovation
  Goal: Complete GSD → GSI transformation with new logo, keywords, and docs
  Plans: 3 plans
  Key Deliverables:
    - GSI terminal logo with ring effects
    - All GSD keywords replaced with GSI
    - Documentation fully rebranded
  Requirements: GSI-001 through GSI-006
  Success Criteria:
    - 0 occurrences of "GSD" in codebase
    - Logo renders correctly with horizontal rings
    - All URLs point to fork
```

### Phase 10: MCP & Tools Audit

**From Document Pattern:**
```yaml
Phase 10: MCP & Tools Audit
  Goal: Complete audit of all MCP servers and tools with documentation
  Plans: 2 plans
  Key Deliverables:
    - MCP-SERVER-AUDIT.md with all servers documented
    - TOOLS-AUDIT.md with dependency graph
    - Connection tests for all servers
  Requirements: AUDIT-001 through AUDIT-004
  Success Criteria:
    - All 15+ MCP servers documented
    - All connections verified
    - Token efficiency documented
```

### Phase 11: Resources & Links Audit

**From Document Pattern:**
```yaml
Phase 11: Resources & Links Audit
  Goal: Verify all external and internal resources and links
  Plans: 1 plan
  Key Deliverables:
    - RESOURCES-AUDIT.md with all URLs catalogued
    - All broken links identified
    - Old repo links updated
  Requirements: LINK-001 through LINK-003
  Success Criteria:
    - 100% URL verification
    - 0 broken internal references
```

### Phase 12: Theory & Practice Docs

**From Document Pattern:**
```yaml
Phase 12: Theory & Practice Documentation
  Goal: Document conceptual model vs actual implementation
  Plans: 1 plan
  Key Deliverables:
    - THEORY.md (design intent)
    - PRACTICE.md (actual implementation)
    - GAP-ANALYSIS.md with severity ratings
    - ARCHITECTURE.md with Mermaid diagrams
  Requirements: DOC-006 through DOC-009
  Success Criteria:
    - All gaps identified and prioritized
    - Resolution plans created
```

### Phase 13: Comprehensive Testing

**From Document Pattern:**
```yaml
Phase 13: Comprehensive Testing
  Goal: End-to-end testing of all GSI functionality
  Plans: 1 plan
  Key Deliverables:
    - TEST-REPORT.md with all results
    - All /gsi: commands verified
    - Brand consistency confirmed
  Requirements: TEST-001 through TEST-005
  Success Criteria:
    - 100% command pass rate
    - 0 GSD references remaining
    - All MCP integrations working
```

---

## Action Items

Based on the DOCX analysis, the following actions should be taken:

1. **Update Plan Headers** - Add `<tool_priority>` section to all plans
2. **Add Golden Pattern** - Include `CG → CI → CI → DC → DC → CI` reference
3. **Standardize Success Criteria** - Use measurable, checkbox format
4. **Add 7-BMAD Verification** - Include relevant circle checks
5. **Document Token Savings** - Track efficiency gains per plan

---

## Next Steps

1. **Regenerate Phase 9-13 Plans** using the standard template
2. **Add Requirements Mapping** for new GSI phases
3. **Create GSI-REQUIREMENTS.md** for phases 9-13
4. **Update ROADMAP.md** with detailed phase descriptions

*Generated from: MCP-Enhanced-GSD-Phases-1-8-Complete-Analysis.docx*
