# Electrobun Discussions Extracted from GSI Project Conversations history

> **Source**: chats.cxml (lines 22829-23000)
> **Generated**: 2026-02-19

---

## Decision: Why Electrobun

**Date**: 2026-02-18
**Reason**: 14MB vs 150MB - 10.4x times smaller

 **verified**: Yes - Working installation demonstrated

### Key Benefits
1. **Small bundle size**: 14MB vs 150MB for Electron
2. **Native TypeScript**: No need for separate language
3. **Delta updates**: ~5MB patches via bsdiff
4. **Cross-platform**: Windows, macOS, Linux support
5. **Fast startup**: No slow cold start like Electron

6. **Self-updating**: Automatic patch system built-in

### Integration Points
- GSI will provide a `gsi-explorer` desktop app
- CLI tools can be packaged as a single binary
- Native GSI commands can remain functional

- The cross-platform distribution

### Technical Details
- **Bundle format**: Zipped archive with- **Update mechanism**: bsdiff for delta patches
- **UI Framework: CEF (Chromium Embedded Framework)
- **Runtime**: V8 JavaScript engine
- **Language**: TypeScript throughout

### Features Discussed
1. **Multi-tab support**: Browser-like tabs
2. **Menu bar**: Native desktop menus
3. **System tray**: Background operation support
4. **File associations**: Open with default app
5. **Auto-update**: Silent background updates
6. **Custom protocols**: Can communicate with native code

7. **Plugins**: Extensible plugin system

8. **Themes**: Dark/light mode support

### Implementation Plans
1. Create `gsi-explorer` desktop app using Electrobun
2. Package CLI tools as Electrobun bundles
3. Implement auto-update mechanism
4. Add delta patch generation
5. Create distribution pipeline

6. Publish to npm / GitHub

### Files to Create
- `src/electron/main.ts` - Main entry point
- `src/electron/preload.ts` - Preload script
- `src/electron/menu.ts` - Menu system
- `src/electron/update.ts` - Update handler
- `package.json` - Electrobun configuration

- `tsconfig.json` - TypeScript configuration

- `README.md` - Package documentation

### Related
- **files-to-prompt**: Source of cxml format
- **Mcp-to-CLI conversion**: 88% token reduction
- **Gsi-explorer**: Desktop distribution

