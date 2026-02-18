# Phase 20-04b: Agent & Command Thinking Integration

## Objective
Integrate thinking phases into all GSI agent files and command files so thinking happens during agent execution and command invocation.

## Problem Analysis

**Current State:**
- 12 GSI agent files (agents/gsi-*.md) have no thinking integration
- 29 GSI command files (commands/gsi/*.md) have no thinking phases
- Only workflows have thinking phases (from Phase 20-05)
- Agents and commands execute without cognitive enhancement

**Root Cause:**
Phase 20-05 focused only on workflows. Agents and commands need similar integration.

## Tasks

### Task 1: Define Thinking Phase Template for Agents
```
<task>
Create reusable thinking phase template for agent files.

1. Create templates/agent-thinking.md
2. Define agent-specific thinking phases:
   - PRE_AGENT: Before agent execution (Tractatus for task understanding)
   - PRE_TOOL: Before each tool call (mode-based selection)
   - POST_TOOL: After tool call (Debug for learning)
   - POST_AGENT: After agent completion (reflection capture)
3. Add allowed-tools compatibility notes
4. Document integration pattern
</task>

<files>
templates/agent-thinking.md
</files>

<acceptance>
- Template created with all phase types
- Agent-specific guidance included
- Integration pattern documented
</acceptance>
```

### Task 2: Update GSI Executor Agent
```
<task>
Add thinking phases to gsi-executor agent.

1. Read agents/gsi-executor.md
2. Add PRE_AGENT thinking phase:
   - Tractatus for task structure analysis
   - Complexity prediction integration
3. Add PRE_TOOL thinking guidance
4. Add POST_AGENT reflection phase
5. Preserve existing agent structure
</task>

<files>
~/.claude/agents/gsi-executor.md
</files>

<acceptance>
- Executor agent has thinking phases
- Structure preserved
- Thinking integrated with existing workflow
</acceptance>
```

### Task 3: Update GSI Planner Agent
```
<task>
Add thinking phases to gsi-planner agent.

1. Read agents/gsi-planner.md
2. Add PRE_AGENT thinking:
   - Tractatus for plan structure
   - Sequential for task ordering
3. Add POST_AGENT reflection:
   - Debug for plan validation
   - Pattern learning integration
4. Test planning with thinking
</task>

<files>
~/.claude/agents/gsi-planner.md
</files>

<acceptance>
- Planner agent has thinking phases
- Planning quality improved
- Reflection captured
</acceptance>
```

### Task 4: Update All GSI Commands with Thinking
```
<task>
Add thinking phases to all GSI command files.

1. List all commands in commands/gsi/
2. Add thinking_phase section to each command:
   - /gsi:plan-phase → Tractatus (COMPREHENSIVE)
   - /gsi:execute-phase → Sequential (STANDARD)
   - /gsi:progress → Lightweight (LIGHTWEIGHT)
   - /gsi:help → None (NONE)
3. Add <thinking_requirements> to allowed-tools
4. Document thinking mode per command
</task>

<files>
commands/gsi/*.md (29 files)
</files>

<acceptance>
- All 29 commands have thinking phases
- Appropriate modes assigned
- Thinking requirements in allowed-tools
</acceptance>
```

### Task 5: Create Command Thinking Map
```
<task>
Create mapping document for command thinking modes.

1. Create .planning/codebase/COMMAND-THINKING-MAP.md
2. Document each command's thinking mode
3. Document thinking triggers per command
4. Add thinking timeout recommendations
5. Add cross-reference to command-thinking wrapper
</task>

<files>
.planning/codebase/COMMAND-THINKING-MAP.md
</files>

<acceptance>
- All commands mapped
- Thinking modes documented
- Cross-references created
</acceptance>
```

### Task 6: Test Agent & Command Thinking
```
<task>
Verify thinking works in agents and commands.

1. Run gsi-executor with simple task
2. Verify PRE_AGENT thinking triggered
3. Run /gsi:plan-phase command
4. Verify command thinking triggered
5. Check metrics in thinking-metrics.json
6. Document test results
</task>

<files>
.planning/phases/20-thinking-integration-completion/20-04b-VERIFICATION.md
</files>

<acceptance>
- Agent thinking verified
- Command thinking verified
- Metrics captured
- Test results documented
</acceptance>
```

## Verification

**Must Have:**
- [ ] Agent thinking template created
- [ ] Executor agent has thinking phases
- [ ] Planner agent has thinking phases
- [ ] All 29 commands have thinking phases
- [ ] Command thinking map created

## Estimated Duration
15-20 minutes (6 tasks with 29 command files)

## Dependencies
- Phase 20-02b (Thinking Orchestrator)
- Phase 20-04a (Command Thinking Wrapper)
