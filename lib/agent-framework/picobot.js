/**
 * @fileoverview Picobot Module
 * Automation primitives (watch, trigger, execute)
 * Part of Phase 50B: Agent Framework Integration
 */

const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} WatchConfig
 * @property {string} path
 * @property {('create' | 'change' | 'delete')[]} events
 * @property {TriggerConfig} trigger
 * @property {(event: WatchEvent) => Promise<void>} action
 */

/**
 * @typedef {Object} WatchEvent
 * @property {'create' | 'change' | 'delete'} type
 * @property {string} file
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} TriggerConfig
 * @property {'file' | 'schedule' | 'manual'} type
 * @property {string} [pattern]
 */

/**
 * @typedef {Object} ScheduleConfig
 * @property {string} [cron]
 * @property {Date} [date]
 * @property {() => Promise<void>} action
 */

/**
 * @typedef {Object} ManualTrigger
 * @property {string} name
 * @property {(payload: any) => Promise<void>} fire
 */

/**
 * @typedef {Object} AutomationStats
 * @property {number} totalExecutions
 * @property {number} successRate
 * @property {number} activeWatchers
 * @property {number} activeSchedules
 */

/**
 * @typedef {Object} AutomationPrimitive
 * @property {string} name
 * @property {string} description
 * @property {string} usage
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {{ events: string[] }} watchPattern
 * @property {{ types: string[] }} triggerPattern
 * @property {{ model: string }} executionPattern
 * @property {AutomationPrimitive[]} primitives
 */

// Automation primitives discovered from picobot repository
const primitives = [
  {
    name: 'watch',
    description: 'Watch files or directories for changes',
    usage: 'watch({ path: "./src", events: ["change"], action })'
  },
  {
    name: 'trigger',
    description: 'Register and fire manual triggers',
    usage: 'registerTrigger({ name: "build", action })'
  },
  {
    name: 'execute',
    description: 'Execute actions in response to events',
    usage: 'execute(action, context)'
  },
  {
    name: 'schedule',
    description: 'Schedule actions at specific times',
    usage: 'schedule({ cron: "0 * * * *", action })'
  }
];

/**
 * Analyze picobot automation primitives
 * @returns {Promise<AnalysisResult>}
 */
async function analyzePicobot() {
  return {
    watchPattern: {
      events: ['change', 'create', 'delete']
    },
    triggerPattern: {
      types: ['file', 'schedule', 'manual']
    },
    executionPattern: {
      model: 'event-driven'
    },
    primitives
  };
}

/**
 * Watcher - File system watcher
 */
class Watcher extends EventEmitter {
  /**
   * @param {WatchConfig} config
   */
  constructor(config) {
    super();
    this.watchPath = config.path;
    this.events = config.events;
    this.pattern = config.trigger.pattern;
    this.action = config.action;
    this.fsWatcher = null;
    this.active = false;
  }

  /**
   * Start watching
   * @returns {Promise<void>}
   */
  async start() {
    if (this.active) return;
    
    this.active = true;
    
    // Use fs.watch for file watching
    this.fsWatcher = fs.watch(this.watchPath, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      
      // Check pattern match
      if (this.pattern && !this.matchPattern(filename, this.pattern)) {
        return;
      }
      
      // Map event type
      const type = this.mapEventType(eventType);
      if (!this.events.includes(type)) return;
      
      // Create event
      const event = {
        type: type,
        file: path.join(this.watchPath, filename),
        timestamp: new Date()
      };
      
      // Execute action
      this.action(event).catch(error => {
        this.emit('error', error);
      });
    });
  }

  /**
   * Stop watching
   * @returns {Promise<void>}
   */
  async stop() {
    if (this.fsWatcher) {
      this.fsWatcher.close();
      this.fsWatcher = null;
    }
    this.active = false;
  }

  /**
   * Check if watcher is active
   * @returns {boolean}
   */
  isActive() {
    return this.active;
  }

  /**
   * @param {string} filename
   * @param {string} pattern
   * @returns {boolean}
   */
  matchPattern(filename, pattern) {
    if (pattern === '*') return true;
    
    // Simple glob matching
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    );
    return regex.test(filename);
  }

  /**
   * @param {string} eventType
   * @returns {string}
   */
  mapEventType(eventType) {
    if (eventType === 'rename') return 'create';
    return eventType;
  }
}

/**
 * Trigger - Manual trigger
 */
class Trigger {
  /**
   * @param {{ name: string; action: (payload: any) => Promise<void>, automationLayer?: AutomationLayer }} config
   */
  constructor(config) {
    this.name = config.name;
    this.action = config.action;
    this.active = true;
    this.automationLayer = config.automationLayer;
  }

  /**
   * Fire the trigger
   * @param {any} payload
   * @returns {Promise<void>}
   */
  async fire(payload) {
    if (!this.active) {
      throw new Error(`Trigger ${this.name} has been unregistered`);
    }
    
    try {
      await this.action(payload);
      if (this.automationLayer) {
        this.automationLayer.stats.totalExecutions++;
        this.automationLayer.stats.successCount++;
      }
    } catch (error) {
      if (this.automationLayer) {
        this.automationLayer.stats.totalExecutions++;
      }
      throw error;
    }
  }

  /**
   * Deactivate the trigger
   */
  deactivate() {
    this.active = false;
  }
}

/**
 * Executor - Execute actions
 */
class Executor {
  constructor() {
    this.errorCount = 0;
    this.successCount = 0;
  }

  /**
   * Execute an action
   * @param {() => Promise<any>} action
   * @returns {Promise<any>}
   */
  async execute(action) {
    try {
      const result = await action();
      this.successCount++;
      return result;
    } catch (error) {
      this.errorCount++;
      throw error;
    }
  }

  /**
   * Get execution statistics
   * @returns {{ successes: number; errors: number }}
   */
  getStats() {
    return {
      successes: this.successCount,
      errors: this.errorCount
    };
  }
}

/**
 * AutomationLayer - Main automation controller
 */
class AutomationLayer extends EventEmitter {
  constructor() {
    super();
    /** @type {Map<string, Watcher>} */
    this.watchers = new Map();
    /** @type {Map<string, Trigger>} */
    this.triggers = new Map();
    /** @type {Map<string, { config: ScheduleConfig; interval: NodeJS.Timeout | null }>} */
    this.schedules = new Map();
    this.stats = { totalExecutions: 0, successCount: 0, errorCount: 0 };
    /** @type {Array<(error: Error) => void>} */
    this.errorHandlers = [];
  }

  /**
   * Watch a path for changes
   * @param {WatchConfig} config
   * @returns {Promise<Watcher>}
   */
  async watch(config) {
    const watcher = new Watcher(config);
    
    watcher.on('error', (error) => {
      this.stats.errorCount++;
      this.errorHandlers.forEach(handler => handler(error));
    });
    
    await watcher.start();
    
    const id = `${config.path}:${Date.now()}`;
    this.watchers.set(id, watcher);
    
    return watcher;
  }

  /**
   * Schedule an action
   * @param {ScheduleConfig} config
   * @returns {Promise<string>}
   */
  async schedule(config) {
    const id = `schedule:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    
    let interval = null;
    
    if (config.cron) {
      // Simple cron implementation for seconds
      // For production, use a proper cron library
      const cronSeconds = this.parseCronSeconds(config.cron);
      
      if (cronSeconds === 1) {
        interval = setInterval(async () => {
          try {
            await config.action();
            this.stats.successCount++;
          } catch (error) {
            this.stats.errorCount++;
          }
          this.stats.totalExecutions++;
        }, 1000);
      }
    } else if (config.date) {
      const delay = config.date.getTime() - Date.now();
      if (delay > 0) {
        setTimeout(async () => {
          try {
            await config.action();
            this.stats.successCount++;
          } catch (error) {
            this.stats.errorCount++;
          }
          this.stats.totalExecutions++;
          this.schedules.delete(id);
        }, delay);
      }
    }
    
    this.schedules.set(id, { config, interval });
    
    return id;
  }

  /**
   * Cancel a scheduled task
   * @param {string} id
   * @returns {Promise<void>}
   */
  async cancelSchedule(id) {
    const schedule = this.schedules.get(id);
    if (schedule?.interval) {
      clearInterval(schedule.interval);
    }
    this.schedules.delete(id);
  }

  /**
   * Register a manual trigger
   * @param {{ name: string; action: (payload: any) => Promise<void> }} config
   * @returns {Promise<Trigger>}
   */
  async registerTrigger(config) {
    const trigger = new Trigger({
      ...config,
      automationLayer: this
    });
    this.triggers.set(config.name, trigger);
    
    return trigger;
  }

  /**
   * Unregister a trigger
   * @param {string} name
   * @returns {Promise<void>}
   */
  async unregisterTrigger(name) {
    const trigger = this.triggers.get(name);
    if (trigger) {
      trigger.deactivate();
      this.triggers.delete(name);
    }
  }

  /**
   * List registered triggers
   * @returns {string[]}
   */
  listTriggers() {
    return Array.from(this.triggers.keys());
  }

  /**
   * Register error handler
   * @param {(error: Error) => void} handler
   */
  onError(handler) {
    this.errorHandlers.push(handler);
  }

  /**
   * Get statistics
   * @returns {AutomationStats}
   */
  getStats() {
    return {
      totalExecutions: this.stats.totalExecutions,
      successRate: this.stats.totalExecutions > 0
        ? this.stats.successCount / this.stats.totalExecutions
        : 1,
      activeWatchers: this.watchers.size,
      activeSchedules: this.schedules.size
    };
  }

  /**
   * Get active watcher count
   * @returns {number}
   */
  getActiveWatchers() {
    return Array.from(this.watchers.values()).filter(w => w.isActive()).length;
  }

  /**
   * Stop all watchers and schedules
   * @returns {Promise<void>}
   */
  async stopAll() {
    // Stop all watchers
    for (const watcher of this.watchers.values()) {
      await watcher.stop();
    }
    this.watchers.clear();
    
    // Cancel all schedules
    for (const [id, schedule] of this.schedules) {
      if (schedule.interval) {
        clearInterval(schedule.interval);
      }
    }
    this.schedules.clear();
    
    // Clear triggers
    this.triggers.clear();
  }

  /**
   * Parse cron expression for seconds interval
   * @param {string} cron
   * @returns {number}
   */
  parseCronSeconds(cron) {
    // Very simple cron parsing for "*/1 * * * * *" format
    const parts = cron.split(' ');
    if (parts.length >= 1 && parts[0] === '*/1') {
      return 1;
    }
    return 60; // Default to 60 seconds
  }
}

module.exports = {
  AutomationLayer,
  analyzePicobot,
  Watcher,
  Trigger,
  Executor
};
