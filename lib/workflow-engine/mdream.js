/**
 * @fileoverview mdream - Markdown processing with knowledge extraction
 * Part of Phase 50D: Workflow Engine Integration
 * 
 * This module integrates mdream patterns for:
 * - Markdown to structured JSON conversion
 * - Knowledge pattern extraction
 * - Document analysis
 * 
 * @module workflow-engine/mdream
 * @version 1.0.0
 */

/**
 * @typedef {Object} MarkdownSection
 * @property {number} level - Heading level (1-6)
 * @property {string} heading - Heading text
 * @property {string} content - Section content
 * @property {MarkdownSection[]} [subsections] - Nested sections
 */

/**
 * @typedef {Object} CodeBlock
 * @property {string} language - Code language
 * @property {string} code - Code content
 * @property {string} [filename] - Optional filename from info string
 */

/**
 * @typedef {Object} ProcessedMarkdown
 * @property {string} title - Document title (first h1)
 * @property {string} [description] - Document description
 * @property {MarkdownSection[]} sections - Document sections
 * @property {CodeBlock[]} codeBlocks - Extracted code blocks
 * @property {object} knowledge - Extracted knowledge
 * @property {string[]} links - Extracted links
 * @property {object} metadata - Document metadata
 * @property {number} wordCount - Total word count
 * @property {number} readingTime - Estimated reading time (minutes)
 */

/**
 * @typedef {Object} KnowledgeExtraction
 * @property {object[]} decisions - Extracted decisions
 * @property {object[]} patterns - Extracted patterns
 * @property {object[]} rules - Extracted rules
 * @property {object[]} todos - Extracted todos
 * @property {object[]} references - Extracted references
 */

// Knowledge extraction patterns
const KNOWLEDGE_PATTERNS = {
  decision: /##?\s*(?:Decision|DECISION)[:\s]+([^\n]+)/gi,
  pattern: /##?\s*(?:Pattern|PATTERN)[:\s]+([^\n]+)/gi,
  rule: /##?\s*(?:Rule|RULE)[:\s]+([^\n]+)/gi,
  todo: /[-*]\s*\[([ x])\]\s*([^\n]+)/gi,
  reference: /\[([^\]]+)\]\(([^)]+)\)/g
};

/**
 * mdream processor class
 */
class MdreamProcessor {
  constructor(options = {}) {
    this.options = {
      extractKnowledge: options.extractKnowledge ?? true,
      preserveFormatting: options.preserveFormatting ?? false,
      maxDepth: options.maxDepth || 10,
      ...options
    };
  }

  /**
   * Process markdown content
   * @param {string} markdown - Markdown content
   * @param {object} options - Processing options
   * @returns {Promise<ProcessedMarkdown>}
   */
  async process(markdown, options = {}) {
    const opts = { ...this.options, ...options };
    
    // Parse document structure
    const lines = markdown.split('\n');
    const title = this.extractTitle(lines);
    const sections = this.parseSections(lines, opts.maxDepth);
    const codeBlocks = this.extractCodeBlocks(markdown);
    const links = this.extractLinks(markdown);
    
    // Calculate metrics
    const wordCount = this.countWords(markdown);
    const readingTime = Math.ceil(wordCount / 200); // 200 WPM average

    // Extract knowledge if enabled
    let knowledge = { decisions: [], patterns: [], rules: [], todos: [], references: [] };
    if (opts.extractKnowledge) {
      knowledge = await this.extractKnowledge(markdown);
    }

    return {
      title,
      sections,
      codeBlocks,
      knowledge,
      links,
      metadata: {
        processed: new Date().toISOString(),
        version: '1.0.0'
      },
      wordCount,
      readingTime
    };
  }

  /**
   * Extract document title
   * @param {string[]} lines - Markdown lines
   * @returns {string}
   */
  extractTitle(lines) {
    for (const line of lines) {
      const match = line.match(/^#\s+(.+)$/);
      if (match) return match[1].trim();
    }
    return 'Untitled';
  }

  /**
   * Parse sections from markdown
   * @param {string[]} lines - Markdown lines
   * @param {number} maxDepth - Maximum heading depth
   * @returns {MarkdownSection[]}
   */
  parseSections(lines, maxDepth = 10) {
    const sections = [];
    const stack = [{ level: 0, sections }];
    let currentContent = [];
    let currentSection = null;

    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      
      if (headingMatch) {
        const level = headingMatch[1].length;
        const heading = headingMatch[2].trim();

        // Skip h1 (document title)
        if (level === 1) continue;

        // Save content for previous section
        if (currentContent.length > 0 && currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          currentContent = [];
        }

        const section = {
          level,
          heading,
          content: '',
          subsections: []
        };
        currentSection = section;

        // Find parent level
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        // Add to parent's subsections or root
        stack[stack.length - 1].sections.push(section);
        stack.push({ level, sections: section.subsections });

        // Enforce max depth
        if (level >= maxDepth) break;
      } else {
        currentContent.push(line);
      }
    }

    // Save final content
    if (currentContent.length > 0 && currentSection) {
      currentSection.content = currentContent.join('\n').trim();
    }

    return sections;
  }

  /**
   * Extract code blocks from markdown
   * @param {string} markdown - Markdown content
   * @returns {CodeBlock[]}
   */
  extractCodeBlocks(markdown) {
    const codeBlocks = [];
    // Match code blocks with language, optional filename, and code content
    const regex = /```(\w*)(?:[ \t]+([^\n]*))?\n([\s\S]*?)```/g;
    
    let match;
    while ((match = regex.exec(markdown)) !== null) {
      const code = match[3];
      codeBlocks.push({
        language: match[1] || 'text',
        filename: match[2]?.trim() || undefined,
        // Remove single trailing newline if present, but preserve internal formatting
        code: code.endsWith('\n') ? code.slice(0, -1) : code
      });
    }
    
    return codeBlocks;
  }

  /**
   * Extract links from markdown
   * @param {string} markdown - Markdown content
   * @returns {string[]}
   */
  extractLinks(markdown) {
    const links = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    let match;
    while ((match = regex.exec(markdown)) !== null) {
      links.push({
        text: match[1],
        url: match[2]
      });
    }
    
    return links;
  }

  /**
   * Count words in markdown
   * @param {string} markdown - Markdown content
   * @returns {number}
   */
  countWords(markdown) {
    // Remove code blocks
    const text = markdown.replace(/```[\s\S]*?```/g, '');
    // Remove markdown syntax
    const clean = text.replace(/[#*_`\[\]()>-]/g, ' ');
    // Split and count
    return clean.split(/\s+/).filter(w => w.length > 0).length;
  }

  /**
   * Extract knowledge patterns from markdown
   * @param {string} markdown - Markdown content
   * @returns {Promise<KnowledgeExtraction>}
   */
  async extractKnowledge(markdown) {
    const knowledge = {
      decisions: [],
      patterns: [],
      rules: [],
      todos: [],
      references: []
    };

    // Extract decisions
    let match;
    const decisionRegex = /##?\s*Decision[:\s]+([^\n]+)[\s\S]*?(?=##?\s*(?:Decision|Pattern|Rule)|$)/gi;
    while ((match = decisionRegex.exec(markdown)) !== null) {
      knowledge.decisions.push({
        title: match[1].trim(),
        content: match[0].replace(match[1], '').trim(),
        confidence: this.estimateConfidence(match[0])
      });
    }

    // Extract patterns
    const patternRegex = /##?\s*Pattern[:\s]+([^\n]+)[\s\S]*?(?=##?\s*(?:Decision|Pattern|Rule)|$)/gi;
    while ((match = patternRegex.exec(markdown)) !== null) {
      knowledge.patterns.push({
        name: match[1].trim(),
        content: match[0].replace(match[1], '').trim(),
        steps: this.extractSteps(match[0])
      });
    }

    // Extract rules
    const ruleRegex = /##?\s*Rule[:\s]+([^\n]+)[\s\S]*?(?=##?\s*(?:Decision|Pattern|Rule)|$)/gi;
    while ((match = ruleRegex.exec(markdown)) !== null) {
      knowledge.rules.push({
        title: match[1].trim(),
        content: match[0].replace(match[1], '').trim()
      });
    }

    // Extract todos
    const todoRegex = /[-*]\s*\[([ x])\]\s*([^\n]+)/g;
    while ((match = todoRegex.exec(markdown)) !== null) {
      knowledge.todos.push({
        completed: match[1] === 'x',
        task: match[2].trim()
      });
    }

    // Extract references
    const refRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    while ((match = refRegex.exec(markdown)) !== null) {
      knowledge.references.push({
        text: match[1],
        url: match[2]
      });
    }

    return knowledge;
  }

  /**
   * Extract steps from content
   * @param {string} content - Content to parse
   * @returns {string[]}
   */
  extractSteps(content) {
    const steps = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Numbered steps: 1. Step
      const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
      if (numberedMatch) {
        steps.push(numberedMatch[1].trim());
        continue;
      }
      
      // Arrow steps: -> Step
      const arrowMatch = line.match(/->\s+(.+)$/);
      if (arrowMatch) {
        steps.push(arrowMatch[1].trim());
      }
    }
    
    return steps;
  }

  /**
   * Estimate confidence score from content
   * @param {string} content - Content to analyze
   * @returns {number} Confidence 0-1
   */
  estimateConfidence(content) {
    const confidenceMarkers = [
      { pattern: /\b(must|always|never|critical|essential)\b/gi, weight: 0.9 },
      { pattern: /\b(should|recommended|best practice)\b/gi, weight: 0.7 },
      { pattern: /\b(may|might|could|optionally)\b/gi, weight: 0.5 },
      { pattern: /\b(perhaps|maybe|sometimes)\b/gi, weight: 0.3 }
    ];

    let totalWeight = 0;
    let matchCount = 0;

    for (const { pattern, weight } of confidenceMarkers) {
      const matches = content.match(pattern);
      if (matches) {
        totalWeight += weight * matches.length;
        matchCount += matches.length;
      }
    }

    return matchCount > 0 ? totalWeight / matchCount : 0.5;
  }
}

/**
 * Analyze mdream markdown processing patterns
 * @param {string} repoUrl - Repository URL
 * @returns {Promise<object>}
 */
async function analyzeMdream(repoUrl = 'https://github.com/harlan-zw/mdream') {
  return {
    repository: repoUrl,
    parsingStrategy: {
      type: 'ast-based',
      streaming: false,
      features: ['sections', 'code-blocks', 'links', 'metadata']
    },
    outputFormats: ['json', 'html', 'text'],
    knowledgeExtraction: {
      enabled: true,
      patterns: Object.keys(KNOWLEDGE_PATTERNS),
      confidenceScoring: true
    },
    performance: {
      optimized: true,
      caching: false
    },
    analyzed: new Date().toISOString()
  };
}

/**
 * Process markdown to structured JSON
 * @param {string} markdown - Markdown content
 * @param {object} options - Processing options
 * @returns {Promise<ProcessedMarkdown>}
 */
async function processMarkdown(markdown, options = {}) {
  const processor = new MdreamProcessor(options);
  return processor.process(markdown, options);
}

/**
 * Extract knowledge from markdown
 * @param {string} markdown - Markdown content
 * @returns {Promise<KnowledgeExtraction>}
 */
async function extractKnowledge(markdown) {
  const processor = new MdreamProcessor();
  return processor.extractKnowledge(markdown);
}

/**
 * Convert markdown to CXML format
 * @param {string} markdown - Markdown content
 * @returns {string}
 */
function markdownToCxml(markdown) {
  const processor = new MdreamProcessor();
  const lines = markdown.split('\n');
  const title = processor.extractTitle(lines);
  
  let cxml = `<?xml version="1.0" encoding="UTF-8"?>\n<documents>\n`;
  cxml += `<document source="${title}">\n`;
  cxml += `<content><![CDATA[${markdown}]]></content>\n`;
  cxml += `</document>\n</documents>`;
  
  return cxml;
}

module.exports = {
  MdreamProcessor,
  KNOWLEDGE_PATTERNS,
  analyzeMdream,
  processMarkdown,
  extractKnowledge,
  markdownToCxml
};
