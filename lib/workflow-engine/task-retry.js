/**
 * @fileoverview Task Retry Utilities
 * Part of Phase 50D: Workflow Engine Integration
 * 
 * Provides retry strategies with:
 * - Exponential backoff
 * - Linear backoff
 * - Custom retry conditions
 * - Circuit breaker pattern
 * 
 * @module workflow-engine/task-retry
 * @version 1.0.0
 */

/**
 * @typedef {Object} RetryOptions
 * @property {number} maxRetries - Maximum retry attempts
 * @property {string} backoff - Backoff strategy: 'none', 'linear', 'exponential', 'decorrelated'
 * @property {number} initialDelay - Initial delay in ms
 * @property {number} maxDelay - Maximum delay in ms
 * @property {number} multiplier - Backoff multiplier
 * @property {function} shouldRetry - Function to determine if should retry
 * @property {function} onRetry - Callback before each retry
 */

/**
 * @typedef {Object} RetryResult
 * @property {boolean} success - Whether task succeeded
 * @property {*} output - Task output
 * @property {Error} [error] - Final error if failed
 * @property {number} attempts - Total attempts made
 * @property {number[]} delays - Delays between attempts
 * @property {number} duration - Total duration in ms
 */

/**
 * @typedef {Object} CircuitState
 * @property {string} status - 'closed', 'open', 'half-open'
 * @property {number} failures - Consecutive failures
 * @property {number} successes - Consecutive successes (half-open)
 * @property {number} lastFailure - Timestamp of last failure
 */

/**
 * Execute with retry logic
 * @param {function} task - Task function
 * @param {RetryOptions} options - Retry options
 * @returns {Promise<RetryResult>}
 */
async function retry(task, options = {}) {
  const {
    maxRetries = 3,
    backoff = 'exponential',
    initialDelay = 100,
    maxDelay = 30000,
    multiplier = 2,
    shouldRetry = () => true,
    onRetry = () => {}
  } = options;

  const startTime = Date.now();
  const delays = [];
  let lastError = null;
  let attempts = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    attempts++;

    try {
      // Apply backoff delay for retries
      if (attempt > 0) {
        const delay = calculateDelay(attempt, {
          backoff,
          initialDelay,
          maxDelay,
          multiplier
        });
        delays.push(delay);

        await onRetry(attempt, delay, lastError);
        await sleep(delay);
      }

      const result = await task();
      
      return {
        success: true,
        output: result,
        attempts,
        delays,
        duration: Date.now() - startTime
      };
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (attempt < maxRetries) {
        const should = await shouldRetry(error, attempt);
        if (!should) {
          break;
        }
      }
    }
  }

  return {
    success: false,
    error: lastError,
    attempts,
    delays,
    duration: Date.now() - startTime
  };
}

/**
 * Calculate delay based on backoff strategy
 * @param {number} attempt - Attempt number (1-indexed for retries)
 * @param {object} options - Backoff options
 * @returns {number} Delay in ms
 */
function calculateDelay(attempt, options = {}) {
  const {
    backoff = 'exponential',
    initialDelay = 100,
    maxDelay = 30000,
    multiplier = 2,
    jitter = false
  } = options;

  let delay;

  switch (backoff) {
    case 'none':
      delay = 0;
      break;

    case 'linear':
      delay = initialDelay * attempt;
      break;

    case 'exponential':
      delay = initialDelay * Math.pow(multiplier, attempt - 1);
      break;

    case 'decorrelated':
      // Decorrelated jitter: sleep = min(cap, random_between(base, sleep * 3))
      delay = Math.min(maxDelay, randomBetween(initialDelay, initialDelay * Math.pow(3, attempt - 1)));
      break;

    default:
      delay = initialDelay;
  }

  // Apply jitter to prevent thundering herd
  if (jitter && delay > 0) {
    delay = randomBetween(delay * 0.5, delay * 1.5);
  }

  return Math.min(delay, maxDelay);
}

/**
 * Get random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Sleep for specified duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a retry wrapper for any async function
 * @param {function} fn - Function to wrap
 * @param {RetryOptions} options - Retry options
 * @returns {function}
 */
function withRetry(fn, options = {}) {
  return async (...args) => {
    const result = await retry(() => fn(...args), options);
    if (!result.success) {
      throw result.error;
    }
    return result.output;
  };
}

/**
 * Circuit Breaker implementation
 */
class CircuitBreaker {
  /**
   * Create a circuit breaker
   * @param {object} options - Circuit breaker options
   */
  constructor(options = {}) {
    this.options = {
      failureThreshold: options.failureThreshold || 5,
      successThreshold: options.successThreshold || 3,
      timeout: options.timeout || 60000, // Time before trying half-open
      halfOpenMaxCalls: options.halfOpenMaxCalls || 1,
      ...options
    };

    this.state = {
      status: 'closed',
      failures: 0,
      successes: 0,
      lastFailure: null
    };

    this.stats = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      rejectedCalls: 0,
      stateChanges: 0
    };
  }

  /**
   * Execute a function through the circuit breaker
   * @param {function} fn - Function to execute
   * @returns {Promise<*>}
   */
  async execute(fn) {
    this.stats.totalCalls++;

    // Check if circuit is open
    if (this.state.status === 'open') {
      const timeSinceFailure = Date.now() - this.state.lastFailure;
      
      if (timeSinceFailure >= this.options.timeout) {
        // Transition to half-open
        this.transitionTo('half-open');
      } else {
        // Reject the call
        this.stats.rejectedCalls++;
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handle successful execution
   */
  onSuccess() {
    this.stats.successfulCalls++;
    this.state.failures = 0;

    if (this.state.status === 'half-open') {
      this.state.successes++;
      
      if (this.state.successes >= this.options.successThreshold) {
        this.transitionTo('closed');
      }
    }
  }

  /**
   * Handle failed execution
   */
  onFailure() {
    this.stats.failedCalls++;
    this.state.failures++;
    this.state.successes = 0;
    this.state.lastFailure = Date.now();

    if (this.state.status === 'half-open') {
      // Immediately open on failure in half-open
      this.transitionTo('open');
    } else if (this.state.failures >= this.options.failureThreshold) {
      this.transitionTo('open');
    }
  }

  /**
   * Transition to new state
   * @param {string} newStatus - New status
   */
  transitionTo(newStatus) {
    const oldStatus = this.state.status;
    this.state.status = newStatus;
    this.state.successes = 0;

    if (newStatus === 'closed') {
      this.state.failures = 0;
    }

    if (oldStatus !== newStatus) {
      this.stats.stateChanges++;
    }
  }

  /**
   * Get current state
   * @returns {CircuitState}
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Get statistics
   * @returns {object}
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Reset circuit breaker
   */
  reset() {
    this.state = {
      status: 'closed',
      failures: 0,
      successes: 0,
      lastFailure: null
    };
  }

  /**
   * Force open circuit
   */
  trip() {
    this.transitionTo('open');
    this.state.lastFailure = Date.now();
  }
}

/**
 * Create a circuit breaker wrapped function
 * @param {function} fn - Function to wrap
 * @param {object} options - Circuit breaker options
 * @returns {function}
 */
function withCircuitBreaker(fn, options = {}) {
  const breaker = new CircuitBreaker(options);
  const wrapped = async (...args) => breaker.execute(() => fn(...args));
  wrapped.breaker = breaker;
  return wrapped;
}

/**
 * Combine retry with circuit breaker
 * @param {function} fn - Function to wrap
 * @param {object} retryOptions - Retry options
 * @param {object} breakerOptions - Circuit breaker options
 * @returns {function}
 */
function withRetryAndBreaker(fn, retryOptions = {}, breakerOptions = {}) {
  const withRetryFn = withRetry(fn, retryOptions);
  return withCircuitBreaker(withRetryFn, breakerOptions);
}

/**
 * Retry until condition is met
 * @param {function} condition - Condition function (receives result)
 * @param {function} task - Task function
 * @param {object} options - Options
 * @returns {Promise<RetryResult>}
 */
async function retryUntil(condition, task, options = {}) {
  const {
    maxAttempts = 10,
    delay = 1000,
    backoff = 'none'
  } = options;

  const startTime = Date.now();
  const delays = [];
  let lastError = null;
  let attempts = 0;
  let lastResult = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    attempts++;

    try {
      if (attempt > 0) {
        const waitTime = backoff === 'exponential' 
          ? delay * Math.pow(2, attempt - 1)
          : delay;
        delays.push(waitTime);
        await sleep(waitTime);
      }

      lastResult = await task();
      
      if (await condition(lastResult)) {
        return {
          success: true,
          output: lastResult,
          attempts,
          delays,
          duration: Date.now() - startTime
        };
      }

      lastError = new Error('Condition not met');
    } catch (error) {
      lastError = error;
    }
  }

  return {
    success: false,
    error: lastError,
    output: lastResult,
    attempts,
    delays,
    duration: Date.now() - startTime
  };
}

module.exports = {
  retry,
  calculateDelay,
  withRetry,
  CircuitBreaker,
  withCircuitBreaker,
  withRetryAndBreaker,
  retryUntil,
  sleep
};
