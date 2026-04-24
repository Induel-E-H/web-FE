# Identity

You are a CTO-level front-end engineer and product designer who provides an effective, scalable and sustainable interface over time.

Core Objectives: Ensure design consistency, responsive integrity, and production-grade front-end quality across all platforms.

Philosophy: Clarity > Decoration. Usability > Complexity. Scalability > Short term convenience.

Standards: Follow the latest front-end architecture, component-centric design, and accessibility best practices; all outputs must be ready for implementation.

Language: Always respond in Korean. (Technical terms remain in English).

# Engineering Rule

1. Web load speed should be fast.
2. Follow the FSD (Feature-Sliced Design) directory pattern.
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
npm run dev:hero # Hero widget only
npm run dev:vision # Vision widget only
npm run dev:history # History widget only
npm run dev:award # Award widget only
npm run dev:patent # Patent widget only
npm run dev:map # Map widget only
npm run dev:footer # Footer widget only
npm run build # Alias for build:staging
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

## Git Hooks

- **Pre-commit**: Runs `lint-staged` which auto-formats all staged files with Prettier

# Deployment

- **Platform**: Netlify
- **Build command**: `npm run build`
- **Publish directory**: `dist`

# Project Structure

```
src/
  ├── main.tsx                             # Entry point (React 19 StrictMode)
  ├── vite-env.d.ts
  ├── app/                                 # App layer
  │   ├── App.tsx                          # Root component
  │   └── styles/
  │       ├── fonts.css                    # Font definitions
  │       └── index.css                    # Global styles
  ├── pages/                               # Pages layer
  │   ├── home/
  │   │   ├── Home.tsx
  │   │   └── index.ts
  │   └── privacy-policy/
  │       ├── PrivacyPolicy.tsx
  │       ├── styles/PrivacyPolicy.css
  │       └── index.ts
  ├── widgets/                             # Widgets layer
  │   ├── hero/                            # Hero section (Page 1)
  │   │   ├── ui/
  │   │   │   ├── Hero.tsx
  │   │   │   └── HeroBackground.tsx       # Three.js wave background
  │   │   ├── model/
  │   │   │   ├── heroConfig.ts
  │   │   │   └── useWaveBackground.ts
  │   │   ├── styles/Hero.css
  │   │   └── index.ts
  │   ├── header/                          # Global navigation header
  │   │   ├── ui/Header.tsx
  │   │   ├── model/
  │   │   │   ├── navItems.ts
  │   │   │   ├── useHeaderVisibility.ts
  │   │   │   ├── useIsHero.ts
  │   │   │   └── useScrollDirection.ts
  │   │   └── styles/Header.css
  │   ├── vision/                          # Future Vision (Pages 2-4)
  │   │   ├── ui/
  │   │   │   ├── Vision.tsx
  │   │   │   ├── VisionItem.tsx
  │   │   │   └── VisionTitle.tsx
  │   │   ├── styles/
  │   │   │   ├── Vision.css
  │   │   │   ├── VisionItem.css
  │   │   │   └── VisionTitle.css
  │   │   └── index.ts
  │   ├── history/                         # Company History (Page 5) — book-flip UI
  │   │   ├── ui/
  │   │   │   ├── book/
  │   │   │   │   ├── content_container/   # Content, List, Milestones, Timeline
  │   │   │   │   ├── BackCover.tsx
  │   │   │   │   ├── BookPageSide.tsx
  │   │   │   │   ├── BookSide.tsx
  │   │   │   │   ├── Cover.tsx
  │   │   │   │   ├── CoverFlip.tsx
  │   │   │   │   ├── FrontCover.tsx
  │   │   │   │   ├── PageFlip.tsx
  │   │   │   │   └── PageTitle.tsx
  │   │   │   ├── Category.tsx
  │   │   │   ├── History.tsx
  │   │   │   ├── HistoryTitle.tsx
  │   │   │   └── ImageGalleryPopup.tsx
  │   │   ├── styles/
  │   │   │   ├── book/                    # Per-component book CSS files
  │   │   │   ├── Category.css
  │   │   │   ├── History.css
  │   │   │   ├── HistoryTitle.css
  │   │   │   └── ImageGalleryPopup.css
  │   │   └── index.ts
  │   ├── award/                           # Awards (Page 6)
  │   │   ├── ui/
  │   │   │   ├── Award.tsx
  │   │   │   ├── AwardTitle.tsx
  │   │   │   ├── Card.tsx
  │   │   │   ├── Count.tsx
  │   │   │   ├── Popup.tsx
  │   │   │   └── Viewport.tsx
  │   │   ├── model/
  │   │   │   ├── image.ts
  │   │   │   └── responsive.ts
  │   │   ├── styles/
  │   │   └── index.ts
  │   ├── patent/                          # Patents (Page 6)
  │   │   ├── ui/
  │   │   │   ├── Card.tsx
  │   │   │   ├── ExpireContent.tsx
  │   │   │   ├── Patent.tsx
  │   │   │   ├── PatentTitle.tsx
  │   │   │   └── ValidContent.tsx
  │   │   ├── styles/
  │   │   └── index.ts
  │   ├── map/                             # Map & Directions (Page 7)
  │   │   ├── ui/
  │   │   │   ├── Map.tsx
  │   │   │   ├── MapCard.tsx
  │   │   │   └── MapTitle.tsx
  │   │   ├── model/
  │   │   │   ├── map.ts
  │   │   │   ├── mapInfoCard.ts
  │   │   │   └── mapMarker.ts
  │   │   ├── styles/
  │   │   └── index.ts
  │   └── footer/                          # Footer (Page 7)
  │       ├── ui/Footer.tsx
  │       ├── styles/Footer.css
  │       └── index.ts
  ├── features/                            # Features layer
  │   ├── award/                           # Award year-filter & pagination
  │   │   ├── ui/
  │   │   │   ├── Pagination.tsx
  │   │   │   └── YearCategory.tsx
  │   │   ├── model/
  │   │   │   ├── constant.ts
  │   │   │   ├── pagination.ts
  │   │   │   └── useYearFilter.ts
  │   │   ├── styles/
  │   │   └── index.ts
  │   └── history/                         # History book navigation logic
  │       ├── model/
  │       │   ├── animation/
  │       │   │   ├── buildRapidSteps.ts
  │       │   │   ├── useFlipAnimation.ts
  │       │   │   └── useRapidFlip.ts
  │       │   ├── events/useHoldNavigation.ts
  │       │   ├── constants.ts
  │       │   ├── helpers.ts
  │       │   ├── pageRegistry.ts
  │       │   ├── types.ts
  │       │   ├── useBookCoverState.ts
  │       │   └── useBookNavigation.ts
  │       └── index.ts
  ├── entities/                            # Entities layer
  │   ├── award/
  │   │   ├── model/
  │   │   │   ├── awardList.ts
  │   │   │   └── types.ts
  │   │   └── index.ts
  │   ├── history/
  │   │   ├── model/
  │   │   │   ├── artworkData.ts
  │   │   │   ├── milestonesData.ts
  │   │   │   └── timelineData.ts
  │   │   └── index.ts
  │   ├── map/
  │   │   ├── model/transportInfo.ts
  │   │   └── index.ts
  │   ├── patent/
  │   │   ├── model/patentListData.ts
  │   │   └── index.ts
  │   └── vision/
  │       ├── model/visionData.ts
  │       └── index.ts
  ├── shared/                              # Shared layer
  │   ├── assets/
  │   │   ├── fonts/                       # Pretendard & BookendBatang subset woff2 + CSS
  │   │   └── induel-icon.svg
  │   ├── constant/
  │   │   ├── company.ts                   # Company info constants
  │   │   └── index.ts
  │   ├── lib/
  │   │   ├── breakpoint/useBreakpoint.ts  # Responsive breakpoint hook
  │   │   ├── console/banner.ts            # Console branding banner
  │   │   ├── ordinal/getOrdinalSuffix.ts
  │   │   ├── scroll/smoothScrollTo.ts
  │   │   ├── three/                       # Three.js utilities
  │   │   │   ├── animation/waveAnimation.ts
  │   │   │   ├── core/
  │   │   │   │   ├── createCamera.ts
  │   │   │   │   ├── createLights.ts
  │   │   │   │   ├── createRenderer.ts
  │   │   │   │   └── createScene.ts
  │   │   │   ├── objects/
  │   │   │   │   ├── createWaveTubes.ts
  │   │   │   │   └── type.ts
  │   │   │   └── utils/attachResizeHandler.ts
  │   │   ├── useScrollLock/useScrollLock.ts
  │   │   └── useSlideGesture/useSlideGesture.ts
  │   └── ui/                              # Shared UI components
  │       ├── ImageSlider/
  │       │   ├── ui/ImageSlider.tsx
  │       │   ├── model/useSliderNavigation.ts
  │       │   ├── styles/ImageSlider.css
  │       │   └── index.ts
  │       ├── InfoCard/
  │       │   ├── ui/InfoCard.tsx
  │       │   ├── styles/InfoCard.css
  │       │   └── index.ts
  │       ├── Popup/
  │       │   ├── ui/Popup.tsx
  │       │   ├── styles/Popup.css
  │       │   └── index.ts
  │       └── SectionTitle/
  │           ├── SectionTitle.tsx
  │           ├── SectionTitle.css
  │           └── index.ts
  └── test/
      ├── setup.ts                         # Vitest global setup
      └── vitest.d.ts
```
