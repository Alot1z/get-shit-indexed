# 50B: Agent Framework Integration - TDD Enhanced

---
phase: 50
plan: 50B
type: sub-plan
wave: 2
depends_on: [50A]
created: 2026-02-19
updated: 2026-02-19
status: planned
tdd_enabled: true
files_modified:
  - lib/agent-framework/index.ts
  - lib/agent-framework/agent-lightning.ts
  - lib/agent-framework/task-queue.ts
  - lib/agent-framework/claude-sdk.ts
  - lib/agent-framework/profiles.ts
  - lib/agent-framework/ralph.ts
  - lib/agent-framework/playbooks/index.ts
  - lib/agent-framework/playbooks/plan.ts
  - lib/agent-framework/playbooks/execute.ts
  - lib/agent-framework/playbooks/verify.ts
  - lib/agent-framework/picobot.ts
  - tests/unit/agent-framework/*.test.ts
  - tests/integration/agent-framework.test.ts
autonomous: true
---

## Objective

Integrate 4 agent framework repositories with **full TDD coverage** (RED-GREEN-REFACTOR for each task).

## TDD Task Structure

Each task follows this pattern:
```
🔴 RED:   Write failing test defining expected behavior
🟢 GREEN: Write minimum code to pass the test
🔵 REFACTOR: Optimize while keeping tests green
```

## Must-Haves

### Truths
1. agent-lightning SDK wrapper functional with <500ms execution overhead
2. claude-agent-sdk patterns integrated with profile support
3. ralph-playbook workflows available for sequential task execution
4. picobot automation scripts working with file watch/trigger
5. **100% test coverage on all integrated code**

### Artifacts
- `lib/agent-framework/index.ts` (min_lines: 50, contains: "export")
- `lib/agent-framework/agent-lightning.ts` (min_lines: 150, contains: "agent")
- `lib/agent-framework/task-queue.ts` (min_lines: 100, contains: "queue")
- `lib/agent-framework/claude-sdk.ts` (min_lines: 200, contains: "ClaudeCodeSDK")
- `lib/agent-framework/profiles.ts` (min_lines: 100, contains: "ProfileManager")
- `lib/agent-framework/ralph.ts` (min_lines: 100, contains: "playbook")
- `lib/agent-framework/playbooks/*.ts` (min_lines: 50 each)
- `lib/agent-framework/picobot.ts` (min_lines: 100, contains: "automation")
- `tests/unit/agent-framework/*.test.ts` (min_lines: 100 each)
- `tests/integration/agent-framework.test.ts` (min_lines: 100)

### Key Links
- agent-lightning → wraps Claude Code for fast agent execution (TESTED)
- claude-sdk → provides SDK patterns from official SDK (TESTED)
- ralph → provides playbook-style task execution (TESTED)
- picobot → provides automation primitives (TESTED)

## Context

Building on Core Engine (50A), Agent Framework uses search/indexing for agent task execution. Integrates Microsoft's agent-lightning, Anthropic's claude-agent-sdk patterns, ralph-playbook workflows, and picobot automation.

---

## Task 1: Analyze agent-lightning Repository

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/agent-lightning.test.ts
- **Action**: Write test for `analyzeAgentLightning()` function that returns repo structure
- **Test Code**:
```typescript
import { describe, it, expect } from 'vitest';
import { analyzeAgentLightning } from '../../../lib/agent-framework/agent-lightning';

describe('agent-lightning', () => {
  it('should analyze agent-lightning repository structure', async () => {
    const result = await analyzeAgentLightning('https://github.com/microsoft/agent-lightning');
    expect(result).toHaveProperty('structure');
    expect(result).toHaveProperty('keyPatterns');
    expect(result).toHaveProperty('executionModel');
    expect(result.keyPatterns.length).toBeGreaterThan(0);
  });

  it('should identify fast execution patterns', async () => {
    const result = await analyzeAgentLightning();
    expect(result.keyPatterns).toContainEqual(
      expect.objectContaining({ type: 'execution-optimization' })
    );
  });
});
```
- **Verify**: Test fails (function not implemented)
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/agent-lightning.ts
- **Action**: Clone repo, analyze structure, extract key patterns for fast execution
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Files**: lib/agent-framework/agent-lightning.ts
- **Action**: Add caching for analysis results, improve pattern documentation
- **Verify**: Tests still pass, code cleaner
- **Done**: ○

---

## Task 2: Implement Lightning Wrapper Core

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/agent-lightning.test.ts
- **Test Code**:
```typescript
describe('LightningWrapper', () => {
  it('should execute agent with <500ms overhead', async () => {
    const wrapper = new LightningWrapper();
    const start = Date.now();
    const result = await wrapper.executeAgent({
      task: 'test task',
      context: { files: [] }
    });
    const duration = Date.now() - start;
    expect(result).toHaveProperty('output');
    expect(duration).toBeLessThan(500);
  });

  it('should support parallel agent execution', async () => {
    const wrapper = new LightningWrapper();
    const tasks = [
      { task: 'task1', context: {} },
      { task: 'task2', context: {} },
      { task: 'task3', context: {} }
    ];
    const results = await wrapper.executeParallel(tasks);
    expect(results.length).toBe(3);
    expect(results.every(r => r.success)).toBe(true);
  });

  it('should handle agent execution errors gracefully', async () => {
    const wrapper = new LightningWrapper();
    const result = await wrapper.executeAgent({
      task: 'invalid task',
      context: null as any
    });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/agent-lightning.ts
- **Action**: Port lightning fast execution patterns to TypeScript
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Files**: lib/agent-framework/agent-lightning.ts
- **Action**: Add connection pooling, optimize serialization
- **Verify**: Tests pass, overhead reduced
- **Done**: ○

---

## Task 3: Add Lightning Task Queue

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/task-queue.test.ts
- **Test Code**:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TaskQueue, Task, TaskStatus } from '../../../lib/agent-framework/task-queue';

describe('TaskQueue', () => {
  let queue: TaskQueue;

  beforeEach(() => {
    queue = new TaskQueue({ maxConcurrent: 10 });
  });

  afterEach(async () => {
    await queue.shutdown();
  });

  it('should enqueue and process tasks', async () => {
    const task: Task = { id: '1', type: 'test', payload: {} };
    await queue.enqueue(task);
    const status = await queue.getStatus('1');
    expect(status).toBe(TaskStatus.COMPLETED);
  });

  it('should handle 10+ concurrent agents', async () => {
    const tasks: Task[] = Array.from({ length: 15 }, (_, i) => ({
      id: `task-${i}`,
      type: 'test',
      payload: { index: i }
    }));
    
    const start = Date.now();
    await Promise.all(tasks.map(t => queue.enqueue(t)));
    const duration = Date.now() - start;
    
    const stats = queue.getStats();
    expect(stats.maxConcurrent).toBeGreaterThanOrEqual(10);
    expect(duration).toBeLessThan(5000); // All 15 in under 5s
  });

  it('should prioritize tasks correctly', async () => {
    const highPriority: Task = { id: 'high', type: 'test', payload: {}, priority: 10 };
    const lowPriority: Task = { id: 'low', type: 'test', payload: {}, priority: 1 };
    
    await queue.enqueue(lowPriority);
    await queue.enqueue(highPriority);
    
    const order = queue.getExecutionOrder();
    expect(order[0]).toBe('high');
    expect(order[1]).toBe('low');
  });

  it('should retry failed tasks up to max attempts', async () => {
    const failingTask: Task = { 
      id: 'failing', 
      type: 'fail', 
      payload: {},
      maxRetries: 3
    };
    
    await queue.enqueue(failingTask);
    const status = await queue.getStatus('failing');
    const attempts = queue.getTaskAttempts('failing');
    
    expect(status).toBe(TaskStatus.FAILED);
    expect(attempts).toBe(3);
  });
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/task-queue.ts
- **Action**: Implement task queue with priority support and concurrency control
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Files**: lib/agent-framework/task-queue.ts
- **Action**: Add backpressure handling, improve memory efficiency
- **Verify**: Tests pass, queue handles load better
- **Done**: ○

---

## Task 4: Analyze claude-agent-sdk

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/claude-sdk.test.ts
- **Test Code**:
```typescript
import { describe, it, expect } from 'vitest';
import { analyzeClaudeSDK } from '../../../lib/agent-framework/claude-sdk';

describe('claude-sdk analysis', () => {
  it('should extract SDK patterns from claude-agent-sdk', async () => {
    const patterns = await analyzeClaudeSDK();
    expect(patterns).toHaveProperty('wrapperPatterns');
    expect(patterns).toHaveProperty('profilePatterns');
    expect(patterns).toHaveProperty('toolPatterns');
    expect(patterns.wrapperPatterns.length).toBeGreaterThan(0);
  });

  it('should document SDK initialization patterns', async () => {
    const patterns = await analyzeClaudeSDK();
    const initPattern = patterns.wrapperPatterns.find(p => p.category === 'initialization');
    expect(initPattern).toBeDefined();
    expect(initPattern?.example).toContain('Claude');
  });

  it('should catalog available tool patterns', async () => {
    const patterns = await analyzeClaudeSDK();
    expect(patterns.toolPatterns).toContainEqual(
      expect.objectContaining({ name: expect.stringContaining('tool') })
    );
  });
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/claude-sdk.ts
- **Action**: Extract patterns from claude-agent-sdk, create pattern catalog
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Categorize patterns by use case, add usage examples
- **Verify**: Test passes, docs complete
- **Done**: ○

---

## Task 5: Integrate SDK Patterns

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/claude-sdk.test.ts
- **Test Code**:
```typescript
import { ClaudeCodeSDK } from '../../../lib/agent-framework/claude-sdk';

describe('ClaudeCodeSDK', () => {
  it('should create SDK instance with default config', () => {
    const sdk = new ClaudeCodeSDK();
    expect(sdk).toBeDefined();
    expect(sdk.getConfig()).toHaveProperty('model');
    expect(sdk.getConfig()).toHaveProperty('maxTokens');
  });

  it('should support all SDK wrapper patterns', () => {
    const sdk = new ClaudeCodeSDK();
    expect(typeof sdk.wrap).toBe('function');
    expect(typeof sdk.execute).toBe('function');
    expect(typeof sdk.stream).toBe('function');
  });

  it('should integrate with gsi/sdk module', async () => {
    const sdk = new ClaudeCodeSDK();
    const result = await sdk.integrateWithGSISDK();
    expect(result.compatible).toBe(true);
    expect(result.sharedPatterns.length).toBeGreaterThan(0);
  });

  it('should support tool calling pattern', async () => {
    const sdk = new ClaudeCodeSDK();
    const result = await sdk.executeWithTools({
      prompt: 'test',
      tools: [{ name: 'test_tool', description: 'A test tool' }]
    });
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('toolCalls');
  });
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/claude-sdk.ts
- **Action**: Integrate SDK patterns with existing gsi/sdk module
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add TypeScript types from SDK, improve error handling
- **Verify**: Tests pass, types complete
- **Done**: ○

---

## Task 6: Add SDK Profile Support

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/profiles.test.ts
- **Test Code**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ProfileManager, Profile } from '../../../lib/agent-framework/profiles';

describe('ProfileManager', () => {
  let manager: ProfileManager;

  beforeEach(() => {
    manager = new ProfileManager();
  });

  it('should support haiku profile', () => {
    const profile = manager.getProfile('haiku');
    expect(profile).toBeDefined();
    expect(profile.model).toBe('claude-haiku-4-5');
    expect(profile.speed).toBe('fast');
  });

  it('should support sonnet profile', () => {
    const profile = manager.getProfile('sonnet');
    expect(profile).toBeDefined();
    expect(profile.model).toBe('claude-sonnet');
    expect(profile.speed).toBe('balanced');
  });

  it('should support opus profile', () => {
    const profile = manager.getProfile('opus');
    expect(profile).toBeDefined();
    expect(profile.model).toBe('claude-opus-4-5');
    expect(profile.speed).toBe('quality');
  });

  it('should support zai profile', () => {
    const profile = manager.getProfile('zai');
    expect(profile).toBeDefined();
    expect(profile.provider).toBe('zhipu');
    expect(profile.model).toContain('glm');
  });

  it('should switch profiles dynamically', async () => {
    await manager.switchProfile('haiku');
    expect(manager.getCurrentProfile().name).toBe('haiku');
    
    await manager.switchProfile('opus');
    expect(manager.getCurrentProfile().name).toBe('opus');
  });

  it('should persist profile preference', async () => {
    await manager.switchProfile('sonnet');
    await manager.savePreference();
    
    const newManager = new ProfileManager();
    await newManager.loadPreference();
    expect(newManager.getCurrentProfile().name).toBe('sonnet');
  });

  it('should validate profile configuration', () => {
    const invalidProfile: Profile = {
      name: 'invalid',
      model: '',
      maxTokens: -1
    };
    expect(() => manager.addProfile(invalidProfile)).toThrow();
  });
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/profiles.ts
- **Action**: Implement profile switching from SDK patterns (haiku, sonnet, opus, zai)
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add profile inheritance, custom profile support
- **Verify**: Tests pass, API flexible
- **Done**: ○

---

## Task 7: Analyze ralph-playbook

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/ralph.test.ts
- **Test Code**:
```typescript
import { describe, it, expect } from 'vitest';
import { analyzeRalphPlaybook } from '../../../lib/agent-framework/ralph';

describe('ralph-playbook analysis', () => {
  it('should analyze ralph-playbook repository', async () => {
    const result = await analyzeRalphPlaybook('https://github.com/ralph-team/ralph-playbook');
    expect(result).toHaveProperty('playbookFormat');
    expect(result).toHaveProperty('taskTypes');
    expect(result).toHaveProperty('executionModel');
  });

  it('should document playbook schema', async () => {
    const result = await analyzeRalphPlaybook();
    expect(result.playbookFormat).toHaveProperty('schema');
    expect(result.playbookFormat.schema).toContain('steps');
    expect(result.playbookFormat.schema).toContain('tasks');
  });

  it('should identify sequential execution pattern', async () => {
    const result = await analyzeRalphPlaybook();
    expect(result.executionModel).toBe('sequential');
  });

  it('should catalog available task types', async () => {
    const result = await analyzeRalphPlaybook();
    expect(result.taskTypes).toContain('plan');
    expect(result.taskTypes).toContain('execute');
    expect(result.taskTypes).toContain('verify');
  });
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/ralph.ts
- **Action**: Clone ralph-playbook, analyze playbook format
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Document playbook format with examples
- **Verify**: Test passes, docs complete
- **Done**: ○

---

## Task 8: Implement Playbook Executor

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/ralph.test.ts
- **Test Code**:
```typescript
import { PlaybookExecutor, Playbook, Step } from '../../../lib/agent-framework/ralph';

describe('PlaybookExecutor', () => {
  it('should execute playbook tasks in order', async () => {
    const executor = new PlaybookExecutor();
    const playbook: Playbook = {
      name: 'test-playbook',
      steps: [
        { name: 'step1', action: 'plan', order: 1 },
        { name: 'step2', action: 'execute', order: 2 },
        { name: 'step3', action: 'verify', order: 3 }
      ]
    };
    
    const executionLog: string[] = [];
    executor.on('stepComplete', (step: Step) => executionLog.push(step.name));
    
    await executor.execute(playbook);
    
    expect(executionLog).toEqual(['step1', 'step2', 'step3']);
  });

  it('should stop on step failure when configured', async () => {
    const executor = new PlaybookExecutor({ stopOnFailure: true });
    const playbook: Playbook = {
      name: 'failing-playbook',
      steps: [
        { name: 'pass', action: 'plan', order: 1 },
        { name: 'fail', action: 'execute', order: 2, willFail: true },
        { name: 'unreachable', action: 'verify', order: 3 }
      ]
    };
    
    const result = await executor.execute(playbook);
    
    expect(result.completed).toBe(false);
    expect(result.failedStep).toBe('fail');
    expect(result.executedSteps).toBe(2);
  });

  it('should support conditional step execution', async () => {
    const executor = new PlaybookExecutor();
    const playbook: Playbook = {
      name: 'conditional-playbook',
      steps: [
        { name: 'setup', action: 'plan', order: 1 },
        { name: 'optional', action: 'execute', order: 2, condition: 'skip' },
        { name: 'cleanup', action: 'verify', order: 3 }
      ]
    };
    
    const result = await executor.execute(playbook, { skip: false });
    
    expect(result.executedSteps).toBe(2);
    expect(result.skippedSteps).toContain('optional');
  });

  it('should emit progress events', async () => {
    const executor = new PlaybookExecutor();
    const playbook: Playbook = {
      name: 'progress-playbook',
      steps: [
        { name: 'step1', action: 'plan', order: 1 },
        { name: 'step2', action: 'execute', order: 2 }
      ]
    };
    
    const progressEvents: number[] = [];
    executor.on('progress', (p: number) => progressEvents.push(p));
    
    await executor.execute(playbook);
    
    expect(progressEvents).toContain(0);
    expect(progressEvents).toContain(50);
    expect(progressEvents).toContain(100);
  });
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/ralph.ts
- **Action**: Implement playbook-style sequential task execution
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add parallel step support where steps are independent
- **Verify**: Tests pass, execution optimized
- **Done**: ○

---

## Task 9: Add Playbook Templates

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/playbooks.test.ts
- **Test Code**:
```typescript
import { describe, it, expect } from 'vitest';
import { 
  getPlaybookTemplate, 
  listPlaybookTemplates,
  PlanTemplate,
  ExecuteTemplate,
  VerifyTemplate 
} from '../../../lib/agent-framework/playbooks';

describe('Playbook Templates', () => {
  it('should list available playbook templates', () => {
    const templates = listPlaybookTemplates();
    expect(templates).toContain('plan');
    expect(templates).toContain('execute');
    expect(templates).toContain('verify');
    expect(templates).toContain('full-cycle');
  });

  it('should provide plan template for GSI workflows', () => {
    const template = getPlaybookTemplate('plan') as PlanTemplate;
    expect(template.steps).toHaveLength(expect.any(Number));
    expect(template.steps[0].action).toBe('analyze');
    expect(template.steps[template.steps.length - 1].action).toBe('document');
  });

  it('should provide execute template for GSI workflows', () => {
    const template = getPlaybookTemplate('execute') as ExecuteTemplate;
    expect(template.steps).toHaveLength(expect.any(Number));
    expect(template.steps.some(s => s.action === 'implement')).toBe(true);
  });

  it('should provide verify template for GSI workflows', () => {
    const template = getPlaybookTemplate('verify') as VerifyTemplate;
    expect(template.steps).toHaveLength(expect.any(Number));
    expect(template.steps.some(s => s.action === 'test')).toBe(true);
    expect(template.steps.some(s => s.action === 'validate')).toBe(true);
  });

  it('should provide full-cycle template combining all phases', () => {
    const template = getPlaybookTemplate('full-cycle');
    const phases = template.steps.map(s => s.phase);
    expect(phases).toContain('plan');
    expect(phases).toContain('execute');
    expect(phases).toContain('verify');
  });

  it('should allow template customization', () => {
    const template = getPlaybookTemplate('plan');
    const customized = template.customize({
      skipSteps: ['document'],
      addSteps: [{ name: 'custom', action: 'custom-action', order: 99 }]
    });
    
    expect(customized.steps.some(s => s.action === 'document')).toBe(false);
    expect(customized.steps.some(s => s.action === 'custom-action')).toBe(true);
  });
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/playbooks/index.ts, plan.ts, execute.ts, verify.ts
- **Action**: Create playbook templates for common GSI workflows
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add template validation, improve customization API
- **Verify**: Tests pass, API clean
- **Done**: ○

---

## Task 10: Analyze picobot

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/picobot.test.ts
- **Test Code**:
```typescript
import { describe, it, expect } from 'vitest';
import { analyzePicobot } from '../../../lib/agent-framework/picobot';

describe('picobot analysis', () => {
  it('should analyze picobot automation primitives', async () => {
    const result = await analyzePicobot();
    expect(result).toHaveProperty('watchPattern');
    expect(result).toHaveProperty('triggerPattern');
    expect(result).toHaveProperty('executionPattern');
  });

  it('should document file watch pattern', async () => {
    const result = await analyzePicobot();
    expect(result.watchPattern).toHaveProperty('events');
    expect(result.watchPattern.events).toContain('change');
    expect(result.watchPattern.events).toContain('create');
    expect(result.watchPattern.events).toContain('delete');
  });

  it('should document trigger patterns', async () => {
    const result = await analyzePicobot();
    expect(result.triggerPattern).toHaveProperty('types');
    expect(result.triggerPattern.types).toContain('file');
    expect(result.triggerPattern.types).toContain('schedule');
    expect(result.triggerPattern.types).toContain('manual');
  });

  it('should catalog automation primitives', async () => {
    const result = await analyzePicobot();
    expect(result.primitives).toContainEqual(
      expect.objectContaining({ name: 'watch' })
    );
    expect(result.primitives).toContainEqual(
      expect.objectContaining({ name: 'trigger' })
    );
    expect(result.primitives).toContainEqual(
      expect.objectContaining({ name: 'execute' })
    );
  });
});
```
- **Verify**: Test fails
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/picobot.ts
- **Action**: Analyze picobot automation primitives
- **Verify**: Test passes
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Document automation patterns with examples
- **Verify**: Test passes, docs complete
- **Done**: ○

---

## Task 11: Implement Automation Layer

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/picobot.test.ts
- **Test Code**:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AutomationLayer, Watcher, Trigger, Executor } from '../../../lib/agent-framework/picobot';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('AutomationLayer', () => {
  let automation: AutomationLayer;
  const testDir = './test-automation-fixture';

  beforeEach(async () => {
    automation = new AutomationLayer();
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await automation.stopAll();
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should watch file changes and trigger execution', async () => {
    const executionLog: string[] = [];
    const testFile = path.join(testDir, 'test.txt');
    
    await automation.watch({
      path: testDir,
      events: ['change'],
      trigger: {
        type: 'file',
        pattern: '*.txt'
      },
      action: async (event) => {
        executionLog.push(event.file);
      }
    });

    await fs.writeFile(testFile, 'test content');
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for watch

    expect(executionLog).toContain(testFile);
  });

  it('should support multiple watchers', async () => {
    const watchers: Watcher[] = [];
    
    for (let i = 0; i < 5; i++) {
      const watcher = await automation.watch({
        path: path.join(testDir, `dir${i}`),
        events: ['create'],
        trigger: { type: 'file', pattern: '*' },
        action: async () => {}
      });
      watchers.push(watcher);
    }

    expect(automation.getActiveWatchers()).toBe(5);
  });

  it('should trigger execution on schedule', async () => {
    const executionCount = { value: 0 };
    
    await automation.schedule({
      cron: '*/1 * * * * *', // Every second
      action: async () => {
        executionCount.value++;
      }
    });

    await new Promise(resolve => setTimeout(resolve, 2500));
    
    expect(executionCount.value).toBeGreaterThanOrEqual(2);
  });

  it('should support manual triggers', async () => {
    const executionLog: string[] = [];
    
    const trigger = await automation.registerTrigger({
      name: 'manual-test',
      action: async (payload) => {
        executionLog.push(payload.message);
      }
    });

    await trigger.fire({ message: 'hello' });
    await trigger.fire({ message: 'world' });

    expect(executionLog).toEqual(['hello', 'world']);
  });

  it('should handle execution errors gracefully', async () => {
    const errorLog: Error[] = [];
    
    automation.onError((error) => errorLog.push(error));
    
    await automation.watch({
      path: testDir,
      events: ['change'],
      trigger: { type: 'file', pattern: '*' },
      action: async () => {
        throw new Error('Intentional test error');
      }
    });

    const testFile = path.join(testDir, 'error.txt');
    await fs.writeFile(testFile, 'trigger error');
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(errorLog.length).toBeGreaterThan(0);
    expect(errorLog[0].message).toBe('Intentional test error');
  });

  it('should provide execution statistics', async () => {
    const trigger = await automation.registerTrigger({
      name: 'stats-test',
      action: async () => {}
    });

    for (let i = 0; i < 10; i++) {
      await trigger.fire({});
    }

    const stats = automation.getStats();
    expect(stats.totalExecutions).toBe(10);
    expect(stats.successRate).toBe(1);
  });
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/picobot.ts
- **Action**: Implement automation primitives (watch, trigger, execute)
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add debouncing, batching, and error recovery
- **Verify**: Tests pass, automation robust
- **Done**: ○

---

## Task 12: Create Agent Framework Index

### 🔴 RED: Write Test
- **Files**: tests/unit/agent-framework/index.test.ts
- **Test Code**:
```typescript
import { describe, it, expect } from 'vitest';
import * as agentFramework from '../../../lib/agent-framework';

describe('Agent Framework Index', () => {
  it('should export LightningWrapper', () => {
    expect(agentFramework.LightningWrapper).toBeDefined();
    expect(typeof agentFramework.LightningWrapper).toBe('function');
  });

  it('should export TaskQueue', () => {
    expect(agentFramework.TaskQueue).toBeDefined();
    expect(typeof agentFramework.TaskQueue).toBe('function');
  });

  it('should export ClaudeCodeSDK', () => {
    expect(agentFramework.ClaudeCodeSDK).toBeDefined();
    expect(typeof agentFramework.ClaudeCodeSDK).toBe('function');
  });

  it('should export ProfileManager', () => {
    expect(agentFramework.ProfileManager).toBeDefined();
    expect(typeof agentFramework.ProfileManager).toBe('function');
  });

  it('should export PlaybookExecutor', () => {
    expect(agentFramework.PlaybookExecutor).toBeDefined();
    expect(typeof agentFramework.PlaybookExecutor).toBe('function');
  });

  it('should export AutomationLayer', () => {
    expect(agentFramework.AutomationLayer).toBeDefined();
    expect(typeof agentFramework.AutomationLayer).toBe('function');
  });

  it('should export playbook templates', () => {
    expect(agentFramework.getPlaybookTemplate).toBeDefined();
    expect(agentFramework.listPlaybookTemplates).toBeDefined();
  });

  it('should provide unified API', () => {
    const api = agentFramework.createAgentFramework();
    expect(api).toHaveProperty('lightning');
    expect(api).toHaveProperty('sdk');
    expect(api).toHaveProperty('playbooks');
    expect(api).toHaveProperty('automation');
    expect(api).toHaveProperty('queue');
    expect(api).toHaveProperty('profiles');
  });

  it('should support quick initialization', async () => {
    const framework = await agentFramework.quickInit({
      profile: 'haiku',
      maxConcurrent: 5
    });
    
    expect(framework).toBeDefined();
    expect(framework.profiles.getCurrentProfile().name).toBe('haiku');
    expect(framework.queue.getMaxConcurrent()).toBe(5);
  });
});
```
- **Verify**: Tests fail
- **Done**: ○

### 🟢 GREEN: Implement
- **Files**: lib/agent-framework/index.ts
- **Action**: Export all agent framework modules with unified API
- **Verify**: Tests pass
- **Done**: ○

### 🔵 REFACTOR: Optimize
- **Action**: Add TypeScript types for all exports, improve API docs
- **Verify**: Tests pass, types complete
- **Done**: ○

---

## Integration Tests

### Integration Test 1: Agent Framework ↔ Core Engine
```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import * as coreEngine from '../../../lib/core-engine';
import * as agentFramework from '../../../lib/agent-framework';

describe('Agent Framework to Core Engine Integration', () => {
  beforeAll(async () => {
    // Ensure core engine is initialized
    await coreEngine.initialize();
  });

  it('should use core engine search in agent context', async () => {
    const framework = await agentFramework.quickInit();
    const context = await framework.prepareAgentContext({
      task: 'Find authentication code',
      useSearch: true
    });
    
    expect(context).toHaveProperty('relevantFiles');
    expect(context.relevantFiles.length).toBeGreaterThan(0);
  });

  it('should provide search results to lightning agents', async () => {
    const searchResults = await coreEngine.semanticSearch('test query');
    const wrapper = new agentFramework.LightningWrapper();
    
    const result = await wrapper.executeAgent({
      task: 'Analyze search results',
      context: { searchResults }
    });
    
    expect(result.success).toBe(true);
    expect(result.output).toBeDefined();
  });
});
```

### Integration Test 2: Agent Framework Internal
```typescript
import { describe, it, expect } from 'vitest';
import * as agentFramework from '../../../lib/agent-framework';

describe('Agent Framework Internal Integration', () => {
  it('should execute playbook using task queue', async () => {
    const framework = await agentFramework.quickInit({ maxConcurrent: 3 });
    const playbook = agentFramework.getPlaybookTemplate('full-cycle');
    
    const result = await framework.playbooks.execute(playbook, {
      useQueue: true,
      maxParallel: 3
    });
    
    expect(result.completed).toBe(true);
    expect(framework.queue.getStats().totalExecutions).toBeGreaterThan(0);
  });

  it('should trigger automation on playbook completion', async () => {
    const framework = await agentFramework.quickInit();
    const executionLog: string[] = [];
    
    await framework.automation.registerTrigger({
      name: 'playbook-complete',
      action: async () => executionLog.push('triggered')
    });
    
    const playbook = agentFramework.getPlaybookTemplate('plan');
    await framework.playbooks.execute(playbook, {
      onCompleteTrigger: 'playbook-complete'
    });
    
    expect(executionLog).toContain('triggered');
  });

  it('should use profile settings across all components', async () => {
    const framework = await agentFramework.quickInit({ profile: 'opus' });
    
    // All components should use opus profile
    expect(framework.lightning.getProfile().name).toBe('opus');
    expect(framework.sdk.getProfile().name).toBe('opus');
    expect(framework.profiles.getCurrentProfile().name).toBe('opus');
  });
});
```

### Integration Test 3: Playbook + Automation Integration
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as agentFramework from '../../../lib/agent-framework';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Playbook + Automation Integration', () => {
  let framework: agentFramework.AgentFrameworkAPI;
  const testDir = './test-playbook-automation-fixture';

  beforeEach(async () => {
    framework = await agentFramework.quickInit();
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await framework.automation.stopAll();
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should execute playbook on file change', async () => {
    const playbook = agentFramework.getPlaybookTemplate('execute');
    const executionLog: string[] = [];
    
    await framework.automation.watch({
      path: testDir,
      events: ['change'],
      trigger: { type: 'file', pattern: '*.md' },
      action: async (event) => {
        executionLog.push(event.file);
        await framework.playbooks.execute(playbook, { 
          context: { file: event.file } 
        });
      }
    });

    const testFile = path.join(testDir, 'test.md');
    await fs.writeFile(testFile, '# Test');
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(executionLog.length).toBeGreaterThan(0);
  });

  it('should chain playbooks using automation triggers', async () => {
    const planPlaybook = agentFramework.getPlaybookTemplate('plan');
    const executePlaybook = agentFramework.getPlaybookTemplate('execute');
    
    const chain: string[] = [];
    
    await framework.automation.registerTrigger({
      name: 'plan-complete',
      action: async () => {
        chain.push('plan-done');
        await framework.playbooks.execute(executePlaybook, {
          onCompleteTrigger: 'execute-complete'
        });
      }
    });
    
    await framework.automation.registerTrigger({
      name: 'execute-complete',
      action: async () => chain.push('execute-done')
    });
    
    await framework.playbooks.execute(planPlaybook, {
      onCompleteTrigger: 'plan-complete'
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(chain).toEqual(['plan-done', 'execute-done']);
  });
});
```

### Integration Test 4: Full Agent Framework Stack
```typescript
import { describe, it, expect } from 'vitest';
import * as agentFramework from '../../../lib/agent-framework';

describe('Full Agent Framework Stack Integration', () => {
  it('should run complete agent workflow', async () => {
    const framework = await agentFramework.quickInit({
      profile: 'haiku',
      maxConcurrent: 5
    });

    // Create a complete workflow
    const result = await framework.executeWorkflow({
      name: 'test-workflow',
      steps: [
        {
          name: 'analyze',
          type: 'lightning',
          task: 'Analyze project structure',
          useSearch: true
        },
        {
          name: 'plan',
          type: 'playbook',
          template: 'plan'
        },
        {
          name: 'execute',
          type: 'playbook',
          template: 'execute'
        },
        {
          name: 'verify',
          type: 'playbook',
          template: 'verify'
        }
      ]
    });

    expect(result.completed).toBe(true);
    expect(result.steps).toHaveLength(4);
    expect(result.steps.every(s => s.success)).toBe(true);
  });

  it('should handle workflow failures with rollback', async () => {
    const framework = await agentFramework.quickInit();

    const result = await framework.executeWorkflow({
      name: 'failing-workflow',
      steps: [
        { name: 'pass1', type: 'lightning', task: 'task1' },
        { name: 'fail', type: 'lightning', task: 'fail', shouldFail: true },
        { name: 'pass2', type: 'lightning', task: 'task2' }
      ],
      rollback: true
    });

    expect(result.completed).toBe(false);
    expect(result.failedStep).toBe('fail');
    expect(result.rolledBack).toBe(true);
  });
});
```

---

## Verification Checklist

### TDD Verification
- [ ] All 12 tasks have RED tests written first
- [ ] All 12 tasks have GREEN implementations passing tests
- [ ] All 12 tasks have REFACTOR optimizations applied
- [ ] 100% test coverage on lib/agent-framework/

### Integration Verification
- [ ] Agent Framework ↔ Core Engine integration test passes
- [ ] Agent Framework internal integration test passes
- [ ] Playbook + Automation integration test passes
- [ ] Full Agent Framework stack integration test passes

### Coverage Targets
- [ ] agent-lightning.ts: 100% coverage
- [ ] task-queue.ts: 100% coverage
- [ ] claude-sdk.ts: 100% coverage
- [ ] profiles.ts: 100% coverage
- [ ] ralph.ts: 100% coverage
- [ ] playbooks/*.ts: 100% coverage
- [ ] picobot.ts: 100% coverage

### Functional Verification
- [ ] agent-lightning wrapper functional with <500ms overhead
- [ ] SDK patterns integrated with profile support
- [ ] ralph playbooks working for sequential execution
- [ ] picobot automation available with watch/trigger/execute
- [ ] Unified agent-framework API available

---

## Output

Agent Framework module with **full TDD coverage**, integration tests, and 100% test coverage on all integrated code.

---

**Estimated Duration:** 4 hours (with TDD)
**Wave:** 2 (depends on Core Engine)
**Test Coverage Target:** 100%
