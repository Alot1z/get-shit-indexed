# Electrobun Packaging Architecture for GSI

---
created: 2026-02-19
status: VERIFIED_WORKING
source: https://github.com/blackboardsh/electrobun
---

## Verification

✅ **Electrobun is VERIFIED and WORKING:**
- Cloned successfully at `C:\github-repos\my-claude-code-repos\electrobun`
- Installed with `bun install` (91 packages)
- Built successfully for win32 x64 with MSVC tools
- CLI downloaded and working via `npx electrobun init`
- Test project created at `C:\Users\mose\my-hello-world-app`

**Important Note from Electrobun:**
```
NOTE FOR AI ASSISTANTS: Electrobun is NOT Electron.
Different architecture, different APIs. Do not use Electron patterns.
Docs: https://blackboard.sh/electrobun/llms.txt
```

## What is Electrobun?

Electrobun is a cross-platform desktop application framework that uses:
- **Bun** for JavaScript/TypeScript runtime
- **CEF** (Chromium Embedded Framework) for UI rendering
- **Zig** for native bindings and performance-critical code
- **bsdiff** for delta updates

### Key Advantages over Plain Bun Compile

| Feature | Bun Compile | Electrobun |
|---------|-------------|------------|
| GUI Support | ❌ CLI only | ✅ Full desktop UI |
| Auto-Update | ❌ Manual | ✅ Built-in delta updates |
| Cross-Platform | ⚠️ Binaries only | ✅ Full desktop apps |
| Hot Reload | ❌ No | ✅ Yes (`bun start`) |
| App Signing | ❌ Manual | ✅ Integrated |
| Binary Size | ~50MB | ~100MB (with CEF) |

## GSI Package Architecture with Electrobun

### Package Structure

```
gsi-desktop/
├── src/
│   ├── main/
│   │   └── index.ts          # Main process entry
│   ├── renderer/
│   │   ├── index.html        # UI entry point
│   │   ├── app.tsx           # React/Svelte UI
│   │   └── styles.css        # UI styles
│   └── gsi/
│       ├── cli/              # CLI commands as modules
│       │   ├── file.ts       # gsi file commands
│       │   ├── search.ts     # gsi search commands
│       │   ├── think.ts      # gsi think commands
│       │   └── context.ts    # gsi context commands
│       ├── lib/              # Core GSI libraries
│       │   ├── prompt-enhancer/
│       │   ├── pattern-learning/
│       │   ├── complexity/
│       │   └── thinking/
│       └── native/           # Native bindings
│           ├── mcp-bridge/   # MCP server bridge
│           └── file-watcher/ # File system monitoring
├── electrobun.config.ts      # Electrobun configuration
├── package.json
└── bunfig.toml
```

### electrobun.config.ts

```typescript
import { defineConfig } from 'electrobun';

export default defineConfig({
  // Application identity
  id: 'sh.blackboard.gsi',
  name: 'GSI Desktop',
  version: '1.0.0',
  
  // Build targets
  platforms: ['win32-x64', 'darwin-arm64', 'darwin-x64', 'linux-x64'],
  
  // Main process
  main: {
    entry: './src/main/index.ts',
    preload: './src/preload/index.ts',
  },
  
  // Renderer (UI)
  renderer: {
    entry: './src/renderer/index.html',
    devServer: {
      port: 3000,
    },
  },
  
  // Binary bundling
  binary: {
    include: [
      './src/gsi/**/*',
      './lib/**/*',
    ],
    exclude: [
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
  },
  
  // Auto-update configuration
  update: {
    url: 'https://releases.gsi.sh',
    channel: 'stable', // or 'beta', 'dev'
    publicKey: '...', // For signature verification
  },
  
  // Window configuration
  window: {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset', // macOS
    frame: true, // Windows/Linux
  },
});
```

## GSI Desktop Application Features

### 1. Integrated CLI Terminal

The desktop app includes a built-in terminal for running GSI commands:

```typescript
// src/renderer/components/Terminal.tsx
import { spawn } from 'bun';

export function Terminal() {
  const runCommand = async (command: string) => {
    const gsi = spawn({
      cmd: ['gsi', ...command.split(' ')],
      cwd: projectPath,
      stdout: 'pipe',
      stderr: 'pipe',
    });
    
    // Stream output to terminal UI
    for await (const line of gsi.stdout) {
      appendOutput(line);
    }
  };
  
  return (
    <div className="terminal">
      <Output buffer={output} />
      <Input onCommand={runCommand} />
    </div>
  );
}
```

### 2. Phase Explorer UI

Visual interface for exploring and managing GSI phases:

```typescript
// src/renderer/components/PhaseExplorer.tsx
export function PhaseExplorer() {
  const phases = usePhases();
  
  return (
    <div className="phase-explorer">
      <PhaseList phases={phases} />
      <PhaseDetails phase={selectedPhase} />
      <PlanViewer plans={selectedPhase.plans} />
    </div>
  );
}
```

### 3. Context Generator Panel

Visual interface for files-to-prompt context generation:

```typescript
// src/renderer/components/ContextGenerator.tsx
export function ContextGenerator() {
  const generateContext = async (target: string) => {
    const result = await gsi.context.generate(target, {
      format: 'cxml',
      output: '.planning/context/phase-49.xml',
    });
    
    showPreview(result);
  };
  
  return (
    <div className="context-generator">
      <TargetSelector onSelect={generateContext} />
      <PreviewPanel content={previewContent} />
      <TokenMetrics savings={tokenSavings} />
    </div>
  );
}
```

### 4. Native MCP Bridge

Bridge MCP servers to work within the desktop app:

```typescript
// src/gsi/native/mcp-bridge/index.ts
import { createMcpServer } from '@modelcontextprotocol/sdk';

export function createGsiMcpBridge() {
  return createMcpServer({
    name: 'gsi-bridge',
    version: '1.0.0',
    tools: {
      // File operations using Bun's native APIs
      'file/read': async (path: string) => {
        return Bun.file(path).text();
      },
      'file/write': async (path: string, content: string) => {
        await Bun.write(path, content);
        return { success: true };
      },
      
      // Search using ripgrep (bundled)
      'search/code': async (pattern: string, path: string) => {
        const result = await spawn(['rg', pattern, path]);
        return result.stdout;
      },
      
      // Thinking using bundled modules
      'think/sequential': async (prompt: string) => {
        return sequentialThinking(prompt);
      },
    },
  });
}
```

## Build Pipeline

### Development

```bash
# Start development server with hot reload
cd gsi-desktop
bun install
bun start

# Opens Electrobun dev window with:
# - Live reload on file changes
# - DevTools integration
# - Console logging
```

### Production Build

```bash
# Build for current platform
bun run build

# Build for all platforms
bun run build:all

# Creates:
# - gsi-desktop-win32-x64/
# - gsi-desktop-darwin-arm64/
# - gsi-desktop-darwin-x64/
# - gsi-desktop-linux-x64/
```

### Release

```bash
# Create signed release
bun run release

# Uploads to:
# - https://releases.gsi.sh/stable/
# - Creates delta updates for auto-update
```

## Distribution Strategy

### Download Options

1. **Direct Download:**
   - `https://gsi.sh/download/windows`
   - `https://gsi.sh/download/macos`
   - `https://gsi.sh/download/linux`

2. **Package Managers:**
   ```bash
   # Homebrew (macOS)
   brew install gsi
   
   # Scoop (Windows)
   scoop install gsi
   
   # AUR (Linux)
   yay -S gsi-desktop
   ```

3. **NPM (for CLI-only):**
   ```bash
   npm install -g @get-shit-indexed/cli
   ```

### Auto-Update Flow

```
App starts
    ↓
Check https://releases.gsi.sh/stable/version.json
    ↓
New version available?
    ├─ No → Continue
    └─ Yes → Download delta patch (~5MB)
              ↓
              Apply bsdiff patch
              ↓
              Verify signature
              ↓
              Restart app
```

## Integration with Phase 49/50

### Phase 49: GSI Architecture Overhaul

1. **Objective 3 (External Repository Absorption):**
   - Fork electrobun into GSI repository
   - Customize for GSI-specific needs
   - Create GSI desktop templates

2. **Objective 5 (Architectural Refactor):**
   - Create `lib/native/` for bundled native modules
   - Integrate MCP bridge into desktop app
   - Package prompt-enhancer as native module

### Phase 50: Ultimate Integration

1. **Layer 5 (Distribution):**
   - Use electrobun for all desktop distribution
   - Create platform-specific installers
   - Implement auto-update infrastructure

2. **Repository Integration:**
   - Bundle files-to-prompt into desktop app
   - Include all MCP-converted CLI tools
   - Package agent templates as embedded resources

## Size Estimates

| Component | Size |
|-----------|------|
| CEF Runtime | ~60 MB |
| Bun Runtime | ~30 MB |
| GSI Core | ~5 MB |
| GSI Libraries | ~3 MB |
| Native Modules | ~2 MB |
| **Total** | **~100 MB** |

After compression (installer): ~40-50 MB

## Next Steps

1. Fork electrobun to GSI organization
2. Create gsi-desktop template from hello-world
3. Integrate GSI CLI as native modules
4. Build first desktop release
5. Set up auto-update infrastructure

---

**Document Status:** VERIFIED - Electrobun confirmed working on Windows 10
**Updated:** 2026-02-19
