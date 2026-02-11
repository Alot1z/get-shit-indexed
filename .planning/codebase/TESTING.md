# Testing Patterns

**Analysis Date:** 2025-02-11

## Testing Philosophy

**Core Principle:** Test behavior, not implementation. If the implementation changes but behavior remains the same, tests should still pass.

**TDD Approach:** Use TDD for features with clear inputs/outputs. Test business logic, validation rules, and algorithms.

**When to Test:**
- Business logic with defined specifications
- API endpoints with request/response contracts
- Data transformations and utilities
- Validation rules and constraints
- Authentication and authorization flows

**When NOT to Test:**
- Simple UI components (visual testing)
- Configuration changes
- One-off scripts
- Exploratory prototypes

## Test Framework Setup

**Project Detection:**
```javascript
// Auto-detect framework from project files
if (package.json) use(Jest/Vitest)
if (requirements.txt) use(pytest)
if (go.mod) use(go test)
if (Cargo.toml) use(cargo test)
```

**Installation Commands:**
```bash
# Node.js with Jest
npm install -D jest @types/jest ts-jest

# Node.js with Vitest
npm install -D vitest

# Python
pip install pytest

# Go (built-in)
go test ./...

# Rust (built-in)
cargo test
```

**Configuration Files:**
- Jest: `jest.config.js` with ts-jest preset
- Vitest: `vitest.config.ts` with test globals
- pytest: `pytest.ini` or `pyproject.toml` section

## Test Structure

**File Organization:**
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── __tests__/        # Alternative structure
│       └── Button.test.tsx
├── services/
│   ├── auth.service.ts
│   └── auth.service.test.ts
└── utils/
    ├── validators.ts
    └── validators.test.ts
```

**Test File Naming:**
- Co-located: `Component.test.tsx` next to `Component.tsx`
- Test directory: `__tests__/` or `tests/`
- Unit tests: `*.test.ts`
- Integration tests: `*.spec.ts`

## Testing Patterns

### Component Testing

**Basic Component Test:**
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

**Required Elements Test:**
```typescript
it('renders all required elements', () => {
  render(<UserProfile user={mockUser} />)
  
  // Check required elements exist
  expect(screen.getByRole('img')).toBeInTheDocument()  // Avatar
  expect(screen.getByText(mockUser.name)).toBeInTheDocument()
  expect(screen.getByText(mockUser.email)).toBeInTheDocument()
})
```

**Error State Test:**
```typescript
it('shows error message on failure', () => {
  const { container } = render(<UserProfile user={null} />)
  
  // Check error message
  expect(screen.getByText('User not found')).toBeInTheDocument()
  
  // Check required elements are NOT present
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})
```

### API Testing

**API Route Test:**
```typescript
import { GET, POST } from './api/users/route'
import { prisma } from '@/lib/prisma'

describe('/api/users', () => {
  beforeEach(() => {
    // Mock database
    jest.mock('@/lib/prisma')
  })

  it('GET returns user list', async () => {
    const mockUsers = [{ id: 1, name: 'John' }]
    prisma.user.findMany.mockResolvedValue(mockUsers)
    
    const response = await GET()
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({ data: mockUsers })
  })

  it('POST creates new user', async () => {
    const userData = { name: 'Jane', email: 'jane@test.com' }
    prisma.user.create.mockResolvedValue({ ...userData, id: 2 })
    
    const response = await POST(new Request('', {
      method: 'POST',
      body: JSON.stringify(userData)
    }))
    
    expect(response.status).toBe(201)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: userData
    })
  })
})
```

**Input Validation Test:**
```typescript
it('rejects invalid input', async () => {
  const invalidData = { name: '' }
  const response = await POST(new Request('', {
    method: 'POST',
    body: JSON.stringify(invalidData)
  }))
  
  expect(response.status).toBe(400)
  const data = await response.json()
  expect(data.error).toBe('Validation failed')
})
```

### Utility Testing

**Function Test:**
```typescript
import { isValidEmail, formatDate } from './utils'

describe('utils', () => {
  describe('isValidEmail', () => {
    it('accepts valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user+tag@domain.co.uk')).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
    })
  })

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = new Date('2023-01-01T00:00:00Z')
      expect(formatDate(date)).toBe('Jan 1, 2023')
    })
  })
})
```

### Integration Testing

**Service Integration Test:**
```typescript
import { AuthService } from './auth.service'
import { DatabaseService } from './database.service'

describe('auth service integration', () => {
  let authService: AuthService
  let dbService: DatabaseService

  beforeEach(() => {
    dbService = new DatabaseService()
    authService = new AuthService(dbService)
  })

  it('creates user and logs in', async () => {
    // Create user
    await authService.register('test@example.com', 'password')
    
    // Login
    const result = await authService.login('test@example.com', 'password')
    expect(result.success).toBe(true)
    expect(result.user?.email).toBe('test@example.com')
  })
})
```

## Mocking Patterns

**Dependency Mocking:**
```typescript
jest.mock('@/lib/database', () => ({
  query: jest.fn(),
  connect: jest.fn()
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}))
```

**API Response Mocking:**
```typescript
const mockApiResponse = {
  data: {
    users: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ]
  }
}

fetch.mockImplementation(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  })
)
```

**Timer Mocking:**
```typescript
jest.useFakeTimers()
jest.setSystemTime(new Date('2023-01-01'))

// Test code that uses Date.now()

jest.useRealTimers()
```

## Testing Utilities

**Custom Test Helpers:**
```typescript
// test-utils.tsx
import { render } from '@testing-library/react'
import { Providers } from '@/app/providers'

function renderWithProviders(ui: React.ReactNode) {
  return render(<Providers>{ui}</Providers>)
}

// test-setup.ts
beforeEach(() => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    }
  })
})
```

**Test Data Fixtures:**
```typescript
// __tests__/fixtures.ts
export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date('2023-01-01')
}

export const mockPost = {
  id: 1,
  title: 'Test Post',
  content: 'Hello world',
  authorId: 1
}
```

## Running Tests

**Development:**
```bash
npm test              # Run tests in watch mode
npm test -- --watch   # Explicit watch mode
npm test -- --verbose # Show verbose output
```

**CI/CD:**
```bash
npm test -- --coverage    # Run with coverage
npm test -- --watchAll=false  # Run once
npm test -- --testPathPattern="auth"  # Run specific tests
```

## Coverage Requirements

**Minimum Coverage:**
- Unit tests: 80%
- Integration tests: 70%
- Critical paths: 95%

**Coverage Configuration:**
```json
// jest.config.js
{
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

## Test Commands

**Test Commands Summary:**
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="click"

# Run tests in CI mode
npm run test:ci
```

## TDD Implementation Pattern

**RED Phase - Write failing test:**
```typescript
describe('email validation', () => {
  it('should reject empty email', () => {
    expect(isValidEmail('')).toBe(false)
  })
  
  it('should reject invalid format', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
  })
})
```

**GREEN Phase - Implement to pass:**
```typescript
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}
```

**REFACTOR Phase - Clean up:**
```typescript
// Extract regex constant if needed
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}
```

## Test Quality Guidelines

**Good Tests:**
- One concept per test
- Descriptive names
- Test observable behavior
- Don't mock implementation details
- Test both happy and sad paths

**Bad Tests:**
- Generic names like "test works"
- Test implementation details
- Multiple assertions in one test
- Missing error handling tests
- Hardcoded values where dynamic expected

**Test Naming Conventions:**
```typescript
// ✅ Good
describe('User authentication', () => {
  it('should reject invalid credentials')
  it('should generate JWT on successful login')
  it('should require authentication for protected routes')
})

// ❌ Bad
describe('auth', () => {
  it('test login')
  it('handle errors')
  it('test case 1')
})
```

## Continuous Integration

**Test Pipeline:**
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

*Testing analysis: 2025-02-11*