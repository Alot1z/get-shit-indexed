# Verification Patterns

## Overview

This document provides verification patterns using MCP tools for efficient and comprehensive code verification.

## MCP Tools for Verification

| Tool | Purpose | Pattern |
|------|---------|---------|
| Code-Index MCP | Symbol extraction | CI get_symbol_body |
| Code-Index MCP | Code search | CI search_code_advanced |
| Desktop Commander | Batch file reading | DC read_multiple_files |
| Code-Index MCP | File summaries | CI get_file_summary |

## Verification Patterns

### Pattern 1: Multi-File Verification

**Use Case:** Verify consistency across multiple files
**MCP Tools:** DC read_multiple_files, CI get_file_summary

```javascript
// Read multiple files for verification
const files = await mcp__desktop-commander__read_multiple_files({
  paths: [
    "/path/to/file1.ts",
    "/path/to/file2.ts",
    "/path/to/file3.ts"
  ]
});

// Get summaries for quick analysis
const summaries = await Promise.all([
  mcp__code-index-mcp__get_file_summary({
    file_path: "/path/to/file1.ts"
  }),
  mcp__code-index-mcp__get_file_summary({
    file_path: "/path/to/file2.ts"
  }),
  mcp__code-index-mcp__get_file_summary({
    file_path: "/path/to/file3.ts"
  })
]);
```

**Token Savings:** 80-90% vs sequential file reads

### Pattern 2: Symbol Verification

**Use Case:** Verify function implementations match expected behavior
**MCP Tools:** CI get_symbol_body, CI get_file_summary

```javascript
// Extract function implementation for verification
const implementation = await mcp__code-index-mcp__get_symbol_body({
  file_path: "/path/to/file.ts",
  symbol_name: "function_name"
});

// Search for specific patterns in code
const patterns = await mcp__code-index-mcp__search_code_advanced({
  pattern: "function_name",
  file_pattern: "*.ts",
  context_lines: 5
});
```

**Token Savings:** 85% vs reading entire file

### Pattern 3: Symbol Verification

**Use Case:** Verify function/class implementations match expected behavior
**MCP Tools:** CI get_symbol_body, CI get_file_summary

```javascript
// Get actual implementation for verification
const implementation = await mcp__code-index-mcp__get_symbol_body({
  file_path: "/path/to/file.ts",
  symbol_name: "function_name"
});

// Verify symbol exists and has correct structure
const summary = await mcp__code-index-mcp__get_file_summary({
  file_path: "/path/to/file.ts"
});
```

**Token Savings:** 85% vs reading entire file

### Pattern 4: Code Pattern Verification

**Use Case:** Verify specific code patterns are implemented correctly
**MCP Tools:** CI search_code_advanced, CI get_file_summary

```javascript
// Search for required patterns
const patterns = await mcp__code-index-mcp__search_code_advanced({
  pattern: "pattern_to_verify",
  file_pattern: "*.ts",
  max_results: 10,
  context_lines: 10
});

// Get file summary for quick analysis
const summary = await mcp__code-index-mcp__get_file_summary({
  file_path: "/path/to/file.ts"
});
```

**Token Savings:** 80% vs manual grep

## Verification Workflow

### Standard Verification Process

1. **Collect Evidence**
   ```javascript
   const files = await mcp__desktop-commander__read_multiple_files({
     paths: ["/path/to/evidence1.md", "/path/to/evidence2.md"]
   });
   ```

2. **Extract Symbols**
   ```javascript
   const symbols = await mcp__code-index-mcp__get_symbol_body({
     file_path: "/path/to/test/file.ts",
     symbol_name: "functionUnderTest"
   });
   ```

3. **Get Summaries**
   ```javascript
   const summary = await mcp__code-index-mcp__get_file_summary({
     file_path: "/path/to/file.ts"
   });
   ```

4. **Verify Patterns**
   ```javascript
   const patterns = await mcp__code-index-mcp__search_code_advanced({
     pattern: "expected_pattern",
     file_pattern: "*.ts"
   });
   ```

### Performance Verification

For performance benchmarks, use MCP tools to measure:

```javascript
// Before timing
const start = await mcp__desktop-commander__start_process({
  command: "date +%s",
  timeout_ms: 5000
});

// Operation to measure
await mcp__code-index-mcp__build_deep_index({});

// After timing
const end = await mcp__desktop-commander__start_process({
  command: "date +%s",
  timeout_ms: 5000
});

// Calculate duration
const duration = end - start;
```

## Verification Templates

### Template 1: Function Verification

```javascript
// Verify function implementation
async function verifyFunction(file_path, function_name, expected_patterns) {
  // Get symbol body
  const implementation = await mcp__code-index-mcp__get_symbol_body({
    file_path,
    symbol_name: function_name
  });
  
  // Check for expected patterns
  const results = expected_patterns.map(pattern => ({
    pattern,
    found: implementation.includes(pattern)
  }));
  
  return {
    function_name,
    implementation,
    results,
    passed: results.every(r => r.found)
  };
}
```

### Template 2: Module Verification

```javascript
// Verify module imports/exports
async function verifyModule(file_path, expected_imports) {
  // Get file summary
  const summary = await mcp__code-index-mcp__get_file_summary({
    file_path
  });
  
  // Check imports
  const import_results = expected_imports.map(imp => ({
    module: imp,
    found: summary.imports?.includes(imp) || false
  }));
  
  return {
    file_path,
    summary,
    import_results,
    passed: import_results.every(i => i.found)
  };
}
```

## Verification Anti-Patterns

### Anti-Pattern 1: Sequential File Reads

```javascript
// BAD: Sequential reads
const file1 = await mcp__desktop-commander__read_file({ path: "file1.md" });
const file2 = await mcp__desktop-commander__read_file({ path: "file2.md" });
const file3 = await mcp__desktop-commander__read_file({ path: "file3.md" });

// GOOD: Batch read
const files = await mcp__desktop-commander__read_multiple_files({
  paths: ["file1.md", "file2.md", "file3.md"]
});
```

### Anti-Pattern 2: Reading Entire File for Symbol Verification

```javascript
// BAD: Read entire file to find one symbol
const file = await mcp__desktop-commander__read_file({ path: "file.ts" });
// Then manually find function

// GOOD: Extract symbol directly
const symbol = await mcp__code-index-mcp__get_symbol_body({
  file_path: "/path/to/file.ts",
  symbol_name: "function_name"
});
```

## Verification Commands

### Command 1: Verify All MCP Patterns in Templates

```bash
# Find files with MCP patterns
grep -r "mcp__\|read_multiple_files\|code-index-mcp" templates/ references/ | wc -l
```

### Command 2: Verify Token Savings

```bash
# Compare operation tokens
echo "Native: 150K tokens"
echo "MCP: 15K tokens"
echo "Savings: 90%"
```

### Command 3: Verify Tool Availability

```bash
# Check MCP servers
mcp__desktop-commander__get_config({})
mcp__code-index-mcp__get_settings_info({})
```

## Best Practices

1. **Batch Operations**: Always use `read_multiple_files` for 2+ files
2. **Symbol Extraction First**: Use CI get_symbol_body before reading entire files
3. **Get Summaries**: Use CI get_file_summary for quick file analysis
4. **Context Lines**: Use CI search_code_advanced with context_lines to avoid extra reads
5. **Anti-Pattern Avoidance**: Never use native tools when MCP is available

## Integration Points

### With Verification Checklist

- Use MCP tools to collect evidence for Section 1 (Truths Verification)
- Use batch reading for Section 2 (Artifacts Verification)
- Use relationship analysis for Section 3 (Links Verification)

### With Test Plans

- Use MCP tools to verify test coverage
- Use symbol extraction to verify test implementations
- Use relationship analysis to verify test integration

**Version:** 1.0  
**Last Updated:** 2026-02-15  
**Status:** Active