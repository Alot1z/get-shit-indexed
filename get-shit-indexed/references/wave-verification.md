# Wave Verification and Testing

Documentation for wave-based spawning system that prevents API rate limits through testing and validation.

---

## Wave Architecture

### Wave Structure

Agents are organized into waves to prevent overwhelming MCP servers and API rate limits:

**Wave 1: Independent parallel agents**
- No dependencies between agents
- Can run simultaneously within rate limits
- Example: Tech, Architecture, Quality, Concerns mappers

**Wave 2: Dependent refinement agents**
- Only run if Wave 1 produces incomplete results
- Depends on Wave 1 documents for context
- Typically 0-2 agents

**Wave 3: Synthesis agents**
- Combines results from previous waves
- Cross-cutting analysis and verification
- Depends on all Wave 1 and Wave 2 completions

### Rate Limiting Parameters

```yaml
rate_limiting:
  enabled: true
  max_concurrent_agents: 3      # Maximum agents running simultaneously
  inter_wave_delay_ms: 2000        # Delay between waves
  stagger_delay_ms: 500            # Delay between agent spawns within a wave
  wave_timeout_seconds: 300         # Maximum wait time per wave
```

### Configuration Source

Parameters are read from `.planning/config.json` under `rate_limiting` section.

Fallback defaults:
- max_concurrent_agents: 3
- stagger_delay_ms: 500
- inter_wave_delay_ms: 2000
- wave_timeout_seconds: 300

---

## Adaptive Rate Limiting

### Error Detection

When to adapt:

- **429 Too Many Requests** - API rate limit exceeded
- **429 Rate limit exceeded** - Rate limit message in error
- **Connection timeout** - API overwhelmed

### Adaptive Behavior

On rate limit errors:

1. **Increase stagger_delay_ms** by 2x (max: 5000ms)
2. **Back off max_concurrent_agents** by 1 (min: 1)
3. **Retry failed wave** after delay
4. **Log adaptation** to wave-history.json

### Adaptation Limits

- Maximum stagger: 5000ms
- Minimum concurrent: 1
- Max retries: 5 attempts

---

## Wave History Logging

### File Location

`.planning/wave-history.json`

### Schema

```json
{
  "version": "1.0",
  "waves": [
    {
      "wave_number": 1,
      "agents": ["agent-id-1", "agent-id-2", "agent-id-3"],
      "start_time": "2025-02-13T11:00:00Z",
      "end_time": "2025-02-13T11:02:30Z",
      "status": "complete",
      "errors": []
    }
  ]
}
```

### Fields

| Field | Type | Description |
|-------|-------|-------------|
| `wave_number` | number | Wave sequence (1, 2, 3, ...) |
| `agents` | array | List of agent IDs spawned in this wave |
| `start_time` | string | ISO 8601 datetime when wave started |
| `end_time` | string | ISO 8601 datetime when wave completed |
| `status` | string | "running", "complete", "failed" |
| `errors` | array | Error messages if any (empty if successful) |

---

## Verification Checklist

### Before Wave Execution

- [ ] Rate limiting configured in config.json
- [ ] Max concurrent agents set appropriately
- [ ] Stagger delay configured for API limits
- [ ] Wave timeout allows for full completion
- [ ] Agent-history.json initialized

### After Wave Execution

- [ ] All agents in wave completed successfully
- [ ] No 429 errors encountered
- [ ] Stagger delays were applied correctly
- [ ] Wave-history.json updated with results

---

## Testing Procedures

### Test Staggered Spawning

```bash
# Run wave with monitoring
node ~/.claude/get-shit-indexed/bin/GSI-tools.js test-wave-spawning \
  --max-concurrent 3 \
  --stagger-delay 500 \
  --wave-timeout 30
```

Expected results:
- Agents spawn with 500ms intervals
- No more than 3 agents running concurrently
- All agents complete within timeout

### Test Rate Limit Adaptation

```bash
# Simulate rate limit errors
node ~/.claude/get-shit-indexed/bin/GSI-tools.js test-wave-spawning \
  --simulate-rate-limit \
  --max-concurrent 3
```

Expected results:
- First wave hits rate limit
- Second wave backs off (reduced concurrency)
- Third wave succeeds with conservative settings

---

## Health Monitoring

### Wave Health Script

```bash
# Check wave execution health
node ~/.claude/get-shit-indexed/bin/wave-health.js
```

Health indicators:
- **Success rate** - Percentage of waves completing successfully
- **Average duration** - Time per wave completion
- **Error rate** - Frequency of 429/rate limit errors
- **Adaptation count** - Number of times rate limiting adapted

### Health Status Codes

| Status | Success Rate | Meaning |
|---------|--------------|---------|
| Healthy | >95% | Optimal configuration |
| Warning | 80-95% | Consider adjustments |
| Error | <80% | Needs attention |

---

## Configuration Tuning

### High-Speed Environments

For environments with robust API limits:

```yaml
rate_limiting:
  max_concurrent_agents: 5      # Increase parallelism
  stagger_delay_ms: 200            # Reduce stagger for speed
  inter_wave_delay_ms: 1000        # Faster wave progression
```

### Rate-Limited Environments

For APIs with strict rate limits:

```yaml
rate_limiting:
  max_concurrent_agents: 2      # Conservative parallelism
  stagger_delay_ms: 1000           # Longer stagger between spawns
  inter_wave_delay_ms: 3000        # Longer recovery between waves
  wave_timeout_seconds: 600         # Generous timeout
```

### Unstable Networks

```yaml
rate_limiting:
  max_concurrent_agents: 1      # Single agent at a time
  stagger_delay_ms: 2000           # Significant stagger
  inter_wave_delay_ms: 5000        # Extended recovery
  wave_timeout_seconds: 900         # Extended timeout
  adaptive_rate_limiting: true   # Enable auto-adaptation
```

---

## Decision Matrix

| Environment | max_concurrent | stagger_ms | inter_wave_ms | timeout | adaptive |
|-------------|----------------|--------------|---------------|----------|
| High-speed | 5 | 200 | 1000 | 300 | false |
| Standard | 3 | 500 | 2000 | 300 | false |
| Rate-limited | 2 | 1000 | 3000 | 600 | true |
| Unstable | 1 | 2000 | 5000 | 900 | true |

---

## Troubleshooting

### All Agents Failing

**Symptom:** Every agent in wave fails

**Possible causes:**
- MCP servers not running
- Network connectivity issues
- Invalid agent model
- Systemic configuration error

**Resolution:**
1. Check MCP server status
2. Verify model availability
3. Check agent-history.json for error patterns
4. Test with single agent first

### Wave Timeout

**Symptom:** Wave doesn't complete within timeout_seconds

**Possible causes:**
- Agents stuck on long-running tasks
- Insufficient timeout for task complexity
- Deadlock in agent dependencies

**Resolution:**
1. Increase wave_timeout_seconds in config
2. Break tasks into smaller units
3. Use segmented execution instead of full-plan

### Repeated 429 Errors

**Symptom:** Multiple waves hit rate limits

**Resolution:**
1. Reduce max_concurrent_agents
2. Increase stagger_delay_ms
3. Enable adaptive_rate_limiting
4. Check for API quota issues

---

## Integration Points

- `.planning/config.json` - Rate limiting configuration
- `.planning/wave-history.json` - Wave execution logs
- `.planning/agent-history.json` - Agent tracking
- `bin/wave-health.js` - Health monitoring script
- `bin/test-wave-spawning.js` - Wave testing script

---

*Generated for GSI Phase 8 - Advanced Workflow Features*