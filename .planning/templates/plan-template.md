---
phase: XX-name
plan: NN
type: execute|tdd
wave: 1
depends_on: ["XX-NN"]
files_modified: ["path/to/file1", "path/to/file2"]
autonomous: true|false
user_setup: []

must_haves:
  truths:
    - "Key truth 1 about what this plan establishes"
    - "Key truth 2 supporting the plan's objective"
  artifacts:
    - path: "path/to/artifact.md"
      provides: "Description of what this artifact provides"
      min_lines: 50
  key_links:
    - from: "Component or workflow"
      to: "Another component or workflow"
      via: "integration mechanism"
      pattern: "reference pattern"

<tool_priority>
**Tool Selection Hierarchy (MANDATORY):**
1. Skills FIRST (pre-compressed, maximum efficiency)
2. Desktop Commander MCP SECOND (high efficiency)
3. Other MCP Tools THIRD (medium efficiency)
4. Native Tools LAST (fallback only)

**Quick Reference:**
- File ops -> mcp__desktop-commander__*
- Code search -> mcp__code-index-mcp__*
- Process ops -> mcp__desktop-commander__start_process

**See @.planning/codebase/TOOL-PRIORITY-RULES.md for detailed guidance**
</tool_priority>

---

<objective>
Concise description of what this plan accomplishes.

Purpose: Why this plan exists and what problem it solves
Output: What artifacts or changes this plan produces
</objective>

<execution_context>
@.planning/codebase/REFERENCE.md
@.planning/codebase/ARCHITECTURE.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

@.planning/codebase/RELEVANT-DOC.md
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Brief task name</name>
  <files>path/to/file1.md, path/to/file2.md</files>
  <action>Detailed action steps:

1. First step with specific MCP tool usage
2. Second step with verification criteria
3. Third step with completion check</action>
  <verify>Specific verification criteria</verify>
  <done>Clear done criteria statement</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task N: Human verification checkpoint</name>
  <files>path/to/verify.md</files>
  <action>Build something requiring human verification:

1. Create component/feature
2. Start development server
3. Prepare verification URL</action>
  <verify>Human verification required at URL</verify>
  <done>Feature built and ready for review</done>
</task>

<task type="checkpoint:decision">
  <name>Task N: Decision point</name>
  <files>path/to/options.md</files>
  <action>Present decision options to user:

1. Document Option A with pros/cons
2. Document Option B with pros/cons
3. Present for user selection</action>
  <verify>User decision required before proceeding</verify>
  <done>Options documented and presented</done>
</task>

<task type="auto" tdd="true">
  <name>Task N: Feature name (TDD)</name>
  <files>path/to/feature.ts, path/to/feature.test.ts</files>
  <behavior>Describe expected behavior for test:

The feature should:
- Validate input correctly
- Return expected output
- Handle edge cases</behavior>
  <implementation>Implementation guidance:

1. Create test describing expected behavior
2. Run test to confirm it fails (RED)
3. Implement minimal code to pass (GREEN)
4. Refactor if needed (REFACTOR)</implementation>
  <verify>Test passes, feature works as specified</verify>
  <done>Feature implemented with test coverage</done>
</task>

</tasks>

<verification>
1. All must_have artifacts exist and meet min_lines requirements
2. All key_links are valid and documented
3. All tool operations use MCP tools (not native)
4. Each task meets its verification criteria
5. Overall success criteria are met
</verification>

<success_criteria>
1. Clear success criterion 1
2. Clear success criterion 2
3. Clear success criterion 3
4. Tool priority maintained throughout (Skills > MCP > Native)
5. Token efficiency achieved (80-90% savings where applicable)
</success_criteria>

<output>
After completion, create `.planning/phases/XX-name/XX-NN-SUMMARY.md`
</output>
