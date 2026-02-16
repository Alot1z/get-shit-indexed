# Auto-Validation System Rules

## Overview

This document defines the mandatory auto-validation system that ensures all agent work meets 7-BMAD quality standards before completion.

## Core Principles

1. **Automatic Triggering**: Validation spawns automatically after every agent completion
2. **No Manual Intervention**: System operates without human oversight
3. **Quality Gates**: All 7 circles must pass validation
4. **Automatic Retry**: Failed validation triggers immediate fix attempts
5. **Token Optimization**: Validation uses compressed skills to minimize overhead

## Validation Workflow

### Phase 1: Completion Detection
```
Agent signals completion
↓
System detects completion signal
↓
Validation agent auto-spawns
```

### Phase 2: Quality Assessment
```
Validation agent loads context
↓
Executes code-review-expert skill
↓
Runs find-skills for optimization check
↓
Applies 7-BMAD gate assessment
```

### Phase 3: Gate Evaluation

#### Gate 1: Method Circle (Implementation Correctness)
- [ ] Code compiles/runs without errors
- [ ] Logic matches requirements exactly
- [ ] Edge cases handled properly
- [ ] Performance requirements met

**Validation Tool**: `code-review-expert` with focus on correctness

#### Gate 2: Mad Circle (Integration Completeness)
- [ ] All dependencies properly integrated
- [ ] APIs/interfaces match specifications
- [ ] Data flows correctly between components
- [ ] No integration points missing

**Validation Tool**: `code-review-expert` with focus on integration

#### Gate 3: Model Circle (Architecture Alignment)
- [ ] Follows project architectural patterns
- [ ] Maintains separation of concerns
- [ ] Adheres to design principles
- [ ] Consistent with existing codebase

**Validation Tool**: `tractatus-thinking` for structural analysis

#### Gate 4: Mode Circle (Pattern Consistency)
- [ ] Uses established coding patterns
- [ ] Naming conventions followed
- [ ] Error handling patterns consistent
- [ ] State management patterns aligned

**Validation Tool**: `code-review-expert` with pattern analysis

#### Gate 5: Mod Circle (Maintainability Standards)
- [ ] Code is readable and clear
- [ ] Comments where necessary (not obvious)
- [ ] Function/class size reasonable
- [ ] Complexity within acceptable limits

**Validation Tool**: `code-review-expert` with maintainability metrics

#### Gate 6: Modd Circle (Extensibility Verification)
- [ ] Easy to extend/modify
- [ ] No hard-coded assumptions
- [ ] Configurable where appropriate
- [ ] Plugin/extension points clear

**Validation Tool**: `tractatus-thinking` for extensibility analysis

#### Gate 7: Methodd Circle (Documentation Quality)
- [ ] README updated if needed
- [ ] API docs complete
- [ ] Usage examples provided
- [ ] Changes documented in changelog

**Validation Tool**: `code-review-expert` with documentation check

### Phase 4: Decision Point

```
All Gates Pass?
YES → Mark complete, notify user
NO  → Automatic fix attempt
     ↓
     Identify failing gates
     ↓
     Generate targeted fixes
     ↓
     Re-run validation
     ↓
     Max 3 retry attempts
     ↓
     If still failing → Notify user with details
```

## Optimization Discovery

As part of validation, the system:

1. **Runs find-skills** to discover better implementation approaches
2. **Checks for skill-based alternatives** to current implementation
3. **Identifies token optimization opportunities**
4. **Suggests architectural improvements** if applicable

## Validation Agent Specification

### Persona
You are a 7CBM Validation Specialist. Your mission is to ensure all work meets the highest quality standards before completion.

### Required Skills
- `code-review-expert`: Primary validation tool
- `find-skills`: Optimization discovery
- `tractatus-thinking`: Structural analysis
- `desktop-commander`: File operations

### Validation Commands

#### Validate Code
```
Use skill: code-review-expert
Focus: [Specific gate(s) to validate]
Context: [Relevant files/changes]
```

#### Check Optimizations
```
Use skill: find-skills
Task: [Current implementation]
Goal: Token/quality optimization
```

#### Analyze Structure
```
Use skill: tractatus-thinking
Operation: start
Concept: [Architecture/structure to analyze]
```

## Token Optimization Strategy

Validation minimizes token overhead:

1. **Compressed Skills**: Use pre-compressed validation skills
2. **Targeted Analysis**: Only analyze changed files
3. **Incremental Validation**: Validate incrementally, not all-at-once
4. **Cached Results**: Reuse validation results when possible

## Failure Handling

### Retry Strategy
1. **Attempt 1**: Fix immediate issues, re-validate
2. **Attempt 2**: Deeper analysis, architecture review
3. **Attempt 3**: Comprehensive refactor if needed
4. **Final Failure**: Detailed report to user

### Failure Report Format
```markdown
# Validation Failure Report

## Failing Gates
- Gate X: [Description]
- Gate Y: [Description]

## Issues Found
1. [Issue description with location]
2. [Issue description with location]

## Recommended Fixes
1. [Fix suggestion]
2. [Fix suggestion]

## Next Steps
Please review and either:
- Approve automatic fix attempts
- Provide guidance on resolution approach
```

## Integration Points

### Agent Completion Signal
Agents should signal completion with:
```
[COMPLETION]
Task: [Task description]
Files: [List of changed files]
Status: [Success/Partial/Failed]
[/COMPLETION]
```

### Validation Trigger
System monitors for completion signals and auto-spawns validation agent.

### User Notification
On successful validation:
```markdown
[VALIDATION COMPLETE]
Task: [Task description]
Quality Score: [7/7 gates passed]
Optimizations: [Any optimizations applied]
[/VALIDATION COMPLETE]
```

## Configuration

### Retry Limit
Default: 3 attempts
Configurable via: `~/.claude/get-shit-indexed/references/rules/auto-validation-config.json`

### Gate Weights
All gates: Equal weight (1/7 each)
Pass threshold: 100% (all gates must pass)

### Timeout
Per-gate validation: 60 seconds
Total validation: 5 minutes
Configurable via config file

## Monitoring and Metrics

### Track
- Validation pass/fail rate
- Common failure patterns
- Retry success rate
- Average validation duration
- Token usage per validation

### Improvements
System learns from failures to:
- Improve detection patterns
- Enhance fix suggestions
- Optimize validation speed
- Reduce false positives

## Emergency Overrides

### Force Completion
User can force completion with:
```
[FORCE COMPLETE]
Reason: [Why validation should be bypassed]
[/FORCE COMPLETE]
```

### Skip Gate
User can skip specific gate:
```
[SKIP GATE]
Gate: [Gate number/name]
Reason: [Why gate should be skipped]
[/SKIP GATE]
```

## Version History

- v1.0: Initial 7-BMAD validation system
- Auto-spawning validation agent
- Integration with code-review-expert
- Token optimization via skill compression
