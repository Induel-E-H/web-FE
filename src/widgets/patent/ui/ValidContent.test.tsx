import { PATENT_VALID_LIST } from '@entities/patent';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PatentValidContent } from './ValidContent';

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: unknown }) => children,
  motion: new Proxy({} as Record<string, unknown>, {
    get: (_, key: string) => key,
  }),
}));

describe('PatentValidContent', () => {
  it('유효 특허 건수가 표시된다', () => {
    render(<PatentValidContent />);
    expect(
      screen.getByText(`유효 특허증 (${PATENT_VALID_LIST.length}건)`),
    ).toBeInTheDocument();
  });

  it('PATENT_VALID_LIST 개수만큼 카드가 렌더링된다', () => {
    const { container } = render(<PatentValidContent />);
    expect(container.querySelectorAll('button.patent__card')).toHaveLength(
      PATENT_VALID_LIST.length,
    );
  });

  it('각 카드에 특허 제목이 표시된다', () => {
    render(<PatentValidContent />);
    PATENT_VALID_LIST.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  describe('팝업 열기/닫기', () => {
    it('카드 클릭 시 팝업이 열린다', () => {
      render(<PatentValidContent />);
      const cards = screen.getAllByRole('button');
      fireEvent.click(cards[0]);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('팝업이 열린 상태에서 닫기 버튼 클릭 시 팝업이 닫힌다', () => {
      render(<PatentValidContent />);
      const cards = screen.getAllByRole('button');
      fireEvent.click(cards[0]);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '닫기' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
