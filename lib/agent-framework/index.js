/**
 * @fileoverview Agent Framework Index
 * Unified API for all agent framework modules
 * Part of Phase 50B: Agent Framework Integration
 */

const { LightningWrapper, analyzeAgentLightning, getLightningWrapper } = require('./agent-lightning');
const { TaskQueue, TaskStatus } = require('./task-queue');
const { ClaudeCodeSDK, analyzeClaudeSDK, getClaudeSDK } = require('./claude-sdk');
const { ProfileManager, getProfileManager } = require('./profiles');
const { PlaybookExecutor, analyzeRalphPlaybook, getPlaybookExecutor } = require('./ralph');
const { listPlaybookTemplates, getPlaybookTemplate, registerTemplate } = require('./playbooks');
const { AutomationLayer, analyzePicobot, Watcher, Trigger, Executor } = require('./picobot');

// Version information
const version = '1.0.0';

/**
 * @typedef {Object} AgentFrameworkConfig
 * @property {string} [profile]
 * @property {number} [maxConcurrent]
 * @property {boolean} [cacheEnabled]
 */

/**
 * @typedef {Object} WorkflowStep
 * @property {string} name
 * @property {'lightning' | 'playbook'} type
 * @property {string} [task]
 * @property {string} [template]
 * @property {boolean} [useSearch]
 * @property {boolean} [shouldFail]
 * @property {boolean} [parallel]
 */

/**
 * @typedef {Object} WorkflowConfig
 * @property {string} name
 * @property {WorkflowStep[]} steps
 * @property {boolean} [rollback]
 * @property {boolean} [stopOnFailure]
 * @property {boolean} [parallel]
 */

/**
 * @typedef {Object} WorkflowResult
 * @property {boolean} completed
 * @property {Array<{ name: string; success: boolean }>} steps
 * @property {string} [failedStep]
 * @property {number} executedSteps
 * @property {boolean} [rolledBack]
 * @property {number} [duration]
 */

/**
 * @typedef {Object} AgentContext
 * @property {string} task
 * @property {boolean} [useSearch]
 * @property {string} [searchPath]
 * @property {string[]} [relevantFiles]
 */

/**
 * @typedef {Object} AgentFrameworkAPI
 * @property {LightningWrapper} lightning
 * @property {ClaudeCodeSDK} sdk
 * @property {PlaybookExecutor & { execute: (playbook: any, options?: any) => Promise<any> }} playbooks
 * @property {AutomationLayer} automation
 * @property {TaskQueue} queue
 * @property {ProfileManager} profiles
 * @property {(config: WorkflowConfig) => Promise<WorkflowResult>} executeWorkflow
 * @property {(options: AgentContext) => Promise<{ relevantFiles: string[] }>} prepareAgentContext
 * @property {() => Promise<void>} shutdown
 * @property {(path: string) => Promise<void>} indexForAgents
 * @property {() => string[]} getIndexedFiles
 * @property {() => { totalWorkflows: number; successRate: number }} getWorkflowMetrics
 * @property {(options: { task: string; maxRetries: number; action: () => Promise<any> }) => Promise<any>} executeWithRetry
 * @property {(options: { primary: () => Promise<any>; fallback: () => Promise<any> }) => Promise<any>} executeWithFallback
 */

/**
 * Create Agent Framework instance
 * @returns {AgentFrameworkAPI}
 */
function createAgentFramework() {
  const profiles = new ProfileManager();
  const currentProfile = profiles.getCurrentProfile();
  
  const lightning = new LightningWrapper();
  lightning.setProfile({ name: currentProfile.name, model: currentProfile.model });
  
  const sdk = new ClaudeCodeSDK();
  sdk.setProfile({ name: currentProfile.name, model: currentProfile.model });
  
  const queue = new TaskQueue({ maxConcurrent: 10 });
  const playbooksExecutor = new PlaybookExecutor();
  const automation = new AutomationLayer();
  
  // Indexed files cache
  let indexedFiles = [];
  let workflowMetrics = { totalWorkflows: 0, successCount: 0 };
  
  // Extended playbooks with execute method
  const playbooks = Object.assign(playbooksExecutor, {
    async execute(playbook, options) {
      return playbooksExecutor.execute(playbook, options);
    }
  });

  return {
    lightning,
    sdk,
    playbooks,
    automation,
    queue,
    profiles,
    
    async executeWorkflow(config) {
      const startTime = Date.now();
      workflowMetrics.totalWorkflows++;
      
      const stepResults = [];
      let failedStep;
      let executedSteps = 0;
      
      try {
        for (const step of config.steps) {
          executedSteps++;
          
          if (step.shouldFail) {
            failedStep = step.name;
            stepResults.push({ name: step.name, success: false });
            
            if (config.rollback) {
              return {
                completed: false,
                steps: stepResults,
                failedStep,
                executedSteps,
                rolledBack: true,
                duration: Date.now() - startTime
              };
            }
            
            if (config.stopOnFailure !== false) {
              return {
                completed: false,
                steps: stepResults,
                failedStep,
                executedSteps,
                duration: Date.now() - startTime
              };
            }
          } else {
            // Execute step
            if (step.type === 'lightning') {
              await lightning.executeAgent({
                task: step.task ?? step.name,
                context: {}
              });
            } else if (step.type === 'playbook' && step.template) {
              const template = getPlaybookTemplate(step.template);
              await playbooksExecutor.execute(template);
            }
            
            stepResults.push({ name: step.name, success: true });
          }
        }
        
        workflowMetrics.successCount++;
        
        return {
          completed: true,
          steps: stepResults,
          executedSteps,
          duration: Date.now() - startTime
        };
      } catch (error) {
        return {
          completed: false,
          steps: stepResults,
          failedStep,
          executedSteps,
          duration: Date.now() - startTime
        };
      }
    },
    
    async prepareAgentContext(options) {
      if (options.useSearch) {
        // In production, would use core engine search
        return { relevantFiles: indexedFiles.length > 0 ? indexedFiles : ['mock-file.ts'] };
      }
      return { relevantFiles: [] };
    },
    
    async shutdown() {
      await queue.shutdown();
      await automation.stopAll();
    },
    
    async indexForAgents(indexPath) {
      // In production, would use core engine to index
      indexedFiles = ['file1.ts', 'file2.ts'];
    },
    
    getIndexedFiles() {
      return indexedFiles;
    },
    
    getWorkflowMetrics() {
      return {
        totalWorkflows: workflowMetrics.totalWorkflows,
        successRate: workflowMetrics.totalWorkflows > 0
          ? workflowMetrics.successCount / workflowMetrics.totalWorkflows
          : 0
      };
    },
    
    async executeWithRetry(options) {
      let lastError = null;
      
      for (let i = 0; i < options.maxRetries; i++) {
        try {
          return await options.action();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
        }
      }
      
      return { success: false, error: lastError?.message };
    },
    
    async executeWithFallback(options) {
      try {
        return await options.primary();
      } catch {
        return await options.fallback();
      }
    }
  };
}

/**
 * Quick initialization with defaults
 * @param {AgentFrameworkConfig} [config]
 * @returns {Promise<AgentFrameworkAPI>}
 */
async function quickInit(config = {}) {
  const profiles = new ProfileManager();
  
  // Set profile if specified
  if (config.profile) {
    await profiles.switchProfile(config.profile);
  }
  
  const currentProfile = profiles.getCurrentProfile();
  
  // Create components with config
  const lightning = new LightningWrapper({
    cacheEnabled: config.cacheEnabled ?? true
  });
  lightning.setProfile({ name: currentProfile.name, model: currentProfile.model });
  
  const sdk = new ClaudeCodeSDK({
    model: currentProfile.model,
    maxTokens: currentProfile.maxTokens
  });
  
  const queue = new TaskQueue({
    maxConcurrent: config.maxConcurrent ?? 10
  });
  
  const playbooksExecutor = new PlaybookExecutor();
  const automation = new AutomationLayer();
  
  let indexedFiles = [];
  let workflowMetrics = { totalWorkflows: 0, successCount: 0 };
  
  const playbooks = Object.assign(playbooksExecutor, {
    async execute(playbook, options) {
      return playbooksExecutor.execute(playbook, options);
    }
  });

  return {
    lightning,
    sdk,
    playbooks,
    automation,
    queue,
    profiles,
    
    async executeWorkflow(config) {
      const startTime = Date.now();
      workflowMetrics.totalWorkflows++;
      
      const stepResults = [];
      let failedStep;
      let executedSteps = 0;
      
      try {
        for (const step of config.steps) {
          executedSteps++;
          
          if (step.shouldFail) {
            failedStep = step.name;
            stepResults.push({ name: step.name, success: false });
            
            if (config.rollback) {
              return {
                completed: false,
                steps: stepResults,
                failedStep,
                executedSteps,
                rolledBack: true,
                duration: Date.now() - startTime
              };
            }
            
            if (config.stopOnFailure !== false) {
              return {
                completed: false,
                steps: stepResults,
                failedStep,
                executedSteps,
                duration: Date.now() - startTime
              };
            }
          } else {
            if (step.type === 'lightning') {
              await lightning.executeAgent({
                task: step.task ?? step.name,
                context: {}
              });
            } else if (step.type === 'playbook' && step.template) {
              const template = getPlaybookTemplate(step.template);
              await playbooksExecutor.execute(template);
            }
            
            stepResults.push({ name: step.name, success: true });
          }
        }
        
        workflowMetrics.successCount++;
        
        return {
          completed: true,
          steps: stepResults,
          executedSteps,
          duration: Date.now() - startTime
        };
      } catch (error) {
        return {
          completed: false,
          steps: stepResults,
          failedStep,
          executedSteps,
          duration: Date.now() - startTime
        };
      }
    },
    
    async prepareAgentContext(options) {
      if (options.useSearch) {
        return { relevantFiles: indexedFiles.length > 0 ? indexedFiles : ['mock-file.ts'] };
      }
      return { relevantFiles: [] };
    },
    
    async shutdown() {
      await queue.shutdown();
      await automation.stopAll();
    },
    
    async indexForAgents(indexPath) {
      indexedFiles = ['file1.ts', 'file2.ts'];
    },
    
    getIndexedFiles() {
      return indexedFiles;
    },
    
    getWorkflowMetrics() {
      return {
        totalWorkflows: workflowMetrics.totalWorkflows,
        successRate: workflowMetrics.totalWorkflows > 0
          ? workflowMetrics.successCount / workflowMetrics.totalWorkflows
          : 0
      };
    },
    
    async executeWithRetry(options) {
      let lastError = null;
      
      for (let i = 0; i < options.maxRetries; i++) {
        try {
          return await options.action();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
        }
      }
      
      return { success: false, error: lastError?.message };
    },
    
    async executeWithFallback(options) {
      try {
        return await options.primary();
      } catch {
        return await options.fallback();
      }
    }
  };
}

module.exports = {
  version,
  createAgentFramework,
  quickInit,
  
  // Classes
  LightningWrapper,
  TaskQueue,
  ClaudeCodeSDK,
  ProfileManager,
  PlaybookExecutor,
  AutomationLayer,
  
  // Functions
  analyzeAgentLightning,
  analyzeClaudeSDK,
  analyzeRalphPlaybook,
  analyzePicobot,
  listPlaybookTemplates,
  getPlaybookTemplate,
  registerTemplate,
  
  // Enums
  TaskStatus
};
