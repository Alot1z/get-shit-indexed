# Integration Analysis Template

Template for analyzing integration points and debugging connection issues between components.

**Purpose:** Systematically investigate integration problems using Debug-thinking and Sequential thinking patterns.

---

## File Template

```markdown
# Integration Analysis

**Analysis Date:** [YYYY-MM-DD]
**Integration Point:** [What's being integrated]
**Status:** [Investigating | Debugging | Resolved]

## Mad Circle Thinking Pattern

Since integration is a Mad Circle task, combine Debug-thinking and Sequential thinking:

**Debug-thinking for Problem Mapping:**
1. Create integration graph
2. Map dependencies
3. Trace data flow
4. Isolate failure points

**Sequential for Step-by-Step Investigation:**
1. Identify scope
2. Map components
3. Test hypotheses
4. Document findings

## Integration Graph

**Component Relationships:**
```
[Component A] --[Relationship]--> [Component B]
[Component C] --[Relationship]--> [Component D]
[Component D] --[Relationship]--> [Component A]
```

**Data Flow Mapping:**
1. Input: [Source of data]
2. Processing: [How data transforms]
3. Output: [Destination of data]
4. Feedback: [Any return flow]

## Debug Investigation

**Issue Identified:** [Specific integration problem]

### Hypothesis Testing

| Hypothesis | Test Method | Expected Result | Actual Result | Status |
|------------|-------------|-----------------|---------------|--------|
| [Hypothesis 1] | [Test approach] | [Expected outcome] | [What actually happened] | [PASS/FAIL] |
| [Hypothesis 2] | [Test approach] | [Expected outcome] | [What actually happened] | [PASS/FAIL] |
| [Hypothesis 3] | [Test approach] | [Expected outcome] | [What actually happened] | [PASS/FAIL] |

### Root Cause Analysis

**Primary Issue:** [Root cause identified]
**Contributing Factors:** [List of related issues]

**Debug Graph:**
- Node 1: [Component/step where issue occurs]
- Node 2: [Upstream component/step]
- Node 3: [Downstream component/step]
- Edge 1-2: [Data flow/dependency]
- Edge 2-3: [Data flow/dependency]
- Failure point: [Where it breaks]

## Sequential Resolution Plan

### Step 1: Scope Definition
- Integration boundaries: [What connects to what]
- Expected behavior: [How it should work]
- Error conditions: [What should happen when it fails]

### Step 2: Investigation Plan
- Check connectivity: [Network, API, service status]
- Verify configuration: [Settings, environment variables]
- Test data integrity: [Schema validation, format checks]
- Monitor performance: [Latency, timeouts, errors]

### Step 3: Execution
[Detailed steps taken to resolve]

### Step 4: Verification
[How resolution was tested and confirmed]

## Resolution

**Fix Applied:** [What was changed]
**Testing Results:** [Evidence fix works]
**Lessons Learned:** [What to avoid next time]

## Monitoring Plan

**Metrics to Track:**
- [Success rate]
- [Response time]
- [Error frequency]
- [Data consistency checks]

**Alert Thresholds:**
- [Critical: X errors per minute]
- [Warning: Y response time above Z ms]

## Related Components

**Dependent Services:**
- [Service 1] - [Impact if this integration fails]
- [Service 2] - [Impact if this integration fails]

**Upstream Dependencies:**
- [Component that feeds this integration]
- [Criticality level]

**Downstream Dependencies:**
- [Component that receives from this integration]
- [Criticality level]

---

*Integration analysis: [date]*
*Update when integration points change or issues are resolved*
```

## Usage Examples

### Example 1: API Integration Debug

```markdown
# Integration Analysis: External Payment API

## Integration Graph
```
Frontend --[POST /payment]--> Payment API --[Webhook]--> Our System
Order Service --[GET /order]--> Our System --[Confirm]--> Frontend
```

## Debug Investigation
**Issue:** Payment confirmation not arriving

### Hypotheses
1. API not sending webhooks → Test: Manual webhook trigger → PASS
2. Webhook endpoint rejecting requests → Test: Check logs → FAIL
3. Network connectivity issue → Test: Ping API server → PASS

### Root Cause
Webhook endpoint rejecting due to invalid signature in header

## Sequential Resolution
1. Verified webhook endpoint is accessible
2. Discovered signature verification failing
3. Updated signature validation logic
4. Tested with live webhook → SUCCESS
```

### Example 2: Database Integration Debug

```markdown
# Integration Analysis: Primary-Database Read Replicas

## Integration Graph
```
Application --[Read]--> Primary DB --[Replicate]--> Replica 1
Application --[Read]--> Primary DB --[Replicate]--> Replica 2
Application --[Read]--> Load Balancer --[Route]--> Primary/Replicas
```

## Debug Investigation
**Issue:** Replica lag causing stale reads

### Sequential Investigation
1. Measured replication lag: 5-10 seconds
2. Checked replication configuration
3. Identified high write volume causing lag
4. Implemented read routing strategy

## Resolution
- Set max lag threshold: 2 seconds
- Route reads to primary when replicas lag
- Monitor replication health continuously
```

## Best Practices

### Debug-thinking Patterns
1. **Map Before You Debug**: Always create the integration graph first
2. **Isolate Variables**: Test one component at a time
3. **Check Connectivity**: Network first, then configuration
4. **Track Changes**: Recent deployments often cause integration issues

### Sequential Patterns
1. **Start Broad**: General connectivity checks first
2. **Get Specific**: Narrow down to exact failure point
3. **Test Incrementally**: Fix one thing, verify before next
4. **Document Everything**: Track what was tried and what worked

### Common Integration Issues
- **Network connectivity**: Firewalls, proxies, DNS
- **Configuration mismatches**: Environment variables, settings
- **Version incompatibility**: API changes, library versions
- **Rate limiting**: Exceeding quotas, concurrent requests
- **Authentication**: Expired tokens, invalid credentials
- **Data format**: Schema changes, encoding issues

## Related Templates

- **Architecture.md**: For component structure overview
- **Codebase/Structure.md**: For physical file organization
- **Debug-Subagent-Prompt.md**: For systematic debugging
- **Verification-Report.md**: For testing resolution

---

*Template created: 2026-02-15*
*Integration Version: 1.0*

---

## Thinking Phase Integration

This template supports cognitive enhancement through thinking phases:

### Template Metadata

```yaml
---
thinking_required: true
thinking_servers:
  - debug
  - sequential
thinking_phases:
  - PRE_ANALYSIS
  - DURING_INVESTIGATION
  - POST_RESOLUTION
min_thinking_duration: 3000
max_thinking_duration: 8000
---
```

### Thinking Phase Markers

Add thinking phases at key points:

```markdown
<thinking_phase phase="PRE_ANALYSIS" server="tractatus" timeout="5000">
Before analyzing integration:
- Map component relationships
- Identify data flow patterns
- List potential failure points
</thinking_phase>

<thinking_phase phase="DURING_INVESTIGATION" server="debug" timeout="5000">
During hypothesis testing:
- Track each test result
- Store patterns in debug graph
- Build knowledge for future analysis
</thinking_phase>

<thinking_phase phase="POST_RESOLUTION" server="sequential" timeout="3000">
After resolution:
- Document what worked
- Identify improvement opportunities
- Update monitoring plan
</thinking_phase>
```

### Debug-Thinking Storage

Integration analyses are stored in the debug-thinking knowledge graph:

```
~/.debug-thinking-mcp/
├── problems/
│   └── integration-{component-hash}.json
├── solutions/
│   └── integration-fix-{hash}.json
└── observations.jsonl
```

### Query Past Integrations

```javascript
mcp__debug-thinking__debug_thinking({
  action: "query",
  queryType: "similar-problems",
  parameters: {
    pattern: "api integration payment",
    limit: 5
  }
})
```