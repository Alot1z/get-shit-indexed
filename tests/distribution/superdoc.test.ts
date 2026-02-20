// tests/distribution/superdoc.test.ts
// Phase 50E: Distribution Layer - Superdoc Tests (TDD RED Phase)
import { describe, it, expect } from 'bun:test';
import { SuperdocAnalyzer, SuperdocGenerator, FunctionSignature, CodePatterns } from '../../lib/distribution/superdoc';
import { ApiDocsGenerator, ApiEndpoint, ApiDocumentation, OpenApiSpec } from '../../lib/distribution/api-docs';

describe('SuperdocAnalyzer', () => {
  describe('pattern analysis', () => {
    it('should identify JSDoc comment patterns', () => {
      const analyzer = new SuperdocAnalyzer();
      const code = `
        /**
         * @param name - The name parameter
         * @returns The greeting string
         */
        function greet(name: string): string {
          return \`Hello, \${name}!\`;
        }
      `;
      
      const patterns = analyzer.analyzePatterns(code);
      
      expect(patterns.jsdoc).toBe(true);
      expect(patterns.hasParams).toBe(true);
      expect(patterns.hasReturns).toBe(true);
    });

    it('should detect TypeScript type annotations', () => {
      const analyzer = new SuperdocAnalyzer();
      const code = `
        interface User {
          id: number;
          name: string;
        }
      `;
      
      const patterns = analyzer.analyzePatterns(code);
      
      expect(patterns.interfaces).toContain('User');
    });

    it('should extract function signatures', () => {
      const analyzer = new SuperdocAnalyzer();
      const code = `
        export async function processData(input: Buffer): Promise<Result> {}
        export const validate = (data: unknown): data is Valid => true;
      `;
      
      const signatures = analyzer.extractSignatures(code);
      
      expect(signatures).toHaveLength(2);
      expect(signatures[0].name).toBe('processData');
      expect(signatures[0].async).toBe(true);
    });
  });
});

describe('SuperdocGenerator', () => {
  describe('documentation generation', () => {
    it('should generate markdown from code', async () => {
      const generator = new SuperdocGenerator();
      const code = `
        /**
         * Calculates the sum of two numbers
         * @param a - First number
         * @param b - Second number
         * @returns The sum
         */
        export function add(a: number, b: number): number {
          return a + b;
        }
      `;
      
      const docs = await generator.generate(code, { format: 'markdown' });
      
      expect(docs).toContain('# add');
      expect(docs).toContain('First number');
      expect(docs).toContain('Returns');
    });

    it('should generate HTML output', async () => {
      const generator = new SuperdocGenerator();
      const code = `export const PI = 3.14159;`;
      
      const docs = await generator.generate(code, { format: 'html' });
      
      expect(docs).toContain('<html');
      expect(docs).toContain('PI');
    });

    it('should include type definitions', async () => {
      const generator = new SuperdocGenerator();
      const code = `
        export interface Config {
          debug: boolean;
          port: number;
        }
      `;
      
      const docs = await generator.generate(code, { format: 'markdown' });
      
      expect(docs).toContain('Config');
      expect(docs).toContain('debug');
      expect(docs).toContain('port');
    });

    it('should generate table of contents', async () => {
      const generator = new SuperdocGenerator();
      const code = `
        export function foo() {}
        export function bar() {}
        export function baz() {}
      `;
      
      const docs = await generator.generate(code, { format: 'markdown', toc: true });
      
      expect(docs).toContain('## Table of Contents');
      expect(docs).toContain('- foo');
      expect(docs).toContain('- bar');
      expect(docs).toContain('- baz');
    });
  });
});

describe('ApiDocsGenerator', () => {
  describe('API documentation', () => {
    it('should generate API reference from types', async () => {
      const generator = new ApiDocsGenerator();
      const code = `
        export interface ApiClient {
          get(url: string): Promise<Response>;
          post(url: string, body: unknown): Promise<Response>;
        }
      `;
      
      const apiDocs = await generator.generateApiDocs(code);
      
      expect(apiDocs.endpoints).toHaveLength(2);
      expect(apiDocs.endpoints[0].method).toBe('GET');
      expect(apiDocs.endpoints[1].method).toBe('POST');
    });

    it('should extract response types', async () => {
      const generator = new ApiDocsGenerator();
      const code = `
        interface User { id: number; }
        export async function getUser(): Promise<User> {}
      `;
      
      const apiDocs = await generator.generateApiDocs(code);
      
      expect(apiDocs.types).toHaveProperty('User');
      expect(apiDocs.types.User.properties).toContain('id');
    });

    it('should generate OpenAPI spec', async () => {
      const generator = new ApiDocsGenerator();
      const code = `
        export async function listUsers(): Promise<User[]> {}
      `;
      
      const openapi = await generator.generateOpenApiSpec(code);
      
      expect(openapi.openapi).toBe('3.0.0');
      // Path is /users (list + Users -> users + s = /users)
      expect(openapi.paths['/users']).toBeDefined();
    });
  });
});
