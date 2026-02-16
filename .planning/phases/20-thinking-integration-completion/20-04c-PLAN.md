# Phase 20-04c: Reference Thinking Integration

## Objective
Integrate thinking phases into all GSI reference files so documentation includes thinking guidance.

## Problem Analysis

**Current State:**
- 18 reference files in references/ directory
- References have no thinking phases
- Documentation doesn't guide cognitive enhancement
- Users don't know when to use which thinking server

**Solution:**
Add thinking guidance to all reference files with server-specific recommendations.

## Tasks

### Task 1: Create Reference Thinking Template
```
<task>
Create template for thinking guidance in reference files.

1. Create templates/reference-thinking.md
2. Define reference-specific sections:
   - WHEN_TO_USE: Scenarios for this reference
   - THINKING_SERVER: Recommended server (Sequential/Tractatus/Debug)
   - THINKING_PROMPT: Example prompt for the context
   - INTEGRATION_PATTERN: How to combine with other tools
3. Add to reference file template
</task>

<files>
templates/reference-thinking.md
</files>

<acceptance>
- Template created with all sections
- Reference-specific guidance included
- Template documented
</acceptance>
```

### Task 2: Update Tool Priority Reference
```
<task>
Add thinking guidance to TOOL-PRIORITY-RULES.md.

1. Read references/TOOL-PRIORITY-RULES.md
2. Add "Thinking Server Selection" section
3. Document when to use each thinking server:
   - Sequential: Multi-step reasoning, process flows
   - Tractatus: Logical structure, architecture analysis
   - Debug: Problem-solving, pattern learning
4. Add decision tree for server selection
5. Cross-reference with 7-BMAD circles
</task>

<files>
references/TOOL-PRIORITY-RULES.md
</files>

<acceptance>
- Thinking selection guidance added
- Decision tree created
- 7-BMAD cross-reference included
</acceptance>
```

### Task 3: Update Tool Chain Reference
```
<task>
Add thinking integration to TOOL-CHAIN-REFERENCE.md.

1. Read references/TOOL-CHAIN-REFERENCE.md
2. Add thinking server to each pattern:
   - Pattern A: Tractatus → CI → DC
   - Pattern B: Sequential → CG → CI
   - etc.
3. Document thinking-integrated patterns
4. Add token impact analysis
5. Update Mermaid diagrams with thinking steps
</task>

<files>
references/TOOL-CHAIN-REFERENCE.md
</files>

<acceptance>
- Thinking integrated into all patterns
- Token impact documented
- Diagrams updated
</acceptance>
```

### Task 4: Update 7-BMAD Reference
```
<task>
Add thinking server mapping to 7-BMAD documentation.

1. Read references/7-BMAD.md (or equivalent)
2. Map each circle to thinking servers:
   - Method: Sequential (implementation steps)
   - Mad: Debug (integration issues)
   - Model: Tractatus (architecture)
   - Mode: Tractatus (patterns)
   - Mod: Sequential (maintainability)
   - Modd: Tractatus (extensibility)
   - Methodd: Sequential (documentation)
3. Add example prompts per circle
4. Document combined circle analysis
</task>

<files>
references/7-BMAD.md
</files>

<acceptance>
- Circle-to-server mapping created
- Example prompts added
- Combined analysis documented
</acceptance>
```

### Task 5: Update Remaining References
```
<task>
Add thinking guidance to remaining reference files.

1. List all references/*.md files
2. Add thinking guidance section to each:
   - CHECKPOINTS.md: Debug thinking for checkpoint analysis
   - TDD.md: Sequential thinking for test design
   - ui-brand.md: Tractatus for style consistency
   - etc.
3. Ensure consistent format across references
4. Cross-link related thinking topics
</task>

<files>
references/*.md (14 remaining files)
</files>

<acceptance>
- All references have thinking guidance
- Consistent format applied
- Cross-links created
</acceptance>
```

### Task 6: Create Reference Thinking Index
```
<task>
Create index of thinking guidance across all references.

1. Create .planning/codebase/REFERENCE-THINKING-INDEX.md
2. List each reference with its thinking focus
3. Add quick-reference table:
   | Reference | Thinking Server | Use Case |
4. Link to detailed guidance in each file
5. Add to main documentation index
</task>

<files>
.planning/codebase/REFERENCE-THINKING-INDEX.md
</files>

<acceptance>
- Index created with all references
- Quick-reference table included
- Links verified
</acceptance>
```

## Verification

**Must Have:**
- [ ] Reference thinking template created
- [ ] TOOL-PRIORITY-RULES.md updated
- [ ] TOOL-CHAIN-REFERENCE.md updated
- [ ] 7-BMAD mapping created
- [ ] All 18 references have thinking guidance

## Estimated Duration
15-18 minutes (6 tasks with 18 reference files)

## Dependencies
- Phase 5 (Thinking Server Integration)
- Phase 20-02a (Thinking Mode Selector)
