<thinking>auto</thinking>

<purpose>
Orchestrate parallel codebase mapper agents to analyze codebase and produce structured documents in .planning/codebase/

Each agent has fresh context, explores a specific focus area, and **writes documents directly**. The orchestrator only receives confirmation + line counts, then writes a summary.

Output: .planning/codebase/ folder with 7 structured documents about the codebase state.
</purpose>

<code_index_mcp>
desktop_commander:
  tools: ["list_directory", "read_file", "write_file", "start_process"]
  priority: 1
  rationale: "Primary workflow for file system operations - listing directories, reading/writing files, spawning subprocesses for agent tracking"
code_index:
  tools: ["find_files"]
  priority: 2
  rationale: "Secondary use for discovering specific file patterns in codebase (e.g., finding all test files)"
native:
  priority: 3
  rationale: "Fallback only - all operations use MCP tools for 80-90% token savings"
</code_index_mcp>

<philosophy>
**Why dedicated mapper agents:**
- Fresh context per domain (no token contamination)
- Agents write documents directly (no context transfer back to orchestrator)
- Orchestrator only summarizes what was created (minimal context usage)
- Faster execution (agents run simultaneously)

**Document quality over length:**
Include enough detail to be useful as reference. Prioritize practical examples (especially code patterns) over arbitrary brevity.

**Always include file paths:**
Documents are reference material for Claude when planning/executing. Always include actual file paths formatted with backticks: `src/services/user.ts`.
</philosophy>

<wave_architecture>
**Wave-based spawning for parallel agent orchestration**

**Purpose:** Enable safe concurrent agent execution without overwhelming MCP servers or hitting API rate limits

**Wave Structure:**

- **Wave 1:** Independent parallel agents (tech, arch, quality, concerns)
  - No dependencies between agents
  - Can run simultaneously within rate limits
  
- **Wave 2:** Dependent refinement agents (if Wave 1 incomplete)
  - Spawned only if Wave 1 agents need additional analysis
  - Typically 0-2 agents based on Wave 1 results
  
- **Wave 3:** Synthesis agents (cross-cutting analysis)
  - Combines results from previous waves
  - Final integration and verification

**Rate Limiting Parameters:**

```yaml
rate_limiting:
  enabled: true
  max_concurrent_agents: 3      # Maximum agents running simultaneously
  inter_wave_delay_ms: 2000        # Delay between waves
  stagger_delay_ms: 500            # Delay between agent spawns within a wave
  wave_timeout_seconds: 300         # Maximum wait time per wave
```

**Configuration Source:**
- Read from `.planning/config.json` -> `rate_limiting` section
- Fallback to defaults if config missing
- Log actual values used in wave execution

**Adaptive Behavior:**
- On 429/rate_limit errors: increase stagger_delay_ms by 2x
- Back off max_concurrent_agents by 1 on errors
- Max stagger: 5000ms, Min concurrent: 1
- Log all adaptations to wave-history.json
</wave_architecture>

<process>

<step name="init_context" priority="first">
Load codebase mapping context:

```bash
INIT=$(node ~/.claude/get-shit-done/bin/gsi-tools.js init map-codebase)
```

Extract from init JSON: `mapper_model`, `commit_docs`, `codebase_dir`, `existing_maps`, `has_maps`, `codebase_dir_exists`.
</step>

<step name="check_existing">
Check if .planning/codebase/ already exists using `has_maps` from init context.

If `codebase_dir_exists` is true:
```bash
ls -la .planning/codebase/
```

**If exists:**

```
.planning/codebase/ already exists with these documents:
[List files found]

What's next?
1. Refresh - Delete existing and remap codebase
2. Update - Keep existing, only update specific documents
3. Skip - Use existing codebase map as-is
```

Wait for user response.

If "Refresh": Delete .planning/codebase/, continue to create_structure
If "Update": Ask which documents to update, continue to spawn_agents (filtered)
If "Skip": Exit workflow

**If doesn't exist:**
Continue to create_structure.
</step>

<step name="create_structure">
Create .planning/codebase/ directory:

```bash
mkdir -p .planning/codebase
```

**Expected output files:**
- STACK.md (from tech mapper)
- INTEGRATIONS.md (from tech mapper)
- ARCHITECTURE.md (from arch mapper)
- STRUCTURE.md (from arch mapper)
- CONVENTIONS.md (from quality mapper)
- TESTING.md (from quality mapper)
- CONCERNS.md (from concerns mapper)

Continue to spawn_agents.
</step>

<step name="spawn_agents">
Spawn 4 parallel gsi-codebase-mapper agents using **wave-based execution** with rate limiting.

**Wave-Based Architecture:**

Agents are organized into waves to prevent overwhelming MCP servers and API rate limits:

- **Wave 1 (Independent agents):** Tech, Architecture, Quality, Concerns mappers
  - All 4 agents can run in parallel (no dependencies between them)
  - Maximum concurrent agents: 3 (rate limit protection)
  - Stagger delay: 500ms between each spawn

- **Wave 2 (Dependent agents):** Optional refinement agents
  - Only run if Wave 1 produces incomplete results
  - Depends on Wave 1 documents for context

- **Wave 3 (Synthesis agents):** Optional cross-cutting analysis
  - Analyzes relationships between Wave 1 documents
  - Depends on all Wave 1 and Wave 2 completions

**Rate Limiting Parameters:**

```json
{
  "rate_limiting": {
    "max_concurrent_agents": 3,
    "inter_wave_delay_ms": 2000,
    "stagger_delay_ms": 500,
    "wave_timeout_seconds": 300
  }
}
```

**Wave Execution Flow:**

1. **Pre-wave check:** Verify `.planning/agent-history.json` exists (see init_agent_tracking step)
2. **Generate agent IDs:** Create unique IDs for each agent: `{focus}-{datestamp}`
3. **Launch Wave 1:** Spawn agents with 500ms stagger delay
4. **Track each spawn:** Update agent-history.json with `status: "running"`
5. **Monitor Wave 1:** Wait for all agents in wave to complete
6. **Wave completion:** Report status before starting next wave
7. **Launch Wave 2:** If needed, after Wave 1 fully completes
8. **Continue** until all waves complete

**Agent ID Format:**

```
mapper-tech-20250211-192500
mapper-arch-20250211-192500
mapper-quality-20250211-192500
mapper-concerns-20250211-192500
```

**Tracking Operations:**

On spawn:
```bash
# Generate unique agent ID
AGENT_ID="mapper-${FOCUS}-$(date -u +%Y%m%d-%H%M%S)"

# Add to agent-history.json
node ~/.claude/get-shit-done/bin/gsi-tools.js track-agent "$AGENT_ID" "$FOCUS" "spawned"

# Write current agent ID for resumption
echo "$AGENT_ID" > .planning/current-agent-id.txt
```

On completion:
```bash
# Update agent status in history
node ~/.claude/get-shit-done/bin/gsi-tools.js track-agent "$AGENT_ID" "$FOCUS" "completed" --docs "$DOCUMENTS"

# Clean up current agent ID
rm -f .planning/current-agent-id.txt
```

Use Task tool with `subagent_type="gsi-codebase-mapper"`, `model="{mapper_model}"`, and `run_in_background=true` for parallel execution.

**CRITICAL:** Use the dedicated `gsi-codebase-mapper` agent, NOT `Explore`. The mapper agent writes documents directly.

**Agent 1: Tech Focus**

Task tool parameters:
```
subagent_type: "gsi-codebase-mapper"
model: "{mapper_model}"
run_in_background: true
description: "Map codebase tech stack"
```

Prompt:
```
Focus: tech

Analyze this codebase for technology stack and external integrations.

Write these documents to .planning/codebase/:
- STACK.md - Languages, runtime, frameworks, dependencies, configuration
- INTEGRATIONS.md - External APIs, databases, auth providers, webhooks

Explore thoroughly. Write documents directly using templates. Return confirmation only.
```

**Agent 2: Architecture Focus**

Task tool parameters:
```
subagent_type: "gsi-codebase-mapper"
model: "{mapper_model}"
run_in_background: true
description: "Map codebase architecture"
```

Prompt:
```
Focus: arch

Analyze this codebase architecture and directory structure.

Write these documents to .planning/codebase/:
- ARCHITECTURE.md - Pattern, layers, data flow, abstractions, entry points
- STRUCTURE.md - Directory layout, key locations, naming conventions

Explore thoroughly. Write documents directly using templates. Return confirmation only.
```

**Agent 3: Quality Focus**

Task tool parameters:
```
subagent_type: "gsi-codebase-mapper"
model: "{mapper_model}"
run_in_background: true
description: "Map codebase conventions"
```

Prompt:
```
Focus: quality

Analyze this codebase for coding conventions and testing patterns.

Write these documents to .planning/codebase/:
- CONVENTIONS.md - Code style, naming, patterns, error handling
- TESTING.md - Framework, structure, mocking, coverage

Explore thoroughly. Write documents directly using templates. Return confirmation only.
```

**Agent 4: Concerns Focus**

Task tool parameters:
```
subagent_type: "gsi-codebase-mapper"
model: "{mapper_model}"
run_in_background: true
description: "Map codebase concerns"
```

Prompt:
```
Focus: concerns

Analyze this codebase for technical debt, known issues, and areas of concern.

Write this document to .planning/codebase/:
- CONCERNS.md - Tech debt, bugs, security, performance, fragile areas

Explore thoroughly. Write document directly using template. Return confirmation only.
```

Continue to collect_confirmations.
</step>

<step name="init_agent_tracking">
Initialize agent tracking system.

**Create tracking file if not exists:**

```bash
# Check if agent-history.json exists
test -f .planning/agent-history.json || echo '{"agents":[]}' > .planning/agent-history.json
```

**Tracking data structure:**

```json
{
  "agents": [
    {
      "agent_id": "mapper-tech-20250211-192500",
      "task_description": "Map codebase tech stack",
      "focus": "tech",
      "phase": "02-workflow-integration",
      "plan": "02-02",
      "wave": 1,
      "status": "spawned",
      "spawn_time": "2025-02-11T19:25:00Z",
      "completion_time": null,
      "documents_created": ["STACK.md", "INTEGRATIONS.md"],
      "exit_status": null
    }
  ],
  "last_updated": "2025-02-11T19:25:00Z"
}
```

**Status values:**
- `spawned` - Agent created but not yet running
- `running` - Agent is actively working
- `completed` - Agent finished successfully
- `failed` - Agent encountered an error
- `timed_out` - Agent exceeded wave timeout

**Current agent tracking file:**

```bash
# Write current agent ID for resumption support
echo "mapper-tech-$(date -u +%Y%m%d-%H%M%S)" > .planning/current-agent-id.txt
```

Continue to spawn_agents.
</step>

<step name="collect_confirmations">
Wait for agents to complete using **wave-based collection**.

**Wave Completion Checking:**

For each wave, verify completion before starting the next wave:

```bash
# Check agent status for all agents in current wave
node ~/.claude/get-shit-done/bin/gsi-tools.js check-wave-complete --wave 1

# Expected output:
# Wave 1 Status:
# - mapper-tech-20250211-192500: completed
# - mapper-arch-20250211-192505: completed
# - mapper-quality-20250211-192510: completed
# - mapper-concerns-20250211-192515: completed
# 
# Wave 1 complete: 4/4 agents finished
```

**Wave Completion Criteria:**
- All agents in wave have status `completed` or `failed`
- No agents still `running` or `spawned`
- Wave timeout (300s) not exceeded

**Staggered Launch Timing:**

Agents are launched with 500ms delays between each spawn:

```bash
# Spawn Agent 1
spawn_agent "tech" && sleep 0.5

# Spawn Agent 2
spawn_agent "arch" && sleep 0.5

# Spawn Agent 3
spawn_agent "quality" && sleep 0.5

# Spawn Agent 4
spawn_agent "concerns"
```

This prevents overwhelming MCP servers with simultaneous requests.

**Wave Reporting Format:**

After each wave completes, report:

```
=== Wave 1 Complete ===

Agents spawned: 4
Completed: 4
Failed: 0
Duration: 2m 15s

Agent Results:
- mapper-tech-20250211-192500: SUCCESS (STACK.md: 145 lines, INTEGRATIONS.md: 89 lines)
- mapper-arch-20250211-192505: SUCCESS (ARCHITECTURE.md: 178 lines, STRUCTURE.md: 134 lines)
- mapper-quality-20250211-192510: SUCCESS (CONVENTIONS.md: 112 lines, TESTING.md: 98 lines)
- mapper-concerns-20250211-192515: SUCCESS (CONCERNS.md: 67 lines)

Wave 1 summary: 7 documents created, 823 total lines

Ready for Wave 2 (if needed)
```

**Read each agent's output file to collect confirmations.**

Expected confirmation format from each agent:**
```
## Mapping Complete

**Focus:** {focus}
**Documents written:**
- `.planning/codebase/{DOC1}.md` ({N} lines)
- `.planning/codebase/{DOC2}.md` ({N} lines)

Ready for orchestrator summary.
```

**What you receive:** Just file paths, line counts, and agent status. NOT document contents.

**Wave progression:**
- Wave 1 completes → Report results → Check if Wave 2 needed
- Wave 2 (if needed) → Launch → Report results
- All waves complete → Continue to verify_output

If any agent failed, note the failure and continue with successful documents.

**Handling Failed Agents:**

```bash
# Check for failed agents in wave
node ~/.claude/get-shit-done/bin/gsi-tools.js list-failed-agents --wave 1

# If any failed, offer retry option:
# "Agent mapper-quality-xxx failed. Retry? [y/N]"
```

Continue to verify_output.
</step>

<step name="verify_output">
Verify all documents created successfully:

```bash
ls -la .planning/codebase/
wc -l .planning/codebase/*.md
```

**Verification checklist:**
- All 7 documents exist
- No empty documents (each should have >20 lines)

If any documents missing or empty, note which agents may have failed.

Continue to scan_for_secrets.
</step>

<step name="scan_for_secrets">
**CRITICAL SECURITY CHECK:** Scan output files for accidentally leaked secrets before committing.

Run secret pattern detection:

```bash
# Check for common API key patterns in generated docs
grep -E '(sk-[a-zA-Z0-9]{20,}|sk_live_[a-zA-Z0-9]+|sk_test_[a-zA-Z0-9]+|ghp_[a-zA-Z0-9]{36}|gho_[a-zA-Z0-9]{36}|glpat-[a-zA-Z0-9_-]+|AKIA[A-Z0-9]{16}|xox[baprs]-[a-zA-Z0-9-]+|-----BEGIN.*PRIVATE KEY|eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.)' .planning/codebase/*.md 2>/dev/null && SECRETS_FOUND=true || SECRETS_FOUND=false
```

**If SECRETS_FOUND=true:**

```
⚠️  SECURITY ALERT: Potential secrets detected in codebase documents!

Found patterns that look like API keys or tokens in:
[show grep output]

This would expose credentials if committed.

**Action required:**
1. Review the flagged content above
2. If these are real secrets, they must be removed before committing
3. Consider adding sensitive files to Claude Code "Deny" permissions

Pausing before commit. Reply "safe to proceed" if the flagged content is not actually sensitive, or edit the files first.
```

Wait for user confirmation before continuing to commit_codebase_map.

**If SECRETS_FOUND=false:**

Continue to commit_codebase_map.
</step>

<step name="commit_codebase_map">
Commit the codebase map:

```bash
node ~/.claude/get-shit-done/bin/gsi-tools.js commit "docs: map existing codebase" --files .planning/codebase/*.md
```

Continue to offer_next.
</step>

<step name="offer_next">
Present completion summary and next steps.

**Get line counts:**
```bash
wc -l .planning/codebase/*.md
```

**Output format:**

```
Codebase mapping complete.

Created .planning/codebase/:
- STACK.md ([N] lines) - Technologies and dependencies
- ARCHITECTURE.md ([N] lines) - System design and patterns
- STRUCTURE.md ([N] lines) - Directory layout and organization
- CONVENTIONS.md ([N] lines) - Code style and patterns
- TESTING.md ([N] lines) - Test structure and practices
- INTEGRATIONS.md ([N] lines) - External services and APIs
- CONCERNS.md ([N] lines) - Technical debt and issues


---

## ▶ Next Up

**Initialize project** — use codebase context for planning

`/gsd:new-project`

<sub>`/clear` first → fresh context window</sub>

---

**Also available:**
- Re-run mapping: `/gsd:map-codebase`
- Review specific file: `cat .planning/codebase/STACK.md`
- Edit any document before proceeding

---
```

End workflow.
</step>

</process>

<success_criteria>
- .planning/codebase/ directory created
- 4 parallel gsi-codebase-mapper agents spawned with run_in_background=true
- Agents write documents directly (orchestrator doesn't receive document contents)
- Read agent output files to collect confirmations
- All 7 codebase documents exist
- Clear completion summary with line counts
- User offered clear next steps in GSD style
</success_criteria>
