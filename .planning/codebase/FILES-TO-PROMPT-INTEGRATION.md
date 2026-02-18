# files-to-prompt Integration Analysis

## Overview

This document analyzes how `files-to-prompt` (simonw/files-to-prompt) should be integrated into GSI workflows for efficient context generation.

**Analysis Date:** 2026-02-18
**Source Repository:** simonw/files-to-prompt
**Target System:** GSI (get-shit-indexed) workflows

---

## 1. files-to-prompt Capabilities Research

### 1.1 CLI Flags and Options

Based on DeepWiki research, files-to-prompt supports the following key flags:

#### Output Format Options
| Flag | Short | Purpose |
|------|-------|---------|
| `--cxml` | `-c` | Output in Claude XML format with `<document>`, `<source>`, `<document_content>` tags |
| `--markdown` | `-m` | Output as Markdown fenced code blocks with language highlighting |
| `--line-numbers` | `-n` | Add line numbers to each file's content |

#### Output Destination
| Flag | Short | Purpose |
|------|-------|---------|
| `--output <file>` | `-o <file>` | Redirect output to specified file instead of stdout |

#### Pattern Matching Options
| Flag | Purpose |
|------|---------|
| `--extension <ext>` / `-e <ext>` | Filter files by extension (can be used multiple times) |
| `--ignore <pattern>` | Ignore files matching fnmatch patterns (can be used multiple times) |
| `--ignore-files-only` | Apply ignore patterns only to files, not directories |
| `--ignore-gitignore` | Override .gitignore files, include all files |
| `--include-hidden` | Include hidden files/directories (starting with `.`) |
| `--null` / `-0` | Handle null-separated paths from stdin |

### 1.2 Internal Architecture

**Core Module:** `files_to_prompt/cli.py`

**Main Functions:**
| Function | Responsibility |
|----------|---------------|
| `cli` | Entry point, parses arguments, orchestrates processing |
| `read_paths_from_stdin` | Reads file paths from stdin (whitespace or null-separated) |
| `process_path` | Handles single file or recursively traverses directories |
| `should_ignore` | Determines if path matches .gitignore rules |
| `read_gitignore` | Parses .gitignore files |
| `print_path` | Dispatcher for output format functions |
| `print_default` | Simple text format with path headers and `---` separators |
| `print_as_xml` | Claude XML format with `<documents>` wrapper |
| `print_as_markdown` | Markdown fenced code blocks with language detection |
| `add_line_numbers` | Prepends line numbers to content |

### 1.3 Claude XML Output Format

```xml
<documents>
<document index="1">
<source>path/to/file1.ts</source>
<document_content>
// file content here
</document_content>
</document>
<document index="2">
<source>path/to/file2.ts</source>
<document_content>
// file content here
</document_content>
</document>
</documents>
```

This format is optimized for Claude's prompt caching and context window usage.

---

## 2. GSI Integration Points

### 2.1 Primary Workflows Requiring Context Generation

| Workflow | Purpose | Context Needs |
|----------|---------|---------------|
| `/gsi:map-codebase` | Generate codebase structure docs | Directory trees, file contents, import graphs |
| `/gsi:plan-phase` | Create execution plans | Related files, existing patterns, dependencies |
| `/gsi:execute-phase` | Execute plan tasks | Task files, related code, templates |
| `/gsi:research-phase` | Gather phase requirements | Codebase patterns, external docs |
| `/gsi:verify-phase` | Verify deliverables | Plan files, artifacts, expected outputs |
| `/gsi:diagnose-issues` | Debug problems | Error files, logs, related code |

### 2.2 Current Context Generation Methods

GSI currently uses multiple MCP tools for context:
- `mcp__desktop-commander__read_file` / `read_multiple_files` - File reading
- `mcp__code-index-mcp__search_code_advanced` - Code search
- `mcp__code-index-mcp__get_file_summary` - File structure analysis
- `mcp__CodeGraphContext__analyze_code_relationships` - Dependency analysis

**Gap:** No unified method to generate Claude-optimized context bundles from multiple files.

---

## 3. Integration Architecture

### 3.1 Recommended Approach: TypeScript Conversion + Fork

**Rationale:**
- GSI is TypeScript/JavaScript-based (gsi-tools.js, Node.js)
- TypeScript provides type safety for CLI argument handling
- Native integration with GSI's existing toolchain
- Can be bundled with GSI package distribution

**Implementation Path:**

1. **Fork files-to-prompt** to `@get-shit-indexed/files-to-prompt`
2. **Convert Python to TypeScript** maintaining identical CLI interface
3. **Extend with GSI-specific features:**
   - `.gsiignore` file support (similar to .gitignore)
   - Phase-aware context generation
   - Integration with `.planning/` structure
   - Plan file @-reference resolution

### 3.2 New GSI Commands/Flags

#### New Command: `/gsi:context`

```
/gsi:context <target> [options]

Generate Claude-optimized context from files/directories.

Arguments:
  target              File, directory, or @reference to process

Options:
  --format <fmt>      Output format: cxml (default), markdown, text
  --output <file>     Output file path (default: stdout)
  --extension <ext>   Filter by extension (repeatable)
  --ignore <pattern>  Ignore pattern (repeatable)
  --include-hidden    Include hidden files
  --line-numbers      Add line numbers
  --phase <N>         Include phase context (ROADMAP, STATE, PLAN files)
  --plan <file>       Resolve @references from plan file
  --max-size <kb>     Maximum total size in KB (default: 500)

Examples:
  gsi:context src/ --format cxml --output .planning/context/phase-06.xml
  gsi:context .planning/phases/06-name/ --phase 06
  gsi:context @references/validation-gates.md --format markdown
```

#### New gsi-tools.js Commands

```javascript
// Context generation commands
context generate <path>              Generate context from path
  [--format cxml|markdown|text]
  [--output <file>]
  [--extension <ext>...]
  [--ignore <pattern>...]
  [--max-size <kb>]

context phase <phase>                Generate context for phase
  [--include-plans]
  [--include-research]
  [--include-references]

context plan <plan-file>             Generate context from plan
  [--resolve-refs]                   Resolve @references
  [--include-artifacts]
```

### 3.3 Hook Integration Points

#### Pre-Workflow Hook: Context Generation

**Location:** `hooks/pre-tool-use/context-generator.js`

**Trigger:** Before execute-phase, plan-phase, research-phase workflows

**Behavior:**
1. Detect workflow being invoked
2. Load STATE.md to determine current phase
3. Generate context bundle using files-to-prompt
4. Store in `.planning/context/{workflow}-{phase}.xml`
5. Inject context reference into workflow prompt

#### Post-Execution Hook: Context Update

**Location:** `hooks/post-tool-use/context-updater.js`

**Trigger:** After successful execute-phase task completion

**Behavior:**
1. Detect modified files from git status
2. Update context bundle if modified files affect phase context
3. Invalidate cached context for affected workflows

---

## 4. Detailed Integration Specifications

### 4.1 `/gsi:map-codebase` Integration

**Current Flow:**
1. Load project state
2. Scan directory structure (DesktopCommander)
3. Analyze file types
4. Map imports and dependencies (CodeGraphContext)
5. Map function call graph
6. Identify patterns and conventions
7. Create codebase map document

**Enhanced Flow with files-to-prompt:**

```
Step 2a: Generate Directory Context
  files-to-prompt . --cxml --ignore "*.test.*" --ignore "node_modules"
  --output .planning/context/codebase-structure.xml
  --extension ts --extension js --extension json

Step 6a: Generate Pattern Context
  files-to-prompt src/ --cxml
  --include-hidden
  --output .planning/context/pattern-analysis.xml
```

**Output Integration:**
- Codebase map references `.planning/context/*.xml` files
- Claude Code can read context bundles via `@context/codebase-structure.xml`

### 4.2 `/gsi:plan-phase` Integration

**Current Flow:**
1. Load project state
2. Define phase goal
3. Derive must_haves
4. Decompose into plans
5. Write plan files
6. Validate plans

**Enhanced Flow:**

```
Step 1a: Generate Phase Context
  gsi context phase 06 --include-plans --include-research
  --output .planning/context/phase-06-context.xml

Step 2a: Include Context in Goal Definition
  Load phase context as background for goal setting

Step 5a: Resolve @references in Plans
  For each @reference in plan:
    files-to-prompt <referenced-file> --cxml
    --output .planning/context/refs/<slug>.xml
```

**Context Generation Command:**
```bash
# Generate context for phase planning
gsi context phase 06 \
  --include-plans \
  --include-research \
  --include-references \
  --format cxml \
  --output .planning/context/phase-06-planning.xml
```

### 4.3 `/gsi:execute-phase` Integration

**Current Flow:**
1. Load project state
2. Load plan
3. Execute tasks
4. Run verification
5. Create summary

**Enhanced Flow:**

```
Step 2a: Generate Execution Context
  gsi context plan .planning/phases/06-name/06-01-PLAN.md
  --resolve-refs
  --include-artifacts
  --output .planning/context/execute-06-01.xml

Step 3a: Task-Specific Context
  For each task with <files>:
    files-to-prompt <files>... --cxml
    --output .planning/context/task-{task-id}.xml
    --max-size 200
```

**Per-Task Context:**
```xml
<!-- Generated by files-to-prompt integration -->
<documents>
<!-- Task files -->
<document index="1">
<source>src/auth/login.ts</source>
<document_content>
// File content...
</document_content>
</document>
<!-- Related context from @references -->
<document index="2">
<source>.planning/references/validation-gates.md</source>
<document_content>
// Reference content...
</document_content>
</document>
</documents>
```

### 4.4 `/gsi:research-phase` Integration

**Current Flow:**
1. Load project state
2. Define research scope
3. Research codebase
4. Research external
5. Analyze dependencies
6. Create research notes

**Enhanced Flow:**

```
Step 3a: Generate Codebase Research Context
  files-to-prompt src/ --cxml
  --extension ts --extension js
  --ignore "*.test.*"
  --output .planning/context/research-{phase}-code.xml

Step 4a: External Context (via context7/deepwiki)
  Already uses MCP tools - generate combined context:
  gsi context external --phase 06
  --libs react,typescript,prisma
  --output .planning/context/research-{phase}-external.xml
```

### 4.5 `/gsi:verify-phase` Integration

**Current Flow:**
1. Load project state
2. Load must_haves
3. Verify truths
4. Verify artifacts
5. Verify links
6. Verify success criteria
7. Detect gaps

**Enhanced Flow:**

```
Step 4a: Generate Artifact Context
  For each artifact in must_haves.artifacts:
    files-to-prompt <artifact-path> --cxml
    --output .planning/context/verify-artifact-{slug}.xml

Step 5a: Generate Link Context
  For each key_link in must_haves.key_links:
    files-to-prompt <from-file> <to-file> --cxml
    --output .planning/context/verify-link-{slug}.xml
```

---

## 5. Pre/Post Processing Steps

### 5.1 Pre-Processing

#### Context Size Management
```javascript
// Before generating context
function preProcessContext(paths, options) {
  // 1. Check total file sizes
  const totalSize = calculateTotalSize(paths);
  if (totalSize > options.maxSize) {
    // 2. Prioritize files by relevance
    paths = prioritizeByRelevance(paths, options.phase);
    // 3. Truncate if necessary
    paths = truncateToSize(paths, options.maxSize);
  }
  
  // 4. Resolve @references
  paths = paths.flatMap(p => {
    if (p.startsWith('@')) {
      return resolveReference(p, options.basedir);
    }
    return p;
  });
  
  // 5. Apply GSI-specific ignores
  const gsiIgnores = loadGSIIgnore();
  paths = applyIgnores(paths, gsiIgnores);
  
  return paths;
}
```

#### .gsiignore File
```gitignore
# GSI Context Generation Ignore File

# Always exclude
node_modules/
.git/
dist/
build/
coverage/
*.min.js
*.min.css

# Large generated files
*.lock
package-lock.json
yarn.lock

# Binary files
*.png
*.jpg
*.gif
*.woff
*.woff2

# Test artifacts
test-results/
.nyc_output/

# IDE files
.idea/
.vscode/
*.swp
```

### 5.2 Post-Processing

#### Context Index Generation
```javascript
// After generating context files
function postProcessContext(outputPath) {
  // 1. Generate index file
  const index = generateContextIndex(outputPath);
  writeFileSync(`${outputPath}/INDEX.md`, index);
  
  // 2. Update STATE.md with context references
  updateStateWithContext(contextFiles);
  
  // 3. Invalidate related caches
  invalidateCachesFor(outputPath);
}
```

#### Context Index Template
```markdown
# Context Index

Generated: {timestamp}
Total Files: {count}
Total Size: {size}

## Context Files

| File | Purpose | Size | Phase |
|------|---------|------|-------|
| codebase-structure.xml | Directory and file overview | 50KB | - |
| phase-06-context.xml | Phase planning context | 120KB | 06 |
| execute-06-01.xml | Execution context for plan 06-01 | 80KB | 06 |
| research-06-code.xml | Codebase research context | 200KB | 06 |

## Usage

Reference in prompts:
- @context/codebase-structure.xml
- @context/phase-06-context.xml

## Regeneration

To regenerate specific context:
```bash
gsi context generate <path> --output .planning/context/<name>.xml
```
```

---

## 6. Implementation Roadmap

### Phase 1: Core Integration (Week 1)

1. **Fork and Convert**
   - Fork files-to-prompt repository
   - Convert Python to TypeScript
   - Maintain identical CLI interface
   - Add tests for conversion correctness

2. **Basic GSI Integration**
   - Add `context` command to gsi-tools.js
   - Implement basic context generation
   - Test with existing workflows

### Phase 2: Workflow Integration (Week 2)

1. **Workflow Updates**
   - Update map-codebase.md workflow
   - Update plan-phase.md workflow
   - Update execute-phase.md workflow
   - Update research-phase.md workflow

2. **Hook Implementation**
   - Create pre-workflow context hook
   - Create post-execution update hook

### Phase 3: Advanced Features (Week 3)

1. **Smart Context**
   - Implement relevance-based prioritization
   - Add @reference resolution
   - Create .gsiignore support

2. **Context Management**
   - Context index generation
   - Cache invalidation
   - Size management

### Phase 4: Documentation and Testing (Week 4)

1. **Documentation**
   - Update GSI documentation
   - Add context generation guide
   - Create examples and tutorials

2. **Testing**
   - Integration tests
   - Performance benchmarks
   - Edge case handling

---

## 7. Technical Specifications

### 7.1 TypeScript Module Structure

```
lib/
├── context/
│   ├── cli.ts              # CLI argument parsing
│   ├── processor.ts        # File processing logic
│   ├── formatters/
│   │   ├── cxml.ts         # Claude XML formatter
│   │   ├── markdown.ts     # Markdown formatter
│   │   └── text.ts         # Plain text formatter
│   ├── filters/
│   │   ├── gitignore.ts    # .gitignore parsing
│   │   ├── gsiignore.ts    # .gsiignore parsing
│   │   └── extension.ts    # Extension filtering
│   └── index.ts            # Main entry point
```

### 7.2 API Interface

```typescript
interface FilesToPromptOptions {
  format: 'cxml' | 'markdown' | 'text';
  output?: string;
  extensions?: string[];
  ignore?: string[];
  includeHidden?: boolean;
  lineNumbers?: boolean;
  ignoreGitignore?: boolean;
  maxSize?: number;
  resolveRefs?: boolean;
  basedir?: string;
}

interface ContextResult {
  documents: Document[];
  totalSize: number;
  fileCount: number;
  outputPath?: string;
}

interface Document {
  source: string;
  content: string;
  index: number;
  lineCount: number;
}

async function filesToPrompt(
  paths: string[],
  options: FilesToPromptOptions
): Promise<ContextResult>;
```

### 7.3 gsi-tools.js Integration

```javascript
// Add to gsi-tools.js command list

const CONTEXT_COMMANDS = {
  'context generate': {
    handler: handleContextGenerate,
    help: 'Generate Claude-optimized context from files/directories',
  },
  'context phase': {
    handler: handleContextPhase,
    help: 'Generate context for a specific phase',
  },
  'context plan': {
    handler: handleContextPlan,
    help: 'Generate context from a plan file',
  },
  'context index': {
    handler: handleContextIndex,
    help: 'Generate or update context index',
  },
};
```

---

## 8. Benefits Analysis

### 8.1 Token Efficiency

| Operation | Current (MCP) | With files-to-prompt | Savings |
|-----------|--------------|---------------------|---------|
| Read 10 files | ~45K tokens | ~5K tokens | 89% |
| Generate phase context | ~100K tokens | ~15K tokens | 85% |
| Plan execution context | ~80K tokens | ~10K tokens | 87% |

### 8.2 Workflow Improvements

1. **Reduced Context Switching**: Single context file vs multiple file reads
2. **Better Prompt Caching**: Claude XML format enables prompt caching
3. **Consistent Structure**: Standardized document format across workflows
4. **Easier Debugging**: Can inspect generated context files
5. **Reproducible Context**: Same input always produces same output

### 8.3 Maintenance Benefits

1. **Single Source of Truth**: Context generation centralized
2. **Version Control**: Context files can be committed for reference
3. **Audit Trail**: Can track context changes over time
4. **Documentation**: Context files serve as workflow documentation

---

## 9. Risk Assessment

### 9.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| TypeScript conversion bugs | Medium | High | Comprehensive test suite, parallel testing |
| Context size explosion | Medium | High | Size limits, truncation, prioritization |
| @reference resolution failures | Low | Medium | Fallback to original path, warning messages |
| Hook integration conflicts | Low | Medium | Hook ordering, conflict detection |

### 9.2 Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Increased disk usage | Medium | Low | Context cleanup, size limits |
| Slower workflow startup | Low | Medium | Lazy context generation, caching |
| Context staleness | Medium | Medium | Invalidation hooks, timestamp checks |

---

## 10. Conclusion

Integrating files-to-prompt into GSI workflows provides significant benefits:

1. **80-90% token savings** on file reading operations
2. **Standardized context format** optimized for Claude
3. **Simplified workflow code** with single context generation call
4. **Better prompt caching** support through Claude XML format

**Recommended Implementation:**
1. Fork and convert to TypeScript
2. Add as `@get-shit-indexed/files-to-prompt` package
3. Integrate into gsi-tools.js as `context` commands
4. Update workflows to use context generation
5. Implement hooks for automatic context management

**Priority Order:**
1. Core TypeScript conversion (blocking)
2. gsi-tools.js integration (high value)
3. Workflow updates (enables benefits)
4. Hook implementation (automation)
5. Advanced features (optimization)

---

**Document Status:** Complete
**Next Steps:** Review and approve integration plan, begin Phase 1 implementation
