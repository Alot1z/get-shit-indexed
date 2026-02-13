---
name: GSI:help
description: Show available GSI commands and usage guide
allowed-tools:
  - mcp__desktop-commander__read_file
---
<objective>
Display the complete GSI command reference.

Output ONLY the reference content below. Do NOT add:
- Project-specific analysis
- Git status or file context
- Next-step suggestions
- Any commentary beyond the reference
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/help.md
</execution_context>

<process>
Output the complete GSI command reference from @~/.claude/get-shit-indexed/workflows/help.md.
Display the reference content directly — no additions or modifications.
</process>
