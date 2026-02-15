#!/usr/bin/env node

/**
 * Test script for the PreToolUse thinking hook
 */

const ThinkingTrigger = require('./thinking-trigger');

// Create hook instance
const hook = new ThinkingTrigger();

console.log('🧠 Testing PreToolUse Thinking Hook\n');

// Test 1: Check if hook is enabled
console.log('1. Hook Status:');
console.log(`   Enabled: ${hook.enabled}`);
console.log('');

// Test 2: Check tool mappings
console.log('2. Tool Mappings:');
const toolMappings = hook.config.toolMapping || {};
Object.entries(toolMappings).forEach(([tool, mode]) => {
    console.log(`   ${tool}: ${mode}`);
});
console.log('');

// Test 3: Test trigger conditions
console.log('3. Trigger Condition Tests:');
const testTools = ['start_process', 'write_file', 'query', 'read_multiple_files'];

testTools.forEach(tool => {
    const shouldTrigger = hook.shouldTrigger(tool);
    const complexity = hook.calculateComplexity(tool);
    const server = hook.getThinkingServer(tool);
    
    console.log(`   ${tool}:`);
    console.log(`     Should trigger: ${shouldTrigger}`);
    console.log(`     Complexity: ${complexity}`);
    console.log(`     Thinking server: ${server ? server.circle : 'None'}`);
    console.log(`     Server ID: ${server ? server.id : 'N/A'}`);
    console.log('');
});

// Test 4: Test CLI arguments
console.log('4. CLI Interface:');
if (process.argv.includes('--check')) {
    console.log('   Checking hook status...');
    console.log('   Available servers:', Object.keys(hook.thinkingServers));
    console.log('   Modes:', Object.keys(hook.config.modes || {}));
} else if (process.argv.includes('--enable')) {
    console.log('   Enabling thinking hook...');
    hook.setEnabled(true);
    console.log('   Hook enabled:', hook.enabled);
} else if (process.argv.includes('--disable')) {
    console.log('   Disabling thinking hook...');
    hook.setEnabled(false);
    console.log('   Hook enabled:', hook.enabled);
} else {
    console.log('   Usage:');
    console.log('   node test-thinking-hook.js --check');
    console.log('   node test-thinking-hook.js --enable');
    console.log('   node test-thinking-hook.js --disable');
}

console.log('\n✅ Testing complete!');