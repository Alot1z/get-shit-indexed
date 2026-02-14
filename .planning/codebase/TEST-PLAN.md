# GSI Test Plan

**Generated:** 2026-02-14T11:18:45Z
**Phase:** 13-comprehensive-testing
**Plan:** 13-01
**Purpose:** Comprehensive test plan for verifying GSI → GSI transformation complete

## Test Categories

### 1. CLI Command Tests

#### 1.1 Core Commands
- [ ] /gsi:help - Display all available commands
- [ ] /gsi:progress - Show project progress bar
- [ ] /gsi:state - Load and display project state
- [ ] /gsi:roadmap - Display project roadmap

#### 1.2 Workflow Commands
- [ ] /gsi:plan-phase - Create new phase plan
- [ ] /gsi:execute-phase - Execute plan tasks
- [ ] /gsi:new-project - Initialize new GSI project
- [ ] /gsi:new-milestone - Create project milestone
- [ ] /gsi:map-codebase - Analyze and map codebase
- [ ] /gsi:quick - Quick planning mode

#### 1.3 Utility Commands
- [ ] /gsi:debug - Debug mode workflows
- [ ] /gsi:pause-work - Pause current work session
- [ ] /gsi:verify-phase - Verify phase completion
- [ ] /gsi:insert-phase - Insert phase into roadmap
- [ ] /gsi:list-phases - List all phases
- [ ] /gsi:complete-milestone - Archive milestone
- [ ] /gsi:remove-phase - Remove phase from roadmap
- [ ] /gsi:resume-project - Resume existing project
- [ ] /gsi:set-profile - Set model profile
- [ ] /gsi:transition - Transition phase status

#### 1.4 Command Branding Tests
- [ ] All commands use "gsi:" prefix
- [ ] No "gsd:" prefix in any command
- [ ] Output uses "GSI" terminology
- [ ] Help text shows GSI branding

---

### 2. MCP Server Integration Tests

#### 2.1 Desktop Commander (DC)
- [ ] read_file - Read file from project
- [ ] write_file - Write file to project
- [ ] edit_block - Edit specific file section
- [ ] list_directory - List directory contents
- [ ] start_process - Start terminal process
- [ ] interact_with_process - Send input to process
- [ ] read_process_output - Read process output
- [ ] start_search - Search for files/content
- [ ] get_file_info - Get file metadata

#### 2.2 Code-Index MCP (CI)
- [ ] set_project_path - Set project for indexing
- [ ] search_code_advanced - Search code patterns
- [ ] find_files - Find files by name pattern
- [ ] get_file_summary - Get file summary
- [ ] get_symbol_body - Get symbol code
- [ ] build_deep_index - Build code index
- [ ] refresh_index - Refresh index after changes

#### 2.3 CodeGraphContext (CG)
- [ ] Connection test - neo4j://localhost:7687
- [ ] Basic query - Query code relationships
- [ ] find_path - Find path between components
- [ ] analyze_impact - Analyze change impact
- [ ] visualize - Generate graph visualization

#### 2.4 Thinking Servers
- [ ] Sequential Thinking - Multi-step problem solving
- [ ] Tractatus Thinking - Logical structure analysis
- [ ] Debug Thinking - Graph-based debugging

---

### 3. Workflow Execution Tests

#### 3.1 Planning Workflow
- [ ] Create phase plan with tasks
- [ ] Verify plan structure (frontmatter, tasks, verification)
- [ ] Check GSI branding in generated plans
- [ ] Verify task dependencies
- [ ] Test checkpoint creation

#### 3.2 Execution Workflow
- [ ] Execute plan tasks sequentially
- [ ] Verify atomic commits per task
- [ ] Test checkpoint handling
- [ ] Verify SUMMARY.md generation
- [ ] Test STATE.md updates

#### 3.3 Verification Workflow
- [ ] Test 7-BMAD gate validation
- [ ] Verify auto-validation triggers
- [ ] Test retry mechanism
- [ ] Check code-review-expert integration
- [ ] Verify completion signals

#### 3.4 Subagent Workflow
- [ ] Test planner agent spawning
- [ ] Test executor agent spawning
- [ ] Test verifier agent spawning
- [ ] Verify context passing
- [ ] Check result aggregation

---

### 4. Documentation Accuracy Tests

#### 4.1 Link Verification
- [ ] All GitHub links point to Alot1z/get-shit-indexed
- [ ] No links to original TICHES repository
- [ ] All @-references resolve correctly
- [ ] No broken internal links

#### 4.2 Code Example Tests
- [ ] Command syntax examples work
- [ ] File paths in examples are correct
- [ ] MCP tool examples use correct syntax
- [ ] Workflow examples execute correctly

#### 4.3 Content Accuracy
- [ ] Documentation matches actual behavior
- [ ] No outdated information
- [ ] GSI branding consistent throughout
- [ ] Version numbers accurate

---

### 5. Brand Consistency Tests

#### 5.1 Search for Remaining GSD References
- [ ] Search "GSD|GSD|Get Shit Done|get-shit-done" in code
- [ ] Search "GSD|GSD" in documentation
- [ ] Search "GSD|GSD" in configuration files
- [ ] Verify only changelog/historical references found

#### 5.2 GSI Branding Verification
- [ ] README.md shows "GSI" prominently
- [ ] All commands use "gsi:" prefix
- [ ] All URLs point to Alot1z fork
- [ ] Package.json uses gsi naming
- [ ] Agent files use gsi-* naming
- [ ] Commands directory is gsi/ not gsd/

#### 5.3 Fork Migration Verification
- [ ] Repository URL: github.com/Alot1z/get-shit-indexed
- [ ] Homepage URL: github.com/Alot1z/get-shit-indexed
- [ ] Issues URL: github.com/Alot1z/get-shit-indexed/issues
- [ ] CHANGELOG links updated to fork

---

### 6. Integration Tests

#### 6.1 End-to-End Workflows
- [ ] New project creation (init → plan → execute)
- [ ] Phase completion (plan → execute → verify)
- [ ] Milestone archival
- [ ] State progression

#### 6.2 MCP Tool Chain Tests
- [ ] Golden pattern: CG → CI → CI → DC → DC → CI
- [ ] Sequential planning with CI
- [ ] Tractatus analysis with CG
- [ ] DesktopCommander file operations
- [ ] Thinking server integration

#### 6.3 Error Handling
- [ ] Missing MCP server handling
- [ ] Invalid command handling
- [ ] Plan structure validation
- [ ] Task failure recovery

---

## Test Execution Order

1. **Priority 1:** Brand Consistency Tests (Task 6)
   - Verify GSI transformation complete
   
2. **Priority 2:** CLI Command Tests (Task 2)
   - Test all commands with GSI branding
   
3. **Priority 3:** MCP Integration Tests (Task 3)
   - Verify all 3 MCP servers operational
   
4. **Priority 4:** Workflow Tests (Task 4)
   - Test core workflows
   
5. **Priority 5:** Documentation Tests (Task 5)
   - Verify accuracy and links

---

## Test Results Format

Each test will result in:
- **PASS** - Test completed successfully
- **FAIL** - Test failed, issue documented
- **SKIP** - Test skipped, reason documented

Results will be aggregated in TEST-RESULTS.md with:
- Total tests run
- Pass/fail counts
- Pass rate percentage
- Critical issues requiring fixes

---

## Success Criteria

- [ ] 100% of critical tests pass
- [ ] No remaining GSD references (except historical)
- [ ] All MCP servers operational
- [ ] All workflows functional
- [ ] Documentation accurate
- [ ] Pass rate >= 95%

---

## Test Execution

This plan will be executed by:
1. Running each test category sequentially
2. Documenting results in TEST-RESULTS.md
3. Fixing any critical issues found
4. Creating final test summary report
