# Contributing to Get Shit Indexed (GSI)

Thank you for your interest in contributing to GSI! This document provides guidelines and instructions for contributing.

## Repository Information

This is the **Alot1z/get-shit-indexed** fork of the GSI project. All contributions should be submitted to this repository.

- **GitHub**: https://github.com/Alot1z/get-shit-indexed
- **Issues**: https://github.com/Alot1z/get-shit-indexed/issues
- **Pull Requests**: https://github.com/Alot1z/get-shit-indexed/pulls

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/get-shit-indexed.git
cd get-shit-indexed
```

3. Install dependencies:

```bash
npm install
```

4. Install GSI locally for testing:

```bash
node bin/install.js --claude --local
```

This installs to `./.claude/` for testing modifications.

## Making Changes

### Branch Naming

Create a feature branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-new-workflow`
- `fix/agent-timeout-issue`
- `docs/update-readme`

### Code Style

- Use consistent formatting with the existing codebase
- Follow existing naming conventions
- Keep functions focused and readable
- Add comments for complex logic

### Commit Messages

Follow this format:

```
type(scope): brief description

- Detailed change 1
- Detailed change 2

SUMMARY: One-line summary for changelog
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Testing Your Changes

1. Test the installer:
```bash
node bin/install.js --claude --local
```

2. Verify commands work in Claude Code:
```
/GSI:help
/GSI:progress
```

3. Test your specific changes thoroughly

## Submitting Changes

### Pull Request Process

1. Push your changes to your fork:
```bash
git push origin feature/your-feature-name
```

2. Open a Pull Request against `Alot1z/get-shit-indexed`

3. Include in your PR description:
   - What changes you made
   - Why you made them
   - How to test them
   - Any breaking changes

### PR Requirements

- All existing functionality must continue to work
- New features should include documentation
- Follow the existing code style
- Keep changes focused (one feature/fix per PR)

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. GSI version (check with `/GSI:help`)
2. Claude Code version
3. Operating system
4. Steps to reproduce
5. Expected behavior
6. Actual behavior
7. Any error messages

### Feature Requests

For feature requests, describe:

1. The problem you're trying to solve
2. Your proposed solution
3. Any alternatives you've considered
4. How it would benefit GSI users

## Project Structure

```
get-shit-indexed/
├── bin/                    # Installer scripts
│   └── install.js          # Main installation script
├── commands/               # Slash command definitions
│   └── gsi/               # GSI commands
├── agents/                 # Agent definitions
├── hooks/                  # Claude Code hooks
├── workflows/              # Workflow markdown files
├── templates/              # Plan and summary templates
├── references/             # Reference documentation
├── prompts/                # System prompts
├── assets/                 # Images and logos
└── .planning/              # Project planning (git-tracked)
```

## MCP Integration

GSI integrates with two MCP servers:

- **Desktop Commander (DC)**: File operations, process management
- **Code Index MCP (CI)**: Code search, symbol navigation, file summaries

When contributing features that involve file operations or code analysis, consider using these MCP tools for optimal performance.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Celebrate contributions of all sizes

## License

By contributing to GSI, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make GSI better!
