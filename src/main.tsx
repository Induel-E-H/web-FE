import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@app/App.tsx';
import '@app/styles/index.css';
import { UnsupportedBrowser } from '@pages/unsupported-browser';
import { getBrowserSupport } from '@shared/lib/browserCompat';
import { printAsciiBanner } from '@shared/lib/console';
import { MotionConfig } from 'framer-motion';

printAsciiBanner();

const browserSupport = getBrowserSupport();
const root = createRoot(document.getElementById('root')!);

if (browserSupport === 'unsupported') {
  root.render(<UnsupportedBrowser />);
} else {
  root.render(
    <StrictMode>
      <BrowserRouter>
        {browserSupport === 'limited' ? (
          <MotionConfig reducedMotion='always'>
            <App />
          </MotionConfig>
        ) : (
          <App />
        )}
      </BrowserRouter>
    </StrictMode>,
  );
}
