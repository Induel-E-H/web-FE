import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

export const GA_ID = 'G-JMQZ9VKYZ6';

export function initGA() {
  ReactGA.initialize(GA_ID);
}

export function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location.pathname]);
}
