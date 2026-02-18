# Discovery Template

Template for `.planning/phases/XX-name/DISCOVERY.md` - shallow research for library/option decisions.

**Purpose:** Answer "which library/option should we use" questions during mandatory discovery in plan-phase.

For deep ecosystem research ("how do experts build this"), use `/GSI:research-phase` which produces RESEARCH.md.

---

## File Template

```markdown
---
phase: XX-name
type: discovery
topic: [discovery-topic]
---

<session_initialization>
Before beginning discovery, verify today's date:
!`date +%Y-%m-%d`

Use this date when searching for "current" or "latest" information.
Example: If today is 2025-11-22, search for "2025" not "2024".
</session_initialization>

<discovery_objective>
Discover [topic] to inform [phase name] implementation.

Purpose: [What decision/implementation this enables]
Scope: [Boundaries]
Output: DISCOVERY.md with recommendation
</discovery_objective>

<discovery_scope>
<include>
- [Question to answer]
- [Area to investigate]
- [Specific comparison if needed]
</include>

<exclude>
- [Out of scope for this discovery]
- [Defer to implementation phase]
</exclude>
</discovery_scope>

<discovery_protocol>

**Source Priority:**
1. **Context7 MCP** - For library/framework documentation (current, authoritative)
2. **Code-Index MCP** - For ecosystem analysis, code search, and symbol extraction
3. **Official Docs** - For platform-specific or non-indexed libraries
4. **WebSearch** - For comparisons, trends, community patterns (verify all findings)

**Method Circle (Implementation) Thinking:**
Since discovery is an implementation task, use Sequential thinking for structured research:
1. **Step 1**: Define discovery scope and objectives
2. **Step 2**: Identify relevant sources and MCP tools
3. **Step 3**: Execute information gathering systematically
4. **Step 4**: Analyze findings against criteria
5. **Step 5**: Document results with clear recommendations

**Sequential Thought Pattern:**
```
Step 1: Understand requirements
- What decision needs to be made?
- What criteria matter most?
- What's the decision context?

Step 2: Design approach
- Which MCP tools to use?
- What sources to prioritize?
- How to structure the search?

Step 3: Execute research
- Gather information systematically
- Cross-reference findings
- Document sources

Step 4: Analyze results
- Compare alternatives
- Evaluate against criteria
- Identify gaps

Step 5: Document conclusions
- Summarize findings
- Make recommendation
- Document uncertainties
```

**Quality Checklist:**
Before completing discovery, verify:
- [ ] All claims have authoritative sources (Context7 or official docs)
- [ ] Negative claims ("X is not possible") verified with official documentation
- [ ] API syntax/configuration from Context7 or official docs (never WebSearch alone)
- [ ] WebSearch findings cross-checked with authoritative sources
- [ ] Recent updates/changelogs checked for breaking changes
- [ ] Alternative approaches considered (not just first solution found)
- [ ] MCP tools used for batch operations when reading multiple files
- [ ] Code-Index MCP used for code search and symbol extraction

**Confidence Levels:**
- HIGH: Context7 or official docs confirm
- MEDIUM: WebSearch + Context7/official docs confirm
- LOW: WebSearch only or training knowledge only (mark for validation)

</discovery_protocol>


<output_structure>
Create `.planning/phases/XX-name/DISCOVERY.md`:

```markdown
# [Topic] Discovery

## Summary
[2-3 paragraph executive summary - what was researched, what was found, what's recommended]

## Primary Recommendation
[What to do and why - be specific and actionable]

## Alternatives Considered
[What else was evaluated and why not chosen]

## Key Findings

### [Category 1]
- [Finding with source URL and relevance to our case]

### [Category 2]
- [Finding with source URL and relevance]

## Code Examples
[Relevant implementation patterns, if applicable]

## Metadata

<metadata>
<confidence level="high|medium|low">
[Why this confidence level - based on source quality and verification]
</confidence>

<sources>
- [Primary authoritative sources used]
</sources>

<open_questions>
[What couldn't be determined or needs validation during implementation]
</open_questions>

<validation_checkpoints>
[If confidence is LOW or MEDIUM, list specific things to verify during implementation]
</validation_checkpoints>
</metadata>
```
</output_structure>

<success_criteria>
- All scope questions answered with authoritative sources
- Quality checklist items completed
- Clear primary recommendation
- Low-confidence findings marked with validation checkpoints
- Ready to inform PLAN.md creation
- MCP tool patterns documented for future use
</success_criteria>

<guidelines>
**When to use discovery:**
- Technology choice unclear (library A vs B)
- Best practices needed for unfamiliar integration
- API/library investigation required
- Single decision pending

**When NOT to use:**
- Established patterns (CRUD, auth with known library)
- Implementation details (defer to execution)
- Questions answerable from existing project context

**When to use RESEARCH.md instead:**
- Niche/complex domains (3D, games, audio, shaders)
- Need ecosystem knowledge, not just library choice
- "How do experts build this" questions
- Use `/GSI:research-phase` for these
</guidelines>
