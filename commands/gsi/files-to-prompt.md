---
name: gsi:files-to-prompt
description: Convert files/directories to prompt format with zero-token indexing support
argument-hint: "<paths...> [--cxml] [--output <file>] [--include <pattern>] [--exclude <pattern>] [--gitignore] [--index] [--query <term>]"
allowed-tools:
  # Desktop Commander MCP - File operations (REQUIRED - no native tools)
  - mcp__desktop-commander__read_file
  - mcp__desktop-commander__read_multiple_files
  - mcp__desktop-commander__write_file
  - mcp__desktop-commander__edit_block
  - mcp__desktop-commander__list_directory
  - mcp__desktop-commander__create_directory
  - mcp__desktop-commander__get_file_info
  - mcp__desktop-commander__start_search
  - mcp__desktop-commander__get_more_search_results
  - mcp__desktop-commander__start_process
  # Code-Index MCP - Fast search and indexing
  - mcp__code-index-mcp__search_code_advanced
  - mcp__code-index-mcp__find_files
  - mcp__code-index-mcp__get_file_summary
  - mcp__code-index-mcp__build_deep_index
  - mcp__code-index-mcp__get_symbol_body
  - mcp__code-index-mcp__set_project_path
  # Thinking servers for complex analysis
  - mcp__sequential-thinking__sequentialthinking
  - mcp__tractatusthinking__tractatus_thinking
  # Orchestration
  - Task
thinking_phase:
  mode: COMPREHENSIVE
  servers:
    - name: sequential
      purpose: "Plan file collection and indexing strategy"
      timeout: 8000
    - name: tractatus
      purpose: "Analyze content structure for semantic indexing"
      timeout: 10000
  rationale: |
    Files-to-prompt requires:
    1. Sequential for planning file traversal and chunking strategy
    2. Tractatus for semantic structure analysis and topic extraction
    
    This enables:
    - Efficient file discovery and filtering
    - Optimal chunk sizes for indexing
    - Semantic topic extraction for zero-token queries
  integration: "Pre-workflow planning, post-indexing structure analysis"
---

<!--
Golden Pattern Tool Usage:
- DC act: Desktop Commander for ALL file operations (read, write, list, search)
- CI understand: Code-Index for fast file discovery and content search
- TS analyze: Thinking servers for structure planning and semantic analysis

CRITICAL: Use MCP tools ONLY. NO native Read/Write/Bash/Grep/Glob tools.

DC Tools Usage:
- read_file: Read individual files for content extraction
- read_multiple_files: Batch read for token efficiency (80%+ savings)
- write_file: Write output files (cxml, index files)
- list_directory: Discover files in directories
- start_search: Find files matching patterns
- get_file_info: Check file sizes before processing

CI Tools Usage:
- find_files: Fast file discovery by pattern
- search_code_advanced: Content search within files
- get_file_summary: Quick file structure analysis
- build_deep_index: Create symbol index for code files
-->

<objective>
Convert files and directories to LLM-optimized prompt formats with full feature parity to simonw/files-to-prompt, PLUS zero-token indexing capabilities.

**Key Features:**
1. **Format Conversion** - Convert files to cxml/markdown/text formats
2. **Pattern Filtering** - Include/exclude patterns, gitignore support
3. **Zero-Token Indexing** - Create searchable indexes without loading full content
4. **CXML Reading** - Parse and query existing .cxml files

**Reference:** Zero-Token Indexing System (.planning/chats/ZERO-TOKEN-INDEXING.md)
</objective>

<execution_context>
@~/.claude/get-shit-indexed/workflows/files-to-prompt.md
@.planning/chats/ZERO-TOKEN-INDEXING.md
</execution_context>

<context>
Input paths: $ARGUMENTS

**Supported Flags:**
- `--cxml` or `-c`: Output in Claude XML format (default)
- `--markdown` or `-m`: Output as Markdown fenced code blocks
- `--text`: Plain text output with path headers
- `--output <file>` or `-o <file>`: Write to file instead of stdout
- `--include <pattern>` or `-i <pattern>`: Include only matching files (repeatable)
- `--exclude <pattern>` or `-e <pattern>`: Exclude matching files (repeatable)
- `--gitignore`: Respect .gitignore files (default: true)
- `--no-gitignore`: Ignore .gitignore rules
- `--include-hidden`: Include hidden files/directories
- `--line-numbers` or `-n`: Add line numbers to content
- `--extension <ext>`: Filter by file extension (repeatable)
- `--max-size <kb>`: Maximum total size in KB (default: 500)
- `--index`: Create zero-token index files (SEMANTIC-INDEX.cxml, SYMBOL-TABLE.json, CHUNK-MAP.json)
- `--query <term>`: Query existing index files

**Index Output Files:**
- `SEMANTIC-INDEX.cxml`: Topic → line range mappings for direct content access
- `SYMBOL-TABLE.json`: All entities as queryable keys with summaries
- `CHUNK-MAP.json`: Hierarchical breakdown for progressive loading
- `ABSTRACT.md`: One-page overview of entire content

**Mode Detection:**
- No flags + paths: Convert files (default cxml output)
- `--index` + paths: Create zero-token index
- `--query` + term: Query existing index
</context>

<when_to_use>
**Use files-to-prompt for:**
- Creating context bundles for Claude prompts
- Generating Claude-optimized cxml from codebases
- Building searchable indexes for large files (.cxml, docs)
- Preparing files for prompt caching
- Querying indexed content without loading full files

**Common Use Cases:**
1. **Phase Context Generation:**
   ```
   gsi:files-to-prompt .planning/phases/06-name/ --cxml --output context.xml
   ```

2. **Codebase to Prompt:**
   ```
   gsi:files-to-prompt src/ --extension ts --extension js --output codebase.cxml
   ```

3. **Zero-Token Index Creation:**
   ```
   gsi:files-to-prompt .planning/chats/chats.cxml --index
   ```

4. **Query Existing Index:**
   ```
   gsi:files-to-prompt --query "Phase 20"
   ```

5. **Filtered Conversion:**
   ```
   gsi:files-to-prompt . --include "*.md" --exclude "node_modules" --gitignore
   ```
</when_to_use>

<process>

## 0. Initialize and Parse Arguments

### Thinking Phase: Pre-Workflow

<server>sequential</server>
<prompt>Plan the files-to-prompt operation:
1. What is the operation mode? (convert, index, query)
2. What paths need to be processed?
3. What filtering rules apply?
4. What is the optimal chunking strategy?</prompt>
<expected_output>Operation plan with file collection strategy</expected_output>
<timeout>5000</timeout>

Parse arguments from $ARGUMENTS:

```
Parse flags:
- paths = all non-flag arguments
- format = --cxml (default) | --markdown | --text
- output = --output value or stdout
- include_patterns = all --include values
- exclude_patterns = all --exclude values
- extensions = all --extension values
- gitignore = true (default), false if --no-gitignore
- include_hidden = true if --include-hidden
- line_numbers = true if --line-numbers
- max_size = --max-size value or 500
- index_mode = true if --index
- query_term = --query value
```

Route to appropriate handler:
- If `--query`: Execute **Query Mode**
- If `--index`: Execute **Index Mode**
- Otherwise: Execute **Convert Mode**

## 1. CONVERT MODE: File to Prompt Conversion

### 1.1 Collect Files

Use DesktopCommander for all file operations:

```
// Collect files from paths
for each path in paths:
  if path is file:
    add to file_list
  else if path is directory:
    // Use DC list_directory for discovery
    files = mcp__desktop-commander__list_directory({
      path: absolute_path(path),
      depth: 10  // deep scan
    })
    add matching files to file_list
```

Apply filters in order:
1. **Extension filter**: Keep only matching extensions if specified
2. **Include patterns**: Keep files matching any include pattern
3. **Exclude patterns**: Remove files matching any exclude pattern
4. **Gitignore**: Load and apply .gitignore rules if enabled
5. **Hidden files**: Remove hidden files unless --include-hidden

### 1.2 Check Size Constraints

```
total_size = 0
for each file in file_list:
  info = mcp__desktop-commander__get_file_info({path: file})
  total_size += info.size

if total_size > max_size * 1024:
  // Prioritize smaller, more relevant files
  file_list = prioritize_files(file_list, max_size)
  warn "Truncated to {max_size}KB, {file_list.length} files"
```

### 1.3 Read File Contents

**CRITICAL: Use read_multiple_files for batch efficiency (80%+ token savings)**

```
// Batch read for efficiency
file_contents = mcp__desktop-commander__read_multiple_files({
  paths: file_list.map(f => absolute_path(f))
})

// Returns map of path -> content
```

### 1.4 Generate Output

#### CXML Format (default)

```xml
<documents>
<document index="1">
<source>{absolute_path}</source>
<document_content>
{content}
</document_content>
</document>
<document index="2">
...
</document>
</documents>
```

#### Markdown Format

````markdown
## File: path/to/file.ts

```typescript
{content}
```

## File: path/to/another.ts

```typescript
{content}
```
````

#### Text Format

```
path/to/file.ts
---
{content}

path/to/another.ts
---
{content}
```

### 1.5 Write Output

```
if output_file:
  mcp__desktop-commander__write_file({
    path: absolute_path(output_file),
    content: generated_output,
    mode: "rewrite"
  })
  confirm "Written to {output_file}"
else:
  display generated_output
```

## 2. INDEX MODE: Zero-Token Index Creation

### 2.1 Analyze Content Structure

### Thinking Phase: Structure Analysis

<server>tractatus</server>
<prompt>Analyze the content structure for semantic indexing:
1. What are the main topics/sections?
2. How should content be chunked?
3. What symbols/entities should be extracted?
4. What is the optimal hierarchy for progressive loading?</prompt>
<expected_output>Index structure plan</expected_output>
<timeout>10000</timeout>

Read input files using DesktopCommander:

```
content = mcp__desktop-commander__read_file({
  path: absolute_path(input_path)
})
```

### 2.2 Generate SEMANTIC-INDEX.cxml

Purpose: Maps topics to line ranges for direct access without loading full content.

```xml
<semantic_index>
  <entry>
    <topic>Phase 20: Tool Optimization</topic>
    <source>chats.cxml</source>
    <line_range start="11747" end="11850"/>
    <summary>Tool optimization planning and decisions</summary>
    <related_topics>
      <topic>Phase 19</topic>
      <topic>Phase 21</topic>
    </related_topics>
  </entry>
  <entry>
    <topic>Electrobun Decision</topic>
    <source>chats.cxml</source>
    <line_range start="25000" end="25150"/>
    <summary>Chosen over Electron for 14MB vs 150MB size</summary>
  </entry>
</semantic_index>
```

Extraction algorithm:
```
1. Parse content for section headers (Phase N, ##, ###)
2. Extract topic names and line ranges
3. Generate summaries using first sentence or key phrases
4. Identify cross-references between topics
5. Write to SEMANTIC-INDEX.cxml
```

### 2.3 Generate SYMBOL-TABLE.json

Purpose: All entities as queryable keys with summaries.

```json
{
  "metadata": {
    "generated": "2026-02-19",
    "source": "{input_file}",
    "token_savings": "99.9%"
  },
  "phases": {
    "Phase 20": {
      "name": "Tool Optimization",
      "status": "complete",
      "plans": 4,
      "summary": "Tool optimization planning and implementation",
      "key_deliverables": ["Tool patterns", "Optimization rules"]
    }
  },
  "features": {
    "electrobun": {
      "decision": "chosen",
      "alternatives": ["Electron"],
      "reason": "14MB vs 150MB binary size",
      "source_line": 25000
    }
  },
  "decisions": {
    "mcp_only": {
      "summary": "Use MCP tools exclusively over native tools",
      "rationale": "80-90% token savings",
      "implemented": true
    }
  }
}
```

### 2.4 Generate CHUNK-MAP.json

Purpose: Hierarchical breakdown for progressive loading.

```json
{
  "total_lines": 126812,
  "total_size_mb": 323,
  "created_date": "2026-02-19",
  "version": "1.0",
  
  "levels": {
    "0_abstract": {
      "lines": "1-100",
      "purpose": "quick overview",
      "description": "First 100 lines providing overview"
    },
    "1_sections": [
      {
        "id": "1_sec_0001",
        "name": "Foundation Phases (1-8)",
        "lines": "101-10000",
        "start_line": 101,
        "end_line": 10000,
        "description": "Milestone 1 - MCP integration",
        "size_mb": 25.3
      }
    ],
    "2_subsections": [...],
    "3_chunks": [...]
  }
}
```

### 2.5 Generate ABSTRACT.md

Purpose: One-page overview for quick understanding.

```markdown
# Project Abstract

Generated: 2026-02-19
Source: {input_file}

## Overview
{2-3 sentence project description}

## Key Metrics
- Total Phases: 49
- Completed: 40
- In Progress: 9
- Total Plans: 200+

## Major Milestones
1. **Milestone 1**: MCP Foundation (Phases 1-8)
2. **Milestone 2**: Refinement (Phases 9-13)
3. **Milestone 3**: Enhancement (Phases 14-24)
4. **Milestone 4**: Apex (Phases 25-27)

## Key Decisions
- MCP tools over native (80-90% token savings)
- Electrobun over Electron (14MB vs 150MB)
- 3 thinking servers (Sequential, Tractatus, Debug)

## Quick Access
- Current Phase: Phase 49
- Status: Architecture Overhaul
- Next: Ultimate Integration
```

### 2.6 Write Index Files

```
output_dir = directory of input_file or --output dir

mcp__desktop-commander__write_file({
  path: `${output_dir}/SEMANTIC-INDEX.cxml`,
  content: semantic_index_xml
})

mcp__desktop-commander__write_file({
  path: `${output_dir}/SYMBOL-TABLE.json`,
  content: JSON.stringify(symbol_table, null, 2)
})

mcp__desktop-commander__write_file({
  path: `${output_dir}/CHUNK-MAP.json`,
  content: JSON.stringify(chunk_map, null, 2)
})

mcp__desktop-commander__write_file({
  path: `${output_dir}/ABSTRACT.md`,
  content: abstract_markdown
})
```

## 3. QUERY MODE: Zero-Token Query

### 3.1 Load Index Files

```
// Check for existing index files
index_dir = determine_index_directory()

symbol_table = mcp__desktop-commander__read_file({
  path: `${index_dir}/SYMBOL-TABLE.json`
})
symbol_table = JSON.parse(symbol_table)

chunk_map = mcp__desktop-commander__read_file({
  path: `${index_dir}/CHUNK-MAP.json`
})
chunk_map = JSON.parse(chunk_map)
```

### 3.2 Execute Query

```
query = query_term.toLowerCase()

// Search phases
for phase_name, phase_data in symbol_table.phases:
  if phase_name.toLowerCase().includes(query):
    results.push({
      type: "phase",
      name: phase_name,
      data: phase_data,
      relevance: calculate_relevance(query, phase_data)
    })

// Search features
for feature_name, feature_data in symbol_table.features:
  if feature_name.toLowerCase().includes(query):
    results.push({
      type: "feature",
      name: feature_name,
      data: feature_data,
      relevance: calculate_relevance(query, feature_data)
    })

// Search decisions
for decision_name, decision_data in symbol_table.decisions:
  if decision_name.toLowerCase().includes(query):
    results.push({
      type: "decision",
      name: decision_name,
      data: decision_data,
      relevance: calculate_relevance(query, decision_data)
    })

// Sort by relevance
results.sort((a, b) => b.relevance - a.relevance)
```

### 3.3 Load Detailed Content (Optional)

If `--load-detail` flag or user requests full content:

```
// Use CHUNK-MAP to find relevant line range
chunk = find_chunk_for_result(result, chunk_map)

// Read only that range
content = mcp__desktop-commander__read_file({
  path: source_file,
  offset: chunk.start_line,
  length: chunk.end_line - chunk.start_line
})
```

### 3.4 Return Results

```markdown
## Query Results for "{query}"

### Phases (X matches)
1. **Phase 20: Tool Optimization** (95% match)
   - Status: complete
   - Plans: 4
   - Summary: Tool optimization planning and implementation

### Features (X matches)
1. **electrobun** (90% match)
   - Decision: chosen over Electron
   - Reason: 14MB vs 150MB binary size

### Decisions (X matches)
1. **mcp_only** (85% match)
   - MCP tools exclusively over native tools
   - Rationale: 80-90% token savings

**Token Savings:** ~99.9% (loaded ~1KB vs 326MB full context)
```

## 4. CXML Reading Capability

### 4.1 Parse CXML Structure

When reading .cxml files for indexing or querying:

```
parse_cxml(content):
  documents = []
  
  // Extract all document blocks
  pattern = /<document index="(\d+)">[\s\S]*?<source>(.*?)<\/source>[\s\S]*?<document_content>([\s\S]*?)<\/document_content>[\s\S]*?<\/document>/g
  
  while match = pattern.exec(content):
    documents.push({
      index: parseInt(match[1]),
      source: match[2].trim(),
      content: match[3].trim()
    })
  
  return documents
```

### 4.2 Extract Structure from CXML

```
extract_cxml_structure(documents):
  structure = {
    topics: [],
    line_ranges: [],
    symbols: []
  }
  
  for doc in documents:
    // Extract topics from content
    topics = extract_topics(doc.content)
    structure.topics.push(...topics)
    
    // Track document boundaries as line ranges
    structure.line_ranges.push({
      document: doc.index,
      source: doc.source,
      start: calculate_start(doc),
      end: calculate_end(doc)
    })
    
    // Extract symbols (classes, functions, phases)
    symbols = extract_symbols(doc.content)
    structure.symbols.push(...symbols)
  
  return structure
```

### 4.3 Query CXML Without Full Load

```
query_cxml_lazy(cxml_path, query):
  // Read only SEMANTIC-INDEX.cxml first (~5KB)
  index = read_semantic_index(cxml_path)
  
  // Find matching topics
  matches = index.entries.filter(e => 
    e.topic.toLowerCase().includes(query.toLowerCase())
  )
  
  // Load only relevant line ranges
  results = []
  for match in matches:
    content = mcp__desktop-commander__read_file({
      path: cxml_path,
      offset: match.line_range.start,
      length: match.line_range.end - match.line_range.start
    })
    results.push({
      topic: match.topic,
      content: content,
      summary: match.summary
    })
  
  return results
```

</process>

<advanced_features>

## Token Optimization

**Batch File Reading:**
- Always use `read_multiple_files` for 2+ files
- Token savings: 80-90% vs sequential reads

**Index-Based Queries:**
- Load SYMBOL-TABLE.json (~10KB) instead of full content (326MB)
- Token savings: 99.9%

**Progressive Loading:**
- Use CHUNK-MAP.json to load only relevant sections
- Start with ABSTRACT.md for quick overview
- Drill down only when needed

## Size Management

**Pre-Size Check:**
```
// Before reading, check sizes
for file in file_list:
  info = get_file_info(file)
  if info.size > 1MB:
    warn "Large file: {file} ({info.size/1024}KB)"
    
// Truncate if over limit
if total_size > max_size:
  file_list = prioritize_and_truncate(file_list, max_size)
```

**Priority Order for Truncation:**
1. Keep: .md, .ts, .js (code and docs)
2. Keep: PLAN.md, STATE.md (project files)
3. Drop: .lock files, minified code
4. Drop: Generated files, large binaries

## Gitignore Support

**Load .gitignore rules:**
```
gitignore_rules = []

// Load from root .gitignore
if exists(".gitignore"):
  content = read_file(".gitignore")
  gitignore_rules = parse_gitignore(content)

// Load from nested .gitignore files
for dir in directories:
  if exists(`${dir}/.gitignore`):
    content = read_file(`${dir}/.gitignore`)
    gitignore_rules.push(...parse_gitignore(content))

// Apply rules
file_list = file_list.filter(file => 
  !matches_gitignore(file, gitignore_rules)
)
```

## Pattern Matching

**Include/Exclude Patterns:**
- Supports glob patterns: `*.ts`, `src/**`, `test-*`
- Supports negation: `!*.test.ts`
- Case-insensitive by default

</advanced_features>

<success_criteria>
- [ ] Arguments parsed correctly
- [ ] Operation mode determined (convert/index/query)
- [ ] Files collected using DesktopCommander
- [ ] Filters applied correctly (include, exclude, gitignore)
- [ ] Size constraints respected
- [ ] Output generated in correct format
- [ ] Index files created with proper structure (if --index)
- [ ] Query returns relevant results (if --query)
- [ ] Token savings verified (>80% vs native tools)
- [ ] Thinking phase executed (COMPREHENSIVE mode)
</success_criteria>

<error_recovery>

## Common Issues and Solutions

### Issue: File Not Found
- Check absolute path resolution
- Verify file exists with list_directory
- Suggest alternative paths

### Issue: Size Limit Exceeded
- Warn user about truncation
- Show which files were kept/dropped
- Suggest increasing --max-size

### Issue: No Index Files Found
- Offer to create index with --index flag
- Fall back to full content search (slower)

### Issue: CXML Parse Error
- Attempt partial parsing
- Extract readable sections
- Report specific parse errors

### Issue: Pattern Match Failed
- Explain pattern syntax
- Show what was matched (debug mode)
- Suggest pattern corrections

</error_recovery>

<examples>

## Example 1: Basic CXML Generation

```
/gsi:files-to-prompt src/commands/ --cxml --output commands.cxml
```

Output:
```xml
<documents>
<document index="1">
<source>C:\project\src\commands\help.ts</source>
<document_content>
import { Command } from './types';
// ... file content
</document_content>
</document>
...
</documents>
```

## Example 2: Filtered Conversion

```
/gsi:files-to-prompt . --include "*.md" --exclude "node_modules" --gitignore --output docs.cxml
```

## Example 3: Create Zero-Token Index

```
/gsi:files-to-prompt .planning/chats/chats.cxml --index
```

Output files:
- `.planning/chats/SEMANTIC-INDEX.cxml`
- `.planning/chats/SYMBOL-TABLE.json`
- `.planning/chats/CHUNK-MAP.json`
- `.planning/chats/ABSTRACT.md`

## Example 4: Query Index

```
/gsi:files-to-prompt --query "electrobun"
```

Output:
```
## Query Results for "electrobun"

### Features (1 match)
1. **electrobun** (100% match)
   - Decision: chosen
   - Alternatives: Electron
   - Reason: 14MB vs 150MB binary size
   - Source: chats.cxml line 25000

**Token Savings:** 99.9% (~1KB vs 326MB)
```

## Example 5: Line Numbers Output

```
/gsi:files-to-prompt src/index.ts --line-numbers --output index-with-lines.cxml
```

</examples>

<integration>

## Integration with Other GSI Commands

### /gsi:map-codebase
- Use files-to-prompt to generate codebase context bundles
- Store in `.planning/context/codebase-structure.xml`

### /gsi:plan-phase
- Generate phase context using files-to-prompt
- Include related files and references

### /gsi:execute-phase
- Create task-specific context bundles
- Load only necessary files per task

### /gsi:debug
- Generate context for debugging investigation
- Include error files and related code

## Hook Integration Points

### Pre-Workflow Context Generation
- Automatically generate context before execute-phase
- Store cached context in `.planning/context/`

### Post-Execution Context Update
- Invalidate cached context when files change
- Regenerate affected context bundles

</integration>
