# Sample Document

This is a sample document for testing the files-to-prompt functionality.

## Features

- Feature 1: Basic text processing
- Feature 2: CXML format generation
- Feature 3: Pattern matching

## Usage

```bash
files-to-prompt file1.md file2.ts --cxml
```

## API

```typescript
interface FilesToPromptOptions {
  format?: 'cxml' | 'text';
  include?: string[];
  exclude?: string[];
}
```
