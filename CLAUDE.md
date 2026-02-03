# CLAUDE.md

## Project Overview

A website for an urban landscape, interior design, and engineering investment company.

- **Page 1**: Hero section
- **Pages 2–4**: Future vision
- **Page 5**: Company history
- **Page 6**: List of company-owned patents
- **Page 7**: Map followed by footer

## Development Commands

### Local Development

npm run dev # Start dev server on port 5173
npm run build # TypeScript check + production build
npm run preview # Preview production build
npm run lint # Run ESLint
npm run format # Format code with Prettier

### Docker Development

npm run docker:dev:build # Build Docker image
npm run docker:dev:run # Run Docker container with hot reload
npm run docker:dev # Build and run in one command

The Docker setup uses volume mounting for hot reload: source code is mounted from the host, while `node_modules` remains in the container.

### Git Workflow

npm run commit # Interactive commit with Commitizen

This project uses Commitizen with a custom Korean configuration (`.cz-config.cjs`) that enforces commit message conventions with emoji prefixes:

## Architecture & Configuration

- Using FSD Patterns

### Build System

- **Vite**: Uses `rolldown-vite@7.2.5` (Rolldown-powered Vite for faster builds)
- **React Compiler**: Enabled via `babel-plugin-react-compiler` in vite.config.ts
  - Automatically optimizes React components
  - Impacts dev and build performance but improves runtime performance

# Tech Stack

- React 19.2.0 (React Compiler Enabled)
- Vite (rolldown-vite@7.2.5)
- TypeScript 5.9.3
- ESLint
- Prettier

### TypeScript Configuration

The project uses a project references setup:

- `tsconfig.json`: Root config with references
- `tsconfig.app.json`: App code configuration (src/)
- `tsconfig.node.json`: Node/build tool configuration (vite.config.ts)

Both configs use:

- Strict mode enabled
- `noUnusedLocals` and `noUnusedParameters`
- `erasableSyntaxOnly` for React Compiler compatibility
- `verbatimModuleSyntax` for explicit imports/exports

### Git Hooks

- **Pre-commit**: Runs `lint-staged` which auto-formats all staged files with Prettier

### Development Server

Vite dev server (vite.config.ts:13-19):

- Exposed on all network interfaces (`host: true`)
- Port 5173
- Polling enabled for file watching (useful for Docker/WSL)

## Project Structure

```
src/
  ├── main.tsx          # Entry point (React 19 StrictMode)
  ├── App.tsx           # Root component
  ├── App.css           # App styles
  ├── index.css         # Global styles
  └── assets/           # Static assets
```

Currently a minimal setup - the codebase is in early stages with boilerplate React + Vite structure.

# Reference Docs

| File                             | Authority                                   |
| -------------------------------- | ------------------------------------------- |
| agent_docs/design_instruction.md | Design Contracts, Reference for Design Work |
