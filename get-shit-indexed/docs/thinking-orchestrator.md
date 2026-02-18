# Thinking Orchestrator Module

## Overview

The Thinking Orchestrator module coordinates MCP thinking servers (Sequential, Tractatus, Debug) based on `thinking_phase` configurations in GSI commands. It provides automatic complexity analysis, server selection, and timeout calculation for optimal thinking orchestration.

## Module Location

```
get-shit-indexed/lib/workflow-modules/thinking-orchestrator.ts
```

## Exports

### Types

```typescript
type ThinkingMode = 'NONE' | 'LIGHTWEIGHT' | 'STANDARD' | 'COMPREHENSIVE';
type ThinkingServer = 'sequential' | 'tractatus' | 'debug';

interface ThinkingPhaseConfig {
  mode: ThinkingMode;
  servers: ThinkingServer[];
  bmad_enabled: boolean;
  timeout: number;
  rationale: string;
}

interface ThinkingContext {
  command: string;
  description: string;
  objective?: string;
  process?: string;
  additionalContext?: Record<string, any>;
}

interface ThinkingResult {
  server: ThinkingServer;
  thoughts: ThinkingThought[];
  duration: number;
  success: boolean;
  error?: string;
}

interface ThinkingThought {
  thoughtNumber: number;
  totalThoughts: number;
  thought: string;
  nextThoughtNeeded: boolean;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
}

interface ComplexityFactor {
  name: string;
  score: number;
  description?: string;
}

interface ComplexityAnalysis {
  totalScore: number;
  mode: ThinkingMode;
  factors: ComplexityFactor[];
  breakdown: Record<string, number>;
}
```

### Class: ThinkingOrchestrator

```typescript
import { ThinkingOrchestrator } from 'get-shit-indexed';
```

## CLI Commands

### `gsi thinking analyze <command>`

Analyze a command's complexity and get recommended thinking configuration.

**Usage:**
```bash
gsi thinking analyze "execute-phase 20-01"
gsi thinking analyze "debug --complex"
gsi thinking analyze "plan-phase 21" --json
```

**Output:**
```json
{
  "complexity": 8,
  "mode": "STANDARD",
  "servers": ["sequential", "tractatus"],
  "bmad_enabled": true,
  "timeout": 7000,
  "rationale": "Planning task requiring step sequencing (Sequential) and structural analysis (Tractatus)"
}
```

### `gsi thinking config <command>`

Generate optimal thinking configuration for a command.

**Usage:**
```bash
gsi thinking config "execute-phase 20-01"
gsi thinking config "quick status" --profile quick
gsi thinking config "debug issue" --timeout 10000
```

**Options:**
- `--profile <name>` - Use specific profile (quick, standard, comprehensive)
- `--timeout <ms>` - Override calculated timeout
- `--bmad` - Enable BMAD integration
- `--no-bmad` - Disable BMAD integration

### `gsi thinking servers`

List available thinking servers and their status.

**Usage:**
```bash
gsi thinking servers
gsi thinking servers --json
```

**Output:**
```
Available Thinking Servers:
- sequential: mcp__sequential-thinking__sequentialthinking
- tractatus: mcp__tractatusthinking__tractatus_thinking
- debug: mcp__debug-thinking__debug_thinking
```

### `gsi thinking test`

Test connections to thinking servers.

**Usage:**
```bash
gsi thinking test
gsi thinking test --server sequential
gsi thinking test --timeout 5000
```

### `gsi thinking apply-all` (NEW)

Apply thinking_phase configurations to all GSI commands in a directory.

**Usage:**
```bash
gsi thinking apply-all
gsi thinking apply-all --dry-run
gsi thinking apply-all --force
gsi thinking apply-all --commands-dir ./commands/gsi
```

**Options:**
- `--commands-dir <path>` - Directory containing command files (default: `commands/gsi/`)
- `--backup-dir <path>` - Directory for backups (default: `.planning/thinking-backups/`)
- `--dry-run` - Show what would be changed without making changes
- `--force` - Overwrite existing thinking_phase configurations

**Output:**
```
=== Thinking Phase Apply-All Results ===

Mode: LIVE
Commands scanned: 30
Processed: 25
Updated: 20
Skipped (already had config): 5
Errors: 0

Changes:
  [ADDED] help.md: NONE (sequential)
  [ADDED] progress.md: LIGHTWEIGHT (sequential)
  [UPDATED] execute-phase.md: STANDARD (sequential, tractatus)
  [ADDED] debug.md: COMPREHENSIVE (sequential, tractatus, debug)

Backups saved to: .planning/thinking-backups/
```

### `gsi thinking validate` (NEW)

Validate thinking_phase configurations in command files.

**Usage:**
```bash
gsi thinking validate
gsi thinking validate --strict
gsi thinking validate --commands-dir ./commands/gsi
```

**Options:**
- `--commands-dir <path>` - Directory containing command files
- `--strict` - Treat warnings as errors

**Output:**
```
=== Thinking Phase Validation Results ===

Strict Mode: off
Files scanned: 30
Valid: 25
Invalid: 0
Missing: 5
With warnings: 3

Details:

  [MISSING] help.md
    WARNING: No thinking_phase configuration found

  [WARNING] execute-phase.md
    WARNING: Timeout seems low for STANDARD mode: 3000ms (expected ~5000ms)

✓ All validations passed
```

### `gsi thinking rollback` (NEW)

Rollback thinking_phase changes from the most recent backup.

**Usage:**
```bash
gsi thinking rollback
gsi thinking rollback --backup-dir ./backups
```

**Output:**
```
=== Thinking Phase Rollback Results ===

Backup timestamp: 2024-02-18T10:30:00.000Z
Restored: 20
Failed: 0

Files:
  ✓ help.md: restored
  ✓ progress.md: restored
  ✓ execute-phase.md: restored
```

### `gsi thinking factors` (NEW)

Show complexity factor documentation.

**Usage:**
```bash
gsi thinking factors
gsi thinking factors --json
```

**Output:**
```
=== Thinking Complexity Factors (25 total) ===

## Tool-Based Factors (10)
  - tool_count: Number of allowed tools (range: 0-15+)
  - execution_tools: Tools for executing commands (range: 0-6)
  - delegation: Task/subagent delegation tools (range: 0-3)
  ...

## Keyword-Based Factors (8)
  - debug_keywords: Debug/troubleshoot operation (range: 0-4)
  - analysis_keywords: Analysis/research operation (range: 0-3)
  ...

## Workflow Factors (4)
  - workflow_steps: Number of workflow steps (range: 0-5)
  - workflow_branching: Branching/conditional points (range: 0-3)
  ...

## Error Handling Factors (3)
  - error_recovery: Error handling points (range: 0-3)
  - validation_gates: Validation gates (range: 0-2)
  - rollback_capability: Rollback capability (range: 0-2)

=== Mode Thresholds ===

NONE: score 0-2
  Simple display commands, status checks
LIGHTWEIGHT: score 3-6
  Quick operations, single-step modifications
STANDARD: score 7-12
  Planning operations, multi-step workflows
COMPREHENSIVE: score 13-100
  Complex debugging, architecture design
```

## Complexity Algorithm (Enhanced - 25 Factors)

The complexity score is calculated based on 25 factors across 4 categories:

### Category 1: Tool-Based Factors (10 factors)

| Factor | Range | Description |
|--------|-------|-------------|
| `tool_count` | 0-15+ | Number of allowed tools |
| `execution_tools` | 0-6 | Tools for executing commands (Bash, start_process) |
| `delegation` | 0-3 | Task/subagent delegation tools |
| `web_integration` | 0-6 | Web/API integration tools |
| `file_modification` | 0-5 | File modification tools (Write, Edit) |
| `code_analysis` | 0-3 | Code analysis/indexing tools |
| `tool_combination` | 0-5 | Multiple tool categories combined |
| `mcp_dependency` | 0-3 | MCP server dependencies beyond 3 |
| `dc_comprehensive` | 0-2 | Comprehensive Desktop Commander usage |
| `parallel_potential` | 0-2 | High parallel execution potential |

### Category 2: Keyword-Based Factors (8 factors)

| Factor | Range | Description |
|--------|-------|-------------|
| `debug_keywords` | 0-4 | debug, troubleshoot, fix, resolve |
| `analysis_keywords` | 0-3 | analyze, research, investigate, explore |
| `planning_keywords` | 0-3 | plan, design, architect, structure |
| `integration_keywords` | 0-3 | integrate, migrate, refactor, transform |
| `verification_keywords` | 0-2 | verify, test, validate, check |
| `simplicity_keywords` | -3-0 | quick, simple, display, show (negative factor) |
| `critical_keywords` | 0-3 | critical, urgent, production, breaking |
| `multi_component` | 0-2 | Multi-component operation indicators |

### Category 3: Workflow Factors (4 factors)

| Factor | Range | Description |
|--------|-------|-------------|
| `workflow_steps` | 0-5 | Number of workflow steps (capped at 5) |
| `workflow_branching` | 0-3 | Branching/conditional logic points |
| `workflow_checkpoints` | 0-2 | Checkpoint/pause points |
| `workflow_parallel` | 0-2 | Parallel execution indicators |

### Category 4: Error Handling Factors (3 factors)

| Factor | Range | Description |
|--------|-------|-------------|
| `error_recovery` | 0-3 | Error handling patterns |
| `validation_gates` | 0-2 | Validation gate patterns |
| `rollback_capability` | 0-2 | Rollback capability indicators |

### Mode Thresholds

| Score Range | Mode | Max Thoughts | Description |
|-------------|------|--------------|-------------|
| 0-2 | NONE | 0 | Simple display commands |
| 3-6 | LIGHTWEIGHT | 3 | Quick operations |
| 7-12 | STANDARD | 5 | Multi-step workflows |
| 13+ | COMPREHENSIVE | 10 | Complex operations |

## Server Selection Logic

### Sequential Server (Always Selected)

The sequential thinking server is always included as it provides fundamental step planning.

### Tractatus Server (Conditional)

Selected when:
- Command contains: analyze, structure, architecture, design, plan, research
- Tools include: code-index-mcp

### Debug Server (Conditional)

Selected when:
- Command contains: debug, troubleshoot, fix, verify, test, resolve, investigate

## Thinking Templates

Templates are located in `templates/thinking/`:

### NONE.yaml
- **Use for:** Display commands, status checks
- **Complexity:** 0-2
- **Servers:** None
- **BMAD:** Disabled

### LIGHTWEIGHT.yaml
- **Use for:** Quick operations, simple modifications
- **Complexity:** 3-6
- **Servers:** sequential only
- **BMAD:** Disabled

### STANDARD.yaml
- **Use for:** Planning, execution, research
- **Complexity:** 7-12
- **Servers:** sequential, tractatus
- **BMAD:** Enabled

### COMPREHENSIVE.yaml
- **Use for:** Debugging, architecture, integration
- **Complexity:** 13+
- **Servers:** sequential, tractatus, debug
- **BMAD:** Enabled
- **Parallel Execution:** Enabled

## Thinking Profiles

### Quick Profile (`profiles/quick.json`)

```json
{
  "mode": "LIGHTWEIGHT",
  "servers": ["sequential"],
  "bmad_enabled": false,
  "maxThoughts": 3,
  "complexityThreshold": { "min": 3, "max": 6 }
}
```

**Use Cases:**
- Simple display operations
- Status checks
- Quick lookups
- Single-step operations

### Standard Profile (`profiles/standard.json`)

```json
{
  "mode": "STANDARD",
  "servers": ["sequential", "tractatus"],
  "bmad_enabled": true,
  "maxThoughts": 5,
  "complexityThreshold": { "min": 7, "max": 12 }
}
```

**Use Cases:**
- Planning operations
- Phase execution
- Code analysis
- Multi-step workflows

### Comprehensive Profile (`profiles/comprehensive.json`)

```json
{
  "mode": "COMPREHENSIVE",
  "servers": ["sequential", "tractatus", "debug"],
  "bmad_enabled": true,
  "maxThoughts": 10,
  "complexityThreshold": { "min": 13, "max": 100 }
}
```

**Use Cases:**
- Complex debugging
- Architecture design
- Multi-phase integration
- Critical path operations

## Usage Examples

### Programmatic Usage

```typescript
import { ThinkingOrchestrator } from 'get-shit-indexed';

const orchestrator = new ThinkingOrchestrator();

// Analyze a command with full complexity breakdown
const analysis = orchestrator.analyzeComplexity({
  description: 'Execute phase 20-01: Add thinking orchestrator',
  allowedTools: ['Read', 'Write', 'Edit', 'Bash'],
  process: '1. Read existing files\n2. Analyze structure\n3. Implement changes'
});

console.log(analysis);
// {
//   totalScore: 10,
//   mode: 'STANDARD',
//   factors: [...],
//   breakdown: { tools: 4, execution: 2, fileMod: 2, workflowSteps: 2 }
// }

// Get config for a command
const config = orchestrator.analyzeCommand({
  description: 'Execute phase 20-01: Add thinking orchestrator',
  allowedTools: ['Read', 'Write', 'Edit', 'Bash'],
  process: '1. Read existing files\n2. Analyze structure\n3. Implement changes'
});

// Generate frontmatter string
const frontmatter = orchestrator.generateFrontmatter(config);
console.log(frontmatter);

// Validate a config
const validation = orchestrator.validateConfig(config);
if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}

// Get factor documentation
const factors = orchestrator.getComplexityFactorDescriptions();
const thresholds = orchestrator.getModeThresholds();
```

### Integration with GSI Commands

```yaml
# In a GSI command frontmatter
---
thinking_phase:
  mode: STANDARD
  servers:
    - sequential
    - tractatus
  bmad_enabled: true
  timeout: 5000
  rationale: "Planning task requiring step sequencing and structural analysis"
---
```

## Timeout Calculation

Timeout is calculated based on mode and tool count:

```
baseTimeout = {
  NONE: 0,
  LIGHTWEIGHT: 2000,
  STANDARD: 5000,
  COMPREHENSIVE: 9000
}

calculated = baseTimeout[mode] + (toolCount * 500)
final = min(calculated, 15000)  // Cap at 15 seconds
```

## BMAD Integration

When `bmad_enabled` is true, the thinking orchestrator applies 7-BMAD methodology principles:

1. **Method Circle** - Implementation correctness checks
2. **Mad Circle** - Integration completeness verification
3. **Model Circle** - Architecture alignment validation
4. **Mode Circle** - Pattern consistency checks
5. **Mod Circle** - Maintainability standards
6. **Modd Circle** - Extensibility verification
7. **Methodd Circle** - Documentation quality

## Error Handling

The orchestrator handles errors gracefully:

- Server connection failures return partial results
- Individual server errors don't block other servers
- Errors are included in result objects for debugging

```typescript
const result = results.get('sequential');
if (!result.success) {
  console.error(`Sequential thinking failed: ${result.error}`);
}
```

## Batch Processing

### Auto-Application Workflow

1. **Scan** commands directory for `.md` files
2. **Parse** frontmatter and content
3. **Analyze** complexity using 25 factors
4. **Generate** optimal thinking_phase
5. **Backup** original files
6. **Apply** changes to frontmatter
7. **Report** all changes

### Backup Strategy

- Backups stored in `.planning/thinking-backups/`
- Filename format: `{original}.{timestamp}.bak`
- Metadata stored in `apply-all-{timestamp}.json`
- Supports rollback to previous state

## Version History

- **v1.24.0** - Enhanced complexity algorithm (25 factors)
  - Added tool combination analysis
  - Added workflow step analysis
  - Added error handling complexity
  - Added MCP server dependency analysis
  - Added apply-all command with batch processing
  - Added validate command
  - Added rollback command
  - Added factors documentation command
  - Added thinking templates (YAML)
  
- **v1.23.0** - Initial module extraction
  - Analyzed 28 commands with thinking configurations
  - Implemented complexity scoring algorithm (15 factors)
  - Added three thinking profiles (quick, standard, comprehensive)
