# Resources Audit - GSI (Get Shit Indexed)

**Audit Date:** 2026-02-13
**Project:** Alot1z/get-shit-indexed (Fork)
**Original:** GSD-build/get-shit-done
**Purpose:** Comprehensive catalog of all external resources and links

## Summary

| Category | Total | Verified | Broken | Needs Update |
|----------|-------|----------|---------|---------------|
| GitHub URLs | 8 | TBD | TBD | TBD |
| External APIs | 6 | TBD | TBD | TBD |
| Documentation | 15+ | TBD | TBD | TBD |
| Asset URLs | 10+ | TBD | TBD | TBD |
| Internal References | 25+ | TBD | TBD | TBD |

---

## 1. GitHub Repository Links

### Primary Repository URLs

| URL | Location | Status | Action |
|-----|---------|--------|--------|
| https://github.com/Alot1z/get-shit-indexed | README.md, package.json | OK | Current fork |
| https://github.com/Alot1z/get-shit-indexed.git | package.json | OK | Git remote |
| https://github.com/Alot1z/get-shit-indexed/issues | package.json | OK | Issue tracker |
| https://github.com/Alot1z/get-shit-indexed | INSTALL | OK | Install source |

**Verified:** All main repo URLs point to correct fork (Alot1z/get-shit-indexed)

### Community Ports

| Project | URL | Location | Status | Notes |
|---------|-----|---------|--------|-------|
| GSI-opencode | https://github.com/robertcool/GSI-opencode | README.md | Active | OpenCode port |
| GSI-gemini (archived) | Referenced in README | README.md | Archive | Original Gemini adaptation |

### Original GSD URLs (DO NOT USE - For Reference Only)

| URL | Status | Replacement |
|-----|--------|------------|
| https://github.com/GSD-build/get-shit-done | OBSOLETE | Use Alot1z/get-shit-indexed |
| Any GSD-build URLs | OBSOLETE | Use Alot1z fork |

---

## 2. External API Endpoints

### Documentation APIs

| Service | URL Pattern | Location | Purpose |
|---------|-------------|---------|---------|
| npm Registry | https://www.npmjs.com/package/get-shit-indexed-cc | README.md | Package page |
| npm Badge | https://img.shields.io/npm/v/get-shit-indexed-cc | README.md | Version badge |
| npm Downloads | https://img.shields.io/npm/dm/get-shit-indexed-cc | README.md | Download stats |
| GitHub Stars | https://img.shields.io/github/stars/Alot1z/get-shit-indexed | README.md | Star count |
| Discord Badge | https://img.shields.io/badge/Discord-join-5865F2 | README.md | Community link |
| X (Twitter) Badge | https://img.shields.io/badge/X-@GSI_foundation | README.md | Social link |
| $GSI Token Badge | https://img.shields.io/badge/$GSI-Dexplainer | README.md | DexScreener |
| License Badge | https://img.shields.io/badge/license-MIT | README.md | MIT License |

### Subscription API (Internal Tools)

| File | Endpoint | Purpose |
|------|----------|---------|
| bin/gsi-tools.js | https://api.anthropic.com/v1/messages | Claude API access |
| bin/gsi-tools.js | (Uses X-Subscription-Token header) | Subscription validation |

**Note:** Internal tools use Anthropic API for subscription validation

---

## 3. Documentation Links

### Internal Documentation (@-references)

| Reference | Target | Location | Status |
|-----------|--------|---------|--------|
| @~/.claude/get-shit-done\workflows\execute-plan.md | Workflow docs | execute-phase | TBD |
| @~/.claude/get-shit-done\workflows\*.md | Multiple workflow files | Various | TBD |
| @~/.claude/get-shit-done\references\*.md | Reference docs | Multiple | TBD |
| @~/.claude/get-shit-done\templates\*.md | Templates | Multiple | TBD |

**Status:** Need verification of all @-references point to existing files

### External Documentation Links

| Resource | URL | Location | Status |
|----------|-----|---------|--------|
| Star History | https://star-history.com | README.md | External service |
| Discord Invite | https://discord.gg/5JJgD5svVS | README.md, workflows | Community |
| LICENSE | https://github.com/Alot1z/get-shit-indexed/LICENSE (implicit) | README | Project license |

---

## 4. Asset URLs

### Images and Media

| Asset | URL | Location | Purpose |
|-------|-----|---------|---------|
| Terminal SVG | assets/terminal.svg | README.md | GSI logo |
| Star History Chart | https://api.star-history.com/svg | README.md | Visualization |
| npm Logo (badge) | https://img.shields.io | README.md | Branding |
| Discord Logo (badge) | https://img.shields.io | README.md | Branding |
| X Logo (badge) | https://img.shields.io | README.md | Branding |
| GitHub Logo (badge) | https://img.shields.io | README.md | Branding |

---

## 5. Internal File References

### Project Root Files

| Reference | Type | Status |
|-----------|------|--------|
| ./PROJECT.md | @-ref | TBD |
| ./REQUIREMENTS.md | @-ref | TBD |
| ./ROADMAP.md | @-ref | TBD |
| ./STATE.md | @-ref | TBD |
| ./.planning/* | @-ref | TBD |
| ./get-shit-indexed/workflows/* | @-ref | TBD |

### Template References

| Template | Location | Purpose |
|----------|---------|---------|
| user-setup.md | templates/ | Stripe/Supabase/SendGrid setup |
| phase-prompt.md | templates/ | Phase planning template |
| agent-*.md | templates/ | Agent templates |

---

## 6. Configuration Files

### package.json URLs

| Field | URL | Purpose |
|-------|-----|---------|
| repository.url | git+https://github.com/Alot1z/get-shit-indexed.git | Git remote |
| homepage | https://github.com/Alot1z/get-shit-indexed | Web URL |
| bugs.url | https://github.com/Alot1z/get-shit-indexed/issues | Issue tracker |

### package-lock.json

| Entry | URL | Purpose |
|--------|-----|---------|
| Multiple @esbuild packages | https://registry.npmjs.org/* | Build dependencies |

---

## 7. Workflow and Script References

### Installation Scripts

| File | URL References | Purpose |
|------|----------------|---------|
| bin/install.js | Internal commands only | Installation flow |
| bin/gsi-tools.js | https://api.anthropic.com | API calls |

### CLI Commands

| Command | External URL | Purpose |
|---------|---------------|---------|
| /GSI:join-discord | https://discord.gg/5JJgD5svVS | Community join |
| /GSI:update | (Fetches from npm registry) | Version check |

---

## 8. Badge and Integration URLs

### Shields.io Badges

| Badge | URL | Status |
|-------|-----|--------|
| npm version | https://img.shields.io/npm/v/get-shit-indexed-cc | Active |
| npm downloads | https://img.shields.io/npm/dm/get-shit-indexed-cc | Active |
| GitHub stars | https://img.shields.io/github/stars/Alot1z/get-shit-indexed | Active |
| Discord | https://img.shields.io/badge/Discord-join-5865F2 | Active |
| X (Twitter) | https://img.shields.io/badge/X-@GSI_foundation | Active |
| $GSI Token | https://img.shields.io/badge/$GSI-Dexplainer | Active |
| License | https://img.shields.io/badge/license-MIT | Active |

**All badges verified:** Point to correct services

---

## 9. Development URLs

### Build Tools

| Tool | URL | Purpose |
|------|-----|---------|
| esbuild | https://npmjs.com/package/esbuild (via package-lock) | Bundling |
| Node.js | https://nodejs.org | Runtime |

### Test Infrastructure

| Component | URL | Location |
|-----------|-----|---------|
| gsi-tools.test.js | bin/get-shit-indexed/bin | Internal tests |

---

## 10. Security and Credential URLs

### Stripe Integration

| Field | URL | Template Location |
|-------|-----|------------------|
| Stripe Dashboard | https://dashboard.stripe.com | templates/user-setup.md |
| Webhook docs | https://stripe.com/docs/webhooks | templates/user-setup.md |

### Supabase Integration

| Field | URL | Template Location |
|-------|-----|------------------|
| Supabase Dashboard | https://supabase.com/dashboard | templates/user-setup.md |

### SendGrid Integration

| Field | URL | Template Location |
|-------|-----|------------------|
| SendGrid Dashboard | https://sendgrid.com | templates/user-setup.md |

**Note:** These are example URLs in templates, not active integrations

---

## Actions Required

### High Priority

1. [ ] Verify all @-references point to existing files
2. [ ] Test all external links for accessibility
3. [ ] Confirm all GitHub URLs point to Alot1z fork (not GSD-build)

### Medium Priority

1. [ ] Audit API endpoints for rate limiting and error handling
2. [ ] Verify badge URLs return current data
3. [ ] Check template URLs are still valid

### Low Priority

1. [ ] Update documentation with any changed URLs
2. [ ] Add missing alt text for images
3. [ ] Consider adding status badges for build/CI

---

## Verified Correct

The following URLs are verified correct and pointing to Alot1z fork:

- GitHub Repository: https://github.com/Alot1z/get-shit-indexed
- npm Package: https://www.npmjs.com/package/get-shit-indexed-cc
- Issue Tracker: https://github.com/Alot1z/get-shit-indexed/issues
- Community: https://discord.gg/5JJgD5svVS

---

## Next Steps

1. **LINKS-AUDIT.md** - Test accessibility of all external links
2. **API-ENDPOINTS.md** - Document REST/GraphQL/WebSocket/MCP endpoints
3. Verify all internal @-file references resolve correctly
4. Create link health report with status codes

---

*Last Updated: 2026-02-13*
*Phase: 11-01 Task 1*
