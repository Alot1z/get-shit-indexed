# Phase 14: MCP Tool Optimization - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Optimize ALL GSI files to use MCP tools (DC, CI, CG) instead of native tools.

**Scope includes:**
- Agents (11 files in `agents/`)
- Commands (29 files in `commands/gsi/`)
- Workflows (30 files in `~/.claude/get-shit-indexed/workflows/`)
- Hooks (5 files in `hooks/` and `.claude/hooks/`)
- References (18 files in `references/`)
- Templates (20 files in `templates/`)
- Scripts (1 file in `scripts/`)
- Bin (2 files in `bin/`)

**NOT in scope:**
- Adding new features
- Changing existing behavior
- Modifying test files

</domain>

<decisions>

### MCP Tool Priority Hierarchy

1. **read_multiple_files** (Desktop Commander) - Use for batch file reading
   - 67-87% token savings vs sequential Read calls
   - Priority: Use whenever reading 2+ files

2. **CodeGraphContext (CG)** - Use for relationship analysis
   - `analyze_code_relationships` - Caller/callee, class hierarchy
   - `find_code` - Fuzzy code search
   - `get_repository_stats` - Repository metrics
   - Priority: Use for architecture/dependency analysis

3. **Code-Index MCP (CI)** - Use for symbol navigation
   - `get_symbol_body` - Extract function/class implementations
   - `get_file_summary` - File metadata and structure
   - `search_code_advanced` - Fast indexed search
   - Priority: Use for code exploration and symbol extraction

4. **Desktop Commander (DC)** - Use for file/process operations
   - `read_file`, `write_file`, `edit_block` - File operations
   - `start_process`, `interact_with_process` - Process operations
   - `list_directory`, `start_search` - Discovery operations
   - Priority: Primary tool for file/process work

### Implementation Approach

**Per-category updates:**

1. **Agents** (11 files)
   - Add CG tools to allowed-tools frontmatter
   - Add CI tools to allowed-tools frontmatter
   - Add `read_multiple_files` pattern examples
   - Update agent instructions to use CG/CI before DC

2. **Commands** (29 files)
   - Expand allowed-tools with CG and CI tools
   - Add code_index_mcp sections with tool priorities
   - Include read_multiple_files in batch patterns

3. **Workflows** (30 files)
   - Replace sequential Read calls with read_multiple_files
   - Add CG analysis steps before DC operations
   - Add CI symbol navigation for code exploration

4. **Hooks** (5 files)
   - Consider MCP-native alternatives where possible
   - Document why native fs may still be needed for hooks

5. **References** (18 files)
   - Update documentation patterns to show MCP priority
   - Add CG/CI usage examples

6. **Templates** (20 files)
   - Include MCP tool usage patterns
   - Add thinking server invocation sections

### Claude's Discretion

- Exact wording of instructions
- Order of tool presentation in docs
- Which specific CG queries to recommend

</decisions>

<specifics>

## Specific Ideas

- **Golden Pattern Enhancement:** CG discover → CI understand → DC act
- **Batch Reading Pattern:** Use `read_multiple_files` for 2+ files
- **Relationship Analysis:** Use CG before making structural changes
- **Symbol Extraction:** Use CI for code navigation, not manual reading

## Key Token Savings

| Pattern | Old Approach | New Approach | Savings |
|---------|--------------|--------------|---------|
| Read 3 files | 3× Read calls | 1× read_multiple_files | 67-87% |
| Find callers | Grep + manual | CG analyze_code_relationships | 80% |
| Get symbol | Read whole file | CI get_symbol_body | 90% |
| Code search | Native Grep | CI search_code_advanced | 70% |

</specifics>

<deferred>

## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 14-mcp-tool-optimization*
*Context gathered: 2026-02-15*
