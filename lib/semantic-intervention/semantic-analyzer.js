/**
 * Semantic Analyzer
 * 
 * Analyzes prompts and operations semantically to determine:
 * - Intent (implement, modify, analyze, research)
 * - Complexity (0-100 scale)
 * - Risk level (LOW, MEDIUM, HIGH, EXTREME)
 * - Pattern matching (frameworks, best practices)
 */

const { callSequential, callTractatus } = require('../thinking/mcp-connector');

// Intent patterns for classification
const INTENT_PATTERNS = {
  implementation: [
    /\b(create|build|implement|add|develop|write|construct|setup|initialize)\b/i,
    /\b(new feature|from scratch|start)\b/i
  ],
  modification: [
    /\b(refactor|fix|update|modify|change|improve|optimize|enhance|rename)\b/i,
    /\b(bug|issue|error|problem)\b/i
  ],
  analysis: [
    /\b(analyze|review|explain|understand|examine|assess|evaluate)\b/i,
    /\b(what does|how does|why does)\b/i
  ],
  research: [
    /\b(find|search|investigate|explore|research|look up|locate)\b/i,
    /\b(documentation|docs|example)\b/i
  ]
};

// Framework detection patterns
const FRAMEWORK_PATTERNS = {
  react: [/\breact\b/i, /\bjsx\b/i, /\busestate\b/i, /\buseeffect\b/i],
  express: [/\bexpress\b/i, /\bexpress\.js\b/i, /\bapp\.get\b/i, /\bapp\.post\b/i],
  typescript: [/\btypescript\b/i, /\b\.ts\b/, /\binterface\b/i, /\btype\b/],
  nextjs: [/\bnext\.?js\b/i, /\bgetstaticprops\b/i, /\bgetserversideprops\b/i],
  nodejs: [/\bnode\.?js\b/i, /\bcommonjs\b/i, /\brequire\s*\(/],
  python: [/\bpython\b/i, /\b\.py\b/, /\bdef\s+\w+\s*\(/, /\bimport\s+\w+/],
  postgresql: [/\bpostgres\b/i, /\bpsql\b/i, /\bpg\b/i],
  mongodb: [/\bmongodb?\b/i, /\bmongoose\b/i, /\bObjectId\b/i]
};

// Complexity factors
const COMPLEXITY_FACTORS = {
  multiPart: 15,          // "and", "also", "then"
  nestedStructures: 10,   // nested objects, arrays
  asyncOperations: 12,    // async, await, promise
  fileOperations: 8,      // read, write, delete
  databaseOps: 15,        // query, insert, update
  apiCalls: 10,           // fetch, request, api
  authentication: 20,     // auth, login, token
  security: 25,           // encrypt, secure, protect
  testing: 8,             // test, spec, mock
  deployment: 15          // deploy, ci/cd, docker
};

class SemanticAnalyzer {
  constructor(config = {}) {
    this.config = {
      useThinkingServer: config.useThinkingServer ?? true,
      timeout: config.timeout || 3000,
      cacheResults: config.cacheResults ?? true,
      ...config
    };
    
    this.cache = new Map();
    this.metrics = {
      analysesRun: 0,
      cacheHits: 0,
      averageComplexity: 0,
      intentDistribution: {}
    };
  }
  
  /**
   * Analyze a prompt semantically
   * @param {string} prompt - Input prompt
   * @param {object} context - Additional context
   * @returns {Promise<object>} Analysis result
   */
  async analyze(prompt, context = {}) {
    this.metrics.analysesRun++;
    
    // Check cache
    const cacheKey = this._getCacheKey(prompt, context);
    if (this.config.cacheResults && this.cache.has(cacheKey)) {
      this.metrics.cacheHits++;
      return this.cache.get(cacheKey);
    }
    
    // Perform analysis
    const analysis = {
      prompt,
      timestamp: Date.now(),
      
      // Intent classification
      intent: this._classifyIntent(prompt),
      
      // Complexity scoring (0-100)
      complexity: this._calculateComplexity(prompt, context),
      
      // Risk assessment
      riskScore: 0,
      riskLevel: 'LOW',
      riskFactors: [],
      
      // Pattern detection
      frameworks: this._detectFrameworks(prompt),
      patterns: this._detectPatterns(prompt),
      
      // Semantic features
      entities: this._extractEntities(prompt),
      actionVerbs: this._extractActionVerbs(prompt),
      technicalTerms: this._extractTechnicalTerms(prompt),
      
      // Recommendations
      recommendedThinkingMode: null,
      recommendedIntervention: null
    };
    
    // Calculate risk score
    const riskResult = this._assessRisk(analysis, context);
    analysis.riskScore = riskResult.score;
    analysis.riskLevel = riskResult.level;
    analysis.riskFactors = riskResult.factors;
    
    // Get thinking-based deep analysis if enabled
    if (this.config.useThinkingServer && analysis.complexity > 40) {
      try {
        const deepAnalysis = await this._deepAnalysis(prompt, analysis);
        analysis.deepAnalysis = deepAnalysis;
        analysis.recommendedThinkingMode = deepAnalysis.recommendedMode;
      } catch (e) {
        analysis.deepAnalysisError = e.message;
      }
    }
    
    // Generate recommendations
    analysis.recommendedThinkingMode = analysis.recommendedThinkingMode || 
      this._recommendThinkingMode(analysis);
    analysis.recommendedIntervention = this._recommendIntervention(analysis);
    
    // Update metrics
    this._updateMetrics(analysis);
    
    // Cache result
    if (this.config.cacheResults) {
      this.cache.set(cacheKey, analysis);
    }
    
    return analysis;
  }
  
  /**
   * Classify intent from prompt
   * @private
   */
  _classifyIntent(prompt) {
    const scores = {};
    
    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
      let score = 0;
      for (const pattern of patterns) {
        if (pattern.test(prompt)) {
          score += 1;
        }
      }
      scores[intent] = score;
    }
    
    // Find highest scoring intent
    let maxIntent = 'unknown';
    let maxScore = 0;
    
    for (const [intent, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        maxIntent = intent;
      }
    }
    
    return {
      primary: maxIntent,
      confidence: maxScore > 0 ? Math.min(maxScore / 2, 1) : 0,
      allScores: scores
    };
  }
  
  /**
   * Calculate complexity score (0-100)
   * @private
   */
  _calculateComplexity(prompt, context) {
    if (!prompt || typeof prompt !== 'string') {
      return 0;
    }
    let score = 0;
    const lowerPrompt = prompt.toLowerCase();
    
    // Base complexity from word count (increased multiplier)
    const wordCount = prompt.split(/\s+/).length;
    score += Math.min(wordCount / 5, 20);  // Increased from /10, 15 to /5, 20
    
    // Factor-based complexity (increased multipliers)
    for (const [factor, points] of Object.entries(COMPLEXITY_FACTORS)) {
      const patterns = {
        multiPart: ['and', 'also', 'then', 'additionally', 'furthermore'],
        nestedStructures: ['nested', 'deep', 'hierarchical', 'recursive'],
        asyncOperations: ['async', 'await', 'promise', 'callback', 'event'],
        fileOperations: ['read', 'write', 'delete', 'create file', 'update file'],
        databaseOps: ['query', 'insert', 'update', 'database', 'sql', 'mongo', 'redis'],
        apiCalls: ['api', 'fetch', 'request', 'http', 'endpoint', 'rest', 'gateway'],
        authentication: ['auth', 'login', 'token', 'session', 'jwt', 'oauth'],
        security: ['encrypt', 'secure', 'protect', 'sanitize', 'validate'],
        testing: ['test', 'spec', 'mock', 'assert', 'expect'],
        deployment: ['deploy', 'ci', 'cd', 'docker', 'kubernetes', 'pipeline']
      };
      
      const factorPatterns = patterns[factor] || [];
      for (const p of factorPatterns) {
        if (lowerPrompt.includes(p)) {
          score += points * 1.5;  // Multiply by 1.5 for better scoring
          break;
        }
      }
    }
    
    // Multi-part detection (increased multiplier)
    const multiPartKeywords = ['first', 'second', 'then', 'after that', 'finally', 'also'];
    let multiPartCount = 0;
    for (const kw of multiPartKeywords) {
      if (lowerPrompt.includes(kw)) multiPartCount++;
    }
    score += multiPartCount * 8;  // Increased from 5 to 8
    
    // Architecture/design keywords add significant complexity
    const architectureKeywords = ['architecture', 'microservices', 'distributed', 'cluster', 'design'];
    for (const kw of architectureKeywords) {
      if (lowerPrompt.includes(kw)) {
        score += 10;
      }
    }
    
    // Context complexity
    if (context.files && context.files.length > 3) {
      score += (context.files.length - 3) * 3;
    }
    
    return Math.min(Math.round(score), 100);
  }
  
  /**
   * Assess risk level
   * @private
   */
  _assessRisk(analysis, context) {
    let score = 0;
    const factors = [];
    
    // Complexity contributes to risk
    if (analysis.complexity > 70) {
      score += 30;
      factors.push({ factor: 'high_complexity', points: 30 });
    } else if (analysis.complexity > 50) {
      score += 15;
      factors.push({ factor: 'medium_complexity', points: 15 });
    }
    
    // Critical operations (high risk)
    const criticalPatterns = [
      { pattern: /\bdrop\b/i, points: 40, factor: 'drop_operation' },
      { pattern: /\bdelete\s+all\b/i, points: 35, factor: 'delete_all' },
      { pattern: /\btruncate\b/i, points: 30, factor: 'truncate_operation' },
      { pattern: /\bproduction\b/i, points: 20, factor: 'production_environment' },
      { pattern: /\bremove\s+all\b/i, points: 30, factor: 'remove_all' }
    ];
    
    for (const { pattern, points, factor } of criticalPatterns) {
      if (pattern.test(analysis.prompt)) {
        score += points;
        factors.push({ factor, points });
      }
    }
    
    // Ambiguity indicators
    const ambiguityPatterns = [
      /\bmight\b/i, /\bmaybe\b/i, /\bcould\b/i, /\bpossibly\b/i,
      /\bsomething\b/i, /\bsome\b/i, /\betc\b/i, /\bwhatever\b/i
    ];
    let ambiguityScore = 0;
    for (const pattern of ambiguityPatterns) {
      if (pattern.test(analysis.prompt)) {
        ambiguityScore += 5;
      }
    }
    if (ambiguityScore > 0) {
      score += Math.min(ambiguityScore, 30);
      factors.push({ factor: 'ambiguity', points: Math.min(ambiguityScore, 30) });
    }
    
    // Scope factors
    if (analysis.frameworks && analysis.frameworks.length > 2) {
      score += 10;
      factors.push({ factor: 'multiple_frameworks', points: 10 });
    }
    
    // Security-sensitive operations
    const securityPatterns = [
      /\bpassword\b/i, /\bsecret\b/i, /\bkey\b/i, /\btoken\b/i,
      /\bauth\b/i, /\bpermission\b/i, /\baccess\b/i
    ];
    for (const pattern of securityPatterns) {
      if (pattern.test(analysis.prompt)) {
        score += 10;
        factors.push({ factor: 'security_sensitive', points: 10 });
        break;
      }
    }
    
    // Database operations with destructive keywords
    if (/\bdatabase\b/i.test(analysis.prompt) && /\b(drop|delete|remove|truncate)\b/i.test(analysis.prompt)) {
      score += 15;
      factors.push({ factor: 'destructive_database_op', points: 15 });
    }
    
    // Determine risk level
    let level = 'LOW';
    if (score >= 76) level = 'EXTREME';
    else if (score >= 51) level = 'HIGH';
    else if (score >= 26) level = 'MEDIUM';
    
    return { score: Math.min(score, 100), level, factors };
  }
  
  /**
   * Detect frameworks mentioned
   * @private
   */
  _detectFrameworks(prompt) {
    const detected = [];
    
    for (const [framework, patterns] of Object.entries(FRAMEWORK_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(prompt)) {
          detected.push(framework);
          break;
        }
      }
    }
    
    return detected;
  }
  
  /**
   * Detect development patterns
   * @private
   */
  _detectPatterns(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return [];
    }
    const patterns = [];
    const lowerPrompt = prompt.toLowerCase();
    
    // Common patterns
    if (lowerPrompt.includes('crud')) patterns.push('crud');
    if (lowerPrompt.includes('mvc')) patterns.push('mvc');
    if (lowerPrompt.includes('api')) patterns.push('api');
    if (lowerPrompt.includes('middleware')) patterns.push('middleware');
    if (lowerPrompt.includes('hook')) patterns.push('hooks');
    if (lowerPrompt.includes('component')) patterns.push('component-based');
    if (lowerPrompt.includes('service')) patterns.push('service-layer');
    if (lowerPrompt.includes('repository')) patterns.push('repository-pattern');
    if (lowerPrompt.includes('factory')) patterns.push('factory-pattern');
    if (lowerPrompt.includes('singleton')) patterns.push('singleton-pattern');
    
    return patterns;
  }
  
  /**
   * Extract entities from prompt
   * @private
   */
  _extractEntities(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return [];
    }
    const entities = [];
    
    // File paths
    const filePaths = prompt.match(/[\/\\][\w\-\.\/\\]+/g) || [];
    entities.push(...filePaths.map(p => ({ type: 'file_path', value: p })));
    
    // Class/function names (capitalized or camelCase)
    const classNames = prompt.match(/\b[A-Z][a-zA-Z0-9]*\b/g) || [];
    entities.push(...classNames.map(c => ({ type: 'identifier', value: c })));
    
    // URLs
    const urls = prompt.match(/https?:\/\/[^\s]+/g) || [];
    entities.push(...urls.map(u => ({ type: 'url', value: u })));
    
    return entities;
  }
  
  /**
   * Extract action verbs
   * @private
   */
  _extractActionVerbs(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return [];
    }
    const actionVerbs = [
      'create', 'build', 'implement', 'add', 'develop', 'write',
      'refactor', 'fix', 'update', 'modify', 'change', 'improve',
      'analyze', 'review', 'explain', 'understand', 'examine',
      'find', 'search', 'investigate', 'explore', 'research',
      'delete', 'remove', 'clean', 'optimize', 'test', 'deploy'
    ];
    
    const found = [];
    const lowerPrompt = prompt.toLowerCase();
    
    for (const verb of actionVerbs) {
      if (lowerPrompt.includes(verb)) {
        found.push(verb);
      }
    }
    
    return [...new Set(found)];
  }
  
  /**
   * Extract technical terms
   * @private
   */
  _extractTechnicalTerms(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return [];
    }
    const techTerms = [
      'api', 'rest', 'graphql', 'sql', 'nosql', 'database',
      'frontend', 'backend', 'fullstack', 'server', 'client',
      'component', 'module', 'package', 'library', 'framework',
      'test', 'spec', 'mock', 'stub', 'fixture',
      'async', 'sync', 'promise', 'callback', 'event',
      'type', 'interface', 'class', 'function', 'method',
      'route', 'endpoint', 'middleware', 'handler', 'controller'
    ];
    
    const found = [];
    const lowerPrompt = prompt.toLowerCase();
    
    for (const term of techTerms) {
      if (lowerPrompt.includes(term)) {
        found.push(term);
      }
    }
    
    return [...new Set(found)];
  }
  
  /**
   * Deep analysis using thinking servers
   * @private
   */
  async _deepAnalysis(prompt, basicAnalysis) {
    const analysisPrompt = `Analyze this task semantically:
    
Task: ${prompt}

Basic Analysis:
- Intent: ${basicAnalysis.intent.primary}
- Complexity: ${basicAnalysis.complexity}
- Risk: ${basicAnalysis.riskLevel}

Provide:
1. Task decomposition (2-5 sub-tasks)
2. Recommended approach
3. Potential pitfalls
4. Best thinking server to use (sequential/tractatus/debug)`;

    const result = await callTractatus(analysisPrompt, {
      timeout: this.config.timeout
    });
    
    return {
      raw: result,
      recommendedMode: this._extractRecommendedMode(result)
    };
  }
  
  /**
   * Extract recommended thinking mode from result
   * @private
   */
  _extractRecommendedMode(result) {
    if (!result || !result.result) return 'standard';
    
    const text = JSON.stringify(result.result).toLowerCase();
    
    if (text.includes('sequential')) return 'comprehensive';
    if (text.includes('tractatus')) return 'comprehensive';
    if (text.includes('debug')) return 'standard';
    
    return 'standard';
  }
  
  /**
   * Recommend thinking mode based on analysis
   * @private
   */
  _recommendThinkingMode(analysis) {
    if (analysis.complexity > 70 || analysis.riskLevel === 'EXTREME') {
      return 'comprehensive';
    }
    if (analysis.complexity > 40 || analysis.riskLevel === 'HIGH') {
      return 'standard';
    }
    if (analysis.complexity > 20) {
      return 'lightweight';
    }
    return 'none';
  }
  
  /**
   * Recommend intervention type
   * @private
   */
  _recommendIntervention(analysis) {
    if (analysis.riskLevel === 'EXTREME') {
      return { type: 'multi-path', reason: 'Extreme risk requires parallel exploration' };
    }
    if (analysis.intent.confidence < 0.3) {
      return { type: 'clarification', reason: 'Low intent confidence needs clarification' };
    }
    if (analysis.complexity > 60 && analysis.frameworks.length > 2) {
      return { type: 'decomposition', reason: 'Complex multi-framework task benefits from decomposition' };
    }
    return null;
  }
  
  /**
   * Get cache key
   * @private
   */
  _getCacheKey(prompt, context) {
    return `${prompt}:${JSON.stringify(context)}`;
  }
  
  /**
   * Update metrics
   * @private
   */
  _updateMetrics(analysis) {
    // Update average complexity
    const prevCount = this.metrics.analysesRun - 1;
    this.metrics.averageComplexity = 
      (this.metrics.averageComplexity * prevCount + analysis.complexity) / 
      this.metrics.analysesRun;
    
    // Update intent distribution
    const intent = analysis.intent.primary;
    this.metrics.intentDistribution[intent] = 
      (this.metrics.intentDistribution[intent] || 0) + 1;
  }
  
  /**
   * Get analyzer metrics
   * @returns {object} Metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      cacheHitRate: this.metrics.analysesRun > 0 
        ? this.metrics.cacheHits / this.metrics.analysesRun 
        : 0
    };
  }
  
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = { SemanticAnalyzer };
