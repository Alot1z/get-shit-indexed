# Code Review Troubleshooting

## Overview

This document provides troubleshooting guidance for common code review issues.

## Common Issues

### Issue 1: Review Fails Unexpectedly

**Possible Causes:**
- Review scope too broad
- False positive in pattern matching
- Outdated review criteria

**Solutions:**
1. Narrow review scope to specific files
2. Update pattern rules in criteria
3. Adjust strictness level
4. Check for project-specific conventions

**Example:**
```
Problem: Review fails due to naming convention violations
Root Cause: Project uses camelCase but review expects snake_case
Solution: Add project-specific naming exception to criteria
```

### Issue 2: Review Takes Too Long

**Possible Causes:**
- Too many files in review scope
- Comprehensive depth when quick sufficient
- Inefficient file access (not using DesktopCommander)

**Solutions:**
1. Reduce review scope to changed files only
2. Use quick review mode instead of standard/comprehensive
3. Ensure DesktopCommander MCP integration for file access
4. Batch files using read_multiple_files

**Example:**
```
Problem: Review takes 15+ minutes
Root Cause: Reviewing entire codebase instead of changed files
Solution: Scope review to files in completion signal only
```

### Issue 3: False Positives

**Possible Causes:**
- Pattern matching errors
- Outdated rules
- Project-specific conventions not accounted for

**Solutions:**
1. Update pattern rules to match project conventions
2. Add project-specific exceptions to criteria
3. Adjust regex patterns to reduce false matches
4. Whitelist known patterns

**Example:**
```
Problem: Review flags valid API calls as "missing error handling"
Root Cause: Review doesn't recognize wrapper functions that handle errors
Solution: Add wrapper functions to "known error handlers" list
```

### Issue 4: Skill Invocation Fails

**Possible Causes:**
- Skill not available
- Wrong parameters
- Context too large
- Network issues

**Solutions:**
1. Verify code-review-expert skill is installed
2. Check parameter names and values
3. Reduce context size (review fewer files)
4. Check MCP server connectivity

**Example:**
```
Problem: "code-review-expert skill not found"
Root Cause: Skill not installed in skills directory
Solution: Install skill from skills repository
```

### Issue 5: Review Doesn't Catch Issues

**Possible Causes:**
- Strictness too low
- Criteria incomplete
- Scope too narrow
- Missing gate checks

**Solutions:**
1. Increase strictness to "standard" or "strict"
2. Update criteria to cover more cases
3. Expand scope to include related files
4. Enable all 7 gates

**Example:**
```
Problem: Security vulnerability not detected
Root Cause: Security checks not enabled for this file type
Solution: Add security criteria to gate 1 (Method Circle)
```

### Issue 6: Output Format Incorrect

**Possible Causes:**
- Template version mismatch
- Custom formatting overrides
- Missing required fields

**Solutions:**
1. Update to latest template version
2. Check for custom output format overrides
3. Verify all required fields present
4. Regenerate output from template

**Example:**
```
Problem: Missing quality score in review output
Root Cause: Using old template format
Solution: Update to templates from code-review-templates.md
```

### Issue 7: Token Usage Too High

**Possible Causes:**
- Not using compressed skills
- Using native tools instead of MCP
- Reading files individually instead of batch
- Not using DesktopCommander

**Solutions:**
1. Always use code-review-expert skill (compressed)
2. Use DesktopCommander MCP for file access
3. Batch file reads with read_multiple_files
4. Scope review to necessary files only

**Example:**
```
Problem: Review uses 50K tokens
Root Cause: Using native Read tool for each file
Solution: Use mcp__desktop-commander__read_multiple_files
Expected savings: ~80-90% (5K tokens instead of 50K)
```

### Issue 8: Gate Evaluation Inconsistent

**Possible Causes:**
- Different criteria applied to same gate
- Reviewer variance
- Context not properly loaded
- Cache issues

**Solutions:**
1. Ensure same criteria applied consistently
2. Use automated skill instead of manual review
3. Verify context loaded correctly
4. Clear cache and re-run

**Example:**
```
Problem: Same code passes one time, fails another
Root Cause: Different strictness levels applied
Solution: Lock strictness to "standard" in config
```

## Debug Mode

Enable verbose output for troubleshooting:

```json
{
  "code_review": {
    "debug": true,
    "verbose": true,
    "log_invocations": true,
    "log_decisions": true
  }
}
```

### Debug Output Includes

- Skill invocation details
- File access operations
- Criteria evaluation results
- Decision rationale
- Token usage per operation

## Getting Help

### Information to Collect

When reporting issues, collect:

1. Review configuration (strictness, depth, scope)
2. Files being reviewed
3. Error messages or unexpected results
4. Token usage
5. MCP server status
6. Debug output (if available)

### Where to Get Help

- Check @references/code-review-criteria.md for criteria details
- Check @references/code-review-workflow.md for workflow details
- Check @references/code-review-templates.md for output format
- Review validation logs in `.debug-thinking-mcp/`

## Prevention

### Best Practices to Avoid Issues

1. **Always use skills** - Never manual review
2. **Use DesktopCommander** - For all file access
3. **Scope appropriately** - Only review changed files
4. **Use standard depth** - Unless comprehensive needed
5. **Keep criteria updated** - Reflect project conventions
6. **Test review system** - Verify on known good code
7. **Monitor metrics** - Track pass rates and token usage

### Regular Maintenance

1. Update criteria as project evolves
2. Review and adjust patterns quarterly
3. Add project-specific exceptions
4. Archive old review results
5. Analyze metrics for trends

## Quick Reference

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| Review fails unexpectedly | Scope too broad / False positive | Narrow scope / Adjust criteria |
| Review takes too long | Too many files / Not using MCP | Reduce files / Use DesktopCommander |
| False positives | Pattern error / Outdated rules | Update patterns / Add exceptions |
| Skill not found | Skill not installed | Install code-review-expert skill |
| Issues not caught | Strictness too low / Scope narrow | Increase strictness / Expand scope |
| High token usage | Not using MCP / Reading individually | Use DesktopCommander / Batch reads |
| Inconsistent results | Different strictness / Cache | Lock strictness / Clear cache |

## References

- @references/code-review-criteria.md - Detailed review criteria
- @references/code-review-workflow.md - Review workflow
- @references/code-review-templates.md - Output templates
- @references/validation-config.md - Configuration options

---

**Version**: 1.0  
**Last Updated:** 2026-02-13  
**Status**: Active
