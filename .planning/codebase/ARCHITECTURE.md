# Architecture

**Analysis Date:** 2026-02-11

## Pattern Overview

**Overall:** Documentation and Workflow Management System

**Key Characteristics:**
- Markdown-based project organization
- Template-driven document generation
- Multi-agent coordination system
- Git-integrated planning workflows

## Layers

**Template Layer:**
- Purpose: Define reusable document structures
- Location: `templates/`
- Contains: Document templates with frontmatter
- Dependencies: None (standalone)
- Used by: Commands and workflows

**Workflow Layer:**
- Purpose: Orchestrate multi-step procedures
- Location: `workflows/`
- Contains: Workflow definitions for complex operations
- Dependencies: Template layer for context
- Used by: GSI commands

**Reference Layer:**
- Purpose: Core principles and guidance
- Location: `references/`
- Contains: System documentation and rules
- Dependencies: None (foundational)
- Used by: All components

**Command Layer:**
- Purpose: Execute specific GSI operations
- Location: `workflows/`
- Contains: Task definitions and command handlers
- Dependencies: Workflow and template layers
- Used by: CLI entry point

## Data Flow

**GSI Command Execution:**

1. User runs `/GSI:command`
2. Workflow is loaded from `workflows/command.md`
3. Tasks are parsed and dependencies identified
4. Subagents are spawned with appropriate models
5. Subagents execute tasks using MCP tools
6. Results are collected and committed to git
7. Summary is generated for user review

**State Management:**
- File-based: All state lives in `.planning/` directory
- Version-controlled: Git tracks all planning artifacts
- Incremental: Each task creates atomic commits

## Key Abstractions

**Workflow:**
- Purpose: Orchestrate multi-step operations
- Examples: `workflows/execute-phase.md`, `workflows/verify-phase.md`
- Pattern: State machine with task dependencies

**Template:**
- Purpose: Reusable document structure with frontmatter
- Examples: `templates/project.md`, `templates/roadmap.md`
- Pattern: Markdown with YAML frontmatter variables

**Subagent:**
- Purpose: Execute specific tasks with specialized models
- Examples: GSI executor, verifier, mapper agents
- Pattern: Task-based with explicit context injection

**Checkpoint:**
- Purpose: Human interaction points during automation
- Examples: Verification, decisions, authentication gates
- Pattern: Structured request/response format

## Entry Points

**CLI Entry:**
- Location: Workflows triggered by `/GSI:` commands
- Triggers: User invokes commands via CLI
- Responsibilities: Load workflows, spawn subagents, collect results

**Workflows:**
- Location: `workflows/*.md`
- Triggers: Called from CLI or other workflows
- Responsibilities: Execute multi-step procedures

## Error Handling

**Strategy:** Structured error handling with explicit reporting

**Patterns:**
- Task-level error handling with graceful degradation
- Subagent failure detection and retry mechanisms
- User-facing error messages with suggested actions
- Git-based error recovery through atomic commits

## Cross-Cutting Concerns

**Validation:**
- Approach: Frontmatter validation in templates
- Pattern: Required fields, type checking, business rules

**Documentation:**
- Approach: Template-driven generation
- Pattern: Consistent structure across document types

**Version Control:**
- Approach: Git integration for all artifacts
- Pattern: Atomic commits, branching strategies, merge conflicts

**Tool Management:**
- Approach: MCP tools with priority enforcement
- Pattern: Skills → MCP → Native tool hierarchy

**Model Selection:**
- Approach: Dynamic model assignment based on task type
- Pattern: Quality/Budget/Balanced profiles for different agents

---

*Architecture analysis: 2026-02-11*
*Update when major patterns change*
