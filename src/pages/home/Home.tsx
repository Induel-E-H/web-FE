import { type ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { smoothScrollTo } from '@shared/lib/scroll/smoothScrollTo';
import Award from '@widgets/award';
import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header/ui/Header';
import Hero from '@widgets/hero';
import History from '@widgets/history';
import Map from '@widgets/map';
import Patent from '@widgets/patent';
import { Vision } from '@widgets/vision';

const DEV_WIDGET = import.meta.env.VITE_DEV_WIDGET;
const isStaging = import.meta.env.MODE === 'staging';

const WIDGET_MAP: Record<string, ReactNode> = {
  header: <Header />,
  hero: <Hero />,
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
    const widget = WIDGET_MAP[DEV_WIDGET];
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
          <p>등록된 위젯: {Object.keys(WIDGET_MAP).join(', ')}</p>
          <p>WIDGET_MAP에 등록 후 다시 실행하세요.</p>
        </div>
      );
    }
    return (
      <>
        {DEV_WIDGET !== 'footer' ? <Header /> : null}
        {widget}
      </>
    );
  }

  if (isStaging) {
    return <Hero />;
  }

  return (
    <>
      <Header />
      <Hero />
      <Vision />
      <History />
      <Award />
      <Patent />
      <Map />
      <Footer />
    </>
  );
}

export default Home;
