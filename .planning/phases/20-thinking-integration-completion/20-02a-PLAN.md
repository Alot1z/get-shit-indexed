# Phase 20-02a: Thinking Mode Selector

## Objective
Create a thinking mode selector that determines which thinking server to use based on tool type and operation context.

## Problem Analysis

**Current State:**
- No automatic selection of thinking servers based on tool type
- hooks.json has tool mappings but they're not used
- Each tool operation should trigger appropriate thinking

**Solution:**
Create a selector module that maps tools to thinking servers and generates context-aware prompts.

## Tasks

### Task 1: Define Tool Categories
```
<task>
Define tool categories and their thinking requirements.

1. Create lib/thinking/categories.js
2. Define categories:
   - FILE_OPS: read_file, write_file, edit_block, list_directory
   - PROCESS_OPS: start_process, interact_with_process, kill_process
   - CODE_OPS: search_code_advanced, find_files, get_symbol_body
   - GRAPH_OPS: query, analyze_code_relationships, find_path
   - DEBUG_OPS: debug_thinking
   - COMPLEX_OPS: build_deep_index, analyze_impact
3. Add category properties (thinking_mode, timeout, priority)
4. Export for use by selector
</task>

<files>
lib/thinking/categories.js
</files>

<acceptance>
- All 50+ MCP tools categorized
- Category properties defined
- Exported for selector use
</acceptance>
```

### Task 2: Create Server Mapping
```
<task>
Create mapping from categories to thinking servers.

1. Create lib/thinking/server-mapping.js
2. Map categories to servers:
   - FILE_OPS → Sequential (step-by-step file reasoning)
   - PROCESS_OPS → Sequential (process flow reasoning)
   - CODE_OPS → Tractatus (logical code structure)
   - GRAPH_OPS → Tractatus (relationship analysis)
   - DEBUG_OPS → Debug (problem solving)
   - COMPLEX_OPS → Tractatus + Sequential (combined)
3. Add mode variations (lightweight, standard, comprehensive)
4. Add fallback logic when servers unavailable
</task>

<files>
lib/thinking/server-mapping.js
</files>

<acceptance>
- All categories mapped to servers
- Mode variations defined
- Fallback logic implemented
</acceptance>
```

### Task 3: Implement Mode Selection Logic
```
<task>
Implement the mode selection logic based on tool and context.

1. Create lib/thinking/mode-selector.js
2. Implement selectMode(toolName, context) function:
   - Get tool category
   - Get server mapping
   - Determine mode based on context (file size, complexity)
   - Return mode config with server and prompt template
3. Add context factors:
   - File size (small → lightweight, large → comprehensive)
   - Operation count (single → lightweight, batch → standard)
   - Error state (error → comprehensive debug)
4. Add configuration override support
</task>

<files>
lib/thinking/mode-selector.js
</files>

<acceptance>
- selectMode function works for all tools
- Context factors considered
- Configuration override works
</acceptance>
```

### Task 4: Create Prompt Templates
```
<task>
Create prompt templates for each thinking server.

1. Create lib/thinking/prompts/sequential.js
2. Create lib/thinking/prompts/tractatus.js
3. Create lib/thinking/prompts/debug.js
4. Each template includes:
   - File operation prompts (what to expect, validation)
   - Process operation prompts (flow, error handling)
   - Code operation prompts (structure, patterns)
5. Add context injection (file paths, operation details)
</task>

<files>
lib/thinking/prompts/sequential.js
lib/thinking/prompts/tractatus.js
lib/thinking/prompts/debug.js
</files>

<acceptance>
- Templates for all three servers
- Context injection works
- All operation types covered
</acceptance>
```

### Task 5: Create Unified Selector API
```
<task>
Create unified API for thinking mode selection.

1. Create lib/thinking/selector.js
2. Export:
   - selectMode(toolName, context)
   - getThinkingServer(toolName)
   - getPromptTemplate(toolName, context)
   - getTimeout(toolName)
3. Add caching for repeated operations
4. Add metrics logging
5. Export index for easy import
</task>

<files>
lib/thinking/selector.js
lib/thinking/index.js
</files>

<acceptance>
- Unified API created
- Caching works
- Metrics logged
- Easy import pattern
</acceptance>
```

### Task 6: Test Mode Selection
```
<task>
Test mode selection for various tool types.

1. Create tests/thinking/selector.test.js
2. Test cases:
   - File ops → Sequential
   - Code ops → Tractatus
   - Debug ops → Debug
   - Complex ops → Combined
3. Test context factors:
   - Small file → lightweight
   - Large file → comprehensive
   - Error state → debug mode
4. Document test results
</task>

<files>
tests/thinking/selector.test.js
</files>

<acceptance>
- All tool types tested
- Context factors verified
- Test results documented
</acceptance>
```

## Verification

**Must Have:**
- [ ] Tool categories defined
- [ ] Server mapping created
- [ ] Mode selection logic works
- [ ] Prompt templates created
- [ ] Unified API exported

## Estimated Duration
10-12 minutes (6 tasks)

## Dependencies
- None (foundation module)
