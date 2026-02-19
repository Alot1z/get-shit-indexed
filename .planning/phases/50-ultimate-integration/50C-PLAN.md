# 50C: Knowledge System Integration

---
phase: 50
plan: 50C
type: sub-plan
wave: 2
depends_on: [50A]
created: 2026-02-19
status: planned
files_modified:
  - lib/knowledge-system/index.ts
  - lib/knowledge-system/txtai.ts
  - lib/knowledge-system/arscontexta.ts
  - lib/knowledge-system/skill-compose.ts
autonomous: true
---

## Objective

Integrate 3 knowledge system repositories that provide semantic embeddings, context management, and skill composition.

## Must-Haves

### Truths
1. txtai semantic embeddings working locally
2. arscontexta context management functional
3. skill-compose composition patterns available

### Artifacts
- `lib/knowledge-system/index.ts` (min_lines: 50, contains: "export")
- `lib/knowledge-system/txtai.ts` (min_lines: 200, contains: "embedding")
- `lib/knowledge-system/arscontexta.ts` (min_lines: 150, contains: "context")
- `lib/knowledge-system/skill-compose.ts` (min_lines: 100, contains: "compose")

### Key Links
- txtai → provides semantic embeddings for knowledge search
- arscontexta → manages context lifecycle and storage
- skill-compose → composes skills from primitives

## Context

Building on Core Engine (50A), Knowledge System provides the storage and retrieval layer for patterns, skills, and learned behaviors.

## Tasks

### Task 1: Analyze txtai
- **Files**: lib/knowledge-system/txtai.ts
- **Action**: Clone https://github.com/neuml/txtai, analyze embedding architecture
- **Verify**: Embedding approach documented
- **Done**: ○

### Task 2: Implement Local Embeddings
- **Files**: lib/knowledge-system/txtai.ts
- **Action**: Implement local embedding generation (no external API)
- **Verify**: Embeddings generated for test content
- **Done**: ○

### Task 3: Add Semantic Index
- **Files**: lib/knowledge-system/semantic-index.ts
- **Action**: Create semantic index using embeddings
- **Verify**: Index supports similarity search
- **Done**: ○

### Task 4: Add Knowledge Graph Sync
- **Files**: lib/knowledge-system/graph-sync.ts
- **Action**: Sync embeddings to CodeGraphContext
- **Verify**: Graph nodes have embedding vectors
- **Done**: ○

### Task 5: Analyze arscontexta
- **Files**: lib/knowledge-system/arscontexta.ts
- **Action**: Analyze context management patterns
- **Verify**: Context lifecycle documented
- **Done**: ○

### Task 6: Implement Context Manager
- **Files**: lib/knowledge-system/arscontexta.ts
- **Action**: Implement context window management with priorities
- **Verify**: Context respects token limits
- **Done**: ○

### Task 7: Add Context Compression
- **Files**: lib/knowledge-system/context-compress.ts
- **Action**: Implement context compression using existing lib/context-optimization
- **Verify**: 80%+ compression achieved
- **Done**: ○

### Task 8: Implement Context Cache
- **Files**: lib/knowledge-system/context-cache.ts
- **Action**: Add LRU cache for frequently accessed context
- **Verify**: Cache hit rate >60%
- **Done**: ○

### Task 9: Analyze skill-compose
- **Files**: lib/knowledge-system/skill-compose.ts
- **Action**: Analyze skill composition patterns
- **Verify**: Composition rules documented
- **Done**: ○

### Task 10: Implement Skill Composer
- **Files**: lib/knowledge-system/skill-compose.ts
- **Action**: Implement skill composition from primitives
- **Verify**: Skills composable into workflows
- **Done**: ○

### Task 11: Add Skill Registry
- **Files**: lib/knowledge-system/skill-registry.ts
- **Action**: Create registry of available skills
- **Verify**: Registry lists all GSI skills
- **Done**: ○

### Task 12: Create Knowledge System Index
- **Files**: lib/knowledge-system/index.ts
- **Action**: Export all knowledge system modules
- **Verify**: Unified API available
- **Done**: ○

## Verification

- [ ] All 3 repositories analyzed
- [ ] txtai embeddings working locally
- [ ] arscontexta context management functional
- [ ] skill-compose patterns available
- [ ] 80%+ context compression
- [ ] 60%+ cache hit rate

## Output

Knowledge System module providing semantic search, context management, and skill composition.

---

**Estimated Duration:** 2 hours
**Wave:** 2 (depends on Core Engine, parallel with 50B)
