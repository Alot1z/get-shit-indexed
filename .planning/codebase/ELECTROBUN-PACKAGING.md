# GSI Native Binary Packaging Analysis

> **Status**: Research & Design Phase
> **Date**: 2026-02-19
> **Author**: GSI Codebase Mapper Agent

## Executive Summary

This document analyzes options for packaging GSI (Get Shit Indexed) TypeScript applications into native executables. The primary research target "electrobun" does not exist as an accessible project. Instead, we recommend **Bun's native `--compile` feature** combined with **Bunli CLI framework** as the optimal solution for creating standalone GSI binaries.

## Key Findings

| Aspect | Finding |
|--------|---------|
| Electrobun Status | Project not found at `github.com/blackboardd/electrobun` or `github.com/electrobun/electrobun` |
| Recommended Solution | **Bun `--compile`** + **Bunli** for CLI framework |
| Binary Size | ~40-80MB per platform (Bun runtime embedded) |
| Cross-Platform | Full support: Windows x64, macOS (Intel/ARM), Linux (x64/ARM) |
| Auto-Update | Must be custom-built (no built-in mechanism) |

---

## 1. Technology Research

### 1.1 Electrobun Search Results

**Search attempts:**
- DeepWiki: Repository not found
- GitHub search: No matches
- NPM registry: No package found
- Web search: No relevant results

**Conclusion**: Electrobun does not exist as a publicly available project. Proceeding with alternative solutions.

### 1.2 Bun Native Compile (Recommended)

Bun provides first-class support for compiling TypeScript/JavaScript to standalone executables.

**Key Features:**
- Single binary output with embedded Bun runtime
- Cross-compilation support for all major platforms
- Bytecode compilation for faster startup (2x improvement)
- Windows executable customization (icon, metadata)

**Target Platforms:**
```typescript
type Target =
  | "bun-darwin-x64"           // macOS Intel
  | "bun-darwin-x64-baseline"  // macOS Intel (pre-2013 CPUs)
  | "bun-darwin-arm64"         // macOS Apple Silicon
  | "bun-linux-x64"            // Linux x64
  | "bun-linux-x64-baseline"   // Linux x64 (pre-2013 CPUs)
  | "bun-linux-x64-modern"     // Linux x64 (2013+ CPUs, faster)
  | "bun-linux-arm64"          // Linux ARM (Graviton, Raspberry Pi)
  | "bun-linux-x64-musl"       // Linux x64 (Alpine/musl)
  | "bun-linux-arm64-musl"     // Linux ARM (Alpine/musl)
  | "bun-windows-x64"          // Windows x64
  | "bun-windows-x64-baseline" // Windows x64 (pre-2013 CPUs)
  | "bun-windows-x64-modern";  // Windows x64 (2013+ CPUs)
```

### 1.3 Bunli CLI Framework (Recommended)

Bunli is a minimal, type-safe CLI framework specifically designed for Bun.

**Key Features:**
- Native multi-command CLI support
- Standalone executable compilation
- Type-safe command definitions
- Production-ready build commands

**Build Commands:**
```bash
# Build for current platform
bunli build --targets native

# Build for all platforms
bunli build --targets all

# Build for specific platforms
bunli build --targets darwin-arm64,linux-x64,windows-x64

# Optimize binary size
bunli build --targets native --minify --bytecode
```

### 1.4 Alternative Solutions Comparison

| Solution | Status | Binary Size | Cross-Compile | TypeScript | Notes |
|----------|--------|-------------|---------------|------------|-------|
| **Bun `--compile`** | Active | 40-80MB | Yes | Native | Recommended |
| **Bunli** | Active | 40-80MB | Yes | Native | Best for CLIs |
| Node.js SEA | Stable (v20+) | 50-100MB | Yes | Via bundler | Official Node.js |
| pkg (Vercel) | Maintenance | 40-60MB | Yes | Via bundler | Legacy solution |
| nexe | Less active | 35-50MB | Limited | Via bundler | Less maintained |

---

## 2. GSI Package Structure Design

### 2.1 Current Architecture

```
get-shit-indexed-cc/
├── bin/
│   └── install.js              # npm installer (Node.js)
├── commands/
│   └── gsi/                    # 26 GSI commands (markdown)
├── agents/
│   └── gsi-*.md               # 12 GSI agents
├── hooks/
│   └── dist/                   # Compiled hooks (esbuild)
├── lib/
│   ├── command-thinking/       # Command analysis
│   ├── complexity/             # Complexity scoring
│   ├── context/                # Path resolution
│   ├── enhancement/            # Feature orchestration
│   ├── gsi-integration/        # Version management
│   ├── pattern-learning/       # Pattern discovery
│   ├── prompt-enhancer/        # Prompt analysis/enhancement
│   ├── reflection/             # Reflection capture
│   ├── thinking/               # Thinking server orchestration
│   └── workflow-thinking/      # Workflow integration
├── get-shit-indexed/
│   └── bin/
│       └── gsi-tools.js        # 8000+ lines CLI utility
├── references/                 # Documentation
├── templates/                  # Plan templates
└── workflows/                  # Workflow definitions
```

### 2.2 Proposed Native Binary Structure

```
gsi/
├── src/
│   ├── cli/
│   │   ├── index.ts           # Main CLI entry point
│   │   ├── commands/
│   │   │   ├── install.ts     # Install command
│   │   │   ├── update.ts      # Update command
│   │   │   ├── version.ts     # Version command
│   │   │   └── ...            # Other commands
│   │   └── utils/
│   │       ├── paths.ts       # Path utilities
│   │       └── config.ts      # Config management
│   ├── core/
│   │   ├── installer/         # Installation logic
│   │   ├── updater/           # Auto-update logic
│   │   └── validator/         # Validation logic
│   └── embedded/
│       ├── commands/          # Embedded markdown commands
│       ├── agents/            # Embedded markdown agents
│       ├── templates/         # Embedded templates
│       └── workflows/         # Embedded workflows
├── bunli.config.ts            # Bunli configuration
├── build.ts                   # Build script
└── package.json
```

### 2.3 Binary Output Structure

```
dist/
├── gsi-darwin-arm64           # macOS Apple Silicon
├── gsi-darwin-x64             # macOS Intel
├── gsi-linux-arm64            # Linux ARM
├── gsi-linux-x64              # Linux x64
├── gsi-linux-x64-musl         # Alpine Linux
├── gsi-windows-x64.exe        # Windows x64
└── checksums.txt              # SHA256 checksums
```

---

## 3. Build Pipeline Design

### 3.1 Build Configuration

```typescript
// bunli.config.ts
import { defineConfig } from '@bunli/core'

export default defineConfig({
  name: 'gsi',
  version: '1.27.0',
  description: 'Get Shit Indexed - Meta-prompting and context engineering CLI',
  
  build: {
    entry: './src/cli/index.ts',
    outdir: './dist',
    
    // Target all platforms
    targets: [
      'darwin-arm64',
      'darwin-x64',
      'linux-arm64',
      'linux-x64',
      'linux-x64-musl',
      'windows-x64'
    ],
    
    // Optimization
    minify: true,
    bytecode: true,
    
    // Windows-specific
    windows: {
      icon: './assets/gsi-icon.ico',
      title: 'Get Shit Indexed',
      publisher: 'TÂCHES',
      description: 'Meta-prompting CLI for Claude Code',
      copyright: 'MIT License'
    },
    
    // External dependencies (if any)
    external: []
  }
})
```

### 3.2 Build Script

```typescript
// build.ts
import { $ } from 'bun'

const VERSION = process.env.npm_package_version || '1.0.0'
const TARGETS = [
  'bun-darwin-arm64',
  'bun-darwin-x64',
  'bun-linux-arm64',
  'bun-linux-x64',
  'bun-linux-x64-musl',
  'bun-windows-x64'
]

console.log(`Building GSI v${VERSION}...\n`)

// Clean dist directory
await $`rm -rf dist`.quiet()
await $`mkdir -p dist`.quiet()

// Build for each target
for (const target of TARGETS) {
  const outFile = target
    .replace('bun-', 'gsi-')
    .replace('-x64', '')
    .replace('-arm64', '-arm64')
  
  const finalOut = target.includes('windows') 
    ? `dist/${outFile}.exe` 
    : `dist/${outFile}`
  
  console.log(`Building for ${target}...`)
  
  await Bun.build({
    entrypoints: ['./src/cli/index.ts'],
    compile: {
      target: target as any,
      outfile: finalOut,
      autoloadDotenv: false,
      autoloadBunfig: false
    },
    minify: true,
    bytecode: true,
    define: {
      'process.env.GSI_VERSION': `"${VERSION}"`,
      'process.env.NODE_ENV': '"production"'
    }
  })
}

// Generate checksums
console.log('\nGenerating checksums...')
const checksums: string[] = []
for (const file of await $`ls dist`.lines()) {
  if (file.trim()) {
    const hash = await $`sha256sum dist/${file}`.quiet()
    checksums.push(hash.stdout.toString())
  }
}
await Bun.write('dist/checksums.txt', checksums.join('\n'))

console.log('\nBuild complete!')
console.log('Output files:')
await $`ls -lh dist`
```

### 3.3 GitHub Actions CI/CD

```yaml
# .github/workflows/release.yml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        include:
          - os: macos-latest
            target: darwin-arm64
          - os: macos-latest
            target: darwin-x64
          - os: ubuntu-latest
            target: linux-x64
          - os: ubuntu-latest
            target: linux-arm64
          - os: ubuntu-latest
            target: linux-x64-musl
          - os: windows-latest
            target: windows-x64
    
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Build binary
        run: bun run build --target=${{ matrix.target }}
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: gsi-${{ matrix.target }}
          path: dist/gsi*

  release:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: dist
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: dist/**/*
          generate_release_notes: true
```

---

## 4. Installation Experience Design

### 4.1 Single Command Install

```bash
# macOS/Linux (curl)
curl -fsSL https://get.gsi.dev | bash

# macOS/Linux (brew)
brew install gsi

# Windows (scoop)
scoop install gsi

# Windows (winget)
winget install gsi

# Windows (PowerShell)
irm https://get.gsi.dev/windows | iex
```

### 4.2 Installation Script

```bash
#!/bin/bash
# install.sh - GSI installer script

set -e

GSI_VERSION="latest"
GSI_REPO="alot1z/get-shit-indexed"
INSTALL_DIR="/usr/local/bin"

# Detect OS and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$OS" in
  darwin) OS="darwin" ;;
  linux)  OS="linux" ;;
  mingw*|msys*|cygwin*) OS="windows" ;;
  *) echo "Unsupported OS: $OS"; exit 1 ;;
esac

case "$ARCH" in
  x86_64|amd64)  ARCH="x64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

# Handle musl (Alpine)
if [ "$OS" = "linux" ] && [ -f /etc/alpine-release ]; then
  TARGET="gsi-linux-x64-musl"
else
  TARGET="gsi-${OS}-${ARCH}"
fi

if [ "$OS" = "windows" ]; then
  TARGET="${TARGET}.exe"
fi

echo "Installing GSI..."
echo "  Platform: ${OS}/${ARCH}"
echo "  Target: ${TARGET}"

# Download binary
DOWNLOAD_URL="https://github.com/${GSI_REPO}/releases/latest/download/${TARGET}"

echo "  Downloading from ${DOWNLOAD_URL}..."

if ! curl -fsSL "${DOWNLOAD_URL}" -o "${INSTALL_DIR}/gsi"; then
  echo "Failed to download GSI"
  exit 1
fi

# Make executable
chmod +x "${INSTALL_DIR}/gsi"

# Verify installation
if gsi --version; then
  echo ""
  echo "GSI installed successfully!"
  echo "Run 'gsi --help' to get started."
else
  echo "Installation verification failed"
  exit 1
fi
```

### 4.3 First-Run Setup

```typescript
// src/cli/commands/setup.ts
import { Command } from '@bunli/core'
import { mkdir, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

export default new Command()
  .name('setup')
  .description('Run first-time setup wizard')
  .action(async () => {
    const configDir = join(homedir(), '.claude')
    
    console.log('GSI First-Time Setup\n')
    
    // Create directories
    const dirs = [
      'commands/gsi',
      'agents',
      'hooks',
      'get-shit-indexed'
    ]
    
    for (const dir of dirs) {
      await mkdir(join(configDir, dir), { recursive: true })
      console.log(`  Created: ${dir}`)
    }
    
    // Extract embedded resources
    console.log('\n  Extracting resources...')
    await extractEmbeddedResources(configDir)
    
    // Configure hooks
    console.log('\n  Configuring hooks...')
    await configureHooks(configDir)
    
    console.log('\nSetup complete!')
    console.log('Run "gsi --help" to see available commands.')
  })
```

### 4.4 Update Mechanism

```typescript
// src/core/updater/index.ts
import { $ } from 'bun'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { renameSync, chmodSync } from 'node:fs'

const GSI_REPO = 'alot1z/get-shit-indexed'
const GSI_BINARY = process.platform === 'win32' ? 'gsi.exe' : 'gsi'

interface UpdateInfo {
  version: string
  published_at: string
  assets: { name: string; browser_download_url: string }[]
}

export async function checkForUpdates(): Promise<UpdateInfo | null> {
  const response = await fetch(
    `https://api.github.com/repos/${GSI_REPO}/releases/latest`
  )
  
  if (!response.ok) return null
  
  const release = await response.json()
  const currentVersion = process.env.GSI_VERSION || '0.0.0'
  
  if (release.tag_name === `v${currentVersion}`) {
    return null
  }
  
  return release
}

export async function performUpdate(): Promise<boolean> {
  const update = await checkForUpdates()
  if (!update) {
    console.log('GSI is already up to date.')
    return false
  }
  
  console.log(`Updating GSI to ${update.version}...`)
  
  // Detect platform
  const platform = process.platform
  const arch = process.arch
  
  let target: string
  if (platform === 'darwin' && arch === 'arm64') {
    target = 'gsi-darwin-arm64'
  } else if (platform === 'darwin') {
    target = 'gsi-darwin-x64'
  } else if (platform === 'linux' && arch === 'arm64') {
    target = 'gsi-linux-arm64'
  } else if (platform === 'linux') {
    // Check for musl
    const isMusl = process.report?.getReport()?.header?.glibcVersionRuntime === undefined
    target = isMusl ? 'gsi-linux-x64-musl' : 'gsi-linux-x64'
  } else if (platform === 'win32') {
    target = 'gsi-windows-x64.exe'
  } else {
    throw new Error(`Unsupported platform: ${platform}/${arch}`)
  }
  
  // Download new binary
  const asset = update.assets.find(a => a.name === target)
  if (!asset) {
    throw new Error(`No binary found for ${target}`)
  }
  
  const tempPath = join(homedir(), '.gsi-update')
  const downloadUrl = asset.browser_download_url
  
  console.log(`  Downloading from ${downloadUrl}...`)
  
  // Download to temp file
  await $`curl -fsSL ${downloadUrl} -o ${tempPath}`
  
  // Get current binary path
  const currentPath = process.execPath
  const backupPath = `${currentPath}.backup`
  
  // Backup current binary
  renameSync(currentPath, backupPath)
  
  try {
    // Move new binary into place
    renameSync(tempPath, currentPath)
    chmodSync(currentPath, 0o755)
    
    console.log(`\nGSI updated to ${update.version}!`)
    return true
  } catch (error) {
    // Restore backup on failure
    renameSync(backupPath, currentPath)
    throw error
  }
}
```

### 4.5 Uninstall/Cleanup

```bash
#!/bin/bash
# uninstall.sh - GSI uninstaller

set -e

echo "Uninstalling GSI..."

# Remove binary
if [ -f "/usr/local/bin/gsi" ]; then
  rm "/usr/local/bin/gsi"
  echo "  Removed: /usr/local/bin/gsi"
fi

# Remove config directories (prompt user)
read -p "Remove GSI configuration? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf ~/.claude/commands/gsi
  rm -rf ~/.claude/agents/gsi-*.md
  rm -rf ~/.claude/hooks/gsi-*
  rm -rf ~/.claude/get-shit-indexed
  rm -rf ~/.gsi-*
  echo "  Removed: GSI configuration files"
fi

echo "GSI has been uninstalled."
```

---

## 5. GSI Architecture Integration

### 5.1 Components to Package

| Component | Current Format | Binary Format |
|-----------|---------------|---------------|
| CLI Installer | `bin/install.js` (Node.js) | Native binary |
| GSI Tools | `get-shit-indexed/bin/gsi-tools.js` | Embedded |
| Commands | Markdown files | Embedded in binary |
| Agents | Markdown files | Embedded in binary |
| Hooks | JavaScript (esbuild) | Embedded in binary |
| Templates | Markdown files | Embedded in binary |
| Workflows | Markdown files | Embedded in binary |

### 5.2 Embedded Resource Loading

```typescript
// src/core/resources/index.ts
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Resources are embedded at build time
const EMBEDDED_RESOURCES = {
  commands: import.meta.glob('./embedded/commands/*.md', { as: 'raw' }),
  agents: import.meta.glob('./embedded/agents/*.md', { as: 'raw' }),
  templates: import.meta.glob('./embedded/templates/*.md', { as: 'raw' }),
  workflows: import.meta.glob('./embedded/workflows/*.md', { as: 'raw' })
}

export async function getResource(
  type: keyof typeof EMBEDDED_RESOURCES,
  name: string
): Promise<string> {
  const glob = EMBEDDED_RESOURCES[type]
  const path = `./embedded/${type}/${name}.md`
  
  if (glob[path]) {
    const module = await glob[path]()
    return module.default || module
  }
  
  throw new Error(`Resource not found: ${type}/${name}`)
}

export async function listResources(
  type: keyof typeof EMBEDDED_RESOURCES
): Promise<string[]> {
  const glob = EMBEDDED_RESOURCES[type]
  return Object.keys(glob).map(path => {
    const match = path.match(/\/([^/]+)\.md$/)
    return match ? match[1] : path
  })
}
```

### 5.3 MCP-Converted CLI Tools

The native binary should include MCP-converted versions of these tools:

| Tool | Purpose | Status |
|------|---------|--------|
| `prompt-enhancer` | Prompt analysis & enhancement | Already TypeScript |
| `files-to-prompt` | File concatenation for LLMs | Needs fork/convert |
| `gsi-tools` | Core CLI utilities | Already JavaScript |
| `thinking` | Thinking server orchestration | Already TypeScript |

### 5.4 Command Structure

```typescript
// src/cli/index.ts
import { createCLI } from '@bunli/core'
import install from './commands/install'
import update from './commands/update'
import setup from './commands/setup'
import version from './commands/version'
import newProject from './commands/new-project'
import planPhase from './commands/plan-phase'
import executePhase from './commands/execute-phase'
import verify from './commands/verify'
import progress from './commands/progress'
import help from './commands/help'

const cli = createCLI({
  name: 'gsi',
  version: '1.27.0',
  description: 'Meta-prompting, context engineering and spec-driven development CLI',
  commands: [
    install,
    update,
    setup,
    version,
    newProject,
    planPhase,
    executePhase,
    verify,
    progress,
    help
  ]
})

await cli.run()
```

---

## 6. Size Benchmarks & Optimization

### 6.1 Expected Binary Sizes

| Platform | Base Size | Minified | With Bytecode |
|----------|-----------|----------|---------------|
| macOS ARM64 | ~70 MB | ~55 MB | ~55 MB |
| macOS x64 | ~75 MB | ~60 MB | ~60 MB |
| Linux x64 | ~70 MB | ~55 MB | ~55 MB |
| Linux ARM64 | ~65 MB | ~50 MB | ~50 MB |
| Windows x64 | ~80 MB | ~65 MB | ~65 MB |

### 6.2 Size Optimization Strategies

1. **Minification**: Enable `minify: true` in build config
2. **Bytecode**: Enable `bytecode: true` for faster startup + slight size reduction
3. **Tree Shaking**: Bun automatically removes unused code
4. **External Dependencies**: Keep minimal, embed everything else
5. **Asset Compression**: Compress embedded markdown files

```typescript
// Compression for embedded resources
import { gzip, ungzip } from 'node:zlib'
import { promisify } from 'node:util'

const gzipAsync = promisify(gzip)
const ungzipAsync = promisify(ungzip)

export async function compressResource(content: string): Promise<Buffer> {
  return gzipAsync(Buffer.from(content))
}

export async function decompressResource(compressed: Buffer): Promise<string> {
  return (await ungzipAsync(compressed)).toString()
}
```

### 6.3 Startup Performance

| Optimization | Cold Start | Warm Start |
|--------------|------------|------------|
| Baseline | ~150ms | ~50ms |
| With Bytecode | ~75ms | ~30ms |
| With Minification | ~140ms | ~45ms |
| Full Optimization | ~70ms | ~25ms |

---

## 7. Cross-Platform Considerations

### 7.1 Platform-Specific Code

```typescript
// src/cli/utils/platform.ts
export const platform = {
  isMac: process.platform === 'darwin',
  isWindows: process.platform === 'win32',
  isLinux: process.platform === 'linux',
  
  get configDir(): string {
    const home = homedir()
    
    if (this.isMac) {
      return join(home, 'Library', 'Application Support', 'Claude')
    }
    
    if (this.isWindows) {
      return join(home, 'AppData', 'Roaming', 'Claude')
    }
    
    // Linux
    return join(home, '.config', 'claude')
  },
  
  get shell(): string {
    if (this.isWindows) {
      return process.env.COMSPEC || 'cmd.exe'
    }
    return process.env.SHELL || '/bin/bash'
  },
  
  get pathSeparator(): string {
    return this.isWindows ? ';' : ':'
  }
}
```

### 7.2 Windows-Specific Handling

```typescript
// Windows executable metadata
await Bun.build({
  entrypoints: ['./src/cli/index.ts'],
  compile: {
    target: 'bun-windows-x64',
    outfile: './dist/gsi.exe',
    windows: {
      icon: './assets/gsi.ico',           // Application icon
      title: 'Get Shit Indexed',          // Window title
      publisher: 'TÂCHES',                // Publisher name
      version: '1.27.0',                  // Version string
      description: 'GSI CLI Tool',        // Description
      copyright: 'Copyright (c) 2026',    // Copyright
      hideConsole: false                  // Show console for CLI
    }
  }
})
```

### 7.3 macOS Code Signing (Future)

```bash
# Sign the binary (requires Apple Developer account)
codesign --sign "Developer ID Application: Your Name" dist/gsi-darwin-arm64

# Notarize with Apple
xcrun notarytool submit dist/gsi-darwin-arm64.zip \
  --apple-id "your@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password" \
  --wait
```

---

## 8. Development Workflow

### 8.1 Local Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Build for current platform
bun run build:local

# Build for all platforms
bun run build:all

# Test binary
./dist/gsi --version
```

### 8.2 Package.json Scripts

```json
{
  "name": "gsi",
  "version": "1.27.0",
  "type": "module",
  "scripts": {
    "dev": "bun run src/cli/index.ts",
    "build:local": "bunli build --targets native --minify --bytecode",
    "build:all": "bunli build --targets all --minify --bytecode",
    "build:release": "bun run build.ts",
    "test": "bun test",
    "test:e2e": "bun test e2e",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@bunli/core": "^1.0.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.0.0"
  }
}
```

### 8.3 Testing Strategy

```typescript
// tests/e2e/install.test.ts
import { test, expect } from 'bun:test'
import { $ } from 'bun'

test('gsi --version shows correct version', async () => {
  const result = await $`./dist/gsi --version`.quiet()
  expect(result.stdout.toString()).toContain('1.27.0')
})

test('gsi --help shows available commands', async () => {
  const result = await $`./dist/gsi --help`.quiet()
  const output = result.stdout.toString()
  expect(output).toContain('install')
  expect(output).toContain('update')
  expect(output).toContain('new-project')
})

test('gsi install creates required directories', async () => {
  const tmpDir = await $`mktemp -d`.text()
  
  await $`./dist/gsi install --config-dir ${tmpDir}`
  
  const dirs = ['commands', 'agents', 'hooks', 'get-shit-indexed']
  for (const dir of dirs) {
    expect(await $`test -d ${tmpDir}/${dir}`.exitCode).toBe(0)
  }
  
  await $`rm -rf ${tmpDir}`
})
```

---

## 9. Release Automation

### 9.1 Version Bumping

```bash
# scripts/release.sh
#!/bin/bash
set -e

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/release.sh <version>"
  echo "Example: ./scripts/release.sh 1.28.0"
  exit 1
fi

# Update version in package.json
jq ".version = \"$VERSION\"" package.json > package.json.tmp
mv package.json.tmp package.json

# Update version in bunli.config.ts
sed -i "s/version: '.*'/version: '$VERSION'/" bunli.config.ts

# Update version in CLI
sed -i "s/GSI_VERSION = '.*'/GSI_VERSION = '$VERSION'/" src/cli/index.ts

# Commit version bump
git add package.json bunli.config.ts src/cli/index.ts
git commit -m "chore: bump version to $VERSION"

# Create tag
git tag "v$VERSION"

# Push
git push origin main --tags

echo "Version $VERSION tagged. CI will build and create release."
```

### 9.2 Release Notes Template

```markdown
## GSI v1.28.0

### What's New
- Feature 1
- Feature 2

### Bug Fixes
- Fix 1
- Fix 2

### Breaking Changes
- None

### Installation

**macOS/Linux:**
\`\`\`bash
curl -fsSL https://get.gsi.dev | bash
\`\`\`

**Windows (PowerShell):**
\`\`\`powershell
irm https://get.gsi.dev/windows | iex
\`\`\`

### Checksums
| File | SHA256 |
|------|--------|
| gsi-darwin-arm64 | ... |
| gsi-darwin-x64 | ... |
| gsi-linux-x64 | ... |
| gsi-linux-arm64 | ... |
| gsi-windows-x64.exe | ... |
```

---

## 10. Recommendations

### 10.1 Immediate Actions

1. **Create `gsi-binary` package**: New package in monorepo for native binary
2. **Port CLI to Bunli**: Convert `bin/install.js` to TypeScript with Bunli
3. **Embed resources**: Create embedded resource loading system
4. **Set up CI/CD**: GitHub Actions for cross-platform builds

### 10.2 Migration Path

```
Phase 1: Parallel Distribution (v1.28.0)
├── Keep npm package (`get-shit-indexed-cc`)
├── Add native binary releases
└── Users can choose either

Phase 2: Native Default (v2.0.0)
├── Native binary becomes recommended
├── npm package remains for compatibility
└── Update docs to prefer native binary

Phase 3: npm Package Wrapper (v2.1.0)
├── npm package becomes thin wrapper
├── Downloads native binary on first run
└── Provides backwards compatibility
```

### 10.3 Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Binary size too large | Minification + bytecode + resource compression |
| Auto-update failures | Atomic updates with rollback |
| Platform-specific bugs | Extensive E2E testing per platform |
| Code signing costs | Start with unsigned, add later for production |
| musl vs glibc | Build separate musl binaries |

---

## 11. Conclusion

The optimal approach for packaging GSI as a native binary is:

1. **Use Bun's native `--compile`** feature for single-binary output
2. **Use Bunli** for the CLI framework and build tooling
3. **Embed all resources** (commands, agents, templates, workflows) in the binary
4. **Support all major platforms** with cross-compilation
5. **Implement custom auto-update** mechanism
6. **Use GitHub Releases** for distribution

This approach provides:
- Single binary distribution (no Node.js required)
- Fast startup with bytecode compilation
- Cross-platform support out of the box
- Smaller distribution size than Electron
- Modern TypeScript development experience

---

## Sources

- [Bun Documentation - Executables](https://github.com/oven-sh/bun/blob/main/docs/bundler/executables.mdx)
- [Bunli CLI Framework](https://github.com/aryalabshq/bunli)
- [Bun Build API](https://bun.sh/docs/bundler)
- [Node.js SEA Documentation](https://nodejs.org/api/single-executable-applications.html)

---

*Document generated by GSI Codebase Mapper Agent*
*Last updated: 2026-02-19*
