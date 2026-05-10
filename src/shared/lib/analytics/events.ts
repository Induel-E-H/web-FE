import ReactGA from 'react-ga4';

export const trackNavLogoClick = () => ReactGA.event('nav_logo_click');

export const trackNavMenuClick = (section: string) =>
  ReactGA.event('nav_menu_click', { section });

export const trackAwardYearFilter = (year: string | number) =>
  ReactGA.event('award_year_filter', { year: String(year) });

export const trackAwardCardOpen = (title: string) =>
  ReactGA.event('award_card_open', { title });

export const trackPatentCardOpen = (title: string) =>
  ReactGA.event('patent_card_open', { title });

export const trackHistoryCoverOpen = (cover: 'front' | 'back') =>
  ReactGA.event('history_cover_open', { cover });

export const trackHistoryPageTurn = (direction: 'forward' | 'backward') =>
  ReactGA.event('history_page_turn', { direction });

export const trackHistoryCategoryChange = (category: string) =>
  ReactGA.event('history_category_change', { category });

export const trackHistoryArtworkGalleryOpen = (title: string) =>
  ReactGA.event('history_artwork_gallery_open', { title });

export const trackMapLoadSuccess = () => ReactGA.event('map_load_success');

export const trackMapLoadFailure = () => ReactGA.event('map_load_failure');

export const trackPrivacyPolicyClick = () =>
  ReactGA.event('privacy_policy_click');

export const trackBrowserUnsupported = () =>
  ReactGA.event('browser_unsupported', { user_agent: navigator.userAgent });

export const trackBrowserLimited = () =>
  ReactGA.event('browser_limited', { user_agent: navigator.userAgent });
