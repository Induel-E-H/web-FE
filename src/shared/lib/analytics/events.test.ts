import ReactGA from 'react-ga4';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as events from './events';

vi.mock('react-ga4', () => ({
  default: { event: vi.fn() },
}));

describe('analytics events', () => {
  beforeEach(() => {
    vi.mocked(ReactGA.event).mockClear();
  });

  it.each([
    ['trackNavLogoClick', () => events.trackNavLogoClick(), ['nav_logo_click']],
    [
      'trackNavMenuClick',
      () => events.trackNavMenuClick('연혁'),
      ['nav_menu_click', { section: '연혁' }],
    ],
    [
      'trackAwardYearFilter',
      () => events.trackAwardYearFilter(2014),
      ['award_year_filter', { year: '2014' }],
    ],
    [
      'trackAwardCardOpen',
      () => events.trackAwardCardOpen('최우수상'),
      ['award_card_open', { title: '최우수상' }],
    ],
    [
      'trackPatentCardOpen',
      () => events.trackPatentCardOpen('의자'),
      ['patent_card_open', { title: '의자' }],
    ],
    [
      'trackHistoryCoverOpen',
      () => events.trackHistoryCoverOpen('back'),
      ['history_cover_open', { cover: 'back' }],
    ],
    [
      'trackHistoryPageTurn',
      () => events.trackHistoryPageTurn('forward'),
      ['history_page_turn', { direction: 'forward' }],
    ],
    [
      'trackHistoryCategoryChange',
      () => events.trackHistoryCategoryChange('Content'),
      ['history_category_change', { category: 'Content' }],
    ],
    [
      'trackHistoryArtworkGalleryOpen',
      () => events.trackHistoryArtworkGalleryOpen('부산시청사'),
      ['history_artwork_gallery_open', { title: '부산시청사' }],
    ],
    [
      'trackMapLoadSuccess',
      () => events.trackMapLoadSuccess(),
      ['map_load_success'],
    ],
    [
      'trackMapLoadFailure',
      () => events.trackMapLoadFailure(),
      ['map_load_failure'],
    ],
    [
      'trackPrivacyPolicyClick',
      () => events.trackPrivacyPolicyClick(),
      ['privacy_policy_click'],
    ],
    [
      'trackBrowserUnsupported',
      () => events.trackBrowserUnsupported(),
      ['browser_unsupported', { user_agent: navigator.userAgent }],
    ],
    [
      'trackBrowserLimited',
      () => events.trackBrowserLimited(),
      ['browser_limited', { user_agent: navigator.userAgent }],
    ],
  ] as const)('%s는 정해진 GA 이벤트를 보낸다', (_, track, expected) => {
    track();
    expect(ReactGA.event).toHaveBeenCalledWith(...expected);
  });
});
