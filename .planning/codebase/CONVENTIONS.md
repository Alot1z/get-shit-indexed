# Coding Conventions

**Analysis Date:** 2025-02-11

## File Organization

**Project Structure:**
```
.root/
├── .planning/          # Planning artifacts
│   ├── codebase/      # Codebase analysis documents
│   ├── phases/        # Phase implementation artifacts
│   └── config.json    # Project configuration
├── references/         # Reference materials and guides
├── templates/         # Code and documentation templates
├── workflows/         # Workflow definitions
└── prompts/          # Custom prompts and instructions
```

**Document Naming:**
- Use kebab-case for files: `config.json`, `verification-patterns.md`
- UPPERCASE.md for planning documents: `CONVENTIONS.md`, `TESTING.md`
- Phase artifacts: `XX-name-PLAN.md`, `XX-name-SUMMARY.md`

## Code Style

**File Extensions:**
- JavaScript: `.js`
- TypeScript: `.ts`, `.tsx`
- Markdown: `.md`
- JSON: `.json`

**Indentation & Formatting:**
- Use tabs for indentation (as seen in configuration files)
- Line length: 80 characters maximum
- Trailing commas in arrays and objects
- 2-space indentation for nested structures

**Tool Priority (MANDATORY):**
1. **Skills FIRST** - Pre-compressed, maximum efficiency
2. **DesktopCommander MCP SECOND** - For file I/O and process operations
3. **Other MCP Tools THIRD** - Medium efficiency
4. **Native Tools LAST** - Only as fallback

```javascript
// ✅ Correct - Using DesktopCommander skill
skill: "desktop-commander"

// ✅ Correct - Using MCP code search
mcp__code-index-mcp__search_code_advanced: {
  pattern: "function foo",
  file_pattern: "*.ts"
}

// ❌ Incorrect - Using native Grep
Grep: { pattern: "function foo", path: "src/" }
```

## Naming Patterns

**Files:**
- Use kebab-case: `tool-priority-rules.md`, `verification-patterns.md`
- Configuration: `config.json`, `package.json`
- Documentation: `README.md`, `CONVENTIONS.md`

**Functions & Variables:**
- Use camelCase: `getUserData`, `isValidEmail`
- Constants: UPPER_SNAKE_CASE: `MAX_RETRIES`, `API_ENDPOINT`

**Components:**
- PascalCase: `UserProfile`, `MessageList`
- Hook files: `useAuth.ts`, `useCart.ts`

**API Routes:**
- Use HTTP method naming: `getUsers.ts`, `createPost.ts`
- App Router: `route.ts` files with export functions

## Commenting Patterns

**Documentation Comments:**
```typescript
/**
 * Validates an email address
 * @param email - Email string to validate
 * @returns True if valid, false otherwise
 */
function isValidEmail(email: string): boolean
```

**Inline Comments:**
- Use for complex logic explanations
- No comments for obvious code
- // Comments for single lines
- /* */ for multi-line blocks

**TODO/FIXME Comments:**
- Track in verification patterns
- Require implementation before release

## Error Handling

**Consistent Error Handling Pattern:**
```typescript
try {
  // Risky operation
} catch (error) {
  console.error('Operation failed:', error.message)
  // Handle gracefully
}
```

**API Error Response Format:**
```typescript
return Response.json(
  { error: 'Message', details: { field: 'specific' } },
  { status: 400 }
)
```

**Validation Errors:**
- Use Zod or similar for input validation
- Return specific error messages
- Include field names for client handling

## Configuration Management

**Environment Variables:**
- Use `.env` and `.env.local`
- Validate with schema (if using Zod)
- Never commit sensitive values

**Config Files:**
- JSON for structured data
- Keep minimal, focused configuration
- Document required fields

## API Patterns

**Request/Response Format:**
```typescript
// POST request body
{
  data: {
    field1: string,
    field2: number
  }
}

// Response format
{
  success: boolean,
  data?: any,
  error?: string,
  metadata?: {
    timestamp: string,
    requestId: string
  }
}
```

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Database Patterns

**Schema First:**
- Define schema before implementation
- Use Prisma/Drizzle with TypeScript
- Include migrations for versioning

**Naming Conventions:**
- Models: PascalCase (User, Message)
- Fields: camelCase (userId, createdAt)
- Relations: Clear naming (userMessages, postComments)

## Testing Conventions

**Test File Locations:**
- Co-located: `service.test.ts` next to `service.ts`
- Directory: `__tests__/` or `tests/`
- Component tests: `Component.test.tsx`

**Test Naming:**
- Descriptive: `shouldAcceptValidEmails`, `rejectsEmptyInput`
- Prefix: `test(` or `describe(` for grouping
- No generic names like `test1`

## Git Patterns

**Commit Messages:**
- Format: `{type}({phase}-{plan}): {description}`
- Type: feat, fix, test, refactor, docs
- Example: `feat(08-01): implement user authentication`

**Branch Strategy:**
- Main: Always deployable
- Feature branches: `feature/XX-name`
- Hotfix: `hotfix/issue-desc`

## Security Patterns

**Environment Variables:**
- Never hardcode secrets
- Use validation schemas
- Document required variables

**Input Sanitization:**
- Validate all user input
- Use parameterized queries
- Escape output where needed

**Authentication:**
- Use established patterns (NextAuth, Supabase Auth)
- JWT with proper expiration
- Secure cookie configuration

## Performance Patterns

**Caching:**
- Cache database queries where appropriate
- Use Redis for session storage
- Implement CDN for static assets

**Code Splitting:**
- Dynamic imports for large components
- Route-based code splitting
- Lazy load non-critical features

## Documentation Requirements

**README.md:**
- Project overview
- Installation instructions
- Usage examples
- Contributing guidelines

**API Documentation:**
- Endpoint descriptions
- Request/response examples
- Authentication requirements
- Error codes

**Code Comments:**
- Explain "why" not "what"
- Document edge cases
- Include examples for complex functions

---

*Convention analysis: 2025-02-11*