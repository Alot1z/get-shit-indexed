/**
 * PostToolUse Reflection Hook
 * 
 * Captures learnings and reflections after significant tool operations
 * Integrates with debug-thinking graph for persistent learning
 * 
 * Features:
 * - Configurable trigger conditions
 * - Learning capture in debug-thinking graph
 * - Sequential thinking reflection
 * - Tractatus thinking reflection
 * - Configurable enable/disable
 */

const fs = require('fs').promises;
const path = require('path');

class ReflectionCaptureHook {
  constructor() {
    this.config = {
      enabled: true,
      useMCP: true,              // Use debug-thinking MCP server if available
      // Hook configuration will be loaded from hooks/hooks.json
    };
    
    // Trigger conditions for reflection
    this.triggerConditions = {
      always: false,              // Reflect on every tool use
      errors: true,               // Reflect on errors
      significant: true,          // Reflect on significant operations
      thinking: true,             // Reflect after thinking operations
      sequential: true,           // Reflect after sequential thinking
      tractatus: true,            // Reflect after tractatus thinking
      debug: true,                // Reflect after debug thinking
      file_operations: true,      // Reflect after file operations
      code_operations: true,      // Reflect after code operations
      relationship_operations: true, // Reflect after relationship operations
    };
    
    // Tool outcomes mapping to reflection types
    this.outcomeTypes = {
      success: 'learning',
      error: 'debugging',
      warning: 'caution',
      neutral: 'observation',
      performance: 'optimization',
    };
    
    // Initialize
    this.initialize();
  }
  
  async initialize() {
    // Load configuration
    await this.loadConfig();
    
    // Debug thinking graph integration
    this.debugGraphPath = path.join(process.env.HOME, '.debug-thinking-mcp');
    
    // Initialize MCP client for debug-thinking server
    this.debugClient = null;
    if (this.config.useMCP) {
      this.initializeDebugMCP();
    }
  }
  
  async initializeDebugMCP() {
    try {
      // Try to import the debug-thinking MCP server
      const debugMCP = require('@debug-thinking/debug-thinking-mcp');
      this.debugClient = new debugMCP.client();
      
      // Test connection
      await this.debugClient.ping();
      console.log('Debug-thinking MCP server connected successfully');
    } catch (error) {
      console.log('Debug-thinking MCP server not available, falling back to file storage');
      this.debugClient = null;
    }
  }
  
  async loadConfig() {
    try {
      const configPath = path.join(__dirname, 'hooks.json');
      const configContent = await fs.readFile(configPath, 'utf8');
      const hooksConfig = JSON.parse(configContent);
      
      // Load reflection-capture specific config
      if (hooksConfig['posttooluse']?.['reflection-capture']) {
        this.config = {
          ...this.config,
          ...hooksConfig['posttooluse']['reflection-capture']
        };
        
        // Update trigger conditions
        if (hooksConfig['posttooluse']['reflection-capture'].triggerConditions) {
          this.triggerConditions = {
            ...this.triggerConditions,
            ...hooksConfig['posttooluse']['reflection-capture'].triggerConditions
          };
        }
      }
    } catch (error) {
      // Use defaults if config not found
      console.log('Using default reflection-capture configuration');
    }
  }
  
  async shouldReflect(toolType, toolName, toolOutcome) {
    if (!this.config.enabled) {
      return false;
    }
    
    // Check specific trigger conditions
    if (this.triggerConditions.always) {
      return true;
    }
    
    // Check error reflection
    if (this.triggerConditions.errors && toolOutcome.error) {
      return true;
    }
    
    // Check thinking operation reflection
    if (this.triggerConditions.thinking && 
        (toolType === 'sequential' || toolType === 'tractatus' || toolType === 'debug')) {
      return true;
    }
    
    // Check specific thinking reflections
    if (toolType === 'sequential' && this.triggerConditions.sequential) {
      return true;
    }
    if (toolType === 'tractatus' && this.triggerConditions.tractatus) {
      return true;
    }
    if (toolType === 'debug' && this.triggerConditions.debug) {
      return true;
    }
    
    // Check operation type reflections
    if (this.triggerConditions.file_operations && toolType.includes('file')) {
      return true;
    }
    if (this.triggerConditions.code_operations && toolType.includes('code')) {
      return true;
    }
    if (this.triggerConditions.relationship_operations && toolType.includes('relationship')) {
      return true;
    }
    
    // Check significant operations
    if (this.triggerConditions.significant && this.isSignificant(toolType, toolName)) {
      return true;
    }
    
    return false;
  }
  
  isSignificant(toolType, toolName) {
    // Define significant operations that should trigger reflection
    const significantOperations = [
      'search', 'build', 'execute', 'deploy', 'create', 'write', 'edit',
      'delete', 'rename', 'move', 'sync', 'migrate', 'transform'
    ];
    
    // Check if operation is significant
    return significantOperations.some(op => toolName.toLowerCase().includes(op));
  }
  
  async captureReflection(toolType, toolName, toolOutcome, toolContext = {}) {
    if (!await this.shouldReflect(toolType, toolName, toolOutcome)) {
      return;
    }
    
    // Determine reflection type based on outcome
    const reflectionType = this.getReflectionType(toolOutcome);
    
    // Create reflection data
    const reflection = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      toolType,
      toolName,
      toolOutcome,
      reflectionType,
      context: toolContext,
      summary: this.generateSummary(toolType, toolName, toolOutcome),
      insights: this.extractInsights(toolType, toolName, toolOutcome, toolContext),
      recommendations: this.generateRecommendations(toolType, toolName, toolOutcome, toolContext)
    };
    
    // Store reflection in debug-thinking graph
    await this.storeInDebugGraph(reflection);
    
    // Log reflection
    this.logReflection(reflection);
    
    return reflection;
  }
  
  getReflectionType(toolOutcome) {
    if (toolOutcome.error) return 'debugging';
    if (toolOutcome.performance) return 'optimization';
    if (toolOutcome.warning) return 'caution';
    if (toolOutcome.success && toolOutcome.newKnowledge) return 'learning';
    return 'observation';
  }
  
  generateSummary(toolType, toolName, toolOutcome) {
    // Generate a concise summary of the operation and its outcome
    let summary = `${toolType} operation '${toolName}'`;
    
    if (toolOutcome.error) {
      summary += ` failed with error: ${toolOutcome.error.message || 'Unknown error'}`;
    } else if (toolOutcome.success) {
      summary += ` completed successfully`;
      
      if (toolOutcome.result) {
        summary += ` with result: ${JSON.stringify(toolOutcome.result).substring(0, 100)}...`;
      }
    } else {
      summary += ` completed with outcome: ${toolOutcome.status}`;
    }
    
    return summary;
  }
  
  extractInsights(toolType, toolName, toolOutcome, toolContext) {
    // Extract insights based on tool type and outcome
    const insights = [];
    
    if (toolType === 'sequential') {
      // Sequential thinking insights
      if (toolOutcome.thoughtSequence) {
        insights.push('Sequential thinking completed with clear thought progression');
      }
      if (toolOutcome.steps && toolOutcome.steps.length > 5) {
        insights.push('Complex task decomposed into manageable steps');
      }
    }
    
    if (toolType === 'tractatus') {
      // Tractatus thinking insights
      if (toolOutcome.structure) {
        insights.push('Logical structure analysis completed');
      }
      if (toolOutcome.multiplicativeRelationships) {
        insights.push('Multiplicative relationships identified and analyzed');
      }
    }
    
    if (toolType === 'debug') {
      // Debug thinking insights
      if (toolOutcome.rootCause) {
        insights.push(`Root cause identified: ${toolOutcome.rootCause}`);
      }
      if (toolOutcome.solution) {
        insights.push(`Solution found: ${toolOutcome.solution}`);
      }
    }
    
    // General insights
    if (toolOutcome.error) {
      insights.push('Error handling may need improvement');
      if (toolOutcome.errorType === 'timeout') {
        insights.push('Operation timed out - consider optimizing');
      }
    }
    
    if (toolOutcome.performance && toolOutcome.duration) {
      if (toolOutcome.duration > 5000) {
        insights.push('Performance optimization opportunity detected');
      }
    }
    
    return insights;
  }
  
  generateRecommendations(toolType, toolName, toolOutcome, toolContext) {
    // Generate recommendations based on the operation and outcome
    const recommendations = [];
    
    if (toolOutcome.error) {
      recommendations.push('Review error handling and retry mechanisms');
      if (toolOutcome.errorType === 'dependency') {
        recommendations.push('Check dependency versions and compatibility');
      }
      if (toolOutcome.errorType === 'configuration') {
        recommendations.push('Validate configuration settings');
      }
    }
    
    if (toolType === 'sequential') {
      recommendations.push('Consider if sequential thinking could be optimized');
      if (toolOutcome.steps && toolOutcome.steps.length > 10) {
        recommendations.push('Consider breaking down into smaller thought sequences');
      }
    }
    
    if (toolType === 'tractatus') {
      recommendations.push('Structural analysis may reveal new patterns');
      if (toolOutcome.complexity > 5) {
        recommendations.push('Consider simplifying the logical structure');
      }
    }
    
    if (toolType === 'debug') {
      recommendations.push('Document debugging patterns for future reference');
      if (toolOutcome.rootCause) {
        recommendations.push('Add automated detection for similar root causes');
      }
    }
    
    return recommendations;
  }
  
  async storeInDebugGraph(reflection) {
    try {
      // Create learning node structure
      const learningNode = {
        nodeType: 'learning',
        content: reflection.summary,
        metadata: {
          reflectionType: reflection.reflectionType,
          toolType: reflection.toolType,
          toolName: reflection.toolName,
          timestamp: reflection.timestamp,
          insights: reflection.insights,
          recommendations: reflection.recommendations
        },
        parentId: reflection.context.parentId || null,
        tags: ['reflection', reflection.reflectionType, reflection.toolType],
        confidence: 0.8
      };
      
      // Use MCP server if available
      if (this.debugClient) {
        await this.storeWithMCP(learningNode);
      } else {
        await this.storeWithFile(learningNode, reflection.id);
      }
      
    } catch (error) {
      console.error('Failed to store reflection in debug graph:', error);
    }
  }
  
  async storeWithMCP(learningNode) {
    try {
      // Create debug-thinking node using MCP
      const debugNode = {
        nodeType: 'learning',
        content: learningNode.content,
        metadata: learningNode.metadata,
        is_atomic: false,
        confidence: learningNode.confidence,
        tags: learningNode.tags
      };
      
      // Store using debug-thinking MCP server
      await this.debugClient.create({
        nodeType: 'learning',
        content: debugNode.content,
        metadata: debugNode.metadata,
        is_atomic: debugNode.is_atomic,
        confidence: debugNode.confidence
      });
      
      console.log(`Reflection stored in debug-thinking MCP graph: ${learningNode.metadata.id}`);
      
    } catch (error) {
      console.error('MCP storage failed, falling back to file:', error);
      await this.storeWithFile(learningNode, learningNode.metadata.id);
    }
  }
  
  async storeWithFile(learningNode, reflectionId) {
    try {
      // Ensure debug-thinking directory exists
      await fs.mkdir(this.debugGraphPath, { recursive: true });
      
      // Create debug-thinking node for file persistence
      const debugNode = {
        action: 'create',
        nodeType: 'learning',
        content: `Reflection: ${learningNode.metadata.toolName} (${learningNode.metadata.toolType})`,
        metadata: {
          id: reflectionId,
          timestamp: learningNode.metadata.timestamp,
          toolType: learningNode.metadata.toolType,
          toolName: learningNode.metadata.toolName,
          reflectionType: learningNode.metadata.reflectionType,
          summary: learningNode.content,
          insights: learningNode.metadata.insights,
          recommendations: learningNode.metadata.recommendations
        },
        is_atomic: learningNode.is_atomic,
        confidence: learningNode.confidence
      };
      
      // Write to debug-thinking storage
      const debugFilePath = path.join(this.debugGraphPath, 'reflections.json');
      let reflections = [];
      
      try {
        const existingContent = await fs.readFile(debugFilePath, 'utf8');
        reflections = JSON.parse(existingContent);
      } catch (error) {
        // File doesn't exist yet
      }
      
      reflections.push(debugNode);
      await fs.writeFile(debugFilePath, JSON.stringify(reflections, null, 2));
      
    } catch (error) {
      console.error('File storage failed:', error);
      throw error;
    }
  }
  
  async createDebugLearningNode(reflection) {
    try {
      // Map to 7-BMAD circle
      let bmadCircle = 'Methodd'; // Default to documentation/learning
      
      if (reflection.reflectionType === 'debugging') bmadCircle = 'Method';
      if (reflection.reflectionType === 'optimization') bmadCircle = 'Mod';
      if (reflection.reflectionType === 'caution') bmadCircle = 'Mode';
      
      // Create learning node with 7-BMAD integration
      const node = {
        nodeType: 'learning',
        content: reflection.summary,
        metadata: {
          id: reflection.id,
          timestamp: reflection.timestamp,
          toolType: reflection.toolType,
          toolName: reflection.toolName,
          reflectionType: reflection.reflectionType,
          bmadCircle: bmadCircle,
          insights: reflection.insights,
          recommendations: reflection.recommendations,
          context: reflection.context
        },
        tags: [
          'reflection', 
          reflection.reflectionType, 
          reflection.toolType,
          '7-BMAD',
          bmadCircle
        ],
        confidence: 0.8,
        is_atomic: false
      };
      
      return node;
    } catch (error) {
      console.error('Failed to create debug learning node:', error);
      throw error;
    }
  }
  
  logReflection(reflection) {
    console.log('\n📝 Reflection Captured:');
    console.log(`   Tool: ${reflection.toolType} - ${reflection.toolName}`);
    console.log(`   Type: ${reflection.reflectionType}`);
    console.log(`   Summary: ${reflection.summary}`);
    
    if (reflection.insights.length > 0) {
      console.log('   Insights:');
      reflection.insights.forEach(insight => {
        console.log(`     • ${insight}`);
      });
    }
    
    if (reflection.recommendations.length > 0) {
      console.log('   Recommendations:');
      reflection.recommendations.forEach(rec => {
        console.log(`     • ${rec}`);
      });
    }
    
    console.log('');
  }
  
  generateId() {
    return `reflection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Method for manual reflection capture
  async captureManualReflection(toolName, insights, recommendations) {
    const reflection = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      toolType: 'manual',
      toolName,
      toolOutcome: { success: true },
      reflectionType: 'learning',
      context: {},
      summary: `Manual reflection for ${toolName}`,
      insights,
      recommendations
    };
    
    await this.storeInDebugGraph(reflection);
    this.logReflection(reflection);
    
    return reflection;
  }
  
  // Method to get all reflections
  async getReflections(filter = {}) {
    try {
      const debugFilePath = path.join(this.debugGraphPath, 'reflections.json');
      const content = await fs.readFile(debugFilePath, 'utf8');
      const reflections = JSON.parse(content);
      
      // Apply filters if provided
      if (Object.keys(filter).length > 0) {
        return reflections.filter(ref => {
          return Object.entries(filter).every(([key, value]) => {
            return ref.metadata[key] === value;
          });
        });
      }
      
      return reflections;
    } catch (error) {
      return [];
    }
  }
  
  // Method to clear reflections
  async clearReflections() {
    try {
      const debugFilePath = path.join(this.debugGraphPath, 'reflections.json');
      await fs.writeFile(debugFilePath, '[]');
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Task 3: Add Sequential Reflection
  async captureSequentialReflection(sequentialContext) {
    if (!this.config.enabled || !this.triggerConditions.sequential) {
      return null;
    }
    
    const reflection = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      toolType: 'sequential',
      toolName: 'sequential-thinking',
      toolOutcome: { success: true },
      reflectionType: 'learning',
      context: sequentialContext,
      summary: this.generateSequentialSummary(sequentialContext),
      insights: this.extractSequentialInsights(sequentialContext),
      recommendations: this.generateSequentialRecommendations(sequentialContext)
    };
    
    await this.captureReflection('sequential', 'sequential-thinking', 
      { success: true, sequential: true }, sequentialContext);
    
    return reflection;
  }
  
  generateSequentialSummary(context) {
    if (!context || !context.thoughtSequence) {
      return 'Sequential thinking completed';
    }
    
    const totalSteps = context.thoughtSequence.steps || 0;
    const totalTime = context.thoughtSequence.totalTime || 0;
    
    return `Sequential thinking completed with ${totalSteps} steps in ${totalTime}ms`;
  }
  
  extractSequentialInsights(context) {
    const insights = [];
    
    if (!context) return insights;
    
    if (context.thoughtSequence) {
      const { steps, totalTime, cycles } = context.thoughtSequence;
      
      if (steps > 10) {
        insights.push('Complex task decomposed into manageable steps');
      }
      
      if (totalTime > 10000) {
        insights.push('Sequential thinking took longer than expected');
      }
      
      if (cycles > 3) {
        insights.push('Multi-cycle thinking required');
      }
      
      if (context.thoughtSequence.success) {
        insights.push('Thought sequence completed successfully');
      }
      
      if (context.thoughtSequence.conclusion) {
        insights.push(`Final conclusion: ${context.thoughtSequence.conclusion}`);
      }
    }
    
    if (context.toolUsage) {
      const fileOps = context.toolUsage.filter(op => op.type.includes('file')).length;
      const codeOps = context.toolUsage.filter(op => op.type.includes('code')).length;
      
      if (fileOps > 3) {
        insights.push('Multiple file operations performed');
      }
      
      if (codeOps > 2) {
        insights.push('Code analysis and modification performed');
      }
    }
    
    return insights;
  }
  
  generateSequentialRecommendations(context) {
    const recommendations = [];
    
    if (!context) return recommendations;
    
    if (context.thoughtSequence) {
      const { steps, totalTime, cycles } = context.thoughtSequence;
      
      if (steps > 15) {
        recommendations.push('Consider breaking down into smaller thought sequences');
      }
      
      if (totalTime > 15000) {
        recommendations.push('Optimize sequential thinking for better performance');
      }
      
      if (cycles > 5) {
        recommendations.push('Reduce thinking cycles for better efficiency');
      }
    }
    
    if (context.futureTasks) {
      recommendations.push('Apply similar thinking patterns to future tasks');
    }
    
    if (context.bottlenecks) {
      recommendations.push('Address identified bottlenecks in process');
    }
    
    return recommendations;
  }
  
  // Task 4: Add Tractatus Reflection
  async captureTractatusReflection(tractatusContext) {
    if (!this.config.enabled || !this.triggerConditions.tractatus) {
      return null;
    }
    
    const reflection = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      toolType: 'tractatus',
      toolName: 'tractatus-thinking',
      toolOutcome: { success: true },
      reflectionType: 'learning',
      context: tractatusContext,
      summary: this.generateTractatusSummary(tractatusContext),
      insights: this.extractTractatusInsights(tractatusContext),
      recommendations: this.generateTractatusRecommendations(tractatusContext)
    };
    
    await this.captureReflection('tractatus', 'tractatus-thinking', 
      { success: true, tractatus: true }, tractatusContext);
    
    return reflection;
  }
  
  generateTractatusSummary(context) {
    if (!context || !context.structure) {
      return 'Tractatus thinking completed';
    }
    
    const { propositions, depth, complexity } = context.structure;
    const totalProps = propositions.length;
    
    return `Tractatus thinking completed with ${totalProps} propositions at depth ${depth} (complexity: ${complexity})`;
  }
  
  extractTractatusInsights(context) {
    const insights = [];
    
    if (!context) return insights;
    
    if (context.structure) {
      const { propositions, depth, complexity } = context.structure;
      
      if (complexity > 5) {
        insights.push('High complexity logical structure analyzed');
      }
      
      if (depth > 4) {
        insights.push('Deep hierarchical structure decomposed');
      }
      
      if (propositions.length > 10) {
        insights.push('Multiple propositions analyzed and connected');
      }
      
      if (context.structure.multiplicativeRelationships) {
        insights.push('Multiplicative relationships identified');
      }
    }
    
    if (context.exportedStructure) {
      insights.push('Structure exported for future reuse');
    }
    
    if (context.patternsFound) {
      insights.push('Patterns identified in logical structure');
    }
    
    return insights;
  }
  
  generateTractatusRecommendations(context) {
    const recommendations = [];
    
    if (!context) return recommendations;
    
    if (context.structure) {
      const { propositions, depth, complexity } = context.structure;
      
      if (complexity > 7) {
        recommendations.push('Consider simplifying the logical structure');
      }
      
      if (depth > 5) {
        recommendations.push('Reduce structural depth for better clarity');
      }
      
      if (propositions.length > 20) {
        recommendations.push('Break down into smaller structural units');
      }
    }
    
    if (context.exportedStructure) {
      recommendations.push('Use exported structure for similar problems');
    }
    
    if (context.patternsFound) {
      recommendations.push('Apply identified patterns to future analyses');
    }
    
    return recommendations;
  }

// Export the hook
module.exports = ReflectionCaptureHook;