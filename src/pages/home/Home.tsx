import { type ReactNode } from 'react';

import Award from '@widgets/award';
import { Footer } from '@widgets/footer';
import Hero from '@widgets/hero';
import History from '@widgets/history';
import Map from '@widgets/map';
import { Vision } from '@widgets/vision';

const DEV_WIDGET = import.meta.env.VITE_DEV_WIDGET;
const isStaging = import.meta.env.MODE === 'staging';

const WIDGET_MAP: Record<string, ReactNode> = {
  hero: <Hero />,
  vision: <Vision />,
  history: <History />,
  award: <Award />,
  // patent: <Patent />,
  map: <Map />,
  footer: <Footer />,
};

function Home() {
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
    return <>{widget}</>;
  }

  if (isStaging) {
    return <Hero />;
  }

  return (
    <>
      <Hero />
      <Vision />
      <History />
      <Award />
      {/* <Patent /> */}
      <Map />
      <Footer />
    </>
  );
}

export default Home;
