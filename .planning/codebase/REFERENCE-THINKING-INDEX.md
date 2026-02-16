# Reference Thinking Index

**Phase:** 20-04c
**Purpose:** Quick-reference index for thinking server guidance across all GSI reference files
**Created:** 2026-02-16

---

## Quick Reference Table

| Reference | Thinking Server | Use Case | Token Budget |
|-----------|-----------------|----------|--------------|
| **TOOL-PRIORITY-RULES.md** | All | Tool selection with cognitive enhancement | 1-3K |
| **TOOL-CHAIN-REFERENCE.md** | All | Pattern selection for complex workflows | 2-3K |
| **7-BMAD-METHODOLOGY.md** | Sequential, Tractatus, Debug | 7-BMAD validation gates | 2-4K |
| **GOLDEN-PATTERN.md** | Sequential, Tractatus, Debug | Complex refactor planning | 3-4K |
| **DECISION-TREES.md** | Sequential, Tractatus | Decision tree traversal | 1-2K |
| **MCP-QUICK-REFERENCE.md** | All | Quick tool + thinking lookup | 0.5-1K |
| **THINKING-SERVERS.md** | All | Server documentation | N/A (reference) |
| **CODE-INDEX-MCP-GUIDE.md** | Sequential | CI search planning | 1-2K |
| **checkpoints.md** | Sequential | Checkpoint flow planning | 1K |
| **tdd.md** | Sequential, Debug | TDD cycle planning | 1-2K |
| **git-integration.md** | Sequential | Commit planning | 0.5K |
| **ui-brand.md** | Tractatus | Design system structure | 1-2K |
| **verification-patterns.md** | Debug | Verification issue tracking | 1K |
| **wave-tuning.md** | Sequential | Wave optimization | 1K |
| **wave-verification.md** | Debug | Wave issue investigation | 1K |
| **yolo-mode.md** | Sequential | YOLO decision flow | 0.5K |

---

## Thinking Server Overview

### Sequential Thinking

**Primary Use Cases:**
- Multi-step task decomposition
- Process planning and execution
- Step-by-step verification
- TDD cycle management

**References Using Sequential:**
- TOOL-PRIORITY-RULES.md (tool selection)
- TOOL-CHAIN-REFERENCE.md (Patterns 25, 29, 32)
- 7-BMAD-METHODOLOGY.md (Method, Mod, Methodd circles)
- GOLDEN-PATTERN.md (planning and verification)
- DECISION-TREES.md (tool selection, escalation)
- checkpoints.md (flow planning)
- tdd.md (RED-GREEN-REFACTOR cycle)
- git-integration.md (commit planning)

**Prompt Pattern:**
```
Thought 1: "Analyze requirements..."
Thought 2: "Plan execution steps..."
Thought 3: "Execute step 1..."
Thought 4: "Verify completion..."
```

### Tractatus Thinking

**Primary Use Cases:**
- Architecture analysis
- Structure decomposition
- Pattern consistency verification
- Extensibility analysis

**References Using Tractatus:**
- TOOL-PRIORITY-RULES.md (architecture decisions)
- TOOL-CHAIN-REFERENCE.md (Patterns 26, 28, 31)
- 7-BMAD-METHODOLOGY.md (Model, Mode, Modd circles)
- GOLDEN-PATTERN.md (structure analysis)
- DECISION-TREES.md (pattern selection, workflow routing)
- ui-brand.md (design system structure)

**Prompt Pattern:**
```
Concept: "Analyze {structure}"
Propositions:
1. Component A defines structure
2. Component B extends A
3. All factors must be present (multiplicative)
Export: findings
```

### Debug Thinking

**Primary Use Cases:**
- Bug investigation
- Issue tracking
- Pattern learning
- Knowledge capture

**References Using Debug:**
- TOOL-PRIORITY-RULES.md (debug workflow)
- TOOL-CHAIN-REFERENCE.md (Patterns 27, 30)
- 7-BMAD-METHODOLOGY.md (Mad circle)
- GOLDEN-PATTERN.md (learning capture)
- verification-patterns.md (issue tracking)
- wave-verification.md (wave issues)

**Prompt Pattern:**
```
Query: similar problems
Create: hypothesis about issue
Create: experiment to test
Record: observation
Create: learning for future
```

---

## Thinking + MCP Integration Patterns

### Pattern A: Sequential -> CI -> DC
**Use:** Plan multi-step code changes
**References:** TOOL-CHAIN-REFERENCE.md Pattern 25
**Flow:**
1. Sequential: Plan steps
2. CI: Search existing patterns
3. DC: Execute changes

### Pattern B: Tractatus -> CG -> CI
**Use:** Architecture analysis
**References:** TOOL-CHAIN-REFERENCE.md Pattern 26
**Flow:**
1. Tractatus: Decompose structure
2. CG: Map relationships
3. CI: Search implementation details

### Pattern C: Debug -> CI -> DC
**Use:** Bug investigation and fix
**References:** TOOL-CHAIN-REFERENCE.md Pattern 27
**Flow:**
1. Debug: Query similar problems
2. CI: Find code evidence
3. DC: Apply fix

### Pattern D: Tractatus -> CG -> DC
**Use:** Architecture refactor
**References:** TOOL-CHAIN-REFERENCE.md Pattern 28
**Flow:**
1. Tractatus: Analyze what to change
2. CG: Map affected files
3. DC: Make coordinated edits

### Pattern E: Sequential -> Golden -> Sequential
**Use:** Complex multi-file refactor
**References:** TOOL-CHAIN-REFERENCE.md Pattern 29, GOLDEN-PATTERN.md
**Flow:**
1. Sequential: Plan refactor
2. Golden Pattern: Execute (CG -> CI -> CI -> DC -> DC -> CI)
3. Sequential: Verify completion

---

## 7-BMAD Circle Mapping

| Circle | Primary Server | Secondary | Key References |
|--------|----------------|-----------|----------------|
| Method | Sequential | Debug | 7-BMAD-METHODOLOGY.md, tdd.md |
| Mad | Debug | Sequential | 7-BMAD-METHODOLOGY.md, verification-patterns.md |
| Model | Tractatus | - | 7-BMAD-METHODOLOGY.md, GOLDEN-PATTERN.md |
| Mode | Tractatus | Sequential | 7-BMAD-METHODOLOGY.md, ui-brand.md |
| Mod | Sequential | Tractatus | 7-BMAD-METHODOLOGY.md, DECISION-TREES.md |
| Modd | Tractatus | - | 7-BMAD-METHODOLOGY.md, GOLDEN-PATTERN.md |
| Methodd | Sequential | - | 7-BMAD-METHODOLOGY.md, git-integration.md |

---

## Token Budget Guidelines

### Per-Reference Thinking Budget

| Reference Type | Budget | Rationale |
|----------------|--------|-----------|
| Quick lookup (MCP-QUICK-REFERENCE) | 0.5-1K | Simple decisions |
| Decision trees | 1-2K | Multiple paths to evaluate |
| Pattern selection | 2-3K | Structure analysis needed |
| Complex workflows | 3-4K | Full planning + verification |

### Combined Thinking + MCP Budget

| Workflow | Thinking | MCP | Total | vs Native |
|----------|----------|-----|-------|-----------|
| Simple edit | 1K | 8K | 9K | ~85% savings |
| Multi-file refactor | 3K | 33K | 36K | ~85% savings |
| Bug investigation | 2K | 10K | 12K | ~89% savings |
| Architecture analysis | 2K | 8K | 10K | ~90% savings |

---

## Cross-Reference Index

### By Thinking Server

**Sequential Thinking:**
- TOOL-PRIORITY-RULES.md - Section: Thinking Server Selection
- TOOL-CHAIN-REFERENCE.md - Patterns 25, 29, 32
- 7-BMAD-METHODOLOGY.md - Method, Mod, Methodd circles
- GOLDEN-PATTERN.md - Planning and verification phases
- DECISION-TREES.md - Tool selection, complexity escalation
- checkpoints.md - Checkpoint flow planning
- tdd.md - TDD cycle planning
- git-integration.md - Commit planning
- yolo-mode.md - YOLO decision flow

**Tractatus Thinking:**
- TOOL-PRIORITY-RULES.md - Architecture decisions
- TOOL-CHAIN-REFERENCE.md - Patterns 26, 28, 31
- 7-BMAD-METHODOLOGY.md - Model, Mode, Modd circles
- GOLDEN-PATTERN.md - Structure analysis phase
- DECISION-TREES.md - Pattern selection, workflow routing
- ui-brand.md - Design system structure

**Debug Thinking:**
- TOOL-PRIORITY-RULES.md - Debug workflow
- TOOL-CHAIN-REFERENCE.md - Patterns 27, 30
- 7-BMAD-METHODOLOGY.md - Mad circle
- GOLDEN-PATTERN.md - Learning capture phase
- verification-patterns.md - Issue tracking
- wave-verification.md - Wave issues

### By Reference Type

**Codebase Documentation:**
- THINKING-SERVERS.md (comprehensive server docs)
- TOOL-PRIORITY-RULES.md (tool selection + thinking)
- TOOL-CHAIN-REFERENCE.md (patterns + thinking)
- 7-BMAD-METHODOLOGY.md (circles + thinking)
- GOLDEN-PATTERN.md (workflow + thinking)
- DECISION-TREES.md (decisions + thinking)
- MCP-QUICK-REFERENCE.md (quick lookup + thinking)

**Workflow References:**
- checkpoints.md (checkpoint flows)
- tdd.md (TDD cycles)
- verification-patterns.md (verification)
- git-integration.md (git workflows)

**Special Purpose:**
- ui-brand.md (design systems)
- wave-tuning.md (wave optimization)
- wave-verification.md (wave verification)
- yolo-mode.md (autonomous mode)

---

## Usage Guide

### How to Use This Index

1. **Identify your task type** (edit, refactor, debug, etc.)
2. **Find relevant references** in the Quick Reference Table
3. **Select thinking server** based on task complexity
4. **Check token budget** to plan context usage
5. **Follow integration pattern** from Thinking + MCP section

### Example: Planning a Multi-File Refactor

```
1. Check this index:
   - Task: Multi-file refactor
   - References: GOLDEN-PATTERN.md, TOOL-CHAIN-REFERENCE.md Pattern 29
   
2. Select thinking server:
   - Sequential (planning): 2K tokens
   - Tractatus (structure): 1K tokens
   
3. Follow integration pattern:
   - Sequential -> Golden Pattern -> Sequential
   
4. Execute:
   - Sequential: Plan refactor steps
   - Golden Pattern: Execute changes
   - Sequential: Verify completion
```

---

*Reference Thinking Index*
*Phase: 20-04c*
*Created: 2026-02-16*
*Cross-references: THINKING-SERVERS.md, TOOL-PRIORITY-RULES.md, TOOL-CHAIN-REFERENCE.md*
