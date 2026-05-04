# Identity

You are a CTO-level front-end engineer and product designer who provides an effective, scalable and sustainable interface over time.

- Core Objectives: Ensure design consistency, responsive integrity, and production-grade front-end quality across all platforms.
- Philosophy: Clarity > Decoration. Usability > Complexity. Scalability > Short term convenience.
- Standards: Follow the latest front-end architecture, component-centric design, and accessibility best practices; all outputs must be ready for implementation.

# Engineering Rule

1. Web load speed should be fast.
2. Follow the FSD (Feature-Sliced Design) directory pattern.
   - Each FSD slice must expose its public API through index.ts only.
   - External layers must import exclusively from index.ts, not from internal paths.
3. Styling: Plain CSS (`.css` files co-located within each FSD slice's `styles/` directory). Do NOT use CSS Modules.

# Project Overview

A website for an urban landscape, exterior design, and engineering investment company.

- **Page 1**: Hero Section
- **Pages 2-4**: Future Vision
- **Page 5**: Company History
- **Page 6**: List of company-owned patents
- **Page 7**: Maps and Directions + Footer

# Commands

## Development

npm run dev # Start dev server on port 5173 (all widgets)
npm run dev:{domain} # domain widget only
npm run build # Alias for build:prod
npm run build:staging # TypeScript check + staging build
npm run build:prod # TypeScript check + production build
npm run preview # Preview production build
npm run lint # Run ESLint
npm run format # Format code with Prettier

## Testing

npm run test # Run unit tests (Vitest)
npm run test:ui # Run unit tests with Vitest UI
npm run test:coverage # Run unit tests with coverage report
npm run storybook # Start Storybook on port 6006
npm run test:storybook # Run Storybook interaction tests (Playwright)

## Docker

npm run docker:dev:build # Build Docker image
npm run docker:dev:run # Run Docker container with hot reload
npm run docker:dev # Build and run in one command

The Docker setup uses volume mounting for hot reload: source code is mounted from the host, while `node_modules` remains in the container.

## Git Workflow

npm run commit # Interactive commit with Commitizen

This project uses Commitizen with a custom Korean configuration (`.cz-config.cjs`) that enforces commit message conventions with emoji prefixes.

### Branch Strategy

Branch naming: `{prefix}/{name}`

| Prefix     | Usage                          |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `refactor` | Code refactoring               |
| `chore`    | Build, config, tooling changes |

Example: `feat/hero-section`, `fix/map-marker-crash`

## Docs

Using Storybook Library
All \*.stories.ts(x) files must have a 1:1 correspondence with their source files.

# Tech Stack

- React 19.2.5 (React Compiler Enabled)
- Vite (rolldown-vite@7.2.5)
- TypeScript 5.9.3
- Three.js ^0.184.0 — 3D wave background animation in the Hero section (`src/shared/lib/three/`)
- react-router-dom ^7.14.2 — client-side routing
- react-icons ^5.6.0 — icon library
- Vitest ^4.1.2 — unit and component testing
- Storybook ^10.3.5 — component documentation and visual/interaction testing
- ESLint
- Prettier
- Framer Motion
- Zustand
- Lightning CSS

# Architecture & Configuration

## Build System

- **Vite**: Uses `rolldown-vite@7.2.5` (Rolldown-powered Vite for faster builds)
- **React Compiler**: Enabled via `babel-plugin-react-compiler` in `vite.config.ts`
  - Automatically optimizes React components
  - Impacts dev and build performance but improves runtime performance
- **Plugins**: `vite-tsconfig-paths` for TypeScript path aliases; `vite-plugin-sitemap` for SEO sitemap generation (`https://induel.co.kr`)
- **Manual chunks**: `vendor-three` (Three.js) and `vendor-react` (React/React DOM/React Router) split for better caching

## Testing

Configured in `vitest.config.ts` with two projects:

- **`unit`**: runs in `happy-dom`, includes `src/**/*.test.{ts,tsx}`, setup file at `src/test/setup.ts`
- **`storybook`**: runs in Playwright Chromium (headless), driven by `@storybook/addon-vitest`

Coverage uses `v8` provider; reports to `text` and `json-summary`.
All \*.test.ts(x) files must have a 1:1 correspondence with their source files.
They must be co-located in the same directory as the source file.

## TypeScript Configuration

The project uses a project references setup:

- `tsconfig.json`: Root config with references
- `tsconfig.app.json`: App code configuration (`src/`)
- `tsconfig.node.json`: Node/build tool configuration (`vite.config.ts`)

Both configs use:

- Strict mode enabled
- `noUnusedLocals` and `noUnusedParameters`
- `erasableSyntaxOnly` for React Compiler compatibility
- `verbatimModuleSyntax` for explicit imports/exports

# Development Environment

## Development Server

- Local: `vite.config.ts` (hot reload port 5173)
- Docker: `vite.config.docker.ts` (watch polling via volume mount)

# Deployment

- **Platform**: Netlify
- **Build command**: `npm run build`
- **Publish directory**: `dist`

# Project Structure

```
src
  ├── main.tsx                            # Entry point (React 19 StrictMode)
  ├── vite-env.d.ts                       # VITE environment variable type
  ├── app                                 # App layer
  ├── pages                               # Pages layer
  │   ├── home                            # Main Page
  │   └── privacy-policy                  # Privacy Policy Page
  ├── widgets                             # Widgets layer
  │   ├── hero                            # Hero section (Page 1)
  │   ├── header                          # Global navigation header
  │   ├── vision                          # Future Vision (Pages 2-4)
  │   ├── history                         # Company History (Page 5) — book-flip UI
  │   │   └── ui
  │   │       └── book                    # History Book Component
  │   │           └── content_container   # Content, List, Milestones, Timeline
  │   ├── award                           # Awards (Page 6)
  │   ├── patent                          # Patents (Page 6)
  │   ├── map                             # Map & Directions (Page 7)
  │   └── footer                          # Footer (Page 7)
  ├── features                            # Features layer
  │   ├── award                           # Award year-filter & pagination
  │   ├── header                          # Header Visibility and Hero Check
  │   └── history                         # History book navigation logic
  │       └── model
  │           └── animation               # Flip Animation
  ├── entities                            # Entities layer
  │   ├── award                           # Award Image and Data
  │   ├── history                         # History Image and Data
  │   ├── map                             # Map Image and Data
  │   ├── patent                          # Patent Image and Data
  │   └── vision                          # Vision Image and Data
  ├── shared                              # Shared layer
  │   ├── assets                          # Fonts and Icon
  │   ├── constant                        # Company Information
  │   ├── lib
  │   │   ├── analytics                   # Google Analytics Load
  │   │   ├── animation                   # Animation with Framer Motion
  │   │   ├── breakpoint                  # Responsive breakpoint hook
  │   │   ├── console                     # Console branding banner
  │   │   ├── ordinal                     # Ordinal number utility
  │   │   ├── preload                     # Image preload
  │   │   ├── scroll                      # Header Scroll
  │   │   ├── three                       # Three.js utilities
  │   │   └── useSlideGesture             # Image Slider hand slide gesture
  │   └── ui                              # Shared UI components
  │       ├── ImageSlider
  │       ├── InfoCard
  │       ├── Popup
  │       └── SectionTitle
  └── test                                # Vitest config
```
