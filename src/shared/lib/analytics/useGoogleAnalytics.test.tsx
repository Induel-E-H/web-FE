import ReactGA from 'react-ga4';
import { MemoryRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGoogleAnalytics } from './useGoogleAnalytics';

vi.mock('react-ga4', () => ({
  default: { initialize: vi.fn(), send: vi.fn() },
}));

function TestComponent() {
  useGoogleAnalytics();
  return null;
}

function renderInRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('useGoogleAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('마운트 시 ReactGA.initialize가 호출된다', () => {
    renderInRouter(<TestComponent />);
    expect(ReactGA.initialize).toHaveBeenCalledOnce();
  });

  it('올바른 GA ID로 초기화된다', () => {
    renderInRouter(<TestComponent />);
    expect(ReactGA.initialize).toHaveBeenCalledWith('G-JMQZ9VKYZ6');
  });

  it('리렌더링 시 initialize가 중복 호출되지 않는다', () => {
    const { rerender } = renderInRouter(<TestComponent />);
    rerender(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>,
    );
    expect(ReactGA.initialize).toHaveBeenCalledOnce();
  });

  it('마운트 시 pageview 이벤트가 전송된다', () => {
    renderInRouter(<TestComponent />);
    expect(ReactGA.send).toHaveBeenCalledWith({
      hitType: 'pageview',
      page: '/',
    });
  });
});
