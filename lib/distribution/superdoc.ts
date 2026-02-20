// lib/distribution/superdoc.ts
// Phase 50E: Distribution Layer - Documentation Generation (TDD GREEN Phase)

/**
 * Code patterns detected during analysis
 */
export interface CodePatterns {
  jsdoc: boolean;
  hasParams: boolean;
  hasReturns: boolean;
  interfaces: string[];
}

/**
 * Function signature extracted from code
 */
export interface FunctionSignature {
  name: string;
  async: boolean;
  params: string[];
  returnType: string;
}

/**
 * Documentation generator options
 */
export interface GeneratorOptions {
  format: 'markdown' | 'html';
  toc?: boolean;
}

/**
 * SuperdocAnalyzer - Analyzes code to extract documentation patterns
 */
export class SuperdocAnalyzer {
  /**
   * Analyze code patterns for documentation generation
   */
  analyzePatterns(code: string): CodePatterns {
    return {
      jsdoc: code.includes('/**'),
      hasParams: code.includes('@param'),
      hasReturns: code.includes('@returns') || code.includes('@return'),
      interfaces: this.extractInterfaceNames(code)
    };
  }

  /**
   * Extract function signatures from code
   */
  extractSignatures(code: string): FunctionSignature[] {
    const signatures: FunctionSignature[] = [];
    
    // Match function declarations
    const funcRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^\{]+))?/g;
    let match;
    
    while ((match = funcRegex.exec(code)) !== null) {
      signatures.push({
        name: match[1],
        async: code.substring(Math.max(0, match.index - 30)).includes('async'),
        params: match[2] ? match[2].split(',').map(p => p.trim()).filter(Boolean) : [],
        returnType: match[3]?.trim() ?? 'void'
      });
    }
    
    // Match arrow functions
    const arrowRegex = /(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)(?:\s*:\s*([^\=]+))?/g;
    while ((match = arrowRegex.exec(code)) !== null) {
      signatures.push({
        name: match[1],
        async: code.substring(match.index, match.index + 50).includes('async'),
        params: match[2] ? match[2].split(',').map(p => p.trim()).filter(Boolean) : [],
        returnType: match[3]?.trim() ?? 'unknown'
      });
    }
    
    return signatures;
  }

  /**
   * Extract interface names from code
   */
  private extractInterfaceNames(code: string): string[] {
    const interfaceRegex = /(?:export\s+)?interface\s+(\w+)/g;
    const names: string[] = [];
    let match;
    
    while ((match = interfaceRegex.exec(code)) !== null) {
      names.push(match[1]);
    }
    
    return names;
  }
}

/**
 * SuperdocGenerator - Generates documentation from code
 */
export class SuperdocGenerator {
  private analyzer: SuperdocAnalyzer;

  constructor() {
    this.analyzer = new SuperdocAnalyzer();
  }

  /**
   * Generate documentation from code
   */
  async generate(code: string, options: GeneratorOptions): Promise<string> {
    const signatures = this.analyzer.extractSignatures(code);
    const patterns = this.analyzer.analyzePatterns(code);
    
    if (options.format === 'markdown') {
      return this.generateMarkdown(code, signatures, patterns, options);
    }
    return this.generateHtml(code, signatures, patterns);
  }

  /**
   * Generate markdown documentation
   */
  private generateMarkdown(
    code: string, 
    signatures: FunctionSignature[], 
    patterns: CodePatterns,
    options: GeneratorOptions
  ): string {
    let md = '# API Documentation\n\n';
    
    // Table of contents
    if (options.toc && signatures.length > 0) {
      md += '## Table of Contents\n';
      for (const sig of signatures) {
        md += `- ${sig.name}\n`;
      }
      md += '\n';
    }
    
    // Interface documentation
    if (patterns.interfaces.length > 0) {
      md += '## Interfaces\n\n';
      for (const iface of patterns.interfaces) {
        md += `### ${iface}\n\n`;
        // Extract interface properties
        const ifaceRegex = new RegExp(`interface\\s+${iface}\\s*\\{([^}]+)\\}`, 's');
        const ifaceMatch = code.match(ifaceRegex);
        if (ifaceMatch) {
          md += '```typescript\n';
          md += `interface ${iface} {\n`;
          md += ifaceMatch[1];
          md += '}\n';
          md += '```\n\n';
        }
      }
    }
    
    // Function documentation
    if (signatures.length > 0) {
      md += '## Functions\n\n';
      for (const sig of signatures) {
        md += `### ${sig.name}\n\n`;
        if (sig.async) {
          md += '*Async function*\n\n';
        }
        if (sig.params.length > 0) {
          md += '**Parameters:**\n';
          for (const param of sig.params) {
            md += `- \`${param}\`\n`;
          }
          md += '\n';
        }
        md += `**Returns:** \`${sig.returnType}\`\n\n`;
        
        // Extract JSDoc for this function
        const jsdocContent = this.extractJsdocForFunction(code, sig.name);
        if (jsdocContent) {
          md += jsdocContent + '\n';
        }
        
        md += '---\n\n';
      }
    }
    
    return md;
  }

  /**
   * Generate HTML documentation
   */
  private generateHtml(
    code: string, 
    signatures: FunctionSignature[],
    patterns: CodePatterns
  ): string {
    let html = '<!DOCTYPE html>\n<html>\n<head>\n';
    html += '<title>API Documentation</title>\n';
    html += '<style>body { font-family: sans-serif; margin: 2rem; }</style>\n';
    html += '</head>\n<body>\n';
    html += '<h1>API Documentation</h1>\n';
    
    // Interfaces
    if (patterns.interfaces.length > 0) {
      html += '<h2>Interfaces</h2>\n<ul>\n';
      for (const iface of patterns.interfaces) {
        html += `<li><strong>${iface}</strong></li>\n`;
      }
      html += '</ul>\n';
    }
    
    // Functions
    if (signatures.length > 0) {
      html += '<h2>Functions</h2>\n';
      for (const sig of signatures) {
        html += `<h3>${sig.name}</h3>\n`;
        html += `<p>Returns: <code>${sig.returnType}</code></p>\n`;
      }
    }
    
    html += '</body>\n</html>';
    return html;
  }

  /**
   * Extract JSDoc content for a specific function
   */
  private extractJsdocForFunction(code: string, funcName: string): string {
    const regex = new RegExp(`\\/\\*\\*([\\s\\S]*?)\\*\\/\\s*(?:export\\s+)?(?:async\\s+)?function\\s+${funcName}`);
    const match = code.match(regex);
    
    if (match) {
      let jsdoc = match[1]
        .replace(/\s*\*\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Format @param tags
      jsdoc = jsdoc.replace(/@param\s+(\w+)\s+-?\s*/g, '\n**Parameter:** `$1` - ');
      jsdoc = jsdoc.replace(/@returns?\s+/g, '\n**Returns:** ');
      
      return jsdoc;
    }
    
    return '';
  }
}

export default SuperdocGenerator;
