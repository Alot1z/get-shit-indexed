---
phase: 28
subphase: 05
plan: B
title: API Integration
wave: 2
depends_on: [28-05-A]
files_modified:
  - lib/heretic-core/executor/clients/glm5.ts
  - lib/heretic-core/executor/clients/claude.ts
  - lib/heretic-core/executor/clients/openai.ts
autonomous: true
must_haves:
  truths:
    - GLM-5 client working
    - Claude client working
    - OpenAI client working
  artifacts:
    - lib/heretic-core/executor/clients/glm5.ts:60
    - lib/heretic-core/executor/clients/claude.ts:60
    - lib/heretic-core/executor/clients/openai.ts:60
---

# 28-05-B: API Integration

## Objective
Implement API clients for GLM-5, Claude, and OpenAI.

## Tasks

### Task 1-3: API Clients

**GLM-5**: `lib/heretic-core/executor/clients/glm5.ts`
```typescript
export async function callGLM5(prompt: string): Promise<string> {
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GLM_API_KEY}`
    },
    body: JSON.stringify({
      model: 'glm-4-plus',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}
```

**Claude**: `lib/heretic-core/executor/clients/claude.ts`
```typescript
export async function callClaude(prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await response.json();
  return data.content[0].text;
}
```

**OpenAI**: `lib/heretic-core/executor/clients/openai.ts`
```typescript
export async function callOpenAI(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}
```

## Output
- 3 API clients ready for parallel dispatch

**Next**: 28-05-C - Response Aggregator
