/**
 * Prompt Enhancer - User Confirmation UI
 * 
 * Implements the confirmation layer that shows enhanced prompts
 * and respects YOLO mode for auto-approval.
 * 
 * @module lib/prompt-enhancer/confirmation
 */

/**
 * Check if YOLO mode is enabled
 * 
 * @param {Object} config - Configuration object from .planning/config.json
 * @returns {boolean} - True if YOLO mode is enabled
 */
function isYoloMode(config = {}) {
  return config.mode === 'yolo';
}

/**
 * Format enhancement for display with diff-style comparison
 * 
 * @param {string} originalPrompt - The original user prompt
 * @param {string} enhancedPrompt - The enhanced prompt
 * @param {number} score - Enhancement score (0-10)
 * @returns {string} - Formatted display string
 */
function displayEnhancement(originalPrompt, enhancedPrompt, score) {
  const lines = [];
  
  lines.push('┌─────────────────────────────────────────────────────────────┐');
  lines.push('│                   PROMPT ENHANCEMENT                        │');
  lines.push('├─────────────────────────────────────────────────────────────┤');
  lines.push('│ ORIGINAL:                                                   │');
  lines.push('│ ' + originalPrompt.slice(0, 57).padEnd(57) + ' │');
  lines.push('├─────────────────────────────────────────────────────────────┤');
  lines.push('│ ENHANCED:                                                   │');
  
  // Format enhanced prompt with line breaks
  const enhancedLines = enhancedPrompt.split('\n');
  for (const line of enhancedLines.slice(0, 10)) {
    const truncated = line.slice(0, 57);
    lines.push('│ ' + truncated.padEnd(57) + ' │');
  }
  
  if (enhancedLines.length > 10) {
    lines.push('│ ' + `... (${enhancedLines.length - 10} more lines)`.padEnd(57) + ' │');
  }
  
  lines.push('├─────────────────────────────────────────────────────────────┤');
  lines.push('│ Confidence: ' + `${Math.round(score * 10)}%`.padEnd(46) + ' │');
  lines.push('└─────────────────────────────────────────────────────────────┘');
  
  return lines.join('\n');
}

/**
 * Present confirmation options to user
 * 
 * @returns {string} - User choice: 'approve', 'edit', 'cancel', 'skip'
 */
function promptForConfirmation() {
  return `
  Options:
  [A]pprove - Use the enhanced prompt
  [E]dit    - Modify the enhanced prompt
  [C]ancel  - Abort the operation
  [S]kip    - Use original prompt without enhancement
  
  Your choice: `;
}

/**
 * Process user's choice
 * 
 * @param {string} choice - User's input (A, E, C, S)
 * @param {string} enhancedPrompt - The enhanced prompt
 * @param {string} originalPrompt - The original prompt
 * @returns {Object} - { action, prompt, message }
 */
function handleUserChoice(choice, enhancedPrompt, originalPrompt) {
  const normalized = (choice || '').toUpperCase().trim();
  
  switch (normalized) {
    case 'A':
    case 'APPROVE':
      return {
        action: 'approve',
        prompt: enhancedPrompt,
        message: 'Using enhanced prompt'
      };
      
    case 'E':
    case 'EDIT':
      return {
        action: 'edit',
        prompt: enhancedPrompt,
        message: 'Opening editor for modifications'
      };
      
    case 'C':
    case 'CANCEL':
      return {
        action: 'cancel',
        prompt: null,
        message: 'Operation cancelled'
      };
      
    case 'S':
    case 'SKIP':
      return {
        action: 'skip',
        prompt: originalPrompt,
        message: 'Using original prompt without enhancement'
      };
      
    default:
      // Default to approve if unclear
      return {
        action: 'approve',
        prompt: enhancedPrompt,
        message: 'Auto-approved (unclear input)'
      };
  }
}

/**
 * Edit prompt in external editor (placeholder for actual implementation)
 * 
 * @param {string} prompt - The prompt to edit
 * @returns {Promise<string>} - The edited prompt
 */
async function editInEditor(prompt) {
  // In a real implementation, this would:
  // 1. Write prompt to a temp file
  // 2. Open the file in the user's default editor
  // 3. Wait for the editor to close
  // 4. Read the edited content
  // 5. Delete the temp file
  
  // For now, return the prompt as-is with a note
  return prompt + '\n\n[Edited by user]';
}

/**
 * Main confirmation flow function
 * 
 * @param {string} enhancedPrompt - The enhanced prompt
 * @param {string} originalPrompt - The original prompt
 * @param {Object} options - { config, score, interactive }
 * @returns {Promise<Object>} - { approved, prompt, autoApproved }
 */
async function confirmEnhancement(enhancedPrompt, originalPrompt, options = {}) {
  const { config, score = 0, interactive = true } = options;
  
  // Check YOLO mode
  if (isYoloMode(config)) {
    return {
      approved: true,
      prompt: enhancedPrompt,
      autoApproved: true,
      message: 'Auto-approved (YOLO mode)'
    };
  }
  
  // If not interactive, auto-approve
  if (!interactive) {
    return {
      approved: true,
      prompt: enhancedPrompt,
      autoApproved: true,
      message: 'Auto-approved (non-interactive mode)'
    };
  }
  
  // Display enhancement
  const display = displayEnhancement(originalPrompt, enhancedPrompt, score);
  console.log(display);
  
  // Show options (in real implementation, this would wait for user input)
  // For programmatic use, return the display and options
  return {
    approved: null, // Waiting for user input
    prompt: enhancedPrompt,
    autoApproved: false,
    display,
    options: ['approve', 'edit', 'cancel', 'skip'],
    message: 'Waiting for user confirmation'
  };
}

/**
 * Process confirmation response
 * 
 * @param {string} choice - User's choice
 * @param {string} enhancedPrompt - The enhanced prompt
 * @param {string} originalPrompt - The original prompt
 * @returns {Promise<Object>} - Final confirmation result
 */
async function processConfirmationResponse(choice, enhancedPrompt, originalPrompt) {
  const result = handleUserChoice(choice, enhancedPrompt, originalPrompt);
  
  if (result.action === 'edit') {
    const editedPrompt = await editInEditor(enhancedPrompt);
    return {
      approved: true,
      prompt: editedPrompt,
      autoApproved: false,
      edited: true,
      message: 'Using edited prompt'
    };
  }
  
  return {
    approved: result.action !== 'cancel',
    prompt: result.prompt,
    autoApproved: false,
    cancelled: result.action === 'cancel',
    skipped: result.action === 'skip',
    message: result.message
  };
}

module.exports = {
  isYoloMode,
  displayEnhancement,
  promptForConfirmation,
  handleUserChoice,
  editInEditor,
  confirmEnhancement,
  processConfirmationResponse
};
