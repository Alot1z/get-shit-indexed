# Research Phase Workflow

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- Use `mcp__desktop-commander__read_file` instead of Read
- Use `mcp__desktop-commander__write_file` instead of Write
- Use `mcp__desktop-commander__list_directory` instead of Bash ls

**Code Search:**
- Use `mcp__code-index-mcp__search_code_advanced` instead of Grep
- Use `mcp__code-index-mcp__find_files` instead of Glob

**External Research:**
- Use `mcp__context7__get-library-docs` for library documentation
- Use `mcp__deepwiki__ask_question` for GitHub repository knowledge
- Use `mcp__rag-web-browser__search` for web searches
</tool_requirements>

<purpose>
Conduct comprehensive research for a phase to gather requirements, understand dependencies, analyze patterns, and document findings before planning.
</purpose>

<required_reading>
# Research References
@references/validation-gates.md
@references/plan-checker.md

# Agent Reference
@agents/GSI-planner.md
</required_reading>

<process>

## Thinking Phase: Pre-Workflow

<server>tractatus</server>
<prompt>Analyze the research-phase workflow structure:
1. What are the key objectives of phase research?
2. What information gaps need to be filled?
3. What sources of information are available?
4. What research deliverables are expected?</prompt>
<expected_output>Structured breakdown of research components and information sources</expected_output>
<timeout>5000</timeout>
<integration>Use structure analysis to prioritize research areas and identify critical gaps</integration>

<step name="load_project_state">
Read `.planning/STATE.md` to understand current position.

### Thinking Phase: Pre-Step - Load Project State

<server>sequential</server>
<prompt>Analyze state loading for research:
1. What state information guides research direction?
2. What previous decisions affect research scope?
3. What blockers need investigation?</prompt>
<expected_output>Understanding of research context and constraints</expected_output>
<timeout>3000</timeout>

### Thinking Phase: Post-Step - State Loaded

<server>debug</server>
<prompt>Reflect on state for research:
1. What context is most relevant?
2. What unknowns were identified?
3. What should be remembered during research?</prompt>
<expected_output>Research context patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="define_research_scope">
Define what needs to be researched for this phase.

### Thinking Phase: Pre-Step - Define Research Scope

<server>tractatus</server>
<prompt>Analyze research scope:
1. What are the structural components of this phase?
2. What knowledge gaps exist?
3. What external information is needed?</prompt>
<expected_output>Clear research scope with prioritized areas</expected_output>
<timeout>3000</timeout>

**Research areas typically include:**
- Technical requirements and constraints
- Library/framework documentation
- Existing codebase patterns
- External best practices
- Dependency analysis

### Thinking Phase: Post-Step - Scope Defined

<server>debug</server>
<prompt>Reflect on scope definition:
1. Was the scope comprehensive?
2. What areas might need deeper investigation?
3. What research priorities emerged?</prompt>
<expected_output>Research priority patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="research_codebase">
Analyze existing codebase for patterns and context.

### Thinking Phase: Pre-Step - Research Codebase

<server>sequential</server>
<prompt>Plan codebase research:
1. What files are relevant to this phase?
2. What patterns should be identified?
3. What tools are most efficient for discovery?</prompt>
<expected_output>Step-by-step codebase research plan</expected_output>
<timeout>3000</timeout>

**Use code-index-mcp tools:**
- `search_code_advanced` for pattern searching
- `find_files` for file discovery
- `get_file_summary` for quick file analysis
- `get_symbol_body` for function/class details

**Document findings:**
- Existing patterns that apply
- Files to modify (files_modified)
- Dependencies to consider
- Constraints to respect

### Thinking Phase: Post-Step - Codebase Researched

<server>debug</server>
<prompt>Reflect on codebase research:
1. What patterns were discovered?
2. What constraints were identified?
3. What should be remembered for planning?</prompt>
<expected_output>Codebase patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="research_external">
Gather external documentation and knowledge.

### Thinking Phase: Pre-Step - Research External

<server>sequential</server>
<prompt>Plan external research:
1. What external knowledge is needed?
2. Which sources are most authoritative?
3. How do we validate findings?</prompt>
<expected_output>External research plan with source priorities</expected_output>
<timeout>3000</timeout>

**Use MCP tools for external research:**
- `mcp__context7__resolve-library-id` + `mcp__context7__get-library-docs` for library docs
- `mcp__deepwiki__ask_question` for GitHub repository questions
- `mcp__rag-web-browser__search` for general web searches

**Document findings:**
- API patterns and signatures
- Configuration requirements
- Best practices
- Version constraints

### Thinking Phase: Post-Step - External Researched

<server>debug</server>
<prompt>Reflect on external research:
1. Was documentation sufficient?
2. What ambiguities remain?
3. What external constraints were discovered?</prompt>
<expected_output>External research patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="analyze_dependencies">
Map dependencies between components and phases.

### Thinking Phase: Pre-Step - Analyze Dependencies

<server>tractatus</server>
<prompt>Analyze dependency structure:
1. What are the logical dependencies?
2. What external dependencies exist?
3. What phase-to-phase dependencies exist?</prompt>
<expected_output>Dependency structure with relationships</expected_output>
<timeout>3000</timeout>

**Dependency types:**
- Code dependencies (imports, calls)
- Data dependencies (shared state, data flow)
- Phase dependencies (must complete before)
- External dependencies (libraries, APIs)

### Thinking Phase: Post-Step - Dependencies Analyzed

<server>debug</server>
<prompt>Reflect on dependency analysis:
1. Were all dependencies captured?
2. What dependency risks exist?
3. What should be remembered for planning?</prompt>
<expected_output>Dependency patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="create_research_notes">
Document findings in research notes file.

### Thinking Phase: Pre-Step - Create Research Notes

<server>sequential</server>
<prompt>Plan research documentation:
1. What findings must be captured?
2. How do we organize for planning use?
3. What format is most useful?</prompt>
<expected_output>Documentation plan with structure</expected_output>
<timeout>3000</timeout>

Create `.planning/phases/XX-name/{phase}-RESEARCH.md`:

```markdown
# Phase Research: {phase-name}

## Research Scope
[Areas investigated]

## Codebase Findings
### Existing Patterns
- [Pattern 1]
- [Pattern 2]

### Files to Modify
- [File 1]: [Reason]
- [File 2]: [Reason]

### Constraints
- [Constraint 1]
- [Constraint 2]

## External Findings
### Library Documentation
[Relevant API details]

### Best Practices
[Relevant practices]

## Dependency Analysis
### Internal Dependencies
[Code dependencies]

### Phase Dependencies
[Phase relationships]

### External Dependencies
[Libraries, APIs]

## Open Questions
- [Question 1]
- [Question 2]

## Recommendations for Planning
- [Recommendation 1]
- [Recommendation 2]
```

### Thinking Phase: Post-Step - Research Notes Created

<server>debug</server>
<prompt>Reflect on research documentation:
1. Was documentation comprehensive?
2. What information was difficult to capture?
3. What should be remembered for future research?</prompt>
<expected_output>Research documentation patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="update_state">
Update STATE.md with:
- Research completion status
- Key decisions from research
- Blockers or concerns discovered
</step>

## Thinking Phase: Post-Workflow - Research Complete

<server>tractatus</server>
<prompt>Comprehensive research analysis:
1. What was the overall research structure?
2. What were the key findings?
3. What gaps remain?
4. What should be documented for planning?</prompt>
<expected_output>Research insights and planning recommendations</expected_output>
<timeout>5000</timeout>
<integration>Update research notes with insights, prepare for planning workflow</integration>

</process>

<completion_format>
When research completes successfully, return:

```markdown
## RESEARCH COMPLETE

**Phase:** {phase-name}
**Research Notes:** .planning/phases/XX-name/{phase}-RESEARCH.md

**Key Findings:**
- {Finding 1}
- {Finding 2}
- {Finding 3}

**Open Questions:**
- {Question 1}

**Ready for Planning:** Yes/No
**Next Step:** @workflows/plan-phase.md
```

</completion_format>

<validation_considerations>

## Integration with Planning Workflow

Research feeds directly into planning:

1. **Codebase findings** inform files_modified and existing patterns
2. **Dependency analysis** informs depends_on and wave structure
3. **External findings** inform implementation approach
4. **Open questions** may require checkpoint tasks

See @workflows/plan-phase.md for next steps.

</validation_considerations>

---

**Version:** 1.0  
**Last Updated:** 2026-02-17  
**Status:** Active
