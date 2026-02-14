# Phase 14: MCP Tool Optimization - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Optimize GSI workflows and commands to fully utilize all three MCP servers (DC, CI, CG) with emphasis on:
- Batch operations (read_multiple_files)
- CodeGraphContext graph analysis
- Code-Index symbol navigation
- Token efficiency benchmarking

This phase does NOT add new features — it optimizes existing tool usage.

</domain>

<decisions>
## Implementation Decisions

### read_multiple_files Usage
- MUST use read_multiple_files for 3+ file reads
- Token savings: 67-87% vs sequential read_file
- Batch size limit: 10 files per call

### CodeGraphContext Integration
- CG find_code for fuzzy code search (replaces some CI searches)
- CG analyze_code_relationships for dependency analysis
- CG find_dead_code for unused code detection
- CG execute_cypher_query for custom graph queries

### Code-Index MCP Enhancement
- get_symbol_body for function extraction
- build_deep_index for fresh symbol extraction
- get_file_summary for quick file analysis

### Tool Priority
- Skills → CG → CI → DC → Native (when all available)
- CG for relationship analysis (new priority)
- CI for symbol search and indexing
- DC for file operations and batch reading

### Claude's Discretion
- Exact batch sizes per operation
- Which CG queries to use for specific searches
- Cache invalidation timing

</decisions>

<specifics>
## Specific Ideas

- "Workflows should batch read all context files at once, not one-by-one"
- "CG has 11+ tools but we only use 2-3 — unlock the full potential"
- "Every workflow that searches code should use CG for relationship-aware search"

</specifics>

<deferred>
## Deferred Ideas

- New CG-based workflows (separate phase)
- Custom CG visualization features (separate phase)

</deferred>

---

*Phase: 14-mcp-tool-optimization*
*Context gathered: 2026-02-15*
