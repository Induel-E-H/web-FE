# History Widget Refactoring Design Spec

## Overview

history/ 위젯 코드를 FSD 패턴에 맞게 리팩토링하고, 슬라이더를 shared 컴포넌트로 분리하며, 코드 품질을 개선한다.

## 1. Directory Structure

### shared/ui/ImageSlider (신규)

```
src/shared/ui/
└── ImageSlider/
    ├── index.ts                          # re-export: ImageSlider, useSliderNavigation
    ├── ui/ImageSlider.tsx
    ├── model/useSliderNavigation.ts       # 순수 UI 상태 훅 (domain-agnostic)
    └── styles/ImageSlider.css
```

> `useSliderNavigation`은 슬라이드 인덱스와 홀드 타이머만 관리하는 순수 UI 로직 훅이다. entities/, features/, widgets/ 레이어를 import하지 않는다.

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
  alt?: string; // 이미지 alt 접두사
  imageRadius?: string; // 개별 이미지 border-radius (default: '10px')
}
```

> `imageRadius`는 inline style로 적용. 소비자마다 다른 라운드를 원할 수 있어 prop으로 노출한다.

### useSliderNavigation Hook

```typescript
function useSliderNavigation(totalSlides: number): {
  currentIndex: number;
  goToPrevSlide: () => void;
  goToNextSlide: () => void;
  startContinuousSlide: (fn: () => void) => void;
  stopContinuousSlide: () => void;
};
```

- `totalSlides`: 전체 슬라이드 수
- 홀드 간격(400ms), 슬라이드 전환 시간(0.4s)은 CSS + 훅 내부에서 관리 (prop 불필요)

### Barrel Export (index.ts)

```typescript
export { ImageSlider } from './ui/ImageSlider';
export { useSliderNavigation } from './model/useSliderNavigation';
```

### Internal Structure

- **ImageSlider** renders: track (`translateX`), slides, nav buttons (`IoIosArrowBack`/`IoIosArrowForward`), indicator (`currentIndex + 1 / total`)
- Nav buttons & indicator: hover 시 표시 (opacity transition)
- Slide transition: CSS `transition: transform 0.4s cubic-bezier(...)` (하드코딩, prop 불필요)

### Responsibilities

- Slider manages: slide index, hold navigation, slide transition animation
- Slider does NOT manage: keyboard events, popup overlay, body scroll lock

## 3. ImageGalleryPopup ↔ ImageSlider Integration

### Render Structure

```tsx
// ImageGalleryPopup.tsx
function ImageGalleryPopup({ title, images, onClose }) {
  const { currentIndex, goToPrevSlide, goToNextSlide } = useSliderNavigation(images.length);

  // 키보드 이벤트는 팝업에서 처리
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevSlide();
      if (e.key === 'ArrowRight') goToNextSlide();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, goToPrevSlide, goToNextSlide]);

  return (
    <div className='image-gallery-overlay' ...>
      <div className='image-gallery-popup'>
        <header>...</header>
        <hr />
        <ImageSlider images={images} alt={title} />
      </div>
    </div>
  );
}
```

- `ImageSlider`는 `useSliderNavigation`의 상태를 내부에서 사용
- 키보드 이벤트(Esc, ←, →)는 팝업이 처리하므로, 팝업도 `useSliderNavigation`을 호출하여 `goToPrevSlide`/`goToNextSlide` 참조를 얻는다
- **중요**: `useSliderNavigation`은 ImageSlider 내부에서 호출하되, 팝업이 키보드용으로도 같은 인스턴스가 필요하다. 따라서 **ImageSlider가 `ref`를 통해 `goToPrevSlide`/`goToNextSlide`를 imperative하게 노출하는 방식** 또는 **팝업이 훅을 호출하고 ImageSlider에 `currentIndex`를 prop으로 전달하는 방식** 중 선택 필요.

**선택: 팝업이 훅을 호출하고 ImageSlider에 prop으로 전달**

```tsx
// ImageGalleryPopup.tsx
const slider = useSliderNavigation(images.length);

// ImageSlider는 controlled component로 동작
<ImageSlider
  images={images}
  alt={title}
  currentIndex={slider.currentIndex}
  onPrev={() => slider.startContinuousSlide(slider.goToPrevSlide)}
  onNext={() => slider.startContinuousSlide(slider.goToNextSlide)}
  onRelease={slider.stopContinuousSlide}
/>;
```

이렇게 하면 ImageSlider는 순수 렌더링 컴포넌트가 되고, 상태는 소비자가 제어한다.

### ContentPage.tsx에서 팝업 렌더링

```tsx
// ContentPage.tsx
{
  showGallery &&
    createPortal(
      <ImageGalleryPopup
        title={item.title}
        images={getAllContentImages(index)}
        onClose={() => setShowGallery(false)}
      />,
      document.body,
    );
}
```

`createPortal`은 ContentPage에서 계속 사용한다.

## 4. Constants Extraction

### widgets/history/model/constants.ts (추가)

```typescript
export const FLIP_DURATION = 800;
export const RAPID_FLIP_DURATION = 300;
export const MIN_RAPID_FLIPS = 3; // 기존 buildRapidSteps.ts의 변수명 유지
```

현재 useFlipAnimation.ts, useRapidFlip.ts, buildRapidSteps.ts에 하드코딩된 값들을 상수로 추출.

## 5. File Split: Content.tsx

### Before

`Content.tsx` 하나에 4개 컴포넌트:

- SubTitleContent
- ImageGalleryPopup
- ContentItem
- ContentPage

### After

- `ContentPage.tsx`: ContentPage + ContentItem + SubTitleContent
- `ImageGalleryPopup.tsx`: ImageGalleryPopup (shared ImageSlider 사용)

## 6. ESLint Warnings Fix

### Warning 1: Missing dependency `onClose`

```typescript
// ImageGalleryPopup.tsx
useEffect(() => {
  // keyboard event handlers
}, [onClose, goToPrevSlide, goToNextSlide]);
```

### Warning 2: Array index as key

```typescript
// ImageSlider.tsx — 이미지 src 경로가 고유하므로 key로 사용
images.map((src) => <div key={src}>...</div>)
```

## 7. CSS Renaming

| Before                                        | After                     |
| --------------------------------------------- | ------------------------- |
| `Content.css`                                 | `ContentPage.css`         |
| `ContentPopup.css`                            | `ImageGalleryPopup.css`   |
| `@import './ContentPopup.css'` in Content.css | removed (separate import) |
| `.gallery-overlay`                            | `.image-gallery-overlay`  |
| `.gallery-popup`                              | `.image-gallery-popup`    |
| `.gallery-popup__*`                           | `.image-gallery-popup__*` |

> BEM block을 `image-gallery-popup`으로 하여 컴포넌트명 `ImageGalleryPopup`과 일치시킨다.

## 8. Naming Improvements

| Before                      | After                                          | Reason         |
| --------------------------- | ---------------------------------------------- | -------------- |
| `handlePrev` / `handleNext` | `goToPrevSlide` / `goToNextSlide`              | action clarity |
| `startHold` / `stopHold`    | `startContinuousSlide` / `stopContinuousSlide` | intent clarity |
| `holdTimerRef`              | `continuousSlideTimerRef`                      | consistency    |

## 9. Code Cleanup

- Remove unused `.gallery-popup__slide-inner` CSS if present
- Remove `@import './ContentPopup.css'` from Content.css
- Remove dead code from previous refactoring iterations

## 10. Out of Scope

- useBookNavigation hook structure (유지, 네이밍/상수만 정리)
- BookPage.tsx, History.tsx structure (변경 없음)
- HistoryBook.css (변경 없음)
- 3D flip animation logic (변경 없음)
