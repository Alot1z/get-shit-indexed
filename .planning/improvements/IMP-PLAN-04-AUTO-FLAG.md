# IMPROVEMENT-04: Add --auto Flag for Automatic Approval

## Priority
**LOW** - Add automatic approval flag for faster workflow execution

## Overview
Add a `--auto` flag to GSI commands that automatically approves confirmations, enabling faster execution for trusted operations.

## Research Required

### Domain Research
1. **Auto-Approval Patterns**
   - Study how other CLIs handle auto-approval
   - Research --yes, --auto, --assume-yes patterns
   - Analyze security implications

2. **Confirmation UX**
   - Identify all confirmation prompts in GSI
   - Categorize by risk level
   - Determine which are safe for auto-approval

### Technical Research
1. **Flag Propagation**
   - Study argument passing in GSI commands
   - Research global flag handling
   - Investigate workflow-level flag support

2. **Risk Assessment**
   - Define safe vs risky operations
   - Create auto-approval whitelist
   - Document unsafe operations

## Implementation Tasks

### Sub-task 1: Flag Implementation
- [ ] Add --auto flag parser
  - Parse --auto, -a, --yes, -y
  - Support global flag for all commands
  - Support per-command override
  
- [ ] Create confirmation context
  ```javascript
  const confirmationContext = {
    auto: options.auto || false,
    command: commandName,
    operation: operationType,
    riskLevel: assessRisk(operationType)
  };
  ```

### Sub-task 2: Safe Operations List
- [ ] Define safe for auto-approval
  - gsi:progress (read-only)
  - gsi:help (read-only)
  - gsi:cache-stats (read-only)
  - gsi:plan-phase (planning, no changes)
  
- [ ] Define requires confirmation
  - gsi:execute-phase (makes changes)
  - gsi:complete-milestone (destructive)
  - gsi:remove-phase (destructive)
  - gsi:cache-clear (destructive)
  
- [ ] Create warning for mixed operations
  - Warn if --auto used with risky command
  - Require explicit --auto-override for destructive

### Sub-task 3: Integration
- [ ] Update all commands with confirmations
  - Check auto flag before prompting
  - Log auto-approved decisions
  - Show what was auto-approved
  
- [ ] Add --auto-dry-run flag
  - Show what would be auto-approved
  - Don't actually execute
  - Good for testing

### Sub-task 4: Documentation
- [ ] Document --auto flag behavior
  - Explain which operations are safe
  - Warn about risky operations
  - Provide examples
  
- [ ] Add safety notes
  ```markdown
  ## --auto Flag
  
  The --auto flag automatically confirms prompts for faster execution.
  
  **Safe operations** (always auto-approved with --auto):
  - gsi:progress, gsi:help, gsi:plan-phase
  
  **Requires explicit confirmation** (--auto ignored):
  - gsi:execute-phase, gsi:complete-milestone
  
  **Destructive operations** (always requires confirmation):
  - gsi:remove-phase, gsi:cache-clear
  ```

## Verification Criteria
- [ ] --auto works for safe operations
- [ ] --auto is ignored for destructive operations
- [ ] --auto-override enables auto for requires-confirmation
- [ ] Clear logging of auto-approved actions
- [ ] Documentation is clear and accurate

## Files to Modify
- All command files with confirmations
- commands/index.js (global flag handling)
- README.md (documentation)

## Success Metrics
- --auto saves time for repetitive operations
- No accidental destructive operations
- User satisfaction >4.0/5.0
