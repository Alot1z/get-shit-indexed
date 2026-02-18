# Knowledge Base Module

The Knowledge Base module extracts patterns, principles, and reusable knowledge from the GSI codebase to create new skills, improve existing commands, and build a searchable knowledge index.

## Overview

This module implements the knowledge extraction capabilities identified during the Claudeception analysis of GSI. It enables GSI to learn from its own codebase and generate reusable artifacts.

**Phase 38-01 Enhancement**: The Knowledge Base now supports multi-type artifact generation, allowing patterns to be transformed into 7 different artifact types:
- **SKILL**: Claude Code skills for reuse
- **AGENT**: GSI agent definitions with thinking configurations
- **LOGIC**: TypeScript logic modules with interfaces
- **FUNCTION**: Reusable TypeScript functions
- **FEATURE**: Feature specification documents
- **IMPROVEMENT**: Improvement suggestions with rationale
- **IDEA**: Visionary ideas and concept proposals

## CLI Commands

### `gsi knowledge extract <path>`

Extract patterns from source files.

```bash
# Extract patterns from GSI commands
gsi knowledge extract ./commands

# Extract specific category
gsi knowledge extract ./workflows --category workflows

# Extract to custom knowledge directory
gsi knowledge extract ./agents --knowledge-dir ~/.gsi-knowledge
```

**Options:**
- `--category <category>` - Filter extraction to specific category
- `--knowledge-dir <path>` - Custom knowledge base directory

**Categories:**
- `command-patterns` - GSI command structures
- `thinking-configs` - Thinking phase configurations
- `workflows` - Multi-step workflow patterns
- `agents` - Agent definitions
- `error-handling` - Error handling patterns
- `optimization` - Performance optimization patterns

### `gsi knowledge search <query>`

Search the knowledge base for matching patterns.

```bash
# Search all patterns
gsi knowledge search "planning"

# Search within category
gsi knowledge search "debug" --category error-handling

# Limit results
gsi knowledge search "workflow" --limit 10
```

**Options:**
- `--category <category>` - Filter by category
- `--limit N` - Maximum results to return (default: 20)
- `--knowledge-dir <path>` - Custom knowledge base directory

### `gsi knowledge generate-skill <pattern-id>`

Generate a Claude skill file from a stored pattern.

```bash
gsi knowledge generate-skill pattern-command-add-phase
```

**Output:**
Creates a skill file at `~/.claude/skills/generated-<pattern-id>/skill.md`

### `gsi knowledge list`

List all patterns in the knowledge base.

```bash
# List all patterns
gsi knowledge list

# List patterns in specific category
gsi knowledge list --category command-patterns

# Limit output
gsi knowledge list --limit 30
```

**Options:**
- `--category <category>` - Filter by category
- `--limit N` - Maximum results (default: 50)
- `--knowledge-dir <path>` - Custom knowledge base directory

### `gsi knowledge stats`

Show knowledge base statistics.

```bash
gsi knowledge stats
```

**Output:**
```json
{
  "knowledge_dir": ".planning/knowledge",
  "exists": true,
  "patterns": {
    "total": 45,
    "by_category": {
      "command-patterns": 20,
      "thinking-configs": 10,
      "workflows": 15
    }
  },
  "templates": { "total": 5 },
  "best_practices": { "total": 8 },
  "artifacts": {
    "total": 12,
    "by_type": {
      "skills": 3,
      "agents": 2,
      "features": 4,
      "ideas": 3
    }
  }
}
```

## Multi-Type Artifact Generation (Phase 38-01)

### `gsi knowledge generate-all <pattern-id>`

Generate ALL artifact types from a pattern in one operation.

```bash
gsi knowledge generate-all pattern-command-add-phase
```

**Output:**
Creates 7 artifacts:
- `knowledge/skills/<pattern-name>.md` - Skill definition
- `knowledge/agents/gsi-<pattern-name>.md` - Agent with thinking config
- `knowledge/logic/<pattern-name>.ts` - TypeScript logic module
- `knowledge/functions/<pattern-name>.ts` - Reusable function
- `knowledge/features/<pattern-name>-feature.md` - Feature specification
- `knowledge/improvements/<pattern-name>-improvement.md` - Improvement suggestions
- `knowledge/ideas/<pattern-name>-idea.md` - Visionary ideas

### `gsi knowledge generate <pattern-id> <type>`

Generate a specific artifact type from a pattern.

```bash
# Generate an agent
gsi knowledge generate pattern-workflow-execute AGENT

# Generate a feature specification
gsi knowledge generate pattern-command-debug FEATURE

# Generate an idea document
gsi knowledge generate pattern-thinking-comprehensive IDEA
```

**Valid Types:**
- `SKILL` - Claude Code skill
- `AGENT` - GSI agent definition
- `LOGIC` - TypeScript logic module
- `FUNCTION` - Reusable TypeScript function
- `FEATURE` - Feature specification
- `IMPROVEMENT` - Improvement suggestions
- `IDEA` - Visionary idea document

### `gsi knowledge artifact-types`

List all available artifact types with descriptions.

```bash
gsi knowledge artifact-types
```

**Output:**
```
Available Artifact Types:
  skill: Claude Code skill for reuse
  agent: GSI agent definition with thinking config
  logic: TypeScript logic module with interfaces
  function: Reusable TypeScript function
  feature: Feature specification document
  improvement: Improvement suggestions with rationale
  idea: Visionary idea and concept proposal
```

### `gsi knowledge extract-generate <path>`

Extract patterns AND generate artifacts in one operation.

```bash
# Extract and generate all artifact types
gsi knowledge extract-generate ./commands

# Extract and generate only agents and features
gsi knowledge extract-generate ./workflows --types AGENT,FEATURE

# Extract specific category and generate
gsi knowledge extract-generate ./agents --category agents --types AGENT,IDEA
```

**Options:**
- `--types <types>` - Comma-separated artifact types to generate
- `--category <category>` - Filter extraction to specific category
- `--knowledge-dir <path>` - Custom knowledge base directory

### `gsi knowledge batch-generate <pattern-ids>`

Generate artifacts for multiple patterns at once.

```bash
# Generate agents and features for multiple patterns
gsi knowledge batch-generate pattern-1,pattern-2,pattern-3 --types AGENT,FEATURE
```

**Options:**
- `--types <types>` - Comma-separated artifact types to generate (default: SKILL,AGENT,FEATURE,IDEA)
- `--knowledge-dir <path>` - Custom knowledge base directory

## Shorthand Commands

For convenience, shorthand commands exist for single artifact type generation:

### `gsi knowledge agent <pattern-id>`
Generate an agent from a pattern.

```bash
gsi knowledge agent pattern-command-debug
```

### `gsi knowledge feature <pattern-id>`
Generate a feature specification from a pattern.

```bash
gsi knowledge feature pattern-workflow-execute
```

### `gsi knowledge idea <pattern-id>`
Generate an idea document from a pattern.

```bash
gsi knowledge idea pattern-thinking-comprehensive
```

### `gsi knowledge logic <pattern-id>`
Generate a logic module from a pattern.

```bash
gsi knowledge logic pattern-command-add-phase
```

### `gsi knowledge function <pattern-id>`
Generate a function from a pattern.

```bash
gsi knowledge function pattern-optimization-cache
```

### `gsi knowledge improvement <pattern-id>`
Generate improvement suggestions from a pattern.

```bash
gsi knowledge improvement pattern-error-handling
```

## Pattern Storage Structure

The knowledge base stores data in the following structure:

```
.planning/knowledge/
├── patterns/
│   ├── command-patterns/
│   │   ├── pattern-command-add-phase.json
│   │   └── pattern-command-debug.json
│   ├── thinking-configs/
│   │   └── pattern-thinking-comprehensive.json
│   ├── workflows/
│   │   └── pattern-workflow-execute.json
│   ├── agents/
│   ├── error-handling/
│   └── optimization/
├── templates/
│   ├── gsi-command-1234567890.json
│   └── thinking-config-1234567891.json
├── best-practices/
│   └── practice-execute-phase-0.md
├── skills/                          # Generated skills
│   └── pattern-name.md
├── agents/                          # Generated agents
│   └── gsi-pattern-name.md
├── logic/                           # Generated logic modules
│   └── pattern-name.ts
├── functions/                       # Generated functions
│   └── pattern-name.ts
├── features/                        # Generated feature specs
│   └── pattern-name-feature.md
├── improvements/                    # Generated improvements
│   └── pattern-name-improvement.md
├── ideas/                           # Generated ideas
│   └── pattern-name-idea.md
└── index.json
```

### Pattern File Format

Each pattern is stored as JSON:

```json
{
  "id": "pattern-command-add-phase",
  "name": "add-phase Command Pattern",
  "category": "command-patterns",
  "description": "Pattern for add-phase command with 5 tools",
  "source": "commands/GSI/add-phase.md",
  "whenToUse": [
    "When implementing a command similar to add-phase",
    "When 5 tools are needed",
    "When the command has similar complexity"
  ],
  "howToApply": [
    "1. Copy the command structure",
    "2. Modify description and objective",
    "3. Adjust allowed-tools list",
    "4. Update process section"
  ],
  "variations": [
    {
      "name": "Simplified",
      "description": "Remove non-essential tools",
      "context": "When simpler version is needed"
    }
  ],
  "examples": [
    {
      "name": "Basic usage",
      "code": "...",
      "explanation": "Command description"
    }
  ],
  "effectiveness": 1.0,
  "uses": 0
}
```

### Index File Format

The `index.json` file tracks overall statistics:

```json
{
  "lastUpdated": "2025-02-18T12:00:00.000Z",
  "patterns": 45,
  "templates": 5,
  "practices": 8,
  "categories": ["command-patterns", "thinking-configs", "workflows"]
}
```

## Programmatic API

### Import and Initialize

```javascript
import { KnowledgeBase } from 'get-shit-indexed/lib/workflow-modules/knowledge-base.js';

const kb = new KnowledgeBase('./.planning/knowledge');
```

### Extract Patterns

```javascript
const result = await kb.extract('./commands', 'command-patterns');
console.log(`Extracted ${result.patternsExtracted.length} patterns`);
```

### Search Patterns

```javascript
const patterns = kb.search('planning', 'workflows');
patterns.forEach(p => console.log(p.name, p.effectiveness));
```

### Generate Skill

```javascript
const skillPath = await kb.generateSkill('pattern-command-add-phase');
console.log(`Skill created at: ${skillPath}`);
```

### Multi-Type Artifact Generation

```javascript
// Generate all artifact types
const result = await kb.generateAllArtifacts('pattern-command-add-phase');
console.log(`Generated ${result.artifacts.length} artifacts`);

// Generate specific types
const partial = await kb.generateArtifactTypes('pattern-command-add-phase', ['AGENT', 'FEATURE']);

// Generate single artifact
const agent = await kb.generateAgent('pattern-command-add-phase');
const feature = await kb.generateFeature('pattern-workflow-execute');
const idea = await kb.generateIdea('pattern-thinking-comprehensive');

// Extract and generate in one operation
const combined = await kb.extractAndGenerate('./commands', 'command-patterns', ['AGENT', 'FEATURE']);

// Batch generate for multiple patterns
const batchResults = await kb.batchGenerate(
  ['pattern-1', 'pattern-2', 'pattern-3'],
  ['AGENT', 'FEATURE', 'IDEA']
);
```

### Track Effectiveness

```javascript
// After successful use of a pattern
kb.trackEffectiveness('pattern-command-add-phase', true);

// After failed use
kb.trackEffectiveness('pattern-command-add-phase', false);
```

## Artifact Generator Module

The `artifact-generator.ts` module provides the multi-type generation capabilities:

```javascript
import { ArtifactGeneratorManager } from 'get-shit-indexed/lib/workflow-modules/artifact-generator.js';

const generator = new ArtifactGeneratorManager('./.planning/knowledge');

// Get available types
const types = generator.getAvailableTypes();
// ['SKILL', 'AGENT', 'LOGIC', 'FUNCTION', 'FEATURE', 'IMPROVEMENT', 'IDEA']

// Generate all types
const artifacts = await generator.generateAll(pattern);

// Generate specific types
const selected = await generator.generateTypes(pattern, ['AGENT', 'FEATURE']);

// Generate single type
const agent = await generator.generate(pattern, 'AGENT');
```

### Individual Generators

Each artifact type has its own generator class:

- `SkillGenerator` - Creates Claude Code skill files
- `AgentGenerator` - Creates GSI agent definitions with auto-generated thinking configs
- `LogicGenerator` - Creates TypeScript logic modules with interfaces
- `FunctionGenerator` - Creates reusable TypeScript functions
- `FeatureGenerator` - Creates feature specification documents
- `ImprovementGenerator` - Creates improvement suggestion documents
- `IdeaGenerator` - Creates visionary idea documents

## Use Cases

### 1. Command Development

When creating a new GSI command, search for similar patterns:

```bash
gsi knowledge search "phase" --category command-patterns
```

### 2. Agent Generation

Generate an agent from a proven command pattern:

```bash
gsi knowledge agent pattern-command-debug
```

The generated agent includes:
- Appropriate thinking configuration
- Inferred allowed tools
- Process steps from pattern
- Examples and variations

### 3. Feature Specification

Create a detailed feature specification from a workflow pattern:

```bash
gsi knowledge feature pattern-workflow-execute
```

### 4. Idea Generation

Explore innovative concepts from patterns:

```bash
gsi knowledge idea pattern-thinking-comprehensive
```

### 5. Batch Processing

Generate multiple artifacts for all patterns in a category:

```bash
gsi knowledge batch-generate $(gsi knowledge list --category workflows --raw | cut -d' ' -f2) --types AGENT,FEATURE
```

## Integration with Other Modules

### Thinking Orchestrator

The Knowledge Base can suggest thinking configurations based on extracted patterns:

```javascript
const pattern = kb.search('complex planning')[0];
// Use pattern to configure thinking orchestrator
```

The Agent generator automatically creates appropriate thinking configs based on pattern complexity.

### Workflow Chainer

Workflow patterns can be converted to workflow templates:

```javascript
const workflowPatterns = kb.search('', 'workflows');
// Convert to WorkflowChainer templates
```

## Best Practices

1. **Extract Regularly**: Run `gsi knowledge extract` after completing major features
2. **Track Effectiveness**: Use `trackEffectiveness()` to improve pattern rankings
3. **Generate Multiple Types**: Use `generate-all` to explore all artifact possibilities
4. **Search First**: Before creating new commands, search for existing patterns
5. **Review Stats**: Check `gsi knowledge stats` to monitor knowledge base growth
6. **Use Shorthands**: Use `gsi knowledge agent`, `gsi knowledge feature` for quick generation

## Related Documentation

- [Thinking Orchestrator](./thinking-orchestrator.md) - Thinking server coordination
- [Workflow Chainer](./workflow-chainer.md) - Workflow execution
- [Patch Manager](./patch-manager.md) - Local modification management
- [Artifact Generator](./artifact-generator.md) - Multi-type artifact generation details
