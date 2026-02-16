# Phase 20-04d: Template Thinking Integration

## Objective
Integrate thinking phases into all GSI template files so generated content includes cognitive enhancement.

## Problem Analysis

**Current State:**
- 20 template files in templates/ directory
- Templates have no thinking guidance
- Generated content (plans, summaries, etc.) doesn't include thinking
- Users create documents without cognitive structure

**Solution:**
Add thinking phase placeholders to all templates that get expanded during generation.

## Tasks

### Task 1: Create Template Thinking Guide
```
<task>
Create guide for adding thinking to templates.

1. Create templates/TEMPLATE-THINKING-GUIDE.md
2. Document thinking placeholder syntax:
   - {{THINKING_PHASE:type}} for dynamic insertion
   - {{THINKING_SERVER:recommendation}} for server hints
3. Define template categories:
   - Document templates (PLAN, SUMMARY, VERIFICATION)
   - Code templates (component, function)
   - Workflow templates (phase, task)
4. Add examples for each category
</task>

<files>
templates/TEMPLATE-THINKING-GUIDE.md
</files>

<acceptance>
- Guide created with placeholder syntax
- All categories documented
- Examples provided
</acceptance>
```

### Task 2: Update Plan Template
```
<task>
Add thinking phases to plan template.

1. Read templates/plan.md
2. Add thinking_phase section at start:
   - PRE_PLANNING: Tractatus for structure analysis
   - DURING_PLANNING: Sequential for task breakdown
   - POST_PLANNING: Debug for validation
3. Add thinking checkpoint markers
4. Ensure backward compatibility
</task>

<files>
templates/plan.md
</files>

<acceptance>
- Plan template has thinking phases
- Checkpoints added
- Backward compatible
</acceptance>
```

### Task 3: Update Summary Template
```
<task>
Add reflection capture to summary template.

1. Read templates/summary.md
2. Add REFLECTION section:
   - What worked well
   - What could be improved
   - Patterns discovered
3. Add LEARNING_CAPTURE placeholder
4. Link to debug-thinking for persistence
</task>

<files>
templates/summary.md
</files>

<acceptance>
- Summary template has reflection section
- Learning capture integrated
- Debug-thinking linked
</acceptance>
```

### Task 4: Update Verification Template
```
<task>
Add thinking-based verification to verification template.

1. Read templates/verification.md (or create)
2. Add 7-BMAD circle checks with thinking:
   - Each circle has thinking prompt
   - Validation uses appropriate server
3. Add pattern matching section
4. Add learning extraction section
</task>

<files>
templates/verification.md
</files>

<acceptance>
- Verification template has 7-BMAD thinking
- Pattern matching added
- Learning extraction included
</acceptance>
```

### Task 5: Update Remaining Templates
```
<task>
Add thinking guidance to remaining template files.

1. List all templates/*.md files
2. Add thinking section to each:
   - context.md: Tractatus for context gathering
   - research.md: Sequential for research direction
   - checkpoint.md: Debug for checkpoint analysis
   - etc.
3. Add template metadata with thinking requirements
4. Create template registry update
</task>

<files>
templates/*.md (16 remaining files)
</files>

<acceptance>
- All 20 templates have thinking guidance
- Metadata added
- Registry updated
</acceptance>
```

## Verification

**Must Have:**
- [ ] Template thinking guide created
- [ ] Plan template updated
- [ ] Summary template updated
- [ ] Verification template created/updated
- [ ] All 20 templates have thinking

## Estimated Duration
10-12 minutes (5 tasks with 20 template files)

## Dependencies
- Phase 20-02b (Thinking Orchestrator)
- Phase 20-03 (PostToolUse Reflection)
