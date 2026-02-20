# Explorer Workflow

<tool_requirements>
**MANDATORY: Use MCP tools instead of native tools for all operations.**

**File Operations:**
- Use `mcp__desktop-commander__read_file` instead of Read
- Use `mcp__desktop-commander__write_file` instead of Write
- Use `mcp__desktop-commander__list_directory` instead of Bash ls

**Code Search:**
- Use `mcp__code-index-mcp__search_code_advanced` instead of Grep
- Use `mcp__code-index-mcp__find_files` instead of Glob
- Use `mcp__code-index-mcp__get_file_summary` for file analysis
- Use `mcp__code-index-mcp__get_symbol_body` for symbol extraction

**Code Graph:**
- Use `mcp__CodeGraphContext__add_code_to_graph` for code indexing
- Use `mcp__CodeGraphContext__analyze_code_relationships` for relationship analysis
- Use `mcp__CodeGraphContext__find_dead_code` for unused code detection

**Thinking Servers:**
- Use `mcp__sequential-thinking__sequentialthinking` for step-by-step analysis
- Use `mcp__tractatusthinking__tractatus_thinking` for structure analysis
- Use `mcp__debug-thinking__debug_thinking` for pattern storage
</tool_requirements>

<purpose>
Analyze GSI codebase for integration gaps, sub-optimal tool usage, and broken knowledge flow. Generate prioritized remediation roadmap.
</purpose>

<required_reading>
# Project Structure
@commands/gsi/explorer.md
@agents/gsi-gap-explorer.md

# Gap Patterns
@.planning/phases/49-gsi-architecture-overhaul/49-01-PLAN.md
</required_reading>

<process>

## Thinking Phase: Pre-Workflow

<server>tractatus</server>
<prompt>Analyze the explorer workflow structure for gap detection:
1. What are the key integration points to analyze?
2. What gap patterns are most critical?
3. What relationships need to be verified?
4. How do findings support remediation planning?</prompt>
<expected_output>Structured breakdown of gap detection components and priorities</expected_output>
<timeout>10000</timeout>
<integration>Use structure analysis to prioritize exploration areas</integration>

<step name="create_output_directory">
Create `.planning/gap-analysis/` directory structure.

### Thinking Phase: Pre-Step

<server>sequential</server>
<prompt>Plan output directory structure:
1. What reports are needed?
2. How should findings be organized?
3. What formats are required?</prompt>
<expected_output>Directory structure plan</expected_output>
<timeout>3000</timeout>

**Use DesktopCommander:**
- `create_directory` for `.planning/gap-analysis/`

**Output structure:**
```
.planning/gap-analysis/
  lib-gaps.md
  tool-usage-gaps.md
  knowledge-flow-gaps.md
  hook-gaps.md
  GAP-ANALYSIS-REPORT.md
  REMEDIATION-ROADMAP.md
  gap-analysis-context.cxml (optional)
```

### Thinking Phase: Post-Step

<server>debug</server>
<prompt>Remember directory structure for gap analysis:
1. What outputs are expected?
2. How do they relate to each other?
3. What aggregation is needed?</prompt>
<expected_output>Output structure patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="spawn_lib_explorer">
Spawn GSI-gap-explorer agent for lib/ module analysis.

### Thinking Phase: Pre-Step

<server>tractatus</server>
<prompt>Analyze lib/ exploration scope:
1. What modules should be checked?
2. What connections are expected?
3. What dead code might exist?</prompt>
<expected_output>Lib exploration focus areas</expected_output>
<timeout>3000</timeout>

**Spawn agent with focus:**
```
Task: GSI-gap-explorer
Focus: lib
Objective: Find disconnected modules, dead code, missing command entry points
Output: .planning/gap-analysis/lib-gaps.md
```

**Modules to analyze:**
- lib/thinking/
- lib/workflow-thinking/
- lib/prompt-enhancer/
- lib/complexity/
- lib/enhancement/
- lib/pattern-learning/
- lib/reflection/
- lib/gsi-integration/

### Thinking Phase: Post-Step

<server>debug</server>
<prompt>Store lib exploration approach:
1. What patterns to look for?
2. What connections matter?
3. What gaps are common?</prompt>
<expected_output>Lib exploration patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="spawn_tool_usage_explorer">
Spawn GSI-gap-explorer agent for tool usage analysis.

### Thinking Phase: Pre-Step

<server>sequential</server>
<prompt>Plan tool usage analysis:
1. What native tools are blocked?
2. Where should MCP tools be used?
3. What patterns indicate violations?</prompt>
<expected_output>Tool usage detection strategy</expected_output>
<timeout>3000</timeout>

**Spawn agent with focus:**
```
Task: GSI-gap-explorer
Focus: tools
Objective: Find native tool usage, missing MCP tools, violations
Output: .planning/gap-analysis/tool-usage-gaps.md
```

**Search patterns:**
- "Read|Write|Edit|Grep|Glob|Bash" in allowed-tools
- Missing DC/CI tools in command definitions
- Native tool references in agent files

### Thinking Phase: Post-Step

<server>debug</server>
<prompt>Store tool usage patterns:
1. What violations are common?
2. What MCP replacements work?
3. What token savings are possible?</prompt>
<expected_output>Tool usage patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="spawn_knowledge_flow_explorer">
Spawn GSI-gap-explorer agent for knowledge flow analysis.

### Thinking Phase: Pre-Step

<server>tractatus</server>
<prompt>Analyze knowledge flow architecture:
1. What modules should exchange data?
2. What chains should exist?
3. What insights might be lost?</prompt>
<expected_output>Knowledge flow architecture analysis</expected_output>
<timeout>3000</timeout>

**Spawn agent with focus:**
```
Task: GSI-gap-explorer
Focus: knowledge
Objective: Find broken reference chains, missing data exchanges
Output: .planning/gap-analysis/knowledge-flow-gaps.md
```

**Chains to verify:**
- pattern-learning -> complexity
- complexity -> prompt-enhancer
- reflection -> pattern-learning
- prompt-enhancer -> thinking

### Thinking Phase: Post-Step

<server>debug</server>
<prompt>Store knowledge flow patterns:
1. What connections are critical?
2. What data should flow?
3. What gaps break adaptation?</prompt>
<expected_output>Knowledge flow patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="spawn_hook_explorer">
Spawn GSI-gap-explorer agent for hook enforcement analysis.

### Thinking Phase: Pre-Step

<server>sequential</server>
<prompt>Plan hook analysis:
1. What hooks should exist?
2. What should they enforce?
3. What bypasses might exist?</prompt>
<expected_output>Hook analysis strategy</expected_output>
<timeout>3000</timeout>

**Spawn agent with focus:**
```
Task: GSI-gap-explorer
Focus: hooks
Objective: Find unregistered hooks, missing connections, enforcement gaps
Output: .planning/gap-analysis/hook-gaps.md
```

**Hooks to verify:**
- pre-tool-use/bash-redirect.js
- pre-tool-use/complexity-check.js
- pre-tool-use/prompt-enhancer.js
- pre-tool-use/thinking-invoke.js
- post-tool-use/reflection-capture.js

### Thinking Phase: Post-Step

<server>debug</server>
<prompt>Store hook enforcement patterns:
1. What should be enforced?
2. What connections are critical?
3. What gaps allow bypasses?</prompt>
<expected_output>Hook enforcement patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="aggregate_findings">
Collect confirmations from all explorer agents and aggregate.

### Thinking Phase: Pre-Step

<server>sequential</server>
<prompt>Plan aggregation:
1. What reports to collect?
2. How to prioritize findings?
3. What format for final report?</prompt>
<expected_output>Aggregation plan</expected_output>
<timeout>3000</timeout>

**Use DesktopCommander:**
- `read_multiple_files` to load all gap reports
- `write_file` to create aggregated report

**Expected inputs:**
- lib-gaps.md
- tool-usage-gaps.md
- knowledge-flow-gaps.md
- hook-gaps.md

### Thinking Phase: Post-Step

<server>debug</server>
<prompt>Store aggregation approach:
1. What priorities emerged?
2. What patterns are common?
3. What fixes are urgent?</prompt>
<expected_output>Aggregation patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="generate_gap_analysis_report">
Create comprehensive GAP-ANALYSIS-REPORT.md.

### Thinking Phase: Pre-Step

<server>tractatus</server>
<prompt>Structure the gap analysis report:
1. What sections are needed?
2. How to present priorities?
3. What actions to recommend?</prompt>
<expected_output>Report structure analysis</expected_output>
<timeout>3000</timeout>

**Report structure:**
```markdown
# GSI Gap Analysis Report

## Executive Summary
- Total gaps found: [count]
- Critical: [count]
- High: [count]
- Medium: [count]
- Low: [count]

## Gap Categories

### 1. lib/ Integration Gaps
[Summary from lib-gaps.md]

### 2. Tool Usage Gaps
[Summary from tool-usage-gaps.md]

### 3. Knowledge Flow Gaps
[Summary from knowledge-flow-gaps.md]

### 4. Hook Enforcement Gaps
[Summary from hook-gaps.md]

## Priority Matrix

| Priority | Count | Impact |
|----------|-------|--------|
| Critical | X | [description] |
| High | X | [description] |
| Medium | X | [description] |
| Low | X | [description] |

## Immediate Actions
1. [Critical fix 1]
2. [Critical fix 2]
3. [High priority fix 1]

## Remediation Roadmap
See: REMEDIATION-ROADMAP.md
```

### Thinking Phase: Post-Step

<server>debug</server>
<prompt>Store report generation approach:
1. What structure works?
2. How to present priorities?
3. What actions matter?</prompt>
<expected_output>Report patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="generate_remediation_roadmap">
Create REMEDIATION-ROADMAP.md with prioritized fixes.

### Thinking Phase: Pre-Step

<server>sequential</server>
<prompt>Plan remediation roadmap:
1. What fixes are urgent?
2. What dependencies exist?
3. What order minimizes risk?</prompt>
<expected_output>Remediation sequencing plan</expected_output>
<timeout>3000</timeout>

**Roadmap structure:**
```markdown
# Remediation Roadmap

## Phase 1: Critical Fixes (Immediate)
- [ ] Fix 1: [Description] - [File] - [Approach]
- [ ] Fix 2: [Description] - [File] - [Approach]

## Phase 2: High Priority (This Week)
- [ ] Fix 1: [Description]
- [ ] Fix 2: [Description]

## Phase 3: Medium Priority (This Sprint)
- [ ] Fix 1: [Description]
- [ ] Fix 2: [Description]

## Phase 4: Low Priority (Backlog)
- [ ] Fix 1: [Description]
- [ ] Fix 2: [Description]

## Dependencies
- Fix A must complete before Fix B
- Fix C is independent

## Estimated Impact
- Token savings: [estimate]
- Architecture improvement: [description]
- Risk reduction: [description]
```

### Thinking Phase: Post-Step

<server>debug</server>
<prompt>Store remediation patterns:
1. What sequencing works?
2. What dependencies matter?
3. What impacts are expected?</prompt>
<expected_output>Remediation patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="generate_cxml_output">
Generate CXML context file if --cxml flag provided.

### Thinking Phase: Pre-Step

<server>sequential</server>
<prompt>Plan CXML generation:
1. What files to include?
2. How to structure context?
3. What workflows consume this?</prompt>
<expected_output>CXML generation plan</expected_output>
<timeout>3000</timeout>

**Use DesktopCommander:**
```bash
start_process: "files-to-prompt --cxml .planning/gap-analysis/ > .planning/gap-analysis/gap-analysis-context.cxml"
```

**Output:**
- gap-analysis-context.cxml - Claude Code XML format for efficient context loading

### Thinking Phase: Post-Step

<server>debug</server>
<prompt>Store CXML patterns:
1. What format works?
2. What context is useful?
3. How do workflows consume it?</prompt>
<expected_output>CXML patterns stored</expected_output>
<timeout>2000</timeout>
</step>

<step name="update_state">
Update STATE.md with:
- Gap analysis completion
- Key findings summary
- Remediation phase reference
</step>

## Thinking Phase: Post-Workflow - Gap Analysis Complete

<server>tractatus</server>
<prompt>Comprehensive gap analysis reflection:
1. What is the overall integration health?
2. What are the critical gaps?
3. What remediation approach is best?
4. How can this support future analysis?</prompt>
<expected_output>Structural insights and remediation recommendations</expected_output>
<timeout>5000</timeout>
<integration>Update knowledge graph with gap patterns and remediation approaches</integration>

</process>

<completion_format>
When gap analysis completes successfully, return:

```markdown
## GAP ANALYSIS COMPLETE

**Report:** .planning/gap-analysis/GAP-ANALYSIS-REPORT.md

## Summary
- **Total Gaps Found:** X
- **Critical:** X
- **High:** X
- **Medium:** X
- **Low:** X

## By Category
- lib/ Integration: X gaps
- Tool Usage: X gaps
- Knowledge Flow: X gaps
- Hook Enforcement: X gaps

## Immediate Actions
1. [Critical action 1]
2. [Critical action 2]

## Output Artifacts
- `.planning/gap-analysis/GAP-ANALYSIS-REPORT.md`
- `.planning/gap-analysis/REMEDIATION-ROADMAP.md`
- `.planning/gap-analysis/gap-analysis-context.cxml` (if --cxml)

**Next Steps:**
- Review remediation roadmap
- Execute critical fixes
- Track gap closure
```

</completion_format>

<cxml_output_specification>

## CXML Format Support

When `--cxml` flag is provided, generate Claude Code XML format:

**Command:**
```bash
files-to-prompt --cxml .planning/gap-analysis/ > .planning/gap-analysis/gap-analysis-context.cxml
```

**Output Format:**
```xml
<documents>
  <document path=".planning/gap-analysis/GAP-ANALYSIS-REPORT.md">
    [content]
  </document>
  <document path=".planning/gap-analysis/lib-gaps.md">
    [content]
  </document>
  <document path=".planning/gap-analysis/tool-usage-gaps.md">
    [content]
  </document>
  <document path=".planning/gap-analysis/knowledge-flow-gaps.md">
    [content]
  </document>
  <document path=".planning/gap-analysis/hook-gaps.md">
    [content]
  </document>
  <document path=".planning/gap-analysis/REMEDIATION-ROADMAP.md">
    [content]
  </document>
</documents>
```

**Usage in Workflows:**
Workflows can load CXML context with:
```
@.planning/gap-analysis/gap-analysis-context.cxml
```

This provides efficient context loading for:
- Planning remediation phases
- Executing fixes
- Verifying gap closure

</cxml_output_specification>

<validation_considerations>

## Integration with Other Workflows

Gap analysis supports multiple workflows:

1. **Planning** - Identify what needs fixing, prioritize phases
2. **Execution** - Reference gap reports for fix implementation
3. **Verification** - Confirm gaps are closed
4. **Architecture Documentation** - Update with integration patterns

Keep gap analysis updated as architecture evolves.

## Quality Gates

Before gap analysis is complete:

- [ ] All 4 focus areas explored
- [ ] Reports follow templates
- [ ] Gaps classified by impact
- [ ] Remediation roadmap created
- [ ] Knowledge graph updated
- [ ] CXML output generated (if requested)

</validation_considerations>

---

**Version:** 1.0  
**Created:** 2026-02-19  
**Phase:** 49-01  
**Status:** Active
