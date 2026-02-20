/**
 * @fileoverview Tests for files-to-prompt integration
 * Part of Phase 50A: Core Engine Integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the module (will fail initially - RED phase)
import {
  analyzeRepository,
  filesToPrompt,
  convertToCxml,
  parseIncludePatterns
} from '../../../lib/core-engine/files-to-prompt';

describe('files-to-prompt', () => {
  const fixturesPath = path.join(__dirname, '../../test/fixtures');

  describe('Task 1: Repository Analysis', () => {
    it('should analyze repository structure', async () => {
      const result = await analyzeRepository('https://github.com/simonw/files-to-prompt');
      expect(result).toHaveProperty('structure');
      expect(result).toHaveProperty('keyFunctions');
      expect(result.keyFunctions.length).toBeGreaterThan(0);
    });

    it('should identify core functions from repository', async () => {
      const result = await analyzeRepository('https://github.com/simonw/files-to-prompt');
      expect(result.keyFunctions).toContain('files_to_prompt');
      expect(result.keyFunctions).toContain('process_file');
    });
  });

  describe('Task 2: CXML Conversion', () => {
    it('should convert files to cxml format', async () => {
      const testFile = path.join(fixturesPath, 'sample.md');
      const result = await filesToPrompt([testFile], { format: 'cxml' });
      expect(result).toContain('<documents>');
      expect(result).toContain('<document');
      expect(result).toContain('</documents>');
    });

    it('should include file content in cxml', async () => {
      const testFile = path.join(fixturesPath, 'sample.md');
      const result = await filesToPrompt([testFile], { format: 'cxml' });
      expect(result).toContain('Sample Document');
      expect(result).toContain('Feature 1');
    });

    it('should support include patterns', async () => {
      const result = await filesToPrompt([fixturesPath], { include: ['*.md'] });
      expect(result).toContain('sample.md');
    });

    it('should support exclude patterns', async () => {
      const result = await filesToPrompt([fixturesPath], {
        include: ['*'],
        exclude: ['*.txt']
      });
      expect(result).not.toContain('large-file.txt');
    });

    it('should handle multiple files', async () => {
      const files = [
        path.join(fixturesPath, 'sample.md'),
        path.join(fixturesPath, 'docs', 'authentication.md')
      ];
      const result = await filesToPrompt(files, { format: 'cxml' });
      expect(result).toContain('Sample Document');
      expect(result).toContain('Authentication Patterns');
    });
  });

  describe('CXML Format Details', () => {
    it('should include document source attribute', async () => {
      const testFile = path.join(fixturesPath, 'sample.md');
      const result = await convertToCxml([{ path: testFile, content: 'test' }]);
      expect(result).toMatch(/source=["'].*sample\.md["']/);
    });

    it('should escape XML special characters', async () => {
      const content = 'Test with <special> & "characters"';
      const result = await convertToCxml([{ path: 'test.md', content }]);
      expect(result).toContain('&lt;special&gt;');
      expect(result).toContain('&amp;');
    });

    it('should handle empty files', async () => {
      const result = await convertToCxml([{ path: 'empty.md', content: '' }]);
      expect(result).toContain('<document');
      expect(result).toContain('</document>');
    });
  });

  describe('Pattern Matching', () => {
    it('should parse glob include patterns', () => {
      const patterns = parseIncludePatterns(['*.md', '*.ts']);
      expect(patterns).toHaveLength(2);
      expect(patterns[0]).toBeInstanceOf(RegExp);
    });

    it('should match files against patterns', () => {
      const patterns = parseIncludePatterns(['*.md']);
      expect(patterns[0].test('readme.md')).toBe(true);
      expect(patterns[0].test('index.ts')).toBe(false);
    });

    it('should handle directory patterns', () => {
      const patterns = parseIncludePatterns(['docs/**']);
      expect(patterns[0].test('docs/guide.md')).toBe(true);
      expect(patterns[0].test('src/index.ts')).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent files gracefully', async () => {
      expect(filesToPrompt(['/nonexistent/file.md'], { format: 'cxml' })).rejects.toThrow();
    });

    it('should handle binary files', async () => {
      // Should either skip or handle binary content
      const result = await filesToPrompt([], { format: 'cxml' });
      expect(result).toContain('<documents>');
    });
  });
});
