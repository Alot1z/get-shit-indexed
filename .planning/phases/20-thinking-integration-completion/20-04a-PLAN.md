# Phase 20-04a: Command Thinking Wrapper

## Objective
Create a wrapper function that adds thinking to any command execution.

## Problem Analysis

**Current State:**
- 29 GSI commands have no thinking integration
- Commands execute without cognitive enhancement
- No pre/post thinking for command operations

**Solution:**
Create a withThinking wrapper that can be applied to any command.

## Tasks

### Task 1: Design Command Thinking Wrapper
```
<task>
Design the withThinking wrapper API.

1. Create lib/command-thinking/wrapper.js
2. Design API:
   - withThinking(commandFn, options)
   - Options: { mode, servers, timeout, skipBMAD }
3. Define wrapper behavior:
   - Pre-command thinking
   - Command execution with context
   - Post-command reflection
4. Add error handling
5. Document API
</task>

<files>
lib/command-thinking/wrapper.js
</files>

<acceptance>
- API designed and documented
- Options defined
- Error handling planned
</acceptance>
```

### Task 2: Implement withThinking Function
```
<task>
Implement the withThinking function.

1. Update lib/command-thinking/wrapper.js
2. Implement withThinking(commandFn, options):
   - Get thinking context from selector
   - Run pre-command thinking
   - Execute command with thinking context injected
   - Run post-command reflection
   - Return combined result
3. Add timing metrics
4. Add graceful degradation
5. Handle nested thinking (skip if already thinking)
</task>

<files>
lib/command-thinking/wrapper.js
</files>

<acceptance>
- withThinking works for any command
- Timing tracked
- Graceful degradation works
</acceptance>
```

### Task 3: Create Command Thinking Modes
```
<task>
Create thinking modes for different command types.

1. Create lib/command-thinking/modes.js
2. Define modes:
   - COMPREHENSIVE: All 3 servers, full BMAD
   - STANDARD: Sequential + Debug, partial BMAD
   - LIGHTWEIGHT: Sequential only, no BMAD
   - NONE: Skip thinking entirely
3. Map commands to modes:
   - plan-phase, discuss-phase → COMPREHENSIVE
   - execute-phase, execute-plan → STANDARD
   - progress, help → NONE
4. Add getModeForCommand(commandName)
5. Add mode configuration
</task>

<files>
lib/command-thinking/modes.js
</files>

<acceptance>
- All modes defined
- Command mapping complete
- getModeForCommand works
</acceptance>
```

### Task 4: Create Command Context Injector
```
<task>
Create context injector that adds thinking to command execution context.

1. Create lib/command-thinking/context-injector.js
2. Implement injectThinkingContext(context, thinkingResult):
   - Add thinking insights to context
   - Add BMAD recommendations
   - Add concerns/warnings
3. Implement extractThinkingContext(result):
   - Get thinking from result
   - Prepare for reflection
4. Add context validation
5. Export for wrapper use
</task>

<files>
lib/command-thinking/context-injector.js
</files>

<acceptance>
- Context injection works
- Extraction works
- Validation implemented
</acceptance>
```

### Task 5: Add Command Thinking Metrics
```
<task>
Add metrics specific to command thinking.

1. Create lib/command-thinking/metrics.js
2. Track per command:
   - Thinking duration
   - Thinking effectiveness
   - Reflection capture rate
3. Implement recordCommandThinking(commandName, metrics)
4. Implement getCommandMetrics(commandName)
5. Add to gsi progress command
6. Store in .planning/command-thinking-metrics.json
</task>

<files>
lib/command-thinking/metrics.js
.planning/command-thinking-metrics.json
</files>

<acceptance>
- Per-command metrics tracked
- Metrics queryable
- Integrated with progress
</acceptance>
```

### Task 6: Create Command Thinking Index
```
<task>
Create unified export for command thinking.

1. Create lib/command-thinking/index.js
2. Export:
   - withThinking
   - getModeForCommand
   - injectThinkingContext
   - getCommandMetrics
3. Re-export thinking orchestrator
4. Document usage
5. Add examples
</task>

<files>
lib/command-thinking/index.js
lib/command-thinking/README.md
</files>

<acceptance>
- Unified exports
- Documentation complete
- Examples provided
</acceptance>
```

## Verification

**Must Have:**
- [ ] withThinking wrapper works
- [ ] Command modes defined
- [ ] Context injection works
- [ ] Metrics tracked
- [ ] API documented

## Estimated Duration
10-12 minutes (6 tasks)

## Dependencies
- Phase 20-02b (Thinking Orchestrator)
