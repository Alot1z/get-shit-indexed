# Electrobun Desktop Packaging Plan for gsi-explorer

---
plan: 49-06-electrobun
phase: 49
created: 2026-02-19
status: planned
tasks: 24
wave: 6
depends_on: [49-01, 49-04]
---

## Executive Summary

This plan details the implementation of `gsi-explorer`, a cross-platform desktop application built with Electrobun to provide a native GUI for GSI functionality. Electrobun was chosen over Electron for its 10.4x smaller bundle size (14MB vs 150MB) and native TypeScript support with Bun runtime.

## Why Electrobun

| Feature | Electrobun | Electron |
|---------|------------|----------|
| Bundle Size | ~14MB | ~150MB |
| Runtime | Bun (native TS) | Node.js |
| Startup | Fast (no cold start) | Slow cold start |
| Delta Updates | Built-in (~5MB patches) | Requires electron-updater |
| Language | TypeScript throughout | JavaScript/Node.js |
| UI Engine | CEF (Chromium) | Chromium |

**Decision Factor**: 14MB vs 150MB - 10.4x smaller distribution

## 1. Electrobun Project Setup

### 1.1 Project Structure

```
gsi-explorer/
├── src/
│   ├── bun/                    # Main process (Bun runtime)
│   │   ├── index.ts           # Application entry point
│   │   ├── gsi-integration.ts # GSI command bridge
│   │   ├── menu.ts            # Application menu
│   │   ├── tray.ts            # System tray
│   │   └── updater.ts         # Auto-update handler
│   ├── views/                  # Browser views (UI)
│   │   ├── main/              # Main dashboard
│   │   │   ├── index.html
│   │   │   ├── index.ts
│   │   │   └── styles.css
│   │   ├── phases/            # Phase explorer
│   │   │   ├── index.html
│   │   │   ├── index.ts
│   │   │   └── styles.css
│   │   ├── thinking/          # Thinking server dashboard
│   │   │   ├── index.html
│   │   │   ├── index.ts
│   │   │   └── styles.css
│   │   └── shared/            # Shared UI components
│   │       ├── components/
│   │       └── styles/
│   └── shared/                 # Shared types (RPC schemas)
│       └── types.ts           # Type definitions
├── icon.iconset/               # App icons (16-512px at 1x/2x)
├── package.json
├── tsconfig.json
├── electrobun.config.ts
└── README.md
```

### 1.2 Template Selection

**Recommended**: Custom template with React + Tailwind + Vite

```bash
# Initialize with hello-world, then customize
bunx electrobun init gsi-explorer
cd gsi-explorer

# Add React and Tailwind
bun add react react-dom
bun add -d @types/react @types/react-dom
bun add -d tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

### 1.3 Package Configuration

```json
{
  "name": "gsi-explorer",
  "version": "0.1.0",
  "description": "Cross-platform desktop app for GSI - Get Shit Indexed",
  "author": "GSI Team",
  "license": "MIT",
  "devDependencies": {
    "@types/bun": "latest",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "electrobun": "^0.0.1",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "bun run build:dev && electrobun dev",
    "build:dev": "bun install && electrobun build",
    "build:canary": "electrobun build --env=canary --targets=all",
    "build:stable": "electrobun build --env=stable --targets=all"
  }
}
```

### 1.4 TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@shared/*": ["./src/shared/*"],
      "@views/*": ["./src/views/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 1.5 Electrobun Configuration

```typescript
// electrobun.config.ts
import { type ElectrobunConfig } from "electrobun";

export const config: ElectrobunConfig = {
  app: {
    name: "GSI Explorer",
    identifier: "dev.gsi.explorer",
    version: "0.1.0",
  },
  build: {
    bun: {
      entrypoint: "src/bun/index.ts",
    },
    views: {
      "main": {
        entrypoint: "src/views/main/index.ts",
      },
      "phases": {
        entrypoint: "src/views/phases/index.ts",
      },
      "thinking": {
        entrypoint: "src/views/thinking/index.ts",
      },
    },
    copy: {
      "src/views/main/index.html": "views/main/index.html",
      "src/views/phases/index.html": "views/phases/index.html",
      "src/views/thinking/index.html": "views/thinking/index.html",
      "src/views/shared": "views/shared",
    },
    macos: {
      bundleCEF: true,
    },
    win: {
      bundleCEF: true,
    },
    linux: {
      bundleCEF: true,
    },
  },
  release: {
    baseUrl: "https://github.com/Alot1z/get-shit-indexed/releases/latest/download",
  },
};
```

## 2. Core Application Code

### 2.1 Main Entry Point (Bun Process)

```typescript
// src/bun/index.ts
import { BrowserWindow, BrowserView, ApplicationMenu, Electrobun } from "electrobun/bun";
import { Tray } from "electrobun/bun";
import type { GsiRPCType } from "../shared/types";
import { GsiIntegration } from "./gsi-integration";
import { createApplicationMenu } from "./menu";
import { createTray } from "./tray";
import { checkForUpdates } from "./updater";

// RPC schema for GSI integration
const rpc = BrowserView.defineRPC<GsiRPCType>({
  handlers: {
    requests: {
      // Phase operations
      listPhases: async () => {
        return await GsiIntegration.listPhases();
      },
      getPhase: async ({ phaseId }) => {
        return await GsiIntegration.getPhase(phaseId);
      },
      executePhase: async ({ phaseId, options }) => {
        return await GsiIntegration.executePhase(phaseId, options);
      },
      
      // Roadmap operations
      getRoadmap: async () => {
        return await GsiIntegration.getRoadmap();
      },
      getState: async () => {
        return await GsiIntegration.getState();
      },
      
      // Thinking server operations
      startThinking: async ({ mode, query }) => {
        return await GsiIntegration.startThinking(mode, query);
      },
      getThinkingStatus: async () => {
        return await GsiIntegration.getThinkingStatus();
      },
      
      // MCP tool operations
      searchCode: async ({ pattern, options }) => {
        return await GsiIntegration.searchCode(pattern, options);
      },
      findFiles: async ({ pattern }) => {
        return await GsiIntegration.findFiles(pattern);
      },
    },
    messages: {
      logToMain: ({ msg }) => {
        console.log("[VIEW]", msg);
      },
    },
  },
});

// Create main window
const mainWindow = new BrowserWindow({
  title: "GSI Explorer",
  url: "views://main/index.html",
  frame: { width: 1400, height: 900 },
  titleBarStyle: "hidden",
  rpc,
});

// Window control handlers for custom titlebar
rpc.messages.closeWindow = () => mainWindow.close();
rpc.messages.minimizeWindow = () => mainWindow.minimize();
rpc.messages.maximizeWindow = () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
};

// Setup application
async function main() {
  // Create application menu
  createApplicationMenu();
  
  // Create system tray
  createTray();
  
  // Check for updates on startup
  await checkForUpdates();
  
  // Handle menu events
  Electrobun.events.on("application-menu-clicked", (e) => {
    console.log("Menu action:", e.data.action);
    rpc.messages.handleMenuAction({ action: e.data.action });
  });
}

main().catch(console.error);
```

### 2.2 GSI Integration Layer

```typescript
// src/bun/gsi-integration.ts
import { $ } from "bun";
import type { Phase, Roadmap, State } from "../shared/types";

export class GsiIntegration {
  private static gsiPath: string;
  
  static initialize(gsiPath: string) {
    this.gsiPath = gsiPath;
  }
  
  // Phase Operations
  static async listPhases(): Promise<Phase[]> {
    const result = await $`gsi-tools phases list --format json`.json();
    return result;
  }
  
  static async getPhase(phaseId: string): Promise<Phase> {
    const result = await $`gsi-tools roadmap get-phase ${phaseId} --format json`.json();
    return result;
  }
  
  static async executePhase(
    phaseId: string, 
    options: { dryRun?: boolean; verbose?: boolean }
  ): Promise<{ success: boolean; output: string }> {
    const flags = [
      options.dryRun ? "--dry-run" : "",
      options.verbose ? "--verbose" : "",
    ].filter(Boolean).join(" ");
    
    const result = await $`gsi-tools init execute-phase ${phaseId} ${flags}`.text();
    return { success: true, output: result };
  }
  
  // Roadmap Operations
  static async getRoadmap(): Promise<Roadmap> {
    const result = await $`gsi-tools roadmap get --format json`.json();
    return result;
  }
  
  static async getState(): Promise<State> {
    const result = await $`gsi-tools state-snapshot --format json`.json();
    return result;
  }
  
  // Thinking Server Operations
  static async startThinking(
    mode: "sequential" | "tractatus" | "debug",
    query: string
  ): Promise<{ sessionId: string }> {
    // Call thinking server MCP tools
    const result = await $`gsi-tools thinking start --mode ${mode} --query "${query}"`.json();
    return result;
  }
  
  static async getThinkingStatus(): Promise<{
    active: boolean;
    mode?: string;
    progress?: number;
  }> {
    const result = await $`gsi-tools thinking status --format json`.json();
    return result;
  }
  
  // MCP Tool Operations
  static async searchCode(
    pattern: string,
    options: { filePattern?: string; maxResults?: number }
  ): Promise<{ results: Array<{ file: string; line: number; content: string }> }> {
    const filePattern = options.filePattern ? `--file-pattern "${options.filePattern}"` : "";
    const maxResults = options.maxResults ? `--max-results ${options.maxResults}` : "";
    
    const result = await $`gsi-tools search code "${pattern}" ${filePattern} ${maxResults} --format json`.json();
    return result;
  }
  
  static async findFiles(pattern: string): Promise<{ files: string[] }> {
    const result = await $`gsi-tools search files "${pattern}" --format json`.json();
    return result;
  }
  
  // Summary Extraction
  static async summaryExtract(path: string): Promise<{ data: unknown }> {
    const result = await $`gsi-tools summary-extract "${path}" --format json`.json();
    return result;
  }
}
```

### 2.3 Shared Types (RPC Schema)

```typescript
// src/shared/types.ts
import { RPCSchema } from "electrobun/bun";

// Core GSI Types
export interface Phase {
  id: string;
  name: string;
  status: "planned" | "in-progress" | "complete";
  plans: Plan[];
  progress: number;
}

export interface Plan {
  id: string;
  name: string;
  tasks: Task[];
  status: "planned" | "in-progress" | "complete";
}

export interface Task {
  id: string;
  description: string;
  status: "pending" | "in-progress" | "complete";
}

export interface Roadmap {
  phases: Phase[];
  progress: {
    complete: number;
    total: number;
    percentage: number;
  };
}

export interface State {
  currentPhase: string;
  health: "healthy" | "warning" | "error";
  lastUpdate: string;
  metrics: {
    tokensUsed: number;
    tasksCompleted: number;
    errors: number;
  };
}

// RPC Type Definition
export type GsiRPCType = {
  bun: RPCSchema<{
    requests: {
      // Phase operations
      listPhases: { params: {}; response: Phase[] };
      getPhase: { params: { phaseId: string }; response: Phase };
      executePhase: { 
        params: { phaseId: string; options: { dryRun?: boolean; verbose?: boolean } }; 
        response: { success: boolean; output: string } 
      };
      
      // Roadmap operations
      getRoadmap: { params: {}; response: Roadmap };
      getState: { params: {}; response: State };
      
      // Thinking server
      startThinking: { 
        params: { mode: "sequential" | "tractatus" | "debug"; query: string }; 
        response: { sessionId: string } 
      };
      getThinkingStatus: { 
        params: {}; 
        response: { active: boolean; mode?: string; progress?: number } 
      };
      
      // MCP tools
      searchCode: { 
        params: { pattern: string; options: { filePattern?: string; maxResults?: number } }; 
        response: { results: Array<{ file: string; line: number; content: string }> } 
      };
      findFiles: { params: { pattern: string }; response: { files: string[] } };
    };
    messages: {
      logToMain: { msg: string };
    };
  }>;
  webview: RPCSchema<{
    requests: {
      getDocumentTitle: { params: {}; response: string };
    };
    messages: {
      handleMenuAction: { action: string };
      updatePhase: { phase: Phase };
      updateProgress: { progress: number };
      showNotification: { title: string; message: string };
    };
  }>;
};
```

### 2.4 Application Menu

```typescript
// src/bun/menu.ts
import { ApplicationMenu } from "electrobun/bun";

export function createApplicationMenu() {
  ApplicationMenu.setApplicationMenu([
    {
      label: "GSI Explorer",
      submenu: [
        { label: "About GSI Explorer", action: "about" },
        { type: "separator" },
        { label: "Preferences...", action: "preferences", accelerator: "," },
        { type: "separator" },
        { label: "Quit", role: "quit", accelerator: "q" },
      ],
    },
    {
      label: "File",
      submenu: [
        { label: "New Phase", action: "new-phase", accelerator: "n" },
        { label: "Open Project...", action: "open-project", accelerator: "o" },
        { type: "separator" },
        { label: "Refresh Roadmap", action: "refresh-roadmap", accelerator: "r" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { label: "Dashboard", action: "view-dashboard", accelerator: "1" },
        { label: "Phases", action: "view-phases", accelerator: "2" },
        { label: "Thinking Server", action: "view-thinking", accelerator: "3" },
        { type: "separator" },
        { label: "Toggle DevTools", action: "toggle-devtools", accelerator: "i" },
        { type: "separator" },
        { role: "reload" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Thinking",
      submenu: [
        { label: "Sequential Thinking", action: "thinking-sequential", accelerator: "t s" },
        { label: "Tractatus Analysis", action: "thinking-tractatus", accelerator: "t t" },
        { label: "Debug Thinking", action: "thinking-debug", accelerator: "t d" },
        { type: "separator" },
        { label: "Stop Thinking", action: "thinking-stop", accelerator: "t x" },
      ],
    },
    {
      label: "Help",
      submenu: [
        { label: "GSI Documentation", action: "open-docs" },
        { label: "Report Issue", action: "report-issue" },
        { type: "separator" },
        { label: "Check for Updates...", action: "check-updates" },
      ],
    },
  ]);
}
```

### 2.5 System Tray

```typescript
// src/bun/tray.ts
import { Tray } from "electrobun/bun";

export function createTray() {
  const tray = new Tray({
    title: "GSI Explorer",
    image: "views://assets/gsi-icon-32.png",
    template: true,
    width: 32,
    height: 32,
  });
  
  const updateTrayMenu = (status: { phase?: string; progress?: number }) => {
    tray.setMenu([
      {
        type: "normal",
        label: status.phase ? `Phase: ${status.phase}` : "No active phase",
        enabled: false,
      },
      {
        type: "normal",
        label: `Progress: ${status.progress || 0}%`,
        enabled: false,
      },
      { type: "separator" },
      {
        type: "normal",
        label: "Open Dashboard",
        action: "open-dashboard",
      },
      {
        type: "normal",
        label: "Quick Thinking...",
        action: "quick-thinking",
      },
      { type: "separator" },
      {
        type: "normal",
        label: "Quit",
        action: "quit",
      },
    ]);
  };
  
  // Initial menu
  updateTrayMenu({});
  
  // Handle clicks
  tray.on("tray-clicked", (e) => {
    const { action } = e.data as { id: number; action: string };
    console.log("Tray action:", action);
  });
  
  return { tray, updateTrayMenu };
}
```

## 3. Auto-Update Mechanism

### 3.1 Update Handler

```typescript
// src/bun/updater.ts
import { Updater } from "electrobun/bun";
import { Electrobun } from "electrobun/bun";

interface UpdateStatus {
  checking: boolean;
  available: boolean;
  downloading: boolean;
  ready: boolean;
  progress: number;
  error?: string;
  version?: string;
}

const updateStatus: UpdateStatus = {
  checking: false,
  available: false,
  downloading: false,
  ready: false,
  progress: 0,
};

export async function checkForUpdates(): Promise<UpdateStatus> {
  updateStatus.checking = true;
  
  try {
    const info = await Electrobun.Updater.checkForUpdate();
    
    updateStatus.checking = false;
    updateStatus.available = info.updateAvailable;
    updateStatus.ready = info.updateReady;
    updateStatus.version = info.version;
    
    if (info.updateAvailable && !info.updateReady) {
      // Start background download
      downloadUpdate();
    }
    
    return updateStatus;
  } catch (error) {
    updateStatus.checking = false;
    updateStatus.error = error instanceof Error ? error.message : "Unknown error";
    return updateStatus;
  }
}

async function downloadUpdate(): Promise<void> {
  updateStatus.downloading = true;
  updateStatus.progress = 0;
  
  try {
    // Electrobun handles delta updates automatically via bsdiff
    // Full fallback if patch fails
    await Electrobun.Updater.downloadUpdate();
    
    updateStatus.downloading = false;
    updateStatus.ready = true;
    updateStatus.progress = 100;
  } catch (error) {
    updateStatus.downloading = false;
    updateStatus.error = error instanceof Error ? error.message : "Download failed";
  }
}

export async function applyUpdate(): Promise<void> {
  if (!updateStatus.ready) {
    throw new Error("Update not ready");
  }
  
  // This will quit, update, and relaunch
  await Electrobun.Updater.applyUpdate();
}

export function getUpdateStatus(): UpdateStatus {
  return { ...updateStatus };
}

// Get local version info
export async function getLocalInfo() {
  return await Electrobun.Updater.getLocal;
}
```

### 3.2 Update Server Configuration

The update server will use GitHub Releases:

```
Base URL: https://github.com/Alot1z/get-shit-indexed/releases/latest/download

Required files per release:
├── gsi-explorer-macos-arm64.zip
├── gsi-explorer-macos-x64.zip
├── gsi-explorer-win-x64.zip
├── gsi-explorer-linux-x64.zip
├── gsi-explorer-linux-arm64.zip
├── update.json                    # Update metadata
└── version.json                   # Version info
```

**update.json format**:
```json
{
  "version": "0.2.0",
  "channel": "stable",
  "hash": "abc123...",
  "releaseDate": "2026-03-01T00:00:00Z",
  "releaseNotes": "https://github.com/Alot1z/get-shit-indexed/releases/tag/v0.2.0",
  "platforms": {
    "macos-arm64": {
      "url": "gsi-explorer-macos-arm64.zip",
      "size": 14000000,
      "hash": "def456..."
    },
    "macos-x64": {
      "url": "gsi-explorer-macos-x64.zip",
      "size": 14500000,
      "hash": "ghi789..."
    },
    "win-x64": {
      "url": "gsi-explorer-win-x64.zip",
      "size": 15000000,
      "hash": "jkl012..."
    },
    "linux-x64": {
      "url": "gsi-explorer-linux-x64.zip",
      "size": 14200000,
      "hash": "mno345..."
    }
  }
}
```

## 4. Desktop Features

### 4.1 Main Dashboard View

```html
<!-- src/views/main/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GSI Explorer</title>
  <link href="views://shared/styles/tailwind.css" rel="stylesheet">
  <link href="views://main/styles.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-gray-100">
  <!-- Custom Titlebar -->
  <div class="titlebar electrobun-webkit-app-region-drag">
    <div class="window-controls electrobun-webkit-app-region-no-drag">
      <button class="close-btn" id="closeBtn"></button>
      <button class="minimize-btn" id="minimizeBtn"></button>
      <button class="maximize-btn" id="maximizeBtn"></button>
    </div>
    <span class="title">GSI Explorer</span>
    <div class="update-indicator" id="updateIndicator" style="display: none;">
      <button id="updateBtn">Update Available</button>
    </div>
  </div>

  <!-- Main Content -->
  <main class="flex h-screen pt-8">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 p-4">
      <nav class="space-y-2">
        <button class="nav-btn active" data-view="dashboard">Dashboard</button>
        <button class="nav-btn" data-view="phases">Phases</button>
        <button class="nav-btn" data-view="thinking">Thinking Server</button>
        <button class="nav-btn" data-view="search">Code Search</button>
      </nav>
      
      <!-- Quick Stats -->
      <div class="mt-8 p-4 bg-gray-700 rounded-lg">
        <h3 class="text-sm font-semibold mb-2">Project Health</h3>
        <div id="healthIndicator" class="flex items-center gap-2">
          <span class="health-dot"></span>
          <span id="healthStatus">Checking...</span>
        </div>
        <div class="mt-2">
          <span class="text-xs text-gray-400">Progress</span>
          <div class="progress-bar">
            <div id="progressFill" class="progress-fill" style="width: 0%"></div>
          </div>
          <span id="progressText" class="text-xs">0%</span>
        </div>
      </div>
    </aside>

    <!-- Content Area -->
    <section class="flex-1 p-6 overflow-auto">
      <!-- Dashboard View -->
      <div id="dashboardView" class="view active">
        <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div class="stat-card">
            <span class="stat-value" id="phasesComplete">0</span>
            <span class="stat-label">Phases Complete</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" id="tasksComplete">0</span>
            <span class="stat-label">Tasks Complete</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" id="currentPhase">-</span>
            <span class="stat-label">Current Phase</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" id="healthScore">-</span>
            <span class="stat-label">Health Score</span>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
          <div id="activityList" class="space-y-2">
            <!-- Activity items populated by JS -->
          </div>
        </div>
      </div>

      <!-- Phases View -->
      <div id="phasesView" class="view">
        <h1 class="text-2xl font-bold mb-6">Phases</h1>
        <div id="phaseList" class="space-y-4">
          <!-- Phase cards populated by JS -->
        </div>
      </div>

      <!-- Thinking Server View -->
      <div id="thinkingView" class="view">
        <h1 class="text-2xl font-bold mb-6">Thinking Server</h1>
        
        <!-- Mode Selector -->
        <div class="flex gap-4 mb-6">
          <button class="thinking-mode-btn active" data-mode="sequential">Sequential</button>
          <button class="thinking-mode-btn" data-mode="tractatus">Tractatus</button>
          <button class="thinking-mode-btn" data-mode="debug">Debug</button>
        </div>
        
        <!-- Query Input -->
        <div class="card mb-4">
          <textarea id="thinkingQuery" class="w-full p-4 bg-gray-700 rounded-lg" 
                    rows="3" placeholder="Enter your query..."></textarea>
          <button id="startThinkingBtn" class="btn-primary mt-2">Start Thinking</button>
        </div>
        
        <!-- Results -->
        <div id="thinkingResults" class="card">
          <pre id="thinkingOutput" class="whitespace-pre-wrap"></pre>
        </div>
      </div>

      <!-- Code Search View -->
      <div id="searchView" class="view">
        <h1 class="text-2xl font-bold mb-6">Code Search</h1>
        
        <div class="card mb-4">
          <input type="text" id="searchPattern" class="w-full p-4 bg-gray-700 rounded-lg"
                 placeholder="Search pattern...">
          <div class="flex gap-2 mt-2">
            <input type="text" id="filePattern" class="flex-1 p-2 bg-gray-700 rounded"
                   placeholder="File pattern (e.g., *.ts)">
            <button id="searchBtn" class="btn-primary">Search</button>
          </div>
        </div>
        
        <div id="searchResults" class="card">
          <!-- Search results populated by JS -->
        </div>
      </div>
    </section>
  </main>

  <script src="views://main/index.js"></script>
</body>
</html>
```

### 4.2 View JavaScript

```typescript
// src/views/main/index.ts
import { Electrobun } from "electrobun/views";

// Get RPC client for communicating with main process
const rpc = Electrobun.rpc;

// Window controls
document.getElementById("closeBtn")?.addEventListener("click", () => {
  rpc.messages.closeWindow({});
});

document.getElementById("minimizeBtn")?.addEventListener("click", () => {
  rpc.messages.minimizeWindow({});
});

document.getElementById("maximizeBtn")?.addEventListener("click", () => {
  rpc.messages.maximizeWindow({});
});

// Navigation
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.getAttribute("data-view");
    showView(view!);
  });
});

function showView(viewName: string) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  
  document.getElementById(`${viewName}View`)?.classList.add("active");
  document.querySelector(`.nav-btn[data-view="${viewName}"]`)?.classList.add("active");
}

// Dashboard initialization
async function initDashboard() {
  try {
    const [roadmap, state] = await Promise.all([
      rpc.requests.getRoadmap({}),
      rpc.requests.getState({}),
    ]);
    
    // Update stats
    const completePhases = roadmap.phases.filter(p => p.status === "complete").length;
    document.getElementById("phasesComplete")!.textContent = String(completePhases);
    
    const allTasks = roadmap.phases.flatMap(p => p.plans.flatMap(pl => pl.tasks));
    const completeTasks = allTasks.filter(t => t.status === "complete").length;
    document.getElementById("tasksComplete")!.textContent = String(completeTasks);
    
    document.getElementById("currentPhase")!.textContent = state.currentPhase;
    document.getElementById("healthScore")!.textContent = state.health.toUpperCase();
    
    // Update progress
    const progressFill = document.getElementById("progressFill")!;
    progressFill.style.width = `${roadmap.progress.percentage}%`;
    document.getElementById("progressText")!.textContent = `${roadmap.progress.percentage}%`;
    
    // Update health indicator
    const healthDot = document.querySelector(".health-dot")!;
    healthDot.className = `health-dot health-${state.health}`;
    document.getElementById("healthStatus")!.textContent = state.health;
    
    // Render phase cards
    renderPhaseCards(roadmap.phases);
    
  } catch (error) {
    console.error("Failed to initialize dashboard:", error);
  }
}

function renderPhaseCards(phases: any[]) {
  const container = document.getElementById("phaseList")!;
  container.innerHTML = phases.map(phase => `
    <div class="phase-card ${phase.status}">
      <div class="phase-header">
        <h3 class="phase-name">${phase.name}</h3>
        <span class="phase-status">${phase.status}</span>
      </div>
      <div class="phase-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${phase.progress}%"></div>
        </div>
        <span class="progress-text">${phase.progress}%</span>
      </div>
      <div class="phase-plans">
        ${phase.plans.length} plans, ${phase.plans.reduce((acc: number, p: any) => acc + p.tasks.length, 0)} tasks
      </div>
      <div class="phase-actions">
        <button class="btn-secondary" onclick="viewPhaseDetails('${phase.id}')">View Details</button>
        ${phase.status === "planned" ? `<button class="btn-primary" onclick="executePhase('${phase.id}')">Execute</button>` : ""}
      </div>
    </div>
  `).join("");
}

// Thinking server
let currentThinkingMode: "sequential" | "tractatus" | "debug" = "sequential";

document.querySelectorAll(".thinking-mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".thinking-mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentThinkingMode = btn.getAttribute("data-mode") as typeof currentThinkingMode;
  });
});

document.getElementById("startThinkingBtn")?.addEventListener("click", async () => {
  const query = (document.getElementById("thinkingQuery") as HTMLTextAreaElement).value;
  if (!query.trim()) return;
  
  const output = document.getElementById("thinkingOutput")!;
  output.textContent = "Starting thinking session...";
  
  try {
    const result = await rpc.requests.startThinking({
      mode: currentThinkingMode,
      query,
    });
    
    output.textContent = `Session started: ${result.sessionId}\n\nThinking in progress...`;
    
    // Poll for status
    const pollInterval = setInterval(async () => {
      const status = await rpc.requests.getThinkingStatus({});
      if (!status.active) {
        clearInterval(pollInterval);
        output.textContent += "\n\nThinking complete.";
      } else if (status.progress !== undefined) {
        output.textContent = `Progress: ${status.progress}%`;
      }
    }, 1000);
    
  } catch (error) {
    output.textContent = `Error: ${error}`;
  }
});

// Code search
document.getElementById("searchBtn")?.addEventListener("click", async () => {
  const pattern = (document.getElementById("searchPattern") as HTMLInputElement).value;
  const filePattern = (document.getElementById("filePattern") as HTMLInputElement).value;
  
  if (!pattern.trim()) return;
  
  const resultsContainer = document.getElementById("searchResults")!;
  resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
  
  try {
    const result = await rpc.requests.searchCode({
      pattern,
      options: {
        filePattern: filePattern || undefined,
        maxResults: 100,
      },
    });
    
    if (result.results.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
      return;
    }
    
    resultsContainer.innerHTML = result.results.map(r => `
      <div class="search-result">
        <div class="result-file">${r.file}:${r.line}</div>
        <pre class="result-content">${escapeHtml(r.content)}</pre>
      </div>
    `).join("");
    
  } catch (error) {
    resultsContainer.innerHTML = `<div class="error">Search error: ${error}</div>`;
  }
});

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Initialize
initDashboard();

// Handle menu actions from main process
rpc.messages.handleMenuAction = ({ action }) => {
  switch (action) {
    case "view-dashboard":
      showView("dashboard");
      break;
    case "view-phases":
      showView("phases");
      break;
    case "view-thinking":
      showView("thinking");
      break;
    case "refresh-roadmap":
      initDashboard();
      break;
  }
};

// Update notifications
rpc.messages.showNotification = ({ title, message }) => {
  // Show native notification
  new Notification(title, { body: message });
};
```

## 5. Distribution & Bundling

### 5.1 Bundle Size Estimation

| Component | Estimated Size |
|-----------|----------------|
| Electrobun Runtime | ~3MB |
| CEF (Chromium) | ~8MB |
| Application Code | ~1MB |
| React + Dependencies | ~1MB |
| Assets (icons, etc.) | ~500KB |
| **Total** | **~13.5MB** |

**Target**: 14MB per platform

### 5.2 Delta Update Strategy

Electrobun uses bsdiff for delta updates:

1. **Patch Size**: ~2-5MB for typical updates
2. **Full Fallback**: If patch fails, downloads full bundle
3. **Hash Verification**: SHA-256 hash validation
4. **Atomic Updates**: Updates are atomic (all-or-nothing)

**Update Flow**:
```
checkForUpdate()
    ↓
updateAvailable?
    ↓ YES
downloadUpdate() → Delta patch via bsdiff
    ↓
Patch fails?
    ↓ YES           ↓ NO
Full download    Apply patch
    ↓                 ↓
    └─────→ updateReady
              ↓
        applyUpdate() → Quit → Replace → Relaunch
```

### 5.3 Platform Targets

| Platform | Architecture | Target String |
|----------|--------------|---------------|
| macOS | ARM64 (M1/M2/M3) | `macos-arm64` |
| macOS | Intel x64 | `macos-x64` |
| Windows | x64 | `win-x64` |
| Linux | x64 | `linux-x64` |
| Linux | ARM64 | `linux-arm64` |

**Build Command**:
```bash
bunx electrobun build --env=stable --targets=macos-arm64,macos-x64,win-x64,linux-x64
```

### 5.4 CI/CD Pipeline

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
            target: macos-arm64
          - os: macos-latest
            target: macos-x64
          - os: windows-latest
            target: win-x64
          - os: ubuntu-latest
            target: linux-x64
    
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Build
        run: bunx electrobun build --env=stable --targets=${{ matrix.target }}
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: gsi-explorer-${{ matrix.target }}
          path: dist/

  release:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: artifacts/
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: artifacts/**
          generate_release_notes: true
```

## 6. Integration Points

### 6.1 CLI Distribution via npm

The `gsi-tools` CLI remains the primary npm package:

```json
{
  "name": "gsi-tools",
  "version": "0.1.0",
  "bin": {
    "gsi-tools": "./dist/cli.js"
  },
  "optionalDependencies": {
    "gsi-explorer": "^0.1.0"
  }
}
```

Users can install:
- `npm install -g gsi-tools` - CLI only
- `npm install -g gsi-explorer` - Desktop app only
- `npm install -g gsi-tools gsi-explorer` - Both

### 6.2 Shared Codebase

```
gsi-monorepo/
├── packages/
│   ├── core/              # Shared business logic
│   │   ├── src/
│   │   │   ├── phases/
│   │   │   ├── roadmap/
│   │   │   ├── thinking/
│   │   │   └── index.ts
│   │   └── package.json
│   ├── cli/               # gsi-tools CLI
│   │   ├── src/
│   │   │   └── cli.ts
│   │   └── package.json
│   └── desktop/           # gsi-explorer
│       ├── src/
│       ├── package.json
│       └── electrobun.config.ts
└── package.json           # Workspace root
```

### 6.3 API Bridge

Both CLI and Desktop use the same core API:

```typescript
// packages/core/src/index.ts
export class GsiCore {
  async listPhases(): Promise<Phase[]> { /* ... */ }
  async getRoadmap(): Promise<Roadmap> { /* ... */ }
  async executePhase(id: string): Promise<Result> { /* ... */ }
  async searchCode(pattern: string): Promise<SearchResult[]> { /* ... */ }
}

// CLI uses it directly
const core = new GsiCore();
console.log(await core.listPhases());

// Desktop uses it via RPC
// Main process creates GsiCore instance
// Views call RPC methods that delegate to GsiCore
```

## 7. Tasks

### Wave 1: Project Setup (Tasks 1-6)

- [ ] **Task 1**: Initialize Electrobun project
  - Run `bunx electrobun init gsi-explorer`
  - Add React, Tailwind, TypeScript dependencies
  - Configure tsconfig.json with paths

- [ ] **Task 2**: Create project structure
  - Create src/bun/, src/views/, src/shared/ directories
  - Set up icon.iconset/ with all required sizes
  - Create base HTML templates

- [ ] **Task 3**: Configure Electrobun
  - Create electrobun.config.ts with all settings
  - Configure CEF bundling for all platforms
  - Set up release baseUrl

- [ ] **Task 4**: Implement shared types
  - Create src/shared/types.ts with RPC schema
  - Define Phase, Roadmap, State interfaces
  - Export for both bun and webview

- [ ] **Task 5**: Create custom titlebar
  - Implement HTML structure with drag regions
  - Add CSS styling (Tokyo Night theme)
  - Connect window control buttons

- [ ] **Task 6**: Set up Tailwind CSS
  - Configure tailwind.config.js
  - Create shared styles
  - Add custom utility classes

### Wave 2: Core Integration (Tasks 7-12)

- [ ] **Task 7**: Implement GSI integration layer
  - Create src/bun/gsi-integration.ts
  - Implement listPhases(), getRoadmap(), getState()
  - Connect to gsi-tools CLI via Bun shell

- [ ] **Task 8**: Implement RPC handlers
  - Define all request handlers in main.ts
  - Implement bidirectional messaging
  - Add error handling

- [ ] **Task 9**: Create application menu
  - Define menu structure
  - Implement menu event handling
  - Add keyboard accelerators

- [ ] **Task 10**: Create system tray
  - Implement tray icon with menu
  - Add status indicators
  - Handle tray events

- [ ] **Task 11**: Build dashboard view
  - Create dashboard HTML structure
  - Implement stats cards
  - Add activity list

- [ ] **Task 12**: Build phases view
  - Create phase card components
  - Implement phase details modal
  - Add execute button functionality

### Wave 3: Advanced Features (Tasks 13-18)

- [ ] **Task 13**: Implement thinking server view
  - Create mode selector (sequential/tractatus/debug)
  - Add query input
  - Display thinking results

- [ ] **Task 14**: Implement code search view
  - Create search input with file pattern
  - Display search results
  - Add syntax highlighting

- [ ] **Task 15**: Implement auto-update
  - Create updater.ts module
  - Implement check/download/apply flow
  - Add update indicator in UI

- [ ] **Task 16**: Create CI/CD pipeline
  - Create GitHub Actions workflow
  - Configure multi-platform builds
  - Set up release automation

- [ ] **Task 17**: Create update server assets
  - Generate update.json format
  - Configure GitHub Releases URL
  - Test delta patch generation

- [ ] **Task 18**: Integration testing
  - Test all RPC endpoints
  - Verify update mechanism
  - Test on all platforms

### Wave 4: Distribution (Tasks 19-24)

- [ ] **Task 19**: Create monorepo structure
  - Set up packages/core, packages/cli, packages/desktop
  - Configure workspace dependencies
  - Update import paths

- [ ] **Task 20**: Optimize bundle size
  - Analyze bundle with size limits
  - Remove unused dependencies
  - Target 14MB per platform

- [ ] **Task 21**: Create platform builds
  - Build for macOS (arm64, x64)
  - Build for Windows (x64)
  - Build for Linux (x64, arm64)

- [ ] **Task 22**: Create release notes
  - Document features
  - List known issues
  - Add installation instructions

- [ ] **Task 23**: Publish to GitHub Releases
  - Upload all platform builds
  - Create update.json
  - Tag release version

- [ ] **Task 24**: Update npm package
  - Add gsi-explorer as optional dependency
  - Update README with desktop app info
  - Publish to npm

## Success Criteria

1. gsi-explorer runs on all 5 platform targets
2. Bundle size is under 14MB per platform
3. All GSI commands accessible from desktop UI
4. Thinking server dashboard fully functional
5. Auto-update works with delta patches (~5MB)
6. Phase explorer shows roadmap progress
7. Code search integrates with Code-Index MCP
8. CLI and desktop share core business logic
9. System tray shows quick status
10. Custom titlebar matches GSI branding

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Electrobun API changes | Pin version, test before upgrade |
| CEF compatibility issues | Bundle CEF, test on all platforms |
| Update server downtime | Use GitHub Releases (high availability) |
| Bundle size exceeds target | Tree-shaking, lazy loading |
| Platform-specific bugs | Extensive CI/CD testing matrix |

## Dependencies

- Electrobun ^0.0.1
- Bun runtime (latest)
- React ^18.2.0
- Tailwind CSS ^3.4.0
- TypeScript ^5.0.0

## Timeline

| Wave | Duration | Tasks |
|------|----------|-------|
| Wave 1 | 1 week | 1-6 (Setup) |
| Wave 2 | 1 week | 7-12 (Integration) |
| Wave 3 | 1 week | 13-18 (Features) |
| Wave 4 | 1 week | 19-24 (Distribution) |
| **Total** | **4 weeks** | **24 tasks** |

## Files to Create

```
gsi-explorer/
├── src/
│   ├── bun/
│   │   ├── index.ts
│   │   ├── gsi-integration.ts
│   │   ├── menu.ts
│   │   ├── tray.ts
│   │   └── updater.ts
│   ├── views/
│   │   ├── main/
│   │   │   ├── index.html
│   │   │   ├── index.ts
│   │   │   └── styles.css
│   │   ├── phases/
│   │   │   ├── index.html
│   │   │   ├── index.ts
│   │   │   └── styles.css
│   │   ├── thinking/
│   │   │   ├── index.html
│   │   │   ├── index.ts
│   │   │   └── styles.css
│   │   └── shared/
│   │       ├── styles/
│   │       └── components/
│   └── shared/
│       └── types.ts
├── icon.iconset/
│   ├── icon_16x16.png
│   ├── icon_16x16@2x.png
│   ├── icon_32x32.png
│   ├── icon_32x32@2x.png
│   ├── icon_128x128.png
│   ├── icon_128x128@2x.png
│   ├── icon_256x256.png
│   ├── icon_256x256@2x.png
│   ├── icon_512x512.png
│   └── icon_512x512@2x.png
├── .github/
│   └── workflows/
│       └── release.yml
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── electrobun.config.ts
└── README.md
```

---

**Created**: 2026-02-19
**Author**: GSI Planning System
**Phase**: 49-06 (Electrobun Desktop Packaging)
