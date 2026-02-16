# Terminal.svg Rebranding Plan

## Overview
Update terminal.svg to reflect current architecture: DC (DesktopCommander) + CI (CodeIndex) + TS (Three Thinking Servers), removing CG (CodeGraphContext).

## Research Required

### Domain Research
1. **Current Branding Analysis**
   - Review current terminal.svg content
   - Identify all CG references
   - Understand visual hierarchy

2. **Thinking Servers Identity**
   - Determine how to represent 3 thinking servers
   - Options: "TS", "3TS", "STD" (Sequential/Tractatus/Debug)
   - Select clearest representation

### Technical Research
1. **SVG Structure**
   - Understand current SVG structure
   - Identify text elements to modify
   - Review color scheme

## Implementation Tasks

### Sub-task 1: Remove CG References
- [ ] Update line 304 in terminal.svg
  - Current: `<tspan class="white"> MCP tools ready (DC, CI, CG)</tspan>`
  - New: `<tspan class="white"> MCP tools ready (DC, CI + 3TS)</tspan>`
  
- [ ] Update any other CG references
  - Search for "CG" or "CodeGraph"
  - Remove or replace references

### Sub-task 2: Add Thinking Servers Indicator
- [ ] Add "3TS" to represent Three Thinking Servers
  - 3TS = Three Thinking Servers (Sequential, Tractatus, Debug)
  - Alternative: "TS" for Thinking Servers collectively
  - Place after DC, CI in branding
  
- [ ] Create visual representation
  - Option 1: Text only "DC, CI + 3TS"
  - Option 2: Add small icons for each thinking server
  - Option 3: Create a "TS" badge similar to INDEX

### Sub-task 3: Update Install Output
- [ ] Modify install success message
  ```xml
  <!-- Current -->
  <text class="text" font-size="15" y="304">
    <tspan class="green">✓</tspan>
    <tspan class="white"> MCP tools ready (DC, CI, CG)</tspan>
  </text>
  
  <!-- Updated -->
  <text class="text" font-size="15" y="304">
    <tspan class="green">✓</tspan>
    <tspan class="white"> MCP tools ready (DC, CI + 3TS)</tspan>
  </text>
  ```
  
- [ ] Add thinking servers line
  ```xml
  <text class="text" font-size="15" y="328">
    <tspan class="green">✓</tspan>
    <tspan class="white"> 3 Thinking Servers configured</tspan>
  </text>
  ```

### Sub-task 4: Visual Design (Optional Enhancement)
- [ ] Consider adding visual elements for thinking servers
  - Small icons or badges for S, T, D
  - Color-coded indicators
  - Keep design clean and minimal
  
- [ ] Ensure visual consistency
  - Match existing Tokyo Night color scheme
  - Maintain current aesthetic
  - Don't overcrowd the design

## Exact Changes Required

### File: assets/terminal.svg

**Line 304 - Change:**
```xml
<!-- OLD -->
<text class="text" font-size="15" y="304"><tspan class="green">  ✓</tspan><tspan class="white"> MCP tools ready (DC, CI, CG)</tspan></text>

<!-- NEW -->
<text class="text" font-size="15" y="304"><tspan class="green">  ✓</tspan><tspan class="white"> MCP tools ready (DC, CI + 3TS)</tspan></text>
```

**Line 308 (optional) - Add thinking servers message:**
```xml
<!-- After line 308, add: -->
<text class="text" font-size="15" y="352"><tspan class="green">  ✓</tspan><tspan class="white"> 3 Thinking Servers ready (S, T, D)</tspan></text>
```

## Branding Decisions

### What "3TS" Means
- **3** = Three servers
- **TS** = Thinking Servers
- Together: "Three Thinking Servers"

### Alternative: "STD"
- **S** = Sequential Thinking
- **T** = Tractatus Thinking  
- **D** = Debug Thinking
- Acronym: "STD" (may have unfortunate connotations)

### Recommendation: Use "3TS"
- Clearer meaning
- No awkward acronym
- Scalable (could add more thinking servers later)

## Verification Criteria
- [ ] CG completely removed from SVG
- [ ] "DC, CI + 3TS" appears in install output
- [ ] SVG renders correctly
- [ ] Design is visually consistent
- [ ] File size remains reasonable (<10KB)

## Files to Modify
- assets/terminal.svg

## Success Metrics
- SVG displays correctly in README
- Branding accurately reflects current architecture
- No CG references remain
