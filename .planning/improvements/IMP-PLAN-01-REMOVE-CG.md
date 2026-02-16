# IMPROVEMENT-01: Remove CodeGraphContext (CG) from Commands

## Priority
**HIGH** - Remove deprecated CG server references from all GSI commands

## Overview
CodeGraphContext (CG) has been removed from the GSI architecture. This task removes all remaining CG references from commands, workflows, and documentation.

## Research Required

### Domain Research
1. **CG Removal Impact**
   - Identify all commands using CG tools
   - Understand CG tool usage patterns
   - Analyze dependencies on CG functionality

2. **Replacement Strategies**
   - Identify CodeIndex (CI) replacements for CG queries
   - Identify DesktopCommander (DC) replacements for CG operations
   - Document migration patterns

### Technical Research
1. **CG Tool Mapping**
   - `mcp__codegraphcontext__query` → `mcp__code-index-mcp__search_code_advanced`
   - `mcp__codegraphcontext__find_path` → `mcp__code-index-mcp__get_symbol_body`
   - `mcp__codegraphcontext__suggest_refactor` → Manual analysis

2. **Affected Files**
   - All 26 gsi: commands
   - 30+ workflow definitions
   - 12 agent definitions
   - Documentation files

## Implementation Tasks

### Sub-task 1: Command Cleanup
- [ ] Search for all CG tool references in commands/
  - Grep for "codegraphcontext" or "CG" or "cg"
  - Document each usage
  - Determine replacement strategy
  
- [ ] Replace CG tools with CI/DC equivalents
  - Replace query with search_code_advanced
  - Replace find_path with get_symbol_body
  - Remove suggest_refactor (no direct replacement)
  
- [ ] Update command allowed-tools lists
  - Remove CG from allowed-tools
  - Add CI/DC if not present
  - Test command functionality

### Sub-task 2: Workflow Cleanup
- [ ] Search for CG references in workflows/
  - Document workflow usage
  - Map replacements
  
- [ ] Update workflow definitions
  - Replace CG tool calls
  - Update workflow descriptions
  - Remove CG from golden patterns

### Sub-task 3: Documentation Updates
- [ ] Update ROADMAP.md
  - Remove CG from architecture description
  - Update "2-server architecture" references
  
- [ ] Update README.md
  - Remove CG from MCP servers section
  - Update feature descriptions
  
- [ ] Update any CG references in docs/
  - Search all .md files
  - Remove or update references

### Sub-task 4: Verification
- [ ] Test all commands after CG removal
  - Run each gsi: command
  - Verify no CG errors
  - Confirm functionality preserved
  
- [ ] Search for remaining CG references
  - Comprehensive grep search
  - Manual verification
  - Update any stragglers

## Verification Criteria
- [ ] Zero "codegraphcontext" references in codebase
- [ ] All commands work without CG
- [ ] Documentation updated consistently
- [ ] No broken functionality from CG removal

## Files to Modify
- commands/*.js (all 26 commands)
- workflows/*.md (30+ workflows)
- .planning/ROADMAP.md
- README.md
- Any docs/**/*.md files with CG references

## Success Metrics
- CG references: 0
- All commands pass validation
- No functionality regressions
