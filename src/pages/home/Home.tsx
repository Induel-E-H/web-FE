import { lazy, type ReactNode, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { smoothScrollTo } from '@shared/lib/scroll/smoothScrollTo';
import { Header } from '@widgets/header/ui/Header';
import Hero from '@widgets/hero';

const Vision = lazy(() =>
  import('@widgets/vision').then((m) => ({ default: m.Vision })),
);
const History = lazy(() => import('@widgets/history'));
const Award = lazy(() => import('@widgets/award'));
const Patent = lazy(() => import('@widgets/patent'));
const Map = lazy(() => import('@widgets/map'));
const Footer = lazy(() =>
  import('@widgets/footer').then((m) => ({ default: m.Footer })),
);

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

function Home() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const timer = setTimeout(() => {
        smoothScrollTo(state.scrollTo!);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (DEV_WIDGET) {
    const widget = DEV_WIDGET_MAP[DEV_WIDGET];
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
          <p>⚠️ 위젯 &quot;{DEV_WIDGET}&quot;을 찾을 수 없습니다.</p>
          <p>등록된 위젯: {Object.keys(DEV_WIDGET_MAP).join(', ')}</p>
          <p>DEV_WIDGET_MAP에 등록 후 다시 실행하세요.</p>
        </div>
      );
    }
    return (
      <>
        {DEV_WIDGET !== 'footer' ? <Header /> : null}
        <Suspense fallback={null}>{widget}</Suspense>
      </>
    );
  }

  if (isStaging) {
    return <Hero showScrollArrow={false} />;
  }

  return (
    <>
      <Header />
      <Hero showScrollArrow={isProduction} />
      <Suspense fallback={null}>
        <Vision />
        <History />
        <Award />
        <Patent />
        <Map />
        <Footer />
      </Suspense>
    </>
  );
}

export default Home;
