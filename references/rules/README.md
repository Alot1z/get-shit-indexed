# Global Rules Index

## ⛔ MCP TOOL ENFORCEMENT ACTIVE

**Native tools (Bash, Read, Write, Edit, Grep, Glob) are BLOCKED when MCP alternatives exist.**

All GSI commands have been updated to remove `Bash` from `allowed-tools`. Use MCP tools instead:

| Use This | Not This |
|----------|----------|
| `mcp__desktop-commander__read_file` | `Read` |
| `mcp__desktop-commander__write_file` | `Write` |
| `mcp__desktop-commander__edit_block` | `Edit` |
| `mcp__desktop-commander__list_directory` | `Bash ls` |
| `mcp__desktop-commander__start_process` | `Bash` |
| `mcp__code-index-mcp__search_code_advanced` | `Grep` |
| `mcp__code-index-mcp__find_files` | `Glob` |

**Token savings: 80-90% per operation**

---

## Overview

This directory contains the global rules and configuration for all Claude agents. These rules are automatically loaded and enforced across all sessions.

## Core Rules Files

### 1. auto-validation.md
**Purpose**: Defines the automatic validation system that ensures all agent work meets 7-BMAD quality standards.

**Key Features**:
- Automatic validation spawning on agent completion
- 7-BMAD quality gates (Method, Mad, Model, Mode, Mod, Modd, Methodd)
- Automatic retry on validation failure
- Integration with code-review-expert skill
- Token optimization via skill compression

**When Used**: After every agent completion, automatically triggered.

### 2. tool-priority.md
**Purpose**: Enforces mandatory tool priority to maximize token efficiency.

**Key Features**:
- Priority order: Skills → DesktopCommander MCP → Other MCP → Native
- 80-90% token savings when using skills over native tools
- Comprehensive tool selection matrix
- Decision tree for tool selection
- Common mistakes and corrections

**When Used**: Every tool selection decision by every agent.

**Critical Rule**: NEVER use native tools when MCP/skill tools available!

### 3. code-review.md
**Purpose**: Defines integration rules for the code-review-expert skill.

**Key Features**:
- 5-criteria review framework
- Integration with auto-validation system
- DesktopCommander integration for file operations
- Find-skills integration for optimization discovery
- Severity levels and output templates

**When Used**: During validation gates, before commits, for PR reviews.

## 7-BMAD Quality Framework

All agent work is validated against the 7-BMAD circles:

1. **Method Circle** - Implementation correctness
2. **Mad Circle** - Integration completeness
3. **Model Circle** - Architecture alignment
4. **Mode Circle** - Pattern consistency
5. **Mod Circle** - Maintainability standards
6. **Modd Circle** - Extensibility verification
7. **Methodd Circle** - Documentation quality

## Tool Priority (CRITICAL)

### Mandatory Order
1. **Skills FIRST** - Pre-compressed, maximum efficiency
2. **DesktopCommander MCP SECOND** - High efficiency
3. **Other MCP Tools THIRD** - Medium efficiency
4. **Native Tools LAST** - Only as fallback

### Quick Reference
```javascript
// File Operations
skill: "desktop-commander"  // BEST - 80-90% token savings
mcp__desktop-commander__read_file  // GOOD - 50-70% token savings
Read  // BAD - baseline, 0% savings

// Code Review
skill: "code-review-expert"  // BEST - Compressed review
Manual review  // BAD - Expensive and error-prone

// Code Search
mcp__code-index-mcp__search_code_advanced  // GOOD - Indexed search
Grep  // BAD - Slow, unindexed
```

## Essential Skills

All agents should use these skills when applicable:

### Core Skills
- **code-review-expert**: Code quality validation (CRITICAL)
- **find-skills**: Skill discovery for optimization
- **desktop-commander**: All file operations (REQUIRED)
- **7-scared-circle-enhanced**: Cognitive enhancement

### Thinking Skills
- **sequential-thinking**: Multi-step problem decomposition
- **tractatus-thinking**: Logical structure analysis
- **debug-thinking**: Systematic debugging

### MCP Skills
- **code-index-mcp**: Fast code search and navigation
- **context7**: Library documentation retrieval
- **deepwiki**: GitHub repository knowledge

## Agent Requirements

### Mandatory Behaviors
1. **Auto-Validation**: All completions trigger automatic validation
2. **Tool Priority**: Always use highest priority tool available
3. **Skill Discovery**: Use find-skills to discover optimization opportunities
4. **DesktopCommander**: Use for all file/process operations
5. **Code Review**: All code changes must pass review

### Prohibited Behaviors
1. **Never** use native tools when MCP/skill available
2. **Never** bypass validation without explicit override
3. **Never** skip code review for production code
4. **Never** ignore token optimization opportunities

## Configuration

### Override Mechanisms

**Force Completion**:
```
[FORCE COMPLETE]
Reason: [Why validation should be bypassed]
[/FORCE COMPLETE]
```

**Skip Validation Gate**:
```
[SKIP GATE]
Gate: [Gate number/name]
Reason: [Why gate should be skipped]
[/SKIP GATE]
```

**Use Native Tool**:
```
{
  tool: "Native",
  reason: "MCP tool unavailable for specific feature X",
  expected_savings: "0 tokens (no alternative)"
}
```

## Metrics and Monitoring

### Key Metrics
- Validation pass/fail rate
- Tool priority compliance rate
- Token savings percentage
- Agent compliance rate
- Review success rate

### Goals
- 95%+ validation pass rate
- 95%+ skill usage where available
- 80%+ overall token savings
- 100% agent compliance

## Quick Reference

### I Need To...
```
Read/Write Files → skill: "desktop-commander"
Search Code → mcp__code-index-mcp__search_code_advanced
Review Code → skill: "code-review-expert"
Start Process → skill: "desktop-commander"
Think Through Problem → skill: "sequential-thinking"
Analyze Structure → skill: "tractatus-thinking"
Debug Issue → skill: "debug-thinking"
Get Library Docs → mcp__context7__get-library-docs
```

### Common Patterns
```
# File Operations
Use: skill "desktop-commander"
NOT: Read/Write/Edit (native tools)

# Code Review
Use: skill "code-review-expert"
NOT: Manual analysis

# Code Search
Use: mcp__code-index-mcp__search_code_advanced
NOT: Grep/Glob

# Thinking
Use: skill "sequential-thinking"
NOT: Unstructured reasoning
```

## Version History

- v1.0 (2025-02-06): Initial global rules system
  - Auto-validation system with 7-BMAD gates
  - Tool priority enforcement
  - Code review expert integration
  - DesktopCommander MCP integration
  - Token optimization framework

## Support

For questions or issues with these rules:
1. Check the specific rule file for detailed documentation
2. Review examples in the rule files
3. Check override mechanisms if needed
4. Update rules as patterns emerge (continuous improvement)

## Related Files

- **~/.claude/CLAUDE.md** - Main Claude configuration (updated with these rules)
- **~/.claude/get-shit-indexed/references/rules/** - This directory
- **~/.claude/skills/** - Available skills library

---

**Last Updated**: 2025-02-06
**Version**: 1.0
**Status**: Active
