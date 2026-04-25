import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from '@pages/home';
import { useGoogleAnalytics } from '@shared/lib/analytics/useGoogleAnalytics';

const PrivacyPolicy = lazy(() => import('@pages/privacy-policy'));

function App() {
  useGoogleAnalytics();

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
