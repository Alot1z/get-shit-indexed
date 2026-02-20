# Authentication

This document describes Authentication Patterns.

## Overview

Authentication is the process of verifying identity.

## Patterns

### Pattern 1: Token-based

```javascript
const token = generateToken(user);
```

### Pattern 2: Session-based

```javascript
const session = createSession(user);
```

## Best Practices

1. Always use HTTPS
2. Store tokens securely
3. Implement token refresh
