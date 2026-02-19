# MCP-to-CLI Conversion Plan for Phase 49-04

---
plan: 49-04-mcp-cli-conversion
phase: 49
created: 2026-02-19
status: planned
priority: HIGH
token_savings_target: 88%
---

## Executive Summary

This document outlines the strategic conversion of MCP server calls to native TypeScript CLI implementations, eliminating the MCP protocol overhead and achieving up to 88% token reduction.

**Current State**: GSI relies on 5 MCP servers with ~15-30K tokens per tool invocation overhead.

**Target State**: Native TypeScript CLI tools with <2K tokens per operation.

---

## 1. DesktopCommander MCP Conversion

### 1.1 Current Overhead Analysis

| Tool | MCP Overhead | Native CLI Equivalent | Savings |
|------|-------------|----------------------|---------|
| read_file | ~15K tokens | fs.readFileSync | 95% |
| read_multiple_files | ~18K tokens | Promise.all reads | 97% |
| write_file | ~15K tokens | fs.writeFileSync | 95% |
| edit_block | ~16K tokens | fs + string replace | 94% |
| list_directory | ~12K tokens | fs.readdirSync | 93% |
| start_process | ~14K tokens | child_process.spawn | 94% |
| interact_with_process | ~13K tokens | process.stdin.write | 93% |
| start_search | ~15K tokens | fast-glob + ripgrep | 92% |

### 1.2 TypeScript Implementation Pattern

```typescript
// lib/cli/file-operations.ts

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export interface ReadFileOptions {
  offset?: number;
  length?: number;
  encoding?: BufferEncoding;
}

export interface FileInfo {
  path: string;
  type: 'file' | 'directory';
  size: number;
  created: Date;
  modified: Date;
  lineCount?: number;
}

/**
 * Native file reader - replaces mcp__desktop-commander__read_file
 * Token cost: ~200 tokens (vs ~15K MCP)
 */
export async function readFileNative(
  filePath: string,
  options: ReadFileOptions = {}
): Promise<string> {
  const { offset = 0, length, encoding = 'utf-8' } = options;
  
  const absolutePath = path.resolve(filePath);
  const content = await readFile(absolutePath, encoding);
  
  if (offset === 0 && !length) {
    return content;
  }
  
  const lines = content.split('\n');
  
  if (offset < 0) {
    // Negative offset = read from end
    return lines.slice(offset).join('\n');
  }
  
  const end = length ? offset + length : undefined;
  return lines.slice(offset, end).join('\n');
}

/**
 * Batch file reader - replaces mcp__desktop-commander__read_multiple_files
 * Token cost: ~500 tokens for 5 files (vs ~45K MCP sequential)
 */
export async function readMultipleFilesNative(
  filePaths: string[],
  options: ReadFileOptions = {}
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  
  await Promise.all(
    filePaths.map(async (filePath) => {
      try {
        const content = await readFileNative(filePath, options);
        results.set(filePath, content);
      } catch (error) {
        results.set(filePath, `[ERROR: ${(error as Error).message}]`);
      }
    })
  );
  
  return results;
}

/**
 * Surgical editor - replaces mcp__desktop-commander__edit_block
 * Token cost: ~150 tokens (vs ~16K MCP)
 */
export async function editBlockNative(
  filePath: string,
  oldString: string,
  newString: string,
  expectedReplacements: number = 1
): Promise<{ success: boolean; replacements: number }> {
  const content = await readFileNative(filePath);
  
  // Count occurrences
  const occurrences = (content.match(new RegExp(escapeRegex(oldString), 'g')) || []).length;
  
  if (expectedReplacements === 1 && occurrences > 1) {
    throw new Error(`Expected 1 replacement but found ${occurrences} occurrences`);
  }
  
  const newContent = content.replace(oldString, newString);
  await writeFile(filePath, newContent, 'utf-8');
  
  return { success: true, replacements: occurrences };
}

/**
 * Directory lister - replaces mcp__desktop-commander__list_directory
 * Token cost: ~100 tokens (vs ~12K MCP)
 */
export async function listDirectoryNative(
  dirPath: string,
  depth: number = 2
): Promise<FileInfo[]> {
  const results: FileInfo[] = [];
  const absolutePath = path.resolve(dirPath);
  
  async function walk(currentPath: string, currentDepth: number): Promise<void> {
    if (currentDepth > depth) return;
    
    const entries = await readdir(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const stats = await stat(fullPath);
      
      results.push({
        path: fullPath,
        type: entry.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      });
      
      if (entry.isDirectory() && currentDepth < depth) {
        await walk(fullPath, currentDepth + 1);
      }
    }
  }
  
  await walk(absolutePath, 1);
  return results;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

### 1.3 Integration Points with GSI

```typescript
// gsi-integration/desktop-commander-native.ts

import { readFileNative, readMultipleFilesNative, editBlockNative, listDirectoryNative } from '../cli/file-operations';

export class DesktopCommanderNative {
  /**
   * Drop-in replacement for MCP tool calls
   * Enables gradual migration without breaking existing code
   */
  
  async read_file(params: { path: string; offset?: number; length?: number }) {
    return readFileNative(params.path, {
      offset: params.offset,
      length: params.length
    });
  }
  
  async read_multiple_files(params: { paths: string[] }) {
    const results = await readMultipleFilesNative(params.paths);
    return Object.fromEntries(results);
  }
  
  async write_file(params: { path: string; content: string; mode?: 'rewrite' | 'append' }) {
    // Implementation
  }
  
  async edit_block(params: { file_path: string; old_string: string; new_string: string; expected_replacements?: number }) {
    return editBlockNative(
      params.file_path,
      params.old_string,
      params.new_string,
      params.expected_replacements
    );
  }
  
  async list_directory(params: { path: string; depth?: number }) {
    return listDirectoryNative(params.path, params.depth);
  }
  
  async start_process(params: { command: string; timeout_ms?: number }) {
    // Use child_process.spawn
  }
}
```

### 1.4 Priority Assessment

**Priority: HIGH**

- Most frequently used MCP server in GSI
- 50-90% token savings per operation
- Direct file system access is already available in Node.js
- No external dependencies required

---

## 2. Code-Index MCP Conversion

### 2.1 Current Overhead Analysis

| Tool | MCP Overhead | Native CLI Equivalent | Savings |
|------|-------------|----------------------|---------|
| search_code_advanced | ~18K tokens | ripgrep (rg) wrapper | 85% |
| find_files | ~12K tokens | fast-glob | 80% |
| get_file_summary | ~15K tokens | custom parser | 90% |
| get_symbol_body | ~16K tokens | TypeScript AST parser | 88% |
| build_deep_index | ~20K tokens | ts-morph indexing | 75% |

### 2.2 TypeScript Implementation Pattern

```typescript
// lib/cli/code-search.ts

import { execSync } from 'child_process';
import * as fg from 'fast-glob';
import * as ts from 'typescript';

export interface SearchResult {
  file: string;
  line: number;
  column: number;
  content: string;
  context?: string[];
}

export interface SymbolInfo {
  name: string;
  kind: ts.SyntaxKind;
  startLine: number;
  endLine: number;
  code: string;
}

/**
 * Code search using ripgrep - replaces mcp__code-index-mcp__search_code_advanced
 * Token cost: ~500 tokens (vs ~18K MCP)
 */
export async function searchCodeNative(
  pattern: string,
  options: {
    filePattern?: string;
    regex?: boolean;
    maxResults?: number;
    contextLines?: number;
    caseSensitive?: boolean;
  } = {}
): Promise<SearchResult[]> {
  const {
    filePattern = '*',
    regex = false,
    maxResults = 50,
    contextLines = 0,
    caseSensitive = true
  } = options;
  
  const args = [
    '--json',
    `--max-count=${maxResults}`,
    `--context=${contextLines}`,
    caseSensitive ? '--case-sensitive' : '--ignore-case',
    regex ? '' : '--fixed-strings',
    '--glob', filePattern,
    pattern
  ].filter(Boolean);
  
  try {
    const output = execSync(`rg ${args.join(' ')}`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024
    });
    
    return parseRipgrepOutput(output);
  } catch (error) {
    // No matches found
    return [];
  }
}

/**
 * Fast file finder - replaces mcp__code-index-mcp__find_files
 * Token cost: ~200 tokens (vs ~12K MCP)
 */
export async function findFilesNative(
  pattern: string,
  options: {
    cwd?: string;
    ignore?: string[];
    absolute?: boolean;
  } = {}
): Promise<string[]> {
  const { cwd = process.cwd(), ignore = [], absolute = true } = options;
  
  return fg.async(pattern, {
    cwd,
    absolute,
    ignore: ['node_modules', '.git', ...ignore],
    onlyFiles: true
  });
}

/**
 * Symbol body extractor - replaces mcp__code-index-mcp__get_symbol_body
 * Token cost: ~300 tokens (vs ~16K MCP)
 */
export async function getSymbolBodyNative(
  filePath: string,
  symbolName: string
): Promise<SymbolInfo | null> {
  const content = await readFileNative(filePath);
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  
  let result: SymbolInfo | null = null;
  
  function visit(node: ts.Node) {
    if (result) return;
    
    if (
      (ts.isFunctionDeclaration(node) || 
       ts.isClassDeclaration(node) ||
       ts.isMethodDeclaration(node) ||
       ts.isInterfaceDeclaration(node) ||
       ts.isTypeAliasDeclaration(node)) &&
      node.name?.getText() === symbolName
    ) {
      const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
      
      result = {
        name: symbolName,
        kind: node.kind,
        startLine: start.line + 1,
        endLine: end.line + 1,
        code: node.getText()
      };
    }
    
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  return result;
}

/**
 * File summary generator - replaces mcp__code-index-mcp__get_file_summary
 * Token cost: ~250 tokens (vs ~15K MCP)
 */
export async function getFileSummaryNative(
  filePath: string
): Promise<{
  lineCount: number;
  functions: string[];
  classes: string[];
  imports: string[];
  exports: string[];
}> {
  const content = await readFileNative(filePath);
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  
  const functions: string[] = [];
  const classes: string[] = [];
  const imports: string[] = [];
  const exports: string[] = [];
  
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      functions.push(node.name.getText());
    }
    if (ts.isClassDeclaration(node) && node.name) {
      classes.push(node.name.getText());
    }
    if (ts.isImportDeclaration(node)) {
      imports.push(node.moduleSpecifier.getText());
    }
    if (ts.isExportDeclaration(node) || 
        (ts.isVariableDeclaration(node) && node.parent.parent.kind === ts.SyntaxKind.VariableStatement &&
         (node.parent.parent as ts.VariableStatement).modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword))) {
      // Track exports
    }
    
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  
  return {
    lineCount: content.split('\n').length,
    functions,
    classes,
    imports,
    exports
  };
}

function parseRipgrepOutput(output: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === 'match') {
        results.push({
          file: parsed.data.path.text,
          line: parsed.data.line_number,
          column: parsed.data.submatches[0]?.start || 0,
          content: parsed.data.lines.text.trim(),
          context: parsed.context?.map((c: any) => c.lines.text)
        });
      }
    } catch {
      // Skip malformed JSON
    }
  }
  
  return results;
}
```

### 2.3 Index Management

```typescript
// lib/cli/code-index.ts

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);

const INDEX_DIR = '.gsi-index';
const SYMBOLS_FILE = 'symbols.json';
const FILES_FILE = 'files.json';

interface SymbolIndex {
  name: string;
  file: string;
  line: number;
  kind: string;
}

/**
 * Build deep index - replaces mcp__code-index-mcp__build_deep_index
 * Uses ts-morph for comprehensive symbol extraction
 */
export async function buildDeepIndexNative(
  projectPath: string,
  options: {
    include?: string[];
    exclude?: string[];
  } = {}
): Promise<{ files: number; symbols: number }> {
  const { include = ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'], exclude = ['node_modules', '.git', 'dist'] } = options;
  
  const indexPath = path.join(projectPath, INDEX_DIR);
  await mkdir(indexPath, { recursive: true });
  
  const files = await findFilesNative(include.join(','), {
    cwd: projectPath,
    ignore: exclude
  });
  
  const symbols: SymbolIndex[] = [];
  
  for (const file of files) {
    const fileSymbols = await extractSymbolsFromFile(file);
    symbols.push(...fileSymbols);
  }
  
  await writeFile(
    path.join(indexPath, SYMBOLS_FILE),
    JSON.stringify(symbols, null, 2)
  );
  
  await writeFile(
    path.join(indexPath, FILES_FILE),
    JSON.stringify(files, null, 2)
  );
  
  return { files: files.length, symbols: symbols.length };
}

async function extractSymbolsFromFile(filePath: string): Promise<SymbolIndex[]> {
  const content = await readFile(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  
  const symbols: SymbolIndex[] = [];
  
  function visit(node: ts.Node) {
    if (
      (ts.isFunctionDeclaration(node) ||
       ts.isClassDeclaration(node) ||
       ts.isInterfaceDeclaration(node) ||
       ts.isTypeAliasDeclaration(node) ||
       ts.isVariableDeclaration(node)) &&
      'name' in node &&
      typeof node.name === 'object' &&
      'getText' in node.name
    ) {
      const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      symbols.push({
        name: (node.name as ts.Identifier).getText(),
        file: filePath,
        line: start.line + 1,
        kind: ts.SyntaxKind[node.kind]
      });
    }
    
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  return symbols;
}
```

### 2.4 Priority Assessment

**Priority: HIGH**

- Critical for code analysis workflows
- 80-90% token savings
- ripgrep is already the fastest code search tool
- TypeScript compiler API provides native AST parsing

---

## 3. Sequential Thinking MCP Conversion

### 3.1 Current Overhead Analysis

| Operation | MCP Overhead | Native CLI Equivalent | Savings |
|-----------|-------------|----------------------|---------|
| Sequential thinking call | ~18K tokens | Local LLM or prompt pattern | 70-85% |
| Thought iteration | ~12K tokens | State machine + caching | 80% |

### 3.2 TypeScript Implementation Pattern

```typescript
// lib/cli/thinking/sequential.ts

export interface SequentialThought {
  thoughtNumber: number;
  totalThoughts: number;
  thought: string;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
  nextThoughtNeeded: boolean;
}

export interface SequentialThinkingResult {
  thoughts: SequentialThought[];
  conclusion: string;
  confidence: number;
}

/**
 * Sequential thinking processor - replaces mcp__sequential-thinking__sequentialthinking
 * 
 * This implementation provides structured reasoning without MCP overhead.
 * Two modes available:
 * 1. Prompt-only mode: Returns structured thought template for Claude to complete
 * 2. Cache mode: Maintains thought history for context
 */
export class SequentialThinkingNative {
  private thoughtHistory: SequentialThought[] = [];
  private maxHistorySize: number = 100;
  
  /**
   * Start or continue sequential thinking
   * Token cost: ~300 tokens (vs ~18K MCP)
   */
  async think(params: {
    thought: string;
    thoughtNumber: number;
    totalThoughts: number;
    nextThoughtNeeded: boolean;
    isRevision?: boolean;
    revisesThought?: number;
  }): Promise<SequentialThought> {
    const thought: SequentialThought = {
      thoughtNumber: params.thoughtNumber,
      totalThoughts: params.totalThoughts,
      thought: params.thought,
      isRevision: params.isRevision,
      revisesThought: params.revisesThought,
      nextThoughtNeeded: params.nextThoughtNeeded
    };
    
    // Store in history
    this.thoughtHistory.push(thought);
    if (this.thoughtHistory.length > this.maxHistorySize) {
      this.thoughtHistory.shift();
    }
    
    return thought;
  }
  
  /**
   * Generate thinking prompt template
   * Returns structured format for Claude to complete
   */
  generatePromptTemplate(context: {
    problem: string;
    maxThoughts?: number;
  }): string {
    const { problem, maxThoughts = 10 } = context;
    
    return `
## Sequential Thinking Request

Problem: ${problem}

Think through this systematically. For each thought:
1. State your current understanding
2. Identify what you know vs what you need to find out
3. Determine the next step

Format each thought as:
[Thought N/M] <your reasoning>

End with:
[Conclusion] <final answer>
[Confidence] 0-100%
`.trim();
  }
  
  /**
   * Parse Claude's response into structured thoughts
   */
  parseResponse(response: string): SequentialThinkingResult {
    const thoughts: SequentialThought[] = [];
    const lines = response.split('\n');
    
    let currentThought: Partial<SequentialThought> | null = null;
    let conclusion = '';
    let confidence = 0;
    
    for (const line of lines) {
      const thoughtMatch = line.match(/\[Thought (\d+)\/(\d+)\]\s*(.+)/);
      if (thoughtMatch) {
        if (currentThought && currentThought.thought) {
          thoughts.push(currentThought as SequentialThought);
        }
        currentThought = {
          thoughtNumber: parseInt(thoughtMatch[1]),
          totalThoughts: parseInt(thoughtMatch[2]),
          thought: thoughtMatch[3],
          nextThoughtNeeded: parseInt(thoughtMatch[1]) < parseInt(thoughtMatch[2])
        };
      } else if (line.includes('[Conclusion]')) {
        conclusion = line.replace('[Conclusion]', '').trim();
      } else if (line.includes('[Confidence]')) {
        const match = line.match(/(\d+)/);
        if (match) confidence = parseInt(match[1]) / 100;
      } else if (currentThought) {
        currentThought.thought = (currentThought.thought || '') + '\n' + line;
      }
    }
    
    if (currentThought && currentThought.thought) {
      thoughts.push(currentThought as SequentialThought);
    }
    
    return { thoughts, conclusion, confidence };
  }
  
  /**
   * Get thought history for context continuation
   */
  getHistory(): SequentialThought[] {
    return [...this.thoughtHistory];
  }
  
  /**
   * Clear history
   */
  clearHistory(): void {
    this.thoughtHistory = [];
  }
}
```

### 3.3 Integration Pattern

```typescript
// lib/thinking/native-connector.ts

import { SequentialThinkingNative } from '../cli/thinking/sequential';

/**
 * Adapter that provides MCP-like interface but uses native implementation
 */
export class ThinkingConnectorNative {
  private sequential: SequentialThinkingNative;
  
  constructor() {
    this.sequential = new SequentialThinkingNative();
  }
  
  /**
   * Drop-in replacement for mcp__sequential-thinking__sequentialthinking
   */
  async sequentialthinking(params: any): Promise<any> {
    return this.sequential.think(params);
  }
  
  /**
   * Generate thinking prompt for injection into command context
   */
  generateThinkingPrompt(operation: string, context: any): string {
    return this.sequential.generatePromptTemplate({
      problem: `Operation: ${operation}\nContext: ${JSON.stringify(context, null, 2)}`,
      maxThoughts: 5
    });
  }
}
```

### 3.4 Priority Assessment

**Priority: MEDIUM**

- Used for cognitive enhancement workflows
- 70-80% token savings achievable
- Prompt-based approach maintains quality without external service
- Lower priority than file/code operations

---

## 4. Tractatus Thinking MCP Conversion

### 4.1 Current Overhead Analysis

| Operation | MCP Overhead | Native CLI Equivalent | Savings |
|-----------|-------------|----------------------|---------|
| Start analysis | ~18K tokens | Proposition tree builder | 80% |
| Add proposition | ~12K tokens | Tree node insertion | 85% |
| Export structure | ~10K tokens | Tree serialization | 75% |

### 4.2 TypeScript Implementation Pattern

```typescript
// lib/cli/thinking/tractatus.ts

export interface Proposition {
  number: string;
  content: string;
  confidence: number;
  isAtomic: boolean;
  decompositionType?: 'clarification' | 'analysis' | 'cases' | 'implication' | 'negation';
  children: Proposition[];
  parent: Proposition | null;
}

export interface TractatusSession {
  id: string;
  concept: string;
  rootPropositions: Proposition[];
  depthLimit: number;
  createdAt: Date;
}

/**
 * Tractatus-style logical structure analysis
 * Replaces mcp__tractatusthinking__tractatus_thinking
 */
export class TractatusThinkingNative {
  private sessions: Map<string, TractatusSession> = new Map();
  private currentSession: TractatusSession | null = null;
  
  /**
   * Start new analysis session
   * Token cost: ~400 tokens (vs ~18K MCP)
   */
  async start(params: {
    concept: string;
    depthLimit?: number;
    style?: 'analytical' | 'exhaustive' | 'creative';
    confidenceThreshold?: number;
  }): Promise<TractatusSession> {
    const session: TractatusSession = {
      id: generateId(),
      concept: params.concept,
      rootPropositions: [],
      depthLimit: params.depthLimit || 5,
      createdAt: new Date()
    };
    
    this.sessions.set(session.id, session);
    this.currentSession = session;
    
    return session;
  }
  
  /**
   * Add proposition to current session
   */
  async addProposition(params: {
    content: string;
    parentNumber?: string;
    confidence?: number;
    isAtomic?: boolean;
    decompositionType?: Proposition['decompositionType'];
  }): Promise<Proposition> {
    if (!this.currentSession) {
      throw new Error('No active session. Call start() first.');
    }
    
    const proposition: Proposition = {
      number: this.generatePropositionNumber(params.parentNumber),
      content: params.content,
      confidence: params.confidence || 0.5,
      isAtomic: params.isAtomic || false,
      decompositionType: params.decompositionType,
      children: [],
      parent: null
    };
    
    if (params.parentNumber) {
      const parent = this.findProposition(params.parentNumber);
      if (parent) {
        proposition.parent = parent;
        parent.children.push(proposition);
      }
    } else {
      this.currentSession.rootPropositions.push(proposition);
    }
    
    return proposition;
  }
  
  /**
   * Export as markdown hierarchy
   */
  async exportMarkdown(sessionId?: string): Promise<string> {
    const session = sessionId 
      ? this.sessions.get(sessionId)
      : this.currentSession;
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    const lines: string[] = [
      `# ${session.concept}`,
      '',
      `*Session ID: ${session.id}*`,
      `*Created: ${session.createdAt.toISOString()}*`,
      ''
    ];
    
    for (const prop of session.rootPropositions) {
      lines.push(...this.propositionToMarkdown(prop, 0));
    }
    
    return lines.join('\n');
  }
  
  /**
   * Analyze structure completeness
   */
  async analyze(sessionId?: string): Promise<{
    totalPropositions: number;
    atomicCount: number;
    maxDepth: number;
    avgConfidence: number;
    gaps: string[];
  }> {
    const session = sessionId 
      ? this.sessions.get(sessionId)
      : this.currentSession;
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    let total = 0;
    let atomic = 0;
    let maxDepth = 0;
    let totalConfidence = 0;
    const gaps: string[] = [];
    
    function walk(prop: Proposition, depth: number) {
      total++;
      if (prop.isAtomic) atomic++;
      maxDepth = Math.max(maxDepth, depth);
      totalConfidence += prop.confidence;
      
      if (!prop.isAtomic && prop.children.length === 0 && prop.confidence < 0.8) {
        gaps.push(prop.number);
      }
      
      for (const child of prop.children) {
        walk(child, depth + 1);
      }
    }
    
    for (const prop of session.rootPropositions) {
      walk(prop, 1);
    }
    
    return {
      totalPropositions: total,
      atomicCount: atomic,
      maxDepth,
      avgConfidence: total / totalConfidence,
      gaps
    };
  }
  
  private generatePropositionNumber(parentNumber?: string): string {
    if (!parentNumber || !this.currentSession) {
      return String(this.currentSession!.rootPropositions.length + 1);
    }
    
    const parent = this.findProposition(parentNumber);
    if (!parent) return '1';
    
    return `${parentNumber}.${parent.children.length + 1}`;
  }
  
  private findProposition(number: string, props?: Proposition[]): Proposition | null {
    const searchIn = props || this.currentSession?.rootPropositions || [];
    
    for (const prop of searchIn) {
      if (prop.number === number) return prop;
      const found = this.findProposition(number, prop.children);
      if (found) return found;
    }
    
    return null;
  }
  
  private propositionToMarkdown(prop: Proposition, indent: number): string[] {
    const prefix = '  '.repeat(indent);
    const atomicTag = prop.isAtomic ? ' [ATOMIC]' : '';
    const confidence = ` (confidence: ${(prop.confidence * 100).toFixed(0)}%)`;
    
    const lines: string[] = [
      `${prefix}**${prop.number}**${atomicTag}: ${prop.content}${confidence}`
    ];
    
    for (const child of prop.children) {
      lines.push(...this.propositionToMarkdown(child, indent + 1));
    }
    
    return lines;
  }
}

function generateId(): string {
  return `tractatus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

### 4.3 Priority Assessment

**Priority: MEDIUM**

- Used for architectural analysis and decision making
- 75-85% token savings
- Logical structure benefits from local processing
- Lower frequency of use compared to file operations

---

## 5. Debug Thinking MCP Conversion

### 5.1 Current Overhead Analysis

| Operation | MCP Overhead | Native CLI Equivalent | Savings |
|-----------|-------------|----------------------|---------|
| Create node | ~15K tokens | Graph node creation | 85% |
| Connect nodes | ~12K tokens | Edge creation | 85% |
| Query graph | ~14K tokens | Graph traversal | 80% |

### 5.2 TypeScript Implementation Pattern

```typescript
// lib/cli/thinking/debug.ts

import * as fs from 'fs';
import * as path from 'path';

export type NodeType = 'problem' | 'hypothesis' | 'experiment' | 'observation' | 'learning' | 'solution';
export type RelationType = 'decomposes' | 'hypothesizes' | 'tests' | 'produces' | 'learns' | 'contradicts' | 'supports' | 'solves';

export interface DebugNode {
  id: string;
  type: NodeType;
  content: string;
  metadata?: {
    confidence?: number;
    tags?: string[];
    timestamp?: string;
  };
}

export interface DebugEdge {
  id: string;
  from: string;
  to: string;
  type: RelationType;
  strength: number;
}

export interface DebugGraph {
  nodes: Map<string, DebugNode>;
  edges: DebugEdge[];
}

const STORAGE_DIR = '.debug-thinking-native';

/**
 * Debug thinking graph manager
 * Replaces mcp__debug-thinking__debug_thinking
 */
export class DebugThinkingNative {
  private graph: DebugGraph;
  private storagePath: string;
  
  constructor(projectRoot: string) {
    this.storagePath = path.join(projectRoot, STORAGE_DIR);
    this.graph = { nodes: new Map(), edges: [] };
    this.loadFromDisk();
  }
  
  /**
   * Create node in debug graph
   * Token cost: ~200 tokens (vs ~15K MCP)
   */
  async createNode(params: {
    nodeType: NodeType;
    content: string;
    parentId?: string;
    metadata?: DebugNode['metadata'];
  }): Promise<DebugNode> {
    const node: DebugNode = {
      id: generateNodeId(),
      type: params.nodeType,
      content: params.content,
      metadata: {
        ...params.metadata,
        timestamp: new Date().toISOString()
      }
    };
    
    this.graph.nodes.set(node.id, node);
    
    // Auto-connect to parent if provided
    if (params.parentId) {
      const relationType = this.inferRelationType(params.nodeType);
      await this.connect({
        from: params.parentId,
        to: node.id,
        type: relationType,
        strength: 0.8
      });
    }
    
    await this.saveToDisk();
    return node;
  }
  
  /**
   * Create edge between nodes
   */
  async connect(params: {
    from: string;
    to: string;
    type: RelationType;
    strength: number;
  }): Promise<DebugEdge> {
    if (!this.graph.nodes.has(params.from) || !this.graph.nodes.has(params.to)) {
      throw new Error('One or both nodes not found');
    }
    
    const edge: DebugEdge = {
      id: generateEdgeId(),
      from: params.from,
      to: params.to,
      type: params.type,
      strength: params.strength
    };
    
    this.graph.edges.push(edge);
    await this.saveToDisk();
    return edge;
  }
  
  /**
   * Query the debug graph
   */
  async query(params: {
    queryType: 'similar-problems' | 'recent-activity';
    pattern?: string;
    limit?: number;
    minSimilarity?: number;
  }): Promise<DebugNode[]> {
    const { queryType, pattern, limit = 20, minSimilarity = 0.5 } = params;
    
    let results: DebugNode[] = [];
    
    if (queryType === 'similar-problems' && pattern) {
      results = this.findSimilarProblems(pattern, minSimilarity);
    } else if (queryType === 'recent-activity') {
      results = this.getRecentActivity(limit);
    }
    
    return results.slice(0, limit);
  }
  
  /**
   * Get full graph export
   */
  async exportGraph(): Promise<{
    nodes: DebugNode[];
    edges: DebugEdge[];
    stats: {
      totalNodes: number;
      totalEdges: number;
      nodeTypeCounts: Record<NodeType, number>;
    };
  }> {
    const nodeTypeCounts: Record<NodeType, number> = {
      problem: 0,
      hypothesis: 0,
      experiment: 0,
      observation: 0,
      learning: 0,
      solution: 0
    };
    
    for (const node of this.graph.nodes.values()) {
      nodeTypeCounts[node.type]++;
    }
    
    return {
      nodes: Array.from(this.graph.nodes.values()),
      edges: this.graph.edges,
      stats: {
        totalNodes: this.graph.nodes.size,
        totalEdges: this.graph.edges.length,
        nodeTypeCounts
      }
    };
  }
  
  private findSimilarProblems(pattern: string, minSimilarity: number): DebugNode[] {
    const problems: DebugNode[] = [];
    const patternLower = pattern.toLowerCase();
    
    for (const node of this.graph.nodes.values()) {
      if (node.type === 'problem') {
        const similarity = this.calculateSimilarity(patternLower, node.content.toLowerCase());
        if (similarity >= minSimilarity) {
          problems.push(node);
        }
      }
    }
    
    return problems.sort((a, b) => {
      const simA = this.calculateSimilarity(patternLower, a.content.toLowerCase());
      const simB = this.calculateSimilarity(patternLower, b.content.toLowerCase());
      return simB - simA;
    });
  }
  
  private getRecentActivity(limit: number): DebugNode[] {
    return Array.from(this.graph.nodes.values())
      .sort((a, b) => {
        const timeA = new Date(a.metadata?.timestamp || 0).getTime();
        const timeB = new Date(b.metadata?.timestamp || 0).getTime();
        return timeB - timeA;
      })
      .slice(0, limit);
  }
  
  private calculateSimilarity(a: string, b: string): number {
    // Simple Jaccard similarity on words
    const wordsA = new Set(a.split(/\s+/));
    const wordsB = new Set(b.split(/\s+/));
    const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
    const union = new Set([...wordsA, ...wordsB]);
    return intersection.size / union.size;
  }
  
  private inferRelationType(nodeType: NodeType): RelationType {
    const mapping: Record<NodeType, RelationType> = {
      problem: 'decomposes',
      hypothesis: 'hypothesizes',
      experiment: 'tests',
      observation: 'produces',
      learning: 'learns',
      solution: 'solves'
    };
    return mapping[nodeType];
  }
  
  private async saveToDisk(): Promise<void> {
    const nodesPath = path.join(this.storagePath, 'nodes.jsonl');
    const edgesPath = path.join(this.storagePath, 'edges.jsonl');
    
    await fs.promises.mkdir(this.storagePath, { recursive: true });
    
    const nodesContent = Array.from(this.graph.nodes.values())
      .map(n => JSON.stringify(n))
      .join('\n');
    
    const edgesContent = this.graph.edges
      .map(e => JSON.stringify(e))
      .join('\n');
    
    await fs.promises.writeFile(nodesPath, nodesContent, 'utf-8');
    await fs.promises.writeFile(edgesPath, edgesContent, 'utf-8');
  }
  
  private async loadFromDisk(): Promise<void> {
    try {
      const nodesPath = path.join(this.storagePath, 'nodes.jsonl');
      const edgesPath = path.join(this.storagePath, 'edges.jsonl');
      
      if (fs.existsSync(nodesPath)) {
        const content = await fs.promises.readFile(nodesPath, 'utf-8');
        content.split('\n').filter(Boolean).forEach(line => {
          const node = JSON.parse(line) as DebugNode;
          this.graph.nodes.set(node.id, node);
        });
      }
      
      if (fs.existsSync(edgesPath)) {
        const content = await fs.promises.readFile(edgesPath, 'utf-8');
        content.split('\n').filter(Boolean).forEach(line => {
          const edge = JSON.parse(line) as DebugEdge;
          this.graph.edges.push(edge);
        });
      }
    } catch {
      // Start fresh if loading fails
    }
  }
}

function generateNodeId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateEdgeId(): string {
  return `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

### 5.3 Priority Assessment

**Priority: LOW**

- Used for problem-solving workflows
- 80-85% token savings
- Lower usage frequency
- Can be migrated after core tools are converted

---

## 6. Integration Architecture

### 6.1 Unified CLI Interface

```typescript
// lib/cli/index.ts

import { DesktopCommanderNative } from './desktop-commander';
import { CodeSearchNative } from './code-search';
import { SequentialThinkingNative } from './thinking/sequential';
import { TractatusThinkingNative } from './thinking/tractatus';
import { DebugThinkingNative } from './thinking/debug';

/**
 * Unified CLI interface - drop-in replacement for MCP tools
 * Provides consistent API while using native implementations
 */
export class GSINativeTools {
  public files: DesktopCommanderNative;
  public code: CodeSearchNative;
  public thinking: {
    sequential: SequentialThinkingNative;
    tractatus: TractatusThinkingNative;
    debug: DebugThinkingNative;
  };
  
  constructor(projectRoot: string) {
    this.files = new DesktopCommanderNative();
    this.code = new CodeSearchNative(projectRoot);
    this.thinking = {
      sequential: new SequentialThinkingNative(),
      tractatus: new TractatusThinkingNative(),
      debug: new DebugThinkingNative(projectRoot)
    };
  }
  
  /**
   * Get metrics for all tools
   */
  getMetrics(): {
    files: any;
    code: any;
    thinking: any;
    tokenSavings: number;
  } {
    return {
      files: this.files.getMetrics(),
      code: this.code.getMetrics(),
      thinking: {
        sequential: this.thinking.sequential.getHistory().length,
        tractatus: this.thinking.tractatus.getSessionCount(),
        debug: this.thinking.debug.getNodeCount()
      },
      tokenSavings: 88 // Estimated percentage
    };
  }
}

// Singleton instance for global access
let globalInstance: GSINativeTools | null = null;

export function getNativeTools(projectRoot?: string): GSINativeTools {
  if (!globalInstance) {
    globalInstance = new GSINativeTools(projectRoot || process.cwd());
  }
  return globalInstance;
}
```

### 6.2 GSI Command Integration

```typescript
// Update to gsi-tools.js - Add native tool commands

// ... existing code ...

/**
 * Native file operations - replaces MCP desktop-commander
 */
function cmdNativeReadFile(cwd, filePath, options, raw) {
  const tools = getNativeTools(cwd);
  const result = tools.files.read_file({ path: filePath, ...options });
  output(result, raw);
}

function cmdNativeReadMultipleFiles(cwd, filePaths, raw) {
  const tools = getNativeTools(cwd);
  const result = tools.files.read_multiple_files({ paths: filePaths });
  output(result, raw);
}

function cmdNativeSearchCode(cwd, pattern, options, raw) {
  const tools = getNativeTools(cwd);
  const result = tools.code.search(pattern, options);
  output(result, raw);
}

function cmdNativeGetSymbol(cwd, filePath, symbolName, raw) {
  const tools = getNativeTools(cwd);
  const result = tools.code.getSymbol(filePath, symbolName);
  output(result, raw);
}

// Add new command handlers
const NATIVE_COMMANDS = {
  'native': {
    'read-file': cmdNativeReadFile,
    'read-files': cmdNativeReadMultipleFiles,
    'search-code': cmdNativeSearchCode,
    'get-symbol': cmdNativeGetSymbol,
  }
};
```

### 6.3 Hook Integration

```javascript
// hooks/native-tool-enforcer.js

/**
 * Hook that intercepts MCP tool calls and redirects to native implementations
 * Provides automatic token savings without changing command definitions
 */

const NATIVE_TOOL_MAP = {
  'mcp__desktop-commander__read_file': 'native.read-file',
  'mcp__desktop-commander__read_multiple_files': 'native.read-files',
  'mcp__desktop-commander__write_file': 'native.write-file',
  'mcp__desktop-commander__edit_block': 'native.edit-block',
  'mcp__desktop-commander__list_directory': 'native.list-dir',
  'mcp__code-index-mcp__search_code_advanced': 'native.search-code',
  'mcp__code-index-mcp__find_files': 'native.find-files',
  'mcp__code-index-mcp__get_symbol_body': 'native.get-symbol',
  'mcp__code-index-mcp__get_file_summary': 'native.file-summary'
};

module.exports = {
  name: 'native-tool-enforcer',
  
  preToolUse: async (context) => {
    const { toolName, params } = context;
    
    // Check if this tool has a native equivalent
    const nativeCommand = NATIVE_TOOL_MAP[toolName];
    if (!nativeCommand) {
      return { proceed: true };
    }
    
    // Redirect to native implementation
    console.log(`[Native Enforcer] Redirecting ${toolName} to ${nativeCommand}`);
    
    return {
      proceed: false,
      alternative: {
        type: 'cli',
        command: `gsi-tools ${nativeCommand}`,
        params
      }
    };
  }
};
```

---

## 7. Implementation Roadmap

### Phase 1: Core File Operations (Week 1)
- [ ] Implement `readFileNative`
- [ ] Implement `readMultipleFilesNative`
- [ ] Implement `writeFileNative`
- [ ] Implement `editBlockNative`
- [ ] Implement `listDirectoryNative`
- [ ] Add CLI commands to gsi-tools.js
- [ ] Write unit tests

### Phase 2: Code Search (Week 2)
- [ ] Implement `searchCodeNative` with ripgrep
- [ ] Implement `findFilesNative` with fast-glob
- [ ] Implement `getSymbolBodyNative` with TypeScript AST
- [ ] Implement `getFileSummaryNative`
- [ ] Implement `buildDeepIndexNative`
- [ ] Add CLI commands
- [ ] Write unit tests

### Phase 3: Thinking Tools (Week 3)
- [ ] Implement `SequentialThinkingNative`
- [ ] Implement `TractatusThinkingNative`
- [ ] Implement `DebugThinkingNative`
- [ ] Create unified thinking interface
- [ ] Add CLI commands
- [ ] Write unit tests

### Phase 4: Integration (Week 4)
- [ ] Create `GSINativeTools` unified interface
- [ ] Update gsi-tools.js with native commands
- [ ] Create native-tool-enforcer hook
- [ ] Update command definitions to use native tools
- [ ] Update documentation
- [ ] Integration testing

### Phase 5: Validation (Week 5)
- [ ] Benchmark token savings
- [ ] Performance testing
- [ ] Document results
- [ ] Create migration guide for existing projects

---

## 8. Token Savings Summary

| MCP Server | Current Overhead | Native CLI | Savings | Priority |
|------------|-----------------|------------|---------|----------|
| DesktopCommander | 50-90% overhead | <5% overhead | 85-95% | HIGH |
| Code-Index | 70-90% overhead | <10% overhead | 80-90% | HIGH |
| Sequential Thinking | 70-85% overhead | <5% overhead | 75-85% | MEDIUM |
| Tractatus Thinking | 75-85% overhead | <5% overhead | 70-80% | MEDIUM |
| Debug Thinking | 80-85% overhead | <5% overhead | 75-85% | LOW |

**Overall Estimated Savings: 88%**

---

## 9. Dependencies

### Required npm Packages
- `fast-glob` - Fast file matching
- `typescript` - AST parsing (already present)
- `ripgrep` (via child_process) - Code search

### Optional Dependencies
- `ts-morph` - Advanced TypeScript analysis (for buildDeepIndex)

---

## 10. Success Criteria

1. All 5 MCP servers have native CLI equivalents
2. Token overhead reduced by at least 80%
3. All existing GSI commands work with native tools
4. Performance is equal or better than MCP
5. Unit test coverage >80%
6. Documentation complete

---

## 11. Related Documents

- Phase 49-04 PLAN: Command Standardization & Protocol Definition
- MCP-TOKEN-BENCHMARK.md: Detailed token usage analysis
- mcp-tool-reference.md: Current MCP tool documentation

---

*Document Version: 1.0*
*Created: 2026-02-19*
*Author: GSI Architecture Team*
