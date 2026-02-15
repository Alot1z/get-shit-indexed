/**
 * Sequential Thinking Prompt Templates
 * 
 * Templates for sequential thinking server (multi-step problem decomposition).
 * Used for FILE_OPS and PROCESS_OPS categories.
 */

/**
 * File operation prompt template
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function fileOperationPrompt(context = {}) {
  const {
    toolName,
    operation,
    filePath,
    fileSize,
    expectedOutcome
  } = context;
  
  return `
You are about to perform a file operation using the ${toolName} tool.

## Operation Details
- Tool: ${toolName}
- Operation: ${operation || 'read/modify'}
- File: ${filePath || 'not specified'}
- File Size: ${fileSize ? formatFileSize(fileSize) : 'unknown'}

## What to Expect
${getExpectations(operation)}

## Validation Checklist
After the operation, verify:
${getValidationChecklist(operation)}

## Next Steps
Think through this operation step-by-step:
1. What is the exact goal?
2. What are the potential issues?
3. What should the result look like?
4. How will you verify success?

Please proceed with sequential thinking for this file operation.
`.trim();
}

/**
 * Process operation prompt template
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function processOperationPrompt(context = {}) {
  const {
    toolName,
    command,
    processType,
    isInteractive,
    timeout
  } = context;
  
  return `
You are about to perform a process operation using the ${toolName} tool.

## Process Details
- Tool: ${toolName}
- Command: ${command || 'not specified'}
- Type: ${processType || 'standard'}
- Interactive: ${isInteractive ? 'Yes' : 'No'}
- Timeout: ${timeout || 'default'}ms

## Process Flow
Think through the process lifecycle:
1. Startup: What needs to happen before the process starts?
2. Execution: What will the process do?
3. Output: What output should you expect?
4. Cleanup: What needs to happen after completion?

## Error Handling
Consider potential errors:
- Process fails to start
- Process hangs (timeout)
- Unexpected output
- Wrong exit code

## Next Steps
Plan the interaction:
1. What is the process goal?
2. What inputs will you provide?
3. What outputs do you expect?
4. How will you handle errors?

Please proceed with sequential thinking for this process operation.
`.trim();
}

/**
 * Generic sequential thinking prompt
 * @param {object} context - Operation context
 * @returns {string} Formatted prompt
 */
function genericPrompt(context = {}) {
  const {
    toolName,
    category,
    description,
    complexity
  } = context;
  
  return `
You are about to perform a ${category || 'unknown'} operation using ${toolName}.

## Operation
- Tool: ${toolName}
- Category: ${category || 'unknown'}
- Complexity: ${complexity || 'standard'}
- Description: ${description || 'No description provided'}

## Sequential Thinking Approach
Break down this operation into clear steps:
1. Understand: What is being asked?
2. Plan: What steps are needed?
3. Execute: How will you perform the operation?
4. Verify: How will you confirm success?

Please proceed with step-by-step thinking for this operation.
`.trim();
}

/**
 * Get expectations for an operation type
 * @param {string} operation - Operation type
 * @returns {string} Expectations text
 */
function getExpectations(operation) {
  const expectations = {
    read: '- File will be read into context\n- Content will be available for analysis',
    write: '- File will be created or overwritten\n- Previous content will be lost',
    edit: '- Specific text will be replaced\n- Rest of file remains unchanged',
    list: '- Directory contents will be listed\n- Files and folders will be shown',
    search: '- Matching files/lines will be found\n- Results will be returned'
  };
  
  return expectations[operation] || '- Operation will be executed\n- Results will be returned';
}

/**
 * Get validation checklist for an operation type
 * @param {string} operation - Operation type
 * @returns {string} Validation checklist
 */
function getValidationChecklist(operation) {
  const checklists = {
    read: '- File content is as expected\n- No read errors occurred',
    write: '- File was created successfully\n- Content matches what was written',
    edit: '- Only intended text was changed\n- No unintended modifications',
    list: '- All items are shown\n- Directory structure is correct',
    search: '- All matches are found\n- No false positives'
  };
  
  return checklists[operation] || '- Operation completed successfully\n- Results are as expected';
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

module.exports = {
  fileOperationPrompt,
  processOperationPrompt,
  genericPrompt
};
