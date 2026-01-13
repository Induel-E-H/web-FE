# CLAUDE.md

## Project Overview

- FrontEnd Tech Stack: React + TypeScript + Vite + React Compiler. The project uses Rolldown-Vite (a faster alternative to standard Vite) and is configured with strict TypeScript.

## Development Commands

### Local Development

```bash
npm run dev              # Start dev server on port 5173
npm run build            # TypeScript check + production build
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

### Docker Development

```bash
npm run docker:dev:build # Build Docker image
npm run docker:dev:run   # Run Docker container with hot reload
npm run docker:dev       # Build and run in one command
```

The Docker setup uses volume mounting for hot reload: source code is mounted from the host, while `node_modules` remains in the container.

### Git Workflow

```bash
npm run commit           # Interactive commit with Commitizen
```

This project uses Commitizen with a custom Korean configuration (`.cz-config.cjs`) that enforces commit message conventions with emoji prefixes:

- ✨ feat: 기능 추가
- 👹 fix: 버그 수정
- 🔨 refactor: 구조 변경
- ⚡️ perf: 성능 개선
- 📝 docs: 문서 수정
- ✅ test: 테스트 코드
- ⚙️ chore: 개발 환경 구축
- 🧹 clean: 코드 정리

## Architecture & Configuration

- Using FSD Patterns

### Build System

- **Vite**: Uses `rolldown-vite@7.2.5` (Rolldown-powered Vite for faster builds)
- **React Compiler**: Enabled via `babel-plugin-react-compiler` in vite.config.ts
  - Automatically optimizes React components
  - Impacts dev and build performance but improves runtime performance

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

## Important Notes

### React Version

- Uses React 19.2.0 (latest)
- Components are wrapped in StrictMode
- React Compiler is active (automatic memoization)

### When Making Changes

- TypeScript strict mode is enforced - all types must be explicit

# Company Overview

## Core Characteristics

- Industry: Investment, Urban Landscape & Exterior Design
- Background: Interior Architecture & Exhibition Design
- Orientation: Progressive, growth-driven, innovation-focused
- Design Preference: Soft, curved, fluid forms over rigid straight lines

# Design Directives

## Page Structure

- The first page must be a Hero Section that delivers strong visual impact.
- The hero area should immediately communicate brand identity and vision.

## Visual Priority

- Prioritize icons, illustrations, and imagery over long text.
- When text is used, it must be: Short, Highly emphasized, Message-driven

## Form Language

- Use curved lines and organic shapes as the primary structural elements.
- Avoid excessive straight or sharp geometry.

## Spatial Expression

- Prefer three-dimensional and layered designs over flat layouts.
- Create a sense of depth, scale, and spatial expansion.

## Motion & Interaction

- Avoid static composition.
- Use animation and transitions to express activity, innovation, and flow.

## Layout & Spacing

- Apply wide spacing between components.
- The overall layout should feel: Open, Breathable, Premium, Unconstrained
