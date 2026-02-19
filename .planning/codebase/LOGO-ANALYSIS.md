# GSI Terminal Logo Analysis

## Source
https://raw.githubusercontent.com/Alot1z/get-shit-indexed/main/assets/terminal.svg

## SVG Structure

### ViewBox and Dimensions
- ViewBox: `0 0 960 540`
- Width: 960px
- Height: 540px
- Aspect ratio: 16:9

### Color Definitions (Tokyo Night Theme)
```css
.terminal-bg { fill: #1a1b26; }      /* Main background - Tokyo Night dark */
.terminal-border { fill: #24283b; }  /* Border/frame */
.title-bar { fill: #1f2335; }        /* Title bar background */
.btn-red { fill: #f7768e; }          /* Close button */
.btn-yellow { fill: #e0af68; }       /* Minimize button */
.btn-green { fill: #9ece6a; }        /* Maximize button */
.prompt { fill: #7aa2f7; }           /* Shell prompt (~) */
.command { fill: #c0caf5; }          /* Command text */
.cyan { fill: #7dcfff; }             /* GSI ASCII art */
.green { fill: #9ece6a; }            /* Checkmarks and Done */
.dim { fill: #565f89; }              /* Secondary text */
.white { fill: #c0caf5; }            /* Primary text */
```

### Structural Elements

#### 1. Window Frame
- Outer border: `rect` with `rx="12"` (rounded corners)
- Inner background: Offset by 1px with `rx="11"`
- Total size: 960x540

#### 2. Title Bar
- Height: 36px
- Contains: 3 window control buttons (macOS style)
  - Red (close): cx="24", cy="19", r="7"
  - Yellow (minimize): cx="48", cy="19", r="7"
  - Green (maximize): cx="72", cy="19", r="7"
- Title text: "Terminal" centered, dim color

#### 3. Terminal Content
- Content offset: `transform="translate(32, 72)"`
- Prompt line: `~ $ npx get-shit-indexed-cc`
- ASCII art banner: "GSI" in cyan
- Version info and description
- Installation output with checkmarks
- Completion message

#### 4. ASCII Art "GSI"
- Font: Monospace (SF Mono, Fira Code, JetBrains Mono, Consolas)
- Font size: 14px
- Color: Cyan (#7dcfff)
- 6 lines of text forming block letters
- Uses Unicode box-drawing characters

### Key Design Patterns

1. **Terminal Aesthetic**: macOS-style window with traffic light buttons
2. **Tokyo Night Colors**: Dark background with muted, semantic colors
3. **ASCII Art**: Block-style letter rendering using monospace font
4. **Layered Structure**: Border → Background → Title bar → Content

### Differences for GSI Logo

1. **Letter Change**: "D" becomes "I"
2. **I Letter Styling**: Purple (#bb9af7) with glow effect
3. **Ring Effects**: Horizontal ellipses around I (Red → Yellow → Green → Purple)
4. **Concept**: "Indexed" data ripples emanating from I
