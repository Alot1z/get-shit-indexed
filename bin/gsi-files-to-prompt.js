#!/usr/bin/env node

/**
 * @fileoverview CLI wrapper for files-to-prompt functionality
 * Part of Phase 50A: Core Engine Integration
 */

const { program } = require('commander');
const fs = require('fs');
const path = require('path');

// Import core module
const core = require('../lib/core-engine/index');

program
  .name('gsi-files-to-prompt')
  .description('Convert files to LLM-friendly prompt format (CXML)')
  .version('1.0.0')
  .argument('[files...]', 'Files or directories to process')
  .option('-c, --cxml', 'Output in CXML format (default)', true)
  .option('-t, --text', 'Output in plain text format')
  .option('-o, --output <file>', 'Output file path')
  .option('-i, --include <patterns...>', 'Include patterns (glob)', ['*'])
  .option('-e, --exclude <patterns...>', 'Exclude patterns (glob)', [])
  .option('--no-cxml', 'Disable CXML format')
  .action(async (files, options) => {
    try {
      if (files.length === 0) {
        program.help();
        return;
      }

      // Determine format
      const format = options.text ? 'text' : 'cxml';

      // Convert files
      const result = await core.filesToPrompt(files, {
        format,
        include: options.include,
        exclude: options.exclude
      });

      // Output result
      if (options.output) {
        fs.writeFileSync(options.output, result);
        console.log(`Output written to: ${options.output}`);
      } else {
        console.log(result);
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Parse arguments
program.parse();
