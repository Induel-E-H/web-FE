import { lazy, type ReactNode, Suspense, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { smoothScrollTo } from '@shared/lib/scroll';
import { Header } from '@widgets/header';
import { Hero } from '@widgets/hero';
import { Vision } from '@widgets/vision';

import './styles/Home.css';

const widgetLoaders = {
  History: () =>
    import('@widgets/history').then((m) => ({ default: m.History })),
  Award: () => import('@widgets/award').then((m) => ({ default: m.Award })),
  Patent: () => import('@widgets/patent').then((m) => ({ default: m.Patent })),
  Map: () => import('@widgets/map').then((m) => ({ default: m.Map })),
  Footer: () => import('@widgets/footer').then((m) => ({ default: m.Footer })),
};

const History = lazy(widgetLoaders.History);
const Award = lazy(widgetLoaders.Award);
const Patent = lazy(widgetLoaders.Patent);
const Map = lazy(widgetLoaders.Map);
const Footer = lazy(widgetLoaders.Footer);

function prefetchLazyWidgets() {
  Object.values(widgetLoaders).forEach((load) => void load());
}

const DEV_WIDGET = import.meta.env.VITE_DEV_WIDGET;
const isStaging = import.meta.env.MODE === 'staging';
const isProduction = import.meta.env.MODE === 'production';

const DEV_WIDGET_MAP: Record<string, ReactNode> = {
  header: <Header />,
  hero: <Hero showScrollArrow={false} />,
  vision: <Vision />,
  history: <History />,
  award: <Award />,
  patent: <Patent />,
  map: <Map />,
  footer: <Footer />,
};

function DevWidgetView({ name }: { name: string }) {
  const widget = DEV_WIDGET_MAP[name];
  if (!widget) {
    return (
      <div
        style={{
          padding: '2rem',
          fontFamily: 'monospace',
          color: '#fff',
          background: '#111',
          minHeight: '100vh',
        }}
      >
        <p>⚠️ 위젯 &quot;{name}&quot;을 찾을 수 없습니다.</p>
        <p>등록된 위젯: {Object.keys(DEV_WIDGET_MAP).join(', ')}</p>
        <p>DEV_WIDGET_MAP에 등록 후 다시 실행하세요.</p>
      </div>
    );
  }
  return (
    <>
      {name !== 'footer' ? <Header /> : null}
      <Suspense fallback={null}>{widget}</Suspense>
    </>
  );
}

function LazySection({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<div className={`home__fallback--${name}`} />}>
      {children}
    </Suspense>
  );
}

export function Home() {
  const location = useLocation();
  const prefetchTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const timer = setTimeout(() => {
        smoothScrollTo(state.scrollTo!);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const el = prefetchTriggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        prefetchLazyWidgets();
        observer.disconnect();
      },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (DEV_WIDGET) {
    return <DevWidgetView name={DEV_WIDGET} />;
  }

  if (isStaging) {
    return <Hero showScrollArrow={false} />;
  }

  return (
    <>
      <a href='#main-content' className='skip-link'>
        본문으로 바로 가기
      </a>
      <Header />
      <main id='main-content'>
        <Hero showScrollArrow={isProduction} />
        <Vision />
        <div ref={prefetchTriggerRef} aria-hidden='true' />
        <LazySection name='history'>
          <History />
        </LazySection>
        <LazySection name='award'>
          <Award />
        </LazySection>
        <LazySection name='patent'>
          <Patent />
        </LazySection>
        <LazySection name='map'>
          <Map />
        </LazySection>
        <LazySection name='footer'>
          <Footer />
        </LazySection>
      </main>
    </>
  );
}
