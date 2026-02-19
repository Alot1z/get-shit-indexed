# GSI Executive Summary

> Get Shit Indexed v1.27.0 | 2026-02-19

## Quick Stats

| Metric | Value |
|--------|-------|
| **Version** | 1.27.0 |
| **Phases Completed** | 50 |
| **Integrated Repos** | 20 |
| **Tests** | 56 |
| **Token Savings** | 80-98% |

## What GSI Does

GSI is a token-efficient development system for Claude Code that:

1. **Reduces token usage by 80-98%** through MCP tools
2. **Provides spec-driven workflows** for complex projects
3. **Validates quality** with 7-BMAD framework
4. **Integrates 20 specialized repositories** in 6 layers

## Key Commands

```
/gsi:progress        → Check status, route to action
/gsi:execute-phase N → Execute phase plans
/gsi:discuss-phase N → Gather context
/gsi:yolo            → Auto-approve mode
```

## Architecture

```
Commands (33) → Workflows (30) → Agents (12) → Hooks (15)
                                              ↓
                            Library (236 files) → MCP Servers
                                              ↓
                                   CodeGraph + Desktop + Index
```

## Tool Priority

**CRITICAL: Native tools BLOCKED when MCP available**

```
Skills (90% savings) > MCP (70% savings) > Native (0%)
```

## Token Comparison

| Operation | Native | GSI | Savings |
|-----------|--------|-----|---------|
| Read file | 15K | 1K | 93% |
| Search code | 15K | 2K | 87% |
| Execute phase | 100K | 5K | 95% |

## Quality Framework (7-BMAD)

1. **Method** - Implementation correctness
2. **Mad** - Integration completeness
3. **Model** - Architecture alignment
4. **Mode** - Pattern consistency
5. **Mod** - Maintainability
6. **Modd** - Extensibility
7. **Methodd** - Documentation

## Current Status

- ✅ **Phase 50**: 20 repositories integrated
- ✅ **BOM Fix**: 118 files cleaned
- 📋 **Phase 51**: CLI/MCP conversion planned
- ⏳ **Phases 25-27**: Plans exist, need execution

## Key Files

| File | Purpose |
|------|---------|
| `.planning/ROADMAP.md` | Project roadmap |
| `.planning/STATE.md` | Current state |
| `.planning/GSI-COMPLETE-MAPPING.md` | Full documentation |
| `llms.txt` | LLM-optimized summary |

## Next Actions

1. **Execute Phase 51** for 98% token savings
2. **Complete phases 25-27** (semantic, context, SDK)
3. **Increase test coverage** to 90%+
4. **Convert to TypeScript** for type safety

---

*For full documentation, see `.planning/GSI-COMPLETE-MAPPING.md`*
