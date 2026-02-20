/**
 * @fileoverview Unit tests for mdream (Markdown processing)
 * Part of Phase 50D: Workflow Engine Integration
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import {
  MdreamProcessor,
  analyzeMdream,
  processMarkdown,
  extractKnowledge,
  markdownToCxml,
  KNOWLEDGE_PATTERNS
} from '../../../lib/workflow-engine/mdream';

describe('mdream', () => {
  let processor;

  beforeEach(() => {
    processor = new MdreamProcessor();
  });

  describe('analyzeMdream', () => {
    it('should analyze mdream markdown processing patterns', async () => {
      const analysis = await analyzeMdream('https://github.com/harlan-zw/mdream');
      expect(analysis).toHaveProperty('parsingStrategy');
      expect(analysis).toHaveProperty('outputFormats');
      expect(analysis.outputFormats).toContain('json');
    });

    it('should return knowledge extraction info', async () => {
      const analysis = await analyzeMdream();
      expect(analysis.knowledgeExtraction).toBeDefined();
      expect(analysis.knowledgeExtraction.enabled).toBe(true);
    });
  });

  describe('processMarkdown', () => {
    it('should convert markdown to structured JSON', async () => {
      const md = '# Title\n\n## Section\n\nContent here';
      const result = await processMarkdown(md, { format: 'json' });
      expect(result.title).toBe('Title');
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].heading).toBe('Section');
    });

    it('should extract code blocks with language', async () => {
      const md = '```typescript\nconst x = 1;\n```';
      const result = await processMarkdown(md, { format: 'json' });
      expect(result.codeBlocks).toHaveLength(1);
      expect(result.codeBlocks[0].language).toBe('typescript');
    });

    it('should handle multiple code blocks', async () => {
      const md = `
\`\`\`javascript
console.log('hello');
\`\`\`

Some text

\`\`\`python
print('world')
\`\`\`
`;
      const result = await processMarkdown(md);
      expect(result.codeBlocks).toHaveLength(2);
      expect(result.codeBlocks[0].language).toBe('javascript');
      expect(result.codeBlocks[1].language).toBe('python');
    });

    it('should extract links', async () => {
      const md = '[Link 1](https://example.com) and [Link 2](https://test.com)';
      const result = await processMarkdown(md);
      expect(result.links).toHaveLength(2);
      expect(result.links[0].text).toBe('Link 1');
      expect(result.links[0].url).toBe('https://example.com');
    });

    it('should calculate word count', async () => {
      const md = '# Title\n\nOne two three four five words';
      const result = await processMarkdown(md);
      expect(result.wordCount).toBeGreaterThan(0);
    });

    it('should estimate reading time', async () => {
      const md = '# Title\n\n' + 'word '.repeat(400); // 400 words + title
      const result = await processMarkdown(md);
      expect(result.readingTime).toBeGreaterThanOrEqual(2); // 400+/200 = 2+ minutes
    });
  });

  describe('extractKnowledge', () => {
    it('should extract knowledge patterns from markdown', async () => {
      const md = `
## Decision: Use TDD
We decided to use TDD because it ensures quality.

## Pattern: Repository Integration
Clone → Analyze → Integrate → Test
`;
      const knowledge = await extractKnowledge(md);
      expect(knowledge.decisions).toContainEqual(
        expect.objectContaining({ title: 'Use TDD' })
      );
      expect(knowledge.patterns).toContainEqual(
        expect.objectContaining({ name: 'Repository Integration' })
      );
    });

    it('should extract todos', async () => {
      const md = `
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task
`;
      const knowledge = await extractKnowledge(md);
      expect(knowledge.todos).toHaveLength(3);
      expect(knowledge.todos[0].completed).toBe(true);
      expect(knowledge.todos[1].completed).toBe(false);
    });

    it('should extract references', async () => {
      const md = 'Check [Documentation](https://docs.example.com) for more info';
      const knowledge = await extractKnowledge(md);
      expect(knowledge.references).toHaveLength(1);
      expect(knowledge.references[0].url).toBe('https://docs.example.com');
    });

    it('should estimate confidence for decisions', async () => {
      const md = `
## Decision: Must Use HTTPS
We must always use HTTPS for security.
`;
      const knowledge = await extractKnowledge(md);
      expect(knowledge.decisions[0].confidence).toBeGreaterThan(0.5);
    });

    it('should extract pattern steps', async () => {
      const md = `
## Pattern: TDD Workflow
1. Write failing test
2. Implement code
3. Refactor
`;
      const knowledge = await extractKnowledge(md);
      expect(knowledge.patterns[0].steps).toContain('Write failing test');
    });
  });

  describe('section parsing', () => {
    it('should handle nested sections', async () => {
      const md = `
# Main Title

## Section 1
Content 1

### Subsection 1.1
Content 1.1

## Section 2
Content 2
`;
      const result = await processMarkdown(md);
      expect(result.sections).toHaveLength(2);
      expect(result.sections[0].subsections).toHaveLength(1);
    });

    it('should extract section content', async () => {
      const md = `
## Features
This is about features.
More details here.
`;
      const result = await processMarkdown(md);
      expect(result.sections[0].content).toContain('about features');
    });

    it('should handle empty sections', async () => {
      const md = `
## Empty Section

## Next Section
Has content
`;
      const result = await processMarkdown(md);
      expect(result.sections).toHaveLength(2);
    });
  });

  describe('code block extraction', () => {
    it('should extract filename from info string', async () => {
      const md = '```typescript src/index.ts\nconst x = 1;\n```';
      const result = await processMarkdown(md);
      expect(result.codeBlocks[0].filename).toBe('src/index.ts');
    });

    it('should handle code blocks without language', async () => {
      const md = '```\nplain code\n```';
      const result = await processMarkdown(md);
      expect(result.codeBlocks[0].language).toBe('text');
    });

    it('should preserve code content exactly', async () => {
      const code = 'const x = {\n  nested: "value"\n};';
      const md = `\`\`\`javascript\n${code}\n\`\`\``;
      const result = await processMarkdown(md);
      expect(result.codeBlocks[0].code).toBe(code);
    });
  });

  describe('markdownToCxml', () => {
    it('should convert markdown to CXML format', () => {
      const md = '# Test\n\nContent';
      const cxml = markdownToCxml(md);
      expect(cxml).toContain('<?xml version');
      expect(cxml).toContain('<documents>');
      expect(cxml).toContain('</documents>');
      expect(cxml).toContain('<![CDATA[');
    });

    it('should use title as source', () => {
      const md = '# My Document\n\nContent';
      const cxml = markdownToCxml(md);
      expect(cxml).toContain('source="My Document"');
    });
  });

  describe('MdreamProcessor class', () => {
    it('should respect extractKnowledge option', async () => {
      const processor = new MdreamProcessor({ extractKnowledge: false });
      const md = '# Title\n\n## Decision: Test\nContent';
      const result = await processor.process(md);
      expect(result.knowledge.decisions).toHaveLength(0);
    });

    it('should handle maxDepth option', async () => {
      const processor = new MdreamProcessor({ maxDepth: 2 });
      const md = `
# Title
## Level 2
### Level 3
#### Level 4
`;
      const result = await processor.process(md);
      // Should still process but limit nesting
      expect(result.sections).toBeDefined();
    });
  });

  describe('word counting', () => {
    it('should exclude code blocks from word count', () => {
      const md = `
# Title

Some text here

\`\`\`
This code should not count as words for reading time
but might be included in total
\`\`\`
`;
      const count = processor.countWords(md);
      expect(count).toBeLessThan(20); // Should only count the prose
    });

    it('should handle special characters', () => {
      const md = '# Title with *emphasis* and **bold**';
      const count = processor.countWords(md);
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('confidence estimation', () => {
    it('should return high confidence for must/always', () => {
      const content = 'We must always follow this rule';
      const confidence = processor.estimateConfidence(content);
      expect(confidence).toBeGreaterThan(0.7);
    });

    it('should return medium confidence for should', () => {
      const content = 'You should consider this approach';
      const confidence = processor.estimateConfidence(content);
      expect(confidence).toBeLessThan(0.9);
      expect(confidence).toBeGreaterThan(0.5);
    });

    it('should return default confidence for no markers', () => {
      const content = 'This is a simple statement';
      const confidence = processor.estimateConfidence(content);
      expect(confidence).toBe(0.5);
    });
  });

  describe('metadata', () => {
    it('should include processing metadata', async () => {
      const md = '# Test';
      const result = await processMarkdown(md);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.processed).toBeDefined();
      expect(result.metadata.version).toBeDefined();
    });
  });
});
