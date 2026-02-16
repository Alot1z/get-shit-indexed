#!/usr/bin/env node
/**
 * Bash Redirect Hook - Executable
 * Intercepts native Bash tool calls and redirects to Desktop Commander start_process
 * 
 * Usage: node bash-redirect.js <tool_name> <tool_input_json>
 * 
 * Exit codes:
 * 0 = Allow original tool
 * 1 = Block and use replacement
 * 2 = Error
 */

const KEEP_NATIVE = [
  'git', 'npm', 'node', 'npx', 'yarn', 'pnpm',
  'python', 'python3', 'pip',
  'docker', 'kubectl',
  'curl', 'wget'
];

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(JSON.stringify({ proceed: true }));
    process.exit(0);
  }
  
  const toolName = args[0];
  let toolInput;
  
  try {
    toolInput = JSON.parse(args[1]);
  } catch (e) {
    console.log(JSON.stringify({ proceed: true }));
    process.exit(0);
  }
  
  // Check if it's a Bash tool
  if (toolName.toLowerCase() !== 'bash') {
    console.log(JSON.stringify({ proceed: true }));
    process.exit(0);
  }
  
  const command = toolInput?.command || '';
  const baseCommand = command.split(' ')[0];
  
  // Check if command should keep native bash (no DC equivalent)
  if (KEEP_NATIVE.some(cmd => baseCommand === cmd || baseCommand.endsWith(cmd))) {
    // Still redirect to DC for reliability, but use start_process
    const result = {
      proceed: false,
      replacement: {
        tool: 'mcp__desktop-commander__start_process',
        input: {
          command: command,
          timeout_ms: 60000
        }
      },
      message: `[bash-redirect] Redirecting "${baseCommand}" to Desktop Commander for reliability`
    };
    console.log(JSON.stringify(result));
    process.exit(1);
  }
  
  // Default: redirect to start_process
  const result = {
    proceed: false,
    replacement: {
      tool: 'mcp__desktop-commander__start_process',
      input: {
        command: command,
        timeout_ms: 60000
      }
    },
    message: `[bash-redirect] Redirecting to Desktop Commander start_process for better reliability`
  };
  
  console.log(JSON.stringify(result));
  process.exit(1);
}

main();
