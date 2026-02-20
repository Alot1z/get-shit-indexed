#!/usr/bin/env node

/**
 * GSI Install CLI
 * 
 * Command-line interface for GSI installation.
 * Provides interactive installation wizard and dependency checking.
 * 
 * Usage:
 *   gsi-install [options]
 *   gsi-install --global --claude
 *   gsi-install --local --opencode
 *   gsi-install --verify
 *   gsi-install --uninstall --claude --global
 */

// @ts-ignore - TypeScript shim
import * as fs from 'fs';
// @ts-ignore
import * as path from 'path';
// @ts-ignore
import * as os from 'os';
// @ts-ignore
import * as readline from 'readline';

// Import installation modules (compiled)
const { Installer } = require('../lib/gsi-install/installer');
const { InstallDetector } = require('../lib/gsi-install/detector');
const { DependencyChecker } = require('../lib/gsi-install/dependency-checker');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

// Banner
const banner = '\n' +
  cyan + '   ██████╗ ' + '\x1b[38;5;183m' + '███████╗' + cyan + '  █████╗\n' +
  cyan + '  ██╔════╝ ' + '\x1b[38;5;183m' + '██╔════╝' + cyan + '    ██╔╝\n' +
  cyan + '  ██║  ███╗' + '\x1b[38;5;183m' + '███████╗' + cyan + '    ██║\n' +
  cyan + '  ██║   ██║' + '\x1b[38;5;183m' + '╚════██║' + cyan + '    ██║\n' +
  cyan + '  ╚██████╔╝' + '\x1b[38;5;183m' + '███████║' + cyan + '    ██║\n' +
  cyan + '   ╚═════╝ ' + '\x1b[38;5;183m' + '╚══════╝' + cyan + '  █████╝\n' +
  '\n' +
  '  GSI Installer ' + dim + 'v1.0.0' + reset + '\n';

// Parse arguments
const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');
const hasClaude = args.includes('--claude');
const hasOpencode = args.includes('--opencode');
const hasGemini = args.includes('--gemini');
const hasAll = args.includes('--all');
const hasUninstall = args.includes('--uninstall') || args.includes('-u');
const hasVerify = args.includes('--verify') || args.includes('-v');
const hasHelp = args.includes('--help') || args.includes('-h');
const hasDryRun = args.includes('--dry-run');
const hasForce = args.includes('--force');

// Determine runtime
let selectedRuntime: 'claude' | 'opencode' | 'gemini' = 'claude';
if (hasOpencode) selectedRuntime = 'opencode';
if (hasGemini) selectedRuntime = 'gemini';

// Show banner
console.log(banner);

// Show help
if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} gsi-install [options]\n`);
  console.log(`  ${yellow}Options:${reset}`);
  console.log(`    ${cyan}-g, --global${reset}       Install globally`);
  console.log(`    ${cyan}-l, --local${reset}        Install locally (project-level)`);
  console.log(`    ${cyan}--claude${reset}           Install for Claude Code`);
  console.log(`    ${cyan}--opencode${reset}         Install for OpenCode`);
  console.log(`    ${cyan}--gemini${reset}           Install for Gemini`);
  console.log(`    ${cyan}--all${reset}              Install for all runtimes`);
  console.log(`    ${cyan}-u, --uninstall${reset}    Uninstall GSI`);
  console.log(`    ${cyan}-v, --verify${reset}       Verify installation`);
  console.log(`    ${cyan}--dry-run${reset}          Show what would be done`);
  console.log(`    ${cyan}--force${reset}            Force overwrite`);
  console.log(`    ${cyan}-h, --help${reset}         Show this help\n`);
  console.log(`  ${yellow}Examples:${reset}`);
  console.log(`    ${dim}# Interactive install${reset}`);
  console.log(`    gsi-install\n`);
  console.log(`    ${dim}# Install globally for Claude Code${reset}`);
  console.log(`    gsi-install --global --claude\n`);
  console.log(`    ${dim}# Verify installation${reset}`);
  console.log(`    gsi-install --verify\n`);
  process.exit(0);
}

// Main execution
async function main() {
  const installer = new Installer();
  const detector = new InstallDetector();
  const depChecker = new DependencyChecker();

  try {
    // Verify mode
    if (hasVerify) {
      console.log(`  ${cyan}Verifying installation...${reset}\n`);
      
      const result = await installer.verify({
        global: hasGlobal,
        local: hasLocal,
        runtime: selectedRuntime,
      });

      console.log(`  ${yellow}Dependency Check:${reset} ${result.checks.dependencies ? green + 'PASS' : red + 'FAIL'}${reset}`);
      console.log(`  ${yellow}Hooks Check:${reset}      ${result.checks.hooks ? green + 'PASS' : red + 'FAIL'}${reset}`);
      console.log(`  ${yellow}Files Check:${reset}       ${result.checks.files ? green + 'PASS' : red + 'FAIL'}${reset}`);
      console.log(`  ${yellow}MCP Check:${reset}         ${result.checks.mcpConnections ? green + 'PASS' : red + 'FAIL'}${reset}\n`);

      if (result.success) {
        console.log(`  ${green}✓ Installation verified successfully${reset}\n`);
      } else {
        console.log(`  ${red}✗ Verification failed${reset}\n`);
        if (result.errors.length > 0) {
          console.log(`  ${yellow}Errors:${reset}`);
          result.errors.forEach(e => console.log(`    - ${e}`));
        }
      }

      process.exit(result.success ? 0 : 1);
    }

    // Uninstall mode
    if (hasUninstall) {
      console.log(`  ${cyan}Uninstalling GSI...${reset}\n`);
      
      const result = await installer.uninstall({
        global: hasGlobal,
        local: hasLocal,
        runtime: selectedRuntime,
        dryRun: hasDryRun,
      });

      if (result.success) {
        console.log(`  ${green}✓ Uninstalled successfully${reset}`);
        console.log(`    Files removed: ${result.filesRemoved.length}`);
        console.log(`    Hooks removed: ${result.hooksRemoved.length}\n`);
      } else {
        console.log(`  ${red}✗ Uninstall failed${reset}\n`);
        result.errors.forEach(e => console.log(`    ${red}Error:${reset} ${e}`));
      }

      process.exit(result.success ? 0 : 1);
    }

    // Install mode
    console.log(`  ${cyan}Installing GSI for ${selectedRuntime}...${reset}\n`);

    // Check dependencies first
    console.log(`  ${dim}Checking dependencies...${reset}`);
    const depResult = await depChecker.checkAll();
    
    if (!depResult.success && !hasForce) {
      console.log(`  ${yellow}⚠ Dependency issues detected:${reset}`);
      depResult.errors.forEach(e => console.log(`    - ${e}`));
      console.log(`\n  Use ${cyan}--force${reset} to install anyway.\n`);
      process.exit(1);
    }

    // Perform installation
    const result = await installer.install({
      global: hasGlobal,
      local: hasLocal,
      runtime: selectedRuntime,
      force: hasForce,
      dryRun: hasDryRun,
      verbose: true,
    });

    if (hasDryRun) {
      console.log(`\n  ${yellow}Dry run - no changes made${reset}`);
    }

    if (result.success) {
      console.log(`\n  ${green}✓ Installed successfully!${reset}`);
      console.log(`    Type: ${result.type}`);
      console.log(`    Runtime: ${result.runtime}`);
      console.log(`    Config: ${result.configDir}`);
      console.log(`    Files: ${result.filesInstalled.length}`);
      console.log(`    Hooks: ${result.hooksRegistered.length}\n`);
    } else {
      console.log(`\n  ${red}✗ Installation failed${reset}\n`);
      result.errors.forEach(e => console.log(`    ${red}Error:${reset} ${e}`));
    }

    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error(`\n  ${red}Fatal error:${reset} ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    process.exit(1);
  }
}

main();
