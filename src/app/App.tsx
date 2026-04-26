import { Route, Routes } from 'react-router-dom';

import { Home } from '@pages/home';
import { PrivacyPolicy } from '@pages/privacy-policy';
import { useGoogleAnalytics } from '@shared/lib/analytics';

function App() {
  useGoogleAnalytics();

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/privacy_policy' element={<PrivacyPolicy />} />
    </Routes>
  );
}

export default App;
