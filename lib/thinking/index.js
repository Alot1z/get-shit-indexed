/**
 * Thinking Mode Selection System
 * 
 * Unified API for thinking mode selection, server mapping, and prompt generation.
 * Integrates with Sequential, Tractatus, and Debug thinking servers.
 * 
 * @example
 * // Select thinking mode for a tool
 * const selector = require('./lib/thinking');
 * const mode = selector.selectThinkingMode('read_file', { fileSize: 10000 });
 * if (mode.enabled) {
 *   console.log(`Using ${mode.server} server`);
 *   console.log(`Timeout: ${mode.timeout}ms`);
 *   console.log(`Prompt:\n${mode.prompt}`);
 * }
 * 
 * @example
 * // Configure mode selector
 * selector.configure({ forceMode: 'comprehensive' });
 * 
 * @example
 * // Get metrics
 * const metrics = selector.getMetrics();
 * console.log(`Cache hit rate: ${(metrics.hitRate * 100).toFixed(1)}%`);
 */

module.exports = require('./selector');
