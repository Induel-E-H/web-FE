import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from '@pages/home';

const PrivacyPolicy = lazy(() => import('@pages/privacy-policy'));

const GA_ID = 'G-JMQZ9VKYZ6';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route
        path='/privacy_policy'
        element={
          <Suspense>
            <PrivacyPolicy />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
