# IMPROVEMENT-03: Add join-discord Command

## Priority
**MEDIUM** - Add command to join GSI community Discord

## Overview
Create a `/gsi:join-discord` command that opens the GSI Discord server for community support, collaboration, and discussions.

## Research Required

### Domain Research
1. **Discord Integration Patterns**
   - Study how other CLIs handle Discord invites
   - Research Discord invite link best practices
   - Analyze community onboarding flows

2. **Cross-Platform URL Opening**
   - Research opening URLs across platforms
   - Study fallback strategies when browser unavailable
   - Investigate terminal URL handling

### Technical Research
1. **URL Opening Libraries**
   - Compare: open, xopen, opn
   - Evaluate cross-platform support
   - Test error handling

2. **Command Design**
   - Study simple command patterns in GSI
   - Research command output formatting
   - Investigate help text patterns

## Implementation Tasks

### Sub-task 1: Command Implementation
- [ ] Create commands/gsi:join-discord.js
  ```javascript
  module.exports = {
    name: 'gsi:join-discord',
    description: 'Join the GSI Discord community',
    execute: async () => {
      const { open } = await import('open');
      const inviteUrl = 'https://discord.gg/gsi-community';
      
      console.log('Opening GSI Discord...');
      await open(inviteUrl);
      
      console.log(`
╔══════════════════════════════════════════╗
║   Welcome to the GSI Community! 🔮      ║
╠══════════════════════════════════════════╣
║                                          ║
║  Channels:                               ║
║  • #general - Chat and discussions       ║
║  • #help - Get assistance                ║
║  • #features - Request features          ║
║  • #bugs - Report issues                 ║
║                                          ║
║  See you there! 🚀                       ║
╚══════════════════════════════════════════╝
      `);
    }
  };
  ```
  
- [ ] Add error handling
  - Handle open() failures
  - Provide manual URL as fallback
  - Graceful degradation

### Sub-task 2: Integration
- [ ] Register command in CLI
  - Add to commands/index.js
  - Update gsi:help output
  - Add to command listing
  
- [ ] Create invite URL config
  - Store in configuration
  - Allow custom invite URLs
  - Document configuration

### Sub-task 3: Community Links
- [ ] Add Discord link to README
  ```markdown
  ## Community
  
  Join the [GSI Discord](https://discord.gg/gsi-community) to:
  - Get help from other users
  - Share your projects
  - Request features
  - Report bugs
  ```
  
- [ ] Add to package.json
  ```json
  {
    "homepage": "https://github.com/user/get-shit-indexed#readme",
    "bugs": "https://github.com/user/get-shit-indexed/issues",
    "discord": "https://discord.gg/gsi-community"
  }
  ```

### Sub-task 4: Testing
- [ ] Test URL opens correctly
  - Test on Windows
  - Test on macOS
  - Test on Linux
  
- [ ] Test error handling
  - Test without browser
  - Test with invalid URL
  - Verify fallback display

## Verification Criteria
- [ ] `/gsi:join-discord` opens Discord invite
- [ ] Works across Windows, macOS, Linux
- [ ] Shows helpful message after opening
- [ ] Handles errors gracefully
- [ ] Listed in `/gsi:help` output

## Files to Create
- commands/gsi:join-discord.js

## Files to Modify
- commands/index.js
- README.md
- package.json

## Success Metrics
- Command works on all major platforms
- User successfully opens Discord >95% of time
- Error handling provides clear fallback
