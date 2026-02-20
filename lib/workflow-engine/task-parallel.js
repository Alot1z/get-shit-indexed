/**
 * @fileoverview Task Parallelization Utilities
 * Part of Phase 50D: Workflow Engine Integration
 * 
 * Provides advanced parallel execution with:
 * - Concurrency control
 * - Dynamic batching
 * - Progress tracking
 * - Error aggregation
 * 
 * @module workflow-engine/task-parallel
 * @version 1.0.0
 */

/**
 * @typedef {Object} ParallelOptions
 * @property {number} maxConcurrency - Maximum concurrent tasks
 * @property {boolean} failFast - Stop on first error
 * @property {function} onProgress - Progress callback
 * @property {number} batchDelay - Delay between batches in ms
 */

/**
 * @typedef {Object} ParallelResult
 * @property {boolean} success - Whether all succeeded
 * @property {object[]} results - Task results
 * @property {object[]} errors - Errors encountered
 * @property {number} completed - Number completed
 * @property {number} failed - Number failed
 * @property {number} duration - Total duration in ms
 */

/**
 * Execute tasks in parallel with concurrency control
 * @param {function[]} tasks - Task functions to execute
 * @param {ParallelOptions} options - Execution options
 * @returns {Promise<ParallelResult>}
 */
async function parallel(tasks, options = {}) {
  const {
    maxConcurrency = 10,
    failFast = false,
    onProgress,
    batchDelay = 0
  } = options;

  const startTime = Date.now();
  const results = [];
  const errors = [];
  let completed = 0;
  let failed = 0;

  // Create task wrappers with tracking
  const wrappedTasks = tasks.map((task, index) => ({
    index,
    task,
    status: 'pending'
  }));

  // Process in batches with concurrency limit
  const executing = new Set();
  let taskIndex = 0;

  while (taskIndex < wrappedTasks.length || executing.size > 0) {
    // Fill up to maxConcurrency
    while (executing.size < maxConcurrency && taskIndex < wrappedTasks.length) {
      const taskWrapper = wrappedTasks[taskIndex];
      taskWrapper.status = 'running';

      const promise = (async () => {
        try {
          const result = await taskWrapper.task();
          taskWrapper.status = 'completed';
          taskWrapper.result = result;
          results.push({ index: taskWrapper.index, success: true, result });
          completed++;

          if (onProgress) {
            onProgress({ completed, failed, total: tasks.length });
          }

          return result;
        } catch (error) {
          taskWrapper.status = 'failed';
          taskWrapper.error = error;
          errors.push({ index: taskWrapper.index, error });
          failed++;

          if (onProgress) {
            onProgress({ completed, failed, total: tasks.length });
          }

          if (failFast) {
            throw error;
          }

          return null;
        }
      })();

      executing.add(promise);
      promise.finally(() => executing.delete(promise));
      taskIndex++;

      // Add delay between batch starts
      if (batchDelay > 0 && executing.size === maxConcurrency) {
        await new Promise(r => setTimeout(r, batchDelay));
      }
    }

    // Wait for at least one to complete
    if (executing.size > 0) {
      await Promise.race(executing);
    }
  }

  return {
    success: errors.length === 0,
    results,
    errors,
    completed,
    failed,
    duration: Date.now() - startTime
  };
}

/**
 * Execute tasks in batches
 * @param {function[]} tasks - Task functions
 * @param {number} batchSize - Tasks per batch
 * @param {object} options - Options
 * @returns {Promise<ParallelResult>}
 */
async function batchExecute(tasks, batchSize = 5, options = {}) {
  const {
    batchDelay = 100,
    onBatchComplete
  } = options;

  const startTime = Date.now();
  const allResults = [];
  const allErrors = [];
  let totalCompleted = 0;
  let totalFailed = 0;

  // Split into batches
  const batches = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    batches.push(tasks.slice(i, i + batchSize));
  }

  // Process each batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchResults = await Promise.allSettled(
      batch.map(task => task())
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      if (result.status === 'fulfilled') {
        allResults.push({ success: true, result: result.value });
        totalCompleted++;
      } else {
        allErrors.push({ error: result.reason });
        totalFailed++;
      }
    }

    if (onBatchComplete) {
      onBatchComplete({
        batchIndex: i,
        totalBatches: batches.length,
        completed: totalCompleted,
        failed: totalFailed
      });
    }

    // Delay between batches
    if (batchDelay > 0 && i < batches.length - 1) {
      await new Promise(r => setTimeout(r, batchDelay));
    }
  }

  return {
    success: allErrors.length === 0,
    results: allResults,
    errors: allErrors,
    completed: totalCompleted,
    failed: totalFailed,
    duration: Date.now() - startTime
  };
}

/**
 * Map function over items in parallel
 * @param {Array} items - Items to map
 * @param {function} mapper - Map function (async)
 * @param {ParallelOptions} options - Options
 * @returns {Promise<Array>}
 */
async function parallelMap(items, mapper, options = {}) {
  const { maxConcurrency = 10 } = options;
  const results = new Array(items.length);
  const executing = new Set();
  let index = 0;

  const processNext = async () => {
    while (index < items.length) {
      const currentIndex = index++;
      const promise = mapper(items[currentIndex], currentIndex)
        .then(result => {
          results[currentIndex] = result;
        });

      executing.add(promise);
      promise.finally(() => executing.delete(promise));

      if (executing.size >= maxConcurrency) {
        await Promise.race(executing);
      }
    }
  };

  await Promise.all([processNext(), ...executing]);
  return results;
}

/**
 * Filter items in parallel
 * @param {Array} items - Items to filter
 * @param {function} predicate - Filter predicate (async)
 * @param {ParallelOptions} options - Options
 * @returns {Promise<Array>}
 */
async function parallelFilter(items, predicate, options = {}) {
  const { maxConcurrency = 10 } = options;
  const results = [];
  const executing = new Set();
  let index = 0;

  const processNext = async () => {
    while (index < items.length) {
      const currentIndex = index++;
      const promise = predicate(items[currentIndex], currentIndex)
        .then(passes => {
          if (passes) {
            results.push(items[currentIndex]);
          }
        });

      executing.add(promise);
      promise.finally(() => executing.delete(promise));

      if (executing.size >= maxConcurrency) {
        await Promise.race(executing);
      }
    }
  };

  await Promise.all([processNext(), ...executing]);
  return results;
}

/**
 * Execute with race - first to complete wins
 * @param {function[]} tasks - Task functions
 * @param {object} options - Options
 * @returns {Promise<*>}
 */
async function raceExecute(tasks, options = {}) {
  const { timeout = 30000 } = options;

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Race timeout after ${timeout}ms`));
    }, timeout);

    Promise.all(
      tasks.map(task => 
        task().then(result => {
          clearTimeout(timer);
          resolve(result);
        })
      )
    ).catch(error => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

/**
 * Execute with any - first successful wins
 * @param {function[]} tasks - Task functions
 * @param {object} options - Options
 * @returns {Promise<*>}
 */
async function anyExecute(tasks, options = {}) {
  const { timeout = 30000 } = options;
  const errors = [];
  let completed = false;

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (!completed) {
        reject(new Error(`No task completed within ${timeout}ms. Errors: ${errors.length}`));
      }
    }, timeout);

    tasks.forEach((task, index) => {
      task()
        .then(result => {
          if (!completed) {
            completed = true;
            clearTimeout(timer);
            resolve(result);
          }
        })
        .catch(error => {
          errors.push({ index, error });
          if (errors.length === tasks.length && !completed) {
            clearTimeout(timer);
            reject(new Error('All tasks failed'));
          }
        });
    });
  });
}

/**
 * Waterfall execution - pass result to next
 * @param {function[]} tasks - Task functions (receive previous result)
 * @param {*} initialValue - Initial value
 * @returns {Promise<*>}
 */
async function waterfall(tasks, initialValue = undefined) {
  let result = initialValue;

  for (const task of tasks) {
    result = await task(result);
  }

  return result;
}

/**
 * Dynamic parallel execution based on load
 * @param {function[]} tasks - Task functions
 * @param {object} options - Options
 * @returns {Promise<ParallelResult>}
 */
async function dynamicParallel(tasks, options = {}) {
  const {
    minConcurrency = 1,
    maxConcurrency = 20,
    targetLoad = 0.8, // Target CPU/memory load
    adjustInterval = 100
  } = options;

  const startTime = Date.now();
  const results = [];
  const errors = [];
  let completed = 0;
  let failed = 0;
  let currentConcurrency = Math.min(maxConcurrency, Math.ceil(tasks.length / 2));

  const taskQueue = [...tasks];
  const executing = new Set();

  while (taskQueue.length > 0 || executing.size > 0) {
    // Adjust concurrency based on "load"
    const load = executing.size / currentConcurrency;
    if (load > targetLoad && currentConcurrency < maxConcurrency) {
      currentConcurrency = Math.min(maxConcurrency, currentConcurrency + 1);
    } else if (load < targetLoad * 0.5 && currentConcurrency > minConcurrency) {
      currentConcurrency = Math.max(minConcurrency, currentConcurrency - 1);
    }

    // Fill to current concurrency
    while (executing.size < currentConcurrency && taskQueue.length > 0) {
      const task = taskQueue.shift();
      const promise = task()
        .then(result => {
          results.push({ success: true, result });
          completed++;
        })
        .catch(error => {
          errors.push({ error });
          failed++;
        });

      executing.add(promise);
      promise.finally(() => executing.delete(promise));
    }

    // Wait a bit before adjusting
    if (executing.size > 0) {
      await new Promise(r => setTimeout(r, adjustInterval));
    }
  }

  return {
    success: errors.length === 0,
    results,
    errors,
    completed,
    failed,
    duration: Date.now() - startTime,
    finalConcurrency: currentConcurrency
  };
}

module.exports = {
  parallel,
  batchExecute,
  parallelMap,
  parallelFilter,
  raceExecute,
  anyExecute,
  waterfall,
  dynamicParallel
};
