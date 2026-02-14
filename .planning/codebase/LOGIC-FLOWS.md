# GSI Logic Flows

**Phase:** 12-theory-practice-docs
**Plan:** 12-01
**Purpose:** Comprehensive logic flow documentation with Mermaid diagrams for all major GSI workflows

---

## Planning Flow

### User Initiates Planning

```mermaid
graph TD
    A[User: /GSI:plan-phase X] --> B[Parse Intent]
    B --> C{Project Exists?}
    C -->|No| D[Create New Project]
    C -->|Yes| E[Load STATE.md]
    D --> F[Initialize STATE.md]
    E --> G[Load PROJECT.md]
    F --> G
    G --> H[Load ROADMAP.md]
    H --> I[Identify Phase Requirements]
    I --> J[Spawn GSI-planner Agent]
    J --> K[Analyze Dependencies]
    K --> L[Generate 1-10 Plans]
    L --> M[Group by Waves]
    M --> N[Create PLAN.md Files]
    N --> O[Present Plans to User]
    O --> P{User Approval?}
    P -->|No| L
    P -->|Yes| Q[Save Plans]
    Q --> R[Update STATE.md]
    R --> S[Planning Complete]
    
    style A fill:#e1f5ff
    style S fill:#90ee90
```

### Decision Points

| Decision | Criteria | Outcome |
|----------|-----------|----------|
| Project exists? | .planning/STATE.md present | Load or create |
| Dependencies | Phase depends_on complete | Proceed or block |
| Wave count | 10+ tasks or complexity | 1-3 waves |
| User approval | User types "approved" | Save or regenerate |

---

## Execution Flow

### User Initiates Execution

```mermaid
graph TD
    A[User: /GSI:execute-phase X] --> B[Parse Intent]
    B --> C[Load STATE.md]
    C --> D[Initialize Orchestrator]
    D --> E[Run phase-plan-index]
    E --> F[Get Plans and Waves]
    F --> G{Waves Detected?}
    G -->|No| H[Phase Complete - No Plans]
    G -->|Yes| I[Execute Wave 1]
    I --> J{Autonomous Plans?}
    J -->|Yes| K[Spawn Agents in Parallel]
    J -->|No| L[Spawn Agent Sequentially]
    K --> M[Wait for Completions]
    L --> M
    M --> N{Checkpoint Reached?}
    N -->|Yes| O[Return Checkpoint State]
    N -->|No| P[Generate SUMMARY.md]
    O --> Q{User Approved?}
    Q -->|No| R[Stop - Awaiting User]
    Q -->|Yes| S[Spawn Continuation Agent]
    R --> T[User: done / approved]
    T --> S
    S --> U[Update STATE.md]
    P --> U
    U --> V{More Waves?}
    V -->|Yes| W[Increment Wave]
    W --> I
    V -->|No| X[Phase Complete]
    X --> Y[Generate Aggregate Report]
    Y --> Z[Update ROADMAP.md]
    
    style A fill:#e1f5ff
    style X fill:#90ee90
```

### Agent Lifecycle

```mermaid
graph TD
    A[Spawn Executor Agent] --> B[Load Plan Context]
    B --> C[Load Workflow Templates]
    C --> D[Initialize Task Tracker]
    D --> E[For Each Task]
    E --> F{Task Type}
    F -->|auto| G[Execute Task]
    F -->|checkpoint| H[Return Checkpoint]
    F -->|verify| I[Run Verification]
    G --> J{Task Complete?}
    J -->|No| K[Apply Deviation Rules]
    J -->|Yes| L[Commit Task]
    K --> G
    H --> M[Return to Orchestrator]
    I --> N{Verification Pass?}
    N -->|No| O[Fix Issues]
    N -->|Yes| L
    O --> G
    L --> P{More Tasks?}
    P -->|Yes| E
    P -->|No| Q[Create SUMMARY.md]
    Q --> R[Return to Orchestrator]
    
    style A fill:#ffeb3b
    style Q fill:#90ee90
```

---

## Verification Flow

### Auto-Validation Trigger

```mermaid
graph TD
    A[Agent Completion Signal] --> B[Completion Detected]
    B --> C[Spawn Validation Agent]
    C --> D[Load auto-validation.md]
    D --> E[Load Code-Review Expert Skill]
    E --> F[Initialize 7-BMAD Gates]
    F --> G[Gate 1: Method - Correctness]
    G --> H{Pass?}
    H -->|No| I[Document Issues]
    H -->|Yes| J[Gate 2: Mad - Integration]
    I --> K[Attempt Auto-Fix 1]
    J --> L{Pass?}
    K --> G
    L -->|No| I
    L -->|Yes| M[Gate 3: Model - Architecture]
    M --> N{Pass?}
    N -->|No| I
    N -->|Yes| O[Gate 4: Mode - Patterns]
    O --> P{Pass?}
    P -->|No| I
    P -->|Yes| Q[Gate 5: Mod - Maintainability]
    Q --> R{Pass?}
    R -->|No| I
    R -->|Yes| S[Gate 6: Modd - Extensibility]
    S --> T{Pass?}
    T -->|No| I
    T -->|Yes| U[Gate 7: Methodd - Documentation]
    U --> V{Pass?}
    V -->|No| I
    V -->|Yes| W[All Gates Pass]
    W --> X{Retry Count < 3?}
    X -->|No| Y[Mark Complete]
    X -->|Yes| I
    I --> Z[Increment Retry]
    Z --> AA{Retry Count = 3?}
    AA -->|Yes| AB[Validation Failed]
    AA -->|No| K
    AB --> AC[Generate Failure Report]
    Y --> AD[Return Success]
    AC --> AD
    
    style A fill:#e1f5ff
    style Y fill:#90ee90
    style AB fill:#ff6b6b
```

### Quality Gates Detail

| Gate | Circle | Checks | Pass Criteria |
|------|--------|--------|--------------|
| 1 | Method | Implementation correctness | Code compiles, logic correct, edges handled |
| 2 | Mad | Integration completeness | Dependencies integrated, APIs match, data flows |
| 3 | Model | Architecture alignment | Follows patterns, separation of concerns |
| 4 | Mode | Pattern consistency | Naming conventions, error handling |
| 5 | Mod | Maintainability | Readable, sized right, test coverage |
| 6 | Modd | Extensibility | Easy to extend, no hard-codes |
| 7 | Methodd | Documentation | README updated, API docs complete |

---

## Decision Trees

### Tool Selection Decision Tree

```mermaid
graph TD
    A[Need to Perform Operation] --> B{Skill Available?}
    B -->|Yes| C[Use Skill]
    B -->|No| D{MCP Tool Available?}
    D -->|Yes| E{DC or CI?}
    D -->|No| F[Use Native Tool]
    E -->|Desktop Commander| G[Use DC MCP]
    E -->|Code-Index| H[Use CI MCP]
    E -->|CodeGraphContext| I[Use CG MCP]
    E -->|Other MCP| J[Use Specific MCP]
    C --> K[Execute - 80-90% Savings]
    G --> K
    H --> K
    I --> K
    J --> K
    F --> L[Execute - Baseline]
    K --> M[Operation Complete]
    L --> M
    
    style C fill:#90ee90
    style G fill:#ffd700
    style H fill:#ffd700
    style I fill:#ffd700
    style F fill:#ff6b6b
```

### Error Handling Decision Tree

```mermaid
graph TD
    A[Error Encountered] --> B{Error Type}
    B -->|Bug Fix| C[Rule 1: Auto-Fix]
    B -->|Missing Critical| D[Rule 2: Auto-Add]
    B -->|Blocking| E[Rule 3: Auto-Fix]
    B -->|Architectural| F[Rule 4: Return Checkpoint]
    C --> G[Fix Inline]
    D --> H[Add Functionality]
    E --> I[Fix Blocker]
    F --> J[Stop and Present Decision]
    G --> K[Continue Task]
    H --> K
    I --> K
    J --> L[Wait for User]
    L --> M{User Decision}
    M -->|Approved| N[Continue]
    M -->|Alternative| O[Implement Alternative]
    M -->|Skip| P[Mark Skipped]
    N --> K
    O --> K
    P --> Q[Next Task]
    K --> R{Task Complete?}
    R -->|No| K
    R -->|Yes| S[Commit Task]
    
    style C fill:#90ee90
    style D fill:#90ee90
    style E fill:#90ee90
    style F fill:#ff6b6b
    style S fill:#90ee90
```

### MCP Server Selection Decision Tree

```mermaid
graph TD
    A[Need Server Capability] --> B{Capability Type}
    B -->|Files/Processes| C[Desktop Commander]
    B -->|Code Search| D[Code-Index MCP]
    B -->|Relationships| E[CodeGraphContext]
    B -->|Thinking| F{Thinking Type}
    B -->|Lib Docs| G[Context7]
    B -->|GitHub| H[DeepWiki]
    B -->|Web Search| I[rag-web-browser]
    F -->|Sequential| J[Sequential Thinking]
    F -->|Logical| K[Tractatus Thinking]
    F -->|Debugging| L[Debug Thinking]
    C --> M{Connected?}
    D --> N{Connected?}
    E --> O{Connected?}
    M -->|Yes| P[Use DC]
    M -->|No| Q[Error: DC Required]
    N -->|Yes| R[Use CI]
    N -->|No| S[Error: CI Required]
    O -->|Yes| T[Use CG]
    O -->|No| U[Error: CG Required]
    Q --> V[Return Error]
    S --> V
    U --> V
    J --> W{Connected?}
    K --> X{Connected?}
    L --> Y{Connected?}
    W -->|Yes| AA[Use Sequential]
    W -->|No| AB[Fallback to Manual]
    X -->|Yes| AC[Use Tractatus]
    X -->|No| AD[Fallback to Sequential]
    Y -->|Yes| AE[Use Debug]
    Y -->|No| AF[Fallback to Manual]
    G --> AG{Connected?}
    H --> AH{Connected?}
    I --> AI{Configured?}
    AG -->|Yes| AJ[Use Context7]
    AG -->|No| AK[Fallback to Web Search]
    AH -->|Yes| AL[Use DeepWiki]
    AH -->|No| AM[Fallback to GitHub API]
    AI -->|Yes| AN[Use rag-web-browser]
    AI -->|No| AO[Fallback to WebSearch Tool]
    
    style C fill:#ffd700
    style D fill:#ffd700
    style E fill:#ffd700
    style Q fill:#ff6b6b
    style S fill:#ff6b6b
    style U fill:#ff6b6b
    style V fill:#ff6b6b
```

---

## Orchestration Flow

### Wave Execution Logic

```mermaid
graph TD
    A[Start Phase Execution] --> B[Load Wave Plans]
    B --> C[For Each Wave]
    C --> D{Parallelization?}
    D -->|Yes| E[Spawn All Agents]
    D -->|No| F[Spawn Agents Sequentially]
    E --> G[Wait for All Completions]
    F --> H[Wait for Single Agent]
    H --> I{More Plans in Wave?}
    I -->|Yes| H
    I -->|No| G
    G --> J{Checkpoint in Wave?}
    J -->|Yes| K[Present Checkpoint]
    J -->|No| L[Wave Complete]
    K --> M{User Approved?}
    M -->|No| N[Stop - Awaiting User]
    M -->|Yes| O[Spawn Continuations]
    N --> P{User: continue?}
    P -->|No| Q[Abort Phase]
    P -->|Yes| O
    O --> L
    L --> R{More Waves?}
    R -->|Yes| S[Next Wave]
    R -->|No| T[Phase Complete]
    S --> C
    Q --> U[Partial Complete Report]
    T --> V[Success Report]
    
    style E fill:#e1f5ff
    style T fill:#90ee90
    style Q fill:#ff6b6b
    style U fill:#ffeb3b
```

### Checkpoint Handling Flow

```mermaid
graph TD
    A[Agent Hits Checkpoint] --> B{Checkpoint Type}
    B -->|human-verify| C[Visual Verification]
    B -->|decision| D[User Decision Required]
    B -->|human-action| E[Manual Action Required]
    C --> F[Present Verification Steps]
    D --> G[Present Options]
    E --> H[Present Action Steps]
    F --> I[Wait for User]
    G --> I
    H --> I
    I --> J{User Response}
    J -->|approved| K[Spawn Continuation]
    J -->|done| K
    J -->|option selected| L[Apply Selection]
    J -->|issues| M[Spawn Fix Agent]
    L --> K
    M --> N[Wait for Fix]
    N --> K
    K --> O[Resume Execution]
    O --> P[Continue from Task]
    
    style C fill:#e1f5ff
    style D fill:#ffeb3b
    style E fill:#ffeb3b
    style P fill:#90ee90
```

---

## Data Flow

### File Operation Flow

```mermaid
sequenceDiagram
    participant Agent as GSI Agent
    participant DC as Desktop Commander MCP
    participant FS as File System
    
    Agent->>DC: read_file(path)
    DC->>FS: Read file contents
    FS-->>DC: Return content
    DC-->>Agent: Content (67% tokens saved)
    Agent->>Agent: Process content
    Agent->>DC: write_file(path, content)
    DC->>FS: Write file
    FS-->>DC: Success
    DC-->>Agent: Success (75% tokens saved)
```

### Code Search Flow

```mermaid
sequenceDiagram
    participant Agent as GSI Agent
    participant CI as Code-Index MCP
    participant IDX as Symbol Index
    
    Agent->>CI: search_code_advanced(pattern)
    CI->>IDX: Query pattern
    IDX-->>CI: Results with context
    CI-->>Agent: Matches (80% tokens saved)
    Agent->>Agent: Analyze results
    Agent->>CI: get_symbol_body(file, symbol)
    CI->>IDX: Extract symbol
    IDX-->>CI: Symbol code
    CI-->>Agent: Function/class code (80% tokens saved)
```

### Commit Flow

```mermaid
sequenceDiagram
    participant Agent as GSI Agent
    participant Git as Git System
    participant DC as Desktop Commander MCP
    
    Agent->>DC: start_process(git add)
    DC->>Git: Stage files
    Git-->>DC: Staged
    DC-->>Agent: Process output
    Agent->>DC: start_process(git commit)
    DC->>Git: Create commit
    Git-->>DC: Commit hash
    DC-->>Agent: Hash
    Agent->>DC: start_process(git rev-parse)
    DC->>Git: Get short hash
    Git-->>DC: Hash
    DC-->>Agent: Short hash
    Agent->>Agent: Track for SUMMARY.md
```

---

## [END OF LOGIC FLOWS]

**Flow Documentation:** Complete
**Total Diagrams:** 9 Mermaid diagrams
**Coverage:** Planning, Execution, Verification, Decisions, Orchestration, Data Flows
**Next:** Create EDGE-CASES.md