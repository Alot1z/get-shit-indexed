// tests/distribution/electrobun.test.ts
// Phase 50E: Distribution Layer - Electrobun Tests (TDD RED Phase)
import { describe, it, expect, beforeEach } from 'bun:test';
import { ElectrobunProject, ElectrobunConfig, CommandExecutor, ComponentRegistry } from '../../lib/distribution/electrobun';

describe('ElectrobunProject', () => {
  let project: ElectrobunProject;

  describe('project structure', () => {
    it('should initialize with correct directory structure', () => {
      project = new ElectrobunProject('./gsi-desktop');
      
      expect(project.hasDirectory('src/bun')).toBe(true);
      expect(project.hasDirectory('src/views')).toBe(true);
      expect(project.hasDirectory('src/components')).toBe(true);
      expect(project.hasFile('electrobun.config.ts')).toBe(true);
    });

    it('should have required configuration files', () => {
      project = new ElectrobunProject('./gsi-desktop');
      
      expect(project.hasFile('package.json')).toBe(true);
      expect(project.hasFile('tsconfig.json')).toBe(true);
      expect(project.hasFile('vite.config.ts')).toBe(true);
      expect(project.hasFile('tailwind.config.js')).toBe(true);
    });
  });

  describe('configuration', () => {
    beforeEach(() => {
      project = new ElectrobunProject('./gsi-desktop');
    });

    it('should load electrobun config with all platforms', () => {
      const config = project.loadConfig();
      
      expect(config.platforms).toContain('macos-arm64');
      expect(config.platforms).toContain('macos-x64');
      expect(config.platforms).toContain('windows-x64');
      expect(config.platforms).toContain('linux-x64');
      expect(config.platforms).toContain('linux-arm64');
    });

    it('should have correct binary name', () => {
      const config = project.loadConfig();
      
      expect(config.binaryName).toBe('gsi-desktop');
    });

    it('should configure app bundle settings', () => {
      const config = project.loadConfig();
      
      expect(config.bundle.appName).toBe('GSI Desktop');
      expect(config.bundle.appId).toBe('com.gsi.desktop');
      expect(config.bundle.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should set target binary size under 15MB', () => {
      const config = project.loadConfig();
      
      expect(config.build.maxBinarySizeMB).toBeLessThanOrEqual(15);
    });
  });

  describe('GSI integration', () => {
    beforeEach(() => {
      project = new ElectrobunProject('./gsi-desktop');
    });

    it('should create GSI command executor', () => {
      const executor = project.createCommandExecutor();
      
      expect(executor).toBeDefined();
      expect(executor.getAvailableCommands()).toContain('gsi');
    });

    it('should execute GSI commands and return output', async () => {
      const executor = project.createCommandExecutor();
      
      const result = await executor.execute('gsi --version');
      
      expect(result.success).toBe(true);
      expect(result.stdout).toMatch(/\d+\.\d+\.\d+/);
    });

    it('should handle command errors gracefully', async () => {
      const executor = project.createCommandExecutor();
      
      const result = await executor.execute('gsi invalid-command-xyz');
      
      expect(result.success).toBe(false);
      expect(result.stderr).toBeDefined();
    });

    it('should support command timeout', async () => {
      const executor = project.createCommandExecutor({ timeout: 5000 });
      
      const result = await executor.execute('gsi --help');
      
      expect(result.timedOut).toBe(false);
    });
  });

  describe('UI components', () => {
    beforeEach(() => {
      project = new ElectrobunProject('./gsi-desktop');
    });

    it('should register Dashboard component', () => {
      const registry = project.getComponentRegistry();
      
      expect(registry.has('Dashboard')).toBe(true);
      expect(registry.get('Dashboard')?.route).toBe('/');
    });

    it('should register PhaseExplorer component', () => {
      const registry = project.getComponentRegistry();
      
      expect(registry.has('PhaseExplorer')).toBe(true);
      expect(registry.get('PhaseExplorer')?.route).toBe('/phases');
    });

    it('should register CodeSearch component', () => {
      const registry = project.getComponentRegistry();
      
      expect(registry.has('CodeSearch')).toBe(true);
      expect(registry.get('CodeSearch')?.route).toBe('/search');
    });

    it('should register Settings component', () => {
      const registry = project.getComponentRegistry();
      
      expect(registry.has('Settings')).toBe(true);
      expect(registry.get('Settings')?.route).toBe('/settings');
    });

    it('should validate component structure', () => {
      const registry = project.getComponentRegistry();
      
      for (const [name, component] of registry) {
        expect(component.route).toBeDefined();
        expect(component.icon).toBeDefined();
        expect(component.label).toBeDefined();
      }
    });
  });

  describe('build pipeline', () => {
    beforeEach(() => {
      project = new ElectrobunProject('./gsi-desktop');
    });

    it('should configure build for all platforms', () => {
      const pipeline = project.getBuildPipeline();
      
      expect(pipeline.targets).toHaveLength(5);
      expect(pipeline.targets.map(t => t.platform)).toEqual([
        'macos-arm64',
        'macos-x64',
        'windows-x64',
        'linux-x64',
        'linux-arm64'
      ]);
    });

    it('should set correct output directory', () => {
      const pipeline = project.getBuildPipeline();
      
      expect(pipeline.outputDir).toBe('./dist');
    });

    it('should configure code signing for macOS', () => {
      const pipeline = project.getBuildPipeline();
      const macosTarget = pipeline.targets.find(t => t.platform === 'macos-arm64');
      
      expect(macosTarget?.signing).toBeDefined();
      expect(macosTarget?.signing?.enabled).toBeDefined();
    });

    it('should configure binary optimization', () => {
      const pipeline = project.getBuildPipeline();
      
      expect(pipeline.optimization.minify).toBe(true);
      expect(pipeline.optimization.treeShaking).toBe(true);
      expect(pipeline.optimization.compression).toBe('brotli');
    });
  });
});
