# History Widget Refactoring Design Spec

## Overview

history/ 위젯 코드를 FSD 패턴에 맞게 리팩토링하고, 슬라이더를 shared 컴포넌트로 분리하며, 코드 품질을 개선한다.

## 1. Directory Structure

### shared/ui/ImageSlider (신규)

```
src/shared/ui/
└── ImageSlider/
    ├── index.ts
    ├── ui/ImageSlider.tsx
    ├── model/
    │   ├── useSliderNavigation.ts
    │   └── constants.ts
    └── styles/ImageSlider.css
```

### widgets/history (변경)

```
src/widgets/history/
├── index.ts
├── ui/
│   ├── History.tsx
│   ├── BookPage.tsx
│   ├── ContentPage.tsx              # Content.tsx에서 이름 변경
│   ├── ImageGalleryPopup.tsx        # Content.tsx에서 분리
│   ├── List.tsx
│   ├── Timeline.tsx
│   ├── Award.tsx
│   └── BookPageTitle.tsx
├── model/
│   ├── types.ts
│   ├── constants.ts                 # 매직넘버 상수 추가
│   ├── helpers.ts
│   ├── pageRegistry.ts
│   ├── useBookNavigation.ts
│   ├── animation/
│   │   ├── useFlipAnimation.ts
│   │   ├── useRapidFlip.ts
│   │   └── buildRapidSteps.ts
│   └── events/
│       └── useHoldNavigation.ts
├── styles/
│   ├── History.css
│   ├── HistoryBook.css
│   ├── ContentPage.css              # Content.css에서 이름 변경
│   ├── ImageGalleryPopup.css        # ContentPopup.css에서 이름 변경
│   ├── List.css
│   ├── Timeline.css
│   ├── Award.css
│   └── BookPageTitle.css
└── assets/
```

## 2. ImageSlider Component API

### Props

```typescript
interface ImageSliderProps {
  images: string[];
  alt?: string;
  imageRadius?: string; // default: '10px'
  holdInterval?: number; // default: 400ms
  slideTransitionDuration?: number; // default: 400ms
}
```

### Internal Structure

- **useSliderNavigation** hook: `currentIndex`, `goToPrevSlide`, `goToNextSlide`, `startContinuousSlide`, `stopContinuousSlide`
- **ImageSlider** component: track (translateX), slides, nav buttons (IoIosArrowBack/Forward), indicator (currentIndex + 1 / total), hover show/hide

### Responsibilities

- Slider manages: slide index, hold navigation, slide transition animation
- Slider does NOT manage: keyboard events, popup overlay, body scroll lock

### Constants (shared/ui/ImageSlider/model/constants.ts)

```typescript
export const DEFAULT_HOLD_INTERVAL = 400;
export const DEFAULT_SLIDE_DURATION = 400;
```

## 3. Constants Extraction

### widgets/history/model/constants.ts (추가)

```typescript
export const FLIP_DURATION = 800;
export const RAPID_FLIP_DURATION = 300;
export const MIN_RAPID_STEPS = 3;
```

현재 useFlipAnimation.ts, useRapidFlip.ts, buildRapidSteps.ts에 하드코딩된 값들을 상수로 추출.

## 4. File Split: Content.tsx

### Before

`Content.tsx` 하나에 4개 컴포넌트:

- SubTitleContent
- ImageGalleryPopup
- ContentItem
- ContentPage

### After

- `ContentPage.tsx`: ContentPage + ContentItem + SubTitleContent
- `ImageGalleryPopup.tsx`: ImageGalleryPopup (shared ImageSlider 사용)

## 5. ESLint Warnings Fix

### Warning 1: Missing dependency `onClose`

```typescript
// ImageGalleryPopup.tsx
useEffect(() => {
  // keyboard event handlers
}, [onClose, goToPrevSlide, goToNextSlide]);
```

### Warning 2: Array index as key

```typescript
// ImageSlider.tsx
images.map((src) => <div key={src}>...</div>)
```

## 6. CSS Renaming

| Before                                        | After                     |
| --------------------------------------------- | ------------------------- |
| `Content.css`                                 | `ContentPage.css`         |
| `ContentPopup.css`                            | `ImageGalleryPopup.css`   |
| `@import './ContentPopup.css'` in Content.css | removed (separate import) |
| `.gallery-overlay`                            | `.image-gallery-overlay`  |
| `.gallery-popup`                              | `.image-gallery-popup`    |
| `.gallery-popup__*`                           | `.image-gallery__*`       |

## 7. Naming Improvements

| Before                      | After                                          | Reason         |
| --------------------------- | ---------------------------------------------- | -------------- |
| `handlePrev` / `handleNext` | `goToPrevSlide` / `goToNextSlide`              | action clarity |
| `startHold` / `stopHold`    | `startContinuousSlide` / `stopContinuousSlide` | intent clarity |
| `holdTimerRef`              | `continuousSlideTimerRef`                      | consistency    |

## 8. Code Cleanup

- Remove unused `.gallery-popup__slide-inner` CSS if present
- Remove `@import './ContentPopup.css'` from Content.css
- Remove dead code from previous refactoring iterations

## 9. Out of Scope

- useBookNavigation hook structure (유지, 네이밍/상수만 정리)
- BookPage.tsx, History.tsx structure (변경 없음)
- HistoryBook.css (변경 없음)
- 3D flip animation logic (변경 없음)
