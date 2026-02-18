# Workflow Chainer

The Workflow Chainer module chains multiple GSI commands into unified workflows with automatic dependency resolution and parallel execution support.

## Overview

Workflows automate common GSI command sequences, enabling:

- **Automated sequences**: Run multiple commands in order
- **Checkpoint/rollback**: Save state and revert on failure
- **Parallel execution**: Run independent steps concurrently
- **Variable substitution**: Parameterize workflows with variables

## CLI Commands

### gsi workflow run

Run a workflow template.

```bash
gsi workflow run <template> [options]
```

**Arguments:**
- `<template>` - Name of the workflow template to run

**Options:**
- `--vars '{json}'` - Variables to substitute in the workflow (JSON format)
- `--yolo` - Enable YOLO mode (skip confirmations)
- `--failure-strategy <strategy>` - How to handle failures:
  - `stop-on-error` (default) - Stop immediately on error
  - `continue-on-error` - Continue with next step
  - `rollback-on-error` - Rollback to last checkpoint
- `--templates-dir <path>` - Custom templates directory
- `--state-dir <path>` - Custom state directory (default: `.planning`)

**Examples:**

```bash
# Run full development cycle for phase 01
gsi workflow run full-cycle --vars '{"phase": "01"}'

# Run quick fix with rollback on error
gsi workflow run quick-fix --vars '{"phase": "01.01"}' --failure-strategy rollback-on-error

# Run with YOLO mode
gsi workflow run full-cycle --vars '{"phase": "02"}' --yolo
```

### gsi workflow list

List available workflow templates.

```bash
gsi workflow list [options]
```

**Options:**
- `--templates-dir <path>` - Custom templates directory

**Example:**

```bash
gsi workflow list
```

**Output:**
```
Available workflow templates:
  - full-cycle: Research -> Plan -> Execute -> Verify
    Steps: 4, Checkpoint: after-each
  - quick-fix: Plan -> Execute -> Verify (skip research)
    Steps: 3, Checkpoint: before-execute
  - project-setup: Initialize new project with all phases
    Steps: 4, Checkpoint: after-phase
  - milestone-complete: Complete milestone and prepare next
    Steps: 4, Checkpoint: manual
```

### gsi workflow status

Show status of workflows (all or specific).

```bash
gsi workflow status [name] [options]
```

**Arguments:**
- `[name]` - Optional workflow name to show specific status

**Options:**
- `--state-dir <path>` - Custom state directory

**Examples:**

```bash
# Show all active workflows
gsi workflow status

# Show specific workflow status
gsi workflow status full-cycle
```

**Output:**
```
Workflow: full-cycle
Status: running
Started: 2025-02-18T10:30:00.000Z
Completed: 2
Pending: 2
Current: gsi:execute-phase
Last checkpoint: 2025-02-18T10:45:00.000Z
```

### gsi workflow pause

Pause a running workflow.

```bash
gsi workflow pause <name> [options]
```

**Arguments:**
- `<name>` - Name of the workflow to pause

**Options:**
- `--state-dir <path>` - Custom state directory

**Example:**

```bash
gsi workflow pause full-cycle
```

### gsi workflow resume

Resume a paused workflow.

```bash
gsi workflow resume <name> [options]
```

**Arguments:**
- `<name>` - Name of the workflow to resume

**Options:**
- `--state-dir <path>` - Custom state directory

**Example:**

```bash
gsi workflow resume full-cycle
```

### gsi workflow rollback

Rollback a workflow to the last checkpoint.

```bash
gsi workflow rollback <name> [options]
```

**Arguments:**
- `<name>` - Name of the workflow to rollback

**Options:**
- `--state-dir <path>` - Custom state directory

**Example:**

```bash
gsi workflow rollback full-cycle
```

## Built-in Templates

### full-cycle

Complete development cycle with all phases.

**Steps:**
1. `gsi:research-phase` - Research phase requirements
2. `gsi:plan-phase` - Create execution plan
3. `gsi:execute-phase` - Execute the plan
4. `gsi:verify-work` - Verify implementation

**Checkpoint:** After each step
**Rollback:** Enabled

**Use when:** Starting a new feature or significant change requiring full analysis.

### quick-fix

Fast fix cycle skipping the research phase.

**Steps:**
1. `gsi:plan-phase --skip-research` - Create plan (no research)
2. `gsi:execute-phase` - Execute the fix
3. `gsi:verify-work` - Verify the fix

**Checkpoint:** Before execute
**Rollback:** Enabled

**Use when:** Requirements are already known and you need a quick fix.

### project-setup

Initialize a new GSI-managed project.

**Steps:**
1. `gsi:new-project` - Initialize project structure
2. `gsi:map-codebase` - Analyze existing codebase
3. `gsi:add-phase "Foundation"` - Create first phase
4. `gsi:plan-phase 01` - Plan foundation phase

**Parallel Groups:**
- `status-check`: Runs `gsi:check-todos` and `gsi:progress` in parallel

**Checkpoint:** After each phase
**Rollback:** Disabled (new project)

**Use when:** Starting a new GSI-managed project.

### milestone-complete

Complete current milestone and prepare next.

**Steps:**
1. `gsi:audit-milestone` - Audit milestone completeness
2. `gsi:verify-work --all` - Verify all phases complete
3. `gsi:complete-milestone` - Archive current milestone
4. `gsi:new-milestone` - Create next milestone

**Checkpoint:** Manual only
**Rollback:** Enabled

**Use when:** Finishing a milestone and preparing for the next.

## Custom Templates

Create custom workflow templates in JSON format.

### Template Format

```json
{
  "name": "my-workflow",
  "description": "Description of what this workflow does",
  "chain": [
    {
      "command": "gsi:command-name",
      "args": "${variable}",
      "description": "Step description",
      "condition": "optional condition",
      "checkpoint": true
    }
  ],
  "parallel": [
    {
      "name": "parallel-group-name",
      "steps": [
        { "command": "gsi:command1" },
        { "command": "gsi:command2" }
      ]
    }
  ],
  "checkpoint": "after-each|after-phase|before-execute|manual",
  "rollback": true,
  "dependencies": {
    "gsi:command2": ["gsi:command1"]
  },
  "metadata": {
    "category": "custom",
    "estimated_duration": "1 hour",
    "use_case": "When to use this workflow"
  }
}
```

### Template Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Unique template identifier |
| `description` | string | Human-readable description |
| `chain` | array | Sequential steps to execute |
| `parallel` | array | Groups of parallel steps |
| `checkpoint` | string | Checkpoint strategy |
| `rollback` | boolean | Enable rollback on failure |
| `dependencies` | object | Step dependencies |
| `metadata` | object | Additional metadata |

### Step Properties

| Property | Type | Description |
|----------|------|-------------|
| `command` | string | GSI command to execute |
| `args` | string | Command arguments (supports variables) |
| `description` | string | Step description |
| `condition` | string | Optional execution condition |
| `checkpoint` | boolean | Force checkpoint after this step |

### Checkpoint Strategies

| Strategy | Description |
|----------|-------------|
| `after-each` | Create checkpoint after every step |
| `after-phase` | Create checkpoint after phase-related commands |
| `before-execute` | Create checkpoint before execute commands |
| `manual` | Only checkpoint steps marked with `checkpoint: true` |

### Variable Substitution

Use `${variable}` syntax in args to substitute variables passed via `--vars`:

```bash
gsi workflow run my-template --vars '{"phase": "01", "name": "feature-x"}'
```

In template:
```json
{
  "args": "${phase} --name ${name}"
}
```

### Custom Template Location

Store custom templates in:
- Default: `get-shit-indexed/workflow-templates/`
- Custom: Specified via `--templates-dir`

## Workflow State

Workflows maintain state in `.planning/workflow-state.json`:

```json
{
  "full-cycle": {
    "chain": "full-cycle",
    "variables": { "phase": "01" },
    "completed": ["gsi:research-phase", "gsi:plan-phase"],
    "current": "gsi:execute-phase",
    "pending": ["gsi:verify-work"],
    "checkpoint": {
      "timestamp": "2025-02-18T10:45:00.000Z",
      "filesChanged": [],
      "stateSnapshot": { ... }
    },
    "startTime": "2025-02-18T10:30:00.000Z",
    "status": "running"
  }
}
```

## API Usage

For programmatic use, import the WorkflowChainer class:

```javascript
import { WorkflowChainer } from 'get-shit-indexed/lib/workflow-modules/index.js';

const chainer = new WorkflowChainer('.planning');

// Run a workflow
const result = await chainer.run('full-cycle', { phase: '01' }, {
  failureStrategy: 'stop-on-error',
  yoloMode: false
});

console.log(result.success);
console.log(result.completedSteps);
console.log(result.duration);

// List templates
const templates = chainer.listTemplates();

// Create custom chain
chainer.createChain({
  name: 'custom',
  description: 'Custom workflow',
  chain: [...],
  checkpoint: 'after-each',
  rollback: true
});

// Pause/resume/rollback
await chainer.pause('full-cycle');
await chainer.resume('full-cycle');
await chainer.rollback('full-cycle');

// Get status
const status = chainer.getStatus('full-cycle');
```

## Error Handling

Workflows handle errors based on the failure strategy:

### stop-on-error (default)

Stops immediately when a step fails:

```
Step 1: SUCCESS
Step 2: FAILED
Workflow: STOPPED
```

### continue-on-error

Continues to next step on failure:

```
Step 1: SUCCESS
Step 2: FAILED (logged)
Step 3: SUCCESS
Workflow: COMPLETED (with errors)
```

### rollback-on-error

Rolls back to last checkpoint on failure:

```
Step 1: SUCCESS
Checkpoint saved
Step 2: FAILED
Rolling back to checkpoint...
Workflow: ROLLED BACK
```

## Best Practices

1. **Use appropriate checkpoints**: More checkpoints = more recovery options but slower execution
2. **Enable rollback for critical workflows**: Prevents partial state on failure
3. **Use variables for reusable templates**: Parameterize phase numbers, names, etc.
4. **Start with built-in templates**: They cover common use cases
5. **Test custom templates**: Run with `--failure-strategy continue-on-error` first

## Troubleshooting

### Workflow stuck in "running" state

```bash
# Pause and resume
gsi workflow pause <name>
gsi workflow resume <name>

# Or rollback and restart
gsi workflow rollback <name>
gsi workflow run <name> --vars '...'
```

### Checkpoint not found

Ensure the workflow was run with a checkpoint strategy other than `manual`, or that steps have `checkpoint: true` set.

### Template not found

Check template name and location:
```bash
gsi workflow list --templates-dir ./custom-templates
```

## See Also

- [Patch Manager](./patch-manager.md) - Backup/restore local modifications
- [Thinking Orchestrator](./thinking-orchestrator.md) - Coordinate thinking servers
- [Knowledge Base](./knowledge-base.md) - Extract patterns from work

---

# Pattern Discovery (Phase 38-03)

The Workflow Chainer includes automatic pattern discovery capabilities that analyze command history to identify reusable workflow patterns.

## Overview

Pattern Discovery enables:

- **Automatic pattern mining**: Discover common command sequences from history
- **Template generation**: Convert high-quality patterns into reusable templates
- **Smart recommendations**: Get context-aware workflow suggestions
- **Workflow optimization**: Identify opportunities to improve workflow efficiency
- **Usage analytics**: Understand how workflows are being used

## CLI Commands

### gsi workflow discover

Mine patterns from command history and generate templates.

```bash
gsi workflow discover [options]
```

**Options:**
- `--min-frequency N` - Minimum occurrences to consider a pattern (default: 2)
- `--min-quality N` - Minimum quality score to generate template (default: 50)
- `--min-success-rate N` - Minimum success rate (0.0-1.0, default: 0.5)
- `--min-length N` - Minimum pattern length (default: 2)
- `--max-length N` - Maximum pattern length (default: 10)
- `--state-dir <path>` - Custom state directory

**Example:**

```bash
# Discover patterns with default settings
gsi workflow discover

# Only generate templates for high-quality patterns
gsi workflow discover --min-quality 75 --min-frequency 5

# Discover shorter patterns
gsi workflow discover --min-length 2 --max-length 5
```

**Output:**
```
Mining patterns from command history...
Discovered 12 patterns
Generated 4 templates (quality >= 50)

Top patterns:
  - research-plan-execute: freq=8, success=87%, quality=78
  - plan-execute-verify: freq=15, success=93%, quality=85
  - quick-fix-cycle: freq=6, success=75%, quality=62
  - milestone-complete: freq=4, success=100%, quality=71
```

### gsi workflow recommend

Get workflow recommendations based on current context.

```bash
gsi workflow recommend [options]
```

**Options:**
- `--phase N` - Current phase number for context
- `--recent-commands cmd1,cmd2` - Recently executed commands
- `--goal "..."` - Current workflow goal
- `--state-dir <path>` - Custom state directory

**Example:**

```bash
# Get recommendations for current phase
gsi workflow recommend --phase 01

# Get recommendations based on recent work
gsi workflow recommend --recent-commands "gsi:plan-phase,gsi:execute-phase"

# Get recommendations for a specific goal
gsi workflow recommend --goal "complete milestone"
```

**Output:**
```
Found 3 recommendations:

1. plan-execute-verify (85% relevant)
   Continues from gsi:plan-phase with gsi:execute-phase -> gsi:verify-work
   Sequence: gsi:plan-phase -> gsi:execute-phase -> gsi:verify-work
   Suggested vars: {"phase": "01"}

2. full-cycle (72% relevant)
   Frequently used pattern for phase operations (15 times)
   Sequence: gsi:research-phase -> gsi:plan-phase -> gsi:execute-phase -> gsi:verify-work
   Suggested vars: {"phase": "01"}

3. quick-fix (45% relevant)
   High-quality pattern with 93% success rate
   Sequence: gsi:plan-phase -> gsi:execute-phase -> gsi:verify-work
```

### gsi workflow optimize

Analyze a workflow for optimization opportunities.

```bash
gsi workflow optimize <name> [options]
```

**Arguments:**
- `<name>` - Name of the workflow to optimize

**Options:**
- `--state-dir <path>` - Custom state directory

**Example:**

```bash
gsi workflow optimize full-cycle
```

**Output:**
```
Optimization analysis for 'full-cycle':
Total optimizations found: 5
Estimated time savings: 45s

Parallel opportunities:
  - gsi:check-todos and gsi:progress can run in parallel
    Savings: 15s, Risk: low
  - gsi:research-phase and gsi:map-codebase can run in parallel
    Savings: 20s, Risk: low

Reorder suggestions:
  - Move fast step gsi:verify-references before slow step gsi:execute-phase
```

### gsi workflow analyze

Analyze all workflows and patterns with comprehensive statistics.

```bash
gsi workflow analyze [options]
```

**Options:**
- `--state-dir <path>` - Custom state directory

**Example:**

```bash
gsi workflow analyze
```

**Output:**
```
=== Workflow Analysis ===

Statistics:
  Total executions: 234
  Total sequences: 45
  Success rate: 89%
  Avg execution time: 12500ms
  Patterns discovered: 12

Most used commands:
  - gsi:plan-phase: 45 times
  - gsi:execute-phase: 42 times
  - gsi:verify-work: 38 times
  - gsi:research-phase: 28 times
  - gsi:progress: 25 times

Top patterns by quality:
  - full-cycle: quality=85, freq=15
  - quick-fix: quality=78, freq=8
  - milestone-complete: quality=71, freq=4

Optimization opportunities: 23
```

### gsi workflow export

Export a pattern as a reusable workflow template.

```bash
gsi workflow export <pattern-id> [options]
```

**Arguments:**
- `<pattern-id>` - ID of the pattern to export

**Options:**
- `--output <path>` - Output file path for the template
- `--state-dir <path>` - Custom state directory

**Example:**

```bash
# Export pattern to default location
gsi workflow export pattern-abc123

# Export to specific file
gsi workflow export pattern-abc123 --output ./my-workflow.json
```

**Output:**
```
Exported pattern 'pattern-abc123' as template 'research-plan-execute'
Template saved to: .planning/workflow-templates/discovered/research-plan-execute.json

Template JSON:
{
  "name": "research-plan-execute",
  "description": "Discovered pattern: gsi:research-phase -> gsi:plan-phase -> gsi:execute-phase",
  "chain": [...],
  "checkpoint": "after-phase",
  "rollback": true,
  "metadata": {
    "pattern_id": "pattern-abc123",
    "frequency": 8,
    "success_rate": 0.87,
    "quality_score": 78,
    "auto_generated": true
  }
}
```

## Pattern Quality Scoring

Patterns are scored on a 0-100 scale based on multiple factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Frequency | 25% | How often the pattern occurs (capped at 10) |
| Success Rate | 35% | Percentage of successful executions |
| Time Savings | 25% | Potential efficiency gains (capped at 1 minute) |
| Length | 15% | Pattern complexity (capped at 5 steps) |

### Quality Score Interpretation

| Score | Quality | Action |
|-------|---------|--------|
| 80-100 | Excellent | Highly recommended for automation |
| 60-79 | Good | Suitable for templates |
| 40-59 | Fair | Consider for manual workflows |
| 0-39 | Poor | Not recommended |

## Optimization Types

### Parallel Execution

Commands that don't depend on each other can run concurrently:

```
Before: cmd1 (10s) -> cmd2 (10s) -> cmd3 (5s) = 25s
After:  cmd1 (10s) + cmd2 (10s) -> cmd3 (5s) = 15s
Savings: 10s (40%)
```

**Risk Level:** Low (for independent commands)

### Skip Redundant Steps

Duplicate or unnecessary commands can be removed:

```
Before: cmd1 -> cmd2 -> cmd1 -> cmd3
After:  cmd1 -> cmd2 -> cmd3
```

**Risk Level:** Medium (verify command is truly redundant)

### Reorder Steps

Fast commands can be moved before slow ones:

```
Before: slow-cmd (30s) -> fast-cmd (2s)
After:  fast-cmd (2s) -> slow-cmd (30s)
Benefits: Earlier feedback, better UX
```

**Risk Level:** Medium (ensure no dependencies)

### Merge Steps

Similar commands can be combined:

```
Before: gsi:plan-phase 01 -> gsi:plan-phase 02
After:  gsi:plan-phases 01,02
```

**Risk Level:** High (requires command support)

## Data Storage

### workflow-history.json

Stores all tracked command executions and sequences:

```json
{
  "executions": [
    {
      "command": "gsi:plan-phase",
      "args": "01",
      "timestamp": "2025-02-18T10:30:00.000Z",
      "success": true,
      "duration": 5000
    }
  ],
  "sequences": [
    {
      "id": "seq-abc123",
      "commands": [...],
      "startTime": "2025-02-18T10:30:00.000Z",
      "endTime": "2025-02-18T10:45:00.000Z",
      "successRate": 1.0,
      "source": "workflow"
    }
  ],
  "patterns": [...],
  "stats": {...}
}
```

### workflow-templates/discovered/

Auto-generated templates from discovered patterns:

```
discovered/
├── README.md
├── .gitkeep
├── research-plan-execute.json
├── quick-fix-cycle.json
└── milestone-complete.json
```

## Programmatic API

```javascript
import { PatternMiner } from 'get-shit-indexed/lib/workflow-modules/pattern-miner.js';

const miner = new PatternMiner('.planning');

// Track command execution
miner.trackExecution({
  command: 'gsi:plan-phase',
  args: '01',
  timestamp: new Date().toISOString(),
  success: true,
  duration: 5000
});

// Track a sequence
const seqId = miner.startSequence('workflow');
miner.addToSequence(seqId, execution1);
miner.addToSequence(seqId, execution2);
miner.completeSequence(seqId);

// Mine patterns
const patterns = miner.minePatterns({
  minFrequency: 2,
  minSuccessRate: 0.5,
  minQuality: 50
});

// Get recommendations
const recommendations = miner.getRecommendations({
  currentPhase: '01',
  recentCommands: ['gsi:plan-phase'],
  workflowGoal: 'complete feature'
});

// Analyze optimizations
const optimizations = miner.analyzeOptimizations('full-cycle');

// Export pattern as template
const template = miner.generateTemplate('pattern-abc123');
miner.saveTemplate(template);
```

## Best Practices for Pattern Discovery

1. **Run discover regularly**: Keep patterns up-to-date with your workflow habits
2. **Set appropriate thresholds**: Use `--min-quality` to control template generation
3. **Review recommendations**: Don't blindly follow suggestions, verify context
4. **Export valuable patterns**: Save high-quality patterns before clearing history
5. **Monitor optimization**: Run `analyze` periodically to find efficiency opportunities

## Troubleshooting Pattern Discovery

### No patterns discovered

- Ensure you have command history (run some commands first)
- Lower `--min-frequency` threshold
- Lower `--min-quality` threshold

### Low quality patterns

- Increase `--min-frequency` to find more reliable patterns
- Increase `--min-success-rate` to filter out unreliable patterns
- Review execution history for failures

### Irrelevant recommendations

- Provide more context via `--phase`, `--recent-commands`, or `--goal`
- Clear old history that doesn't match current workflow patterns
- Run `discover` again after major workflow changes
