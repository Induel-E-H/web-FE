import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Home } from '@pages/home';
import { PrivacyPolicy } from '@pages/privacy-policy';
import { trackBrowserLimited, useGoogleAnalytics } from '@shared/lib/analytics';
import { getBrowserSupport } from '@shared/lib/browserCompat';

function App() {
  useGoogleAnalytics();

  useEffect(() => {
    if (getBrowserSupport() === 'limited') trackBrowserLimited();
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/privacy_policy' element={<PrivacyPolicy />} />
    </Routes>
  );
}

export default App;
