# Authentication Patterns

This document describes common authentication patterns.

## JWT Authentication

```typescript
interface JWTPayload {
  userId: string;
  exp: number;
  iat: number;
}

function verifyToken(token: string): JWTPayload {
  // Implementation
}
```

## OAuth2 Flow

1. User redirects to authorization server
2. User grants permission
3. Server returns authorization code
4. Client exchanges code for access token

## Session Management

```typescript
class SessionManager {
  createSession(userId: string): Session;
  validateSession(sessionId: string): boolean;
  destroySession(sessionId: string): void;
}
```
