/**
 * @fileoverview Task Queue Module
 * Concurrent agent task handling with priority support
 * Part of Phase 50B: Agent Framework Integration
 */

const { EventEmitter } = require('events');

// Task status enum
const TaskStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  RETRYING: 'retrying'
};

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} type
 * @property {Record<string, any>} payload
 * @property {number} [priority]
 * @property {number} [maxRetries]
 * @property {number} [timeout]
 */

/**
 * @typedef {Object} TaskResult
 * @property {string} taskId
 * @property {string} status
 * @property {any} [result]
 * @property {string} [error]
 * @property {number} attempts
 */

/**
 * @typedef {Object} QueueStats
 * @property {number} totalProcessed
 * @property {number} totalExecutions
 * @property {number} successRate
 * @property {number} maxConcurrent
 * @property {number} maxConcurrentObserved
 * @property {number} backpressureEvents
 * @property {number} pending
 * @property {number} running
 */

/**
 * @typedef {Object} QueueConfig
 * @property {number} maxConcurrent
 * @property {boolean} [stopOnFailure]
 * @property {number} [retryDelay]
 */

// Task comparator for priority sorting
const taskComparator = (a, b) => {
  const priorityA = a.priority ?? 0;
  const priorityB = b.priority ?? 0;
  return priorityB - priorityA; // Higher priority first
};

/**
 * TaskQueue - Manages concurrent task execution with priority
 */
class TaskQueue extends EventEmitter {
  /**
   * @param {QueueConfig} config
   */
  constructor(config) {
    super();
    this.config = {
      maxConcurrent: config.maxConcurrent,
      stopOnFailure: config.stopOnFailure ?? false,
      retryDelay: config.retryDelay ?? 100
    };
    /** @type {Task[]} */
    this.pending = [];
    /** @type {Map<string, Task>} */
    this.running = new Map();
    /** @type {Map<string, TaskResult>} */
    this.completed = new Map();
    /** @type {Map<string, number>} */
    this.attempts = new Map();
    /** @type {Array<{ taskId: string; error: string; timestamp: Date }>} */
    this.errors = [];
    this.paused = false;
    this.processing = false;
    /** @type {(task: Task) => Promise<any> | undefined} */
    this.taskHandler = undefined;
    /** @type {string[]} Track priority-based execution order */
    this.executionOrder = [];

    // Stats
    this.stats = {
      totalProcessed: 0,
      successCount: 0,
      maxConcurrentObserved: 0,
      backpressureEvents: 0
    };
  }

  /**
   * Set task handler function
   * @param {(task: Task) => Promise<any>} handler
   */
  setHandler(handler) {
    this.taskHandler = handler;
  }

  /**
   * Enqueue a task for execution
   * @param {Task} task
   * @returns {Promise<string>}
   */
  async enqueue(task) {
    // Add to pending queue
    this.pending.push(task);
    this.pending.sort(taskComparator);
    
    // Initialize attempt counter
    this.attempts.set(task.id, 0);
    
    // Track in execution order by priority
    this.executionOrder.push(task.id);
    // Re-sort execution order by priority (need to look up task priorities)
    this.executionOrder.sort((a, b) => {
      const taskA = this.pending.find(t => t.id === a) || 
                    this.running.get(a) || 
                    (this.completed.has(a) ? { priority: 0 } : null);
      const taskB = this.pending.find(t => t.id === b) || 
                    this.running.get(b) || 
                    (this.completed.has(b) ? { priority: 0 } : null);
      const priorityA = taskA?.priority ?? 0;
      const priorityB = taskB?.priority ?? 0;
      return priorityB - priorityA; // Higher priority first
    });

    // Process queue
    await this.process();

    // Wait for task to complete (with timeout)
    const maxWait = 10000; // 10 seconds max
    const startTime = Date.now();
    while (!this.completed.has(task.id) && Date.now() - startTime < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Return final status
    const result = this.completed.get(task.id);
    return result?.status ?? TaskStatus.PENDING;
  }

  /**
   * Get task status
   * @param {string} taskId
   * @returns {Promise<string>}
   */
  async getStatus(taskId) {
    const result = this.completed.get(taskId);
    if (result) {
      return result.status;
    }
    if (this.running.has(taskId)) {
      return TaskStatus.RUNNING;
    }
    if (this.pending.find(t => t.id === taskId)) {
      return TaskStatus.PENDING;
    }
    return TaskStatus.PENDING;
  }

  /**
   * Get number of attempts for a task
   * @param {string} taskId
   * @returns {number}
   */
  getTaskAttempts(taskId) {
    return this.attempts.get(taskId) ?? 0;
  }

  /**
   * Get execution order (by priority)
   * @returns {string[]}
   */
  getExecutionOrder() {
    // Return the tracked execution order
    return [...this.executionOrder];
  }

  /**
   * Get queue statistics
   * @returns {QueueStats & { totalExecutions: number; successRate: number }}
   */
  getStats() {
    return {
      totalProcessed: this.stats.totalProcessed,
      totalExecutions: this.stats.totalProcessed,
      successRate: this.stats.totalProcessed > 0
        ? this.stats.successCount / this.stats.totalProcessed
        : 0,
      maxConcurrent: this.config.maxConcurrent,
      maxConcurrentObserved: this.stats.maxConcurrentObserved,
      backpressureEvents: this.stats.backpressureEvents,
      pending: this.pending.length,
      running: this.running.size
    };
  }

  /**
   * Get error history
   * @returns {Array<{ taskId: string; error: string; timestamp: Date }>}
   */
  getErrorHistory() {
    return [...this.errors];
  }

  /**
   * Check if queue is paused
   * @returns {boolean}
   */
  isPaused() {
    return this.paused;
  }

  /**
   * Pause queue processing
   * @returns {Promise<void>}
   */
  async pause() {
    this.paused = true;
  }

  /**
   * Resume queue processing
   * @returns {Promise<void>}
   */
  async resume() {
    this.paused = false;
    await this.process();
  }

  /**
   * Clear all pending tasks
   * @returns {Promise<void>}
   */
  async clear() {
    this.pending = [];
  }

  /**
   * Get queue size
   * @returns {number}
   */
  size() {
    return this.pending.length;
  }

  /**
   * Get max concurrent setting
   * @returns {number}
   */
  getMaxConcurrent() {
    return this.config.maxConcurrent;
  }

  /**
   * Shutdown queue
   * @returns {Promise<void>}
   */
  async shutdown() {
    this.paused = true;
    this.pending = [];
    // Wait for running tasks to complete
    while (this.running.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  /**
   * Process pending tasks
   * @returns {Promise<void>}
   */
  async process() {
    if (this.paused || this.processing) {
      return;
    }

    this.processing = true;

    try {
      while (this.pending.length > 0 && this.running.size < this.config.maxConcurrent) {
        // Check for backpressure
        if (this.running.size >= this.config.maxConcurrent) {
          this.stats.backpressureEvents++;
          break;
        }

        const task = this.pending.shift();
        if (!task) break;

        // Track max concurrent
        this.running.set(task.id, task);
        this.stats.maxConcurrentObserved = Math.max(
          this.stats.maxConcurrentObserved,
          this.running.size
        );

        // Execute task asynchronously
        this.executeTask(task).catch(() => {
          // Error handled in executeTask
        });
      }
    } finally {
      this.processing = false;
    }

    // Continue processing if there are more tasks
    if (this.pending.length > 0 && !this.paused) {
      setImmediate(() => this.process());
    }
  }

  /**
   * Execute a single task
   * @param {Task} task
   * @returns {Promise<void>}
   */
  async executeTask(task) {
    const maxAttempts = task.maxRetries ?? 1;
    let attempts = this.attempts.get(task.id) ?? 0;
    let lastError;

    while (attempts < maxAttempts) {
      attempts++;
      this.attempts.set(task.id, attempts);

      try {
        // Execute task
        let result;
        if (this.taskHandler) {
          result = await this.taskHandler(task);
        } else {
          // Default handler - simulate execution
          result = await this.defaultHandler(task);
        }

        // Success
        const taskResult = {
          taskId: task.id,
          status: TaskStatus.COMPLETED,
          result,
          attempts
        };

        this.completed.set(task.id, taskResult);
        this.stats.totalProcessed++;
        this.stats.successCount++;
        this.running.delete(task.id);

        this.emit('taskComplete', taskResult);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        
        if (attempts < maxAttempts) {
          this.emit('taskRetry', { task, attempt: attempts });
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }

    // Task failed after all attempts
    const taskResult = {
      taskId: task.id,
      status: TaskStatus.FAILED,
      error: lastError,
      attempts
    };

    this.completed.set(task.id, taskResult);
    this.stats.totalProcessed++;
    this.running.delete(task.id);

    this.errors.push({
      taskId: task.id,
      error: lastError ?? 'Unknown error',
      timestamp: new Date()
    });

    this.emit('taskFailed', taskResult);
  }

  /**
   * Default task handler
   * @param {Task} task
   * @returns {Promise<any>}
   */
  async defaultHandler(task) {
    // Simulate task execution
    if (task.type === 'fail') {
      throw new Error('Task type is "fail"');
    }
    return { processed: task.id };
  }
}

module.exports = {
  TaskQueue,
  TaskStatus
};
