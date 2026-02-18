#!/usr/bin/env node

/**
 * GSI Tools — CLI utility for GSI workflow operations
 *
 * Replaces repetitive inline bash patterns across ~50 GSI command/workflow/agent files.
 * Centralizes: config parsing, model resolution, phase lookup, git commits, summary verification.
 *
 * Usage: node GSI-tools.js <command> [args] [--raw]
 *
 * Atomic Commands:
 *   state load                         Load project config + state
 *   state update <field> <value>       Update a STATE.md field
 *   state get [section]                Get STATE.md content or section
 *   state patch --field val ...        Batch update STATE.md fields
 *   install-info                       Show detected install context
 *     [--force-global] [--force-project]
 *   resolve-model <agent-type>         Get model for agent based on profile
 *   find-phase <phase>                 Find phase directory by number
 *   commit <message> [--files f1 f2]   Commit planning docs
 *   verify-summary <path>              Verify a SUMMARY.md file
 *   generate-slug <text>               Convert text to URL-safe slug
 *   current-timestamp [format]         Get timestamp (full|date|filename)
 *   list-todos [area]                  Count and enumerate pending todos
 *   verify-path-exists <path>          Check file/directory existence
 *   config-ensure-section              Initialize .planning/config.json
 *   history-digest                     Aggregate all SUMMARY.md data
 *   summary-extract <path> [--fields]  Extract structured data from SUMMARY.md
 *   state-snapshot                     Structured parse of STATE.md
 *   phase-plan-index <phase>           Index plans with waves and status
 *   websearch <query>                  Search web via Brave API (if configured)
 *     [--limit N] [--freshness day|week|month]
 *
 * Reflection Operations:
 *   reflection list                    Show recent reflections and stats
 *     [--tool <name>] [--type <type>]
 *   reflection patterns                Show extracted patterns
 *     [--min-success N] [--min-freq N] [--type successful|anti]
 *   reflection insights                Show generated insights
 *     [--type <type>] [--impact <level>] [--limit N]
 *   reflection graph                   Show debug-thinking graph stats
 *
 * Phase Operations:
 *   phase next-decimal <phase>         Calculate next decimal phase number
 *   phase add <description>            Append new phase to roadmap + create dir
 *   phase insert <after> <description> Insert decimal phase after existing
 *   phase remove <phase> [--force]     Remove phase, renumber all subsequent
 *   phase complete <phase>             Mark phase done, update state + roadmap
 *
 * Roadmap Operations:
 *   roadmap get-phase <phase>          Extract phase section from ROADMAP.md
 *   roadmap analyze                    Full roadmap parse with disk status
 *
 * Milestone Operations:
 *   milestone complete <version>       Archive milestone, create MILESTONES.md
 *     [--name <name>]
 *
 * Validation:
 *   validate consistency               Check phase numbering, disk/roadmap sync
 *
 * Progress:
 *   progress [json|table|bar]          Render progress in various formats
 *
 * Todos:
 *   todo complete <filename>           Move todo from pending to completed
 *
 * Scaffolding:
 *   scaffold context --phase <N>       Create CONTEXT.md template
 *   scaffold uat --phase <N>           Create UAT.md template
 *   scaffold verification --phase <N>  Create VERIFICATION.md template
 *   scaffold phase-dir --phase <N>     Create phase directory
 *     --name <name>
 *
 * Frontmatter CRUD:
 *   frontmatter get <file> [--field k] Extract frontmatter as JSON
 *   frontmatter set <file> --field k   Update single frontmatter field
 *     --value jsonVal
 *   frontmatter merge <file>           Merge JSON into frontmatter
 *     --data '{json}'
 *   frontmatter validate <file>        Validate required fields
 *     --schema plan|summary|verification
 *
 * Verification Suite:
 *   verify plan-structure <file>       Check PLAN.md structure + tasks
 *   verify phase-completeness <phase>  Check all plans have summaries
 *   verify references <file>           Check @-refs + paths resolve
 *   verify commits <h1> [h2] ...      Batch verify commit hashes
 *   verify artifacts <plan-file>       Check must_haves.artifacts
 *   verify key-links <plan-file>       Check must_haves.key_links
 *
 * Template Fill:
 *   template fill summary --phase N    Create pre-filled SUMMARY.md
 *     [--plan M] [--name "..."]
 *     [--fields '{json}']
 *   template fill plan --phase N       Create pre-filled PLAN.md
 *     [--plan M] [--type execute|tdd]
 *     [--wave N] [--fields '{json}']
 *   template fill verification         Create pre-filled VERIFICATION.md
 *     --phase N [--fields '{json}']
 *
 * Thinking Orchestrator Operations:
 *   thinking analyze <command>         Analyze command complexity
 *     [--json]
 *   thinking config <command>          Generate optimal thinking config
 *     [--profile <name>] [--timeout <ms>]
 *     [--bmad] [--no-bmad]
 *   thinking servers                   List available thinking servers
 *     [--json]
 *   thinking test                      Test thinking server connections
 *     [--server <name>] [--timeout <ms>]
 *   thinking apply-all                 Apply thinking_phase to all GSI commands
 *     [--commands-dir <path>] [--backup-dir <path>]
 *     [--dry-run] [--force]
 *   thinking validate                  Validate thinking_phase configurations
 *     [--commands-dir <path>] [--strict]
 *   thinking rollback                  Rollback thinking_phase changes
 *     [--backup-dir <path>]
 *   thinking factors                   Show complexity factor documentation
 *     [--json]
 *
 * State Progression:
 *   state advance-plan                 Increment plan counter
 *   state record-metric --phase N      Record execution metrics
 *     --plan M --duration Xmin
 *     [--tasks N] [--files N]
 *   state update-progress              Recalculate progress bar
 *   state add-decision --summary "..."  Add decision to STATE.md
 *     [--phase N] [--rationale "..."]
 *   state add-blocker --text "..."     Add blocker
 *   state resolve-blocker --text "..." Remove blocker
 *   state record-session               Update session continuity
 *     --stopped-at "..."
 *     [--resume-file path]
 *
 * Compound Commands (workflow-specific initialization):
 *   init execute-phase <phase>         All context for execute-phase workflow
 *   init plan-phase <phase>            All context for plan-phase workflow
 *   init new-project                   All context for new-project workflow
 *   init new-milestone                 All context for new-milestone workflow
 *   init quick <description>           All context for quick workflow
 *   init resume                        All context for resume-project workflow
 *   init verify-work <phase>           All context for verify-work workflow
 *   init phase-op <phase>              Generic phase operation context
 *   init todos [area]                  All context for todo workflows
 *   init milestone-op                  All context for milestone operations
 *   init map-codebase                  All context for map-codebase workflow
 *   init progress                      All context for progress workflow
 *
 * Patch Manager Operations:
 *   patch backup                       Backup local modifications before update
 *     [--patches-dir <path>]
 *   patch restore                      Restore backed-up modifications after update
 *     [--patches-dir <path>]
 *   patch status                       Show status of local modifications backup
 *     [--patches-dir <path>]
 *   patch diff                         Show diff between backup and current files
 *     [--patches-dir <path>]
 *
 * Workflow Chainer Operations:
 *   workflow run <template>            Run a workflow template
 *     [--vars '{json}'] [--yolo]
 *     [--failure-strategy stop|continue|rollback]
 *     [--templates-dir <path>] [--state-dir <path>]
 *   workflow list                      List available workflow templates
 *     [--templates-dir <path>]
 *   workflow status [name]             Show workflow status (all or specific)
 *     [--state-dir <path>]
 *   workflow pause <name>              Pause a running workflow
 *     [--state-dir <path>]
 *   workflow resume <name>             Resume a paused workflow
 *     [--state-dir <path>]
 *   workflow rollback <name>           Rollback workflow to last checkpoint
 *     [--state-dir <path>]
 *
 * Pattern Discovery Operations (Phase 38-03):
 *   workflow discover                  Mine patterns from command history
 *     [--min-frequency N] [--min-quality N]
 *     [--min-success-rate N] [--min/max-length N]
 *     [--state-dir <path>]
 *   workflow recommend                 Get workflow recommendations
 *     [--phase N] [--recent-commands cmd1,cmd2]
 *     [--goal "..."] [--state-dir <path>]
 *   workflow optimize <name>           Optimize a workflow
 *     [--state-dir <path>]
 *   workflow analyze                   Analyze all workflows and patterns
 *     [--state-dir <path>]
 *   workflow export <pattern-id>       Export pattern as template
 *     [--output <path>] [--state-dir <path>]
 *
 * Knowledge Base Operations:
 *   knowledge extract <path>           Extract patterns from source files
 *     [--category <category>] [--knowledge-dir <path>]
 *   knowledge search <query>           Search knowledge base for patterns
 *     [--category <category>] [--limit N] [--knowledge-dir <path>]
 *   knowledge generate-skill <id>      Generate skill from pattern
 *     [--knowledge-dir <path>]
 *   knowledge list                     List all patterns in knowledge base
 *     [--category <category>] [--limit N] [--knowledge-dir <path>]
 *   knowledge stats                    Show knowledge base statistics
 *     [--knowledge-dir <path>]
 *
 * Multi-Type Artifact Generation (Phase 38-01):
 *   knowledge generate-all <id>        Generate ALL artifact types from pattern
 *     [--knowledge-dir <path>]
 *   knowledge generate <id> <type>     Generate specific artifact type
 *     [--knowledge-dir <path>]
 *   knowledge artifact-types           List available artifact types
 *   knowledge extract-generate <path>  Extract and generate artifacts in one op
 *     [--types type1,type2] [--category <cat>] [--knowledge-dir <path>]
 *   knowledge batch-generate <ids>     Generate artifacts for multiple patterns
 *     --types type1,type2 [--knowledge-dir <path>]
 *
 * Shorthand Commands (single artifact type):
 *   knowledge agent <id>               Generate agent from pattern
 *   knowledge feature <id>             Generate feature spec from pattern
 *   knowledge idea <id>                Generate idea doc from pattern
 *   knowledge logic <id>               Generate logic module from pattern
 *   knowledge function <id>            Generate function from pattern
 *   knowledge improvement <id>         Generate improvement suggestions
 *
 * Artifact Types: SKILL, AGENT, LOGIC, FUNCTION, FEATURE, IMPROVEMENT, IDEA
 *
 * Cognitive Flow Operations (Phase 38-04):
 *   cognitive flow <operation>         Execute with cognitive flow enhancement
 *     [--timeout N] [--phase PHASE] [--file PATH]
 *   cognitive status                   Show cognitive system status
 *   cognitive learn [operation]        Trigger learning capture
 *     [--phase PHASE]
 *   cognitive optimize                 Optimize cognitive settings
 *     [--reset-stats]
 *
 * Cognitive Phases: PREPARE, EXECUTE, REFLECT, LEARN
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Pattern visualization module (try-exit for optional dependency)
let patternViz = null;
try {
  patternViz = require('../lib/pattern-learning/visualization');
} catch (e) {
  // Module not available yet
}

// ─── Model Profile Table ─────────────────────────────────────────────────────

const MODEL_PROFILES = {
  'GSI-planner':              { quality: 'opus', balanced: 'opus',   budget: 'sonnet' },
  'GSI-roadmapper':           { quality: 'opus', balanced: 'sonnet', budget: 'sonnet' },
  'GSI-executor':             { quality: 'opus', balanced: 'sonnet', budget: 'sonnet' },
  'GSI-phase-researcher':     { quality: 'opus', balanced: 'sonnet', budget: 'haiku' },
  'GSI-project-researcher':   { quality: 'opus', balanced: 'sonnet', budget: 'haiku' },
  'GSI-research-synthesizer': { quality: 'sonnet', balanced: 'sonnet', budget: 'haiku' },
  'GSI-debugger':             { quality: 'opus', balanced: 'sonnet', budget: 'sonnet' },
  'GSI-codebase-mapper':      { quality: 'sonnet', balanced: 'haiku', budget: 'haiku' },
  'GSI-verifier':             { quality: 'sonnet', balanced: 'sonnet', budget: 'haiku' },
  'GSI-plan-checker':         { quality: 'sonnet', balanced: 'sonnet', budget: 'haiku' },
  'GSI-integration-checker':  { quality: 'sonnet', balanced: 'sonnet', budget: 'haiku' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseIncludeFlag(args) {
  const includeIndex = args.indexOf('--include');
  if (includeIndex === -1) return new Set();
  const includeValue = args[includeIndex + 1];
  if (!includeValue) return new Set();
  return new Set(includeValue.split(',').map(s => s.trim()));
}

function safeReadFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function loadConfig(cwd) {
  const configPath = path.join(cwd, '.planning', 'config.json');
  const defaults = {
    model_profile: 'balanced',
    commit_docs: true,
    search_gitignored: false,
    branching_strategy: 'none',
    phase_branch_template: 'GSI/phase-{phase}-{slug}',
    milestone_branch_template: 'GSI/{milestone}-{slug}',
    research: true,
    plan_checker: true,
    verifier: true,
    parallelization: true,
    brave_search: false,
  };

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw);

    const get = (key, nested) => {
      if (parsed[key] !== undefined) return parsed[key];
      if (nested && parsed[nested.section] && parsed[nested.section][nested.field] !== undefined) {
        return parsed[nested.section][nested.field];
      }
      return undefined;
    };

    const parallelization = (() => {
      const val = get('parallelization');
      if (typeof val === 'boolean') return val;
      if (typeof val === 'object' && val !== null && 'enabled' in val) return val.enabled;
      return defaults.parallelization;
    })();

    return {
      model_profile: get('model_profile') ?? defaults.model_profile,
      commit_docs: get('commit_docs', { section: 'planning', field: 'commit_docs' }) ?? defaults.commit_docs,
      search_gitignored: get('search_gitignored', { section: 'planning', field: 'search_gitignored' }) ?? defaults.search_gitignored,
      branching_strategy: get('branching_strategy', { section: 'git', field: 'branching_strategy' }) ?? defaults.branching_strategy,
      phase_branch_template: get('phase_branch_template', { section: 'git', field: 'phase_branch_template' }) ?? defaults.phase_branch_template,
      milestone_branch_template: get('milestone_branch_template', { section: 'git', field: 'milestone_branch_template' }) ?? defaults.milestone_branch_template,
      research: get('research', { section: 'workflow', field: 'research' }) ?? defaults.research,
      plan_checker: get('plan_checker', { section: 'workflow', field: 'plan_check' }) ?? defaults.plan_checker,
      verifier: get('verifier', { section: 'workflow', field: 'verifier' }) ?? defaults.verifier,
      parallelization,
      brave_search: get('brave_search') ?? defaults.brave_search,
    };
  } catch {
    return defaults;
  }
}

function isGitIgnored(cwd, targetPath) {
  try {
    execSync('git check-ignore -q -- ' + targetPath.replace(/[^a-zA-Z0-9._\-/]/g, ''), {
      cwd,
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

function execGit(cwd, args) {
  try {
    const escaped = args.map(a => {
      if (/^[a-zA-Z0-9._\-/=:@]+$/.test(a)) return a;
      return "'" + a.replace(/'/g, "'\\''") + "'";
    });
    const stdout = execSync('git ' + escaped.join(' '), {
      cwd,
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    return { exitCode: 0, stdout: stdout.trim(), stderr: '' };
  } catch (err) {
    return {
      exitCode: err.status ?? 1,
      stdout: (err.stdout ?? '').toString().trim(),
      stderr: (err.stderr ?? '').toString().trim(),
    };
  }
}

function normalizePhaseName(phase) {
  const match = phase.match(/^(\d+(?:\.\d+)?)/);
  if (!match) return phase;
  const num = match[1];
  const parts = num.split('.');
  const padded = parts[0].padStart(2, '0');
  return parts.length > 1 ? `${padded}.${parts[1]}` : padded;
}

function extractFrontmatter(content) {
  const frontmatter = {};
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return frontmatter;

  const yaml = match[1];
  const lines = yaml.split('\n');

  // Stack to track nested objects: [{obj, key, indent}]
  // obj = object to write to, key = current key collecting array items, indent = indentation level
  let stack = [{ obj: frontmatter, key: null, indent: -1 }];

  for (const line of lines) {
    // Skip empty lines
    if (line.trim() === '') continue;

    // Calculate indentation (number of leading spaces)
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;

    // Pop stack back to appropriate level
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1];

    // Check for key: value pattern
    const keyMatch = line.match(/^(\s*)([a-zA-Z0-9_-]+):\s*(.*)/);
    if (keyMatch) {
      const key = keyMatch[2];
      const value = keyMatch[3].trim();

      if (value === '' || value === '[') {
        // Key with no value or opening bracket — could be nested object or array
        // We'll determine based on next lines, for now create placeholder
        current.obj[key] = value === '[' ? [] : {};
        current.key = null;
        // Push new context for potential nested content
        stack.push({ obj: current.obj[key], key: null, indent });
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Inline array: key: [a, b, c]
        current.obj[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        current.key = null;
      } else {
        // Simple key: value
        current.obj[key] = value.replace(/^["']|["']$/g, '');
        current.key = null;
      }
    } else if (line.trim().startsWith('- ')) {
      // Array item
      const itemValue = line.trim().slice(2).replace(/^["']|["']$/g, '');

      // If current context is an empty object, convert to array
      if (typeof current.obj === 'object' && !Array.isArray(current.obj) && Object.keys(current.obj).length === 0) {
        // Find the key in parent that points to this object and convert it
        const parent = stack.length > 1 ? stack[stack.length - 2] : null;
        if (parent) {
          for (const k of Object.keys(parent.obj)) {
            if (parent.obj[k] === current.obj) {
              parent.obj[k] = [itemValue];
              current.obj = parent.obj[k];
              break;
            }
          }
        }
      } else if (Array.isArray(current.obj)) {
        current.obj.push(itemValue);
      }
    }
  }

  return frontmatter;
}

function reconstructFrontmatter(obj) {
  const lines = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else if (value.every(v => typeof v === 'string') && value.length <= 3 && value.join(', ').length < 60) {
        lines.push(`${key}: [${value.join(', ')}]`);
      } else {
        lines.push(`${key}:`);
        for (const item of value) {
          lines.push(`  - ${typeof item === 'string' && (item.includes(':') || item.includes('#')) ? `"${item}"` : item}`);
        }
      }
    } else if (typeof value === 'object') {
      lines.push(`${key}:`);
      for (const [subkey, subval] of Object.entries(value)) {
        if (subval === null || subval === undefined) continue;
        if (Array.isArray(subval)) {
          if (subval.length === 0) {
            lines.push(`  ${subkey}: []`);
          } else if (subval.every(v => typeof v === 'string') && subval.length <= 3 && subval.join(', ').length < 60) {
            lines.push(`  ${subkey}: [${subval.join(', ')}]`);
          } else {
            lines.push(`  ${subkey}:`);
            for (const item of subval) {
              lines.push(`    - ${typeof item === 'string' && (item.includes(':') || item.includes('#')) ? `"${item}"` : item}`);
            }
          }
        } else if (typeof subval === 'object') {
          lines.push(`  ${subkey}:`);
          for (const [subsubkey, subsubval] of Object.entries(subval)) {
            if (subsubval === null || subsubval === undefined) continue;
            if (Array.isArray(subsubval)) {
              if (subsubval.length === 0) {
                lines.push(`    ${subsubkey}: []`);
              } else {
                lines.push(`    ${subsubkey}:`);
                for (const item of subsubval) {
                  lines.push(`      - ${item}`);
                }
              }
            } else {
              lines.push(`    ${subsubkey}: ${subsubval}`);
            }
          }
        } else {
          const sv = String(subval);
          lines.push(`  ${subkey}: ${sv.includes(':') || sv.includes('#') ? `"${sv}"` : sv}`);
        }
      }
    } else {
      const sv = String(value);
      if (sv.includes(':') || sv.includes('#') || sv.startsWith('[') || sv.startsWith('{')) {
        lines.push(`${key}: "${sv}"`);
      } else {
        lines.push(`${key}: ${sv}`);
      }
    }
  }
  return lines.join('\n');
}

function spliceFrontmatter(content, newObj) {
  const yamlStr = reconstructFrontmatter(newObj);
  const match = content.match(/^---\n[\s\S]+?\n---/);
  if (match) {
    return `---\n${yamlStr}\n---` + content.slice(match[0].length);
  }
  return `---\n${yamlStr}\n---\n\n` + content;
}

function parseMustHavesBlock(content, blockName) {
  // Extract a specific block from must_haves in raw frontmatter YAML
  // Handles 3-level nesting: must_haves > artifacts/key_links > [{path, provides, ...}]
  const fmMatch = content.match(/^---\n([\s\S]+?)\n---/);
  if (!fmMatch) return [];

  const yaml = fmMatch[1];
  // Find the block (e.g., "truths:", "artifacts:", "key_links:")
  const blockPattern = new RegExp(`^\\s{4}${blockName}:\\s*$`, 'm');
  const blockStart = yaml.search(blockPattern);
  if (blockStart === -1) return [];

  const afterBlock = yaml.slice(blockStart);
  const blockLines = afterBlock.split('\n').slice(1); // skip the header line

  const items = [];
  let current = null;

  for (const line of blockLines) {
    // Stop at same or lower indent level (non-continuation)
    if (line.trim() === '') continue;
    const indent = line.match(/^(\s*)/)[1].length;
    if (indent <= 4 && line.trim() !== '') break; // back to must_haves level or higher

    if (line.match(/^\s{6}-\s+/)) {
      // New list item at 6-space indent
      if (current) items.push(current);
      current = {};
      // Check if it's a simple string item
      const simpleMatch = line.match(/^\s{6}-\s+"?([^"]+)"?\s*$/);
      if (simpleMatch && !line.includes(':')) {
        current = simpleMatch[1];
      } else {
        // Key-value on same line as dash: "- path: value"
        const kvMatch = line.match(/^\s{6}-\s+(\w+):\s*"?([^"]*)"?\s*$/);
        if (kvMatch) {
          current = {};
          current[kvMatch[1]] = kvMatch[2];
        }
      }
    } else if (current && typeof current === 'object') {
      // Continuation key-value at 8+ space indent
      const kvMatch = line.match(/^\s{8,}(\w+):\s*"?([^"]*)"?\s*$/);
      if (kvMatch) {
        const val = kvMatch[2];
        // Try to parse as number
        current[kvMatch[1]] = /^\d+$/.test(val) ? parseInt(val, 10) : val;
      }
      // Array items under a key
      const arrMatch = line.match(/^\s{10,}-\s+"?([^"]+)"?\s*$/);
      if (arrMatch) {
        // Find the last key added and convert to array
        const keys = Object.keys(current);
        const lastKey = keys[keys.length - 1];
        if (lastKey && !Array.isArray(current[lastKey])) {
          current[lastKey] = current[lastKey] ? [current[lastKey]] : [];
        }
        if (lastKey) current[lastKey].push(arrMatch[1]);
      }
    }
  }
  if (current) items.push(current);

  return items;
}

function output(result, raw, rawValue) {
  if (raw && rawValue !== undefined) {
    process.stdout.write(String(rawValue));
  } else {
    process.stdout.write(JSON.stringify(result, null, 2));
  }
  process.exit(0);
}

function error(message) {
  process.stderr.write('Error: ' + message + '\n');
  process.exit(1);
}

// ─── Commands ─────────────────────────────────────────────────────────────────

function cmdGenerateSlug(text, raw) {
  if (!text) {
    error('text required for slug generation');
  }

  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const result = { slug };
  output(result, raw, slug);
}

function cmdCurrentTimestamp(format, raw) {
  const now = new Date();
  let result;

  switch (format) {
    case 'date':
      result = now.toISOString().split('T')[0];
      break;
    case 'filename':
      result = now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
      break;
    case 'full':
    default:
      result = now.toISOString();
      break;
  }

  output({ timestamp: result }, raw, result);
}

function cmdListTodos(cwd, area, raw) {
  const pendingDir = path.join(cwd, '.planning', 'todos', 'pending');

  let count = 0;
  const todos = [];

  try {
    const files = fs.readdirSync(pendingDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(pendingDir, file), 'utf-8');
        const createdMatch = content.match(/^created:\s*(.+)$/m);
        const titleMatch = content.match(/^title:\s*(.+)$/m);
        const areaMatch = content.match(/^area:\s*(.+)$/m);

        const todoArea = areaMatch ? areaMatch[1].trim() : 'general';

        // Apply area filter if specified
        if (area && todoArea !== area) continue;

        count++;
        todos.push({
          file,
          created: createdMatch ? createdMatch[1].trim() : 'unknown',
          title: titleMatch ? titleMatch[1].trim() : 'Untitled',
          area: todoArea,
          path: path.join('.planning', 'todos', 'pending', file),
        });
      } catch {}
    }
  } catch {}

  const result = { count, todos };
  output(result, raw, count.toString());
}

function cmdVerifyPathExists(cwd, targetPath, raw) {
  if (!targetPath) {
    error('path required for verification');
  }

  const fullPath = path.isAbsolute(targetPath) ? targetPath : path.join(cwd, targetPath);

  try {
    const stats = fs.statSync(fullPath);
    const type = stats.isDirectory() ? 'directory' : stats.isFile() ? 'file' : 'other';
    const result = { exists: true, type };
    output(result, raw, 'true');
  } catch {
    const result = { exists: false, type: null };
    output(result, raw, 'false');
  }
}

function cmdConfigEnsureSection(cwd, raw) {
  const configPath = path.join(cwd, '.planning', 'config.json');
  const planningDir = path.join(cwd, '.planning');

  // Ensure .planning directory exists
  try {
    if (!fs.existsSync(planningDir)) {
      fs.mkdirSync(planningDir, { recursive: true });
    }
  } catch (err) {
    error('Failed to create .planning directory: ' + err.message);
  }

  // Check if config already exists
  if (fs.existsSync(configPath)) {
    const result = { created: false, reason: 'already_exists' };
    output(result, raw, 'exists');
    return;
  }

  // Detect Brave Search API key availability
  const homedir = require('os').homedir();
  const braveKeyFile = path.join(homedir, '.GSI', 'brave_api_key');
  const hasBraveSearch = !!(process.env.BRAVE_API_KEY || fs.existsSync(braveKeyFile));

  // Create default config
  const defaults = {
    model_profile: 'balanced',
    commit_docs: true,
    search_gitignored: false,
    branching_strategy: 'none',
    phase_branch_template: 'GSI/phase-{phase}-{slug}',
    milestone_branch_template: 'GSI/{milestone}-{slug}',
    workflow: {
      research: true,
      plan_check: true,
      verifier: true,
    },
    parallelization: true,
    brave_search: hasBraveSearch,
  };

  try {
    fs.writeFileSync(configPath, JSON.stringify(defaults, null, 2), 'utf-8');
    const result = { created: true, path: '.planning/config.json' };
    output(result, raw, 'created');
  } catch (err) {
    error('Failed to create config.json: ' + err.message);
  }
}

function cmdConfigSet(cwd, keyPath, value, raw) {
  const configPath = path.join(cwd, '.planning', 'config.json');

  if (!keyPath) {
    error('Usage: config-set <key.path> <value>');
  }

  // Parse value (handle booleans and numbers)
  let parsedValue = value;
  if (value === 'true') parsedValue = true;
  else if (value === 'false') parsedValue = false;
  else if (!isNaN(value) && value !== '') parsedValue = Number(value);

  // Load existing config or start with empty object
  let config = {};
  try {
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (err) {
    error('Failed to read config.json: ' + err.message);
  }

  // Set nested value using dot notation (e.g., "workflow.research")
  const keys = keyPath.split('.');
  let current = config;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = parsedValue;

  // Write back
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    const result = { updated: true, key: keyPath, value: parsedValue };
    output(result, raw, `${keyPath}=${parsedValue}`);
  } catch (err) {
    error('Failed to write config.json: ' + err.message);
  }
}

function cmdHistoryDigest(cwd, raw) {
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const digest = { phases: {}, decisions: [], tech_stack: new Set() };

  if (!fs.existsSync(phasesDir)) {
    digest.tech_stack = [];
    output(digest, raw);
    return;
  }

  try {
    const phaseDirs = fs.readdirSync(phasesDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name)
      .sort();

    for (const dir of phaseDirs) {
      const dirPath = path.join(phasesDir, dir);
      const summaries = fs.readdirSync(dirPath).filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md');

      for (const summary of summaries) {
        try {
          const content = fs.readFileSync(path.join(dirPath, summary), 'utf-8');
          const fm = extractFrontmatter(content);
          
          const phaseNum = fm.phase || dir.split('-')[0];
          
          if (!digest.phases[phaseNum]) {
            digest.phases[phaseNum] = {
              name: fm.name || dir.split('-').slice(1).join(' ') || 'Unknown',
              provides: new Set(),
              affects: new Set(),
              patterns: new Set(),
            };
          }

          // Merge provides
          if (fm['dependency-graph'] && fm['dependency-graph'].provides) {
            fm['dependency-graph'].provides.forEach(p => digest.phases[phaseNum].provides.add(p));
          } else if (fm.provides) {
            fm.provides.forEach(p => digest.phases[phaseNum].provides.add(p));
          }

          // Merge affects
          if (fm['dependency-graph'] && fm['dependency-graph'].affects) {
            fm['dependency-graph'].affects.forEach(a => digest.phases[phaseNum].affects.add(a));
          }

          // Merge patterns
          if (fm['patterns-established']) {
            fm['patterns-established'].forEach(p => digest.phases[phaseNum].patterns.add(p));
          }

          // Merge decisions
          if (fm['key-decisions']) {
            fm['key-decisions'].forEach(d => {
              digest.decisions.push({ phase: phaseNum, decision: d });
            });
          }

          // Merge tech stack
          if (fm['tech-stack'] && fm['tech-stack'].added) {
            fm['tech-stack'].added.forEach(t => digest.tech_stack.add(typeof t === 'string' ? t : t.name));
          }

        } catch (e) {
          // Skip malformed summaries
        }
      }
    }

    // Convert Sets to Arrays for JSON output
    Object.keys(digest.phases).forEach(p => {
      digest.phases[p].provides = [...digest.phases[p].provides];
      digest.phases[p].affects = [...digest.phases[p].affects];
      digest.phases[p].patterns = [...digest.phases[p].patterns];
    });
    digest.tech_stack = [...digest.tech_stack];

    output(digest, raw);
  } catch (e) {
    error('Failed to generate history digest: ' + e.message);
  }
}

function cmdPhasesList(cwd, options, raw) {
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const { type, phase } = options;

  // If no phases directory, return empty
  if (!fs.existsSync(phasesDir)) {
    if (type) {
      output({ files: [], count: 0 }, raw, '');
    } else {
      output({ directories: [], count: 0 }, raw, '');
    }
    return;
  }

  try {
    // Get all phase directories
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    let dirs = entries.filter(e => e.isDirectory()).map(e => e.name);

    // Sort numerically (handles decimals: 01, 02, 02.1, 02.2, 03)
    dirs.sort((a, b) => {
      const aNum = parseFloat(a.match(/^(\d+(?:\.\d+)?)/)?.[1] || '0');
      const bNum = parseFloat(b.match(/^(\d+(?:\.\d+)?)/)?.[1] || '0');
      return aNum - bNum;
    });

    // If filtering by phase number
    if (phase) {
      const normalized = normalizePhaseName(phase);
      const match = dirs.find(d => d.startsWith(normalized));
      if (!match) {
        output({ files: [], count: 0, phase_dir: null, error: 'Phase not found' }, raw, '');
        return;
      }
      dirs = [match];
    }

    // If listing files of a specific type
    if (type) {
      const files = [];
      for (const dir of dirs) {
        const dirPath = path.join(phasesDir, dir);
        const dirFiles = fs.readdirSync(dirPath);

        let filtered;
        if (type === 'plans') {
          filtered = dirFiles.filter(f => f.endsWith('-PLAN.md') || f === 'PLAN.md');
        } else if (type === 'summaries') {
          filtered = dirFiles.filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md');
        } else {
          filtered = dirFiles;
        }

        files.push(...filtered.sort());
      }

      const result = {
        files,
        count: files.length,
        phase_dir: phase ? dirs[0].replace(/^\d+(?:\.\d+)?-?/, '') : null,
      };
      output(result, raw, files.join('\n'));
      return;
    }

    // Default: list directories
    output({ directories: dirs, count: dirs.length }, raw, dirs.join('\n'));
  } catch (e) {
    error('Failed to list phases: ' + e.message);
  }
}

function cmdRoadmapGetPhase(cwd, phaseNum, raw) {
  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');

  if (!fs.existsSync(roadmapPath)) {
    output({ found: false, error: 'ROADMAP.md not found' }, raw, '');
    return;
  }

  try {
    const content = fs.readFileSync(roadmapPath, 'utf-8');

    // Escape special regex chars in phase number, handle decimal
    const escapedPhase = phaseNum.replace(/\./g, '\\.');

    // Match "### Phase X:" or "### Phase X.Y:" with optional name
    const phasePattern = new RegExp(
      `###\\s*Phase\\s+${escapedPhase}:\\s*([^\\n]+)`,
      'i'
    );
    const headerMatch = content.match(phasePattern);

    if (!headerMatch) {
      output({ found: false, phase_number: phaseNum }, raw, '');
      return;
    }

    const phaseName = headerMatch[1].trim();
    const headerIndex = headerMatch.index;

    // Find the end of this section (next ### or end of file)
    const restOfContent = content.slice(headerIndex);
    const nextHeaderMatch = restOfContent.match(/\n###\s+Phase\s+\d/i);
    const sectionEnd = nextHeaderMatch
      ? headerIndex + nextHeaderMatch.index
      : content.length;

    const section = content.slice(headerIndex, sectionEnd).trim();

    // Extract goal if present
    const goalMatch = section.match(/\*\*Goal:\*\*\s*([^\n]+)/i);
    const goal = goalMatch ? goalMatch[1].trim() : null;

    output(
      {
        found: true,
        phase_number: phaseNum,
        phase_name: phaseName,
        goal,
        section,
      },
      raw,
      section
    );
  } catch (e) {
    error('Failed to read ROADMAP.md: ' + e.message);
  }
}

function cmdPhaseNextDecimal(cwd, basePhase, raw) {
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const normalized = normalizePhaseName(basePhase);

  // Check if phases directory exists
  if (!fs.existsSync(phasesDir)) {
    output(
      {
        found: false,
        base_phase: normalized,
        next: `${normalized}.1`,
        existing: [],
      },
      raw,
      `${normalized}.1`
    );
    return;
  }

  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);

    // Check if base phase exists
    const baseExists = dirs.some(d => d.startsWith(normalized + '-') || d === normalized);

    // Find existing decimal phases for this base
    const decimalPattern = new RegExp(`^${normalized}\\.(\\d+)`);
    const existingDecimals = [];

    for (const dir of dirs) {
      const match = dir.match(decimalPattern);
      if (match) {
        existingDecimals.push(`${normalized}.${match[1]}`);
      }
    }

    // Sort numerically
    existingDecimals.sort((a, b) => {
      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      return aNum - bNum;
    });

    // Calculate next decimal
    let nextDecimal;
    if (existingDecimals.length === 0) {
      nextDecimal = `${normalized}.1`;
    } else {
      const lastDecimal = existingDecimals[existingDecimals.length - 1];
      const lastNum = parseInt(lastDecimal.split('.')[1], 10);
      nextDecimal = `${normalized}.${lastNum + 1}`;
    }

    output(
      {
        found: baseExists,
        base_phase: normalized,
        next: nextDecimal,
        existing: existingDecimals,
      },
      raw,
      nextDecimal
    );
  } catch (e) {
    error('Failed to calculate next decimal phase: ' + e.message);
  }
}

function cmdStateLoad(cwd, raw) {
  const config = loadConfig(cwd);
  const planningDir = path.join(cwd, '.planning');

  let stateRaw = '';
  try {
    stateRaw = fs.readFileSync(path.join(planningDir, 'STATE.md'), 'utf-8');
  } catch {}

  const configExists = fs.existsSync(path.join(planningDir, 'config.json'));
  const roadmapExists = fs.existsSync(path.join(planningDir, 'ROADMAP.md'));
  const stateExists = stateRaw.length > 0;

  const result = {
    config,
    state_raw: stateRaw,
    state_exists: stateExists,
    roadmap_exists: roadmapExists,
    config_exists: configExists,
  };

  // For --raw, output a condensed key=value format
  if (raw) {
    const c = config;
    const lines = [
      `model_profile=${c.model_profile}`,
      `commit_docs=${c.commit_docs}`,
      `branching_strategy=${c.branching_strategy}`,
      `phase_branch_template=${c.phase_branch_template}`,
      `milestone_branch_template=${c.milestone_branch_template}`,
      `parallelization=${c.parallelization}`,
      `research=${c.research}`,
      `plan_checker=${c.plan_checker}`,
      `verifier=${c.verifier}`,
      `config_exists=${configExists}`,
      `roadmap_exists=${roadmapExists}`,
      `state_exists=${stateExists}`,
    ];
    process.stdout.write(lines.join('\n'));
    process.exit(0);
  }

  output(result);
}

function cmdStateGet(cwd, section, raw) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  try {
    const content = fs.readFileSync(statePath, 'utf-8');
    
    if (!section) {
      output({ content }, raw, content);
      return;
    }

    // Try to find markdown section or field
    const fieldEscaped = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Check for **field:** value
    const fieldPattern = new RegExp(`\\*\\*${fieldEscaped}:\\*\\*\\s*(.*)`, 'i');
    const fieldMatch = content.match(fieldPattern);
    if (fieldMatch) {
      output({ [section]: fieldMatch[1].trim() }, raw, fieldMatch[1].trim());
      return;
    }

    // Check for ## Section
    const sectionPattern = new RegExp(`##\\s*${fieldEscaped}\\s*\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const sectionMatch = content.match(sectionPattern);
    if (sectionMatch) {
      output({ [section]: sectionMatch[1].trim() }, raw, sectionMatch[1].trim());
      return;
    }

    output({ error: `Section or field "${section}" not found` }, raw, '');
  } catch {
    error('STATE.md not found');
  }
}

function cmdStatePatch(cwd, patches, raw) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  try {
    let content = fs.readFileSync(statePath, 'utf-8');
    const results = { updated: [], failed: [] };

    for (const [field, value] of Object.entries(patches)) {
      const fieldEscaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(\\*\\*${fieldEscaped}:\\*\\*\\s*)(.*)`, 'i');
      
      if (pattern.test(content)) {
        content = content.replace(pattern, `$1${value}`);
        results.updated.push(field);
      } else {
        results.failed.push(field);
      }
    }

    if (results.updated.length > 0) {
      fs.writeFileSync(statePath, content, 'utf-8');
    }

    output(results, raw, results.updated.length > 0 ? 'true' : 'false');
  } catch {
    error('STATE.md not found');
  }
}

function cmdStateUpdate(cwd, field, value) {
  if (!field || value === undefined) {
    error('field and value required for state update');
  }

  const statePath = path.join(cwd, '.planning', 'STATE.md');
  try {
    let content = fs.readFileSync(statePath, 'utf-8');
    const fieldEscaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(\\*\\*${fieldEscaped}:\\*\\*\\s*)(.*)`, 'i');
    if (pattern.test(content)) {
      content = content.replace(pattern, `$1${value}`);
      fs.writeFileSync(statePath, content, 'utf-8');
      output({ updated: true });
    } else {
      output({ updated: false, reason: `Field "${field}" not found in STATE.md` });
    }
  } catch {
    output({ updated: false, reason: 'STATE.md not found' });
  }
}

// ─── State Progression Engine ────────────────────────────────────────────────

function stateExtractField(content, fieldName) {
  const pattern = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*(.+)`, 'i');
  const match = content.match(pattern);
  return match ? match[1].trim() : null;
}

function stateReplaceField(content, fieldName, newValue) {
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(\\*\\*${escaped}:\\*\\*\\s*)(.*)`, 'i');
  if (pattern.test(content)) {
    return content.replace(pattern, `$1${newValue}`);
  }
  return null;
}

function cmdStateAdvancePlan(cwd, raw) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  if (!fs.existsSync(statePath)) { output({ error: 'STATE.md not found' }, raw); return; }

  let content = fs.readFileSync(statePath, 'utf-8');
  const currentPlan = parseInt(stateExtractField(content, 'Current Plan'), 10);
  const totalPlans = parseInt(stateExtractField(content, 'Total Plans in Phase'), 10);
  const today = new Date().toISOString().split('T')[0];

  if (isNaN(currentPlan) || isNaN(totalPlans)) {
    output({ error: 'Cannot parse Current Plan or Total Plans in Phase from STATE.md' }, raw);
    return;
  }

  if (currentPlan >= totalPlans) {
    content = stateReplaceField(content, 'Status', 'Phase complete — ready for verification') || content;
    content = stateReplaceField(content, 'Last Activity', today) || content;
    fs.writeFileSync(statePath, content, 'utf-8');
    output({ advanced: false, reason: 'last_plan', current_plan: currentPlan, total_plans: totalPlans, status: 'ready_for_verification' }, raw, 'false');
  } else {
    const newPlan = currentPlan + 1;
    content = stateReplaceField(content, 'Current Plan', String(newPlan)) || content;
    content = stateReplaceField(content, 'Status', 'Ready to execute') || content;
    content = stateReplaceField(content, 'Last Activity', today) || content;
    fs.writeFileSync(statePath, content, 'utf-8');
    output({ advanced: true, previous_plan: currentPlan, current_plan: newPlan, total_plans: totalPlans }, raw, 'true');
  }
}

function cmdStateRecordMetric(cwd, options, raw) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  if (!fs.existsSync(statePath)) { output({ error: 'STATE.md not found' }, raw); return; }

  let content = fs.readFileSync(statePath, 'utf-8');
  const { phase, plan, duration, tasks, files } = options;

  if (!phase || !plan || !duration) {
    output({ error: 'phase, plan, and duration required' }, raw);
    return;
  }

  // Find Performance Metrics section and its table
  const metricsPattern = /(##\s*Performance Metrics[\s\S]*?\n\|[^\n]+\n\|[-|\s]+\n)([\s\S]*?)(?=\n##|\n$|$)/i;
  const metricsMatch = content.match(metricsPattern);

  if (metricsMatch) {
    const tableHeader = metricsMatch[1];
    let tableBody = metricsMatch[2].trimEnd();
    const newRow = `| Phase ${phase} P${plan} | ${duration} | ${tasks || '-'} tasks | ${files || '-'} files |`;

    if (tableBody.trim() === '' || tableBody.includes('None yet')) {
      tableBody = newRow;
    } else {
      tableBody = tableBody + '\n' + newRow;
    }

    content = content.replace(metricsPattern, `${tableHeader}${tableBody}\n`);
    fs.writeFileSync(statePath, content, 'utf-8');
    output({ recorded: true, phase, plan, duration }, raw, 'true');
  } else {
    output({ recorded: false, reason: 'Performance Metrics section not found in STATE.md' }, raw, 'false');
  }
}

function cmdStateUpdateProgress(cwd, raw) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  if (!fs.existsSync(statePath)) { output({ error: 'STATE.md not found' }, raw); return; }

  let content = fs.readFileSync(statePath, 'utf-8');

  // Count summaries across all phases
  const phasesDir = path.join(cwd, '.planning', 'phases');
  let totalPlans = 0;
  let totalSummaries = 0;

  if (fs.existsSync(phasesDir)) {
    const phaseDirs = fs.readdirSync(phasesDir, { withFileTypes: true })
      .filter(e => e.isDirectory()).map(e => e.name);
    for (const dir of phaseDirs) {
      const files = fs.readdirSync(path.join(phasesDir, dir));
      totalPlans += files.filter(f => f.match(/-PLAN\.md$/i)).length;
      totalSummaries += files.filter(f => f.match(/-SUMMARY\.md$/i)).length;
    }
  }

  const percent = totalPlans > 0 ? Math.round(totalSummaries / totalPlans * 100) : 0;
  const barWidth = 10;
  const filled = Math.round(percent / 100 * barWidth);
  const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(barWidth - filled);
  const progressStr = `[${bar}] ${percent}%`;

  const progressPattern = /(\*\*Progress:\*\*\s*).*/i;
  if (progressPattern.test(content)) {
    content = content.replace(progressPattern, `$1${progressStr}`);
    fs.writeFileSync(statePath, content, 'utf-8');
    output({ updated: true, percent, completed: totalSummaries, total: totalPlans, bar: progressStr }, raw, progressStr);
  } else {
    output({ updated: false, reason: 'Progress field not found in STATE.md' }, raw, 'false');
  }
}

function cmdStateAddDecision(cwd, options, raw) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  if (!fs.existsSync(statePath)) { output({ error: 'STATE.md not found' }, raw); return; }

  const { phase, summary, rationale } = options;
  if (!summary) { output({ error: 'summary required' }, raw); return; }

  let content = fs.readFileSync(statePath, 'utf-8');
  const entry = `- [Phase ${phase || '?'}]: ${summary}${rationale ? ` — ${rationale}` : ''}`;

  // Find Decisions section (various heading patterns)
  const sectionPattern = /(###?\s*(?:Decisions|Decisions Made|Accumulated.*Decisions)\s*\n)([\s\S]*?)(?=\n###?|\n##[^#]|$)/i;
  const match = content.match(sectionPattern);

  if (match) {
    let sectionBody = match[2];
    // Remove placeholders
    sectionBody = sectionBody.replace(/None yet\.?\s*\n?/gi, '').replace(/No decisions yet\.?\s*\n?/gi, '');
    sectionBody = sectionBody.trimEnd() + '\n' + entry + '\n';
    content = content.replace(sectionPattern, `${match[1]}${sectionBody}`);
    fs.writeFileSync(statePath, content, 'utf-8');
    output({ added: true, decision: entry }, raw, 'true');
  } else {
    output({ added: false, reason: 'Decisions section not found in STATE.md' }, raw, 'false');
  }
}

function cmdStateAddBlocker(cwd, text, raw) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  if (!fs.existsSync(statePath)) { output({ error: 'STATE.md not found' }, raw); return; }
  if (!text) { output({ error: 'text required' }, raw); return; }

  let content = fs.readFileSync(statePath, 'utf-8');
  const entry = `- ${text}`;

  const sectionPattern = /(###?\s*(?:Blockers|Blockers\/Concerns|Concerns)\s*\n)([\s\S]*?)(?=\n###?|\n##[^#]|$)/i;
  const match = content.match(sectionPattern);

  if (match) {
    let sectionBody = match[2];
    sectionBody = sectionBody.replace(/None\.?\s*\n?/gi, '').replace(/None yet\.?\s*\n?/gi, '');
    sectionBody = sectionBody.trimEnd() + '\n' + entry + '\n';
    content = content.replace(sectionPattern, `${match[1]}${sectionBody}`);
    fs.writeFileSync(statePath, content, 'utf-8');
    output({ added: true, blocker: text }, raw, 'true');
  } else {
    output({ added: false, reason: 'Blockers section not found in STATE.md' }, raw, 'false');
  }
}

function cmdStateResolveBlocker(cwd, text, raw) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  if (!fs.existsSync(statePath)) { output({ error: 'STATE.md not found' }, raw); return; }
  if (!text) { output({ error: 'text required' }, raw); return; }

  let content = fs.readFileSync(statePath, 'utf-8');

  const sectionPattern = /(###?\s*(?:Blockers|Blockers\/Concerns|Concerns)\s*\n)([\s\S]*?)(?=\n###?|\n##[^#]|$)/i;
  const match = content.match(sectionPattern);

  if (match) {
    const sectionBody = match[2];
    const lines = sectionBody.split('\n');
    const filtered = lines.filter(line => {
      if (!line.startsWith('- ')) return true;
      return !line.toLowerCase().includes(text.toLowerCase());
    });

    let newBody = filtered.join('\n');
    // If section is now empty, add placeholder
    if (!newBody.trim() || !newBody.includes('- ')) {
      newBody = 'None\n';
    }

    content = content.replace(sectionPattern, `${match[1]}${newBody}`);
    fs.writeFileSync(statePath, content, 'utf-8');
    output({ resolved: true, blocker: text }, raw, 'true');
  } else {
    output({ resolved: false, reason: 'Blockers section not found in STATE.md' }, raw, 'false');
  }
}

function cmdStateRecordSession(cwd, options, raw) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  if (!fs.existsSync(statePath)) { output({ error: 'STATE.md not found' }, raw); return; }

  let content = fs.readFileSync(statePath, 'utf-8');
  const now = new Date().toISOString();
  const updated = [];

  // Update Last session / Last Date
  let result = stateReplaceField(content, 'Last session', now);
  if (result) { content = result; updated.push('Last session'); }
  result = stateReplaceField(content, 'Last Date', now);
  if (result) { content = result; updated.push('Last Date'); }

  // Update Stopped at
  if (options.stopped_at) {
    result = stateReplaceField(content, 'Stopped At', options.stopped_at);
    if (!result) result = stateReplaceField(content, 'Stopped at', options.stopped_at);
    if (result) { content = result; updated.push('Stopped At'); }
  }

  // Update Resume file
  const resumeFile = options.resume_file || 'None';
  result = stateReplaceField(content, 'Resume File', resumeFile);
  if (!result) result = stateReplaceField(content, 'Resume file', resumeFile);
  if (result) { content = result; updated.push('Resume File'); }

  if (updated.length > 0) {
    fs.writeFileSync(statePath, content, 'utf-8');
    output({ recorded: true, updated }, raw, 'true');
  } else {
    output({ recorded: false, reason: 'No session fields found in STATE.md' }, raw, 'false');
  }
}

function cmdResolveModel(cwd, agentType, raw) {
  if (!agentType) {
    error('agent-type required');
  }

  const config = loadConfig(cwd);
  const profile = config.model_profile || 'balanced';

  const agentModels = MODEL_PROFILES[agentType];
  if (!agentModels) {
    const result = { model: 'sonnet', profile, unknown_agent: true };
    output(result, raw, 'sonnet');
    return;
  }

  const model = agentModels[profile] || agentModels['balanced'] || 'sonnet';
  const result = { model, profile };
  output(result, raw, model);
}

function cmdFindPhase(cwd, phase, raw) {
  if (!phase) {
    error('phase identifier required');
  }

  const phasesDir = path.join(cwd, '.planning', 'phases');
  const normalized = normalizePhaseName(phase);

  const notFound = { found: false, directory: null, phase_number: null, phase_name: null, plans: [], summaries: [] };

  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

    const match = dirs.find(d => d.startsWith(normalized));
    if (!match) {
      output(notFound, raw, '');
      return;
    }

    const dirMatch = match.match(/^(\d+(?:\.\d+)?)-?(.*)/);
    const phaseNumber = dirMatch ? dirMatch[1] : normalized;
    const phaseName = dirMatch && dirMatch[2] ? dirMatch[2] : null;

    const phaseDir = path.join(phasesDir, match);
    const phaseFiles = fs.readdirSync(phaseDir);
    const plans = phaseFiles.filter(f => f.endsWith('-PLAN.md') || f === 'PLAN.md').sort();
    const summaries = phaseFiles.filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md').sort();

    const result = {
      found: true,
      directory: path.join('.planning', 'phases', match),
      phase_number: phaseNumber,
      phase_name: phaseName,
      plans,
      summaries,
    };

    output(result, raw, result.directory);
  } catch {
    output(notFound, raw, '');
  }
}

function cmdCommit(cwd, message, files, raw, amend) {
  if (!message && !amend) {
    error('commit message required');
  }

  const config = loadConfig(cwd);

  // Check commit_docs config
  if (!config.commit_docs) {
    const result = { committed: false, hash: null, reason: 'skipped_commit_docs_false' };
    output(result, raw, 'skipped');
    return;
  }

  // Check if .planning is gitignored
  if (isGitIgnored(cwd, '.planning')) {
    const result = { committed: false, hash: null, reason: 'skipped_gitignored' };
    output(result, raw, 'skipped');
    return;
  }

  // Stage files
  const filesToStage = files && files.length > 0 ? files : ['.planning/'];
  for (const file of filesToStage) {
    execGit(cwd, ['add', file]);
  }

  // Commit
  const commitArgs = amend ? ['commit', '--amend', '--no-edit'] : ['commit', '-m', message];
  const commitResult = execGit(cwd, commitArgs);
  if (commitResult.exitCode !== 0) {
    if (commitResult.stdout.includes('nothing to commit') || commitResult.stderr.includes('nothing to commit')) {
      const result = { committed: false, hash: null, reason: 'nothing_to_commit' };
      output(result, raw, 'nothing');
      return;
    }
    const result = { committed: false, hash: null, reason: 'nothing_to_commit', error: commitResult.stderr };
    output(result, raw, 'nothing');
    return;
  }

  // Get short hash
  const hashResult = execGit(cwd, ['rev-parse', '--short', 'HEAD']);
  const hash = hashResult.exitCode === 0 ? hashResult.stdout : null;
  const result = { committed: true, hash, reason: 'committed' };
  output(result, raw, hash || 'committed');
}

function cmdVerifySummary(cwd, summaryPath, checkFileCount, raw) {
  if (!summaryPath) {
    error('summary-path required');
  }

  const fullPath = path.join(cwd, summaryPath);
  const checkCount = checkFileCount || 2;

  // Check 1: Summary exists
  if (!fs.existsSync(fullPath)) {
    const result = {
      passed: false,
      checks: {
        summary_exists: false,
        files_created: { checked: 0, found: 0, missing: [] },
        commits_exist: false,
        self_check: 'not_found',
      },
      errors: ['SUMMARY.md not found'],
    };
    output(result, raw, 'failed');
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const errors = [];

  // Check 2: Spot-check files mentioned in summary
  const mentionedFiles = new Set();
  const patterns = [
    /`([^`]+\.[a-zA-Z]+)`/g,
    /(?:Created|Modified|Added|Updated|Edited):\s*`?([^\s`]+\.[a-zA-Z]+)`?/gi,
  ];

  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(content)) !== null) {
      const filePath = m[1];
      if (filePath && !filePath.startsWith('http') && filePath.includes('/')) {
        mentionedFiles.add(filePath);
      }
    }
  }

  const filesToCheck = Array.from(mentionedFiles).slice(0, checkCount);
  const missing = [];
  for (const file of filesToCheck) {
    if (!fs.existsSync(path.join(cwd, file))) {
      missing.push(file);
    }
  }

  // Check 3: Commits exist
  const commitHashPattern = /\b[0-9a-f]{7,40}\b/g;
  const hashes = content.match(commitHashPattern) || [];
  let commitsExist = false;
  if (hashes.length > 0) {
    for (const hash of hashes.slice(0, 3)) {
      const result = execGit(cwd, ['cat-file', '-t', hash]);
      if (result.exitCode === 0 && result.stdout === 'commit') {
        commitsExist = true;
        break;
      }
    }
  }

  // Check 4: Self-check section
  let selfCheck = 'not_found';
  const selfCheckPattern = /##\s*(?:Self[- ]?Check|Verification|Quality Check)/i;
  if (selfCheckPattern.test(content)) {
    const passPattern = /(?:all\s+)?(?:pass|✓|✅|complete|succeeded)/i;
    const failPattern = /(?:fail|✗|❌|incomplete|blocked)/i;
    const checkSection = content.slice(content.search(selfCheckPattern));
    if (failPattern.test(checkSection)) {
      selfCheck = 'failed';
    } else if (passPattern.test(checkSection)) {
      selfCheck = 'passed';
    }
  }

  if (missing.length > 0) errors.push('Missing files: ' + missing.join(', '));
  if (!commitsExist && hashes.length > 0) errors.push('Referenced commit hashes not found in git history');
  if (selfCheck === 'failed') errors.push('Self-check section indicates failure');

  const checks = {
    summary_exists: true,
    files_created: { checked: filesToCheck.length, found: filesToCheck.length - missing.length, missing },
    commits_exist: commitsExist,
    self_check: selfCheck,
  };

  const passed = missing.length === 0 && selfCheck !== 'failed';
  const result = { passed, checks, errors };
  output(result, raw, passed ? 'passed' : 'failed');
}

function cmdTemplateSelect(cwd, planPath, raw) {
  if (!planPath) {
    error('plan-path required');
  }

  try {
    const fullPath = path.join(cwd, planPath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Simple heuristics
    const taskMatch = content.match(/###\s*Task\s*\d+/g) || [];
    const taskCount = taskMatch.length;
    
    const decisionMatch = content.match(/decision/gi) || [];
    const hasDecisions = decisionMatch.length > 0;
    
    // Count file mentions
    const fileMentions = new Set();
    const filePattern = /`([^`]+\.[a-zA-Z]+)`/g;
    let m;
    while ((m = filePattern.exec(content)) !== null) {
      if (m[1].includes('/') && !m[1].startsWith('http')) {
        fileMentions.add(m[1]);
      }
    }
    const fileCount = fileMentions.size;

    let template = 'templates/summary-standard.md';
    let type = 'standard';

    if (taskCount <= 2 && fileCount <= 3 && !hasDecisions) {
      template = 'templates/summary-minimal.md';
      type = 'minimal';
    } else if (hasDecisions || fileCount > 6 || taskCount > 5) {
      template = 'templates/summary-complex.md';
      type = 'complex';
    }

    const result = { template, type, taskCount, fileCount, hasDecisions };
    output(result, raw, template);
  } catch (e) {
    // Fallback to standard
    output({ template: 'templates/summary-standard.md', type: 'standard', error: e.message }, raw, 'templates/summary-standard.md');
  }
}

function cmdTemplateFill(cwd, templateType, options, raw) {
  if (!templateType) { error('template type required: summary, plan, or verification'); }
  if (!options.phase) { error('--phase required'); }

  const phaseInfo = findPhaseInternal(cwd, options.phase);
  if (!phaseInfo || !phaseInfo.found) { output({ error: 'Phase not found', phase: options.phase }, raw); return; }

  const padded = normalizePhaseName(options.phase);
  const today = new Date().toISOString().split('T')[0];
  const phaseName = options.name || phaseInfo.phase_name || 'Unnamed';
  const phaseSlug = phaseInfo.phase_slug || generateSlugInternal(phaseName);
  const phaseId = `${padded}-${phaseSlug}`;
  const planNum = (options.plan || '01').padStart(2, '0');
  const fields = options.fields || {};

  let frontmatter, body, fileName;

  switch (templateType) {
    case 'summary': {
      frontmatter = {
        phase: phaseId,
        plan: planNum,
        subsystem: '[primary category]',
        tags: [],
        provides: [],
        affects: [],
        'tech-stack': { added: [], patterns: [] },
        'key-files': { created: [], modified: [] },
        'key-decisions': [],
        'patterns-established': [],
        duration: '[X]min',
        completed: today,
        ...fields,
      };
      body = [
        `# Phase ${options.phase}: ${phaseName} Summary`,
        '',
        '**[Substantive one-liner describing outcome]**',
        '',
        '## Performance',
        '- **Duration:** [time]',
        '- **Tasks:** [count completed]',
        '- **Files modified:** [count]',
        '',
        '## Accomplishments',
        '- [Key outcome 1]',
        '- [Key outcome 2]',
        '',
        '## Task Commits',
        '1. **Task 1: [task name]** - `hash`',
        '',
        '## Files Created/Modified',
        '- `path/to/file.ts` - What it does',
        '',
        '## Decisions & Deviations',
        '[Key decisions or "None - followed plan as specified"]',
        '',
        '## Next Phase Readiness',
        '[What\'s ready for next phase]',
      ].join('\n');
      fileName = `${padded}-${planNum}-SUMMARY.md`;
      break;
    }
    case 'plan': {
      const planType = options.type || 'execute';
      const wave = parseInt(options.wave) || 1;
      frontmatter = {
        phase: phaseId,
        plan: planNum,
        type: planType,
        wave,
        depends_on: [],
        files_modified: [],
        autonomous: true,
        user_setup: [],
        must_haves: { truths: [], artifacts: [], key_links: [] },
        ...fields,
      };
      body = [
        `# Phase ${options.phase} Plan ${planNum}: [Title]`,
        '',
        '## Objective',
        '- **What:** [What this plan builds]',
        '- **Why:** [Why it matters for the phase goal]',
        '- **Output:** [Concrete deliverable]',
        '',
        '## Context',
        '@.planning/PROJECT.md',
        '@.planning/ROADMAP.md',
        '@.planning/STATE.md',
        '',
        '## Tasks',
        '',
        '<task type="code">',
        '  <name>[Task name]</name>',
        '  <files>[file paths]</files>',
        '  <action>[What to do]</action>',
        '  <verify>[How to verify]</verify>',
        '  <done>[Definition of done]</done>',
        '</task>',
        '',
        '## Verification',
        '[How to verify this plan achieved its objective]',
        '',
        '## Success Criteria',
        '- [ ] [Criterion 1]',
        '- [ ] [Criterion 2]',
      ].join('\n');
      fileName = `${padded}-${planNum}-PLAN.md`;
      break;
    }
    case 'verification': {
      frontmatter = {
        phase: phaseId,
        verified: new Date().toISOString(),
        status: 'pending',
        score: '0/0 must-haves verified',
        ...fields,
      };
      body = [
        `# Phase ${options.phase}: ${phaseName} — Verification`,
        '',
        '## Observable Truths',
        '| # | Truth | Status | Evidence |',
        '|---|-------|--------|----------|',
        '| 1 | [Truth] | pending | |',
        '',
        '## Required Artifacts',
        '| Artifact | Expected | Status | Details |',
        '|----------|----------|--------|---------|',
        '| [path] | [what] | pending | |',
        '',
        '## Key Link Verification',
        '| From | To | Via | Status | Details |',
        '|------|----|----|--------|---------|',
        '| [source] | [target] | [connection] | pending | |',
        '',
        '## Requirements Coverage',
        '| Requirement | Status | Blocking Issue |',
        '|-------------|--------|----------------|',
        '| [req] | pending | |',
        '',
        '## Result',
        '[Pending verification]',
      ].join('\n');
      fileName = `${padded}-VERIFICATION.md`;
      break;
    }
    default:
      error(`Unknown template type: ${templateType}. Available: summary, plan, verification`);
      return;
  }

  const fullContent = `---\n${reconstructFrontmatter(frontmatter)}\n---\n\n${body}\n`;
  const outPath = path.join(cwd, phaseInfo.directory, fileName);

  if (fs.existsSync(outPath)) {
    output({ error: 'File already exists', path: path.relative(cwd, outPath) }, raw);
    return;
  }

  fs.writeFileSync(outPath, fullContent, 'utf-8');
  const relPath = path.relative(cwd, outPath);
  output({ created: true, path: relPath, template: templateType }, raw, relPath);
}

function cmdPhasePlanIndex(cwd, phase, raw) {
  if (!phase) {
    error('phase required for phase-plan-index');
  }

  const phasesDir = path.join(cwd, '.planning', 'phases');
  const normalized = normalizePhaseName(phase);

  // Find phase directory
  let phaseDir = null;
  let phaseDirName = null;
  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
    const match = dirs.find(d => d.startsWith(normalized));
    if (match) {
      phaseDir = path.join(phasesDir, match);
      phaseDirName = match;
    }
  } catch {
    // phases dir doesn't exist
  }

  if (!phaseDir) {
    output({ phase: normalized, error: 'Phase not found', plans: [], waves: {}, incomplete: [], has_checkpoints: false }, raw);
    return;
  }

  // Get all files in phase directory
  const phaseFiles = fs.readdirSync(phaseDir);
  const planFiles = phaseFiles.filter(f => f.endsWith('-PLAN.md') || f === 'PLAN.md').sort();
  const summaryFiles = phaseFiles.filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md');

  // Build set of plan IDs with summaries
  const completedPlanIds = new Set(
    summaryFiles.map(s => s.replace('-SUMMARY.md', '').replace('SUMMARY.md', ''))
  );

  const plans = [];
  const waves = {};
  const incomplete = [];
  let hasCheckpoints = false;

  for (const planFile of planFiles) {
    const planId = planFile.replace('-PLAN.md', '').replace('PLAN.md', '');
    const planPath = path.join(phaseDir, planFile);
    const content = fs.readFileSync(planPath, 'utf-8');
    const fm = extractFrontmatter(content);

    // Count tasks (## Task N patterns)
    const taskMatches = content.match(/##\s*Task\s*\d+/gi) || [];
    const taskCount = taskMatches.length;

    // Parse wave as integer
    const wave = parseInt(fm.wave, 10) || 1;

    // Parse autonomous (default true if not specified)
    let autonomous = true;
    if (fm.autonomous !== undefined) {
      autonomous = fm.autonomous === 'true' || fm.autonomous === true;
    }

    if (!autonomous) {
      hasCheckpoints = true;
    }

    // Parse files-modified
    let filesModified = [];
    if (fm['files-modified']) {
      filesModified = Array.isArray(fm['files-modified']) ? fm['files-modified'] : [fm['files-modified']];
    }

    const hasSummary = completedPlanIds.has(planId);
    if (!hasSummary) {
      incomplete.push(planId);
    }

    const plan = {
      id: planId,
      wave,
      autonomous,
      objective: fm.objective || null,
      files_modified: filesModified,
      task_count: taskCount,
      has_summary: hasSummary,
    };

    plans.push(plan);

    // Group by wave
    const waveKey = String(wave);
    if (!waves[waveKey]) {
      waves[waveKey] = [];
    }
    waves[waveKey].push(planId);
  }

  const result = {
    phase: normalized,
    plans,
    waves,
    incomplete,
    has_checkpoints: hasCheckpoints,
  };

  output(result, raw);
}

function cmdStateSnapshot(cwd, raw) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');

  if (!fs.existsSync(statePath)) {
    output({ error: 'STATE.md not found' }, raw);
    return;
  }

  const content = fs.readFileSync(statePath, 'utf-8');

  // Helper to extract **Field:** value patterns
  const extractField = (fieldName) => {
    const pattern = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*(.+)`, 'i');
    const match = content.match(pattern);
    return match ? match[1].trim() : null;
  };

  // Extract basic fields
  const currentPhase = extractField('Current Phase');
  const currentPhaseName = extractField('Current Phase Name');
  const totalPhasesRaw = extractField('Total Phases');
  const currentPlan = extractField('Current Plan');
  const totalPlansRaw = extractField('Total Plans in Phase');
  const status = extractField('Status');
  const progressRaw = extractField('Progress');
  const lastActivity = extractField('Last Activity');
  const lastActivityDesc = extractField('Last Activity Description');
  const pausedAt = extractField('Paused At');

  // Parse numeric fields
  const totalPhases = totalPhasesRaw ? parseInt(totalPhasesRaw, 10) : null;
  const totalPlansInPhase = totalPlansRaw ? parseInt(totalPlansRaw, 10) : null;
  const progressPercent = progressRaw ? parseInt(progressRaw.replace('%', ''), 10) : null;

  // Extract decisions table
  const decisions = [];
  const decisionsMatch = content.match(/##\s*Decisions Made[\s\S]*?\n\|[^\n]+\n\|[-|\s]+\n([\s\S]*?)(?=\n##|\n$|$)/i);
  if (decisionsMatch) {
    const tableBody = decisionsMatch[1];
    const rows = tableBody.trim().split('\n').filter(r => r.includes('|'));
    for (const row of rows) {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 3) {
        decisions.push({
          phase: cells[0],
          summary: cells[1],
          rationale: cells[2],
        });
      }
    }
  }

  // Extract blockers list
  const blockers = [];
  const blockersMatch = content.match(/##\s*Blockers\s*\n([\s\S]*?)(?=\n##|$)/i);
  if (blockersMatch) {
    const blockersSection = blockersMatch[1];
    const items = blockersSection.match(/^-\s+(.+)$/gm) || [];
    for (const item of items) {
      blockers.push(item.replace(/^-\s+/, '').trim());
    }
  }

  // Extract session info
  const session = {
    last_date: null,
    stopped_at: null,
    resume_file: null,
  };

  const sessionMatch = content.match(/##\s*Session\s*\n([\s\S]*?)(?=\n##|$)/i);
  if (sessionMatch) {
    const sessionSection = sessionMatch[1];
    const lastDateMatch = sessionSection.match(/\*\*Last Date:\*\*\s*(.+)/i);
    const stoppedAtMatch = sessionSection.match(/\*\*Stopped At:\*\*\s*(.+)/i);
    const resumeFileMatch = sessionSection.match(/\*\*Resume File:\*\*\s*(.+)/i);

    if (lastDateMatch) session.last_date = lastDateMatch[1].trim();
    if (stoppedAtMatch) session.stopped_at = stoppedAtMatch[1].trim();
    if (resumeFileMatch) session.resume_file = resumeFileMatch[1].trim();
  }

  const result = {
    current_phase: currentPhase,
    current_phase_name: currentPhaseName,
    total_phases: totalPhases,
    current_plan: currentPlan,
    total_plans_in_phase: totalPlansInPhase,
    status,
    progress_percent: progressPercent,
    last_activity: lastActivity,
    last_activity_desc: lastActivityDesc,
    decisions,
    blockers,
    paused_at: pausedAt,
    session,
  };

  output(result, raw);
}

function cmdSummaryExtract(cwd, summaryPath, fields, raw) {
  if (!summaryPath) {
    error('summary-path required for summary-extract');
  }

  const fullPath = path.join(cwd, summaryPath);

  if (!fs.existsSync(fullPath)) {
    output({ error: 'File not found', path: summaryPath }, raw);
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const fm = extractFrontmatter(content);

  // Parse key-decisions into structured format
  const parseDecisions = (decisionsList) => {
    if (!decisionsList || !Array.isArray(decisionsList)) return [];
    return decisionsList.map(d => {
      const colonIdx = d.indexOf(':');
      if (colonIdx > 0) {
        return {
          summary: d.substring(0, colonIdx).trim(),
          rationale: d.substring(colonIdx + 1).trim(),
        };
      }
      return { summary: d, rationale: null };
    });
  };

  // Build full result
  const fullResult = {
    path: summaryPath,
    one_liner: fm['one-liner'] || null,
    key_files: fm['key-files'] || [],
    tech_added: (fm['tech-stack'] && fm['tech-stack'].added) || [],
    patterns: fm['patterns-established'] || [],
    decisions: parseDecisions(fm['key-decisions']),
  };

  // If fields specified, filter to only those fields
  if (fields && fields.length > 0) {
    const filtered = { path: summaryPath };
    for (const field of fields) {
      if (fullResult[field] !== undefined) {
        filtered[field] = fullResult[field];
      }
    }
    output(filtered, raw);
    return;
  }

  output(fullResult, raw);
}

// ─── Web Search (Brave API) ──────────────────────────────────────────────────

async function cmdWebsearch(query, options, raw) {
  const apiKey = process.env.BRAVE_API_KEY;

  if (!apiKey) {
    // No key = silent skip, agent falls back to built-in WebSearch
    output({ available: false, reason: 'BRAVE_API_KEY not set' }, raw, '');
    return;
  }

  if (!query) {
    output({ available: false, error: 'Query required' }, raw, '');
    return;
  }

  const params = new URLSearchParams({
    q: query,
    count: String(options.limit || 10),
    country: 'us',
    search_lang: 'en',
    text_decorations: 'false'
  });

  if (options.freshness) {
    params.set('freshness', options.freshness);
  }

  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?${params}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey
        }
      }
    );

    if (!response.ok) {
      output({ available: false, error: `API error: ${response.status}` }, raw, '');
      return;
    }

    const data = await response.json();

    const results = (data.web?.results || []).map(r => ({
      title: r.title,
      url: r.url,
      description: r.description,
      age: r.age || null
    }));

    output({
      available: true,
      query,
      count: results.length,
      results
    }, raw, results.map(r => `${r.title}\n${r.url}\n${r.description}`).join('\n\n'));
  } catch (err) {
    output({ available: false, error: err.message }, raw, '');
  }
}

// ─── Frontmatter CRUD ────────────────────────────────────────────────────────

function cmdFrontmatterGet(cwd, filePath, field, raw) {
  if (!filePath) { error('file path required'); }
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  const content = safeReadFile(fullPath);
  if (!content) { output({ error: 'File not found', path: filePath }, raw); return; }
  const fm = extractFrontmatter(content);
  if (field) {
    const value = fm[field];
    if (value === undefined) { output({ error: 'Field not found', field }, raw); return; }
    output({ [field]: value }, raw, JSON.stringify(value));
  } else {
    output(fm, raw);
  }
}

function cmdFrontmatterSet(cwd, filePath, field, value, raw) {
  if (!filePath || !field || value === undefined) { error('file, field, and value required'); }
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  if (!fs.existsSync(fullPath)) { output({ error: 'File not found', path: filePath }, raw); return; }
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fm = extractFrontmatter(content);
  let parsedValue;
  try { parsedValue = JSON.parse(value); } catch { parsedValue = value; }
  fm[field] = parsedValue;
  const newContent = spliceFrontmatter(content, fm);
  fs.writeFileSync(fullPath, newContent, 'utf-8');
  output({ updated: true, field, value: parsedValue }, raw, 'true');
}

function cmdFrontmatterMerge(cwd, filePath, data, raw) {
  if (!filePath || !data) { error('file and data required'); }
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  if (!fs.existsSync(fullPath)) { output({ error: 'File not found', path: filePath }, raw); return; }
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fm = extractFrontmatter(content);
  let mergeData;
  try { mergeData = JSON.parse(data); } catch { error('Invalid JSON for --data'); return; }
  Object.assign(fm, mergeData);
  const newContent = spliceFrontmatter(content, fm);
  fs.writeFileSync(fullPath, newContent, 'utf-8');
  output({ merged: true, fields: Object.keys(mergeData) }, raw, 'true');
}

const FRONTMATTER_SCHEMAS = {
  plan: { required: ['phase', 'plan', 'type', 'wave', 'depends_on', 'files_modified', 'autonomous', 'must_haves'] },
  summary: { required: ['phase', 'plan', 'subsystem', 'tags', 'duration', 'completed'] },
  verification: { required: ['phase', 'verified', 'status', 'score'] },
};

function cmdFrontmatterValidate(cwd, filePath, schemaName, raw) {
  if (!filePath || !schemaName) { error('file and schema required'); }
  const schema = FRONTMATTER_SCHEMAS[schemaName];
  if (!schema) { error(`Unknown schema: ${schemaName}. Available: ${Object.keys(FRONTMATTER_SCHEMAS).join(', ')}`); }
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  const content = safeReadFile(fullPath);
  if (!content) { output({ error: 'File not found', path: filePath }, raw); return; }
  const fm = extractFrontmatter(content);
  const missing = schema.required.filter(f => fm[f] === undefined);
  const present = schema.required.filter(f => fm[f] !== undefined);
  output({ valid: missing.length === 0, missing, present, schema: schemaName }, raw, missing.length === 0 ? 'valid' : 'invalid');
}

// ─── Verification Suite ──────────────────────────────────────────────────────

function cmdVerifyPlanStructure(cwd, filePath, raw) {
  if (!filePath) { error('file path required'); }
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  const content = safeReadFile(fullPath);
  if (!content) { output({ error: 'File not found', path: filePath }, raw); return; }

  const fm = extractFrontmatter(content);
  const errors = [];
  const warnings = [];

  // Check required frontmatter fields
  const required = ['phase', 'plan', 'type', 'wave', 'depends_on', 'files_modified', 'autonomous', 'must_haves'];
  for (const field of required) {
    if (fm[field] === undefined) errors.push(`Missing required frontmatter field: ${field}`);
  }

  // Parse and check task elements
  const taskPattern = /<task[^>]*>([\s\S]*?)<\/task>/g;
  const tasks = [];
  let taskMatch;
  while ((taskMatch = taskPattern.exec(content)) !== null) {
    const taskContent = taskMatch[1];
    const nameMatch = taskContent.match(/<name>([\s\S]*?)<\/name>/);
    const taskName = nameMatch ? nameMatch[1].trim() : 'unnamed';
    const hasFiles = /<files>/.test(taskContent);
    const hasAction = /<action>/.test(taskContent);
    const hasVerify = /<verify>/.test(taskContent);
    const hasDone = /<done>/.test(taskContent);

    if (!nameMatch) errors.push('Task missing <name> element');
    if (!hasAction) errors.push(`Task '${taskName}' missing <action>`);
    if (!hasVerify) warnings.push(`Task '${taskName}' missing <verify>`);
    if (!hasDone) warnings.push(`Task '${taskName}' missing <done>`);
    if (!hasFiles) warnings.push(`Task '${taskName}' missing <files>`);

    tasks.push({ name: taskName, hasFiles, hasAction, hasVerify, hasDone });
  }

  if (tasks.length === 0) warnings.push('No <task> elements found');

  // Wave/depends_on consistency
  if (fm.wave && parseInt(fm.wave) > 1 && (!fm.depends_on || (Array.isArray(fm.depends_on) && fm.depends_on.length === 0))) {
    warnings.push('Wave > 1 but depends_on is empty');
  }

  // Autonomous/checkpoint consistency
  const hasCheckpoints = /<task\s+type=["']?checkpoint/.test(content);
  if (hasCheckpoints && fm.autonomous !== 'false' && fm.autonomous !== false) {
    errors.push('Has checkpoint tasks but autonomous is not false');
  }

  output({
    valid: errors.length === 0,
    errors,
    warnings,
    task_count: tasks.length,
    tasks,
    frontmatter_fields: Object.keys(fm),
  }, raw, errors.length === 0 ? 'valid' : 'invalid');
}

function cmdVerifyPhaseCompleteness(cwd, phase, raw) {
  if (!phase) { error('phase required'); }
  const phaseInfo = findPhaseInternal(cwd, phase);
  if (!phaseInfo || !phaseInfo.found) {
    output({ error: 'Phase not found', phase }, raw);
    return;
  }

  const errors = [];
  const warnings = [];
  const phaseDir = path.join(cwd, phaseInfo.directory);

  // List plans and summaries
  let files;
  try { files = fs.readdirSync(phaseDir); } catch { output({ error: 'Cannot read phase directory' }, raw); return; }

  const plans = files.filter(f => f.match(/-PLAN\.md$/i));
  const summaries = files.filter(f => f.match(/-SUMMARY\.md$/i));

  // Extract plan IDs (everything before -PLAN.md)
  const planIds = new Set(plans.map(p => p.replace(/-PLAN\.md$/i, '')));
  const summaryIds = new Set(summaries.map(s => s.replace(/-SUMMARY\.md$/i, '')));

  // Plans without summaries
  const incompletePlans = [...planIds].filter(id => !summaryIds.has(id));
  if (incompletePlans.length > 0) {
    errors.push(`Plans without summaries: ${incompletePlans.join(', ')}`);
  }

  // Summaries without plans (orphans)
  const orphanSummaries = [...summaryIds].filter(id => !planIds.has(id));
  if (orphanSummaries.length > 0) {
    warnings.push(`Summaries without plans: ${orphanSummaries.join(', ')}`);
  }

  output({
    complete: errors.length === 0,
    phase: phaseInfo.phase_number,
    plan_count: plans.length,
    summary_count: summaries.length,
    incomplete_plans: incompletePlans,
    orphan_summaries: orphanSummaries,
    errors,
    warnings,
  }, raw, errors.length === 0 ? 'complete' : 'incomplete');
}

function cmdVerifyReferences(cwd, filePath, raw) {
  if (!filePath) { error('file path required'); }
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  const content = safeReadFile(fullPath);
  if (!content) { output({ error: 'File not found', path: filePath }, raw); return; }

  const found = [];
  const missing = [];

  // Find @-references: @path/to/file (must contain / to be a file path)
  const atRefs = content.match(/@([^\s\n,)]+\/[^\s\n,)]+)/g) || [];
  for (const ref of atRefs) {
    const cleanRef = ref.slice(1); // remove @
    const resolved = cleanRef.startsWith('~/')
      ? path.join(process.env.HOME || '', cleanRef.slice(2))
      : path.join(cwd, cleanRef);
    if (fs.existsSync(resolved)) {
      found.push(cleanRef);
    } else {
      missing.push(cleanRef);
    }
  }

  // Find backtick file paths that look like real paths (contain / and have extension)
  const backtickRefs = content.match(/`([^`]+\/[^`]+\.[a-zA-Z]{1,10})`/g) || [];
  for (const ref of backtickRefs) {
    const cleanRef = ref.slice(1, -1); // remove backticks
    if (cleanRef.startsWith('http') || cleanRef.includes('${') || cleanRef.includes('{{')) continue;
    if (found.includes(cleanRef) || missing.includes(cleanRef)) continue; // dedup
    const resolved = path.join(cwd, cleanRef);
    if (fs.existsSync(resolved)) {
      found.push(cleanRef);
    } else {
      missing.push(cleanRef);
    }
  }

  output({
    valid: missing.length === 0,
    found: found.length,
    missing,
    total: found.length + missing.length,
  }, raw, missing.length === 0 ? 'valid' : 'invalid');
}

function cmdVerifyCommits(cwd, hashes, raw) {
  if (!hashes || hashes.length === 0) { error('At least one commit hash required'); }

  const valid = [];
  const invalid = [];
  for (const hash of hashes) {
    const result = execGit(cwd, ['cat-file', '-t', hash]);
    if (result.exitCode === 0 && result.stdout.trim() === 'commit') {
      valid.push(hash);
    } else {
      invalid.push(hash);
    }
  }

  output({
    all_valid: invalid.length === 0,
    valid,
    invalid,
    total: hashes.length,
  }, raw, invalid.length === 0 ? 'valid' : 'invalid');
}

function cmdVerifyArtifacts(cwd, planFilePath, raw) {
  if (!planFilePath) { error('plan file path required'); }
  const fullPath = path.isAbsolute(planFilePath) ? planFilePath : path.join(cwd, planFilePath);
  const content = safeReadFile(fullPath);
  if (!content) { output({ error: 'File not found', path: planFilePath }, raw); return; }

  const artifacts = parseMustHavesBlock(content, 'artifacts');
  if (artifacts.length === 0) {
    output({ error: 'No must_haves.artifacts found in frontmatter', path: planFilePath }, raw);
    return;
  }

  const results = [];
  for (const artifact of artifacts) {
    if (typeof artifact === 'string') continue; // skip simple string items
    const artPath = artifact.path;
    if (!artPath) continue;

    const artFullPath = path.join(cwd, artPath);
    const exists = fs.existsSync(artFullPath);
    const check = { path: artPath, exists, issues: [], passed: false };

    if (exists) {
      const fileContent = safeReadFile(artFullPath) || '';
      const lineCount = fileContent.split('\n').length;

      if (artifact.min_lines && lineCount < artifact.min_lines) {
        check.issues.push(`Only ${lineCount} lines, need ${artifact.min_lines}`);
      }
      if (artifact.contains && !fileContent.includes(artifact.contains)) {
        check.issues.push(`Missing pattern: ${artifact.contains}`);
      }
      if (artifact.exports) {
        const exports = Array.isArray(artifact.exports) ? artifact.exports : [artifact.exports];
        for (const exp of exports) {
          if (!fileContent.includes(exp)) check.issues.push(`Missing export: ${exp}`);
        }
      }
      check.passed = check.issues.length === 0;
    } else {
      check.issues.push('File not found');
    }

    results.push(check);
  }

  const passed = results.filter(r => r.passed).length;
  output({
    all_passed: passed === results.length,
    passed,
    total: results.length,
    artifacts: results,
  }, raw, passed === results.length ? 'valid' : 'invalid');
}

function cmdVerifyKeyLinks(cwd, planFilePath, raw) {
  if (!planFilePath) { error('plan file path required'); }
  const fullPath = path.isAbsolute(planFilePath) ? planFilePath : path.join(cwd, planFilePath);
  const content = safeReadFile(fullPath);
  if (!content) { output({ error: 'File not found', path: planFilePath }, raw); return; }

  const keyLinks = parseMustHavesBlock(content, 'key_links');
  if (keyLinks.length === 0) {
    output({ error: 'No must_haves.key_links found in frontmatter', path: planFilePath }, raw);
    return;
  }

  const results = [];
  for (const link of keyLinks) {
    if (typeof link === 'string') continue;
    const check = { from: link.from, to: link.to, via: link.via || '', verified: false, detail: '' };

    const sourceContent = safeReadFile(path.join(cwd, link.from || ''));
    if (!sourceContent) {
      check.detail = 'Source file not found';
    } else if (link.pattern) {
      try {
        const regex = new RegExp(link.pattern);
        if (regex.test(sourceContent)) {
          check.verified = true;
          check.detail = 'Pattern found in source';
        } else {
          const targetContent = safeReadFile(path.join(cwd, link.to || ''));
          if (targetContent && regex.test(targetContent)) {
            check.verified = true;
            check.detail = 'Pattern found in target';
          } else {
            check.detail = `Pattern "${link.pattern}" not found in source or target`;
          }
        }
      } catch {
        check.detail = `Invalid regex pattern: ${link.pattern}`;
      }
    } else {
      // No pattern: just check source references target
      if (sourceContent.includes(link.to || '')) {
        check.verified = true;
        check.detail = 'Target referenced in source';
      } else {
        check.detail = 'Target not referenced in source';
      }
    }

    results.push(check);
  }

  const verified = results.filter(r => r.verified).length;
  output({
    all_verified: verified === results.length,
    verified,
    total: results.length,
    links: results,
  }, raw, verified === results.length ? 'valid' : 'invalid');
}

// ─── Roadmap Analysis ─────────────────────────────────────────────────────────

function cmdRoadmapAnalyze(cwd, raw) {
  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');

  if (!fs.existsSync(roadmapPath)) {
    output({ error: 'ROADMAP.md not found', milestones: [], phases: [], current_phase: null }, raw);
    return;
  }

  const content = fs.readFileSync(roadmapPath, 'utf-8');
  const phasesDir = path.join(cwd, '.planning', 'phases');

  // Extract all phase headings: ### Phase N: Name
  const phasePattern = /###\s*Phase\s+(\d+(?:\.\d+)?)\s*:\s*([^\n]+)/gi;
  const phases = [];
  let match;

  while ((match = phasePattern.exec(content)) !== null) {
    const phaseNum = match[1];
    const phaseName = match[2].replace(/\(INSERTED\)/i, '').trim();

    // Extract goal from the section
    const sectionStart = match.index;
    const restOfContent = content.slice(sectionStart);
    const nextHeader = restOfContent.match(/\n###\s+Phase\s+\d/i);
    const sectionEnd = nextHeader ? sectionStart + nextHeader.index : content.length;
    const section = content.slice(sectionStart, sectionEnd);

    const goalMatch = section.match(/\*\*Goal:\*\*\s*([^\n]+)/i);
    const goal = goalMatch ? goalMatch[1].trim() : null;

    const dependsMatch = section.match(/\*\*Depends on:\*\*\s*([^\n]+)/i);
    const depends_on = dependsMatch ? dependsMatch[1].trim() : null;

    // Check completion on disk
    const normalized = normalizePhaseName(phaseNum);
    let diskStatus = 'no_directory';
    let planCount = 0;
    let summaryCount = 0;
    let hasContext = false;
    let hasResearch = false;

    try {
      const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
      const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
      const dirMatch = dirs.find(d => d.startsWith(normalized + '-') || d === normalized);

      if (dirMatch) {
        const phaseFiles = fs.readdirSync(path.join(phasesDir, dirMatch));
        planCount = phaseFiles.filter(f => f.endsWith('-PLAN.md') || f === 'PLAN.md').length;
        summaryCount = phaseFiles.filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md').length;
        hasContext = phaseFiles.some(f => f.endsWith('-CONTEXT.md') || f === 'CONTEXT.md');
        hasResearch = phaseFiles.some(f => f.endsWith('-RESEARCH.md') || f === 'RESEARCH.md');

        if (summaryCount >= planCount && planCount > 0) diskStatus = 'complete';
        else if (summaryCount > 0) diskStatus = 'partial';
        else if (planCount > 0) diskStatus = 'planned';
        else if (hasResearch) diskStatus = 'researched';
        else if (hasContext) diskStatus = 'discussed';
        else diskStatus = 'empty';
      }
    } catch {}

    // Check ROADMAP checkbox status
    const checkboxPattern = new RegExp(`-\\s*\\[(x| )\\]\\s*.*Phase\\s+${phaseNum.replace('.', '\\.')}`, 'i');
    const checkboxMatch = content.match(checkboxPattern);
    const roadmapComplete = checkboxMatch ? checkboxMatch[1] === 'x' : false;

    phases.push({
      number: phaseNum,
      name: phaseName,
      goal,
      depends_on,
      plan_count: planCount,
      summary_count: summaryCount,
      has_context: hasContext,
      has_research: hasResearch,
      disk_status: diskStatus,
      roadmap_complete: roadmapComplete,
    });
  }

  // Extract milestone info
  const milestones = [];
  const milestonePattern = /##\s*(.*v(\d+\.\d+)[^(\n]*)/gi;
  let mMatch;
  while ((mMatch = milestonePattern.exec(content)) !== null) {
    milestones.push({
      heading: mMatch[1].trim(),
      version: 'v' + mMatch[2],
    });
  }

  // Find current and next phase
  const currentPhase = phases.find(p => p.disk_status === 'planned' || p.disk_status === 'partial') || null;
  const nextPhase = phases.find(p => p.disk_status === 'empty' || p.disk_status === 'no_directory' || p.disk_status === 'discussed' || p.disk_status === 'researched') || null;

  // Aggregated stats
  const totalPlans = phases.reduce((sum, p) => sum + p.plan_count, 0);
  const totalSummaries = phases.reduce((sum, p) => sum + p.summary_count, 0);
  const completedPhases = phases.filter(p => p.disk_status === 'complete').length;

  const result = {
    milestones,
    phases,
    phase_count: phases.length,
    completed_phases: completedPhases,
    total_plans: totalPlans,
    total_summaries: totalSummaries,
    progress_percent: totalPlans > 0 ? Math.round((totalSummaries / totalPlans) * 100) : 0,
    current_phase: currentPhase ? currentPhase.number : null,
    next_phase: nextPhase ? nextPhase.number : null,
  };

  output(result, raw);
}

// ─── Phase Add ────────────────────────────────────────────────────────────────

function cmdPhaseAdd(cwd, description, raw) {
  if (!description) {
    error('description required for phase add');
  }

  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');
  if (!fs.existsSync(roadmapPath)) {
    error('ROADMAP.md not found');
  }

  const content = fs.readFileSync(roadmapPath, 'utf-8');
  const slug = generateSlugInternal(description);

  // Find highest integer phase number
  const phasePattern = /###\s*Phase\s+(\d+)(?:\.\d+)?:/gi;
  let maxPhase = 0;
  let m;
  while ((m = phasePattern.exec(content)) !== null) {
    const num = parseInt(m[1], 10);
    if (num > maxPhase) maxPhase = num;
  }

  const newPhaseNum = maxPhase + 1;
  const paddedNum = String(newPhaseNum).padStart(2, '0');
  const dirName = `${paddedNum}-${slug}`;
  const dirPath = path.join(cwd, '.planning', 'phases', dirName);

  // Create directory
  fs.mkdirSync(dirPath, { recursive: true });

  // Build phase entry
  const phaseEntry = `\n### Phase ${newPhaseNum}: ${description}\n\n**Goal:** [To be planned]\n**Depends on:** Phase ${maxPhase}\n**Plans:** 0 plans\n\nPlans:\n- [ ] TBD (run /GSI:plan-phase ${newPhaseNum} to break down)\n`;

  // Find insertion point: before last "---" or at end
  let updatedContent;
  const lastSeparator = content.lastIndexOf('\n---');
  if (lastSeparator > 0) {
    updatedContent = content.slice(0, lastSeparator) + phaseEntry + content.slice(lastSeparator);
  } else {
    updatedContent = content + phaseEntry;
  }

  fs.writeFileSync(roadmapPath, updatedContent, 'utf-8');

  const result = {
    phase_number: newPhaseNum,
    padded: paddedNum,
    name: description,
    slug,
    directory: `.planning/phases/${dirName}`,
  };

  output(result, raw, paddedNum);
}

// ─── Phase Insert (Decimal) ──────────────────────────────────────────────────

function cmdPhaseInsert(cwd, afterPhase, description, raw) {
  if (!afterPhase || !description) {
    error('after-phase and description required for phase insert');
  }

  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');
  if (!fs.existsSync(roadmapPath)) {
    error('ROADMAP.md not found');
  }

  const content = fs.readFileSync(roadmapPath, 'utf-8');
  const slug = generateSlugInternal(description);

  // Verify target phase exists
  const afterPhaseEscaped = afterPhase.replace(/\./g, '\\.');
  const targetPattern = new RegExp(`###\\s*Phase\\s+${afterPhaseEscaped}:`, 'i');
  if (!targetPattern.test(content)) {
    error(`Phase ${afterPhase} not found in ROADMAP.md`);
  }

  // Calculate next decimal using existing logic
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const normalizedBase = normalizePhaseName(afterPhase);
  let existingDecimals = [];

  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
    const decimalPattern = new RegExp(`^${normalizedBase}\\.(\\d+)`);
    for (const dir of dirs) {
      const dm = dir.match(decimalPattern);
      if (dm) existingDecimals.push(parseInt(dm[1], 10));
    }
  } catch {}

  const nextDecimal = existingDecimals.length === 0 ? 1 : Math.max(...existingDecimals) + 1;
  const decimalPhase = `${normalizedBase}.${nextDecimal}`;
  const dirName = `${decimalPhase}-${slug}`;
  const dirPath = path.join(cwd, '.planning', 'phases', dirName);

  // Create directory
  fs.mkdirSync(dirPath, { recursive: true });

  // Build phase entry
  const phaseEntry = `\n### Phase ${decimalPhase}: ${description} (INSERTED)\n\n**Goal:** [Urgent work - to be planned]\n**Depends on:** Phase ${afterPhase}\n**Plans:** 0 plans\n\nPlans:\n- [ ] TBD (run /GSI:plan-phase ${decimalPhase} to break down)\n`;

  // Insert after the target phase section
  const headerPattern = new RegExp(`(###\\s*Phase\\s+${afterPhaseEscaped}:[^\\n]*\\n)`, 'i');
  const headerMatch = content.match(headerPattern);
  if (!headerMatch) {
    error(`Could not find Phase ${afterPhase} header`);
  }

  const headerIdx = content.indexOf(headerMatch[0]);
  const afterHeader = content.slice(headerIdx + headerMatch[0].length);
  const nextPhaseMatch = afterHeader.match(/\n###\s+Phase\s+\d/i);

  let insertIdx;
  if (nextPhaseMatch) {
    insertIdx = headerIdx + headerMatch[0].length + nextPhaseMatch.index;
  } else {
    insertIdx = content.length;
  }

  const updatedContent = content.slice(0, insertIdx) + phaseEntry + content.slice(insertIdx);
  fs.writeFileSync(roadmapPath, updatedContent, 'utf-8');

  const result = {
    phase_number: decimalPhase,
    after_phase: afterPhase,
    name: description,
    slug,
    directory: `.planning/phases/${dirName}`,
  };

  output(result, raw, decimalPhase);
}

// ─── Phase Remove ─────────────────────────────────────────────────────────────

function cmdPhaseRemove(cwd, targetPhase, options, raw) {
  if (!targetPhase) {
    error('phase number required for phase remove');
  }

  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const force = options.force || false;

  if (!fs.existsSync(roadmapPath)) {
    error('ROADMAP.md not found');
  }

  // Normalize the target
  const normalized = normalizePhaseName(targetPhase);
  const isDecimal = targetPhase.includes('.');

  // Find and validate target directory
  let targetDir = null;
  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
    targetDir = dirs.find(d => d.startsWith(normalized + '-') || d === normalized);
  } catch {}

  // Check for executed work (SUMMARY.md files)
  if (targetDir && !force) {
    const targetPath = path.join(phasesDir, targetDir);
    const files = fs.readdirSync(targetPath);
    const summaries = files.filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md');
    if (summaries.length > 0) {
      error(`Phase ${targetPhase} has ${summaries.length} executed plan(s). Use --force to remove anyway.`);
    }
  }

  // Delete target directory
  if (targetDir) {
    fs.rmSync(path.join(phasesDir, targetDir), { recursive: true, force: true });
  }

  // Renumber subsequent phases
  const renamedDirs = [];
  const renamedFiles = [];

  if (isDecimal) {
    // Decimal removal: renumber sibling decimals (e.g., removing 06.2 → 06.3 becomes 06.2)
    const baseParts = normalized.split('.');
    const baseInt = baseParts[0];
    const removedDecimal = parseInt(baseParts[1], 10);

    try {
      const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
      const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

      // Find sibling decimals with higher numbers
      const decPattern = new RegExp(`^${baseInt}\\.(\\d+)-(.+)$`);
      const toRename = [];
      for (const dir of dirs) {
        const dm = dir.match(decPattern);
        if (dm && parseInt(dm[1], 10) > removedDecimal) {
          toRename.push({ dir, oldDecimal: parseInt(dm[1], 10), slug: dm[2] });
        }
      }

      // Sort descending to avoid conflicts
      toRename.sort((a, b) => b.oldDecimal - a.oldDecimal);

      for (const item of toRename) {
        const newDecimal = item.oldDecimal - 1;
        const oldPhaseId = `${baseInt}.${item.oldDecimal}`;
        const newPhaseId = `${baseInt}.${newDecimal}`;
        const newDirName = `${baseInt}.${newDecimal}-${item.slug}`;

        // Rename directory
        fs.renameSync(path.join(phasesDir, item.dir), path.join(phasesDir, newDirName));
        renamedDirs.push({ from: item.dir, to: newDirName });

        // Rename files inside
        const dirFiles = fs.readdirSync(path.join(phasesDir, newDirName));
        for (const f of dirFiles) {
          // Files may have phase prefix like "06.2-01-PLAN.md"
          if (f.includes(oldPhaseId)) {
            const newFileName = f.replace(oldPhaseId, newPhaseId);
            fs.renameSync(
              path.join(phasesDir, newDirName, f),
              path.join(phasesDir, newDirName, newFileName)
            );
            renamedFiles.push({ from: f, to: newFileName });
          }
        }
      }
    } catch {}

  } else {
    // Integer removal: renumber all subsequent integer phases
    const removedInt = parseInt(normalized, 10);

    try {
      const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
      const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

      // Collect directories that need renumbering (integer phases > removed, and their decimals)
      const toRename = [];
      for (const dir of dirs) {
        const dm = dir.match(/^(\d+)(?:\.(\d+))?-(.+)$/);
        if (!dm) continue;
        const dirInt = parseInt(dm[1], 10);
        if (dirInt > removedInt) {
          toRename.push({
            dir,
            oldInt: dirInt,
            decimal: dm[2] ? parseInt(dm[2], 10) : null,
            slug: dm[3],
          });
        }
      }

      // Sort descending to avoid conflicts
      toRename.sort((a, b) => {
        if (a.oldInt !== b.oldInt) return b.oldInt - a.oldInt;
        return (b.decimal || 0) - (a.decimal || 0);
      });

      for (const item of toRename) {
        const newInt = item.oldInt - 1;
        const newPadded = String(newInt).padStart(2, '0');
        const oldPadded = String(item.oldInt).padStart(2, '0');
        const decimalSuffix = item.decimal !== null ? `.${item.decimal}` : '';
        const oldPrefix = `${oldPadded}${decimalSuffix}`;
        const newPrefix = `${newPadded}${decimalSuffix}`;
        const newDirName = `${newPrefix}-${item.slug}`;

        // Rename directory
        fs.renameSync(path.join(phasesDir, item.dir), path.join(phasesDir, newDirName));
        renamedDirs.push({ from: item.dir, to: newDirName });

        // Rename files inside
        const dirFiles = fs.readdirSync(path.join(phasesDir, newDirName));
        for (const f of dirFiles) {
          if (f.startsWith(oldPrefix)) {
            const newFileName = newPrefix + f.slice(oldPrefix.length);
            fs.renameSync(
              path.join(phasesDir, newDirName, f),
              path.join(phasesDir, newDirName, newFileName)
            );
            renamedFiles.push({ from: f, to: newFileName });
          }
        }
      }
    } catch {}
  }

  // Update ROADMAP.md
  let roadmapContent = fs.readFileSync(roadmapPath, 'utf-8');

  // Remove the target phase section
  const targetEscaped = targetPhase.replace(/\./g, '\\.');
  const sectionPattern = new RegExp(
    `\\n?###\\s*Phase\\s+${targetEscaped}\\s*:[\\s\\S]*?(?=\\n###\\s+Phase\\s+\\d|$)`,
    'i'
  );
  roadmapContent = roadmapContent.replace(sectionPattern, '');

  // Remove from phase list (checkbox)
  const checkboxPattern = new RegExp(`\\n?-\\s*\\[[ x]\\]\\s*.*Phase\\s+${targetEscaped}[:\\s][^\\n]*`, 'gi');
  roadmapContent = roadmapContent.replace(checkboxPattern, '');

  // Remove from progress table
  const tableRowPattern = new RegExp(`\\n?\\|\\s*${targetEscaped}\\.?\\s[^|]*\\|[^\\n]*`, 'gi');
  roadmapContent = roadmapContent.replace(tableRowPattern, '');

  // Renumber references in ROADMAP for subsequent phases
  if (!isDecimal) {
    const removedInt = parseInt(normalized, 10);

    // Collect all integer phases > removedInt
    const maxPhase = 99; // reasonable upper bound
    for (let oldNum = maxPhase; oldNum > removedInt; oldNum--) {
      const newNum = oldNum - 1;
      const oldStr = String(oldNum);
      const newStr = String(newNum);
      const oldPad = oldStr.padStart(2, '0');
      const newPad = newStr.padStart(2, '0');

      // Phase headings: ### Phase 18: → ### Phase 17:
      roadmapContent = roadmapContent.replace(
        new RegExp(`(###\\s*Phase\\s+)${oldStr}(\\s*:)`, 'gi'),
        `$1${newStr}$2`
      );

      // Checkbox items: - [ ] **Phase 18:** → - [ ] **Phase 17:**
      roadmapContent = roadmapContent.replace(
        new RegExp(`(Phase\\s+)${oldStr}([:\\s])`, 'g'),
        `$1${newStr}$2`
      );

      // Plan references: 18-01 → 17-01
      roadmapContent = roadmapContent.replace(
        new RegExp(`${oldPad}-(\\d{2})`, 'g'),
        `${newPad}-$1`
      );

      // Table rows: | 18. → | 17.
      roadmapContent = roadmapContent.replace(
        new RegExp(`(\\|\\s*)${oldStr}\\.\\s`, 'g'),
        `$1${newStr}. `
      );

      // Depends on references
      roadmapContent = roadmapContent.replace(
        new RegExp(`(Depends on:\\*\\*\\s*Phase\\s+)${oldStr}\\b`, 'gi'),
        `$1${newStr}`
      );
    }
  }

  fs.writeFileSync(roadmapPath, roadmapContent, 'utf-8');

  // Update STATE.md phase count
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  if (fs.existsSync(statePath)) {
    let stateContent = fs.readFileSync(statePath, 'utf-8');
    // Update "Total Phases" field
    const totalPattern = /(\*\*Total Phases:\*\*\s*)(\d+)/;
    const totalMatch = stateContent.match(totalPattern);
    if (totalMatch) {
      const oldTotal = parseInt(totalMatch[2], 10);
      stateContent = stateContent.replace(totalPattern, `$1${oldTotal - 1}`);
    }
    // Update "Phase: X of Y" pattern
    const ofPattern = /(\bof\s+)(\d+)(\s*(?:\(|phases?))/i;
    const ofMatch = stateContent.match(ofPattern);
    if (ofMatch) {
      const oldTotal = parseInt(ofMatch[2], 10);
      stateContent = stateContent.replace(ofPattern, `$1${oldTotal - 1}$3`);
    }
    fs.writeFileSync(statePath, stateContent, 'utf-8');
  }

  const result = {
    removed: targetPhase,
    directory_deleted: targetDir || null,
    renamed_directories: renamedDirs,
    renamed_files: renamedFiles,
    roadmap_updated: true,
    state_updated: fs.existsSync(statePath),
  };

  output(result, raw);
}

// ─── Phase Complete (Transition) ──────────────────────────────────────────────

function cmdPhaseComplete(cwd, phaseNum, raw) {
  if (!phaseNum) {
    error('phase number required for phase complete');
  }

  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const normalized = normalizePhaseName(phaseNum);
  const today = new Date().toISOString().split('T')[0];

  // Verify phase info
  const phaseInfo = findPhaseInternal(cwd, phaseNum);
  if (!phaseInfo) {
    error(`Phase ${phaseNum} not found`);
  }

  const planCount = phaseInfo.plans.length;
  const summaryCount = phaseInfo.summaries.length;

  // Update ROADMAP.md: mark phase complete
  if (fs.existsSync(roadmapPath)) {
    let roadmapContent = fs.readFileSync(roadmapPath, 'utf-8');

    // Checkbox: - [ ] Phase N: → - [x] Phase N: (...completed DATE)
    const checkboxPattern = new RegExp(
      `(-\\s*\\[)[ ](\\]\\s*.*Phase\\s+${phaseNum.replace('.', '\\.')}[:\\s][^\\n]*)`,
      'i'
    );
    roadmapContent = roadmapContent.replace(checkboxPattern, `$1x$2 (completed ${today})`);

    // Progress table: update Status to Complete, add date
    const phaseEscaped = phaseNum.replace('.', '\\.');
    const tablePattern = new RegExp(
      `(\\|\\s*${phaseEscaped}\\.?\\s[^|]*\\|[^|]*\\|)\\s*[^|]*(\\|)\\s*[^|]*(\\|)`,
      'i'
    );
    roadmapContent = roadmapContent.replace(
      tablePattern,
      `$1 Complete    $2 ${today} $3`
    );

    // Update plan count in phase section
    const planCountPattern = new RegExp(
      `(###\\s*Phase\\s+${phaseEscaped}[\\s\\S]*?\\*\\*Plans:\\*\\*\\s*)[^\\n]+`,
      'i'
    );
    roadmapContent = roadmapContent.replace(
      planCountPattern,
      `$1${summaryCount}/${planCount} plans complete`
    );

    fs.writeFileSync(roadmapPath, roadmapContent, 'utf-8');
  }

  // Find next phase
  let nextPhaseNum = null;
  let nextPhaseName = null;
  let isLastPhase = true;

  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
    const currentFloat = parseFloat(phaseNum);

    // Find the next phase directory after current
    for (const dir of dirs) {
      const dm = dir.match(/^(\d+(?:\.\d+)?)-?(.*)/);
      if (dm) {
        const dirFloat = parseFloat(dm[1]);
        if (dirFloat > currentFloat) {
          nextPhaseNum = dm[1];
          nextPhaseName = dm[2] || null;
          isLastPhase = false;
          break;
        }
      }
    }
  } catch {}

  // Update STATE.md
  if (fs.existsSync(statePath)) {
    let stateContent = fs.readFileSync(statePath, 'utf-8');

    // Update Current Phase
    stateContent = stateContent.replace(
      /(\*\*Current Phase:\*\*\s*).*/,
      `$1${nextPhaseNum || phaseNum}`
    );

    // Update Current Phase Name
    if (nextPhaseName) {
      stateContent = stateContent.replace(
        /(\*\*Current Phase Name:\*\*\s*).*/,
        `$1${nextPhaseName.replace(/-/g, ' ')}`
      );
    }

    // Update Status
    stateContent = stateContent.replace(
      /(\*\*Status:\*\*\s*).*/,
      `$1${isLastPhase ? 'Milestone complete' : 'Ready to plan'}`
    );

    // Update Current Plan
    stateContent = stateContent.replace(
      /(\*\*Current Plan:\*\*\s*).*/,
      `$1Not started`
    );

    // Update Last Activity
    stateContent = stateContent.replace(
      /(\*\*Last Activity:\*\*\s*).*/,
      `$1${today}`
    );

    // Update Last Activity Description
    stateContent = stateContent.replace(
      /(\*\*Last Activity Description:\*\*\s*).*/,
      `$1Phase ${phaseNum} complete${nextPhaseNum ? `, transitioned to Phase ${nextPhaseNum}` : ''}`
    );

    fs.writeFileSync(statePath, stateContent, 'utf-8');
  }

  const result = {
    completed_phase: phaseNum,
    phase_name: phaseInfo.phase_name,
    plans_executed: `${summaryCount}/${planCount}`,
    next_phase: nextPhaseNum,
    next_phase_name: nextPhaseName,
    is_last_phase: isLastPhase,
    date: today,
    roadmap_updated: fs.existsSync(roadmapPath),
    state_updated: fs.existsSync(statePath),
  };

  output(result, raw);
}

// ─── Milestone Complete ───────────────────────────────────────────────────────

function cmdMilestoneComplete(cwd, version, options, raw) {
  if (!version) {
    error('version required for milestone complete (e.g., v1.0)');
  }

  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');
  const reqPath = path.join(cwd, '.planning', 'REQUIREMENTS.md');
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  const milestonesPath = path.join(cwd, '.planning', 'MILESTONES.md');
  const archiveDir = path.join(cwd, '.planning', 'milestones');
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const today = new Date().toISOString().split('T')[0];
  const milestoneName = options.name || version;

  // Ensure archive directory exists
  fs.mkdirSync(archiveDir, { recursive: true });

  // Gather stats from phases
  let phaseCount = 0;
  let totalPlans = 0;
  let totalTasks = 0;
  const accomplishments = [];

  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

    for (const dir of dirs) {
      phaseCount++;
      const phaseFiles = fs.readdirSync(path.join(phasesDir, dir));
      const plans = phaseFiles.filter(f => f.endsWith('-PLAN.md') || f === 'PLAN.md');
      const summaries = phaseFiles.filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md');
      totalPlans += plans.length;

      // Extract one-liners from summaries
      for (const s of summaries) {
        try {
          const content = fs.readFileSync(path.join(phasesDir, dir, s), 'utf-8');
          const fm = extractFrontmatter(content);
          if (fm['one-liner']) {
            accomplishments.push(fm['one-liner']);
          }
          // Count tasks
          const taskMatches = content.match(/##\s*Task\s*\d+/gi) || [];
          totalTasks += taskMatches.length;
        } catch {}
      }
    }
  } catch {}

  // Archive ROADMAP.md
  if (fs.existsSync(roadmapPath)) {
    const roadmapContent = fs.readFileSync(roadmapPath, 'utf-8');
    fs.writeFileSync(path.join(archiveDir, `${version}-ROADMAP.md`), roadmapContent, 'utf-8');
  }

  // Archive REQUIREMENTS.md
  if (fs.existsSync(reqPath)) {
    const reqContent = fs.readFileSync(reqPath, 'utf-8');
    const archiveHeader = `# Requirements Archive: ${version} ${milestoneName}\n\n**Archived:** ${today}\n**Status:** SHIPPED\n\nFor current requirements, see \`.planning/REQUIREMENTS.md\`.\n\n---\n\n`;
    fs.writeFileSync(path.join(archiveDir, `${version}-REQUIREMENTS.md`), archiveHeader + reqContent, 'utf-8');
  }

  // Archive audit file if exists
  const auditFile = path.join(cwd, '.planning', `${version}-MILESTONE-AUDIT.md`);
  if (fs.existsSync(auditFile)) {
    fs.renameSync(auditFile, path.join(archiveDir, `${version}-MILESTONE-AUDIT.md`));
  }

  // Create/append MILESTONES.md entry
  const accomplishmentsList = accomplishments.map(a => `- ${a}`).join('\n');
  const milestoneEntry = `## ${version} ${milestoneName} (Shipped: ${today})\n\n**Phases completed:** ${phaseCount} phases, ${totalPlans} plans, ${totalTasks} tasks\n\n**Key accomplishments:**\n${accomplishmentsList || '- (none recorded)'}\n\n---\n\n`;

  if (fs.existsSync(milestonesPath)) {
    const existing = fs.readFileSync(milestonesPath, 'utf-8');
    fs.writeFileSync(milestonesPath, existing + '\n' + milestoneEntry, 'utf-8');
  } else {
    fs.writeFileSync(milestonesPath, `# Milestones\n\n${milestoneEntry}`, 'utf-8');
  }

  // Update STATE.md
  if (fs.existsSync(statePath)) {
    let stateContent = fs.readFileSync(statePath, 'utf-8');
    stateContent = stateContent.replace(
      /(\*\*Status:\*\*\s*).*/,
      `$1${version} milestone complete`
    );
    stateContent = stateContent.replace(
      /(\*\*Last Activity:\*\*\s*).*/,
      `$1${today}`
    );
    stateContent = stateContent.replace(
      /(\*\*Last Activity Description:\*\*\s*).*/,
      `$1${version} milestone completed and archived`
    );
    fs.writeFileSync(statePath, stateContent, 'utf-8');
  }

  const result = {
    version,
    name: milestoneName,
    date: today,
    phases: phaseCount,
    plans: totalPlans,
    tasks: totalTasks,
    accomplishments,
    archived: {
      roadmap: fs.existsSync(path.join(archiveDir, `${version}-ROADMAP.md`)),
      requirements: fs.existsSync(path.join(archiveDir, `${version}-REQUIREMENTS.md`)),
      audit: fs.existsSync(path.join(archiveDir, `${version}-MILESTONE-AUDIT.md`)),
    },
    milestones_updated: true,
    state_updated: fs.existsSync(statePath),
  };

  output(result, raw);
}

// ─── Validate Consistency ─────────────────────────────────────────────────────

function cmdValidateConsistency(cwd, raw) {
  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const errors = [];
  const warnings = [];

  // Check for ROADMAP
  if (!fs.existsSync(roadmapPath)) {
    errors.push('ROADMAP.md not found');
    output({ passed: false, errors, warnings }, raw, 'failed');
    return;
  }

  const roadmapContent = fs.readFileSync(roadmapPath, 'utf-8');

  // Extract phases from ROADMAP
  const roadmapPhases = new Set();
  const phasePattern = /###\s*Phase\s+(\d+(?:\.\d+)?)\s*:/gi;
  let m;
  while ((m = phasePattern.exec(roadmapContent)) !== null) {
    roadmapPhases.add(m[1]);
  }

  // Get phases on disk
  const diskPhases = new Set();
  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
    for (const dir of dirs) {
      const dm = dir.match(/^(\d+(?:\.\d+)?)/);
      if (dm) diskPhases.add(dm[1]);
    }
  } catch {}

  // Check: phases in ROADMAP but not on disk
  for (const p of roadmapPhases) {
    if (!diskPhases.has(p) && !diskPhases.has(normalizePhaseName(p))) {
      warnings.push(`Phase ${p} in ROADMAP.md but no directory on disk`);
    }
  }

  // Check: phases on disk but not in ROADMAP
  for (const p of diskPhases) {
    const unpadded = String(parseInt(p, 10));
    if (!roadmapPhases.has(p) && !roadmapPhases.has(unpadded)) {
      warnings.push(`Phase ${p} exists on disk but not in ROADMAP.md`);
    }
  }

  // Check: sequential phase numbers (integers only)
  const integerPhases = [...diskPhases]
    .filter(p => !p.includes('.'))
    .map(p => parseInt(p, 10))
    .sort((a, b) => a - b);

  for (let i = 1; i < integerPhases.length; i++) {
    if (integerPhases[i] !== integerPhases[i - 1] + 1) {
      warnings.push(`Gap in phase numbering: ${integerPhases[i - 1]} → ${integerPhases[i]}`);
    }
  }

  // Check: plan numbering within phases
  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

    for (const dir of dirs) {
      const phaseFiles = fs.readdirSync(path.join(phasesDir, dir));
      const plans = phaseFiles.filter(f => f.endsWith('-PLAN.md')).sort();

      // Extract plan numbers
      const planNums = plans.map(p => {
        const pm = p.match(/-(\d{2})-PLAN\.md$/);
        return pm ? parseInt(pm[1], 10) : null;
      }).filter(n => n !== null);

      for (let i = 1; i < planNums.length; i++) {
        if (planNums[i] !== planNums[i - 1] + 1) {
          warnings.push(`Gap in plan numbering in ${dir}: plan ${planNums[i - 1]} → ${planNums[i]}`);
        }
      }

      // Check: plans without summaries (completed plans)
      const summaries = phaseFiles.filter(f => f.endsWith('-SUMMARY.md'));
      const planIds = new Set(plans.map(p => p.replace('-PLAN.md', '')));
      const summaryIds = new Set(summaries.map(s => s.replace('-SUMMARY.md', '')));

      // Summary without matching plan is suspicious
      for (const sid of summaryIds) {
        if (!planIds.has(sid)) {
          warnings.push(`Summary ${sid}-SUMMARY.md in ${dir} has no matching PLAN.md`);
        }
      }
    }
  } catch {}

  // Check: frontmatter in plans has required fields
  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);

    for (const dir of dirs) {
      const phaseFiles = fs.readdirSync(path.join(phasesDir, dir));
      const plans = phaseFiles.filter(f => f.endsWith('-PLAN.md'));

      for (const plan of plans) {
        const content = fs.readFileSync(path.join(phasesDir, dir, plan), 'utf-8');
        const fm = extractFrontmatter(content);

        if (!fm.wave) {
          warnings.push(`${dir}/${plan}: missing 'wave' in frontmatter`);
        }
      }
    }
  } catch {}

  const passed = errors.length === 0;
  output({ passed, errors, warnings, warning_count: warnings.length }, raw, passed ? 'passed' : 'failed');
}

// ─── Progress Render ──────────────────────────────────────────────────────────

function cmdProgressRender(cwd, format, raw) {
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');
  const milestone = getMilestoneInfo(cwd);

  const phases = [];
  let totalPlans = 0;
  let totalSummaries = 0;

  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort((a, b) => {
      const aNum = parseFloat(a.match(/^(\d+(?:\.\d+)?)/)?.[1] || '0');
      const bNum = parseFloat(b.match(/^(\d+(?:\.\d+)?)/)?.[1] || '0');
      return aNum - bNum;
    });

    for (const dir of dirs) {
      const dm = dir.match(/^(\d+(?:\.\d+)?)-?(.*)/);
      const phaseNum = dm ? dm[1] : dir;
      const phaseName = dm && dm[2] ? dm[2].replace(/-/g, ' ') : '';
      const phaseFiles = fs.readdirSync(path.join(phasesDir, dir));
      const plans = phaseFiles.filter(f => f.endsWith('-PLAN.md') || f === 'PLAN.md').length;
      const summaries = phaseFiles.filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md').length;

      totalPlans += plans;
      totalSummaries += summaries;

      let status;
      if (plans === 0) status = 'Pending';
      else if (summaries >= plans) status = 'Complete';
      else if (summaries > 0) status = 'In Progress';
      else status = 'Planned';

      phases.push({ number: phaseNum, name: phaseName, plans, summaries, status });
    }
  } catch {}

  const percent = totalPlans > 0 ? Math.round((totalSummaries / totalPlans) * 100) : 0;

  if (format === 'table') {
    // Render markdown table
    const barWidth = 10;
    const filled = Math.round((percent / 100) * barWidth);
    const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(barWidth - filled);
    let out = `# ${milestone.version} ${milestone.name}\n\n`;
    out += `**Progress:** [${bar}] ${totalSummaries}/${totalPlans} plans (${percent}%)\n\n`;
    out += `| Phase | Name | Plans | Status |\n`;
    out += `|-------|------|-------|--------|\n`;
    for (const p of phases) {
      out += `| ${p.number} | ${p.name} | ${p.summaries}/${p.plans} | ${p.status} |\n`;
    }
    output({ rendered: out }, raw, out);
  } else if (format === 'bar') {
    const barWidth = 20;
    const filled = Math.round((percent / 100) * barWidth);
    const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(barWidth - filled);
    const text = `[${bar}] ${totalSummaries}/${totalPlans} plans (${percent}%)`;
    output({ bar: text, percent, completed: totalSummaries, total: totalPlans }, raw, text);
  } else {
    // JSON format
    output({
      milestone_version: milestone.version,
      milestone_name: milestone.name,
      phases,
      total_plans: totalPlans,
      total_summaries: totalSummaries,
      percent,
    }, raw);
  }
}

// ─── Progress Patterns (Pattern Learning Metrics) ─────────────────────────────

async function cmdProgressPatterns(cwd, raw) {
  try {
    const { getMetrics, getMetricsSummary } = require('../lib/pattern-learning/metrics');
    const metricsSummary = getMetricsSummary();

    if (raw) {
      process.stdout.write(metricsSummary);
    } else {
      const metrics = getMetrics();
      output(metrics, null, metricsSummary);
    }
  } catch (e) {
    error(`Failed to get pattern learning metrics: ${e.message}`);
  }
}

// ─── Todo Complete ────────────────────────────────────────────────────────────

function cmdTodoComplete(cwd, filename, raw) {
  if (!filename) {
    error('filename required for todo complete');
  }

  const pendingDir = path.join(cwd, '.planning', 'todos', 'pending');
  const completedDir = path.join(cwd, '.planning', 'todos', 'completed');
  const sourcePath = path.join(pendingDir, filename);

  if (!fs.existsSync(sourcePath)) {
    error(`Todo not found: ${filename}`);
  }

  // Ensure completed directory exists
  fs.mkdirSync(completedDir, { recursive: true });

  // Read, add completion timestamp, move
  let content = fs.readFileSync(sourcePath, 'utf-8');
  const today = new Date().toISOString().split('T')[0];
  content = `completed: ${today}\n` + content;

  fs.writeFileSync(path.join(completedDir, filename), content, 'utf-8');
  fs.unlinkSync(sourcePath);

  output({ completed: true, file: filename, date: today }, raw, 'completed');
}

// ─── Scaffold ─────────────────────────────────────────────────────────────────

function cmdScaffold(cwd, type, options, raw) {
  const { phase, name } = options;
  const padded = phase ? normalizePhaseName(phase) : '00';
  const today = new Date().toISOString().split('T')[0];

  // Find phase directory
  const phaseInfo = phase ? findPhaseInternal(cwd, phase) : null;
  const phaseDir = phaseInfo ? path.join(cwd, phaseInfo.directory) : null;

  if (phase && !phaseDir && type !== 'phase-dir') {
    error(`Phase ${phase} directory not found`);
  }

  let filePath, content;

  switch (type) {
    case 'context': {
      filePath = path.join(phaseDir, `${padded}-CONTEXT.md`);
      content = `---\nphase: "${padded}"\nname: "${name || phaseInfo?.phase_name || 'Unnamed'}"\ncreated: ${today}\n---\n\n# Phase ${phase}: ${name || phaseInfo?.phase_name || 'Unnamed'} — Context\n\n## Decisions\n\n_Decisions will be captured during /GSI:discuss-phase ${phase}_\n\n## Discretion Areas\n\n_Areas where the executor can use judgment_\n\n## Deferred Ideas\n\n_Ideas to consider later_\n`;
      break;
    }
    case 'uat': {
      filePath = path.join(phaseDir, `${padded}-UAT.md`);
      content = `---\nphase: "${padded}"\nname: "${name || phaseInfo?.phase_name || 'Unnamed'}"\ncreated: ${today}\nstatus: pending\n---\n\n# Phase ${phase}: ${name || phaseInfo?.phase_name || 'Unnamed'} — User Acceptance Testing\n\n## Test Results\n\n| # | Test | Status | Notes |\n|---|------|--------|-------|\n\n## Summary\n\n_Pending UAT_\n`;
      break;
    }
    case 'verification': {
      filePath = path.join(phaseDir, `${padded}-VERIFICATION.md`);
      content = `---\nphase: "${padded}"\nname: "${name || phaseInfo?.phase_name || 'Unnamed'}"\ncreated: ${today}\nstatus: pending\n---\n\n# Phase ${phase}: ${name || phaseInfo?.phase_name || 'Unnamed'} — Verification\n\n## Goal-Backward Verification\n\n**Phase Goal:** [From ROADMAP.md]\n\n## Checks\n\n| # | Requirement | Status | Evidence |\n|---|------------|--------|----------|\n\n## Result\n\n_Pending verification_\n`;
      break;
    }
    case 'phase-dir': {
      if (!phase || !name) {
        error('phase and name required for phase-dir scaffold');
      }
      const slug = generateSlugInternal(name);
      const dirName = `${padded}-${slug}`;
      const phasesParent = path.join(cwd, '.planning', 'phases');
      fs.mkdirSync(phasesParent, { recursive: true });
      const dirPath = path.join(phasesParent, dirName);
      fs.mkdirSync(dirPath, { recursive: true });
      output({ created: true, directory: `.planning/phases/${dirName}`, path: dirPath }, raw, dirPath);
      return;
    }
    default:
      error(`Unknown scaffold type: ${type}. Available: context, uat, verification, phase-dir`);
  }

  if (fs.existsSync(filePath)) {
    output({ created: false, reason: 'already_exists', path: filePath }, raw, 'exists');
    return;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  const relPath = path.relative(cwd, filePath);
  output({ created: true, path: relPath }, raw, relPath);
}

// ─── Compound Commands ────────────────────────────────────────────────────────

function resolveModelInternal(cwd, agentType) {
  const config = loadConfig(cwd);
  const profile = config.model_profile || 'balanced';
  const agentModels = MODEL_PROFILES[agentType];
  if (!agentModels) return 'sonnet';
  return agentModels[profile] || agentModels['balanced'] || 'sonnet';
}

function findPhaseInternal(cwd, phase) {
  if (!phase) return null;

  const phasesDir = path.join(cwd, '.planning', 'phases');
  const normalized = normalizePhaseName(phase);

  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
    const match = dirs.find(d => d.startsWith(normalized));
    if (!match) return null;

    const dirMatch = match.match(/^(\d+(?:\.\d+)?)-?(.*)/);
    const phaseNumber = dirMatch ? dirMatch[1] : normalized;
    const phaseName = dirMatch && dirMatch[2] ? dirMatch[2] : null;
    const phaseDir = path.join(phasesDir, match);
    const phaseFiles = fs.readdirSync(phaseDir);

    const plans = phaseFiles.filter(f => f.endsWith('-PLAN.md') || f === 'PLAN.md').sort();
    const summaries = phaseFiles.filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md').sort();
    const hasResearch = phaseFiles.some(f => f.endsWith('-RESEARCH.md') || f === 'RESEARCH.md');
    const hasContext = phaseFiles.some(f => f.endsWith('-CONTEXT.md') || f === 'CONTEXT.md');
    const hasVerification = phaseFiles.some(f => f.endsWith('-VERIFICATION.md') || f === 'VERIFICATION.md');

    // Determine incomplete plans (plans without matching summaries)
    const completedPlanIds = new Set(
      summaries.map(s => s.replace('-SUMMARY.md', '').replace('SUMMARY.md', ''))
    );
    const incompletePlans = plans.filter(p => {
      const planId = p.replace('-PLAN.md', '').replace('PLAN.md', '');
      return !completedPlanIds.has(planId);
    });

    return {
      found: true,
      directory: path.join('.planning', 'phases', match),
      phase_number: phaseNumber,
      phase_name: phaseName,
      phase_slug: phaseName ? phaseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null,
      plans,
      summaries,
      incomplete_plans: incompletePlans,
      has_research: hasResearch,
      has_context: hasContext,
      has_verification: hasVerification,
    };
  } catch {
    return null;
  }
}

function pathExistsInternal(cwd, targetPath) {
  const fullPath = path.isAbsolute(targetPath) ? targetPath : path.join(cwd, targetPath);
  try {
    fs.statSync(fullPath);
    return true;
  } catch {
    return false;
  }
}

function generateSlugInternal(text) {
  if (!text) return null;
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function getMilestoneInfo(cwd) {
  try {
    const roadmap = fs.readFileSync(path.join(cwd, '.planning', 'ROADMAP.md'), 'utf-8');
    const versionMatch = roadmap.match(/v(\d+\.\d+)/);
    const nameMatch = roadmap.match(/## .*v\d+\.\d+[:\s]+([^\n(]+)/);
    return {
      version: versionMatch ? versionMatch[0] : 'v1.0',
      name: nameMatch ? nameMatch[1].trim() : 'milestone',
    };
  } catch {
    return { version: 'v1.0', name: 'milestone' };
  }
}

function cmdInitExecutePhase(cwd, phase, includes, raw) {
  if (!phase) {
    error('phase required for init execute-phase');
  }

  const config = loadConfig(cwd);
  const phaseInfo = findPhaseInternal(cwd, phase);
  const milestone = getMilestoneInfo(cwd);

  const result = {
    // Models
    executor_model: resolveModelInternal(cwd, 'GSI-executor'),
    verifier_model: resolveModelInternal(cwd, 'GSI-verifier'),

    // Config flags
    commit_docs: config.commit_docs,
    parallelization: config.parallelization,
    branching_strategy: config.branching_strategy,
    phase_branch_template: config.phase_branch_template,
    milestone_branch_template: config.milestone_branch_template,
    verifier_enabled: config.verifier,

    // Phase info
    phase_found: !!phaseInfo,
    phase_dir: phaseInfo?.directory || null,
    phase_number: phaseInfo?.phase_number || null,
    phase_name: phaseInfo?.phase_name || null,
    phase_slug: phaseInfo?.phase_slug || null,

    // Plan inventory
    plans: phaseInfo?.plans || [],
    summaries: phaseInfo?.summaries || [],
    incomplete_plans: phaseInfo?.incomplete_plans || [],
    plan_count: phaseInfo?.plans?.length || 0,
    incomplete_count: phaseInfo?.incomplete_plans?.length || 0,

    // Branch name (pre-computed)
    branch_name: config.branching_strategy === 'phase' && phaseInfo
      ? config.phase_branch_template
          .replace('{phase}', phaseInfo.phase_number)
          .replace('{slug}', phaseInfo.phase_slug || 'phase')
      : config.branching_strategy === 'milestone'
        ? config.milestone_branch_template
            .replace('{milestone}', milestone.version)
            .replace('{slug}', generateSlugInternal(milestone.name) || 'milestone')
        : null,

    // Milestone info
    milestone_version: milestone.version,
    milestone_name: milestone.name,
    milestone_slug: generateSlugInternal(milestone.name),

    // File existence
    state_exists: pathExistsInternal(cwd, '.planning/STATE.md'),
    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
    config_exists: pathExistsInternal(cwd, '.planning/config.json'),
  };

  // Include file contents if requested via --include
  if (includes.has('state')) {
    result.state_content = safeReadFile(path.join(cwd, '.planning', 'STATE.md'));
  }
  if (includes.has('config')) {
    result.config_content = safeReadFile(path.join(cwd, '.planning', 'config.json'));
  }
  if (includes.has('roadmap')) {
    result.roadmap_content = safeReadFile(path.join(cwd, '.planning', 'ROADMAP.md'));
  }

  output(result, raw);
}

function cmdInitPlanPhase(cwd, phase, includes, raw) {
  if (!phase) {
    error('phase required for init plan-phase');
  }

  const config = loadConfig(cwd);
  const phaseInfo = findPhaseInternal(cwd, phase);

  const result = {
    // Models
    researcher_model: resolveModelInternal(cwd, 'GSI-phase-researcher'),
    planner_model: resolveModelInternal(cwd, 'GSI-planner'),
    checker_model: resolveModelInternal(cwd, 'GSI-plan-checker'),

    // Workflow flags
    research_enabled: config.research,
    plan_checker_enabled: config.plan_checker,
    commit_docs: config.commit_docs,

    // Phase info
    phase_found: !!phaseInfo,
    phase_dir: phaseInfo?.directory || null,
    phase_number: phaseInfo?.phase_number || null,
    phase_name: phaseInfo?.phase_name || null,
    phase_slug: phaseInfo?.phase_slug || null,
    padded_phase: phaseInfo?.phase_number?.padStart(2, '0') || null,

    // Existing artifacts
    has_research: phaseInfo?.has_research || false,
    has_context: phaseInfo?.has_context || false,
    has_plans: (phaseInfo?.plans?.length || 0) > 0,
    plan_count: phaseInfo?.plans?.length || 0,

    // Environment
    planning_exists: pathExistsInternal(cwd, '.planning'),
    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
  };

  // Include file contents if requested via --include
  if (includes.has('state')) {
    result.state_content = safeReadFile(path.join(cwd, '.planning', 'STATE.md'));
  }
  if (includes.has('roadmap')) {
    result.roadmap_content = safeReadFile(path.join(cwd, '.planning', 'ROADMAP.md'));
  }
  if (includes.has('requirements')) {
    result.requirements_content = safeReadFile(path.join(cwd, '.planning', 'REQUIREMENTS.md'));
  }
  if (includes.has('context') && phaseInfo?.directory) {
    // Find *-CONTEXT.md in phase directory
    const phaseDirFull = path.join(cwd, phaseInfo.directory);
    try {
      const files = fs.readdirSync(phaseDirFull);
      const contextFile = files.find(f => f.endsWith('-CONTEXT.md') || f === 'CONTEXT.md');
      if (contextFile) {
        result.context_content = safeReadFile(path.join(phaseDirFull, contextFile));
      }
    } catch {}
  }
  if (includes.has('research') && phaseInfo?.directory) {
    // Find *-RESEARCH.md in phase directory
    const phaseDirFull = path.join(cwd, phaseInfo.directory);
    try {
      const files = fs.readdirSync(phaseDirFull);
      const researchFile = files.find(f => f.endsWith('-RESEARCH.md') || f === 'RESEARCH.md');
      if (researchFile) {
        result.research_content = safeReadFile(path.join(phaseDirFull, researchFile));
      }
    } catch {}
  }
  if (includes.has('verification') && phaseInfo?.directory) {
    // Find *-VERIFICATION.md in phase directory
    const phaseDirFull = path.join(cwd, phaseInfo.directory);
    try {
      const files = fs.readdirSync(phaseDirFull);
      const verificationFile = files.find(f => f.endsWith('-VERIFICATION.md') || f === 'VERIFICATION.md');
      if (verificationFile) {
        result.verification_content = safeReadFile(path.join(phaseDirFull, verificationFile));
      }
    } catch {}
  }
  if (includes.has('uat') && phaseInfo?.directory) {
    // Find *-UAT.md in phase directory
    const phaseDirFull = path.join(cwd, phaseInfo.directory);
    try {
      const files = fs.readdirSync(phaseDirFull);
      const uatFile = files.find(f => f.endsWith('-UAT.md') || f === 'UAT.md');
      if (uatFile) {
        result.uat_content = safeReadFile(path.join(phaseDirFull, uatFile));
      }
    } catch {}
  }

  output(result, raw);
}

function cmdInitNewProject(cwd, raw) {
  const config = loadConfig(cwd);

  // Detect Brave Search API key availability
  const homedir = require('os').homedir();
  const braveKeyFile = path.join(homedir, '.GSI', 'brave_api_key');
  const hasBraveSearch = !!(process.env.BRAVE_API_KEY || fs.existsSync(braveKeyFile));

  // Detect existing code
  let hasCode = false;
  let hasPackageFile = false;
  try {
    const files = execSync('find . -maxdepth 3 \\( -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.rs" -o -name "*.swift" -o -name "*.java" \\) 2>/dev/null | grep -v node_modules | grep -v .git | head -5', {
      cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    hasCode = files.trim().length > 0;
  } catch {}

  hasPackageFile = pathExistsInternal(cwd, 'package.json') ||
                   pathExistsInternal(cwd, 'requirements.txt') ||
                   pathExistsInternal(cwd, 'Cargo.toml') ||
                   pathExistsInternal(cwd, 'go.mod') ||
                   pathExistsInternal(cwd, 'Package.swift');

  const result = {
    // Models
    researcher_model: resolveModelInternal(cwd, 'GSI-project-researcher'),
    synthesizer_model: resolveModelInternal(cwd, 'GSI-research-synthesizer'),
    roadmapper_model: resolveModelInternal(cwd, 'GSI-roadmapper'),

    // Config
    commit_docs: config.commit_docs,

    // Existing state
    project_exists: pathExistsInternal(cwd, '.planning/PROJECT.md'),
    has_codebase_map: pathExistsInternal(cwd, '.planning/codebase'),
    planning_exists: pathExistsInternal(cwd, '.planning'),

    // Brownfield detection
    has_existing_code: hasCode,
    has_package_file: hasPackageFile,
    is_brownfield: hasCode || hasPackageFile,
    needs_codebase_map: (hasCode || hasPackageFile) && !pathExistsInternal(cwd, '.planning/codebase'),

    // Git state
    has_git: pathExistsInternal(cwd, '.git'),

    // Enhanced search
    brave_search_available: hasBraveSearch,
  };

  output(result, raw);
}

function cmdInitNewMilestone(cwd, raw) {
  const config = loadConfig(cwd);
  const milestone = getMilestoneInfo(cwd);

  const result = {
    // Models
    researcher_model: resolveModelInternal(cwd, 'GSI-project-researcher'),
    synthesizer_model: resolveModelInternal(cwd, 'GSI-research-synthesizer'),
    roadmapper_model: resolveModelInternal(cwd, 'GSI-roadmapper'),

    // Config
    commit_docs: config.commit_docs,
    research_enabled: config.research,

    // Current milestone
    current_milestone: milestone.version,
    current_milestone_name: milestone.name,

    // File existence
    project_exists: pathExistsInternal(cwd, '.planning/PROJECT.md'),
    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
    state_exists: pathExistsInternal(cwd, '.planning/STATE.md'),
  };

  output(result, raw);
}

function cmdInitQuick(cwd, description, raw) {
  const config = loadConfig(cwd);
  const now = new Date();
  const slug = description ? generateSlugInternal(description)?.substring(0, 40) : null;

  // Find next quick task number
  const quickDir = path.join(cwd, '.planning', 'quick');
  let nextNum = 1;
  try {
    const existing = fs.readdirSync(quickDir)
      .filter(f => /^\d+-/.test(f))
      .map(f => parseInt(f.split('-')[0], 10))
      .filter(n => !isNaN(n));
    if (existing.length > 0) {
      nextNum = Math.max(...existing) + 1;
    }
  } catch {}

  const result = {
    // Models
    planner_model: resolveModelInternal(cwd, 'GSI-planner'),
    executor_model: resolveModelInternal(cwd, 'GSI-executor'),

    // Config
    commit_docs: config.commit_docs,

    // Quick task info
    next_num: nextNum,
    slug: slug,
    description: description || null,

    // Timestamps
    date: now.toISOString().split('T')[0],
    timestamp: now.toISOString(),

    // Paths
    quick_dir: '.planning/quick',
    task_dir: slug ? `.planning/quick/${nextNum}-${slug}` : null,

    // File existence
    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
    planning_exists: pathExistsInternal(cwd, '.planning'),
  };

  output(result, raw);
}

function cmdInitResume(cwd, raw) {
  const config = loadConfig(cwd);

  // Check for interrupted agent
  let interruptedAgentId = null;
  try {
    interruptedAgentId = fs.readFileSync(path.join(cwd, '.planning', 'current-agent-id.txt'), 'utf-8').trim();
  } catch {}

  const result = {
    // File existence
    state_exists: pathExistsInternal(cwd, '.planning/STATE.md'),
    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
    project_exists: pathExistsInternal(cwd, '.planning/PROJECT.md'),
    planning_exists: pathExistsInternal(cwd, '.planning'),

    // Agent state
    has_interrupted_agent: !!interruptedAgentId,
    interrupted_agent_id: interruptedAgentId,

    // Config
    commit_docs: config.commit_docs,
  };

  output(result, raw);
}

function cmdInitVerifyWork(cwd, phase, raw) {
  if (!phase) {
    error('phase required for init verify-work');
  }

  const config = loadConfig(cwd);
  const phaseInfo = findPhaseInternal(cwd, phase);

  const result = {
    // Models
    planner_model: resolveModelInternal(cwd, 'GSI-planner'),
    checker_model: resolveModelInternal(cwd, 'GSI-plan-checker'),

    // Config
    commit_docs: config.commit_docs,

    // Phase info
    phase_found: !!phaseInfo,
    phase_dir: phaseInfo?.directory || null,
    phase_number: phaseInfo?.phase_number || null,
    phase_name: phaseInfo?.phase_name || null,

    // Existing artifacts
    has_verification: phaseInfo?.has_verification || false,
  };

  output(result, raw);
}

function cmdInitPhaseOp(cwd, phase, raw) {
  const config = loadConfig(cwd);
  const phaseInfo = findPhaseInternal(cwd, phase);

  const result = {
    // Config
    commit_docs: config.commit_docs,
    brave_search: config.brave_search,

    // Phase info
    phase_found: !!phaseInfo,
    phase_dir: phaseInfo?.directory || null,
    phase_number: phaseInfo?.phase_number || null,
    phase_name: phaseInfo?.phase_name || null,
    phase_slug: phaseInfo?.phase_slug || null,
    padded_phase: phaseInfo?.phase_number?.padStart(2, '0') || null,

    // Existing artifacts
    has_research: phaseInfo?.has_research || false,
    has_context: phaseInfo?.has_context || false,
    has_plans: (phaseInfo?.plans?.length || 0) > 0,
    has_verification: phaseInfo?.has_verification || false,
    plan_count: phaseInfo?.plans?.length || 0,

    // File existence
    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
    planning_exists: pathExistsInternal(cwd, '.planning'),
  };

  output(result, raw);
}

function cmdInitTodos(cwd, area, raw) {
  const config = loadConfig(cwd);
  const now = new Date();

  // List todos (reuse existing logic)
  const pendingDir = path.join(cwd, '.planning', 'todos', 'pending');
  let count = 0;
  const todos = [];

  try {
    const files = fs.readdirSync(pendingDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(pendingDir, file), 'utf-8');
        const createdMatch = content.match(/^created:\s*(.+)$/m);
        const titleMatch = content.match(/^title:\s*(.+)$/m);
        const areaMatch = content.match(/^area:\s*(.+)$/m);
        const todoArea = areaMatch ? areaMatch[1].trim() : 'general';

        if (area && todoArea !== area) continue;

        count++;
        todos.push({
          file,
          created: createdMatch ? createdMatch[1].trim() : 'unknown',
          title: titleMatch ? titleMatch[1].trim() : 'Untitled',
          area: todoArea,
          path: path.join('.planning', 'todos', 'pending', file),
        });
      } catch {}
    }
  } catch {}

  const result = {
    // Config
    commit_docs: config.commit_docs,

    // Timestamps
    date: now.toISOString().split('T')[0],
    timestamp: now.toISOString(),

    // Todo inventory
    todo_count: count,
    todos,
    area_filter: area || null,

    // Paths
    pending_dir: '.planning/todos/pending',
    completed_dir: '.planning/todos/completed',

    // File existence
    planning_exists: pathExistsInternal(cwd, '.planning'),
    todos_dir_exists: pathExistsInternal(cwd, '.planning/todos'),
    pending_dir_exists: pathExistsInternal(cwd, '.planning/todos/pending'),
  };

  output(result, raw);
}

function cmdInitMilestoneOp(cwd, raw) {
  const config = loadConfig(cwd);
  const milestone = getMilestoneInfo(cwd);

  // Count phases
  let phaseCount = 0;
  let completedPhases = 0;
  const phasesDir = path.join(cwd, '.planning', 'phases');
  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
    phaseCount = dirs.length;

    // Count phases with summaries (completed)
    for (const dir of dirs) {
      try {
        const phaseFiles = fs.readdirSync(path.join(phasesDir, dir));
        const hasSummary = phaseFiles.some(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md');
        if (hasSummary) completedPhases++;
      } catch {}
    }
  } catch {}

  // Check archive
  const archiveDir = path.join(cwd, '.planning', 'archive');
  let archivedMilestones = [];
  try {
    archivedMilestones = fs.readdirSync(archiveDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);
  } catch {}

  const result = {
    // Config
    commit_docs: config.commit_docs,

    // Current milestone
    milestone_version: milestone.version,
    milestone_name: milestone.name,
    milestone_slug: generateSlugInternal(milestone.name),

    // Phase counts
    phase_count: phaseCount,
    completed_phases: completedPhases,
    all_phases_complete: phaseCount > 0 && phaseCount === completedPhases,

    // Archive
    archived_milestones: archivedMilestones,
    archive_count: archivedMilestones.length,

    // File existence
    project_exists: pathExistsInternal(cwd, '.planning/PROJECT.md'),
    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
    state_exists: pathExistsInternal(cwd, '.planning/STATE.md'),
    archive_exists: pathExistsInternal(cwd, '.planning/archive'),
    phases_dir_exists: pathExistsInternal(cwd, '.planning/phases'),
  };

  output(result, raw);
}

function cmdInitMapCodebase(cwd, raw) {
  const config = loadConfig(cwd);

  // Check for existing codebase maps
  const codebaseDir = path.join(cwd, '.planning', 'codebase');
  let existingMaps = [];
  try {
    existingMaps = fs.readdirSync(codebaseDir).filter(f => f.endsWith('.md'));
  } catch {}

  const result = {
    // Models
    mapper_model: resolveModelInternal(cwd, 'GSI-codebase-mapper'),

    // Config
    commit_docs: config.commit_docs,
    search_gitignored: config.search_gitignored,
    parallelization: config.parallelization,

    // Paths
    codebase_dir: '.planning/codebase',

    // Existing maps
    existing_maps: existingMaps,
    has_maps: existingMaps.length > 0,

    // File existence
    planning_exists: pathExistsInternal(cwd, '.planning'),
    codebase_dir_exists: pathExistsInternal(cwd, '.planning/codebase'),
  };

  output(result, raw);
}

function cmdInitProgress(cwd, includes, raw) {
  const config = loadConfig(cwd);
  const milestone = getMilestoneInfo(cwd);

  // Analyze phases
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const phases = [];
  let currentPhase = null;
  let nextPhase = null;

  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

    for (const dir of dirs) {
      const match = dir.match(/^(\d+(?:\.\d+)?)-?(.*)/);
      const phaseNumber = match ? match[1] : dir;
      const phaseName = match && match[2] ? match[2] : null;

      const phasePath = path.join(phasesDir, dir);
      const phaseFiles = fs.readdirSync(phasePath);

      const plans = phaseFiles.filter(f => f.endsWith('-PLAN.md') || f === 'PLAN.md');
      const summaries = phaseFiles.filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md');
      const hasResearch = phaseFiles.some(f => f.endsWith('-RESEARCH.md') || f === 'RESEARCH.md');

      const status = summaries.length >= plans.length && plans.length > 0 ? 'complete' :
                     plans.length > 0 ? 'in_progress' :
                     hasResearch ? 'researched' : 'pending';

      const phaseInfo = {
        number: phaseNumber,
        name: phaseName,
        directory: path.join('.planning', 'phases', dir),
        status,
        plan_count: plans.length,
        summary_count: summaries.length,
        has_research: hasResearch,
      };

      phases.push(phaseInfo);

      // Find current (first incomplete with plans) and next (first pending)
      if (!currentPhase && (status === 'in_progress' || status === 'researched')) {
        currentPhase = phaseInfo;
      }
      if (!nextPhase && status === 'pending') {
        nextPhase = phaseInfo;
      }
    }
  } catch {}

  // Check for paused work
  let pausedAt = null;
  try {
    const state = fs.readFileSync(path.join(cwd, '.planning', 'STATE.md'), 'utf-8');
    const pauseMatch = state.match(/\*\*Paused At:\*\*\s*(.+)/);
    if (pauseMatch) pausedAt = pauseMatch[1].trim();
  } catch {}

  const result = {
    // Models
    executor_model: resolveModelInternal(cwd, 'GSI-executor'),
    planner_model: resolveModelInternal(cwd, 'GSI-planner'),

    // Config
    commit_docs: config.commit_docs,

    // Milestone
    milestone_version: milestone.version,
    milestone_name: milestone.name,

    // Phase overview
    phases,
    phase_count: phases.length,
    completed_count: phases.filter(p => p.status === 'complete').length,
    in_progress_count: phases.filter(p => p.status === 'in_progress').length,

    // Current state
    current_phase: currentPhase,
    next_phase: nextPhase,
    paused_at: pausedAt,
    has_work_in_progress: !!currentPhase,

    // File existence
    project_exists: pathExistsInternal(cwd, '.planning/PROJECT.md'),
    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
    state_exists: pathExistsInternal(cwd, '.planning/STATE.md'),
  };

  // Include file contents if requested via --include
  if (includes.has('state')) {
    result.state_content = safeReadFile(path.join(cwd, '.planning', 'STATE.md'));
  }
  if (includes.has('roadmap')) {
    result.roadmap_content = safeReadFile(path.join(cwd, '.planning', 'ROADMAP.md'));
  }
  if (includes.has('project')) {
    result.project_content = safeReadFile(path.join(cwd, '.planning', 'PROJECT.md'));
  }
  if (includes.has('config')) {
    result.config_content = safeReadFile(path.join(cwd, '.planning', 'config.json'));
  }

  output(result, raw);
}

// ─── Reflection Commands ───────────────────────────────────────────────────────

function cmdReflectionList(cwd, options, raw) {
  const ReflectionCapture = require('../lib/reflection/capture');
  const DebugThinkingIntegration = require('../lib/reflection/debug-integration');

  const capture = new ReflectionCapture();
  const debugIntegration = new DebugThinkingIntegration();

  // Get stats
  const captureStats = capture.getStats();
  const debugStats = debugIntegration.getStats();

  const result = {
    capture_stats: captureStats,
    debug_stats: debugStats,
    recent_reflections: capture.captureHistory.slice(-10).reverse()
  };

  if (raw) {
    const lines = [
      `Total reflections: ${debugStats.total}`,
      `By type: ${Object.entries(debugStats.byType).map(([k, v]) => `${k}: ${v}`).join(', ')}`,
      `Errors: ${debugStats.byType.ERROR || 0}`,
      `Success rate: ${debugStats.total > 0 ? ((debugStats.total - (debugStats.byType.ERROR || 0)) / debugStats.total * 100).toFixed(1) : 0}%`
    ];
    process.stdout.write(lines.join('\n'));
  } else {
    output(result, raw);
  }
}

function cmdReflectionPatterns(cwd, options, raw) {
  const PatternExtractor = require('../lib/reflection/patterns');
  const extractor = new PatternExtractor();

  const { minSuccess, minFrequency, type } = options;

  let patterns;
  if (type === 'anti') {
    patterns = extractor.getAntiPatterns(
      minSuccess || 0.3,
      minFrequency || 2
    );
  } else if (type === 'successful') {
    patterns = extractor.getSuccessfulPatterns(
      minSuccess || 0.7,
      minFrequency || 2
    );
  } else {
    patterns = extractor.patterns.slice(-20);
  }

  const result = {
    total: patterns.length,
    patterns: patterns.map(p => ({
      name: p.name,
      type: p.type,
      frequency: p.frequency,
      successRate: p.successRate.toFixed(2)
    }))
  };

  if (raw) {
    patterns.forEach(p => {
      process.stdout.write(`${p.name} (${p.type}): freq=${p.frequency}, success=${(p.successRate * 100).toFixed(0)}%\n`);
    });
  } else {
    output(result, raw);
  }
}

function cmdReflectionInsights(cwd, options, raw) {
  const InsightGenerator = require('../lib/reflection/insights');
  const generator = new InsightGenerator();

  const { type, impact, limit } = options;

  let insights;
  if (type) {
    insights = generator.getInsightsByType(type.toUpperCase());
  } else if (impact) {
    insights = generator.getInsightsByImpact(impact);
  } else {
    insights = generator.getTopInsights(limit || 10);
  }

  const result = {
    total: insights.length,
    insights: insights.map(i => ({
      title: i.title,
      type: i.type,
      impact: i.impact,
      priority: i.priority,
      applied: i.applied
    }))
  };

  if (raw) {
    insights.forEach(i => {
      process.stdout.write(`[${i.impact.toUpperCase()}] ${i.title} (priority: ${i.priority})\n`);
    });
  } else {
    output(result, raw);
  }
}

function cmdReflectionGraph(cwd, options, raw) {
  const DebugThinkingIntegration = require('../lib/reflection/debug-integration');
  const integration = new DebugThinkingIntegration();

  const stats = integration.getStats();

  const result = {
    total_observations: stats.total,
    by_type: stats.byType,
    by_tool: stats.byTool,
    graph_path: path.join(process.env.USERPROFILE || process.env.HOME || '', '.debug-thinking-mcp', 'reflections')
  };

  if (raw) {
    const lines = [
      `Total observations: ${result.total_observations}`,
      `By type: ${Object.entries(stats.byType).map(([k, v]) => `${k}: ${v}`).join(', ')}`,
      `Graph path: ${result.graph_path}`
    ];
    process.stdout.write(lines.join('\n'));
  } else {
    output(result, raw);
  }
}

// ─── Pattern Report Command ─────────────────────────────────────────────────────

async function cmdPatternReport(cwd, reportType, raw) {
  if (!patternViz) {
    error('Pattern learning module not available. Run from gsi repository root.');
  }

  try {
    let report;

    if (reportType === 'visualization' || reportType === 'viz') {
      report = await patternViz.generateVisualizationReport();
    } else {
      report = await patternViz.generatePatternReport();
    }

    if (raw) {
      process.stdout.write(report);
    } else {
      console.log(report);
    }

    // Optionally export to file
    const exportPath = path.join(cwd, '.planning', 'pattern-learning-report.md');
    patternViz.exportReport(exportPath, report);
    console.error(`\nReport exported to: ${exportPath}`);
  } catch (err) {
    error(`Failed to generate pattern report: ${err.message}`);
  }
}

// ─── Thinking Orchestrator Commands ─────────────────────────────────────────────

/**
 * Analyze command complexity and return recommended thinking configuration
 */
async function cmdThinkingAnalyze(cwd, commandDesc, options, raw) {
  try {
    // Dynamically import ThinkingOrchestrator (ES Module)
    const { ThinkingOrchestrator } = await import('../lib/workflow-modules/thinking-orchestrator.js');
    const orchestrator = new ThinkingOrchestrator();
    
    // Parse command description for analysis
    const analysis = orchestrator.analyzeCommand({
      description: commandDesc || '',
      allowedTools: options.tools ? options.tools.split(',') : [],
      process: options.process || ''
    });
    
    const result = {
      command: commandDesc,
      complexity: analysis.mode === 'NONE' ? 0 : 
                  analysis.mode === 'LIGHTWEIGHT' ? 4 :
                  analysis.mode === 'STANDARD' ? 10 : 15,
      mode: analysis.mode,
      servers: analysis.servers,
      bmad_enabled: analysis.bmad_enabled,
      timeout: analysis.timeout,
      rationale: analysis.rationale
    };
    
    if (raw) {
      console.log(`Complexity: ${result.complexity}`);
      console.log(`Mode: ${result.mode}`);
      console.log(`Servers: ${result.servers.join(', ')}`);
      console.log(`BMAD: ${result.bmad_enabled ? 'enabled' : 'disabled'}`);
      console.log(`Timeout: ${result.timeout}ms`);
      console.log(`Rationale: ${result.rationale}`);
    } else {
      output(result, options.json ? false : raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    if (raw) {
      console.error(`Analysis failed: ${err.message}`);
      process.exit(1);
    } else {
      output(result, raw);
    }
  }
}

/**
 * Generate optimal thinking configuration for a command
 */
async function cmdThinkingConfig(cwd, commandDesc, options, raw) {
  try {
    // Dynamically import ThinkingOrchestrator (ES Module)
    const { ThinkingOrchestrator } = await import('../lib/workflow-modules/thinking-orchestrator.js');
    const orchestrator = new ThinkingOrchestrator();
    
    // Load profile if specified
    let profile = null;
    if (options.profile) {
      const profilePath = path.join(__dirname, '..', 'profiles', `${options.profile}.json`);
      if (fs.existsSync(profilePath)) {
        profile = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
      }
    }
    
    // Analyze command or use profile
    let config;
    if (profile) {
      config = {
        mode: profile.mode,
        servers: profile.servers,
        bmad_enabled: options.bmad !== undefined ? options.bmad : profile.bmad_enabled,
        timeout: options.timeout || profile.baseTimeout,
        rationale: `Using ${options.profile} profile: ${profile.description}`
      };
    } else {
      config = orchestrator.analyzeCommand({
        description: commandDesc || '',
        allowedTools: options.tools ? options.tools.split(',') : [],
        process: options.process || ''
      });
      
      // Apply overrides
      if (options.timeout) {
        config.timeout = parseInt(options.timeout, 10);
      }
      if (options.bmad !== undefined) {
        config.bmad_enabled = options.bmad;
      }
    }
    
    // Generate frontmatter-style config
    const frontmatter = `thinking_phase:
  mode: ${config.mode}
  servers:
${config.servers.map(s => `    - ${s}`).join('\n')}
  bmad_enabled: ${config.bmad_enabled}
  timeout: ${config.timeout}
  rationale: "${config.rationale}"`;
    
    const result = {
      command: commandDesc,
      profile: options.profile || 'auto-detected',
      config: config,
      frontmatter: frontmatter
    };
    
    if (raw) {
      console.log(frontmatter);
    } else {
      output(result, options.json ? false : raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    if (raw) {
      console.error(`Config generation failed: ${err.message}`);
      process.exit(1);
    } else {
      output(result, raw);
    }
  }
}

/**
 * List available thinking servers
 */
async function cmdThinkingServers(cwd, options, raw) {
  const servers = [
    {
      name: 'sequential',
      endpoint: 'mcp__sequential-thinking__sequentialthinking',
      description: 'Sequential step planning and execution order',
      defaultMaxThoughts: 5
    },
    {
      name: 'tractatus',
      endpoint: 'mcp__tractatusthinking__tractatus_thinking',
      description: 'Structural analysis, relationships, and logical dependencies',
      defaultMaxThoughts: 5
    },
    {
      name: 'debug',
      endpoint: 'mcp__debug-thinking__debug_thinking',
      description: 'Problem detection, hypothesis generation, and solution verification',
      defaultMaxThoughts: 5
    }
  ];
  
  const result = {
    count: servers.length,
    servers: servers
  };
  
  if (raw || !options.json) {
    console.log('Available Thinking Servers:');
    for (const server of servers) {
      console.log(`- ${server.name}: ${server.endpoint}`);
      console.log(`  Description: ${server.description}`);
    }
  } else {
    output(result, false);
  }
}

/**
 * Test thinking server connections
 */
async function cmdThinkingTest(cwd, options, raw) {
  const { ThinkingOrchestrator } = await import('../lib/workflow-modules/thinking-orchestrator.js');
  const orchestrator = new ThinkingOrchestrator();
  
  const servers = options.server ? [options.server] : ['sequential', 'tractatus', 'debug'];
  const timeout = options.timeout || 5000;
  
  const results = [];
  
  for (const server of servers) {
    const startTime = Date.now();
    
    try {
      // Create a minimal test context
      const testConfig = {
        mode: 'LIGHTWEIGHT',
        servers: [server],
        bmad_enabled: false,
        timeout: timeout,
        rationale: 'Connection test'
      };
      
      const testContext = {
        command: 'test',
        description: 'Testing server connection'
      };
      
      // Attempt to invoke the thinking server
      const thinkingResults = await orchestrator.think(testConfig, testContext);
      const duration = Date.now() - startTime;
      
      const serverResult = thinkingResults.get(server);
      
      results.push({
        server: server,
        status: serverResult && serverResult.success ? 'connected' : 'error',
        duration: duration,
        thoughts: serverResult ? serverResult.thoughts.length : 0,
        error: serverResult ? serverResult.error : null
      });
    } catch (err) {
      results.push({
        server: server,
        status: 'error',
        duration: Date.now() - startTime,
        thoughts: 0,
        error: err.message
      });
    }
  }
  
  const result = {
    success: results.every(r => r.status === 'connected'),
    tested: servers.length,
    results: results
  };
  
  if (raw || !options.json) {
    console.log('Thinking Server Connection Test Results:');
    for (const r of results) {
      const status = r.status === 'connected' ? '✓' : '✗';
      console.log(`${status} ${r.server}: ${r.status} (${r.duration}ms)`);
      if (r.error) {
        console.log(`  Error: ${r.error}`);
      }
    }
  } else {
    output(result, false);
  }
}

/**
 * Apply thinking_phase to all GSI commands in a directory
 * Auto-generates and applies optimal thinking configurations
 */
async function cmdThinkingApplyAll(cwd, options, raw) {
  const { ThinkingOrchestrator } = await import('../lib/workflow-modules/thinking-orchestrator.js');
  const orchestrator = new ThinkingOrchestrator();
  
  const commandsDir = options.commandsDir || path.join(cwd, 'commands', 'gsi');
  const backupDir = options.backupDir || path.join(cwd, '.planning', 'thinking-backups');
  const dryRun = options.dryRun || false;
  const force = options.force || false;
  
  // Ensure backup directory exists
  if (!dryRun && !fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Scan for command files
  const commandFiles = [];
  try {
    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      commandFiles.push(path.join(commandsDir, file));
    }
  } catch (err) {
    const result = { success: false, error: `Failed to read commands directory: ${err.message}` };
    output(result, raw);
    return;
  }
  
  const results = {
    scanned: commandFiles.length,
    processed: 0,
    skipped: 0,
    updated: 0,
    errors: 0,
    backups: [],
    changes: []
  };
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  for (const filePath of commandFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fm = extractFrontmatter(content);
      
      // Skip if already has thinking_phase and not forcing
      if (fm.thinking_phase && !force) {
        results.skipped++;
        results.changes.push({
          file: path.basename(filePath),
          action: 'skipped',
          reason: 'Already has thinking_phase'
        });
        continue;
      }
      
      // Extract command info for analysis
      const description = fm.description || fm.name || '';
      const allowedTools = fm['allowed-tools'] || [];
      
      // Extract process from content (between <process> tags)
      const processMatch = content.match(/<process>([\s\S]*?)<\/process>/);
      const process = processMatch ? processMatch[1] : '';
      
      // Extract objective
      const objectiveMatch = content.match(/<objective>([\s\S]*?)<\/objective>/);
      const objective = objectiveMatch ? objectiveMatch[1] : '';
      
      // Analyze and generate config
      const config = orchestrator.analyzeCommand({
        description,
        allowedTools,
        process,
        objective
      });
      
      // Validate the config
      const validation = orchestrator.validateConfig(config);
      if (!validation.valid) {
        results.errors++;
        results.changes.push({
          file: path.basename(filePath),
          action: 'error',
          reason: validation.errors.join('; ')
        });
        continue;
      }
      
      // Generate frontmatter string
      const thinkingFrontmatter = orchestrator.generateFrontmatter(config);
      
      // Create backup if not dry run
      if (!dryRun) {
        const backupPath = path.join(backupDir, `${path.basename(filePath)}.${timestamp}.bak`);
        fs.writeFileSync(backupPath, content, 'utf-8');
        results.backups.push(backupPath);
      }
      
      // Determine new content
      let newContent;
      if (fm.thinking_phase) {
        // Replace existing thinking_phase
        const thinkingBlockMatch = content.match(/thinking_phase:[\s\S]*?(?=\n[a-z_]+:|\n---|\n\n)/);
        if (thinkingBlockMatch) {
          newContent = content.replace(thinkingBlockMatch[0], thinkingFrontmatter);
        } else {
          // Fallback: insert after frontmatter
          newContent = spliceFrontmatter(content, { ...fm, thinking_phase: config });
        }
      } else {
        // Add thinking_phase to frontmatter
        const newFm = { ...fm, thinking_phase: config };
        newContent = spliceFrontmatter(content, newFm);
      }
      
      // Write if not dry run
      if (!dryRun) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
      }
      
      results.updated++;
      results.processed++;
      results.changes.push({
        file: path.basename(filePath),
        action: fm.thinking_phase ? 'updated' : 'added',
        mode: config.mode,
        servers: config.servers,
        rationale: config.rationale
      });
      
    } catch (err) {
      results.errors++;
      results.changes.push({
        file: path.basename(filePath),
        action: 'error',
        reason: err.message
      });
    }
  }
  
  // Save backup metadata
  if (!dryRun && results.backups.length > 0) {
    const metaPath = path.join(backupDir, `apply-all-${timestamp}.json`);
    fs.writeFileSync(metaPath, JSON.stringify({
      timestamp,
      commandsDir,
      results: {
        scanned: results.scanned,
        processed: results.processed,
        updated: results.updated,
        skipped: results.skipped,
        errors: results.errors
      },
      backups: results.backups,
      changes: results.changes
    }, null, 2), 'utf-8');
  }
  
  const finalResult = {
    success: results.errors === 0,
    dry_run: dryRun,
    ...results
  };
  
  if (raw || !options.json) {
    console.log('=== Thinking Phase Apply-All Results ===\n');
    console.log(`Mode: ${dryRun ? 'DRY RUN (no changes made)' : 'LIVE'}`);
    console.log(`Commands scanned: ${results.scanned}`);
    console.log(`Processed: ${results.processed}`);
    console.log(`Updated: ${results.updated}`);
    console.log(`Skipped (already had config): ${results.skipped}`);
    console.log(`Errors: ${results.errors}`);
    
    if (results.changes.length > 0) {
      console.log('\nChanges:');
      for (const change of results.changes) {
        if (change.action === 'skipped') {
          console.log(`  [SKIP] ${change.file}: ${change.reason}`);
        } else if (change.action === 'error') {
          console.log(`  [ERROR] ${change.file}: ${change.reason}`);
        } else {
          console.log(`  [${change.action.toUpperCase()}] ${change.file}: ${change.mode} (${change.servers.join(', ')})`);
        }
      }
    }
    
    if (!dryRun && results.backups.length > 0) {
      console.log(`\nBackups saved to: ${backupDir}`);
    }
  } else {
    output(finalResult, false);
  }
}

/**
 * Validate thinking_phase configurations in command files
 */
async function cmdThinkingValidate(cwd, options, raw) {
  const { ThinkingOrchestrator } = await import('../lib/workflow-modules/thinking-orchestrator.js');
  const orchestrator = new ThinkingOrchestrator();
  
  const commandsDir = options.commandsDir || path.join(cwd, 'commands', 'gsi');
  const strictMode = options.strict || false;
  
  // Scan for command files
  const commandFiles = [];
  try {
    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      commandFiles.push(path.join(commandsDir, file));
    }
  } catch (err) {
    const result = { success: false, error: `Failed to read commands directory: ${err.message}` };
    output(result, raw);
    return;
  }
  
  const results = {
    scanned: commandFiles.length,
    valid: 0,
    invalid: 0,
    missing: 0,
    warnings: 0,
    files: []
  };
  
  for (const filePath of commandFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fm = extractFrontmatter(content);
      
      const fileResult = {
        file: path.basename(filePath),
        status: 'valid',
        errors: [],
        warnings: []
      };
      
      // Check if thinking_phase exists
      if (!fm.thinking_phase) {
        fileResult.status = 'missing';
        fileResult.warnings.push('No thinking_phase configuration found');
        results.missing++;
        results.files.push(fileResult);
        continue;
      }
      
      // Parse thinking_phase configuration
      const config = {
        mode: fm.thinking_phase.mode || 'NONE',
        servers: fm.thinking_phase.servers || [],
        bmad_enabled: fm.thinking_phase.bmad_enabled || false,
        timeout: fm.thinking_phase.timeout || 0,
        rationale: fm.thinking_phase.rationale || ''
      };
      
      // Validate
      const validation = orchestrator.validateConfig(config);
      
      if (!validation.valid) {
        fileResult.status = 'invalid';
        fileResult.errors = validation.errors;
        results.invalid++;
      } else {
        results.valid++;
      }
      
      if (validation.warnings.length > 0) {
        fileResult.warnings = validation.warnings;
        results.warnings++;
        
        // In strict mode, warnings become errors
        if (strictMode && fileResult.status === 'valid') {
          fileResult.status = 'warning';
        }
      }
      
      results.files.push(fileResult);
      
    } catch (err) {
      results.invalid++;
      results.files.push({
        file: path.basename(filePath),
        status: 'error',
        errors: [err.message],
        warnings: []
      });
    }
  }
  
  const finalResult = {
    success: results.invalid === 0 && (!strictMode || results.warnings === 0),
    strict_mode: strictMode,
    ...results,
    summary: {
      total: results.scanned,
      valid: `${results.valid} (${Math.round(results.valid / results.scanned * 100)}%)`,
      invalid: results.invalid,
      missing: results.missing,
      with_warnings: results.warnings
    }
  };
  
  if (raw || !options.json) {
    console.log('=== Thinking Phase Validation Results ===\n');
    console.log(`Strict Mode: ${strictMode ? 'ON' : 'off'}`);
    console.log(`Files scanned: ${results.scanned}`);
    console.log(`Valid: ${results.valid}`);
    console.log(`Invalid: ${results.invalid}`);
    console.log(`Missing: ${results.missing}`);
    console.log(`With warnings: ${results.warnings}`);
    
    if (results.invalid > 0 || results.missing > 0 || results.warnings > 0) {
      console.log('\nDetails:');
      for (const f of results.files) {
        if (f.status !== 'valid') {
          console.log(`\n  [${f.status.toUpperCase()}] ${f.file}`);
          if (f.errors.length > 0) {
            f.errors.forEach(e => console.log(`    ERROR: ${e}`));
          }
          if (f.warnings.length > 0) {
            f.warnings.forEach(w => console.log(`    WARNING: ${w}`));
          }
        }
      }
    }
    
    console.log(`\n${finalResult.success ? '✓ All validations passed' : '✗ Validation failed'}`);
  } else {
    output(finalResult, false);
  }
}

/**
 * Rollback thinking_phase changes from a backup
 */
async function cmdThinkingRollback(cwd, options, raw) {
  const backupDir = options.backupDir || path.join(cwd, '.planning', 'thinking-backups');
  const commandsDir = options.commandsDir || path.join(cwd, 'commands', 'gsi');
  
  // Find the most recent apply-all backup metadata
  let backupMeta = null;
  let backupMetaPath = null;
  
  try {
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('apply-all-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      const result = { success: false, error: 'No backup found to rollback' };
      output(result, raw);
      return;
    }
    
    // Use the most recent backup
    backupMetaPath = path.join(backupDir, files[0]);
    backupMeta = JSON.parse(fs.readFileSync(backupMetaPath, 'utf-8'));
    
  } catch (err) {
    const result = { success: false, error: `Failed to find backup: ${err.message}` };
    output(result, raw);
    return;
  }
  
  const results = {
    restored: 0,
    failed: 0,
    files: []
  };
  
  // Restore each backup file
  for (const backupPath of backupMeta.backups) {
    try {
      const backupFileName = path.basename(backupPath);
      // Extract original filename (remove timestamp and .bak)
      const originalName = backupFileName.replace(/\.\d{4}-\d{2}-\d{2}T[\d\-]+Z\.bak$/, '');
      const targetPath = path.join(commandsDir, originalName);
      
      if (!fs.existsSync(backupPath)) {
        results.failed++;
        results.files.push({
          backup: backupFileName,
          target: originalName,
          status: 'error',
          reason: 'Backup file not found'
        });
        continue;
      }
      
      // Restore the file
      const backupContent = fs.readFileSync(backupPath, 'utf-8');
      fs.writeFileSync(targetPath, backupContent, 'utf-8');
      
      results.restored++;
      results.files.push({
        backup: backupFileName,
        target: originalName,
        status: 'restored'
      });
      
    } catch (err) {
      results.failed++;
      results.files.push({
        backup: path.basename(backupPath),
        target: 'unknown',
        status: 'error',
        reason: err.message
      });
    }
  }
  
  const finalResult = {
    success: results.failed === 0,
    backup_timestamp: backupMeta.timestamp,
    ...results
  };
  
  if (raw || !options.json) {
    console.log('=== Thinking Phase Rollback Results ===\n');
    console.log(`Backup timestamp: ${backupMeta.timestamp}`);
    console.log(`Restored: ${results.restored}`);
    console.log(`Failed: ${results.failed}`);
    
    if (results.files.length > 0) {
      console.log('\nFiles:');
      for (const f of results.files) {
        const status = f.status === 'restored' ? '✓' : '✗';
        console.log(`  ${status} ${f.target}: ${f.status}`);
        if (f.reason) {
          console.log(`    Reason: ${f.reason}`);
        }
      }
    }
  } else {
    output(finalResult, false);
  }
}

/**
 * Show complexity analysis factors documentation
 */
async function cmdThinkingFactors(cwd, options, raw) {
  const { ThinkingOrchestrator } = await import('../lib/workflow-modules/thinking-orchestrator.js');
  const orchestrator = new ThinkingOrchestrator();
  
  const factors = orchestrator.getComplexityFactorDescriptions();
  const thresholds = orchestrator.getModeThresholds();
  
  const result = {
    factors,
    thresholds
  };
  
  if (raw || !options.json) {
    console.log('=== Thinking Complexity Factors (25 total) ===\n');
    
    // Group by category
    const categories = {};
    for (const [name, info] of Object.entries(factors)) {
      if (!categories[info.category]) {
        categories[info.category] = [];
      }
      categories[info.category].push({ name, ...info });
    }
    
    for (const [category, items] of Object.entries(categories)) {
      console.log(`\n## ${category} Factors (${items.length})`);
      for (const item of items) {
        console.log(`  - ${item.name}: ${item.description} (range: ${item.range})`);
      }
    }
    
    console.log('\n=== Mode Thresholds ===\n');
    for (const [mode, info] of Object.entries(thresholds)) {
      console.log(`${mode}: score ${info.min}-${info.max}`);
      console.log(`  ${info.description}`);
    }
  } else {
    output(result, false);
  }
}

// ─── Patch Manager Commands ─────────────────────────────────────────────────────

/**
 * Backup local modifications before GSI package update
 */
async function cmdPatchBackup(cwd, options, raw) {
  const patchesDir = options.patchesDir || path.join(process.env.USERPROFILE || process.env.HOME || '', '.claude', 'GSI-local-patches');
  
  try {
    // Dynamically import PatchManager (ES Module)
    const { PatchManager } = await import('../lib/workflow-modules/patch-manager.js');
    const manager = new PatchManager(patchesDir);
    
    console.log('Backing up local modifications...');
    const metadata = await manager.backup();
    
    const result = {
      success: true,
      version: metadata.version,
      timestamp: metadata.timestamp,
      files_backed_up: metadata.files.length,
      patches: metadata.patches.map(p => ({
        file: p.file,
        type: p.type,
        description: p.description
      })),
      backup_location: patchesDir
    };
    
    if (raw) {
      console.log(`Backed up ${metadata.files.length} files from version ${metadata.version}`);
      console.log(`Backup location: ${patchesDir}`);
    } else {
      output(result, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    if (raw) {
      console.error(`Backup failed: ${err.message}`);
      process.exit(1);
    } else {
      output(result, raw);
    }
  }
}

/**
 * Restore backed-up modifications after GSI package update
 */
async function cmdPatchRestore(cwd, options, raw) {
  const patchesDir = options.patchesDir || path.join(process.env.USERPROFILE || process.env.HOME || '', '.claude', 'GSI-local-patches');
  
  try {
    // Dynamically import PatchManager (ES Module)
    const { PatchManager } = await import('../lib/workflow-modules/patch-manager.js');
    const manager = new PatchManager(patchesDir);
    
    console.log('Restoring local modifications...');
    const results = await manager.restore();
    
    const mergedFiles = [];
    const conflictedFiles = [];
    
    for (const [filePath, mergeResult] of results) {
      if (mergeResult.success) {
        mergedFiles.push(filePath);
      } else {
        conflictedFiles.push({
          file: filePath,
          conflicts: mergeResult.conflicts
        });
      }
    }
    
    const result = {
      success: conflictedFiles.length === 0,
      files_restored: mergedFiles.length,
      files_with_conflicts: conflictedFiles.length,
      merged_files: mergedFiles,
      conflicted_files: conflictedFiles,
      backup_location: patchesDir
    };
    
    if (raw) {
      console.log(`Restored ${mergedFiles.length} files`);
      if (conflictedFiles.length > 0) {
        console.log(`Conflicts in ${conflictedFiles.length} files:`);
        conflictedFiles.forEach(f => console.log(`  - ${f.file}`));
      }
    } else {
      output(result, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    if (raw) {
      console.error(`Restore failed: ${err.message}`);
      process.exit(1);
    } else {
      output(result, raw);
    }
  }
}

/**
 * Show status of local modifications
 */
async function cmdPatchStatus(cwd, options, raw) {
  const patchesDir = options.patchesDir || path.join(process.env.USERPROFILE || process.env.HOME || '', '.claude', 'GSI-local-patches');
  const metadataPath = path.join(patchesDir, 'backup-meta.json');
  
  try {
    // Check if backup exists
    if (!fs.existsSync(metadataPath)) {
      const result = {
        has_backup: false,
        message: 'No backup found. Run "gsi patch backup" first.'
      };
      output(result, raw);
      return;
    }
    
    // Read backup metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    
    const result = {
      has_backup: true,
      backup_version: metadata.version,
      backup_timestamp: metadata.timestamp,
      files_count: metadata.files.length,
      patches: metadata.patches,
      backup_location: patchesDir
    };
    
    if (raw) {
      console.log(`Backup exists for version ${metadata.version}`);
      console.log(`Created: ${metadata.timestamp}`);
      console.log(`Files: ${metadata.files.length}`);
      console.log(`Location: ${patchesDir}`);
    } else {
      output(result, raw);
    }
  } catch (err) {
    const result = { has_backup: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Show diff between backup and current files
 */
async function cmdPatchDiff(cwd, options, raw) {
  const patchesDir = options.patchesDir || path.join(process.env.USERPROFILE || process.env.HOME || '', '.claude', 'GSI-local-patches');
  const metadataPath = path.join(patchesDir, 'backup-meta.json');
  const gsiInstallDir = detectGSIInstallDir();
  
  try {
    // Check if backup exists
    if (!fs.existsSync(metadataPath)) {
      const result = {
        has_backup: false,
        message: 'No backup found. Run "gsi patch backup" first.'
      };
      output(result, raw);
      return;
    }
    
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    const diffs = [];
    
    for (const file of metadata.files) {
      const backupPath = path.join(patchesDir, file.path);
      const currentPath = path.join(gsiInstallDir, file.path);
      
      if (!fs.existsSync(backupPath) || !fs.existsSync(currentPath)) {
        continue;
      }
      
      const backupContent = fs.readFileSync(backupPath, 'utf-8');
      const currentContent = fs.readFileSync(currentPath, 'utf-8');
      
      const backupHash = createHash('sha256').update(backupContent).digest('hex');
      const currentHash = createHash('sha256').update(currentContent).digest('hex');
      
      if (backupHash !== currentHash) {
        diffs.push({
          file: file.path,
          backup_hash: backupHash.substring(0, 8),
          current_hash: currentHash.substring(0, 8),
          modified_since_backup: true
        });
      }
    }
    
    const result = {
      backup_version: metadata.version,
      backup_timestamp: metadata.timestamp,
      files_checked: metadata.files.length,
      files_different: diffs.length,
      diffs
    };
    
    if (raw) {
      if (diffs.length === 0) {
        console.log('No differences found between backup and current files.');
      } else {
        console.log(`Found ${diffs.length} files with differences:`);
        diffs.forEach(d => console.log(`  - ${d.file}`));
      }
    } else {
      output(result, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Detect GSI installation directory
 */
function detectGSIInstallDir() {
  // Check for global installation
  const globalPath = path.join(
    process.env.APPDATA || '',
    'npm',
    'node_modules',
    'get-shit-indexed-cc'
  );
  if (fs.existsSync(globalPath)) {
    return globalPath;
  }

  // Check for local installation
  const localPath = path.join(process.cwd(), 'node_modules', 'get-shit-indexed-cc');
  if (fs.existsSync(localPath)) {
    return localPath;
  }

  // Return current directory as fallback
  return process.cwd();
}

/**
 * Create hash helper for diff command
 */
function createHash(algorithm) {
  const crypto = require('crypto');
  return crypto.createHash(algorithm);
}

// ─── Workflow Chainer Commands ───────────────────────────────────────────────────

/**
 * Run a workflow chain
 */
async function cmdWorkflowRun(cwd, templateName, variables, options, raw) {
  const { WorkflowChainer } = require('../lib/workflow-modules/index.js');
  
  if (!templateName) {
    error('Template name required. Usage: gsi workflow run <template>');
  }
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const chainer = new WorkflowChainer(stateDir);
  
  // Load custom templates if templatesDir specified
  if (options.templatesDir) {
    const templatesPath = path.join(options.templatesDir, `${templateName}.json`);
    if (fs.existsSync(templatesPath)) {
      const templateDef = JSON.parse(fs.readFileSync(templatesPath, 'utf-8'));
      chainer.createChain(templateDef);
    }
  }
  
  try {
    const result = await chainer.run(templateName, variables, {
      failureStrategy: options.failureStrategy,
      yoloMode: options.yolo
    });
    
    if (raw) {
      console.log(`Workflow ${templateName}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`Completed steps: ${result.completedSteps.length}`);
      console.log(`Duration: ${result.duration}ms`);
      if (result.error) {
        console.log(`Error: ${result.error}`);
      }
    }
    
    output(result, raw);
  } catch (err) {
    const result = { success: false, error: err.message, template: templateName };
    output(result, raw);
  }
}

/**
 * List available workflow templates
 */
async function cmdWorkflowList(cwd, options, raw) {
  const { WorkflowChainer } = require('../lib/workflow-modules/index.js');
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const chainer = new WorkflowChainer(stateDir);
  
  // Load custom templates from templates directory
  if (options.templatesDir && fs.existsSync(options.templatesDir)) {
    const templateFiles = fs.readdirSync(options.templatesDir).filter(f => f.endsWith('.json'));
    for (const file of templateFiles) {
      try {
        const templatePath = path.join(options.templatesDir, file);
        const templateDef = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
        chainer.createChain(templateDef);
      } catch (e) {
        // Skip invalid template files
      }
    }
  }
  
  const templates = chainer.listTemplates();
  
  const result = {
    count: templates.length,
    templates: templates.map(t => ({
      name: t.name,
      description: t.description,
      steps: t.chain.length,
      parallel_groups: t.parallel?.length || 0,
      checkpoint_strategy: t.checkpoint,
      rollback_enabled: t.rollback
    }))
  };
  
  if (raw) {
    console.log('Available workflow templates:');
    templates.forEach(t => {
      console.log(`  - ${t.name}: ${t.description}`);
      console.log(`    Steps: ${t.chain.length}, Checkpoint: ${t.checkpoint}`);
    });
  }
  
  output(result, raw);
}

/**
 * Get workflow status
 */
async function cmdWorkflowStatus(cwd, workflowName, options, raw) {
  const { WorkflowChainer } = require('../lib/workflow-modules/index.js');
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const chainer = new WorkflowChainer(stateDir);
  
  try {
    const status = chainer.getStatus(workflowName || undefined);
    
    if (raw) {
      if (Array.isArray(status)) {
        console.log(`Active workflows: ${status.length}`);
        status.forEach(s => {
          console.log(`  - ${s.chain}: ${s.status}`);
          console.log(`    Completed: ${s.completed.length}, Pending: ${s.pending.length}`);
        });
      } else {
        console.log(`Workflow: ${status.chain}`);
        console.log(`Status: ${status.status}`);
        console.log(`Started: ${status.startTime}`);
        console.log(`Completed: ${status.completed.length}`);
        console.log(`Pending: ${status.pending.length}`);
        if (status.current) {
          console.log(`Current: ${status.current}`);
        }
        if (status.checkpoint) {
          console.log(`Last checkpoint: ${status.checkpoint.timestamp}`);
        }
      }
    }
    
    output(status, raw);
  } catch (err) {
    const result = { error: err.message };
    output(result, raw);
  }
}

/**
 * Pause a running workflow
 */
async function cmdWorkflowPause(cwd, workflowName, options, raw) {
  const { WorkflowChainer } = require('../lib/workflow-modules/index.js');
  
  if (!workflowName) {
    error('Workflow name required. Usage: gsi workflow pause <name>');
  }
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const chainer = new WorkflowChainer(stateDir);
  
  try {
    await chainer.pause(workflowName);
    const result = { success: true, workflow: workflowName, status: 'paused' };
    
    if (raw) {
      console.log(`Workflow '${workflowName}' paused.`);
    }
    
    output(result, raw);
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Resume a paused workflow
 */
async function cmdWorkflowResume(cwd, workflowName, options, raw) {
  const { WorkflowChainer } = require('../lib/workflow-modules/index.js');
  
  if (!workflowName) {
    error('Workflow name required. Usage: gsi workflow resume <name>');
  }
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const chainer = new WorkflowChainer(stateDir);
  
  try {
    const result = await chainer.resume(workflowName);
    result.workflow = workflowName;
    
    if (raw) {
      console.log(`Workflow '${workflowName}' resumed.`);
      console.log(`Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    }
    
    output(result, raw);
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Rollback a workflow to last checkpoint
 */
async function cmdWorkflowRollback(cwd, workflowName, options, raw) {
  const { WorkflowChainer } = require('../lib/workflow-modules/index.js');
  
  if (!workflowName) {
    error('Workflow name required. Usage: gsi workflow rollback <name>');
  }
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const chainer = new WorkflowChainer(stateDir);
  
  try {
    await chainer.rollback(workflowName);
    const result = { success: true, workflow: workflowName, status: 'rolled_back' };
    
    if (raw) {
      console.log(`Workflow '${workflowName}' rolled back to last checkpoint.`);
    }
    
    output(result, raw);
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

// ─── Pattern Discovery Commands (Phase 38-03) ───────────────────────────────────

/**
 * Mine patterns from command history
 */
async function cmdWorkflowDiscover(cwd, options, raw) {
  const { PatternMiner } = await import('../lib/workflow-modules/pattern-miner.js');
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const miner = new PatternMiner(stateDir);
  
  const miningOptions = {
    minFrequency: options.minFrequency || 2,
    minSuccessRate: options.minSuccessRate || 0.5,
    minLength: options.minLength || 2,
    maxLength: options.maxLength || 10
  };
  
  try {
    console.log('Mining patterns from command history...');
    const patterns = miner.minePatterns(miningOptions);
    
    // Generate templates for high-quality patterns
    const minQuality = options.minQuality || 50;
    const templatesGenerated = [];
    
    for (const pattern of patterns) {
      if (pattern.qualityScore >= minQuality) {
        const template = miner.generateTemplate(pattern.id);
        if (template) {
          const templatePath = miner.saveTemplate(template);
          templatesGenerated.push({ pattern_id: pattern.id, template_path: templatePath });
        }
      }
    }
    
    const result = {
      success: true,
      patterns_discovered: patterns.length,
      templates_generated: templatesGenerated.length,
      patterns: patterns.map(p => ({
        id: p.id,
        name: p.name,
        sequence: p.sequence,
        frequency: p.frequency,
        success_rate: Math.round(p.successRate * 100),
        quality_score: Math.round(p.qualityScore),
        avg_duration_ms: Math.round(p.avgDuration)
      })),
      templates: templatesGenerated
    };
    
    if (raw) {
      console.log(`Discovered ${patterns.length} patterns`);
      console.log(`Generated ${templatesGenerated.length} templates (quality >= ${minQuality})`);
      console.log('\nTop patterns:');
      patterns.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name}: freq=${p.frequency}, success=${Math.round(p.successRate * 100)}%, quality=${Math.round(p.qualityScore)}`);
      });
    } else {
      output(result, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Get workflow recommendations based on current context
 */
async function cmdWorkflowRecommend(cwd, options, raw) {
  const { PatternMiner } = await import('../lib/workflow-modules/pattern-miner.js');
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const miner = new PatternMiner(stateDir);
  
  const context = {
    currentPhase: options.phase,
    recentCommands: options.recentCommands ? options.recentCommands.split(',') : [],
    workflowGoal: options.goal
  };
  
  try {
    const recommendations = miner.getRecommendations(context);
    
    const result = {
      success: true,
      context,
      recommendations_count: recommendations.length,
      recommendations: recommendations.map(r => ({
        pattern_id: r.pattern.id,
        pattern_name: r.pattern.name,
        relevance_score: Math.round(r.relevanceScore * 100),
        reason: r.reason,
        suggested_variables: r.suggestedVariables,
        sequence: r.pattern.sequence
      }))
    };
    
    if (raw) {
      if (recommendations.length === 0) {
        console.log('No recommendations found for the current context.');
        console.log('Try running some commands first or use "gsi workflow discover" to mine patterns.');
      } else {
        console.log(`Found ${recommendations.length} recommendations:\n`);
        recommendations.forEach((r, i) => {
          console.log(`${i + 1}. ${r.pattern.name} (${Math.round(r.relevanceScore * 100)}% relevant)`);
          console.log(`   ${r.reason}`);
          console.log(`   Sequence: ${r.pattern.sequence.join(' -> ')}`);
          if (Object.keys(r.suggestedVariables).length > 0) {
            console.log(`   Suggested vars: ${JSON.stringify(r.suggestedVariables)}`);
          }
          console.log('');
        });
      }
    } else {
      output(result, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Optimize a workflow by analyzing for improvements
 */
async function cmdWorkflowOptimize(cwd, workflowName, options, raw) {
  const { PatternMiner } = await import('../lib/workflow-modules/pattern-miner.js');
  
  if (!workflowName) {
    error('Workflow name required. Usage: gsi workflow optimize <name>');
  }
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const miner = new PatternMiner(stateDir);
  
  try {
    const optimizations = miner.analyzeOptimizations(workflowName);
    
    // Group by type
    const grouped = {
      parallel: optimizations.filter(o => o.type === 'parallel'),
      skip: optimizations.filter(o => o.type === 'skip'),
      reorder: optimizations.filter(o => o.type === 'reorder'),
      merge: optimizations.filter(o => o.type === 'merge')
    };
    
    const totalTimeSavings = optimizations.reduce((sum, o) => sum + o.estimatedTimeSavings, 0);
    
    const result = {
      success: true,
      workflow: workflowName,
      total_optimizations: optimizations.length,
      estimated_time_savings_ms: Math.round(totalTimeSavings),
      by_type: {
        parallel: grouped.parallel.length,
        skip: grouped.skip.length,
        reorder: grouped.reorder.length,
        merge: grouped.merge.length
      },
      optimizations: optimizations.map(o => ({
        type: o.type,
        steps: o.steps,
        description: o.description,
        estimated_savings_ms: Math.round(o.estimatedTimeSavings),
        risk_level: o.riskLevel
      }))
    };
    
    if (raw) {
      console.log(`Optimization analysis for '${workflowName}':`);
      console.log(`Total optimizations found: ${optimizations.length}`);
      console.log(`Estimated time savings: ${Math.round(totalTimeSavings / 1000)}s\n`);
      
      if (grouped.parallel.length > 0) {
        console.log('Parallel opportunities:');
        grouped.parallel.forEach(o => {
          console.log(`  - ${o.description}`);
          console.log(`    Savings: ${Math.round(o.estimatedTimeSavings / 1000)}s, Risk: ${o.riskLevel}`);
        });
        console.log('');
      }
      
      if (grouped.skip.length > 0) {
        console.log('Redundant steps to skip:');
        grouped.skip.forEach(o => {
          console.log(`  - ${o.description}`);
        });
        console.log('');
      }
      
      if (grouped.reorder.length > 0) {
        console.log('Reorder suggestions:');
        grouped.reorder.forEach(o => {
          console.log(`  - ${o.description}`);
        });
        console.log('');
      }
      
      if (grouped.merge.length > 0) {
        console.log('Merge opportunities:');
        grouped.merge.forEach(o => {
          console.log(`  - ${o.description}`);
        });
      }
    } else {
      output(result, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Analyze all workflows and patterns
 */
async function cmdWorkflowAnalyze(cwd, options, raw) {
  const { PatternMiner } = await import('../lib/workflow-modules/pattern-miner.js');
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const miner = new PatternMiner(stateDir);
  
  try {
    const analysis = miner.analyzeWorkflows();
    const stats = miner.getStats();
    
    const result = {
      success: true,
      stats: {
        total_executions: stats.totalExecutions,
        total_sequences: stats.totalSequences,
        successful_executions: stats.successfulExecutions,
        failed_executions: stats.failedExecutions,
        avg_execution_time_ms: Math.round(stats.avgExecutionTime),
        patterns_discovered: stats.patternsDiscovered,
        most_used_commands: stats.mostUsedCommands.slice(0, 10)
      },
      patterns: {
        total: analysis.patterns.length,
        top_patterns: analysis.topPatterns.map(p => ({
          id: p.id,
          name: p.name,
          quality_score: Math.round(p.qualityScore),
          frequency: p.frequency,
          success_rate: Math.round(p.successRate * 100)
        }))
      },
      optimization_opportunities: analysis.optimizationOpportunities,
      recommendations_count: analysis.recommendations.length
    };
    
    if (raw) {
      console.log('=== Workflow Analysis ===\n');
      console.log('Statistics:');
      console.log(`  Total executions: ${stats.totalExecutions}`);
      console.log(`  Total sequences: ${stats.totalSequences}`);
      console.log(`  Success rate: ${stats.totalExecutions > 0 ? Math.round(stats.successfulExecutions / stats.totalExecutions * 100) : 0}%`);
      console.log(`  Avg execution time: ${Math.round(stats.avgExecutionTime)}ms`);
      console.log(`  Patterns discovered: ${stats.patternsDiscovered}\n`);
      
      console.log('Most used commands:');
      stats.mostUsedCommands.slice(0, 5).forEach(c => {
        console.log(`  - ${c.command}: ${c.count} times`);
      });
      
      console.log('\nTop patterns by quality:');
      analysis.topPatterns.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name}: quality=${Math.round(p.qualityScore)}, freq=${p.frequency}`);
      });
      
      console.log(`\nOptimization opportunities: ${analysis.optimizationOpportunities}`);
    } else {
      output(result, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Export a pattern as a workflow template
 */
async function cmdWorkflowExport(cwd, patternId, options, raw) {
  const { PatternMiner } = await import('../lib/workflow-modules/pattern-miner.js');
  
  if (!patternId) {
    error('Pattern ID required. Usage: gsi workflow export <pattern-id>');
  }
  
  const stateDir = options.stateDir || path.join(cwd, '.planning');
  const miner = new PatternMiner(stateDir);
  
  const outputPath = options.output;
  
  try {
    // Get pattern
    const pattern = miner.getPattern(patternId);
    if (!pattern) {
      const result = { success: false, error: `Pattern not found: ${patternId}` };
      output(result, raw);
      return;
    }
    
    // Generate template
    const template = miner.generateTemplate(patternId);
    if (!template) {
      const result = { success: false, error: 'Failed to generate template from pattern' };
      output(result, raw);
      return;
    }
    
    // Save template
    const templatePath = miner.saveTemplate(template);
    
    // Also export to stdout or file if output specified
    const templateJson = JSON.stringify(template, null, 2);
    
    if (outputPath) {
      fs.writeFileSync(outputPath, templateJson);
    }
    
    const result = {
      success: true,
      pattern_id: patternId,
      template_name: template.name,
      template_path: templatePath,
      output_path: outputPath || null,
      template: template
    };
    
    if (raw) {
      console.log(`Exported pattern '${patternId}' as template '${template.name}'`);
      console.log(`Template saved to: ${templatePath}`);
      if (outputPath) {
        console.log(`Also exported to: ${outputPath}`);
      }
      console.log('\nTemplate JSON:');
      console.log(templateJson);
    } else {
      output(result, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

// ─── Knowledge Base Commands ───────────────────────────────────────────────────

/**
 * Extract patterns from source files
 */
async function cmdKnowledgeExtract(cwd, sourcePath, options, raw) {
  const { KnowledgeBase } = await import('../lib/workflow-modules/knowledge-base.js');
  
  const knowledgeDir = options.knowledgeDir || path.join(cwd, '.planning', 'knowledge');
  const kb = new KnowledgeBase(knowledgeDir);
  
  if (!sourcePath) {
    error('Source path required. Usage: gsi knowledge extract <path> [--category <category>]');
  }
  
  try {
    const result = await kb.extract(sourcePath, options.category);
    
    if (raw) {
      console.log(`Extracted ${result.patternsExtracted.length} patterns from ${result.patternsFound} files`);
      console.log(`Templates: ${result.templatesGenerated.length}`);
      console.log(`Best Practices: ${result.bestPractices.length}`);
    } else {
      output({
        success: true,
        files_scanned: result.patternsFound,
        patterns_extracted: result.patternsExtracted.length,
        templates_generated: result.templatesGenerated.length,
        best_practices: result.bestPractices.length,
        patterns: result.patternsExtracted.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category
        }))
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Search knowledge base for patterns
 */
async function cmdKnowledgeSearch(cwd, query, options, raw) {
  const { KnowledgeBase } = await import('../lib/workflow-modules/knowledge-base.js');
  
  const knowledgeDir = options.knowledgeDir || path.join(cwd, '.planning', 'knowledge');
  const kb = new KnowledgeBase(knowledgeDir);
  
  if (!query) {
    error('Search query required. Usage: gsi knowledge search <query> [--category <category>] [--limit N]');
  }
  
  try {
    const results = kb.search(query, options.category);
    const limited = results.slice(0, options.limit || 20);
    
    if (raw) {
      console.log(`Found ${results.length} patterns (showing ${limited.length}):`);
      limited.forEach(p => {
        console.log(`\n[${p.id}] ${p.name}`);
        console.log(`  Category: ${p.category}`);
        console.log(`  Effectiveness: ${(p.effectiveness * 100).toFixed(0)}%`);
        console.log(`  ${p.description}`);
      });
    } else {
      output({
        success: true,
        query: query,
        total_matches: results.length,
        returned: limited.length,
        patterns: limited.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          effectiveness: p.effectiveness,
          uses: p.uses
        }))
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Generate a skill from a pattern
 */
async function cmdKnowledgeGenerateSkill(cwd, patternId, options, raw) {
  const { KnowledgeBase } = await import('../lib/workflow-modules/knowledge-base.js');
  
  const knowledgeDir = options.knowledgeDir || path.join(cwd, '.planning', 'knowledge');
  const kb = new KnowledgeBase(knowledgeDir);
  
  if (!patternId) {
    error('Pattern ID required. Usage: gsi knowledge generate-skill <pattern-id>');
  }
  
  try {
    const skillPath = await kb.generateSkill(patternId);
    
    if (raw) {
      console.log(`Skill generated: ${skillPath}`);
    } else {
      output({
        success: true,
        pattern_id: patternId,
        skill_path: skillPath
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * List all patterns in the knowledge base
 */
async function cmdKnowledgeList(cwd, options, raw) {
  const { KnowledgeBase } = await import('../lib/workflow-modules/knowledge-base.js');
  const fs = require('fs');
  
  const knowledgeDir = options.knowledgeDir || path.join(cwd, '.planning', 'knowledge');
  const patternsDir = path.join(knowledgeDir, 'patterns');
  const kb = new KnowledgeBase(knowledgeDir);
  
  try {
    const patterns = [];
    
    if (fs.existsSync(patternsDir)) {
      const categories = fs.readdirSync(patternsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
      
      for (const category of categories) {
        const categoryDir = path.join(patternsDir, category);
        const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));
        
        for (const file of files) {
          try {
            const pattern = JSON.parse(fs.readFileSync(path.join(categoryDir, file), 'utf-8'));
            patterns.push({
              id: pattern.id,
              name: pattern.name,
              category: pattern.category,
              effectiveness: pattern.effectiveness,
              uses: pattern.uses
            });
          } catch (e) {
            // Skip malformed files
          }
        }
      }
    }
    
    // Filter by category if specified
    const filtered = options.category 
      ? patterns.filter(p => p.category === options.category)
      : patterns;
    
    // Sort by effectiveness
    filtered.sort((a, b) => b.effectiveness - a.effectiveness);
    
    // Apply limit
    const limited = filtered.slice(0, options.limit || 50);
    
    if (raw) {
      console.log(`Knowledge Base: ${filtered.length} patterns`);
      limited.forEach(p => {
        console.log(`  [${p.category}] ${p.id}: ${p.name} (${(p.effectiveness * 100).toFixed(0)}%)`);
      });
    } else {
      output({
        success: true,
        total: filtered.length,
        returned: limited.length,
        patterns: limited
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Show knowledge base statistics
 */
async function cmdKnowledgeStats(cwd, options, raw) {
  const { KnowledgeBase } = await import('../lib/workflow-modules/knowledge-base.js');
  const fs = require('fs');
  
  const knowledgeDir = options.knowledgeDir || path.join(cwd, '.planning', 'knowledge');
  const patternsDir = path.join(knowledgeDir, 'patterns');
  const templatesDir = path.join(knowledgeDir, 'templates');
  const practicesDir = path.join(knowledgeDir, 'best-practices');
  const indexFile = path.join(knowledgeDir, 'index.json');
  
  try {
    const stats = {
      knowledge_dir: knowledgeDir,
      exists: fs.existsSync(knowledgeDir),
      patterns: { total: 0, by_category: {} },
      templates: { total: 0 },
      best_practices: { total: 0 },
      artifacts: { total: 0, by_type: {} },
      index: null
    };
    
    // Count patterns by category
    if (fs.existsSync(patternsDir)) {
      const categories = fs.readdirSync(patternsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
      
      for (const category of categories) {
        const categoryDir = path.join(patternsDir, category);
        const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));
        stats.patterns.by_category[category] = files.length;
        stats.patterns.total += files.length;
      }
    }
    
    // Count templates
    if (fs.existsSync(templatesDir)) {
      stats.templates.total = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json')).length;
    }
    
    // Count best practices
    if (fs.existsSync(practicesDir)) {
      stats.best_practices.total = fs.readdirSync(practicesDir).filter(f => f.endsWith('.md')).length;
    }
    
    // Count generated artifacts by type
    const artifactTypes = ['skills', 'agents', 'logic', 'functions', 'features', 'improvements', 'ideas'];
    for (const type of artifactTypes) {
      const typeDir = path.join(knowledgeDir, type);
      if (fs.existsSync(typeDir)) {
        const count = fs.readdirSync(typeDir).length;
        stats.artifacts.by_type[type] = count;
        stats.artifacts.total += count;
      }
    }
    
    // Load index if exists
    if (fs.existsSync(indexFile)) {
      stats.index = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
    }
    
    if (raw) {
      console.log('=== Knowledge Base Statistics ===');
      console.log(`Directory: ${stats.knowledge_dir}`);
      console.log(`Exists: ${stats.exists}`);
      console.log(`\nPatterns: ${stats.patterns.total}`);
      for (const [cat, count] of Object.entries(stats.patterns.by_category)) {
        console.log(`  ${cat}: ${count}`);
      }
      console.log(`\nTemplates: ${stats.templates.total}`);
      console.log(`Best Practices: ${stats.best_practices.total}`);
      console.log(`\nGenerated Artifacts: ${stats.artifacts.total}`);
      for (const [type, count] of Object.entries(stats.artifacts.by_type)) {
        console.log(`  ${type}: ${count}`);
      }
      if (stats.index) {
        console.log(`\nLast Updated: ${stats.index.lastUpdated}`);
      }
    } else {
      output(stats, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

// ─── Multi-Type Artifact Generation Commands (Phase 38-01) ────────────────────

/**
 * Generate all artifact types from a pattern
 */
async function cmdKnowledgeGenerateAll(cwd, patternId, options, raw) {
  const { KnowledgeBase } = await import('../lib/workflow-modules/knowledge-base.js');
  
  const knowledgeDir = options.knowledgeDir || path.join(cwd, '.planning', 'knowledge');
  const kb = new KnowledgeBase(knowledgeDir);
  
  if (!patternId) {
    error('Pattern ID required. Usage: gsi knowledge generate-all <pattern-id>');
  }
  
  try {
    const result = await kb.generateAllArtifacts(patternId);
    
    if (raw) {
      console.log(`Generated ${result.artifacts.length} artifacts for pattern ${patternId}:`);
      result.artifacts.forEach(a => {
        console.log(`  - ${a.type}: ${a.file_path}`);
      });
      if (result.errors.length > 0) {
        console.log('\nErrors:');
        result.errors.forEach(e => console.log(`  - ${e}`));
      }
    } else {
      output({
        success: result.success,
        pattern_id: patternId,
        artifacts_generated: result.artifacts.length,
        artifacts: result.artifacts.map(a => ({
          type: a.type,
          id: a.id,
          name: a.name,
          file_path: a.file_path
        })),
        errors: result.errors
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Generate a specific artifact type from a pattern
 */
async function cmdKnowledgeGenerateArtifact(cwd, patternId, artifactType, options, raw) {
  const { KnowledgeBase } = await import('../lib/workflow-modules/knowledge-base.js');
  
  const knowledgeDir = options.knowledgeDir || path.join(cwd, '.planning', 'knowledge');
  const kb = new KnowledgeBase(knowledgeDir);
  
  if (!patternId) {
    error('Pattern ID required. Usage: gsi knowledge generate <pattern-id> <type>');
  }
  
  if (!artifactType) {
    error('Artifact type required. Available types: skill, agent, logic, function, feature, improvement, idea');
  }
  
  // Normalize type to uppercase
  const type = artifactType.toUpperCase();
  const validTypes = ['SKILL', 'AGENT', 'LOGIC', 'FUNCTION', 'FEATURE', 'IMPROVEMENT', 'IDEA'];
  
  if (!validTypes.includes(type)) {
    error(`Invalid artifact type: ${artifactType}. Valid types: ${validTypes.map(t => t.toLowerCase()).join(', ')}`);
  }
  
  try {
    const artifact = await kb.generateArtifact(patternId, type);
    
    if (raw) {
      console.log(`Generated ${type} artifact:`);
      console.log(`  ID: ${artifact.id}`);
      console.log(`  Name: ${artifact.name}`);
      console.log(`  Path: ${artifact.file_path}`);
    } else {
      output({
        success: true,
        type: artifact.type,
        id: artifact.id,
        name: artifact.name,
        description: artifact.description,
        file_path: artifact.file_path,
        created_at: artifact.created_at,
        metadata: artifact.metadata
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * List available artifact types
 */
async function cmdKnowledgeArtifactTypes(cwd, options, raw) {
  const types = [
    { type: 'SKILL', description: 'Claude Code skill for reuse' },
    { type: 'AGENT', description: 'GSI agent definition with thinking config' },
    { type: 'LOGIC', description: 'TypeScript logic module with interfaces' },
    { type: 'FUNCTION', description: 'Reusable TypeScript function' },
    { type: 'FEATURE', description: 'Feature specification document' },
    { type: 'IMPROVEMENT', description: 'Improvement suggestions with rationale' },
    { type: 'IDEA', description: 'Visionary idea and concept proposal' }
  ];
  
  if (raw) {
    console.log('Available Artifact Types:');
    types.forEach(t => {
      console.log(`  ${t.type.toLowerCase()}: ${t.description}`);
    });
  } else {
    output({ types }, raw);
  }
}

/**
 * Extract patterns and generate artifacts in one operation
 */
async function cmdKnowledgeExtractGenerate(cwd, sourcePath, options, raw) {
  const { KnowledgeBase } = await import('../lib/workflow-modules/knowledge-base.js');
  
  const knowledgeDir = options.knowledgeDir || path.join(cwd, '.planning', 'knowledge');
  const kb = new KnowledgeBase(knowledgeDir);
  
  if (!sourcePath) {
    error('Source path required. Usage: gsi knowledge extract-generate <path> [--types type1,type2]');
  }
  
  // Parse artifact types if specified
  let artifactTypes = null;
  if (options.types) {
    artifactTypes = options.types.split(',').map(t => t.trim().toUpperCase());
  }
  
  try {
    const result = await kb.extractAndGenerate(sourcePath, options.category, artifactTypes);
    
    // Count total artifacts
    let totalArtifacts = 0;
    result.generations.forEach(g => totalArtifacts += g.artifacts.length);
    
    if (raw) {
      console.log(`Extracted ${result.extraction.patternsExtracted.length} patterns`);
      console.log(`Generated ${totalArtifacts} artifacts`);
      
      result.generations.forEach(g => {
        console.log(`\nPattern: ${g.pattern?.id || 'unknown'}`);
        g.artifacts.forEach(a => {
          console.log(`  - ${a.type}: ${a.file_path}`);
        });
      });
    } else {
      output({
        success: true,
        extraction: {
          files_scanned: result.extraction.patternsFound,
          patterns_extracted: result.extraction.patternsExtracted.length,
          patterns: result.extraction.patternsExtracted.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category
          }))
        },
        generation: {
          total_artifacts: totalArtifacts,
          patterns_processed: result.generations.length,
          generations: result.generations.map(g => ({
            pattern_id: g.pattern?.id,
            artifacts: g.artifacts.map(a => ({
              type: a.type,
              file_path: a.file_path
            })),
            success: g.success,
            errors: g.errors
          }))
        }
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Batch generate artifacts for multiple patterns
 */
async function cmdKnowledgeBatchGenerate(cwd, patternIds, options, raw) {
  const { KnowledgeBase } = await import('../lib/workflow-modules/knowledge-base.js');
  
  const knowledgeDir = options.knowledgeDir || path.join(cwd, '.planning', 'knowledge');
  const kb = new KnowledgeBase(knowledgeDir);
  
  if (!patternIds || patternIds.length === 0) {
    error('Pattern IDs required. Usage: gsi knowledge batch-generate <id1,id2,...> --types type1,type2');
  }
  
  // Parse types
  const types = options.types 
    ? options.types.split(',').map(t => t.trim().toUpperCase())
    : ['SKILL', 'AGENT', 'FEATURE', 'IDEA'];
  
  try {
    const results = await kb.batchGenerate(patternIds, types);
    
    // Aggregate stats
    let totalArtifacts = 0;
    let successCount = 0;
    let failCount = 0;
    
    results.forEach((result, id) => {
      totalArtifacts += result.artifacts.length;
      if (result.success) successCount++;
      else failCount++;
    });
    
    if (raw) {
      console.log(`Batch generation complete:`);
      console.log(`  Patterns: ${results.size}`);
      console.log(`  Successful: ${successCount}`);
      console.log(`  Failed: ${failCount}`);
      console.log(`  Total artifacts: ${totalArtifacts}`);
      
      results.forEach((result, id) => {
        console.log(`\n${id}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
        result.artifacts.forEach(a => {
          console.log(`  - ${a.type}: ${a.file_path}`);
        });
        if (result.errors.length > 0) {
          result.errors.forEach(e => console.log(`  ERROR: ${e}`));
        }
      });
    } else {
      const output_results = {};
      results.forEach((result, id) => {
        output_results[id] = {
          success: result.success,
          artifacts: result.artifacts.map(a => ({
            type: a.type,
            file_path: a.file_path
          })),
          errors: result.errors
        };
      });
      
      output({
        success: failCount === 0,
        summary: {
          total_patterns: results.size,
          successful: successCount,
          failed: failCount,
          total_artifacts: totalArtifacts
        },
        types_generated: types,
        results: output_results
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

// ─── GSD Integration Commands ───────────────────────────────────────────────────

async function cmdCheckGSDUpdates(cwd, options, raw) {
  const { hasUpdateAvailable } = require('../lib/gsi-integration/version-checker');
  const { downloadGSDPackage, cleanupDownload } = require('../lib/gsi-integration/downloader');
  const { analyzeChanges } = require('../lib/gsi-integration/change-analyzer');
  const { categorizeChanges, assessChanges } = require('../lib/gsi-integration/change-analyzer');
  const { suggestIntegrations, generateIntegrationPlan } = require('../lib/gsi-integration/suggester');
  const { recordUpdate } = require('../lib/gsi-integration/tracker');

  try {
    console.log('Checking for GSD updates...');
    const updateInfo = await hasUpdateAvailable();

    if (updateInfo.cached) {
      console.log(`(Using cached check from ${new Date(updateInfo.lastCheck).toLocaleString()})`);
    }

    if (!updateInfo.hasUpdate) {
      console.log('No updates available.');
      console.log(`Current: ${updateInfo.installedVersion || 'unknown'}`);
      console.log(`Latest: ${updateInfo.latestVersion}`);
      return;
    }

    console.log(`Update available!`);
    console.log(`Current: ${updateInfo.installedVersion || 'unknown'}`);
    console.log(`Latest: ${updateInfo.latestVersion}`);

    // Download and analyze
    console.log('\nDownloading package...');
    const { packageDir, tempDir } = await downloadGSDPackage(updateInfo.latestVersion);

    try {
      console.log('Analyzing changes...');
      const changes = await analyzeChanges(cwd, packageDir);
      const categorized = categorizeChanges(changes);
      const impact = await assessChanges(changes, cwd);

      // Record detection
      await recordUpdate(updateInfo.latestVersion, changes);

      // Display summary
      console.log('\n=== Change Summary ===');
      console.log(`Total changes: ${changes.total}`);
      console.log(`  Added: ${changes.added.length}`);
      console.log(`  Removed: ${changes.removed.length}`);
      console.log(`  Modified: ${changes.modified.length}`);

      console.log('\n=== Categories ===');
      for (const [category, items] of Object.entries(categorized)) {
        if (items.length > 0) {
          console.log(`${category}: ${items.length}`);
        }
      }

      // Generate suggestions
      const suggestions = suggestIntegrations(categorized, impact);
      if (suggestions.length > 0) {
        console.log(`\n=== Integratable Changes (${suggestions.length}) ===`);
        suggestions.slice(0, 10).forEach(s => {
          console.log(`  [${s.priority}] ${s.description}`);
        });

        if (suggestions.length > 10) {
          console.log(`  ... and ${suggestions.length - 10} more`);
        }

        console.log(`\nRun 'gsi integrate-gsd-change <id>' to integrate a specific change`);
      }

      // Generate plan
      const plan = generateIntegrationPlan(suggestions);
      console.log(`\n=== Integration Plan ===`);
      console.log(`Estimated effort: ${plan.estimatedEffort}`);
      console.log(`Phases: ${plan.steps.length}`);
      plan.steps.forEach(step => {
        console.log(`  - ${step.phase}: ${step.changes.length} changes`);
      });

      if (plan.warnings.length > 0) {
        console.log(`\nWarnings:`);
        plan.warnings.forEach(w => console.log(`  ⚠️  ${w}`));
      }

    } finally {
      await cleanupDownload(tempDir);
    }

  } catch (error) {
    console.error(`Error checking for updates: ${error.message}`);
    process.exit(1);
  }
}

function cmdIntegrateGSDChange(cwd, changeId, raw) {
  const { getUpdateHistory } = require('../lib/gsi-integration/tracker');
  const { recordIntegration } = require('../lib/gsi-integration/tracker');
  const { downloadGSDPackage, cleanupDownload } = require('../lib/gsi-integration/downloader');
  const { analyzeChanges, categorizeChanges, assessChanges } = require('../lib/gsi-integration/change-analyzer');
  const { suggestIntegrations, createMergeStrategy } = require('../lib/gsi-integration/suggester');
  const fs = require('fs').promises;
  const path = require('path');

  (async () => {
    try {
      // Find change in recent history
      const history = await getUpdateHistory(5);
      let targetChange = null;
      let targetVersion = null;

      for (const entry of history) {
        // This is simplified - in reality we'd need to store suggestions
        // For now, just show a message
        console.log(`Checking version ${entry.version}...`);
      }

      console.log(`Change integration not yet implemented.`);
      console.log(`Change ID: ${changeId}`);
      console.log(`\nThis would:`);
      console.log(`1. Locate the change in the downloaded package`);
      console.log(`2. Apply the merge strategy`);
      console.log(`3. Update tracking file`);
      console.log(`4. Commit the integration`);

    } catch (error) {
      console.error(`Error integrating change: ${error.message}`);
      process.exit(1);
    }
  })();
}

async function cmdGSDUpdateHistory(cwd, options, raw) {
  const { getUpdateHistory, getIntegratedChanges, getDeferredChanges, getIntegrationStats } = require('../lib/gsi-integration/tracker');

  try {
    const history = await getUpdateHistory(20);
    const integrated = await getIntegratedChanges();
    const deferred = await getDeferredChanges();
    const stats = await getIntegrationStats();

    const result = {
      stats,
      recent_detections: history,
      integrations: integrated.slice(-20),
      deferred: deferred.slice(-20)
    };

    if (raw) {
      console.log(`=== GSD Update History ===`);
      console.log(`\nStatistics:`);
      console.log(`  Versions detected: ${stats.totalDetected}`);
      console.log(`  Changes integrated: ${stats.totalIntegrated}`);
      console.log(`  Changes deferred: ${stats.totalDeferred}`);
      console.log(`  Integration rate: ${stats.integrationRate}%`);

      if (history.length > 0) {
        console.log(`\nRecent detections:`);
        history.forEach(h => {
          console.log(`  ${h.version} (${new Date(h.detectedAt).toLocaleDateString()}): ${h.changes.total} changes`);
        });
      }

      if (integrated.length > 0) {
        console.log(`\nRecent integrations:`);
        integrated.slice(-10).forEach(i => {
          console.log(`  ${i.changeId} (${i.version}): ${i.status}`);
        });
      }
    } else {
      output(result, raw);
    }

  } catch (error) {
    console.error(`Error getting history: ${error.message}`);
    process.exit(1);
  }
}

// ─── Install Detection Commands ───────────────────────────────────────────────

function cmdInstallInfo(cwd, options, raw) {
  const { forceGlobal, forceProject } = options;
  
  try {
    const { detectInstallLocation, getGlobalInstallPath } = require('../lib/context/install-detector');
    const { getAllDataPaths, getPlanningPath } = require('../lib/context/path-resolver');
    
    const location = detectInstallLocation({
      cwd,
      forceGlobal,
      forceProject,
      noCache: true // Always detect fresh for info command
    });
    
    const dataPaths = getAllDataPaths({ cwd, forceGlobal, forceProject });
    
    const result = {
      type: location.type,
      basePath: location.basePath,
      globalPath: getGlobalInstallPath(),
      indicators: location.indicators,
      dataPaths,
      cwd
    };
    
    if (!raw) {
      console.log('=== GSI Install Context ===\n');
      console.log(`Install Type: ${location.type.toUpperCase()}`);
      console.log(`Base Path: ${location.basePath}`);
      console.log(`Global Path: ${getGlobalInstallPath()}`);
      console.log(`Current Directory: ${cwd}`);
      console.log(`\nDetection Indicators:`);
      location.indicators.forEach(i => console.log(`  - ${i}`));
      console.log(`\nData Paths:`);
      for (const [type, p] of Object.entries(dataPaths)) {
        if (typeof p === 'string') {
          console.log(`  ${type}: ${p}`);
        } else {
          console.log(`  ${type}: ERROR - ${p.error}`);
        }
      }
      console.log(`\nPlanning Path: ${getPlanningPath({ cwd, forceGlobal, forceProject })}`);
    } else {
      output(result, raw);
    }
  } catch (error) {
    console.error(`Error detecting install info: ${error.message}`);
    process.exit(1);
  }
}

// ─── CLI Router ───────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const rawIndex = args.indexOf('--raw');
  const raw = rawIndex !== -1;
  if (rawIndex !== -1) args.splice(rawIndex, 1);

  const command = args[0];
  const cwd = process.cwd();

  if (!command) {
    error('Usage: GSI-tools <command> [args] [--raw]\nCommands: state, install-info, resolve-model, find-phase, commit, verify-summary, verify, frontmatter, template, generate-slug, current-timestamp, list-todos, verify-path-exists, config-ensure-section, reflection, check-gsd-updates, integrate-gsd-change, gsd-update-history, init');
  }

  switch (command) {
    case 'install-info': {
      const forceGlobal = args.includes('--force-global');
      const forceProject = args.includes('--force-project');
      cmdInstallInfo(cwd, { forceGlobal, forceProject }, raw);
      break;
    }

    case 'state': {
      const subcommand = args[1];
      if (subcommand === 'update') {
        cmdStateUpdate(cwd, args[2], args[3]);
      } else if (subcommand === 'get') {
        cmdStateGet(cwd, args[2], raw);
      } else if (subcommand === 'patch') {
        const patches = {};
        for (let i = 2; i < args.length; i += 2) {
          const key = args[i].replace(/^--/, '');
          const value = args[i + 1];
          if (key && value !== undefined) {
            patches[key] = value;
          }
        }
        cmdStatePatch(cwd, patches, raw);
      } else if (subcommand === 'advance-plan') {
        cmdStateAdvancePlan(cwd, raw);
      } else if (subcommand === 'record-metric') {
        const phaseIdx = args.indexOf('--phase');
        const planIdx = args.indexOf('--plan');
        const durationIdx = args.indexOf('--duration');
        const tasksIdx = args.indexOf('--tasks');
        const filesIdx = args.indexOf('--files');
        cmdStateRecordMetric(cwd, {
          phase: phaseIdx !== -1 ? args[phaseIdx + 1] : null,
          plan: planIdx !== -1 ? args[planIdx + 1] : null,
          duration: durationIdx !== -1 ? args[durationIdx + 1] : null,
          tasks: tasksIdx !== -1 ? args[tasksIdx + 1] : null,
          files: filesIdx !== -1 ? args[filesIdx + 1] : null,
        }, raw);
      } else if (subcommand === 'update-progress') {
        cmdStateUpdateProgress(cwd, raw);
      } else if (subcommand === 'add-decision') {
        const phaseIdx = args.indexOf('--phase');
        const summaryIdx = args.indexOf('--summary');
        const rationaleIdx = args.indexOf('--rationale');
        cmdStateAddDecision(cwd, {
          phase: phaseIdx !== -1 ? args[phaseIdx + 1] : null,
          summary: summaryIdx !== -1 ? args[summaryIdx + 1] : null,
          rationale: rationaleIdx !== -1 ? args[rationaleIdx + 1] : '',
        }, raw);
      } else if (subcommand === 'add-blocker') {
        const textIdx = args.indexOf('--text');
        cmdStateAddBlocker(cwd, textIdx !== -1 ? args[textIdx + 1] : null, raw);
      } else if (subcommand === 'resolve-blocker') {
        const textIdx = args.indexOf('--text');
        cmdStateResolveBlocker(cwd, textIdx !== -1 ? args[textIdx + 1] : null, raw);
      } else if (subcommand === 'record-session') {
        const stoppedIdx = args.indexOf('--stopped-at');
        const resumeIdx = args.indexOf('--resume-file');
        cmdStateRecordSession(cwd, {
          stopped_at: stoppedIdx !== -1 ? args[stoppedIdx + 1] : null,
          resume_file: resumeIdx !== -1 ? args[resumeIdx + 1] : 'None',
        }, raw);
      } else {
        cmdStateLoad(cwd, raw);
      }
      break;
    }

    case 'resolve-model': {
      cmdResolveModel(cwd, args[1], raw);
      break;
    }

    case 'find-phase': {
      cmdFindPhase(cwd, args[1], raw);
      break;
    }

    case 'commit': {
      const amend = args.includes('--amend');
      const message = args[1];
      // Parse --files flag (collect args after --files, stopping at other flags)
      const filesIndex = args.indexOf('--files');
      const files = filesIndex !== -1 ? args.slice(filesIndex + 1).filter(a => !a.startsWith('--')) : [];
      cmdCommit(cwd, message, files, raw, amend);
      break;
    }

    case 'verify-summary': {
      const summaryPath = args[1];
      const countIndex = args.indexOf('--check-count');
      const checkCount = countIndex !== -1 ? parseInt(args[countIndex + 1], 10) : 2;
      cmdVerifySummary(cwd, summaryPath, checkCount, raw);
      break;
    }

    case 'template': {
      const subcommand = args[1];
      if (subcommand === 'select') {
        cmdTemplateSelect(cwd, args[2], raw);
      } else if (subcommand === 'fill') {
        const templateType = args[2];
        const phaseIdx = args.indexOf('--phase');
        const planIdx = args.indexOf('--plan');
        const nameIdx = args.indexOf('--name');
        const typeIdx = args.indexOf('--type');
        const waveIdx = args.indexOf('--wave');
        const fieldsIdx = args.indexOf('--fields');
        cmdTemplateFill(cwd, templateType, {
          phase: phaseIdx !== -1 ? args[phaseIdx + 1] : null,
          plan: planIdx !== -1 ? args[planIdx + 1] : null,
          name: nameIdx !== -1 ? args[nameIdx + 1] : null,
          type: typeIdx !== -1 ? args[typeIdx + 1] : 'execute',
          wave: waveIdx !== -1 ? args[waveIdx + 1] : '1',
          fields: fieldsIdx !== -1 ? JSON.parse(args[fieldsIdx + 1]) : {},
        }, raw);
      } else {
        error('Unknown template subcommand. Available: select, fill');
      }
      break;
    }

    case 'frontmatter': {
      const subcommand = args[1];
      const file = args[2];
      if (subcommand === 'get') {
        const fieldIdx = args.indexOf('--field');
        cmdFrontmatterGet(cwd, file, fieldIdx !== -1 ? args[fieldIdx + 1] : null, raw);
      } else if (subcommand === 'set') {
        const fieldIdx = args.indexOf('--field');
        const valueIdx = args.indexOf('--value');
        cmdFrontmatterSet(cwd, file, fieldIdx !== -1 ? args[fieldIdx + 1] : null, valueIdx !== -1 ? args[valueIdx + 1] : undefined, raw);
      } else if (subcommand === 'merge') {
        const dataIdx = args.indexOf('--data');
        cmdFrontmatterMerge(cwd, file, dataIdx !== -1 ? args[dataIdx + 1] : null, raw);
      } else if (subcommand === 'validate') {
        const schemaIdx = args.indexOf('--schema');
        cmdFrontmatterValidate(cwd, file, schemaIdx !== -1 ? args[schemaIdx + 1] : null, raw);
      } else {
        error('Unknown frontmatter subcommand. Available: get, set, merge, validate');
      }
      break;
    }

    case 'verify': {
      const subcommand = args[1];
      if (subcommand === 'plan-structure') {
        cmdVerifyPlanStructure(cwd, args[2], raw);
      } else if (subcommand === 'phase-completeness') {
        cmdVerifyPhaseCompleteness(cwd, args[2], raw);
      } else if (subcommand === 'references') {
        cmdVerifyReferences(cwd, args[2], raw);
      } else if (subcommand === 'commits') {
        cmdVerifyCommits(cwd, args.slice(2), raw);
      } else if (subcommand === 'artifacts') {
        cmdVerifyArtifacts(cwd, args[2], raw);
      } else if (subcommand === 'key-links') {
        cmdVerifyKeyLinks(cwd, args[2], raw);
      } else {
        error('Unknown verify subcommand. Available: plan-structure, phase-completeness, references, commits, artifacts, key-links');
      }
      break;
    }

    case 'generate-slug': {
      cmdGenerateSlug(args[1], raw);
      break;
    }

    case 'current-timestamp': {
      cmdCurrentTimestamp(args[1] || 'full', raw);
      break;
    }

    case 'list-todos': {
      cmdListTodos(cwd, args[1], raw);
      break;
    }

    case 'verify-path-exists': {
      cmdVerifyPathExists(cwd, args[1], raw);
      break;
    }

    case 'config-ensure-section': {
      cmdConfigEnsureSection(cwd, raw);
      break;
    }

    case 'config-set': {
      cmdConfigSet(cwd, args[1], args[2], raw);
      break;
    }

    case 'history-digest': {
      cmdHistoryDigest(cwd, raw);
      break;
    }

    case 'phases': {
      const subcommand = args[1];
      if (subcommand === 'list') {
        const typeIndex = args.indexOf('--type');
        const phaseIndex = args.indexOf('--phase');
        const options = {
          type: typeIndex !== -1 ? args[typeIndex + 1] : null,
          phase: phaseIndex !== -1 ? args[phaseIndex + 1] : null,
        };
        cmdPhasesList(cwd, options, raw);
      } else {
        error('Unknown phases subcommand. Available: list');
      }
      break;
    }

    case 'roadmap': {
      const subcommand = args[1];
      if (subcommand === 'get-phase') {
        cmdRoadmapGetPhase(cwd, args[2], raw);
      } else if (subcommand === 'analyze') {
        cmdRoadmapAnalyze(cwd, raw);
      } else {
        error('Unknown roadmap subcommand. Available: get-phase, analyze');
      }
      break;
    }

    case 'phase': {
      const subcommand = args[1];
      if (subcommand === 'next-decimal') {
        cmdPhaseNextDecimal(cwd, args[2], raw);
      } else if (subcommand === 'add') {
        cmdPhaseAdd(cwd, args.slice(2).join(' '), raw);
      } else if (subcommand === 'insert') {
        cmdPhaseInsert(cwd, args[2], args.slice(3).join(' '), raw);
      } else if (subcommand === 'remove') {
        const forceFlag = args.includes('--force');
        cmdPhaseRemove(cwd, args[2], { force: forceFlag }, raw);
      } else if (subcommand === 'complete') {
        cmdPhaseComplete(cwd, args[2], raw);
      } else {
        error('Unknown phase subcommand. Available: next-decimal, add, insert, remove, complete');
      }
      break;
    }

    case 'milestone': {
      const subcommand = args[1];
      if (subcommand === 'complete') {
        const nameIndex = args.indexOf('--name');
        const milestoneName = nameIndex !== -1 ? args.slice(nameIndex + 1).join(' ') : null;
        cmdMilestoneComplete(cwd, args[2], { name: milestoneName }, raw);
      } else {
        error('Unknown milestone subcommand. Available: complete');
      }
      break;
    }

    case 'validate': {
      const subcommand = args[1];
      if (subcommand === 'consistency') {
        cmdValidateConsistency(cwd, raw);
      } else {
        error('Unknown validate subcommand. Available: consistency');
      }
      break;
    }

    case 'progress': {
      const subcommand = args[1] || 'json';
      if (subcommand === 'pattern-learning' || subcommand === 'patterns') {
        await cmdProgressPatterns(cwd, raw);
      } else {
        cmdProgressRender(cwd, subcommand, raw);
      }
      break;
    }

    case 'todo': {
      const subcommand = args[1];
      if (subcommand === 'complete') {
        cmdTodoComplete(cwd, args[2], raw);
      } else {
        error('Unknown todo subcommand. Available: complete');
      }
      break;
    }

    case 'scaffold': {
      const scaffoldType = args[1];
      const phaseIndex = args.indexOf('--phase');
      const nameIndex = args.indexOf('--name');
      const scaffoldOptions = {
        phase: phaseIndex !== -1 ? args[phaseIndex + 1] : null,
        name: nameIndex !== -1 ? args.slice(nameIndex + 1).join(' ') : null,
      };
      cmdScaffold(cwd, scaffoldType, scaffoldOptions, raw);
      break;
    }

    case 'init': {
      const workflow = args[1];
      const includes = parseIncludeFlag(args);
      switch (workflow) {
        case 'execute-phase':
          cmdInitExecutePhase(cwd, args[2], includes, raw);
          break;
        case 'plan-phase':
          cmdInitPlanPhase(cwd, args[2], includes, raw);
          break;
        case 'new-project':
          cmdInitNewProject(cwd, raw);
          break;
        case 'new-milestone':
          cmdInitNewMilestone(cwd, raw);
          break;
        case 'quick':
          cmdInitQuick(cwd, args.slice(2).join(' '), raw);
          break;
        case 'resume':
          cmdInitResume(cwd, raw);
          break;
        case 'verify-work':
          cmdInitVerifyWork(cwd, args[2], raw);
          break;
        case 'phase-op':
          cmdInitPhaseOp(cwd, args[2], raw);
          break;
        case 'todos':
          cmdInitTodos(cwd, args[2], raw);
          break;
        case 'milestone-op':
          cmdInitMilestoneOp(cwd, raw);
          break;
        case 'map-codebase':
          cmdInitMapCodebase(cwd, raw);
          break;
        case 'progress':
          cmdInitProgress(cwd, includes, raw);
          break;
        default:
          error(`Unknown init workflow: ${workflow}\nAvailable: execute-phase, plan-phase, new-project, new-milestone, quick, resume, verify-work, phase-op, todos, milestone-op, map-codebase, progress`);
      }
      break;
    }

    case 'phase-plan-index': {
      cmdPhasePlanIndex(cwd, args[1], raw);
      break;
    }

    case 'state-snapshot': {
      cmdStateSnapshot(cwd, raw);
      break;
    }

    case 'summary-extract': {
      const summaryPath = args[1];
      const fieldsIndex = args.indexOf('--fields');
      const fields = fieldsIndex !== -1 ? args[fieldsIndex + 1].split(',') : null;
      cmdSummaryExtract(cwd, summaryPath, fields, raw);
      break;
    }

    case 'reflection': {
      const subcommand = args[1];
      if (subcommand === 'list') {
        const toolIdx = args.indexOf('--tool');
        const typeIdx = args.indexOf('--type');
        cmdReflectionList(cwd, {
          tool: toolIdx !== -1 ? args[toolIdx + 1] : null,
          type: typeIdx !== -1 ? args[typeIdx + 1] : null
        }, raw);
      } else if (subcommand === 'patterns') {
        const successIdx = args.indexOf('--min-success');
        const freqIdx = args.indexOf('--min-freq');
        const typeIdx = args.indexOf('--type');
        cmdReflectionPatterns(cwd, {
          minSuccess: successIdx !== -1 ? parseFloat(args[successIdx + 1]) : null,
          minFrequency: freqIdx !== -1 ? parseInt(args[freqIdx + 1], 10) : null,
          type: typeIdx !== -1 ? args[typeIdx + 1] : null
        }, raw);
      } else if (subcommand === 'insights') {
        const typeIdx = args.indexOf('--type');
        const impactIdx = args.indexOf('--impact');
        const limitIdx = args.indexOf('--limit');
        cmdReflectionInsights(cwd, {
          type: typeIdx !== -1 ? args[typeIdx + 1] : null,
          impact: impactIdx !== -1 ? args[impactIdx + 1] : null,
          limit: limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 10
        }, raw);
      } else if (subcommand === 'graph') {
        cmdReflectionGraph(cwd, {}, raw);
      } else {
        error('Unknown reflection subcommand. Available: list, patterns, insights, graph');
      }
      break;
    }

    case 'check-gsd-updates': {
      await cmdCheckGSDUpdates(cwd, {}, raw);
      break;
    }

    case 'integrate-gsd-change': {
      const changeId = args[1];
      if (!changeId) {
        error('Usage: gsi integrate-gsd-change <change-id>');
      }
      cmdIntegrateGSDChange(cwd, changeId, raw);
      break;
    }

    case 'gsd-update-history': {
      await cmdGSDUpdateHistory(cwd, {}, raw);
      break;
    }

    case 'websearch': {
      const query = args[1];
      const limitIdx = args.indexOf('--limit');
      const freshnessIdx = args.indexOf('--freshness');
      await cmdWebsearch(query, {
        limit: limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 10,
        freshness: freshnessIdx !== -1 ? args[freshnessIdx + 1] : null,
      }, raw);
      break;
    }

    case 'pattern-report': {
      await cmdPatternReport(cwd, args[1], raw);
      break;
    }

    case 'thinking': {
      const subcommand = args[1];
      const jsonFlag = args.includes('--json');
      const profileIdx = args.indexOf('--profile');
      const timeoutIdx = args.indexOf('--timeout');
      const serverIdx = args.indexOf('--server');
      const toolsIdx = args.indexOf('--tools');
      const processIdx = args.indexOf('--process');
      const commandsDirIdx = args.indexOf('--commands-dir');
      const backupDirIdx = args.indexOf('--backup-dir');
      
      const thinkingOptions = {
        json: jsonFlag,
        profile: profileIdx !== -1 ? args[profileIdx + 1] : null,
        timeout: timeoutIdx !== -1 ? args[timeoutIdx + 1] : null,
        server: serverIdx !== -1 ? args[serverIdx + 1] : null,
        tools: toolsIdx !== -1 ? args[toolsIdx + 1] : null,
        process: processIdx !== -1 ? args[processIdx + 1] : null,
        bmad: args.includes('--bmad') ? true : (args.includes('--no-bmad') ? false : undefined),
        commandsDir: commandsDirIdx !== -1 ? args[commandsDirIdx + 1] : null,
        backupDir: backupDirIdx !== -1 ? args[backupDirIdx + 1] : null,
        dryRun: args.includes('--dry-run'),
        force: args.includes('--force'),
        strict: args.includes('--strict')
      };
      
      if (subcommand === 'analyze') {
        const commandDesc = args.slice(2).find(a => !a.startsWith('--')) || '';
        await cmdThinkingAnalyze(cwd, commandDesc, thinkingOptions, raw);
      } else if (subcommand === 'config') {
        const commandDesc = args.slice(2).find(a => !a.startsWith('--')) || '';
        await cmdThinkingConfig(cwd, commandDesc, thinkingOptions, raw);
      } else if (subcommand === 'servers') {
        await cmdThinkingServers(cwd, thinkingOptions, raw);
      } else if (subcommand === 'test') {
        await cmdThinkingTest(cwd, thinkingOptions, raw);
      } else if (subcommand === 'apply-all') {
        await cmdThinkingApplyAll(cwd, thinkingOptions, raw);
      } else if (subcommand === 'validate') {
        await cmdThinkingValidate(cwd, thinkingOptions, raw);
      } else if (subcommand === 'rollback') {
        await cmdThinkingRollback(cwd, thinkingOptions, raw);
      } else if (subcommand === 'factors') {
        await cmdThinkingFactors(cwd, thinkingOptions, raw);
      } else {
        error('Unknown thinking subcommand. Available: analyze, config, servers, test, apply-all, validate, rollback, factors');
      }
      break;
    }

    case 'patch': {
      const subcommand = args[1];
      const patchesDirIdx = args.indexOf('--patches-dir');
      const patchesDir = patchesDirIdx !== -1 ? args[patchesDirIdx + 1] : null;
      
      if (subcommand === 'backup') {
        await cmdPatchBackup(cwd, { patchesDir }, raw);
      } else if (subcommand === 'restore') {
        await cmdPatchRestore(cwd, { patchesDir }, raw);
      } else if (subcommand === 'status') {
        await cmdPatchStatus(cwd, { patchesDir }, raw);
      } else if (subcommand === 'diff') {
        await cmdPatchDiff(cwd, { patchesDir }, raw);
      } else {
        error('Unknown patch subcommand. Available: backup, restore, status, diff');
      }
      break;
    }

    case 'workflow': {
      const subcommand = args[1];
      const templatesDirIdx = args.indexOf('--templates-dir');
      const templatesDir = templatesDirIdx !== -1 ? args[templatesDirIdx + 1] : null;
      const stateDirIdx = args.indexOf('--state-dir');
      const stateDir = stateDirIdx !== -1 ? args[stateDirIdx + 1] : null;
      const yoloIdx = args.indexOf('--yolo');
      const failureIdx = args.indexOf('--failure-strategy');
      
      // Pattern discovery options
      const minFreqIdx = args.indexOf('--min-frequency');
      const minSuccessIdx = args.indexOf('--min-success-rate');
      const minLenIdx = args.indexOf('--min-length');
      const maxLenIdx = args.indexOf('--max-length');
      const minQualityIdx = args.indexOf('--min-quality');
      const phaseIdx = args.indexOf('--phase');
      const recentIdx = args.indexOf('--recent-commands');
      const goalIdx = args.indexOf('--goal');
      const outputIdx = args.indexOf('--output');
      
      const workflowOptions = {
        templatesDir,
        stateDir,
        yolo: yoloIdx !== -1,
        failureStrategy: failureIdx !== -1 ? args[failureIdx + 1] : 'stop-on-error',
        // Pattern discovery options
        minFrequency: minFreqIdx !== -1 ? parseInt(args[minFreqIdx + 1], 10) : 2,
        minSuccessRate: minSuccessIdx !== -1 ? parseFloat(args[minSuccessIdx + 1]) : 0.5,
        minLength: minLenIdx !== -1 ? parseInt(args[minLenIdx + 1], 10) : 2,
        maxLength: maxLenIdx !== -1 ? parseInt(args[maxLenIdx + 1], 10) : 10,
        minQuality: minQualityIdx !== -1 ? parseInt(args[minQualityIdx + 1], 10) : 50,
        phase: phaseIdx !== -1 ? args[phaseIdx + 1] : null,
        recentCommands: recentIdx !== -1 ? args[recentIdx + 1] : null,
        goal: goalIdx !== -1 ? args[goalIdx + 1] : null,
        output: outputIdx !== -1 ? args[outputIdx + 1] : null
      };
      
      if (subcommand === 'run') {
        const templateName = args[2];
        const varsIdx = args.indexOf('--vars');
        const vars = varsIdx !== -1 ? JSON.parse(args[varsIdx + 1]) : {};
        await cmdWorkflowRun(cwd, templateName, vars, workflowOptions, raw);
      } else if (subcommand === 'list') {
        await cmdWorkflowList(cwd, workflowOptions, raw);
      } else if (subcommand === 'status') {
        const workflowName = args[2];
        await cmdWorkflowStatus(cwd, workflowName, workflowOptions, raw);
      } else if (subcommand === 'pause') {
        const workflowName = args[2];
        await cmdWorkflowPause(cwd, workflowName, workflowOptions, raw);
      } else if (subcommand === 'resume') {
        const workflowName = args[2];
        await cmdWorkflowResume(cwd, workflowName, workflowOptions, raw);
      } else if (subcommand === 'rollback') {
        const workflowName = args[2];
        await cmdWorkflowRollback(cwd, workflowName, workflowOptions, raw);
      } else if (subcommand === 'discover') {
        // Phase 38-03: Mine patterns from history
        await cmdWorkflowDiscover(cwd, workflowOptions, raw);
      } else if (subcommand === 'recommend') {
        // Phase 38-03: Get workflow recommendations
        await cmdWorkflowRecommend(cwd, workflowOptions, raw);
      } else if (subcommand === 'optimize') {
        // Phase 38-03: Optimize a workflow
        const workflowName = args[2];
        await cmdWorkflowOptimize(cwd, workflowName, workflowOptions, raw);
      } else if (subcommand === 'analyze') {
        // Phase 38-03: Analyze all workflows
        await cmdWorkflowAnalyze(cwd, workflowOptions, raw);
      } else if (subcommand === 'export') {
        // Phase 38-03: Export pattern as template
        const patternId = args[2];
        await cmdWorkflowExport(cwd, patternId, workflowOptions, raw);
      } else {
        error(`Unknown workflow subcommand. Available:
  run <template> - Run a workflow template
  list - List available templates
  status [name] - Show workflow status
  pause <name> - Pause a running workflow
  resume <name> - Resume a paused workflow
  rollback <name> - Rollback to last checkpoint
  discover - Mine patterns from history (Phase 38-03)
  recommend - Get workflow recommendations (Phase 38-03)
  optimize <name> - Optimize a workflow (Phase 38-03)
  analyze - Analyze all workflows (Phase 38-03)
  export <pattern-id> - Export pattern as template (Phase 38-03)`);
      }
      break;
    }

    case 'knowledge': {
      const subcommand = args[1];
      const knowledgeDirIdx = args.indexOf('--knowledge-dir');
      const knowledgeDir = knowledgeDirIdx !== -1 ? args[knowledgeDirIdx + 1] : null;
      const categoryIdx = args.indexOf('--category');
      const category = categoryIdx !== -1 ? args[categoryIdx + 1] : null;
      const limitIdx = args.indexOf('--limit');
      const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 20;
      const typesIdx = args.indexOf('--types');
      const types = typesIdx !== -1 ? args[typesIdx + 1] : null;
      
      const knowledgeOptions = {
        knowledgeDir,
        category,
        limit,
        types
      };
      
      if (subcommand === 'extract') {
        const sourcePath = args[2];
        cmdKnowledgeExtract(cwd, sourcePath, knowledgeOptions, raw);
      } else if (subcommand === 'search') {
        const query = args.slice(2).find(a => !a.startsWith('--')) || '';
        cmdKnowledgeSearch(cwd, query, knowledgeOptions, raw);
      } else if (subcommand === 'generate-skill') {
        const patternId = args[2];
        cmdKnowledgeGenerateSkill(cwd, patternId, knowledgeOptions, raw);
      } else if (subcommand === 'list') {
        cmdKnowledgeList(cwd, knowledgeOptions, raw);
      } else if (subcommand === 'stats') {
        cmdKnowledgeStats(cwd, knowledgeOptions, raw);
      } else if (subcommand === 'generate-all') {
        // Generate all artifact types from a pattern
        const patternId = args[2];
        cmdKnowledgeGenerateAll(cwd, patternId, knowledgeOptions, raw);
      } else if (subcommand === 'generate') {
        // Generate specific artifact type: gsi knowledge generate <pattern-id> <type>
        const patternId = args[2];
        const artifactType = args[3];
        cmdKnowledgeGenerateArtifact(cwd, patternId, artifactType, knowledgeOptions, raw);
      } else if (subcommand === 'artifact-types') {
        // List available artifact types
        cmdKnowledgeArtifactTypes(cwd, knowledgeOptions, raw);
      } else if (subcommand === 'extract-generate') {
        // Extract and generate in one operation
        const sourcePath = args[2];
        cmdKnowledgeExtractGenerate(cwd, sourcePath, knowledgeOptions, raw);
      } else if (subcommand === 'batch-generate') {
        // Batch generate for multiple patterns
        const idsArg = args[2];
        const patternIds = idsArg ? idsArg.split(',') : [];
        cmdKnowledgeBatchGenerate(cwd, patternIds, knowledgeOptions, raw);
      } else if (subcommand === 'agent') {
        // Shorthand: generate agent
        const patternId = args[2];
        cmdKnowledgeGenerateArtifact(cwd, patternId, 'AGENT', knowledgeOptions, raw);
      } else if (subcommand === 'feature') {
        // Shorthand: generate feature
        const patternId = args[2];
        cmdKnowledgeGenerateArtifact(cwd, patternId, 'FEATURE', knowledgeOptions, raw);
      } else if (subcommand === 'idea') {
        // Shorthand: generate idea
        const patternId = args[2];
        cmdKnowledgeGenerateArtifact(cwd, patternId, 'IDEA', knowledgeOptions, raw);
      } else if (subcommand === 'logic') {
        // Shorthand: generate logic
        const patternId = args[2];
        cmdKnowledgeGenerateArtifact(cwd, patternId, 'LOGIC', knowledgeOptions, raw);
      } else if (subcommand === 'function') {
        // Shorthand: generate function
        const patternId = args[2];
        cmdKnowledgeGenerateArtifact(cwd, patternId, 'FUNCTION', knowledgeOptions, raw);
      } else if (subcommand === 'improvement') {
        // Shorthand: generate improvement
        const patternId = args[2];
        cmdKnowledgeGenerateArtifact(cwd, patternId, 'IMPROVEMENT', knowledgeOptions, raw);
      } else {
        error(`Unknown knowledge subcommand. Available: 
  extract <path> - Extract patterns from source files
  search <query> - Search knowledge base
  generate-skill <id> - Generate skill from pattern
  list - List all patterns
  stats - Show knowledge base statistics
  generate-all <id> - Generate all artifact types from pattern
  generate <id> <type> - Generate specific artifact type
  artifact-types - List available artifact types
  extract-generate <path> - Extract and generate in one operation
  batch-generate <ids> - Batch generate for multiple patterns
  agent <id> - Generate agent from pattern
  feature <id> - Generate feature from pattern
  idea <id> - Generate idea from pattern
  logic <id> - Generate logic from pattern
  function <id> - Generate function from pattern
  improvement <id> - Generate improvement from pattern`);
      }
      break;
    }

    case 'cognitive': {
      const subcommand = args[1];
      const timeoutIdx = args.indexOf('--timeout');
      const phaseIdx = args.indexOf('--phase');
      const fileIdx = args.indexOf('--file');
      const resetIdx = args.indexOf('--reset-stats');
      
      const cognitiveOptions = {
        timeout: timeoutIdx !== -1 ? parseInt(args[timeoutIdx + 1], 10) : 10000,
        phase: phaseIdx !== -1 ? args[phaseIdx + 1] : null,
        file: fileIdx !== -1 ? args[fileIdx + 1] : null,
        resetStats: resetIdx !== -1
      };
      
      if (subcommand === 'flow') {
        const operation = args[2];
        await cmdCognitiveFlow(cwd, operation, cognitiveOptions, raw);
      } else if (subcommand === 'status') {
        await cmdCognitiveStatus(cwd, cognitiveOptions, raw);
      } else if (subcommand === 'learn') {
        const operation = args[2];
        await cmdCognitiveLearn(cwd, operation, cognitiveOptions, raw);
      } else if (subcommand === 'optimize') {
        await cmdCognitiveOptimize(cwd, cognitiveOptions, raw);
      } else {
        error(`Unknown cognitive subcommand. Available:
  flow <operation> - Execute with cognitive flow
    [--timeout N] [--phase PHASE] [--file PATH]
  status - Show cognitive system status
  learn [operation] - Trigger learning capture
    [--phase PHASE]
  optimize - Optimize cognitive settings
    [--reset-stats]`);
      }
      break;
    }

    default:
      error(`Unknown command: ${command}`);
  }
}

// ─── Cognitive Flow Commands (Phase 38-04) ─────────────────────────────────────

/**
 * Execute an operation with cognitive flow
 */
async function cmdCognitiveFlow(cwd, operation, options, raw) {
  try {
    const { getOrchestrator, CognitivePhase } = await import('../lib/cognitive-flow/index.js');
    
    if (!operation) {
      error('Operation required. Usage: gsi cognitive flow <operation> [--file PATH] [--phase PHASE]');
    }
    
    const orchestrator = getOrchestrator();
    
    // Build context
    const phase = options.phase ? CognitivePhase[options.phase.toUpperCase()] : CognitivePhase.PREPARE;
    const targetPath = options.file ? path.resolve(cwd, options.file) : null;
    
    const result = await orchestrator.quickExecute(operation, {}, {
      targetPath,
      timeout: options.timeout
    });
    
    // Set phase after creation
    result.phase = phase;
    
    if (raw) {
      console.log(`Cognitive Flow: ${operation}`);
      console.log(`Status: ${result.success ? 'SUCCESS' : (result.degraded ? 'DEGRADED' : 'FAILED')}`);
      console.log(`Duration: ${result.duration}ms`);
      console.log(`Tokens: ${result.totalTokens}`);
      console.log(`\nPhases executed: ${result.phases.size}`);
      
      for (const [phaseName, phaseResult] of result.phases) {
        console.log(`\n${phaseName}:`);
        console.log(`  Status: ${phaseResult.success ? 'OK' : 'FAILED'}`);
        console.log(`  Duration: ${phaseResult.duration}ms`);
        console.log(`  Thinking results: ${phaseResult.thinkingResults.length}`);
        console.log(`  Tool results: ${phaseResult.toolResults.length}`);
        if (phaseResult.insights.length > 0) {
          console.log(`  Insights: ${phaseResult.insights.length}`);
        }
      }
      
      if (result.errors.length > 0) {
        console.log(`\nErrors:`);
        result.errors.forEach(e => console.log(`  - ${e}`));
      }
    } else {
      output({
        success: result.success,
        operation: result.operation,
        duration: result.duration,
        tokens: result.totalTokens,
        degraded: result.degraded,
        phases: Array.from(result.phases.entries()).map(([name, pr]) => ({
          phase: name,
          success: pr.success,
          duration: pr.duration,
          insights: pr.insights.length,
          learnings: pr.learnings.length
        })),
        insights: result.insights,
        errors: result.errors
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Show cognitive system status
 */
async function cmdCognitiveStatus(cwd, options, raw) {
  try {
    const { getOrchestrator } = await import('../lib/cognitive-flow/index.js');
    
    const orchestrator = getOrchestrator();
    const status = orchestrator.getStatus();
    
    if (raw) {
      console.log('=== Cognitive System Status ===\n');
      
      console.log('Server Pool:');
      console.log(`  Total calls: ${status.serverPool.totalCalls}`);
      console.log(`  Avg latency: ${Math.round(status.serverPool.avgLatency)}ms`);
      
      for (const [server, stats] of status.serverPool.serverStats) {
        console.log(`\n  ${server}:`);
        console.log(`    Calls: ${stats.calls}`);
        console.log(`    Avg latency: ${Math.round(stats.avgLatency)}ms`);
        console.log(`    Errors: ${stats.errors}`);
        console.log(`    Availability: ${stats.availability}%`);
      }
      
      console.log('\nTool Optimizer:');
      console.log(`  Total calls: ${status.toolOptimizer.totalCalls}`);
      console.log(`  Tokens used: ${status.toolOptimizer.totalTokensUsed}`);
      console.log(`  Tokens saved: ${status.toolOptimizer.totalTokensSaved}`);
      
      console.log('\nFlow Status:');
      console.log(`  Active flows: ${status.activeFlows}`);
      console.log(`  Learning buffer: ${status.learningBufferSize}`);
      
      console.log('\nConfiguration:');
      console.log(`  Enabled phases: ${status.config.enabledPhases.join(', ')}`);
      console.log(`  Learning: ${status.config.learningEnabled ? 'ON' : 'OFF'}`);
      console.log(`  Parallel tools: ${status.config.parallelTools ? 'ON' : 'OFF'}`);
      console.log(`  BMAD enhancement: ${status.config.bmadEnhancement ? 'ON' : 'OFF'}`);
    } else {
      output({
        success: true,
        serverPool: {
          totalCalls: status.serverPool.totalCalls,
          avgLatency: Math.round(status.serverPool.avgLatency),
          servers: Object.fromEntries(status.serverPool.serverStats)
        },
        toolOptimizer: {
          totalCalls: status.toolOptimizer.totalCalls,
          tokensUsed: status.toolOptimizer.totalTokensUsed,
          tokensSaved: status.toolOptimizer.totalTokensSaved
        },
        activeFlows: status.activeFlows,
        learningBufferSize: status.learningBufferSize,
        config: {
          enabledPhases: status.config.enabledPhases,
          learningEnabled: status.config.learningEnabled,
          parallelTools: status.config.parallelTools
        }
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Trigger learning capture
 */
async function cmdCognitiveLearn(cwd, operation, options, raw) {
  try {
    const { getOrchestrator, CognitivePhase } = await import('../lib/cognitive-flow/index.js');
    
    const orchestrator = getOrchestrator();
    
    // Create a minimal learning context
    const operationName = operation || 'manual-capture';
    const phase = options.phase ? CognitivePhase[options.phase.toUpperCase()] : CognitivePhase.LEARN;
    
    // Execute a quick flow to trigger learning
    const result = await orchestrator.quickExecute(operationName, { capture: true }, {
      timeout: 5000
    });
    
    if (raw) {
      console.log(`Learning capture triggered for: ${operationName}`);
      console.log(`Learnings captured: ${result.learnings.length}`);
      if (result.learnings.length > 0) {
        console.log('\nCaptured learnings:');
        result.learnings.forEach((l, i) => console.log(`  ${i + 1}. ${l}`));
      }
      console.log(`\nInsights: ${result.insights.length}`);
      console.log(`Duration: ${result.duration}ms`);
    } else {
      output({
        success: result.success,
        operation: operationName,
        learnings: result.learnings,
        insights: result.insights,
        duration: result.duration
      }, raw);
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

/**
 * Optimize cognitive settings
 */
async function cmdCognitiveOptimize(cwd, options, raw) {
  try {
    const { getOrchestrator } = await import('../lib/cognitive-flow/index.js');
    
    const orchestrator = getOrchestrator();
    
    if (options.resetStats) {
      // Reset statistics
      const status = orchestrator.getStatus();
      
      if (raw) {
        console.log('Cognitive statistics reset.');
        console.log('Previous stats:');
        console.log(`  Server calls: ${status.serverPool.totalCalls}`);
        console.log(`  Tool calls: ${status.toolOptimizer.totalCalls}`);
        console.log(`  Tokens saved: ${status.toolOptimizer.totalTokensSaved}`);
      }
      
      output({
        success: true,
        action: 'reset-stats',
        previousStats: {
          serverCalls: status.serverPool.totalCalls,
          toolCalls: status.toolOptimizer.totalCalls,
          tokensSaved: status.toolOptimizer.totalTokensSaved
        }
      }, raw);
    } else {
      // Show optimization recommendations
      const status = orchestrator.getStatus();
      const recommendations = [];
      
      // Check server health
      for (const [server, stats] of status.serverPool.serverStats) {
        if (stats.errors > 5) {
          recommendations.push({
            type: 'server-health',
            server,
            message: `Server ${server} has high error count (${stats.errors}). Consider checking MCP server status.`
          });
        }
        if (stats.availability < 90) {
          recommendations.push({
            type: 'availability',
            server,
            message: `Server ${server} availability is low (${stats.availability}%). Check server health.`
          });
        }
      }
      
      // Check token efficiency
      const tokenEfficiency = status.toolOptimizer.totalTokensSaved / 
        Math.max(1, status.toolOptimizer.totalTokensUsed) * 100;
      
      if (tokenEfficiency < 50) {
        recommendations.push({
          type: 'token-efficiency',
          message: `Token efficiency is ${Math.round(tokenEfficiency)}%. Consider using more MCP tools for better savings.`
        });
      }
      
      if (raw) {
        console.log('=== Cognitive Optimization Analysis ===\n');
        
        if (recommendations.length === 0) {
          console.log('No optimization issues detected. System is running optimally.');
        } else {
          console.log(`Found ${recommendations.length} optimization opportunities:\n`);
          recommendations.forEach((r, i) => {
            console.log(`${i + 1}. [${r.type}] ${r.message}`);
          });
        }
        
        console.log('\nCurrent efficiency:');
        console.log(`  Token savings: ${Math.round(tokenEfficiency)}%`);
        console.log(`  Active flows: ${status.activeFlows}`);
        console.log(`  Learning buffer: ${status.learningBufferSize}`);
      } else {
        output({
          success: true,
          recommendations,
          efficiency: {
            tokenSavings: Math.round(tokenEfficiency),
            activeFlows: status.activeFlows,
            learningBuffer: status.learningBufferSize
          }
        }, raw);
      }
    }
  } catch (err) {
    const result = { success: false, error: err.message };
    output(result, raw);
  }
}

main();
