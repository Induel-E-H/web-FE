import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { UsageGuide } from './UsageGuide';

describe('UsageGuide', () => {
  it('제목을 렌더링한다', () => {
    render(<UsageGuide landscape />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('가로(PC) 보기는 클릭·잡고 드래그·꾹 누르기·키보드·목차 이동을 안내한다', () => {
    render(<UsageGuide landscape />);
    ['클릭', '잡고 드래그', '꾹 누르기', '키보드', '목차로 이동'].forEach(
      (label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      },
    );
    expect(screen.getByText(/← → 로 한 장씩/)).toBeInTheDocument();
    expect(screen.queryByText('밀어서 넘기기')).not.toBeInTheDocument();
  });

  it('반쪽 보기(태블릿/모바일)는 밀어서 넘기기·버튼·꾹 누르기·목차 이동을 안내한다', () => {
    render(<UsageGuide landscape={false} />);
    ['밀어서 넘기기', '버튼', '꾹 누르기', '목차로 이동'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    expect(screen.queryByText('클릭')).not.toBeInTheDocument();
    expect(screen.queryByText('키보드')).not.toBeInTheDocument();
  });
});
