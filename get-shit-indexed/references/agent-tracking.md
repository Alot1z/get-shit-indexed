# Agent Tracking Reference

Documentation for agent tracking protocol used across GSI workflows for monitoring parallel agent execution and resume capability.

---

## JSON Schema

### agent-history.json

```json
{
  "version": "1.0",
  "max_entries": 50,
  "entries": [
    {
      "agent_id": "mapper-tech-20250213-110500",
      "task_description": "Map codebase technology stack",
      "phase": "08-advanced-workflow-features",
      "plan": "01",
      "segment": null,
      "timestamp": "2025-02-13T11:05:00Z",
      "status": "spawned",
      "completion_timestamp": null,
      "focus": "tech"
    }
  ]
}
```

### Schema Fields

| Field | Type | Description |
|-------|-------|-------------|
| `version` | string | Schema version for format changes |
| `max_entries` | number | Maximum number of entries to keep (oldest "completed" pruned first) |
| `entries` | array | Array of agent records |
| `agent_id` | string | Unique identifier in format `{focus}-{datestamp}` |
| `task_description` | string | Human-readable description of agent's task |
| `phase` | string | Phase identifier (e.g., "08-advanced-workflow-features") |
| `plan` | string | Plan identifier within phase (e.g., "01") |
| `segment` | number\|null | Segment number for segmented plans, null for full-plan agents |
| `timestamp` | string | ISO 8601 datetime when agent was spawned |
| `status` | string | Current status: "spawned", "running", "completed", "failed" |
| `completion_timestamp` | string\|null | ISO 8601 datetime when agent completed (null if not complete) |
| `focus` | string | Agent's focus area (tech, arch, quality, concerns, etc.) |

---

## Tracking Protocol

### On Spawn

```bash
# Generate unique agent ID
AGENT_ID="agent-${FOCUS}-$(date +%Y%m%d-%H%M%S)"

# Add to agent-history.json
node ~/.claude/get-shit-indexed/bin/GSI-tools.js track-agent "$AGENT_ID" "$DESCRIPTION" "$PHASE" "$PLAN" --status "spawned"

# Write current agent ID for resumption
echo "$AGENT_ID" > .planning/current-agent-id.txt
```

### On Completion

```bash
# Update agent status in history
node ~/.claude/get-shit-indexed/bin/GSI-tools.js track-agent "$AGENT_ID" "$DESCRIPTION" "$PHASE" "$PLAN" --status "completed" --completion-timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Clean up current agent ID
rm -f .planning/current-agent-id.txt
```

### On Failure

```bash
# Mark as failed
node ~/.claude/get-shit-indexed/bin/GSI-tools.js track-agent "$AGENT_ID" "$DESCRIPTION" "$PHASE" "$PLAN" --status "failed" --error "Error description"
```

---

## Interrupt Detection

On workflow startup, check for interrupted agents:

```bash
# Check if current-agent-id.txt exists from previous interrupted session
if [ -f .planning/current-agent-id ]; then
  INTERRUPTED_ID=$(cat .planning/current-agent-id.txt)
  echo "Found interrupted agent: $INTERRUPTED_ID"
  # Prompt: "Resume agent $INTERRUPTED_ID or start fresh?"
fi
```

---

## Pruning

When `entries.length` exceeds `max_entries`:

1. Sort entries by timestamp (oldest first)
2. Remove entries with `status: "completed"` (never remove "spawned" or "running")
3. Keep at most `max_entries` total entries
4. Preserve newest entries

---

## Usage Patterns

### Wave-based Spawning

Track multiple agents spawned in waves:

```json
{
  "agent_id": "mapper-tech-20250213-110500",
  "wave": 1,
  "status": "spawned"
}
```

### Segmented Plans

Track segment number for agents executing partial plans:

```json
{
  "agent_id": "executor-08-02-03",
  "segment": 2,
  "status": "spawned"
}
```

---

## File Locations

- **History**: `.planning/agent-history.json`
- **Current agent**: `.planning/current-agent-id.txt`

---

## Examples

### Example 1: Spawn tech mapper agent

```bash
# Spawn agent for technology stack analysis
AGENT_ID="mapper-tech-$(date +%Y%m%d-%H%M%S)"

# Add to history
node ~/.claude/get-shit-indexed/bin/GSI-tools.js track-agent "$AGENT_ID" "Map codebase tech stack" "08-advanced-workflow-features" "01" --status "spawned"

# Track current agent
echo "$AGENT_ID" > .planning/current-agent-id.txt
```

### Example 2: Agent completes

```bash
# Update status to completed
node ~/.claude/get-shit-indexed/bin/GSI-tools.js track-agent "$AGENT_ID" "Map codebase tech stack" "08-advanced-workflow-features" "01" --status "completed" --completion-timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Clean up
rm -f .planning/current-agent-id.txt
```

### Example 3: Resume interrupted agent

```bash
# Check for interrupted agent
if [ -f .planning/current-agent-id.txt ]; then
  INTERRUPTED_ID=$(cat .planning/current-agent-id.txt)
  
  # Resume with same agent ID
  # (use Task tool's resume parameter if available)
fi
```

---

*Generated for GSI Phase 8 - Advanced Workflow Features*