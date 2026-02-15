---
name: gsi:settings
description: Configure GSI workflow toggles and model profile
allowed-tools:
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
---

<objective>
Interactive configuration of GSI workflow agents and model profile via multi-question prompt.

Routes to the settings workflow which handles:
- Config existence ensuring
- Current settings reading and parsing
- Interactive 5-question prompt (model, research, plan_check, verifier, branching)
- Config merging and writing
- Confirmation display with quick command references
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/settings.md
</execution_context>

<process>
**Follow the settings workflow** from `@~/.claude/get-shit-indexed/workflows/settings.md`.

The workflow handles all logic including:
1. Config file creation with defaults if missing
2. Current config reading
3. Interactive settings presentation with pre-selection
4. Answer parsing and config merging
5. File writing
6. Confirmation display
</process>
