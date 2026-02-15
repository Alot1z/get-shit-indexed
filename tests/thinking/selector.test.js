/**
 * Thinking Mode Selector Tests
 * 
 * Tests for mode selection logic, server mapping, and prompt generation.
 */

const selector = require('../../lib/thinking');

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Run a test
 * @param {string} name - Test name
 * @param {Function} testFn - Test function
 */
function test(name, testFn) {
  try {
    testFn();
    testResults.passed++;
    testResults.tests.push({ name, status: 'PASS' });
    console.log(`✓ ${name}`);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAIL', error: error.message });
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
  }
}

/**
 * Assert condition is true
 * @param {boolean} condition - Condition to check
 * @param {string} message - Assertion message
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * Assert equality
 * @param {*} actual - Actual value
 * @param {*} expected - Expected value
 * @param {string} message - Assertion message
 */
function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

/**
 * Assert object has property
 * @param {object} obj - Object to check
 * @param {string} prop - Property name
 * @param {string} message - Assertion message
 */
function assertHasProperty(obj, prop, message) {
  if (!obj.hasOwnProperty(prop)) {
    throw new Error(message || `Expected object to have property '${prop}'`);
  }
}

console.log('Running Thinking Mode Selector Tests...\n');

// ============================================================================
// Test Category 1: Tool Type → Server Mapping
// ============================================================================

test('FILE_OPS tools map to Sequential server', () => {
  const mode = selector.selectThinkingMode('read_file', { fileSize: 5000 });
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.server, 'sequential', 'Server should be sequential');
  assertEquals(mode.category, 'FILE_OPS', 'Category should be FILE_OPS');
});

test('PROCESS_OPS tools map to Sequential server', () => {
  const mode = selector.selectThinkingMode('start_process', {});
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.server, 'sequential', 'Server should be sequential');
  assertEquals(mode.category, 'PROCESS_OPS', 'Category should be PROCESS_OPS');
});

test('CODE_OPS tools map to Tractatus server', () => {
  const mode = selector.selectThinkingMode('search_code_advanced', {});
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.server, 'tractatus', 'Server should be tractatus');
  assertEquals(mode.category, 'CODE_OPS', 'Category should be CODE_OPS');
});

test('GRAPH_OPS tools map to Tractatus server', () => {
  const mode = selector.selectThinkingMode('execute_cypher_query', {});
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.server, 'tractatus', 'Server should be tractatus');
  assertEquals(mode.category, 'GRAPH_OPS', 'Category should be GRAPH_OPS');
});

test('DEBUG_OPS tools map to Debug server', () => {
  const mode = selector.selectThinkingMode('debug_thinking', {});
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.server, 'debug', 'Server should be debug');
  assertEquals(mode.category, 'DEBUG_OPS', 'Category should be DEBUG_OPS');
});

test('COMPLEX_OPS tools map to Combined mode', () => {
  const mode = selector.selectThinkingMode('build_deep_index', {});
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.serverType, 'combined', 'Server type should be combined');
  assertEquals(mode.category, 'COMPLEX_OPS', 'Category should be COMPLEX_OPS');
});

// ============================================================================
// Test Category 2: Context Factors
// ============================================================================

test('Small file → lightweight mode', () => {
  const mode = selector.selectThinkingMode('read_file', { fileSize: 5000 });
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.variation, 'lightweight', 'Variation should be lightweight');
  assert(mode.timeout <= 5000, 'Timeout should be <= 5000ms');
});

test('Large file → comprehensive mode', () => {
  const mode = selector.selectThinkingMode('read_file', { fileSize: 2000000 });
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.variation, 'comprehensive', 'Variation should be comprehensive');
  assert(mode.timeout > 5000, 'Timeout should be > 5000ms');
});

test('Single operation → lightweight mode', () => {
  const mode = selector.selectThinkingMode('read_file', { operationCount: 1 });
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.variation, 'lightweight', 'Variation should be lightweight');
});

test('Batch operations → comprehensive mode', () => {
  const mode = selector.selectThinkingMode('read_multiple_files', { operationCount: 15 });
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.variation, 'comprehensive', 'Variation should be comprehensive');
});

test('Error state → comprehensive debug mode', () => {
  const mode = selector.selectThinkingMode('debug_thinking', { isError: true });
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.variation, 'comprehensive', 'Variation should be comprehensive');
  assert(mode.thoughtDepth >= 10, 'Thought depth should be >= 10');
});

test('Manual complexity hint: low → lightweight', () => {
  const mode = selector.selectThinkingMode('read_file', { complexity: 'low' });
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.variation, 'lightweight', 'Variation should be lightweight');
});

test('Manual complexity hint: high → comprehensive', () => {
  const mode = selector.selectThinkingMode('read_file', { complexity: 'high' });
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.variation, 'comprehensive', 'Variation should be comprehensive');
});

// ============================================================================
// Test Category 3: Complex Operations
// ============================================================================

test('Complex operations use combined thinking', () => {
  const mode = selector.selectThinkingMode('build_deep_index', {});
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.serverType, 'combined', 'Server type should be combined');
  assertHasProperty(mode, 'mcpTool', 'Should have mcpTool property');
});

test('Complex ops have longer timeouts', () => {
  const fileMode = selector.selectThinkingMode('read_file', { fileSize: 10000 });
  const complexMode = selector.selectThinkingMode('build_deep_index', {});
  assert(complexMode.timeout > fileMode.timeout, 'Complex timeout > file timeout');
});

// ============================================================================
// Test Category 4: Configuration Overrides
// ============================================================================

test('Force mode override works', () => {
  selector.configure({ forceMode: 'comprehensive' });
  const mode = selector.selectThinkingMode('read_file', { fileSize: 1000 });
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.variation, 'comprehensive', 'Variation should be comprehensive');
  selector.resetConfiguration();
});

test('Force server override works', () => {
  selector.configure({ forceServer: 'debug' });
  const mode = selector.selectThinkingMode('read_file', {});
  assert(mode.enabled, 'Mode should be enabled');
  assertEquals(mode.server, 'debug', 'Server should be debug');
  selector.resetConfiguration();
});

test('Disable thinking works', () => {
  selector.configure({ disableThinking: true });
  const mode = selector.selectThinkingMode('read_file', {});
  assert(!mode.enabled, 'Mode should be disabled');
  selector.resetConfiguration();
});

test('Timeout multiplier works', () => {
  selector.configure({ timeoutMultiplier: 2.0 });
  const mode1 = selector.selectThinkingMode('read_file', { fileSize: 10000 });
  selector.resetConfiguration();
  const mode2 = selector.selectThinkingMode('read_file', { fileSize: 10000 });
  assert(mode1.timeout === mode2.timeout * 2, 'Timeout should be doubled');
});

// ============================================================================
// Test Category 5: Caching
// ============================================================================

test('Cache works for repeated operations', () => {
  selector.clearCache();
  selector.resetMetrics();
  
  const mode1 = selector.selectThinkingMode('read_file', { fileSize: 10000 });
  const metrics1 = selector.getMetrics();
  
  const mode2 = selector.selectThinkingMode('read_file', { fileSize: 10000 });
  const metrics2 = selector.getMetrics();
  
  assert(metrics2.hits > metrics1.hits, 'Second call should be a cache hit');
});

test('Cache clear works', () => {
  selector.selectThinkingMode('read_file', { fileSize: 10000 });
  selector.clearCache();
  const metrics = selector.getMetrics();
  assertEquals(metrics.cacheSize, 0, 'Cache should be empty after clear');
});

// ============================================================================
// Test Category 6: Prompt Generation
// ============================================================================

test('Prompt generated for file operations', () => {
  const mode = selector.selectThinkingMode('read_file', { 
    fileSize: 10000,
    operation: 'read'
  });
  assert(mode.enabled, 'Mode should be enabled');
  assertHasProperty(mode, 'prompt', 'Should have prompt property');
  assert(mode.prompt.length > 0, 'Prompt should not be empty');
  assert(mode.prompt.includes('read'), 'Prompt should mention read operation');
});

test('Prompt generated for code operations', () => {
  const mode = selector.selectThinkingMode('search_code_advanced', { 
    pattern: 'function foo'
  });
  assert(mode.enabled, 'Mode should be enabled');
  assertHasProperty(mode, 'prompt', 'Should have prompt property');
  assert(mode.prompt.length > 0, 'Prompt should not be empty');
  assert(mode.prompt.includes('code'), 'Prompt should mention code');
});

test('Prompt generated for error states', () => {
  const mode = selector.selectThinkingMode('debug_thinking', { 
    isError: true,
    errorMessage: 'Test error'
  });
  assert(mode.enabled, 'Mode should be enabled');
  assertHasProperty(mode, 'prompt', 'Should have prompt property');
  assert(mode.prompt.length > 0, 'Prompt should not be empty');
  assert(mode.prompt.includes('error'), 'Prompt should mention error');
});

// ============================================================================
// Print Summary
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

if (testResults.failed > 0) {
  console.log('\nFailed Tests:');
  testResults.tests
    .filter(t => t.status === 'FAIL')
    .forEach(t => {
      console.log(`  - ${t.name}: ${t.error}`);
    });
}

console.log('\nTest Results:');
testResults.tests.forEach(t => {
  console.log(`  [${t.status}] ${t.name}`);
});

module.exports = { testResults };
