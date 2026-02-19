# Zero-Token Indexing System for GSI

## Purpose

Enable any LLM using GSI to understand the complete project state (phases, plans, features, decisions) without reading the full context. This system provides pre-indexed, compressed knowledge that can be queried without token expenditure.

## Architecture

### 1. SEMANTIC-INDEX.cxml
**Purpose**: Maps topics to line ranges in source files
**Format**: XML with topic→line mappings
**Usage**: `query("Phase 20") → lines 11747-11850`

### 2. SYMBOL-TABLE.json
**Purpose**: All phases/plans/features as queryable keys with summaries
**Format**: JSON key-value store
**Usage**: `symbols["Phase 20"] → {status, summary, files, tasks}`

### 3. ABSTRACT.md
**Purpose**: One-page overview of entire project
**Format**: Markdown summary
**Usage**: Load first for quick project understanding

### 4. CHUNK-MAP.json
**Purpose**: Hierarchical breakdown for progressive loading
**Format**: JSON with depth levels
**Usage**: Load chunks progressively based on query depth

## Token Savings

| Method | Tokens | Savings |
|--------|--------|---------|
| Full chats.cxml | 326MB | 0% |
| Symbol lookup | ~1KB | 99.9% |
| Chunk load | ~10KB | 99% |
| Semantic query | ~5KB | 99.5% |

## Implementation Plan

### Phase 1: Create SYMBOL-TABLE.json
- Extract all phases (1-49)
- Extract all plans (200+)
- Extract all features
- Create summary for each

### Phase 2: Create SEMANTIC-INDEX.cxml
- Parse chats.cxml
- Map topics to line ranges
- Create topic hierarchy

### Phase 3: Create ABSTRACT.md
- One-page project summary
- Key decisions documented
- Architecture overview

### Phase 4: Create CHUNK-MAP.json
- Hierarchical breakdown
- Progressive loading structure
- Query depth levels

## Usage Examples

```javascript
// Query a phase without loading full context
const phase = await gsi.index.query("Phase 20");
// Returns: {status: "55%", plans: 11, tasks: [...], summary: "..."}

// Query a feature
const feature = await gsi.index.query("electrobun");
// Returns: {decision: "chosen over Electron", reason: "14MB vs 150MB", ...}

// Progressive loading
const abstract = await gsi.index.loadAbstract();
const chunk = await gsi.index.loadChunk("Phase 49");
const detail = await gsi.index.loadDetail("49-I-PLAN.md");
```

## Integration with files-to-prompt

The GSI version of files-to-prompt will support:
1. **Write mode**: Generate cxml from files (original behavior)
2. **Read mode**: Index cxml for zero-token queries (new behavior)
3. **Query mode**: Direct lookup without loading full context

---

**Status**: Design Complete
**Next Steps**: Implement SYMBOL-TABLE.json extraction
