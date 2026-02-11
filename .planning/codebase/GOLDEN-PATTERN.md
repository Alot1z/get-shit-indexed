# Golden Pattern: CG discover → CI understand → CI understand → DC act → DC verify → CI verify

**Created:** 2026-02-11
**Purpose:** Proven tool chain pattern for token-efficient, reliable GSD workflows using all three MCP servers

---

## Executive Summary

The **Golden Pattern** is the optimal tool chain for complex code changes requiring comprehensive analysis, relationship awareness, and verification. It maximizes each MCP server's strengths:

- **CG (CodeGraphContext):** Relationship discovery, dependency mapping, impact analysis
- **CI (Code-Index MCP):** Code analysis, symbol navigation, implementation details
- **DC (Desktop Commander MCP):** File operations, process execution, verification

**Result:** 80-90% token savings with built-in verification and relationship awareness

---

## Why This Sequence

### The Question: Why CG → CI → CI → DC → DC → CI?

This specific sequence was discovered through extensive research (see `MCP-Tool-Chain-Full-Analysis.md`) as the optimal flow for complex code changes:

| Step | MCP Server | Purpose | Why Here |
|-------|-------------|---------|-----------|
| **1. CG discover** | CodeGraphContext | Find relationships, identify affected files, map dependencies |
| **2. CI understand** | Code-Index MCP | Deep code analysis, extract implementation details |
| **3. CI understand** | Code-Index MCP | Additional targeted queries for completeness |
| **4. DC act** | Desktop Commander | Execute file/process operations based on analysis |
| **5. DC verify** | Desktop Commander | Verify changes were applied correctly |
| **6. CI verify** | Code-Index MCP | Confirm implementation matches analysis expectations |

### Two CI Steps: Why Two Separate Understanding Phases?

**CI understand (Step 2):** Broad analysis
- Search codebase for patterns
- Get file summaries
- Understand existing architecture
- Identify relevant symbols

**CI understand (Step 3):** Deep understanding
- Get symbol bodies for specific functions
- Extract implementation details
- Understand parameter contracts
- Map return types

The two-step understanding ensures we have BOTH context (where things are) AND depth (how they work) before making changes.

### Verification Loop: DC → CI

**DC verify (Step 5):** Local verification
- Read file to confirm changes written
- Check file info to verify size/timestamp
- Ensure no write errors occurred

**CI verify (Step 6):** Semantic verification
- Search for the new pattern to confirm it exists
- Get symbol body to verify implementation
- Ensure code compiles/loads correctly

This dual verification catches both write failures AND logic errors before task completion.

---

## Detailed Step Documentation

### Step 1: CG discover (CodeGraphContext)

**Purpose:** Discover relationships and identify relevant files

**What It Does:**
- Analyzes code relationships and dependencies
- Maps how modules/components connect
- Identifies files affected by changes
- Discovers usage patterns for symbols

**When to Use:**
- Multi-file refactors affecting dependencies
- Adding features that touch multiple modules
- Understanding impact before making changes
- Finding all usages of a function/variable

**MCP Tools:**
```
mcp__CodeGraphContext__query_graph - Query the code graph
mcp__CodeGraphContext__find_path - Find relationship paths
mcp__CodeGraphContext__get_neighbors - Get connected nodes
```

**Example Output:**
```
Files affected by changing `User.authenticate()`:
- src/auth/login.ts (uses User.authenticate)
- src/middleware/auth.ts (imports User.authenticate)
- src/models/user.ts (defines User.authenticate)
- tests/auth.test.ts (mocks User.authenticate)
```

---

### Step 2: CI understand - Broad Analysis (Code-Index MCP)

**Purpose:** Perform deep code analysis and extract implementation details

**What It Does:**
- Searches codebase for relevant patterns
- Gets file summaries with function/class definitions
- Extracts imports and dependencies
- Analyzes code complexity metrics

**When to Use:**
- Understanding existing code before changes
- Finding where functions are defined
- Analyzing code structure
- Identifying similar patterns to follow

**MCP Tools:**
```
mcp__code-index-mcp__search_code_advanced - Search with regex/context
mcp__code-index-mcp__find_files - Find files by pattern
mcp__code-index-mcp__get_file_summary - Get file analysis
```

**Example Output:**
```
File: src/auth/login.ts
Lines: 45
Functions: handleLogin, validateCredentials
Imports: from './models/user', from 'jsonwebtoken'
Complexity: Low
```

---

### Step 3: CI understand - Deep Dive (Code-Index MCP)

**Purpose:** Extract specific implementation details for targeted changes

**What It Does:**
- Gets symbol bodies (actual function code)
- Extracts method signatures and parameters
- Returns docstrings and comments
- Identifies call sites (what calls this symbol)

**When to Use:**
- Understanding exact implementation before modifying
- Extracting function signatures for compatibility
- Finding what a function returns
- Understanding error handling patterns

**MCP Tools:**
```
mcp__code-index-mcp__get_symbol_body - Get function/class code
```

**Example Output:**
```
Symbol: validateCredentials
Signature: (email: string, password: string): Promise<User | null>
Code:
  async function validateCredentials(email, password) {
    const user = await User.findByEmail(email);
    if (!user || !bcrypt.compare(password, user.passwordHash)) {
      return null;
    }
    return user;
  }
Called by: handleLogin
```

---

### Step 4: DC act (Desktop Commander MCP)

**Purpose:** Execute file and process operations based on analysis

**What It Does:**
- Creates new files or edits existing ones
- Runs build/test processes
- Executes terminal commands
- Moves or organizes files

**When to Use:**
- Making actual code changes
- Running tests or builds
- Creating/modifying project files
- Executing any CLI commands

**MCP Tools:**
```
mcp__desktop-commander__edit_block - Surgical text replacement
mcp__desktop-commander__write_file - Create/overwrite files
mcp__desktop-commander__start_process - Run commands
mcp__desktop-commander__interact_with_process - Interactive I/O
mcp__desktop-commander__move_file - Move/rename files
```

**Example Output:**
```
Edit applied to src/auth/login.ts:
- Replaced: validateCredentials function
- With: New version with 2FA support
- Lines changed: 12-18
```

---

### Step 5: DC verify (Desktop Commander MCP)

**Purpose:** Verify changes were applied correctly

**What It Does:**
- Reads files to confirm content changed
- Checks file metadata (size, timestamp)
- Ensures no write errors occurred
- Verifies file permissions

**When to Use:**
- After any file write/edit operation
- Confirming deployments succeeded
- Checking file integrity

**MCP Tools:**
```
mcp__desktop-commander__read_file - Read file content
mcp__desktop-commander__get_file_info - Get metadata
mcp__desktop-commander__list_directory - Verify file exists
```

**Example Output:**
```
Verification of src/auth/login.ts:
✓ File exists
✓ Size: 1247 bytes (changed from 1024)
✓ Modified: 2026-02-11T19:45:00Z
✓ Contains "validateCredentials"
```

---

### Step 6: CI verify (Code-Index MCP)

**Purpose:** Confirm implementation matches analysis and is correct

**What It Does:**
- Searches for new patterns to confirm they exist
- Re-analyzes symbols to verify implementation
- Checks for compilation/loading errors
- Ensures changes integrated correctly

**When to Use:**
- After any code modification
- Verifying refactoring completed successfully
- Confirming new features are discoverable

**MCP Tools:**
```
mcp__code-index-mcp__search_code_advanced - Find new pattern
mcp__code-index-mcp__get_symbol_body - Verify implementation
mcp__code-index-mcp__get_file_summary - Re-analyze file
```

**Example Output:**
```
Verification of validateCredentials update:
✓ Found "validateCredentials" in src/auth/login.ts
✓ Function signature includes 2FA parameter
✓ Docstring updated with 2FA documentation
✓ No other files import old signature
```

---

## Concrete Example Workflow

### Starting Problem: Add authentication to user routes

**Context:** We have user profile routes that need authentication protection. Users should only see their own profiles.

### Step-by-Step Execution

#### Step 1: CG discover
```
Query: "What files use or define User authentication?"

CG Response:
- src/middleware/auth.ts (defines authentication middleware)
- src/routes/users.ts (uses authentication - NEEDS UPDATE)
- src/routes/profile.ts (uses authentication - NEEDS UPDATE)
- src/lib/auth.ts (defines auth utilities)
```

**Result:** Identified 2 files needing updates (`users.ts`, `profile.ts`)

#### Step 2: CI understand (broad analysis)
```
Search: "middleware.*auth pattern"
CI Response: Found 3 matches

1. src/middleware/auth.ts - export function authenticate(req, res, next)
2. src/routes/admin.ts - uses authenticate middleware
3. src/routes/users.ts - NO authenticate (needs adding)

Get summary: src/routes/users.ts
CI Response: 5 routes (get, getById, update, delete, list)
  - No authentication middleware present
  - Export: router
```

**Result:** Understands current structure and that middleware needs adding

#### Step 3: CI understand (deep dive)
```
Get symbol: authenticate (from src/middleware/auth.ts)

CI Response:
Signature: (req: Request, res: Response, next: NextFunction) => Promise<void>
Code:
  export async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const user = await verifyToken(token);
    req.user = user;
    next();
  }
```

**Result:** Knows exactly how to use the middleware

#### Step 4: DC act
```
Edit: src/routes/users.ts
Add: router.use(authenticate); after router import
```

DC Response: Edit applied successfully (line 3)

#### Step 5: DC verify
```
Read: src/routes/users.ts (first 10 lines)

DC Response:
1  import express from 'express';
2  import { authenticate } from '../middleware/auth.js';
3  router.use(authenticate);
4  ...
```

**Result:** Confirmed edit was applied correctly

#### Step 6: CI verify
```
Search: "authenticate.*users.ts"
CI Response: Found 1 match in src/routes/users.ts (line 3)

Get symbol: authenticate
CI Response: ✓ middleware properly imported and used
```

**Result:** Implementation verified - routes now protected

---

## When to Use Golden Pattern

### Use Golden Pattern When:

1. **Complex code changes requiring relationship awareness**
   - Multi-file refactors
   - Breaking API changes
   - Architecture modifications
   - Database schema updates

2. **Multi-file refactors affecting dependencies**
   - Changing shared utilities
   - Updating type definitions
   - Refactoring common patterns
   - Renaming exported symbols

3. **Feature additions requiring comprehensive analysis**
   - New authentication flows
   - Permission systems
   - API endpoint additions
   - Database relationship changes

4. **Situations where verification is critical**
   - Security-related changes
   - Payment processing
   - User data handling
   - External API integrations

### Use Simpler Patterns When:

1. **DC-only pattern** for simple file operations
   - Single file edits
   - README updates
   - Config changes
   - Simple reads

2. **CI-only pattern** for code analysis
   - Finding where functions are defined
   - Searching for patterns
   - Understanding existing code
   - Documentation lookup

3. **DC → CI pattern** for edit-then-analyze
   - Making a change and checking impact
   - Quick iterations
   - Experimental changes

4. **CI → DC pattern** for analyze-then-edit
   - Understanding code before changing
   - Following existing patterns
   - Targeted modifications

---

## Token Efficiency

### Golden Pattern Token Usage

```
Step 1 (CG discover):        ~5,000 tokens
Step 2 (CI understand):       ~8,000 tokens
Step 3 (CI understand):       ~6,000 tokens
Step 4 (DC act):            ~4,000 tokens
Step 5 (DC verify):          ~3,000 tokens
Step 6 (CI verify):          ~7,000 tokens
───────────────────────────────────────────
TOTAL:                       ~33,000 tokens
```

### Same Task Without MCP (Native Tools)

```
Discovery (Grep):            ~45,000 tokens
Understanding (Read files):    ~120,000 tokens
Edit (native Edit):           ~25,000 tokens
Verify (Read + Grep):        ~50,000 tokens
───────────────────────────────────────────
TOTAL:                       ~240,000 tokens
```

**Savings: ~86%**

---

## Relationship to Other Patterns

The Golden Pattern is the COMPREHENSIVE pattern for complex workflows. Simpler patterns exist for specific use cases:

| Pattern | Flow | When to Use |
|----------|-------|--------------|
| DC-only | DC act → DC verify | Simple file edits |
| CI-only | CI understand → CI understand | Code analysis only |
| CI → DC | CI understand → DC act | Understand then edit |
| DC → CI | DC act → CI understand | Edit then analyze impact |
| **Golden** | **CG → CI → CI → DC → DC → CI** | **Complex multi-file changes** |

For the complete catalog of patterns, see `TOOL-CHAIN-PATTERNS.md`.

---

## Notes on CodeGraphContext Availability

**Current Status:** CodeGraphContext MCP is documented as unavailable (see `MCP-SERVER-STATUS.md`)

**Workaround:** When CG is unavailable, start with CI discover:

```
CI discover (search_code_advanced) → CI understand → DC act → DC verify → CI verify
```

This modified pattern uses CI for relationship discovery via search and symbol analysis.

**Future Enhancement:** Install CodeGraphContext MCP to enable full golden pattern capabilities.

---

## Practical Implementation Guide

### MCP Tool Calls for Each Step

#### Step 1: CG discover - Tool Calls

```yaml
# Query code graph for relationships
mcp__CodeGraphContext__query_graph:
  query: "files that import or use User.authenticate"
  depth: 2

# Find relationship paths
mcp__CodeGraphContext__find_path:
  from: "src/routes/users.ts"
  to: "src/middleware/auth.ts"
  relationship_type: "imports"

# Get connected nodes
mcp__CodeGraphContext__get_neighbors:
  node: "src/models/user.ts"
  direction: "both"
  max_depth: 1
```

#### Step 2: CI understand - Broad Analysis Tool Calls

```yaml
# Search for patterns across codebase
mcp__code-index-mcp__search_code_advanced:
  pattern: "middleware.*auth"
  regex: true
  file_pattern: "*.ts"
  case_sensitive: false
  context_lines: 3

# Find files by pattern
mcp__code-index-mcp__find_files:
  pattern: "middleware/*.ts"

# Get file summary
mcp__code-index-mcp__get_file_summary:
  file_path: "src/routes/users.ts"
```

#### Step 3: CI understand - Deep Dive Tool Calls

```yaml
# Get symbol body (function code)
mcp__code-index-mcp__get_symbol_body:
  file_path: "src/middleware/auth.ts"
  symbol_name: "authenticate"
```

**Response Structure:**
```json
{
  "status": "success",
  "symbol_name": "authenticate",
  "type": "function",
  "line": 5,
  "end_line": 18,
  "code": "export async function authenticate(req, res, next) { ... }",
  "signature": "(req: Request, res: Response, next: NextFunction) => Promise<void>",
  "docstring": "Authentication middleware for protected routes",
  "called_by": ["src/routes/admin.ts", "src/routes/users.ts"]
}
```

#### Step 4: DC act - Tool Calls

```yaml
# Surgical text replacement
mcp__desktop-commander__edit_block:
  file_path: "src/routes/users.ts"
  old_string: |
    import express from 'express';
    const router = express.Router();
  new_string: |
    import express from 'express';
    import { authenticate } from '../middleware/auth.js';
    
    const router = express.Router();
    router.use(authenticate);
  expected_replacements: 1

# Create new file
mcp__desktop-commander__write_file:
  path: "src/routes/protected.ts"
  content: |
    import express from 'express';
    import { authenticate } from './middleware/auth.js';
    
    const router = express.Router();
    router.use(authenticate);
    
    router.get('/profile', (req, res) => {
      res.json({ user: req.user });
    });
    
    export default router;
  mode: "rewrite"

# Run command
mcp__desktop-commander__start_process:
  command: "npm test"
  timeout_ms: 30000
```

#### Step 5: DC verify - Tool Calls

```yaml
# Read file to verify changes
mcp__desktop-commander__read_file:
  path: "src/routes/users.ts"
  offset: 0
  length: 10

# Get file metadata
mcp__desktop-commander__get_file_info:
  path: "src/routes/users.ts"

# Verify file exists
mcp__desktop-commander__list_directory:
  path: "src/routes"
  depth: 1
```

#### Step 6: CI verify - Tool Calls

```yaml
# Search for new pattern
mcp__code-index-mcp__search_code_advanced:
  pattern: "authenticate.*middleware"
  file_pattern: "src/routes/*.ts"
  regex: true

# Re-analyze file
mcp__code-index-mcp__get_file_summary:
  file_path: "src/routes/users.ts"

# Verify symbol implementation
mcp__code-index-mcp__get_symbol_body:
  file_path: "src/routes/users.ts"
  symbol_name: "router"
```

---

## Concrete Example: Adding a Field to TypeScript Interface

### Problem: Add `lastLogin` field to User interface

#### Step 1: CG discover
```yaml
# Find where User type is defined and used
mcp__CodeGraphContext__query_graph:
  query: "User interface or type definition"
```

**CG Response:**
```
User defined in:
- src/types/user.ts (definition)
- src/models/user.ts (implements)
- src/routes/users.ts (uses)
- src/middleware/auth.ts (uses)
```

#### Step 2: CI understand (broad)
```yaml
# Search for User interface
mcp__code-index-mcp__search_code_advanced:
  pattern: "interface User"
  file_pattern: "*.ts"
  regex: false

# Get file summary
mcp__code-index-mcp__get_file_summary:
  file_path: "src/types/user.ts"
```

**CI Response:**
```
File: src/types/user.ts
Lines: 15
Interfaces: User
Fields: id, email, name, passwordHash, createdAt
```

#### Step 3: CI understand (deep)
```yaml
# Get User interface symbol
mcp__code-index-mcp__get_symbol_body:
  file_path: "src/types/user.ts"
  symbol_name: "User"
```

**CI Response:**
```
Code:
  export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: Date;
  }
```

#### Step 4: DC act
```yaml
# Edit User interface
mcp__desktop-commander__edit_block:
  file_path: "src/types/user.ts"
  old_string: |
    export interface User {
      id: string;
      email: string;
      name: string;
      passwordHash: string;
      createdAt: Date;
    }
  new_string: |
    export interface User {
      id: string;
      email: string;
      name: string;
      passwordHash: string;
      createdAt: Date;
      lastLogin?: Date;
    }
  expected_replacements: 1
```

**DC Response:** Edit applied successfully

#### Step 5: DC verify
```yaml
# Verify file was edited
mcp__desktop-commander__read_file:
  path: "src/types/user.ts"
```

**DC Response:** File now contains `lastLogin?: Date;` field

#### Step 6: CI verify
```yaml
# Verify field exists
mcp__code-index-mcp__search_code_advanced:
  pattern: "lastLogin"
  file_pattern: "*.ts"
```

**CI Response:** Found 1 match in src/types/user.ts

---

## Error Handling and Recovery

### CG Server Unavailable

**Symptom:** `mcp__CodeGraphContext__*` tools fail with "server not found" error

**Recovery Strategy:**
1. Skip CG discover step
2. Use CI for broad discovery via `search_code_advanced`
3. Proceed with remaining steps

**Modified Pattern:**
```
CI discover → CI understand → DC act → DC verify → CI verify
```

**Example Recovery:**
```yaml
# Instead of CG query, use CI search
mcp__code-index-mcp__search_code_advanced:
  pattern: "import.*User"
  file_pattern: "*.ts"
  context_lines: 2
```

---

### CI Search Returns No Results

**Symptom:** `search_code_advanced` returns empty results

**Possible Causes:**
- Pattern doesn't exist in codebase
- Index is stale (needs refresh)
- File pattern filter too restrictive
- Regex pattern invalid

**Recovery Strategy:**
1. Broaden search (remove file_pattern, simplify regex)
2. Refresh index: `mcp__code-index-mcp__refresh_index`
3. Try literal search: `literal_search: true`

**Example Recovery:**
```yaml
# Initial search fails
mcp__code-index-mcp__search_code_advanced:
  pattern: "authenticate"
  file_pattern: "src/middleware/*.ts"
  # Returns: []

# Recovery 1: Broaden file pattern
mcp__code-index-mcp__search_code_advanced:
  pattern: "authenticate"
  file_pattern: "*.ts"
  # Returns: results

# Recovery 2: If still empty, refresh index
mcp__code-index-mcp__refresh_index: {}

# Recovery 3: Try literal search
mcp__code-index-mcp__search_code_advanced:
  pattern: "authenticate"
  literal_search: true
```

---

### DC Operation Failures

**Symptom:** `edit_block` or `write_file` fails with permission error or timeout

**Possible Causes:**
- File is locked (another process using it)
- Insufficient permissions
- Disk full
- File path too long (Windows)

**Recovery Strategy:**
1. Check file info: `get_file_info` to verify accessibility
2. List processes: `list_processes` to find blocking process
3. Use alternative: `start_process` with file edit command
4. Retry with exponential backoff

**Example Recovery:**
```yaml
# Initial edit fails
mcp__desktop-commander__edit_block:
  # ... fails with timeout

# Recovery 1: Check file accessibility
mcp__desktop-commander__get_file_info:
  path: "src/routes/users.ts"

# Recovery 2: If locked, find blocking process
mcp__desktop-commander__list_processes: {}

# Recovery 3: Use CLI fallback
mcp__desktop-commander__start_process:
  command: "powershell -Command \"(Get-Content src/routes/users.ts) -replace 'old','new' | Set-Content src/routes/users.ts\""
  timeout_ms: 10000
```

---

### Verification Failure Retry Strategies

**Symptom:** DC verify or CI verify step fails

**DC verify fails** (file doesn't match expected content):
1. Re-read the file to confirm
2. Check file info for size/changes
3. Re-run the edit operation
4. Maximum 3 retries before reporting failure

**CI verify fails** (pattern not found after changes):
1. Refresh Code-Index: `refresh_index`
2. Re-run search with broader pattern
3. Check file summary to verify indexing
4. Maximum 3 retries before reporting failure

**Example Retry Logic:**
```yaml
# Retry pattern for verification
for attempt in range(3):
  result = mcp__code-index-mcp__search_code_advanced(
    pattern: "lastLogin"
  )
  if result.matches:
    return "verified"
  elif attempt < 2:
    mcp__code-index-mcp__refresh_index()
    sleep(1000 * (attempt + 1))
return "verification_failed"
```

---

## Token Efficiency with Practical Examples

### Example: Add authentication middleware to routes

| Step | Tool | Approximate Tokens |
|-------|-------|------------------|
| 1. CG discover | query_graph | ~4,500 |
| 2. CI understand | search_code_advanced + get_file_summary | ~7,000 |
| 3. CI understand | get_symbol_body | ~5,000 |
| 4. DC act | edit_block | ~3,500 |
| 5. DC verify | read_file | ~2,500 |
| 6. CI verify | search_code_advanced | ~6,000 |
| **TOTAL** | | **~28,500 tokens** |

**Native tools equivalent:** ~180,000 tokens
**Savings:** ~84%

---

*Golden Pattern Documentation*
*Created: 2026-02-11*
*Reference: MCP-Tool-Chain-Full-Analysis.md*
