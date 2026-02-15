#!/usr/bin/env node

/**
 * PreToolUse Thinking Hook
 * Triggers thinking servers before complex tool operations to enhance decision-making
 */

const fs = require('fs');
const path = require('path');

class ThinkingTrigger {
    constructor() {
        this.enabled = true;
        this.config = this.loadConfig();
        this.thinkingServers = {
            sequential: {
                id: 'mcp__sequential-thinking__sequentialthinking',
                circle: 'Method',
                description: 'Multi-step process decomposition'
            },
            tractatus: {
                id: 'mcp__tractatus-thinking__tractatus_thinking',
                circle: 'Model',
                description: 'Logical structure analysis (WHAT before HOW)'
            },
            debug: {
                id: 'mcp__debug-thinking__debug_thinking',
                circle: 'Debug',
                description: 'Graph-based debugging and problem-solving'
            }
        };
    }

    /**
     * Load configuration
     */
    loadConfig() {
        const configPath = path.join(__dirname, '..', 'hooks', 'hooks.json');
        try {
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                return config.thinking || {};
            }
        } catch (error) {
            console.warn('Warning: Could not load thinking hook config:', error.message);
        }
        return {};
    }

    /**
     * Determine if thinking should be triggered for a tool
     */
    shouldTrigger(toolName, args = {}) {
        if (!this.enabled) return false;
        
        // Check if tool has configured thinking mode
        const toolMode = this.config.toolMapping?.[toolName] || 'standard';
        const modeConfig = this.config.modes?.[toolMode];
        
        if (!modeConfig) return false;
        
        // Check complexity threshold
        const complexity = this.calculateComplexity(toolName, args);
        return complexity >= this.getComplexityThreshold(toolMode);
    }

    /**
     * Calculate operation complexity
     */
    calculateComplexity(toolName, args = {}) {
        let complexity = 1; // Base complexity
        
        // Tool-specific complexity
        switch (toolName) {
            case 'start_process':
            case 'execute':
                complexity = args.command?.length > 100 ? 3 : 2;
                break;
            case 'read_multiple_files':
            case 'write_file':
                complexity = args.files?.length > 5 ? 3 : 2;
                break;
            case 'edit_block':
                complexity = args.content?.length > 1000 ? 3 : 2;
                break;
            case 'search_code_advanced':
            case 'build_deep_index':
                complexity = 3; // Always complex for code operations
                break;
            case 'query':
            case 'analyze_code_relationships':
                complexity = 4; // Very complex for graph operations
                break;
        }
        
        return complexity;
    }

    /**
     * Get complexity threshold for mode
     */
    getComplexityThreshold(mode) {
        const thresholds = {
            lightweight: 2,
            standard: 2,
            comprehensive: 1
        };
        return thresholds[mode] || 2;
    }

    /**
     * Get appropriate thinking server for tool
     */
    getThinkingServer(toolName) {
        const toolMode = this.config.toolMapping?.[toolName] || 'standard';
        const modeConfig = this.config.modes?.[toolMode];
        
        if (!modeConfig?.thinkingServers) return null;
        
        // Select server based on tool type and 7-BMAD circle
        switch (toolName) {
            case 'start_process':
            case 'execute':
            case 'interact_with_process':
                return this.thinkingServers.sequential;
                
            case 'edit_block':
            case 'write_file':
            case 'move_file':
                return this.thinkingServers.tractatus;
                
            case 'query':
            case 'analyze_code_relationships':
            case 'find_dead_code':
                return this.thinkingServers.debug;
                
            default:
                // Default to sequential for unknown tools
                return this.thinkingServers.sequential;
        }
    }

    /**
     * Trigger thinking for tool operation
     */
    async trigger(toolName, args = {}) {
        if (!this.shouldTrigger(toolName, args)) {
            return { shouldThink: false };
        }

        const server = this.getThinkingServer(toolName);
        if (!server) return { shouldThink: false };

        console.log(`\n🧠 [Thinking Hook] Triggering ${server.circle} circle thinking for ${toolName}`);
        
        // Prepare thinking context
        const context = this.buildContext(toolName, args);
        
        // Build thinking parameters
        const params = this.buildThinkingParams(server, toolName, context);
        
        try {
            // Execute thinking (simplified - actual MCP integration would happen here)
            const result = await this.executeThinking(server, params);
            
            console.log(`✅ [Thinking Hook] ${server.circle} thinking complete`);
            
            return {
                shouldThink: true,
                server: server.id,
                result: result,
                recommendations: result.recommendations || []
            };
            
        } catch (error) {
            console.error(`❌ [Thinking Hook] Thinking failed:`, error.message);
            return {
                shouldThink: false,
                error: error.message
            };
        }
    }

    /**
     * Build context for thinking
     */
    buildContext(toolName, args) {
        return {
            tool: toolName,
            timestamp: new Date().toISOString(),
            operation: {
                type: toolName,
                args: args,
                complexity: this.calculateComplexity(toolName, args)
            },
            environment: {
                workingDirectory: process.cwd(),
                nodeVersion: process.version
            }
        };
    }

    /**
     * Build thinking parameters
     */
    buildThinkingParams(server, toolName, context) {
        const baseParams = {
            context: JSON.stringify(context, null, 2)
        };

        switch (server.id) {
            case 'mcp__sequential-thinking__sequentialthinking':
                return {
                    ...baseParams,
                    thought: `Preparing to execute ${toolName} operation`,
                    nextThoughtNeeded: true,
                    totalThoughts: 5,
                    needsMoreThoughts: true
                };
                
            case 'mcp__tractatus-thinking__tractatus_thinking':
                return {
                    operation: 'start',
                    concept: `Architecture for ${toolName} operation`,
                    depth_limit: 5,
                    style: 'analytical'
                };
                
            case 'mcp__debug-thinking__debug_thinking':
                return {
                    action: 'create',
                    nodeType: 'problem',
                    content: `Debug scenario for ${toolName} operation`,
                    metadata: {
                        tool: toolName,
                        complexity: this.calculateComplexity(toolName, context.operation.args)
                    }
                };
                
            default:
                return baseParams;
        }
    }

    /**
     * Execute thinking (placeholder for actual MCP integration)
     */
    async executeThinking(server, params) {
        // This would integrate with the actual MCP servers
        // For now, return a simulated result
        
        // Sequential Thinking for Method circle (multi-step operations)
        if (server.id === 'mcp__sequential-thinking__sequentialthinking') {
            return {
                success: true,
                server: server.id,
                circle: server.circle,
                timestamp: new Date().toISOString(),
                process: {
                    steps: this.generateSequentialSteps(params.tool || params.operation),
                    totalSteps: 5,
                    currentStep: 1
                },
                recommendations: [
                    `Break down ${params.tool || params.operation} into clear sequential steps`,
                    `Verify each step before proceeding to the next`,
                    `Handle errors at each step appropriately`,
                    `Consider rollback mechanisms for failed operations`,
                    `Document the process for future reference`
                ]
            };
        }
        
        // Tractatus Thinking for Model circle (architecture/structure)
        if (server.id === 'mcp__tractatus-thinking__tractatus_thinking') {
            return {
                success: true,
                server: server.id,
                circle: server.circle,
                timestamp: new Date().toISOString(),
                analysis: {
                    structure: this.analyzeArchitecture(params.operation || params.tool),
                    dependencies: this.identifyDependencies(params),
                    implications: this.evaluateImplications(params)
                },
                recommendations: [
                    `Understand the WHAT before implementing the HOW`,
                    `Identify all components and their relationships`,
                    `Consider architectural impact of the operation`,
                    `Ensure consistency with existing patterns`,
                    `Plan for future extensibility`
                ]
            };
        }
        
        // Debug Thinking for Debug circle (error investigation)
        if (server.id === 'mcp__debug-thinking__debug_thinking') {
            return {
                success: true,
                server: server.id,
                circle: server.circle,
                timestamp: new Date().toISOString(),
                debug: {
                    potentialIssues: this.identifyPotentialIssues(params.tool || params.operation),
                    hypotheses: this.generateHypotheses(params),
                    investigationPlan: this.createInvestigationPlan(params)
                },
                recommendations: [
                    `Create a problem node for tracking investigation`,
                    `Formulate testable hypotheses about the root cause`,
                    `Systematically eliminate possibilities`,
                    `Document findings and solutions`,
                    `Add to knowledge base for future reference`
                ]
            };
        }
        
        // Default response
        return {
            success: true,
            server: server.id,
            circle: server.circle,
            timestamp: new Date().toISOString(),
            recommendations: [
                `Consider the impact of ${params.operation || params.tool} on the system`,
                `Check for edge cases and error handling`,
                `Ensure proper resource management`
            ]
        };
    }

    /**
     * Generate sequential steps for Method circle operations
     */
    generateSequentialSteps(toolName) {
        const steps = {
            'start_process': [
                'Validate command arguments',
                'Check environment requirements',
                'Start process with proper configuration',
                'Monitor process execution',
                'Handle completion/cleanup'
            ],
            'execute': [
                'Parse command arguments',
                'Prepare execution context',
                'Execute command with timeout',
                'Collect and parse output',
                'Return results or error'
            ],
            'interact_with_process': [
                'Check if process is ready for input',
                'Send command/interaction',
                'Wait for response',
                'Parse response data',
                'Continue or terminate interaction'
            ]
        };
        
        return steps[toolName] || [
            'Prepare operation',
            'Execute main logic',
            'Handle results',
            'Cleanup resources',
            'Return status'
        ];
    }

    /**
     * Analyze architecture for Model circle operations
     */
    analyzeArchitecture(operation) {
        return {
            components: {
                core: {
                    name: `${operation} Core Logic`,
                    purpose: 'Main execution logic',
                    dependencies: ['configuration', 'error handling']
                },
                config: {
                    name: 'Configuration Manager',
                    purpose: 'Handle operation parameters',
                    dependencies: []
                },
                errors: {
                    name: 'Error Handling',
                    purpose: 'Manage exceptions and recovery',
                    dependencies: ['logging']
                }
            },
            patterns: {
                isolation: 'Operation should be isolated from other processes',
                idempotency: 'Consider making operation idempotent where possible',
                atomicity: 'Ensure operation completes fully or not at all'
            }
        };
    }

    /**
     * Identify dependencies for Tractatus analysis
     */
    identifyDependencies(params) {
        return {
            direct: ['file system access', 'process management'],
            indirect: ['configuration state', 'network connectivity'],
            external: ['system resources', 'user permissions']
        };
    }

    /**
     * Evaluate implications of operation
     */
    evaluateImplications(params) {
        return {
            performance: 'May impact system performance during execution',
            reliability: 'Failure could affect dependent operations',
            security: 'Ensure proper access controls are enforced',
            maintainability: 'Code should be clear and testable'
        };
    }

    /**
     * Identify potential issues for Debug circle
     */
    identifyPotentialIssues(toolName) {
        const issues = {
            'start_process': [
                'Command not found or executable',
                'Permission denied',
                'Resource exhaustion',
                'Deadlock conditions',
                'Invalid arguments'
            ],
            'execute': [
                'Command syntax errors',
                'Missing environment variables',
                'Timeout exceeded',
                'Unexpected output format',
                'Partial execution'
            ],
            'query': [
                'Invalid query syntax',
                'Connection timeout',
                'Memory limits exceeded',
                'Circular dependencies',
                'Permission denied'
            ]
        };
        
        return issues[toolName] || [
            'General execution errors',
            'Resource constraints',
            'Unexpected input',
            'Configuration issues',
            'External dependencies'
        ];
    }

    /**
     * Generate hypotheses for debugging
     */
    generateHypotheses(params) {
        return [
            'Tool configuration is incorrect',
            'Input arguments are malformed',
            'Resource limits are being exceeded',
            'External dependencies are unavailable',
            'Concurrency issues are present'
        ];
    }

    /**
     * Create investigation plan for debugging
     */
    createInvestigationPlan(params) {
        return {
            steps: [
                'Reproduce the issue in isolation',
                'Check tool configuration and parameters',
                'Verify resource availability',
                'Examine logs and error messages',
                'Test with minimal inputs'
            ],
            tools: [
                'Test with simplified arguments',
                'Check system resource usage',
                'Verify environment setup',
                'Review recent changes'
            ]
        };
    }

    /**
     * Enable/disable thinking hook
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Export for use as a module
module.exports = ThinkingTrigger;

// CLI usage
if (require.main === module) {
    const hook = new ThinkingTrigger();
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    
    if (args.includes('--check')) {
        // Check if hook is configured
        console.log('Thinking hook status:', hook.enabled ? 'ENABLED' : 'DISABLED');
        console.log('Available thinking servers:', Object.keys(hook.thinkingServers));
    } else if (args.includes('--disable')) {
        hook.setEnabled(false);
        console.log('Thinking hook disabled');
    } else if (args.includes('--enable')) {
        hook.setEnabled(true);
        console.log('Thinking hook enabled');
    } else {
        console.log('Usage: node thinking-trigger.js [--check|--enable|--disable]');
    }
}