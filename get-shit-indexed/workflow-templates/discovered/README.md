# Discovered Workflow Templates

This directory contains workflow templates that were automatically discovered from command history patterns.

## How Templates are Generated

1. **Usage Tracking**: The system tracks all GSI command executions and sequences
2. **Pattern Mining**: Common command sequences are identified and analyzed
3. **Scoring**: Patterns are scored based on:
   - Frequency (how often the sequence occurs)
   - Success rate (percentage of successful executions)
   - Time savings (potential efficiency gains)
   - Quality score (combined metric)
4. **Template Generation**: High-quality patterns are converted to reusable templates

## Template Format

Each template is a JSON file following the WorkflowChain format:

```json
{
  "name": "pattern-name",
  "description": "Discovered pattern: command sequence",
  "chain": [
    { "command": "gsi:command1", "args": "${phase}", "checkpoint": true },
    { "command": "gsi:command2", "args": "${phase}" }
  ],
  "checkpoint": "after-each",
  "rollback": true,
  "metadata": {
    "pattern_id": "pattern-abc123",
    "frequency": 10,
    "success_rate": 0.95,
    "quality_score": 85,
    "discovered_at": "2025-02-18T...",
    "auto_generated": true
  }
}
```

## Using Discovered Templates

```bash
# List all templates (including discovered)
gsi workflow list

# Run a discovered template
gsi workflow run discovered/pattern-name --vars '{"phase": "01"}'
```

## Managing Templates

```bash
# Discover new patterns
gsi workflow discover --min-frequency 2 --min-quality 50

# Get recommendations for current context
gsi workflow recommend

# Export a pattern as a template
gsi workflow export pattern-abc123
```

## Directory Structure

```
discovered/
├── README.md (this file)
├── .gitkeep
└── pattern-*.json (auto-generated templates)
```

## Notes

- Templates in this directory are auto-generated and may be overwritten during pattern discovery
- To preserve a discovered template, copy it to the parent `workflow-templates/` directory
- Quality scores range from 0-100, with higher scores indicating more reliable patterns
- Templates with success rates below 50% are not generated
