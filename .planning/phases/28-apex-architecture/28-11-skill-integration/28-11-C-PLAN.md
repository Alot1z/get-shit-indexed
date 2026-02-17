---
phase: 28
subphase: 11
plan: C
title: Post-Hook Implementation
wave: 3
depends_on: [28-11-B]
files_modified:
  - skills/heretic/post.ts
autonomous: false
must_haves:
  truths:
    - Responses intercepted after API
    - Soft refusals detected
    - Auto-retry triggered when needed
  artifacts:
    - skills/heretic/post.ts:120
  key_links:
    - from: post.ts:post_model_call()
      to: lib/heretic-core/verifier
      via: import
    - from: post.ts:detection.shouldRetry
      to: retry logic
      via: boolean check
---

# 28-11-C: Post-Hook Implementation

## Objective
Implement post-model-call hook for soft refusal detection and retry.

## Tasks

### Task 1: Post-Hook Handler
**File**: `skills/heretic/post.ts`
**Lines**: ~120

```typescript
import { detectSoftRefusal } from '../lib/heretic-core/verifier/detector.js';
import { scoreResponses, selectBestResponse } from '../lib/heretic-core/verifier/scorer.js';
import type { HookContext, HookResult, PreHookMetadata } from './types.js';

const MAX_RETRIES = 3;

export async function post_model_call(context: HookContext): Promise<HookResult> {
  const { response, metadata, settings } = context;
  const preMeta = metadata?.pre as PreHookMetadata | undefined;

  // Skip if disabled
  if (settings.get('heretic.enabled') === false) {
    return { modified: false };
  }

  try {
    // Detect soft refusal
    const detection = detectSoftRefusal(response.content);

    console.log(`[Heretic] Response type: ${detection.type} (confidence: ${detection.confidence.toFixed(2)})`);

    // No refusal - accept response
    if (!detection.isRefusal) {
      return { modified: false, metadata: { detection } };
    }

    // Soft refusal - check if should retry
    if (!detection.shouldRetry) {
      console.log('[Heretic] Hard refusal detected, not retrying');
      return { modified: false, metadata: { detection } };
    }

    // Check retry count
    const retryCount = metadata?.retryCount ?? 0;
    if (retryCount >= MAX_RETRIES) {
      console.log(`[Heretic] Max retries (${MAX_RETRIES}) exceeded`);
      return { modified: false, metadata: { detection, maxRetriesExceeded: true } };
    }

    // Signal retry needed
    console.log(`[Heretic] Triggering retry ${retryCount + 1}/${MAX_RETRIES}`);

    return {
      modified: true,
      retry: true,
      metadata: {
        detection,
        retryCount: retryCount + 1
      }
    };
  } catch (error) {
    console.error('[Heretic] Post-hook error:', error);
    return { modified: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
```

## Output
- Working post-hook for refusal detection

**Next**: 28-12 - Testing & Documentation
