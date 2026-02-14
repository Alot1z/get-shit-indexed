# Wave Configuration Tuning Guide

Guide for optimizing wave-based spawning parameters for different environments and use cases.

---

## Overview

Wave-based spawning prevents API rate limits by controlling:
- How many agents run concurrently (max_concurrent_agents)
- How quickly agents spawn (stagger_delay_ms)
- Delay between waves (inter_wave_delay_ms)
- How long to wait before giving up (wave_timeout_seconds)

---

## Tuning Scenarios

### Scenario 1: High-Performance Environment

**Use case:** Development machine with fast network, robust MCP servers

**Goal:** Maximize throughput without hitting rate limits

**Recommended configuration:**

```yaml
rate_limiting:
  enabled: true
  max_concurrent_agents: 5
  stagger_delay_ms: 200
  inter_wave_delay_ms: 1000
  wave_timeout_seconds: 300
  adaptive_rate_limiting: false
```

**Rationale:**
- 5 concurrent agents process work quickly
- 200ms stagger = 1 second total spread time (minimal delay)
- 1s between waves allows for rapid progression
- No adaptation needed - environment is stable

**Trade-offs:**
- Pro: Maximum speed
- Con: Higher API load (may hit limits on unstable connections)

---

### Scenario 2: Standard Development

**Use case:** Typical development on shared infrastructure

**Goal:** Balance speed with stability

**Recommended configuration:**

```yaml
rate_limiting:
  enabled: true
  max_concurrent_agents: 3
  stagger_delay_ms: 500
  inter_wave_delay_ms: 2000
  wave_timeout_seconds: 300
  adaptive_rate_limiting: true
```

**Rationale:**
- 3 concurrent agents - safe for most APIs
- 500ms stagger = spreads API calls moderately
- 2s between waves allows API recovery
- Adaptive behavior handles unexpected rate limits

**Trade-offs:**
- Pro: Balanced performance
- Con: Moderate latency (waiting between waves)

---

### Scenario 3: Rate-Limited API

**Use case:** External API with strict rate limits (e.g., 10 requests/minute)

**Goal:** Avoid hitting rate limits while maintaining progress

**Recommended configuration:**

```yaml
rate_limiting:
  enabled: true
  max_concurrent_agents: 2
  stagger_delay_ms: 1000
  inter_wave_delay_ms: 3000
  wave_timeout_seconds: 600
  adaptive_rate_limiting: true
```

**Rationale:**
- 2 concurrent agents - under typical rate limits
- 1s stagger - generous spacing between agent spawns
- 3s between waves - ensures API quota recovery
- 10min timeout - allows for slow operations
- Adaptation - auto-backs off on 429 errors

**Trade-offs:**
- Pro: Stays within rate limits
- Con: Slower overall execution

---

### Scenario 4: Unstable Network

**Use case:** Remote development, intermittent connectivity issues

**Goal:** Maximize reliability despite network issues

**Recommended configuration:**

```yaml
rate_limiting:
  enabled: true
  max_concurrent_agents: 1
  stagger_delay_ms: 2000
  inter_wave_delay_ms: 5000
  wave_timeout_seconds: 900
  adaptive_rate_limiting: true
```

**Rationale:**
- Single agent - no concurrent network stress
- 2s stagger - significant buffer between spawns
- 5s between waves - extended recovery time
- 15min timeout - accommodates slow networks
- Adaptation - backs off aggressively on errors

**Trade-offs:**
- Pro: Maximum reliability
- Con: Significantly slower execution

---

## Parameter Reference

### max_concurrent_agents

Controls how many agents run simultaneously within a wave.

| Value | Use Case | Description |
|--------|----------|-------------|
| 1 | Unstable network, strict rate limits | Single agent avoids all concurrency issues |
| 2 | Rate-limited APIs | Conservative parallelism |
| 3 | Standard development | Default safe setting |
| 4-5 | High-performance environments | Faster processing on robust infrastructure |

### stagger_delay_ms

Delay between agent spawns within a wave (in milliseconds).

| Value | Spread Time | Use Case |
|--------|-------------|-----------|
| 200 | High-performance | 1 second total for 5 agents |
| 500 | Standard | 2.5 seconds for 5 agents |
| 1000 | Rate-limited | 5 seconds for 5 agents |
| 2000 | Unstable | 10 seconds for 5 agents |

### inter_wave_delay_ms

Delay between waves (in milliseconds).

| Value | Use Case |
|--------|-----------|
| 1000 | High-performance | Quick wave progression |
| 2000 | Standard | Normal wave progression |
| 3000-5000 | Rate-limited | Extended API recovery |
| 5000+ | Unstable | Maximum recovery time |

### wave_timeout_seconds

Maximum wait time for a wave before marking as failed.

| Value | Use Case |
|--------|-----------|
| 300 | Standard | 5 minutes per wave |
| 600 | Long-running tasks | 10 minutes per wave |
| 900 | Unstable network | 15 minutes per wave |

### adaptive_rate_limiting

When enabled, automatically adjusts parameters on 429 errors.

| Value | Behavior |
|--------|----------|
| true | Auto-back off on rate limits, increase delays |
| false | Use fixed parameters, fail on repeated errors |

---

## Tuning Workflow

### 1. Start with Defaults

Begin with standard configuration:

```yaml
max_concurrent_agents: 3
stagger_delay_ms: 500
inter_wave_delay_ms: 2000
wave_timeout_seconds: 300
adaptive_rate_limiting: true
```

### 2. Monitor Execution

Run wave execution and monitor:

- Wave completion times
- 429 error frequency
- Agent success rate

```bash
node ~/.claude/get-shit-indexed/bin/wave-health.js
```

### 3. Adjust Based on Results

| Observation | Adjustment |
|-----------|------------|
| Frequent 429 errors | Decrease max_concurrent_agents, increase stagger_delay_ms |
| All waves complete quickly | Increase max_concurrent_agents, decrease stagger_delay_ms |
| Network timeouts | Increase wave_timeout_seconds, enable adaptive_rate_limiting |
| Consistent failures | Check MCP server status, reduce max_concurrent_agents to 1 |

### 4. Test New Configuration

Validate tuning with test wave:

```bash
node ~/.claude/get-shit-indexed/bin/test-wave-spawning.js
```

---

## Environment-Specific Presets

### Local Development (robust)

```yaml
max_concurrent_agents: 4
stagger_delay_ms: 300
inter_wave_delay_ms: 1000
wave_timeout_seconds: 300
adaptive_rate_limiting: false
```

### CI/CD Environment

```yaml
max_concurrent_agents: 2
stagger_delay_ms: 1000
inter_wave_delay_ms: 3000
wave_timeout_seconds: 600
adaptive_rate_limiting: true
```

### Remote Development (unstable)

```yaml
max_concurrent_agents: 1
stagger_delay_ms: 2000
inter_wave_delay_ms: 5000
wave_timeout_seconds: 900
adaptive_rate_limiting: true
```

---

## Verification

After tuning, verify:

1. Run test wave spawning
2. Check wave-health.js output
3. Monitor for 429 errors in wave-history.json
4. Adjust parameters iteratively

---

## Common Issues

### Issue: Waves Not Completing

**Symptoms:** Waves timeout or agents hang indefinitely

**Diagnosis:**
```bash
# Check wave history
cat .planning/wave-history.json | grep "status.*failed"
```

**Solutions:**
1. Increase wave_timeout_seconds
2. Reduce task complexity per agent
3. Check MCP server connectivity
4. Review agent prompts for complexity

### Issue: Slow Execution

**Symptoms:** Waves complete but overall time is excessive

**Diagnosis:**
```bash
# Calculate average wave duration
node ~/.claude/get-shit-indexed/bin/wave-health.js --show-stats
```

**Solutions:**
1. Increase max_concurrent_agents
2. Decrease inter_wave_delay_ms
3. Reduce task complexity per agent
4. Use faster model profiles

---

## Decision Tree

```
Start
  |
  v
Are you experiencing issues?
  |
  v
Check wave-health.js output
  |
  +--< 429 errors? ----> Yes ----> Reduce concurrency, increase stagger
  |                                      |
  |                                      No
  |                                       |
  |                                 +--< Waves timing out? ----> Yes ----> Increase timeout
  |                                      |
  |                                      No
  |                                       |
  |                                    +--< All waves complete? ----> Yes ----> Increase concurrency
  |                                      |
  |                                      No
  |                                       |
  +---------------------------------------+
  |
  v
Optimal configuration found
```

---

## Configuration Template

Copy this template to `.planning/config.json`:

```json
{
  "rate_limiting": {
    "enabled": true,
    "max_concurrent_agents": 3,
    "stagger_delay_ms": 500,
    "inter_wave_delay_ms": 2000,
    "wave_timeout_seconds": 300,
    "adaptive_rate_limiting": true
  }
}
```

---

## See Also

- `@get-shit-indexed/references/wave-verification.md` - Wave verification documentation
- `@.planning/config.json` - Configuration storage
- `bin/wave-health.js` - Health monitoring script
- `bin/test-wave-spawning.js` - Wave testing script

---

*Generated for GSI Phase 8 - Advanced Workflow Features*